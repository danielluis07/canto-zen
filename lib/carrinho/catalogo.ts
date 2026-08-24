// What the cart needs to know about a peça, and nothing else.
//
// Every other surface in the store resolves its produtos on the server, because
// the route already names them. The cart cannot: which slugs it holds is a fact
// about *this browser*, known only after hydration. So the page hands the client
// a projection of the catálogo rather than the catálogo — the same move
// `components/produto/compra.tsx` makes with its `peca` prop, at the scale the
// cart's ignorance forces.
//
// The projection is named field by field on purpose. `lib/catalogo/tabelas.ts`
// is 118 KB of authored records — descrições, três imagens per produto, medidas,
// itens inclusos — and a client component that imported the module would ship
// all of it to render three lines. What crosses here is the eleven fields
// `carrinho.md` §§4–5 actually read.

import {
  todosOsProdutos,
  type Disponibilidade,
  type Embalagem,
  type Figura,
  type FreteGratis,
  type NivelMontagem,
  type Produto,
} from "../catalogo";
import { irmaoDisponivel } from "../produto/conteudo";

export type PecaDoCarrinho = {
  slug: string;
  nome: string;
  acabamento: string;
  /** The line's price is `precoTabela × quantidade` — `carrinho.md` §4.1. */
  precoTabela: number;
  disponibilidade: Disponibilidade;
  /** Only a `sob-encomenda` peça carries one, and its line states it (§4.4). */
  prazoProducaoSemanas?: number;
  /** `nivel` is the montagem price; the four facts stay on the PDP (§4.3). */
  montagem: { necessaria: boolean; nivel: NivelMontagem };
  /** `principal`, contained on 96px of `--kozo` — never a crop (§4.1). */
  imagem: Figura;
  /** The box the freight estimate is quoted from — §8. */
  embalagem: Embalagem;
  freteGratis?: FreteGratis;
  /**
   * The available sibling an `esgotado` line offers, and `null` on every other
   * peça — §6. Computed here rather than on the client because it is a question
   * about the whole catálogo, which is exactly what does not cross this boundary.
   */
  irmao: { rotulo: string; href: string } | null;
};

const projetar = (produto: Produto): PecaDoCarrinho => ({
  slug: produto.slug,
  nome: produto.nome,
  acabamento: produto.acabamento,
  precoTabela: produto.precoTabela,
  disponibilidade: produto.disponibilidade,
  prazoProducaoSemanas: produto.prazoProducaoSemanas,
  montagem: { necessaria: produto.montagem.necessaria, nivel: produto.montagem.nivel },
  // Exactly one `principal`, first in `imagens` — an invariant asserted over the
  // whole catalogue, which is why this reads position and not `papel`.
  imagem: { src: produto.imagens[0]!.src, alt: produto.imagens[0]!.alt },
  embalagem: produto.embalagem,
  freteGratis: produto.freteGratis,
  irmao: produto.disponibilidade === "esgotado" ? irmaoDisponivel(produto) : null,
});

/**
 * The whole catálogo in the cart's projection, keyed by slug.
 *
 * A record and not an array because every read is a lookup by slug: the cart
 * holds slugs, and the order on screen is the cart's insertion order (§4.1),
 * never the catalogue's.
 */
export type CatalogoDoCarrinho = Record<string, PecaDoCarrinho>;

export const catalogoDoCarrinho = (): CatalogoDoCarrinho =>
  Object.fromEntries(todosOsProdutos().map((produto) => [produto.slug, projetar(produto)]));
