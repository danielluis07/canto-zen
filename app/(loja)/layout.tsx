import type { ReactNode } from "react";
import { Rodape } from "@/components/chrome/rodape";

/**
 * Every route but `/checkout`. The full footer closes the page on facts —
 * `/carrinho` included, because leaving the cart for an ambiente is a legitimate
 * path and the cart is still navigation (`rodape.md` §9).
 */
export default function LayoutDaLoja({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Rodape variante="completo" />
    </>
  );
}
