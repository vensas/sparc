# Tasks

## 1. QA engineer agent (can run in parallel with group 2)

- [x] 1.1 Add `agents/qa-engineer.md`: scope, automation first, the test-tool rule, the `qa.md` format, the rule links and a "Do not" list (no unit tests, no product code, no new tool without an approved ADR). Verify: `claude plugin validate .` passes and `claude -p --plugin-dir .` lists `sparc:qa-engineer`. Documents: none.

## 2. Skills and product owner (can run in parallel with group 1)

- [x] 2.1 In `skills/apply/SKILL.md`, add a QA step after the task groups: the failed-scenario loop, the missing-tool stop, the check that QA commits change only test files and `qa.md`, and acceptance from `qa.md`. Verify: `claude plugin validate .` passes. Documents: none.
- [x] 2.2 In `agents/product-owner.md`, change "Acceptance and issues": accept from `qa.md` and do only the manual checks. Verify: `claude plugin validate .` passes. Documents: none.
- [x] 2.3 In `skills/propose/SKILL.md`, tell the architect to name the integration or end-to-end test tool and its command in `design.md`, or to write a `proposed` project ADR. Verify: `claude plugin validate .` passes. Documents: none.
- [x] 2.4 In `skills/archive/SKILL.md` step 2, run the test commands in `AGENTS.md`. Verify: `claude plugin validate .` passes. Documents: none.

## 3. Documents (after groups 1 and 2)

- [ ] 3.1 Update README "Key Features" (five agents), the `AGENTS.md` structure and the `.claude-plugin/plugin.json` description. Verify: `node scripts/check.mjs` and `claude plugin validate .` pass. Documents: README.md, AGENTS.md.
- [ ] 3.2 Add "QA engineer" to the C4 container "Agents" in `docs/architecture/c4.md`. Verify: `node scripts/check.mjs` passes. Documents: c4.md.
- [ ] 3.3 Add `CHANGELOG.md` Unreleased entries: Added (QA engineer agent, `qa.md`) and Changed (apply, propose and archive skills, product owner acceptance). Verify: `node scripts/check.mjs` passes. Documents: CHANGELOG.md.

## Workflow follow-up

- At archive, accept and lock ADR-0007.
- Add ADR-0007 to the canvas "Core Decisions".
- Link the `qa-engineering` spec in the canvas "Core Functions".
- Check the backlog item.
