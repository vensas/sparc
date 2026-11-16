# Spec Delta

## Purpose

Defines the life cycle of one change with `/sparc:propose`, `/sparc:apply` and `/sparc:archive`: the planning documents, the implementation in task groups, and the archive into the main specs. Approval is in `approval`, the code review in `team-roles`, and QA and acceptance in `qa-engineering`.

## ADDED Requirements

### Requirement: Propose writes planning documents only
`/sparc:propose` SHALL make an OpenSpec change with `proposal.md`, the spec deltas, `design.md` and `tasks.md`, and link it to a backlog item. It SHALL NOT change project code. The roles in `rules/roles/` own the documents.

#### Scenario: Files of a propose commit
- **WHEN** `/sparc:propose` has committed a change
- **THEN** the commit changes only files in `openspec/changes/<id>/` and in `docs/`

#### Scenario: Backlog link
- **WHEN** `/sparc:propose` has written the proposal
- **THEN** `docs/backlog.md` has an item with `(change: <id>)`

### Requirement: Change id and branch
The change id SHALL be kebab-case and SHALL name the work. In the workflow `pull-request`, `/sparc:propose` SHALL make the branch `<type>/<id>` from the default branch. In the workflow `trunk`, it SHALL NOT make a branch (see `rules/release.md`).

#### Scenario: Pull request workflow
- **WHEN** the workflow is `pull-request` and the user proposes a CSV export
- **THEN** the change has a kebab-case id such as `add-csv-export`, and the work is on a branch such as `feat/add-csv-export`

#### Scenario: Trunk workflow
- **WHEN** the workflow is `trunk`
- **THEN** propose commits on the default branch

### Requirement: Mockups only for a user interface
`/sparc:propose` SHALL make mockups in `docs/mockups/<id>/` only if the change has a user interface. It SHALL show the user the path of each mockup.

#### Scenario: Change without a user interface
- **WHEN** a change has no user interface
- **THEN** propose makes no folder `docs/mockups/<id>/`

### Requirement: Design names the test tool
`design.md` SHALL name the integration or end-to-end test tool of the project and its command. If the project has no such tool, propose SHALL write a project ADR for the tool with the status `proposed`.

#### Scenario: Project has a test tool
- **WHEN** `AGENTS.md` names a test command
- **THEN** `design.md` names the test tool and its command

#### Scenario: Project has no test tool
- **WHEN** the project has no integration or end-to-end test tool
- **THEN** the change adds an ADR for a test tool with the status `proposed`

### Requirement: Propose ends valid and committed
`/sparc:propose` SHALL run `openspec validate <id>` until it passes, run the check, and commit the planning documents with the header `docs(openspec): Propose <id>`. The summary SHALL name the scope, the out-of-scope items, the ADRs, the C4 impact, the mockups and the number of tasks.

#### Scenario: Propose completes
- **WHEN** `/sparc:propose` ends
- **THEN** `openspec validate <id>` passes, a commit `docs(openspec): Propose <id>` exists, and the summary has the six items

### Requirement: Apply starts only on a valid change
`/sparc:apply` SHALL run `openspec status --change <id>` and `openspec validate <id>` before the first task. It SHALL start the first task group only when all planning artifacts are complete and valid.

#### Scenario: Change is not valid
- **WHEN** `openspec validate <id>` fails
- **THEN** apply does not start the first task group

### Requirement: Task groups one after the other
`/sparc:apply` SHALL do the open task groups in their order. For each task it SHALL write the test first and make one Conventional Commit (see `rules/release.md`). After each group it SHALL run all tests of the project, and SHALL fix a failed test before the next group.

#### Scenario: One commit for each task
- **WHEN** apply has completed a task group with three tasks
- **THEN** the history has one commit for each of the three tasks, and each task is checked in `tasks.md`

#### Scenario: A test fails after a group
- **WHEN** a test of the project fails after a task group
- **THEN** apply fixes it before it starts the next group

### Requirement: QA commits change only tests and the QA report
In `/sparc:apply`, the QA commits SHALL change only test files and `openspec/changes/<id>/qa.md`. A scenario with the result `failed` SHALL go back to the software engineer role for a fix, and then to QA again.

#### Scenario: Files of a QA commit
- **WHEN** QA of a change has committed its work
- **THEN** each QA commit changes only test files and `openspec/changes/<id>/qa.md`

### Requirement: Apply reports the next step
At the end, `/sparc:apply` SHALL report the completed tasks, the test results, the code review, the QA result and the open points, and tell the next step `/sparc:archive <id>`.

#### Scenario: Apply completes
- **WHEN** the change is accepted
- **THEN** apply reports the five items and the next step `/sparc:archive <id>`

### Requirement: Archive only a complete and tested change
`/sparc:archive` SHALL stop and report the cause when a task in `tasks.md` is not checked, or when a test command in `AGENTS.md` fails. It SHALL NOT change a file in these cases.

#### Scenario: Open task
- **WHEN** `tasks.md` of the change has an unchecked task
- **THEN** archive stops, reports the open tasks, and does not run `openspec archive`

#### Scenario: Failed test
- **WHEN** a test command in `AGENTS.md` fails
- **THEN** archive stops and reports the failed test

### Requirement: Archive updates the main specs
`/sparc:archive` SHALL run `openspec archive <id> --yes` and make sure that the main specs in `openspec/specs/` changed as the deltas say.

#### Scenario: New capability
- **WHEN** a change with the delta `specs/export/spec.md` is archived
- **THEN** `openspec/specs/export/spec.md` exists with the requirements of the delta, and the change is in `openspec/changes/archive/`

### Requirement: Archive syncs, checks and commits
`/sparc:archive` SHALL sync the documents (see "Sync updates the documents of each trigger" in `document-set`), run the check, and commit with the header `docs(openspec): Archive <id>`. A check finding SHALL stay only with a reason that archive tells the user.

#### Scenario: Archive completes
- **WHEN** `/sparc:archive` ends
- **THEN** a commit `docs(openspec): Archive <id>` exists, and archive reports the commit and the check result

### Requirement: Archive opens a pull request
In the workflow `pull-request`, `/sparc:archive` SHALL push the branch and open a pull request with a Conventional Commit header as its title. If the repository has no remote, archive SHALL stop and tell the user that the branch is ready for a pull request.

#### Scenario: Repository without a remote
- **WHEN** the workflow is `pull-request` and `git remote` shows no remote
- **THEN** archive does not push, and tells the user that the branch is ready for a pull request

#### Scenario: Repository with a remote
- **WHEN** the workflow is `pull-request` and the repository has the remote `origin`
- **THEN** archive pushes the branch and reports the link of the new pull request
