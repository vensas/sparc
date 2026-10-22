# Tasks

## 1. Rules and templates

- [x] 1.1 Add `rules/release.md` and link it from `rules/docs.md` and the agents. Verify: `grep -r release.md agents rules skills`.
- [x] 1.2 Add `templates/project/CHANGELOG.md`. Verify: the check of a template project reports no changelog finding.
- [x] 1.3 Add ADR-0006 and link it in the canvas. Verify: `node scripts/check.mjs` reports no ADR finding.

## 2. Check

- [ ] 2.1 Add changelog, version, commit and branch checks to `scripts/check.mjs` with tests for each scenario. Verify: `node --test 'scripts/*.test.mjs'` passes.

## 3. Skills

- [ ] 3.1 Update `propose`, `apply`, `archive` and `init` for branches, commits, changelog entries and pull requests. Verify: `claude plugin validate .` passes.
- [ ] 3.2 Add the skill `release`. Verify: `claude plugin validate .` passes and the README lists it.

## 4. sparc repository

- [ ] 4.1 Add `CHANGELOG.md` with release 0.1.0 and the Unreleased entries of this change. Update README, AGENTS.md, C4 and backlog. Verify: `node scripts/check.mjs` reports no findings.
