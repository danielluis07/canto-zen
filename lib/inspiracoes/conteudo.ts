// Inspirações' reasoning, kept out of the components.
//
// The lane is two routes and one genre: an index of four rows and an article
// that is a room, composed (`inspiracoes.md` §2). Everything a component places
// is resolved here — the ambiente read back as an annotation, the legend's
// produto slugs turned into names and hrefs, the fecho's one exit — so that the
// components hold layout and nothing else, exactly as `lib/home/conteudo.ts`
// and `lib/produto/conteudo.ts` do for their surfaces.
//
// **What this file may not compose is as load-bearing as what it does.** There
// is no price line, no parcelamento, no Pix badge and no régua anywhere below,
// and none of them is an omission: §3 makes both absences the identity claim
// this surface makes. A piece named in an article is a name and a link; the
// figure is one click away on its PDP. So this module imports nothing from
// `lib/produto/conteudo.ts` — the price helpers are not merely unused here,
// they are unavailable by construction.

import { ambiente, artigo, artigos, produto, type Figura, type FotoArtigo } from "../catalogo";

// ---------------------------------------------------------------------------
// §5 — the index
// ---------------------------------------------------------------------------

/**
 * The Mincho line names **the act, not the section**: the navbar has already
 * said "Inspirações" and the browser tab repeats it (`rotas.md` §1), so
 * spending the page's one Display L on the word would say it a third time.
 */
export const TITULO_DO_INDICE = "Quatro ambientes, compostos.";

/**
 * The Body line beneath it — one sentence, no invitation and no "descubra". It
 * states what the reader is looking at *and that the set is complete*, which is
 * what makes the index read as finished rather than sparse (§2).
 *
 * `rotas.md` §2 ships this line verbatim as the route's description, so it is
 * written once and read twice rather than paraphrased into a meta tag.
 */
export const LINHA_DO_INDICE =
  "Uma sala, um quarto, uma cozinha e um escritório fotografados com as peças que os compõem — quatro ambientes, e o conjunto está completo.";

export type LinhaDoIndice = {
  slug: string;
  /** Annotation voice, so the room arrives cased — as the home's row does. */
  ambiente: string;
  titulo: string;
  /** ONE line. The index row and the home row read the same field. */
  resumo: string;
  thumb: Figura;
  href: string;
};

/**
 * Four rows, uniform, peers, in the authored `ordem` — **never recency**
 * (§5.5). `Artigo.ambiente` is required and unique across the four, so every
 * row carries its annotation and there is no room-less article to fall back
 * for.
 *
 * This is `home.md` §6's row at page scale, deliberately: the home's three rows
 * are a literal excerpt of this index rather than a second design of the same
 * object, which is why both surfaces read the same fields.
 */
export const linhasDoIndice = (): LinhaDoIndice[] =>
  emOrdem().map((a) => ({
    slug: a.slug,
    ambiente: exigirAmbiente(a.ambiente).label.toUpperCase(),
    titulo: a.titulo,
    resumo: a.resumo,
    thumb: a.thumb,
    href: `/inspiracoes/${a.slug}`,
  }));

// ---------------------------------------------------------------------------
// §6 — the article
// ---------------------------------------------------------------------------

/** One name in a legend: `POLTRONA LINA`, linking to the piece it photographs. */
export type PecaNaLegenda = { slug: string; nome: string; href: string };

export type FotoNaPagina = {
  src: string;
  alt: string;
  /** A **position instruction**: `[0]` establishes the room, `[1]` and `[2]` close in. */
  papel: "ampla" | "detalhe";
  legenda: PecaNaLegenda[];
};

export type ArtigoNaPagina = {
  slug: string;
  ambiente: string;
  titulo: string;
  abertura: string;
  fotos: [FotoNaPagina, FotoNaPagina, FotoNaPagina];
  passagens: [string, string];
  /** Exactly one exit, and it is real navigation to a listing that exists. */
  fecho: { rotulo: string; href: string };
};

/**
 * One article, resolved. The skeleton is **fixed and identical across all
 * four** (§6.1) — three photographs and two passagens, in that interleaving —
 * so the page renders deterministically from the data and needs no layout
 * engine of its own, which is the same move `pagina-produto.md` §7 made when it
 * turned image `papel` into an instruction of position.
 *
 * There is no `data`, no `autor`, no `categoria` and no free-Markdown `corpo`
 * on the way in (§8), and nothing here invents one on the way out.
 *
 * Throws on an unknown slug rather than returning `undefined`: the route
 * enumerates the four before this is ever called, so a miss here is a broken
 * enumeration and not a reader's typo.
 */
export const paginaDoArtigo = (slug: string): ArtigoNaPagina => {
  const encontrado = exigirArtigo(slug);
  const sala = exigirAmbiente(encontrado.ambiente);
  const [ampla, primeiroDetalhe, segundoDetalhe] = encontrado.fotos;

  return {
    slug: encontrado.slug,
    ambiente: sala.label.toUpperCase(),
    titulo: encontrado.titulo,
    abertura: encontrado.abertura,
    fotos: [comLegenda(ampla), comLegenda(primeiroDetalhe), comLegenda(segundoDetalhe)],
    passagens: encontrado.passagens,
    fecho: {
      rotulo: `VER TODAS AS PEÇAS EM ${sala.label.toUpperCase()}`,
      href: `/${sala.slug}`,
    },
  };
};

/**
 * §6.5 — the legend, and the only mechanism by which a room story reaches the
 * catálogo. The names are the pieces **visible in that frame**, in reading
 * order, each listed once per article; the invariant suite asserts both the
 * two-to-five range and the no-duplicate rule over all twelve frames.
 *
 * The link resolves to a `Produto` and never to a `Familia`, because a família
 * has no page — so the acabamento actually photographed is the one the reader
 * lands on. There is no thumbnail, no price, no availability and no cart
 * affordance beside a name: a card strip here is `catalogo.md`'s object
 * imported onto the one surface that is not a catalogue.
 */
const comLegenda = (foto: FotoArtigo): FotoNaPagina => ({
  src: foto.src,
  alt: foto.alt,
  papel: foto.papel,
  legenda: foto.pecas.map((slugDaPeca) => {
    const peca = produto(slugDaPeca);
    if (!peca) throw new Error(`a legenda names no produto: ${slugDaPeca}`);
    return { slug: peca.slug, nome: peca.nome.toUpperCase(), href: `/produtos/${peca.slug}` };
  }),
});

// ---------------------------------------------------------------------------
// The route space — §7.2, `rotas.md` §7
// ---------------------------------------------------------------------------

/**
 * The four slugs, in authored order. The set is **structurally complete** — one
 * per Ambiente — so this enumerates content rather than sampling it, and
 * `/inspiracoes/[slug]` outside it is a `404` with no empty state behind it.
 */
export const artigosEnumerados = (): string[] => emOrdem().map((a) => a.slug);

/** Whether `/inspiracoes/{slug}` is a place. `inspiracoes` is a reserved segment. */
export const artigoEnumerado = (slug: string): boolean => artigos.some((a) => a.slug === slug);

// ---------------------------------------------------------------------------
// Metadata — `rotas.md` §§1–2
// ---------------------------------------------------------------------------

/**
 * **`/inspiracoes` must say the word**, and the tab is the only place it
 * appears: §5.2 keeps it out of the cabeçalho precisely because the navbar has
 * already said it, which makes the title not optional. The description is that
 * cabeçalho's Body line verbatim.
 */
export const METADADOS_DO_INDICE = {
  titulo: "Inspirações",
  descricao: LINHA_DO_INDICE,
};

/** `titulo` and `resumo` are the natural `<title>` and description (§10). */
export const metadadosDoArtigo = (slug: string): { titulo: string; descricao: string } => {
  const encontrado = exigirArtigo(slug);
  return { titulo: encontrado.titulo, descricao: encontrado.resumo };
};

// ---------------------------------------------------------------------------

/** `ordem` is the authored index order — never table position, never recency. */
const emOrdem = () => [...artigos].sort((a, b) => a.ordem - b.ordem);

const exigirArtigo = (slug: string) => {
  const encontrado = artigo(slug);
  if (!encontrado) throw new Error(`no such artigo: ${slug}`);
  return encontrado;
};

const exigirAmbiente = (slug: string) => {
  const encontrado = ambiente(slug);
  if (!encontrado) throw new Error(`an artigo names no ambiente: ${slug}`);
  return encontrado;
};
