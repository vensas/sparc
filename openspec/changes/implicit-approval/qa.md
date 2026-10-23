# QA

Test command: `node --test 'scripts/*.test.mjs'`. Tests: `scripts/approval.test.mjs`. The tests check the text of the rule and the skills.

## Code review

Reviewed: `50cb1c4..e2117e9` (software engineer role, `git diff main...HEAD`)

| Finding | Fix |
|---|---|
| The rule did not name the acceptance or rejection of an ADR outside a change (for example with `/sparc:adr`) as an explicit decision. | bf8ba9b |
| A sentence in the spec started with a lowercase letter after the fix. | e2117e9 |

## Scenarios

| Scenario | Result | Evidence |
|---|---|---|
| Apply approves the change: Propose ends without a question | passed | Test "Apply approves the change: Propose ends without a question". `node --test 'scripts/*.test.mjs'`: passed. |
| Apply approves the change: Apply starts without a question | passed | Test "Apply approves the change: Apply starts without a question". `node --test 'scripts/*.test.mjs'`: passed. Live: this change was applied after the user wrote "apply both the icon and the implicit approval", without a question about approval. |
| Apply approves the change: ADRs of the change at archive | passed | Test "Apply approves the change: ADRs of the change at archive". `node --test 'scripts/*.test.mjs'`: passed. |
| Pull request approval: Reviewer approves | manual | See "Manual checks". |
| Pull request approval: Solo user merges | manual | See "Manual checks". |
| Pull request approval: Reviewer asks for changes | manual | See "Manual checks". |
| Explicit approval for other decisions: ADR amendment | passed | Test "Explicit approval for other decisions: ADR amendment / Release version". `node --test 'scripts/*.test.mjs'`: passed. |
| Explicit approval for other decisions: Release version | passed | Test "Explicit approval for other decisions: ADR amendment / Release version". `node --test 'scripts/*.test.mjs'`: passed. Live: `/sparc:release` asked for the approval of 0.3.0 on 2026-10-23. |

## Manual checks

### Pull request approval: Reviewer approves

- Reason: The scenario needs a GitHub repository with a pull request and a reviewer. sparc has no remote yet.
- Steps: Archive a change in a project on GitHub. Let a reviewer approve the pull request.
- Expected result: sparc counts the change and its ADRs as approved.
- Result: not done. The test "Pull request approval: Reviewer approves / Solo user merges / Reviewer asks for changes" shows that the rule names `APPROVED`.

### Pull request approval: Solo user merges

- Reason: As above.
- Steps: Archive a change in a project on GitHub. Merge the pull request as its author, without a review.
- Expected result: sparc counts the merge as the approval.
- Result: not done. The same test shows that the rule names the merge.

### Pull request approval: Reviewer asks for changes

- Reason: As above.
- Steps: Archive a change in a project on GitHub. Let a reviewer ask for changes.
- Expected result: The work goes back to `/sparc:apply`. The ADRs do not reach the default branch.
- Result: not done. The same test shows that the rule names `CHANGES_REQUESTED`.

## Acceptance

Accepted on 2026-10-23 by the product owner role, with an open point. No scenario failed. The 5 scenarios without pull requests passed. The 3 pull request scenarios are not done, because sparc has no GitHub repository yet. The rule text for them is tested. The open point goes into the canvas at archive.
