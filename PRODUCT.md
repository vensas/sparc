# Product

<!-- impeccable:product-schema 1 -->

The [README](README.md) is the home of the product description. This file holds only the product facts that design work needs.

## Platform

web

## Stack

`website/`: static HTML and CSS. A Node.js script without dependencies renders the pages from one template and one text file for each language. GitHub Pages serves the result at `sparc.apps.vensas.de`.

## Users

Primary: tech leads and software architects. They choose how a team works with coding agents. They care about specs, decisions (ADRs), architecture documents (C4) and review. Secondary: developers who already use Claude Code.

## Product Purpose

See the README "Overview". Success for the landing page: a tech lead understands the change loop and installs sparc, or reads more on GitHub.

## Positioning

sparc keeps specs, architecture and documents in sync with the code while agents write it. It adds roles, a fixed document set and two checks without an LLM on top of OpenSpec. See the README "Key Features".

## Operating Context

Claude Code (CLI and Desktop), OpenSpec, git and GitHub. The repository `vensas/sparc` becomes public before the site goes live.

## Brand Commitments

- Logo: `docs/assets/logo-light.svg`, `docs/assets/logo-dark.svg`, `docs/assets/icon.svg`.
- Colors: purple `#552583` (light), `#b08be0` (dark), gold spark `#fdb927`.
- Owner: vensas GmbH. The footer links to https://vensas.de.
- Languages: English, German and French.
- The user asked for a minimal page.

## Evidence on Hand

- sparc is built with sparc: the ADRs in `docs/adr/`, the archived changes in `openspec/changes/archive/`, and `CHANGELOG.md`.
- No testimonials, no users outside vensas, no benchmarks. Do not invent them.

## Product Principles

- Show the mechanism, not slogans.
- Prove with the repository history of sparc.
- Keep it minimal.

## Accessibility & Inclusion

WCAG 2.2 AA: contrast of 4.5:1 or more, keyboard use, visible focus, reduced motion.
