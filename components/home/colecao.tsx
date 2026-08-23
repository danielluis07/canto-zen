import Image from "next/image";
import Link from "next/link";
import { Regua } from "@/components/marca/regua";
import { CTA_COLECAO, EYEBROW_COLECAO, type ColecaoEmDestaque } from "@/lib/home/conteudo";

/**
 * §4 — the coleção surfaced *in context*, which is the obligation `rotas.md`
 * created when it refused a `/colecoes` index.
 *
 * A coleção is a merchandising device whose **order is the editorial act**, so
 * it gets editorial framing — the default pair, image on 7 and text on 5 — and
 * not a rail of cards.
 *
 * The section-opening régua is the page's **second and last** (§9). Its label
 * counts the coleção rather than repeating an authored figure, so it cannot
 * disagree with the listing it points at.
 *
 * **No prices in this block.** It sells the curated sequence; a price would
 * force choosing which piece, which is exactly the decision the coleção defers
 * to its listing.
 */
export function Colecao({ bloco }: { bloco: ColecaoEmDestaque }) {
  return (
    <section className="mx-auto w-full max-w-measure px-gutter">
      {bloco.regua && <Regua rotulo={bloco.regua} />}

      <div className="mt-rhythm-5 grid gap-y-rhythm-5 lg:grid-cols-12 lg:gap-x-gutter">
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
          <p className="t-annotation text-muted">{EYEBROW_COLECAO}</p>
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
