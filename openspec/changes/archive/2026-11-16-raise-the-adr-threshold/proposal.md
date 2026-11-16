# Proposal

## Why

sparc has 17 ADRs for 16 archived changes. Three ADRs are superseded and two are amended. Many ADRs record conventions or check behavior that are easy to change, for example [ADR-0017](../../../docs/adr/0017-keep-only-open-items-in-the-backlog.md). The specs often tell the same behavior, so the fact has two homes, and one of them is locked.

The cause is the threshold in [rules/roles/architect.md](../../../rules/roles/architect.md): "A decision is significant if it is hard to change later or if it affects more than one container." sparc has 7 containers, and almost each change touches two of them. Thus almost each decision gets an ADR. Some ADRs also do not compare real options. For example, [ADR-0006](../../../docs/adr/0006-use-keep-a-changelog-semver-and-conventional-commits.md) tells "because the user requires these conventions".

Backlog item: "An ADR only for a major decision with real options" in [docs/backlog.md](../../../docs/backlog.md).

## What Changes

- A new rule tells when to write an ADR. An ADR is necessary only for a major decision. A decision is major when it is central to the idea of the project and to its approach to the problem, and the team chose between two or more real solution options. The rule has one home: `rules/adr.md`. The architect role links to it.
- Each other decision stays in `design.md` of its change, with its options and the reason for the choice. Conventions, document formats and check behavior go in specs and rules, not in ADRs.
- Hard requirement: an ADR gives all considered options, and the good and bad trade-offs of each option. The document check reports a `proposed` ADR with fewer than two options, or with an option that has no good or no bad trade-off.
- The ADR template tells the option and trade-off requirement.
- The choice of a new test tool is no longer a project ADR by default. `design.md` of the change gives the options and the reason. The approval of the change approves the tool. If the choice is a major decision, the architect writes an ADR as for each other decision.
- Existing projects get the new template through `/sparc:update`.

Out of scope:

- Changes to the existing ADRs of sparc or of a project. A decided ADR does not change, and the new rule applies to new decisions only.
- A deprecation of existing ADRs that do not meet the new threshold.
- A check that decides if a decision is major. Only an agent or the user can decide this.
- A check of decided ADRs for options and trade-offs.

## Capabilities

### New Capabilities

### Modified Capabilities

- `adr-management`: the rule for when to write an ADR, and the check of options and trade-offs in a proposed ADR.
- `change-workflow`: `design.md` chooses a missing test tool. It does not write an ADR for it by default.
- `qa-engineering`: the QA engineer uses a new test tool after the approval of the change that names it.

## Impact

- `rules/adr.md`, `rules/roles/architect.md`, `rules/roles/qa-engineer.md`, `templates/project/docs/adr/0000-template.md` and `docs/adr/0000-template.md` of sparc.
- `skills/propose/SKILL.md` and `skills/apply/SKILL.md`.
- `scripts/check.mjs` and the tests.
- A project with a `proposed` ADR that has fewer than two options or no trade-offs gets new findings. The findings warn and do not block ([ADR-0005](../../../docs/adr/0005-hook-warns-and-does-not-block.md)).
