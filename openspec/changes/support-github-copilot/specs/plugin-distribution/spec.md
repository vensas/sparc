## MODIFIED Requirements

### Requirement: Install instructions

The README SHALL tell how to add the marketplace and install sparc with the Claude Code CLI, with Claude Desktop and with GitHub Copilot CLI. It SHALL tell how to update sparc and how to load a local checkout for development in each agent.

#### Scenario: Read the install section

- **WHEN** a user reads the install section of `README.md`
- **THEN** it has the commands to add the marketplace, install, update and list sparc for the Claude Code CLI and for GitHub Copilot CLI, the Claude Desktop steps, and `claude --plugin-dir .` and `copilot --plugin-dir .` for a local checkout

## ADDED Requirements

### Requirement: Supported agents

The README SHALL name Claude Code and GitHub Copilot CLI as the supported agents. It SHALL tell how a user starts a sparc skill in each agent. It SHALL list each sparc part that does not work or is not tested in GitHub Copilot, and SHALL name Copilot in VS Code and the Copilot cloud agent as not tested.

#### Scenario: Read the supported agents

- **WHEN** a user reads the section "Supported Agents" of `README.md`
- **THEN** it names Claude Code and GitHub Copilot CLI, shows how to start `/sparc:propose` in each, and lists the limits of GitHub Copilot

### Requirement: Skills work in each supported agent

Each skill SHALL name the files of the plugin (rules, roles, templates, scripts) by a path relative to the folder of its `SKILL.md`. A skill SHALL NOT need `${CLAUDE_PLUGIN_ROOT}` in its text. Each skill that takes input SHALL also work when the agent does not replace `$ARGUMENTS`: it SHALL then use the request that the user gave with the skill.

#### Scenario: Skill text without a plugin variable

- **WHEN** the skill files in `skills/` are scanned
- **THEN** no skill has `${CLAUDE_PLUGIN_ROOT}`, and each relative path in a skill points to a file or folder that exists in the plugin

#### Scenario: Agent does not replace the arguments

- **WHEN** an agent shows a skill with the literal text `$ARGUMENTS`
- **THEN** the skill tells the agent to use the request that the user gave with the skill

#### Scenario: GitHub Copilot CLI loads sparc

- **WHEN** a user runs `copilot --plugin-dir <sparc checkout> plugin list` in a project
- **THEN** the list has `sparc` with the version in `.claude-plugin/plugin.json`

#### Scenario: Verifier in GitHub Copilot CLI

- **WHEN** a Copilot CLI session with sparc ends a turn in a project with a complete change whose verification fails
- **THEN** the `Stop` hook runs `scripts/verify.mjs`, and Copilot continues the turn with the reason of the block

### Requirement: Description for coding agents

The manifest `.claude-plugin/plugin.json` and the first sentence of the README SHALL describe sparc as a plugin for coding agents. They SHALL NOT name one agent as the only host.

#### Scenario: Manifest description

- **WHEN** a user reads the `description` in `.claude-plugin/plugin.json`
- **THEN** it says "coding agents" and does not say "Claude Code plugin"
