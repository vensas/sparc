// Builds the website from website/ into one output folder. No dependencies.
// Usage: node scripts/build-website.mjs [output folder, default _site]
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ORIGIN = 'https://sparc.apps.vensas.de';
const RECENT = 3;
// The pages that each page links to: home, and the legal pages in the footer.
const LINKED = ['index', 'imprint', 'privacy'];

// Reads the record of sparc from the files of the repository.
export function record(root) {
  const plugin = JSON.parse(readFileSync(join(root, '.claude-plugin/plugin.json'), 'utf8'));
  const adrs = readdirSync(join(root, 'docs/adr')).filter((f) => /^\d{4}-.+\.md$/.test(f) && !f.startsWith('0000-'));
  const archiveDir = join(root, 'openspec/changes/archive');
  const archived = existsSync(archiveDir)
    ? readdirSync(archiveDir, { withFileTypes: true }).filter((e) => e.isDirectory() && /^\d{4}-\d{2}-\d{2}-/.test(e.name)).map((e) => e.name).sort().reverse()
    : [];
  const releases = [...readFileSync(join(root, 'CHANGELOG.md'), 'utf8').matchAll(/^## \[(\d+\.\d+\.\d+)\]/gm)].map((m) => m[1]);
  if (releases.length === 0) throw new Error('CHANGELOG.md has no release');
  return {
    version: plugin.version,
    repository: plugin.repository,
    adrs: adrs.length,
    archived: archived.length,
    releases: releases.length,
    latest: releases[0],
    recent: archived.slice(0, RECENT).map((name) => ({ name, date: name.slice(0, 10), id: name.slice(11) })),
  };
}

const lookup = (ctx, path) => path.split('.').reduce((value, key) => value?.[key], ctx);

// Replaces {{path}} with its value. A missing value stops the build. {{.field}} is left for the list.
const fill = (template, ctx) => template.replace(/\{\{(\w[\w.]*)\}\}/g, (_, path) => {
  const value = lookup(ctx, path);
  if (value === undefined || typeof value === 'object') throw new Error(`no text for "{{${path}}}"`);
  return value;
});

// Replaces {{#list}}...{{/list}} with one copy for each item, and {{path}} with its value.
// In a list, {{.field}} is a value of the item. Values are put in last, so a text with braces stays text.
export function render(template, ctx) {
  const lists = [];
  const marked = template.replace(/\{\{#([\w.]+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, path, inner) => {
    const list = lookup(ctx, path);
    if (!Array.isArray(list)) throw new Error(`"${path}" is not a list`);
    const copy = fill(inner, ctx);
    lists.push(list.map((item) => copy.replace(/\{\{\.(\w+)\}\}/g, (__, key) => {
      if (item[key] === undefined) throw new Error(`"${path}" has an item without "${key}"`);
      return item[key];
    })).join(''));
    return `\u0000${lists.length - 1}\u0000`;
  });
  return fill(marked, ctx).replace(/\u0000(\d+)\u0000/g, (_, n) => lists[n]);
}

// The path of a page in a language. English is at the root.
const href = (lang, page) => `/${lang === 'en' ? '' : `${lang}/`}${page === 'index' ? '' : `${page}.html`}`;

export function build({ root = ROOT, out = join(ROOT, '_site') } = {}) {
  const site = join(root, 'website');
  const data = record(root);
  const layout = readFileSync(join(site, 'layout.html'), 'utf8');
  const pages = readdirSync(join(site, 'pages')).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5));
  const langs = ['en', 'de'];

  rmSync(out, { recursive: true, force: true });
  mkdirSync(out, { recursive: true });
  cpSync(join(site, 'assets'), join(out, 'assets'), { recursive: true });
  cpSync(join(root, 'docs/assets/icon.svg'), join(out, 'assets/icon.svg'));

  for (const lang of langs) {
    const file = join(site, 'i18n', `${lang}.json`);
    if (!existsSync(file)) throw new Error(`website/i18n/${lang}.json is missing`);
    const t = JSON.parse(readFileSync(file, 'utf8'));
    for (const page of pages) {
      // The part before the line <!-- content --> goes into the header, the rest after it.
      const parts = readFileSync(join(site, 'pages', `${page}.html`), 'utf8').split(/<!-- content -->\r?\n/);
      if (parts.length !== 2) throw new Error(`website/pages/${page}.html has no "<!-- content -->" line`);
      if (!t[page]) throw new Error(`no texts for page "${page}" in ${lang}.json`);
      const [head, body] = parts;
      const ctx = {
        t, lang, page, record: data, origin: ORIGIN,
        title: t[page].title,
        german: href('de', page),
        sections: page === 'index' ? t.nav.sections : [],
        // The German legal texts are binding. The other languages link to them.
        binding: lang === 'de' ? [] : [{}],
        languages: langs.map((code) => ({
          code, name: t.languages[code], short: code.toUpperCase(),
          href: href(code, page), url: `${ORIGIN}${href(code, page)}`,
          current: code === lang ? ' aria-current="true"' : '',
        })),
        links: Object.fromEntries(LINKED.map((p) => [p, href(lang, p)])),
      };
      const html = render(layout, { ...ctx, header: render(head, ctx), content: render(body, ctx) });
      const target = join(out, lang === 'en' ? '' : lang, `${page}.html`);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, html);
    }
  }
  return out;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const out = build({ out: resolve(process.argv[2] ?? join(ROOT, '_site')) });
  console.log(`website: built ${out}`);
}
