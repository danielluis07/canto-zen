import type { Figura } from "@/lib/catalogo";

/**
 * The família's dimensioned technical elevation — `pagina-produto.md` §4.1,
 * `imagens.md` §7.
 *
 * It is **inline SVG and not an `<img>`**, so it inherits the colour tokens and
 * stays crisp at any size: 1px strokes in `--ink`, extension lines in
 * `--hairline`, and dimension lines in the régua's own grammar. `Figura.src`
 * carries the markup itself — `lib/catalogo/desenho.ts` composes it from the
 * família's `medidas`, which is what makes `marca.md` §2's prohibition
 * mechanical: no figure, no cota.
 *
 * The markup is authored in this repository from the catalogue's own numbers,
 * never fetched and never user-supplied, which is what makes setting it as HTML
 * the honest way to inline it.
 *
 * It takes the container's width and gets **no horizontal scroller** on mobile
 * (§9) — the drawing is the one thing the Medidas section exists for.
 */
export function Desenho({ desenho }: { desenho: Figura }) {
  return (
    <div
      className="w-full bg-plaster [&>svg]:h-auto [&>svg]:w-full"
      dangerouslySetInnerHTML={{ __html: desenho.src }}
    />
  );
}
