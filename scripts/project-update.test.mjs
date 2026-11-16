// Tests for the skill requirements of the project-update spec. Each test name starts with "<Requirement>: <Scenario>".
// The check requirements of this spec are tested in check.test.mjs. These tests read the update skill.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const update = () => read('skills/update/SKILL.md');
const stopsBeforeChanges = (skill, text) => assert.ok(skill.indexOf(text) < skill.indexOf('## 4. Apply'), `"${text}" comes before the first change`);

test('Update only to a newer version: Project is up to date', () => {
  const skill = update();
  assert.match(skill, /If the two versions are equal, stop\. Tell the user that the project is up to date/);
  stopsBeforeChanges(skill, 'If the two versions are equal');
});

test('Update only to a newer version: Project is newer than the plugin', () => {
  const skill = update();
  assert.match(skill, /If the project version is higher, stop\. Tell the user to update the plugin with `\/plugin update`/);
  stopsBeforeChanges(skill, 'If the project version is higher');
});
