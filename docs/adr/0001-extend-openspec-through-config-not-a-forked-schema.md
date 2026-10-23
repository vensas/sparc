---
status: accepted
date: 2026-10-22
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Extend OpenSpec through config, not a forked schema

## Context and Problem Statement

sparc must add its rules (STE, ADRs, C4, backlog, tests) to the OpenSpec workflow. OpenSpec 1.14.3 supports custom schemas (experimental) and project rules in `openspec/config.yaml`. A test showed that `openspec instructions` adds the `context` and the `rules` of `config.yaml` to each artifact instruction.

## Considered Options

- Rules in `openspec/config.yaml` with the default schema `spec-driven`
- A forked schema `sparc` with own artifacts and templates

## Decision Outcome

Chosen option: "Rules in openspec/config.yaml", because it adds the sparc rules without a copy of the OpenSpec schema. Updates of OpenSpec stay usable without a merge.

### Consequences

- Good, because there is no copy of the long schema instructions (DRY).
- Good, because sparc does not depend on the experimental schema commands.
- Bad, because sparc cannot add new artifact types (for example a mockup artifact). Mockups and ADRs stay outside the change folder.

## Amendments

