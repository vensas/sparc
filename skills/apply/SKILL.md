---
name: apply
description: Implement an approved OpenSpec change with one or more sparc software engineers, keep the documents in sync after each task group, and let the product owner check acceptance.
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

## 4. Acceptance

When all tasks are checked, use the `sparc:product-owner` agent. Tell it to check each spec scenario of the change and to report passed or failed with evidence. For each failed scenario, give the issue to an engineer and repeat.

## 5. Report

Report the completed tasks, the test results, the suggested refactoring and the open points. Tell the user the next step: `/sparc:archive <id>`.
