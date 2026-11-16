# Spec Delta

## Purpose

Tell when sparc verifies a complete change, which checks block the stop of the agent, and how sparc prevents an endless loop.

## ADDED Requirements

### Requirement: Verify only a complete change

When the agent stops, the verifier SHALL check each open change in `openspec/changes/` (not in `archive/`). A change is complete when its `tasks.md` has one or more tasks and all tasks are checked. The verifier SHALL NOT block for a change that is not complete.

#### Scenario: Change in progress

- **WHEN** the agent stops and the open change has one unchecked task
- **THEN** the verifier does not block the stop

#### Scenario: Complete change

- **WHEN** the agent stops and all tasks of the open change are checked
- **THEN** the verifier runs all checks of this spec for the change

#### Scenario: No open change

- **WHEN** the agent stops and the project has no open change
- **THEN** the verifier does not block the stop and does not run the project commands

#### Scenario: Not a sparc project

- **WHEN** the agent stops in a folder without `openspec/config.yaml`
- **THEN** the verifier does nothing

### Requirement: Project commands pass

The verifier SHALL run the commands that the project names in the commands table of `AGENTS.md` with the names `Lint`, `Test` and `Verify`, in this order. It SHALL run the commands itself and SHALL NOT use the report of the agent. A command that exits with a code other than 0, or that runs longer than its time limit, fails.

#### Scenario: All commands pass

- **WHEN** the change is complete and the `Lint` and `Test` commands exit with 0
- **THEN** the verifier gives no finding for the commands

#### Scenario: A command fails

- **WHEN** the change is complete and the `Test` command exits with 1
- **THEN** the verifier blocks the stop
- **AND** the reason names the command, its exit code and the last lines of its output

#### Scenario: A command runs too long

- **WHEN** the change is complete and the `Test` command runs longer than its time limit
- **THEN** the verifier stops the command and blocks the stop
- **AND** the reason names the command and the time limit

#### Scenario: Optional verify command

- **WHEN** the change is complete and `AGENTS.md` names no `Verify` command
- **THEN** the verifier runs only the `Lint` and `Test` commands that exist

### Requirement: Project without commands

If `AGENTS.md` names no `Lint`, `Test` or `Verify` command, the verifier SHALL NOT block for commands. It SHALL warn one time for each project and tell how to name the commands.

#### Scenario: No commands named

- **WHEN** the change is complete and the commands table has no `Lint`, `Test` or `Verify` row
- **THEN** the verifier does not block for commands
- **AND** it warns one time that the project names no verification commands

#### Scenario: Second stop without commands

- **WHEN** the verifier warned about missing commands and the agent stops again with the same `AGENTS.md`
- **THEN** the verifier does not warn again

### Requirement: Spec scenarios have evidence

For a complete change, each scenario in the spec deltas of the change SHALL have a row in `openspec/changes/<id>/qa.md` with the name `<requirement>: <scenario>`. A row with the result `passed` SHALL have evidence. A row with the result `failed`, a row without evidence and a missing row SHALL block the stop. A row with the result `manual` SHALL NOT block. The verifier SHALL name it in its message.

#### Scenario: All scenarios passed

- **WHEN** each scenario of the change has a row in `qa.md` with `passed` and evidence
- **THEN** the verifier gives no finding for the scenarios

#### Scenario: Scenario without a row

- **WHEN** a scenario of the change has no row in `qa.md`, or `qa.md` does not exist
- **THEN** the verifier blocks the stop and names the scenario

#### Scenario: Failed scenario

- **WHEN** a row in `qa.md` has the result `failed`
- **THEN** the verifier blocks the stop and names the scenario

#### Scenario: Passed without evidence

- **WHEN** a row in `qa.md` has the result `passed` and an empty evidence cell
- **THEN** the verifier blocks the stop and names the scenario

#### Scenario: Manual scenario

- **WHEN** a row in `qa.md` has the result `manual`
- **THEN** the verifier does not block for this row
- **AND** its message names the scenario as a manual check for the user

### Requirement: Tasks name their verification

For a complete change, each task in `tasks.md` SHALL name its verification with `Verify:`. A task without `Verify:` SHALL block the stop.

#### Scenario: Task without verification

- **WHEN** the change is complete and one task has no `Verify:`
- **THEN** the verifier blocks the stop and names the task

### Requirement: Block the stop with a reason

When a check fails, the verifier SHALL block the stop of the agent. The reason SHALL name each failed check, so that the agent can continue to work. When all checks pass, the agent SHALL stop.

#### Scenario: Checks fail

- **WHEN** the change is complete and one or more checks fail
- **THEN** the hook blocks the stop
- **AND** the agent gets one reason with all failed checks

#### Scenario: Checks pass

- **WHEN** the change is complete and all checks pass
- **THEN** the hook does not block the stop

### Requirement: Limit of blocks

The verifier SHALL block the stop for the same change not more than 3 times in a row. After the third block, it SHALL let the agent stop. It SHALL tell the agent to write each failed check as an open point in the canvas section "Core Risks and Missing Information". When all checks pass, the count SHALL start again.

#### Scenario: Fourth stop with failed checks

- **WHEN** the verifier blocked the stop 3 times in a row for the same change and the checks fail again
- **THEN** the verifier does not block the stop
- **AND** it tells the agent to write the failed checks as open points
- **AND** it tells the user that the verifier stopped to block

#### Scenario: Count starts again

- **WHEN** the verifier blocked the stop 2 times and then all checks pass
- **THEN** the next failed check of the change can block again 3 times

### Requirement: Document check does not block

The document check SHALL keep its behavior: it warns and does not block (ADR-0005). The verifier SHALL NOT include document findings.

#### Scenario: Document drift in a complete change

- **WHEN** the change is complete, all verifier checks pass and the document check finds drift
- **THEN** the hook does not block the stop
- **AND** the document check warns as before
