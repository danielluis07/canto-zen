// Structured data — `rotas.md` §6.
//
// **Three node types. Nothing else, on any route.** The refusals are as much of
// the deliverable as the nodes, so they are stated here rather than left as an
// absence a later session reads as an oversight:
//
//   - **`offers`.** A `price`/`availability` node is a machine-readable
//     assertion that this thing can be bought at this price today — the exact
//     claim `checkout.md` is built around admitting the store cannot make. §0's
//     rule 3: on the page the concept-store frame travels with the reader; in a
//     third party's index it does not. It is the map's eighth refusal of a
//     fabricated artefact.
//   - **`Organization` / `LocalBusiness`.** A name is not a credential; an
//     address, CNPJ, telephone, logo or rating is. `Brand { name }` and an
//     article's `author` carry a name and nothing else, which is why they are
//     the two places a name is permitted. `/contato` emits none, despite being
//     the one page a showroom section would invite it onto.
//   - **`AggregateRating` / `Review`.** There are no ratings to publish.
//   - **`ItemList` on listings.** True in isolation, but it exists to earn a
//     product carousel — a shopping placement arrived at from the side.
//   - **`WebSite` + `SearchAction`.** There is no search; `?q=` stays reserved
//     and unused.
//
// **A consequence a build session must not "fix":** without `offers`, the
// `Product` node is ineligible for merchant and product rich results. That is
// the decision. Adding `offers` to make the rich result appear reverses it.

import { ambiente, material, tipo } from "../catalogo";
import type { Artigo, Medidas, Produto } from "../catalogo/modelo";
import { metadadosDoProduto, trilha } from "../produto/conteudo";
import { ORIGEM } from "./conteudo";

/** A JSON-LD node, as it is serialized into the document. */
export type No = Record<string, unknown>;

/** `unitCode: CMT` — centimetres, which is the only unit the store measures in. */
const emCentimetros = (valor: number): No => ({
  "@type": "QuantitativeValue",
  value: valor,
  unitCode: "CMT",
});

const absoluta = (caminho: string): string => new URL(caminho, ORIGEM).toString();

/**
 * `Product` on `/produtos/[slug]` — facts, and the same class of fact the
 * description carries. That is not a coincidence: it is §0's rule 3 applied
 * twice. Physical dimensions are the store's own domain and true regardless of
 * whether anything can be bought; a price is a commercial claim.
 *
 * **No `sku` and no `gtin`.** `produto.md` already refused synthetic ids, and
 * this is the one place inventing one would have paid off.
 *
 * `brand` is `Brand { name }` and stops there — see the header's second refusal.
 */
export const noDoProduto = (produto: Produto): No => {
  const tip = tipo(produto.tipo);
  const principal = produto.imagens.find((imagem) => imagem.papel === "principal");
  const materiais = produto.materiais
    .map((slug) => material(slug)?.label)
    .filter((label): label is string => label !== undefined);

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: produto.nome,
    description: metadadosDoProduto(produto).descricao,
    ...(principal ? { image: principal.src } : {}),
    ...(tip ? { category: tip.label } : {}),
    ...(materiais.length > 0 ? { material: materiais.join(", ") } : {}),
    color: produto.cor,
    ...medidasDoNo(produto.medidas),
    brand: { "@type": "Brand", name: "Canto Zen" },
  };
};

const medidasDoNo = ({ largura, profundidade, altura }: Medidas): No => ({
  width: emCentimetros(largura),
  depth: emCentimetros(profundidade),
  height: emCentimetros(altura),
});

/**
 * `BreadcrumbList` on `/produtos/[slug]`, **mirroring the visible trail
 * exactly** — the same `trilha()` the page renders, so the node cannot drift
 * from the trail a reader sees and can never invent one they cannot.
 *
 * That means the primary room, always: `rotas.md`'s Breadcrumbs section makes
 * the trail read `ambientePrincipal` and never the room the visitor arrived
 * through, so it is identical for every visitor and for the crawler.
 *
 * The visible trail is uppercased for the annotation voice (`pagina-produto.md`
 * §1); the node carries the labels as the data holds them, because the case is
 * a typographic treatment of the page and not a fact about the room.
 */
export const noDaTrilha = (produto: Produto): No => {
  const rotulos = [
    "Início",
    ambiente(produto.ambientePrincipal)?.label ?? produto.ambientePrincipal,
    tipo(produto.tipo)?.label ?? produto.tipo,
    produto.nome,
  ];
  const caminhos = trilha(produto).map((item) => item.href);

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: rotulos.map((nome, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: nome,
      ...(caminhos[indice] ? { item: absoluta(caminhos[indice]!) } : {}),
    })),
  };
};

/**
 * `Article` on `/inspiracoes/[slug]`.
 *
 * **No `datePublished` and no named author.** `Artigo` carries no date
 * (`inspiracoes.md`), and a byline is the founder biography
 * `institucional.md` refused, arriving in JSON-LD. `author` is the store, as an
 * `Organization` holding a name and nothing else — the one shape §6 permits it
 * in, and the reason a top-level `Organization` node still does not exist.
 */
export const noDoArtigo = (artigo: Artigo): No => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: artigo.titulo,
  description: artigo.resumo,
  image: artigo.thumb.src,
  author: { "@type": "Organization", name: "Canto Zen" },
});

/** Kept for the two nodes the produto page emits together. */
export const nosDoProduto = (produto: Produto): No[] => [noDoProduto(produto), noDaTrilha(produto)];

