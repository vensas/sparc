## Context

See proposal.md, "Why". The user decided in the chat on 2026-11-18: "switch to deploy on release". `publish.yml` runs on each tag `v*.*.*`: it calls `validate.yml`, verifies the release with `scripts/verify-release.mjs` and creates the GitHub release with the `GITHUB_TOKEN`.

GitHub does not start a new workflow run for an event that the `GITHUB_TOKEN` caused, except `workflow_dispatch` and `repository_dispatch` (https://docs.github.com/en/actions/security-for-github-actions/security-guides/automatic-token-authentication, read on 2026-11-18). So a trigger `release: published` in `website.yml` never runs for a release that `publish.yml` creates.

## Goals / Non-Goals

**Goals:**
- The site changes only with a verified release, or by hand.
- The tests of the site still run on each push and pull request.

**Non-Goals:**
- A second site for work in progress.

## Decisions

ADRs: none. The trigger of a deployment is not central to the idea of sparc (see `rules/adr.md`).

- **Trigger.** `publish.yml` gets a job `website` with `needs: publish` that calls `website.yml` (`uses: ./.github/workflows/website.yml`, `secrets: inherit`, `permissions: contents: read, packages: write`). `website.yml` gets the trigger `workflow_call`. Its job `deploy` runs only when `github.event_name == 'workflow_dispatch'` or `startsWith(github.ref, 'refs/tags/v')`. In a called workflow, `github.event_name` and `github.ref` are the values of the caller, so a push to `main` (`refs/heads/main`) only tests. Options: a trigger `push: tags` in `website.yml` (rejected: it deploys also when the release verification fails, because the two workflows run side by side), `release: published` (rejected: it does not run for a release that the `GITHUB_TOKEN` created, see Context).
- **Test of the site in the release.** The called workflow runs its job `test` before `deploy`, so the release tests the site again for the tagged commit.
- **Manual start.** `workflow_dispatch` stays. It deploys the commit that the maintainer selects, normally `main`. The site can then show work after the last release. This is the accepted way for an urgent fix.
- **act.** The job `deploy` has secrets and pushes to the registry. A local run with act of `publish.yml` stops before the deploy (`if: ${{ !env.ACT }}`, as the step that creates the GitHub release).
- **Test tool.** `node --test 'scripts/*.test.mjs'` (node:test) checks the triggers, the job conditions and the call in the workflow files: the workflows are the interface of this behavior. `actionlint` checks the workflow syntax. The scenarios "Deploy after a release" and "Manual start" need the real GitHub runners and the server: manual checks in `qa.md` at the release of 0.9.0.

## C4 impact

- The relation from the CI workflows to the server: "Deploys the website with Kamal to" becomes "Deploys the website after a release with Kamal to".

## Risks / Trade-offs

- [An urgent fix of a legal text waits for a release] → The manual start deploys at once.
- [A manual start deploys work after the last release] → Accepted. The maintainer chooses the commit.
- [The release takes longer, because it builds, scans and deploys the site] → Accepted. The plugin release is created before the deploy, so a failed deploy does not stop the release.

## Migration Plan

1. Apply the change before the next push to `main`, because the current workflow deploys on that push.
2. The first deploy runs with the release 0.9.0, or by hand.
Rollback: revert the commits of the change.
