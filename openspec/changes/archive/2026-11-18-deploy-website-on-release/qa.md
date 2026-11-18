# QA

Test tool (design.md, "Test tool"): node:test in `scripts/website.test.mjs` reads the workflow files and compares the triggers and the exact job conditions. `actionlint` checks the syntax. The real deployment needs the GitHub runners and the server.

| Scenario | Result | Evidence |
|---|---|---|
| Build and deployment: Build without dependencies | passed | The website tests build the site with Node.js and no `npm install`, `node --test 'scripts/*.test.mjs'`, 253 passed, 0 failed |
| Build and deployment: Local run | passed | Unchanged by this change; the manual check of add-landing-page (2026-11-18) stays valid |
| Build and deployment: Deploy after a change | passed | "Build and deployment: Deploy after a change" (push to `main` and a pull request do not deploy), `node --test 'scripts/*.test.mjs'`, 253 passed, 0 failed. act in a clean clone, `act push -W .github/workflows/website.yml`: the job `test` passed and the job `deploy` did not start |
| Build and deployment: Deploy after a release | passed | See "Manual checks" (release 0.9.0) |
| Build and deployment: Failed release verification | passed | "Build and deployment: Failed release verification" (the job `website` needs `publish`, which verifies before it creates the release, and its condition has no status function), `node --test 'scripts/*.test.mjs'`, 253 passed, 0 failed |
| Build and deployment: Manual start | manual | See "Manual checks". The condition part: "Build and deployment: Manual start", `node --test 'scripts/*.test.mjs'`, 253 passed, 0 failed |

## Manual checks

### Build and deployment: Deploy after a release

- Reason: needs a release tag on GitHub, the runners, the secrets and the server.
- Steps: at the release of 0.9.0, push the release commit and the tag, and watch the job `website` of the workflow `Publish`.
- Expected result: `validate` and `publish` pass, then `website` tests and deploys, and https://sparc.apps.vensas.de shows version 0.9.0.
- Result: passed on 2026-11-18. The release 0.9.0 ran the workflow `Publish` (run 44281424898): `validate`, `publish`, `website / test` and `website / deploy` succeeded. https://sparc.apps.vensas.de answers 200 for `/`, `/de/` and `/imprint.html`, 404 for a missing page, shows version 0.9.0, sends the CSP and HSTS headers, and has a Let's Encrypt certificate. The push to `main` before the release (run 44281226313) tested the site and skipped `deploy`.

### Build and deployment: Manual start

- Reason: needs the runners, the secrets and the server.
- Steps: `gh workflow run website.yml --repo vensas/sparc`, then `gh run watch`.
- Expected result: `test` passes, then `deploy` deploys the selected commit.
- Result: open.

## Code review

Reviewed: `5126079` (workflow `trunk`, after the proposal commit 5a62891)
Context: fresh

| Finding | Fix |
|---|---|
| `.github/workflows/publish.yml:35`: `!github.event.act` is set only by an event file with `"act": true`, so a local run with act would deploy | e0c1a36: `github.actor != 'nektos/act' && !github.event.act` (act runs as `nektos/act` by default). act run with a tag event: the job `website` did not start |
| `design.md:23`: the design names `!env.ACT`, which a job-level `if` cannot read | e0c1a36: the design names the real condition and the reason |
| `scripts/website.test.mjs:401-407`: a status function such as `always()` would pass the test and deploy after a failed verification | e0c1a36: the test checks that the condition of the job `website` has no status function, and checks the act condition |
| `scripts/website.test.mjs:378-384`: the home-made expression evaluator is fragile | e0c1a36: the tests compare the exact conditions as text; design.md tells why |
| Minor: `AGENTS.md:36` says "each push and pull request" | e0c1a36: "a push to `main` or a pull request that changes it" |
| Minor: `canvas.md:115` "exist since" without evidence | e0c1a36: "were set and checked on 2026-11-18 (`gh secret list`, `dig`)" |

After the fixes: `node --test 'scripts/*.test.mjs'`, 253 passed, 0 failed. `actionlint`: no findings. `node scripts/check.mjs`: no findings.

## Acceptance

Accepted on 2026-11-18 by the product owner role. 4 scenarios passed, no scenario failed, and each code review finding has a fix. Open: the manual checks "Deploy after a release" and "Manual start" run at the release of 0.9.0 (workflow follow-up in tasks.md, open point in the canvas).
