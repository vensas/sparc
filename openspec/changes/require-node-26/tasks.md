# Tasks

## 1. Require Node.js 26

- [ ] 1.1 In `skills/init/SKILL.md`, make the Node.js check stop before it changes a file when the version is older than 26, and tell the user to install the current LTS version from https://nodejs.org. Verify: `node --test 'scripts/*.test.mjs'` passes with tests for "Node.js is too old" and "Node.js 26" in `scripts/project-setup.test.mjs`. Documents: none.
- [ ] 1.2 Set the prerequisites in `README.md` to Node.js 26 or later. Update the canvas: "Technologies", the measured value of the "Speed" row with Node.js 26, and remove the open point about the version check of `/sparc:init`. Verify: a test in `scripts/readme.test.mjs` for the version passes, and `node scripts/check.mjs` passes. Documents: README.md, canvas.
- [ ] 1.3 Set `node-version: 26` in `.github/workflows/validate.yml` and `.github/workflows/publish.yml`. Verify: `actionlint` passes, `node --test 'scripts/*.test.mjs'` passes on Node.js 26 locally, and `act push -W .github/workflows/validate.yml --container-architecture linux/arm64` passes. Documents: none.
- [ ] 1.4 Add the `CHANGELOG.md` Unreleased entry under "Changed", marked as breaking. Verify: `node scripts/check.mjs` passes. Documents: CHANGELOG.md.
