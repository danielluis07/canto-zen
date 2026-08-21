// `rotas.md` §6 at the routing layer — **enumerated, not generated**.
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
// which is `rotas.md`'s own table.
//
// It handles the **pair** only. A two-segment path whose first segment is one of
// the four rooms can only ever be a room × tipo listing — `rotas.md` §1 reserves
// the top-level namespace around the four — so the judgement is certain and no
// future route can collide with it. A one-segment path is not certain (`/sobre`
// and `/varanda` are the same shape until the route exists), so it is left to
// the page's `notFound()`.

import { NextResponse, type NextRequest } from "next/server";
import { ambientesEnumerados, parEnumerado } from "@/lib/listagem/rotas";

/** Three segments, which no route in `rotas.md`'s table has. A routing miss. */
const NAO_EXISTE = "/nao-existe/nao-existe/nao-existe";

export function middleware(requisicao: NextRequest) {
  const [, ambiente, tipo, ...resto] = requisicao.nextUrl.pathname.split("/");

  const parInvalido =
    resto.length === 0 &&
    ambientesEnumerados().includes(ambiente) &&
    tipo !== undefined &&
    tipo !== "" &&
    !parEnumerado(ambiente, tipo);

  if (!parInvalido) return NextResponse.next();

  const destino = requisicao.nextUrl.clone();
  destino.pathname = NAO_EXISTE;
  return NextResponse.rewrite(destino);
}

/** Two-segment paths only. Everything else is none of this file's business. */
export const config = { matcher: "/:ambiente/:tipo" };
