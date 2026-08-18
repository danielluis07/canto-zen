---
title: Home page sections
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: [002-brand-direction, 005-navbar]
status: closed
---

## Question

What sections does the home page have, in what order?

The hero and its promise, how rooms are surfaced as the primary entry, where products appear vs. where inspiration appears, social proof, editorial blocks, newsletter, and where the scroll ends. Each section: purpose, layout shape, pt-BR copy direction, data needs.

This is the page that has to make room-primary browsing feel inevitable rather than imposed.

Output: `docs/spec/home.md`.

## Resolution

**Sete seções**, nesta ordem: herói de peça única → ambientes → peças em destaque
→ coleção em destaque → banda de serviço → inspirações → a marcenaria → rodapé.
Spec completo em [`docs/spec/home.md`](../../docs/spec/home.md).

**A home abre com uma peça, não com os ambientes.** Abrir com os quatro ambientes
abriria com uma taxonomia — a parede-de-categorias que a marca recusa — e gastaria
quatro fotografias antes de conquistar atenção. O herói é uma peça sozinha com uma
cota `largura`, preço à vista, selo Pix e parcelamento, limitado a `78vh` para que
o filete dos Ambientes fique visível acima da dobra: os ambientes chegam como o
próximo passo natural em vez de uma demanda de abertura. O clique vai para a PDP,
nunca para a listagem do ambiente.

**A home vende, mas estreito**: três peças com preço, não seis. Uma home sem preço
seria a evasão "sob consulta" que `marca.md` §1 recusou por escrito. Duas rações
são gastas explicitamente na tira: o papel tipográfico **Preço fica reservado ao
herói e à PDP** (em card de 3 colunas ele vira vitrine de oferta), e o **selo Pix
não renderiza por card** — três selos seriam três índigos na mesma tela, o que
`marca.md` §3 declara errado. A política aparece uma vez, como uma linha em
anotação índigo fechando a tira.

**O orçamento de régua é mais duro que a regra da marca: exatamente duas na página
inteira** — o herói (`largura`) e a abertura do bloco de coleção (`{n} PEÇAS`,
derivado de `colecao.produtos.length`, nunca autorado). Proibida nos campos de
ambiente, nos cards, na banda de serviço, nas linhas de Inspirações e no bloco da
marcenaria. O limite da marca é duas por *tela* e a página poderia legalmente
carregar mais; a home é a única página que ensina o que o gesto significa, e um
visitante que o encontra seis vezes aprendeu que ele é enfeite.

**A banda de serviço substitui prova social** — não há avaliações nem selos
honestos — e fica no **meio** da página, entre coleção e Inspirações: as seções 4,
6 e 7 são todas imagem-mais-texto e rimariam três vezes seguidas; sem dark mode e
com um único acento, `--kozo` é o único deslocamento tonal disponível. Frete,
montagem, prazo e arrependimento, sem ícones; três dos quatro linkam para
`/politicas/*`, prazo não — inventar uma página para ele seria pior.

**Inspirações vira três linhas com filete, não cards**, para não repetir o ritmo
da tira de destaques a `7rem` de distância. **A marcenaria fecha a página** e gasta
a única "linha de destaque em Mincho por página" que `marca.md` §4 concede; sua
fotografia é uma **peça inacabada, sozinha**, o que evita abrir uma segunda exceção
ao "peça sozinha". **Sem CTA de fecho, sem repetição dos ambientes** — repetir os
ambientes no fim é o conserto padrão de uma página que falhou em rotear antes.

**Newsletter fica fora** (o rodapé já é dono dela) e **Contato também** — a nota de
`navbar.md` §5 "rodapé e home" é satisfeita pelo bloco Sobre mais a coluna
*Atendimento* do rodapé.

**Toda seleção é autorada**, num objeto `ConteudoHome` (1 slug de herói, 3 slugs de
destaque, 1 coleção, 3 artigos, o bloco marcenaria). Nada é derivado: numa
loja-conceito não existe "novo" honesto nem dado de venda, e `produto.md` já
recusou estoque numérico para não fabricar sinal. A peça do herói **não** é fixada
aqui — isso inventaria dado de catálogo ainda na névoa; o que o spec fixa são as
restrições do slot (imagem `principal` com `cotas: ['largura']`, senão o herói não
renderiza; nunca `esgotado`).

**Uma mudança aditiva a um ticket fechado**: `Ambiente` ganha
`imagem: { src, alt }` — a seção de Ambientes precisa de uma fotografia por
ambiente e o modelo não tinha nenhuma. Não é um `Imagem` (carrega `papel` e
`cotas`, ambos condenados a ficar vazios aqui) nem um shot `ambientada` emprestado
de um produto (o mesmo risco de promoção silenciosa que `produto.md` proibiu, um
nível acima). `docs/spec/produto.md` traz a nota apontando para `home.md` §8.
