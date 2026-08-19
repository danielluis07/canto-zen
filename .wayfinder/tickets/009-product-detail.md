---
title: Product detail page sections
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: [003-product-data-shape, 004-br-ecommerce-conventions, 008-catalog]
status: closed
---

## Question

What sections does the product detail page have?

Gallery treatment, the buy box and everything in it (price, parcelamento, variant selection, quantity, add-to-cart, CEP frete check), dimensions and materials presentation, delivery and montagem messaging, care/warranty, related and complementary products, and whether reviews exist for a concept store.

Furniture detail pages live or die on dimensions and scale communication — decide how that is shown, not just that it is.

Output: `docs/spec/pagina-produto.md` — `produto.md` was already taken by the
data model from ticket 003.

## Resolution

Spec completo em [`docs/spec/pagina-produto.md`](../../docs/spec/pagina-produto.md).

**Sete seções**: breadcrumb → bloco de compra → descrição → medidas → ficha técnica
→ entrega e acesso → fecho, com as imagens `ambientada` e `detalhe` entrando como
quebras de largura total entre elas.

A decisão central — como escala se comunica — é uma **elevação técnica cotada**,
não a foto sozinha, não silhueta humana, não widget: é a régua da marca em
expressão plena, aplicada onde a informação é o assunto inteiro. Ela mora em
`Familia.desenho`, porque geometria não muda com o tecido, o que **deleta
`'escala'` de `Imagem.papel`** (única reversão) e cria o invariante *mesma família
⇒ mesmas medidas*. `Familia` também ganha `designer`, fechando a lacuna que
`marca.md` §1 abriu sem campo para segurá-la, e `Material` ganha `cuidados`,
derivado em vez de autorado por peça.

**Buy box não é sticky e não há barra fixa no celular** — cromagem persistente
cobriria justamente o desenho e a tabela de medidas. `papel` de imagem vira
**instrução de posição**, o que mata a galeria com miniaturas e torna a página
determinística a partir dos dados. Buy box carrega nome (a única linha Mincho da
página) → preço/Pix/parcelamento → outros acabamentos como amostras de `Cor.amostra`
→ disponibilidade → `COMPRAR` → CEP → montagem. **Sem stepper de quantidade** (é do
carrinho), **sem avise-me**, **sem quem-viu-também-viu**. Clicar em COMPRAR **não
navega**: o CTA vira linha de confirmação e o contador da navbar responde — gaveta
está indisponível por `navbar.md`.

CEP fica **abaixo do CTA** (a tabela de opções o empurraria para fora da tela),
erra sem cor, e é **lembrado pela sessão** — restrição entregue a carrinho e
checkout. Montagem tem **um só endereço**: preço derivado e os quatro fatos juntos,
porque os fatos existem para justificar o preço. **Régua: exatamente duas na página**
— a cota do `principal` e o desenho.

Medidas e Ficha técnica dividem-se por **espécie de fato** — número vs. atributo —
o que move `medidasExtras` para Medidas e `itensInclusos` para a Ficha.
