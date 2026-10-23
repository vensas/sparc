# Tasks

## 1. Templates and init

- [x] 1.1 Add the markers to `templates/project/AGENTS.md` and `templates/project/openspec/config.yaml`, and the key `sparc:` with `version: 0.0.0` to the config template. Verify: `node --test 'scripts/*.test.mjs'` passes. Documents: none.
- [x] 1.2 In `skills/init/SKILL.md`, write the installed version into `sparc.version`. Verify: `claude plugin validate .` passes. Documents: none.

## 2. Check

- [x] 2.1 Add the version finding to `scripts/check.mjs`: project version (default 0.1.0) against the plugin version, skipped in the plugin folder. Verify: `node --test 'scripts/*.test.mjs'` passes with tests for each scenario of "Project records its sparc version" and "Check reports an outdated project". Documents: none.

## 3. Update skill

- [x] 3.1 Add `skills/update/SKILL.md` as the design tells. Verify: `claude plugin validate .` passes. Documents: none.
- [x] 3.2 In `rules/release.md`, require a project step in each breaking changelog entry. Verify: `claude plugin validate .` passes. Documents: none.

## 4. Documents

- [x] 4.1 Update README (eight skills, update in "Get Started"), AGENTS.md, C4 container "Skills" and canvas. Verify: `node scripts/check.mjs` passes. Documents: README.md, AGENTS.md, c4.md, canvas.md.
- [x] 4.2 Add the `CHANGELOG.md` Unreleased entries. Verify: `node scripts/check.mjs` passes. Documents: CHANGELOG.md.
