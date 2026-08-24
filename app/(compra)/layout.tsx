import type { ReactNode } from "react";
import { Navbar } from "@/components/chrome/navbar";
import { Rodape } from "@/components/chrome/rodape";

/**
 * `/checkout` and `/pedido-confirmado` — the flow `checkout.md` governs, and the
 * only two routes in the store that wear reduced chrome.
 *
 * The bar is the **wordmark only** (`checkout.md` §3): no room links, no mega
 * menu, no `CARRINHO (n)`. Advertising four exits mid-purchase is chrome working
 * against the page it sits on, and the resumo itemises the same cart half a
 * screen away, so the counter is a second answer to a question already answered.
 * Leaving stays possible through the wordmark; it is simply not offered.
 *
 * It closes on the **reduced footer**: the same component reading the same
 * `loja`, with the Mincho line, the newsletter and two link columns withheld and
 * the whole legal block kept, because the decree's identification duty does not
 * stop at checkout — or at the confirmation (`rodape.md` §9, `checkout.md` §10).
 *
 * Both routes are chrome-reduced rather than only the first: `checkout.md`
 * governs the pair, §3 is its chrome section, and the confirmation's designed
 * exit is `VER TODAS AS PEÇAS` plus the footer it keeps.
 */
export default function LayoutDaCompra({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar variante="reduzida" />
      <main className="flex-1">{children}</main>
      <Rodape variante="reduzido" />
    </>
  );
}
