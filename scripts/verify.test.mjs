import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { completeChanges, verifyChange, projectCommands, runCommands, commandsWarning } from './verify.mjs';

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

const AGENTS = (rows) => `# AGENTS.md\n\n## Commands\n\n| Task | Command |\n|---|---|\n${rows.map(([n, c]) => `| ${n} | \`${c}\` |`).join('\n')}\n\n## Structure\n\n| Path | Content |\n|---|---|\n| \`src/\` | Code |\n`;
const PASS = 'node -e "process.exit(0)"';
const FAIL = 'node -e "console.log(\'line 1\'); console.error(\'boom\'); process.exit(1)"';

test('Project commands pass: commands come from the commands table in the order Lint, Test, Verify', () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([['Verify', 'v'], ['Run the app', 'r'], ['test', 't'], ['Lint', 'l']]));
  assert.deepEqual(projectCommands(dir), [{ name: 'Lint', command: 'l' }, { name: 'Test', command: 't' }, { name: 'Verify', command: 'v' }]);
});

test('Project commands pass: all commands pass', async () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([['Lint', PASS], ['Test', PASS]]));
  assert.deepEqual(await runCommands(dir, projectCommands(dir)), []);
});

test('Project commands pass: a command fails', async () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([['Lint', PASS], ['Test', FAIL]]));
  const [finding, ...rest] = await runCommands(dir, projectCommands(dir));
  assert.deepEqual(rest, []);
  assert.match(finding, /^command "Test" \(`node -e .+`\) exited with 1/);
  assert.match(finding, /line 1/);
  assert.match(finding, /boom/);
});

test('Project commands pass: a command runs too long', async () => {
  const dir = project();
  const start = Date.now();
  const [finding] = await runCommands(dir, [{ name: 'Test', command: 'node -e "setTimeout(() => {}, 10000)" && echo done' }], 300);
  assert.ok(Date.now() - start < 5000, 'the command and its child processes stop at the time limit');
  assert.match(finding, /^command "Test" \(`.+`\) ran longer than 0\.3 s/);
});

test('Project commands pass: optional verify command', () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([['Lint', PASS], ['Test', PASS]]));
  assert.deepEqual(projectCommands(dir).map((c) => c.name), ['Lint', 'Test']);
});

test('Project without commands: no commands named, and no second warning', () => {
  const dir = project();
  process.env.CLAUDE_PLUGIN_DATA = mkdtempSync(join(tmpdir(), 'sparc-state-'));
  write(dir, 'AGENTS.md', AGENTS([['Run the app', 'r']]));
  assert.deepEqual(projectCommands(dir), []);
  assert.match(commandsWarning(dir), /names no Lint, Test or Verify command/);
  assert.equal(commandsWarning(dir), null);
  write(dir, 'AGENTS.md', AGENTS([['Lint', PASS]]));
  assert.equal(commandsWarning(dir), null);
});

const VERIFY = new URL('./verify.mjs', import.meta.url).pathname;

function hookRunner(dir) {
  const env = { ...process.env, CLAUDE_PLUGIN_DATA: mkdtempSync(join(tmpdir(), 'sparc-state-')) };
  return () => {
    const out = spawnSync('node', [VERIFY, '--hook'], { input: JSON.stringify({ cwd: dir, hook_event_name: 'Stop' }), encoding: 'utf8', env });
    assert.equal(out.status, 0, out.stderr);
    return out.stdout ? JSON.parse(out.stdout) : null;
  };
}

test('Block the stop with a reason: checks fail', () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([['Test', FAIL]]));
  change(dir, { qa: null });
  const out = hookRunner(dir)();
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /add-export/);
  assert.match(out.reason, /command "Test"/);
  assert.match(out.reason, /"Export: Empty list" has no row in qa\.md/);
});

test('Block the stop with a reason: checks pass', () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([['Test', PASS]]));
  change(dir);
  assert.equal(hookRunner(dir)(), null);
});

test('Block the stop with a reason: change in progress does not block and runs no command', () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([['Test', 'node -e "require(\'fs\').writeFileSync(\'ran\', \'\')"']]));
  change(dir, { tasks: '# Tasks\n\n- [ ] 1.1 One. Verify: a.\n' });
  assert.equal(hookRunner(dir)(), null);
  assert.ok(!existsSync(join(dir, 'ran')));
});

test('Block the stop with a reason: manual scenarios are named for the user', () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([['Test', PASS]]));
  change(dir, { qa: QA_OK.replace('| Export: Empty list | passed |', '| Export: Empty list | manual |') });
  const out = hookRunner(dir)();
  assert.equal(out.decision, undefined);
  assert.match(out.systemMessage, /manual check.*Export: Empty list/s);
});

test('Project without commands: hook warns one time and does not block', () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([]));
  change(dir);
  const run = hookRunner(dir);
  const out = run();
  assert.equal(out.decision, undefined);
  assert.match(out.systemMessage, /names no Lint, Test or Verify command/);
  assert.equal(run(), null);
});

test('Limit of blocks: fourth stop with failed checks', () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([['Test', FAIL]]));
  change(dir);
  const run = hookRunner(dir);
  for (let i = 0; i < 3; i++) assert.equal(run().decision, 'block');
  const out = run();
  assert.equal(out.decision, undefined);
  assert.match(out.hookSpecificOutput.additionalContext, /Core Risks and Missing Information/);
  assert.match(out.systemMessage, /stopped to block/);
});

test('Limit of blocks: count starts again', () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([['Test', FAIL]]));
  change(dir);
  const run = hookRunner(dir);
  run(); run();
  write(dir, 'AGENTS.md', AGENTS([['Test', PASS]]));
  assert.equal(run(), null);
  write(dir, 'AGENTS.md', AGENTS([['Test', FAIL]]));
  for (let i = 0; i < 3; i++) assert.equal(run().decision, 'block');
});

test('Document check does not block: document drift in a complete change', () => {
  const dir = project();
  write(dir, 'AGENTS.md', AGENTS([['Test', PASS]]));
  write(dir, 'README.md', '# Name\n');
  change(dir);
  assert.equal(hookRunner(dir)(), null);
});

test('hook does nothing outside a sparc project', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sparc-verify-'));
  assert.equal(hookRunner(dir)(), null);
});
