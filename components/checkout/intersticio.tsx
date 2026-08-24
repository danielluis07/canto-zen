"use client";

import { useEffect, useRef } from "react";
import {
  INTERSTICIO_CTA,
  INTERSTICIO_EYEBROW,
  INTERSTICIO_PARAGRAFO,
  INTERSTICIO_TITULO,
  PROCESSANDO_ANUNCIO,
} from "@/lib/checkout/conteudo";

/**
 * The beat — `checkout.md` §2.2.
 *
 * A near-opaque `--plaster` wash over the whole viewport and one centred
 * annotation line, for **1500ms and no longer**. The beat exists to set an
 * expectation, not to simulate work: a longer wait is the same lie with more
 * syllables.
 *
 * **No spinner, no progress bar, no percentage.** A spinner would be the first
 * non-typographic UI element in the system — `marca.md` §6 permits no such thing
 * — and a progress figure would be an invented number.
 *
 * `prefers-reduced-motion` needs no branch, because nothing here moves: there is
 * a delay and an opacity layer, and no animation at all. The wash **arrives as a
 * cut** — it is mounted, not faded in, and `marca.md` §9's closed list of two is
 * not spent on it.
 *
 * §14: `role="status"` `aria-live="polite"`, so the line is announced.
 */
export function Processando() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--plaster)]/95 px-gutter">
      <p className="t-annotation text-muted">{PROCESSANDO_ANUNCIO}</p>
    </div>
  );
}

/**
 * The interstitial — `checkout.md` §2.3.
 *
 * Full viewport, `--plaster`, vertically centred, on the standard 12-column grid
 * with the statement on the left **7 columns and the right gutter left empty** —
 * the asymmetry `marca.md` §5 makes the default.
 *
 * **This is not a route.** It is a phase of `/checkout`, so `rotas.md`'s table is
 * unchanged: it has no URL, no history entry, and the back button from it returns
 * to the cart rather than to a half-submitted form. **No footer, no navbar** —
 * the only way forward is the button, and this is the one surface in the store
 * with no chrome, which is what makes it read as a held breath rather than a page.
 *
 * **The Mincho line is within budget, not an exception.** `marca.md` §4 allows a
 * single feature line per page and the interstitial is its own surface; it does
 * not inherit the checkout's Mincho spend, which is zero (§3).
 *
 * **No régua** — `marca.md` §2 and the precedent `carrinho.md` §2 set. There is
 * no real figure here to annotate, and the only candidate — a price that was not
 * charged — would be the most dishonest cota in the system. **No índigo** either,
 * except the focus ring on the button.
 *
 * The paragraph **names what is real before it names what is not**. The order is
 * deliberate: the sentence that could read as an apology instead reads as an
 * account of what the reader just used.
 */
export function Intersticio({ aoVerOPedido }: { aoVerOPedido: () => void }) {
  const titulo = useRef<HTMLHeadingElement>(null);

  // §14 — the interstitial receives focus on its heading when it replaces the
  // beat, so a reader who is not looking at the screen is not left on a control
  // that no longer exists.
  useEffect(() => {
    titulo.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center overflow-y-auto bg-plaster">
      <div className="mx-auto w-full max-w-measure px-gutter py-rhythm-7">
        <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-span-7">
            <p className="t-annotation text-muted">{INTERSTICIO_EYEBROW}</p>

            <h1
              ref={titulo}
              tabIndex={-1}
              className="t-display-xl mt-rhythm-4 text-ink outline-none">
              {INTERSTICIO_TITULO}
            </h1>

            <p className="t-body mt-rhythm-5 max-w-[64ch] text-ink">{INTERSTICIO_PARAGRAFO}</p>

            <button
              type="button"
              onClick={aoVerOPedido}
              className="t-cta mt-rhythm-6 border border-ink px-rhythm-5 py-rhythm-3 text-ink hover:bg-ink hover:text-plaster">
              {INTERSTICIO_CTA}
            </button>
          </div>
          {/* The right gutter is left empty on purpose — `marca.md` §5. */}
        </div>
      </div>
    </div>
  );
}
