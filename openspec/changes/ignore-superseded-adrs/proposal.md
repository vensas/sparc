# Proposal

## Why

The status of an ADR is only in its front matter. After a supersede, the old ADR stays in `docs/adr/` with its full text, because the body of a decided ADR does not change ([rules/adr.md](../../../rules/adr.md)). For example, [ADR-0009](../../../docs/adr/0009-use-roles-as-rules-instead-of-subagents.md) says that the roles run in the current session, with no review subagent. [ADR-0015](../../../docs/adr/0015-use-roles-as-rules-with-a-fresh-context-code-review.md) superseded it. An agent that finds the text of ADR-0009 with grep does not see the status. The architect role tells the agent to "read the ADRs", but no rule tells it to check the status first. Thus an agent can follow a decision that is not valid now.

Backlog item: "Agents must not follow superseded ADRs as current decisions" in [docs/backlog.md](../../../docs/backlog.md).

## What Changes

- A rule tells the agent which ADRs are current: `accepted` and `amended`. A `proposed` ADR is current only in its own change. The agent reads the status before it uses an ADR. For a superseded ADR, it follows the chain to the current ADR. It does not follow a `deprecated` or `rejected` ADR.
- The rule is in `rules/adr.md` and in the sparc text of `AGENTS.md`, because `AGENTS.md` is in the context of each session. The architect role reads only the current ADRs.
- The canvas section "Core Decisions" is the index of the ADRs. The document check reports an ADR that has no line in this section. It also reports the line of a `superseded`, `deprecated` or `rejected` ADR that does not name this status.
- The document check reads the ADR list in `design.md` of each open change. It reports each link in this list to an ADR with the status `superseded`, `deprecated` or `rejected`. The design rule in `openspec/config.yaml` tells to start the ADR list with `ADRs:`.
- Existing projects get the new `AGENTS.md` rule and the new design rule through `/sparc:update`.

Out of scope:

- Changes to the MADR format, to the status values or to the body of decided ADRs.
- A move of old ADRs to a subfolder.
- A check of links to old ADRs outside the ADR list of an open change, for example in the proposal or in archived changes.

## Capabilities

### New Capabilities

### Modified Capabilities

- `adr-management`: the rule for current ADRs, the check of the ADR index in the canvas, and the check of the ADR list of open changes.

## Impact

- `rules/adr.md`, `rules/roles/architect.md`, `templates/project/AGENTS.md`, `AGENTS.md` of sparc, `templates/project/openspec/config.yaml` and `openspec/config.yaml` of sparc.
- `scripts/check.mjs` and `scripts/check.test.mjs`.
- A project whose canvas does not list each ADR gets new findings. The findings warn and do not block ([ADR-0005](../../../docs/adr/0005-hook-warns-and-does-not-block.md)).
