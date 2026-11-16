// Tests for the document-set spec. Each test name starts with "<Requirement>: <Scenario>".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

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

// Runs the check CLI on a project with the archived change add-login and the open change add-export.
function checkBacklog(items) {
  const dir = mkdtempSync(join(tmpdir(), 'sparc-'));
  cpSync(join(ROOT, 'templates/project'), dir, { recursive: true });
  mkdirSync(join(dir, 'openspec/changes/archive/2026-10-01-add-login'), { recursive: true });
  mkdirSync(join(dir, 'openspec/changes/add-export'), { recursive: true });
  writeFileSync(join(dir, 'docs/backlog.md'), `# Backlog\n\n## Goal\n\nA goal.\n\n## Items\n\n${items}`);
  const { stdout } = spawnSync('node', [join(ROOT, 'scripts/check.mjs'), dir], { encoding: 'utf8' });
  return stdout.split('\n').filter((l) => l.includes('docs/backlog.md'));
}

test('Check reports done backlog items: Checked item', () => {
  const out = checkBacklog('- [ ] Export (change: add-export)\n- [x] Search\n');
  assert.ok(out.some((l) => l.includes('item "Search" is done. Remove it')), out.join('\n'));
});

test('Check reports done backlog items: Item of an archived change', () => {
  const out = checkBacklog('- [ ] Export (change: add-export)\n- [ ] Login (change: add-login)\n');
  assert.ok(out.some((l) => l.includes('change "add-login" is archived. Remove its item')), out.join('\n'));
});

test('Check reports done backlog items: Archived change without an item', () => {
  assert.deepEqual(checkBacklog('- [ ] Export (change: add-export)\n'), []);
});

test('Check reports done backlog items: Open change without an item', () => {
  const out = checkBacklog('- [ ] Other idea\n');
  assert.ok(out.some((l) => l.includes('change "add-export" has no backlog item')), out.join('\n'));
});
