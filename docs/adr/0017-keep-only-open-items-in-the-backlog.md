---
status: accepted
date: 2026-11-16
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Keep only open items in the backlog

## Context and Problem Statement

The sparc backlog format keeps done items with a checked box, and archive checks the item of a change. The changelog also lists each done change. Thus the done work has two homes. In sparc, the backlog has 20 done items and 4 open items, so a reader does not see the plan. Some done items are not correct now, because a later change replaced them. Where does the done work stay, and what does the backlog hold?

## Decision Drivers

- One home for each fact (DRY).
- A first-time reader sees the plan in the backlog.
- The document check finds drift without an LLM.

## Considered Options

- The backlog holds only open items. Archive removes the item. The changelog is the home of done work.
- The backlog keeps done items in a separate section "Done".
- Keep the format: open and done items in one list.

## Decision Outcome

Chosen option: "The backlog holds only open items", because it gives each done change one home and shows only the plan. The user asked for this rule.

Archive removes the item of the change. The user confirms an item without a change as done, and then the product owner removes it. The document check reports each checked item and each item of an archived change. It still reports each open change without an item.

### Consequences

- Good, because done work has one home: the changelog, with a link to the archived change.
- Good, because the backlog shows only the plan.
- Bad, because existing projects must remove their done items. The check finds them, and the changelog has a migration step.
- Bad, because the backlog loses the order in which items were done. The changelog and git history keep it.

### Confirmation

`scripts/check.test.mjs` tests the scenarios of the requirement "Check reports done backlog items". The sparc backlog has no checked item.

## Pros and Cons of the Options

### The backlog holds only open items

- Good, because there is one home for done work.
- Bad, because of the migration for existing projects.

### A separate section "Done"

- Good, because the backlog shows the plan first.
- Bad, because done work still has two homes.

### Keep the format

- Good, because there is no migration.
- Bad, because done work has two homes, and the done items hide the plan.

## More Information

Change: `improve-first-read`.

## Amendments

<!-- Add approved additions here after the decision. See the sparc ADR rule. -->
