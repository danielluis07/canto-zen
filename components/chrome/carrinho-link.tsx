"use client";

// The bar's only commercial affordance — `navbar.md` §7.
//
// It is a **link**, in every scenario: it goes to `/carrinho`, it opens no
// drawer and no preview, and the constraint that ticket handed the cart surface
// is that adding to the cart may open one, this link may not. The count comes
// from the one `Carrinho` the cart page reads, so the two cannot disagree, and
// it vanishes entirely at zero rather than claiming `(0)`.

import Link from "next/link";
import { quantidadeTotal, useCarrinho } from "@/lib/carrinho/estado";
import { rotuloDaContagem } from "@/lib/chrome/navegacao";

export function CarrinhoLink() {
  const contagem = rotuloDaContagem(quantidadeTotal(useCarrinho()));

  return (
    <Link href="/carrinho" className="t-annotation text-ink hover:text-indigo">
      CARRINHO
      {contagem ? <span className="ml-[0.375rem] tabular-nums">{contagem}</span> : null}
    </Link>
  );
}
