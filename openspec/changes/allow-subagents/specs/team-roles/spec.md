## MODIFIED Requirements

### Requirement: Skills follow the roles in the current session
Each skill SHALL name the role files that it follows. By default, the roles run in the current session. The skills and rules SHALL NOT forbid subagents or worktrees, and SHALL NOT tell the agent to use them, except for the optional fresh-context check. The agent decides where a subagent helps.

#### Scenario: Skills do not forbid subagents
- **WHEN** a user reads the sparc skills and rules
- **THEN** no text forbids subagents, worktrees or parallel work

#### Scenario: Apply without subagents
- **WHEN** a user runs `/sparc:apply` without a request for a fresh-context check
- **THEN** the skill text does not tell the agent to start a subagent or a worktree
