#!/usr/bin/env bash
# Lists open, unblocked, unclaimed tickets.
cd "$(dirname "$0")/tickets" || exit 1
status_of() { sed -n 's/^status: *//p' "$1.md" 2>/dev/null | head -1; }
for f in *.md; do
  id="${f%.md}"
  [ "$(status_of "$id")" = "open" ] || continue
  [ -z "$(sed -n 's/^assignee: *//p' "$f" | head -1)" ] || continue
  blockers=$(sed -n 's/^blocked-by: *\[\(.*\)\]/\1/p' "$f" | head -1 | tr -d ' ' | tr ',' '\n')
  ready=1
  for b in $blockers; do
    [ -n "$b" ] || continue
    [ "$(status_of "$b")" = "closed" ] || ready=0
  done
  [ "$ready" = "1" ] && printf '%s — %s\n' "$id" "$(sed -n 's/^title: *//p' "$f" | head -1)"
done
exit 0
