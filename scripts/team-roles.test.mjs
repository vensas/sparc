// QA tests for the change replace-agents-with-roles. Each test name starts with "<Requirement>: <Scenario>" of the team-roles spec.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const ROLES = ['product-owner', 'architect', 'ux-designer', 'software-engineer', 'qa-engineer'];
const skill = (name) => readFileSync(join(ROOT, 'skills', name, 'SKILL.md'), 'utf8');
const SKILLS = readdirSync(join(ROOT, 'skills'));

test('Roles as rule files: Role files exist', () => {
  for (const role of ROLES) assert.ok(existsSync(join(ROOT, 'rules/roles', `${role}.md`)), `rules/roles/${role}.md is missing`);
});

test('Roles as rule files: No custom agent types', () => {
  assert.ok(!existsSync(join(ROOT, 'agents')), 'the folder agents/ must not exist');
  assert.equal(JSON.parse(readFileSync(join(ROOT, '.claude-plugin/plugin.json'), 'utf8')).agents, undefined);
});

test('Skills follow the roles in the current session: skills name role files and no agent types', () => {
  for (const name of SKILLS) assert.doesNotMatch(skill(name), /sparc:(product-owner|architect|ux-designer|software-engineer|qa-engineer)/, `skill ${name} names an agent type`);
  for (const name of ['init', 'propose', 'apply', 'archive', 'sync', 'adr']) assert.match(skill(name), /rules\/roles\/[a-z-]+\.md/, `skill ${name} names no role file`);
});

test('Skills follow the roles in the current session: Skills do not forbid subagents', () => {
  const ban = /SHALL NOT start a subagent|without subagents|one after the other|do not (start|use) (a )?(subagent|worktree)/i;
  const rules = (dir) => readdirSync(join(ROOT, dir)).filter((f) => f.endsWith('.md')).map((f) => join(dir, f));
  const files = [...SKILLS.map((name) => join('skills', name, 'SKILL.md')), ...rules('rules'), ...rules('rules/roles')];
  for (const file of files) assert.doesNotMatch(readFileSync(join(ROOT, file), 'utf8'), ban, `${file} forbids subagents or parallel work`);
});

test('Skills follow the roles in the current session: Apply without subagents', () => {
  const [main, fresh] = skill('apply').split(/^## .*fresh-context check.*$/im);
  assert.ok(fresh, 'apply has a section for the optional fresh-context check');
  assert.doesNotMatch(main, /worktree|subagent/i, 'apply tells the agent to use subagents or worktrees outside the fresh-context check');
});

test('Code review by the software engineer: the role has a review checklist that records into qa.md', () => {
  const role = readFileSync(join(ROOT, 'rules/roles/software-engineer.md'), 'utf8');
  assert.match(role, /^## Code review$/m);
  assert.match(role, /git diff <default-branch>\.\.\.HEAD/);
  assert.match(role, /## Code review\n\nReviewed: `<first commit>\.\.<last commit>`\nContext: <fresh \| current session \(<reason>\)>/);
});

test('Code review by the software engineer: Commit range in the workflow trunk', () => {
  const role = readFileSync(join(ROOT, 'rules/roles/software-engineer.md'), 'utf8');
  assert.match(role, /workflow `pull-request`[^\n]*git diff <default-branch>\.\.\.HEAD/);
  assert.match(role, /workflow `trunk`[^\n]*docs\(openspec\): Propose <id>[^\n]*HEAD/);
});

test('Acceptance needs a completed code review: Code review is missing', () => {
  assert.match(readFileSync(join(ROOT, 'rules/roles/product-owner.md'), 'utf8'), /Do not accept a change when `qa\.md` has no section `## Code review`/);
});
