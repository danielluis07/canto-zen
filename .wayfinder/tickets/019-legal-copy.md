---
title: Legal copy verification pass
parent: map
labels: [wayfinder:research]
assignee: wayfinder-session
blocked-by: []
status: closed
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

---

## Resolution

**The mirror was accurate — and that is the finding that shaped the pass.** Every
statutory sentence [ticket 004](004-br-ecommerce-conventions.md) quoted from
`modeloinicial.com.br` matches planalto.gov.br verbatim, so the debt paid here was
**provenance, not error**. Which means all six corrections found are in the
*application* of correct text: nobody misquoted the law, four surfaces misread it.
Citations, verbatim quotes and the findings table live in the new
[`docs/research/legal-copy-verification.md`](../../docs/research/legal-copy-verification.md).

**Two corrections change what the store promises, and both come from Decreto 7.962
art. 5º:**

1. **The withdrawal tool was wrong.** [`rodape.md`](../../docs/spec/rodape.md) §3
   named WhatsApp and e-mail as *the* means, and
   [`institucional.md`](../../docs/spec/institucional.md) had hardened that into a
   content point — *the atendimento channel **is** the tool, since there is no
   customer area*. Art. 5º §1: the consumer may withdraw *pela mesma ferramenta
   utilizada para a contratação, sem prejuízo de outros meios*. The contract is
   concluded on the site, so the site must accept the withdrawal; the two off-site
   channels are the *outros meios*, permitted **in addition, never instead**. The
   reasoning that produced the error was sound and the conclusion still wrong: auth
   is out of scope, so "no customer area" read as "no in-site tool" — but `/contato`
   is a form on the site, and a form on the site is the ferramenta. Resolved as
   **`/contato?assunto=arrependimento`**, which prefills `Mensagem` and adds one
   annotation line. §9's refusal of an *assunto* select survives intact, because the
   select would have been a control the user operates into inboxes that do not
   exist; this is a link the store aims.
2. **"Respondemos em até 5 dias" attached the wrong duty to the wrong clock.** Art.
   5º §4 requires *confirmação imediata do recebimento*, and art. 4º VI requires it
   **by the channel the consumer used**. Five days is resolution. One sentence
   promised the slower thing about the faster duty; it now splits.

**One "open question" turned out to be closed all along.** `institucional.md` listed
*who pays return freight* as a content point to decide. Art. 5º §2 rescinds accessory
contracts **sem qualquer ônus para o consumidor** — so the store pays collection and
refunds montagem in full. It was never a design question; it was a decided one nobody
had looked up, which is the specific failure mode this ticket existed to catch.

**A citation was simply wrong.** [`carrinho.md`](../../docs/spec/carrinho.md) §5.1
cited **"CDC art. 5º-A"**; there is no such article in the CDC — it belongs to Lei
10.962/2004, inserted by Lei 13.455/2017. The same sentence said the disclosure is
*what makes the differential price lawful*. It is not: **art. 1º of Lei 13.455 makes
the differentiation lawful on its own**, and non-disclosure is an infraction, not a
defect that voids the price. **The discount is optional; disclosing one you offer is
mandatory** — the map's gist of ticket 004 inherited the same slip and is corrected.

**Also found: art. 49's parágrafo único was missing from every surface.** The refund
duty — *de imediato, monetariamente atualizados* — is half of what the article grants,
and the store's copy said nothing about money coming back. It is now in the policy.

**The LGPD line was thin rather than wrong.** *Usamos estes dados apenas para emitir a
nota e combinar a entrega* states a purpose and stops. Art. 9º §3 requires telling the
titular **com destaque** when the treatment is a *condition* of supply — it is — and
art. 9º VII requires explicit mention of the art. 18 rights, which a one-line purpose
statement cannot carry. Two clauses added: the conditionality, and a route to the
policy. Recorded alongside: **the basis is art. 7º V, execução de contrato, not
consent**, which makes the already-refused checkout consent checkbox *wrong* rather
than merely redundant — the store cannot honour a refusal and still deliver, so the
box would offer a choice that does not exist. The newsletter is the opposite case
(art. 7º I), and the footer's "note, not a tick-box" survives contact with the statute
for a different reason than the one originally given.

**Three paraphrases were checked and left alone**: *7 dias corridos* (the statute says
*7 dias* — *corridos* is the settled gloss, correct, and now flagged as a gloss rather
than a quotation), *a contar do recebimento* (art. 49 offers *assinatura ou
recebimento*; goods take the later, consumer-favourable one), and the montagem
extension — which is now **explicitly labelled a store grant beyond art. 49**, so a
later session cannot "correct" it back into a shorter promise.

**The fictional CNPJ gets a disclosure line in shipped copy** —
`DADOS DE IDENTIFICAÇÃO FICTÍCIOS — LOJA CONCEITO`, annotation voice, inside the
block it qualifies. No statute forbids inventing identification; the problem is the
one art. 2º exists to prevent. The block's entire function is to let a consumer
**locate a real supplier**, and a well-formed CNPJ performs that convincingly and
falsely — a number colliding with a real registration points a complaint at a real
company. This is the only fabricated artefact in the store with a **third party on
the other end of it**, and the store had already refused six others. It could not
refuse this one, because an empty block fails the footer's first job. So it ships,
qualified.

**Two constraints from other tickets were honoured, and one of them bit.** Each policy
document's first sentence ships as its meta description
([`rotas.md`](../../docs/spec/rotas.md)), which is a 110–160 character window — two of
the four openers were **lengthened for that reason alone**, and the four now measure
116, 128, 130 and 141. And CDC art. 101 I inverted the `termos-de-uso` forum point: it
read *"the governing forum"*, which invites the boilerplate clause electing São Paulo,
but a forum clause against a consumer is abusive. The document now **states the
consumer's right to sue in their own domicílio** rather than electing anything.

**A fifth surface was in scope and the ticket did not name it.**
[`CONTEXT.md`](../../CONTEXT.md)'s glossary promised the arrependimento notice inline
in the **buy-box**, and [`pagina-produto.md`](../../docs/spec/pagina-produto.md) never
wrote it. Since this pass owns the wording, the contradiction had to resolve one way
or the other; it resolved **against the line**. CDC art. 49 sets no placement duty, and
art. 5º asks for the means to be ostensive, which the sitewide footer, the cart and the
confirmation satisfy. Recorded in §12's deliberate omissions so it cannot drift back.

**Output**: new
[`docs/research/legal-copy-verification.md`](../../docs/research/legal-copy-verification.md);
new §11b in `institucional.md` carrying the **shippable pt-BR** for all four policy
documents; corrections in place to `rodape.md`, `carrinho.md`, `checkout.md`,
`institucional.md`, `pagina-produto.md`, `rotas.md` and `CONTEXT.md`.
