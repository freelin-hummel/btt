## ADDED Requirements

### Requirement: Docked shell modules compose as stacked panel columns
The system SHALL treat the left and right shell regions as stacked panel columns for docked modules.

#### Scenario: Multiple docked modules share one region
- GIVEN more than one dockable module is visible in the same side region
- WHEN the shell resolves the layout
- THEN the modules appear as stacked sections within that region
- AND the center workspace remains structurally dominant

### Requirement: Eligible docked modules can be reordered within a region
The system SHALL let eligible docked modules reorder within a supported region without changing the shell contract.

#### Scenario: User reorders docked modules in one region
- GIVEN more than one reorderable module is visible in a side region
- WHEN the user reorders a module within that region
- THEN the shell updates the stacked order for that dock
- AND the shell does not create new top-level layout regions

### Requirement: Eligible docked modules can move between supported regions
The system SHALL let eligible modules move between supported shell regions when the shell placement rules allow it.

#### Scenario: User moves a module between supported shell regions
- GIVEN a module is allowed in more than one shell region
- WHEN the user moves the module to a valid destination region
- THEN the shell places the module in that destination region
- AND the module keeps the same identity where possible
- AND invalid destinations are rejected by the shell placement rules

### Requirement: Dock layout drag behavior is shell-owned and accessible
The system SHALL provide a shared shell interaction model for dock layout dragging with pointer and keyboard access paths.

#### Scenario: Shared shell drag behavior is used across modules
- GIVEN modules from different features participate in dock layout movement
- WHEN the user starts a reorder or relocation interaction
- THEN the shell provides the drag sensors, focus handling, and drop validation
- AND the modules do not need to ship incompatible drag systems to participate

### Requirement: The web shell uses one baseline drag engine for dock layout movement
The web implementation SHALL standardize dock layout movement on a shared drag engine.

#### Scenario: Web dock layout movement uses the shared drag engine
- GIVEN the web client supports dock layout movement
- WHEN dock layout interactions are implemented
- THEN the shell uses `dnd-kit` as the current baseline drag engine
- AND modules integrate through shell contracts rather than direct drag-library ownership