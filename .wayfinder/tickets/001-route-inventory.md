---
title: Route inventory & URL structure
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: []
status: closed
---

## Question

What is the definitive list of routes for the storefront, and what pt-BR path does each one live at?

Covers: the room landing routes vs. a combined catalogue route, whether product URLs are flat (`/produtos/[slug]`) or nested under room, how filters are expressed (path segment vs. query string), where Inspiracoes articles live, and the paths for the institutional pages. Room-primary/type-as-filter is already settled — this ticket turns that into concrete URLs.

Output: the route table that every page ticket, the navbar, and the footer build against.

## Resolution

Full route table, type taxonomy, query-param vocabulary, slug rules and reserved
segments: [`docs/spec/rotas.md`](../../docs/spec/rotas.md).

The load-bearing decisions:

- **ASCII-folded paths, accented copy.** `/escritorio`, "Escritório". One canonical
  spelling per route.
- **pt-BR throughout, query keys included** — `cor`, `material`, `preco`, `ordem`,
  `pagina`, `ambiente`. An English query string on pt-BR paths reads as a translated
  template.
- **Rooms are top-level**: `/sala`, `/quarto`, `/cozinha`, `/escritorio`. **Varanda
  was dropped** — outdoor furniture is not this store's merchandising spine, and a
  fifth room thins the other four. This supersedes the five-room list in the map's
  Notes, which has been corrected. Dining is a *type* under `sala`, not a fifth room.
- **Products are flat**: `/produtos/[slug]`, one URL per product regardless of entry
  path. Nesting under a room forces a fake single parent for items that legitimately
  live in two.
- **Type is a path segment, everything else is query state**: `/sala/sofas?cor=cru`.
  Type deserves a landable, indexable page the navbar and footer can point at; the
  rest is resettable state. Hard cap — no `/sala/sofas/cru`.
- **Room × type pairs are enumerated per room, 404 otherwise.** Generated
  combinations produce indexable empty pages that make the store look broken.
  Type slugs stay global; which types a room exposes is curated.
- **Product slug is `{nome}-{material}`** — `poltrona-lina-linho-cru`. Readable
  enough to survive being pasted into WhatsApp, which is how furniture links
  actually get shared here.
- **Breadcrumbs read the product's primary room**, never the arrival path.
- **Cross-cutting browse**: `/produtos` (all products, `?ambiente=` filter) and
  `/colecoes/[slug]`. No `/novidades` or `/promocoes` — those are sorts and badges,
  not places.
- **`/carrinho`, `/checkout`, `/pedido-confirmado`** — the confirmation route is
  where the "this is a concept, nothing was charged" disclosure lands.
- **`/sobre`, `/contato`, `/politicas/[slug]`** with four policies:
  `trocas-e-devolucoes`, `entrega-e-frete`, `privacidade`, `termos-de-uso`.

### Constraints handed onward

- **[003 — Product data shape](003-product-data-shape.md)**: flat product URLs mean
  the breadcrumb has no path to read, so a product needs `ambientePrincipal`
  (single, drives the breadcrumb) *and* `ambientes[]` (every room it lists under).
- **[005 — Navbar](005-navbar.md)**: the type taxonomy table is what a mega-menu
  renders. If search exists, results land on `/produtos?q=` — no separate route.
- **[006 — Footer](006-footer.md)**: the policy column renders from the four-slug
  list; rooms and the reserved segments are the rest of the link inventory.
- **[008 — Catalog](008-catalog.md)**: `pagina` is reserved either way, but whether
  pagination is pages or infinite scroll is still that ticket's call.
