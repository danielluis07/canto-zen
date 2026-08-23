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
 * The Mincho line spanning columns 1–9 is the **one feature line** `marca.md`
 * §4 grants a page, and the home spends it here (§11). Below it, the default
 * pair: image on 7, text on 5.
 *
 * The photograph is an unfinished piece, **alone** — no person, no hands, no
 * staged workbench — so `marca.md` §7's rule holds and no second exception to
 * "the piece alone" is opened beyond Inspirações.
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
