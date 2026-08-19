# Rotas — inventário de URLs

Canonical route table for the Canto Zen storefront. Every page ticket, the navbar,
and the footer build against this file. Resolved by
[ticket 001 — Route inventory & URL structure](../../.wayfinder/tickets/001-route-inventory.md).

## Conventions

These hold for every route below.

1. **Paths are ASCII-folded; copy keeps its accents.** `/escritorio` in the URL,
   "Escritório" on the page. One canonical spelling per route — no accented alias.
2. **Paths are pt-BR**, and so are query keys. No English seams
   (`?cor=`, never `?color=`).
3. **Rooms are top-level.** They are the store's spine, so they get the shortest
   paths. The top-level namespace is therefore reserved — see [Reserved segments](#reserved-segments).
4. **A product has exactly one URL**, independent of the room it was reached through.
5. **Type is a path segment; every other facet is query state.** Type routes are
   landable, linkable, indexable pages. Colour, material, price, sort and page are
   resettable state that never multiplies the URL space.
6. **Enumerated, not generated.** Valid room × type pairs are declared. Anything
   else is a 404, not an empty listing.

## Route table

| Path | Surface | Spec | Notes |
| --- | --- | --- | --- |
| `/` | Home | `home.md` | |
| `/sala` | Room landing | `catalogo.md` | |
| `/quarto` | Room landing | `catalogo.md` | |
| `/cozinha` | Room landing | `catalogo.md` | |
| `/escritorio` | Room landing | `catalogo.md` | |
| `/[ambiente]/[tipo]` | Type listing | `catalogo.md` | Enumerated pairs only — see [Type taxonomy](#type-taxonomy) |
| `/produtos` | All-products listing | `catalogo.md` | Same listing, no room scope. Accepts `?ambiente=` |
| `/produtos/[slug]` | Product detail | `produto.md` | |
| `/colecoes/[slug]` | Collection listing | `catalogo.md` | No index page — see [Deliberate omissions](#deliberate-omissions) |
| `/inspiracoes` | Editorial index | `inspiracoes.md` | Four articles, one per ambiente |
| `/inspiracoes/[slug]` | Article | `inspiracoes.md` | |
| `/carrinho` | Cart | `carrinho.md` | |
| `/checkout` | Checkout | `checkout.md` | Single page, accordion sections |
| `/pedido-confirmado` | Order confirmation | `checkout.md` | Carries the "concept store, nothing was charged" disclosure |
| `/sobre` | Brand story | `institucional.md` | Label reads "Sobre nós"; the path is a slug, not a sentence |
| `/contato` | Contact | `institucional.md` | Accepts `?assunto=arrependimento` — the store's statutory withdrawal tool, see `institucional.md` §9 |
| `/politicas/[slug]` | Policy | `institucional.md` | One shared template — see [Policies](#policies) |

## Rooms

Four rooms. Varanda was considered and dropped: outdoor furniture is not the
merchandising spine of this store, and a fifth room thins every other one.

| Slug | Label |
| --- | --- |
| `sala` | Sala |
| `quarto` | Quarto |
| `cozinha` | Cozinha |
| `escritorio` | Escritório |

Dining is a **type** under `sala` (`mesas-de-jantar`), not a fifth room, so it
does not fragment the spine.

## Type taxonomy

Type slugs are **global** — `sofas` means the same thing wherever it appears, and
a product carries exactly one type. Which types a room *exposes* is curated per
room. The navbar mega-menu reads directly off this table.

| Room | Types |
| --- | --- |
| `sala` | `sofas`, `poltronas`, `mesas-de-centro`, `mesas-de-jantar`, `racks-e-estantes`, `aparadores` |
| `quarto` | `camas`, `cabeceiras`, `criados-mudos`, `comodas`, `guarda-roupas` |
| `cozinha` | `mesas`, `cadeiras`, `banquetas`, `armarios`, `carrinhos-e-apoios` |
| `escritorio` | `escrivaninhas`, `cadeiras-de-trabalho`, `estantes`, `luminarias-de-mesa` |

`/cozinha/sofas` is a **404**, not an empty grid.

## Query parameters

Canonical keys. A surface ignores any key it does not support rather than erroring.

| Key | Applies to | Shape | Example |
| --- | --- | --- | --- |
| `cor` | listings | slug, repeatable | `?cor=cru` |
| `material` | listings | slug, repeatable | `?material=linho` |
| `preco` | listings | `min-max`, BRL integers | `?preco=2000-5000` |
| `ordem` | listings | sort token | `?ordem=menor-preco` |
| `pagina` | listings | integer, 1-based, omitted for page 1 | `?pagina=2` |
| `ambiente` | `/produtos` | room slug | `?ambiente=quarto` |

Room routes take their room from the path and ignore `ambiente`. `/produtos`
needs it because it has no room in its path.

`/inspiracoes` originally reserved `ambiente` too. [`inspiracoes.md`](inspiracoes.md)
§7.1 **retired it unused**, the second reservation to go that way after `?q=`: the
index holds exactly four articles, one per ambiente, each row already annotated
with its room, so the filter would compute what the reader already has on screen.

Whether pagination is pages or infinite scroll is **ticket 008's** call; `pagina`
is reserved either way.

## Product slugs

`{nome}-{material-ou-acabamento}` — e.g. `poltrona-lina-linho-cru`,
`mesa-jatoba-madeira-macica`.

Name alone collides across the variants the catalogue will carry; dimensions baked
into the slug (the Etna pattern documented in the
[BR e-commerce research](../research/br-ecommerce-conventions.md)) turn the URL
into a spec sheet. This store has no legacy URLs to preserve, so it takes the
readable option — these links get pasted into WhatsApp.

## Breadcrumbs

Product URLs are flat, so the breadcrumb cannot be derived from the path. It reads
the product's **primary room**:

```
Início / {ambientePrincipal.label} / {tipo.label} / {produto.nome}
```

Always the primary room — never the room the visitor arrived through. Deterministic,
server-renderable, and identical for every visitor and for the crawler; the
alternative needs navigation state defined for every entry point.

**Constraint handed to [ticket 003 — Product data shape](../../.wayfinder/tickets/003-product-data-shape.md):**
a product carries `ambientePrincipal` (single, drives the breadcrumb) *and*
`ambientes[]` (the full set it lists under). A bench belongs to Quarto and Sala;
only one of them is its breadcrumb.

## Policies

`/politicas/[slug]`, one shared template, four pages:

| Slug | Page | Why it exists |
| --- | --- | --- |
| `trocas-e-devolucoes` | Trocas e devoluções | CDC art. 49 — the 7-day arrependimento notice must be ostensive |
| `entrega-e-frete` | Entrega e frete | Per-CEP quoting, montagem, bulky-item access. Absorbs any payment/montagem detail rather than spawning its own page |
| `privacidade` | Privacidade | LGPD |
| `termos-de-uso` | Termos de uso | Checkout references terms; they need somewhere to land |

The prefix keeps the top-level namespace clear for rooms and lets the footer render
the policy column from one list.

> Statutory copy on these pages must be cross-checked against planalto.gov.br —
> the research cited a mirror. See the map's *Not yet specified*.

## Reserved segments

Rooms live at the top level, so these first-level segments are taken and no room
or collection may claim them:

`produtos`, `colecoes`, `inspiracoes`, `carrinho`, `checkout`,
`pedido-confirmado`, `sobre`, `contato`, `politicas`

## Deliberate omissions

Considered and ruled out — recorded so they are not relitigated:

- **`/novidades`, `/promocoes`** — sorts and badges on the existing listing, not
  places. A concept store with no real inventory cannot sustain them as destinations.
- **`/colecoes` index** — thin page needing its own spec and its own navbar slot.
  Collections are a merchandising device, surfaced in context on the home page and
  inside Inspirações. The path stays reserved.
- **Faceted paths beyond type** (`/sala/sofas/cru`) — combinatorial URL space,
  no traffic to justify it.
- **`/finalizar-compra`** — a button label, not a place. The URL says `/checkout`,
  which is the established term in BR e-commerce.
- **`?q=` and the results surface** — reserved by this table, **never used**.
  [`navbar.md`](navbar.md) §12 refused search: ~20 curated listing pages,
  room-primary navigation as *the* path, and no real corpus that would make
  relevance meaningful. Search and its results page left the map as out of scope.

## Metadata

Resolved by [ticket 015 — Route metadata & SEO](../../.wayfinder/tickets/015-route-metadata.md).
The copy and schema layer over the route table above. Every route in the table has
an entry here.

### 0. Three rules

Everything below follows from these.

1. **The title states the name. The description states the facts.** No route title
   carries a figure, a category gloss or a selling line — not even the cm the
   régua exists to carry. [`marca.md`](marca.md) §2 scopes the gesture to *a
   featured piece that is photographed*; a `<title>` is neither, and a cota
   rendered as ASCII in a SERP is the gesture without its hairline, which is
   ornament. The title is the quietest surface in the store.
2. **A description is derived, or it is an authored line the data already holds.
   It is never written for the metadata layer.** This spec adds **no fields** —
   the second in the map to add none, after [`imagens.md`](imagens.md). Where an
   authored sentence already exists (`Ambiente.descricao`, `Colecao.descricao`,
   `Artigo.resumo`, `/sobre`'s statements), it *is* the description. Everywhere
   else the description is computed from facts already in the record. Where there
   is neither, the surface carries no description at all — see §3.
3. **A claim that leaves the site is held to a stricter standard than a claim made
   on the page.** This is [`rodape.md`](rodape.md)'s argument for excluding
   Reclame Aqui, Ebit and PCI selos — credentials of a real CNPJ — generalised.
   On-page, the concept-store frame travels with the reader and the admission is
   staged where [`checkout.md`](checkout.md) put it. In a third party's index the
   frame does not travel: whatever is emitted there is read as a live commercial
   claim by a machine that will never see `Nada foi cobrado.` §6 is this rule
   applied to structured data.

### 1. Title templates

Suffix ` | Canto Zen` on every route but the home, where appending the brand to
the brand stutters.

| Route family | Template | Example |
| --- | --- | --- |
| `/` | `Canto Zen` | `Canto Zen` |
| Room landing | `{ambiente.label}` | `Sala \| Canto Zen` |
| Type listing | `{tipo.label} para {ambiente.label}` (room lowercased) | `Sofás para sala \| Canto Zen` |
| `/produtos` | `Todas as peças` | `Todas as peças \| Canto Zen` |
| Product | `{produto.nome}` | `Poltrona Lina \| Canto Zen` |
| Collection | `{colecao.nome}` | `Coleção Jatobá \| Canto Zen` |
| `/inspiracoes` | `Inspirações` | `Inspirações \| Canto Zen` |
| Article | `{artigo.titulo}` | `Uma sala que não pede desculpas \| Canto Zen` |
| `/carrinho` | `Carrinho` | `Carrinho \| Canto Zen` |
| `/checkout` | `Checkout` | `Checkout \| Canto Zen` |
| `/pedido-confirmado` | `Pedido` | `Pedido \| Canto Zen` |
| `/sobre` | `Sobre nós` | `Sobre nós \| Canto Zen` |
| `/contato` | `Contato` | `Contato \| Canto Zen` |
| `/politicas/[slug]` | `{politica.titulo}` | `Trocas e devoluções \| Canto Zen` |
| 404 | `Página não encontrada` | `Página não encontrada \| Canto Zen` |

Notes that are not free choices:

- **The type-listing template lowercases the room label**, which is a derivation,
  not a field: `Escritório` → `Cadeiras de trabalho para escritório`. No
  preposition table, no `Ambiente.labelPreposicional`.
- **`/inspiracoes` must say the word.** [`inspiracoes.md`](inspiracoes.md) §5.2
  deliberately keeps "Inspirações" out of the page's own cabeçalho because the
  navbar has already said it; the tab is therefore the only place it appears, and
  it is not optional.
- **`/sobre` has a `<title>` although the page has no title.**
  [`institucional.md`](institucional.md) §3 makes the first statement the `<h1>`.
  The document title is not the page title and does not inherit that absence — a
  browser tab reading `Não temos estoque.` is the manifesto leaking into chrome.
- **Pagination appends the page.** `Sofás para sala — página 2 | Canto Zen`. Page
  2+ is indexable (§4) and two indexable URLs may not share a title. Page 1 never
  carries the suffix, since `pagina` is omitted for page 1 (see
  [Query parameters](#query-parameters)).
- **Filters never change the title.** `?cor=cru` changes the canonical, not the
  tab. Filter state is resettable state; enumerating it into titles is the URL
  multiplication the route table already refused.

### 2. Descriptions

| Route family | Source | Shape |
| --- | --- | --- |
| `/` | derived | `Móveis assinados, feitos sob encomenda na nossa marcenaria. {n} peças para sala, quarto, cozinha e escritório.` |
| Room landing | **authored** — `ambiente.descricao` | verbatim, the same sentence the page header shows |
| Type listing | derived | `{tipo.label} para {ambiente.label}: {n} peças assinadas, feitas sob encomenda em madeira maciça.` |
| `/produtos` | derived | `Todo o catálogo Canto Zen: {n} peças para sala, quarto, cozinha e escritório.` |
| Product | derived | `{tipo.label} em {material principal}, assinado por {familia.designer}. L {n} × P {n} × A {n} cm.` |
| Collection | **authored** — `colecao.descricao` | verbatim |
| `/inspiracoes` | **authored** — the cabeçalho's Body line ([`inspiracoes.md`](inspiracoes.md) §5.2) | verbatim |
| Article | **authored** — `artigo.resumo` | verbatim, as [`inspiracoes.md`](inspiracoes.md) anticipated |
| `/sobre` | **authored** — statement 1 plus its first body sentence | `Não temos estoque. Nenhuma peça fica esperando num galpão.` |
| `/contato` | derived from `Loja` | `Showroom em {loja.showroom.endereco}, com visita agendada.` |
| `/politicas/[slug]` | derived — the document's first sentence | see the constraint below |
| `/carrinho`, `/checkout`, `/pedido-confirmado`, 404 | **none** | §3 |

Three consequences worth stating plainly:

- **The product description carries no price.** [`produto.md`](produto.md) refused
  a short-description field, so this line has to be computed — and rule 3 decides
  what it may compute *from*. Physical facts are the store's own domain and true
  regardless of whether anything can be bought; a price in a SERP snippet is a
  commercial claim in a third party's surface, which is the thing §6 refuses in
  machine-readable form. The description and the `Product` node therefore carry
  **the same class of fact**, which is not a coincidence but the same rule applied
  twice. `L {n} × P {n} × A {n} cm` uses the multiplication `×`
  ([`marca.md`](marca.md) §8); `medidas` is mandatory on every produto
  ([`imagens.md`](imagens.md)), so this line can never come out half-formed.
- **`/sobre` is the only description that is finished copy**, because
  [`institucional.md`](institucional.md) §3 is the only spec in the map that
  shipped final wording. Statement 1 alone (`Não temos estoque.`) is a legitimate
  description for a manifesto but reads as truncation in a SERP; the first body
  sentence completes it without a word being written here.
- **Constraint handed to the legal-copy verification pass** (the map's *Not yet
  specified*): each `/politicas/[slug]` document's **first sentence must be a
  self-contained statement of what the document covers**, because it is the
  description. This is a writing constraint, not a `Politica.resumo` field —
  rule 2 holds.

Length: descriptions run 110–160 characters. A derived line that overruns is
**truncated at a sentence boundary, never at a word** — the formulas above are
built to fit, so this is a guard, not a routine step.

### 3. The surfaces with no description

`/carrinho`, `/checkout`, `/pedido-confirmado` and the 404 carry a `<title>` and
nothing else — no description, no `og:image`, no structured data. They are
`noindex` (§4), and a description on a page nobody may index is metadata written
for no reader. This is the fourth *ausência autorada* in the map, after the cart's
régua, Inspirações' price and the institutional pages' photography, and it is the
smallest: the absence is the correct amount of work.

### 4. Canonical and robots

**Indexable, self-canonical:** `/`, the four room landings, every enumerated
`/[ambiente]/[tipo]` pair, `/produtos`, `/produtos/[slug]`, `/colecoes/[slug]`,
`/inspiracoes`, `/inspiracoes/[slug]`, `/sobre`, `/contato`, the four
`/politicas/[slug]`.

**`noindex, follow`:** `/carrinho`, `/checkout`, `/pedido-confirmado`, the 404, and
**any URL carrying filter or sort state**.

| Query state | Indexable | Canonical |
| --- | --- | --- |
| `cor`, `material`, `preco`, `ordem` | no | the clean path, filters stripped |
| `ambiente` on `/produtos` | no | `/produtos` |
| `pagina` | **yes** | itself, with `pagina` intact |

`pagina` is the single exception because [`catalogo.md`](catalogo.md) chose
numbered pagination of 12 over infinite scroll: pages 2+ hold pieces that exist at
no other indexable URL, and canonicalising them away hides part of the catalogue
from itself. Filters hold nothing unique — every filtered result is a subset of a
page already indexed.

Canonicals are **absolute URLs**. No `hreflang` and no alternates: pt-BR only, and
i18n is out of scope on the map.

**`robots.txt`** disallows `/carrinho`, `/checkout` and `/pedido-confirmado` and
nothing else — never a `?` wildcard, which would take the pagination above with it.
**The sitemap** lists exactly the indexable set, with the enumerated room × type
pairs written out; it is generated from the same declaration the router reads, so a
pair cannot be in one and not the other.

### 5. Share and OG

`og:site_name` `Canto Zen`, `og:locale` `pt_BR`, `og:title` and `og:description`
mirroring §1 and §2 exactly — never a second, more enthusiastic pair.

**The image is the photograph, contained in a field, never cropped.** A 1200×630
`--kozo` field with the route's photograph centred inside it at its own ratio.
This is not a new rule: it is the treatment [`imagens.md`](imagens.md) already uses
for the cart's 96px and the checkout's 64px squares, applied to the one frame whose
proportion the store does not control. Cropping would cut the cast shadow, which
[`marca.md`](marca.md) §7 makes part of the frame — the store's images are `3:2`,
`1:1` and `4:5` *derived from `medidas`*, so an authored 1.91:1 crop is the one
composition the imagery system cannot produce. No text is baked into the card: the
title and description travel as text already, and a typographic OG composition
would be the store's first authored layout that no ticket specified.

| Route | Image |
| --- | --- |
| `/` | the hero piece's `principal` (`ConteudoHome`) |
| Room landing, type listing | `ambiente.imagem` |
| `/produtos` | the home hero's `principal` |
| Product | `produto.principal` |
| Collection | `colecao.imagem` |
| `/inspiracoes`, article | `artigo.thumb` (16:9, contained like any other) |
| `/sobre`, `/contato`, `/politicas/[slug]` | **none** |
| `/carrinho`, `/checkout`, `/pedido-confirmado`, 404 | **none** |

- **The type listing borrows the room's photograph** rather than its first result.
  A card whose image changes when a piece is reordered or sells out is a share
  preview that is not about the page.
- **The institutional pages get no card, and no fallback wordmark card is generated
  for them.** [`institucional.md`](institucional.md) made photography-free an
  authored absence; manufacturing a typographic card to fill the slot re-adds the
  image the page refused, one layer down. WhatsApp renders a text-only preview,
  which is what those pages are.
- `og:type` is `article` on `/inspiracoes/[slug]` and `website` everywhere else —
  **never `product`**, which expects `og:price:amount` and `product:availability`,
  the same offer claim §6 refuses. `twitter:card` is `summary_large_image` where
  there is an image and `summary` where there is not.

### 6. Structured data

The store emits **three node types**: `Product`, `BreadcrumbList`, `Article`.
Nothing else, on any route.

**`Product`** on `/produtos/[slug]` — `name`, `image` (the `principal` URL),
`description` (§2's derived line), `material`, `color`, and
`width`/`depth`/`height` as `QuantitativeValue` with `unitCode: CMT`, plus
`brand: { "@type": "Brand", "name": "Canto Zen" }`. No `sku` and no `gtin` —
[`produto.md`](produto.md) already refused synthetic ids, and this is where
inventing one would have paid off.

**Refused, and why each:**

- **`offers`.** A `priceCurrency`/`price`/`availability` node is a machine-readable
  assertion that this thing can be bought at this price today. It is the exact
  claim [`checkout.md`](checkout.md) is built around admitting the store cannot
  make, and by rule 3 an index is where the admission cannot follow it. **This is
  the eighth refusal of a fabricated artefact** in the map, after the QR code, the
  founder biography, the designer roster, the sent contact message, the room's
  dimensions, the failed-image placeholder and the countdown.
- **`Organization` / `LocalBusiness`.** The line: **a name is not a credential; an
  address, CNPJ, telephone, logo or rating is.** `Brand { name }` and an article's
  `author: Organization { name }` are permitted because they carry a name and
  nothing else. A top-level node publishing the fictional razão social, CNPJ and
  showroom address into a knowledge graph is [`rodape.md`](rodape.md)'s selo
  argument with the store's own credentials in the payload — which also settles
  that `/contato` emits **no** `LocalBusiness`, despite being the one page a
  showroom section would invite it onto.
- **`AggregateRating` / `Review`.** [`produto.md`](produto.md) has no ratings.
- **`ItemList` on listings.** True and harmless in isolation, but it exists to earn
  a product carousel — a shopping placement, arrived at from the side.
- **`WebSite` + `SearchAction`.** There is no search
  ([`navbar.md`](navbar.md) §12); `?q=` stays reserved and unused.

**`BreadcrumbList`** on `/produtos/[slug]`, mirroring the visible trail exactly —
`Início / {ambientePrincipal.label} / {tipo.label} / {produto.nome}`, always the
primary room (see [Breadcrumbs](#breadcrumbs)). The rule generalises: wherever a
visible breadcrumb exists the node mirrors it, and it never invents a trail the
reader cannot see.

**`Article`** on `/inspiracoes/[slug]` — `headline: titulo`, `description: resumo`,
`image: thumb`, `author: { "@type": "Organization", "name": "Canto Zen" }`. **No
`datePublished` and no named author**: `Artigo` carries no date
([`inspiracoes.md`](inspiracoes.md)) and a byline is the founder biography
[`institucional.md`](institucional.md) refused, arriving in JSON-LD.

**Consequence a build session must not "fix":** without `offers`, the `Product`
node is ineligible for merchant and product rich results. That is the decision, not
an omission — the store declines a shopping placement it cannot honour. Adding
`offers` to make the rich result appear reverses this ticket.

### 7. What a 404 and an empty result declare

Two different things, and the metadata layer's job is that they never swap.

| | Unenumerated pair, unknown slug | Filter with zero results |
| --- | --- | --- |
| What is wrong | the **URL** does not exist | the **state** matches nothing |
| Status | `404` | `200` |
| Robots | `noindex` | `noindex` (filtered URLs already are — §4) |
| Title | `Página não encontrada \| Canto Zen` | unchanged |
| Description, `og:image`, schema | none | unchanged |

`/cozinha/sofas` is a pair that was never declared; `/sala/sofas?cor=cru` with no
linen sofas is a real page truthfully reporting nothing. **A 200 on the first would
put empty grids into the index** — the soft-404 that "enumerated, not generated"
exists to prevent — **and a 404 on the second would make legitimate state look
broken.** [`catalogo.md`](catalogo.md) already fixed that the régua does not render
at zero, so the empty result has no figure to state and does not acquire one here.

Also 404: `/colecoes` (index deliberately absent, path reserved), any
`/inspiracoes/[slug]` outside the four articles
([`inspiracoes.md`](inspiracoes.md) §7.2), and any `/politicas/[slug]` outside the
four documents.

What either surface **looks like** is
[ticket 016 — Error, 404 & loading surfaces](../../.wayfinder/tickets/016-error-surfaces.md).
This section fixes the contract it must not break: status code, robots, and the
prohibition on soft-404.

### 8. Handoffs

- **[Error, 404 & loading surfaces](../../.wayfinder/tickets/016-error-surfaces.md)**
  — §7 is a contract, not a design. 016 owns the page.
- **Legal-copy verification** (map, *Not yet specified*) — each policy document's
  first sentence must stand alone; it ships as the description.
- **Seed data** (map, *Not yet specified*) — **no new demand.** Every source §2
  names is already owed: `Ambiente.descricao`, `Colecao.descricao`, `Artigo.resumo`,
  `Familia.designer`, `medidas` on every produto. Worth stating only that
  `Familia.designer` and the material now appear in a SERP, so a placeholder there
  is visible outside the store.
- **[Motion & transition conventions](../../.wayfinder/tickets/017-motion.md)** —
  nothing.
- `<html lang="pt-BR">` is already fixed by [`marca.md`](marca.md) §4 and is not
  restated here.

## Open, elsewhere

- **404 and error surfaces.** Enumerated type routes mean 404 is load-bearing here.
  Its metadata contract is fixed above (§7); what the page *looks* like is
  [ticket 016 — Error, 404 & loading surfaces](../../.wayfinder/tickets/016-error-surfaces.md).
