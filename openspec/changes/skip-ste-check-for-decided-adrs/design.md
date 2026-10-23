## Context

See proposal.md for the reason. `checkAdrs` returns the paths of all ADRs. `check` adds them to the list of prose files for the placeholder check and the sentence check.

## Goals / Non-Goals

**Goals:**
- No sentence findings that nobody can fix.

**Non-Goals:**
- Changes to the other ADR checks.

## Decisions

- **Which ADRs.** All decided ADRs: `accepted`, `rejected`, `deprecated`, `amended` and `superseded by ADR-NNNN`. The `adr-management` spec protects all of them. Alternative: only `accepted`. Rejected, because the other decided statuses are also final for the body.
- **Code.** `checkAdrs` returns the ADR paths with their decided state. `check` gives all ADRs to the placeholder check and only the `proposed` ADRs to the sentence check. The existing `isDecided` function gives the state.

No ADR: the change is small and easy to change back.
C4 impact: none.
Test tool: `node --test 'scripts/*.test.mjs'` (node:test, see `AGENTS.md`).

## Risks / Trade-offs

- [A new amendment entry with a long sentence gets no finding] → Accepted. Amendments are short, and the code review reads them.
