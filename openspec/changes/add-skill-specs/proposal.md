# Proposal

Backlog item: "Write specs for the skills that have no spec yet" in [docs/backlog.md](../../../docs/backlog.md).

## Why

The canvas section [Core Functions](../../../docs/architecture/canvas.md#core-functions-) says that the skills init, propose, apply, archive, sync, adr, release and update have no spec. Thus a change to a skill cannot name the requirement that it changes, and QA cannot prove the skill behavior from spec scenarios.

A comparison of each skill with the specs in `openspec/specs/` gives this result:

| Skill | Coverage now | Gap |
|---|---|---|
| init | `project-update` (version, markers), `release-conventions` (workflow question), `approval` (ADR-0001) | Prerequisites, template copy, `CLAUDE.md`, documents from evidence, first commit |
| propose | `approval` (no approval question) | Planning documents only, change id and branch, mockups, test tool, validation and commit |
| apply | `approval`, `team-roles` (code review, fresh-context check), `qa-engineering` (QA, acceptance) | Start conditions, task groups, QA commit scope, report |
| archive | `approval` (ADRs), `document-set` (backlog, changelog), `release-conventions` (trunk) | Stop conditions, main specs, sync and commit, pull request |
| sync | None | All |
| adr | `adr-management` (check), `approval` (explicit approval) | New ADR, amendment limit, supersede steps |
| release | `release-conventions` (version, changelog), `approval` (version approval) | Start conditions, release commit and tag |
| update | `project-update` | Stop when the project is up to date or newer |

## What Changes

- Specify the current behavior of each skill where no requirement covers it. No skill changes its behavior.
- Do not repeat a requirement that exists. The new requirements link to the existing capabilities and to the rules in `rules/`.
- Add a test or a recorded run for each new scenario.
- Update the canvas section "Core Functions" so that it links to the new specs.
- Write each unclear skill step as an open point in the canvas. Do not fix it in this change.

## Capabilities

### New Capabilities

- `project-setup`: the behavior of `/sparc:init`. It sets up sparc in a new or existing project.
- `change-workflow`: the behavior of `/sparc:propose`, `/sparc:apply` and `/sparc:archive`. These three skills are the life cycle of one change, and they share the change id, its documents and its stop conditions. One capability keeps the steps between them in one place.

Choice of the boundaries: sync goes into the existing capability `document-set`, because that capability is the home of the document rules. adr, release and update go into their existing capabilities. A capability for each skill would split the change life cycle into three small specs with many links between them.

### Modified Capabilities

- `document-set`: add the sync requirements.
- `adr-management`: add the requirements of `/sparc:adr` for a new ADR, an amendment and a supersede.
- `release-conventions`: add the start conditions of `/sparc:release`, and the release commit and tag.
- `project-update`: add the stop of `/sparc:update` when the project is up to date or newer.

All deltas are `ADDED` requirements. No existing requirement changes.

## Out of scope

- A change to the behavior of a skill. Each unclear step goes into the canvas section "Core Risks and Missing Information".
- Recorded runs of the full workflow on more sample projects.
- The other backlog items.

## Impact

- New test files in `scripts/` for the new scenarios. The tests read the skill files and the rules, as `scripts/approval.test.mjs` does.
- `docs/architecture/canvas.md`: "Core Functions" and "Core Risks and Missing Information".
- No change to `skills/`, `rules/`, `templates/`, `hooks/` or the check.
