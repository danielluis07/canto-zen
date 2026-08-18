# Brazilian e-commerce conventions for an online furniture store

Research note for the **Canto Zen** page-and-section spec. Question: *what does a Brazilian
shopper expect from an online furniture store that a generic US/EU e-commerce design would miss?*

Every claim below is tagged:

- **[LEI]** — legally required (statute or decree cited).
- **[CONVENÇÃO]** — not required by law, but near-universal across the Brazilian market.
- **[UMA LOJA]** — observed at one or two stores; do not treat as a standard.

Storefronts observed directly (Aug 2026): Mobly, MadeiraMadeira, Tok&Stok, Westwing, Etna, Oppa.
Note: several of these are JS-heavy; where a fetch returned only partial DOM this is flagged.

---

## 1. CEP-based frete (shipping) calculation

### Why it exists

Brazil has no flat national shipping. Freight is quoted per-CEP (8-digit postal code), and for
furniture it is quoted per *cubed volume*, not just weight — VTEX, the dominant BR commerce
platform, documents that freight "considera sempre dois parâmetros: o peso e o volume do produto,
com prioridade de cálculo para o peso real ou cubado, vale o maior"
([VTEX Help — planilha de frete](https://help.vtex.com/pt/docs/tutorials/planilha-de-frete)).
This is why the CEP box is a *product-page* element in Brazil and not merely a cart element.

### Legal basis for showing it

**[LEI]** Decreto 7.962/2013 (the "Lei do E-commerce") art. 2º, IV requires
*"discriminação, no preço, de quaisquer despesas adicionais ou acessórias, tais como as de entrega
ou seguros"*, and art. 2º, V requires *"condições integrais da oferta, incluídas modalidades de
pagamento, disponibilidade, forma e prazo da execução do serviço ou da entrega ou disponibilização
do produto"*
([Decreto 7.962/2013, art. 2º](https://modeloinicial.com.br/lei/DEC-7962-2013/lei-e-commerce/art-2)).
So: freight cost **and** delivery deadline are legally part of the offer, not a checkout surprise.

### Where it appears

- **Product page (PDP)** — **[CONVENÇÃO]**, and this is the biggest divergence from US/EU design.
  A CEP input sits inside the buy-box, usually directly under the price/parcelamento block and
  above or beside "Comprar". Observed on MadeiraMadeira's PDP as the label
  *"Informe o seu CEP"*
  ([MadeiraMadeira PDP](https://www.madeiramadeira.com.br/sofa-tie-3-lugares-com-chaise-lado-esquerdo-223cm-em-linho-cabecasa-madeiramadeira-719800.html)).
  Brazilian commerce guidance treats PDP freight simulation as standard practice specifically
  because freight is the leading cause of cart abandonment locally
  ([base.com — calcular frete](https://base.com/pt-BR/blog/calcular-frete/)).
- **Cart** — **[CONVENÇÃO]** the same widget reappears. Mobly's own help centre describes the flow
  as: enter the CEP in the field and click **"Calcular o Frete"**, after which
  *"o prazo de entrega será informado"*
  ([Mobly — prazo de entrega](https://atendimento.mobly.com.br/?entrega=prazo-de-entrega-qual-e-o-prazo-de-entrega-da-mobly)).
- **Checkout** — the CEP is asked again as the first address field and auto-fills
  logradouro/bairro/cidade/UF (see §5).

**Yes — "calcular frete" appears before checkout, on the PDP.** That is the convention. A design
that only reveals freight at the payment step will read as evasive to a Brazilian shopper.

### What the input and result look like

**[CONVENÇÃO]** shape, consistent across the observed stores:

- Input: masked `00000-000`, numeric keypad on mobile, single field.
- Adjacent secondary link "Não sei meu CEP" → opens the Correios lookup. (Common pattern; I could
  not capture it verbatim on the fetched pages, so treat as convention, not verified string.)
- Button label is imperative: **"Calcular"** / **"Calcular frete"** / **"Calcular o Frete"**
  (Mobly's help text uses the last).
- Result renders as a small table of *options*, not one number — each row is
  carrier/modality + price + prazo, e.g. `Entrega padrão — R$ 89,90 — até 12 dias úteis`.
  Multiple carrier options are explicitly recommended local practice
  ([base.com](https://base.com/pt-BR/blog/calcular-frete/)).
- **[CONVENÇÃO]** `R$ 0,00` is written as the word **"Grátis"** / **"FRETE GRÁTIS"**, never as zero.
  MadeiraMadeira's listing carries badges *"FRETE GRÁTIS"* and region-scoped variants
  *"Frete Grátis Brasil"*, *"Frete Grátis Sul/SE"*, *"SP Capital"*
  ([MadeiraMadeira — sofás](https://www.madeiramadeira.com.br/moveis/moveis-para-sala-de-estar/sofas)).
  Region-scoped free shipping is a real Brazilian nuance: free to the Southeast, paid to the North.
- **[CONVENÇÃO]** the prazo is counted in **dias úteis** and starts *after payment confirmation*,
  not after order placement — Mobly states *"este prazo começa a valer somente após a confirmação
  de pagamento do seu pedido"*
  ([Mobly](https://atendimento.mobly.com.br/?entrega=prazo-de-entrega-qual-e-o-prazo-de-entrega-da-mobly)).
  This matters because boleto takes up to 3 business days to clear (§3).

---

## 2. Parcelamento display

This is the single most load-bearing Brazilian pricing convention. In Brazil the *installment* is
often the headline number a shopper compares, not the total.

### Legal basis

**[LEI]** CDC art. 52 requires, whenever credit/financing is involved, prior and adequate
information on: *"I - preço do produto ou serviço em moeda corrente nacional; II - montante dos
juros de mora e da taxa efetiva anual de juros; III - acréscimos legalmente previstos; IV - número
e periodicidade das prestações; V - soma total a pagar, com e sem financiamento"*
([CDC art. 52](https://modeloinicial.com.br/lei/CDC/codigo-defesa-consumidor/art-52)).
Inciso V is why Brazilian stores show *both* the à-vista total and the parcelado total.

### Exact phrasing observed

Mobly's product card (verbatim, [Mobly — sofás](https://www.mobly.com.br/sofas/)):

```
De: R$ 3.944,99
Por: R$ 2.924,96
à vista com Pix ou 1x no Cartão de Crédito
ou R$ 3.249,96 em até 10x de R$ 324,99 sem juros
```

Note the structure: **two different totals**. `R$ 2.924,96` is the à-vista price; `R$ 3.249,96` is
the parcelado price; the discount for paying à vista is the difference. This is the "correct"
Brazilian pattern and it is what a generic design gets wrong (a generic design shows one price).

Other observed variants:

- Etna: `R$ 699,90` … `12x de R$ 58,33 sem juros` — 12x is Etna's headline
  ([Etna — sofá Odessa](https://www.etna.com.br/p/sofa-2l-odessa-pvc-65x128x77cm/0432216)).
- MadeiraMadeira product cards: `ou 10x de R$ ... sem juros`, `ou 7x de ...`, `ou 6x de ...` —
  the max N varies per product, i.e. the number is data, not a constant
  ([MadeiraMadeira](https://www.madeiramadeira.com.br/moveis/moveis-para-sala-de-estar/sofas)).
- Oppa: *"parcele suas compras em até 12x no cartão"*
  ([Oppa](https://www.oppa.com.br/)).
- Tok&Stok: normally up to 6x sem juros, up to 10x sem juros during Sale, with a
  **parcela mínima de R$ 150,00**
  ([Tok&Stok — formas de pagamento](https://atendimento.tokstok.com.br/articles/7tuHehctWawvQnmG8Ds4Tk-Formas-de-pagamento)).

**Phrasing template** — **[CONVENÇÃO]**, canonical form:

```
{N}x de R$ {valor} sem juros
```

with the optional hedge **"em até"** prefix (`em até 10x de R$ 324,99 sem juros`) when N is a
ceiling rather than the only option. Where interest applies, `sem juros` becomes `com juros` and
CDC art. 52 II/V then obliges you to show the taxa and the soma total.

### Where it sits relative to the price

**[CONVENÇÃO]** vertical order in the buy-box, top to bottom:

1. strikethrough "De: R$ …" (only if there is a discount)
2. **à-vista price, largest type** — with the payment method that earns it, inline
3. *"ou"* line: parcelado total + `Nx de R$ … sem juros`, smaller/secondary type
4. optional link "Ver formas de pagamento" opening a full parcelamento table (1x…12x)

Both Mobly and MadeiraMadeira put the installment line *below* the headline price, in muted type.
No observed store puts parcelamento above the price.

### Where stores disagree

- **Whether the headline price is the à-vista or the parcelado price.** Mobly and Westwing headline
  the **Pix/à-vista** price (Westwing: *"Preço reduzido de R$ 829,00 para R$ 415,03 no PIX"*,
  [Westwing](https://www.westwing.com.br/)). Etna headlines the plain price and appends 12x.
  Headlining the à-vista price with the method named inline is the **more common** modern pattern
  and is what I recommend for Canto Zen.
- **Max installments**: 6x (Tok&Stok baseline) → 10x (Mobly, Tok&Stok Sale) → 12x (Etna, Oppa,
  MadeiraMadeira cartão). **12x sem juros is the aspirational/most-quoted figure** in furniture.
- **Parcela mínima** exists at some stores (Tok&Stok R$ 150,00) and not others. If Canto Zen
  advertises "até 12x", a min-installment rule changes the real N for cheap items.

---

## 3. Pix and boleto at checkout

**Pix** is an instant central-bank payment rail (QR code / copia-e-cola). It has overtaken cards in
Brazilian e-commerce volume, which is why it is not a footnote in the payment step
([Finsiders / EBANX](https://finsidersbrasil.com.br/estudos-e-relatorios/em-2025-pix-ultrapassara-cartao-em-pagamentos-no-e-commerce-diz-ebanx/)).

### Presentation

**[CONVENÇÃO]** the payment step is a set of tabs/radio cards, in this order:

1. **Pix** — usually first, usually carrying the discount badge. Selecting it shows a QR code plus
   a "copia e cola" code and a countdown for expiry. No card form.
2. **Cartão de crédito** — number / nome impresso no cartão / validade / CVV, plus a
   **parcelas dropdown** listing each option as `1x de R$ 2.924,96` … `10x de R$ 324,99 sem juros`.
   This dropdown is the mandatory Brazilian card-form element a US/EU design omits entirely.
   VTEX additionally has a per-country cardholder-identification field which in Brazil is **CPF**
   ([VTEX — campo de identificação do titular do cartão](https://help.vtex.com/pt/announcements/2022-04-29-checkout-configuracao-do-campo-de-identificacao-do-titular-do-cartao)).
3. **Boleto bancário** — a printable/PDF bank slip. Selecting it must warn about clearing time.

Observed payment mixes:

- MadeiraMadeira: cartão de crédito (Visa, Mastercard, Amex, Diners, Elo, Hipercard) up to 12x,
  boleto, Pix, plus **boleto parcelado em até 24x** (with interest, 2%–11% ao mês). Card/Pix clear
  immediately or within 2 business days; **boleto takes up to 3 business days**. It classifies
  *boleto, Pix, CDC, Madeira Pay and 1x no cartão* as "pagamento à vista"
  ([MadeiraMadeira — formas de pagamento](https://ajuda.madeiramadeira.com.br/hc/pt-br/articles/36016416347035-Formas-de-pagamento),
  [boleto parcelado](https://ajuda.madeiramadeira.com.br/hc/pt-br/articles/36251587684763-Como-funciona-o-Boleto-Parcelado)).
- Tok&Stok: cards + **Pix, no boleto** — its formas-de-pagamento article does not list boleto, and
  it offers an unusual **"4 parcelas sem juros" via Pix** (today, 15, 30, 45 days)
  ([Tok&Stok](https://atendimento.tokstok.com.br/articles/7tuHehctWawvQnmG8Ds4Tk-Formas-de-pagamento)). **[UMA LOJA]**
- Etna: cards + boleto bancário.
- Tok&Stok footer payment icons: Visa, Mastercard, Amex, Diners, Elo, JCB, **PIX**
  ([tokstok.com.br](https://www.tokstok.com.br/)).

### Practical consequences for the UI

- **[CONVENÇÃO]** the "à vista" language covers Pix, boleto **and 1x no cartão** — they are the same
  price tier. Say *"à vista com Pix ou 1x no Cartão de Crédito"* (Mobly's exact wording) rather
  than "Pix only", unless the discount really is Pix-exclusive (Tok&Stok's 5% Pix discount *is*
  Pix-exclusive).
- **[CONVENÇÃO]** the boleto option must state that the order ships only after clearing — this ties
  back to §1's "prazo starts after payment confirmation".
- Boleto is in structural decline against Pix; a modern concept store may reasonably ship
  Pix + cartão only (as Tok&Stok does). Include boleto if the brand skews to lower-income or
  unbanked buyers.

---

## 4. Price formatting and the "à vista no Pix" badge

### Formatting — **[CONVENÇÃO]** (and de-facto mandatory)

- Symbol **`R$`** precedes the number, with a space: `R$ 2.924,96`.
- **Comma is the decimal separator, dot is the thousands separator.** `R$ 1.599,99`,
  `R$ 3.944,99`, `R$ 5.099,99`. Verified verbatim on Mobly, Tok&Stok, Etna, Westwing.
- Centavos are always shown, even on round numbers: `R$ 499,90`, `R$ 829,00`.
- In code: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`. Do **not** roll
  your own formatter — `pt-BR` also governs dates (`dd/mm/aaaa`) and the CEP mask.
- Discount badges are written as `-70%` or `70% OFF` or `Economize 25%`; all three occur
  (Tok&Stok uses `-70% desconto de 70%`, MadeiraMadeira uses `X% OFF`, Mobly uses `Economize 25%`).

### The à-vista / Pix discount badge — **[LEI + CONVENÇÃO]**

**[LEI]** Price differentiation by payment method is *legal* under Lei 13.455/2017, which added
art. 5º-A to Lei 10.962/2004: *"O fornecedor deve informar, em local e formato visíveis ao
consumidor, eventuais descontos oferecidos em função do prazo ou do instrumento de pagamento
utilizado."*
([Lei 13.455/2017](http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13455.htm);
[Lei 10.962/2004](https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l10.962.htm)).
So the Pix discount badge is not decoration — **the visible disclosure is the legal condition for
charging a different price.** Senacon has stated the right does not exempt the merchant from the
duty to inform clearly, objectively and ostensively
([Consumidor Moderno](https://consumidormoderno.com.br/preco-diferente-dinheiro-pix-cartao/)).

**[CONVENÇÃO]** badge patterns observed verbatim:

| Store | String |
|---|---|
| Mobly | `à vista com Pix ou 1x no Cartão de Crédito` (as a caption under the price) |
| Westwing | `30% OFF no PIX acima de R$ 499`; `Preço reduzido de R$ 829,00 para R$ 415,03 no PIX` |
| Oppa | `+10% off pagando no PIX` |
| Tok&Stok | 5% off with Pix on purchases above R$ 50,00 |

The generic short form used across BR retail is **`R$ X,XX à vista no Pix`** or a pill reading
**`10% OFF no Pix`**. Discount magnitude in furniture typically runs 5%–10% (Tok&Stok 5%,
Oppa 10%); Westwing's 30% is a promotional outlier, not a norm.

**Minimum-spend qualifiers are common** (Westwing "acima de R$ 499", Tok&Stok "acima de R$ 50,00")
and must be shown in the badge or immediately adjacent, per art. 5º-A's "local e formato visíveis"
and Decreto 7.962 art. 2º, VI (*"informações claras e ostensivas a respeito de quaisquer restrições
à fruição da oferta"*).

---

## 5. CPF and identity fields at checkout

### Field set

**[CONVENÇÃO]** — the Brazilian checkout asks for materially more identity data than a US/EU one.
The standard set, in order:

**Etapa 1 — Identificação**
- `E-mail`
- `CPF` (11 digits, masked `000.000.000-00`, with check-digit validation)
- `Nome completo` — *one field*, not first/last. Brazilian forms overwhelmingly use a single
  "Nome completo"; VTEX splits it into Nome/Sobrenome internally but presents them together.
- `Celular` with DDD — masked `(00) 00000-0000`. The two-digit DDD area code is part of the number
  and is expected inside the same field, not a separate one.

**Etapa 2 — Entrega**
- `CEP` **first**, with an inline "Não sei meu CEP" link. Entering a valid CEP **auto-fills
  logradouro, bairro, cidade and UF** — this is a hard expectation, not a nicety. Brazilian
  commerce tooling documents that on entering a valid CEP the APIs retrieve and auto-populate
  street, city, state and neighbourhood
  ([base.com](https://base.com/pt-BR/blog/calcular-frete/); pattern is baked into
  [WooCommerce Extra Checkout Fields for Brazil](https://github.com/claudiosanches/woocommerce-extra-checkout-fields-for-brazil)).
- `Endereço` (auto-filled, editable) · **`Número`** (separate, required — Brazilian addresses
  always carry a street number field distinct from the street) · `Complemento` (optional:
  apto/bloco) · `Bairro` (auto-filled) · `Cidade` · `Estado (UF)` · optional `Ponto de referência`.

**Etapa 3 — Pagamento** — see §3. The cardholder CPF may be asked again here.

VTEX's checkout — the reference implementation for most large BR stores — runs exactly this
identification → personal/delivery data (with freight calculated at this point) → payment sequence
([VTEX Checkout — visão geral](https://help.vtex.com/pt/docs/tutorials/checkout-vtex-visao-geral),
[SmartCheckout](https://vtex.com/pt-br/blog/produto/smartcheckout-vtex)).

### Why CPF

**[CONVENÇÃO, fiscally driven]** — CPF is *not* mandated by the CDC or Decreto 7.962. It is asked
because (a) the sale must be invoiced and the shipped-goods NF-e names the destinatário, (b) CPF is
the universal customer key for anti-fraud and card-issuer matching (VTEX's cardholder-identification
field is CPF in Brazil), and (c) many stores use it to key the account. State tax authorities note
the general rule that CPF may be waived on consumer invoices when the consumer declines, with
exceptions and value thresholds
([Receita Estadual RS — obrigatoriedade do CPF](https://atendimento.receita.rs.gov.br/obrigatoriedade-cpf)).
For a *concept* store: ask for it, validate the check digits, but treat it as a UI convention, not
a legal claim.

**[LEI-adjacent]** LGPD requires stating the purpose of each field collected; guidance is to map
each datum and its legal basis
([Mercado Pago — LGPD no checkout](https://www.mercadopago.com.br/blog/lgpd-checkout-checklist-coleta-de-dados)).
In practice this shows up as a short privacy line under the form plus a cookie/consent banner.

### Nota

**[CONVENÇÃO]** many BR checkouts offer a "Pessoa física / Pessoa jurídica" toggle that swaps CPF
for CNPJ + Razão Social + Inscrição Estadual. Optional for a B2C concept store, but expected by
anyone buying furniture for an office.

---

## 6. Código de Defesa do Consumidor obligations that surface in the UI

### 6.1 Seller identification in the footer — **[LEI]**

Decreto 7.962/2013, art. 2º, I and II require the site to display, *"em local de destaque e de fácil
visualização"*:

- I — *"nome empresarial e número de inscrição do fornecedor … no Cadastro Nacional de Pessoas
  Físicas ou no Cadastro Nacional de Pessoas Jurídicas"*
- II — *"endereço físico e eletrônico, e demais informações necessárias para sua localização e
  contato"*

([Decreto 7.962/2013 art. 2º](https://modeloinicial.com.br/lei/DEC-7962-2013/lei-e-commerce/art-2))

Verbatim examples of how stores satisfy this, all in the site footer:

- **Tok&Stok**: *"Estok Comércio e Representações SA. CNPJ: 49.732.175/0001-82"* ·
  *"Avenida Francisco Matarazzo, 1090, 1º andar, Água Branca, São Paulo, CEP: 05.001-100"* ·
  *"IE: 133.750.890.119"* ([tokstok.com.br](https://www.tokstok.com.br/))
- **Westwing**: CNPJ 14.776.142/0001-50 · Av. Queiroz Filho, 1700 – Torre A, 5º andar,
  Vila Hamburguesa, São Paulo ([westwing.com.br](https://www.westwing.com.br/))
- **Oppa**: *"Oppa Design Ltda."* · CNPJ 14.214.549/0001-93 · Rua Pedro Simões de Oliveira, 530,
  sala 3, Centro, Rio Negrinho – SC, CEP 89295-019, plus WhatsApp, phone hours and e-mail
  ([oppa.com.br](https://www.oppa.com.br/))

So the footer legal block is: **razão social + CNPJ + full physical address (with CEP) + e-mail +
phone/WhatsApp + service hours.** Inscrição Estadual is common but not required by the decree.

### 6.2 The 7-day direito de arrependimento — **[LEI]**

**CDC art. 49**: *"O consumidor pode desistir do contrato, no prazo de 7 dias a contar de sua
assinatura ou do ato de recebimento do produto ou serviço, sempre que a contratação de fornecimento
de produtos e serviços ocorrer fora do estabelecimento comercial, especialmente por telefone ou a
domicílio."* Parágrafo único: sums paid are refunded *"de imediato, monetariamente atualizados"*
([CDC art. 49](https://modeloinicial.com.br/lei/CDC/codigo-defesa-consumidor/art-49)).

**Decreto 7.962/2013 art. 5º** adds the UI-facing duty: the supplier *"deve informar, de forma
clara e ostensiva, os meios adequados e eficazes para o exercício do direito de arrependimento"*,
exercisable *"pela mesma ferramenta utilizada para a contratação"*, with rescission of accessory
contracts at no cost, immediate notice to the card issuer so the charge is reversed, and immediate
confirmation of receipt of the withdrawal
([Decreto 7.962 art. 5º](https://modeloinicial.com.br/lei/DEC-7962-2013/lei-e-commerce/art-5)).

Consequences for the design that a US/EU template misses:

- The notice must be **ostensive**, not buried — a "Trocas e Devoluções" footer link plus a short
  inline line in the buy-box / cart / order-confirmation.
- Because it is exercisable "pela mesma ferramenta", a self-service cancel/return path in the
  account area is the compliant pattern, not "email us".
- Tok&Stok's implementation, verbatim: 7 **dias corridos** from receipt for site/App/televendas
  purchases; 15 days for in-store; goods must be returned *desmontados*, in the original packaging,
  with all accessories and manuals
  ([Tok&Stok — política de troca e devolução](https://atendimento.tokstok.com.br/articles/7tmxCalmezIU4gLhtAHzg8-Qual-%C3%A9-o-prazo-para-a-troca-ou-devolu%C3%A7%C3%A3o-de-um-produto)).
  The "desmontado / embalagem original" condition is furniture-specific and worth surfacing.
- **[UMA LOJA / furniture nuance]** Mobly: when assembly is bought with the product, the 7-day
  window counts **from the assembly date**, not the delivery date
  ([Mobly — serviço de montagem](https://atendimento.mobly.com.br/?post_type=servicos-e-promocoes)).

### 6.3 Other things the decree puts on the page — **[LEI]**

Decreto 7.962 art. 2º also requires:
III — essential characteristics of the product including health/safety risks;
IV — itemised additional costs (freight, insurance) — see §1;
V — full terms of the offer including payment modalities, availability, and delivery deadline;
VI — *"informações claras e ostensivas a respeito de quaisquer restrições à fruição da oferta"*
(this is the hook for "válido para SP capital", "acima de R$ 499", "estoque limitado").

Art. 4º requires: a **sumário do contrato before contracting** with limiting clauses highlighted;
tools to identify and correct input errors before finalising; **immediate confirmation of receipt
of the order**; the contract available for storage/reproduction right after purchase; an electronic
service channel for queries, complaints and cancellations, with **replies within 5 days**; and
security mechanisms for payment and personal data
([Decreto 7.962 art. 4º](https://modeloinicial.com.br/lei/DEC-7962-2013/lei-e-commerce/art-4)).

CDC art. 31 underpins all of it: offers must carry *"informações corretas, claras, precisas,
ostensivas e em língua portuguesa"* on characteristics, quality, quantity, composition, **price**,
warranty, validity and origin
([CDC art. 31](https://modeloinicial.com.br/lei/CDC/codigo-defesa-consumidor/art-31)).

**[CONVENÇÃO]** trust seals in the footer are near-universal and shoppers look for them:
Reclame Aqui, Ebit, and a PCI/SSL certificate — all three observed on Tok&Stok
([tokstok.com.br](https://www.tokstok.com.br/promocao/todos-os-moveis)); Westwing displays a
Reclame Aqui certification ([westwing.com.br](https://www.westwing.com.br/)).

---

## 7. Furniture-specific messaging

### 7.1 Prazo de entrega

**[CONVENÇÃO]** furniture delivery windows are long and CEP-dependent; the store states so plainly.
Mobly: *"o prazo de entrega varia de acordo com o produto que você vai comprar e o local que ele
será entregue"*, revealed only after "Calcular o Frete", and starting at payment confirmation
([Mobly](https://atendimento.mobly.com.br/?entrega=prazo-de-entrega-qual-e-o-prazo-de-entrega-da-mobly)).
Contrast **"Envio Imediato"** — Mobly's badge for in-stock, fast-dispatch items
([Mobly — sofás](https://www.mobly.com.br/sofas/)) — with made-to-order items whose prazo runs
weeks. Brazilian furniture shoppers expect this split to be visible **on the card**, not only the PDP.

**[CONVENÇÃO]** delivery is *agendada* (scheduled by date/window, often confirmed by WhatsApp) for
bulky items, not a courier drop.

### 7.2 Montagem (assembly)

**[CONVENÇÃO]** assembly is a purchasable add-on selected **on the product page**, and the PDP
carries assembly metadata. Verbatim from a MadeiraMadeira PDP spec table:

```
Necessita Montagem: Sim
Média: pode ser montado por mais de uma pessoa
Garantia: 24 Meses
Itens inclusos: 1 Sofá e manual de montagem
```
([MadeiraMadeira PDP](https://www.madeiramadeira.com.br/sofa-tie-3-lugares-com-chaise-lado-esquerdo-223cm-em-linho-cabecasa-madeiramadeira-719800.html))

Tok&Stok, verbatim on its help centre: on the product page you can see *"nível de dificuldade,
quantidade de pessoas necessárias, quantidade de peças e tempo de montagem"*; the assembly cost
*"é informado na página do produto e é calculado de acordo com o nível de complexidade e também o
tempo de montagem"*; contracting it guarantees assembly **on the same day as the scheduled
delivery**, coordinated via WhatsApp, and carries a **2-year guarantee** on the assembly
([Tok&Stok — vantagens da montagem](https://atendimento.tokstok.com.br/articles/3SM8piR6WK2HTYlzhiz20y-Quais-as-vantagens-de-contratar-a-montagem-da-Tok&Stok)).

Mobly differs: assembly is scheduled **separately** from delivery — the customer must contact
within 5 business days of delivery, and Mobly has up to 90 calendar days to perform it or refund
([Mobly — serviço de montagem](https://atendimento.mobly.com.br/?post_type=servicos-e-promocoes)).
**Same-day-as-delivery (Tok&Stok) is the better UX and the one to model.**

### 7.3 Freight and access for bulky items

**[CONVENÇÃO]** — this is the furniture-specific disclosure a generic design has no slot for.
Mobly's apartment-delivery policy, in substance: check the product's dimensions and make sure
nothing obstructs the path; if the item fits the building's lift it is delivered to the apartment;
**if it does not fit the lift, delivery goes up the stairs to the 3rd floor at most**; Mobly is not
responsible if the item does not fit the lift or the stairwell, or if delivery above the 3rd floor
by stairs is required. Marketplace partner sellers have their own delivery policies
([Mobly — entregas em apartamento](https://atendimento.mobly.com.br/?entrega=como-funcionam-as-entregas-de-moveis-em-apartamento)).

Also **[CONVENÇÃO]**: because freight is cubed (§1), bulky items commonly carry region-scoped free
shipping rather than national free shipping (MadeiraMadeira's *"Frete Grátis Sul/SE"*,
*"SP Capital"*, Tok&Stok's *"Frete Grátis SP Sale"*), and marketplace items ship from different
sellers with different prazos — so the cart may legitimately show **more than one delivery group**.

### 7.4 How dimensions are communicated

**[CONVENÇÃO]**, and quite specific:

- Always **centimetres**, never inches; comma decimals (`2,02` m or `202 cm`).
- Labelled by axis in Portuguese, typically **Largura × Profundidade × Altura**, abbreviated
  **(L) × (P) × (A)**. Tok&Stok writes it inline in the product name:
  `2,02(L)X99(P)x66(A)`. Etna encodes it in the slug and title:
  `Sofá De 2 Lugares Odessa Pvc Branco 128cm`, `65x128x77cm`
  ([Etna](https://www.etna.com.br/p/sofa-2l-odessa-pvc-65x128x77cm/0432216)).
- **The headline dimension goes in the product name** — `Sofá 3 Lugares … 223cm`,
  `Sofá De 3 Lugares Com Chaise Direito Clean Tramado Cream 275cm`. A shopper filters sofas by
  total width because it must fit a wall; putting it in the title is expected.
- A **"Medidas" / "Especificações técnicas"** table on the PDP, keyed in Portuguese. MadeiraMadeira's
  verbatim keys: `Altura 76 cm`, `Largura 223 cm`, `Profundidade 81 cm`, `Altura do assento 47 cm`,
  `Peso 72,32 kg`, `Capacidade de peso 300 kg`, `Quantidade de lugares`, `Quantidade de almofadas`.
- **[CONVENÇÃO]** a second set of numbers — *medidas da embalagem* / peso do volume — because that
  is what has to fit through the door and the lift (§7.3).

---

## Implications for the Canto Zen spec

Concrete UI elements this research says our pages must carry.

**Global**
1. `Intl.NumberFormat('pt-BR', …)` currency formatting everywhere: `R$ 1.234,56`. Centavos always shown.
2. Footer legal block: **razão social · CNPJ · full address with CEP · e-mail · telefone/WhatsApp ·
   horário de atendimento**. Legally required by Decreto 7.962 art. 2º I–II.
3. Footer links: *Trocas e Devoluções* (carrying the 7-day arrependimento text), *Política de
   Privacidade* (LGPD), *Termos de Uso*, *Formas de Pagamento*, *Prazos e Entrega*, *Central de
   Ajuda*. Trust-seal row (Reclame Aqui / SSL) as a visual convention.

**Product card (listing)**
4. Two-tier price: strikethrough `De: R$ …` + headline **à-vista price**, with the qualifying method
   inline (`à vista no Pix`), then a muted `ou {N}x de R$ … sem juros` line.
5. Badge slot for `% OFF`, `Frete Grátis` (with region qualifier where applicable), `Envio Imediato`.
6. Headline dimension in the product title (`Sofá 3 Lugares Linho 223cm`).

**Product page (PDP)**
7. Buy-box order: título → price block (§4 shape) → *"Ver todas as formas de pagamento"* link
   opening a 1x…12x parcelamento table → **CEP field + "Calcular frete"** returning a list of
   `opção · R$ valor · prazo em dias úteis` → montagem add-on checkbox with its own price →
   Comprar / Adicionar à sacola.
8. Montagem block showing: *necessita montagem*, nível de dificuldade, nº de pessoas, nº de peças,
   tempo estimado, price, and the promise of assembly **on the delivery day**.
9. **Medidas** table: Largura / Profundidade / Altura (cm) + altura do assento where relevant +
   peso + capacidade de peso, plus **medidas da embalagem**, and a short access note
   ("confira se o produto passa pelo elevador e portas").
10. Inline ostensive line: *"Você tem 7 dias corridos após o recebimento para desistir da compra."*
11. Garantia badge (e.g. `Garantia de 24 meses`), itens inclusos.

**Cart**
12. CEP + Calcular frete widget repeated; per-item subtotal; a **resumo** showing
    `Subtotal · Frete · Montagem · Desconto Pix · Total à vista` **and** `Total parcelado`
    with `{N}x de R$ …`. CDC art. 52 V wants both totals visible.
13. Support for more than one delivery group / prazo when items ship separately.

**Checkout**
14. Three steps: **Identificação → Entrega → Pagamento**.
15. Identificação: `E-mail`, `CPF` (masked + check-digit validated), `Nome completo` (single field),
    `Celular` with DDD `(00) 00000-0000`.
16. Entrega: `CEP` first with "Não sei meu CEP" link and **auto-fill of logradouro/bairro/cidade/UF**,
    then `Número` as its own required field, `Complemento`, plus a delivery-options list
    (price + prazo) — not a single fixed shipping fee.
17. Pagamento tabs in order **Pix (with discount badge) · Cartão de crédito · Boleto**. The card tab
    must include a **parcelas dropdown** rendering `1x de R$ … · … · 12x de R$ … sem juros`, and a
    cardholder-CPF field. Boleto tab must warn about clearing time and its effect on the prazo.
18. Order review before confirming (Decreto 7.962 art. 4º I–II: contract summary + error correction),
    and an order-confirmation screen/e-mail (art. 4º III–IV).

**Copy**
19. All pt-BR. Prazos in **dias úteis**, counted **after confirmação de pagamento**. Use "sacola" or
    "carrinho" consistently; "Comprar" or "Adicionar à sacola" for the CTA.

---

### Confidence and gaps

- Legal citations are from the statutory text and are solid. I was unable to reach planalto.gov.br
  directly (connection reset repeatedly); CDC and Decreto 7.962 article text was taken from
  modeloinicial.com.br, which reproduces the statutes verbatim — worth a one-time cross-check
  against planalto if the spec will be published.
- Storefront strings for Mobly, Tok&Stok, Westwing, Oppa, MadeiraMadeira and Etna are verbatim from
  live pages. I could **not** capture a live checkout flow (would require an authenticated session
  and a real cart), so §5's field order is reconstructed from VTEX's documented checkout and BR
  checkout tooling rather than direct observation — treat the *order* as high-confidence convention
  and the *exact labels* as likely-but-unverified.
- Exact button label for the PDP freight widget varies ("Calcular", "Calcular frete", "Calcular o
  Frete", "OK"); Mobly's help text is the one verbatim source I have.
