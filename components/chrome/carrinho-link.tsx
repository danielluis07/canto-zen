"use client";

// The bar's only commercial affordance — `navbar.md` §7.
//
// It is a **link**, in every scenario: it goes to `/carrinho`, it opens no
// drawer and no preview, and the constraint that ticket handed the cart surface
// is that adding to the cart may open one, this link may not. The count comes
// from the one `Carrinho` the cart page reads, so the two cannot disagree, and
// it vanishes entirely at zero rather than claiming `(0)`.
//
// **The glyph is the one icon in the storefront** — §7's amendment, and the
// reason `navbar.md` §1's blanket refusal of icons is now a refusal of *all but
// this one*. The word `CARRINHO` went with it: a bag beside a tabular count says
// the same thing in less, and the accessible name carries the word for anyone
// the glyph does not reach. `ShoppingBag` over `ShoppingCart` deliberately — a
// trolley is the supermarket register, and this store sells one sofa at a time.
//
// The count stays **text**, never a badge: §7's refusal of a circle survives the
// icon, because red is not in the palette and an índigo badge would spend the
// sole accent on a number.

import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { quantidadeTotal, useCarrinho } from "@/lib/carrinho/estado";
import { rotuloDaContagem } from "@/lib/chrome/navegacao";

export function CarrinhoLink() {
  const contagem = rotuloDaContagem(quantidadeTotal(useCarrinho()));

  return (
    <Link
      href="/carrinho"
      aria-label="Carrinho"
      className="t-annotation flex items-center gap-[0.375rem] text-ink hover:text-indigo">
      {/* `1.125rem` is the annotation voice's cap height at this size, so the
          glyph sits on the same optical line as the count beside it. The stroke
          is the hairline's width — the bar draws one weight of line, and an
          icon at 2px would be the heaviest mark in the chrome. */}
      <ShoppingBag aria-hidden="true" size={18} strokeWidth={1.25} />
      {contagem ? <span className="tabular-nums">{contagem}</span> : null}
    </Link>
  );
}
