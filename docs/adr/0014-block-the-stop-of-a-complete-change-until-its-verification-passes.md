---
status: proposed
date: 2026-11-16
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Block the stop of a complete change until its verification passes

## Context and Problem Statement

An agent can report "done" before the lint and test commands pass, or before each spec scenario has evidence. A rule in `AGENTS.md` cannot prevent this, because the agent can ignore it. The only hook warns and does not block (ADR-0005), because documents are often out of sync in the middle of a task. How does sparc make sure that a complete change is verified before the agent stops?

## Decision Drivers

- The verification uses real signals: commands that the hook runs, and the files of the change. It does not use the report of the agent.
- The hook does not block in the middle of a task.
- The hook does not trap the agent in an endless loop.
- sparc stays stack-agnostic and does not add a linter.

## Considered Options

- A second Stop hook that blocks only for a complete change, with a limit of blocks
- Block in the document check hook (supersede ADR-0005)
- Keep only rules: the roles tell the agent to run the commands

## Decision Outcome

Chosen option: "A second Stop hook that blocks only for a complete change, with a limit of blocks". It gives a hard gate at the end of a change. The document check stays as it is.

A change is complete when all tasks in its `tasks.md` are checked. The hook runs the `Lint`, `Test` and `Verify` commands from the commands table in `AGENTS.md`. It checks that each spec scenario has evidence in `qa.md` and that each task names its verification. It blocks not more than 3 times in a row for the same change.

This decision does not change ADR-0005. The document check still warns and does not block.

### Consequences

- Good, because a complete change cannot end with a failed test or a scenario without evidence, unless the limit is reached.
- Good, because each block gives the agent the failed check, so that it can continue to work.
- Bad, because the verifier proves only what the spec and the tests name. It does not prove that the change meets the intent of the user. An independent review stays necessary.
- Bad, because the hook runs the project commands at each stop of a complete change. A slow test suite makes each stop slow.
- Bad, because a project must name its commands in a fixed format (`Lint`, `Test`, `Verify`). Without them, the verifier checks only the files of the change.
- Bad, because after 3 blocks the agent can stop with failed checks. The failed checks then become open points, not a block.

### Confirmation

The tests of `scripts/verify.mjs` cover each scenario of the spec `change-verification`. A live test in Claude Code shows the block and the limit.

## Pros and Cons of the Options

### A second Stop hook that blocks only for a complete change, with a limit of blocks

- Good, because the gate is hard and the document check does not change.
- Bad, because sparc has two Stop hooks.

### Block in the document check hook (supersede ADR-0005)

- Good, because sparc has one hook.
- Bad, because document drift in the middle of a task would block the agent. ADR-0005 rejected this.

### Keep only rules: the roles tell the agent to run the commands

- Good, because nothing changes.
- Bad, because the agent can ignore a rule. This is the problem.

## More Information

- Feedback on the sparc posts asked for a hard gate and proposed a Stop hook that blocks.
- [The three layers of working with AI](https://vensas.de/en/blog/karpathy-three-layers): spec, verifier and environment.
- The change [add-verifier-hook](../../openspec/changes/add-verifier-hook/proposal.md).

## Amendments

<!-- Add approved additions here after the decision. See the sparc ADR rule. -->
