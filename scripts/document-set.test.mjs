// Tests for the document-set spec. Each test name starts with "<Requirement>: <Scenario>".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

test('Backlog holds only open items: Rule in the document rules', () => {
  const docs = read('rules/docs.md');
  const format = docs.slice(docs.indexOf('## Backlog format'), docs.indexOf('## Sync triggers'));
  assert.doesNotMatch(format, /- \[x\]/);
  assert.match(format, /[Rr]emove the item/);
  assert.match(docs, /\| Change archived \|[^\n]*backlog \(remove item\)/);
});

test('Backlog holds only open items: Archive removes the item', () => {
  assert.match(read('skills/archive/SKILL.md'), /In `docs\/backlog\.md`, remove the item `\(change: <id>\)`/);
  for (const config of ['openspec/config.yaml', 'templates/project/openspec/config.yaml']) {
    assert.match(read(config), /Remove the backlog item/);
  }
});
