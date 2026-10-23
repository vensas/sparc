# QA

Test command: `node --test 'scripts/*.test.mjs'`. Tests: `scripts/check.test.mjs`. Each test makes a temporary git repository and runs the check against it.
The main session did this QA run with the QA engineer instructions in `agents/qa-engineer.md`.

| Scenario | Result | Evidence |
|---|---|---|
| Valid ADR status: Status is not valid | passed | Test "Valid ADR status: Status is not valid / Status is valid" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Valid ADR status: Status is valid | passed | Test "Valid ADR status: Status is not valid / Status is valid" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| ADR date format: Date has a different format | passed | Test "ADR date format: Date has a different format" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Unique ADR numbers: Two ADRs have the same number | passed | Test "Unique ADR numbers: Two ADRs have the same number" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Supersede target exists: Superseding ADR does not exist | passed | Test "Supersede target exists: Superseding ADR does not exist" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| MADR front matter only: Leftover lock field | passed | Test "MADR front matter only: Leftover lock field / Check leaves ADR files unchanged" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| MADR front matter only: Check leaves ADR files unchanged | passed | Test "MADR front matter only: Leftover lock field / Check leaves ADR files unchanged" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Amendments with an approver: Amended ADR has no entry | passed | Test "Amendments with an approver: Amended ADR has no entry / Entry has no approver" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Amendments with an approver: Entry has no approver | passed | Test "Amendments with an approver: Amended ADR has no entry / Entry has no approver" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Decided ADR is protected through git history: Body changed after the decision | passed | Test "Decided ADR is protected through git history: Body changed after the decision" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Decided ADR is protected through git history: Decision maker changed after the decision | passed | Test "Decided ADR is protected through git history: Decision maker changed after the decision" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Decided ADR is protected through git history: Status and date change | passed | Test "Decided ADR is protected through git history: Status and date change" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Decided ADR is protected through git history: Changes while the ADR was proposed | passed | Test "Decided ADR is protected through git history: Changes while the ADR was proposed" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Decided ADR is protected through git history: Decided ADR is not committed yet | passed | Test "Decided ADR is protected through git history: Decided ADR is not committed yet" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Decided ADR is protected through git history: Project is not a git repository | passed | Test "Decided ADR is protected through git history: Project is not a git repository" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Existing amendments are protected: New amendment entry | passed | Test "Existing amendments are protected: New amendment entry / Committed amendment entry changed" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |
| Existing amendments are protected: Committed amendment entry changed | passed | Test "Existing amendments are protected: New amendment entry / Committed amendment entry changed" in `scripts/check.test.mjs`. `node --test 'scripts/*.test.mjs'`: passed. |

## Additional evidence

- Mutation check: with the history comparison and the amendment comparison disabled, the tests for "Body changed after the decision", "Decision maker changed after the decision" and the amendment scenarios fail. With the code restored, 34 of 34 tests pass.
- Real history: `node scripts/check.mjs` on the sparc repository reports no change for the decided ADRs 0001 to 0007 after the removal of the `locked:` lines.

## Acceptance

All scenarios are automated and passed. There are no manual checks. Accepted by the product owner role on 2026-10-23 from this report, without a second walk-through.
