import Image from "next/image";
import Link from "next/link";
import { CLASSE_DA_PROPORCAO } from "@/components/marca/proporcao";
import {
  EYEBROW_DESTAQUES,
  linhaDePixDaHome,
  type CartaoEmDestaque,
} from "@/lib/home/conteudo";

/**
 * §3 — proof that the prices exist and that they are honest.
 *
 * **Three pieces, not six.** Six is a grid and pulls the page towards the
 * catalogue density `marca.md` §5 rations; the cards take columns 1–3, 4–6 and
 * 7–9 with **10–12 left empty**, the large right gutter kept as in every
 * default pair.
 *
 * Two rations are spent here. The **Price role stays with the hero and the
 * PDP** — at the width of a 3-column card it dominates the composition and
 * turns the strip into a shop window, so the figure is set in Body with tabular
 * numerals. And the **Pix badge does not render per card**: three badged cards
 * would be three índigos on one screen, so the policy is stated once, on the
 * hairline that closes the strip.
 *
 * No régua on these cards (§9), and no hover on the photographs. The width is
 * stated anyway, in the annotation voice — a régua is not the only way to give
 * a number, and three featured pieces with no dimension at all was the page
 * teaching what measurement is for and then withholding it.
 */
export function FaixaDeDestaques({ cartoes }: { cartoes: CartaoEmDestaque[] }) {
  return (
    <section className="mx-auto w-full max-w-measure px-gutter">
      <h2 className="t-annotation text-muted">{EYEBROW_DESTAQUES}</h2>

      <div className="mt-rhythm-5 grid gap-y-rhythm-6 lg:grid-cols-12 lg:gap-x-gutter">
        {cartoes.map((cartao) => (
          <Link key={cartao.slug} href={cartao.href} className="block lg:col-span-3">
            <div
              className={`relative w-full bg-kozo ${CLASSE_DA_PROPORCAO[cartao.proporcao]}`}>
              <Image
                src={cartao.imagem.src}
                alt={cartao.imagem.alt}
                fill
                sizes="(min-width: 64rem) 25vw, 100vw"
                className="object-contain"
              />
            </div>

            <h3 className="t-display-m mt-rhythm-3 text-ink">{cartao.nome}</h3>
            {/* Acabamento and width on one line, as the listing card sets
                them: the width is read from `medidas.largura` and is the
                promise `produto.md` made when it kept cm out of `nome`. */}
            <p className="t-annotation mt-rhythm-1 text-muted">
              {cartao.acabamento} · {cartao.largura}
            </p>
            {/* Three states and never a count, and no state colour: the
                distinction that matters is in the text. */}
            <p className="t-annotation mt-rhythm-1 text-muted">{cartao.disponibilidade}</p>

            <p className="t-body mt-rhythm-3 tabular-nums text-ink">{cartao.preco}</p>
            {cartao.parcelamento && (
              <p className="t-body-s mt-rhythm-1 text-muted">{cartao.parcelamento}</p>
            )}
          </Link>
        ))}
      </div>

      <div className="mt-rhythm-6 border-t border-hairline pt-rhythm-3">
        <p className="t-annotation text-indigo lg:text-right">{linhaDePixDaHome()}</p>
      </div>
    </section>
  );
}
