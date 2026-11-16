# Tasks

## 1. Verifier

- [x] 1.1 Export `read`, `section` and `listChanges` from `scripts/check.mjs`. Add `scripts/verify.mjs` with the checks for a complete change: complete-change detection, spec scenarios against `qa.md`, `Verify:` in each task. Add `scripts/verify.test.mjs`. Verify: `node --test 'scripts/*.test.mjs'` passes with a test for each scenario of the requirements "Verify only a complete change", "Spec scenarios have evidence" and "Tasks name their verification". Documents: none.
- [ ] 1.2 Add the project commands to `scripts/verify.mjs`: read the `Lint`, `Test` and `Verify` rows of the commands table in `AGENTS.md`, run them in the project folder with a time limit of 300 seconds, and warn one time when no command is named. Verify: `node --test 'scripts/*.test.mjs'` passes with a test for each scenario of "Project commands pass" and "Project without commands". Documents: none.
- [ ] 1.3 Add the hook mode to `scripts/verify.mjs`: block with the reason, count the blocks for each change, stop to block after 3 blocks in a row, start the count again when all checks pass. Add the Stop hook to `hooks/hooks.json` with a timeout of 960 seconds. Verify: `node --test 'scripts/*.test.mjs'` passes with a test for each scenario of "Block the stop with a reason", "Limit of blocks" and "Document check does not block". `claude plugin validate .` passes. Documents: none.

## 2. Templates and documents

- [ ] 2.1 Add the commands table with the rows `Lint`, `Test` and `Verify` to `templates/project/AGENTS.md`. Add "Name the verification of each task with `Verify:`." to the tasks rule in `templates/project/openspec/config.yaml` and in `openspec/config.yaml` of sparc. Rename the sparc commands in `AGENTS.md` to `Test` and `Lint`. Verify: `node scripts/verify.mjs` on sparc runs `actionlint` and the tests and reports their result, and `node scripts/check.mjs` reports no finding. Documents: AGENTS.md, templates.
- [ ] 2.2 Add the verifier to the README key features and to the "Add Project Requirements" section (the command names). Add the container "Verifier" to the C4 container diagram. Add the verifier script to the structure table in `AGENTS.md`. Verify: `node scripts/check.mjs` reports no finding. Documents: README.md, c4.md, AGENTS.md.
