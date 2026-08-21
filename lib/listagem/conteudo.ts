// The listing's reasoning, kept out of the components.
//
// `catalogo.md` makes four routes one template: what changes between them is the
// header and which controls render — never the grid and never the card. So the
// selection, the order, the régua's figure and every line the card states are
// composed here, once, and the components only place them.
//
// Filtering, sorting and pagination are **not** here: `catalogo.md` §3 and §7
// are a separate surface with query state of their own, and this file selects
// the whole set in the default curatorial order that surface will re-sort.

import {
  ambiente,
  linhaDeParcelamento,
  politicas,
  precoAVista,
  reais,
  tipo,
  todosOsProdutos,
  type Produto,
} from "../catalogo";

/**
 * `produto.ordem` ascending, with `esgotado` last within it — `catalogo.md` §3.
 *
 * Sold-out pieces appear and never disappear: hiding them would make the count
 * lie and would pretend a made-to-order atelier never sells out. All that
 * changes is where they sit and what the disponibilidade line says.
 */
export const emOrdemDeCuradoria = (produtos: Produto[]): Produto[] =>
  [...produtos].sort((a, b) => {
    const esgotadoA = a.disponibilidade === "esgotado" ? 1 : 0;
    const esgotadoB = b.disponibilidade === "esgotado" ? 1 : 0;
    return esgotadoA - esgotadoB || a.ordem - b.ordem;
  });

/**
 * Everything that lists under a room — `produto.ambientes`, the complete set,
 * never `ambientePrincipal`. A bench belonging to Quarto and Sala appears in
 * both listings; `ambientePrincipal` decides only the PDP breadcrumb
 * (`catalogo.md` §10, `rotas.md`).
 */
export const produtosDoAmbiente = (slug: string): Produto[] =>
  emOrdemDeCuradoria(todosOsProdutos().filter((p) => p.ambientes.includes(slug)));

/** That room's slice of one tipo. A produto carries exactly one tipo. */
export const produtosDoTipo = (slugAmbiente: string, slugTipo: string): Produto[] =>
  produtosDoAmbiente(slugAmbiente).filter((p) => p.tipo === slugTipo);

// ---------------------------------------------------------------------------
// The lines a surface states
// ---------------------------------------------------------------------------

/**
 * The opening régua's label — `catalogo.md` §4. This page's régua **is** the
 * result count, which is what stops the signature from becoming texture on the
 * one page that repeats a layout twelve times.
 *
 * `null` at zero: `0 PEÇAS` annotates a grid that does not exist, and an empty
 * régua is prohibited by `marca.md` §2. The prohibition bites here as designed.
 */
export const rotuloDaContagem = (n: number): string | null =>
  n === 0 ? null : `${n} ${n === 1 ? "PEÇA" : "PEÇAS"}`;

/**
 * The card's single annotation line — acabamento · largura · disponibilidade,
 * in that order (`catalogo.md` §6). The width is read from `medidas.largura`
 * and never hand-written: `produto.md` kept cm out of `nome` on the promise
 * that the cota would carry it, and on a card that may not have a régua (§4)
 * this line is that promise kept.
 */
export const linhaDoCartao = (produto: Produto): string =>
  [produto.acabamento, `L ${produto.medidas.largura} CM`, disponibilidadeEmTexto(produto)]
    .join(" · ")
    .toUpperCase();

/** §6's table. No state colour — the distinction that matters is in the text. */
export const disponibilidadeEmTexto = (produto: Produto): string => {
  switch (produto.disponibilidade) {
    case "envio-imediato":
      return "ENVIO IMEDIATO";
    case "esgotado":
      return "ESGOTADO";
    case "sob-encomenda":
      return `SOB ENCOMENDA · ${produto.prazoProducaoSemanas} SEMANAS`;
  }
};

/** The à-vista figure the card sets in Body, tabular — derived, never stored. */
export const precoDoCartao = (produto: Produto): string => reais(precoAVista(produto.precoTabela));

/** `precoDe` when the piece carries one, struck through before the price. */
export const precoAnteriorDoCartao = (produto: Produto): string | null =>
  produto.precoDe === undefined ? null : reais(produto.precoDe);

/**
 * The policy line — `catalogo.md` §7. Both figures come from `politicas`, never
 * hand-written, and the parcelamento survives **once per listing** rather than
 * on twelve cards: twelve cards × two price lines is a price table, and índigo
 * spent twelve times is two more than `marca.md` §3 permits.
 */
export const linhaDePolitica = (): string =>
  `${politicas.descontoPixPercent}% À VISTA NO PIX · ATÉ ${politicas.parcelasMax}X SEM JUROS`;

/**
 * The parcelamento the store can actually offer on one piece — the largest
 * `N ≤ parcelasMax` whose parcela clears the minimum. It is what the policy
 * line's "até" resolves to for that price, and the PDP states it per piece.
 */
export const parcelamentoEmTexto = (produto: Produto): string => {
  const { parcelas, valorCentavos } = linhaDeParcelamento(produto.precoTabela);
  return `${parcelas}x de ${reais(valorCentavos)} sem juros`;
};

// ---------------------------------------------------------------------------
// The header, per route — catalogo.md §1
// ---------------------------------------------------------------------------

export type Cabecalho = {
  /** Annotation voice, above the title. `null` on `/produtos`. */
  sobretitulo: string | null;
  titulo: string;
  /** Mincho is for piece names, coleção titles and editorial titles only. */
  mincho: boolean;
  /** One authored sentence at `34ch`, or nothing at all. */
  prosa: string | null;
};

export const cabecalhoDoAmbiente = (slug: string): Cabecalho => {
  const encontrado = exigirAmbiente(slug);
  return {
    sobretitulo: "AMBIENTE",
    titulo: encontrado.label,
    mincho: true,
    prosa: encontrado.descricao,
  };
};

/**
 * The tipo listing inherits the room's eyebrow instead of prose of its own:
 * four rooms × ~5 tipos is ~20 authored texts nobody reads, and `SALA / Sofás`
 * already says the whole thing at no authoring cost (`catalogo.md` §1).
 */
export const cabecalhoDoTipo = (slugAmbiente: string, slugTipo: string): Cabecalho => ({
  sobretitulo: exigirAmbiente(slugAmbiente).label.toUpperCase(),
  titulo: exigirTipo(slugTipo).label,
  mincho: true,
  prosa: null,
});

// ---------------------------------------------------------------------------
// The tipo band — catalogo.md §2
// ---------------------------------------------------------------------------

export type ItemDaBanda = { label: string; href: string; ativo: boolean };

/**
 * `TODAS` first, then the room's curated tipos in the exact order of `rotas.md`
 * — the same order as the navbar panel, read from the same table.
 *
 * The band is not the panel repeated: the panel is revealed on intent and
 * disappears, the band is the page's permanent state, and it is what makes a
 * tipo visibly a landable path rather than a filter.
 */
export const bandaDeTipos = (slugAmbiente: string, slugTipoAtivo?: string): ItemDaBanda[] => {
  const encontrado = exigirAmbiente(slugAmbiente);
  return [
    {
      label: "TODAS",
      href: `/${encontrado.slug}`,
      ativo: slugTipoAtivo === undefined,
    },
    ...encontrado.tipos.map((slug) => ({
      label: exigirTipo(slug).label.toUpperCase(),
      href: `/${encontrado.slug}/${slug}`,
      ativo: slug === slugTipoAtivo,
    })),
  ];
};

const exigirAmbiente = (slug: string) => {
  const encontrado = ambiente(slug);
  if (!encontrado) throw new Error(`no such ambiente: ${slug}`);
  return encontrado;
};

const exigirTipo = (slug: string) => {
  const encontrado = tipo(slug);
  if (!encontrado) throw new Error(`no such tipo: ${slug}`);
  return encontrado;
};

// ---------------------------------------------------------------------------
// Metadata — rotas.md §§1–2
// ---------------------------------------------------------------------------

export type Metadados = { titulo: string; descricao: string };

/**
 * The room's description is **authored**: `ambiente.descricao`, verbatim, the
 * same sentence the page header shows. `rotas.md` §2's rule 2 adds no field for
 * the metadata layer, and where an authored sentence already exists it *is* the
 * description.
 */
export const metadadosDoAmbiente = (slug: string): Metadados => {
  const encontrado = exigirAmbiente(slug);
  return { titulo: encontrado.label, descricao: encontrado.descricao };
};

/**
 * The tipo listing's title **lowercases the room label** — a derivation, not a
 * field, which is why there is no `Ambiente.labelPreposicional` anywhere in the
 * module. Its description is computed from facts the record already holds.
 */
export const metadadosDoTipo = (slugAmbiente: string, slugTipo: string): Metadados => {
  const amb = exigirAmbiente(slugAmbiente);
  const tip = exigirTipo(slugTipo);
  const n = produtosDoTipo(slugAmbiente, slugTipo).length;

  return {
    titulo: `${tip.label} para ${amb.label.toLowerCase()}`,
    descricao: `${tip.label} para ${amb.label}: ${n} peças assinadas, feitas sob encomenda em madeira maciça.`,
  };
};
