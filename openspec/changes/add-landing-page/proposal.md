## Why

sparc has no web page. The repository `vensas/sparc` becomes public, and tech leads and architects need one place that tells what sparc does, shows the loop of a change and gives the install commands. Backlog item: "A landing page for sparc at `sparc.apps.vensas.de`".

## What Changes

- A static website in `website/`: a landing page, an imprint and a privacy policy, each in English, German and French.
- The landing page follows the mockup [docs/mockups/add-landing-page/index.html](../../../docs/mockups/add-landing-page/index.html) (direction "Standards Manual", chosen by the user). It uses the sparc logo and colors from `docs/assets/`.
- The landing page shows the loop of a change, the roles, the document set, the record of sparc (sparc is built with sparc) and the install steps. The record comes from the files of the repository, not from copied numbers.
- The imprint uses the company data from the imprint of vensas (https://vensas.de/de/imprint). The privacy policy is minimal and covers the hosting on GitHub Pages.
- The footer links to https://vensas.de.
- The site sets no cookies and loads nothing from other servers.
- A script without dependencies builds the site. A GitHub Actions workflow deploys it to GitHub Pages at `sparc.apps.vensas.de`.

Out of scope:

- Making the repository `vensas/sparc` public, and the related change to the README section "Install". New backlog item.
- The DNS record for `sparc.apps.vensas.de`. The operator of the domain `vensas.de` adds it.
- A legal review of the imprint and the privacy policy. It is an open point in the canvas and a manual check before go-live.
- Analytics, a newsletter form, a blog and a search.
- A website for each sparc project. `/sparc:init` does not make a website.

## Capabilities

### New Capabilities

- `website`: the public website of sparc. Its pages, languages, legal pages, privacy constraints, build and deployment.

### Modified Capabilities

None.

## Impact

- New: `website/`, `scripts/build-website.mjs`, `scripts/website.test.mjs`, `.github/workflows/pages.yml`, `.gitignore`.
- New for design work: `PRODUCT.md` and `.impeccable/surfaces/` (product facts and the direction contract for impeccable).
- `README.md`, `AGENTS.md`, `CHANGELOG.md`, `docs/architecture/c4.md`, `docs/architecture/canvas.md`, `docs/backlog.md`.
