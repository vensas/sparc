import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { check, lockAdr, longSentences, isSparcProject, compareVersions } from './check.mjs';

const TEMPLATE = new URL('../templates/project', import.meta.url).pathname;
const CHECK = new URL('./check.mjs', import.meta.url).pathname;

function project() {
  const dir = mkdtempSync(join(tmpdir(), 'sparc-'));
  cpSync(TEMPLATE, dir, { recursive: true });
  return dir;
}
const write = (dir, rel, text) => writeFileSync(join(dir, rel), text);
const messages = (dir) => check(dir).map((f) => `${f.file}: ${f.message}`);
const has = (dir, text) => messages(dir).some((m) => m.includes(text));

const ADR = (status, extra = '') => `---\nstatus: ${status}\ndate: 2026-10-22\n---\n\n# Use X\n\nWe use X.\n${extra}`;

test('template project is a sparc project with only placeholder findings', () => {
  const dir = project();
  assert.ok(isSparcProject(dir));
  const other = messages(dir).filter((m) => !m.includes('placeholder'));
  assert.deepEqual(other, []);
});

test('missing documents are reported', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sparc-'));
  assert.ok(has(dir, 'README.md: file is missing'));
  assert.ok(has(dir, 'docs/adr: folder is missing'));
});

test('README without required sections is reported', () => {
  const dir = project();
  write(dir, 'README.md', '# Name\n\n## Overview\n\nText.\n');
  assert.ok(has(dir, 'introduction before the first section is empty'));
  assert.ok(has(dir, '"## Get Started" is missing'));
});

test('C4 file needs context and container diagrams', () => {
  const dir = project();
  write(dir, 'docs/architecture/c4.md', '```mermaid\nC4Context\n```\n');
  assert.ok(has(dir, 'C4Container diagram is missing'));
  assert.ok(!has(dir, 'C4Context diagram is missing'));
});

test('backlog items follow the state of their OpenSpec change', () => {
  const dir = project();
  mkdirSync(join(dir, 'openspec/changes/archive/2026-10-01-add-login'), { recursive: true });
  mkdirSync(join(dir, 'openspec/changes/add-export'), { recursive: true });
  write(dir, 'docs/backlog.md', '# Backlog\n\n## Goal\n\nA goal.\n\n## Items\n\n- [ ] Login (change: add-login)\n- [x] Search (change: add-search)\n');
  assert.ok(has(dir, 'change "add-login" is archived but its item is not checked'));
  assert.ok(has(dir, 'item for change "add-search" is checked but the change is not archived'));
  assert.ok(has(dir, 'change "add-export" has no backlog item'));
});

test('backlog without goal is reported', () => {
  const dir = project();
  write(dir, 'docs/backlog.md', '# Backlog\n\n## Items\n\n- [ ] One\n');
  assert.ok(has(dir, '"## Goal" is missing or empty'));
});

test('ADR status must be valid and decided ADRs must be locked', () => {
  const dir = project();
  write(dir, 'docs/adr/0001-a.md', ADR('ammended'));
  write(dir, 'docs/adr/0002-b.md', ADR('accepted'));
  write(dir, 'docs/adr/0003-c.md', ADR('proposed'));
  assert.ok(has(dir, '0001-a.md: status "ammended" is not valid'));
  assert.ok(has(dir, '0002-b.md: status is "accepted" but the ADR is not locked'));
  assert.ok(!messages(dir).some((m) => m.includes('0003-c.md')));
});

test('a locked ADR reports body changes but permits status changes and amendments', () => {
  const dir = project();
  const file = join(dir, 'docs/adr/0001-a.md');
  writeFileSync(file, ADR('accepted', '\n## Amendments\n'));
  lockAdr(file);
  assert.ok(!messages(dir).some((m) => m.includes('0001-a.md')));

  writeFileSync(file, readFileSync(file, 'utf8').replace('status: accepted', 'status: amended'));
  assert.ok(has(dir, 'status is "amended" but "## Amendments" has no entry'));

  appendFileSync(file, '\n### 2026-10-22: Add Y\n\nY is also used.\n');
  assert.ok(has(dir, 'an amendment has no "Approved by: [@handle]'));

  writeFileSync(file, readFileSync(file, 'utf8').replace('Y is also used.', 'Approved by: Someone, chat\n\nY is also used.'));
  assert.ok(has(dir, 'an amendment has no "Approved by: [@handle]'));

  writeFileSync(file, readFileSync(file, 'utf8').replace('Someone', '[@octocat](https://github.com/octocat)'));
  assert.ok(!messages(dir).some((m) => m.includes('0001-a.md')));

  writeFileSync(file, readFileSync(file, 'utf8').replace('We use X.', 'We use Z.'));
  assert.ok(has(dir, 'body changed after the lock'));
});

test('superseded ADR must point to an existing other ADR', () => {
  const dir = project();
  write(dir, 'docs/adr/0001-a.md', ADR('superseded by ADR-0009'));
  lockAdr(join(dir, 'docs/adr/0001-a.md'));
  assert.ok(has(dir, 'superseding ADR-0009 does not exist'));
});

test('long sentences are found outside code blocks and tables', () => {
  const long = Array(30).fill('word').join(' ');
  assert.equal(longSentences(`Short one. ${long}.`).length, 1);
  assert.equal(longSentences(`\`\`\`\n${long}\n\`\`\`\n| ${long} |\n`).length, 0);
  assert.equal(longSentences(`- ${Array(20).fill('a').join(' ')}\n- ${Array(20).fill('b').join(' ')}\n`).length, 0);
});

test('code changes without document changes are reported in a git repository', () => {
  const dir = project();
  const git = (...a) => spawnSync('git', a, { cwd: dir });
  git('init', '-q');
  git('add', '.');
  git('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-qm', 'init');
  write(dir, 'app.js', 'x\n');
  assert.ok(has(dir, 'no document changed'));
  appendFileSync(join(dir, 'docs/backlog.md'), '\n');
  assert.ok(!has(dir, 'no document changed'));
});

test('hook mode warns without blocking, once for the same findings, and respects stop_hook_active', () => {
  const dir = project();
  const env = { ...process.env, CLAUDE_PLUGIN_DATA: mkdtempSync(join(tmpdir(), 'sparc-data-')) };
  const run = (event) => spawnSync('node', [CHECK, '--hook'], { input: JSON.stringify(event), encoding: 'utf8', env });
  const out = run({ cwd: dir, hook_event_name: 'Stop' });
  assert.equal(out.status, 0);
  const json = JSON.parse(out.stdout);
  assert.match(json.systemMessage, /sparc: \d+ document finding/);
  assert.equal(json.hookSpecificOutput.hookEventName, 'Stop');
  assert.equal(json.decision, undefined);
  assert.equal(run({ cwd: dir, hook_event_name: 'Stop' }).stdout, '');
  write(dir, 'docs/backlog.md', '# Backlog\n');
  assert.match(run({ cwd: dir, hook_event_name: 'Stop' }).stdout, /## Goal\W+is missing/);
  assert.equal(run({ cwd: dir, stop_hook_active: true }).stdout, '');
  assert.equal(run({ cwd: tmpdir() }).stdout, '');
});

const CHANGELOG = (releases) => `# Changelog\n\n## [Unreleased]\n\n${releases}`;

test('changelog: missing file and missing Unreleased section are reported', () => {
  const dir = project();
  assert.ok(!messages(dir).some((m) => m.startsWith('CHANGELOG.md')));
  write(dir, 'CHANGELOG.md', '# Changelog\n\n## [1.0.0] - 2026-10-22\n');
  assert.ok(has(dir, '"## [Unreleased]" is missing or not the first section'));
  const empty = mkdtempSync(join(tmpdir(), 'sparc-'));
  assert.ok(messages(empty).includes('CHANGELOG.md: file is missing'));
});

test('changelog: release headings, order and types of change are checked', () => {
  const dir = project();
  write(dir, 'CHANGELOG.md', CHANGELOG('## [1.0] - 2026-10-22\n\n## [0.2.0] - 2026-10-01\n\n### Improved\n\n## [0.3.0] - 2026-09-01\n\n### Fixed\n'));
  assert.ok(has(dir, 'release heading "## [1.0] - 2026-10-22" is not'));
  assert.ok(has(dir, 'release 0.3.0 is not lower than the release 0.2.0 above it'));
  assert.ok(has(dir, 'type of change "### Improved" is not one of'));
  assert.ok(!has(dir, '"### Fixed"'));
});

test('changelog: a valid changelog has no findings', () => {
  const dir = project();
  write(dir, 'CHANGELOG.md', CHANGELOG('### Added\n\n- New.\n\n## [1.0.0] - 2026-10-22\n\n### Fixed\n\n- Bug.\n\n## [0.1.0-rc.1] - 2026-10-01 [YANKED]\n'));
  assert.ok(!messages(dir).some((m) => m.startsWith('CHANGELOG.md')));
});

test('version: compareVersions orders by major, minor and patch', () => {
  assert.ok(compareVersions('1.0.0', '0.9.9') > 0);
  assert.ok(compareVersions('0.10.0', '0.9.0') > 0);
  assert.equal(compareVersions('1.2.3', '1.2.3-rc.1'), 0);
});

test('version: manifest version must equal the latest release', () => {
  const dir = project();
  mkdirSync(join(dir, '.claude-plugin'));
  write(dir, '.claude-plugin/plugin.json', '{"name":"x","version":"0.2.0"}');
  assert.ok(!has(dir, 'is not equal to the latest changelog release'));
  write(dir, 'CHANGELOG.md', CHANGELOG('## [0.1.0] - 2026-10-22\n'));
  assert.ok(has(dir, '.claude-plugin/plugin.json: version 0.2.0 is not equal to the latest changelog release 0.1.0'));
  write(dir, '.claude-plugin/plugin.json', '{"name":"x","version":"0.1.0"}');
  assert.ok(!has(dir, 'is not equal to the latest changelog release'));
});

function repo() {
  const dir = project();
  const git = (...a) => spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd: dir });
  git('init', '-q', '-b', 'main');
  git('add', '.');
  git('commit', '-qm', 'chore: Initial commit');
  return { dir, git };
}

test('git: commits on the work branch need a Conventional Commits header', () => {
  const { dir, git } = repo();
  git('switch', '-q', '-c', 'feat/x');
  git('commit', '-q', '--allow-empty', '-m', 'updated stuff');
  git('commit', '-q', '--allow-empty', '-m', 'feat(check): Add changelog check');
  assert.ok(has(dir, '"updated stuff" does not have a Conventional Commits header'));
  assert.ok(!has(dir, 'Add changelog check'));
});

test('git: changes on the default branch are reported', () => {
  const { dir, git } = repo();
  assert.ok(!has(dir, 'files changed on the default branch'));
  appendFileSync(join(dir, 'docs/backlog.md'), '\n');
  assert.ok(has(dir, 'files changed on the default branch "main"'));
  git('switch', '-q', '-c', 'feat/x');
  assert.ok(!has(dir, 'files changed on the default branch'));
});
