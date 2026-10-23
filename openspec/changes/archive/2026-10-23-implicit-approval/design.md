## Context

See proposal.md for the reason. `rules/approval.md` lists three kinds of approval (chat, pull request review, label). `/sparc:propose` ends with a question, and `/sparc:apply` checks for an approval. ADR-0006 requires pull requests for all changes. GitHub does not let the author of a pull request approve it.

## Goals / Non-Goals

**Goals:**
- No extra approval message for a change.
- One clear approval signal with pull requests, also for a solo user.

**Non-Goals:**
- Trunk-based work. That is a separate backlog item.

## Decisions

- **Signal without pull requests.** The command `/sparc:apply <id>` is the approval. The user runs it only after reading the proposal summary. Alternative: keep the chat "yes". Rejected by the user.
- **Signal with pull requests.** One pull request for each change, opened by archive. A review with `APPROVED` or the merge is the approval. Alternative: a draft pull request after propose. Rejected by the user, because it gives two review rounds.
- **ADR status.** Archive sets the `proposed` ADRs of the change to `accepted`. With pull requests, this status reaches the default branch only through the approved or merged pull request. If the pull request is closed without merge, the ADRs stay `proposed` on the default branch.
- **Explicit decisions.** ADR amendments keep an explicit approval, because the user requires it for each amendment. Release versions and update plans keep it, because they are separate decisions with effect on users.
- **Label.** `sparc:approved` is removed. The merge replaces it.
- **Mockups.** The approval of the change also approves its mockups. The UX designer role shows the mockups in the propose summary.

ADR: `docs/adr/0011-use-apply-and-pull-requests-as-approval.md`.
C4 impact: none. The external system "GitHub" already gives approvals through pull requests.
Test tool: `node --test 'scripts/*.test.mjs'` (node:test, see `AGENTS.md`). Tests check the rule and skill text. The behavior of apply without a question is shown when this change is applied.

## Risks / Trade-offs

- [A user runs apply by mistake] → Apply works on a change branch. The user can stop and drop the branch.
- [A merge without review in a team] → Branch protection on GitHub can require reviews. This is out of scope.
