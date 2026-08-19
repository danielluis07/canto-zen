# Product page — PDP

Resolves ticket [Product detail page sections](../../.wayfinder/tickets/009-product-detail.md).

Route: `/produtos/[slug]`, flat, with no ambiente path ([`rotas.md`](rotas.md)).
One piece = one acabamento = one URL ([`produto.md`](produto.md)).

This file specifies the **page**. The data model it reads still lives in
[`produto.md`](produto.md) — which this ticket changes in four places (§10).

This file is written in English prose; every string quoted as copy is the pt-BR
that ships, and domain terms stay pt-BR throughout.

---

## 0. Order and rhythm

| # | Section | Content |
|---|---|---|
| 1 | Breadcrumb | annotation, reads `ambientePrincipal` |
| 2 | Purchase block | gallery 7 col · buy box 5 col |
| 3 | Description | annotation label + body |
| — | *break* | `ambientada` image, full bleed |
| 4 | Medidas | scale drawing · L × P × A · extras · packaging |
| 5 | Ficha técnica | materials, cor, acabamento, care, warranty, included items |
| — | *break* | `detalhe` image, full bleed |
| 6 | Delivery and access | prose |
| 7 | Closing | coleção, or one link line |

`7rem` of breathing room between sections, never less than `4rem`
([`marca.md`](marca.md) §5).

**The buy box is not sticky.** It ends where it ends, and the rest of the page is
image and spec sheet. A persistent panel would drag price and CTA across the
measurements and the description — exactly the shouted register `marca.md` §1
reconciles as *voice, not presence* — and this page's buy box carries name, price,
parcelamento, acabamentos, CEP and montagem, which is to say it exceeds the
viewport height and would stick badly anyway.

---

## 1. Breadcrumb

```
INÍCIO / SALA / POLTRONAS / POLTRONA LINA
```

Annotation voice, `/` separator, `--muted` on the ancestors and `--ink` on the
current item. The ambiente comes from `ambientePrincipal` — the promise
[`rotas.md`](rotas.md) made by leaving the product URL flat: the URL carries no
path, so the breadcrumb is what reconstructs it. The tipo segment uses
`Tipo.label` (plural), not `labelSingular`, because it points at the
`/sala/poltronas` listing — it is the route, not the piece.

**The current item is not a link.** No icon, no chevron — the system's arrows are
characters, and here the character is `/`.

---

## 2. Purchase block

The default pair from [`marca.md`](marca.md) §5: image on 7 columns, buy box on 5,
the large right gutter preserved empty.

### 2.1 The gallery is not a gallery

Only the `principal` image lives here, in **real proportion**, uncropped, with
whatever cota `imagens[0].cotas` declares.

The other images are **not** stacked beside the buy box and do not become
thumbnails with click-to-swap. Each `papel` is a **position instruction**:

| `papel` | Where it renders |
|---|---|
| `principal` | purchase block, the 7-column side |
| `ambientada` | full-bleed break between §3 and §4 |
| `detalhe` | full-bleed break between §5 and §6 |

This is what "roles are named, not positional" ([`produto.md`](produto.md)) bought:
the page is deterministic from the data, and a piece with no `ambientada` simply
does not have that break — **nothing is promoted into the empty slot**.

Thumbnails with click-to-swap were dropped: it is a stateful widget on a page where
[`marca.md`](marca.md) §9 grants only a colour transition.

### 2.2 Buy box anatomy

Order, top to bottom:

```
Poltrona Lina                          Mincho, Display XL
LINHO CRU · POR {designer}             annotation, --muted

R$ 3.501,00  10% À VISTA NO PIX        tabular Price + --indigo badge
ou R$ 3.890,00 em 10x de R$ 389,00     Body S, --muted
sem juros

OUTROS ACABAMENTOS                     annotation
[swatches]                             see §2.4

SOB ENCOMENDA · 4 SEMANAS              annotation, --muted

[ COMPRAR ]                            CTA, 1px --ink border

CALCULAR FRETE E PRAZO                 see §2.7
MONTAGEM                               see §2.8
```

The **only** Mincho line on the entire page is the name ([`marca.md`](marca.md) §4:
one feature line per page). No section below gets a display title.

The designer comes from `Familia.designer` (§10) — authorship belongs to the piece,
not to the acabamento.

### 2.3 Price

Everything derived from `politicas`, never hand-written
([`produto.md`](produto.md) § Commercial policies):

- **À vista no Pix** in the Price role (`1.75rem`, tabular). That role is reserved
  for the home hero and this page — [`catalogo.md`](catalogo.md) §6 already fixed
  it.
- **The discount badge** beside it, in `--indigo`, annotation voice:
  `10% À VISTA NO PIX`. This is the conspicuous disclosure Lei 13.455 requires for
  the differentiated price to be lawful
  ([research §4](../research/br-ecommerce-conventions.md)).
- **Parcelamento** right below in Body S `--muted`:
  `ou {total} em {N}x de {v} sem juros`.
- `precoDe`, when present, before the à-vista price in Body S `--muted` with a 1px
  strikethrough. No colour, no percentage badge — same as the card.

**Índigo budget:** the Pix badge spends one. The focus ring spends the second when
it appears. `marca.md` §3 permits two per screen — which is why **there is no
repeated policy line** on this page: the buy box already states Pix and
parcelamento in full, in the place where the decision happens.

### 2.4 Other acabamentos

It sits **inside the buy box**, right below the price, because each acabamento is
another product with another price: choosing between them is a purchase decision,
not a navigation one, and it has to be in the block whose figure it changes.

- Queried by `familia`; renders the siblings, including the current one.
- Each item is a 28px square swatch filled with `Cor.amostra`, 1px border in
  `--hairline`, **zero radius**, with the acabamento's label in annotation beside
  it.
- The current one is marked with a 1px `--ink` hairline underneath — the same
  active-item signal [`navbar.md`](navbar.md) uses, and for the same reason: índigo
  is already spent.
- Each swatch is a **link** to the sibling's `/produtos/{slug}`. No client state, no
  in-place image swap.
- An `esgotado` sibling stays listed, with an `ESGOTADO` label in `--muted` below —
  nothing disappears, exactly as in the grid.
- A família with a single acabamento: the block **does not render**.

This admits product colour into the interface. The precedent is
[`catalogo.md`](catalogo.md) §3: the swatch appears as *product data*, not as brand
colour.

### 2.5 Disponibilidade

The same three states and the same text as the card
([`catalogo.md`](catalogo.md) §6), in annotation `--muted`:

| Value | Text |
|---|---|
| `envio-imediato` | `ENVIO IMEDIATO` |
| `sob-encomenda` | `SOB ENCOMENDA · {prazoProducaoSemanas} SEMANAS` |
| `esgotado` | `ESGOTADO` |

No state colour, no stock count, no "restam apenas 2".

### 2.6 CTA and states

**Label: `COMPRAR`.** Uppercase, `0.18em` tracking, 1px border in `--ink`,
transparent background, inverting to an `--ink` background on hover in 120ms
([`marca.md`](marca.md) §6). It is the conventional label in Brazil and the
shortest — the page does not need to explain that buying puts it in the cart.

**No quantity selector.** The decision this page asks for is *this piece or not*;
quantity belongs to the cart, which has to edit it anyway. A stepper here would
spend attention in a buy box that already carries CEP and montagem.
*(Counter-argument recorded: dining chairs are bought in fours and sixes. If it
comes back, it comes back as a stepper to the left of the CTA, not as a field.)*

**On click:** the page **does not navigate**. The CTA is replaced in place by a
confirmation line in annotation and a link:

```
ADICIONADO AO CARRINHO        VER CARRINHO →
```

And the navbar counter goes to `CARRINHO (n)`. A side drawer is unavailable by
decision of [`navbar.md`](navbar.md) — the cart is a link, never a drawer trigger —
and navigating to `/carrinho` would end the browsing session on exactly the page
where *outros acabamentos* invites lateral movement. The navbar counter is already
the feedback channel; the line only confirms.

**`esgotado` state:** the CTA **does not render**. In its place, in annotation:

```
ESGOTADO
VER POLTRONA LINA EM BOUCLÉ CARVALHO →
```

The link only appears if the família has an available sibling. **There is no
"avise-me quando chegar"** — it captures an e-mail against a backend that does not
exist; the honest promise is the footer's `AVISO DE NOVAS PEÇAS`
([`rodape.md`](rodape.md)).

The CEP block and the montagem block **still render** in `esgotado`: they are
information about the piece, not about the order.

### 2.7 CEP, frete and prazo

Brazilian convention, and the biggest divergence from American PDPs: frete is
calculated **here**, not at checkout
([research §1](../research/br-ecommerce-conventions.md)).

**Position: below the CTA.** The options table expands over several lines and would
push `COMPRAR` off screen if it sat above. The convention that matters is that the
answer exists on the PDP; the block's internal order is ours.

Initial state — a single field, `00000-000` mask, `inputmode="numeric"`, 1px border
in `--hairline`, zero radius:

```
CALCULAR FRETE E PRAZO
[ 00000-000 ]  [ CALCULAR ]     NÃO SEI MEU CEP
```

`NÃO SEI MEU CEP` opens the Correios lookup in a new tab.

Result — a table of **options**, never a single figure:

```
ENTREGA PADRÃO      até 12 dias úteis        R$ 289,00
ENTREGA AGENDADA    data à sua escolha       R$ 389,00
```

- 1px hairline between rows, tabular figures, values right-aligned.
- **`Grátis`**, the word, when `freteGratis` covers the region — never `R$ 0,00`.
- One note line below, in annotation `--muted`:
  `PRAZO EM DIAS ÚTEIS, CONTADO APÓS A CONFIRMAÇÃO DO PAGAMENTO.`
- In `sob-encomenda`, a second line adds what the piece actually takes:
  `PRODUÇÃO DE {n} SEMANAS ANTES DO ENVIO.`

**Error** — invalid CEP or an unserved region: one line below the field, in
`--ink`, with no colour and no icon. `marca.md` §3 already decided that errors
resolve in ink and typographic weight, not in traffic lights.

> **Corrected by [`erros.md`](erros.md) §5.3.** This section originally set the
> message in the **annotation voice**; [`checkout.md`](checkout.md) §5 set the same
> treatment in **Corpo S**, and the generalised rule resolves the conflict in
> checkout's favour — the annotation voice is the *label* voice, so a message set in
> it reads as another field label rather than as a response. `erros.md` §5.2 also
> splits this single "Error" into two classes: the invalid CEP is *corrigível* and
> states the fix, the unserved region is *fato* and states the limit plus the way on.

**The CEP is remembered.** Typed once, it holds for the whole session: the cart and
the checkout read the same value pre-filled. Asking for the same CEP three times is
the defect this convention exists to avoid. A constraint handed to
[Cart](../../.wayfinder/tickets/010-cart.md) and
[Checkout](../../.wayfinder/tickets/011-checkout.md) — §11.

### 2.8 Montagem

Renders **only when `montagem.necessaria === true`**.

```
MONTAGEM
[ ] Contratar montagem                              + R$ 99,00
SIMPLES · 1 PESSOA · 5 PEÇAS · 20 MIN
NO MESMO DIA DA ENTREGA AGENDADA.
```

- Price derived from `politicas.montagemCentavos[montagem.nivel]`.
- The four facts stay **here and only here** — they are not repeated in the ficha
  técnica. They exist to justify the price, which is why
  [`produto.md`](produto.md) derived the price from `nivel`: the complexity stays
  provably consistent with the figure right above it.
- 1px checkbox, zero radius, no fill colour — checked is a solid `--ink` square.
- The promise modelled is Tok&Stok's: montagem **on the day of the scheduled
  delivery**, not on a separate appointment
  ([research §7.2](../research/br-ecommerce-conventions.md)).

**Consequence:** when checked, montagem travels as an **attribute of the cart
line** — a flag plus the derived price, inside the piece's line, never a sibling
line ([`carrinho.md`](carrinho.md) §4.3; corrected there, this paragraph used to say
"a line item with its own price" and contradicted §11 of this same file) — and the
7-day withdrawal window starts counting **from the montagem date**
([`rodape.md`](rodape.md), research §6.2).

---

## 3. Description

`DESCRIÇÃO` label in annotation; body in Body, 60–70 character measure, 5 to 7
columns, **never centred**.

**No Mincho opening.** `marca.md` §4 grants one feature line per page and the
piece's name already spent it in the buy box. A second display here would give the
page two heroes.

`descricao` remains **a single string**. No new field: no summary, no subtitle, no
lead. [`produto.md`](produto.md) already recorded that there is no short-description
field, and the meta description is the
[metadata ticket](../../.wayfinder/tickets/015-route-metadata.md)'s problem.

---

## 4. Medidas

**The section that decides the purchase.** Furniture is bought by the measurement
that has to fit the wall; everything here is a figure.

### 4.1 The scale drawing

A **dimensioned technical elevation** of the piece: 1px hairline in `--ink`,
perpendicular ticks, labels in the annotation voice, `--plaster` background. It is
the régua in full expression — the same visual language as the brand gesture,
applied where the information is the entire subject.

It was chosen against four alternatives:

- **The cota on the photo alone** answers neither depth nor seat height.
- **Comparison with a known object** requires a person or a door in the frame, and
  `marca.md` §7 fixes the piece alone, no person, with no exception outside
  Inspirações.
- **Shared scale comparison between pieces** was already dropped by
  [`catalogo.md`](catalogo.md) §4 — it forces the imagery system into a common
  reference across products.
- **A "does it fit my space" widget** is a control that computes what the reader
  already has on screen.

The drawing lives in `Familia.desenho`, not on the product (§10).

### 4.2 The table

```
L 78 × P 82 × A 74 cm
```

Always in this order, always with a multiplication `×` — never the letter `x`
([`marca.md`](marca.md) §8). Annotation voice, tabular figures.

Below it, `medidasExtras` as hairline rows:

```
ALTURA DO ASSENTO        42 cm
CAPACIDADE DE PESO      120 kg
```

### 4.3 Packaging

A block recessed in `--kozo`, because it is another set of figures with another
function — it is what has to get through the door and the lift:

```
EMBALAGEM
1 volume · L 86 × P 90 × A 80 cm · 24 kg
```

---

## 5. Ficha técnica

Everything qualitative. The split between §4 and §5 is by **species of fact**, not
by label: a figure goes to Medidas, an attribute goes to the Ficha.

| Row | Source |
|---|---|
| Materiais | `materiais[]` → `Material.label` |
| Cor | `cor` → `Cor.label` |
| Acabamento | `acabamento` |
| Cuidados | **derived** from `materiais[]` → `Material.cuidados` (§10) |
| Garantia | `garantiaMeses ?? politicas.garantiaPadraoMeses` |
| Itens inclusos | `itensInclusos[]` |

Rows in 1px `--hairline`, label in annotation `--muted` on the left, value in Body
on the right.

**Cuidados is derived, never authored per product.** Care is a property of the
linen and the oak, not of this armchair; authoring it per piece is exactly the drift
[`produto.md`](produto.md)'s derivation rule exists to prevent. A piece with two
materials yields two care lines automatically, and no new product can be born
without care copy.

`itensInclusos` leaves the Description and comes here — it is spec sheet, not prose.

---

## 6. Delivery and access

**Prose, not a table.** The access warning is a caution, and a table row would bury
it; the research (§7.3) treats this as the furniture-specific disclosure a generic
design has no place for.

Four short paragraphs, text derived from policy and from the piece's data — nothing
authored per product:

1. **Prazo and scheduling.** The prazo depends on the CEP and is counted in business
   days after payment confirmation; delivery of bulky pieces is scheduled by date
   and window.
2. **Access.** Check the packaging measurements (§4.3) against doors, hallway and
   lift. If it does not fit the lift, delivery goes up by stairs to the 3rd floor;
   above that it is not carried out.
3. **Montagem.** When contracted, it happens on the same day as the scheduled
   delivery.
4. **Withdrawal.** Seven calendar days from receipt — or from the **montagem date**,
   when contracted. Standalone prose, the same treatment [`rodape.md`](rodape.md) §6
   gave the footer notice.

`--plaster` background, normal body, no box, no alert icon.

---

## 7. Closing

**If `colecoes` is not empty** — a strip of the coleção's other pieces, in the order
authored by `Colecao.produtos`, using the card from [`catalogo.md`](catalogo.md) §6,
with the collection's title in annotation.

**Otherwise** — a single line, in annotation, left-aligned:

```
VER TODAS AS POLTRONAS EM SALA →
```

Pointing at `/{ambientePrincipal}/{tipo}`.

**There is no "quem viu também viu", no "complete o ambiente".** A concept store has
no honest basis for recommending — the same reason [`catalogo.md`](catalogo.md) §8
gave when refusing fabricated suggestions on zero results. A `complementos[]` field
authored per product was dropped: it invents a curatorial relationship for every
piece in the catalogue. A **link back to a real listing** is not a suggestion, it is
navigation.

---

## 8. Régua budget

**Exactly two instances on the entire page**, and they are these:

1. The cota over the `principal` image, reading `imagens[0].cotas` — up to width
   **and** height, which `marca.md` §2 counts as *one* instance ("two cotas per
   piece is the ceiling").
2. The scale drawing (§4.1), alone in its viewport.

`ambientada` and `detalhe` render with `cotas: []` **always**, on this page. No
section opening gets a régua: there is no figure to state that is not already better
said in §4.

This is the page where the gesture reaches full expression without blowing the
ration — the same two-per-page discipline [`home.md`](home.md) imposed, spent in a
different place.

---

## 9. Mobile

A single column, in this order:

```
principal → name/designer → price/parcelamento → acabamentos →
disponibilidade → COMPRAR → CEP → montagem → description →
ambientada → medidas → ficha técnica → delivery → closing
```

**No fixed bottom bar** with price and CTA, despite it being near-universal on
Brazilian PDPs on mobile. It is the same persistent chrome refused in §0, and on
mobile it would cover exactly the scale drawing and the measurements table — the two
things this page exists for. With the CEP block in flow, the drawing is never
occluded.

The scale drawing takes the container's width and keeps the annotation legible; it
does **not** get a horizontal scroller.

The acabamento swatches wrap onto two lines before becoming a scrollable rail.

---

## 10. Data

Four changes to [`produto.md`](produto.md). Three additive, one declared reversal.

```ts
type Familia = {
  slug: string;
  nome: string;
  designer: string;                      // NEW — authorship belongs to the piece
  desenho: { src: string; alt: string }; // NEW — dimensioned technical elevation
};

type Material = {
  slug: string;
  label: string;
  cuidados: string;                      // NEW — one line per material
};

type Imagem = {
  src: string;
  alt: string;
  papel: 'principal' | 'ambientada' | 'detalhe';  // 'escala' REMOVED
  cotas: ('largura' | 'altura')[];
};
```

**Why on `Familia` and not on `Produto`:** neither authorship nor geometry changes
with the fabric. The Poltrona Lina's technical elevation is the same drawing in
linho cru and in bouclé carvalho, and the designer is the same. This also gives
`Familia` — deliberately thin — two reasons to exist beyond naming a strip, and
halves the drawings the [imagery system](../../.wayfinder/tickets/014-imagery.md)
owes.

**The invariant this creates:** products in the same família **share `medidas`**. One
drawing for two acabamentos of different measurements would lie about one of them.
This is true of real furniture — an acabamento does not change geometry — and it is
recorded as a model constraint, not as a coincidence in the data.

**`'escala'` leaves the enum** because no surface consumes it any more: the listing
already read only `principal` ([`catalogo.md`](catalogo.md) §13) and the PDP now
reads the família's drawing. It is this ticket's only reversal; the role was defined
before a page existed that would spend it.

`Produto` gains no field at all.

---

## 11. Constraints handed to other tickets

- **[Cart](../../.wayfinder/tickets/010-cart.md)** — the line item carries a montagem
  flag and its derived price (§2.8); quantity belongs to **the cart**, because the
  PDP has no stepper (§2.6); the CEP typed here arrives pre-filled (§2.7); and the
  withdrawal window counts from the montagem when it was contracted.
- **[Checkout](../../.wayfinder/tickets/011-checkout.md)** — the same remembered
  CEP, pre-filled in the first address field.
- **[Imagery system](../../.wayfinder/tickets/014-imagery.md)** — three photographic
  roles, not four (§10), each with a fixed position on the page (§2.1); plus one new
  artefact that is **not photography**: the per-família dimensioned technical
  elevation (§4.1), which needs a specification of its own — stroke, minimum cotas,
  views, proportion.
- **[Metadata and SEO](../../.wayfinder/tickets/015-route-metadata.md)** — the `<h1>`
  is the piece's name in the buy box. There is still no short-description field; the
  meta description is truncated from `descricao` or authored there.
- **[Error surfaces](../../.wayfinder/tickets/016-error-surfaces.md)** — a
  non-existent slug is a 404 and belongs to that ticket. The invalid-CEP error is
  resolved here (§2.7) and follows the colourless pattern.
- **[Motion](../../.wayfinder/tickets/017-motion.md)** — the PDP has no carousel, no
  image swap, no zoom, no fixed panel and no scroll reveal. Replacing the CTA with
  the confirmation line (§2.6) is a content swap, not an animation; if it gains a
  transition, that belongs to that ticket.
- **Seed data** (map fog) — the PDP hardens the demand: every família needs a
  `designer` and a technical drawing; every material needs a care line; and at least
  one família needs two acabamentos, or §2.4's strip never renders.

---

## 12. Deliberate omissions

Considered and refused — recorded so they do not return without a new reason:

- **Ratings and stars** — already out of the model per [`produto.md`](produto.md):
  with no accounts nobody writes them, and any figure is invented social proof.
- **Sticky buy box / fixed mobile bar** (§0, §9).
- **Quantity selector** (§2.6).
- **Cart drawer** — unavailable per [`navbar.md`](navbar.md).
- **Click-to-swap thumbnails, zoom, lightbox** (§2.1).
- **"Avise-me quando chegar"** (§2.6).
- **"Quem viu também viu" and `complementos[]`** (§7).
- **A "does it fit my space" widget** (§4.1).
- **Scale comparison between pieces** — already dropped in
  [`catalogo.md`](catalogo.md) §4.
- **A repeated Pix/parcelamento policy line** — the buy box already states it in
  full (§2.3).
- **An arrependimento line in the buy box.** [`CONTEXT.md`](../../CONTEXT.md)'s
  glossary used to promise one here and this spec never wrote it; the
  [legal-copy verification](../research/legal-copy-verification.md) resolved the
  contradiction **against** the line and corrected the glossary. CDC art. 49 sets
  no placement duty of its own, and Decreto 7.962 art. 5º asks for the means to be
  clear and ostensive — which the sitewide footer, the cart at the moment of
  commitment and the confirmation already satisfy. A fourth repetition on every
  product page is the ornament this page keeps refusing. The **montagem
  consequence** stated in [`produto.md`](produto.md) — the window counting from the
  assembly date — is unaffected: it is a fact about the window, not a notice.

---

## How this was decided

Three rounds of grilling on ticket 009. The first fixed the structure: two columns
with no sticky, the technical drawing as the scale mechanism, the buy box inventory,
and the three model decisions the page demanded (designer on the família,
acabamentos inside the buy box, a closing without recommendation). The second
resolved the internals: image roles as position, the régua budget, care derived from
the material, CTA states, CEP behaviour and montagem with a single address. The
third settled mobile, moved the drawing to the família — deleting `'escala'` from the
enum — corrected one Mincho too many that the spine draft had invented, and separated
Medidas from Ficha técnica by species of fact.
