## Why

sparc has no agent that owns integration tests and end-to-end tests. The software engineers write unit tests, and the product owner walks through the spec scenarios. Thus the acceptance of a change can depend on manual checks that nobody can run again. Backlog item: "QA engineer for integration and end-to-end tests, automation first".

## What Changes

- Add the agent `sparc:qa-engineer` (file `agents/qa-engineer.md`).
- The QA engineer writes integration tests and end-to-end tests for the spec scenarios of a change.
- Automation first: the QA engineer writes an automated test for each spec scenario if possible. It uses a manual check only when automation is not possible. It records the manual check with its reason in the change folder, so the manual check is archived with the change.
- The QA engineer uses the test tools that the project has. It does not assume a test framework. If the project has no suitable tool, the tool is a decision for the project: an ADR records it, and the user approves it before the QA engineer installs or uses it.
- In `/sparc:apply`, the product owner accepts a change from the QA report. The product owner checks only the manual scenarios. It does not walk through the automated scenarios a second time.
- A failed scenario goes to a software engineer as an issue.
- The QA engineer reports the result of each spec scenario with evidence.

Out of scope:

- Unit tests. The software engineers keep this work.
- Changes to the product code to make a test pass. The software engineers do this work.
- The choice or installation of a test tool by the QA engineer alone, without an approved ADR.
- A lasting project document for manual checks. Manual checks stay in the change folder.
- Performance tests, load tests and security tests.
- CI pipelines that run the tests.
- The exact position of the QA engineer in the skills and the exact file for manual checks in the change folder. The architect decides this in `design.md`.

## Capabilities

### New Capabilities

- `qa-engineering`: the QA engineer agent, its test scope (integration and end-to-end), the automation-first rule, the use of the project test tools, the scenario report and the acceptance from the QA report.

### Modified Capabilities

None.

## Impact

- New file: `agents/qa-engineer.md`.
- Changed agent: `agents/product-owner.md` (acceptance from the QA report).
- Skills that start agents, for example `skills/apply/SKILL.md`. The design names the exact skills.
- Documents: README "Key Features" (number of agents), `AGENTS.md` structure, `.claude-plugin/plugin.json` description, `CHANGELOG.md`.
- No new dependencies in sparc.
