import Link from "next/link";
import type { Recuperacao } from "@/lib/erros/conteudo";

/**
 * `erros.md` §2.2 — the way out of a dead end.
 *
 * There is no search anywhere in the store (`navbar.md` §12), so the offer is a
 * list: an annotation-voice heading over plain links, separated by the same
 * middle dot the rest of the store uses for a run of related labels, and one
 * CTA-voice link beneath. No buttons — the primary button of `marca.md` §6 is
 * spent on `TENTAR NOVAMENTE` and on checkout, and a 404 has nothing to
 * transact.
 */
export function BlocoDeRecuperacao({ recuperacao }: { recuperacao: Recuperacao }) {
  return (
    <div className="mt-rhythm-6">
      <p className="t-annotation text-muted">{recuperacao.titulo}</p>

      <p className="t-body mt-rhythm-3 max-w-reading text-ink">
        {recuperacao.ofertas.map((oferta, indice) => (
          <span key={oferta.href}>
            {indice > 0 ? <span aria-hidden="true"> · </span> : null}
            <Link
              href={oferta.href}
              className="underline decoration-hairline underline-offset-4 hover:text-indigo">
              {oferta.label}
            </Link>
          </span>
        ))}
      </p>

      <Link
        href={recuperacao.saida.href}
        className="t-cta mt-rhythm-4 inline-block text-ink hover:text-indigo">
        {recuperacao.saida.label}
      </Link>
    </div>
  );
}
