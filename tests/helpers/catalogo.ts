import { produto } from "../../lib/catalogo";
import type { Produto } from "../../lib/catalogo";

/**
 * A produto a test names, resolved or loudly absent.
 *
 * A test that reads `undefined` back reports it as a missing property on a
 * hundred fields; a test that names the slug it could not find reports the one
 * thing that is actually wrong — a row that was not transcribed.
 */
export const exigirProduto = (slug: string): Produto => {
  const encontrado = produto(slug);
  if (!encontrado) throw new Error(`row missing from the catalogue: ${slug}`);
  return encontrado;
};

/** The structural woods `dados.md` §8.1 names — a piece carries at least one. */
export const MADEIRAS = ["carvalho", "nogueira", "freijo", "jatoba"];
