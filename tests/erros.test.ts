import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { ambientes, tipo } from "../lib/catalogo";
import { paginasDeTopo } from "../lib/listagem/rotas";
import {
  CORPO_DO_404,
  CORPO_DO_ERRO,
  TENTAR_NOVAMENTE,
  TITULO_DO_404,
  TITULO_DO_ERRO,
  recuperacao,
} from "../lib/erros/conteudo";
import { buscar, encerrarServidor, semScripts, servidorDeTeste } from "./helpers/servidor";

// `erros.md` — the surfaces the store shows when something is missing or broken.
//
// Two seams in one file, because the contract is split across them: what the
// offer *is* is a property of the taxonomy (seam 1), and whether the response
// carrying it is a real `404` is a property of the response (seam 2).
beforeAll(async () => {
  await servidorDeTeste();
}, 300_000);

afterAll(encerrarServidor);

// erros.md §1 — the register. Asserted on the strings rather than on a page,
// because these are the words themselves and not their arrangement.
describe("the register", () => {
  const copia = [TITULO_DO_404, CORPO_DO_404, TITULO_DO_ERRO, CORPO_DO_ERRO];

  test("nothing apologises and nothing exclaims", () => {
    for (const texto of copia) {
      const minusculas = texto.toLocaleLowerCase("pt-BR");
      expect(minusculas).not.toContain("desculp");
      expect(minusculas).not.toContain("ops");
      expect(texto).not.toContain("!");
    }
  });

  // Banned by name in §1.
  test("does not say `Algo deu errado`", () => {
    for (const texto of copia) expect(texto).not.toContain("Algo deu errado");
  });

  // §2.1 — `404` never appears as decoration; the body explains the store's
  // design rather than reporting a failure.
  test("the 404 copy never prints the number", () => {
    expect(`${TITULO_DO_404} ${CORPO_DO_404}`).not.toContain("404");
  });
});

// erros.md §2.2 — a different offer, never a different claim about what the
// reader meant.
describe("the recovery block", () => {
  test("offers the four ambientes and the flat catalogue when the room is unknown", () => {
    for (const segmento of [undefined, null, "", "varanda", "colecoes", "politicas"]) {
      const bloco = recuperacao(segmento);
      expect(bloco.titulo).toBe("CONTINUE POR AQUI");
      expect(bloco.ofertas).toEqual(ambientes.map((a) => ({ label: a.label, href: `/${a.slug}` })));
      expect(bloco.saida).toEqual({ label: "VER TODAS AS PEÇAS", href: "/produtos" });
    }
  });

  // The case a shopper actually reaches by trimming or guessing a URL. The
  // offer is that room's real tipos — never the four ambientes.
  test("offers the room's own tipos when the first segment is a real ambiente", () => {
    const bloco = recuperacao("sala");
    expect(bloco.titulo).toBe("TIPOS EM SALA");
    expect(bloco.ofertas.map((o) => o.label)).toEqual([
      "Sofás",
      "Poltronas",
      "Mesas de centro",
      "Mesas de jantar",
      "Racks e estantes",
      "Aparadores",
    ]);
    expect(bloco.saida).toEqual({ label: "VER TUDO EM SALA", href: "/sala" });
  });

  test("reads the taxonomy for every room, and links only enumerated pairs", () => {
    for (const sala of ambientes) {
      const bloco = recuperacao(sala.slug);
      expect({ sala: sala.slug, ofertas: bloco.ofertas }).toEqual({
        sala: sala.slug,
        ofertas: sala.tipos.map((slug) => ({
          label: tipo(slug)?.label ?? slug,
          href: `/${sala.slug}/${slug}`,
        })),
      });
      expect(bloco.saida.href).toBe(`/${sala.slug}`);
    }
  });

  // The whole of the "smarter 404": the copy above the block is byte-identical
  // in both cases, and nothing here claims to know what was meant.
  test("makes no claim about what the reader meant", () => {
    for (const bloco of [recuperacao("sala"), recuperacao(null)]) {
      const texto = [bloco.titulo, bloco.saida.label].join(" ").toLocaleLowerCase("pt-BR");
      expect(texto).not.toContain("você quis");
      expect(texto).not.toContain("talvez");
      expect(texto).not.toContain("procurando");
    }
  });
});

// erros.md §2.4 and §3.2 — read off the files, because these are prohibitions
// on the route tree rather than on any one response.
describe("the error files", () => {
  const raiz = fileURLToPath(new URL("..", import.meta.url));
  const ler = (caminho: string): string => readFileSync(`${raiz}${caminho}`, "utf8");

  /** The source as it ships, without the prose that explains it. */
  const semComentarios = (fonte: string): string => fonte.replace(/\/\*[\s\S]*?\*\//g, "");

  // §2.4: `globalNotFound` bypasses the root layout, which would strip the
  // footer and with it the identification `rodape.md` §6 requires by law.
  test("leaves experimental globalNotFound off", () => {
    expect(ler("next.config.ts")).not.toContain("globalNotFound");
  });

  // §3.2: a boundary that needs the data layer in order to render cannot be the
  // boundary for the data layer failing, so it imports nothing at all.
  test("global-error.tsx reads no data", () => {
    const fonte = semComentarios(ler("app/global-error.tsx"));
    expect(fonte.match(/^import .*$/gm) ?? []).toEqual([]);
    expect(fonte).toContain('lang="pt-BR"');
    expect(fonte).toContain("<body");
  });

  // `proxy.ts` has to know which one-segment paths are real in order to send the
  // rest somewhere Next cannot resolve, and `paginasDeTopo` is that knowledge.
  // A route added to the tree and forgotten there would 404 a real page, so the
  // list is held against the tree rather than trusted.
  test("paginasDeTopo names every one-segment route in the tree, and no other", () => {
    const grupos = ["app/(loja)", "app/(compra)"];
    const noDisco = grupos
      .flatMap((grupo) =>
        readdirSync(`${raiz}${grupo}`, { withFileTypes: true })
          .filter((entrada) => entrada.isDirectory() && !entrada.name.startsWith("["))
          .filter((entrada) =>
            readdirSync(`${raiz}${grupo}/${entrada.name}`).includes("page.tsx"),
          )
          .map((entrada) => entrada.name),
      )
      .sort();

    // The four rooms are `[ambiente]` on disk, so they are the taxonomy's to
    // contribute; what is left is exactly the named directories.
    const nomeadas = paginasDeTopo()
      .filter((slug) => !ambientes.some((a) => a.slug === slug))
      .sort();

    expect(nomeadas).toEqual(noDisco);
  });

  // Its copy is §3.1's, minus `IR PARA O INÍCIO`, which it cannot honestly
  // promise. Duplicated literals are the price of the rule above, so the price
  // is paid here rather than in a shared module that could itself throw.
  test("global-error.tsx carries §3.1's copy without the home link", () => {
    const fonte = semComentarios(ler("app/global-error.tsx"));
    expect(fonte).toContain(TITULO_DO_ERRO);
    expect(fonte).toContain(CORPO_DO_ERRO);
    expect(fonte).toContain(TENTAR_NOVAMENTE);
    expect(fonte).not.toContain("IR PARA O INÍCIO");
  });
});

// Seam 2 — the 404 as the document the server actually sends.
describe("the 404", () => {
  // Two paths that share nothing but their answer: one is a live inbound link in
  // the wild (`institucional.md` §11 retired `prazos-e-entrega`), the other has
  // never been anything. Both must be a real `404` on the store's own page.
  const RETIRADA = "/politicas/prazos-e-entrega";
  const NUNCA_EXISTIU = "/nem-isto-nem-aquilo-jamais-existiu";
  const CAMINHOS = [RETIRADA, NUNCA_EXISTIU];

  test("answers a real 404, not a 200 carrying error copy", async () => {
    for (const caminho of CAMINHOS) {
      const resposta = await buscar(caminho);
      expect({ caminho, status: resposta.status }).toEqual({ caminho, status: 404 });
    }
  });

  test("declares lang=pt-BR and carries the footer's arrependimento notice", async () => {
    for (const caminho of CAMINHOS) {
      const { html } = await buscar(caminho);
      expect(html).toContain('lang="pt-BR"');
      expect(semScripts(html)).toContain("Você pode desistir da compra em até 7 dias corridos");
      expect(semScripts(html)).toContain("CNPJ");
    }
  });

  test("uses the plain text lane, with the full chrome around it", async () => {
    const html = semScripts((await buscar(NUNCA_EXISTIU)).html);
    expect(html).toContain(TITULO_DO_404);
    expect(html).toContain(CORPO_DO_404);
    // The navbar's wordmark above, the footer's identification below.
    expect(html).toContain(">Canto Zen</a>");
  });

  // §1's two ausências autoradas, asserted over the lane itself — the navbar
  // and the footer are allowed their own marks, this surface is not.
  test("carries no photograph and no régua", async () => {
    const html = semScripts((await buscar(NUNCA_EXISTIU)).html);
    const lane = html.slice(html.indexOf(TITULO_DO_404), html.indexOf("<footer"));
    expect(lane).not.toContain("<img");
    expect(lane).not.toMatch(/\d+ AMBIENTES/);
  });

  test("is titled and noindexed as rotas.md §7 fixes", async () => {
    const html = semScripts((await buscar(NUNCA_EXISTIU)).html);
    expect(html).toContain("<title>Página não encontrada | Canto Zen</title>");
    expect(html).toContain("noindex");
  });

  test("offers the four ambientes when the first segment is no room", async () => {
    const html = semScripts((await buscar(NUNCA_EXISTIU)).html);
    expect(html).toContain("CONTINUE POR AQUI");
    expect(html).toContain('href="/produtos"');
    expect(html).not.toContain("TIPOS EM");
  });

  // `/sala/mesas`: `mesas` is a real tipo, just not one Sala exposes. The offer
  // becomes Sala's real tipos, and the four ambientes are not what is listed.
  test("offers the room's own tipos on a bad ambiente × tipo pair", async () => {
    const resposta = await buscar("/sala/mesas");
    expect(resposta.status).toBe(404);

    const html = semScripts(resposta.html);
    expect(html).toContain("TIPOS EM SALA");
    expect(html).toContain("VER TUDO EM SALA");
    expect(html).toContain('href="/sala/mesas-de-centro"');
    expect(html).not.toContain("CONTINUE POR AQUI");
  });

  // §2.2 — the copy above the block is byte-identical in both variants.
  test("says the same thing above both offers", async () => {
    const generico = semScripts((await buscar(NUNCA_EXISTIU)).html);
    const casado = semScripts((await buscar("/cozinha/sofas")).html);
    for (const html of [generico, casado]) {
      expect(html).toContain(TITULO_DO_404);
      expect(html).toContain(CORPO_DO_404);
    }
  });
});
