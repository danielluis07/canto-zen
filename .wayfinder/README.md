# Wayfinder tracker (local markdown)

No issue tracker is configured for this repo, so wayfinding uses files.

- `map.md` — the map. Labelled `wayfinder:map`. Load it once per session.
- `tickets/NNN-slug.md` — child issues of the map. The filename stem is the ticket id.

Frontmatter fields: `title`, `parent`, `labels`, `assignee`, `blocked-by`, `status`.

**Claim** a ticket by setting `assignee` before doing any work.
**Unblocked** = every id in `blocked-by` has `status: closed`.
**Frontier** = open + unblocked + unassigned.

Frontier query:

```sh
bash .wayfinder/frontier.sh
```

**Resolving**: append a `## Resolution` section to the ticket body, set `status: closed`,
and add a one-line pointer to the map's *Decisions so far*.
