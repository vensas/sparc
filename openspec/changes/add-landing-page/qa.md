# QA

Test tools (design.md, "Test tool"): `scripts/website.test.mjs` (node:test, builds the site into a temporary folder and reads the built files) and `website/test.sh` (builds the container and checks it over HTTP). The test name, or the check name in `test.sh`, names the scenario. CI runs both in the job `test` of `.github/workflows/website.yml`. The job passed locally with `act push -W .github/workflows/website.yml --container-architecture linux/arm64 -j test --container-options "--security-opt label=disable"`.

| Scenario | Result | Evidence |
|---|---|---|
| Pages in two languages: Pages of the built site | passed | "Pages in two languages: Pages of the built site", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Pages in two languages: Change the language | passed | "Pages in two languages: Change the language", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Pages in two languages: Language of a page | passed | "Pages in two languages: Language of a page" and "Same keys in all language files", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| First viewport of the landing page: First viewport | passed | "First viewport of the landing page: First viewport", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed. Screenshot `.impeccable/review/first-viewport.png` at 1440 x 900: logo, heading, the three commands and the GitHub link without a scroll |
| First viewport of the landing page: Copy the install commands | passed | "First viewport of the landing page: Copy the install commands", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Sections of the landing page: Problem of each step | passed | "Sections of the landing page: Problem of each step" (English and German), `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Sections of the landing page: Order of the sections | passed | "Sections of the landing page: Order of the sections", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| FAQ: Open a FAQ answer with the keyboard | passed | "FAQ: Open a FAQ answer with the keyboard" (native `details` and `summary`), `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Record from the repository: A new release | passed | "Record from the repository: A new release", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Record from the repository: A template is not an ADR | passed | "Record from the repository: A template is not an ADR" and "Most recent archived changes", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Imprint: Register data | passed | "Imprint: Register data", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Imprint: Binding language | passed | "Imprint: Binding language", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Privacy policy: Controller and rights | passed | "Privacy policy: Controller and rights", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Privacy policy for the hosting: Hosting | passed | "Privacy policy for the hosting: Hosting", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| No cookies and no third-party requests: Resources of a page | passed | "No cookies and no third-party requests: Resources of a page", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| No cookies and no third-party requests: No cookies | passed | "No cookies and no third-party requests: No cookies", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| No cookies and no third-party requests: No cookie from the server | passed | "no cookie", `CONTAINER=podman website/test.sh`, 32 checks, all passed |
| Footer: Footer of the German landing page | passed | "Footer: Footer of the German landing page" and "Footer of the English landing page", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Accessibility: Reduced motion | manual | See "Manual checks" |
| Accessibility: Narrow screen | manual | See "Manual checks" |
| Web server: Other host | passed | "other host names get no response", `CONTAINER=podman website/test.sh`, 32 checks, all passed |
| Web server: Health check | passed | "health answers for any host", `CONTAINER=podman website/test.sh`, 32 checks, all passed |
| Web server: Page not found | passed | "a missing German page is 404", "the German 404 page is German", "404 pages do not name the server", `CONTAINER=podman website/test.sh`, 32 checks, all passed |
| Web server: Security headers | passed | "no Server header", "CSP without unsafe-inline", "HSTS", "nosniff", "referrer policy", `CONTAINER=podman website/test.sh`, 32 checks, all passed. "Web server: Security headers (no inline styles or scripts for the CSP)", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| Access log without IP address: Access log without IP address | passed | "the log has a line for the request", "the log line has no IP address", `CONTAINER=podman website/test.sh`, 32 checks, all passed |
| Build and deployment: Build without dependencies | passed | All website tests build with Node.js and no `npm install`, `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed. The first stage of `website/Dockerfile` (`node:lts-alpine`) builds the site without `npm install`, `CONTAINER=podman website/test.sh`, 32 checks, all passed |
| Build and deployment: Local run | manual | See "Manual checks" |
| Build and deployment: Deploy after a change | manual | See "Manual checks" |
| No server data in the repository: Scan of the tracked files | passed | "No server data in the repository: Scan of the tracked files" and "Generated Kamal configuration is not committed", `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed |
| No server data in the repository: Publish without the server address | manual | See "Manual checks" |

## Manual checks

### Accessibility: Reduced motion

- Reason: the project has no browser test tool. design.md names manual checks for the visual scenarios.
- Steps: open `/` with `prefers-reduced-motion: reduce` (Playwright `emulateMedia`), scroll to the loop, count the frames with `is-active` or `is-next`.
- Expected result: 0 marked frames, no animation.
- Result: passed on 2026-11-18. 0 marked frames (`.impeccable/review/desktop-reduced.png`, `mobile-reduced.png`). axe-core 4.14.0 finds 0 violations on the 7 pages, light and dark, at 1440 and 390 px. Text on the drawing grid has a contrast of 6.69:1 or more.

### Accessibility: Narrow screen

- Reason: as above.
- Steps: open each page at a width of 360 px and 390 px, compare `document.documentElement.scrollWidth` and `clientWidth`.
- Expected result: no horizontal scroll.
- Result: passed on 2026-11-18. `scrollWidth` equals `clientWidth` on `/`, `/de/`, the legal pages and the 404 page. Code blocks fit at 390 px (12 px font).

### Build and deployment: Local run

- Reason: the scenario needs the Aspire CLI and a container runtime.
- Steps: `aspire run --apphost website/apphost/Sparc.Website.AppHost.csproj`, then open the endpoint of `sparc-web`.
- Expected result: the dashboard shows the container, and its endpoint shows the landing page.
- Result: passed on 2026-11-18 with Aspire 13.6.5 and Podman. The endpoint returned the page with the heading "Specs, architecture and code. In sync at each step."

### Build and deployment: Deploy after a change

- Reason: the deployment needs the repository secrets `DEPLOY_HOST`, `SSH_PRIVATE_KEY` and `SSH_KNOWN_HOSTS` and the DNS record, which do not exist yet (workflow follow-up in tasks.md).
- Steps: add the secrets and the DNS record, push a change in `website/` to `main`, watch the workflow `Website`.
- Expected result: the job `test` passes, then the job `deploy` builds, scans and deploys the image, and https://sparc.apps.vensas.de shows the page.
- Result: open. Done so far: `actionlint` passes, the job `test` passes locally with act, and `kamal config` (Kamal 2.12.0 container) loads the generated `config/deploy.yml`.

### No server data in the repository: Publish without the server address

- Reason: the scenario needs the Aspire CLI.
- Steps: in `website/apphost`, run `aspire publish -o out` without `DEPLOY_HOST`, then with `DEPLOY_HOST=203.0.113.10`.
- Expected result: without the value the publish stops and names `DEPLOY_HOST`. With it, `config/deploy.yml` has the proxy host `sparc.apps.vensas.de`.
- Result: passed on 2026-11-18. Message: "DEPLOY_HOST is missing. Set it to the address of the server."

## Code review

Reviewed: `e6a7647..346ad43` (the 18 commits of add-landing-page after the proposal c1cc69e; the use-node-lts commits in the range excluded; workflow `trunk`)
Context: fresh

| Finding | Fix |
|---|---|
| `.github/workflows/website.yml:76`: `ssh-keyscan` trusts any host key at deploy time and hides its errors | b623aa9: the host key comes from the secret `SSH_KNOWN_HOSTS`; the step stops with a message when it is missing |
| `.github/workflows/website.yml:60, 81, 85, 107`: third-party actions on tags that can move; the registry token is visible to each step | b623aa9: the three third-party actions are pinned to a commit; `KAMAL_REGISTRY_PASSWORD` is set only on the two Kamal steps |
| `website/test.sh:45` (commit 0cfa151): `10.0.0.5` stays in the git history | No change: it is a generic private example address from the reference test, not an address of the server. b82b2d3 replaced it with an RFC 5737 address |
| `docs/architecture/canvas.md:114`, `design.md:36`: software version and traffic numbers of the shared server | b760a4d: removed; only the rule (size limit, no time limit) stays |
| `website/Dockerfile:11`: the nginx user can write `/etc/nginx/site` | 935dd41: the configuration is rendered into `/tmp/site.conf`; `website/test.sh` checks that nothing in `/etc/nginx` is writable |
| `website/nginx/site.conf.template:40`: the 405 body is `application/octet-stream` without `Allow` | 935dd41: `text/plain` with `Allow: GET, HEAD`; two new checks in `website/test.sh` |
| `scripts/build-website.mjs:76`: a page without texts gives an unclear error | 85cf465: "no texts for page "<page>" in <lang>.json"; new test |
| `scripts/build-website.mjs:63`: a missing `de.json` drops German without a message | 85cf465: both languages are required; new test |
| `scripts/build-website.mjs:73, 87`: a missing content line or CRLF line ends give empty content | 85cf465: the split accepts CRLF and a missing line stops the build; two new tests |
| `scripts/build-website.mjs:28`: "latest" falls back to the manifest version | 85cf465: a changelog without a release stops the build; new test |
| `scripts/build-website.mjs:42`: a text value with `{{...}}` is read as a placeholder | 85cf465: item values are put in after the placeholders; new test |
| `website/pages/imprint.html:5`, `privacy.html:5`, `layout.html:21, 40`: hand-written German links, logo SVG two times | 85cf465: `{{german}}` from the `href()` helper; the logo is one `<symbol>` with two `<use>` |
| `scripts/website.test.mjs`: the scan reads the work tree, `URL.pathname`, temporary folders stay | 85cf465: `git ls-files`, `fileURLToPath`, the folders are removed after the tests |
| Scope: `.impeccable/config.json`, `.impeccable/design.json` and `DESIGN.md` are not in the proposal | b760a4d: added to "Impact" in proposal.md |

After the fixes: `node --test 'scripts/*.test.mjs'`, 240 passed, 0 failed. `CONTAINER=podman website/test.sh`, 32 checks, all passed. `actionlint`: no findings. `node scripts/check.mjs`: no findings.
