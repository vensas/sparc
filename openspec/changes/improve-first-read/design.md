# Design

## Context

See proposal.md - Why. `scripts/check.mjs` requires the README sections "Overview", "Key Features", "Architecture" and "Get Started". Other sections are permitted. `checkBacklog` requires a checked item for each archived change and an item for each open or archived change. `rules/docs.md`, `skills/archive/SKILL.md` and the archive guidance in both `config.yaml` files tell to check the item. The spec `plugin-distribution` already requires `claude --plugin-dir .` in the README, but the README uses `~/dev/vensas/sparc`.

## Goals / Non-Goals

**Goals:**

- A first-time reader understands what sparc gives before the details.
- Each claim in the README has evidence in the repository. The README links to the home of each fact and does not copy it.

**Non-Goals:**

- Changes to the project templates for the README, the canvas and the C4 diagrams.

## Decisions

### README structure

The required sections stay. The order is: introduction, "Overview" (problem and value), "Key Features" (5 bullets or fewer, value first), "How It Works", "Architecture", "Get Started", "License".

"How It Works" has:

- A Mermaid `flowchart` with the loop of a change: propose, apply (implementation, code review, QA, verifier), archive, release. GitHub renders Mermaid, and ADR-0003 already uses it.
- A tree of the files that `/sparc:init` makes, from `templates/project/`.
- A short table of terms: change, role, document drift, check, verifier, decided ADR, current ADR, superseded ADR, sparc markers, open point. Each definition links to its home rule or spec. The ADR terms tell that a new ADR supersedes an old one on purpose, and that the canvas shows the current ADRs.
- The mechanics that leave "Key Features": the check, the verifier with its 3 blocks, the update path, the ADR protection. One sentence each, with a link.
- "Limits and cost": each change goes through propose, apply and archive, also a small fix. The fresh-context code review costs one subagent for each change, with the measured value from the canvas. The section links to the canvas risks and does not copy them.
- One sentence: sparc writes all English text in ASD-STE100 on purpose, so that agents and readers with other first languages get one clear meaning.

Alternative: a separate `docs/guide.md`. Rejected, because the README is the first page on GitHub, and a second page adds a home.

### Install section

The steps stay. The access text for the private repository becomes one caution sentence before the steps, because STE puts a caution before its step. The details (SSH key, `gh auth setup-git`, `CLAUDE_CODE_PLUGIN_PREFER_HTTPS`) go into a `<details>` block. "Develop sparc" uses `claude --plugin-dir .`.

### README test

A new test file `scripts/readme.test.mjs` reads `README.md`. It tests each scenario of "README for a first-time reader": the number of bullets in "Key Features", each file of `templates/project/` in the tree, the steps in the Mermaid diagram, the terms, the STE sentence and the canvas link. The tree test finds drift when a template file is added.

### Backlog rule

See [ADR-0017](../../../docs/adr/0017-keep-only-open-items-in-the-backlog.md). `checkBacklog` changes:

- A checked item: finding "item \"<text>\" is done. Remove it. The changelog has the done work."
- An item of an archived change: finding "change \"<id>\" is archived. Remove its item."
- An open change without an item: finding as now.
- An archived change without an item: no finding.
- A link to a change that does not exist: finding as now.

`rules/docs.md` changes the backlog format and the sync trigger "Change archived" to "backlog (remove item)". `skills/archive/SKILL.md` step 4 and its description, and the archive guidance in both `config.yaml` files, say "remove". The guidance is in the sparc markers, so `/sparc:update` replaces it.

### Canvas of sparc

- Quality requirements get measured values. Examples from evidence: `node scripts/check.mjs` runs in about 1 second on sparc (measured 1.0 s, Node.js 24.12.0); `/sparc:init` copies 8 template files; the check has no npm dependencies. Each value names how to measure it again.
- "Core Risks and Missing Information" keeps only risks and missing information. A line that is only test evidence is removed when a `qa.md` or an ADR has the evidence. Else it becomes a risk or an open point.
- The "Date / Iteration" line gets the date of the change.

### C4 container diagram

Render the diagram with `mmdc` (Mermaid CLI, installed on the machine of the developer, not a dependency of sparc). If shapes or labels overlap, add `UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")` and order the elements so that the relations flow from top to bottom. The elements and relations stay the same. Check the result also on GitHub after the push.

Integration test tool: `node --test 'scripts/*.test.mjs'` (see AGENTS.md).

ADRs: [ADR-0017](../../../docs/adr/0017-keep-only-open-items-in-the-backlog.md) is new.

No C4 impact. The container diagram gets a new layout only.

## Risks / Trade-offs

- [The README gets longer] → "Key Features" gets shorter, and the details in "How It Works" are links. The install details go into a collapsible block.
- [Existing projects get backlog findings] → The findings warn and do not block. The changelog has a breaking entry with the migration step. `/sparc:update` shows it.
- [A Mermaid C4 layout on GitHub can differ from `mmdc`] → Check it on GitHub after the push. Write an open point if the layout stays bad.

## Migration Plan

The changelog gets a `**Breaking:**` entry: "Remove the done items from `docs/backlog.md`. The changelog has the done work." `/sparc:update` applies it.
