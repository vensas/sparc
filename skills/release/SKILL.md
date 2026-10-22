---
name: release
description: Make a release. Calculates the next semantic version from the Conventional Commits and the Unreleased changelog entries, moves the entries into a release section, sets the version in the manifest and tags the release.
argument-hint: "[version, if you want to set it]"
disable-model-invocation: true
---

# sparc release

Make a release. Version from the user (optional): $ARGUMENTS

Read ${CLAUDE_PLUGIN_ROOT}/rules/release.md and ${CLAUDE_PLUGIN_ROOT}/rules/approval.md first. Obey them.

## 1. Check the start conditions

1. Switch to the default branch and get the latest state. Do not release from a change branch.
2. Run all tests. If a test fails, stop.
3. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs`. If there is a finding, stop and report it.
4. Read `## [Unreleased]` in `CHANGELOG.md`. If it is empty, stop. There is nothing to release.

## 2. Calculate the version

1. Find the latest release in `CHANGELOG.md`. If there is none, the current version is the version in the manifest, or `0.0.0`.
2. Read the commit headers since the last release tag: `git log <last-tag>..HEAD --format=%s%n%b`. If there is no tag, read all commits.
3. Calculate the next version with the table in the release rule.
4. Show the user the current version, the next version, the reason and the changelog entries. Get approval.

## 3. Write the release

1. Make the branch `chore/release-<version>`.
2. In `CHANGELOG.md`, rename `## [Unreleased]` to `## [<version>] - <today>`. Add a new empty `## [Unreleased]` above it.
3. Set the same version in the manifest (`package.json` or `.claude-plugin/plugin.json`) and in each other version file of the project.
4. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs`. It must report no finding.
5. Commit: `chore(release): <version>`.
6. Open a pull request as the release rule tells you. After the merge, tag the merge commit: `git tag v<version>` and `git push origin v<version>`. Ask the user before you push the tag.
