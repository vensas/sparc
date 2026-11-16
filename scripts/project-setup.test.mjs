// Tests for the project-setup spec. Each test name starts with "<Requirement>: <Scenario>".
// The tests read the init skill. They prove that the skill tells the behavior.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const init = () => read('skills/init/SKILL.md');

test('Prerequisites before setup: Not a git repository', () => {
  assert.match(init(), /not a git repository, ask the user if you can run `git init`/);
});

test('Prerequisites before setup: OpenSpec is not installed', () => {
  const skill = init();
  assert.match(skill, /If OpenSpec is not installed, stop/);
  assert.match(skill, /`npm install -g @fission-ai\/openspec`/);
  assert.ok(skill.indexOf('openspec --version') < skill.indexOf('## 2. Install the files'), 'the check comes before the first file');
});

test('Template files without overwrite: New project', () => {
  assert.match(init(), /Copy each file from `\$\{CLAUDE_PLUGIN_ROOT\}\/templates\/project\/` into the project\. Keep the relative paths/);
});

test('Template files without overwrite: Project has a README', () => {
  const skill = init();
  assert.match(skill, /Do not overwrite a file that exists/);
  assert.match(skill, /show the user the difference and ask: keep, replace or merge/);
});

test('Existing OpenSpec configuration is merged: OpenSpec was already in use', () => {
  const skill = init();
  assert.match(skill, /merge the sparc `context`, `rules` and `operations` into it, between the `# sparc:begin` and `# sparc:end` markers/);
  assert.match(skill, /Keep the `# sparc` marker line at the top/);
  assert.match(read('templates/project/openspec/config.yaml').split('\n')[0], /^# sparc/);
});

test('AGENTS.md is the only agent instruction file: Project has a CLAUDE.md', () => {
  assert.match(init(), /If the project has a `CLAUDE\.md`, ask the user if you can move its text into `AGENTS\.md` and delete it/);
});

test('AGENTS.md is the only agent instruction file: New project', () => {
  assert.match(init(), /Do not create `CLAUDE\.md`/);
  assert.equal(existsSync(join(ROOT, 'templates/project/CLAUDE.md')), false);
});

test('First content from evidence: Existing code base', () => {
  const skill = init();
  assert.match(skill, /rules\/evidence\.md/);
  assert.match(skill, /`docs\/architecture\/c4\.md`: only actors, systems, containers and relations that you found in the code or the config/);
  assert.match(skill, /`AGENTS\.md`: commands \(run each one\)/);
});

test('First content from evidence: New project', () => {
  assert.match(init(), /For a new project, "Key Features" says "None yet\."/);
});

test('First content from evidence: Questions to the user', () => {
  assert.match(init(), /Ask the user for the goal, the stakeholders and the quality requirements\. Ask in one message/);
});

test('First decision record: User approves ADR-0001', () => {
  const skill = init();
  assert.match(skill, /`docs\/adr\/0001-use-sparc-for-spec-driven-development\.md` with the status `proposed`/);
  assert.match(skill, /After approval, set the status to `accepted` and commit the ADR/);
});

test('Setup completes with a check and a commit: Successful setup', () => {
  const skill = init();
  assert.match(skill, /scripts\/check\.mjs/);
  assert.match(skill, /Commit with the message `chore: Add sparc harness`/);
  assert.match(skill, /Report the files that you created and the open points\. Tell the user the next step: `\/sparc:propose <idea>`/);
});

test('Setup completes with a check and a commit: Team project with history', () => {
  assert.match(init(), /In the workflow `pull-request`, if the repository has commits, make the branch `chore\/sparc-init`/);
});
