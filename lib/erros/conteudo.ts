// The error surfaces' copy and their one derived offer — `erros.md` §2 and §3.
//
// Everything a 404 or a 500 says lives here as data, for the same reason the
// rest of the store's copy does: the page renders it, it does not author it, so
// a test can assert the string without rendering anything.
//
// The one thing computed here is the recovery block (§2.2), and it is
// **enumerated, not generated**: both variants read `Ambiente.tipos` — the
// table `rotas.md` §2 fixes and the navbar mega-menu already reads. There is no
// second list, and no guess about what the reader meant.

import { ambiente, ambientes, tipo } from "../catalogo";

/**
 * The one thing the `proxy.ts` rewrite carries forward — §2.2's ambiente-matched
 * variant.
 *
 * The rewrite destroys the path the reader asked for, and `app/not-found.tsx`
 * has no params of its own to read it back from, so the room travels as a
 * request header. It is set **only** when the first segment is one of the four,
 * which is the whole of §2.2's condition; the page reads its absence as the
 * generic variant and never has to decide anything itself. The name lives here
 * rather than in `proxy.ts` so that the page does not have to import the proxy
 * bundle in order to read one string.
 */
export const CABECALHO_DE_AMBIENTE = "x-canto-zen-ambiente";

/** §2.1 — one 404, one copy. What varies is the offer, never the voice. */
export const TITULO_DO_404 = "Não há nada neste endereço.";

export const CORPO_DO_404 =
  "O catálogo é enumerado: cada ambiente e cada tipo têm um endereço próprio. Este não é um deles.";

/** §3.1 — the unexpected error. The fault is named as the store's, not apologised for. */
export const TITULO_DO_ERRO = "Algo quebrou aqui.";

export const CORPO_DO_ERRO =
  "A falha é nossa, não do que você fez. Recarregar esta página costuma bastar.";

export const TENTAR_NOVAMENTE = "TENTAR NOVAMENTE";

export const IR_PARA_O_INICIO = "IR PARA O INÍCIO";

export type Ligacao = { label: string; href: string };

/**
 * §2.2 — an annotation-voice heading, a list of plain links, and one way out in
 * CTA voice. Never buttons: a dead end may not carry more CTA weight than a
 * produto page does.
 */
export type Recuperacao = { titulo: string; ofertas: Ligacao[]; saida: Ligacao };

const maiusculas = (texto: string): string => texto.toLocaleUpperCase("pt-BR");

/**
 * The offer, read from the path's first segment.
 *
 * **Generic** — the segment is not one of the four rooms, so the offer is the
 * four rooms and the flat catalogue.
 *
 * **Ambiente-matched** — the segment *is* a room, which is the case a shopper
 * actually reaches by trimming or guessing a URL (`/sala/mesas`: `mesas` is a
 * real tipo, just not one Sala exposes). The offer becomes that room's real
 * tipos. The heading and the body above it do not change: this is a different
 * offer, never a different claim about what the reader meant.
 */
export const recuperacao = (primeiroSegmento?: string | null): Recuperacao => {
  const sala = primeiroSegmento ? ambiente(primeiroSegmento) : undefined;

  if (!sala) {
    return {
      titulo: "CONTINUE POR AQUI",
      ofertas: ambientes.map((a) => ({ label: a.label, href: `/${a.slug}` })),
      saida: { label: "VER TODAS AS PEÇAS", href: "/produtos" },
    };
  }

  return {
    titulo: `TIPOS EM ${maiusculas(sala.label)}`,
    ofertas: sala.tipos.map((slug) => ({
      label: tipo(slug)?.label ?? slug,
      href: `/${sala.slug}/${slug}`,
    })),
    saida: { label: `VER TUDO EM ${maiusculas(sala.label)}`, href: `/${sala.slug}` },
  };
};
