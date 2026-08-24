import type { Metadata } from "next";
import "./globals.css";
import { schibstedGrotesk, zenOldMincho } from "@/fonts";
import { Navbar } from "@/components/chrome/navbar";

/**
 * The suffix `rotas.md` §1 puts on every route but the home, where appending
 * the brand to the brand stutters. A page states its own name and nothing else;
 * the template is the only place the wordmark is spelled into a `<title>`.
 */
export const metadata: Metadata = {
  title: { default: "Canto Zen", template: "%s | Canto Zen" },
};

/**
 * The chrome every route wears. The navbar is here because it is on every route
 * at the same 72px; the footer is not, because `/checkout` takes the reduced
 * variant — so each route group states which one it closes on
 * (`app/(loja)/layout.tsx`, `app/(compra)/layout.tsx`). A route created outside
 * both groups gets neither `<main>` nor a footer, which is the loud failure the
 * split is worth.
 *
 * There is no skip link, and that is a decision rather than an oversight:
 * `acessibilidade.md` §6 weighs seven stops before content against a permanent
 * visible affordance and records the omission, with the note that if the navbar
 * ever grows this is the first thing to revisit.
 *
 * There is **no cart provider** either. The cart is one store at module scope
 * (`lib/carrinho/estado.ts`), which is what lets the navbar counter here and the
 * `/carrinho` page below read the same state without a boundary wrapping both.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${zenOldMincho.variable} ${schibstedGrotesk.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
