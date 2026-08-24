// The checkout's fields: what each one masks, and what it says when it is wrong.
//
// Everything here is arithmetic and string work — no service stands behind any
// of it, and none is needed. `checkout.md` §5 makes that the point rather than a
// limitation: **what can be verified honestly offline is verified**, and what
// cannot is not implied. CPF check digits and the card's Luhn sum are real; a
// brand, a BIN or a bank is not, so neither appears.
//
// `build-spec.md` §Seam 2 states the deal this file exists to keep: interaction
// logic that can be pulled below the DOM is pulled here and tested at seam 1,
// and what is left in the component is wiring. A validation rule that lived in
// an `onSubmit` would be reachable only through a browser this project does not
// drive.
//
// Nothing here fetches, transmits or persists — `checkout.md` §12, and it is a
// constraint on the build rather than a description of one.

import { CEP_CORRIGIVEL, cepTemOitoDigitos } from "../catalogo";

// ---------------------------------------------------------------------------
// The two error classes — erros.md §5.2
// ---------------------------------------------------------------------------

/**
 * A **Corrigível** states the fix and never the fault; a **Fato** states the
 * fact and offers the way on. They are different events, and the split is what
 * stops the store telling a reader that their correctly-typed CEP is "inválido".
 *
 * Two arms rather than one record with an optional link, for the reason
 * `ResultadoDoCep` has three: a surface that renders a `Fato` without its way on
 * does not compile.
 */
export type Mensagem =
  | { classe: "corrigivel"; texto: string }
  | { classe: "fato"; texto: string; saibaMais: string };

const corrigivel = (texto: string): Mensagem => ({ classe: "corrigivel", texto });

/** Every message the flow can produce, in one place, in the Corpo S voice. */
export const MENSAGENS = {
  email: corrigivel("O e-mail precisa de um @ e de um domínio."),
  cpf: corrigivel("CPF tem 11 dígitos."),
  cpfDigitos: corrigivel("Confira os números do CPF."),
  nome: corrigivel("Escreva o nome completo."),
  celular: corrigivel("Celular tem DDD e 8 ou 9 dígitos."),
  cep: corrigivel(CEP_CORRIGIVEL.mensagem),
  logradouro: corrigivel("Escreva o endereço."),
  numero: corrigivel("Escreva o número. Se não houver, escreva s/n."),
  bairro: corrigivel("Escreva o bairro."),
  cidade: corrigivel("Escreva a cidade."),
  uf: corrigivel("UF tem 2 letras."),
  cartaoNumero: corrigivel("O número do cartão tem 16 dígitos."),
  cartaoDigitos: corrigivel("Confira os números do cartão."),
  cartaoNome: corrigivel("Escreva o nome como está impresso no cartão."),
  validade: corrigivel("Validade tem mês e ano — 00/00."),
  validadeMes: corrigivel("O mês da validade vai de 01 a 12."),
  cvv: corrigivel("CVV tem 3 ou 4 dígitos."),
} as const;

// ---------------------------------------------------------------------------
// The masks — checkout.md §§5, 6.1, 7.2
//
// Every mask takes digits only and caps at its own length, so the field can
// decline a keystroke past the end while still reporting *too few* as a
// `Corrigível`. That asymmetry is `mascaraDeCep`'s and is deliberate: a ninth
// digit is a slip the field simply refuses, while six digits are a fact about
// what the reader believes they have, which a message has to answer.
// ---------------------------------------------------------------------------

export const digitosDe = (entrada: string): string => entrada.replace(/\D/g, "");

const emGrupos = (digitos: string, tamanhos: number[], separadores: string[]): string => {
  let saida = "";
  let lido = 0;

  tamanhos.forEach((tamanho, indice) => {
    const parte = digitos.slice(lido, lido + tamanho);
    if (!parte) return;
    saida += (lido > 0 ? (separadores[indice - 1] ?? "") : "") + parte;
    lido += tamanho;
  });

  return saida;
};

/** `000.000.000-00`. */
export const mascaraDeCpf = (entrada: string): string =>
  emGrupos(digitosDe(entrada).slice(0, 11), [3, 3, 3, 2], [".", ".", "-"]);

/**
 * `(00) 00000-0000`, and `(00) 0000-0000` while the ninth digit is missing.
 *
 * The DDD lives inside the same field — `checkout.md` §5 — so there is no second
 * input to tab through and no chance of a number that is valid in two pieces and
 * invalid as a whole.
 */
export const mascaraDeCelular = (entrada: string): string => {
  const digitos = digitosDe(entrada).slice(0, 11);
  if (digitos.length <= 2) return digitos;

  const ddd = `(${digitos.slice(0, 2)}) `;
  const resto = digitos.slice(2);
  return resto.length <= 4
    ? ddd + resto
    : `${ddd}${resto.slice(0, resto.length - 4)}-${resto.slice(resto.length - 4)}`;
};

/** `0000 0000 0000 0000`. */
export const mascaraDeCartao = (entrada: string): string =>
  emGrupos(digitosDe(entrada).slice(0, 16), [4, 4, 4, 4], [" ", " ", " "]);

/** `00/00`. */
export const mascaraDeValidade = (entrada: string): string =>
  emGrupos(digitosDe(entrada).slice(0, 4), [2, 2], ["/"]);

/** Digits only — the CVV has no separator to place. */
export const mascaraDeCvv = (entrada: string): string => digitosDe(entrada).slice(0, 4);

/** `SP`. Two letters, upper-cased as they are typed. */
export const mascaraDeUf = (entrada: string): string =>
  entrada
    .replace(/[^a-zA-ZçÇ]/g, "")
    .slice(0, 2)
    .toUpperCase();

// ---------------------------------------------------------------------------
// CPF — checkout.md §5
// ---------------------------------------------------------------------------

const digitoVerificador = (base: string, pesoInicial: number): number => {
  const soma = [...base].reduce(
    (total, algarismo, indice) => total + Number(algarismo) * (pesoInicial - indice),
    0,
  );
  const resto = (soma * 10) % 11;
  return resto === 10 ? 0 : resto;
};

/**
 * The check digits, for real — `checkout.md` §5.
 *
 * It is pure arithmetic with no service behind it, and an invalid CPF sailing
 * through is the single cheapest tell that would break the illusion the rest of
 * the page maintains. **Validation is a UI convention here, not a legal claim.**
 *
 * The repdigit refusal is part of the convention rather than part of the
 * algorithm: `111.111.111-11` satisfies both check digits and is the first thing
 * anyone types to test a form.
 */
export const cpfEValido = (entrada: string): boolean => {
  const digitos = digitosDe(entrada);
  if (digitos.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(digitos)) return false;

  const primeiro = digitoVerificador(digitos.slice(0, 9), 10);
  const segundo = digitoVerificador(digitos.slice(0, 10), 11);
  return primeiro === Number(digitos[9]) && segundo === Number(digitos[10]);
};

// ---------------------------------------------------------------------------
// Cartão — checkout.md §7.2
// ---------------------------------------------------------------------------

/**
 * Luhn, and nothing more. **No brand detection and no BIN lookup** — both imply
 * a service, and Luhn holds the same line the CPF check digits do: it is
 * arithmetic the browser can finish on its own.
 */
export const cartaoPassaLuhn = (entrada: string): boolean => {
  const digitos = digitosDe(entrada);
  if (digitos.length !== 16) return false;

  const soma = [...digitos].reverse().reduce((total, algarismo, indice) => {
    const valor = Number(algarismo);
    if (indice % 2 === 0) return total + valor;
    const dobrado = valor * 2;
    return total + (dobrado > 9 ? dobrado - 9 : dobrado);
  }, 0);

  return soma % 10 === 0;
};

/**
 * Shape only: two digits of month between 01 and 12, two of year.
 *
 * **Expiry is deliberately not checked against today.** A card that expires next
 * month is a fact about a clock, and the store has no transaction to protect
 * from one; introducing `Date.now()` here would also make a pure function's
 * result depend on when the test runs.
 */
export const validadeEValida = (entrada: string): boolean => {
  const digitos = digitosDe(entrada);
  if (digitos.length !== 4) return false;
  const mes = Number(digitos.slice(0, 2));
  return mes >= 1 && mes <= 12;
};

/** Four digits typed and the month out of range — the message that says which. */
export const validadeTemMesForaDaFaixa = (entrada: string): boolean => {
  const digitos = digitosDe(entrada);
  if (digitos.length !== 4) return false;
  const mes = Number(digitos.slice(0, 2));
  return mes < 1 || mes > 12;
};

// ---------------------------------------------------------------------------
// The rest
// ---------------------------------------------------------------------------

/**
 * Shape only — `checkout.md` §5. There is no mailbox to knock on, so anything
 * beyond "an @ with something either side of it" would be a claim about
 * deliverability the store cannot make.
 */
export const emailTemForma = (entrada: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(entrada.trim());

/**
 * Non-empty, and **one field** — never first name and surname. A name split in
 * two is a form asking a question about how a name is built, which is a question
 * with a different answer in every country the store might ship to.
 */
export const nomeTemForma = (entrada: string): boolean => entrada.trim().length > 0;

/** 10 or 11 digits, DDD included — `checkout.md` §5. */
export const celularTemForma = (entrada: string): boolean => {
  const quantidade = digitosDe(entrada).length;
  return quantidade === 10 || quantidade === 11;
};

export { cepTemOitoDigitos };
