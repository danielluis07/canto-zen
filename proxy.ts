// `rotas.md` §6 and §7 at the routing layer — **enumerated, not generated**.
//
// `proxy.ts` is the Next 16 convention; `middleware.ts` is the deprecated name
// for the same file, and only the file and the export changed.
//
// This file exists because of one Next 16 behaviour, and it is worth stating
// plainly so nobody deletes it as ceremony. There are **three** ways a request
// can end up a `404` in this app, and only one of them renders the store's own
// page:
//
// 1. **`dynamicParams = false` refuses a param.** Answered from Next's minimal
//    error document — a real `404` status with an empty `<body>`, no
//    `lang="pt-BR"`, no navbar and no footer.
// 2. **`notFound()` is raised during a render.** The same minimal document, for
//    the same reason: it is served outside the root layout.
// 3. **No route matches the path at all.** *This* one renders `app/not-found.tsx`
//    inside the root layout, with the full chrome.
//
// `rodape.md` §6 makes the footer's razão social, CNPJ and arrependimento notice
// non-negotiable on a public page, and `erros.md` §2.1 asks the 404 for that
// chrome because a 404 has no funnel to protect — it *is* navigation. So every
// `404` in the route table has to be turned into case 3, before routing, and
// that is the whole of this file: a path the table does not enumerate is
// rewritten to a path Next cannot resolve.
//
// Two consequences worth naming:
//
// - **`/cozinha/sofas` never reaches the page.** `dynamicParams = false` is
//   enforced against the *prerendered* param set, and the listing routes read
//   the query (`catalogo.md` §3 makes every filter selection a real navigation),
//   so they render per request and never meet that check at all. The page's own
//   `notFound()` fixes the status but not the document (case 2). Deciding the
//   pair here fixes both.
// - **The room travels with it.** `erros.md` §2.2's ambiente-matched recovery
//   block needs to know which room was asked for, and the rewrite destroys the
//   path. It goes as a request header, set only when the first segment is one of
//   the four — see `CABECALHO_DE_AMBIENTE`.
//
// There is no second list here. `parEnumerado` is `Ambiente.tipos`, which is
// `rotas.md`'s own table; `paginasDeTopo` is that table's one-segment column,
// transcribed once and held to the route tree by `tests/erros.test.ts`. Sharing
// those modules with the render is exactly what `proxy.js`'s "do not rely on
// shared modules" caveat is about, and it does not bite: the taxonomy is static,
// pure data, so a copy of it in this bundle is the same table and not a second
// source of truth.
//
// The judgements it makes are all certain, and no future route can collide with
// any of them:
//
// - **One segment** is a page or it is nothing — `rotas.md` §1 reserves the
//   whole top-level namespace, and `paginasDeTopo` is what it reserves it for.
//   `/colecoes` and `/politicas` are absent from that list on purpose: neither
//   has an index, so both are a `404` the map asked for.
// - **Two segments** can only ever be what their first segment already decides —
//   a room × tipo listing, a coleção, a produto, an article or a policy — and
//   under any other first segment, nothing. `institucional.md` §11 retires
//   `prazos-e-entrega`, so that URL is a live inbound link in the wild and has
//   to land on the store's own 404 rather than on Next's bare one.
// - **Three or more** matches no route in the table, so it is already case 3 and
//   this file leaves it alone. `NAO_EXISTE` is one of them, which is why it is
//   the destination.

import { NextResponse, type NextRequest } from "next/server";
import { CABECALHO_DE_AMBIENTE } from "@/lib/erros/conteudo";
import { artigoEnumerado } from "@/lib/inspiracoes/conteudo";
import { politicaEnumerada } from "@/lib/institucional/politicas";
import {
  ambientesEnumerados,
  colecaoEnumerada,
  paginaDeTopo,
  parEnumerado,
  produtoEnumerado,
} from "@/lib/listagem/rotas";

/** Three segments, which no route in `rotas.md`'s table has. A routing miss. */
const NAO_EXISTE = "/nao-existe/nao-existe/nao-existe";

/** What a two-segment path may be, by the segment that decides it. */
const SOB_O_PRIMEIRO: Record<string, (slug: string) => boolean> = {
  colecoes: colecaoEnumerada,
  produtos: produtoEnumerado,
  inspiracoes: artigoEnumerado,
  politicas: politicaEnumerada,
};

export function proxy(requisicao: NextRequest) {
  const [, primeiro = "", segundo, ...resto] = requisicao.nextUrl.pathname.split("/");

  // The home, and anything three segments deep: already case 3, or a real page.
  if (primeiro === "" || resto.length > 0) return NextResponse.next();

  const umSegmento = segundo === undefined || segundo === "";
  const emUmAmbiente = ambientesEnumerados().includes(primeiro);

  const existe = umSegmento
    ? paginaDeTopo(primeiro)
    : emUmAmbiente
      ? parEnumerado(primeiro, segundo)
      : (SOB_O_PRIMEIRO[primeiro]?.(segundo) ?? false);

  if (existe) return NextResponse.next();

  const destino = requisicao.nextUrl.clone();
  destino.pathname = NAO_EXISTE;

  // Only the pair carries the room. A one-segment miss has no room to offer —
  // `/varanda` is not an ambiente, which is why it missed — and a bad produto or
  // article slug says nothing about where in the catalogue the reader was.
  if (umSegmento || !emUmAmbiente) return NextResponse.rewrite(destino);

  const cabecalhos = new Headers(requisicao.headers);
  cabecalhos.set(CABECALHO_DE_AMBIENTE, primeiro);
  return NextResponse.rewrite(destino, { request: { headers: cabecalhos } });
}

/**
 * Every path but Next's own assets and the files served from `public/`. The
 * matcher has to be this wide because case 1 above reaches routes this file
 * used to ignore — a one-segment miss lands on `[ambiente]`, not on nothing.
 */
export const config = {
  matcher: "/((?!_next/|favicon\\.ico|.*\\.[^/]+$).*)",
};
