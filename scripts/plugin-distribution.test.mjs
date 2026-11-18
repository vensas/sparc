import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const read = (rel) => readFileSync(join(ROOT, rel), 'utf8');

test('Validation on each push and pull request: workflow runs the tests, the check and the plugin validation', () => {
  const yml = read('.github/workflows/validate.yml');
  assert.match(yml, /push:\n\s+branches: \[main\]/);
  assert.match(yml, /pull_request:/);
  assert.match(yml, /workflow_call:/);
  assert.match(yml, /fetch-depth: 0/);
  for (const step of ["node --test 'scripts/*.test.mjs'", 'node scripts/check.mjs', 'claude plugin validate .']) {
    assert.ok(yml.includes(`run: ${step}`), step);
  }
});

test('Publication of a release tag: workflow validates, verifies and then creates the release', () => {
  const yml = read('.github/workflows/publish.yml');
  assert.match(yml, /tags: \['v\*\.\*\.\*'\]/);
  assert.match(yml, /uses: \.\/\.github\/workflows\/validate\.yml/);
  assert.match(yml, /needs: validate/);
  assert.match(yml, /contents: write/);
  const verify = yml.indexOf('node scripts/verify-release.mjs');
  const release = yml.indexOf('gh release create');
  assert.ok(verify > 0 && release > verify, 'verification runs before the release');
  assert.match(yml, /--notes-file/);
});

test('Install instructions: Read the install section', () => {
  const readme = read('README.md');
  for (const text of [
    'claude plugin marketplace add vensas/sparc',
    'claude plugin install sparc@sparc',
    'claude plugin list',
    '**Code** tab',
    'Add from repo',
    'https://github.com/vensas/sparc.git',
    'claude plugin marketplace update sparc',
    'claude plugin update sparc@sparc',
    'claude --plugin-dir',
    'copilot plugin marketplace add vensas/sparc',
    'copilot plugin install sparc@sparc',
    'copilot plugin list',
    'copilot plugin marketplace update sparc',
    'copilot plugin update sparc',
    'copilot --plugin-dir',
  ]) assert.ok(readme.includes(text), text);
});

test('Release commit and tag are pushed together: AGENTS.md tells the atomic push', () => {
  const agents = read('AGENTS.md');
  const rule = agents.indexOf('git push --atomic origin main v<version>');
  assert.ok(rule > 0);
  assert.ok(rule > agents.indexOf('<!-- sparc:end -->'), 'the rule is outside the sparc markers');
});

const SKILLS = readdirSync(join(ROOT, 'skills'));
const skillText = (name) => read(`skills/${name}/SKILL.md`);
const ROOT_NOTE = /Paths that start with `\.\.\/\.\.\/` lead from the folder of this file to the root of the sparc plugin\. Make them absolute before you use them in a command\./;

test('Skills work in each supported agent: Skill text without a plugin variable', () => {
  assert.ok(SKILLS.length > 0);
  for (const name of SKILLS) {
    const text = skillText(name);
    assert.doesNotMatch(text, /CLAUDE_PLUGIN_ROOT/, name);
    const paths = [...text.matchAll(/\.\.\/\.\.\/[\w./-]*/g)].map((m) => m[0].replace(/[.]+$/, ''));
    if (paths.length) assert.match(text, ROOT_NOTE, `${name}: note about the plugin root`);
    for (const path of paths.filter((p) => p !== '../../')) {
      assert.ok(existsSync(join(ROOT, 'skills', name, path)), `${name}: ${path}`);
    }
  }
});

test('Skills work in each supported agent: Agent does not replace the arguments', () => {
  for (const name of SKILLS) {
    const text = skillText(name);
    if (!text.includes('$ARGUMENTS')) continue;
    assert.equal(text.split('$ARGUMENTS').length - 1, 1, `${name}: $ARGUMENTS only one time`);
    const lines = text.split('\n');
    const at = lines.findIndex((line) => line.includes('$ARGUMENTS'));
    assert.equal(lines[at + 1], '', `${name}: an empty line after the input`);
    assert.equal(lines[at + 2], 'If the input in the line above is a placeholder that starts with a dollar sign, use the request that the user gave with the skill.', `${name}: the sentence follows the input line`);
  }
});

const readmeSection = (name) => read('README.md').split(/^## /m).find((part) => part.startsWith(`${name}\n`)) ?? '';

test('Supported agents: Read the supported agents', () => {
  const section = readmeSection('Supported Agents');
  for (const text of ['Claude Code', 'GitHub Copilot CLI', '/sparc:propose', 'VS Code', 'cloud agent', 'not tested', 'check.mjs', 'Allow path access']) {
    assert.ok(section.includes(text), text);
  }
});

test('Description for coding agents: Manifest description', () => {
  const { description } = JSON.parse(read('.claude-plugin/plugin.json'));
  assert.match(description, /coding agents/);
  assert.doesNotMatch(description, /Claude Code plugin/);
  const first = read('README.md').split('\n').find((line) => /^sparc is /.test(line));
  assert.match(first, /coding agents/);
  const agents = ['Claude Code', 'GitHub Copilot'].filter((agent) => first.includes(agent));
  assert.ok(agents.length !== 1, `the first sentence names only ${agents[0]}`);
});
