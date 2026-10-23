---
status: accepted
date: 2026-10-23
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
locked: 5c8ca8290fdcb73c
---

# Prove spec scenarios with a QA engineer after implementation

## Context and Problem Statement

sparc has no agent for integration and end-to-end tests. The product owner walks through each scenario by hand at acceptance. The user wants a QA agent with automation first. Where does the QA engineer work in the sparc flow, and how does acceptance use its result?

## Considered Options

- QA after all task groups, with acceptance from the QA report
- QA before the engineers
- QA in parallel with the engineers
- No QA, the product owner walks through each scenario

## Decision Outcome

Chosen option: "QA after all task groups, with acceptance from the QA report", because the tests use real interfaces and QA runs one time for each change. The result `qa.md` is archived with the change, and the product owner checks only the manual scenarios.

### Consequences

- Good, because the tests do not guess routes, selectors or interfaces.
- Good, because acceptance does not repeat the automated checks (DRY).
- Bad, because failures come late, after all task groups.
- Bad, because the agent tools cannot stop QA from changes to product code. The agent file and the apply skill must prevent it.

### Confirmation

The apply skill starts the QA engineer after the last task group. The product owner agent accepts from `qa.md`. `claude plugin validate .` passes.

## More Information

Each project records its own integration and end-to-end test tool in its own ADR. This ADR does not choose a tool.

## Amendments

