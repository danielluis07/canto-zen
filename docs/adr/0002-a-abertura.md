# 2. The home opens on a room, and pays for it with a `/produtos` link

Date: 2026-08-24

## Status

Accepted.

## Context

`home.md` §1 gave the home a hero that is **a single piece**: one photograph in
the piece's own proportion, its name in Mincho, its à-vista price, its Pix badge
and one régua. The section's argument is explicit — it establishes the régua, the
photography rule and the fact that this store shows price, all at once, so that
every other page can assume those things have been said.

That argument is sound and nothing here disputes it. What the section cannot do
is establish a **register**: one object against plaster says nothing about a
home, and a visitor arriving cold meets a piece before meeting a store.

Two constraints shaped the decision.

**`imagens.md` §10.2 forbids the aesthetic argument.** *"A placeholder is never
evidence. No layout, crop, ratio, section or composition decision may be made
because a placeholder looked right or looked wrong."* So "the current hero looks
wrong" is not available as a reason and was not used as one. The reason is
structural: the page had no opening register.

**`navbar.md` §5 and `home.md` §7 had both refused `/produtos`**, each time with
the same stated reason — not to weaken the ambientes, which are the store's
merchandising spine and §2's whole job.

## Decision

Insert **§0.5, the Abertura**: a full-width `21:9` room photograph, contained and
uncropped, carrying one Mincho line and one CTA. `PecaEmDestaque` is kept and
becomes §1 in position as well as in number — it loses the slot, not the job.

The CTA is `VER TODAS AS PEÇAS → /produtos`.

**This reopens both refusals, and it is the expensive half of this ADR.** A
standing route to the full catalogue, above the fold, on the one page whose
purpose is to make navigation by ambiente feel inevitable, is a stronger version
of exactly what `home.md` §7 refused at the *bottom* of the same page.

The alternative was an Abertura with **no CTA** — image and line only, with §2
Ambientes remaining the first offer on the page. That option costs nothing
already decided and was recommended. It was not chosen: a hero banner without an
affordance is unusual enough in e-commerce that the section would read as
decoration, and the store's own position is that it does not decorate.

## Consequences

**The ambientes are weakened, and the mitigation is placement, not argument.**
§2 follows immediately: the catalogue is offered once, the rooms are offered
next, and nothing else on the page routes to `/produtos`. Whether that is enough
is not knowable from the specs — it is the kind of claim that needs traffic
behind it. If the ambientes underperform, this CTA is the first thing to remove,
and removing it costs one `<Link>`.

**The bar is untouched.** `navbar.md` §5's refusal was narrowed, not overturned:
a link on one page and a permanent slot on all 15 routes are different amounts of
the same thing. The bar still has no `/produtos` item at any breakpoint.

**`home.md` §7's refusal was split.** It was two claims in one sentence — *the
page does not end by re-offering navigation*, and *the store offers no standing
route to `/produtos`*. The first stands untouched and the test still asserts it;
only the second was withdrawn.

**A fifth ratio exists.** `21:9`, reserved to this slot the way `16:9` is
reserved to `Artigo.thumb`, and deliberately kept out of `Proporcao`: no piece is
2.33:1, and a Produto's frame is derived from its measurements. Cropping the
photograph into the existing `3:2` was refused because it would have spent
`imagens.md` §4's contain-fit rule — the store's truth-telling rule about images
— to avoid one table row.

**The régua budget is unchanged at two.** The Abertura carries none, which makes
it the sixth *ausência autorada*.

**The `h1` moved.** The Abertura's line is the page's heading; the piece's name
became an `h2`, which is what it structurally always was and was only an `h1`
because it happened to be first.

**One local image now exists** in a store whose every other `src` is a phase-1
Unsplash URL. `imagens.md` §10.4 has phase 2 rewriting all of them to local paths
in one pass; this file arrives ahead of that pass rather than outside it.

**The photograph carries constraints the token set cannot relax.** Text sits on
its flat left third with no scrim, because `marca.md` §6 permits no shadow and
there is no scrim token. Any replacement image must hold an equivalent flat
region — that is a constraint on future images, and it is the sort of thing that
gets forgotten, which is why it is written in `home.md` §0.5 as well as here.
