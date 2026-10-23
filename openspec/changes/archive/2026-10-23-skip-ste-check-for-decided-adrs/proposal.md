## Why

The check reports sentences with more than 25 words (STE) in each ADR. A decided ADR must not change (see the `adr-management` spec). So a long sentence in a decided ADR gives a finding that nobody can fix, and the Stop hook repeats it. Backlog item: "No STE sentence findings for decided ADRs".

## What Changes

- The check does not report long sentences in a decided ADR. A decided ADR has a status other than `proposed`.
- The check still reports long sentences in a `proposed` ADR, because it can still change.
- `rules/writing.md` tells that the check skips decided ADRs.

Out of scope:

- Other checks of decided ADRs (status, date, MADR fields, git history protection, placeholders). They stay.
- A separate check for new amendment entries. The whole decided ADR is skipped.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `adr-management`: a new requirement for the sentence check of ADRs.

## Impact

- `scripts/check.mjs` and `scripts/check.test.mjs`.
- `rules/writing.md`, `CHANGELOG.md`.
