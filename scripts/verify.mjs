#!/usr/bin/env node
// sparc verify: verifies each complete OpenSpec change without an LLM.
// Usage:
//   node verify.mjs [dir]             print findings, exit 1 if there are findings
import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { isSparcProject, listChanges, read } from './check.mjs';

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

function main(args) {
  const dir = args.find((a) => !a.startsWith('--')) ?? process.cwd();
  const findings = completeChanges(dir).flatMap((id) => verifyChange(dir, id).findings.map((f) => `- ${id}: ${f}`));
  console.log(findings.length ? `sparc verify: ${findings.length} finding(s)\n${findings.join('\n')}` : 'sparc verify: no findings');
  process.exitCode = findings.length ? 1 : 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
