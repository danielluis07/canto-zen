"use client";

import Link from "next/link";
import { mascaraDeUf } from "@/lib/checkout/campos";
import {
  CONTINUAR,
  NAO_SEI_MEU_CEP,
  NAO_SEI_MEU_CEP_HREF,
  type FreteDoCheckout,
} from "@/lib/checkout/conteudo";
import type { Erros, Rascunho } from "@/lib/checkout/estado";
import { CEP_PLACEHOLDER } from "@/lib/produto/cep";
import { Campo } from "./campo";
import { Escolha } from "./escolha";

/**
 * Section 02 — `checkout.md` §6.
 *
 * **CEP first**, pre-filled from the session CEP the cart handed over
 * (`carrinho.md` §11) — so for anyone who arrived through a PDP this section
 * opens already answered. A valid CEP auto-fills logradouro, bairro, cidade and
 * UF, which is a hard Brazilian expectation rather than a nicety (research §5),
 * and it reads a fixture table rather than a service: the map rules out backend
 * integration of any kind.
 *
 * **`Número` is separate and required** and never folded into `Endereço`.
 *
 * **Montagem is read-only here** (§6.3). Where a line contracted it, the resumo
 * shows it inside that line's subtotal and this section offers no control;
 * changing it means returning to `/carrinho`, which the resumo's line links to.
 * Restated only because its absence is otherwise read as an oversight.
 */
export function Entrega({
  rascunho,
  erros,
  frete,
  editar,
  aoTrocarCep,
  aoContinuar,
}: {
  rascunho: Rascunho;
  erros: Erros;
  frete: FreteDoCheckout;
  editar: (mudanca: Partial<Rascunho>) => void;
  aoTrocarCep: (cep: string) => void;
  aoContinuar: () => void;
}) {
  return (
    <div className="max-w-reading">
      <div className="grid gap-rhythm-4 sm:grid-cols-6">
        <div className="sm:col-span-2">
          <Campo
            id="checkout-cep"
            rotulo="CEP"
            inputMode="numeric"
            autoComplete="postal-code"
            placeholder={CEP_PLACEHOLDER}
            valor={rascunho.cep}
            erro={erros.cep}
            aoMudar={aoTrocarCep}
          />
        </div>

        <p className="self-end pb-rhythm-2 sm:col-span-4">
          {/* §6.1 — annotation voice, to the store's own delivery policy. */}
          <Link
            href={NAO_SEI_MEU_CEP_HREF}
            className="t-annotation text-muted hover:text-ink">
            {NAO_SEI_MEU_CEP}
          </Link>
        </p>

        <div className="sm:col-span-4">
          <Campo
            id="checkout-logradouro"
            rotulo="ENDEREÇO"
            autoComplete="address-line1"
            valor={rascunho.logradouro}
            erro={erros.logradouro}
            aoMudar={(logradouro) => editar({ logradouro })}
          />
        </div>

        <div className="sm:col-span-2">
          <Campo
            id="checkout-numero"
            rotulo="NÚMERO"
            autoComplete="off"
            valor={rascunho.numero}
            erro={erros.numero}
            aoMudar={(numero) => editar({ numero })}
          />
        </div>

        <div className="sm:col-span-3">
          <Campo
            id="checkout-complemento"
            rotulo="COMPLEMENTO"
            opcional
            autoComplete="address-line2"
            valor={rascunho.complemento}
            aoMudar={(complemento) => editar({ complemento })}
          />
        </div>

        <div className="sm:col-span-3">
          <Campo
            id="checkout-bairro"
            rotulo="BAIRRO"
            autoComplete="address-level3"
            valor={rascunho.bairro}
            erro={erros.bairro}
            aoMudar={(bairro) => editar({ bairro })}
          />
        </div>

        <div className="sm:col-span-4">
          <Campo
            id="checkout-cidade"
            rotulo="CIDADE"
            autoComplete="address-level2"
            valor={rascunho.cidade}
            erro={erros.cidade}
            aoMudar={(cidade) => editar({ cidade })}
          />
        </div>

        <div className="sm:col-span-2">
          <Campo
            id="checkout-uf"
            rotulo="ESTADO (UF)"
            autoComplete="address-level1"
            valor={rascunho.uf}
            erro={erros.uf}
            aoMudar={(uf) => editar({ uf: mascaraDeUf(uf) })}
          />
        </div>
      </div>

      {/* §6.2 — the modality rows come **after the address completes**, because
          there is nothing to quote until a CEP resolves. Selecting either
          recomputes the resumo total visibly, and that movement is the whole
          point: `carrinho.md` §5.2 kept freight outside the cart's arithmetic
          precisely so this screen could put it inside. */}
      {frete.estado === "cotado" && (
        <fieldset className="mt-rhythm-5 border-0 p-0">
          <legend className="t-annotation text-muted">MODALIDADE</legend>

          <div
            role="radiogroup"
            aria-label="Modalidade de entrega"
            className="mt-rhythm-3 grid gap-rhythm-2">
            {frete.opcoes.map((opcao) => (
              <Escolha
                key={opcao.modalidade}
                nome="checkout-modalidade"
                valor={opcao.modalidade}
                escolhido={rascunho.modalidade === opcao.modalidade}
                aoEscolher={() => editar({ modalidade: opcao.modalidade })}
                rotulo={opcao.rotulo}
                detalhe={opcao.detalhe}
                // `Grátis`, the word, where `freteGratis` covers the region —
                // never `R$ 0,00` (§6.2). Agendada still charges its R$ 100,00
                // difference above the now-zero base.
                figura={opcao.valor}
              />
            ))}
          </div>
        </fieldset>
      )}

      <button
        type="button"
        onClick={aoContinuar}
        className="t-cta mt-rhythm-5 border border-ink px-rhythm-5 py-rhythm-3 text-ink hover:bg-ink hover:text-plaster">
        {CONTINUAR}
      </button>
    </div>
  );
}
