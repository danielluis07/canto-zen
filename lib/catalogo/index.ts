// The catálogo module's public surface — records plus derivation functions.
//
// Every route in the store reads this module and nothing else: no page holds a
// literal produto, price, prazo or address. Every field `dados.md` §8 states as
// a rule is composed here at read time and never stored, because a stored copy
// is a second source that can drift.
//
// The catalogue tables are `tabelas.ts`, the derivations `derivacoes.ts` and
// the freight rule `frete.ts`. The cross-reference invariants the tables rely on
// — none of which the type system catches — are asserted over the whole
// catalogue in `tests/catalogo-invariantes.test.ts`, never at runtime.

import {
  corDoAcabamento,
  designerDoTipo,
  embalagemDe,
  itensInclusosDe,
  materiaisDoAcabamento,
  montagemDoTipo,
} from "./derivacoes";
import {
  ambientes,
  artigos,
  colecoes,
  cores,
  familias,
  materiais,
  produtos as produtosAutorados,
  tipos,
} from "./tabelas";
import type {
  Ambiente,
  Artigo,
  Colecao,
  Cor,
  Familia,
  Material,
  Produto,
  ProdutoAutorado,
  Tipo,
} from "./modelo";

export * from "./modelo";
export * from "./derivacoes";
export * from "./formato";
export * from "./frete";
export { politicas, loja, paginasDePolitica } from "./politicas";
export { ambientes, tipos, cores, materiais, colecoes, artigos, conteudoHome } from "./tabelas";

// The taxonomy is entities keyed by slug, so every surface resolves a facet the
// same way instead of carrying its own lookup table.
const porSlug =
  <T extends { slug: string }>(tabela: T[]) =>
  (slug: string): T | undefined =>
    tabela.find((entrada) => entrada.slug === slug);

export const ambiente = porSlug<Ambiente>(ambientes);
export const tipo = porSlug<Tipo>(tipos);
export const cor = porSlug<Cor>(cores);
export const material = porSlug<Material>(materiais);
export const colecao = porSlug<Colecao>(colecoes);
export const artigo = porSlug<Artigo>(artigos);

const familiaAutorada = (slug: string) => {
  const encontrada = familias.find((f) => f.slug === slug);
  if (!encontrada) throw new Error(`produto points at an unknown família: ${slug}`);
  return encontrada;
};

const compor = (autorado: ProdutoAutorado): Produto => {
  const { medidas } = familiaAutorada(autorado.familia);
  const materiaisDoProduto = materiaisDoAcabamento(autorado.acabamento);

  return {
    ...autorado,
    cor: corDoAcabamento(autorado.acabamento),
    materiais: materiaisDoProduto,
    medidas,
    embalagem: embalagemDe({
      medidas,
      tipo: autorado.tipo,
      materiais: materiaisDoProduto,
    }),
    montagem: montagemDoTipo(autorado.tipo),
    itensInclusos: itensInclusosDe({
      tipo: autorado.tipo,
      medidasExtras: autorado.medidasExtras,
    }),
  };
};

/** The whole catalogue, in curatorial order — `ordem`, not table position. */
export const todosOsProdutos = (): Produto[] =>
  produtosAutorados.map(compor).sort((a, b) => a.ordem - b.ordem);

export const produto = (slug: string): Produto | undefined => {
  const autorado = produtosAutorados.find((p) => p.slug === slug);
  return autorado && compor(autorado);
};

/**
 * Routeless: `familias` is not a reserved segment and must not become one. The
 * designer is derived from the tipo of the produtos that carry this família,
 * which is why it is not stored on the record.
 */
export const familia = (slug: string): Familia | undefined => {
  const autorada = familias.find((f) => f.slug === slug);
  if (!autorada) return undefined;

  const primeiro = produtosAutorados.find((p) => p.familia === slug);
  if (!primeiro) throw new Error(`família carries no produto, so it has no designer: ${slug}`);

  return { ...autorada, designer: designerDoTipo(primeiro.tipo) };
};
