---
title: Room landing & product listing sections
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: [002-brand-direction, 003-product-data-shape]
status: closed
---

## Question

What do the browse surfaces contain?

Two related things: the room landing page (editorial header, sub-navigation, how it differs from a bare grid) and the product listing itself (filter set and its placement, sorting, grid density and card anatomy, pagination vs. infinite scroll, result count and applied-filter display).

Card anatomy is where the product data shape meets the visual direction — settle exactly what a card shows.

Output: `docs/spec/catalogo.md`.

## Resolution

Spec completo em [`docs/spec/catalogo.md`](../../docs/spec/catalogo.md).

**Um template para quatro rotas.** `/[ambiente]`, `/[ambiente]/[tipo]`, `/produtos`
e `/colecoes/[slug]` compartilham grade e card; só cabeçalho e quais controles
renderizam mudam. A landing de ambiente é **cabeçalho textual + banda de tipos
sobre a mesma grade** — nem página editorial sem grade (transformaria as quatro
páginas mais linkadas da loja em becos com um clique a mais antes de qualquer
peça), nem grade nua (a espinha da loja lendo como resultado de filtro).
**Sem fotografia no cabeçalho**: `Ambiente.imagem` já é gasta na home fazendo
roteamento, e repeti-la revende uma decisão já tomada empurrando a primeira peça
uma tela para baixo.

**A régua da página é a contagem de resultados** — `{n} PEÇAS`, abrindo a grade,
uma só na página. Resolve de uma vez o resultado visível que toda listagem deve e
o teto de duas réguas por tela; **régua por card está proibida** (12 cards não
cabem no teto sem virar textura) e a **comparação de escala compartilhada** que
`marca.md` §2 permitiria foi descartada — obrigaria o sistema de imagem a uma
referência comum e faria peças pequenas renderizarem minúsculas. Em **resultado
zero a régua não renderiza**: `0 PEÇAS` anota uma grade inexistente e régua vazia é
proibida — a proibição mordendo como projetada.

**Filtros em barra horizontal de filetes**, não trilho lateral (gastaria 3 de 12
colunas na densidade de comércio que a marca raciona) nem gatilho escondido no
desktop. Cor e material **múltiplos com semântica qualquer-uma**, preço em **quatro
faixas fixas de loja** (sem slider — arrastar é movimento), tipo só em `/produtos`
porque nas rotas de ambiente ele é a banda. Aplicação **imediata**, sem botão
aplicar; **estado mora no gatilho** (`COR · CRU, CARVALHO`), não em fichas — ficha
declara o mesmo fato duas vezes e é forma arredondada num sistema de raio zero.
Ordem tem **três tokens** — `curadoria` (padrão, omitido da URL, lendo o novo
`Produto.ordem`), `menor-preco`, `maior-preco`; relevância, novidades e mais
vendidos ficam fora por não terem fonte honesta.

**Paginação numerada, 12 por página**, não scroll infinito: 12 divide por 3 e por
2, e o infinito é superfície de movimento não especificada, torna inalcançável o
rodapé que carrega identificação exigida por lei, e quebra a premissa de URL
linkável de `rotas.md`.

**Card**: herda a anatomia da tira da home com duas diferenças declaradas — entra
a **largura em anotação** (`L 78 CM`, cumprindo a promessa que `produto.md` fez ao
manter o cm fora do `nome`) e **sai o parcelamento** (24 linhas numéricas por tela
viram tabela de preços), que sobrevive uma vez por listagem na linha de política
junto ao Pix, mesmo tratamento que `home.md` §3. Grade de **três colunas
preenchendo as 12**, sem altura fixa (proporção real é regra de fotografia), card
inteiro é link, hover só leva o nome a `--indigo` — **sem troca de imagem**.
Esgotado **aparece e ordena por último**, sem véu nem opacidade.

Coleção **não renderiza filtro nem ordem**: a sequência é o ato editorial e um
controle de ordem oferece destruí-la. Mobile inverte a escolha do desktop — dois
gatilhos `FILTRAR`/`ORDENAR` abrindo folha de altura cheia — e a grade vai a duas
colunas, porque uma coluna torna impossível a comparação que é a única coisa para
a qual a listagem serve.

**Adições aditivas ao modelo**: `Ambiente.descricao` e `Produto.ordem`; nota em
`produto.md` aponta para cá.
