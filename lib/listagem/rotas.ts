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

import { ambiente, ambientes } from "../catalogo";

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
