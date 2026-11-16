# Tasks

## 1. project-setup

- [x] 1.1 Add `scripts/project-setup.test.mjs` with one test for each scenario of `specs/project-setup/spec.md`, as design.md decision 1 tells. If a test cannot pass on the current `skills/init/SKILL.md`, fix the scenario, not the skill (design.md decision 4). Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: none.

## 2. change-workflow

- [x] 2.1 Add `scripts/change-workflow.test.mjs` with one test for each scenario of `specs/change-workflow/spec.md`. The tests read `skills/propose/SKILL.md`, `skills/apply/SKILL.md`, `skills/archive/SKILL.md` and the rules that they link. Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: none.

## 3. Existing capabilities

- [ ] 3.1 Add one test for each scenario of `specs/document-set/spec.md` to `scripts/document-set.test.mjs`. The tests read `skills/sync/SKILL.md` and `rules/docs.md`. Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: none.
- [ ] 3.2 Add `scripts/adr-management.test.mjs`, `scripts/release-conventions.test.mjs` and `scripts/project-update.test.mjs` with one test for each scenario of the deltas of these capabilities. Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: none.

## 4. Canvas

- [ ] 4.1 In `docs/architecture/canvas.md`, section "Core Functions": add a line for `project-setup` and `change-workflow` with a link to `../../openspec/specs/<capability>/spec.md`. Add sync, adr, release and update to the lines of their capabilities. Remove the line that says that the skills have no spec. In "Core Risks and Missing Information", add that most skill scenarios have a text test and no recorded run. Verify: `node scripts/check.mjs` gives no finding, and `grep -n "no spec" docs/architecture/canvas.md` finds nothing. Documents: docs/architecture/canvas.md.

## Workflow follow-up

- QA: record the history evidence of design.md "Proof of each scenario" in `qa.md`.
- At archive: make sure that `openspec/specs/project-setup/spec.md` and `openspec/specs/change-workflow/spec.md` exist, so that the canvas links work. Remove the backlog item of this change.
