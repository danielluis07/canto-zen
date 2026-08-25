import Image from "next/image";
import Link from "next/link";
import type { Figura } from "@/lib/catalogo";
import { CTA_MARCENARIA } from "@/lib/home/conteudo";

/**
 * §7 — the page's closing, and the claim that justifies the prices §3 showed.
 *
 * `navbar.md` §5 took *Sobre* out of the bar and sent it to "footer and home",
 * but the block exists for a stronger reason: the atelier claim — in-house
 * marcenaria, made-to-order production, a named designer — is what makes the
 * prices legible. Stating it only as a footer link would make the whole
 * position decorative.
 *
 * The Mincho line spans columns 1–9 at Display L — an **editorial title**, which
 * is the role it always rendered in. It is no longer described as the page's one
 * feature line: `marca.md` §4 grants that once per page and §0.5's `h1` spends
 * it, so the two claims could not both stand. Below the line, the default pair:
 * image on 7, text on 5.
 *
 * The photograph is an unfinished piece, **alone** — no person, no hands, no
 * staged workbench — so `marca.md` §7's rule holds and no second exception to
 * "the piece alone" is opened beyond Inspirações.
 *
 * **It is contained, not covered, and that is not an inconsistency with §2 and
 * §4.** `imagens.md` §0 files this slot under *retrato* — the piece alone — and
 * §1.1 keeps the cast shadow inside the frame; §4 then forbids cropping a
 * photograph to fit a container outright. `object-cover` here would crop the one
 * genre the rule exists for, so the kozo field showing through is the correct
 * failure mode, not a defect: the slot's contract is `3:2` (§0) and a conforming
 * asset fills the box exactly. Today's is a phase-1 Unsplash hotlink at whatever
 * ratio it was uploaded in (§10.1, ADR 0003), and the bars are that schedule
 * showing, which the phase-2 pass closes. Ambientes and Coleção cover because
 * their fields have no shadow to cut and, in §2's three shorter bands, no fixed
 * ratio to contain against at all.
 *
 * **No Contato here** (§7) and no closing CTA: the scroll ends on an assertion,
 * not on a repeat of the ambientes.
 */
export function Marcenaria({
  bloco,
}: {
  bloco: { linha: string; texto: string; imagem: Figura };
}) {
  return (
    <section className="mx-auto w-full max-w-measure px-gutter">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-gutter">
        <h2 className="t-display-l text-ink lg:col-span-9">{bloco.linha}</h2>
      </div>

      <div className="mt-rhythm-5 grid gap-y-rhythm-5 lg:grid-cols-12 lg:gap-x-gutter">
        <div className="lg:col-span-7">
          <div className="relative aspect-[3/2] w-full bg-kozo">
            <Image
              src={bloco.imagem.src}
              alt={bloco.imagem.alt}
              fill
              sizes="(min-width: 64rem) 58vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>

        <div className="max-w-aside lg:col-span-5">
          <p className="t-body text-ink">{bloco.texto}</p>

          <Link
            href="/sobre"
            className="t-cta mt-rhythm-5 inline-block border border-ink px-rhythm-4 py-rhythm-2 text-ink hover:bg-ink hover:text-plaster">
            {CTA_MARCENARIA}
          </Link>
        </div>
      </div>
    </section>
  );
}
