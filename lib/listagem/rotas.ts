// The enumerated room × tipo space.
//
// `rotas.md` §6 fixes that valid pairs are **declared, not generated**: anything
// else is a 404 rather than an empty grid. The declaration is `Ambiente.tipos`,
// which is `rotas.md`'s own Type taxonomy table already transcribed into the
// catálogo module — so this file enumerates, it never authors. A second list
// here would be the drift the single table exists to prevent.
//
// The router spends these at build time (`generateStaticParams`), which is why
// an unenumerated pair never reaches a page that would have to validate it.

import { ambiente, ambientes, colecoes, existeProduto, slugsDeProdutos } from "../catalogo";

export type ParDeRota = { ambiente: string; tipo: string };

/** Every room, in the authored order — the four top-level paths. */
export const ambientesEnumerados = (): string[] => ambientes.map((a) => a.slug);

/** Every declared pair, room by room, each room's tipos in its curated order. */
export const paresEnumerados = (): ParDeRota[] =>
  ambientes.flatMap((a) => a.tipos.map((tipo) => ({ ambiente: a.slug, tipo })));

/**
 * Whether `/{ambiente}/{tipo}` is a place. `/cozinha/sofas` is not: `sofas` is
 * a real tipo and `cozinha` a real room, and the pair is still nowhere.
 */
export const parEnumerado = (slugAmbiente: string, slugTipo: string): boolean =>
  ambiente(slugAmbiente)?.tipos.includes(slugTipo) ?? false;

// ---------------------------------------------------------------------------
// Coleções — rotas.md's `/colecoes/[slug]`
// ---------------------------------------------------------------------------

/**
 * The coleções that have a page, in the authored order of the table.
 *
 * There is **no `/colecoes` index**, and its absence is a decision rather than
 * a gap: `rotas.md`'s *Deliberate omissions* rules it out as a thin page that
 * would need its own spec and its own navbar slot, coleções being a
 * merchandising device surfaced in context on the home and inside Inspirações.
 * The segment stays reserved, so `/colecoes` is a `404` — which is exactly what
 * a route tree with a `[slug]` and no `page.tsx` beside it already answers. A
 * stub that redirected or listed the two would be the page the map refused.
 */
export const colecoesEnumeradas = (): string[] => colecoes.map((c) => c.slug);

/** Whether `/colecoes/{slug}` is a place. Everything else under it is a 404. */
export const colecaoEnumerada = (slug: string): boolean =>
  colecoes.some((c) => c.slug === slug);

// ---------------------------------------------------------------------------
// Produtos — rotas.md's `/produtos/[slug]`, flat
// ---------------------------------------------------------------------------

/**
 * Every produto slug. The router prerenders exactly these and answers `404` for
 * anything else, which is what makes `dynamicParams = false` a real enumeration
 * on this route rather than a declaration: the page reads no query, so it never
 * renders per request the way the listings do.
 */
export const produtosEnumerados = (): string[] => slugsDeProdutos();

/** Whether `/produtos/{slug}` is a place. `produtos` is a reserved segment. */
export const produtoEnumerado = (slug: string): boolean => existeProduto(slug);

// ---------------------------------------------------------------------------
// The top-level namespace — rotas.md §1's reserved segments
// ---------------------------------------------------------------------------

/**
 * Every one-segment path that is a page, in the order `rotas.md`'s route table
 * lists them.
 *
 * This exists for `proxy.ts` and for one Next behaviour it has to work around:
 * a path that reaches `[ambiente]` and fails `dynamicParams = false` is answered
 * from Next's **minimal error document** — a real `404`, with an empty `<body>`
 * and no chrome at all. Only a path that matches *no route whatsoever* renders
 * the app's own `not-found` inside the root layout. So the proxy has to know
 * which one-segment paths are real in order to send the rest somewhere Next
 * cannot resolve, and this is that list.
 *
 * Two segments the table reserves are deliberately **absent**, because neither
 * has an index and both are a `404` on purpose: `/colecoes` (`rotas.md`'s
 * *Deliberate omissions*) and `/politicas`, whose four documents are only ever
 * reached by slug.
 *
 * It is a transcription of a table and not a second source of truth, and
 * `tests/erros.test.ts` holds it to that: every directory with a `page.tsx`
 * directly under a route group must appear here, and nothing else may.
 */
export const paginasDeTopo = (): string[] => [
  ...ambientesEnumerados(),
  "produtos",
  "inspiracoes",
  "carrinho",
  "sobre",
  "contato",
];

/** Whether `/{segmento}` is a page. The home is not a segment and never asks. */
export const paginaDeTopo = (segmento: string): boolean =>
  paginasDeTopo().includes(segmento);
