# Changelog

All notable changes to this project are in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- The website of sparc at https://sparc.apps.vensas.de: a landing page, an imprint and a privacy policy in English and German. It sets no cookies and loads nothing from other servers. An nginx container serves it, and Kamal deploys it ([add-landing-page](openspec/changes/archive/2026-11-18-add-landing-page/proposal.md)).

### Changed

- sparc recommends the latest Node.js LTS version and does not name a version number. `/sparc:init` stops only when Node.js is not installed. It does not stop because of the Node.js version ([use-node-lts](openspec/changes/archive/2026-11-18-use-node-lts/proposal.md)).

## [0.8.0] - 2026-11-16

### Added

- Specs for the skills that had no spec. The new capabilities `project-setup` (`/sparc:init`) and `change-workflow` (`/sparc:propose`, `/sparc:apply`, `/sparc:archive`) specify their current behavior. `document-set`, `adr-management`, `release-conventions` and `project-update` get the requirements of `/sparc:sync`, `/sparc:adr`, `/sparc:release` and `/sparc:update`. A test for each new scenario reads the skill text. No skill behavior changes ([add-skill-specs](openspec/changes/archive/2026-11-16-add-skill-specs/proposal.md)).
- The check reports a `proposed` ADR with fewer than two options in "Considered Options". It also reports an option without a good and a bad trade-off in "Pros and Cons of the Options". The ADR template tells this rule. `/sparc:update` brings the new template ([raise-the-adr-threshold](openspec/changes/archive/2026-11-16-raise-the-adr-threshold/proposal.md)).

### Changed

- The architect writes an ADR only for a major decision: it is central to the idea of the project, and the team chose between two or more real options. Each other decision stays in `design.md` of its change, with its options and reason. Conventions, document formats and check behavior go in specs and rules. Existing ADRs do not change ([raise-the-adr-threshold](openspec/changes/archive/2026-11-16-raise-the-adr-threshold/proposal.md)).
- A new test tool needs no project ADR. The change chooses it in `design.md`, and `/sparc:apply` approves it. ADR-0007 is amended to tell this.

## [0.7.0] - 2026-11-16

### Added

- A verifier hook for a change with all tasks checked. The agent cannot stop until the `Lint`, `Test` and `Verify` commands of the project pass. Each spec scenario must have evidence in `qa.md`, and each task must name its verification. After 3 blocks in a row, the failed checks become open points ([add-verifier-hook](openspec/changes/archive/2026-11-16-add-verifier-hook/proposal.md)).
- The `AGENTS.md` template has a commands table with the rows `Lint`, `Test` and `Verify`. To use the verifier in an existing project, add these rows to the commands table in `AGENTS.md`.
- The tasks rule tells each task to name its verification with `Verify:`. `/sparc:update` adds the rule.
- The README tells where to write project requirements, for example data protection rules.
- `/sparc:apply` has the argument `inline-review`. With it, the code review runs in the current session.
- A rule for current ADRs in `rules/adr.md` and in the sparc text of `AGENTS.md`. Agents follow only `accepted` and `amended` ADRs, and a `proposed` ADR only in its own change. For a superseded ADR, they follow the `superseded by` chain. `/sparc:update` adds the rule ([ignore-superseded-adrs](openspec/changes/archive/2026-11-16-ignore-superseded-adrs/proposal.md)).
- The check reports each ADR that has no line in the canvas section "Core Decisions". It also reports a line of a superseded, deprecated or rejected ADR without its status. In an existing project, add the missing lines to the canvas.
- The check reports each superseded, deprecated or rejected ADR in the ADR list (`ADRs:`) of the design of an open change. The design rule tells to start the ADR list with `ADRs:`. `/sparc:update` adds the rule.
- The README introduces sparc to a first-time reader. It tells the value first and has five key features. The section "How It Works" shows the loop of a change, the files of a project, the terms, the limits and the cost ([improve-first-read](openspec/changes/archive/2026-11-16-improve-first-read/proposal.md)).

### Changed

- **Breaking:** The backlog holds only open items. `/sparc:archive` removes the item of the change, and the changelog has the done work. The check reports each checked item and each item of an archived change. Remove the done items from `docs/backlog.md` ([improve-first-read](openspec/changes/archive/2026-11-16-improve-first-read/proposal.md)).
- By default, `/sparc:apply` runs the code review in a general-purpose subagent in a fresh context. The subagent does not get the conversation. It only reports findings, and the main session fixes them. If the subagent cannot start, the review runs in the current session ([fresh-context-code-review](openspec/changes/archive/2026-11-16-fresh-context-code-review/proposal.md)).
- The code review gets the commit range of the change also in the workflow `trunk`. `## Code review` in `qa.md` has a `Context:` line.

## [0.6.0] - 2026-10-27

### Added

- CI tests sparc on each push to `main` and on each pull request: tests, document check and plugin validation ([publish-plugin-releases](openspec/changes/archive/2026-10-27-publish-plugin-releases/proposal.md)).
- CI makes a GitHub release for each release tag, with the changelog entries as notes. It stops when the tag, the manifest, the marketplace entry and the changelog do not name the same release.
- The README tells how to install and update sparc with the Claude Code CLI and with Claude Desktop. It also tells how to get access to the private repository.

### Changed

- The marketplace gives the latest release of sparc, not the newest commit on `main`. The install commands stay the same.

## [0.5.0] - 2026-10-25

### Changed

- The skills and rules no longer forbid subagents and worktrees. They also do not tell the agent to use them. By default, the roles run in the current session ([allow-subagents](openspec/changes/archive/2026-10-25-allow-subagents/proposal.md)).

## [0.4.0] - 2026-10-23

### Added

- A logo in the README for the light and dark theme, and a plugin icon ([add-sparc-logo](openspec/changes/archive/2026-10-23-add-sparc-logo/proposal.md)).
- Workflow `trunk`: a project can commit each change on the default branch, without a branch or a pull request. `/sparc:init` asks if you work alone or in a team and writes `sparc.workflow` ([trunk-based-workflow](openspec/changes/archive/2026-10-23-trunk-based-workflow/proposal.md)).
- In the workflow `trunk`, the check tests the Conventional Commits headers since the last release tag.

### Changed

- Running `/sparc:apply` approves the change, its proposed ADRs and its mockups. `/sparc:propose` and `/sparc:apply` do not ask for an approval message ([implicit-approval](openspec/changes/archive/2026-10-23-implicit-approval/proposal.md)).
- With pull requests, a review with `APPROVED`, or the merge, approves the change. For a solo user, the merge counts.

### Removed

- **Breaking:** The label `sparc:approved` is no approval any more. A project that uses it must approve or merge the pull request instead. Run `/sparc:update` to get the new rule text in `AGENTS.md`.

## [0.3.0] - 2026-10-23

### Added

- The QA engineer role proves the spec scenarios of a change with integration and end-to-end tests, automation first ([add-qa-engineer](openspec/changes/archive/2026-10-23-add-qa-engineer/proposal.md)).
- The file `qa.md` in each change holds the result of each scenario and the manual checks.
- Code review: the software engineer role reviews the full change before QA and records the result in `qa.md`. Acceptance needs a review without open findings ([replace-agents-with-roles](openspec/changes/archive/2026-10-23-replace-agents-with-roles/proposal.md)).
- `/sparc:apply <id> fresh-context` runs QA and acceptance in a general-purpose subagent that follows the role files.
- `/sparc:update` updates a project to the installed sparc version. It applies the project steps of the breaking changelog entries and replaces only the marked sparc text ([add-update-path](openspec/changes/archive/2026-10-23-add-update-path/proposal.md)).
- A project records its sparc version in `openspec/config.yaml`. The check reports a project that is not at the installed version.

### Changed

- **Breaking:** The check protects decided ADRs through git history. It compares each decided ADR with its first committed decided version ([remove-adr-lock-hash](openspec/changes/archive/2026-10-23-remove-adr-lock-hash/proposal.md)). A project must commit each decided ADR.
- The check also protects `decision-makers`, `consulted`, `informed` and committed amendments of a decided ADR.
- The check reports ADR front matter fields that are not in MADR, and decided ADRs in a project without git.
- `/sparc:apply` runs the QA engineer after the task groups. The product owner accepts from `qa.md` and does only the manual checks.
- `/sparc:propose` names the integration or end-to-end test tool of the project, or proposes an ADR for it.
- `/sparc:archive` runs the test commands in `AGENTS.md`.
- **Breaking:** The agents are now role files in `rules/roles/`, and a QA engineer role is new. The skills follow them in the current session, without subagents and worktrees. A project needs no step.
- `/sparc:init` puts the sparc text of `AGENTS.md` and `openspec/config.yaml` between `sparc:begin` and `sparc:end` markers. Put project rules outside the markers.

### Removed

- **Breaking:** The option `--lock` of `check.mjs` and the ADR front matter field `locked`. Remove `--lock` calls and `locked:` lines.
- **Breaking:** The agent types `sparc:product-owner`, `sparc:architect`, `sparc:ux-designer` and `sparc:software-engineer`. A project that starts them by name must use the skills.

### Fixed

- The check no longer reports long sentences in decided ADRs, because they must not change ([skip-ste-check-for-decided-adrs](openspec/changes/archive/2026-10-23-skip-ste-check-for-decided-adrs/proposal.md)).

## [0.2.0] - 2026-10-22

### Added

- Release conventions: Keep a Changelog, Semantic Versioning, Conventional Commits and pull requests for each project ([add-release-conventions](openspec/changes/archive/2026-10-22-add-release-conventions/proposal.md)).
- `CHANGELOG.md` in the project templates.
- The check finds changelog format errors and a manifest version that is not equal to the latest release.
- The check finds commits without a Conventional Commits header and changes on the default branch.
- The skill `/sparc:release` makes a release with the next semantic version.

### Changed

- `/sparc:propose` makes a change branch. `/sparc:apply` commits each task. `/sparc:archive` writes the changelog entries and opens the pull request.
- The README tells that you give the project idea in `/sparc:init` and each feature in `/sparc:propose`.

### Fixed

- The check no longer stops with an error when Node.js runs it without a script path.

## [0.1.0] - 2026-10-22

### Added

- First version of sparc: four agents, six skills, shared rules, project templates, a document check and a Stop hook that warns.
