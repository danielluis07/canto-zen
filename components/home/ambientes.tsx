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
 * On mobile the asymmetry does not survive — it is a desktop device (§13) — but
 * the four fields are not four full-bleed photographs either. The featured one
 * keeps the full width, because it is the one the composition chose; the three
 * shorter bands run **two columns from the smallest screen**, as the listing
 * grid and §3's strip do. Four stacked room photographs read as four screens of
 * scroll before the page has offered anything else.
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
        <div className="grid grid-cols-2 gap-x-gutter gap-y-rhythm-5 lg:col-span-5 lg:flex lg:h-full lg:flex-col lg:gap-x-0 lg:gap-y-0">
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
 * The photograph and the room's name are one link — the three tipos are **not**
 * links of their own. They mirror the navbar panel and are there to reinforce
 * that a tipo is a landable path rather than a filter; making them clickable
 * here would turn the field into a menu, which is the one thing §2 exists not to
 * be.
 *
 * **And the tipo line sits outside the anchor, not merely unlinked inside it.**
 * `SOFÁS · POLTRONAS · MESAS DE CENTRO` inside the link to `/sala` is the worst
 * of the two available readings: the words name three real destinations, they
 * are inside a click target, and clicking `SOFÁS` lands on the room instead —
 * the field promising a path it does not have. Outside the anchor the line is
 * what §2 says it is, a statement of what the room holds, and the only clickable
 * thing in the field goes where the field says it goes.
 */
function Campo({ campo, destaque = false }: { campo: CampoDeAmbiente; destaque?: boolean }) {
  return (
    <div className="flex h-full flex-col">
      {/* `flex-1` only from `lg`: above it the band's height comes from the
          column and the anchor absorbs what the tipo line does not use, while
          below it the field is a plain stack and a zero flex-basis would
          collapse the photograph the `3:2` box exists to reserve. */}
      <Link href={campo.href} className="flex flex-col lg:min-h-0 lg:flex-1">
        <div
          className={`relative w-full bg-kozo aspect-[3/2] ${
            destaque ? "" : "lg:aspect-auto lg:min-h-0 lg:flex-1"
          }`}>
          <Image
            src={campo.imagem.src}
            alt={campo.imagem.alt}
            fill
            sizes={destaque ? "(min-width: 64rem) 58vw, 100vw" : "(min-width: 64rem) 42vw, 50vw"}
            className="object-cover"
          />
        </div>

        <p className="t-annotation mt-rhythm-3 text-ink">{campo.label}</p>
      </Link>

      <p className="t-annotation mt-rhythm-1 text-muted">{campo.tipos}</p>
    </div>
  );
}
