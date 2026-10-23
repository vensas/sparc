## Context

See proposal.md for the reason. The plugin holds skills, rules, roles, the check and the hooks. `/plugin update` updates them. `/sparc:init` copies `templates/project/` into a project. A test with OpenSpec 1.14.3 showed that `openspec/config.yaml` accepts an extra top-level key `sparc` without a warning in `new change`, `instructions`, `validate` and `doctor`.

## Goals / Non-Goals

**Goals:**
- A project knows its sparc version.
- An update changes only sparc text and keeps project text.
- Migration steps have one home: the changelog.

**Non-Goals:**
- A migration engine with code for each release. The update skill applies the changelog steps with the user.
- Downgrades.

## Decisions

- **Project version.** `openspec/config.yaml` gets `sparc:` and `  version: X.Y.Z` outside the markers. The check reads it with a regular expression, because the check has no YAML parser and no dependencies. Alternative: a file `.sparc.json`. Rejected by the user, because it adds a file.
- **Installed version.** The check reads `version` from `.claude-plugin/plugin.json` next to its own folder (`new URL('../.claude-plugin/plugin.json', import.meta.url)`).
- **sparc repository.** The check skips the version finding when the project folder is the plugin folder. In sparc itself, the plugin version is the project version.
- **Markers.** Markdown: `<!-- sparc:begin -->` and `<!-- sparc:end -->` around the "Rules" section of `AGENTS.md`. YAML: `# sparc:begin` and `# sparc:end` around `context`, `rules` and `operations` of `openspec/config.yaml`. sparc owns these keys. Project rules go into `AGENTS.md` outside the markers. Alternative: markers inside the YAML values. Rejected, because a comment inside a block scalar is text, and OpenSpec gives it to the model.
- **Whole sparc files.** `docs/adr/0000-template.md` has no project text. The update replaces it as a whole.
- **Migrations.** The update skill reads `${CLAUDE_PLUGIN_ROOT}/CHANGELOG.md`. For each release after the project version, it collects the entries that start with `**Breaking:**`. The release rule tells that each such entry gives the project step. Alternative: files `migrations/<version>.md`. Rejected by the user, because it is a second home.
- **Order of the update.** 1. Read versions. 2. Show the migration steps, the block changes and the new files. 3. Get approval. 4. Apply. 5. Set the version. 6. Run the check. 7. Commit.

ADR: `docs/adr/0010-record-the-sparc-version-and-mark-sparc-text-in-projects.md`.
C4 impact: the container "Skills" adds `update`. No actor, external system or relation changes.
Test tool: `node --test 'scripts/*.test.mjs'` (node:test, see `AGENTS.md`). The skill behavior is a manual check in a scratch project with `claude -p --plugin-dir`.

## Risks / Trade-offs

- [A user changes text between the markers] → The update replaces it. The update shows the difference before it changes a file.
- [A breaking entry has no clear project step] → The release rule requires it. The code review of each change checks it.
- [Projects of version 0.1.0 have no markers] → The update adds them after the user confirms the difference.
