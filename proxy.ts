// `rotas.md` §6 at the routing layer — **enumerated, not generated**.
//
// `proxy.ts` is the Next 16 convention; `middleware.ts` is the deprecated name
// for the same file, and only the file and the export changed.
//
// This file exists because of one Next 16 behaviour, and it is worth stating
// plainly so nobody deletes it as ceremony:
//
// `dynamicParams = false` is enforced against the *prerendered* param set. The
// listing routes read the query (`catalogo.md` §3 makes every filter selection a
// real navigation to a server-rendered URL), so they render per request, and a
// request-rendered path never meets that check — `/cozinha/sofas` reached the
// page and answered `200` with an empty grid, which is precisely the soft-404
// the declaration exists to prevent.
//
// The page's own `notFound()` fixes the status but not the document: a
// `notFound()` raised during a render is served from Next's minimal error
// document, outside the root layout, so it loses `lang="pt-BR"`, the navbar and
// the footer — and `rodape.md` §6 makes the footer's identification
// non-negotiable on a public page. A **routing** miss does not: it serves the
// app's own `not-found` inside the root layout, with the full chrome.
//
// So the pair is decided before routing, from the same declaration the router
// reads. There is no second list here: `parEnumerado` is `Ambiente.tipos`,
// which is `rotas.md`'s own table. Sharing that module with the render is
// exactly what `proxy.js`'s "do not rely on shared modules" caveat is about,
// and it does not bite: the taxonomy is static, pure data, so a copy of it in
// this bundle is the same table and not a second source of truth.
//
// It handles **two-segment paths** only, and only the three whose first segment
// already decides what the second must be. A path under one of the four rooms
// can only ever be a room × tipo listing — `rotas.md` §1 reserves the top-level
// namespace around the four — a path under `colecoes` can only ever be a
// coleção, and a path under `produtos` can only ever be a produto, both segments
// being reserved by the same table. All three judgements are certain, and no
// future route can collide with any of them. A one-segment path is not certain
// (`/sobre` and `/varanda` are the same shape until the route exists), so it is
// left to the page's `notFound()`.
//
// `/produtos/{slug}` is here for the *document* and not for the status. That
// route reads no query, so it prerenders and `dynamicParams = false` already
// answers an unenumerated slug with a real `404` — but Next serves that one from
// its minimal error document, outside the root layout, which loses the navbar and
// the footer exactly as a rendered `notFound()` does. Refusing the slug before
// routing is what keeps the store's own page around it.
//
// `/colecoes` itself is one segment and has no `page.tsx`, so it 404s through
// the router with the app's own not-found — which is exactly what `rotas.md`'s
// *Deliberate omissions* asks of the index it refused. Nothing here has to
// arrange that, and nothing here may undo it.

import { NextResponse, type NextRequest } from "next/server";
import {
  ambientesEnumerados,
  colecaoEnumerada,
  parEnumerado,
  produtoEnumerado,
} from "@/lib/listagem/rotas";

/** Three segments, which no route in `rotas.md`'s table has. A routing miss. */
const NAO_EXISTE = "/nao-existe/nao-existe/nao-existe";

export function proxy(requisicao: NextRequest) {
  const [, primeiro, segundo, ...resto] = requisicao.nextUrl.pathname.split("/");
  const doisSegmentos = resto.length === 0 && segundo !== undefined && segundo !== "";

  const parInvalido =
    doisSegmentos &&
    ambientesEnumerados().includes(primeiro) &&
    !parEnumerado(primeiro, segundo);

  const colecaoInvalida = doisSegmentos && primeiro === "colecoes" && !colecaoEnumerada(segundo);

  const produtoInvalido = doisSegmentos && primeiro === "produtos" && !produtoEnumerado(segundo);

  if (!parInvalido && !colecaoInvalida && !produtoInvalido) return NextResponse.next();

  const destino = requisicao.nextUrl.clone();
  destino.pathname = NAO_EXISTE;
  return NextResponse.rewrite(destino);
}

/** Two-segment paths only. Everything else is none of this file's business. */
export const config = { matcher: "/:primeiro/:segundo" };
