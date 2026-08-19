# Navbar — navigation bar

Resolves ticket [Navbar](../../.wayfinder/tickets/005-navbar.md).
Applies to all 15 routes in [`rotas.md`](rotas.md). Visual vocabulary lives in
[`marca.md`](marca.md); every measurement, colour and typographic voice quoted
here comes from there and is not redefined.

This file is written in English prose; every string quoted as copy is the pt-BR
that ships, and domain terms stay pt-BR throughout.

---

## 1. Purpose

The bar has **one** job: keep the four ambientes one gesture away from anywhere
in the store. It does not sell, does not advertise and does not search. It is the
room-primary spine of [`rotas.md`](rotas.md) made permanent.

Corollary: everything that does not serve that job was refused — search, icons,
mini-cart, wishlist counter, language switcher, support phone number.

---

## 2. Structure

Two stacked bands. Only the second one is sticky.

```
┌──────────────────────────────────────────────────────────────┐
│  FRETE CALCULADO POR CEP · ATÉ 10X SEM JUROS · …             │  notice band (§3)
├──────────────────────────────────────────────────────────────┤
│  Canto Zen    SALA  QUARTO  COZINHA  ESCRITÓRIO  INSPIRAÇÕES │  bar (§5)
│                                            CARRINHO (2)      │
└──────────────────────────────────────────────────────────────┘
                    ↓ opens
┌──────────────────────────────────────────────────────────────┐
│              Sofás                                           │  panel (§6)
│              Poltronas                                       │
│              …                                               │
│              ───────────────                                 │
│              VER TUDO EM SALA                                │
└──────────────────────────────────────────────────────────────┘
```

**Bar geometry**

| Property | Value |
|---|---|
| Height | `72px`, **constant** — never changes, not even when it sticks |
| Container | `max-width: 1360px`, gutter `clamp(1.5rem, 4vw, 4.5rem)` |
| Background | `--plaster` |
| Bottom border | 1px hairline in `--hairline` |
| Shadow | none, in any state (`marca.md` §6) |
| Radius | 0 |

**Alignment — left-grouped, asymmetric.** Wordmark, a `3.5rem` breath, then the
navigation items with `2rem` between them. The cart is pushed alone to the right.
The right gutter is deliberately left empty — the same rule as the image/text
pair in `marca.md` §5.

Centred navigation was refused: symmetry contradicts the brand's intentional
emptiness. Two lines (wordmark centred above the navigation) too — it fights the
sticky bar over height.

---

## 3. Notice band

It exists, and it is **a single static line**. It does not rotate, is not
dismissible, and is not sticky: it scrolls away with the page and does not come
back.

- Background `--kozo`, text `--muted`, 1px hairline in `--hairline` underneath.
- **Annotation** voice (`marca.md` §4).
- Vertical padding `0.625rem`.

**Copy direction** — reassurance, never promotion. Three short facts separated by
`·`, in this order of priority:

> `FRETE CALCULADO POR CEP · ATÉ 10X SEM JUROS · PEÇAS SOB ENCOMENDA`

Prohibited: countdowns, discount percentages, "últimas unidades", any imperative
verb. Message rotation is out because it is motion, and `marca.md` §9 does not
authorise it.

---

## 4. Wordmark

`Canto Zen`, sentence case with initial capitals, in **Zen Old Mincho** at
`1.35rem`, `--ink`, tracking `0.005em`. Links to `/`.

> **Registered exception.** `marca.md` §4 restricts Mincho to piece names,
> collection titles, editorial titles and a single feature line — *"never for
> interface"*. The wordmark is the **only** exception to that rule in the entire
> storefront, and it does not generalise: no other chrome element uses Mincho.
>
> The reason: with zero icons in the bar, setting the wordmark in the annotation
> voice would make it typographically identical to the "Inspirações" label beside
> it — the brand would disappear inside its own navigation.

There is no symbol, monogram or lockup. The brand has no logo system, and the
bold gesture is already spent on the régua.

---

## 5. Navigation items

Five, in this order, all in the annotation voice:

| Item | Destination | Opens panel |
|---|---|---|
| Sala | `/sala` | yes |
| Quarto | `/quarto` | yes |
| Cozinha | `/cozinha` | yes |
| Escritório | `/escritorio` | yes |
| Inspirações | `/inspiracoes` | no |

**Deliberately out of the bar:**

- **All products** (`/produtos`) — it lives inside the panel as "Ver tudo em
  {Ambiente}" and in the footer. A permanent slot for it would weaken the
  ambientes.
- **Sobre and Contato** — footer and home. They are not recurring navigation
  destinations.
- **Coleções** — they have no index page (`rotas.md`, *Deliberate omissions*), so
  they get no slot.

---

## 6. Ambiente panel

**Shape: a column.** The panel is a narrow column aligned under the navigation
group — not a full-bleed surface.

| Property | Value |
|---|---|
| Content width | `max-width: 260px`, single column |
| Alignment | under the navigation group, not under the page edge |
| Background | `--plaster` — the same as the bar, continuous |
| Bottom border | 1px hairline in `--hairline` |
| Vertical padding | `2rem` |
| Shadow, radius | none, 0 |

**Content**, top to bottom:

1. That ambiente's curated tipos, in the exact order of the *Type taxonomy* table
   in [`rotas.md`](rotas.md). Body S (`0.875rem`), `--ink`, `0.375rem` vertical
   padding each. Hover takes the colour to `--indigo`.
2. A 1px hairline in `--hairline`, with `1.25rem` of breathing room above and
   below.
3. **Ver tudo em {Ambiente}** — annotation voice, underlined with a `--hairline`
   rule, pointing at the ambiente landing.

Nothing else goes in: no image, no featured piece, no collection, no editorial
text, no "novidades".

### Why this shape

Compared side by side in the prototype (§12):

- **Panel with a featured piece** — full-bleed, tipos in two columns and a piece
  with a régua on the right. Refused: repeating the régua above *every* page
  spends the gesture `marca.md` §2 rations to two per screen. The brand's
  signature becomes wallpaper exactly where it is not information the buyer asked
  for.
- **Index** — a single panel with all four ambientes and every tipo at once, the
  hovered ambiente in full ink and the others dimmed. Refused: dimming
  three-quarters of the panel is an effect, and the density of 20 simultaneous
  tipos contradicts the low density of `marca.md` §5.

The column won because it is the only one that adds nothing to what the question
asked for: revealing that ambiente's tipos.

---

## 7. Cart

Text, no icon: **`CARRINHO`**, plus `(n)` when `n > 0`.

- Annotation voice, `--ink`, tabular figures.
- The parenthesis disappears entirely on an empty cart — never `(0)`.
- No badge, no circle, no colour. Red does not exist in the palette, and an
  índigo badge would spend the sole accent on a count.
- **Navigates to `/carrinho`.** It does not open a drawer, does not open a
  preview, and has no hover state beyond the colour transition.

> **Constraint handed to ticket [Cart sections](../../.wayfinder/tickets/010-cart.md):**
> the navbar affordance is a **link**. If that ticket wants a drawer, it is an
> addition triggered by *add to cart*, not by this link. The link keeps going to
> the page in every scenario.

---

## 8. Sticky behaviour

The notice band scrolls away. The bar then **sticks to the top**, at the same
`72px` height it had before.

- No shrinking, no background swap, no shadow gained, no hide-on-scroll-down.
- Opaque `--plaster` — never translucent or blurred.
- The bottom hairline is what separates the bar from the content passing beneath.

Chosen this way because any height change on scroll is motion, and motion belongs
to ticket [Motion & transition conventions](../../.wayfinder/tickets/017-motion.md).
This specification leaves nothing for that ticket to undo.

---

## 9. Active state

The current route's ambiente is marked with a **1px `--ink` hairline under the
label**, and the label goes to full `--ink`. The others stay in `--muted`.

**Índigo is not used here**, even though `marca.md` §3 lists "active link" among
its uses: on a product page the Pix badge and the focus ring already consume two
appearances, and a third índigo would violate the rule of three. The hairline
reuses vocabulary the brand already owns.

Application rules:

| Route | Marked item |
|---|---|
| `/sala`, `/sala/sofas` | Sala |
| `/inspiracoes`, `/inspiracoes/[slug]` | Inspirações |
| `/produtos/[slug]` | **none** — the breadcrumb already states the primary ambiente |
| `/produtos`, `/carrinho`, `/checkout`, institutional pages | none |

**Open** state ≠ **active** state: an open panel takes its label to full `--ink`
without drawing the hairline. An ambiente can be open and active at the same time.

---

## 10. Interaction and accessibility

- **The label is a link.** With a pointer, hover opens the panel after a `120ms`
  intent delay; a click navigates to the ambiente landing.
- **Touch and keyboard** have no hover: the first interaction opens the panel, and
  navigation happens through "Ver tudo em {Ambiente}" inside it.
- **One panel at a time.** Opening one closes the other.
- **Closing**: `Escape` closes and returns focus to the label that opened it;
  leaving with the pointer closes after `180ms`; scrolling the page closes
  immediately.
- `aria-expanded` on the label; the panel is labelled by the ambiente that opened
  it.
- **Visible focus is mandatory**: `outline: 2px solid var(--indigo); outline-offset: 3px`,
  per `marca.md` §6. This is the bar's only índigo.
- Tab order: wordmark → ambientes → Inspirações → cart. Panel content enters the
  order immediately after its label, when open.
- The `120ms` colour transition on interactive states is the only animation;
  nothing in the bar animates geometry, opacity or position.

---

## 11. Mobile

Below `768px`:

- The bar keeps `72px`, the wordmark on the left and **`MENU` on the right, as a
  word in the annotation voice — not a hamburger icon.** The zero-icon rule holds
  at every breakpoint.
- **`CARRINHO (n)` stays in the bar**, next to `MENU`. It is not hidden inside the
  panel: it is the bar's only commercial affordance, and it would disappear at the
  exact moment the screen gets smaller.
- `MENU` opens a **full-screen** panel in `--plaster`, with no translucent
  overlay.
- Inside it: the four ambientes as an **accordion** — tapping the name reveals
  that ambiente's curated tipos; tapping "Ver tudo em {Ambiente}" navigates.
  Inspirações is a flat link.
- One accordion open at a time. `MENU` becomes `FECHAR` while the panel is open.
- The panel's footer repeats Sobre, Contato and the policies — on mobile the
  footer is too far away to be the only path to them.

---

## 12. Search — a deliberate absence

**There is no search in the navbar**, and therefore no results surface anywhere in
the storefront.

Reason: the catalogue is four ambientes with 4 to 6 curated tipos each — roughly
20 listing pages — and the room-primary navigation of [`rotas.md`](rotas.md) was
designed as *the* path. A search field signals a utilitarian store and fights the
atelier register; and a concept store has no real corpus that would make relevance
meaningful.

The cost is acknowledged: someone arriving knowing "poltrona" has to go through
Sala.

Recorded consequences:

- The `?q=` that [`rotas.md`](rotas.md) reserved on `/produtos` is **unused**.
- The results surface (empty state, query echo, relevance signalling) left the map
  as out of scope.

---

## 13. Required data

The bar is static except for two values.

| Data | Source | Use |
|---|---|---|
| `ambientes[]` | the `Ambiente` entity in [`produto.md`](produto.md) — `slug`, `label`, `tipos[]` | bar labels and each panel's content |
| `tipos[]` per ambiente | `Ambiente.tipos[]` (curated, not inferred from the catalogue) | panel list, in the authored order |
| cart count | cart state | `(n)`, omitted when `0` |
| current route | router | active-state hairline (§9) |
| band copy | store constant | §3 |

None of these requires a request: the taxonomy is authored and can be rendered on
the server. Only the cart count is client state.

---

## 14. Prototype

Three panel shapes were built and compared at `/prototype/navbar?variant=`,
captured on branch `prototype/navbar`. They must **not** be promoted — they were
written under prototype constraints (no tests, no error handling, mocked data).
The validated decision is this document.
