# Design

## Context

See proposal.md for the reason. `.claude-plugin/marketplace.json` has one entry `sparc` with the source `./`. `.claude-plugin/plugin.json` has the version. `/sparc:release` sets the version in the manifest and in "each other version file of the project", then tags the release commit. The tags `v0.1.0` to `v0.5.0` exist. The repository has no `.github/` folder. The repository `vensas/sparc` is private.

The [Claude Code marketplace reference](https://code.claude.com/docs/en/plugins/marketplace-reference.md#plugin-sources) allows a `github` plugin source with `repo` and `ref` (a branch or a tag). [Host and maintain a marketplace](https://code.claude.com/docs/en/plugins/host-marketplace.md#release-a-new-version) tells that users get a new copy only when the plugin version changes, and that `plugin.json` has precedence over the marketplace entry.

## Goals / Non-Goals

**Goals:**
- No CI job writes to `main`. The release commit is the only commit that changes the marketplace entry.
- One script verifies the release values. The tests and the publication workflow use the same script.

**Non-Goals:**
- A version field in the marketplace entry. `plugin.json` keeps the version.

## Decisions

- **Pin the entry to the release tag.** The entry becomes `{"source": "github", "repo": "vensas/sparc", "ref": "v<version>"}`. See [ADR-0013](../../../docs/adr/0013-pin-the-marketplace-entry-to-the-release-tag.md). Alternatives: a `stable` branch that CI moves to each tag, or a CI commit on `main` after the tag. Rejected, because both need a CI job that writes to the repository, and the `stable` branch changes the add command of the users.
- **Set the ref in the release commit.** `/sparc:release` already sets "each other version file". The project rules in `AGENTS.md` of sparc name the marketplace `ref` as a version file and tell to push with `git push --atomic origin main v<version>`. The tag then exists when `main` points to it. `/sparc:release` and the release rule do not change, because other projects do not publish a plugin.
- **Release verification script.** `scripts/verify-release.mjs <tag>` reads `plugin.json`, `marketplace.json` and `CHANGELOG.md`. It exits with 1 and names each value that differs. It prints the changelog section of the release to a file for the release notes. It has no dependencies, as `check.mjs`. Alternative: shell steps with `jq` in the workflow. Rejected, because shell steps have no unit tests.
- **Two workflows.** `.github/workflows/validate.yml` runs on `push` to `main` and on `pull_request`. `.github/workflows/publish.yml` runs on `push` of tags `v*.*.*`. The publication job calls the validation workflow as a reusable workflow (`workflow_call`), so the checks are in one place. Then it runs the verification script and `gh release create <tag> --notes-file <file> --verify-tag` with `GITHUB_TOKEN` and `contents: write`.
- **Checks in CI.** Node.js 24 (the tested version in the canvas). `actions/checkout` with `fetch-depth: 0`, because the check reads the commits since the last tag. `claude plugin validate .` runs with the Claude Code CLI from npm (`@anthropic-ai/claude-code`).
- **README.** One install section with the CLI commands, the Claude Desktop steps, the update commands and `claude --plugin-dir .` for development. It follows the structure of the vensas Copilot plugin README.

C4 impact: a new container "CI workflows" (GitHub Actions YAML) in the sparc boundary, with a relation to the external system GitHub ("Tests and publishes releases on"). Claude Code gets the relation "Installs the release tag from" GitHub.

Test tools:
- Unit tests: `node --test 'scripts/*.test.mjs'` (node:test). The tests of `verify-release.mjs` use temporary folders, as the existing tests do.
- Workflow lint: `actionlint` (1.7.12, installed).
- Workflow runs: `act` (0.2.89, installed, needs Docker) runs the jobs on the local machine. `act push -W .github/workflows/validate.yml` for the validation. For the publication, `act push` with a tag event file. The step `gh release create` is skipped under `act` (`if: ${{ !env.ACT }}`).
- The first real publication is the next release of sparc. The QA report records it as a manual check.

## Risks / Trade-offs

- [`claude plugin validate .` needs a login on the CI runner] → Task 2.1 runs it under `act` without a login. If it needs one, the validation workflow skips the step and the canvas gets the open point.
- [The atomic push is forgotten and `main` points to a missing tag] → The rule in `AGENTS.md` tells the command. A user who installs in this time gets an error, not a wrong version. The next push of the tag repairs it.
- [A private repository] → Users need git access to `vensas/sparc`. The README tells how (`gh auth login` and `gh auth setup-git`, or an SSH key).
- [A marketplace added from a local folder installs the tag from GitHub, not the local files] → The README tells to use `claude --plugin-dir .` for development.

## Migration Plan

Task 1.1 sets the `ref` to `v0.5.0`, the latest release. Existing installs have the version 0.5.0 and get no new copy. The next release (0.6.0) is the first one that the publication workflow publishes. Rollback: set the source back to `./`.
