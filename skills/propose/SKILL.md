---
name: propose
description: Turn an idea into an approved OpenSpec change with the sparc team. The product owner writes the proposal and specs, the architect writes the design, ADRs and tasks, the UX designer makes mockups if there is a user interface.
argument-hint: "<idea or change-id>"
disable-model-invocation: true
---

# sparc propose

Make an OpenSpec change for: $ARGUMENTS

This skill makes planning documents only. Do not change project code.

## 1. Prepare

1. Run `openspec list --json` and `openspec list --specs`. Read `docs/backlog.md`.
2. Choose a kebab-case change id that names the work (for example `add-csv-export`). If a backlog item matches, use it.
3. Make the branch `<type>/<id>` from the default branch (for example `feat/add-csv-export`). Obey ${CLAUDE_PLUGIN_ROOT}/rules/release.md.
4. Run `openspec new change <id>`.

## 2. Requirements: `sparc:product-owner`

Give the agent the idea, the change id and the backlog item. Tell it to write `proposal.md` and the spec deltas, and to link the backlog item. Wait for the result. If the agent has questions for the user, ask the user and give the answers back to the agent.

## 3. Mockups: `sparc:ux-designer`

Only if the change has a user interface: give the agent the change id. Tell it to make the mockups in `docs/mockups/<id>/`. Show the user the path of the mockup.

## 4. Design and tasks: `sparc:architect`

Give the agent the change id. Tell it to write `design.md`, the ADRs with the status `proposed`, the C4 updates and `tasks.md`.

Tell the agent to name the integration or end-to-end test tool of the project and its command in `design.md`. If the project has no such tool, tell the agent to write a project ADR for the tool with the status `proposed`. The approval of the change also approves this ADR.

## 5. Validate

1. Run `openspec validate <id>`. If it fails, give the errors to the owner agent of the file and repeat.
2. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs`. Fix the findings that this change caused.
3. Commit the planning documents: `docs(openspec): Propose <id>`.

## 6. Get approval

Show the user a summary: the scope, the out-of-scope items, the ADRs, the C4 impact, the mockups and the number of tasks.
Get approval as ${CLAUDE_PLUGIN_ROOT}/rules/approval.md tells you. Approval of the change also approves its `proposed` ADRs, unless the user rejects one.

After approval, tell the user the next step: `/sparc:apply <id>`. Do not start the implementation.
