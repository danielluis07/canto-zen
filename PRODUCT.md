# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two audiences, and they are not the same person.

**The real audience — portfolio and hiring.** Recruiters, hiring managers and
prospective clients evaluating frontend and design craft. They arrive from a
link, spend a few minutes, and judge depth of detail rather than commercial
outcome. This is the audience whose reaction actually matters, and it is why
visible polish and internal rigour both count as product value here.

**The fictional audience the storefront is designed for.** A Brazilian buyer
furnishing a room — someone who needs measurements before deciding, who expects
to see the à-vista price and the parcelamento together, and who wants frete
quoted by CEP before committing rather than discovered at checkout. Every
surface is written for this person; the store's Ambiente spine (Sala, Quarto,
Cozinha, Escritório) is the shape of how they shop.

## Product Purpose

Canto Zen is a fictional Brazilian home-furniture e-commerce concept store — a
high-end atelier in a japandi register, selling signed, made-to-order pieces from
an in-house marcenaria. It exists to demonstrate that a storefront can honour the
full commercial apparatus Brazilian buyers expect (à-vista, Pix, parcelamento,
CEP-quoted frete, statutory arrependimento notice) without adopting the shouted
red-and-yellow voice that usually carries it.

Success is a reader who moves through fifteen routes and finds no seam: no
placeholder, no fabricated proof, no surface that contradicts another.

## Positioning

**Discreet price, never absent price.** The atelier register normally hides price
behind "sob consulta". Canto Zen refuses both that and the discount-shout. The
commercial facts appear in full, set in the annotation voice — small, tracked,
tabular figures. The reconciliation is one of voice, not presence.

**The régua.** The identity's signature is a hairline rule with end ticks
carrying a real measurement in centimetres alongside a photographed piece. It is
ornament and data at once: furniture is a category where measurement decides the
purchase, so the most memorable device is information the buyer needed anyway. A
régua without a real figure behind it is prohibited.

## Operating Context

- **Language is pt-BR throughout** — copy, domain terms, identifiers, URL paths
  and query keys alike. No English seams. Paths are ASCII-folded (`/escritorio`);
  copy keeps its accents ("Escritório").
- **Rooms are the spine.** Ambientes sit at the top level of the URL space; a
  Produto has exactly one URL regardless of the room it was reached through.
- **Specs are the authority.** `CONTEXT.md` is the glossary; `docs/spec/` holds
  sixteen page and system specs; `docs/adr/` holds decision records;
  `docs/build-spec.md` sequences the build. Where build-spec and a page spec
  disagree, the page spec wins. Three specs correct earlier ones in place —
  `dados.md` §11 lists them; read the correction, not only the section.
- **`docs/spec/acessibilidade.md` is normative, not a summary**, and carries a
  precedence rule: a page spec may sharpen a floor, never lower one.
- **`.wayfinder/`** holds the twenty closed tickets the specs were resolved from.

## Capabilities and Constraints

**Built and complete.** All fifteen routes in `docs/spec/rotas.md` render real
data: home, four room landings, enumerated room×tipo listings, the flat
`/produtos` listing and product detail, coleções, four Inspirações articles,
carrinho, checkout, confirmation, sobre, contato, and four políticas. Current
work is refinement of surfaces that already exist, not new construction.

**No backend, permanently.** This is a durable constraint, not a stage. Nothing
is persisted server-side, nothing is transmitted, no payment is processed. The
carrinho keeps its own state in the browser; the checkout's pay button leads to
an interstício that says plainly that nothing was charged and nothing left the
browser. That disclosure must stay true — future work must not add real
commerce, real persistence, or a real payment path.

**Derivation over storage.** One catálogo module holds sixty-five produtos,
fifty-nine famílias and six taxonomy entities, and exposes derived figures as
functions rather than stored fields. `precoTabela` is the only authored price;
à-vista, parcelamento and montagem are derived from it by store-wide policy.
Frete is cubed — driven by the box, not the price. Nine fields have rules rather
than values. Every page reads that module and nothing else.

**Tokens are declared once** as CSS custom properties on `:root`, with a
two-family type scale and a closed two-entry motion vocabulary. No page invents a
value.

**Cross-references bind surfaces built days apart.** `destaqueHome`, each
coleção's `produtos[]` and all twelve `FotoArtigo.pecas[]` arrays are produto
slugs; an invented name leaves the home and Inspirações pointing at nothing and
TypeScript will not say so.

**Stack.** Next.js 16 (App Router), React 19, Tailwind v4, Zustand, TypeScript,
lucide-react. Runtime and package manager are Bun. Self-hosted fonts in `fonts/`
(Zen Old Mincho, Schibsted Grotesk). Next.js in this repo has breaking changes
from training data — read `node_modules/next/dist/docs/` before writing code.

**Known gap, named rather than omitted:** there is no browser-driven interaction
test layer.

## Brand Commitments

- **Name:** Canto Zen. **Register:** japandi atelier — quiet, disciplined, with a
  single bold gesture. The entire personality lives in the régua; everything else
  stays calm. That is what keeps fifteen routes coherent instead of wallpapered.
- **Palette, fixed** (`docs/spec/marca.md` §3): `--ink` #1B1A18, `--plaster`
  #FCFCFB, `--kozo` #F1F0EC, `--oak` #C6B49A, `--hairline` #DEDDD8, `--indigo`
  #223244, `--muted` #6B675F. **No dark mode.** `--indigo` is the sole chromatic
  accent and is rationed for interaction. `--hairline` is a divider and panel
  edge, never a control border. The three grounds were cooled toward white in
  [ADR 0001](docs/adr/0001-grounds-cooled-toward-white.md); `--oak` did not move.
- **Type:** Zen Old Mincho is the one display face and signs the wordmark;
  Schibsted Grotesk carries everything else. The annotation voice — small,
  tracked, tabular — carries every commercial figure.
- **Zero-icon rule for chrome.** The interface stays wordmarked: `CARRINHO` with
  a tabular `(n)` that vanishes at zero, `MENU` as the mobile trigger. The cart
  is a link to `/carrinho`, never a drawer trigger.
- **Ordinal numbering (01 / 02 / 03) is out of the system.** Nothing here is a
  sequence the reader must follow in order.
- **The Abertura** is the home's opening band and belongs to the home alone: one
  wide room photograph, one line, one link, no price and no régua.
- **`/sobre` is the page of refusals** — five statements, four refusals and one
  affirmation. Its copy is fixed and shipped, not direction to be paraphrased.

## Evidence on Hand

- **Real:** all catalogue data, prices, dimensions, freight arithmetic and policy
  copy are authored and internally consistent. Legal copy was verified against
  Brazilian requirements in `docs/research/legal-copy-verification.md`; market
  conventions in `docs/research/br-ecommerce-conventions.md`.
- **Fictional but well-formed:** the Loja object — razão social, CNPJ, IE,
  founding year, address, atendimento channels, showroom hours. The CNPJ
  discloses that it is fictional, because it is the one fabricated artefact with
  a third party behind it and must not pass as real.
- **Photography** is generated or from Unsplash. Phase 1 ships hotlinks;
  structural image rules bind, photographic ones do not yet, and a placeholder is
  never evidence.
- **Absent, and must not be invented:** customers, testimonials, press,
  benchmarks, real sales, stock counts, audit results, cross-sell recommendation
  data, and any Inspirações metadata (no date, no author, no category).
- **Not code to lift:** three prototype branches (`prototype/brand-direction`,
  `prototype/navbar`, `prototype/checkout-disclosure`) are evidence for decisions
  already recorded. None is promotable.

## Product Principles

1. **A refusal is a decision, not a gap.** Eight standing refusals and five
   authored absences were each argued across two or three tickets. The instinct
   to soften one — add a skeleton, a fade, an `offers` node, an
   `IMAGEM INDISPONÍVEL` fallback, a rounded corner — is the failure mode. The
   reasoning is written down where the refusal is.
2. **Never fabricate to cover a gap.** An absence stated plainly beats a
   plausible invention. This is why the store admits it is a concept rather than
   simulating a purchase.
3. **Derive, never duplicate.** One authored number per fact; every other figure
   is a function of it. Two copies of a truth are two chances to disagree.
4. **Quiet everywhere, bold in one place.** Discipline across the whole surface
   is what makes the single gesture legible. Spending personality twice spends it
   to zero.
5. **Say what is true in the buyer's own terms.** pt-BR throughout, statutory
   notices ostensive rather than filed away, price and prazo present rather than
   withheld — in the annotation voice, never shouted.

## Accessibility & Inclusion

The floors are normative and live in `docs/spec/acessibilidade.md` §2. The store
**does not claim WCAG 2.2 AA conformance** — no audit has been performed, and
asserting an untested standard is a claim it cannot support. It commits instead
to a checkable list: text contrast ≥ 4.5:1 at every size in the scale (the
smallest voice is 0.6875rem, so no large-text exemption is available or taken);
interactive boundaries ≥ 3:1; focus always visible at `2px solid var(--indigo)`
with `outline-offset: 3px`, and focus is a cut, never a transition;
`prefers-reduced-motion: reduce` honoured by one global rule that keeps the end
state and drops the interpolation; every overlay keyboard-operable and
dismissible; state announced, not only shown; no information carried by colour
alone; every image carries an authored or templated `alt`, so `alt=""` never
appears; `<html lang="pt-BR">`.

The difference from claiming AA is provenance, not altitude.
