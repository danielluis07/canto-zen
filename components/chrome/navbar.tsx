import Link from "next/link";
import { itensDeNavegacao, painelDoAmbiente, type PainelAmbiente } from "@/lib/chrome/navegacao";
import { CarrinhoLink } from "./carrinho-link";
import { MenuMobile } from "./menu-mobile";
import { NavegacaoAmbientes } from "./navegacao-ambientes";

/**
 * A single static line — `navbar.md` §3. It does not rotate, it is not
 * dismissible, and it carries no countdown, no percentage and no imperative
 * verb: reassurance, never promotion.
 */
const AVISO = "FRETE CALCULADO POR CEP · ATÉ 10X SEM JUROS · PEÇAS SOB ENCOMENDA";

/**
 * The bar keeps the four ambientes one gesture away from anywhere in the store,
 * and does nothing else: no search, no icons, no mini-cart, no wishlist, no
 * language switcher, no phone number (`navbar.md` §1).
 *
 * Two stacked bands, and only the second sticks. The `<header>` itself is the
 * sticky element, offset upwards by exactly the notice band's height, so the
 * band scrolls away while the bar arrives at the top at the same 72px it always
 * had — no shrinking, no shadow, no background swap (§8).
 *
 * The taxonomy is authored and renders on the server; only the cart count is
 * client state (§13).
 */
export function Navbar() {
  const paineis: Record<string, PainelAmbiente> = Object.fromEntries(
    itensDeNavegacao
      .filter((item) => item.abrePainel)
      .map((item) => [item.slug, painelDoAmbiente(item.slug)]),
  );

  return (
    <header className="sticky top-[calc(-1*var(--altura-aviso))] z-50 bg-plaster">
      <div className="border-b border-hairline bg-kozo">
        <div className="mx-auto w-full max-w-measure px-gutter py-[0.625rem]">
          <p className="t-annotation text-muted">{AVISO}</p>
        </div>
      </div>

      <div className="border-b border-hairline bg-plaster">
        <div className="mx-auto flex h-[var(--altura-navbar)] w-full max-w-measure items-center px-gutter">
          {/*
            The one exception to `marca.md` §4's "never for interface": with zero
            icons in the bar, an annotation-voice wordmark would be
            typographically identical to the label beside it (`navbar.md` §4).
          */}
          <Link href="/" className="t-display-m text-ink">
            Canto Zen
          </Link>

          <NavegacaoAmbientes itens={itensDeNavegacao} paineis={paineis} />

          {/* The right gutter is left empty on purpose — the cart is pushed to
              the edge of the container, and nothing follows it. */}
          <div className="ml-auto flex items-center gap-[2rem]">
            <CarrinhoLink />
            <MenuMobile itens={itensDeNavegacao} paineis={paineis} />
          </div>
        </div>
      </div>
    </header>
  );
}
