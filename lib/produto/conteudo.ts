// The produto page's reasoning, kept out of the components.
//
// `pagina-produto.md` turns one record into a breadcrumb, a buy box, a spec
// sheet and a closing, and every line of it is either read from the record or
// derived from `politicas` — nothing on that page is authored per produto except
// `descricao` itself. So the composition lives here, once, and the components
// only place it: the same split `lib/listagem/conteudo.ts` makes for the four
// listing surfaces.
//
// The CEP block (`pagina-produto.md` §2.7) is the one part of the page that
// answers a reader rather than a record, so it lives in `cep.ts` beside this
// file: same split, one file per species of reasoning.

import {
  ambiente,
  colecao,
  cor,
  familia,
  garantiaMeses,
  linhaDeParcelamento,
  material,
  politicas,
  precoAVista,
  precoMontagem,
  reais,
  tipo,
  todosOsProdutos,
  type Embalagem,
  type Medidas,
  type Produto,
} from "../catalogo";
import { parcelamentoEmTexto, type Metadados } from "../listagem/conteudo";

// ---------------------------------------------------------------------------
// §1 — the breadcrumb
// ---------------------------------------------------------------------------

export type ItemDaTrilha = { rotulo: string; href: string | null };

/**
 * `INÍCIO / SALA / POLTRONAS / POLTRONA LINA`.
 *
 * The room is `ambientePrincipal` and never the path the reader took: the
 * product URL is flat (`rotas.md`), so the trail is what reconstructs it, and it
 * has to be identical for a reader who arrived from Quarto and for a crawler
 * that arrived from nowhere.
 *
 * The tipo segment uses `Tipo.label`, the plural — it points at the
 * `/sala/poltronas` listing, so it names the route and not the piece. **The
 * current item is not a link**, which is what `href: null` states.
 */
export const trilha = (produto: Produto): ItemDaTrilha[] => {
  const amb = exigirAmbiente(produto.ambientePrincipal);
  const tip = exigirTipo(produto.tipo);

  return [
    { rotulo: "INÍCIO", href: "/" },
    { rotulo: amb.label.toUpperCase(), href: `/${amb.slug}` },
    { rotulo: tip.label.toUpperCase(), href: `/${amb.slug}/${tip.slug}` },
    { rotulo: produto.nome.toUpperCase(), href: null },
  ];
};

// ---------------------------------------------------------------------------
// §§2.2–2.3 — the buy box's opening
// ---------------------------------------------------------------------------

/**
 * `LINHO CRU · POR MARINA AOKI` — the annotation line under the one Mincho line
 * on the page. The designer comes from the família, because authorship belongs
 * to the piece and not to the acabamento (`pagina-produto.md` §10).
 */
export const assinatura = (produto: Produto): string =>
  `${produto.acabamento} · POR ${exigirFamilia(produto.familia).designer}`.toUpperCase();

/** The à-vista figure, in the Price role. Derived, never the table price. */
export const precoAVistaEmTexto = (produto: Produto): string =>
  reais(precoAVista(produto.precoTabela));

/** `10% À VISTA NO PIX` — the disclosure Lei 13.455 requires, and one índigo. */
export const distintivoDePix = (): string =>
  `${politicas.descontoPixPercent}% À VISTA NO PIX`;

/**
 * `ou {total} em {N}x de {v} sem juros`, against the **table** price — the
 * parcelado figure is what the à-vista discount is a discount from.
 *
 * `null` where the policy affords no second parcela: `ou R$ 150,00 em 1x de
 * R$ 150,00 sem juros` states a split that is not a split. The buy box then
 * carries the à-vista figure alone, which is still a complete price.
 */
export const parcelamentoDaPagina = (produto: Produto): string | null => {
  const { parcelas } = linhaDeParcelamento(produto.precoTabela);
  if (parcelas < 2) return null;
  return `ou ${reais(produto.precoTabela)} em ${parcelamentoEmTexto(produto)}`;
};

/** `precoDe` when the piece carries one — struck through, no colour, no badge. */
export const precoAnteriorEmTexto = (produto: Produto): string | null =>
  produto.precoDe === undefined ? null : reais(produto.precoDe);

// ---------------------------------------------------------------------------
// §2.4 — outros acabamentos
// ---------------------------------------------------------------------------

export type AcabamentoIrmao = {
  slug: string;
  label: string;
  href: string;
  /** `Cor.amostra` — product colour, admitted as data and not as brand colour. */
  amostra: string;
  atual: boolean;
  esgotado: boolean;
};

/**
 * The família's acabamentos, the current one included, in curatorial order.
 *
 * This is the only mechanism by which a Família is reachable, since it has no
 * page. An `esgotado` sibling stays listed — nothing disappears, exactly as in
 * the grid — and a família with a single acabamento returns `[]`, because a
 * block offering one choice states a choice that does not exist.
 */
export const acabamentosDaFamilia = (produto: Produto): AcabamentoIrmao[] => {
  const irmaos = todosOsProdutos().filter((p) => p.familia === produto.familia);
  if (irmaos.length < 2) return [];

  return irmaos.map((irmao) => ({
    slug: irmao.slug,
    label: irmao.acabamento,
    href: `/produtos/${irmao.slug}`,
    amostra: exigirCor(irmao.cor).amostra,
    atual: irmao.slug === produto.slug,
    esgotado: irmao.disponibilidade === "esgotado",
  }));
};

// ---------------------------------------------------------------------------
// §2.6 — the CTA's states
// ---------------------------------------------------------------------------

export const CTA_COMPRAR = "COMPRAR";
export const CTA_ADICIONADO = "ADICIONADO AO CARRINHO";
export const CTA_VER_CARRINHO = "VER CARRINHO →";
export const CTA_ESGOTADO = "ESGOTADO";

/**
 * The one link an `esgotado` buy box offers in place of the CTA, or `null`.
 *
 * There is deliberately **no "avise-me quando chegar"**: it captures an e-mail
 * against a backend that does not exist. The honest promise is the footer's
 * `AVISO DE NOVAS PEÇAS`, and this link only appears when the família actually
 * holds a piece the reader can buy today.
 */
export const irmaoDisponivel = (produto: Produto): { rotulo: string; href: string } | null => {
  const disponivel = todosOsProdutos().find(
    (p) =>
      p.familia === produto.familia &&
      p.slug !== produto.slug &&
      p.disponibilidade !== "esgotado",
  );
  if (!disponivel) return null;

  return {
    rotulo: `VER ${disponivel.nome} EM ${disponivel.acabamento}`.toUpperCase(),
    href: `/produtos/${disponivel.slug}`,
  };
};

// ---------------------------------------------------------------------------
// §2.8 — montagem
// ---------------------------------------------------------------------------

export type BlocoDeMontagem = {
  rotulo: string;
  preco: string;
  /** `nivel · pessoas · peças · minutos` — the four facts, here and nowhere else. */
  fatos: string;
  nota: string;
};

const NIVEL_EM_TEXTO = { simples: "SIMPLES", media: "MÉDIA", complexa: "COMPLEXA" } as const;

/**
 * The add-on, or `null` for a piece that needs no assembly.
 *
 * The price is derived from `nivel`, which is exactly why the four facts sit
 * beside it: the complexity stays provably consistent with the figure above it,
 * and a hand-authored number would not. They are stated **here and only here** —
 * the cart shows the price alone (`carrinho.md` §4.3).
 */
export const montagemDaPagina = (produto: Produto): BlocoDeMontagem | null => {
  const { necessaria, nivel, pessoas, pecas, tempoMinutos } = produto.montagem;
  if (!necessaria) return null;

  return {
    rotulo: "Contratar montagem",
    preco: `+ ${reais(precoMontagem(nivel))}`,
    fatos: [
      NIVEL_EM_TEXTO[nivel],
      `${pessoas} ${pessoas === 1 ? "PESSOA" : "PESSOAS"}`,
      `${pecas} ${pecas === 1 ? "PEÇA" : "PEÇAS"}`,
      `${tempoMinutos} MIN`,
    ].join(" · "),
    nota: "NO MESMO DIA DA ENTREGA AGENDADA.",
  };
};

// ---------------------------------------------------------------------------
// §4 — medidas
// ---------------------------------------------------------------------------

/** `L 78 × P 82 × A 74 cm`. Always this order, always a multiplication `×`. */
export const trioDeMedidas = ({ largura, profundidade, altura }: Medidas): string =>
  `L ${largura} × P ${profundidade} × A ${altura} cm`;

export type LinhaDeMedida = { rotulo: string; valor: string };

/**
 * `medidasExtras` as hairline rows. The list is open by design — a sofá's
 * *altura do assento* and a luminária's *alcance* cannot share a schema — and
 * **empty is a supported state**, not a section that fails to render: five tipos
 * carry no extras at all.
 */
export const linhasDeMedidasExtras = (produto: Produto): LinhaDeMedida[] =>
  produto.medidasExtras.map(({ rotulo, valor, unidade }) => ({
    rotulo: rotulo.toUpperCase(),
    valor: `${valor} ${unidade}`,
  }));

/** `1 volume · L 86 × P 90 × A 80 cm · 24 kg` — the box, never the piece. */
export const embalagemEmTexto = ({ embalagem }: { embalagem: Embalagem }): string =>
  [
    `${embalagem.volumes} ${embalagem.volumes === 1 ? "volume" : "volumes"}`,
    trioDeMedidas(embalagem),
    `${embalagem.pesoKg} kg`,
  ].join(" · ");

// ---------------------------------------------------------------------------
// §5 — ficha técnica
// ---------------------------------------------------------------------------

/**
 * The union of the piece's materials' care lines.
 *
 * **Never authored per produto.** Care is a property of the linho and the
 * carvalho, not of this armchair; a piece with two materials yields two lines
 * automatically, and no produto can be born without care copy — which is the
 * whole reason `Material.cuidados` exists.
 */
export const cuidados = (produto: Produto): string[] => [
  ...new Set(produto.materiais.map((slug) => exigirMaterial(slug).cuidados)),
];

export type LinhaDaFicha = { rotulo: string; valores: string[] };

/**
 * Everything qualitative. The split from §4 is by **species of fact**: a figure
 * goes to Medidas, an attribute comes here — which is why `itensInclusos` is on
 * this side and `medidasExtras` is not.
 */
export const fichaTecnica = (produto: Produto): LinhaDaFicha[] => [
  { rotulo: "MATERIAIS", valores: [produto.materiais.map((s) => exigirMaterial(s).label).join(", ")] },
  { rotulo: "COR", valores: [exigirCor(produto.cor).label] },
  { rotulo: "ACABAMENTO", valores: [produto.acabamento] },
  { rotulo: "CUIDADOS", valores: cuidados(produto) },
  { rotulo: "GARANTIA", valores: [`${garantiaMeses(produto)} meses`] },
  { rotulo: "ITENS INCLUSOS", valores: produto.itensInclusos },
];

// ---------------------------------------------------------------------------
// §6 — delivery and access
// ---------------------------------------------------------------------------

/**
 * Four short paragraphs of prose, derived from policy and from the piece's
 * data — nothing authored per produto. Prose rather than a table because the
 * access warning is a caution and a table row would bury it.
 *
 * Paragraph 1 keeps the **two clocks apart**: the delivery prazo is counted in
 * dias úteis after payment confirmation, and a sob-encomenda piece's production
 * window precedes dispatch and is stated as its own sentence.
 */
export const entregaEAcesso = (produto: Produto): string[] => {
  const producao =
    produto.disponibilidade === "sob-encomenda"
      ? ` Esta peça é feita sob encomenda: a produção leva ${produto.prazoProducaoSemanas} semanas e acontece antes do envio, contada à parte do prazo de entrega.`
      : "";

  return [
    `O prazo de entrega depende do CEP e é contado em dias úteis, a partir da confirmação do pagamento. Peças volumosas são entregues com data e janela agendadas.${producao}`,

    `Confira as medidas da embalagem — ${embalagemEmTexto(produto)} — contra a porta, o corredor e o elevador. Se a embalagem não couber no elevador, a entrega sobe por escada até o 3º andar; acima disso ela não é realizada.`,

    produto.montagem.necessaria
      ? "A montagem, quando contratada, acontece no mesmo dia da entrega agendada, e não em uma visita separada."
      : "Esta peça não precisa de montagem: chega montada e não acompanha manual nem ferramenta.",

    produto.montagem.necessaria
      ? "O arrependimento é de sete dias corridos, contados do recebimento — ou da data da montagem, quando ela for contratada."
      : "O arrependimento é de sete dias corridos, contados do recebimento.",
  ];
};

// ---------------------------------------------------------------------------
// §7 — the closing
// ---------------------------------------------------------------------------

export type Fechamento =
  | { tipo: "colecao"; titulo: string; produtos: Produto[] }
  | { tipo: "ligacao"; rotulo: string; href: string };

/**
 * The coleção's other pieces, or one link back to a real listing.
 *
 * **There is no "quem viu também viu" and no "complete o ambiente"** — a concept
 * store has no honest basis for recommending, which is the same reason
 * `catalogo.md` §8 refused fabricated suggestions on zero results. A link back
 * to a listing that exists is navigation, not a suggestion.
 *
 * The line drops the article the spec's example carries (`VER TODAS AS
 * POLTRONAS EM SALA`): `Tipo` holds a label and a labelSingular and no gender,
 * so *todas as sofás* is the other half of that template and there is no field
 * to decide between them. Adding one is refused — §10 closes the model — so the
 * line states the same navigation without the agreement it cannot make.
 */
export const fechamento = (produto: Produto): Fechamento => {
  const [primeira] = produto.colecoes;

  if (primeira) {
    const encontrada = exigirColecao(primeira);
    const catalogo = todosOsProdutos();
    return {
      tipo: "colecao",
      titulo: `COLEÇÃO ${encontrada.nome}`.toUpperCase(),
      // The coleção's own sequence, minus the piece already on screen.
      produtos: encontrada.produtos
        .filter((slug) => slug !== produto.slug)
        .map((slug) => {
          const irmao = catalogo.find((p) => p.slug === slug);
          if (!irmao) throw new Error(`coleção ${primeira} points at an unknown produto: ${slug}`);
          return irmao;
        }),
    };
  }

  const amb = exigirAmbiente(produto.ambientePrincipal);
  const tip = exigirTipo(produto.tipo);
  return {
    tipo: "ligacao",
    rotulo: `VER ${tip.label} EM ${amb.label}`.toUpperCase(),
    href: `/${amb.slug}/${tip.slug}`,
  };
};

// ---------------------------------------------------------------------------
// §8 — the régua budget
// ---------------------------------------------------------------------------

export type Cota = { eixo: "largura" | "altura"; rotulo: string };

/**
 * The cotas over the `principal` image, read from `imagens[0].cotas`.
 *
 * The figure comes from `medidas` and the image only names which axes it
 * annotates — which is what makes `marca.md` §2's prohibition enforceable: a
 * régua that cannot be traced to a real number does not render. This is one of
 * the page's two régua instances; the scale drawing is the other.
 *
 * `ambientada` and `detalhe` are not consulted: they render with no cota on this
 * page, always.
 */
export const cotasDoPrincipal = (produto: Produto): Cota[] => {
  const principal = produto.imagens[0];
  if (!principal) return [];

  return principal.cotas.map((eixo) => ({
    eixo,
    rotulo:
      eixo === "largura"
        ? `L ${produto.medidas.largura} CM`
        : `A ${produto.medidas.altura} CM`,
  }));
};

// ---------------------------------------------------------------------------
// Metadata — rotas.md §§1–2
// ---------------------------------------------------------------------------

/**
 * The title is the piece's name and nothing else; the description is computed
 * from physical facts and **carries no price** — a price in a SERP snippet is a
 * commercial claim in a third party's surface, which is what `rotas.md` §6
 * refuses in machine-readable form.
 *
 * The template reads `{tipo.label} … assinado por {designer}`; the singular is
 * used, because the referent is one piece and the plural label disagrees with
 * everything after it. `por` rather than `assinado por` for the same reason the
 * closing drops its article: participle agreement needs a gender the taxonomy
 * does not carry, and `POR {designer}` is the phrasing §2.2 already fixed for
 * this exact fact.
 */
export const metadadosDoProduto = (produto: Produto): Metadados => {
  const tip = exigirTipo(produto.tipo);
  const principal = exigirMaterial(produto.materiais[0] ?? "");

  return {
    titulo: produto.nome,
    descricao: `${tip.labelSingular} em ${principal.label.toLowerCase()}, por ${
      exigirFamilia(produto.familia).designer
    }. ${trioDeMedidas(produto.medidas)}.`,
  };
};

// ---------------------------------------------------------------------------

const exigirAmbiente = (slug: string) => {
  const encontrado = ambiente(slug);
  if (!encontrado) throw new Error(`no such ambiente: ${slug}`);
  return encontrado;
};

const exigirTipo = (slug: string) => {
  const encontrado = tipo(slug);
  if (!encontrado) throw new Error(`no such tipo: ${slug}`);
  return encontrado;
};

const exigirCor = (slug: string) => {
  const encontrada = cor(slug);
  if (!encontrada) throw new Error(`no such cor: ${slug}`);
  return encontrada;
};

const exigirMaterial = (slug: string) => {
  const encontrado = material(slug);
  if (!encontrado) throw new Error(`no such material: ${slug}`);
  return encontrado;
};

const exigirFamilia = (slug: string) => {
  const encontrada = familia(slug);
  if (!encontrada) throw new Error(`no such família: ${slug}`);
  return encontrada;
};

const exigirColecao = (slug: string) => {
  const encontrada = colecao(slug);
  if (!encontrada) throw new Error(`no such coleção: ${slug}`);
  return encontrada;
};
