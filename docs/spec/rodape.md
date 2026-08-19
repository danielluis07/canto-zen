# Rodapé — footer

Resolves ticket [Footer](../../.wayfinder/tickets/006-footer.md).
Applies to all 15 routes in [`rotas.md`](rotas.md), with a reduced variant on
`/checkout` (§9). Visual vocabulary lives in [`marca.md`](marca.md); every colour,
measurement and typographic voice quoted here comes from there and is not
redefined. The legal obligations come from
[`br-ecommerce-conventions.md`](../research/br-ecommerce-conventions.md).

This file is written in English prose; every string quoted as copy is the pt-BR
that ships, and domain terms stay pt-BR throughout.

---

## 1. Purpose

The footer does three jobs, in this order of priority:

1. **Comply with Decreto 7.962/2013 art. 2º I–II** — supplier identification in a
   prominent place: razão social, CNPJ, complete physical address, electronic
   address and means of contact.
2. **Make the right of withdrawal conspicuous** (CDC art. 49 + Decreto 7.962
   art. 5º), including the channel through which it is exercised.
3. **Close the page with the atelier's position** — the only surface in the store
   where the position from `marca.md` §1 (made-to-order pieces, in-house
   marcenaria) is stated in prose.

Navigation is the fourth job, not the first. The footer picks up what
[`navbar.md`](navbar.md) pushed downwards — `/produtos`, `/sobre`, `/contato` —
plus the four policies; it does not duplicate the room-primary spine, it only
completes it.

**Weight: a substantial block, not a utility strip.** But substantial in *text*,
not in imagery: a second photograph at the bottom of every page would compete
with the piece above it. There is no photo in the footer, on any route.

---

## 2. Structure

Four stacked zones, separated by 1px hairlines in `--hairline`.

```
──────────────────────────────────────────────────────────────  top hairline
                                                                 (separates from page)
  Peças feitas sob encomenda em          AVISO DE NOVAS PEÇAS   zone A (§4, §5)
  marcenaria própria, em São Paulo.      [ e-mail        ] →
                                         Ao assinar você concorda…
──────────────────────────────────────────────────────────────
  AMBIENTES    A MARCA        AJUDA              ATENDIMENTO    zone B (§6, §7)
  Sala         Inspirações    Trocas e devol.    WhatsApp …
  Quarto       Sobre          Entrega e frete    (11) 3000-0000
  Cozinha      Contato        Privacidade        oi@cantozen…
  Escritório                  Termos de uso      seg–sex, 9h–18h
  Todas as peças
──────────────────────────────────────────────────────────────
  PIX  VISA  MASTER  ELO  AMEX  BOLETO      @cantozen  @cantozen  zone C (§8)
  COMPRA SEGURA
──────────────────────────────────────────────────────────────
  Canto Zen Marcenaria e Comércio de Móveis Ltda. · CNPJ …       zone D (§3)
  Você pode desistir da compra em até 7 dias corridos…
  © 2026 Canto Zen · Todos os direitos reservados
──────────────────────────────────────────────────────────────
```

**Geometry**

| Property | Value |
|---|---|
| Background | `--plaster` — the same as the page |
| Separation from content | 1px hairline in `--hairline` at the top, and nothing else |
| Container | `max-width: 1360px`, gutter `clamp(1.5rem, 4vw, 4.5rem)` |
| Grid | 12 columns, the same as `marca.md` §5 |
| Breathing room above the footer | `7rem` |
| Inner padding per zone | `2.75rem` at the top and bottom of each zone |
| Radius, shadow | 0, none |

**Background `--plaster`, not `--kozo`.** `--kozo` is already spent on the
navbar's notice band; repeating it at the bottom would put every page in a
matching frame, which reads as a template. The tone appears once only, and at the
quietest point: zone D (§3) recesses into `--kozo`.

**Asymmetric alignment**, as in the navbar and as in `marca.md` §5: everything
grouped to the left, the right gutter deliberately empty. No zone is centred.

---

## 3. Legal block (zone D)

The lowest zone, recessed in `--kozo`, vertical padding `2rem`. Three lines, in
this order:

**1 — Supplier identification.** Body S, `--muted`, as a running line separated by
`·`:

> Canto Zen Marcenaria e Comércio de Móveis Ltda. · CNPJ 51.204.876/0001-40 ·
> IE 116.482.930.114 · Rua Harmonia, 742, Vila Madalena, São Paulo — SP,
> CEP 05435-000

Fields the decree requires: razão social, CNPJ, physical address with CEP, e-mail
and a means of contact — the last two live in the atendimento zone (§7), which is
on the same screen. **Inscrição Estadual is included** by convention: it is not
required by the decree, it costs one comma, and its absence is more conspicuous
than its presence in the footer of a Brazilian furniture store.

> **Fictional data.** The razão social, CNPJ, IE, address, phone and e-mail above
> are invented for the concept store. They are well-formed on purpose, so the
> layout is real, and they **must be replaced before any real transaction.** No
> build session should leave them blank or as placeholders: an empty legal block
> is exactly the failure this spec exists to prevent.

**2 — Withdrawal notice.** Body S, `--ink` (not `--muted` — it is the only text in
the zone that has to be read):

> Você pode desistir da compra em até 7 dias corridos a contar do recebimento — ou
> da montagem, quando contratada. Para exercer, fale com a gente pelo WhatsApp ou
> por oi@cantozen.com.br; respondemos em até 5 dias.
> [Como funciona](/politicas/trocas-e-devolucoes)

This is **not** replaceable by the "Trocas e devoluções" link in the Ajuda column.
Decreto 7.962 art. 5º requires *"clear and conspicuous"* information about the
means of exercising it; a link buried in a column does not satisfy "conspicuous",
and a shouted banner would violate the brand. A prose sentence in the legal block
is the correct middle ground.

Counting from the **montagem date** when it is contracted is furniture-specific
and comes from the practice observed in the research; it is included because the
store sells montagem as an add-on.

**3 — Copyright.** Annotation voice, `--muted`:

> © 2026 Canto Zen · Todos os direitos reservados

Nothing else. No "made by", no framework credit, no agency badge.

### The cancellation channel is atendimento

Decreto 7.962 art. 5º asks that withdrawal be exercisable *"through the same tool
used for the purchase"* — which, in a store with user accounts, would be a
self-service screen in the customer area. **Authentication is out of scope in the
map**, so there is no customer area to host it.

The resolution: **the named atendimento channel is the tool.** WhatsApp and e-mail
appear explicitly in the withdrawal sentence (above) and in
`/politicas/trocas-e-devolucoes`, alongside the 7-day window and the duty to
respond within 5 days (art. 4º). That closes the gap without requiring an account
area the map already ruled out.

---

## 4. Closing line (zone A, left)

A single line in **Zen Old Mincho**, Display M (`1.35rem`/1.45), `--ink`,
occupying 5 of the 12 columns:

> Peças feitas sob encomenda em marcenaria própria, em São Paulo.

It is the footer's only feature line and consumes the "one feature line per page"
allowance from `marca.md` §4 when the page has not spent it earlier. There is no
repeat of the wordmark, no symbol, no ornament.

**The régua does not appear here.** `marca.md` §2 explicitly prohibits the gesture
in the footer. The footer's identity comes from restraint and hairlines, not from
the visual signature.

---

## 5. Newsletter (zone A, right)

Occupies 4 of the 12 columns; the right gutter stays empty.

- **Label**: `AVISO DE NOVAS PEÇAS`, annotation voice, `--ink`.
- **One e-mail field and one button**, side by side. No name field, no checkbox.
  Field with a 1px `--hairline` border, radius 0, `--plaster` background; primary
  button per `marca.md` §6.
- **LGPD note** under the field, Body S `--muted`:
  *"Enviamos só quando há peça nova. Cancele quando quiser. Veja a
  [Política de privacidade](/politicas/privacidade)."*
  A note, not a tick-box: a concept store has nowhere to record consent, and a
  checkbox that persists nothing is an interface lie.
- **Success state**: the form is replaced *in place* by a line in the annotation
  voice — `PRONTO. VOCÊ SERÁ AVISADO.` No modal, no toast: both are motion that
  `marca.md` §9 does not authorise.
- **Error state**: message in Body S `--ink` under the field, field border in
  `--ink`. No red — the palette has no traffic lights (`marca.md` §3).

**Prohibited in this zone**: discount percentages, "ganhe 10% na primeira compra",
any imperative verb beyond the button label, subscriber counts. The capture exists
because a made-to-order atelier plausibly announces pieces — not because it
converts.

---

## 6. Link columns (zone B)

Three navigation columns, each with a title in the annotation voice `--muted` and
items in Body S `--ink`. `0.5rem` vertical spacing between items; hover takes the
colour to `--indigo`, 120ms transition.

| AMBIENTES | A MARCA | AJUDA |
|---|---|---|
| Sala → `/sala` | Inspirações → `/inspiracoes` | Trocas e devoluções → `/politicas/trocas-e-devolucoes` |
| Quarto → `/quarto` | Sobre → `/sobre` | Entrega e frete → `/politicas/entrega-e-frete` |
| Cozinha → `/cozinha` | Contato → `/contato` | Privacidade → `/politicas/privacidade` |
| Escritório → `/escritorio` | | Termos de uso → `/politicas/termos-de-uso` |
| Todas as peças → `/produtos` | | |

**The Ajuda column renders from the same list** that generates the
`/politicas/[slug]` routes in `rotas.md` — four policies, one source, no parallel
list.

**Deliberately out:**

- **Tipos** (`/sala/sofas` etc.) — ~20 links would flatten the footer into a
  sitemap. Tipos live in the navbar panel, which is where the navigation decision
  happens.
- **Coleções** — they have no index (`rotas.md`, *Deliberate omissions*).
- **`/carrinho`, `/checkout`** — the navbar already carries them; a purchase
  destination in a footer is noise.
- **Sitemap, FAQ, blog, careers** — they do not exist in the route inventory.

---

## 7. Atendimento (zone B, fourth column)

A column of its own, **not folded inside Ajuda**: this is contact data, not
navigation, and the decree wants it visible.

Title `ATENDIMENTO`, annotation voice. Content in Body S, tabular figures:

> WhatsApp (11) 90000-0000
> Telefone (11) 3000-0000
> oi@cantozen.com.br
> Seg a sex, 9h às 18h

WhatsApp and phone are links (`https://wa.me/…`, `tel:`); the e-mail is
`mailto:`. The opening hours are not a link.

**This does not duplicate `/contato`.** The footer carries the *channel*;
`/contato` carries the form and the showroom. The navbar refused the phone number
(`navbar.md` §1) — that refusal applies to the bar, not to the footer, where the
decree requires it anyway.

---

## 8. Payment and social marks (zone C)

A band of monochrome marks, vertical padding `1.5rem`.

**Payment**, on the left: **Pix · Visa · Mastercard · Elo · American Express ·
Boleto**, as graphical marks, uniform `18px` height, rendered in `--muted`.

**Social**, on the right of the same axis: the **Instagram** and **Pinterest**
marks, same treatment and same height, each followed by the handle `@cantozen` in
the annotation voice. **The social marks are not links** — they are a signal of
presence, not an exit from the store; the handle in text is what carries the
information, and it is what a screen reader announces. No Facebook, X or TikTok.

Under the payment marks, one line in the annotation voice `--muted`:
`COMPRA SEGURA`.

> **Registered exception.** [`navbar.md`](navbar.md) §1 and §11 fixed **zero icons
> at every breakpoint**, and the worded `MENU`/`CARRINHO` follows from that rule.
> The footer is the **only** storefront surface that displays graphical marks, and
> the exception does not generalise: no other chrome element, on any route, gains
> an icon because of it.
>
> The reason: a card flag is a factual statement of what the store accepts, and
> the Brazilian buyer looks for it literally — spelling out `VISA` does not
> substitute for the mark their eye scans for. The chromatic cost is neutralised
> by monochrome: the marks come in as `--muted`, not in brand colour, so that
> índigo remains the palette's only accent (`marca.md` §3).

**Deliberately out: third-party badges.** Reclame Aqui, Ebit and PCI/SSL
certificates are marks *earned by a real CNPJ*. Displaying them on a fictional
store would be the one thing in the footer that constitutes misrepresentation
rather than a design choice. The `COMPRA SEGURA` line covers the reassurance
without faking a third-party credential.

---

## 9. Reduced footer on `/checkout`

`/checkout` gets a lean variant. Kept:

- Zone C (payment marks and `COMPRA SEGURA`) — reassurance at exactly the point
  where it matters.
- The **Ajuda** column and the **Atendimento** column, side by side.
- All of zone D — identification, withdrawal and copyright. The decree's
  identification duty does not stop at checkout.

Dropped: the Mincho closing line, the newsletter, and the Ambientes and A marca
columns.

`/carrinho` keeps the full footer — it is still navigation, and leaving the cart
for an ambiente is a legitimate path.

> **Constraint handed to ticket [Checkout sections](../../.wayfinder/tickets/011-checkout.md):**
> the checkout footer is already specified here. That ticket does not need to
> invent it, and must not remove it entirely — zone D is a legal obligation.

---

## 10. Mobile

Below `768px`, everything **stacks open**. No accordion.

- Order: closing line → newsletter → Ambientes → A marca → Ajuda → Atendimento →
  marks → legal block.
- The three link columns become three stacked blocks, with `2rem` between them.
  At `480–768px` they may go to two columns; below `480px`, one.
- The newsletter stacks the field above the button, both full width.
- The marks band breaks into two rows: payment above, social below.

**An accordion was refused**: it is interaction and motion for ~13 links, and
`marca.md` §9 barely authorises motion at all. Worse, a closed accordion hides the
policy links the decree wants visible. A long footer at the end of the page is
acceptable; a collapsed legal obligation is not.

---

## 11. Accessibility

- The footer is a `<footer>` with `role="contentinfo"`, one per page.
- Each link column is a `<nav>` labelled by its own title (`aria-labelledby`),
  with the items in a `<ul>`.
- **Visible focus is mandatory**: `outline: 2px solid var(--indigo); outline-offset: 3px`
  (`marca.md` §6).
- The graphical payment marks are decorative (`aria-hidden`) and the information
  comes from an equivalent accessible text in the band — a screen reader hears the
  payment methods as words, not as a list of unlabelled images.
- The social marks, not being links, are likewise `aria-hidden`; the handle in
  text beside them is the real content.
- The e-mail field has an associated `<label>`, `type="email"`,
  `autocomplete="email"`. The error message is referenced via `aria-describedby`.
- Contrast: `--muted` on `--plaster` and on `--kozo` must be verified at Body S;
  if it does not pass AA, the legal block's text moves up to `--ink`.

---

## 12. How this was decided

Resolved in conversation, without a prototype — the footer had no contested layout
question, but rather a stack of content and compliance decisions.

The three that cost the most:

- **Icons.** The initial recommendation was to keep the navbar's zero-icon rule
  and spell out the payment methods. The dev decided otherwise; that decision
  stands, and §8 records it as a named exception, with monochrome as the price
  that keeps the palette intact. Third-party badges, however, stayed out — the
  distinction is between stating a fact and displaying a credential you do not
  have.
- **The cancellation channel.** The map carried this as fog since the research.
  Without authentication there is no customer area; the way out is to name the
  atendimento channel as the tool, in the footer itself. §3 clears that fog
  without opening a new ticket.
- **Footer weight.** A substantial block beat the utility strip, but only in text:
  photography was refused because a second image at the bottom of every page
  fights the piece the whole page exists to show.
