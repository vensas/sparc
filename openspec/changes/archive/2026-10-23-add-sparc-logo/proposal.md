## Why

sparc has no logo. The README starts with plain text, and the plugin validator reports `ICON_MISSING`. A clear, minimal logo makes sparc easy to recognize. It must show the purpose of sparc: spec-driven development together with architecture documentation. Backlog item: "Logo for README and plugin icon".

## What Changes

- A logo from concept A of the mockup ([docs/mockups/add-sparc-logo/index.html](../../../docs/mockups/add-sparc-logo/index.html)): a C4 container box, and the spark of an idea that breaks out at the top right corner, next to the word "sparc".
- Colors chosen by the user: Lakers purple `#552583` for the box and the word, Lakers gold `#fdb927` for the spark. On dark backgrounds, a lighter purple `#b08be0`, because `#552583` has too little contrast there.
- The README shows the logo at the top, in the light or dark variant for the GitHub theme of the reader.
- The plugin icon `.claude-plugin/icon.png` (512 × 512 px): the symbol on a purple tile.

Out of scope:

- A logo for each sparc project. Projects keep their own README.
- Other brand material (fonts, slides, social images).

## Capabilities

### New Capabilities

None. The logo does not change the behavior of sparc, so the change has no spec delta (`skip_specs: true`).

### Modified Capabilities

None.

## Impact

- New: `docs/assets/logo-light.svg`, `docs/assets/logo-dark.svg`, `docs/assets/icon.svg`, `.claude-plugin/icon.png`.
- `README.md`, `CHANGELOG.md`.
