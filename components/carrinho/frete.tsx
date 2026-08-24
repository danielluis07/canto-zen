"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { CEP_CORRIGIVEL, cepTemOitoDigitos } from "@/lib/catalogo";
import {
  FRETE_ALTERAR,
  FRETE_BOTAO,
  FRETE_CALCULE,
  FRETE_NOTA,
  type EstimativaDeFrete,
} from "@/lib/carrinho/conteudo";
import { useLojaDoCarrinho } from "@/lib/carrinho/estado";
import { CEP_PLACEHOLDER, mascaraDeCep } from "@/lib/produto/cep";

/**
 * The freight line inside the resumo — `carrinho.md` §5.2.
 *
 * **One estimate, and it is outside the arithmetic.** Not the PDP's option
 * table: the modality choice belongs to the checkout, after the full address
 * exists. And not folded into `Total`: a number folded into a total is a promise,
 * and if freight entered the sum here and moved in the checkout when the buyer
 * chose *entrega agendada*, the two screens would disagree about the price —
 * the failure a Brazilian storefront is punished hardest for.
 *
 * The figure itself is `estimarFrete`'s, computed below the DOM against the same
 * rule the PDP quotes. What this component holds is the field: the mask is the
 * PDP's, the `Corrigível` is the PDP's, and the answer re-quotes in place because
 * the estimate is derived from the store's CEP rather than from a local copy.
 *
 * With no CEP in session — a cart reached without a PDP visit — the line **is**
 * the field, which is §5.2's stated fallback rather than an empty slot.
 */
export function Frete({ estimativa }: { estimativa: EstimativaDeFrete }) {
  const lembrarCepDe = useLojaDoCarrinho((estado) => estado.lembrarCepDe);

  const cepAtual = estimativa.estado === "sem-cep" ? "" : estimativa.cep;
  const [aberto, definirAberto] = useState(false);
  const [entrada, definirEntrada] = useState(cepAtual);
  const [corrigivel, definirCorrigivel] = useState(false);

  const abrir = () => {
    // Pre-filled — §5.2. Asking for the same CEP a second time is the defect the
    // session CEP exists to avoid, and re-opening the field is not a new question.
    definirEntrada(cepAtual);
    definirCorrigivel(false);
    definirAberto(true);
  };

  const calcular = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    if (!cepTemOitoDigitos(entrada)) {
      definirCorrigivel(true);
      return;
    }
    definirCorrigivel(false);
    lembrarCepDe(entrada);
    definirAberto(false);
  };

  const campo = aberto || estimativa.estado === "sem-cep";

  return (
    <div className="mt-rhythm-4">
      {!campo && estimativa.estado === "estimado" && (
        <>
          {/* `Grátis` arrives as the word when the cart's every line is covered:
              there is no figure here to turn back into `R$ 0,00`. */}
          <p className="t-annotation text-muted">{estimativa.linha}</p>
          <p className="t-annotation mt-rhythm-1 text-muted">
            {`${FRETE_NOTA} · `}
            <button type="button" onClick={abrir} className="t-annotation text-muted hover:text-ink">
              {FRETE_ALTERAR}
            </button>
          </p>
        </>
      )}

      {!campo && estimativa.estado === "nao-atendida" && (
        <>
          {/* A `Fato`, not a `Corrigível`: the CEP is correctly typed and the
              limit is the store's. It states the limit and offers the way on, and
              the field is never marked invalid for it — `erros.md` §5.2. */}
          <p role="status" className="t-body-s text-ink">
            {`${estimativa.mensagem} `}
            <Link
              href={estimativa.saibaMais}
              className="underline decoration-hairline underline-offset-4 hover:text-indigo">
              Veja a política de entrega e frete
            </Link>
            .
          </p>
          <p className="t-annotation mt-rhythm-2 text-muted">
            <button type="button" onClick={abrir} className="t-annotation text-muted hover:text-ink">
              {FRETE_ALTERAR}
            </button>
          </p>
        </>
      )}

      {campo && (
        <form onSubmit={calcular} noValidate>
          <label htmlFor="carrinho-cep" className="t-annotation block text-ink">
            {FRETE_CALCULE}
          </label>

          <div className="mt-rhythm-2 flex flex-wrap items-center gap-x-rhythm-3 gap-y-rhythm-2">
            <input
              id="carrinho-cep"
              name="cep"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder={CEP_PLACEHOLDER}
              value={entrada}
              onChange={(evento) => definirEntrada(mascaraDeCep(evento.target.value))}
              aria-invalid={corrigivel ? true : undefined}
              aria-describedby={corrigivel ? "carrinho-cep-erro" : undefined}
              data-filled={entrada.length > 0}
              className="t-body-s w-[9ch] px-rhythm-2 py-rhythm-2 text-ink"
              // Errors resolve in ink and typographic weight — no colour, no
              // icon, no thickening (`erros.md` §5.1).
              style={corrigivel ? { borderColor: "var(--ink)" } : undefined}
            />

            <button
              type="submit"
              className="t-cta border border-ink px-rhythm-4 py-rhythm-2 text-ink hover:bg-ink hover:text-plaster">
              {FRETE_BOTAO}
            </button>
          </div>

          {/* Corpo S and not the annotation voice — a message set in the label
              voice reads as another field label (`erros.md` §5.3). */}
          {corrigivel && (
            <p id="carrinho-cep-erro" role="alert" className="t-body-s mt-rhythm-2 text-ink">
              {CEP_CORRIGIVEL.mensagem}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
