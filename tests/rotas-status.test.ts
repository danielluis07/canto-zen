import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import {
  ambiente,
  colecoes,
  conteudoHome,
  precoAVista,
  precoMontagem,
  produto,
  reais,
} from "../lib/catalogo";
import { CAMPOS_DE_SERVICO, descricaoDaHome } from "../lib/home/conteudo";
import { colecoesEnumeradas, paresEnumerados } from "../lib/listagem/rotas";
import { produtosDaColecao } from "../lib/listagem/conteudo";
import {
  acabamentosDaFamilia,
  assinatura,
  cotasDoPrincipal,
  cuidados,
  distintivoDePix,
  embalagemEmTexto,
  fechamento,
  linhasDeMedidasExtras,
  metadadosDoProduto,
  montagemDaPagina,
  parcelamentoDaPagina,
  trilha,
  trioDeMedidas,
} from "../lib/produto/conteudo";
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

// home.md — the seven sections as the document actually served. The budgets and
// the section order are asserted on the markup in `tests/home-marcacao.test.tsx`;
// what only the response can answer is the title and the description.
describe("the home", () => {
  let html = "";

  beforeAll(async () => {
    html = semScripts((await buscar("/")).html);
  });

  // rotas.md §1 — appending the brand to the brand stutters, so the one route
  // that is the brand carries no suffix.
  test("is titled by the wordmark alone, unsuffixed", () => {
    expect(html).toContain("<title>Canto Zen</title>");
    expect(html).not.toContain("<title>Canto Zen | Canto Zen</title>");
  });

  test("is described over the catalogue, counting it", () => {
    expect(html).toContain(`content="${descricaoDaHome()}"`);
  });

  test("opens on the authored piece, with its price and its cota", () => {
    const heroi = produto(conteudoHome.destaqueHome)!;
    expect(html).toContain(heroi.nome);
    expect(html).toContain(assinatura(heroi));
    expect(html).toContain(reais(precoAVista(heroi.precoTabela)));
    expect(html).toContain(`L ${heroi.medidas.largura} CM`);
    expect(html).toContain(`href="/produtos/${heroi.slug}"`);
  });

  test("offers the four ambientes and one coleção in context", () => {
    for (const slug of ["sala", "quarto", "cozinha", "escritorio"]) {
      expect(html).toContain(`href="/${slug}"`);
    }
    expect(html).toContain(`href="/colecoes/${conteudoHome.colecaoDestaque}"`);
    expect(html).toContain("6 PEÇAS");
  });

  test("states the service facts and the marcenaria claim", () => {
    for (const campo of CAMPOS_DE_SERVICO) expect(html).toContain(campo.linha);
    expect(html).toContain(conteudoHome.marcenaria.linha);
  });

  test("surfaces the editorial lane, and the way to the article it held back", () => {
    for (const slug of conteudoHome.inspiracoes) {
      expect(html).toContain(`href="/inspiracoes/${slug}"`);
    }
    expect(html).toContain("VER TODAS AS INSPIRAÇÕES");
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

// pagina-produto.md — one produto page asserted end to end.
//
// This is the seam that proves the two are connected: every figure below is
// computed here from the catálogo module and matched against what the server
// actually sent, so a page that renders a plausible-but-typed number fails.
// Everything else about pricing is tested at seam 1, where it is cheap.
describe("a produto page", () => {
  const lina = produto("poltrona-lina-linho-cru")!;
  let html = "";

  beforeAll(async () => {
    html = semScripts((await buscar(`/produtos/${lina.slug}`)).html);
  });

  test("is flat at /produtos/[slug], and an unknown slug is a real 404", async () => {
    expect((await buscar(`/produtos/${lina.slug}`)).status).toBe(200);
    const ausente = await buscar("/produtos/poltrona-que-nao-existe");
    expect(ausente.status).toBe(404);
    expect(semScripts(ausente.html)).toContain("Não há nada neste endereço.");
  });

  // The piece lists under Sala *and* Quarto, and the trail says Sala on every
  // route into it: the URL carries no path, so the breadcrumb is what
  // reconstructs one, from `ambientePrincipal` and never from the referrer.
  test("reconstructs the room from ambientePrincipal", () => {
    expect(lina.ambientes).toEqual(["sala", "quarto"]);

    const inicio = html.indexOf('<nav aria-label="Você está em"');
    const trilhaRenderizada = html.slice(inicio, html.indexOf("</nav>", inicio));

    for (const item of trilha(lina)) {
      expect(trilhaRenderizada).toContain(`>${item.rotulo}<`);
      if (item.href) expect(trilhaRenderizada).toContain(`href="${item.href}"`);
    }
    // The piece lists under Quarto too, and the trail never says so.
    expect(trilhaRenderizada).not.toContain("/quarto");
    // The current item is not a link — no icon, no chevron.
    expect(trilhaRenderizada).toContain(
      '<span aria-current="page" class="t-annotation text-ink">POLTRONA LINA',
    );
  });

  test("sets the piece's name in Mincho, with the acabamento named beside it", () => {
    expect(html).toContain('<h1 class="t-display-xl text-ink">Poltrona Lina</h1>');
    expect(html).toContain(assinatura(lina));
    expect(assinatura(lina)).toBe("LINHO CRU · POR MARINA AOKI");
  });

  test("renders the à-vista figure, the Pix badge and the parcelamento together", () => {
    expect(html).toContain(reais(precoAVista(lina.precoTabela)));
    expect(html).toContain(distintivoDePix());
    expect(html).toContain(parcelamentoDaPagina(lina)!);
    // Derived, not typed: the parcelado total is the table price and the
    // à-vista is 10% under it.
    expect(html).toContain(reais(lina.precoTabela));
  });

  test("renders the montagem price the tipo's nível derives, with its four facts", () => {
    const montagem = montagemDaPagina(lina)!;
    expect(montagem.preco).toBe(`+ ${reais(precoMontagem(lina.montagem.nivel))}`);
    expect(html).toContain(montagem.preco);
    expect(html).toContain(montagem.fatos);
    expect(html).toContain(montagem.rotulo);
  });

  test("reaches the família's siblings, with no família page existing", () => {
    for (const irmao of acabamentosDaFamilia(lina)) {
      expect(html).toContain(`href="${irmao.href}"`);
      expect(html).toContain(irmao.amostra);
    }
    expect(html).not.toContain('href="/familias');
  });

  test("states medidas as the mandatory trio plus the tipo's real extras", () => {
    expect(html).toContain("L 78 × P 82 × A 74 cm");
    for (const linha of linhasDeMedidasExtras(lina)) {
      expect(html).toContain(linha.rotulo);
      expect(html).toContain(linha.valor);
    }
  });

  test("derives Cuidados from the materials, one line each", () => {
    for (const linha of cuidados(lina)) expect(html).toContain(linha);
    expect(cuidados(lina)).toHaveLength(2);
  });

  test("names the embalagem's own dimensions in the access block", () => {
    expect(html).toContain(embalagemEmTexto(lina));
    expect(html).toContain("elevador");
  });

  test("states the production window apart from the delivery prazo", () => {
    expect(html).toContain("SOB ENCOMENDA · 4 SEMANAS");
    expect(html).toContain("a produção leva 4 semanas");
    expect(html).toContain("dias úteis");
  });

  test("carries the description as authored, in three sentences", () => {
    expect(html).toContain(lina.descricao);
  });

  test("closes on the coleção's other pieces, and on no recommendation", () => {
    const fim = fechamento(lina);
    if (fim.tipo !== "colecao") throw new Error("poltrona-lina-linho-cru is in a coleção");
    expect(html).toContain(fim.titulo);
    for (const irmao of fim.produtos) expect(html).toContain(`href="/produtos/${irmao.slug}"`);
    expect(html).not.toContain("Quem viu");
    expect(html).not.toContain("Complete o ambiente");
  });

  // marca.md §3 — the Pix badge spends one, the focus ring spends the other
  // when it appears. A hover state is not a third: it is the same rationed
  // accent, on a pointer.
  test("spends índigo exactly twice — the badge, and the focus ring", () => {
    const emRepouso = html.match(/(?<![:\w-])text-indigo\b/g) ?? [];
    expect(emRepouso).toHaveLength(1);
    expect(html).toContain('class="t-annotation text-indigo">10% À VISTA NO PIX');
  });

  // The régua reaches full expression here without blowing the ration: the cota
  // over the packshot, and the scale drawing. Both carry a real figure.
  test("spends at most two réguas, and never one without a figure", () => {
    const cotas = cotasDoPrincipal(lina);
    expect(cotas).toEqual([{ eixo: "largura", rotulo: "L 78 CM" }]);
    expect(html).toContain(">L 78 CM<");
    // The `Regua` component's own rule, counted by its hairline.
    const reguas = html.match(/absolute inset-x-0 top-\[6px\] h-px bg-ink/g) ?? [];
    expect(reguas.length).toBeLessThanOrEqual(2);
    expect(html).toContain("<svg");
  });

  // legal-copy-verification resolved this against the line: the sitewide
  // footer, the cart and the confirmation already carry the ostensive notice,
  // and a fourth repetition is the ornament this page keeps refusing.
  test("carries no arrependimento notice in the buy box", () => {
    const caixa = html.slice(html.indexOf("<h1"), html.indexOf("DESCRIÇÃO"));
    expect(caixa).toContain("COMPRAR");
    expect(caixa.toLowerCase()).not.toContain("arrepend");
    expect(caixa.toLowerCase()).not.toContain("sete dias");
  });

  // imagens.md §§4, 6 — nothing is cropped, and image loading is not a motion.
  test("crops nothing and animates no image into place", () => {
    expect(html).toContain("object-contain");
    expect(html).not.toContain("object-cover");
    expect(html).not.toContain("blur");
    expect(html).not.toContain("animate-");
    expect(html).not.toContain("IMAGEM INDISPONÍVEL");
  });

  test("puts no hover effect on any photograph", () => {
    for (const marcacao of html.match(/<img\b[^>]*>/g) ?? []) {
      expect(marcacao).not.toContain("hover:");
    }
  });

  test("is titled by the piece and described in physical facts", () => {
    const { titulo, descricao } = metadadosDoProduto(lina);
    expect(html).toContain(`<title>${titulo} | Canto Zen</title>`);
    expect(html).toContain(descricao);
    expect(descricao).not.toContain("R$");
  });
});

// The two structural cases the page has to render as states rather than skip
describe("a produto whose data exercises an empty case", () => {
  test("renders the no-assembly state for a luminária", async () => {
    const farol = produto("luminaria-de-mesa-farol-latao")!;
    expect(farol.montagem.necessaria).toBe(false);
    const html = semScripts((await buscar(`/produtos/${farol.slug}`)).html);

    expect(html).not.toContain(">MONTAGEM<");
    expect(html).not.toContain("Contratar montagem");
    expect(html).toContain("não precisa de montagem");
    // esgotado: no CTA, and no "avise-me quando chegar" behind it.
    expect(html).not.toContain(">COMPRAR<");
    expect(html).not.toContain("Avise-me");
  });

  test("renders Medidas correctly for a piece whose tipo carries no extras", async () => {
    const vela = produto("cabeceira-vela-linho-areia")!;
    expect(vela.medidasExtras).toEqual([]);
    const html = semScripts((await buscar(`/produtos/${vela.slug}`)).html);

    expect(html).toContain(">MEDIDAS<");
    expect(html).toContain(trioDeMedidas(vela.medidas));
    expect(html).toContain(embalagemEmTexto(vela));
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
