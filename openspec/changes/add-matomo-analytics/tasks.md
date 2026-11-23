# Tasks

## 1. Consent banner and Matomo

- [ ] 1.1 Add the banner and the "Cookie settings" button to `website/layout.html`, their texts to `website/i18n/en.json` and `website/i18n/de.json`, and the banner style to `website/assets/site.css`. Remove `footer.nocookies`. Verify: `node --test 'scripts/*.test.mjs'` passes with tests for "Consent to analytics: Banner without JavaScript", "Withdraw the consent: Open the cookie settings" (markup part) and "Footer: Footer of the German landing page". Documents: `DESIGN.md` (banner component).
- [ ] 1.2 Add the consent logic and the Matomo start to `website/assets/site.js` (see design.md, "Consent pattern", "Storage entry", "Matomo commands", "Host check", "Withdrawal", "Do Not Track and Global Privacy Control"). Verify: tests with a stand-in of the DOM pass for "Consent to analytics: First visit", "Allow", "Decline", "Banner with the keyboard"; "Stored consent choice: Next page after a choice", "Choice older than one year", "No storage before a choice"; "Do Not Track and Global Privacy Control: Global Privacy Control", "Allow through the cookie settings"; "Withdraw the consent: Open the cookie settings", "Withdraw"; "Analytics data: Local run".
- [ ] 1.3 Send the event `Install` / `Copy` / `claude` or `copilot` from the copy handler in `site.js`. Verify: tests pass for "Analytics data: Copy the install commands with consent" and "Copy the install commands without consent".

## 2. Server and privacy

- [ ] 2.1 Change the Content Security Policy in `website/nginx/security-headers.conf` (see design.md, "Content Security Policy"). Verify: `website/test.sh` passes with a check for "Web server: Content Security Policy for Matomo", and a test in `scripts/website.test.mjs` finds each Matomo host of `site.js` in the policy.
- [ ] 2.2 Rewrite the privacy policy in `website/i18n/de.json` (binding) and `website/i18n/en.json` (see design.md, "Privacy policy"). Verify: tests pass for "Privacy policy for analytics: Matomo in the privacy policy" and "Privacy policy for the hosting: Hosting", and the test "No cookies and no third-party requests without consent: No cookies" replaces the old text scan.

## 3. Documents

- [ ] 3.1 Check that `docs/architecture/c4.md` shows Matomo Cloud and its relation as in design.md, "C4 impact". Add Matomo Cloud to the canvas section "Technologies", and the Matomo instance settings that the privacy policy depends on to "Core Risks and Missing Information". Verify: `node scripts/check.mjs` passes.
- [ ] 3.2 Add the change to `CHANGELOG.md` under "Unreleased". Verify: `node scripts/check.mjs` passes.

## 4. Integration

- [ ] 4.1 Run all commands in `AGENTS.md` (Test, Check the documents, Validate the plugin, Lint, Test the website container). Verify: each command passes.
- [ ] 4.2 Ask the user to make a goal on Matomo site 9 for the event category `Install`, action `Copy`. Verify: the user confirms the goal, and `qa.md` records it as a manual check.

## Workflow follow-up

- After the next release deploys the site, check on `https://sparc.apps.vensas.de/` that no request goes to Matomo before consent, and that the Matomo real-time view of site 9 shows the visit after "Allow". Record the result in `qa.md`.
- Archive the change with `/sparc:archive add-matomo-analytics`.
