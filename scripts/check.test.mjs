import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { check, longSentences, isSparcProject, compareVersions } from './check.mjs';

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
  const other = messages(dir).filter((m) => !m.includes('placeholder') && !m.includes('run /sparc:update'));
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

function adrRepo() {
  const dir = project();
  const git = (...a) => spawnSync('git', ['-c', 'user.name=t', '-c', 'user.email=t@t', ...a], { cwd: dir, encoding: 'utf8' });
  git('init', '-q', '-b', 'main');
  const commit = (rel, text) => { write(dir, rel, text); git('add', '.'); git('commit', '-qm', 'docs: Update ADR'); };
  return { dir, commit };
}
const AMEND = (body) => `\n## Amendments\n${body}`;
const ENTRY = '\n### 2026-10-23: Add Y\n\nApproved by: [@octocat](https://github.com/octocat), chat\n\nY is also used.\n';

test('Valid ADR status: Status is not valid / Status is valid', () => {
  const { dir, commit } = adrRepo();
  commit('docs/adr/0001-a.md', ADR('approved'));
  commit('docs/adr/0002-b.md', ADR('accepted'));
  assert.ok(has(dir, '0001-a.md: status "approved" is not valid'));
  assert.ok(!messages(dir).some((m) => m.includes('0002-b.md')));
});

test('ADR date format: Date has a different format', () => {
  const { dir, commit } = adrRepo();
  commit('docs/adr/0001-a.md', ADR('accepted').replace('2026-10-22', '22.10.2026'));
  assert.ok(has(dir, '0001-a.md: date is missing or not YYYY-MM-DD'));
});

test('Unique ADR numbers: Two ADRs have the same number', () => {
  const { dir, commit } = adrRepo();
  commit('docs/adr/0002-a.md', ADR('proposed'));
  commit('docs/adr/0002-b.md', ADR('proposed'));
  assert.ok(has(dir, 'two or more ADRs have the same number'));
});

test('Supersede target exists: Superseding ADR does not exist', () => {
  const { dir, commit } = adrRepo();
  commit('docs/adr/0002-a.md', ADR('superseded by ADR-0009'));
  assert.ok(has(dir, 'superseding ADR-0009 does not exist'));
});

test('MADR front matter only: Leftover lock field / Check leaves ADR files unchanged', () => {
  const { dir, commit } = adrRepo();
  const text = ADR('accepted').replace('date:', 'locked: 0f318fa664638002\ndate:');
  commit('docs/adr/0001-a.md', text);
  assert.ok(has(dir, '0001-a.md: front matter field "locked" is not a MADR field'));
  assert.equal(readFileSync(join(dir, 'docs/adr/0001-a.md'), 'utf8'), text);
});

test('Amendments with an approver: Amended ADR has no entry / Entry has no approver', () => {
  const { dir, commit } = adrRepo();
  commit('docs/adr/0001-a.md', ADR('amended', AMEND('')));
  commit('docs/adr/0002-b.md', ADR('amended', AMEND('\n### 2026-10-23: Add Y\n\nApproved by: Someone, chat\n')));
  assert.ok(has(dir, '0001-a.md: status is "amended" but "## Amendments" has no entry'));
  assert.ok(has(dir, '0002-b.md: an amendment has no "Approved by: [@handle]'));
});

test('Decided ADR is protected through git history: Body changed after the decision', () => {
  const { dir, commit } = adrRepo();
  commit('docs/adr/0001-a.md', ADR('accepted'));
  write(dir, 'docs/adr/0001-a.md', ADR('accepted').replace('We use X.', 'We use Z.'));
  assert.ok(has(dir, '0001-a.md: changed after the decision'));
  commit('docs/adr/0001-a.md', ADR('accepted').replace('We use X.', 'We use Z.'));
  assert.ok(has(dir, '0001-a.md: changed after the decision'), 'a committed change is also reported');
});

test('Decided ADR is protected through git history: Decision maker changed after the decision', () => {
  const { dir, commit } = adrRepo();
  commit('docs/adr/0001-a.md', ADR('accepted').replace('date:', 'decision-makers: [a]\ndate:'));
  write(dir, 'docs/adr/0001-a.md', ADR('accepted').replace('date:', 'decision-makers: [b]\ndate:'));
  assert.ok(has(dir, '0001-a.md: changed after the decision'));
});

test('Decided ADR is protected through git history: Status and date change', () => {
  const { dir, commit } = adrRepo();
  commit('docs/adr/0001-a.md', ADR('accepted'));
  commit('docs/adr/0002-b.md', ADR('proposed'));
  write(dir, 'docs/adr/0001-a.md', ADR('superseded by ADR-0002').replace('2026-10-22', '2026-10-23'));
  assert.ok(!messages(dir).some((m) => m.includes('0001-a.md')));
});

test('Decided ADR is protected through git history: Changes while the ADR was proposed', () => {
  const { dir, commit } = adrRepo();
  commit('docs/adr/0001-a.md', ADR('proposed'));
  commit('docs/adr/0001-a.md', ADR('proposed').replace('We use X.', 'We use Z.'));
  commit('docs/adr/0001-a.md', ADR('accepted').replace('We use X.', 'We use Z.'));
  assert.ok(!messages(dir).some((m) => m.includes('0001-a.md')));
});

test('Decided ADR is protected through git history: Decided ADR is not committed yet', () => {
  const { dir, commit } = adrRepo();
  commit('docs/adr/0001-a.md', ADR('proposed'));
  write(dir, 'docs/adr/0001-a.md', ADR('accepted').replace('We use X.', 'We use Z.'));
  assert.ok(!messages(dir).some((m) => m.includes('0001-a.md')));
});

test('Decided ADR is protected through git history: Project is not a git repository', () => {
  const dir = project();
  write(dir, 'docs/adr/0001-a.md', ADR('accepted'));
  write(dir, 'docs/adr/0002-b.md', ADR('accepted'));
  assert.equal(messages(dir).filter((m) => m.includes('cannot protect decided ADRs')).length, 1);
  write(dir, 'docs/adr/0002-b.md', ADR('proposed'));
  write(dir, 'docs/adr/0001-a.md', ADR('proposed'));
  assert.ok(!has(dir, 'cannot protect decided ADRs'));
});

test('Existing amendments are protected: New amendment entry / Committed amendment entry changed', () => {
  const { dir, commit } = adrRepo();
  commit('docs/adr/0001-a.md', ADR('accepted', AMEND('')));
  commit('docs/adr/0001-a.md', ADR('amended', AMEND(ENTRY)));
  write(dir, 'docs/adr/0001-a.md', ADR('amended', AMEND(ENTRY + ENTRY.replace('Add Y', 'Add W'))));
  assert.ok(!messages(dir).some((m) => m.includes('0001-a.md')));
  write(dir, 'docs/adr/0001-a.md', ADR('amended', AMEND(ENTRY.replace('Y is also used.', 'Y is used.'))));
  assert.ok(has(dir, '0001-a.md: an existing amendment changed'));
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

test('Marked sparc text: templates mark the sparc text and record the version', () => {
  const agents = readFileSync(join(TEMPLATE, 'AGENTS.md'), 'utf8');
  assert.match(agents, /<!-- sparc:begin -->\n## Rules\n[\s\S]+\n<!-- sparc:end -->/);
  const config = readFileSync(join(TEMPLATE, 'openspec/config.yaml'), 'utf8');
  assert.match(config, /^sparc:\n {2}version: \d+\.\d+\.\d+$/m);
  assert.match(config, /^# sparc:begin\ncontext: \|[\s\S]+^rules:[\s\S]+^operations:[\s\S]+^# sparc:end$/m);
});

const INSTALLED = JSON.parse(readFileSync(new URL('../.claude-plugin/plugin.json', import.meta.url), 'utf8')).version;
const setVersion = (dir, version) => {
  const file = join(dir, 'openspec/config.yaml');
  const config = readFileSync(file, 'utf8');
  writeFileSync(file, version ? config.replace(/version: \S+/, `version: ${version}`) : config.replace(/^sparc:\n {2}version: \S+\n/m, ''));
};

test('Project records its sparc version: Project without a version', () => {
  const dir = project();
  setVersion(dir, null);
  assert.ok(has(dir, `openspec/config.yaml: project is at sparc 0.1.0, sparc ${INSTALLED} is installed: run /sparc:update`));
});

test('Check reports an outdated project: Project is behind', () => {
  const dir = project();
  setVersion(dir, '0.0.1');
  assert.ok(has(dir, `project is at sparc 0.0.1, sparc ${INSTALLED} is installed: run /sparc:update`));
  assert.equal(messages(dir).filter((m) => m.includes('run /sparc:update')).length, 1);
});

test('Check reports an outdated project: Project is up to date', () => {
  const dir = project();
  setVersion(dir, INSTALLED);
  assert.ok(!has(dir, 'run /sparc:update'));
});

test('Check reports an outdated project: no finding in the sparc repository itself', () => {
  assert.ok(!check(new URL('..', import.meta.url).pathname).some((f) => f.message.includes('run /sparc:update')));
});

const LONG = `${Array(30).fill('word').join(' ')}.`;

test('Sentence check only for proposed ADRs: Long sentence in a decided ADR', () => {
  const dir = project();
  write(dir, 'docs/adr/0001-a.md', ADR('accepted', `\n${LONG}\n`));
  assert.ok(!has(dir, '0001-a.md: 1 sentence(s) with more than 25 words'));
});

test('Sentence check only for proposed ADRs: Long sentence in a proposed ADR', () => {
  const dir = project();
  write(dir, 'docs/adr/0001-a.md', ADR('proposed', `\n${LONG}\n`));
  assert.ok(has(dir, '0001-a.md: 1 sentence(s) with more than 25 words'));
});

const setWorkflow = (dir, workflow) => {
  const file = join(dir, 'openspec/config.yaml');
  const config = readFileSync(file, 'utf8').replace(/^ {2}workflow: \S+\n/m, '');
  writeFileSync(file, workflow ? config.replace(/^sparc:\n/m, `sparc:\n  workflow: ${workflow}\n`) : config);
};

test('Workflow setting: Project without a workflow key', () => {
  const { dir } = repo();
  setWorkflow(dir, null);
  appendFileSync(join(dir, 'docs/backlog.md'), '\n');
  assert.ok(has(dir, 'files changed on the default branch "main"'));
});

test('Changes through pull requests: Trunk-based change', () => {
  const { dir } = repo();
  setWorkflow(dir, 'trunk');
  appendFileSync(join(dir, 'docs/backlog.md'), '\n');
  assert.ok(!has(dir, 'files changed on the default branch'));
});

test('Conventional commit messages: Trunk commit header is not conventional', () => {
  const { dir, git } = repo();
  setWorkflow(dir, 'trunk');
  git('commit', '-q', '--allow-empty', '-m', 'old stuff before the release');
  git('tag', 'v0.1.0');
  git('commit', '-q', '--allow-empty', '-m', 'updated stuff');
  git('commit', '-q', '--allow-empty', '-m', 'fix(check): Repair the range');
  assert.ok(has(dir, '"updated stuff" does not have a Conventional Commits header'));
  assert.ok(!has(dir, 'old stuff before the release'), 'commits before the last tag are not checked');
  assert.ok(!has(dir, 'Repair the range'));
});

test('Workflow setting: a value that is not trunk or pull-request is reported', () => {
  const dir = project();
  setWorkflow(dir, 'trunkk');
  assert.ok(has(dir, 'openspec/config.yaml: workflow "trunkk" is not "trunk" or "pull-request"'));
});

const decisions = (dir, lines) => {
  const rel = 'docs/architecture/canvas.md';
  write(dir, rel, readFileSync(join(dir, rel), 'utf8').replace(/(## Core Decisions[^\n]*\n)[\s\S]*?(?=\n## )/, `$1\n${lines.join('\n')}\n`));
};

test('Canvas lists each ADR with its status: ADR is not in the canvas', () => {
  const dir = project();
  write(dir, 'docs/adr/0001-a.md', ADR('proposed'));
  write(dir, 'docs/adr/0003-x.md', ADR('proposed'));
  decisions(dir, ['- [ADR-0001](../adr/0001-a.md): Use X.']);
  assert.ok(has(dir, 'ADR-0003 has no line in "Core Decisions"'));
  assert.ok(!has(dir, 'ADR-0001 has no line'));
});

test('Canvas lists each ADR with its status: Superseded ADR without its status in the canvas', () => {
  const dir = project();
  write(dir, 'docs/adr/0002-a.md', ADR('superseded by ADR-0004'));
  write(dir, 'docs/adr/0003-b.md', ADR('deprecated'));
  write(dir, 'docs/adr/0004-c.md', ADR('proposed'));
  decisions(dir, ['- [ADR-0002](../adr/0002-a.md): Use X.', '- [ADR-0003](../adr/0003-b.md): Use Y.', '- [ADR-0004](../adr/0004-c.md): Use Z.']);
  assert.ok(has(dir, 'the line of ADR-0002 in "Core Decisions" does not name its status "superseded by ADR-0004"'));
  assert.ok(has(dir, 'the line of ADR-0003 in "Core Decisions" does not name its status "deprecated"'));
});

test('Canvas lists each ADR with its status: Canvas names the status', () => {
  const dir = project();
  write(dir, 'docs/adr/0002-a.md', ADR('superseded by ADR-0004'));
  write(dir, 'docs/adr/0003-b.md', ADR('rejected'));
  write(dir, 'docs/adr/0004-c.md', ADR('proposed'));
  decisions(dir, ['- [ADR-0002](../adr/0002-a.md): Use X (superseded by ADR-0004).', '- [ADR-0003](../adr/0003-b.md): Use Y (rejected).', '- [ADR-0004](../adr/0004-c.md): Use Z.']);
  assert.ok(!messages(dir).some((m) => m.includes('"Core Decisions"')));
});

test('Agents follow only current ADRs: Rule in a project', () => {
  const sparcText = (md) => md.slice(md.indexOf('<!-- sparc:begin -->'), md.indexOf('<!-- sparc:end -->'));
  const rule = /Follow only current ADRs: `accepted` or `amended`\. For an ADR that is `superseded by ADR-NNNN`, follow the chain to the current ADR\. Do not follow a `deprecated` or `rejected` ADR\./;
  assert.match(sparcText(readFileSync(join(TEMPLATE, 'AGENTS.md'), 'utf8')), rule);
  const adrRule = readFileSync(new URL('../rules/adr.md', import.meta.url), 'utf8');
  assert.match(adrRule, /^## Current ADRs$/m);
  assert.match(adrRule, /Read the status of an ADR before you use it/);
  assert.match(adrRule, /A `proposed` ADR is current only in its own change/);
  assert.match(readFileSync(new URL('../rules/roles/architect.md', import.meta.url), 'utf8'), /the current ADRs \(see `\.\.\/adr\.md`\)/);
});

const changeDesign = (dir, path, adrList) => {
  mkdirSync(join(dir, path), { recursive: true });
  write(dir, `${path}/design.md`, `# Design\n\nContext links [ADR-0002](../../../docs/adr/0002-a.md).\n\n${adrList}\n\nNo C4 impact.\n`);
};

test('Open changes do not use old ADRs: Open change lists a superseded ADR', () => {
  const dir = project();
  write(dir, 'docs/adr/0002-a.md', ADR('superseded by ADR-0004'));
  write(dir, 'docs/adr/0004-b.md', ADR('accepted'));
  changeDesign(dir, 'openspec/changes/add-x', 'ADRs:\n\n- [ADR-0002](../../../docs/adr/0002-a.md) is amended.');
  assert.ok(has(dir, 'openspec/changes/add-x/design.md: the ADR list uses ADR-0002, which is superseded by ADR-0004'));
});

test('Open changes do not use old ADRs: Open change supersedes a current ADR', () => {
  const dir = project();
  write(dir, 'docs/adr/0002-a.md', ADR('accepted'));
  write(dir, 'docs/adr/0003-b.md', ADR('proposed'));
  changeDesign(dir, 'openspec/changes/add-x', 'ADRs: [ADR-0003](../../../docs/adr/0003-b.md) is new and supersedes [ADR-0002](../../../docs/adr/0002-a.md).');
  assert.ok(!messages(dir).some((m) => m.includes('the ADR list uses')));
});

test('Open changes do not use old ADRs: Archived change links to a superseded ADR', () => {
  const dir = project();
  write(dir, 'docs/adr/0002-a.md', ADR('superseded by ADR-0004'));
  write(dir, 'docs/adr/0004-b.md', ADR('accepted'));
  changeDesign(dir, 'openspec/changes/archive/2026-10-01-add-x', 'ADRs: [ADR-0002](../../../docs/adr/0002-a.md) is new.');
  changeDesign(dir, 'openspec/changes/add-y', 'ADRs: [ADR-0004](../../../docs/adr/0004-b.md) is new.');
  assert.ok(!messages(dir).some((m) => m.includes('the ADR list uses')));
});
