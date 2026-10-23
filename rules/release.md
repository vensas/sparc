# Rule: Versions, changelog, commits and workflow

## Changelog

Keep `CHANGELOG.md` in the [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) format.

- Keep the section `## [Unreleased]` at the top.
- Write a release heading as `## [X.Y.Z] - YYYY-MM-DD`. Put the latest release first.
- Use only these types of change as `###` headings: Added, Changed, Deprecated, Removed, Fixed, Security.
- Write each entry for the users of the software, not for the developers. Link the OpenSpec change if there is one.
- Write the entries of a change when the change is archived. The product owner owns the changelog.
- Start each entry for a breaking change with `**Breaking:**`. Tell in the same entry what a project must do (for example "Remove `locked:` lines"). `/sparc:update` applies these steps.

## Version

Use [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html): `MAJOR.MINOR.PATCH`.

| Change since the last release | Next version |
|---|---|
| Breaking change (`!` in the header or a `BREAKING CHANGE:` footer) | MAJOR + 1 (before 1.0.0: MINOR + 1) |
| `feat` | MINOR + 1 |
| All other types | PATCH + 1 |

- The manifest (`package.json` or `.claude-plugin/plugin.json`) holds the version. Its version must be equal to the latest release in the changelog.
- If the project has other version files (for example `.csproj`), keep them equal to the manifest.
- Only the release skill changes the version.

## Commits

Write each commit message in the [Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) format:

```text
<type>(<scope>): <subject>

<body>

<footer>
```

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`.
- Write the subject in the imperative. Write 72 characters or fewer in the header.
- Make one commit for one logical step. The tests must pass after each commit.
- Mark a breaking change with `!` after the type or scope and a `BREAKING CHANGE:` footer.

## Workflow

The project chooses its workflow in `openspec/config.yaml`, as `workflow` under `sparc`: `trunk` or `pull-request`. Without the key, the workflow is `pull-request`.

### Workflow `trunk`

- Commit each step on the default branch. Do not make a branch. Do not open a pull request.
- `/sparc:apply` approves the change (see `approval.md`). The archive commit on the default branch completes it.
- Tag a release on the default branch after the release commit.

### Workflow `pull-request`

- Do not commit on the default branch. Exception: the first commit of a new repository.
- Make a branch for each OpenSpec change: `<type>/<change-id>` (for example `feat/add-csv-export`).
- Merge each branch through a pull request. The pull request title is a Conventional Commit header, because a squash merge uses it.
- The pull request description links the OpenSpec change and lists the changelog entries.
- If the repository has no remote, keep the branch. Tell the user that the pull request is open work.
- Tag a release on the merge commit after the merge.
