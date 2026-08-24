"use client";

import type { CatalogoDoCarrinho } from "@/lib/carrinho/catalogo";
import { useCarrinho } from "@/lib/carrinho/estado";
import { Superficie } from "./superficie";

/**
 * `/carrinho`, connected to the browser's cart — `carrinho.md` §9.
 *
 * This component exists to do one thing: read the store. The surface it renders
 * is pure over the `Carrinho` it is handed, which is what keeps every state of
 * the page renderable in a test without a browser.
 *
 * **The prerendered document is always the empty cart**, and that is correct
 * rather than a limitation. The cart lives in this tab and nothing persists it,
 * so the server has no cart to render and hydration has nothing to disagree
 * with; a reader arriving from a PDP arrives by client navigation, with the
 * store already holding what they added.
 */
export function PaginaDoCarrinho({ catalogo }: { catalogo: CatalogoDoCarrinho }) {
  return <Superficie carrinho={useCarrinho()} catalogo={catalogo} />;
}
