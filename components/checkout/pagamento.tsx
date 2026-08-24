"use client";

import {
  mascaraDeCartao,
  mascaraDeCpf,
  mascaraDeCvv,
  mascaraDeValidade,
} from "@/lib/checkout/campos";
import {
  CARTAO_ROTULO,
  CTA,
  PIX_NOTA,
  PIX_ROTULO,
  PROCESSANDO_CTA,
  type OpcaoDeParcela,
  type ResumoDoCheckout,
} from "@/lib/checkout/conteudo";
import type { Erros, Rascunho } from "@/lib/checkout/estado";
import { Campo } from "./campo";
import { Escolha } from "./escolha";

const ID_DO_BLOQUEIO = "checkout-bloqueio";

/**
 * Section 03 — `checkout.md` §7. **Two methods: Pix and Cartão de crédito. No
 * boleto**, which is in structural decline against Pix (research §3), needs its
 * own clearing-time warning that complicates the prazo copy §6.2 fixed, and is
 * the least likely instrument for a high-end atelier's buyers.
 *
 * **Nothing else is in the section** (§7.3). No disclosure block — that was
 * direction C, and §2.1 records why it lost: a notice sitting in a form is read
 * as a form's fine print, spends the admission at the moment of least attention,
 * and leaves the moment of most attention empty. No terms checkbox either: a
 * consent control gating a purchase that does not happen is a control that means
 * nothing, and the Termos de uso link lives in the reduced footer.
 *
 * The CTA closes the section rather than sitting in the resumo — §§3, 9 — so on
 * mobile the button is where the form ends and not floating over it.
 */
export function Pagamento({
  rascunho,
  erros,
  resumo,
  parcelas,
  bloqueio,
  processando,
  editar,
  aoTrocarMetodo,
  aoFinalizar,
}: {
  rascunho: Rascunho;
  erros: Erros;
  resumo: ResumoDoCheckout;
  parcelas: OpcaoDeParcela[];
  bloqueio: string | null;
  processando: boolean;
  editar: (mudanca: Partial<Rascunho>) => void;
  aoTrocarMetodo: (metodo: Rascunho["metodo"]) => void;
  aoFinalizar: () => void;
}) {
  const editarCartao = (mudanca: Partial<Rascunho["cartao"]>) =>
    editar({ cartao: { ...rascunho.cartao, ...mudanca } });

  return (
    <div className="max-w-reading">
      <div role="radiogroup" aria-label="Forma de pagamento" className="grid gap-rhythm-2">
        <Escolha
          nome="checkout-metodo"
          valor="pix"
          escolhido={rascunho.metodo === "pix"}
          aoEscolher={() => aoTrocarMetodo("pix")}
          rotulo={PIX_ROTULO}>
          <div className="pl-[1.625rem]">
            {/* The discounted total in the Preço voice, and the badge in
                `--indigo` — the page's **only** non-state índigo (§8), which is
                also the disclosure Lei 13.455 art. 5º-A requires em local e
                formato visíveis. */}
            <p className="t-price text-ink">{resumo.aVistaValor}</p>

            <p className="mt-rhythm-1 flex flex-wrap items-baseline gap-x-rhythm-3 gap-y-rhythm-1">
              {/* `no Pix` and never `ou 1x no cartão`: the discount is
                  Pix-exclusive here, and research §3 distinguishes the two. */}
              <span className="t-body-s text-ink">à vista no Pix</span>
              <span className="t-annotation text-indigo">{resumo.pix}</span>
            </p>

            {/* §7.1 — **no QR code**, here or on the confirmation. A scannable
                square that resolves to nothing is the most dishonest object the
                store could contain. **No expiry countdown** either: a timer on a
                purchase that cannot expire is theatre with no referent. One
                annotation line states when the code would appear, and that is
                the whole treatment. */}
            <p className="t-annotation mt-rhythm-3 text-muted">{PIX_NOTA}</p>
          </div>
        </Escolha>

        <Escolha
          nome="checkout-metodo"
          valor="cartao"
          escolhido={rascunho.metodo === "cartao"}
          aoEscolher={() => aoTrocarMetodo("cartao")}
          rotulo={CARTAO_ROTULO}>
          <div className="grid gap-rhythm-4 pl-[1.625rem] sm:grid-cols-6">
            <div className="sm:col-span-6">
              <Campo
                id="checkout-cartao-numero"
                rotulo="NÚMERO DO CARTÃO"
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="0000 0000 0000 0000"
                valor={rascunho.cartao.numero}
                erro={erros.cartaoNumero}
                aoMudar={(numero) => editarCartao({ numero: mascaraDeCartao(numero) })}
              />
            </div>

            <div className="sm:col-span-6">
              <Campo
                id="checkout-cartao-nome"
                rotulo="NOME IMPRESSO NO CARTÃO"
                autoComplete="cc-name"
                valor={rascunho.cartao.nome}
                erro={erros.cartaoNome}
                aoMudar={(nome) => editarCartao({ nome })}
              />
            </div>

            <div className="sm:col-span-2">
              <Campo
                id="checkout-cartao-validade"
                rotulo="VALIDADE"
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="00/00"
                valor={rascunho.cartao.validade}
                erro={erros.validade}
                aoMudar={(validade) => editarCartao({ validade: mascaraDeValidade(validade) })}
              />
            </div>

            <div className="sm:col-span-2">
              <Campo
                id="checkout-cartao-cvv"
                rotulo="CVV"
                inputMode="numeric"
                autoComplete="cc-csc"
                valor={rascunho.cartao.cvv}
                erro={erros.cvv}
                aoMudar={(cvv) => editarCartao({ cvv: mascaraDeCvv(cvv) })}
              />
            </div>

            {/* The Brazilian cardholder-identification field — §7.2 — pre-filled
                from §5 and editable. */}
            <div className="sm:col-span-6">
              <Campo
                id="checkout-cartao-cpf"
                rotulo="CPF DO TITULAR"
                inputMode="numeric"
                autoComplete="off"
                placeholder="000.000.000-00"
                valor={rascunho.cartao.cpf}
                erro={erros.cartaoCpf}
                aoMudar={(cpf) => editarCartao({ cpf: mascaraDeCpf(cpf) })}
              />
            </div>

            {/* **The parcelas dropdown is mandatory**, and is the element a
                US/EU checkout omits entirely (research §3). It lists every
                option against the cart total **including freight**, with `N`
                derived by `produto.md`'s rule — the same derivation the produto
                page showed. */}
            <div className="sm:col-span-6">
              <label htmlFor="checkout-parcelas" className="t-annotation block text-ink">
                PARCELAS
              </label>
              <select
                id="checkout-parcelas"
                value={rascunho.parcelas}
                onChange={(evento) => editar({ parcelas: Number(evento.target.value) })}
                data-filled="true"
                className="t-body-s mt-rhythm-2 block w-full px-rhythm-2 py-rhythm-2 text-ink">
                {parcelas.map((opcao) => (
                  <option key={opcao.parcelas} value={opcao.parcelas}>
                    {opcao.rotulo}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Escolha>
      </div>

      {/* §9 — full width of the form column, 1px `--ink` on transparent,
          inverting to solid `--ink` on hover. `aria-disabled` rather than
          `disabled`, so the button keeps its place in the tab order and its
          reason can be read from it (§14, `carrinho.md` §10). */}
      <button
        type="button"
        onClick={bloqueio || processando ? undefined : aoFinalizar}
        aria-disabled={bloqueio || processando ? true : undefined}
        aria-describedby={bloqueio ? ID_DO_BLOQUEIO : undefined}
        className={
          bloqueio || processando
            ? "t-cta mt-rhythm-5 w-full cursor-not-allowed border border-hairline py-rhythm-3 text-muted"
            : "t-cta mt-rhythm-5 w-full border border-ink py-rhythm-3 text-ink hover:bg-ink hover:text-plaster"
        }>
        {processando ? PROCESSANDO_CTA : CTA}
      </button>

      {bloqueio && (
        <p id={ID_DO_BLOQUEIO} className="t-annotation mt-rhythm-2 text-ink">
          {bloqueio}
        </p>
      )}
    </div>
  );
}
