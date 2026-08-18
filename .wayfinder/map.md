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
  - Catalog is **room-primary, type-as-filter** (Sala, Quarto, Cozinha, Escritório, Varanda).
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

## Not yet specified

- **Self-service cancellation / returns path.** Decreto 7.962 art. 5º requires cancelling "pela mesma ferramenta" used to buy. With no auth in scope, what that surface even is for a concept store is unclear — revisit once Institutional pages and Footer are settled.
- **Legal-copy verification.** Statutory text in the research came from a mirror, not planalto.gov.br. Any ticket that writes user-facing legal copy should cross-check first.
- **404 / error / loading surfaces.** Certainly needed; their shape depends on the brand direction and on whether search exists.
- **Search.** Whether the navbar carries search at all is part of the navbar ticket; if it does, a results surface needs its own spec.
- **Empty states.** Empty cart, zero filter results, no articles. Coarser than one ticket; may graduate into several or fold into the page specs.
- **Motion & transition conventions.** Page transitions, hover behaviour, scroll reveals. Waits on brand direction to know how loud the design is.
- **Accessibility commitments.** What level the spec asserts, and which sections carry specific obligations.
- **SEO / metadata per route.** Titles, descriptions, structured data. Waits on the route inventory.

## Out of scope

<!-- ruled beyond the destination; never graduates -->
- Auth, account, order history, wishlist — a lot of low-signal forms for a concept store.
- Real payment processing, gateway integration, or order persistence.
- Backend, CMS, or database integration of any kind. Data shapes are specified; sources are not.
- i18n / an English locale. pt-BR only.
- Dark mode.
