---
title: Route metadata & SEO
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: [002-brand-direction]
status: closed
---

## Question

What title, description, and structured data does each route carry?

The [route table](../../docs/spec/rotas.md) now fixes the surfaces, so this is the
copy and schema layer over it: the title template per route family (room landing,
type listing, product, collection, article, institutional), what a description says
for a templated surface where no human writes one per page, the OG/share treatment,
and which routes carry structured data — `Product` with `offers` and BRL pricing,
`BreadcrumbList` off the primary-room breadcrumb, `Article` on Inspirações.

Also: what a 404 and an empty filter result declare about themselves, given the
route inventory 404s every unenumerated room × type pair.

Blocked on brand direction because the title template *is* voice — "Sofá Lina |
Canto Zen" and "Sofá Lina — poltronas de linho | Canto Zen" are different brands.

Output: a metadata section appended to `docs/spec/rotas.md`.

---

## Resolution

Output: [`docs/spec/rotas.md`](../../docs/spec/rotas.md) §Metadata (§0–§8).

The ticket resolved on **one rule, stated three times**: *a claim that leaves the
site is held to a stricter standard than a claim made on the page* (§0, rule 3).
It is [`rodape.md`](../../docs/spec/rodape.md)'s argument for refusing Reclame
Aqui / Ebit / PCI selos — credentials of a real CNPJ — generalised past the
footer. On-page the concept-store frame travels with the reader and the admission
is staged where [`checkout.md`](../../docs/spec/checkout.md) put it; in a third
party's index the frame does not travel.

**The title spends nothing.** Bare name plus ` | Canto Zen`; the home is the one
route with no suffix. The régua-in-the-title reading was live and lost:
`medidas` is mandatory so a cm figure is always available, which makes the gesture
*honest* but not *licensed* — `marca.md` §2 scopes it to a featured piece that is
photographed, and a cota rendered as ASCII in a SERP is the gesture without its
hairline. That pushes the whole load onto descriptions, which is the point.

**Descriptions are derived, or they are an authored line the data already holds
— never written for the metadata layer.** `Ambiente.descricao`,
`Colecao.descricao`, `Artigo.resumo` (as `inspiracoes.md` predicted), the
Inspirações cabeçalho line and `/sobre`'s statement 1 are used verbatim;
everything else computes from facts in the record. **The spec adds no fields —
the second in the map to add none**, after `imagens.md`. Where there is neither
an authored line nor facts, the surface carries **no description at all**: the
cart, checkout, `/pedido-confirmado` and the 404 carry a `<title>` and nothing
else, the map's fourth *ausência autorada*.

**The product description carries no price**, and this is rule 3, not restraint:
physical facts are true whether or not anything can be bought, so the description
and the `Product` node end up carrying **the same class of fact**.

**Structured data: facts yes, offers no.** Three node types in the whole store —
`Product` (name, image, material, color, L×P×A as `QuantitativeValue`, `brand`),
`BreadcrumbList`, `Article`. `offers` is refused as the **eighth refusal of a
fabricated artefact**: a price/availability node is the machine-readable form of
exactly the claim the checkout is built around admitting the store cannot make.
`Organization`/`LocalBusiness` is refused on a line worth keeping — **a name is
not a credential; an address, CNPJ, telephone, logo or rating is** — which
permits `Brand { name }` and `author: Organization { name }` while killing the
`LocalBusiness` node `/contato`'s showroom would otherwise invite. Also out:
`AggregateRating` (no ratings exist), `ItemList` (a product carousel reached from
the side), `WebSite`+`SearchAction` (no search). No `sku`/`gtin` — `produto.md`
refused synthetic ids and this is where inventing one would have paid off.
Recorded so it is not "fixed": **without `offers` the node is ineligible for
merchant rich results, and that is the decision.**

**OG is the photograph contained in a 1200×630 `--kozo` field, never cropped** —
the treatment `imagens.md` already uses for the cart's 96px and checkout's 64px
squares, applied to the one frame whose proportion the store does not control.
An authored 1.91:1 crop is the single composition the imagery system cannot
produce, and it would cut the cast shadow `marca.md` §7 makes part of the frame.
No text baked into the card. Two consequences: `og:type` is **never `product`**
(it expects `og:price:amount`, the refused claim), and the institutional pages
get **no card and no fallback wordmark** — manufacturing one re-adds the
photography they refused, one layer down.

**Indexing.** `noindex, follow` on the cart, checkout, `/pedido-confirmado`, the
404, and any URL carrying filter or sort state, canonical to the clean path.
**`pagina` is the sole indexable query param** — numbered pagination of 12 means
pages 2+ hold pieces that exist at no other URL. `robots.txt` therefore never
uses a `?` wildcard, which would take pagination with it.

**404 vs. empty result** resolved as a distinction the metadata layer must never
let swap: the URL not existing (`404`) vs. state matching nothing (`200`). A 200
on an unenumerated pair is the soft-404 that "enumerated, not generated" exists
to prevent; a 404 on an empty filter makes legitimate state look broken. The
*shape* of both surfaces stays with
[Error, 404 & loading surfaces](016-error-surfaces.md) — §7 hands it a contract,
not a design.

**New constraint on the legal-copy verification pass**: each `/politicas/[slug]`
document's first sentence must be self-contained, because it ships as that page's
description. A writing constraint, not a `Politica.resumo` field.

Grilled with the user on the three forks: structured data (facts yes, offers no),
title voice (bare name), and the OG frame (contained in a field).
