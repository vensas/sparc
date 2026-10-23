## Why

sparc requires a work branch and a pull request for each change (ADR-0006). For a solo project, this adds a branch, a merge and often a pull request without a reviewer. Trunk-based work on the default branch is simpler for such projects. Backlog item: "Trunk-based workflow on the default branch".

## What Changes

- A project records its workflow in `openspec/config.yaml` (`sparc:` → `workflow: trunk` or `workflow: pull-request`). A project without the key uses `pull-request`, so existing projects do not change.
- `/sparc:init` asks if the user works alone or in a team. It suggests `trunk` for a solo user and `pull-request` for a team, and writes the choice.
- In the workflow `trunk`, the skills commit on the default branch. They make no branch and no pull request. `/sparc:archive` ends with its commit on the default branch. `/sparc:release` commits and tags on the default branch.
- In the workflow `trunk`, the check does not warn about changes on the default branch. It checks the Conventional Commits headers of the commits on the default branch since the last release tag.
- The release rule describes both workflows in one section. The skills link to it.
- sparc itself uses the workflow `trunk`.
- A new ADR supersedes ADR-0006, because ADR-0006 requires pull requests for all changes.

Out of scope:

- A change of the workflow of an existing project. The user edits the key.
- Branch protection on GitHub.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `release-conventions`: a new requirement for the workflow setting, and changed requirements for commit messages and pull requests.

## Impact

- `rules/release.md`, `scripts/check.mjs` and its tests.
- Skills: `init`, `propose`, `archive`, `release`, `update`.
- `templates/project/openspec/config.yaml`, the sparc block of `templates/project/AGENTS.md`, `openspec/config.yaml` and `AGENTS.md` of sparc.
- Documents: README, canvas, CHANGELOG, ADRs.
