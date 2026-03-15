## ADDED Requirements

### Requirement: The tabletop shell has a fixed baseline layout slice
The system SHALL provide an initial fixed shell layout slice that establishes shared top, side, center, and optional bottom responsibilities before draggable composition is introduced.

#### Scenario: Browser workspace uses the fixed shell layout
- GIVEN the user opens a browser-oriented workspace
- WHEN the shell renders the baseline layout
- THEN `menu` remains visible in the top region
- AND the left region hosts navigation, folders, or filters
- AND the center region hosts the active browser or document content
- AND the right region hosts supporting detail for the current browser context

#### Scenario: Scene workspace uses the fixed shell layout
- GIVEN the user opens a scene-oriented workspace
- WHEN the shell renders the baseline layout
- THEN `menu` remains visible in the top region
- AND the center region contains `scene`
- AND the left and right regions host supporting companion content

### Requirement: The bottom action bar appears only for active context
The system SHALL treat `action_bar` as an optional contextual region rather than as a permanent shell footer.

#### Scenario: Browser workspace omits action bar when idle
- GIVEN the user is on a browser-oriented workspace without contextual actions
- WHEN the shell renders
- THEN `action_bar` is not required

#### Scenario: Scene workspace shows action bar when context demands it
- GIVEN the user is on a scene-oriented workspace with contextual actions available
- WHEN the shell renders
- THEN the bottom region contains `action_bar`

### Requirement: Transient workspace windows preserve the shell
The system SHALL open focused workspace windows over the center region without replacing the persistent shell layout.

#### Scenario: Focused content opens as a transient window
- GIVEN the user opens focused content such as a sheet, document, or short workflow
- WHEN the focused content is displayed
- THEN it appears as a transient window layered over the center workspace
- AND the underlying shell remains recognizable
- AND the transient window does not redefine the meaning of the docked shell regions