# QA

Test command: `node --test 'scripts/*.test.mjs'`. Tests: `scripts/check.test.mjs`.
Live runs: Claude Code 2.1.308 with `claude -p --plugin-dir` on a scratch copy of the plugin. The copy has the version 0.3.0 and the Unreleased entries as release 0.3.0. The scratch project was made from the `v0.2.0` templates, without `CHANGELOG.md`, with an ADR that has a `locked:` line and with a project command and a project rule in `AGENTS.md`.

## Code review

Reviewed: `4e485c1..259f6bb` (software engineer role, `git diff main...HEAD`)

| Finding | Fix |
|---|---|
| The Unreleased changelog listed the agent `sparc:qa-engineer` as added and as removed. It never was in a release. | 259f6bb |

Also checked without a finding: debug code, secrets, scope of the diff, the version code in `check.mjs`.

## Scenarios

| Scenario | Result | Evidence |
|---|---|---|
| Project records its sparc version: New project | manual | See "Manual checks". |
| Project records its sparc version: Project without a version | passed | Test "Project records its sparc version: Project without a version". `node --test 'scripts/*.test.mjs'`: passed. |
| Check reports an outdated project: Project is behind | passed | Test "Check reports an outdated project: Project is behind". `node --test 'scripts/*.test.mjs'`: passed. |
| Check reports an outdated project: Project is up to date | passed | Test "Check reports an outdated project: Project is up to date". `node --test 'scripts/*.test.mjs'`: passed. |
| Marked sparc text: Update keeps project text | manual | See "Manual checks". |
| Marked sparc text: Project without markers | manual | See "Manual checks". |
| Migrations from the changelog: Breaking release between the versions | manual | See "Manual checks". |
| Missing template files: File from a newer release is missing | manual | See "Manual checks". |
| Update completes with a check: Successful update | manual | See "Manual checks". |

## Manual checks

### Project records its sparc version: New project

- Reason: The scenario is the behavior of the init skill. Only a live run shows it.
- Steps: In an empty git repository, run `/sparc:init a small todo CLI` with the scratch plugin (0.3.0), steps 1 and 2 only.
- Expected result: `openspec/config.yaml` has `sparc:` with `version: 0.3.0`.
- Result: passed. The config has `version: 0.3.0`. `AGENTS.md` and `openspec/config.yaml` each have one `sparc:begin` and one `sparc:end` marker.

### Marked sparc text: Update keeps project text

- Reason: The scenario is the behavior of the update skill. Only a live run shows it.
- Steps: Run `/sparc:update` in the scratch project.
- Expected result: The project command and the project rule in `AGENTS.md` stay. The text between the markers is the current template text.
- Result: passed. "Run `make test` to test." and "- Project rule: keep functions short." stay, outside the markers. The rules between the markers are the current template rules.

### Marked sparc text: Project without markers

- Reason: As above.
- Steps: As above. The scratch project from `v0.2.0` has no markers. The approval was in the prompt.
- Expected result: The update adds the markers after the confirmation.
- Result: passed. `AGENTS.md` and `openspec/config.yaml` have the markers after the update.

### Migrations from the changelog: Breaking release between the versions

- Reason: As above.
- Steps: As above. The release 0.3.0 of the scratch plugin has the entry "Remove `--lock` calls and `locked:` lines".
- Expected result: The update removes the `locked:` line from the ADR.
- Result: passed. `docs/adr/0001-use-x.md` has no `locked:` line. The check reports no non-MADR field.

### Missing template files: File from a newer release is missing

- Reason: As above.
- Steps: As above. The scratch project has no `CHANGELOG.md`.
- Expected result: The update adds `CHANGELOG.md`.
- Result: passed. `CHANGELOG.md` exists after the update. `docs/adr/0000-template.md` is equal to the template.

### Update completes with a check: Successful update

- Reason: As above.
- Steps: As above.
- Expected result: The version is 0.3.0, the check has no version finding, and the commit `chore: Update sparc to 0.3.0` exists.
- Result: passed. Branch `chore/sparc-update-0.3.0`, commit "chore: Update sparc to 0.3.0". The check reports only the placeholders that were in the project before.

## Acceptance

Accepted on 2026-10-23 by the product owner role. The 3 automated scenarios passed. The 6 manual checks passed in the live runs, and the product owner role read their results in the scratch project. The code review has no open finding.
