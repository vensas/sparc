---
name: init
description: Set up sparc in a new or existing project. Installs OpenSpec, the sparc documents (README, AGENTS.md, backlog, C4, canvas, ADRs) and the first content from evidence.
argument-hint: "[short idea of the project]"
disable-model-invocation: true
---

# sparc init

Set up sparc in the current project. Idea from the user: $ARGUMENTS

If the text after the colon above is a placeholder that starts with a dollar sign, use the request that the user gave with the skill.

Paths that start with `../../` lead from the folder of this file to the root of the sparc plugin. Make them absolute before you use them in a command.

Obey ../../rules/evidence.md and ../../rules/writing.md in all steps.

## 1. Check the prerequisites

1. Run `git rev-parse --show-toplevel`. If this is not a git repository, ask the user if you can run `git init`.
2. Run `openspec --version`. If OpenSpec is not installed, stop. Tell the user to install it: `npm install -g @fission-ai/openspec`.
3. Run `node --version`. If `node --version` fails, stop. Tell the user to install the latest Node.js LTS version from https://nodejs.org. Do not stop because of the Node.js version.
4. Ask the user: "Do you work alone or in a team?" Suggest the workflow `trunk` for a solo user and `pull-request` for a team (see ../../rules/release.md). Use the answer in step 2.
5. In the workflow `pull-request`, if the repository has commits, make the branch `chore/sparc-init`. In a new repository, the first commit can be on the default branch.

## 2. Install the files

1. If `openspec/` does not exist, run `openspec init --tools none --no-animation .`.
2. Copy each file from `../../templates/project/` into the project. Keep the relative paths.
3. Do not overwrite a file that exists. For each existing file, show the user the difference and ask: keep, replace or merge.
4. For `openspec/config.yaml`: if it exists, merge the sparc `context`, `rules` and `operations` into it, between the `# sparc:begin` and `# sparc:end` markers. Keep the `# sparc` marker line at the top. The hook uses this line to find sparc projects.
5. Set `workflow` under `sparc:` in `openspec/config.yaml` to the workflow from step 1. Set `version` under `sparc:` to the installed sparc version (the `version` in `../../.claude-plugin/plugin.json`).
6. Keep the `sparc:begin` and `sparc:end` markers in `AGENTS.md` and `openspec/config.yaml`. Tell the user that project rules go outside the markers, because `/sparc:update` replaces the text between them.
7. Do not create `CLAUDE.md`. Claude Code reads `AGENTS.md`. If the project has a `CLAUDE.md`, ask the user if you can move its text into `AGENTS.md` and delete it. Keep each instruction in one file.

## 3. Fill the documents from evidence

For an existing code base, follow the architect role (`../../rules/roles/architect.md`) first. Read the code, the build files and the existing docs, and fill:

- `AGENTS.md`: commands (run each one), structure.
- `docs/architecture/c4.md`: only actors, systems, containers and relations that you found in the code or the config.
- `docs/architecture/canvas.md`: technologies and components from the code. Each unknown goes into "Core Risks and Missing Information".
- `README.md`: "Get Started" from the commands that you ran.

Then follow the product owner role (`../../rules/roles/product-owner.md`) with the idea from the user:

1. Ask the user for the goal, the stakeholders and the quality requirements. Ask in one message.
2. Write `docs/backlog.md`: the goal and the first items.
3. Write the introduction, "Overview" and "Key Features" of the README. For a new project, "Key Features" says "None yet.".
4. Fill the canvas sections "Value Proposition", "Key Stakeholder" and "Quality Requirements".

## 4. Record the first decision

As the architect role, write `docs/adr/0001-use-sparc-for-spec-driven-development.md` with the status `proposed`. Ask the user for approval (see ../../rules/approval.md). After approval, set the status to `accepted` and commit the ADR.

## 5. Check

1. Run `node ../../scripts/check.mjs`.
2. Fix each finding. A `TODO(sparc)` placeholder can stay only if the user cannot give the information now. Then write the open point in the canvas.
3. Commit with the message `chore: Add sparc harness`. Complete the commit as the workflow in ../../rules/release.md tells.
4. Report the files that you created and the open points. Tell the user the next step: `/sparc:propose <idea>`.
