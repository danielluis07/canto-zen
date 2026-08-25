# Imagery system

Resolves ticket [Imagery system](../../.wayfinder/tickets/014-imagery.md).

Governs every raster and vector asset in the store: what images exist, what shape
they are, what governs how they look, where they come from, and how they load.
Every page spec already assumes images exist; this file is what they were
assuming.

This file is written in English prose; every string quoted as copy is the pt-BR
that ships, and domain terms stay pt-BR throughout.

It **corrects [`marca.md`](marca.md) §7 in place** (§1) and **corrects
[`produto.md`](produto.md)'s `Colecao.imagem`** (§9.2). Both corrections are
recorded below and applied to those files.

---

## 0. The inventory

Every image slot the closed specs committed to, and nothing else. A slot not in
this table does not exist.

| Asset | Genre | Field | Ratio | Consumed by |
|---|---|---|---|---|
| Packshot | retrato | `Produto.imagens[papel='principal']` | derived (§3) | PDP §2, listing card, home §1/§3, cart 96px, checkout 64px |
| Ambientada | ambiente | `Produto.imagens[papel='ambientada']` | `3:2` | PDP full-bleed break only |
| Detalhe | retrato | `Produto.imagens[papel='detalhe']` | `1:1` | PDP full-bleed break only |
| Room field | ambiente | `Ambiente.imagem` | `3:2` | home §2, four of them |
| Coleção | ambiente | `Colecao.imagem` | `3:2` | home §4 |
| Marcenaria | retrato | `ConteudoHome.marcenaria.imagem` | `3:2` | home §7 |
| Elevation | desenho | `Familia.desenho` | intrinsic SVG | PDP §4.1 |
| Article thumb | ambiente | `Artigo.thumb` | `16:9` | Inspirações index, home §6 |
| Article photo | ambiente | `FotoArtigo.src` | `3:2` full bleed | Inspirações article, twelve of them |
| Payment flag | marca | — | fixed 18px | footer |
| Social mark | marca | — | fixed 18px | footer |

`Cor.amostra` is a hex string, not an image, and is out of this system.

**Four asset classes**, and the rules below are scoped to them: **fotografia**
(the first nine rows, two genres — §1), **desenho** (§7), **marcas** (§8).

---

## 1. Two genres — correcting `marca.md` §7

[`marca.md`](marca.md) §7 stated one photographic rule with **one** exception,
naming Inspirações. That was already false when it was written: the data model
authorises three kinds of non-solo image — `papel: 'ambientada'` on a produto,
`Ambiente.imagem` on the home, and `FotoArtigo` in Inspirações — while
[`inspiracoes.md`](inspiracoes.md) §10 and [`institucional.md`](institucional.md)
both assert the exception is spent exactly once. Three closed specs disagreed.

The rule is restated as **two genres**, not one rule and an exception.

### 1.1 Retrato — the default

**The piece alone.** Raking late-afternoon light, raw plaster background, hard
long shadow, cast shadow inside the frame and never cropped. No styling, no
plants, no cup, no person. The product is not staged; it is observed.

Consumed by: `principal`, `detalhe`, `marcenaria.imagem`.

The marcenaria shot ([`home.md`](home.md) §7) is a retrato and **not** a third
genre: an unfinished piece or an exposed joint, alone, under the same light. No
hands, no workbench, no person — that section's argument survives without them.

### 1.2 Ambiente — the second genre

**A furnished room, same light, same plaster.** The raking light and the plaster
surfaces still hold; what is suspended is *the piece alone*, and only that.

**No human trace**, and this is binding, not stylistic:
[`inspiracoes.md`](inspiracoes.md) §4's prohibition **generalises to the whole
genre**. No person, and no object that implies one just left — no cup, no open
book, no throw folded back, no plants, no fruit. The room is furnished and empty.

This is load-bearing beyond aesthetics:
[`pagina-produto.md`](pagina-produto.md) §4.1 refused a human figure as a scale
device *citing the no-person rule as admitting no exception outside
Inspirações*. Generalising the prohibition to the genre keeps that refusal valid
and makes it stronger — there is now no photograph anywhere in the store
containing a person.

Consumed by: `ambientada`, `Ambiente.imagem`, `Colecao.imagem`, `Artigo.thumb`,
`FotoArtigo`.

### 1.3 What Inspirações actually holds

Inspirações' license was never the genre — it is the **composition**: three
photographs of one room, sequenced to build an argument, with a legend naming
real pieces. That remains unique to Inspirações and unavailable to any other
surface. `inspiracoes.md` §10's claim survives, restated: it holds the only
*editorial* use of the ambiente genre, not the only use.

No further genre may be opened. A request for a fifth kind of photograph is a
request to reopen `marca.md` §7.

---

## 2. Ratio discipline

Ratios are **enumerated, not free-form**. Three retrato ratios plus three fixed
slot ratios, and nothing else may be introduced.

| Token | Shape | Used for |
|---|---|---|
| `3:2` | horizontal | wide pieces; **all** ambiente-genre slots except the Abertura |
| `1:1` | square | roughly cubic pieces; **all** `detalhe` macros |
| `4:5` | vertical | tall pieces |
| `16:9` | wide | `Artigo.thumb` only |
| `21:9` | banner | the home's Abertura ([`home.md`](home.md) §0.5) only |

**`21:9` is a slot ratio, not a piece ratio.** It is reserved the way `16:9` is
reserved: to exactly one authored composition, and it is unavailable to
`Proporcao` — a Produto's frame is derived from its real measurements (§3) and no
piece is 2.33:1. `components/marca/proporcao.ts` therefore does not gain a row;
the Abertura declares its own box, which is what makes the reservation
enforceable rather than merely stated.

Adding a fifth ratio was weighed against cropping the photograph into `3:2`.
Cropping was refused because §4's contain-fit rule is the store's truth-telling
rule about images, and spending it to avoid one table row would be trading a
principle for a formatting preference. Enumeration exists to remove
arbitrariness; a named, reserved, single-use ratio is not arbitrary.

Free-form ratios were refused. `marca.md` §7 asks the frame to sit in the
piece's real proportion, which is a truth-telling rule, not a licence for
arbitrariness — and every authored composition in the store was built against a
known shape: the home's `78vh` hero cap and its 7/5 image-text pairs
([`home.md`](home.md) §1, §4, §7), the listing grid's deliberately ragged rows
([`catalogo.md`](catalogo.md) §5), the PDP's uncropped `principal`
([`pagina-produto.md`](pagina-produto.md) §2). A build session cannot compose
against a shape it does not know.

**The ragged grid survives.** Three enumerated ratios still produce unequal card
heights on a listing, which is exactly what `catalogo.md` §5 required when it
refused fixed card heights and baseline alignment. Enumeration removes
arbitrariness, not variation.

---

## 3. The ratio is derived, never authored

**A produto's `principal` ratio is computed from `medidas`.** No new field on
`Imagem`, no authored token.

```
larguraCm / alturaCm  >  1.15   →  '3:2'
larguraCm / alturaCm  <  0.87   →  '4:5'
otherwise                       →  '1:1'
```

`detalhe` is always `1:1` — a macro of a surface has no real proportion to
honour. `ambientada` is always `3:2`, being ambiente genre. Every non-produto
slot takes the fixed ratio in §0's table.

This is the better answer, and deliberately so.
[`produto.md`](produto.md) made `medidas` a mandatory `L × P × A` trio precisely
so physical fact is never optional, and `marca.md` §7 asks the frame to match the
piece's real proportion. Deriving the frame **from the measurements** makes that
rule mechanically true rather than a photographer's instruction, and it cannot
drift: an authored token can contradict the piece it frames; a derived one
cannot. It is the same move [`produto.md`](produto.md) made with price and
[`home.md`](home.md) §4 made with `{n} PEÇAS`.

**Consequence for the régua.** `Imagem.cotas` names which axes an image
annotates, and the derived ratio and the cota now read the same number from
`medidas`. A `4:5` piece annotated `largura` is not forbidden, but the natural
pairing is `3:2`/`largura` and `4:5`/`altura`, and the home's hero — which
[`home.md`](home.md) §1 requires to declare `cotas: ['largura']` — should be a
`3:2` or `1:1` piece. A `4:5` hero with a horizontal cota is legal and ugly.

---

## 4. Crop, fit and the square fields

**Photographs are never cropped to fit a container.** The image arrives at its
ratio and the container takes that ratio. This is what keeps the cast shadow
inside the frame (§1.1) without the rule needing enforcement anywhere else.

**The square thumbnails are fields, not frames.** [`carrinho.md`](carrinho.md)
§11 set a 96px square and [`checkout.md`](checkout.md) §11 handed over a 64px
square, flagging it as below the stated lower bound and asking for a
reconciliation.

**There is nothing to reconcile.** The square is a `--kozo` field and the
packshot is **contained** inside it at its real ratio, never cropped to it:

- cart keeps **96px**, checkout keeps **64px**, both correct;
- no square crop family is produced, so no cast shadow is ever cut;
- no fourth asset per product.

`checkout.md` §11's either/or is resolved as *neither* — the crop does not need
to serve 64px because no crop exists.

The same containment applies wherever a slot's fixed ratio and an image's derived
ratio disagree: the image is contained on `--kozo`, never cropped. In practice
this only arises for produto images in fixed-ratio slots, which no page does.

---

## 5. `alt`

`alt` is required on every image ([`produto.md`](produto.md)) and no
accessibility level makes a missing one acceptable. **How it is produced depends
on the slot**, because a template is worth more than a hundred hand-written
near-duplicates in some places and worthless in others.

### 5.1 Derived by template

| Slot | Template |
|---|---|
| `principal` | `{familia.nome} em {produto.acabamento} sobre reboco` |
| `ambientada` | `{familia.nome} em {ambiente.label}` |

Example: `Poltrona Lina em linho cru sobre reboco`.

The subject is predictable and the template is exact. Authoring these by hand
produces variation without information.

### 5.2 Authored

`detalhe`, `Ambiente.imagem`, `Colecao.imagem`, `marcenaria.imagem`,
`Artigo.thumb` and every `FotoArtigo`.

These are the images where `alt` does real work. A detail macro carries
information no template can reach — *A trama do linho cru no encosto* — and a
composed room is the whole point of Inspirações. Authored `alt` is what makes
the field's requiredness meaningful rather than ceremonial.

**Voice.** The annotation voice ([`marca.md`](marca.md) §4): a plain statement of
what is in the frame, sentence case, no final period, no *"imagem de"*, no
*"foto mostrando"*. It names the object, not the mood.

### 5.3 Decorative

None. There is no decorative image in the store — every slot in §0 carries
meaning, which is a consequence of the identity spending photography sparingly
rather than an accessibility position. `alt=""` never appears.

---

## 6. Loading, reservation and failure

`marca.md` §9 is a **closed list of two motions** — a colour transition on
pointer state, and the stale-content dim of §4.2 in [`erros.md`](erros.md) — over
a closed property allowlist, and it refuses scroll reveal and every form of entry
animation by name. That ban extends to image loading without qualification.

> This paragraph originally quoted §9's *provisional* wording ("a 120ms colour
> transition on interactive states, and nothing else"). §9 has since been
> resolved and the quotation would now be false. **Nothing below changes** — the
> resolved §9 §9.8 ratifies every refusal in this section by name.

- **No fade-in.** An opacity transition on load would be the only motion in the
  store that is not a colour change on interaction.
- **No blur-up / LQIP.** A blur resolving into a photograph is a *reveal*, which
  §9 bans in the same breath as parallax. This overrides the framework default.
- **No skeleton, shimmer or spinner.**

**The box reserves its ratio.** Every image container declares its aspect ratio
(§2, §3) before anything loads and holds a flat `--kozo` field until the image
paints. Cumulative layout shift is zero — which matters more here than in most
stores, because the listing grid is deliberately ragged
([`catalogo.md`](catalogo.md) §5) and shifting rows would be indistinguishable
from a bug.

**On failure the `--kozo` field simply stays.** No broken-image icon, no
placeholder glyph, no `IMAGEM INDISPONÍVEL`. This store has refused a fabricated
QR code ([`checkout.md`](checkout.md)), fabricated credentials
([`rodape.md`](rodape.md)), a fabricated founder biography
([`institucional.md`](institucional.md)) and a fabricated scale reference
([`inspiracoes.md`](inspiracoes.md)); an icon standing in for a photograph is the
same species of object. An absent image is absent.

**Priority.** The home hero's `principal` and the PDP's `principal` load eagerly.
Everything else is lazy. This is the only loading distinction the spec makes.

---

## 7. Desenho — the technical elevation

`Familia.desenho` ([`pagina-produto.md`](pagina-produto.md) §4.1) is the PDP's
scale mechanism and is **not a photograph**. It is **inline SVG line art**.

- 1px strokes in `--ink`; construction and extension lines in `--hairline`. No
  fill, no gradient, no shading, no perspective — an orthographic front
  elevation.
- **Dimension lines reuse the régua's grammar** ([`marca.md`](marca.md) §2):
  hairline with end ticks, the figure set in the annotation voice with
  `font-variant-numeric: tabular-nums`, `L {n} × P {n} × A {n} cm` with a
  multiplication `×`.
- Inline, not `<img>`, so it inherits colour tokens and stays crisp at any size.
- One per **família**, never per produto — geometry does not change with the
  finish, which is the invariant `pagina-produto.md` §10 created (*mesma família
  ⇒ mesmas medidas*).
- Ships at the container's width, its own intrinsic ratio; no reservation problem
  since it is inline markup, not a network image.

Raster was refused: a photograph of a drawing sits *beside* the régua instead of
sharing its grammar, and the whole reason the elevation won over a human
silhouette was that it speaks the identity's own language.

---

## 8. Marcas — the footer's third-party art

[`rodape.md`](rodape.md) admitted payment flags and Instagram/Pinterest marks as
the **single registered exception** to the store's zero-icon rule, and refused
third-party credential badges (Reclame Aqui, Ebit, PCI) outright. It fixed
*which* marks appear; this file fixes their **treatment**, which would otherwise
let full-colour brand art into a monochrome identity through the back door.

- **Monochrome SVG in `--muted`, 18px**, as `rodape.md` states.
- Payment flags are the **plain single-colour mark**, never the issuer's colour
  artwork, never a rounded card-shaped tile with a gradient.
- Social marks are the plain glyph, **unlinked**, with the handle in text
  alongside — per `rodape.md`.
- Inline SVG, so they take `currentColor`.
- No mark appears anywhere else in the store. The footer is the only surface with
  icons of any kind.

---

## 9. Data — corrections and confirmations

### 9.1 No new fields

**This ticket adds nothing to the data model.** Ratio is derived from `medidas`
(§3), `alt` is either templated or already an authored field, genre is a function
of `papel` and slot, and loading behaviour is presentational. The `Imagem` type
closes unchanged:

```ts
type Imagem = {
  src: string;
  alt: string;
  papel: 'principal' | 'ambientada' | 'detalhe';
  cotas: ('largura' | 'altura')[];
};
```

This is the first spec in the map to change no shape at all.

### 9.2 Correction — `Colecao.imagem`

[`produto.md`](produto.md) types `Colecao.imagem` as a full `Imagem`, which
carries `papel` and `cotas`. Neither is meaningful for a coleção: a collection
image has no `papel` in a produto's role vocabulary, and
[`home.md`](home.md) §9 already spends the page's second and last régua on the
coleção's `{n} PEÇAS` label — a cota on the coleção photograph would be a third.

`Colecao.imagem` becomes `{ src: string; alt: string }`, exactly as
`Ambiente.imagem` did, and for the reason `home.md` §8 gave: fields that exist
only to stay permanently empty should not exist. Applied to `produto.md`.

### 9.3 Required and rare — the volume rule

Four ambientes × ~4–5 curated tipos × 12 per page ([`catalogo.md`](catalogo.md)
§7), one Produto per acabamento ([`produto.md`](produto.md)) puts the catalogue
plausibly at 60–150 produtos. Three images each is 180–450 photographs before
Inspirações' twelve, the four ambientes and every família's elevation.

**Only `principal` is required.** `ambientada` and `detalhe` are **rare and
authored** — present on a named handful of pieces, absent everywhere else.

This costs nothing structurally: [`pagina-produto.md`](pagina-produto.md) §2 made
`papel` a *position instruction* and built the page to render deterministically
from whichever roles exist, and [`produto.md`](produto.md) fixed that roles are
named, not positional, so nothing is ever silently promoted into an empty slot. A
piece with only a packshot renders a PDP with no full-bleed breaks, correctly.

It is also truer to the position. A store where every SKU carries identical
three-image coverage is a catalogue; a store where the strongest pieces get the
full treatment is an atelier.

**Floor, so the full form is exercised:** at least one produto per ambiente
carries all three roles. Handed to the catalogue seed data — *resolved*, see [`dados.md`](dados.md) §7.2.

---

## 10. Sourcing — two phases

The store is built in two phases and **the imagery is not the same asset in
both**. This is a sequencing decision, not a compromise: the UI is finished
against placeholders, then the real set is generated once, against a locked
contract.

### 10.1 Phase 1 — Unsplash placeholders

Every `src` is an **Unsplash CDN URL, hotlinked**. Requires
`images.remotePatterns` for `images.unsplash.com` in `next.config.ts`, which is
currently bare — a build prerequisite.

**Repetition is explicitly fine.** The same photograph may serve twenty produtos.
No effort is spent curating the placeholder set, because none of it survives.

**To an auditor: repetition in this tree is not a defect.** It is the intended
state of phase 1, it is not a bug, and it costs no score. Do not file it, do not
add an invariant forbidding a repeated `src`, and do not curate the set
piecemeal to quiet a review — phase 2 (§10.4) replaces every asset in one pass
run by the repo owner, and its naming convention makes collision structurally
impossible. Divergent `alt` on two slots sharing one placeholder file is
likewise correct: `alt` is authored per slot (§5), against the image that will
ship, not against the hotlink standing in for it today. Recorded in
[ADR 0003](../adr/0003-placeholder-repetition-is-not-a-defect.md).

### 10.2 What binds in phase 1

The **structural** rules bind from day one; the **photographic** ones do not.

| Binds now | Suspended until phase 2 |
|---|---|
| Enumerated ratios (§2) and derivation (§3) | Raking late-afternoon light |
| Contain-fit, never crop (§4) | Raw plaster background |
| `alt` convention (§5) — templated and authored alike | Hard long shadow, uncropped |
| No fade, no blur-up, ratio reservation (§6) | The piece alone / no human trace |
| Required-and-rare (§9.3) | Genre discipline (§1) |

**And one rule that exists only in phase 1: a placeholder is never evidence.**

No layout, crop, ratio, section or composition decision may be made *because a
placeholder looked right or looked wrong*. If a section reads weak, the cause is
its structure, never its stock photograph — and if a section reads strong for the
same reason, that is worth less than nothing. Every visual judgement in phase 1
is made against the specs, not against the screen.

Suspending ratios too was refused: ratio is the shape every authored composition
in the store was built against, so a build that ignores it is composing against a
shape it will never ship.

### 10.3 One carve-out — the cart's argument

[`carrinho.md`](carrinho.md) §11 kept the thumbnail on exactly one argument: two
acabamentos of the same família **share a `nome` and differ only in a
photograph**, so the image catches the highest-frequency error the data shape
permits. With repeated placeholders that safeguard is untestable during precisely
the phase in which the cart is built.

**Carve-out:** the família that carries two acabamentos
([`pagina-produto.md`](pagina-produto.md)'s *outros acabamentos* strip requires at
least one) gets **two visibly different placeholders**. Correctness is
irrelevant; distinguishability is the whole point — different material, different
colour, obviously not the same object.

One deliberate pick out of hundreds of arbitrary ones, and it is the difference
between building the cart against its actual argument and building it against a
wall of identical squares.

### 10.4 Phase 2 — the generated set

Generated from the prompt spine (§11), **landed locally**, and every `src`
rewritten from an Unsplash URL to a local path in a single one-time pass.

```
public/img/produtos/{produto.slug}-{papel}.jpg
public/img/ambientes/{ambiente.slug}.jpg
public/img/colecoes/{colecao.slug}.jpg
public/img/artigos/{artigo.slug}-thumb.jpg
public/img/artigos/{artigo.slug}-{1|2|3}.jpg
public/img/home/marcenaria.jpg
public/img/desenhos/{familia.slug}.svg
```

The shipped store serves its own images. These are the brand's assets, generated
to its own contract; serving them from a third-party photo CDN would be strange
for a shipped site quite apart from the hotlinking. `remotePatterns` is removed
at the same time.

**The naming convention is the phase-2 manifest.** It has no role in phase 1 —
under hotlinking the data holds remote URLs — but the file list *is* the
generation worklist, and the rewrite is mechanical against it.

---

## 11. The prompt spine

Written now, deliberately. This is the artefact that makes phase 2 a chore rather
than a second design effort: if the spine is deferred, phase 2 reopens
`marca.md` §7 and re-decides it under deadline, which is exactly what a map
exists to prevent.

### 11.1 Common to both genres

- **Light:** late-afternoon sun, low and raking, entering from the **left**;
  constant across the entire set. Warm, unfiltered, direct.
- **Shadow:** one hard long cast shadow falling **to the right**, fully inside
  the frame, never clipped by any edge. Constant direction is what makes the set
  read as one afternoon.
- **Background/surface:** raw unpainted plaster (*reboco*), matte, faintly
  uneven, tonally matched to `--reboco`. No skirting detail, no visible outlet,
  no texture that reads as a material sample.
- **Colour:** the palette of `marca.md` §3 and nothing outside it. No saturated
  object anywhere in frame. **Índigo never appears in a photograph** — it is the
  interface's only accent and the identity spends it on state, not on props.
- **Camera:** eye height for retrato, standing height for ambiente. Straight-on,
  no dutch angle, no low hero angle, no top-down.
- **Lens character:** neutral, no wide-angle distortion, no bokeh-heavy
  isolation. The piece is observed, not dramatised.
- **Absolutely no text, no watermark, no logo, no signage** in any frame.

### 11.2 Retrato

- The piece **alone** on plaster. Nothing else in frame.
- Centred with generous margin; the piece occupies roughly two thirds of the
  frame's shorter axis, so the régua has room along an edge.
- Framed at the ratio §3 derives for that piece.
- `detalhe` is a `1:1` macro of one real surface — a weave, a joint, a grain, an
  edge — under the same light, shallow but not abstract.

### 11.3 Ambiente

- A furnished room in the same plaster architecture, same raking light.
- **Empty of people and of human trace** (§1.2) — no cup, no open book, no throw
  folded back, no plants, no fruit, no shoes, no half-read anything.
- Furnished plausibly for its `Ambiente`, with the named produtos present and
  legible enough for Inspirações' legend to point at them.
- `3:2`, except `Artigo.thumb` at `16:9`. **The thumbnail is a distinct
  generation, not a crop of a `FotoArtigo`** — `inspiracoes.md` §10 requires it to
  hold up at 5 columns and at 2, which a re-crop of a wide establishing shot does
  not.

### 11.4 Desenho

Not generated. Drawn as SVG per §7.

---

## 12. Constraints handed to other tickets

- **[Motion & transition conventions](../../.wayfinder/tickets/017-motion.md)** —
  §6 asserts **no image motion of any kind**: no fade-in, no blur-up, no
  skeleton, no hover swap, no zoom-on-hover, no scroll reveal on the full-bleed
  breaks. That ticket may generalise the rule but should not weaken it; the
  120ms colour transition remains the only motion in the store.
- **[Error, 404 & loading surfaces](../../.wayfinder/tickets/016-error-surfaces.md)**
  — §6 fixes the *per-image* failure state (the `--kozo` field stays, nothing is
  drawn). Page-level loading and error surfaces remain that ticket's, and it
  should not introduce a skeleton grid of image placeholders, which would
  contradict §6.
- **[Route metadata & SEO](../../.wayfinder/tickets/015-route-metadata.md)** —
  every produto has a `principal` and it is the natural OG image, but its derived
  ratio is `3:2`, `1:1` or `4:5` and **never** the 1.91:1 social cards expect.
  That ticket owns whether OG images are contained on `--kozo` at 1200×630 (the
  answer consistent with §4) or generated separately.
- **Catalogue seed data** (map, *Not yet specified*) — three demands. Every
  produto needs `medidas` populated or §3 cannot derive a ratio and the box
  cannot reserve. At least one produto per ambiente carries all three `papel`
  roles (§9.3). The two-acabamento família needs visibly distinct placeholders
  (§10.3).
- **Accessibility commitments** (map, *Not yet specified*) — §5 fixes the `alt`
  *convention*; the commitment level is still that patch's. §5.3's claim that no
  decorative image exists should be checked against whatever level is asserted.

---

## Deliberate omissions

Considered and ruled out — recorded so they are not relitigated:

- **A third photographic genre** — §1. Marcenaria is a retrato; the request for a
  fourth kind is a request to reopen `marca.md` §7.
- **People, in any photograph anywhere** — §1.2, now exceptionless store-wide.
- **Free-form per-piece ratios** — §2.
- **An authored `ratio` token, or per-image `w`/`h`** — §3.
- **Square crops of packshots for the cart and checkout thumbnails** — §4.
- **A fourth asset per produto of any kind** — §4, §9.3.
- **`alt=""` / decorative images** — §5.3.
- **Blur-up, LQIP, fade-in, skeletons, spinners** — §6.
- **A broken-image icon or `IMAGEM INDISPONÍVEL` text** — §6.
- **Hover image swap and zoom/lightbox** — already refused by
  [`pagina-produto.md`](pagina-produto.md) §2.1 and [`catalogo.md`](catalogo.md);
  restated here so no imagery-side reading reopens them.
- **Raster technical drawings** — §7.
- **Full-colour payment brand artwork** — §8.
- **Third-party trust badges** — refused by [`rodape.md`](rodape.md), not
  reopened.
- **Curating the placeholder set** — §10.1. Repetition is fine; none of it ships.
- **Keeping generated images on a remote CDN** — §10.4.
- **Deferring the prompt spine to phase 2** — §11.
