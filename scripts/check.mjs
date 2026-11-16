#!/usr/bin/env node
// sparc check: finds document drift in a sparc project without an LLM.
// Usage:
//   node check.mjs [dir]              print findings, exit 1 if there are findings
//   node check.mjs --json [dir]       print findings as JSON
//   node check.mjs --hook             Claude Code hook mode: read the event from stdin, warn, never block
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync, realpathSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export const MARKER = '# sparc';
const PLUGIN_ROOT = new URL('..', import.meta.url).pathname;
const PLACEHOLDER = 'TODO(sparc)';
const MAX_WORDS = 25;
const ADR_DIR = 'docs/adr';
const DOCS = {
  readme: 'README.md',
  agents: 'AGENTS.md',
  backlog: 'docs/backlog.md',
  c4: 'docs/architecture/c4.md',
  canvas: 'docs/architecture/canvas.md',
  changelog: 'CHANGELOG.md',
  openspec: 'openspec/config.yaml',
};
const README_SECTIONS = ['Overview', 'Key Features', 'Architecture', 'Get Started'];
const CANVAS_SECTIONS = [
  'Value Proposition', 'Core Functions', 'Key Stakeholder', 'Quality Requirements', 'Business Context',
  'Core Decisions', 'Technologies', 'Components / Modules', 'Core Risks and Missing Information',
];
const CHANGE_TYPES = ['Added', 'Changed', 'Deprecated', 'Removed', 'Fixed', 'Security'];
const SEMVER = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[\da-zA-Z.-]+)?(?:\+[\da-zA-Z.-]+)?$/;
const RELEASE = /^\[(.+?)\] - \d{4}-\d{2}-\d{2}( \[YANKED\])?$/;
const CONVENTIONAL = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([\w./-]+\))?!?: \S/;
const MANIFESTS = ['package.json', '.claude-plugin/plugin.json'];
const APPROVER = /^Approved by: *\[@([\w-]+)\]\(https:\/\/github\.com\/\1\)/m;
const MADR_FIELDS = ['status', 'date', 'decision-makers', 'consulted', 'informed'];
const WORKFLOWS = ['trunk', 'pull-request'];
const PROTECTED_FIELDS = ['decision-makers', 'consulted', 'informed'];
const STATUS = /^(proposed|accepted|rejected|deprecated|amended|superseded by ADR-(\d{4}))$/;
const OLD_STATUS = /^(superseded|deprecated|rejected)/;

export const read = (dir, rel) => (existsSync(join(dir, rel)) ? readFileSync(join(dir, rel), 'utf8') : null);
const h2 = (md) => [...md.matchAll(/^## +(.+?)\s*$/gm)].map((m) => m[1]);
const hasSection = (md, title) => h2(md).some((h) => h.startsWith(title));
export const section = (md, title) => {
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

// The decided content of an ADR: the protected front matter fields and the body before "## Amendments".
export function decidedContent(md) {
  const { data, body } = parseFrontMatter(md);
  const fields = PROTECTED_FIELDS.map((k) => `${k}: ${data[k] ?? ''}`);
  const text = body.split(/^## +Amendments\s*$/m)[0].split('\n').map((l) => l.trimEnd());
  return [...fields, ...text].join('\n').trim();
}

const amendmentsOf = (md) => (md.split(/^## +Amendments\s*$/m)[1] ?? '').split('\n').map((l) => l.trimEnd()).join('\n').trim();
const isDecided = (md) => (STATUS.exec(parseFrontMatter(md).data.status ?? '')?.[1] ?? 'proposed') !== 'proposed';

// Returns the first committed version of the ADR with a decided status, or null.
function decidedVersion(dir, rel) {
  const log = git(dir, 'log', '--format=%H', '--reverse', '--', rel) ?? '';
  for (const sha of log.split('\n').filter(Boolean)) {
    const md = git(dir, 'show', `${sha}:./${rel}`);
    if (md && isDecided(md)) return md;
  }
  return null;
}

// A project without the key sparc.version counts as 0.1.0, the version before the key existed.
export function projectVersion(config) {
  return config.match(/^sparc:\n\s+version:\s*["']?([^\s"']+)/m)?.[1] ?? '0.1.0';
}

// A project without the key sparc.workflow uses pull requests, as before the key existed.
export function projectWorkflow(config) {
  const block = config.match(/^sparc:\n((?:[ \t]+.*\n?)*)/m)?.[1] ?? '';
  return block.match(/^\s+workflow:\s*["']?([^\s"']+)/m)?.[1] ?? 'pull-request';
}

function checkWorkflow(workflow, add) {
  if (!WORKFLOWS.includes(workflow)) add(DOCS.openspec, `workflow "${workflow}" is not "trunk" or "pull-request"`);
}

function checkVersion(dir, config, add) {
  const installed = JSON.parse(readFileSync(join(PLUGIN_ROOT, '.claude-plugin/plugin.json'), 'utf8')).version;
  if (realpathSync(dir) === realpathSync(PLUGIN_ROOT)) return;
  const version = projectVersion(config);
  if (version !== installed) add(DOCS.openspec, `project is at sparc ${version}, sparc ${installed} is installed: run /sparc:update`);
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

export function listChanges(dir) {
  const root = join(dir, 'openspec/changes');
  const dirs = (p) => (existsSync(p) ? readdirSync(p, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name) : []);
  return {
    active: dirs(root).filter((n) => n !== 'archive'),
    archived: dirs(join(root, 'archive')).map((n) => n.replace(/^\d{4}-\d{2}-\d{2}-/, '')),
  };
}

function checkBacklog(dir, md, add) {
  if (!section(md, 'Goal')?.trim()) add(DOCS.backlog, 'section "## Goal" is missing or empty');
  const items = [...(section(md, 'Items') ?? '').matchAll(/^- \[([ xX])\] (.*?)(?:\s*\(change: ([\w-]+)\))?\s*$/gm)]
    .map(([, box, text, change]) => ({ done: box !== ' ', text, change }));
  if (!items.length) add(DOCS.backlog, 'section "## Items" has no checkbox items');
  const { active, archived } = listChanges(dir);
  for (const { done, text, change } of items) {
    if (done) add(DOCS.backlog, `item "${text}" is done. Remove it. The changelog has the done work`);
    else if (archived.includes(change)) add(DOCS.backlog, `change "${change}" is archived. Remove its item`);
    else if (change && !active.includes(change)) add(DOCS.backlog, `change "${change}" does not exist in openspec/changes`);
  }
  const linked = new Set(items.map((i) => i.change));
  for (const c of active) if (!linked.has(c)) add(DOCS.backlog, `change "${c}" has no backlog item`);
}

function checkAdrs(dir, add) {
  const root = join(dir, ADR_DIR);
  if (!existsSync(root)) return { all: [], decided: [], statuses: [] };
  const decidedFiles = [];
  const statuses = [];
  const files = readdirSync(root).filter((f) => /^\d{4}-.+\.md$/.test(f) && !f.startsWith('0000-'));
  const numbers = new Set(files.map((f) => f.slice(0, 4)));
  if (numbers.size < files.length) add(ADR_DIR, 'two or more ADRs have the same number');
  const repo = git(dir, 'rev-parse', '--is-inside-work-tree') === 'true';
  for (const f of files) {
    const rel = `${ADR_DIR}/${f}`;
    const md = readFileSync(join(root, f), 'utf8');
    const { data } = parseFrontMatter(md);
    for (const k of Object.keys(data)) if (!MADR_FIELDS.includes(k)) add(rel, `front matter field "${k}" is not a MADR field`);
    const status = STATUS.exec(data.status ?? '');
    if (!status) { add(rel, `status "${data.status ?? ''}" is not valid`); continue; }
    statuses.push({ file: f, number: f.slice(0, 4), status: status[1] });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date ?? '')) add(rel, 'date is missing or not YYYY-MM-DD');
    if (status[2] && (status[2] === f.slice(0, 4) || !numbers.has(status[2]))) add(rel, `superseding ADR-${status[2]} does not exist`);
    if (status[1] === 'proposed') { checkOptions(md, rel, add); continue; }
    decidedFiles.push(rel);
    if (repo) {
      const base = decidedVersion(dir, rel);
      if (base && decidedContent(base) !== decidedContent(md)) add(rel, 'changed after the decision: amend or supersede the ADR instead');
      const head = git(dir, 'show', `HEAD:./${rel}`);
      if (head && !amendmentsOf(md).startsWith(amendmentsOf(head))) add(rel, 'an existing amendment changed: add new entries only at the end');
    }
    const amendments = section(md, 'Amendments') ?? '';
    const entries = amendments.split(/^### /m).slice(1);
    if (status[1] === 'amended' && !entries.length) add(rel, 'status is "amended" but "## Amendments" has no entry');
    if (entries.some((e) => !APPROVER.test(e))) add(rel, 'an amendment has no "Approved by: [@handle](https://github.com/handle)" line');
  }
  if (decidedFiles.length && !repo) add(ADR_DIR, 'not a git repository: cannot protect decided ADRs');
  return { all: files.map((f) => `${ADR_DIR}/${f}`), decided: decidedFiles, statuses };
}

// A proposed ADR compares two or more real options. Each option has a good and a bad trade-off.
function checkOptions(md, rel, add) {
  const options = (section(md, 'Considered Options') ?? '').split('\n').filter((l) => l.startsWith('- ')).map((l) => l.slice(2).trim());
  if (options.length < 2) add(rel, 'needs two or more options in "## Considered Options"');
  const prosAndCons = (section(md, 'Pros and Cons of the Options') ?? '').split(/^### /m).slice(1);
  for (const option of options) {
    const tradeOffs = prosAndCons.find((s) => s.split('\n')[0].trim() === option);
    if (!tradeOffs) add(rel, `option "${option}" has no trade-offs in "## Pros and Cons of the Options"`);
    else for (const kind of ['Good', 'Bad']) {
      if (!new RegExp(`^- ${kind}, because`, 'm').test(tradeOffs)) add(rel, `option "${option}" has no ${kind.toLowerCase()} trade-off`);
    }
  }
}

// The canvas section "Core Decisions" is the index of the ADRs. Agents must see there which ADRs are not current.
function checkAdrIndex(canvas, statuses, add) {
  const lines = (section(canvas, 'Core Decisions') ?? '').split('\n');
  for (const { file, number, status } of statuses) {
    const line = lines.find((l) => l.includes(`adr/${file})`));
    if (!line) add(DOCS.canvas, `ADR-${number} has no line in "Core Decisions"`);
    else if (OLD_STATUS.test(status) && !line.includes(status)) add(DOCS.canvas, `the line of ADR-${number} in "Core Decisions" does not name its status "${status}"`);
  }
}

// The ADR list of a design: the line that starts with "ADRs:" and the list items after it.
function adrList(md) {
  const lines = md.split('\n');
  const start = lines.findIndex((l) => l.startsWith('ADRs:'));
  if (start < 0) return '';
  const list = [lines[start]];
  for (const l of lines.slice(start + 1)) {
    if (l.startsWith('- ')) list.push(l);
    else if (l.trim()) break;
  }
  return list.join('\n');
}

// An open change must not build on an old decision. Archived changes link to ADRs that were current at their time.
function checkChangeAdrs(dir, statuses, add) {
  for (const change of listChanges(dir).active) {
    const rel = `openspec/changes/${change}/design.md`;
    const list = adrList(read(dir, rel) ?? '');
    for (const { file, number, status } of statuses) {
      if (OLD_STATUS.test(status) && list.includes(`adr/${file})`)) add(rel, `the ADR list uses ADR-${number}, which is ${status}`);
    }
  }
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

// Returns the latest release version, or null if there is no release.
function checkChangelog(md, add) {
  const sections = h2(md);
  if (sections[0] !== '[Unreleased]') add(DOCS.changelog, 'section "## [Unreleased]" is missing or not the first section');
  const versions = [];
  for (const heading of sections.filter((h) => h !== '[Unreleased]')) {
    const m = RELEASE.exec(heading);
    if (!m || !SEMVER.test(m[1])) add(DOCS.changelog, `release heading "## ${heading}" is not "## [X.Y.Z] - YYYY-MM-DD"`);
    else versions.push(m[1]);
  }
  versions.forEach((v, i) => {
    if (i && compareVersions(versions[i - 1], v) <= 0) add(DOCS.changelog, `release ${v} is not lower than the release ${versions[i - 1]} above it`);
  });
  for (const [, type] of md.matchAll(/^### +(.+?)\s*$/gm)) {
    if (!CHANGE_TYPES.includes(type)) add(DOCS.changelog, `type of change "### ${type}" is not one of ${CHANGE_TYPES.join(', ')}`);
  }
  return versions[0] ?? null;
}

// Compares the numeric parts only. Pre-release versions sort as their release.
export function compareVersions(a, b) {
  const [x, y] = [a, b].map((v) => v.split(/[-+]/)[0].split('.').map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
}

function checkManifestVersion(dir, latest, add) {
  if (!latest) return;
  for (const rel of MANIFESTS) {
    let version;
    try {
      ({ version } = JSON.parse(read(dir, rel) ?? '{}'));
    } catch {
      add(rel, 'is not valid JSON');
      continue;
    }
    if (version && version !== latest) add(rel, `version ${version} is not equal to the latest changelog release ${latest}`);
  }
}

const git = (dir, ...args) => {
  try {
    return execFileSync('git', args, { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trimEnd();
  } catch {
    return null;
  }
};

function defaultBranch(dir) {
  const remote = git(dir, 'symbolic-ref', '--quiet', 'refs/remotes/origin/HEAD');
  if (remote) return { ref: remote.replace('refs/remotes/', ''), name: remote.replace('refs/remotes/origin/', '') };
  const local = ['main', 'master'].find((b) => git(dir, 'rev-parse', '--verify', '--quiet', `refs/heads/${b}`) !== null);
  return local ? { ref: local, name: local } : null;
}

function checkCommits(dir, range, add) {
  const log = git(dir, 'log', '--format=%h%x09%s', range) ?? '';
  for (const [hash, subject] of log.split('\n').filter(Boolean).map((l) => l.split('\t'))) {
    if (!CONVENTIONAL.test(subject)) add('(git)', `commit ${hash} "${subject}" does not have a Conventional Commits header`);
  }
}

function checkGit(dir, workflow, add) {
  const status = git(dir, 'status', '--porcelain');
  if (status === null) return;
  const paths = status.split('\n').filter(Boolean).map((l) => l.slice(3).split(' -> ').pop());
  const isDoc = (p) => Object.values(DOCS).includes(p) || p.startsWith('docs/') || p.startsWith('openspec/');
  const code = paths.filter((p) => !isDoc(p));
  if (code.length && !paths.some(isDoc)) {
    add('(git)', `${code.length} file(s) changed but no document changed: run /sparc:sync or confirm there is no document impact`);
  }
  const base = defaultBranch(dir);
  if (!base) return;
  if (git(dir, 'branch', '--show-current') !== base.name) return checkCommits(dir, `${base.ref}..HEAD`, add);
  if (workflow === 'trunk') {
    const tag = git(dir, 'describe', '--tags', '--abbrev=0');
    return checkCommits(dir, tag ? `${tag}..HEAD` : 'HEAD', add);
  }
  if (paths.length) add('(git)', `files changed on the default branch "${base.name}": work on a branch and merge through a pull request`);
}

export function check(dir) {
  const findings = [];
  const add = (file, message) => findings.push({ file, message });
  checkRequired(dir, add);
  const md = (key) => read(dir, DOCS[key]);
  if (md('openspec')) checkVersion(dir, md('openspec'), add);
  if (md('readme')) checkReadme(md('readme'), add);
  if (md('c4')) checkC4(md('c4'), add);
  if (md('canvas')) checkCanvas(md('canvas'), add);
  if (md('backlog')) checkBacklog(dir, md('backlog'), add);
  if (md('changelog')) checkManifestVersion(dir, checkChangelog(md('changelog'), add), add);
  const adrs = checkAdrs(dir, add);
  if (md('canvas')) checkAdrIndex(md('canvas'), adrs.statuses, add);
  checkChangeAdrs(dir, adrs.statuses, add);
  const prose = [DOCS.readme, DOCS.agents, DOCS.backlog, DOCS.c4, DOCS.canvas, DOCS.changelog, ...adrs.all];
  checkPlaceholders(dir, prose, add);
  // Decided ADRs must not change, so a sentence finding in them cannot be fixed.
  checkSentences(dir, prose.filter((f) => f !== DOCS.c4 && !adrs.decided.includes(f)), add);
  const workflow = projectWorkflow(md('openspec') ?? '');
  checkWorkflow(workflow, add);
  checkGit(dir, workflow, add);
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
  const json = args[0] === '--json';
  const findings = check(args.find((a) => !a.startsWith('--')) ?? process.cwd());
  console.log(json ? JSON.stringify(findings, null, 2) : findings.length ? `sparc check: ${findings.length} finding(s)\n${format(findings)}` : 'sparc check: no findings');
  process.exitCode = findings.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
