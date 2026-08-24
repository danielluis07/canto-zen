"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ARREPENDIMENTO_COMO,
  ARREPENDIMENTO_COMO_HREF,
  ARREPENDIMENTO_MEIO,
  ARREPENDIMENTO_MEIO_HREF,
  ARREPENDIMENTO_MEIO_LINK,
  CONFIRMACAO_ENTREGA,
  CONFIRMACAO_NUMERO,
  CONFIRMACAO_PAGAMENTO,
  CONFIRMACAO_PECAS,
  CONFIRMACAO_TITULO,
} from "@/lib/checkout/conteudo";
import { usePedido, type Pedido } from "@/lib/checkout/pedido";

/**
 * The order record — `checkout.md` §10.
 *
 * **The full record: number, lines, prazos, address, total as paid — not a
 * stub.** A confirmation that withheld the record to make room for the
 * disclosure would undercut the disclosure; §2 has already said the thing
 * plainly at full size, so this page's job is to be the competent artefact the
 * admission was made *about*.
 *
 * **A cold arrival redirects to `/`** (§11). There is no order to look up, and a
 * page that renders a fictional order to somebody who did not just place one is
 * the one genuinely misleading artefact this flow could produce. The record is
 * browser state and nothing persists it, so `null` **is** the cold arrival — the
 * redirect rule and the no-persistence rule are one rule rather than two that
 * have to agree.
 *
 * That also means the record never reaches the server: what `/pedido-confirmado`
 * serves is the page's authored copy, and what the reader chose is theirs alone.
 */
export function Registro() {
  const pedido = usePedido();
  const router = useRouter();

  useEffect(() => {
    if (!pedido) router.replace("/");
  }, [pedido, router]);

  if (!pedido) return null;
  return <Conteudo pedido={pedido} />;
}

/** Pure over the `Pedido` it is handed, so every branch renders in a test. */
export function Conteudo({ pedido }: { pedido: Pedido }) {
  const { pagamento, entrega } = pedido;

  return (
    <>
      {/* §10 — the page's **single** Mincho line. */}
      <h1 className="t-display-l text-ink">{CONFIRMACAO_TITULO}</h1>

      {/* The número do pedido is honest in its own form: annotation voice,
          `--muted`, and the constant `0000`. The alternative tested — an em dash
          where a number belongs — is indistinguishable from a rendering bug,
          which is precisely the failure the ticket ruled out (§13, B). */}
      <p className="t-annotation mt-rhythm-3 text-muted">{CONFIRMACAO_NUMERO}</p>

      <section aria-label={CONFIRMACAO_PECAS} className="mt-rhythm-6">
        <h2 className="t-annotation text-muted">{CONFIRMACAO_PECAS}</h2>

        <ul className="mt-rhythm-3">
          {pedido.linhas.map((linha) => (
            <li key={linha.slug} className="flex gap-rhythm-4 border-t border-hairline py-rhythm-4">
              <span className="relative h-16 w-16 shrink-0 bg-kozo">
                <Image
                  src={linha.imagem.src}
                  alt={linha.imagem.alt}
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </span>

              <span className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-rhythm-4 gap-y-rhythm-2">
                <span className="min-w-0">
                  <Link href={linha.href} className="t-body text-ink hover:text-indigo">
                    {linha.nome}
                  </Link>
                  <span className="t-annotation mt-rhythm-1 block text-muted">
                    {linha.acabamento}
                    {linha.quantidade && <span className="ml-rhythm-2">{linha.quantidade}</span>}
                  </span>
                  {/* Per-line prazo annotations carry over from `carrinho.md`
                      §4.4 unchanged. There are no delivery groups here either,
                      for the same reason. */}
                  <span className="t-annotation mt-rhythm-1 block text-muted">
                    {linha.disponibilidade}
                  </span>
                  {linha.montagem && (
                    <span className="t-body-s mt-rhythm-2 block text-muted">{linha.montagem}</span>
                  )}
                </span>

                <span className="t-body shrink-0 text-ink">{linha.preco}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label={CONFIRMACAO_ENTREGA} className="mt-rhythm-6">
        <h2 className="t-annotation text-muted">{CONFIRMACAO_ENTREGA}</h2>
        <p className="t-body mt-rhythm-3 text-ink">{entrega.nome}</p>
        <p className="t-body-s mt-rhythm-1 text-ink">{entrega.endereco}</p>
        <p className="t-annotation mt-rhythm-2 text-muted">{entrega.modalidade}</p>
      </section>

      <section aria-label={CONFIRMACAO_PAGAMENTO} className="mt-rhythm-6 max-w-aside">
        <h2 className="t-annotation text-muted">{CONFIRMACAO_PAGAMENTO}</h2>

        <div className="mt-rhythm-3 flex items-baseline justify-between gap-rhythm-3">
          <p className="t-body-s text-muted">{pagamento.subtotalRotulo}</p>
          <p className="t-body-s text-ink">{pagamento.subtotal}</p>
        </div>

        <div className="mt-rhythm-2 flex items-baseline justify-between gap-rhythm-3">
          <p className="t-body-s text-muted">{pagamento.freteRotulo}</p>
          <p className="t-body-s text-ink">{pagamento.frete}</p>
        </div>

        <hr className="mt-rhythm-3" />

        <div className="mt-rhythm-3 flex items-baseline justify-between gap-rhythm-3">
          <p className="t-body text-ink">{pagamento.totalRotulo}</p>
          <p className="t-price text-ink">{pagamento.total}</p>
        </div>

        <p className="mt-rhythm-2 flex flex-wrap items-baseline gap-x-rhythm-3 gap-y-rhythm-1">
          <span className="t-body-s text-ink">{pagamento.tier}</span>
          {/* The page's one índigo, and the disclosure Lei 13.455 art. 5º-A
              requires em local e formato visíveis. */}
          {pagamento.badge && <span className="t-annotation text-indigo">{pagamento.badge}</span>}
          {pagamento.de && <span className="t-body-s text-muted">— {pagamento.de}</span>}
        </p>

        {/* §7.1's promise, kept honestly — **no QR code**, no copia-e-cola, no
            receipt and no confirmation e-mail. One line states what will not
            happen, where a fabricated artefact would otherwise stand. */}
        <p className="t-annotation mt-rhythm-3 text-muted">{pagamento.nota}</p>
      </section>

      {/* §10 — the arrependimento sentence repeats, and **here, and only here,
          it carries the means**: this is the surface a buyer returns to when
          they decide to withdraw, and Decreto 7.962 art. 5º's duty is to inform
          the *means*, not only the window. The cart keeps the bare sentence —
          nothing has been bought there yet. */}
      <p className="t-body-s mt-rhythm-6 max-w-reading text-muted">
        {pedido.arrependimento} {ARREPENDIMENTO_MEIO}{" "}
        <Link
          href={ARREPENDIMENTO_MEIO_HREF}
          className="underline decoration-hairline underline-offset-4 hover:text-indigo">
          {ARREPENDIMENTO_MEIO_LINK}
        </Link>
        .{" "}
        <Link
          href={ARREPENDIMENTO_COMO_HREF}
          className="underline decoration-hairline underline-offset-4 hover:text-indigo">
          {ARREPENDIMENTO_COMO}
        </Link>
      </p>
    </>
  );
}
