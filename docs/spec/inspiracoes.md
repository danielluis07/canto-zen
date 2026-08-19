# Inspirações — `/inspiracoes` e `/inspiracoes/[slug]`

The editorial surface: what the index presents, what an article contains, and how
pieces reach the catalogue from inside a room story. Resolves ticket
[012 — Inspirações sections](../../.wayfinder/tickets/012-inspiracoes.md).

This file is written in English prose; every string quoted as copy is the pt-BR
that ships. Domain terms stay pt-BR throughout — they are the glossary
([`CONTEXT.md`](../../CONTEXT.md)), not the prose.

---

## 1. What was already decided elsewhere

| Constraint | Source |
| --- | --- |
| **Flat navbar link, no panel.** `INSPIRAÇÕES` is the fifth bar item and opens no mega menu; it marks active with the 1px ink rule on both routes. | [`navbar.md`](navbar.md) §5, §11 |
| **The home carries a three-row excerpt.** `ConteudoHome.inspiracoes` names three `Artigo.slug`, rendered as rows with thumbnail, título, resumo and the ambiente as annotation. | [`home.md`](home.md) §6 |
| **The room shot is the store's only photographic exception.** Raking late-afternoon light and the plaster background still hold; only "the piece alone" is suspended. | [`marca.md`](marca.md) §7 |
| **Full footer.** Both routes are navigation and keep the complete footer. | [`rodape.md`](rodape.md) |
| **Coleções are surfaced in context here.** `/colecoes` has no index; a coleção reaches the reader through the home and through Inspirações. | [`rotas.md`](rotas.md) |

The last one is discharged by §6.4: an article may name a coleção in prose and
link it, and that is the whole of the obligation. Nothing on this surface is
built around coleções.

---

## 2. One genre, four articles, and the set is closed

**An Artigo is a room, composed.** A single space, photographed with several
pieces in it, described. There is no second genre — no designer profile, no
material essay, no journal — and the store never publishes one.

This is the surface's central decision and it is what keeps it from reading as a
blog bolted to a shop. A blog has categories; this has a single recurring act.
Three consequences follow immediately:

- **The photographic exception is spent exactly where it was granted.**
  `marca.md` §7 admits the room shot and nothing else. A genre that needed any
  other kind of photograph would either break that rule or be illustrated by
  product shots, which is a listing with prose around it.
- **A designer story has nowhere to live.** `Familia.designer` already appears on
  every PDP ([`pagina-produto.md`](pagina-produto.md) §10); an article restating
  it is the site telling the reader something it has already told them better.
  The same goes for a material story, which is `Material.cuidados`, derived.
- **The set is structurally complete: four rooms, four articles.** One per
  Ambiente, and the index is *finished* rather than sparse. A feed that stops at
  four entries looks abandoned; a set of four that is complete by construction
  looks authored. This is also the only honest option for a concept store, which
  cannot promise a fifth article.

| Ambiente | Artigo |
| --- | --- |
| `sala` | one article |
| `quarto` | one article |
| `cozinha` | one article |
| `escritorio` | one article |

`Artigo.ambiente` is therefore **required and unique** across the four — the
optionality [`home.md`](home.md) §12 anticipated is not exercised. See §8.

---

## 3. The two refusals

**Inspirações is the only surface in the store with no price and no régua.**
Both absences are authored; together they are the identity claim this surface
makes.

### 3.1 No price, anywhere

No `precoTabela`, no à-vista figure, no parcelamento line, no Pix badge — not in
a legend, not in the prose, not at the close. A piece named in an article is a
name and a link; the figure is one click away on its PDP, where every obligation
in [`br-ecommerce-conventions.md`](../research/br-ecommerce-conventions.md) is
already met in full.

This does not weaken those obligations. They attach to surfaces where a piece is
*offered* — listing and PDP — and every route into the catalogue from here lands
on a PDP. What it buys is that the reader is never sold to inside the story.

### 3.2 No régua, on either route

The second authored absence in the system, after [`carrinho.md`](carrinho.md) §2,
and refused for the same reason: where the available figures would make the
gesture decorative, the gesture is not spent.

The candidates are all bad. The room's own dimensions are architecture the store
has no data for and would have to invent — the fifth refusal of a fabricated
artefact. A cota on one piece inside a group shot is arbitrary the moment the
frame holds several, because `marca.md` §2 scopes the régua to *a featured
piece*, and a room shot features none of them individually. An article count on
the index (`4 ARTIGOS`) annotates a number the reader obtains by looking.

The tally across the storefront now reads:

| Surface | Réguas |
| --- | --- |
| Home | exactly 2 |
| Listagem | exactly 1 (`{n} PEÇAS`) |
| PDP | exactly 2 (cota do `principal`, desenho da família) |
| Carrinho | 0 — authored |
| Checkout | 0 |
| **Inspirações** | **0 — authored** |

---

## 4. Photography

`marca.md` §7's exception is suspended for "the piece alone" and **nothing
else**. Raking late-afternoon light, raw plaster, hard long shadow, the cast
shadow never cropped.

**No human trace.** No person, and no object that implies one just left: no cup,
no open book, no throw folded back, no plants, no fruit. The room is furnished
and empty.

Two reasons, and the first is binding. `pagina-produto.md` §4.1 refused a human
figure as a scale device *citing this rule as admitting no exception outside
Inspirações* — admitting people here would retroactively reopen a settled
decision. The second is that a cup and an open book is the stock language of
every furniture catalogue in the category, and this identity's claim is that the
object is observed, not staged. Widening the exception to "several pieces in real
architecture" is already a large concession; widening it to props spends the
concession on the least distinctive thing it could buy.

Ratios, crops and `alt` treatment belong to
[Imagery](../../.wayfinder/tickets/014-imagery.md); §10 states what this surface
demands of it.

---

## 5. The index — `/inspiracoes`

### 5.1 Shape

| # | Block | Background |
| --- | --- | --- |
| 1 | Cabeçalho | `--plaster` |
| 2 | Four rows, hairline-separated | `--plaster` |

And the page ends. No pagination, no filter, no closing CTA — the same way
[`home.md`](home.md) §7 ends its scroll.

### 5.2 Cabeçalho

One Display L line in Mincho, and one Body line beneath it in `--muted`, on the
left five columns with the right-hand gutter kept empty per `marca.md` §5.

Copy direction: the Mincho line names the act, not the section
(`Quatro ambientes, compostos.` reads better than `Inspirações`, which the navbar
has already said and the browser tab repeats). The Body line states what the
reader is looking at and that the set is complete — one sentence, no invitation,
no "descubra".

There is **no photography above the rows**. A photograph over a list of
photographs is the page competing with itself — the argument
[`catalogo.md`](catalogo.md) §2 used to take imagery off the room landings — and
here it would additionally spend the room-shot exception on a page that is not a
room story.

### 5.3 The rows

Uniform, peers, in a fixed authored order that is *not* recency. Each whole row
is a single link to `/inspiracoes/[slug]`.

```
┌──────────────────────────────────────────────────────────────┐
│ ┌────────────────────┐                                       │
│ │                    │  SALA                                 │  ← annotation
│ │   16:9  (cols 1-5) │  Título do artigo    (cols 6-10)      │  ← Display L
│ │                    │  Resumo em uma linha                  │  ← Body S --muted
│ └────────────────────┘                              (11-12)  │  ← empty
├──────────────────────────────────────────────────────────────┤  ← 1px hairline
```

| Element | Role | Type |
| --- | --- | --- |
| Ambiente | Annotation, `--muted`, uppercase | Annotation |
| Título | The article's name | Display L (Mincho) |
| Resumo | One line, never wrapping to three | Body S, `--muted` |
| Thumbnail | 16:9, `Artigo.thumb` | — |

This is `home.md` §6's row at page scale — deliberately, so the home's three rows
read as a literal excerpt of this index rather than a second design of the same
object. The only differences are the wider thumbnail (5 columns rather than 2)
and Display L in place of Display M.

**Mobile.** Thumbnail full width, then annotation, título, resumo stacked
beneath. Hairlines kept.

### 5.4 Grid of cards — refused

`catalogo.md` owns the card grid. A grid of *article* cards is precisely this
surface reading as a commerce listing with prose poured into it, and it would put
two different card systems in one storefront. Rows also carry a resumo at a
length a card cannot.

### 5.5 Lead-plus-rows — refused

Promoting one article to a full-bleed lead is hierarchy by recency, which
requires a "newest" this store has no reason to assert and no data to support:
`marca.md` §2's corollary already removed ordinal numbering from the system
because *nothing in the storefront is a sequence the reader must follow in
order*. Four peers is the truthful presentation.

---

## 6. The article — `/inspiracoes/[slug]`

### 6.1 Shape

Fixed, in this order, and identical across all four articles:

| # | Block | Notes |
| --- | --- | --- |
| 1 | Cabeçalho | ambiente · título · linha de abertura |
| 2 | Foto ampla + legenda | the establishing shot, full-bleed |
| 3 | Passagem | 2–4 sentences |
| 4 | Foto detalhe + legenda | closer frame |
| 5 | Passagem | 2–4 sentences |
| 6 | Foto detalhe + legenda | closer frame |
| 7 | Fecho | one link to the room listing |

Breathing room between blocks: `7rem`, per `marca.md` §5.

### 6.2 Three photographs, fixed — and why not variable

The count is **fixed at three**: one wide, two closer. Not five, not "as many as
the story needs".

`pagina-produto.md` §7 made image `papel` an *instruction of position* precisely
so a page renders deterministically from its data and needs no gallery chrome. A
variable-length article reopens exactly that: it hands the build session a layout
engine to invent, and the spec's whole purpose is that nothing gets invented. A
fixed count also keeps the four articles genuine peers — the same argument that
produced uniform index rows in §5.3 — and holds the imagery debt at twelve room
photographs total rather than twenty-four.

Article photography is **the article's own**, on `Artigo.fotos`. It is not
`Produto.imagens` reused: a `papel: 'ambientada'` product image is one piece in a
setting, and a room shot is several pieces in a room. Distinct things, distinct
storage.

### 6.3 Cabeçalho

Left five columns, right gutter empty.

| Element | Type |
| --- | --- |
| Ambiente (`SALA`) | Annotation, `--muted` |
| Título | Display XL (Mincho) — the page's single Mincho headline |
| Linha de abertura | Body, one or two sentences |

The título is the article's one Display XL; the passagens are Body throughout.
Per `marca.md` §4, Mincho appears once more only if a passagem carries a single
feature line — at most one per article, and never more.

### 6.4 Passagens

Two of them, 2–4 sentences each, Body, measure 60–70 characters, on columns 1–5.

Copy direction: the room and the decision behind it — why these pieces are
together, what the light does, what the space is for. Pieces are **named in
running language** here, and the name is the link (§6.5). Never a specification
list in prose, never a price, never an imperative to buy.

A passagem may name a Coleção and link `/colecoes/[slug]`. That is the whole of
what `rotas.md` meant by collections being "surfaced inside Inspirações" — an
in-context mention, not a block, not a strip.

### 6.5 How pieces reach the catalogue — the legend

**Beneath every photograph, a legend in the annotation voice naming the pieces in
that frame, each name a link to `/produtos/[slug]`.**

```
POLTRONA LINA · MESA BAIXA IPÊ · LUMINÁRIA CORDA
```

Separator is `·`. The legend lists **only pieces visible in that frame**, in
reading order left-to-right, and lists them **only once per article** — a piece
that appears in two frames is named in the first. Between two and five names per
legend; a legend with one name is a product shot with a caption and means the
frame is not a room shot.

The links resolve to a `Produto`, never a `Familia`, because a Família has no
page — so the acabamento actually photographed is the one the reader lands on.

The legend is `--muted`; the linked names are `--ink` and underlined on hover
only, at the 120ms colour transition `marca.md` §9 allows. There is no
thumbnail, no price, no availability, no cart affordance.

This mechanism is chosen because it is already the house language: labelling a
real thing with a true fact is what the régua does, and a legend does it in
words, spending no régua to do so. `marca.md` §4 names photo captions as one of
the annotation voice's jobs — this is that job, load-bearing.

**Hotspots on the photograph — refused.** Numbered markers are unavailable
outright: `marca.md` §2's corollary removed ordinal numbering from the system.
Unnumbered hotspots are a hover-or-tap reveal, and the motion spec is "a 120ms
colour transition, and nothing else" — there is no vocabulary in this identity to
describe the reveal, and inventing one for four pages is the tail wagging the
storefront. They also fail on touch, and they fabricate an interactive artefact,
which this map has now refused five times.

**A "peças neste ambiente" card strip — refused.** It imports `catalogo.md`'s
card wholesale and turns the bottom of every article into a listing, which is the
one outcome the ticket was written to avoid. It would also drag price back onto
the surface (§3.1), since the card carries one.

### 6.6 Fecho

One line, CTA type, one link:

```
VER TODAS AS PEÇAS EM SALA  →  /sala
```

Exactly one exit, and it is real navigation to a real listing — the shape
`pagina-produto.md` §7 settled when it refused *quem viu também viu* in favour of
a link to a listing that exists.

- **Next article — refused.** It implies a reading sequence, which `marca.md`
  §2's ordinal ban already refused for the whole storefront. All four articles
  are peers and the navbar reaches the index from anywhere.
- **A recap of every piece — refused.** The legends already did it, and a recap
  is where the price would try to re-enter.
- **Nothing — refused.** Ending the scroll works on the home because *arriving
  nowhere* is the home's argument; an article is entered from elsewhere and needs
  one way out. The map's own empty-state pattern is "exactly one link out", and
  the fecho is also the moment the editorial hands the reader to commerce without
  ever having quoted a figure.

---

## 7. `?ambiente=` is retired, and there is no empty state

### 7.1 The filter

[`rotas.md`](rotas.md) reserved `?ambiente=` on `/inspiracoes`. **It is now
retired, unused, like `?q=` before it**, and `rotas.md` is amended.

With four articles where each article *is* a room, a room filter reduces four
rows to one, and each row already carries its ambiente as its first annotation.
That is a control that computes what the reader has on screen — the objection
that killed the PDP's "cabe no meu espaço" widget
([`pagina-produto.md`](pagina-produto.md) §4.1). It would also import
`catalogo.md`'s filter bar onto the one surface that is not a catalogue.

### 7.2 The empty state

The map carried an outstanding *empty Inspirações index* and assigned it here.
**It resolves by impossibility: no empty state exists on either route.**

The four articles are structural content, not data that can be absent — the set
is fixed by §2 and is complete by construction, one per Ambiente. There is no
filter to return nothing (§7.1) and no query to miss. Specifying an empty index
would mean specifying a surface that cannot render, which is fabrication of the
same species the rest of this spec refuses.

A missing `slug` on `/inspiracoes/[slug]` is a 404 and belongs to
[Error surfaces](../../.wayfinder/tickets/016-error-surfaces.md), not here.

This closes the last open item under *Empty states* on the map.

---

## 8. Data

```ts
type Artigo = {
  slug: string;              // 'a-luz-da-tarde-na-sala'
  titulo: string;            // Mincho headline — no room name required
  resumo: string;            // ONE line — index row and home row (home.md §6)
  ambiente: string;          // -> Ambiente.slug — REQUIRED and unique across the four
  ordem: number;             // authored index order; NOT recency (§5.5)

  thumb: { src: string; alt: string };   // 16:9 — index row and home row

  abertura: string;          // cabeçalho opening line (§6.3)
  fotos: [FotoArtigo, FotoArtigo, FotoArtigo];  // exactly 3: ampla, detalhe, detalhe
  passagens: [string, string];                  // exactly 2 (§6.4)
};

type FotoArtigo = {
  src: string;
  alt: string;                 // required, as everywhere
  papel: 'ampla' | 'detalhe';  // fotos[0] is 'ampla'; [1] and [2] are 'detalhe'
  pecas: string[];             // -> Produto.slug[] — 2..5, the legend (§6.5)
};
```

**Notes on the shape.**

- `pecas` holds **`Produto` slugs, not `Familia`** — §6.5. A piece is named once
  per article: the union across the three `pecas[]` arrays contains no
  duplicates, and that is a real invariant the seed data must satisfy.
- The tuple types are the §6.2 determinism made enforceable, the same way
  `pagina-produto.md` put the "no empty régua" prohibition into `Imagem.cotas`.
- `ambiente` is required and unique. [`home.md`](home.md) §12 described it as
  optional because the entity did not exist yet; §2 makes it structural.
- **No `data`, no `autor`, no `tags`, no `categoria`, no `corpo` as free
  Markdown.** Every one of them is a blog affordance with no job here: there is
  no sequence (no date), one voice (no author), one genre (no category), four
  articles (no tags), and a fixed skeleton (no free body).
- **No `produtosRelacionados`.** The legends are the relation, and they are
  per-frame and truthful — a separate list would be a suggestion the store cannot
  substantiate.
- No entity in [`produto.md`](produto.md) changes. This ticket is purely
  additive; `Artigo` joins the model and nothing is amended.

---

## 9. Accessibility

- Each index row is a single `<a>` wrapping the whole block; the thumbnail's
  `alt` is empty (`alt=""`) since the título is the accessible name.
- Article photographs carry a **real** `alt` describing the room, not the piece
  list — the legend beneath is already text and would be read twice otherwise.
- The legend sits in the figure's `<figcaption>`; the piece names are ordinary
  links, distinguishable by more than colour (underline on the ink weight against
  `--muted` surrounding text).
- Focus ring per `marca.md` §6: `outline: 2px solid var(--indigo)`, offset 3px.
- Commitment level is still the map's open *Accessibility commitments* item; this
  section states obligations, not a conformance claim.

---

## 10. Constraints handed to other tickets

- **[Imagery](../../.wayfinder/tickets/014-imagery.md)** — this surface adds
  **twelve room photographs** (3 × 4 articles) plus **four 16:9 thumbnails**, and
  they are the only images in the store shot under the suspended "piece alone"
  rule (§4). Two crops are needed: full-bleed wide and the 16:9 thumbnail. The
  thumbnail is used at two sizes — 5 columns here, 2 columns on the home — which
  sets its crop's tolerance.
- **[Institutional pages](../../.wayfinder/tickets/013-institucional.md)** —
  `/sobre` and Inspirações are the store's two long-prose surfaces. `/sobre`
  continues the marcenaria claim ([`home.md`](home.md) §7); Inspirações never
  tells the atelier's story, only the room's. If `/sobre` wants photography, it
  cannot borrow the room-shot exception — that is spent here.
- **[Route metadata & SEO](../../.wayfinder/tickets/015-route-metadata.md)** —
  `titulo` and `resumo` are the natural `<title>` and `description` for an
  article; the index's cabeçalho copy (§5.2) deliberately does not repeat the
  word "Inspirações", so the tab title must supply it.
- **[Error surfaces](../../.wayfinder/tickets/016-error-surfaces.md)** — an
  unknown article slug 404s; there is no empty state to design (§7.2).
- **[Motion](../../.wayfinder/tickets/017-motion.md)** — this surface asks for
  **nothing**: no scroll reveal on the photographs, no parallax on the full-bleed
  frame, no row transition. The only interactive state is the legend link and the
  row hover, both the 120ms colour change. A long editorial page is the classic
  place a scroll reveal gets added; it is refused here in advance.
- **Seed data** — four articles, each with três fotos, duas passagens, an
  abertura, a resumo and 2–5 `Produto` slugs per legend, no duplicates within an
  article. The pieces named must exist and their `ambientes` must include the
  article's room.

---

## 11. Deliberate omissions

Considered and ruled out — recorded so they are not relitigated:

- **A second genre** (designer, material, processo, journal) — §2.
- **A fifth article, or an open-ended set** — §2.
- **Any price, badge or parcelamento** — §3.1.
- **Régua on either route** — §3.2, an authored absence.
- **People, plants, cups, books, styling props** — §4.
- **Photography on the index** — §5.2.
- **A card grid index** — §5.4.
- **A featured/lead article, and recency ordering** — §5.5.
- **Variable article length** — §6.2.
- **Hotspots or in-image markers** — §6.5.
- **A "peças neste ambiente" card strip** — §6.5.
- **"Próximo artigo" / prev-next navigation** — §6.6.
- **`?ambiente=` filter** — §7.1, retired unused.
- **An empty-index state** — §7.2, impossible by construction.
- **Dates, authors, tags, categories, comments, sharing, newsletter block** — §8.
  The newsletter lives in the footer and is not repeated here.
