"use client";

import Link from "next/link";
import { mascaraDeCelular, mascaraDeCpf } from "@/lib/checkout/campos";
import { CONTINUAR, LGPD_HREF, LGPD_LINK, LGPD_PROPOSITO } from "@/lib/checkout/conteudo";
import type { Erros, Rascunho } from "@/lib/checkout/estado";
import { Campo } from "./campo";

/**
 * Section 01 — `checkout.md` §5. Four fields, in the order Brazilian checkouts
 * put them (research §5): e-mail, CPF, nome completo, celular.
 *
 * **No Pessoa física / Pessoa jurídica toggle** (§5). The store has an
 * Escritório room, which is the real argument for one, and it is thin: the room
 * sells a home office, not a procurement channel, and the toggle drags in CNPJ,
 * Razão Social, Inscrição Estadual, a second validation rule and an NF-e question
 * a concept store has no business implying it can answer.
 *
 * **No account creation, no password, no *salvar meus dados*** — auth is out of
 * scope map-wide.
 *
 * **And no LGPD consent checkbox.** The legal basis is art. 7º V, execução de
 * contrato, not consent: the store cannot honour a refusal and still deliver, so
 * a tick-box would offer a choice that does not exist. What closes the section is
 * a purpose *line* instead, carrying the two clauses the legal-copy verification
 * §4 requires — the conditionality art. 9º §3 wants stated *com destaque*, and
 * the route to the rights art. 9º VII asks be given *acesso facilitado*.
 */
export function Identificacao({
  rascunho,
  erros,
  editar,
  aoContinuar,
}: {
  rascunho: Rascunho;
  erros: Erros;
  editar: (mudanca: Partial<Rascunho>) => void;
  aoContinuar: () => void;
}) {
  return (
    <div className="max-w-reading">
      <div className="grid gap-rhythm-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Campo
            id="checkout-email"
            rotulo="E-MAIL"
            type="email"
            inputMode="email"
            autoComplete="email"
            valor={rascunho.email}
            erro={erros.email}
            aoMudar={(email) => editar({ email })}
          />
        </div>

        <Campo
          id="checkout-cpf"
          rotulo="CPF"
          inputMode="numeric"
          autoComplete="off"
          placeholder="000.000.000-00"
          valor={rascunho.cpf}
          erro={erros.cpf}
          aoMudar={(cpf) => editar({ cpf: mascaraDeCpf(cpf) })}
        />

        <Campo
          id="checkout-celular"
          rotulo="CELULAR"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(00) 00000-0000"
          valor={rascunho.celular}
          erro={erros.celular}
          aoMudar={(celular) => editar({ celular: mascaraDeCelular(celular) })}
        />

        <div className="sm:col-span-2">
          {/* One field, never first name and surname — §5. */}
          <Campo
            id="checkout-nome"
            rotulo="NOME COMPLETO"
            autoComplete="name"
            valor={rascunho.nome}
            erro={erros.nome}
            aoMudar={(nome) => editar({ nome })}
          />
        </div>
      </div>

      <p className="t-body-s mt-rhythm-4 text-muted">
        {LGPD_PROPOSITO}{" "}
        {/* A legal duty may not cost the shopper their filled form, so it opens
            in a new tab — the treatment the reduced footer already gives Termos
            de uso (§5). */}
        <Link
          href={LGPD_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className="underline decoration-hairline underline-offset-4 hover:text-indigo">
          {LGPD_LINK}
        </Link>
        .
      </p>

      <button
        type="button"
        onClick={aoContinuar}
        className="t-cta mt-rhythm-5 border border-ink px-rhythm-5 py-rhythm-3 text-ink hover:bg-ink hover:text-plaster">
        {CONTINUAR}
      </button>
    </div>
  );
}
