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

## Code review

Reviewed: `d6a2407..e386c22` (software engineer role, workflow `trunk`)
Context: fresh

| Finding | Fix |
|---|---|
| `docs/adr/0007-prove-spec-scenarios-with-a-qa-engineer-after-implementation.md:39`: the accepted ADR tells that each project records its test tool in its own ADR. This contradicts the new test tool rule. | 5406b7b: amendment of ADR-0007, approved by the user in the chat. design.md lists the amended ADR. |
| `rules/roles/ux-designer.md:18`: a new visual language went to an ADR. The threshold then had two homes. | 8638c80: the architect records the choice in `design.md`, and in an ADR only for a major decision. The test of "Convention or check behavior" checks the text. |

After the fixes: `node --test 'scripts/*.test.mjs'`, 207 passed, 0 failed. `node scripts/check.mjs`: no findings.

## Acceptance

Accepted on 2026-11-16 by the product owner role. All 15 scenarios passed. The change has no manual checks. The code review has no open finding. Open points of the change are in the canvas section "Core Risks and Missing Information".
