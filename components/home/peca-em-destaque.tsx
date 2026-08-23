import Image from "next/image";
import Link from "next/link";
import { CLASSE_DA_PROPORCAO } from "@/components/marca/proporcao";
import { Regua } from "@/components/marca/regua";
import { CTA_DESTAQUE, EYEBROW_DESTAQUE, type DestaqueDaHome } from "@/lib/home/conteudo";

/**
 * §1 — the home opens with reverence for an object, not with a taxonomy.
 *
 * It establishes the régua, the photography rule and the fact that this store
 * **shows price**, all three at once — the things every other page will assume
 * have already been said. Opening on the four ambientes instead would spend
 * four photographs before earning any attention, and would open with exactly
 * the wall-of-categories register the brand refuses.
 *
 * The image is capped at `78vh` so §2's top hairline sits above the fold: the
 * ambientes have to read as the natural next step rather than as an opening
 * demand. Both the photograph and the CTA go to the piece's PDP — sending the
 * click to a listing would contradict the section's whole argument, and
 * ambientes are §2's job, 400px below.
 *
 * One cota, `largura`, horizontal. The vertical one is suppressed even where
 * the piece declares it: it would live outside the image on the right, which is
 * where the text column begins.
 */
export function PecaEmDestaque({ destaque }: { destaque: DestaqueDaHome }) {
  return (
    <section className="mx-auto w-full max-w-measure px-gutter">
      <div className="grid gap-y-rhythm-5 lg:grid-cols-12 lg:gap-x-gutter">
        <figure className="lg:col-span-7">
          {/* The photograph does not respond to a pointer: `marca.md` §9 grants
              two motions and neither of them touches an image. */}
          <Link href={destaque.href} className="block">
            <div
              className={`relative max-h-[78vh] w-full bg-kozo ${CLASSE_DA_PROPORCAO[destaque.proporcao]}`}>
              <Image
                src={destaque.imagem.src}
                alt={destaque.imagem.alt}
                fill
                priority
                sizes="(min-width: 64rem) 58vw, 100vw"
                className="object-contain"
              />
            </div>
          </Link>

          <figcaption className="mt-rhythm-3">
            <Regua rotulo={destaque.cota} />
          </figcaption>
        </figure>

        <div className="max-w-aside lg:col-span-5">
          {/* No slogan, no "bem-vindo", no category promise. The only prose on
              the section is the piece's own name. */}
          <p className="t-annotation text-muted">{EYEBROW_DESTAQUE}</p>

          <h1 className="t-display-xl mt-rhythm-3 text-ink">{destaque.nome}</h1>

          {/* The designer is read through the família — `dados.md` §6.1's
              correction. Authorship does not change with the finish. */}
          <p className="t-annotation mt-rhythm-3 text-muted">{destaque.assinatura}</p>

          <div className="mt-rhythm-5 flex flex-wrap items-baseline gap-x-rhythm-3 gap-y-rhythm-1">
            <p className="t-price text-ink">{destaque.preco}</p>
            {/* The first of the page's two índigos, and the disclosure Lei
                13.455 requires for the differentiated price to be lawful. */}
            <p className="t-annotation text-indigo">{destaque.pix}</p>
          </div>

          {destaque.parcelamento && (
            <p className="t-body-s mt-rhythm-2 text-muted">{destaque.parcelamento}</p>
          )}

          <Link
            href={destaque.href}
            className="t-cta mt-rhythm-5 inline-block border border-ink px-rhythm-4 py-rhythm-2 text-ink hover:bg-ink hover:text-plaster">
            {CTA_DESTAQUE}
          </Link>
        </div>
      </div>
    </section>
  );
}
