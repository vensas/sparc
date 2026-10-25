---
status: amended
date: 2026-10-25
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Use roles as rules instead of subagents

## Context and Problem Statement

sparc defined five agent types: product owner, architect, UX designer, software engineer and QA engineer. In practice, the agents made each change slower and stopped more often. Simplicity is a main goal of sparc. How does sparc keep the roles without the cost of subagents?

## Considered Options

- Roles as rule files that the skills follow in the current session
- Keep the agent types
- No roles, only general rules

## Decision Outcome

Chosen option: "Roles as rule files that the skills follow in the current session", because it keeps the role procedures and removes the handoffs. The user chose this option.

### Consequences

- Good, because there are no agent handoffs, no relayed questions and no worktrees.
- Good, because a change to a role is usable at once. Agent types load only when a session starts.
- Bad, because there is no independent check by default. The optional fresh-context check and the code review reduce this risk.
- Bad, because the context of the main session grows.

### Confirmation

The plugin has no `agents/` folder. The skills name role files in `rules/roles/`. `claude plugin validate .` passes.

## More Information

ADR-0007 stays valid. It decides when QA runs, not who runs it.

## Amendments

### 2026-10-25: Subagents are permitted, not required

Approved by: [@sventropy](https://github.com/sventropy), chat (`/sparc:apply allow-subagents`)

Roles stay rule files, and the plugin defines no agent types. The skills and rules do not forbid subagents or worktrees, and do not tell the agent to use them. The agent can start a subagent where it helps, for example for independent task groups. The optional fresh-context check is unchanged.
