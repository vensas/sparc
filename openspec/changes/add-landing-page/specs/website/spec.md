## ADDED Requirements

### Requirement: Pages in three languages

The website SHALL have a landing page, an imprint and a privacy policy in English, German and French. English SHALL be at the root path. German SHALL be under `/de/` and French under `/fr/`. Each page SHALL set its language in `<html lang>`, link to the same page in the other two languages, and declare these links with `hreflang`.

#### Scenario: Pages of the built site

- **WHEN** the build of the website completes
- **THEN** the output has `index.html`, `imprint.html` and `privacy.html` at the root, in `de/` and in `fr/`

#### Scenario: Change the language

- **WHEN** a visitor opens `/de/imprint.html` and selects "FR"
- **THEN** the browser opens `/fr/imprint.html`

#### Scenario: Language of a page

- **WHEN** a visitor opens `/fr/index.html`
- **THEN** the page has `<html lang="fr">` and `<link rel="alternate">` entries with `hreflang` `en`, `de` and `fr`

### Requirement: Content of the landing page

The landing page SHALL show the sparc logo, a short statement of what sparc does, the CLI commands to add the marketplace and install sparc, and a link to the repository on GitHub, in the first viewport at a width of 1440 px. Below the first viewport, it SHALL show the steps of a change, the roles, the document set, the record of sparc and the install steps.

#### Scenario: First viewport

- **WHEN** a visitor opens `/` in a window of 1440 × 900 px
- **THEN** the logo, the heading, the commands `claude plugin marketplace add vensas/sparc` and `claude plugin install sparc@sparc`, and a link to `https://github.com/vensas/sparc` are visible without a scroll

#### Scenario: Copy the install commands

- **WHEN** a visitor clicks "Copy" next to the install commands
- **THEN** the clipboard holds the two commands, one on each line

### Requirement: Record from the repository

The record on the landing page SHALL show the number of ADRs in `docs/adr/`, the number of archived changes in `openspec/changes/archive/`, the number of releases in `CHANGELOG.md`, the latest version, and the most recent archived changes. The build SHALL read these values from the repository at build time.

#### Scenario: A new release

- **WHEN** `CHANGELOG.md` gets a new release `0.9.0` and the site is built again
- **THEN** the landing page shows `0.9.0` as the latest version and one more release than before

#### Scenario: A template is not an ADR

- **WHEN** `docs/adr/` has `0000-template.md` and 17 other ADR files
- **THEN** the record shows 17 ADRs

### Requirement: Imprint

The imprint SHALL give the information that § 5 DDG requires for vensas GmbH: name and legal form, address, the managing directors, phone, e-mail, register court and number, and VAT ID. The data SHALL agree with the imprint at https://vensas.de/de/imprint. The English and French imprints SHALL tell that the German text is binding.

#### Scenario: Register data

- **WHEN** a visitor opens the imprint in any language
- **THEN** it shows "Amtsgericht Saarbrücken", "HRB 110062" and "DE366043924"

#### Scenario: Binding language

- **WHEN** a visitor opens `/imprint.html` or `/fr/imprint.html`
- **THEN** the page tells that the German text is binding and links to `/de/imprint.html`

### Requirement: Privacy policy

The privacy policy SHALL name vensas GmbH as the controller with its address and e-mail. It SHALL list the rights of the data subject and the right to complain to a supervisory authority. The English and French texts SHALL tell that the German text is binding.

#### Scenario: Controller and rights

- **WHEN** a visitor reads the privacy policy in any language
- **THEN** it names vensas GmbH with its address and e-mail, and lists the rights of Art. 15 to 18, 20 and 21 GDPR and the right to complain

### Requirement: Privacy policy for GitHub Pages

The privacy policy SHALL tell that GitHub Pages hosts the site and records IP addresses, give the legal basis and the basis of the transfer to the USA, and link to the GitHub privacy statement. It SHALL tell that the site sets no cookies and uses no analytics.

#### Scenario: Hosting

- **WHEN** a visitor reads the privacy policy in any language
- **THEN** it names GitHub as the host, Art. 6 (1) (f) GDPR as the legal basis, and links to the GitHub General Privacy Statement

### Requirement: No cookies and no third-party requests

The website SHALL set no cookies and use no browser storage. It SHALL load all fonts, images, styles and scripts from its own origin. Links to other sites SHALL load nothing before a visitor clicks them.

#### Scenario: Resources of a page

- **WHEN** the built site is scanned for `src`, `href` of `<link>`, `url()` in CSS and `@import`
- **THEN** each value is a relative path or a path on the own origin

#### Scenario: No cookies

- **WHEN** the built site is scanned for `document.cookie`, `localStorage` and `sessionStorage`
- **THEN** none is found

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

### Requirement: Build and deployment

A script without npm dependencies SHALL build the site from `website/` into one output folder. A GitHub Actions workflow SHALL build the site and deploy it to GitHub Pages with the custom domain `sparc.apps.vensas.de` on each push to `main` that changes the website, its build or the data it reads, and on manual start.

#### Scenario: Build without dependencies

- **WHEN** a developer runs the build command in a clean checkout with Node.js 20 or later and no `npm install`
- **THEN** the build completes and writes the site

#### Scenario: Deploy after a change

- **WHEN** a commit on `main` changes a file in `website/`
- **THEN** the Pages workflow builds the site and deploys it
