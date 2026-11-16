# project-update Specification

## Purpose
Lets a project that already uses sparc get to a newer sparc version in a safe way, without loss of its own text.

## Requirements

### Requirement: Project records its sparc version
A sparc project SHALL record the sparc version that it is up to date with as `version` under the key `sparc` in `openspec/config.yaml`. `/sparc:init` SHALL write the installed sparc version. A project without this key SHALL count as version 0.1.0.

#### Scenario: New project
- **WHEN** a user runs `/sparc:init` with sparc 0.3.0 installed
- **THEN** `openspec/config.yaml` has `sparc:` with `version: 0.3.0`

#### Scenario: Project without a version
- **WHEN** `openspec/config.yaml` of a project has no `sparc` key
- **THEN** the check and `/sparc:update` use the version 0.1.0 for the project

### Requirement: Check reports an outdated project
The check SHALL report one finding when the project version is not the installed sparc version. The check SHALL NOT report it in the sparc repository itself.

#### Scenario: Project is behind
- **WHEN** the project version is 0.2.0 and sparc 0.3.0 is installed
- **THEN** the check reports that the project is at 0.2.0, that sparc 0.3.0 is installed, and that the user must run `/sparc:update`

#### Scenario: Project is up to date
- **WHEN** the project version is equal to the installed sparc version
- **THEN** the check does not report the version

### Requirement: Marked sparc text
`/sparc:init` SHALL put the sparc text of `AGENTS.md` and `openspec/config.yaml` between a `sparc:begin` marker and a `sparc:end` marker. `/sparc:update` SHALL replace only the text between the markers with the current template text, and SHALL keep all text outside the markers. `docs/adr/0000-template.md` SHALL be replaced as a whole.

#### Scenario: Update keeps project text
- **WHEN** `AGENTS.md` has project commands outside the markers and old sparc rules between them
- **THEN** after `/sparc:update` the project commands are unchanged and the text between the markers is the current template text

#### Scenario: Project without markers
- **WHEN** a file that sparc owns in part has no markers
- **THEN** `/sparc:update` shows the difference to the current template and adds the markers only after the user confirms

### Requirement: Migrations from the changelog
`/sparc:update` SHALL read the breaking entries of the sparc `CHANGELOG.md` for each release after the project version, up to the installed version. It SHALL show the migration steps and apply them only after the user approves. Each breaking changelog entry SHALL tell what a project must do.

#### Scenario: Breaking release between the versions
- **WHEN** the project version is 0.2.0, sparc 0.3.0 is installed, and the 0.3.0 entry says "Remove `--lock` calls and `locked:` lines"
- **THEN** `/sparc:update` shows this step, and after approval removes the `locked:` lines from the ADRs of the project

### Requirement: Missing template files
`/sparc:update` SHALL add each template file that the project does not have. It SHALL NOT overwrite a file that exists, except the text between the markers and `docs/adr/0000-template.md`.

#### Scenario: File from a newer release is missing
- **WHEN** a project at 0.1.0 has no `CHANGELOG.md`
- **THEN** `/sparc:update` adds `CHANGELOG.md` from the template

### Requirement: Update completes with a check
At the end, `/sparc:update` SHALL set the project version to the installed version, run the check and commit as the release rule tells.

#### Scenario: Successful update
- **WHEN** all migration steps and block updates are done
- **THEN** the project version is the installed version, the check has no version finding, and a commit `chore: Update sparc to <version>` exists

### Requirement: Update only to a newer version
`/sparc:update` SHALL stop without a change when the project version is equal to the installed sparc version or higher than it. For a higher project version, it SHALL tell the user to update the plugin with `/plugin update`.

#### Scenario: Project is up to date
- **WHEN** the project version and the installed version are 0.7.0
- **THEN** update tells the user that the project is up to date and changes no file

#### Scenario: Project is newer than the plugin
- **WHEN** the project version is 0.8.0 and the installed version is 0.7.0
- **THEN** update changes no file and tells the user to run `/plugin update`
