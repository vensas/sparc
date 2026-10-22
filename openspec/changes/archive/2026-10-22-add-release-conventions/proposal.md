## Why

Software artifacts need a clear history and a clear version. Projects with sparc do not keep a changelog yet. They do not use a fixed version scheme, and agents can commit directly on `main`. Backlog item: "Release conventions: changelog, SemVer, Conventional Commits and pull requests".

## What Changes

- Add the rule `rules/release.md`: Keep a Changelog 1.1.0, Semantic Versioning 2.0.0, Conventional Commits 1.0.0 and pull requests for all changes.
- Add `CHANGELOG.md` to the project templates.
- Extend `scripts/check.mjs`: check the changelog format, the version in the manifest, the commit messages on the branch and work on the default branch.
- Change the skills: `propose` creates a branch, `apply` makes Conventional Commits, `archive` writes the changelog entry and opens the pull request.
- Add the skill `/sparc:release`: it calculates the next version, moves the "Unreleased" entries into a release and updates the manifest.
- Use the same conventions in the sparc repository: `CHANGELOG.md`, version `0.1.0` in `plugin.json`.

Out of scope:

- Git hooks that block commits (`commit-msg`). The sparc hook only warns (ADR-0005).
- Automatic publication of releases, tags on a remote, or CI pipelines.
- Version files other than `package.json` and `.claude-plugin/plugin.json`.

## Capabilities

### New Capabilities

- `release-conventions`: changelog, version, commit and pull request rules that sparc applies and checks in a project.

### Modified Capabilities

None.

## Impact

- Files: `rules/`, `skills/`, `scripts/check.mjs`, `templates/project/`, `docs/`, `CHANGELOG.md`.
- New ADR-0006.
- No new dependencies.
