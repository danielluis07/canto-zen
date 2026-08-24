// The four policy documents — `/politicas/[slug]`, one shared layout.
//
// `institucional.md` §11 fixes the template and §11b fixes the **statutory
// wording**. Everything quoted from §11b below ships as written: the
// legal-copy verification read all four norms at planalto.gov.br, and on those
// sentences being approximately right is being wrong. What §11 lists as
// *convention* rather than statute — the freight regions, cubed weight, entrega
// agendada, cookie mechanics — is phrased here, and it is composed from the
// catálogo's own tables rather than retyped, so a tarifa that changes changes
// the policy page with it.
//
// **Two rules govern all four documents** (§11b):
//
// 1. The first sentence is **self-contained**, because `rotas.md` ships it as
//    the page's meta description. No *"Nesta página…"*, no *"Conforme descrito
//    acima"*, and the store's name inside it. All four openers were measured
//    against `rotas.md`'s 110–160 character window and land at 116, 128, 130
//    and 141; `tests/institucional.test.ts` re-measures them, because editing
//    one of those sentences edits the page's only description.
// 2. The statute is **paraphrased in the store's voice, never quoted**. The
//    article numbers appear once each, at the end of their paragraph, in the
//    annotation voice — visible for the reader who wants to check, silent for
//    the one who does not.
//
// **A note on the shape.** §12 sketches `SecaoPolitica.corpo` as `string[]`.
// It ships as `Paragrafo[]` instead, because rule 2 above needs somewhere to
// put the article number that is not inside the sentence: an annotation-voice
// citation is a second element, and threading it through a bare string would
// mean parsing copy at render time. `fonte` is optional and most paragraphs
// have none.

import {
  ADICIONAL_AGENDADA_CENTAVOS,
  PREFIXO_NAO_ATENDIDO,
  loja,
  politicas as politicasComerciais,
  paginasDePolitica,
  reais,
  tarifas,
} from "../catalogo";

export type SlugDePolitica =
  | "trocas-e-devolucoes"
  | "entrega-e-frete"
  | "privacidade"
  | "termos-de-uso";

export type Paragrafo = {
  texto: string;
  /** The article number, once, in the annotation voice — §11b rule 2. */
  fonte?: string;
};

export type SecaoPolitica = {
  /** The anchor the side index links to, and a real `id` on the heading. */
  id: string;
  titulo: string;
  corpo: Paragrafo[];
};

export type Politica = {
  slug: SlugDePolitica;
  titulo: string;
  /** ISO date; rendered in full pt-BR. A policy without a version is a defect. */
  atualizadaEm: string;
  secoes: SecaoPolitica[];
};

/**
 * §11 — one line in Body S `--muted`, above the first section, on every policy
 * page. The store has refused six fabricated artefacts; four unqualified legal
 * documents would be the seventh. **Once, at the top** — not a banner, and not
 * repeated per section.
 */
export const LINHA_DE_LOJA_CONCEITO =
  "Canto Zen é uma loja conceito. Esta página descreve como a política funcionaria; nenhuma compra é processada aqui.";

/** All four carry the same version date, because they were written together. */
const ATUALIZADA_EM = "2026-03-12";

// ---------------------------------------------------------------------------
// trocas-e-devolucoes
// ---------------------------------------------------------------------------

const trocasEDevolucoes: SecaoPolitica[] = [
  {
    id: "prazo",
    titulo: "O prazo para desistir",
    corpo: [
      {
        // The opener, and therefore the description. 116 characters.
        texto:
          "Você pode desistir de uma compra feita no site da Canto Zen em até 7 dias corridos, contados do recebimento da peça.",
        fonte: "CDC, ART. 49",
      },
      {
        // §11b: this paragraph **names itself as a store grant**. A later
        // session that "corrects" it back to the statutory count would be
        // silently shortening a promise the store chose to make.
        texto:
          "Se você contratou a montagem, o prazo passa a contar da data em que a peça foi montada, e não da entrega. Isso é uma escolha nossa: a lei conta do recebimento, e a gente entende que uma peça ainda embalada não foi de fato conhecida.",
      },
    ],
  },
  {
    id: "como-desistir",
    titulo: "Como desistir",
    corpo: [
      {
        texto:
          `Para desistir, use o formulário de contato aqui do site — é a mesma ferramenta pela qual a ` +
          `compra foi feita, e por isso ela vale por si só. Se preferir, fale pelo WhatsApp ou escreva ` +
          `para ${loja.atendimento.email}. Confirmamos o recebimento do seu pedido na hora, pelo mesmo ` +
          `canal em que ele chegou, e concluímos a devolução em até 5 dias úteis.`,
        fonte: "DECRETO 7.962, ART. 5º",
      },
    ],
  },
  {
    id: "custo",
    titulo: "O que desistir custa para você",
    corpo: [
      {
        texto:
          "Desistir não tem custo nenhum para você. A coleta da peça é por nossa conta, os serviços contratados junto com ela — a montagem, por exemplo — são cancelados sem ônus, e devolvemos todos os valores pagos, corrigidos monetariamente. Se o pagamento foi no cartão, avisamos a administradora para que a cobrança não seja lançada ou, se já tiver sido, seja estornada.",
        fonte: "CDC, ART. 49, PARÁGRAFO ÚNICO",
      },
    ],
  },
  {
    id: "sob-encomenda",
    titulo: "Peças sob encomenda",
    corpo: [
      {
        texto:
          "Peças sob encomenda seguem a mesma regra. A lei não abre exceção para peças feitas depois do pedido, e a gente não abre também.",
      },
    ],
  },
  {
    id: "defeito",
    titulo: "Peça com defeito é outro caminho",
    corpo: [
      {
        texto:
          "Peça com defeito é outro caminho, e o prazo é maior. Você tem 90 dias, contados da entrega, para reclamar de um defeito aparente. A partir do aviso, temos 30 dias para resolver; se não resolvermos, a escolha é sua entre trocar a peça, receber o valor pago de volta corrigido, ou ficar com ela e pagar menos.",
        fonte: "CDC, ARTS. 18 E 26",
      },
    ],
  },
  {
    id: "como-a-peca-volta",
    titulo: "Como a peça volta",
    corpo: [
      {
        // §11b: the second sentence is load-bearing. Return conditions are
        // convention, and phrasing a convention as a requirement is how a
        // policy page turns into a trap.
        texto:
          "Para a devolução, pedimos que a peça volte como chegou, com os acessórios e, se possível, na embalagem original. Isso é um pedido nosso, não uma condição para o seu direito.",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// entrega-e-frete
// ---------------------------------------------------------------------------

/** `Sudeste capitais, em 6 dias úteis` × 6, from the tarifa table itself. */
const regioesEmTexto = (): string =>
  tarifas.map((t) => `${t.label}, em ${t.prazoDiasUteis} dias úteis`).join("; ");

const niveisDeMontagemEmTexto = (): string => {
  const { simples, media, complexa } = politicasComerciais.montagemCentavos;
  return `${reais(simples)}, ${reais(media)} ou ${reais(complexa)}`;
};

const entregaEFrete: SecaoPolitica[] = [
  {
    id: "frete-e-prazo",
    titulo: "Como o frete e o prazo são calculados",
    corpo: [
      {
        // The opener, and therefore the description. 128 characters.
        // "não do pedido" is the whole sentence's point: the single most common
        // Brazilian e-commerce complaint is a prazo the buyer counted from a
        // different event than the store did.
        texto:
          "O frete da Canto Zen é calculado pelo seu CEP, e o prazo de entrega começa a contar da confirmação do pagamento — não do pedido.",
      },
      {
        texto:
          "O preço mostrado no checkout já é o preço final: frete e montagem aparecem discriminados, e não existe custo que apareça depois.",
      },
    ],
  },
  {
    id: "producao-e-entrega",
    titulo: "Prazo de produção e prazo de entrega",
    corpo: [
      {
        texto:
          "Prazo de produção e prazo de entrega são coisas diferentes e somam. Uma peça sob encomenda é feita depois do pedido; o prazo de entrega começa quando ela fica pronta. Ambos são informados na página da peça antes da compra.",
      },
    ],
  },
  {
    id: "se-atrasarmos",
    titulo: "Se a gente atrasar",
    corpo: [
      {
        // CDC art. 35 — the one delivery promise a furniture store cannot write
        // loosely, because sob-encomenda production is exactly where dates slip.
        texto:
          "A gente cumpre o prazo que informou. Se não conseguirmos, você escolhe: esperar uma nova data, aceitar outra peça equivalente, ou cancelar a compra e receber tudo o que pagou de volta, corrigido.",
        fonte: "CDC, ART. 35",
      },
    ],
  },
  {
    id: "regioes",
    titulo: "As seis regiões",
    corpo: [
      {
        texto: `O país está dividido em seis regiões de frete, cada uma com a sua tarifa e o seu prazo: ${regioesEmTexto()}. O prazo é sempre contado em dias úteis, e sempre da confirmação do pagamento.`,
      },
      {
        texto: `Os CEPs que começam em ${PREFIXO_NAO_ATENDIDO} — Acre, Roraima e o interior do Amazonas e de Rondônia — ainda não são atendidos. O site diz isso na hora em que você consulta o CEP na página da peça, e não no fim do checkout.`,
      },
    ],
  },
  {
    id: "peso-cubado",
    titulo: "Peso cubado",
    corpo: [
      {
        texto:
          "Móvel não é pesado, é grande. Por isso o frete de uma peça é calculado sobre o maior número entre o peso real da embalagem e o seu peso cubado — largura × profundidade × altura, em centímetros, divididos por 6.000. Uma peça leve e larga custa o que ocupa no caminhão, que é como a transportadora cobra da gente.",
      },
      {
        // marca.md §8 — free freight is written as the word, never as a figure.
        texto:
          "Algumas peças são anunciadas com frete grátis para todo o país que a gente atende. Nesse caso a palavra é essa, e o valor não reaparece somado em nenhum outro lugar.",
      },
    ],
  },
  {
    id: "montagem",
    titulo: "Montagem",
    corpo: [
      {
        texto: `A montagem é um adicional escolhido na página da peça e acontece no mesmo dia da entrega, não numa visita separada. O preço depende do que a peça pede: ${niveisDeMontagemEmTexto()}. Peças que chegam prontas não oferecem o serviço, e a página da peça diz isso.`,
      },
      {
        texto:
          "Quando a montagem é contratada, o prazo para desistir da compra passa a contar da montagem, e não da entrega. Isso está em Trocas e devoluções, e é uma escolha da loja e não uma exigência da lei.",
      },
    ],
  },
  {
    id: "acesso",
    titulo: "Porta, corredor, elevador e escada",
    corpo: [
      {
        texto:
          "A medida que decide a entrega é a da embalagem, não a da peça, e ela está publicada na página de cada peça. Confira a embalagem contra a porta, o corredor e o elevador antes de comprar. Se a embalagem não couber no elevador, a entrega sobe por escada até o 3º andar; acima disso ela não é realizada.",
      },
      {
        texto:
          "Se o acesso não permitir a entrega no dia combinado, a gente remarca sem custo para você. Se não houver acesso possível, a compra é cancelada e você recebe de volta tudo o que pagou, corrigido — inclusive o frete.",
      },
    ],
  },
  {
    id: "entrega-agendada",
    titulo: "Entrega agendada",
    corpo: [
      {
        texto: `Peça volumosa é entregue com data e janela combinadas. A modalidade agendada custa ${reais(ADICIONAL_AGENDADA_CENTAVOS)} a mais que a padrão e tem exatamente o mesmo prazo: o que ela compra é a hora, não a velocidade.`,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// privacidade
// ---------------------------------------------------------------------------

/**
 * §11b puts the holder's-rights contact at `privacidade@cantozen.com.br`. It is
 * a second address, deliberately not a field on `Loja`: `loja.atendimento` is
 * what the footer publishes as the store's channel, and the LGPD controller
 * contact is a different duty with a different inbox. It ships as authored copy
 * because that is what §11b makes it.
 */
const EMAIL_DE_PRIVACIDADE = "privacidade@cantozen.com.br";

const privacidade: SecaoPolitica[] = [
  {
    id: "dados-e-finalidade",
    titulo: "Quais dados, e para quê",
    corpo: [
      {
        // The opener, and therefore the description. 130 characters.
        texto:
          "A Canto Zen trata seus dados pessoais para uma coisa só: concluir a compra que você pediu — nome, CPF, e-mail, celular e endereço.",
      },
      {
        // The two bases are stated separately and that is the point: writing
        // one basis for both is what produces the consent checkbox that
        // `checkout.md` §5 refuses.
        texto:
          "Esses são os dados do checkout, e a base legal para eles é a execução do contrato: sem eles não há nota nem entrega, e por isso a gente não pede o seu consentimento para eles — não haveria escolha real a oferecer. O CEP informado para calcular o frete é usado só para isso.",
        fonte: "LGPD, ART. 7º, V",
      },
    ],
  },
  {
    id: "aviso-de-novas-pecas",
    titulo: "O aviso de novas peças",
    corpo: [
      {
        texto:
          "O e-mail do aviso de novas peças é o único caso em que a base é o seu consentimento, manifestado quando você envia o formulário. Você pode retirá-lo quando quiser, pelo link de cancelamento em qualquer mensagem.",
        fonte: "LGPD, ART. 7º, I",
      },
    ],
  },
  {
    id: "compartilhamento",
    titulo: "Com quem compartilhamos",
    corpo: [
      {
        texto: "Não vendemos, alugamos nem compartilhamos seus dados para publicidade.",
      },
    ],
  },
  {
    id: "retencao",
    titulo: "Por quanto tempo guardamos",
    corpo: [
      {
        // The build's to write, and it must say what is true of a store with no
        // backend: nothing is stored.
        texto:
          "Enquanto esta loja for um conceito, a resposta é honesta e curta: nada é guardado. Não existe banco de dados do outro lado, nenhum formulário deste site envia coisa alguma, e o que você digita fica na aba do seu navegador até você fechá-la. Numa loja de verdade, os dados do checkout seriam guardados pelo prazo fiscal de cinco anos e o e-mail do aviso, até você cancelá-lo.",
      },
    ],
  },
  {
    id: "cookies",
    titulo: "Cookies",
    corpo: [
      {
        texto:
          "O site não usa cookie de publicidade, não tem pixel de rede social e não mede você. O que existe é o armazenamento que o próprio navegador faz para lembrar o seu carrinho e o CEP que você consultou, nesta máquina e mais em lugar nenhum. Por isso também não há banner de cookies: não haveria nada para consentir.",
      },
    ],
  },
  {
    id: "seus-direitos",
    titulo: "Seus direitos",
    corpo: [
      {
        // Art. 9º VII requires explicit mention of the art. 18 rights. One
        // sentence rather than a nine-item list on purpose: a bulleted list is
        // the visual signature of a document written to be skipped.
        texto: `A qualquer momento você pode pedir: confirmação de que tratamos seus dados, acesso a eles, correção do que estiver errado, anonimização ou eliminação do que for desnecessário, portabilidade para outro fornecedor, informação sobre com quem compartilhamos, e — no caso do aviso de novas peças — a revogação do consentimento e a eliminação dos dados. Escreva para ${EMAIL_DE_PRIVACIDADE}. Respondemos em até 15 dias.`,
        fonte: "LGPD, ARTS. 18 E 19",
      },
    ],
  },
  {
    id: "controlador",
    titulo: "Quem é o controlador",
    corpo: [
      {
        // Points at the footer instead of restating the identification — the
        // footer's own fiction disclosure then covers this page too, which is
        // why this document needs no second one.
        texto: `O controlador dos dados é a ${loja.razaoSocial}, no endereço e CNPJ do rodapé desta página.`,
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// termos-de-uso
// ---------------------------------------------------------------------------

const termosDeUso: SecaoPolitica[] = [
  {
    id: "o-que-cobrem",
    titulo: "O que estes termos cobrem",
    corpo: [
      {
        // The opener, and therefore the description. 141 characters.
        texto:
          "Estes termos valem para o uso do site da Canto Zen e para a compra das peças oferecidas nele, que são feitas sob encomenda em madeira maciça.",
      },
    ],
  },
  {
    id: "quem-vende",
    titulo: "Quem vende",
    corpo: [
      {
        texto:
          "Quem vende é a empresa identificada no rodapé de todas as páginas, com razão social, CNPJ e endereço.",
      },
    ],
  },
  {
    id: "precos",
    titulo: "Preços e disponibilidade",
    corpo: [
      {
        texto:
          "Preços e disponibilidade valem como anunciados. Se houver erro evidente de preço, a gente avisa você antes de qualquer cobrança e você decide se mantém o pedido.",
      },
    ],
  },
  {
    id: "a-madeira",
    titulo: "A madeira varia, e isso é a peça",
    corpo: [
      {
        // The paragraph ends by refusing what it looks like: variance
        // disclosure is a *characteristic*, and the sentence that discloses one
        // is one comma away from the sentence that disclaims liability.
        texto:
          "Nossas peças são de madeira maciça. Cor, veio e nó variam de peça para peça, e a foto mostra um exemplar, não a peça exata que você vai receber. Essa variação é uma característica da madeira e a gente informa isso antes da compra — não é defeito, e também não é uma isenção de responsabilidade nossa por defeito.",
        fonte: "CDC, ART. 31",
      },
    ],
  },
  {
    id: "propriedade-intelectual",
    titulo: "O que é nosso",
    corpo: [
      {
        texto: "Os textos, fotos, desenhos e o nome Canto Zen são nossos. Usar é preciso pedir.",
      },
    ],
  },
  {
    id: "foro",
    titulo: "Onde uma disputa se resolve",
    corpo: [
      {
        // The document **states the consumer's right** rather than staying
        // silent, because silence in a terms page reads as the clause being
        // elsewhere. No forum is elected against the reader.
        texto:
          "Se houver uma disputa, você pode processar a Canto Zen no foro do seu próprio domicílio. Esta página não elege foro diferente disso.",
        fonte: "CDC, ART. 101, I",
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// The four, and the accessors the route reads
// ---------------------------------------------------------------------------

const SECOES: Record<SlugDePolitica, SecaoPolitica[]> = {
  "trocas-e-devolucoes": trocasEDevolucoes,
  "entrega-e-frete": entregaEFrete,
  privacidade,
  "termos-de-uso": termosDeUso,
};

/**
 * Four records, and the titles come from `paginasDePolitica` — the same list
 * the footer's Ajuda column renders and the router enumerates. A title typed
 * twice is a title that can disagree with itself, and this is the page the
 * footer links to by name.
 *
 * The four documents deliberately do **not** share a heading skeleton (§11):
 * forcing unrelated documents into identical sections is the false symmetry
 * that produces empty sections, and `privacidade` and `termos-de-uso` have
 * nothing structural in common.
 */
export const documentos = (): Politica[] =>
  paginasDePolitica.map((pagina) => {
    const slug = pagina.slug as SlugDePolitica;
    const secoes = SECOES[slug];
    if (!secoes) throw new Error(`a política is routed with no document behind it: ${slug}`);
    return { slug, titulo: pagina.titulo, atualizadaEm: ATUALIZADA_EM, secoes };
  });

/**
 * Whether `/politicas/{slug}` is a place. **`prazos-e-entrega` is not one of
 * them** — the three links that once pointed there target `entrega-e-frete`,
 * and the old slug is a `404` like any other invented path.
 */
export const politicaEnumerada = (slug: string): boolean =>
  paginasDePolitica.some((p) => p.slug === slug);

/** The enumeration the router prerenders — exactly four, never generated. */
export const slugsDePoliticas = (): string[] => paginasDePolitica.map((p) => p.slug);

/**
 * Throws on an unknown slug rather than returning `undefined`: the route
 * enumerates the four before this is ever called, and `proxy.ts` refuses the
 * rest before routing, so a miss here is a broken enumeration and not a
 * reader's typo.
 */
export const documentoDePolitica = (slug: string): Politica => {
  const encontrado = documentos().find((d) => d.slug === slug);
  if (!encontrado) throw new Error(`no such política: ${slug}`);
  return encontrado;
};

/**
 * §11 — **the index renders only at four or more sections.** Below that it is
 * noise: a two-item index beside a short document reads as a rendering
 * accident, and the document simply takes the text lane.
 *
 * All four documents clear the threshold today. The rule stays a function, and
 * is tested as one, because it is the template's rule and not a fact about the
 * current four.
 */
export const MINIMO_PARA_INDICE = 4;

export const indiceVisivel = (politica: Politica): boolean =>
  politica.secoes.length >= MINIMO_PARA_INDICE;

export const ROTULO_DO_INDICE = "NESTA PÁGINA";

// ---------------------------------------------------------------------------
// The date — a version, not a byline
// ---------------------------------------------------------------------------

const MESES = [
  "JANEIRO",
  "FEVEREIRO",
  "MARÇO",
  "ABRIL",
  "MAIO",
  "JUNHO",
  "JULHO",
  "AGOSTO",
  "SETEMBRO",
  "OUTUBRO",
  "NOVEMBRO",
  "DEZEMBRO",
];

/**
 * `2026-03-12` → `ÚLTIMA ATUALIZAÇÃO — 12 DE MARÇO DE 2026`, in the annotation
 * voice directly below the title.
 *
 * `inspiracoes.md` bans dates on an `Artigo` as blog-signalling; that ban does
 * not reach here, because a policy without a version date is a real defect —
 * the reader needs to know which version they agreed to.
 *
 * Parsed by hand rather than through `Date`, which would read the ISO string as
 * UTC midnight and print the previous day west of Greenwich.
 */
export const linhaDeAtualizacao = (iso: string): string => {
  const [ano, mes, dia] = iso.split("-").map(Number);
  const nomeDoMes = MESES[(mes ?? 0) - 1];
  if (!ano || !nomeDoMes || !dia) throw new Error(`a política carries no usable date: ${iso}`);
  return `ÚLTIMA ATUALIZAÇÃO — ${dia} DE ${nomeDoMes} DE ${ano}`;
};

// ---------------------------------------------------------------------------
// Metadata — rotas.md §§1–2
// ---------------------------------------------------------------------------

/**
 * The title is the document's own; the description is its **first sentence**,
 * read off the document rather than authored a second time. That is the whole
 * point of §11b's rule 1 — the opener has to read correctly with no heading
 * above it and nothing after it, because this is where it is read.
 */
export const metadadosDaPolitica = (slug: string): { titulo: string; descricao: string } => {
  const documento = documentoDePolitica(slug);
  const primeiro = documento.secoes[0]?.corpo[0];
  if (!primeiro) throw new Error(`a política opens on nothing, so it has no description: ${slug}`);
  return { titulo: documento.titulo, descricao: primeiro.texto };
};
