import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { ambiente, colecoes } from "../lib/catalogo";
import { colecoesEnumeradas, paresEnumerados } from "../lib/listagem/rotas";
import { produtosDaColecao } from "../lib/listagem/conteudo";
import { buscar, encerrarServidor, semScripts, servidorDeTeste } from "./helpers/servidor";

// Seam 2 — the rendered route. Everything here is asserted against a built app
// served locally, because the contract under test is a property of the response.
beforeAll(async () => {
  await servidorDeTeste();
}, 300_000);

afterAll(encerrarServidor);

// rotas.md §7 — the two things that must never swap
describe("the status contract", () => {
  test("a room landing is a 200", async () => {
    for (const slug of ["sala", "quarto", "cozinha", "escritorio"]) {
      expect((await buscar(`/${slug}`)).status).toBe(200);
    }
  });

  test("every enumerated pair is a 200", async () => {
    for (const par of paresEnumerados()) {
      const resposta = await buscar(`/${par.ambiente}/${par.tipo}`);
      expect({ par, status: resposta.status }).toEqual({ par, status: 200 });
    }
  });

  // The pair was never declared, and both halves of it are real — which is
  // exactly the case a request-time check would be tempted to answer with an
  // empty grid. A 200 here would put a soft-404 into the index.
  test("/cozinha/sofas is a real 404, not an empty grid", async () => {
    const resposta = await buscar("/cozinha/sofas");
    expect(resposta.status).toBe(404);
    expect(semScripts(resposta.html)).not.toMatch(/\d+ PEÇAS/);
  });

  test("an unenumerated pair is a 404 whichever half is wrong", async () => {
    expect((await buscar("/sala/camas")).status).toBe(404);
    expect((await buscar("/sala/redes")).status).toBe(404);
    expect((await buscar("/varanda/sofas")).status).toBe(404);
  });

  test("a room that does not exist is a 404", async () => {
    expect((await buscar("/varanda")).status).toBe(404);
  });

  test("/produtos is a 200, with and without the room cut", async () => {
    expect((await buscar("/produtos")).status).toBe(200);
    expect((await buscar("/produtos?ambiente=quarto")).status).toBe(200);
  });

  test("every coleção is a 200", async () => {
    for (const slug of colecoesEnumeradas()) {
      const resposta = await buscar(`/colecoes/${slug}`);
      expect({ slug, status: resposta.status }).toEqual({ slug, status: 200 });
    }
  });

  // rotas.md's Deliberate omissions: the index was refused as a thin page, and
  // the segment stays reserved. A 200 here would be the stub the map ruled out.
  test("/colecoes has no index, and says so with a 404", async () => {
    const resposta = await buscar("/colecoes");
    expect(resposta.status).toBe(404);
    expect(semScripts(resposta.html)).not.toMatch(/\d+ PEÇAS/);
  });

  test("a coleção that does not exist is a 404 with the store's chrome", async () => {
    const resposta = await buscar("/colecoes/jatoba");
    expect(resposta.status).toBe(404);
    expect(semScripts(resposta.html)).toContain("Não há nada neste endereço.");
    expect(semScripts(resposta.html)).toContain("CNPJ");
  });

  // The pair is refused **before routing** (`proxy.ts`), which is what
  // keeps the 404 the store's own page rather than Next's minimal error
  // document: a `notFound()` raised during a render is served outside the root
  // layout, and `rodape.md` §6 makes the footer's identification
  // non-negotiable on a public page.
  test("that 404 is the store's own page, with its chrome", async () => {
    const html = semScripts((await buscar("/cozinha/sofas")).html);
    expect(html).toContain("Não há nada neste endereço.");
    expect(html).toContain(">Canto Zen</a>");
    expect(html).toContain("CNPJ");
  });
});

// marca.md §4, restated as an assertion over what is actually served
describe("every route", () => {
  test("declares lang=pt-BR", async () => {
    for (const rota of ["/", "/sala", "/escritorio/estantes", "/cozinha/sofas"]) {
      expect((await buscar(rota)).html).toContain('lang="pt-BR"');
    }
  });
});

// catalogo.md §§1, 2, 4, 6, 7
describe("a room landing", () => {
  let html = "";

  beforeAll(async () => {
    html = semScripts((await buscar("/escritorio")).html);
  });

  test("says what the room is for, in the sentence the data authors", () => {
    const escritorio = ambiente("escritorio")!;
    expect(html).toContain(escritorio.descricao);
  });

  test("names the room, and marks it in the navbar", () => {
    expect(html).toContain("Escritório");
    expect(html).toContain("AMBIENTE");
  });

  test("exposes that room's curated tipos as landable paths", () => {
    const escritorio = ambiente("escritorio")!;
    expect(html).toContain(">TODAS<");
    for (const tipo of escritorio.tipos) {
      expect(html).toContain(`href="/escritorio/${tipo}"`);
    }
  });

  test("carries no tipo from another room's curation", () => {
    expect(html).not.toContain('href="/escritorio/sofas"');
  });

  test("opens the grid on a régua that states the count", () => {
    expect(html).toMatch(/\d+ PEÇAS/);
  });

  test("states the parcelamento once, in the annotation voice", () => {
    expect(html).toContain("10% À VISTA NO PIX · ATÉ 10X SEM JUROS");
    expect(html.match(/10% À VISTA NO PIX · ATÉ 10X SEM JUROS/g)?.length).toBe(1);
  });
});

describe("a tipo listing", () => {
  let html = "";

  beforeAll(async () => {
    html = semScripts((await buscar("/sala/sofas")).html);
  });

  test("is titled by the tipo under the room's eyebrow", () => {
    expect(html).toContain("<title>Sofás para sala | Canto Zen</title>");
    expect(html).toContain("SALA");
    expect(html).toContain("Sofás");
  });

  test("carries each card's piece, acabamento, width and disponibilidade", () => {
    expect(html).toContain("Sofá Héron");
    expect(html).toContain("LINHO CRU · L 220 CM · SOB ENCOMENDA · 6 SEMANAS");
  });

  test("carries each card's à-vista price, as the module derives it", () => {
    expect(html).toContain("R$ 8.820,00");
  });

  test("lists only that room's pieces of that tipo", () => {
    expect(html).toContain('href="/produtos/sofa-heron-linho-cru"');
    expect(html).not.toContain('href="/produtos/cama-orla-carvalho"');
  });
});

// build-spec.md, Routing — no route defines `loading.tsx` and no route streams,
// because a `not-found` inside a streamed response comes back as a 200 and the
// contract above would silently invert.
describe("the route tree", () => {
  const app = fileURLToPath(new URL("../app", import.meta.url));

  const arquivos = (dir: string): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((entrada) =>
      entrada.isDirectory()
        ? arquivos(`${dir}/${entrada.name}`)
        : [`${dir}/${entrada.name}`.slice(app.length)],
    );

  test("defines no loading.tsx anywhere", () => {
    expect(arquivos(app).filter((caminho) => /(^|\/)loading\.(tsx|ts|jsx|js)$/.test(caminho))).toEqual(
      [],
    );
  });
});

// catalogo.md §10 — the same listing with the room taken away
describe("/produtos", () => {
  let html = "";

  beforeAll(async () => {
    html = semScripts((await buscar("/produtos")).html);
  });

  test("is a system label in the annotation voice, not a Mincho title", () => {
    expect(html).toContain("<title>Todas as peças | Canto Zen</title>");
    expect(html).toContain("TODAS AS PEÇAS");
    expect(html).not.toContain("AMBIENTE</p>");
  });

  test("carries no tipo band — there is no room whose curation to show", () => {
    expect(html).not.toContain(">TODAS<");
  });

  test("offers AMBIENTE as a facet, which no room route does", async () => {
    expect(html).toContain("AMBIENTE");
    expect(html).toContain('href="/produtos?ambiente=quarto"');
    expect(semScripts((await buscar("/sala")).html)).not.toContain("?ambiente=");
  });

  test("offers no TIPO facet — type is a path segment, not a query key", () => {
    expect(html).not.toContain("?tipo=");
  });

  test("lists pieces from every room at once", async () => {
    const primeiraPagina = html;
    expect(primeiraPagina).toMatch(/\d+ PEÇAS/);
    expect(primeiraPagina).toContain('href="/produtos?pagina=2"');
  });

  test("cuts to one room on ?ambiente=, and says so in the trigger", async () => {
    const filtrada = semScripts((await buscar("/produtos?ambiente=quarto")).html);
    expect(filtrada).toContain("AMBIENTE · QUARTO");
  });
});

// catalogo.md §9 — the coleção preserves what a sort would destroy
describe("a coleção listing", () => {
  const reboco = colecoes[0]!;
  let html = "";

  beforeAll(async () => {
    html = semScripts((await buscar(`/colecoes/${reboco.slug}`)).html);
  });

  test("is titled and described by the coleção's own authored copy", () => {
    expect(html).toContain(`<title>${reboco.nome} | Canto Zen</title>`);
    expect(html).toContain("COLEÇÃO");
    expect(html).toContain(reboco.descricao);
  });

  test("states the coleção's length as its régua", () => {
    expect(html).toContain(`${reboco.produtos.length} PEÇAS`);
  });

  test("renders neither the tipo band nor the filter and sort bar", () => {
    expect(html).not.toContain(">TODAS<");
    expect(html).not.toContain("ORDENAR");
    expect(html).not.toContain("MATERIAL");
  });

  // The order in the markup is the order the coleção authored — the one thing
  // the page exists for, and the thing a sort control would offer to destroy.
  test("renders the pieces in the authored sequence", () => {
    const posicoes = produtosDaColecao(reboco.slug).map((produto) =>
      html.indexOf(`href="/produtos/${produto.slug}"`),
    );
    expect(posicoes.every((posicao) => posicao > -1)).toBe(true);
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b));
  });

  test("ignores the sort it does not support rather than erroring on it", async () => {
    const resposta = await buscar(`/colecoes/${reboco.slug}?ordem=maior-preco&cor=cru`);
    expect(resposta.status).toBe(200);
    const posicoes = produtosDaColecao(reboco.slug).map((produto) =>
      semScripts(resposta.html).indexOf(`href="/produtos/${produto.slug}"`),
    );
    expect(posicoes.every((posicao) => posicao > -1)).toBe(true);
    expect(posicoes).toEqual([...posicoes].sort((a, b) => a - b));
  });
});
