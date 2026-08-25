# 1. The grounds are cooled toward white

Date: 2026-08-24

## Status

Accepted.

## Context

`marca.md` §3 fixed a light, warm palette and listed "cream `#F4F1EA` and
neighbours" as **deliberately out**, on the reasoning that *"Reboco is cooler and
greyer on purpose."* The three ground values that resulted — `--plaster`
`#F5F4F0`, `--kozo` `#EAE7E0`, `--hairline` `#D3CFC7` — sit on one warm grey
ramp, and every surface in the store is built on them.

In use the ramp reads warmer than the reasoning intended. Reboco at `#F5F4F0` is
only 96% white but it is warm at every step, and because `--kozo` and
`--hairline` are further down the same ramp, the page reads beige as a whole
rather than as a light ground carrying warm accents. The identity's warmth was
being spent on the paper, where it is unavoidable and undifferentiated, instead
of on the wood and the photography, where it is the point.

The store is also gaining a full-width room photograph as the home's opening
(`home.md` §0.5). That photograph is emphatically warm — cream stone, oatmeal
linen, jute. With a warm page behind it, the two warms compete and neither
reads as chosen.

## Decision

Cool and lighten the three grounds by one step each, and leave everything else
alone.

| Token | Was | Now |
|---|---|---|
| `--plaster` | `#F5F4F0` | `#FCFCFB` |
| `--kozo` | `#EAE7E0` | `#F1F0EC` |
| `--hairline` | `#D3CFC7` | `#DEDDD8` |

`--ink`, `--indigo`, `--muted` and `--oak` are **unchanged**. `--oak` in
particular stays exactly where it was: `marca.md` §3 names it "wood, warmth", and
after this change it and the photography are where the identity's warmth lives.

`marca.md` §3's "deliberately out" clause is restated rather than deleted: the
**warm** end of the axis is still refused. Cream is still out. What changed is
that the light end is no longer refused along with it — those were two
properties travelling under one rejection.

## Consequences

**The contrast floors improved and were re-derived, not merely re-checked.**
Every pair in `acessibilidade.md` §3 rose: `--ink`/`--plaster` 15.80 → 16.94,
`--muted`/`--plaster` 5.11 → 5.48, `--muted`/`--kozo` 4.56 → 4.94,
`--indigo`/`--plaster` 11.87 → 12.72. `--muted` was the value §5.1 chose as *the
shallowest clearing both grounds*; it still clears both, with more margin, so it
does not move. No pair was newly introduced and none fell.

**`--hairline` stays below the boundary floor, which is still correct.** It
measures 1.32 on plaster (was 1.41). `acessibilidade.md` §5.2 already established
that the hairline borders nothing clickable — it is decorative structure and
`--muted` is the control border. A lighter hairline makes that distinction
sharper, not weaker.

**Pure white was refused.** `#FFFFFF` plus a fully neutral ramp reads as
conventional e-commerce chrome and would leave the warm photography looking
pasted in from another site. `#FCFCFB` is a hair off neutral so the page is not
clinical, while being unambiguously *white* to a visitor rather than *beige*.

**`--kozo` had a second life as data.** `lib/metadados/conteudo.ts` carries the
kozo hex as `CAMPO_DE_COMPARTILHAMENTO`, the fill colour of the 1200×630 share
card, so that the containment field behind an OG image is the same grey as the
one behind a cart thumbnail. It moved with the token; `tests/metadados.test.ts`
asserts the two cannot drift apart.

**No dark mode was opened.** The palette is still light-only and
`prefers-color-scheme` still appears nowhere in the stylesheet, which
`tests/tokens.test.ts` continues to assert.

**Reversal is cheap in code and expensive in judgement.** Three hex values and
one derived constant restore the old palette in minutes. What would not be cheap
is re-deciding it a third time: the warm ramp was itself the product of a
deliberate refusal, and this ADR exists so that the next reader finds the
argument rather than the diff.
