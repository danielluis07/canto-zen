import type { Metadata } from "next";
import { catalogoDoCarrinho } from "@/lib/carrinho/catalogo";
import { PaginaDoCheckout } from "@/components/checkout/pagina";

/**
 * `rotas.md` §3 — `/checkout` carries a `<title>` and nothing else: no
 * description, no `og:image`, no structured data. It is `noindex, follow`, and a
 * description on a page nobody may index is metadata written for no reader.
 */
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: true },
};

/**
 * The route is a shell, and deliberately so: everything the checkout knows is
 * browser state — the cart it reads and the form it fills — so nothing about
 * this page can be resolved from the URL, and nothing on it is sent anywhere.
 *
 * What the server does contribute is the catálogo, projected to the eleven
 * fields `lib/carrinho/catalogo.ts` names, so the client can turn a slug into a
 * line without importing 118 KB of authored records to render three of them.
 *
 * It lands in the `(compra)` group, which closes on the **reduced** footer
 * (`rodape.md` §9) and carries the wordmark-only navbar (`checkout.md` §3).
 */
export default function Checkout() {
  return <PaginaDoCheckout catalogo={catalogoDoCarrinho()} />;
}
