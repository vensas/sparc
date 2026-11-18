# QA

Test tool (design.md, "Test tool"): node:test in `scripts/website.test.mjs` runs the real `site.js` against a stand-in of the DOM of a built page. A manual check in a browser covers the visual result and the focus.

| Scenario | Result | Evidence |
|---|---|---|
| Color scheme switch: Select the dark scheme | passed | "Color scheme switch: Select the dark scheme", `node --test 'scripts/*.test.mjs'`, 258 passed, 0 failed. See also "Manual checks" |
| Color scheme switch: Start with the system preference | passed | "Color scheme switch: Start with the system preference" (also a later change of the system preference), `node --test 'scripts/*.test.mjs'`, 258 passed, 0 failed. See also "Manual checks" |
| Color scheme switch: Switch the scheme with the keyboard | passed | "Color scheme switch: Switch the scheme with the keyboard" (native button, global focus style), `node --test 'scripts/*.test.mjs'`, 258 passed, 0 failed. See also "Manual checks" |
| Color scheme switch: Switch without JavaScript | passed | "Color scheme switch: Switch without JavaScript" (`hidden` on the list item in the HTML, the system preference media query), `node --test 'scripts/*.test.mjs'`, 258 passed, 0 failed |

## Manual checks

### Color scheme switch: visual result and focus in a browser

- Reason: the colors, the icons and the visible focus need a real browser.
- Steps: `node scripts/build-website.mjs`, serve `_site/` on localhost, open it with Playwright (Chromium). At 1440 × 900 px with a light system preference: open `/`, move the focus from "DE" with Tab, press Enter; open `/de/` and click the switch. At 360 × 800 px with a dark system preference: open `/de/imprint.html`.
- Expected result: light page with a moon and the switch not pressed; after Enter or a click the dark page with a sun, the switch pressed, and a visible focus outline after Tab; at 360 px a dark page, the switch pressed, no horizontal scroll; no cookie and no storage entry.
- Result: passed on 2026-11-18. First build (text button): after Tab and Enter, `data-theme="dark"`, `aria-pressed="true"`, body `rgb(15, 12, 20)`, focus outline `solid`, `document.cookie` empty, `localStorage.length` 0; at 360 px `aria-pressed="true"`, no `data-theme`, no horizontal scroll. After the icon fix (e257a05): `/de/` shows the moon after "EN DE" in the light scheme, and the sun after a click in the dark scheme.

## Code review

Reviewed: `11b6b53..11b6b53` (workflow `trunk`, after the proposal commit 565e45b)
Context: fresh

| Finding | Fix |
|---|---|
| `website/layout.html:30`: `hidden` is on the button, so an empty `<li>` stays in the list without JavaScript | e257a05: `hidden` is on the `<li>`, and the script shows it |
| `website/i18n/*.json`: the navigation name "Sections and language" does not tell the switch | e257a05: "Sections, language and color scheme" / "Abschnitte, Sprache und Farbschema", with a test |
| Commit 11b6b53 has the type `fix`, but the change adds a requirement | No change: the user asked for a fix release on 2026-11-18. The styles already had the dark scheme for `data-theme`, but no control set it. The commits are local, not pushed |
| `scripts/website.test.mjs`: no test for a change of the system preference (design.md, "State") | e257a05: "Start with the system preference" changes the preference and checks `aria-pressed`, also after a selection |
| `scripts/website.test.mjs`: the keyboard test checks the exact attribute order | e257a05: the test checks each attribute on its own. The real keyboard check is in "Manual checks" |
| `scripts/website.test.mjs`: `fire()` passes an unused `preventDefault` | e257a05: removed |

Also in e257a05, after user feedback ("the switch with label 'dunkel' is not really visually appealing"): the switch is an icon button. design.md, DESIGN.md and the mockup tell the new control.

After the fixes: `node --test 'scripts/*.test.mjs'`, 258 passed, 0 failed. `node scripts/check.mjs`: no findings.

## Acceptance

Accepted on 2026-11-18 by the product owner role. 4 scenarios passed, no scenario failed, the manual check passed, and each code review finding has a fix or a reason.
