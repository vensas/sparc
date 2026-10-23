# Spec Delta

## Purpose

Keeps the architecture decision records (ADRs) of a sparc project valid and keeps each decided ADR unchanged, without an LLM and without data that is not in the MADR format.

## ADDED Requirements

### Requirement: Valid ADR status
Each ADR in `docs/adr/` (except `0000-template.md`) SHALL have one of these statuses: `proposed`, `accepted`, `rejected`, `deprecated`, `amended` or `superseded by ADR-NNNN`. The check SHALL report each other status.

#### Scenario: Status is not valid
- **WHEN** an ADR has the status `approved`
- **THEN** the check reports that the status is not valid

#### Scenario: Status is valid
- **WHEN** an ADR has the status `accepted`
- **THEN** the check does not report the status

### Requirement: ADR date format
Each ADR with a valid status SHALL have a `date` in the format `YYYY-MM-DD`.

#### Scenario: Date has a different format
- **WHEN** an ADR has the date `22.10.2026`
- **THEN** the check reports that the date is missing or not `YYYY-MM-DD`

### Requirement: Unique ADR numbers
Each ADR SHALL have a number with 4 digits that no other ADR in `docs/adr/` has.

#### Scenario: Two ADRs have the same number
- **WHEN** `docs/adr/` has `0002-a.md` and `0002-b.md`
- **THEN** the check reports that two or more ADRs have the same number

### Requirement: Supersede target exists
An ADR with the status `superseded by ADR-NNNN` SHALL name an ADR that exists in `docs/adr/` and that is not the ADR itself.

#### Scenario: Superseding ADR does not exist
- **WHEN** ADR-0002 has the status `superseded by ADR-0009` and `docs/adr/` has no ADR-0009
- **THEN** the check reports that ADR-0009 does not exist

### Requirement: MADR front matter only
The front matter of an ADR SHALL contain only the MADR fields `status`, `date`, `decision-makers`, `consulted` and `informed`. The check SHALL report each other field. The check SHALL NOT write to ADR files.

#### Scenario: Leftover lock field
- **WHEN** an ADR has the front matter field `locked`
- **THEN** the check reports that `locked` is not a MADR field

#### Scenario: Check leaves ADR files unchanged
- **WHEN** the user runs the check in a project with decided ADRs
- **THEN** each ADR file has the same content as before the check

### Requirement: Amendments with an approver
An ADR with the status `amended` SHALL have one or more entries under `## Amendments`. Each entry SHALL have a line `Approved by: [@handle](https://github.com/handle)` with the same handle in the text and in the link.

#### Scenario: Amended ADR has no entry
- **WHEN** an ADR has the status `amended` and `## Amendments` has no `###` entry
- **THEN** the check reports that the amended ADR has no amendment entry

#### Scenario: Entry has no approver
- **WHEN** an entry under `## Amendments` has no `Approved by:` line with a GitHub handle link
- **THEN** the check reports that the amendment has no approver line

### Requirement: Decided ADR is protected through git history
The check SHALL find the first commit in which the ADR has a decided status (`accepted`, `rejected`, `deprecated`, `amended` or `superseded by ADR-NNNN`). It SHALL compare that version with the current file and report each change to the body before `## Amendments` and to the MADR front matter fields, except `status` and `date`.

#### Scenario: Body changed after the decision
- **WHEN** an ADR was committed with the status `accepted` and a sentence of its body changed after that commit, committed or not
- **THEN** the check reports that the ADR changed after the decision

#### Scenario: Decision maker changed after the decision
- **WHEN** an ADR was committed with the status `accepted` and its `decision-makers` changed after that commit
- **THEN** the check reports that the ADR changed after the decision

#### Scenario: Status and date change
- **WHEN** an ADR was committed with the status `accepted` and only `status` and `date` changed after that commit
- **THEN** the check does not report a change

#### Scenario: Changes while the ADR was proposed
- **WHEN** an ADR was committed with the status `proposed`, then its body changed, then it was committed with the status `accepted`
- **THEN** the check does not report the changes before the commit with the status `accepted`

#### Scenario: Decided ADR is not committed yet
- **WHEN** an ADR has the status `accepted` and no commit has the ADR with a decided status
- **THEN** the check does not report a change for this ADR

#### Scenario: Project is not a git repository
- **WHEN** the project is not in a git repository and an ADR has a decided status
- **THEN** the check reports one finding that it cannot protect decided ADRs without git

### Requirement: Existing amendments are protected
New entries SHALL be added only at the end of `## Amendments`. The check SHALL report each change to the entries that are in the last commit of the ADR.

#### Scenario: New amendment entry
- **WHEN** a decided ADR gets a new entry at the end of `## Amendments`
- **THEN** the check does not report a change

#### Scenario: Committed amendment entry changed
- **WHEN** the text of an amendment entry that is in the last commit changes
- **THEN** the check reports that an existing amendment changed
