# sparc

sparc is a harness for spec-driven work with agents in Claude Code. The name comes from "spec", "arc" (architecture) and the spark of an idea.

## Overview

Agents write code fast, but the specs, the architecture and the documents fall behind. sparc adds a small team of roles, a fixed document set and a check on top of [OpenSpec](https://openspec.dev). Each change goes through propose, approve, apply and archive. After each step, sparc keeps the documents in sync. For the goal and the plan, see the [backlog](docs/backlog.md).

## Key Features

- Five roles as plain rule files: product owner, architect, UX designer, software engineer and QA engineer. The skills follow them in the current session, without subagents.
- Code review: the software engineer reviews the full change before QA. Acceptance needs a review without open findings.
- Automation first: the QA engineer proves each spec scenario with an integration or end-to-end test. The product owner accepts from its report.
- Seven skills: `/sparc:init`, `/sparc:propose`, `/sparc:apply`, `/sparc:archive`, `/sparc:sync`, `/sparc:adr` and `/sparc:release`.
- A document set with one home for each fact: README, AGENTS.md, backlog, changelog, C4 diagrams (Mermaid), architecture canvas and ADRs (MADR).
- Release conventions: Keep a Changelog, Semantic Versioning, Conventional Commits and a pull request for each change.
- ADR status rules. The check uses git history to find each change to a decided ADR.
- A check without an LLM (`scripts/check.mjs`). A Stop hook runs it and warns about document drift.
- Shared rules for all roles: ASD-STE100 writing, evidence before claims, simplicity, DRY, SOLID and good tests.

## Architecture

sparc is a Claude Code plugin. It uses the OpenSpec CLI for specs and changes and adds its rules through `openspec/config.yaml`.
For details, see the [C4 diagrams](docs/architecture/c4.md), the [architecture canvas](docs/architecture/canvas.md) and the [decisions](docs/adr/).

## Get Started

Prerequisites: Claude Code, Node.js 20 or later, git and OpenSpec (`npm install -g @fission-ai/openspec`).

1. Add the marketplace in Claude Code: `/plugin marketplace add vensas/sparc`.
2. Install the plugin: `/plugin install sparc@sparc`.
3. Open the folder of your project (new or existing) and run `/sparc:init <project idea>`.
4. Answer the questions of the product owner: goal, stakeholders and quality requirements.
5. For each feature or fix, run `/sparc:propose <feature>`. Approve the change.
6. Run `/sparc:apply <change-id>`, then `/sparc:archive <change-id>`.
7. Merge the pull request. Run `/sparc:release` to make a release.

Tell the project idea one time, in `/sparc:init`. Tell each feature in `/sparc:propose`:

| You tell | Skill | sparc writes it to |
|---|---|---|
| The project idea and its goal | `/sparc:init` | Backlog goal, README introduction, canvas "Value Proposition" |
| One feature or fix | `/sparc:propose` | OpenSpec change, backlog item |

For an existing code base, `/sparc:init` also documents what the architect finds in the code.

To work on sparc itself, load the plugin from the folder and run the tests:

```sh
claude --plugin-dir ~/dev/vensas/sparc
node --test 'scripts/*.test.mjs'
```

## License

[MIT](LICENSE). The canvas template in `templates/project/docs/architecture/canvas.md` is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
