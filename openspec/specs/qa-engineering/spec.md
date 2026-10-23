# qa-engineering Specification

## Purpose
Gives each sparc project a QA engineer role that proves the spec scenarios of a change with automated integration tests and end-to-end tests.

## Requirements

### Requirement: Integration and end-to-end test scope
The QA engineer SHALL write integration tests and end-to-end tests for the spec scenarios of a change. The QA engineer SHALL NOT write unit tests. Unit tests stay with the software engineers.

#### Scenario: Tests for a change
- **WHEN** the QA engineer works on a change with spec scenarios
- **THEN** each test that it writes is an integration test or an end-to-end test
- **AND** each test names the spec scenario that it proves

#### Scenario: No unit tests
- **WHEN** the QA engineer completes its work on a change
- **THEN** it did not add or change unit tests

### Requirement: Automation first
The QA engineer SHALL write an automated test for each spec scenario of a change when automation is possible. The QA engineer SHALL use a manual check only when automation is not possible. It SHALL record each manual check in the change folder with the reason, the steps and the expected result.

#### Scenario: Scenario can be automated
- **WHEN** a spec scenario can be checked with the test tools of the project
- **THEN** the QA engineer writes an automated test for the scenario
- **AND** the test runs with a test command of the project

#### Scenario: Scenario cannot be automated
- **WHEN** a spec scenario cannot be checked with an automated test
- **THEN** the QA engineer writes a manual check for the scenario
- **AND** the manual check gives the reason why automation is not possible, the steps and the expected result
- **AND** the manual check is in the change folder and not in a lasting project document

#### Scenario: Manual check is archived with the change
- **WHEN** a change with a manual check is archived
- **THEN** the manual check is in the archived change folder

### Requirement: Use the test tools of the project
The QA engineer SHALL find the test tools and the test commands of the project before it writes a test. It SHALL use these tools. It SHALL NOT assume a test framework. The test tool is a decision for each project. The QA engineer SHALL NOT choose, install or use a new test tool before an ADR records it and the user approves it.

#### Scenario: Project has a test tool
- **WHEN** the project has an integration or end-to-end test tool in its build files or test configuration
- **THEN** the QA engineer writes its tests with this tool
- **AND** it does not add a different test framework

#### Scenario: Project has no suitable test tool
- **WHEN** the project has no tool that can run an integration test or an end-to-end test for a spec scenario
- **THEN** the QA engineer does not choose or install a tool alone
- **AND** it reports the missing tool, and the architect writes an ADR for the tool with the status `proposed`
- **AND** the QA engineer installs or uses the tool only after the user approves the ADR

### Requirement: Scenario report with evidence
At the end of its work, the QA engineer SHALL report each spec scenario of the change as passed, failed or manual. Each result SHALL have evidence.

#### Scenario: Passed scenario
- **WHEN** the automated test of a spec scenario passes
- **THEN** the report gives the scenario as passed, with the test name, the test command and its result

#### Scenario: Failed scenario
- **WHEN** the automated test of a spec scenario fails
- **THEN** the report gives the scenario as failed
- **AND** the report gives the expected behavior with the spec scenario, the actual behavior, the steps to reproduce and the evidence

#### Scenario: Manual scenario
- **WHEN** a spec scenario has a manual check
- **THEN** the report gives the scenario as manual, with the reason why automation is not possible

### Requirement: Acceptance from the QA report
In `/sparc:apply`, the product owner SHALL accept a change from the QA report. The product owner SHALL check only the manual scenarios itself. It SHALL NOT walk through the automated scenarios a second time.

#### Scenario: All automated scenarios passed
- **WHEN** the QA report gives each automated scenario as passed
- **THEN** the product owner accepts these scenarios from the report without a second walk-through

#### Scenario: Manual scenarios
- **WHEN** the QA report gives a scenario as manual
- **THEN** the product owner does the manual check and reports the scenario as passed or failed with evidence

#### Scenario: Failed scenario
- **WHEN** the QA report gives a scenario as failed
- **THEN** the product owner does not accept the change
- **AND** the failed scenario goes to a software engineer as an issue

### Requirement: QA engineer role
The sparc plugin SHALL provide the role file `rules/roles/qa-engineer.md`. The skills SHALL follow it for QA.

#### Scenario: Role is available
- **WHEN** a user installs the sparc plugin
- **THEN** the file `rules/roles/qa-engineer.md` exists and describes the QA engineer role

#### Scenario: Plugin stays valid
- **WHEN** a user runs `claude plugin validate .` in the sparc repository
- **THEN** the validation passes
