import Image from "next/image";
import Link from "next/link";
import {
  CTA_INSPIRACOES,
  EYEBROW_INSPIRACOES,
  type LinhaDeInspiracao,
} from "@/lib/home/conteudo";

/**
 * §6 — the editorial lane's entrance. Inspirações is one of only five navbar
 * items; leaving it off the home would leave that promise unsupported at the
 * top of the funnel.
 *
 * **Three rows, not three cards.** A strip of cards would repeat §3's rhythm
 * `7rem` away and two large articles would compete with §4, leaving the page
 * with two image-7/text-5 pairs in a row. Horizontal rows separated by
 * hairlines are a third rhythm and keep §4 as the page's only editorial
 * feature.
 *
 * Thumbnail on columns 1–2, title on 3–7, summary on 8–10, 11–12 empty. The
 * whole row is one link; the thumbnail is the article's own `16:9` generation
 * and not a crop of one of its photographs. No régua and no price — Inspirações
 * asserts neither, and that absence is authored.
 */
export function Inspiracoes({ linhas }: { linhas: LinhaDeInspiracao[] }) {
  return (
    <section className="mx-auto w-full max-w-measure px-gutter">
      <h2 className="t-annotation text-muted">{EYEBROW_INSPIRACOES}</h2>

      <div className="mt-rhythm-5 border-t border-hairline">
        {linhas.map((linha) => (
          <Link
            key={linha.slug}
            href={linha.href}
            className="grid gap-y-rhythm-3 border-b border-hairline py-rhythm-4 lg:grid-cols-12 lg:gap-x-gutter">
            <div className="relative aspect-video w-full bg-kozo lg:col-span-2">
              <Image
                src={linha.thumb.src}
                alt={linha.thumb.alt}
                fill
                sizes="(min-width: 64rem) 17vw, 100vw"
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-5">
              {/* `Artigo.ambiente` came back required, so every row carries its
                  annotation — there is no room-less article to fall back for. */}
              <p className="t-annotation text-muted">{linha.ambiente}</p>
              <h3 className="t-display-m mt-rhythm-1 text-ink">{linha.titulo}</h3>
            </div>

            <p className="t-body-s text-muted lg:col-span-3">{linha.resumo}</p>
          </Link>
        ))}
      </div>

      {/* Three of four rows above; this leads to the one the home held back. */}
      <Link href="/inspiracoes" className="t-cta mt-rhythm-4 inline-block text-ink hover:text-muted">
        {`${CTA_INSPIRACOES} →`}
      </Link>
    </section>
  );
}
