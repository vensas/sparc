# Tasks

## 1. Backlog holds only open items

- [x] 1.1 Change `checkBacklog` in `scripts/check.mjs` as design.md tells. Change the backlog test in `scripts/check.test.mjs` and add a test for each scenario of "Check reports done backlog items". Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: none.
- [x] 1.2 Change the backlog format and the sync trigger in `rules/docs.md`, step 4 and the description of `skills/archive/SKILL.md`, and the archive guidance in `templates/project/openspec/config.yaml` and `openspec/config.yaml` to remove the item. Add a test for "Backlog holds only open items: Rule in the document rules". Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: none.
- [ ] 1.3 Remove the done items from `docs/backlog.md`. Change "Write the specs of sparc as OpenSpec capabilities" to name the skills without a spec. Verify: `node scripts/check.mjs` gives no backlog finding. Documents: docs/backlog.md.

## 2. README for a first-time reader

- [ ] 2.1 Add `scripts/readme.test.mjs` with a test for each scenario of "README for a first-time reader". Verify: the tests fail on the current README. Documents: none.
- [ ] 2.2 Rewrite `README.md` as design.md tells: value first, "Key Features" with 5 bullets or fewer, "How It Works" with the loop diagram, the file tree, the terms, the mechanics, "Limits and cost" and the STE sentence. Make the install access text short with a `<details>` block, and use `claude --plugin-dir .`. Verify: `node --test 'scripts/*.test.mjs'` passes, `node scripts/check.mjs` gives no finding, and the Mermaid diagram renders with `mmdc`. Documents: README.md.

## 3. Canvas and C4 of sparc

- [ ] 3.1 Write measurable quality requirements in `docs/architecture/canvas.md`, from measured values. Remove the lines in "Core Risks and Missing Information" that are only evidence and that a `qa.md` or an ADR has. Change the other lines to risks or open points. Verify: `node scripts/check.mjs` gives no finding, and each value names how to measure it. Documents: docs/architecture/canvas.md.
- [ ] 3.2 Render the C4 container diagram with `mmdc`. If shapes or labels overlap, change the layout as design.md tells, with the same elements and relations. Verify: the render has no overlap, and a diff shows the same `Container`, `System_Ext` and `Rel` lines. Documents: docs/architecture/c4.md.

## Workflow follow-up

- QA: look at the README and the C4 diagrams on GitHub after the push.
- At archive: set ADR-0017 to `accepted`. Remove the backlog item of this change (the new rule). Add a `**Breaking:**` changelog entry with the migration step for the backlog.
