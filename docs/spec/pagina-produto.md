# Página de produto — PDP

Resolve o ticket [Product detail page sections](../../.wayfinder/tickets/009-product-detail.md).

Rota: `/produtos/[slug]`, plana, sem o caminho de ambiente ([`rotas.md`](rotas.md)).
Uma peça = um acabamento = uma URL ([`produto.md`](produto.md)).

Este arquivo especifica a **página**. O modelo de dados que ela lê continua em
[`produto.md`](produto.md) — que este ticket altera em quatro pontos (§10).

---

## 0. Ordem e ritmo

| # | Seção | Conteúdo |
|---|---|---|
| 1 | Breadcrumb | anotação, lê `ambientePrincipal` |
| 2 | Bloco de compra | galeria 7 col · buy box 5 col |
| 3 | Descrição | rótulo em anotação + corpo |
| — | *quebra* | imagem `ambientada`, largura total |
| 4 | Medidas | desenho de escala · L × P × A · extras · embalagem |
| 5 | Ficha técnica | materiais, cor, acabamento, cuidados, garantia, itens inclusos |
| — | *quebra* | imagem `detalhe`, largura total |
| 6 | Entrega e acesso | prosa |
| 7 | Fecho | coleção, ou uma linha de link |

Respiro de `7rem` entre seções, nunca menos que `4rem` ([`marca.md`](marca.md) §5).

**O buy box não é sticky.** Ele termina onde termina, e o resto da página é
imagem e ficha. Um painel persistente arrastaria preço e CTA por cima das
medidas e da descrição — exatamente o registro gritado que `marca.md` §1
reconcilia como *voz, não presença* — e o buy box desta página carrega nome,
preço, parcelamento, acabamentos, CEP e montagem, ou seja, excede a altura da
viewport e grudaria mal de qualquer jeito.

---

## 1. Breadcrumb

```
INÍCIO / SALA / POLTRONAS / POLTRONA LINA
```

Voz de anotação, separador `/`, `--muted` nos ancestrais e `--ink` no item
corrente. O ambiente vem de `ambientePrincipal` — a promessa que
[`rotas.md`](rotas.md) fez ao deixar a URL do produto plana: a URL não carrega o
caminho, então o breadcrumb é quem o reconstrói. O segmento de tipo usa
`Tipo.label` (plural), não `labelSingular`, porque ele aponta para a listagem
`/sala/poltronas` — é a rota, não a peça.

**O item corrente não é link.** Nenhum ícone, nenhum chevron — as setas do
sistema são caracteres, e aqui o caractere é `/`.

---

## 2. Bloco de compra

Par padrão de [`marca.md`](marca.md) §5: imagem em 7 colunas, buy box em 5,
goteira grande à direita preservada vazia.

### 2.1 A galeria não é uma galeria

Só a imagem `principal` mora aqui, em **proporção real**, sem recorte, com a
cota que `imagens[0].cotas` declarar.

As outras imagens **não** ficam empilhadas ao lado do buy box nem viram
miniaturas com troca ao clique. Cada `papel` é uma **instrução de posição**:

| `papel` | Onde renderiza |
|---|---|
| `principal` | bloco de compra, coluna de 7 |
| `ambientada` | quebra de largura total entre §3 e §4 |
| `detalhe` | quebra de largura total entre §5 e §6 |

Isto é o que "papéis são nomeados, não posicionais" ([`produto.md`](produto.md))
comprava: a página é determinística a partir dos dados, e uma peça sem
`ambientada` simplesmente não tem aquela quebra — **nada é promovido para o
slot vago**.

Miniaturas com troca ao clique foram descartadas: é um widget de estado numa
página onde [`marca.md`](marca.md) §9 concede apenas transição de cor.

### 2.2 Anatomia do buy box

Ordem, de cima para baixo:

```
Poltrona Lina                          Mincho, Display XL
LINHO CRU · POR {designer}             anotação, --muted

R$ 3.501,00  10% À VISTA NO PIX        Preço tabular + selo --indigo
ou R$ 3.890,00 em 10x de R$ 389,00     Corpo S, --muted
sem juros

OUTROS ACABAMENTOS                     anotação
[amostras]                             ver §2.4

SOB ENCOMENDA · 4 SEMANAS              anotação, --muted

[ COMPRAR ]                            CTA, borda 1px --ink

CALCULAR FRETE E PRAZO                 ver §2.7
MONTAGEM                               ver §2.8
```

A **única** linha em Mincho da página inteira é o nome
([`marca.md`](marca.md) §4: uma linha de destaque por página). Nenhuma seção
abaixo recebe título em display.

O designer vem de `Familia.designer` (§10) — autoria é da peça, não do
acabamento.

### 2.3 Preço

Tudo derivado de `politicas`, nunca escrito à mão
([`produto.md`](produto.md) § Políticas comerciais):

- **À vista no Pix** no papel Preço (`1.75rem`, tabular). Este papel é reservado
  ao herói da home e a esta página — [`catalogo.md`](catalogo.md) §6 já o fixou.
- **Selo do desconto** ao lado, em `--indigo`, voz de anotação:
  `10% À VISTA NO PIX`. É a divulgação ostensiva que a Lei 13.455 exige para o
  preço diferenciado ser lícito ([pesquisa §4](../research/br-ecommerce-conventions.md)).
- **Parcelamento** logo abaixo em Corpo S `--muted`:
  `ou {total} em {N}x de {v} sem juros`.
- `precoDe`, quando presente, antes do preço à vista em Corpo S `--muted` com
  tachado de 1px. Sem cor, sem selo de percentual — igual ao card.

**Orçamento de índigo:** o selo Pix gasta um. O anel de foco gasta o segundo
quando aparece. `marca.md` §3 permite dois por tela — por isso **não há linha de
política repetida** nesta página: o buy box já diz Pix e parcelamento inteiros,
no lugar onde a decisão acontece.

### 2.4 Outros acabamentos

Fica **dentro do buy box**, logo abaixo do preço, porque cada acabamento é outro
produto com outro preço: escolher entre eles é decisão de compra, não de
navegação, e tem de estar no bloco cujo número ela muda.

- Consulta por `familia`; renderiza os irmãos, inclusive o corrente.
- Cada item é uma amostra quadrada de 28px preenchida com `Cor.amostra`, borda
  de 1px em `--hairline`, **raio zero**, com o rótulo do acabamento em anotação
  ao lado.
- O corrente é marcado com filete de 1px em `--ink` embaixo — o mesmo sinal de
  item ativo que [`navbar.md`](navbar.md) usa, e pela mesma razão: índigo já
  está gasto.
- Cada amostra é **link** para `/produtos/{slug}` do irmão. Nada de estado no
  cliente, nada de troca de imagem in-place.
- Irmão `esgotado` continua listado, com o rótulo `ESGOTADO` em `--muted`
  abaixo — some nada, exatamente como na grade.
- Família com um só acabamento: o bloco **não renderiza**.

Isto admite cor de produto na interface. O precedente é
[`catalogo.md`](catalogo.md) §3: a amostra aparece como *dado do produto*, não
como cor de marca.

### 2.5 Disponibilidade

Mesmos três estados e mesmo texto do card ([`catalogo.md`](catalogo.md) §6),
em anotação `--muted`:

| Valor | Texto |
|---|---|
| `envio-imediato` | `ENVIO IMEDIATO` |
| `sob-encomenda` | `SOB ENCOMENDA · {prazoProducaoSemanas} SEMANAS` |
| `esgotado` | `ESGOTADO` |

Sem cor de estado, sem contagem de estoque, sem "restam apenas 2".

### 2.6 CTA e estados

**Rótulo: `COMPRAR`.** Caixa alta, tracking `0.18em`, borda de 1px em `--ink`,
fundo transparente, invertendo para fundo `--ink` no hover em 120ms
([`marca.md`](marca.md) §6). É o rótulo convencional no Brasil e o mais curto —
a página não precisa explicar que comprar põe no carrinho.

**Sem seletor de quantidade.** A decisão que esta página pede é *esta peça ou
não*; quantidade é do carrinho, que já tem de editá-la de qualquer forma. Um
stepper aqui gastaria atenção num buy box que já carrega CEP e montagem.
*(Contra-argumento registrado: cadeiras de jantar se compram em quatro e seis.
Se voltar, volta como stepper à esquerda do CTA, não como campo.)*

**Ao clicar:** a página **não navega**. O CTA é substituído no lugar por uma
linha de confirmação em anotação e um link:

```
ADICIONADO AO CARRINHO        VER CARRINHO →
```

E o contador da navbar vai a `CARRINHO (n)`. Gaveta lateral está indisponível
por decisão de [`navbar.md`](navbar.md) — o carrinho é link, nunca gatilho de
drawer — e navegar para `/carrinho` encerraria a navegação justo na página onde
*outros acabamentos* convida ao movimento lateral. O contador da navbar já é o
canal de feedback; a linha só confirma.

**Estado `esgotado`:** o CTA **não renderiza**. No lugar, em anotação:

```
ESGOTADO
VER POLTRONA LINA EM BOUCLÉ CARVALHO →
```

O link só aparece se a família tiver irmão disponível. **Não há "avise-me quando
chegar"** — captura e-mail contra um backend que não existe; a promessa honesta
é o `AVISO DE NOVAS PEÇAS` do rodapé ([`rodape.md`](rodape.md)).

O bloco de CEP e o de montagem **continuam renderizando** em `esgotado`: são
informação sobre a peça, não sobre o pedido.

### 2.7 CEP, frete e prazo

Convenção brasileira, e a maior divergência em relação a PDPs americanos: o
frete se calcula **aqui**, não no checkout
([pesquisa §1](../research/br-ecommerce-conventions.md)).

**Posição: abaixo do CTA.** A tabela de opções expande em várias linhas e
empurraria `COMPRAR` para fora da tela se ficasse acima. A convenção que importa
é que a resposta exista na PDP; a ordem interna do bloco é nossa.

Estado inicial — campo único, máscara `00000-000`, `inputmode="numeric"`,
borda de 1px em `--hairline`, raio zero:

```
CALCULAR FRETE E PRAZO
[ 00000-000 ]  [ CALCULAR ]     NÃO SEI MEU CEP
```

`NÃO SEI MEU CEP` abre a busca dos Correios em nova aba.

Resultado — tabela de **opções**, nunca um número só:

```
ENTREGA PADRÃO      até 12 dias úteis        R$ 289,00
ENTREGA AGENDADA    data à sua escolha       R$ 389,00
```

- Filete de 1px entre linhas, numerais tabulares, valores alinhados à direita.
- **`Grátis`**, a palavra, quando `freteGratis` cobre a região — nunca
  `R$ 0,00`.
- Uma linha de nota abaixo, em anotação `--muted`:
  `PRAZO EM DIAS ÚTEIS, CONTADO APÓS A CONFIRMAÇÃO DO PAGAMENTO.`
- Em `sob-encomenda`, uma segunda linha soma o que a peça realmente demora:
  `PRODUÇÃO DE {n} SEMANAS ANTES DO ENVIO.`

**Erro** — CEP inválido ou região não atendida: uma linha abaixo do campo, em
`--ink`, voz de anotação, sem cor e sem ícone. `marca.md` §3 já decidiu que erro
se resolve em tinta e peso tipográfico, não em semáforo.

**O CEP é lembrado.** Digitado uma vez, vale para a sessão inteira: o carrinho e
o checkout leem o mesmo valor já preenchido. Perguntar três vezes o mesmo CEP é
o defeito que esta convenção existe para evitar. Restrição entregue a
[Carrinho](../../.wayfinder/tickets/010-cart.md) e
[Checkout](../../.wayfinder/tickets/011-checkout.md) — §11.

### 2.8 Montagem

Renderiza **apenas quando `montagem.necessaria === true`**.

```
MONTAGEM
[ ] Contratar montagem                              + R$ 99,00
SIMPLES · 1 PESSOA · 5 PEÇAS · 20 MIN
NO MESMO DIA DA ENTREGA AGENDADA.
```

- Preço derivado de `politicas.montagemCentavos[montagem.nivel]`.
- Os quatro fatos ficam **aqui e só aqui** — não se repetem na ficha técnica.
  Eles existem para justificar o preço, e é por isso que
  [`produto.md`](produto.md) derivou o preço do `nivel`: a complexidade fica
  provadamente consistente com o número logo acima.
- Checkbox de 1px, raio zero, sem cor de preenchimento — marcado é um quadrado
  `--ink` sólido.
- A promessa modelada é a da Tok&Stok: montagem **no dia da entrega agendada**,
  não em agendamento separado ([pesquisa §7.2](../research/br-ecommerce-conventions.md)).

**Consequência:** marcada, a montagem vira item de linha no carrinho com preço
próprio, e o prazo de arrependimento de 7 dias passa a contar **da data da
montagem** ([`rodape.md`](rodape.md), pesquisa §6.2).

---

## 3. Descrição

Rótulo `DESCRIÇÃO` em anotação; corpo em Corpo, medida de 60–70 caracteres, 5 a
7 colunas, **nunca centralizado**.

**Sem abertura em Mincho.** `marca.md` §4 concede uma linha de destaque por
página e o nome da peça já a gastou no buy box. Um segundo display aqui faria a
página ter dois heróis.

`descricao` continua **uma string só**. Nenhum campo novo: nem resumo, nem
subtítulo, nem lead. [`produto.md`](produto.md) já registrou que não existe campo
de descrição curta, e a meta description é problema do
[ticket de metadata](../../.wayfinder/tickets/015-route-metadata.md).

---

## 4. Medidas

**A seção que decide a compra.** Móvel se compra pela medida que tem de caber na
parede; tudo aqui é número.

### 4.1 O desenho de escala

Uma **elevação técnica cotada** da peça: filete de 1px em `--ink`, tiques
perpendiculares, rótulos na voz de anotação, fundo `--plaster`. É a régua em sua
expressão plena — a mesma linguagem visual do gesto da marca, aplicada onde a
informação é o assunto inteiro.

Foi escolhida contra quatro alternativas:

- **Só a cota na foto** não responde profundidade nem altura do assento.
- **Comparação com objeto conhecido** exige pessoa ou porta no enquadramento, e
  `marca.md` §7 fixa peça sozinha, sem pessoa, sem exceção fora de Inspirações.
- **Comparação de escala compartilhada entre peças** já foi descartada por
  [`catalogo.md`](catalogo.md) §4 — obriga o sistema de imagem a uma referência
  comum entre produtos.
- **Widget "cabe no meu espaço"** é um controle que calcula o que o leitor já
  tem na tela.

O desenho mora em `Familia.desenho`, não no produto (§10).

### 4.2 A tabela

```
L 78 × P 82 × A 74 cm
```

Sempre nesta ordem, sempre com `×` de multiplicação — nunca a letra `x`
([`marca.md`](marca.md) §8). Voz de anotação, numerais tabulares.

Abaixo, `medidasExtras` como linhas de filete:

```
ALTURA DO ASSENTO        42 cm
CAPACIDADE DE PESO      120 kg
```

### 4.3 Embalagem

Bloco recuado em `--kozo`, porque é outro conjunto de números com outra função —
é o que tem de passar pela porta e pelo elevador:

```
EMBALAGEM
1 volume · L 86 × P 90 × A 80 cm · 24 kg
```

---

## 5. Ficha técnica

Tudo que é qualitativo. A divisão entre §4 e §5 é por **espécie de fato**, não
por rótulo: número vai para Medidas, atributo vai para a Ficha.

| Linha | Fonte |
|---|---|
| Materiais | `materiais[]` → `Material.label` |
| Cor | `cor` → `Cor.label` |
| Acabamento | `acabamento` |
| Cuidados | **derivado** de `materiais[]` → `Material.cuidados` (§10) |
| Garantia | `garantiaMeses ?? politicas.garantiaPadraoMeses` |
| Itens inclusos | `itensInclusos[]` |

Linhas em filete de 1px `--hairline`, rótulo em anotação `--muted` à esquerda,
valor em Corpo à direita.

**Cuidados é derivado, nunca autorado por produto.** Cuidado é propriedade do
linho e do carvalho, não desta poltrona; autorar por peça é exatamente a deriva
que a regra de derivação de [`produto.md`](produto.md) existe para impedir. Uma
peça com dois materiais rende duas linhas de cuidado automaticamente, e nenhum
produto novo pode nascer sem cópia de cuidado.

`itensInclusos` sai da Descrição e vem para cá — é ficha, não prosa.

---

## 6. Entrega e acesso

**Prosa, não tabela.** O aviso de acesso é uma advertência, e uma linha de
tabela a enterraria; a pesquisa (§7.3) trata isso como a divulgação específica de
móvel para a qual um design genérico não tem lugar.

Quatro parágrafos curtos, texto derivado de política e dos dados da peça — nada
autorado por produto:

1. **Prazo e agendamento.** O prazo depende do CEP e é contado em dias úteis
   após a confirmação do pagamento; a entrega de peças volumosas é agendada por
   data e janela.
2. **Acesso.** Confira as medidas da embalagem (§4.3) contra portas, corredor e
   elevador. Não passando pelo elevador, a entrega sobe por escada até o 3º
   andar; acima disso não é realizada.
3. **Montagem.** Contratada, acontece no mesmo dia da entrega agendada.
4. **Arrependimento.** Sete dias corridos a partir do recebimento — ou **da data
   da montagem**, quando contratada. Prosa autônoma, mesmo tratamento que
   [`rodape.md`](rodape.md) §6 deu ao aviso do rodapé.

Fundo `--plaster`, corpo normal, sem caixa, sem ícone de alerta.

---

## 7. Fecho

**Se `colecoes` não estiver vazio** — uma tira das outras peças da coleção, na
ordem autorada por `Colecao.produtos`, usando o card de
[`catalogo.md`](catalogo.md) §6, com o título da coleção em anotação.

**Senão** — uma linha só, em anotação, alinhada à esquerda:

```
VER TODAS AS POLTRONAS EM SALA →
```

Apontando para `/{ambientePrincipal}/{tipo}`.

**Não há "quem viu também viu", não há "complete o ambiente".** Uma loja
conceito não tem base honesta para recomendar — a mesma razão que
[`catalogo.md`](catalogo.md) §8 deu ao recusar sugestões fabricadas no resultado
zero. Um campo `complementos[]` autorado por produto foi descartado: inventa uma
relação curatorial para cada peça do catálogo. Um **link de volta para uma
listagem real** não é sugestão, é navegação.

---

## 8. Orçamento de régua

**Exatamente duas instâncias na página inteira**, e são estas:

1. A cota sobre a imagem `principal`, lendo `imagens[0].cotas` — até largura
   **e** altura, que `marca.md` §2 conta como *uma* instância ("duas cotas por
   peça é o teto").
2. O desenho de escala (§4.1), sozinho em sua viewport.

`ambientada` e `detalhe` renderizam com `cotas: []` **sempre**, nesta página.
Nenhuma abertura de seção recebe régua: não há número a declarar que já não
esteja dito melhor em §4.

Esta é a página em que o gesto atinge expressão plena sem estourar a ração — a
mesma disciplina de duas por página que [`home.md`](home.md) impôs, gasta em
lugar diferente.

---

## 9. Mobile

Coluna única, na ordem:

```
principal → nome/designer → preço/parcelamento → acabamentos →
disponibilidade → COMPRAR → CEP → montagem → descrição →
ambientada → medidas → ficha técnica → entrega → fecho
```

**Sem barra fixa inferior** com preço e CTA, apesar de ser quase universal em
PDP brasileira no celular. É a mesma cromagem persistente recusada em §0, e no
celular ela cobriria justamente o desenho de escala e a tabela de medidas — as
duas coisas para as quais esta página existe. Com o bloco de CEP em fluxo, o
desenho nunca fica ocluído.

O desenho de escala ocupa a largura do container e mantém a legibilidade da
anotação; **não** ganha scroller horizontal.

As amostras de acabamento quebram em duas linhas antes de virarem trilho
rolável.

---

## 10. Dados

Quatro alterações em [`produto.md`](produto.md). Três aditivas, uma reversão
declarada.

```ts
type Familia = {
  slug: string;
  nome: string;
  designer: string;                      // NOVO — autoria é da peça
  desenho: { src: string; alt: string }; // NOVO — elevação técnica cotada
};

type Material = {
  slug: string;
  label: string;
  cuidados: string;                      // NOVO — uma linha por material
};

type Imagem = {
  src: string;
  alt: string;
  papel: 'principal' | 'ambientada' | 'detalhe';  // 'escala' REMOVIDO
  cotas: ('largura' | 'altura')[];
};
```

**Por que na `Familia` e não no `Produto`:** nem autoria nem geometria mudam com
o tecido. A elevação técnica da Poltrona Lina é o mesmo desenho em linho cru e
em bouclé carvalho, e o designer é o mesmo. Isso também dá à `Familia` —
deliberadamente magra — duas razões de existir além de nomear uma tira, e reduz
pela metade os desenhos que o [sistema de
imagem](../../.wayfinder/tickets/014-imagery.md) deve.

**Invariante que isso cria:** produtos da mesma família **compartilham
`medidas`**. Um desenho para dois acabamentos de medidas diferentes mentiria
sobre um deles. Isto é verdade do móvel real — acabamento não muda geometria — e
fica registrado como restrição do modelo, não como coincidência dos dados.

**`'escala'` sai do enum** porque nenhuma superfície o consome mais: a listagem
já lia só `principal` ([`catalogo.md`](catalogo.md) §13) e a PDP passou a ler o
desenho da família. É a única reversão deste ticket; o papel foi definido antes
de existir uma página que o gastasse.

`Produto` não ganha campo nenhum.

---

## 11. Restrições entregues a outros tickets

- **[Carrinho](../../.wayfinder/tickets/010-cart.md)** — o item de linha carrega
  um sinalizador de montagem e o preço derivado dela (§2.8); a quantidade é
  **do carrinho**, porque a PDP não tem stepper (§2.6); o CEP digitado aqui já
  chega preenchido (§2.7); e o prazo de arrependimento conta da montagem quando
  ela foi contratada.
- **[Checkout](../../.wayfinder/tickets/011-checkout.md)** — mesmo CEP lembrado,
  já preenchido no primeiro campo de endereço.
- **[Sistema de imagem](../../.wayfinder/tickets/014-imagery.md)** — três papéis
  fotográficos, não quatro (§10), cada um com posição fixa na página (§2.1); e
  um artefato novo que **não é fotografia**: a elevação técnica cotada por
  família (§4.1), que precisa de especificação própria — traço, cotas mínimas,
  vistas, proporção.
- **[Metadata e SEO](../../.wayfinder/tickets/015-route-metadata.md)** — o `<h1>`
  é o nome da peça no buy box. Continua sem campo de descrição curta; a meta
  description sai truncada de `descricao` ou é autorada lá.
- **[Superfícies de erro](../../.wayfinder/tickets/016-error-surfaces.md)** —
  slug inexistente é 404 e é daquele ticket. O erro de CEP inválido está
  resolvido aqui (§2.7) e segue o padrão sem cor.
- **[Movimento](../../.wayfinder/tickets/017-motion.md)** — a PDP não tem
  carrossel, troca de imagem, zoom, painel fixo nem revelação em scroll. A
  substituição do CTA pela linha de confirmação (§2.6) é troca de conteúdo, não
  animação; se ganhar transição, é daquele ticket.
- **Dados de exemplo** (névoa do mapa) — a PDP endurece a demanda: toda família
  precisa de `designer` e de um desenho técnico; todo material precisa de linha
  de cuidado; e pelo menos uma família precisa de dois acabamentos, ou a tira de
  §2.4 nunca renderiza.

---

## 12. Omissões deliberadas

Consideradas e recusadas — registradas para não voltarem sem motivo novo:

- **Avaliações e estrelas** — já fora do modelo por
  [`produto.md`](produto.md): sem conta, ninguém escreve, e qualquer número é
  prova social inventada.
- **Buy box fixo / barra fixa no celular** (§0, §9).
- **Seletor de quantidade** (§2.6).
- **Gaveta de carrinho** — indisponível por [`navbar.md`](navbar.md).
- **Miniaturas com troca ao clique, zoom, lightbox** (§2.1).
- **"Avise-me quando chegar"** (§2.6).
- **"Quem viu também viu" e `complementos[]`** (§7).
- **Widget "cabe no meu espaço"** (§4.1).
- **Comparação de escala entre peças** — já descartada em
  [`catalogo.md`](catalogo.md) §4.
- **Linha de política Pix/parcelamento repetida** — o buy box já a diz inteira
  (§2.3).

---

## Como isso foi decidido

Três rodadas de grilling sobre o ticket 009. A primeira fixou a estrutura: duas
colunas sem sticky, o desenho técnico como mecanismo de escala, o inventário do
buy box, e as três decisões de modelo que a página exigiu (designer na família,
acabamentos dentro do buy box, fecho sem recomendação). A segunda resolveu os
internos: papéis de imagem como posição, orçamento de régua, cuidados derivados
do material, estados do CTA, comportamento do CEP e a montagem com um só
endereço. A terceira fechou mobile, moveu o desenho para a família — deletando
`'escala'` do enum — corrigiu um Mincho a mais que o rascunho da espinha tinha
inventado, e separou Medidas de Ficha técnica por espécie de fato.
