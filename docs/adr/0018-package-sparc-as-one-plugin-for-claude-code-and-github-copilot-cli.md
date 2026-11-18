---
status: proposed
date: 2026-11-18
decision-makers: ["[@sventropy](https://github.com/sventropy)"]
consulted: []
informed: []
---

# Package sparc as one plugin for Claude Code and GitHub Copilot CLI

## Context and Problem Statement

ADR-0002 packages sparc as a Claude Code plugin. Teams that use GitHub Copilot cannot use it. GitHub Copilot CLI reads plugins in the Claude Code format (`.claude-plugin/marketplace.json`, `.claude-plugin/plugin.json`, `skills/`, `hooks/hooks.json`). A test on 2026-11-18 with Copilot CLI 1.0.106 loaded sparc and ran its `Stop` hook. It also showed that Copilot does not replace `${CLAUDE_PLUGIN_ROOT}` and `$ARGUMENTS` in skill text. The design of the change support-github-copilot has the evidence.

## Decision Drivers

- One source for skills, rules, roles, templates, hooks and scripts (DRY).
- No change in behavior for Claude Code users.
- Support only what a test shows.

## Considered Options

- One plugin in the Claude Code format for both agents
- A second package for Copilot in the Agent Plugins 1.0 layout
- Skills only, installed with `gh skill`

## Decision Outcome

Chosen option: "One plugin in the Claude Code format for both agents", because Copilot CLI already reads this format. The only gaps are two text variables, and a neutral wording closes them.

### Consequences

- Good, because one release reaches both agents through one marketplace.
- Good, because Claude Code users see no change. The skill names stay `/sparc:<skill>`.
- Bad, because sparc depends on the compatibility of Copilot CLI with the Claude Code format. A change in Copilot can break sparc without a change in sparc.
- Bad, because `claude plugin validate` checks only the Claude Code side. Copilot has no validate command, so a smoke test must check it.

### Confirmation

The tests check that no skill text has `${CLAUDE_PLUGIN_ROOT}` and that each relative path in a skill exists. The QA of the change runs Copilot CLI with `--plugin-dir` and checks the skill list and the `Stop` hook.

## Pros and Cons of the Options

### One plugin in the Claude Code format for both agents

- Good, because the files exist one time only.
- Bad, because Copilot reads the Claude Code files as a "legacy" plugin format, which GitHub can drop later.

### A second package for Copilot in the Agent Plugins 1.0 layout

- Good, because it uses the format that GitHub names as current (`plugin.json` at the root, Copilot parts in `com.github.copilot/`).
- Bad, because a second manifest and a second hook file must stay equal to the Claude Code files. Also, a manifest at the root changes the layout for Claude Code.

### Skills only, installed with `gh skill`

- Good, because it needs no plugin support in the agent.
- Bad, because the hooks do not come with it, so the check and the verifier do not run.

## More Information

Supersedes ADR-0002 when the change support-github-copilot is archived. Sources: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference and https://docs.github.com/en/copilot/reference/hooks-reference (read on 2026-11-18).

## Amendments

<!-- Add approved additions here after the decision. See the sparc ADR rule. -->
