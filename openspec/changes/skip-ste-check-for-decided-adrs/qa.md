# QA

Test command: `node --test 'scripts/*.test.mjs'`. Tests: `scripts/check.test.mjs`.

## Code review

Reviewed: `b2098ad..0568cb6` (software engineer role, `git diff main...HEAD`)

No findings

The diff matches the spec. It also removes the flag `decided` in `checkAdrs`, because the new list of decided ADRs gives the same information.

## Scenarios

| Scenario | Result | Evidence |
|---|---|---|
| Sentence check only for proposed ADRs: Long sentence in a decided ADR | passed | Test "Sentence check only for proposed ADRs: Long sentence in a decided ADR". `node --test 'scripts/*.test.mjs'`: passed. Mutation check: without the filter in `check`, this test fails. |
| Sentence check only for proposed ADRs: Long sentence in a proposed ADR | passed | Test "Sentence check only for proposed ADRs: Long sentence in a proposed ADR". `node --test 'scripts/*.test.mjs'`: passed. |

## Acceptance

Accepted on 2026-10-23 by the product owner role. Both scenarios are automated and passed. There are no manual checks. The code review has no finding.
