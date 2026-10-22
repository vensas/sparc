# AGENTS.md

This project uses sparc (spec-driven development with OpenSpec). This file tells agents how to work here.

## Commands

TODO(sparc): Write the commands to install, build, test and run. Run each command before you write it.

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

## Rules

- Write all English text in ASD-STE100 Simplified Technical English.
- Write only what you know. Get evidence from files, tests or the user. Write open points in the canvas.
- Keep it simple. Keep each fact in one place (DRY). Link to it from other places.
- Change behavior only through an OpenSpec change: propose, approve, apply, archive.
- After each step, keep the documents in sync. Use `/sparc:sync`.
- Do not change the body of an accepted ADR. Amend it or supersede it.
