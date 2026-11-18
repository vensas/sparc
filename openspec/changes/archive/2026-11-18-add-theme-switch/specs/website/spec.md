## ADDED Requirements

### Requirement: Color scheme switch

Each page SHALL have a switch in the masthead that selects the light or the dark color scheme. The switch SHALL be a button that tells to a screen reader if the dark scheme is on. It SHALL start with the system preference of the visitor. A selection SHALL apply only to the current page, and the site SHALL NOT store it. Without JavaScript, the switch SHALL NOT show, and the page SHALL follow the system preference.

#### Scenario: Select the dark scheme

- **WHEN** a visitor with a light system preference clicks the switch
- **THEN** the page shows the dark color scheme, and the switch is pressed

#### Scenario: Start with the system preference

- **WHEN** a visitor with a dark system preference opens a page
- **THEN** the page shows the dark color scheme, and the switch is pressed

#### Scenario: Switch the scheme with the keyboard

- **WHEN** a visitor moves the focus to the switch with Tab and presses Enter or Space
- **THEN** the color scheme changes, and the focus is visible

#### Scenario: Switch without JavaScript

- **WHEN** a visitor opens a page with JavaScript turned off
- **THEN** the switch does not show, and the page follows the system preference
