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
| First viewport of the landing page: Select GitHub Copilot | passed | "First viewport of the landing page: Select GitHub Copilot" (runs `site.js` against a DOM stand-in: click, then copy), `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. Browser: a click shows only `cmd-copilot` |
| First viewport of the landing page: Switch with the keyboard | passed | "First viewport of the landing page: Switch with the keyboard", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. Browser: ArrowRight selects and focuses `tab-copilot`, ArrowLeft goes back. axe-core 4.14.0: 0 violations on `/` and `/de/`, light and dark, 1440 and 390 px |
| First viewport of the landing page: Page without JavaScript | passed | "First viewport of the landing page: Page without JavaScript", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. Browser with JavaScript off: the tab list has `display: none`, both panels and both agent names show |
| Supported agents on the website: Title block | passed | "Supported agents on the website: Title block" (English and German), `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed |
| Update only to a newer version: Project is up to date | passed | "Update only to a newer version: Project is up to date", `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed |
| Update only to a newer version: Project is newer than the plugin | passed | "Update only to a newer version: Project is newer than the plugin" (the update command of each agent), `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed |
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
  - `/sparc:propose a page that greets the user` (a second session after the code review): Copilot read the roles and the ADR rule, made the branch `feat/greeting-page`, ran `openspec new change greeting-page` and asked the product owner question about the scope. The session was stopped there.
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

## Code review

Reviewed: `6c9cf8c..ab614cb` (workflow `trunk`, after the proposal commit ddff0c7)
Context: fresh

| Finding | Fix |
|---|---|
| `README.md:95`: "tested" without a run of `/sparc:propose` in Copilot | `/sparc:propose` ran in Copilot CLI 1.0.106 (manual check above). 64b6b13: the README says what was tested: version 1.0.106 with a local checkout |
| `README.md:135-157`: Copilot install and update commands without evidence; the release tag sentence reads as a Copilot fact | 64b6b13: the commands follow the GitHub docs (`copilot plugin update sparc`, not `sparc@sparc`), the README says that they are not run with this marketplace yet, and the release tag sentence names Claude Code. Open point in the canvas. Running the marketplace commands changes the Copilot setup of the user; that needs the user |
| `design.md:39`: the sentence for an unreplaced input differs from the skills | 58547b4: design.md has the sentence and the reason |
| `design.md:44`: "named in one place" while five places name the agents | 58547b4: the README section is the home of status, versions and limits; the other places name the agents only |
| `skills/update/SKILL.md:20`: `/plugin update` works only in Claude Code | f8f9ad3: the skill names the command of each agent; new `project-update` spec delta and changed test |
| `website/pages/index.html:24, 30`: tab panels without tabs when JavaScript is off | 5c9e09b: `site.js` sets `role="tabpanel"` and `aria-labelledby`; the test "Page without JavaScript" checks that the built HTML has no tab panel |
| `website/layout.html:12`, `site.js:3`: possible layout jump at the first paint | 58547b4: accepted and recorded as a risk in design.md (no inline script under the CSP) |
| `scripts/website.test.mjs:152-162`: tests read the source of `site.js` | 5c9e09b: the tests run `site.js` against a DOM stand-in (click, arrow keys, focus, copy). A broken arrow-key handler made "Switch with the keyboard" fail |
| `scripts/plugin-distribution.test.mjs:65, 101`: exactly 8 skills; the first-sentence check tests only the old text | f8f9ad3: at least one skill; the first sentence names no agent or both |
| `scripts/plugin-distribution.test.mjs:76-82`: the colon assumption of the sentence | f8f9ad3: the sentence says "the input in the line above", and the test checks that it follows the input line |
| `docs/mockups/support-github-copilot/index.html:188`: changed after the approval | The `[hidden]` rule fixes a bug of the approved behavior (the switch showed without JavaScript), and 5c9e09b moves the panel roles into the script as in the site. Both keep the approved design |

After the fixes: `node --test 'scripts/*.test.mjs'`, 249 passed, 0 failed. `node scripts/check.mjs`: no findings. axe-core 4.14.0: 0 violations on `/` and `/de/`, light and dark, 1440 and 390 px.

## Acceptance

Accepted on 2026-11-18 by the product owner role. 16 scenarios passed with automated tests and 2 with manual checks in GitHub Copilot CLI 1.0.106. No scenario failed. Each code review finding has a fix.

Open, in the canvas: the Copilot CLI marketplace commands are not run with the sparc marketplace yet, the check warning does not show in Copilot, and Copilot in VS Code, the GitHub Copilot app and the cloud agent are not tested. The README says each of these points.
