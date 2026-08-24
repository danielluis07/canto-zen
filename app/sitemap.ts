import type { MetadataRoute } from "next";
import { artigosEnumerados } from "@/lib/inspiracoes/conteudo";
import {
  ambientesEnumerados,
  colecoesEnumeradas,
  paresEnumerados,
  produtosEnumerados,
} from "@/lib/listagem/rotas";
import { slugsDePoliticas } from "@/lib/institucional/politicas";
import { ORIGEM } from "@/lib/metadados/conteudo";

/**
 * Exactly the indexable set of `rotas.md` §4, with the enumerated room × tipo
 * pairs written out.
 *
 * It is **generated from the same declaration the router reads** — the same
 * `paresEnumerados`, `produtosEnumerados`, `colecoesEnumeradas`,
 * `artigosEnumerados` and `slugsDePoliticas` that `generateStaticParams` spends
 * — so a pair cannot be in one and not the other. A hand-kept list here is the
 * drift the single declaration exists to prevent.
 *
 * The four `noindex` surfaces are absent, and so is every filtered URL: a
 * sitemap is a claim that a URL is worth indexing, and the store makes that
 * claim about the clean path and about `?pagina=` only. `pagina` itself is not
 * enumerated here either — a paginated URL is discovered by following the
 * listing's own pagination, and enumerating page 2 of twenty listings would put
 * the same pieces in the file twice.
 *
 * No `lastModified`, no `changeFrequency` and no `priority`. Each is a claim
 * about the store's publishing rhythm that nothing in the data can support, and
 * §0's rule 3 holds hardest exactly where the claim leaves the site.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const caminhos = [
    "/",
    ...ambientesEnumerados().map((slug) => `/${slug}`),
    ...paresEnumerados().map((par) => `/${par.ambiente}/${par.tipo}`),
    "/produtos",
    ...produtosEnumerados().map((slug) => `/produtos/${slug}`),
    ...colecoesEnumeradas().map((slug) => `/colecoes/${slug}`),
    "/inspiracoes",
    ...artigosEnumerados().map((slug) => `/inspiracoes/${slug}`),
    "/sobre",
    "/contato",
    ...slugsDePoliticas().map((slug) => `/politicas/${slug}`),
  ];

  return caminhos.map((caminho) => ({ url: new URL(caminho, ORIGEM).toString() }));
}
