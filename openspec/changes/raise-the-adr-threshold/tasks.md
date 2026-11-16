# Tasks

## 1. When to write an ADR

- [x] 1.1 Add the section "When to write an ADR" to `rules/adr.md` as design.md tells. Change step 5 of `rules/roles/architect.md` to refer to it. Add a test for each scenario of "ADR only for a major decision" to `scripts/adr-management.test.mjs`. Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: none.

## 2. Options and trade-offs

- [x] 2.1 Add the check of options and trade-offs of `proposed` ADRs to `scripts/check.mjs` as design.md tells. Add a test for each check scenario of "Proposed ADR gives its options and trade-offs" to `scripts/check.test.mjs`. Verify: `node --test 'scripts/*.test.mjs'` passes, and `node scripts/check.mjs` reports no finding for sparc. Documents: none.
- [ ] 2.2 Add the two comments to `templates/project/docs/adr/0000-template.md` and `docs/adr/0000-template.md`. Add a test for "Proposed ADR gives its options and trade-offs: Template tells the requirement". Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: none.

## 3. Test tool in the design

- [ ] 3.1 Change the test tool text in `skills/propose/SKILL.md`, step 4.1 of `skills/apply/SKILL.md` and the section "Test tool" and "Do not" of `rules/roles/qa-engineer.md` as design.md tells. Change the tests of "Design names the test tool" in `scripts/change-workflow.test.mjs`. Add tests for "Use the test tools of the project" to `scripts/qa-engineer.test.mjs`. Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: none.
- [ ] 3.2 Add the open point "central to the idea of the project needs judgement, and no check decides it" to the canvas section "Core Risks and Missing Information". Verify: `node scripts/check.mjs` reports no finding. Documents: docs/architecture/canvas.md.

## Workflow follow-up

- QA: use this change as evidence for "Decision that is not major": it adds no ADR.
- At archive: tell existing projects in the changelog that new ADRs need two or more options with trade-offs, and that `/sparc:update` brings the new template.
