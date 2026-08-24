import Image from "next/image";
import Link from "next/link";
import type { LinhaDoIndice } from "@/lib/inspiracoes/conteudo";

/**
 * §5.3 — the index's four rows: uniform, peers, hairline-separated, in a fixed
 * authored order that is not recency.
 *
 * This is `components/home/inspiracoes.tsx`'s row **at page scale**, and the
 * repetition is the point: the home's three rows read as a literal excerpt of
 * this index rather than as a second design of the same object. The only
 * differences are the wider thumbnail — five columns here against the home's
 * two — and Display L in place of Display M.
 *
 * A **card grid was refused** (§5.4): `catalogo.md` owns the card, and a grid of
 * article cards is precisely this surface reading as a commerce listing with
 * prose poured into it. A **lead article was refused** too (§5.5), because
 * promoting one is hierarchy by recency and `marca.md` §2 already removed
 * ordinal sequence from the storefront.
 *
 * The whole row is one `<a>`, so the accessible name is the annotation, the
 * título and the resumo in reading order. The thumbnail keeps its authored
 * `alt`: `imagens.md` §5.3 and `acessibilidade.md` §8 both state that no
 * decorative image exists in this store and `alt=""` never appears, which
 * settles the empty-`alt` line `inspiracoes.md` §9 wrote before either.
 *
 * Columns 11–12 are left empty per `marca.md` §5, and the thumbnail is
 * **contained** on its `--kozo` field at the `16:9` the thumb is generated at —
 * nothing in the store is cropped to fit a container (`imagens.md` §4).
 */
export function Linhas({ linhas }: { linhas: LinhaDoIndice[] }) {
  return (
    <div className="border-t border-hairline">
      {linhas.map((linha) => (
        <Link
          key={linha.slug}
          href={linha.href}
          className="grid gap-y-rhythm-3 border-b border-hairline py-rhythm-5 lg:grid-cols-12 lg:gap-x-gutter">
          <div className="relative aspect-video w-full bg-kozo lg:col-span-5">
            <Image
              src={linha.thumb.src}
              alt={linha.thumb.alt}
              fill
              sizes="(min-width: 64rem) 40vw, 100vw"
              className="object-contain"
            />
          </div>

          <div className="lg:col-span-5">
            {/* `Artigo.ambiente` is required and unique across the four, so
                every row carries its room and none is annotation-less. */}
            <p className="t-annotation text-muted">{linha.ambiente}</p>
            <h2 className="t-display-l mt-rhythm-2 text-ink">{linha.titulo}</h2>
            {/* One line, never wrapping to three — the resumo is authored at
                that length and the row does not clamp it. */}
            <p className="t-body-s mt-rhythm-3 text-muted">{linha.resumo}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
