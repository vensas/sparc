## Why

Today each change waits for a "yes" in the chat before `/sparc:apply`. The user already shows the decision when they run `/sparc:apply`, so the extra "approve" message only adds a step. With pull requests, the review of the pull request is the natural approval. On GitHub, the author of a pull request cannot approve it, so a solo user needs a different signal. Backlog item: "Approval through apply and pull requests".

## What Changes

- Without pull requests: when the user runs `/sparc:apply <id>`, this approves the change and its `proposed` ADRs. `/sparc:propose` shows the summary and the next step, and does not ask for a "yes".
- With pull requests: `/sparc:apply` also runs without a gate. `/sparc:archive` opens one pull request with the plan, the code and the ADRs. A review with the state `APPROVED`, or the merge of the pull request, is the sparc approval. For a solo user, the merge counts.
- If a review asks for changes, the work goes back to `/sparc:apply`. The ADRs reach the default branch only with the approved or merged pull request.
- Other decisions still need an explicit approval in the chat or on the pull request: The acceptance, rejection, amendment, deprecation or supersede of an ADR outside a change, the release version, the update plan and ADR-0001 in `/sparc:init`.
- The label `sparc:approved` is removed as an approval.
- A new ADR records the decision.

Out of scope:

- Trunk-based work without branches. It is a separate backlog item.
- Branch protection settings on GitHub.

## Capabilities

### New Capabilities

- `approval`: what counts as approval of a change, with and without pull requests, and which decisions still need an explicit approval.

### Modified Capabilities

None.

## Impact

- `rules/approval.md`, `rules/roles/ux-designer.md`.
- Skills: `propose`, `apply`, `archive`.
- `templates/project/AGENTS.md` (sparc block), `AGENTS.md`, `README.md`, `CHANGELOG.md`.
