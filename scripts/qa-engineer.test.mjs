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

const role = () => readFileSync(join(ROOT, 'rules/roles/qa-engineer.md'), 'utf8');
const apply = () => readFileSync(join(ROOT, 'skills/apply/SKILL.md'), 'utf8');

test('Use the test tools of the project: Project has a test tool', () => {
  assert.match(role(), /Use this tool and this command\. Do not assume a test framework/);
});

test('Use the test tools of the project: Design of the change names a new tool', () => {
  assert.match(role(), /If `design\.md` of the change names a new tool, install and use it\. `\/sparc:apply` approved the change/);
});

test('Use the test tools of the project: Project has no suitable test tool', () => {
  assert.match(role(), /If the project has no suitable tool and `design\.md` names no tool, stop and report the missing tool/);
  assert.match(role(), /Do not choose, install or use a new test tool that `design\.md` of an approved change does not name/);
  assert.match(apply(), /If the role finds no suitable test tool, stop\. Tell the user that the tool needs a change whose `design\.md` names it/);
  assert.doesNotMatch(role() + apply(), /project ADR/);
});
