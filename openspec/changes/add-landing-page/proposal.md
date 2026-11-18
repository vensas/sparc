## Why

sparc has no web page. The repository `vensas/sparc` becomes public, and tech leads and architects need one place that tells what sparc does, shows the loop of a change and gives the install commands. Backlog item: "A landing page for sparc at `sparc.apps.vensas.de`".

## What Changes

- A static website in `website/`: a landing page, an imprint and a privacy policy, each in English, German and French.
- The landing page follows the mockup [docs/mockups/add-landing-page/index.html](../../../docs/mockups/add-landing-page/index.html) (direction "Standards Manual", chosen by the user). It uses the sparc logo and colors from `docs/assets/`.
- The landing page shows the loop of a change, the roles, the document set, the record of sparc (sparc is built with sparc) and the install steps. The record comes from the files of the repository, not from copied numbers.
- The imprint uses the company data from the imprint of vensas (https://vensas.de/de/imprint). The privacy policy is minimal and covers the hosting and the server log.
- The footer links to https://vensas.de.
- The site sets no cookies and loads nothing from other servers.
- A script without dependencies builds the site. An nginx container serves it.
- An Aspire AppHost runs the container locally and generates the Kamal 2 configuration (package `Vensas.Aspire.Hosting.Kamal`). A GitHub Actions workflow deploys the container with Kamal to a server of vensas at `sparc.apps.vensas.de`. Kamal runs several apps on one server, so the site shares the server with other apps.
- The repository contains no internal data of the server: no address, no key and no other credential. The workflow reads them from repository secrets.

Out of scope:

- Making the repository `vensas/sparc` public, and the related change to the README section "Install". New backlog item.
- The DNS record for `sparc.apps.vensas.de` and the repository secrets. The operator of the server adds them.
- A legal review of the imprint and the privacy policy. It is an open point in the canvas and a manual check before go-live.
- Analytics, a newsletter form, a blog and a search.
- A website for each sparc project. `/sparc:init` does not make a website.

## Capabilities

### New Capabilities

- `website`: the public website of sparc. Its pages, languages, legal pages, privacy constraints, build and deployment.

### Modified Capabilities

None.

## Impact

- New: `website/` (pages, texts, nginx container, Aspire AppHost, container test), `scripts/build-website.mjs`, `scripts/website.test.mjs`, `.github/workflows/website.yml`, `.gitignore`.
- New tools for the website only: Docker or Podman, the .NET SDK and the Aspire CLI. The plugin itself does not need them.
- New for design work: `PRODUCT.md` and `.impeccable/surfaces/` (product facts and the direction contract for impeccable).
- `README.md`, `AGENTS.md`, `CHANGELOG.md`, `docs/architecture/c4.md`, `docs/architecture/canvas.md`, `docs/backlog.md`.
