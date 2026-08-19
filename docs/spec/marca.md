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

Provisional, and deliberately thin: a 120ms colour transition on interactive
states, and nothing else. No scroll reveal, no page transition, no parallax.
`prefers-reduced-motion: reduce` is respected.

The full motion convention remains **Not yet specified** in the map — this
section only guarantees that no build session invents motion before that ticket
exists.

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
