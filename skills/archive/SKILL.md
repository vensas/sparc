---
name: archive
description: Archive a completed OpenSpec change, update the main specs, check the backlog item, accept the ADRs and bring all sparc documents in sync.
argument-hint: "<change-id>"
disable-model-invocation: true
---

# sparc archive

Archive the change: $ARGUMENTS

1. Run `openspec status --change <id>`. All tasks in `tasks.md` must be checked. If not, stop and report the open tasks.
2. Run all tests of the project. If a test fails, stop and report it.
3. Run `openspec archive <id> --yes`. Read the output. Make sure that the main specs changed as the deltas say.
4. In `docs/backlog.md`, check the item `(change: <id>)`.
5. For each ADR of the change with the status `proposed`: if the user approved it, set `accepted` and run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs --lock <file>`. If the user rejected it, set `rejected` and lock it too.
6. Use the sparc sync skill for README key features, the canvas, the C4 diagrams and AGENTS.md.
7. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs`. Report the result. A finding can stay only with a reason that you tell the user.
