# Direção de marca — Canto Zen

Resolve o ticket [Brand direction](../../.wayfinder/tickets/002-brand-direction.md).
Direção visual, não brand kit: sem sistema de logo, sem papelaria, sem aplicação
offline. O que está aqui é o suficiente para que nenhuma decisão de seção seja
arbitrária.

---

## 1. Posição

Ateliê de alto padrão em registro japandi. Peças assinadas, produção sob
encomenda, marcenaria própria. Reverência ao objeto: muito espaço, material em
primeiro plano, nome do designer sempre presente.

**Silencioso com um único gesto forte.** Tudo é disciplinado e calmo; a
personalidade inteira mora em um só dispositivo (§2). Isso é o que mantém as 15
rotas coerentes sem virar papel de parede.

### A tensão que isso resolve

Ateliê de alto padrão normalmente esconde preço ("sob consulta"). Aqui **não**:
[Brazilian e-commerce UX conventions](../research/br-ecommerce-conventions.md) já
fixou que todo preço mostra à-vista **e** parcelado, com selo de desconto Pix e
frete por CEP na página do produto. Nada disso sai.

A reconciliação é de **voz, não de presença**: os fatos comerciais aparecem
inteiros, compostos na voz de anotação (§4) — pequenos, tracked, numerais
tabulares — em vez de gritados em vermelho e amarelo. Micasa e Artefacto fazem
exatamente isso. Preço discreto, nunca preço ausente.

---

## 2. O gesto: a régua

**A cota é a assinatura.** Um filete com um tique em cada extremidade, carregando
um número real em centímetros, corre junto à borda inferior e à borda direita de
toda peça fotografada.

Isso é escolhido em vez de um enfeite porque a cota é **simultaneamente ornamento
e dado**. O spec já deve ao cliente L × P × A — móvel é uma categoria em que
medida decide a compra. O dispositivo mais memorável da marca é, portanto,
informação que o comprador precisa de qualquer jeito. Ele nunca fica decorativo
porque nunca deixa de ser verdadeiro.

**Onde a régua pode aparecer**

- Ao redor de qualquer peça em destaque — produto, coleção, ambiente.
- Abrindo uma seção, quando houver um número real a declarar (nº de peças, prazo,
  ano da coleção).
- Em comparação de escala no catálogo.

**Onde a régua não pode aparecer**

- Sem número real. Uma régua vazia é enfeite e está proibida.
- Mais de duas por tela. Duas cotas por peça (largura, altura) é o teto.
- Em texto corrido, formulário, checkout ou rodapé.

**Anatomia** — filete de 1px em `--ink`; tiques de 13px perpendiculares nas
pontas; rótulo centrado na voz de anotação, com um respiro do fundo da página por
trás dele para cortar o filete. Cota vertical fica **fora** da imagem, à direita,
com o rótulo rotacionado 90°.

Corolário: numeração ordinal (01 / 02 / 03) fica **fora** do sistema. Nada no
storefront é uma sequência que o leitor precise seguir em ordem.

---

## 3. Paleta

Uma identidade clara e quente. **Sem dark mode** — decisão já fechada no mapa.

| Token | Nome | Hex | Uso |
|---|---|---|---|
| `--ink` | Tinta | `#1B1A18` | Texto, filete, traço da régua |
| `--plaster` | Reboco | `#F5F4F0` | Fundo da página |
| `--kozo` | Kozo | `#EAE7E0` | Painel recuado, trilho, faixa |
| `--oak` | Carvalho | `#C6B49A` | Madeira, calor, hover sutil |
| `--hairline` | Fio | `#D3CFC7` | Divisor, borda de campo |
| `--indigo` | Índigo | `#223244` | **Único acento cromático** |
| `--muted` | Apagado | `#7A756C` | Texto secundário, legenda |

**Índigo é o único acento** e é racionado: estado interativo (foco, hover de CTA,
link ativo) e o selo de desconto Pix. Nada mais. Se o índigo aparece três vezes
numa tela, duas estão erradas.

**Fora, deliberadamente:**

- **Terracota.** É o acento padrão da categoria e o clichê mais reconhecível de
  design gerado por IA. Índigo ocupa esse lugar — frio contra a madeira, e lê
  tanto como tinta índigo japonesa quanto como neutro escandinavo.
- **Creme `#F4F1EA` e vizinhos.** Reboco é mais frio e mais cinza de propósito.
- **Verde, vermelho e amarelo de e-commerce.** Estado de sucesso e erro se
  resolvem em tinta + índigo + peso tipográfico, não em semáforo.

---

## 4. Tipografia

Duas famílias. Uma terceira seria um acessório a mais.

**Zen Old Mincho** — display. Mincho de **baixo contraste**: tem a calma japandi
sem ser o serif de altíssimo contraste tipo Playfair que a categoria inteira usa.
Cobre `latin-ext`, então acentuação pt-BR está inteira.

> Só para: nome de peça, título de coleção, título editorial, uma única linha de
> destaque por página. Nunca para interface, dado, preço ou label.

**Schibsted Grotesk** — corpo, interface e dado. Grotesca neutra de origem
escandinava, alinhada ao registro e fora do eixo Inter/Geist. **Numerais
tabulares ligados em todo lugar** — preço, medida, parcela, CEP, prazo.

### Escala

| Papel | Família | Tamanho / entrelinha | Tracking |
|---|---|---|---|
| Display XL — nome de peça em destaque | Mincho 400 | `clamp(2.1rem, 3.6vw, 3.25rem)` / 1.08 | `0.005em` |
| Display L — título de seção | Mincho 400 | `1.75rem` / 1.2 | `0.005em` |
| Display M — destaque editorial | Mincho 400 | `1.35rem` / 1.45 | `0.005em` |
| Preço | Grotesk 400 tab. | `1.75rem` / 1.1 | `-0.01em` |
| Corpo | Grotesk 400 | `1rem` / 1.55 | `0` |
| Corpo S — secundário, parcela | Grotesk 400 | `0.875rem` / 1.5 | `0` |
| **Anotação** | Grotesk 500 tab. | `0.6875rem` / 1.4 | `0.16em`, caixa alta |
| CTA | Grotesk 500 | `0.75rem` | `0.18em`, caixa alta |

**A voz de anotação é o cavalo de batalha do sistema.** Ela carrega label, breadcrumb,
navegação, medida, rótulo de cota, legenda de foto e metadado. É ela que permite
o preço ser discreto sem sumir. Medida de texto corrido: 60–70 caracteres; nunca
mais que 34ch em coluna lateral.

`<html lang="pt-BR">` — o boilerplate atual traz `lang="en"` e é substituído.

---

## 5. Espaço e densidade

Densidade **baixa**, e o vazio é intencional e assimétrico — não é margem
sobrando, é o alcova (`tokonoma`) que faz o objeto ter presença.

- Medida máxima do container: `1360px`.
- Goteira externa: `clamp(1.5rem, 4vw, 4.5rem)`.
- Ritmo vertical: `0.5 / 0.75 / 1 / 1.5 / 2.75 / 4 / 7rem`.
- Respiro entre seções maiores: `7rem`; nunca menos que `4rem`.
- Grade de 12 colunas. **Bloco de texto nunca centralizado sob a imagem**: o par
  padrão é imagem em 7 colunas e texto em 5, com a goteira grande à direita
  preservada vazia.

---

## 6. Traço e canto

- **Raio de canto: 0** em tudo que é interface — botão, campo, painel, card. A
  única curva do sistema é a do próprio móvel, na fotografia.
- **Sem sombra em UI.** A única sombra que existe é a que a luz rasante lança na
  foto. Elevação se resolve por tom (`--kozo` sob `--plaster`) e por filete.
- **Filete de 1px** é o divisor universal, em `--hairline`. `--ink` só quando o
  traço é uma régua (§2) ou fecha um total.
- Botão primário: caixa alta, tracking `0.18em`, borda de 1px em `--ink`,
  fundo transparente; no hover inverte para fundo `--ink`.
- Foco visível obrigatório: `outline: 2px solid var(--indigo); outline-offset: 3px`.

---

## 7. Fotografia

Uma regra e ela não abre exceção: **luz rasante de fim de tarde, fundo de reboco
cru, sombra dura e longa.**

- Peça **sozinha**, sem styling, sem plantas, sem xícara, sem pessoa. O produto
  não é encenado; é observado.
- Sombra projetada é parte do enquadramento, nunca cortada fora.
- Enquadramento na proporção real da peça sempre que possível — a foto e a régua
  contam a mesma verdade.
- Ambiente (Inspirações) é a única exceção ao "peça sozinha", e mesmo lá a luz
  rasante e o fundo de reboco continuam valendo.

O detalhamento completo — proporções, crops por superfície, tratamento de
`alt`, fallback — é do ticket [Imagery system](../../.wayfinder/tickets/014-imagery.md).

---

## 8. Preço e dado

- À-vista no Pix em Preço (§4), com o desconto como sobrescrito em `--indigo`.
- Parcelamento logo abaixo, em Corpo S `--muted`: `ou {total} em {N}x de {v} sem juros`.
- Medida sempre na voz de anotação, sempre `L {n} × P {n} × A {n} cm`, com `×`
  de multiplicação — nunca a letra `x`.
- Todo numeral em contexto de dado usa `font-variant-numeric: tabular-nums`.

---

## 9. Movimento

Provisório, e deliberadamente magro: transição de cor em 120ms nos estados
interativos, e nada mais. Sem revelação em scroll, sem transição de página, sem
paralaxe. `prefers-reduced-motion: reduce` respeitado.

Convenção completa de movimento continua em **Not yet specified** no mapa — esta
seção só garante que nenhuma sessão de build invente movimento antes daquele
ticket existir.

---

## Como isso foi decidido

Três direções construídas e comparadas lado a lado em `/prototype/marca` —
**A régua**, **O canto** (o ângulo em filete + luz rasante) e **O caderno** (a
ficha técnica como herói, foto rebaixada a miniatura). Todas as três já
partilhavam posição, registro e volume; discordavam apenas sobre onde gastar o
gesto forte.

**A régua venceu**: é a única cuja assinatura carrega informação, e por isso a
única que sobrevive a 15 rotas sem virar enfeite. O Caderno era a mais
distintiva, mas rebaixar fotografia numa loja de móveis briga com a categoria.
O Canto era a mais segura e a menos memorável.

O protótipo completo está capturado no branch `prototype/brand-direction`
(commit `ff44fd7`) e **não** deve ser promovido — foi escrito sob restrições de
protótipo.
