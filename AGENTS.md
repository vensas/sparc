# AGENTS.md

This repository is sparc, a Claude Code plugin. sparc also uses itself: it is a sparc project.

## Commands

| Task | Command |
|---|---|
| Run the tests | `node --test 'scripts/*.test.mjs'` |
| Check the documents | `node scripts/check.mjs` |
| Validate the plugin | `claude plugin validate .` |
| Load the plugin for a test | `claude --plugin-dir .` |

## Structure

| Path | Content |
|---|---|
| `.claude-plugin/` | Plugin manifest and marketplace manifest |
| `agents/` | Agent definitions: product owner, architect, UX designer, software engineer |
| `skills/` | Skills: init, propose, apply, archive, sync, adr |
| `rules/` | Shared rules. Agents and skills link to them. Do not copy rule text. |
| `templates/project/` | Files that `/sparc:init` copies into a project |
| `scripts/check.mjs` | Document check without dependencies, and its tests |
| `hooks/hooks.json` | Stop and SubagentStop hooks that run the check |
| `openspec/` | Specs and changes of sparc |
| `docs/` | Backlog, C4 diagrams, canvas and ADRs of sparc |

## Rules

- Write all English text in ASD-STE100 Simplified Technical English.
- Write only what you know. Get evidence from files, tests or the user. Write open points in the canvas.
- Keep it simple. Keep each fact in one place (DRY). Link to it from other places.
- Change behavior only through an OpenSpec change: propose, approve, apply, archive.
- After each step, keep the documents in sync. Use `/sparc:sync`.
- Do not change the body of an accepted ADR. Amend it or supersede it.
- `scripts/check.mjs` has no dependencies. Keep it like that.
