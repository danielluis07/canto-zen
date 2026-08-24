// The checkout's state, in the browser and nowhere else.
//
// `checkout.md` §12 types `Checkout` and states the constraint the whole flow
// hangs from: **nothing is persisted and nothing is transmitted.** That is not a
// description of the build, it is the build's contract — the interstício claims
// literally that *nada que você digitou saiu deste navegador*, so there is no
// fetch, no server action, no analytics call and no storage write anywhere
// beneath this file.
//
// Two shapes rather than one, and the split is the point:
//
// - **`Rascunho`** is what the form holds while it is being filled — every field
//   a string, including the ones that never become part of the order.
// - **`Checkout`** is `checkout.md` §12 verbatim, and only a complete, valid
//   rascunho produces one.
//
// The card's digits are in the first and **not in the second**, because §12 does
// not put them there: `pagamento` for cartão carries a parcela count and nothing
// else. So the number, the CVV and the validade are typed, masked, Luhn-checked
// and then never promoted into the flow's own state — the most literal reading
// available of a store that does not charge anybody.
//
// Every rule below is a pure function over `Rascunho`, which is `build-spec.md`
// §Seam 2's deal: the reasoning is testable at seam 1 without a browser, and
// what is left in the component is wiring.

import { resolverCep, type CepResolvido, type Modalidade } from "../catalogo";
import {
  cartaoPassaLuhn,
  celularTemForma,
  cepTemOitoDigitos,
  cpfEValido,
  digitosDe,
  emailTemForma,
  MENSAGENS,
  nomeTemForma,
  validadeEValida,
  validadeTemMesForaDaFaixa,
  type Mensagem,
} from "./campos";

export type { Modalidade };
export type MetodoPagamento = "pix" | "cartao";

/** `checkout.md` §12, unchanged. `parcelas` is `1..politicas.parcelasMax`. */
export type Checkout = {
  identificacao: { email: string; cpf: string; nome: string; celular: string };
  entrega: {
    cep: string;
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    modalidade: Modalidade;
  };
  pagamento: { metodo: "pix" } | { metodo: "cartao"; parcelas: number };
};

/**
 * The form's own state. Flat and all-strings, because that is what an input
 * holds: a rascunho with a `number` in it would need a parse at every keystroke
 * and would have no way to represent *half a figure typed*.
 */
export type Rascunho = {
  email: string;
  cpf: string;
  nome: string;
  celular: string;

  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  modalidade: Modalidade;

  metodo: MetodoPagamento;
  /** Meaningful only under `metodo: 'cartao'`; 1 is the à-vista tier. */
  parcelas: number;
  /** Typed, masked and checked — and never promoted into `Checkout`. */
  cartao: { numero: string; nome: string; validade: string; cvv: string; cpf: string };
};

/**
 * A fresh form, opened with whatever the cart already knows.
 *
 * `carrinho.md` §11 hands the session CEP over, so anyone who arrived through a
 * PDP opens the Entrega section already answered — asking for the same CEP a
 * third time is exactly the defect the shared field exists to prevent
 * (`build-spec.md` §State).
 *
 * **Padrão is preselected** (`checkout.md` §6.2) and **Pix is preselected**
 * (§7.1): both are the cheaper answer, and a checkout that opens on the dearer
 * one is charging for the reader's inattention.
 */
export const rascunhoInicial = (cep?: string): Rascunho => ({
  email: "",
  cpf: "",
  nome: "",
  celular: "",

  cep: cep ?? "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
  modalidade: "padrao",

  metodo: "pix",
  parcelas: 1,
  cartao: { numero: "", nome: "", validade: "", cvv: "", cpf: "" },
});

// ---------------------------------------------------------------------------
// The address autofill — checkout.md §6.1
// ---------------------------------------------------------------------------

/**
 * A valid CEP auto-fills logradouro, bairro, cidade and UF. **This is a hard
 * Brazilian expectation, not a nicety** (research §5), and it reads a fixture
 * table rather than a service — the map rules out backend integration of any
 * kind, and `resolverCep` is where the table lives.
 *
 * The three outcomes are kept apart on purpose:
 *
 * - **fixture** — fills the four fields, all still editable.
 * - **servido** — the region is computable from the prefix and the street is
 *   not, so the fields are **left as they are, empty and editable**, rather than
 *   guessed. A guessed address is worse than no address.
 * - **não atendida** — nothing is filled; the section states the `Fato`.
 *
 * A CEP the reader edits after an autofill wins: this returns a new rascunho and
 * never writes into the old one, so a later keystroke is simply a later value.
 */
export const autopreencher = (rascunho: Rascunho, cep: string): Rascunho => {
  if (!cepTemOitoDigitos(cep)) return { ...rascunho, cep };

  const resolvido: CepResolvido = resolverCep(cep);
  if (resolvido.situacao !== "fixture") return { ...rascunho, cep };

  const { logradouro, bairro, cidade, uf } = resolvido.endereco;
  return {
    ...rascunho,
    cep,
    // §4.2's fixture names a bairro rather than a logradouro for five of six
    // rows; where it does, the street stays the reader's to write.
    logradouro: logradouro ?? "",
    bairro,
    cidade,
    uf,
  };
};

// ---------------------------------------------------------------------------
// Validation, section by section — checkout.md §§5, 6, 7 and erros.md §5
// ---------------------------------------------------------------------------

export type Campo =
  | "email"
  | "cpf"
  | "nome"
  | "celular"
  | "cep"
  | "logradouro"
  | "numero"
  | "bairro"
  | "cidade"
  | "uf"
  | "cartaoNumero"
  | "cartaoNome"
  | "validade"
  | "cvv"
  | "cartaoCpf";

export type Erros = Partial<Record<Campo, Mensagem>>;

/** The three accordion sections, in the order `checkout.md` §4 fixes them. */
export type Secao = 1 | 2 | 3;

/** §5 — e-mail, CPF, nome, celular, in that order. */
export const validarIdentificacao = (rascunho: Rascunho): Erros => {
  const erros: Erros = {};

  if (!emailTemForma(rascunho.email)) erros.email = MENSAGENS.email;
  if (digitosDe(rascunho.cpf).length !== 11) erros.cpf = MENSAGENS.cpf;
  else if (!cpfEValido(rascunho.cpf)) erros.cpf = MENSAGENS.cpfDigitos;
  if (!nomeTemForma(rascunho.nome)) erros.nome = MENSAGENS.nome;
  if (!celularTemForma(rascunho.celular)) erros.celular = MENSAGENS.celular;

  return erros;
};

/**
 * §6.1 — CEP first, `Número` separate and required, `Complemento` optional.
 *
 * The CEP produces **both** error classes and they are not the same event: a
 * short CEP is the reader's typo and states its fix; a correctly-typed CEP the
 * store does not reach is a `Fato` about the store's limit and carries the way
 * on (`erros.md` §5.2, `carrinho.md` §8's *região não atendida*).
 */
export const validarEntrega = (rascunho: Rascunho): Erros => {
  const erros: Erros = {};

  if (!cepTemOitoDigitos(rascunho.cep)) {
    erros.cep = MENSAGENS.cep;
  } else {
    const resolvido = resolverCep(rascunho.cep);
    if (resolvido.situacao === "nao-atendida") {
      erros.cep = {
        classe: "fato",
        texto: resolvido.mensagem,
        saibaMais: resolvido.saibaMais,
      };
    }
  }

  if (!nomeTemForma(rascunho.logradouro)) erros.logradouro = MENSAGENS.logradouro;
  if (!nomeTemForma(rascunho.numero)) erros.numero = MENSAGENS.numero;
  if (!nomeTemForma(rascunho.bairro)) erros.bairro = MENSAGENS.bairro;
  if (!nomeTemForma(rascunho.cidade)) erros.cidade = MENSAGENS.cidade;
  if (rascunho.uf.trim().length !== 2) erros.uf = MENSAGENS.uf;

  return erros;
};

/**
 * §7 — Pix asks for nothing at all, so the section is complete the moment it is
 * chosen. That asymmetry is the honest one: there is no code to type because
 * §7.1 refuses to fabricate one.
 */
export const validarPagamento = (rascunho: Rascunho): Erros => {
  if (rascunho.metodo === "pix") return {};

  const erros: Erros = {};
  const { cartao } = rascunho;

  if (digitosDe(cartao.numero).length !== 16) erros.cartaoNumero = MENSAGENS.cartaoNumero;
  else if (!cartaoPassaLuhn(cartao.numero)) erros.cartaoNumero = MENSAGENS.cartaoDigitos;

  if (!nomeTemForma(cartao.nome)) erros.cartaoNome = MENSAGENS.cartaoNome;

  if (validadeTemMesForaDaFaixa(cartao.validade)) erros.validade = MENSAGENS.validadeMes;
  else if (!validadeEValida(cartao.validade)) erros.validade = MENSAGENS.validade;

  const cvv = digitosDe(cartao.cvv).length;
  if (cvv !== 3 && cvv !== 4) erros.cvv = MENSAGENS.cvv;

  if (digitosDe(cartao.cpf).length !== 11) erros.cartaoCpf = MENSAGENS.cpf;
  else if (!cpfEValido(cartao.cpf)) erros.cartaoCpf = MENSAGENS.cpfDigitos;

  return erros;
};

const VALIDACOES: Record<Secao, (rascunho: Rascunho) => Erros> = {
  1: validarIdentificacao,
  2: validarEntrega,
  3: validarPagamento,
};

export const validarSecao = (rascunho: Rascunho, secao: Secao): Erros =>
  VALIDACOES[secao](rascunho);

export const secaoCompleta = (rascunho: Rascunho, secao: Secao): boolean =>
  Object.keys(VALIDACOES[secao](rascunho)).length === 0;

/**
 * The CTA's reason to refuse, or `null` — `checkout.md` §9.
 *
 * **The lock is soft** (§4): a later section can be opened at any time, it just
 * cannot be submitted while an earlier one is incomplete. Hard-locking produces
 * a dead form with no explanation, which is worse than a button that says why,
 * and the named section is the one `ALTERAR` opens.
 */
export const BLOQUEIO_IDENTIFICACAO = "COMPLETE A IDENTIFICAÇÃO PARA CONTINUAR.";
export const BLOQUEIO_ENTREGA = "COMPLETE A ENTREGA PARA CONTINUAR.";
export const BLOQUEIO_PAGAMENTO = "COMPLETE O PAGAMENTO PARA CONTINUAR.";
/** §9 — a piece can go esgotado between the cart and here; `/carrinho` removes. */
export const BLOQUEIO_ESGOTADO = "REMOVA AS PEÇAS ESGOTADAS PARA CONTINUAR.";

export type Bloqueio = { secao: Secao | null; mensagem: string };

export const bloqueioDoCheckout = (
  rascunho: Rascunho,
  temEsgotada: boolean,
): Bloqueio | null => {
  // The esgotado line is first because it is the one the reader cannot fix here
  // at all: every other reason names a section this page owns.
  if (temEsgotada) return { secao: null, mensagem: BLOQUEIO_ESGOTADO };
  if (!secaoCompleta(rascunho, 1)) return { secao: 1, mensagem: BLOQUEIO_IDENTIFICACAO };
  if (!secaoCompleta(rascunho, 2)) return { secao: 2, mensagem: BLOQUEIO_ENTREGA };
  if (!secaoCompleta(rascunho, 3)) return { secao: 3, mensagem: BLOQUEIO_PAGAMENTO };
  return null;
};

// ---------------------------------------------------------------------------
// The promotion — Rascunho → Checkout
// ---------------------------------------------------------------------------

/**
 * `checkout.md` §12's shape, and `null` for anything short of it.
 *
 * This is the only place a `Checkout` comes from, so the typed record cannot
 * exist half-filled — and the card's number, CVV and validade do not cross,
 * because §12 does not carry them. `complemento` is omitted rather than stored
 * as `''`: the field is optional in the type, and an empty string is a value.
 */
export const checkoutDe = (rascunho: Rascunho): Checkout | null => {
  if (!secaoCompleta(rascunho, 1)) return null;
  if (!secaoCompleta(rascunho, 2)) return null;
  if (!secaoCompleta(rascunho, 3)) return null;

  const complemento = rascunho.complemento.trim();

  return {
    identificacao: {
      email: rascunho.email.trim(),
      cpf: digitosDe(rascunho.cpf),
      nome: rascunho.nome.trim(),
      celular: digitosDe(rascunho.celular),
    },
    entrega: {
      cep: digitosDe(rascunho.cep),
      logradouro: rascunho.logradouro.trim(),
      numero: rascunho.numero.trim(),
      ...(complemento ? { complemento } : {}),
      bairro: rascunho.bairro.trim(),
      cidade: rascunho.cidade.trim(),
      uf: rascunho.uf.trim().toUpperCase(),
      modalidade: rascunho.modalidade,
    },
    pagamento:
      rascunho.metodo === "pix"
        ? { metodo: "pix" }
        : { metodo: "cartao", parcelas: rascunho.parcelas },
  };
};
