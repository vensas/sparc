# <picture><source media="(prefers-color-scheme: dark)" srcset="docs/assets/logo-dark.svg"><img src="docs/assets/logo-light.svg" alt="sparc" width="200"></picture>

sparc is a harness for spec-driven work with agents in Claude Code. The name comes from "spec", "arc" (architecture) and the spark of an idea.

## Overview

Agents write code fast, but the specs, the architecture and the documents fall behind. sparc adds a small team of roles, a fixed document set and a check on top of [OpenSpec](https://openspec.dev). Each change goes through propose, apply and archive. Running apply approves the change, so you do not type an approval. After each step, sparc keeps the documents in sync. For the goal and the plan, see the [backlog](docs/backlog.md).

## Key Features

- Five roles as plain rule files: product owner, architect, UX designer, software engineer and QA engineer. The skills follow them. sparc defines no agent types.
- Code review: the software engineer reviews the full change before QA. Acceptance needs a review without open findings.
- Automation first: the QA engineer proves each spec scenario with an integration or end-to-end test. The product owner accepts from its report.
- Eight skills: `/sparc:init`, `/sparc:propose`, `/sparc:apply`, `/sparc:archive`, `/sparc:sync`, `/sparc:adr`, `/sparc:release` and `/sparc:update`.
- Update path: a project records its sparc version. `/sparc:update` applies the migration steps of the changelog and replaces only the marked sparc text.
- A document set with one home for each fact: README, AGENTS.md, backlog, changelog, C4 diagrams (Mermaid), architecture canvas and ADRs (MADR).
- Release conventions: Keep a Changelog, Semantic Versioning and Conventional Commits. Each project chooses its workflow: trunk-based on the default branch, or a pull request for each change.
- ADR status rules. The check uses git history to find each change to a decided ADR.
- A check without an LLM (`scripts/check.mjs`). A Stop hook runs it and warns about document drift.
- Shared rules for all roles: ASD-STE100 writing, evidence before claims, simplicity, DRY, SOLID and good tests.

## Architecture

sparc is a Claude Code plugin. It uses the OpenSpec CLI for specs and changes and adds its rules through `openspec/config.yaml`.
For details, see the [C4 diagrams](docs/architecture/c4.md), the [architecture canvas](docs/architecture/canvas.md) and the [decisions](docs/adr/).

## Get Started

Prerequisites: Claude Code, Node.js 20 or later, git and OpenSpec (`npm install -g @fission-ai/openspec`).

### Install

The repository `vensas/sparc` is private. Git on your machine must have access to it without a prompt: a GitHub SSH key in `ssh-agent`, or `gh auth login` and then `gh auth setup-git`. Without an SSH key, set `CLAUDE_CODE_PLUGIN_PREFER_HTTPS=1`.

With the Claude Code CLI:

```sh
claude plugin marketplace add vensas/sparc
claude plugin install sparc@sparc
claude plugin list
```

In a Claude Code session, use `/plugin marketplace add vensas/sparc` and `/plugin install sparc@sparc`.

With Claude Desktop, in the **Code** tab:

1. Click **+** next to the prompt box and select **Plugins**.
2. In the plugin view, click **+** and select **Add from repo**.
3. Paste `https://github.com/vensas/sparc.git`.
4. Install `sparc` from the marketplace `sparc`. If Claude Desktop tells you to reload the plugins, run `/reload-plugins`.

The marketplace gives the latest release tag, not the newest commit on `main`.

### Update

```sh
claude plugin marketplace update sparc
claude plugin update sparc@sparc
```

Then run `/sparc:update` in each project that uses sparc.

### Use

1. Open the folder of your project (new or existing) and run `/sparc:init <project idea>`.
2. Answer the questions of the product owner: goal, stakeholders and quality requirements.
3. For each feature or fix, run `/sparc:propose <feature>`. Read the summary.
4. Run `/sparc:apply <change-id>`. This approves the change. Then run `/sparc:archive <change-id>`.
5. In the workflow `pull-request`, merge the pull request. The review or the merge is the approval. In the workflow `trunk`, the archive commit is on the default branch. Run `/sparc:release` to make a release.

Tell the project idea one time, in `/sparc:init`. Tell each feature in `/sparc:propose`:

| You tell | Skill | sparc writes it to |
|---|---|---|
| The project idea and its goal | `/sparc:init` | Backlog goal, README introduction, canvas "Value Proposition" |
| One feature or fix | `/sparc:propose` | OpenSpec change, backlog item |

For an existing code base, `/sparc:init` also documents what the architect finds in the code.

### Develop sparc

Load the plugin from your checkout and run the tests. Do not add the checkout as a marketplace for this: the marketplace installs the release tag from GitHub, not your local files.

```sh
claude --plugin-dir ~/dev/vensas/sparc
node --test 'scripts/*.test.mjs'
```

CI runs the tests, the check and the plugin validation for each push to `main` and each pull request. For each release tag, CI also makes a GitHub release with the changelog entries.

## License

[MIT](LICENSE). The canvas template in `templates/project/docs/architecture/canvas.md` is licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/).
