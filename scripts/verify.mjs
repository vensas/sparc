#!/usr/bin/env node
// sparc verify: verifies each complete OpenSpec change without an LLM.
// Usage:
//   node verify.mjs [dir]             print findings, exit 1 if there are findings
import { readdirSync, existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { isSparcProject, listChanges, read, section } from './check.mjs';

const COMMANDS = ['Lint', 'Test', 'Verify'];
const COMMAND_TIME_LIMIT_MS = 300_000;
const OUTPUT_LINES = 20;

// OpenSpec counts a box with only "x" (any case, any spaces) as checked.
const TASK = /^\s*- \[([^\]]*)\] *(.+)$/gm;
const isChecked = (box) => /^\s*[xX]\s*$/.test(box);

const tasksOf = (dir, id) => [...(read(dir, `openspec/changes/${id}/tasks.md`) ?? '').matchAll(TASK)]
  .map(([, box, text]) => ({ done: isChecked(box), text: text.trim() }));

export function completeChanges(dir) {
  if (!isSparcProject(dir)) return [];
  return listChanges(dir).active.filter((id) => {
    const tasks = tasksOf(dir, id);
    return tasks.length > 0 && tasks.every((t) => t.done);
  });
}

function specFiles(dir, id) {
  const root = join(dir, 'openspec/changes', id, 'specs');
  if (!existsSync(root)) return [];
  return readdirSync(root, { recursive: true }).filter((f) => f.endsWith('spec.md')).map((f) => join('openspec/changes', id, 'specs', f));
}

// Returns "<requirement>: <scenario>" for each scenario of the added and modified requirements.
function scenarios(md) {
  const names = [];
  let counts = false;
  let requirement = null;
  for (const line of md.split('\n')) {
    const h2 = line.match(/^## +(.+?)\s*$/);
    if (h2) counts = /^(ADDED|MODIFIED) Requirements$/.test(h2[1]);
    const req = line.match(/^### +Requirement: *(.+?)\s*$/);
    if (req) requirement = req[1];
    const scn = line.match(/^#### +Scenario: *(.+?)\s*$/);
    if (scn && counts && requirement) names.push(`${requirement}: ${scn[1]}`);
  }
  return names;
}

function qaRows(md) {
  const rows = new Map();
  for (const line of (md ?? '').split('\n')) {
    const cells = line.match(/^\|(.+)\|\s*$/)?.[1].split('|').map((c) => c.trim());
    if (cells?.length >= 3) rows.set(cells[0], { result: cells[1].toLowerCase(), evidence: cells[2] });
  }
  return rows;
}

export function verifyChange(dir, id) {
  const findings = [];
  const manual = [];
  const rows = qaRows(read(dir, `openspec/changes/${id}/qa.md`));
  for (const name of specFiles(dir, id).flatMap((f) => scenarios(read(dir, f)))) {
    const row = rows.get(name);
    if (!row) findings.push(`scenario "${name}" has no row in qa.md`);
    else if (row.result === 'manual') manual.push(name);
    else if (row.result !== 'passed') findings.push(`scenario "${name}" ${row.result || 'has no result'} in qa.md`);
    else if (!row.evidence) findings.push(`scenario "${name}" has no evidence in qa.md`);
  }
  for (const task of tasksOf(dir, id)) if (!/Verify:/.test(task.text)) findings.push(`task "${task.text}" has no "Verify:"`);
  return { findings, manual };
}

// Returns the Lint, Test and Verify rows of the commands table in AGENTS.md, in this order.
export function projectCommands(dir) {
  const rows = new Map();
  for (const line of (section(read(dir, 'AGENTS.md') ?? '', 'Commands') ?? '').split('\n')) {
    const [name, command] = line.match(/^\|(.+)\|\s*$/)?.[1].split('|').map((c) => c.trim()) ?? [];
    const known = COMMANDS.find((n) => n.toLowerCase() === name?.toLowerCase());
    const code = command?.match(/`([^`]+)`/)?.[1];
    if (known && code && !rows.has(known)) rows.set(known, code);
  }
  return COMMANDS.filter((n) => rows.has(n)).map((name) => ({ name, command: rows.get(name) }));
}

// Runs a command through the shell in its own process group, so that a time-out also stops its child processes.
function run(dir, command, timeLimitMs) {
  return new Promise((resolve) => {
    const child = spawn(command, { cwd: dir, shell: true, detached: true });
    let output = '';
    child.stdout.on('data', (d) => { output += d; });
    child.stderr.on('data', (d) => { output += d; });
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      try { process.kill(-child.pid, 'SIGKILL'); } catch { /* the group has already stopped */ }
    }, timeLimitMs);
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, timedOut, output });
    });
  });
}

const lastLines = (text) => text.trimEnd().split('\n').slice(-OUTPUT_LINES).join('\n');

export async function runCommands(dir, commands, timeLimitMs = COMMAND_TIME_LIMIT_MS) {
  const findings = [];
  for (const { name, command } of commands) {
    const { code, timedOut, output } = await run(dir, command, timeLimitMs);
    const label = `command "${name}" (\`${command}\`)`;
    if (timedOut) findings.push(`${label} ran longer than ${timeLimitMs / 1000} s and was stopped`);
    else if (code !== 0) findings.push(`${label} exited with ${code}. Last lines of its output:\n${lastLines(output)}`);
  }
  return findings;
}

const stateFile = (dir, key) => join(process.env.CLAUDE_PLUGIN_DATA ?? tmpdir(),
  `sparc-verify-${createHash('sha256').update(`${dir}\0${key}`).digest('hex').slice(0, 16)}`);

// Returns the warning for a project without commands, one time for each project.
export function commandsWarning(dir) {
  if (projectCommands(dir).length) return null;
  const file = stateFile(dir, 'no-commands');
  if (existsSync(file)) return null;
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, '');
  return `sparc verify: AGENTS.md names no Lint, Test or Verify command. Add them to the commands table, so that the verifier runs them when a change is complete.`;
}

function main(args) {
  const dir = args.find((a) => !a.startsWith('--')) ?? process.cwd();
  const findings = completeChanges(dir).flatMap((id) => verifyChange(dir, id).findings.map((f) => `- ${id}: ${f}`));
  console.log(findings.length ? `sparc verify: ${findings.length} finding(s)\n${findings.join('\n')}` : 'sparc verify: no findings');
  process.exitCode = findings.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
