// Tests for the plugin-distribution requirement "README for a first-time reader".
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const README = readFileSync(join(ROOT, 'README.md'), 'utf8');
const section = (name) => README.split(/^## /m).find((s) => s.startsWith(`${name}\n`)) ?? '';
const HOW = section('How It Works');
const TERMS = ['change', 'role', 'document drift', 'decided ADR', 'current ADR', 'superseded ADR', 'sparc markers'];

test('README for a first-time reader: Key features are short', () => {
  const bullets = section('Key Features').match(/^- /gm) ?? [];
  assert.ok(bullets.length > 0 && bullets.length <= 5, `${bullets.length} bullets`);
});

test('README for a first-time reader: Files of a new project', () => {
  const tree = HOW.match(/```text\n[\s\S]*?```/)?.[0] ?? '';
  const files = readdirSync(join(ROOT, 'templates/project'), { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile()).map((e) => e.name);
  assert.ok(files.length > 0);
  for (const file of files) assert.ok(tree.includes(basename(file)), file);
});

test('README for a first-time reader: Loop of a change', () => {
  const diagram = HOW.match(/```mermaid\n(flowchart|graph)[\s\S]*?```/)?.[0] ?? '';
  for (const step of ['propose', 'apply', 'code review', 'QA', 'archive']) assert.match(diagram, new RegExp(step, 'i'), step);
});

test('README for a first-time reader: Terms', () => {
  for (const term of TERMS) assert.match(HOW, new RegExp(`^\\| \\*?\\*?${term}\\*?\\*? \\|`, 'mi'), term);
});

test('README for a first-time reader: Writing style and limits', () => {
  assert.match(README, /ASD-STE100[^\n]*on purpose/);
  assert.match(README, /\(docs\/architecture\/canvas\.md#core-risks-and-missing-information-\)/);
});

test('README for a first-time reader: Node.js version', () => {
  assert.match(section('Get Started'), /Node\.js \(latest LTS version\)/);
  assert.doesNotMatch(README, /Node\.js \d+/);
});

test('README for a first-time reader: Website', () => {
  assert.match(README.split(/^## /m)[0], /\(https:\/\/sparc\.apps\.vensas\.de\)/);
});
