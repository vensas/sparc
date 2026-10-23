# QA

Test command: `node --test 'scripts/*.test.mjs'`. Tests: `scripts/logo.test.mjs`.
The change has no spec scenarios (`skip_specs: true`). QA checks the promises of `proposal.md`.

## Code review

Reviewed: `ef05912..2db5563` (software engineer role, `git diff main...HEAD`)

| Finding | Fix |
|---|---|
| The command that makes `.claude-plugin/icon.png` from `docs/assets/icon.svg` was not recorded. | 2db5563 (AGENTS.md command table) |

Also checked: the symbol shapes are in three SVG files. Each file must stand alone, because GitHub shows an SVG in a README as an image. This is not a finding.

## Scenarios

| Scenario | Result | Evidence |
|---|---|---|
| Proposal: logo in Lakers purple and gold, light and dark variant | passed | Test "logo: light and dark variants use the chosen colors and name sparc". `node --test 'scripts/*.test.mjs'`: passed. |
| Proposal: plugin icon 512 x 512 px | passed | Test "logo: plugin icon is a 512 x 512 PNG made from the icon SVG". `node --test 'scripts/*.test.mjs'`: passed. `claude plugin validate .` reports no `ICON_MISSING`. |
| Proposal: README shows the logo for the theme of the reader | passed | Test "logo: README shows the light or dark logo for the theme of the reader". `node --test 'scripts/*.test.mjs'`: passed. |
| Proposal: the logo looks as concept A | manual | See "Manual checks". |

## Manual checks

### Proposal: the logo looks as concept A

- Reason: The look of an image needs a person or a rendering, not a text test.
- Steps: Render `logo-light.svg` on white, `logo-dark.svg` on `#0d1117` and `.claude-plugin/icon.png` with `rsvg-convert`, and look at them.
- Expected result: A container box with a gold spark at the top right corner, and the word "sparc". The symbol is in the center of the icon tile.
- Result: passed. The product owner role looked at the three renderings. The symbol was 2 px off center on the tile and was centered before the commit of task 1.1. Open point: the README on GitHub itself can be seen only after the repository is on GitHub.

## Acceptance

Accepted on 2026-10-23 by the product owner role. All checks passed. The code review finding has a fix.
