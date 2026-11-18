## MODIFIED Requirements

### Requirement: First viewport of the landing page

The landing page SHALL show the sparc logo, a short statement of what sparc does, the CLI commands to install OpenSpec, add the marketplace and install sparc, and a link to the repository on GitHub, in the first viewport at a width of 1440 px. A switch above the commands SHALL select the agent: Claude Code or GitHub Copilot. Claude Code SHALL be selected first. Without JavaScript, the page SHALL show the commands of both agents.

#### Scenario: First viewport

- **WHEN** a visitor opens `/` in a window of 1440 × 900 px
- **THEN** the logo, the heading, the agent switch, the commands `npm install -g @fission-ai/openspec`, `claude plugin marketplace add vensas/sparc` and `claude plugin install sparc@sparc`, and a link to `https://github.com/vensas/sparc` are visible without a scroll

#### Scenario: Copy the install commands

- **WHEN** a visitor clicks "Copy" next to the install commands
- **THEN** the clipboard holds the three commands of the selected agent, one on each line

#### Scenario: Select GitHub Copilot

- **WHEN** a visitor selects "GitHub Copilot" in the agent switch
- **THEN** the page shows `copilot plugin marketplace add vensas/sparc` and `copilot plugin install sparc@sparc` instead of the Claude Code commands, and "Copy" copies them

#### Scenario: Switch with the keyboard

- **WHEN** a visitor moves the focus to the agent switch with Tab and selects the other agent with the arrow keys
- **THEN** the commands of that agent show, and the switch tells the selected agent to a screen reader

#### Scenario: Page without JavaScript

- **WHEN** a visitor opens `/` with JavaScript turned off
- **THEN** the commands of both agents show, each with the name of its agent

## ADDED Requirements

### Requirement: Supported agents on the website

The landing page SHALL describe sparc as a plugin for coding agents and name Claude Code and GitHub Copilot as the supported agents, in English and German. The FAQ SHALL answer the question about other coding agents with the supported agents and a link to the README section "Supported Agents".

#### Scenario: Title block

- **WHEN** a visitor reads the title block on `/` or `/de/`
- **THEN** the row "Type" names a plugin for coding agents, and the row "Requires" names Claude Code or GitHub Copilot CLI

#### Scenario: FAQ about other agents

- **WHEN** a visitor opens the FAQ question about other coding agents
- **THEN** the answer names Claude Code and GitHub Copilot CLI and links to the README section "Supported Agents"
