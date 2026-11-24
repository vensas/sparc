# Proposal

## Why

vensas does not know how many visitors read the sparc website and how many of them copy the install commands. The other vensas websites (vensas.de, incident-live, libs.vensas.de, rotstift) count visits with Matomo Cloud on `vensas.matomo.cloud`, only with the consent of the visitor. The user asked for the same on the sparc website on 2026-11-23, with the Matomo site 9 and the consent pattern of `vensas/vensas-libs-web`.

Backlog item: "Analytics with consent on the website" (change: add-matomo-analytics).

## What Changes

- Each page gets a consent banner on the first visit. It asks if vensas can count the visit with Matomo. "Allow" and "Decline" have the same weight. The banner is a card at the bottom right. On a narrow screen, it uses the full width at the bottom.
- Before consent, the site loads nothing from Matomo and sets no cookie.
- With consent, the site sends to Matomo site 9: the page views and an event when the visitor copies the install commands, with the name of the agent. Nothing more.
- The site keeps the choice of the visitor in the browser storage for one year.
- When the browser sends "Do Not Track" or "Global Privacy Control", the banner does not show and nothing is counted.
- The footer gets a "Cookie settings" control that opens the banner again. When a visitor withdraws the consent, the site deletes the Matomo cookies and stops to count.
- The privacy policy gets a section about Matomo, and its section "What this website does not do" changes. The footer text "No cookies, no tracking" goes away.
- The Content Security Policy permits the Matomo script and the Matomo tracking requests.
- Only the host `sparc.apps.vensas.de` sends data to Matomo. A local run sends nothing.

Out of scope:

- Tracking of outbound links, the time on a page (heartbeat), the agent switch, or other events. The user decided on 2026-11-23 to count only page views and the copy of the install commands.
- Storage of the color scheme selection. The requirement "Color scheme switch" stays as it is.
- Matomo Tag Manager, heatmaps and session recordings.
- A legal review of the new privacy policy text. The canvas already has this open point for the privacy policy.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `website`: new requirements "Consent to analytics", "Stored consent choice", "Do Not Track and Global Privacy Control", "Withdraw the consent", "Analytics data" and "Privacy policy for analytics". Changed requirements: "No cookies and no third-party requests" (renamed to "No cookies and no third-party requests without consent"), "Privacy policy for the hosting", "Footer" and "Web server".

## Impact

- `website/layout.html`, `website/assets/site.js`, `website/assets/site.css`, `website/i18n/en.json`, `website/i18n/de.json`, `website/nginx/security-headers.conf`.
- Tests: `scripts/website.test.mjs`, `website/test.sh`.
- Documents: `docs/architecture/c4.md` (new external system Matomo Cloud), `docs/architecture/canvas.md`, `DESIGN.md` (banner component), `CHANGELOG.md`, `docs/backlog.md`.
- External system: Matomo Cloud (`vensas.matomo.cloud`, site 9). A person with access to Matomo makes the goal for the copy event.
