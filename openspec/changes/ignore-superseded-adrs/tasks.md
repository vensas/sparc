# Tasks

## 1. Current ADRs

- [x] 1.1 Add the check of the ADR index to `scripts/check.mjs` as design.md tells. Add a test for each scenario of "Canvas lists each ADR with its status" to `scripts/check.test.mjs`. Verify: `node --test 'scripts/*.test.mjs'` passes, and `node scripts/check.mjs` reports no finding for sparc. Documents: none.
- [ ] 1.2 Add the section "Current ADRs" to `rules/adr.md`. Add a rule line with a link to it to the sparc text of `templates/project/AGENTS.md` and of `AGENTS.md`. Change step 1 of `rules/roles/architect.md` to read the current ADRs. Add a test for "Agents follow only current ADRs: Rule in a project". Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: AGENTS.md.
- [ ] 1.3 Add the check of the ADR list of open changes to `scripts/check.mjs` as design.md tells. Add "Start the ADR list with `ADRs:`." to the design rule in `templates/project/openspec/config.yaml` and `openspec/config.yaml`. Add a test for each scenario of "Open changes do not use old ADRs" to `scripts/check.test.mjs`. Verify: `node --test 'scripts/*.test.mjs'` passes, and `node scripts/check.mjs` reports no finding for sparc. Documents: none.
- [ ] 1.4 Add ADR-0016 and the open point "a grep hit in a superseded ADR does not show the status" to the canvas. Verify: `node scripts/check.mjs` reports no finding. Documents: docs/architecture/canvas.md.

## Workflow follow-up

- QA: run the live test of "Agents follow only current ADRs: Agent finds a superseded ADR" (see design.md - Test).
- At archive: set ADR-0016 to `accepted`. Tell existing projects in the changelog to list each ADR in the canvas.
