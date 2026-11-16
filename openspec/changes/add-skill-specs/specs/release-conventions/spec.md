# Spec Delta

## ADDED Requirements

### Requirement: Release start conditions
`/sparc:release` SHALL run on the default branch with its latest state. It SHALL stop before it changes a file when a test fails, when the check has a finding, or when `## [Unreleased]` in `CHANGELOG.md` is empty.

#### Scenario: Nothing to release
- **WHEN** `## [Unreleased]` has no entry
- **THEN** release stops and tells the user that there is nothing to release

#### Scenario: Check finding
- **WHEN** the check has a finding
- **THEN** release stops and reports the finding

### Requirement: Release commit and tag
After the approval of the version, `/sparc:release` SHALL commit with the header `chore(release): <version>` and tag with `v<version>`. In the workflow `trunk`, the tag SHALL be on the release commit. In the workflow `pull-request`, the tag SHALL be on the merge commit. Release SHALL ask the user before it pushes the tag.

#### Scenario: Trunk release
- **WHEN** the workflow is `trunk` and the user approves the version 0.8.0
- **THEN** a commit `chore(release): 0.8.0` exists with the tag `v0.8.0`, and release asks before it pushes the tag

#### Scenario: Pull request release
- **WHEN** the workflow is `pull-request` and the user approves the version 0.8.0
- **THEN** the release commit is on the branch `chore/release-0.8.0`, and the tag `v0.8.0` goes on the merge commit after the merge
