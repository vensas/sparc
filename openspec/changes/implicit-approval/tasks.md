# Tasks

## 1. Rule

- [x] 1.1 Rewrite `rules/approval.md`: apply approves a change, pull request approval or merge, explicit approval for other decisions, no label. Verify: `node --test 'scripts/*.test.mjs'` passes with tests for the rule text. Documents: none.

## 2. Skills and role

- [x] 2.1 Change `propose` (no question at the end), `apply` (no approval check), `archive` (ADRs to `accepted`, pull request is the approval) and the UX designer role (mockups approved with the change). Verify: `node --test 'scripts/*.test.mjs'` and `claude plugin validate .` pass. Documents: none.

## 3. Documents

- [x] 3.1 Update `README.md`, `AGENTS.md`, the sparc block of `templates/project/AGENTS.md` and `CHANGELOG.md`. Verify: `node scripts/check.mjs` passes. Documents: README.md, AGENTS.md, CHANGELOG.md.
