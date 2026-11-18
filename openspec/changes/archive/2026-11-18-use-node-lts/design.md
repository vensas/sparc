## Context

See proposal.md, "Why". The Node.js release schedule (https://github.com/nodejs/Release, `schedule.json`, read on 2026-11-16): Node.js 20 reached its end of life on 2026-04-30. Node.js 26 is the Active LTS version since 2026-10-28. CI uses `node-version: 24` now. The development machine of this session has v24.12.0.

## Goals / Non-Goals

**Goals:**
- No fixed Node.js version number in the documents of sparc.
- CI tests with the latest LTS version.

**Non-Goals:**
- A version check. The user decided not to enforce a version.

## Decisions

ADRs: none. The Node.js version is a prerequisite, not a decision that is central to sparc (see `rules/adr.md`).

- **Wording.** "Node.js (latest LTS version)". Options: a fixed minimum such as "Node.js 26 or later". Rejected by the user: a number gets old, and an enforced minimum stops users who have an older LTS version.
- **Check in `/sparc:init`.** Only that `node --version` succeeds. If it fails, init stops, because the check and the verifier need Node.js.
- **CI.** `node-version: lts/*` in `validate.yml` and `publish.yml`. `actions/setup-node` resolves `lts/*` to the latest LTS version (https://github.com/actions/setup-node). Trade-off: a new LTS version can change a CI result without a commit. The scripts use only `node:` modules, so the risk is small.
- **Test tool.** `node --test 'scripts/*.test.mjs'` (node:test, see `AGENTS.md`). The skill text tests in `scripts/project-setup.test.mjs` check the new scenarios. `scripts/readme.test.mjs` checks that the README names the latest LTS version and no version number.

## C4 impact

No C4 impact.

## Risks / Trade-offs

- [A user runs sparc on a Node.js version without support] → The README and init recommend the latest LTS version. sparc does not block the user.
- [A new LTS version breaks a script] → CI runs on `lts/*` and finds it at the next push.
