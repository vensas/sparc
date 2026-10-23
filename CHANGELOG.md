# Changelog

All notable changes to this project are in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- A logo in the README for the light and dark theme, and a plugin icon ([add-sparc-logo](openspec/changes/archive/2026-10-23-add-sparc-logo/proposal.md)).

## [0.3.0] - 2026-10-23

### Added

- The QA engineer role proves the spec scenarios of a change with integration and end-to-end tests, automation first ([add-qa-engineer](openspec/changes/archive/2026-10-23-add-qa-engineer/proposal.md)).
- The file `qa.md` in each change holds the result of each scenario and the manual checks.
- Code review: the software engineer role reviews the full change before QA and records the result in `qa.md`. Acceptance needs a review without open findings ([replace-agents-with-roles](openspec/changes/archive/2026-10-23-replace-agents-with-roles/proposal.md)).
- `/sparc:apply <id> fresh-context` runs QA and acceptance in a general-purpose subagent that follows the role files.
- `/sparc:update` updates a project to the installed sparc version. It applies the project steps of the breaking changelog entries and replaces only the marked sparc text ([add-update-path](openspec/changes/archive/2026-10-23-add-update-path/proposal.md)).
- A project records its sparc version in `openspec/config.yaml`. The check reports a project that is not at the installed version.

### Changed

- **Breaking:** The check protects decided ADRs through git history. It compares each decided ADR with its first committed decided version ([remove-adr-lock-hash](openspec/changes/archive/2026-10-23-remove-adr-lock-hash/proposal.md)). A project must commit each decided ADR.
- The check also protects `decision-makers`, `consulted`, `informed` and committed amendments of a decided ADR.
- The check reports ADR front matter fields that are not in MADR, and decided ADRs in a project without git.
- `/sparc:apply` runs the QA engineer after the task groups. The product owner accepts from `qa.md` and does only the manual checks.
- `/sparc:propose` names the integration or end-to-end test tool of the project, or proposes an ADR for it.
- `/sparc:archive` runs the test commands in `AGENTS.md`.
- **Breaking:** The agents are now role files in `rules/roles/`, and a QA engineer role is new. The skills follow them in the current session, without subagents and worktrees. A project needs no step.
- `/sparc:init` puts the sparc text of `AGENTS.md` and `openspec/config.yaml` between `sparc:begin` and `sparc:end` markers. Put project rules outside the markers.

### Removed

- **Breaking:** The option `--lock` of `check.mjs` and the ADR front matter field `locked`. Remove `--lock` calls and `locked:` lines.
- **Breaking:** The agent types `sparc:product-owner`, `sparc:architect`, `sparc:ux-designer` and `sparc:software-engineer`. A project that starts them by name must use the skills.

### Fixed

- The check no longer reports long sentences in decided ADRs, because they must not change ([skip-ste-check-for-decided-adrs](openspec/changes/archive/2026-10-23-skip-ste-check-for-decided-adrs/proposal.md)).

## [0.2.0] - 2026-10-22

### Added

- Release conventions: Keep a Changelog, Semantic Versioning, Conventional Commits and pull requests for each project ([add-release-conventions](openspec/changes/archive/2026-10-22-add-release-conventions/proposal.md)).
- `CHANGELOG.md` in the project templates.
- The check finds changelog format errors and a manifest version that is not equal to the latest release.
- The check finds commits without a Conventional Commits header and changes on the default branch.
- The skill `/sparc:release` makes a release with the next semantic version.

### Changed

- `/sparc:propose` makes a change branch. `/sparc:apply` commits each task. `/sparc:archive` writes the changelog entries and opens the pull request.
- The README tells that you give the project idea in `/sparc:init` and each feature in `/sparc:propose`.

### Fixed

- The check no longer stops with an error when Node.js runs it without a script path.

## [0.1.0] - 2026-10-22

### Added

- First version of sparc: four agents, six skills, shared rules, project templates, a document check and a Stop hook that warns.
