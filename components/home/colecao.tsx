import Image from "next/image";
import Link from "next/link";
import { CTA_COLECAO, type ColecaoEmDestaque } from "@/lib/home/conteudo";

/**
 * §4 — the coleção surfaced *in context*, which is the obligation `rotas.md`
 * created when it refused a `/colecoes` index.
 *
 * A coleção is a merchandising device whose **order is the editorial act**, so
 * it gets editorial framing — the default pair, image on 7 and text on 5 — and
 * not a rail of cards.
 *
 * **No régua.** The count used to open this section as one, and a rule drawn
 * the full width of the container above a block with no object under it reads
 * as a divider, not as a measurement. The page's one régua is the cota on §1's
 * sofá; the count survives in the eyebrow, still derived from
 * `produtos.length`, so it cannot disagree with the listing it points at.
 *
 * **No prices in this block.** It sells the curated sequence; a price would
 * force choosing which piece, which is exactly the decision the coleção defers
 * to its listing.
 */
export function Colecao({ bloco }: { bloco: ColecaoEmDestaque }) {
  return (
    <section className="mx-auto w-full max-w-measure px-gutter">
      <div className="grid gap-y-rhythm-5 lg:grid-cols-12 lg:gap-x-gutter">
        <div className="lg:col-span-7">
          <Link href={bloco.href} className="block">
            <div className="relative aspect-[3/2] w-full bg-kozo">
              <Image
                src={bloco.imagem.src}
                alt={bloco.imagem.alt}
                fill
                sizes="(min-width: 64rem) 58vw, 100vw"
                className="object-cover"
              />
            </div>
          </Link>
        </div>

        <div className="max-w-aside lg:col-span-5">
          <p className="t-annotation text-muted">{bloco.eyebrow}</p>
          <h2 className="t-display-l mt-rhythm-3 text-ink">{bloco.nome}</h2>
          <p className="t-body mt-rhythm-3 text-ink">{bloco.descricao}</p>

          <Link
            href={bloco.href}
            className="t-cta mt-rhythm-5 inline-block border border-ink px-rhythm-4 py-rhythm-2 text-ink hover:bg-ink hover:text-plaster">
            {CTA_COLECAO}
          </Link>
        </div>
      </div>
    </section>
  );
}
