---
name: apply
description: Implement an approved OpenSpec change with one or more sparc software engineers, keep the documents in sync after each task group, prove the spec scenarios with the QA engineer, and let the product owner check acceptance.
argument-hint: "<change-id>"
disable-model-invocation: true
---

# sparc apply

Implement the change: $ARGUMENTS

## 1. Check the start conditions

1. Run `openspec status --change <id>` and `openspec validate <id>`. All planning artifacts must be complete and valid.
2. Make sure the user approved the change (see ${CLAUDE_PLUGIN_ROOT}/rules/approval.md). If you cannot find the approval, ask for it. Do not continue without it.
3. Run `openspec instructions apply --change <id>` and read `tasks.md`.

## 2. Plan the work

1. Find the open task groups (`## N.` headings with unchecked tasks).
2. Find groups that are independent: they change different files and do not need the result of each other. The architect marks them in `tasks.md`.
3. Use one `sparc:software-engineer` agent for each independent group. Run independent agents in parallel, each with `isolation: worktree`. Run dependent groups one after the other.
4. Use 4 engineers or fewer at the same time.

## 3. For each task group

1. Give the engineer the change id, the group number and the paths of the proposal, the specs, the design and the mockups.
2. When the engineer reports, read the report. Check that the test command and its result are in it.
3. Make sure that the engineer made one Conventional Commit for each task (see ${CLAUDE_PLUGIN_ROOT}/rules/release.md).
4. Merge the worktree result into the change branch. Run all tests of the project. If a test fails, give the failure back to the engineer.
5. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs`. If a document finding relates to this group, use the sparc sync skill.

## 4. QA

When all tasks are checked, use one `sparc:qa-engineer` agent on the change branch.

1. Give the agent the change id and the paths of the proposal, the specs and the design.
2. If the agent reports a missing test tool, stop. Tell the user that the tool needs an approved project ADR (see ${CLAUDE_PLUGIN_ROOT}/rules/adr.md).
3. Make sure that the QA commits change only test files and `openspec/changes/<id>/qa.md`. If not, give the commits back to the agent.
4. Read `qa.md`. For each scenario with the result `failed`, give the issue to one `sparc:software-engineer`. Then do steps 2 to 4 of section 3 again.
5. If you gave an issue to an engineer, use the QA engineer again.

## 5. Acceptance

Use the `sparc:product-owner` agent. Tell it to accept the change from `openspec/changes/<id>/qa.md` and to do only the manual checks. Accept the change only when no scenario in `qa.md` has the result `failed`. For each failed manual check, give the issue to one engineer and repeat section 4.

## 6. Report

Report the completed tasks, the test results, the suggested refactoring and the open points. Tell the user the next step: `/sparc:archive <id>`.
