"use client";

import { useState } from "react";
import type { LinhaDoCarrinho } from "@/lib/carrinho/conteudo";
import { Linha } from "./linha";

/**
 * The lines — `carrinho.md` §§4, 10.
 *
 * A `<ul>` and not a table: §10 refuses the table because the columns do not
 * carry a shared meaning down the page — the price of line two says nothing
 * about the price of line one, and a header row would claim otherwise.
 *
 * **One live region for the whole list**, owned here rather than per line. §4.2
 * puts the quantity figure in an `aria-live="polite"` region and §10 requires the
 * announcement to name the piece; a region wrapped around the figure alone would
 * announce `2` into a list of identical steppers, so the region holds the
 * sentence and the steppers hold the figure.
 *
 * **A removed line disappears as a cut.** There is no exit transition, and that
 * is authored: `marca.md` §9.2 closes the motion vocabulary at two entries —
 * interactive state on pointer, and the stale-content dim — and a fade to nothing
 * would spend the dim's meaning (*stale, content is coming*) on its opposite.
 */
export function Lista({ linhas }: { linhas: LinhaDoCarrinho[] }) {
  const [anuncio, definirAnuncio] = useState("");

  return (
    <>
      <ul className="border-t border-hairline">
        {linhas.map((linha) => (
          <Linha key={linha.slug} linha={linha} anunciar={definirAnuncio} />
        ))}
      </ul>

      <p aria-live="polite" className="sr-only">
        {anuncio}
      </p>
    </>
  );
}
