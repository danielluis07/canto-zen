---
name: Canto Zen
description: A japandi furniture atelier where measurement is the ornament.
colors:
  ink: "#1b1a18"
  plaster: "#fcfcfb"
  kozo: "#f1f0ec"
  oak: "#c6b49a"
  hairline: "#deddd8"
  indigo: "#223244"
  muted: "#6b675f"
typography:
  display-xl:
    fontFamily: "var(--font-zen-old-mincho), Georgia, serif"
    fontSize: "clamp(2.1rem, 3.6vw, 3.25rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "0.005em"
  display-l:
    fontFamily: "var(--font-zen-old-mincho), Georgia, serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "0.005em"
  display-m:
    fontFamily: "var(--font-zen-old-mincho), Georgia, serif"
    fontSize: "1.35rem"
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: "0.005em"
  price:
    fontFamily: "var(--font-schibsted-grotesk), system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "tabular-nums"
  body:
    fontFamily: "var(--font-schibsted-grotesk), system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "0"
  body-s:
    fontFamily: "var(--font-schibsted-grotesk), system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0"
    fontFeature: "tabular-nums"
  annotation:
    fontFamily: "var(--font-schibsted-grotesk), system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.16em"
    fontFeature: "tabular-nums"
  cta:
    fontFamily: "var(--font-schibsted-grotesk), system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "0.18em"
rounded:
  none: "0"
spacing:
  rhythm-1: "0.5rem"
  rhythm-2: "0.75rem"
  rhythm-3: "1rem"
  rhythm-4: "1.5rem"
  rhythm-5: "2.75rem"
  rhythm-6: "4rem"
  rhythm-7: "7rem"
  gutter: "clamp(1.5rem, 4vw, 4.5rem)"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.cta}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.plaster}"
    typography: "{typography.cta}"
    rounded: "{rounded.none}"
    padding: "0.75rem 1.5rem"
  button-primary-disabled:
    backgroundColor: "transparent"
    textColor: "{colors.muted}"
    typography: "{typography.cta}"
    rounded: "{rounded.none}"
    padding: "1rem 1.5rem"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.cta}"
    rounded: "{rounded.none}"
    padding: "0"
  button-quiet-hover:
    backgroundColor: "transparent"
    textColor: "{colors.indigo}"
    typography: "{typography.cta}"
    rounded: "{rounded.none}"
    padding: "0"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-s}"
    rounded: "{rounded.none}"
    padding: "0.75rem"
  input-field-focus:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body-s}"
    rounded: "{rounded.none}"
    padding: "0.75rem"
  navbar:
    backgroundColor: "{colors.plaster}"
    textColor: "{colors.ink}"
    typography: "{typography.annotation}"
    rounded: "{rounded.none}"
    height: "72px"
  notice-band:
    backgroundColor: "{colors.kozo}"
    textColor: "{colors.muted}"
    typography: "{typography.annotation}"
    rounded: "{rounded.none}"
    padding: "0.625rem 0"
  image-field:
    backgroundColor: "{colors.kozo}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
---

# Design System: Canto Zen

## Overview

**Creative North Star: "The Measured Alcove"**

A tokonoma is an alcove built to hold one object, and the emptiness around the
object is the point of the alcove rather than the space left over after it. Canto
Zen is that alcove with a rule laid against it. Every surface gives a piece far
more room than it needs, and then states — in a hairline with a tick at each end
— exactly how much room it takes. Emptiness and measurement are the same gesture
here: the space asserts the object's presence, and the cota proves the space is
real. Neither works without the other, which is why the system can be this quiet
everywhere else and still be recognisable at a glance.

The density is deliberately low and the asymmetry is deliberate too. Text never
centres under an image; the default pairing puts the photograph on seven columns
and the words on five, and the large right-hand gutter is left empty on purpose.
Grounds are three near-whites a step apart — plaster, kozo, and a hairline
between them — so depth resolves in tone rather than in shadow. The only shadow
in the store is the one raking late-afternoon light casts inside a photograph,
and it is never cropped out. The identity's warmth lives in the oak and in the
photography, not in the paper.

Personality is spent once, in one place. Índigo is the sole chromatic accent and
it is rationed to interactive state and the à-vista discount; commercial facts —
price, parcelamento, prazo, frete, centimetres — appear in full but in the
annotation voice: small, tracked, uppercase, tabular. Discreet price, never
absent price. **The one confirmed visual rejection is the SaaS default:** rounded
cards, drop shadows, gradient buttons, an icon beside every label, pill badges.
The stylesheet enforces that refusal outside every layer, so no utility can
reintroduce a radius or a shadow.

**Key Characteristics:**

- Low density; the emptiness is the alcove, never leftover margin.
- Zero corner radius and zero UI shadow, enforced globally rather than by convention.
- One hairline weight draws every divider, every control and the régua itself.
- Two families only: Mincho signs, Grotesk speaks.
- One accent, rationed. One duration, one easing. No dark mode.
- Every figure in a data context is tabular; every measurement uses `×`, never `x`.

## Colors

Three near-white grounds a step apart, one warm wood, one accent held in
reserve, and a warm-grey ramp between ink and paper. Named in Portuguese in the
brand spec, and the names are the palette.

### Primary

- **Índigo** (`#223244`): the sole chromatic accent, and it is rationed. It
  carries interactive state — link hover, the focus ring, the active mark — and
  the à-vista Pix figure's discount superscript, and nothing else. It never fills
  a surface, never becomes a badge, and never marks the current nav item.

### Neutral

- **Tinta** (`#1b1a18`): all body text, every control border once focused or
  filled, the total that closes a sum, and the régua's stroke. The near-black is
  warm, not neutral — it belongs to the same ramp as the paper.
- **Reboco** (`#fcfcfb`): the page ground everywhere, and the breath behind a
  régua label that cuts the hairline. Cooled toward white in ADR 0001.
- **Kozo** (`#f1f0ec`): the recessed step — image fields, the notice band, rails
  and panels. This is how the system builds depth, one tone down instead of one
  shadow up.
- **Carvalho** (`#c6b49a`): the wood. Warmth and subtle hover, never a ground.
  It is the one value ADR 0001 did **not** cool, because it is material rather
  than paper, and after the cooling it and the photography carry the identity's
  warmth alone.
- **Fio** (`#deddd8`): the universal 1px divider and panel edge. It measures
  1.32:1 on plaster, so it is decorative structure and nothing else.
- **Apagado** (`#6b675f`): secondary text, captions, and the resting border of
  every control — 5.11:1 on plaster and 4.56:1 on kozo, both clear of the 3:1
  boundary floor.

### Named Rules

**The Rationed Accent Rule.** Índigo appears only where the reader can act or has
just acted, plus the discount superscript. If a screen shows índigo in more than
two places, one of them is decoration and must come out.

**The Fio Is Not a Border Rule.** `--hairline` divides; it never identifies a
control. A field, stepper or selectable row rests on `--muted` and moves to
`--ink` when focused or filled — a two-step inside one warm-grey ramp, never a
jump from near-invisible to black.

**The No Dark Mode Rule.** The identity is light and warm and that is settled.
There is no `prefers-color-scheme` branch and no second palette to keep in sync.

## Typography

**Display Font:** Zen Old Mincho (with Georgia, serif)
**Body Font:** Schibsted Grotesk (with system-ui, sans-serif)

**Character:** A Japanese old-style serif signs the page and a Scandinavian
grotesk does the talking — the japandi pairing stated in type rather than
described. Mincho appears rarely and only at a size worth the arrival; Grotesk
carries body, interface and every figure, at exactly two weights. Both are
self-hosted `latin` subsets, and the Grotesk's variable range is declared as
`400 500` so a surface cannot reach for a weight the scale never set.

### Hierarchy

- **Display XL** (Mincho 400, `clamp(2.1rem, 3.6vw, 3.25rem)`, 1.08): one feature
  line per page. The store's loudest voice, used once.
- **Display L** (Mincho 400, `1.75rem`, 1.2): section and editorial titles.
- **Display M** (Mincho 400, `1.35rem`, 1.45): piece names, collection titles,
  and the wordmark — the smallest place Mincho is allowed.
- **Price** (Grotesk 400, `1.75rem`, 1.1, `-0.01em`, tabular): the à-vista figure
  on the hero and the product page, and nowhere else. On a listing card the price
  drops to Body so the Price role stays reserved.
- **Body** (Grotesk 400, `1rem`, 1.55): running text, capped at 68ch.
- **Body S** (Grotesk 400, `0.875rem`, 1.5, tabular): parcelamento, field values,
  and every error message. Tabular because it is a data voice.
- **Annotation** (Grotesk 500, `0.6875rem`, 1.4, `0.16em`, uppercase, tabular):
  the system's workhorse — labels, breadcrumbs, captions, measurements, cota
  labels, the notice band, and every figure in a data context.
- **CTA** (Grotesk 500, `0.75rem`, 1, `0.18em`, uppercase): buttons and link
  actions only.

### Named Rules

**The Mincho Never Touches Interface Rule.** The display face reaches a surface
only through a `.t-display-*` role, and the stylesheet publishes no font utility
that would hand it to anything else. Its four permitted jobs are piece name,
collection title, editorial title and one feature line per page. The single
exception is the wordmark, which earns it by adjacency: an annotation-voice
wordmark would be typographically identical to the nav labels beside it.

**The Tabular Figure Rule.** Any number in a data context sets
`font-variant-numeric: tabular-nums`. Measurements always read
`L {n} × P {n} × A {n} cm` with a multiplication sign — never the letter `x`.

**The Pick a Voice, Not a Size Rule.** Surfaces apply a role class; they do not
type a size, a leading or a tracking. Eight roles cover the store.

## Layout

A 12-column grid inside a `1360px` maximum measure, with an outer gutter of
`clamp(1.5rem, 4vw, 4.5rem)`. Reading text is capped at `68ch` and the standing
aside at `34ch`.

The vertical rhythm is a seven-step scale — `0.5 / 0.75 / 1 / 1.5 / 2.75 / 4 /
7rem` — and major sections breathe at `7rem`, never less than `4rem`. Steps are
consumed as named tokens (`rhythm-5`, `gutter`), never as raw values.

**Asymmetry is the default, not a variation.** The recurring pair is image on
seven columns and text on five, with the large right-hand gutter left empty; the
home's ambientes band splits 7/5 the same way. A text block is never centred
under its image.

Responsive behaviour is a single hinge at `lg` (1024px). Below it, everything is
one column in source order; above it, the 12-column relationships engage. Card
grids are the exception: they run two columns from the smallest screen — the
listing grid going to three at `lg`, the home's featured strip and its three
shorter ambiente bands to their 12-column places. There is no tablet-specific
layer.

The chrome is a constant `72px` bar that never shrinks, never gains a shadow and
never swaps its background. Two stacked bands, only the second sticks: the
`<header>` is offset upward by exactly the notice band's height, so the band
scrolls away and the bar lands at the top at the same height it always had.

### Named Rules

**The Empty Right Gutter Rule.** When an image and its text pair, the remaining
columns stay empty. Filling them with a third element is how a composed page
becomes a dashboard.

**The Ragged Grid Rule.** Listing cards frame each piece in its own real
proportion (3:2, 1:1 or 4:5, derived from `medidas`), so rows are deliberately
uneven. The box reserves the ratio before anything loads, holding a flat kozo
field, because in a ragged grid a shifting row is indistinguishable from a bug.

## Elevation & Depth

**There is no elevation.** The store ships zero UI shadows, and the rule sits
outside every CSS layer — `*, ::before, ::after { box-shadow: none }` — so a
`shadow-*` utility cannot reintroduce one. The only shadow that exists anywhere
is the hard, long one raking late-afternoon light casts inside a photograph, and
it is part of the frame and never cropped out.

Depth resolves two other ways. **Tonally:** kozo recedes one step under plaster,
which is how image fields, panels, rails and the notice band read as set back.
**Structurally:** a 1px fio hairline separates without lifting. Neither mechanism
ever stacks — there is no second recessed tone under kozo, and two adjacent
hairlines are a bug.

### Named Rules

**The One Shadow Rule.** The only shadow in the store is in the photograph. If a
shadow appears in the interface, it is a defect, not a decision.

**The Tone Goes One Step Rule.** Recession is plaster → kozo and stops. A panel
inside a panel does not go a tone darker; it gets a hairline or nothing.

## Shapes

**Corner radius is 0 on everything that is interface** — button, field, panel,
card, image field, menu. Like the shadow rule, this is enforced unlayered so no
utility can override it. The system's only curve is the furniture's own, inside
the photograph.

There is exactly one stroke weight: `1px`. It draws dividers (in fio), control
borders (muted at rest, ink when focused or filled), the régua (ink), and the
band edges of the chrome. Even the store's single icon is drawn at
`strokeWidth: 1.25` so it cannot become the heaviest mark on the bar.

Cards have no silhouette at all. A listing card is a photograph on a kozo field
with text beneath it — no box, no border, no background, no shadow — and the
whole card is the link.

### Named Rules

**The One Weight Rule.** Every line in the interface is 1px. A border does not
thicken to signal state; it changes colour. An error field stays 1px and goes to
ink.

## Components

The whole component vocabulary is one idea: **drawn, not built.** A control is a
line on paper rather than an object with mass, which is why nothing has a radius,
nothing has a shadow, and pressing something inverts the line instead of
depressing a surface.

### Buttons

- **Shape:** square (0 radius), 1px ink border, transparent ground.
- **Primary:** CTA voice — uppercase, `0.18em` tracking, `--ink` text — with
  padding of `rhythm-2 / rhythm-4` inline or `rhythm-3` full-width. On hover the
  whole control inverts: `--ink` background, `--plaster` text.
- **Focus:** `2px solid var(--indigo)` at `3px` offset, and the ring is a **cut** —
  `transition-duration: 0s` — so it never lags the Tab press or smears across a
  fast pass down a grid.
- **Active:** also a cut. A press is a discrete acknowledgement, not a state that
  eases in.
- **Disabled:** border drops to `--hairline`, text to `--muted`, cursor
  `not-allowed`. No opacity trick.
- **Quiet variant:** no border at all — CTA voice in `--ink`, going `--indigo` on
  hover. Used where the action is a way out rather than the point of the page.

### Cards / Containers

- **Corner style:** square.
- **Background:** none on the card; the image field alone is `--kozo`.
- **Shadow strategy:** none, per Elevation & Depth.
- **Border:** none. Cards are separated by grid rhythm, not by boxes.
- **Internal padding:** none — the text sits directly beneath the image at
  `rhythm-3`, then `rhythm-1` between each subsequent line.
- **Behaviour:** the entire card is one link and holds no control of its own. The
  piece name goes `--indigo` on group hover. A previous price is a strikethrough
  in `--muted` with `decoration-1` — never a colour, never a percentage badge.

### Inputs / Fields

- **Style:** 1px `--muted` border, transparent ground, square, Body S text,
  `rhythm-2` padding.
- **Label:** annotation voice in `--ink` above the field; an optional field says
  `OPCIONAL` in `--muted` inline, rather than leaving it to be inferred.
- **Focus and filled:** border moves to `--ink`. Filled tracks a real
  `data-filled` attribute, not a placeholder selector that would also match every
  empty field without a placeholder.
- **Error:** border stays 1px and goes to `--ink`; the message sits below in Body
  S `--ink` with `role="alert"`, and the field carries `aria-invalid` plus
  `aria-describedby`. **No icon, no colour, no `!`, no uppercase.** Errors that
  state a fact carry a link onward; errors the reader can fix themselves do not,
  because a link would send them away from the fix.

### Navigation

- **Style:** annotation voice, `--ink`, over `--plaster`, on a 1px fio rule.
  Constant `72px`.
- **Active state:** a 1px ink rule under the current ambiente — never índigo. The
  accent stays rationed for interaction, and on a product page nothing is marked
  at all, because marking would lie about where the reader is.
- **Mega menu:** hovering or focusing an ambiente opens a single 260px column of
  that room's curated tipos. It opens on focus, closes on Escape, traps focus
  while open, returns focus to its trigger, and exposes `aria-expanded`.
- **Mobile:** the word `MENU`, not a hamburger. The interface stays wordmarked at
  every breakpoint.
- **Cart:** a `ShoppingBag` glyph at 18px, `strokeWidth: 1.25`, with a tabular
  count beside it that vanishes entirely at zero. It is a **link** to
  `/carrinho`, never a drawer trigger, and the count is text, never a badge —
  a circle would spend the sole accent on a number.

### Régua (signature component)

The identity's one bold gesture: a 1px `--ink` hairline with a 13px perpendicular
tick at each end, carrying a real figure in the annotation voice. The label sits
on the rule with a breath of `--plaster` behind it, which is what cuts the
hairline.

- **Horizontal** cotas run along the bottom edge of a piece, label at the start
  edge — the measurement reads from where it begins.
- **Vertical** cotas sit **outside** the image, to its right, with the label in
  `writing-mode: vertical-rl` rather than a `transform`, so the label keeps a
  real box the flow can reserve.
- **The component takes a label and nothing else,** because its governing rule
  cannot be a prop: a caller with no figure does not render it at all.

### Named Rules

**The Empty Régua Rule.** A régua without a real figure behind it is prohibited.
It is ornament and data at once, and it stops being either the moment the number
is invented. Maximum two cotas per piece (largura, altura) and never more than
twice per screen; never in running text, forms, checkout or the footer.

**The Two Motions Rule.** The motion vocabulary is a closed list of exactly two
entries, both `120ms linear`: interactive state on pointer, and the
stale-content dim (opacity `0.45` after a `120ms` delay, bound to `aria-busy` so
the state and its announcement cannot drift apart). The property allowlist is
exactly what those two name; `transform` is refused. `linear` states no curve on
purpose — at this duration a curve would claim a personality this store does not
have. `prefers-reduced-motion: reduce` is honoured by one global rule that sets
the duration to `0s`: the end state is kept, the interpolation dropped.

## Do's and Don'ts

### Do:

- **Do** reach the type scale through a role class (`.t-annotation`,
  `.t-display-l`). Pick a voice, never a size.
- **Do** use `--muted` (`#6b675f`) as a control's resting border and `--ink` as
  its focused or filled border.
- **Do** build recession with `--kozo` under `--plaster`, one step and no further.
- **Do** set every figure in a data context tabular, and write measurements as
  `L {n} × P {n} × A {n} cm` with a real `×`.
- **Do** invert a primary button on hover — ink ground, plaster text — and keep
  focus and active as cuts at `0s`.
- **Do** reserve an image's aspect ratio from its real `medidas` and hold a flat
  `--kozo` field until it paints.
- **Do** put the photograph on 7 columns and the text on 5, and leave the right
  gutter empty.
- **Do** give a régua a real number or leave it out entirely.

### Don't:

- **Don't** add a corner radius or a box-shadow to anything. Both are nulled
  outside every layer precisely so this stays unreachable — reaching for
  `rounded-*` or `shadow-*` means the design has drifted, not that the rule needs
  an exception.
- **Don't** ship the SaaS default in any of its parts: gradient buttons, pill
  badges, an icon beside every label, a card with a border and a hover lift.
- **Don't** use `--hairline` (`#deddd8`) as a control border. It measures 1.32:1
  and identifies nothing.
- **Don't** spend índigo on anything that is not interactive state, the focus
  ring, or the à-vista discount superscript. Never on the active nav item, never
  as a badge fill.
- **Don't** carry meaning in colour alone. Errors resolve in ink and position;
  selection resolves in ink.
- **Don't** thicken a border to signal state. One weight, 1px, everywhere.
- **Don't** hand Mincho to interface type, and don't add a third family.
- **Don't** add a third motion entry, animate `transform`, or replace `linear`
  with a curve.
- **Don't** centre a text block under its image.
- **Don't** introduce ordinal numbering (01 / 02 / 03). Nothing here is a sequence
  the reader must follow in order.
- **Don't** render a placeholder for a failed image — no icon, no glyph, no
  `IMAGEM INDISPONÍVEL`. The flat kozo field simply stays.
- **Don't** add a dark-mode branch.
