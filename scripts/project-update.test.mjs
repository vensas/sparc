// Tests for the skill requirements of the project-update spec. Each test name starts with "<Requirement>: <Scenario>".
// The check requirements of this spec are tested in check.test.mjs. These tests read the update skill.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { before } from './skill-text.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const update = () => read('skills/update/SKILL.md');

test('Update only to a newer version: Project is up to date', () => {
  const skill = update();
  assert.match(skill, /If the two versions are equal, stop\. Tell the user that the project is up to date/);
  before(skill, 'If the two versions are equal', '## 4. Apply');
});

test('Update only to a newer version: Project is newer than the plugin', () => {
  const skill = update();
  assert.match(skill, /If the project version is higher, stop\. Tell the user to update the plugin in the agent: `claude plugin update sparc@sparc` in Claude Code or `copilot plugin update sparc` in GitHub Copilot CLI/);
  before(skill, 'If the project version is higher', '## 4. Apply');
});
