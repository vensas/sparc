# Architecture Communication Canvas

| System | Created by | Date / Iteration |
|---|---|---|
| sparc | vensas | 2026-11-16 / 0.6.0 |

## Value Proposition 💼

*Major objectives. What value does the system deliver? What are the major business goals?*

- Take an idea from a spark to working software with agents, in small approved steps.
- Keep specs, architecture and documents correct and in sync without manual work.
- Use one harness again in all projects.

## Core Functions 📋

*Links to the capabilities in `openspec/specs/`.*

- [release-conventions](../../openspec/specs/release-conventions/spec.md): changelog, version, commit and workflow (trunk or pull request) rules.
- [approval](../../openspec/specs/approval/spec.md): apply and pull requests as approval, explicit approval for other decisions.
- [adr-management](../../openspec/specs/adr-management/spec.md): ADR status, MADR front matter, amendments, protection of decided ADRs through git history, and current ADRs only.
- [project-update](../../openspec/specs/project-update/spec.md): project version, marked sparc text and the update skill.
- [team-roles](../../openspec/specs/team-roles/spec.md): roles as rule files, code review by the software engineer in a fresh context by default, optional fresh-context check.
- [qa-engineering](../../openspec/specs/qa-engineering/spec.md): QA engineer role, automation first, scenario report and acceptance from the QA report.
- [plugin-distribution](../../openspec/specs/plugin-distribution/spec.md): install from the marketplace at the latest release tag, CI validation and publication of releases.
- [change-verification](../../openspec/specs/change-verification/spec.md): the verifier blocks the stop of a complete change until its commands and spec evidence pass.
- The other functions have no spec yet. They are the [skills](../../skills/): init, propose, apply, archive, sync, adr, release and update.

## Key Stakeholder 🧑‍🧑‍🧒

*For whom do we create value? Who pays for development and operation? Who are the most important customers and contributors?*

- Developers at vensas who work with Claude Code.
- vensas pays for the development.

## Quality Requirements ⭐️

*Speed, scalability, reliability, usability, security, safety, capacity or similar.*

- Simplicity: few files, no runtime dependencies in the check.
- Correctness: each role writes only facts with evidence.
- Reusability: one plugin for all projects, updated through the marketplace.

## Business Context 🔗

See the [system context diagram](c4.md#system-context).

## Core Decisions - Good or Bad 🚦

*One line and a link for each ADR in `docs/adr/`.*

- [ADR-0001](../adr/0001-extend-openspec-through-config-not-a-forked-schema.md): Extend OpenSpec through `config.yaml`, not through a forked schema.
- [ADR-0002](../adr/0002-package-sparc-as-a-claude-code-plugin.md): Package sparc as a Claude Code plugin with its own marketplace.
- [ADR-0003](../adr/0003-use-mermaid-for-c4-diagrams.md): Use Mermaid for C4 diagrams.
- [ADR-0004](../adr/0004-lock-decided-adrs-with-a-body-hash.md): Lock decided ADRs with a body hash (superseded by ADR-0008).
- [ADR-0005](../adr/0005-hook-warns-and-does-not-block.md): The hook warns and does not block. It warns one time for the same findings (amended).
- [ADR-0006](../adr/0006-use-keep-a-changelog-semver-and-conventional-commits.md): Use Keep a Changelog, SemVer and Conventional Commits with pull requests (superseded by ADR-0012).
- [ADR-0007](../adr/0007-prove-spec-scenarios-with-a-qa-engineer-after-implementation.md): Prove spec scenarios with a QA engineer after implementation.
- [ADR-0008](../adr/0008-protect-decided-adrs-through-git-history.md): Protect decided ADRs through git history.
- [ADR-0009](../adr/0009-use-roles-as-rules-instead-of-subagents.md): Use roles as rules instead of subagents (superseded by ADR-0015).
- [ADR-0010](../adr/0010-record-the-sparc-version-and-mark-sparc-text-in-projects.md): Record the sparc version and mark sparc text in projects.
- [ADR-0011](../adr/0011-use-apply-and-pull-requests-as-approval.md): Use apply and pull requests as approval.
- [ADR-0012](../adr/0012-use-a-trunk-or-pull-request-workflow.md): Use a trunk or pull request workflow.
- [ADR-0013](../adr/0013-pin-the-marketplace-entry-to-the-release-tag.md): Pin the marketplace entry to the release tag.
- [ADR-0014](../adr/0014-block-the-stop-of-a-complete-change-until-its-verification-passes.md): Block the stop of a complete change until its verification passes.
- [ADR-0015](../adr/0015-use-roles-as-rules-with-a-fresh-context-code-review.md): Use roles as rules with a fresh-context code review.
- [ADR-0016](../adr/0016-mark-current-adrs-through-a-rule-and-the-canvas-index.md): Mark current ADRs through a rule and the canvas index.
- [ADR-0017](../adr/0017-keep-only-open-items-in-the-backlog.md): Keep only open items in the backlog (proposed).

## Technologies 🛠️

*Important technologies for development and operation.*

- Claude Code plugins: skills and hooks.
- OpenSpec CLI 1.14.3 (tested version).
- Node.js 20 or later for `scripts/check.mjs` (tested with 24.12.0).
- Mermaid C4, MADR, ASD-STE100.
- GitHub Actions for CI and GitHub releases. `actionlint` and `act` test the workflows locally.

## Components / Modules 🧊

See the [container diagram](c4.md#containers).

## Core Risks and Missing Information ❓

*Risks, open questions and missing information. What stops the team from faster delivery of value?*

- A live test (Claude Code 2.1.308) showed that the agent gets the hook warning and replies one time. The hook warns again only when the findings change.
- Propose, apply and archive were tested on sparc itself (changes add-qa-engineer, remove-adr-lock-hash, replace-agents-with-roles). The full workflow (init, propose, apply, archive) was tested on a sample project.
- A fresh-context run of QA (not only acceptance) is not shown yet.
- The cost of the fresh-context code review is measured for one change only: 60,560 tokens and 36 seconds (fresh-context-code-review, 3 commits). Larger changes can cost more.
- A search hit in the body of a superseded ADR does not show the status. Only the rule in `AGENTS.md` tells the agent to read the status first.
- The pull request approval (review, merge, changes requested) is not tested. sparc uses the workflow `trunk`, so its own changes do not test it.
- `/sparc:update` was tested with a scratch plugin at version 0.3.0. The first real update comes after the next release.
- In auto mode, the Write tool failed for the main session and for each subagent (no verdict from the classifier). Edit and Bash worked.
- [arc42agentic](https://github.com/matthiasnissen/arc42agentic): it is not decided if sparc uses it. GitHub does not identify its license.
- The STE check finds long sentences only. It does not check the STE dictionary.
- A live test (Claude Code 2.1.x) showed that the verifier blocks 3 times, then releases one time. Each hook output to the agent makes the agent reply again, so the verifier is silent after the release.
- The verifier runs the commands in `AGENTS.md`. The agent can change this file, for example rename the `Test` row, and so skip a command. The code review and the diff must show such a change.
- The OpenSpec schema commands are experimental. sparc does not use them now.

---

This canvas is derived from the [Architecture Communication Canvas](https://canvas.arc42.org) and [vensas/architecture-communication-canvas-markdown](https://github.com/vensas/architecture-communication-canvas-markdown). It is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
