"use client";

import Link from "next/link";
import { useState } from "react";
import { adicionarAoCarrinho, useDefinirCarrinho } from "@/lib/carrinho/estado";
import type { PecaParaFrete } from "@/lib/produto/cep";
import { Cep } from "./cep";
import {
  CTA_ADICIONADO,
  CTA_COMPRAR,
  CTA_ESGOTADO,
  CTA_VER_CARRINHO,
  type BlocoDeMontagem,
} from "@/lib/produto/conteudo";

type Props = {
  slug: string;
  esgotado: boolean;
  /** What §2.7's quote reads: the box, the freteGratis scope, the prazo facts. */
  peca: PecaParaFrete;
  /** `null` for a piece whose família holds nothing available — §2.6. */
  irmao: { rotulo: string; href: string } | null;
  /** `null` for a piece that needs no assembly — §2.8. */
  montagem: BlocoDeMontagem | null;
};

/**
 * The two controls in the buy box — `pagina-produto.md` §§2.6, 2.8.
 *
 * They are one component because they are one decision: montagem travels as an
 * **attribute of the cart line** (`carrinho.md` §4.3), so the CTA has to read
 * the checkbox beside it. The CEP block §2.7 puts between them renders here for
 * the neighbouring reason: it is the third control of the same buy box, and it
 * has to sit below the CTA and above montagem, which is a position and not a
 * component boundary.
 *
 * **No quantity selector.** The decision this page asks for is *this piece or
 * not*; quantity belongs to the cart, which has to edit it anyway.
 *
 * **On click the page does not navigate.** The CTA is replaced in place by a
 * confirmation line and a link, and the navbar counter — reading the same
 * `Carrinho` — goes to `CARRINHO (n)`. A side drawer is unavailable by decision
 * of `navbar.md`, and navigating to `/carrinho` would end the browsing session
 * on exactly the page where *outros acabamentos* invites lateral movement.
 */
export function Compra({ slug, esgotado, peca, irmao, montagem }: Props) {
  const [contratarMontagem, definirMontagem] = useState(false);
  const [adicionado, definirAdicionado] = useState(false);
  const definirCarrinho = useDefinirCarrinho();

  const comprar = () => {
    definirCarrinho?.((carrinho) =>
      adicionarAoCarrinho(carrinho, { slug, montagem: contratarMontagem }),
    );
    definirAdicionado(true);
  };

  return (
    <>
      {/* The CEP block and the montagem block still render in `esgotado`: they
          are information about the piece, not about the order. The CTA does not
          — and there is no "avise-me quando chegar" behind it. */}
      {esgotado ? (
        <div className="mt-rhythm-5">
          <p className="t-annotation text-ink">{CTA_ESGOTADO}</p>
          {irmao && (
            <Link
              href={irmao.href}
              className="t-annotation mt-rhythm-2 inline-block text-muted hover:text-ink">
              {`${irmao.rotulo} →`}
            </Link>
          )}
        </div>
      ) : adicionado ? (
        <div
          role="status"
          className="mt-rhythm-5 flex flex-wrap items-baseline justify-between gap-x-rhythm-4 gap-y-rhythm-2 border border-transparent py-rhythm-3">
          <p className="t-annotation text-ink">{CTA_ADICIONADO}</p>
          <Link href="/carrinho" className="t-annotation text-muted hover:text-ink">
            {CTA_VER_CARRINHO}
          </Link>
        </div>
      ) : (
        <button
          type="button"
          onClick={comprar}
          className="t-cta mt-rhythm-5 w-full border border-ink py-rhythm-3 text-ink hover:bg-ink hover:text-plaster">
          {CTA_COMPRAR}
        </button>
      )}

      <Cep peca={peca} />

      {montagem && (
        <div className="mt-rhythm-5">
          <p className="t-annotation text-muted">MONTAGEM</p>

          <label className="mt-rhythm-3 flex items-center gap-rhythm-3 text-ink hover:text-muted">
            <input
              type="checkbox"
              checked={contratarMontagem}
              onChange={(evento) => definirMontagem(evento.target.checked)}
              className="h-[13px] w-[13px] shrink-0 appearance-none border border-muted checked:border-ink checked:bg-ink"
            />
            <span className="t-body-s">{montagem.rotulo}</span>
            <span className="t-body-s ml-auto tabular-nums">{montagem.preco}</span>
          </label>

          {/* The four facts stay here and only here — they exist to justify the
              price directly above them, which is why §2.8 derived that price
              from `nivel` in the first place. */}
          <p className="t-annotation mt-rhythm-3 text-muted">{montagem.fatos}</p>
          <p className="t-annotation mt-rhythm-1 text-muted">{montagem.nota}</p>
        </div>
      )}
    </>
  );
}
