---
name: sync
description: Bring the sparc documents (README, AGENTS.md, backlog, C4 diagrams, canvas, ADRs) in sync with the code, the specs and the changes. Use after each step, or when the sparc check reports document drift.
argument-hint: "[change-id]"
---

# sparc sync

Bring the documents in sync. Scope: $ARGUMENTS (if empty: the whole project).

The document set, the owners and the triggers are in ${CLAUDE_PLUGIN_ROOT}/rules/docs.md. Read it first.

1. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs`. Keep the list of findings.
2. Find what changed: run `git status --porcelain` and `git diff --stat`. For a change id, read its proposal, design and tasks.
3. For each trigger in the sync table that applies, find the document that must change.
4. Give each document to its owner agent: `sparc:product-owner` for the backlog, `sparc:architect` for README, AGENTS.md, C4, canvas and ADRs. Give the agent the findings and the changes. Tell it to write only facts with evidence.
5. Run the check again. Repeat until there is no finding, or until each remaining finding has a reason.
6. Report each document that changed, in one line for each.

Rules:

- Do not copy a fact into a second document. Link to its home.
- Do not change the body of a locked ADR. Use the sparc adr skill.
- If the drift comes from work that is not complete, do not change the documents. Report it.
