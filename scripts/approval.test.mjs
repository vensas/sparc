// Tests for the approval spec. Each test name starts with "<Requirement>: <Scenario>".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const RULE = () => read('rules/approval.md');
const skill = (name) => read(`skills/${name}/SKILL.md`);

test('Apply approves the change: Propose ends without a question', () => {
  const propose = skill('propose');
  assert.doesNotMatch(propose, /Get approval/i);
  assert.match(propose, /`\/sparc:apply <id>`/);
  assert.match(RULE(), /`\/sparc:apply <id>`[^\n]*approv/i);
});

test('Apply approves the change: Apply starts without a question', () => {
  assert.doesNotMatch(skill('apply'), /Make sure the user approved|ask for it/i);
});

test('Apply approves the change: ADRs of the change at archive', () => {
  assert.match(skill('archive'), /set it to `accepted`/);
});

test('Pull request approval: Reviewer approves / Solo user merges / Reviewer asks for changes', () => {
  const rule = RULE();
  assert.match(rule, /`APPROVED`/);
  assert.match(rule, /merge/i);
  assert.match(rule, /`CHANGES_REQUESTED`/);
  assert.doesNotMatch(rule, /sparc:approved/);
  assert.match(skill('archive'), /approval/i);
});

test('Explicit approval for other decisions: ADR amendment / Release version', () => {
  const rule = RULE();
  for (const item of ['amendment', 'release version', 'update plan', 'ADR-0001']) assert.match(rule, new RegExp(item, 'i'), `rule names ${item}`);
  assert.match(skill('adr'), /get approval/i);
  assert.match(skill('release'), /Get approval/);
});
