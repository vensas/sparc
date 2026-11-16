# Design

## Context

See proposal.md - Why. `scripts/check.mjs` has `checkAdrs`, which reads the status of each ADR, and `checkCanvas`, which checks only the sections. The canvas template tells: "One line and a link for each ADR in `docs/adr/`." No code checks this. The canvas of sparc lists each ADR and names the status of ADR-0004, ADR-0006 and ADR-0009.

## Goals / Non-Goals

**Goals:**

- One rule that tells which ADRs are current, in the places that agents read.
- A correct ADR index, checked without an LLM.

**Non-Goals:**

- Changes to decided ADRs or to their protection.

## Decisions

### Rule and index, not a body notice or a subfolder

See [ADR-0016](../../../docs/adr/0016-mark-current-adrs-through-a-rule-and-the-canvas-index.md). The rule has one home: a section "Current ADRs" in `rules/adr.md`. `AGENTS.md` has one short line that links to it, because `AGENTS.md` is in the context of each session. The architect role step 1 reads "the current ADRs (see `../adr.md`)".

### Rejected ADRs get the same treatment

A rejected ADR was never a decision. The canvas line and the rule treat it as a superseded or deprecated ADR.

### Check of the ADR index

- `checkAdrs` returns the number, the file name and the status of each ADR.
- A new function reads the section "Core Decisions" of the canvas. For each ADR, it finds the lines that contain the file name. No line: finding "ADR-NNNN has no line in Core Decisions". For the status `superseded by ADR-NNNN`, `deprecated` or `rejected`: the line must contain the status text, else finding "line of ADR-NNNN does not name its status <status>".
- The check runs only when the canvas exists, as `checkCanvas` does.

### Test

Integration test tool: `node --test 'scripts/*.test.mjs'` (see AGENTS.md). `scripts/check.test.mjs` gets one test for each scenario of "Canvas lists each ADR with its status", with a temporary project. A test reads `rules/adr.md` and `templates/project/AGENTS.md` for "Rule in a project". The scenario "Agent finds a superseded ADR" is a manual live test: `claude -p` with `--plugin-dir .` in sparc asks "Do the sparc roles run the code review in the current session? Answer with the ADR number that decides it." The expected answer names ADR-0015, not ADR-0009.

ADRs: [ADR-0016](../../../docs/adr/0016-mark-current-adrs-through-a-rule-and-the-canvas-index.md) is new.

No C4 impact.

## Risks / Trade-offs

- [The agent does not obey the rule] → The rule is in `AGENTS.md`, and the live test shows the effect. A grep hit stays a risk. Open point in the canvas.
- [New findings in existing projects] → The findings warn and do not block. `/sparc:sync` fixes the canvas.

## Migration Plan

`/sparc:update` replaces the sparc text of `AGENTS.md`. The changelog tells existing projects to list each ADR in the canvas.
