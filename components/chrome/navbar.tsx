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
 * `reduzida` is `/checkout`'s bar — `checkout.md` §3 — and it is this same
 * component with zones withheld, the way `rodape.md` §9's reduced footer is that
 * same footer. Not a second navbar.
 */
export type VarianteNavbar = "completa" | "reduzida";

/**
 * The bar keeps the four ambientes one gesture away from anywhere in the store,
 * and does nothing else: no search, no mini-cart, no wishlist, no
 * language switcher, no phone number (`navbar.md` §1). The bar carries exactly
 * one glyph — the cart's — and §7 is where that single exception is written
 * down; §1's refusal of icons is otherwise intact.
 *
 * Two stacked bands, and only the second sticks. The `<header>` itself is the
 * sticky element, offset upwards by exactly the notice band's height, so the
 * band scrolls away while the bar arrives at the top at the same 72px it always
 * had — no shrinking, no shadow, no background swap (§8).
 *
 * The taxonomy is authored and renders on the server; only the cart count is
 * client state (§13).
 *
 * **`reduzida` is the wordmark and nothing else** — `checkout.md` §3, at the
 * same constant 72px on the same 1px `--hairline` rule:
 *
 * - **No room links, no Inspirações, no mega menu.** Advertising four exits
 *   mid-purchase is chrome working against the page it sits on. Leaving stays
 *   possible through the wordmark; it is simply not offered.
 * - **No `CARRINHO (n)`.** The resumo itemises the same cart half a screen away,
 *   so the counter is a second answer to a question already answered. This is
 *   the only surface where `navbar.md` §7's cart affordance is absent, and the
 *   reason is redundancy, not concealment.
 * - **No notice band.** `FRETE CALCULADO POR CEP · ATÉ 10X SEM JUROS` is
 *   reassurance for a reader deciding whether to buy, and this reader has
 *   decided; §3 describes the reduced bar as one band on one rule, and a
 *   promotional line above a payment form is the register §3 refuses.
 */
export function Navbar({ variante = "completa" }: { variante?: VarianteNavbar }) {
  if (variante === "reduzida") {
    return (
      <header className="sticky top-0 z-50 border-b border-hairline bg-plaster">
        <div className="mx-auto flex h-[var(--altura-navbar)] w-full max-w-measure items-center px-gutter">
          <Link href="/" className="t-display-m text-ink">
            Canto Zen
          </Link>
        </div>
      </header>
    );
  }

  return <Completa />;
}

function Completa() {
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
            The one exception to `marca.md` §4's "never for interface": an
            annotation-voice wordmark would be typographically identical to the
            label beside it (`navbar.md` §4).

            §4 used to argue this from "zero icons in the bar". The cart's glyph
            retired that clause without touching the conclusion — it sits at the
            far right, among no other type, and does nothing to distinguish the
            wordmark from the annotation labels it shares a line with. The
            exception rests on that adjacency, which is unchanged.
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
