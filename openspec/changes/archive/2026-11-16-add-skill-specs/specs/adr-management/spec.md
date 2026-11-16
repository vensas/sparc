# Spec Delta

## ADDED Requirements

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
