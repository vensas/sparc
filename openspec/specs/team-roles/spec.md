# team-roles Specification

## Purpose
Gives each sparc project a small team of roles as plain rule files that the skills follow in the current session, with a code review by the software engineer before QA.

## Requirements

### Requirement: Roles as rule files
The sparc plugin SHALL provide one role file for each role in `rules/roles/`: product owner, architect, UX designer, software engineer and QA engineer. The plugin SHALL NOT define agent types.

#### Scenario: Role files exist
- **WHEN** a user installs the sparc plugin
- **THEN** `rules/roles/` has `product-owner.md`, `architect.md`, `ux-designer.md`, `software-engineer.md` and `qa-engineer.md`

#### Scenario: No custom agent types
- **WHEN** a user loads the sparc plugin in Claude Code
- **THEN** no agent type with the prefix `sparc:` is available

### Requirement: Skills follow the roles in the current session
Each skill SHALL name the role files that it follows. A skill SHALL NOT start a subagent or a worktree, except for the optional fresh-context check.

#### Scenario: Apply without subagents
- **WHEN** a user runs `/sparc:apply` without a request for a fresh-context check
- **THEN** the task groups, the code review, QA and acceptance run in the current session one after the other
- **AND** no worktree is created

### Requirement: Code review by the software engineer
After all task groups and before QA, the software engineer role SHALL review the diff of the change against the default branch with the review checklist of its role file. It SHALL fix each finding with a commit, or move it to the backlog after the user agrees. It SHALL record the result in the section `## Code review` of `qa.md`.

#### Scenario: Review finds an issue
- **WHEN** the code review finds duplicated code in the change
- **THEN** the software engineer removes the duplication with a commit
- **AND** `## Code review` in `qa.md` names the finding and the commit

#### Scenario: Review finds no issue
- **WHEN** the code review finds nothing
- **THEN** `## Code review` in `qa.md` gives the reviewed commit range and "No findings"

### Requirement: Acceptance needs a completed code review
The product owner SHALL accept a change only when `qa.md` has a section `## Code review` without open findings.

#### Scenario: Code review is missing
- **WHEN** `qa.md` has no section `## Code review`
- **THEN** the product owner does not accept the change

### Requirement: Optional fresh-context check
If the user asks for a fresh-context check, `/sparc:apply` SHALL run QA and acceptance in a general-purpose subagent. The subagent SHALL read the role files.

#### Scenario: User asks for a fresh-context check
- **WHEN** the user runs `/sparc:apply` and asks for a fresh-context check
- **THEN** QA and acceptance run in a general-purpose subagent that follows `rules/roles/qa-engineer.md` and `rules/roles/product-owner.md`
