# Tasks

## 1. Build and English landing page

- [ ] 1.1 Add `scripts/build-website.mjs`, `website/layout.html`, `website/pages/index.html`, `website/i18n/en.json`, the styles and the font from the mockup, and `.gitignore` with `_site/`. The script reads the version and the record from the repository. Verify: `node --test 'scripts/*.test.mjs'` passes with tests in `scripts/website.test.mjs` for the pages, the first-viewport content, the record values, the footer and the scan for third-party resources and cookies. Documents: AGENTS.md (command and structure rows).

## 2. Legal pages

- [ ] 2.1 Add `website/pages/imprint.html` and `website/pages/privacy.html`, and the legal texts in German (binding) and English in the language files. Verify: tests for the register data, the controller, the hosting section and the link to the binding German text pass. Documents: none.

## 3. German and French

- [ ] 3.1 Complete `website/i18n/de.json` and add `website/i18n/fr.json` for all pages, and the language switch with `hreflang`. Verify: tests for each language, `<html lang>`, the `hreflang` links and equal keys in all language files pass. Documents: none.

## 4. Deployment

- [ ] 4.1 Add `.github/workflows/pages.yml` and `website/CNAME`. Verify: `actionlint` passes, and `act push -W .github/workflows/pages.yml --container-architecture linux/arm64 -j build` builds the site. Documents: AGENTS.md (CI row), C4 (already updated in the proposal).

## 5. Finish

- [ ] 5.1 Run the impeccable finish review on the built pages at 1440 px and 390 px, light and dark, and record DESIGN.md. Verify: the reviewer gives `ship`, and `npx @axe-core/cli` reports no violations on the three English pages. Documents: DESIGN.md.
- [ ] 5.2 Link the website in `README.md` and add the `CHANGELOG.md` Unreleased entry. Verify: `node scripts/check.mjs` passes. Documents: README.md, CHANGELOG.md.

## Workflow follow-up

- Set the Pages source to "GitHub Actions", enforce HTTPS and add the DNS record (see design.md, "Migration Plan").
- Get a legal review of the imprint and the privacy policy before the repository becomes public.
