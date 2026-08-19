---
title: Imagery system
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: [002-brand-direction]
status: closed
---

## Question

What images does the site need, and what governs them?

Aspect ratios per context (hero, room card, product card, gallery, editorial), the treatment that makes them feel like one set (lighting, styling, background, crop discipline), the split between studio product shots and lifestyle room shots, and the sourcing strategy — Unsplash searches vs. generated — with placeholder/loading behaviour.

Every page ticket assumes images exist; this decides what shape they are.

Output: imagery direction section in the spec, referenced by the page specs.

---

## Resolution

Full spec in [`docs/spec/imagens.md`](../../docs/spec/imagens.md).

**The finding that reframed the ticket.** `marca.md` §7 stated one photographic
rule with **one** exception, naming Inspirações — and it was already false when
written. The data model authorises three non-solo image kinds (`ambientada`,
`Ambiente.imagem`, `FotoArtigo`), while `inspiracoes.md` §10 and
`institucional.md` both assert the exception is spent exactly once. Three closed
specs disagreed. Restated as **two genres** — *retrato* (the piece alone) and
*ambiente* (a furnished room, same light, same plaster) — with Inspirações
holding not the genre but the **composition**: three photographs sequenced into
an argument. `marca.md` §7 corrected in place. The no-human-trace prohibition
**generalises from Inspirações to the whole ambiente genre**, which is what keeps
`pagina-produto.md` §4.1's refusal of a human scale figure valid — there is now
no person in any photograph in the store, exceptionlessly.

**Ratios are enumerated and derived, never authored.** Three retrato tokens
(`3:2` / `1:1` / `4:5`) plus `16:9` for `Artigo.thumb`, and the produto's is
**computed from `medidas`** — no `ratio` field, no `w`/`h`. This makes
`marca.md`'s "frame in the piece's real proportion" mechanically true instead of
a photographer's instruction, and it cannot drift the way an authored token can.
Free-form ratios lost because every authored composition in the store — the
`78vh` hero cap, the 7/5 pairs, the ragged listing grid — was built against a
known shape.

**Nothing is ever cropped, which dissolves rather than resolves the conflict
`checkout.md` §11 handed over.** The 96px cart square and 64px checkout square
are `--kozo` **fields**, not frames: the packshot is *contained* at its real
ratio. Both sizes stay correct, no square crop family exists, and the "cast
shadow never cropped" rule needs no enforcement anywhere.

**No new fields — the first spec in the map to change no shape at all.** Two
corrections instead: `Colecao.imagem` drops from `Imagem` to `{ src, alt }`
(`papel` and `cotas` would exist only to stay empty, the reason `home.md` §8
gave), and only `principal` is **required** — `ambientada` and `detalhe` become
**rare and authored**, since 60–150 produtos × 3 is 180–450 photographs and
`pagina-produto.md` already built the page to render deterministically from
whichever roles exist.

**`alt` splits by slot**: templated for `principal` and `ambientada` (predictable
subject, a hundred hand-written near-duplicates buy nothing), authored for
`detalhe` and every ambiente-genre slot (where alt carries information no
template reaches). **No decorative image exists**, so `alt=""` never appears.

**Loading is another authored absence.** `marca.md` §9's 120ms-and-nothing-else
extends to image loading without qualification: **no fade-in, no blur-up/LQIP,
no skeleton** — a blur resolving into a photograph is a *reveal*. The box
reserves its ratio and holds a flat `--kozo` field; on failure the field simply
stays, **no broken-image icon, no `IMAGEM INDISPONÍVEL`** — the seventh refusal
of a fabricated artefact.

**Two non-photographic classes governed.** `Familia.desenho` is **inline SVG line
art** reusing the régua's own grammar (1px `--ink`, end ticks, tabular figures),
not a raster — the elevation beat a human silhouette precisely because it speaks
the identity's language, and a photograph of a drawing would sit beside the régua
instead of sharing it. The footer's payment flags and social marks get their
**treatment** fixed (monochrome SVG, `--muted`, 18px, plain mark never colour
artwork), closing the back door `rodape.md` left open when it admitted them.

**Sourcing is two phases, per the user's correction.** Phase 1 hotlinks Unsplash
CDN URLs (`remotePatterns` for `images.unsplash.com` is a build prerequisite;
`next.config.ts` is currently bare) with **repetition explicitly fine**. Phase 2
generates the real set from a **prompt spine authored now, not deferred** —
deferring it would reopen `marca.md` §7 under deadline — lands it locally under a
naming convention that doubles as the generation manifest, and rewrites every
`src` once.

The phase split forced two rules of its own. **Structural rules bind in phase 1,
photographic ones do not** — ratios, contain-fit, `alt`, ratio reservation and
required-and-rare all hold from day one, and **a placeholder is never evidence**:
no layout or composition decision may be made because a stock photo looked right
or wrong. And **one carve-out**: the two-acabamento família gets visibly
different placeholders, because `carrinho.md` §11 kept its thumbnail on the
argument that two finishes differ *only* in a photograph — untestable against a
wall of identical squares during exactly the phase the cart is built.
