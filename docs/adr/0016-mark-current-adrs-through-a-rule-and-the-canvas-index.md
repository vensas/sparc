---
status: proposed
date: 2026-11-16
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Mark current ADRs through a rule and the canvas index

## Context and Problem Statement

The body of a decided ADR does not change ([ADR-0008](0008-protect-decided-adrs-through-git-history.md)). The status is only in the front matter. A superseded ADR stays in `docs/adr/` with its full text. An agent that finds this text can follow a decision that is not valid now. How does an agent know which ADRs are current, and how does sparc keep this information correct?

## Decision Drivers

- The protection of decided ADRs stays as it is.
- Links to ADRs stay valid.
- The solution is simple and the check stays without dependencies.

## Considered Options

- Rule and canvas index: a rule for current ADRs in `rules/adr.md` and `AGENTS.md`, and a check of the ADR index in the canvas
- A fixed notice line at the top of the body of a superseded ADR, which the check permits
- A subfolder for superseded, deprecated and rejected ADRs
- Only a rule

## Decision Outcome

Chosen option: "Rule and canvas index", because `AGENTS.md` is in the context of each session, and the canvas already lists each ADR with its status. The check makes this index correct. The decided ADRs and all links stay unchanged.

### Consequences

- Good, because no decided ADR changes, and no link breaks.
- Good, because the check finds a missing or wrong line in the index.
- Bad, because the agent must obey the rule. A grep hit in a superseded ADR still does not show the status.
- Bad, because projects whose canvas does not list each ADR get new findings.

### Confirmation

`scripts/check.test.mjs` tests the index findings. A test reads the rule in `rules/adr.md` and in the `AGENTS.md` template. A live test asks an agent about a decision that a superseded ADR made.

## Pros and Cons of the Options

### A fixed notice line in the body

- Good, because each read of the file shows the notice.
- Bad, because it weakens the protection of decided ADRs: the check must permit one change in the body.
- Bad, because the front matter already shows the status at the same place.

### A subfolder for old ADRs

- Good, because a search in `docs/adr/` finds fewer old decisions.
- Bad, because links to the old ADRs break, and the check must read two folders for the numbers.

### Only a rule

- Good, because it is the smallest change.
- Bad, because nothing keeps the index correct.

## More Information

Change: `ignore-superseded-adrs`.

## Amendments

<!-- Add approved additions here after the decision. See the sparc ADR rule. -->
