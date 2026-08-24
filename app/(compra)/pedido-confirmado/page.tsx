import type { Metadata } from "next";
import Link from "next/link";
import {
  CONFIRMACAO_DISCLOSURE,
  CONFIRMACAO_SAIDA,
  CONFIRMACAO_SAIDA_HREF,
} from "@/lib/checkout/conteudo";
import { Registro } from "@/components/pedido/registro";

/**
 * `rotas.md` §3 — a `<title>` and nothing else, `noindex, follow`.
 */
export const metadata: Metadata = {
  title: "Pedido",
  robots: { index: false, follow: true },
};

/**
 * `/pedido-confirmado` — `checkout.md` §§10, 11.
 *
 * The page is split down the line the flow's own constraint draws. **The record
 * is the reader's** — it lives in this browser, never reaches the server, and
 * `Registro` sends a cold arrival to `/` rather than rendering a fictional order
 * to somebody who did not just place one (§11). **The statement and the way out
 * are the store's** — authored copy, true of every visitor, so they are rendered
 * here on the server and are in the document a reader is served.
 *
 * That split is why a cold arrival's served HTML is one true sentence and one
 * link, and never an order. It is also what makes the claim assertable at seam
 * 2: `build-spec.md` lists the confirmation's *nothing was charged* statement
 * among the copy where a paraphrase is a defect, and a string that only ever
 * exists after hydration cannot be asserted against what Next returns.
 *
 * The reduced footer stays, not the full one (§10): zone D's identification duty
 * does not stop at the confirmation.
 */
export default function PedidoConfirmado() {
  return (
    <div className="mx-auto w-full max-w-measure px-gutter pt-rhythm-5 pb-rhythm-7">
      <div className="max-w-reading">
        <Registro />

        <p className="t-body mt-rhythm-6 text-ink">{CONFIRMACAO_DISCLOSURE}</p>

        {/* One way out, the pattern `catalogo.md` §8 and `carrinho.md` §7 set. */}
        <Link
          href={CONFIRMACAO_SAIDA_HREF}
          className="t-cta mt-rhythm-5 inline-block border border-ink px-rhythm-5 py-rhythm-3 text-ink hover:bg-ink hover:text-plaster">
          {CONFIRMACAO_SAIDA}
        </Link>
      </div>
    </div>
  );
}
