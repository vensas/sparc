## Context

See proposal.md for the reason. Today `agents/*.md` define five agent types. Each file has front matter and a list of rules to read, then the role procedure. The skills start these agents. ADR-0007 decides when QA runs. It stays valid, because it is about the time of QA, not about agents.

## Goals / Non-Goals

**Goals:**
- One home for each role procedure, in plain Markdown, without agent types.
- A code review before QA.

**Non-Goals:**
- New role content, except the code review.
- Parallel work. A user can still ask for it, but sparc does not plan it.

## Decisions

- **Role file format.** `rules/roles/<role>.md` has no front matter. It starts with the purpose of the role and links the rules it needs with relative links (`../writing.md`). Alternative: keep the agent files and also use them as rules. Rejected, because Claude Code loads each `agents/` file as an agent type.
- **How skills use roles.** A skill says "Follow the <role> role (`${CLAUDE_PLUGIN_ROOT}/rules/roles/<role>.md`)". Claude Code replaces `${CLAUDE_PLUGIN_ROOT}` in skill text. Role files use relative links, because the variable is not replaced in rule files.
- **Code review place.** After all task groups and before QA. QA then tests the reviewed code. Alternative: a review after each task group. Rejected, because one review of the full diff finds duplication across groups and costs less.
- **Code review record.** The section `## Code review` in `qa.md`. The product owner reads one report for acceptance. Alternative: a separate `review.md`. Rejected, because it adds a file.
- **Review checklist.** In the software engineer role. It links `engineering.md` for simplicity, DRY, SOLID and tests, and lists only the review steps (spec match, diff scope, names, dead code, error handling, secrets, documents).
- **Fresh-context check.** Only on request, with a general-purpose subagent. No custom agent type is necessary.
- **Plugin manifest.** No `agents` key. The folder `agents/` is removed.

ADR: `docs/adr/0009-use-roles-as-rules-instead-of-subagents.md`.
C4 impact: the container "Agents" is removed. The container "Rules" also holds the role files. The relation "Skills give work to Agents" becomes "Skills follow Rules".
Test tool: `node --test 'scripts/*.test.mjs'` and `claude plugin validate .` (see `AGENTS.md`).

## Risks / Trade-offs

- [The main session context grows, because it does all roles] → The skills keep each step small. The user can start a new session between propose, apply and archive.
- [No independent check by default] → The optional fresh-context check gives one. The code review and the automated QA tests give evidence.
- [Users who call `sparc:*` agents] → The changelog marks the change as breaking.
