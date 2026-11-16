## MODIFIED Requirements

### Requirement: Skills follow the roles in the current session
Each skill SHALL name the role files that it follows. By default, the roles run in the current session. The skills and rules SHALL NOT forbid subagents or worktrees, and SHALL NOT tell the agent to use them, except for the code review and the optional fresh-context check. The agent decides where a subagent helps.

#### Scenario: Skills do not forbid subagents
- **WHEN** a user reads the sparc skills and rules
- **THEN** no text forbids subagents, worktrees or parallel work

#### Scenario: Apply without subagents
- **WHEN** a user runs `/sparc:apply` without a request for a fresh-context check
- **THEN** the skill text tells the agent to start a subagent only for the code review, and does not tell it to start a worktree

### Requirement: Code review by the software engineer
After all task groups and before QA, the software engineer role SHALL review the diff of the commit range of the change with the review checklist of its role file. By default, the review SHALL run in one general-purpose subagent. The subagent SHALL get only the change id, the commit range, the path of the software engineer role file and the paths of the change documents, and SHALL NOT get the conversation. The subagent SHALL report each finding with the file, the line and the reason, and SHALL NOT change files. The main session SHALL fix each finding with a commit, or move it to the backlog after the user agrees. It SHALL record the result in the section `## Code review` of `qa.md`, with the commit range and the context of the review: `fresh` or `current session`.

#### Scenario: Review in a fresh context by default
- **WHEN** a user runs `/sparc:apply` without the argument `inline-review` and all tasks are checked
- **THEN** the code review runs in a general-purpose subagent that gets the change id, the commit range, the role file and the change documents, and no conversation
- **AND** `## Code review` in `qa.md` gives the context `fresh`

#### Scenario: Reviewer does not change files
- **WHEN** the review subagent finds an issue
- **THEN** the subagent reports the file, the line and the reason, and makes no change and no commit

#### Scenario: Review finds an issue
- **WHEN** the code review finds duplicated code in the change
- **THEN** the software engineer in the main session removes the duplication with a commit
- **AND** `## Code review` in `qa.md` names the finding and the commit

#### Scenario: Review finds no issue
- **WHEN** the code review finds nothing
- **THEN** `## Code review` in `qa.md` gives the reviewed commit range and "No findings"

#### Scenario: Commit range in the workflow trunk
- **WHEN** the workflow is `trunk` and the change commits are on the default branch
- **THEN** the reviewed commit range starts after the commit `docs(openspec): Propose <id>` and ends at `HEAD`

## ADDED Requirements

### Requirement: Code review in the current session
If the user gives the argument `inline-review`, `/sparc:apply` SHALL do the code review in the current session. If the agent cannot start a subagent, it SHALL do the code review in the current session and SHALL write the reason in `## Code review`.

#### Scenario: User asks for an inline review
- **WHEN** a user runs `/sparc:apply <id> inline-review`
- **THEN** the code review runs in the current session without a subagent
- **AND** `## Code review` in `qa.md` gives the context `current session`

#### Scenario: Subagent cannot start
- **WHEN** the agent cannot start the review subagent
- **THEN** the code review runs in the current session
- **AND** `## Code review` in `qa.md` gives the context `current session` and the reason
