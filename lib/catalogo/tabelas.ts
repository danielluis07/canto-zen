// The catalogue, in one file.
//
// `dados.md` reasons that the deliverable is cross-reference integrity and that
// splitting the tables is how references drift, so entities, famílias and
// produtos live together here and only derivations live elsewhere.
//
// Every column below is authored — `dados.md` §3 for identity, §2 for the
// entities. Nothing derived is stored; see `derivacoes.ts`.

import { elevacao } from "./desenho";
import type {
  Ambiente,
  Colecao,
  Cor,
  FamiliaAutorada,
  Material,
  ProdutoAutorado,
  Tipo,
} from "./modelo";

/** Phase 1 hotlinks Unsplash — `imagens.md` §10.1. Repetition is fine. */
const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&w=1600&q=80`;

// ---------------------------------------------------------------------------
// Ambientes — `dados.md` §2.1, curated `tipos[]` from `rotas.md`
// ---------------------------------------------------------------------------

export const ambientes: Ambiente[] = [
  {
    slug: "sala",
    label: "Sala",
    tipos: [
      "sofas",
      "poltronas",
      "mesas-de-centro",
      "mesas-de-jantar",
      "racks-e-estantes",
      "aparadores",
    ],
    imagem: {
      src: unsplash("1616486338812-3dadae4b4ace"),
      alt: "Sala de estar com sofá de linho e mesa de centro em madeira",
    },
    descricao: "Onde a casa recebe — peças que suportam a permanência longa.",
  },
  {
    slug: "quarto",
    label: "Quarto",
    tipos: ["camas", "cabeceiras", "criados-mudos", "comodas", "guarda-roupas"],
    imagem: {
      src: unsplash("1583847268964-b28dc8f51f92"),
      alt: "Quarto com cama de cabeceira estofada e criado-mudo em madeira clara",
    },
    descricao:
      "O cômodo mais silencioso da casa merece a marcenaria mais discreta.",
  },
  {
    slug: "cozinha",
    label: "Cozinha",
    tipos: ["mesas", "cadeiras", "banquetas", "armarios", "carrinhos-e-apoios"],
    imagem: {
      src: unsplash("1598300042247-d088f8ab3a91"),
      alt: "Cozinha com mesa de madeira maciça e cadeiras de palhinha",
    },
    descricao: "Superfícies que trabalham todos os dias e envelhecem bem.",
  },
  {
    slug: "escritorio",
    label: "Escritório",
    tipos: ["escrivaninhas", "cadeiras-de-trabalho", "estantes", "luminarias-de-mesa"],
    imagem: {
      src: unsplash("1567016432779-094069958ea5"),
      alt: "Escritório com escrivaninha de madeira, estante e luminária de mesa",
    },
    descricao: "Concentração exige poucas coisas, e todas certas.",
  },
];

// ---------------------------------------------------------------------------
// Tipos — `dados.md` §2.2. Slugs are global: `cadeiras` means the same thing in
// every room; which tipos a room exposes is curated above.
// ---------------------------------------------------------------------------

export const tipos: Tipo[] = [
  { slug: "sofas", label: "Sofás", labelSingular: "Sofá" },
  { slug: "poltronas", label: "Poltronas", labelSingular: "Poltrona" },
  { slug: "mesas-de-centro", label: "Mesas de centro", labelSingular: "Mesa de centro" },
  { slug: "mesas-de-jantar", label: "Mesas de jantar", labelSingular: "Mesa de jantar" },
  { slug: "racks-e-estantes", label: "Racks e estantes", labelSingular: "Rack" },
  { slug: "aparadores", label: "Aparadores", labelSingular: "Aparador" },
  { slug: "camas", label: "Camas", labelSingular: "Cama" },
  { slug: "cabeceiras", label: "Cabeceiras", labelSingular: "Cabeceira" },
  { slug: "criados-mudos", label: "Criados-mudos", labelSingular: "Criado-mudo" },
  { slug: "comodas", label: "Cômodas", labelSingular: "Cômoda" },
  { slug: "guarda-roupas", label: "Guarda-roupas", labelSingular: "Guarda-roupa" },
  { slug: "mesas", label: "Mesas", labelSingular: "Mesa" },
  { slug: "cadeiras", label: "Cadeiras", labelSingular: "Cadeira" },
  { slug: "banquetas", label: "Banquetas", labelSingular: "Banqueta" },
  { slug: "armarios", label: "Armários", labelSingular: "Armário" },
  { slug: "carrinhos-e-apoios", label: "Carrinhos e apoios", labelSingular: "Carrinho" },
  { slug: "escrivaninhas", label: "Escrivaninhas", labelSingular: "Escrivaninha" },
  {
    slug: "cadeiras-de-trabalho",
    label: "Cadeiras de trabalho",
    labelSingular: "Cadeira de trabalho",
  },
  { slug: "estantes", label: "Estantes", labelSingular: "Estante" },
  { slug: "luminarias-de-mesa", label: "Luminárias de mesa", labelSingular: "Luminária de mesa" },
];

// ---------------------------------------------------------------------------
// Cores — `dados.md` §2.3. `amostra` is the only colour outside the palette
// that appears in interface, and it appears as product data.
// ---------------------------------------------------------------------------

export const cores: Cor[] = [
  { slug: "cru", label: "Cru", amostra: "#E7E0D3" },
  { slug: "off-white", label: "Off-white", amostra: "#F2EFE8" },
  { slug: "areia", label: "Areia", amostra: "#D8CBB6" },
  { slug: "argila", label: "Argila", amostra: "#B08A6E" },
  { slug: "nogueira", label: "Nogueira", amostra: "#6B4C36" },
  { slug: "carvao", label: "Carvão", amostra: "#3A3A38" },
  { slug: "grafite", label: "Grafite", amostra: "#4A4E52" },
  { slug: "verde-musgo", label: "Verde-musgo", amostra: "#6B7359" },
  { slug: "terracota", label: "Terracota", amostra: "#B25B3E" },
  { slug: "ocre", label: "Ocre", amostra: "#C08A3E" },
];

// ---------------------------------------------------------------------------
// Materiais — `dados.md` §2.4. `cuidados` is required on every one: the PDP's
// Cuidados line is the union of a produto's materials' lines, so no produto can
// exist without care copy.
// ---------------------------------------------------------------------------

export const materiais: Material[] = [
  {
    slug: "linho",
    label: "Linho",
    cuidados:
      "Aspire semanalmente; manchas saem com pano úmido e sabão neutro, nunca esfregando.",
  },
  {
    slug: "boucle",
    label: "Bouclé",
    cuidados: "Escove no sentido da trama; nunca puxe fios soltos — corte rente.",
  },
  {
    slug: "couro-natural",
    label: "Couro natural",
    cuidados:
      "Hidrate a cada seis meses com creme incolor; mantenha longe de sol direto.",
  },
  {
    slug: "carvalho",
    label: "Carvalho",
    cuidados: "Pano seco no dia a dia; reaplique óleo de acabamento uma vez por ano.",
  },
  {
    slug: "nogueira",
    label: "Nogueira",
    cuidados: "Pano seco; a madeira escurece com a luz, e isso é próprio dela.",
  },
  {
    slug: "freijo",
    label: "Freijó",
    cuidados: "Pano seco; evite produtos à base de silicone, que selam o poro.",
  },
  {
    slug: "jatoba",
    label: "Jatobá",
    cuidados: "Pano seco; a cor amadurece nos primeiros meses e depois estabiliza.",
  },
  {
    slug: "palhinha",
    label: "Palhinha",
    cuidados:
      "Aspire com bocal de escova; umedeça levemente uma vez por ano para não ressecar.",
  },
  {
    slug: "rattan",
    label: "Rattan",
    cuidados:
      "Pano úmido e secagem à sombra; ambientes muito secos pedem umidificação.",
  },
  {
    slug: "aco-carbono",
    label: "Aço carbono",
    cuidados: "Pano seco; a pintura eletrostática não pede polimento nem cera.",
  },
  {
    slug: "latao",
    label: "Latão",
    cuidados: "Deixe patinar; para manter o brilho, flanela seca e nada mais.",
  },
  {
    slug: "vidro-temperado",
    label: "Vidro temperado",
    cuidados: "Álcool isopropílico e pano de microfibra; evite abrasivos.",
  },
  {
    slug: "marmore",
    label: "Mármore",
    cuidados:
      "Seque líquidos na hora — ácidos marcam; impermeabilize a cada dois anos.",
  },
  {
    slug: "ceramica",
    label: "Cerâmica",
    cuidados: "Pano úmido; peças esmaltadas não vão à máquina de lavar.",
  },
];

// ---------------------------------------------------------------------------
// Coleções — `dados.md` §2.6. `produtos[]` is the editorial act and is
// authoritative on order. No index page: `rotas.md` refused `/colecoes`.
// ---------------------------------------------------------------------------

export const colecoes: Colecao[] = [
  {
    slug: "reboco",
    nome: "Reboco",
    descricao:
      "Seis peças em tons de cal, desenhadas para uma casa que recebe pouca luz direta.",
    imagem: {
      src: unsplash("1513506003901-1e6a229e2d15"),
      alt: "Peças em tons de cal reunidas contra uma parede de reboco",
    },
    produtos: [
      "sofa-heron-linho-cru",
      "poltrona-lina-linho-cru",
      "mesa-de-centro-luar-marmore-off-white",
      "aparador-pedra-marmore-cru",
      "cabeceira-vela-linho-areia",
      "luminaria-de-mesa-seixo-ceramica-cru",
    ],
  },
  {
    slug: "serra",
    nome: "Serra",
    descricao:
      "Cinco peças em madeira maciça escura, para quem quer a marcenaria à vista.",
    imagem: {
      src: unsplash("1594026112284-02bb6f3352fe"),
      alt: "Mesa de jantar e cadeiras em madeira maciça escura",
    },
    produtos: [
      "mesa-de-jantar-ilhota-jatoba",
      "cadeira-junco-couro-argila",
      "aparador-sereno-carvalho",
      "estante-mirante-nogueira",
      "comoda-tramo-nogueira",
    ],
  },
];

// ---------------------------------------------------------------------------
// Famílias — routeless. `medidas` are authored here, never per produto, so two
// acabamentos cannot disagree about the same piece's geometry
// (`pagina-produto.md` §10). `designer` is not stored: `dados.md` §2.5 derives
// it from tipo.
//
// Envelopes per tipo are `dados.md` §8.2's, and within a tipo a larger price
// means a larger piece, so the régua never contradicts the price beside it.
// ---------------------------------------------------------------------------

/**
 * `medidas` are written once per família and handed straight to the elevation,
 * so the drawing cannot state a figure the record disagrees with — the same
 * reason the geometry is not written per produto.
 *
 * `corpo` is the authored silhouette, in piece coordinates: x runs 0..largura,
 * y runs 0..altura from the top. The dimension frame around it is `elevacao`'s.
 */
const familiaComElevacao = ({
  slug,
  nome,
  medidas,
  corpo,
  desenhoAlt,
}: Omit<FamiliaAutorada, "desenho"> & {
  corpo: string[];
  desenhoAlt: string;
}): FamiliaAutorada => ({
  slug,
  nome,
  medidas,
  desenho: elevacao({ medidas, corpo, alt: desenhoAlt }),
});

export const familias: FamiliaAutorada[] = [
  familiaComElevacao({
    slug: "sofa-heron",
    nome: "Sofá Héron",
    medidas: { largura: 220, profundidade: 96, altura: 76 },
    corpo: [
      "M0 8 H220 V30 H0 Z",
      "M0 30 H220 V68 H0 Z",
      "M12 68 V76 M208 68 V76",
      "M73 8 V30 M147 8 V30",
    ],
    desenhoAlt: "Elevação frontal do Sofá Héron, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "sofa-taipa",
    nome: "Sofá Taipa",
    medidas: { largura: 245, profundidade: 100, altura: 80 },
    corpo: [
      "M0 6 H245 V34 H0 Z",
      "M0 34 H245 V70 H0 Z",
      "M14 70 V80 M231 70 V80",
      "M61 6 V34 M122 6 V34 M184 6 V34",
    ],
    desenhoAlt: "Elevação frontal do Sofá Taipa, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "poltrona-lina",
    nome: "Poltrona Lina",
    medidas: { largura: 78, profundidade: 82, altura: 74 },
    corpo: ["M0 10 H78 V32 H0 Z", "M0 32 H78 V64 H0 Z", "M8 64 V74 M70 64 V74", "M14 32 H64"],
    desenhoAlt: "Elevação frontal da Poltrona Lina, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "cadeira-junco",
    nome: "Cadeira Junco",
    medidas: { largura: 52, profundidade: 56, altura: 88 },
    corpo: ["M6 42 H46 V46 H6 Z", "M8 0 H44 V42 H8 Z", "M8 46 V88 M44 46 V88", "M8 72 H44"],
    desenhoAlt: "Elevação frontal da Cadeira Junco, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "luminaria-de-mesa-junco",
    nome: "Luminária de Mesa Junco",
    medidas: { largura: 20, profundidade: 20, altura: 40 },
    corpo: ["M2 0 H18 L20 16 H0 Z", "M10 16 V37", "M4 37 H16 V40 H4 Z"],
    desenhoAlt: "Elevação frontal da Luminária de Mesa Junco, com as cotas de largura e altura",
  }),
];

// ---------------------------------------------------------------------------
// Produtos — one record per acabamento, written in `dados.md` §3's row order.
// The six worked exemplars of §9 are transcribed here, each carrying the `ordem`
// §3 gives it; the remaining 59 land between them.
// ---------------------------------------------------------------------------

export const produtos: ProdutoAutorado[] = [
  // §3.1 row 1 — the hero: cotas ['largura'], multi-volume embalagem, freteGratis
  {
    slug: "sofa-heron-linho-cru",
    nome: "Sofá Héron",
    familia: "sofa-heron",
    acabamento: "Linho Cru",
    tipo: "sofas",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: ["reboco"],
    ordem: 1,
    precoTabela: 980000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 42, unidade: "cm" },
      { rotulo: "Quantidade de lugares", valor: 3, unidade: "un" },
      { rotulo: "Quantidade de almofadas", valor: 5, unidade: "un" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 6,
    freteGratis: "sudeste",
    imagens: [
      {
        src: unsplash("1555041469-a586c61ea9bc"),
        alt: "Sofá Héron em linho cru sobre reboco",
        papel: "principal",
        cotas: ["largura"],
      },
      {
        src: unsplash("1567538096630-e0c55bd6374c"),
        alt: "Sofá Héron em Sala",
        papel: "ambientada",
        cotas: [],
      },
    ],
    descricao:
      "Um sofá de três lugares em linho cru, feito para a permanência longa da sala. A estrutura em carvalho maciço é montada com cavilhas e encaixes de espiga, e o enchimento das almofadas combina espuma de densidade média com pluma siliconada. Fica bem encostado à parede mais longa, onde a largura de 220 cm ainda deixa passagem de cada lado.",
  },

  // §3.1 row 4 — esgotado: no CTA, and the fields that stay populated anyway
  {
    slug: "sofa-taipa-couro-argila",
    nome: "Sofá Taipa",
    familia: "sofa-taipa",
    acabamento: "Couro Argila",
    tipo: "sofas",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 4,
    precoTabela: 1420000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 44, unidade: "cm" },
      { rotulo: "Quantidade de lugares", valor: 4, unidade: "un" },
      { rotulo: "Quantidade de almofadas", valor: 6, unidade: "un" },
    ],
    disponibilidade: "esgotado",
    freteGratis: "nacional",
    imagens: [
      {
        src: unsplash("1524758631624-e2822e304c36"),
        alt: "Sofá Taipa em couro argila sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um sofá de quatro lugares em couro natural argila, dimensionado para salas que recebem muita gente. O couro é curtido ao vegetal e costurado com pesponto aparente nas laterais, que é onde o assento cede primeiro e onde a linha reforça. Ocupa a parede inteira de uma sala média e pede circulação de 70 cm à frente.",
  },

  // §3.1 row 6 — produto.md's own example: all three papel roles, two ambientes,
  // and the carve-out família whose two acabamentos must be visibly different
  {
    slug: "poltrona-lina-linho-cru",
    nome: "Poltrona Lina",
    familia: "poltrona-lina",
    acabamento: "Linho Cru",
    tipo: "poltronas",
    ambientePrincipal: "sala",
    ambientes: ["sala", "quarto"],
    colecoes: ["reboco"],
    ordem: 6,
    precoTabela: 389000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 42, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 120, unidade: "kg" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 4,
    imagens: [
      {
        src: unsplash("1586023492125-27b2c045efd7"),
        alt: "Poltrona Lina em linho cru sobre reboco",
        papel: "principal",
        cotas: ["largura"],
      },
      {
        src: unsplash("1493663284031-b7e3aefcae8e"),
        alt: "Poltrona Lina em Sala",
        papel: "ambientada",
        cotas: [],
      },
      {
        src: unsplash("1540574163026-643ea20ade25"),
        alt: "A trama do linho cru no encosto",
        papel: "detalhe",
        cotas: [],
      },
    ],
    descricao:
      "Uma poltrona de leitura em linho cru, com assento a 42 cm do chão e braços baixos. O encosto é curvado a vapor sobre lâminas de carvalho, uma peça única que dispensa emenda na altura do ombro. Encontra lugar no canto que recebe a luz da tarde, ao lado de uma mesa de apoio e de um abajur.",
  },

  // §3.1 row 7 — the second acabamento: identical medidas, different everything
  // else. Its placeholder is deliberately unlike row 6's — `imagens.md` §10.3.
  {
    slug: "poltrona-lina-boucle-carvalho",
    nome: "Poltrona Lina",
    familia: "poltrona-lina",
    acabamento: "Bouclé Carvalho",
    tipo: "poltronas",
    ambientePrincipal: "sala",
    ambientes: ["sala", "quarto"],
    colecoes: [],
    ordem: 7,
    precoTabela: 420000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 42, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 120, unidade: "kg" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1550226891-ef816aed4a98"),
        alt: "Poltrona Lina em bouclé carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma poltrona de leitura em bouclé de lã, com o mesmo assento a 42 cm e os mesmos braços baixos do acabamento em linho. A trama do bouclé é fechada por costura dupla nas quinas, onde o tecido sofre mais, e o carvalho aparece só nos pés. Combina com salas de piso claro, em que a lã ganha volume contra a parede.",
  },

  // §3.3 row 41 — cross-listed, all three roles, opens the Cozinha article
  {
    slug: "cadeira-junco-palhinha-freijo",
    nome: "Cadeira Junco",
    familia: "cadeira-junco",
    acabamento: "Palhinha e Freijó",
    tipo: "cadeiras",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha", "sala"],
    colecoes: [],
    ordem: 41,
    precoTabela: 148000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 46, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 110, unidade: "kg" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1506439773649-6e0eb8cfb237"),
        alt: "Cadeira Junco em palhinha e freijó sobre reboco",
        papel: "principal",
        cotas: ["largura"],
      },
      {
        src: unsplash("1519710164239-da123dc03ef4"),
        alt: "Cadeira Junco em Cozinha",
        papel: "ambientada",
        cotas: [],
      },
      {
        src: unsplash("1592078615290-033ee584e267"),
        alt: "O caixilho ranhurado que segura a palhinha do assento",
        papel: "detalhe",
        cotas: [],
      },
    ],
    descricao:
      "Uma cadeira de jantar com assento em palhinha e estrutura em freijó, pensada para refeições longas à mesa. O assento é trançado sobre um caixilho ranhurado, técnica que mantém a palhinha esticada sem cola e permite refazer a trama anos depois. Serve à mesa da cozinha e também à mesa de jantar da sala, onde não destoa.",
  },

  // §3.4 row 65 — montagem.necessaria false, entry price, principal only
  {
    slug: "luminaria-de-mesa-junco-palhinha",
    nome: "Luminária de Mesa Junco",
    familia: "luminaria-de-mesa-junco",
    acabamento: "Palhinha",
    tipo: "luminarias-de-mesa",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio"],
    colecoes: [],
    ordem: 65,
    precoTabela: 76000,
    medidasExtras: [
      { rotulo: "Alcance do braço", valor: 18, unidade: "cm" },
      { rotulo: "Soquete", valor: 1, unidade: "un" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1533090161767-e6ffed986c88"),
        alt: "Luminária de Mesa Junco em palhinha sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma luminária de mesa com cúpula em palhinha trançada e base em carvalho, para luz de leitura pontual. A palhinha é trançada à mão sobre um aro de madeira, e a trama aberta deixa passar o desenho da luz na parede atrás. Fica sobre a escrivaninha ou o criado-mudo, onde o alcance de 18 cm cobre a área de trabalho sem invadir o resto.",
  },
];
