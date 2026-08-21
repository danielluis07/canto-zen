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

import { ambiente, ambientes, colecoes } from "../catalogo";

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
