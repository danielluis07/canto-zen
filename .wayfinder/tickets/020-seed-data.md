---
title: Catalogue seed data
parent: map
labels: [wayfinder:grilling]
assignee:
blocked-by: []
status: open
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
