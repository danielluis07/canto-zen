---
title: Canto Zen — page & section spec
labels: [wayfinder:map]
status: open
---

# Canto Zen — page & section spec

## Destination

A written page-and-section spec for the whole Canto Zen storefront: every route, its sections in order, and for each section its purpose, rough layout shape, pt-BR copy direction, and the data it needs — navbar and footer included. Done when a build session can implement any page without inventing anything.

## Notes

- **Domain**: fictional Brazilian home-furniture e-commerce. UI/UX only — no backend, no real payment.
- **Settled before charting**:
  - Destination is a **spec**, not built pages. Building is a separate effort.
  - Scope is **browse + cart + checkout**. No auth/account/orders/wishlist.
  - Copy is **pt-BR**. `app/layout.tsx` currently hardcodes `lang="en"` — the spec supersedes it.
  - **Brand direction is in scope** as an early ticket (mood/palette/type/density), not a full brand kit.
  - Catalog is **room-primary, type-as-filter** (Sala, Quarto, Cozinha, Escritório). *Varanda was dropped while resolving the route inventory — four rooms, not five.*
  - Non-commerce surfaces: **editorial** — Inspirações, plus Sobre/Contato and a single shared policy template.
  - Checkout is **single-page**, accordion sections + sticky order summary.
  - **No dark mode.** One warm light identity.
  - **No payment.** The pay action surfaces a clear "this is a concept" disclosure.
  - Spec resolution: purpose + layout shape + copy direction + data needs per section. Contested layouts become `prototype` tickets rather than inflating every entry.
- **Skills every session should consult**: `/grilling`, `/domain-modeling`. Add `/frontend-design` for anything visual, `/prototype` for prototype tickets.
- **Spec output lives in** `docs/spec/`, one file per page. Ticket resolutions point at it.

## Decisions so far

<!-- one line per closed ticket -->

- [Brazilian e-commerce UX conventions](tickets/004-br-ecommerce-conventions.md) — frete is quoted per-CEP on the *product* page as a list of options; every price shows both an à-vista and a financed total (`{N}x de R$ {v} sem juros`); Pix-first payment with a legally-required discount badge; checkout runs Identificação → Entrega → Pagamento with CPF and CEP-autofill; footer must carry razão social + CNPJ + address and an ostensive 7-day arrependimento notice; furniture adds montagem-as-add-on, bulky-item access disclosure, and L × P × A dimensions. Full detail and citations in [`docs/research/br-ecommerce-conventions.md`](../docs/research/br-ecommerce-conventions.md).

- [Route inventory & URL structure](tickets/001-route-inventory.md) — rooms are top-level (`/sala`, `/quarto`, `/cozinha`, `/escritorio` — **Varanda dropped**, four rooms); products are flat at `/produtos/[slug]`; type is a path segment (`/sala/sofas`) with every other facet as pt-BR query state, room × type pairs enumerated per room and 404 otherwise; `/produtos`, `/colecoes/[slug]`, `/inspiracoes/[slug]`, `/carrinho`, `/checkout`, `/pedido-confirmado`, `/sobre`, `/contato`, `/politicas/[slug]` × 4. Breadcrumbs read a product's primary room, which hands a field to [Product data shape](tickets/003-product-data-shape.md). Full table in [`docs/spec/rotas.md`](../docs/spec/rotas.md).

- [Brand direction](tickets/002-brand-direction.md) — **high-end atelier in japandi register, quiet with one bold move**, and that move is *a régua*: a hairline rule with end ticks carrying a real cm figure along every featured piece, chosen because the cota is ornament and data at once. Palette is ink/reboco/kozo/carvalho/fio with **índigo `#223244` as the sole accent** — terracotta and `#F4F1EA` creams ruled out as the category default; type is **Zen Old Mincho** (display only) + **Schibsted Grotesk** (body, UI, tabular figures); zero radius, no UI shadow, 1px hairlines, and the only curve or shadow in the identity lives inside the photograph, which is always raking late-afternoon light on raw plaster with the piece alone. Atelier vs. the commerce realism in [Brazilian e-commerce UX conventions](tickets/004-br-ecommerce-conventions.md) resolved as **voice, not presence** — every price, parcelamento and Pix badge stays, set in the annotation voice rather than shouted; no "sob consulta". Full direction in [`docs/spec/marca.md`](../docs/spec/marca.md); three compared directions captured on branch `prototype/brand-direction`.

- [Product data shape](tickets/003-product-data-shape.md) — **a variant is not a thing**: one product record per *acabamento* (`poltrona-lina-linho-cru` and `poltrona-lina-boucle-carvalho` are two products), sharing a thin routeless `familia` entity that only names the PDP's "outros acabamentos" strip — the sole reading consistent with the slug already fixed by [Route inventory & URL structure](tickets/001-route-inventory.md). Products store **physical facts plus one authored `precoTabela`**; à-vista price, Pix badge, parcelamento, montagem price, garantia and the CEP-quoted frete are all **derived** from a store-wide `politicas` object and a mock cubed-freight rule. `nome` stays clean — the headline cm lives in the **régua**, and images carry `cotas[]` reading `medidas`, which makes the "no empty régua" prohibition enforceable in the type. Medidas are a mandatory L × P × A trio plus an open extras list, with `embalagem` separate; `disponibilidade` is a three-state enum, never a stock count; taxonomy is **entities** (`Ambiente` holding its curated `tipos[]`, `Tipo`, `Cor`, `Material`, `Colecao`, `Familia`) keyed by slug. **No ratings, no synthetic ids, no short-description field.** Full shape in [`docs/spec/produto.md`](../docs/spec/produto.md); vocabulary in [`CONTEXT.md`](../CONTEXT.md).

## Not yet specified

- **Self-service cancellation / returns path.** Decreto 7.962 art. 5º requires cancelling "pela mesma ferramenta" used to buy. With no auth in scope, what that surface even is for a concept store is unclear — revisit once Institutional pages and Footer are settled.
- **Legal-copy verification.** Statutory text in the research came from a mirror, not planalto.gov.br. Any ticket that writes user-facing legal copy should cross-check first.
- **Search.** Whether the navbar carries search at all is the navbar ticket's call. The route question is settled — results land on `/produtos?q=`, not a separate route — but if search exists, the results *surface* (empty state, query echo, relevance signalling) still needs a spec.
- **Empty states.** Empty cart, zero filter results, no articles. Coarser than one ticket; may graduate into several or fold into the page specs.
- **Catalogue seed data.** The product *shape* is settled, but not the sample set the spec assumes — how many pieces per tipo, whether the spec fixes named example products (and their copy) or leaves the build session to invent them. Bears on every listing's grid density and on whether "esgotado" and "sob-encomenda" states are actually exercised. Likely fold into the catalogue and product-detail tickets rather than its own.
- **Accessibility commitments.** What level the spec asserts, and which sections carry specific obligations. Brand direction fixed a visible índigo focus ring and honoured `prefers-reduced-motion`, but not the commitment level.

## Out of scope

<!-- ruled beyond the destination; never graduates -->
- Auth, account, order history, wishlist — a lot of low-signal forms for a concept store.
- Real payment processing, gateway integration, or order persistence.
- Backend, CMS, or database integration of any kind. Data shapes are specified; sources are not.
- i18n / an English locale. pt-BR only.
- Dark mode.
