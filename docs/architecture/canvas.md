# Architecture Communication Canvas

| System | Created by | Date / Iteration |
|---|---|---|
| sparc | vensas | 2026-10-22 / 0.1.0 |

## Value Proposition 💼

*Major objectives. What value does the system deliver? What are the major business goals?*

- Take an idea from a spark to working software with agents, in small approved steps.
- Keep specs, architecture and documents correct and in sync without manual work.
- Use one harness again in all projects.

## Core Functions 📋

*Links to the capabilities in `openspec/specs/`.*

- [release-conventions](../../openspec/specs/release-conventions/spec.md): changelog, version, commit and pull request rules.
- [qa-engineering](../../openspec/specs/qa-engineering/spec.md): QA engineer, automation first, scenario report and acceptance from the QA report.
- The other functions have no spec yet. They are the [skills](../../skills/): init, propose, apply, archive, sync, adr and release.

## Key Stakeholder 🧑‍🧑‍🧒

*For whom do we create value? Who pays for development and operation? Who are the most important customers and contributors?*

- Developers at vensas who work with Claude Code.
- vensas pays for the development.

## Quality Requirements ⭐️

*Speed, scalability, reliability, usability, security, safety, capacity or similar.*

- Simplicity: few files, no runtime dependencies in the check.
- Correctness: agents write only facts with evidence.
- Reusability: one plugin for all projects, updated through the marketplace.

## Business Context 🔗

See the [system context diagram](c4.md#system-context).

## Core Decisions - Good or Bad 🚦

*One line and a link for each ADR in `docs/adr/`.*

- [ADR-0001](../adr/0001-extend-openspec-through-config-not-a-forked-schema.md): Extend OpenSpec through `config.yaml`, not through a forked schema.
- [ADR-0002](../adr/0002-package-sparc-as-a-claude-code-plugin.md): Package sparc as a Claude Code plugin with its own marketplace.
- [ADR-0003](../adr/0003-use-mermaid-for-c4-diagrams.md): Use Mermaid for C4 diagrams.
- [ADR-0004](../adr/0004-lock-decided-adrs-with-a-body-hash.md): Lock decided ADRs with a body hash.
- [ADR-0005](../adr/0005-hook-warns-and-does-not-block.md): The hook warns and does not block. It warns one time for the same findings (amended).
- [ADR-0006](../adr/0006-use-keep-a-changelog-semver-and-conventional-commits.md): Use Keep a Changelog, SemVer and Conventional Commits with pull requests.
- [ADR-0007](../adr/0007-prove-spec-scenarios-with-a-qa-engineer-after-implementation.md): Prove spec scenarios with a QA engineer after implementation.

## Technologies 🛠️

*Important technologies for development and operation.*

- Claude Code plugins: agents, skills, hooks.
- OpenSpec CLI 1.14.3 (tested version).
- Node.js 20 or later for `scripts/check.mjs` (tested with 24.12.0).
- Mermaid C4, MADR, ASD-STE100.

## Components / Modules 🧊

See the [container diagram](c4.md#containers).

## Core Risks and Missing Information ❓

*Risks, open questions and missing information. What stops the team from faster delivery of value?*

- A live test (Claude Code 2.1.308) showed that the agent gets the hook warning and replies one time. The hook warns again only when the findings change.
- Propose, apply and archive were tested with the sparc agents on sparc itself (change add-qa-engineer). `/sparc:init` was not tested on a sample project.
- In auto mode, the Write tool failed for the main session and for each subagent (no verdict from the classifier). Edit and Bash worked.
- [arc42agentic](https://github.com/matthiasnissen/arc42agentic): it is not decided if sparc uses it. GitHub does not identify its license.
- The STE check finds long sentences only. It does not check the STE dictionary.
- The OpenSpec schema commands are experimental. sparc does not use them now.
- It is not tested that a plugin agent can preload skills or that a skill can name a plugin agent in its `agent` field. sparc does not use these features now.

---

This canvas is derived from the [Architecture Communication Canvas](https://canvas.arc42.org) and [vensas/architecture-communication-canvas-markdown](https://github.com/vensas/architecture-communication-canvas-markdown). It is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
