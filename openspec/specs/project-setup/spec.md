# project-setup Specification

## Purpose
Sets up sparc in a new or existing project with `/sparc:init`: the tools, the template files and the first content of the documents from evidence.

## Requirements

### Requirement: Prerequisites before setup
Before it changes a file, `/sparc:init` SHALL make sure that the project is a git repository, that OpenSpec is installed and that Node.js is installed. It SHALL ask the user before it runs `git init`. If OpenSpec is not installed, it SHALL stop and tell the install command. If Node.js is not installed, it SHALL stop and tell the user to install the latest Node.js LTS version. It SHALL NOT stop because of the Node.js version.

#### Scenario: Not a git repository
- **WHEN** the user runs `/sparc:init` in a folder that is not a git repository
- **THEN** init asks the user if it can run `git init`, and does not run it before the answer

#### Scenario: OpenSpec is not installed
- **WHEN** `openspec --version` fails
- **THEN** init stops, writes no file, and tells the user to run `npm install -g @fission-ai/openspec`

#### Scenario: Node.js is not installed
- **WHEN** `node --version` fails
- **THEN** init stops, writes no file, and tells the user to install the latest Node.js LTS version from https://nodejs.org

#### Scenario: Any installed Node.js version
- **WHEN** `node --version` returns a version, for example `v22.23.5`
- **THEN** init continues with the next step

### Requirement: Template files without overwrite
`/sparc:init` SHALL copy each file of `templates/project/` into the project with the same relative path. It SHALL NOT overwrite a file that exists. For each existing file, it SHALL show the difference and ask the user to keep, replace or merge it.

#### Scenario: New project
- **WHEN** `/sparc:init` runs in an empty git repository
- **THEN** the project has each file of `templates/project/` at the same relative path

#### Scenario: Project has a README
- **WHEN** the project has a `README.md`
- **THEN** init shows the difference to the template README, asks keep, replace or merge, and does not change the file before the answer

### Requirement: Existing OpenSpec configuration is merged
If `openspec/config.yaml` exists, `/sparc:init` SHALL merge the sparc `context`, `rules` and `operations` into it between the sparc markers (see `project-update`). The first line of the file SHALL be the `# sparc` marker line, because the hooks use it to find a sparc project.

#### Scenario: OpenSpec was already in use
- **WHEN** the project has an `openspec/config.yaml` with its own `context`
- **THEN** after init the file starts with the `# sparc` line, has the sparc text between `# sparc:begin` and `# sparc:end`, and keeps the project text outside the markers

### Requirement: AGENTS.md is the only agent instruction file
`/sparc:init` SHALL NOT create `CLAUDE.md`. If the project has a `CLAUDE.md`, init SHALL ask the user before it moves the text into `AGENTS.md` and deletes `CLAUDE.md`.

#### Scenario: Project has a CLAUDE.md
- **WHEN** the project has a `CLAUDE.md`
- **THEN** init asks the user, and moves the text into `AGENTS.md` and deletes `CLAUDE.md` only after a "yes"

#### Scenario: New project
- **WHEN** `/sparc:init` runs in a project without `CLAUDE.md`
- **THEN** the project has no `CLAUDE.md` after init

### Requirement: First content from evidence
`/sparc:init` SHALL fill the documents only with facts that it found in the code, the config, the commands that it ran, or the answers of the user (see `rules/evidence.md`). It SHALL ask for the goal, the stakeholders and the quality requirements in one message. Each unknown SHALL go into the canvas section "Core Risks and Missing Information".

#### Scenario: Existing code base
- **WHEN** `/sparc:init` runs in a project with code
- **THEN** the C4 diagrams name only actors, systems, containers and relations that are in the code or the config, and `AGENTS.md` names only commands that init ran

#### Scenario: New project
- **WHEN** `/sparc:init` runs in a project without code
- **THEN** the README section "Key Features" says "None yet."

#### Scenario: Questions to the user
- **WHEN** init needs the goal, the stakeholders and the quality requirements
- **THEN** it asks for all three in one message

### Requirement: First decision record
`/sparc:init` SHALL write `docs/adr/0001-use-sparc-for-spec-driven-development.md` with the status `proposed`. It SHALL set the status `accepted` and commit the ADR only after an explicit approval (see `approval`).

#### Scenario: User approves ADR-0001
- **WHEN** the user approves ADR-0001 in init
- **THEN** ADR-0001 has the status `accepted` and is in a commit

### Requirement: Setup completes with a check and a commit
At the end, `/sparc:init` SHALL run the check, fix each finding or write it as an open point in the canvas, commit with the header `chore: Add sparc harness`, and tell the next step `/sparc:propose <idea>`. In the workflow `pull-request`, init SHALL make the branch `chore/sparc-init` if the repository has commits.

#### Scenario: Successful setup
- **WHEN** init has written all documents
- **THEN** a commit `chore: Add sparc harness` exists, and init reports the created files, the open points and the next step `/sparc:propose <idea>`

#### Scenario: Team project with history
- **WHEN** the user chooses the workflow `pull-request` and the repository has commits
- **THEN** the init commit is on the branch `chore/sparc-init`
