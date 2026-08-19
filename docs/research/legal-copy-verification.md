# Legal copy — primary-source verification

Resolves [ticket 019](../../.wayfinder/tickets/019-legal-copy.md). Every quote below was
read from **planalto.gov.br**, not a mirror, and the URL beside each is the one that was
fetched. This file replaces the mirror citations
(`modeloinicial.com.br`) that [`br-ecommerce-conventions.md`](br-ecommerce-conventions.md)
§6.2 and §7.1 relied on.

**Headline: the mirror was accurate.** Every statutory sentence quoted in the earlier
research matches planalto verbatim. The debt this pass paid was *provenance*, not error —
and that matters, because it means the errors found are all in the **application** of
correct text, not in the text itself. Six corrections follow; four of them change shipped
copy.

---

## 1. What was fetched

| Norm | URL |
|---|---|
| CDC — Lei 8.078/1990 (compilado) | `https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm` |
| Decreto 7.962/2013 | `https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2013/decreto/d7962.htm` |
| LGPD — Lei 13.709/2018 | `https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm` |
| Lei 13.455/2017 | `https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2017/lei/l13455.htm` |

---

## 2. CDC — the arrependimento right

**Art. 49**, verbatim:

> O consumidor pode desistir do contrato, no prazo de 7 dias a contar de sua assinatura ou
> do ato de recebimento do produto ou serviço, sempre que a contratação de fornecimento de
> produtos e serviços ocorrer fora do estabelecimento comercial, especialmente por telefone
> ou a domicílio.

**Parágrafo único**, verbatim:

> Se o consumidor exercitar o direito de arrependimento previsto neste artigo, os valores
> eventualmente pagos, a qualquer título, durante o prazo de reflexão, serão devolvidos, de
> imediato, monetariamente atualizados.

Three things the store's copy has to get from this, and only one of them was in it:

- **"7 dias"**, unqualified. The statute does not say *corridos*. Calendar days is the
  settled reading and every large retailer writes *dias corridos*; the store's gloss is
  **correct and may stay**, but it is a gloss, not a quotation, and the policy page must
  not present it inside quotation marks.
- **"a contar de sua assinatura ou do ato de recebimento"** — the statute gives two start
  points and the goods sale takes receipt, which is the later and more consumer-favourable
  one. The store's *a contar do recebimento* is right.
- **The refund duty is in the parágrafo único and no surface mentioned it.** *De imediato,
  monetariamente atualizados* is half of what art. 49 grants and the store's copy said
  nothing about money coming back.

**Art. 26 II** — 90 days to complain of apparent defects in durable goods, counted from
effective delivery (§1º). **Art. 18 §1º** — the supplier has 30 days to cure the defect;
failing that the consumer chooses between replacement, immediate refund monetarily
updated, or a proportional price reduction. These are what make *defeito* a different path
from *arrependimento*, with a longer window.

**Art. 35** — where the supplier refuses to honour the offer, the consumer chooses between
forced performance, an equivalent substitute, or rescission with refund monetarily updated
plus damages. This is the delivery-delay paragraph of `entrega-e-frete`.

**Art. 101, I** — *"a ação pode ser proposta no domicílio do autor"*. The consumer sues
where they live. **A forum-selection clause naming São Paulo would be abusive**, which
corrects the `termos-de-uso` content point.

**Art. 31** — the offer must carry *"informações corretas, claras, precisas, ostensivas e
em língua portuguesa"* about characteristics, quality, composition, price, guarantee and
origin. This is the basis for disclosing natural-wood variance as a **characteristic of the
piece**, not as a liability disclaimer.

---

## 3. Decreto 7.962/2013 — the e-commerce duties

**Art. 2º**, verbatim opening plus the two incisos the footer implements:

> Os sítios eletrônicos ou demais meios eletrônicos utilizados para oferta ou conclusão de
> contrato de consumo devem disponibilizar, **em local de destaque e de fácil visualização**,
> as seguintes informações:
> I - nome empresarial e número de inscrição do fornecedor, quando houver, no Cadastro
> Nacional de Pessoas Físicas ou no Cadastro Nacional de Pessoas Jurídicas do Ministério da
> Fazenda;
> II - endereço físico e eletrônico, e demais informações necessárias para sua localização e
> contato;

Note **"nome empresarial"**, not *razão social*. A Ltda.'s nome empresarial *is* its razão
social, so the footer's field list is right; the spec's phrasing is a narrowing, not an
error. Inscrição Estadual is confirmed **absent** from the decree — the footer includes it
by convention, as it says.

**Art. 5º**, verbatim:

> O fornecedor deve informar, de forma clara e ostensiva, os meios adequados e eficazes para
> o exercício do direito de arrependimento pelo consumidor.
> § 1º O consumidor poderá exercer seu direito de arrependimento **pela mesma ferramenta
> utilizada para a contratação**, sem prejuízo de outros meios disponibilizados.
> § 2º O exercício do direito de arrependimento implica a rescisão dos contratos acessórios,
> **sem qualquer ônus para o consumidor**.
> § 3º O exercício do direito de arrependimento será comunicado imediatamente pelo fornecedor
> à instituição financeira ou à administradora do cartão de crédito ou similar, para que:
> I - a transação não seja lançada na fatura do consumidor; ou
> II - seja efetivado o estorno do valor, caso o lançamento na fatura já tenha sido realizado.
> § 4º O fornecedor deve enviar ao consumidor **confirmação imediata do recebimento** da
> manifestação de arrependimento.

**Art. 4º, VI** — the supplier must confirm receipt of consumer demands *immediately*, and
**"pelo mesmo meio empregado pelo consumidor"**.

Three corrections come out of art. 5º, and they are the substantive findings of this pass:

1. **§1º kills "fale com a gente pelo WhatsApp".** The contract is concluded on the site,
   so the site is the *mesma ferramenta* and must accept the withdrawal. Off-site channels
   are the *"outros meios"* the paragraph permits **in addition**, never instead. See
   [`rodape.md`](../spec/rodape.md) §3.
2. **§4º and art. 4º VI kill "respondemos em até 5 dias" as written.** Confirmation of
   receipt is **immediate and by the channel the consumer used**; five days is a resolution
   deadline. Collapsing the two into one sentence promises the slower thing about the duty
   that must be instant.
3. **§2º settles the return-freight question the institutional spec left open.** Accessory
   contracts are rescinded *sem qualquer ônus* — so **montagem is refunded in full and the
   consumer pays no collection freight.** "Who pays return freight" was never an open
   design question; it was a decided one nobody had looked up.

**Art. 6º** — contracted deliveries must observe prazos, quantidade, qualidade e adequação.

---

## 4. LGPD — what the checkout line owes

**Art. 6º, I** (finalidade) — treatment for *"propósitos legítimos, específicos, explícitos
e informados ao titular"*. **III** (necessidade) — the minimum necessary.

**Art. 7º** — the legal bases. Two apply here and they are **different bases for the two
forms**:

- **V** — *"quando necessário para a execução de contrato ou de procedimentos
  preliminares relacionados a contrato do qual seja parte o titular, a pedido do titular
  dos dados"*. This is the **checkout**: nome, CPF, e-mail, celular, endereço. **Consent is
  the wrong basis and a consent checkbox would be wrong**, not merely unnecessary — the
  store cannot honour a refusal and still deliver.
- **I** — consentimento. This is the **newsletter e-mail only**. Submitting the field under
  a clear notice is a manifestação de vontade; the footer's decision against a tick-box
  survives contact with the statute.

**Art. 9º** — the titular has a right of easy access to information *"de forma clara,
adequada e ostensiva"* about: I finalidade específica; II forma e duração; III identificação
do controlador; IV contato do controlador; V compartilhamento; VI responsabilidades;
VII **direitos do titular, com menção explícita aos direitos contidos no art. 18**.

**Art. 9º §3º** — where treatment is a **condition** for supplying the product, the titular
is informed **com destaque** of that fact and of how to exercise art. 18 rights. Checkout
data is exactly such a condition, so the purpose line owes a route to the full policy.

**Art. 18** — confirmação, acesso, correção, anonimização/bloqueio/eliminação, portabilidade,
eliminação dos dados consentidos, informação sobre compartilhamento, informação sobre a
possibilidade de não consentir, revogação.

**Art. 19, II** — a clear and complete declaration within **15 days** of the request.

---

## 5. Lei 13.455/2017 — the Pix discount, and a citation the cart got wrong

**Art. 1º**: *"Fica autorizada a diferenciação de preços de bens e serviços oferecidos ao
público em função do prazo ou do instrumento de pagamento utilizado."*

**Art. 2º** inserts **art. 5º-A into Lei 10.962/2004** — *not* into the CDC:

> O fornecedor deve informar, em local e formato visíveis ao consumidor, eventuais descontos
> oferecidos em função do prazo ou do instrumento de pagamento utilizado.

Two errors follow from reading this properly:

- [`carrinho.md`](../spec/carrinho.md) §5.1 cited it as **"Lei 13.455 / CDC art. 5º-A"**.
  There is no art. 5º-A in the CDC. The article lives in Lei 10.962/2004.
- The same line said the disclosure is *"what makes the differential price lawful"*.
  It is not. **Art. 1º makes the differentiation lawful on its own**; the disclosure is a
  separate duty whose breach is an infraction sanctioned under the CDC, not a defect that
  voids the price. The map's gist of
  [ticket 004](../../.wayfinder/tickets/004-br-ecommerce-conventions.md) inherits the same
  slip — it calls the badge *legally-required*. **The discount is optional; disclosing one
  you offer is mandatory.**

---

## 6. The fabricated CNPJ

No statute forbids displaying invented identification. The problem is the one art. 2º
exists to prevent: the block's whole function is to let a consumer **locate and identify a
real supplier**, and a well-formed fabricated CNPJ performs that function convincingly and
falsely. A `51.204.876/0001-40` that happens to collide with a real registration points a
complaint at a real company.

The store already refuses fabricated selos, fabricated ratings and a fabricated order
number ([`rodape.md`](../spec/rodape.md) §9, [`checkout.md`](../spec/checkout.md) §13). The
identification block is the last fabricated artefact presented without qualification, and
it is the one with a third party on the other end of it.

**Resolved: the block carries its own disclosure line in shipped copy** — see
[`rodape.md`](../spec/rodape.md) §3. Not a banner, not a per-page repeat: one annotation
line inside the block it qualifies.

---

## 7. Findings summary

| # | Surface | Status | Correction |
|---|---|---|---|
| A | [`rodape.md`](../spec/rodape.md) §3 | **wrong** | Withdrawal exercised through the site's own form (Decreto art. 5º §1); WhatsApp/e-mail demoted to *outros meios*. |
| B | [`rodape.md`](../spec/rodape.md) §3 | **wrong** | "respondemos em até 5 dias" splits: confirmation is immediate and same-channel (art. 5º §4, art. 4º VI); 5 days is resolution. |
| C | [`institucional.md`](../spec/institucional.md) §11 | **wrong** | Return freight and montagem are not open questions: no cost to the consumer (art. 5º §2). |
| D | [`carrinho.md`](../spec/carrinho.md) §5.1 | **wrong** | `CDC art. 5º-A` → Lei 10.962/2004 art. 5º-A; disclosure does not make the price lawful. |
| E | [`checkout.md`](../spec/checkout.md) §5 | **thin** | Purpose line owes a route to the policy (art. 9º §3) and the basis is art. 7º V, not consent. |
| F | [`rodape.md`](../spec/rodape.md) §3 | **added** | Fictional identification disclosed in shipped copy. |
| G | *paraphrases, left alone* | ok | *7 dias corridos*, *a contar do recebimento*, the montagem extension — all correct, the last one now labelled as a store grant beyond art. 49. |
