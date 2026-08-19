---
title: Cart sections
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: [009-product-detail]
status: closed
---

## Question

What does the cart contain, and is it a page, a drawer, or both?

Line-item anatomy, quantity and removal affordances, the order summary and what it itemises, frete estimation, cross-sell placement, the empty state, and the path onward to checkout.

Output: `docs/spec/carrinho.md`.

## Resolution

Spec written to [`docs/spec/carrinho.md`](../../docs/spec/carrinho.md).

**Page, not drawer** — already fixed by [`navbar.md`](../../docs/spec/navbar.md)
§7; the ticket's open half was everything else.

- **No régua.** The cart is the first surface in the system without the signature
  gesture, recorded as an authored absence. The only two figures available to
  annotate are a summed-cm (absurd) and the item count — and a count the reader
  can obtain by counting the lines in front of them makes the régua decorative,
  which the identity forbids. Consequence: índigo is spent exactly once, on the
  Pix badge.
- **Thumbnail in, cm out.** Opposite calls that look alike. The image stays
  because one Produto per acabamento means two finishes share a `nome` and differ
  only in a photograph — buying the wrong finish is the highest-frequency error
  the data shape permits, and the cart is the last cheap place to catch it. The
  width goes because [`catalogo.md`](../../docs/spec/catalogo.md) put it on the
  card as the debt for keeping cm out of `nome`, and that debt is paid where a
  piece is *being chosen*, not where it already is.
- **Montagem is an attribute of the line, not a sibling line**, with an editable
  checkbox. A sibling line asks whether it can be removed on its own and has no
  good answer either way; as an attribute the impossible state is
  unrepresentable. This resolves a live contradiction between
  [`pagina-produto.md`](../../docs/spec/pagina-produto.md) §2.8 and §11 in favour
  of §11, and §2.8 was corrected in place.
- **Freight is stated, never summed.** One estimate (`A PARTIR DE`) for the
  session CEP, outside the arithmetic, with the modality choice left to the
  checkout. A figure inside the total is a promise, and it would move between two
  screens once the modality is picked.
- **No delivery groups.** Per-line prazo annotation plus one synthesising
  sentence in the resumo when prazos diverge. Visual grouping reorders the list
  under the reader in response to an edit they did not make; a single
  longest-prazo figure lies about the piece that ships next week.
- **Text stepper and the word `REMOVER`**, no undo, no `×` — the cart does not
  get a second exception to the icon ban.
- **An `esgotado` line stays, is marked, and blocks the CTA** — and still counts
  in the total, because silently excluding it produces the "why did my total
  change" defect. Reachable only by a piece that changed after being added, since
  the PDP already refuses to add one.
- **Sticky resumo on desktop, no fixed mobile bar.** The PDP's refusal was
  reasoned from what the chrome would cover; the cart has nothing underneath
  worth protecting, but a floating mobile CTA would hover over its own
  destination.
- **Empty cart** (fog item, now cleared): one line plus a single link to
  `/produtos`, full footer kept — the pattern
  [`catalogo.md`](../../docs/spec/catalogo.md) §8 set for zero results.
- **Out:** coupon field, cross-sell, saved-for-later, drawer, régua.
- **Also fixed here:** the mock freight rule
  [`produto.md`](../../docs/spec/produto.md) deferred to this ticket — six
  CEP-prefix regions with base + per-kg tiers and prazos, cubed weight at /6000,
  agendada at +R$ 100, unserved prefixes as an error rather than a silent
  fallback.

`Produto` gains no field. `Carrinho` / `ItemCarrinho` are client state only.
