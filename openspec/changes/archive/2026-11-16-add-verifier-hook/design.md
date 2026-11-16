# Design

## Context

See proposal.md for the reason. `hooks/hooks.json` runs `scripts/check.mjs --hook` on `Stop` and `SubagentStop`. In hook mode, `check.mjs` returns at once when `stop_hook_active` is true, and it warns one time for the same findings through a digest file in `CLAUDE_PLUGIN_DATA` (or the temp folder). `check.mjs` has the helpers `read`, `section` and `listChanges`. Only `isSparcProject` and some others are exported.

The QA engineer writes `qa.md` as a table `| Scenario | Result | Evidence |`. The scenario cell is `<requirement>: <scenario>`, the result is `passed`, `failed` or `manual`. The tasks of the sparc changes name their verification with `Verify:`, but the tasks rule in `openspec/config.yaml` does not name this word. The `AGENTS.md` template has no commands table, only a `TODO(sparc)` line.

## Goals / Non-Goals

**Goals:**
- One new script, without dependencies, with unit tests through temporary folders, as the tests of `check.mjs`.
- The document check does not change.

**Non-Goals:**
- A parser for the full Markdown of `AGENTS.md`. The verifier reads only the commands table.
- Checks of the content of the evidence. The verifier checks that evidence exists, not that it is true.

## Decisions

- **A separate script `scripts/verify.mjs`.** It imports the helpers from `check.mjs`. `check.mjs` exports `read`, `section` and `listChanges` for it. Alternative: a `--verify` mode in `check.mjs`. Rejected, because `check.mjs` has one job (document drift) and its hook never blocks. Two scripts keep the two behaviors apart. See [ADR-0014](../../../docs/adr/0014-block-the-stop-of-a-complete-change-until-its-verification-passes.md).
- **Stop only, not SubagentStop.** The main session owns the completion of a change. A subagent does one part, for example a fresh-context QA. A block in the subagent would make the subagent fix work that is not its job.
- **Complete change.** An open change (a folder in `openspec/changes/` that is not `archive`) whose `tasks.md` has one or more `- [ ]`/`- [x]` lines and no unchecked line. The checkbox parse follows the OpenSpec rule: only a box with `x` (any case, any spaces) is checked. Alternative: a marker file that `/sparc:apply` writes at the end. Rejected, because the agent can forget to write it, and the hook must not depend on the agent.
- **Commands table.** The verifier reads the section `## Commands` of `AGENTS.md`. It takes each table row whose first cell is `Lint`, `Test` or `Verify` (case does not matter). The command is the first code span in the second cell. It runs the commands in the order Lint, Test, Verify, through the shell, in the project folder. Alternative: a `verify:` block in the `sparc:` section of `openspec/config.yaml`. Rejected, because the commands then have two homes (DRY).
- **Time limit.** Each command gets 300 seconds. A command that runs longer is stopped and counts as failed. The hook timeout in `hooks.json` is 960 seconds, so the script can report a time-out of all three commands itself.
- **Block format.** The hook writes JSON `{"decision": "block", "reason": "..."}` to stdout and exits with 0. This has the same effect as exit code 2 with the reason on stderr. The JSON form also gives a `systemMessage` to the user. The reason lists each failed check: for a command, the command, the exit code and the last 20 lines of the output. For a scenario or a task, its name.
- **Limit of blocks.** A state file for each project and change in `CLAUDE_PLUGIN_DATA` (or the temp folder) keeps the count of blocks in a row. The verifier increments it for each block and deletes it when all checks pass. At the fourth stop with failed checks it does not block. It gives `additionalContext` that tells the agent to write each failed check as an open point in the canvas, and a `systemMessage` for the user. Alternative: `stop_hook_active`. Rejected, because it is true for each stop after a block, so it allows only one block.
- **Missing commands.** If the table has no `Lint`, `Test` or `Verify` row, the verifier checks only `qa.md` and `tasks.md`. It warns one time for each project, with the same digest method as `check.mjs`.
- **Manual scenarios.** A row with `manual` does not block. The agent cannot do a manual check of the user. The `systemMessage` names these scenarios.
- **Spec scenarios.** The verifier reads each `specs/**/spec.md` of the change. For each `#### Scenario:` it takes the last `### Requirement:` before it. The expected row name is `<requirement>: <scenario>`. Only rows under `## ADDED Requirements` and `## MODIFIED Requirements` count. Removed requirements have no scenarios to prove.
- **Templates.** The `AGENTS.md` template gets a commands table with the rows `Lint`, `Test` and `Verify` and a `TODO(sparc)` placeholder for each command. The tasks rule in the config template tells: "Name the verification of each task with `Verify:`." The sparc `AGENTS.md` renames "Run the tests" to `Test` and "Lint the CI workflows" to `Lint`.
- **Migration.** The changelog entry tells existing projects to name their commands `Lint`, `Test` and `Verify`. `/sparc:update` replaces the tasks rule because it is between the sparc markers. The commands table is outside the markers, so the user adds it.

ADRs:
- Adds [docs/adr/0014-block-the-stop-of-a-complete-change-until-its-verification-passes.md](../../../docs/adr/0014-block-the-stop-of-a-complete-change-until-its-verification-passes.md).
- ADR-0005 does not change. Its decision applies to the document check, and the document check does not change.

C4 impact: a new container "Verifier" (Node.js script) in the sparc boundary. New relations: Hooks → Verifier "Runs", Verifier → Project repository "Reads the change and runs the commands of". The container "Hooks" gets the description "Runs the check and the verifier when an agent stops".

Test tools:
- Unit tests: `node --test 'scripts/*.test.mjs'` (node:test). The tests of `verify.mjs` make temporary sparc projects with commands such as `node -e "process.exit(1)"`. They call the hook mode with a JSON event on stdin and read the JSON output.
- Live test: `claude --plugin-dir .` in a temporary sparc project with a complete change and a failing `Test` command. The QA report records it as a manual check.

## Risks / Trade-offs

- [A slow test suite makes each stop of a complete change slow] → The verifier runs only for a complete change. The time limit stops a command after 300 seconds.
- [The agent checks all tasks before QA, then stops] → This is the wanted behavior: the block tells it which scenarios have no evidence.
- [A project uses other names in the commands table] → The warning tells the names. The README tells them too.
- [Two Stop hooks run at the same time] → The document check returns at once when `stop_hook_active` is true. So after a block, only the verifier runs again.
- [A command changes files (for example a formatter)] → The verifier runs what the project names. The project decides what `Lint` does.

## Migration Plan

The next release (minor) adds the hook. A project without the named commands gets one warning and no block for commands. Rollback: remove the `verify.mjs` entry from `hooks/hooks.json`.
