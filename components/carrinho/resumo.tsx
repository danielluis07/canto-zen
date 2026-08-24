"use client";

import Link from "next/link";
import {
  CONTINUAR,
  CTA,
  RESUMO_TITULO,
  TOTAL_ROTULO,
  type ResumoDoPedido,
} from "@/lib/carrinho/conteudo";
import { Frete } from "./frete";

const ID_DO_BLOQUEIO = "carrinho-bloqueio";

/**
 * The resumo do pedido — `carrinho.md` §5.
 *
 * Every figure below is derived and none is typed: the composition is
 * `resumoDoPedido`'s, and this places it.
 *
 * **`Subtotal` → rule → `Total`, and nothing between them** (§5.1). No montagem
 * row — §4.3 put it inside the line, so it is inside the subtotal, and breaking
 * it out again here would read as double-counting. No frete row — §5.2 keeps the
 * estimate outside the arithmetic, stated beneath the sum in its own voice.
 *
 * **The order of the price tiers is the PDP buy box's** (§5.4): `Total` leads,
 * à-vista beneath it, parcelamento third. Inverting the hierarchy here would make
 * two screens disagree about which number is *the* price.
 *
 * **Sticky on desktop, and no fixed bar on mobile** (§5.5). The PDP refused both,
 * but the reasoning there was about what the chrome would cover — the family
 * drawing and the measurements table. The cart has nothing underneath worth
 * protecting, so the resumo sticks; a floating mobile CTA, on the other hand,
 * would hover over its own destination.
 */
export function Resumo({ resumo }: { resumo: ResumoDoPedido }) {
  return (
    <aside className="border border-hairline bg-kozo px-rhythm-4 py-rhythm-4 lg:sticky lg:top-[calc(var(--altura-navbar)+var(--rhythm-4))]">
      <h2 className="t-annotation text-muted">{RESUMO_TITULO}</h2>

      <div className="mt-rhythm-4 flex items-baseline justify-between gap-rhythm-3">
        {/* The summed quantidade, and the only place that number appears — a
            label, not a count-as-ornament. The page has no régua (§2). */}
        <p className="t-body-s text-muted">{resumo.subtotalRotulo}</p>
        <p className="t-body-s text-ink">{resumo.subtotal}</p>
      </div>

      <hr className="mt-rhythm-3" />

      <div className="mt-rhythm-3 flex items-baseline justify-between gap-rhythm-3">
        <p className="t-body text-ink">{TOTAL_ROTULO}</p>
        <p className="t-price text-ink">{resumo.total}</p>
      </div>

      <div className="mt-rhythm-2 flex flex-wrap items-baseline gap-x-rhythm-3 gap-y-rhythm-1">
        <p className="t-body-s text-ink">{resumo.aVista}</p>
        {/* The page's only índigo that is not interactive state (§2), and the
            disclosure Lei 10.962 art. 5º-A requires *em local e formato
            visíveis* for a discount tied to the payment instrument. */}
        <p className="t-annotation text-indigo">{resumo.pix}</p>
      </div>

      {resumo.parcelamento && (
        <p className="t-body-s mt-rhythm-1 text-muted">{resumo.parcelamento}</p>
      )}

      <Frete estimativa={resumo.frete} />

      {/* §5.3 — the synthesis §4.4 promised. The per-line annotations state the
          facts; this states their consequence, and neither reorders anything. */}
      {resumo.entregas && <p className="t-body-s mt-rhythm-4 text-ink">{resumo.entregas}</p>}

      {/* §6 — `aria-disabled` rather than `disabled`, so the button keeps its
          place in the tab order and its reason can be read from it. A control
          that vanishes from the tab order takes its explanation with it. */}
      {resumo.bloqueio ? (
        <button
          type="button"
          aria-disabled
          aria-describedby={ID_DO_BLOQUEIO}
          className="t-cta mt-rhythm-5 w-full cursor-not-allowed border border-hairline py-rhythm-3 text-muted">
          {CTA}
        </button>
      ) : (
        <Link
          href="/checkout"
          className="t-cta mt-rhythm-5 block w-full border border-ink py-rhythm-3 text-center text-ink hover:bg-ink hover:text-plaster">
          {CTA}
        </Link>
      )}

      {resumo.bloqueio && (
        <p id={ID_DO_BLOQUEIO} className="t-annotation mt-rhythm-2 text-ink">
          {resumo.bloqueio}
        </p>
      )}

      {/* Not a button: two buttons of similar weight make the reader choose
          between them (§5.5). */}
      <Link
        href="/produtos"
        className="t-annotation mt-rhythm-4 inline-block text-muted hover:text-ink">
        {CONTINUAR}
      </Link>

      {/* §5.4 — prose, not a badge. The notice is ostensive by law and appears
          inline in buy box, cart and confirmation; the montagem clause renders
          only when some line has one contracted. */}
      <p className="t-body-s mt-rhythm-4 text-muted">{resumo.arrependimento}</p>
    </aside>
  );
}
