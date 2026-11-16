## Context

See proposal.md, "Why". The Node.js release schedule (https://github.com/nodejs/Release, `schedule.json`, read on 2026-11-16):

| Version | Active LTS from | End of life |
|---|---|---|
| 20 | 2023-10-24 | 2026-04-30 |
| 22 | 2024-10-29 | 2027-04-30 |
| 24 | 2025-10-28 | 2028-04-30 |
| 26 | 2026-10-28 | 2029-04-30 |

The newest Node.js 26 release is v26.13.1 (2026-11-10, https://nodejs.org/dist/index.json). The development machine of this session has v24.12.0. CI uses `node-version: 24`.

## Goals / Non-Goals

**Goals:**
- One minimum version in all places: Node.js 26.
- A clear stop with an instruction in `/sparc:init` for an older version.

**Non-Goals:**
- A version check in the hooks. The hooks run on each stop, and a check there costs time for each stop.

## Decisions

ADRs: none. The minimum version is a prerequisite, not a decision that is central to sparc (see `rules/adr.md`).

- **Minimum version 26.** The user asked for the latest LTS version. Options: 22 or 24, which still get security fixes until 2027-04-30 and 2028-04-30. Rejected by the user's request. Trade-off: users on 22 or 24 must install 26.
- **Where to check.** Only in `/sparc:init`, as now. Options: a check in `scripts/check.mjs` or `scripts/verify.mjs`. Rejected: they run on each stop, and the scripts need no Node.js 26 feature.
- **CI.** `node-version: 26` in `validate.yml` and `publish.yml`. CI then tests the minimum version.
- **Test tool.** `node --test 'scripts/*.test.mjs'` (node:test, see `AGENTS.md`). The skill text tests in `scripts/project-setup.test.mjs` check the new scenarios. `scripts/readme.test.mjs` checks the README prerequisites.

## C4 impact

No C4 impact.

## Risks / Trade-offs

- [Users on Node.js 22 or 24 cannot run `/sparc:init`] → The stop message tells them what to install. The CHANGELOG marks the change as breaking.
- [The scripts are not tested on Node.js 26 yet] → Task 1.3 runs all tests on Node.js 26 locally and in CI.
- [The development machine has Node.js 24.12.0] → Install Node.js 26 before apply (for example `nvm install 26`).

## Migration Plan

Users install Node.js 26, then update sparc. Rollback: revert the change and release again.
