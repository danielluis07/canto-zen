# Páginas institucionais — Sobre, Contato, Políticas

Resolves ticket [Institutional pages](../../.wayfinder/tickets/013-institucional.md).
Covers three surfaces: `/sobre`, `/contato` and the shared template behind
`/politicas/[slug]` × 4.

Written in English prose; every string quoted as copy is the pt-BR that ships.
Domain terms stay pt-BR — they are the glossary ([`CONTEXT.md`](../../CONTEXT.md)).

**The rule that unifies the three: the institutional surfaces are typographic.**
No photography on any of them (§4). It is the only rule a build session needs to
hold across all three, and it keeps [`inspiracoes.md`](inspiracoes.md)'s
room-shot exception at exactly one.

---

## 1. What `/sobre` is

**A manifesto.** Mostly type: five statements down the page, each with a short
body beneath it. Not an editorial essay, not a page of image-and-text claim
blocks.

The essay reading was refused because it would make Sobre a fifth *Artigo* and
break the "one genre, four articles, set closed" defence that
[`inspiracoes.md`](inspiracoes.md) bought at real cost. The claim-blocks reading
was refused because it is [`home.md`](home.md) §7 again at page scale.

### What it says that the home doesn't

[`home.md`](home.md) §7 sends `SOBRE O ATELIÊ` here and requires that Sobre
**continue** the marcenaria claim, not repeat it. The home asserts *the making*.

**Sobre is the page of refusals.** It states what the atelier does not do, and
what each refusal buys the buyer. This is the one thing the home structurally
cannot do — the home is a selling page — and each refusal explains a price, which
is what an atelier position has to earn. It also gives the manifesto its form for
free: a refusal is naturally one line plus a short justification.

The alternative considered was **method** — how a piece gets made, in sequence.
It was refused and *relocated*: process facts are facts, and they belong on
`/politicas/entrega-e-frete` (§11), not on Sobre as a story.

---

## 2. The Mincho spine — a registered exception

[`marca.md`](marca.md) §4 rations Zen Old Mincho to **a single feature line per
page**. Sobre is a **named exception**, in the way [`rodape.md`](rodape.md) §8
named its icon exception: bounded, paid for, and the only one of its kind.

- **Five statements**, each `Display L` Mincho (1.75rem / 1.2, tracking `0.005em`).
  Five is a hard ceiling, not a target — the copy is fixed in §3, so the exception
  is auditable by counting.
- Each statement is followed by **two to three sentences in Body**, `--ink`,
  measure 60–70ch.
- **Sobre spends no other Mincho.** There is no page title — the first statement
  is the top of the page. This is the anomaly the exception pays for; §8 and §11
  keep the ordinary one-title grant for the other two surfaces.

**Layout.** Statements span columns 1–9 on the 12-column grid; the body block
below each sits on columns 1–5, keeping the large right-hand gutter empty per
[`marca.md`](marca.md) §5. Vertical rhythm between statement blocks: `4rem`.
No rules, no numbering — ordinal numbering is banned system-wide
([`marca.md`](marca.md) §2).

---

## 3. The five statements — final copy

Unlike every other spec in this map, this copy is **final and shippable**, not
direction. The reason is that here the wording *is* the structure: a build session
handed "five refusals, direction only" would invent the store's tone of voice from
scratch, which nothing else in this map asks of a build session.

**Four refusals, then one affirmation.** Five negations leave the reader holding
nothing; the affirmation is what the refusals were clearing space for.

> ### Não temos estoque.
>
> Nenhuma peça fica esperando num galpão. A produção começa depois que a peça é
> pedida, e leva o tempo que leva — em média 45 dias úteis. É por isso que a gente
> sabe dizer de que árvore veio a madeira do seu aparador.

> ### Não fazemos promoção.
>
> O preço de uma peça é o mesmo em março e em novembro. Descontar em novembro o
> que se cobrou o ano inteiro é admitir que o preço do ano inteiro estava errado.
> O único desconto da loja é o do Pix, e ele existe porque o custo é menor de fato.

> ### Não escondemos o preço.
>
> Ateliê costuma escrever "sob consulta". A gente escreve o número: à vista e
> parcelado, nos dois lugares onde a peça aparece. Quem precisa perguntar quanto
> custa já foi informado de que não é para ele.

> ### Não vendemos o que não sai da nossa oficina.
>
> Não revendemos importado e não completamos a grade com peça de terceiro. O que
> está no site foi desenhado aqui e montado aqui, o que limita o catálogo — e é
> exatamente esse limite que a gente está vendendo.

> ### O que sai daqui é assinado.
>
> Toda peça carrega o nome de quem a desenhou e as medidas reais de quem a
> construiu. Nenhuma das duas coisas é enfeite: uma diz de quem é a decisão, a
> outra diz se cabe na sua casa.

**Voice check.** The statements are impersonal ("não temos", never "nós não
temos"); the bodies may use *a gente*, the register the rest of the store's copy
already uses ([`rodape.md`](rodape.md) §3).

---

## 4. Zero photographs — the third authored absence

**No photograph on `/sobre`, `/contato`, or any policy page.**

Sobre is the sharp case: the store is photography-led on every other surface, and
the page arguing hardest for the pieces shows none of them. That is deliberate —
the page of refusals refuses the store's own most reliable device, and a manifesto
interleaved with images is the claim-blocks page that §1 already rejected.

It joins the register of authored absences:

| Surface | What is absent | Source |
|---|---|---|
| Carrinho | the régua | [`carrinho.md`](carrinho.md) |
| Inspirações | price **and** régua | [`inspiracoes.md`](inspiracoes.md) |
| **Institucionais** | **photography** | this file |

For `/contato` specifically, a showroom interior was considered and refused: it is
arguably a room shot, and granting it would open a second exception to
[`marca.md`](marca.md) §7's "the piece alone" beyond Inspirações. The showroom is
described in words and an address, which is what someone planning a visit needs.

---

## 5. The régua on `/sobre`

**Exactly one, closing the page**, below the fifth statement, carrying the
founding year:

```
├───────────────── DESDE 2014 ─────────────────┤
```

It is legal without an object to annotate: [`marca.md`](marca.md) §2 permits the
régua "opening a section, when there is a real figure to state (number of pieces,
prazo, **collection year**)". A year is on the brand spec's own list of examples.
The ban that does bite is *no régua in running text* — hence it closes the page
rather than sitting between statements.

Anatomy per [`marca.md`](marca.md) §2: 1px `--ink` hairline, 13px end ticks, label
centred in the annotation voice with a breath of `--plaster` behind it, at full
container measure.

**2014 is a new fabricated fact**, consistent with the fictional razão social and
CNPJ in [`rodape.md`](rodape.md) §3. It lives in `Loja` (§12), never inline.

**No régua on `/contato` or the policy pages.** Contato is a form —
[`marca.md`](marca.md) §2 excludes forms outright. The policy pages are running
text whose numbers (7 dias, 5 dias) sit inside sentences; annotating `7 DIAS`
beside a paragraph that says *7 dias corridos* is decoration, and it would make
the régua a legal-notice device.

---

## 6. Sobre ends, it does not push

**No CTA.** No `VER PEÇAS`, no link to a room, no link to `/contato`. The régua,
and then the footer.

Every surface in this store that stops rather than pushing does so deliberately —
[`home.md`](home.md) §7's scroll ends on an assertion,
[`inspiracoes.md`](inspiracoes.md) closes on a single link, the cart refuses
cross-sell. A manifesto that ends in a button sells the argument it just made.

---

## 7. What Sobre refuses to name

Two refusals of the same species — the store consistently declines to fabricate
credentials.

- **No founder, no biography, no portrait.** Sobre speaks as the marcenaria, in
  *a gente*. A fictional CNPJ is obviously a placeholder shape; a person's life
  story reads as a real claim about a real human, and it would be the heaviest
  fabrication in the map — heavier than the QR code
  [`checkout.md`](checkout.md) refused.
- **No designer roster.** A designer's name is meaningful *attached to a piece*,
  which is why it lives on `Familia.designer`
  ([`pagina-produto.md`](pagina-produto.md)). Detached into a credits list it
  becomes the same object [`rodape.md`](rodape.md) refused when it kept Reclame
  Aqui and Ebit out. Statement 5 asserts *that* pieces are signed without listing
  signatories.

Photography of people is excluded twice over — by §4 (no photography at all) and
by [`marca.md`](marca.md) §7, whose "no person" rule
[`pagina-produto.md`](pagina-produto.md) relied on being exceptionless when it
refused a human silhouette for scale. This ticket opens no exception to it.

---

## 8. `/contato` — structure

Two sections, in this order:

1. **The form** (§9)
2. **The showroom** (§10)

**The channels are omitted.** [`rodape.md`](rodape.md) §7 already drew this line —
"the footer carries the *channel*; `/contato` carries the form and the showroom" —
and it promoted *Atendimento* to a column of its own precisely so WhatsApp,
telefone, e-mail and hours are visible on every page. On a page this short the
footer is on screen anyway; repeating them would make `/contato` a page that
mostly quotes its own footer.

Page title `Contato` in Mincho `Display L` — the ordinary one-feature-line grant,
which Sobre forfeited and this page keeps.

Layout: form on columns 1–5, showroom on columns 7–11, right gutter empty. Mobile
stacks in the same order.

---

## 9. The form, and the honest resolution

**Three fields**, stacked, full width of the 5-column lane:

| Field | Type | Notes |
|---|---|---|
| Nome | text | required, `autocomplete="name"` |
| E-mail | email | required, `autocomplete="email"` |
| Mensagem | textarea, 6 rows | required |

No *assunto* select — it would route to inboxes that do not exist. No telefone — a
field the store cannot act on. Zero radius, 1px `--hairline` border, label above
the field in the annotation voice ([`marca.md`](marca.md) §6).

Submit: `ENVIAR MENSAGEM`, CTA style.

**Validation** resolves in ink and weight, never in red —
[`marca.md`](marca.md) §3 rules e-commerce red and green out of the system. The
message sits below the field in Body S `--ink`, referenced by `aria-describedby`.

### Resolution: swap in place

On submit, the form's region is **replaced** by a short statement. No route
change, no processing beat.

> **Nada foi enviado.**
>
> Esta é uma loja conceito — não há caixa de entrada do outro lado. Numa loja de
> verdade sua mensagem chegaria por aqui e a gente responderia em até 5 dias
> úteis; se você precisa falar com alguém agora, o WhatsApp e o e-mail no rodapé
> são os canais que valem.

`Nada foi enviado.` would be a second feature line if set in Mincho, so it is
**Body, `--ink`, 500 weight** — the page's one Mincho grant is already spent on
the title.

**Why not the checkout interstício.** [`checkout.md`](checkout.md) earned its
1500ms beat and full-bleed Mincho statement because a payment click carries an
enormous expectation that had to be staged. A contact form carries none, and
spending the store's most theatrical moment on its smallest one cheapens the
moment that needs it. The swap is the sixth refusal of a fabricated artefact and
the plainest one: no fake `Recebemos sua mensagem`.

The showroom section stays rendered throughout — the reader who submitted still
has a real place to go.

---

## 10. The showroom

The store has one, at the address [`rodape.md`](rodape.md) §3 already publishes.
Presented in Body and the annotation voice; no photograph, no embedded map.

> **Showroom**
>
> Rua Harmonia, 742 — Vila Madalena
> São Paulo — SP, CEP 05435-000
>
> Seg a sex, 10h às 19h · Sáb, 10h às 14h
>
> A visita não precisa de hora marcada, mas avise antes se quiser ver uma peça
> específica: como não trabalhamos com estoque, nem tudo está no salão.
>
> `VER NO MAPA →`

**No embedded map.** A Google Maps iframe imports another system's colour, type,
radius and UI into a page whose entire identity is one accent and zero radius —
the same reasoning [`rodape.md`](rodape.md) used to keep third-party marks out.
`VER NO MAPA` is a plain text link that opens the address in the visitor's own map
app.

The agendamento line is not filler: it is statement 1 (`Não temos estoque.`)
paying off as a practical consequence, and it is the only place the two
institutional surfaces touch.

**Showroom hours are distinct from atendimento hours** (`Seg a sex, 9h às 18h` in
the footer). Both live in `Loja` (§12) so the two cannot drift apart in copy.

---

## 11. The policy template

One layout, four pages, at `/politicas/[slug]`.

### Layout

- Title in Mincho `Display L`.
- Directly below, in the annotation voice `--muted`:
  `ÚLTIMA ATUALIZAÇÃO — 12 DE MARÇO DE 2026`.
- **A side index** of the page's section headings, columns 1–3, `--muted`,
  annotation voice, **non-sticky**, anchor links.
- **The document** on columns 5–9, measure 60–70ch, Body. Section headings in
  Grotesk 500, not Mincho — the page has spent its one feature line on the title.
- A 1px `--hairline` above the footer. No card, no panel, no `--kozo` band.

**The index renders only at 4+ sections.** Below that it is noise: a two-item
index beside a short document reads as a rendering accident, and the document
simply takes the text lane.

**Accordion was refused**: it hides legally required text behind a click, which is
the opposite of the *ostensive* standard Decreto 7.962 art. 5º sets and which
[`rodape.md`](rodape.md) §3 already built the footer around.

**A date, not a byline.** [`inspiracoes.md`](inspiracoes.md) bans dates on
`Artigo` as blog-signalling; that ban does not reach here, because a policy
without a version date is a real defect — the reader needs to know which version
they agreed to.

### Same layout, per-page headings

The four documents do **not** share a heading skeleton. Forcing unrelated
documents into identical sections is the false symmetry that produces empty
sections; `privacidade` and `termos-de-uso` have nothing structural in common.

### Content points per page

This spec fixes **what each page must state**, not its final statutory wording.
The map's *Legal-copy verification* fog already covers three surfaces whose
statutory text came from a mirror rather than planalto.gov.br; writing a fourth
set of unverified legal text here would enlarge that debt rather than pay it.
**That verification pass now covers four surfaces.**

**`trocas-e-devolucoes`** — the 7-day arrependimento window; that it counts from
recebimento, **or from montagem when contracted**; that the atendimento channel
(WhatsApp / e-mail) **is** the tool for exercising it, since there is no customer
area ([`rodape.md`](rodape.md) §3 already resolved this); the 5-day duty to
respond; who pays return freight; how a sob-encomenda piece is treated; defect
versus arrependimento as distinct paths.

**`entrega-e-frete`** — per-CEP quoting and the six freight regions
([`carrinho.md`](carrinho.md)); cubed weight; prazo de entrega in dias úteis
counted from payment confirmation, and prazo de produção as distinct and prior;
montagem as an add-on performed on the delivery day; the bulky-item access
disclosure (door, lift, stairwell) and what happens if access fails; entrega
agendada. Absorbs payment and montagem detail rather than spawning pages —
[`rotas.md`](rotas.md) fixed this.

**`privacidade`** — LGPD: what is collected (the checkout's fields, the CEP, the
newsletter e-mail), the purpose of each, legal basis, retention, the holder's
rights and how to exercise them, cookies, and a controller contact.

**`termos-de-uso`** — who the supplier is (pointing at the identification block
rather than restating it), what the site is, price and availability accuracy,
image-versus-piece variance for natural wood, IP, and the governing forum.

### Concept-store honesty

Each policy page opens with one line in Body S `--muted`, above the first section:

> Canto Zen é uma loja conceito. Esta página descreve como a política funcionaria;
> nenhuma compra é processada aqui.

The store has now refused six fabricated artefacts; four unqualified legal
documents would be the seventh. One line, once, at the top — not a banner, and not
repeated per section.

---

## 12. Data

### `/sobre` consumes nothing

It is the **only page in the store with no data dependency**: five statements and
a régua label, all authored in §3 and §5. No entity, no content object. That is a
property worth preserving — it is what makes the Mincho exception auditable.

### `Loja` — a store-wide constant

The identification facts are currently written into [`rodape.md`](rodape.md) §3 as
copy, and would now be written a second time into `/contato`. They become one
object, read by both.

```ts
type Loja = {
  razaoSocial: string          // "Canto Zen Marcenaria e Comércio de Móveis Ltda."
  cnpj: string                 // "51.204.876/0001-40"
  inscricaoEstadual: string    // "116.482.930.114"
  fundacao: number             // 2014 — the régua's figure (§5)
  endereco: {
    logradouro: string; numero: string; bairro: string
    cidade: string; uf: string; cep: string
  }
  atendimento: {
    whatsapp: string; telefone: string; email: string
    horario: string            // "Seg a sex, 9h às 18h"
  }
  showroom: {
    horario: string[]          // ["Seg a sex, 10h às 19h", "Sáb, 10h às 14h"]
  }
}
```

Additive and non-breaking: the footer's copy is unchanged, it just stops being
literal. **Fictional data, well-formed on purpose** — the warning in
[`rodape.md`](rodape.md) §3 applies verbatim, and now applies to `Loja`.

### `Politica`

```ts
type Politica = {
  slug: 'trocas-e-devolucoes' | 'entrega-e-frete' | 'privacidade' | 'termos-de-uso'
  titulo: string
  atualizadaEm: string         // ISO date; rendered in full pt-BR
  secoes: SecaoPolitica[]      // index renders when length >= 4
}

type SecaoPolitica = {
  id: string                   // anchor slug
  titulo: string
  corpo: string[]              // paragraphs
}
```

Four records, enumerated — an unknown slug is a 404, matching
[`rotas.md`](rotas.md)'s enumerated-not-generated convention. Modelling the set as
data is what makes "one shared template" enforceable rather than aspirational, and
it lets the footer's Ajuda column and these pages read the same list.

### `/contato`

No entity. Form state is local and is discarded on resolution — nothing is stored
and nothing is sent.

---

## 13. Chrome, motion, accessibility

- **Full navbar and full footer** on all three surfaces.
  [`checkout.md`](checkout.md)'s reduced chrome was scoped to checkout; nothing
  here inherits it.
- **No nav item is marked active** — these pages are not rooms, the same case a
  product page presents ([`navbar.md`](navbar.md)).
- **Motion**: none beyond the 120ms colour transition on interactive states
  ([`marca.md`](marca.md) §9). The form's swap in §9 is an instant replacement, not
  a fade — animating it would dramatise the one moment this page keeps plain.
- Sobre's five statements are headings, and since there is no separate title the
  **first statement is the `<h1>`** — the page's structural heading and its first
  argument are the same string, which is the point.
- The form's swap moves focus to the resolution statement and announces it via
  `role="status"`.
- Policy anchor links target real `id`s on each section heading; the index is a
  `<nav>` with an accessible name.

---

## 14. What this hands to other tickets

- **[Route metadata](../../.wayfinder/tickets/015-route-metadata.md)** — `/sobre`
  has no title string distinct from its first statement and no description copy of
  its own; the metadata ticket must not assume a page title exists to reuse.
- **[Imagery system](../../.wayfinder/tickets/014-imagery.md)** — the institutional
  surfaces consume **no images at all**. One fewer crop family to specify.
- **[Error surfaces](../../.wayfinder/tickets/016-error-surfaces.md)** — the policy
  template's plain text-lane layout is the nearest existing precedent for a 404,
  and `/politicas/[slug]` with an unknown slug is itself a 404 case.
- **Map fog — Legal-copy verification** — now **four** surfaces, not three: the
  footer, the cart, the checkout, and these four policy documents.
- **Map fog — Catalogue seed data** — unchanged. These surfaces demand no produtos:
  the first ticket in the map that adds nothing to the seed set.

---

## 15. How this was decided

Resolved in conversation, without a prototype — as with the footer, the contested
questions were content and rule questions, not layout ones.

The four that cost the most:

- **The manifesto over the claims page.** The recommendation was a page of
  image-and-text claim blocks; the dev chose the manifesto, the riskier read, and
  it forced everything downstream — the Mincho exception (§2), zero photography
  (§4), final copy (§3), no CTA (§6). The claims page would have been safer and
  duller, and it would have rhymed with `home.md` §7 instead of continuing it.
- **The régua with no object.** The recommendation initially refused a
  photograph-free régua as ornament; the dev chose it, and the brand spec turned
  out to be on the dev's side — [`marca.md`](marca.md) §2 lists *collection year*
  as a valid figure, so the gesture never needed an object, only a truth.
- **The channels on `/contato`.** Omitting them makes the page look thin in
  isolation, which is uncomfortable; it is right because `rodape.md` §7 already
  paid for a dedicated Atendimento column expressly so contact is never more than
  one screen away.
- **Copy depth.** Every other spec in this map gives direction and one example
  line. Sobre breaks that and ships final text, because on this page the wording
  *is* the structure — and the policy pages break it the other way, giving only
  content points, because their wording is statutory and still unverified.
