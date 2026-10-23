// Regression tests for the qa-engineering spec. Each test name starts with "<Requirement>: <Scenario>".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = new URL('..', import.meta.url).pathname;

test('QA engineer role: Role is available', () => {
  assert.match(readFileSync(join(ROOT, 'rules/roles/qa-engineer.md'), 'utf8'), /^# Role: QA Engineer\n/);
});

test('QA engineer role: Plugin stays valid', (t) => {
  const run = spawnSync('claude', ['plugin', 'validate', '.'], { cwd: ROOT, encoding: 'utf8' });
  if (run.error) return t.skip('claude CLI is not installed');
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /Validation passed/);
});
