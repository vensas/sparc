## MODIFIED Requirements

### Requirement: Design names the test tool
`design.md` SHALL name the integration or end-to-end test tool of the project and its command. If the project has no such tool, `design.md` SHALL choose a tool and give the options and the reason for the choice. Propose SHALL write an ADR for the tool only if the choice is a major decision (see `adr-management`).

#### Scenario: Project has a test tool
- **WHEN** `AGENTS.md` names a test command
- **THEN** `design.md` names the test tool and its command

#### Scenario: Project has no test tool
- **WHEN** the project has no integration or end-to-end test tool
- **THEN** `design.md` names the chosen tool, its command, the other options and the reason for the choice
- **AND** the change adds no ADR for the tool, unless the choice is a major decision
