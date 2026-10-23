# Tasks

## 1. Roles

- [x] 1.1 Move `agents/*.md` to `rules/roles/*.md` without front matter, with relative rule links. Remove `agents/`. Verify: `ls rules/roles` lists 5 files, `ls agents` fails, `claude plugin validate .` passes. Documents: none.
- [x] 1.2 Add the code review checklist and procedure to `rules/roles/software-engineer.md`, and the code review condition to `rules/roles/product-owner.md`. Verify: `claude plugin validate .` passes. Documents: none.

## 2. Skills

- [x] 2.1 Change `skills/apply/SKILL.md`: roles in the current session, no worktrees, code review before QA, optional fresh-context check, acceptance needs the code review. Verify: `claude plugin validate .` passes. Documents: none.
- [x] 2.2 Change `init`, `propose`, `archive`, `sync` and `adr` to follow the role files. Verify: `grep -rn 'sparc:\(product\|architect\|ux\|software\|qa\)' skills` finds nothing. Documents: none.

## 3. Tests and documents

- [x] 3.1 Change `scripts/qa-engineer.test.mjs` to test the role file, and add tests for the `team-roles` scenarios that files can show. Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: none.
- [ ] 3.2 Update README, AGENTS.md, `.claude-plugin/plugin.json`, C4 diagrams and canvas. Verify: `node scripts/check.mjs` passes. Documents: README.md, AGENTS.md, c4.md, canvas.md.
- [ ] 3.3 Add the `CHANGELOG.md` Unreleased entries. Verify: `node scripts/check.mjs` passes. Documents: CHANGELOG.md.
