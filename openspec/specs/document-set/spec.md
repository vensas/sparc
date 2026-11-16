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
