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
