// Tests for the skill requirements of the release-conventions spec. Each test name starts with "<Requirement>: <Scenario>".
// The check requirements of this spec are tested in check.test.mjs. These tests read the release skill.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { before } from './skill-text.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const release = () => read('skills/release/SKILL.md');

test('Release start conditions: Nothing to release', () => {
  const skill = release();
  assert.match(skill, /Switch to the default branch and get the latest state\. Do not release from a change branch/);
  assert.match(skill, /If it is empty, stop\. There is nothing to release/);
  before(skill, 'There is nothing to release', '## 3. Write the release');
});

test('Release start conditions: Check finding', () => {
  const skill = release();
  assert.match(skill, /Run all tests\. If a test fails, stop/);
  assert.match(skill, /If there is a finding, stop and report it/);
  before(skill, 'If there is a finding, stop', '## 3. Write the release');
});

test('Release commit and tag: Trunk release', () => {
  const skill = release();
  before(skill, 'Get approval', 'Commit: `chore(release): <version>`');
  assert.match(skill, /In the workflow `trunk`, tag the release commit/);
  assert.match(skill, /Use `git tag v<version>`\. Ask the user before you push the tag/);
});

test('Release commit and tag: Pull request release', () => {
  const skill = release();
  assert.match(skill, /In the workflow `pull-request` only, make the branch `chore\/release-<version>`/);
  assert.match(skill, /In the workflow `pull-request`, open a pull request and tag the merge commit after the merge/);
});
