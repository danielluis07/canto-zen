# Catálogo — ambiente landing and product listing

Resolves ticket [Room landing & product listing sections](../../.wayfinder/tickets/008-catalog.md).

Four routes use this file ([`rotas.md`](rotas.md)):

| Route | Surface |
|---|---|
| `/[ambiente]` | Ambiente landing |
| `/[ambiente]/[tipo]` | Tipo listing |
| `/produtos` | General listing |
| `/colecoes/[slug]` | Coleção listing |

They are **one single template**. What changes between them is the header and
which controls render — never the grid, never the card.

This page has one job: **let the buyer compare pieces without the page competing
with them.** Everything here justifies itself against that.

This file is written in English prose; every string quoted as copy is the pt-BR
that ships, and domain terms stay pt-BR throughout.

---

## 0. Order and rhythm

| # | Block | Renders on |
|---|---|---|
| 1 | Header | all four |
| 2 | Tipo band | `/[ambiente]`, `/[ambiente]/[tipo]` |
| 3 | Filter and sort bar | `/[ambiente]`, `/[ambiente]/[tipo]`, `/produtos` |
| 4 | Opening régua — `{n} PEÇAS` | all, except zero results |
| 5 | Grid | all |
| 6 | Policy line | all |
| 7 | Pagination | all |

Container `1360px`, gutter `clamp(1.5rem, 4vw, 4.5rem)`, 12-column grid —
[`marca.md`](marca.md) §5. The breathing room between blocks here is **smaller**
than the home's `7rem`: `2.75rem` between header and tipo band, `1.5rem` between
band, bar and régua, `2.75rem` from the régua to the grid's first row. The home
establishes editorial rhythm; this page establishes reading rhythm, and `7rem`
between a filter and the grid it governs separates cause from effect.

`7rem` returns between the grid's last row and the pagination, and from the
pagination down to the footer.

---

## 1. Header

Always **textual**. None of the four routes opens with photography.

The ambiente photograph exists (`Ambiente.imagem`) and is already spent on the
home ([`home.md`](home.md) §2), where it does routing work. Repeating it at the top
of the page the visitor *just routed to* re-sells a decision already made and
pushes the first piece a full screen down. This page's job is the piece.

### Per route

| Route | Eyebrow | Title | Prose |
|---|---|---|---|
| `/[ambiente]` | `AMBIENTE` | `ambiente.label` — Display L (Mincho) | `ambiente.descricao`, one sentence, Body, `34ch` |
| `/[ambiente]/[tipo]` | `{AMBIENTE.LABEL}` | `tipo.label` — Display L (Mincho) | none |
| `/produtos` | none | `TODAS AS PEÇAS` — **annotation, not Mincho** | none |
| `/colecoes/[slug]` | `COLEÇÃO` | `colecao.nome` — Display L (Mincho) | `colecao.descricao`, Body, `34ch` |

`/produtos` gets no Mincho because Mincho is for piece names, collection titles and
editorial titles ([`marca.md`](marca.md) §4). "Todas as peças" is none of the three
— it is a system label, and the annotation voice is exactly that.

The tipo listing inherits the ambiente's eyebrow instead of prose of its own: four
ambientes × ~5 tipos is ~20 authored texts nobody reads, and the eyebrow-plus-title
pair already says `SALA / Sofás` at no authoring cost.

**No breadcrumb on these routes.** The path is in the header and the tipo band, and
the navbar marks the active ambiente ([`navbar.md`](navbar.md) §9). The breadcrumb
belongs to the PDP, where the URL is flat and carries no path
([`rotas.md`](rotas.md)).

---

## 2. Tipo band

Only on `/[ambiente]` and `/[ambiente]/[tipo]`.

A horizontal list, annotation voice, left-aligned: **`TODAS`** first, then that
ambiente's curated tipos from `ambiente.tipos` **in the exact order of the
[`rotas.md`](rotas.md) table** — the same order as the navbar panel.

- Active item: label in full `--ink` with a **1px `--ink` hairline underneath**.
  The others in `--muted`. This is the active-state vocabulary
  [`navbar.md`](navbar.md) §9 already fixed; a second device for the same idea
  would be a dialect.
- On `/[ambiente]`, the active one is `TODAS`.
- Separated by space (`1.5rem`), **not** by `·` and not by a vertical hairline.
- A 1px `--hairline` closing the band underneath.

**It wraps onto two lines** when it does not fit. Never horizontal scroll: a
scrollable band hides navigation off-screen, and hidden navigation is the reason
the navbar panel exists.

This does not duplicate the navbar panel. The panel is revealed on intent and
disappears; the band is the page's permanent state, and it is what makes a tipo
visibly a **landable path**, not a filter — the distinction `rotas.md` §5 fixed.

---

## 3. Filter and sort bar

Does not render on `/colecoes/[slug]` — see §9.

**Form: a horizontal bar of hairlines.** A strip of triggers in the annotation
voice, left-aligned, separated by 1px vertical hairlines in `--hairline`, closed by
a horizontal hairline underneath. `ORDENAR` sits at the **far right** of the same
bar, pushed there by the empty space — the only element on the page aligned right,
because sort is not a filter and the distance says so without a group label.

**It is not a side rail.** A rail of checkboxes spends 3 of the 12 columns
permanently on four facets and reads as the commerce density
[`marca.md`](marca.md) §5 rations. **It is not a single hidden trigger** either:
filtering is the only navigation aid this page has after the tipo band, and hiding
it behind `FILTRAR` on desktop is hiding the page.

**It is not sticky on scroll.** [`navbar.md`](navbar.md) §8 already fixes a bar at
72px; a second one stacks two permanent bands over a low-density page. With 12
pieces per page, the top is never far.

### Facets

| Trigger | Route | Multiple | Key | Semantics |
|---|---|---|---|---|
| `TIPO` | `/produtos` only | no | — (a path segment on ambiente routes) | equality |
| `AMBIENTE` | `/produtos` only | no | `ambiente` | `produto.ambientes` contains |
| `COR` | all | **yes** | `cor` | any-match |
| `MATERIAL` | all | **yes** | `material` | any-match |
| `PREÇO` | all | no | `preco` | range |

Cor and material are multi-select with **any-match** semantics: a piece with
`cor: cru` matches `?cor=cru&cor=carvalho`. A product has one cor and several
materials ([`produto.md`](produto.md)); the multiplicity is in the filter, not in
the record.

On ambiente routes, `TIPO` does **not** become a trigger — it is §2's band, and the
same choice offered twice in two different vocabularies is a modelling error, not a
convenience.

### Price ranges

Four, **store constants** — never derived from the current result set, so that the
same URL means the same thing on every route.

| Label | `?preco=` |
|---|---|
| Até R$ 2.000 | `0-2000` |
| R$ 2.000 a R$ 5.000 | `2000-5000` |
| R$ 5.000 a R$ 10.000 | `5000-10000` |
| Acima de R$ 10.000 | `10000-` |

Single select — overlapping ranges are a filter nobody reasons about. Values in
whole reais, as [`rotas.md`](rotas.md) fixed; the open end omits the second term.

**No slider.** Dragging is a motion interaction, and a concept store has no real
price distribution that would justify continuous granularity.

### Panels

On click, the trigger opens a panel anchored below it.

| Property | Value |
|---|---|
| Background | `--plaster` |
| Border | 1px hairline in `--hairline` |
| Radius, shadow | 0, none |
| Width | content, minimum `220px` |
| Padding | `1.25rem` |

- Items in Body S, `--ink`, `0.375rem` vertical padding. Hover goes to `--indigo` —
  the same treatment as the navbar panel ([`navbar.md`](navbar.md) §6).
- **Cor shows the swatch**: a 12px square filled with `cor.amostra`, 1px hairline in
  `--hairline`, before the label. It is the only place in the storefront where a
  colour outside the palette appears in interface, and it appears as **product
  data**, not as decoration — it is the fabric swatch, not an accent.
- Multi-select marks with a **1px `--ink` hairline under the label**, not with a
  checkbox: a checkbox is a form control and this is a set of links.
- One panel at a time. Opening another closes the previous one.

### Application

**Immediate.** Each selection is a real navigation to a server-rendered URL — no
`APLICAR` button, no intermediate state, no client-side filtering model to specify.
The panel **stays open** after a selection, so a second value of the same facet can
be marked without reopening.

`pagina` is **discarded** on any filter or sort change: page 3 of a different result
set is not a place.

### Applied state

The state lives **in the trigger itself**, not in chips below the bar:

```
COR · CRU, CARVALHO
```

Label and values in `--ink` (against `--muted` when empty), values uppercase in the
same annotation voice, separated by commas. Three or more values collapse to
`COR · 3 SELECIONADAS`.

A row of removable chips under a bar of triggers **states the same fact twice**, and
a chip-with-`×` is a rounded shape in a zero-radius system.

`LIMPAR` appears at the end of the bar, in annotation `--muted`, **only when some
facet is applied**, and points at the route's URL with no query.

### Sort

Three tokens. Nothing else gets in.

| Label | `?ordem=` | Meaning |
|---|---|---|
| Curadoria | *omitted* | `produto.ordem` ascending — **default** |
| Menor preço | `menor-preco` | `precoTabela` ascending |
| Maior preço | `maior-preco` | `precoTabela` descending |

The default is omitted from the URL so that the canonical route carries no query.

**Deliberately out:** `relevancia` (there is no search — out of scope across the
whole map), `novidades` and `mais-vendidos` (fabricated signal;
[`rotas.md`](rotas.md) already refused `/novidades` and `/promocoes`, and
[`produto.md`](produto.md) refused numeric stock for the same reason).

Curadoria as the default means the listing **is composed**, not alphabetical and not
accidental — the same position the coleção takes and the home takes in all seven
sections.

**`esgotado` pieces always go last**, within whatever sort is active. See §5.

---

## 4. Opening régua

**This page's régua is the result count.**

A section-opening régua ([`marca.md`](marca.md) §2, the "real figure to state"
case), label `{n} PEÇAS`, `n` = total results after filtering — not the number of
cards on the current page. It runs along the grid's top edge, left-aligned, at
container width.

It is the page's only régua. That makes the count **be** the brand gesture rather
than one more line of chrome, and satisfies in one move the "visible result" any
listing owes.

`1 PEÇA` in the singular.

**Does not render when `n = 0`** — see §8. Does not render on any card.

### Why there is no régua on the cards

[`marca.md`](marca.md) §2 permits the régua "in scale comparison within the
catalogue", and even so it does not go in here: the ceiling is **two per screen**,
and a grid of 12 cards has no way to grant one to each piece without turning the
signature into texture. The width in cm is still present on every card, in the
annotation voice (§6) — the promise [`produto.md`](produto.md) made by keeping cm
out of `nome` is still kept, only without the hairline.

**Real scale comparison** — every photo in a listing rendered at a shared scale, so
that a 240cm sofa appears visibly wider than a 180cm one — was considered and
**dropped in this round**: it forces the imagery system
([ticket 014](../../.wayfinder/tickets/014-imagery.md)) to photograph everything
against a common reference, and it makes small pieces render tiny, punishing exactly
the products that most need help. If it comes back, it comes back as a prototype
ticket, not as a line in this spec.

---

## 5. Grid

**Three columns, filling all 12.** Each card occupies 4 columns.

Four columns shrink the piece until the photograph stops being the argument. The
home's empty right gutter ([`home.md`](home.md) §3) is right for a *composition* of
three chosen pieces; a listing is a rail — the same reason `home.md` §5 let the
service band be the only section to reach column 12.

- Space between rows: `4rem`. Between columns: the default gutter.
- **No fixed card height and no baseline alignment between cards.** The image keeps
  the piece's real proportion ([`marca.md`](marca.md) §7), so the text block starts
  where the image ends. A grid of equal heights requires cropping the photo or
  framing it, and both break the photography rule.
- No hairline between cells. No visible card — there is no box, border, background
  or shadow. The card is the piece plus the text under it.
- 12 per page (§7).

---

## 6. Card

The anatomy inherits the home's featured strip ([`home.md`](home.md) §3), with two
differences stated below.

| Element | Typographic role | Source |
|---|---|---|
| `principal` image | real proportion, no régua | `produto.imagens[0]` |
| Name | Display M (Mincho) | `produto.nome` |
| Acabamento | Annotation, `--muted` | `produto.acabamento` |
| **Width** | Annotation, `--muted` | `L {medidas.largura} CM` |
| Disponibilidade | Annotation, `--muted` | see table below |
| À-vista price | **Body**, tabular | derived from `precoTabela` |

Acabamento, width and disponibilidade occupy **a single line**, separated by `·`, in
the order above.

### The two differences from the home card

1. **Width goes in.** Furniture is bought by the measurement that has to fit the
   wall (research §7.4), and [`produto.md`](produto.md) kept cm out of `nome` with
   the explicit promise that the cota would carry it. On a card that cannot have a
   régua (§4), the annotation line is that promise kept. Read from
   `medidas.largura`, never hand-written.
2. **The parcelamento line goes out.** Twelve cards × two price lines is 24 numeric
   lines per screen, and the page becomes a price table. Parcelamento survives
   **once per listing**, in the policy line (§7) — exactly the treatment `home.md`
   §3 gave the Pix badge for the same reason.

The **Price typographic role (`1.75rem`) remains reserved for the hero and the
PDP**, as `home.md` §3 fixed. The card uses Body with tabular figures.

`precoDe`, when present, renders **before** the à-vista price, in Body S `--muted`
with a 1px strikethrough — no colour, no percentage badge.

### Disponibilidade

| `disponibilidade` | Card text |
|---|---|
| `envio-imediato` | `ENVIO IMEDIATO` |
| `sob-encomenda` | `SOB ENCOMENDA · {prazoProducaoSemanas} SEMANAS` |
| `esgotado` | `ESGOTADO` |

Always in `--muted`, always in the same place. **No state colour**: green and red do
not exist in the palette ([`marca.md`](marca.md) §3), and the distinction that
matters is in the text.

**Sold-out pieces appear, they never disappear**, and they sort last within the
active order. Hiding them would make the count lie and would pretend a made-to-order
atelier never sells out. **No reduced opacity, no grey veil** — dimming is an
effect, and the piece is still worth looking at. All that changes is the text; it is
the PDP that removes the purchase CTA ([`produto.md`](produto.md)).

### Interaction

- **The whole card is a link** to `/produtos/[slug]`. No control inside it — no add
  button, no favouriting (there are no accounts in the map's scope).
- Hover: the **name goes to `--indigo`** on the 120ms colour transition, like the
  navbar panel's links ([`navbar.md`](navbar.md) §6). Nothing else changes.
- **No hover image swap** to the `ambientada` shot, no zoom, no elevation. An image
  that changes under the cursor is motion, and [`marca.md`](marca.md) §9 grants
  colour only.
- Focus: the `--indigo` ring from `marca.md` §6, on the whole card.

---

## 7. Policy line and pagination

**Policy line** — a single line in annotation `--indigo`, aligned to the right of
the hairline that closes the grid:

```
10% À VISTA NO PIX · ATÉ 10X SEM JUROS
```

Both figures come from `politicas` ([`produto.md`](produto.md)), never hand-written.
It is the same solution as `home.md` §3 — the policy stated **once** per screen
instead of repeated per card, which would spend índigo twelve times where
[`marca.md`](marca.md) §3 permits two.

**Pagination** — 12 per page. Numbered, server-rendered.

```
← 1 2 3 →
```

Annotation voice, centred, `7rem` below the grid. Current page in `--ink` with a 1px
hairline underneath; the others in `--muted`. The arrows are the characters `←` and
`→`, **not icons** ([`navbar.md`](navbar.md) fixed zero icons; the footer is the
only registered exception). Disabled ends do not render.

`?pagina=` is omitted on page 1 ([`rotas.md`](rotas.md)).

### Why it is not infinite scroll

Twelve divides by 3 and by 2, filling desktop and mobile exactly. And infinite
scroll: it is a motion and state surface about which [`marca.md`](marca.md) §9 says
nothing; it makes the footer unreachable, and the footer carries the identification
required by law ([`rodape.md`](rodape.md) §6); and it breaks the linkable, indexable
URL premise the entire route table was built on. `VER MAIS` has the last two
problems to a lesser degree and no advantage.

---

## 8. Zero results

This only happens through a combination of filters — a non-existent ambiente × tipo
pair is a **404**, not an empty grid ([`rotas.md`](rotas.md) §6), and that surface
belongs to [ticket 016](../../.wayfinder/tickets/016-error-surfaces.md).

- **The régua does not render.** `0 PEÇAS` annotates a grid that does not exist, and
  an empty régua is prohibited by [`marca.md`](marca.md) §2. The prohibition bites
  here exactly as designed.
- The header, tipo band and filter bar **stay** — they are the way out.
- In the grid's place, one line in Body and a `LIMPAR FILTROS` in CTA:

  > Nenhuma peça com esses filtros.

- **No suggestions, no "talvez você goste", no related pieces.** A concept store has
  no honest basis for recommending; `produto.md` and `home.md` already refused
  fabricated signal twice.

---

## 9. Coleção

`/colecoes/[slug]` uses the same header, régua, grid, card, policy line and
pagination. **It renders neither the tipo band nor the filter and sort bar.**

[`produto.md`](produto.md) fixed that `Colecao.produtos` is an ordered list whose
**sequence is the editorial act**. A sort control offers to destroy the only thing
the page exists for, and filtering a curated selection of a few pieces leaves it
incoherent with the description sitting above it.

The régua reads `{colecao.produtos.length} PEÇAS`, identical to the home's coleção
opening ([`home.md`](home.md) §4) — same figure, same label, same derivation.

No pagination in practice: a coleção over 12 pieces paginates like any other, but
curation should not get there.

---

## 10. `/produtos`

Same template. Annotation header (§1), **no tipo band**, and the filter bar gains
two facets the ambiente routes do not have: `TIPO` and `AMBIENTE` (§3).

`AMBIENTE` matches against `produto.ambientes`, the complete set — not against
`ambientePrincipal`. A bench belonging to Quarto and Sala appears in both filters;
`ambientePrincipal` decides only the PDP breadcrumb ([`rotas.md`](rotas.md)).

`/produtos` has no permanent navbar slot ([`navbar.md`](navbar.md) §5) and no
closing link on the home ([`home.md`](home.md) §7). It exists as a filter and
direct-link destination, not as an offered path — and the system header instead of
Mincho states exactly that.

---

## 11. Data

Two additions, both **additive** — in the same spirit as the `Ambiente.imagem`
addition made by [`home.md`](home.md) §8.

```ts
type Ambiente = {
  slug: string;
  label: string;
  tipos: string[];
  imagem: { src: string; alt: string };
  descricao: string;   // NEW — one sentence, /[ambiente] header (§1)
};

type Produto = {
  // …
  ordem: number;       // NEW — authored sequence, `curadoria` sort (§3)
};
```

`Ambiente.descricao` is **one sentence**, not category copy: it occupies `34ch`
under the ambiente name and nothing more.

`Produto.ordem` is global, not per ambiente and not per tipo — a piece has one
curatorial position, and it holds across any slice. A number per ambiente would
multiply the field by four to express the same intent.

No other entity changes. Filters read `cor`, `materiais`, `precoTabela`, `tipo`,
`ambientes`; the card reads `imagens[0]`, `nome`, `acabamento`, `medidas.largura`,
`disponibilidade`, `prazoProducaoSemanas`, `precoTabela`, `precoDe` — all already
existing.

---

## 12. Mobile

One page column, **grid in two columns**.

One column would turn 12 pieces into a dozen screens of scroll and make comparison
impossible, which is the only thing a listing is for. At two columns the name may
wrap to two lines; it wraps.

- **Header** — the same, prose at full width.
- **Tipo band** — wraps onto as many lines as it needs. No horizontal scroll.
- **Filters** — two triggers side by side, `FILTRAR` and `ORDENAR`, each opening a
  full-height sheet in `--plaster` with the facets stacked and a closing action at
  the foot: `VER {n} PEÇAS`, with `n` updated on each selection. Here the trade-off
  §3 refused inverts: there is no spare column, and the alternative is a bar that
  wraps onto four lines above every grid. The sheet appears and disappears without
  animation — [`marca.md`](marca.md) §9 grants colour only.
- **Régua** — stays; it is one line.
- **Policy line** — below the grid, left-aligned.
- **Pagination** — the same.

Breathing room between blocks drops to the floors in `marca.md` §5, never below.

---

## 13. Constraints handed to other tickets

- **[Product data shape](../../.wayfinder/tickets/003-product-data-shape.md)** —
  `Ambiente` gains `descricao`, `Produto` gains `ordem` (§11). Additive, not a
  reversal; `produto.md` carries a note pointing here.
- **[Product detail](../../.wayfinder/tickets/009-product-detail.md)** — the PDP
  receives every card's click and is what removes the purchase CTA on `esgotado`.
  The card has **no** add-to-cart: the decision to buy furniture goes through
  measurement, CEP-quoted frete and montagem, all of which live on the PDP.
- **[Imagery system](../../.wayfinder/tickets/014-imagery.md)** — the listing
  consumes **only** the `principal` image, in real proportion, with no crop to a
  fixed height (§5). No listing asks for `ambientada`, `detalhe` or `escala`. Shared
  scale comparison was dropped (§4) — the imagery system does **not** need a common
  reference between pieces.
- **[Error surfaces](../../.wayfinder/tickets/016-error-surfaces.md)** — zero results
  from filtering is resolved here (§8). The 404 for a non-existent ambiente × tipo
  pair still belongs to that ticket, and is a different surface.
- **[Route metadata](../../.wayfinder/tickets/015-route-metadata.md)** — the four
  header forms (§1) are the four `<h1>`s. Pages with `?pagina=` or an applied filter
  need a canonical and indexing decision; this spec does not take it.
- **[Motion](../../.wayfinder/tickets/017-motion.md)** — the listing has no scroll
  reveal, no hover image swap, no filter-panel animation and no transition between
  grid pages. Only the 120ms colour transition.
- **Catalogue seed data** (map fog) — 12 per page fixes the demand: each curated tipo
  needs enough pieces that the grid does not end up with two, and the set must
  exercise the three `disponibilidade` states, the four price ranges and at least
  one piece in more than one ambiente.

---

## Deliberate omissions

Considered and dropped — recorded so they are not relitigated:

- **Photography in the ambiente header.** §1.
- **A filter side rail**, and a **hidden `FILTRAR` trigger on desktop.** §3.
- **A price slider.** §3.
- **Removable applied-filter chips.** §3 — the state lives in the trigger.
- **Infinite scroll and `VER MAIS`.** §7.
- **A régua per card**, and **shared scale comparison.** §4.
- **Hover image swap.** §6.
- **Add to cart from the card**, and **favouriting** (no accounts in scope).
- **Sorting by new arrivals, best sellers or relevance.** §3.
- **Suggestions on zero results.** §8.
- **Filter or sort on a coleção.** §9.
- **A result counter separate from the régua** — the régua is the count. §4.
- **Ordinal numbering on the cards** — out of the system per
  [`marca.md`](marca.md) §2.

## How this was decided

Two rounds of grilling on ticket
[Room landing & product listing sections](../../.wayfinder/tickets/008-catalog.md).
The first fixed *what these pages are*: one template for four routes, the ambiente
landing as a header plus tipo band over the same grid, filters in a horizontal bar
rather than a rail, pagination rather than infinite scroll, and the card's anatomy.
The second fixed density, mobile, zero results and the filters' behavioural details.

The most consequential decision is the **régua as the result count**: it resolves in
one move the visible result every listing owes and the ceiling of two réguas per
screen, and it is what stops the brand signature from becoming texture on the only
storefront page that repeats a layout twelve times.
