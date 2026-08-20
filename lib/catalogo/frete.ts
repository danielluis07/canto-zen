// The freight rule, and the CEP resolution it stands on.
//
// A pure function over facts the catálogo already carries: no page, no state,
// no service. `carrinho.md` §8 states the arithmetic; the region table is
// **`dados.md` §4.1's corrected one**, not §8's — §8's gave prefixes 76, 77
// and 78 two regions each, and its six rows between them covered 01 through 99,
// which made *região não atendida* unreachable although `erros.md` §5.2 builds
// an entire copy class on that state.
//
// The figures this produces are large. `dados.md` §4.3 records that as
// intentional: cubed weight at the /6000 divisor is what Brazilian furniture
// freight actually costs, and `freteGratis` on the expensive pieces is the
// deliberate relief valve. Nothing here softens a number.

import type { Centavos, Embalagem, FreteGratis } from "./modelo";

/** `carrinho.md` §8 / `checkout.md` §12 — the two delivery modalidades. */
export type Modalidade = "padrao" | "agendada";

export type RegiaoFrete =
  | "sudeste-capitais"
  | "sudeste-interior"
  | "sul"
  | "centro-oeste"
  | "nordeste"
  | "norte";

/** An inclusive span of CEP prefixes — the first two digits. */
export type FaixaDePrefixos = readonly [number, number];

export type Tarifa = {
  regiao: RegiaoFrete;
  label: string;
  prefixos: readonly FaixaDePrefixos[];
  baseCentavos: Centavos;
  porKgCentavos: Centavos;
  /** The padrão option's prazo. Agendada carries the same one. */
  prazoDiasUteis: number;
};

/**
 * `dados.md` §4.1's corrected table. Two moves against `carrinho.md` §8, both
 * resolved the way real CEP geography does: **77 is Tocantins** (Norte) and
 * **78–79 are Mato Grosso and Mato Grosso do Sul** (Centro-Oeste). Base, per-kg
 * and prazo are untouched.
 *
 * The spans below and `PREFIXO_NAO_ATENDIDO` partition 01–99 exactly — no
 * prefix answers twice, and exactly one is unserved. `catalogo-frete.test.ts`
 * asserts that, because both halves of it were defects in §8's table.
 */
export const tarifas: readonly Tarifa[] = [
  {
    regiao: "sudeste-capitais",
    label: "Sudeste capitais",
    prefixos: [
      [1, 9],
      [20, 23],
      [30, 31],
    ],
    baseCentavos: 9000,
    porKgCentavos: 550,
    prazoDiasUteis: 6,
  },
  {
    regiao: "sudeste-interior",
    label: "Sudeste interior",
    prefixos: [
      [10, 19],
      [24, 29],
      [32, 39],
    ],
    baseCentavos: 12000,
    porKgCentavos: 650,
    prazoDiasUteis: 9,
  },
  {
    regiao: "sul",
    label: "Sul",
    prefixos: [[80, 99]],
    baseCentavos: 14000,
    porKgCentavos: 700,
    prazoDiasUteis: 11,
  },
  {
    regiao: "centro-oeste",
    label: "Centro-Oeste",
    prefixos: [
      [70, 76],
      [78, 79],
    ],
    baseCentavos: 17000,
    porKgCentavos: 850,
    prazoDiasUteis: 13,
  },
  {
    regiao: "nordeste",
    label: "Nordeste",
    prefixos: [[40, 65]],
    baseCentavos: 19000,
    porKgCentavos: 950,
    prazoDiasUteis: 15,
  },
  {
    regiao: "norte",
    label: "Norte",
    prefixos: [
      [66, 68],
      // Tocantins — the half of §8's 76-78 overlap that resolves this way.
      [77, 77],
    ],
    baseCentavos: 24000,
    porKgCentavos: 1200,
    prazoDiasUteis: 20,
  },
];

/**
 * Acre, Roraima and the Amazonas/Rondônia interior — genuinely the hardest
 * freight destination in the country, so a São Paulo atelier not yet serving it
 * is a plausible limit rather than an arbitrary hole. One prefix rather than
 * dropping Norte wholesale, precisely so §8's argument survives: Belém is `66`.
 */
export const PREFIXO_NAO_ATENDIDO = 69;

/** `carrinho.md` §8 — agendada is the padrão option plus this, same prazo. */
export const ADICIONAL_AGENDADA_CENTAVOS: Centavos = 10000;

/** The divisor in VTEX's cubed-weight rule: cm³ to kg. */
const DIVISOR_CUBAGEM = 6000;

// ---------------------------------------------------------------------------
// The two error classes — erros.md §5.2
//
// The CEP field produces both, and they are not the same event: one is the
// reader's typo, the other is the store's limit. Telling a reader that their
// correctly-typed CEP is "inválido" is the defect this split prevents.
// ---------------------------------------------------------------------------

/**
 * The **Corrigível** case, and the only one: wrong digit count. It belongs to
 * the field, upstream of every function in this file — which is why it is a
 * constant here rather than a return value. A `Corrigível` states the fix.
 */
export const CEP_CORRIGIVEL = {
  classe: "corrigivel",
  mensagem: "CEP tem 8 dígitos.",
} as const;

/**
 * The **Fato** case: a correctly-typed CEP the store does not reach. It states
 * the limit and offers the way on, per `erros.md` §5.2.
 */
export type NaoAtendida = {
  situacao: "nao-atendida";
  classe: "fato";
  cep: string;
  mensagem: string;
  saibaMais: string;
};

/**
 * The three outcomes of resolving a CEP, distinct in the type rather than three
 * shapes of one record — a caller that forgets the refusal will not compile.
 *
 * A **fixture** carries autofill; a **servido** CEP resolves its region and
 * autofills nothing, because the region is computable from the prefix and the
 * street is not, so the address fields open empty and editable. All three are
 * `Fato`-class: none of them is a mistake the reader made.
 */
export type CepResolvido =
  | { situacao: "fixture"; cep: string; regiao: RegiaoFrete; endereco: EnderecoFixture }
  | { situacao: "servido"; cep: string; regiao: RegiaoFrete }
  | NaoAtendida;

export type EnderecoFixture = {
  /** Absent where §4.2's fixture names a bairro rather than a logradouro. */
  logradouro?: string;
  bairro: string;
  cidade: string;
  uf: string;
};

/**
 * `dados.md` §4.2's fixture table, keyed by the bare eight digits. Every one is
 * a real address, so the autofill values are checkable.
 *
 * Six rows, not seven: §4.2's `69900-000` (Centro, Rio Branco, AC) is listed
 * there as *não atendida*, and `resolverCep` refuses on the prefix before
 * autofill is ever reached. An entry for it would be data that can never be
 * read, and would read as a promise the store does not make.
 */
const FIXTURES: Record<string, EnderecoFixture> = {
  "01310100": {
    logradouro: "Avenida Paulista",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    uf: "SP",
  },
  "13010000": { bairro: "Centro", cidade: "Campinas", uf: "SP" },
  "90010000": { bairro: "Centro Histórico", cidade: "Porto Alegre", uf: "RS" },
  "70040010": { bairro: "Asa Norte", cidade: "Brasília", uf: "DF" },
  "40010000": { bairro: "Comércio", cidade: "Salvador", uf: "BA" },
  "66010000": { bairro: "Campina", cidade: "Belém", uf: "PA" },
};

// ---------------------------------------------------------------------------
// CEP resolution
// ---------------------------------------------------------------------------

const digitos = (cep: string): string => cep.replace(/\D/g, "");

/** The field's own validation — the `Corrigível` in `CEP_CORRIGIVEL`. */
export const cepTemOitoDigitos = (entrada: string): boolean => digitos(entrada).length === 8;

/**
 * Malformed input never reaches the rules below: digit count is a field
 * validation, and a caller that skipped it broke the contract rather than found
 * an edge case. Throwing says so where guessing would quietly turn a typo into
 * a region.
 */
const normalizar = (cep: string): string => {
  const bruto = digitos(cep);
  if (bruto.length !== 8) {
    throw new Error(`CEP reaches the frete rule malformed — ${CEP_CORRIGIVEL.mensagem}: ${cep}`);
  }
  return bruto;
};

export const prefixoDoCep = (cep: string): number => Number(normalizar(cep).slice(0, 2));

export const regiaoDoPrefixo = (prefixo: number): RegiaoFrete | undefined =>
  tarifas.find((t) => t.prefixos.some(([de, ate]) => prefixo >= de && prefixo <= ate))?.regiao;

export const tarifaDaRegiao = (regiao: RegiaoFrete): Tarifa => {
  const encontrada = tarifas.find((t) => t.regiao === regiao);
  if (!encontrada) throw new Error(`região has no tarifa: ${regiao}`);
  return encontrada;
};

const recusa = (cep: string): NaoAtendida => ({
  situacao: "nao-atendida",
  classe: "fato",
  cep,
  mensagem: "Ainda não entregamos neste CEP.",
  saibaMais: "/politicas/entrega-e-frete",
});

export const resolverCep = (cep: string): CepResolvido => {
  const normalizado = normalizar(cep);
  const regiao = regiaoDoPrefixo(Number(normalizado.slice(0, 2)));
  if (!regiao) return recusa(normalizado);

  const endereco = FIXTURES[normalizado];
  return endereco
    ? { situacao: "fixture", cep: normalizado, regiao, endereco }
    : { situacao: "servido", cep: normalizado, regiao };
};

// ---------------------------------------------------------------------------
// The quote — carrinho.md §8
// ---------------------------------------------------------------------------

/**
 * One row of the options table.
 *
 * `produto.md` sketched this as `{ rotulo, centavos, prazoDiasUteis }`, and the
 * `centavos` is split out into a union here on purpose: free freight is written
 * **`Grátis`**, never `R$ 0,00`, in four specs. With a plain number the zero is
 * one careless formatter away from the screen; with this shape the figure does
 * not exist to be formatted, and a surface that reaches for it does not compile.
 */
export type OpcaoFrete = {
  modalidade: Modalidade;
  rotulo: string;
  prazoDiasUteis: number;
} & ({ gratis: true } | { gratis: false; centavos: Centavos });

const ROTULOS: Record<Modalidade, string> = {
  padrao: "Entrega padrão",
  agendada: "Entrega agendada",
};

/**
 * VTEX's rule — peso real ou cubado, vale o maior.
 *
 * **`volumes` is deliberately not a multiplier here, and the specs disagree
 * about that.** `carrinho.md` §8 writes the formula as
 * `max(pesoKg, pesoCubado) × embalagem.volumes`, and `dados.md` §8.4 restates
 * it — but both are written for an embalagem whose dimensions describe *one
 * box*, which is not the record this catálogue produces. §8.4's own escape
 * clause is that multi-volume pieces "divide the box dimensions across volumes,
 * so the totals stay right either way"; `embalagemDe` in `derivacoes.ts` does
 * not divide, and documents that it does not — its figures are the shipment as
 * a whole, `largura` being the piece's own width plus margin even at `volumes`
 * 3. Against those figures the multiplier double- and triple-counts, so the two
 * halves of §8.4 cannot both hold and the one that matches the stored record
 * wins.
 *
 * `dados.md` §4.3's worked figure agrees: it quotes the hero sofá — `volumes`
 * 2 — from the whole box with no volumes factor. If `embalagemDe` ever starts
 * dividing dimensions per volume, this multiplier comes back with it.
 */
export const pesoDeFrete = (embalagem: Embalagem): number =>
  Math.max(
    embalagem.pesoKg,
    (embalagem.largura * embalagem.profundidade * embalagem.altura) / DIVISOR_CUBAGEM,
  );

/** `custo = base + perKg × pesoFrete`, rounded to the nearest R$ 1,00. */
const custoPadrao = (tarifa: Tarifa, embalagem: Embalagem): Centavos =>
  Math.round((tarifa.baseCentavos + tarifa.porKgCentavos * pesoDeFrete(embalagem)) / 100) * 100;

/**
 * Which prefixes a `freteGratis` scope reaches. `sp-capital` is prefix-level
 * rather than region-level — the capital is `01`–`05`, while Sudeste capitais
 * also holds Rio and Belo Horizonte, which pay.
 */
const COBERTURA: Record<FreteGratis, (prefixo: number, regiao: RegiaoFrete) => boolean> = {
  nacional: () => true,
  sudeste: (_prefixo, regiao) => regiao === "sudeste-capitais" || regiao === "sudeste-interior",
  "sp-capital": (prefixo) => prefixo >= 1 && prefixo <= 5,
};

/**
 * The freight quote: a CEP, a box and a `freteGratis` scope in, options or a
 * stated refusal out.
 *
 * `freteGratis` zeroes the **padrão** option for the matching region only, and
 * it renders as the word `Grátis`. Agendada still charges its R$ 100,00
 * difference above the now-zero base — `checkout.md` §6.2.
 */
export const cotarFrete = (
  cep: string,
  embalagem: Embalagem,
  freteGratis?: FreteGratis,
): OpcaoFrete[] | NaoAtendida => {
  const resolvido = resolverCep(cep);
  if (resolvido.situacao === "nao-atendida") return resolvido;

  const tarifa = tarifaDaRegiao(resolvido.regiao);
  const { prazoDiasUteis } = tarifa;
  const coberto =
    freteGratis !== undefined &&
    COBERTURA[freteGratis](Number(resolvido.cep.slice(0, 2)), resolvido.regiao);

  // Agendada is priced from the base, not from the padrão option: reading it
  // back off `padrao` would mean re-deriving the figure the union deliberately
  // hides, and the zeroed case is exactly where that goes wrong.
  const base = coberto ? 0 : custoPadrao(tarifa, embalagem);

  return [
    coberto
      ? { modalidade: "padrao", rotulo: ROTULOS.padrao, prazoDiasUteis, gratis: true }
      : { modalidade: "padrao", rotulo: ROTULOS.padrao, prazoDiasUteis, gratis: false, centavos: base },
    {
      modalidade: "agendada",
      rotulo: ROTULOS.agendada,
      prazoDiasUteis,
      gratis: false,
      centavos: base + ADICIONAL_AGENDADA_CENTAVOS,
    },
  ];
};

/** Narrows the quote's two arms — the refusal is never an empty option list. */
export const eNaoAtendida = (
  resultado: OpcaoFrete[] | CepResolvido,
): resultado is NaoAtendida => !Array.isArray(resultado) && resultado.situacao === "nao-atendida";
