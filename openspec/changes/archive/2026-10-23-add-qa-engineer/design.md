## Context

See proposal.md for the reason. sparc has a product owner who walks through each scenario at acceptance, and software engineers who write unit tests for each task. No agent owns integration and end-to-end tests.

## Goals / Non-Goals

**Goals:**
- One QA run for each change that proves the spec scenarios with automated tests.
- Acceptance from the QA result without a second walk-through.

**Non-Goals:**
- A separate test plan. The spec scenarios are the test plan.
- A choice of test tool by sparc. Each project decides its tool in its own ADR.

## Decisions

- **No QA step in propose.** The spec scenarios are the test plan (DRY). In propose, the architect names the integration or end-to-end test tool of the project and its command in `design.md`. If there is none, the architect writes a project ADR with the status `proposed`. The approval of the change also approves this ADR. Alternative: a QA test plan in propose. Rejected, because it copies the scenarios.
- **QA after the task groups.** One `sparc:qa-engineer` runs in `/sparc:apply` after all task groups are merged, on the change branch, before acceptance. Alternatives: QA before the engineers, or in parallel. Rejected, because the tests would need routes and selectors that do not exist yet. The evidence rule forbids such guesses. Parallel work also gives merge conflicts in test files.
- **Missing tool in apply.** If the tool is still missing, the QA engineer stops and reports it, as the spec requires.
- **Failed scenario loop.** The QA engineer writes the failed entry in `qa.md`. The apply skill gives it to one software engineer. Then the QA engineer runs the tests again. The product owner accepts only when no scenario has the result `failed`.
- **No QA step in archive.** Archive step 2 runs the test commands in `AGENTS.md`. The QA tests are part of them. A new test command goes into `AGENTS.md` through sync.
- **File `qa.md`.** `openspec/changes/<id>/qa.md` has one table (scenario, result `passed`, `failed` or `manual`, evidence) and the manual checks (reason, steps, expected result). The product owner writes the manual results into the same file. A test with OpenSpec 1.14.3 showed that `openspec validate --strict` accepts `qa.md` and that `openspec archive` moves it into the archive folder.
- **Rules of the QA agent.** It links `writing.md`, `evidence.md`, `engineering.md` (section "Tests") and `release.md` (commits of type `test`). It does not link `docs.md`, `adr.md` or `approval.md`, because the skills do those steps.
- **Product owner.** It accepts from `qa.md` and does only the manual checks. Its issue format stays for issues that do not come from QA.
- **Skill instead of a template rule.** The test-tool step goes into the propose skill, not into `templates/project/openspec/config.yaml`, because existing projects do not get template updates.

ADR: `docs/adr/0007-prove-spec-scenarios-with-a-qa-engineer-after-implementation.md`.
C4 impact: the container "Agents" adds "QA engineer". No actor, external system or relation changes. No mockups, because the change has no user interface.

## Risks / Trade-offs

- [The agent tools cannot stop QA from changes to product code] → The agent file forbids it. The apply skill checks that QA commits change only test files and `qa.md`.
- [Failures come late] → Unit tests stay in each task. A failure goes to one engineer only.
- [The four fields of a failed scenario are in three places] → Accepted. A rule file for four short fields costs more than it gives.
- [`qa.md` behavior is tested with OpenSpec 1.14.3 only] → Test it again when OpenSpec changes.
