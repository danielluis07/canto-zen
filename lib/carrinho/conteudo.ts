// The cart's reasoning, kept out of the components.
//
// `carrinho.md` §9 states the rule the whole surface hangs from: the cart stores
// a slug, a quantidade and a boolean, and **everything else on screen is
// derived** — price, à-vista, parcelamento, montagem price, prazo, freight
// estimate, group count. So every figure the cart shows is computed here, once,
// and the components place it: the same split `lib/listagem/conteudo.ts` and
// `lib/produto/conteudo.ts` make for their surfaces, and the reason
// `build-spec.md` §Seam 2 can call the components wiring.
//
// Nothing here fetches, transmits or persists, and no figure below is typed.

import {
  cepTemOitoDigitos,
  cotarFrete,
  linhaDeParcelamento,
  politicas,
  precoAVista,
  precoMontagem,
  reais,
  resolverCep,
  type Centavos,
} from "../catalogo";
import { mascaraDeCep } from "../produto/cep";
import type { Carrinho, ItemCarrinho } from "./estado";
import type { CatalogoDoCarrinho, PecaDoCarrinho } from "./catalogo";

// ---------------------------------------------------------------------------
// Copy — §§3, 4.2, 5, 6, 7
// ---------------------------------------------------------------------------

/** §3. Schibsted caps at display size, and nothing else: no count, no subtitle. */
export const TITULO = "CARRINHO";

/** §7 — one sentence and one link, and nothing fabricated between them. */
export const VAZIO = "Seu carrinho está vazio.";
export const VAZIO_LINK = "VER TODAS AS PEÇAS →";

export const RESUMO_TITULO = "RESUMO";
export const TOTAL_ROTULO = "Total";
export const CTA = "FINALIZAR COMPRA";
export const CONTINUAR = "CONTINUAR COMPRANDO →";

/** §4.2 — the word, never `×`. The cart gets no second icon exception. */
export const REMOVER = "REMOVER";
export const MONTAGEM = "Montagem";

/** §6 — the one annotation line beneath a CTA that will not fire. */
export const BLOQUEIO = "REMOVA AS PEÇAS ESGOTADAS PARA CONTINUAR.";

/** §5.2 — the estimate's second line, and the control that reopens the field. */
export const FRETE_NOTA = "CALCULADO NO CHECKOUT";
export const FRETE_ALTERAR = "ALTERAR CEP";
export const FRETE_CALCULE = "CALCULE O FRETE";
export const FRETE_BOTAO = "CALCULAR";

// ---------------------------------------------------------------------------
// The line — §4
// ---------------------------------------------------------------------------

/**
 * `Poltrona Lina em linho cru` — how a control names its piece out loud.
 *
 * §10 fixes `REMOVER`'s accessible name in exactly this shape, and the stepper's
 * two labels take it as well although §4.2 writes only `{nome}`: a cart holding
 * both `poltrona-lina` acabamentos would otherwise present two pairs of
 * identically-named buttons, which is the failure the naming rule exists to
 * prevent.
 */
export const nomeCompleto = (peca: PecaDoCarrinho): string =>
  `${peca.nome} em ${peca.acabamento.toLowerCase()}`;

/**
 * §4.4's table, read off the peça's own state — never a count, never a badge,
 * never a colour. It is deliberately not `disponibilidadeEmTexto`: the listing
 * writes `ESGOTADO` and `SOB ENCOMENDA · 4 SEMANAS`, and the cart writes the
 * instruction and the fuller production line, because here the state is
 * something the reader has to act on.
 */
export const disponibilidadeDaLinha = (peca: PecaDoCarrinho): string => {
  switch (peca.disponibilidade) {
    case "envio-imediato":
      return "ENVIO IMEDIATO";
    case "esgotado":
      return "ESGOTADO · REMOVA PARA CONTINUAR";
    case "sob-encomenda":
      return `SOB ENCOMENDA · PRODUÇÃO DE ${peca.prazoProducaoSemanas} SEMANAS`;
  }
};

/**
 * Which delivery a line belongs to — §§4.4, 5.3.
 *
 * Two lines share a group when they share a prazo, and the prazo is the peça's
 * own availability: `envio-imediato` ships now, and each production window is a
 * dispatch of its own. An `esgotado` line has no prazo at all and joins no
 * group — it blocks the checkout rather than arriving on a date.
 *
 * This is a **key, not a heading**. §4.4 rejects visual grouping outright: it
 * would reorder the list underneath a reader in response to an edit they did not
 * make. The groups exist to be counted, and the count is one sentence (§5.3).
 */
export const grupoDeEntrega = (peca: PecaDoCarrinho): string | null => {
  switch (peca.disponibilidade) {
    case "envio-imediato":
      return "imediato";
    case "esgotado":
      return null;
    case "sob-encomenda":
      return `producao-${peca.prazoProducaoSemanas}`;
  }
};

export type LinhaDoCarrinho = {
  slug: string;
  nome: string;
  /** The nome links to the PDP — the cart never has to introduce a piece (§4.1). */
  href: string;
  acabamento: string;
  imagem: { src: string; alt: string };
  quantidade: number;
  /** `precoTabela × quantidade`, in the Preço voice, tabular. */
  preco: string;
  disponibilidade: string;
  esgotado: boolean;
  /** `null` for a peça that needs no assembly — the row does not render (§4.3). */
  montagem: { contratada: boolean; rotulo: string; preco: string } | null;
  /** §6 — only ever on an `esgotado` line, and only where the família has one. */
  irmao: { rotulo: string; href: string } | null;
  /** §4.2 — `−` at quantidade 1 is disabled, and is not a delete shortcut. */
  podeDiminuir: boolean;
  rotuloAumentar: string;
  rotuloDiminuir: string;
  rotuloRemover: string;
};

/**
 * The montagem price a line carries, in centavos — `politicas.montagemCentavos`
 * by `nivel`, times the quantidade (§4.3). Zero where the peça needs none or the
 * reader declined it, which keeps it summable without a branch at every site.
 */
const montagemDaLinha = (peca: PecaDoCarrinho, item: ItemCarrinho): Centavos =>
  peca.montagem.necessaria && item.montagem
    ? precoMontagem(peca.montagem.nivel) * item.quantidade
    : 0;

/** Piece plus montagem — what this line contributes to `Subtotal` (§§4.3, 5.1). */
const subtotalDaLinha = (peca: PecaDoCarrinho, item: ItemCarrinho): Centavos =>
  peca.precoTabela * item.quantidade + montagemDaLinha(peca, item);

const compor = (peca: PecaDoCarrinho, item: ItemCarrinho): LinhaDoCarrinho => {
  const nome = nomeCompleto(peca);

  return {
    slug: peca.slug,
    nome: peca.nome,
    href: `/produtos/${peca.slug}`,
    acabamento: peca.acabamento.toUpperCase(),
    imagem: peca.imagem,
    quantidade: item.quantidade,
    preco: reais(peca.precoTabela * item.quantidade),
    disponibilidade: disponibilidadeDaLinha(peca),
    esgotado: peca.disponibilidade === "esgotado",
    montagem: peca.montagem.necessaria
      ? {
          contratada: item.montagem,
          rotulo: MONTAGEM,
          // The price of contracting it, stated whether or not it is contracted:
          // an unchecked box beside no figure states no offer.
          preco: `+ ${reais(precoMontagem(peca.montagem.nivel) * item.quantidade)}`,
        }
      : null,
    irmao: peca.irmao,
    podeDiminuir: item.quantidade > 1,
    rotuloAumentar: `Aumentar quantidade de ${nome}`,
    rotuloDiminuir: `Diminuir quantidade de ${nome}`,
    rotuloRemover: `Remover ${nome}`,
  };
};

/**
 * The cart's items resolved against the catálogo, in the order they were added —
 * newest last, never reordered.
 *
 * A slug the catálogo does not know **resolves to nothing**, rather than to a
 * throw or a placeholder: the cart is a reader's state and not an authored
 * table, so an unknown slug is a browser holding something the store no longer
 * sells, and the honest rendering of a piece that is not in the catálogue is its
 * absence. Every reading below starts here, so the line list and the resumo can
 * never disagree about which items exist.
 */
const resolver = (carrinho: Carrinho, catalogo: CatalogoDoCarrinho) =>
  carrinho.itens.flatMap((item) => {
    const peca = catalogo[item.slug];
    return peca ? [{ peca, item }] : [];
  });

export const linhasDoCarrinho = (
  carrinho: Carrinho,
  catalogo: CatalogoDoCarrinho,
): LinhaDoCarrinho[] =>
  resolver(carrinho, catalogo).map(({ peca, item }) => compor(peca, item));

/**
 * What a stepper says out loud — §§4.2, 10.
 *
 * The piece and its new quantidade in one utterance, because a live region over
 * the figure alone would announce `2` into a list of steppers.
 */
export const anuncioDeQuantidade = (linha: LinhaDoCarrinho, quantidade: number): string =>
  `${linha.nome} em ${linha.acabamento.toLowerCase()}: quantidade ${quantidade}`;

// ---------------------------------------------------------------------------
// The freight estimate — §§5.2, 8
// ---------------------------------------------------------------------------

/**
 * One estimate, never the PDP's option table: the modality choice belongs to the
 * checkout, after the full address exists (§5.2). What is quoted is the **padrão**
 * option for every line, summed — the cheapest standard answer for this cart at
 * this CEP, which is what `A PARTIR DE` claims.
 *
 * Three arms rather than one record with optional fields, for the reason
 * `ResultadoDoCep` has three: a surface that forgets the refusal does not compile.
 */
export type EstimativaDeFrete =
  | { estado: "sem-cep" }
  | { estado: "nao-atendida"; cep: string; mensagem: string; saibaMais: string }
  | { estado: "estimado"; cep: string; linha: string };

/**
 * `freteGratis` is per peça and per region, so a cart can be part-covered. The
 * sum is what decides the word: only a cart whose every line is covered is
 * `Grátis`, and a cart with one paying line quotes that line's figure.
 *
 * **`R$ 0,00` is unrepresentable here** — the zero never reaches `reais`, because
 * the branch above it writes the word instead. Four specs forbid the string and
 * this is the site where a careless formatter would produce it.
 */
export const estimarFrete = (
  carrinho: Carrinho,
  catalogo: CatalogoDoCarrinho,
): EstimativaDeFrete => {
  const { cep } = carrinho;
  if (!cep || !cepTemOitoDigitos(cep)) return { estado: "sem-cep" };

  const resolvido = resolverCep(cep);
  if (resolvido.situacao === "nao-atendida") {
    return {
      estado: "nao-atendida",
      cep: mascaraDeCep(cep),
      mensagem: resolvido.mensagem,
      saibaMais: resolvido.saibaMais,
    };
  }

  const mascarado = mascaraDeCep(cep);
  let centavos = 0;

  for (const { peca, item } of resolver(carrinho, catalogo)) {
    const opcoes = cotarFrete(cep, peca.embalagem, peca.freteGratis);
    // Unreachable: the refusal was answered above, and a resolved CEP quotes.
    if (!Array.isArray(opcoes)) throw new Error(`frete refused a served CEP: ${cep}`);

    const padrao = opcoes.find((opcao) => opcao.modalidade === "padrao");
    if (padrao && !padrao.gratis) centavos += padrao.centavos * item.quantidade;
  }

  return {
    estado: "estimado",
    cep: mascarado,
    linha:
      centavos === 0
        ? `FRETE GRÁTIS PARA ${mascarado}`
        : `FRETE ESTIMADO A PARTIR DE ${reais(centavos)} PARA ${mascarado}`,
  };
};

// ---------------------------------------------------------------------------
// The resumo — §5
// ---------------------------------------------------------------------------

/** §5.3. Beyond six the figure states itself; a cart never gets there. */
const NUMERAIS: Record<number, string> = {
  2: "duas",
  3: "três",
  4: "quatro",
  5: "cinco",
  6: "seis",
};

export type ResumoDoPedido = {
  /** `Subtotal (3 peças)` — the only place the piece count appears (§5.1). */
  subtotalRotulo: string;
  subtotal: string;
  total: string;
  /** `R$ 7.451,10 à vista` — derived from `descontoPixPercent` (§5.4). */
  aVista: string;
  /** `10% À VISTA NO PIX` — the page's one non-interactive índigo (§2). */
  pix: string;
  /** `null` where the policy affords no second parcela. */
  parcelamento: string | null;
  frete: EstimativaDeFrete;
  /** `Sua compra chega em duas entregas.`, or nothing at all (§5.3). */
  entregas: string | null;
  /** `null` when the CTA fires; the reason to state beneath it when it does not. */
  bloqueio: string | null;
  arrependimento: string;
};

/**
 * Every figure the resumo shows, derived from the cart and the catálogo — none
 * typed, and none stored on a line.
 *
 * **Frete is not in the arithmetic.** §5.2: a number folded into a total is a
 * promise, and if freight entered `Total` here and moved in the checkout when
 * the buyer picked *entrega agendada*, the two screens would disagree about the
 * price. It is stated beside the sum, in its own voice, and `estimarFrete`
 * computes it separately for exactly that reason.
 *
 * **Montagem is not a row.** §4.3 put it inside the line, so it is inside
 * `Subtotal`; breaking it out again here would read as double-counting.
 */
export const resumoDoPedido = (
  carrinho: Carrinho,
  catalogo: CatalogoDoCarrinho,
): ResumoDoPedido => {
  const linhas = resolver(carrinho, catalogo);

  const pecas = linhas.reduce((total, { item }) => total + item.quantidade, 0);
  const total = linhas.reduce((soma, { peca, item }) => soma + subtotalDaLinha(peca, item), 0);
  const { parcelas, valorCentavos } = linhaDeParcelamento(total);

  const grupos = new Set(
    linhas.map(({ peca }) => grupoDeEntrega(peca)).filter((grupo) => grupo !== null),
  );

  // An `esgotado` line's price still counts in Subtotal and Total (§6): silently
  // excluding it produces the "why is my total different from what I saw?"
  // defect, which is worse than a blocked button that says why.
  const esgotadas = linhas.some(({ peca }) => peca.disponibilidade === "esgotado");
  const comMontagem = linhas.some(({ peca, item }) => montagemDaLinha(peca, item) > 0);

  return {
    subtotalRotulo: `Subtotal (${pecas} ${pecas === 1 ? "peça" : "peças"})`,
    subtotal: reais(total),
    total: reais(total),
    aVista: `${reais(precoAVista(total))} à vista`,
    pix: `${politicas.descontoPixPercent}% À VISTA NO PIX`,
    // The parcela count is derived against the **cart total**, not per piece —
    // `produto.md`'s rule applied to the sum, as §5.4 requires.
    parcelamento: parcelas < 2 ? null : `ou ${parcelas}x de ${reais(valorCentavos)} sem juros`,
    frete: estimarFrete(carrinho, catalogo),
    entregas:
      grupos.size > 1
        ? `Sua compra chega em ${NUMERAIS[grupos.size] ?? grupos.size} entregas.`
        : null,
    bloqueio: esgotadas ? BLOQUEIO : null,
    // §5.4 — prose and not a badge, and the second clause renders only when some
    // line has montagem contracted; otherwise the sentence ends at the peça.
    arrependimento: comMontagem
      ? "Você pode desistir da compra em até 7 dias corridos após receber a peça — ou após a montagem, quando contratada."
      : "Você pode desistir da compra em até 7 dias corridos após receber a peça.",
  };
};
