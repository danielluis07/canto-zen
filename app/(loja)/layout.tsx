import type { ReactNode } from "react";
import { Navbar } from "@/components/chrome/navbar";
import { Rodape } from "@/components/chrome/rodape";

/**
 * Every route but the two in `(compra)`. The full navbar keeps the four
 * ambientes one gesture away (`navbar.md` §1), and the full footer closes the
 * page on facts — `/carrinho` included, because leaving the cart for an ambiente
 * is a legitimate path and the cart is still navigation (`rodape.md` §9).
 */
export default function LayoutDaLoja({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Rodape variante="completo" />
    </>
  );
}
