# Tasks

## 1. Check

- [x] 1.1 Read `sparc.workflow` in `scripts/check.mjs`. In `trunk`, do not warn about the default branch, and check the commits since the last tag. Verify: `node --test 'scripts/*.test.mjs'` passes with tests for the new and changed scenarios. Documents: none.

## 2. Rule, skills and templates

- [x] 2.1 Add the section "Workflow" to `rules/release.md`. Make the branch and pull request steps of `propose`, `archive`, `release` and `update` depend on the workflow. In `init`, ask alone or team and write `sparc.workflow`. Add `workflow` to the config template and the rule text to the template block. Verify: `node --test 'scripts/*.test.mjs'` and `claude plugin validate .` pass. Documents: none.

## 3. sparc itself and documents

- [x] 3.1 Set `workflow: trunk` in `openspec/config.yaml` of sparc and change the branch rule in `AGENTS.md`. Update README and CHANGELOG. Add ADR-0012 to the canvas. Verify: `node scripts/check.mjs` passes on `main`. Documents: AGENTS.md, README.md, CHANGELOG.md, canvas.md.
