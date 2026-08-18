# Catálogo — landing de ambiente e listagem de peças

Resolve o ticket [Room landing & product listing sections](../../.wayfinder/tickets/008-catalog.md).

Quatro rotas usam este arquivo ([`rotas.md`](rotas.md)):

| Rota | Superfície |
|---|---|
| `/[ambiente]` | Landing de ambiente |
| `/[ambiente]/[tipo]` | Listagem de tipo |
| `/produtos` | Listagem geral |
| `/colecoes/[slug]` | Listagem de coleção |

São **um só template**. O que muda entre elas é o cabeçalho e quais controles
renderizam — nunca a grade, nunca o card.

O trabalho desta página é um só: **deixar o comprador comparar peças sem que a
página compita com elas.** Tudo aqui se justifica contra isso.

---

## 0. Ordem e ritmo

| # | Bloco | Renderiza em |
|---|---|---|
| 1 | Cabeçalho | todas as quatro |
| 2 | Banda de tipos | `/[ambiente]`, `/[ambiente]/[tipo]` |
| 3 | Barra de filtros e ordem | `/[ambiente]`, `/[ambiente]/[tipo]`, `/produtos` |
| 4 | Régua de abertura — `{n} PEÇAS` | todas, exceto resultado zero |
| 5 | Grade | todas |
| 6 | Linha de política | todas |
| 7 | Paginação | todas |

Container `1360px`, goteira `clamp(1.5rem, 4vw, 4.5rem)`, grade de 12 colunas —
[`marca.md`](marca.md) §5. O respiro entre blocos aqui é **menor** que os `7rem`
da home: `2.75rem` entre cabeçalho e banda de tipos, `1.5rem` entre banda, barra e
régua, `2.75rem` da régua até a primeira linha da grade. A home estabelece ritmo
editorial; esta página estabelece ritmo de leitura, e `7rem` entre um filtro e a
grade que ele governa separa causa de efeito.

`7rem` volta entre a última linha da grade e a paginação, e da paginação até o
rodapé.

---

## 1. Cabeçalho

Sempre **textual**. Nenhuma das quatro rotas abre com fotografia.

A fotografia de ambiente existe (`Ambiente.imagem`) e já é gasta na home
([`home.md`](home.md) §2), onde faz trabalho de roteamento. Repeti-la no topo da
página para a qual o visitante *acabou de rotear* revende uma decisão já tomada e
empurra a primeira peça uma tela inteira para baixo. O trabalho desta página é
peça.

### Por rota

| Rota | Sobrancelha | Título | Prosa |
|---|---|---|---|
| `/[ambiente]` | `AMBIENTE` | `ambiente.label` — Display L (Mincho) | `ambiente.descricao`, uma frase, Corpo, `34ch` |
| `/[ambiente]/[tipo]` | `{AMBIENTE.LABEL}` | `tipo.label` — Display L (Mincho) | nenhuma |
| `/produtos` | nenhuma | `TODAS AS PEÇAS` — **anotação, não Mincho** | nenhuma |
| `/colecoes/[slug]` | `COLEÇÃO` | `colecao.nome` — Display L (Mincho) | `colecao.descricao`, Corpo, `34ch` |

`/produtos` não recebe Mincho porque Mincho é para nome de peça, título de coleção
e título editorial ([`marca.md`](marca.md) §4). "Todas as peças" não é nenhum dos
três — é um rótulo de sistema, e a voz de anotação é exatamente isso.

A listagem de tipo herda a sobrancelha do ambiente em vez de uma prosa própria:
quatro ambientes × ~5 tipos são ~20 textos autorados que ninguém lê, e o par
sobrancelha-mais-título já diz `SALA / Sofás` sem custo de autoria.

**Sem breadcrumb nestas rotas.** O caminho está no cabeçalho e na banda de tipos,
e a navbar marca o ambiente ativo ([`navbar.md`](navbar.md) §9). Breadcrumb é da
PDP, onde a URL é plana e não carrega o caminho ([`rotas.md`](rotas.md)).

---

## 2. Banda de tipos

Só em `/[ambiente]` e `/[ambiente]/[tipo]`.

Lista horizontal, voz de anotação, alinhada à esquerda: **`TODAS`** primeiro,
depois os tipos curados de `ambiente.tipos` **na ordem exata da tabela de
[`rotas.md`](rotas.md)** — a mesma ordem do painel da navbar.

- Item ativo: rótulo em `--ink` cheio com **filete de 1px em `--ink` embaixo**.
  Os demais em `--muted`. Este é o vocabulário de estado ativo que
  [`navbar.md`](navbar.md) §9 já fixou; um segundo dispositivo para a mesma ideia
  seria um dialeto.
- Em `/[ambiente]`, o ativo é `TODAS`.
- Separação por espaço (`1.5rem`), **não** por `·` nem por filete vertical.
- Filete de 1px em `--hairline` fechando a banda por baixo.

**Quebra em duas linhas** quando não couber. Nunca scroll horizontal: uma banda
rolável esconde navegação fora da tela, e navegação escondida é a razão pela qual
o painel da navbar existe.

Isto não duplica o painel da navbar. O painel é revelado sob intenção e some; a
banda é o estado permanente da página, e é ela que torna tipo visivelmente um
**caminho landável**, não um filtro — a distinção que `rotas.md` §5 fixou.

---

## 3. Barra de filtros e ordem

Não renderiza em `/colecoes/[slug]` — ver §9.

**Forma: barra horizontal de filetes.** Uma faixa de gatilhos em voz de anotação,
alinhados à esquerda, separados por filete vertical de 1px em `--hairline`,
fechada por filete horizontal embaixo. `ORDENAR` fica na **extremidade direita** da
mesma barra, empurrado pelo espaço vazio — o único elemento da página alinhado à
direita, porque ordem não é filtro e a distância diz isso sem rótulo de grupo.

**Não é trilho lateral.** Um rail de checkboxes gasta 3 das 12 colunas
permanentemente em quatro facetas e lê como a densidade de comércio que
[`marca.md`](marca.md) §5 raciona. **Não é gatilho único escondido**: filtro é o
único auxílio de navegação que esta página tem depois da banda de tipos, e
escondê-lo atrás de `FILTRAR` no desktop é esconder a página.

**Não é fixa no scroll.** [`navbar.md`](navbar.md) §8 já fixa uma barra em 72px;
uma segunda empilha duas faixas permanentes sobre uma página de densidade baixa.
Com 12 peças por página, voltar ao topo nunca é longe.

### Facetas

| Gatilho | Rota | Múltipla | Chave | Semântica |
|---|---|---|---|---|
| `TIPO` | só `/produtos` | não | — (path nas rotas de ambiente) | igualdade |
| `AMBIENTE` | só `/produtos` | não | `ambiente` | `produto.ambientes` contém |
| `COR` | todas | **sim** | `cor` | qualquer-uma |
| `MATERIAL` | todas | **sim** | `material` | qualquer-um |
| `PREÇO` | todas | não | `preco` | faixa |

Cor e material são de seleção múltipla com semântica **qualquer-uma**: uma peça
com `cor: cru` casa com `?cor=cru&cor=carvalho`. Um produto tem uma cor e vários
materiais ([`produto.md`](produto.md)); a multiplicidade está no filtro, não no
registro.

Nas rotas de ambiente, `TIPO` **não** vira gatilho — ele é a banda de §2, e a
mesma escolha oferecida duas vezes em dois vocabulários diferentes é um erro de
modelo, não uma conveniência.

### Faixas de preço

Quatro, **constantes de loja** — nunca derivadas do conjunto de resultados
corrente, para que a mesma URL signifique a mesma coisa em toda rota.

| Rótulo | `?preco=` |
|---|---|
| Até R$ 2.000 | `0-2000` |
| R$ 2.000 a R$ 5.000 | `2000-5000` |
| R$ 5.000 a R$ 10.000 | `5000-10000` |
| Acima de R$ 10.000 | `10000-` |

Seleção única — faixas sobrepostas são um filtro sobre o qual ninguém raciocina.
Valores em reais inteiros, como [`rotas.md`](rotas.md) fixou; o extremo aberto
omite o segundo termo.

**Sem slider.** Arrastar é interação de movimento, e uma loja-conceito não tem
distribuição real de preços que justifique granularidade contínua.

### Painéis

Ao clicar, o gatilho abre um painel ancorado abaixo dele.

| Propriedade | Valor |
|---|---|
| Fundo | `--plaster` |
| Borda | filete de 1px em `--hairline` |
| Raio, sombra | 0, nenhuma |
| Largura | conteúdo, mínimo `220px` |
| Padding | `1.25rem` |

- Itens em Corpo S, `--ink`, `0.375rem` de padding vertical. Hover leva a
  `--indigo` — o mesmo tratamento do painel da navbar ([`navbar.md`](navbar.md) §6).
- **Cor mostra a amostra**: quadrado de 12px preenchido com `cor.amostra`, filete
  de 1px em `--hairline`, antes do rótulo. É o único lugar do storefront onde cor
  fora da paleta aparece em interface, e ela aparece como **dado do produto**, não
  como decoração — é a amostra do tecido, não um acento.
- Múltipla escolha marca com **filete de 1px em `--ink` sob o rótulo**, não com
  checkbox: caixa de seleção é um controle de formulário e este é um conjunto de
  links.
- Um painel por vez. Abrir outro fecha o anterior.

### Aplicação

**Imediata.** Cada seleção é uma navegação real para uma URL renderizada no
servidor — sem botão `APLICAR`, sem estado intermediário, sem modelo de filtragem
no cliente para especificar. O painel **permanece aberto** após a seleção, para
que um segundo valor da mesma faceta possa ser marcado sem reabrir.

`pagina` é **descartada** em qualquer mudança de filtro ou ordem: a página 3 de
outro conjunto de resultados não é um lugar.

### Estado aplicado

O estado mora **no próprio gatilho**, não em fichas abaixo da barra:

```
COR · CRU, CARVALHO
```

Rótulo e valores em `--ink` (contra `--muted` quando vazio), valores em caixa alta
na mesma voz de anotação, separados por vírgula. Três ou mais valores colapsam
para `COR · 3 SELECIONADAS`.

Uma linha de fichas removíveis sob uma barra de gatilhos **declara o mesmo fato
duas vezes**, e ficha-com-`×` é uma forma arredondada num sistema de raio zero.

`LIMPAR` aparece ao final da barra, em anotação `--muted`, **somente quando alguma
faceta está aplicada**, e aponta para a URL da rota sem query.

### Ordem

Três tokens. Nada mais entra.

| Rótulo | `?ordem=` | Significado |
|---|---|---|
| Curadoria | *omitido* | `produto.ordem` crescente — **padrão** |
| Menor preço | `menor-preco` | `precoTabela` crescente |
| Maior preço | `maior-preco` | `precoTabela` decrescente |

O padrão é omitido da URL para que a rota canônica não carregue query.

**Fora, deliberadamente:** `relevancia` (não há busca — fora de escopo no mapa
inteiro), `novidades` e `mais-vendidos` (sinal fabricado; [`rotas.md`](rotas.md) já
recusou `/novidades` e `/promocoes`, e [`produto.md`](produto.md) recusou estoque
numérico pela mesma razão).

Curadoria como padrão significa que a listagem **é composta**, não alfabética nem
acidental — a mesma posição que a coleção assume e que a home assume em todas as
sete seções.

**Peças `esgotado` vão sempre para o fim**, dentro de qualquer ordem ativa. Ver §5.

---

## 4. Régua de abertura

**A régua desta página é a contagem de resultados.**

Régua de abertura de seção ([`marca.md`](marca.md) §2, caso "número real a
declarar"), rótulo `{n} PEÇAS`, `n` = total de resultados após filtro — não o
número de cards na página corrente. Corre à borda superior da grade, alinhada à
esquerda, largura do container.

É a única régua da página. Isso torna a contagem **ser** o gesto da marca em vez
de mais uma linha de cromo, e satisfaz de uma vez o "resultado visível" que
qualquer listagem deve.

`1 PEÇA` no singular.

**Não renderiza quando `n = 0`** — ver §8. Não renderiza em nenhum card.

### Por que não há régua nos cards

[`marca.md`](marca.md) §2 permite a régua "em comparação de escala no catálogo",
e mesmo assim ela não entra aqui: o teto é de **duas por tela**, e uma grade de 12
cards não tem como conceder uma a cada peça sem transformar a assinatura em
textura. A largura em cm continua presente em todo card, na voz de anotação (§6) —
a promessa que [`produto.md`](produto.md) fez ao manter o cm fora do `nome`
continua cumprida, só que sem o filete.

**Comparação de escala real** — todas as fotos de uma listagem renderizadas numa
escala compartilhada, de modo que um sofá de 240cm apareça visivelmente mais largo
que um de 180cm — foi considerada e **descartada nesta rodada**: obriga o sistema
de imagem ([ticket 014](../../.wayfinder/tickets/014-imagery.md)) a fotografar
tudo contra uma referência comum, e faz peças pequenas renderizarem minúsculas,
punindo exatamente os produtos que mais precisam de ajuda. Se voltar, volta como
ticket de protótipo, não como linha deste spec.

---

## 5. Grade

**Três colunas, preenchendo as 12.** Cada card ocupa 4 colunas.

Quatro colunas encolhem a peça até a fotografia deixar de ser o argumento. A
goteira direita vazia da home ([`home.md`](home.md) §3) é certa para uma
*composição* de três peças escolhidas; uma listagem é um trilho — a mesma razão
pela qual `home.md` §5 deixou a banda de serviço ser a única seção a alcançar a
coluna 12.

- Espaço entre linhas: `4rem`. Entre colunas: a goteira padrão.
- **Sem altura de card fixa e sem alinhamento de linha base entre cards.** A
  imagem mantém a proporção real da peça ([`marca.md`](marca.md) §7), então o
  bloco de texto começa onde a imagem termina. Uma grade de alturas iguais exige
  recortar a foto ou emoldurá-la, e as duas coisas quebram a regra de fotografia.
- Sem filete entre células. Sem card visível — não há caixa, borda, fundo nem
  sombra. O card é a peça mais o texto sob ela.
- 12 por página (§7).

---

## 6. Card

A anatomia herda a da tira de destaques da home ([`home.md`](home.md) §3), com
duas diferenças declaradas abaixo.

| Elemento | Papel tipográfico | Fonte |
|---|---|---|
| Imagem `principal` | proporção real, sem régua | `produto.imagens[0]` |
| Nome | Display M (Mincho) | `produto.nome` |
| Acabamento | Anotação, `--muted` | `produto.acabamento` |
| **Largura** | Anotação, `--muted` | `L {medidas.largura} CM` |
| Disponibilidade | Anotação, `--muted` | ver tabela abaixo |
| Preço à vista | **Corpo**, tabular | derivado de `precoTabela` |

Acabamento, largura e disponibilidade ocupam **uma única linha**, separados por
`·`, na ordem acima.

### As duas diferenças em relação ao card da home

1. **A largura entra.** Móvel se compra pela medida que tem de caber na parede
   (pesquisa §7.4), e [`produto.md`](produto.md) manteve o cm fora do `nome` com a
   promessa explícita de que a cota o carregaria. Num card que não pode ter régua
   (§4), a linha de anotação é essa promessa cumprida. Lida de `medidas.largura`,
   nunca escrita à mão.
2. **A linha de parcelamento sai.** Doze cards × duas linhas de preço são 24
   linhas numéricas por tela, e a página vira tabela de preços. O parcelamento
   sobrevive **uma vez por listagem**, na linha de política (§7) — exatamente o
   tratamento que `home.md` §3 deu ao selo Pix pela mesma razão.

O papel tipográfico **Preço (`1.75rem`) continua reservado ao herói e à PDP**,
como `home.md` §3 fixou. O card usa Corpo com numeral tabular.

`precoDe`, quando presente, renderiza **antes** do preço à vista, em Corpo S
`--muted` com tachado de 1px — sem cor, sem selo de percentual.

### Disponibilidade

| `disponibilidade` | Texto no card |
|---|---|
| `envio-imediato` | `ENVIO IMEDIATO` |
| `sob-encomenda` | `SOB ENCOMENDA · {prazoProducaoSemanas} SEMANAS` |
| `esgotado` | `ESGOTADO` |

Sempre em `--muted`, sempre no mesmo lugar. **Sem cor de estado**: verde e
vermelho não existem na paleta ([`marca.md`](marca.md) §3), e a distinção que
importa está no texto.

**Peças esgotadas aparecem, nunca somem**, e ordenam por último dentro da ordem
ativa. Escondê-las faria a contagem mentir e fingiria que um ateliê sob encomenda
nunca esgota. **Sem opacidade reduzida, sem véu cinza** — apagar é um efeito, e a
peça continua valendo o olhar. O que muda é só o texto; a PDP é que retira o CTA
de compra ([`produto.md`](produto.md)).

### Interação

- **O card inteiro é um link** para `/produtos/[slug]`. Nenhum controle dentro
  dele — sem botão de adicionar, sem favoritar (não há conta no escopo do mapa).
- Hover: o **nome vai a `--indigo`** na transição de cor de 120ms, como os links
  do painel da navbar ([`navbar.md`](navbar.md) §6). Nada mais muda.
- **Sem troca de imagem no hover** para o shot `ambientada`, sem zoom, sem
  elevação. Imagem que muda sob o cursor é movimento, e
  [`marca.md`](marca.md) §9 concede apenas cor.
- Foco: o anel de `--indigo` de `marca.md` §6, no card inteiro.

---

## 7. Linha de política e paginação

**Linha de política** — uma única linha em anotação `--indigo`, alinhada à direita
do filete que fecha a grade:

```
10% À VISTA NO PIX · ATÉ 10X SEM JUROS
```

Ambos os números vêm de `politicas` ([`produto.md`](produto.md)), nunca escritos à
mão. É a mesma solução de `home.md` §3 — a política dita **uma vez** por tela em
vez de repetida por card, que gastaria índigo doze vezes onde
[`marca.md`](marca.md) §3 permite duas.

**Paginação** — 12 por página. Numerada, renderizada no servidor.

```
← 1 2 3 →
```

Voz de anotação, centralizada, `7rem` abaixo da grade. Página corrente em `--ink`
com filete de 1px embaixo; as demais em `--muted`. Setas são os caracteres `←` e
`→`, **não ícones** ([`navbar.md`](navbar.md) fixou zero ícones; o rodapé é a
única exceção registrada). Extremos desabilitados não renderizam.

`?pagina=` é omitido na página 1 ([`rotas.md`](rotas.md)).

### Por que não é scroll infinito

Doze divide por 3 e por 2, preenchendo desktop e mobile exatamente. E scroll
infinito: é uma superfície de movimento e de estado sobre a qual
[`marca.md`](marca.md) §9 nada diz; torna o rodapé inalcançável, e o rodapé carrega
a identificação exigida por lei ([`rodape.md`](rodape.md) §6); e quebra a premissa
de URL linkável e indexável sobre a qual a tabela de rotas inteira foi construída.
`VER MAIS` tem os dois últimos problemas em grau menor e nenhuma vantagem.

---

## 8. Resultado zero

Acontece só por combinação de filtros — par ambiente × tipo inexistente é **404**,
não grade vazia ([`rotas.md`](rotas.md) §6), e essa superfície é do
[ticket 016](../../.wayfinder/tickets/016-error-surfaces.md).

- **A régua não renderiza.** `0 PEÇAS` anota uma grade que não existe, e régua
  vazia é proibida por [`marca.md`](marca.md) §2. A proibição morde aqui
  exatamente como foi projetada.
- Cabeçalho, banda de tipos e barra de filtros **permanecem** — são a saída.
- No lugar da grade, uma linha em Corpo e um `LIMPAR FILTROS` em CTA:

  > Nenhuma peça com esses filtros.

- **Sem sugestões, sem "talvez você goste", sem peças relacionadas.** Uma
  loja-conceito não tem base honesta para recomendar; `produto.md` e `home.md` já
  recusaram sinal fabricado duas vezes.

---

## 9. Coleção

`/colecoes/[slug]` usa o mesmo cabeçalho, régua, grade, card, linha de política e
paginação. **Não renderiza banda de tipos nem barra de filtros e ordem.**

[`produto.md`](produto.md) fixou que `Colecao.produtos` é uma lista ordenada cuja
**sequência é o ato editorial**. Um controle de ordem oferece destruir a única
coisa pela qual a página existe, e filtrar uma seleção curada de poucas peças a
deixa incoerente com a descrição que está no topo dela.

A régua lê `{colecao.produtos.length} PEÇAS`, idêntica à abertura de coleção da
home ([`home.md`](home.md) §4) — mesmo número, mesmo rótulo, mesma derivação.

Sem paginação na prática: uma coleção acima de 12 peças pagina como qualquer
outra, mas a curadoria não deveria chegar lá.

---

## 10. `/produtos`

Mesmo template. Cabeçalho de anotação (§1), **sem banda de tipos**, e a barra de
filtros ganha duas facetas que as rotas de ambiente não têm: `TIPO` e `AMBIENTE`
(§3).

`AMBIENTE` casa contra `produto.ambientes`, o conjunto completo — não contra
`ambientePrincipal`. Um banco que pertence a Quarto e Sala aparece nos dois
filtros; `ambientePrincipal` decide só o breadcrumb da PDP
([`rotas.md`](rotas.md)).

`/produtos` não tem slot permanente na navbar ([`navbar.md`](navbar.md) §5) e não
tem link de fecho na home ([`home.md`](home.md) §7). Ela existe como destino de
filtro e de link direto, não como caminho oferecido — e o cabeçalho de sistema em
vez de Mincho declara justamente isso.

---

## 11. Dados

Duas adições, ambas **aditivas** — no mesmo espírito da adição de
`Ambiente.imagem` feita por [`home.md`](home.md) §8.

```ts
type Ambiente = {
  slug: string;
  label: string;
  tipos: string[];
  imagem: { src: string; alt: string };
  descricao: string;   // NOVO — uma frase, cabeçalho de /[ambiente] (§1)
};

type Produto = {
  // …
  ordem: number;       // NOVO — sequência autorada, ordem `curadoria` (§3)
};
```

`Ambiente.descricao` é **uma frase**, não um texto de categoria: ela ocupa `34ch`
sob o nome do ambiente e nada mais.

`Produto.ordem` é global, não por ambiente nem por tipo — uma peça tem uma posição
curatorial, e ela se preserva em qualquer recorte. Um número por ambiente
multiplicaria o campo por quatro para expressar a mesma intenção.

Nenhuma outra entidade muda. Filtros leem `cor`, `materiais`, `precoTabela`,
`tipo`, `ambientes`; o card lê `imagens[0]`, `nome`, `acabamento`,
`medidas.largura`, `disponibilidade`, `prazoProducaoSemanas`, `precoTabela`,
`precoDe` — tudo já existente.

---

## 12. Mobile

Uma coluna de página, **grade em duas colunas**.

Uma coluna transformaria 12 peças num scroll de uma dúzia de telas e tornaria
comparação impossível, que é a única coisa para a qual uma listagem serve. Em duas
colunas o nome pode quebrar em duas linhas; ele quebra.

- **Cabeçalho** — igual, prosa em largura total.
- **Banda de tipos** — quebra em quantas linhas precisar. Sem scroll horizontal.
- **Filtros** — dois gatilhos lado a lado, `FILTRAR` e `ORDENAR`, cada um abrindo
  uma folha de altura cheia em `--plaster` com as facetas empilhadas e uma ação de
  fechar ao pé: `VER {n} PEÇAS`, com `n` atualizado a cada seleção. Aqui a troca
  que §3 recusou se inverte: não há coluna sobrando, e a alternativa é uma barra
  que quebra em quatro linhas acima de toda grade. A folha aparece e some sem
  animação — [`marca.md`](marca.md) §9 concede só cor.
- **Régua** — permanece; é uma linha.
- **Linha de política** — abaixo da grade, alinhada à esquerda.
- **Paginação** — igual.

Respiro entre blocos cai para os pisos de `marca.md` §5, nunca abaixo.

---

## 13. Restrições entregues a outros tickets

- **[Product data shape](../../.wayfinder/tickets/003-product-data-shape.md)** —
  `Ambiente` ganha `descricao`, `Produto` ganha `ordem` (§11). Aditivo, não
  reversão; `produto.md` traz nota apontando para cá.
- **[Product detail](../../.wayfinder/tickets/009-product-detail.md)** — a PDP
  recebe o clique de todo card e é quem retira o CTA de compra em `esgotado`. O
  card **não** tem adicionar-ao-carrinho: a decisão de compra de um móvel passa
  por medida, frete por CEP e montagem, todos moradores da PDP.
- **[Imagery system](../../.wayfinder/tickets/014-imagery.md)** — a listagem
  consome **apenas** a imagem `principal`, em proporção real, sem recorte para
  altura fixa (§5). Nenhuma listagem pede `ambientada`, `detalhe` ou `escala`. A
  comparação de escala compartilhada foi descartada (§4) — o sistema de imagem
  **não** precisa de referência comum entre peças.
- **[Error surfaces](../../.wayfinder/tickets/016-error-surfaces.md)** — resultado
  zero por filtro está resolvido aqui (§8). O 404 de par ambiente × tipo
  inexistente continua sendo daquele ticket, e é uma superfície diferente.
- **[Route metadata](../../.wayfinder/tickets/015-route-metadata.md)** — quatro
  formas de cabeçalho (§1) são os quatro `<h1>`. Páginas com `?pagina=` ou filtro
  aplicado precisam de decisão de canônico e de indexação; este spec não a toma.
- **[Motion](../../.wayfinder/tickets/017-motion.md)** — a listagem não tem
  revelação em scroll, troca de imagem em hover, animação de painel de filtro nem
  transição entre páginas da grade. Só a transição de cor de 120ms.
- **Dados de exemplo do catálogo** (névoa do mapa) — 12 por página fixa a demanda:
  cada tipo curado precisa de peças suficientes para que a grade não fique com
  duas peças, e o conjunto precisa exercitar os três estados de
  `disponibilidade`, as quatro faixas de preço e pelo menos uma peça em mais de um
  ambiente.

---

## Omissões deliberadas

Consideradas e descartadas — registradas para não serem relitigadas:

- **Fotografia no cabeçalho de ambiente.** §1.
- **Trilho lateral de filtros**, e **gatilho `FILTRAR` escondido no desktop.** §3.
- **Slider de preço.** §3.
- **Fichas removíveis de filtro aplicado.** §3 — o estado mora no gatilho.
- **Scroll infinito e `VER MAIS`.** §7.
- **Régua por card**, e **comparação de escala compartilhada.** §4.
- **Troca de imagem no hover.** §6.
- **Adicionar ao carrinho pelo card**, e **favoritar** (não há conta no escopo).
- **Ordenar por novidades, mais vendidos ou relevância.** §3.
- **Sugestões em resultado zero.** §8.
- **Filtro ou ordem em coleção.** §9.
- **Contador de resultados separado da régua** — a régua é a contagem. §4.
- **Numeração ordinal nos cards** — fora do sistema por
  [`marca.md`](marca.md) §2.

## Como isso foi decidido

Duas rodadas de grilling sobre o ticket
[Room landing & product listing sections](../../.wayfinder/tickets/008-catalog.md).
A primeira fixou *o que estas páginas são*: um template para quatro rotas, landing
de ambiente como cabeçalho mais banda de tipos sobre a mesma grade, filtros em
barra horizontal em vez de trilho, paginação em vez de scroll infinito, e a
anatomia do card. A segunda fixou densidade, mobile, resultado zero e os detalhes
de comportamento dos filtros.

A decisão mais consequente é a **régua como contagem de resultados**: ela resolve
de uma vez o resultado visível que toda listagem deve e o teto de duas réguas por
tela, e é o que impede a assinatura da marca de virar textura na única página do
storefront que repete um layout doze vezes.
