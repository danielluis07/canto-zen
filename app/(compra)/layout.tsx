import type { ReactNode } from "react";
import { Rodape } from "@/components/chrome/rodape";

/**
 * `/checkout`, and nothing else — the checkout page lands in this group when it
 * is built. It closes on the reduced footer: the same component reading the same
 * `loja`, with the Mincho line, the newsletter and two link columns withheld and
 * the whole legal block kept, because the decree's identification duty does not
 * stop at checkout (`rodape.md` §9).
 */
export default function LayoutDaCompra({ children }: { children: ReactNode }) {
  return (
    <>
      <main className="flex-1">{children}</main>
      <Rodape variante="reduzido" />
    </>
  );
}
