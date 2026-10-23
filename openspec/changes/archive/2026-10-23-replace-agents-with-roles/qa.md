# QA

Test command: `node --test 'scripts/*.test.mjs'`. Tests: `scripts/team-roles.test.mjs` and `scripts/qa-engineer.test.mjs`.
The main session did the task groups, the code review and QA with the role files, as the changed `/sparc:apply` tells.

## Code review

Reviewed: `9d19494..bbc6622` (software engineer role, `git diff main...HEAD`)

| Finding | Fix |
|---|---|
| Dead code: the three QA report tests in `scripts/qa-engineer.test.mjs` were always skipped after the archive of add-qa-engineer, with four helper functions that only they used. | bbc6622 |

Also checked without a finding: debug code, secrets, unused imports, spec match and scope of the diff.

## Scenarios

| Scenario | Result | Evidence |
|---|---|---|
| Roles as rule files: Role files exist | passed | Test "Roles as rule files: Role files exist". `node --test 'scripts/*.test.mjs'`: passed. |
| Roles as rule files: No custom agent types | passed | Test "Roles as rule files: No custom agent types". `node --test 'scripts/*.test.mjs'`: passed. Live: `claude -p --plugin-dir .` (Claude Code 2.1.308) lists no `sparc:` agent type and the 7 sparc skills. |
| Skills follow the roles in the current session: Apply without subagents | passed | Test "Skills follow the roles in the current session: Apply without subagents". `node --test 'scripts/*.test.mjs'`: passed. This change was applied in the main session: `git worktree list` shows one worktree. |
| Code review by the software engineer: Review finds an issue | passed | The review of this change found dead code and fixed it in bbc6622 (see "Code review"). Test "Code review by the software engineer: the role has a review checklist that records into qa.md". `node --test 'scripts/*.test.mjs'`: passed. |
| Code review by the software engineer: Review finds no issue | manual | See "Manual checks". |
| Acceptance needs a completed code review: Code review is missing | passed | Test "Acceptance needs a completed code review: Code review is missing". `node --test 'scripts/*.test.mjs'`: passed. |
| Optional fresh-context check: User asks for a fresh-context check | manual | See "Manual checks". |
| QA engineer role: Role is available | passed | Test "QA engineer role: Role is available". `node --test 'scripts/*.test.mjs'`: passed. |
| QA engineer role: Plugin stays valid | passed | Test "QA engineer role: Plugin stays valid". `node --test 'scripts/*.test.mjs'`: passed. |

## Manual checks

### Code review by the software engineer: Review finds no issue

- Reason: The review of this change found an issue. The scenario needs a change without an issue.
- Steps: Review a small change without an issue as the software engineer role.
- Expected result: `## Code review` gives the reviewed commit range and "No findings".
- Product owner result: passed. In the fresh-context check, a general-purpose subagent reviewed commit 494071c with the checklist of `rules/roles/software-engineer.md` and wrote "Reviewed: `5c82e55..494071c`" and "No findings".

### Optional fresh-context check: User asks for a fresh-context check

- Reason: The scenario is a live run of a general-purpose subagent.
- Steps: Do the acceptance of this change in a general-purpose subagent that follows `rules/roles/product-owner.md`.
- Expected result: The subagent reads the role file and `qa.md`, and reports an acceptance decision with evidence.
- Product owner result: passed for acceptance. A general-purpose subagent followed `rules/roles/product-owner.md`, ran the tests (37 pass) and accepted the change. Limit: it took the QA results from this file and did not follow `rules/roles/qa-engineer.md`. A fresh-context run of QA is not shown yet.

## Acceptance

Accepted on 2026-10-23 by the product owner role in a fresh-context check (general-purpose subagent). No scenario is `failed`. The code review has no open finding. A copy of this file without `## Code review` was not accepted, as the role requires.
