# Tasks

## 1. Release values

- [x] 1.1 Add `scripts/verify-release.mjs <tag> [notes-file]` and `scripts/verify-release.test.mjs`. The script compares the tag, the version in `plugin.json`, the marketplace `ref` and the latest changelog release, names each difference and writes the changelog section to the notes file. Set the marketplace entry to `{"source": "github", "repo": "vensas/sparc", "ref": "v0.5.0"}`. Verify: `node --test 'scripts/*.test.mjs'` passes with a test for each scenario of the requirements "Marketplace gives the latest release" and "Publication of a release tag", and `node scripts/verify-release.mjs v0.5.0` passes. Documents: none.
- [x] 1.2 Add the project rule in `AGENTS.md` (outside the sparc markers): the marketplace `ref` is a version file, and the release pushes with `git push --atomic origin main v<version>`. Verify: `node scripts/check.mjs` reports no finding. Documents: AGENTS.md.

## 2. CI workflows

- [x] 2.1 Add `.github/workflows/validate.yml` (push to `main`, pull request, `workflow_call`): Node.js 24, `fetch-depth: 0`, tests, `node scripts/check.mjs`, `claude plugin validate .`. Verify: `actionlint` reports nothing, and `act push -W .github/workflows/validate.yml` passes. Documents: canvas.md (open point if the plugin validation needs a login).
- [ ] 2.2 Add `.github/workflows/publish.yml` (push of tags `v*.*.*`): call the validation workflow, run `scripts/verify-release.mjs`, then `gh release create` with `contents: write`, skipped under `act`. Verify: `actionlint` reports nothing, `act push` with a `v0.5.0` tag event passes, and with a `v9.9.9` tag event fails at the verification step. Documents: none.

## 3. Documents

- [ ] 3.1 Rewrite the install section of `README.md`: CLI, Claude Desktop, update, access to the private repository, and `claude --plugin-dir .` for development. Add the CI workflows to the structure table in `AGENTS.md`. Verify: `node scripts/check.mjs` reports no finding. Documents: README.md, AGENTS.md.
