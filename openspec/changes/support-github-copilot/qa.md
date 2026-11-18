# QA

Test tool (design.md, "Test tool"): node:test in `scripts/`. The two Copilot scenarios need a logged-in Copilot CLI and are manual checks. `CONTAINER=podman website/test.sh`: 32 checks passed after the website change.

| Scenario | Result | Evidence |
|---|---|---|
| Install instructions: Read the install section | passed | "Install instructions: Read the install section", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed |
| Supported agents: Read the supported agents | passed | "Supported agents: Read the supported agents", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. Each limit in the section comes from the manual check below |
| Skills work in each supported agent: Skill text without a plugin variable | passed | "Skills work in each supported agent: Skill text without a plugin variable" (also: each relative path exists), `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. Live: Claude Code ran `/sparc:sync` with `--plugin-dir` and resolved `../../rules/docs.md` and `../../scripts/check.mjs` to absolute paths |
| Skills work in each supported agent: Agent does not replace the arguments | passed | "Skills work in each supported agent: Agent does not replace the arguments", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed |
| Skills work in each supported agent: GitHub Copilot CLI loads sparc | manual | See "Manual checks" |
| Skills work in each supported agent: Verifier in GitHub Copilot CLI | manual | See "Manual checks" |
| Description for coding agents: Manifest description | passed | "Description for coding agents: Manifest description", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. `claude plugin validate .` passed |
| Roles as rule files: Role files exist | passed | "Roles as rule files: Role files exist", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed |
| Roles as rule files: No custom agent types | passed | "Roles as rule files: No custom agent types" (no `agents/`, no `com.github.copilot/`), `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed |
| First viewport of the landing page: First viewport | passed | "First viewport of the landing page: First viewport", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. Browser at 1440 x 900: the loop starts at y=845, the switch and the commands show |
| First viewport of the landing page: Copy the install commands | passed | "First viewport of the landing page: Copy the install commands", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. Browser: after "GitHub Copilot", the clipboard held the three Copilot commands |
| First viewport of the landing page: Select GitHub Copilot | passed | "First viewport of the landing page: Select GitHub Copilot", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. Browser: a click shows only `cmd-copilot` |
| First viewport of the landing page: Switch with the keyboard | passed | "First viewport of the landing page: Switch with the keyboard", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. Browser: ArrowRight selects and focuses `tab-copilot`, ArrowLeft goes back. axe-core 4.14.0: 0 violations on `/` and `/de/`, light and dark, 1440 and 390 px |
| First viewport of the landing page: Page without JavaScript | passed | "First viewport of the landing page: Page without JavaScript", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. Browser with JavaScript off: the tab list has `display: none`, both panels and both agent names show |
| Supported agents on the website: Title block | passed | "Supported agents on the website: Title block" (English and German), `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed |
| Supported agents on the website: FAQ about other agents | passed | "Supported agents on the website: FAQ about other agents" (English and German), `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed |

## Manual checks

### GitHub Copilot CLI in an interactive session (task 2.1)

- Reason: the checks need a logged-in, interactive Copilot CLI (design.md, "Test tool").
- Setup: GitHub Copilot CLI 1.0.106 in `tmux`, `copilot --plugin-dir <copy of sparc with logging hooks>` in a test project made from `templates/project/` with one change `demo`. The hooks wrote a line to a log file and then ran the real `scripts/check.mjs --hook` and `scripts/verify.mjs --hook`.
- Results on 2026-11-18:
  - Slash commands: typing `/sparc` lists `/sparc:adr`, `/sparc:apply`, `/sparc:archive`, `/sparc:init`, `/sparc:propose`, `/sparc:release` (and the rest when you scroll). The form is `/sparc:<skill>`, the same as in Claude Code, also for the skills with `disable-model-invocation: true`.
  - `/sparc:sync` ran to its end. Copilot read `../../rules/docs.md` from the skill folder and ran the check on the project.
  - Plugin folder: Copilot asks "Allow path access" for the plugin folder, because it is outside the project. "Yes, and remember these paths for this session" stops the questions for the session.
  - `Stop` hook with a complete change whose verification fails: `scripts/verify.mjs --hook` blocked, and Copilot started a new turn with the reason ("Change "demo" is complete, but its verification failed ...") as the prompt.
  - `scripts/check.mjs --hook` ran at each `Stop` and `SubagentStop`, but Copilot did not show its warning (`systemMessage`, `additionalContext`) on the screen, and the model did not react to the 8 findings. The check is silent in Copilot.
  - `SubagentStop`: the hook ran when a subagent ended.
  - Subagent for the fresh-context code review: "start one general-purpose subagent" started the Copilot "General-purpose" subagent, which ran a shell command and returned its result.

### Skills work in each supported agent: GitHub Copilot CLI loads sparc

- Reason: needs a logged-in Copilot CLI.
- Steps: in an empty git repository, run `copilot --plugin-dir <sparc checkout> plugin list`.
- Expected result: "sparc" with the version in `.claude-plugin/plugin.json`.
- Result: passed on 2026-11-18 with Copilot CLI 1.0.106: "External Plugins (via --plugin-dir): sparc (v0.8.0)". The interactive session above also listed all `/sparc:<skill>` commands.

### Skills work in each supported agent: Verifier in GitHub Copilot CLI

- Reason: needs a logged-in, interactive Copilot CLI.
- Steps: see "GitHub Copilot CLI in an interactive session" above (test project with the complete change `demo` without `qa.md`).
- Expected result: the `Stop` hook runs `scripts/verify.mjs`, and Copilot continues the turn with the reason of the block.
- Result: passed on 2026-11-18 with Copilot CLI 1.0.106. The new turn started with "Change "demo" is complete, but its verification failed".
