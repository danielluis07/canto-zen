// Filter, sort and pagination as **URL state** — `catalogo.md` §3, §7 and
// `rotas.md`'s query-parameter table.
//
// Nothing here is client state. Every selection is a real navigation to a
// server-rendered URL, which is why this module deals in two operations and
// nothing else: read a `Consulta` out of the query a request arrived with, and
// write one back into a link. There is no `APLICAR`, no draft, and no
// client-side filtering model to keep in step with the server's.
//
// Two rules run through all of it:
//
//   1. **A default is never written.** `ordem=curadoria` and `pagina=1` are the
//      route's own canonical URL, so they are omitted — `rotas.md` makes page
//      one indexable at the clean path, and a second URL for it would be the
//      duplicate the whole table exists to prevent.
//   2. **A key a surface does not support is ignored, never an error.** A room
//      route takes its room from the path and drops `?ambiente=`; `?q=` is read
//      by nothing at all, and this file is where that stays true.

import {
  ambiente as ambientePorSlug,
  cores,
  materiais,
  type Produto,
} from "../catalogo";

/** `catalogo.md` §7 — twelve divides by 3 and by 2, filling both grids exactly. */
export const POR_PAGINA = 12;

/** The three sort tokens. Nothing else gets in — `catalogo.md` §3. */
export type Ordem = "curadoria" | "menor-preco" | "maior-preco";

export type FaixaDePreco = {
  slug: string;
  label: string;
  /** Exclusive, in whole reais: the label reads *acima de*. */
  acimaDeReais: number;
  /** Inclusive, in whole reais. `null` on the open end. */
  ateReais: number | null;
};

/**
 * Four, and **store constants** — never derived from the current result set, so
 * that the same URL means the same thing on every route (`catalogo.md` §3).
 *
 * The boundaries are read the way the labels are written: `Até R$ 2.000`
 * includes 2.000 and `Acima de R$ 10.000` excludes 10.000, so the four
 * partition the catalogue with no piece in two ranges and none in none.
 */
export const faixasDePreco: FaixaDePreco[] = [
  { slug: "0-2000", label: "Até R$ 2.000", acimaDeReais: 0, ateReais: 2000 },
  { slug: "2000-5000", label: "R$ 2.000 a R$ 5.000", acimaDeReais: 2000, ateReais: 5000 },
  { slug: "5000-10000", label: "R$ 5.000 a R$ 10.000", acimaDeReais: 5000, ateReais: 10000 },
  { slug: "10000-", label: "Acima de R$ 10.000", acimaDeReais: 10000, ateReais: null },
];

export const faixaDePreco = (slug: string): FaixaDePreco | undefined =>
  faixasDePreco.find((faixa) => faixa.slug === slug);

/** The one shape every surface reads its state as. */
export type Consulta = {
  /** Any-match: a piece with `cor: cru` matches `?cor=cru&cor=carvalho`. */
  cor: string[];
  material: string[];
  preco: string | null;
  ordem: Ordem;
  /** 1-based, and 1 is the canonical route with no `?pagina=`. */
  pagina: number;
  /** Only `/produtos` supports it; a room route reads its room from the path. */
  ambiente: string | null;
};

/** The multi-select facets, which are the only ones a value toggles within. */
export type ChaveMultipla = "cor" | "material";

/** What a surface declares it supports. Everything absent is ignored on read. */
export type Suporte = { ambiente?: boolean };

export type ParametrosBrutos = Record<string, string | string[] | undefined>;

export const consultaVazia = (): Consulta => ({
  cor: [],
  material: [],
  preco: null,
  ordem: "curadoria",
  pagina: 1,
  ambiente: null,
});

// ---------------------------------------------------------------------------
// Reading
// ---------------------------------------------------------------------------

/**
 * The query a request arrived with, as a `Consulta`.
 *
 * Every unknown value is **dropped**, not rejected: `?cor=roxo` is a link
 * somebody edited or a taxonomy that moved, and the honest answer to it is the
 * unfiltered room rather than an error page or a zero-result state that blames
 * the reader for a colour the store never had.
 */
export const lerConsulta = (brutos: ParametrosBrutos, suporte: Suporte = {}): Consulta => ({
  cor: lerConjunto(brutos.cor, cores.map((c) => c.slug)),
  material: lerConjunto(brutos.material, materiais.map((m) => m.slug)),
  preco: faixaDePreco(primeiro(brutos.preco) ?? "")?.slug ?? null,
  ordem: lerOrdem(primeiro(brutos.ordem)),
  pagina: lerPagina(primeiro(brutos.pagina)),
  ambiente: suporte.ambiente ? lerAmbiente(primeiro(brutos.ambiente)) : null,
});

const primeiro = (bruto: string | string[] | undefined): string | undefined =>
  Array.isArray(bruto) ? bruto[0] : bruto;

/**
 * Repeated keys, deduplicated and **put back into taxonomy order**, so that
 * `?cor=carvao&cor=cru` and `?cor=cru&cor=carvao` are one URL rather than two
 * spellings of one result set.
 */
const lerConjunto = (bruto: string | string[] | undefined, conhecidos: string[]): string[] => {
  if (bruto === undefined) return [];
  const pedidos = new Set(Array.isArray(bruto) ? bruto : [bruto]);
  return conhecidos.filter((slug) => pedidos.has(slug));
};

const lerOrdem = (bruto: string | undefined): Ordem =>
  bruto === "menor-preco" || bruto === "maior-preco" ? bruto : "curadoria";

const lerPagina = (bruto: string | undefined): number => {
  if (bruto === undefined || !/^\d+$/.test(bruto)) return 1;
  const numero = Number(bruto);
  return numero >= 1 ? numero : 1;
};

const lerAmbiente = (bruto: string | undefined): string | null =>
  bruto !== undefined && ambientePorSlug(bruto) ? bruto : null;

// ---------------------------------------------------------------------------
// Writing
// ---------------------------------------------------------------------------

/**
 * A `Consulta` as the query string it is written back as, in the key order of
 * `rotas.md`'s table. Defaults are omitted, so `consultaVazia()` writes nothing
 * and the canonical route is the path alone.
 */
export const paraQuery = (consulta: Consulta): string => {
  const params = new URLSearchParams();
  for (const slug of consulta.cor) params.append("cor", slug);
  for (const slug of consulta.material) params.append("material", slug);
  if (consulta.preco) params.set("preco", consulta.preco);
  if (consulta.ordem !== "curadoria") params.set("ordem", consulta.ordem);
  if (consulta.pagina > 1) params.set("pagina", String(consulta.pagina));
  if (consulta.ambiente) params.set("ambiente", consulta.ambiente);
  return params.toString();
};

/** The link a control points at — a path plus whatever state survives on it. */
export const href = (caminho: string, consulta: Consulta): string => {
  const query = paraQuery(consulta);
  return query ? `${caminho}?${query}` : caminho;
};

/**
 * Every change below returns to page one. `catalogo.md` §3: page 3 of a
 * different result set is not a place, so `pagina` is discarded on any filter
 * or sort change rather than carried into a set that may not have three pages.
 */
const naPrimeiraPagina = (consulta: Consulta): Consulta => ({ ...consulta, pagina: 1 });

/** Marks a value, or unmarks it — the panel is a set of links, not checkboxes. */
export const alternarValor = (
  consulta: Consulta,
  chave: ChaveMultipla,
  slug: string,
): Consulta => {
  const atual = consulta[chave];
  const proximo = atual.includes(slug)
    ? atual.filter((valor) => valor !== slug)
    : [...atual, slug];
  const conhecidos = (chave === "cor" ? cores : materiais).map((entrada) => entrada.slug);
  return naPrimeiraPagina({
    ...consulta,
    [chave]: conhecidos.filter((valor) => proximo.includes(valor)),
  });
};

/** Single select — overlapping ranges are a filter nobody reasons about. */
export const definirPreco = (consulta: Consulta, slug: string | null): Consulta =>
  naPrimeiraPagina({ ...consulta, preco: consulta.preco === slug ? null : slug });

export const definirAmbiente = (consulta: Consulta, slug: string | null): Consulta =>
  naPrimeiraPagina({ ...consulta, ambiente: consulta.ambiente === slug ? null : slug });

export const definirOrdem = (consulta: Consulta, ordem: Ordem): Consulta =>
  naPrimeiraPagina({ ...consulta, ordem });

export const definirPagina = (consulta: Consulta, pagina: number): Consulta => ({
  ...consulta,
  pagina,
});

/** Whether any *facet* is applied. The sort is not one, and neither is a page. */
export const temFiltro = (consulta: Consulta): boolean =>
  consulta.cor.length > 0 ||
  consulta.material.length > 0 ||
  consulta.preco !== null ||
  consulta.ambiente !== null;

// ---------------------------------------------------------------------------
// Applying
// ---------------------------------------------------------------------------

/** Facets intersect; values within a facet any-match (`catalogo.md` §3). */
export const aplicarFiltros = (produtos: Produto[], consulta: Consulta): Produto[] =>
  produtos.filter(
    (produto) =>
      (consulta.cor.length === 0 || consulta.cor.includes(produto.cor)) &&
      (consulta.material.length === 0 ||
        consulta.material.some((slug) => produto.materiais.includes(slug))) &&
      (consulta.ambiente === null || produto.ambientes.includes(consulta.ambiente)) &&
      naFaixa(produto, consulta.preco),
  );

const naFaixa = (produto: Produto, slug: string | null): boolean => {
  if (slug === null) return true;
  const faixa = faixaDePreco(slug);
  if (!faixa) return true;
  const reaisDoProduto = produto.precoTabela / 100;
  return (
    reaisDoProduto > faixa.acimaDeReais &&
    (faixa.ateReais === null || reaisDoProduto <= faixa.ateReais)
  );
};

/**
 * `esgotado` goes last **within whatever sort is active** — `catalogo.md` §§3,
 * 6. Hiding it would make the count lie; sorting it in among the rest would put
 * a piece nobody can buy at the top of `menor-preco`.
 */
export const aplicarOrdem = (produtos: Produto[], ordem: Ordem): Produto[] =>
  [...produtos].sort((a, b) => {
    const esgotadoA = a.disponibilidade === "esgotado" ? 1 : 0;
    const esgotadoB = b.disponibilidade === "esgotado" ? 1 : 0;
    if (esgotadoA !== esgotadoB) return esgotadoA - esgotadoB;

    switch (ordem) {
      case "menor-preco":
        return a.precoTabela - b.precoTabela || a.ordem - b.ordem;
      case "maior-preco":
        return b.precoTabela - a.precoTabela || a.ordem - b.ordem;
      case "curadoria":
        return a.ordem - b.ordem;
    }
  });

/** The whole result set the régua counts — filtered and sorted, not yet cut. */
export const selecionar = (produtos: Produto[], consulta: Consulta): Produto[] =>
  aplicarOrdem(aplicarFiltros(produtos, consulta), consulta.ordem);

export type Pagina = {
  itens: Produto[];
  /** The page actually shown, which is the requested one clamped to the end. */
  pagina: number;
  paginas: number;
  /** The full result count — what the régua states, not the cards on screen. */
  total: number;
};

/**
 * A page past the end is **clamped**, never rendered as an empty grid: the
 * filters match, so `Nenhuma peça com esses filtros.` would be a lie, and the
 * zero-results surface is reserved for the state that is actually empty (§8).
 */
export const paginar = (produtos: Produto[], pagina: number): Pagina => {
  const paginas = Math.max(1, Math.ceil(produtos.length / POR_PAGINA));
  const atual = Math.min(Math.max(1, pagina), paginas);
  const inicio = (atual - 1) * POR_PAGINA;

  return {
    itens: produtos.slice(inicio, inicio + POR_PAGINA),
    pagina: atual,
    paginas,
    total: produtos.length,
  };
};
