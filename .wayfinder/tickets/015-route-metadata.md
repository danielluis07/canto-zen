---
title: Route metadata & SEO
parent: map
labels: [wayfinder:grilling]
assignee:
blocked-by: [002-brand-direction]
status: open
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
