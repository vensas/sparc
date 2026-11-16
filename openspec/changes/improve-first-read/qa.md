# QA

| Scenario | Result | Evidence |
|---|---|---|
| Backlog holds only open items: Archive removes the item | passed | "Backlog holds only open items: Archive removes the item", `node --test 'scripts/*.test.mjs'`, 147 passed, 0 failed. The test reads the archive skill and both `config.yaml` files. The archive of this change is the first live run. |
| Backlog holds only open items: Rule in the document rules | passed | "Backlog holds only open items: Rule in the document rules", `node --test 'scripts/*.test.mjs'`, 147 passed, 0 failed |
| Check reports done backlog items: Checked item | passed | "Check reports done backlog items: Checked item", `node --test 'scripts/*.test.mjs'`, 147 passed, 0 failed |
| Check reports done backlog items: Item of an archived change | passed | "Check reports done backlog items: Item of an archived change", `node --test 'scripts/*.test.mjs'`, 147 passed, 0 failed |
| Check reports done backlog items: Archived change without an item | passed | "Check reports done backlog items: Archived change without an item", `node --test 'scripts/*.test.mjs'`, 147 passed, 0 failed |
| Check reports done backlog items: Open change without an item | passed | "Check reports done backlog items: Open change without an item", `node --test 'scripts/*.test.mjs'`, 147 passed, 0 failed |
| README for a first-time reader: Key features are short | passed | "README for a first-time reader: Key features are short", `node --test 'scripts/*.test.mjs'`, 147 passed, 0 failed |
| README for a first-time reader: Files of a new project | passed | "README for a first-time reader: Files of a new project", `node --test 'scripts/*.test.mjs'`, 147 passed, 0 failed |
| README for a first-time reader: Loop of a change | passed | "README for a first-time reader: Loop of a change", `node --test 'scripts/*.test.mjs'`, 147 passed, 0 failed. Also the manual check "Diagrams render" |
| README for a first-time reader: Terms | passed | "README for a first-time reader: Terms", `node --test 'scripts/*.test.mjs'`, 147 passed, 0 failed |
| README for a first-time reader: Writing style and limits | passed | "README for a first-time reader: Writing style and limits", `node --test 'scripts/*.test.mjs'`, 147 passed, 0 failed |

## Manual checks

### Diagrams render

- Reason: a test cannot see the layout of a Mermaid diagram.
- Steps: extract the loop diagram from `README.md` and the container diagram from `docs/architecture/c4.md`. Render each with `mmdc` (Mermaid CLI 12.0.0). Look at the images.
- Expected result: each diagram renders. No label is on another label or on a box.
- Result: passed. Both diagrams render. The labels of the container diagram are apart. Some lines cross boxes, because Mermaid C4 draws straight lines. This is an open point in the canvas, together with the render on GitHub.

## Code review

Reviewed: `91719f5..fd9797c`

Context: current session (installed sparc 0.6.0 runs the review in the current session).

No findings.

## Acceptance

Accepted by the product owner from this report on 2026-11-16. No scenario failed. The code review has no open finding. The manual check "Diagrams render" passed.
