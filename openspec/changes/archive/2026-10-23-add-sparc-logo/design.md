## Context

See proposal.md for the reason. The user chose concept A and the gold spark in the mockup `docs/mockups/add-sparc-logo/index.html`. GitHub shows images in a README through its image proxy, so an SVG cannot load web fonts or scripts.

## Goals / Non-Goals

**Goals:**
- One symbol for the README lockup and the plugin icon.
- Good contrast on the light and the dark GitHub theme.

**Non-Goals:**
- A full brand guide.

## Decisions

- **Files.** `docs/assets/logo-light.svg` and `docs/assets/logo-dark.svg` hold the symbol and the word. `docs/assets/icon.svg` holds the symbol on a purple tile. `.claude-plugin/icon.png` is made from `icon.svg` with `rsvg-convert -w 512 -h 512`. The plugin validator looks for this path.
- **Theme.** The README uses `<picture>` with `<source media="(prefers-color-scheme: dark)">`. GitHub documents this pattern. Alternative: one SVG with an internal media query. Rejected, because not all viewers apply media queries inside an image.
- **Word "sparc".** SVG `<text>` with the font stack `system-ui, -apple-system, "Segoe UI", sans-serif`, weight 650. No tool to convert text to paths is installed (no Inkscape). The word can look a little different on each operating system.
- **Spark size.** Larger than in the mockup (scale 1.35 instead of 1.15), so that the spark stays visible at 16 px.
- **README title.** The image replaces the plain title text. The `alt` text is "sparc", so the README still has a name for screen readers.

No ADR: a logo is easy to change.
C4 impact: none.
Test tool: `node --test 'scripts/*.test.mjs'` (node:test, see `AGENTS.md`). A test checks the files, the colors, the README references and the PNG size. A screenshot of the README shows the look.

## Risks / Trade-offs

- [The word font differs between systems] → The symbol carries the identity. The word uses common system fonts.
- [Team colors of the Lakers] → Only the two color values are used, not a Lakers logo or name in the image.
