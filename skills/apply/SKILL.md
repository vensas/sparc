---
name: apply
description: Implement an approved OpenSpec change in the current session. Follow the software engineer role for each task group and for the code review, the QA engineer role for QA, and the product owner role for acceptance.
argument-hint: "<change-id> [fresh-context]"
disable-model-invocation: true
---

# sparc apply

Implement the change: $ARGUMENTS

The roles are in `${CLAUDE_PLUGIN_ROOT}/rules/roles/`. Read each role file when its step starts, and obey it.

## 1. Check the start conditions

1. Run `openspec status --change <id>` and `openspec validate <id>`. All planning artifacts must be complete and valid.
2. Make sure the user approved the change (see ${CLAUDE_PLUGIN_ROOT}/rules/approval.md). If you cannot find the approval, ask for it. Do not continue without it.
3. Run `openspec instructions apply --change <id>` and read `tasks.md`.

## 2. Task groups

Follow the software engineer role (`${CLAUDE_PLUGIN_ROOT}/rules/roles/software-engineer.md`). Do the open task groups (`## N.` headings with unchecked tasks) one after the other, in the current session.

For each task group:

1. Do each task as the role tells you: test first, smallest code, refactor, one Conventional Commit for each task (see ${CLAUDE_PLUGIN_ROOT}/rules/release.md).
2. Run all tests of the project. If a test fails, fix it before the next group.
3. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs`. If a document finding relates to this group, use the sparc sync skill.

## 3. Code review

When all tasks are checked, do the code review of the software engineer role. Write the result into `## Code review` of `openspec/changes/<id>/qa.md`.

## 4. QA

Follow the QA engineer role (`${CLAUDE_PLUGIN_ROOT}/rules/roles/qa-engineer.md`).

1. If the role finds no suitable test tool, stop. Tell the user that the tool needs an approved project ADR (see ${CLAUDE_PLUGIN_ROOT}/rules/adr.md).
2. Make sure that the QA commits change only test files and `openspec/changes/<id>/qa.md`.
3. For each scenario with the result `failed`, fix the issue as the software engineer role, then do QA again.

## 5. Acceptance

Follow the product owner role (`${CLAUDE_PLUGIN_ROOT}/rules/roles/product-owner.md`). Accept the change from `qa.md` and do only the manual checks. Accept the change only when no scenario has the result `failed` and the code review has no open finding.

## 6. Optional fresh-context check

Do this section only if the user asks for a fresh-context check (for example with the argument `fresh-context`). Do it instead of sections 4 and 5.

1. Start one general-purpose subagent. Give it the change id and the paths of the role files of the QA engineer and the product owner.
2. Tell it to do QA and acceptance as these roles tell, and to report the result for each scenario with evidence.
3. Read its report. Write the results into `qa.md` if the subagent could not.

## 7. Report

Report the completed tasks, the test results, the code review, the QA result and the open points. Tell the user the next step: `/sparc:archive <id>`.
