# document-set Specification

## Purpose
The rules for the sparc documents of a project: the home of each fact and the content that each document holds.

## Requirements

### Requirement: Backlog holds only open items
The backlog SHALL hold only items that are not done. The changelog SHALL be the home of done work. `/sparc:archive` SHALL remove the backlog item of the archived change. An item without a change SHALL be removed when the user confirms that it is done.

#### Scenario: Archive removes the item
- **WHEN** `/sparc:archive add-login` runs and the backlog has the item `- [ ] Login (change: add-login)`
- **THEN** the backlog does not have an item for `add-login` after the archive, and `CHANGELOG.md` has the entries of the change

#### Scenario: Rule in the document rules
- **WHEN** an agent reads the backlog format in the sparc document rules
- **THEN** the format has only open items and tells to remove an item when it is done

### Requirement: Check reports done backlog items
The document check SHALL report each checked backlog item and each item of an archived change. It SHALL report each open change that has no backlog item. It SHALL NOT report an archived change that has no backlog item.

#### Scenario: Checked item
- **WHEN** the backlog has the item `- [x] Search`
- **THEN** the check reports that the item is done and tells to remove it

#### Scenario: Item of an archived change
- **WHEN** the change `add-login` is archived and the backlog has the item `- [ ] Login (change: add-login)`
- **THEN** the check reports that the change is archived and tells to remove its item

#### Scenario: Archived change without an item
- **WHEN** the change `add-login` is archived and the backlog has no item for it
- **THEN** the check gives no finding for `add-login`

#### Scenario: Open change without an item
- **WHEN** the change `add-export` is open and the backlog has no item for it
- **THEN** the check reports that the change `add-export` has no backlog item

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
