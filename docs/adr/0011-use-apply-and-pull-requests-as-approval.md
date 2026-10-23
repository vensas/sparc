---
status: proposed
date: 2026-10-23
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Use apply and pull requests as approval

## Context and Problem Statement

Each change waited for a "yes" in the chat before `/sparc:apply`. The user already decides when they run `/sparc:apply`. With pull requests, the review is the natural approval, but GitHub does not let the author approve their own pull request. What counts as the approval of a change?

## Considered Options

- Apply approves the change. With pull requests, a review with `APPROVED` or the merge approves it.
- A "yes" in the chat, a pull request review or the label `sparc:approved`
- A draft pull request after propose, and apply waits for its approval

## Decision Outcome

Chosen option: "Apply approves the change. With pull requests, a review with `APPROVED` or the merge approves it", because it removes the extra message. It also works for a solo user. The user chose this option.

### Consequences

- Good, because the user does not type "approve" for a change.
- Good, because the pull request is the only review gate when a project uses pull requests.
- Bad, because a merge without review counts as approval. Branch protection on GitHub can prevent this.
- Bad, because ADR amendments, release versions and update plans still need an explicit approval. They are separate decisions.

### Confirmation

`rules/approval.md` and the skills `propose`, `apply` and `archive` follow this decision.

## More Information

ADR-0006 still requires a pull request for each change when a project uses pull requests.

## Amendments

