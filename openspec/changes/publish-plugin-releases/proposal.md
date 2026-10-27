# Proposal

## Why

Users install sparc from the marketplace in this repository. The marketplace entry has the source `./`, so a new install gets the head of `main`, also with commits that are not released. No CI tests the plugin, and a release tag makes no GitHub release. The [vensas Copilot plugin](https://github.com/vensas/vensas-github-copilot-plugin#claude-code-plugin-installation) shows the install steps for the Claude Code CLI and Claude Desktop. The sparc README shows only the CLI steps.

Backlog item: "Publish released versions to the marketplace with CI (change: publish-plugin-releases)" in [docs/backlog.md](../../../docs/backlog.md).

## What Changes

- The marketplace entry of sparc points to the latest release tag (`vX.Y.Z`). Users get only released versions.
- The release of sparc sets the tag in the marketplace entry. It pushes the release commit and the tag together.
- A GitHub Actions workflow runs on each push to `main` and on each pull request. It runs the tests, the sparc check and the plugin validation.
- A GitHub Actions workflow runs on the push of a `vX.Y.Z` tag. It makes sure that the tag, the manifest version, the marketplace entry and the latest changelog release are equal. It runs the same checks. Then it makes a GitHub release with the changelog section as notes.
- The README tells how to install, update and test sparc locally with the CLI and with Claude Desktop.

Out of scope:

- The vensas organization marketplace (`vensas-marketplace`). sparc keeps its own marketplace.
- GitHub releases for the tags v0.1.0 to v0.5.0.
- Release channels (for example `stable` and `latest`).
- A change of `/sparc:release` or of the release rule for other projects. Only sparc publishes a plugin.
- The submission to the Anthropic plugin directory.

## Capabilities

### New Capabilities

- `plugin-distribution`: how users install sparc, which version the marketplace gives, and the CI that tests and publishes a release.

### Modified Capabilities

## Impact

- `.claude-plugin/marketplace.json`, new `.github/workflows/`, a new release verification script in `scripts/` with tests, `README.md`, `AGENTS.md`.
- Not breaking. The install commands stay the same: `/plugin marketplace add vensas/sparc` and `/plugin install sparc@sparc`.
- To develop sparc, use `claude --plugin-dir .`. A marketplace that you add from a local folder also installs the release tag from GitHub.
