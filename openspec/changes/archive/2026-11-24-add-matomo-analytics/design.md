## Context

See proposal.md, "Why". The website now promises "No cookies, no tracking" (footer, privacy policy section 2, requirement "No cookies and no third-party requests"). The other vensas websites count visits with Matomo Cloud on `vensas.matomo.cloud`. The user selected the consent pattern of `vensas/vensas-libs-web` (README, section "Analytics", and `src/scripts/analytics.ts`) on 2026-11-23. The user made the Matomo site 9 for `sparc.apps.vensas.de`. The user confirmed on 2026-11-23 that site 9 has the instance settings of the libs sites: a shortened IP address and a storage period of 12 months.

## Goals / Non-Goals

**Goals:**
- Count page views and the copy of the install commands, only with consent.
- Load nothing from Matomo and set no cookie before consent.

**Non-Goals:**
- Other events, outbound links and the heartbeat (see proposal.md, "Out of scope").
- A consent tool from a vendor.

## Decisions

ADRs: none. Analytics on the website is not central to the idea of sparc (see `rules/adr.md`).

- **Consent pattern.** Copy the behavior of `vensas-libs-web`. Options: the pattern of `incident-live` (rejected: `forgetConsentGiven` sets the cookie `mtm_consent_removed`, and the choice has no expiry), cookieless Matomo without a banner (rejected by the user: all vensas sites ask for consent), the pattern of `vensas-libs-web` (selected by the user). Behavior: `requireConsent`, then `setConsentGiven` for the current page only, so Matomo sets no consent cookie of its own. The site keeps the choice in `localStorage`.
- **Storage entry.** Key `sparc-consent`, value JSON `{"v": 1, "choice": "granted" | "denied", "at": <ms>}`. The script ignores an entry with another `v`, an unknown choice, a date in the future, or a date older than 365 days. Raise `v` when what the site counts changes. Without storage, the choice applies to the current page.
- **Matomo commands.** `requireConsent`, `setConsentGiven`, `setTrackerUrl https://vensas.matomo.cloud/matomo.php`, `setSiteId "9"`, `setDomains ["sparc.apps.vensas.de"]`, `disablePerformanceTracking`, `HeatmapSessionRecording::disable`, `disableBrowserFeatureDetection` (as a function after `setConsentGiven`, because `setConsentGiven` turns the detection on again and matomo.js runs it first), `trackPageView`. `disablePerformanceTracking` keeps the load times out of the page view. `HeatmapSessionRecording::disable` stops the request for the heatmap configuration of the Matomo instance, which the Content Security Policy does not permit. No `enableLinkTracking` and no `enableHeartBeatTimer`, as the user decided. `disableBrowserFeatureDetection` keeps the data small: Matomo gets no screen resolution and no plugin list. The script is `https://cdn.matomo.cloud/vensas.matomo.cloud/matomo.js`, loaded with `async` only after consent.
- **Copy event.** The existing copy handler in `site.js` calls `trackEvent("Install", "Copy", <agent>)`. The agent comes from the selected tab (`claude` or `copilot`). The call does nothing without consent. A person with access to Matomo makes a goal on site 9 for this event.
- **Host check.** The script starts Matomo only when `location.hostname` is `sparc.apps.vensas.de`. In a local run and in `website/test.sh`, the banner shows, but nothing goes to Matomo.
- **Withdrawal.** "Decline" after "Allow" empties the queue `_paq` when `matomo.js` did not run yet, pushes `requireConsent` when it ran, deletes each cookie that starts with `_pk_` or `mtm_` (path `/`, with and without the host as domain), and reloads the page so that `matomo.js` unloads. `forgetConsentGiven` and `optUserOut` are not used, because they set `mtm_consent_removed`.
- **Do Not Track and Global Privacy Control.** When `navigator.doNotTrack === "1"` or `navigator.globalPrivacyControl === true`, and there is no stored choice, the banner does not show. "Cookie settings" still opens it.
- **Markup.** The banner is static HTML in `website/layout.html`, a `<section aria-labelledby>` with `hidden`. The texts come from `website/i18n/*.json`, so each language has its text without JavaScript strings. The script removes `hidden`. The "Cookie settings" button is a `<button hidden>` in the footer list "Legal". The script removes `hidden`, like the color scheme switch. Without JavaScript, both stay hidden and nothing loads. Options: a banner made by the script (rejected: texts in the script for each language), a `<dialog>` (rejected: modal, and the spec does not permit a focus trap).
- **Style.** A card at the bottom right, 22 rem wide, with the accent bar at the top like the page. Below 560 px, it uses the full width with a 16 px margin. Both buttons use the style of the "Copy" button, with the same size. Mockup: `docs/mockups/add-matomo-analytics/index.html`.
- **Content Security Policy.** Add `https://cdn.matomo.cloud` to `script-src`, and `https://vensas.matomo.cloud` to `img-src` and a new `connect-src`. `incident-live` uses the same values. A test compares the hosts in `site.js` with the policy.
- **Footer text.** Remove `footer.nocookies` ("No cookies, no tracking"). It is not true after this change.
- **Privacy policy.** Rewrite section 2 ("What this website does not do") and add a section "Analytics with Matomo" after section 3. Base: `docs/legal/privacy-policy-sections.md` of `vensas-libs-web`, with only the data of this site: page views, the referrer, browser and operating system from the user agent, the shortened IP address and the country, the time of the visit, and the copy event. Cookies `_pk_id` (13 months), `_pk_ses` (30 minutes), `_pk_ref` (6 months). Provider: InnoCraft Ltd., the operator of Matomo Cloud, as a processor.
- **Test tool.** `node --test 'scripts/*.test.mjs'` (node:test). The tests run the real `site.js` against a small stand-in of the DOM, `localStorage`, `document.cookie` and `navigator`, as for the agent switch and the color scheme switch. They check the queue `_paq` and the script elements, not real requests. `website/test.sh` checks the headers of the container. The real requests to Matomo are a manual check in `qa.md` on `https://sparc.apps.vensas.de/` after the deployment, with the network panel of a browser and the Matomo real-time view.

## C4 impact

- New external system `matomo` "Matomo Cloud" ("Counts visits of the website at vensas.matomo.cloud, site 9") in the container diagram.
- New relation `Rel(website, matomo, "Sends page views and copy events with consent to")`.
- The system context diagram does not change. Matomo Cloud is a service of the website only.

## Risks / Trade-offs

- [The privacy policy has no legal review] → Already an open point in the canvas. The text follows the text of the libs sites.
- [Some visitors decline or use Do Not Track] → Accepted. The numbers show only visitors with consent.
- [The Matomo goal for the copy event needs a manual step in Matomo] → A task names it. Until the goal exists, the events show in the event report.
- [A change of the instance settings of Matomo makes the privacy policy wrong] → The canvas names the settings that the text depends on.

## Migration Plan

Deploys with the next release. Rollback: revert the commits of the change. A stored `sparc-consent` entry has no effect after a rollback.

## Open Questions

None.
