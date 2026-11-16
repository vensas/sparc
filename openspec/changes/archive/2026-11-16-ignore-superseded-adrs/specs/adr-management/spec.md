## ADDED Requirements

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
