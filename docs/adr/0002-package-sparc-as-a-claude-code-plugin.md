---
status: superseded by ADR-0018
date: 2026-10-22
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Package sparc as a Claude Code plugin

## Context and Problem Statement

sparc must be easy to use again in many projects with the Claude Code CLI. Updates must reach all projects.

## Considered Options

- A Claude Code plugin in the repository vensas/sparc, which is also its own marketplace
- A template repository that each project copies
- A script that copies files into `.claude/` of each project

## Decision Outcome

Chosen option: "A Claude Code plugin", because a plugin holds agents, skills, hooks and scripts as one versioned unit. Projects get updates through `/plugin update`.

### Consequences

- Good, because the agents, skills and rules exist one time only (DRY).
- Good, because `claude plugin validate` checks the structure.
- Bad, because skills have a namespace (`/sparc:init`) and projects without the plugin cannot run them.

## Amendments

