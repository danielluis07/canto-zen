import Image from "next/image";
import Link from "next/link";
import { EYEBROW_AMBIENTES, type CampoDeAmbiente } from "@/lib/home/conteudo";

/**
 * §2 — the store's spine, offered as a choice and not as a menu.
 *
 * **Four photographic fields, deliberately unequal.** Four equal tiles is the
 * category default and reads as a grid of buttons: one ambiente takes columns
 * 1–7 at full height, the other three stack on 8–12 in shorter bands separated
 * by hairlines. Composition decides which one takes the seven columns, and it
 * is authored — the order of `ambientes[]`.
 *
 * Room photography is the only place this store shows scale and context; a
 * typographic version of this section would leave the whole page as
 * pieces-on-plaster.
 *
 * On mobile the four stack **at equal height** (§13): the asymmetry is a
 * desktop device and does not survive a single column.
 */
export function Ambientes({ campos }: { campos: CampoDeAmbiente[] }) {
  const [primeiro, ...restantes] = campos;
  if (!primeiro) return null;

  return (
    <section className="mx-auto w-full max-w-measure px-gutter">
      <h2 className="t-annotation text-muted">{EYEBROW_AMBIENTES}</h2>

      <div className="mt-rhythm-5 grid gap-y-rhythm-5 lg:grid-cols-12 lg:items-stretch lg:gap-x-gutter">
        <div className="lg:col-span-7">
          <Campo campo={primeiro} destaque />
        </div>

        {/* The three shorter bands divide the featured field's height between
            them, so the two columns close on the same line. A band is wider
            than it is tall and the room photograph fills it: `imagens.md` §4
            keeps a *packshot* uncropped so the cast shadow stays in frame, and
            that is a retrato concern — the ambiente genre has no shadow to cut
            and no piece to misrepresent, which is what lets §2's composition
            exist at all. The hairlines sit *between* the bands, never above the
            first: the column opens level with the featured field. */}
        <div className="flex flex-col gap-y-rhythm-5 lg:col-span-5 lg:h-full lg:gap-y-0">
          {restantes.map((campo, indice) => (
            <div
              key={campo.slug}
              className={`lg:min-h-0 lg:flex-1 ${
                indice > 0 ? "lg:border-t lg:border-hairline lg:pt-rhythm-3" : ""
              }`}>
              <Campo campo={campo} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * The whole field is one link — the three tipos are **not** links of their own.
 * They mirror the navbar panel and are there to reinforce that a tipo is a
 * landable path rather than a filter; making them clickable here would turn the
 * field into a menu, which is the one thing §2 exists not to be.
 */
function Campo({ campo, destaque = false }: { campo: CampoDeAmbiente; destaque?: boolean }) {
  return (
    <Link href={campo.href} className="flex h-full flex-col">
      <div
        className={`relative w-full bg-kozo aspect-[3/2] ${
          destaque ? "" : "lg:aspect-auto lg:min-h-0 lg:flex-1"
        }`}>
        <Image
          src={campo.imagem.src}
          alt={campo.imagem.alt}
          fill
          sizes={destaque ? "(min-width: 64rem) 58vw, 100vw" : "(min-width: 64rem) 42vw, 100vw"}
          className="object-cover"
        />
      </div>

      <p className="t-annotation mt-rhythm-3 text-ink">{campo.label}</p>
      <p className="t-annotation mt-rhythm-1 text-muted">{campo.tipos}</p>
    </Link>
  );
}
