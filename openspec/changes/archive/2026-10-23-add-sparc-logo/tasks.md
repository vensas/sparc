# Tasks

## 1. Logo files

- [x] 1.1 Add `docs/assets/logo-light.svg`, `docs/assets/logo-dark.svg` and `docs/assets/icon.svg` from concept A, and make `.claude-plugin/icon.png` (512 × 512 px) with `rsvg-convert`. Verify: `node --test 'scripts/*.test.mjs'` passes with a test for the files, colors and PNG size, and `claude plugin validate .` reports no `ICON_MISSING`. Documents: none.

## 2. README and changelog

- [x] 2.1 Show the logo at the top of `README.md` with `<picture>` for the light and dark theme. Add the `CHANGELOG.md` Unreleased entry. Verify: a test checks the README references, and `node scripts/check.mjs` passes. Documents: README.md, CHANGELOG.md.
