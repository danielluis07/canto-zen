# Home — homepage sections

Resolves ticket [Home page sections](../../.wayfinder/tickets/007-home.md).
Route `/` ([`rotas.md`](rotas.md)). Seven sections, in this order, between the
navbar ([`navbar.md`](navbar.md)) and the footer ([`rodape.md`](rodape.md)).

This page has one job: **make navigation by ambiente feel inevitable, not
imposed.** Everything here justifies itself against that.

This file is written in English prose; every string quoted as copy is the pt-BR
that ships, and domain terms stay pt-BR throughout.

---

## 0. Order and rhythm

| # | Section | Background | Grid pair |
|---|---|---|---|
| 1 | Hero — the piece | `--plaster` | image 7 / block 5 |
| 2 | Ambientes | `--plaster` | 7 + 5 stacked |
| 3 | Featured pieces | `--plaster` | 3 × 3 col, 10–12 empty |
| 4 | Featured coleção | `--plaster` | image 7 / text 5 |
| 5 | Service | `--kozo` | band, 4 × 3 col |
| 6 | Inspirações | `--plaster` | 3 rows with hairlines |
| 7 | The marcenaria | `--plaster` | feature line + image 7 / text 5 |

Container `1360px`, gutter `clamp(1.5rem, 4vw, 4.5rem)`, 12-column grid, `7rem`
between sections — all from [`marca.md`](marca.md) §5. No section on this page
uses less than `7rem` of breathing room; it is the one page that establishes the
rhythm for the other 14 routes.

**The Service band (§5) sits in the middle on purpose.** Sections 4, 6 and 7 are
all image-plus-text; running in sequence, the bottom half of the page would rhyme
with itself three times in a row every `7rem`. With no dark mode and a single
accent, the background swap to `--kozo` is the only tonal shift available, and it
earns its place by breaking that sequence — while delivering the delivery facts
**after** the visitor has seen a price in §3, which is when "how does this reach
me" actually becomes the question.

---

## 1. Hero — the piece

**Purpose.** Open with reverence for an object. It establishes, all at once, the
régua, the photography rule and the fact that this store **shows price** — the
three things every other page will assume have already been said.

It does not open with the four ambientes: that would open with a taxonomy, which
is exactly the wall-of-categories register the brand refuses, and would spend four
photographs before earning any attention.

**Form.** Image on columns 1–7, text block on 8–12 with a maximum measure of
`34ch`. The image uses the piece's real proportion and is capped at
`max-height: 78vh`, so that §2's top hairline is visible above the fold — the
ambientes appear as the natural next step, not as an opening demand.

**Régua.** One cota, `largura`, horizontal, along the image's bottom edge. The
vertical cota is **suppressed** here: it would live outside the image on the
right, where the text column begins. See the régua budget in §9.

**Content, top to bottom.**

| Element | Typographic role | Data source |
|---|---|---|
| Eyebrow | Annotation, `--muted` | fixed: `PEÇA EM DESTAQUE` |
| Name | Display XL (Mincho) | `produto.nome` |
| Acabamento + designer | Annotation, `--muted` | `produto.acabamento`, `familias[produto.familia].designer` |
| À-vista price | Price, tabular | derived from `precoTabela` |
| Pix badge | Annotation, `--indigo` | derived from `politicas` |
| Parcelamento | Body S, `--muted` | derived from `politicas` |
| CTA | CTA | `VER A PEÇA` |

**Copy direction.** No slogan. The only prose is the piece's name; the eyebrow and
the commercial data speak in the annotation voice. No "bem-vindo", "descubra" or
category promise.

**Click destination: the piece's PDP** (`/produtos/[slug]`), from both the image
and the CTA. Sending the click to the ambiente listing would contradict the
section's entire argument; ambientes are §2's job, 400px below.

**Data.** `ConteudoHome.destaqueHome` (§8) — one Produto slug, **authored**. The
specific piece is not fixed here: that would invent catalogue data still sitting
in the map's fog. What the spec fixes are the slot's constraints:

- it must resolve to a Produto with an image of `papel: 'principal'`;
- that image must declare `cotas: ['largura']` — **otherwise the hero does not
  render**, because an empty régua is prohibited ([`marca.md`](marca.md) §2) and
  the type makes the prohibition checkable;
- `disponibilidade` must not be `esgotado`.

> **Two corrections after this ticket closed**, both by [`dados.md`](dados.md).
> §6.1: the table above originally read `produto.designer`, but **`Produto` has no
> such field** — `designer` lives on `Familia` ([`pagina-produto.md`](pagina-produto.md)
> §10), deliberately, because authorship does not change with the finish. The read
> now resolves through `familia`, and the same resolution applies anywhere else a
> designer is shown beside a produto. §6: the slot is **no longer unfixed** — the
> hero is `sofa-heron-linho-cru`, and it satisfies all three constraints above.

---

## 2. Ambientes

**Purpose.** The store's spine, offered as a choice and not as a menu. It is the
section that has to make the rest of the navigation feel obvious.

**Form: four photographic fields, deliberately unequal.** Four equal tiles is the
category default and reads as a grid of buttons. Here: one featured ambiente on
columns 1–7, at full height; the other three stacked on columns 8–12, each in a
shorter band, separated by 1px hairlines in `--hairline`. Composition, not the
alphabet, decides which one takes the 7 columns — it is authored, by the order of
`ambientes[]`.

Room photography is the only place this store shows scale and context; a purely
typographic version of this section would leave the whole page as
pieces-on-plaster.

**Per field.**

| Element | Role | Source |
|---|---|---|
| Photograph | — | `ambiente.imagem` (§8) |
| Label | Annotation, `--ink` | `ambiente.label` |
| Three tipos | Annotation, `--muted`, separated by `·` | first 3 of `ambiente.tipos` |

The three tipos mirror the navbar panel and reinforce that a tipo is a landable
path, not a filter. They are **not** independent links: the entire field is a
single link to `/[ambiente]`.

**Section eyebrow:** `AMBIENTES`, annotation voice. No Mincho title — Mincho is
rationed (§11).

**No régua.** No icons. No ordinal numbering.

---

## 3. Featured pieces

**Purpose.** Prove that the prices exist and that they are honest. The brand
direction settled the reconciliation as "discreet price, never absent price"; a
home that showed pieces without prices would be exactly the "sob consulta" evasion
[`marca.md`](marca.md) §1 refused in writing.

**Form: three pieces, not six.** Six is a grid and pulls the page towards the
catalogue density the brand's §5 rations. Cards on columns 1–3, 4–6 and 7–9, with
**columns 10–12 left empty** — the large right gutter preserved, as in every
default pair.

**Per card.**

| Element | Role | Note |
|---|---|---|
| `principal` image | real proportion | no régua |
| Name | Display M (Mincho) | `produto.nome` |
| Acabamento | Annotation, `--muted` | |
| Disponibilidade | Annotation, `--muted` | textual label, no colour |
| À-vista price | **Body**, tabular | see below |
| Parcelamento | Body S, `--muted` | `ou {total} em {N}x de {v} sem juros` |

**Two rations are spent here and need to be stated explicitly.**

1. **The Price typographic role (`1.75rem`) is reserved for the hero and the
   PDP.** At the width of a 3-column card it dominates the composition and turns
   the strip into a promotional shop window. The card uses Body with tabular
   figures.
2. **The Pix badge does not render per card.** Three badged cards would be three
   occurrences of índigo on one screen, and [`marca.md`](marca.md) §3 is explicit:
   if índigo appears three times on one screen, two of them are wrong. Instead the
   policy appears **once**, as a line in annotation `--indigo` aligned to the
   right of the hairline that closes the strip:
   `10% À VISTA NO PIX EM TODAS AS PEÇAS`. The figure comes from
   `politicas.descontoPixPercent`, never hand-written.

**Eyebrow:** `PEÇAS EM DESTAQUE`.

**Data: `ConteudoHome.destaques` — three authored slugs.** They are not the first
three of §4's coleção, which would make two sections show the same pieces `7rem`
apart. And they are not derived: in a concept store there is no honest "new",
there is no sales data, and [`produto.md`](produto.md) already refused numeric
stock precisely so as not to fabricate signal. Authored is also how the rest of
this page works.

---

## 4. Featured coleção

**Purpose.** [`rotas.md`](rotas.md) decided that Coleções have no index page and
are surfaced "in context on the home page and inside Inspirações". This section is
that obligation. A Coleção is a merchandising device whose **order is the editorial
act** — which calls for editorial framing, not a rail of cards.

**Form.** Default pair: image on columns 1–7, text on 8–12, `34ch` measure.

**Régua — the second and last on the page.** A section-opening régua
([`marca.md`](marca.md) §2, the "real figure to state" case), label `{n} PEÇAS`,
with `n = colecao.produtos.length`. Derived, never authored: no new field, and the
figure cannot diverge from the collection.

| Element | Role | Source |
|---|---|---|
| Eyebrow | Annotation | `COLEÇÃO` |
| Name | Display L (Mincho) | `colecao.nome` |
| Description | Body | `colecao.descricao` |
| CTA | CTA | `VER A COLEÇÃO` → `/colecoes/[slug]` |

**No prices in this block.** The block sells the curated sequence, not a piece; a
price here would force choosing *which* piece, which is precisely the decision the
coleção defers to the listing.

**Data.** `ConteudoHome.colecaoDestaque` → `Colecao` ([`produto.md`](produto.md),
*Related entities*).

---

## 5. Service

**Purpose.** Brazilian commerce puts a band of badges or testimonials here, and
this store has none honestly available — [`produto.md`](produto.md) refused
ratings for lack of a source, and [`rodape.md`](rodape.md) kept third-party badges
out because they are credentials of a real CNPJ. What **is** true and decisive is
service: someone buying a sofa costing thousands of reais decides about delivery
and montagem before deciding about taste.

**Form.** Full-bleed band in `--kozo`, inner container, four fields on columns
1–3, 4–6, 7–9 and 10–12, divided by 1px vertical hairlines in `--hairline`. **This
is the only section on the page that fills through to column 12** — it is a rail,
not a composition, and the symmetry is what makes it read as an information band
rather than an editorial block.

Vertical padding `4rem`. No icons (the footer's icon exception does not extend up
here). No régua. No índigo, except focus and link hover.

| Label (annotation) | Line (Body S) | Destination |
|---|---|---|
| `FRETE` | Calculado por CEP na página da peça. | `/politicas/entrega-e-frete` |
| `MONTAGEM` | Opcional, feita no dia da entrega. | `/politicas/entrega-e-frete` |
| `PRAZO` | Em dias úteis, contado após a confirmação do pagamento. | — |
| `ARREPENDIMENTO` | 7 dias para desistir, contados do recebimento — ou da montagem, quando contratada. | `/politicas/trocas-e-devolucoes` |

Three of the four fields link and one does not. That is slightly misaligned and is
still the right call: inventing a page for *prazo* would be worse. Frete and
montagem point at the same policy because [`rotas.md`](rotas.md) decided that
*Entrega e frete* absorbs the montagem detail instead of generating its own page.

The withdrawal text here is the short version; the full conspicuous prose lives in
the footer's legal block and in `/politicas/trocas-e-devolucoes`.

> Statutory copy to be checked against planalto.gov.br before implementation —
> see *Not yet specified* in the map.

---

## 6. Inspirações

**Purpose.** Inspirações is one of only five navbar items; leaving it off the home
entirely would leave the section's promise unsupported at the top of the funnel.

**Form: three rows, not three cards.** A strip of cards would repeat §3's rhythm
`7rem` away; two large articles would compete with §4 and the page would have two
image-7/text-5 pairs in a row. Three horizontal **rows** separated by hairlines
are a third rhythm and keep §4 as the page's only editorial feature.

Per row: 16:9 thumbnail on columns 1–2, title on 3–7, summary on 8–10, columns
11–12 empty. The whole row is a link to `/inspiracoes/[slug]`.

| Element | Role |
|---|---|
| Ambiente | Annotation, `--muted` |
| Title | Display M (Mincho) |
| Summary | Body S, `--muted`, one line |

**Eyebrow:** `INSPIRAÇÕES`. **Closing:** one CTA line, `VER TODAS AS
INSPIRAÇÕES` → `/inspiracoes`.

**Data.** `ConteudoHome.inspiracoes` — three article slugs. The entity now exists:
`Artigo` in [`inspiracoes.md`](inspiracoes.md) §8. Two notes on what it settled —
`ambiente` came back **required**, not optional as §12 anticipated, so every row
here always carries its annotation; and there are exactly **four** articles, so
this section shows three of four and `VER TODAS AS INSPIRAÇÕES` leads to one more.

---

## 7. The marcenaria

**Purpose.** [`navbar.md`](navbar.md) §5 took *Sobre* and *Contato* out of the bar
and sent both to "footer and home". But the real reason the block exists is
another: the atelier claim — in-house marcenaria, made-to-order production, a named
designer — is what **justifies the prices shown in §3**. Stating it only as a
footer link would make the whole position decorative.

It is also the page's closing: it ends on an assertion, not on a strip of cards.

**Form.** Two parts:

1. **The Mincho feature line**, spanning columns 1–9, `Display L`. This is the
   **only "one feature line per page"** [`marca.md`](marca.md) §4 grants, and it is
   spent here — see §11.
2. Below it, the default pair: image 7 / text 5.

**Copy direction.** The line asserts the *making*, it does not sell. Direction, not
final copy:

> Cada peça sai de uma marcenaria, não de um catálogo.

Below it, at most three sentences in Body — who makes it, where, and what "sob
encomenda" means in practice. CTA: `SOBRE O ATELIÊ` → `/sobre`.

**Photography: an unfinished piece, alone.** No person, no hands, no staged
workbench. That keeps [`marca.md`](marca.md) §7's rule intact — raking light,
plaster background, the piece alone — and **does not open a second exception** to
"the piece alone" beyond Inspirações. Raw wood or an exposed joint tells the
marcenaria story without needing an exception.

**No Contato here.** Contato is a form and a phone number; it would be the fourth
text block below the fold and it has no story to tell. The navbar's note is already
satisfied by the *Atendimento* column that [`rodape.md`](rodape.md) promoted to a
column of its own precisely to house contact.

**The scroll ends here.** No closing CTA, no repeat of the ambientes, no "ver todas
as peças". Repeating the ambientes at the end of the page is the standard fix for a
page that failed to route earlier; if §2 works, it is an admission of failure. And
`/produtos` was already refused as a permanent slot by the navbar, exactly so as
not to weaken the ambientes.

---

## 8. Data

```ts
type ConteudoHome = {
  destaqueHome: string;        // -> Produto.slug   (§1)
  destaques: string[];         // 3 -> Produto.slug (§3)
  colecaoDestaque: string;     // -> Colecao.slug   (§4)
  inspiracoes: string[];       // 3 -> Artigo.slug  (§6)
  marcenaria: {                //                    (§7)
    linha: string;
    texto: string;
    imagem: { src: string; alt: string };
  };
};
```

All authored. The home derives no selection.

**Addition to the `Ambiente` entity** ([`produto.md`](produto.md), *Related
entities*) — §2 needs one photograph per ambiente and the model has none:

```ts
type Ambiente = {
  slug: string;
  label: string;
  tipos: string[];
  imagem: { src: string; alt: string };   // NEW — ambiente photo
};
```

Deliberately **not** an `Imagem`: that type carries `papel` and `cotas`, and a
régua on a room photo is already prohibited by §9, so the fields would exist only
to stay permanently empty. Also **not** an `ambientada` shot borrowed from some
product — [`produto.md`](produto.md) was explicit that "a product with no
ambientada shot must not silently promote" anything into a slot, and the risk is
the same one level up. An addition, not a reversal; see §12.

---

## 9. Régua budget

`marca.md` caps it at two per *screen*, not per page — a page this size could
legally carry more. The home is stricter than the rule:

**Exactly two on the entire page.**

| Where | Cota |
|---|---|
| §1 Hero | `largura`, in cm, read from `medidas` |
| §4 Coleção | section opening, `{n} PEÇAS` |

**Prohibited in:** ambiente fields (§2), featured cards (§3), the service band
(§5), Inspirações rows (§6), the marcenaria block (§7).

The home is the only page that teaches what the gesture means. A visitor who meets
it six times before reaching a product page has learned that it is ornament — and
ornament is exactly what the régua was chosen not to be.

## 10. Índigo budget

Índigo appears on the home in: the hero's Pix badge (§1), the strip's single Pix
policy line (§3), and focus/hover states. **Never two badges on the same screen.**
No decorative use.

## 11. Mincho budget

| Use | Where | `marca.md` §4 category |
|---|---|---|
| Piece name | §1, §3 | piece name |
| Collection name | §4 | collection title |
| Article titles | §6 | editorial title |
| Marcenaria line | §7 | **the page's only feature line** |

Section eyebrows are **annotation, not Mincho**. Mincho section titles would spend
the family five times and §7's line would stop being a feature.

---

## 12. Constraints handed to other tickets

- **[Product data shape](../../.wayfinder/tickets/003-product-data-shape.md)** —
  `Ambiente` gains `imagem: { src, alt }` (§8). An additive addition to a settled
  decision, not a reversal; `produto.md` carries a note pointing here.
- **[Imagery system](../../.wayfinder/tickets/014-imagery.md)** — the home asks for
  four ambiente photographs (§2), one 16:9 thumbnail per article (§6) and one
  unfinished-piece photo (§7). The §7 one is **not** an exception to "the piece
  alone" and the imagery system must handle it under the normal rule.
- **[Inspirações](../../.wayfinder/tickets/012-inspiracoes.md)** — §6 needs an
  article to expose `slug`, `titulo`, `resumo` (one line), a 16:9 thumbnail and an
  optional `ambiente`. The entity's shape belongs to that ticket; these are the
  fields the home consumes.
- **[Institutional pages](../../.wayfinder/tickets/013-institucional.md)** —
  `/sobre` receives §7's click and must continue the marcenaria claim, not repeat
  it. `/contato` has no entry point from the home.
- **[Motion](../../.wayfinder/tickets/017-motion.md)** — the home has **no** scroll
  reveal, parallax or section entry animation. The only transition is the 120ms
  colour one on interactive states ([`marca.md`](marca.md) §9).
- **Catalogue seed data** — *resolved*, see [`dados.md`](dados.md) — the home consumes 1 + 3 product slugs, 1
  coleção with a non-empty `produtos[]`, 3 articles and 4 ambiente photos. The hero
  slot requires a product with `cotas: ['largura']` on its principal image.

---

## 13. Mobile

One column, in the same order. No accordion, no carousel.

- §1 — image above the block; the `largura` cota stays.
- §2 — four fields stacked at equal height; the asymmetry is a desktop device and
  does not survive a single column.
- §3 — three stacked cards; the Pix policy line goes below the last one.
- §4, §7 — image above the text.
- §5 — four stacked fields, divided by **horizontal** hairlines.
- §6 — thumbnail above title and summary.

Breathing room between sections drops to `4rem` — the floor from
[`marca.md`](marca.md) §5, never below.

---

## Deliberate omissions

Considered and dropped — recorded so they are not relitigated:

- **Newsletter.** The footer already owns it (`AVISO DE NOVAS PEÇAS`,
  [`rodape.md`](rodape.md) §5). Duplicating it would be the same capture twice in
  one scroll.
- **Testimonials, ratings, third-party badges.** No honest source —
  [`produto.md`](produto.md) and [`rodape.md`](rodape.md) already settled this.
- **A Contato section.** See §7.
- **New arrivals / best sellers.** With no real inventory, both are fabricated
  signal. [`rotas.md`](rotas.md) already refused `/novidades` and `/promocoes` as
  destinations.
- **Closing CTA and a repeat of the ambientes at the end.** See §7.
- **Ordinal numbering (01 / 02 / 03)** in any section — out of the system per
  [`marca.md`](marca.md) §2.
- **A carousel or rotating banner in the hero.** One piece, still.
- **Search.** Out of scope across the whole map.
- **Countdowns, free-shipping bars, coupon banners.** The "voice, not presence"
  agreement keeps the commercial facts whole and unshouted.

## How this was decided

Two rounds of grilling on ticket
[Home page sections](../../.wayfinder/tickets/007-home.md). The first fixed *which
sections exist and in what form* — single-piece hero versus ambientes hero, whether
the home sells or merely routes, the coleção split from the featured strip, and
what replaces social proof in a store with no ratings. The second fixed order, the
three budgets (régua, índigo, Mincho), the hero's authorship, and the ambiente
photograph missing from the data model.

The most consequential decision is the **régua budget**: two on the entire page. It
is stricter than the brand rule, and it is what stops the home from teaching the
other 14 routes the wrong gesture.
