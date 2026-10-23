# Spec Delta

## Purpose

Defines what counts as the approval of a change and of other decisions in sparc, with and without pull requests, so that the user does not need an extra approval message.

## ADDED Requirements

### Requirement: Apply approves the change
When the user runs `/sparc:apply <id>`, this SHALL count as the approval of the change and of its `proposed` ADRs. `/sparc:propose` SHALL NOT ask for an approval message. `/sparc:apply` SHALL NOT ask for one.

#### Scenario: Propose ends without a question
- **WHEN** `/sparc:propose` has written and validated the planning documents
- **THEN** it shows the summary and the next step `/sparc:apply <id>`, and does not ask the user to approve

#### Scenario: Apply starts without a question
- **WHEN** the user runs `/sparc:apply <id>` for a valid change
- **THEN** apply starts the first task group without a question about approval

#### Scenario: ADRs of the change at archive
- **WHEN** a change with a `proposed` ADR is archived and the user did not reject the ADR
- **THEN** archive sets the ADR to `accepted`

### Requirement: Pull request approval
If the project uses pull requests, a review with the state `APPROVED`, or the merge of the pull request, SHALL be the sparc approval of the change. A review that asks for changes SHALL send the work back to `/sparc:apply`.

#### Scenario: Reviewer approves
- **WHEN** a reviewer approves the pull request of a change
- **THEN** sparc counts the change and its ADRs as approved

#### Scenario: Solo user merges
- **WHEN** the author of the pull request merges it without a review
- **THEN** sparc counts the merge as the approval

#### Scenario: Reviewer asks for changes
- **WHEN** a review has the state `CHANGES_REQUESTED`
- **THEN** the work goes back to `/sparc:apply`, and the ADRs of the change do not reach the default branch

### Requirement: Explicit approval for other decisions
ADR amendments, deprecations and supersedes outside a change, the release version, the update plan and ADR-0001 in `/sparc:init` SHALL need an explicit approval: a clear "yes" in the chat, or an approved or merged pull request for the item.

#### Scenario: ADR amendment
- **WHEN** a user wants to amend an accepted ADR with `/sparc:adr`
- **THEN** sparc shows the addition and waits for an explicit approval

#### Scenario: Release version
- **WHEN** `/sparc:release` has calculated the next version
- **THEN** it shows the version and waits for an explicit approval
