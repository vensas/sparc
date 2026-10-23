## Context

See proposal.md for the reason. `openspec/config.yaml` already has the key `sparc` with `version` outside the sparc markers (ADR-0010). The check has `defaultBranch()` and `checkGit()`. ADR-0006 requires pull requests for all changes. ADR-0011 makes `/sparc:apply` the approval without pull requests.

## Goals / Non-Goals

**Goals:**
- One setting that each skill and the check read.
- Conventional Commits stay checked in both workflows.

**Non-Goals:**
- Automatic detection of solo or team work.

## Decisions

- **Setting.** `sparc.workflow` in `openspec/config.yaml`, next to `sparc.version`, outside the markers. The check reads it with a regular expression, as it reads the version. Default `pull-request`. Alternative: detect the workflow from `git remote`. Rejected, because a solo project can have a remote.
- **One home for the workflow steps.** `rules/release.md` gets a section "Workflow" that tells what each workflow does: branch, commit, merge, pull request, tag. Each skill step that makes a branch or a pull request says "in the workflow `pull-request` only" and links the rule. Alternative: both paths in each skill. Rejected (DRY).
- **Commit check in trunk.** The range is `<last tag>..HEAD` on the default branch (`git describe --tags --abbrev=0`). Without a tag, all commits. The check reads the tag with the existing `git()` helper. Alternative: no commit check in trunk. Rejected, because the release skill needs Conventional Commits to calculate the version.
- **Init.** It asks "alone or in a team?" in the questions of step 3, and writes the choice. For a team, it keeps the step that makes `chore/sparc-init`.
- **sparc itself.** `openspec/config.yaml` of sparc gets `sparc:` → `workflow: trunk`. The rule in `AGENTS.md` of sparc says "Commit on main (workflow trunk)".
- **ADR.** ADR-0012 supersedes ADR-0006. It keeps Keep a Changelog, SemVer and Conventional Commits, and makes pull requests a choice of the project. ADR-0011 stays valid.

C4 impact: none.
Test tool: `node --test 'scripts/*.test.mjs'` (node:test, see `AGENTS.md`). Git tests make temporary repositories, as the existing branch tests do.

## Risks / Trade-offs

- [A team project sets `trunk` by mistake] → Init suggests `pull-request` for a team. The setting is visible in `openspec/config.yaml`.
- [Old commits before the first tag in trunk] → The check reports all commits without a tag. A project can make a first tag to start the range.
