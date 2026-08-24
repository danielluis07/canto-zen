"use client";

// `CALCULAR FRETE E PRAZO` — `pagina-produto.md` §2.7.
//
// The widget is wiring and nothing else: the mask, the resolution, the option
// rows and both error messages are `lib/produto/cep.ts`'s, tested at seam 1. No
// figure is computed here, and nothing is fetched, transmitted or persisted —
// the fixture table is the catálogo's, and the only thing that outlives the
// component is `Carrinho.cep`, in this browser tab.
//
// **Below the CTA and above montagem**, which is §2.7's stated position: the
// table expands over several lines and would push `COMPRAR` off screen if it sat
// above. It renders in `esgotado` too — it is information about the piece, not
// about the order.

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import { useCarrinho, useLojaDoCarrinho } from "@/lib/carrinho/estado";
import {
  BUSCA_CORREIOS,
  CEP_BOTAO,
  CEP_NAO_SEI,
  CEP_PLACEHOLDER,
  CEP_TITULO,
  consultarFrete,
  mascaraDeCep,
  type PecaParaFrete,
  type ResultadoDoCep,
} from "@/lib/produto/cep";

export function Cep({ peca }: { peca: PecaParaFrete }) {
  const carrinho = useCarrinho();
  const lembrarCepDe = useLojaDoCarrinho((estado) => estado.lembrarCepDe);

  // Typed once, it holds for the whole session: a reader who quoted a CEP on
  // another produto finds this field filled and already answered. Asking for the
  // same CEP three times is the defect §2.7's convention exists to avoid.
  const [entrada, definirEntrada] = useState(() =>
    carrinho.cep ? mascaraDeCep(carrinho.cep) : "",
  );
  const [resultado, definirResultado] = useState<ResultadoDoCep | null>(() =>
    carrinho.cep ? consultarFrete(carrinho.cep, peca) : null,
  );

  const calcular = (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const resposta = consultarFrete(entrada, peca);
    definirResultado(resposta);
    // A `Corrigível` is a typo, and a typo is not a CEP to carry into checkout.
    // Both `Fato` answers are remembered: an unserved CEP is still the reader's.
    if (resposta.estado !== "corrigivel") lembrarCepDe(entrada);
  };

  const corrigivel = resultado?.estado === "corrigivel";

  return (
    <section className="mt-rhythm-5">
      <form onSubmit={calcular} noValidate>
        <label htmlFor="cep" className="t-annotation block text-ink">
          {CEP_TITULO}
        </label>

        <div className="mt-rhythm-2 flex flex-wrap items-center gap-x-rhythm-4 gap-y-rhythm-2">
          <input
            id="cep"
            name="cep"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder={CEP_PLACEHOLDER}
            value={entrada}
            onChange={(evento) => definirEntrada(mascaraDeCep(evento.target.value))}
            aria-invalid={corrigivel ? true : undefined}
            aria-describedby={corrigivel ? "cep-erro" : undefined}
            data-filled={entrada.length > 0}
            className="t-body-s w-[9ch] px-rhythm-2 py-rhythm-2 text-ink"
            // The field's border goes --muted → --ink on an error, still 1px:
            // no colour, no icon, no thickening — `erros.md` §5.1.
            style={corrigivel ? { borderColor: "var(--ink)" } : undefined}
          />

          <button
            type="submit"
            className="t-cta border border-ink px-rhythm-4 py-rhythm-2 text-ink hover:bg-ink hover:text-plaster">
            {CEP_BOTAO}
          </button>

          <a
            href={BUSCA_CORREIOS}
            target="_blank"
            rel="noopener noreferrer"
            className="t-annotation ml-auto text-muted hover:text-ink">
            {CEP_NAO_SEI}
          </a>
        </div>

        {/* Corpo S and not the annotation voice — `erros.md` §5.3 corrects §2.7
            on exactly this: the annotation voice is the label voice, so a
            message set in it reads as another field label rather than as a
            response to something the reader just did. */}
        {corrigivel && (
          <p id="cep-erro" role="alert" className="t-body-s mt-rhythm-2 text-ink">
            {resultado.mensagem}
          </p>
        )}
      </form>

      {resultado?.estado === "nao-atendida" && (
        // A Fato, not a Corrigível: the CEP is correctly typed and the limit is
        // the store's. It states the fact and offers the way on, and the field
        // is never marked invalid for it.
        <p role="status" className="t-body-s mt-rhythm-3 text-ink">
          {`${resultado.mensagem} `}
          <Link
            href={resultado.saibaMais}
            className="underline decoration-hairline underline-offset-4 hover:text-indigo">
            Veja a política de entrega e frete
          </Link>
          .
        </p>
      )}

      {resultado?.estado === "cotado" && (
        <div role="status" className="mt-rhythm-3">
          {/* A fixture autofills; a served CEP resolves its region and autofills
              nothing, so this line is simply absent — the mock states only what
              it knows. */}
          {resultado.endereco && (
            <p className="t-annotation text-muted">{resultado.endereco}</p>
          )}

          <dl className="mt-rhythm-3 border-t border-hairline">
            {resultado.opcoes.map((opcao) => (
              <div
                key={opcao.rotulo}
                className="flex flex-wrap items-baseline gap-x-rhythm-3 border-b border-hairline py-rhythm-2">
                <dt className="t-annotation text-ink">{opcao.rotulo}</dt>
                <dd className="t-annotation text-muted">{opcao.detalhe}</dd>
                {/* Right-aligned, tabular, and `Grátis` arrives as the word:
                    there is no figure here to turn back into R$ 0,00. */}
                <dd className="t-annotation ml-auto text-ink">{opcao.valor}</dd>
              </div>
            ))}
          </dl>

          {resultado.notas.map((nota) => (
            <p key={nota} className="t-annotation mt-rhythm-2 text-muted">
              {nota}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}
