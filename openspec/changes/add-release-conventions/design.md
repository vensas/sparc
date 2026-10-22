## Context

See proposal.md for the reason. sparc already has `scripts/check.mjs` (no dependencies) and a Stop hook that warns (ADR-0005).

## Goals / Non-Goals

**Goals:**
- One rule file for all release conventions. Skills and agents link to it.
- Deterministic checks in `check.mjs` for format, version, commits and branch.

**Non-Goals:**
- Blocking git hooks.
- Support for each package manager.

## Decisions

- **Home of the version:** the manifest (`package.json` or `.claude-plugin/plugin.json`) holds the version. The changelog holds the history. The check compares the two. Alternative: a separate `VERSION` file. Rejected, because it adds a third place.
- **Default branch:** the check uses `origin/HEAD` if it exists, else `main`, else `master`. Alternative: a setting. Rejected, because no setting is necessary now.
- **Commit check scope:** only commits in `<default>..HEAD`. Commits on the default branch are history and stay unchanged.
- **Version bump:** the release skill uses the Conventional Commit types: breaking change gives major, `feat` gives minor, other types give patch. Before 1.0.0, a breaking change gives minor. The skill shows the proposed version and asks for approval.
- **Changelog owner:** the product owner, because entries are for users of the software.
- **Pull request:** `archive` opens the pull request with `gh pr create` if a remote exists. Else it tells the user that the branch is ready.

ADR: `docs/adr/0006-use-keep-a-changelog-semver-and-conventional-commits.md`.
C4 impact: no change to actors, systems or containers. The container "Skills" gets the release skill.

## Risks / Trade-offs

- [Squash merges change commit headers] → The pull request title must also be a Conventional Commit header. The rule says so.
- [Other version files (for example `.csproj`)] → Out of scope. The rule tells the agent to keep them equal by hand.
