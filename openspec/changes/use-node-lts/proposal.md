## Why

sparc says that it needs Node.js 20 or later. Node.js 20 reached its end of life on 2026-04-30 and gets no security fixes (https://github.com/nodejs/Release). A fixed version number gets old with each Node.js release. sparc names "the latest LTS version" and uses it in CI, but does not enforce a version. Also, `/sparc:init` checks the version but does not tell what to do with the result (open point in the canvas). Backlog item: "Use the latest Node.js LTS version".

## What Changes

- The README, the canvas and `/sparc:init` recommend "Node.js, latest LTS version". They name no version number.
- `/sparc:init` stops before it changes a file only when Node.js is not installed, and tells the user to install the latest LTS version. It accepts each installed version.
- The CI workflows use the latest LTS version (`node-version: lts/*`) instead of the fixed version 24.

Out of scope:

- A version check in `/sparc:init`, the hooks or `scripts/check.mjs`.
- Code changes for new Node.js features. The scripts do not need them.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `project-setup`: the prerequisites of `/sparc:init` include an installed Node.js.

## Impact

- `skills/init/SKILL.md`, `scripts/project-setup.test.mjs`, `scripts/readme.test.mjs`.
- `.github/workflows/validate.yml`, `.github/workflows/publish.yml`.
- `README.md`, `docs/architecture/canvas.md`, `CHANGELOG.md`.
