// Figures as the store writes them.
//
// Every price in the storefront is a `Centavos` integer until the moment it is
// read, and this is that moment. The formatting is written out rather than left
// to `Intl`, because the store's copy fixes the exact string — `R$ 8.820,00`,
// one space after the símbolo — and an ICU release that changes the separator
// it inserts would change shipped copy without anything saying so.

import type { Centavos } from "./modelo";

/** `1234567` → `R$ 12.345,67`. Always two decimals, never a bare integer. */
export const reais = (centavos: Centavos): string => {
  const sinal = centavos < 0 ? "-" : "";
  const absoluto = Math.abs(Math.round(centavos));
  const inteiro = Math.floor(absoluto / 100).toString();
  const fracao = (absoluto % 100).toString().padStart(2, "0");
  const milhares = inteiro.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${sinal}R$ ${milhares},${fracao}`;
};

