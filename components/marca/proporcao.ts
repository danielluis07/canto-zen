import type { Proporcao } from "@/lib/catalogo";

/**
 * The three enumerated ratios — `imagens.md` §2 — as the classes that reserve
 * them.
 *
 * The box declares the piece's own proportion before anything loads and holds a
 * flat `--kozo` field until the photograph paints: cumulative layout shift is
 * zero, which matters more here than in most stores because the listing grid is
 * deliberately ragged and a shifting row would be indistinguishable from a bug.
 * On failure the field simply stays — no icon, no glyph, no `IMAGEM
 * INDISPONÍVEL`.
 *
 * It lives in one module because the card and the produto page frame the same
 * packshot: two copies of this table is how the enumeration stops being one.
 */
export const CLASSE_DA_PROPORCAO: Record<Proporcao, string> = {
  "3:2": "aspect-[3/2]",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
};
