"use client";

import { useState } from "react";
import type { CatalogoDoCarrinho } from "@/lib/carrinho/catalogo";
import type { Carrinho } from "@/lib/carrinho/estado";
import {
  ajustarParcelas,
  metodoEmTexto,
  opcoesDeParcela,
  resumoDaEntrega,
  resumoDaIdentificacao,
  resumoDoCheckout,
  TITULO,
} from "@/lib/checkout/conteudo";
import {
  autopreencher,
  bloqueioDoCheckout,
  checkoutDe,
  rascunhoInicial,
  secaoCompleta,
  validarEntrega,
  validarIdentificacao,
  validarPagamento,
  validarSecao,
  type Checkout,
  type Campo as NomeDeCampo,
  type Erros,
  type Rascunho,
  type Secao as NumeroDaSecao,
} from "@/lib/checkout/estado";
import { mascaraDeCep } from "@/lib/produto/cep";
import { Entrega } from "./entrega";
import { Identificacao } from "./identificacao";
import { Pagamento } from "./pagamento";
import { Resumo } from "./resumo";
import { Secao } from "./secao";

/**
 * `erros.md` §5.4 — on submit, focus moves to the **first invalid field**, and
 * there is no error summary block: the checkout is a single-page accordion, the
 * offending section is already open, and a summary would duplicate navigation
 * that is on screen. The order below is the order the fields are read in.
 */
const CAMPOS_POR_SECAO: Record<NumeroDaSecao, NomeDeCampo[]> = {
  1: ["email", "cpf", "celular", "nome"],
  2: ["cep", "logradouro", "numero", "bairro", "cidade", "uf"],
  3: ["cartaoNumero", "cartaoNome", "validade", "cvv", "cartaoCpf"],
};

const ID_DO_CAMPO: Record<NomeDeCampo, string> = {
  email: "checkout-email",
  cpf: "checkout-cpf",
  nome: "checkout-nome",
  celular: "checkout-celular",
  cep: "checkout-cep",
  logradouro: "checkout-logradouro",
  numero: "checkout-numero",
  bairro: "checkout-bairro",
  cidade: "checkout-cidade",
  uf: "checkout-uf",
  cartaoNumero: "checkout-cartao-numero",
  cartaoNome: "checkout-cartao-nome",
  validade: "checkout-cartao-validade",
  cvv: "checkout-cartao-cvv",
  cartaoCpf: "checkout-cartao-cpf",
};

/** Every rule the flow holds, over one rascunho — used to retire stale messages. */
const todosOsErros = (rascunho: Rascunho): Erros => ({
  ...validarIdentificacao(rascunho),
  ...validarEntrega(rascunho),
  ...validarPagamento(rascunho),
});

/**
 * The checkout surface — `checkout.md` — **pure over the cart it is handed**.
 *
 * The cart is read one level up in `pagina.tsx`, the same split `/carrinho`
 * makes and for the same reason: a component that subscribes to the store can
 * only ever be rendered in the store's own state, and this page has states worth
 * asserting without a browser.
 *
 * What it does hold is the form, and **only** the form: `Rascunho` lives in this
 * component's `useState` and goes nowhere else. There is no fetch, no server
 * action, no analytics call and no storage write beneath this point, because
 * §2.3's statement — *nada que você digitou saiu deste navegador* — is a
 * constraint on the build rather than a line of copy (§12).
 *
 * **Whether a section is complete is derived, never tracked** — a reader who
 * reopens Identificação and empties a field sees it stop claiming to be done,
 * with no `concluidas` set to fall out of step with the validation.
 *
 * What *is* tracked is how far the reader has got, and it has to be: Pagamento
 * validates the moment the page loads, because Pix asks for nothing (§7.1), and
 * a section that collapses to `PIX · ALTERAR` before it has ever been opened is
 * the form answering a question on the reader's behalf. So a section shows its
 * summary only once the reader has passed it, which is one number and not a set.
 */
export function Superficie({
  carrinho,
  catalogo,
  processando,
  aoFinalizar,
}: {
  carrinho: Carrinho;
  catalogo: CatalogoDoCarrinho;
  processando: boolean;
  aoFinalizar: (checkout: Checkout) => void;
}) {
  // The session CEP the cart handed over — `carrinho.md` §11. Anyone who arrived
  // through a PDP opens Entrega already answered.
  const [rascunho, definirRascunho] = useState<Rascunho>(() => rascunhoInicial(carrinho.cep));
  const [aberta, definirAberta] = useState<NumeroDaSecao>(1);
  const [alcancada, definirAlcancada] = useState<NumeroDaSecao>(1);
  const [erros, definirErros] = useState<Erros>({});

  /** Opening a section is reaching it — the lock is soft, so both directions. */
  const abrir = (secao: NumeroDaSecao) => {
    definirAberta(secao);
    if (secao > alcancada) definirAlcancada(secao);
  };

  /**
   * §4 — a section collapses to a summary once it is behind the reader and
   * validates. Pagamento never collapses: it is the last section and the CTA
   * closes it, so there is nothing to advance to and nothing to summarise for.
   */
  const resumoDaSecao = (secao: NumeroDaSecao, linhas: () => string[]): string[] | null =>
    secao < alcancada && secaoCompleta(rascunho, secao) ? linhas() : null;

  const resumo = resumoDoCheckout(rascunho, carrinho, catalogo);
  const parcelas = ajustarParcelas(rascunho.parcelas, resumo.totalCentavos);

  /**
   * An edit retires the messages its own keystroke answered, and keeps the rest.
   * A field that becomes valid stops shouting immediately; one that is still
   * wrong does not lose the message the reader is reading.
   */
  const editar = (mudanca: Partial<Rascunho>) => {
    const proximo = { ...rascunho, ...mudanca };
    definirRascunho(proximo);

    const atuais = todosOsErros(proximo);
    definirErros((anteriores) =>
      Object.fromEntries(
        Object.keys(anteriores)
          .filter((campo) => atuais[campo as NomeDeCampo])
          .map((campo) => [campo, atuais[campo as NomeDeCampo]!]),
      ),
    );
  };

  const trocarCep = (cep: string) => {
    const proximo = autopreencher(rascunho, mascaraDeCep(cep));
    definirRascunho(proximo);

    const atuais = todosOsErros(proximo);
    definirErros((anteriores) =>
      Object.fromEntries(
        Object.keys(anteriores)
          .filter((campo) => atuais[campo as NomeDeCampo])
          .map((campo) => [campo, atuais[campo as NomeDeCampo]!]),
      ),
    );
  };

  const trocarMetodo = (metodo: Rascunho["metodo"]) =>
    editar({
      metodo,
      // §7.2 — `CPF do titular` is pre-filled from §5 and editable. Prefilled
      // once, on the first opening: a later edit of §5's CPF must not overwrite
      // a cardholder the reader deliberately typed as someone else.
      cartao:
        metodo === "cartao" && !rascunho.cartao.cpf
          ? { ...rascunho.cartao, cpf: rascunho.cpf }
          : rascunho.cartao,
    });

  /** The first section that does not yet validate, or Pagamento, which is last. */
  const proxima = (): NumeroDaSecao =>
    ([1, 2, 3] as const).find((secao) => !secaoCompleta(rascunho, secao)) ?? 3;

  const continuar = (secao: NumeroDaSecao) => {
    const encontrados = validarSecao(rascunho, secao);
    definirErros((anteriores) => ({ ...anteriores, ...encontrados }));

    const primeiro = CAMPOS_POR_SECAO[secao].find((campo) => encontrados[campo]);
    if (primeiro) {
      document.getElementById(ID_DO_CAMPO[primeiro])?.focus();
      return;
    }

    abrir(secao === 3 ? 3 : proxima());
  };

  const bloqueio = bloqueioDoCheckout(rascunho, resumo.esgotadas);

  const finalizar = () => {
    const completo = checkoutDe({ ...rascunho, parcelas });
    if (!completo) return;
    aoFinalizar(completo);
  };

  return (
    <div className="mx-auto w-full max-w-measure px-gutter pt-rhythm-5 pb-rhythm-7">
      {/* Annotation voice, not Mincho — §3: the checkout body contains no Mincho
          at all, and the one feature line in this flow belongs to the
          interstitial, which is its own surface. */}
      <h1 className="t-annotation text-ink">{TITULO}</h1>

      <div className="mt-rhythm-5 grid gap-y-rhythm-6 lg:grid-cols-12 lg:gap-x-gutter">
        <div className="lg:col-span-7">
          <Secao
            numero={1}
            aberta={aberta === 1}
            resumo={resumoDaSecao(1, () => [resumoDaIdentificacao(rascunho)])}
            aoAbrir={() => abrir(1)}>
            <Identificacao
              rascunho={rascunho}
              erros={erros}
              editar={editar}
              aoContinuar={() => continuar(1)}
            />
          </Secao>

          <Secao
            numero={2}
            aberta={aberta === 2}
            resumo={resumoDaSecao(2, () => resumoDaEntrega(rascunho, resumo.frete))}
            aoAbrir={() => abrir(2)}>
            <Entrega
              rascunho={rascunho}
              erros={erros}
              frete={resumo.frete}
              editar={editar}
              aoTrocarCep={trocarCep}
              aoContinuar={() => continuar(2)}
            />
          </Secao>

          <Secao
            numero={3}
            aberta={aberta === 3}
            resumo={resumoDaSecao(3, () => [
              rascunho.metodo === "cartao"
                ? `${metodoEmTexto(rascunho.metodo)} · ${parcelas}x`
                : metodoEmTexto(rascunho.metodo),
            ])}
            aoAbrir={() => abrir(3)}>
            <Pagamento
              rascunho={{ ...rascunho, parcelas }}
              erros={erros}
              resumo={resumo}
              parcelas={opcoesDeParcela(resumo.totalCentavos)}
              bloqueio={bloqueio?.mensagem ?? null}
              processando={processando}
              editar={editar}
              aoTrocarMetodo={trocarMetodo}
              aoFinalizar={finalizar}
            />
          </Secao>
        </div>

        <div className="lg:col-span-5">
          <Resumo resumo={resumo} />
        </div>
      </div>
    </div>
  );
}
