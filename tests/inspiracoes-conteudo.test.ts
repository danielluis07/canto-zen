import { describe, expect, test } from "bun:test";
import { ambiente, artigos, produto } from "../lib/catalogo";
import {
  LINHA_DO_INDICE,
  METADADOS_DO_INDICE,
  TITULO_DO_INDICE,
  artigoEnumerado,
  artigosEnumerados,
  linhasDoIndice,
  metadadosDoArtigo,
  paginaDoArtigo,
} from "../lib/inspiracoes/conteudo";

// The editorial lane's composition, asserted without a renderer —
// `inspiracoes.md` §§5–8 decide every line both routes put on screen, and all
// of that is decided here rather than in the components.

describe("§5 — the index", () => {
  const linhas = linhasDoIndice();

  test("is exactly four rows, one per ambiente, in the authored `ordem`", () => {
    expect(linhas).toHaveLength(4);
    expect(linhas.map((linha) => linha.slug)).toEqual(
      [...artigos].sort((a, b) => a.ordem - b.ordem).map((a) => a.slug),
    );
  });

  test("annotates every row with its room, cased for the annotation voice", () => {
    expect(linhas.map((linha) => linha.ambiente)).toEqual([
      "SALA",
      "QUARTO",
      "COZINHA",
      "ESCRITÓRIO",
    ]);
  });

  test("carries the article's own título, resumo, thumb and link", () => {
    for (const linha of linhas) {
      const fonte = artigos.find((a) => a.slug === linha.slug)!;
      expect(linha.titulo).toBe(fonte.titulo);
      expect(linha.resumo).toBe(fonte.resumo);
      expect(linha.thumb).toEqual(fonte.thumb);
      expect(linha.href).toBe(`/inspiracoes/${fonte.slug}`);
    }
  });

  // §5.2 — the Mincho line names the act; the navbar and the tab say the word.
  test("opens on a cabeçalho that does not repeat the section's name", () => {
    expect(TITULO_DO_INDICE).not.toContain("Inspirações");
    expect(LINHA_DO_INDICE.length).toBeGreaterThan(0);
  });

  // §5.2, `rotas.md` §1 — the tab is the only place the word appears, and §2
  // ships the cabeçalho's Body line verbatim as the description.
  test("is titled by the word the cabeçalho withheld, and described by that line", () => {
    expect(METADADOS_DO_INDICE).toEqual({
      titulo: "Inspirações",
      descricao: LINHA_DO_INDICE,
    });
  });
});

describe("§6 — an article", () => {
  const pagina = paginaDoArtigo("a-luz-da-tarde-na-sala");

  test("carries the fixed skeleton: three fotos and two passagens", () => {
    expect(pagina.fotos).toHaveLength(3);
    expect(pagina.passagens).toHaveLength(2);
    expect(pagina.fotos.map((foto) => foto.papel)).toEqual(["ampla", "detalhe", "detalhe"]);
  });

  test("states the room as annotation and the título as the article's name", () => {
    expect(pagina.ambiente).toBe("SALA");
    expect(pagina.titulo).toBe("A luz da tarde");
    expect(pagina.abertura.length).toBeGreaterThan(0);
  });

  // §6.5 — the legend is the only route from a room story into the catálogo,
  // and it names produtos because a família has no page.
  test("resolves every legenda name to a produto page, in the frame's order", () => {
    for (const foto of pagina.fotos) {
      expect(foto.legenda.length).toBeGreaterThanOrEqual(2);
      expect(foto.legenda.length).toBeLessThanOrEqual(5);

      for (const peca of foto.legenda) {
        const fonte = produto(peca.slug)!;
        expect(fonte).toBeDefined();
        expect(peca.nome).toBe(fonte.nome.toUpperCase());
        expect(peca.href).toBe(`/produtos/${fonte.slug}`);
      }
    }
  });

  test("names a piece once per article, across all three legendas", () => {
    for (const artigo of artigos) {
      const nomeadas = paginaDoArtigo(artigo.slug).fotos.flatMap((foto) =>
        foto.legenda.map((peca) => peca.slug),
      );
      expect(new Set(nomeadas).size).toBe(nomeadas.length);
    }
  });

  // §6.6 — exactly one exit, and it is real navigation to a listing that exists.
  test("closes on one link to the room listing, and on nothing else", () => {
    for (const artigo of artigos) {
      const fim = paginaDoArtigo(artigo.slug).fecho;
      const sala = ambiente(artigo.ambiente)!;
      expect(fim.href).toBe(`/${sala.slug}`);
      expect(fim.rotulo).toBe(`VER TODAS AS PEÇAS EM ${sala.label.toUpperCase()}`);
    }
  });

  // §3.1 — the surface's first authored absence, asserted over every string the
  // module hands a component rather than over one page's markup.
  test("puts no figure and no price into anything it composes", () => {
    for (const artigo of artigos) {
      const pagina = paginaDoArtigo(artigo.slug);
      const texto = [
        pagina.titulo,
        pagina.abertura,
        ...pagina.passagens,
        pagina.fecho.rotulo,
        ...pagina.fotos.flatMap((foto) => [foto.alt, ...foto.legenda.map((p) => p.nome)]),
      ].join(" ");

      expect(texto).not.toContain("R$");
      expect(texto).not.toMatch(/\d+x/);
      expect(texto).not.toMatch(/\bCM\b/);
    }
  });

  // §8 — the blog affordances the shape refuses, restated over the view model.
  test("exposes no date, no author and no category", () => {
    expect(Object.keys(pagina).sort()).toEqual(
      ["abertura", "ambiente", "fecho", "fotos", "passagens", "slug", "titulo"].sort(),
    );
  });

  test("is titled by the título and described by the resumo", () => {
    const fonte = artigos[0]!;
    expect(metadadosDoArtigo(fonte.slug)).toEqual({
      titulo: fonte.titulo,
      descricao: fonte.resumo,
    });
  });

  test("throws rather than composing a page for a slug that names no artigo", () => {
    expect(() => paginaDoArtigo("a-varanda-ao-meio-dia")).toThrow();
  });
});

// §7.2 / `rotas.md` §7 — the four are the whole route space under the segment.
describe("the article route space", () => {
  test("enumerates exactly the four, in the authored order", () => {
    expect(artigosEnumerados()).toEqual([
      "a-luz-da-tarde-na-sala",
      "o-quarto-como-abrigo",
      "a-cozinha-que-recebe",
      "trabalhar-em-silencio",
    ]);
  });

  test("admits nothing else", () => {
    expect(artigoEnumerado("a-luz-da-tarde-na-sala")).toBe(true);
    expect(artigoEnumerado("a-varanda-ao-meio-dia")).toBe(false);
    expect(artigoEnumerado("")).toBe(false);
  });
});
