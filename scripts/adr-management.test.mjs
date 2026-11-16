// Tests for the skill requirements of the adr-management spec. Each test name starts with "<Requirement>: <Scenario>".
// The check requirements of this spec are tested in check.test.mjs. These tests read the adr skill.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { before } from './skill-text.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const adr = () => read('skills/adr/SKILL.md');
const section = (name) => adr().split(/^## /m).find((s) => s.startsWith(name));

test('New ADR from the template: Next free number', () => {
  const step = section('new');
  assert.match(step, /Find the next free number in `docs\/adr\/`/);
  assert.match(step, /Copy `docs\/adr\/0000-template\.md` \(or `\$\{CLAUDE_PLUGIN_ROOT\}\/templates\/project\/docs\/adr\/0000-template\.md`\) to `docs\/adr\/NNNN-<kebab-title>\.md`/);
  assert.match(step, /The status is `proposed`\. The date is today/);
});

test('Amendment does not change the decision: Addition alters the decision', () => {
  const step = section('amend');
  assert.match(step, /does it alter the context, the options, the decision or the consequences\?/);
  assert.match(step, /If yes, stop\. Tell the user that a supersede is necessary/);
  before(step, 'If yes, stop', 'Add the entry');
});

test('Supersede in two steps: New ADR is proposed', () => {
  const step = section('supersede');
  assert.match(step, /Create a new ADR \(see "new"\)\. In "More Information", link the old ADR/);
  assert.match(step, /After the new ADR is accepted, set the old status/);
});

test('Supersede in two steps: New ADR is accepted', () => {
  const step = section('supersede');
  assert.match(step, /set the old status to `superseded by ADR-NNNN` and the date/);
  assert.match(step, /Update the canvas section "Core Decisions"/);
});

const rule = () => read('rules/adr.md').split(/^## /m).find((s) => s.startsWith('When to write an ADR')) ?? '';

test('ADR only for a major decision: Rule for the architect', () => {
  assert.match(read('rules/roles/architect.md'), /For each major decision, write an ADR with the status `proposed` \(see `\.\.\/adr\.md`\)/);
  before(read('rules/adr.md'), '## When to write an ADR', '## Files');
});

test('ADR only for a major decision: Decision that is not major', () => {
  assert.match(rule(), /Write an ADR only for a major decision/);
  assert.match(rule(), /Write each other decision in `design\.md` of its change\. Give its options and the reason for the choice/);
});

test('ADR only for a major decision: Convention or check behavior', () => {
  assert.match(rule(), /Write conventions, document formats and the behavior of checks in specs and rules, not in ADRs/);
});

test('ADR only for a major decision: Major decision', () => {
  assert.match(rule(), /central to the idea of the project and to its approach to the problem/);
  assert.match(rule(), /The team chose between two or more real solution options/);
});
