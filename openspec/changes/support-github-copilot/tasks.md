# Tasks

## 1. Skills for each supported agent

- [x] 1.1 In the 8 skills, replace each `${CLAUDE_PLUGIN_ROOT}/...` with the path relative to the folder of the `SKILL.md`, and add the sentence for a literal `$ARGUMENTS` (design.md, "Input of a skill"). Change the tests that read the old paths. Verify: `node --test 'scripts/*.test.mjs'` passes with tests for "Skill text without a plugin variable" (also: each relative path exists) and "Agent does not replace the arguments", and `claude --plugin-dir .` still starts `/sparc:sync` in a test project. Documents: none.

## 2. Check GitHub Copilot CLI

- [ ] 2.1 In an interactive GitHub Copilot CLI session with `copilot --plugin-dir <sparc checkout>` in a test project, check: the slash command form of a skill (`/sparc:sync` or `/sync`), `/sparc:propose` with an idea, the `Stop` hook with a failing verification, `SubagentStop`, the warning of `scripts/check.mjs --hook`, and one fresh-context code review with a subagent. Verify: each result is written in `qa.md` under "Manual checks" with the Copilot version and the date. Documents: canvas (each gap as an open point).

## 3. Positioning and README

- [ ] 3.1 Change the description in `.claude-plugin/plugin.json`, the first sentence and the section "Architecture" of `README.md` to "plugin for coding agents". Add the section "Supported Agents" (agents, how to start a skill, limits from task 2.1, VS Code and the cloud agent not tested) and the Copilot CLI commands in "Install" and "Update". Verify: `node --test 'scripts/*.test.mjs'` passes with tests for "Manifest description", "Read the install section" and "Read the supported agents", and `claude plugin validate .` passes. Documents: README.md, PRODUCT.md, AGENTS.md (command `copilot --plugin-dir .`).

## 4. Website

- [ ] 4.1 Add the agent switch to the install block as in the mockup, and change the hero lede, the title block and the FAQ answer about other agents in `en.json` and `de.json`. Verify: `node --test 'scripts/*.test.mjs'` passes with tests for the scenarios of "First viewport of the landing page" and "Supported agents on the website" (the built HTML has both panels with their names and a hidden tab list; the script switches with the arrow keys), `CONTAINER=podman website/test.sh` passes, and axe-core finds no violation on `/` and `/de/` at 1440 and 390 px in light and dark. Documents: DESIGN.md (the switch component).

## Workflow follow-up

- At the archive: set ADR-0018 to `accepted` and ADR-0002 to `superseded by ADR-0018`, and update the ADR list in the canvas.
