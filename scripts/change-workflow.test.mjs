// Tests for the change-workflow spec. Each test name starts with "<Requirement>: <Scenario>".
// The tests read the propose, apply and archive skills. They prove that the skills tell the behavior.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');
const skill = (name) => read(`skills/${name}/SKILL.md`);

test('Propose writes planning documents only: Files of a propose commit', () => {
  const propose = skill('propose');
  assert.match(propose, /This skill makes planning documents only\. Do not change project code/);
  assert.match(propose, /Write `proposal\.md` and the spec deltas/);
  assert.match(propose, /Write `design\.md`, the ADRs with the status `proposed`, the C4 updates and `tasks\.md`/);
});

test('Propose writes planning documents only: Backlog link', () => {
  assert.match(skill('propose'), /link the backlog item/);
  assert.match(read('rules/roles/product-owner.md'), /`- \[ \] <item> \(change: <id>\)`/);
});

test('Change id and branch: Pull request workflow', () => {
  const propose = skill('propose');
  assert.match(propose, /Choose a kebab-case change id that names the work/);
  assert.match(propose, /In the workflow `pull-request` only, make the branch `<type>\/<id>` from the default branch/);
});

test('Change id and branch: Trunk workflow', () => {
  assert.match(skill('propose'), /Obey \$\{CLAUDE_PLUGIN_ROOT\}\/rules\/release\.md/);
  assert.match(read('rules/release.md'), /### Workflow `trunk`\n\n- Commit each step on the default branch\. Do not make a branch/);
});

test('Mockups only for a user interface: Change without a user interface', () => {
  assert.match(skill('propose'), /Only if the change has a user interface: [^\n]*Make the mockups in `docs\/mockups\/<id>\/`\. Show the user the path of the mockup/);
});

test('Design names the test tool: Project has a test tool', () => {
  assert.match(skill('propose'), /Name the integration or end-to-end test tool of the project and its command in `design\.md`/);
});

test('Design names the test tool: Project has no test tool', () => {
  assert.match(skill('propose'), /If the project has no such tool, write a project ADR for the tool with the status `proposed`/);
});

test('Propose ends valid and committed: Propose completes', () => {
  const propose = skill('propose');
  assert.match(propose, /Run `openspec validate <id>`\. If it fails, fix the errors [^\n]*and repeat/);
  assert.match(propose, /scripts\/check\.mjs/);
  assert.match(propose, /Commit the planning documents: `docs\(openspec\): Propose <id>`/);
  assert.match(propose, /the scope, the out-of-scope items, the ADRs, the C4 impact, the mockups and the number of tasks/);
});

test('Apply starts only on a valid change: Change is not valid', () => {
  const apply = skill('apply');
  assert.match(apply, /Run `openspec status --change <id>` and `openspec validate <id>`\. All planning artifacts must be complete and valid/);
  assert.ok(apply.indexOf('openspec validate <id>') < apply.indexOf('## 2. Task groups'), 'validation comes before the task groups');
});

test('Task groups one after the other: One commit for each task', () => {
  const apply = skill('apply');
  assert.match(apply, /test first, smallest code, refactor, one Conventional Commit for each task/);
  assert.match(read('rules/roles/software-engineer.md'), /Check the task in `tasks\.md` only after the verification passed/);
});

test('Task groups one after the other: A test fails after a group', () => {
  assert.match(skill('apply'), /Run all tests of the project\. If a test fails, fix it before the next group/);
});

test('QA commits change only tests and the QA report: Files of a QA commit', () => {
  const apply = skill('apply');
  assert.match(apply, /Make sure that the QA commits change only test files and `openspec\/changes\/<id>\/qa\.md`/);
  assert.match(apply, /For each scenario with the result `failed`, fix the issue as the software engineer role, then do QA again/);
});

test('Apply reports the next step: Apply completes', () => {
  assert.match(skill('apply'), /Report the completed tasks, the test results, the code review, the QA result and the open points\. Tell the user the next step: `\/sparc:archive <id>`/);
});

test('Archive only a complete and tested change: Open task', () => {
  const archive = skill('archive');
  assert.match(archive, /All tasks in `tasks\.md` must be checked\. If not, stop and report the open tasks/);
  assert.ok(archive.indexOf('must be checked') < archive.indexOf('openspec archive <id>'), 'the task check comes before the archive');
});

test('Archive only a complete and tested change: Failed test', () => {
  const archive = skill('archive');
  assert.match(archive, /Run the test commands in `AGENTS\.md`[^\n]*If a test fails, stop and report it/);
  assert.ok(archive.indexOf('Run the test commands') < archive.indexOf('openspec archive <id>'), 'the tests run before the archive');
});

test('Archive updates the main specs: New capability', () => {
  assert.match(skill('archive'), /Run `openspec archive <id> --yes`\. Read the output\. Make sure that the main specs changed as the deltas say/);
});

test('Archive syncs, checks and commits: Archive completes', () => {
  const archive = skill('archive');
  assert.match(archive, /Use the sparc sync skill/);
  assert.match(archive, /A finding can stay only with a reason that you tell the user/);
  assert.match(archive, /Commit: `docs\(openspec\): Archive <id>`/);
  assert.match(archive, /Report the commit or the pull request link, and the check result/);
});

test('Archive opens a pull request: Repository without a remote', () => {
  assert.match(skill('archive'), /Run `git remote`\. If there is no remote, stop\. Tell the user that the branch is ready for a pull request/);
});

test('Archive opens a pull request: Repository with a remote', () => {
  const archive = skill('archive');
  assert.match(archive, /Run `git push -u origin <branch>`/);
  assert.match(archive, /Run `gh pr create`\. The title is a Conventional Commit header/);
  assert.match(archive, /Report the commit or the pull request link/);
});
