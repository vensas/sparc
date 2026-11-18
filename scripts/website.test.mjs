// Tests for the website spec. Each test name starts with "<Requirement>: <Scenario>".
// The tests build the site into a temporary folder and read the built files.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { build } from './build-website.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const temp = () => mkdtempSync(join(tmpdir(), 'sparc-website-'));

function buildRepo(root = ROOT) {
  const out = temp();
  build({ root, out });
  return out;
}

const OUT = buildRepo();
const page = (rel, out = OUT) => readFileSync(join(out, rel), 'utf8');
const files = (dir) => readdirSync(dir, { recursive: true, withFileTypes: true })
  .filter((e) => e.isFile()).map((e) => join(e.parentPath, e.name));
const section = (html, id) => html.match(new RegExp(`<section[^>]*id="${id}"[\\s\\S]*?</section>`))?.[0] ?? '';
const header = (html) => html.match(/<header[\s\S]*?<\/header>/)?.[0] ?? '';
const footer = (html) => html.match(/<footer[\s\S]*?<\/footer>/)?.[0] ?? '';

// A copy of the data that the build reads, with a given set of ADRs, archived changes and releases.
function fixture({ adrs = 0, archived = [], releases = ['0.8.0'] } = {}) {
  const root = temp();
  cpSync(join(ROOT, 'website'), join(root, 'website'), { recursive: true });
  cpSync(join(ROOT, 'docs/assets'), join(root, 'docs/assets'), { recursive: true });
  cpSync(join(ROOT, '.claude-plugin'), join(root, '.claude-plugin'), { recursive: true });
  mkdirSync(join(root, 'docs/adr'), { recursive: true });
  writeFileSync(join(root, 'docs/adr/0000-template.md'), '# Template\n');
  for (let n = 1; n <= adrs; n++) writeFileSync(join(root, `docs/adr/${String(n).padStart(4, '0')}-decision-${n}.md`), '# ADR\n');
  for (const name of archived) mkdirSync(join(root, 'openspec/changes/archive', name), { recursive: true });
  mkdirSync(join(root, 'openspec/changes/archive'), { recursive: true });
  const log = releases.map((v) => `## [${v}] - 2026-11-16\n\n### Added\n\n- Item.\n`).join('\n');
  writeFileSync(join(root, 'CHANGELOG.md'), `# Changelog\n\n## [Unreleased]\n\n${log}`);
  return root;
}

test('Pages in three languages: Pages of the built site (English)', () => {
  for (const name of ['index.html']) assert.ok(page(name).startsWith('<!doctype html>'), name);
});

test('First viewport of the landing page: First viewport', () => {
  const head = header(page('index.html'));
  assert.match(head, /class="brand"[\s\S]*?<svg/, 'logo');
  assert.match(head, /<h1>[^<]+<\/h1>/, 'heading');
  assert.ok(head.includes('claude plugin marketplace add vensas/sparc'));
  assert.ok(head.includes('claude plugin install sparc@sparc'));
  assert.ok(head.includes('href="https://github.com/vensas/sparc"'));
});

test('First viewport of the landing page: Copy the install commands', () => {
  const button = header(page('index.html')).match(/<button[^>]*data-copy="([^"]*)"/);
  assert.ok(button, 'copy button');
  assert.equal(button[1], 'claude plugin marketplace add vensas/sparc&#10;claude plugin install sparc@sparc');
  assert.match(page('assets/site.js'), /navigator\.clipboard\.writeText\(\w+\.dataset\.copy\)/);
});

test('Sections of the landing page: Order of the sections', () => {
  const ids = [...page('index.html').matchAll(/<section[^>]*id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids, ['why', 'loop', 'roles', 'documents', 'record', 'faq', 'install']);
});

test('Sections of the landing page: Problems and answers', () => {
  const rows = [...section(page('index.html'), 'why').matchAll(/<tr><th scope="row">([^<]+)<\/th><td>([^<]+)/g)];
  assert.ok(rows.length >= 3, `${rows.length} problems`);
  for (const [, problem, answer] of rows) assert.ok(problem.trim() && answer.trim());
});

test('FAQ: Open a FAQ answer with the keyboard', () => {
  const faq = section(page('index.html'), 'faq');
  const items = [...faq.matchAll(/<details><summary>[^<]+<\/summary><p>/g)];
  assert.ok(items.length > 0, 'questions are native details and summary elements');
  assert.doesNotMatch(faq, /tabindex="-1"/);
});

test('Record from the repository: A new release', () => {
  const before = buildRepo(fixture({ releases: ['0.8.0', '0.7.0'] }));
  const after = buildRepo(fixture({ releases: ['0.9.0', '0.8.0', '0.7.0'] }));
  assert.match(section(page('index.html', before), 'record'), /2, latest 0\.8\.0/);
  assert.match(section(page('index.html', after), 'record'), /3, latest 0\.9\.0/);
});

test('Record from the repository: A template is not an ADR', () => {
  const out = buildRepo(fixture({ adrs: 17 }));
  assert.match(section(page('index.html', out), 'record'), />17 ADRs</);
});

test('Record from the repository: Most recent archived changes', () => {
  const archived = ['2026-11-01-a', '2026-11-02-b', '2026-11-03-c', '2026-11-04-d', '2026-11-05-e', '2026-11-06-f'];
  const record = section(page('index.html', buildRepo(fixture({ archived }))), 'record');
  assert.match(record, />6</);
  const shown = [...record.matchAll(/archive\/(\d{4}-\d{2}-\d{2}-\w+)"/g)].map((m) => m[1]);
  assert.deepEqual(shown, ['2026-11-06-f', '2026-11-05-e', '2026-11-04-d', '2026-11-03-c', '2026-11-02-b']);
});

test('Footer: Footer of the English landing page', () => {
  const foot = footer(page('index.html'));
  const version = JSON.parse(readFileSync(join(ROOT, '.claude-plugin/plugin.json'), 'utf8')).version;
  for (const href of ['https://vensas.de', '/imprint.html', '/privacy.html', 'https://github.com/vensas/sparc']) {
    assert.ok(foot.includes(`href="${href}"`), href);
  }
  assert.ok(foot.includes(`sparc ${version}`), 'version');
  assert.match(foot, /MIT/);
});

test('No cookies and no third-party requests: Resources of a page', () => {
  const own = (url) => url.startsWith('/') && !url.startsWith('//') || url.startsWith('#')
    || url.startsWith('https://sparc.apps.vensas.de/') || !/^[a-z]+:|^\/\//i.test(url);
  for (const file of files(OUT).filter((f) => /\.(html|css|js)$/.test(f))) {
    const text = readFileSync(file, 'utf8');
    const urls = [
      ...[...text.matchAll(/\ssrc="([^"]*)"/g)].map((m) => m[1]),
      ...[...text.matchAll(/<link\b[^>]*\shref="([^"]*)"/g)].map((m) => m[1]),
      ...[...text.matchAll(/url\(\s*["']?([^"')]+)/g)].map((m) => m[1]),
      ...[...text.matchAll(/@import\s+(?:url\()?["']?([^"');]+)/g)].map((m) => m[1]),
    ];
    for (const url of urls) assert.ok(own(url), `${file}: ${url}`);
  }
});

test('No cookies and no third-party requests: No cookies', () => {
  for (const file of files(OUT).filter((f) => /\.(html|js)$/.test(f))) {
    assert.doesNotMatch(readFileSync(file, 'utf8'), /document\.cookie|localStorage|sessionStorage/, file);
  }
});

test('Web server: Security headers (no inline styles or scripts for the CSP)', () => {
  for (const file of files(OUT).filter((f) => f.endsWith('.html'))) {
    const html = readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /<style|\sstyle="|<script(?![^>]*\ssrc=)|\son[a-z]+="/, file);
  }
});
