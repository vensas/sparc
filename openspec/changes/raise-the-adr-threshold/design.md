# Design

## Context

See proposal.md - Why. The architect role tells the ADR threshold in step 5 of `rules/roles/architect.md`. `rules/adr.md` tells the ADR format and status, but not when to write an ADR. The ADR template already has the sections `## Considered Options` and `## Pros and Cons of the Options`. No check reads them. `checkAdrs` in `scripts/check.mjs` skips each further check for a `proposed` ADR. The propose skill, the apply skill and the QA engineer role require a project ADR for a new test tool.

ADRs: none. This change does not meet its own threshold. The decisions below change rules and check behavior. They are not central to the idea of sparc, and they are easy to change.

## Goals / Non-Goals

**Goals:**

- One rule with one home that tells when to write an ADR.
- A check without an LLM that each new ADR compares real options.

**Non-Goals:**

- A check that decides if a decision is major.
- Changes to decided ADRs.

## Decisions

### Threshold: central to the idea and two or more real options

The user gave the criterion. Both parts are necessary. A decision with one real option is a constraint, not a choice. Write the constraint in the spec or in the rule that it affects. A decision with options that is not central stays in `design.md`.

Options:

- Central and real options (chosen). Good: few ADRs, each with a real choice. Bad: "central" needs judgement.
- Hard to change later, without the container criterion. Good: a known heuristic. Bad: many conventions are hard to change for projects that use sparc, so the count goes down only a little.
- The current threshold. Good: no change. Bad: almost each change gets an ADR.

### Home of the rule

A new section "When to write an ADR" in `rules/adr.md`, before the section "Files". Step 5 of `rules/roles/architect.md` tells: "For each major decision, write an ADR with the status `proposed` (see `../adr.md`)". Step 4 already tells to give each decision of `design.md` its options and reason. The sparc text of `AGENTS.md` does not change. Its line about ADRs tells how to follow ADRs, not when to write them, and the architect role reads `rules/adr.md`.

### Check of options and trade-offs

- Only for `proposed` ADRs. A decided ADR does not change. Thus a finding for it cannot be fixed.
- The options are the list items (`- ` at the start of the line) in `## Considered Options`.
- The trade-offs are the subsections `### <heading>` in `## Pros and Cons of the Options`. A subsection belongs to an option when its heading is equal to the option text after trim. MADR uses the same text for both. A different text gives a finding "option has no trade-offs", with the option text. The author can then fix the heading.
- A subsection needs one line that starts with `- Good, because` and one line that starts with `- Bad, because`. These are the MADR words, and the template uses them.
- Findings: "needs two or more options in Considered Options", `option "<text>" has no trade-offs in Pros and Cons of the Options`, `option "<text>" has no good trade-off`, `option "<text>" has no bad trade-off`.
- The check stays without dependencies. It uses the existing helper `section` and splits the section at `### `.

Options:

- Check of proposed ADRs (chosen). Good: deterministic, and it does not report decided ADRs. Bad: only the structure, not the quality of the trade-offs.
- Review by the code review subagent only. Good: it can judge the quality. Bad: not deterministic, and the review runs after the implementation.

### Template

`templates/project/docs/adr/0000-template.md` gets two HTML comments. Under `## Considered Options`: "Give two or more real options. Use the same text as the headings in Pros and Cons of the Options." Under `## Pros and Cons of the Options`: "Give a good and a bad trade-off for each option." `/sparc:update` replaces the template as a whole. `docs/adr/0000-template.md` of sparc is a copy and gets the same text.

### Test tool in the design, not in an ADR

The choice of a test tool is a project decision. In most projects it is not central to the idea of the project. The approval of the change already approves `design.md` (see the `approval` spec). Thus the choice goes in `design.md` with its options and reason, and the apply approves it. The propose skill, the apply skill step 4.1 and the QA engineer role tell this. If the choice is central, the general rule asks for an ADR.

## Test

- The check requirement: tests in `scripts/check.test.mjs` with `adrRepo`, one for each scenario. The test tool is `node --test` (see `AGENTS.md`).
- The rule, template, skill and role texts: tests of the text in `scripts/adr-management.test.mjs`, `scripts/change-workflow.test.mjs` and `scripts/qa-engineer.test.mjs`.
- "Decision that is not major" and "Major decision" are agent behavior. QA proves the rule text with a test. The evidence of the behavior is this change: its `design.md` gives options and reasons and adds no ADR.

C4 impact: No C4 impact. The check and the rules change their content, not their relations.

## Risks / Trade-offs

- "Central to the idea of the project" needs judgement → The rule gives examples of what is not central: conventions, document formats and check behavior. The user sees the ADRs in the propose summary and can ask for a change.
- A heading that differs a little from the option text gives a finding → The finding names the option text, so the fix is clear.
- Decisions that are not in an ADR are not protected by the check → `design.md` is archived with the change, and the specs hold the behavior.

## Migration Plan

Existing ADRs stay. A project gets the new template with `/sparc:update` and the new rule with the plugin update. Only `proposed` ADRs get the new findings.
