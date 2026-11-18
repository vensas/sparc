# QA

Test files: `scripts/project-setup.test.mjs` (init skill text) and `scripts/readme.test.mjs` (README). The test name is the scenario name. The tests prove that the init skill tells the behavior, not that an agent obeys it.

| Scenario | Result | Evidence |
|---|---|---|
| Prerequisites before setup: Not a git repository | passed | "Prerequisites before setup: Not a git repository", `node --test 'scripts/*.test.mjs'`, 210 passed, 0 failed |
| Prerequisites before setup: OpenSpec is not installed | passed | "Prerequisites before setup: OpenSpec is not installed", `node --test 'scripts/*.test.mjs'`, 210 passed, 0 failed |
| Prerequisites before setup: Node.js is not installed | passed | "Prerequisites before setup: Node.js is not installed", `node --test 'scripts/*.test.mjs'`, 210 passed, 0 failed |
| Prerequisites before setup: Any installed Node.js version | passed | "Prerequisites before setup: Any installed Node.js version", `node --test 'scripts/*.test.mjs'`, 210 passed, 0 failed |

Other evidence of the tasks:

- README: "README for a first-time reader: Node.js version", `node --test 'scripts/*.test.mjs'`, 210 passed, 0 failed.
- CI with `lts/*`: `act push -W .github/workflows/validate.yml --container-architecture linux/arm64` in a clean clone. `actions/setup-node` downloaded Node.js v26.13.1. All steps passed. `actionlint`: no findings.

## Code review

Reviewed: `53b6e9a..142d4f2` (commits 53b6e9a, e1ee445, 82b5bb3, b3fd155, 142d4f2; workflow `trunk`, the add-landing-page commits in the range excluded)
Context: fresh

| Finding | Fix |
|---|---|
| `CHANGELOG.md:10`: the entry links to `openspec/changes/use-node-lts/proposal.md`. The archive moves the change, so the link breaks. Task 1.4 asked for the entry before the archive, against "Write the entries of a change when the change is archived" in the release rule. | `/sparc:archive use-node-lts` sets the link to the archive path and does not add the entry a second time. The archive date is not known before the archive. |
| `docs/architecture/canvas.md:82`: "tested with 24.12.0" does not tell the version that CI tests. | e3cabd0 |

After the fixes: `node --test 'scripts/*.test.mjs'`, 210 passed, 0 failed. `node scripts/check.mjs`: no findings.

## Acceptance

Accepted on 2026-11-18 by the product owner role. All 4 scenarios passed. The change has no manual checks. Each code review finding has a fix. The changelog link is a step of `/sparc:archive use-node-lts`.
