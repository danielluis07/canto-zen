---
title: Error, 404 & loading surfaces
parent: map
labels: [wayfinder:grilling]
assignee:
blocked-by: [001-route-inventory, 002-brand-direction]
status: open
---

## Question

What do the non-happy-path surfaces look like and say?

Graduated from fog once [Brand direction](002-brand-direction.md) settled — the shape
was waiting on knowing how loud the design is. Now load-bearing rather than an edge
case, because [Route inventory & URL structure](001-route-inventory.md) enumerates the
valid room × type pairs and 404s everything else, so a shopper trimming a URL hits 404
on a plausible-looking path.

Covers:

- **404.** Copy, what it offers instead (rooms? the piece they probably meant?), and
  whether a mistyped `/sala/mesas` gets a different, smarter response than a random
  path. This is the one that actually gets hit.
- **500 / unexpected error.** What the concept store admits to and in what voice.
- **Loading.** Whether skeletons exist at all given a design with no UI shadow, zero
  radius and a raking-light photographic treatment — a shimmering grey skeleton would
  contradict the identity. Decide the loading language, not just its presence.

Constraints already fixed: errors do not apologise and are never vague; an empty
screen is an invitation to act; the sole accent is índigo and there is no red/green
semaphore, so error state resolves in ink, índigo and typographic weight.

Out of this ticket: empty cart, zero-filter-results and no-articles states, which are
still fog and may fold into the page specs instead.

Output: a section of `docs/spec/` covering each surface — purpose, layout shape,
pt-BR copy direction, data needs.
