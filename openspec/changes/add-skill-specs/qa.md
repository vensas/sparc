# QA

Test command: `node --test 'scripts/*.test.mjs'` (design.md). Each test reads the skill file and the rules that it links. It proves that the skill tells the behavior, not that an agent obeys it (design.md, decision 1).

Extra check: each new test fails when its skill file is empty. A script copied `scripts/`, `skills/`, `rules/` and `templates/` to a temporary folder, emptied the skill files, and ran each test file. Result: all 47 new tests failed.

| Scenario | Result | Evidence |
|---|---|---|
| New ADR from the template: Next free number | passed | "New ADR from the template: Next free number", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Amendment does not change the decision: Addition alters the decision | passed | "Amendment does not change the decision: Addition alters the decision", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Supersede in two steps: New ADR is proposed | passed | "Supersede in two steps: New ADR is proposed", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Supersede in two steps: New ADR is accepted | passed | "Supersede in two steps: New ADR is accepted", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: ADR-0015 (`accepted`) supersedes ADR-0009 in "More Information". ADR-0009 has `superseded by ADR-0015`, and its canvas line names it. |
| Propose writes planning documents only: Files of a propose commit | passed | "Propose writes planning documents only: Files of a propose commit", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: `git show --name-only` of all 15 `docs(openspec): Propose` commits shows only files in `openspec/changes/` and `docs/`. |
| Propose writes planning documents only: Backlog link | passed | "Propose writes planning documents only: Backlog link", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: `3c1bc8c` adds `(change: add-skill-specs)` to `docs/backlog.md`. |
| Change id and branch: Pull request workflow | passed | "Change id and branch: Pull request workflow", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Change id and branch: Trunk workflow | passed | "Change id and branch: Trunk workflow", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: `git branch --contains 3c1bc8c` gives only `main`. |
| Mockups only for a user interface: Change without a user interface | passed | "Mockups only for a user interface: Change without a user interface", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: `docs/mockups/` has no folder `add-skill-specs` after `3c1bc8c`. |
| Design names the test tool: Project has a test tool | passed | "Design names the test tool: Project has a test tool", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: `design.md` of this change names `node:test` and `node --test 'scripts/*.test.mjs'`. |
| Design names the test tool: Project has no test tool | passed | "Design names the test tool: Project has no test tool", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Propose ends valid and committed: Propose completes | passed | "Propose ends valid and committed: Propose completes", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: `3c1bc8c docs(openspec): Propose add-skill-specs`. `openspec validate add-skill-specs --strict` passed before the commit. |
| Apply starts only on a valid change: Change is not valid | passed | "Apply starts only on a valid change: Change is not valid", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Task groups one after the other: One commit for each task | passed | "Task groups one after the other: One commit for each task", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: 5 tasks, 5 commits `07cec39`, `1958da0`, `0c2a349`, `408696d`, `5782ce2`. Each commit checks its task in `tasks.md`. |
| Task groups one after the other: A test fails after a group | passed | "Task groups one after the other: A test fails after a group", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| QA commits change only tests and the QA report: Files of a QA commit | passed | "QA commits change only tests and the QA report: Files of a QA commit", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: 15 of 17 `test(qa)` commits change only test files and `qa.md`. `76f91df` and `f52f33b` also change `docs/architecture/canvas.md`. Both are acceptance commits of the product owner, not QA commits. This is an open point in the canvas. |
| Apply reports the next step: Apply completes | passed | "Apply reports the next step: Apply completes", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Archive only a complete and tested change: Open task | passed | "Archive only a complete and tested change: Open task", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Archive only a complete and tested change: Failed test | passed | "Archive only a complete and tested change: Failed test", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Archive updates the main specs: New capability | passed | "Archive updates the main specs: New capability", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: `7c36ed0` (archive of add-verifier-hook) adds `openspec/specs/change-verification/spec.md`. |
| Archive syncs, checks and commits: Archive completes | passed | "Archive syncs, checks and commits: Archive completes", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: `efa5d7b docs(openspec): Archive improve-first-read`. |
| Archive opens a pull request: Repository without a remote | passed | "Archive opens a pull request: Repository without a remote", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Archive opens a pull request: Repository with a remote | passed | "Archive opens a pull request: Repository with a remote", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Sync updates the documents of each trigger: Change archived | passed | "Sync updates the documents of each trigger: Change archived", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Sync updates the documents of each trigger: Report | passed | "Sync updates the documents of each trigger: Report", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Sync repeats until the check is clean: Finding stays | passed | "Sync repeats until the check is clean: Finding stays", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Sync does not change decided ADRs: Drift in an accepted ADR | passed | "Sync does not change decided ADRs: Drift in an accepted ADR", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Sync does not record incomplete work: Task in progress | passed | "Sync does not record incomplete work: Task in progress", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Prerequisites before setup: Not a git repository | passed | "Prerequisites before setup: Not a git repository", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Prerequisites before setup: OpenSpec is not installed | passed | "Prerequisites before setup: OpenSpec is not installed", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Template files without overwrite: New project | passed | "Template files without overwrite: New project", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Template files without overwrite: Project has a README | passed | "Template files without overwrite: Project has a README", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Existing OpenSpec configuration is merged: OpenSpec was already in use | passed | "Existing OpenSpec configuration is merged: OpenSpec was already in use", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. `openspec/config.yaml` of sparc starts with the `# sparc` line and has one `sparc:begin` and one `sparc:end` marker. |
| AGENTS.md is the only agent instruction file: Project has a CLAUDE.md | passed | "AGENTS.md is the only agent instruction file: Project has a CLAUDE.md", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| AGENTS.md is the only agent instruction file: New project | passed | "AGENTS.md is the only agent instruction file: New project", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| First content from evidence: Existing code base | passed | "First content from evidence: Existing code base", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| First content from evidence: New project | passed | "First content from evidence: New project", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| First content from evidence: Questions to the user | passed | "First content from evidence: Questions to the user", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| First decision record: User approves ADR-0001 | passed | "First decision record: User approves ADR-0001", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Setup completes with a check and a commit: Successful setup | passed | "Setup completes with a check and a commit: Successful setup", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Setup completes with a check and a commit: Team project with history | passed | "Setup completes with a check and a commit: Team project with history", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Update only to a newer version: Project is up to date | passed | "Update only to a newer version: Project is up to date", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Update only to a newer version: Project is newer than the plugin | passed | "Update only to a newer version: Project is newer than the plugin", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Release start conditions: Nothing to release | passed | "Release start conditions: Nothing to release", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Release start conditions: Check finding | passed | "Release start conditions: Check finding", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
| Release commit and tag: Trunk release | passed | "Release commit and tag: Trunk release", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. History: `023d558 chore(release): 0.7.0` has the tag `v0.7.0`. |
| Release commit and tag: Pull request release | passed | "Release commit and tag: Pull request release", `node --test 'scripts/*.test.mjs'`, 194 passed, 0 failed. |
