---
name: update
description: Update a project that already uses sparc to the installed sparc version. Applies the migration steps of the breaking changelog entries, replaces the marked sparc text, adds missing template files and sets the project version.
disable-model-invocation: true
---

# sparc update

Update this project to the installed sparc version.

Obey ${CLAUDE_PLUGIN_ROOT}/rules/evidence.md, ${CLAUDE_PLUGIN_ROOT}/rules/approval.md and ${CLAUDE_PLUGIN_ROOT}/rules/release.md.

## 1. Read the versions

1. Installed version: `version` in `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`.
2. Project version: `version` under `sparc:` in `openspec/config.yaml`. If the key does not exist, the project version is `0.1.0`.
3. If the two versions are equal, stop. Tell the user that the project is up to date.
4. If the project version is higher, stop. Tell the user to update the plugin with `/plugin update`.

## 2. Collect the work

1. Migration steps: read `${CLAUDE_PLUGIN_ROOT}/CHANGELOG.md`. For each release after the project version, up to the installed version, collect each entry that starts with `**Breaking:**`. Each entry tells the project step.
2. Marked text: for `AGENTS.md` and `openspec/config.yaml`, compare the text between `sparc:begin` and `sparc:end` with the same text in `${CLAUDE_PLUGIN_ROOT}/templates/project/`. If a file has no markers, compare the sparc part of the file with the template.
3. sparc files: compare `docs/adr/0000-template.md` with the template.
4. Missing files: list each file in `${CLAUDE_PLUGIN_ROOT}/templates/project/` that the project does not have.

## 3. Get approval

Show the user the two versions, the migration steps, the differences of the marked text and the sparc files, and the missing files. Get approval. Do not change a file before the approval.

## 4. Apply

1. In the workflow `pull-request` only, make the branch `chore/sparc-update-<installed version>` from the default branch.
2. Do each migration step. Get evidence for each step (for example a `grep` that finds nothing).
3. Replace the text between the markers with the template text. Do not change text outside the markers.
4. If a file had no markers, add them around the sparc text, as the user confirmed.
5. Replace `docs/adr/0000-template.md` with the template.
6. Copy each missing file from the template. Do not overwrite a file that exists.
7. Set `version` under `sparc:` in `openspec/config.yaml` to the installed version. Add the key outside the markers if it does not exist.

## 5. Check and commit

1. Run `node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs`. It must not report the version. Fix each finding that the update caused. Tell the user about other findings.
2. Commit: `chore: Update sparc to <installed version>`.
3. Complete the update as the workflow in the release rule tells.
4. Report the steps that you did, with evidence, and the check result.
