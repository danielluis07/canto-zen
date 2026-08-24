"use client";

import Link from "next/link";
import {
  CORPO_DO_ERRO,
  IR_PARA_O_INICIO,
  TENTAR_NOVAMENTE,
  TITULO_DO_ERRO,
} from "@/lib/erros/conteudo";

/**
 * `erros.md` §3.1 — the unexpected error, in the same lane as the 404: the
 * policy template's plain single-column text lane, ink on `--plaster`,
 * left-aligned in the grid and never centred in the viewport.
 *
 * The body names the fault as the store's without apologising for it and tells
 * the reader the one thing they can act on. It never shows a stack trace or an
 * error code: a concept store that displays `Error: ECONNREFUSED` has broken
 * the "intentional and well-made, not an error" condition `checkout.md` set for
 * the whole build. `error.digest` exists for the server logs and stays there.
 *
 * Two actions, and only the first is a button — `IR PARA O INÍCIO` is a plain
 * link, because a second button would read as a second offer of equal weight.
 * `global-error.tsx` renders this with the link withheld: a boundary that
 * catches the root layout cannot honestly promise the home.
 */
export function SuperficieDeErro({
  tentarNovamente,
  comInicio = true,
}: {
  tentarNovamente: () => void;
  comInicio?: boolean;
}) {
  return (
    <div className="mx-auto w-full max-w-measure px-gutter pt-rhythm-7 pb-rhythm-7">
      <h1 className="t-display-l max-w-aside text-ink">{TITULO_DO_ERRO}</h1>
      <p className="t-body mt-rhythm-4 max-w-reading text-ink">{CORPO_DO_ERRO}</p>

      <div className="mt-rhythm-6 flex flex-wrap items-center gap-rhythm-5">
        <button
          type="button"
          onClick={tentarNovamente}
          className="t-cta border border-ink px-rhythm-4 py-rhythm-2 text-ink hover:bg-ink hover:text-plaster">
          {TENTAR_NOVAMENTE}
        </button>

        {comInicio ? (
          <Link href="/" className="t-cta text-ink hover:text-indigo">
            {IR_PARA_O_INICIO}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
