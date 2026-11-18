# Tasks

## 1. Build and English landing page

- [x] 1.1 Add `scripts/build-website.mjs`, `website/layout.html`, `website/pages/index.html`, `website/i18n/en.json`, the styles and the font from the mockup, and `.gitignore` with `_site/`. The script reads the version and the record from the repository. Verify: `node --test 'scripts/*.test.mjs'` passes with tests in `scripts/website.test.mjs` for the pages, the first-viewport content, the record values, the footer and the scan for third-party resources and cookies. Documents: AGENTS.md (command and structure rows).

## 2. Legal pages

- [x] 2.1 Add `website/pages/imprint.html` and `website/pages/privacy.html`, and the legal texts in German (binding) and English in the language files. Verify: tests for the register data, the controller, the hosting section with the log data and the link to the binding German text pass. Documents: none.

## 3. Language switch

- [x] 3.1 Check the language switch and the `hreflang` links for English and German. Verify: tests for each language, `<html lang>`, the `hreflang` links and equal keys in both language files pass. Documents: none.

## 4. Container and deployment

- [x] 4.1 Add `website/Dockerfile`, `website/Dockerfile.dockerignore`, the nginx configuration, the entrypoint and `website/test.sh`, and the 404 pages in the language files. Verify: `website/test.sh` passes with `CONTAINER=podman` for the scenarios of "Web server", "Access log without IP address" and "No cookie from the server". Documents: AGENTS.md (command and structure rows).
- [x] 4.2 Add the Aspire AppHost in `website/apphost/` with `Vensas.Aspire.Hosting.Kamal` and `website/global.json`, and `website/apphost/out/` in `.gitignore`. Verify: `aspire run` shows the landing page; `DEPLOY_HOST=203.0.113.10 aspire publish -o out` writes `config/deploy.yml` with the proxy host `sparc.apps.vensas.de`, and `kamal config -c config/deploy.yml` loads it; without `DEPLOY_HOST` the publish stops with the message; the node:test scan for server data passes. Documents: AGENTS.md (command rows).
- [ ] 4.3 Add `.github/workflows/website.yml` with the jobs `test` and `deploy`. Verify: `actionlint` passes, and `act push -W .github/workflows/website.yml --container-architecture linux/arm64 -j test` passes. Documents: AGENTS.md (CI row), C4 (already updated in the proposal).

## 5. Finish

- [ ] 5.1 Run the impeccable finish review on the built pages at 1440 px and 390 px, light and dark, and record DESIGN.md. Verify: the reviewer gives `ship`, and `npx @axe-core/cli` reports no violations on the three English pages. Documents: DESIGN.md.
- [ ] 5.2 Link the website in `README.md` and add the `CHANGELOG.md` Unreleased entry. Verify: `node scripts/check.mjs` passes. Documents: README.md, CHANGELOG.md.

## Workflow follow-up

- Add the repository secrets `DEPLOY_HOST` and `SSH_PRIVATE_KEY` and the DNS record, then start the workflow `Website` (see design.md, "Migration Plan").
- Get a legal review of the imprint and the privacy policy before the repository becomes public.
