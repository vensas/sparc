import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { verifyRelease } from './verify-release.mjs';

const SCRIPT = new URL('./verify-release.mjs', import.meta.url).pathname;
const ROOT = new URL('..', import.meta.url).pathname;

const CHANGELOG = (latest) => `# Changelog

## [Unreleased]

## [${latest}] - 2026-10-27

### Added

- Feature of ${latest}.

## [0.1.0] - 2026-10-22

### Added

- First version.
`;

function repo({ version = '0.6.0', ref = 'v0.6.0', latest = '0.6.0' } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'sparc-release-'));
  mkdirSync(join(dir, '.claude-plugin'));
  writeFileSync(join(dir, '.claude-plugin/plugin.json'), JSON.stringify({ name: 'sparc', version }));
  writeFileSync(join(dir, '.claude-plugin/marketplace.json'), JSON.stringify({
    name: 'sparc',
    plugins: [{ name: 'sparc', source: { source: 'github', repo: 'vensas/sparc', ref } }],
  }));
  writeFileSync(join(dir, 'CHANGELOG.md'), CHANGELOG(latest));
  return dir;
}

test('Marketplace gives the latest release: entry and manifest differ', () => {
  const { problems } = verifyRelease(repo({ ref: 'v0.5.0' }), 'v0.6.0');
  assert.equal(problems.length, 1);
  assert.match(problems[0], /marketplace ref v0\.5\.0/);
  assert.match(problems[0], /v0\.6\.0/);
});

test('Marketplace gives the latest release: entry without a github source is reported', () => {
  const dir = repo();
  writeFileSync(join(dir, '.claude-plugin/marketplace.json'), JSON.stringify({ name: 'sparc', plugins: [{ name: 'sparc', source: './' }] }));
  assert.match(verifyRelease(dir, 'v0.6.0').problems.join('\n'), /not a github source/);
});

test('Publication of a release tag: tag matches the release', () => {
  const { problems, notes } = verifyRelease(repo(), 'v0.6.0');
  assert.deepEqual(problems, []);
  assert.equal(notes, '### Added\n\n- Feature of 0.6.0.');
});

test('Publication of a release tag: tag does not match the release', () => {
  const { problems } = verifyRelease(repo({ latest: '0.5.0' }), 'v0.6.0');
  assert.equal(problems.length, 1);
  assert.match(problems[0], /changelog release 0\.5\.0/);
});

test('tag that is not vX.Y.Z is reported', () => {
  assert.match(verifyRelease(repo(), '0.6.0').problems.join('\n'), /not "vX\.Y\.Z"/);
});

test('command writes the notes file and exits 0 for a matching tag', () => {
  const dir = repo();
  const notes = join(dir, 'notes.md');
  const run = spawnSync(process.execPath, [SCRIPT, 'v0.6.0', notes], { cwd: dir, encoding: 'utf8' });
  assert.equal(run.status, 0, run.stderr);
  assert.equal(readFileSync(notes, 'utf8'), '### Added\n\n- Feature of 0.6.0.\n');
});

test('command exits 1 and names each difference', () => {
  const run = spawnSync(process.execPath, [SCRIPT, 'v9.9.9'], { cwd: repo(), encoding: 'utf8' });
  assert.equal(run.status, 1);
  assert.match(run.stderr, /plugin\.json version 0\.6\.0/);
  assert.match(run.stderr, /marketplace ref v0\.6\.0/);
  assert.match(run.stderr, /changelog release 0\.6\.0/);
});

test('sparc itself matches its latest release', () => {
  const { version } = JSON.parse(readFileSync(join(ROOT, '.claude-plugin/plugin.json'), 'utf8'));
  assert.deepEqual(verifyRelease(ROOT, `v${version}`).problems, []);
});
