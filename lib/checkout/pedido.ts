// The order record `/pedido-confirmado` shows, and the one piece of state that
// crosses from `/checkout` to it.
//
// `checkout.md` §10: **the full order record — number, lines, prazos, address,
// total as paid — not a stub.** §2 has already said the thing plainly at full
// size, so this page's job is to be the competent artefact the admission was
// made *about*. The order of the two is the whole design.
//
// §11 fixes what happens around it: the cart is cleared at the transition, and a
// cold arrival — a reload, a bookmark, a shared link — redirects to `/`. That is
// what this store's `null` means, and it is why nothing here is persisted: a
// record that survived a reload would render a fictional order to somebody who
// did not just place one, which §11 calls the one genuinely misleading artefact
// this flow could produce.

import { create } from "zustand";
import { precoAVista, politicas, reais, type Centavos, type Figura } from "../catalogo";
import type { CatalogoDoCarrinho } from "../carrinho/catalogo";
import { disponibilidadeDaLinha, itensResolvidos, nomeCompleto } from "../carrinho/conteudo";
import type { Carrinho } from "../carrinho/estado";
import { mascaraDeCep } from "../produto/cep";
import {
  arrependimentoEmTexto,
  CARTAO_NAO_COBRADO,
  FRETE_ROTULO,
  freteDoCheckout,
  modalidadeEscolhida,
  NUMERO_DO_PEDIDO,
  opcoesDeParcela,
  PIX_NAO_GERADO,
  SUBTOTAL_ROTULO,
  TOTAL_ROTULO,
} from "./conteudo";
import type { Checkout } from "./estado";

export type LinhaDoPedido = {
  slug: string;
  nome: string;
  href: string;
  /** `Poltrona Lina em linho cru` — how the line names its piece out loud. */
  nomeCompleto: string;
  acabamento: string;
  imagem: Figura;
  /** `ENVIO IMEDIATO` / `SOB ENCOMENDA · PRODUÇÃO DE 6 SEMANAS` — §10, from §4.4. */
  disponibilidade: string;
  /** `× 2`, and `null` at one: a quantidade of 1 is what a line already means. */
  quantidade: string | null;
  preco: string;
  /** `Montagem incluída · R$ 99,00`, or `null` where none was contracted. */
  montagem: string | null;
};

export type Pedido = {
  numero: string;
  linhas: LinhaDoPedido[];
  entrega: {
    nome: string;
    endereco: string;
    /** `ENTREGA PADRÃO · 6 DIAS ÚTEIS APÓS A CONFIRMAÇÃO DO PAGAMENTO` */
    modalidade: string;
  };
  pagamento: {
    subtotalRotulo: string;
    subtotal: string;
    freteRotulo: string;
    frete: string;
    totalRotulo: string;
    /** The total **as paid** — discounted where the method was Pix. */
    total: string;
    /** `à vista no Pix` / `10x de R$ 856,80 sem juros`. */
    tier: string;
    /** `10% À VISTA NO PIX`, and `null` under cartão — §8's one índigo. */
    badge: string | null;
    /** `de R$ 8.568,00`, the undiscounted figure, only where it differs. */
    de: string | null;
    /** §7.1's promise kept: no code, no receipt, and a line that says so. */
    nota: string;
  };
  arrependimento: string;
  comMontagem: boolean;
};

/**
 * The record, composed once at the transition from what the reader chose.
 *
 * Every figure is derived here and none is stored on a line — the same rule the
 * cart and the checkout resumo follow, so the confirmation cannot disagree with
 * the screen the reader just left. The **total as paid** is the one place the
 * payment method changes a figure: Pix takes `descontoPixPercent` off and states
 * what it was before, cartão pays the table total across its parcelas.
 */
export const pedidoDe = (
  checkout: Checkout,
  carrinho: Carrinho,
  catalogo: CatalogoDoCarrinho,
): Pedido => {
  const resolvidos = itensResolvidos(carrinho, catalogo);

  const montagemDaLinha = (
    peca: CatalogoDoCarrinho[string],
    item: { quantidade: number; montagem: boolean },
  ): Centavos =>
    peca.montagem.necessaria && item.montagem
      ? politicas.montagemCentavos[peca.montagem.nivel] * item.quantidade
      : 0;

  const subtotal = resolvidos.reduce(
    (soma, { peca, item }) =>
      soma + peca.precoTabela * item.quantidade + montagemDaLinha(peca, item),
    0,
  );

  const frete = modalidadeEscolhida(
    freteDoCheckout(checkout.entrega.cep, carrinho, catalogo),
    checkout.entrega.modalidade,
  );
  // A `Checkout` only exists where the Entrega section validated, and that
  // section refuses a CEP the store does not reach — so the quote is here.
  if (frete.estado !== "cotado") {
    throw new Error(`a confirmed order carries a CEP with no quote: ${checkout.entrega.cep}`);
  }

  const total = subtotal + frete.escolhida.centavos;
  const pagoPix = checkout.pagamento.metodo === "pix";
  const totalPago = pagoPix ? precoAVista(total) : total;

  const parcelas =
    checkout.pagamento.metodo === "cartao" ? checkout.pagamento.parcelas : 1;
  const opcao = opcoesDeParcela(total)[parcelas - 1];

  const comMontagem = resolvidos.some(({ peca, item }) => montagemDaLinha(peca, item) > 0);
  const { entrega } = checkout;

  return {
    numero: NUMERO_DO_PEDIDO,
    linhas: resolvidos.map(({ peca, item }) => ({
      slug: peca.slug,
      nome: peca.nome,
      href: `/produtos/${peca.slug}`,
      // Named out loud the way every control in the cart names its piece, so a
      // reader hears which acabamento this line is.
      nomeCompleto: nomeCompleto(peca),
      acabamento: peca.acabamento.toUpperCase(),
      imagem: peca.imagem,
      disponibilidade: disponibilidadeDaLinha(peca),
      quantidade: item.quantidade > 1 ? `× ${item.quantidade}` : null,
      preco: reais(peca.precoTabela * item.quantidade),
      montagem:
        montagemDaLinha(peca, item) > 0
          ? `Montagem incluída · ${reais(montagemDaLinha(peca, item))}`
          : null,
    })),
    entrega: {
      nome: checkout.identificacao.nome,
      endereco: [
        [entrega.logradouro, entrega.numero].filter(Boolean).join(", "),
        entrega.complemento,
        entrega.bairro,
        `${entrega.cidade}/${entrega.uf}`,
        mascaraDeCep(entrega.cep),
      ]
        .filter(Boolean)
        .join(" · "),
      modalidade: `${frete.escolhida.rotulo} · ${frete.escolhida.prazoDiasUteis} DIAS ÚTEIS APÓS A CONFIRMAÇÃO DO PAGAMENTO`,
    },
    pagamento: {
      subtotalRotulo: SUBTOTAL_ROTULO,
      subtotal: reais(subtotal),
      freteRotulo: FRETE_ROTULO,
      frete: frete.escolhida.valor,
      totalRotulo: TOTAL_ROTULO,
      total: reais(totalPago),
      tier: pagoPix ? "à vista no Pix" : (opcao?.rotulo ?? `1x de ${reais(total)} à vista`),
      badge: pagoPix ? `${politicas.descontoPixPercent}% À VISTA NO PIX` : null,
      de: pagoPix ? `de ${reais(total)}` : null,
      nota: pagoPix ? PIX_NAO_GERADO : CARTAO_NAO_COBRADO,
    },
    arrependimento: arrependimentoEmTexto(comMontagem),
    comMontagem,
  };
};

// ---------------------------------------------------------------------------
// The one piece of state that crosses the transition
// ---------------------------------------------------------------------------

type LojaDoPedido = {
  /** `null` is a cold arrival, and §11 makes that a redirect to `/`. */
  pedido: Pedido | null;
  registrar: (pedido: Pedido) => void;
  esquecer: () => void;
};

/**
 * One store at module scope, like the cart's and for the same reason: two
 * routes read it, and a provider would have to wrap both.
 *
 * **Not persisted, and that is the design.** A reload resets it to `null`, which
 * is exactly the cold arrival §11 sends to `/` — so the redirect rule and the
 * no-persistence rule are one rule rather than two that must agree.
 */
export const useLojaDoPedido = create<LojaDoPedido>()((set) => ({
  pedido: null,
  registrar: (pedido) => set({ pedido }),
  esquecer: () => set({ pedido: null }),
}));

export const usePedido = (): Pedido | null => useLojaDoPedido((estado) => estado.pedido);
