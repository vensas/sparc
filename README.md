# sparc

sparc is a harness for spec-driven work with agents in Claude Code. The name comes from "spec", "arc" (architecture) and the spark of an idea.

## Overview

Agents write code fast, but the specs, the architecture and the documents fall behind. sparc adds a small team of agents, a fixed document set and a check on top of [OpenSpec](https://openspec.dev). Each change goes through propose, approve, apply and archive. After each step, sparc keeps the documents in sync. For the goal and the plan, see the [backlog](docs/backlog.md).

## Key Features

- Four agents: product owner, architect, UX designer and software engineer (start 1 to n in parallel).
- Six skills: `/sparc:init`, `/sparc:propose`, `/sparc:apply`, `/sparc:archive`, `/sparc:sync` and `/sparc:adr`.
- A document set with one home for each fact: README, AGENTS.md, backlog, C4 diagrams (Mermaid), architecture canvas and ADRs (MADR).
- ADR status rules with a lock. The check finds each change to the body of a decided ADR.
- A check without an LLM (`scripts/check.mjs`). A Stop hook runs it and warns about document drift.
- Shared rules for all agents: ASD-STE100 writing, evidence before claims, simplicity, DRY, SOLID and good tests.

## Architecture

sparc is a Claude Code plugin. It uses the OpenSpec CLI for specs and changes and adds its rules through `openspec/config.yaml`.
For details, see the [C4 diagrams](docs/architecture/c4.md), the [architecture canvas](docs/architecture/canvas.md) and the [decisions](docs/adr/).

## Get Started

Prerequisites: Claude Code, Node.js 20 or later, git and OpenSpec (`npm install -g @fission-ai/openspec`).

1. Add the marketplace in Claude Code: `/plugin marketplace add vensas/sparc`.
2. Install the plugin: `/plugin install sparc@sparc`.
3. Open your project and run `/sparc:init <short idea>`.
4. Start a change: `/sparc:propose <idea>`. Approve it, then run `/sparc:apply <change-id>` and `/sparc:archive <change-id>`.

To work on sparc itself, load the plugin from the folder and run the tests:

```sh
claude --plugin-dir ~/dev/vensas/sparc
node --test 'scripts/*.test.mjs'
```

## License

[MIT](LICENSE). The canvas template in `templates/project/docs/architecture/canvas.md` is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
