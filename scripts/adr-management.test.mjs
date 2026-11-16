// Tests for the skill requirements of the adr-management spec. Each test name starts with "<Requirement>: <Scenario>".
// The check requirements of this spec are tested in check.test.mjs. These tests read the adr skill.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

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
  assert.ok(step.indexOf('If yes, stop') < step.indexOf('Add the entry'), 'the stop comes before the edit');
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
