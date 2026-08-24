"use client";

import type { ReactNode } from "react";
import { ALTERAR, SECOES } from "@/lib/checkout/conteudo";
import type { Secao as NumeroDaSecao } from "@/lib/checkout/estado";

/**
 * One accordion section — `checkout.md` §4.
 *
 * **Sequential, one open at a time; completed sections collapse to a summary
 * line with `ALTERAR`.** The collapsed summary is what keeps three sections plus
 * a sticky resumo inside one screen; without it the single-page decision
 * produces a page nobody can see the end of.
 *
 * **The lock is soft.** A later section can be opened at any time — the header
 * is a button in every state — it simply cannot be *submitted* while an earlier
 * one is incomplete, which the CTA says out loud (§9). Hard-locking produces a
 * dead form with no explanation, which is worse than a button that says why.
 *
 * §14: the section is a `<section>` with its heading, and the collapsed summary
 * is associated to `ALTERAR` by `aria-describedby`, so the button's target is
 * audible rather than being a bare verb repeated three times down the page.
 */
export function Secao({
  numero,
  aberta,
  resumo,
  aoAbrir,
  children,
}: {
  numero: NumeroDaSecao;
  aberta: boolean;
  /** The collapsed lines, or `null` while the section has nothing to summarise. */
  resumo: string[] | null;
  aoAbrir: () => void;
  children: ReactNode;
}) {
  const { numero: rotulo, titulo } = SECOES[numero];
  const idDoResumo = `checkout-resumo-${numero}`;
  const idDoTitulo = `checkout-titulo-${numero}`;

  return (
    <section aria-labelledby={idDoTitulo} className="border-t border-hairline pt-rhythm-4">
      <div className="flex items-baseline justify-between gap-rhythm-3">
        <h2 id={idDoTitulo} className="t-annotation text-ink">
          {/* `NN` in `--muted`, the title in `--ink` — §4. */}
          <span className="mr-[1.25rem] text-muted">{rotulo}</span>
          {titulo}
        </h2>

        {/* `ALTERAR` reopens in place and collapses whichever was open. No
            scroll jump, no confirmation (§4). It renders only where there is
            something to go back to — a bare `ALTERAR` above an empty section
            offers to change nothing. */}
        {!aberta && resumo && (
          <button
            type="button"
            onClick={aoAbrir}
            aria-describedby={idDoResumo}
            className="t-annotation shrink-0 text-muted hover:text-ink">
            {ALTERAR}
          </button>
        )}
      </div>

      {aberta ? (
        <div className="mt-rhythm-4 pb-rhythm-5">{children}</div>
      ) : resumo ? (
        // Corpo S, `--muted`, indented to clear the number — §4.
        <div id={idDoResumo} className="mt-rhythm-2 pb-rhythm-4 pl-[3.5rem]">
          {resumo.map((linha) => (
            <p key={linha} className="t-body-s text-muted">
              {linha}
            </p>
          ))}
        </div>
      ) : (
        <div className="pb-rhythm-4">
          <button
            type="button"
            onClick={aoAbrir}
            className="t-annotation mt-rhythm-2 ml-[3.5rem] text-muted hover:text-ink">
            ABRIR
          </button>
        </div>
      )}
    </section>
  );
}
