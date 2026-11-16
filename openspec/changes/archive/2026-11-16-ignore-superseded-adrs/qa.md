# QA

Test file: `scripts/check.test.mjs`. The check tests make a temporary project from the template. The rule test reads `templates/project/AGENTS.md`, `rules/adr.md` and `rules/roles/architect.md`. The test name is the scenario name.

| Scenario | Result | Evidence |
|---|---|---|
| Agents follow only current ADRs: Rule in a project | passed | "Agents follow only current ADRs: Rule in a project", `node --test 'scripts/*.test.mjs'`, 132 passed, 0 failed |
| Canvas lists each ADR with its status: ADR is not in the canvas | passed | "Canvas lists each ADR with its status: ADR is not in the canvas", `node --test 'scripts/*.test.mjs'`, 132 passed, 0 failed |
| Canvas lists each ADR with its status: Superseded ADR without its status in the canvas | passed | "Canvas lists each ADR with its status: Superseded ADR without its status in the canvas", `node --test 'scripts/*.test.mjs'`, 132 passed, 0 failed |
| Canvas lists each ADR with its status: Canvas names the status | passed | "Canvas lists each ADR with its status: Canvas names the status", `node --test 'scripts/*.test.mjs'`, 132 passed, 0 failed |
| Open changes do not use old ADRs: Open change lists a superseded ADR | passed | "Open changes do not use old ADRs: Open change lists a superseded ADR", `node --test 'scripts/*.test.mjs'`, 132 passed, 0 failed |
| Open changes do not use old ADRs: Open change supersedes a current ADR | passed | "Open changes do not use old ADRs: Open change supersedes a current ADR", `node --test 'scripts/*.test.mjs'`, 132 passed, 0 failed |
| Open changes do not use old ADRs: Archived change links to a superseded ADR | passed | "Open changes do not use old ADRs: Archived change links to a superseded ADR", `node --test 'scripts/*.test.mjs'`, 132 passed, 0 failed |
| Agents follow only current ADRs: Agent finds a superseded ADR | manual | See "Manual checks" |

## Manual checks

### Agents follow only current ADRs: Agent finds a superseded ADR

- Reason: only a live agent shows if it follows the rule. A text test cannot show it.
- Steps: in sparc, run `claude -p "Do the sparc roles run the code review in the current session? Answer with the ADR number that decides it, and one sentence. Do not change files." --plugin-dir . --model claude-haiku-5-5` with read tools only.
- Expected result: the answer names ADR-0015, not ADR-0009.
- Result: passed. Answer: "ADR-0015 decides it: the code review runs in a fresh-context subagent by default, not in the current session, and it supersedes ADR-0009, which kept the review in the current session." This is one run with one model. It does not show which part (the rule in `AGENTS.md` or the canvas index) caused the result.
- Note: the first run was not valid. All tasks were checked and `qa.md` did not exist. Thus the verifier blocked the stop of the test session, and the agent tried to write `qa.md`. The read-only tools stopped it, and no file changed. This is the expected behavior of the verifier. A live test in a project with a complete change must start after `qa.md` exists.

## Code review

Reviewed: `ca40181..987b1b3`
Context: fresh

| Finding | Fix |
|---|---|
| The `AGENTS.md` line copied the rule text, but design.md and task 1.2 tell that it refers to `rules/adr.md`. A link is not possible in a project, because the rule is in the plugin. | `729afbb`: the line refers to the sparc rule. design.md tells why there is no link. |
| The `AGENTS.md` line did not name `proposed` ADRs of the own change. | `729afbb` |
| The check matched the file name of an ADR, but design.md tells "each link". | `729afbb`: the check matches `adr/<file>)`. |

## Acceptance

Accepted by the product owner from this report on 2026-11-16. No scenario failed. The code review has no open finding. The manual live test passed.
