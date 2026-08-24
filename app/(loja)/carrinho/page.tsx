import type { Metadata } from "next";
import { catalogoDoCarrinho } from "@/lib/carrinho/catalogo";
import { PaginaDoCarrinho } from "@/components/carrinho/pagina";

/**
 * `rotas.md` §3 — `/carrinho` carries a `<title>` and nothing else: no
 * description, no `og:image`, no structured data. It is `noindex, follow`, and a
 * description on a page nobody may index is metadata written for no reader.
 */
export const metadata: Metadata = {
  title: "Carrinho",
  robots: { index: false, follow: true },
};

/**
 * The route is a shell, and deliberately so: the cart's contents are browser
 * state, so nothing about this page can be resolved from the URL.
 *
 * What the server does contribute is the catálogo — projected to the eleven
 * fields `lib/carrinho/catalogo.ts` names, so the client can turn a slug into a
 * line without importing 118 KB of authored records to render three of them.
 * It lands in the `(loja)` group, which closes on the **full** footer: leaving
 * the cart for an ambiente is a legitimate path and the cart is still navigation
 * (`carrinho.md` §1, `rodape.md` §9). The reduced footer belongs to `/checkout`.
 */
export default function Carrinho() {
  return <PaginaDoCarrinho catalogo={catalogoDoCarrinho()} />;
}
