---
title: Checkout sections & the concept disclosure
parent: map
labels: [wayfinder:prototype]
assignee: danielluis07
blocked-by: [004-br-ecommerce-conventions, 010-cart]
status: closed
---

## Question

What does the single-page checkout contain, and how does the app disclose that it is a concept?

The accordion sections (identificacao, entrega, pagamento) and the sticky order summary, the address/CEP flow, and how payment methods are *presented* given nothing is processed.

The second half is the real design question: when the user clicks pay, how is it made clear this is a demo? A modal, a dedicated confirmation surface, a persistent site-wide banner, or something more deliberate. It should read as intentional and well-made, not as an error. Prototype the moment rather than describing it.

Output: `docs/spec/checkout.md`, plus the disclosure prototype linked as an asset.

## Resolution

**Direction A — Interstício.** `FINALIZAR PEDIDO` runs a 1500ms processing beat
which resolves not into a receipt but into a full-bleed typographic statement
(`Nada foi cobrado.`, Mincho, no chrome, no régua, no índigo), with the full
order record one click behind it. The beat is what makes the statement legible
as authored rather than apologetic, and staging the admission is what frees
`/pedido-confirmado` to be a complete, competent record instead of a surface
fighting to carry a caveat. It is a **phase of `/checkout`, not a route**, so
`rotas.md` is unchanged.

**B — A confirmação é a revelação** lost on its most visible element: rendering
the number as `Pedido nº —` is indistinguishable from a rendering bug, failing
this ticket's own "intentional and well-made, not an error" condition.
**C — Antes do clique** lost because a notice inside a form is read as fine
print — it spends the admission at the moment of least attention and leaves the
moment of most attention empty. **D — a persistent site-wide banner** was ruled
out unprototyped: the identity has no slot for permanent chrome, and a band on
every route dilutes into wallpaper by the third page.

**Sections.** Sequential accordion, one open at a time, completed sections
collapsing to a summary line with `ALTERAR` (soft lock — a later section opens,
it just cannot submit). Identificação takes the four BR-standard fields with
**CPF check digits validated for real** and one LGPD purpose line, and **no
PF/PJ toggle** despite the Escritório room. Entrega opens pre-filled from the
session CEP, autofills from a **fixture table** (no service — the map rules out
backend), and carries the freight modality choice; **selecting it visibly
recomputes the resumo total**, which is the payoff `carrinho.md` §5.2 bought by
keeping freight outside the cart's arithmetic. Pagamento is **Pix + cartão, no
boleto**, with the mandatory parcelas dropdown against the freight-inclusive
total, card Luhn-checked and nothing more, and — the honesty rule this page
turns on — **no QR code, on either surface, and no expiry countdown**.

**Chrome.** Wordmark-only navbar (no room links, no `CARRINHO (n)` — the resumo
answers it), the reduced footer `rodape.md` §9 already specified, and a **sticky
mobile total bar**, the one place `carrinho.md` §5.5's refusal does not transfer,
because here the chrome covers nothing that matters.

**Índigo and régua.** Selection resolves in **ink, never índigo** — solid `--ink`
fill in the radio box, `--ink` border on the row — which spends índigo exactly
once, on the Pix badge, making the single coloured thing on the payment screen
the legally required discount disclosure. No régua on any of the three surfaces.

**CTA is `FINALIZAR PEDIDO`** — not `PAGAR` (naming an act the system does not
perform is the one place the store would lie), not a self-aware label (it
pre-empts the moment). An `esgotado` line still blocks it, per `carrinho.md` §6.

**The cart is cleared at the transition** and `/pedido-confirmado` **redirects to
`/` on cold arrival** — a page rendering a fictional order to someone who did not
just place it is the one genuinely misleading artefact this flow could produce.

Full spec in [`docs/spec/checkout.md`](../../docs/spec/checkout.md). Three
directions captured on branch `prototype/checkout-disclosure` (commit `a60d4da`)
— throwaway, must not be promoted.
