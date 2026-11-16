# QA

Test files: `scripts/adr-management.test.mjs` (rule and template text), `scripts/check.test.mjs` (check, with a temporary git project from the template), `scripts/change-workflow.test.mjs` (propose text) and `scripts/qa-engineer.test.mjs` (QA role and apply text). The test name is the scenario name.

The four scenarios of "ADR only for a major decision" are agent behavior. The tests prove that the rules tell the behavior, not that an agent obeys it. Evidence for "Decision that is not major": this change makes three decisions with options in `design.md` and adds no ADR.

| Scenario | Result | Evidence |
|---|---|---|
| ADR only for a major decision: Rule for the architect | passed | "ADR only for a major decision: Rule for the architect", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| ADR only for a major decision: Decision that is not major | passed | "ADR only for a major decision: Decision that is not major", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| ADR only for a major decision: Convention or check behavior | passed | "ADR only for a major decision: Convention or check behavior", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| ADR only for a major decision: Major decision | passed | "ADR only for a major decision: Major decision", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| Proposed ADR gives its options and trade-offs: Only one option | passed | "Proposed ADR gives its options and trade-offs: Only one option", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| Proposed ADR gives its options and trade-offs: Option without trade-offs | passed | "Proposed ADR gives its options and trade-offs: Option without trade-offs", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| Proposed ADR gives its options and trade-offs: Option without a bad trade-off | passed | "Proposed ADR gives its options and trade-offs: Option without a bad trade-off", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| Proposed ADR gives its options and trade-offs: Complete options and trade-offs | passed | "Proposed ADR gives its options and trade-offs: Complete options and trade-offs", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| Proposed ADR gives its options and trade-offs: Decided ADR with one option | passed | "Proposed ADR gives its options and trade-offs: Decided ADR with one option", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| Proposed ADR gives its options and trade-offs: Template tells the requirement | passed | "Proposed ADR gives its options and trade-offs: Template tells the requirement", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| Design names the test tool: Project has a test tool | passed | "Design names the test tool: Project has a test tool", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| Design names the test tool: Project has no test tool | passed | "Design names the test tool: Project has no test tool", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| Use the test tools of the project: Project has a test tool | passed | "Use the test tools of the project: Project has a test tool", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| Use the test tools of the project: Design of the change names a new tool | passed | "Use the test tools of the project: Design of the change names a new tool", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
| Use the test tools of the project: Project has no suitable test tool | passed | "Use the test tools of the project: Project has no suitable test tool", `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed |
