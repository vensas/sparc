## Why

A decided ADR has a `locked:` hash in its front matter, and the user must run `check.mjs --lock` after each decision. Git history already records each version of the ADR, so the hash adds no value. The field is also not part of the [MADR](https://github.com/adr/madr) front matter (`status`, `date`, `decision-makers`, `consulted`, `informed`). Backlog item: "Protect decided ADRs through git history, not a lock hash".

## What Changes

- The check finds the first commit in which an ADR has a decided status (`accepted`, `rejected`, `deprecated`, `amended` or `superseded by ADR-NNNN`). It reports each change since that commit to the body and to the MADR front matter, except the fields `status` and `date`.
- New entries at the end of `## Amendments` stay permitted. The check reports changes to entries that are in the last commit.
- The check reports each front matter field that is not in the MADR template, for example a leftover `locked` field.
- In a project that is not a git repository, the check reports one finding: it cannot protect decided ADRs.
- **BREAKING**: The `--lock` option of `check.mjs` is removed. The check does not write to ADR files.
- The `locked:` lines are removed from the ADRs of sparc.
- The ADR rule, the ADR skill, the init skill, the archive skill, the sync skill, the architect agent, the ADR template comment and the README do not mention the lock any more.
- The decision of [ADR-0004](../../../docs/adr/0004-lock-decided-adrs-with-a-body-hash.md) changes. A new ADR supersedes it.

Out of scope:

- New ADR features (for example new statuses or new transitions).
- A check of the status transitions in `rules/adr.md`.
- Search through renamed ADR files. The check follows the history of the current file path only.

## Capabilities

### New Capabilities

- `adr-management`: the ADR rules that the check enforces: valid status, date format, unique numbers, supersede target, MADR front matter, amendments with an approver, and protection of decided ADRs through git history.

### Modified Capabilities

None.

## Impact

- `scripts/check.mjs` and `scripts/check.test.mjs`.
- `rules/adr.md`, `skills/adr/SKILL.md`, `skills/init/SKILL.md`, `skills/archive/SKILL.md`, `skills/sync/SKILL.md`, `agents/architect.md`, `templates/project/docs/adr/0000-template.md`, `README.md`.
- `docs/adr/`: front matter of the decided ADRs, a new ADR that supersedes ADR-0004, and the canvas section "Core Decisions".
- Projects that call `check.mjs --lock` must remove the call.
