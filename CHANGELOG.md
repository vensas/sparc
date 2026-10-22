# Changelog

All notable changes to this project are in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
