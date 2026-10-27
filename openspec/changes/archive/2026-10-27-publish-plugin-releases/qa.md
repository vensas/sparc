# QA

| Scenario | Result | Evidence |
|---|---|---|
| Marketplace gives the latest release: Install after a release | passed | Install with a separate `CLAUDE_CONFIG_DIR` from a marketplace whose `HEAD` has `scripts/verify-release.mjs` and the `ref` `v0.5.0`: `claude plugin install sparc@sparc` put version 0.5.0 in the cache, without `scripts/verify-release.mjs`. The files come from the tag, not from `HEAD`. |
| Marketplace gives the latest release: Entry and manifest differ | passed | "Marketplace gives the latest release: entry and manifest differ", `node --test 'scripts/*.test.mjs'`, 69 passed, 0 failed |
| Release commit and tag are pushed together: Release 0.6.0 | manual | See "Manual checks". The rule is tested by "Release commit and tag are pushed together: AGENTS.md tells the atomic push". |
| Validation on each push and pull request: A test fails | passed | `act push -W .github/workflows/validate.yml` on a clean clone with an added failing test: "pass 65, fail 1", step "Run the tests" failed, job failed |
| Validation on each push and pull request: All checks pass | passed | `act push -W .github/workflows/validate.yml` on a clean clone: 65 tests passed, "sparc check: no findings", "Validation passed with warnings", job succeeded. Trigger test: "Validation on each push and pull request: workflow runs the tests, the check and the plugin validation". |
| Publication of a release tag: Tag matches the release | passed | `act push -e <tag event v0.5.0> -W .github/workflows/publish.yml`: validation job succeeded, "release v0.5.0: tag, plugin.json, marketplace and changelog are equal", job succeeded. The step "Create the GitHub release" does not run under `act`, see "Manual checks". |
| Publication of a release tag: Tag does not match the release | passed | `act push -e <tag event v9.9.9> -W .github/workflows/publish.yml`: "release v9.9.9: 3 problem(s)", step "Verify the release" failed, no release step ran. Unit test "Publication of a release tag: tag does not match the release". |
| Install instructions: Read the install section | passed | "Install instructions: README has the CLI, Claude Desktop, update and development steps", `node --test 'scripts/*.test.mjs'`, 69 passed |

## Manual checks

### Release commit and tag are pushed together: Release 0.6.0

- Reason: the check needs a real release and a push to GitHub.
- Steps: run `/sparc:release` for 0.6.0. Read the release commit. Push with `git push --atomic origin main v0.6.0`.
- Expected result: the commit `chore(release): 0.6.0` sets the marketplace `ref` to `v0.6.0`. One push updates `main` and makes the tag.
- Result: passed. Commit `586fe7d` sets `ref` to `v0.6.0`. `git push --atomic origin main v0.6.0` updated `main` (`27048d6..586fe7d`) and made the tag.

### Publication of a release tag: GitHub release on GitHub

- Reason: `act` cannot make a GitHub release with the token of GitHub Actions.
- Steps: after the push of `v0.6.0`, run `gh run watch` for the workflow "Publish", then `gh release view v0.6.0`.
- Expected result: the workflow passes. The release `v0.6.0` exists, with the entries of `## [0.6.0]` as notes.
- Result: passed after one more tag push. The first tag push started no Publish run, because `publish.yml` came in the same push. After `git push origin :refs/tags/v0.6.0` and `git push origin v0.6.0` (same commit `586fe7d`), run 40499231107 passed. `gh release view v0.6.0` shows the entries of `## [0.6.0]`.

## Code review

Reviewed: `5ef7204..2c86a90`

No findings.

## Acceptance

Accepted by the product owner from this report on 2026-10-27. No scenario failed. The code review has no open finding. The two manual checks passed after the release 0.6.0.
