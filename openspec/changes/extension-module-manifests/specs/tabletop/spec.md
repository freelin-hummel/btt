## ADDED Requirements

### Requirement: Extensions declare placement and capability intent through module manifests
The system SHALL require extensions to declare where their modules can appear and what shell capabilities those modules provide.

#### Scenario: Extension module targets existing shell regions
- GIVEN an extension registers a module
- WHEN the shell evaluates that module
- THEN the module declares one or more supported shell regions
- AND the module declares its capabilities for browsing, inspection, authoring, communication, control, or actions
- AND the shell does not require new top-level layout regions to host the module

### Requirement: Extensions declare layout mobility intent
The system SHALL require extensions to declare whether their modules can be reordered within a region or moved across regions.

#### Scenario: Extension module mobility rules are evaluated by the shell
- GIVEN an extension registers a module with layout mobility intent
- WHEN the shell evaluates a reorder or relocation request
- THEN the shell uses the module's declared mobility rules to accept or reject the request

### Requirement: Extensions can contribute new selectable entity types
The system SHALL let extensions register entity or content types that participate in selection and inspection.

#### Scenario: Extension entity type participates in selected inspection
- GIVEN an extension registers a new selectable entity type
- WHEN the user selects an instance of that type
- THEN the shell routes that selection into the shared inspection model

### Requirement: Extensions can contribute contextual action providers
The system SHALL let extensions contribute actions for relevant active context without redefining the meaning of `action_bar`.

#### Scenario: Extension action provider contributes scene-context actions
- GIVEN an extension exposes actions for the current workspace context
- WHEN the active context satisfies that extension's requirements
- THEN the extension can contribute actions to `action_bar`
- AND those actions coexist with other base or extension-provided actions

### Requirement: Extensions contribute workflows additively
The system SHALL let extensions add specialized screens and workflows while preserving the shared shell contract.

#### Scenario: Multiple extensions contribute workflows without replacing the shell
- GIVEN more than one extension is active
- WHEN the shell resolves available modules and workflows
- THEN those extensions can coexist in the same workspace
- AND no extension is required to replace the base shell layout in order to function