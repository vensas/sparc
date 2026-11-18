## Context

See proposal.md, "Why". The user decided in the chat: support GitHub Copilot CLI only (not VS Code, not the cloud agent), and an agent switch for the install commands on the website.

Evidence from the GitHub docs (read on 2026-11-18):

- Plugins and marketplaces: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference. Copilot CLI looks for `marketplace.json` also in `.claude-plugin/`, and for a legacy plugin manifest also in `.claude-plugin/plugin.json`. Legacy plugins have `skills/` and the hooks in a root `hooks.json` or in `hooks/`.
- Plugin concepts and surfaces: https://docs.github.com/en/copilot/concepts/agents/about-plugins. Plugins install in Copilot CLI, VS Code and the GitHub Copilot app; the cloud agent configures plugins in the repository settings.
- Hooks: https://docs.github.com/en/copilot/reference/hooks-reference. `agentStop` with `decision: "block"` and a `reason` continues the turn. After 8 blocks in a row, the CLI ends the turn. Hooks run in Copilot CLI and in the cloud agent. VS Code is not named.
- Skills: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills. A user starts a skill with `/` and its name. The page names only the frontmatter fields `name`, `description`, `license` and `allowed-tools`.
- Instructions and subagents: https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions and https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli. Copilot CLI reads `AGENTS.md`. Its task tool starts subagents, and the general-purpose subagent gets the repository instructions.

Evidence from a test on 2026-11-18 with GitHub Copilot CLI 1.0.106 (`copilot --plugin-dir <sparc> ...` in an empty git repository):

- `copilot plugin list` shows "sparc (v0.8.0)" under "External Plugins (via --plugin-dir)".
- The model sees only the skills `adr` and `sync`. The other six skills have `disable-model-invocation: true`, so only the user can start them. The model sees the skill names with the prefix (`sparc:probe`).
- A Claude-format `Stop` hook in `hooks/hooks.json` runs at the end of each turn. Its input has `hook_event_name: "Stop"`, `cwd` and `transcript_path`. Copilot sets `CLAUDE_PLUGIN_ROOT` and `COPILOT_PLUGIN_ROOT` to the plugin folder for the hook command.
- In skill text, Copilot does not replace `${CLAUDE_PLUGIN_ROOT}` and `$ARGUMENTS`. The model sees them as literal text.
- A path relative to the folder of the `SKILL.md` (`../../.claude-plugin/plugin.json`) works: the model read the right file.
- Not tested: a slash command in an interactive session (`/sparc:propose` or `/propose`), `SubagentStop`, the output of `scripts/check.mjs --hook` in Copilot, the fresh-context code review with a Copilot subagent.

## Goals / Non-Goals

**Goals:**
- sparc works in Claude Code and in GitHub Copilot CLI from one source.
- Each claim of support in the README has a test or a manual check.

**Non-Goals:**
- Copilot in VS Code, the GitHub Copilot app and the Copilot cloud agent.
- Other coding agents.
- A Copilot-specific manifest, agent or hook file.

## Decisions

ADRs: ADR-0018 (proposed) supersedes ADR-0002 at the archive. It is the major decision of this change: how sparc is packaged for two agents.

- **Package.** One plugin in the Claude Code format for both agents (ADR-0018). Options: a second package in the Agent Plugins 1.0 layout, skills only with `gh skill`. See the ADR.
- **Paths in skills.** Each skill names a plugin file by its path relative to the folder of the `SKILL.md`, for example `../../rules/roles/architect.md`. This replaces the 49 uses of `${CLAUDE_PLUGIN_ROOT}` in the 8 skills. Claude Code tells the model the base folder of a skill when it loads the skill, and the Copilot test above read a relative path. Options: keep `${CLAUDE_PLUGIN_ROOT}` with a note for Copilot (rejected: Copilot shows it as literal text, and the agent shell has no such variable), copy the rules into each skill (rejected: DRY).
- **Input of a skill.** The skills keep `$ARGUMENTS` for Claude Code. The next paragraph says: "If the input in the line above is a placeholder that starts with a dollar sign, use the request that the user gave with the skill." The sentence does not contain the word `$ARGUMENTS`, because Claude Code would replace it there too. Options: remove `$ARGUMENTS` (rejected: Claude Code then shows the input only in the chat, and the skill text loses the place of the input).
- **Hooks.** `hooks/hooks.json` stays in the Claude format. Copilot CLI runs its `Stop` entries and sets `CLAUDE_PLUGIN_ROOT`. `scripts/verify.mjs --hook` already writes `{"decision":"block","reason":...}`, which is the block format of the Copilot hooks reference. The apply checks `SubagentStop` and `scripts/check.mjs --hook` in Copilot and writes each gap as a limit.
- **Start of a skill in Copilot.** The README shows the slash command that an interactive Copilot CLI session accepts. The apply checks it by hand (`/sparc:propose` or `/propose`) before it writes the README. The skill names in the skill text and in the check messages stay `/sparc:<skill>`, unless the check shows that Copilot needs another form.
- **Fresh-context code review.** The apply skill already says "Start one general-purpose subagent" and names no tool. Copilot CLI has a general-purpose subagent. The apply checks one review by hand. If it fails, the skill already tells the agent to review in the current session and to write the reason.
- **Website.** An agent switch in the install block, as a WAI-ARIA tab list: two tabs, the arrow keys move the selection, each tab controls one command panel. "Copy" copies the commands of the selected panel. Without JavaScript, both panels show with the name of the agent, and the tab list stays hidden. The script stays an external file, so the Content Security Policy does not change. Mockup: [docs/mockups/support-github-copilot/index.html](../../../docs/mockups/support-github-copilot/index.html). Options: two blocks in the hero (rejected: the loop moves below the fold), Copilot only in section 5.0 (rejected by the user).
- **Positioning text.** "Plugin for coding agents" in the manifest description, the first sentence of the README, the website hero, the title block and PRODUCT.md. The README section "Supported Agents" is the home of the status, the tested versions and the limits of each agent. The manifest, AGENTS.md, the README introduction and prerequisites, and the website name the two agents only, because each of them must be readable alone.
- **Test tool.** `node --test 'scripts/*.test.mjs'` (node:test) for the scenarios that a file scan can check: skill paths, `$ARGUMENTS` sentence, manifest, README sections, website pages. `website/test.sh` does not change. The scenarios that need a logged-in Copilot CLI ("GitHub Copilot CLI loads sparc", "Verifier in GitHub Copilot CLI") are manual checks in `qa.md` with their commands, because CI has no Copilot login and a test must not use a personal token. Options: a Copilot smoke test in CI (rejected: it needs a Copilot license and a secret token in a public repository).

## C4 impact

- New external system: "GitHub Copilot CLI" (runs agents, skills and hooks), next to "Claude Code".
- New relations: the developer runs sparc skills in GitHub Copilot CLI. GitHub Copilot CLI loads sparc and runs the hooks.
- The description of the system "sparc" changes from "Claude Code plugin" to "Plugin for coding agents".

## Risks / Trade-offs

- [Copilot drops the legacy plugin format] → ADR-0018 names this risk. The manual check of each release shows it. Open point in the canvas.
- [A relative path in a skill points to a wrong file after a move] → A test checks each relative path in the skills.
- [The slash command differs between the agents] → The README shows the checked form for each agent.
- [The deferred script hides the Copilot panel after the first paint, so the hero can move one time when the page loads] → Accepted: the page stays usable without JavaScript, and the CSP allows no inline script. The panels have the same height, so only the agent names disappear.
- [Copilot ignores the output of `check.mjs --hook`] → The check only warns. The verifier, which blocks, uses the documented format. The apply writes the result as a limit.

## Migration Plan

1. Apply the change. Projects need no step: the skill names and the files in the projects do not change.
2. At the archive: ADR-0018 `accepted`, ADR-0002 `superseded by ADR-0018`, canvas list of ADRs.
Rollback: revert the commits. The relative paths also work in Claude Code, so a partial rollback is safe.

## Open Questions

- Does an interactive Copilot CLI session accept `/sparc:propose`, or only `/propose`? The apply checks it.
- Do `SubagentStop` and `scripts/check.mjs --hook` work in Copilot CLI? The apply checks it.
