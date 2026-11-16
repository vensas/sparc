## ADDED Requirements

### Requirement: README for a first-time reader
The README of sparc SHALL tell the value of sparc before its mechanics. "Key Features" SHALL have 5 bullets or fewer. A section "How It Works" SHALL show the loop of a change as a diagram and the files that `/sparc:init` makes as a tree, and SHALL define the sparc terms. The README SHALL tell that its English follows ASD-STE100 on purpose, and SHALL link to the limits and risks in the canvas.

#### Scenario: Key features are short
- **WHEN** a reader reads the section "Key Features" of `README.md`
- **THEN** the section has 5 bullets or fewer

#### Scenario: Files of a new project
- **WHEN** a reader reads the section "How It Works" of `README.md`
- **THEN** it has a tree that names each file in `templates/project/`

#### Scenario: Loop of a change
- **WHEN** a reader reads the section "How It Works" of `README.md`
- **THEN** it has a Mermaid diagram with the steps propose, apply, code review, QA and archive

#### Scenario: Terms
- **WHEN** a reader finds one of the terms "change", "role", "document drift", "decided ADR", "current ADR", "superseded ADR" or "sparc markers" in `README.md`
- **THEN** the section "How It Works" gives a definition of the term

#### Scenario: Writing style and limits
- **WHEN** a reader reads `README.md`
- **THEN** it tells that the text follows ASD-STE100 on purpose, and it links to the canvas section "Core Risks and Missing Information"
