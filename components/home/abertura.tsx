import Image from "next/image";
import Link from "next/link";
import { CTA_ABERTURA, IMAGEM_ABERTURA, LINHA_ABERTURA } from "@/lib/home/conteudo";

/**
 * §0.5 — the store opens on a room.
 *
 * The home used to open on §1, a single piece with its price and its régua. That
 * section still exists and still does that job; it simply is not first any more.
 * The argument for the change is structural, not aesthetic (`imagens.md` §10.2
 * forbids the aesthetic one outright): a visitor arriving cold meets a *store*
 * before meeting a *piece*, and the register a room establishes — this is what
 * the furniture is for — is the one thing §1 could never state, because §1 is
 * one object against plaster and says nothing about a home.
 *
 * **`21:9`, contained, never cropped.** The ratio is reserved to this slot alone
 * (`imagens.md` §2) and the box declares it before anything loads, so layout
 * shift is zero and the photograph ships in the frame it was composed in. It is
 * the only local image in the store — every other `src` is still a phase-1
 * Unsplash URL (§10.1) — which is what phase 2 will do to all of them.
 *
 * **The text sits on the left third and only there.** That region of the
 * photograph is flat cream stone at roughly `#EDE6DC`, so `--ink` clears
 * `acessibilidade.md`'s 4.5:1 floor against it by a wide margin with no scrim,
 * no gradient and no overlay — none of which are available anyway: `marca.md`
 * §6 permits no shadow and the token set has no scrim. If the photograph is ever
 * replaced, the replacement has to hold that same flat light region, and that is
 * a constraint on the image, not a licence to add a scrim.
 *
 * **The image is not a link.** A 21:9 click target with no visible affordance is
 * a trap, and §1 already established that a photograph here is an object rather
 * than a button. The CTA is the affordance, and it is a real bordered control.
 *
 * No price, no régua, no eyebrow. The régua budget is two per page
 * (`marca.md` §2) and both are already spent below; a third here would make the
 * gesture wallpaper on the one page that teaches what it means.
 */
export function Abertura() {
  return (
    <section className="relative mx-auto w-full max-w-measure px-gutter">
      <div className="relative aspect-21/9 w-full bg-kozo">
        <Image
          src={IMAGEM_ABERTURA.src}
          alt={IMAGEM_ABERTURA.alt}
          fill
          priority
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {/*
        The text column is the left third and stops there: `max-w-aside` is the
        same 34ch measure §1's block uses, so the two sections speak at the same
        width even though one sits on paper and the other on a photograph.

        It is a **sibling** of the ratio box, not a child, so that the mobile
        arrangement is the plain one: at `lg` it is lifted onto the photograph,
        and below `lg` it simply follows in normal flow. A 21:9 band at 360px
        wide is 154px tall — too short to hold a Display XL line — and dropping
        the block below the image is also the only arrangement where the
        contrast argument above does not have to hold at every viewport.
      */}
      <div className="mt-rhythm-4 lg:absolute lg:inset-y-0 lg:left-gutter lg:mt-0 lg:flex lg:items-center">
        <div className="max-w-aside lg:pl-[6%]">
          <h1 className="t-display-xl text-ink">{LINHA_ABERTURA}</h1>

          <Link
            href="/produtos"
            className="t-cta mt-rhythm-4 inline-block border border-ink px-rhythm-4 py-rhythm-2 text-ink hover:bg-ink hover:text-plaster">
            {CTA_ABERTURA}
          </Link>
        </div>
      </div>
    </section>
  );
}
