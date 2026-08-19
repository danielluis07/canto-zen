# Dados de exemplo — o catálogo semeado

The sample catalogue the whole storefront reads from: the pieces, the entities
they reference, the editorial content that names them, and the CEP fixtures the
checkout needs. Resolves ticket
[020 — Catalogue seed data](../../.wayfinder/tickets/020-seed-data.md).

This is the **last spec in the map**. Eight closed tickets each placed a demand on
this set; the destination's bar is that a build session can implement any page
*without inventing anything*, and piece names were the last thing left to invent.

## What this file authors, and what it does not

The map's standing rule is copy **direction**, not copy, with
[`institucional.md`](institucional.md) as the one registered exception. This file
is the **second and final exception**, and it is narrower than that one.

**Authored here, because it cannot be derived:** every produto's `slug`, `nome`,
`familia`, `acabamento`, `tipo`, `ambientePrincipal`, `ambientes[]`,
`precoTabela`, `disponibilidade` — plus every entity a produto points at, every
article legend, and `ConteudoHome`.

**Ruled here, not authored:** `medidas`, `medidasExtras`, `embalagem`, `montagem`,
`descricao`, `itensInclusos`, `cor`, `materiais`, `imagens`. Each gets a
derivation rule in [§8](#8-derivation-rules) precise enough that two build
sessions produce the same record.

**Why identity had to be authored.** Not because names are precious — because
they are **referenced by slug from three other specs**. `ConteudoHome.destaqueHome`,
`destaques[3]`, `colecaoDestaque`, `Colecao.produtos[]` and all twelve
`FotoArtigo.pecas[]` arrays are produto slugs. A build session that invents names
leaves [`home.md`](home.md) and [`inspiracoes.md`](inspiracoes.md) pointing at
nothing. Prose stays direction-plus-template exactly as everywhere else, so the
line the map drew is bent for reference integrity alone.

**Six fully-worked exemplars** are identified in [§9](#9-worked-exemplars), one per
structural case, so the rules have a checkable output.

---

## 1. Volume and distribution

**65 produtos across 59 famílias.** Six famílias carry two acabamentos; the rest
carry one. One record per acabamento, per [`produto.md`](produto.md).

The number is not round because nothing chose it: it is the 3-per-tipo floor
across the 20 curated tipos, plus a bump on the piece that defines each of three
rooms.

### 1.1 Why 3 is the floor

The grid is **three columns filling all 12** ([`catalogo.md`](catalogo.md) §5) at
**12 per page** (§7). A tipo with two pieces renders a broken row, which is the
demand `catalogo.md` handed here. Three is one complete row — the minimum that
reads as a curated selection rather than a gap.

The taxonomy is **20 curated tipos**, not the "~4–5 per ambiente" that
[`imagens.md`](imagens.md) §9.3 estimated when it guessed 60–150 produtos. The
real table in [`rotas.md`](rotas.md) is 6 / 5 / 5 / 4. The floor is therefore
**60**, which lands on the bottom of that guess — the estimate survives contact,
but with no headroom.

### 1.2 Why not flat 3

A flat floor makes all 20 tipos identical, which reads as generated and
contradicts `imagens.md` §9.3's own argument that "a store where the strongest
pieces get the full treatment is an atelier". Three rooms get a bump on their
spine tipo — the piece a shopper enters that room to buy.

| Ambiente | Tipo | Peças | | Ambiente | Tipo | Peças |
|---|---|---|---|---|---|---|
| **Sala** (20) | `sofas` | **5** | | **Cozinha** (16) | `mesas` | 3 |
| | `poltronas` | 3 | | | `cadeiras` | **4** |
| | `mesas-de-centro` | 3 | | | `banquetas` | 3 |
| | `mesas-de-jantar` | 3 | | | `armarios` | 3 |
| | `racks-e-estantes` | 3 | | | `carrinhos-e-apoios` | 3 |
| | `aparadores` | 3 | | **Escritório** (12) | `escrivaninhas` | 3 |
| **Quarto** (17) | `camas` | **5** | | | `cadeiras-de-trabalho` | 3 |
| | `cabeceiras` | 3 | | | `estantes` | 3 |
| | `criados-mudos` | 3 | | | `luminarias-de-mesa` | 3 |
| | `comodas` | 3 | | | | |
| | `guarda-roupas` | 3 | | | **Total** | **65** |

Counts are by `ambientePrincipal`. **Escritório gets no spine bump on purpose**:
12 is the pagination boundary, and the set needs a room that renders a single
full page with **no pagination control at all**. That case is otherwise untested,
and it is the one a build session will get wrong.

### 1.3 What each route actually renders

Seven pieces cross-list ([§3.6](#36-cross-listed-pieces)), so room routes are
larger than the table above.

| Route | Peças | Páginas |
|---|---|---|
| `/sala` | 25 | 3 — 12 / 12 / 1 |
| `/quarto` | 19 | 2 — 12 / 7 |
| `/cozinha` | 16 | 2 — 12 / 4 |
| `/escritorio` | **12** | **1 — no pagination control** |
| `/produtos` | 65 | 6 — 12 × 5 + 5 |
| `/colecoes/reboco` | 6 | 1 |
| `/colecoes/serra` | 5 | 1 |

**A cross-listed piece appears on the room route but gets no tipo route there.**
`poltrona-lina-linho-cru` lists under `quarto`, so it renders on `/quarto` — but
`poltronas` is not a curated tipo of Quarto, so **`/quarto/poltronas` is a 404**,
per `rotas.md`. This is correct, not a gap: `Ambiente.tipos` is the source of
truth for which routes exist, and it is curated, never inferred from whatever
products happen to list there.

---

## 2. Entities

### 2.1 Ambientes

`tipos[]` is authoritative in [`rotas.md`](rotas.md) and is not restated here.
`descricao` is the one-sentence room-landing header (`catalogo.md` §11);
`imagem` is the home's room photograph (`home.md` §8), `{ src, alt }` only.

| slug | label | descricao |
|---|---|---|
| `sala` | Sala | Onde a casa recebe — peças que suportam a permanência longa. |
| `quarto` | Quarto | O cômodo mais silencioso da casa merece a marcenaria mais discreta. |
| `cozinha` | Cozinha | Superfícies que trabalham todos os dias e envelhecem bem. |
| `escritorio` | Escritório | Concentração exige poucas coisas, e todas certas. |

### 2.2 Tipos

Slugs are **global** — `cadeiras` means the same thing in every room.

| slug | label | labelSingular | | slug | label | labelSingular |
|---|---|---|---|---|---|---|
| `sofas` | Sofás | Sofá | | `mesas` | Mesas | Mesa |
| `poltronas` | Poltronas | Poltrona | | `cadeiras` | Cadeiras | Cadeira |
| `mesas-de-centro` | Mesas de centro | Mesa de centro | | `banquetas` | Banquetas | Banqueta |
| `mesas-de-jantar` | Mesas de jantar | Mesa de jantar | | `armarios` | Armários | Armário |
| `racks-e-estantes` | Racks e estantes | Rack | | `carrinhos-e-apoios` | Carrinhos e apoios | Carrinho |
| `aparadores` | Aparadores | Aparador | | `escrivaninhas` | Escrivaninhas | Escrivaninha |
| `camas` | Camas | Cama | | `cadeiras-de-trabalho` | Cadeiras de trabalho | Cadeira de trabalho |
| `cabeceiras` | Cabeceiras | Cabeceira | | `estantes` | Estantes | Estante |
| `criados-mudos` | Criados-mudos | Criado-mudo | | `luminarias-de-mesa` | Luminárias de mesa | Luminária de mesa |
| `comodas` | Cômodas | Cômoda | | | | |
| `guarda-roupas` | Guarda-roupas | Guarda-roupa | | | | |

### 2.3 Cores

`amostra` is the swatch the filter panel paints ([`catalogo.md`](catalogo.md) §3)
— the **only** place a colour outside the palette appears in interface, and it
appears as product data.

| slug | label | amostra | | slug | label | amostra |
|---|---|---|---|---|---|---|
| `cru` | Cru | `#E7E0D3` | | `carvao` | Carvão | `#3A3A38` |
| `off-white` | Off-white | `#F2EFE8` | | `grafite` | Grafite | `#4A4E52` |
| `areia` | Areia | `#D8CBB6` | | `verde-musgo` | Verde-musgo | `#6B7359` |
| `argila` | Argila | `#B08A6E` | | `terracota` | Terracota | `#B25B3E` |
| `nogueira` | Nogueira | `#6B4C36` | | `ocre` | Ocre | `#C08A3E` |

### 2.4 Materiais

`cuidados` is required on every material ([`pagina-produto.md`](pagina-produto.md)
§5) — the PDP's Cuidados line is the **union** of a produto's materials' lines, so
no produto can exist without care copy. One sentence, annotation voice.

| slug | label | cuidados |
|---|---|---|
| `linho` | Linho | Aspire semanalmente; manchas saem com pano úmido e sabão neutro, nunca esfregando. |
| `boucle` | Bouclé | Escove no sentido da trama; nunca puxe fios soltos — corte rente. |
| `couro-natural` | Couro natural | Hidrate a cada seis meses com creme incolor; mantenha longe de sol direto. |
| `carvalho` | Carvalho | Pano seco no dia a dia; reaplique óleo de acabamento uma vez por ano. |
| `nogueira` | Nogueira | Pano seco; a madeira escurece com a luz, e isso é próprio dela. |
| `freijo` | Freijó | Pano seco; evite produtos à base de silicone, que selam o poro. |
| `jatoba` | Jatobá | Pano seco; a cor amadurece nos primeiros meses e depois estabiliza. |
| `palhinha` | Palhinha | Aspire com bocal de escova; umedeça levemente uma vez por ano para não ressecar. |
| `rattan` | Rattan | Pano úmido e secagem à sombra; ambientes muito secos pedem umidificação. |
| `aco-carbono` | Aço carbono | Pano seco; a pintura eletrostática não pede polimento nem cera. |
| `latao` | Latão | Deixe patinar; para manter o brilho, flanela seca e nada mais. |
| `vidro-temperado` | Vidro temperado | Álcool isopropílico e pano de microfibra; evite abrasivos. |
| `marmore` | Mármore | Seque líquidos na hora — ácidos marcam; impermeabilize a cada dois anos. |
| `ceramica` | Cerâmica | Pano úmido; peças esmaltadas não vão à máquina de lavar. |

### 2.5 Designers

Eight designers across 59 famílias. **An atelier has a roster, not one designer
per piece** — and `marca.md` §1 requires the name always present, which 59
distinct invented names would make noise rather than signature.

`Familia.designer` is a plain string; there is no `Designer` entity, no route and
no bio. Adding one is purely additive if a later effort wants it.

| Designer | Tipos |
|---|---|
| Marina Aoki | `sofas`, `poltronas` |
| Tomás Reis | `mesas-de-jantar`, `mesas`, `mesas-de-centro` |
| Yuki Nakamura | `cadeiras`, `banquetas` |
| Clara Beltrão | `camas`, `cabeceiras` |
| Henrique Sato | `racks-e-estantes`, `estantes`, `guarda-roupas`, `armarios` |
| Alice Prado | `aparadores`, `comodas`, `criados-mudos` |
| Rui Kimura | `escrivaninhas`, `cadeiras-de-trabalho` |
| Beatriz Amaral | `luminarias-de-mesa`, `carrinhos-e-apoios` |

The mapping is by tipo, so a família's designer is **derived** from its tipo — one
more field the build session does not author. Every tipo appears exactly once, so
the derivation is total and unambiguous.

### 2.6 Coleções

`produtos[]` is an ordered, curated list held by the coleção — it is the editorial
act, and it is authoritative on order. `imagem` is `{ src, alt }`
([`imagens.md`](imagens.md) §9.2).

| slug | nome | descricao | produtos[] (in order) |
|---|---|---|---|
| `reboco` | Reboco | Seis peças em tons de cal, desenhadas para uma casa que recebe pouca luz direta. | `sofa-heron-linho-cru`, `poltrona-lina-linho-cru`, `mesa-de-centro-luar-marmore-off-white`, `aparador-pedra-marmore-cru`, `cabeceira-vela-linho-areia`, `luminaria-de-mesa-seixo-ceramica-cru` |
| `serra` | Serra | Cinco peças em madeira maciça escura, para quem quer a marcenaria à vista. | `mesa-de-jantar-ilhota-jatoba`, `cadeira-junco-couro-argila`, `aparador-sereno-carvalho`, `estante-mirante-nogueira`, `comoda-tramo-nogueira` |

**No index page** — `rotas.md` refused `/colecoes`. Both are reachable from the
home's coleção section and from the PDP badge.

---

## 3. O catálogo

65 rows. Columns are exactly the authored fields; everything else derives from
[§8](#8-derivation-rules).

`Fam.` marks a família carrying **two acabamentos** — the two rows share a
`familia`, a `designer`, a `desenho` and, by the invariant `pagina-produto.md` §10
set, **identical `medidas`**.

`Disp.` is `I` = `envio-imediato`, `E` = `sob-encomenda`, `X` = `esgotado`.
`Preço` is `precoTabela` in reais; store it in centavos.

### 3.1 Sala

| # | slug | nome | acabamento | tipo | Preço | Disp. | Fam. |
|---|---|---|---|---|---|---|---|
| 1 | `sofa-heron-linho-cru` | Sofá Héron | Linho Cru | `sofas` | 9.800 | E | ◆ |
| 2 | `sofa-heron-boucle-areia` | Sofá Héron | Bouclé Areia | `sofas` | 11.400 | E | ◆ |
| 3 | `sofa-orla-linho-areia` | Sofá Orla | Linho Areia | `sofas` | 7.600 | I | |
| 4 | `sofa-taipa-couro-argila` | Sofá Taipa | Couro Argila | `sofas` | 14.200 | **X** | |
| 5 | `sofa-maruja-linho-carvao` | Sofá Marujá | Linho Carvão | `sofas` | 8.400 | E | |
| 6 | `poltrona-lina-linho-cru` | Poltrona Lina | Linho Cru | `poltronas` | 3.890 | E | ◆ |
| 7 | `poltrona-lina-boucle-carvalho` | Poltrona Lina | Bouclé Carvalho | `poltronas` | 4.200 | I | ◆ |
| 8 | `poltrona-sagui-couro-nogueira` | Poltrona Saguí | Couro Nogueira | `poltronas` | 5.600 | E | |
| 9 | `mesa-de-centro-seixo-freijo` | Mesa de Centro Seixo | Freijó | `mesas-de-centro` | 2.400 | I | |
| 10 | `mesa-de-centro-luar-marmore-off-white` | Mesa de Centro Luar | Mármore Off-white | `mesas-de-centro` | 4.900 | E | |
| 11 | `mesa-de-centro-vau-jatoba` | Mesa de Centro Vau | Jatobá | `mesas-de-centro` | 3.100 | I | |
| 12 | `mesa-de-jantar-vargem-carvalho` | Mesa de Jantar Vargem | Carvalho | `mesas-de-jantar` | 8.900 | E | ◆ |
| 13 | `mesa-de-jantar-vargem-nogueira` | Mesa de Jantar Vargem | Nogueira | `mesas-de-jantar` | 9.600 | E | ◆ |
| 14 | `mesa-de-jantar-ilhota-jatoba` | Mesa de Jantar Ilhota | Jatobá | `mesas-de-jantar` | 12.800 | E | |
| 15 | `estante-cais-freijo` | Estante Cais | Freijó | `racks-e-estantes` | 6.400 | E | |
| 16 | `rack-varjao-carvalho` | Rack Varjão | Carvalho | `racks-e-estantes` | 5.200 | I | |
| 17 | `estante-tramo-aco-carvao` | Estante Tramo | Aço Carvão | `racks-e-estantes` | 4.100 | I | |
| 18 | `aparador-sereno-carvalho` | Aparador Sereno | Carvalho | `aparadores` | 4.600 | E | |
| 19 | `aparador-pedra-marmore-cru` | Aparador Pedra | Mármore Cru | `aparadores` | 7.200 | E | |
| 20 | `aparador-junco-palhinha-freijo` | Aparador Junco | Palhinha e Freijó | `aparadores` | 3.400 | I | |

### 3.2 Quarto

| # | slug | nome | acabamento | tipo | Preço | Disp. | Fam. |
|---|---|---|---|---|---|---|---|
| 21 | `cama-nuvem-linho-cru` | Cama Nuvem | Linho Cru | `camas` | 8.200 | E | ◆ |
| 22 | `cama-nuvem-boucle-areia` | Cama Nuvem | Bouclé Areia | `camas` | 9.100 | E | ◆ |
| 23 | `cama-orvalho-carvalho` | Cama Orvalho | Carvalho | `camas` | 7.400 | I | |
| 24 | `cama-tatami-freijo` | Cama Tatami | Freijó | `camas` | 6.800 | E | |
| 25 | `cama-abrigo-couro-argila` | Cama Abrigo | Couro Argila | `camas` | 13.500 | E | |
| 26 | `cabeceira-vela-linho-areia` | Cabeceira Vela | Linho Areia | `cabeceiras` | 3.200 | I | ◆ |
| 27 | `cabeceira-vela-boucle-cru` | Cabeceira Vela | Bouclé Cru | `cabeceiras` | 3.600 | E | ◆ |
| 28 | `cabeceira-ripado-carvalho` | Cabeceira Ripado | Carvalho | `cabeceiras` | 4.400 | E | |
| 29 | `criado-mudo-seixo-freijo` | Criado-mudo Seixo | Freijó | `criados-mudos` | 1.850 | I | |
| 30 | `criado-mudo-luar-nogueira` | Criado-mudo Luar | Nogueira | `criados-mudos` | 2.300 | E | |
| 31 | `criado-mudo-junco-palhinha` | Criado-mudo Junco | Palhinha e Freijó | `criados-mudos` | 1.680 | I | |
| 32 | `comoda-vargem-carvalho` | Cômoda Vargem | Carvalho | `comodas` | 5.800 | E | |
| 33 | `comoda-tramo-nogueira` | Cômoda Tramo | Nogueira | `comodas` | 6.900 | E | |
| 34 | `comoda-bruma-freijo` | Cômoda Bruma | Freijó | `comodas` | 4.700 | **X** | |
| 35 | `guarda-roupa-cais-carvalho` | Guarda-roupa Cais | Carvalho | `guarda-roupas` | 15.600 | E | |
| 36 | `guarda-roupa-ripado-freijo` | Guarda-roupa Ripado | Freijó | `guarda-roupas` | 11.900 | E | |
| 37 | `guarda-roupa-bruma-nogueira` | Guarda-roupa Bruma | Nogueira | `guarda-roupas` | 13.200 | E | |

### 3.3 Cozinha

| # | slug | nome | acabamento | tipo | Preço | Disp. | Fam. |
|---|---|---|---|---|---|---|---|
| 38 | `mesa-taipa-jatoba` | Mesa Taipa | Jatobá | `mesas` | 6.200 | E | |
| 39 | `mesa-orla-carvalho` | Mesa Orla | Carvalho | `mesas` | 5.400 | I | |
| 40 | `mesa-pedra-marmore-carvao` | Mesa Pedra | Mármore Carvão | `mesas` | 9.800 | E | |
| 41 | `cadeira-junco-palhinha-freijo` | Cadeira Junco | Palhinha e Freijó | `cadeiras` | 1.480 | I | ◆ |
| 42 | `cadeira-junco-couro-argila` | Cadeira Junco | Couro Argila | `cadeiras` | 1.920 | E | ◆ |
| 43 | `cadeira-vime-rattan-cru` | Cadeira Vime | Rattan Cru | `cadeiras` | 1.240 | I | |
| 44 | `cadeira-tramo-aco-carvao` | Cadeira Tramo | Aço Carvão | `cadeiras` | 980 | I | |
| 45 | `banqueta-seixo-carvalho` | Banqueta Seixo | Carvalho | `banquetas` | 1.180 | I | |
| 46 | `banqueta-vau-freijo` | Banqueta Vau | Freijó | `banquetas` | 1.350 | E | |
| 47 | `banqueta-tramo-aco-carvao` | Banqueta Tramo | Aço Carvão | `banquetas` | 890 | I | |
| 48 | `armario-cais-carvalho` | Armário Cais | Carvalho | `armarios` | 8.600 | E | |
| 49 | `armario-ripado-freijo` | Armário Ripado | Freijó | `armarios` | 7.100 | E | |
| 50 | `armario-bruma-off-white` | Armário Bruma | Laca Off-white | `armarios` | 6.300 | I | |
| 51 | `carrinho-roldana-aco-carvao` | Carrinho Roldana | Aço Carvão | `carrinhos-e-apoios` | 2.100 | I | |
| 52 | `carrinho-junco-rattan-cru` | Carrinho Junco | Rattan Cru | `carrinhos-e-apoios` | 1.740 | I | |
| 53 | `mesa-de-apoio-luar-marmore-cru` | Mesa de Apoio Luar | Mármore Cru | `carrinhos-e-apoios` | 2.680 | E | |

### 3.4 Escritório

| # | slug | nome | acabamento | tipo | Preço | Disp. | Fam. |
|---|---|---|---|---|---|---|---|
| 54 | `escrivaninha-cais-carvalho` | Escrivaninha Cais | Carvalho | `escrivaninhas` | 5.900 | E | |
| 55 | `escrivaninha-vau-freijo` | Escrivaninha Vau | Freijó | `escrivaninhas` | 4.800 | I | |
| 56 | `escrivaninha-tramo-aco-carvao` | Escrivaninha Tramo | Aço Carvão | `escrivaninhas` | 3.900 | I | |
| 57 | `cadeira-de-trabalho-orla-couro-argila` | Cadeira de Trabalho Orla | Couro Argila | `cadeiras-de-trabalho` | 4.200 | E | |
| 58 | `cadeira-de-trabalho-junco-palhinha-freijo` | Cadeira de Trabalho Junco | Palhinha e Freijó | `cadeiras-de-trabalho` | 2.600 | I | |
| 59 | `cadeira-de-trabalho-ripado-carvalho` | Cadeira de Trabalho Ripado | Carvalho | `cadeiras-de-trabalho` | 3.100 | E | |
| 60 | `estante-bruma-freijo` | Estante Bruma | Freijó | `estantes` | 5.100 | E | |
| 61 | `estante-vargem-carvalho` | Estante Vargem | Carvalho | `estantes` | 5.700 | I | |
| 62 | `estante-mirante-nogueira` | Estante Mirante | Nogueira | `estantes` | 6.600 | E | |
| 63 | `luminaria-de-mesa-farol-latao` | Luminária de Mesa Farol | Latão | `luminarias-de-mesa` | 1.420 | **X** | |
| 64 | `luminaria-de-mesa-seixo-ceramica-cru` | Luminária de Mesa Seixo | Cerâmica Cru | `luminarias-de-mesa` | 980 | I | |
| 65 | `luminaria-de-mesa-junco-palhinha` | Luminária de Mesa Junco | Palhinha | `luminarias-de-mesa` | 760 | I | |

### 3.5 Família names repeat across tipos, on purpose

`Tramo`, `Junco`, `Cais`, `Vargem`, `Bruma`, `Seixo`, `Luar`, `Vau`, `Orla`,
`Ripado`, `Taipa` and `Pedra` each name pieces in more than one tipo. These are
**distinct famílias with distinct slugs** — `cadeira-tramo` and `banqueta-tramo`
share nothing structurally.

They are named alike because that is what an atelier line is: `Tramo` is the aço
carbono language, `Junco` the palhinha language, `Cais` the tall casework. It
gives the catalogue an internal rhyme the taxonomy alone cannot, and it costs
nothing — no surface groups by name, and the *outros acabamentos* strip queries
`familia`, which is the slug.

**It is also the highest-risk thing in this file.** A build session that keys
anything off `nome` instead of `familia` will merge pieces that are not related.
The two-acabamento pairs in [§3.7](#37-the-two-acabamento-famílias) are the only
legitimate merges.

### 3.6 Cross-listed pieces

`ambientes[]` ⊋ `[ambientePrincipal]` for exactly seven pieces. Everything else
lists under one room. `ambientePrincipal` drives the breadcrumb and is always the
first room below.

| slug | ambientes[] | Why |
|---|---|---|
| `poltrona-lina-linho-cru` | `sala`, `quarto` | The example `produto.md` itself carries |
| `poltrona-lina-boucle-carvalho` | `sala`, `quarto` | Follows its família |
| `banqueta-seixo-carvalho` | `cozinha`, `sala` | Bancada or side seat |
| `criado-mudo-junco-palhinha` | `quarto`, `sala` | Reads as a side table |
| `estante-mirante-nogueira` | `escritorio`, `sala` | Books live in both |
| `cadeira-junco-palhinha-freijo` | `cozinha`, `sala` | The dining chair at the sala table |
| `mesa-de-apoio-luar-marmore-cru` | `cozinha`, `sala` | Apoio anywhere |

**Nothing cross-lists *into* Escritório**, which is what holds it at exactly 12
and preserves the single-page case from [§1.2](#12-why-not-flat-3).

### 3.7 The two-acabamento famílias

Six, so the *outros acabamentos* strip renders on 12 of 65 PDPs — present enough
to be a real surface, rare enough that a PDP without it is the normal case.

| Família | Acabamentos | Designer |
|---|---|---|
| `sofa-heron` | Linho Cru / Bouclé Areia | Marina Aoki |
| `poltrona-lina` | Linho Cru / Bouclé Carvalho | Marina Aoki |
| `mesa-de-jantar-vargem` | Carvalho / Nogueira | Tomás Reis |
| `cama-nuvem` | Linho Cru / Bouclé Areia | Clara Beltrão |
| `cabeceira-vela` | Linho Areia / Bouclé Cru | Clara Beltrão |
| `cadeira-junco` | Palhinha e Freijó / Couro Argila | Yuki Nakamura |

**`poltrona-lina` is the carve-out família** for [`imagens.md`](imagens.md) §10.3:
its two acabamentos get **two visibly different Unsplash placeholders** in phase 1
— different material, different tone — so the cart thumbnail's one argument stays
testable. It is chosen over the other five because it is also `produto.md`'s
worked example and appears in `ConteudoHome.destaques`, so it is on screen most
often.

### 3.8 Coverage — every demand, checked

| Demand | Source | Satisfied by |
|---|---|---|
| Three `disponibilidade` states | `catalogo.md` §13 | `X` on #4, #34, #63 — one each in sala, quarto, escritório, all in different price brackets |
| Four price brackets | `catalogo.md` §3 | Até 2.000: **13** · 2.000–5.000: **20** · 5.000–10.000: **25** · Acima de 10.000: **7** |
| ≥1 piece in >1 ambiente | `catalogo.md` §13 | 7 pieces, §3.6 |
| No tipo grid under 3 | `catalogo.md` §7 | Floor is 3, §1.2 |
| ≥1 família with 2 acabamentos | `pagina-produto.md` §10 | 6 famílias, §3.7 |
| `envio-imediato` + `sob-encomenda` bought together | `carrinho.md` | #9 `mesa-de-centro-seixo-freijo` (I) + #6 `poltrona-lina-linho-cru` (E, 4 semanas) — the divergent-prazo sentence fires |
| ≥1 produto per ambiente with all three `papel` | `imagens.md` §9.3 | §7.2 |
| Hero with `cotas: ['largura']` | `home.md` §1 | #1 `sofa-heron-linho-cru`, §6 |
| Coleção with non-empty `produtos[]` | `home.md` §4 | `reboco`, 6 peças, §2.6 |
| ≥6 distinct pieces per room for legends | `inspiracoes.md` §8 | §5 — 7 per article |
| CEP fixtures, six regions + não atendida | `checkout.md` §6 | §4 |

The bracket spread is deliberately **top-heavy in the middle two**: an atelier's
catalogue should not have its mass in the cheapest tier, and the 7 pieces above
R$ 10.000 are enough that the `10000-` filter is never an empty grid.

**`precoDe`** (strikethrough promo) is set on exactly three pieces, so the state is
exercised without the store reading as a sale: #3 `sofa-orla-linho-areia`
(de 8.900), #16 `rack-varjao-carvalho` (de 5.900), #43 `cadeira-vime-rattan-cru`
(de 1.480).

**`freteGratis`** is set on five pieces, deliberately the expensive ones — see the
calibration note in [§4.3](#43-a-calibration-note--the-numbers-are-large-on-purpose):
`nacional` on #4 and #35; `sudeste` on #1, #14, #25.

---

## 4. Frete — regions and CEP fixtures

### 4.1 Correction to `carrinho.md` §8 — the regions were unusable

The region table as written has **two defects**, and the second is the serious one.

**Prefixes 76, 77 and 78 matched two regions.** Centro-Oeste was given `70`–`79`
and Norte `66`–`69`, `76`–`78`. For those three prefixes `custo` and
`prazoDiasUteis` are both undefined — the rule returns two answers.

**And the six regions between them covered every prefix from 01 to 99.** So
*região não atendida* was **unreachable**. That is not a rounding error: it is a
state [`erros.md`](erros.md) §5.2 builds an entire copy class around — the `Fato`
class, whose worked example is `Ainda não entregamos neste CEP.` — and which
[`checkout.md`](checkout.md) §6 demands a fixture for. Three specs describe an
error the rule cannot produce.

The corrected table. Changes are in **bold**; base, per-kg and prazo are untouched.

| Region | Prefixes | Base | Per kg | Padrão (dias úteis) |
|---|---|---|---|---|
| Sudeste capitais | `01`–`09`, `20`–`23`, `30`–`31` | R$ 90 | R$ 5,50 | 6 |
| Sudeste interior | `10`–`19`, `24`–`29`, `32`–`39` | R$ 120 | R$ 6,50 | 9 |
| Sul | `80`–`99` | R$ 140 | R$ 7,00 | 11 |
| Centro-Oeste | **`70`–`76`, `78`–`79`** | R$ 170 | R$ 8,50 | 13 |
| Nordeste | `40`–`65` | R$ 190 | R$ 9,50 | 15 |
| Norte | **`66`–`68`, `77`** | R$ 240 | R$ 12,00 | 20 |
| **— não atendida —** | **`69`** | — | — | — |

Two moves. The overlap resolves the way real CEP geography does: **77 is Tocantins**
(Norte), **78–79 are Mato Grosso and Mato Grosso do Sul** (Centro-Oeste). And
**`69` is carved out** — Acre, Roraima and the Amazonas/Rondônia interior, which is
genuinely the hardest freight destination in the country, so a São Paulo atelier
not yet serving it is a *plausible* limit rather than an arbitrary hole.

`69` is the right size for the job: one prefix, memorable, and it does not touch
Belém (`66`), so `carrinho.md` §8's stated argument — that a São Paulo CEP and a
Belém CEP must give visibly different answers — survives intact. That argument is
why the carve-out is not simply "drop Norte".

### 4.2 The fixture table

Seven CEPs. Every one is a real address, so the autofill values are checkable and
nobody has to invent a logradouro.

| CEP | Autofill | Region | Padrão |
|---|---|---|---|
| `01310-100` | Av. Paulista, Bela Vista, São Paulo, SP | Sudeste capitais | 6 d.ú. |
| `13010-000` | Centro, Campinas, SP | Sudeste interior | 9 d.ú. |
| `90010-000` | Centro Histórico, Porto Alegre, RS | Sul | 11 d.ú. |
| `70040-010` | Asa Norte, Brasília, DF | Centro-Oeste | 13 d.ú. |
| `40010-000` | Comércio, Salvador, BA | Nordeste | 15 d.ú. |
| `66010-000` | Campina, Belém, PA | Norte | 20 d.ú. |
| `69900-000` | Centro, Rio Branco, AC | **não atendida** | — |

A CEP whose prefix is not in [§4.1](#41-correction-to-carrinhomd-8--the-regions-were-unusable)
is *região não atendida*. A CEP not in this table but with a served prefix
resolves its region normally and autofills **nothing** — the address fields open
empty and editable. That is the honest behaviour for a mock: the region is
computable from the prefix, the street is not.

Both are `Fato`-class, not `Corrigível` — a correctly-typed CEP is never called
inválido, per `erros.md` §5.2. A malformed CEP (wrong digit count) is the
`Corrigível` case and is a different message.

### 4.3 A calibration note — the numbers are large on purpose

Cubed weight at the `/6000` divisor makes furniture freight expensive.
`sofa-heron-linho-cru` boxes at roughly 248 × 118 × 96 cm → 468 kg cubado. To São
Paulo that is `90 + 5,50 × 468` ≈ **R$ 2.664**; to Belém, `240 + 12 × 468` ≈
**R$ 5.856**, which exceeds half the sofa's price.

This is arithmetically correct and it is what real Brazilian furniture freight
does. It is recorded here so a build session does not "fix" it as a bug. It is
also why `freteGratis` in [§3.8](#38-coverage--every-demand-checked) lands on the
largest pieces: the hero and the two most expensive items render **Grátis** rather
than a number that swamps them, and the widget still proves itself on everything
else.

---

## 5. Inspirações — the four articles

One per ambiente, `ambiente` required and unique across the four
([`inspiracoes.md`](inspiracoes.md) §8). `ordem` is authored index order, not
recency.

| ordem | slug | titulo | ambiente | resumo (one line) |
|---|---|---|---|---|
| 1 | `a-luz-da-tarde-na-sala` | A luz da tarde | `sala` | Como uma sala muda quando o sol baixa, e o que fica bem nela às cinco da tarde. |
| 2 | `o-quarto-como-abrigo` | O quarto como abrigo | `quarto` | Menos peças, mais silêncio: o argumento para esvaziar o cômodo em que se dorme. |
| 3 | `a-cozinha-que-recebe` | A cozinha que recebe | `cozinha` | Quando a mesa da cozinha passa a ser a mesa da casa. |
| 4 | `trabalhar-em-silencio` | Trabalhar em silêncio | `escritorio` | Uma escrivaninha, uma luminária, uma cadeira — e o resto é disciplina. |

### 5.1 The legends

Three `fotos` per article: `[0]` is `ampla`, `[1]` and `[2]` are `detalhe`. Each
carries 2–5 `pecas` — produto slugs, not famílias.

**The invariant:** the union across an article's three `pecas[]` arrays contains
**no duplicates**, and every piece named lists under that article's `ambiente`.
Both hold below; both are worth a build-time assertion.

**A luz da tarde** — `sala`, 7 peças

| Foto | papel | pecas[] |
|---|---|---|
| 0 | `ampla` | `sofa-heron-linho-cru`, `mesa-de-centro-seixo-freijo`, `poltrona-lina-linho-cru` |
| 1 | `detalhe` | `estante-cais-freijo`, `aparador-pedra-marmore-cru` |
| 2 | `detalhe` | `mesa-de-apoio-luar-marmore-cru`, `banqueta-seixo-carvalho` |

**O quarto como abrigo** — `quarto`, 7 peças

| Foto | papel | pecas[] |
|---|---|---|
| 0 | `ampla` | `cama-nuvem-linho-cru`, `cabeceira-vela-linho-areia`, `criado-mudo-seixo-freijo` |
| 1 | `detalhe` | `comoda-vargem-carvalho`, `criado-mudo-luar-nogueira` |
| 2 | `detalhe` | `poltrona-lina-linho-cru`, `guarda-roupa-ripado-freijo` |

**A cozinha que recebe** — `cozinha`, 7 peças

| Foto | papel | pecas[] |
|---|---|---|
| 0 | `ampla` | `mesa-taipa-jatoba`, `cadeira-junco-palhinha-freijo`, `banqueta-seixo-carvalho` |
| 1 | `detalhe` | `armario-cais-carvalho`, `carrinho-roldana-aco-carvao` |
| 2 | `detalhe` | `mesa-de-apoio-luar-marmore-cru`, `cadeira-vime-rattan-cru` |

**Trabalhar em silêncio** — `escritorio`, 7 peças

| Foto | papel | pecas[] |
|---|---|---|
| 0 | `ampla` | `escrivaninha-cais-carvalho`, `cadeira-de-trabalho-orla-couro-argila`, `estante-mirante-nogueira` |
| 1 | `detalhe` | `luminaria-de-mesa-seixo-ceramica-cru`, `luminaria-de-mesa-junco-palhinha` |
| 2 | `detalhe` | `escrivaninha-vau-freijo`, `cadeira-de-trabalho-ripado-carvalho` |

**Cross-listed pieces are doing real work here.** `banqueta-seixo-carvalho`
appears in the Sala article *and* the Cozinha one; `mesa-de-apoio-luar` likewise;
`poltrona-lina-linho-cru` in Sala and Quarto. The no-duplicates rule is **within**
an article, not across the four — a piece that genuinely lives in two rooms should
be legible in both, and this is the payoff for §3.6 existing at all.

`abertura` and `passagens` are **copy direction, not copy** — the map's normal
rule. Each article's abertura opens on the light or the hour, never on the
product; the two passagens sit between the fotos and carry the argument the resumo
compresses.

---

## 6. ConteudoHome

```ts
{
  destaqueHome: 'sofa-heron-linho-cru',
  destaques: [
    'poltrona-lina-linho-cru',
    'mesa-de-jantar-vargem-carvalho',
    'luminaria-de-mesa-seixo-ceramica-cru',
  ],
  colecaoDestaque: 'reboco',
  inspiracoes: [
    'a-luz-da-tarde-na-sala',
    'o-quarto-como-abrigo',
    'trabalhar-em-silencio',
  ],
}
```

**The hero** is `sofa-heron-linho-cru`, and it satisfies `home.md` §1's hard
precondition: its `principal` image declares `cotas: ['largura']`, reading its
`medidas.largura` off the record. Without that the hero does not render, so this
is the one slug in the file whose image record is not optional.

**The three destaques** are one per price bracket above the entry tier and one per
ambiente other than Cozinha — a poltrona at 3.890, a mesa de jantar at 8.900, a
luminária at 980. They are not best-sellers, because there is no sales data; they
are authored, exactly as `home.md` §3 said.

**Three of four articles** appear, per `home.md` §6. `a-cozinha-que-recebe` is the
one held back — it is the only article whose room is unrepresented in `destaques`,
so the home does not repeat itself.

**`colecaoDestaque: 'reboco'`** renders `6 PEÇAS` on the régua, derived from
`colecao.produtos.length`, never authored — `home.md` §4.

### 6.1 Correction to `home.md` §1 — `designer` is not on `Produto`

`home.md` §1's data table sources the hero subtitle from
`produto.acabamento, produto.designer`. **`Produto` has no `designer` field.** It
lives on `Familia` ([`pagina-produto.md`](pagina-produto.md) §10), deliberately —
authorship does not change with the finish.

The hero resolves it as `familias[produto.familia].designer`. Cosmetic, but it is
written as a direct field read and a build session will look for the field. The
same resolution applies anywhere else a designer is shown next to a produto.

---

## 7. Imagens

[`imagens.md`](imagens.md) §9.3 fixed the volume rule: **only `principal` is
required**; `ambientada` and `detalhe` are rare and authored. At 65 produtos that
is 65 required photographs, not 195.

### 7.1 Phase 1 costs nothing

Every `src` is a **hotlinked Unsplash CDN URL** and **repetition is explicitly
fine** (`imagens.md` §10.1) — one photograph may serve twenty produtos. The only
deliberately-chosen images in phase 1 are the two carve-out placeholders in §3.7.

Build prerequisite, unchanged: `images.remotePatterns` for `images.unsplash.com`
in `next.config.ts`, which is currently bare.

### 7.2 The full-coverage floor

`imagens.md` §9.3 requires at least one produto per ambiente carrying all three
`papel` roles. Four pieces, chosen because each is already load-bearing elsewhere:

| Ambiente | Produto | Also |
|---|---|---|
| `sala` | `poltrona-lina-linho-cru` | `produto.md`'s worked example, which already lists all three |
| `quarto` | `cama-nuvem-linho-cru` | Opens the Quarto article |
| `cozinha` | `cadeira-junco-palhinha-freijo` | Opens the Cozinha article |
| `escritorio` | `escrivaninha-cais-carvalho` | Opens the Escritório article |

`sofa-heron-linho-cru` carries `principal` + `ambientada` — it is the hero and the
home's §1 layout wants the room shot — but not `detalhe`. Every other produto
carries `principal` alone.

### 7.3 Régua budget

`cotas` is non-empty on **exactly the pieces that need it**, because an empty régua
is prohibited and a régua on everything makes it ornament (`marca.md` §2):

- `sofa-heron-linho-cru` — `['largura']`, the hero. Required.
- The four §7.2 pieces — `['largura']` on `principal`.
- Everything else — `[]`.

The ceiling of two cotas per piece is never approached; no produto in this set
declares `['largura', 'altura']`. Vertical cotas stay available for the build
effort to spend on the PDP if a section wants one.

---

## 8. Derivation rules

Everything not authored in §3. These are **rules, not defaults** — a build session
follows them rather than choosing, so two sessions produce the same catalogue.

### 8.1 `cor` and `materiais`

Both read off `acabamento`, which is authored. `acabamento` is written as
`{Material} {Cor}` or `{Material} e {Material}` throughout §3.

- `cor` — the colour word in `acabamento`, slugged. `Linho Cru` → `cru`.
  Where `acabamento` names no colour (`Carvalho`, `Freijó`, `Jatobá`, `Latão`,
  `Palhinha`), `cor` is the wood's own: carvalho → `areia`, freijó → `areia`,
  nogueira → `nogueira`, jatobá → `terracota`, latão → `ocre`, palhinha → `cru`.
- `materiais` — every material named in `acabamento`, plus the **structural**
  material of the tipo where the acabamento names only a surface. An upholstered
  piece is always `[<tecido ou couro>, 'carvalho']`; a palhinha piece is always
  `['palhinha', <madeira>]`. `Mármore Cru` → `['marmore', 'carvalho']`.

The consequence is that the material filter never returns an empty set for a
structural wood, and every produto has ≥2 materiais, so the PDP's Cuidados union
is never a single line.

### 8.2 `medidas`

Authored **per família**, not per produto — the invariant `pagina-produto.md` §10
set is that two acabamentos share geometry, or the one technical drawing lies
about one of them.

Pick within the envelope for the tipo. Values are cm, integers, always `L × P × A`.

| Tipo | largura | profundidade | altura |
|---|---|---|---|
| `sofas` | 180–260 | 88–102 | 68–82 |
| `poltronas` | 68–92 | 74–88 | 70–84 |
| `mesas-de-centro` | 90–130 | 55–75 | 32–42 |
| `mesas-de-jantar` | 160–240 | 85–100 | 74–78 |
| `mesas` | 120–180 | 75–90 | 74–78 |
| `racks-e-estantes`, `estantes` | 90–200 | 32–45 | 140–210 |
| `aparadores` | 120–180 | 38–48 | 75–88 |
| `camas` | 145–200 | 200–215 | 35–110 |
| `cabeceiras` | 145–200 | 8–14 | 90–120 |
| `criados-mudos` | 45–60 | 38–45 | 50–62 |
| `comodas` | 90–140 | 45–52 | 75–95 |
| `guarda-roupas` | 160–260 | 58–65 | 210–240 |
| `cadeiras`, `cadeiras-de-trabalho` | 44–58 | 48–60 | 78–92 |
| `banquetas` | 38–46 | 38–46 | 62–76 |
| `armarios` | 80–160 | 40–55 | 180–220 |
| `carrinhos-e-apoios` | 40–75 | 38–55 | 55–78 |
| `escrivaninhas` | 110–160 | 55–70 | 74–78 |
| `luminarias-de-mesa` | 18–34 | 18–34 | 38–56 |

**Larger price within a tipo means larger piece** — monotonic, so the régua never
contradicts the price the shopper is reading beside it.

### 8.3 `medidasExtras`

Open list, per `produto.md`. By tipo, and **only where the fact is real**:

| Tipo | Rows |
|---|---|
| `sofas` | Altura do assento (cm) · Quantidade de lugares (un) · Quantidade de almofadas (un) |
| `poltronas`, `cadeiras`, `cadeiras-de-trabalho`, `banquetas` | Altura do assento (cm) · Capacidade de peso (kg) |
| `mesas-de-jantar`, `mesas` | Quantidade de lugares (un) · Espessura do tampo (cm) |
| `camas` | Altura do estrado (cm) · Colchão recomendado (cm) |
| `guarda-roupas`, `armarios` | Quantidade de portas (un) · Prateleiras internas (un) |
| `racks-e-estantes`, `estantes` | Prateleiras (un) · Capacidade por prateleira (kg) |
| `comodas`, `criados-mudos` | Quantidade de gavetas (un) |
| `luminarias-de-mesa` | Alcance do braço (cm) · Soquete (un) |
| `aparadores`, `carrinhos-e-apoios`, `cabeceiras` | — none |

Three tipos carry no extras on purpose: the PDP's **Medidas** section must render
correctly with `medidasExtras: []`, and if every tipo had rows that case would
never be seen.

### 8.4 `embalagem`

Derived, not authored:

```
volumes      = 1, except: camas 2, guarda-roupas 3, armarios 2,
               mesas-de-jantar 2, sofas com largura ≥ 220 cm 2
largura      = medidas.largura + 8
profundidade = medidas.profundidade + 8
altura       = medidas.altura + 6
pesoKg       = round(volume_m3 × densidade_do_tipo)
```

`densidade_do_tipo` in kg/m³: estofados 55 · madeira maciça 210 · madeira com
painel 160 · aço 240 · palhinha/rattan 70 · mármore 480 · cerâmica/latão 300.

Multi-volume pieces divide the box dimensions across volumes; the freight rule
multiplies by `volumes`, so the totals stay right either way.

This is derived rather than authored because `carrinho.md` §8's cubed-weight rule
reads it directly — a hand-typed `pesoKg` that disagrees with the box makes the
freight quote arbitrary, and the whole argument for the CEP widget is that its
answers are computed.

### 8.5 `montagem`

By tipo. `nivel` drives the price via `politicas.montagemCentavos`, so this table
is also the montagem price table.

| Tipo | necessaria | nivel | pessoas | pecas | tempoMinutos |
|---|---|---|---|---|---|
| `poltronas`, `banquetas`, `criados-mudos`, `mesas-de-centro` | true | `simples` | 1 | 4–6 | 15–25 |
| `cadeiras`, `cadeiras-de-trabalho` | true | `simples` | 1 | 5–8 | 15–20 |
| `luminarias-de-mesa` | **false** | `simples` | 1 | 1 | 0 |
| `mesas`, `mesas-de-jantar`, `escrivaninhas`, `aparadores`, `carrinhos-e-apoios` | true | `media` | 2 | 8–14 | 35–60 |
| `sofas`, `comodas`, `cabeceiras` | true | `media` | 2 | 6–12 | 30–50 |
| `camas`, `racks-e-estantes`, `estantes` | true | `complexa` | 2 | 18–30 | 70–110 |
| `guarda-roupas`, `armarios` | true | `complexa` | 2 | 24–40 | 100–160 |

The three luminárias are the only `necessaria: false` pieces — the PDP's montagem
block must render its no-assembly state somewhere, and this is where.

### 8.6 `descricao`

Copy **direction**, per the map's normal rule — the exception this file claims
covers identity, not prose. Three sentences, in this order:

1. **What it is and what it is for**, in one sentence, naming the material.
   Never opens with the piece's own name.
2. **One construction fact** the marcenaria would mention — the joint, the grain,
   the cushion fill, the finish. This is the atelier's voice and it is the
   sentence that cannot be generic.
3. **Where it sits**, connecting to the room without instructing the reader.

No superlatives, no second-person imperative, no exclamation. 45–70 words. The
register is `marca.md` §4's body voice.

### 8.7 `itensInclusos`

`[the piece itself] + [manual de montagem if montagem.necessaria] + [tooling]`.
Tooling is `chave allen` for `simples`, `chave allen e gabarito de furação` for
`media` and `complexa`. Upholstered pieces add their loose cushions as a counted
row. Luminárias list `lâmpada não inclusa` — the one negative row in the set, and
it belongs here rather than in `descricao` because a shopper checks the list.

### 8.8 `alt`

Templated per `imagens.md` §5, which already fixed the convention. No new rule.

### 8.9 Fields with no rule, because they are policy

`garantiaMeses` is **omitted on every produto in this set** — all 65 take the store
default of 24 months. The field exists for a future exception; leaving it unset
everywhere is what proves the `?? garantiaPadraoMeses` fallback works.

`precoDe` and `freteGratis` are authored, on the eight pieces named in §3.8.

`ordem` is the row number in §3 — 1 through 65, global, exactly as `catalogo.md`
§11 specified. One piece has one curatorial position in every slice.

---

## 9. Worked exemplars

Six records a build session should write **first**, one per structural case, so
the rules above have a checkable output before the other 59 are transcribed.

| # | Produto | The case it settles |
|---|---|---|
| 1 | `sofa-heron-linho-cru` | The hero — the `cotas: ['largura']` precondition, multi-volume embalagem, `freteGratis` |
| 2 | `poltrona-lina-linho-cru` | `produto.md`'s own example, all three `papel` roles, two-ambiente listing, the carve-out família |
| 3 | `poltrona-lina-boucle-carvalho` | The **second acabamento** — identical `medidas`, different everything else |
| 4 | `sofa-taipa-couro-argila` | `esgotado` — no CTA, and the fields that stay populated anyway |
| 5 | `luminaria-de-mesa-junco-palhinha` | `montagem.necessaria: false`, entry price, `principal` only, `lâmpada não inclusa` |
| 6 | `cadeira-junco-palhinha-freijo` | Cross-listed, all three roles, opens an article, cheapest full-coverage piece |

Records 2 and 3 come before the rest: together they exercise the família
invariant, the *outros acabamentos* strip and the cart thumbnail's one argument,
and they are the only two placeholders in phase 1 that must be visibly different.
Record 2 is already written out in full in `produto.md`'s **Example** block — it
needs transcribing, not authoring.

The records are **not** written as TypeScript literals here. This file fixes every
value they contain: §3 gives identity, §8 gives each derived field a rule, §7
gives the image roles. Materialising them into a module is **execution**, and the
map plans rather than builds.

---

## 10. What this hands to the build effort

The map ends here. What a build session needs that is *not* in these sixteen spec
files:

- **Transcribe** §3 and §8 into whatever module shape it prefers — TS, JSON, MDX.
  `produto.md` was explicit that where records physically live is a build-session
  call.
- **Choose the Unsplash URLs.** 65 `principal`, ~8 additional roles, 4 ambientes,
  2 coleções, 12 article photos, 59 família elevations. Repetition is fine
  everywhere except the `poltrona-lina` pair.
- **Assert the invariants** the seed data relies on, none of which the type system
  catches: no duplicate `pecas` within an article; every article piece lists under
  its room; famílias share `medidas`; exactly one `principal` per produto, first;
  `cotas` non-empty only where `medidas` supplies the figure;
  `ConteudoHome.destaqueHome` resolves to a produto whose principal declares
  `cotas: ['largura']`; every produto's `tipo` is in its `ambientePrincipal`'s
  curated `tipos[]`.
- **Add `images.remotePatterns`** for `images.unsplash.com` to `next.config.ts`.
- **Fix `lang="en"`** in `app/layout.tsx` — the map flagged it at charting and no
  ticket owned it.

---

## 11. Corrections this file makes

Three, all to closed specs, all applied in the text above:

1. **`carrinho.md` §8** — region prefixes 76–78 were double-assigned, and the six
   regions together covered every prefix 01–99, making *região não atendida*
   unreachable although `erros.md` §5.2 and `checkout.md` §6 both depend on it.
   Corrected in [§4.1](#41-correction-to-carrinhomd-8--the-regions-were-unusable).
2. **`home.md` §1** — sources the hero subtitle from `produto.designer`, a field
   that lives on `Familia`. Corrected in
   [§6.1](#61-correction-to-homemd-1--designer-is-not-on-produto).
3. **`checkout.md` §6.1, `checkout.md` §13 and `erros.md` §5.2** — all three link
   to `/politicas/prazos-e-entrega`, which is **not one of the four policy slugs**
   `rotas.md` enumerates and is therefore a 404. The intended target is
   **`/politicas/entrega-e-frete`**, which `rotas.md` describes as absorbing
   "per-CEP quoting, montagem, bulky-item access" — exactly what those three links
   want. Three dead links, one slug.

None of the three reopens a ticket. All are the kind of in-flight correction
`catalogo.md` and `imagens.md` already made to `produto.md`.

---

## 12. Deliberate omissions

Considered and dropped — recorded so they are not relitigated:

- **Full `Produto` literals for all 65.** Depth was settled as identity-plus-rules;
  §8 is what makes "not authored" different from "invented".
- **A `Designer` entity.** Eight strings derived from tipo. A bio page is a route
  nobody asked for.
- **More than two coleções.** Two exercise the badge, the route and the home slot.
- **Seasonal or promotional structure.** Three `precoDe` pieces are the whole
  extent of it; a concept store with a sale season is a different store.
- **A fifth article.** `inspiracoes.md` fixed exactly four, one per ambiente.
- **Per-produto `garantiaMeses`.** §8.9 — the empty case is the one worth testing.
