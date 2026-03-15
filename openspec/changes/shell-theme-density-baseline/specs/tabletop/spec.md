## ADDED Requirements

### Requirement: The base shell presents tool-dense workspace surfaces by default
The system SHALL present docked panels, inspectors, toolbars, and editor surfaces as compact workspace tools rather than spacious consumer-web surfaces.

#### Scenario: Docked shell surfaces favor dense workspace presentation
- GIVEN the user is working in docked shell panels and inspectors
- WHEN the base shell presentation is applied
- THEN those surfaces favor compact, scan-friendly workspace density
- AND the shell does not rely on oversized card treatments or broad empty gutters as the default presentation

### Requirement: System themes attach to shared shell presentation roles
The system SHALL let system themes restyle shared shell surfaces without redefining the structural meaning of shell regions.

#### Scenario: System overlay changes appearance without changing shell roles
- GIVEN a system theme overlay is active
- WHEN shell surfaces are rendered
- THEN the overlay can change presentation treatment for shared shell surfaces
- AND the meaning of `menu`, `selected`, and `action_bar` remains unchanged

### Requirement: The default 3D scene direction favors stylized readability
The system SHALL treat the default 3D scene presentation as stylized and readability-first rather than realism-first.

#### Scenario: Default scene rendering emphasizes readability over realism
- GIVEN the scene workspace is rendered with the platform's default direction
- WHEN the user views the scene at typical tabletop distances
- THEN forms, interactables, and gameplay-significant objects remain easy to read
- AND the default rendering direction avoids realism-heavy presentation as its baseline