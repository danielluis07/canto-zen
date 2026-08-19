---
title: Error, 404 & loading surfaces
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: [001-route-inventory, 002-brand-direction]
status: closed
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

---

## Resolution

Spec written to [`docs/spec/erros.md`](../../docs/spec/erros.md). Resolved in
conversation across two grilling rounds; no prototype — the contested questions were
register and contract questions, not layout ones.

**404.** One page, one copy, plain text lane (the policy template's), full navbar and
full footer. No photograph and no régua — both refused as *ausências autoradas*, on
the ground that a photograph forces the page to pick a piece and the régua is
reverence for an object that is not present. The copy explains the store's design
rather than reporting a failure: *Não há nada neste endereço. / O catálogo é
enumerado: cada ambiente e cada tipo têm um endereço próprio. Este não é um deles.*
The recovery block is the only thing that varies — a valid first segment offers that
room's real tipos, anything else offers the four ambientes. Nothing is generated; both
variants read the route table. There is no search anywhere, so the offer is a list.

**Status turned out to be load-bearing.** Next 16 returns `200` from `not-found.tsx`
whenever the response streams, which would break the no-soft-404 contract
[Route metadata & SEO](015-route-metadata.md) fixed. It holds under four rules the
spec states as contract: a single root `app/not-found.tsx`, **no `loading.tsx`
anywhere**, `notFound()` before any suspending `await`, and experimental
`globalNotFound` left off — it bypasses the root layout and would strip the footer's
legally required identification.

**500.** Same lane, full chrome, `TENTAR NOVAMENTE` + `IR PARA O INÍCIO`; the fault is
named as the store's without apology, and no stack trace or error code is ever shown.
`global-error.tsx` is specified to assume nothing — its own `<html>`/`<body>`, no data
reads, text wordmark, no footer, system-font fallback accepted.

**Loading.** *Conteúdo velho*: the region being replaced persists at reduced contrast;
nothing is ever swapped for a placeholder of its own shape. A 120ms opacity ramp to
`0.45` after a 120ms delay, chrome never dimmed, `useLinkStatus().pending` as the
trigger, `aria-busy` plus a hidden `role="status"`, and under reduced motion the dim
still applies but arrives as a cut. This **widens `marca.md` §9 by exactly one entry**
and says so out loud, rather than reading "colour transition" loosely enough to cover
opacity — handed to [Motion](017-motion.md) as settled, not re-openable.

**Scope grew by one branch.** [Checkout](011-checkout.md) had handed this ticket the
generalisation of the inline field error ("three instances is enough to generalise
into a rule"), and the three instances disagreed. Absorbed and resolved: Corpo S
`--ink` beneath the field, border `--hairline` → `--ink` still 1px, no icon, no
colour, no `!`; split into **corrigível** (states the fix) and **fato** (states the
limit plus the way on); `aria-invalid` / `aria-describedby` / `role="alert"`, focus to
the first invalid field, and no error summary block.
[Product detail](009-product-detail.md) §5 is **corrected** in place — its
annotation-voice error becomes Corpo S.

Out of scope, confirmed unchanged: zero filter results ([Catalogue](008-catalog.md)
§8), empty cart, per-image failure ([Imagery](014-imagery.md) §6), and the checkout
confirmation interstitial.

`CONTEXT.md` gains an **Estados** section (*corrigível*, *fato*, *conteúdo velho*);
*ausência autorada* goes from three to five.
