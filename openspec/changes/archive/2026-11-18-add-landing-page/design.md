## Context

See proposal.md, "Why". The user decided these points in the chat:

- The site is in this repository, in `website/`.
- The repository becomes public. The landing page is for tech leads and architects. Its main action is the install.
- Languages: English and German, for all pages. The user first chose French too, and removed it on 2026-11-18.
- Address: `sparc.apps.vensas.de`.
- Build: a Node.js script without dependencies.
- Proof: the history of the sparc repository, with no invented claims.
- Visual direction: "Standards Manual", chosen on the impeccable decision page.
- Deployment: an Aspire AppHost with Kamal 2, on the same server as the other websites of vensas. The repository shows no internal data of vensas.

The company data comes from https://vensas.de/de/imprint and https://vensas.de/de/privacy-policy (read on 2026-11-16). The deployment follows the public package `Vensas.Aspire.Hosting.Kamal` (https://github.com/vensas/aspire-hosting-kamal, README read on 2026-11-18) and an existing vensas website that uses it.

## Goals / Non-Goals

**Goals:**
- One template and one text file for each language. Each fact has one home.
- A static site in one container that Kamal deploys next to other apps on one server.
- No server address, key or credential in the repository, because the repository becomes public.

**Non-Goals:**
- A general static site generator. The script builds only this site.
- A language detection or redirect. English is at the root.
- A contact form or a server-side API. The site is static.

## Decisions

ADRs: none. The website is not central to the idea of sparc (see `rules/adr.md`). The decisions stay in this design.

- **Visual design.** Mockup: [docs/mockups/add-landing-page/index.html](../../../docs/mockups/add-landing-page/index.html). The direction contract is in `.impeccable/surfaces/docs-mockups-add-landing-page-index-html.md`. The product facts for design work are in `PRODUCT.md`, which links to the README for the product description. Options: the roll gave "Standards Manual". The page also offered "Maintenance Manual", six catalog directions and the category standard. The user chose "Standards Manual" and then asked for a more technical and less bold look: a white sheet (dark: near black) with a faint drawing grid, purple only for accents and the title block head, the gold spark only in the logo and the active step, numbered sections and ruled tables. The font is Archivo (SIL OFL 1.1), served from the site. After the impeccable critique on 2026-11-18 (855 visible words, 7.7 screens at 1440 px, each fact told 2 to 4 times), the user chose a shorter page: no "Why" section (each loop step names the problem that it stops), one table for documents and owners instead of the roles and documents tables, 4 FAQ items (the user removed the cost question), and OpenSpec in the hero install. The critique is in `.impeccable/critique/`.
- **Location.** `website/` in this repository. Options: a separate repository. Rejected, because the page shows facts that have their home here (version, changelog, ADRs, logo).
- **Build.** `scripts/build-website.mjs` reads `website/layout.html`, the page bodies in `website/pages/<page>.html` and the texts in `website/i18n/<lang>.json`. It writes `_site/`. It reads the version from `.claude-plugin/plugin.json` and the record from `docs/adr/`, `openspec/changes/archive/` and `CHANGELOG.md`. It copies `docs/assets/` logo files and the fonts. It writes the styles and the script as files, not inline, so that the Content Security Policy needs no `unsafe-inline`. Options: plain HTML files (rejected: the header, footer and legal text are copied 3 times), Astro or Eleventy (rejected: npm dependencies in a repository without them). The user chose the script.
- **Legal texts.** The legal texts are full text blocks in each language file, not sentence by sentence keys. The German text is binding. The English pages tell this and link to it. The imprint names the managing directors, because § 5 DDG requires them. This is an exception to the rule "no real names in documents" in `rules/docs.md`: the website is not a sparc document. The names stay only in the imprint texts.
- **Privacy.** No cookies, no storage, no analytics, no requests to other origins. The only processing of personal data is the request log of kamal-proxy on the server. The nginx log has no IP address. kamal-proxy logs the client address and port, the time, host, path and query, method, status and user agent (`internal/server/logging_middleware.go` of kamal-proxy). The log has a size limit and no time limit (the Kamal default, checked on the server on 2026-11-18). The privacy texts tell this rule, because Art. 13 (2) (a) GDPR allows the criteria when there is no fixed time. The user decided this. The copy button uses the Clipboard API and stores nothing.
- **Container.** `website/Dockerfile` has two stages. The first stage (`node:lts-alpine`) runs `scripts/build-website.mjs`. The second stage is Alpine with nginx and the `headers-more` module, as an unprivileged user on port 8080. The build context is the repository root, because the build reads the record. `website/Dockerfile.dockerignore` limits the context to the files that the build reads. nginx answers only for the site host, and `/health` for each host (kamal-proxy sends no site host). It sends the security headers, no `Server` header, no cookie, and its own 404 page in the language of the path. It allows only GET and HEAD. Its access log has a format without the IP address of the visitor (user decision), so the container keeps no personal data. kamal-proxy terminates TLS and gets the Let's Encrypt certificate.
- **AppHost.** `website/apphost/` is an Aspire AppHost (`Aspire.AppHost.Sdk`, package `Vensas.Aspire.Hosting.Kamal`, .NET SDK version in `website/global.json`). `aspire run` starts the container locally. In publish mode it adds the Kamal environment with the registry `ghcr.io` and the proxy host `sparc.apps.vensas.de`. It reads the server address from the configuration value `DEPLOY_HOST` and stops with a clear message when the value is missing. `aspire publish -o out` writes `config/deploy.yml` into `website/apphost/out/`, which git ignores. Options: a hand-written `config/deploy.yml` (rejected: the other vensas websites use the AppHost, and the user asked for the same pattern), GitHub Pages (rejected by the user: the site goes on the server of the other vensas websites).
- **Deployment.** `.github/workflows/website.yml`. Job `test` on each push and pull request that changes the website or the data it reads: the Node.js tests and `website/test.sh`. Job `deploy` after `test`, on push to `main` and on manual start: `aspire publish`, `kamal build push`, a Trivy scan of the image, `kamal deploy`. Paths: `website/**`, `scripts/build-website.mjs`, `docs/assets/**`, `docs/adr/**`, `openspec/changes/archive/**`, `CHANGELOG.md`, `.claude-plugin/plugin.json`, `.github/workflows/website.yml`. The image goes to `ghcr.io` with the `GITHUB_TOKEN`. Option: deploy only for a release tag. Rejected, because a fix of a legal text must not wait for a release.
- **No internal data in the repository.** The server address is the repository secret `DEPLOY_HOST`. Kamal uses the SSH key in the repository secret `SSH_PRIVATE_KEY`. SSH trusts only the host key in the repository secret `SSH_KNOWN_HOSTS`, not a key that the network gives at deploy time. GitHub masks secret values in the logs, which are public for a public repository, also the address in the output of Kamal. The registry token is set only on the Kamal steps. Third-party actions are pinned to a commit. The repository names no other app on the server, no internal host name and no internal person. The privacy texts name the hosting company, because the GDPR requires it. Public websites of vensas name it too.
- **Test tool.** `node --test 'scripts/*.test.mjs'` (node:test, see `AGENTS.md`). `scripts/website.test.mjs` builds the site into a temporary folder and checks the built HTML: pages, languages, links, record values, legal data, footer, the scan for third-party resources and cookies, and the scan of the tracked website and workflow files for server data. The built HTML is the public interface. `website/test.sh` (POSIX shell and curl, `CONTAINER=docker` or `podman`) builds the image, starts it and checks the HTTP behavior: status codes, headers, host filter, health and 404 pages. CI runs both. Options: Playwright or axe-core. Rejected as a permanent tool, because they add npm dependencies. The visual and accessibility checks (first viewport, contrast, keyboard, 360 px, reduced motion) are manual checks in `qa.md` with screenshots and `npx @axe-core/cli`.
- **Color scheme.** The site follows `prefers-color-scheme` of the browser: light or dark. It has no switch and stores no choice.
- **Archivo font file.** The mockup has the latin subset of the variable font with the axes weight and width (`fonts/archivo.woff2`, 90 KB). It has the characters of German.

## C4 impact

- New person: "Visitor" (reads the website).
- New container in the sparc boundary: "Website" (HTML, CSS, nginx container, Node.js build script, Aspire AppHost).
- New external system: "Server" (runs kamal-proxy and the website container).
- New relations: the CI workflows build the website image and deploy it with Kamal to the server. The server runs the website. The visitor reads the website.

## Risks / Trade-offs

- [The legal texts are not reviewed by a lawyer] → A manual check in `qa.md` before go-live. Open point in the canvas.
- [The English legal texts can differ from the German text] → The German text is binding, and the English pages tell this.
- [The DNS record for `sparc.apps.vensas.de` does not exist] → kamal-proxy gets no certificate before the record exists. Open point in the canvas.
- [A log or a generated file shows the server address] → The address is only in a secret, and GitHub masks it. `out/` is not committed. A test scans the tracked files. The design documents name no software version and no traffic numbers of the server.
- [A new Node.js LTS version or a new Alpine version changes the image] → `test.sh` and the Trivy scan run before each deploy.
- [The website adds .NET, Aspire and Kamal to a Node.js repository] → Only the website and its workflow use them. The plugin, the check and the tests of the plugin do not.
- [The record shows only what the repository has] → Correct by design. No other claims.

## Migration Plan

1. The operator of the server adds the repository secrets `DEPLOY_HOST`, `SSH_PRIVATE_KEY` and `SSH_KNOWN_HOSTS` (the output of `ssh-keyscan` for the server, checked against the host key on the server), and the DNS record `sparc.apps.vensas.de` for the server.
2. Merge the change. The workflow `Website` deploys the site. Start it once by hand if no path changed.
Rollback: `kamal app stop -c config/deploy.yml` from the publish output, or `kamal rollback <version>` for an earlier image.

## Open Questions

- Does vensas GmbH have a data protection officer? The privacy policy of vensas names none. If yes, the privacy policy names the officer.
