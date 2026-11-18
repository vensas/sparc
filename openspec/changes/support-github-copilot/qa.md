# QA

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
