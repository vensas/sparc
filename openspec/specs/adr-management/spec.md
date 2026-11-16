# adr-management Specification

## Purpose
Keeps the architecture decision records (ADRs) of a sparc project valid and keeps each decided ADR unchanged, without an LLM and without data that is not in the MADR format.

## Requirements

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

### Requirement: Sentence check only for proposed ADRs
The check SHALL report sentences with more than 25 words only in ADRs with the status `proposed`. It SHALL NOT report them in a decided ADR, because a decided ADR must not change.

#### Scenario: Long sentence in a decided ADR
- **WHEN** an ADR with the status `accepted` has a sentence with 30 words
- **THEN** the check does not report the sentence

#### Scenario: Long sentence in a proposed ADR
- **WHEN** an ADR with the status `proposed` has a sentence with 30 words
- **THEN** the check reports the sentence

### Requirement: Agents follow only current ADRs
The sparc rules SHALL tell the agent that only ADRs with the status `accepted` or `amended` are current decisions, and that a `proposed` ADR is current only in its own change. The rules SHALL tell the agent to read the status of an ADR before it uses the ADR, to follow the `superseded by` chain to the current ADR, and not to follow a `deprecated` or `rejected` ADR. The rule SHALL be in `rules/adr.md` and in the sparc text of the `AGENTS.md` template.

#### Scenario: Rule in a project
- **WHEN** `/sparc:init` or `/sparc:update` writes the sparc text of `AGENTS.md`
- **THEN** the text tells the agent to follow only current ADRs and to follow the `superseded by` chain

#### Scenario: Agent finds a superseded ADR
- **WHEN** an agent in a sparc project finds the text of an ADR with the status `superseded by ADR-NNNN`
- **THEN** the agent uses the decision of the current ADR in the chain, not the decision of the superseded ADR

### Requirement: Canvas lists each ADR with its status
The document check SHALL report each ADR in `docs/adr/` (not the template) that has no line with a link to its file in the canvas section "Core Decisions". It SHALL report each line of an ADR with the status `superseded by ADR-NNNN`, `deprecated` or `rejected` that does not name this status.

#### Scenario: ADR is not in the canvas
- **WHEN** `docs/adr/0003-x.md` exists and the section "Core Decisions" has no link to it
- **THEN** the check reports that ADR-0003 has no line in "Core Decisions"

#### Scenario: Superseded ADR without its status in the canvas
- **WHEN** ADR-0002 has the status `superseded by ADR-0004` and its line in "Core Decisions" does not contain "superseded by ADR-0004"
- **THEN** the check reports that the line of ADR-0002 does not name its status

#### Scenario: Canvas names the status
- **WHEN** each ADR has a line in "Core Decisions", and the line of each superseded, deprecated or rejected ADR names its status
- **THEN** the check gives no finding for the ADR index

### Requirement: Open changes do not use old ADRs
The design rule in `openspec/config.yaml` SHALL tell to start the ADR list of `design.md` with `ADRs:`. The document check SHALL read the ADR list in `design.md` of each open change: the line that starts with `ADRs:` and the list items that follow it. It SHALL report each link in this list to an ADR with the status `superseded by ADR-NNNN`, `deprecated` or `rejected`. It SHALL NOT read archived changes.

#### Scenario: Open change lists a superseded ADR
- **WHEN** ADR-0002 has the status `superseded by ADR-0004` and the ADR list in `design.md` of an open change links to ADR-0002
- **THEN** the check reports that the change uses ADR-0002, which is superseded by ADR-0004

#### Scenario: Open change supersedes a current ADR
- **WHEN** ADR-0002 has the status `accepted` and the ADR list of an open change tells that a new ADR supersedes ADR-0002
- **THEN** the check gives no finding for this link

#### Scenario: Archived change links to a superseded ADR
- **WHEN** ADR-0002 has the status `superseded by ADR-0004` and the design of an archived change links to ADR-0002
- **THEN** the check gives no finding for this link

### Requirement: New ADR from the template
`/sparc:adr new` SHALL write `docs/adr/NNNN-<kebab-title>.md` with the next free number, from `docs/adr/0000-template.md` (or the sparc template if the project has none), with the status `proposed` and the date of today.

#### Scenario: Next free number
- **WHEN** `docs/adr/` has ADR-0001 to ADR-0017 and the user runs `/sparc:adr new Use Postgres`
- **THEN** `docs/adr/0018-use-postgres.md` exists with the status `proposed` and the date of today

### Requirement: Amendment does not change the decision
`/sparc:adr amend` SHALL stop and tell the user that a supersede is necessary if the addition alters the context, the options, the decision or the consequences. An amendment that is permitted SHALL go at the end of `## Amendments` after an explicit approval (see `approval`), and SHALL set the status `amended`.

#### Scenario: Addition alters the decision
- **WHEN** the user wants to amend ADR-0003 with a different choice of the diagram tool
- **THEN** `/sparc:adr` does not change ADR-0003, and tells the user that a supersede is necessary

### Requirement: Supersede in two steps
`/sparc:adr supersede` SHALL write a new ADR that links the old ADR in "More Information". It SHALL set the old status to `superseded by ADR-NNNN` only after the new ADR is accepted, and SHALL update the canvas section "Core Decisions".

#### Scenario: New ADR is proposed
- **WHEN** the user supersedes ADR-0004 and the new ADR-0018 has the status `proposed`
- **THEN** ADR-0004 keeps its status

#### Scenario: New ADR is accepted
- **WHEN** ADR-0018 that supersedes ADR-0004 is accepted
- **THEN** ADR-0004 has the status `superseded by ADR-0018`, and its line in "Core Decisions" names this status
