# Proposal

## Why

A rule in `AGENTS.md` is a request. The agent can ignore it and report "done" too early. Today the only hook runs `scripts/check.mjs --hook`. It checks the documents only and does not block ([ADR-0005](../../../docs/adr/0005-hook-warns-and-does-not-block.md)). Nothing makes sure that the lint and test commands of the project pass, or that each spec scenario has evidence, before a change counts as done.

The request comes from feedback on the sparc posts. One reader asked for an automatic gate. A second reader proposed a Stop hook with exit code 2, so that the agent continues to work. The [three layers article](https://vensas.de/en/blog/karpathy-three-layers) (spec, verifier, environment) tells the principle: success must be verified, not stated.

Backlog item: "Verifier hook" in [docs/backlog.md](../../../docs/backlog.md).

## What Changes

- A new Stop hook runs the verifier when a change is complete. A change is complete when all its tasks are checked.
- The verifier runs the lint, test and verify commands that the project names in `AGENTS.md`. It runs the commands itself. It does not read the report of the agent.
- The verifier checks, without an LLM, that each spec scenario of the change has a row in `qa.md` with evidence, and that each task names its verification.
- If a check fails, the hook blocks the stop and tells the agent the failed check. The agent continues to work.
- The hook blocks a limited number of times. After the limit, it stops to block and tells the agent to write an open point.
- If the project names no commands, the verifier does not block for commands. It warns one time.
- The document check does not change. It warns and does not block.
- The `AGENTS.md` template gets a commands table with the names `Lint`, `Test` and `Verify`. The tasks rule tells each task to name its verification with `Verify:`.

Out of scope:

- A linter, an AST check or other stack-specific checks. sparc runs only the commands of the project.
- Code review in a fresh context. It has its own backlog item. Together with this hook it makes the verifier layer: the hook is deterministic, the review is independent.
- The handling of superseded ADRs. It has its own backlog item.
- A check that the implementation meets the intent of the user. The verifier proves only what the spec names.

## Capabilities

### New Capabilities

- `change-verification`: when and how sparc verifies a complete change, which checks block the stop of the agent, and the limit of the blocks.

### Modified Capabilities

## Impact

- New `scripts/verify.mjs` with tests. `hooks/hooks.json` gets a second Stop hook.
- `templates/project/AGENTS.md`, `templates/project/openspec/config.yaml` (tasks rule), `AGENTS.md` of sparc (command names).
- Not breaking. A project without the named commands gets one warning and no block for commands. A project gets the new template text through `/sparc:update`.
