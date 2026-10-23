## Why

sparc has a goal of simplicity, but its subagents made the work slower and less reliable. In change `add-qa-engineer`, one feature needed 7 agent runs. Each agent read the same files again, and the main session relayed each question. Each agent stopped on its own when a tool failed. Claude Code loads agent types only when a session starts, so a new agent was not usable in the session that made it. Parallel engineers made worktrees that gave false drift warnings, and saved little time. Also, no step reviews the code before QA. Backlog item: "Roles as rules instead of subagents, with code review by the software engineer".

## What Changes

- **BREAKING**: Each agent becomes a role file in `rules/roles/`: product owner, architect, UX designer, software engineer and QA engineer. The folder `agents/` is removed. The plugin has no agent types (`sparc:*`) any more.
- The skills follow the role files in the current session. `/sparc:apply` does the task groups one after the other, without subagents and without worktrees.
- Code review: after all task groups and before QA, the software engineer role reviews the diff of the change with a checklist. It fixes each finding with a commit, or moves it to the backlog after the user agrees. It records the result in `qa.md`.
- The product owner accepts a change only when `qa.md` has a code review without open findings.
- Optional fresh-context check: if the user asks for it, `/sparc:apply` runs QA and acceptance in a general-purpose subagent that reads the role files.
- The `qa-engineering` spec says "QA engineer role" instead of "QA engineer agent".
- A new ADR records the decision.

Out of scope:

- New content for the roles, except the code review.
- The `SubagentStop` hook. It stays, because it warns for each subagent, also for the optional fresh-context check.

## Capabilities

### New Capabilities

- `team-roles`: the role files, how the skills follow them, the code review by the software engineer and the optional fresh-context check.

### Modified Capabilities

- `qa-engineering`: the requirement "QA engineer agent" is replaced by "QA engineer role".

## Impact

- New: `rules/roles/*.md`. Removed: `agents/`.
- Skills: `init`, `propose`, `apply`, `archive`, `sync`, `adr`.
- `scripts/qa-engineer.test.mjs` (the agent file test).
- Documents: README, AGENTS.md, `.claude-plugin/plugin.json`, C4 diagrams, canvas, CHANGELOG.
- Users who start `sparc:*` agents by name must use the skills instead.
