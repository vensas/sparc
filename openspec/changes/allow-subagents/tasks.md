# Tasks

## 1. Remove the ban

- [x] 1.1 Change the test in `scripts/team-roles.test.mjs` to the scenarios "Skills do not forbid subagents" and "Apply without subagents". Verify: `node --test 'scripts/*.test.mjs'` fails on the current text of apply.
- [x] 1.2 In `skills/apply/SKILL.md`, remove "in the current session" from the description and replace "one after the other, in the current session" in step 2 with a neutral dependency note. Verify: `node --test 'scripts/*.test.mjs'` passes.
- [ ] 1.3 In `README.md`, replace "The skills follow them in the current session, without subagents." with neutral text. Verify: `node scripts/check.mjs` has no findings.

## 2. Amend the decision

- [ ] 2.1 Add the amendment of design.md to `## Amendments` of ADR-0009 and set its status to `amended`. Verify: `node scripts/check.mjs` has no findings and the canvas still links ADR-0009.
