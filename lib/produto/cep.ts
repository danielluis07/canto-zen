// The CEP widget's reasoning, kept out of the widget.
//
// `pagina-produto.md` §2.7 answers frete on the page where the decision is being
// made — the biggest divergence from an American PDP. What that costs is an
// interactive block, and `build-spec.md` §Seam 2 states the deal explicitly: the
// interaction logic that can be pulled below the DOM (CEP resolution, option
// construction) is pulled here and tested at seam 1, and what is left in the
// component is wiring.
//
// Nothing here fetches, transmits or persists. The fixture table and the freight
// arithmetic are `lib/catalogo/frete.ts`'s; this file spends none of its own —
// every figure below arrives already computed, and the one thing it decides is
// how a computed figure is written.

import {
  CEP_CORRIGIVEL,
  cepTemOitoDigitos,
  cotarFrete,
  reais,
  resolverCep,
  type EnderecoFixture,
  type Produto,
  type RegiaoFrete,
} from "../catalogo";

// ---------------------------------------------------------------------------
// The field's copy — §2.7's initial state
// ---------------------------------------------------------------------------

export const CEP_TITULO = "CALCULAR FRETE E PRAZO";
export const CEP_BOTAO = "CALCULAR";
export const CEP_PLACEHOLDER = "00000-000";

/** `NÃO SEI MEU CEP` opens the Correios lookup in a new tab — §2.7. */
export const CEP_NAO_SEI = "NÃO SEI MEU CEP";
export const BUSCA_CORREIOS = "https://buscacepinter.correios.com.br/app/endereco/index.php";

/**
 * The note under the table, and the reason the prazo needs no per-row gloss:
 * *dias úteis* and *após a confirmação do pagamento* are store-wide, so they are
 * stated once rather than repeated in both rows.
 */
export const NOTA_PRAZO = "PRAZO EM DIAS ÚTEIS, CONTADO APÓS A CONFIRMAÇÃO DO PAGAMENTO.";

/**
 * What the quote needs from the piece, and nothing else — the box, the free
 * freight scope and the two facts the note lines read.
 *
 * A `Produto` satisfies it, so the page hands the record straight over; the
 * narrow type is what keeps the whole catalogue record out of the client
 * boundary, and it says which four fields the widget actually depends on.
 */
export type PecaParaFrete = Pick<
  Produto,
  "embalagem" | "freteGratis" | "disponibilidade" | "prazoProducaoSemanas"
>;

// ---------------------------------------------------------------------------
// The mask
// ---------------------------------------------------------------------------

/**
 * `00000-000`, applied as the reader types and to whatever they paste.
 *
 * Digits only and eight of them at most, so the `Corrigível` state is reachable
 * from *too few* and never from too many: a ninth digit is a slip the field can
 * simply decline, while six digits are a fact about the CEP the reader believes
 * they have, and `CEP_CORRIGIVEL` is what answers that.
 */
export const mascaraDeCep = (entrada: string): string => {
  const digitos = entrada.replace(/\D/g, "").slice(0, 8);
  return digitos.length > 5 ? `${digitos.slice(0, 5)}-${digitos.slice(5)}` : digitos;
};

// ---------------------------------------------------------------------------
// The answer
// ---------------------------------------------------------------------------

/**
 * One row of §2.7's table. `valor` is a **string**, and that is the point: the
 * `Grátis` word is decided here, once, against `OpcaoFrete`'s union — a row that
 * carried a number would put `R$ 0,00` one careless formatter away from the
 * screen, which four specs forbid.
 */
export type LinhaDeFrete = { rotulo: string; detalhe: string; valor: string };

/**
 * What a submit produces. Three arms rather than one record with optional
 * fields, for the same reason `CepResolvido` has three: the two error classes
 * are different events (`erros.md` §5.2), and a widget that forgets one of them
 * does not compile.
 */
export type ResultadoDoCep =
  | { estado: "corrigivel"; mensagem: string }
  | { estado: "nao-atendida"; mensagem: string; saibaMais: string }
  | {
      estado: "cotado";
      /** The bare eight digits — the shape `Carrinho.cep` carries. */
      cep: string;
      regiao: RegiaoFrete;
      /** A fixture's address, or `null`: a served CEP autofills nothing. */
      endereco: string | null;
      opcoes: LinhaDeFrete[];
      notas: string[];
    };

/** `Av. Paulista, Bela Vista, São Paulo — SP`; the logradouro is optional. */
const enderecoEmTexto = ({ logradouro, bairro, cidade, uf }: EnderecoFixture): string =>
  `${[logradouro, bairro, cidade].filter(Boolean).join(", ")} — ${uf}`;

/**
 * The reader's CEP, this piece's box and its `freteGratis` scope in; the field's
 * whole answer out.
 *
 * The digit count is checked **here** rather than in `cotarFrete`, which throws
 * on malformed input by contract: the `Corrigível` belongs to the field, and the
 * freight rule never sees a CEP that has not passed it.
 */
export const consultarFrete = (entrada: string, peca: PecaParaFrete): ResultadoDoCep => {
  if (!cepTemOitoDigitos(entrada)) {
    return { estado: "corrigivel", mensagem: CEP_CORRIGIVEL.mensagem };
  }

  const resolvido = resolverCep(entrada);
  if (resolvido.situacao === "nao-atendida") {
    return {
      estado: "nao-atendida",
      mensagem: resolvido.mensagem,
      saibaMais: resolvido.saibaMais,
    };
  }

  const opcoes = cotarFrete(resolvido.cep, peca.embalagem, peca.freteGratis);
  // Unreachable: the refusal was answered above, and a resolved CEP quotes.
  if (!Array.isArray(opcoes)) throw new Error(`frete refused a served CEP: ${resolvido.cep}`);

  return {
    estado: "cotado",
    cep: resolvido.cep,
    regiao: resolvido.regiao,
    endereco: resolvido.situacao === "fixture" ? enderecoEmTexto(resolvido.endereco) : null,
    opcoes: opcoes.map((opcao) => ({
      rotulo: opcao.rotulo,
      // Agendada carries the padrão prazo and is chosen by date, so restating
      // the same figure beside it would read as a second, better prazo.
      detalhe:
        opcao.modalidade === "agendada"
          ? "data à sua escolha"
          : `até ${opcao.prazoDiasUteis} dias úteis`,
      valor: opcao.gratis ? "Grátis" : reais(opcao.centavos),
    })),
    notas:
      peca.disponibilidade === "sob-encomenda"
        ? [NOTA_PRAZO, `PRODUÇÃO DE ${peca.prazoProducaoSemanas} SEMANAS ANTES DO ENVIO.`]
        : [NOTA_PRAZO],
  };
};
