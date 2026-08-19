# Carrinho — `/carrinho`

The cart page: what it contains, how a line edits, what the resumo itemises, and
where the purchase ends. Resolves ticket
[010 — Cart sections](../../.wayfinder/tickets/010-cart.md).

This file is written in English prose; every string quoted as copy is the pt-BR
that ships. Domain terms stay pt-BR throughout — they are the glossary
([`CONTEXT.md`](../../CONTEXT.md)), not the prose.

---

## 1. What was already decided elsewhere

The cart inherits four constraints and does not relitigate them:

| Constraint | Source |
| --- | --- |
| **Page, never a drawer.** `CARRINHO (n)` in the navbar is a link to `/carrinho`; no drawer, no hover preview, no mini-cart. | [`navbar.md`](navbar.md) §7 |
| **Full footer.** `/carrinho` keeps the complete footer — it is still navigation. The reduced footer belongs to the checkout. | [`rodape.md`](rodape.md) |
| **The CEP is remembered.** Typed once on any PDP, it is the session's CEP and arrives pre-filled here. | [`pagina-produto.md`](pagina-produto.md) §2.7 |
| **Every item entered through a PDP.** Listing cards have no add-to-cart, so nothing reaches this page without its buyer having seen the piece at full size. | [`catalogo.md`](catalogo.md) §13 |

That last one is load-bearing for §4: the cart never has to introduce a piece,
only confirm it.

---

## 2. The page has no régua

**The cart is the first surface in the system with no régua, and that is
authored, not forgotten.**

Every other page spends the gesture explicitly and counts it: the home has
exactly two, the listing has one (`{n} PEÇAS` opening the grid), the PDP has two
(the `principal` cota and the family drawing). The cart has none.

The reason is what the régua *is*. [`marca.md`](marca.md) defines it as ornament
and data at once — a real measurement alongside a real piece. The cart's subject
is not matter; it is money and logistics. The two figures available to annotate
are the item count and a sum of centimetres. The second is absurd. The first is
worse than absurd: it is a number the reader can obtain by counting the lines in
front of them, which makes the annotation decorative, and a decorative régua is
precisely what the identity forbids.

**Consequence for índigo.** [`marca.md`](marca.md) rations the accent to
interactive state plus the Pix badge, and declares three occurrences on one
screen wrong. With no régua the cart spends índigo once — the Pix badge in the
resumo (§5.4) — plus focus rings, which are state and not decoration.

---

## 3. Header

```
CARRINHO
```

`CARRINHO` in Schibsted caps, annotation voice at display size, left-aligned on
the same grid the listing header uses. Nothing else — **no piece count, no
subtitle, no breadcrumb.**

- **Not Mincho.** [`navbar.md`](navbar.md) registered the wordmark as the single
  exception to "Mincho never for interface", and
  [`pagina-produto.md`](pagina-produto.md) spent the PDP's only Mincho line on
  the piece name. A utility page does not get to break that twice.
- **No count line.** `3 peças` under the heading is a régua in prose with the
  rule taken off, and §2 just removed it.

---

## 4. The line item

### 4.1 Anatomy

```
┌──────────┐
│          │   Poltrona Lina                              R$ 3.890,00
│  [foto]  │   LINHO CRU                                  −  1  +
│          │   [×] Montagem            + R$ 99,00         REMOVER
└──────────┘   ENVIO IMEDIATO
```

| Element | Voice | Source |
| --- | --- | --- |
| Thumbnail | 96px square, `principal` image, no radius, no shadow | `Produto.imagens[papel='principal']` |
| Nome | Corpo, `--ink`, **links to the PDP** | `Produto.nome` |
| Acabamento | Annotation, `--muted` | `Produto.acabamento` |
| Montagem row | Corpo S, `--muted`, only when `montagem.necessaria` | §4.3 |
| Disponibilidade | Annotation, `--muted` | §4.4 |
| Price | Preço, tabular, right-aligned | `Produto.precoTabela × quantidade` |
| Quantity | Text stepper | §4.2 |
| `REMOVER` | Annotation, `--muted` | §4.2 |

Rows are separated by a 1px `--hairline` rule; the first has a rule above it.

**The thumbnail stays, and the width in cm goes.** These two look like the same
decision and are opposite ones.

The image earns its place because of what a Produto *is*: one record per
acabamento ([`produto.md`](produto.md)), so `poltrona-lina-linho-cru` and
`poltrona-lina-boucle-carvalho` carry the **same `nome`** and differ only in a
line of annotation and a photograph. Buying the wrong finish is the single
highest-frequency error this catalogue's data shape makes possible, and the cart
is the last surface where it is cheap to catch. A purely typographic ledger would
render that error invisible at exactly the moment it becomes expensive.

The cm goes for the mirror-image reason. [`catalogo.md`](catalogo.md) put
`medidas.largura` on the card as the debt owed for [`produto.md`](produto.md)
keeping the measurement out of `nome` — the promise being that scale is legible
wherever a piece is *being chosen*. That debt is paid on the listing and again on
the PDP. In the cart the piece is chosen; the number is no longer helping anyone
decide, and it competes with the price for the one tabular figure the eye should
land on.

**Ordering.** Lines render in the order they were added, newest last. They do not
reorder — see §4.4.

### 4.2 Quantity and removal

```
−  1  +
```

- A text stepper: two hairline glyphs with a tabular figure between them, 1px
  `--muted` borders, zero radius, `--ink` on hover.
- Chosen over a numeric field because the typical quantity is 1 and a field
  summons the mobile keyboard for a change of ±1; chosen over a `<select>`
  because a select needs an arbitrary ceiling.
- `−` at quantity 1 is **disabled, not a delete shortcut**. Removal is a word.
- Accessible naming: `aria-label="Aumentar quantidade de {nome}"` /
  `"Diminuir…"`, with the figure in an `aria-live="polite"` region so the change
  is announced.

**`REMOVER`**, the word, in annotation voice `--muted`, `--ink` on hover. Not
`×`: [`navbar.md`](navbar.md) fixed zero icons at every breakpoint and
[`rodape.md`](rodape.md) registered the footer as the sole exception. The cart
does not get a second exception for a glyph a word covers.

**No undo.** A three-line cart does not justify transient state, and every piece
is one click from returning via the PDP the line already links to.

### 4.3 Montagem is an attribute of the line, not a line of its own

```
[×] Montagem                                          + R$ 99,00
```

Rendered inside the piece's row, beneath its price, only when
`Produto.montagem.necessaria === true`. The checkbox is **editable here** — 1px
box, zero radius, solid `--ink` when checked, matching the PDP's control. Someone
who skipped it on the product page must not have to navigate back.

- Price is `politicas.montagemCentavos[montagem.nivel] × quantidade`, derived,
  never stored on the line.
- The four facts that justify the price (`nivel · pessoas · peças · minutos`)
  live **only on the PDP** ([`pagina-produto.md`](pagina-produto.md) §2.8). The
  cart shows the price alone; someone who wants the justification follows the
  nome link.
- It is included in that line's subtotal, and therefore in `Subtotal` — it does
  **not** appear as its own row in the resumo (§5.1).

**Why an attribute and not a sibling line.** Montagem without its piece does not
exist. A sibling line raises a question with no good answer — can it be removed
on its own? If yes, the cart now contains an assembly service for a piece that
isn't there; if no, the cart contains a line whose `REMOVER` is disabled for
reasons the reader cannot see. Modelling it as an attribute makes the impossible
state unrepresentable.

> **Amendment.** [`pagina-produto.md`](pagina-produto.md) §2.8 previously read
> that montagem "becomes a line item in the cart with its own price", while §11 of
> the same file said the line "carries a montagem flag and its derived price".
> This ticket resolves the contradiction in favour of §11, and
> `pagina-produto.md` §2.8 has been corrected to match.

**Arrependimento.** When montagem is contracted, the 7-day withdrawal window
counts from the **assembly date**, not delivery ([`rodape.md`](rodape.md),
[research §6.2](../research/br-ecommerce-conventions.md)). That is stated once in
the resumo's legal line (§5.4), not repeated per line.

### 4.4 Disponibilidade and prazo, per line

One annotation line under the acabamento, `--muted`, reading the piece's own
state — never a count, never a badge, never a colour:

| State | Copy |
| --- | --- |
| `envio-imediato` | `ENVIO IMEDIATO` |
| `sob-encomenda` | `SOB ENCOMENDA · PRODUÇÃO DE {n} SEMANAS` |
| `esgotado` | `ESGOTADO · REMOVA PARA CONTINUAR` (see §6) |

This is the whole of the delivery-group question — [`produto.md`](produto.md)
left the cart free to split into groups, and it does **not**. Lines keep the
order they were added; the divergence is carried by the annotation on each line,
plus one sentence in the resumo when the prazos actually differ (§5.3).

Visual grouping under `ENVIO IMEDIATO` / `SOB ENCOMENDA` headers was considered
and rejected: it reorders the list underneath the reader in response to an edit
they did not make, and it buys structure a two-or-three-line cart has no use for.
A single longest-prazo figure was also rejected — it is simply false about the
piece that ships next week.

---

## 5. Resumo do pedido

Right column on desktop, **sticky**, 1px `--hairline` border, `--kozo` ground,
zero radius. Below the list on mobile, static.

```
RESUMO

Subtotal (3 peças)                              R$ 8.279,00
─────────────────────────────────────────────────────────
Total                                           R$ 8.279,00
R$ 7.451,10 à vista   10% À VISTA NO PIX
ou 10x de R$ 827,90 sem juros

FRETE ESTIMADO A PARTIR DE R$ 289,00 PARA 01310-100
CALCULADO NO CHECKOUT · ALTERAR CEP

Sua compra chega em duas entregas.

[ FINALIZAR COMPRA ]

CONTINUAR COMPRANDO →

Você pode desistir da compra em até 7 dias corridos após
receber a peça — ou após a montagem, quando contratada.
```

### 5.1 What it itemises

`Subtotal` → rule → `Total`, and nothing between them. Specifically:

- **No montagem row.** §4.3 put it inside the line; breaking it out again here
  would contradict that and read as double-counting.
- **No frete row inside the sum.** See §5.2.
- `Subtotal (n peças)` where `n` is the summed quantidade — a label, not a
  count-as-ornament, and the only place that number appears.

### 5.2 Freight is stated, never summed

```
FRETE ESTIMADO A PARTIR DE R$ 289,00 PARA 01310-100
CALCULADO NO CHECKOUT · ALTERAR CEP
```

Annotation voice, `--muted`, directly beneath the total block and **outside the
arithmetic**.

The cart shows **one estimate**, not the PDP's option table: the cheapest
standard option for the session CEP, prefixed `A PARTIR DE`. The modality choice
belongs to the checkout, after the full address exists.

- A number folded into a total is a promise. If freight entered the cart's
  `Total` and then moved in the checkout when the buyer picked *entrega
  agendada*, the two screens would disagree about the price — the failure a
  Brazilian storefront is punished hardest for.
- Showing nothing at all ("calculado no checkout" and no figure) is equally wrong
  here: for furniture, freight is a material fraction of the price, and the whole
  reason [research §1](../research/br-ecommerce-conventions.md) puts the
  calculator on the PDP is that the answer must exist before commitment.
- **`ALTERAR CEP`** expands the same masked field the PDP uses, pre-filled,
  re-quoting in place. Errors resolve in ink and typographic weight — no colour,
  no icon ([`marca.md`](marca.md)).
- **`Grátis`**, the word, when `freteGratis` covers the region; never `R$ 0,00`.
- With no CEP in session — a cart reached without any PDP visit, possible via a
  restored cart — the line becomes the field itself:
  `CALCULE O FRETE  [ 00000-000 ]  [ CALCULAR ]`.

### 5.3 Divergent prazos

One sentence, corpo S, `--muted`, shown **only** when the cart's lines do not
share a prazo:

```
Sua compra chega em duas entregas.
```

`{duas|três|…}` derived from the count of distinct prazo groups. This is the
synthesis §4.4 promised: the per-line annotations state the facts, this states
their consequence, and neither reorders anything.

### 5.4 Price tiers, Pix, and the legal line

Order is **identical to the PDP buy box** — `Total` (tabela) leads, à-vista
beneath it, parcelamento third. Inverting the hierarchy here would make two
screens disagree about which number is "the" price.

- `Total` in Preço voice, tabular.
- À-vista beneath in corpo S, with the Pix badge in `--indigo`:
  `10% À VISTA NO PIX`, derived from `politicas.descontoPixPercent`. **This is
  the page's only índigo that is not interactive state** (§2).
- Parcelamento third: `ou {N}x de R$ {v} sem juros`, with `N` derived by
  [`produto.md`](produto.md)'s rule against the **cart total**, not per piece.
- The discount is **visibly disclosed**, because Lei 10.962/2004 art. 5º-A —
  inserted by Lei 13.455/2017 — requires the supplier to inform *"em local e
  formato visíveis"* any discount offered for the payment instrument used.
  **Corrected by the [legal-copy verification](../research/legal-copy-verification.md)
  §5**, which found two slips here: the article was cited as *CDC* art. 5º-A and
  there is no such article in the CDC; and the disclosure was described as what
  *makes the differential price lawful*, which it is not. **Lei 13.455 art. 1º
  makes the differentiation lawful on its own.** The discount is optional;
  disclosing one you do offer is mandatory, and failing to disclose is an
  infraction — it does not void the price. Background in
  [research §3](../research/br-ecommerce-conventions.md).

**Arrependimento**, corpo S `--muted`, below the CTA. Prose, not a badge — the
notice is ostensive by law and appears inline in buy box, cart and confirmation
([`CONTEXT.md`](../../CONTEXT.md)):

> Você pode desistir da compra em até 7 dias corridos após receber a peça — ou
> após a montagem, quando contratada.

The second clause renders **only when some line has montagem contracted**;
otherwise the sentence ends at `receber a peça.`

### 5.5 The CTA, and the way back

```
[ FINALIZAR COMPRA ]
CONTINUAR COMPRANDO →
```

- `FINALIZAR COMPRA` in CTA voice, full width of the resumo, 1px `--ink` border
  on transparent, inverting to solid `--ink` on hover — the primary button
  defined in [`marca.md`](marca.md). Navigates to `/checkout`.
- `CONTINUAR COMPRANDO →` beneath it, annotation voice, `--muted`, to
  `/produtos`. Not a button: two buttons of similar weight make the reader choose
  between them.

**Sticky on desktop, no fixed bar on mobile.**
[`pagina-produto.md`](pagina-produto.md) refused both a sticky buy box and a
fixed mobile bar, and the reasoning there was about *what the chrome would
cover* — the family drawing and the measurements table — not a blanket
prohibition. The cart has nothing underneath worth protecting, so the desktop
resumo is sticky. But a floating mobile CTA would hover over its own destination:
the list is short and the resumo is its natural end.

---

## 6. An item that went `esgotado`

The line **stays, is marked, and blocks checkout.**

```
┌──────────┐
│  [foto]  │   Poltrona Lina                              R$ 3.890,00
│          │   LINHO CRU                                  −  1  +
└──────────┘   ESGOTADO · REMOVA PARA CONTINUAR           REMOVER
```

- The annotation line (§4.4) reads `ESGOTADO · REMOVA PARA CONTINUAR` in
  `--ink` — no colour, no icon, no veil over the row.
- `FINALIZAR COMPRA` is disabled while any such line exists, with one annotation
  line beneath it: `REMOVA AS PEÇAS ESGOTADAS PARA CONTINUAR.`
- The esgotado line's price **still counts in `Subtotal` and `Total`**. Silently
  excluding it produces the "why is my total different from what I saw?" defect,
  which is worse than a blocked button that says why.
- Where the família has an available sibling, the same link the PDP offers
  appears beneath the line: `VER POLTRONA LINA EM BOUCLÉ CARVALHO →`.

This state is reachable only by a piece that changed **after** being added:
[`pagina-produto.md`](pagina-produto.md) §2.6 already replaces `COMPRAR` with the
esgotado block, so nothing esgotado can be added in the first place. That is why
the treatment here is one annotation and a disabled CTA rather than a surface of
its own.

---

## 7. Empty cart

```
CARRINHO

Seu carrinho está vazio.

VER TODAS AS PEÇAS →
```

Corpo for the sentence, annotation for the link, to `/produtos`. The full footer
stays.

This follows the pattern [`catalogo.md`](catalogo.md) §8 set for zero results:
**keep the navigation, state the fact in one line, fabricate nothing.** No
suggested pieces, no "você pode gostar", no recovery of a previous cart.

- **One link, not the four ambientes.** Rebuilding the mega menu in the page body
  duplicates the navbar on desktop.
- **Not zero links.** Correct on desktop, wrong on mobile, where the ambientes
  sit behind `MENU`.

---

## 8. The mock freight rule

[`produto.md`](produto.md) fixed where freight's inputs live and handed the
rule's regions, tiers and prazos to this ticket. Both the PDP's option table and
the cart's estimate read it.

**Cubed weight** — VTEX's rule, the greater of real and cubed:

```
pesoCubado = (embalagem.largura × embalagem.profundidade × embalagem.altura) / 6000
pesoFrete  = max(embalagem.pesoKg, pesoCubado) × embalagem.volumes
```

**Regions**, by CEP prefix (first two digits):

| Region | Prefixes | Base | Per kg | Padrão (dias úteis) |
| --- | --- | --- | --- | --- |
| Sudeste capitais | `01`–`09`, `20`–`23`, `30`–`31` | R$ 90 | R$ 5,50 | 6 |
| Sudeste interior | `10`–`19`, `24`–`29`, `32`–`39` | R$ 120 | R$ 6,50 | 9 |
| Sul | `80`–`99` | R$ 140 | R$ 7,00 | 11 |
| Centro-Oeste | `70`–`79` | R$ 170 | R$ 8,50 | 13 |
| Nordeste | `40`–`65` | R$ 190 | R$ 9,50 | 15 |
| Norte | `66`–`69`, `76`–`78` | R$ 240 | R$ 12,00 | 20 |

`custo = base + perKg × pesoFrete`, rounded to the nearest R$ 1,00.

`ENTREGA AGENDADA` is the padrão option **+ R$ 100,00**, same prazo, described as
`data à sua escolha`. Prefixes outside the table are *região não atendida* — the
error state, never a silent fallback.

`freteGratis` zeroes the **padrão** option for the matching region only; agendada
still charges its difference above the (now zero) base.

**Why the numbers matter.** A flat national fee would make the CEP widget
theatre; the spread above guarantees that a São Paulo CEP and a Belém CEP give
visibly different answers, which is the only thing the widget exists to prove.

---

## 9. Data

**No new fields on `Produto`.** The cart reads what
[`produto.md`](produto.md) already fixed.

Cart state is **client-side only** — the second piece of client state in the
system, and the source of the navbar counter it feeds
([`navbar.md`](navbar.md)):

```ts
type ItemCarrinho = {
  slug: string;          // the Produto — one per acabamento, so this is the key
  quantidade: number;    // >= 1; removal is explicit, never quantidade 0
  montagem: boolean;     // false when Produto.montagem.necessaria is false
};

type Carrinho = {
  itens: ItemCarrinho[]; // insertion order, preserved
  cep?: string;          // the session CEP, shared with PDP and checkout
};
```

- Adding a slug already present **increments** its quantidade rather than
  appending a second line.
- Everything else on screen is derived: price, à-vista, parcelamento, montagem
  price, prazo, freight estimate, group count.
- Persistence across reloads is a build decision, not a spec one; nothing here
  depends on it.

---

## 10. Accessibility

- The line list is a `<ul>`, each line an `<li>`. Not a table — the columns do
  not carry a shared meaning down the page.
- Quantity changes announce through an `aria-live="polite"` region naming the
  piece and its new quantidade.
- `REMOVER` names its piece: `aria-label="Remover Poltrona Lina em linho cru"`.
- The disabled CTA (§6) uses `aria-disabled` with its reason associated by
  `aria-describedby`, so the blockage is audible and not merely visible.
- Focus ring is the identity's: `outline: 2px solid var(--indigo);
  outline-offset: 3px` ([`marca.md`](marca.md)).
- Tab order: header → each line (nome → stepper → montagem → remover) → resumo →
  CTA → footer.

---

## 11. Constraints handed to other tickets

- **[Checkout](../../.wayfinder/tickets/011-checkout.md)** — arrives with the
  session CEP and a `Carrinho`; the freight **modality** choice is its to make,
  against §8's option list, and its sticky resumo should carry the same
  itemisation as §5 with freight now *inside* the total. The montagem attribute
  is not editable after the cart. The arrependimento sentence (§5.4) repeats on
  the confirmation surface.
- **[Imagery](../../.wayfinder/tickets/014-imagery.md)** — `principal` is now
  read by four surfaces (home strip, listing card, PDP, cart thumbnail); the
  smallest is 96px square, which sets the crop's lower bound.
- **[Motion](../../.wayfinder/tickets/017-motion.md)** — quantity and removal are
  the cart's only state changes. Removal without undo means the line's exit is
  the only place a transition would carry meaning.
- **[Error surfaces](../../.wayfinder/tickets/016-error-surfaces.md)** — the
  *região não atendida* CEP error (§8) is the second instance of the ink-only
  error treatment, after the PDP's.

---

## 12. Deliberate omissions

Considered and ruled out — recorded so they are not relitigated:

- **Cart drawer / mini-cart** — unavailable by [`navbar.md`](navbar.md) §7.
- **Coupon field.** There is no promotion in the model and `politicas` has no
  coupon; an input that always fails is worse than its absence.
- **Cross-sell / "complete seu ambiente".** Third refusal of fabricated
  suggestion, after [`pagina-produto.md`](pagina-produto.md)'s *quem viu também
  viu* and [`catalogo.md`](catalogo.md)'s zero-results surface. With no affinity
  data, any suggestion is invented.
- **Régua on this page** — §2, an authored absence.
- **Saved for later / favoritos** — no account in scope.
- **Freight folded into the cart total** — §5.2.
- **Visual delivery groups** — §4.4.
- **Undo on removal** — §4.2.
- **Numeric quantity field or select** — §4.2.
- **The frete option table in the cart** — the same choice made twice, once
  without an address.
