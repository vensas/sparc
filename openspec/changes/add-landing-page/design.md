## Context

See proposal.md, "Why". The user decided these points in the chat:

- The site is in this repository, in `website/`.
- The repository becomes public. The landing page is for tech leads and architects. Its main action is the install.
- Languages: English, German and French, for all pages.
- Address: `sparc.apps.vensas.de`.
- Build: a Node.js script without dependencies.
- Proof: the history of the sparc repository, with no invented claims.
- Visual direction: "Standards Manual", chosen on the impeccable decision page.

The company data comes from https://vensas.de/de/imprint and https://vensas.de/de/privacy-policy (read on 2026-11-16).

## Goals / Non-Goals

**Goals:**
- One template and one text file for each language. Each fact has one home.
- A site that GitHub Pages can serve as static files.

**Non-Goals:**
- A general static site generator. The script builds only this site.
- A language detection or redirect. English is at the root.

## Decisions

ADRs: none. The website is not central to the idea of sparc (see `rules/adr.md`). The decisions stay in this design.

- **Visual design.** Mockup: [docs/mockups/add-landing-page/index.html](../../../docs/mockups/add-landing-page/index.html). The direction contract is in `.impeccable/surfaces/docs-mockups-add-landing-page-index-html.md`. The product facts for design work are in `PRODUCT.md`, which links to the README for the product description. Options: the roll gave "Standards Manual". The page also offered "Maintenance Manual", six catalog directions and the category standard. The user chose "Standards Manual" and then asked for a more technical and less bold look: a white sheet (dark: near black) with a faint drawing grid, purple only for accents and the title block head, the gold spark only in the logo and the active step, numbered sections and ruled tables. The font is Archivo (SIL OFL 1.1), served from the site.
- **Location.** `website/` in this repository. Options: a separate repository. Rejected, because the page shows facts that have their home here (version, changelog, ADRs, logo).
- **Build.** `scripts/build-website.mjs` reads `website/layout.html`, the page bodies in `website/pages/<page>.html` and the texts in `website/i18n/<lang>.json`. It writes `_site/`. It reads the version from `.claude-plugin/plugin.json` and the record from `docs/adr/`, `openspec/changes/archive/` and `CHANGELOG.md`. It copies `docs/assets/` logo files, the fonts and `website/CNAME`. Options: plain HTML files (rejected: the header, footer and legal text are copied 3 times), Astro or Eleventy (rejected: npm dependencies in a repository without them). The user chose the script.
- **Legal texts.** The legal texts are full text blocks in each language file, not sentence by sentence keys. The German text is binding. The English and French pages tell this and link to it. The imprint names the managing directors, because § 5 DDG requires them. This is an exception to the rule "no real names in documents" in `rules/docs.md`: the website is not a sparc document. The names stay only in the imprint texts.
- **Privacy.** No cookies, no storage, no analytics, no requests to other origins. The only processing is the server log of GitHub Pages. The copy button uses the Clipboard API and stores nothing.
- **Deployment.** `.github/workflows/pages.yml` with `actions/configure-pages`, `actions/upload-pages-artifact` and `actions/deploy-pages`. Triggers: push to `main` with paths `website/**`, `scripts/build-website.mjs`, `docs/assets/**`, `docs/adr/**`, `openspec/changes/archive/**`, `CHANGELOG.md`, `.claude-plugin/plugin.json`, and `workflow_dispatch`. `website/CNAME` holds `sparc.apps.vensas.de`. Option: deploy only for a release tag. Rejected, because a fix of a legal text must not wait for a release.
- **Test tool.** `node --test 'scripts/*.test.mjs'` (node:test, see `AGENTS.md`). `scripts/website.test.mjs` builds the site into a temporary folder and checks the built HTML: pages, languages, links, record values, legal data, footer and the scan for third-party resources and cookies. The built HTML is the public interface. Options: Playwright or axe-core. Rejected as a permanent tool, because they add npm dependencies. The visual and accessibility checks (first viewport, contrast, keyboard, 360 px, reduced motion) are manual checks in `qa.md` with screenshots and `npx @axe-core/cli`.
- **Color scheme.** The site follows `prefers-color-scheme` of the browser: light or dark. It has no switch and stores no choice.
- **Archivo font file.** The mockup has the latin subset of the variable font with the axes weight and width (`fonts/archivo.woff2`, 90 KB). It has the characters of German and French.

## C4 impact

- New person: "Visitor" (reads the website).
- New container in the sparc boundary: "Website" (HTML, CSS, Node.js build script).
- New relations: the CI workflows build and deploy the website. GitHub (Pages) serves the website. The visitor reads the website.

## Risks / Trade-offs

- [The legal texts are not reviewed by a lawyer] → A manual check in `qa.md` before go-live. Open point in the canvas.
- [The French and English legal texts can differ from the German text] → The German text is binding, and the other pages tell this.
- [The DNS record for `sparc.apps.vensas.de` does not exist] → The site works at the GitHub Pages URL first. Open point in the canvas.
- [GitHub Pages on a private repository needs the Team plan, and the site is public] → The organization has the Team plan (`gh api orgs/vensas`). The repository becomes public before go-live.
- [The record shows only what the repository has] → Correct by design. No other claims.

## Migration Plan

1. Merge the change. The Pages workflow deploys the site.
2. In the repository settings, set the Pages source to "GitHub Actions" and enforce HTTPS.
3. The operator of `vensas.de` adds the CNAME record `sparc.apps` → `vensas.github.io`.
Rollback: disable GitHub Pages in the repository settings.

## Open Questions

- Does vensas GmbH have a data protection officer? The privacy policy of vensas names none. If yes, the privacy policy names the officer.
