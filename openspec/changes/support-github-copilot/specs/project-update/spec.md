## MODIFIED Requirements

### Requirement: Update only to a newer version
`/sparc:update` SHALL stop without a change when the project version is equal to the installed sparc version or higher than it. For a higher project version, it SHALL tell the user to update the plugin in the agent, with the commands of the README section "Update".

#### Scenario: Project is up to date
- **WHEN** the project version and the installed version are 0.7.0
- **THEN** update tells the user that the project is up to date and changes no file

#### Scenario: Project is newer than the plugin
- **WHEN** the project version is 0.8.0 and the installed version is 0.7.0
- **THEN** update changes no file and tells the user to update the plugin in the agent: `claude plugin update sparc@sparc` in Claude Code or `copilot plugin update sparc` in GitHub Copilot CLI
