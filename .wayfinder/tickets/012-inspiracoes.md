---
title: Inspiracoes sections
parent: map
labels: [wayfinder:grilling]
assignee: danielluis07
blocked-by: [002-brand-direction, 008-catalog]
status: closed
---

## Question

What does the editorial surface contain — index and article?

The index: how articles are presented, whether they are filtered by room, and how much of the page is editorial vs. navigational. The article: its content blocks, how products are woven into a room story and linked back to the catalogue, and what closes the page.

This surface is where the brand earns its identity, so it should not read as a blog template.

Output: `docs/spec/inspiracoes.md`.

## Resolution

Spec: [`docs/spec/inspiracoes.md`](../../docs/spec/inspiracoes.md).

**One genre, and the set is closed.** An `Artigo` is *a room, composed* — one
space, photographed with several pieces in it, described — and there are exactly
**four, one per Ambiente**. No designer profile, no material essay, no journal.
Single-genre is the whole defence against the blog template (a blog has
categories; this has one recurring act), it spends `marca.md` §7's photographic
exception exactly where it was granted, and a set complete by construction reads
as authored where a feed stopping at four reads as abandoned. A designer story
had nowhere to live anyway — `Familia.designer` is already on every PDP — and a
material story is `Material.cuidados`, derived.

**The two refusals, which are the surface's identity claim.** Inspirações is the
only surface in the store with **no price** and **no régua** — the two things
every other surface asserts. Price: a piece is a name and a link, the figure is
one click away on its PDP where every `br-ecommerce-conventions.md` obligation is
met, so the reader is never sold to inside the story. Régua: the second authored
absence after [Cart sections](010-cart.md), refused because every candidate figure
is bad — the room's dimensions are architecture the store has no data for (the
fifth refusal of a fabricated artefact), a cota on one piece inside a group shot
is arbitrary since `marca.md` §2 scopes the gesture to *a featured piece*, and
`4 ARTIGOS` annotates a number obtained by looking.

**The legend is how editorial reaches commerce.** Beneath each photograph, a line
in the annotation voice naming the pieces in that frame, each a link to
`/produtos/[slug]` — `POLTRONA LINA · MESA BAIXA IPÊ · LUMINÁRIA CORDA`. Chosen
because it is already the house language: labelling a real thing with a true fact
is what the régua does, and the legend does it in words, spending no régua.
Hotspots were **structurally unavailable** — numbered markers are banned by
`marca.md` §2's corollary, and unnumbered ones are a reveal that a motion spec of
"120ms colour transition and nothing else" has no vocabulary to describe. A
"peças neste ambiente" card strip was refused for importing `catalogo.md`'s card
and dragging price back onto the surface. Links resolve to a `Produto`, never a
`Familia`, so the acabamento actually photographed is the one the reader lands on.

**Photography: the exception is suspended for "the piece alone" and nothing
else** — no person, and no prop implying one just left (no cup, no open book, no
plants). Binding, not stylistic: `pagina-produto.md` §4.1 refused a human figure
for scale *citing this rule as admitting no exception outside Inspirações*, so
admitting people here would retroactively reopen a settled decision.

**Index:** four uniform hairline-separated rows — `home.md` §6's row at page
scale, so the home is a literal excerpt rather than a second design of the same
object — under a short Mincho + Body header, and the page then ends. A card grid
was refused (`catalogo.md` owns that card; a grid of article cards is the surface
reading as a listing), and lead-plus-rows was refused as hierarchy by recency,
which needs a "newest" the ordinal ban already removed from the system.

**Article:** fixed skeleton, **exactly three photographs** (one ampla, two
detalhe) and two passagens — variable length would reopen the determinism
`pagina-produto.md` §7 bought by making image `papel` an instruction of position,
and it holds the imagery debt at twelve room shots rather than twenty-four. The
fecho is **one link to the room listing** (`VER TODAS AS PEÇAS EM SALA` → `/sala`),
the same shape as the PDP's refusal of *quem viu também viu*; next-article was
refused for implying a sequence, a recap for restating the legends, and nothing
at all because ending the scroll is the home's argument, not an article's.

**Two housekeeping resolutions.** `?ambiente=` is **retired unused**, the second
reservation to go that way after `?q=` — a filter over four rows each already
annotated with its room computes what the reader has on screen. And the map's
outstanding *empty Inspirações index* **resolves by impossibility**: the four
articles are structural content, not data that can be absent, so no empty state
exists on either route. That closes the last open item under *Empty states*.

**Data:** new `Artigo` + `FotoArtigo` entities, tuple-typed to make the fixed
skeleton enforceable; `ambiente` required and unique, contrary to the optionality
`home.md` anticipated. No date, author, tags, category, free body, or
`produtosRelacionados`. **No existing entity changes** — purely additive.

**Amended in place:** `rotas.md` (`?ambiente=` retired, index row note),
`home.md` §6 (the entity now exists; `ambiente` required; three of four),
`CONTEXT.md` (**Artigo** and **Legenda** added to the glossary).
