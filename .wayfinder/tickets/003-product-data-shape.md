---
title: Product data shape
parent: map
labels: [wayfinder:grilling]
assignee:
blocked-by: []
status: open
---

## Question

What fields does a Canto Zen product have?

The fake data model that the listing, detail page, and cart all read from: identity and slug, room and type, price and any parcelamento/discount fields, dimensions and materials, colour/finish variants, image set, stock/availability signalling, delivery-time hints, ratings. Also: what a "variant" is here, and whether variants are separate products or options on one.

This is domain modelling — sharpen the vocabulary in CONTEXT.md as it settles.

Output: the product shape, plus the related shapes it drags in (room, category, collection).
