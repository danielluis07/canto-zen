---
title: Motion & transition conventions
parent: map
labels: [wayfinder:grilling]
assignee:
blocked-by: [002-brand-direction]
status: open
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
