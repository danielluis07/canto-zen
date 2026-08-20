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
  Artigo,
  Colecao,
  ConteudoHome,
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
    slug: "sofa-orla",
    nome: "Sofá Orla",
    medidas: { largura: 190, profundidade: 90, altura: 72 },
    corpo: [
      "M0 8 H190 V30 H0 Z",
      "M0 30 H190 V64 H0 Z",
      "M10 64 V72 M180 64 V72",
      "M63 8 V30 M127 8 V30",
    ],
    desenhoAlt: "Elevação frontal do Sofá Orla, com as cotas de largura e altura",
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
    slug: "sofa-maruja",
    nome: "Sofá Marujá",
    medidas: { largura: 205, profundidade: 92, altura: 74 },
    corpo: [
      "M0 7 H205 V31 H0 Z",
      "M0 31 H205 V66 H0 Z",
      "M12 66 V74 M193 66 V74",
      "M68 7 V31 M137 7 V31",
    ],
    desenhoAlt: "Elevação frontal do Sofá Marujá, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "poltrona-lina",
    nome: "Poltrona Lina",
    medidas: { largura: 78, profundidade: 82, altura: 74 },
    corpo: ["M0 10 H78 V32 H0 Z", "M0 32 H78 V64 H0 Z", "M8 64 V74 M70 64 V74", "M14 32 H64"],
    desenhoAlt: "Elevação frontal da Poltrona Lina, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "poltrona-sagui",
    nome: "Poltrona Saguí",
    medidas: { largura: 88, profundidade: 86, altura: 80 },
    corpo: ["M0 10 H88 V34 H0 Z", "M0 34 H88 V68 H0 Z", "M9 68 V80 M79 68 V80", "M16 34 H72"],
    desenhoAlt: "Elevação frontal da Poltrona Saguí, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "mesa-de-centro-seixo",
    nome: "Mesa de Centro Seixo",
    medidas: { largura: 95, profundidade: 58, altura: 34 },
    corpo: ["M0 0 H95 V6 H0 Z", "M8 6 V34 M87 6 V34", "M8 26 H87"],
    desenhoAlt: "Elevação frontal da Mesa de Centro Seixo, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "mesa-de-centro-luar",
    nome: "Mesa de Centro Luar",
    medidas: { largura: 125, profundidade: 70, altura: 40 },
    corpo: ["M0 0 H125 V8 H0 Z", "M14 8 V40 M111 8 V40", "M14 32 H111"],
    desenhoAlt: "Elevação frontal da Mesa de Centro Luar, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "mesa-de-centro-vau",
    nome: "Mesa de Centro Vau",
    medidas: { largura: 110, profundidade: 62, altura: 36 },
    corpo: ["M0 0 H110 V7 H0 Z", "M10 7 V36 M100 7 V36", "M10 28 H100"],
    desenhoAlt: "Elevação frontal da Mesa de Centro Vau, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "mesa-de-jantar-vargem",
    nome: "Mesa de Jantar Vargem",
    medidas: { largura: 200, profundidade: 92, altura: 76 },
    corpo: ["M0 0 H200 V6 H0 Z", "M12 6 V76 M188 6 V76", "M12 60 H188"],
    desenhoAlt: "Elevação frontal da Mesa de Jantar Vargem, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "mesa-de-jantar-ilhota",
    nome: "Mesa de Jantar Ilhota",
    medidas: { largura: 230, profundidade: 98, altura: 78 },
    corpo: ["M0 0 H230 V7 H0 Z", "M14 7 V78 M216 7 V78", "M14 62 H216"],
    desenhoAlt: "Elevação frontal da Mesa de Jantar Ilhota, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "estante-cais",
    nome: "Estante Cais",
    medidas: { largura: 180, profundidade: 42, altura: 200 },
    corpo: [
      "M0 0 H180 V200 H0 Z",
      "M0 40 H180 M0 80 H180 M0 120 H180 M0 160 H180",
      "M60 0 V200 M120 0 V200",
    ],
    desenhoAlt: "Elevação frontal da Estante Cais, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "rack-varjao",
    nome: "Rack Varjão",
    medidas: { largura: 140, profundidade: 38, altura: 168 },
    corpo: ["M0 0 H140 V168 H0 Z", "M0 42 H140 M0 84 H140 M0 126 H140", "M70 0 V168"],
    desenhoAlt: "Elevação frontal do Rack Varjão, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "estante-tramo",
    nome: "Estante Tramo",
    medidas: { largura: 100, profundidade: 34, altura: 148 },
    corpo: ["M0 0 H100 V148 H0 Z", "M0 37 H100 M0 74 H100 M0 111 H100"],
    desenhoAlt: "Elevação frontal da Estante Tramo, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "aparador-sereno",
    nome: "Aparador Sereno",
    medidas: { largura: 150, profundidade: 43, altura: 82 },
    corpo: ["M0 0 H150 V62 H0 Z", "M75 0 V62", "M10 62 V82 M140 62 V82"],
    desenhoAlt: "Elevação frontal do Aparador Sereno, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "aparador-pedra",
    nome: "Aparador Pedra",
    medidas: { largura: 175, profundidade: 47, altura: 86 },
    corpo: [
      "M0 0 H175 V10 H0 Z",
      "M0 10 H175 V66 H0 Z",
      "M87 10 V66",
      "M12 66 V86 M163 66 V86",
    ],
    desenhoAlt: "Elevação frontal do Aparador Pedra, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "aparador-junco",
    nome: "Aparador Junco",
    medidas: { largura: 130, profundidade: 40, altura: 78 },
    corpo: [
      "M0 0 H130 V58 H0 Z",
      "M65 0 V58",
      "M8 8 H57 V50 H8 Z",
      "M73 8 H122 V50 H73 Z",
      "M10 58 V78 M120 58 V78",
    ],
    desenhoAlt: "Elevação frontal do Aparador Junco, com as cotas de largura e altura",
  }),

  // §3.2's famílias, in §3.2's row order. `Vargem`, `Tramo`, `Bruma`, `Cais`,
  // `Seixo`, `Luar`, `Junco` and `Ripado` also name pieces in other rooms: §3.5
  // is explicit that those are distinct famílias with distinct slugs, sharing
  // nothing but the atelier's line names, so `comoda-vargem` and
  // `mesa-de-jantar-vargem` are two famílias and never one.
  familiaComElevacao({
    slug: "cama-nuvem",
    nome: "Cama Nuvem",
    medidas: { largura: 172, profundidade: 208, altura: 100 },
    corpo: [
      "M0 0 H172 V62 H0 Z",
      "M0 62 H172 V88 H0 Z",
      "M12 88 V100 M160 88 V100",
      "M14 14 H158",
    ],
    desenhoAlt: "Elevação frontal da Cama Nuvem, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "cama-orvalho",
    nome: "Cama Orvalho",
    medidas: { largura: 168, profundidade: 205, altura: 45 },
    corpo: ["M0 0 H168 V10 H0 Z", "M0 10 H168 V34 H0 Z", "M8 34 V45 M160 34 V45"],
    desenhoAlt: "Elevação frontal da Cama Orvalho, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "cama-tatami",
    nome: "Cama Tatami",
    medidas: { largura: 148, profundidade: 202, altura: 38 },
    corpo: [
      "M0 0 H148 V8 H0 Z",
      "M0 8 H148 V28 H0 Z",
      "M74 8 V28",
      "M6 28 V38 M142 28 V38",
    ],
    desenhoAlt: "Elevação frontal da Cama Tatami, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "cama-abrigo",
    nome: "Cama Abrigo",
    medidas: { largura: 200, profundidade: 215, altura: 110 },
    corpo: [
      "M0 0 H200 V70 H0 Z",
      "M0 70 H200 V96 H0 Z",
      "M14 16 H186 M14 44 H186",
      "M12 96 V110 M188 96 V110",
    ],
    desenhoAlt: "Elevação frontal da Cama Abrigo, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "cabeceira-vela",
    nome: "Cabeceira Vela",
    medidas: { largura: 160, profundidade: 10, altura: 100 },
    // No legs: the piece hangs on a francesa, which is what its descrição says
    // and what an elevation of it has to show.
    corpo: ["M0 0 H160 V100 H0 Z", "M10 10 H150 V90 H10 Z"],
    desenhoAlt: "Elevação frontal da Cabeceira Vela, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "cabeceira-ripado",
    nome: "Cabeceira Ripado",
    medidas: { largura: 180, profundidade: 12, altura: 110 },
    corpo: [
      "M0 0 H180 V96 H0 Z",
      "M20 0 V96 M40 0 V96 M60 0 V96 M80 0 V96",
      "M100 0 V96 M120 0 V96 M140 0 V96 M160 0 V96",
      "M9 96 V110 M171 96 V110",
    ],
    desenhoAlt: "Elevação frontal da Cabeceira Ripado, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "criado-mudo-seixo",
    nome: "Criado-mudo Seixo",
    medidas: { largura: 50, profundidade: 40, altura: 55 },
    // One gaveta, so one drawer front and no divider — the same N−1 reading
    // the cômodas and guarda-roupas below use.
    corpo: ["M0 0 H50 V40 H0 Z", "M5 6 H45 V34 H5 Z", "M6 40 V55 M44 40 V55"],
    desenhoAlt: "Elevação frontal do Criado-mudo Seixo, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "criado-mudo-luar",
    nome: "Criado-mudo Luar",
    medidas: { largura: 56, profundidade: 44, altura: 60 },
    corpo: ["M0 0 H56 V44 H0 Z", "M0 22 H56", "M7 44 V60 M49 44 V60"],
    desenhoAlt: "Elevação frontal do Criado-mudo Luar, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "criado-mudo-junco",
    nome: "Criado-mudo Junco",
    medidas: { largura: 46, profundidade: 38, altura: 52 },
    corpo: ["M0 0 H46 V38 H0 Z", "M5 6 H41 V32 H5 Z", "M6 38 V52 M40 38 V52"],
    desenhoAlt: "Elevação frontal do Criado-mudo Junco, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "comoda-vargem",
    nome: "Cômoda Vargem",
    medidas: { largura: 110, profundidade: 47, altura: 82 },
    corpo: [
      "M0 0 H110 V64 H0 Z",
      "M0 13 H110 M0 26 H110 M0 39 H110 M0 52 H110",
      "M9 64 V82 M101 64 V82",
    ],
    desenhoAlt: "Elevação frontal da Cômoda Vargem, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "comoda-tramo",
    nome: "Cômoda Tramo",
    medidas: { largura: 128, profundidade: 50, altura: 88 },
    corpo: [
      "M0 0 H128 V70 H0 Z",
      "M64 0 V70",
      "M0 23 H128 M0 46 H128",
      "M10 70 V88 M118 70 V88",
    ],
    desenhoAlt: "Elevação frontal da Cômoda Tramo, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "comoda-bruma",
    nome: "Cômoda Bruma",
    medidas: { largura: 92, profundidade: 45, altura: 78 },
    corpo: [
      "M0 0 H92 V62 H0 Z",
      "M0 15 H92 M0 30 H92 M0 46 H92",
      "M8 62 V78 M84 62 V78",
    ],
    desenhoAlt: "Elevação frontal da Cômoda Bruma, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "guarda-roupa-cais",
    nome: "Guarda-roupa Cais",
    medidas: { largura: 240, profundidade: 64, altura: 236 },
    corpo: [
      "M0 0 H240 V236 H0 Z",
      "M48 0 V236 M96 0 V236 M144 0 V236 M192 0 V236",
      "M0 212 H240",
    ],
    desenhoAlt: "Elevação frontal do Guarda-roupa Cais, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "guarda-roupa-ripado",
    nome: "Guarda-roupa Ripado",
    medidas: { largura: 180, profundidade: 58, altura: 220 },
    corpo: [
      "M0 0 H180 V220 H0 Z",
      "M45 0 V220 M90 0 V220 M135 0 V220",
      "M0 200 H180",
    ],
    desenhoAlt: "Elevação frontal do Guarda-roupa Ripado, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "guarda-roupa-bruma",
    nome: "Guarda-roupa Bruma",
    medidas: { largura: 200, profundidade: 60, altura: 228 },
    corpo: [
      "M0 0 H200 V228 H0 Z",
      "M50 0 V228 M100 0 V228 M150 0 V228",
      "M0 206 H200",
    ],
    desenhoAlt: "Elevação frontal do Guarda-roupa Bruma, com as cotas de largura e altura",
  }),

  familiaComElevacao({
    slug: "mesa-taipa",
    nome: "Mesa Taipa",
    medidas: { largura: 150, profundidade: 82, altura: 76 },
    corpo: ["M0 0 H150 V6 H0 Z", "M10 6 H140 V12 H10 Z", "M12 12 V76 M138 12 V76"],
    desenhoAlt: "Elevação frontal da Mesa Taipa, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "mesa-orla",
    nome: "Mesa Orla",
    medidas: { largura: 130, profundidade: 78, altura: 74 },
    corpo: ["M0 0 H130 V5 H0 Z", "M9 5 H121 V10 H9 Z", "M11 10 V74 M119 10 V74"],
    desenhoAlt: "Elevação frontal da Mesa Orla, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "mesa-pedra",
    nome: "Mesa Pedra",
    medidas: { largura: 180, profundidade: 90, altura: 78 },
    // Two slab legs in carvalho rather than four posts — the tampo is mármore,
    // and the drawing has to show what carries it.
    corpo: ["M0 0 H180 V4 H0 Z", "M24 4 H48 V78 H24 Z", "M132 4 H156 V78 H132 Z"],
    desenhoAlt: "Elevação frontal da Mesa Pedra, com as cotas de largura e altura",
  }),

  familiaComElevacao({
    slug: "cadeira-junco",
    nome: "Cadeira Junco",
    medidas: { largura: 52, profundidade: 56, altura: 88 },
    corpo: ["M6 42 H46 V46 H6 Z", "M8 0 H44 V42 H8 Z", "M8 46 V88 M44 46 V88", "M8 72 H44"],
    desenhoAlt: "Elevação frontal da Cadeira Junco, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "cadeira-vime",
    nome: "Cadeira Vime",
    medidas: { largura: 48, profundidade: 52, altura: 84 },
    corpo: [
      "M6 0 H42 V38 H6 Z",
      "M6 10 H42 M6 20 H42 M6 30 H42",
      "M3 38 H45 V44 H3 Z",
      "M7 44 V84 M41 44 V84",
      "M7 70 H41",
    ],
    desenhoAlt: "Elevação frontal da Cadeira Vime, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "cadeira-tramo",
    nome: "Cadeira Tramo",
    // The aço carbono language: tube posts and two horizontal rails where the
    // wooden famílias carry a panel.
    medidas: { largura: 44, profundidade: 50, altura: 80 },
    corpo: [
      "M5 0 V36 M39 0 V36",
      "M5 6 H39 M5 18 H39",
      "M2 36 H42 V41 H2 Z",
      "M5 41 V80 M39 41 V80",
      "M5 66 H39",
    ],
    desenhoAlt: "Elevação frontal da Cadeira Tramo, com as cotas de largura e altura",
  }),

  familiaComElevacao({
    slug: "banqueta-seixo",
    nome: "Banqueta Seixo",
    medidas: { largura: 40, profundidade: 40, altura: 68 },
    corpo: ["M0 0 H40 V5 H0 Z", "M6 5 V68 M34 5 V68", "M8 46 H32"],
    desenhoAlt: "Elevação frontal da Banqueta Seixo, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "banqueta-vau",
    nome: "Banqueta Vau",
    medidas: { largura: 42, profundidade: 42, altura: 72 },
    corpo: ["M0 0 H42 V6 H0 Z", "M7 6 V72 M35 6 V72", "M9 48 H33"],
    desenhoAlt: "Elevação frontal da Banqueta Vau, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "banqueta-tramo",
    nome: "Banqueta Tramo",
    medidas: { largura: 38, profundidade: 38, altura: 64 },
    corpo: ["M0 0 H38 V4 H0 Z", "M4 4 V64 M34 4 V64", "M4 42 H34"],
    desenhoAlt: "Elevação frontal da Banqueta Tramo, com as cotas de largura e altura",
  }),

  familiaComElevacao({
    slug: "armario-cais",
    nome: "Armário Cais",
    // Cais is the tall casework language — the same door-per-module reading the
    // guarda-roupas above use, on a shallower box.
    medidas: { largura: 150, profundidade: 52, altura: 215 },
    corpo: ["M0 0 H150 V215 H0 Z", "M50 0 V196 M100 0 V196", "M0 196 H150"],
    desenhoAlt: "Elevação frontal do Armário Cais, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "armario-ripado",
    nome: "Armário Ripado",
    medidas: { largura: 120, profundidade: 46, altura: 200 },
    corpo: [
      "M0 0 H120 V200 H0 Z",
      "M60 0 V182",
      "M0 182 H120",
      "M15 0 V182 M30 0 V182 M45 0 V182 M75 0 V182 M90 0 V182 M105 0 V182",
    ],
    desenhoAlt: "Elevação frontal do Armário Ripado, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "armario-bruma",
    nome: "Armário Bruma",
    medidas: { largura: 90, profundidade: 42, altura: 185 },
    corpo: ["M0 0 H90 V185 H0 Z", "M45 0 V168", "M0 168 H90"],
    desenhoAlt: "Elevação frontal do Armário Bruma, com as cotas de largura e altura",
  }),

  familiaComElevacao({
    slug: "carrinho-roldana",
    nome: "Carrinho Roldana",
    // Two shelves and the castors the família is named for.
    medidas: { largura: 56, profundidade: 44, altura: 68 },
    corpo: [
      "M0 0 H56 V4 H0 Z",
      "M0 30 H56 V34 H0 Z",
      "M5 4 V60 M51 4 V60",
      "M2 60 H10 V68 H2 Z",
      "M46 60 H54 V68 H46 Z",
    ],
    desenhoAlt: "Elevação frontal do Carrinho Roldana, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "carrinho-junco",
    nome: "Carrinho Junco",
    medidas: { largura: 44, profundidade: 40, altura: 60 },
    corpo: ["M0 0 H44 V4 H0 Z", "M0 27 H44 V31 H0 Z", "M4 4 V60 M40 4 V60"],
    desenhoAlt: "Elevação frontal do Carrinho Junco, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "mesa-de-apoio-luar",
    nome: "Mesa de Apoio Luar",
    medidas: { largura: 66, profundidade: 50, altura: 74 },
    corpo: ["M0 0 H66 V5 H0 Z", "M26 5 H40 V66 H26 Z", "M14 66 H52 V74 H14 Z"],
    desenhoAlt: "Elevação frontal da Mesa de Apoio Luar, com as cotas de largura e altura",
  }),

  familiaComElevacao({
    slug: "escrivaninha-tramo",
    nome: "Escrivaninha Tramo",
    // Tramo is the aço carbono language: bent tube and one diagonal brace.
    medidas: { largura: 110, profundidade: 55, altura: 74 },
    corpo: ["M0 0 H110 V4 H0 Z", "M6 4 V74 M104 4 V74", "M6 38 H104", "M6 74 L104 38"],
    desenhoAlt: "Elevação frontal da Escrivaninha Tramo, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "escrivaninha-vau",
    nome: "Escrivaninha Vau",
    // Vau is the span: two splayed trestles and nothing between the legs.
    medidas: { largura: 130, profundidade: 60, altura: 75 },
    corpo: ["M0 0 H130 V5 H0 Z", "M14 5 L4 75 M116 5 L126 75", "M9 40 H121"],
    desenhoAlt: "Elevação frontal da Escrivaninha Vau, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "escrivaninha-cais",
    nome: "Escrivaninha Cais",
    // Cais is the tall casework language, here as a three-drawer pedestal under
    // one side and open vão under the other.
    medidas: { largura: 160, profundidade: 70, altura: 78 },
    corpo: [
      "M0 0 H160 V5 H0 Z",
      "M110 5 H155 V70 H110 Z",
      "M110 27 H155 M110 49 H155",
      "M5 5 V78",
      "M114 70 V78 M151 70 V78",
    ],
    desenhoAlt: "Elevação frontal da Escrivaninha Cais, com as cotas de largura e altura",
  }),

  familiaComElevacao({
    slug: "cadeira-de-trabalho-junco",
    nome: "Cadeira de Trabalho Junco",
    // The palhinha language on four legs — the assento reads at 44 cm.
    medidas: { largura: 44, profundidade: 48, altura: 78 },
    corpo: [
      "M4 0 H40 V22 H4 Z",
      "M4 12 H40",
      "M0 34 H44 V40 H0 Z",
      "M6 22 V34 M38 22 V34",
      "M4 40 V78 M40 40 V78",
      "M4 66 H40",
    ],
    desenhoAlt:
      "Elevação frontal da Cadeira de Trabalho Junco, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "cadeira-de-trabalho-ripado",
    nome: "Cadeira de Trabalho Ripado",
    medidas: { largura: 48, profundidade: 52, altura: 84 },
    corpo: [
      "M5 0 H43 V26 H5 Z",
      "M5 7 H43 M5 14 H43 M5 21 H43",
      "M1 38 H47 V44 H1 Z",
      "M7 26 V38 M41 26 V38",
      "M5 44 V84 M43 44 V84",
      "M5 70 H43",
    ],
    desenhoAlt:
      "Elevação frontal da Cadeira de Trabalho Ripado, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "cadeira-de-trabalho-orla",
    nome: "Cadeira de Trabalho Orla",
    // The only giratória in the catalogue: column, spread base and castors.
    medidas: { largura: 54, profundidade: 58, altura: 90 },
    corpo: [
      "M6 0 H48 V30 H6 Z",
      "M27 30 V42",
      "M4 42 H50 V48 H4 Z",
      "M25 48 V74",
      "M27 74 L8 86 M27 74 L46 86",
      "M8 86 V90 M46 86 V90",
    ],
    desenhoAlt: "Elevação frontal da Cadeira de Trabalho Orla, com as cotas de largura e altura",
  }),

  familiaComElevacao({
    slug: "estante-bruma",
    nome: "Estante Bruma",
    // Four shelves in one bay — the narrow case, no divider.
    medidas: { largura: 90, profundidade: 32, altura: 160 },
    corpo: ["M0 0 H90 V160 H0 Z", "M0 40 H90 M0 76 H90 M0 112 H90 M0 148 H90"],
    desenhoAlt: "Elevação frontal da Estante Bruma, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "estante-vargem",
    nome: "Estante Vargem",
    medidas: { largura: 110, profundidade: 38, altura: 180 },
    corpo: [
      "M0 0 H110 V180 H0 Z",
      "M0 30 H110 M0 60 H110 M0 90 H110 M0 120 H110 M0 150 H110",
      "M55 0 V180",
    ],
    desenhoAlt: "Elevação frontal da Estante Vargem, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "estante-mirante",
    nome: "Estante Mirante",
    // Two montantes running the full height, which is the piece's whole idea.
    medidas: { largura: 140, profundidade: 42, altura: 200 },
    corpo: [
      "M0 0 H140 V200 H0 Z",
      "M0 28 H140 M0 56 H140 M0 84 H140 M0 112 H140 M0 140 H140 M0 168 H140",
      "M46 0 V200 M94 0 V200",
    ],
    desenhoAlt: "Elevação frontal da Estante Mirante, com as cotas de largura e altura",
  }),

  familiaComElevacao({
    slug: "luminaria-de-mesa-junco",
    nome: "Luminária de Mesa Junco",
    medidas: { largura: 20, profundidade: 20, altura: 40 },
    corpo: ["M2 0 H18 L20 16 H0 Z", "M10 16 V37", "M4 37 H16 V40 H4 Z"],
    desenhoAlt: "Elevação frontal da Luminária de Mesa Junco, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "luminaria-de-mesa-seixo",
    nome: "Luminária de Mesa Seixo",
    // Seixo is the pebble: a turned ceramic base under a short stem.
    medidas: { largura: 22, profundidade: 22, altura: 42 },
    corpo: ["M3 0 H19 L21 12 H1 Z", "M11 12 V26", "M4 42 C4 26 18 26 18 42 Z"],
    desenhoAlt: "Elevação frontal da Luminária de Mesa Seixo, com as cotas de largura e altura",
  }),
  familiaComElevacao({
    slug: "luminaria-de-mesa-farol",
    nome: "Luminária de Mesa Farol",
    // A closed four-face lantern, which is why the light only goes down.
    medidas: { largura: 26, profundidade: 26, altura: 50 },
    corpo: ["M4 4 H22 V26 H4 Z", "M4 4 L13 0 L22 4", "M13 26 V44", "M6 44 H20 V50 H6 Z"],
    desenhoAlt: "Elevação frontal da Luminária de Mesa Farol, com as cotas de largura e altura",
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

  // §3.1 row 2 — the hero's second acabamento: same família, same geometry
  {
    slug: "sofa-heron-boucle-areia",
    nome: "Sofá Héron",
    familia: "sofa-heron",
    acabamento: "Bouclé Areia",
    tipo: "sofas",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 2,
    precoTabela: 1140000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 42, unidade: "cm" },
      { rotulo: "Quantidade de lugares", valor: 3, unidade: "un" },
      { rotulo: "Quantidade de almofadas", valor: 5, unidade: "un" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 6,
    imagens: [
      {
        src: unsplash("1524758631624-e2822e304c36"),
        alt: "Sofá Héron em bouclé areia sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um sofá de três lugares em bouclé areia, com a mesma estrutura em carvalho maciço do acabamento em linho. A lã é presa por grampeamento oculto sob o rodapé, e as quinas levam costura dupla porque é onde a trama abre primeiro. Pede a parede mais longa da sala, com passagem livre dos dois lados.",
  },

  // §3.1 row 3 — precoDe, one of the three pieces §3.8 marks down
  {
    slug: "sofa-orla-linho-areia",
    nome: "Sofá Orla",
    familia: "sofa-orla",
    acabamento: "Linho Areia",
    tipo: "sofas",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 3,
    precoTabela: 760000,
    precoDe: 890000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 41, unidade: "cm" },
      { rotulo: "Quantidade de lugares", valor: 3, unidade: "un" },
      { rotulo: "Quantidade de almofadas", valor: 4, unidade: "un" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1567538096630-e0c55bd6374c"),
        alt: "Sofá Orla em linho areia sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um sofá de três lugares em linho areia, dimensionado para salas em que a circulação conta mais que o volume. O braço é estreito e a estrutura interna em carvalho leva cavilhas nos encontros, o que mantém o encosto firme sem travessa aparente. Cabe na parede de uma sala pequena e ainda deixa espaço para uma mesa de apoio.",
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

  // §3.1 row 5
  {
    slug: "sofa-maruja-linho-carvao",
    nome: "Sofá Marujá",
    familia: "sofa-maruja",
    acabamento: "Linho Carvão",
    tipo: "sofas",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 5,
    precoTabela: 840000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 43, unidade: "cm" },
      { rotulo: "Quantidade de lugares", valor: 3, unidade: "un" },
      { rotulo: "Quantidade de almofadas", valor: 5, unidade: "un" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 5,
    imagens: [
      {
        src: unsplash("1555041469-a586c61ea9bc"),
        alt: "Sofá Marujá em linho carvão sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um sofá de três lugares em linho carvão, feito para quem usa a sala à noite e quer a peça recuada no ambiente. O enchimento do assento combina espuma firme e manta acrílica, e o tecido é destacável nas almofadas do encosto. Fica bem no centro da sala, de costas para a passagem, sobre um tapete que o ancora.",
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

  // §3.1 row 8
  {
    slug: "poltrona-sagui-couro-nogueira",
    nome: "Poltrona Saguí",
    familia: "poltrona-sagui",
    acabamento: "Couro Nogueira",
    tipo: "poltronas",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 8,
    precoTabela: 560000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 44, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 130, unidade: "kg" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 5,
    imagens: [
      {
        src: unsplash("1550226891-ef816aed4a98"),
        alt: "Poltrona Saguí em couro nogueira sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma poltrona de braços largos em couro natural, pensada para a leitura longa e para o descanso depois dela. O couro é curtido ao vegetal e costurado em painéis, o que permite trocar um deles anos depois sem refazer a peça inteira. Ocupa o canto da sala sem pedir mesa nem apoio ao lado.",
  },

  // §3.1 row 9 — the envio-imediato half of carrinho.md's divergent-prazo pair
  {
    slug: "mesa-de-centro-seixo-freijo",
    nome: "Mesa de Centro Seixo",
    familia: "mesa-de-centro-seixo",
    acabamento: "Freijó",
    tipo: "mesas-de-centro",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 9,
    precoTabela: 240000,
    medidasExtras: [],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1513506003901-1e6a229e2d15"),
        alt: "Mesa de Centro Seixo em freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma mesa de centro em freijó maciço, baixa o bastante para não competir com a linha do assento. O tampo é colado em lâminas alternadas contra o empeno, e os pés entram por encaixe cônico, sem ferragem à vista. Fica à frente do sofá, a cerca de quarenta centímetros, onde o alcance do braço resolve.",
  },

  // §3.1 row 10 — coleção Reboco
  {
    slug: "mesa-de-centro-luar-marmore-off-white",
    nome: "Mesa de Centro Luar",
    familia: "mesa-de-centro-luar",
    acabamento: "Mármore Off-white",
    tipo: "mesas-de-centro",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: ["reboco"],
    ordem: 10,
    precoTabela: 490000,
    medidasExtras: [],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 7,
    imagens: [
      {
        src: unsplash("1616486338812-3dadae4b4ace"),
        alt: "Mesa de Centro Luar em mármore off-white sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma mesa de centro com tampo em mármore off-white sobre base em carvalho, para salas de pouca luz direta. O mármore é lapidado com o topo levemente boleado, acabamento que evita a lasca na quina e mostra o veio na espessura. Ancora a área do sofá e aceita bandeja, livro e copo sem parecer cheia.",
  },

  // §3.1 row 11
  {
    slug: "mesa-de-centro-vau-jatoba",
    nome: "Mesa de Centro Vau",
    familia: "mesa-de-centro-vau",
    acabamento: "Jatobá",
    tipo: "mesas-de-centro",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 11,
    precoTabela: 310000,
    medidasExtras: [],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1513506003901-1e6a229e2d15"),
        alt: "Mesa de Centro Vau em jatobá sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma mesa de centro em jatobá maciço, de proporção alongada para acompanhar sofás de três lugares. As bordas são chanfradas a plaina manual, e o tampo repousa sobre travessas encaixadas em espiga passante, visível nas laterais. Fica bem entre o sofá e a estante, onde o comprimento resolve a passagem sem esbarrão.",
  },

  // §3.1 row 12 — the mesa-de-jantar pair's first acabamento
  {
    slug: "mesa-de-jantar-vargem-carvalho",
    nome: "Mesa de Jantar Vargem",
    familia: "mesa-de-jantar-vargem",
    acabamento: "Carvalho",
    tipo: "mesas-de-jantar",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 12,
    precoTabela: 890000,
    medidasExtras: [
      { rotulo: "Quantidade de lugares", valor: 8, unidade: "un" },
      { rotulo: "Espessura do tampo", valor: 4, unidade: "cm" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 6,
    imagens: [
      {
        src: unsplash("1594026112284-02bb6f3352fe"),
        alt: "Mesa de Jantar Vargem em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma mesa de jantar em carvalho maciço para oito lugares, dimensionada para a refeição que se estende depois do prato. O tampo é montado em réguas alternadas pelo veio e recebe óleo, não verniz, para que um risco possa ser lixado no lugar. Pede a parte mais larga da sala, com sessenta centímetros livres em volta.",
  },

  // §3.1 row 13 — the second acabamento: same família, same geometry
  {
    slug: "mesa-de-jantar-vargem-nogueira",
    nome: "Mesa de Jantar Vargem",
    familia: "mesa-de-jantar-vargem",
    acabamento: "Nogueira",
    tipo: "mesas-de-jantar",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 13,
    precoTabela: 960000,
    medidasExtras: [
      { rotulo: "Quantidade de lugares", valor: 8, unidade: "un" },
      { rotulo: "Espessura do tampo", valor: 4, unidade: "cm" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 7,
    imagens: [
      {
        src: unsplash("1594026112284-02bb6f3352fe"),
        alt: "Mesa de Jantar Vargem em nogueira sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma mesa de jantar em nogueira maciça para oito lugares, com a mesma estrutura do acabamento em carvalho e um tom bem mais escuro. A nogueira é selecionada por veio contínuo entre as réguas do tampo, emenda que só aparece de perto. Serve à sala que já tem madeira clara no piso e pede contraste na altura da mesa.",
  },

  // §3.1 row 14 — coleção Serra, freteGratis sudeste
  {
    slug: "mesa-de-jantar-ilhota-jatoba",
    nome: "Mesa de Jantar Ilhota",
    familia: "mesa-de-jantar-ilhota",
    acabamento: "Jatobá",
    tipo: "mesas-de-jantar",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: ["serra"],
    ordem: 14,
    precoTabela: 1280000,
    medidasExtras: [
      { rotulo: "Quantidade de lugares", valor: 10, unidade: "un" },
      { rotulo: "Espessura do tampo", valor: 5, unidade: "cm" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 8,
    freteGratis: "sudeste",
    imagens: [
      {
        src: unsplash("1594026112284-02bb6f3352fe"),
        alt: "Mesa de Jantar Ilhota em jatobá sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma mesa de jantar em jatobá maciço para dez lugares, feita para a casa que recebe com frequência. O tampo tem cinco centímetros de espessura e é sustentado por duas vigas encaixadas em rabo de andorinha, sem pé no meio do vão. Ocupa a sala inteira de jantar e dispensa aparador para servir, porque sobra tampo.",
  },

  // §3.1 row 15
  {
    slug: "estante-cais-freijo",
    nome: "Estante Cais",
    familia: "estante-cais",
    acabamento: "Freijó",
    tipo: "racks-e-estantes",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 15,
    precoTabela: 640000,
    medidasExtras: [
      { rotulo: "Prateleiras", valor: 5, unidade: "un" },
      { rotulo: "Capacidade por prateleira", valor: 30, unidade: "kg" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 6,
    imagens: [
      {
        src: unsplash("1567016432779-094069958ea5"),
        alt: "Estante Cais em freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma estante alta em freijó maciço, com cinco prateleiras para livros e peças que ficam à vista. As prateleiras são encaixadas em rasgos usinados nos montantes, o que dispensa cantoneira e mantém o vão limpo de ferragem. Vai contra a parede sem janela da sala, onde a altura não disputa com a luz.",
  },

  // §3.1 row 16 — precoDe
  {
    slug: "rack-varjao-carvalho",
    nome: "Rack Varjão",
    familia: "rack-varjao",
    acabamento: "Carvalho",
    tipo: "racks-e-estantes",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 16,
    precoTabela: 520000,
    precoDe: 590000,
    medidasExtras: [
      { rotulo: "Prateleiras", valor: 4, unidade: "un" },
      { rotulo: "Capacidade por prateleira", valor: 25, unidade: "kg" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1567016432779-094069958ea5"),
        alt: "Rack Varjão em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um móvel vertical em carvalho, com quatro prateleiras e passagem de fiação no fundo de cada nível. Os montantes são de madeira maciça e as costas em painel ripado, que ventila o equipamento sem deixar o cabo à mostra. Fica na parede oposta ao sofá e organiza a televisão e o que vive embaixo dela.",
  },

  // §3.1 row 17 — the room's only aço piece
  {
    slug: "estante-tramo-aco-carvao",
    nome: "Estante Tramo",
    familia: "estante-tramo",
    acabamento: "Aço Carvão",
    tipo: "racks-e-estantes",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 17,
    precoTabela: 410000,
    medidasExtras: [
      { rotulo: "Prateleiras", valor: 4, unidade: "un" },
      { rotulo: "Capacidade por prateleira", valor: 40, unidade: "kg" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1567016432779-094069958ea5"),
        alt: "Estante Tramo em aço carvão sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma estante em aço carbono com pintura eletrostática carvão, de linha fina para não pesar visualmente na sala. Os montantes são perfis dobrados de dois milímetros e as prateleiras apoiam em abas rebitadas, montagem que aceita carga sem entortar. Serve o canto estreito ao lado da janela, onde a madeira ficaria maciça demais.",
  },

  // §3.1 row 18 — coleção Serra
  {
    slug: "aparador-sereno-carvalho",
    nome: "Aparador Sereno",
    familia: "aparador-sereno",
    acabamento: "Carvalho",
    tipo: "aparadores",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: ["serra"],
    ordem: 18,
    precoTabela: 460000,
    medidasExtras: [],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 5,
    imagens: [
      {
        src: unsplash("1598300042247-d088f8ab3a91"),
        alt: "Aparador Sereno em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um aparador em carvalho maciço, com duas portas e altura de apoio para servir de pé. As portas correm sobre trilho embutido no tampo inferior, solução que dispensa puxador e mantém a frente inteira lisa. Fica no corredor de circulação da sala, onde guarda a louça que não cabe na cozinha.",
  },

  // §3.1 row 19 — coleção Reboco
  {
    slug: "aparador-pedra-marmore-cru",
    nome: "Aparador Pedra",
    familia: "aparador-pedra",
    acabamento: "Mármore Cru",
    tipo: "aparadores",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: ["reboco"],
    ordem: 19,
    precoTabela: 720000,
    medidasExtras: [],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 8,
    imagens: [
      {
        src: unsplash("1598300042247-d088f8ab3a91"),
        alt: "Aparador Pedra em mármore cru sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um aparador com tampo em mármore cru sobre corpo em carvalho, dimensionado para a parede longa da sala. O tampo é impermeabilizado de fábrica e a espessura mostra o veio na quina, que é onde a pedra costuma ser cortada rente. Recebe o que chega da rua com a gente e a bandeja que serve a mesa ao lado.",
  },

  // §3.1 row 20
  {
    slug: "aparador-junco-palhinha-freijo",
    nome: "Aparador Junco",
    familia: "aparador-junco",
    acabamento: "Palhinha e Freijó",
    tipo: "aparadores",
    ambientePrincipal: "sala",
    ambientes: ["sala"],
    colecoes: [],
    ordem: 20,
    precoTabela: 340000,
    medidasExtras: [],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1598300042247-d088f8ab3a91"),
        alt: "Aparador Junco em palhinha e freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um aparador em freijó com portas em palhinha trançada, leve o bastante para uma sala pequena. A palhinha é montada sobre caixilho ranhurado e pode ser refeita sem trocar a porta, técnica que o atelier mantém em toda a linha. Vai atrás do sofá ou sob um quadro, onde a trama respira contra a parede.",
  },

  // §3.2 row 21 — the room's full-coverage piece: all three papel roles, and
  // the only cota §7.3's budget spends in Quarto
  {
    slug: "cama-nuvem-linho-cru",
    nome: "Cama Nuvem",
    familia: "cama-nuvem",
    acabamento: "Linho Cru",
    tipo: "camas",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 21,
    precoTabela: 820000,
    medidasExtras: [
      { rotulo: "Altura do estrado", valor: 30, unidade: "cm" },
      { rotulo: "Colchão recomendado", valor: 158, unidade: "cm" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 6,
    imagens: [
      {
        src: unsplash("1505693416388-ac5ce068fe85"),
        alt: "Cama Nuvem em linho cru sobre reboco",
        papel: "principal",
        cotas: ["largura"],
      },
      {
        src: unsplash("1583847268964-b28dc8f51f92"),
        alt: "Cama Nuvem em Quarto",
        papel: "ambientada",
        cotas: [],
      },
      {
        src: unsplash("1540574163026-643ea20ade25"),
        alt: "A costura que fecha a quina da cabeceira estofada",
        papel: "detalhe",
        cotas: [],
      },
    ],
    descricao:
      "Uma cama de casal em linho cru, com cabeceira estofada alta o bastante para servir de encosto na leitura da noite. O estofamento é grampeado por trás do caixilho e o estrado apoia em travessas de carvalho, sem parafuso à vista na face interna. Ocupa a parede oposta à janela, onde a cabeceira clara devolve a pouca luz que entra.",
  },

  // §3.2 row 22 — the second acabamento: same família, same geometry
  {
    slug: "cama-nuvem-boucle-areia",
    nome: "Cama Nuvem",
    familia: "cama-nuvem",
    acabamento: "Bouclé Areia",
    tipo: "camas",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 22,
    precoTabela: 910000,
    medidasExtras: [
      { rotulo: "Altura do estrado", valor: 30, unidade: "cm" },
      { rotulo: "Colchão recomendado", valor: 158, unidade: "cm" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 6,
    imagens: [
      {
        src: unsplash("1522708323590-d24dbb6b0267"),
        alt: "Cama Nuvem em bouclé areia sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cama de casal em bouclé areia, com a mesma cabeceira alta e o mesmo estrado em carvalho do acabamento em linho. A lã é montada sobre espuma de densidade média e a costura das quinas é dupla, porque é ali que a trama abre primeiro. Pede a parede oposta à janela, com passagem livre dos dois lados.",
  },

  // §3.2 row 23
  {
    slug: "cama-orvalho-carvalho",
    nome: "Cama Orvalho",
    familia: "cama-orvalho",
    acabamento: "Carvalho",
    tipo: "camas",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 23,
    precoTabela: 740000,
    medidasExtras: [
      { rotulo: "Altura do estrado", valor: 26, unidade: "cm" },
      { rotulo: "Colchão recomendado", valor: 158, unidade: "cm" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1616594039964-ae9021a400a0"),
        alt: "Cama Orvalho em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cama baixa em carvalho maciço, de cabeceira curta, para quartos em que o pé-direito pede horizontalidade. As travessas encaixam por espiga e cavilha, sem ferragem aparente, e o estrado ripado dispensa base de molas sob o colchão. Fica bem centralizada na parede, com espaço para um criado-mudo de cada lado.",
  },

  // §3.2 row 24
  {
    slug: "cama-tatami-freijo",
    nome: "Cama Tatami",
    familia: "cama-tatami",
    acabamento: "Freijó",
    tipo: "camas",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 24,
    precoTabela: 680000,
    medidasExtras: [
      { rotulo: "Altura do estrado", valor: 20, unidade: "cm" },
      { rotulo: "Colchão recomendado", valor: 138, unidade: "cm" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 5,
    imagens: [
      {
        src: unsplash("1595526114035-0d45ed16cfbf"),
        alt: "Cama Tatami em freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cama de plataforma em freijó, rente ao chão, desenhada para quartos pequenos que ganham com o volume baixo. A base avança dez centímetros além do colchão e funciona como apoio, e as ripas do estrado são encaixadas uma a uma no caixilho. Assenta bem sobre tapete, num quarto em que o piso conta tanto quanto as paredes.",
  },

  // §3.2 row 25 — freteGratis sudeste, §3.8
  {
    slug: "cama-abrigo-couro-argila",
    nome: "Cama Abrigo",
    familia: "cama-abrigo",
    acabamento: "Couro Argila",
    tipo: "camas",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 25,
    precoTabela: 1350000,
    medidasExtras: [
      { rotulo: "Altura do estrado", valor: 34, unidade: "cm" },
      { rotulo: "Colchão recomendado", valor: 193, unidade: "cm" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 8,
    freteGratis: "sudeste",
    imagens: [
      {
        src: unsplash("1560448204-e02f11c3d0e2"),
        alt: "Cama Abrigo em couro argila sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cama king em couro natural argila, de cabeceira envolvente, feita para o quarto que é o cômodo mais usado da casa. O couro é curtido ao vegetal e costurado com pesponto aparente nas laterais da cabeceira, que é onde a peça encosta e marca. Pede a parede mais longa do quarto e circulação de setenta centímetros dos dois lados.",
  },

  // §3.2 row 26 — coleção reboco
  {
    slug: "cabeceira-vela-linho-areia",
    nome: "Cabeceira Vela",
    familia: "cabeceira-vela",
    acabamento: "Linho Areia",
    tipo: "cabeceiras",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: ["reboco"],
    ordem: 26,
    precoTabela: 320000,
    medidasExtras: [],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1505693416388-ac5ce068fe85"),
        alt: "Cabeceira Vela em linho areia sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cabeceira estofada em linho areia, para quem já tem a cama e quer só o encosto. O painel é montado sobre compensado naval de dezoito milímetros e fixado à parede por francesa, o que mantém a peça flutuando acima do colchão. Vai atrás de uma cama baixa, onde a altura de cem centímetros ainda cabe sob a moldura da janela.",
  },

  // §3.2 row 27 — the second acabamento: identical medidas, own slug and preço
  {
    slug: "cabeceira-vela-boucle-cru",
    nome: "Cabeceira Vela",
    familia: "cabeceira-vela",
    acabamento: "Bouclé Cru",
    tipo: "cabeceiras",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 27,
    precoTabela: 360000,
    medidasExtras: [],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 4,
    imagens: [
      {
        src: unsplash("1522708323590-d24dbb6b0267"),
        alt: "Cabeceira Vela em bouclé cru sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cabeceira estofada em bouclé cru, com o mesmo painel e a mesma fixação do acabamento em linho. A lã é esticada sobre espuma firme e presa por grampeamento oculto na face de trás, sem costura na frente que interrompa a trama. Fica acima de uma cama baixa, contra a parede que recebe a luz de lado.",
  },

  // §3.2 row 28
  {
    slug: "cabeceira-ripado-carvalho",
    nome: "Cabeceira Ripado",
    familia: "cabeceira-ripado",
    acabamento: "Carvalho",
    tipo: "cabeceiras",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 28,
    precoTabela: 440000,
    medidasExtras: [],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 4,
    imagens: [
      {
        src: unsplash("1616594039964-ae9021a400a0"),
        alt: "Cabeceira Ripado em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cabeceira ripada em carvalho maciço, para o quarto que quer a marcenaria à vista em vez do estofado. Cada ripa é encaixada em ranhura no caixilho e não leva cola, de modo que a madeira trabalhe com a umidade sem abrir fresta. Ocupa a parede inteira atrás da cama e dispensa quadro acima.",
  },

  // §3.2 row 29
  {
    slug: "criado-mudo-seixo-freijo",
    nome: "Criado-mudo Seixo",
    familia: "criado-mudo-seixo",
    acabamento: "Freijó",
    tipo: "criados-mudos",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 29,
    precoTabela: 185000,
    medidasExtras: [{ rotulo: "Quantidade de gavetas", valor: 1, unidade: "un" }],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1611967164521-abae8fba4668"),
        alt: "Criado-mudo Seixo em freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um criado-mudo em freijó com uma gaveta, dimensionado para caber ao lado de camas baixas. A gaveta corre em corrediça de madeira sobre guias fresadas no próprio corpo, sem metal, e o puxador é um rebaixo no topo da frente. Fica ao lado da cama, na altura em que o abajur ilumina a página sem acordar o outro lado.",
  },

  // §3.2 row 30
  {
    slug: "criado-mudo-luar-nogueira",
    nome: "Criado-mudo Luar",
    familia: "criado-mudo-luar",
    acabamento: "Nogueira",
    tipo: "criados-mudos",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 30,
    precoTabela: 230000,
    medidasExtras: [{ rotulo: "Quantidade de gavetas", valor: 2, unidade: "un" }],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 3,
    imagens: [
      {
        src: unsplash("1558211583-d26f610c1eb1"),
        alt: "Criado-mudo Luar em nogueira sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um criado-mudo em nogueira com duas gavetas, um pouco mais alto que o usual para acompanhar camas de estrado elevado. As gavetas correm sobre corrediças ocultas e o topo leva um rebaixo de dois centímetros, que segura o que se apoia ali durante a noite. Fica ao lado da cama, onde a madeira escura recorta contra a parede clara.",
  },

  // §3.2 row 31 — cross-listed into sala, §3.6: it reads as a side table
  {
    slug: "criado-mudo-junco-palhinha",
    nome: "Criado-mudo Junco",
    familia: "criado-mudo-junco",
    acabamento: "Palhinha e Freijó",
    tipo: "criados-mudos",
    ambientePrincipal: "quarto",
    ambientes: ["quarto", "sala"],
    colecoes: [],
    ordem: 31,
    precoTabela: 168000,
    medidasExtras: [{ rotulo: "Quantidade de gavetas", valor: 1, unidade: "un" }],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1598300042247-d088f8ab3a91"),
        alt: "Criado-mudo Junco em palhinha e freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um criado-mudo em freijó com frente de gaveta em palhinha trançada, leve o bastante para ser levado a outro cômodo. A palhinha é montada sobre caixilho ranhurado e pode ser refeita sem trocar a frente, técnica que o atelier mantém em toda a linha. Serve de apoio ao lado da cama e também de mesa lateral na sala.",
  },

  // §3.2 row 32
  {
    slug: "comoda-vargem-carvalho",
    nome: "Cômoda Vargem",
    familia: "comoda-vargem",
    acabamento: "Carvalho",
    tipo: "comodas",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 32,
    precoTabela: 580000,
    medidasExtras: [{ rotulo: "Quantidade de gavetas", valor: 5, unidade: "un" }],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 5,
    imagens: [
      {
        src: unsplash("1558211583-d26f610c1eb1"),
        alt: "Cômoda Vargem em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cômoda em carvalho maciço com cinco gavetas, para o quarto que não tem armário embutido suficiente. As laterais são unidas ao tampo por rabo de andorinha à vista, e o fundo é encaixado em ranhura em vez de pregado. Fica na parede lateral do quarto, onde o tampo ainda serve de apoio para o que se tira do bolso.",
  },

  // §3.2 row 33 — coleção serra
  {
    slug: "comoda-tramo-nogueira",
    nome: "Cômoda Tramo",
    familia: "comoda-tramo",
    acabamento: "Nogueira",
    tipo: "comodas",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: ["serra"],
    ordem: 33,
    precoTabela: 690000,
    medidasExtras: [{ rotulo: "Quantidade de gavetas", valor: 6, unidade: "un" }],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 6,
    imagens: [
      {
        src: unsplash("1512918728675-ed5a9ecdebfd"),
        alt: "Cômoda Tramo em nogueira sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cômoda em nogueira com seis gavetas em duas colunas, para quartos de casal em que a roupa dobrada não cabe no armário. Cada gaveta corre sobre guias de madeira encerada e a frente é lisa, sem puxador, aberta pelo rebaixo inferior. Ocupa a parede lateral e aceita um espelho acima, se o quarto pedir.",
  },

  // §3.2 row 34 — the room's esgotado piece, §3.8
  {
    slug: "comoda-bruma-freijo",
    nome: "Cômoda Bruma",
    familia: "comoda-bruma",
    acabamento: "Freijó",
    tipo: "comodas",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 34,
    precoTabela: 470000,
    medidasExtras: [{ rotulo: "Quantidade de gavetas", valor: 4, unidade: "un" }],
    disponibilidade: "esgotado",
    imagens: [
      {
        src: unsplash("1512918728675-ed5a9ecdebfd"),
        alt: "Cômoda Bruma em freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cômoda em freijó com quatro gavetas, a menor da linha, para quartos estreitos ou para servir de apoio ao trocador. O corpo é montado com cavilhas e o tampo tem três centímetros de espessura, o que mantém a peça firme mesmo com todas as gavetas abertas. Encosta na parede menor do quarto, ao lado da porta.",
  },

  // §3.2 row 35 — freteGratis nacional, §3.8, and the catalogue's largest box
  {
    slug: "guarda-roupa-cais-carvalho",
    nome: "Guarda-roupa Cais",
    familia: "guarda-roupa-cais",
    acabamento: "Carvalho",
    tipo: "guarda-roupas",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 35,
    precoTabela: 1560000,
    medidasExtras: [
      { rotulo: "Quantidade de portas", valor: 5, unidade: "un" },
      { rotulo: "Prateleiras internas", valor: 10, unidade: "un" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 10,
    freteGratis: "nacional",
    imagens: [
      {
        src: unsplash("1594620302200-9a762244a156"),
        alt: "Guarda-roupa Cais em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um guarda-roupa em carvalho maciço com cinco portas, o maior da linha, para o quarto que dispensa marcenaria planejada. As portas correm em dobradiça de canivete e o interior combina prateleiras removíveis com dois cabideiros, montados sobre a mesma ranhura. Ocupa uma parede inteira e pede pé-direito de dois metros e meio.",
  },

  // §3.2 row 36
  {
    slug: "guarda-roupa-ripado-freijo",
    nome: "Guarda-roupa Ripado",
    familia: "guarda-roupa-ripado",
    acabamento: "Freijó",
    tipo: "guarda-roupas",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 36,
    precoTabela: 1190000,
    medidasExtras: [
      { rotulo: "Quantidade de portas", valor: 4, unidade: "un" },
      { rotulo: "Prateleiras internas", valor: 6, unidade: "un" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 8,
    imagens: [
      {
        src: unsplash("1631049307264-da0ec9d70304"),
        alt: "Guarda-roupa Ripado em freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um guarda-roupa em freijó com quatro portas ripadas, para o quarto que quer ventilação natural na roupa guardada. As ripas são encaixadas em ranhura no caixilho da porta e deixam passar o ar sem mostrar o que está dentro. Ocupa a parede oposta à cama, onde a trama vertical alonga o cômodo.",
  },

  // §3.2 row 37
  {
    slug: "guarda-roupa-bruma-nogueira",
    nome: "Guarda-roupa Bruma",
    familia: "guarda-roupa-bruma",
    acabamento: "Nogueira",
    tipo: "guarda-roupas",
    ambientePrincipal: "quarto",
    ambientes: ["quarto"],
    colecoes: [],
    ordem: 37,
    precoTabela: 1320000,
    medidasExtras: [
      { rotulo: "Quantidade de portas", valor: 4, unidade: "un" },
      { rotulo: "Prateleiras internas", valor: 8, unidade: "un" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 8,
    imagens: [
      {
        src: unsplash("1631049307264-da0ec9d70304"),
        alt: "Guarda-roupa Bruma em nogueira sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um guarda-roupa em nogueira com quatro portas lisas, sem puxador, para quem quer o volume o mais silencioso possível. A abertura é por toque e as portas assentam sobre batente de feltro, o que elimina o estalo que uma porta de armário costuma dar. Fica na parede oposta à cama, onde a madeira escura fecha o cômodo sem pesar.",
  },

  // §3.3 row 38
  {
    slug: "mesa-taipa-jatoba",
    nome: "Mesa Taipa",
    familia: "mesa-taipa",
    acabamento: "Jatobá",
    tipo: "mesas",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 38,
    precoTabela: 620000,
    medidasExtras: [
      { rotulo: "Quantidade de lugares", valor: 6, unidade: "un" },
      { rotulo: "Espessura do tampo", valor: 4, unidade: "cm" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 6,
    imagens: [
      {
        src: unsplash("1594620302200-9a762244a156"),
        alt: "Mesa Taipa em jatobá sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma mesa de cozinha em jatobá maciço, dimensionada para seis lugares e para o uso diário de uma casa que come junto. O tampo é formado por lâminas coladas em sentidos alternados, arranjo que segura o empeno quando a madeira responde à umidade da pia próxima. Ocupa o centro do cômodo e aceita ser encostada à parede quando a passagem aperta.",
  },

  // §3.3 row 39
  {
    slug: "mesa-orla-carvalho",
    nome: "Mesa Orla",
    familia: "mesa-orla",
    acabamento: "Carvalho",
    tipo: "mesas",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 39,
    precoTabela: 540000,
    medidasExtras: [
      { rotulo: "Quantidade de lugares", valor: 4, unidade: "un" },
      { rotulo: "Espessura do tampo", valor: 3, unidade: "cm" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1595526114035-0d45ed16cfbf"),
        alt: "Mesa Orla em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma mesa de quatro lugares em carvalho, para cozinhas onde a refeição acontece no mesmo cômodo em que se cozinha. As pernas encaixam na saia por espiga passante, junta que dispensa ferragem e mantém o conjunto rígido depois de anos de arrasto. Cabe entre a bancada e a parede sem fechar a circulação em volta.",
  },

  // §3.3 row 40
  {
    slug: "mesa-pedra-marmore-carvao",
    nome: "Mesa Pedra",
    familia: "mesa-pedra",
    acabamento: "Mármore Carvão",
    tipo: "mesas",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 40,
    precoTabela: 980000,
    medidasExtras: [
      { rotulo: "Quantidade de lugares", valor: 6, unidade: "un" },
      { rotulo: "Espessura do tampo", valor: 2, unidade: "cm" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 8,
    imagens: [
      {
        src: unsplash("1550226891-ef816aed4a98"),
        alt: "Mesa Pedra em mármore carvão sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma mesa de tampo em mármore carvão sobre duas laterais em carvalho maciço, para quem quer a superfície fria que a cozinha pede. A pedra é assentada sobre um quadro de madeira com folga calculada, porque o mármore e o carvalho não se movem na mesma medida ao longo do ano. Fica bem sob luz baixa, onde o polimento não estoura.",
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

  // §3.3 row 42 — the second acabamento: same família and same geometry, but
  // not the same wood, because §8.1 makes an upholstered piece carvalho and its
  // palhinha sibling freijó. The coleção `serra` names this one of the two.
  {
    slug: "cadeira-junco-couro-argila",
    nome: "Cadeira Junco",
    familia: "cadeira-junco",
    acabamento: "Couro Argila",
    tipo: "cadeiras",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: ["serra"],
    ordem: 42,
    precoTabela: 192000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 46, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 110, unidade: "kg" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 4,
    imagens: [
      {
        src: unsplash("1503602642458-232111445657"),
        alt: "Cadeira Junco em couro argila sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cadeira de jantar com assento em couro argila sobre estrutura em carvalho, para a mesa que recebe todos os dias. O couro é curtido ao vegetal e esticado sobre o caixilho ainda úmido, de modo que seca já na forma do assento e não afrouxa depois. Vai à mesa da cozinha e escurece devagar nos pontos de uso, como o couro faz.",
  },

  // §3.3 row 43 — the third and last precoDe piece §3.8 names
  {
    slug: "cadeira-vime-rattan-cru",
    nome: "Cadeira Vime",
    familia: "cadeira-vime",
    acabamento: "Rattan Cru",
    tipo: "cadeiras",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 43,
    precoTabela: 124000,
    precoDe: 148000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 44, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 100, unidade: "kg" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1506439773649-6e0eb8cfb237"),
        alt: "Cadeira Vime em rattan cru sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cadeira leve com encosto e assento em rattan cru sobre estrutura em carvalho, para a mesa que muda de lugar. O rattan é curvado a vapor e amarrado no encosto com fibra da própria planta, sem prego, que é o que deixa a peça ceder um pouco ao sentar. Empilha em canto de cozinha quando a casa recebe mais gente.",
  },

  // §3.3 row 44
  {
    slug: "cadeira-tramo-aco-carvao",
    nome: "Cadeira Tramo",
    familia: "cadeira-tramo",
    acabamento: "Aço Carvão",
    tipo: "cadeiras",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 44,
    precoTabela: 98000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 42, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 130, unidade: "kg" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1503602642458-232111445657"),
        alt: "Cadeira Tramo em aço carvão sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cadeira de tubo em aço carvão com assento em carvalho, a peça mais direta do conjunto de cozinha. A estrutura é dobrada em um único tubo contínuo e soldada num ponto só, atrás do encosto, onde a solda não aparece nem incomoda as costas. Encaixa sob a bancada e some quando não está em uso.",
  },

  // §3.3 row 45 — cross-listed to sala, §3.6
  {
    slug: "banqueta-seixo-carvalho",
    nome: "Banqueta Seixo",
    familia: "banqueta-seixo",
    acabamento: "Carvalho",
    tipo: "banquetas",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha", "sala"],
    colecoes: [],
    ordem: 45,
    precoTabela: 118000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 66, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 120, unidade: "kg" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1594026112284-02bb6f3352fe"),
        alt: "Banqueta Seixo em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma banqueta em carvalho maciço com assento levemente escavado, para a bancada onde se toma café em pé. O assento é desbastado a goiva e depois lixado no sentido do veio, trabalho que deixa a superfície côncava sem marcar a madeira. Serve à cozinha e, fora dela, como apoio solto na sala.",
  },

  // §3.3 row 46
  {
    slug: "banqueta-vau-freijo",
    nome: "Banqueta Vau",
    familia: "banqueta-vau",
    acabamento: "Freijó",
    tipo: "banquetas",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 46,
    precoTabela: 135000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 70, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 120, unidade: "kg" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 4,
    imagens: [
      {
        src: unsplash("1586023492125-27b2c045efd7"),
        alt: "Banqueta Vau em freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma banqueta alta em freijó, pensada para bancadas mais altas que a média e para quem passa tempo em pé na cozinha. Os pés abrem alguns graus para fora e travam num anel de apoio, geometria que segura a peça quando o peso vai todo para um lado. Fica encostada à ilha e sai dali só quando chega visita.",
  },

  // §3.3 row 47
  {
    slug: "banqueta-tramo-aco-carvao",
    nome: "Banqueta Tramo",
    familia: "banqueta-tramo",
    acabamento: "Aço Carvão",
    tipo: "banquetas",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 47,
    precoTabela: 89000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 62, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 130, unidade: "kg" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1594026112284-02bb6f3352fe"),
        alt: "Banqueta Tramo em aço carvão sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma banqueta de tubo em aço carvão com assento em carvalho, a entrada do conjunto e a mais fácil de guardar. A pintura é eletrostática a pó e curada em estufa, camada que não descasca no ponto onde o pé raspa o travessão todos os dias. Vive sob a bancada e some inteira embaixo dela.",
  },

  // §3.3 row 48
  {
    slug: "armario-cais-carvalho",
    nome: "Armário Cais",
    familia: "armario-cais",
    acabamento: "Carvalho",
    tipo: "armarios",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 48,
    precoTabela: 860000,
    medidasExtras: [
      { rotulo: "Quantidade de portas", valor: 3, unidade: "un" },
      { rotulo: "Prateleiras internas", valor: 8, unidade: "un" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 7,
    imagens: [
      {
        src: unsplash("1616594039964-ae9021a400a0"),
        alt: "Armário Cais em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um armário alto de três portas em carvalho, para a louça e os secos que não cabem nos armários de parede. As portas correm sobre dobradiças embutidas com freio, e o topo é rebaixado alguns centímetros para não brigar com o forro. Encosta na parede mais livre da cozinha, onde a altura não corta a luz da janela.",
  },

  // §3.3 row 49
  {
    slug: "armario-ripado-freijo",
    nome: "Armário Ripado",
    familia: "armario-ripado",
    acabamento: "Freijó",
    tipo: "armarios",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 49,
    precoTabela: 710000,
    medidasExtras: [
      { rotulo: "Quantidade de portas", valor: 2, unidade: "un" },
      { rotulo: "Prateleiras internas", valor: 6, unidade: "un" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 6,
    imagens: [
      {
        src: unsplash("1631049307264-da0ec9d70304"),
        alt: "Armário Ripado em freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um armário de duas portas em freijó, com as frentes ripadas que dão nome à família e deixam o ar circular por dentro. Cada ripa é encaixada em rasgo na travessa, uma a uma, e o espaçamento é o mesmo em toda a altura para o desenho não tropeçar. Guarda mantimentos secos e pede parede sem umidade atrás.",
  },

  // §3.3 row 50 — the one acabamento in the catalogue that names a finish
  // rather than a material; §8.1's structural clause supplies the wood
  {
    slug: "armario-bruma-off-white",
    nome: "Armário Bruma",
    familia: "armario-bruma",
    acabamento: "Laca Off-white",
    tipo: "armarios",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 50,
    precoTabela: 630000,
    medidasExtras: [
      { rotulo: "Quantidade de portas", valor: 2, unidade: "un" },
      { rotulo: "Prateleiras internas", valor: 5, unidade: "un" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1558211583-d26f610c1eb1"),
        alt: "Armário Bruma em laca off-white sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um armário de duas portas em laca off-white sobre estrutura em carvalho, para cozinhas que já têm madeira demais à vista. A laca é aplicada em três demãos com lixamento entre elas, e o acabamento fosco esconde marca de dedo melhor que qualquer brilho. Some contra a parede clara e devolve a atenção ao resto do cômodo.",
  },

  // §3.3 row 51
  {
    slug: "carrinho-roldana-aco-carvao",
    nome: "Carrinho Roldana",
    familia: "carrinho-roldana",
    acabamento: "Aço Carvão",
    tipo: "carrinhos-e-apoios",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 51,
    precoTabela: 210000,
    medidasExtras: [],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1513506003901-1e6a229e2d15"),
        alt: "Carrinho Roldana em aço carvão sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um carrinho de duas prateleiras em aço carvão, para levar louça, garrafas ou o café da manhã de um cômodo a outro. As rodas são de borracha maciça com trava em duas delas, o que basta para a peça ficar parada quando a bancada dela vira mesa. Guarda-se ao lado da geladeira, na folga que sempre sobra ali.",
  },

  // §3.3 row 52
  {
    slug: "carrinho-junco-rattan-cru",
    nome: "Carrinho Junco",
    familia: "carrinho-junco",
    acabamento: "Rattan Cru",
    tipo: "carrinhos-e-apoios",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha"],
    colecoes: [],
    ordem: 52,
    precoTabela: 174000,
    medidasExtras: [],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1522708323590-d24dbb6b0267"),
        alt: "Carrinho Junco em rattan cru sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Um carrinho leve de duas prateleiras em rattan cru sobre estrutura em carvalho, para frutas, pães e o que fica à mão. As prateleiras são trançadas em trama aberta, que escoa migalha e deixa a fruta respirar em vez de suar sobre superfície fechada. Fica perto da janela, onde a luz atravessa a trama e desenha no chão.",
  },

  // §3.3 row 53 — cross-listed to sala, §3.6
  {
    slug: "mesa-de-apoio-luar-marmore-cru",
    nome: "Mesa de Apoio Luar",
    familia: "mesa-de-apoio-luar",
    acabamento: "Mármore Cru",
    tipo: "carrinhos-e-apoios",
    ambientePrincipal: "cozinha",
    ambientes: ["cozinha", "sala"],
    colecoes: [],
    ordem: 53,
    precoTabela: 268000,
    medidasExtras: [],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 5,
    imagens: [
      {
        src: unsplash("1611967164521-abae8fba4668"),
        alt: "Mesa de Apoio Luar em mármore cru sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma mesa de apoio com tampo em mármore cru sobre coluna e base em carvalho, alta o bastante para servir ao lado de quem está sentado. O tampo é rebaixado no verso e encaixa na coluna por espiga, junta que dispensa cola e deixa a pedra assentar pelo próprio peso. Serve à cozinha ao lado da poltrona de leitura e à sala com a mesma naturalidade.",
  },

  // §3.4 row 54 — the room's full-coverage piece: all three papéis, and the
  // only cota Escritório spends (§7.2, §7.3). It opens the Escritório article.
  {
    slug: "escrivaninha-cais-carvalho",
    nome: "Escrivaninha Cais",
    familia: "escrivaninha-cais",
    acabamento: "Carvalho",
    tipo: "escrivaninhas",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio"],
    colecoes: [],
    ordem: 54,
    precoTabela: 590000,
    // §8.3's table assigns `escrivaninhas` no rows, so the tipo renders the
    // empty Medidas case — see the note in `derivacoes.ts`.
    medidasExtras: [],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 6,
    imagens: [
      {
        src: unsplash("1524758631624-e2822e304c36"),
        alt: "Escrivaninha Cais em carvalho sobre reboco",
        papel: "principal",
        cotas: ["largura"],
      },
      {
        src: unsplash("1567016432779-094069958ea5"),
        alt: "Escrivaninha Cais em Escritório",
        papel: "ambientada",
        cotas: [],
      },
      {
        src: unsplash("1592078615290-033ee584e267"),
        alt: "O gaveteiro de três gavetas e o vão livre ao lado",
        papel: "detalhe",
        cotas: [],
      },
    ],
    descricao:
      "Uma escrivaninha de tampo largo em carvalho maciço, com gaveteiro de três gavetas de um lado e vão livre do outro. O tampo é montado em réguas coladas alternando o sentido do veio, o que impede a peça de empenar quando o cômodo seca. Encosta na parede ou fica solta no meio do escritório, porque o verso é acabado igual à frente.",
  },

  // §3.4 row 55
  {
    slug: "escrivaninha-vau-freijo",
    nome: "Escrivaninha Vau",
    familia: "escrivaninha-vau",
    acabamento: "Freijó",
    tipo: "escrivaninhas",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio"],
    colecoes: [],
    ordem: 55,
    precoTabela: 480000,
    medidasExtras: [],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1595526114035-0d45ed16cfbf"),
        alt: "Escrivaninha Vau em freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma escrivaninha leve em freijó, apoiada em dois cavaletes que vencem o vão sem travessa no meio das pernas. As pernas encaixam no travessão por cavilha passante, junta que se aperta com o próprio peso do tampo e dispensa ferragem à vista. Cabe em quarto pequeno, onde uma mesa de trabalho precisa desaparecer quando o dia termina.",
  },

  // §3.4 row 56
  {
    slug: "escrivaninha-tramo-aco-carvao",
    nome: "Escrivaninha Tramo",
    familia: "escrivaninha-tramo",
    acabamento: "Aço Carvão",
    tipo: "escrivaninhas",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio"],
    colecoes: [],
    ordem: 56,
    precoTabela: 390000,
    medidasExtras: [],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1513506003901-1e6a229e2d15"),
        alt: "Escrivaninha Tramo em aço carvão sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma escrivaninha de estrutura tubular em aço carvão com tampo em carvalho, para quem quer a mesa de trabalho mais estreita que couber. A estrutura é dobrada em tubo contínuo e soldada só nos dois pontos de cruzamento, o que deixa a peça rígida sem ganhar volume. Fica bem contra a janela, onde a pintura fosca não devolve reflexo à tela.",
  },

  // §3.4 row 57
  {
    slug: "cadeira-de-trabalho-orla-couro-argila",
    nome: "Cadeira de Trabalho Orla",
    familia: "cadeira-de-trabalho-orla",
    acabamento: "Couro Argila",
    tipo: "cadeiras-de-trabalho",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio"],
    colecoes: [],
    ordem: 57,
    precoTabela: 420000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 48, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 120, unidade: "kg" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 5,
    imagens: [
      {
        src: unsplash("1503602642458-232111445657"),
        alt: "Cadeira de Trabalho Orla em couro argila sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cadeira de trabalho com assento e encosto em couro argila sobre base giratória, para o expediente que passa das quatro horas sentado. O couro é curtido ao vegetal e costurado sobre espuma de densidade alta, que cede no primeiro mês e depois guarda a forma de quem senta. Fica na escrivaninha e gira para a estante atrás sem que ninguém se levante.",
  },

  // §3.4 row 58
  {
    slug: "cadeira-de-trabalho-junco-palhinha-freijo",
    nome: "Cadeira de Trabalho Junco",
    familia: "cadeira-de-trabalho-junco",
    acabamento: "Palhinha e Freijó",
    tipo: "cadeiras-de-trabalho",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio"],
    colecoes: [],
    ordem: 58,
    precoTabela: 260000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 44, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 100, unidade: "kg" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1506439773649-6e0eb8cfb237"),
        alt: "Cadeira de Trabalho Junco em palhinha e freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cadeira de trabalho com assento em palhinha e estrutura em freijó, para a mesa que também é escrivaninha em casa. O assento é trançado sobre caixilho ranhurado e respira, o que muda a temperatura de uma tarde inteira sentado sem que ninguém repare no motivo. Serve ao escritório e volta para a mesa de jantar quando a casa recebe.",
  },

  // §3.4 row 59
  {
    slug: "cadeira-de-trabalho-ripado-carvalho",
    nome: "Cadeira de Trabalho Ripado",
    familia: "cadeira-de-trabalho-ripado",
    acabamento: "Carvalho",
    tipo: "cadeiras-de-trabalho",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio"],
    colecoes: [],
    ordem: 59,
    precoTabela: 310000,
    medidasExtras: [
      { rotulo: "Altura do assento", valor: 46, unidade: "cm" },
      { rotulo: "Capacidade de peso", valor: 110, unidade: "kg" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 4,
    imagens: [
      {
        src: unsplash("1586023492125-27b2c045efd7"),
        alt: "Cadeira de Trabalho Ripado em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma cadeira de trabalho com encosto ripado em carvalho maciço, desenhada para quem escreve à mão e apoia pouco as costas. As ripas são torneadas uma a uma e encaixadas em rasgo, com folga calculada para a madeira trabalhar sem abrir junta no inverno. Fica na escrivaninha e não destoa quando é puxada para a sala numa noite cheia.",
  },

  // §3.4 row 60
  {
    slug: "estante-bruma-freijo",
    nome: "Estante Bruma",
    familia: "estante-bruma",
    acabamento: "Freijó",
    tipo: "estantes",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio"],
    colecoes: [],
    ordem: 60,
    precoTabela: 510000,
    medidasExtras: [
      { rotulo: "Prateleiras", valor: 4, unidade: "un" },
      { rotulo: "Capacidade por prateleira", valor: 25, unidade: "kg" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 6,
    imagens: [
      {
        src: unsplash("1594620302200-9a762244a156"),
        alt: "Estante Bruma em freijó sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma estante estreita em freijó, de quatro prateleiras, para o canto de parede que sobra ao lado da escrivaninha. As prateleiras correm em rasgo usinado nas laterais e travam por cavilha, de modo que a peça não precisa de fundo para ficar em esquadro. Encosta na parede e some, que é o serviço de uma estante num cômodo pequeno.",
  },

  // §3.4 row 61
  {
    slug: "estante-vargem-carvalho",
    nome: "Estante Vargem",
    familia: "estante-vargem",
    acabamento: "Carvalho",
    tipo: "estantes",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio"],
    colecoes: [],
    ordem: 61,
    precoTabela: 570000,
    medidasExtras: [
      { rotulo: "Prateleiras", valor: 5, unidade: "un" },
      { rotulo: "Capacidade por prateleira", valor: 30, unidade: "kg" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1558211583-d26f610c1eb1"),
        alt: "Estante Vargem em carvalho sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma estante de cinco prateleiras em carvalho maciço, com montante central que divide os vãos e sustenta o peso de livro em fila cheia. As prateleiras têm vinte e cinco milímetros de espessura e vão encaixadas em malhete, junta que segura sem parafuso e não cede com o tempo. Fica atrás da mesa, ao alcance de quem está sentado.",
  },

  // §3.4 row 62 — cross-listed to sala, §3.6, and one of `serra`'s five
  {
    slug: "estante-mirante-nogueira",
    nome: "Estante Mirante",
    familia: "estante-mirante",
    acabamento: "Nogueira",
    tipo: "estantes",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio", "sala"],
    colecoes: ["serra"],
    ordem: 62,
    precoTabela: 660000,
    medidasExtras: [
      { rotulo: "Prateleiras", valor: 6, unidade: "un" },
      { rotulo: "Capacidade por prateleira", valor: 35, unidade: "kg" },
    ],
    disponibilidade: "sob-encomenda",
    prazoProducaoSemanas: 7,
    imagens: [
      {
        src: unsplash("1594026112284-02bb6f3352fe"),
        alt: "Estante Mirante em nogueira sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma estante alta em nogueira, de seis prateleiras em três vãos, para a parede inteira de quem tem mais livro do que espaço. Os montantes atravessam as prateleiras de ponta a ponta e são a única peça estrutural, o que deixa o desenho com uma linha vertical contínua. Serve ao escritório e à sala com o mesmo desembaraço, e ancora as duas.",
  },

  // §3.4 row 63 — the third esgotado, §3.8, and the room's only one
  {
    slug: "luminaria-de-mesa-farol-latao",
    nome: "Luminária de Mesa Farol",
    familia: "luminaria-de-mesa-farol",
    acabamento: "Latão",
    tipo: "luminarias-de-mesa",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio"],
    colecoes: [],
    ordem: 63,
    precoTabela: 142000,
    medidasExtras: [
      { rotulo: "Alcance do braço", valor: 24, unidade: "cm" },
      { rotulo: "Soquete", valor: 1, unidade: "un" },
    ],
    disponibilidade: "esgotado",
    imagens: [
      {
        src: unsplash("1550226891-ef816aed4a98"),
        alt: "Luminária de Mesa Farol em latão sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma luminária de mesa em latão com base em carvalho, de corpo fechado em quatro faces, que joga a luz para baixo e não para os olhos de quem trabalha. O latão é deixado sem verniz de propósito, porque a patina que se forma nos primeiros anos é o acabamento pretendido. Fica na quina da escrivaninha, onde marca o canto de leitura.",
  },

  // §3.4 row 64 — one of `reboco`'s six
  {
    slug: "luminaria-de-mesa-seixo-ceramica-cru",
    nome: "Luminária de Mesa Seixo",
    familia: "luminaria-de-mesa-seixo",
    acabamento: "Cerâmica Cru",
    tipo: "luminarias-de-mesa",
    ambientePrincipal: "escritorio",
    ambientes: ["escritorio"],
    colecoes: ["reboco"],
    ordem: 64,
    precoTabela: 98000,
    medidasExtras: [
      { rotulo: "Alcance do braço", valor: 16, unidade: "cm" },
      { rotulo: "Soquete", valor: 1, unidade: "un" },
    ],
    disponibilidade: "envio-imediato",
    imagens: [
      {
        src: unsplash("1540574163026-643ea20ade25"),
        alt: "Luminária de Mesa Seixo em cerâmica cru sobre reboco",
        papel: "principal",
        cotas: [],
      },
    ],
    descricao:
      "Uma luminária de mesa com base em cerâmica cru torneada e cúpula sobre haste curta em carvalho, para luz difusa ao lado do papel. A cerâmica é queimada em alta temperatura e esmaltada só por dentro, de modo que a superfície externa fica seca ao toque e não brilha sob a lâmpada. Fica na escrivaninha ou no criado-mudo, e pesa o bastante para não andar.",
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

// ---------------------------------------------------------------------------
// Artigos — `dados.md` §5. One per ambiente, `ambiente` required and unique;
// `ordem` is authored index order, never recency. Three fotos per article,
// `[0]` ampla and `[1]`/`[2]` detalhe, each carrying 2–5 produto slugs.
//
// The legends are authored in §5.1 and are the file's load-bearing references:
// the union across an article's three `pecas[]` holds no duplicate, and every
// piece named lists under the article's room. `abertura` and `passagens` are
// copy direction, not copy — written here to §6.3 and §6.4's direction.
// ---------------------------------------------------------------------------

export const artigos: Artigo[] = [
  {
    slug: "a-luz-da-tarde-na-sala",
    titulo: "A luz da tarde",
    resumo:
      "Como uma sala muda quando o sol baixa, e o que fica bem nela às cinco da tarde.",
    ambiente: "sala",
    ordem: 1,
    thumb: {
      src: unsplash("1616486338812-3dadae4b4ace"),
      alt: "Sala ao fim da tarde, com a luz rasante atravessando o estofado",
    },
    abertura:
      "Às cinco da tarde a luz entra deitada e encontra as superfícies de lado. É a hora em que a sala mostra a trama de tudo que tem dentro.",
    fotos: [
      {
        src: unsplash("1567538096630-e0c55bd6374c"),
        alt: "Sala com sofá de linho cru voltado para a janela e mesa de centro em freijó",
        papel: "ampla",
        pecas: [
          "sofa-heron-linho-cru",
          "mesa-de-centro-seixo-freijo",
          "poltrona-lina-linho-cru",
        ],
      },
      {
        src: unsplash("1594026112284-02bb6f3352fe"),
        alt: "Estante em freijó junto ao aparador de mármore, na parede oposta à janela",
        papel: "detalhe",
        pecas: ["estante-cais-freijo", "aparador-pedra-marmore-cru"],
      },
      {
        src: unsplash("1513506003901-1e6a229e2d15"),
        alt: "Mesa de apoio em mármore com a banqueta de carvalho encostada",
        papel: "detalhe",
        pecas: ["mesa-de-apoio-luar-marmore-cru", "banqueta-seixo-carvalho"],
      },
    ],
    passagens: [
      "A sala foi montada para o fim do dia, não para o meio. O sofá ficou de frente para a janela e não de costas, porque a luz rasante revela a trama do linho cru em vez de apagá-la. A mesa de centro em freijó tem o tampo baixo o bastante para não cortar essa faixa de luz.",
      "A parede oposta recebe o que a tarde já não alcança. A estante e o aparador de mármore trabalham na sombra, e por isso puderam ser as peças de mais peso visual do cômodo. É a mesma lógica da coleção Reboco: tons de cal para uma casa que recebe pouca luz direta.",
    ],
  },
  {
    slug: "o-quarto-como-abrigo",
    titulo: "O quarto como abrigo",
    resumo:
      "Menos peças, mais silêncio: o argumento para esvaziar o cômodo em que se dorme.",
    ambiente: "quarto",
    ordem: 2,
    thumb: {
      src: unsplash("1583847268964-b28dc8f51f92"),
      alt: "Quarto de poucas peças, com a cama afastada da parede da janela",
    },
    abertura:
      "Um quarto cheio pede atenção na hora em que a atenção deveria estar acabando. Esvaziá-lo é uma decisão de sono, não de estética.",
    fotos: [
      {
        src: unsplash("1505693416388-ac5ce068fe85"),
        alt: "Cama de linho cru com cabeceira estofada e criado-mudo em freijó ao lado",
        papel: "ampla",
        pecas: [
          "cama-nuvem-linho-cru",
          "cabeceira-vela-linho-areia",
          "criado-mudo-seixo-freijo",
        ],
      },
      {
        src: unsplash("1595526114035-0d45ed16cfbf"),
        alt: "Cômoda de carvalho com o criado-mudo de nogueira à sua direita",
        papel: "detalhe",
        pecas: ["comoda-vargem-carvalho", "criado-mudo-luar-nogueira"],
      },
      {
        src: unsplash("1540932239986-30128078f3c5"),
        alt: "Poltrona de linho no canto de leitura, diante do guarda-roupa ripado",
        papel: "detalhe",
        pecas: ["poltrona-lina-linho-cru", "guarda-roupa-ripado-freijo"],
      },
    ],
    passagens: [
      "São sete peças no cômodo inteiro, e nenhuma delas guarda o que poderia estar em outro lugar da casa. A cama ficou afastada da parede da janela para que a luz da manhã chegue ao pé e não ao rosto. A cabeceira em linho areia é a única superfície macia acima da altura do colchão.",
      "O canto de leitura existe porque a poltrona já servia à sala e serve aqui pelo mesmo motivo: é a peça que muda de cômodo sem mudar de função. O guarda-roupa ripado fecha a parede oposta e é o único volume alto do quarto, o que mantém o teto onde ele está.",
    ],
  },
  {
    slug: "a-cozinha-que-recebe",
    titulo: "A cozinha que recebe",
    resumo: "Quando a mesa da cozinha passa a ser a mesa da casa.",
    ambiente: "cozinha",
    ordem: 3,
    thumb: {
      src: unsplash("1598300042247-d088f8ab3a91"),
      alt: "Mesa de cozinha posta para o fim da tarde, com cadeiras de palhinha",
    },
    abertura:
      "A sala de jantar da casa brasileira foi ficando cerimoniosa e vazia. A mesa da cozinha absorveu o que ela deixou de fazer.",
    fotos: [
      {
        src: unsplash("1556909212-d5b604d0c90d"),
        alt: "Mesa de jatobá com cadeiras de palhinha e uma banqueta de carvalho na ponta",
        papel: "ampla",
        pecas: [
          "mesa-taipa-jatoba",
          "cadeira-junco-palhinha-freijo",
          "banqueta-seixo-carvalho",
        ],
      },
      {
        src: unsplash("1600585154340-be6161a56a0c"),
        alt: "Armário de carvalho ao lado do carrinho de aço carvão, junto à bancada",
        papel: "detalhe",
        pecas: ["armario-cais-carvalho", "carrinho-roldana-aco-carvao"],
      },
      {
        src: unsplash("1567016432779-094069958ea5"),
        alt: "Mesa de apoio em mármore com a cadeira de rattan cru encostada na parede",
        papel: "detalhe",
        pecas: ["mesa-de-apoio-luar-marmore-cru", "cadeira-vime-rattan-cru"],
      },
    ],
    passagens: [
      "A mesa de jatobá tem 180 cm e trabalha todos os dias, o que é diferente de trabalhar aos domingos. O tampo maciço aceita marca, e a cor amadurece nos primeiros meses; depois disso ela estabiliza e para de contar o que aconteceu em cima dele. As cadeiras de palhinha somam pouco peso porque saem do lugar várias vezes por refeição.",
      "A banqueta na ponta é a cadeira a mais que sempre falta e nunca justifica uma sexta cadeira. O carrinho de aço carvão faz o mesmo em outra direção: sai da parede quando a cozinha recebe e volta quando ela não recebe. Nenhuma das duas peças ocupa lugar fixo, e é isso que as torna úteis.",
    ],
  },
  {
    slug: "trabalhar-em-silencio",
    titulo: "Trabalhar em silêncio",
    resumo:
      "Uma escrivaninha, uma luminária, uma cadeira — e o resto é disciplina.",
    ambiente: "escritorio",
    ordem: 4,
    thumb: {
      src: unsplash("1524758631624-e2822e304c36"),
      alt: "Escrivaninha de carvalho vazia, com a luminária acesa no canto",
    },
    abertura:
      "Um escritório em casa não compete com o escritório da empresa em equipamento. Compete em silêncio, e o silêncio se monta com poucas peças.",
    fotos: [
      {
        src: unsplash("1593062096033-9a26b09da705"),
        alt: "Escrivaninha de carvalho diante da estante de nogueira, com cadeira de couro argila",
        papel: "ampla",
        pecas: [
          "escrivaninha-cais-carvalho",
          "cadeira-de-trabalho-orla-couro-argila",
          "estante-mirante-nogueira",
        ],
      },
      {
        src: unsplash("1507473885765-e6ed057f782c"),
        alt: "Luminária de cerâmica cru acesa ao lado da luminária de palhinha apagada",
        papel: "detalhe",
        pecas: [
          "luminaria-de-mesa-seixo-ceramica-cru",
          "luminaria-de-mesa-junco-palhinha",
        ],
      },
      {
        src: unsplash("1555041469-a586c61ea9bc"),
        alt: "Escrivaninha estreita de freijó com a cadeira de carvalho recolhida sob o tampo",
        papel: "detalhe",
        pecas: ["escrivaninha-vau-freijo", "cadeira-de-trabalho-ripado-carvalho"],
      },
    ],
    passagens: [
      "A escrivaninha está de lado para a janela, e não de frente nem de costas. De frente a tela recebe o contraluz; de costas, o reflexo. De lado a luz cai no papel pela esquerda, e a luminária de cerâmica cru cobre o resto da mesa depois das seis.",
      "A estante de nogueira fica atrás e não ao lado, porque o que está atrás não entra no campo de visão de quem trabalha. A segunda escrivaninha, mais estreita, mostra que o cômodo funciona com metade da superfície — a mesa grande é conforto, não requisito.",
    ],
  },
];

// ---------------------------------------------------------------------------
// ConteudoHome — `dados.md` §6. All authored; the home derives no selection.
// The hero is the one slug in the file whose image record is not optional: its
// `principal` declares `cotas: ['largura']`, and without that it cannot render.
// ---------------------------------------------------------------------------

export const conteudoHome: ConteudoHome = {
  destaqueHome: "sofa-heron-linho-cru",
  // One per price bracket above the entry tier, one per ambiente other than
  // Cozinha — authored, because a concept store has no sales data to derive.
  destaques: [
    "poltrona-lina-linho-cru",
    "mesa-de-jantar-vargem-carvalho",
    "luminaria-de-mesa-seixo-ceramica-cru",
  ],
  colecaoDestaque: "reboco",
  // Three of four: `a-cozinha-que-recebe` is held back because it is the only
  // article whose room `destaques` never names, so the home does not repeat.
  inspiracoes: [
    "a-luz-da-tarde-na-sala",
    "o-quarto-como-abrigo",
    "trabalhar-em-silencio",
  ],
  marcenaria: {
    linha: "A marcenaria é nossa, e fica a quarenta minutos daqui.",
    texto:
      "Cada peça é produzida sob encomenda na nossa marcenaria no interior de São Paulo, por uma equipe de nove marceneiros. Nada é feito antes de ser vendido, e é por isso que o prazo é contado em semanas. A madeira é maciça e certificada, os encaixes são de espiga e cavilha, e o acabamento leva uma demão por dia até fechar. O desenho é assinado por um dos oito designers do quadro, e o nome dele acompanha a peça.",
    imagem: {
      src: unsplash("1601058268499-e52e4d8f8e0f"),
      alt: "Bancada de marcenaria com peças em acabamento e ferramentas de mão",
    },
  },
};
