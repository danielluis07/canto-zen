---
title: Footer
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: [001-route-inventory, 002-brand-direction]
status: closed
---

## Question

What is in the footer, and how is it grouped?

Link columns against the route inventory, plus the non-link content a Brazilian furniture store carries: newsletter capture, payment/security badges, social, CNPJ and seller identification, atendimento hours and channels, policy links. Also how much visual weight the footer carries — a thin utility strip or a substantial editorial block.

Output: footer section spec.

## Resolution

Full spec in [`docs/spec/rodape.md`](../../docs/spec/rodape.md).

**Peso**: bloco substancial, mas textual — sem fotografia em nenhuma rota. Quatro
zonas separadas por filete, fundo `--plaster` (o `--kozo` já está gasto na faixa de
aviso da navbar; só o bloco legal recua para ele), alinhamento assimétrico à
esquerda com a goteira direita vazia.

**Agrupamento**: zona A — linha de fecho em Mincho (5 col) + newsletter (4 col);
zona B — três colunas de link (Ambientes / A marca / Ajuda) mais **Atendimento como
quarta coluna própria**, porque é dado de contato e não navegação; zona C — marcas
de pagamento e redes; zona D — bloco legal recuado em `--kozo`.

**Legal**: razão social + CNPJ + IE + endereço com CEP, todos **fictícios e
concretos** (não placeholders), marcados no spec como substituíveis. Aviso de
arrependimento em **prosa autônoma**, não só o link da coluna Ajuda — a exigência de
"clara e ostensiva" do Decreto 7.962 art. 5º não se satisfaz com link enterrado — e
contando da **data de montagem** quando ela é contratada.

**Ícones**: decisão do dev contra a recomendação inicial. Bandeiras de pagamento
(Pix, Visa, Master, Elo, Amex, Boleto) e marcas de Instagram/Pinterest **entram**, e
o rodapé vira a **única exceção registrada** à regra de zero ícones fixada por
`navbar.md` — neutralizadas em monocromia `--muted` a 18px para não introduzir cor
concorrente ao índigo. Marcas de rede **não são links**; o handle em texto ao lado é
o conteúdo real. **Selos de terceiros ficam fora** (Reclame Aqui, Ebit, PCI) — são
credenciais conquistadas por um CNPJ real e exibi-las seria deturpação, não escolha
de design.

**Newsletter**: entra, reenquadrada como `AVISO DE NOVAS PEÇAS` — sem percentual, sem
imperativo, sem checkbox de consentimento (nota LGPD em texto), sucesso substituindo
o formulário no lugar, sem modal nem toast.

**Mobile**: empilha aberto, **sem acordeão** — movimento que `marca.md` §9 não
autoriza, e um acordeão fechado esconderia links de política que o decreto quer
visíveis.

**`/checkout` recebe rodapé reduzido** (marcas + Ajuda + Atendimento + bloco legal;
sem fecho, newsletter ou colunas de ambiente); `/carrinho` mantém o completo. Isso é
uma restrição entregue ao ticket Checkout sections.

**Névoa fechada**: o canal de cancelamento self-service. Sem autenticação não há área
do cliente, então o **canal de atendimento nomeado é a "mesma ferramenta"** do
Decreto 7.962 art. 5º — WhatsApp e e-mail explícitos no aviso do rodapé e em
`/politicas/trocas-e-devolucoes`, com o prazo de 7 dias e o dever de resposta em 5
dias do art. 4º. Não abre ticket novo.
