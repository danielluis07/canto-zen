# Checkout — `/checkout` e `/pedido-confirmado`

The single-page checkout: its three sections, what each collects, how freight
resolves, and — the decision this ticket exists for — how the store discloses
that it is a concept and nothing was charged. Resolves ticket
[011 — Checkout sections & the concept disclosure](../../.wayfinder/tickets/011-checkout.md).

This file is written in English prose; every string quoted as copy is the pt-BR
that ships. Domain terms stay pt-BR throughout — they are the glossary
([`CONTEXT.md`](../../CONTEXT.md)), not the prose.

---

## 1. What was already decided elsewhere

The checkout inherits six constraints and does not relitigate them:

| Constraint | Source |
| --- | --- |
| **Single page, accordion sections + sticky resumo.** Not a multi-route wizard. | map Notes |
| **The reduced footer is already specified.** Zones C and D only; zone D is a legal obligation and must not be removed. | [`rodape.md`](rodape.md) §9 |
| **Arrives with the session CEP and a `Carrinho`.** The CEP was typed on a PDP and survives. | [`carrinho.md`](carrinho.md) §11 |
| **The freight *modality* choice is this ticket's**, against `carrinho.md` §8's option list, and the resumo carries freight **inside** the total. | [`carrinho.md`](carrinho.md) §11 |
| **Montagem is not editable after the cart.** It is an attribute of the line, fixed by `/carrinho`. | [`carrinho.md`](carrinho.md) §4.3, §11 |
| **`/pedido-confirmado` carries the disclosure** and repeats the arrependimento sentence. | [`rotas.md`](rotas.md), [`carrinho.md`](carrinho.md) §11 |

Plus the BR conventions that are not this ticket's to invent: three steps
Identificação → Entrega → Pagamento, CPF masked and check-digit validated, CEP
first with autofill, the parcelas dropdown on the card form, and the visible Pix
discount disclosure that makes the differential price lawful
([research §3, §4, §5](../research/br-ecommerce-conventions.md)).

---

## 2. The disclosure — the decision

**`FINALIZAR PEDIDO` runs a short processing beat, which resolves not into a
receipt but into a full-bleed typographic statement. The order record sits
behind it, one click away.**

Three directions were built and driven side by side (§13). This one is
**A — Interstício**.

### 2.1 Why the reveal is staged rather than avoided

The competing directions both refused the stage, and both refusals cost more
than they saved.

**C — Antes do clique** put the notice ostensively inside the Pagamento section,
above the CTA, in the arrependimento voice. It is the most *honest-feeling*
option in the abstract and the weakest in the hand: a notice sitting in a form
is read as a form's fine print, which is exactly the register the reader has
been trained to skip. It also spends the admission at the moment of least
attention — mid-form, with a card number still to type — and then has nothing
left to say at the moment of most attention, so the confirmation page has to
either repeat itself or fall flat. Disclosure that arrives early and quietly is
disclosure that does not arrive.

**B — A confirmação é a revelação** folded the admission into
`/pedido-confirmado` and rendered the number as `Pedido nº —`. It is the
cheapest to build and the closest to reading as a defect: an em dash where a
number belongs is indistinguishable from a rendering bug, and the ticket's
condition was that the moment *"read as intentional and well-made, not as an
error."* B fails that condition on its most visible element.

**A wins because the beat is what makes the statement legible as authored.** The
processing pause sets an expectation — a receipt — and the interstitial spends
that expectation deliberately. Nothing else in the store gets a full-bleed
screen with one Mincho line on it; using it here says *this was built for you to
read* in the identity's own vocabulary, without a modal, a banner, or a word of
apology. The staging is also what earns the order record: having admitted the
thing plainly and at full size, the confirmation page is free to be a complete,
competent artefact rather than a surface fighting to carry a caveat.

### 2.2 The beat

On `FINALIZAR PEDIDO`, the page enters `processando` for **1500ms**:

- A near-opaque `--plaster` wash over the whole viewport (`bg-[var(--plaster)]/95`).
- One centred line, annotation voice, `--muted`:

```
PROCESSANDO O PAGAMENTO
```

- The CTA is `disabled` and reads `PROCESSANDO` for the duration.
- **No spinner, no progress bar, no percentage.** A spinner would be the first
  non-typographic UI element in the system ([`marca.md`](marca.md) §6 permits no
  such thing), and a progress figure would be an invented number.
- **1500ms and no longer.** The beat exists to set an expectation, not to
  simulate work. A longer wait is the same lie with more syllables.
- `prefers-reduced-motion` needs no branch — there is no animation here, only a
  delay and an opacity layer. Nothing moves.

### 2.3 The interstitial

Full viewport, `--plaster`, vertically centred, on the standard 12-column grid
with the statement on the left **7 columns and the right gutter left empty** —
the asymmetry [`marca.md`](marca.md) §5 makes the default.

```
CANTO ZEN

Nada foi cobrado.

Canto Zen é uma loja conceito. Não existe gateway, não existe pedido,
e nada que você digitou saiu deste navegador. As peças, os preços, o
frete e os prazos são reais o suficiente para serem julgados — a
cobrança é a única coisa que não existe.

[ VER O PEDIDO ]
```

| Element | Voice |
| --- | --- |
| `CANTO ZEN` eyebrow | Annotation, `--muted` |
| `Nada foi cobrado.` | **Mincho, Display XL** — the page's single feature line |
| Paragraph | Corpo, `--ink`, max 64ch |
| `VER O PEDIDO` | CTA voice, primary button |

- **The Mincho line is within budget, not an exception.**
  [`marca.md`](marca.md) §4 allows *a single feature line per page*, and the
  interstitial is its own surface. It does not inherit the checkout's Mincho
  spend, which is zero (§3).
- **No régua**, per [`marca.md`](marca.md) §2 and the precedent
  [`carrinho.md`](carrinho.md) §2 set — there is no real figure here to annotate,
  and the only candidate (a price that was not charged) would be the most
  dishonest cota in the system.
- **No índigo** except the focus ring on the button.
- **The paragraph names what is real before it names what is not.** The order is
  deliberate: the sentence that could read as an apology instead reads as an
  account of what the reader just used.
- **This is not a route.** It is a phase of `/checkout`, so
  [`rotas.md`](rotas.md)'s table is unchanged. It has no URL, no history entry,
  and the back button from it returns to the cart, not to a half-submitted form.
- **No footer, no navbar.** The only way forward is the button; the only way out
  is browser navigation. This is the one surface in the store with no chrome, and
  that is what makes it read as a held breath rather than a page.

---

## 3. Page chrome

**Navbar: wordmark only.** `Canto Zen` in Mincho, left-aligned, at the same
constant 72px height [`navbar.md`](navbar.md) §4 fixed, on a 1px `--hairline`
rule. Linked to `/`.

- **No room links, no Inspirações, no mega menu.** Advertising four exits
  mid-purchase is chrome working against the page it sits on. Leaving stays
  possible through the wordmark; it is simply not offered.
- **No `CARRINHO (n)`.** The resumo itemises the same cart half a screen away,
  so the counter is a second answer to a question already answered. This is the
  only surface where [`navbar.md`](navbar.md)'s cart affordance is absent, and
  the reason is redundancy, not concealment.
- The wordmark is Mincho, which is the exception [`navbar.md`](navbar.md) §3
  already registered. **The checkout body itself contains no Mincho at all.**

**Footer: the reduced variant**, exactly as [`rodape.md`](rodape.md) §9
specifies. Not re-specified here, and zone D is not removable.

**Mobile (`< 1024px`): the resumo collapses to a sticky bottom bar.**

```
TOTAL  R$ 8.568,00                                    VER RESUMO
```

- 1px `--ink` rule on top, `--kozo` ground, total in tabular figures.
- `VER RESUMO` expands the full resumo upward as a sheet; the CTA lives inside
  the expanded sheet and at the end of the Pagamento section, not in the bar.
- **This is the one place [`carrinho.md`](carrinho.md) §5.5's refusal does not
  transfer.** The cart refused a fixed mobile bar because it would hover over its
  own destination; here the destination is three sections down and the total must
  stay legible while the reader fills them. The reasoning was always about *what
  the chrome would cover*, and here it covers nothing that matters.

---

## 4. The accordion

**Sequential, one section open at a time. Completed sections collapse to a
summary line with `ALTERAR`.**

```
01  IDENTIFICAÇÃO                                            ALTERAR
    Ana Ribeiro · ana.ribeiro@email.com · 143.882.907-05 · (11) 98812-4470

02  ENTREGA                                                  ALTERAR
    Rua Augusta, 1412 · apto 92 · Consolação · São Paulo/SP · 01310-100
    ENTREGA PADRÃO · R$ 289,00 · 6 dias úteis

03  PAGAMENTO
    [ open ]
```

- Section headers are `NN` + title, both annotation voice; `NN` in `--muted`,
  the title in `--ink`. A 1px `--hairline` rule above each.
- The collapsed summary is Corpo S, `--muted`, indented to clear the number.
- **The lock is soft.** A later section can be opened at any time; it simply
  cannot be *submitted* while an earlier one is incomplete. Hard-locking produces
  a dead form with no explanation, which is worse than a button that says why.
- `ALTERAR` reopens a section in place and collapses whichever was open. No
  scroll jump, no confirmation.
- The collapsed summary is what keeps three sections plus a sticky resumo inside
  one screen; without it the "single page" decision produces a page nobody can
  see the end of.

---

## 5. Section 01 — Identificação

Four fields, in this order ([research §5](../research/br-ecommerce-conventions.md)):

| Field | Mask | Validation |
| --- | --- | --- |
| `E-mail` | — | shape only |
| `CPF` | `000.000.000-00` | **check digits, for real** |
| `Nome completo` | — | non-empty; **one field**, never first/last |
| `Celular` | `(00) 00000-0000` | 10 or 11 digits, DDD inside the same field |

- **CPF validates its check digits.** It is pure arithmetic with no service
  behind it, and an invalid CPF sailing through is the single cheapest tell that
  would break the illusion the rest of the page maintains. Validation is a UI
  convention here, not a legal claim
  ([research §5](../research/br-ecommerce-conventions.md)).
- **No Pessoa física / Pessoa jurídica toggle.** The store has an **Escritório**
  room, which is the real argument for one, and it is thin: the room sells a home
  office, not a procurement channel. The toggle drags in CNPJ, Razão Social and
  Inscrição Estadual, a second validation rule, and an NF-e question a concept
  store has no business implying it can answer.
- **No account creation, no password, no "salvar meus dados".** Auth is out of
  scope map-wide.
- **One LGPD purpose line** closes the section, Corpo S `--muted`:

> Usamos estes dados apenas para emitir a nota e combinar a entrega. Sem eles não
> há entrega. Veja a [Política de privacidade](/politicas/privacidade).

**Two clauses added by the
[legal-copy verification](../research/legal-copy-verification.md) §4**, and both
earn their words:

- *"Sem eles não há entrega"* discharges **LGPD art. 9º §3** — where the treatment
  is a *condition* for supplying the product, the titular must be told so **com
  destaque**. Checkout data is exactly such a condition, and the old line stated a
  purpose without stating the conditionality.
- The link discharges **art. 9º VII**, which requires explicit mention of the art.
  18 rights. A purpose line cannot carry nine rights; a route to the page that
  does is what art. 9º's *"acesso facilitado"* asks for. It **opens in a new tab**,
  like the Termos de uso link the reduced footer already carries (§7.3) — a legal
  duty may not cost the shopper their filled form.

**The legal basis is art. 7º V — execução de contrato — not consent.** Recorded
here because it is load-bearing for a decision already made elsewhere: **a consent
checkbox on the checkout would be wrong, not merely redundant.** The store cannot
honour a refusal and still deliver, so a tick-box would offer a choice that does
not exist. The newsletter e-mail in [`rodape.md`](rodape.md) §10 is the opposite
case — art. 7º I, consentimento, manifested by submitting the field under a clear
notice, which is why *that* surface's "note, not a tick-box" also survives — see
[`rodape.md`](rodape.md) §5.

### Errors

Ink and typographic weight only — no colour, no icon
([`marca.md`](marca.md) §3). The message sits beneath its field in Corpo S
`--ink`, and the field's border goes from `--muted` to `--ink`. This is the
third instance of the ink-only error treatment, after the PDP's and the cart's.

---

## 6. Section 02 — Entrega

### 6.1 Address

**CEP first**, pre-filled from the session CEP the cart handed over
([`carrinho.md`](carrinho.md) §11) — so for anyone who arrived through a PDP,
this section opens already answered.

A valid CEP **auto-fills logradouro, bairro, cidade and UF**. This is a hard
Brazilian expectation, not a nicety
([research §5](../research/br-ecommerce-conventions.md)).

| Field | Behaviour |
| --- | --- |
| `CEP` | masked `00000-000`, triggers autofill |
| `Endereço` | auto-filled, editable |
| `Número` | **separate and required** — never folded into `Endereço` |
| `Complemento` | optional |
| `Bairro` · `Cidade` · `Estado (UF)` | auto-filled, editable |

Plus an inline `NÃO SEI MEU CEP` link, annotation voice, to
`/politicas/prazos-e-entrega`.

**Autofill reads a fixture table, not a service.** The map rules out backend
integration of any kind, so the spec fixes a small table of CEPs covering all six
freight regions of [`carrinho.md`](carrinho.md) §8, plus an explicit
*não encontrado* path that leaves the fields empty and editable rather than
guessing. A CEP outside the freight table's prefixes is *região não atendida* —
the error state [`carrinho.md`](carrinho.md) §8 already named, never a silent
fallback.

### 6.2 The freight modality — and the number that moves

Two hairline rows, after the address completes, reading
[`carrinho.md`](carrinho.md) §8:

```
( ) ENTREGA PADRÃO                                          R$ 289,00
    6 dias úteis após a confirmação do pagamento

( ) ENTREGA AGENDADA                                        R$ 389,00
    data à sua escolha · 6 dias úteis após a confirmação
```

Padrão is preselected. Selecting either **recomputes the resumo total visibly**
— and that movement is the whole point.

[`carrinho.md`](carrinho.md) §5.2 kept freight *outside* the cart's arithmetic
precisely so that this screen could put it inside without the two pages ever
disagreeing. The cart promised `A PARTIR DE`; the checkout delivers the figure.
The one number in the flow that moves does so because the reader moved it, which
is the opposite of the "why is my total different from what I saw?" defect the
cart was designed to avoid.

`Grátis`, the word, when `freteGratis` covers the region — never `R$ 0,00`.
Agendada still charges its R$ 100 difference above the now-zero base.

### 6.3 Montagem is read-only here

Where a line contracted montagem, the resumo shows it inside that line's
subtotal and **the checkout offers no control**. Changing it means returning to
`/carrinho`, which the resumo's line links to. Fixed by
[`carrinho.md`](carrinho.md) §11; restated only because its absence is otherwise
read as an oversight.

---

## 7. Section 03 — Pagamento

**Two methods: Pix and Cartão de crédito. No boleto.**

Boleto is in structural decline against Pix
([research §3](../research/br-ecommerce-conventions.md)), Tok&Stok — the closest
comparable — ships without it, it needs its own clearing-time warning that
complicates the prazo copy fixed in §6.2, and a high-end atelier's buyers are the
least likely boleto cohort.

### 7.1 Pix

```
(•) PIX
    R$ 7.711,20
    à vista no Pix        10% À VISTA NO PIX

    O CÓDIGO PIX É GERADO APÓS A CONFIRMAÇÃO DO PEDIDO
```

- The discounted total in Preço voice, the badge in `--indigo` — the page's
  **only** non-state índigo (§8).
- **No QR code. Not here, and not on the confirmation page either.** A scannable
  square that resolves to nothing is the most dishonest object the store could
  contain, and it would be the fourth refusal of a fabricated artefact after
  *quem viu também viu*, cross-sell, and the zero-results suggestion strip. One
  annotation line states when the code would appear, and that is the whole
  treatment.
- **No expiry countdown.** A timer on a purchase that cannot expire is theatre
  with no referent.
- The `à vista` tier is honest about its scope: the discount is Pix-exclusive
  here, so the copy says `no Pix` and never `ou 1x no cartão`
  ([research §3](../research/br-ecommerce-conventions.md) distinguishes the two).

### 7.2 Cartão de crédito

Fields in order: `Número do cartão` (masked `0000 0000 0000 0000`) ·
`Nome impresso no cartão` · `Validade` (`00/00`) · `CVV` ·
`CPF do titular` · **`Parcelas`**.

- **The parcelas dropdown is mandatory**, and is the element a US/EU checkout
  omits entirely ([research §3](../research/br-ecommerce-conventions.md)). It
  lists every option against the **cart total including freight**:
  `1x de R$ 8.568,00 à vista` … `10x de R$ 856,80 sem juros`, with `N` derived by
  [`produto.md`](produto.md)'s rule.
- `CPF do titular` is the Brazilian cardholder-identification field, pre-filled
  from §5 and editable.
- **Card number is masked and Luhn-checked, and nothing more.** No brand
  detection, no BIN lookup — both imply a service. Luhn is arithmetic, like the
  CPF check digits, and it holds the same line: what can be verified honestly
  offline is verified.

### 7.3 Nothing else in the section

**No disclosure block here** — that was direction C, and §2.1 records why it
lost. **No terms checkbox**: the map has no auth and no account, and a consent
control that gates a purchase which does not happen is a control that means
nothing. The Termos de uso link lives in the reduced footer, where
[`rodape.md`](rodape.md) put it.

---

## 8. The índigo budget, and the régua

**Selection resolves in ink, never índigo.** A selected row — payment method or
freight modality — is a solid `--ink` fill in its 14px box plus a 1px `--ink`
border on the row against `--kozo`; unselected is `--muted` on `--plaster`.

[`marca.md`](marca.md) §3 declares three índigos on one screen wrong, and a
checkout naively built wants at least four: the Pix badge, the selected Pix row,
the selected freight row, and every `ALTERAR`. Resolving selection in ink spends
índigo **exactly once** — the Pix discount badge — plus focus rings, which
[`carrinho.md`](carrinho.md) §2 already established are state and not decoration.

The result is that the single coloured thing on the payment screen is the legally
required discount disclosure, which is also where the law wants the reader's eye
(Lei 13.455 art. 5º-A — [research §4](../research/br-ecommerce-conventions.md)).

**No régua on `/checkout`, on the interstitial, or on `/pedido-confirmado`.**
[`marca.md`](marca.md) §2 prohibits it in forms and checkout outright; this is
the second and third surfaces after [`carrinho.md`](carrinho.md) §2 to carry
none, and for the same reason — the subject is money and logistics, not matter.

---

## 9. The CTA

```
[ FINALIZAR PEDIDO ]
```

Full width of the form column, CTA voice, 1px `--ink` border on transparent,
inverting to solid `--ink` on hover.

- **Not `PAGAR`.** Nothing is paid, and a label naming an act the system does not
  perform is the one place this store would actually be lying.
- **Not `SIMULAR COMPRA`** or any self-aware label — it pre-empts the moment §2
  exists to stage, and turns the whole flow into a demo the reader is watching
  rather than using.
- `FINALIZAR PEDIDO` is true, and `/checkout` is the URL
  [`rotas.md`](rotas.md) fixed against `/finalizar-compra` for the same reason:
  the button is a label, the route is a place.

### Blocked states

- **An `esgotado` line blocks checkout.** [`carrinho.md`](carrinho.md) §6 made
  `FINALIZAR COMPRA` disabled while one exists; a piece can also go `esgotado`
  between cart and checkout. Here the CTA is `aria-disabled` with one annotation
  line beneath it: `REMOVA AS PEÇAS ESGOTADAS PARA CONTINUAR.`, and the resumo
  marks the line. The reader is sent back to `/carrinho`, which owns removal.
- **An incomplete earlier section** disables the CTA with
  `COMPLETE A IDENTIFICAÇÃO PARA CONTINUAR.` / `…A ENTREGA…`, and the named
  section is the one `ALTERAR` opens.

---

## 10. `/pedido-confirmado`

**The full order record — number, lines, prazos, address, total as paid —
not a stub.**

A confirmation page that withholds the record to make room for the disclosure
undercuts the disclosure. §2 has already said the thing plainly at full size, so
this page's job is to be the competent artefact the admission was made *about*.
The order of the two is the whole design: admission first, at full attention;
record second, complete.

```
Pedido confirmado
PEDIDO Nº 0000 — CONCEITO

PEÇAS
[foto] Poltrona Lina · LINHO CRU · ENVIO IMEDIATO          R$ 3.890,00
       Montagem incluída · R$ 99,00
[foto] Mesa Aroeira · CARVALHO NATURAL
       SOB ENCOMENDA · PRODUÇÃO DE 6 SEMANAS               R$ 4.290,00

ENTREGA
Ana Ribeiro
Rua Augusta, 1412 · apto 92 · Consolação · São Paulo/SP · 01310-100
ENTREGA PADRÃO · 6 DIAS ÚTEIS APÓS A CONFIRMAÇÃO DO PAGAMENTO

PAGAMENTO
Subtotal                                                   R$ 8.279,00
Frete                                                        R$ 289,00
─────────────────────────────────────────────────────────────────────
Total                                                      R$ 7.711,20
à vista no Pix   10% À VISTA NO PIX  — de R$ 8.568,00
O CÓDIGO PIX NÃO SERÁ GERADO

Você pode desistir da compra em até 7 dias corridos após receber a
peça — ou após a montagem, quando contratada. Para desistir, use o
formulário de contato. Como funciona →

[ VER TODAS AS PEÇAS ]
```

- `Pedido confirmado` is the page's **single Mincho line**.
- **The número do pedido is honest in its own form**: `PEDIDO Nº 0000 — CONCEITO`,
  annotation voice, `--muted`. The alternative tested — rendering the number as an
  em dash — is indistinguishable from a rendering bug, which is precisely the
  failure the ticket ruled out (§13, B).
- Per-line prazo annotations carry over from [`carrinho.md`](carrinho.md) §4.4
  unchanged. There are no delivery groups here either, for the same reason.
- `O CÓDIGO PIX NÃO SERÁ GERADO` closes the payment block — the promise §7.1
  made, kept honestly. Where the payment method was cartão, the line reads
  `NENHUM CARTÃO FOI COBRADO`.
- **The arrependimento sentence repeats**, as [`carrinho.md`](carrinho.md) §11
  required, with its montagem clause conditional on some line having contracted
  it. **Here — and only here — it carries the means**, linking
  `/contato?assunto=arrependimento` and `/politicas/trocas-e-devolucoes`: this is
  the surface a buyer returns to when they decide to withdraw, and Decreto 7.962
  art. 5º's duty is to inform the *means*, not only the window. The cart keeps the
  bare sentence — nothing has been bought there yet, so a withdrawal route would be
  offering an exit from a commitment not made. The
  [legal-copy verification](../research/legal-copy-verification.md) §3 settles that
  the means must be the **site's own form**, with WhatsApp and e-mail as *outros
  meios*; the full reasoning is in [`rodape.md`](rodape.md) §3.
- `VER TODAS AS PEÇAS` to `/produtos` — one way out, the pattern
  [`catalogo.md`](catalogo.md) §8 and [`carrinho.md`](carrinho.md) §7 set.
- **The reduced footer stays**, not the full one. Zone D's identification duty
  does not stop at the confirmation.

---

## 11. What happens to the cart

**The cart is cleared at the transition, and `/pedido-confirmado` is reachable
only from it.**

- Clearing is what makes the confirmation mean anything; a cart that survives its
  own purchase is a bug the reader will correctly read as one. The navbar counter
  returns to zero and the word `CARRINHO` loses its `(n)`
  ([`navbar.md`](navbar.md) §7).
- A cold arrival at `/pedido-confirmado` — a reload, a bookmark, a shared link —
  **redirects to `/`.** There is no order to look up, and a page that renders a
  fictional order to someone who did not just place it is the one genuinely
  misleading artefact this flow could produce.
- The route is likewise unreachable with an empty cart; `/checkout` with an empty
  cart redirects to `/carrinho`, which owns the empty state
  ([`carrinho.md`](carrinho.md) §7).
- Re-entering the flow costs two PDP visits, which is cheap, and the interstitial
  and the confirmation both link out to `/produtos`.

---

## 12. Data

**No new fields on `Produto`, and no new entities.** The checkout reads the
`Carrinho` [`carrinho.md`](carrinho.md) §9 defined and derives everything else.

One new piece of client state, alive only for the length of the flow:

```ts
type Modalidade = 'padrao' | 'agendada';
type MetodoPagamento = 'pix' | 'cartao';

type Checkout = {
  identificacao: { email: string; cpf: string; nome: string; celular: string };
  entrega: {
    cep: string; logradouro: string; numero: string; complemento?: string;
    bairro: string; cidade: string; uf: string;
    modalidade: Modalidade;
  };
  pagamento:
    | { metodo: 'pix' }
    | { metodo: 'cartao'; parcelas: number };  // 1..politicas.parcelasMax
};
```

- **Nothing is persisted and nothing is transmitted.** This is the literal claim
  the interstitial makes ("nada que você digitou saiu deste navegador"), so it is
  a constraint on the build, not a description of one.
- Every figure on both surfaces is derived: subtotal, freight, total, à-vista,
  parcelas, prazos.
- The order number is the constant `0000`, never randomised — a random number
  implies a sequence, and there is none.

---

## 13. How this was decided

Three directions were built on branch `prototype/checkout-disclosure`
(commit `a60d4da`) and driven side by side on one route, switchable on `?d=`.
The prototype rendered Identificação and Entrega as the collapsed summary rows
§4 specifies, so the page's real geometry was visible without building two forms
prose could describe. It must **not** be promoted — it was written under
prototype constraints.

| | Direction | Verdict |
| --- | --- | --- |
| **A** | **Interstício** — processing beat → full-bleed statement → record | **Won.** The beat is what makes the statement legible as authored rather than apologetic, and staging the admission is what frees the confirmation to be a complete record. |
| B | A confirmação é a revelação — no beat, confirmation leads with the admission, `Pedido nº —` | Lost. The em-dash number reads as a rendering bug, failing the ticket's own "intentional and well-made, not an error" condition on its most visible element. |
| C | Antes do clique — the Pagamento section discloses ostensively | Lost. A notice inside a form is read as fine print; it spends the admission at the moment of least attention and leaves the moment of most attention empty. |

**D — a persistent site-wide banner** was ruled out before prototyping: the
identity has no slot for permanent chrome ([`marca.md`](marca.md) §5 spends its
emptiness deliberately), and a band on every route dilutes into wallpaper by the
third page — the same failure the régua's two-per-screen rationing exists to
prevent.

---

## 14. Accessibility

- Each accordion section is a `<section>` with its heading; the collapsed summary
  is associated to `ALTERAR` by `aria-describedby` so the button's target is
  audible.
- Payment methods and freight modalities are `radiogroup`s, not button lists —
  they are single-choice, and the ink fill is a visual treatment of a real radio.
- The disabled CTA (§9) uses `aria-disabled` with its reason associated by
  `aria-describedby`, following [`carrinho.md`](carrinho.md) §10.
- The resumo total updating on modality change (§6.2) announces through an
  `aria-live="polite"` region naming the new total — the movement is the point,
  and it must not be visual-only.
- The processing beat (§2.2) is `role="status"` `aria-live="polite"`, so
  `PROCESSANDO O PAGAMENTO` is announced; the interstitial receives focus on its
  heading when it replaces the beat.
- Focus ring throughout: `outline: 2px solid var(--indigo); outline-offset: 3px`.
- Tab order: wordmark → section 01 → 02 → 03 → CTA → footer. The mobile sticky
  bar (§3) sits after the CTA in DOM order, never before the form.

---

## 15. Constraints handed to other tickets

- **[Route metadata & SEO](../../.wayfinder/tickets/015-route-metadata.md)** —
  `/checkout` and `/pedido-confirmado` are both `noindex`. `/pedido-confirmado`
  additionally redirects on cold arrival (§11), which is a routing behaviour that
  ticket should record alongside its metadata.
- **[Motion & transition conventions](../../.wayfinder/tickets/017-motion.md)** —
  the 1500ms beat (§2.2) is the **longest deliberate delay in the store** and the
  only place where time itself carries meaning. It contains no animation, so it
  needs no `prefers-reduced-motion` branch; that ticket should confirm the delay
  stays out of scope of whatever transition system it defines, and decide whether
  the interstitial's arrival is a cut or a fade.
- **[Error surfaces](../../.wayfinder/tickets/016-error-surfaces.md)** — the
  ink-only field error (§5) is the third instance after the PDP's and the cart's,
  and the *região não atendida* CEP error recurs here. Three instances is enough
  to generalise into a rule.
- **[Institutional pages](../../.wayfinder/tickets/013-institucional.md)** —
  `NÃO SEI MEU CEP` (§6.1) links to `/politicas/prazos-e-entrega`, and the
  reduced footer links Termos de uso; both must exist.
- **[Imagery](../../.wayfinder/tickets/014-imagery.md)** — the resumo thumbnail
  is 64px square, **below the 96px lower bound** [`carrinho.md`](carrinho.md) §11
  set. That ticket owns the reconciliation: either the crop serves 64px or this
  resumo goes to 96px.
- **Catalogue seed data** (map, *Not yet specified*) — the freight fixture (§6.1)
  needs CEPs covering all six regions of [`carrinho.md`](carrinho.md) §8,
  including at least one *região não atendida* prefix.

---

## 16. Deliberate omissions

Considered and ruled out — recorded so they are not relitigated:

- **Boleto bancário** — §7.
- **Pix QR code and copia-e-cola string** — §7.1, on both surfaces.
- **Pix expiry countdown** — §7.1.
- **Pessoa jurídica toggle** — §5, despite the Escritório room.
- **Account creation, guest-vs-login choice, "salvar meus dados"** — no auth in
  scope.
- **Terms-acceptance checkbox** — §7.3.
- **A persistent site-wide concept banner** — §13, direction D.
- **A disclosure modal over the form** — a modal is the shape of an interruption
  or an error, which is the register the ticket ruled out; the interstitial is a
  destination instead.
- **Order lookup, order history, e-mail confirmation** — no persistence, no
  account, and no mail service; promising an e-mail that never arrives is a lie
  the flow does not need to tell.
- **Cupom / código promocional** — refused once already in
  [`carrinho.md`](carrinho.md) §12, and nothing here changes it.
- **Editing montagem or quantities in the checkout** — §6.3; `/carrinho` owns
  both.
- **A multi-route wizard** (`/checkout/entrega`, …) — settled as a single page in
  the map's Notes; the accordion is how three steps fit one URL.
- **Randomised order numbers** — §12.
