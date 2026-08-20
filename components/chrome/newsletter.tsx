"use client";

// `AVISO DE NOVAS PEÇAS` — `rodape.md` §5.
//
// One field and one button, no name and no tick-box: a concept store has nowhere
// to record consent, and a checkbox that persists nothing is an interface lie.
// The LGPD note is a note for the same reason. Nothing is transmitted; the
// success state replaces the form in place, because a modal and a toast are both
// motion `marca.md` §9 does not authorise, and the error resolves in ink, since
// the palette has no traffic lights.

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";

const CORRIGIVEL = "Escreva um e-mail completo, como nome@provedor.com.br.";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [assinado, setAssinado] = useState(false);

  if (assinado) {
    return (
      <p className="t-annotation text-ink" role="status">
        PRONTO. VOCÊ SERÁ AVISADO.
      </p>
    );
  }

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    // The message states the fix and never the fault — `erros.md`'s corrigível.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErro(CORRIGIVEL);
      return;
    }
    setErro(null);
    setAssinado(true);
  };

  return (
    <form onSubmit={enviar} noValidate>
      <label htmlFor="newsletter-email" className="t-annotation block text-ink">
        AVISO DE NOVAS PEÇAS
      </label>

      <div className="mt-rhythm-2 flex flex-col gap-rhythm-2 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(evento) => setEmail(evento.target.value)}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? "newsletter-erro" : "newsletter-nota"}
          data-filled={email.length > 0}
          className="t-body-s w-full flex-1 px-rhythm-2 py-rhythm-2 text-ink"
          style={erro ? { borderColor: "var(--ink)" } : undefined}
        />
        <button
          type="submit"
          className="t-cta border border-ink px-rhythm-4 py-rhythm-2 text-ink hover:bg-ink hover:text-plaster">
          ASSINAR
        </button>
      </div>

      {erro ? (
        <p id="newsletter-erro" role="alert" className="t-body-s mt-rhythm-2 text-ink">
          {erro}
        </p>
      ) : null}

      <p id="newsletter-nota" className="t-body-s mt-rhythm-2 text-muted">
        Enviamos só quando há peça nova. Cancele quando quiser. Veja a{" "}
        <Link href="/politicas/privacidade" className="underline decoration-hairline underline-offset-4 hover:text-indigo">
          Política de privacidade
        </Link>
        .
      </p>
    </form>
  );
}
