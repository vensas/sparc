# QA

Test command: `node --test 'scripts/*.test.mjs'`. Tests: `scripts/check.test.mjs`. The git tests make temporary repositories.

## Code review

Reviewed: `d5eb542..64bf322` (software engineer role, `git diff main...HEAD`)

| Finding | Fix |
|---|---|
| A typo in `sparc.workflow` (for example `trunkk`) fell back to `pull-request` without a message. | 64bf322 |

Mutation check: with the trunk path in `checkGit` disabled, the tests "Changes through pull requests: Trunk-based change" and "Conventional commit messages: Trunk commit header is not conventional" fail.

## Scenarios

| Scenario | Result | Evidence |
|---|---|---|
| Workflow setting: Project without a workflow key | passed | Test "Workflow setting: Project without a workflow key". `node --test 'scripts/*.test.mjs'`: passed. |
| Workflow setting: Solo user in init | passed | Live run: `/sparc:init a small todo CLI` with the answer "I work alone" (Claude Code 2.1.308, `claude -p --plugin-dir`) wrote `workflow: trunk` under `sparc` and made no branch. |
| Conventional commit messages: Commit header is not conventional | passed | Test "git: commits on the work branch need a Conventional Commits header". `node --test 'scripts/*.test.mjs'`: passed. |
| Conventional commit messages: Commit header is conventional | passed | Test "git: commits on the work branch need a Conventional Commits header". `node --test 'scripts/*.test.mjs'`: passed. |
| Conventional commit messages: Trunk commit header is not conventional | passed | Test "Conventional commit messages: Trunk commit header is not conventional". `node --test 'scripts/*.test.mjs'`: passed. |
| Changes through pull requests: Files change on the default branch | passed | Test "git: changes on the default branch are reported". `node --test 'scripts/*.test.mjs'`: passed. |
| Changes through pull requests: Trunk-based change | passed | Test "Changes through pull requests: Trunk-based change". `node --test 'scripts/*.test.mjs'`: passed. |
| Changes through pull requests: Archive in the workflow trunk | manual | See "Manual checks" (passed at archive). |

## Manual checks

### Changes through pull requests: Archive in the workflow trunk

- Reason: The scenario is the behavior of the archive skill on the default branch. sparc uses the workflow `trunk` only after this change is on `main`.
- Steps: Bring the commits of this change to `main`. Run `/sparc:archive trunk-based-workflow` on `main`.
- Expected result: Archive commits on `main`. It makes no branch and no pull request.
- Result: passed. The commits of the change were brought to `main` with a fast-forward. `/sparc:archive trunk-based-workflow` ran on `main` with `workflow: trunk`. It made the archive commit on `main`, without a branch and without a pull request. The check on `main` reported no finding.

## Acceptance

Accepted on 2026-10-23 by the product owner role, with one open manual check. No scenario failed. The code review finding has a fix. The check "Archive in the workflow trunk" is done at the archive of this change.
