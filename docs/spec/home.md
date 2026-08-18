# Home — seções da página inicial

Resolve o ticket [Home page sections](../../.wayfinder/tickets/007-home.md).
Rota `/` ([`rotas.md`](rotas.md)). Sete seções, nesta ordem, entre a navbar
([`navbar.md`](navbar.md)) e o rodapé ([`rodape.md`](rodape.md)).

O trabalho desta página é um só: **fazer a navegação por ambiente parecer
inevitável, não imposta.** Tudo aqui se justifica contra isso.

---

## 0. Ordem e ritmo

| # | Seção | Fundo | Par de grade |
|---|---|---|---|
| 1 | Herói — a peça | `--plaster` | imagem 7 / bloco 5 |
| 2 | Ambientes | `--plaster` | 7 + 5 empilhado |
| 3 | Peças em destaque | `--plaster` | 3 × 3 col, 10–12 vazias |
| 4 | Coleção em destaque | `--plaster` | imagem 7 / texto 5 |
| 5 | Serviço | `--kozo` | banda, 4 × 3 col |
| 6 | Inspirações | `--plaster` | 3 linhas com filete |
| 7 | A marcenaria | `--plaster` | linha destaque + imagem 7 / texto 5 |

Container `1360px`, goteira `clamp(1.5rem, 4vw, 4.5rem)`, grade de 12 colunas,
`7rem` entre seções — tudo de [`marca.md`](marca.md) §5. Nenhuma seção usa menos
que `7rem` de respiro nesta página; ela é a única que estabelece o ritmo para as
outras 14 rotas.

**A banda de Serviço (§5) está no meio de propósito.** As seções 4, 6 e 7 são
todas imagem-mais-texto; correndo em sequência, a metade de baixo da página
rimaria consigo mesma três vezes seguidas a cada `7rem`. Sem dark mode e com um
único acento, a troca de fundo para `--kozo` é o único deslocamento tonal
disponível, e ele ganha o lugar quebrando essa sequência — além de entregar os
fatos de entrega **depois** que o visitante já viu um preço em §3, que é quando
"como isso chega até mim" de fato vira a pergunta.

---

## 1. Herói — a peça

**Propósito.** Abrir com reverência a um objeto. Estabelece de uma vez a régua, a
regra de fotografia e o fato de que esta loja **mostra preço** — as três coisas
que toda outra página vai assumir como já ditas.

Não abre com os quatro ambientes: isso abriria com uma taxonomia, que é
exatamente o registro de parede-de-categorias que a marca recusa, e gastaria
quatro fotografias antes de conquistar qualquer atenção.

**Forma.** Imagem nas colunas 1–7, bloco de texto nas 8–12 com medida máxima de
`34ch`. A imagem usa a proporção real da peça e é limitada a `max-height: 78vh`,
para que o filete superior de §2 fique visível acima da dobra — os ambientes
aparecem como o próximo passo natural, não como uma demanda de abertura.

**Régua.** Uma cota, `largura`, horizontal, junto à borda inferior da imagem.
A cota vertical fica **suprimida** aqui: ela moraria fora da imagem à direita,
onde começa a coluna de texto. Ver o orçamento de régua em §9.

**Conteúdo, de cima para baixo.**

| Elemento | Papel tipográfico | Fonte do dado |
|---|---|---|
| Sobrancelha | Anotação, `--muted` | fixo: `PEÇA EM DESTAQUE` |
| Nome | Display XL (Mincho) | `produto.nome` |
| Acabamento + designer | Anotação, `--muted` | `produto.acabamento`, `produto.designer` |
| Preço à vista | Preço, tabular | derivado de `precoTabela` |
| Selo Pix | Anotação, `--indigo` | derivado de `politicas` |
| Parcelamento | Corpo S, `--muted` | derivado de `politicas` |
| CTA | CTA | `VER A PEÇA` |

**Direção de copy.** Nenhum slogan. A única prosa é o nome da peça; a
sobrancelha e os dados comerciais falam na voz de anotação. Nada de "bem-vindo",
"descubra" ou promessa de categoria.

**Destino do clique: a PDP da peça** (`/produtos/[slug]`), tanto na imagem quanto
no CTA. Mandar o clique para a listagem do ambiente contradiria o argumento
inteiro da seção; ambientes são o trabalho de §2, 400px abaixo.

**Dados.** `ConteudoHome.destaqueHome` (§8) — um slug de Produto, **autorado**.
A peça específica não é fixada aqui: isso inventaria dado de catálogo que ainda
está na névoa do mapa. O que o spec fixa são as restrições do slot:

- deve resolver para um Produto com imagem `papel: 'principal'`;
- essa imagem deve declarar `cotas: ['largura']` — **senão o herói não renderiza**,
  porque régua vazia é proibida ([`marca.md`](marca.md) §2) e o tipo torna a
  proibição verificável;
- `disponibilidade` não pode ser `esgotado`.

---

## 2. Ambientes

**Propósito.** A espinha da loja, oferecida como escolha e não como menu. É a
seção que precisa fazer o resto da navegação parecer óbvia.

**Forma: quatro campos fotográficos, deliberadamente desiguais.** Quatro tiles
iguais é o padrão da categoria e lê como uma grade de botões. Aqui: um ambiente
em destaque nas colunas 1–7, em altura cheia; os outros três empilhados nas
colunas 8–12, cada um em faixa mais baixa, separados por filete de 1px em
`--hairline`. A composição, não o alfabeto, decide qual ocupa as 7 colunas — é
autorado, pela ordem de `ambientes[]`.

Fotografia de ambiente é o único lugar onde esta loja mostra escala e contexto;
uma versão puramente tipográfica desta seção deixaria a página inteira como
peças-sobre-reboco.

**Por campo.**

| Elemento | Papel | Fonte |
|---|---|---|
| Fotografia | — | `ambiente.imagem` (§8) |
| Rótulo | Anotação, `--ink` | `ambiente.label` |
| Três tipos | Anotação, `--muted`, separados por `·` | primeiros 3 de `ambiente.tipos` |

Os três tipos espelham o painel da navbar e reforçam que tipo é um caminho
landável, não um filtro. Eles **não** são links independentes: o campo inteiro é
um único link para `/[ambiente]`.

**Sobrancelha da seção:** `AMBIENTES`, voz de anotação. Sem título em Mincho —
Mincho está racionado (§11).

**Sem régua.** Sem ícones. Sem numeração ordinal.

---

## 3. Peças em destaque

**Propósito.** Provar que os preços existem e que são honestos. A direção de
marca fechou a reconciliação como "preço discreto, nunca preço ausente"; uma home
que mostrasse peças sem preço seria exatamente a evasão "sob consulta" que
[`marca.md`](marca.md) §1 recusou por escrito.

**Forma: três peças, não seis.** Seis é uma grade e puxa a página para a
densidade de catálogo que §5 da marca raciona. Cards nas colunas 1–3, 4–6 e 7–9,
com as **colunas 10–12 deixadas vazias** — a goteira grande à direita preservada,
como em todo par padrão.

**Por card.**

| Elemento | Papel | Observação |
|---|---|---|
| Imagem `principal` | proporção real | sem régua |
| Nome | Display M (Mincho) | `produto.nome` |
| Acabamento | Anotação, `--muted` | |
| Disponibilidade | Anotação, `--muted` | rótulo textual, sem cor |
| Preço à vista | **Corpo**, tabular | ver abaixo |
| Parcelamento | Corpo S, `--muted` | `ou {total} em {N}x de {v} sem juros` |

**Duas rações são gastas aqui e precisam ser ditas explicitamente.**

1. **O papel tipográfico Preço (`1.75rem`) fica reservado ao herói e à PDP.**
   Na largura de um card de 3 colunas ele domina a composição e transforma a
   tira em vitrine de oferta. O card usa Corpo com numeral tabular.
2. **O selo Pix não renderiza por card.** Três cards com selo seriam três
   ocorrências de índigo na mesma tela, e [`marca.md`](marca.md) §3 é explícita:
   se o índigo aparece três vezes numa tela, duas estão erradas. Em vez disso, a
   política aparece **uma vez**, como uma linha em anotação `--indigo` alinhada à
   direita do filete que fecha a tira: `10% À VISTA NO PIX EM TODAS AS PEÇAS`.
   O número vem de `politicas.descontoPixPercent`, nunca escrito à mão.

**Sobrancelha:** `PEÇAS EM DESTAQUE`.

**Dados: `ConteudoHome.destaques` — três slugs autorados.** Não são os três
primeiros da coleção de §4, o que faria duas seções mostrarem as mesmas peças a
`7rem` de distância. E não são derivados: numa loja-conceito não existe "novo"
honesto, não existe dado de venda, e [`produto.md`](produto.md) já recusou
estoque numérico justamente para não fabricar sinal. Autorado é também como
funciona todo o resto desta página.

---

## 4. Coleção em destaque

**Propósito.** [`rotas.md`](rotas.md) decidiu que Coleções não têm página índice e
são surfaced "in context on the home page and inside Inspirações". Esta seção é
essa obrigação. Uma Coleção é um dispositivo de merchandising cuja **ordem é o
ato editorial** — o que exige enquadramento editorial, não um trilho de cards.

**Forma.** Par padrão: imagem nas colunas 1–7, texto nas 8–12, medida `34ch`.

**Régua — a segunda e última da página.** Régua de abertura de seção
([`marca.md`](marca.md) §2, caso "número real a declarar"), rótulo `{n} PEÇAS`,
com `n = colecao.produtos.length`. Derivada, nunca autorada: nenhum campo novo, e
a figura não pode divergir da coleção.

| Elemento | Papel | Fonte |
|---|---|---|
| Sobrancelha | Anotação | `COLEÇÃO` |
| Nome | Display L (Mincho) | `colecao.nome` |
| Descrição | Corpo | `colecao.descricao` |
| CTA | CTA | `VER A COLEÇÃO` → `/colecoes/[slug]` |

**Sem preços neste bloco.** O bloco vende a sequência curada, não uma peça; um
preço aqui obrigaria a escolher *qual* peça, o que é precisamente a decisão que a
coleção adia para a listagem.

**Dados.** `ConteudoHome.colecaoDestaque` → `Colecao` ([`produto.md`](produto.md),
*Entidades relacionadas*).

---

## 5. Serviço

**Propósito.** Comércio brasileiro põe aqui uma faixa de selos ou depoimentos, e
esta loja não tem nenhum honestamente disponível — [`produto.md`](produto.md)
recusou avaliações por falta de fonte, e [`rodape.md`](rodape.md) manteve selos de
terceiros fora por serem credenciais de um CNPJ real. O que **é** verdadeiro e
decisivo é serviço: quem compra um sofá de milhares de reais decide sobre entrega
e montagem antes de decidir sobre gosto.

**Forma.** Banda de largura total em `--kozo`, container interno, quatro campos
nas colunas 1–3, 4–6, 7–9 e 10–12, divididos por filete vertical de 1px em
`--hairline`. **Esta é a única seção da página que preenche até a coluna 12** — é
um trilho, não uma composição, e a simetria é o que o faz ler como faixa de
informação em vez de bloco editorial.

Padding vertical `4rem`. Sem ícones (a exceção de ícones do rodapé não se estende
até aqui). Sem régua. Sem índigo, exceto foco e hover de link.

| Rótulo (anotação) | Linha (Corpo S) | Destino |
|---|---|---|
| `FRETE` | Calculado por CEP na página da peça. | `/politicas/entrega-e-frete` |
| `MONTAGEM` | Opcional, feita no dia da entrega. | `/politicas/entrega-e-frete` |
| `PRAZO` | Em dias úteis, contado após a confirmação do pagamento. | — |
| `ARREPENDIMENTO` | 7 dias para desistir, contados do recebimento — ou da montagem, quando contratada. | `/politicas/trocas-e-devolucoes` |

Três dos quatro campos linkam e um não. Isso é levemente desalinhado e continua
sendo a opção certa: inventar uma página para *prazo* seria pior. Frete e
montagem apontam para a mesma política porque [`rotas.md`](rotas.md) decidiu que
*Entrega e frete* absorve o detalhe de montagem em vez de gerar página própria.

O texto de arrependimento aqui é a versão curta; a prosa ostensiva completa vive
no bloco legal do rodapé e em `/politicas/trocas-e-devolucoes`.

> Copy estatutária a ser conferida contra planalto.gov.br antes da implementação
> — ver *Not yet specified* no mapa.

---

## 6. Inspirações

**Propósito.** Inspirações é um de apenas cinco itens da navbar; deixá-la
inteiramente fora da home deixaria a promessa da seção sem sustentação no topo do
funil.

**Forma: três linhas, não três cards.** Uma tira de cards repetiria o ritmo de §3
a `7rem` de distância; dois artigos grandes competiriam com §4 e a página teria
dois pares imagem-7/texto-5 seguidos. Três **linhas** horizontais separadas por
filete são um terceiro ritmo e mantêm §4 como o único destaque editorial da
página.

Por linha: miniatura 16:9 nas colunas 1–2, título nas 3–7, resumo nas 8–10,
colunas 11–12 vazias. A linha inteira é um link para `/inspiracoes/[slug]`.

| Elemento | Papel |
|---|---|
| Ambiente | Anotação, `--muted` |
| Título | Display M (Mincho) |
| Resumo | Corpo S, `--muted`, uma linha |

**Sobrancelha:** `INSPIRAÇÕES`. **Fecho:** uma linha em CTA, `VER TODAS AS
INSPIRAÇÕES` → `/inspiracoes`.

**Dados.** `ConteudoHome.inspiracoes` — três slugs de artigo. A entidade de
artigo ainda não existe; ver a restrição entregue a
[Inspirações](../../.wayfinder/tickets/012-inspiracoes.md) em §12.

---

## 7. A marcenaria

**Propósito.** [`navbar.md`](navbar.md) §5 tirou *Sobre* e *Contato* da barra e
mandou ambos para "rodapé e home". Mas o motivo real de o bloco existir é outro:
a afirmação de ateliê — marcenaria própria, produção sob encomenda, designer
nomeado — é o que **justifica os preços mostrados em §3**. Afirmá-la apenas como
link de rodapé tornaria a posição inteira decorativa.

É também o fecho da página: termina numa asserção, não numa tira de cards.

**Forma.** Duas partes:

1. **A linha de destaque em Mincho**, atravessando as colunas 1–9, `Display L`.
   Esta é a **única "linha de destaque por página"** que [`marca.md`](marca.md) §4
   concede, e ela é gasta aqui — ver §11.
2. Abaixo, o par padrão: imagem 7 / texto 5.

**Direção de copy.** A linha afirma o *fazer*, não vende. Direção, não copy final:

> Cada peça sai de uma marcenaria, não de um catálogo.

Abaixo dela, no máximo três frases em Corpo — quem faz, onde, e o que "sob
encomenda" significa em prática. CTA: `SOBRE O ATELIÊ` → `/sobre`.

**Fotografia: uma peça inacabada, sozinha.** Sem pessoa, sem mãos, sem bancada
encenada. Isso mantém a regra de [`marca.md`](marca.md) §7 intacta — luz rasante,
fundo de reboco, peça sozinha — e **não abre uma segunda exceção** ao "peça
sozinha" além de Inspirações. Madeira crua ou junta à vista conta a história de
marcenaria sem precisar de exceção.

**Sem Contato aqui.** Contato é um formulário e um telefone; seria o quarto bloco
de texto abaixo da dobra e não tem história para contar. A nota da navbar já está
satisfeita pela coluna *Atendimento* que [`rodape.md`](rodape.md) promoveu a
coluna própria justamente para dar casa ao contato.

**O scroll termina aqui.** Sem CTA de fecho, sem repetição dos ambientes, sem
"ver todas as peças". Repetir os ambientes no fim da página é o conserto padrão
de uma página que falhou em rotear antes; se §2 funciona, é uma admissão de
fracasso. E `/produtos` já foi recusado como slot permanente pela navbar
exatamente para não enfraquecer os ambientes.

---

## 8. Dados

```ts
type ConteudoHome = {
  destaqueHome: string;        // -> Produto.slug   (§1)
  destaques: string[];         // 3 -> Produto.slug (§3)
  colecaoDestaque: string;     // -> Colecao.slug   (§4)
  inspiracoes: string[];       // 3 -> Artigo.slug  (§6)
  marcenaria: {                //                    (§7)
    linha: string;
    texto: string;
    imagem: { src: string; alt: string };
  };
};
```

Tudo autorado. A home não deriva nenhuma seleção.

**Adição à entidade `Ambiente`** ([`produto.md`](produto.md), *Entidades
relacionadas*) — §2 precisa de uma fotografia por ambiente e o modelo não tem
nenhuma:

```ts
type Ambiente = {
  slug: string;
  label: string;
  tipos: string[];
  imagem: { src: string; alt: string };   // NOVO — foto do ambiente
};
```

Deliberadamente **não** é um `Imagem`: aquele tipo carrega `papel` e `cotas`, e
régua em foto de ambiente já está proibida por §9, então os campos existiriam
apenas para ficarem sempre vazios. Também **não** é um shot `ambientada`
emprestado de algum produto — [`produto.md`](produto.md) foi explícito que "a
product with no ambientada shot must not silently promote" nada para um slot, e o
risco é o mesmo um nível acima. Adição, não reversão; ver §12.

---

## 9. Orçamento de régua

`marca.md` limita a duas por *tela*, não por página — uma página deste tamanho
poderia legalmente carregar mais. A home é mais dura que a regra:

**Exatamente duas em toda a página.**

| Onde | Cota |
|---|---|
| §1 Herói | `largura`, em cm, lida de `medidas` |
| §4 Coleção | abertura de seção, `{n} PEÇAS` |

**Proibida em:** campos de ambiente (§2), cards de destaque (§3), banda de
serviço (§5), linhas de Inspirações (§6), bloco da marcenaria (§7).

A home é a única página que ensina o que o gesto significa. Um visitante que o
encontra seis vezes antes de chegar a uma página de produto aprendeu que ele é
enfeite — e enfeite é exatamente o que a régua foi escolhida para não ser.

## 10. Orçamento de índigo

Índigo aparece na home em: o selo Pix do herói (§1), a linha única de política Pix
da tira (§3), e estados de foco/hover. **Nunca dois selos na mesma tela.** Nenhum
uso decorativo.

## 11. Orçamento de Mincho

| Uso | Onde | Categoria de `marca.md` §4 |
|---|---|---|
| Nome da peça | §1, §3 | nome de peça |
| Nome da coleção | §4 | título de coleção |
| Títulos de artigo | §6 | título editorial |
| Linha da marcenaria | §7 | **a única linha de destaque da página** |

Sobrancelhas de seção são **anotação, não Mincho**. Títulos de seção em Mincho
gastariam a família cinco vezes e a linha de §7 deixaria de ser destaque.

---

## 12. Restrições entregues a outros tickets

- **[Product data shape](../../.wayfinder/tickets/003-product-data-shape.md)** —
  `Ambiente` ganha `imagem: { src, alt }` (§8). Adição aditiva a uma decisão
  fechada, não uma reversão; `produto.md` traz uma nota apontando para cá.
- **[Imagery system](../../.wayfinder/tickets/014-imagery.md)** — a home pede
  quatro fotografias de ambiente (§2), uma miniatura 16:9 por artigo (§6) e uma
  foto de peça inacabada (§7). A de §7 **não** é exceção ao "peça sozinha" e o
  sistema de imagem deve tratá-la sob a regra normal.
- **[Inspirações](../../.wayfinder/tickets/012-inspiracoes.md)** — §6 precisa que
  um artigo exponha `slug`, `titulo`, `resumo` (uma linha), uma miniatura 16:9 e
  um `ambiente` opcional. A forma da entidade é daquele ticket; estes são os
  campos que a home consome.
- **[Institutional pages](../../.wayfinder/tickets/013-institucional.md)** —
  `/sobre` recebe o clique de §7 e precisa continuar a afirmação de marcenaria,
  não repeti-la. `/contato` não tem entrada pela home.
- **[Motion](../../.wayfinder/tickets/017-motion.md)** — a home **não** tem
  revelação em scroll, paralaxe ou animação de entrada de seção. A única transição
  é a de cor em 120ms nos estados interativos ([`marca.md`](marca.md) §9).
- **Catalogue seed data** (névoa do mapa) — a home consome 1 + 3 slugs de produto,
  1 coleção com `produtos[]` não-vazio, 3 artigos e 4 fotos de ambiente. O slot do
  herói exige um produto com `cotas: ['largura']` na imagem principal.

---

## 13. Mobile

Uma coluna, na mesma ordem. Sem acordeão, sem carrossel.

- §1 — imagem acima do bloco; a cota `largura` permanece.
- §2 — quatro campos empilhados em altura igual; a assimetria é um recurso de
  desktop e não sobrevive a uma coluna.
- §3 — três cards empilhados; a linha de política Pix vai abaixo do último.
- §4, §7 — imagem acima do texto.
- §5 — quatro campos empilhados, divididos por filete **horizontal**.
- §6 — miniatura acima de título e resumo.

Respiro entre seções cai para `4rem` — o piso de [`marca.md`](marca.md) §5, nunca
abaixo.

---

## Omissões deliberadas

Consideradas e descartadas — registradas para não serem relitigadas:

- **Newsletter.** O rodapé já é dono dela (`AVISO DE NOVAS PEÇAS`,
  [`rodape.md`](rodape.md) §5). Duplicar seria a mesma captura duas vezes em uma
  tela de rolagem.
- **Depoimentos, avaliações, selos de terceiros.** Sem fonte honesta —
  [`produto.md`](produto.md) e [`rodape.md`](rodape.md) já fecharam isso.
- **Seção de Contato.** Ver §7.
- **Novidades / mais vendidos.** Sem inventário real, ambos são sinal fabricado.
  [`rotas.md`](rotas.md) já recusou `/novidades` e `/promocoes` como destinos.
- **CTA de fecho e repetição dos ambientes no fim.** Ver §7.
- **Numeração ordinal (01 / 02 / 03)** em qualquer seção — fora do sistema por
  [`marca.md`](marca.md) §2.
- **Carrossel ou banner rotativo no herói.** Uma peça, parada.
- **Busca.** Fora de escopo em todo o mapa.
- **Contagem regressiva, faixa de frete grátis, banner de cupom.** O acordo de
  "voz, não presença" mantém os fatos comerciais inteiros e sem grito.

## Como isso foi decidido

Duas rodadas de grilling sobre o ticket
[Home page sections](../../.wayfinder/tickets/007-home.md). A primeira fixou
*quais seções existem e em que forma* — herói de peça única contra herói de
ambientes, se a home vende ou apenas roteia, coleção separada da tira de
destaques, e o que substitui prova social numa loja sem avaliações. A segunda
fixou ordem, os três orçamentos (régua, índigo, Mincho), a autoria do herói e a
fotografia de ambiente que faltava no modelo de dados.

A decisão mais consequente é o **orçamento de régua**: duas na página inteira. É
mais restritivo que a regra da marca, e é o que impede que a home ensine o gesto
errado às outras 14 rotas.
