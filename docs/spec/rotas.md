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
| `/inspiracoes` | Editorial index | `inspiracoes.md` | Accepts `?ambiente=` |
| `/inspiracoes/[slug]` | Article | `inspiracoes.md` | |
| `/carrinho` | Cart | `carrinho.md` | |
| `/checkout` | Checkout | `checkout.md` | Single page, accordion sections |
| `/pedido-confirmado` | Order confirmation | `checkout.md` | Carries the "concept store, nothing was charged" disclosure |
| `/sobre` | Brand story | `institucional.md` | Label reads "Sobre nós"; the path is a slug, not a sentence |
| `/contato` | Contact | `institucional.md` | |
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
| `ambiente` | `/produtos`, `/inspiracoes` | room slug | `?ambiente=quarto` |

Room routes take their room from the path and ignore `ambiente`. `/produtos`
needs it because it has no room in its path.

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
- **`?q=` e superfície de resultados** — reservado por esta tabela, **nunca usado**.
  [`navbar.md`](navbar.md) §12 recusou a busca: ~20 páginas de listagem curadas,
  navegação room-primary como *o* caminho, e nenhum corpus real que torne relevância
  significativa. A busca e sua página de resultados saíram do mapa como fora de escopo.

## Open, elsewhere

- **404 and error surfaces.** Enumerated type routes mean 404 is load-bearing here.
  Its shape waits on brand direction — see the map's *Not yet specified*.
