// Tests for the website spec. Each test name starts with "<Requirement>: <Scenario>".
// The tests build the site into a temporary folder and read the built files.
import { after, test } from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, render } from './build-website.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const temps = [];
const temp = () => { const dir = mkdtempSync(join(tmpdir(), 'sparc-website-')); temps.push(dir); return dir; };
after(() => { for (const dir of temps) rmSync(dir, { recursive: true, force: true }); });

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

const LEGAL = {
  en: { directors: /Managing directors: \p{Lu}/u, ip: 'IP address', basis: 'Art. 6 (1) (f) GDPR', rights: /Art\. 15\b[\s\S]*Art\. 16\b[\s\S]*Art\. 17\b[\s\S]*Art\. 18\b[\s\S]*Art\. 20\b[\s\S]*Art\. 21\b/, complain: 'supervisory authority', log: ['date and time', 'requested page', 'browser'], none: ['no cookies', 'no analytics'] },
  de: { directors: /Geschäftsführer: \p{Lu}/u, ip: 'IP-Adresse', basis: 'Art. 6 Abs. 1 lit. f DSGVO', rights: /Art\. 15\b[\s\S]*Art\. 16\b[\s\S]*Art\. 17\b[\s\S]*Art\. 18\b[\s\S]*Art\. 20\b[\s\S]*Art\. 21\b/, complain: 'Aufsichtsbehörde', log: ['Datum und Uhrzeit', 'aufgerufene Seite', 'Browser'], none: ['keine Cookies', 'keine Analyse'] },
};
const prefix = (lang) => (lang === 'en' ? '' : `${lang}/`);
const main = (html) => html.match(/<main[\s\S]*?<\/main>/)?.[0] ?? '';

test('Imprint: Register data', () => {
  for (const lang of Object.keys(LEGAL)) {
    const text = main(page(`${prefix(lang)}imprint.html`));
    for (const value of ['vensas GmbH', 'Bahnhofstraße 31', '66111 Saarbrücken', 'Amtsgericht Saarbrücken', 'HRB 110062', 'DE366043924', 'kontakt@vensas.de', '+49 681 30984780']) {
      assert.ok(text.includes(value), `${lang}: ${value}`);
    }
    assert.match(text, LEGAL[lang].directors, `${lang}: managing directors`);
  }
});

test('Imprint: Binding language', () => {
  assert.match(main(page('imprint.html')), /German text is binding[\s\S]*?href="\/de\/imprint\.html"/);
  assert.doesNotMatch(main(page('de/imprint.html')), /class="binding"/);
});

test('Privacy policy: Controller and rights', () => {
  for (const [lang, want] of Object.entries(LEGAL)) {
    const text = main(page(`${prefix(lang)}privacy.html`));
    for (const value of ['vensas GmbH', 'Bahnhofstraße 31', '66111 Saarbrücken', 'kontakt@vensas.de', want.complain]) assert.ok(text.includes(value), `${lang}: ${value}`);
    assert.match(text, want.rights, `${lang}: rights`);
  }
  assert.match(main(page('privacy.html')), /German text is binding[\s\S]*?href="\/de\/privacy\.html"/);
});

test('Privacy policy for the hosting: Hosting', () => {
  for (const [lang, want] of Object.entries(LEGAL)) {
    const text = main(page(`${prefix(lang)}privacy.html`));
    for (const value of ['Hetzner Online GmbH', want.ip, want.basis, ...want.log, ...want.none]) assert.ok(text.includes(value), `${lang}: ${value}`);
  }
});

const LANGS = ['en', 'de'];

test('Pages in two languages: Pages of the built site', () => {
  for (const lang of LANGS) {
    for (const name of ['index.html', 'imprint.html', 'privacy.html', '404.html']) {
      assert.ok(page(`${prefix(lang)}${name}`).startsWith('<!doctype html>'), `${lang}/${name}`);
    }
  }
});

test('Pages in two languages: Change the language', () => {
  const switcher = header(page('de/imprint.html')).match(/<li class="lang">[\s\S]*?<\/li>/)?.[0] ?? '';
  assert.match(switcher, /<a href="\/imprint\.html" lang="en"[^>]*>EN<\/a>/);
  assert.match(switcher, /<a href="\/de\/imprint\.html" lang="de"[^>]*aria-current="true"[^>]*>DE<\/a>/);
});

test('Pages in two languages: Language of a page', () => {
  const html = page('de/index.html');
  assert.match(html, /<html lang="de">/);
  for (const [lang, path] of [['en', '/'], ['de', '/de/']]) {
    assert.ok(html.includes(`<link rel="alternate" hreflang="${lang}" href="https://sparc.apps.vensas.de${path}">`), lang);
  }
});

test('Pages in two languages: Same keys in all language files', () => {
  const shape = (value) => Array.isArray(value) ? value.map(shape)
    : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape(value[k])])) : typeof value;
  const en = shape(JSON.parse(readFileSync(join(ROOT, 'website/i18n/en.json'), 'utf8')));
  for (const lang of LANGS) assert.deepEqual(shape(JSON.parse(readFileSync(join(ROOT, `website/i18n/${lang}.json`), 'utf8'))), en, lang);
});

test('Footer: Footer of the German landing page', () => {
  const foot = footer(page('de/index.html'));
  const version = JSON.parse(readFileSync(join(ROOT, '.claude-plugin/plugin.json'), 'utf8')).version;
  for (const href of ['https://vensas.de', '/de/imprint.html', '/de/privacy.html']) assert.ok(foot.includes(`href="${href}"`), href);
  assert.ok(foot.includes(`sparc ${version}`), 'version');
});

const CLAUDE = 'npm install -g @fission-ai/openspec&#10;claude plugin marketplace add vensas/sparc&#10;claude plugin install sparc@sparc';
const COPILOT = 'npm install -g @fission-ai/openspec&#10;copilot plugin marketplace add vensas/sparc&#10;copilot plugin install sparc@sparc';
const panel = (html, id) => html.match(new RegExp(`<div class="agent-cmd" id="${id}"[^>]*>[\\s\\S]*?</pre>`))?.[0] ?? '';
const tabs = (html) => html.match(/<div class="agent-switch"[^>]*>[\s\S]*?<\/div>/)?.[0] ?? '';

test('First viewport of the landing page: First viewport', () => {
  const head = header(page('index.html'));
  assert.match(head, /class="brand"[\s\S]*?<svg/, 'logo');
  assert.match(head, /<h1>[^<]+<\/h1>/, 'heading');
  assert.match(tabs(head), /role="tablist"/, 'agent switch');
  for (const text of ['npm install -g @fission-ai/openspec', 'claude plugin marketplace add vensas/sparc', 'claude plugin install sparc@sparc']) {
    assert.ok(panel(head, 'cmd-claude').includes(text), text);
  }
  assert.ok(head.includes('href="https://github.com/vensas/sparc"'));
});

// Runs the real site.js against a small stand-in of the DOM, built from the agent switch of a built page.
function runSwitch(html) {
  const doc = { activeElement: null, documentElement: { classList: { add() {} } } };
  const element = (attrs) => ({
    attrs, id: attrs.id, hidden: /\shidden[\s>]/.test(attrs.raw ?? ''), tabIndex: attrs.tabindex === '-1' ? -1 : 0, listeners: {}, textContent: attrs.text ?? '',
    dataset: { copy: attrs['data-copy']?.replace(/&#10;/g, '\n') },
    setAttribute(key, value) { this.attrs[key] = String(value); },
    getAttribute(key) { return this.attrs[key] ?? null; },
    addEventListener(type, fn) { (this.listeners[type] ??= []).push(fn); },
    fire(type, event = {}) { for (const fn of this.listeners[type] ?? []) fn({ preventDefault() {}, ...event }); },
    focus() { doc.activeElement = this; },
  });
  const attrsOf = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  const tabs = [...html.matchAll(/<button type="button" role="tab"[^>]*>([^<]*)</g)].map((m) => element({ ...attrsOf(m[0]), text: m[1] }));
  const panels = [...html.matchAll(/<div class="agent-cmd"[^>]*>/g)].map((m) => element({ ...attrsOf(m[0]), raw: m[0] }));
  const list = element({ raw: html.match(/<div class="agent-switch"[^>]*>/)[0] });
  list.querySelectorAll = () => tabs;
  const copy = element({ text: 'Copy' });
  const byId = Object.fromEntries([...tabs, ...panels].map((e) => [e.attrs.id, e]));
  Object.assign(doc, {
    getElementById: (id) => byId[id],
    querySelector: (selector) => ({ '[data-agents]': list, '.agent-cmd:not([hidden])': panels.find((p) => !p.hidden) })[selector] ?? null,
    querySelectorAll: (selector) => (selector === '[data-copy-agent]' ? [copy] : []),
  });
  const clipboard = [];
  const context = { document: doc, matchMedia: () => ({ matches: false }), setTimeout() {}, addEventListener() {}, requestAnimationFrame() {},
    navigator: { clipboard: { writeText: (text) => { clipboard.push(text); return { then: (ok) => ok() }; } } } };
  vm.runInNewContext(readFileSync(join(OUT, 'assets/site.js'), 'utf8'), context);
  const tab = (id) => byId[id];
  const shown = () => panels.filter((p) => !p.hidden).map((p) => p.attrs.id);
  return { list, tab, panels, shown, copy, clipboard, doc };
}

test('First viewport of the landing page: Copy the install commands', () => {
  const head = header(page('index.html'));
  assert.match(head, /<button class="copy"[^>]*data-copy-agent/, 'copy button');
  const ui = runSwitch(head);
  ui.copy.fire('click');
  assert.deepEqual(ui.clipboard, [CLAUDE.replace(/&#10;/g, '\n')]);
});

test('First viewport of the landing page: Select GitHub Copilot', () => {
  const ui = runSwitch(header(page('index.html')));
  assert.deepEqual(ui.shown(), ['cmd-claude']);
  ui.tab('tab-copilot').fire('click');
  assert.deepEqual(ui.shown(), ['cmd-copilot']);
  assert.ok(panel(header(page('index.html')), 'cmd-copilot').includes('copilot plugin marketplace add vensas/sparc'));
  ui.copy.fire('click');
  assert.deepEqual(ui.clipboard, [COPILOT.replace(/&#10;/g, '\n')]);
});

test('First viewport of the landing page: Switch with the keyboard', () => {
  const ui = runSwitch(header(page('index.html')));
  assert.equal(ui.list.hidden, false, 'the script shows the tab list');
  for (const p of ui.panels) {
    assert.equal(p.getAttribute('role'), 'tabpanel');
    assert.equal(p.getAttribute('aria-labelledby'), p.attrs.id.replace('cmd-', 'tab-'));
  }
  ui.tab('tab-claude').fire('keydown', { key: 'ArrowRight' });
  assert.equal(ui.tab('tab-copilot').getAttribute('aria-selected'), 'true');
  assert.equal(ui.tab('tab-claude').getAttribute('aria-selected'), 'false');
  assert.equal(ui.doc.activeElement, ui.tab('tab-copilot'));
  assert.deepEqual([ui.tab('tab-claude').tabIndex, ui.tab('tab-copilot').tabIndex], [-1, 0]);
  assert.deepEqual(ui.shown(), ['cmd-copilot']);
  ui.tab('tab-copilot').fire('keydown', { key: 'ArrowLeft' });
  assert.deepEqual(ui.shown(), ['cmd-claude']);
  assert.equal(ui.doc.activeElement, ui.tab('tab-claude'));
});

test('First viewport of the landing page: Page without JavaScript', () => {
  for (const lang of ['en', 'de']) {
    const head = header(page(`${prefix(lang)}index.html`));
    assert.match(tabs(head), /^<div class="agent-switch"[^>]*\shidden>/, `${lang}: the tab list is hidden`);
    for (const [id, name] of [['cmd-claude', 'Claude Code'], ['cmd-copilot', 'GitHub Copilot CLI']]) {
      assert.doesNotMatch(panel(head, id), /^<div[^>]*\shidden/, `${lang}: ${id} shows`);
      assert.doesNotMatch(panel(head, id), /^<div[^>]*role="tabpanel"/, `${lang}: ${id} is no tab panel without the script`);
      assert.match(panel(head, id), new RegExp(`<p class="agent-name">${name}</p>`), `${lang}: ${name}`);
    }
  }
});

test('Supported agents on the website: Title block', () => {
  for (const [lang, type, requires] of [['en', /Plugin for coding agents/, /Claude Code or GitHub Copilot CLI/], ['de', /Plugin für Coding-Agenten/, /Claude Code oder GitHub Copilot CLI/]]) {
    const block = header(page(`${prefix(lang)}index.html`)).match(/<div class="titleblock">[\s\S]*?<\/dl>/)?.[0] ?? '';
    assert.match(block, type, `${lang}: type`);
    assert.match(block, requires, `${lang}: requires`);
  }
});

test('Supported agents on the website: FAQ about other agents', () => {
  for (const lang of ['en', 'de']) {
    const first = section(page(`${prefix(lang)}index.html`), 'faq').match(/<details>[\s\S]*?<\/details>/)?.[0] ?? '';
    assert.match(first, /Claude Code/, lang);
    assert.match(first, /GitHub Copilot CLI/, lang);
    assert.match(first, /href="https:\/\/github\.com\/vensas\/sparc#supported-agents"/, lang);
  }
});

test('Sections of the landing page: Order of the sections', () => {
  const ids = [...page('index.html').matchAll(/<section[^>]*id="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(ids, ['loop', 'documents', 'record', 'faq', 'start']);
});

test('Sections of the landing page: Problem of each step', () => {
  for (const lang of ['en', 'de']) {
    const steps = [...section(page(`${prefix(lang)}index.html`), 'loop').matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
    assert.equal(steps.length, 7, lang);
    for (const step of steps) {
      assert.match(step, /<h3>[^<]+<\/h3>/, `${lang}: name`);
      assert.match(step, /class="cmd"><code>[^<]+<\/code>/, `${lang}: command or artifact`);
      assert.match(step, /class="pain"><span>[^<]+<\/span> [^<]+<\/p>/, `${lang}: problem`);
    }
  }
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
  assert.deepEqual(shown, ['2026-11-06-f', '2026-11-05-e', '2026-11-04-d']);
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

// RFC 5737 documentation ranges: examples only, never a real server.
const DOCUMENTATION = /^(192\.0\.2|198\.51\.100|203\.0\.113)\./;

test('No server data in the repository: Scan of the tracked files', () => {
  const tracked = execFileSync('git', ['ls-files', 'website', '.github/workflows'], { cwd: ROOT, encoding: 'utf8' })
    .split('\n').filter((f) => f && !/\.(woff2|png)$/.test(f));
  assert.ok(tracked.length > 10, `${tracked.length} files`);
  for (const file of tracked) {
    const text = readFileSync(join(ROOT, file), 'utf8');
    const addresses = (text.match(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g) ?? []).filter((ip) => !DOCUMENTATION.test(ip));
    assert.deepEqual(addresses, [], file);
    assert.doesNotMatch(text, /PRIVATE KEY/, file);
  }
});

test('No server data in the repository: Generated Kamal configuration is not committed', () => {
  assert.match(readFileSync(join(ROOT, '.gitignore'), 'utf8'), /^website\/apphost\/out\/$/m);
});

test('Build: a missing language file stops the build', () => {
  const root = fixture();
  rmSync(join(root, 'website/i18n/de.json'));
  assert.throws(() => build({ root, out: temp() }), /de\.json/);
});

test('Build: a page without texts stops the build with its name', () => {
  const root = fixture();
  writeFileSync(join(root, 'website/pages/extra.html'), '<!-- content -->\n<main id="main"></main>\n');
  assert.throws(() => build({ root, out: temp() }), /no texts for page "extra" in en\.json/);
});

test('Build: a page without the content marker stops the build', () => {
  const root = fixture();
  writeFileSync(join(root, 'website/pages/imprint.html'), '<main id="main"></main>\n');
  assert.throws(() => build({ root, out: temp() }), /imprint\.html has no "<!-- content -->" line/);
});

test('Build: a page with CRLF line ends', () => {
  const root = fixture();
  const file = join(root, 'website/pages/imprint.html');
  writeFileSync(file, readFileSync(file, 'utf8').replace(/\n/g, '\r\n'));
  const html = page('imprint.html', buildRepo(root));
  assert.match(main(html), /HRB 110062/);
  assert.doesNotMatch(header(html), /<main/);
});

test('Build: a changelog without a release stops the build', () => {
  assert.throws(() => buildRepo(fixture({ releases: [] })), /CHANGELOG\.md has no release/);
});

test('Build: a text with braces is not a placeholder', () => {
  assert.equal(render('{{#items}}<b>{{.text}}</b>{{/items}}', { items: [{ text: 'use {{name}}' }] }), '<b>use {{name}}</b>');
});

// The deploy rules live in the workflow files: the triggers, the job conditions and the call from the release.
const workflow = (name) => readFileSync(join(ROOT, '.github/workflows', name), 'utf8');
const job = (yml, name) => yml.match(new RegExp(`\\n  ${name}:(\\n[\\s\\S]*?)(?=\\n  [\\w-]+:\\n|$)`))?.[1] ?? '';
const deployCondition = () => job(workflow('website.yml'), 'deploy').match(/\n    if: (.+)/)?.[1] ?? '';

test('Build and deployment: Deploy after a change', () => {
  const yml = workflow('website.yml');
  assert.match(yml, /\non:\n  push:\n    branches: \[main\]\n    paths: &paths/, 'tests on push to main');
  assert.match(yml, /\n  pull_request:\n    paths: \*paths/, 'tests on pull requests');
  assert.match(job(yml, 'deploy'), /\n    needs: test\n/);
  // A push to main has the ref refs/heads/main and a pull request the event pull_request: neither matches.
  assert.equal(deployCondition(), "github.event_name == 'workflow_dispatch' || startsWith(github.ref, 'refs/tags/v')");
  assert.doesNotMatch(yml, /\n  push:\n(    .*\n)*    tags:/, 'a tag push does not start website.yml directly');
});

test('Build and deployment: Deploy after a release', () => {
  assert.match(workflow('website.yml'), /\n  workflow_call:\n/);
  const caller = job(workflow('publish.yml'), 'website');
  assert.match(caller, /\n    needs: publish\n/);
  assert.match(caller, /\n    uses: \.\/\.github\/workflows\/website\.yml\n/);
  assert.match(caller, /\n    secrets: inherit\n/);
  assert.match(caller, /\n      packages: write\n/);
  assert.match(deployCondition(), /startsWith\(github\.ref, 'refs\/tags\/v'\)/, 'the called workflow deploys for the release tag of the caller');
});

test('Build and deployment: Failed release verification', () => {
  const publish = job(workflow('publish.yml'), 'publish');
  const verify = publish.indexOf('Verify the release');
  const create = publish.indexOf('Create the GitHub release');
  assert.ok(verify > 0 && create > verify, 'the release is verified before it is created');
  const caller = job(workflow('publish.yml'), 'website');
  assert.match(caller, /\n    needs: publish\n/, 'the deploy waits for the verified release');
  assert.doesNotMatch(caller, /always\(\)|failure\(\)|cancelled\(\)/, 'no status function lets the deploy run after a failure');
  assert.match(caller, /\n    if: \$\{\{ github\.actor != 'nektos\/act' && !github\.event\.act \}\}\n/, 'no deploy under act');
});

test('Build and deployment: Manual start', () => {
  assert.match(workflow('website.yml'), /\n  workflow_dispatch:\n/);
  assert.match(deployCondition(), /^github\.event_name == 'workflow_dispatch' \|\| /);
});
