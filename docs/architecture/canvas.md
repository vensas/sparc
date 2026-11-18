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

- [project-setup](../../openspec/specs/project-setup/spec.md): `/sparc:init`, with prerequisites, template files without overwrite and the first content from evidence.
- [change-workflow](../../openspec/specs/change-workflow/spec.md): `/sparc:propose`, `/sparc:apply` and `/sparc:archive`, the life cycle of one change.
- [release-conventions](../../openspec/specs/release-conventions/spec.md): changelog, version, commit and workflow (trunk or pull request) rules, and `/sparc:release`.
- [approval](../../openspec/specs/approval/spec.md): apply and pull requests as approval, explicit approval for other decisions.
- [adr-management](../../openspec/specs/adr-management/spec.md): when to write an ADR, and the options and trade-offs of a proposed ADR. ADR status, MADR front matter, amendments, protection of decided ADRs through git history, current ADRs only and `/sparc:adr`.
- [project-update](../../openspec/specs/project-update/spec.md): project version, marked sparc text and `/sparc:update`.
- [team-roles](../../openspec/specs/team-roles/spec.md): roles as rule files, code review by the software engineer in a fresh context by default, optional fresh-context check.
- [qa-engineering](../../openspec/specs/qa-engineering/spec.md): QA engineer role, automation first, scenario report and acceptance from the QA report.
- [plugin-distribution](../../openspec/specs/plugin-distribution/spec.md): install from the marketplace at the latest release tag, CI validation, publication of releases and a README for a first-time reader.
- [change-verification](../../openspec/specs/change-verification/spec.md): the verifier blocks the stop of a complete change until its commands and spec evidence pass.
- [document-set](../../openspec/specs/document-set/spec.md): the backlog holds only open items, the check reports done items, and `/sparc:sync`.

## Key Stakeholder 🧑‍🧑‍🧒

*For whom do we create value? Who pays for development and operation? Who are the most important customers and contributors?*

- Developers at vensas who work with Claude Code.
- vensas pays for the development.

## Quality Requirements ⭐️

*Speed, scalability, reliability, usability, security, safety, capacity or similar.*

| Quality | Requirement | Measured value | How to measure |
|---|---|---|---|
| Simplicity | `/sparc:init` copies 10 template files or fewer. | 8 files | `find templates/project -type f \| wc -l` |
| Simplicity | The check and the verifier have no npm dependencies. | 0 | No `package.json`. `grep '^import' scripts/check.mjs scripts/verify.mjs` shows only `node:` modules and `./check.mjs`. |
| Speed | The check runs in 3 seconds or less on sparc. The hook stops it after 30 seconds. | 0.95 to 1.09 seconds (3 runs, Node.js 24.12.0, 2026-11-16) | `time node scripts/check.mjs` |
| Correctness | Each spec scenario of a change has evidence before the agent can stop. | The verifier blocks the stop without it. | `node --test 'scripts/*.test.mjs'`, tests of `scripts/verify.mjs` |
| Reusability | All projects get sparc from one plugin, at the latest release tag. | One marketplace entry | `.claude-plugin/marketplace.json` |

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
- [ADR-0007](../adr/0007-prove-spec-scenarios-with-a-qa-engineer-after-implementation.md): Prove spec scenarios with a QA engineer after implementation. Each change chooses a new test tool in its design (amended).
- [ADR-0008](../adr/0008-protect-decided-adrs-through-git-history.md): Protect decided ADRs through git history.
- [ADR-0009](../adr/0009-use-roles-as-rules-instead-of-subagents.md): Use roles as rules instead of subagents (superseded by ADR-0015).
- [ADR-0010](../adr/0010-record-the-sparc-version-and-mark-sparc-text-in-projects.md): Record the sparc version and mark sparc text in projects.
- [ADR-0011](../adr/0011-use-apply-and-pull-requests-as-approval.md): Use apply and pull requests as approval.
- [ADR-0012](../adr/0012-use-a-trunk-or-pull-request-workflow.md): Use a trunk or pull request workflow.
- [ADR-0013](../adr/0013-pin-the-marketplace-entry-to-the-release-tag.md): Pin the marketplace entry to the release tag.
- [ADR-0014](../adr/0014-block-the-stop-of-a-complete-change-until-its-verification-passes.md): Block the stop of a complete change until its verification passes.
- [ADR-0015](../adr/0015-use-roles-as-rules-with-a-fresh-context-code-review.md): Use roles as rules with a fresh-context code review.
- [ADR-0016](../adr/0016-mark-current-adrs-through-a-rule-and-the-canvas-index.md): Mark current ADRs through a rule and the canvas index.
- [ADR-0017](../adr/0017-keep-only-open-items-in-the-backlog.md): Keep only open items in the backlog.
- [ADR-0018](../adr/0018-package-sparc-as-one-plugin-for-claude-code-and-github-copilot-cli.md) (proposed in the change support-github-copilot): Package sparc as one plugin for Claude Code and GitHub Copilot CLI.

## Technologies 🛠️

*Important technologies for development and operation.*

- Claude Code plugins: skills and hooks.
- OpenSpec CLI 1.14.3 (tested version).
- Node.js, latest LTS version, for `scripts/check.mjs`. Tested locally with 24.12.0. CI uses `lts/*` (26.13.1 on 2026-11-18).
- Mermaid C4, MADR, ASD-STE100.
- GitHub Actions for CI and GitHub releases. `actionlint` and `act` test the workflows locally.
- Website: HTML and CSS from a Node.js build script without dependencies. nginx on Alpine serves it in a container. An Aspire 13.6.5 AppHost with `Vensas.Aspire.Hosting.Kamal` makes the Kamal 2 configuration. Only the website uses .NET, Aspire and Kamal.

## Components / Modules 🧊

See the [container diagram](c4.md#containers).

## Core Risks and Missing Information ❓

*Risks, open questions and missing information. What stops the team from faster delivery of value?*

- The full workflow (init, propose, apply, archive) has a recorded test on one sample project only.
- Most skill scenarios have a test of the skill text and no recorded run. The test proves that the skill tells the behavior, not that the agent obeys it. For 13 scenarios, `qa.md` of add-skill-specs adds evidence from the sparc history. For "Files of a QA commit", the history also shows two exceptions (see the acceptance commit type below).
- A fresh-context run of QA (not only acceptance) is not shown yet.
- The cost of the fresh-context code review is measured for one change only: 60,560 tokens and 36 seconds (fresh-context-code-review, 3 commits). Larger changes can cost more.
- A search hit in the body of a superseded ADR does not show the status. Only the rule in `AGENTS.md` tells the agent to read the status first.
- An ADR is necessary only for a decision that is central to the idea of the project. This needs judgement. No check decides it. The check finds only a `proposed` ADR without two options and their trade-offs.
- The pull request approval (review, merge, changes requested) is not tested. sparc uses the workflow `trunk`, so its own changes do not test it.
- `/sparc:update` was tested with a scratch plugin at version 0.3.0. The first real update comes after the next release.
- In auto mode, the Write tool failed for the main session and for each subagent (no verdict from the classifier). Edit and Bash worked.
- [arc42agentic](https://github.com/matthiasnissen/arc42agentic): it is not decided if sparc uses it. GitHub does not identify its license.
- The STE check finds long sentences only. It does not check the STE dictionary.
- The verifier runs the commands in `AGENTS.md`. The agent can change this file, for example rename the `Test` row, and so skip a command. The code review and the diff must show such a change.
- The OpenSpec schema commands are experimental. sparc does not use them now.
- `/sparc:apply` says that all planning artifacts must be complete and valid. It does not say if it stops or fixes the artifacts when they are not.
- `/sparc:archive` sets an ADR of the change to `rejected` if the user rejected it. No skill step tells how a user rejects an ADR of a change before the archive.
- `/sparc:archive` runs "the test commands in `AGENTS.md`". The verifier runs only the rows `Lint`, `Test` and `Verify`. The two sets of commands can differ.
- `/sparc:sync` does not report drift from work that is not complete. It does not tell how to find out that work is not complete.
- The acceptance step of `/sparc:apply` has no commit type of its own. Two `test(qa)` acceptance commits changed the canvas (`76f91df`, `f52f33b`).
- The imprint and the privacy policy of the website (change add-landing-page) have no legal review yet. The English texts are translations, and the German text is binding.
- The DNS record for `sparc.apps.vensas.de` and the repository secrets `DEPLOY_HOST`, `SSH_PRIVATE_KEY` and `SSH_KNOWN_HOSTS` do not exist yet. The operator of the server adds them. The deploy job of `.github/workflows/website.yml` has not run yet, so the QA scenario "Deploy after a change" is open.
- The request log of kamal-proxy on the server has the IP address of the visitor. It has a size limit, not a time limit. The privacy policy of the website tells this rule. A time limit for all apps on the server is a decision of the operators of the server. The nginx log of the website has no IP address.
- GitHub Copilot CLI reads sparc as a plugin in the legacy format (`.claude-plugin/`). GitHub can drop this format (ADR-0018, proposed).
- Copilot in VS Code, the GitHub Copilot app and the Copilot cloud agent are not tested with sparc (change support-github-copilot).
- In GitHub Copilot CLI 1.0.106, the warning of `scripts/check.mjs --hook` does not show. The check runs, but neither the user nor the model sees its findings. The verifier, which blocks, works.
- In GitHub Copilot CLI, each session asks for access to the folder of the plugin, because it is outside the project.
- It is not known if vensas GmbH has a data protection officer. The privacy policy of vensas names none.
- Mermaid C4 draws each relation as a straight line, so some lines cross boxes in the container diagram. Mermaid CLI 12.0.0 ignores `UpdateLayoutConfig`. Label offsets keep the labels apart. The render on GitHub is not checked yet.

---

This canvas is derived from the [Architecture Communication Canvas](https://canvas.arc42.org) and [vensas/architecture-communication-canvas-markdown](https://github.com/vensas/architecture-communication-canvas-markdown). It is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
