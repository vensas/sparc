## Why

`/plugin update` updates the sparc skills, rules, roles, check and hooks. It does not update the files that `/sparc:init` copied into a project: the rules in `AGENTS.md`, the sparc rules in `openspec/config.yaml` and the ADR template. Breaking releases also need changes in the project, for example the removal of `locked:` lines in the release after 0.2.0. A project does not record the sparc version that it is up to date with. So a project with sparc cannot get to a newer version in a safe way. Backlog item: "Update path for projects that already use sparc".

## What Changes

- A project records its sparc version in `openspec/config.yaml` (`sparc:` → `version:`). `/sparc:init` writes the installed version. A project without this key has the version 0.1.0.
- `/sparc:init` puts the sparc text in `AGENTS.md` and in `openspec/config.yaml` between `sparc:begin` and `sparc:end` markers. The ADR template `docs/adr/0000-template.md` is a sparc file as a whole.
- The check reports one finding when the project version is not the installed sparc version.
- New skill `/sparc:update`:
  - It reads the breaking entries in the sparc `CHANGELOG.md` between the project version and the installed version, and applies their migration steps after the user approves.
  - It replaces the text between the markers and the sparc files with the current templates. It keeps all text outside the markers.
  - For a project without markers, it shows the difference, and adds the markers after the user confirms.
  - It adds template files that do not exist. It does not overwrite a file.
  - It sets the project version, runs the check and commits as the release rule tells.
- The release rule: each breaking changelog entry tells what a project must do.

Out of scope:

- Downgrade to an older sparc version.
- Automatic updates without the user.
- Updates of OpenSpec itself. `openspec update` does this.
- The version check in the sparc repository itself. Its version is the plugin version.

## Capabilities

### New Capabilities

- `project-update`: the project version, the marked sparc blocks, the version finding of the check and the update skill.

### Modified Capabilities

None.

## Impact

- `templates/project/AGENTS.md`, `templates/project/openspec/config.yaml`.
- `skills/init/SKILL.md`, new `skills/update/SKILL.md`.
- `scripts/check.mjs` and its tests.
- `rules/release.md`.
- Documents: README, AGENTS.md, C4 diagrams, canvas, CHANGELOG.
