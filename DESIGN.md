---
name: sparc website
description: The standards manual of the sparc way of working, drawn as a technical drawing sheet.
colors:
  sheet: "#ffffff"
  ink: "#16121c"
  ink-2: "#4a4354"
  rule: "#d9d3e0"
  grid: "#f0ecf4"
  code-bg: "#f4f0f8"
  accent: "#552583"
  spark: "#fdb927"
  sheet-dark: "#0f0c14"
  ink-dark: "#ece8f2"
  ink-2-dark: "#b4abc0"
  rule-dark: "#2e2738"
  grid-dark: "#16121d"
  code-bg-dark: "#1a1522"
  accent-dark: "#b08be0"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.6vw, 3.75rem)"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 87.5"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(1.75rem, 3vw, 2.5rem)"
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 87.5"
  address:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    fontVariation: "'wdth' 87.5"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    fontFeature: "'tnum'"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    letterSpacing: "0.06em"
  code:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.9em"
rounded:
  square: "0px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  base: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  gutter: "clamp(16px, 4vw, 48px)"
  max: "1240px"
components:
  button-copy:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "6px 14px"
  button-copy-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
  lang-current:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.sheet}"
    padding: "6px 8px"
  install-block:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "16px"
  title-block-head:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.sheet}"
    typography: "{typography.label}"
    padding: "8px 12px"
  loop-frame:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.square}"
    padding: "20px 16px 24px"
  loop-frame-active:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.ink}"
  footer-billing:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.ink}"
    padding: "48px 0 32px"
---

# Design System: sparc website

## Overview

**Creative North Star: "The Drawing Sheet"**

The site is the standards manual of the sparc way of working. Each page is a technical drawing sheet: a white sheet, ink, hairline rules, a 12-column grid, a title block and numbered addresses. The first viewport (the header "field") shows a faint 24px drawing grid. All other parts are a plain sheet.

The page is minimal and quiet. Color has a job, not a mood. Purple marks addresses and links. Gold marks the current step. Depth comes from rules and frames, not from shadows. The site refuses the dark dev-tool page with a glowing terminal hero and a row of feature cards.

The sheet follows `prefers-color-scheme`. Dark mode changes the token values only. The structure does not change. The product facts are in [PRODUCT.md](PRODUCT.md) and the [README](README.md).

**Key Characteristics:**
- Hairline rules (1px) frame each block. Square corners everywhere except the logo mark.
- A strict 12-column grid with a 24px column gap.
- One self-hosted variable face (Archivo): semi-condensed bold for headings, regular for body.
- Numbered section addresses (1.0, 2.0, ...) in the masthead index and before each section heading.
- The change loop steps with the scroll position. The active frame gets a gold bar. The next frame gets a purple outline.

## Colors

An ink-on-paper palette with one purple voice and one gold spark.

### Primary
- **Manual Purple** (accent): the 4px top rule of the page, body links, section addresses, step numbers, the title block head, the outline of the next loop frame, text selection and the `$` prompt. Dark mode uses Lilac (accent-dark).

### Secondary
- **Spark Gold** (spark): the spark in the logo and the 4px bar on the active loop frame. Gold is never text on the sheet.

### Neutral
- **Sheet** (sheet / sheet-dark): the page background.
- **Ink** (ink / ink-dark): headings, body text, the title block frame, the focus ring and the current language.
- **Second Ink** (ink-2 / ink-2-dark): intros, secondary text, table head labels and the loop return rule.
- **Hairline** (rule / rule-dark): all 1px rules and frames.
- **Drawing Grid** (grid / grid-dark): the 24px grid lines in the header field only.
- **Code Paper** (code-bg / code-bg-dark): the install block, code, the active loop frame and the footer.

### Named Rules
**The Two Accents Rule.** Purple marks where you are in the manual. Gold marks only the logo spark and the active loop step. Do not add other gold.

**The Ink Link Rule.** Links in the masthead index, the title block and the footer are ink. All other links are purple.

## Typography

**Display Font:** Archivo variable (wdth 62 to 125, wght 100 to 900), self-hosted, with system-ui as fallback
**Body Font:** Archivo
**Label/Mono Font:** ui-monospace, SF Mono, Menlo, Consolas

**Character:** One face in two widths. Headings use the semi-condensed width (87.5%) at 700 with tight tracking. Body text uses the normal width at 400 with tabular numbers.

### Hierarchy
- **Display**: the hero heading and the legal page heading (legal: up to 3.5rem). Balanced wrap.
- **Headline**: section headings (h2), in columns 3 to 9.
- **Address**: section numbers and step numbers in purple. Loop numbers are 1.75rem, install step numbers 1.5rem.
- **Title**: loop step names (h3).
- **Body**: running text. Intros use Second Ink and a maximum of 40em. FAQ answers and legal text use a maximum of 68ch. Smaller body sizes are 0.9375rem and 0.875rem.
- **Label**: uppercase labels with 0.06em tracking: table heads, title block keys (0.75rem), the install head, footer column heads, "Stops:" and "Next change" (0.6875rem to 0.75rem).
- **Code**: commands and file names at 0.9em. On phones (560px or less) the install and step code blocks are 12px.

### Named Rules
**The One Face Rule.** Use only Archivo and the system monospace. Change width and weight, not the family.

**The Number Address Rule.** A section address is a number in its own grid column. It is never a word.

## Layout

The content is in a centered sheet of 1240px maximum with a fluid gutter. Each section uses a 12-column grid with a 24px column gap. The address takes columns 1 to 2. The heading and content start at column 3.

Sections have a hairline top rule and large block padding (64px to 120px on top, 48px to 80px at the bottom). The spacing steps are 4, 8, 12, 16, 24, 32 and 48px.

The first viewport puts the heading, the lede, the install block and two links in columns 1 to 7. The title block is in columns 9 to 12.

Breakpoints:
- **1080px or less:** the loop goes from 7 frames in one row to 4 frames in a row.
- **860px or less:** all blocks span the full width. The title block moves below the install block. The masthead index wraps below the logo. The tally goes to 2 columns.
- **560px or less:** the loop is one column of compact frames, without the role line and the return rule. The documents table shows each row as a block with labels from `data-label`.

## Elevation & Depth

The system is flat. There are no drop shadows. Rules and frames give the structure. Code Paper gives the only tonal layer. An inset `box-shadow` draws state lines only: the 4px gold bar on the active loop frame, the 1px purple outline on the next frame, and the 3px sheet gap in the focus ring.

### Named Rules
**The Ruled Not Raised Rule.** Separate blocks with 1px rules and frames. Do not lift them with shadows.

## Shapes

All frames, buttons, code blocks and tables have square corners. The only curves are the rounded square of the logo mark and the 2px radius of the focus ring. The FAQ marker is a drawn chevron from two borders, not a glyph. The loop return rule is a drawn line with a drawn arrow head.

## Components

### Buttons
- **Copy button:** a square, ghost button in label type, with a Second Ink frame. Hover fills it with ink. The label changes to "Copied" for 1.6s.

### Install block
- A Code Paper block with a hairline frame. The head row has the uppercase label and the copy button. The commands show a purple `$` prompt that you cannot select.
- The agent switch sits in the head row between the label and the copy button. It is a tab list with two tabs (Claude Code, GitHub Copilot) in a hairline frame. The selected tab is Ink with Sheet text. The arrow keys move the selection. Copy copies the commands of the shown agent.
- Without JavaScript, the tab list stays hidden, and both command blocks show one after the other, each with the uppercase name of its agent.
- At 560px or less, the switch takes its own row below the label, and each tab takes half of the width.

### Title block
- A drawing title block with a 1px ink frame on the sheet. The head is a purple bar with "sparc" and the sheet number. Each row has an uppercase key and a 600-weight value, separated by hairlines.

### Navigation
- **Masthead index:** the section number in Second Ink, then the name, in ink. Hover underlines. The language switch is after a hairline. The current language has an ink fill.
- **Color scheme switch:** the last item of the masthead index. A button with a half-filled circle and the text "Dark" in a hairline frame, in the type of the language switch. Pressed (dark scheme) has an ink fill. It starts with the system preference and stores nothing. Without JavaScript, it stays hidden.
- **Footer (billing block):** Code Paper, 12-column grid, uppercase column heads, ink links, and an agate line with version, license and owner.

### Change loop (signature)
- Seven ruled frames in one strip. Each frame has a purple number, the step name, the command, one line of text, a "Stops:" pain line and the role line on a hairline.
- The scroll position sets the active frame (Code Paper and a gold top bar) and the next frame (purple outline). The marks fade in 400ms with `cubic-bezier(.16,1,.3,1)`.
- A return rule under the strip goes from step 7 back to step 1 with the label "Next change".
- With reduced motion, the script sets no marks and the frames are static.

### Spec tables and tally
- Spec tables have a 2px ink rule above an uppercase head and hairlines between rows. The row head is bold. Inline code has a Code Paper fill.
- The tally is one framed row of four facts (2 by 2 at 860px or less).

### FAQ
- Native `details` between hairlines. The summary is 600 weight. Hover makes it purple. The chevron turns in 240ms.

### Focus
- All focusable elements: a 2px ink outline with a 3px offset and a 3px sheet gap.

## Do's and Don'ts

### Do:
- **Do** frame each block with 1px Hairline rules and keep corners square.
- **Do** put content on the 12-column grid, with the address in columns 1 to 2.
- **Do** use purple only for the top rule, links, addresses, step numbers, the title block head and the next-step outline.
- **Do** use gold only for the logo spark and the active loop step bar.
- **Do** show focus with the ink ring and the sheet gap.
- **Do** remove motion and smooth scroll when the visitor prefers reduced motion.
- **Do** self-host all assets. Send no external requests and set no cookies.

### Don't:
- **Don't** use drop shadows, gradients or glow.
- **Don't** use a dark terminal hero or a row of feature cards.
- **Don't** put the drawing grid outside the header field.
- **Don't** put an uppercase word above a heading. The address before a heading is a number only.
- **Don't** use icon glyphs. Draw marks with borders or inline SVG.
