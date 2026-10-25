# Proposal

## Why

The change replace-agents-with-roles replaced the agent types with role files. It also forbids subagents and worktrees in the skills. Because of this ban, sparc never does work in parallel, also when the work has independent parts. The roles stay rules, but a ban on subagents is not necessary.

Backlog item: "Do not forbid subagents (change: allow-subagents)" in [docs/backlog.md](../../../docs/backlog.md).

## What Changes

- The team-roles spec no longer forbids subagents and worktrees. It also does not tell the agent to use them. The agent decides where a subagent helps, for example for independent task groups.
- `/sparc:apply` no longer tells the agent to do the task groups "one after the other, in the current session".
- The README no longer says "without subagents".
- ADR-0009 gets an amendment: the roles stay rule files, and subagents are permitted but not required.

Out of scope:

- New skill arguments or rules that tell when to use subagents (for example `parallel`).
- Marks for independent task groups in `tasks.md`.
- Agent types. The plugin still defines none.
- The optional fresh-context check. It stays as it is.

## Capabilities

### New Capabilities

### Modified Capabilities

- `team-roles`: the requirement "Skills follow the roles in the current session" no longer forbids subagents and worktrees, and does not promote them.

## Impact

- `skills/apply/SKILL.md`, `README.md`, `docs/adr/0009-use-roles-as-rules-instead-of-subagents.md`, `scripts/team-roles.test.mjs`.
- No change for projects. Not breaking.
