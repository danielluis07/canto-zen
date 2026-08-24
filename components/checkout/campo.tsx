"use client";

import Link from "next/link";
import type { InputHTMLAttributes } from "react";
import type { Mensagem } from "@/lib/checkout/campos";

/**
 * One labelled field, with the ink-only error treatment — `erros.md` §5.1.
 *
 * The shape is fixed there and is the same on every field in the flow: the
 * message in **Corpo S `--ink`** beneath the field, the border going `--muted` →
 * `--ink` and **still 1px**, and no icon, no colour, no `!`, no uppercase. This
 * component exists so that rule is written once — three sections' worth of
 * inputs each restating it is three chances for one of them to thicken a border.
 *
 * **Corpo S and not the annotation voice.** `erros.md` §5.3 corrects
 * `pagina-produto.md` on exactly this: the annotation voice is the *label* voice,
 * and a message set in it reads as one more field label rather than as a response
 * to something the reader just did.
 */
export function Campo({
  id,
  rotulo,
  erro,
  aoMudar,
  valor,
  opcional,
  ...atributos
}: {
  id: string;
  rotulo: string;
  erro?: Mensagem;
  valor: string;
  aoMudar: (valor: string) => void;
  /** `Complemento` is the only one — §6.1. Stated, never left to be guessed. */
  opcional?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "value" | "onChange">) {
  const idDaMensagem = `${id}-mensagem`;

  return (
    <div>
      <label htmlFor={id} className="t-annotation block text-ink">
        {rotulo}
        {opcional && <span className="ml-[0.5rem] text-muted">OPCIONAL</span>}
      </label>

      <input
        {...atributos}
        id={id}
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? idDaMensagem : undefined}
        data-filled={valor.length > 0}
        className="t-body-s mt-rhythm-2 block w-full px-rhythm-2 py-rhythm-2 text-ink"
        style={erro ? { borderColor: "var(--ink)" } : undefined}
      />

      {erro && (
        <p id={idDaMensagem} role="alert" className="t-body-s mt-rhythm-2 text-ink">
          {erro.texto}
          {/* A `Fato` states the fact **plus the way on** — `erros.md` §5.2. The
              `Corrigível` carries no link, because the fix is in the reader's
              own hands and a link would send them away from it. */}
          {erro.classe === "fato" && (
            <>
              {" "}
              <Link
                href={erro.saibaMais}
                className="underline decoration-hairline underline-offset-4 hover:text-indigo">
                Veja a política de entrega e frete
              </Link>
              .
            </>
          )}
        </p>
      )}
    </div>
  );
}
