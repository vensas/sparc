---
status: amended
date: 2026-10-22
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
locked: 9694df37b076577c
---

# The hook warns and does not block

## Context and Problem Statement

sparc runs `check.mjs` when an agent stops. The hook can block the stop (exit code 2 or `decision: block`) or only warn.

## Considered Options

- Warn: `systemMessage` for the user and `additionalContext` for the agent
- Block: the agent cannot stop until the documents are in sync

## Decision Outcome

Chosen option: "Warn", because documents are often out of sync in the middle of a task. The user chose this option.

### Consequences

- Good, because the agent does not loop on drift that it cannot fix now.
- Bad, because drift can stay if the agent and the user ignore the warning. `/sparc:archive` runs the check again as a gate.

## Amendments

### 2026-10-22: Warn one time for the same findings

Approved by: [@sventropy](https://github.com/sventropy), chat

A live test showed that a warning makes the agent reply one more time. The hook keeps the digest of the last findings for each project. It warns again only when the findings change. The hook still does not block.
