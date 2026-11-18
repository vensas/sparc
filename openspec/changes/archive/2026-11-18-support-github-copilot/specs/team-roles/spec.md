## MODIFIED Requirements

### Requirement: Roles as rule files
The sparc plugin SHALL provide one role file for each role in `rules/roles/`: product owner, architect, UX designer, software engineer and QA engineer. The plugin SHALL NOT define agent types.

#### Scenario: Role files exist
- **WHEN** a user installs the sparc plugin
- **THEN** `rules/roles/` has `product-owner.md`, `architect.md`, `ux-designer.md`, `software-engineer.md` and `qa-engineer.md`

#### Scenario: No custom agent types
- **WHEN** a user loads the sparc plugin in Claude Code or in GitHub Copilot CLI
- **THEN** no agent type with the prefix `sparc:` is available, and the plugin has no `agents/` folder
