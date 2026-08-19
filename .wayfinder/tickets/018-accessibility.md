---
title: Accessibility commitment level
parent: map
labels: [wayfinder:grilling]
assignee:
blocked-by: []
status: open
---

## Question

What accessibility level does the spec assert, and where is that assertion written?

Graduated from fog by [Motion & transition conventions](017-motion.md), which was the
last ticket owing an individual obligation. The obligations are now all settled and
scattered across specs — what is *not* settled is the level they add up to, and
whether the spec claims it.

Already fixed elsewhere, and not to be re-decided:

- Visible `--indigo` focus ring, `outline-offset: 3px`, mandatory
  (`marca.md` §6), and **focus is always a cut, never a transition** (§9.5).
- `prefers-reduced-motion: reduce` — one global rule: end state kept,
  interpolation dropped (`marca.md` §9.6).
- `aria-busy` + visually-hidden `role="status"` on a loading region; `aria-invalid`
  + `aria-describedby` + `role="alert"` on a field error, focus moved to the first
  invalid field, no error-summary block (`erros.md` §4.2, §5).
- `alt` convention: templated for `principal`/`ambientada`, authored elsewhere, and
  **no decorative image exists anywhere**, so `alt=""` never appears
  (`imagens.md`).
- `<html lang="pt-BR">` (`marca.md` §4).

Decide:

- The level asserted — WCAG 2.2 AA, a subset, or a written commitment that names
  obligations without citing a standard. A concept store asserting AA it has not
  audited is a claim it cannot support.
- **One claim to check against it**: the palette (`marca.md` §3) is built on
  `--muted` `#7A756C` for secondary text and captions, and the annotation voice
  (§4) sets much of the store's text at `0.6875rem` in `500`. Contrast of `--muted`
  on `--plaster` must be measured, not assumed — the annotation voice is described
  as "the system's workhorse", so if it fails, it fails almost everywhere.
- Where the commitment lives: a new `docs/spec/acessibilidade.md`, or a section in
  `marca.md`.
- Whether keyboard reachability of the enumerated-catalogue navigation (the navbar
  panel, the filter sheet on mobile) needs anything the page specs did not already
  state.

Output: whichever file the second bullet decides.
