---
status: accepted
date: 2026-11-16
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Use roles as rules with a fresh-context code review

## Context and Problem Statement

[ADR-0009](0009-use-roles-as-rules-instead-of-subagents.md) decided that roles are rule files that the skills follow in the current session. Its amendment permits subagents but does not require them. A bad consequence of ADR-0009 is that there is no independent check by default. The code review runs in the session that wrote the code, so the reviewer has the assumptions of the author. How does sparc get an independent review and keep the roles simple?

## Decision Drivers

- An independent review finds issues that the author does not see.
- Simplicity: few handoffs, no agent types.
- The verifier ([ADR-0014](0014-block-the-stop-of-a-complete-change-until-its-verification-passes.md)) gives a deterministic check. The review gives the independent check.

## Considered Options

- Roles as rule files, and the code review in a fresh-context subagent by default
- Keep ADR-0009: the code review in the current session, a fresh context only on request
- Agent types for the roles again

## Decision Outcome

Chosen option: "Roles as rule files, and the code review in a fresh-context subagent by default", because it gives an independent review with one handoff only. The user asked for this default.

Roles stay rule files, and the plugin defines no agent types. By default, the roles run in the current session. The skills and rules do not forbid subagents or worktrees. They tell the agent to use a subagent only for the code review and for the optional fresh-context check. The code review subagent is a general-purpose subagent. It gets the change id, the commit range, the role file and the change documents, but not the conversation. It only reports findings. The main session fixes them. The argument `inline-review` and a failed subagent start make the review run in the current session.

### Consequences

- Good, because each change gets an independent review by default.
- Good, because the reviewer does not fix its own findings. The fixes stay in the session that knows the code.
- Good, because the role files and the absence of agent types stay as ADR-0009 decided.
- Bad, because each apply starts one more subagent. This costs tokens and time.
- Bad, because the fix commits get no second independent review. Tests, QA and the verifier check them.

### Confirmation

`scripts/team-roles.test.mjs` tests that the plugin has no `agents/` folder. It also tests that `/sparc:apply` tells the agent to start a subagent only for the code review and the fresh-context check. `## Code review` in `qa.md` gives the context of the review.

## Pros and Cons of the Options

### Roles as rule files, and the code review in a fresh-context subagent by default

- Good, because the review is independent.
- Bad, because of the cost of one subagent for each change.

### Keep ADR-0009

- Good, because there is no extra cost.
- Bad, because there is no independent check by default.

### Agent types for the roles again

- Bad, because ADR-0009 showed that agent types make each change slower and stop more often.

## More Information

Supersedes [ADR-0009](0009-use-roles-as-rules-instead-of-subagents.md). Change: `fresh-context-code-review`.

## Amendments

<!-- Add approved additions here after the decision. See the sparc ADR rule. -->
