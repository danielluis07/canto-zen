# 3. Placeholder repetition is not a defect, and phase 2 is the owner's pass

Date: 2026-08-25

## Status

Accepted.

## Context

The home-page critique of 2026-08-25
(`.impeccable/critique/2026-08-25T15-33-55Z__app-loja-page-tsx.md`) opened its
Priority Issues with a **P0** — "the page asserts two things that are not true"
— whose first half was that the home renders the same photograph three times in
one scroll:

- `lib/catalogo/tabelas.ts:44` (Ambiente Sala) == `:3001` (artigo "A luz da
  tarde")
- `:54` (Quarto) == `:3043` ("O quarto como abrigo")
- `:3126` == `:3196` — the "Trabalhar em silêncio" thumb == the marcenaria
  closing photograph, under two different `alt` strings

It proposed an invariant forbidding a repeated `src` across `ambientes[].imagem`,
`artigos[].thumb`, `conteudoHome.marcenaria.imagem` and `produtos[].imagens[0]`,
plus sourcing six distinct photographs, plus dropping the marcenaria photograph
outright if none could be found. Issue #23 was filed against that finding.

The finding was raised against a rule that already exists and says the opposite.
[`docs/spec/imagens.md`](../spec/imagens.md) §10.1 states, of phase 1:

> **Repetition is explicitly fine.** The same photograph may serve twenty
> produtos. No effort is spent curating the placeholder set, because none of it
> survives.

and §10.2 suspends every *photographic* rule until phase 2 while binding the
*structural* ones. `PRODUCT.md` carries the same sequencing under Evidence:
"Photography is generated or from Unsplash. Phase 1 ships hotlinks; structural
image rules bind, photographic ones do not yet."

The critique's own Questions section asked the right question — *"Is 'Phase 1
ships hotlinks' a schedule, or an expired exemption?"* — and then scored the
page as though the answer were "expired". It is a schedule.

## Decision

**Image repetition in the current tree is intentional and is not a defect.** It
is not tracked as a bug, it does not cost a heuristic score, and no invariant
forbids it.

Three consequences follow, and they are the substance of this decision:

**1. No uniqueness invariant is added.** An invariant asserting distinct `src`
values across the home's image slots would encode a phase-2 property into the
phase-1 test suite, and would fail the whole suite for the duration of the phase
in which it is by design violated. The uniqueness that matters is guaranteed
structurally in phase 2 instead: §10.4's naming convention derives one file path
per slot from that slot's slug, so a generated set *cannot* collide.

**2. Divergent `alt` on a shared placeholder is correct, not a falsehood.**
§5's `alt` convention binds in phase 1 and is written per **slot**, not per
file. "Escrivaninha de carvalho vazia…" and "Bancada de marcenaria com peças em
acabamento e ferramentas de mão" describe the two slots the store is committing
to; that they currently resolve to one hotlinked JPEG is a property of the
placeholder, which no visitor of the shipped store will ever see. Rewriting
either `alt` to match today's pixels would corrupt the phase-2 manifest — the
`alt` strings are part of what the generation is written against.

**3. Phase 2 is the repo owner's pass, and it is last.** Sourcing the real set
is a single one-time operation (§10.4) performed at the end of development by
the owner, not incrementally by agents. Partial curation — replacing six
collisions now to quiet an audit — spends effort on assets that do not survive,
and violates §10.2's standing rule that *a placeholder is never evidence*: no
decision may be made because a stock photograph looked right or looked wrong.

The rest of the critique's P0 — the newsletter answering a valid submission with
"PRONTO. VOCÊ SERÁ AVISADO." when nothing is recorded or transmitted — is
untouched by this and remains a real defect. That half is a fabrication in copy,
which Product Principle 2 forbids outright and no phase suspends.

## Consequences

**The critique and issue #23 were corrected rather than closed.** The P0's image
half is struck from
`.impeccable/critique/2026-08-25T15-33-55Z__app-loja-page-tsx.md` and the issue
retitled to the newsletter alone. A finding that contradicts a closed spec is
not evidence the spec is wrong.

**`imagens.md` §10.1 now says "not a defect" in as many words.** The rule was
already there and was read past twice. It now carries an explicit note aimed at
auditors, so the next reviewer resolves this at the spec rather than at the
data.

**Audits of this tree are expected to note repetition and stop there.** Noting
it as an observation is fine and occasionally useful — flagging the *cart's*
carve-out (§10.3, the one família that must carry two visibly different
placeholders) genuinely is. Escalating repetition to a defect is not.

**The bet is that the exemption stays a schedule.** Its cost is that every
critique until phase 2 will see the seam the hiring audience would see, and the
store's own promise — "a reader who moves through fifteen routes and finds no
seam" — is not fully payable until that pass runs. That is accepted: the pass is
mechanical, it is planned, and it is the owner's.
