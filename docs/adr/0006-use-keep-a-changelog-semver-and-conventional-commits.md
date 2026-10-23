---
status: superseded by ADR-0012
date: 2026-10-22
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Use Keep a Changelog, SemVer and Conventional Commits with pull requests

## Context and Problem Statement

Software artifacts need a clear history and a clear version. Agents make many changes fast. Without fixed rules, the history and the version do not tell users what changed.

## Considered Options

- Keep a Changelog 1.1.0, Semantic Versioning 2.0.0, Conventional Commits 1.0.0 and pull requests for all changes
- Free-form commit messages and release notes from the git log

## Decision Outcome

Chosen option: "Keep a Changelog, SemVer, Conventional Commits and pull requests", because the user requires these conventions for all software artifacts.

### Consequences

- Good, because users read the changes in the changelog, and the version tells them the impact.
- Good, because the release skill can calculate the next version from the commit types.
- Bad, because each change needs a branch and a pull request, also for small changes.

### Confirmation

`scripts/check.mjs` checks the changelog format, the manifest version, the commit headers on the branch and work on the default branch.

## Amendments

