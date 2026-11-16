# Tasks

## 1. Code review in a fresh context

- [x] 1.1 Change `scripts/team-roles.test.mjs` for the modified and added scenarios of the team-roles spec (see design.md - Test), and see the new tests fail. Change `rules/roles/software-engineer.md` section "Code review": the commit range for both workflows, the `Context:` line in the `qa.md` record. Verify: `node --test 'scripts/*.test.mjs'` passes the tests for "Commit range in the workflow trunk", "Review finds an issue" and "Review finds no issue". Documents: none.
- [ ] 1.2 Change `skills/apply/SKILL.md` section 3: start one general-purpose subagent with only the input of design.md, let it report findings and not change files, then fix and record in the main session. Add the opt-out `inline-review` and the fallback. Add `[inline-review]` to the argument hint. Verify: `node --test 'scripts/*.test.mjs'` passes all team-roles tests, and `claude plugin validate .` passes. Documents: none.
- [ ] 1.3 Update the README key feature "Code review" and the apply step in the getting started list (argument `inline-review`). Add ADR-0015 and a cost open point to the canvas. Verify: `node scripts/check.mjs` reports no finding. Documents: README.md, docs/architecture/canvas.md.

## Workflow follow-up

- At archive: set ADR-0015 to `accepted` and ADR-0009 to `superseded by ADR-0015`. Update the ADR list in the canvas.
