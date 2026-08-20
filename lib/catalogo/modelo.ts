// Shapes for the catálogo module. `produto.md` is authoritative on every field
// name and unit; `dados.md` §8 is authoritative on which of them are authored.
//
// The split below is the whole point of the module: `*Autorado` types hold what
// `dados.md` §3 authors, the plain types are what a caller reads back. Several
// fields exist only on the read shape because `dados.md` §8 states them as
// rules, and a stored copy is a second source that can drift.

/** Prices are integers in centavos; lengths integers in centímetros. */
export type Centavos = number;

export type Medidas = {
  largura: number;
  profundidade: number;
  altura: number;
};

export type MedidaExtra = {
  rotulo: string;
  valor: number;
  unidade: "cm" | "kg" | "un";
};

export type Embalagem = {
  volumes: number;
  largura: number;
  profundidade: number;
  altura: number;
  pesoKg: number;
};

export type NivelMontagem = "simples" | "media" | "complexa";

export type Montagem = {
  necessaria: boolean;
  nivel: NivelMontagem;
  pessoas: number;
  pecas: number;
  tempoMinutos: number;
};

/**
 * A picture that is **not** an `Imagem`: no `papel`, no `cotas`. Room
 * photographs, coleção photographs and the família's elevation each carry one,
 * and `imagens.md` §9.2 dropped `Colecao.imagem` to this shape deliberately —
 * a régua on a room photo is forbidden, so both fields would exist only to
 * stay empty.
 */
export type Figura = { src: string; alt: string };

export type PapelImagem = "principal" | "ambientada" | "detalhe";

export type Imagem = {
  src: string;
  alt: string;
  papel: PapelImagem;
  cotas: ("largura" | "altura")[];
};

export type Disponibilidade = "envio-imediato" | "sob-encomenda" | "esgotado";

export type FreteGratis = "nacional" | "sudeste" | "sp-capital";

/**
 * What `dados.md` §3 authors, one row per acabamento.
 *
 * `cor`, `materiais`, `medidas`, `embalagem`, `montagem` and `itensInclusos`
 * are absent on purpose — §8 rules them, so they are derived. `medidasExtras`
 * stays here because §8.3 rules the *rows* by tipo but the figures are per
 * piece, and `ordem` because §8.9 files it under policy rather than rule.
 */
export type ProdutoAutorado = {
  slug: string;
  nome: string;
  familia: string;
  acabamento: string;

  tipo: string;
  ambientePrincipal: string;
  ambientes: string[];
  colecoes: string[];
  /**
   * The row number in `dados.md` §3 — global, 1 through 65, so one piece has
   * one curatorial position in every slice. Authored, not derived: §8.9 files
   * it under the fields that are policy rather than rule, and the table is a
   * transcription of §3 that will be filled in from both ends.
   */
  ordem: number;

  precoTabela: Centavos;
  precoDe?: Centavos;

  medidasExtras: MedidaExtra[];

  disponibilidade: Disponibilidade;
  prazoProducaoSemanas?: number;

  freteGratis?: FreteGratis;

  imagens: Imagem[];
  descricao: string;
  /** Omitted everywhere in this catalogue — `dados.md` §8.9. */
  garantiaMeses?: number;
};

/** The read shape — `produto.md`'s `Produto`, derivations resolved. */
export type Produto = ProdutoAutorado & {
  cor: string;
  materiais: string[];
  medidas: Medidas;
  embalagem: Embalagem;
  montagem: Montagem;
  itensInclusos: string[];
};

export type Ambiente = {
  slug: string;
  label: string;
  /** CURATED, in menu order — `rotas.md`'s table, not inferred from produtos. */
  tipos: string[];
  imagem: Figura;
  descricao: string;
};

export type Tipo = {
  slug: string;
  label: string;
  labelSingular: string;
};

export type Cor = { slug: string; label: string; amostra: string };

export type Material = { slug: string; label: string; cuidados: string };

/**
 * Routeless and thin. `medidas` live here because two acabamentos of one piece
 * share geometry (`pagina-produto.md` §10); `designer` is not stored at all,
 * because `dados.md` §2.5 derives it from tipo.
 */
export type FamiliaAutorada = {
  slug: string;
  nome: string;
  medidas: Medidas;
  /** `src` carries inline SVG markup — `imagens.md` §7 forbids an `<img>`. */
  desenho: Figura;
};

export type Familia = FamiliaAutorada & { designer: string };

export type Colecao = {
  slug: string;
  nome: string;
  descricao: string;
  imagem: Figura;
  /** CURATED ORDER — the coleção is authoritative on sequence. */
  produtos: string[];
};

/** One entry of the 1..N parcelamento table. */
export type Parcela = { parcelas: number; valorCentavos: Centavos };
