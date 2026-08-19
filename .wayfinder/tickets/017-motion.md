---
title: Motion & transition conventions
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: [002-brand-direction]
status: closed
---

## Question

How does Canto Zen move?

Graduated from fog now that [Brand direction](002-brand-direction.md) has settled how
loud the design is. That ticket deliberately parked motion at a **120ms colour
transition on interactive states and nothing else** — a placeholder chosen so build
sessions could not invent motion before this ticket existed. Confirm or replace it.

The register argues against much: quiet atelier, japandi calm, no UI shadow, zero
radius, one bold move already spent on the dimension rule. Scroll reveals and page
transitions are the obvious things to rule out — but "no motion at all" is also a
choice with a cost, and hover feedback on a catalogue grid is doing real work.

Decide:

- Hover and focus behaviour on product cards, images and CTAs — including whether the
  raking-light photography gains anything from a hover state.
- Whether the dimension rule (§2 of `docs/spec/marca.md`) animates on entry. It is the
  signature, so this is the one place a motion gesture would carry brand meaning — and
  also the easiest place to make the whole identity look cheap.
- Page and route transitions: none, or a cross-fade.
- Duration and easing tokens, so page specs can name them rather than inventing them.
- What `prefers-reduced-motion: reduce` collapses to.

Output: a motion section appended to `docs/spec/marca.md`.

---

## Resolution

**Motion may confirm that something changed, or is changing. It may never announce
arrival.** State-only, and the placeholder was very nearly right — but only because
ten specs had been holding it by discipline, which is what this ticket converts into
structure.

The whole of §9 in [`docs/spec/marca.md`](../../docs/spec/marca.md) was rewritten
(§9.1–9.9). Decisions:

- **The régua does not animate**, and it is refused on §2's own test: the régua is
  permitted because it is ornament and data at once, and a drawing animation states
  no figure while it runs — so it *is* the empty régua §2 already prohibits, moved
  into the time axis. This was the ticket's most contested bullet; it resolved
  against animation on the identity's own logic rather than on taste.
- **"No motion at all" was considered and rejected** — a dead 12-item grid is not
  calm, and `erros.md` §4.2 established the dim as state, not decoration.
- **Closed list of exactly two motions** (§9.2): the pointer colour transition, and
  the stale-content dim adopted verbatim from `erros.md` §4.2. Everything else in
  the store is a cut, and a cut needs no justification.
- **Closed property allowlist** (§9.3): the colour-carrying properties plus
  `opacity`. `transform` is refused by name — it is displacement, and §6 has no
  elevation vocabulary for it to express. This is what §9 never had: a test a future
  spec can apply in one read.
- **Tokens** (§9.4): `--motion-duration: 120ms`, `--motion-ease: linear`. One of
  each, no scale — an unused token invites a use for it. `linear` is argued, not
  defaulted: at 120ms on colour and opacity an easing curve is sub-perceptual, and
  `ease-out` *means* arrival, which §9.1 bans as a meaning.
- **The transition follows the pointer, never the keyboard** (§9.5): hover ramps;
  focus and `:active` are always cuts, because a ramp makes the ring lag the Tab
  press and smears it across a fast pass down a grid.
- **One global `prefers-reduced-motion` rule** (§9.6): the end state is kept, the
  interpolation is dropped. `erros.md`'s branch becomes an instance rather than a
  special case, `checkout.md`'s no-branch claim stands, and every future entry
  inherits a branch it cannot forget. Noted honestly: with no displacement anywhere,
  `reduce` here is a preference for stillness, not a safety mitigation.
- **A delay is not motion** (§9.7): §9 governs interpolation only, so `checkout.md`
  §2.2's 1500ms beat stays a checkout constant — and its `--plaster/95` wash
  **arrives as a cut**, because a fade would dramatise the exact moment that surface
  exists to admit was never real work.
- **The cart line's exit is a cut** (§9.8), against `carrinho.md`'s suggestion that
  it was the one place a transition would carry meaning. A fade-out would **invert**
  the dim's meaning — `0.45` says *stale, content is coming*; a row fading to `0`
  says nothing is coming — and the same property carrying opposite meanings on
  adjacent surfaces is how a small vocabulary rots. The acknowledgement the reader
  needs is that the totals and `CARRINHO (n)` changed, and both do.
- **Ten standing refusals ratified once** (§9.8), so no future surface re-argues
  them — including that **the photograph gains nothing on hover, anywhere**: the
  frame carries the cast shadow as content and is derived from real `medidas`, so
  any hover state edits the photograph.
- **§9 is closed, with an amendment protocol** (§9.9): name the entry, say why no
  existing entry covers it, land it in §9. `erros.md` §4.2 is cited as the worked
  example.

**Two specs corrected in place**, because they quoted the provisional §9 verbatim
and the quotation is now false — their conclusions were unaffected and are ratified
by §9.8: [`imagens.md`](../../docs/spec/imagens.md) §6 (with a note saying so) and
[`catalogo.md`](../../docs/spec/catalogo.md) §6 and §9's mobile filter sheet.

Nothing in this resolution required any other spec to change: the provisional §9
had been honoured everywhere.
