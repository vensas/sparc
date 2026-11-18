# AGENTS.md

This repository is sparc, a Claude Code plugin. sparc also uses itself: it is a sparc project.

## Commands

| Task | Command |
|---|---|
| Test | `node --test 'scripts/*.test.mjs'` |
| Check the documents | `node scripts/check.mjs` |
| Validate the plugin | `claude plugin validate .` |
| Lint | `actionlint` |
| Run a CI workflow locally (Docker, from a clean clone, `linux/arm64` on Apple silicon) | `act push -W .github/workflows/validate.yml --container-architecture linux/arm64` |
| Build the website into `_site/` | `node scripts/build-website.mjs` |
| Test the website container (Docker, or Podman with `CONTAINER=podman`) | `website/test.sh` |
| Load the plugin for a test | `claude --plugin-dir .` |
| Make the plugin icon after a change to `docs/assets/icon.svg` | `rsvg-convert -w 512 -h 512 docs/assets/icon.svg -o .claude-plugin/icon.png` |

## Structure

| Path | Content |
|---|---|
| `.claude-plugin/` | Plugin manifest and marketplace manifest |
| `skills/` | Skills: init, propose, apply, archive, sync, adr, release, update |
| `rules/` | Shared rules. Skills and roles link to them. Do not copy rule text. |
| `rules/roles/` | Roles: product owner, architect, UX designer, software engineer, QA engineer |
| `templates/project/` | Files that `/sparc:init` copies into a project |
| `scripts/check.mjs` | Document check without dependencies, and its tests |
| `scripts/verify-release.mjs` | Release verification for the publication workflow, and its tests |
| `scripts/verify.mjs` | Verifier of a complete change (Stop hook, blocks), and its tests |
| `website/` | Website: layout, pages, texts for each language in `i18n/`, styles, script, font, nginx container (`Dockerfile`, `nginx/`) and its test `test.sh` |
| `scripts/build-website.mjs` | Website build without dependencies, and its tests in `scripts/website.test.mjs` |
| `.github/workflows/` | CI: `validate.yml` for each push and pull request, `publish.yml` for each release tag |
| `hooks/hooks.json` | Stop and SubagentStop hooks that run the check, and the Stop hook that runs the verifier |
| `openspec/` | Specs and changes of sparc |
| `docs/` | Backlog, C4 diagrams, canvas and ADRs of sparc |
| `CHANGELOG.md` | Changes for each release |

<!-- sparc:begin -->
## Rules

- Write all English text in ASD-STE100 Simplified Technical English.
- Write only what you know. Get evidence from files, tests or the user. Write open points in the canvas.
- Keep it simple. Keep each fact in one place (DRY). Link to it from other places.
- Change behavior only through an OpenSpec change: propose, apply, archive. Running apply approves the change.
- After each step, keep the documents in sync. Use `/sparc:sync`.
- Do not change a decided ADR. Amend it or supersede it.
- Follow only current ADRs: `accepted`, `amended`, or `proposed` in its own change. Read the status first. For a superseded ADR, follow the `superseded by` chain. The sparc rule `rules/adr.md` tells the details.
- Use Conventional Commits. Follow the workflow in `openspec/config.yaml` (`trunk` or `pull-request`). Keep `CHANGELOG.md` and the version in the manifest equal.
- Put project rules outside the sparc markers. `/sparc:update` replaces the text between them.
<!-- sparc:end -->

## Project rules

- `scripts/check.mjs` has no dependencies. Keep it like that.
- Commit on `main`. The manifest is `.claude-plugin/plugin.json`.
- The `ref` of the sparc entry in `.claude-plugin/marketplace.json` is a version file. Set it to `v<version>` in the release commit. Push the release commit and the tag together: `git push --atomic origin main v<version>`.
