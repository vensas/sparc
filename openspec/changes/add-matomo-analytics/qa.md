# QA

Test tool (design.md, "Test tool"): node:test in `scripts/website.test.mjs` runs the real `site.js` against a stand-in of the DOM, the browser storage, the cookies and the navigator of a built page. `website/test.sh` checks the headers of the container. A browser check with Playwright (Chromium) covers the real requests, the Content Security Policy and the visual result.

Commands on 2026-11-23, after ebf5d83: `node --test 'scripts/*.test.mjs'`, 278 passed, 0 failed. `website/test.sh` (Docker), all checks passed (after f3ca6c0, and again after 8524ab5).

| Scenario | Result | Evidence |
|---|---|---|
| Consent to analytics: First visit | passed | "Consent to analytics: First visit", `node --test 'scripts/*.test.mjs'`, 278 passed. Browser check: banner shows, no request to another origin |
| Consent to analytics: Allow | passed | "Consent to analytics: Allow", 278 passed. Browser check: `matomo.js` loads, `matomo.php` gets a page view for `idsite=9` |
| Consent to analytics: Decline | passed | "Consent to analytics: Decline", 278 passed |
| Consent to analytics: Banner with the keyboard | passed | "Consent to analytics: Banner with the keyboard", 278 passed. Browser check: Tab reaches "Decline" with a `solid` outline, Tab moves to "Allow", Enter allows |
| Consent to analytics: Banner without JavaScript | passed | "Consent to analytics: Banner without JavaScript", 278 passed. Browser check with JavaScript off: no banner, no "Cookie settings", no request to another origin |
| Stored consent choice: Next page after a choice | passed | "Stored consent choice: Next page after a choice", 278 passed. Browser check: `/de/imprint.html` after "Zustimmen" shows no banner and sends the page view |
| Stored consent choice: Choice older than one year | passed | "Stored consent choice: Choice older than one year" (also another version, a future date and an unknown choice), 278 passed |
| Stored consent choice: No storage before a choice | passed | "Stored consent choice: No storage before a choice", 278 passed. Browser check: no cookie and no `localStorage` key before a choice |
| Do Not Track and Global Privacy Control: Global Privacy Control | passed | "Do Not Track and Global Privacy Control: Global Privacy Control" (also Do Not Track), 278 passed. Browser check with `navigator.globalPrivacyControl`: no banner, no request, "Cookie settings" shows |
| Do Not Track and Global Privacy Control: Allow through the cookie settings | passed | "Do Not Track and Global Privacy Control: Allow through the cookie settings", 278 passed |
| Withdraw the consent: Open the cookie settings | passed | "Withdraw the consent: Open the cookie settings", 278 passed. Browser check: the focus is on "Ablehnen" |
| Withdraw the consent: Withdraw | passed | "Withdraw the consent: Withdraw" (before and after `matomo.js` ran), 278 passed. Browser check: after "Ablehnen" the page reloads, the cookies `_pk_id.9.*` and `_pk_ses.9.*` are gone, and no more request goes to Matomo |
| Analytics data: Copy the install commands with consent | passed | "Analytics data: Copy the install commands with consent", 278 passed. Browser check: `e_c=Install&e_a=Copy&e_n=copilot` |
| Analytics data: Copy the install commands without consent | passed | "Analytics data: Copy the install commands without consent", 278 passed |
| Analytics data: Local run | passed | "Analytics data: Local run", 278 passed |
| Privacy policy for analytics: Matomo in the privacy policy | passed | "Privacy policy for analytics: Matomo in the privacy policy", 278 passed |
| Privacy policy for the hosting: Hosting | passed | "Privacy policy for the hosting: Hosting", 278 passed |
| No cookies and no third-party requests without consent: Resources of a page | passed | "No cookies and no third-party requests without consent: Resources of a page", 278 passed |
| No cookies and no third-party requests without consent: No cookies | passed | "No cookies and no third-party requests without consent: No cookies", 278 passed |
| No cookies and no third-party requests without consent: No cookie from the server | passed | `website/test.sh`, "no cookie": ok |
| Footer: Footer of the German landing page | passed | "Footer: Footer of the German landing page", 278 passed |
| Web server: Other host | passed | `website/test.sh`, "other host names get no response": ok |
| Web server: Health check | passed | `website/test.sh`, "health answers for any host": ok |
| Web server: Page not found | passed | `website/test.sh`, "a missing German page is 404", "the German 404 page is German": ok |
| Web server: Security headers | passed | `website/test.sh`, "no Server header", "CSP without unsafe-inline", "HSTS", "nosniff", "referrer policy": ok |
| Web server: Content Security Policy for Matomo | passed | "Web server: Content Security Policy for Matomo", 278 passed. `website/test.sh`, "CSP permits Matomo only": ok. Browser check with the policy of `security-headers.conf`: no CSP violation |

## Manual checks

### Consent banner in a browser, with the requests to Matomo

- Reason: the real `matomo.js`, the cookies that it sets, the Content Security Policy and the visual result need a real browser. The production host is not deployed yet.
- Steps: `node scripts/build-website.mjs` into a temporary folder and serve it on `127.0.0.1`. Open `https://sparc.apps.vensas.de/` with Playwright (Chromium). A route answers each request for this host with the local file and the Content Security Policy of `website/nginx/security-headers.conf`. `matomo.js` loads from the real CDN. The route answers each request to `vensas.matomo.cloud` with 204 and records it, so no data goes to Matomo. Do the steps in the table above. Take screenshots at 1440 × 900 px (light) and 360 × 800 px (dark, German).
- Expected result: as in the table. The page view has `idsite=9`, no `res` parameter (no browser features) and no `pf_` parameter (no load times).
- Result: passed on 2026-11-23, after ebf5d83. The first run, before ebf5d83, showed `pf_` parameters in the page view and a request to `plugins/HeatmapSessionRecording/configs.php`. ebf5d83 fixed both. The screenshots agree with the mockup. At 360 px, there is no horizontal scroll.

### Requests on the production host

- Reason: only the deployed site sends data to Matomo site 9.
- Steps: after the next release, open `https://sparc.apps.vensas.de/` in a private window. Check the network panel before a choice, then click "Allow" and open the real-time view of site 9 in Matomo.
- Expected result: no request to another origin before the choice. After "Allow", the visit shows in the real-time view.
- Result: open. See tasks.md, "Workflow follow-up".

### Matomo goal for the copy event

- Reason: the goal is a setting in Matomo, not in the repository (task 4.2).
- Steps: in Matomo, site 9, add a goal with the trigger "Send an event", condition "Event category" is exactly `Install`, case sensitive, once for each visit. A Matomo goal checks only one event field. `Install` is the only event category of the site, so the action `Copy` needs no condition.
- Expected result: the goal exists.
- Result: passed on 2026-11-23. The user made the goal with the id 16 on site 9. Conversions show after the next release deploys the site.

## Code review

Reviewed: `83c314e..8524ab5` (workflow `trunk`, after the proposal commit dd3d7cf)
Context: fresh

| Finding | Fix |
|---|---|
| `website/assets/site.js`, `start()`: matomo.js runs `disableBrowserFeatureDetection` before `setConsentGiven` (its `applyFirst` list), and `setConsentGiven` turns the detection on again. So the page view still has the browser features. Confirmed in `js/piwik.js` of matomo-org/matomo | ab5a985: a function in the queue turns the detection off after `setConsentGiven` and before `trackPageView`, with a test |
| `scripts/website.test.mjs`, "Web server: Content Security Policy for Matomo": checks only `https:` sources | ab5a985: each source that is not `'self'` or `'none'` must be a Matomo source |
| `website/assets/site.js`: the comment of the color scheme switch says "the site stores nothing" | ab5a985: "the switch stores nothing" |
| `scripts/website.test.mjs`, "Consent to analytics: Banner with the keyboard": the comment refers to a manual check that does not exist | The manual check "Consent banner in a browser" in this file covers the keyboard |
| `website/i18n/*.json`: the privacy policy names the device type, design.md does not | No change: Matomo gets the device type from the user agent, so the text is true |
| `.impeccable/config.json` (8ebedbc): no task names it | No change: an ignore entry of the design tool for the mockup of this change |
| `tasks.md` 3.2: the task text changed during apply | No change: `rules/release.md` tells that the changelog entries come with the archive |

QA found two more problems in the browser (see "Manual checks"). ebf5d83 fixed them with a test.

After the fixes: `node --test 'scripts/*.test.mjs'`, 278 passed, 0 failed. `node scripts/check.mjs`: no findings.

## Open points

- Resolved on 2026-11-23: the requirement "Consent to analytics" said that the banner SHALL NOT cover the main content on a desktop width. At 1440 × 900 px, the card covers a part of the steps 6 and 7 of the loop strip below the first viewport, as in the approved mockup. The user decided to keep the position. The product owner changed the sentence in the spec delta to "On a desktop width, the banner SHALL NOT cover the content of the first viewport". The browser check shows the heading, the install commands and the title block free at 1440 × 900 px.

## Acceptance

Accepted on 2026-11-23 by the product owner role. 26 scenarios passed, no scenario failed, and each code review finding has a fix or a reason. The manual browser check passed. One manual check is open and needs the user: the requests on the production host after the next release. The Matomo goal for the copy event (task 4.2) is goal 16 on site 9.
