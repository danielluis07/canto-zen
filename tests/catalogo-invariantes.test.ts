import { describe, expect, test } from "bun:test";
// The invariant suite — `dados.md` §10's list, run over the whole catalogue at
// seam 1 rather than as runtime checks. None of these is caught by the type
// system: every one of them is a cross-reference between two authored tables,
// and a broken reference reads as a rendering bug three surfaces later.
//
// Everything comes through the module's front door, as elsewhere at this seam.
import {
  ambientes,
  artigos,
  colecao,
  colecoes,
  conteudoHome,
  familia,
  produto,
  tipo,
  todosOsProdutos,
} from "../lib/catalogo";
import type { Produto } from "../lib/catalogo";

const TODOS = todosOsProdutos();
const porSlug = new Map(TODOS.map((p) => [p.slug, p]));

/** A slug one table points at, resolved or named as the reference that broke. */
const exigir = (slug: string, origem: string): Produto => {
  const encontrado = porSlug.get(slug);
  if (!encontrado) throw new Error(`${origem} points at no produto: ${slug}`);
  return encontrado;
};

describe("the catalogue is the sixty-five rows §1 counts", () => {
  test("sixty-five produtos, and every slug is its own", () => {
    expect(TODOS).toHaveLength(65);
    expect(new Set(TODOS.map((p) => p.slug)).size).toBe(65);
  });

  test("ordem is the global row number 1..65, no gap and no duplicate", () => {
    // §8.9 files `ordem` under policy, so nothing derives it and nothing but a
    // test can catch two rows claiming the same curatorial position.
    expect(TODOS.map((p) => p.ordem)).toEqual(
      Array.from({ length: 65 }, (_, i) => i + 1),
    );
  });

  test("the counts by ambientePrincipal are §1.2's table", () => {
    const porAmbiente = (slug: string) =>
      TODOS.filter((p) => p.ambientePrincipal === slug).length;
    expect(porAmbiente("sala")).toBe(20);
    expect(porAmbiente("quarto")).toBe(17);
    expect(porAmbiente("cozinha")).toBe(16);
    expect(porAmbiente("escritorio")).toBe(12);
  });
});

describe("a família is one piece, so its acabamentos share a geometry", () => {
  test("medidas are the família's, never the produto's", () => {
    // `pagina-produto.md` §10 — two acabamentos of one piece cannot disagree
    // about the same piece's width, and §3.7's six pairs are where they would.
    for (const p of TODOS) {
      const dela = familia(p.familia);
      expect(dela).toBeDefined();
      expect(p.medidas).toEqual(dela!.medidas);
    }
  });

  test("the six two-acabamento famílias resolve to one set of medidas each", () => {
    const porFamilia = new Map<string, Produto[]>();
    for (const p of TODOS) {
      porFamilia.set(p.familia, [...(porFamilia.get(p.familia) ?? []), p]);
    }

    const pares = [...porFamilia.values()].filter((linhas) => linhas.length > 1);
    expect(pares).toHaveLength(6);
    for (const linhas of pares) {
      const [primeiro, ...resto] = linhas;
      for (const outro of resto) expect(outro.medidas).toEqual(primeiro!.medidas);
    }
  });
});

describe("imagens — one principal, first, and the régua budget", () => {
  test("exactly one principal per produto, and it opens imagens", () => {
    for (const p of TODOS) {
      const principais = p.imagens.filter((i) => i.papel === "principal");
      expect(principais).toHaveLength(1);
      expect(p.imagens[0]!.papel).toBe("principal");
    }
  });

  test("a cota is only ever declared where medidas supplies the figure", () => {
    for (const p of TODOS) {
      for (const imagem of p.imagens) {
        expect(new Set(imagem.cotas).size).toBe(imagem.cotas.length);
        expect(imagem.cotas.length).toBeLessThanOrEqual(2);
        for (const cota of imagem.cotas) expect(p.medidas[cota]).toBeGreaterThan(0);
      }
    }
  });

  test("the régua is spent on exactly §7.3's five pieces", () => {
    // An empty régua is prohibited and a régua on everything is ornament
    // (`marca.md` §2) — so the budget is an invariant, not a preference.
    const comCota = TODOS.flatMap((p) =>
      p.imagens.filter((i) => i.cotas.length > 0).map((i) => ({ slug: p.slug, ...i })),
    );
    expect(comCota.map((i) => i.slug)).toEqual([
      "sofa-heron-linho-cru",
      "poltrona-lina-linho-cru",
      "cama-nuvem-linho-cru",
      "cadeira-junco-palhinha-freijo",
      "escrivaninha-cais-carvalho",
    ]);
    for (const imagem of comCota) {
      expect(imagem.papel).toBe("principal");
      expect(imagem.cotas).toEqual(["largura"]);
    }
  });

  test("no image anywhere is decorative", () => {
    for (const p of TODOS) {
      for (const imagem of p.imagens) expect(imagem.alt.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("every produto sits in a room that routes it", () => {
  test("its tipo is in its ambientePrincipal's curated tipos[]", () => {
    for (const p of TODOS) {
      const casa = ambientes.find((a) => a.slug === p.ambientePrincipal);
      expect(casa).toBeDefined();
      expect(casa!.tipos).toContain(p.tipo);
    }
  });

  test("ambientes[] always contains ambientePrincipal, and every entry is real", () => {
    for (const p of TODOS) {
      expect(p.ambientes).toContain(p.ambientePrincipal);
      for (const slug of p.ambientes) {
        expect(ambientes.some((a) => a.slug === slug)).toBe(true);
      }
    }
  });

  test("every tipo and coleção a produto names is an entity", () => {
    for (const p of TODOS) {
      expect(tipo(p.tipo)).toBeDefined();
      for (const slug of p.colecoes) expect(colecao(slug)).toBeDefined();
    }
  });
});

describe("ambiente × tipo — the enumerated routes and the three-column floor", () => {
  // `Ambiente.tipos` is the source of truth for which routes exist and is
  // curated, never inferred: a cross-listed piece renders on the room route
  // and still gets no tipo route there (§1.3 — `/quarto/poltronas` is a 404).
  const doAmbiente = (slug: string) => TODOS.filter((p) => p.ambientePrincipal === slug);

  test("every pair carrying a produto is an enumerated route", () => {
    for (const a of ambientes) {
      for (const t of new Set(doAmbiente(a.slug).map((p) => p.tipo))) {
        expect(a.tipos).toContain(t);
      }
    }
  });

  test("every enumerated pair carries at least three produtos", () => {
    // §1.1 — the grid is three columns filling all 12, so two pieces render a
    // broken row. Three is one complete row, and it is the floor.
    for (const a of ambientes) {
      for (const t of a.tipos) {
        const n = doAmbiente(a.slug).filter((p) => p.tipo === t).length;
        expect({ ambiente: a.slug, tipo: t, n }).toEqual({
          ambiente: a.slug,
          tipo: t,
          n: Math.max(n, 3),
        });
      }
    }
  });

  test("the twenty curated pairs are the whole taxonomy", () => {
    expect(ambientes.flatMap((a) => a.tipos)).toHaveLength(20);
    // Tipo slugs are global, so a room curating one twice would silently
    // duplicate a route.
    for (const a of ambientes) expect(new Set(a.tipos).size).toBe(a.tipos.length);
  });

  test("a room route is larger than its tipos, because §3.6 cross-lists", () => {
    const noQuarto = TODOS.filter((p) => p.ambientes.includes("quarto"));
    expect(noQuarto).toHaveLength(19);
    // The payoff: a poltrona lists in Quarto without Quarto curating poltronas.
    expect(noQuarto.some((p) => p.tipo === "poltronas")).toBe(true);
    expect(ambientes.find((a) => a.slug === "quarto")!.tipos).not.toContain("poltronas");
  });
});

describe("the coleções point at pieces that exist", () => {
  test("every Colecao.produtos[] slug resolves", () => {
    for (const c of colecoes) {
      for (const slug of c.produtos) {
        const p = exigir(slug, `colecao ${c.slug}`);
        // The produto's own `colecoes` is the same reference read backwards.
        expect(p.colecoes).toContain(c.slug);
      }
    }
  });

  test("a produto naming a coleção is listed by it — the reference is mutual", () => {
    for (const p of TODOS) {
      for (const slug of p.colecoes) expect(colecao(slug)!.produtos).toContain(p.slug);
    }
  });

  test("the two coleções carry the counts the régua states", () => {
    // `home.md` §4 derives `{n} PEÇAS` from `produtos.length`, never authored.
    expect(colecao("reboco")!.produtos).toHaveLength(6);
    expect(colecao("serra")!.produtos).toHaveLength(5);
  });
});

describe("the four artigos and their legends", () => {
  test("four articles, one per ambiente, in authored index order", () => {
    expect(artigos).toHaveLength(4);
    expect(artigos.map((a) => a.ambiente)).toEqual(["sala", "quarto", "cozinha", "escritorio"]);
    expect(artigos.map((a) => a.ordem)).toEqual([1, 2, 3, 4]);
    expect(new Set(artigos.map((a) => a.slug)).size).toBe(4);
  });

  test("three fotos — ampla, then two detalhes — and two passagens", () => {
    for (const a of artigos) {
      expect(a.fotos.map((f) => f.papel)).toEqual(["ampla", "detalhe", "detalhe"]);
      expect(a.passagens).toHaveLength(2);
      expect(a.abertura.trim().length).toBeGreaterThan(0);
      expect(a.thumb.alt.trim().length).toBeGreaterThan(0);
      for (const foto of a.fotos) expect(foto.alt.trim().length).toBeGreaterThan(0);
    }
  });

  test("every legend names between two and five pieces", () => {
    // One name is a product shot with a caption, which means the frame is not
    // a room shot — `inspiracoes.md` §6.5.
    for (const a of artigos) {
      for (const foto of a.fotos) {
        expect(foto.pecas.length).toBeGreaterThanOrEqual(2);
        expect(foto.pecas.length).toBeLessThanOrEqual(5);
      }
    }
  });

  test("no piece is named twice within an article", () => {
    for (const a of artigos) {
      const nomeadas = a.fotos.flatMap((f) => f.pecas);
      expect(new Set(nomeadas).size).toBe(nomeadas.length);
      expect(nomeadas).toHaveLength(7);
    }
  });

  test("every piece named lists under the article's room", () => {
    for (const a of artigos) {
      for (const foto of a.fotos) {
        for (const slug of foto.pecas) {
          expect(exigir(slug, `artigo ${a.slug}`).ambientes).toContain(a.ambiente);
        }
      }
    }
  });

  test("a piece that lives in two rooms is legible in both", () => {
    // §5.1's payoff for §3.6 existing: the no-duplicates rule is within an
    // article, never across the four.
    const nomeadas = artigos.flatMap((a) => a.fotos.flatMap((f) => f.pecas));
    const repetidas = nomeadas.filter((slug, i) => nomeadas.indexOf(slug) !== i);
    expect(new Set(repetidas)).toEqual(
      new Set([
        "poltrona-lina-linho-cru",
        "banqueta-seixo-carvalho",
        "mesa-de-apoio-luar-marmore-cru",
      ]),
    );
  });
});

describe("ConteudoHome resolves everything it names", () => {
  test("destaqueHome is a produto whose principal declares cotas: ['largura']", () => {
    // `home.md` §1's hard precondition: without the cota the hero does not
    // render at all, because an empty régua is prohibited.
    const heroi = exigir(conteudoHome.destaqueHome, "conteudoHome.destaqueHome");
    const principal = heroi.imagens.find((i) => i.papel === "principal");
    expect(principal).toBeDefined();
    expect(principal!.cotas).toEqual(["largura"]);
    expect(heroi.disponibilidade).not.toBe("esgotado");
    // The subtitle names a designer, and it is resolved through the família —
    // `dados.md` §6.1's correction. `Produto` has no such field.
    expect(familia(heroi.familia)!.designer.length).toBeGreaterThan(0);
  });

  test("the three destaques resolve, and none of them is the hero", () => {
    expect(conteudoHome.destaques).toHaveLength(3);
    for (const slug of conteudoHome.destaques) {
      exigir(slug, "conteudoHome.destaques");
      expect(slug).not.toBe(conteudoHome.destaqueHome);
    }
    // §6 — one per price bracket above the entry tier, and no Cozinha piece,
    // which is what makes the article held back in §6 the Cozinha one.
    const escolhidos = conteudoHome.destaques.map((slug) => porSlug.get(slug)!);
    expect(new Set(escolhidos.map((p) => p.precoTabela)).size).toBe(3);
    for (const p of escolhidos) expect(p.ambientes).not.toContain("cozinha");
  });

  test("colecaoDestaque resolves to a coleção", () => {
    expect(colecao(conteudoHome.colecaoDestaque)).toBeDefined();
  });

  test("the three inspirações resolve to articles, and one is held back", () => {
    expect(conteudoHome.inspiracoes).toHaveLength(3);
    for (const slug of conteudoHome.inspiracoes) {
      expect(artigos.some((a) => a.slug === slug)).toBe(true);
    }
    const ausente = artigos.find((a) => !conteudoHome.inspiracoes.includes(a.slug));
    // §6 — the one held back is the article whose room `destaques` never names.
    expect(ausente!.ambiente).toBe("cozinha");
  });

  test("the marcenaria block is authored, image and all", () => {
    expect(conteudoHome.marcenaria.linha.trim().length).toBeGreaterThan(0);
    expect(conteudoHome.marcenaria.texto.trim().length).toBeGreaterThan(0);
    expect(conteudoHome.marcenaria.imagem.alt.trim().length).toBeGreaterThan(0);
  });
});

describe("every slug any surface will follow resolves", () => {
  test("the whole reference graph, in one pass", () => {
    // The single assertion `dados.md` §10 asks for: the union of every produto
    // slug written down outside the produtos table itself.
    const referencias = [
      conteudoHome.destaqueHome,
      ...conteudoHome.destaques,
      ...colecoes.flatMap((c) => c.produtos),
      ...artigos.flatMap((a) => a.fotos.flatMap((f) => f.pecas)),
    ];
    const orfas = referencias.filter((slug) => !produto(slug));
    expect(orfas).toEqual([]);
    // Twelve legends, and every one of them read.
    expect(artigos.flatMap((a) => a.fotos)).toHaveLength(12);
  });
});
