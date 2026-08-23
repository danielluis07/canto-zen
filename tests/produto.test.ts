import { describe, expect, test } from "bun:test";
import { material, materiais, politicas, produto, reais, todosOsProdutos } from "../lib/catalogo";
import {
  acabamentosDaFamilia,
  assinatura,
  cotasDoPrincipal,
  cuidados,
  embalagemEmTexto,
  entregaEAcesso,
  fechamento,
  fichaTecnica,
  irmaoDisponivel,
  linhasDeMedidasExtras,
  metadadosDoProduto,
  montagemDaPagina,
  parcelamentoDaPagina,
  precoAVistaEmTexto,
  precoAnteriorEmTexto,
  trilha,
  trioDeMedidas,
} from "../lib/produto/conteudo";
import { adicionarAoCarrinho, carrinhoVazio, quantidadeTotal } from "../lib/carrinho/estado";
import { exigirProduto } from "./helpers/catalogo";

const lina = exigirProduto("poltrona-lina-linho-cru");
const heron = exigirProduto("sofa-heron-linho-cru");
const cabeceira = exigirProduto("cabeceira-vela-linho-areia");
const farol = exigirProduto("luminaria-de-mesa-farol-latao");

// pagina-produto.md §1 — the promise `rotas.md` made by leaving the URL flat
describe("the breadcrumb", () => {
  test("reads ambientePrincipal, never the path the reader took", () => {
    expect(trilha(lina)).toEqual([
      { rotulo: "INÍCIO", href: "/" },
      { rotulo: "SALA", href: "/sala" },
      { rotulo: "POLTRONAS", href: "/sala/poltronas" },
      { rotulo: "POLTRONA LINA", href: null },
    ]);
  });

  // The piece lists under Sala *and* Quarto; only one of them is its trail.
  test("names one room even for a piece that lists under two", () => {
    expect(lina.ambientes).toEqual(["sala", "quarto"]);
    expect(trilha(lina)[1]).toEqual({ rotulo: "SALA", href: "/sala" });
  });

  test("uses the tipo's plural label, because the segment is the listing", () => {
    expect(trilha(heron)[2]).toEqual({ rotulo: "SOFÁS", href: "/sala/sofas" });
  });

  test("leaves the current item without a link", () => {
    for (const p of todosOsProdutos()) {
      expect(trilha(p).at(-1)!.href).toBe(null);
    }
  });
});

// pagina-produto.md §§2.2–2.3
describe("the buy box", () => {
  test("names the acabamento and the família's designer beside the piece", () => {
    expect(assinatura(lina)).toBe("LINHO CRU · POR MARINA AOKI");
  });

  test("states the à-vista figure the module derives, not the table price", () => {
    expect(precoAVistaEmTexto(lina)).toBe("R$ 3.501,00");
    expect(precoAVistaEmTexto(lina)).not.toBe(reais(lina.precoTabela));
  });

  test("states the parcelamento against the table price, in full", () => {
    expect(parcelamentoDaPagina(lina)).toBe("ou R$ 3.890,00 em 10x de R$ 389,00 sem juros");
  });

  // The parcela floor is policy, so the line follows the price rather than a
  // constant `10x` — a piece under `parcelaMinima × 2` offers no split at all.
  test("offers no parcelamento line where the policy affords no second parcela", () => {
    const barata = { ...lina, precoTabela: politicas.parcelaMinimaCentavos };
    expect(parcelamentoDaPagina(barata)).toBe(null);
  });

  test("strikes the precoDe through, without a colour and without a percentage", () => {
    expect(precoAnteriorEmTexto(lina)).toBe(null);
    const promocional = exigirProduto("sofa-orla-linho-areia");
    expect(precoAnteriorEmTexto(promocional)).toBe(reais(promocional.precoDe!));
  });
});

// pagina-produto.md §2.4 — the família is reachable with no família page
describe("outros acabamentos", () => {
  test("lists the piece's siblings, the current one included", () => {
    const irmaos = acabamentosDaFamilia(lina);
    expect(irmaos.map((i) => i.slug)).toEqual([
      "poltrona-lina-linho-cru",
      "poltrona-lina-boucle-carvalho",
    ]);
    expect(irmaos.map((i) => i.atual)).toEqual([true, false]);
  });

  test("carries each sibling's own swatch and its own URL", () => {
    const [, boucle] = acabamentosDaFamilia(lina);
    expect(boucle).toEqual({
      slug: "poltrona-lina-boucle-carvalho",
      label: "Bouclé Carvalho",
      href: "/produtos/poltrona-lina-boucle-carvalho",
      amostra: "#D8CBB6",
      atual: false,
      esgotado: false,
    });
  });

  // A block with one entry states a choice that does not exist.
  test("does not render at all for a família with a single acabamento", () => {
    expect(acabamentosDaFamilia(farol)).toEqual([]);
  });
});

// pagina-produto.md §2.6 — the esgotado state
describe("an esgotado piece", () => {
  test("offers a sibling only where the família actually has an available one", () => {
    expect(irmaoDisponivel(farol)).toBe(null);
  });

  test("offers the sibling by name when one exists", () => {
    const inventado = { ...lina, disponibilidade: "esgotado" as const };
    expect(irmaoDisponivel(inventado)).toEqual({
      rotulo: "VER POLTRONA LINA EM BOUCLÉ CARVALHO",
      href: "/produtos/poltrona-lina-boucle-carvalho",
    });
  });
});

// pagina-produto.md §2.8 — the four facts justify the price, and live only here
describe("montagem", () => {
  test("prices the add-on from the tipo's nível, never from the piece", () => {
    expect(montagemDaPagina(lina)).toEqual({
      rotulo: "Contratar montagem",
      preco: "+ R$ 99,00",
      fatos: "SIMPLES · 1 PESSOA · 5 PEÇAS · 20 MIN",
      nota: "NO MESMO DIA DA ENTREGA AGENDADA.",
    });
  });

  test("prices a média piece above a simples one, from the same table", () => {
    expect(montagemDaPagina(heron)?.preco).toBe(`+ ${reais(politicas.montagemCentavos.media)}`);
    expect(montagemDaPagina(heron)?.fatos).toBe("MÉDIA · 2 PESSOAS · 9 PEÇAS · 40 MIN");
  });

  // `necessaria: false` is a state the page renders, not a block it skips
  // silently: the luminárias are the catalogue's only such pieces.
  test("is absent from the buy box for a piece that needs none", () => {
    expect(farol.montagem.necessaria).toBe(false);
    expect(montagemDaPagina(farol)).toBe(null);
  });
});

// pagina-produto.md §4 — the section that decides the purchase
describe("medidas", () => {
  test("is a mandatory trio, in order, with a multiplication sign", () => {
    expect(trioDeMedidas(lina.medidas)).toBe("L 78 × P 82 × A 74 cm");
    expect(trioDeMedidas(lina.medidas)).not.toContain("x");
  });

  test("renders the tipo's real extras and their units", () => {
    expect(linhasDeMedidasExtras(lina)).toEqual([
      { rotulo: "ALTURA DO ASSENTO", valor: "42 cm" },
      { rotulo: "CAPACIDADE DE PESO", valor: "120 kg" },
    ]);
  });

  // The empty list is a supported state, not a section that fails to render.
  test("renders a piece whose tipo carries no extras at all", () => {
    expect(cabeceira.medidasExtras).toEqual([]);
    expect(linhasDeMedidasExtras(cabeceira)).toEqual([]);
    expect(trioDeMedidas(cabeceira.medidas)).toBe("L 160 × P 10 × A 100 cm");
  });

  test("states the box's own figures, which are not the piece's", () => {
    expect(embalagemEmTexto(lina)).toBe("1 volume · L 86 × P 90 × A 80 cm · 34 kg");
    expect(embalagemEmTexto(heron)).toBe("2 volumes · L 228 × P 104 × A 82 cm · 107 kg");
  });
});

// pagina-produto.md §5 — care belongs to the material, never to the piece
describe("a ficha técnica", () => {
  test("derives Cuidados as the union of the piece's materials' lines", () => {
    expect(cuidados(lina)).toEqual([
      material("linho")!.cuidados,
      material("carvalho")!.cuidados,
    ]);
  });

  // One line per material the piece is made of, and never none: no produto can
  // exist without care copy, which is the whole reason `Material.cuidados`
  // exists. It is deliberately **not** asserted as "two or more" — a solid oak
  // table names its own structure, so `materiaisDoAcabamento` adds nothing to
  // it and its Cuidados is one honest line. (`dados.md` §8.1 states ≥2 as a
  // consequence of its rule; the rule adds a structural material only where the
  // acabamento names a *surface*, and thirty-two solid-wood pieces name none.)
  test("gives every produto in the catalogue a care line per material", () => {
    for (const p of todosOsProdutos()) {
      expect({ slug: p.slug, linhas: cuidados(p).length }).toEqual({
        slug: p.slug,
        linhas: new Set(p.materiais).size,
      });
      expect(cuidados(p).length).toBeGreaterThan(0);
    }
  });

  test("never repeats a care line, however the acabamento names its materials", () => {
    for (const p of todosOsProdutos()) {
      expect(new Set(cuidados(p)).size).toBe(cuidados(p).length);
    }
  });

  test("states every care line from the material table and none of its own", () => {
    const conhecidas = new Set(materiais.map((m) => m.cuidados));
    for (const p of todosOsProdutos()) {
      for (const linha of cuidados(p)) expect(conhecidas.has(linha)).toBe(true);
    }
  });

  test("falls back to the store's garantia, which every piece exercises", () => {
    const garantia = fichaTecnica(lina).find((linha) => linha.rotulo === "GARANTIA");
    expect(garantia?.valores).toEqual([`${politicas.garantiaPadraoMeses} meses`]);
  });

  test("carries the attributes and none of the figures — those are §4's", () => {
    expect(fichaTecnica(lina).map((linha) => linha.rotulo)).toEqual([
      "MATERIAIS",
      "COR",
      "ACABAMENTO",
      "CUIDADOS",
      "GARANTIA",
      "ITENS INCLUSOS",
    ]);
  });
});

// pagina-produto.md §3 — the piece is described, never advertised
describe("the description", () => {
  test("is three sentences, in every row of the catalogue", () => {
    for (const p of todosOsProdutos()) {
      const frases = p.descricao.split(/(?<=\.)\s+/).filter(Boolean);
      expect({ slug: p.slug, frases: frases.length }).toEqual({ slug: p.slug, frases: 3 });
    }
  });

  // There is no short-description field and no lead: `descricao` is one string,
  // and the metadata layer is truncated from it rather than authored beside it.
  test("carries no price and no imperative offer", () => {
    for (const p of todosOsProdutos()) {
      expect(p.descricao).not.toContain("R$");
      expect(p.descricao.toLowerCase()).not.toContain("compre");
    }
  });
});

// pagina-produto.md §6 — prose derived from policy and from the piece's data
describe("delivery and access", () => {
  test("is four short paragraphs and no table", () => {
    expect(entregaEAcesso(lina)).toHaveLength(4);
  });

  test("names the embalagem's own dimensions, which is what has to fit the lift", () => {
    expect(entregaEAcesso(lina)[1]).toContain("L 86 × P 90 × A 80 cm");
    expect(entregaEAcesso(lina)[1]).toContain("elevador");
  });

  // Two clocks, and the page may not conflate them: production precedes
  // dispatch, the delivery prazo starts after payment confirmation.
  test("states a sob-encomenda production window apart from the delivery prazo", () => {
    const paragrafo = entregaEAcesso(heron)[0]!;
    expect(paragrafo).toContain("dias úteis");
    expect(paragrafo).toContain("6 semanas");
    expect(entregaEAcesso(cabeceira)[0]).not.toContain("semanas");
  });

  test("says plainly that a piece needing no montagem needs none", () => {
    expect(entregaEAcesso(farol)[2]).toContain("não precisa de montagem");
    expect(entregaEAcesso(lina)[2]).toContain("mesmo dia da entrega");
  });

  // rodape.md §6's treatment, and the window counts from the montagem when it
  // was contracted — a fact about the window, not the buy box's notice.
  test("counts the arrependimento window from the montagem where there is one", () => {
    expect(entregaEAcesso(lina)[3]).toContain("sete dias");
    expect(entregaEAcesso(lina)[3]).toContain("montagem");
    expect(entregaEAcesso(farol)[3]).toContain("sete dias");
    expect(entregaEAcesso(farol)[3]).not.toContain("montagem");
  });
});

// pagina-produto.md §7 — navigation, never a recommendation
describe("the closing", () => {
  test("is the coleção's other pieces, in the order the coleção authored", () => {
    const fim = fechamento(lina);
    expect(fim.tipo).toBe("colecao");
    if (fim.tipo !== "colecao") throw new Error("unreachable");
    expect(fim.titulo).toBe("COLEÇÃO REBOCO");
    expect(fim.produtos.map((p) => p.slug)).toEqual([
      "sofa-heron-linho-cru",
      "mesa-de-centro-luar-marmore-off-white",
      "aparador-pedra-marmore-cru",
      "cabeceira-vela-linho-areia",
      "luminaria-de-mesa-seixo-ceramica-cru",
    ]);
  });

  test("is a single link back to a real listing where there is no coleção", () => {
    expect(fechamento(farol)).toEqual({
      tipo: "ligacao",
      rotulo: "VER LUMINÁRIAS DE MESA EM ESCRITÓRIO",
      href: "/escritorio/luminarias-de-mesa",
    });
  });

  test("points every piece at a listing that exists", () => {
    for (const p of todosOsProdutos()) {
      const fim = fechamento(p);
      if (fim.tipo !== "ligacao") continue;
      expect(fim.href).toBe(`/${p.ambientePrincipal}/${p.tipo}`);
    }
  });
});

// pagina-produto.md §8 — the régua budget, and marca.md §2's prohibition
describe("the régua", () => {
  test("carries the figure the image declares and nothing else", () => {
    expect(cotasDoPrincipal(lina)).toEqual([{ eixo: "largura", rotulo: "L 78 CM" }]);
  });

  test("does not render where the image declares no cota", () => {
    expect(farol.imagens[0]!.cotas).toEqual([]);
    expect(cotasDoPrincipal(farol)).toEqual([]);
  });

  // Two cotas per piece is the ceiling, and the drawing spends the page's
  // second instance — so the image may never state more than two.
  test("never states more than two figures over one photograph", () => {
    for (const p of todosOsProdutos()) {
      expect(cotasDoPrincipal(p).length).toBeLessThanOrEqual(2);
    }
  });
});

// rotas.md §§1–2
describe("the produto's metadata", () => {
  test("titles the piece by its name and nothing else", () => {
    expect(metadadosDoProduto(lina).titulo).toBe("Poltrona Lina");
  });

  test("describes it in physical facts, and carries no price", () => {
    expect(metadadosDoProduto(lina).descricao).toBe(
      "Poltrona em linho, por Marina Aoki. L 78 × P 82 × A 74 cm.",
    );
    for (const p of todosOsProdutos()) {
      expect(metadadosDoProduto(p).descricao).not.toContain("R$");
    }
  });
});

// carrinho.md §§4.1, 4.3 — what the PDP's CTA hands the cart
describe("adding to the carrinho", () => {
  test("appends the piece with the montagem chosen on the page", () => {
    const carrinho = adicionarAoCarrinho(carrinhoVazio, { slug: lina.slug, montagem: true });
    expect(carrinho.itens).toEqual([{ slug: lina.slug, quantidade: 1, montagem: true }]);
    expect(quantidadeTotal(carrinho)).toBe(1);
  });

  test("increments the line instead of appending a second one", () => {
    const uma = adicionarAoCarrinho(carrinhoVazio, { slug: lina.slug, montagem: false });
    const duas = adicionarAoCarrinho(uma, { slug: lina.slug, montagem: false });
    expect(duas.itens).toHaveLength(1);
    expect(duas.itens[0]!.quantidade).toBe(2);
  });

  test("keeps two acabamentos of one família as two lines", () => {
    const carrinho = adicionarAoCarrinho(
      adicionarAoCarrinho(carrinhoVazio, { slug: lina.slug, montagem: false }),
      { slug: "poltrona-lina-boucle-carvalho", montagem: false },
    );
    expect(carrinho.itens.map((item) => item.slug)).toEqual([
      "poltrona-lina-linho-cru",
      "poltrona-lina-boucle-carvalho",
    ]);
  });

  test("never contracts montagem for a piece that needs none", () => {
    expect(produto(farol.slug)!.montagem.necessaria).toBe(false);
    const carrinho = adicionarAoCarrinho(carrinhoVazio, { slug: farol.slug, montagem: false });
    expect(carrinho.itens[0]!.montagem).toBe(false);
  });
});
