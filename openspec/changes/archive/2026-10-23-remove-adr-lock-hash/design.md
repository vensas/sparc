## Context

See proposal.md for the reason. Today `check.mjs` stores a body hash in the field `locked` (ADR-0004) and compares it. The check already calls git for the branch and commit checks.

## Goals / Non-Goals

**Goals:**
- Protect decided ADRs with git history only. No extra front matter field.
- Keep the check deterministic and without dependencies.

**Non-Goals:**
- A check of the status transitions.
- Rename detection.

## Decisions

- **Baseline commit.** `git log --format=%H --reverse -- <path>` lists the commits of the ADR, oldest first. The check reads each version with `git show <sha>:<path>` and takes the first version with a decided status. Alternative: the commit where the status line changed (`git log -S`). Rejected, because an ADR can be created with the status `accepted`.
- **Protected content.** The body before `## Amendments`, and the front matter fields `decision-makers`, `consulted` and `informed`. Whitespace at line ends is ignored, as before. Other fields are not compared: `status` and `date` may change, and non-MADR fields get their own finding.
- **Existing amendments.** The `## Amendments` text of the version in `HEAD` must be the start of the current `## Amendments` text. This permits new entries at the end and reports each other change. Alternative: compare with all committed versions. Rejected, because each commit was checked when it was made (Stop hook, archive).
- **No git.** If `git rev-parse` fails and a decided ADR exists, the check reports one finding for the folder `docs/adr`.
- **MADR fields.** The check reports each front matter field that is not `status`, `date`, `decision-makers`, `consulted` or `informed`.
- **Code structure.** The existing `git()` helper is reused. The functions `adrHash` and `lockAdr` and the option `--lock` are removed.

ADR: `docs/adr/0008-protect-decided-adrs-through-git-history.md` supersedes ADR-0004.
C4 impact: no change to actors, systems, containers or relations.
Test tool: `node --test 'scripts/*.test.mjs'` (node:test, see `AGENTS.md`). Git tests make temporary repositories.

## Risks / Trade-offs

- [The check runs git commands for each decided ADR] → The number of ADRs is small. Each ADR needs one `git log` and a few `git show` calls.
- [A project without git loses the protection] → The check reports it.
- [Uncommitted decided ADRs are not protected] → The protection starts with the first commit. The archive skill commits the decision.
