## MODIFIED Requirements

### Requirement: Prerequisites before setup
Before it changes a file, `/sparc:init` SHALL make sure that the project is a git repository, that OpenSpec is installed and that Node.js 26 or later is installed. It SHALL ask the user before it runs `git init`. If OpenSpec is not installed, it SHALL stop and tell the install command. If Node.js is not installed or older than 26, it SHALL stop and tell the user to install the current Node.js LTS version.

#### Scenario: Not a git repository
- **WHEN** the user runs `/sparc:init` in a folder that is not a git repository
- **THEN** init asks the user if it can run `git init`, and does not run it before the answer

#### Scenario: OpenSpec is not installed
- **WHEN** `openspec --version` fails
- **THEN** init stops, writes no file, and tells the user to run `npm install -g @fission-ai/openspec`

#### Scenario: Node.js is too old
- **WHEN** `node --version` returns `v24.12.0`
- **THEN** init stops, writes no file, and tells the user to install the current Node.js LTS version from https://nodejs.org

#### Scenario: Node.js 26
- **WHEN** `node --version` returns `v26.13.1`
- **THEN** init continues with the next prerequisite
