---
status: superseded by ADR-0008
date: 2026-10-22
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Lock decided ADRs with a body hash

## Context and Problem Statement

An accepted ADR must not change. Only its status, its date and approved amendments can change. sparc must find each other change without an LLM.

## Considered Options

- A hash of the body (without front matter and `## Amendments`) in the front matter field `locked`
- A comparison with the git version at the time of the decision
- A review by an agent only

## Decision Outcome

Chosen option: "A hash of the body", because it works without git history and gives the same result each time.

### Consequences

- Good, because `check.mjs` finds each change to the body.
- Good, because status changes and amendments do not break the lock.
- Bad, because a fix of a typing error in the body also breaks the lock. Then the user must approve a new lock.

## Amendments

