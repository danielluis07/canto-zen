# Acessibilidade — commitment, floors and measurements

## 1. What this document is

A **normative floor**, not a summary. Canto Zen's accessibility obligations are
written where they belong — focus in [`marca.md`](marca.md) §6, motion in §9.6,
loading and error semantics in [`erros.md`](erros.md) §§4.2 and 5, `alt` in
[`imagens.md`](imagens.md). This file does not restate them. It states the floors
every surface inherits, including surfaces nobody has specified yet, and it
records the measurements that prove the palette clears them.

**Precedence.** Where a page spec is *more* specific than a floor here, the page
spec wins. Where a page spec is *weaker* than a floor here, or silent, the floor
wins. A page spec cannot lower a floor; it can only sharpen one.

## 2. The commitment

Canto Zen does **not** claim WCAG 2.2 AA conformance. It is a concept store and
no audit has been performed; asserting a standard nobody has tested against is a
claim it cannot support.

What it commits to instead is this list, in these words, each one checkable
against the specs:

1. **Text contrast is at least 4.5:1** against the ground it sits on, at every
   size the type scale defines. The scale's smallest voice is `0.6875rem`, so no
   text in the storefront qualifies for a large-text exemption and none is taken.
2. **Interactive boundaries are at least 3:1** — the resting border of any input,
   stepper or selectable row, wherever that border is what identifies the control.
3. **Focus is always visible**, `2px solid var(--indigo)` at `outline-offset: 3px`,
   and focus is a cut, never a transition ([`marca.md`](marca.md) §§6, 9.5).
4. **`prefers-reduced-motion: reduce` is honoured** by one global rule: end state
   kept, interpolation dropped ([`marca.md`](marca.md) §9.6).
5. **Every overlay is keyboard-operable and dismissible**, per §4 below.
6. **State is announced, not only shown** — `aria-busy` with a visually-hidden
   `role="status"` on a loading region; `aria-invalid` with `aria-describedby` and
   `role="alert"` on a field error, focus moved to the first invalid field
   ([`erros.md`](erros.md) §§4.2, 5).
7. **No information is carried by colour alone.** Already structural rather than
   aspirational: success and error resolve in ink and typographic weight, and
   selection resolves in ink ([`checkout.md`](checkout.md) §8). There are no
   traffic lights to fail.
8. **Every image has an authored or templated `alt`**, and no decorative image
   exists anywhere in the storefront, so `alt=""` never appears
   ([`imagens.md`](imagens.md)).
9. **The document is `<html lang="pt-BR">`** ([`marca.md`](marca.md) §4).

These happen to be the AA success criteria the spec actually meets. The
difference from claiming AA is provenance, not altitude.

## 3. Measured contrast

WCAG 2.x relative-luminance formula. Every pair below is one the page specs
actually use. **Text floor 4.5:1; boundary floor 3:1.**

| Foreground | Ground | Ratio | Floor | |
|---|---|---|---|---|
| `--ink` `#1B1A18` | `--plaster` | **15.80** | 4.5 | ✓ |
| `--ink` | `--kozo` | **14.08** | 4.5 | ✓ |
| `--muted` `#6B675F` | `--plaster` | **5.11** | 4.5 | ✓ |
| `--muted` | `--kozo` | **4.56** | 4.5 | ✓ |
| `--indigo` `#223244` | `--plaster` | **11.87** | 4.5 | ✓ |
| `--indigo` | `--kozo` | **10.58** | 4.5 | ✓ |
| `--plaster` | `--indigo` | **11.87** | 4.5 | ✓ |
| `--plaster` | `--ink` | **15.80** | 4.5 | ✓ |
| `--kozo` | `--ink` | **14.08** | 4.5 | ✓ |
| `--muted` (control border) | `--plaster` | **5.11** | 3.0 | ✓ |
| `--muted` (control border) | `--kozo` | **4.56** | 3.0 | ✓ |
| `--indigo` (focus ring) | `--plaster` | **11.87** | 3.0 | ✓ |

**Two values in this table were changed to make it pass**, both recorded in
[`marca.md`](marca.md) §3 — see §5.

**`--hairline` `#D3CFC7` is absent from this table on purpose.** It measures 1.41
on `--plaster` and it stays that light, because after §5 it borders nothing that
is a control: it is the divider rule, the panel edge, the navbar underline and
the swatch outline. Structural edges are not control boundaries and the 3:1 floor
does not reach them. If a future spec puts a `--hairline` border on something
clickable, that spec is wrong, not this floor.

**`--oak` `#C6B49A` carries no text in any current spec.** If one ever puts text
on it: `--ink` measures 8.61 and qualifies; `--muted` measures **2.79** and does
not. Oak is a wood tone, not a ground for secondary text.

## 4. The overlay rule

Applies to **every** overlay — the navbar's ambiente panel
([`navbar.md`](navbar.md) §6), the mobile `FILTRAR` and `ORDENAR` sheets
([`catalogo.md`](catalogo.md) §12), and any overlay specified later.

- **`Escape` closes it**, from anywhere inside.
- **Focus returns to the trigger** that opened it, always — on `Escape`, on the
  explicit closing action, and on close-by-outside-click.
- **Focus is contained while open.** Tab from the last focusable element inside
  returns to the first; it does not escape to the page behind.
- **The trigger carries `aria-expanded`**, and the overlay is labelled by the
  trigger's own text.
- **One at a time.** Opening an overlay closes any other.

`navbar.md` §6 states this behaviour for the ambiente panel in its own prose and
keeps it — it is correct, and it reads better in place. The rule exists for the
overlays that come *after* the two that are specified today.

**Touch and keyboard have no hover.** Any overlay whose desktop affordance is
hover must open on the first activation instead ([`navbar.md`](navbar.md) §6).

## 5. Palette changes this document forced

Both were found by building §3's table, before any code existed.

### 5.1 `--muted` `#7A756C` → `#6B675F`

The old value measured **4.16** on `--plaster` and **3.71** on `--kozo` — below
the text floor on both. `--muted` is the annotation voice's colour and the
annotation voice is the system's workhorse ([`marca.md`](marca.md) §4), so it
failed across `carrinho`, `catalogo`, `checkout`, `home` and `institucional`
simultaneously. No large-text exemption was available: the voice is `0.6875rem`.

`#6B675F` is the **shallowest** value clearing both grounds — `#736E66` clears
plaster at 4.60 but still fails kozo at 4.10, and `--muted`-on-`--kozo` is real
(the cart resumo, [`carrinho.md`](carrinho.md) §5). It keeps the warm-grey cast
and a 3.1× luminance gap to `--ink`, so *apagado* still reads as secondary rather
than as a second ink. `--muted` appears only ever as text, never as a fill, so
nothing structural moved.

### 5.2 The resting control border is `--muted`, not `--hairline`

`--hairline` measured **1.41** on `--plaster` — far under the 3:1 boundary floor
— and it was the resting border of every text input, the quantity stepper and the
unselected selection row.

The resting border of a control is now `--muted`; the focused or filled state
still goes to `--ink`, unchanged and still 1px. This also repairs something the
specs already read oddly: the border used to jump from near-invisible to black.
`--muted` → `--ink` is a two-step in one warm-grey ramp.

The distinction it introduces is worth having on its own terms: **`--hairline`
is decorative structure; `--muted` carries meaning.** Sites affected —
[`erros.md`](erros.md) §5.1, [`checkout.md`](checkout.md) §6 errors and §8
unselected rows, [`carrinho.md`](carrinho.md) §3 stepper and §5.2 CEP field,
[`institucional.md`](institucional.md) §6 contact form.

## 6. Deliberate omissions

- **No conformance statement, no accessibility page in the storefront.** The
  commitment is a spec-level obligation, not marketing copy. A footer link
  claiming accessibility would be the unaudited assertion §2 refuses.
- **No skip link.** The navbar's tab order is wordmark → four ambientes →
  Inspirações → cart ([`navbar.md`](navbar.md) §6): seven stops before content,
  which is not a barrier worth a permanent visible affordance. If the navbar ever
  grows, this is the first thing to revisit.
- **No audit, and no schedule for one.** Stated plainly rather than implied.
