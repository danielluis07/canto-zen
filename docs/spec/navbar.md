# Navbar — barra de navegação

Resolve o ticket [Navbar](../../.wayfinder/tickets/005-navbar.md).
Vale para todas as 15 rotas de [`rotas.md`](rotas.md). Vocabulário visual em
[`marca.md`](marca.md); toda medida, cor e voz tipográfica citada aqui vem de lá e
não é redefinida.

---

## 1. Propósito

A barra tem **um** trabalho: manter os quatro ambientes a um gesto de distância em
qualquer ponto da loja. Ela não vende, não anuncia e não busca. É o espinha dorsal
room-primary de [`rotas.md`](rotas.md) tornado permanente.

Corolário: tudo que não serve a esse trabalho foi recusado — busca, ícones,
minicarrinho, contador de favoritos, seletor de idioma, telefone de atendimento.

---

## 2. Estrutura

Duas faixas empilhadas. Só a segunda é fixa.

```
┌──────────────────────────────────────────────────────────────┐
│  FRETE CALCULADO POR CEP · ATÉ 10X SEM JUROS · …             │  faixa de aviso (§3)
├──────────────────────────────────────────────────────────────┤
│  Canto Zen    SALA  QUARTO  COZINHA  ESCRITÓRIO  INSPIRAÇÕES │  barra (§5)
│                                            CARRINHO (2)      │
└──────────────────────────────────────────────────────────────┘
                    ↓ abre
┌──────────────────────────────────────────────────────────────┐
│              Sofás                                           │  painel (§6)
│              Poltronas                                       │
│              …                                               │
│              ───────────────                                 │
│              VER TUDO EM SALA                                │
└──────────────────────────────────────────────────────────────┘
```

**Geometria da barra**

| Propriedade | Valor |
|---|---|
| Altura | `72px`, **constante** — nunca muda, nem ao fixar |
| Container | `max-width: 1360px`, goteira `clamp(1.5rem, 4vw, 4.5rem)` |
| Fundo | `--plaster` |
| Borda inferior | filete de 1px em `--hairline` |
| Sombra | nenhuma, em nenhum estado (§6 de `marca.md`) |
| Raio | 0 |

**Alinhamento — agrupado à esquerda, assimétrico.** Assinatura, um respiro de
`3.5rem`, e então os itens de navegação com `2rem` entre si. O carrinho é empurrado
sozinho para a direita. A goteira direita fica deliberadamente vazia — é a mesma
regra do par imagem/texto em §5 de `marca.md`.

Navegação centralizada foi recusada: simetria contradiz o vazio intencional da
marca. Duas linhas (assinatura centralizada acima da navegação) também — briga com
a barra fixa por altura.

---

## 3. Faixa de aviso

Existe, é **uma linha, estática e única**. Não gira, não é dispensável, não é fixa:
rola para fora com a página e não volta.

- Fundo `--kozo`, texto `--muted`, filete de 1px em `--hairline` embaixo.
- Voz de **anotação** (§4 de `marca.md`).
- Padding vertical `0.625rem`.

**Direção de copy** — reasseguramento, nunca promoção. Três fatos curtos separados
por `·`, nesta ordem de prioridade:

> `FRETE CALCULADO POR CEP · ATÉ 10X SEM JUROS · PEÇAS SOB ENCOMENDA`

Proibido: contagem regressiva, percentual de desconto, "últimas unidades", qualquer
verbo no imperativo. Rotação de mensagens está fora porque é movimento, e §9 de
`marca.md` não o autoriza.

---

## 4. Assinatura

`Canto Zen`, caixa baixa com iniciais maiúsculas, em **Zen Old Mincho** a
`1.35rem`, `--ink`, tracking `0.005em`. Link para `/`.

> **Exceção registrada.** §4 de `marca.md` restringe a Mincho a nome de peça,
> título de coleção, título editorial e uma linha de destaque — *"nunca para
> interface"*. A assinatura é a **única** exceção a essa regra em todo o
> storefront, e não se generaliza: nenhum outro elemento de chrome usa a Mincho.
>
> A razão: com zero ícones na barra, compor a assinatura na voz de anotação a
> tornaria tipograficamente idêntica ao rótulo "Inspirações" ao lado — a marca
> desapareceria dentro da própria navegação.

Não há símbolo, monograma ou lockup. A marca não tem sistema de logo, e o gesto
forte já está gasto na régua.

---

## 5. Itens de navegação

Cinco, nesta ordem, todos em voz de anotação:

| Item | Destino | Abre painel |
|---|---|---|
| Sala | `/sala` | sim |
| Quarto | `/quarto` | sim |
| Cozinha | `/cozinha` | sim |
| Escritório | `/escritorio` | sim |
| Inspirações | `/inspiracoes` | não |

**Fora da barra, deliberadamente:**

- **Todos os produtos** (`/produtos`) — vive dentro do painel como "Ver tudo em
  {Ambiente}" e no rodapé. Um slot permanente para ele enfraqueceria os ambientes.
- **Sobre e Contato** — rodapé e home. Não são destinos de navegação recorrente.
- **Coleções** — não têm página índice (`rotas.md`, *Omissões deliberadas*), logo
  não têm slot.

---

## 6. Painel de ambiente

**Forma: coluna.** O painel é uma coluna estreita alinhada sob o grupo de
navegação — não uma superfície de largura total.

| Propriedade | Valor |
|---|---|
| Largura do conteúdo | `max-width: 260px`, coluna única |
| Alinhamento | sob o grupo de navegação, não sob a borda da página |
| Fundo | `--plaster` — o mesmo da barra, contínuo |
| Borda inferior | filete de 1px em `--hairline` |
| Padding vertical | `2rem` |
| Sombra, raio | nenhuma, 0 |

**Conteúdo**, de cima para baixo:

1. Os tipos curados daquele ambiente, na ordem exata da tabela *Taxonomia de tipos*
   de [`rotas.md`](rotas.md). Corpo S (`0.875rem`), `--ink`, `0.375rem` de padding
   vertical cada. Hover leva a cor a `--indigo`.
2. Filete de 1px em `--hairline`, com `1.25rem` de respiro acima e abaixo.
3. **Ver tudo em {Ambiente}** — voz de anotação, sublinhado por filete
   `--hairline`, apontando para a landing do ambiente.

Nada mais entra: sem imagem, sem peça em destaque, sem coleção, sem texto
editorial, sem "novidades".

### Por que essa forma

Comparadas lado a lado no protótipo (§12):

- **Painel com peça em destaque** — largura total, tipos em duas colunas e uma peça
  com régua à direita. Recusado: repetir a régua acima de *toda* página gasta o
  gesto que §2 de `marca.md` raciona a duas por tela. A assinatura da marca vira
  papel de parede exatamente onde ela não é informação que o comprador pediu.
- **Índice** — um único painel com os quatro ambientes e todos os tipos de uma vez,
  o ambiente sob o cursor em tinta cheia e os outros esmaecidos. Recusado: esmaecer
  três quartos do painel é um efeito, e a densidade de 20 tipos simultâneos
  contradiz a densidade baixa de §5 de `marca.md`.

A coluna venceu por ser a única que não adiciona nada ao que a pergunta pedia:
revelar os tipos daquele ambiente.

---

## 7. Carrinho

Texto, sem ícone: **`CARRINHO`**, e `(n)` quando `n > 0`.

- Voz de anotação, `--ink`, numerais tabulares.
- O parêntese some inteiro no carrinho vazio — nunca `(0)`.
- Sem badge, sem círculo, sem cor. Vermelho não existe na paleta e um badge
  índigo gastaria o único acento em contagem.
- **Navega para `/carrinho`.** Não abre gaveta, não abre preview, não tem hover
  state além da transição de cor.

> **Restrição entregue ao ticket [Cart sections](../../.wayfinder/tickets/010-cart.md):**
> a afordância da navbar é um **link**. Se aquele ticket quiser uma gaveta, ela é
> um acréscimo disparado pelo *adicionar ao carrinho*, não por este link. O link
> continua indo para a página em qualquer cenário.

---

## 8. Comportamento fixo

A faixa de aviso rola para fora. A barra então **fixa no topo**, na mesma altura de
`72px` que tinha antes.

- Sem encolher, sem trocar de fundo, sem ganhar sombra, sem esconder-ao-descer.
- `--plaster` opaco — nunca translúcido ou desfocado.
- O filete inferior é o que separa a barra do conteúdo que passa por baixo.

Escolhido assim porque qualquer mudança de altura no scroll é movimento, e movimento
pertence ao ticket [Motion & transition conventions](../../.wayfinder/tickets/017-motion.md).
Esta especificação não deixa nada para aquele ticket desfazer.

---

## 9. Estado ativo

O ambiente da rota corrente é marcado por um **filete de 1px em `--ink` sob o
rótulo**, e o rótulo vai a `--ink` cheio. Os demais ficam em `--muted`.

**Não se usa índigo aqui**, embora §3 de `marca.md` liste "link ativo" entre seus
usos: numa página de produto o selo Pix e o anel de foco já consomem duas
aparições, e um terceiro índigo violaria a regra das três. O filete reaproveita o
vocabulário que a marca já possui.

Regras de aplicação:

| Rota | Item marcado |
|---|---|
| `/sala`, `/sala/sofas` | Sala |
| `/inspiracoes`, `/inspiracoes/[slug]` | Inspirações |
| `/produtos/[slug]` | **nenhum** — o breadcrumb já declara o ambiente principal |
| `/produtos`, `/carrinho`, `/checkout`, institucionais | nenhum |

Estado **aberto** ≠ estado **ativo**: o painel aberto leva o rótulo a `--ink` cheio
sem desenhar o filete. Um ambiente pode estar aberto e ativo ao mesmo tempo.

---

## 10. Interação e acessibilidade

- **O rótulo é um link.** Em ponteiro, o hover abre o painel após uma espera de
  intenção de `120ms`; o clique navega para a landing do ambiente.
- **Toque e teclado** não têm hover: a primeira interação abre o painel, e a
  navegação acontece pelo "Ver tudo em {Ambiente}" dentro dele.
- **Um painel por vez.** Abrir um fecha o outro.
- **Fechamento**: `Escape` fecha e devolve o foco ao rótulo que o abriu; sair com o
  ponteiro fecha após `180ms`; rolar a página fecha imediatamente.
- `aria-expanded` no rótulo; o painel é rotulado pelo ambiente que o abriu.
- **Foco visível obrigatório**: `outline: 2px solid var(--indigo); outline-offset: 3px`,
  conforme §6 de `marca.md`. Este é o único índigo da barra.
- Ordem de tabulação: assinatura → ambientes → Inspirações → carrinho. O conteúdo
  do painel entra na ordem imediatamente após seu rótulo, quando aberto.
- A transição de cor de `120ms` dos estados interativos é a única animação; nada
  na barra anima geometria, opacidade ou posição.

---

## 11. Mobile

Abaixo de `768px`:

- A barra mantém `72px`, a assinatura à esquerda e **`MENU` à direita, como
  palavra em voz de anotação — não um ícone de hambúrguer.** A regra de zero ícones
  vale em todos os breakpoints.
- **`CARRINHO (n)` permanece na barra**, ao lado de `MENU`. Não se esconde dentro
  do painel: é a única afordância comercial da barra e some no exato momento em que
  a tela é menor.
- `MENU` abre um painel de **tela cheia** em `--plaster`, sem sobreposição
  translúcida.
- Dentro dele: os quatro ambientes como **acordeão** — tocar o nome revela os tipos
  curados daquele ambiente; tocar "Ver tudo em {Ambiente}" navega. Inspirações é um
  link plano.
- Um acordeão aberto por vez. `MENU` vira `FECHAR` enquanto o painel está aberto.
- O rodapé do painel repete Sobre, Contato e as políticas — no mobile o rodapé fica
  longe demais para ser o único caminho até eles.

---

## 12. Busca — ausência deliberada

**Não há busca na navbar**, e portanto não há superfície de resultados no
storefront.

Motivo: o catálogo é de quatro ambientes com 4 a 6 tipos curados cada — cerca de 20
páginas de listagem —, e a navegação room-primary de [`rotas.md`](rotas.md) foi
desenhada como *o* caminho. Um campo de busca é sinal de loja utilitária e briga
com o registro de ateliê; e uma loja conceito não tem corpus real que torne
relevância significativa.

O custo é reconhecido: quem chega sabendo "poltrona" precisa passar por Sala.

Consequências registradas:

- O `?q=` que [`rotas.md`](rotas.md) reservava em `/produtos` **não é usado**.
- A superfície de resultados (estado vazio, eco da consulta, sinalização de
  relevância) saiu do mapa como fora de escopo.

---

## 13. Dados necessários

A barra é estática exceto por dois valores.

| Dado | Origem | Uso |
|---|---|---|
| `ambientes[]` | entidade `Ambiente` de [`produto.md`](produto.md) — `slug`, `label`, `tipos[]` | rótulos da barra e conteúdo de cada painel |
| `tipos[]` por ambiente | `Ambiente.tipos[]` (curado, não inferido do catálogo) | lista do painel, na ordem autorada |
| contagem do carrinho | estado do carrinho | `(n)`, omitido quando `0` |
| rota corrente | roteador | filete de estado ativo (§9) |
| copy da faixa | constante da loja | §3 |

Nenhum desses exige requisição: a taxonomia é autorada e pode ser renderizada no
servidor. Só a contagem do carrinho é estado de cliente.

---

## 14. Protótipo

Três formas de painel construídas e comparadas em `/prototype/navbar?variant=`,
capturadas no branch `prototype/navbar`. **Não devem ser promovidas** — foram
escritas sob restrições de protótipo (sem testes, sem tratamento de erro, dados
simulados). A decisão validada é este documento.
