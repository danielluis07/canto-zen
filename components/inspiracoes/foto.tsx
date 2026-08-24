import Image from "next/image";
import Link from "next/link";
import type { FotoNaPagina } from "@/lib/inspiracoes/conteudo";

/**
 * §6.5 — a photograph and, beneath it, the legend that names the pieces in that
 * frame. This is the whole mechanism by which a room story reaches the
 * catálogo, and it is chosen because it is already the house language: labelling
 * a real thing with a true fact is what the régua does, and a legend does it in
 * words, spending no régua to do so.
 *
 * **Hotspots were refused** — numbered markers are unavailable outright since
 * `marca.md` §2 removed ordinal numbering from the system, and unnumbered ones
 * are a hover-or-tap reveal this identity has no motion vocabulary to describe
 * and no touch story for. **A "peças neste ambiente" card strip was refused**
 * too: it imports `catalogo.md`'s card onto the one surface that is not a
 * catalogue, and it would drag price back in, since the card carries one.
 *
 * The frame is the ambiente genre at `3:2` (`imagens.md` §0), full-bleed and
 * **contained** on its `--kozo` field, capped at the viewport so a wide room
 * never grows taller than the screen it interrupts. There is no cota here and
 * none anywhere else on the surface: Inspirações spends zero réguas, authored.
 *
 * The `alt` describes the room and not the piece list — the legend beneath is
 * already text, and templating the two together would read it twice (§9).
 */
export function Foto({ foto }: { foto: FotoNaPagina }) {
  return (
    <figure>
      <div className="relative aspect-[3/2] max-h-[78vh] w-full bg-kozo">
        <Image
          src={foto.src}
          alt={foto.alt}
          fill
          sizes="100vw"
          className="object-contain"
        />
      </div>

      {/* The legend is `--muted` and the names are `--ink`. The underline is
          permanent rather than a hover reveal: `acessibilidade.md` §2 wants a
          link in running text distinguishable by more than colour, and
          `marca.md` §9's allowlist carries `text-decoration-color` precisely so
          an existing underline can take the 120ms change on pointer. */}
      <figcaption className="mx-auto mt-rhythm-3 w-full max-w-measure px-gutter">
        <p className="t-annotation text-muted">
          {foto.legenda.map((peca, indice) => (
            <span key={peca.slug}>
              {indice > 0 && <span aria-hidden> · </span>}
              <Link
                href={peca.href}
                className="text-ink underline decoration-1 underline-offset-4 hover:text-muted">
                {peca.nome}
              </Link>
            </span>
          ))}
        </p>
      </figcaption>
    </figure>
  );
}
