---
status: accepted
date: 2026-10-23
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Use a trunk or pull request workflow

## Context and Problem Statement

ADR-0006 requires Keep a Changelog, Semantic Versioning, Conventional Commits and a pull request for each change. For a solo project, a branch and a pull request for each change add work without a reviewer. Which workflow does a sparc project use?

## Considered Options

- Each project chooses `trunk` or `pull-request`. Changelog, SemVer and Conventional Commits stay for both.
- Pull requests for all changes, as ADR-0006 decided
- Trunk for all projects

## Decision Outcome

Chosen option: "Each project chooses `trunk` or `pull-request`", because solo projects get a simpler flow and teams keep the review. The user chose this option.

### Consequences

- Good, because a solo project commits on the default branch without a branch or a merge.
- Good, because Conventional Commits stay checked in both workflows. The release skill needs them.
- Bad, because the skills and the check have two paths. The release rule is the only home of the differences.

### Confirmation

The check reads `sparc.workflow`. The skills make a branch or a pull request only in the workflow `pull-request`.

## More Information

Supersedes [ADR-0006](0006-use-keep-a-changelog-semver-and-conventional-commits.md). ADR-0011 stays valid.

## Amendments

