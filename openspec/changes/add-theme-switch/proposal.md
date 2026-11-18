## Why

The website follows the color scheme of the system, and the styles already support a light and a dark scheme on the root (`data-theme`). But no control sets the scheme. A visitor cannot select the other scheme on the site. The user asked for a light/dark switch on 2026-11-18 (backlog item "A light/dark switch on the website").

## What Changes

- Each page gets a switch in the masthead, after the language switch. It selects the light or the dark color scheme.
- The switch starts with the system preference of the visitor.
- A selection applies only to the current page. The site stores nothing, so the requirement "No cookies and no third-party requests" stays as it is (decision of the user on 2026-11-18).
- Without JavaScript, the switch does not show, and the page follows the system preference.

Out of scope:

- Storage of the selection across pages or visits. This needs browser storage and a change of the privacy policy.
- A third state "system" in the switch.
- New colors. The switch uses the existing light and dark tokens.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `website`: new requirement "Color scheme switch".

## Impact

- `website/layout.html`, `website/assets/site.js`, `website/assets/site.css`, `website/i18n/en.json`, `website/i18n/de.json`, `scripts/website.test.mjs`, `DESIGN.md` (masthead component).
