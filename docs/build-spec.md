# Build the Canto Zen storefront

> Synthesised from [`.wayfinder/map.md`](../.wayfinder/map.md) — twenty closed
> tickets and sixteen spec files in [`docs/spec/`](spec/). The map's destination
> was the spec; this is the spec for the build that consumes it.
>
> Vocabulary is [`CONTEXT.md`](../CONTEXT.md). Where this document and a page
> spec disagree, **the page spec wins** — this one exists to sequence the work,
> name the modules and fix the seams, not to re-decide anything.

---

## Problem Statement

Canto Zen is fully specified and entirely unbuilt. Sixteen spec files describe
every route, every section, every derived figure, the palette down to measured
contrast ratios, the sixty-five produtos and the arithmetic that turns each
`precoTabela` into a price, an à-vista, a parcelamento and a montagem fee — and
the repository is still the default Next scaffold: `app/layout.tsx` with
`lang="en"` and `app/page.tsx` with the starter markup.

A reader who is handed the URL today sees nothing. There is no storefront to
browse by ambiente, no produto to open, no régua, no carrinho, no checkout that
admits it is a concept. The specs are readable by a person and by an agent, but
they are not readable by a browser.

The gap is not knowledge, it is transcription and assembly — and the specs are
strict enough that assembling them wrong is easy to do quietly. Prices are
derived from one authored number, freight from a cubed box, a família's designer
from its tipo; nine fields have rules rather than values. Cross-references bind
surfaces that different sessions will build days apart: the home's
`destaqueHome`, the coleções' `produtos[]` and all twelve `FotoArtigo.pecas[]`
arrays are produto slugs, so a session that invents a name leaves the home and
Inspirações pointing at nothing, and nothing in TypeScript will say so.

## Solution

Build the storefront: every route in `rotas.md`'s table, rendering real data,
in the identity `marca.md` fixes.

One catálogo module holds the sixty-five produtos, the fifty-nine famílias and
the six taxonomy entities, exposes the derived figures as functions rather than
as stored fields, and asserts the invariants the type system cannot. Every page
reads that module and nothing else. The design tokens land once as CSS custom
properties on `:root`, with the two-family type scale and the closed
two-entry motion vocabulary, and no page invents a value.

The reader gets what the specs describe: rooms at the top level of the URL,
produtos flat beneath `/produtos/`, a filter-and-sort bar whose state lives in
pt-BR query params, a régua carrying a real cm figure beside a photograph, a
per-CEP frete quote on the produto page rather than first met at checkout, a
carrinho that keeps its own state in the browser, and a single-page checkout
whose pay button leads to an interstício that says plainly that nothing was
charged and nothing left the browser.

Nothing is persisted server-side, nothing is transmitted, no payment is
processed, and no fabricated artefact is produced to cover a gap — the eight
standing refusals hold in code exactly as they hold in prose.

## User Stories

### Chrome — navbar, footer, layout

1. As a visitor, I want the page to declare `lang="pt-BR"`, so that my screen reader pronounces the store's own language correctly.
2. As a visitor, I want a navbar that is present at one constant 72px height on every route, so that the store's structure never moves while I read.
3. As a visitor, I want five navigation items — the four ambientes plus Inspirações — left-grouped with the right gutter left empty, so that I can see the whole store's shape in one glance.
4. As a visitor, I want the wordmark set in Mincho, so that the store's one display face signs the page it appears on.
5. As a visitor, I want hovering an ambiente label to open a single 260px column of that room's curated tipos plus "Ver tudo em {Ambiente}", so that I can reach any listing in two moves without leaving the page I am on.
6. As a keyboard user, I want the ambiente panel to open on focus, close on Escape, return focus to its trigger, contain focus while open, and expose `aria-expanded`, so that the mega menu is not a mouse-only affordance.
7. As a visitor, I want the cart to be the word `CARRINHO` with a tabular `(n)` that vanishes at zero, so that the store's zero-icon rule holds and an empty cart makes no claim.
8. As a visitor, I want the cart affordance to be a link to `/carrinho`, never a drawer trigger, so that my cart has a URL I can return to.
9. As a visitor on a small screen, I want the mobile trigger to be the word `MENU`, so that the interface stays wordmarked rather than iconographic at every breakpoint.
10. As a visitor browsing a room, I want the active ambiente marked with a 1px ink rule rather than índigo, so that the accent stays rationed for interaction.
11. As a visitor on a produto page, I want no nav item marked at all, so that the marking never lies about where I am.
12. As a visitor, I want a substantial textual footer in `--plaster` with four zones and no photograph, so that the page closes on facts rather than on another image.
13. As a visitor, I want Atendimento as its own footer column, so that reaching a person is not buried in a link list.
14. As a visitor, I want the footer to carry razão social, CNPJ, IE and address, so that the store identifies itself the way Brazilian law expects.
15. As a visitor, I want the seven-day arrependimento notice inline in the footer on every route, so that the notice is ostensive rather than filed away in a policy page.
16. As a visitor, I want the fictional CNPJ to disclose that it is fictional, so that the only fabricated artefact with a third party behind it does not pass as real.
17. As a visitor in checkout, I want a reduced footer, so that the flow is not competing with a full sitemap.
18. As a visitor, I want no third-party trust seals anywhere, so that the store makes no credential claim it cannot support.
19. As a keyboard user, I want a visible focus ring of `2px solid var(--indigo)` at `3px` offset on every focusable element, so that I always know where I am.

### Brand and identity in code

20. As a build session, I want the palette as CSS custom properties on `:root` with the exact hexes `marca.md` §3 fixes, so that no surface picks a near neighbour.
21. As a build session, I want `--muted` to be `#6B675F` and the resting border of every control, so that the two contrast failures `acessibilidade.md` §5 found stay fixed.
22. As a build session, I want `--hairline` reserved for decorative structure and never for a control border, so that the palette's meaning stays a rule rather than a habit.
23. As a visitor, I want Zen Old Mincho used only for a piece name, a collection title, an editorial title and one feature line per page, so that the display face keeps its weight.
24. As a visitor, I want Schibsted Grotesk with tabular figures for every price, measurement, parcela, CEP and prazo, so that numbers align down a column.
25. As a visitor, I want zero border radius, no UI shadow and 1px hairlines throughout, so that the only curve and the only shadow in the store live inside the photograph.
26. As a visitor, I want the régua — a hairline rule with end ticks carrying a real cm figure — beside featured pieces, so that the store's one bold gesture is also data.
27. As a visitor, I want never to see a régua without a figure behind it, so that the gesture cannot degrade into ornament.
28. As a visitor, I want at most two réguas on a screen, so that the gesture stays rationed as each page spec budgets it.
29. As a visitor, I want índigo to appear at most twice on a screen, so that the accent stays legible as an accent.
30. As a visitor, I want the only two motions in the store to be the pointer colour transition and the stale-content dim, both at `120ms linear` over colour-carrying properties and `opacity`, so that nothing in the interface announces its own arrival.
31. As a visitor, I want focus and `:active` to be cuts rather than transitions, so that the keyboard never waits on an animation.
32. As a visitor who prefers reduced motion, I want one global rule that keeps every end state and drops the interpolation, so that no surface has to remember the branch on its own.
33. As a visitor, I want no hover effect on any photograph anywhere, so that the image is a fact rather than a control.

### Catálogo data and derivations

34. As a build session, I want one catálogo module holding the sixty-five produtos, the fifty-nine famílias, four ambientes, twenty tipos, ten cores, fourteen materiais and two coleções, so that every surface reads one source.
35. As a build session, I want a produto to be one record per acabamento with its own slug and its own price, so that the URL shape `rotas.md` fixed stays true.
36. As a build session, I want `Familia` to be routeless and thin, naming only the "outros acabamentos" strip, so that no page has to invent a family surface.
37. As a build session, I want `medidas` authored per família rather than per produto, so that two acabamentos cannot disagree about the same piece's geometry.
38. As a build session, I want `precoTabela` to be the only authored price, so that the catalogue cannot drift into internal inconsistency.
39. As a shopper, I want the à-vista price derived as `precoTabela × 0,90`, so that the Pix tier is computed rather than typed.
40. As a shopper, I want the parcelamento line to show the largest `N ≤ 10` whose instalment is at least R$ 150,00, so that the store never offers a parcela too small to be real.
41. As a shopper, I want the montagem price to come from the tipo's `nivel`, so that assembly is priced by the work it takes.
42. As a shopper, I want garantia to fall back to 24 months when a produto sets none, so that the fallback is exercised by every piece in the catalogue.
43. As a build session, I want `cor` and `materiais` derived from the authored `acabamento`, including the structural material of the tipo, so that every produto carries at least two materiais and the Cuidados union is never one line.
44. As a build session, I want `embalagem` derived from `medidas` plus a per-tipo density, so that the freight quote reads a box that cannot disagree with the piece.
45. As a build session, I want `montagem`, `medidasExtras`, `itensInclusos` and `designer` derived from tipo, so that two sessions transcribing the catalogue produce the same result.
46. As a build session, I want `ordem` to be the row number 1–65, global, so that one piece has one curatorial position in every slice.
47. As a shopper, I want frete quoted from `max(pesoKg, volume/6000)` against the region the CEP prefix resolves to, so that a São Paulo CEP and a Belém CEP give visibly different answers.
48. As a shopper in Rio Branco, I want prefix `69` to return *região não atendida*, so that the store's stated limit is a state the interface can actually reach.
49. As a shopper, I want the seven fixture CEPs to autofill a real address and any other served CEP to resolve its region and autofill nothing, so that the mock is honest about what it knows.
50. As a shopper, I want `freteGratis` pieces to render **Grátis**, never `R$ 0,00`, so that free freight reads as a decision.
51. As a build session, I want the six worked exemplars written first, one per structural case, so that the derivation rules have a checkable output before the other fifty-nine are transcribed.
52. As a build session, I want disponibilidade to be a three-state enum and never a stock count, so that the store never implies an inventory it does not have.
53. As a build session, I want the store-wide `politicas` and `Loja` objects stated once, so that the footer and `/contato` can never disagree.

### Home

54. As a visitor arriving at `/`, I want a hero built on one featured piece with its designer named, so that the store states its position before it sells anything.
55. As a visitor, I want the four ambientes presented as the store's spine, so that the merchandising structure is the first navigational offer.
56. As a visitor, I want a short strip of featured pieces, so that I can enter the catalogue without choosing a room first.
57. As a visitor, I want one featured coleção surfaced in context, so that the editorial curation reaches me without an index page existing.
58. As a visitor, I want a service section, so that montagem, frete and prazo are stated before I am deciding on a specific piece.
59. As a visitor, I want the Inspirações articles surfaced from the home, so that the editorial lane has an entrance.
60. As a visitor, I want a marcenaria section closing the home, so that the atelier claim is made once, concretely.
61. As a visitor, I want the home's régua, índigo and Mincho budgets respected exactly as `home.md` §§9–11 fix them, so that the busiest page in the store is still quiet.

### Catálogo surfaces — room, tipo, coleção, `/produtos`

62. As a visitor at `/sala`, I want a room landing with its authored one-sentence description, so that the room states what it is for before it lists.
63. As a visitor, I want a tipo band exposing that room's curated tipos, so that I can narrow without a filter panel.
64. As a visitor at `/sala/sofas`, I want a listing scoped to an enumerated room × tipo pair, so that the taxonomy the navbar reads is the taxonomy the URL honours.
65. As a visitor at `/cozinha/sofas`, I want a 404, so that a URL that does not exist is not dressed as an empty result.
66. As a visitor, I want to filter by cor, material and preço faixa in pt-BR query params, so that my filtered view has a URL I can share.
67. As a visitor, I want the cor filter to paint each colour's `amostra` swatch, so that the only non-palette colour in the interface arrives as product data.
68. As a visitor, I want to sort with `?ordem=`, so that ordering is a state and not a hidden preference.
69. As a visitor, I want pagination with `?pagina=`, omitted for page one, so that page one has one canonical URL.
70. As a visitor at `/escritorio`, I want a single full page with no pagination control, so that the control appears only when there is a second page.
71. As a visitor whose filters match nothing, I want a `200` with a zero-results state, so that a state matching nothing is never confused with a URL that does not exist.
72. As a visitor, I want each card to carry the piece, its acabamento, its price and its parcelamento in the annotation voice, so that commerce facts arrive without being shouted.
73. As a visitor at `/colecoes/reboco`, I want the coleção's own authored order preserved, so that the editorial act survives the listing.
74. As a visitor at `/produtos`, I want the same listing without a room scope and with `?ambiente=` available, so that the unscoped index still supports a room cut.
75. As a visitor on a room route, I want `?ambiente=` ignored rather than erroring, so that a stray param never breaks a page.
76. As a visitor on a small screen, I want filters and sort in a sheet that obeys the generic overlay rule, so that mobile filtering is keyboard-operable too.

### Página de produto

77. As a shopper, I want a breadcrumb reading `Início / {ambientePrincipal} / {tipo} / {nome}`, so that the trail is identical for me and for a crawler regardless of how I arrived.
78. As a shopper, I want the piece's name in Mincho and its acabamento named beside it, so that I know which record I am looking at.
79. As a shopper, I want the price, the à-vista figure, the Pix badge and the parcelamento table together, so that I see what Brazilian pages always show together.
80. As a shopper, I want the Pix discount visibly disclosed wherever the differential price is offered, so that the store meets its disclosure duty rather than assuming the discount speaks for itself.
81. As a shopper, I want montagem offered as an add-on with its price, so that assembly is a choice made here rather than a surprise at checkout.
82. As a shopper, I want to type a CEP and get a list of frete options with prices and prazos in dias úteis, so that freight is answered on the page where I am deciding.
83. As a shopper who typed six digits, I want a Corrigível message stating the fix — `CEP tem 8 dígitos.` — so that the store tells me what to do rather than what I did wrong.
84. As a shopper who typed a correctly-formed CEP the store does not serve, I want a Fato message stating the limit and offering the way on, so that a valid CEP is never called invalid.
85. As a shopper, I want the "outros acabamentos" strip listing my piece's siblings, so that the família is reachable without a família page existing.
86. As a shopper, I want a description of three sentences in the atelier's voice, so that the piece is described rather than advertised.
87. As a shopper, I want medidas as a mandatory L × P × A trio plus the tipo's real extras, so that the technical facts are complete and never padded.
88. As a shopper looking at a piece with no extras, I want the Medidas section to render correctly with an empty extras list, so that the empty case is a supported state.
89. As a shopper, I want a ficha técnica whose Cuidados line is the union of my piece's materials' care sentences, so that no produto can exist without care copy.
90. As a shopper, I want a delivery and access block naming the embalagem's own dimensions, so that I can tell whether the box fits through my door and my lift.
91. As a shopper looking at a luminária, I want the no-assembly state rendered, so that `necessaria: false` is a case the page handles.
92. As a shopper, I want a sob-encomenda piece to state its production window separately from the delivery prazo, so that the two clocks are not conflated.
93. As a shopper, I want the produto page to spend índigo exactly twice, so that the accent budget the navbar's active-state rule assumes stays true.
94. As a shopper, I want no human scale figure in any photograph, so that the no-person rule holds across both photographic genres.
95. As a shopper, I want the buy box to carry no arrependimento notice, so that the ostensive notice stays where the footer, cart and confirmation put it.

### Carrinho

96. As a shopper, I want adding a piece to increment its line rather than append a second one, so that one acabamento is one line.
97. As a shopper, I want removal to be explicit and never a quantity of zero, so that I cannot delete a line by decrementing past one.
98. As a shopper, I want cart state to live in my browser and feed the navbar counter, so that the count and the page can never disagree.
99. As a shopper, I want each line to show a 96px `--kozo` field holding a contained packshot, never a crop, so that the image rule holds even at thumbnail size.
100. As a shopper, I want the two `poltrona-lina` acabamentos to be visibly distinct at thumbnail size, so that the argument for showing an image in the cart is testable.
101. As a shopper, I want the montagem toggle per line, so that I can assemble one piece myself and not another.
102. As a shopper, I want a resumo do pedido with subtotal, frete, montagem and total, all derived, so that no figure in the summary is typed.
103. As a shopper, I want items that ship separately to split into more than one delivery group, so that the freight arithmetic is visible as groups rather than hidden in a total.
104. As a shopper with an item that went esgotado, I want the CTA disabled with its reason associated by `aria-describedby`, so that the blockage is audible and not merely visible.
105. As a shopper with an empty cart, I want an empty state that offers the way on, so that zero items is a designed surface.
106. As a shopper, I want the cart to carry no régua, so that the first authored absence holds.
107. As a shopper, I want a removed line to disappear as a cut, so that the dim's meaning — stale, content is coming — is not inverted by a fade to nothing.
108. As a screen-reader user, I want quantity changes announced through a polite live region naming the piece and its new quantidade, so that the change reaches me.
109. As a screen-reader user, I want `REMOVER` to name its piece in its accessible label, so that a list of identical buttons is navigable.

### Checkout and confirmation

110. As a shopper, I want a single page with three accordion sections — Identificação, Entrega, Pagamento — and a sticky resumo, so that I can see the whole flow at once.
111. As a shopper, I want CPF and CEP-autofill in the flow, so that the checkout behaves the way Brazilian checkouts behave.
112. As a shopper, I want completed sections to collapse to a summary row, so that the page's geometry stays legible as I progress.
113. As a shopper, I want to choose padrão or agendada delivery, so that the modality choice belongs to checkout as the cart handed it over.
114. As a shopper, I want to choose Pix or cartão, and with cartão to choose a parcela count within the policy maximum, so that the payment step reflects the same derivation the produto page showed.
115. As a shopper, I want no LGPD consent checkbox, so that the store does not ask for a basis it does not rely on.
116. As a shopper, I want inline field errors split into Corrigível and Fato in the Corpo S voice, so that the two classes of message stay distinguishable.
117. As a shopper who presses pay, I want a 1500ms beat and then a full-bleed statement, so that the admission reads as authored rather than apologetic.
118. As a shopper, I want the wash to arrive as a cut rather than a fade, so that the moment the surface exists to admit was never real work is not dramatised.
119. As a shopper, I want the statement to say plainly that nothing was charged and that nothing I typed left this browser, so that the disclosure is a literal claim the build honours.
120. As a shopper, I want the confirmation to be a complete record of what I chose, so that the admission does not cost me the summary.
121. As a shopper, I want the order number to be the constant `0000`, so that no sequence is implied.
122. As a shopper, I want the arrependimento notice on the confirmation together with the means of exercising it — a link to `/contato?assunto=arrependimento` — so that the site is its own withdrawal tool as the decree requires.
123. As a shopper, I want no QR code, no receipt and no confirmation e-mail, so that no fabricated artefact stands in for a transaction.
124. As a shopper, I want the cart resolved exactly as `checkout.md` §11 fixes, so that the flow's end state is defined.
125. As a shopper, I want nothing persisted and nothing transmitted anywhere in the flow, so that the statement on the confirmation is true of the code and not only of the copy.

### Inspirações

126. As a reader at `/inspiracoes`, I want exactly four articles, one per ambiente, each row annotated with its room, so that the closed set is legible as closed.
127. As a reader, I want no `?ambiente=` filter and no empty state on the index, so that the store does not compute what is already on screen.
128. As a reader in an article, I want a composed, photographed room in the ambiente genre, so that the editorial lane has its own composition without a second photographic rule.
129. As a reader, I want no person and no human trace in any article photograph, so that the no-person rule is exceptionless across the store.
130. As a reader, I want a legenda beneath each photograph naming the visible produtos as links, so that a room story reaches the catálogo.
131. As a reader, I want every legenda slug to resolve to a real produto that lists under that article's room, so that no editorial link is broken.
132. As a reader, I want no price and no régua in Inspirações, so that the second authored absence holds.
133. As a reader, I want an article to carry no date, no author and no category, so that it stays an Artigo rather than becoming a blog post.

### Institucional

134. As a reader at `/sobre`, I want five statements — four refusals and one affirmation — each with a short body, as final shipped copy, so that the wording that *is* the structure is not paraphrased.
135. As a reader, I want `/sobre` to have no page title, its first statement serving as the `<h1>`, so that the registered five-Mincho exception is paid for.
136. As a reader, I want `/sobre` to close with exactly one régua reading `DESDE 2014`, so that the page's single gesture is legal without an object.
137. As a reader, I want `/sobre` to end without a CTA, so that the page stops rather than pushing.
138. As a reader, I want no founder biography, no portrait and no designer roster, so that no credential is fabricated.
139. As a reader, I want `/sobre` to have no photograph, so that the third authored absence holds.
140. As a visitor at `/contato`, I want a three-field form followed by the showroom, with the channels omitted because the footer holds them, so that the page does not quote its own footer.
141. As a visitor who submits the form, I want the form to swap in place to `Nada foi enviado.`, so that the store refuses the sixth fabricated artefact plainly.
142. As a visitor, I want the showroom stated as real with its hours and no embedded map, so that the address is a fact rather than a widget.
143. As a visitor arriving at `/contato?assunto=arrependimento`, I want the page aimed at withdrawal without an *assunto* select existing, so that the store aims the link rather than asking me to operate a control.
144. As a reader at a `/politicas/[slug]`, I want title, date, a non-sticky side index and the document, so that the version is visible and the text is never hidden.
145. As a reader, I want no accordion in a policy page, so that ostensive text is never collapsed.
146. As a reader, I want the side index only when the document has four or more sections, so that a short policy is not given furniture.
147. As a reader, I want each of the four policies to carry its own headings within one shared layout, so that the template does not flatten four different documents.
148. As a reader, I want the shippable pt-BR statutory copy from `institucional.md` §11b, so that the verified wording is what ships.
149. As a reader, I want the refund duty stated as *de imediato, monetariamente atualizados*, so that art. 49's parágrafo único is not half-quoted.
150. As a reader, I want return collection and montagem refund stated as the store's cost, so that the accessory contract rescinds *sem qualquer ônus*.
151. As a reader, I want the montagem extension labelled a store grant beyond art. 49, so that nobody shortens it back to the statutory minimum.
152. As a reader, I want receipt of a contact message confirmed immediately by my own channel, with five days named as resolution rather than acknowledgement, so that the right duty is on the right clock.
153. As a reader, I want the LGPD basis stated as legitimate interest with a route to the policy, so that the basis matches the checkout's refusal of a consent checkbox.
154. As a reader, I want my right to sue where I live stated, so that no forum is elected against me.

### Error, 404 and loading surfaces

155. As a visitor at a URL that does not exist, I want a real `404` status, so that a crawler is told the truth.
156. As a visitor at a 404, I want the policy template's plain text lane with full navbar and footer, so that the store's structure survives its own error page.
157. As a visitor at a 404, I want no photograph and no régua, so that the fourth and fifth authored absences hold.
158. As a visitor at a 404, I want copy that explains the store's enumerated catalogue rather than reporting a failure, so that the page is useful rather than apologetic.
159. As a visitor who hit a bad room × tipo pair, I want a recovery block offering that room's real tipos instead of the four ambientes, so that the offer differs without any claim about what I meant.
160. As a visitor hitting an unexpected error, I want the same lane, and a global error boundary that assumes nothing and reads no data, so that the last-resort surface cannot fail on data.
161. As a visitor waiting for a region to be replaced, I want the old content to persist at `0.45` opacity with the chrome never dimming, so that the store never shows me the silhouette of information it does not have.
162. As a build session, I want no `loading.tsx`, no skeleton, no fade and no blur-up anywhere, so that the aesthetic rule and the real-`404` requirement stay the same rule.

### Imagens

163. As a build session, I want two photographic genres only — retrato and ambiente — with Inspirações holding a composition rather than a third genre, so that `marca.md` §7's corrected rule is what ships.
164. As a visitor, I want every frame in one of four enumerated ratios computed from `medidas`, plus `16:9` for an article thumb, so that "the piece's real proportion" is mechanically true.
165. As a visitor, I want nothing ever cropped, with square slots rendered as `--kozo` fields holding a contained packshot, so that the crop question never returns.
166. As a build session, I want exactly one `principal` image per produto, first in the list, so that the ordering invariant is enforceable.
167. As a build session, I want `cotas` non-empty only where `medidas` supplies the figure, so that "no empty régua" is caught in data rather than in review.
168. As a visitor, I want `alt` templated for predictable slots and authored where it carries real information, so that alt text is never filler.
169. As a build session, I want no decorative image to exist, so that every image is content.
170. As a visitor whose image fails to load, I want the flat field with no icon and no `IMAGEM INDISPONÍVEL`, so that the seventh refusal holds.
171. As a build session, I want phase 1 to hotlink Unsplash with repetition explicitly fine, except the `poltrona-lina` pair, so that structural rules can be tested before the photographs exist.
172. As a build session, I want the phase-1 placeholders never treated as evidence for a photographic decision, so that the two phases do not contaminate each other.
173. As a build session, I want `images.remotePatterns` configured for `images.unsplash.com`, so that phase 1 renders at all.
174. As a build session, I want `Familia.desenho` as inline SVG in the régua's own grammar, so that the technical elevation belongs to the identity.

### Metadata and SEO

175. As a crawler, I want titles as the bare page name plus ` | Canto Zen`, with the home unsuffixed, so that the title spends nothing.
176. As a crawler, I want descriptions derived from data or taken from an authored line the data already holds, never written for the metadata layer, so that no claim exists only in the head.
177. As a crawler, I want no description at all on the cart, the checkout, `/pedido-confirmado` and the 404, so that the fourth authored absence holds.
178. As a crawler, I want three structured-data node types only — `Product`, `BreadcrumbList`, `Article` — so that the store's machine claims match its page claims.
179. As a crawler, I want no `offers` node, so that the store does not assert in machine-readable form the exact claim its checkout exists to admit it cannot make.
180. As a crawler, I want no `Organization`, `LocalBusiness`, `AggregateRating`, `ItemList` or `WebSite`+`SearchAction`, so that a name is offered without a credential.
181. As a crawler, I want the `Product` node deliberately ineligible for merchant rich results, so that nobody "fixes" the omission later.
182. As a crawler, I want `pagina` to be the sole indexable query param, with all filter state `noindex` and canonical to the clean path, so that the index is not filled with filter permutations.
183. As a social platform, I want the OG image contained in a 1200×630 `--kozo` field and never cropped, with `og:type` never `product`, so that the one frame the store does not control still obeys its own rule.
184. As a social platform, I want the institutional pages to offer no card and no fallback wordmark, so that no image is invented to fill a slot.

### Accessibility

185. As a visitor, I want the store to meet the nine written obligations in `acessibilidade.md` §2 without asserting WCAG conformance, so that the commitment matches what has actually been audited.
186. As a build session, I want `acessibilidade.md` to bind normatively, with a more specific page spec winning and a weaker or silent one losing, so that surfaces built in parallel inherit the floor.
187. As a visitor, I want every text pair to clear 4.5:1 and every control boundary 3:1 against its real ground, so that the measured table is the shipped palette.
188. As a keyboard user, I want one generic overlay rule — Escape, focus return, containment, `aria-expanded`, one at a time — applied to every overlay including ones specced later, so that the rule does not have to be rediscovered.
189. As a build session, I want no skip link, because seven tab stops is not a barrier, so that the omission is a decision rather than a gap.

---

## Implementation Decisions

### Module shape

- **One catálogo module** is the store's only data source. Every route reads it;
  no route holds a literal produto, price, prazo or address. Its public surface
  is *records plus derivation functions* — the nine derived fields are computed
  at read time, never stored, because `dados.md` §8 states them as rules and a
  stored copy is a second source that can drift.
- Records are transcribed as **TypeScript literals**, which `produto.md`
  explicitly leaves to the build session. TS over JSON because the taxonomy is
  keyed by slug and the compiler can hold the key sets; TS over MDX because
  nothing here is prose with markup.
- **One file for the catalogue tables**, following `dados.md`'s own reasoning:
  the deliverable is cross-reference integrity, and splitting the tables is how
  references drift. Derivations, the freight rule and the invariant assertions
  live in sibling modules.
- **`politicas` and `Loja` are single exported constants.** The footer and
  `/contato` both read `Loja`, which is the whole reason it is one object.
- **Taxonomy is entities keyed by slug** — `Ambiente` (holding its curated
  `tipos[]`), `Tipo`, `Cor`, `Material`, `Colecao`, `Familia` — not string
  unions with lookup tables bolted on.
- `Familia` stays **routeless**. It names the "outros acabamentos" strip and
  carries `medidas`, `designer` and `desenho`, and nothing routes to it.

### Derivation surface

The catálogo module exposes, at minimum:

- à-vista from `precoTabela` and `politicas.descontoPixPercent`
- the parcelamento line and the full 1..N table from `politicas.parcelasMax`
  and `politicas.parcelaMinimaCentavos`
- montagem price from `montagem.nivel` and `politicas.montagemCentavos`
- garantia as `garantiaMeses ?? politicas.garantiaPadraoMeses`
- `cor` and `materiais` from `acabamento` plus the tipo's structural material
- `embalagem` from `medidas` and the tipo's density
- `designer` from tipo
- the frete quote as `(cep, embalagem, freteGratis) -> OpcaoFrete[] | NaoAtendida`

The frete function's region table is **`dados.md` §4.1's corrected one**, not
`carrinho.md` §8's — prefix `69` is unserved, `77` is Norte, `78`–`79` are
Centro-Oeste. Cubed weight is `max(pesoKg, volume/6000)` and the resulting
figures are large on purpose; §4.3 records that as intentional.

CEP resolution has three outcomes, and they are distinct in the return type:
a fixture CEP (region + autofill), a served non-fixture CEP (region, no
autofill, address fields open and editable), and an unserved prefix. Malformed
input never reaches this function — digit count is a `Corrigível` field
validation, and the three outcomes above are all `Fato`.

### State

Two pieces of client state, both browser-only, both already typed by their specs:

```ts
// carrinho.md §9
type ItemCarrinho = { slug: string; quantidade: number; montagem: boolean };
type Carrinho = { itens: ItemCarrinho[]; cep?: string };

// checkout.md §12
type Checkout = {
  identificacao: { email: string; cpf: string; nome: string; celular: string };
  entrega: {
    cep: string; logradouro: string; numero: string; complemento?: string;
    bairro: string; cidade: string; uf: string;
    modalidade: 'padrao' | 'agendada';
  };
  pagamento: { metodo: 'pix' } | { metodo: 'cartao'; parcelas: number };
};
```

- `Carrinho` feeds the navbar counter — one source, so the badge and the page
  cannot disagree. Adding a slug already present increments; removal is
  explicit. Persistence across reloads is a build call and nothing depends on it.
- **`Checkout` is never persisted and never transmitted.** This is a constraint
  on the build, not a description of one: the interstício claims literally that
  nothing left the browser. No fetch, no server action, no analytics call, no
  `localStorage` write in the checkout flow.
- The session CEP is shared between the produto page, the cart and the checkout
  through `Carrinho.cep`.

### Routing

- Rooms are top-level static routes; `/[ambiente]/[tipo]` is generated **only**
  for the enumerated pairs in `rotas.md`, and everything else in that shape is a
  404. This means the room and pair routes are enumerated at build time rather
  than validated at request time.
- Produtos are flat at `/produtos/[slug]`; the breadcrumb reads
  `ambientePrincipal`, never the referrer.
- Filter state is query params in pt-BR keys (`cor`, `material`, `preco`,
  `ordem`, `pagina`, `ambiente`). A surface **ignores** a key it does not
  support rather than erroring. `?q=` stays reserved and unused;
  `/inspiracoes?ambiente=` is retired.
- `/colecoes` has no index. `/politicas/[slug]` is exactly four slugs, and
  `prazos-e-entrega` is **not** one of them — the three links that pointed there
  target `/politicas/entrega-e-frete`.
- **404 vs. empty result never swaps**: URL does not exist → `404`; state
  matches nothing → `200` with a zero-results surface.
- Because `not-found.tsx` under Next 16 returns `200` whenever the response
  streams, **no route defines `loading.tsx`** and no route streams. This is the
  same decision as the no-skeleton rule, arrived at from the compliance side.

### Styling and chrome

- Tokens land once as CSS custom properties on `:root` in `app/globals.css`,
  with the type scale, the focus ring, and the two-entry motion vocabulary.
  Tailwind v4 is already installed; tokens are the source and utilities read
  them.
- `app/layout.tsx` sets `lang="pt-BR"` and renders navbar + footer. The
  checkout's reduced footer is a variant of the same component reading the same
  `Loja`, not a second footer.
- Motion is a **closed list of two** over a closed property allowlist
  (colour-carrying properties and `opacity`), `120ms linear`, following the
  pointer and never the keyboard, with one global `prefers-reduced-motion` rule
  that keeps end states and drops interpolation. `transform` is refused by name.
  Adding a third entry requires the `marca.md` §9.9 amendment protocol.
- Fonts are self-hosted from `fonts/` (Zen Old Mincho, Schibsted Grotesk), with
  tabular figures enabled on the Grotesk faces used for data.

### Images

- Phase 1 hotlinks Unsplash; `next.config.ts` gets `images.remotePatterns` for
  `images.unsplash.com`. Repetition is fine everywhere **except** the
  `poltrona-lina` pair, which must be visibly distinct at 96px or the cart's
  argument for its thumbnail is untestable.
- Ratios are computed from `medidas` — never authored on the image record.
- Square slots (cart 96px, checkout 64px) are `--kozo` fields containing a
  packshot; no crop path exists in the codebase.
- No `placeholder="blur"`, no fade-in, no skeleton, no error icon, no
  `IMAGEM INDISPONÍVEL` string.
- `Familia.desenho` is inline SVG, authored in the régua's stroke grammar.

### Metadata

- Titles: `{name} | Canto Zen`, home unsuffixed.
- Descriptions are derived or are an authored line the data already holds; four
  surfaces carry none.
- JSON-LD: `Product` (facts, `Brand { name }`, **no `offers`**),
  `BreadcrumbList`, `Article`. Nothing else.
- `pagina` is the only indexable param; filtered views are `noindex` with a
  canonical to the clean path.

### The five hand-offs from `dados.md` §10

All five are in scope for this build and none of them is optional:

1. Transcribe §3 and §8 into the module shape above.
2. Choose the Unsplash URLs — 65 `principal`, ~8 additional roles, 4 ambientes,
   2 coleções, 12 article photos, 59 família elevations.
3. Assert the invariants (see Testing Decisions).
4. Add `images.remotePatterns`. **Already done** — commit `aa0a6d6` added
   `images.unsplash.com` to `next.config.ts`.
5. Fix `lang="en"` in `app/layout.tsx`. **Already done** — the same commit set
   `lang="pt-BR"`.

Items 1–3 are the whole of the remaining hand-off, and item 3 is where the
leverage is.

### Build order

The specs are independent enough to parallelise, but not from a cold start.
Three phases:

1. **Foundation** — tokens, fonts, layout, navbar, footer, the catálogo module
   with the six worked exemplars, the derivation functions, the freight rule,
   the invariant suite. Nothing renders a product yet; everything downstream
   depends on all of it.
2. **Catalogue transcription and the browse surfaces** — the remaining 59
   produtos, then home, room/tipo/coleção/`/produtos` listings, produto page,
   Inspirações. These can run in parallel once phase 1 is green.
3. **Commerce and institucional** — carrinho, checkout, `/pedido-confirmado`,
   `/sobre`, `/contato`, the four políticas, the error surfaces. Checkout
   depends on the cart; the rest are independent.

The invariant suite is phase 1 work specifically because phase 2 is where the
cross-references get written, and an assertion added afterwards catches nothing
that was not already shipped.

---

## Testing Decisions

### What a good test is here

A test asserts what a reader or a caller can observe: the figure rendered on
the page, the status code returned, the shape a function hands back. It does not
assert that a component called a helper, that state is held in a particular
hook, or that a file is laid out a particular way — those are exactly the
choices the specs left to the build session, and pinning them makes the tests an
obstacle to the refactor the build will want.

The specs make this unusually easy to honour, because almost every rule in them
is already stated as an observable: a hex value, a ratio, a status code, a
string of pt-BR copy, an arithmetic result. Where a spec states a *refusal* —
no `offers` node, no skeleton, no `R$ 0,00` — the test asserts the absence in
rendered output, which is observable too.

### Seam 1 — the catálogo module's public API

The higher-value seam, and the only place a large class of defects is visible at
all. Pure functions and plain data, no DOM, no server.

**What it covers.** The nine derivation rules against the six worked exemplars
in `dados.md` §9, one case per structural shape. The freight rule against all
seven fixture CEPs plus at least one served non-fixture CEP and one malformed
input. The parcelamento boundary (the piece whose price sits either side of
`parcelaMinimaCentavos × N`). The garantia fallback, which every one of the 65
produtos exercises. The `necessaria: false` luminárias. The empty
`medidasExtras` tipos.

**The invariant suite** — the assertions `dados.md` §10 names, none of which the
type system catches, run as tests over the whole catalogue rather than as
runtime checks:

- no duplicate `pecas` within an Artigo
- every Artigo piece lists under that Artigo's room
- famílias share `medidas` across their acabamentos
- exactly one `principal` per produto, first in `imagens`
- `cotas` non-empty only where `medidas` supplies the figure
- `ConteudoHome.destaqueHome` resolves to a produto whose `principal` declares
  `cotas: ['largura']`
- every produto's `tipo` is in its `ambientePrincipal`'s curated `tipos[]`
- every slug referenced by `destaques[]`, `colecaoDestaque`,
  `Colecao.produtos[]` and all twelve `FotoArtigo.pecas[]` resolves
- every `ambiente × tipo` pair with at least one produto is an enumerated route,
  and every enumerated pair has at least three produtos (the three-column grid
  floor `dados.md` §1 argues from)
- the six freight regions plus the `69` carve-out partition prefixes `01`–`99`
  with no overlap and at least one unserved prefix

That last one is the test that would have caught the defect `dados.md` §4.1 had
to correct after three specs had already been written against the unreachable
state. It is worth writing for that reason alone.

### Seam 2 — the rendered route

A route in, rendered output plus status out. Exercised against a built app
served locally, so what is asserted is what Next actually returns — which is the
only way the `404`-vs-`200` contract can be tested at all, since it is a
property of the response and not of a component.

**What it covers.**

- **Status contract.** `/cozinha/sofas` → `404`. `/politicas/prazos-e-entrega` →
  `404`. A filter combination matching nothing → `200`. A room, a produto, a
  coleção, an article → `200`. This is `rotas.md`'s hand-off to `erros.md`,
  and it is a contract precisely because it must never swap.
- **Metadata.** Title shape on a sampled route per kind; the four surfaces with
  no description; `noindex` on a filtered URL and its canonical pointing at the
  clean path; `pagina` indexable.
- **Structured data.** The three node types present where they belong, and —
  asserted as absences — no `offers`, no `Organization`, no `LocalBusiness`, no
  `AggregateRating`, no `ItemList`, no `SearchAction`, and `og:type` never
  `product`.
- **Derived figures reaching the page.** One produto page asserted end to end:
  the à-vista figure, the parcelamento line and the montagem price rendered as
  the module computes them. This is what proves the two seams are connected;
  everything else about pricing is tested at seam 1 where it is cheap.
- **Copy that is a commitment rather than direction.** The five `/sobre`
  statements, the confirmation's "nothing was charged" statement, the
  arrependimento notice in the footer on an arbitrary route, and the §11b
  statutory openers. These are the places where a paraphrase is a defect.
- **Refusals that are absences in output.** No `IMAGEM INDISPONÍVEL` string
  anywhere; no `R$ 0,00` on a `freteGratis` piece; `lang="pt-BR"` on every
  route.

**What this seam does not cover.** Interaction — the CEP widget, the accordion,
the stepper, the mega menu. Those need a browser, and a browser-driving layer is
a third seam with its own infrastructure. It is **out of scope for this spec**;
the interaction logic that can be pulled below the DOM (CEP resolution, cart
mutation, parcela selection) is pulled there and tested at seam 1 instead, which
is where the reasoning worth testing actually lives. What remains untested is
the wiring, and that is the honest trade.

### Runner

`bun test`, which the runtime already provides — no dependency to add, and the
project is Bun-native. Seam 1 is plain unit tests. Seam 2 builds once and serves
the app, then fetches routes and asserts over the returned HTML; parsing is
whatever the assertions need, not a component-testing framework.

### Prior art

There is none — the repository has no tests and no test runner today, so this
spec establishes the pattern. That is a reason to keep both seams narrow and
conventional: the first test file in a repository becomes the template whether
or not anyone intends it to.

---

## Out of Scope

Inherited from the map's own out-of-scope list, and not reopened here:

- **Auth, account, order history, wishlist.**
- **Real payment processing, gateway integration, order persistence.**
- **Backend, CMS or database of any kind.** Data shapes are specified; sources
  are not, and the catálogo module is a module, not a client.
- **i18n or an English locale.** pt-BR only.
- **Dark mode.**
- **Search, and any search-results surface.** `?q=` stays reserved and unused.

Scoped out of *this build* specifically:

- **Phase 2 imagery.** The prompt spine is authored in `imagens.md` §11 and the
  generated photographs land locally later. This build ships phase 1 hotlinks,
  under phase 1's rule that structural rules bind and photographic ones do not,
  and that a placeholder is never evidence.
- **A browser-driven interaction test layer.** Named in Testing Decisions as the
  known gap rather than silently omitted.
- **Reopening any closed ticket.** Where this document and a page spec disagree,
  the page spec wins and this document is wrong.
- **New entities or fields.** Two of the last three specs added none on
  purpose; a build session that needs a field has found either a transcription
  error or a decision the map already made elsewhere.

---

## Further Notes

**The specs are strict, and that is the point.** Nine derived fields, eight
standing refusals, five authored absences, closed lists for motion and
structured data, and an amendment protocol for the one section most likely to
grow. A build session's instinct on encountering one of these will sometimes be
to soften it — to add a skeleton, a fade, an `offers` node, an
`IMAGEM INDISPONÍVEL` fallback, a rounded corner. Each of those was argued and
refused, usually across two or three tickets, and the reasoning is written down
where the refusal is.

**Three specs correct earlier ones in place.** `dados.md` §11 lists them:
`carrinho.md` §8's freight regions, `home.md` §1's `produto.designer`, and the
three links to `/politicas/prazos-e-entrega`. The corrected text is in
`dados.md`; the original text is still in the file it corrects, marked. Read the
correction, not only the section.

**Three prototype branches exist** — `prototype/brand-direction`,
`prototype/navbar` (commit `1efb9a1`) and `prototype/checkout-disclosure`
(commit `a60d4da`). None of them is promotable; all were written under prototype constraints. They are
evidence for decisions already recorded, not code to lift.

**The freight numbers look wrong and are not.** Cubed weight at `/6000` quotes
the hero sofá at roughly R$ 2.664 to São Paulo and R$ 5.856 to Belém. This is
recorded as intentional in `dados.md` §4.3, and `freteGratis` on the five
largest pieces is the deliberate relief valve.

**`acessibilidade.md` is normative, not a summary.** It carries a precedence
line so it binds surfaces nobody has specced yet, which is what makes it usable
when phases 2 and 3 run in parallel.
