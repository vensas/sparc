// QA tests for the change add-qa-engineer. Each test name starts with "<Requirement>: <Scenario>" of the qa-engineering spec.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseFrontMatter } from './check.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const CHANGE = 'add-qa-engineer';

// The change folder is active before archive and in the archive after it.
function changeDir() {
  const active = join(ROOT, 'openspec/changes', CHANGE);
  if (existsSync(active)) return active;
  const archive = join(ROOT, 'openspec/changes/archive');
  const name = readdirSync(archive).find((n) => n.endsWith(`-${CHANGE}`));
  return name && join(archive, name);
}

function specScenarios() {
  const main = join(ROOT, 'openspec/specs/qa-engineering/spec.md');
  const spec = readFileSync(existsSync(main) ? main : join(changeDir(), 'specs/qa-engineering/spec.md'), 'utf8');
  const out = [];
  let requirement;
  for (const line of spec.split('\n')) {
    const r = line.match(/^### Requirement: (.+)$/);
    if (r) requirement = r[1].trim();
    const s = line.match(/^#### Scenario: (.+)$/);
    if (s) out.push(`${requirement}: ${s[1].trim()}`);
  }
  return out;
}

function qaRows() {
  const md = readFileSync(join(changeDir(), 'qa.md'), 'utf8');
  const rows = [...md.matchAll(/^\| ([^|]+?) \| ([^|]+?) \| (.+) \|$/gm)]
    .map(([, scenario, result, evidence]) => ({ scenario, result, evidence }))
    .filter((r) => r.scenario !== 'Scenario' && !/^-+$/.test(r.scenario));
  return { md, rows };
}

const testNames = () => new Set([...readFileSync(new URL(import.meta.url), 'utf8').matchAll(/^test\('([^']+)'/gm)].map((m) => m[1]));

test('QA engineer agent: Agent is available', () => {
  const { data } = parseFrontMatter(readFileSync(join(ROOT, 'agents/qa-engineer.md'), 'utf8'));
  assert.equal(data.name, 'qa-engineer');
  assert.ok(data.description, 'the agent needs a description');
});

test('QA engineer agent: Plugin stays valid', (t) => {
  const run = spawnSync('claude', ['plugin', 'validate', '.'], { cwd: ROOT, encoding: 'utf8' });
  if (run.error) return t.skip('claude CLI is not installed');
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.match(run.stdout, /Validation passed/);
});

test('Scenario report with evidence: Each scenario has one result', () => {
  const { rows } = qaRows();
  assert.deepEqual(rows.map((r) => r.scenario).sort(), specScenarios().sort(), 'qa.md must list each spec scenario one time');
  for (const row of rows) assert.ok(['passed', 'failed', 'manual'].includes(row.result), `"${row.scenario}" has result "${row.result}"`);
});

test('Scenario report with evidence: Passed scenario', () => {
  const names = testNames();
  for (const row of qaRows().rows.filter((r) => r.result === 'passed')) {
    const named = [...row.evidence.matchAll(/Test "([^"]+)"/g)].map((m) => m[1]);
    assert.ok(named.length || /`[^`]+`/.test(row.evidence), `passed row "${row.scenario}" names no test and no command`);
    for (const name of named) assert.ok(names.has(name), `passed row "${row.scenario}" names the unknown test "${name}"`);
    if (named.length) assert.match(row.evidence, /`node --test 'scripts\/\*\.test\.mjs'`: passed/, `passed row "${row.scenario}" gives no command and result`);
  }
});

test('Scenario report with evidence: Manual scenario', () => {
  const { md, rows } = qaRows();
  for (const row of rows.filter((r) => r.result === 'manual')) {
    const entry = md.split(`### ${row.scenario}\n`)[1]?.split(/^##+ /m)[0];
    assert.ok(entry, `manual row "${row.scenario}" has no manual check section`);
    for (const field of ['Reason:', 'Steps:', 'Expected result:']) assert.ok(entry.includes(field), `"${row.scenario}" has no ${field}`);
  }
});
