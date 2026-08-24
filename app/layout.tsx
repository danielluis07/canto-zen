import type { Metadata } from "next";
import "./globals.css";
import { schibstedGrotesk, zenOldMincho } from "@/fonts";
import { ORIGEM } from "@/lib/metadados/conteudo";

/**
 * The suffix `rotas.md` §1 puts on every route but the home, where appending
 * the brand to the brand stutters. A page states its own name and nothing else;
 * the template is the only place the wordmark is spelled into a `<title>`.
 *
 * `metadataBase` is here and only here. §4 requires canonicals to be **absolute
 * URLs**, and Next resolves every relative `alternates.canonical` and every
 * `og:image` against this one origin — so a route states a path and the
 * document gets a URL, and there is no second place the domain is written down.
 *
 * **Nothing else is declared at the root.** An `openGraph` default here would
 * put an `og:title` and an `og:description` on `/carrinho`, `/checkout`,
 * `/pedido-confirmado` and the 404, and §3 gives those four a `<title>` and
 * nothing else. The share card is stated per route, by the routes that have one.
 */
export const metadata: Metadata = {
  metadataBase: ORIGEM,
  title: { default: "Canto Zen", template: "%s | Canto Zen" },
};

/**
 * The document, and only the document. **Neither the navbar nor the footer is
 * here**: `/checkout` takes the reduced variant of both — the wordmark-only bar
 * (`checkout.md` §3) and the reduced footer (`rodape.md` §9) — and a root layout
 * cannot know which route is beneath it. So each route group states the chrome
 * it wears (`app/(loja)/layout.tsx`, `app/(compra)/layout.tsx`), and a route
 * created outside both gets no chrome at all, which is the loud failure the
 * split is worth. `app/not-found.tsx` sits outside them and states its own.
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
