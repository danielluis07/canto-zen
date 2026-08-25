// The home's reasoning, kept out of the components.
//
// `home.md` gives the page seven sections and three budgets, and every one of
// its slots is **authored**: `ConteudoHome` holds one produto slug, three more,
// one coleção, three articles and the marcenaria block, and the home derives no
// selection of its own (§8). What *is* derived is every line those slots put on
// screen — the designer through the família, the à-vista price, the Pix figure,
// the coleção's `{n} PEÇAS`, the tipos each ambiente names — and that is what
// this file composes, once, so the components only place it.
//
// The split is the one `lib/listagem/conteudo.ts` and `lib/produto/conteudo.ts`
// already make for their surfaces. Where a line already exists there it is
// imported rather than re-written: the hero's subtitle and the strip's
// parcelamento are the PDP's own lines at another size, and two spellings of
// one fact is exactly the drift the module boundary exists to prevent.

import {
  ambiente,
  ambientes,
  artigo,
  colecao,
  conteudoHome,
  politicas,
  produto,
  proporcaoDoPrincipal,
  tipo,
  todosOsProdutos,
  type Figura,
  type Imagem,
  type Produto,
  type Proporcao,
} from "../catalogo";
import { disponibilidadeEmTexto, rotuloDaContagem } from "../listagem/conteudo";
import {
  assinatura,
  cotasDoPrincipal,
  distintivoDePix,
  parcelamentoDaPagina,
  precoAVistaEmTexto,
} from "../produto/conteudo";

// ---------------------------------------------------------------------------
// §1 — the hero
// ---------------------------------------------------------------------------
// §0.5 — the Abertura
// ---------------------------------------------------------------------------

/**
 * The Abertura is **authored, not derived** — the one slot on this page that
 * reads nothing from the catalogue.
 *
 * Everything else here composes lines out of `lib/catalogo`, because everything
 * else states a fact about a piece and two spellings of one fact is the drift
 * the module boundary exists to prevent. The Abertura states a fact about the
 * *store*, and there is no record it could read: `Loja` (`institucional.md`)
 * holds identification, not position. So it is three constants, and they live
 * here rather than in the component for the same reason every other line does.
 *
 * No eyebrow. `PEÇA EM DESTAQUE` belongs to the section directly below it, and
 * an annotation line above the Mincho would put two voices in the one section
 * whose argument is quiet.
 */
export const LINHA_ABERTURA = "Móveis assinados, feitos sob encomenda";
export const CTA_ABERTURA = "VER TODAS AS PEÇAS";

/**
 * `imagens.md` §5.2 — authored `alt`, not templated: no entity backs this image,
 * so no template can spell it. It describes the room, because that is what a
 * reader who cannot see it needs; it does not describe the brand.
 */
export const IMAGEM_ABERTURA = {
  src: "/images/hero.webp",
  alt: "Sala de estar com sofá em linho, poltronas de couro trançado e banco de madeira maciça",
} as const;

// ---------------------------------------------------------------------------

export const EYEBROW_DESTAQUE = "PEÇA EM DESTAQUE";
export const CTA_DESTAQUE = "VER A PEÇA";

export type DestaqueDaHome = {
  imagem: Imagem;
  proporcao: Proporcao;
  nome: string;
  /** `LINHO CRU · POR MARINA AOKI` — the designer read through the família. */
  assinatura: string;
  preco: string;
  pix: string;
  parcelamento: string | null;
  /** `L 210 CM` — the page's first régua, and the only cota the hero shows. */
  cota: string;
  href: string;
};

/**
 * The hero, or **nothing at all**.
 *
 * `home.md` §1 states three constraints on the slot and makes the first of them
 * fatal: the piece's `principal` must declare `cotas: ['largura']`, *otherwise
 * the hero does not render*, because an empty régua is prohibited
 * (`marca.md` §2). So this returns `null` rather than a hero without its rule —
 * there is no fallback, and a hero drawn without the cota would teach the wrong
 * gesture on the one page that teaches it.
 *
 * The invariant suite asserts the catalogue never reaches either `null`
 * (`tests/catalogo-invariantes.test.ts`), which is what makes this a
 * prohibition made checkable rather than a runtime branch anybody relies on.
 *
 * The **vertical cota is suppressed** even where one is declared: it would live
 * outside the image on the right, which is where the text column begins.
 */
export const destaqueDaPeca = (peca: Produto): DestaqueDaHome | null => {
  if (peca.disponibilidade === "esgotado") return null;

  const imagem = peca.imagens[0];
  if (!imagem) return null;

  const largura = cotasDoPrincipal(peca).find((cota) => cota.eixo === "largura");
  if (!largura) return null;

  return {
    imagem,
    proporcao: proporcaoDoPrincipal(peca.medidas),
    nome: peca.nome,
    assinatura: assinatura(peca),
    preco: precoAVistaEmTexto(peca),
    pix: distintivoDePix(),
    parcelamento: parcelamentoDaPagina(peca),
    cota: largura.rotulo,
    href: `/produtos/${peca.slug}`,
  };
};

export const destaqueDaHome = (): DestaqueDaHome | null =>
  destaqueDaPeca(exigirProduto(conteudoHome.destaqueHome, "conteudoHome.destaqueHome"));

// ---------------------------------------------------------------------------
// §2 — the ambientes
// ---------------------------------------------------------------------------

export const EYEBROW_AMBIENTES = "AMBIENTES";

export type CampoDeAmbiente = {
  slug: string;
  /** Annotation voice, so the label arrives cased — as the tipo band's does. */
  label: string;
  /** `SOFÁS · POLTRONAS · MESAS DE CENTRO` — the first three, not all of them. */
  tipos: string;
  imagem: Figura;
  href: string;
};

/**
 * The four rooms in the order `ambientes[]` authors — composition decides which
 * one takes the seven columns, never the alphabet and never the catalogue.
 *
 * The three tipos mirror the navbar panel and are read from the same curated
 * table, so a tipo the store does not expose cannot appear here. They are
 * **not** links: the whole field is one link to `/[ambiente]`, which is what
 * keeps the section a choice rather than a menu.
 */
export const camposDeAmbientes = (): CampoDeAmbiente[] =>
  ambientes.map((amb) => ({
    slug: amb.slug,
    label: amb.label.toUpperCase(),
    tipos: amb.tipos
      .slice(0, 3)
      .map((slug) => exigirTipo(slug).label)
      .join(" · ")
      .toUpperCase(),
    imagem: amb.imagem,
    href: `/${amb.slug}`,
  }));

// ---------------------------------------------------------------------------
// §3 — the featured strip
// ---------------------------------------------------------------------------

export const EYEBROW_DESTAQUES = "PEÇAS EM DESTAQUE";

export type CartaoEmDestaque = {
  slug: string;
  imagem: Imagem;
  proporcao: Proporcao;
  nome: string;
  acabamento: string;
  disponibilidade: string;
  /** Body with tabular figures — the Price role stays with the hero and the PDP. */
  preco: string;
  parcelamento: string | null;
  href: string;
};

/**
 * Three pieces, not six, and authored rather than derived: a concept store has
 * no honest "new" and no sales data, and `produto.md` refused numeric stock
 * precisely so as not to fabricate signal.
 *
 * The card carries a parcelamento the listing card deliberately refuses. Twelve
 * cards × two price lines is a price table (`catalogo.md` §7); three is the
 * strip proving the prices exist and are honest, which is the whole reason §3
 * is on the page.
 */
export const pecasEmDestaque = (): CartaoEmDestaque[] =>
  conteudoHome.destaques.map((slug) => {
    const peca = exigirProduto(slug, "conteudoHome.destaques");
    const imagem = peca.imagens[0];
    if (!imagem) throw new Error(`produto em destaque carries no principal: ${slug}`);

    return {
      slug: peca.slug,
      imagem,
      proporcao: proporcaoDoPrincipal(peca.medidas),
      nome: peca.nome,
      acabamento: peca.acabamento.toUpperCase(),
      disponibilidade: disponibilidadeEmTexto(peca),
      preco: precoAVistaEmTexto(peca),
      parcelamento: parcelamentoDaPagina(peca),
      href: `/produtos/${peca.slug}`,
    };
  });

/**
 * The strip's one índigo — the Pix policy stated **once**, for every piece,
 * instead of a badge per card. Three badged cards would be three occurrences of
 * índigo on one screen, and `marca.md` §3 is explicit that two of them would be
 * wrong. The figure comes from `politicas`, never hand-written.
 */
export const linhaDePixDaHome = (): string =>
  `${politicas.descontoPixPercent}% À VISTA NO PIX EM TODAS AS PEÇAS`;

// ---------------------------------------------------------------------------
// §4 — the featured coleção
// ---------------------------------------------------------------------------

export const EYEBROW_COLECAO = "COLEÇÃO";
export const CTA_COLECAO = "VER A COLEÇÃO";

export type ColecaoEmDestaque = {
  nome: string;
  descricao: string;
  imagem: Figura;
  /** `6 PEÇAS`, counted — never an authored figure that could diverge. */
  regua: string | null;
  href: string;
};

/**
 * The obligation `rotas.md` created when it refused a `/colecoes` index: a
 * coleção is a merchandising device surfaced *in context*, and this block is
 * that context. It sells the curated sequence and therefore states **no
 * price** — a price here would force choosing which piece, which is exactly the
 * decision the coleção defers to its listing.
 */
export const colecaoEmDestaque = (): ColecaoEmDestaque => {
  const encontrada = colecao(conteudoHome.colecaoDestaque);
  if (!encontrada) {
    throw new Error(`conteudoHome.colecaoDestaque names no coleção: ${conteudoHome.colecaoDestaque}`);
  }

  return {
    nome: encontrada.nome,
    descricao: encontrada.descricao,
    imagem: encontrada.imagem,
    regua: rotuloDaContagem(encontrada.produtos.length),
    href: `/colecoes/${encontrada.slug}`,
  };
};

// ---------------------------------------------------------------------------
// §5 — the service band
// ---------------------------------------------------------------------------

export type CampoDeServico = {
  rotulo: string;
  linha: string;
  /** `null` on PRAZO, which has no page — and inventing one would be worse. */
  href: string | null;
};

/**
 * What replaces the band of badges and testimonials Brazilian commerce puts
 * here and this store has none of honestly: service. Someone buying a sofá
 * costing thousands of reais decides about delivery and montagem before
 * deciding about taste.
 *
 * Frete and montagem point at the same policy because `rotas.md` decided
 * *Entrega e frete* absorbs the montagem detail instead of generating a page of
 * its own. The arrependimento line here is the **short** version; the full
 * conspicuous prose is the footer's legal block and
 * `/politicas/trocas-e-devolucoes`.
 */
export const CAMPOS_DE_SERVICO: CampoDeServico[] = [
  {
    rotulo: "FRETE",
    linha: "Calculado por CEP na página da peça.",
    href: "/politicas/entrega-e-frete",
  },
  {
    rotulo: "MONTAGEM",
    linha: "Opcional, feita no dia da entrega.",
    href: "/politicas/entrega-e-frete",
  },
  {
    rotulo: "PRAZO",
    linha: "Em dias úteis, contado após a confirmação do pagamento.",
    href: null,
  },
  {
    rotulo: "ARREPENDIMENTO",
    linha:
      "7 dias para desistir, contados do recebimento — ou da montagem, quando contratada.",
    href: "/politicas/trocas-e-devolucoes",
  },
];

// ---------------------------------------------------------------------------
// §6 — Inspirações
// ---------------------------------------------------------------------------

export const EYEBROW_INSPIRACOES = "INSPIRAÇÕES";
export const CTA_INSPIRACOES = "VER TODAS AS INSPIRAÇÕES";

export type LinhaDeInspiracao = {
  slug: string;
  /** Annotation — `Artigo.ambiente` came back required, so every row has one. */
  ambiente: string;
  titulo: string;
  resumo: string;
  thumb: Figura;
  href: string;
};

/**
 * Three of the four articles as rows, not cards: a strip of cards would repeat
 * §3's rhythm `7rem` away, and two large articles would compete with §4. The
 * fourth is reached through `VER TODAS AS INSPIRAÇÕES`, which therefore leads
 * to something the home has not already shown.
 */
export const linhasDeInspiracao = (): LinhaDeInspiracao[] =>
  conteudoHome.inspiracoes.map((slug) => {
    const encontrado = artigo(slug);
    if (!encontrado) throw new Error(`conteudoHome.inspiracoes names no artigo: ${slug}`);

    return {
      slug: encontrado.slug,
      ambiente: exigirAmbiente(encontrado.ambiente).label.toUpperCase(),
      titulo: encontrado.titulo,
      resumo: encontrado.resumo,
      thumb: encontrado.thumb,
      href: `/inspiracoes/${encontrado.slug}`,
    };
  });

// ---------------------------------------------------------------------------
// §7 — the marcenaria
// ---------------------------------------------------------------------------

export const CTA_MARCENARIA = "SOBRE O ATELIÊ";

/**
 * The page's closing, and the claim that justifies the prices §3 showed: an
 * in-house marcenaria, made-to-order production and a named designer. Authored
 * whole — the feature line, at most three sentences of body, and a photograph
 * of an unfinished piece, alone.
 */
export const marcenariaDaHome = () => conteudoHome.marcenaria;

// ---------------------------------------------------------------------------
// Metadata — rotas.md §§1–2
// ---------------------------------------------------------------------------

/**
 * Derived over the catalogue, so the figure cannot go stale. **There is no
 * title here on purpose**: `rotas.md` §1 leaves the home unsuffixed, and the
 * root layout's `title.default` is already the bare wordmark — stating one on
 * this route would run it through the template and print the brand twice.
 */
export const descricaoDaHome = (): string =>
  `Móveis assinados, feitos sob encomenda na nossa marcenaria. ${
    todosOsProdutos().length
  } peças para sala, quarto, cozinha e escritório.`;

// ---------------------------------------------------------------------------

const exigirProduto = (slug: string, origem: string): Produto => {
  const encontrado = produto(slug);
  if (!encontrado) throw new Error(`${origem} points at no produto: ${slug}`);
  return encontrado;
};

const exigirTipo = (slug: string) => {
  const encontrado = tipo(slug);
  if (!encontrado) throw new Error(`no such tipo: ${slug}`);
  return encontrado;
};

const exigirAmbiente = (slug: string) => {
  const encontrado = ambiente(slug);
  if (!encontrado) throw new Error(`no such ambiente: ${slug}`);
  return encontrado;
};
