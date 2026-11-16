# AGENTS.md

This project uses sparc (spec-driven development with OpenSpec). This file tells agents how to work here.

## Commands

Run each command before you write it. When a change is complete, the sparc verifier runs the `Lint`, `Test` and `Verify` commands. Do not rename these rows.

| Task | Command |
|---|---|
| Install | TODO(sparc) |
| Build | TODO(sparc) |
| Lint | TODO(sparc) |
| Test | TODO(sparc) |
| Verify | TODO(sparc): optional, for example a smoke test against the running system. Remove the row if the project has none. |
| Run | TODO(sparc) |

## Structure

| Path | Content |
|---|---|
| `openspec/specs/` | Required behavior (source of truth) |
| `openspec/changes/` | Open changes: proposal, deltas, design, tasks |
| `docs/backlog.md` | Goal and items |
| `docs/architecture/` | C4 diagrams and architecture canvas |
| `docs/adr/` | Architecture decision records (MADR) |
| `docs/mockups/` | Static HTML/CSS mockups |

TODO(sparc): Add the source and test folders.

<!-- sparc:begin -->
## Rules

- Write all English text in ASD-STE100 Simplified Technical English.
- Write only what you know. Get evidence from files, tests or the user. Write open points in the canvas.
- Keep it simple. Keep each fact in one place (DRY). Link to it from other places.
- Change behavior only through an OpenSpec change: propose, apply, archive. Running apply approves the change.
- After each step, keep the documents in sync. Use `/sparc:sync`.
- Do not change a decided ADR. Amend it or supersede it.
- Follow only current ADRs: `accepted` or `amended`. For an ADR that is `superseded by ADR-NNNN`, follow the chain to the current ADR. Do not follow a `deprecated` or `rejected` ADR.
- Use Conventional Commits. Follow the workflow in `openspec/config.yaml` (`trunk` or `pull-request`). Keep `CHANGELOG.md` and the version in the manifest equal.
- Put project rules outside the sparc markers. `/sparc:update` replaces the text between them.
<!-- sparc:end -->
