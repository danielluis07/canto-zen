---
title: Navbar
parent: map
labels: [wayfinder:prototype]
assignee: danielluis07
blocked-by: [001-route-inventory, 002-brand-direction]
status: closed
---

## Question

What is in the navbar, and how does it behave?

Structure against the room-primary taxonomy: flat links vs. a mega menu, and what a room menu reveals if so. Plus: whether search exists at all, the cart indicator, sticky/scroll behaviour, the mobile treatment, and whether there is a promotional/announcement bar above it.

Whether search exists is load-bearing — it decides whether a search-results surface enters the map.

Output: navbar section spec, with a prototype for whichever menu shape is contested.

## Resolution

Full spec in [`docs/spec/navbar.md`](../../docs/spec/navbar.md).

**No search.** The catalogue is ~20 curated listing pages and room-primary browsing
was designed as *the* path; a search field is a utility-shop signal against the
atelier register, and a concept store has no corpus to make relevance mean anything.
The `?q=` that `rotas.md` reserved goes unused, and the search-results surface is
ruled **out of scope** rather than graduating from fog. Cost acknowledged: someone
arriving knowing "poltrona" goes through Sala.

**Mega menu, in its narrowest form.** Each room label opens a panel; the panel is a
**single 260px column** — that room's curated tipos in authored order, a hairline,
and "Ver tudo em {Ambiente}". Nothing else. Two richer panels were built and lost:
a full-bleed panel with a featured piece and a régua (rejected — repeating the
régua above every page spends the gesture `marca.md` rations to two per screen),
and a single index panel showing all four rooms at once (rejected — dimming three
quarters of its own panel is an effect, and 20 simultaneous tipos contradict the
low-density rule).

**The bar.** Five items — Sala, Quarto, Cozinha, Escritório, Inspirações — plus the
cart. Left-grouped and asymmetric, wordmark then a 3.5rem gap then the nav, cart
alone at the right with the gutter left empty. 72px, `--plaster`, hairline bottom,
no shadow, zero radius. `/produtos` lives inside the panel as "Ver tudo", Sobre and
Contato are footer material.

**Zero icons, at every breakpoint.** The cart is the word `CARRINHO` with a tabular
`(n)` that vanishes at zero — no badge, since red is off the palette and an índigo
badge would spend the only accent on a count. The mobile trigger is the word `MENU`,
not a hamburger; `CARRINHO (n)` stays in the bar beside it rather than hiding in the
panel. Mobile opens a full-screen `--plaster` panel with rooms as accordions.

**Wordmark in Mincho — a registered exception.** `marca.md` §4 says the display face
is never for interface. The navbar is the single exception in the whole storefront,
because with no icons an annotation-voice wordmark would be typographically
identical to the "Inspirações" label beside it and the brand would vanish into its
own navigation.

**Sticky at one constant height**, the strip scrolling away above it — no shrink, no
hide-on-scroll, no shadow. Any height change on scroll is motion, so this leaves
[Motion & transition conventions](017-motion.md) nothing to undo.

**Active room signals with a 1px `--ink` rule, not índigo** — a product page already
spends índigo on the Pix badge and the focus ring, and a third would break the
rule of three. A product page marks **no** nav item at all: the breadcrumb already
declares its ambiente principal.

Constraint handed to [Cart sections](010-cart.md): the navbar affordance is a
**link** to `/carrinho`. A drawer, if that ticket wants one, is an addition
triggered by add-to-cart, never by this link.

Three panel shapes built and compared at `/prototype/navbar?variant=`, captured on
branch `prototype/navbar` (commit `1efb9a1`). Not to be promoted — prototype
constraints.
