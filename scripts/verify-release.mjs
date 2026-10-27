#!/usr/bin/env node
// sparc release verification: the tag, the manifest, the marketplace entry and the changelog must name the same release.
// Usage:
//   node verify-release.mjs <tag> [notes-file]   exit 1 with each difference, else write the release notes
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const TAG = /^v(\d+\.\d+\.\d+)$/;
const RELEASE = /^## \[(\d+\.\d+\.\d+)\][^\n]*\n([\s\S]*?)(?=^## |(?![\s\S]))/m;

const readJson = (dir, rel) => JSON.parse(readFileSync(join(dir, rel), 'utf8'));

export function verifyRelease(dir, tag) {
  const m = TAG.exec(tag);
  if (!m) return { problems: [`tag "${tag}" is not "vX.Y.Z"`], notes: '' };
  const problems = [];
  const { version } = readJson(dir, '.claude-plugin/plugin.json');
  if (version !== m[1]) problems.push(`plugin.json version ${version} is not equal to the tag ${tag}`);
  const { plugins = [] } = readJson(dir, '.claude-plugin/marketplace.json');
  const source = plugins.find((p) => p.name === 'sparc')?.source;
  if (source?.source !== 'github') problems.push('the marketplace entry "sparc" is not a github source');
  else if (source.ref !== tag) problems.push(`marketplace ref ${source.ref} is not equal to the tag ${tag}`);
  const release = RELEASE.exec(readFileSync(join(dir, 'CHANGELOG.md'), 'utf8'));
  if (release?.[1] !== m[1]) problems.push(`changelog release ${release?.[1] ?? '(none)'} is not equal to the tag ${tag}`);
  return { problems, notes: release?.[2].trim() ?? '' };
}

function main([tag, notesFile]) {
  const { problems, notes } = verifyRelease(process.cwd(), tag ?? '');
  if (problems.length) {
    console.error(`release ${tag}: ${problems.length} problem(s)\n${problems.map((p) => `- ${p}`).join('\n')}`);
    process.exitCode = 1;
    return;
  }
  if (notesFile) writeFileSync(notesFile, `${notes}\n`);
  console.log(`release ${tag}: tag, plugin.json, marketplace and changelog are equal`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main(process.argv.slice(2));
