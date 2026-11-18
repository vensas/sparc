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
