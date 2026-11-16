import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { completeChanges, verifyChange } from './verify.mjs';

const TEMPLATE = new URL('../templates/project', import.meta.url).pathname;

function project() {
  const dir = mkdtempSync(join(tmpdir(), 'sparc-verify-'));
  cpSync(TEMPLATE, dir, { recursive: true });
  return dir;
}
const write = (dir, rel, text) => {
  mkdirSync(dirname(join(dir, rel)), { recursive: true });
  writeFileSync(join(dir, rel), text);
};

const SPEC = `# Spec Delta

## ADDED Requirements

### Requirement: Export

#### Scenario: Export a list
- **WHEN** x
- **THEN** y

#### Scenario: Empty list
- **WHEN** x
- **THEN** y

## REMOVED Requirements

### Requirement: Old export

#### Scenario: Old scenario
- **WHEN** x
- **THEN** y
`;
const TASKS_DONE = '# Tasks\n\n## 1. Export\n\n- [x] 1.1 Add the export. Verify: `npm test`.\n- [ X ] 1.2 Add the button. Verify: `npm test`.\n';
const QA_OK = '# QA\n\n| Scenario | Result | Evidence |\n|---|---|---|\n| Export: Export a list | passed | test "export", `npm test`, 3 passed |\n| Export: Empty list | passed | test "empty", `npm test`, 3 passed |\n';

function change(dir, { tasks = TASKS_DONE, qa = QA_OK, spec = SPEC, id = 'add-export' } = {}) {
  write(dir, `openspec/changes/${id}/tasks.md`, tasks);
  write(dir, `openspec/changes/${id}/specs/export/spec.md`, spec);
  if (qa !== null) write(dir, `openspec/changes/${id}/qa.md`, qa);
  return id;
}
const messages = (dir, id) => verifyChange(dir, id).findings;

test('Verify only a complete change: change in progress', () => {
  const dir = project();
  change(dir, { tasks: '# Tasks\n\n- [x] 1.1 One. Verify: a.\n- [ ] 1.2 Two. Verify: b.\n' });
  assert.deepEqual(completeChanges(dir), []);
});

test('Verify only a complete change: complete change', () => {
  const dir = project();
  change(dir);
  assert.deepEqual(completeChanges(dir), ['add-export']);
  assert.deepEqual(messages(dir, 'add-export'), []);
});

test('Verify only a complete change: no open change', () => {
  const dir = project();
  write(dir, 'openspec/changes/archive/2026-10-01-add-login/tasks.md', TASKS_DONE);
  write(dir, 'openspec/changes/add-empty/tasks.md', '# Tasks\n\nNo tasks yet.\n');
  assert.deepEqual(completeChanges(dir), []);
});

test('Verify only a complete change: not a sparc project', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sparc-verify-'));
  write(dir, 'openspec/changes/add-export/tasks.md', TASKS_DONE);
  assert.deepEqual(completeChanges(dir), []);
});

test('Spec scenarios have evidence: all scenarios passed', () => {
  const dir = project();
  change(dir);
  assert.deepEqual(verifyChange(dir, 'add-export'), { findings: [], manual: [] });
});

test('Spec scenarios have evidence: scenario without a row', () => {
  const dir = project();
  change(dir, { qa: QA_OK.split('\n').slice(0, 5).join('\n') });
  assert.deepEqual(messages(dir, 'add-export'), ['scenario "Export: Empty list" has no row in qa.md']);
});

test('Spec scenarios have evidence: qa.md does not exist', () => {
  const dir = project();
  change(dir, { qa: null });
  assert.equal(messages(dir, 'add-export').length, 2);
  assert.match(messages(dir, 'add-export')[0], /"Export: Export a list" has no row in qa\.md/);
});

test('Spec scenarios have evidence: failed scenario', () => {
  const dir = project();
  change(dir, { qa: QA_OK.replace('| Export: Empty list | passed |', '| Export: Empty list | failed |') });
  assert.deepEqual(messages(dir, 'add-export'), ['scenario "Export: Empty list" failed in qa.md']);
});

test('Spec scenarios have evidence: passed without evidence', () => {
  const dir = project();
  change(dir, { qa: QA_OK.replace('| Export: Empty list | passed | test "empty", `npm test`, 3 passed |', '| Export: Empty list | passed |  |') });
  assert.deepEqual(messages(dir, 'add-export'), ['scenario "Export: Empty list" has no evidence in qa.md']);
});

test('Spec scenarios have evidence: manual scenario', () => {
  const dir = project();
  change(dir, { qa: QA_OK.replace('| Export: Empty list | passed |', '| Export: Empty list | manual |') });
  assert.deepEqual(verifyChange(dir, 'add-export'), { findings: [], manual: ['Export: Empty list'] });
});

test('Spec scenarios have evidence: removed requirements need no row', () => {
  const dir = project();
  change(dir);
  assert.ok(!messages(dir, 'add-export').some((m) => m.includes('Old export')));
});

test('Tasks name their verification: task without verification', () => {
  const dir = project();
  change(dir, { tasks: '# Tasks\n\n- [x] 1.1 Add the export. Verify: `npm test`.\n- [x] 1.2 Add the button.\n' });
  assert.deepEqual(messages(dir, 'add-export'), ['task "1.2 Add the button." has no "Verify:"']);
});
