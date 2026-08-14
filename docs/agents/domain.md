# Domain Docs — Single-Context Layout

## Location

| File | Purpose |
|------|---------|
| `CONTEXT.md` (repo root) | Central domain context for the entire project |
| `docs/adr/` (repo root) | Architecture Decision Records, organized chronologically or by topic |

This is **single-context**: all domain documentation lives at the repo root. No per-package or per-module context files are needed unless the project grows into a monorepo with multiple distinct domains.

## Consumer Rules

When an agent skill needs to understand this codebase's domain:

1. **Read `CONTEXT.md` first** — it contains the canonical vocabulary, key concepts, and reading order for domain docs.
2. **Check `docs/adr/` next** — ADRs provide historical decisions that inform current architecture. Read in reverse chronological order to understand recent changes.
3. **Follow cross-references** — both files may reference each other; treat them as a single document, not separate silos.

## Notes

- Edit `CONTEXT.md` and files under `docs/adr/` directly when adding new domain knowledge or decisions.
- Re-running the setup skill is only needed if you switch from single-context to multi-context (or vice versa).
