# Brand direction — Canto Zen

Resolves ticket [Brand direction](../../.wayfinder/tickets/002-brand-direction.md).
Visual direction, not a brand kit: no logo system, no stationery, no offline
application. What is here is enough that no section decision has to be arbitrary.

This file is written in English prose; every string quoted as copy is the pt-BR
that ships, and domain terms stay pt-BR throughout — they are the glossary
([`CONTEXT.md`](../../CONTEXT.md)), not the prose.

---

## 1. Position

High-end atelier in a japandi register. Signed pieces, made to order, in-house
marcenaria. Reverence for the object: plenty of space, material in the
foreground, the designer's name always present.

**Quiet, with a single bold gesture.** Everything is disciplined and calm; the
entire personality lives in one device (§2). That is what keeps the 15 routes
coherent without turning into wallpaper.

### The tension this resolves

A high-end atelier normally hides price ("sob consulta"). Here it does **not**:
[Brazilian e-commerce UX conventions](../research/br-ecommerce-conventions.md)
already fixed that every price shows à-vista **and** parcelado, with a Pix
discount badge and CEP-quoted frete on the product page. None of that goes.

The reconciliation is one of **voice, not presence**: the commercial facts appear
in full, set in the annotation voice (§4) — small, tracked, tabular figures —
rather than shouted in red and yellow. Micasa and Artefacto do exactly this.
Discreet price, never absent price.

---

## 2. The gesture: a régua

**The cota is the signature.** A hairline with a tick at each end, carrying a
real figure in centimetres, runs along the bottom edge and the right edge of
every featured piece that is photographed.

This is chosen over an ornament because the cota is **ornament and data at
once**. The spec already owes the customer L × P × A — furniture is a category
where measurement decides the purchase. The brand's most memorable device is
therefore information the buyer needs anyway. It never becomes decorative
because it never stops being true.

**Where the régua may appear**

- Around any featured piece — product, coleção, ambiente.
- Opening a section, when there is a real figure to state (number of pieces,
  prazo, collection year).
- In scale comparison within the catalogue.

**Where the régua may not appear**

- Without a real figure. An empty régua is ornament and is prohibited.
- More than twice per screen. Two cotas per piece (width, height) is the ceiling.
- In running text, forms, checkout or the footer.

**Anatomy** — 1px hairline in `--ink`; 13px perpendicular ticks at the ends;
label centred in the annotation voice, with a breath of the page background
behind it to cut the hairline. A vertical cota sits **outside** the image, to the
right, with its label rotated 90°.

Corollary: ordinal numbering (01 / 02 / 03) stays **out** of the system. Nothing
in the storefront is a sequence the reader must follow in order.

---

## 3. Palette

A light, warm identity. **No dark mode** — already settled in the map.

| Token | Name | Hex | Use |
|---|---|---|---|
| `--ink` | Tinta | `#1B1A18` | Text, hairline, régua stroke |
| `--plaster` | Reboco | `#F5F4F0` | Page background |
| `--kozo` | Kozo | `#EAE7E0` | Recessed panel, rail, band |
| `--oak` | Carvalho | `#C6B49A` | Wood, warmth, subtle hover |
| `--hairline` | Fio | `#D3CFC7` | Divider, field border |
| `--indigo` | Índigo | `#223244` | **Sole chromatic accent** |
| `--muted` | Apagado | `#7A756C` | Secondary text, caption |

**Índigo is the only accent** and it is rationed: interactive state (focus, CTA
hover, active link) and the Pix discount badge. Nothing else. If índigo appears
three times on one screen, two of them are wrong.

**Deliberately out:**

- **Terracotta.** It is the category's default accent and the most recognisable
  cliché of AI-generated design. Índigo takes that place — cool against the wood,
  and it reads as both Japanese indigo dye and Scandinavian neutral.
- **Cream `#F4F1EA` and neighbours.** Reboco is cooler and greyer on purpose.
- **E-commerce green, red and yellow.** Success and error states resolve in ink +
  índigo + typographic weight, not in traffic lights.

---

## 4. Typography

Two families. A third would be one accessory too many.

**Zen Old Mincho** — display. A **low-contrast** Mincho: it has the japandi calm
without being the very-high-contrast Playfair-type serif the whole category uses.
It covers `latin-ext`, so pt-BR accents are complete.

> Only for: piece name, collection title, editorial title, a single feature line
> per page. Never for interface, data, price or labels.

**Schibsted Grotesk** — body, interface and data. A neutral grotesque of
Scandinavian origin, aligned with the register and off the Inter/Geist axis.
**Tabular figures enabled everywhere** — price, measurement, parcela, CEP, prazo.

### Scale

| Role | Family | Size / leading | Tracking |
|---|---|---|---|
| Display XL — featured piece name | Mincho 400 | `clamp(2.1rem, 3.6vw, 3.25rem)` / 1.08 | `0.005em` |
| Display L — section title | Mincho 400 | `1.75rem` / 1.2 | `0.005em` |
| Display M — editorial feature | Mincho 400 | `1.35rem` / 1.45 | `0.005em` |
| Price | Grotesk 400 tab. | `1.75rem` / 1.1 | `-0.01em` |
| Body | Grotesk 400 | `1rem` / 1.55 | `0` |
| Body S — secondary, parcela | Grotesk 400 | `0.875rem` / 1.5 | `0` |
| **Annotation** | Grotesk 500 tab. | `0.6875rem` / 1.4 | `0.16em`, uppercase |
| CTA | Grotesk 500 | `0.75rem` | `0.18em`, uppercase |

**The annotation voice is the system's workhorse.** It carries labels,
breadcrumbs, navigation, measurements, cota labels, photo captions and metadata.
It is what lets the price be discreet without disappearing. Running-text measure:
60–70 characters; never more than 34ch in a side column.

`<html lang="pt-BR">` — the current boilerplate ships `lang="en"` and is replaced.

---

## 5. Space and density

**Low** density, and the emptiness is intentional and asymmetric — it is not
leftover margin, it is the alcove (`tokonoma`) that gives the object presence.

- Maximum container measure: `1360px`.
- Outer gutter: `clamp(1.5rem, 4vw, 4.5rem)`.
- Vertical rhythm: `0.5 / 0.75 / 1 / 1.5 / 2.75 / 4 / 7rem`.
- Breathing room between major sections: `7rem`; never less than `4rem`.
- 12-column grid. **A text block is never centred under the image**: the default
  pair is image on 7 columns and text on 5, with the large right-hand gutter kept
  empty.

---

## 6. Stroke and corner

- **Corner radius: 0** on everything that is interface — button, field, panel,
  card. The system's only curve is the furniture's own, in the photograph.
- **No shadow in UI.** The only shadow that exists is the one raking light casts
  in the photo. Elevation resolves through tone (`--kozo` under `--plaster`) and
  through hairlines.
- **A 1px hairline** is the universal divider, in `--hairline`. `--ink` only when
  the stroke is a régua (§2) or closes a total.
- Primary button: uppercase, `0.18em` tracking, 1px border in `--ink`,
  transparent background; on hover it inverts to an `--ink` background.
- Visible focus is mandatory: `outline: 2px solid var(--indigo); outline-offset: 3px`.

---

## 7. Photography

One light, and it admits no exception: **raking late-afternoon light, raw plaster
background, hard long shadow.**

- The cast shadow is part of the frame, never cropped out.
- Frame in the piece's real proportion — the photo and the régua tell the same
  truth. The frame is **derived from `medidas`**, not chosen
  ([`imagens.md`](imagens.md) §3).
- **No person appears in any photograph in the store**, and no object implying
  one just left — no cup, no open book, no throw folded back, no plants, no
  fruit. This has no exception anywhere.

**Two genres**, and only two ([`imagens.md`](imagens.md) §1):

- **Retrato** — the piece **alone**, no styling. The product is not staged; it is
  observed. The store's default.
- **Ambiente** — a furnished, empty room under the same light on the same
  plaster. Consumed by `ambientada` shots, the home's ambiente fields, coleção
  and Inspirações.

> **Corrected by [`imagens.md`](imagens.md) §1.** This section originally stated
> one rule with a single exception, naming Inspirações. That was already false
> when written: `papel: 'ambientada'` ([`produto.md`](produto.md)) and
> `Ambiente.imagem` ([`home.md`](home.md) §8) are both non-solo images outside
> Inspirações. The rule is restated as two genres; what remains unique to
> Inspirações is the **composition** — three photographs sequenced into an
> argument — not the genre.

The full detailing — ratios, crops per surface, `alt` treatment, loading,
failure, sourcing — is [`imagens.md`](imagens.md).

---

## 8. Price and data

- The à-vista Pix figure set in Price (§4), with the discount as a superscript in
  `--indigo`.
- Parcelamento immediately below, in Body S `--muted`: `ou {total} em {N}x de {v} sem juros`.
- Measurements always in the annotation voice, always `L {n} × P {n} × A {n} cm`,
  with a multiplication `×` — never the letter `x`.
- Every figure in a data context uses `font-variant-numeric: tabular-nums`.

---

## 9. Motion

Resolves ticket [Motion & transition conventions](../../.wayfinder/tickets/017-motion.md).
This section replaces the provisional §9 in full. It is **closed** — see §9.9.

### 9.1 What motion is permitted to mean

**Motion may confirm that something changed, or is changing. It may never
announce arrival.**

That is the whole rule, and everything below is its application. Feedback is
permitted because it is information — the store already reasons this way about
ornament (§2: an empty régua is prohibited because it states no figure). Entry
animation, scroll reveal, parallax and page transition are all *announcements of
arrival*; they state nothing that was not already on the screen, so they are
ornament in the time axis and are refused everywhere, without exception.

**The régua does not animate.** This is the one place a motion gesture could
carry brand meaning, and it is refused on §2's own test. The régua is permitted
to exist because it is ornament and data at once — it never stops being true. A
drawing or counting animation states no figure while it runs; it is the empty
régua §2 already prohibits, moved into time. The signature is the hairline, the
ticks and the number. It is not the arrival of them.

**"No motion at all" was considered and rejected.** It is a coherent position and
cheaper to hold, but a 12-item catalogue grid whose cards give no pointer
feedback reads as dead rather than as calm, and [`erros.md`](erros.md) §4.2
established that the loading dim is *state*, not decoration — removing it would
remove information, not restraint.

### 9.2 The closed list

Two entries. There is no third.

| # | Motion | Property | Duration | Where |
|---|---|---|---|---|
| 1 | Interactive state on **pointer** | colour (§9.3) | `--motion-duration` | Hover on links, CTAs, card names, filter items, `REMOVER` |
| 2 | **Stale content dim** | `opacity` to `0.45` | `--motion-duration` | The region being replaced, per [`erros.md`](erros.md) §4.2 |

Entry 2 is adopted from [`erros.md`](erros.md) §4.2 exactly as written, including
its `120ms` pre-delay, its scoping to the replaced region only, its refusal to
dim the chrome, and its `aria-busy` + `role="status"` obligations. That spec
named itself an exception to the provisional §9 and handed it here to adopt
rather than re-open; it is adopted.

**Everything else in the store is a cut.** A cut is not a degraded transition —
it is the system's default, and it needs no justification anywhere.

### 9.3 Property allowlist

A transition may animate **only** these properties:

`color` · `background-color` · `border-color` · `text-decoration-color` ·
`outline-color` · `opacity`

Closed. In particular, and by name: **no `transform`** (of any kind — translate,
scale, rotate), no `width`/`height`/`max-height` collapse, no `filter`, no
`blur`, no `box-shadow` (§6 has none to animate), no `background-position`.

`transform` is refused because it is **displacement** — it moves an object
through space. A store built on a fixed frame, a real proportion derived from
`medidas` (§7) and a cast shadow that is part of the photograph cannot afford
things that slide. §6 also has no elevation vocabulary for a transform to
express: there is no shadow and no radius for a lift to read against.

The allowlist exists so that a future spec can test an idea against §9 in one
read, instead of arguing from register and reaching a different answer each time.

### 9.4 Tokens

```css
--motion-duration: 120ms;
--motion-ease: linear;
```

One of each. Page specs name these; they never write a number.

**No duration scale.** There is no `fast`/`slow`, because there are two motions
and both are `120ms`. An unused token is an invitation to find a use for it,
which is the drift this section exists to prevent.

**`linear` is a choice, not a default.** At `120ms`, on `color` and `opacity`
only, an easing curve sits below the perception threshold — a `cubic-bezier()`
would be an unfalsifiable claim to a motion personality this store does not have.
`ease-out` is worse than neutral: it *means* decelerating into place, which is
arrival, which §9.1 refuses as a meaning. `linear` states no curve.

### 9.5 The transition follows the pointer, never the keyboard

- **Hover** — `--motion-duration`. A pointer's dwell is slow and continuous, and
  the ramp suits it.
- **Focus** — always a **cut**. The `--indigo` ring (§6) appears and disappears
  instantly. A ramp makes the ring lag the Tab press, and on a fast pass down a
  grid the rings smear, degrading the one thing the ring exists to state: *you
  are here*.
- **`:active` / press** — always a **cut**. Same reason: it is a discrete
  acknowledgement of an input, not a continuous state.

### 9.6 `prefers-reduced-motion: reduce`

One global rule, and it covers every entry in §9.2 — present and future:

> **The end state is kept. The interpolation is dropped.** `--motion-duration`
> collapses to `0`. Nothing is removed, nothing is substituted, no motion is
> replaced by a different effect.

So the dim still dims to `0.45`, arriving as a cut ([`erros.md`](erros.md) §4.2,
which is now an *instance* of this rule rather than its own branch); hover still
changes colour, instantly. [`checkout.md`](checkout.md) §2.2's claim that it
needs no branch is correct and stands — it has no interpolation to drop.

A global rule also means a future entry cannot forget its branch: it inherits
one. And note what it implies — with a two-property allowlist and no
displacement anywhere, nothing in this store could trigger a vestibular
response. `reduce` is honoured here as a **preference for stillness**, not as a
safety mitigation, and the reduced-motion store is very nearly the default store.

### 9.7 A delay is not motion

§9 governs **interpolation** — a property changing over time. A delay moves
nothing, so it has no easing, no reduced-motion branch, and no token here.

Named so nobody has to look for them in §9:

- [`checkout.md`](checkout.md) §2.2 — the **1500ms** `processando` beat. A
  checkout constant. Its `--plaster/95` wash is a **state**, and it **arrives as
  a cut**: a fade would dramatise the exact moment that surface exists to admit
  was never real work.
- [`erros.md`](erros.md) §4.2 — the **120ms** pre-delay before the dim begins, so
  a prefetched navigation never flickers. Part of entry 2's mechanics, not a
  motion of its own.

### 9.8 Standing refusals

Ten specs held the provisional §9 honestly and refused motion individually. Those
refusals are ratified here as system rules, stated once, so no future surface has
to re-argue them:

- **No scroll reveal, section entry animation or parallax** — anywhere.
  ([`home.md`](home.md), [`inspiracoes.md`](inspiracoes.md),
  [`catalogo.md`](catalogo.md), [`imagens.md`](imagens.md))
- **No page or route transition.** Navigation is a cut; entry 2's dim is the only
  thing that marks a pending one.
- **The photograph gains nothing on hover** — no image swap to the `ambientada`
  shot, no zoom, no lightbox, no ground shift, no elevation. The frame includes
  the cast shadow as content and is derived from real `medidas` (§7): any hover
  state **edits the photograph**, and the photograph is the piece's truth. The
  card is not inert — the name goes to `--indigo` and the whole card is the link.
  ([`imagens.md`](imagens.md) §6, [`catalogo.md`](catalogo.md) §6,
  [`pagina-produto.md`](pagina-produto.md))
- **No fade-in, blur-up, LQIP, skeleton, shimmer or spinner** on image or content
  load. ([`imagens.md`](imagens.md) §6, [`erros.md`](erros.md) §4.3)
- **No navbar height change, background swap or hide-on-scroll.**
  ([`navbar.md`](navbar.md) §8)
- **No filter-panel animation, no transition between grid pages, no slider
  drag.** ([`catalogo.md`](catalogo.md) §6–7)
- **The cart line's removal is a cut.** [`carrinho.md`](carrinho.md) called this
  the only place a transition would carry meaning — there is no undo, so removal
  is irreversible. It is still a cut, for a specific reason: an opacity fade-out
  would **invert** entry 2's meaning. `0.45` in this store says *stale, new
  content is coming*; a row fading to `0` says nothing is coming. The same
  property would carry opposite meanings on adjacent surfaces, which is how a
  small vocabulary rots. A height collapse is worse — it displaces every row
  below, in the one flow where the reader is checking figures. The
  acknowledgement the reader needs is not the row's departure but that the
  **totals and `CARRINHO (n)` changed**, and both do, instantly.
- **Replacing the PDP's CTA with the confirmation line**
  ([`pagina-produto.md`](pagina-produto.md) §2.6) is a content swap. It gains no
  transition.

### 9.9 Amending §9

**This section is closed.** The list in §9.2 has two entries and the allowlist in
§9.3 is exhaustive. A spec that needs a third entry does not get it by
reinterpreting the wording — it **amends §9**, and an amendment must:

1. **Name what it adds**, as a new numbered entry in §9.2.
2. **Say why no existing entry covers it**, without stretching an existing term
   to fit.
3. **Land here**, in §9 — not only in the spec that wanted it.

[`erros.md`](erros.md) §4.2 is the worked example, and it did all three: it
declined to smuggle `opacity` in under the word "colour", said plainly that it
was widening §9 by exactly one entry, and handed it over to be adopted. Do that.

This protocol is the durable half of this ticket. The reason it had so little
left to decide is that ten sessions held a provisional line by discipline — and
discipline does not survive a build phase running several sessions in parallel.
The protocol is what makes it structure instead of a lucky streak.

---

## How this was decided

Three directions were built and compared side by side in `/prototype/marca` —
**A régua**, **O canto** (the hairline corner + raking light) and **O caderno**
(the spec sheet as hero, the photo demoted to a thumbnail). All three already
shared position, register and volume; they disagreed only about where to spend
the bold gesture.

**A régua won**: it is the only one whose signature carries information, and
therefore the only one that survives 15 routes without becoming ornament. O
Caderno was the most distinctive, but demoting photography in a furniture store
fights the category. O Canto was the safest and the least memorable.

The complete prototype is captured on branch `prototype/brand-direction`
(commit `ff44fd7`) and must **not** be promoted — it was written under prototype
constraints.
