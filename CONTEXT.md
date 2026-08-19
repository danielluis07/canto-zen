# Contexto — Canto Zen

Glossary for the Canto Zen storefront. Terms only — no implementation detail, no
spec. Specs live in `docs/spec/`.

Canto Zen is a fictional Brazilian home-furniture e-commerce concept store.
Domain language is **pt-BR**; identifiers and copy both use it.

## Catálogo

**Produto** — one record per *acabamento*, not per piece. "Poltrona Lina em linho
cru" and "Poltrona Lina em bouclé carvalho" are two Produtos. Each has exactly one
URL and one price. Shape in [`docs/spec/produto.md`](docs/spec/produto.md).

**Família** — the piece behind its acabamentos. "Poltrona Lina" is a Família;
the Produtos that share it are its finishes. A Família has a name and no page.

**Acabamento** — the material-and-colour treatment that distinguishes one Produto
from its siblings in the same Família. Never called a "variant": there is no
variant *inside* a Produto, which is precisely the distinction the term marks.

**Ambiente** — a room: Sala, Quarto, Cozinha, Escritório. The store's
merchandising spine, and the top level of the URL space. Four, not five —
Varanda was considered and dropped.

**Ambiente principal** — the single Ambiente a Produto's breadcrumb reads.
Distinct from the full set it lists under: a bench belongs to Quarto *and* Sala,
but only one of them is its breadcrumb, and it never depends on the path the
visitor took.

**Tipo** — what a piece *is*: sofás, camas, escrivaninhas. Global in meaning, one
per Produto, curated per Ambiente. Which Tipos an Ambiente exposes is authored,
not inferred from the catalogue.

**Coleção** — a curated, ordered set of Produtos. A merchandising device surfaced
in context, never an index page; the order is the editorial act.

**Artigo** — one Ambiente, composed and photographed: the store's only editorial
form. There are exactly four, one per Ambiente, and the set is closed. It is not
a blog post — no date, no author, no category — and it carries no price and no
Régua, the two things every other surface asserts.

**Legenda** — the line beneath an Artigo's photograph naming the Produtos visible
in that frame, each name a link. It is how a room story reaches the catalogue,
and the only mechanism that does so.

## Marca

**Régua** — the identity's signature: a hairline rule with end ticks carrying a
real measurement alongside a piece. It is both ornament and data, which is why it
was chosen. A régua without a real figure behind it is forbidden.

**Cota** — one measurement annotation on a Régua. Max two per piece (largura,
altura).

## Comércio

**Preço de tabela** — the authored reference price, and the only price stored.
The à-vista price, the Pix badge and the parcelamento table are all derived from
it by store-wide policy.

**À vista** — the price tier covering Pix, boleto and 1x no cartão. Not
"Pix only": the discount applies to the tier, and it must be visibly disclosed.

**Parcelamento** — payment split into monthly instalments, shown as
`{N}x de R$ {v} sem juros`. Brazilian pages show the à-vista and the parcelado
total together.

**Frete** — delivery cost, quoted per CEP on the *product* page, not first met at
checkout. Cubed for furniture: driven by the box, not the price. Free freight is
written "Grátis", never `R$ 0,00`.

**Prazo de entrega** — counted in **dias úteis**, starting after payment
confirmation. Distinct from *prazo de produção*, which precedes dispatch and
applies only to sob-encomenda pieces.

**Montagem** — assembly, sold as an add-on chosen on the product page and
performed on the scheduled delivery day. When bought, it moves the start of the
arrependimento window from delivery to assembly.

**Disponibilidade** — one of three states, never a count: *envio imediato*
(in stock), *sob encomenda* (made to order, with a production window),
*esgotado*.

**Arrependimento** — the buyer's statutory right to withdraw within 7 days of
receipt. The notice is ostensive by law, so it appears inline in the buy-box,
cart and confirmation, not only in a policy page.

**Embalagem** — the box: its own measurements and weight, kept separate from the
piece's. It is what has to fit through the door and the lift, so it drives both
freight and the access disclosure.

## Institucional

**Manifesto** — the content of `/sobre`: five statements, four refusals and one
affirmation, each carrying a short body. The store's voice at its most direct,
and the only page whose copy is fixed rather than left as direction.

**Loja** — the store's own identification facts as one object: razão social,
CNPJ, IE, founding year, address, atendimento channels and showroom hours. Read
by the footer and by `/contato`, so the two can never disagree. Fictional and
well-formed, never a placeholder.

**Showroom** — the store's physical space, at the address the footer publishes.
Visitable without an appointment, but a specific piece may not be on the floor:
the store carries no stock.

**Política** — one of four legal documents at `/politicas/[slug]`. They share a
layout but not a heading skeleton, and each carries a date, because a policy
without a version is a defect.

**Ausência autorada** — something a surface deliberately does not have, recorded
as a decision rather than an omission. Three so far: the carrinho has no Régua,
Inspirações has neither price nor Régua, and the institutional pages have no
photography.
