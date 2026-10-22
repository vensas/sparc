---
name: adr
description: Create or change an architecture decision record in MADR format. Actions are new, accept, reject, deprecate, amend and supersede. Enforces the sparc status rules and the lock.
argument-hint: "<new|accept|reject|deprecate|amend|supersede> [ADR number] [title or text]"
---

# sparc adr

Action: $ARGUMENTS

Read ${CLAUDE_PLUGIN_ROOT}/rules/adr.md and ${CLAUDE_PLUGIN_ROOT}/rules/approval.md first. Obey them.

## new

1. Find the next free number in `docs/adr/`.
2. Copy `docs/adr/0000-template.md` (or `${CLAUDE_PLUGIN_ROOT}/templates/project/docs/adr/0000-template.md`) to `docs/adr/NNNN-<kebab-title>.md`.
3. Use the `sparc:architect` agent to fill it. The status is `proposed`. The date is today.

## accept | reject

1. Get approval from the user for this ADR.
2. Set the status and the date.
3. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs --lock <file>`.
4. Add the ADR to the canvas section "Core Decisions" (for `accepted` only).

## deprecate

1. Get approval. Set the status `deprecated` and the date.
2. Remove the ADR from the canvas section "Core Decisions" or mark it as deprecated.

## amend

1. Write the addition. Ask: does it alter the context, the options, the decision or the consequences?
2. If yes, stop. Tell the user that a supersede is necessary.
3. If no, show the addition and get approval.
4. Add the entry to `## Amendments` with the `Approved by:` line. Set the status `amended` and the date.

## supersede

1. Create a new ADR (see "new"). In "More Information", link the old ADR.
2. After the new ADR is accepted, set the old status to `superseded by ADR-NNNN` and the date.
3. Update the canvas section "Core Decisions".

## Last step

Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs` and fix each ADR finding.
