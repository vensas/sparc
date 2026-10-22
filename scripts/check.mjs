#!/usr/bin/env node
// sparc check: finds document drift in a sparc project without an LLM.
// Usage:
//   node check.mjs [dir]              print findings, exit 1 if there are findings
//   node check.mjs --json [dir]       print findings as JSON
//   node check.mjs --lock <adr-file>  write the body hash into the ADR front matter
//   node check.mjs --hook             Claude Code hook mode: read the event from stdin, warn, never block
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const MARKER = '# sparc';
const PLACEHOLDER = 'TODO(sparc)';
const MAX_WORDS = 25;
const ADR_DIR = 'docs/adr';
const DOCS = {
  readme: 'README.md',
  agents: 'AGENTS.md',
  backlog: 'docs/backlog.md',
  c4: 'docs/architecture/c4.md',
  canvas: 'docs/architecture/canvas.md',
  openspec: 'openspec/config.yaml',
};
const README_SECTIONS = ['Overview', 'Key Features', 'Architecture', 'Get Started'];
const CANVAS_SECTIONS = [
  'Value Proposition', 'Core Functions', 'Key Stakeholder', 'Quality Requirements', 'Business Context',
  'Core Decisions', 'Technologies', 'Components / Modules', 'Core Risks and Missing Information',
];
const APPROVER = /^Approved by: *\[@([\w-]+)\]\(https:\/\/github\.com\/\1\)/m;
const STATUS = /^(proposed|accepted|rejected|deprecated|amended|superseded by ADR-(\d{4}))$/;

const read = (dir, rel) => (existsSync(join(dir, rel)) ? readFileSync(join(dir, rel), 'utf8') : null);
const h2 = (md) => [...md.matchAll(/^## +(.+?)\s*$/gm)].map((m) => m[1]);
const hasSection = (md, title) => h2(md).some((h) => h.startsWith(title));
const section = (md, title) => {
  const start = md.search(new RegExp(`^## +${title}.*$`, 'm'));
  if (start < 0) return null;
  const rest = md.slice(start).replace(/^.*\n?/, '');
  const end = rest.search(/^## /m);
  return end < 0 ? rest : rest.slice(0, end);
};

export function isSparcProject(dir) {
  return (read(dir, DOCS.openspec) ?? '').includes(MARKER);
}

export function parseFrontMatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: md, raw: '' };
  const data = Object.fromEntries(
    m[1].split('\n').map((l) => l.match(/^([\w-]+):\s*(.*)$/)).filter(Boolean)
      .map(([, k, v]) => [k, v.replace(/^["']|["']$/g, '').trim()]),
  );
  return { data, body: md.slice(m[0].length), raw: m[0] };
}

export function adrHash(md) {
  const body = parseFrontMatter(md).body.split(/^## +Amendments\s*$/m)[0];
  const normal = body.split('\n').map((l) => l.trimEnd()).join('\n').trim();
  return createHash('sha256').update(normal).digest('hex').slice(0, 16);
}

export function lockAdr(file) {
  const md = readFileSync(file, 'utf8');
  const { raw } = parseFrontMatter(md);
  if (!raw) throw new Error(`${file}: no front matter`);
  const lock = `locked: ${adrHash(md)}`;
  const front = /^locked:.*$/m.test(raw) ? raw.replace(/^locked:.*$/m, lock) : raw.replace(/\n---\n?$/, `\n${lock}\n---\n`);
  writeFileSync(file, front + md.slice(raw.length));
  return lock;
}

function checkRequired(dir, add) {
  for (const rel of Object.values(DOCS)) if (!read(dir, rel)) add(rel, 'file is missing');
  if (!existsSync(join(dir, ADR_DIR))) add(ADR_DIR, 'folder is missing');
}

function checkReadme(md, add) {
  const intro = md.split(/^## /m)[0].replace(/^# .*$/m, '').trim();
  if (!intro) add(DOCS.readme, 'introduction before the first section is empty');
  for (const s of README_SECTIONS) if (!hasSection(md, s)) add(DOCS.readme, `section "## ${s}" is missing`);
}

function checkC4(md, add) {
  if (!/```mermaid\s+C4Context\b/.test(md)) add(DOCS.c4, 'Mermaid C4Context diagram is missing');
  if (!/```mermaid\s+C4Container\b/.test(md)) add(DOCS.c4, 'Mermaid C4Container diagram is missing');
}

function checkCanvas(md, add) {
  for (const s of CANVAS_SECTIONS) if (!hasSection(md, s)) add(DOCS.canvas, `section "## ${s}" is missing`);
}

function listChanges(dir) {
  const root = join(dir, 'openspec/changes');
  const dirs = (p) => (existsSync(p) ? readdirSync(p, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : []);
  return {
    active: dirs(root).filter((n) => n !== 'archive'),
    archived: dirs(join(root, 'archive')).map((n) => n.replace(/^\d{4}-\d{2}-\d{2}-/, '')),
  };
}

function checkBacklog(dir, md, add) {
  if (!section(md, 'Goal')?.trim()) add(DOCS.backlog, 'section "## Goal" is missing or empty');
  const items = [...(section(md, 'Items') ?? '').matchAll(/^- \[([ xX])\] .*?(?:\(change: ([\w-]+)\))?\s*$/gm)]
    .map(([, box, change]) => ({ done: box !== ' ', change }));
  if (!items.length) add(DOCS.backlog, 'section "## Items" has no checkbox items');
  const { active, archived } = listChanges(dir);
  const linked = new Set(items.map((i) => i.change).filter(Boolean));
  for (const { done, change } of items.filter((i) => i.change)) {
    if (archived.includes(change) && !done) add(DOCS.backlog, `change "${change}" is archived but its item is not checked`);
    else if (done && !archived.includes(change)) add(DOCS.backlog, `item for change "${change}" is checked but the change is not archived`);
    else if (!active.includes(change) && !archived.includes(change)) add(DOCS.backlog, `change "${change}" does not exist in openspec/changes`);
  }
  for (const c of [...active, ...archived]) if (!linked.has(c)) add(DOCS.backlog, `change "${c}" has no backlog item`);
}

function checkAdrs(dir, add) {
  const root = join(dir, ADR_DIR);
  if (!existsSync(root)) return [];
  const files = readdirSync(root).filter((f) => /^\d{4}-.+\.md$/.test(f) && !f.startsWith('0000-'));
  const numbers = new Set(files.map((f) => f.slice(0, 4)));
  if (numbers.size < files.length) add(ADR_DIR, 'two or more ADRs have the same number');
  for (const f of files) {
    const rel = `${ADR_DIR}/${f}`;
    const md = readFileSync(join(root, f), 'utf8');
    const { data } = parseFrontMatter(md);
    const status = STATUS.exec(data.status ?? '');
    if (!status) { add(rel, `status "${data.status ?? ''}" is not valid`); continue; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date ?? '')) add(rel, 'date is missing or not YYYY-MM-DD');
    if (status[2] && (status[2] === f.slice(0, 4) || !numbers.has(status[2]))) add(rel, `superseding ADR-${status[2]} does not exist`);
    if (status[1] === 'proposed') continue;
    if (!data.locked) add(rel, `status is "${status[1]}" but the ADR is not locked (run check.mjs --lock)`);
    else if (data.locked !== adrHash(md)) add(rel, 'body changed after the lock: amend or supersede the ADR instead');
    const amendments = section(md, 'Amendments') ?? '';
    const entries = amendments.split(/^### /m).slice(1);
    if (status[1] === 'amended' && !entries.length) add(rel, 'status is "amended" but "## Amendments" has no entry');
    if (entries.some((e) => !APPROVER.test(e))) add(rel, 'an amendment has no "Approved by: [@handle](https://github.com/handle)" line');
  }
  return files.map((f) => `${ADR_DIR}/${f}`);
}

function checkPlaceholders(dir, files, add) {
  for (const rel of files) {
    const n = (read(dir, rel) ?? '').split(PLACEHOLDER).length - 1;
    if (n) add(rel, `${n} placeholder(s) "${PLACEHOLDER}" left`);
  }
}

export function longSentences(md, max = MAX_WORDS) {
  const text = md.replace(/```[\s\S]*?```/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/\]\([^)]*\)/g, ']');
  const units = text.split('\n')
    .filter((l) => !/^\s*(#|\||---)/.test(l))
    .join('\n')
    .split(/\n\s*\n|\n(?=\s*(?:[-*]|\d+\.) )/);
  return units.flatMap((u) => u.replace(/\s+/g, ' ').split(/(?<=[.!?:])\s+/))
    .map((s) => s.trim())
    .filter((s) => s.split(' ').filter((w) => /\w/.test(w)).length > max);
}

function checkSentences(dir, files, add) {
  for (const rel of files) {
    const long = longSentences(read(dir, rel) ?? '');
    if (long.length) add(rel, `${long.length} sentence(s) with more than ${MAX_WORDS} words (STE), first: "${long[0].slice(0, 60)}..."`);
  }
}

function checkUntouchedDocs(dir, add) {
  let status;
  try {
    status = execFileSync('git', ['status', '--porcelain'], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return;
  }
  const paths = status.split('\n').filter(Boolean).map((l) => l.slice(3).split(' -> ').pop());
  const isDoc = (p) => Object.values(DOCS).includes(p) || p.startsWith('docs/') || p.startsWith('openspec/');
  const code = paths.filter((p) => !isDoc(p));
  if (code.length && !paths.some(isDoc)) {
    add('(git)', `${code.length} file(s) changed but no document changed: run /sparc:sync or confirm there is no document impact`);
  }
}

export function check(dir) {
  const findings = [];
  const add = (file, message) => findings.push({ file, message });
  checkRequired(dir, add);
  const md = (key) => read(dir, DOCS[key]);
  if (md('readme')) checkReadme(md('readme'), add);
  if (md('c4')) checkC4(md('c4'), add);
  if (md('canvas')) checkCanvas(md('canvas'), add);
  if (md('backlog')) checkBacklog(dir, md('backlog'), add);
  const adrs = checkAdrs(dir, add);
  const prose = [DOCS.readme, DOCS.agents, DOCS.backlog, DOCS.c4, DOCS.canvas, ...adrs];
  checkPlaceholders(dir, prose, add);
  checkSentences(dir, prose.filter((f) => f !== DOCS.c4), add);
  checkUntouchedDocs(dir, add);
  return findings;
}

const format = (findings) => findings.map((f) => `- ${f.file}: ${f.message}`).join('\n');

// Returns true if these findings differ from the last warning for this project. Repeated warnings only add noise.
function isNewWarning(dir, findings) {
  const state = process.env.CLAUDE_PLUGIN_DATA ?? tmpdir();
  const file = join(state, `sparc-last-${createHash('sha256').update(dir).digest('hex').slice(0, 16)}`);
  const digest = createHash('sha256').update(format(findings)).digest('hex');
  if (existsSync(file) && readFileSync(file, 'utf8') === digest) return false;
  mkdirSync(state, { recursive: true });
  writeFileSync(file, digest);
  return true;
}

function hook() {
  const event = JSON.parse(readFileSync(0, 'utf8') || '{}');
  const dir = event.cwd ?? process.cwd();
  if (event.stop_hook_active || !isSparcProject(dir)) return;
  const findings = check(dir);
  if (!findings.length || !isNewWarning(dir, findings)) return;
  process.stdout.write(JSON.stringify({
    systemMessage: `sparc: ${findings.length} document finding(s). Run /sparc:sync to fix them.`,
    hookSpecificOutput: {
      hookEventName: event.hook_event_name ?? 'Stop',
      additionalContext: `sparc check found document drift. If the drift is expected because work is not complete, say so in one line. Else fix it with the sparc sync skill.\n${format(findings)}`,
    },
  }));
}

function main(args) {
  if (args[0] === '--hook') return hook();
  if (args[0] === '--lock') return console.log(`${basename(args[1])}: ${lockAdr(args[1])}`);
  const json = args[0] === '--json';
  const findings = check(args.find((a) => !a.startsWith('--')) ?? process.cwd());
  console.log(json ? JSON.stringify(findings, null, 2) : findings.length ? `sparc check: ${findings.length} finding(s)\n${format(findings)}` : 'sparc check: no findings');
  process.exitCode = findings.length ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
