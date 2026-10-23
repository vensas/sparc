---
status: accepted
date: 2026-10-23
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Record the sparc version and mark sparc text in projects

## Context and Problem Statement

`/plugin update` does not update the files that `/sparc:init` copied into a project. A project does not know its sparc version, and its files mix sparc text and project text. How does a project get to a newer sparc version without loss of its own text?

## Considered Options

- Version in `openspec/config.yaml`, sparc text between markers, migration steps from the changelog
- Version in a separate file, a diff and a question for each file, migration files for each release

## Decision Outcome

Chosen option: "Version in `openspec/config.yaml`, sparc text between markers, migration steps from the changelog", because it adds no file and keeps one home for each fact. The user chose this option.

### Consequences

- Good, because an update replaces only sparc text and keeps project text.
- Good, because the changelog is the only home of migration steps.
- Bad, because sparc owns the keys `context`, `rules` and `operations` in `openspec/config.yaml`. Project rules go into `AGENTS.md`.
- Bad, because each breaking changelog entry must tell the project step.

### Confirmation

The check reports a project version that is not the installed version. `/sparc:update` keeps the text outside the markers.

## More Information

OpenSpec 1.14.3 accepts the extra key `sparc` in `openspec/config.yaml`. This was tested with `openspec new change`, `instructions`, `validate` and `doctor`.

## Amendments

