import type { Metadata } from "next";
import { Rodape } from "@/components/chrome/rodape";

/**
 * The one not-found surface — `erros.md` §2.3: every `404` in the route table
 * lands here, and there is no second one.
 *
 * It exists **now** because of §2.4's contract rather than because this issue
 * owns the surface. Reading the query (`catalogo.md` §3) renders the listing
 * routes per request, which is what took the room × tipo `404` out of Next's
 * prerendered not-found and into a rendered one; `middleware.ts` puts it back
 * at the routing layer, and this file is the page that layer serves.
 *
 * It sits outside both route groups, so it states its own `<main>` and its own
 * footer rather than inheriting one — `app/layout.tsx` gives a route outside
 * the groups neither, deliberately. The footer is not optional here:
 * `rodape.md` §6 makes the razão social, the CNPJ and the arrependimento notice
 * non-negotiable on a public page, and §2.1 asks this surface for the full
 * chrome because a 404 has no funnel to protect — it *is* navigation.
 *
 * Copy is `erros.md` §2.1, verbatim. **The recovery block of §2.2 is not here
 * yet**: it offers `/produtos`, which is not a route until that work lands, and
 * the ambiente-matched variant needs a path this page cannot read. Both belong
 * to the error-surfaces issue. What this file fixes is the contract — `404`,
 * `noindex`, the title, and the store's own chrome around it.
 */
export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

export default function NaoEncontrada() {
  return (
    <>
      <main className="flex-1">
        <div className="mx-auto w-full max-w-measure px-gutter pt-rhythm-7 pb-rhythm-7">
          <h1 className="t-display-l max-w-aside text-ink">Não há nada neste endereço.</h1>
          <p className="t-body mt-rhythm-4 max-w-reading text-ink">
            O catálogo é enumerado: cada ambiente e cada tipo têm um endereço próprio. Este não é
            um deles.
          </p>
        </div>
      </main>
      <Rodape variante="completo" />
    </>
  );
}
