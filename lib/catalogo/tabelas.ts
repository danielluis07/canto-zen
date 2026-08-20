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
