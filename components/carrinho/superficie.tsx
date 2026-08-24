"use client";

import Link from "next/link";
import type { CatalogoDoCarrinho } from "@/lib/carrinho/catalogo";
import {
  linhasDoCarrinho,
  resumoDoPedido,
  TITULO,
  VAZIO,
  VAZIO_LINK,
} from "@/lib/carrinho/conteudo";
import type { Carrinho } from "@/lib/carrinho/estado";
import { Lista } from "./lista";
import { Resumo } from "./resumo";

/**
 * The cart surface — `carrinho.md` — **pure over the cart it is handed**.
 *
 * The state is read one level up, in `pagina.tsx`, and that split is not
 * ceremony: a component that subscribes to the store can only ever be rendered
 * in the store's own state, and this one has three states worth asserting —
 * empty, populated, and blocked by an esgotado line. Taking the `Carrinho` as a
 * prop is what lets `tests/carrinho-marcacao.test.tsx` render each of them.
 *
 * The controls below still reach the store for their **actions** — a stepper
 * that had to be handed six callbacks would move the wiring rather than remove
 * it — but nothing beneath this point reads cart state.
 *
 * **The page has no régua, and that is authored** (§2). Every other surface
 * spends the gesture and counts it: the home two, the listing one, the PDP two.
 * The cart's subject is not matter but money and logistics, and the two figures
 * available to annotate are a sum of centimetres, which is absurd, and the item
 * count, which the reader obtains by counting the lines in front of them — a
 * decorative régua, which is precisely what the identity forbids. With none, the
 * page spends índigo exactly once outside focus rings: the Pix badge.
 */
export function Superficie({
  carrinho,
  catalogo,
}: {
  carrinho: Carrinho;
  catalogo: CatalogoDoCarrinho;
}) {
  const linhas = linhasDoCarrinho(carrinho, catalogo);

  return (
    <div className="mx-auto w-full max-w-measure px-gutter pt-rhythm-5 pb-rhythm-7">
      {/* §3 — `CARRINHO`, and nothing else: no piece count, no subtitle, no
          breadcrumb. **Not Mincho**: `navbar.md` registered the wordmark as the
          single exception to "Mincho never for interface" and the PDP spent its
          one feature line on the piece name, so a utility page does not get to
          break that twice. It takes the annotation voice, which is the treatment
          `/produtos` already gives its own non-Mincho header — `marca.md` §4's
          scale holds no Schibsted display role, and inventing one to satisfy
          §3's "at display size" would be the larger break. */}
      <h1 className="t-annotation text-ink">{TITULO}</h1>

      {linhas.length === 0 ? (
        // §7 — the pattern `catalogo.md` §8 set for zero results: keep the
        // navigation, state the fact in one line, fabricate nothing. No suggested
        // pieces, no *você pode gostar*, no recovery of a previous cart. One link
        // and not the four ambientes, which would rebuild the mega menu in the
        // page body; not zero links, which is correct on desktop and wrong on
        // mobile, where the ambientes sit behind `MENU`.
        <div className="mt-rhythm-5">
          <p className="t-body text-ink">{VAZIO}</p>
          <Link
            href="/produtos"
            className="t-annotation mt-rhythm-4 inline-block text-muted hover:text-ink">
            {VAZIO_LINK}
          </Link>
        </div>
      ) : (
        <div className="mt-rhythm-5 grid gap-y-rhythm-6 lg:grid-cols-12 lg:gap-x-gutter">
          <div className="lg:col-span-7">
            <Lista linhas={linhas} />
          </div>

          <div className="lg:col-span-5">
            <Resumo resumo={resumoDoPedido(carrinho, catalogo)} />
          </div>
        </div>
      )}
    </div>
  );
}
