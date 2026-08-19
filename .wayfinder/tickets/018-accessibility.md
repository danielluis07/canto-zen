---
title: Accessibility commitment level
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: []
status: closed
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

## Resolution

**Output: [`docs/spec/acessibilidade.md`](../../docs/spec/acessibilidade.md).**

### The level

**No WCAG conformance claim.** The spec asserts a written commitment naming nine
obligations in its own words, citing no standard (§2). Those obligations happen to
be the AA success criteria the spec meets — the difference is provenance, not
altitude. A concept store with no audit cannot support an AA assertion.

The document is **normative, not a summary**, with an explicit precedence line: it
sets floors every surface inherits; a page spec that is *more* specific wins, one
that is weaker or silent loses. This is what makes it work for surfaces nobody has
specced yet, which matters because the destination is a spec handed to build
sessions.

It carries the **measured contrast table** (§3) rather than a bare list — the table
is the evidence for the claim, and it is what caught both failures below.

### The palette claim, measured — it failed, twice

`--muted` `#7A756C` on `--plaster` = **4.16**, on `--kozo` = **3.71**. Both below
4.5. The annotation voice is `0.6875rem`/500, so no large-text exemption existed
anywhere, and `--muted` is that voice's colour — it failed across `carrinho`,
`catalogo`, `checkout`, `home` and `institucional` at once. The ticket's suspicion
was right.

→ **`--muted` becomes `#6B675F`** (5.11 / 4.56), the shallowest value clearing both
grounds. `#736E66` clears plaster at 4.60 but still fails kozo at 4.10, and
`--muted`-on-`--kozo` is real (the cart resumo). Keeps the warm cast and a 3.1×
gap to `--ink`.

**A second failure the ticket did not anticipate**: `--hairline` `#D3CFC7` on
`--plaster` = **1.41**, and it was the resting border of every text input, the
quantity stepper and the unselected selection row — under the 3:1 boundary floor.

→ **The resting control border becomes `--muted`**; focus/filled still goes to
`--ink`, still 1px. No new token. This also repairs a jump from near-invisible to
black, and it sharpens the palette's meaning: **`--hairline` is decorative
structure, `--muted` carries meaning.** `--hairline` stays light — after this it
borders nothing that is a control.

Rejected: darkening `--hairline` wholesale (dividers are not control boundaries;
it would blacken every rule in the store) and minting a `--field` token (~`#7F7C77`
was the lightest clearing both grounds — too close to `--muted` to justify).

`--oak` carries no text in any spec; recorded as a forward rule (`--ink` 8.61
qualifies, `--muted` 2.79 does not).

### Keyboard reachability

Yes, there was a gap. `navbar.md` §6 fully specifies the ambiente panel — Escape,
focus return, `aria-expanded`, tab order — while `catalogo.md` §12's mobile
`FILTRAR`/`ORDENAR` sheets specify none of it.

→ **One generic overlay rule** (`acessibilidade.md` §4) covering Escape, focus
return to trigger, focus containment, `aria-expanded`, one-at-a-time. `navbar.md`
keeps its own correct prose; `catalogo.md` §12 gains a pointer. The rule exists for
the overlays specced *after* today's two.

### Edits made to existing specs

- `marca.md` §3 — palette table: `--muted` hex, `--hairline` use narrowed to
  "never a control border", pointer to the measured table.
- `erros.md` §5.1, `checkout.md` §6 and §8, `carrinho.md` §3, `institucional.md`
  §6 — resting control border `--hairline` → `--muted`.
- `catalogo.md` §12 — overlay-rule pointer.
