"use client";

import type { ReactNode } from "react";

/**
 * One row of a `radiogroup` — the freight modality (§6.2) and the payment method
 * (§7) are the same control, and both resolve in **ink, never índigo**.
 *
 * `checkout.md` §8 is the reason: `marca.md` §3 declares three índigos on one
 * screen wrong, and a checkout naively built wants at least four — the Pix badge,
 * the selected Pix row, the selected freight row, and every `ALTERAR`. Resolving
 * selection in ink spends índigo **exactly once**, on the Pix discount badge,
 * which is also where the law wants the reader's eye (Lei 13.455 art. 5º-A).
 *
 * §14: these are real radios in a real `radiogroup`, not a button list. The
 * 14px ink fill is a visual treatment of the input, so keyboard semantics,
 * arrow-key navigation and the focus ring all come for free.
 */
export function Escolha({
  nome,
  valor,
  escolhido,
  aoEscolher,
  rotulo,
  detalhe,
  figura,
  children,
}: {
  nome: string;
  valor: string;
  escolhido: boolean;
  aoEscolher: () => void;
  rotulo: string;
  /** The second line — a prazo, or nothing at all. */
  detalhe?: string;
  /** The figure on the right: a freight price, or a discounted total. */
  figura?: ReactNode;
  /** What opens beneath the row once it is chosen — the card form, the Pix note. */
  children?: ReactNode;
}) {
  return (
    <div
      className="border px-rhythm-3 py-rhythm-3"
      style={{
        borderColor: escolhido ? "var(--ink)" : "var(--hairline)",
        backgroundColor: escolhido ? "var(--kozo)" : "var(--plaster)",
      }}>
      <label className="flex cursor-pointer items-baseline gap-rhythm-3">
        <input
          type="radio"
          name={nome}
          value={valor}
          checked={escolhido}
          onChange={aoEscolher}
          className="mt-[0.25rem] size-[14px] shrink-0 appearance-none border checked:bg-ink"
          style={{ borderColor: escolhido ? "var(--ink)" : "var(--muted)" }}
        />

        <span className="flex-1">
          <span className="t-annotation block text-ink">{rotulo}</span>
          {detalhe && <span className="t-body-s mt-rhythm-1 block text-muted">{detalhe}</span>}
        </span>

        {figura && <span className="t-body-s shrink-0 text-ink">{figura}</span>}
      </label>

      {escolhido && children ? <div className="mt-rhythm-4">{children}</div> : null}
    </div>
  );
}
