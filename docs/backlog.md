# Backlog

## Goal

sparc lets a team take an idea from a spark to working software with agents. Specs, architecture and documents stay correct and in sync at each step.

## Items

- [x] Plugin skeleton with manifest, marketplace and hooks
- [x] Shared rules: STE writing, evidence, engineering, documents, ADRs, approval
- [x] Agents: product owner, architect, UX designer, software engineer
- [x] Skills: init, propose, apply, archive, sync, adr
- [x] Document check with tests and a Stop hook that warns
- [x] Test the hook output in a live Claude Code session
- [x] Choose a license (MIT)
- [x] Publish to GitHub as vensas/sparc (private)
- [ ] Decide if sparc adds [arc42agentic](https://github.com/matthiasnissen/arc42agentic) as an optional module
- [x] Release conventions: changelog, SemVer, Conventional Commits and pull requests (change: add-release-conventions)
- [ ] Write the specs of sparc as OpenSpec capabilities
- [x] QA engineer for integration and end-to-end tests, automation first (change: add-qa-engineer)
- [x] Protect decided ADRs through git history, not a lock hash (change: remove-adr-lock-hash)
- [x] Roles as rules instead of subagents, with code review by the software engineer (change: replace-agents-with-roles)
- [x] Update path for projects that already use sparc (change: add-update-path)
- [x] No STE sentence findings for decided ADRs (change: skip-ste-check-for-decided-adrs)
- [x] Logo for README and plugin icon (change: add-sparc-logo)
- [x] Approval through apply and pull requests (change: implicit-approval)
- [x] Trunk-based workflow on the default branch (change: trunk-based-workflow)
- [x] Do not forbid subagents (change: allow-subagents)
- [x] Publish released versions to the marketplace with CI (change: publish-plugin-releases)
- [x] Verifier hook: block the stop of a complete change until lint, tests and spec evidence pass (change: add-verifier-hook)
- [x] Agents must not follow superseded ADRs as current decisions. Find a solution. (change: ignore-superseded-adrs)
- [ ] After each new model generation, find the rules that the model already follows without sparc.
- [x] Code review runs in a fresh context by default (change: fresh-context-code-review)
- [ ] The check finds each document date that is older than the last commit of its document (for example the canvas "Date / Iteration").
- [ ] Documents for a first-time reader (change: improve-first-read)
- [ ] A "How we work" section in the README template for human contributors
- [ ] A note in the templates that tells which documents can stay short in a small project
- [ ] Decide if the README of a project must follow STE
