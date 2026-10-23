---
name: archive
description: Archive a completed OpenSpec change, update the main specs, check the backlog item, accept the ADRs and bring all sparc documents in sync.
argument-hint: "<change-id>"
disable-model-invocation: true
---

# sparc archive

Archive the change: $ARGUMENTS

1. Run `openspec status --change <id>`. All tasks in `tasks.md` must be checked. If not, stop and report the open tasks.
2. Run the test commands in `AGENTS.md`. These include the QA tests. If a test fails, stop and report it.
3. Run `openspec archive <id> --yes`. Read the output. Make sure that the main specs changed as the deltas say.
4. In `docs/backlog.md`, check the item `(change: <id>)`.
5. As the product owner role (`${CLAUDE_PLUGIN_ROOT}/rules/roles/product-owner.md`), add the entries of the change to `## [Unreleased]` in `CHANGELOG.md` (see ${CLAUDE_PLUGIN_ROOT}/rules/release.md).
6. For each ADR of the change with the status `proposed`: set it to `accepted`, because `/sparc:apply` approved it. If the user rejected it, set it to `rejected`. The archive commit protects the decision.
7. Use the sparc sync skill for README key features, the canvas, the C4 diagrams and AGENTS.md.
8. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs`. A finding can stay only with a reason that you tell the user.
9. Commit: `docs(openspec): Archive <id>`.
10. Open the pull request:
    1. Run `git remote`. If there is no remote, stop. Tell the user that the branch is ready for a pull request.
    2. Run `git push -u origin <branch>`.
    3. Run `gh pr create`. The title is a Conventional Commit header for the whole change. The description links the change and lists the changelog entries.
11. Report the pull request link and the check result. Tell the user that a review with `APPROVED`, or the merge, is the approval of the change (see ${CLAUDE_PLUGIN_ROOT}/rules/approval.md). If a review asks for changes, go back to `/sparc:apply`. After the merge, `/sparc:release` makes a release.
