# Proposal

## Why

A review of the sparc documents from the view of a first-time reader found these problems:

- The README tells how sparc works before it tells what the reader gets.
- "Key Features" has 11 bullets with internal details and terms that it does not define, for example "document drift", "decided ADR" and "marked sparc text".
- The README does not show the files that `/sparc:init` makes or the loop of a change.
- The README does not tell that its English follows ASD-STE100 on purpose. A reader can think that the short sentences are bad English.
- The README does not show the cost and the limits of sparc. The canvas has an honest risk list, but the README does not link to it.
- The README uses a personal path (`~/dev/vensas/sparc`), and the access notes for the private repository come before all install steps.
- The backlog has 20 done items and 4 open items. The done items repeat the changelog, and some are not correct now. For example, "Agents: product owner, …" contradicts [ADR-0015](../../../docs/adr/0015-use-roles-as-rules-with-a-fresh-context-code-review.md).
- The quality requirements in the canvas have no measurable values.
- The canvas section "Core Risks and Missing Information" mixes test evidence with risks.
- A reader can think that 3 superseded ADRs in 16 show an unstable design. No document tells that a new ADR replaces an old one on purpose.
- The C4 container diagram has 7 containers and 16 relations. Its layout on GitHub is not checked.

Backlog item: "Documents for a first-time reader" in [docs/backlog.md](../../../docs/backlog.md).

## What Changes

- The README starts with the value of sparc. "Key Features" has 5 bullets or fewer. A new section "How It Works" has the loop of a change as a diagram, the files that `/sparc:init` makes as a tree, and the terms that sparc uses, each with a short definition.
- The README tells that sparc writes all English text in ASD-STE100 on purpose.
- The README has a short "Limits and cost" part. It links to the canvas section "Core Risks and Missing Information".
- The README tells that a new ADR supersedes an old ADR on purpose, and that the canvas shows the current ADRs.
- The README uses `claude --plugin-dir .`. The access notes for the private repository become short, and the details are in a collapsible block.
- **Breaking:** The backlog holds only items that are not done. Archive removes the item of the change. The changelog is the home of done work. The document check reports a checked item and an item of an archived change. It does not require an item for an archived change. Existing projects must remove their done items.
- The backlog of sparc keeps only open items, with correct text.
- The canvas of sparc gets measurable quality requirements and a risk section with risks and missing information only.
- The C4 container diagram of sparc gets a layout that is checked with a render.

Out of scope, and new items in the backlog:

- A "How we work" section in the README template for human contributors.
- A note in the templates that tells which documents can stay short in a small project.
- A decision if the README of a project must follow STE.

Also out of scope:

- Changes to the README template, the canvas template and the C4 template.
- A check of the STE dictionary.

## Capabilities

### New Capabilities

- `document-set`: the rules for the sparc documents of a project. This change adds the backlog rule.

### Modified Capabilities

- `plugin-distribution`: the README of sparc introduces sparc to a first-time reader.

## Impact

- `README.md`, `docs/backlog.md`, `docs/architecture/canvas.md`, `docs/architecture/c4.md` of sparc.
- `rules/docs.md`, `skills/archive/SKILL.md`, `templates/project/openspec/config.yaml`, `openspec/config.yaml`.
- `scripts/check.mjs`, `scripts/check.test.mjs`, a new test for the README.
- Existing projects get findings for done backlog items. The findings warn and do not block ([ADR-0005](../../../docs/adr/0005-hook-warns-and-does-not-block.md)).
