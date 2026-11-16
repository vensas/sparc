# QA

Test file: `scripts/team-roles.test.mjs`. The tests read the apply skill and the software engineer role, because the behavior is skill text. The test name is the scenario name. The apply run of this change is the live test (see "Manual checks").

| Scenario | Result | Evidence |
|---|---|---|
| Skills follow the roles in the current session: Skills do not forbid subagents | passed | "Skills follow the roles in the current session: Skills do not forbid subagents", `node --test 'scripts/*.test.mjs'`, 125 passed, 0 failed |
| Skills follow the roles in the current session: Apply without subagents | passed | "Skills follow the roles in the current session: Apply without subagents", `node --test 'scripts/*.test.mjs'`, 125 passed, 0 failed |
| Code review by the software engineer: Review in a fresh context by default | passed | "Code review by the software engineer: Review in a fresh context by default", `node --test 'scripts/*.test.mjs'`, 125 passed, 0 failed. Also the live test in "Manual checks" |
| Code review by the software engineer: Reviewer does not change files | passed | "Code review by the software engineer: Reviewer does not change files", `node --test 'scripts/*.test.mjs'`, 125 passed, 0 failed. Also the live test in "Manual checks" |
| Code review by the software engineer: Review finds an issue | passed | "Code review by the software engineer: Review finds an issue", `node --test 'scripts/*.test.mjs'`, 125 passed, 0 failed. Also the live test: 2 findings, fixed in `e3186f5` and `77f46c6` |
| Code review by the software engineer: Review finds no issue | passed | "Code review by the software engineer: Review finds no issue", `node --test 'scripts/*.test.mjs'`, 125 passed, 0 failed |
| Code review by the software engineer: Commit range in the workflow trunk | passed | "Code review by the software engineer: Commit range in the workflow trunk", `node --test 'scripts/*.test.mjs'`, 125 passed, 0 failed. Also the live test: `git log --format=%h --grep "Propose fresh-context-code-review" -1` gave `7300ab7` |
| Code review in the current session: User asks for an inline review | passed | "Code review in the current session: User asks for an inline review", `node --test 'scripts/*.test.mjs'`, 125 passed, 0 failed |
| Code review in the current session: Subagent cannot start | passed | "Code review in the current session: Subagent cannot start", `node --test 'scripts/*.test.mjs'`, 125 passed, 0 failed |

## Manual checks

### Live review in a fresh context

- Reason: the text tests do not show that a live subagent works with only the given input and makes no change.
- Steps: in the apply run of this change (Claude Code, model Opus 5.5, plugin 0.6.0 installed, new skill text from the repository), start one general-purpose subagent with only the change id, the commit range `7300ab7..HEAD`, the role file and the change documents. Tell it to report and not to change files.
- Expected result: the subagent reports findings with file, line and reason. It makes no commit and no file change.
- Result: passed. The subagent reported 2 findings with file, line and reason. It made no commit. The next commit `e3186f5` changed only the 2 lines of the fix. The review used 60,560 tokens, 5 tool calls and 36 seconds.

## Code review

Reviewed: `7300ab7..84544d9`
Context: fresh

| Finding | Fix |
|---|---|
| `skills/apply/SKILL.md`: "Give it not the conversation." is not STE. | `e3186f5` |
| Task 1.1 names the tests "Review finds an issue" and "Review finds no issue", but these tests did not exist. | `77f46c6` |

## Acceptance

Accepted by the product owner from this report on 2026-11-16. No scenario failed. The code review has no open finding. The live review in a fresh context passed.
