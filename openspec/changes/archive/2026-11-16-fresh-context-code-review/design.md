# Design

## Context

See proposal.md - Why. The code review is in `skills/apply/SKILL.md` section 3 and in `rules/roles/software-engineer.md` section "Code review". The role gets the diff with `git diff <default-branch>...HEAD`. In the workflow `trunk`, this diff is empty, because the change commits are on the default branch. The review of add-verifier-hook used a commit range instead (`4875430..3431b40`). `scripts/team-roles.test.mjs` tests that apply has no word "subagent" or "worktree" outside the fresh-context section.

## Goals / Non-Goals

**Goals:**

- An independent code review by default, with the smallest change to apply and the role.

**Non-Goals:**

- A new agent type, a review tool or a review skill.

## Decisions

### One general-purpose subagent that only reviews

- Options: (a) the subagent reviews and the main session fixes; (b) the subagent reviews and fixes; (c) a subagent for each checklist item.
- Choice: (a). The reviewer stays independent of the fixes, and the main session knows the code and the tests. Option (b) mixes author and reviewer again. Option (c) costs more and gives no proven gain.
- Input of the subagent: the change id, the commit range, the path `${CLAUDE_PLUGIN_ROOT}/rules/roles/software-engineer.md`, and the paths of `proposal.md`, `design.md`, `tasks.md` and the spec deltas. The prompt tells it to do the section "Code review" of the role, steps 1 and 2 only, and to report each finding with file, line and reason. It tells it not to change files and not to commit.
- The main session does steps 3 and 4 of the role: it fixes and writes `## Code review`.

### Commit range for both workflows

- In the workflow `pull-request`: `<default-branch>...HEAD`, as today.
- In the workflow `trunk`: from the commit `docs(openspec): Propose <id>` (excluded) to `HEAD`. Find it with `git log --format=%h --grep "Propose <id>" -1`.
- The role file tells both. The record in `qa.md` gets a line `Context: fresh` or `Context: current session (<reason>)` below `Reviewed:`.

### Name of the opt-out

- Options: `inline-review`, `same-context`, `no-fresh-review`.
- Choice: `inline-review`. It names the step that it changes. `same-context` reads as the opposite of the argument `fresh-context`, but `fresh-context` covers QA and acceptance, not the review. This can confuse.

### Supersede ADR-0009

- Question of `rules/adr.md`: does this change alter the context, the options, the decision or its consequences? Yes. The consequence "there is no independent check by default" is not true after this change, and the decision now tells the agent to use a subagent for the review.
- Choice: new [ADR-0015](../../../docs/adr/0015-use-roles-as-rules-with-a-fresh-context-code-review.md) with the status `proposed`. It keeps the decision of ADR-0009 and its amendment, and adds the review subagent. At archive, [ADR-0009](../../../docs/adr/0009-use-roles-as-rules-instead-of-subagents.md) gets the status `superseded by ADR-0015`.

### No check by the verifier

- The verifier checks only facts that code can prove. The context of the review is a statement of the agent. The product owner acceptance does not change: it needs `## Code review` without open findings.

### Test

Integration test tool: `node --test 'scripts/*.test.mjs'` (see AGENTS.md). Change `scripts/team-roles.test.mjs`:

- "Apply without subagents": outside the fresh-context section, the word "subagent" occurs only in the code review section, and "worktree" does not occur.
- New tests read `skills/apply/SKILL.md` and `rules/roles/software-engineer.md` for each new scenario: subagent input, no file changes by the reviewer, `Context:` line, commit range in `trunk`, argument `inline-review`, fallback.

The behavior of a live subagent is not testable with these text tests. QA proves "Review in a fresh context by default" and "Reviewer does not change files" with the apply run of this change: the review of this change runs in a fresh context.

ADRs: [ADR-0015](../../../docs/adr/0015-use-roles-as-rules-with-a-fresh-context-code-review.md) is new and supersedes [ADR-0009](../../../docs/adr/0009-use-roles-as-rules-instead-of-subagents.md).

No C4 impact. The subagent runs in Claude Code. No container or relation changes.

## Risks / Trade-offs

- [The extra subagent costs tokens and time for each change] → The opt-out `inline-review`. The cost is not measured. Open point in the canvas.
- [In auto mode, subagents got "no verdict" for Write] → The review subagent does not write. The fallback covers a failed start.
- [The subagent misses context that only the conversation has] → It reads the proposal, the design and the specs. A finding that is wrong for a reason in the conversation goes into `qa.md` with that reason.

## Migration Plan

Not breaking. Projects get the new apply skill and role with the plugin update. No project file changes.
