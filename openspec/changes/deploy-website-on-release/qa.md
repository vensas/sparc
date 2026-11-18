# QA

Test tool (design.md, "Test tool"): node:test in `scripts/website.test.mjs` reads the workflow files and evaluates the job condition of `deploy` for an event and a ref. `actionlint` checks the syntax. The real deployment needs the GitHub runners and the server.

| Scenario | Result | Evidence |
|---|---|---|
| Build and deployment: Build without dependencies | passed | The website tests build the site with Node.js and no `npm install`, `node --test 'scripts/*.test.mjs'`, 253 passed, 0 failed |
| Build and deployment: Local run | passed | Unchanged by this change; the manual check of add-landing-page (2026-11-18) stays valid |
| Build and deployment: Deploy after a change | passed | "Build and deployment: Deploy after a change" (push to `main` and a pull request do not deploy), `node --test 'scripts/*.test.mjs'`, 253 passed, 0 failed. act in a clean clone, `act push -W .github/workflows/website.yml`: the job `test` passed and the job `deploy` did not start |
| Build and deployment: Deploy after a release | manual | See "Manual checks" |
| Build and deployment: Failed release verification | passed | "Build and deployment: Failed release verification" (the job `website` needs `publish`, which verifies before it creates the release), `node --test 'scripts/*.test.mjs'`, 253 passed, 0 failed |
| Build and deployment: Manual start | manual | See "Manual checks". The condition part: "Build and deployment: Manual start", `node --test 'scripts/*.test.mjs'`, 253 passed, 0 failed |

## Manual checks

### Build and deployment: Deploy after a release

- Reason: needs a release tag on GitHub, the runners, the secrets and the server.
- Steps: at the release of 0.9.0, push the release commit and the tag, and watch the job `website` of the workflow `Publish`.
- Expected result: `validate` and `publish` pass, then `website` tests and deploys, and https://sparc.apps.vensas.de shows version 0.9.0.
- Result: open. The tests show the call and the condition. `actionlint` passes.

### Build and deployment: Manual start

- Reason: needs the runners, the secrets and the server.
- Steps: `gh workflow run website.yml --repo vensas/sparc`, then `gh run watch`.
- Expected result: `test` passes, then `deploy` deploys the selected commit.
- Result: open.
