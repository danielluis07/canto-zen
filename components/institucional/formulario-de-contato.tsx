"use client";

// The form at `/contato` — `institucional.md` §9.
//
// It is the store's **withdrawal tool** (Decreto 7.962 art. 5º §1) and it sends
// nothing, and both of those are true at once. What it does on submit is
// replace itself with `Nada foi enviado.`: no route change, no processing beat,
// no fade. The swap is an instant replacement because animating it would
// dramatise the one moment this page keeps plain (§13).
//
// The showroom beside it stays rendered throughout — the reader who submitted
// still has a real place to go.

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  CAMPOS,
  CTA_ENVIAR,
  EMAIL_INCOMPLETO,
  RESOLUCAO,
  emailPareceCompleto,
  type CampoDeContato,
  type Mira,
} from "@/lib/institucional/contato";

type Valores = Record<CampoDeContato["nome"], string>;

export function FormularioDeContato({ mira }: { mira: Mira | null }) {
  // The one thing the query parameter does to the fields: it pre-fills
  // `Mensagem`, cursor at the end. It adds no field, and there is no *assunto*
  // select for it to set (§9).
  const [valores, definirValores] = useState<Valores>(() => ({
    nome: "",
    email: "",
    mensagem: mira?.mensagemInicial ?? "",
  }));
  const [erros, definirErros] = useState<Partial<Valores>>({});
  const [enviado, definirEnviado] = useState(false);

  const resolucao = useRef<HTMLDivElement>(null);

  // §9 — the aimed link pre-fills `Mensagem` **with the cursor at the end**, so
  // the reader types the order number and nothing else. Only when the store
  // aimed the page: an unaimed `/contato` steals no focus on load.
  useEffect(() => {
    if (!mira) return;
    const campo = document.getElementById("mensagem");
    if (!(campo instanceof HTMLTextAreaElement)) return;
    campo.focus();
    campo.setSelectionRange(campo.value.length, campo.value.length);
  }, [mira]);

  const enviar = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();

    const encontrados: Partial<Valores> = {};
    for (const campo of CAMPOS) {
      const valor = valores[campo.nome].trim();
      if (!valor) encontrados[campo.nome] = campo.faltando;
      else if (campo.tipo === "email" && !emailPareceCompleto(valor)) {
        encontrados[campo.nome] = EMAIL_INCOMPLETO;
      }
    }

    definirErros(encontrados);

    // `erros.md` §5.4 — on submit, focus moves to the first invalid field.
    const primeiroInvalido = CAMPOS.find((campo) => encontrados[campo.nome]);
    if (primeiroInvalido) {
      document.getElementById(primeiroInvalido.nome)?.focus();
      return;
    }

    definirEnviado(true);
    // §13 — the swap moves focus to the resolution statement, which announces
    // itself through `role="status"`.
    queueMicrotask(() => resolucao.current?.focus());
  };

  if (enviado) {
    return (
      <div ref={resolucao} role="status" tabIndex={-1} className="max-w-reading">
        {/* `Nada foi enviado.` would be a second feature line if set in Mincho,
            so it is Body at 500 weight: the page's one Mincho grant is already
            spent on the title (§9). */}
        <p className="t-body font-medium text-ink">{RESOLUCAO.titulo}</p>
        <p className="t-body mt-rhythm-3 text-ink">{RESOLUCAO.corpo}</p>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate>
      {/* The one annotation the query parameter adds. Unrecognised or absent
          `assunto` renders the plain form, and no other value exists. */}
      {mira && <p className="t-annotation mb-rhythm-4 text-ink">{mira.anotacao}</p>}

      <div className="flex flex-col gap-rhythm-4">
        {CAMPOS.map((campo) => (
          <Campo
            key={campo.nome}
            campo={campo}
            valor={valores[campo.nome]}
            erro={erros[campo.nome]}
            aoMudar={(valor) => definirValores((atuais) => ({ ...atuais, [campo.nome]: valor }))}
          />
        ))}
      </div>

      <button
        type="submit"
        className="t-cta mt-rhythm-5 w-full border border-ink py-rhythm-3 text-ink hover:bg-ink hover:text-plaster">
        {CTA_ENVIAR}
      </button>
    </form>
  );
}

/**
 * Label above the field in the annotation voice, zero radius, 1px `--muted`
 * border (`marca.md` §6). The message resolves in ink and weight and **never in
 * red** — §3 rules e-commerce red and green out of the system — so an error
 * moves the border one step in the same warm-grey ramp, `--muted` → `--ink`,
 * still 1px, with no icon and no colour (`erros.md` §5.1).
 */
function Campo({
  campo,
  valor,
  erro,
  aoMudar,
}: {
  campo: CampoDeContato;
  valor: string;
  erro: string | undefined;
  aoMudar: (valor: string) => void;
}) {
  const idDoErro = `${campo.nome}-erro`;
  const comum = {
    id: campo.nome,
    name: campo.nome,
    value: valor,
    autoComplete: campo.autocomplete,
    "aria-invalid": erro ? (true as const) : undefined,
    "aria-describedby": erro ? idDoErro : undefined,
    "data-filled": valor.length > 0,
    className: "t-body mt-rhythm-2 w-full px-rhythm-3 py-rhythm-2 text-ink",
    style: erro ? { borderColor: "var(--ink)" } : undefined,
    onChange: (evento: { target: { value: string } }) => aoMudar(evento.target.value),
  };

  return (
    <div>
      <label htmlFor={campo.nome} className="t-annotation block text-ink">
        {campo.rotulo}
      </label>

      {campo.tipo === "textarea" ? (
        <textarea {...comum} rows={campo.linhas} />
      ) : (
        <input {...comum} type={campo.tipo} />
      )}

      {/* Corpo S and not the annotation voice — the annotation voice is the
          label voice, and a message set in it reads as one more field label
          rather than as a response to something the reader just did. */}
      {erro && (
        <p id={idDoErro} role="alert" className="t-body-s mt-rhythm-2 text-ink">
          {erro}
        </p>
      )}
    </div>
  );
}
