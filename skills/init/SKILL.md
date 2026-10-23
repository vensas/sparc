---
name: init
description: Set up sparc in a new or existing project. Installs OpenSpec, the sparc documents (README, AGENTS.md, backlog, C4, canvas, ADRs) and the first content from evidence.
argument-hint: "[short idea of the project]"
disable-model-invocation: true
---

# sparc init

Set up sparc in the current project. Idea from the user: $ARGUMENTS

Obey ${CLAUDE_PLUGIN_ROOT}/rules/evidence.md and ${CLAUDE_PLUGIN_ROOT}/rules/writing.md in all steps.

## 1. Check the prerequisites

1. Run `git rev-parse --show-toplevel`. If this is not a git repository, ask the user if you can run `git init`.
2. Run `openspec --version`. If OpenSpec is not installed, stop. Tell the user to install it: `npm install -g @fission-ai/openspec`.
3. Run `node --version`. sparc needs Node.js 20 or later.
4. If the repository has commits, make the branch `chore/sparc-init` (see ${CLAUDE_PLUGIN_ROOT}/rules/release.md). In a new repository, the first commit can be on the default branch.

## 2. Install the files

1. If `openspec/` does not exist, run `openspec init --tools none --no-animation .`.
2. Copy each file from `${CLAUDE_PLUGIN_ROOT}/templates/project/` into the project. Keep the relative paths.
3. Do not overwrite a file that exists. For each existing file, show the user the difference and ask: keep, replace or merge.
4. For `openspec/config.yaml`: if it exists, merge the sparc `context`, `rules` and `operations` into it. Keep the `# sparc` marker line at the top. The hook uses this line to find sparc projects.
5. Do not create `CLAUDE.md`. Claude Code reads `AGENTS.md`. If the project has a `CLAUDE.md`, ask the user if you can move its text into `AGENTS.md` and delete it. Keep each instruction in one file.

## 3. Fill the documents from evidence

For an existing code base, follow the architect role (`${CLAUDE_PLUGIN_ROOT}/rules/roles/architect.md`) first. Read the code, the build files and the existing docs, and fill:

- `AGENTS.md`: commands (run each one), structure.
- `docs/architecture/c4.md`: only actors, systems, containers and relations that you found in the code or the config.
- `docs/architecture/canvas.md`: technologies and components from the code. Each unknown goes into "Core Risks and Missing Information".
- `README.md`: "Get Started" from the commands that you ran.

Then follow the product owner role (`${CLAUDE_PLUGIN_ROOT}/rules/roles/product-owner.md`) with the idea from the user:

1. Ask the user for the goal, the stakeholders and the quality requirements. Ask in one message.
2. Write `docs/backlog.md`: the goal and the first items.
3. Write the introduction, "Overview" and "Key Features" of the README. For a new project, "Key Features" says "None yet.".
4. Fill the canvas sections "Value Proposition", "Key Stakeholder" and "Quality Requirements".

## 4. Record the first decision

As the architect role, write `docs/adr/0001-use-sparc-for-spec-driven-development.md` with the status `proposed`. Ask the user for approval (see ${CLAUDE_PLUGIN_ROOT}/rules/approval.md). After approval, set the status to `accepted` and commit the ADR.

## 5. Check

1. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs`.
2. Fix each finding. A `TODO(sparc)` placeholder can stay only if the user cannot give the information now. Then write the open point in the canvas.
3. Commit with the message `chore: Add sparc harness`. If the branch is not the default branch, open a pull request (see ${CLAUDE_PLUGIN_ROOT}/rules/release.md).
4. Report the files that you created and the open points. Tell the user the next step: `/sparc:propose <idea>`.
