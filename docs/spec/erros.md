# Error, 404 and loading surfaces — Canto Zen

Resolves ticket [Error, 404 & loading surfaces](../../.wayfinder/tickets/016-error-surfaces.md).

The non-happy paths: the 404, the unexpected error, the loading state, and the
inline field error the page specs kept deferring. Written in English prose; every
string quoted as copy is the pt-BR that ships.

This file **corrects** [`pagina-produto.md`](pagina-produto.md) §5 (see §5.3) and
**widens** [`marca.md`](marca.md) §9 by exactly one entry (see §4.2).

---

## 1. The register these surfaces share

[`marca.md`](marca.md) §3 already refused the traffic-light palette: success and
error resolve in `--ink`, `--indigo` and typographic weight. Four rules follow, and
they hold on every surface in this file.

- **Nothing apologises.** No "desculpe", no "ops", no exclamation mark. An apology
  invites the reader to evaluate the store's feelings instead of their next move.
- **Nothing is vague.** Every surface states what is true and what is available.
  `Algo deu errado` is banned by name.
- **An empty screen is an invitation to act.** No surface here ends without a real
  route out, and that route is composed of links the store already has.
- **No icon anywhere.** [`navbar.md`](navbar.md) fixed zero icons store-wide; the
  footer is the only registered exception and it is not extended here. No warning
  triangle, no broken-image glyph, no `!`.

The 404 and the 500 share one **lane**: the plain, single-column text lane of the
policy template ([`institucional.md`](institucional.md) §14 nominated it), ink on
`--plaster`, left-aligned in the 12-column grid, never centred in the viewport.

**Two ausências autoradas** ([`CONTEXT.md`](../../CONTEXT.md)) on these surfaces:

- **No photography.** A photograph on a 404 forces the page to *pick a piece*,
  which turns a failure into a merchandising act. [`marca.md`](marca.md) §7 spends
  photography on pieces observed, not on decorating a dead end.
- **No régua.** `4 AMBIENTES` is a real figure, so a régua here would not be the
  empty régua [`marca.md`](marca.md) §2 prohibits — it is refused on the stronger
  ground that the régua is reverence for an object, and there is no object here.

---

## 2. The 404

One page, one copy. What varies is the offer, never the voice (§2.2).

### 2.1 Copy and structure

Full navbar and full footer ([`rodape.md`](rodape.md) §6 makes the razão social,
CNPJ and arrependimento notice non-negotiable on a public page; checkout's reduced
chrome exists to protect a funnel, and a 404 has no funnel to protect — it *is*
navigation).

| Slot | Voice | String |
| --- | --- | --- |
| `<h1>` | Mincho, Display L | `Não há nada neste endereço.` |
| Body | Grotesk, Corpo | `O catálogo é enumerado: cada ambiente e cada tipo têm um endereço próprio. Este não é um deles.` |

The body is doing real work: it explains the store's design rather than reporting a
failure, and it is *true* — [`rotas.md`](rotas.md) §6 enumerates every valid pair
and 404s the rest. The page never guesses what the reader wanted, and `404` never
appears as decoration.

Vertical rhythm per [`marca.md`](marca.md) §5: `7rem` above the `<h1>`, `1.5rem` to
the body, `4rem` to the recovery block, `7rem` to the footer.

### 2.2 The recovery block

There is **no search anywhere in the store** ([`navbar.md`](navbar.md) §12), so the
offer is a list. An annotation-voice heading over plain links — never buttons, which
would give a dead end more CTA weight than a produto page has.

**Generic** — the path's first segment is not a valid ambiente:

```
CONTINUE POR AQUI
Sala · Quarto · Cozinha · Escritório
VER TODAS AS PEÇAS        → /produtos
```

**Ambiente-matched** — the first segment *is* a valid ambiente, which is the case a
shopper actually reaches by trimming or guessing a URL (`/sala/mesas`: `mesas` is a
real tipo, just not one Sala exposes):

```
TIPOS EM SALA
Sofás · Poltronas · Mesas de centro · Mesas de jantar · Racks e estantes · Aparadores
VER TUDO EM SALA          → /sala
```

**Nothing here is generated.** Both variants read the room and type taxonomy in
[`rotas.md`](rotas.md) §2 — the same table the navbar mega-menu reads. The copy
above the block is byte-identical in both cases; only the offer differs. This is the
whole of the "smarter 404": a different offer, never a different claim about what
the reader meant.

### 2.3 What reaches this page

Every 404 in the route table lands here — there is no second not-found surface:

- an unenumerated ambiente × tipo pair ([`rotas.md`](rotas.md) §6);
- an unknown `/produtos/[slug]` ([`pagina-produto.md`](pagina-produto.md) §14);
- an `/inspiracoes/[slug]` outside the four articles
  ([`inspiracoes.md`](inspiracoes.md) §7.2);
- a `/politicas/[slug]` outside the four documents
  ([`institucional.md`](institucional.md) §13);
- `/colecoes` (index deliberately absent, path reserved);
- any path matching no route at all.

### 2.4 Status — and why it is not automatic

[`rotas.md`](rotas.md) §7 fixes a hard contract: status `404`, `noindex`, title
`Página não encontrada | Canto Zen`, and **no soft-404**. Next 16 does not give that
for free.

> When streaming, a `200` status code will be returned… Because the response
> headers have already been sent to the client, the status code of the response
> cannot be updated.
> — `next/dist/docs/01-app/03-api-reference/03-file-conventions/loading.md`

The response starts streaming the moment a Suspense fallback renders. So the
contract holds only under these rules, which are part of this spec and not
implementation trivia:

- **A single root `app/not-found.tsx`.** It renders inside the root layout, which is
  what gives §2.1 its navbar and footer.
- **No `loading.tsx` anywhere in the app.** §4 arrives at the same prohibition from
  the design side; here it is what keeps the status real. The two agree.
- **`notFound()` is called before any `await` that can suspend.** The ambiente ×
  tipo table is static data, so the check is synchronous and this costs nothing.
- **Experimental `globalNotFound` stays off.** It bypasses the root layout, which
  would strip the footer and with it the identification [`rodape.md`](rodape.md) §6
  requires by law. The convenience is not worth a compliance surface.

---

## 3. The unexpected error

### 3.1 Route-level — `error.tsx`

Same lane, full chrome, different copy.

| Slot | Voice | String |
| --- | --- | --- |
| `<h1>` | Mincho, Display L | `Algo quebrou aqui.` |
| Body | Grotesk, Corpo | `A falha é nossa, não do que você fez. Recarregar esta página costuma bastar.` |

Two actions, `4rem` below, in CTA voice:

- `TENTAR NOVAMENTE` — the primary button of [`marca.md`](marca.md) §6, calling
  `reset()`.
- `IR PARA O INÍCIO` — a plain link, not a second button.

The body names the fault as the store's without apologising for it, and it tells the
reader the one thing they can act on. It does not speculate about causes, and it
never shows a stack trace or an error code: a concept store that displays
`Error: ECONNREFUSED` has broken the "intentional and well-made, not an error"
condition [`checkout.md`](checkout.md) set for the whole build.

### 3.2 Global — `global-error.tsx`

**Specified to assume nothing**, because the thing that failed may be the root
layout itself. It declares its own `<html lang="pt-BR">` and `<body>`, and:

- **reads no data at all** — no produto, no politicas, no `Loja`. A boundary that
  needs the data layer in order to render cannot be the boundary for the data layer
  failing;
- renders the wordmark as **plain text**, not the navbar component;
- carries **no footer**. The identification requirement is a requirement on the
  store's pages, and this surface is the admission that no page rendered;
- accepts a **system-font fallback**. A page that cannot guarantee its own fonts
  loaded should not pretend otherwise. `--ink` on `--plaster` still holds — those
  are two hex values, not a dependency.

Copy is §3.1's, minus `IR PARA O INÍCIO`, which it cannot honestly promise.

---

## 4. Loading

### 4.1 The problem this actually solves

[`imagens.md`](imagens.md) §6 already banned the whole category default — no
skeleton, no shimmer, no spinner, no fade-in, no blur-up — and every page spec
refuses scroll reveal by name. That leaves a real gap rather than a solved problem,
because [`catalogo.md`](catalogo.md) §6–7 made **every filter selection and every
pagination click a real server navigation**. Loading is not an edge case in this
store; it is the catalogue's main interaction. With nothing at all, a click on a
slow connection is indistinguishable from a click that did not register.

### 4.2 The loading language

**Stale content persists at reduced contrast. Nothing is ever replaced by a
placeholder of its own shape.** The store does not show you the silhouette of
information it does not have yet; it shows you the information it still has,
declared stale.

Mechanically: the region being replaced takes a **120ms opacity ramp to `0.45`**.

> **This widens [`marca.md`](marca.md) §9, and says so.** §9 permits "a 120ms colour
> transition on interactive states, and nothing else". Opacity is not strictly
> colour, and this spec declines to smuggle it in under that wording. §9 gains
> exactly one entry — this one. A colour-only reading would dim text and leave the
> photographs untouched, which on a photo grid is no feedback at all. Handed to
> [Motion](../../.wayfinder/tickets/017-motion.md) as a constraint to adopt, not to
> re-open.

- **What dims**: only the region about to be replaced — the produto grid, the frete
  quote block, the cart's totals.
- **What never dims**: the chrome. Navbar, page header, tipo band, filter bar and
  pagination stay at full contrast. They are the way out, and dimming the way out
  reads as breakage rather than as work in progress.
- **Trigger**: `useLinkStatus().pending` for filter and pagination links; the
  request's own pending state for CEP quotes and checkout submission.
- **Delay**: `120ms` before the dim begins, so a prefetched, instant navigation
  never flickers.
- **Accessibility**: `aria-busy="true"` on the region, plus a visually-hidden
  `role="status"` announcing `Carregando`.
- **`prefers-reduced-motion: reduce`**: the dim **still applies** — it is state, not
  decoration — but arrives as a cut, with no transition.

### 4.3 What this forbids

- **No `loading.tsx`, anywhere.** It is a Suspense fallback, which is a placeholder
  of the content's shape, and it is also what would silently downgrade the 404 to a
  `200` (§2.4).
- **No skeleton grid of image placeholders.** [`imagens.md`](imagens.md) §12 asked
  this ticket not to introduce one; it does not.
- **No progress bar at the top of the viewport.** It is a second, competing loading
  language, and it lives in the chrome, which §4.2 keeps at full contrast.
- **The `--kozo` reserved image box ([`imagens.md`](imagens.md) §6) is unchanged**
  and composes with the dim rather than replacing it: the box holds the ratio, the
  dim declares the region stale.

---

## 5. The inline field error

[`checkout.md`](checkout.md) §14 handed this ticket the generalisation — "three
instances is enough to generalise into a rule". The three instances also
**disagreed**, and §5.3 resolves that.

### 5.1 Shape

- Message in **Corpo S `--ink`**, `0.5rem` beneath its field.
- The field's border goes `--muted` → `--ink`, **still 1px**. It does not thicken
  and it does not change colour.
- No icon, no colour, no `!`, no uppercase.

### 5.2 Two classes, and the copy rule differs

| Class | The message states | Example |
| --- | --- | --- |
| **Corrigível** | the fix, never the fault | `CEP tem 8 dígitos.` — not `CEP inválido.` |
| **Fato** | the fact, plus the way on | `Ainda não entregamos neste CEP.` + link to `/politicas/prazos-e-entrega` |

The distinction matters because the CEP field produces both, and they are not the
same event: one is the reader's typo, the other is the store's limit. Telling a
reader that their correctly-typed CEP is "inválido" is the defect this split
prevents.

### 5.3 Correction to `pagina-produto.md` §5

[`pagina-produto.md`](pagina-produto.md) §5 sets the CEP error in the **annotation
voice**; [`checkout.md`](checkout.md) §5 sets field errors in **Corpo S**. Checkout
wins, and `pagina-produto.md` is corrected.

The annotation voice is the **label** voice ([`marca.md`](marca.md) §4 — labels,
breadcrumbs, measurements, captions). A message set in it reads as one more field
label rather than as a response to something the reader just did.

### 5.4 Accessibility and submit behaviour

- `aria-invalid="true"` on the field; `aria-describedby` pointing at the message's
  `id`; the message carries `role="alert"` on first appearance.
- On submit, focus moves to the **first invalid field**.
- **No error summary block.** Checkout is a single-page accordion
  ([`checkout.md`](checkout.md)): the offending section opens and takes focus, and a
  summary would duplicate navigation that is already on screen.

---

## 6. Explicitly not this file

- **Zero filter results** — resolved in [`catalogo.md`](catalogo.md) §8, and it is a
  `200` on a real page, not an error. [`rotas.md`](rotas.md) §7 fixes that a 404 and
  an empty result must never swap; nothing here touches that boundary.
- **Empty cart** — [`carrinho.md`](carrinho.md).
- **Per-image failure** — [`imagens.md`](imagens.md) §6: the `--kozo` field simply
  stays, and nothing is drawn.
- **The checkout confirmation interstitial** — [`checkout.md`](checkout.md). It is a
  deliberate delay, not a loading state, and §4.2's dim does not apply to it.

---

## 7. What this hands to other tickets

- **[Motion & transition conventions](../../.wayfinder/tickets/017-motion.md)** —
  one addition to [`marca.md`](marca.md) §9: the 120ms opacity ramp to `0.45` on a
  replaced region (§4.2), with its reduced-motion branch. That ticket should adopt
  it, and should keep §4.3's prohibitions — no `loading.tsx`, no progress bar, no
  skeleton. It also still owns [`checkout.md`](checkout.md)'s open question about
  the confirmation interstitial's arrival, which §6 confirms is out of scope here.
- **[`pagina-produto.md`](pagina-produto.md)** — §5.3 corrects its error voice from
  annotation to Corpo S; a note pointing here belongs in that file.
- **Legal-copy verification** (map, *Not yet specified*) — **no new surface.** The
  404 and the error pages carry no legal copy of their own; the 404 carries the
  footer's, which is already counted.
- **Catalogue seed data** (map, *Not yet specified*) — **no new demand.** Both 404
  variants read the existing room and type taxonomy.

---

## 8. How this was decided

Resolved in conversation, without a prototype — the contested questions were
register and contract questions, not layout ones.

The three that cost the most:

- **The 404 refuses photography.** The category default is a hero shot with "lost?"
  copy over it. That forces the page to pick a piece, and the store's whole
  photographic position is the piece observed, never the piece deployed. A régua was
  considered and refused on the same ground.

- **The loading decision turned out to be an SEO decision.** "No placeholder of its
  own shape" was reached on identity grounds — a shimmering grey skeleton
  contradicts a design with zero radius, no shadow and raking light. Reading the
  Next 16 docs afterwards showed that the same prohibition (no `loading.tsx`, so no
  stream) is the only thing that preserves the real `404` status
  [`rotas.md`](rotas.md) §7 demands. The aesthetic rule and the compliance rule turn
  out to be one rule, which is why §2.4 states it as a contract rather than a
  preference.

- **§4.2 widens `marca.md` §9 out loud.** The alternative was to read "colour
  transition" loosely enough to cover opacity. A spec that quietly reinterprets its
  own brand rule teaches every later session that the rules are negotiable in
  private. Naming the single exception, and handing it to the motion ticket as
  settled, costs one paragraph and keeps §9 enforceable.
