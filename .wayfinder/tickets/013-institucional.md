---
title: Institutional pages
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: [002-brand-direction, 006-footer]
status: closed
---

## Question

What do Sobre, Contato, and the shared policy template contain?

Sobre: the brand story and how it is told. Contato: the form, the channels, and any location/atendimento content. Policy template: one layout serving trocas, entrega, privacidade and any others — decide the shared structure once rather than designing each.

Output: `docs/spec/institucional.md`.

## Resolution

Full spec in [`docs/spec/institucional.md`](../../docs/spec/institucional.md).
Resolved in conversation; no prototype — the contested questions were content and
rule questions, not layout ones.

**One rule unifies the three surfaces: the institutional pages are typographic.
No photography on any of them** — the third *ausência autorada* after the cart's
régua and Inspirações' price, and it keeps `inspiracoes.md`'s room-shot exception
at exactly one.

**`/sobre` is a manifesto, and it is the page of refusals.** Five statements down
the page — four refusals plus one affirmation — each with two or three sentences
of body: `Não temos estoque.` / `Não fazemos promoção.` / `Não escondemos o
preço.` / `Não vendemos o que não sai da nossa oficina.` / `O que sai daqui é
assinado.` The essay reading was refused for making Sobre a fifth `Artigo` and
breaking the closed-set defence `inspiracoes.md` paid for; the claim-blocks
reading for being `home.md` §7 at page scale. Refusals are the one thing the home
structurally cannot do — it is a selling page — and each refusal explains a
price, which is how the atelier position gets earned rather than asserted. The
*method* alternative was refused and **relocated** to
`/politicas/entrega-e-frete`: process facts are facts, not a story.

Consequences, all downstream of that one choice:

- **A registered Mincho exception.** `marca.md` §4 grants one feature line per
  page; Sobre gets five `Display L` statements, bounded and auditable because §3
  fixes the copy. It pays for the exception by having **no page title at all** —
  the first statement is the `<h1>`. `/contato` and the policy pages keep the
  ordinary one-title grant.
- **Final copy, not direction** — the only spec in the map to ship shippable
  pt-BR, because here the wording *is* the structure and a build session would
  otherwise invent the store's voice from scratch.
- **The page stops.** No CTA, no link out, joining `home.md` §7 and the cart's
  refusal of cross-sell.
- **One régua, closing the page: `DESDE 2014`.** Legal without an object to
  annotate — `marca.md` §2 lists *collection year* among valid figures — and
  placed at the close because the ban that bites is *no régua in running text*.

**Two refusals of fabricated credentials**: no founder, biography or portrait (a
fictional life story is a heavier fabrication than the QR code `checkout.md`
refused), and no designer roster (a designer's name is meaningful attached to a
`Familia`, and detached becomes the object `rodape.md` refused with Reclame Aqui
and Ebit). The no-person photography rule `pagina-produto.md` relied on being
exceptionless stays exceptionless.

**`/contato` is form → showroom, with the channels omitted.** `rodape.md` §7
already drew the line — the footer carries the channel, `/contato` carries the
form and the showroom — and repeating them would make the page quote its own
footer. The form is three fields (nome, e-mail, mensagem): no *assunto* select
routing to inboxes that do not exist, no telefone the store cannot act on. On
submit it **swaps in place** to `Nada foi enviado.` — the sixth refusal of a
fabricated artefact, and deliberately *not* checkout's interstício, which earned
its 1500ms beat on an expectation a contact form does not carry. The **showroom
is real and visitable** at the footer's address, with **no embedded map** (an
iframe imports another system's colour, type and radius into a page whose
identity is one accent and zero radius) and an agendamento line that is
statement 1 paying off: no stock means not everything is on the floor.

**The policy template**: title, date, non-sticky side index on columns 1–3,
document on 5–9. **Accordion refused** — hiding legally required text behind a
click is the opposite of *ostensive*. The **index renders only at 4+ sections**;
below that it reads as a rendering accident. **Same layout, per-page headings** —
a shared heading skeleton across four unrelated documents is the false symmetry
that produces empty sections. `inspiracoes.md`'s date ban does not reach here: a
policy without a version is a real defect. Each page opens with one line
declaring the concept store, since four unqualified legal documents would be the
seventh fabricated artefact. The spec fixes **content points, not statutory
wording** — which means the map's legal-verification pass now covers **four**
surfaces, not three.

**Data**: `/sobre` is the **only page in the store with no data dependency**,
which is what makes the Mincho exception countable. New store-wide `Loja`
constant holds razão social, CNPJ, IE, `fundacao: 2014`, address, atendimento and
showroom hours — read by both the footer and `/contato` so the two can never
drift. New enumerated `Politica` / `SecaoPolitica`, four records, unknown slug a
404. `/contato` has no entity; form state is local and discarded. All additive.

Glossary additions in [`CONTEXT.md`](../../CONTEXT.md): *Manifesto*, *Loja*,
*Showroom*, *Política*, *Ausência autorada*.
