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
 * photograph is a flat travertine wall, and `hero.webp` was sampled rather than
 * described: across the block's own footprint — the left `30%` of the frame,
 * vertically centred — it runs `#D0CCC7` to `#E1DDD8` with a mean of `#D8D4D1`,
 * against which `--ink` measures **10.4:1 at the worst pixel and ~11:1 at the
 * mean**. It clears `acessibilidade.md`'s 4.5:1 floor several times over with no
 * scrim, no gradient and no overlay — none of which are available anyway:
 * `marca.md` §6 permits no shadow and the token set has no scrim.
 *
 * The file was previously documented as "roughly `#EDE6DC`", a value it does not
 * contain anywhere; the no-scrim call was right and its stated evidence was not.
 * The `30%` in the layout below is the same measurement: past roughly a third of
 * the frame the plant and the woven chair arrive and the worst pixel falls to
 * 1:1, so the block's width is a fact about this photograph. If it is ever
 * replaced, the replacement has to hold the same flat light region at the same
 * width — a constraint on the image, not a licence to add a scrim.
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
        The text column is the left third and stops there — and it is the page's
        own 12-column grid that says so, four columns of it, which resolves to
        `30%` of the container at every viewport from `lg` up.

        It used to be `max-w-aside`, and that was the wrong measure twice over.
        `34ch` resolves against the *element's* font, and the element is a
        Grotesk-inheriting `div`, so the box came out around `272px` — while the
        line inside it renders in Mincho at up to `52px`, five or six characters
        wide. A `ch` cap is a reading measure for body text; a display line is
        measured in columns. Four of them is also the widest the photograph
        allows (see the contrast note above), so the grid and the image agree on
        the same number.

        The `6%` left inset went with it. Every other section on this page starts
        its text at the container's left edge, and the Abertura had no reason of
        its own to sit inboard of the grid — the wall runs to the frame's edge.

        The block is a **sibling** of the ratio box, not a child, so that the
        mobile arrangement is the plain one: at `lg` it is lifted onto the
        photograph, and below `lg` it simply follows in normal flow at the full
        content width. A 21:9 band at 360px wide is 154px tall — too short to
        hold a Display XL line — and dropping the block below the image is also
        the only arrangement where the contrast argument above does not have to
        hold at every viewport.
      */}
      <div className="mt-rhythm-4 lg:absolute lg:inset-y-0 lg:left-gutter lg:right-gutter lg:mt-0 lg:grid lg:grid-cols-12 lg:items-center lg:gap-x-gutter">
        <div className="lg:col-span-4">
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
