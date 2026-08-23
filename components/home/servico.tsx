import Link from "next/link";
import { CAMPOS_DE_SERVICO } from "@/lib/home/conteudo";

/**
 * §5 — the band Brazilian commerce fills with badges and testimonials, filled
 * instead with the only thing this store has honestly available: service.
 * Someone buying a sofá costing thousands of reais decides about delivery and
 * montagem before deciding about taste.
 *
 * **It sits in the middle on purpose.** Sections 4, 6 and 7 are all
 * image-plus-text; run in sequence the bottom half of the page would rhyme with
 * itself three times every `7rem`. With no dark mode and a single accent, the
 * swap to `--kozo` is the only tonal shift available — and it delivers the
 * delivery facts *after* §3 has shown a price, which is when "how does this
 * reach me" actually becomes the question.
 *
 * **The only section on the page that fills through to column 12.** It is a
 * rail, not a composition, and the symmetry is what makes it read as an
 * information band rather than an editorial block. No icons, no régua, no
 * índigo beyond focus and link hover. On mobile the four fields stack and the
 * dividing hairlines turn horizontal (§13).
 */
export function Servico() {
  return (
    <section className="bg-kozo py-rhythm-6">
      <div className="mx-auto w-full max-w-measure px-gutter">
        <div className="grid lg:grid-cols-12 lg:gap-x-gutter">
          {CAMPOS_DE_SERVICO.map((campo, indice) => (
            <div
              key={campo.rotulo}
              className={`lg:col-span-3 ${
                indice > 0
                  ? "border-t border-hairline pt-rhythm-4 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-rhythm-4"
                  : ""
              } ${indice < CAMPOS_DE_SERVICO.length - 1 ? "pb-rhythm-4 lg:pb-0" : ""}`}>
              <p className="t-annotation text-ink">{campo.rotulo}</p>

              {/* Three of the four fields link and one does not. That is
                  slightly misaligned and is still the right call: inventing a
                  page for *prazo* would be worse. */}
              {campo.href ? (
                <Link href={campo.href} className="t-body-s mt-rhythm-2 block text-ink hover:text-indigo">
                  {campo.linha}
                </Link>
              ) : (
                <p className="t-body-s mt-rhythm-2 text-ink">{campo.linha}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
