## ADDED Requirements

### Requirement: Pages in two languages

The website SHALL have a landing page, an imprint and a privacy policy in English and German. English SHALL be at the root path. German SHALL be under `/de/`. Each page SHALL set its language in `<html lang>`, link to the same page in the other language, and declare the links with `hreflang`.

#### Scenario: Pages of the built site

- **WHEN** the build of the website completes
- **THEN** the output has `index.html`, `imprint.html`, `privacy.html` and `404.html` at the root and in `de/`

#### Scenario: Change the language

- **WHEN** a visitor opens `/de/imprint.html` and selects "EN"
- **THEN** the browser opens `/imprint.html`

#### Scenario: Language of a page

- **WHEN** a visitor opens `/de/index.html`
- **THEN** the page has `<html lang="de">` and `<link rel="alternate">` entries with `hreflang` `en` and `de`

### Requirement: First viewport of the landing page

The landing page SHALL show the sparc logo, a short statement of what sparc does, the CLI commands to add the marketplace and install sparc, and a link to the repository on GitHub, in the first viewport at a width of 1440 px.

#### Scenario: First viewport

- **WHEN** a visitor opens `/` in a window of 1440 × 900 px
- **THEN** the logo, the heading, the commands `claude plugin marketplace add vensas/sparc` and `claude plugin install sparc@sparc`, and a link to `https://github.com/vensas/sparc` are visible without a scroll

#### Scenario: Copy the install commands

- **WHEN** a visitor clicks "Copy" next to the install commands
- **THEN** the clipboard holds the two commands, one on each line

### Requirement: Sections of the landing page

Below the first viewport, the landing page SHALL show in this order: why (the problems that sparc solves, each with what sparc does about it), the steps of a change, the roles, the document set, the record of sparc, a FAQ and the install steps. The problems and the FAQ answers SHALL state only facts that the README or the canvas also states.

#### Scenario: Problems and answers

- **WHEN** a visitor scrolls below the first viewport
- **THEN** the section "Why" comes first and pairs each problem with what sparc does about it

#### Scenario: Order of the sections

- **WHEN** a visitor reads the landing page from top to bottom
- **THEN** the sections are why, loop, roles, documents, record, FAQ and install

### Requirement: FAQ

The FAQ SHALL show each question as a control that opens and closes its answer with a pointer and with the keyboard.

#### Scenario: Open a FAQ answer with the keyboard

- **WHEN** a visitor moves the focus to a FAQ question with Tab and presses Enter
- **THEN** the answer opens, and a second Enter closes it

### Requirement: Record from the repository

The record on the landing page SHALL show the number of ADRs in `docs/adr/`, the number of archived changes in `openspec/changes/archive/`, the number of releases in `CHANGELOG.md`, the latest version, and the most recent archived changes. The build SHALL read these values from the repository at build time.

#### Scenario: A new release

- **WHEN** `CHANGELOG.md` gets a new release `0.9.0` and the site is built again
- **THEN** the landing page shows `0.9.0` as the latest version and one more release than before

#### Scenario: A template is not an ADR

- **WHEN** `docs/adr/` has `0000-template.md` and 17 other ADR files
- **THEN** the record shows 17 ADRs

### Requirement: Imprint

The imprint SHALL give the information that § 5 DDG requires for vensas GmbH: name and legal form, address, the managing directors, phone, e-mail, register court and number, and VAT ID. The data SHALL agree with the imprint at https://vensas.de/de/imprint. The English imprint SHALL tell that the German text is binding.

#### Scenario: Register data

- **WHEN** a visitor opens the imprint in any language
- **THEN** it shows "Amtsgericht Saarbrücken", "HRB 110062" and "DE366043924"

#### Scenario: Binding language

- **WHEN** a visitor opens `/imprint.html`
- **THEN** the page tells that the German text is binding and links to `/de/imprint.html`

### Requirement: Privacy policy

The privacy policy SHALL name vensas GmbH as the controller with its address and e-mail. It SHALL list the rights of the data subject and the right to complain to a supervisory authority. The English text SHALL tell that the German text is binding.

#### Scenario: Controller and rights

- **WHEN** a visitor reads the privacy policy in any language
- **THEN** it names vensas GmbH with its address and e-mail, and lists the rights of Art. 15 to 18, 20 and 21 GDPR and the right to complain

### Requirement: Privacy policy for the hosting

The privacy policy SHALL name the hosting company with its address and link to its privacy policy. It SHALL list the data in the access log of the server, the purpose, the legal basis and the rule that decides how long the server keeps the log. It SHALL tell that the site sets no cookies and uses no analytics.

#### Scenario: Hosting

- **WHEN** a visitor reads the privacy policy in any language
- **THEN** it names the hosting company, lists the IP address, the date and time, the requested page and the browser as log data, and names Art. 6 (1) (f) GDPR as the legal basis

### Requirement: No cookies and no third-party requests

The website SHALL set no cookies and use no browser storage. It SHALL load all fonts, images, styles and scripts from its own origin. Links to other sites SHALL load nothing before a visitor clicks them.

#### Scenario: Resources of a page

- **WHEN** the built site is scanned for `src`, `href` of `<link>`, `url()` in CSS and `@import`
- **THEN** each value is a relative path or a path on the own origin

#### Scenario: No cookies

- **WHEN** the built site is scanned for `document.cookie`, `localStorage` and `sessionStorage`
- **THEN** none is found

#### Scenario: No cookie from the server

- **WHEN** a visitor opens any page
- **THEN** the response has no `Set-Cookie` header

### Requirement: Footer

Each page SHALL have a footer with a link to https://vensas.de, links to the imprint and the privacy policy in the current language, a link to the repository, the license and the sparc version from `.claude-plugin/plugin.json`.

#### Scenario: Footer of the German landing page

- **WHEN** a visitor opens `/de/index.html`
- **THEN** the footer links to `https://vensas.de`, `/de/imprint.html` and `/de/privacy.html`, and shows the version in `plugin.json`

### Requirement: Accessibility

Each page SHALL meet WCAG 2.2 level AA. Text SHALL have a contrast of 4.5:1 or more, large text 3:1 or more, in the light and the dark color scheme. Each control SHALL work with the keyboard and show a visible focus. Animation SHALL stop when the visitor prefers reduced motion. The page SHALL work at a width of 360 px without a horizontal scroll.

#### Scenario: Reduced motion

- **WHEN** a visitor with `prefers-reduced-motion: reduce` opens the landing page
- **THEN** the steps of a change do not animate

#### Scenario: Narrow screen

- **WHEN** a visitor opens any page at a width of 360 px
- **THEN** the page has no horizontal scroll

### Requirement: Web server

A container SHALL serve the site with nginx. It SHALL answer only for the host `sparc.apps.vensas.de` and, in a local run, `localhost`, and SHALL answer `/health` for each host. Each response SHALL have a Content Security Policy without `unsafe-inline`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff` and `Referrer-Policy`, and no `Server` header. The server SHALL allow only GET and HEAD, and SHALL show its own 404 page in the language of the path.

#### Scenario: Other host

- **WHEN** a request comes for a host other than the site host
- **THEN** the server closes the connection without a response

#### Scenario: Health check

- **WHEN** kamal-proxy requests `/health` with any host
- **THEN** the server answers 200

#### Scenario: Page not found

- **WHEN** a visitor opens `/de/missing.html`
- **THEN** the server answers 404 with the German 404 page

#### Scenario: Security headers

- **WHEN** a visitor opens any page
- **THEN** the response has the security headers and no `Server` header

### Requirement: Access log without IP address

The access log of the website container SHALL NOT contain the IP address of the visitor.

#### Scenario: Access log without IP address

- **WHEN** a visitor opens a page
- **THEN** the log of the container has a line for the request, and the line has no IP address

### Requirement: Build and deployment

A script without npm dependencies SHALL build the site from `website/` into one output folder. An Aspire AppHost SHALL run the site container locally and generate the Kamal configuration. A GitHub Actions workflow SHALL test the site container, and SHALL deploy it with Kamal to the server of `sparc.apps.vensas.de` on each push to `main` that changes the website, its build or the data it reads, and on manual start.

#### Scenario: Build without dependencies

- **WHEN** a developer runs the build command in a clean checkout with Node.js and no `npm install`
- **THEN** the build completes and writes the site

#### Scenario: Local run

- **WHEN** a developer runs the AppHost with `aspire run`
- **THEN** the Aspire dashboard shows the site container, and its endpoint shows the landing page

#### Scenario: Deploy after a change

- **WHEN** a commit on `main` changes a file in `website/`
- **THEN** the workflow tests the container, and after the test deploys it with Kamal

### Requirement: No server data in the repository

The repository SHALL NOT contain the address of the server, an SSH key or another credential for the deployment. The workflow SHALL read them from repository secrets. The generated Kamal configuration SHALL NOT be committed.

#### Scenario: Scan of the tracked files

- **WHEN** the tracked files in `website/` and `.github/workflows/` are scanned for IPv4 addresses and private keys
- **THEN** none is found, except addresses from the documentation ranges of RFC 5737

#### Scenario: Publish without the server address

- **WHEN** a developer runs `aspire publish` without the value `DEPLOY_HOST`
- **THEN** the publish stops and tells that `DEPLOY_HOST` is missing
