import type { Metadata } from "next";
import { headers } from "next/headers";
import { Navbar } from "@/components/chrome/navbar";
import { Rodape } from "@/components/chrome/rodape";
import { BlocoDeRecuperacao } from "@/components/erros/recuperacao";
import {
  CABECALHO_DE_AMBIENTE,
  CORPO_DO_404,
  TITULO_DO_404,
  recuperacao,
} from "@/lib/erros/conteudo";

/**
 * The one not-found surface — `erros.md` §2.3: every `404` in the route table
 * lands here, and there is no second one.
 *
 * It sits outside both route groups, so it states its own navbar, `<main>` and
 * footer rather than inheriting them — `app/layout.tsx` gives a route outside
 * the groups none of the three, deliberately. The footer is not optional here:
 * `rodape.md` §6 makes the razão social, the CNPJ and the arrependimento notice
 * non-negotiable on a public page, and §2.1 asks this surface for the full
 * chrome because a 404 has no funnel to protect — it *is* navigation.
 *
 * **No photograph and no régua** (§1's two ausências autoradas). A photograph
 * would force the page to pick a piece, which turns a failure into a
 * merchandising act; a régua is reverence for an object, and there is no object
 * here.
 *
 * Reading the header makes this page dynamic, and the `force-dynamic` below is
 * not ceremony: without it Next builds `/_not-found` as a static shell and puts
 * the header-reading subtree behind a Suspense boundary, which on a non-streamed
 * `404` is never filled in — the response comes back with the right status, the
 * right title and an **empty body**. Declaring the route dynamic renders it
 * whole, in one pass, with no boundary to postpone.
 *
 * The `404` survives that because §2.4's contract holds around it: there is no
 * `loading.tsx` anywhere, so nothing puts a fallback in front of the response
 * and the status is still the router's to set when the first byte goes out.
 * `tests/erros.test.ts` asserts both halves — the status and the body.
 */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

export default async function NaoEncontrada() {
  const ambiente = (await headers()).get(CABECALHO_DE_AMBIENTE);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-measure px-gutter pt-rhythm-7 pb-rhythm-7">
          <h1 className="t-display-l max-w-aside text-ink">{TITULO_DO_404}</h1>
          <p className="t-body mt-rhythm-4 max-w-reading text-ink">{CORPO_DO_404}</p>
          <BlocoDeRecuperacao recuperacao={recuperacao(ambiente)} />
        </div>
      </main>
      <Rodape variante="completo" />
    </>
  );
}
