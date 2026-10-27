# plugin-distribution Specification

## Purpose
Tell how users install and update sparc, which version the marketplace gives them, and how CI tests and publishes each release.

## Requirements

### Requirement: Marketplace gives the latest release

The sparc entry in `.claude-plugin/marketplace.json` SHALL have a `github` source for `vensas/sparc` with `ref` set to `v<version>`. `<version>` is the version in `.claude-plugin/plugin.json`.

#### Scenario: Install after a release

- **WHEN** the latest release is 0.6.0 and `main` has commits after the tag `v0.6.0`
- **THEN** `/plugin install sparc@sparc` installs the files of the tag `v0.6.0`

#### Scenario: Entry and manifest differ

- **WHEN** `plugin.json` has the version 0.6.0 and the marketplace entry has the `ref` `v0.5.0`
- **THEN** the release verification fails and names both values

### Requirement: Release commit and tag are pushed together

The release of sparc SHALL set the `ref` of the marketplace entry in the release commit. It SHALL push the release commit and the tag in one atomic push.

#### Scenario: Release 0.6.0

- **WHEN** `/sparc:release` makes the release 0.6.0 of sparc
- **THEN** the commit `chore(release): 0.6.0` sets `ref` to `v0.6.0`, and `git push --atomic origin main v0.6.0` pushes the commit and the tag

### Requirement: Validation on each push and pull request

A CI workflow SHALL run on each push to `main` and on each pull request. It SHALL run the tests, the sparc check and the plugin validation. The workflow SHALL fail when one of them fails.

#### Scenario: A test fails

- **WHEN** a commit on `main` makes a test in `scripts/*.test.mjs` fail
- **THEN** the validation workflow fails for that commit

#### Scenario: All checks pass

- **WHEN** the tests, `node scripts/check.mjs` and `claude plugin validate .` pass
- **THEN** the validation workflow passes

### Requirement: Publication of a release tag

A CI workflow SHALL run on the push of a tag `vX.Y.Z`. It SHALL make sure that the tag, the version in `plugin.json`, the `ref` of the marketplace entry and the latest release in `CHANGELOG.md` are equal. It SHALL run the same checks as the validation workflow. Then it SHALL make a GitHub release for the tag, with the changelog section of the release as notes.

#### Scenario: Tag matches the release

- **WHEN** the tag `v0.6.0` is pushed, `plugin.json` has 0.6.0, the marketplace `ref` is `v0.6.0` and the latest changelog release is `[0.6.0]`
- **THEN** the workflow makes the GitHub release `v0.6.0` with the entries of `## [0.6.0]` as notes

#### Scenario: Tag does not match the release

- **WHEN** the tag `v0.6.0` is pushed and the latest changelog release is `[0.5.0]`
- **THEN** the workflow fails, names the values that differ, and makes no GitHub release

### Requirement: Install instructions

The README SHALL tell how to add the marketplace and install sparc with the Claude Code CLI and with Claude Desktop. It SHALL tell how to update sparc and how to load a local checkout for development.

#### Scenario: Read the install section

- **WHEN** a user reads the install section of `README.md`
- **THEN** it has the CLI commands to add the marketplace, install, update and list sparc, the Claude Desktop steps, and `claude --plugin-dir .` for a local checkout
