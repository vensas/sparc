# Spec Delta

## ADDED Requirements

### Requirement: Sync updates the documents of each trigger
`/sparc:sync` SHALL update each document that a trigger in the sync table of `rules/docs.md` names, as the owner role of the document tells. Without an argument, the scope is the whole project. With a change id, sync SHALL read the proposal, the design and the tasks of the change.

#### Scenario: Change archived
- **WHEN** a change was archived and the README key features do not name its new feature
- **THEN** sync adds the feature to the README key features as the architect role

#### Scenario: Report
- **WHEN** sync changed two documents
- **THEN** sync reports each changed document in one line

### Requirement: Sync repeats until the check is clean
`/sparc:sync` SHALL run the check before and after its updates. It SHALL repeat until the check has no finding, or until each remaining finding has a reason.

#### Scenario: Finding stays
- **WHEN** a finding stays after sync, because the user cannot give the information now
- **THEN** sync reports the finding with its reason

### Requirement: Sync does not change decided ADRs
`/sparc:sync` SHALL NOT change an ADR with a decided status. It SHALL use `/sparc:adr` for such a change (see `adr-management`).

#### Scenario: Drift in an accepted ADR
- **WHEN** the code differs from an ADR with the status `accepted`
- **THEN** sync does not edit the ADR file, and uses `/sparc:adr` to amend or supersede it

### Requirement: Sync does not record incomplete work
If the drift comes from work that is not complete, `/sparc:sync` SHALL NOT change the documents. It SHALL report the drift.

#### Scenario: Task in progress
- **WHEN** the working tree has code of a task that is not complete
- **THEN** sync does not change a document for this code, and reports the drift
