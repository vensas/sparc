# Proposal

## Why

Today the code review runs in the session that wrote the code (`skills/apply/SKILL.md`, section 3). The reviewer has the same context and the same assumptions as the author. Thus the review finds fewer issues. [ADR-0009](../../../docs/adr/0009-use-roles-as-rules-instead-of-subagents.md) names this as a bad consequence: "there is no independent check by default". The verifier hook ([ADR-0014](../../../docs/adr/0014-block-the-stop-of-a-complete-change-until-its-verification-passes.md)) gives the deterministic check. An independent review completes the verifier layer.

Backlog item: "Code review runs in a fresh context by default" in [docs/backlog.md](../../../docs/backlog.md).

## What Changes

- By default, `/sparc:apply` does the code review in one general-purpose subagent. The subagent gets only the change id, the commit range of the change, the path of the software engineer role and the paths of the change documents. It does not get the conversation.
- The subagent only reviews. It reports each finding with the file, the line and the reason. It does not change files.
- The main session fixes each finding as the software engineer with a commit, or moves it to the backlog after the user agrees. This does not change.
- `## Code review` in `qa.md` tells where the review ran: in a fresh context or in the current session.
- Opt-out: with the argument `inline-review`, `/sparc:apply` does the code review in the current session.
- Fallback: if the agent cannot start a subagent, it does the review in the current session and writes the reason in `## Code review`.
- The software engineer role tells how to get the commit range in both workflows. In the workflow `trunk`, `git diff <default-branch>...HEAD` is empty, because the commits are on the default branch.
- The optional fresh-context check (argument `fresh-context`) does not change. It covers QA and acceptance.

Out of scope:

- A second fresh-context review of the fix commits. The review runs one time. The tests, QA and the verifier check the fixes.
- A check by the verifier or by the product owner that the review ran in a fresh context. The note in `qa.md` is a statement of the agent. Code cannot prove it.
- A fresh context for other roles.
- The handling of superseded ADRs. It has its own backlog item.

## Capabilities

### New Capabilities

### Modified Capabilities

- `team-roles`: the code review runs in a fresh-context subagent by default, with an opt-out and a fallback. The exception for subagents covers the code review.

## Impact

- `skills/apply/SKILL.md` (section 3, argument hint), `rules/roles/software-engineer.md` (code review), `scripts/team-roles.test.mjs`, README.
- [ADR-0009](../../../docs/adr/0009-use-roles-as-rules-instead-of-subagents.md) is superseded by a new ADR.
- Not breaking. Each apply starts one more subagent. This costs more tokens and time.
