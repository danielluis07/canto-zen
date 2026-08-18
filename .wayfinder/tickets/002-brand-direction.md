---
title: Brand direction
parent: map
labels: [wayfinder:prototype]
assignee: danielluis07
blocked-by: []
status: closed
---

## Question

What does Canto Zen look and feel like?

Enough direction that section decisions stop being arbitrary: mood and density, warm light palette (no dark mode), type pairing and scale, photographic treatment, corner/edge language, and how loud or quiet the design is. Not a full brand kit — no logo system, no collateral.

Make cheap concrete artefacts to react to rather than describing in prose. Link them as assets.

Output: a short direction doc plus whatever swatches/type specimens were used to settle it.

## Resolution

**A régua** — the dimension annotation is the signature. Full direction doc:
[`docs/spec/marca.md`](../../docs/spec/marca.md).

Register settled with the human before building: high-end atelier, japandi calm,
quiet with one bold move, warm light only.

- **The bold move**: a 1px rule with a tick at each end carrying a real cm figure,
  along the bottom and right edge of any featured piece. Chosen because the cota is
  ornament *and* data at once — the spec already owes the shopper L × P × A, so the
  most memorable device on the site is information the buyer needs anyway. Banned
  without a real number, capped at two per piece, never in body copy or checkout.
  Ordinal numbering (01/02/03) is out of the system — nothing here is a sequence.
- **Palette**: ink `#1B1A18`, reboco `#F5F4F0`, kozo `#EAE7E0`, carvalho `#C6B49A`,
  fio `#D3CFC7`, índigo `#223244` as the sole accent (interactive state + Pix badge
  only), apagado `#7A756C`. Terracotta and `#F4F1EA`-family creams explicitly ruled
  out as the category/AI default.
- **Type**: Zen Old Mincho (low-contrast mincho, display only — piece and collection
  names, editorial) + Schibsted Grotesk (body, UI, data, tabular figures everywhere).
  Both cover `latin-ext`, so pt-BR accents are intact. The annotation voice —
  11px / 0.16em / uppercase / tabular — is the system's workhorse.
- **Edge language**: border-radius 0 across all UI, no UI shadow, 1px hairlines. The
  only curve and the only shadow in the whole identity live inside the photograph.
- **Photography**: raking late-afternoon light, raw plaster ground, hard long shadow,
  piece alone with no styling. Shadow is never cropped out.
- **Atelier vs. commerce realism**: resolved as a matter of *voice, not presence*.
  Every fact [Brazilian e-commerce UX conventions](004-br-ecommerce-conventions.md)
  requires — à-vista + parcelado, Pix discount badge, per-CEP frete — stays in full,
  set in the annotation voice instead of shouted. No "sob consulta" anywhere.
- **Motion**: held to a 120ms colour transition and nothing else, as a placeholder so
  build sessions cannot invent motion before the motion ticket exists.

### How it was settled

Three directions built and compared side by side at `/prototype/marca?variant=A|B|C`:
**A régua**, **O canto** (hairline right angle + raking light), and **O caderno** (the
specification ledger as hero, photography demoted to an index thumbnail). All three
shared position, register and volume, and disagreed only on where the bold move goes.

A won: it is the only one whose signature carries information, and so the only one
that survives 15 routes without decaying into wallpaper. C was the most distinctive
but fights the category by demoting photography on a furniture site. B was safest and
least memorable.

Prototype captured on branch `prototype/brand-direction`, commit `ff44fd7`. Not for
promotion — it was written under prototype constraints; `docs/spec/marca.md` is the
deliverable.
