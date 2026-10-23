# QA

Test command: `node --test 'scripts/*.test.mjs'`. QA tests: `scripts/qa-engineer.test.mjs`.
The main session did this QA run. It followed `agents/qa-engineer.md`, because the QA subagent could not write files (the auto mode check gave no verdict).

| Scenario | Result | Evidence |
|---|---|---|
| QA engineer agent: Agent is available | passed | Test "QA engineer agent: Agent is available". Live: `claude -p --plugin-dir .` (Claude Code 2.1.308) listed `sparc:qa-engineer` in its init message. `node --test 'scripts/*.test.mjs'`: passed. |
| QA engineer agent: Plugin stays valid | passed | Test "QA engineer agent: Plugin stays valid" runs `claude plugin validate .`. `node --test 'scripts/*.test.mjs'`: passed. |
| Integration and end-to-end test scope: Tests for a change | passed | Each test in `scripts/qa-engineer.test.mjs` names its scenario and runs against the plugin files and the `claude` CLI, not against one function. |
| Integration and end-to-end test scope: No unit tests | passed | `git show --stat` of the QA commit lists only `scripts/qa-engineer.test.mjs` and `qa.md`. `scripts/check.test.mjs` is unchanged. |
| Automation first: Scenario can be automated | passed | The QA tests run with the project command `node --test 'scripts/*.test.mjs'`. |
| Automation first: Scenario cannot be automated | passed | Test "Scenario report with evidence: Manual scenario" checks reason, steps and expected result of each manual check in this file in the change folder. `node --test 'scripts/*.test.mjs'`: passed. |
| Automation first: Manual check is archived with the change | manual | See "Manual checks". |
| Use the test tools of the project: Project has a test tool | passed | The QA tests use only `node:` modules. `AGENTS.md` names `node --test`. The repository has no `package.json` (`ls package.json` fails). |
| Use the test tools of the project: Project has no suitable test tool | manual | See "Manual checks". |
| Scenario report with evidence: Passed scenario | passed | Test "Scenario report with evidence: Passed scenario". `node --test 'scripts/*.test.mjs'`: passed. |
| Scenario report with evidence: Failed scenario | manual | See "Manual checks". |
| Scenario report with evidence: Manual scenario | passed | Test "Scenario report with evidence: Manual scenario". `node --test 'scripts/*.test.mjs'`: passed. |
| Acceptance from the QA report: All automated scenarios passed | manual | See "Manual checks". |
| Acceptance from the QA report: Manual scenarios | manual | See "Manual checks". |
| Acceptance from the QA report: Failed scenario | manual | See "Manual checks". |

## Manual checks

### Automation first: Manual check is archived with the change

- Reason: The check needs `openspec archive`. The archive step of sparc runs after acceptance.
- Steps: Copy the repository to a scratch folder. Run `openspec archive add-qa-engineer --yes` there. List `openspec/changes/archive/*-add-qa-engineer/`.
- Expected result: The archived change folder contains `qa.md`.

### Use the test tools of the project: Project has no suitable test tool

- Reason: The scenario is the behavior of an LLM agent in a project without a test tool. Only a live agent run shows it.
- Steps: Make a scratch project with an OpenSpec change and a spec scenario, but with no test tool. Start `sparc:qa-engineer` on the change.
- Expected result: The agent does not install a tool. It reports the missing tool and asks for an ADR.

### Scenario report with evidence: Failed scenario

- Reason: No scenario failed in this run. A failed report needs a live agent run with a failing test.
- Steps: Make a scratch change with a scenario that the code does not meet. Start `sparc:qa-engineer` on it.
- Expected result: `qa.md` gives the scenario as `failed` with expected behavior, actual behavior, steps to reproduce and evidence.

### Acceptance from the QA report: All automated scenarios passed

- Reason: The scenario is the behavior of the product owner agent in `/sparc:apply`.
- Steps: Start `sparc:product-owner` for the acceptance of this change.
- Expected result: The product owner accepts the `passed` rows of this file without a second walk-through.

### Acceptance from the QA report: Manual scenarios

- Reason: The scenario is the behavior of the product owner agent in `/sparc:apply`.
- Steps: Start `sparc:product-owner` for the acceptance of this change.
- Expected result: The product owner does each manual check of this file and reports each one as passed or failed with evidence.

### Acceptance from the QA report: Failed scenario

- Reason: No scenario failed in this run. The scenario needs a QA report with a `failed` row.
- Steps: Give `sparc:product-owner` a copy of this file with one row set to `failed`.
- Expected result: The product owner does not accept the change and names the failed scenario as an issue for a software engineer.
