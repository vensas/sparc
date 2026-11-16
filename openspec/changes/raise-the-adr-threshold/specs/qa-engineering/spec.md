## MODIFIED Requirements

### Requirement: Use the test tools of the project
The QA engineer SHALL find the test tools and the test commands of the project before it writes a test. It SHALL use these tools. It SHALL NOT assume a test framework. The test tool is a decision for each project. The QA engineer SHALL NOT choose, install or use a new test tool before `design.md` of an approved change names it.

#### Scenario: Project has a test tool
- **WHEN** the project has an integration or end-to-end test tool in its build files or test configuration
- **THEN** the QA engineer writes its tests with this tool
- **AND** it does not add a different test framework

#### Scenario: Design of the change names a new tool
- **WHEN** the project has no suitable test tool, and `design.md` of the change names a new tool and its command
- **THEN** the QA engineer installs and uses this tool, because `/sparc:apply` approved the change

#### Scenario: Project has no suitable test tool
- **WHEN** the project has no tool that can run an integration test or an end-to-end test for a spec scenario, and `design.md` of the change names no tool
- **THEN** the QA engineer does not choose or install a tool alone
- **AND** it stops and reports the missing tool, and the tool needs a change whose `design.md` names it
