## ADDED Requirements

### Requirement: Consent to analytics

On the first visit, each page SHALL show a banner that asks for consent to count the visit with Matomo. The banner SHALL have the buttons "Allow" and "Decline" with the same size and style, and a link to the privacy policy in the language of the page. On a desktop width, the banner SHALL NOT cover the content of the first viewport. It SHALL NOT trap the focus. Without JavaScript, the banner SHALL NOT show.

#### Scenario: First visit

- **WHEN** a visitor without a stored choice opens `/`
- **THEN** the banner shows with "Allow", "Decline" and a link to `/privacy.html`, and no request goes to another origin

#### Scenario: Allow

- **WHEN** a visitor clicks "Allow" in the banner on `https://sparc.apps.vensas.de/`
- **THEN** the banner closes, the Matomo script loads, and Matomo gets a page view for site 9

#### Scenario: Decline

- **WHEN** a visitor clicks "Decline" in the banner
- **THEN** the banner closes, no request goes to Matomo, and the browser has no cookie

#### Scenario: Banner with the keyboard

- **WHEN** a visitor moves the focus to the banner with Tab and presses Enter on "Decline"
- **THEN** the banner closes, and the focus is visible on each button before the press

#### Scenario: Banner without JavaScript

- **WHEN** a visitor opens a page with JavaScript turned off
- **THEN** the banner does not show, and no request goes to Matomo

### Requirement: Stored consent choice

The site SHALL keep the choice of the visitor in the local storage of the browser under one entry with the choice and its date. The site SHALL show the banner again when the entry is older than 365 days or when the site changes what it counts. When the browser storage is not available, the choice SHALL apply to the current page only.

#### Scenario: Next page after a choice

- **WHEN** a visitor allowed the analytics and opens `/de/`
- **THEN** the banner does not show, and Matomo gets the page view

#### Scenario: Choice older than one year

- **WHEN** the stored choice of a visitor is 366 days old and the visitor opens `/`
- **THEN** the banner shows again, and nothing goes to Matomo before a new choice

#### Scenario: No storage before a choice

- **WHEN** a visitor opens a page and makes no choice
- **THEN** the local storage, the session storage and the cookies of the site are empty

### Requirement: Do Not Track and Global Privacy Control

When the browser sends "Do Not Track" or "Global Privacy Control", the site SHALL NOT show the banner and SHALL NOT count the visit. The visitor SHALL be able to allow the analytics through "Cookie settings" in the footer.

#### Scenario: Global Privacy Control

- **WHEN** a visitor with Global Privacy Control opens `/`
- **THEN** the banner does not show, and no request goes to Matomo

#### Scenario: Allow through the cookie settings

- **WHEN** a visitor with Do Not Track opens "Cookie settings" and clicks "Allow"
- **THEN** Matomo gets the page view

### Requirement: Withdraw the consent

The footer of each page SHALL have a "Cookie settings" button that opens the banner. When a visitor declines after an earlier consent, the site SHALL delete the Matomo cookies and SHALL send no more data to Matomo. Without JavaScript, the button SHALL NOT show.

#### Scenario: Open the cookie settings

- **WHEN** a visitor clicks "Cookie settings" in the footer
- **THEN** the banner shows, and the focus moves to its first button

#### Scenario: Withdraw

- **WHEN** a visitor who allowed the analytics opens "Cookie settings" and clicks "Decline"
- **THEN** the browser has no cookie that starts with `_pk_` or `mtm_`, and no more request goes to Matomo

### Requirement: Analytics data

With consent, the site SHALL send to the Matomo site 9 on `vensas.matomo.cloud` only the page view of each page and an event when the visitor copies the install commands. The event SHALL have the category `Install`, the action `Copy` and the name of the agent (`claude` or `copilot`). Only the host `sparc.apps.vensas.de` SHALL send data. The site SHALL NOT send outbound link clicks, the time on a page or browser features.

#### Scenario: Copy the install commands with consent

- **WHEN** a visitor with consent selects "GitHub Copilot" and clicks "Copy"
- **THEN** Matomo gets an event with the category `Install`, the action `Copy` and the name `copilot`

#### Scenario: Copy the install commands without consent

- **WHEN** a visitor without consent clicks "Copy"
- **THEN** no request goes to Matomo

#### Scenario: Local run

- **WHEN** a visitor allows the analytics on `http://localhost:8080/`
- **THEN** no request goes to Matomo

### Requirement: Privacy policy for analytics

The privacy policy SHALL describe Matomo: the provider of Matomo Cloud, the purpose, the data, the shortened IP address, the cookies with their lifetime, the storage entry of the choice, the storage period of 12 months in the EU, the legal basis Art. 6 (1) (a) GDPR with § 25 (1) TDDDG, and how to withdraw the consent with "Cookie settings".

#### Scenario: Matomo in the privacy policy

- **WHEN** a visitor reads the privacy policy in any language
- **THEN** it names Matomo, InnoCraft, `_pk_id`, `_pk_ses`, `_pk_ref`, Art. 6 (1) (a) GDPR, § 25 TDDDG and "Cookie settings"

## MODIFIED Requirements

### Requirement: Privacy policy for the hosting

The privacy policy SHALL name the hosting company with its address and link to its privacy policy. It SHALL list the data in the access log of the server, the purpose, the legal basis and the rule that decides how long the server keeps the log. It SHALL tell that the site sets no cookies and loads nothing from other servers without the consent of the visitor.

#### Scenario: Hosting

- **WHEN** a visitor reads the privacy policy in any language
- **THEN** it names the hosting company, lists the IP address, the date and time, the requested page and the browser as log data, and names Art. 6 (1) (f) GDPR as the legal basis

### Requirement: No cookies and no third-party requests without consent

Without the consent of the visitor, the website SHALL set no cookies, SHALL load nothing from another origin, and SHALL write nothing to the browser storage. The site SHALL load all fonts, images, styles and its own scripts from its own origin. With consent, only the Matomo script and the Matomo tracking requests SHALL go to another origin. Links to other sites SHALL load nothing before a visitor clicks them.

#### Scenario: Resources of a page

- **WHEN** the built site is scanned for `src`, `href` of `<link>`, `url()` in CSS and `@import`
- **THEN** each value is a relative path or a path on the own origin

#### Scenario: No cookies

- **WHEN** a visitor opens any page and makes no choice in the banner
- **THEN** the site sets no cookie and no request goes to another origin

#### Scenario: No cookie from the server

- **WHEN** a visitor opens any page
- **THEN** the response has no `Set-Cookie` header

### Requirement: Footer

Each page SHALL have a footer with a link to https://vensas.de, links to the imprint and the privacy policy in the current language, the "Cookie settings" button, a link to the repository, the license and the sparc version from `.claude-plugin/plugin.json`.

#### Scenario: Footer of the German landing page

- **WHEN** a visitor opens `/de/index.html`
- **THEN** the footer links to `https://vensas.de`, `/de/imprint.html` and `/de/privacy.html`, has the button "Cookie-Einstellungen", and shows the version in `plugin.json`

### Requirement: Web server

A container SHALL serve the site with nginx. It SHALL answer only for the host `sparc.apps.vensas.de` and, in a local run, `localhost`, and SHALL answer `/health` for each host. Each response SHALL have a Content Security Policy without `unsafe-inline`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff` and `Referrer-Policy`, and no `Server` header. The Content Security Policy SHALL permit other origins only for the Matomo script and the Matomo tracking requests. The server SHALL allow only GET and HEAD, and SHALL show its own 404 page in the language of the path.

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

#### Scenario: Content Security Policy for Matomo

- **WHEN** a visitor opens any page
- **THEN** the Content Security Policy permits `https://cdn.matomo.cloud` only for scripts and `https://vensas.matomo.cloud` only for images and connections, and no other origin

## RENAMED Requirements

- FROM: `### Requirement: No cookies and no third-party requests`
- TO: `### Requirement: No cookies and no third-party requests without consent`
