# QA

Test file: `scripts/verify.qa.test.mjs`. Each test runs `node scripts/verify.mjs --hook` as a process with the Stop event on stdin, as Claude Code does. The test name is the scenario name.

| Scenario | Result | Evidence |
|---|---|---|
| Verify only a complete change: Change in progress | passed | "Verify only a complete change: Change in progress", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Verify only a complete change: Complete change | passed | "Verify only a complete change: Complete change", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Verify only a complete change: No open change | passed | "Verify only a complete change: No open change", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Verify only a complete change: Not a sparc project | passed | "Verify only a complete change: Not a sparc project", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Project commands pass: All commands pass | passed | "Project commands pass: All commands pass", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Project commands pass: A command fails | passed | "Project commands pass: A command fails", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Project commands pass: A command runs too long | passed | "Project commands pass: A command runs too long", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed. The test calls `runCommands` with a limit of 0.5 s, because the hook limit is 300 s |
| Project commands pass: Optional verify command | passed | "Project commands pass: Optional verify command", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Project without commands: No commands named | passed | "Project without commands: No commands named", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Project without commands: Second stop without commands | passed | "Project without commands: Second stop without commands", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Spec scenarios have evidence: All scenarios passed | passed | "Spec scenarios have evidence: All scenarios passed", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Spec scenarios have evidence: Scenario without a row | passed | "Spec scenarios have evidence: Scenario without a row", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Spec scenarios have evidence: Failed scenario | passed | "Spec scenarios have evidence: Failed scenario", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Spec scenarios have evidence: Passed without evidence | passed | "Spec scenarios have evidence: Passed without evidence", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Spec scenarios have evidence: Manual scenario | passed | "Spec scenarios have evidence: Manual scenario", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Tasks name their verification: Task without verification | passed | "Tasks name their verification: Task without verification", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Block the stop with a reason: Checks fail | passed | "Block the stop with a reason: Checks fail", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Block the stop with a reason: Checks pass | passed | "Block the stop with a reason: Checks pass", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Limit of blocks: Fourth stop with failed checks | passed | "Limit of blocks: Fourth stop with failed checks", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed. Also the live test in "Manual checks" |
| Limit of blocks: Count starts again | passed | "Limit of blocks: Count starts again", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |
| Document check does not block: Document drift in a complete change | passed | "Document check does not block: Document drift in a complete change", `node --test 'scripts/*.test.mjs'`, 118 passed, 0 failed |

## Manual checks

### Live test in Claude Code

- Reason: the spec scenarios use the hook output. Only a real session shows how Claude Code reacts to it.
- Steps: make a sparc project from the template with one complete change and a `Test` command that exits with 1. Run `claude -p "Reply only with the word done. Do not use tools." --plugin-dir <sparc> --output-format stream-json --include-hook-events` (Claude Code 2.1.x, model Haiku).
- Expected result: the hook blocks 3 times with the failed command. Then it lets the agent stop, and the agent gets the request to write an open point one time.
- Result of the first run: failed. After the release, the hook gave `additionalContext` at each stop. The agent replied each time: 16 turns. Fix `99efe11`: the hook releases one time and then gives no output. The QA test "Limit of blocks: Fourth stop with failed checks" now also checks the fifth and sixth stop.
- Result after the fix: passed. 3 blocks with the reason "Change \"add-export\" is complete, but its verification failed", then one release, then the session stopped (12 turns, state count 4).
- Note: Claude Code sets `CLAUDE_PLUGIN_DATA` for plugin hooks (`~/.claude/plugins/data/sparc-inline/` for `--plugin-dir`). The block count stays there between sessions until the checks pass.

## Code review

Reviewed: `4875430..3431b40`

| Finding | Fix |
|---|---|
| A command that a signal stopped gave the message "exited with null". | `53cff48` |
| The agent can change the commands table in `AGENTS.md` and so skip a command. Code cannot prevent this. | Risk in the canvas, `86cab22` |
| Found by the live test in QA: after the release, each stop gave `additionalContext`, so the agent did not stop. | `99efe11` |
