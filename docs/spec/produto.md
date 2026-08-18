# Produto — modelo de dados

The fake data model the listing, product page and cart all read from, plus the
related shapes it drags in. Resolved by
[ticket 003 — Product data shape](../../.wayfinder/tickets/003-product-data-shape.md).

No backend is in scope. This file specifies *shapes*, not sources — where the
records physically live (TS module, JSON, MDX) is a build-session call.

## Conventions

1. **Field names are pt-BR**, matching the no-English-seams rule in
   [`rotas.md`](./rotas.md). `precoTabela`, never `listPrice`.
2. **The `slug` is the key.** No synthetic ids — a fake catalogue with numeric
   primary keys carries a database it does not have. Every entity below is keyed
   by its slug, and product slugs follow the `{nome}-{material-ou-acabamento}`
   pattern fixed in `rotas.md`.
3. **Prices are integers in centavos.** `1290000` renders as `R$ 12.900,00` via
   `Intl.NumberFormat('pt-BR')`. Centavos always shown. Query params
   (`?preco=2000-5000`) stay in whole reais — that is a URL surface, not storage.
4. **Lengths are integers in centimetres.** Never inches, never metres.
5. **Store-wide commercial policy is stated once**, in [Políticas
   comerciais](#políticas-comerciais), and derived per product — never copied onto
   each record. An authored catalogue drifts; a derived one cannot.

## Produto

One record per **acabamento**. `poltrona-lina-linho-cru` and
`poltrona-lina-boucle-carvalho` are two products sharing a `familia`.

This follows the slug decision in `rotas.md`, which chose
`{nome}-{material-ou-acabamento}` precisely because "name alone collides across
the variants the catalogue will carry". A nested `variantes[]` would contradict
that URL and force every surface to resolve an axis before it can render a price,
an image or a medida.

```ts
type Produto = {
  slug: string;              // 'poltrona-lina-linho-cru'
  nome: string;              // 'Poltrona Lina' — no dimension, no finish
  familia: string;           // -> Familia.slug
  acabamento: string;        // 'Linho Cru' — label, display only

  tipo: string;              // -> Tipo.slug — exactly one
  ambientePrincipal: string; // -> Ambiente.slug — drives the breadcrumb
  ambientes: string[];       // -> Ambiente.slug[] — every room it lists under
  colecoes: string[];        // -> Colecao.slug[] — usually empty

  precoTabela: number;       // centavos — the reference/parcelado price
  precoDe?: number;          // centavos — strikethrough, promo only

  cor: string;               // -> Cor.slug — exactly one
  materiais: string[];       // -> Material.slug[] — one or more

  medidas: Medidas;
  medidasExtras: MedidaExtra[];
  embalagem: Embalagem;
  montagem: Montagem;

  disponibilidade: 'envio-imediato' | 'sob-encomenda' | 'esgotado';
  prazoProducaoSemanas?: number;   // required iff 'sob-encomenda'

  freteGratis?: 'nacional' | 'sudeste' | 'sp-capital';

  imagens: Imagem[];         // >= 1, exactly one with papel 'principal', first
  descricao: string;         // the PDP body copy
  itensInclusos: string[];
  garantiaMeses?: number;    // omitted -> store default (24)
};
```

### Why no `avaliacao`

Ratings are **out of the shape entirely** — no média, no count, no reviews. With
no auth in scope nobody can write one, so any figure shown is invented social
proof, and a row of gold stars is the loud commerce register that
[`marca.md`](./marca.md) ruled out. Adding it later is purely additive; nothing
below depends on its absence.

## Nome e cota

`nome` stays clean — `"Poltrona Lina"`, not `"Poltrona Lina Linho Cru 78cm"`.

The BR convention is that the headline dimension belongs in the title, because a
shopper filters by the width that has to fit a wall
([research §7.4](../research/br-ecommerce-conventions.md)). Canto Zen honours that
convention **in the brand's voice rather than its presence**, the resolution
[ticket 002](../../.wayfinder/tickets/002-brand-direction.md) already reached: the
number appears as the **cota on the image**, which is the identity's signature
gesture and was chosen over the two rival directions exactly because it carries
information. Putting the figure in the string too would state it twice and make
the régua ornamental — which `marca.md` forbids.

So: the cm is never absent, and never in the name.

## Medidas

```ts
type Medidas = {
  largura: number;       // cm — always present
  profundidade: number;  // cm — always present
  altura: number;        // cm — always present
};

type MedidaExtra = {
  rotulo: string;        // 'Altura do assento'
  valor: number;
  unidade: 'cm' | 'kg' | 'un';
};
```

The trio is **mandatory and typed** because three separate surfaces are
load-bearing on it: the catalogue filters, the régua (which must read a real
number), and the freight/access disclosure. Always rendered in that order, always
as `L {n} × P {n} × A {n} cm` per `marca.md`.

Everything else is an **open list**, because a sofá's "altura do assento" and a
luminária's "alcance" cannot share a schema, and a fixed exhaustive field set
would be a wide table of nulls. `medidasExtras` renders as the *Especificações
técnicas* rows: altura do assento, capacidade de peso, quantidade de lugares,
quantidade de almofadas.

### Embalagem

A second set of numbers, because that is what has to pass the door and the lift.

```ts
type Embalagem = {
  volumes: number;       // how many boxes
  largura: number;       // cm
  profundidade: number;  // cm
  altura: number;        // cm
  pesoKg: number;
};
```

Drives cubed-freight quoting and the bulky-item access note ("confira se o produto
passa pelo elevador e portas").

## Imagens

```ts
type Imagem = {
  src: string;
  alt: string;                          // required
  papel: 'principal' | 'ambientada' | 'detalhe' | 'escala';
  cotas: ('largura' | 'altura')[];      // default []
};
```

- Exactly one `principal` — the plaster packshot, raking late-afternoon light,
  the piece alone — and it is first.
- `cotas` names which axes this image annotates; the figure itself is read from
  `medidas`. This is what makes `marca.md`'s **prohibition** enforceable: an empty
  régua is forbidden, so a régua that cannot be traced to a real number must not
  render. Max two cotas per piece (largura, altura) is a brand rule the type
  already caps.
- Roles are named, not positional — a product with no ambientada shot must not
  silently promote a detail macro into that slot.
- `alt` is required. The commitment *level* is still open (see the map), but no
  level makes a missing alt acceptable.

## Montagem

```ts
type Montagem = {
  necessaria: boolean;
  nivel: 'simples' | 'media' | 'complexa';
  pessoas: number;
  pecas: number;
  tempoMinutos: number;
};
```

Physical facts on the product; **price derived** from `nivel` via
[Políticas comerciais](#políticas-comerciais). Tok&Stok states the cost "é
calculado de acordo com o nível de complexidade e também o tempo de montagem", so
a derived figure is the faithful model — and it stays provably consistent with the
complexity shown directly above it, which a hand-authored number will not.

Modelled promise: montagem happens **on the scheduled delivery day**
(Tok&Stok's pattern, which the research explicitly prefers over Mobly's separate
scheduling).

**Consequence for other surfaces:** when montagem is purchased, the 7-day
arrependimento window counts from the **assembly date**, not the delivery date.

## Disponibilidade

| Valor | Card | Significado |
| --- | --- | --- |
| `envio-imediato` | badge *Envio Imediato* | em estoque, despacho rápido |
| `sob-encomenda` | prazo de produção em semanas | feito sob encomenda |
| `esgotado` | sem CTA de compra | indisponível |

Three states, not a count. A concept store has no inventory to count, and a count
invites *"restam apenas 2"* — manufactured urgency, ruled out by the brand
direction. The split must be visible **on the card**, not only the PDP
(research §7.1).

`prazoProducaoSemanas` is distinct from the delivery prazo: production precedes
dispatch, and the CEP-quoted prazo is counted in **dias úteis after confirmação de
pagamento**.

## Entidades relacionadas

Slugs are ASCII-folded, labels keep their accents — `escritorio` / "Escritório".

```ts
type Ambiente = {
  slug: string;      // 'sala'
  label: string;     // 'Sala'
  tipos: string[];   // -> Tipo.slug[] — CURATED, in menu order
  imagem: { src: string; alt: string };  // room photograph — added by home.md §8
};

type Tipo = {
  slug: string;          // 'sofas'
  label: string;         // 'Sofás'
  labelSingular: string; // 'Sofá' — breadcrumbs, headings
};

type Cor = { slug: string; label: string; amostra: string }; // amostra = hex swatch
type Material = { slug: string; label: string };

type Familia = { slug: string; nome: string };  // 'Poltrona Lina'

type Colecao = {
  slug: string;
  nome: string;
  descricao: string;
  imagem: Imagem;
  produtos: string[];   // -> Produto.slug[] — CURATED ORDER
};
```

Two things justify entities over bare strings on the product:

- **Room × type pairs are curated, not generated.** `Ambiente.tipos` is the source
  of truth for the mega-menu and for which routes exist; `rotas.md` requires
  `/cozinha/sofas` to 404 rather than render an empty grid, which is impossible if
  the taxonomy is inferred from whatever products happen to exist.
- **Every facet needs a slug *and* an accented label**, and colours additionally
  need a swatch.

> **`Ambiente.imagem` was added after this ticket closed**, by
> [`home.md`](home.md) §8 — the home's Ambientes section needs a room photograph
> and nothing here supplied one. Deliberately not an `Imagem`: that type carries
> `papel` and `cotas`, and a régua on a room photo is forbidden, so both fields
> would exist only to stay empty. Additive, not a reversal.

`Familia` is deliberately thin — it exists so the PDP's *outros acabamentos* strip
has a display name. It has **no route**; `familias` is not a reserved segment and
must not become one.

`Colecao.produtos` is an ordered list held by the collection, not a back-reference
from each product, because a collection is a merchandising device whose sequence is
the editorial act. `Produto.colecoes` is kept alongside it as a convenience for the
PDP badge; the collection's list is authoritative on order.

## Políticas comerciais

Store-wide, stated once. Every price, badge and add-on figure derives from these.

```ts
const politicas = {
  descontoPixPercent: 10,
  parcelasMax: 10,
  parcelaMinimaCentavos: 15000,     // R$ 150,00
  garantiaPadraoMeses: 24,
  montagemCentavos: {
    simples: 9900,
    media: 19900,
    complexa: 34900,
  },
};
```

### Derivações

| Valor exibido | Derivação |
| --- | --- |
| preço à vista | `precoTabela × (1 − descontoPixPercent/100)` |
| badge do desconto | `"{descontoPixPercent}% à vista no Pix"` |
| linha de parcelamento | maior `N ≤ parcelasMax` tal que `precoTabela / N ≥ parcelaMinima` |
| tabela 1x…Nx | `precoTabela / n` para cada `n` |
| preço da montagem | `montagemCentavos[montagem.nivel]` |
| garantia | `garantiaMeses ?? garantiaPadraoMeses` |

One authored number per product means the catalogue cannot drift into
inconsistency, and it puts the Pix discount where it belongs — a commercial policy
stated once, which is also how the legal disclosure reads. The discount must be
**visibly disclosed** for the differential price to be lawful (Lei 13.455 /
CDC art. 5º-A) — see the research.

## Frete

The product carries physical facts; the **quote is a global mock rule**, because
furniture freight is cubed, not price-based.

```ts
type OpcaoFrete = { rotulo: string; centavos: number; prazoDiasUteis: number };

// (cep, embalagem, freteGratis) -> OpcaoFrete[]
```

CEP prefix maps to a region; region plus cubed weight
(`max(pesoKg, volume/6000)` — VTEX's rule: peso real ou cubado, vale o maior)
yields the option list. `freteGratis` zeroes the matching region's standard option
and renders as **"Grátis"**, never `R$ 0,00`.

A flat national fee would make the CEP widget theatre — typing a CEP in Bahia and
one in São Paulo must give different answers, or the field should not exist. The
same facts let the cart split into **more than one delivery group** when items
ship separately.

The mock rule's regions, tiers and prazos are the **cart and checkout tickets'**
to fix; this file only fixes where the inputs live.

## Exemplo

```ts
{
  slug: 'poltrona-lina-linho-cru',
  nome: 'Poltrona Lina',
  familia: 'poltrona-lina',
  acabamento: 'Linho Cru',
  tipo: 'poltronas',
  ambientePrincipal: 'sala',
  ambientes: ['sala', 'quarto'],
  colecoes: [],
  precoTabela: 389000,               // R$ 3.890,00 -> à vista R$ 3.501,00
  cor: 'cru',
  materiais: ['linho', 'carvalho'],
  medidas: { largura: 78, profundidade: 82, altura: 74 },
  medidasExtras: [
    { rotulo: 'Altura do assento', valor: 42, unidade: 'cm' },
    { rotulo: 'Capacidade de peso', valor: 120, unidade: 'kg' },
  ],
  embalagem: { volumes: 1, largura: 86, profundidade: 90, altura: 80, pesoKg: 24 },
  montagem: { necessaria: true, nivel: 'simples', pessoas: 1, pecas: 5, tempoMinutos: 20 },
  disponibilidade: 'sob-encomenda',
  prazoProducaoSemanas: 4,
  imagens: [
    { src: '…', alt: 'Poltrona Lina em linho cru sobre reboco', papel: 'principal', cotas: ['largura'] },
    { src: '…', alt: 'Poltrona Lina em uma sala de estar', papel: 'ambientada', cotas: [] },
    { src: '…', alt: 'Trama do linho cru no encosto', papel: 'detalhe', cotas: [] },
  ],
  descricao: '…',
  itensInclusos: ['1 poltrona', 'manual de montagem', 'chave allen'],
}
```

## Restrições entregues a outros tickets

- **[Catálogo](../../.wayfinder/tickets/008-catalog.md)** — filters read `cor`
  (single), `materiais` (any-match), `precoTabela`, `tipo`. The card renders
  `disponibilidade` as a badge.
- **[Produto](../../.wayfinder/tickets/009-product-detail.md)** — the *outros
  acabamentos* strip queries by `familia`. `medidasExtras` is the
  Especificações table. The montagem block reads the derived price.
- **[Route metadata](../../.wayfinder/tickets/015-route-metadata.md)** — there is
  **no short description field**. A product has one `descricao`, the PDP body.
  Meta descriptions must be truncated from it or authored separately in that
  ticket; this file does not decide which.
- **[Imagery](../../.wayfinder/tickets/014-imagery.md)** — `papel` fixes the four
  shot types the imagery system must supply; `cotas` fixes where the régua may
  land.
- **[Carrinho](../../.wayfinder/tickets/010-cart.md)** / **[Checkout](../../.wayfinder/tickets/011-checkout.md)**
  — delivery groups derive from `embalagem` + `freteGratis`; the resumo's
  à-vista and parcelado totals derive from `politicas`.

## Omissões deliberadas

Considered and ruled out — recorded so they are not relitigated:

- **Nested `variantes[]`** — contradicts the one-URL-per-finish slug already fixed.
- **`avaliacao` / reviews** — no auth, no honest source.
- **Numeric stock** — invites fake scarcity.
- **Per-product parcelamento or montagem prices** — policy, not product.
- **Synthetic ids** — slug is the key.
