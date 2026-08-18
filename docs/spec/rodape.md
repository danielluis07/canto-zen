# Rodapé — footer

Resolve o ticket [Footer](../../.wayfinder/tickets/006-footer.md).
Vale para todas as 15 rotas de [`rotas.md`](rotas.md), com uma variante reduzida em
`/checkout` (§9). Vocabulário visual em [`marca.md`](marca.md); toda cor, medida e
voz tipográfica citada aqui vem de lá e não é redefinida. As obrigações legais vêm
de [`br-ecommerce-conventions.md`](../research/br-ecommerce-conventions.md).

---

## 1. Propósito

O rodapé faz três trabalhos, nesta ordem de prioridade:

1. **Cumprir o Decreto 7.962/2013 art. 2º I–II** — identificação do fornecedor em
   local de destaque: razão social, CNPJ, endereço físico completo, endereço
   eletrônico e meios de contato.
2. **Tornar ostensivo o direito de arrependimento** (CDC art. 49 + Decreto 7.962
   art. 5º), incluindo o canal pelo qual ele se exerce.
3. **Fechar a página com a posição do ateliê** — a única superfície da loja onde a
   posição de §1 de `marca.md` (peças sob encomenda, marcenaria própria) é dita em
   prosa.

Navegação é o quarto trabalho, não o primeiro. O rodapé recolhe o que a
[`navbar.md`](navbar.md) empurrou para baixo — `/produtos`, `/sobre`, `/contato` —
e as quatro políticas; ele não duplica a espinha dorsal room-primary, apenas a
completa.

**Peso: bloco substancial, não faixa utilitária.** Mas substancial em *texto*, não
em imagem: uma segunda fotografia embaixo de toda página competiria com a peça
acima dela. Não há foto no rodapé, em nenhuma rota.

---

## 2. Estrutura

Quatro zonas empilhadas, separadas por filete de 1px em `--hairline`.

```
──────────────────────────────────────────────────────────────  filete superior
                                                                 (separa da página)
  Peças feitas sob encomenda em          AVISO DE NOVAS PEÇAS   zona A (§4, §5)
  marcenaria própria, em São Paulo.      [ e-mail        ] →
                                         Ao assinar você concorda…
──────────────────────────────────────────────────────────────
  AMBIENTES    A MARCA        AJUDA              ATENDIMENTO    zona B (§6, §7)
  Sala         Inspirações    Trocas e devol.    WhatsApp …
  Quarto       Sobre          Entrega e frete    (11) 3000-0000
  Cozinha      Contato        Privacidade        oi@cantozen…
  Escritório                  Termos de uso      seg–sex, 9h–18h
  Todas as peças
──────────────────────────────────────────────────────────────
  PIX  VISA  MASTER  ELO  AMEX  BOLETO      @cantozen  @cantozen  zona C (§8)
  COMPRA SEGURA
──────────────────────────────────────────────────────────────
  Canto Zen Marcenaria e Comércio de Móveis Ltda. · CNPJ …       zona D (§3)
  Você pode desistir da compra em até 7 dias corridos…
  © 2026 Canto Zen · Todos os direitos reservados
──────────────────────────────────────────────────────────────
```

**Geometria**

| Propriedade | Valor |
|---|---|
| Fundo | `--plaster` — o mesmo da página |
| Separação do conteúdo | filete de 1px em `--hairline` no topo, e nada mais |
| Container | `max-width: 1360px`, goteira `clamp(1.5rem, 4vw, 4.5rem)` |
| Grade | 12 colunas, iguais às de §5 de `marca.md` |
| Respiro acima do rodapé | `7rem` |
| Padding interno das zonas | `2.75rem` no topo e na base de cada zona |
| Raio, sombra | 0, nenhuma |

**Fundo `--plaster`, não `--kozo`.** `--kozo` já está gasto na faixa de aviso da
navbar; repeti-lo embaixo emolduraria toda página numa moldura combinando, o que lê
como template. O tom aparece uma vez só, e no ponto mais silencioso: a zona D (§3)
recua para `--kozo`.

**Alinhamento assimétrico**, como na navbar e como em §5 de `marca.md`: tudo
agrupado à esquerda, a goteira direita deliberadamente vazia. Nenhuma zona é
centralizada.

---

## 3. Bloco legal (zona D)

A zona mais baixa, recuada em `--kozo`, padding vertical `2rem`. Três linhas, nesta
ordem:

**1 — Identificação do fornecedor.** Corpo S, `--muted`, em linha corrida separada
por `·`:

> Canto Zen Marcenaria e Comércio de Móveis Ltda. · CNPJ 51.204.876/0001-40 ·
> IE 116.482.930.114 · Rua Harmonia, 742, Vila Madalena, São Paulo — SP,
> CEP 05435-000

Campos obrigatórios pelo decreto: razão social, CNPJ, endereço físico com CEP,
e-mail e meio de contato — os dois últimos vivem na zona de atendimento (§7), que
está na mesma tela. **Inscrição Estadual entra** por convenção: não é exigida pelo
decreto, custa uma vírgula, e sua ausência é mais conspícua que sua presença num
rodapé de loja de móveis brasileira.

> **Dados fictícios.** Razão social, CNPJ, IE, endereço, telefone e e-mail acima
> são inventados para a loja-conceito. São bem formados de propósito, para que o
> layout seja real, e **devem ser substituídos antes de qualquer transação real.**
> Nenhuma sessão de build deve deixá-los em branco ou como placeholder: um bloco
> legal vazio é exatamente a falha que este spec existe para impedir.

**2 — Aviso de arrependimento.** Corpo S, `--ink` (não `--muted` — é o único texto
da zona que precisa ser lido):

> Você pode desistir da compra em até 7 dias corridos a contar do recebimento — ou
> da montagem, quando contratada. Para exercer, fale com a gente pelo WhatsApp ou
> por oi@cantozen.com.br; respondemos em até 5 dias.
> [Como funciona](/politicas/trocas-e-devolucoes)

Isto **não** é substituível pelo link "Trocas e devoluções" da coluna Ajuda. O
Decreto 7.962 art. 5º exige informação *"clara e ostensiva"* sobre os meios de
exercício; um link enterrado numa coluna não satisfaz "ostensiva", e uma faixa
gritada violaria a marca. Uma frase em prosa no bloco legal é o meio-termo correto.

A contagem a partir da **data de montagem** quando ela é contratada é específica de
móveis e vem da prática observada na pesquisa; entra porque a loja vende montagem
como add-on.

**3 — Copyright.** Voz de anotação, `--muted`:

> © 2026 Canto Zen · Todos os direitos reservados

Nada mais. Sem "feito por", sem crédito de framework, sem selo de agência.

### O canal de cancelamento é o atendimento

O Decreto 7.962 art. 5º pede que o arrependimento seja exercível *"pela mesma
ferramenta utilizada para a contratação"* — o que, numa loja com conta de usuário,
seria uma tela self-service na área do cliente. **Autenticação está fora de escopo
do mapa**, então não existe área do cliente para hospedá-la.

A resolução: **o canal de atendimento nomeado é a ferramenta.** WhatsApp e e-mail
aparecem explicitamente na frase de arrependimento (acima) e em
`/politicas/trocas-e-devolucoes`, junto do prazo de 7 dias e do dever de resposta
em 5 dias (art. 4º). Isso fecha a lacuna sem exigir uma área de conta que o mapa já
descartou.

---

## 4. Linha de fecho (zona A, esquerda)

Uma única linha em **Zen Old Mincho**, Display M (`1.35rem`/1.45), `--ink`,
ocupando 5 das 12 colunas:

> Peças feitas sob encomenda em marcenaria própria, em São Paulo.

É a única linha de destaque do rodapé e consome a cota de "uma linha de destaque
por página" de §4 de `marca.md` quando a página não tiver gasto antes. Não há
repetição da assinatura, não há símbolo, não há ornamento.

**A régua não aparece aqui.** §2 de `marca.md` proíbe o gesto em rodapé,
explicitamente. A identidade do rodapé vem da contenção e dos filetes, não da
assinatura visual.

---

## 5. Newsletter (zona A, direita)

Ocupa 4 das 12 colunas; a goteira direita fica vazia.

- **Rótulo**: `AVISO DE NOVAS PEÇAS`, voz de anotação, `--ink`.
- **Um campo de e-mail e um botão**, lado a lado. Sem campo de nome, sem checkbox.
  Campo com borda de 1px em `--hairline`, raio 0, fundo `--plaster`; botão primário
  conforme §6 de `marca.md`.
- **Nota LGPD** sob o campo, Corpo S `--muted`:
  *"Enviamos só quando há peça nova. Cancele quando quiser. Veja a
  [Política de privacidade](/politicas/privacidade)."*
  Uma nota, não um tick-box: uma loja-conceito não tem onde registrar o
  consentimento, e um checkbox que não persiste nada é mentira de interface.
- **Estado de sucesso**: o formulário é substituído *no lugar* por uma linha em voz
  de anotação — `PRONTO. VOCÊ SERÁ AVISADO.` Sem modal, sem toast: ambos são
  movimento que §9 de `marca.md` não autoriza.
- **Estado de erro**: mensagem em Corpo S `--ink` sob o campo, borda do campo em
  `--ink`. Sem vermelho — a paleta não tem semáforo (§3 de `marca.md`).

**Proibido nesta zona**: percentual de desconto, "ganhe 10% na primeira compra",
qualquer verbo no imperativo além do rótulo do botão, contagem de assinantes.
A captura existe porque um ateliê sob encomenda plausivelmente anuncia peças — não
porque converte.

---

## 6. Colunas de link (zona B)

Três colunas de navegação, cada uma com título em voz de anotação `--muted` e itens
em Corpo S `--ink`. Espaçamento vertical de `0.5rem` entre itens; hover leva a cor a
`--indigo`, transição de 120ms.

| AMBIENTES | A MARCA | AJUDA |
|---|---|---|
| Sala → `/sala` | Inspirações → `/inspiracoes` | Trocas e devoluções → `/politicas/trocas-e-devolucoes` |
| Quarto → `/quarto` | Sobre → `/sobre` | Entrega e frete → `/politicas/entrega-e-frete` |
| Cozinha → `/cozinha` | Contato → `/contato` | Privacidade → `/politicas/privacidade` |
| Escritório → `/escritorio` | | Termos de uso → `/politicas/termos-de-uso` |
| Todas as peças → `/produtos` | | |

**A coluna Ajuda renderiza da mesma lista** que gera as rotas `/politicas/[slug]` em
`rotas.md` — quatro políticas, uma fonte, sem lista paralela.

**Fora, deliberadamente:**

- **Tipos** (`/sala/sofas` etc.) — ~20 links achataria o rodapé numa mapa do site.
  Os tipos vivem no painel da navbar, que é onde a decisão de navegação acontece.
- **Coleções** — não têm índice (`rotas.md`, *Omissões deliberadas*).
- **`/carrinho`, `/checkout`** — a navbar já os carrega; um destino de compra num
  rodapé é ruído.
- **Mapa do site, FAQ, blog, trabalhe conosco** — não existem no inventário de rotas.

---

## 7. Atendimento (zona B, quarta coluna)

Coluna própria, **não dobrada dentro de Ajuda**: são dados de contato, não
navegação, e o decreto os quer visíveis.

Título `ATENDIMENTO`, voz de anotação. Conteúdo em Corpo S, numerais tabulares:

> WhatsApp (11) 90000-0000
> Telefone (11) 3000-0000
> oi@cantozen.com.br
> Seg a sex, 9h às 18h

WhatsApp e telefone são links (`https://wa.me/…`, `tel:`); o e-mail é `mailto:`.
O horário não é link.

**Isto não duplica `/contato`.** O rodapé carrega o *canal*; `/contato` carrega o
formulário e o showroom. A navbar recusou o telefone (§1 de `navbar.md`) — a recusa
vale para a barra, não para o rodapé, onde o decreto o exige de qualquer forma.

---

## 8. Marcas de pagamento e redes (zona C)

Uma faixa de marcas monocromáticas, padding vertical `1.5rem`.

**Pagamento**, à esquerda: **Pix · Visa · Mastercard · Elo · American Express ·
Boleto**, como marcas gráficas, altura uniforme de `18px`, renderizadas em
`--muted`.

**Redes**, à direita do mesmo eixo: marcas do **Instagram** e do **Pinterest**, mesmo
tratamento e mesma altura, cada uma seguida do handle `@cantozen` em voz de
anotação. **As marcas de rede não são links** — são sinal de presença, não saída da
loja; o handle em texto é o que carrega a informação, e é ele que o leitor de tela
anuncia. Sem Facebook, X ou TikTok.

Sob as marcas de pagamento, uma linha em voz de anotação `--muted`:
`COMPRA SEGURA`.

> **Exceção registrada.** §1 e §11 de [`navbar.md`](navbar.md) fixaram **zero
> ícones em todos os breakpoints**, e a `MENU`/`CARRINHO` em palavra vem daquela
> regra. O rodapé é a **única** superfície do storefront que exibe marcas gráficas,
> e a exceção não se generaliza: nenhum outro elemento de chrome, em nenhuma rota,
> ganha ícone por causa dela.
>
> A razão: bandeira de cartão é uma declaração factual do que a loja aceita, e o
> comprador brasileiro procura por ela literalmente — escrever `VISA` por extenso
> não substitui a marca que ele varre com o olho. O custo cromático é neutralizado
> pela monocromia: as marcas entram em `--muted`, não em cor de marca, para que o
> índigo continue sendo o único acento da paleta (§3 de `marca.md`).

**Fora, deliberadamente: selos de terceiros.** Reclame Aqui, Ebit e certificados
PCI/SSL são marcas *conquistadas por um CNPJ real*. Exibi-los numa loja fictícia
seria a única coisa no rodapé que constitui deturpação, não escolha de design. A
linha `COMPRA SEGURA` cobre o reasseguramento sem falsificar credencial de
terceiro.

---

## 9. Rodapé reduzido em `/checkout`

`/checkout` recebe uma variante enxuta. Permanecem:

- Zona C (marcas de pagamento e `COMPRA SEGURA`) — reasseguramento no ponto exato
  em que ele importa.
- A coluna **Ajuda** e a coluna **Atendimento**, lado a lado.
- Zona D inteira — identificação, arrependimento e copyright. O dever de
  identificação do decreto não para no checkout.

Saem: a linha de fecho em Mincho, o newsletter, e as colunas Ambientes e A marca.

`/carrinho` mantém o rodapé completo — ainda é navegação, e sair do carrinho para
um ambiente é um caminho legítimo.

> **Restrição entregue ao ticket [Checkout sections](../../.wayfinder/tickets/011-checkout.md):**
> o rodapé do checkout já está especificado aqui. Aquele ticket não precisa
> inventá-lo, e não deve removê-lo inteiro — a zona D é obrigação legal.

---

## 10. Mobile

Abaixo de `768px`, tudo **empilha aberto**. Sem acordeão.

- Ordem: linha de fecho → newsletter → Ambientes → A marca → Ajuda → Atendimento →
  marcas → bloco legal.
- As três colunas de link viram três blocos empilhados, com `2rem` entre eles.
  Em `480–768px` podem ir a duas colunas; abaixo de `480px`, uma.
- O newsletter empilha campo sobre botão, ambos em largura total.
- A faixa de marcas quebra em duas linhas: pagamento acima, redes abaixo.

**Acordeão foi recusado**: é interação e movimento para ~13 links, e §9 de
`marca.md` quase não autoriza movimento. Pior, um acordeão fechado esconde os links
de política que o decreto quer visíveis. Rodapé longo no fim da página é aceitável;
obrigação legal colapsada não é.

---

## 11. Acessibilidade

- O rodapé é um `<footer>` com `role="contentinfo"`, um por página.
- Cada coluna de link é uma `<nav>` rotulada pelo próprio título (`aria-labelledby`),
  com os itens em `<ul>`.
- **Foco visível obrigatório**: `outline: 2px solid var(--indigo); outline-offset: 3px`
  (§6 de `marca.md`).
- As marcas gráficas de pagamento são decorativas (`aria-hidden`) e a informação vem
  de um texto acessível equivalente na faixa — o leitor de tela ouve as formas de
  pagamento como palavras, não como lista de imagens sem rótulo.
- As marcas de rede, por não serem links, são igualmente `aria-hidden`; o handle em
  texto ao lado é o conteúdo real.
- O campo de e-mail tem `<label>` associado, `type="email"`, `autocomplete="email"`.
  A mensagem de erro é referenciada por `aria-describedby`.
- Contraste: `--muted` sobre `--plaster` e sobre `--kozo` deve ser verificado em
  Corpo S; se não passar em AA, o texto do bloco legal sobe para `--ink`.

---

## 12. Como isso foi decidido

Resolvido por conversa, sem protótipo — o rodapé não tinha uma pergunta de layout
contestada, e sim uma pilha de decisões de conteúdo e de conformidade.

As três que custaram mais:

- **Ícones.** A recomendação inicial era manter a regra de zero ícones da navbar e
  escrever as formas de pagamento por extenso. O dev decidiu o contrário; a decisão
  vale, e §8 a registra como exceção nomeada, com a monocromia como o preço que
  mantém a paleta intacta. Selos de terceiros, no entanto, ficaram fora — a
  distinção é entre declarar um fato e exibir credencial que não se tem.
- **O canal de cancelamento.** O mapa carregava isso como névoa desde a pesquisa.
  Sem autenticação, não há área do cliente; a saída é nomear o canal de atendimento
  como a ferramenta, no próprio rodapé. §3 fecha essa névoa sem abrir ticket novo.
- **Peso do rodapé.** Bloco substancial venceu a faixa utilitária, mas apenas em
  texto: a fotografia foi recusada porque uma segunda imagem embaixo de toda página
  briga com a peça que a página inteira existe para mostrar.
