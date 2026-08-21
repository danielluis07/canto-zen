// The filter bar, the sort control and the pagination, as data.
//
// Every control in `catalogo.md` §3 and §7 is a **link** — each selection is a
// real navigation to a server-rendered URL. So the whole control surface is a
// list of hrefs computed on the server, and the client components below it hold
// exactly one thing: which panel is open.
//
// This file composes that list. It authors nothing: the labels come from the
// taxonomy tables, the price ranges from `consulta.ts`'s store constants, and
// the option sets from the route's own produtos.

import { ambientes, cores, materiais, type Produto } from "../catalogo";
import {
  alternarValor,
  consultaVazia,
  definirAmbiente,
  definirOrdem,
  definirPagina,
  definirPreco,
  faixaDePreco,
  faixasDePreco,
  href,
  paginar,
  selecionar,
  temFiltro,
  type Consulta,
  type Ordem,
  type Pagina,
  type Suporte,
} from "./consulta";

export type ChaveDeFaceta = "cor" | "material" | "preco" | "ambiente";

export type OpcaoDisponivel = {
  slug: string;
  label: string;
  /** Cor only — the 12px square of `cor.amostra`, which is product data. */
  amostra?: string;
};

export type FacetaDisponivel = {
  chave: ChaveDeFaceta;
  rotulo: string;
  multipla: boolean;
  opcoes: OpcaoDisponivel[];
};

export type Opcao = OpcaoDisponivel & { href: string; marcado: boolean };

export type Faceta = Omit<FacetaDisponivel, "opcoes"> & {
  /** `COR · CRU, CARVÃO` — the applied state lives in the trigger (§3). */
  estado: string;
  aplicada: boolean;
  opcoes: Opcao[];
};

export type Ordenacao = { rotulo: string; estado: string; opcoes: Opcao[] };

export type Paginacao = {
  anterior: string | null;
  proxima: string | null;
  paginas: { numero: number; href: string; atual: boolean }[];
};

export type Controles = {
  facetas: Faceta[];
  ordenacao: Ordenacao;
  /** `null` until some facet is applied — §3 shows `LIMPAR` only then. */
  limparHref: string | null;
  pagina: Pagina;
  /** The full result count. The régua states this, never the cards on screen. */
  total: number;
  /** `null` where everything fits on one page — no control renders at all. */
  paginacao: Paginacao | null;
};

const ROTULOS: Record<ChaveDeFaceta, string> = {
  cor: "COR",
  material: "MATERIAL",
  preco: "PREÇO",
  ambiente: "AMBIENTE",
};

const ORDENS: { slug: Ordem; label: string }[] = [
  { slug: "curadoria", label: "Curadoria" },
  { slug: "menor-preco", label: "Menor preço" },
  { slug: "maior-preco", label: "Maior preço" },
];

/**
 * `COR · CRU, CARVÃO`, and `COR · 3 SELECIONADAS` from three values up.
 *
 * A row of removable chips under a bar of triggers states the same fact twice,
 * and a chip-with-`×` is a rounded shape in a zero-radius system — so the
 * trigger carries its own state and there is nothing beneath the bar (§3).
 */
export const rotuloAplicado = (rotulo: string, valores: string[]): string => {
  if (valores.length === 0) return rotulo;
  if (valores.length >= 3) return `${rotulo} · ${valores.length} SELECIONADAS`;
  return `${rotulo} · ${valores.map((valor) => valor.toUpperCase()).join(", ")}`;
};

/**
 * What a surface can offer, given the produtos it lists.
 *
 * **Cor and material are read from the route's own set**, in taxonomy order: a
 * colour no piece in this room carries is an option whose only possible result
 * is zero, and offering it is a worse failure than the zero-results surface it
 * leads to. The set is the route's *unfiltered* one, so the panel does not
 * shift under the reader as they select.
 *
 * **The price ranges are not**, because §3 fixes them as store constants
 * precisely so that the same URL means the same thing on every route.
 */
export const facetasDoConjunto = (conjunto: Produto[], suporte: Suporte): FacetaDisponivel[] => {
  const coresPresentes = new Set(conjunto.map((produto) => produto.cor));
  const materiaisPresentes = new Set(conjunto.flatMap((produto) => produto.materiais));
  const ambientesPresentes = new Set(conjunto.flatMap((produto) => produto.ambientes));

  const facetas: FacetaDisponivel[] = [
    {
      chave: "cor",
      rotulo: ROTULOS.cor,
      multipla: true,
      opcoes: cores
        .filter((cor) => coresPresentes.has(cor.slug))
        .map((cor) => ({ slug: cor.slug, label: cor.label, amostra: cor.amostra })),
    },
    {
      chave: "material",
      rotulo: ROTULOS.material,
      multipla: true,
      opcoes: materiais
        .filter((material) => materiaisPresentes.has(material.slug))
        .map((material) => ({ slug: material.slug, label: material.label })),
    },
    {
      chave: "preco",
      rotulo: ROTULOS.preco,
      multipla: false,
      opcoes: faixasDePreco.map((faixa) => ({ slug: faixa.slug, label: faixa.label })),
    },
  ];

  if (suporte.ambiente) {
    facetas.push({
      chave: "ambiente",
      rotulo: ROTULOS.ambiente,
      multipla: false,
      opcoes: ambientes
        .filter((ambiente) => ambientesPresentes.has(ambiente.slug))
        .map((ambiente) => ({ slug: ambiente.slug, label: ambiente.label })),
    });
  }

  return facetas;
};

type Entrada = {
  /** The route's own path, with no query — what `LIMPAR` points at. */
  caminho: string;
  /** Everything the route lists, before any filter. */
  conjunto: Produto[];
  consulta: Consulta;
  suporte: Suporte;
};

/** Everything the listing's controls render, for one route and one query. */
export const controlesDaListagem = ({
  caminho,
  conjunto,
  consulta,
  suporte,
}: Entrada): Controles => {
  const resultado = selecionar(conjunto, consulta);
  const pagina = paginar(resultado, consulta.pagina);
  const ligar = (proxima: Consulta) => href(caminho, proxima);

  const facetas = facetasDoConjunto(conjunto, suporte).map((faceta): Faceta => {
    const selecionados = valoresSelecionados(faceta, consulta);

    return {
      ...faceta,
      aplicada: selecionados.length > 0,
      estado: rotuloAplicado(
        faceta.rotulo,
        selecionados.map(
          (slug) => faceta.opcoes.find((opcao) => opcao.slug === slug)?.label ?? slug,
        ),
      ),
      opcoes: faceta.opcoes.map((opcao) => ({
        ...opcao,
        marcado: selecionados.includes(opcao.slug),
        href: ligar(comValor(consulta, faceta.chave, opcao.slug)),
      })),
    };
  });

  return {
    facetas,
    ordenacao: {
      rotulo: "ORDENAR",
      estado: rotuloAplicado(
        "ORDENAR",
        consulta.ordem === "curadoria"
          ? []
          : [ORDENS.find((entrada) => entrada.slug === consulta.ordem)!.label],
      ),
      opcoes: ORDENS.map((entrada) => ({
        slug: entrada.slug,
        label: entrada.label,
        marcado: consulta.ordem === entrada.slug,
        href: ligar(definirOrdem(consulta, entrada.slug)),
      })),
    },
    // LIMPAR takes the sort and the page with it: the control says *limpar*,
    // and a URL that still carries `?ordem=` is not clean (§3).
    limparHref: temFiltro(consulta) ? ligar(consultaVazia()) : null,
    pagina,
    total: pagina.total,
    paginacao: paginacaoDe(ligar, consulta, pagina),
  };
};

const valoresSelecionados = (faceta: FacetaDisponivel, consulta: Consulta): string[] => {
  switch (faceta.chave) {
    case "cor":
      return consulta.cor;
    case "material":
      return consulta.material;
    case "preco":
      return consulta.preco === null ? [] : [consulta.preco];
    case "ambiente":
      return consulta.ambiente === null ? [] : [consulta.ambiente];
  }
};

/**
 * A marked value links to its own removal, which is what makes the panel a set
 * of links rather than a form: there is no separate `×`, and no state that is
 * only reachable by pressing a control twice.
 */
const comValor = (consulta: Consulta, chave: ChaveDeFaceta, slug: string): Consulta => {
  switch (chave) {
    case "cor":
    case "material":
      return alternarValor(consulta, chave, slug);
    case "preco":
      return definirPreco(consulta, slug);
    case "ambiente":
      return definirAmbiente(consulta, slug);
  }
};

/**
 * `← 1 2 3 →`, and **nothing at all on a single page** — a control offering one
 * destination that is already here. Disabled ends do not render (§7).
 */
const paginacaoDe = (
  ligar: (consulta: Consulta) => string,
  consulta: Consulta,
  pagina: Pagina,
): Paginacao | null => {
  if (pagina.paginas <= 1) return null;

  return {
    anterior: pagina.pagina > 1 ? ligar(definirPagina(consulta, pagina.pagina - 1)) : null,
    proxima: pagina.pagina < pagina.paginas ? ligar(definirPagina(consulta, pagina.pagina + 1)) : null,
    paginas: Array.from({ length: pagina.paginas }, (_, indice) => {
      const numero = indice + 1;
      return {
        numero,
        href: ligar(definirPagina(consulta, numero)),
        atual: numero === pagina.pagina,
      };
    }),
  };
};

/**
 * One page of a set whose **order is already decided** — `/colecoes/[slug]`.
 *
 * It is `controlesDaListagem` minus the controls, and the subtraction is the
 * point: `catalogo.md` §9 gives the coleção neither the tipo band nor the
 * filter and sort bar, because `Colecao.produtos` is an ordered list whose
 * sequence is the editorial act. So nothing here filters and nothing here
 * sorts — the conjunto is sliced exactly as it arrived.
 *
 * Pagination survives, because §9 says a coleção over twelve pieces paginates
 * like any other. It reads `pagina` and nothing else: every other key is one
 * this surface does not support, and an unsupported key is ignored rather than
 * an error (`rotas.md`).
 */
export const paginarNaOrdemAutorada = ({
  caminho,
  conjunto,
  pagina,
}: {
  caminho: string;
  conjunto: Produto[];
  pagina: number;
}): { pagina: Pagina; total: number; paginacao: Paginacao | null } => {
  const consulta = { ...consultaVazia(), pagina };
  const fatia = paginar(conjunto, pagina);
  return {
    pagina: fatia,
    total: fatia.total,
    paginacao: paginacaoDe((proxima) => href(caminho, proxima), consulta, fatia),
  };
};

/** The zero-results copy — `catalogo.md` §8, verbatim and not paraphrased. */
export const SEM_RESULTADOS = "Nenhuma peça com esses filtros.";
export const LIMPAR_FILTROS = "LIMPAR FILTROS";

/** `consultaVazia` re-exported for the surfaces that render an unfiltered set. */
export { consultaVazia, faixaDePreco };
