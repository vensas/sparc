---
status: accepted
date: 2026-10-22
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Use Mermaid for C4 diagrams

## Context and Problem Statement

sparc keeps a C4 system context diagram and a container diagram for each project. The diagrams must be text, so that agents can change them and git can show the differences.

## Considered Options

- Mermaid C4 (`C4Context`, `C4Container`)
- Structurizr DSL
- PlantUML with C4-PlantUML

## Decision Outcome

Chosen option: "Mermaid C4", because GitHub shows Mermaid directly and no extra tool is necessary. The user chose this option.

### Consequences

- Good, because the diagrams show in GitHub and in most Markdown viewers.
- Bad, because Mermaid C4 support is less complete than Structurizr. The two diagrams do not share one model, so the architect must keep the aliases the same.

## Amendments

