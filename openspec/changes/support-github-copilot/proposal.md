## Why

sparc names itself a Claude Code plugin, and the README, the manifest, the website and ADR-0002 say so. Teams that use GitHub Copilot cannot use sparc. A test on 2026-11-18 with GitHub Copilot CLI 1.0.106 showed that Copilot CLI already loads the sparc plugin from `.claude-plugin/` and runs its Claude-format `Stop` hook. Two parts break: Copilot does not replace `${CLAUDE_PLUGIN_ROOT}` and `$ARGUMENTS` in skill text (details and evidence in design.md).

## What Changes

- sparc is a plugin for coding agents. The supported agents are Claude Code and GitHub Copilot CLI.
- One source for both agents: the skills, rules, roles, templates, hooks and scripts stay in one place. No copies for Copilot.
- The skills name their files by a path relative to the skill folder (`../../rules/...`) instead of `${CLAUDE_PLUGIN_ROOT}/...`. Both agents resolve this path.
- The skills read the request of the user also when `$ARGUMENTS` is not replaced.
- The README tells how to install, start and update sparc in each agent, and lists what does not work or is not tested with Copilot.
- The manifest description, the README positioning and the website say "plugin for coding agents" and name both agents.
- The website gets an agent switch "Claude Code | GitHub Copilot" for the install commands (mockup in `docs/mockups/support-github-copilot/`). Its FAQ answer about other agents changes, in English and German.
- New ADR-0018 supersedes ADR-0002 at the archive.
- C4: GitHub Copilot is a new agent system next to Claude Code.

Out of scope:

- Copilot in VS Code and the Copilot cloud agent. The README names them as not tested. New open points in the canvas.
- Other coding agents (Cursor, Codex, Gemini CLI and others). New backlog item.
- A separate manifest or marketplace for Copilot. Copilot CLI reads the files in `.claude-plugin/`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plugin-distribution`: install instructions for both agents, a supported-agents section with limits, skills that work in each supported agent (paths relative to the skill folder, input without `$ARGUMENTS`), a manifest description without one agent name.
- `team-roles`: the scenario "No custom agent types" names both agents.
- `website`: first viewport with the agent switch, a FAQ answer about other agents.

## Impact

- `skills/*/SKILL.md` (all 8 skills), `.claude-plugin/plugin.json` (description), `README.md`, `website/` (texts, layout of the install block, script), `docs/adr/0018-*.md`, `docs/adr/0002-*.md` (status at archive), `docs/architecture/c4.md`, `docs/architecture/canvas.md`, `docs/backlog.md`, `PRODUCT.md`, the tests in `scripts/`.
- Users of Claude Code see no change in behavior. The skill names stay `/sparc:<skill>`.
