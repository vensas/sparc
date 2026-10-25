# Design

## Context

See proposal.md - Why. The ban is in three places: the team-roles spec, `skills/apply/SKILL.md` step 2 ("one after the other, in the current session") and the README ("without subagents"). `scripts/team-roles.test.mjs` tests that apply has no word "subagent" or "worktree" outside the fresh-context check. ADR-0009 decides "Roles as rule files that the skills follow in the current session".

## Goals / Non-Goals

**Goals:**

- Remove each text that forbids subagents, worktrees or sequential-only work.
- Add no text that promotes them.

**Non-Goals:**

- Guidance on when parallel work makes sense. The agent decides.

## Decisions

### Neutral text instead of a rule for subagents

- Options: (a) remove the ban and say nothing more; (b) add a rule that tells when to use subagents; (c) add a `parallel` argument to apply.
- Choice: (a). The user asked: "dont promote it, dont forbid it". Options (b) and (c) promote subagents and add text.
- In apply step 2, replace "one after the other, in the current session" with a neutral fact: a group can depend on the groups before it. This keeps the dependency order without a ban.

### Amend ADR-0009, do not supersede it

- Question of `rules/adr.md`: does this change alter the context, the options, the decision or its consequences?
- The decision stays: roles are rule files, the plugin has no agent types, and by default the roles run in the current session. The consequences stay true for the default run. The permission to use subagents is an addition.
- Choice: amend [ADR-0009](../../../docs/adr/0009-use-roles-as-rules-instead-of-subagents.md). Running `/sparc:apply allow-subagents` approves the amendment (see `rules/approval.md`). Amendment text:

  > Roles stay rule files, and the plugin defines no agent types. The skills and rules do not forbid subagents or worktrees, and do not tell the agent to use them. The agent can start a subagent where it helps, for example for independent task groups. The optional fresh-context check is unchanged.

### Test

Change the test "Apply without subagents" in `scripts/team-roles.test.mjs` to the two new scenarios:

- "Skills do not forbid subagents": no skill or rule file contains a ban (for example "SHALL NOT start a subagent", "without subagents", "one after the other").
- "Apply without subagents": apply outside the fresh-context section does not tell the agent to start a subagent or a worktree (the current check for the words stays).

Integration test tool: `node --test 'scripts/*.test.mjs'` (see AGENTS.md).

ADRs: [ADR-0009](../../../docs/adr/0009-use-roles-as-rules-instead-of-subagents.md) is amended. No new ADR.

No C4 impact.

## Risks / Trade-offs

- [Parallel subagents edit the same files or commit at the same time on `main` in the workflow `trunk`] → The agent decides. It knows the files of each group from `tasks.md`.
- [In auto mode, subagents got "no verdict" for Write] → Already an open point in the canvas. No change.
