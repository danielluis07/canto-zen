"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  RESUMO_TITULO,
  TOTAL_ROTULO,
  VER_RESUMO,
  type ResumoDoCheckout,
} from "@/lib/checkout/conteudo";

/**
 * The resumo — `checkout.md` §§3, 6.2, 8.
 *
 * Every figure is `resumoDoCheckout`'s and this places it. **Freight is inside
 * the total here**, which is the one thing that distinguishes this resumo from
 * the cart's: `carrinho.md` §5.2 kept the estimate outside the cart's arithmetic
 * precisely so this screen could fold it in without the two pages ever
 * disagreeing — the cart promised `A PARTIR DE`, and this delivers the figure.
 *
 * **The one number in the flow that moves does so because the reader moved it**,
 * which is the opposite of the *why is my total different from what I saw?*
 * defect the cart was designed to avoid. §14 makes that movement audible: the
 * total sits in an `aria-live="polite"` region that names the new figure, because
 * the movement is the point and it must not be visual-only.
 *
 * **Sticky on desktop; a sticky bottom bar under 1024px** (§3). This is the one
 * place `carrinho.md` §5.5's refusal does not transfer: the cart refused a fixed
 * mobile bar because it would hover over its own destination, and here the
 * destination is three sections down while the total must stay legible as the
 * reader fills them. The bar covers nothing that matters, and the CTA is **not**
 * in it — it lives at the end of the Pagamento section and inside the expanded
 * sheet, never floating.
 */
export function Resumo({ resumo }: { resumo: ResumoDoCheckout }) {
  const [aberto, definirAberto] = useState(false);

  return (
    <>
      <aside className="hidden lg:block lg:sticky lg:top-[calc(var(--altura-navbar)+var(--rhythm-4))]">
        <Corpo resumo={resumo} />
      </aside>

      {/* Under 1024px the resumo is the bar, and `VER RESUMO` expands the whole
          thing upward as a sheet. It sits after the CTA in DOM order and never
          before the form (§14). */}
      <div className="lg:hidden">
        {aberto && (
          <div className="fixed inset-x-0 bottom-0 z-40 max-h-[80vh] overflow-y-auto border-t border-ink bg-kozo px-gutter pt-rhythm-4 pb-rhythm-5">
            <Corpo resumo={resumo} />
            <button
              type="button"
              onClick={() => definirAberto(false)}
              className="t-annotation mt-rhythm-4 text-muted hover:text-ink">
              FECHAR
            </button>
          </div>
        )}

        {!aberto && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink bg-kozo px-gutter py-rhythm-3">
            <div className="mx-auto flex w-full max-w-measure items-baseline justify-between gap-rhythm-3">
              <p className="t-annotation text-muted">
                {TOTAL_ROTULO.toUpperCase()}
                <span className="ml-rhythm-3 tabular-nums text-ink">{resumo.total}</span>
              </p>
              <button
                type="button"
                onClick={() => definirAberto(true)}
                className="t-annotation text-muted hover:text-ink">
                {VER_RESUMO}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function Corpo({ resumo }: { resumo: ResumoDoCheckout }) {
  return (
    <div className="border border-hairline bg-kozo px-rhythm-4 py-rhythm-4">
      <h2 className="t-annotation text-muted">{RESUMO_TITULO}</h2>

      <ul className="mt-rhythm-4">
        {resumo.linhas.map((linha) => (
          <li key={linha.slug} className="flex gap-rhythm-3 border-b border-hairline py-rhythm-3">
            {/* 64px of `--kozo` holding a **contained** packshot — never a crop.
                `checkout.md` §15 hands the 64-vs-96 reconciliation to the imagery
                ticket; until it lands, the resumo is the size §10 specified. */}
            <span className="relative h-16 w-16 shrink-0 bg-kozo">
              <Image
                src={linha.imagem.src}
                alt={linha.imagem.alt}
                fill
                sizes="64px"
                className="object-contain"
              />
            </span>

            <span className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-rhythm-3 gap-y-rhythm-1">
              <span className="min-w-0">
                {/* §6.3 — montagem and quantidade are `/carrinho`'s to change,
                    and the line is the link back to it. */}
                <Link href="/carrinho" className="t-body-s block text-ink hover:text-indigo">
                  {linha.nome}
                </Link>
                <span className="t-annotation mt-rhythm-1 block text-muted">
                  {linha.acabamento}
                  {linha.quantidade > 1 && <span className="ml-rhythm-2">× {linha.quantidade}</span>}
                </span>
                {linha.montagem?.contratada && (
                  <span className="t-body-s mt-rhythm-1 block text-muted">
                    {linha.montagem.rotulo} {linha.montagem.preco}
                  </span>
                )}
                {linha.esgotado && (
                  <span className="t-annotation mt-rhythm-1 block text-ink">
                    {linha.disponibilidade}
                  </span>
                )}
              </span>

              <span className="t-body-s shrink-0 text-ink">{linha.preco}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-rhythm-3 flex items-baseline justify-between gap-rhythm-3">
        <p className="t-body-s text-muted">{resumo.subtotalRotulo}</p>
        <p className="t-body-s text-ink">{resumo.subtotal}</p>
      </div>

      {/* §6.2 — the freight row, and the figure the modality moves. `Grátis`
          arrives as the word when the whole cart is covered; there is no zero
          here to turn back into `R$ 0,00`. */}
      <div className="mt-rhythm-2 flex items-baseline justify-between gap-rhythm-3">
        <p className="t-body-s text-muted">{resumo.freteRotulo}</p>
        <p className="t-body-s text-ink">{resumo.freteValor}</p>
      </div>

      <hr className="mt-rhythm-3" />

      <div
        role="status"
        aria-live="polite"
        className="mt-rhythm-3 flex items-baseline justify-between gap-rhythm-3">
        <p className="t-body text-ink">{TOTAL_ROTULO}</p>
        <p className="t-price text-ink">{resumo.total}</p>
      </div>

      <div className="mt-rhythm-2 flex flex-wrap items-baseline gap-x-rhythm-3 gap-y-rhythm-1">
        <p className="t-body-s text-ink">{resumo.aVista}</p>
        {/* The page's only índigo that is not interactive state (§8). */}
        <p className="t-annotation text-indigo">{resumo.pix}</p>
      </div>

      {resumo.parcelamento && (
        <p className="t-body-s mt-rhythm-1 text-muted">{resumo.parcelamento}</p>
      )}
    </div>
  );
}
