---
target: the home page
total_score: 29
max_score: 40
na_heuristics: 
p0_count: 0
p1_count: 4
timestamp: 2026-08-25T15-33-55Z
slug: app-loja-page-tsx
---
Method: dual-agent (A: design review · B: detector + browser evidence).
Browser inspection unavailable — Chrome extension not connected. Both agents fell back to source review plus the server-rendered DOM from localhost:3000. Items marked (not visually confirmed) are reasoned from the positioning chain.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | aria-expanded correct, but every mega-panel opens ~250px left of the item that triggered it |
| 2 | Match System / Real World | 4 | pt-BR throughout; à-vista, parcelamento, frete, arrependimento in the expected BR register. PRAZO states a unit and no number |
| 3 | User Control and Freedom | 2 | Mega menu blocks Tab and Shift+Tab at loop boundaries; Escape is the only exit and is never advertised. No skip link |
| 4 | Consistency and Standards | 2 | AMBIENTES renders as h2 twice; chrome hinges at md while body hinges at lg; Display XL spent twice |
| 5 | Error Prevention | 3 | Newsletter error copy exemplary; its success copy asserts a falsehood |
| 6 | Recognition Rather Than Recall | 3 | Tipo names inside ambiente fields are not links — clicking them lands on /sala |
| 7 | Flexibility and Efficiency | 2 | 65-produto store with no search, no filter entry; the one accelerator fights the mouse |
| 8 | Aesthetic and Minimalist Design | 4 | Tonal-only depth, radius/shadow nulled outside every layer, two families, one rationed accent — no lapse |
| 9 | Error Recovery | 3 | Small surface, handled correctly: role=alert, aria-invalid, aria-describedby, ink message, no icon or colour |
| 10 | Help and Documentation | 3 | Serviço band right help/right place, but frete defers with no CEP field and PRAZO has no figure |
| **Total** | | **29/40** | **Good — world-class system, execution gaps in what it frames** |

H7 and H10 scored rather than n/a: the missing search and deferred frete are real costs on this surface.

## Design Specificity Verdict

The system is authored to a degree almost nobody reaches; the page is roughly half authored, half category-default.

Singular: the régua as ornament and data at once; the Serviço band filling the slot BR commerce fills with seals/testimonials with four defensible facts; the commercial voice letting R$ 8.820,00 / 10% À VISTA NO PIX read as disclosure; the unequal 7/5 ambientes composition.

Category-interchangeable: the Abertura is the most-shipped opener in the furniture category (wide room photo, serif line left, outlined uppercase button). The three-card strip, hairline editorial rows, and closing workshop pair are category furniture.

Corrected — the repeated photographs originally reported here are not a finding. The home does render one photograph in three pairs of slots (tabelas.ts:44 == :3001, :54 == :3043, :3126 == :3196), and off-home one photo id appears 8 times and another 6. That is the intended state of the tree: docs/spec/imagens.md §10.1 states that placeholder repetition is explicitly fine and §10.2 suspends every photographic rule until the phase-2 pass, which the repo owner runs once at the end of development. The two divergent alt texts on the shared file are likewise correct — alt is authored per slot against the image that will ship, not against the hotlink standing in for it. Recorded in docs/adr/0003-placeholder-repetition-is-not-a-defect.md. Specificity is judged below on structure and composition only.

Deterministic scan: detect.mjs over the eight home sections, both layouts, six chrome components and the régua returned 0 findings, exit 0. Proven live by a whole-tree run that caught app/global-error.tsx:57 (fontSize "2.5rem", off the type scale) — outside this target set. No ignore config, no impeccable-disable comments. Rendered DOM clean: 14 images all with real pt-BR alt, reserved ratios, sizes; 2 with priority; one h1; no heading-level skips; lang="pt-BR"; all landmarks; the single input properly labelled. Nothing a detector can see is wrong with this page.

Visual overlays: none. Injection never attempted — extension not connected, list_connected_browsers empty. No live server started, none needed stopping. Detector Puppeteer URL mode failed (not installed; correctly not added).

## Overall Impression

The most rigorously argued page in the codebase. Band sequence, rhythm and ration discipline are exceptional; the Serviço band is an original answer to a category cliché. What is left against it is the keyboard — a mega menu that opens on focus and traps Tab, and panels that open under the wrong room — plus one copy falsehood: it tells the visitor they will be notified about a newsletter that does not exist. (The repeated stock photography this paragraph originally led with is intended and withdrawn — see §Design Specificity Verdict and ADR 0003.)

Biggest opportunity: the signature is spent on things that are not measurements. One measurement on the whole page (L 220 CM); the second and last régua is "6 PEÇAS" floating above a section with no object beneath it; the three featured cards drop largura that listing cards carry.

## What's Working

1. The Serviço band's position is a structural argument (components/home/servico.tsx): §5 because §3 just showed prices; fills the seals/testimonials slot with defensible facts; the kozo swap is the only tonal move available; the only section filling through to column 12, which is what makes it a rail.
2. The commercial disclosure voice resolves a tension the category has not solved: Price role + annotation índigo + Body S parcelamento, full Lei 13.455 disclosure, accent spent exactly twice and both times on a required disclosure. Stating the Pix policy once on the closing hairline instead of badging three cards (faixa-de-destaques.tsx:60-62) is the sharpest ration on the page.
3. The depth system holds because it is enforced, not agreed: globals.css nulls radius and shadow outside every layer; every image box reserves its ratio on a flat kozo field, so CLS is zero. The clean detector run is the receipt.

## Priority Issues

### 1. [P2] The newsletter answers a valid submission with a success that never happens

Corrected 2026-08-25 — this item was filed as a P0 covering two things. Its image half (three repeated photographs, two divergent alt texts) has been withdrawn: it is intended, per imagens.md §10.1–§10.2 and ADR 0003, and no invariant, no re-sourcing and no dropped photograph should be pursued. What survives is the newsletter, which is a P2. The page asserts one thing that is not true, not two.

What: components/chrome/newsletter.tsx:25-26 answers a valid submission with "PRONTO. VOCÊ SERÁ AVISADO." — nothing is recorded, nothing is transmitted.

Why it matters: Product Principle 2 forbids fabricating to cover a gap, and the checkout has a whole interstício built to honour it. The newsletter sits directly beneath a privacy-policy link, which makes it read as carelessness rather than fiction. No phase suspends this: it is copy, not photography.

Fix: newsletter success → the checkout's own register: "LOJA CONCEITO. NADA FOI ENVIADO NEM GUARDADO." in annotation muted, keeping role="status".

Command: /impeccable clarify.

### 2. [P1] The mega menu opens on focus and traps the keyboard in a seven-link loop

What: navegacao-ambientes.tsx:161 opens on onFocus; :113-120 preventDefaults forward Tab at the last panel link and Shift+Tab at the trigger, cycling focus back inside. Escape is the only exit and nothing says so. Repeat for all four rooms. No skip link, so reaching <main> costs seven stops plus four undiscoverable Escape presses.

Why it matters: WCAG 2.1.2 is arguably satisfied because Escape works, but the standard exit gesture is blocked in both directions with no instruction. This project publishes normative floors and declines an AA claim on provenance grounds; a de-facto trap on primary navigation most undermines that stance. acessibilidade.md §6 priced the skip-link refusal against seven stops — that arithmetic predates this behaviour.

Fix: delete the trap; a non-modal disclosure must not contain focus. Let Tab walk out into the next ambiente and close on focusout when the target is outside the group. Keep onFocus-to-open and Escape as an accelerator. Re-derive §6's stop count against fixed behaviour.

Command: /impeccable audit.

### 3. [P1] Every mega-panel opens under the wrong room; Escritório is effectively unreachable by mouse

What: :139 puts relative on the <ul>; the <li> has no positioning, so the panel's absolute left-0 top-full at :184 resolves against the whole nav group. navbar.md §6 authorises this alignment, so it is a rule followed producing a bad result. Consequences: hovering Escritório opens a 260px column ending well to its left, and any leftward pointer path crosses Cozinha and opens its panel instead; top-full resolves ~51px into a 72px bar, so the panel paints over the bar's bottom ~21px including its border-b border-hairline. (Not visually confirmed.)

Why it matters: one of four rooms in the merchandising spine is unreachable by mouse; the interrupted hairline reads as a glitch in a system whose depth argument is one hairline, never interrupted.

Fix: relative on the <li> so each panel hangs under its own trigger, right-0 on the rightmost; anchor to the bottom of the 72px bar rather than the <ul> box. If group-alignment is defended, add a bridging hit area or click-to-open for all pointer types.

Command: /impeccable polish, verified in a browser once the extension is connected.

### 4. [P1] The signature is diluted on the one page that teaches it

What: exactly one measurement on the page (L 220 CM). The second and last régua is "6 PEÇAS" (colecao.tsx:25, from rotuloDaContagem), spanning the full 1360px container with no object beneath it. The three featured cards omit largura that listing cards carry. The measured régua sits under an object-contain image in a 3:2 box while the sofá's real ratio is ~2.82:1, so its ticks align with the container, not the piece.

Why it matters: the régua earns its place because measurement decides a furniture purchase. A count floating above a section satisfies the letter and abandons the argument, and a full-width ruled line above a section reads as a divider. The page teaches the gesture once and then teaches that it means "any number" — while giving a buyer no dimensions for three of four featured pieces.

Fix: put largura back on the featured cards in the annotation voice (no régua budget spent); drop the coleção régua or move it to a cota on the coleção photograph with a real figure; make the hero ratio box match the piece's real proportion so ticks land on the object's edges.

Command: /impeccable distill or /impeccable layout.

### 5. [P1] Mobile turns the alcove into distance

What: faixa-de-destaques.tsx:32 is one column below lg, so three full-bleed cards plus 4rem gaps run ~1,900px. DESIGN.md names the listing grid as the one exception running two columns from the smallest screen; the featured strip is the same anatomy and does not. Three non-featured ambiente fields stack at equal full-bleed height for ~700px more. Document at 390px computes to ~9,400px. (Computed, not measured.)

Why it matters: the buyer reaches the Serviço band — frete, montagem, prazo, arrependimento — at roughly 6,500px on a phone, past five full-width photographs, in a category shopped overwhelmingly on mobile. The alcove argument is about lateral emptiness; one column converts it to vertical distance.

Fix: grid-cols-2 from the smallest screen with lg:grid-cols-12, matching the listing grid; consider the same for the three non-featured ambiente fields.

Command: /impeccable adapt.

## Persona Red Flags

Marina, 38, furnishing a sala in São Paulo:
- Serviço says frete is "Calculado por CEP na página da peça" — no CEP field on this page.
- PRAZO states a unit and no number while cards 7rem above say "SOB ENCOMENDA · 6 SEMANAS".
- Largest number on the page is the à-vista figure (R$ 8.820,00); the tabela price appears only in the 14px muted parcelamento line, with no de/por framing. Most BR buyers parcelam.
- Three of four pieces carry no dimension at all.
- Delivery facts arrive ~6,500px down on a phone.

Rafael, hiring manager, four minutes:
- Tabbing the page hits the focus loop within two keystrokes.
- DevTools shows pl-[6%], ml-[3.5rem], gap-[2rem], w-[260px], py-[0.375rem] against "no page invents a value".
- Two <h2>AMBIENTES</h2>; the Serviço band has no heading.

Keyboard / screen-reader user:
- Bidirectional Tab block at navegacao-ambientes.tsx:113-120; no skip link.
- Panel <div> carries aria-label with no role — discarded by every major AT.
- Serviço section has no accessible name; rendered outline runs Reboco → INSPIRAÇÕES with nothing between.
- Two identical AMBIENTES headings with no way to distinguish band from footer column.

## Minor Observations

- inspiracoes.tsx:61 quiet CTA is text-ink hover:text-muted, dropping contrast (~15:1 → 5.1:1) where the spec says ink → índigo. Reads as disabling; the only interactive element not reaching for the accent.
- Display XL spent twice (Abertura h1 and hero piece name) on a page DESIGN.md says gets one, while marcenaria.tsx calls its line "the one feature line" and renders it at Display L.
- marcenaria.tsx:46 uses object-contain on an editorial photo in a fixed 3:2 box, guaranteeing kozo bars on the closing image; Ambientes and Coleção correctly use object-cover for the same genre.
- abertura.tsx documents the overlay region as "roughly #EDE6DC"; sampling hero.webp puts it at ~#D0CCC7–#E1DDD8. Ink still clears 10.7:1 — the no-scrim call is sound — but the stated constraint names a colour the file does not have.
- The Abertura Display XL line sits inside max-w-aside (34ch resolved against 16px Grotesk, ~272px) while rendering at up to 52px Mincho; it will break to roughly four short lines. (Not visually confirmed.)
- Chrome hinges at md (navegacao-ambientes.tsx:138, menu-mobile.tsx:76) while every home section hinges at lg, against "single hinge at lg… no tablet-specific layer".
- Tipo names sit inside the ambiente field's link, so clicking "SOFÁS" navigates to /sala — worse than either linking or not linking them.
- rodape.tsx:145 "COMPRA SEGURA" is an unbacked trust assertion on a store whose Evidence section forbids fabricated proof.
- text-body-s used as a utility in the chrome where the .t-body-s role class is mandated; it is a defined token, but it drops font-variant-numeric: tabular-nums.

## Questions to Consider

1. If the régua can carry "6 PEÇAS", what can it not carry?
2. ADR 0002 reopened two refusals to put a generic hero first. Was the trade paid for?
3. ~~The system forbids placeholders, and every ambiente photograph is a stock image reused as an article thumbnail. Is "Phase 1 ships hotlinks" a schedule, or an expired exemption?~~ Answered: it is a schedule. imagens.md §10.4 defines the one-time phase-2 pass and the repo owner runs it at the end of development; ADR 0003 records the decision. "No placeholder" is a property of the shipped store, not of this tree.
4. acessibilidade.md §6 traded the skip link against seven stops. Does that trade survive its own mega menu?
