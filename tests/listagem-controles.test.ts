import { describe, expect, test } from "bun:test";
import { cores, materiais, todosOsProdutos, type Produto } from "../lib/catalogo";
import {
  POR_PAGINA,
  alternarValor,
  aplicarFiltros,
  aplicarOrdem,
  consultaVazia,
  definirOrdem,
  definirPagina,
  definirPreco,
  faixasDePreco,
  href,
  lerConsulta,
  paginar,
  selecionar,
} from "../lib/listagem/consulta";
import {
  controlesDaListagem,
  facetasDoConjunto,
  rotuloAplicado,
} from "../lib/listagem/controles";
import { produtosDoAmbiente } from "../lib/listagem/conteudo";

const sala = () => produtosDoAmbiente("sala");

// rotas.md — canonical keys, pt-BR, and a surface ignores what it does not support
describe("reading the query", () => {
  test("defaults to no filter, curadoria and page one", () => {
    expect(lerConsulta({})).toEqual(consultaVazia());
  });

  test("takes cor and material repeated, in taxonomy order, without duplicates", () => {
    const consulta = lerConsulta({ cor: ["carvao", "cru", "cru"], material: "linho" });
    expect(consulta.cor).toEqual(["cru", "carvao"]);
    expect(consulta.material).toEqual(["linho"]);
  });

  test("drops a value the taxonomy does not carry rather than erroring", () => {
    expect(lerConsulta({ cor: ["roxo"] }).cor).toEqual([]);
    expect(lerConsulta({ material: ["veludo", "linho"] }).material).toEqual(["linho"]);
    expect(lerConsulta({ preco: "0-1" }).preco).toBeNull();
    expect(lerConsulta({ ordem: "mais-vendidos" }).ordem).toBe("curadoria");
  });

  test("reads pagina as a 1-based integer and refuses anything else", () => {
    expect(lerConsulta({ pagina: "3" }).pagina).toBe(3);
    expect(lerConsulta({ pagina: "0" }).pagina).toBe(1);
    expect(lerConsulta({ pagina: "-2" }).pagina).toBe(1);
    expect(lerConsulta({ pagina: "duas" }).pagina).toBe(1);
    expect(lerConsulta({ pagina: "2.5" }).pagina).toBe(1);
  });

  // The room comes from the path; `/produtos` is the surface that needs the key.
  test("a room route ignores ?ambiente=, and /produtos reads it", () => {
    expect(lerConsulta({ ambiente: "quarto" }).ambiente).toBeNull();
    expect(lerConsulta({ ambiente: "quarto" }, { ambiente: true }).ambiente).toBe("quarto");
    expect(lerConsulta({ ambiente: "varanda" }, { ambiente: true }).ambiente).toBeNull();
  });

  // build-spec.md, Routing — reserved, never used.
  test("never reads ?q=", () => {
    expect(lerConsulta({ q: "poltrona" })).toEqual(consultaVazia());
    expect(href("/sala", lerConsulta({ q: "poltrona" }))).toBe("/sala");
  });
});

// catalogo.md §3 — the facets
describe("filtering", () => {
  test("matches any of the selected cores, not all of them", () => {
    const consulta = { ...consultaVazia(), cor: ["cru", "carvao"] };
    const resultado = aplicarFiltros(sala(), consulta);
    expect(resultado.length).toBeGreaterThan(0);
    for (const p of resultado) expect(["cru", "carvao"]).toContain(p.cor);
    expect(resultado.length).toBeGreaterThan(
      aplicarFiltros(sala(), { ...consultaVazia(), cor: ["cru"] }).length,
    );
  });

  test("matches a material the piece carries among several", () => {
    const consulta = { ...consultaVazia(), material: ["linho"] };
    for (const p of aplicarFiltros(sala(), consulta)) expect(p.materiais).toContain("linho");
  });

  test("intersects across facets — cor and material both hold", () => {
    const consulta = { ...consultaVazia(), cor: ["cru"], material: ["linho"] };
    for (const p of aplicarFiltros(sala(), consulta)) {
      expect(p.cor).toBe("cru");
      expect(p.materiais).toContain("linho");
    }
  });

  // Store constants, so the same URL means the same thing on every route.
  test("the four price ranges are the authored ones and partition the catalogue", () => {
    expect(faixasDePreco.map((f) => f.slug)).toEqual([
      "0-2000",
      "2000-5000",
      "5000-10000",
      "10000-",
    ]);

    const todos = todosOsProdutos();
    const contagem = faixasDePreco
      .map((f) => aplicarFiltros(todos, { ...consultaVazia(), preco: f.slug }).length)
      .reduce((a, b) => a + b, 0);
    expect(contagem).toBe(todos.length);
  });

  test("a range takes its boundary at the top, as its label reads", () => {
    const emCentavos = (valor: number): Produto =>
      ({ ...todosOsProdutos()[0], precoTabela: valor * 100 }) as Produto;
    const naFaixa = (slug: string, valor: number) =>
      aplicarFiltros([emCentavos(valor)], { ...consultaVazia(), preco: slug }).length === 1;

    expect(naFaixa("0-2000", 2000)).toBe(true);
    expect(naFaixa("2000-5000", 2000)).toBe(false);
    expect(naFaixa("2000-5000", 5000)).toBe(true);
    expect(naFaixa("10000-", 10000)).toBe(false);
    expect(naFaixa("10000-", 10001)).toBe(true);
  });

  test("ambiente matches the complete set a piece lists under", () => {
    const consulta = { ...consultaVazia(), ambiente: "quarto" };
    for (const p of aplicarFiltros(todosOsProdutos(), consulta)) {
      expect(p.ambientes).toContain("quarto");
    }
  });
});

// catalogo.md §3 — three tokens, and esgotado always last
describe("sorting", () => {
  test("curadoria is produto.ordem ascending", () => {
    const ordens = aplicarOrdem(sala(), "curadoria")
      .filter((p) => p.disponibilidade !== "esgotado")
      .map((p) => p.ordem);
    expect(ordens).toEqual([...ordens].sort((a, b) => a - b));
  });

  test("menor-preco and maior-preco are precoTabela, mirrored", () => {
    const menor = aplicarOrdem(sala(), "menor-preco").filter(
      (p) => p.disponibilidade !== "esgotado",
    );
    const maior = aplicarOrdem(sala(), "maior-preco").filter(
      (p) => p.disponibilidade !== "esgotado",
    );
    expect(menor.map((p) => p.precoTabela)).toEqual(
      [...menor.map((p) => p.precoTabela)].sort((a, b) => a - b),
    );
    expect(maior.map((p) => p.precoTabela)).toEqual(
      [...maior.map((p) => p.precoTabela)].sort((a, b) => b - a),
    );
  });

  test("puts esgotado last within whatever order is active", () => {
    for (const ordem of ["curadoria", "menor-preco", "maior-preco"] as const) {
      const estados = aplicarOrdem(sala(), ordem).map((p) => p.disponibilidade === "esgotado");
      expect(estados).toEqual([...estados].sort((a, b) => Number(a) - Number(b)));
    }
  });

  test("never mutates the list it was handed", () => {
    const original = sala();
    const antes = original.map((p) => p.slug);
    aplicarOrdem(original, "maior-preco");
    expect(original.map((p) => p.slug)).toEqual(antes);
  });
});

// catalogo.md §7 — 12 per page, numbered, page one canonical
describe("pagination", () => {
  test("cuts at twelve", () => {
    expect(POR_PAGINA).toBe(12);
    const pagina = paginar(sala(), 1);
    expect(pagina.itens.length).toBe(12);
    expect(pagina.total).toBe(sala().length);
    expect(pagina.paginas).toBe(Math.ceil(sala().length / 12));
  });

  test("hands back the tail on the last page", () => {
    const ultima = paginar(sala(), Math.ceil(sala().length / 12));
    expect(ultima.itens.length).toBe(sala().length % 12 || 12);
  });

  // A page beyond the end is not a zero-result state — the filters match.
  test("clamps a page past the end instead of showing an empty grid", () => {
    const pagina = paginar(sala(), 99);
    expect(pagina.pagina).toBe(pagina.paginas);
    expect(pagina.itens.length).toBeGreaterThan(0);
  });

  test("a set that fits on one page has one page", () => {
    const escritorio = produtosDoAmbiente("escritorio");
    expect(escritorio.length).toBeLessThanOrEqual(POR_PAGINA);
    expect(paginar(escritorio, 1).paginas).toBe(1);
  });

  test("an empty result still reports one page", () => {
    expect(paginar([], 1).paginas).toBe(1);
    expect(paginar([], 1).itens).toEqual([]);
  });
});

// rotas.md — page one carries no query, filters strip the page
describe("the URL", () => {
  test("omits every default, so the canonical route carries no query", () => {
    expect(href("/sala", consultaVazia())).toBe("/sala");
    expect(href("/sala", definirOrdem(consultaVazia(), "curadoria"))).toBe("/sala");
    expect(href("/sala", definirPagina(consultaVazia(), 1))).toBe("/sala");
  });

  test("writes the keys in pt-BR, repeating cor and material", () => {
    const consulta = alternarValor(alternarValor(consultaVazia(), "cor", "cru"), "cor", "carvao");
    expect(href("/sala", consulta)).toBe("/sala?cor=cru&cor=carvao");
    expect(href("/sala", definirOrdem(consultaVazia(), "menor-preco"))).toBe(
      "/sala?ordem=menor-preco",
    );
    expect(href("/sala", definirPagina(consultaVazia(), 2))).toBe("/sala?pagina=2");
    expect(href("/sala", definirPreco(consultaVazia(), "2000-5000"))).toBe("/sala?preco=2000-5000");
  });

  // catalogo.md §3 — page 3 of a different result set is not a place.
  test("discards pagina on any filter or sort change", () => {
    const naPagina3 = definirPagina(consultaVazia(), 3);
    expect(alternarValor(naPagina3, "cor", "cru").pagina).toBe(1);
    expect(definirPreco(naPagina3, "0-2000").pagina).toBe(1);
    expect(definirOrdem(naPagina3, "menor-preco").pagina).toBe(1);
  });

  test("alternarValor toggles a value off again", () => {
    const com = alternarValor(consultaVazia(), "cor", "cru");
    expect(alternarValor(com, "cor", "cru").cor).toEqual([]);
  });

  test("round-trips through lerConsulta", () => {
    const consulta = definirPagina(
      definirOrdem(
        definirPreco(alternarValor(consultaVazia(), "material", "linho"), "5000-10000"),
        "maior-preco",
      ),
      2,
    );
    const query = href("/sala", consulta).split("?")[1];
    const brutos: Record<string, string | string[]> = {};
    for (const [chave, valor] of new URLSearchParams(query)) {
      const anterior = brutos[chave];
      brutos[chave] =
        anterior === undefined
          ? valor
          : [...(Array.isArray(anterior) ? anterior : [anterior]), valor];
    }
    expect(lerConsulta(brutos)).toEqual(consulta);
  });
});

// catalogo.md §3 — the applied state lives in the trigger
describe("the trigger's applied state", () => {
  test("reads label alone when nothing is applied", () => {
    expect(rotuloAplicado("COR", [])).toBe("COR");
  });

  test("names the values, uppercase, separated by commas", () => {
    expect(rotuloAplicado("COR", ["Cru", "Carvão"])).toBe("COR · CRU, CARVÃO");
  });

  test("collapses three or more to a count", () => {
    expect(rotuloAplicado("COR", ["Cru", "Carvão", "Areia"])).toBe("COR · 3 SELECIONADAS");
  });
});

// catalogo.md §3 — the panels
describe("the facets a surface offers", () => {
  const facetas = () => facetasDoConjunto(sala(), { ambiente: false });

  test("offers cor, material and preço on a room route, and not ambiente", () => {
    expect(facetas().map((f) => f.chave)).toEqual(["cor", "material", "preco"]);
    expect(facetasDoConjunto(todosOsProdutos(), { ambiente: true }).map((f) => f.chave)).toEqual([
      "cor",
      "material",
      "preco",
      "ambiente",
    ]);
  });

  test("paints each cor with its own amostra", () => {
    const cor = facetas().find((f) => f.chave === "cor")!;
    expect(cor.opcoes.length).toBeGreaterThan(0);
    for (const opcao of cor.opcoes) {
      expect(opcao.amostra).toBe(cores.find((c) => c.slug === opcao.slug)!.amostra);
    }
  });

  test("carries an amostra on cor and on nothing else", () => {
    for (const faceta of facetas().filter((f) => f.chave !== "cor")) {
      for (const opcao of faceta.opcoes) expect(opcao.amostra).toBeUndefined();
    }
  });

  // A colour no piece in this room carries is an option that can only produce
  // zero. The price ranges stay store constants because §3 fixes them as such.
  test("offers only the cores and materiais the route's own set carries", () => {
    const presentes = new Set(sala().map((p) => p.cor));
    expect(facetas().find((f) => f.chave === "cor")!.opcoes.map((o) => o.slug)).toEqual(
      cores.filter((c) => presentes.has(c.slug)).map((c) => c.slug),
    );

    const materiaisPresentes = new Set(sala().flatMap((p) => p.materiais));
    expect(facetas().find((f) => f.chave === "material")!.opcoes.map((o) => o.slug)).toEqual(
      materiais.filter((m) => materiaisPresentes.has(m.slug)).map((m) => m.slug),
    );
  });

  test("offers the four price ranges whatever the route holds", () => {
    expect(facetas().find((f) => f.chave === "preco")!.opcoes.map((o) => o.slug)).toEqual(
      faixasDePreco.map((f) => f.slug),
    );
  });
});

// catalogo.md §§3, 7, 8 — the whole control surface a page renders
describe("the listing's controls", () => {
  const controles = (query: Record<string, string | string[]> = {}) =>
    controlesDaListagem({
      caminho: "/sala",
      conjunto: sala(),
      consulta: lerConsulta(query),
      suporte: { ambiente: false },
    });

  test("counts the whole filtered result, not the page", () => {
    expect(controles().total).toBe(sala().length);
    expect(controles().pagina.itens.length).toBe(POR_PAGINA);
  });

  test("marks a selected value and links it to its own removal", () => {
    const cor = controles({ cor: "cru" }).facetas.find((f) => f.chave === "cor")!;
    const cru = cor.opcoes.find((o) => o.slug === "cru")!;
    expect(cru.marcado).toBe(true);
    expect(cru.href).toBe("/sala");
    expect(cor.aplicada).toBe(true);
  });

  // §3 — LIMPAR only when some facet is applied, and it points at the clean path.
  test("offers LIMPAR only once a facet is applied", () => {
    expect(controles().limparHref).toBeNull();
    expect(controles({ ordem: "menor-preco" }).limparHref).toBeNull();
    expect(controles({ cor: "cru" }).limparHref).toBe("/sala");
    // LIMPAR takes the sort with it: a URL still carrying ?ordem= is not clean.
    expect(controles({ cor: "cru", ordem: "menor-preco", pagina: "2" }).limparHref).toBe("/sala");
  });

  test("keeps the other facets when one changes", () => {
    const com = controles({ cor: "cru", material: "linho" });
    const carvao = com.facetas
      .find((f) => f.chave === "cor")!
      .opcoes.find((o) => o.slug === "carvao")!;
    expect(carvao.href).toBe("/sala?cor=cru&cor=carvao&material=linho");
  });

  test("names the three sort tokens and marks the active one", () => {
    const ordenacao = controles({ ordem: "menor-preco" }).ordenacao;
    expect(ordenacao.opcoes.map((o) => o.label)).toEqual([
      "Curadoria",
      "Menor preço",
      "Maior preço",
    ]);
    expect(ordenacao.opcoes.find((o) => o.marcado)!.slug).toBe("menor-preco");
    expect(ordenacao.opcoes[0].href).toBe("/sala");
    expect(ordenacao.estado).toBe("ORDENAR · MENOR PREÇO");
  });

  test("numbers the pages, omits pagina on page one and drops the dead arrow", () => {
    const primeira = controles().paginacao!;
    expect(primeira.anterior).toBeNull();
    expect(primeira.paginas[0]).toEqual({ numero: 1, href: "/sala", atual: true });
    expect(primeira.proxima).toBe("/sala?pagina=2");

    const ultima = controles({ pagina: "3" }).paginacao!;
    expect(ultima.proxima).toBeNull();
    expect(ultima.anterior).toBe("/sala?pagina=2");
  });

  test("renders no pagination where everything fits on one page", () => {
    const escritorio = controlesDaListagem({
      caminho: "/escritorio",
      conjunto: produtosDoAmbiente("escritorio"),
      consulta: lerConsulta({}),
      suporte: { ambiente: false },
    });
    expect(escritorio.paginacao).toBeNull();
  });

  // catalogo.md §8 — a designed surface, and the régua does not render.
  test("reports zero as zero, with the way out intact", () => {
    const vazio = controles({ cor: "cru", material: "couro-natural" });
    expect(vazio.total).toBe(0);
    expect(vazio.pagina.itens).toEqual([]);
    expect(vazio.paginacao).toBeNull();
    expect(vazio.limparHref).toBe("/sala");
    expect(vazio.facetas.find((f) => f.chave === "cor")!.opcoes.length).toBeGreaterThan(0);
  });
});

// The selection the page renders, end to end
describe("selecionar", () => {
  test("filters then sorts, leaving esgotado last", () => {
    const consulta = { ...consultaVazia(), ordem: "menor-preco" as const };
    const resultado = selecionar(sala(), consulta);
    expect(resultado.length).toBe(sala().length);
    const precos = resultado
      .filter((p) => p.disponibilidade !== "esgotado")
      .map((p) => p.precoTabela);
    expect(precos).toEqual([...precos].sort((a, b) => a - b));
  });
});
