---
status: proposed
date: 2026-10-23
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Protect decided ADRs through git history

## Context and Problem Statement

ADR-0004 protects a decided ADR with a body hash in the front matter field `locked`. Git history already records each version of an ADR, and the field is not part of the MADR front matter. How does sparc protect a decided ADR without a field that is not in MADR?

## Considered Options

- Compare with the first committed version that has a decided status
- Keep the body hash in the field `locked`
- No automatic protection, review of the diff only

## Decision Outcome

Chosen option: "Compare with the first committed version that has a decided status", because git already holds the data and the ADR files stay in the MADR format. The user chose this option.

### Consequences

- Good, because there is no `--lock` step and no field outside MADR.
- Good, because the check also protects `decision-makers`, `consulted`, `informed` and committed amendments.
- Bad, because a project without git loses the protection. The check reports this.
- Bad, because the protection starts only with the first commit of the decision.

### Confirmation

`scripts/check.mjs` reports each change to a decided ADR. The tests in `scripts/check.test.mjs` cover each scenario of the `adr-management` spec.

## More Information

Supersedes [ADR-0004](0004-lock-decided-adrs-with-a-body-hash.md).

## Amendments

