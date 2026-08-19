---
title: Legal copy verification pass
parent: map
labels: [wayfinder:research]
assignee:
blocked-by: []
status: open
---

## Question

What is the verified statutory wording behind the store's legal copy, and does any
of the four surfaces carrying it need correcting?

Graduated from fog now that the frontier is otherwise empty. The patch has been
accumulating since [Brazilian e-commerce UX conventions](004-br-ecommerce-conventions.md),
whose statutory text came from a **mirror, not planalto.gov.br** — every surface
below was written against that unverified source.

**This is one pass over all four surfaces, not four passes.** They repeat each
other, and a correction to the arrependimento wording has to land in three places
at once or they contradict.

The four surfaces:

- **Footer** ([`rodape.md`](../../docs/spec/rodape.md)) — identification block
  (razão social, CNPJ, address) and the ostensive 7-day arrependimento notice.
- **Cart** ([`carrinho.md`](../../docs/spec/carrinho.md) §5) — the arrependimento
  sentence beneath the CTA, prose rather than badge.
- **Checkout** ([`checkout.md`](../../docs/spec/checkout.md)) — the LGPD purpose
  line closing Identificação, plus the arrependimento notice repeated on
  `/pedido-confirmado`.
- **Policies** ([`institucional.md`](../../docs/spec/institucional.md)) — the four
  `/politicas/[slug]` documents, whose **content points are fixed but whose wording
  was deliberately deferred to this pass**.

Verify against primary sources:

- **CDC** (Lei 8.078/1990) art. 49 — the arrependimento right. Confirm the period,
  what triggers it, and whether "7 dias" is the correct framing.
- **Decreto 7.962/2013** — e-commerce disclosure duties: what identification the
  supplier must display, and where.
- **LGPD** (Lei 13.709/2018) — what a purpose line must actually say for the data
  the checkout collects (nome, CPF, e-mail, endereço).

Decide:

- Whether any currently-specified wording is **wrong**, as opposed to merely
  paraphrased — and correct it in place in the affected spec.
- The **shippable pt-BR wording** for the four policy documents' statutory
  paragraphs. [Institutional pages](013-institucional.md) fixed content points
  precisely so this ticket could write the words.
- One constraint inherited from [Route metadata & SEO](015-route-metadata.md):
  each policy document's **first sentence must be self-contained**, because it
  ships as that page's meta description.
- Whether the fictional store's CNPJ and razão social need any disclaimer — a
  fabricated CNPJ is displayed ostensively as if real, which is the one place the
  store's concept framing and its legal copy collide.

Output: corrections in place to the four specs; new wording into
[`institucional.md`](../../docs/spec/institucional.md); citations into
`docs/research/`.
