# Tasks

## 1. Deploy on release

- [x] 1.1 In `.github/workflows/website.yml`, add the trigger `workflow_call` and run the job `deploy` only for `workflow_dispatch` or a tag ref `refs/tags/v*`. In `.github/workflows/publish.yml`, add the job `website` that calls `website.yml` after the job `publish`, with `secrets: inherit` and `packages: write`, and skip its deploy under act. Verify: `node --test 'scripts/*.test.mjs'` passes with tests for "Deploy after a change", "Deploy after a release" and "Failed release verification" (the triggers, the `needs` chain and the job condition in the workflow files), `actionlint` passes, and `act push -W .github/workflows/website.yml --container-architecture linux/arm64 -j test` passes. Documents: AGENTS.md (CI row), README.md ("Develop sparc"), C4 (relation label), canvas (the deploy check runs at the release).

## Workflow follow-up

- At the release of 0.9.0: watch the job `website` of the workflow `Publish` and record "Deploy after a release" in `qa.md`. Start the workflow `Website` by hand one time and record "Manual start".
