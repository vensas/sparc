## Context

See proposal.md, "Why". `website/assets/site.css` already has the dark tokens under `@media (prefers-color-scheme: dark)` for `:root:not([data-theme="light"])`, and under `:root[data-theme="dark"]`. So a value of `data-theme` on `<html>` selects the scheme. The user decided on 2026-11-18: no storage.

## Goals / Non-Goals

**Goals:**
- A visitor can select the other color scheme on each page.

**Non-Goals:**
- Storage of the selection (see proposal.md, "Out of scope").

## Decisions

ADRs: none. A display control is not central to the idea of sparc (see `rules/adr.md`).

- **Control.** One `<button type="button" aria-pressed>` with an icon and the text "Dark" ("Dunkel"). Pressed means dark. Options: a tab list "Light | Dark" like the agent switch (rejected: two items in a full masthead), a link (rejected: it changes no location). A native button gives Enter, Space and the focus without more code.
- **State.** The script reads `data-theme` on `<html>`. Without a value, the state is the system preference (`matchMedia('(prefers-color-scheme: dark)')`). A click sets `data-theme` to the other scheme. A change of the system preference updates `aria-pressed` while the visitor did not select a scheme.
- **No JavaScript.** The button has `hidden` in the HTML. The script removes it, like the agent switch.
- **Place and style.** In the masthead index, after the language switch, in the same style: small bold text, a hairline frame; pressed has the ink fill like the current language. Mockup: `docs/mockups/add-theme-switch/index.html`.
- **Test tool.** `node --test 'scripts/*.test.mjs'` (node:test). The tests run the real `site.js` against a small stand-in of the DOM, as for the agent switch. The visual check of both schemes and of the focus is a manual check in `qa.md`.

## C4 impact

No C4 impact.

## Risks / Trade-offs

- [The selection resets on each new page] → Accepted by the user. The default is the system preference, which most visitors keep.

## Migration Plan

Deploys with the next release. Rollback: revert the commits of the change.
