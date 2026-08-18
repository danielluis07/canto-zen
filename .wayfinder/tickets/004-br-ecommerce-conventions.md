---
title: Brazilian e-commerce UX conventions
parent: map
labels: [wayfinder:research]
assignee: danielluis07 (research subagent)
blocked-by: []
status: closed
---

## Question

What conventions does a Brazilian shopper expect from an online furniture store, that a generic e-commerce design would miss?

Specifically: CEP-based frete calculation and where it appears; parcelamento display ("12x de R$ ...") and its placement rules; Pix and boleto presentation even in a non-transacting concept; price formatting and the a-vista discount convention; CPF fields; Codigo de Defesa do Consumidor obligations that show up in UI (7-day return notice, seller identification); delivery-window and montagem messaging for furniture specifically.

Output: findings written to `docs/research/br-ecommerce-conventions.md`, cited to primary sources and real Brazilian storefronts.

## Resolution

Findings: [`docs/research/br-ecommerce-conventions.md`](../../docs/research/br-ecommerce-conventions.md) — full detail with citations, ending in a 19-point "Implications for the Canto Zen spec".

The load-bearing conclusions:

1. **Frete lives on the product page, not just the cart.** Brazilian freight is quoted per-CEP and per cubed volume, so it cannot be a flat rate. The result is a *list* of options (carrier / price / prazo em dias uteis), not one number. Zero renders as "Frete Gratis", often region-scoped. Prazo counts from payment confirmation, not order. Decreto 7.962/2013 art. 2 IV+V make freight cost and delivery deadline part of the offer.
2. **Every price is two prices.** Canonical template `{N}x de R$ {valor} sem juros`, in muted type below the price — but stores show an a-vista total *and* a financed total (Mobly verbatim: `Por: R$ 2.924,96 / a vista com Pix ou 1x no Cartao de Credito / ou R$ 3.249,96 em ate 10x de R$ 324,99 sem juros`). CDC art. 52 V requires showing the total with and without financing. Max N varies 6x-12x by store and product.
3. **Pix first, with the discount badge; card needs a parcelas dropdown.** The parcelas select and a cardholder-CPF field are the elements a US/EU checkout design omits. Boleto clears in up to 3 business days and must warn about it. Stores disagree on boleto: MadeiraMadeira offers it (plus boleto parcelado 24x com juros), Tok&Stok has none.
4. **Formatting**: `R$ 1.599,99` — comma decimal, dot thousands, space after R$, centavos always. The Pix discount badge is legally load-bearing: Lei 13.455/2017 makes visible disclosure the condition for pricing differently by payment method. Typical magnitude 5-10%.
5. **Checkout identity fields**: Identificacao -> Entrega -> Pagamento. E-mail, CPF (masked, check-digit), **Nome completo as one field**, Celular with DDD `(00) 00000-0000`. Address starts with CEP and must auto-fill logradouro/bairro/cidade/UF, with `Numero` as its own required field. CPF is fiscal/anti-fraud convention, not a CDC requirement.
6. **CDC obligations that hit the UI**: footer must carry razao social + CNPJ + physical address; the 7-day arrependimento notice must be *ostensive*; Decreto 7.962 art. 5 requires cancellation "pela mesma ferramenta" — a self-service return path, not "email us". Furniture nuance: returns must be desmontado, em embalagem original, and Mobly counts the 7 days from *assembly* date when assembly was purchased.
7. **Furniture-specific**: montagem is a PDP add-on carrying its own metadata (nivel de dificuldade, no de pessoas, no de pecas, tempo) and price — Tok&Stok's same-day-as-delivery model with a 2-year guarantee beats Mobly's separate scheduling. Bulky-item access disclosure is a real slot generic designs lack (fits the lift, else stairs to 3rd floor max). Dimensions are cm with comma decimals, labelled **L x P x A**, headline width in the product title ("Sofa 3 Lugares ... 223cm"), a Medidas table, plus a second set for medidas da embalagem.

**Caveats carried forward**: statutory text came from a mirror (planalto.gov.br refused connection) and deserves one cross-check before any legal copy is finalised; the checkout field *order* is high-confidence VTEX convention but exact labels are unverified, as no live checkout was reachable.

**Note for adjacent tickets**: the conventional Brazilian checkout is three steps, not one page. Our settled single-page-accordion decision maps onto it as three accordion sections in that order — Checkout sections & the concept disclosure should confirm that mapping rather than re-open it.
