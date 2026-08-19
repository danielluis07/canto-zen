---
title: Catalogue seed data
parent: map
labels: [wayfinder:grilling]
assignee: wayfinder-session
blocked-by: []
status: closed
---

## Question

What sample catalogue does the spec fix, and how much of it does the spec author
versus leave to the build session?

Graduated from fog now that the frontier is otherwise empty. The product *shape*
was settled by [Product data shape](003-product-data-shape.md); the *set* never
was. **This is the last thing a build session would still have to invent**, which
is the destination's own bar.

Eight closed tickets have each added a demand. The set must satisfy all of them
simultaneously — that is the hard part, and it is why this is one ticket:

- **[Home](007-home.md)** — 1 + 3 authored produto slugs; one Coleção with a
  non-empty `produtos[]`; three articles; four Ambiente photographs. The hero
  slot needs a produto whose `principal` declares `cotas: ['largura']` or it
  cannot render.
- **[Catalogue](008-catalog.md)** — 12 per page, so every curated tipo needs
  enough pieces that its grid is not two items; all three `disponibilidade`
  states exercised; all four price brackets; at least one piece under two
  ambientes.
- **[Product detail](009-product-detail.md)** — every família needs a `designer`
  and a dimensioned technical drawing; every Material needs a `cuidados` line; at
  least one família needs **two acabamentos** or the *outros acabamentos* strip
  never renders anywhere.
- **[Cart](010-cart.md)** — `embalagem` authored on every piece or the freight
  rule produces no number; at least one `envio-imediato` and one `sob-encomenda`
  piece plausibly bought together, or the divergent-prazo sentence never appears.
- **[Checkout](011-checkout.md)** — a **CEP fixture table**, not pieces: all six
  freight regions plus at least one *região não atendida* prefix.
- **[Inspirações](012-inspiracoes.md)** — exactly four `Artigo`, one per ambiente,
  each with abertura, one-line resumo, two passagens, three room photographs, a
  16:9 thumb, and 2–5 produto slugs per legend with **no piece named twice within
  an article**; every piece named must list under that article's room.
- **[Imagery](014-imagery.md)** — `medidas` populated on **every** produto or the
  image box cannot derive its ratio; at least one produto per ambiente carrying
  all three `papel` roles; the two-acabamento família needs two **visibly
  different** placeholders. It also shrinks the burden: only `principal` is
  required, and phase 1 hotlinks Unsplash with repetition allowed, so the image
  cost here is near zero.

Decide:

- **How many pieces**, and their distribution across the four ambientes and their
  curated tipos — driven by the 12-per-page grid, not chosen round.
- **Does the spec author named pieces with their copy, or fix only a shape and
  counts?** The whole map has authored copy direction rather than copy, with
  [Institutional pages](013-institucional.md) as the one registered exception.
  This ticket either extends that exception or holds the line — and holding it
  means a build session invents piece names, which is the thing the destination
  says it must not do.
- **Where the seed data lives** — a spec file under `docs/spec/`, or a data file
  the build session consumes. The map has produced only prose so far.
- Whether the demands above **conflict** — the set is small and the constraints
  are many, so at least one is likely unsatisfiable as stated and needs a spec
  corrected rather than a piece added.

Output: whichever file the third bullet decides.

## Resolution

**65 produtos across 59 famílias**, authored to identity depth, in
[`docs/spec/dados.md`](../../docs/spec/dados.md).

**The volume was forced, not chosen.** The curated taxonomy is **20 tipos**, not the
"~4–5 per ambiente" [`imagens.md`](../../docs/spec/imagens.md) §9.3 assumed when it
guessed the catalogue at 60–150. Against a three-column grid, a tipo needs 3 pieces or
it renders a broken row — so the floor is 60, and §9.3's estimate survives with no
headroom at all. Three rooms get a bump on their spine tipo; **Escritório deliberately
does not**, because 12 is the pagination boundary and the set needed one room that
renders a single full page with no pagination control. That case was otherwise
untested.

**Depth: identity authored, everything else ruled.** The ticket framed this as whether
to extend the [Institutional pages](013-institucional.md) copy exception or hold the
line. It resolved on a different axis entirely: `ConteudoHome.destaqueHome`,
`destaques[3]`, `colecaoDestaque`, `Colecao.produtos[]` and all twelve
`FotoArtigo.pecas[]` arrays are **produto slugs**. A build session that invents names
leaves `home.md` and `inspiracoes.md` pointing at nothing — so identity is authored for
**reference integrity**, not because copy deserved a second exception. Prose stays
direction-plus-template exactly as everywhere else. The nine derived fields each get a
rule in §8 precise enough that two sessions produce the same catalogue; `descricao`
gets a three-sentence structure, not sentences.

**Location: one file, `docs/spec/dados.md`.** The deliverable *is* cross-reference
integrity, and splitting the tables is how those references drift. The CEP fixtures
ride along in their own section rather than earning a file.

**The ticket predicted a conflict. There were three, and the first is the real one.**

1. **The freight regions were unusable.** [`carrinho.md`](../../docs/spec/carrinho.md)
   §8 double-assigned prefixes 76–78 — `custo` and `prazoDiasUteis` both undefined
   there — and, worse, the six regions between them **covered every prefix 01–99**, so
   *região não atendida* was **unreachable**. [`erros.md`](../../docs/spec/erros.md)
   §5.2 builds its entire `Fato` copy class on that state and
   [`checkout.md`](../../docs/spec/checkout.md) §6 demands a fixture for it. Three
   specs describe an error the rule cannot produce. Corrected: 77 → Norte, 78–79 →
   Centro-Oeste (real CEP geography), and **`69` carved out** as não atendida — Acre and
   Roraima, plausibly beyond a São Paulo atelier's reach, and chosen over dropping
   Norte precisely so `carrinho.md`'s own São Paulo-vs-Belém argument survives.
2. **`home.md` §1 reads `produto.designer`**, a field that lives on `Familia`. Resolves
   via `familia`.
3. **`/politicas/prazos-e-entrega` is a 404** — three links across `checkout.md` and
   `erros.md` point at a slug `rotas.md` never enumerated. The target is
   `entrega-e-frete`.

**One thing recorded rather than fixed:** cubed weight at `/6000` makes furniture
freight genuinely enormous — the hero sofá quotes ≈ R$ 2.664 to São Paulo and
≈ R$ 5.856 to Belém, over half its price. That is arithmetically right and true to
Brazilian furniture freight, so it is written down as intentional, and `freteGratis`
lands on the five largest pieces so the worst numbers never render.

**Output**: new [`docs/spec/dados.md`](../../docs/spec/dados.md) — distribution and its
derivation, the 65-row catalogue, six entity tables, cross-listings, the corrected
freight regions and seven CEP fixtures, four article legends, `ConteudoHome`, nine
derivation rules, and the handoff list for the build effort.
