"use client";

// The cart's state, in the browser and nowhere else.
//
// This file exists because the navbar counter and the cart page must read **one**
// source — `build-spec.md` states that as the reason `Carrinho` is a single piece
// of client state, so the badge and the page cannot disagree. What lives here is
// therefore the shape and the reading of it; the mutations (adding a slug,
// stepping a quantity, choosing montagem) belong to the carrinho surface and land
// with it. Nothing is persisted and nothing is transmitted.

import { createContext, useContext, useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

/** `carrinho.md` §9. */
export type ItemCarrinho = { slug: string; quantidade: number; montagem: boolean };
export type Carrinho = { itens: ItemCarrinho[]; cep?: string };

export const carrinhoVazio: Carrinho = { itens: [] };

/** The count the navbar shows: pieces, not lines. */
export function quantidadeTotal(carrinho: Carrinho): number {
  return carrinho.itens.reduce((total, item) => total + item.quantidade, 0);
}

/**
 * What the produto page's `COMPRAR` hands over — `carrinho.md` §§4.1, 4.3.
 *
 * Adding a slug already present **increments** rather than appending a second
 * line: one acabamento is one line, and two acabamentos of one família are two,
 * which the slug already decides. Montagem travels as an attribute of the line
 * and takes the choice made on this visit, the later statement of the same
 * preference — the cart's own checkbox stays editable either way.
 *
 * A pure function over the state rather than a method on the provider, so the
 * rule is testable below the DOM. The rest of the mutations — the stepper,
 * removal, the montagem toggle — land with the carrinho surface.
 */
export function adicionarAoCarrinho(
  carrinho: Carrinho,
  { slug, montagem }: { slug: string; montagem: boolean },
): Carrinho {
  const presente = carrinho.itens.some((item) => item.slug === slug);

  return {
    ...carrinho,
    itens: presente
      ? carrinho.itens.map((item) =>
          item.slug === slug
            ? { ...item, quantidade: item.quantidade + 1, montagem }
            : item,
        )
      : [...carrinho.itens, { slug, quantidade: 1, montagem }],
  };
}

/**
 * The session CEP — `pagina-produto.md` §2.7, `build-spec.md` §State.
 *
 * Typed once on the produto page and read pre-filled by the cart and the
 * checkout: asking for the same CEP three times is the defect the convention
 * exists to avoid, and one field on `Carrinho` is what makes the three surfaces
 * unable to disagree. Stored as the **bare eight digits**, so a reader who typed
 * the hyphen and one who did not leave the same value behind, and the surfaces
 * downstream mask it themselves.
 *
 * A malformed CEP is not remembered: it is the `Corrigível` the field answers,
 * and carrying it forward would pre-fill checkout with a known typo.
 */
export function lembrarCep(carrinho: Carrinho, cep: string): Carrinho {
  const digitos = cep.replace(/\D/g, "");
  return digitos.length === 8 ? { ...carrinho, cep: digitos } : carrinho;
}

type EstadoCarrinho = {
  carrinho: Carrinho;
  definirCarrinho: Dispatch<SetStateAction<Carrinho>>;
};

const Contexto = createContext<EstadoCarrinho | null>(null);

export function ProvedorCarrinho({ children }: { children: ReactNode }) {
  const [carrinho, definirCarrinho] = useState<Carrinho>(carrinhoVazio);
  const valor = useMemo(() => ({ carrinho, definirCarrinho }), [carrinho]);
  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

/**
 * Outside a provider the cart is empty rather than an error: the chrome renders
 * on every route, including the ones a test renders on its own, and an empty
 * cart is the honest reading of "no cart state here".
 */
export function useCarrinho(): Carrinho {
  return useContext(Contexto)?.carrinho ?? carrinhoVazio;
}

export function useDefinirCarrinho(): Dispatch<SetStateAction<Carrinho>> | null {
  return useContext(Contexto)?.definirCarrinho ?? null;
}
