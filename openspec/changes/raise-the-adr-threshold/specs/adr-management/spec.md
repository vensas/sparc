## ADDED Requirements

### Requirement: ADR only for a major decision
The sparc rules SHALL tell the agent to write an ADR only for a major decision. A decision is major when it is central to the idea of the project and to its approach to the problem, and the team chose between two or more real solution options. The rules SHALL tell the agent to write each other decision in `design.md` of its change, with its options and the reason for the choice. The rule SHALL be in `rules/adr.md`, and the architect role SHALL refer to it.

#### Scenario: Rule for the architect
- **WHEN** the architect role writes the design of a change
- **THEN** it refers to the rule in `rules/adr.md` that tells when to write an ADR

#### Scenario: Decision that is not major
- **WHEN** a change makes a decision that is not central to the idea of the project, or that has only one real option
- **THEN** the architect writes the decision with its options and reason in `design.md`
- **AND** the change adds no ADR for it

#### Scenario: Convention or check behavior
- **WHEN** a change decides a convention, a document format or a behavior of the check
- **THEN** the architect writes it in a spec or a rule, and the change adds no ADR for it

#### Scenario: Major decision
- **WHEN** a change makes a decision that is central to the idea of the project and the team chose between two or more real options
- **THEN** the architect writes an ADR with the status `proposed`

### Requirement: Proposed ADR gives its options and trade-offs
The document check SHALL report each ADR with the status `proposed` that has fewer than two list items in `## Considered Options`. It SHALL report each considered option that has no subsection `### <option>` in `## Pros and Cons of the Options`, and each such subsection that has no line `- Good, because` or no line `- Bad, because`. The check SHALL NOT apply this requirement to a decided ADR. The ADR template SHALL tell this requirement.

#### Scenario: Only one option
- **WHEN** a `proposed` ADR has one list item in `## Considered Options`
- **THEN** the check reports that the ADR needs two or more options

#### Scenario: Option without trade-offs
- **WHEN** a `proposed` ADR has an option in `## Considered Options` and no subsection for this option in `## Pros and Cons of the Options`
- **THEN** the check reports that the option has no trade-offs

#### Scenario: Option without a bad trade-off
- **WHEN** the subsection of an option in a `proposed` ADR has a line `- Good, because` and no line `- Bad, because`
- **THEN** the check reports that the option has no bad trade-off

#### Scenario: Complete options and trade-offs
- **WHEN** a `proposed` ADR has two options, and the subsection of each option has a good and a bad trade-off
- **THEN** the check does not report the options

#### Scenario: Decided ADR with one option
- **WHEN** an ADR with the status `accepted` has one option and no `## Pros and Cons of the Options`
- **THEN** the check does not report the options

#### Scenario: Template tells the requirement
- **WHEN** `/sparc:init` or `/sparc:update` writes `docs/adr/0000-template.md`
- **THEN** the template tells that an ADR gives two or more real options, and a good and a bad trade-off for each option
