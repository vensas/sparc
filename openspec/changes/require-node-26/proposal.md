## Why

sparc says that it needs Node.js 20 or later. Node.js 20 reached its end of life on 2026-04-30 and gets no security fixes. Node.js 26 is the Active LTS version since 2026-10-28 (https://github.com/nodejs/Release). Also, `/sparc:init` checks the version but does not tell what to do with an older version (open point in the canvas). Backlog item: "Require the latest Node.js LTS version".

## What Changes

- **BREAKING** sparc needs Node.js 26 or later. Users with Node.js 20, 22 or 24 must install Node.js 26.
- `/sparc:init` stops before it changes a file when the Node.js version is older than 26, and tells the user to install the current LTS version.
- The README, the canvas and the CI workflows use Node.js 26.

Out of scope:

- An automatic check of the Node.js version in the hooks or in `scripts/check.mjs`.
- A rule to raise the version again for each new LTS version. The next raise is a new change.
- Code changes for new Node.js features. The scripts do not need them.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `project-setup`: the prerequisites of `/sparc:init` include Node.js 26 or later.

## Impact

- `skills/init/SKILL.md`, `scripts/project-setup.test.mjs`, `scripts/readme.test.mjs`.
- `.github/workflows/validate.yml`, `.github/workflows/publish.yml`.
- `README.md`, `docs/architecture/canvas.md`, `CHANGELOG.md`.
