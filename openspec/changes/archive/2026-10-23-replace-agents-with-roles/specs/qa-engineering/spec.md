# Spec Delta

## ADDED Requirements

### Requirement: QA engineer role
The sparc plugin SHALL provide the role file `rules/roles/qa-engineer.md`. The skills SHALL follow it for QA.

#### Scenario: Role is available
- **WHEN** a user installs the sparc plugin
- **THEN** the file `rules/roles/qa-engineer.md` exists and describes the QA engineer role

#### Scenario: Plugin stays valid
- **WHEN** a user runs `claude plugin validate .` in the sparc repository
- **THEN** the validation passes

## REMOVED Requirements

### Requirement: QA engineer agent
**Reason**: sparc replaces its agents with role files (see the `team-roles` spec).
**Migration**: Use `/sparc:apply`. It follows `rules/roles/qa-engineer.md` in the current session.
