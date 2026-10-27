---
status: accepted
date: 2026-10-27
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Pin the marketplace entry to the release tag

## Context and Problem Statement

The marketplace entry of sparc has the source `./`. A new install gets the head of `main`, also with commits that are not released. How do users get only released versions of sparc?

## Decision Drivers

- Users get only released versions.
- No CI job writes to the repository.
- The add and install commands of the users stay the same.

## Considered Options

- A `github` source with `ref` set to the release tag, set in the release commit
- A `stable` branch that CI moves to each release tag
- A CI commit on `main` that sets the `ref` after the tag push

## Decision Outcome

Chosen option: "A `github` source with `ref` set to the release tag, set in the release commit". It needs no CI write access and keeps the user commands.

### Consequences

- Good, because a new install gets the files of the latest release tag.
- Good, because the release commit holds all version values. CI only reads them.
- Bad, because the release commit names a tag that exists only after the push. The release must push the commit and the tag in one atomic push.
- Bad, because a marketplace added from a local folder also installs the tag from GitHub. Development uses `claude --plugin-dir .`.

### Confirmation

`scripts/verify-release.mjs` fails when the `ref` is not `v<version>` of `plugin.json`. The publication workflow runs it for each release tag.

## Pros and Cons of the Options

### A `stable` branch that CI moves to each release tag

- Good, because the marketplace entry does not change at each release.
- Bad, because CI needs write access to a branch.
- Bad, because users must add `vensas/sparc#stable`. Existing users must add the marketplace again.

### A CI commit on `main` that sets the `ref` after the tag push

- Good, because the release commit does not name a tag that does not exist yet.
- Bad, because CI needs write access to `main`, and `main` gets a commit after each release tag.

## More Information

- [Plugin sources](https://code.claude.com/docs/en/plugins/marketplace-reference.md#plugin-sources): `ref` and `sha` of a `github` source.
- [Release a new version](https://code.claude.com/docs/en/plugins/host-marketplace.md#release-a-new-version): users get a new copy when the version changes.
- [ADR-0002](0002-package-sparc-as-a-claude-code-plugin.md) stays valid: sparc keeps its own marketplace.

## Amendments
