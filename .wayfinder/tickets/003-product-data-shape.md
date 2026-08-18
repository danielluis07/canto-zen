---
title: Product data shape
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: []
status: closed
---

## Question

What fields does a Canto Zen product have?

The fake data model that the listing, detail page, and cart all read from: identity and slug, room and type, price and any parcelamento/discount fields, dimensions and materials, colour/finish variants, image set, stock/availability signalling, delivery-time hints, ratings. Also: what a "variant" is here, and whether variants are separate products or options on one.

This is domain modelling — sharpen the vocabulary in CONTEXT.md as it settles.

Output: the product shape, plus the related shapes it drags in (room, category, collection).

## Resolution

Full shape in [`docs/spec/produto.md`](../../docs/spec/produto.md). Vocabulary
seeded into [`CONTEXT.md`](../../CONTEXT.md).

**A variant is not a thing.** One record per *acabamento* — `poltrona-lina-linho-cru`
and `poltrona-lina-boucle-carvalho` are two products sharing a thin `familia`
entity that exists only to name the PDP's "outros acabamentos" strip. This is the
only reading consistent with the `{nome}-{material-ou-acabamento}` slug already
fixed by the route inventory, and it keeps every surface from having to resolve an
axis before it can render a price, an image or a medida. `familia` gets no route.

**Physical facts on the product; commercial policy stated once.** The product
stores one authored `precoTabela` (centavos), the montagem *facts* (nivel,
pessoas, pecas, tempo) and the *embalagem*. The à-vista price, the Pix badge, the
parcelamento table, the montagem price, the garantia default and the frete quote
are all **derived** from a store-wide `politicas` object and a mock CEP→region
rule. An authored catalogue drifts; a derived one cannot — and the Pix discount
belongs at policy level anyway, which is also how the legal disclosure reads.

**The cm lives in the régua, not the name.** `nome` stays `"Poltrona Lina"`.
BR convention puts the headline dimension in the title; brand direction resolved
that tension as *voice, not presence*, and the régua is that convention rendered
in the identity's own gesture. Stating it twice would make the signature
ornamental, which `marca.md` forbids. Images therefore carry `cotas: ('largura' |
'altura')[]` and read the figure from `medidas` — which is what makes the
"no empty régua" prohibition enforceable in the type rather than by convention.

**Medidas** are a mandatory typed trio (L × P × A, integers in cm) plus an open
`medidasExtras[]` list, because three surfaces are load-bearing on the trio while
a sofá's "altura do assento" and a luminária's "alcance" cannot share a schema.
`embalagem` is a separate set of numbers — it is what has to pass the lift.

**Disponibilidade** is a three-state enum (`envio-imediato` / `sob-encomenda` /
`esgotado`), never a stock count: a concept store has no inventory, and a count
invites "restam apenas 2".

**Taxonomy is entities, not strings** — `Ambiente` (holding its *curated* `tipos[]`),
`Tipo`, `Cor`, `Material`, `Colecao`, `Familia`, each keyed by slug with an
accented label. Inferring the taxonomy from whatever products exist cannot express
the route inventory's requirement that `/cozinha/sofas` 404 rather than render an
empty grid. `cor` is singular (the acabamento *is* the colour), `materiais[]` is
plural.

**Ratings are out of the shape entirely.** No auth means no honest source, and a
row of gold stars is the loud register the brand ruled out. Purely additive later.

**Handed forward:** there is no short-description field — a product has one
`descricao`, the PDP body. [Route metadata](015-route-metadata.md) must truncate
it or author meta descriptions separately; this ticket did not decide which.
Slug is the key throughout — no synthetic ids.
