// The derivation surface. `dados.md` §8 states these as rules rather than
// values, so they are computed at read time and never stored.

import { politicas } from "./politicas";
import { cores, materiais, tipos } from "./tabelas";
import type {
  Centavos,
  Embalagem,
  MedidaExtra,
  Medidas,
  Montagem,
  NivelMontagem,
  Parcela,
} from "./modelo";

/**
 * A rule that does not cover a case is a transcription defect, not a default:
 * every table below is total over the taxonomy, and a miss says so loudly
 * rather than quietly producing a plausible record.
 */
const exigir = <T>(tabela: Record<string, T>, chave: string, oQue: string): T => {
  const valor = tabela[chave];
  if (valor === undefined) throw new Error(`${oQue}: ${chave}`);
  return valor;
};

/** `precoTabela × (1 − descontoPixPercent/100)` — `produto.md`. */
export const precoAVista = (precoTabela: Centavos): Centavos =>
  Math.round(precoTabela * (1 - politicas.descontoPixPercent / 100));

/**
 * The largest `N ≤ parcelasMax` whose parcela clears `parcelaMinimaCentavos`.
 * A price under the minimum still buys in one — 1x is the à-vista tier, and a
 * store that offers no parcelamento line still offers a price.
 */
export const numeroDeParcelas = (precoTabela: Centavos): number =>
  Math.max(
    1,
    Math.min(politicas.parcelasMax, Math.floor(precoTabela / politicas.parcelaMinimaCentavos)),
  );

export const linhaDeParcelamento = (precoTabela: Centavos): Parcela => {
  const parcelas = numeroDeParcelas(precoTabela);
  return { parcelas, valorCentavos: Math.round(precoTabela / parcelas) };
};

/** Every offer from 1x to the parcelamento line, in order. */
export const tabelaDeParcelas = (precoTabela: Centavos): Parcela[] =>
  Array.from({ length: numeroDeParcelas(precoTabela) }, (_, i) => ({
    parcelas: i + 1,
    valorCentavos: Math.round(precoTabela / (i + 1)),
  }));

/** `montagemCentavos[nivel]` — priced by the work, not by the piece. */
export const precoMontagem = (nivel: NivelMontagem): Centavos =>
  politicas.montagemCentavos[nivel];

/** `garantiaMeses ?? garantiaPadraoMeses`. */
export const garantiaMeses = (produto: { garantiaMeses?: number }): number =>
  produto.garantiaMeses ?? politicas.garantiaPadraoMeses;

// ---------------------------------------------------------------------------
// `cor` and `materiais` — dados.md §8.1
//
// `acabamento` is written as `{Material} {Cor}`, `{Material} e {Material}` or a
// bare material throughout §3, so the parse is structural: the first word names
// a material, and what follows is a Cor if the Cor table knows it and a second
// material otherwise.
// ---------------------------------------------------------------------------

/** The colour a wood carries when the acabamento names none — §8.1. */
const CORES_DAS_MADEIRAS: Record<string, string> = {
  carvalho: "areia",
  freijo: "areia",
  nogueira: "nogueira",
  jatoba: "terracota",
  latao: "ocre",
  palhinha: "cru",
};

/** Structural woods. A piece that already names one takes no second wood. */
const MADEIRAS = new Set(["carvalho", "nogueira", "freijo", "jatoba"]);

/** The one the store falls back to — §8.1's `['marmore', 'carvalho']`. */
const MADEIRA_ESTRUTURAL = "carvalho";

/** Material labels run wider than the acabamento word: `Aço carbono` / `Aço`. */
const materialPorPalavra = new Map(
  materiais.map((m) => [m.label.split(" ")[0]!.toLowerCase(), m.slug]),
);

const corPorLabel = new Map(cores.map((c) => [c.label.toLowerCase(), c.slug]));

/**
 * Opening words of an acabamento that name a **finish**, not a material.
 *
 * `dados.md` §3.3 row 50 writes `Laca Off-white`, and §2.4's material table has
 * no `laca` — the fourteen rows there are all substances a piece is built from,
 * and lacquer is what is sprayed on one. So the acabamento names a colour and a
 * surface treatment, and §8.1's structural clause supplies the material the way
 * it does for `Mármore Cru`. The set is closed and explicit rather than a
 * fallback for any unrecognised word, so a mistyped material still says so.
 */
const PALAVRAS_SEM_MATERIAL = new Set(["laca"]);

const aoMaterial = (palavra: string): string => {
  const slug = materialPorPalavra.get(palavra.toLowerCase());
  if (!slug) throw new Error(`acabamento names no known material: ${palavra}`);
  return slug;
};

/** The materials the acabamento names, in the order it names them. */
const nomeados = (acabamento: string): string[] => {
  if (acabamento.includes(" e ")) return acabamento.split(" e ").map(aoMaterial);

  const [primeiro, ...resto] = acabamento.split(" ");
  if (PALAVRAS_SEM_MATERIAL.has(primeiro!.toLowerCase())) return [];

  const materiaisNomeados = [aoMaterial(primeiro!)];
  if (resto.length === 0) return materiaisNomeados;

  const segundo = resto.join(" ");
  // A Cor closes the acabamento; anything else has to be a second material.
  if (corPorLabel.has(segundo.toLowerCase())) return materiaisNomeados;
  return [...materiaisNomeados, aoMaterial(segundo)];
};

/**
 * Every material the acabamento names, plus the structural wood of the piece
 * where it named only a surface. An upholstered piece is always
 * `[<tecido ou couro>, 'carvalho']`; a palhinha piece is always
 * `['palhinha', <madeira>]`.
 */
export const materiaisDoAcabamento = (acabamento: string): string[] => {
  const nomes = nomeados(acabamento);
  return nomes.some((m) => MADEIRAS.has(m)) ? nomes : [...nomes, MADEIRA_ESTRUTURAL];
};

/**
 * The colour word in the acabamento, slugged — or, where it names none, the
 * colour of the wood it does name.
 */
export const corDoAcabamento = (acabamento: string): string => {
  if (!acabamento.includes(" e ")) {
    const [, ...resto] = acabamento.split(" ");
    const cor = corPorLabel.get(resto.join(" ").toLowerCase());
    if (cor) return cor;
  }

  // No colour word, so the colour is the wood's own — the first the acabamento
  // names, which is the surface the shopper actually sees.
  for (const material of nomeados(acabamento)) {
    const cor = CORES_DAS_MADEIRAS[material];
    if (cor) return cor;
  }
  throw new Error(`acabamento names no colour and no wood: ${acabamento}`);
};

// ---------------------------------------------------------------------------
// Facts of the tipo — dados.md §8.3 and §8.5
//
// Both tables read by tipo, and both pick one value inside the spec's range
// rather than leaving it open: a range that two build sessions resolve
// differently is not a rule.
// ---------------------------------------------------------------------------

const porTipo = <T>(grupos: Array<[string[], T]>): Record<string, T> =>
  Object.fromEntries(grupos.flatMap(([slugs, valor]) => slugs.map((s) => [s, valor])));

/** §8.5. `nivel` drives the price, so this is also the montagem price table. */
const MONTAGEM = porTipo<Montagem>([
  [
    ["poltronas", "banquetas", "criados-mudos", "mesas-de-centro"],
    { necessaria: true, nivel: "simples", pessoas: 1, pecas: 5, tempoMinutos: 20 },
  ],
  [
    ["cadeiras", "cadeiras-de-trabalho"],
    { necessaria: true, nivel: "simples", pessoas: 1, pecas: 6, tempoMinutos: 18 },
  ],
  [
    ["luminarias-de-mesa"],
    { necessaria: false, nivel: "simples", pessoas: 1, pecas: 1, tempoMinutos: 0 },
  ],
  [
    ["mesas", "mesas-de-jantar", "escrivaninhas", "aparadores", "carrinhos-e-apoios"],
    { necessaria: true, nivel: "media", pessoas: 2, pecas: 11, tempoMinutos: 48 },
  ],
  [
    ["sofas", "comodas", "cabeceiras"],
    { necessaria: true, nivel: "media", pessoas: 2, pecas: 9, tempoMinutos: 40 },
  ],
  [
    ["camas", "racks-e-estantes", "estantes"],
    { necessaria: true, nivel: "complexa", pessoas: 2, pecas: 24, tempoMinutos: 90 },
  ],
  [
    ["guarda-roupas", "armarios"],
    { necessaria: true, nivel: "complexa", pessoas: 2, pecas: 32, tempoMinutos: 130 },
  ],
]);

export const montagemDoTipo = (tipo: string): Montagem =>
  exigir(MONTAGEM, tipo, "tipo has no montagem rule");

/** §8.3, an open list — only where the fact is real. */
const MEDIDAS_EXTRAS = porTipo<Array<[string, MedidaExtra["unidade"]]>>([
  [
    ["sofas"],
    [
      ["Altura do assento", "cm"],
      ["Quantidade de lugares", "un"],
      ["Quantidade de almofadas", "un"],
    ],
  ],
  [
    ["poltronas", "cadeiras", "cadeiras-de-trabalho", "banquetas"],
    [
      ["Altura do assento", "cm"],
      ["Capacidade de peso", "kg"],
    ],
  ],
  [
    ["mesas-de-jantar", "mesas"],
    [
      ["Quantidade de lugares", "un"],
      ["Espessura do tampo", "cm"],
    ],
  ],
  [
    ["camas"],
    [
      ["Altura do estrado", "cm"],
      ["Colchão recomendado", "cm"],
    ],
  ],
  [
    ["guarda-roupas", "armarios"],
    [
      ["Quantidade de portas", "un"],
      ["Prateleiras internas", "un"],
    ],
  ],
  [
    ["racks-e-estantes", "estantes"],
    [
      ["Prateleiras", "un"],
      ["Capacidade por prateleira", "kg"],
    ],
  ],
  [["comodas", "criados-mudos"], [["Quantidade de gavetas", "un"]]],
  [
    ["luminarias-de-mesa"],
    [
      ["Alcance do braço", "cm"],
      ["Soquete", "un"],
    ],
  ],
  // §8.3 names three tipos that carry none on purpose, so the empty case is
  // rendered somewhere. This group holds a fourth: `mesas-de-centro` is not in
  // §8.3's table at all — neither given rows nor listed among the dashes. Read
  // as no rows, because the table assigns rows to tipos and this one was
  // assigned none; the alternative is borrowing `mesas`' rows, and a coffee
  // table seats nobody.
  [["aparadores", "carrinhos-e-apoios", "cabeceiras", "mesas-de-centro"], []],
]);

/**
 * The rows a tipo carries, in order, each with its unit. The figures themselves
 * are per piece and authored — §8.3 rules the rows, not the values.
 */
export const medidasExtrasDoTipo = (
  tipo: string,
): Array<{ rotulo: string; unidade: MedidaExtra["unidade"] }> =>
  exigir(MEDIDAS_EXTRAS, tipo, "tipo has no medidasExtras rule").map(([rotulo, unidade]) => ({
    rotulo,
    unidade,
  }));

/** Just the row labels — what a transcribed produto has to match. */
export const rotulosMedidasExtras = (tipo: string): string[] =>
  medidasExtrasDoTipo(tipo).map((linha) => linha.rotulo);

// ---------------------------------------------------------------------------
// `embalagem` — dados.md §8.4
//
// Derived rather than authored because `carrinho.md` §8's cubed-weight rule
// reads it directly: a hand-typed pesoKg that disagrees with the box makes the
// freight quote arbitrary, and the whole argument for the CEP widget is that
// its answers are computed.
// ---------------------------------------------------------------------------

/** §8.4's seven classes, in kg/m³, transcribed under the spec's own names. */
const DENSIDADES = {
  estofados: 55,
  "madeira-macica": 210,
  "madeira-com-painel": 160,
  aco: 240,
  "palhinha-rattan": 70,
  marmore: 480,
  "ceramica-latao": 300,
} as const;

/**
 * §8.4 calls this `densidade_do_tipo`, but the classes it lists are material
 * classes and the tipo cannot pick between them: `mesas` holds both Mesa Taipa
 * in jatobá and Mesa Pedra in mármore, which are 210 and 480. So the density
 * follows the material the acabamento names first — the surface the piece is
 * actually built in — which is the only reading that returns one answer.
 */
const CLASSE_DO_MATERIAL: Record<string, keyof typeof DENSIDADES> = {
  linho: "estofados",
  boucle: "estofados",
  "couro-natural": "estofados",
  carvalho: "madeira-macica",
  nogueira: "madeira-macica",
  freijo: "madeira-macica",
  jatoba: "madeira-macica",
  palhinha: "palhinha-rattan",
  rattan: "palhinha-rattan",
  "aco-carbono": "aco",
  marmore: "marmore",
  ceramica: "ceramica-latao",
  latao: "ceramica-latao",
};

const VOLUMES_POR_TIPO: Record<string, number> = {
  camas: 2,
  "guarda-roupas": 3,
  armarios: 2,
  "mesas-de-jantar": 2,
};

/** Margem de embalagem, in cm, per axis. */
const MARGEM = { largura: 8, profundidade: 8, altura: 6 };

const volumesDe = (tipo: string, medidas: Medidas): number => {
  if (tipo === "sofas") return medidas.largura >= 220 ? 2 : 1;
  return VOLUMES_POR_TIPO[tipo] ?? 1;
};

/**
 * The box, from the piece plus a packing margin.
 *
 * The figures describe **the shipment as a whole**, not one of its volumes:
 * `largura` is the piece's own width plus margin even where `volumes` is 2 or
 * 3. §8.4 notes that multi-volume pieces divide those dimensions across their
 * boxes and that "the totals stay right either way" — so the freight rule reads
 * these figures as they stand and must not re-multiply them by `volumes`.
 */
export const embalagemDe = ({
  medidas,
  tipo,
  materiais: materiaisDoProduto,
}: {
  medidas: Medidas;
  tipo: string;
  /** The produto's materials, dominant first — the surface names the density. */
  materiais: string[];
}): Embalagem => {
  const largura = medidas.largura + MARGEM.largura;
  const profundidade = medidas.profundidade + MARGEM.profundidade;
  const altura = medidas.altura + MARGEM.altura;

  const dominante = materiaisDoProduto[0] ?? "";
  const classe = exigir(CLASSE_DO_MATERIAL, dominante, "material has no density class");
  const metrosCubicos = (largura / 100) * (profundidade / 100) * (altura / 100);

  return {
    volumes: volumesDe(tipo, medidas),
    largura,
    profundidade,
    altura,
    pesoKg: Math.round(metrosCubicos * DENSIDADES[classe]),
  };
};

// ---------------------------------------------------------------------------
// `designer` — dados.md §2.5
//
// Eight designers across the famílias. An atelier has a roster, not one
// designer per piece, and every tipo appears exactly once below, so the
// derivation is total and unambiguous.
// ---------------------------------------------------------------------------

const DESIGNERS = porTipo<string>([
  [["sofas", "poltronas"], "Marina Aoki"],
  [["mesas-de-jantar", "mesas", "mesas-de-centro"], "Tomás Reis"],
  [["cadeiras", "banquetas"], "Yuki Nakamura"],
  [["camas", "cabeceiras"], "Clara Beltrão"],
  [["racks-e-estantes", "estantes", "guarda-roupas", "armarios"], "Henrique Sato"],
  [["aparadores", "comodas", "criados-mudos"], "Alice Prado"],
  [["escrivaninhas", "cadeiras-de-trabalho"], "Rui Kimura"],
  [["luminarias-de-mesa", "carrinhos-e-apoios"], "Beatriz Amaral"],
]);

export const designerDoTipo = (tipo: string): string =>
  exigir(DESIGNERS, tipo, "tipo has no designer");

// ---------------------------------------------------------------------------
// `itensInclusos` — dados.md §8.7
// ---------------------------------------------------------------------------

const FERRAMENTA: Record<NivelMontagem, string> = {
  simples: "chave allen",
  media: "chave allen e gabarito de furação",
  complexa: "chave allen e gabarito de furação",
};

const labelSingularDoTipo = (slug: string): string => {
  const tipo = tipos.find((entrada) => entrada.slug === slug);
  if (!tipo) throw new Error(`unknown tipo: ${slug}`);
  return tipo.labelSingular;
};

export const itensInclusosDe = ({
  tipo,
  medidasExtras,
}: {
  tipo: string;
  medidasExtras: MedidaExtra[];
}): string[] => {
  const montagem = montagemDoTipo(tipo);
  const almofadas = medidasExtras.find((m) => m.rotulo === "Quantidade de almofadas");

  return [
    `1 ${labelSingularDoTipo(tipo).toLowerCase()}`,
    ...(almofadas ? [`${almofadas.valor} almofadas soltas`] : []),
    // Tooling follows the manual: a piece that is not assembled ships with
    // neither, and the luminárias are the only such pieces in the catalogue.
    ...(montagem.necessaria ? ["manual de montagem", FERRAMENTA[montagem.nivel]] : []),
    ...(tipo === "luminarias-de-mesa" ? ["lâmpada não inclusa"] : []),
  ];
};
