## ADDED Requirements

### Requirement: The right dock exposes a persistent selected inspector role
The system SHALL use `selected` as the persistent inspection role for the current browser entry, scene entity, or other focused object.

#### Scenario: Browser focus populates the selected inspector
- GIVEN the user selects a browser entry
- WHEN the selection state updates
- THEN the right dock shows that entry through the `selected` inspector role

#### Scenario: Scene focus populates the selected inspector
- GIVEN the user selects a scene entity or object
- WHEN the selection state updates
- THEN the right dock shows that entity through the `selected` inspector role

### Requirement: Selection changes do not hijack unrelated inspector tabs
The system SHALL preserve the active inspector tab or mode unless the active mode is explicitly selection-aware or the user changes it.

#### Scenario: Selection-aware tab updates in place
- GIVEN the active inspector tab is designed to follow current selection
- WHEN the user selects a different entity or entry
- THEN the same tab remains active
- AND the tab updates to show the new selection

#### Scenario: Non-selection tab preserves its own context
- GIVEN the active inspector tab is not bound to current selection
- WHEN the user changes selection elsewhere in the workspace
- THEN the same inspector tab remains active
- AND that tab keeps its own context

### Requirement: Inspector empty state depends on the active mode
The system SHALL let the active inspector mode determine its fallback behavior when nothing is selected.

#### Scenario: Active inspector mode shows its own fallback
- GIVEN an inspector mode is active
- AND nothing is currently selected
- WHEN the right dock renders
- THEN the dock shows a mode-specific fallback, summary, or empty state

### Requirement: Transient controls remain distinct from persistent inspection
The system SHALL treat quick actions, context menus, and short workflow surfaces as transient interactions rather than as replacements for the persistent inspector.

#### Scenario: Quick actions accompany but do not replace inspection
- GIVEN the user opens a quick-action or targeting surface for the current selection
- WHEN the transient surface appears
- THEN the persistent inspector role remains intact in the right dock
- AND the transient surface does not redefine the meaning of `selected`