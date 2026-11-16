---
name: propose
description: Turn an idea into an OpenSpec change with the sparc team. The product owner writes the proposal and specs, the architect writes the design, ADRs and tasks, the UX designer makes mockups if there is a user interface.
argument-hint: "<idea or change-id>"
disable-model-invocation: true
---

# sparc propose

Make an OpenSpec change for: $ARGUMENTS

This skill makes planning documents only. Do not change project code.

## 1. Prepare

1. Run `openspec list --json` and `openspec list --specs`. Read `docs/backlog.md`.
2. Choose a kebab-case change id that names the work (for example `add-csv-export`). If a backlog item matches, use it.
3. In the workflow `pull-request` only, make the branch `<type>/<id>` from the default branch (for example `feat/add-csv-export`). Obey ${CLAUDE_PLUGIN_ROOT}/rules/release.md.
4. Run `openspec new change <id>`.

## 2. Requirements: product owner role

Follow the product owner role (`${CLAUDE_PLUGIN_ROOT}/rules/roles/product-owner.md`). Write `proposal.md` and the spec deltas, and link the backlog item. Ask the user each open question in one message.

## 3. Mockups: UX designer role

Only if the change has a user interface: follow the UX designer role (`${CLAUDE_PLUGIN_ROOT}/rules/roles/ux-designer.md`). Make the mockups in `docs/mockups/<id>/`. Show the user the path of the mockup.

## 4. Design and tasks: architect role

Follow the architect role (`${CLAUDE_PLUGIN_ROOT}/rules/roles/architect.md`). Write `design.md`, the ADRs with the status `proposed`, the C4 updates and `tasks.md`.

Name the integration or end-to-end test tool of the project and its command in `design.md`. If the project has no such tool, choose a tool in `design.md`. Give its command, the other options and the reason for the choice. The approval of the change also approves the tool. Write an ADR for the tool only if the choice is a major decision (see ${CLAUDE_PLUGIN_ROOT}/rules/adr.md).

## 5. Validate

1. Run `openspec validate <id>`. If it fails, fix the errors as the role that owns the file, and repeat.
2. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs`. Fix the findings that this change caused.
3. Commit the planning documents: `docs(openspec): Propose <id>`.

## 6. Summary and next step

Show the user a summary: the scope, the out-of-scope items, the ADRs, the C4 impact, the mockups and the number of tasks.
Tell the user the next step: `/sparc:apply <id>`. When the user runs it, this approves the change, its `proposed` ADRs and its mockups (see ${CLAUDE_PLUGIN_ROOT}/rules/approval.md). Do not ask for an approval. Do not start the implementation.
