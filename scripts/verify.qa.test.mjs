// QA for the change add-verifier-hook: each test proves one scenario of the spec change-verification.
// The tests run the hook as Claude Code does: a process with the Stop event on stdin.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { runCommands } from './verify.mjs';

const TEMPLATE = new URL('../templates/project', import.meta.url).pathname;
const VERIFY = new URL('./verify.mjs', import.meta.url).pathname;
const CHECK = new URL('./check.mjs', import.meta.url).pathname;

const write = (dir, rel, text) => {
  mkdirSync(dirname(join(dir, rel)), { recursive: true });
  writeFileSync(join(dir, rel), text);
};

const PASS = 'node -e "process.exit(0)"';
const FAIL = 'node -e "console.error(\'2 tests failed\'); process.exit(1)"';
const MARK = (name) => `node -e "require('fs').writeFileSync('${name}.ran', '')"`;
const SPEC = '# Spec Delta\n\n## ADDED Requirements\n\n### Requirement: Export\n\n#### Scenario: Export a list\n- **WHEN** a\n- **THEN** b\n\n#### Scenario: Empty list\n- **WHEN** a\n- **THEN** b\n';
const ROW = (scenario, result, evidence = 'test "x", `npm test`, 2 passed') => `| Export: ${scenario} | ${result} | ${evidence} |`;
const QA = (rows) => `# QA\n\n| Scenario | Result | Evidence |\n|---|---|---|\n${rows.join('\n')}\n`;
const QA_OK = QA([ROW('Export a list', 'passed'), ROW('Empty list', 'passed')]);
const DONE = '# Tasks\n\n## 1. Export\n\n- [x] 1.1 Add the export. Verify: `npm test`.\n- [x] 1.2 Add the button. Verify: `npm test`.\n';

// A sparc project from the template, with the commands table and one change.
function project({ commands = [['Lint', PASS], ['Test', PASS]], tasks = DONE, qa = QA_OK } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'sparc-qa-'));
  cpSync(TEMPLATE, dir, { recursive: true });
  const table = commands.map(([n, c]) => `| ${n} | \`${c}\` |`).join('\n');
  write(dir, 'AGENTS.md', `# AGENTS.md\n\n## Commands\n\n| Task | Command |\n|---|---|\n${table}\n`);
  if (tasks) {
    write(dir, 'openspec/changes/add-export/tasks.md', tasks);
    write(dir, 'openspec/changes/add-export/specs/export/spec.md', SPEC);
    if (qa) write(dir, 'openspec/changes/add-export/qa.md', qa);
  }
  return dir;
}

// Returns a function that stops the agent one time and gives the parsed hook output (null for no output).
function agent(dir) {
  const env = { ...process.env, CLAUDE_PLUGIN_DATA: mkdtempSync(join(tmpdir(), 'sparc-qa-state-')) };
  return (script = VERIFY) => {
    const out = spawnSync('node', [script, '--hook'], { input: JSON.stringify({ cwd: dir, hook_event_name: 'Stop' }), encoding: 'utf8', env });
    assert.equal(out.status, 0, out.stderr);
    return out.stdout ? JSON.parse(out.stdout) : null;
  };
}

test('Verify only a complete change: Change in progress', () => {
  const dir = project({ commands: [['Test', MARK('test')]], tasks: DONE.replace('- [x] 1.2', '- [ ] 1.2') });
  assert.equal(agent(dir)(), null);
  assert.ok(!existsSync(join(dir, 'test.ran')));
});

test('Verify only a complete change: Complete change', () => {
  const dir = project({ commands: [['Lint', MARK('lint')], ['Test', MARK('test')]], qa: QA([ROW('Export a list', 'passed')]) });
  const out = agent(dir)();
  assert.ok(existsSync(join(dir, 'lint.ran')) && existsSync(join(dir, 'test.ran')));
  assert.match(out.reason, /"Export: Empty list" has no row in qa\.md/);
});

test('Verify only a complete change: No open change', () => {
  const dir = project({ commands: [['Test', MARK('test')]], tasks: null });
  write(dir, 'openspec/changes/archive/2026-10-01-add-login/tasks.md', DONE);
  assert.equal(agent(dir)(), null);
  assert.ok(!existsSync(join(dir, 'test.ran')));
});

test('Verify only a complete change: Not a sparc project', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sparc-qa-'));
  write(dir, 'AGENTS.md', `# AGENTS.md\n\n## Commands\n\n| Task | Command |\n|---|---|\n| Test | \`${MARK('test')}\` |\n`);
  write(dir, 'openspec/changes/add-export/tasks.md', DONE);
  assert.equal(agent(dir)(), null);
  assert.ok(!existsSync(join(dir, 'test.ran')));
});

test('Project commands pass: All commands pass', () => {
  assert.equal(agent(project())(), null);
});

test('Project commands pass: A command fails', () => {
  const out = agent(project({ commands: [['Lint', PASS], ['Test', FAIL]] }))();
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /command "Test" \(`node -e .+`\) exited with 1/);
  assert.match(out.reason, /2 tests failed/);
});

test('Project commands pass: A command runs too long', async () => {
  // The hook uses the time limit of 300 seconds. This test calls the same function with a short limit.
  const dir = project();
  const [finding] = await runCommands(dir, [{ name: 'Test', command: 'sleep 30' }], 500);
  assert.match(finding, /^command "Test" \(`sleep 30`\) ran longer than 0\.5 s and was stopped/);
});

test('Project commands pass: Optional verify command', () => {
  const dir = project({ commands: [['Lint', MARK('lint')], ['Test', MARK('test')]] });
  assert.equal(agent(dir)(), null);
  assert.ok(existsSync(join(dir, 'lint.ran')) && existsSync(join(dir, 'test.ran')));
});

test('Project without commands: No commands named', () => {
  const out = agent(project({ commands: [['Run', MARK('run')]] }))();
  assert.equal(out.decision, undefined);
  assert.match(out.systemMessage, /names no Lint, Test or Verify command/);
});

test('Project without commands: Second stop without commands', () => {
  const stop = agent(project({ commands: [] }));
  assert.match(stop().systemMessage, /names no Lint, Test or Verify command/);
  assert.equal(stop(), null);
});

test('Spec scenarios have evidence: All scenarios passed', () => {
  assert.equal(agent(project())(), null);
});

test('Spec scenarios have evidence: Scenario without a row', () => {
  const out = agent(project({ qa: null }))();
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /"Export: Export a list" has no row in qa\.md/);
  assert.match(out.reason, /"Export: Empty list" has no row in qa\.md/);
});

test('Spec scenarios have evidence: Failed scenario', () => {
  const out = agent(project({ qa: QA([ROW('Export a list', 'passed'), ROW('Empty list', 'failed', 'See "Failed scenarios"')]) }))();
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /"Export: Empty list" failed in qa\.md/);
});

test('Spec scenarios have evidence: Passed without evidence', () => {
  const out = agent(project({ qa: QA([ROW('Export a list', 'passed'), ROW('Empty list', 'passed', '')]) }))();
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /"Export: Empty list" has no evidence in qa\.md/);
});

test('Spec scenarios have evidence: Manual scenario', () => {
  const out = agent(project({ qa: QA([ROW('Export a list', 'passed'), ROW('Empty list', 'manual', 'See "Manual checks"')]) }))();
  assert.equal(out.decision, undefined);
  assert.match(out.systemMessage, /manual checks for you: Export: Empty list/);
});

test('Tasks name their verification: Task without verification', () => {
  const out = agent(project({ tasks: DONE.replace('Add the button. Verify: `npm test`.', 'Add the button.') }))();
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /task "1\.2 Add the button\." has no "Verify:"/);
});

test('Block the stop with a reason: Checks fail', () => {
  const out = agent(project({ commands: [['Test', FAIL]], qa: null }))();
  assert.equal(out.decision, 'block');
  assert.match(out.reason, /Change "add-export" is complete, but its verification failed/);
  assert.match(out.reason, /command "Test"/);
  assert.match(out.reason, /has no row in qa\.md/);
});

test('Block the stop with a reason: Checks pass', () => {
  assert.equal(agent(project())(), null);
});

test('Limit of blocks: Fourth stop with failed checks', () => {
  const stop = agent(project({ commands: [['Test', FAIL]] }));
  for (let i = 1; i <= 3; i++) assert.equal(stop().decision, 'block', `block ${i}`);
  const out = stop();
  assert.equal(out.decision, undefined);
  assert.match(out.hookSpecificOutput.additionalContext, /open point in the canvas section "Core Risks and Missing Information"/);
  assert.match(out.systemMessage, /failed 3 times in a row and stopped to block/);
  // The live test showed that each additionalContext makes the agent reply again. So the hook is silent after the release.
  assert.equal(stop(), null, 'fifth stop');
  assert.equal(stop(), null, 'sixth stop');
});

test('Limit of blocks: Count starts again', () => {
  const dir = project({ commands: [['Test', FAIL]] });
  const stop = agent(dir);
  stop(); stop();
  write(dir, 'AGENTS.md', `# AGENTS.md\n\n## Commands\n\n| Task | Command |\n|---|---|\n| Test | \`${PASS}\` |\n`);
  assert.equal(stop(), null);
  write(dir, 'AGENTS.md', `# AGENTS.md\n\n## Commands\n\n| Task | Command |\n|---|---|\n| Test | \`${FAIL}\` |\n`);
  for (let i = 1; i <= 3; i++) assert.equal(stop().decision, 'block', `block ${i}`);
});

test('Document check does not block: Document drift in a complete change', () => {
  const dir = project();
  write(dir, 'README.md', '# Name\n');
  const stop = agent(dir);
  assert.equal(stop(), null);
  const check = stop(CHECK);
  assert.equal(check.decision, undefined);
  assert.match(check.hookSpecificOutput.additionalContext, /document drift/);
});
