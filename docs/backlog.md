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
- [ ] Test the full workflow on a sample project (init, propose, apply, archive)
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
