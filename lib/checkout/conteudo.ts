// The checkout's reasoning and its copy, kept out of the components.
//
// `checkout.md` §12: **every figure on both surfaces is derived** — subtotal,
// freight, total, à-vista, parcelas, prazos. So they are all computed here,
// once, and the components place them. Same split as `lib/carrinho/conteudo.ts`
// and `lib/produto/conteudo.ts`, and the reason `build-spec.md` §Seam 2 can call
// what is left in the components wiring.
//
// Nothing here fetches, transmits or persists, and no figure below is typed.

import {
  cepTemOitoDigitos,
  cotarFrete,
  politicas,
  precoAVista,
  reais,
  resolverCep,
  tabelaDeParcelas,
  type Centavos,
  type Modalidade,
} from "../catalogo";
import type { CatalogoDoCarrinho } from "../carrinho/catalogo";
import {
  itensResolvidos,
  linhasDoCarrinho,
  type LinhaDoCarrinho,
} from "../carrinho/conteudo";
import type { Carrinho } from "../carrinho/estado";
import { mascaraDeCep } from "../produto/cep";
import { digitosDe, mascaraDeCelular, mascaraDeCpf } from "./campos";
import type { MetodoPagamento, Rascunho, Secao } from "./estado";

// ---------------------------------------------------------------------------
// Copy — §§3, 4, 5, 6, 7, 9
// ---------------------------------------------------------------------------

/**
 * The page's own heading, in the annotation voice — the treatment `/carrinho`
 * and `/produtos` already give a non-Mincho header. **The checkout body contains
 * no Mincho at all** (§3): the wordmark in the reduced navbar is the exception
 * `navbar.md` registered, and the one feature line in this flow belongs to the
 * interstitial, which is its own surface.
 */
export const TITULO = "CHECKOUT";

/** §4 — `NN` + title, both annotation voice. */
export const SECOES: Record<Secao, { numero: string; titulo: string }> = {
  1: { numero: "01", titulo: "IDENTIFICAÇÃO" },
  2: { numero: "02", titulo: "ENTREGA" },
  3: { numero: "03", titulo: "PAGAMENTO" },
};

export const ALTERAR = "ALTERAR";
export const CONTINUAR = "CONTINUAR";

/** §9 — not `PAGAR`, and not `SIMULAR COMPRA`. Both are argued there. */
export const CTA = "FINALIZAR PEDIDO";

/** §5's closing line, and the two clauses the legal-copy verification §4 adds. */
export const LGPD_PROPOSITO =
  "Usamos estes dados apenas para emitir a nota e combinar a entrega. Sem eles não há entrega. Veja a";
export const LGPD_LINK = "Política de privacidade";
export const LGPD_HREF = "/politicas/privacidade";

/** §6.1 — the inline link out of the address block. */
export const NAO_SEI_MEU_CEP = "NÃO SEI MEU CEP";
export const NAO_SEI_MEU_CEP_HREF = "/politicas/entrega-e-frete";

/** §7.1 — one annotation line, and the whole treatment of the Pix code. */
export const PIX_NOTA = "O CÓDIGO PIX É GERADO APÓS A CONFIRMAÇÃO DO PEDIDO";
export const PIX_ROTULO = "PIX";
export const CARTAO_ROTULO = "CARTÃO DE CRÉDITO";

export const RESUMO_TITULO = "RESUMO";
export const SUBTOTAL_ROTULO = "Subtotal";
export const FRETE_ROTULO = "Frete";
export const TOTAL_ROTULO = "Total";
/** Before a CEP resolves there is no freight, and no figure to pretend one. */
export const FRETE_A_CALCULAR = "A calcular";
export const VER_RESUMO = "VER RESUMO";

/** §2.2 — the beat. 1500ms, no spinner, no progress bar, no percentage. */
export const BEAT_MS = 1500;
export const PROCESSANDO_ANUNCIO = "PROCESSANDO O PAGAMENTO";
export const PROCESSANDO_CTA = "PROCESSANDO";

// ---------------------------------------------------------------------------
// The interstitial — §2.3
//
// The copy is a commitment rather than direction: `build-spec.md` §Seam 2 lists
// it among the strings where a paraphrase is a defect, so it lives as constants
// and is asserted verbatim.
// ---------------------------------------------------------------------------

export const INTERSTICIO_EYEBROW = "CANTO ZEN";
export const INTERSTICIO_TITULO = "Nada foi cobrado.";
export const INTERSTICIO_PARAGRAFO =
  "Canto Zen é uma loja conceito. Não existe gateway, não existe pedido, e nada " +
  "que você digitou saiu deste navegador. As peças, os preços, o frete e os " +
  "prazos são reais o suficiente para serem julgados — a cobrança é a única " +
  "coisa que não existe.";
export const INTERSTICIO_CTA = "VER O PEDIDO";

// ---------------------------------------------------------------------------
// `/pedido-confirmado` — §10
// ---------------------------------------------------------------------------

export const CONFIRMACAO_TITULO = "Pedido confirmado";
/** §12 — the constant `0000`, never randomised: a random number implies a sequence. */
export const NUMERO_DO_PEDIDO = "0000";
export const CONFIRMACAO_NUMERO = `PEDIDO Nº ${NUMERO_DO_PEDIDO} — CONCEITO`;
export const CONFIRMACAO_PECAS = "PEÇAS";
export const CONFIRMACAO_ENTREGA = "ENTREGA";
export const CONFIRMACAO_PAGAMENTO = "PAGAMENTO";
export const CONFIRMACAO_SAIDA = "VER TODAS AS PEÇAS";

/**
 * The claim, restated on the surface a reader keeps — `build-spec.md` §110–125.
 *
 * §2.3 spends the admission at full size on the interstitial, and the ticket
 * asks the confirmation to state it **literally** as well: the interstitial is a
 * phase that vanishes, and this page is the artefact that stays. Both halves are
 * here because both are constraints on the build rather than lines of copy —
 * nothing was charged, and nothing that was typed left the browser (§12).
 *
 * It closes the page rather than opening it, so §10's order — record first,
 * complete — is not disturbed by the sentence it was written to make room for.
 */
export const CONFIRMACAO_DISCLOSURE =
  "Nada foi cobrado, e nada que você digitou saiu deste navegador.";
export const CONFIRMACAO_SAIDA_HREF = "/produtos";

/** §7.1's promise, kept honestly on the surface that would otherwise show a code. */
export const PIX_NAO_GERADO = "O CÓDIGO PIX NÃO SERÁ GERADO";
export const CARTAO_NAO_COBRADO = "NENHUM CARTÃO FOI COBRADO";

/**
 * The arrependimento sentence, and **here only** the means of exercising it —
 * §10. Decreto 7.962 art. 5º's duty is to inform the *means*, not only the
 * window, and the legal-copy verification §3 settles that the means must be the
 * site's own form. The cart keeps the bare sentence: nothing has been bought
 * there yet, so a withdrawal route would offer an exit from a commitment that
 * was never made.
 */
export const ARREPENDIMENTO_MEIO = "Para desistir, use o";
export const ARREPENDIMENTO_MEIO_LINK = "formulário de contato";
export const ARREPENDIMENTO_MEIO_HREF = "/contato?assunto=arrependimento";
export const ARREPENDIMENTO_COMO = "Como funciona →";
export const ARREPENDIMENTO_COMO_HREF = "/politicas/trocas-e-devolucoes";

/** §5.4 of `carrinho.md`, unchanged — the montagem clause is conditional. */
export const arrependimentoEmTexto = (comMontagem: boolean): string =>
  comMontagem
    ? "Você pode desistir da compra em até 7 dias corridos após receber a peça — ou após a montagem, quando contratada."
    : "Você pode desistir da compra em até 7 dias corridos após receber a peça.";

// ---------------------------------------------------------------------------
// The freight modality — §6.2
// ---------------------------------------------------------------------------

export type OpcaoDeModalidade = {
  modalidade: Modalidade;
  /** `ENTREGA PADRÃO` — the row's label, annotation voice. */
  rotulo: string;
  /** `6 dias úteis após a confirmação do pagamento` */
  detalhe: string;
  /** `Grátis`, the word, when the whole cart is covered — never `R$ 0,00`. */
  valor: string;
  centavos: Centavos;
  prazoDiasUteis: number;
};

/**
 * Three arms rather than one record with optional fields, for the reason
 * `ResultadoDoCep` has three: a surface that forgets the refusal does not
 * compile, and *região não atendida* is a state `carrinho.md` §8 already named.
 */
export type FreteDoCheckout =
  | { estado: "sem-cep" }
  | { estado: "nao-atendida"; mensagem: string; saibaMais: string }
  | { estado: "cotado"; opcoes: OpcaoDeModalidade[]; escolhida: OpcaoDeModalidade };

const ROTULOS: Record<Modalidade, string> = {
  padrao: "ENTREGA PADRÃO",
  agendada: "ENTREGA AGENDADA",
};

const detalheDaModalidade = (modalidade: Modalidade, prazo: number): string =>
  modalidade === "padrao"
    ? `${prazo} dias úteis após a confirmação do pagamento`
    : `data à sua escolha · ${prazo} dias úteis após a confirmação`;

/**
 * The whole cart's freight, at both modalidades, from one CEP.
 *
 * **The figure is the sum of each line's own quote**, `cotarFrete` per peça
 * times its quantidade — which is `carrinho.md` §8 read as it is written: the
 * rule quotes a box, and a cart is boxes. That also means agendada's R$ 100,00
 * difference is per shipment rather than per order, because §8 prices it into
 * each quote and §6.2 states it sits *above the now-zero base* where a line is
 * `freteGratis`. Reading it back off the order total would be a second rule.
 *
 * **`R$ 0,00` is unrepresentable**: a fully covered cart writes the word
 * `Grátis`, and the zero never reaches `reais`.
 */
export const freteDoCheckout = (
  cep: string,
  carrinho: Carrinho,
  catalogo: CatalogoDoCarrinho,
): FreteDoCheckout => {
  if (!cepTemOitoDigitos(cep)) return { estado: "sem-cep" };

  const resolvido = resolverCep(cep);
  if (resolvido.situacao === "nao-atendida") {
    return {
      estado: "nao-atendida",
      mensagem: resolvido.mensagem,
      saibaMais: resolvido.saibaMais,
    };
  }

  const somas: Record<Modalidade, Centavos> = { padrao: 0, agendada: 0 };
  let prazoDiasUteis = 0;

  for (const { peca, item } of itensResolvidos(carrinho, catalogo)) {
    const opcoes = cotarFrete(resolvido.cep, peca.embalagem, peca.freteGratis);
    // Unreachable: the refusal was answered above, and a resolved CEP quotes.
    if (!Array.isArray(opcoes)) throw new Error(`frete refused a served CEP: ${resolvido.cep}`);

    for (const opcao of opcoes) {
      if (!opcao.gratis) somas[opcao.modalidade] += opcao.centavos * item.quantidade;
      prazoDiasUteis = Math.max(prazoDiasUteis, opcao.prazoDiasUteis);
    }
  }

  const opcoes: OpcaoDeModalidade[] = (["padrao", "agendada"] as const).map((modalidade) => ({
    modalidade,
    rotulo: ROTULOS[modalidade],
    detalhe: detalheDaModalidade(modalidade, prazoDiasUteis),
    valor: somas[modalidade] === 0 ? "Grátis" : reais(somas[modalidade]),
    centavos: somas[modalidade],
    prazoDiasUteis,
  }));

  return { estado: "cotado", opcoes, escolhida: opcoes[0]! };
};

/** The row the reader picked, resolved against the quote. */
export const modalidadeEscolhida = (
  frete: FreteDoCheckout,
  modalidade: Modalidade,
): FreteDoCheckout =>
  frete.estado === "cotado"
    ? {
        ...frete,
        escolhida: frete.opcoes.find((opcao) => opcao.modalidade === modalidade) ?? frete.opcoes[0]!,
      }
    : frete;

// ---------------------------------------------------------------------------
// Parcelas — §7.2
// ---------------------------------------------------------------------------

export type OpcaoDeParcela = { parcelas: number; rotulo: string };

/**
 * The dropdown a US/EU checkout omits entirely — §7.2, research §3.
 *
 * It lists every option against the **cart total including freight**, with `N`
 * derived by `produto.md`'s rule: the largest count whose parcela clears
 * `parcelaMinimaCentavos`, capped at `politicas.parcelasMax`. That is the same
 * derivation the produto page showed, applied to the sum — so the two surfaces
 * cannot disagree about what this store finances.
 *
 * `1x` reads `à vista` rather than `sem juros`: at one instalment there is no
 * interest question to answer, and the à-vista tier is the one Pix discounts.
 */
export const opcoesDeParcela = (totalCentavos: Centavos): OpcaoDeParcela[] =>
  tabelaDeParcelas(totalCentavos).map(({ parcelas, valorCentavos }) => ({
    parcelas,
    rotulo:
      parcelas === 1
        ? `1x de ${reais(valorCentavos)} à vista`
        : `${parcelas}x de ${reais(valorCentavos)} sem juros`,
  }));

/**
 * Keeps a chosen parcela count inside the policy after the total moves.
 *
 * The one number in the flow that moves is freight (§6.2), and it moves the
 * total under a dropdown the reader has already answered. Silently leaving `8x`
 * selected when the new total affords only `6x` would put a figure on screen the
 * policy does not offer, so the count is clamped to what the table still holds.
 */
export const ajustarParcelas = (parcelas: number, totalCentavos: Centavos): number => {
  const disponiveis = opcoesDeParcela(totalCentavos).length;
  return Math.min(Math.max(1, parcelas), Math.max(1, disponiveis));
};

// ---------------------------------------------------------------------------
// The resumo — §§3, 6.2
// ---------------------------------------------------------------------------

export type ResumoDoCheckout = {
  linhas: LinhaDoCarrinho[];
  subtotalRotulo: string;
  subtotal: string;
  freteRotulo: string;
  /** `R$ 289,00`, `Grátis`, or `A calcular` while no CEP has resolved. */
  freteValor: string;
  total: string;
  totalCentavos: Centavos;
  /** `R$ 7.711,20 à vista no Pix` — the tier, derived from the total. */
  aVista: string;
  /** The same figure alone, for the Pix row that sets it in the Preço voice. */
  aVistaValor: string;
  /** `10% À VISTA NO PIX` — the page's one non-state índigo (§8). */
  pix: string;
  /** `null` where the policy affords no second parcela. */
  parcelamento: string | null;
  /** §14 — what the live region says when the modality moves the total. */
  anuncioDoTotal: string;
  frete: FreteDoCheckout;
  /** §9 — a piece can go `esgotado` between the cart and here, and it blocks. */
  esgotadas: boolean;
};

// The arrependimento notice is deliberately **not** in the checkout resumo.
// `carrinho.md` §5.4 places it in the buy box, the cart and the confirmation,
// and `rodape.md` zone D carries it on every route including this one — a fourth
// copy half a screen from the third is the repetition the zone exists to avoid.


/**
 * Every figure the resumo shows, derived from the cart, the catálogo and the
 * rascunho — none typed, and none stored on a line.
 *
 * **Freight is inside the total here**, and that is the whole point of §6.2:
 * `carrinho.md` §5.2 kept it outside the cart's arithmetic precisely so this
 * screen could put it inside without the two pages ever disagreeing. The cart
 * promised `A PARTIR DE`; the checkout delivers the figure, and the one number
 * that moves does so because the reader moved it.
 *
 * **Montagem is inside its line's subtotal**, never a row of its own — §6.3 and
 * `carrinho.md` §4.3. Breaking it out again would read as double-counting.
 */
export const resumoDoCheckout = (
  rascunho: Rascunho,
  carrinho: Carrinho,
  catalogo: CatalogoDoCarrinho,
): ResumoDoCheckout => {
  const resolvidos = itensResolvidos(carrinho, catalogo);
  const linhas = linhasDoCarrinho(carrinho, catalogo);

  const pecas = resolvidos.reduce((total, { item }) => total + item.quantidade, 0);
  const subtotal = resolvidos.reduce(
    (soma, { peca, item }) => soma + peca.precoTabela * item.quantidade + montagemDaLinha(peca, item),
    0,
  );

  const frete = modalidadeEscolhida(
    freteDoCheckout(rascunho.cep, carrinho, catalogo),
    rascunho.modalidade,
  );
  const freteCentavos = frete.estado === "cotado" ? frete.escolhida.centavos : 0;
  const total = subtotal + freteCentavos;

  const opcoes = opcoesDeParcela(total);
  const escolhida = opcoes[ajustarParcelas(rascunho.parcelas, total) - 1];

  return {
    linhas,
    subtotalRotulo: `${SUBTOTAL_ROTULO} (${pecas} ${pecas === 1 ? "peça" : "peças"})`,
    subtotal: reais(subtotal),
    freteRotulo: FRETE_ROTULO,
    freteValor: frete.estado === "cotado" ? frete.escolhida.valor : FRETE_A_CALCULAR,
    total: reais(total),
    totalCentavos: total,
    aVista: `${reais(precoAVista(total))} à vista no Pix`,
    aVistaValor: reais(precoAVista(total)),
    pix: `${politicas.descontoPixPercent}% À VISTA NO PIX`,
    // Under cartão the line states the count the reader actually chose; before
    // that it states the policy's own maximum, which is what the PDP showed.
    parcelamento:
      opcoes.length < 2
        ? null
        : rascunho.metodo === "cartao" && escolhida
          ? `ou ${escolhida.rotulo}`
          : `ou ${opcoes[opcoes.length - 1]!.rotulo}`,
    anuncioDoTotal: `Total atualizado: ${reais(total)}`,
    frete,
    esgotadas: resolvidos.some(({ peca }) => peca.disponibilidade === "esgotado"),
  };
};

/** `carrinho.md` §4.3's rule, restated where the checkout needs the figure. */
const montagemDaLinha = (
  peca: CatalogoDoCarrinho[string],
  item: { quantidade: number; montagem: boolean },
): Centavos =>
  peca.montagem.necessaria && item.montagem
    ? politicas.montagemCentavos[peca.montagem.nivel] * item.quantidade
    : 0;

// ---------------------------------------------------------------------------
// The collapsed summaries — §4
//
// "The collapsed summary is what keeps three sections plus a sticky resumo
// inside one screen; without it the single-page decision produces a page nobody
// can see the end of."
// ---------------------------------------------------------------------------

/** `Ana Ribeiro · ana.ribeiro@email.com · 143.882.907-05 · (11) 98812-4470` */
export const resumoDaIdentificacao = (rascunho: Rascunho): string =>
  [
    rascunho.nome.trim(),
    rascunho.email.trim(),
    mascaraDeCpf(rascunho.cpf),
    mascaraDeCelular(rascunho.celular),
  ]
    .filter(Boolean)
    .join(" · ");

/** `Rua Augusta, 1412 · apto 92 · Consolação · São Paulo/SP · 01310-100` */
export const enderecoEmTexto = (rascunho: Rascunho): string =>
  [
    [rascunho.logradouro.trim(), rascunho.numero.trim()].filter(Boolean).join(", "),
    rascunho.complemento.trim(),
    rascunho.bairro.trim(),
    [rascunho.cidade.trim(), rascunho.uf.trim().toUpperCase()].filter(Boolean).join("/"),
    digitosDe(rascunho.cep).length === 8 ? mascaraDeCep(rascunho.cep) : "",
  ]
    .filter(Boolean)
    .join(" · ");

/** `ENTREGA PADRÃO · R$ 289,00 · 6 dias úteis` */
export const resumoDaModalidade = (frete: FreteDoCheckout): string | null => {
  if (frete.estado !== "cotado") return null;
  const { rotulo, valor, prazoDiasUteis } = frete.escolhida;
  return `${rotulo} · ${valor} · ${prazoDiasUteis} dias úteis`;
};

export const resumoDaEntrega = (rascunho: Rascunho, frete: FreteDoCheckout): string[] =>
  [enderecoEmTexto(rascunho), resumoDaModalidade(frete)].filter(
    (linha): linha is string => Boolean(linha),
  );

/** What the flow calls the method out loud, on both surfaces. */
export const metodoEmTexto = (metodo: MetodoPagamento): string =>
  metodo === "pix" ? PIX_ROTULO : CARTAO_ROTULO;
