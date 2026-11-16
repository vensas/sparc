# Design

## Context

See proposal.md for the gaps. The skills are prompt files in `skills/<name>/SKILL.md`. The behavior of a skill is the behavior of an agent that follows the prompt. This change adds requirements for the current skills and does not change a skill.

Test tool: Node.js `node:test` with the command `node --test 'scripts/*.test.mjs'` (see `AGENTS.md`). The CI workflow `validate.yml` runs it with the full git history (`fetch-depth: 0`).

ADRs: none. This change adds, amends and supersedes no ADR.

No C4 impact. The change adds tests and specs only.

## Goals / Non-Goals

**Goals:**

- Each new scenario has an automated test.
- A test fails when a later change removes the instruction of a scenario from a skill.

**Non-Goals:**

- Run each skill in a sample project as a test. The cost in tokens and time is too high for each push.

## Decisions

### 1. Text tests of the skill files

Each new scenario gets one test with the name `<Requirement>: <Scenario>`. The test reads the skill file and the rules that it links, and asserts the instruction of the scenario. `scripts/approval.test.mjs` uses this method since the change implicit-approval.

Options:

- **Text test (chosen):** fast, no LLM, runs in CI. It proves that the skill tells the behavior. It does not prove that an agent obeys it.
- **Recorded run of each skill in a sample project:** proves the behavior of one run. It needs an LLM, it costs tokens, and it does not run in CI.
- **Tests over the sparc git history:** sparc uses its own skills, so its commits are the result of real runs. But a test over past commits fails on an old commit that a new rule cannot change.

### 2. Recorded runs from the sparc history as extra evidence

sparc is a sparc project, so its history has real runs of propose, apply, archive, adr and release. QA records this history as extra evidence in `qa.md` for the scenarios in the table below. No new sample project is necessary.

### 3. Test files for each capability

- `scripts/project-setup.test.mjs` (new)
- `scripts/change-workflow.test.mjs` (new)
- `scripts/document-set.test.mjs` (add the sync tests)
- `scripts/adr-management.test.mjs`, `scripts/release-conventions.test.mjs`, `scripts/project-update.test.mjs` (new; the existing tests of these capabilities test the check and are in `scripts/check.test.mjs`)

### 4. Spec follows the skill

If a test cannot pass on the current skill text, the scenario is wrong. Fix the scenario in the spec delta, not the skill. Write the difference as an open point in the canvas.

## Proof of each scenario

All scenarios have a text test. "History" names extra evidence that QA records in `qa.md`.

| Capability | Requirement: Scenario | History |
|---|---|---|
| project-setup | Prerequisites before setup: Not a git repository | none |
| project-setup | Prerequisites before setup: OpenSpec is not installed | none |
| project-setup | Template files without overwrite: New project | none |
| project-setup | Template files without overwrite: Project has a README | none |
| project-setup | Existing OpenSpec configuration is merged: OpenSpec was already in use | `openspec/config.yaml` of sparc |
| project-setup | AGENTS.md is the only agent instruction file: Project has a CLAUDE.md | none |
| project-setup | AGENTS.md is the only agent instruction file: New project | none |
| project-setup | First content from evidence: Existing code base | none |
| project-setup | First content from evidence: New project | none |
| project-setup | First content from evidence: Questions to the user | none |
| project-setup | First decision record: User approves ADR-0001 | none |
| project-setup | Setup completes with a check and a commit: Successful setup | none |
| project-setup | Setup completes with a check and a commit: Team project with history | none |
| change-workflow | Propose writes planning documents only: Files of a propose commit | `git show --name-only` of each `docs(openspec): Propose` commit |
| change-workflow | Propose writes planning documents only: Backlog link | propose commit of this change |
| change-workflow | Change id and branch: Pull request workflow | none |
| change-workflow | Change id and branch: Trunk workflow | propose commits on `main` |
| change-workflow | Mockups only for a user interface: Change without a user interface | this change has no `docs/mockups/add-skill-specs/` |
| change-workflow | Design names the test tool: Project has a test tool | this design.md |
| change-workflow | Design names the test tool: Project has no test tool | none |
| change-workflow | Propose ends valid and committed: Propose completes | propose commit of this change |
| change-workflow | Apply starts only on a valid change: Change is not valid | none |
| change-workflow | Task groups one after the other: One commit for each task | apply commits of this change |
| change-workflow | Task groups one after the other: A test fails after a group | none |
| change-workflow | QA commits change only tests and the QA report: Files of a QA commit | `git show --name-only` of each `test(qa)` commit |
| change-workflow | Apply reports the next step: Apply completes | none |
| change-workflow | Archive only a complete and tested change: Open task | none |
| change-workflow | Archive only a complete and tested change: Failed test | none |
| change-workflow | Archive updates the main specs: New capability | archive of this change |
| change-workflow | Archive syncs, checks and commits: Archive completes | `efa5d7b docs(openspec): Archive improve-first-read` |
| change-workflow | Archive opens a pull request: Repository without a remote | none |
| change-workflow | Archive opens a pull request: Repository with a remote | none |
| document-set | Sync updates the documents of each trigger: Change archived | none |
| document-set | Sync updates the documents of each trigger: Report | none |
| document-set | Sync repeats until the check is clean: Finding stays | none |
| document-set | Sync does not change decided ADRs: Drift in an accepted ADR | none |
| document-set | Sync does not record incomplete work: Task in progress | none |
| adr-management | New ADR from the template: Next free number | none |
| adr-management | Amendment does not change the decision: Addition alters the decision | none |
| adr-management | Supersede in two steps: New ADR is proposed | none |
| adr-management | Supersede in two steps: New ADR is accepted | ADR-0009 and ADR-0015 |
| release-conventions | Release start conditions: Nothing to release | none |
| release-conventions | Release start conditions: Check finding | none |
| release-conventions | Release commit and tag: Trunk release | `023d558 chore(release): 0.7.0` with the tag `v0.7.0` |
| release-conventions | Release commit and tag: Pull request release | none |
| project-update | Update only to a newer version: Project is up to date | none |
| project-update | Update only to a newer version: Project is newer than the plugin | none |

## Risks / Trade-offs

- [A text test does not prove that an agent obeys the skill.] → The history gives evidence for 13 scenarios. The canvas records that the other scenarios have no recorded run.
- [The history has two `test(qa)` commits that changed `docs/architecture/canvas.md`: `76f91df` and `f52f33b`. Both are acceptance commits.] → QA records them in `qa.md`. The canvas gets an open point: the acceptance step has no own commit type.
- [A text test fails when a later change rewrites a skill sentence with the same meaning.] → The tests assert key words, not full sentences, as `scripts/approval.test.mjs` does.

## Open Questions

The unclear skill steps are open points in the canvas section "Core Risks and Missing Information". None of them changes the specs or the tasks of this change.
