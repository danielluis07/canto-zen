import type { MetadataRoute } from "next";
import { ORIGEM } from "@/lib/metadados/conteudo";

/**
 * `rotas.md` §4 — the disallow list is **exactly three paths and nothing else**.
 *
 * **Never a `?` wildcard.** `Disallow: /*?` would read as the obvious way to
 * keep filter permutations out of the index, and it would take `?pagina=` with
 * it: pages 2+ hold pieces that exist at no other indexable URL, so blocking
 * them hides part of the catalogue from itself. Filter state is handled where
 * it can be handled precisely — `noindex` plus a canonical to the clean path,
 * emitted per URL by `lib/metadados/conteudo.ts`.
 *
 * The three below are `noindex` in their own heads too. Both are wanted: robots
 * keeps a crawler out of a funnel it has no business walking, and the meta tag
 * is what removes a URL somebody linked to.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/carrinho", "/checkout", "/pedido-confirmado"],
    },
    sitemap: new URL("/sitemap.xml", ORIGEM).toString(),
  };
}
