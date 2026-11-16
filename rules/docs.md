# Rule: Documents and sync

A sparc project has these documents. Each fact has one home. Other documents link to it.

| Document | Path | Owner | Home of |
|---|---|---|---|
| README | `README.md` | architect | Introduction, overview, key features, architecture summary, get started |
| Agent guide | `AGENTS.md` | architect | Commands, structure and rules for agents |
| Backlog | `docs/backlog.md` | product owner | Goal and the list of items to get there |
| C4 diagrams | `docs/architecture/c4.md` | architect | System context and containers (Mermaid C4) |
| Canvas | `docs/architecture/canvas.md` | architect | Architecture Communication Canvas, open risks and missing information |
| ADRs | `docs/adr/NNNN-*.md` | architect | Decisions, see `adr.md` |
| Mockups | `docs/mockups/<change>/` | UX designer | Static HTML/CSS mockups |
| Changelog | `CHANGELOG.md` | product owner | Released and unreleased changes, see `release.md` |
| Specs | `openspec/specs/` | product owner | Required behavior (OpenSpec) |
| Changes | `openspec/changes/` | product owner | Proposals, deltas, designs, tasks (OpenSpec) |

## Links instead of copies

- README "Architecture" gives 3 sentences or fewer. It links to the C4 diagrams, the canvas and the ADRs.
- Canvas "Business Context" links to the C4 context diagram. It does not have its own diagram.
- Canvas "Components / Modules" links to the C4 container diagram.
- Canvas "Core Decisions" lists ADR links with one line for each.
- Canvas "Core Functions" links to the capabilities in `openspec/specs/`.
- Backlog items link to OpenSpec changes. Task details stay in `tasks.md` of the change.

## People

- Name a person only by the GitHub handle with a link: `[@handle](https://github.com/handle)`.
- Do not write real names or e-mail addresses of persons in documents.
- If you do not know the handle of a person, ask the user.

## Backlog format

```md
## Goal

<the main idea of the project in 1 to 3 sentences>

## Items

- [ ] <item> (change: <change-id>)
- [ ] <idea without a change yet>
```

- The backlog holds only items that are not done. The changelog is the home of done work.
- An item with a change is done when the change is archived. Then remove the item.
- An item without a change is done when the user confirms it. Then remove the item.

## Sync triggers

| Event | Update |
|---|---|
| Change proposed | Backlog (add or link item), ADRs (`proposed`) |
| Design adds or removes an actor, external system, container or relation | C4 diagrams, canvas |
| Task done | Only documents that the task changed |
| Change archived | Changelog (Unreleased), backlog (remove item), README key features, ADRs (`accepted`), canvas, AGENTS.md if commands or structure changed |
| Setup or commands change | README "Get started", AGENTS.md |
| New risk or open question | Canvas "Core Risks and Missing Information" |

## Check

- Run `node "<sparc>/scripts/check.mjs"` after each step. Fix each finding or tell the user why it stays.
- The Stop hook runs the same check and warns. It does not block.
