# release-conventions Specification

## Purpose
Gives each sparc project a traceable history and a clear version: a changelog, semantic versions, conventional commit messages and pull requests for all changes.

## Requirements

### Requirement: Changelog in Keep a Changelog format
A sparc project SHALL have a `CHANGELOG.md` in the Keep a Changelog 1.1.0 format. The check SHALL report each deviation from the format.

#### Scenario: Changelog is missing
- **WHEN** the project has no `CHANGELOG.md`
- **THEN** the check reports that the file is missing

#### Scenario: Unreleased section is missing
- **WHEN** `CHANGELOG.md` has no `## [Unreleased]` section
- **THEN** the check reports that the section is missing

#### Scenario: Release heading is not valid
- **WHEN** a release heading does not have the form `## [X.Y.Z] - YYYY-MM-DD` with a valid semantic version
- **THEN** the check reports the heading

#### Scenario: Releases are not in reverse order
- **WHEN** a release has a higher version than the release above it
- **THEN** the check reports the order

#### Scenario: Type of change is not valid
- **WHEN** a `###` heading in the changelog is not Added, Changed, Deprecated, Removed, Fixed or Security
- **THEN** the check reports the heading

### Requirement: Version in the manifest matches the changelog
If the project has a `package.json` or a `.claude-plugin/plugin.json` with a version, that version SHALL be equal to the latest release in `CHANGELOG.md`.

#### Scenario: Version differs
- **WHEN** `.claude-plugin/plugin.json` has version `0.2.0` and the latest release in the changelog is `0.1.0`
- **THEN** the check reports that the versions differ

#### Scenario: No release yet
- **WHEN** the changelog has no release and the manifest has a version
- **THEN** the check does not report a difference

### Requirement: Conventional commit messages
Each commit on the work branch that is not on the default branch SHALL have a Conventional Commits 1.0.0 header. In the workflow `trunk`, each commit on the default branch after the last release tag SHALL have a Conventional Commits 1.0.0 header.

#### Scenario: Commit header is not conventional
- **WHEN** a commit on the work branch has the header `updated stuff`
- **THEN** the check reports the commit

#### Scenario: Commit header is conventional
- **WHEN** a commit on the work branch has the header `feat(check): Add changelog check`
- **THEN** the check does not report the commit

#### Scenario: Trunk commit header is not conventional
- **WHEN** the workflow is `trunk` and a commit on `main` after the last release tag has the header `updated stuff`
- **THEN** the check reports the commit

### Requirement: Changes through pull requests
In the workflow `pull-request`, changes SHALL be made on a work branch and merged through a pull request. The check SHALL warn when files change on the default branch. In the workflow `trunk`, changes SHALL be committed on the default branch without a work branch or a pull request, and the check SHALL NOT warn about it.

#### Scenario: Files change on the default branch
- **WHEN** the workflow is `pull-request`, the current branch is `main` and the working tree has changes
- **THEN** the check reports that work must be done on a branch

#### Scenario: Trunk-based change
- **WHEN** the workflow is `trunk`, the current branch is `main` and the working tree has changes
- **THEN** the check does not report the branch

#### Scenario: Archive in the workflow trunk
- **WHEN** the workflow is `trunk` and the user runs `/sparc:archive <id>`
- **THEN** archive commits on the default branch and does not make a branch or a pull request

### Requirement: Release with a semantic version
The release skill SHALL calculate the next version from the Unreleased entries and the commits. It SHALL move the Unreleased entries into a new release section and set the same version in the manifest.

#### Scenario: Breaking change
- **WHEN** a commit since the last release has `!` in its header or a `BREAKING CHANGE:` footer
- **THEN** the release skill increases the major version (the minor version before 1.0.0)

### Requirement: Workflow setting
A project SHALL record its workflow as `workflow` under the key `sparc` in `openspec/config.yaml`: `trunk` or `pull-request`. A project without this key SHALL use `pull-request`. `/sparc:init` SHALL ask if the user works alone or in a team, suggest `trunk` for a solo user and `pull-request` for a team, and write the choice.

#### Scenario: Project without a workflow key
- **WHEN** `openspec/config.yaml` has no `workflow` under `sparc`
- **THEN** the check and the skills use the workflow `pull-request`

#### Scenario: Solo user in init
- **WHEN** the user tells `/sparc:init` that they work alone and accepts the suggestion
- **THEN** `openspec/config.yaml` has `workflow: trunk` under `sparc`
