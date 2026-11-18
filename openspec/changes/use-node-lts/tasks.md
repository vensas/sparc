# Tasks

## 1. Use the latest Node.js LTS version

- [x] 1.1 In `skills/init/SKILL.md`, replace "sparc needs Node.js 20 or later" with a check that `node --version` succeeds. If it fails, init stops before it changes a file and tells the user to install the latest LTS version from https://nodejs.org. Verify: `node --test 'scripts/*.test.mjs'` passes with tests for "Node.js is not installed" and "Any installed Node.js version" in `scripts/project-setup.test.mjs`. Documents: none.
- [x] 1.2 Set the prerequisites in `README.md` to "Node.js (latest LTS version)". In the canvas, set "Technologies" to the latest LTS version and remove the open point about the version check of `/sparc:init`. Verify: a test in `scripts/readme.test.mjs` finds "latest LTS" and no "Node.js 20" in the README, and `node scripts/check.mjs` passes. Documents: README.md, canvas.
- [x] 1.3 Set `node-version: lts/*` in `.github/workflows/validate.yml` and `.github/workflows/publish.yml`. Verify: `actionlint` passes, and `act push -W .github/workflows/validate.yml --container-architecture linux/arm64` passes. Documents: none.
- [x] 1.4 Add the `CHANGELOG.md` Unreleased entry under "Changed". Verify: `node scripts/check.mjs` passes. Documents: CHANGELOG.md.
