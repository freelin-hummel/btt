# Tabletop Shell

## Requirement: The application exposes a shared virtual tabletop shell
The system SHALL expose a shared virtual tabletop shell with a persistent top region, docked left and right side regions, a dominant center workspace, and an optional bottom action region for context-sensitive play.

#### Scenario: Shared shell vocabulary remains consistent
- GIVEN a user moves between primary screens
- WHEN the shell renders screen layout
- THEN the top region is identified as `menu`
- AND the center region remains the dominant workspace for the active screen
- AND the left and right regions remain docked companion regions
- AND the current focus summary region is identified as `selected`
- AND the bottom region is identified as `action_bar` when contextual actions are available

## Requirement: The top bar acts as a persistent shell header
The system SHALL use the top region as a persistent shell header for screen switching, workspace status, and global tools instead of as screen-specific content.

#### Scenario: Top shell header persists across screens
- GIVEN a user switches between a browser-oriented screen and a scene-oriented screen
- WHEN the destination screen finishes rendering
- THEN the top region still contains `menu`
- AND the top region may include global search, status, presence, or tool affordances
- AND the destination screen's primary content remains outside the top region

## Requirement: The shell uses stacked side panels
The system SHALL treat the left and right regions as stacked panel columns so each region can host multiple sections without changing the overall shell structure.

#### Scenario: Side regions contain stacked sections
- GIVEN a screen requires more than one supporting panel in a side region
- WHEN the screen layout is resolved
- THEN the supporting panels are arranged as sections within the left or right region
- AND the center workspace remains visually primary
- AND the shell does not introduce extra top-level layout columns beyond left, center, and right

## Requirement: The shell supports dockable panel modules
The system SHALL allow panel modules to occupy the left or right dock without changing the overall shell pattern.

#### Scenario: A module occupies a docked panel region
- GIVEN the user opens a module such as a roster, document tree, chat log, asset browser, scene tools, layer tools, or inspector panel
- WHEN the module is shown in the shell
- THEN the module occupies a docked side panel
- AND the shell still preserves a dominant center workspace
- AND the module can replace another side-panel module without changing the global shell structure

## Requirement: The shell supports drag-driven layout composition
The system SHALL support drag-driven layout composition for eligible modules so users can reorder docked panels and move them between supported shell regions without redefining the shell.

#### Scenario: A user reorders modules within a dock
- GIVEN more than one dockable module is visible in a side region
- WHEN the user drags a module to a new position within that region
- THEN the shell reorders the stacked modules in that dock
- AND the dock remains part of the same left or right shell region
- AND the center workspace remains structurally dominant

#### Scenario: A user moves a module between supported regions
- GIVEN a module declares that it can appear in more than one shell region
- WHEN the user drags that module from one supported region to another
- THEN the shell moves the module into the destination region
- AND the module keeps the same identity and state where possible
- AND the move does not create new top-level layout regions outside the shared shell contract

## Requirement: Drag interactions remain accessible and shell-owned
The system SHALL treat layout drag interactions as shell-owned behavior with pointer and keyboard access paths rather than as ad hoc per-module implementations.

#### Scenario: Layout dragging uses a shared shell interaction model
- GIVEN multiple modules from different extensions participate in drag-driven layout
- WHEN the user starts a reorder or relocation interaction
- THEN the shell supplies the drag sensors, focus handling, collision rules, and drop validation
- AND individual modules declare capabilities and placement rules rather than implementing incompatible drag systems
- AND drag affordances remain consistent across base and extension-provided modules

## Requirement: The shell supports a browser-oriented screen
The system SHALL provide a browser-oriented screen for browsing rules, documents, assets, entities, or other library content with navigation or filters on the left, result browsing in the center, and the current entry in the right-side `selected` region.

#### Scenario: Browser layout renders with structural regions
- GIVEN the user opens a browser-oriented screen
- WHEN the screen layout is resolved
- THEN `menu` is visible at the top
- AND the left region contains navigation, taxonomy, folders, or filters
- AND the center region contains the current list, canvas, browser, or document content
- AND the right region contains `selected` entry details
- AND no contextual `action_bar` is required unless the active workflow specifically needs one

## Requirement: The shell supports a scene-centered screen
The system SHALL provide a scene-centered screen where the scene is the primary workspace and supporting information is arranged in docked companion regions.

#### Scenario: Scene-centered layout renders with scene-first structure
- GIVEN the user opens a scene-oriented workspace
- WHEN the screen layout is resolved
- THEN `menu` is visible at the top
- AND the center region contains `scene`
- AND the left region contains supporting panels such as roster, activity log, chat, or scene navigation
- AND the right region contains scene controls, layer tools, and `selected`
- AND the bottom region contains `action_bar` when context-sensitive actions are available

## Requirement: The left region hosts persistent utility panels
The system SHALL use the left region for stacked utility panels that support play, preparation, or browsing without displacing the main workspace.

#### Scenario: Left stack supports tabletop workflows
- GIVEN the user is in a scene-oriented workspace
- WHEN the left region renders
- THEN the left region may contain sections such as roster, activity log, chat, folders, or navigation trees
- AND those sections remain secondary to `scene`
- AND those sections do not replace the right-side `selected` inspector role

## Requirement: The right region hosts persistent inspectors and tools
The system SHALL use the right region for stacked inspector and control panels that describe current workspace state and current selection.

#### Scenario: Right stack supports inspection and control
- GIVEN the user is in a scene-oriented workspace
- WHEN the right region renders
- THEN the right region may contain sections such as scene tools, layer tools, extension tools, and `selected`
- AND `selected` remains the region responsible for the currently focused entity or object
- AND the right region acts as the primary inspection column rather than a second workspace

## Requirement: Selected content appears in the inspector
The system SHALL use `selected` as the persistent inspector for the current selection, including tokens, scene objects, browser entries, documents, or other selectable entities.

#### Scenario: Selecting a scene entity populates the inspector
- GIVEN the user selects a token or scene object in the workspace
- WHEN the selection state updates
- THEN the right-side `selected` inspector shows the selected entity's current details
- AND the inspector may combine instance state, source data, and contextual actions
- AND the inspector remains part of the right inspection column

#### Scenario: Selecting a browser entry populates the inspector
- GIVEN the user selects a browser entry such as a document, asset, or rules entry
- WHEN the selection state updates
- THEN the right-side `selected` inspector shows the current entry details
- AND the inspector adapts to the selected content type rather than forcing a single fixed schema

## Requirement: Selection does not override inspector tab context
The system SHALL treat the right dock as the owner of selection-aware inspection without forcing the active inspector tab or mode to switch when selection changes.

#### Scenario: A selection-aware inspector tab updates in place
- GIVEN the user has a character-oriented inspector tab active in the right dock
- AND that tab is designed to show the current selection
- WHEN the user selects a different token or entity
- THEN the active inspector tab remains the character-oriented tab
- AND the tab updates to show details for the newly selected entity
- AND the shell does not switch to a different inspector tab solely because selection changed

#### Scenario: A non-selection inspector tab keeps its context
- GIVEN the user has a journal-oriented inspector tab active in the right dock
- AND that tab is not bound to the current token or entity selection
- WHEN the user selects a token or other scene entity
- THEN the right dock remains on the journal-oriented inspector tab
- AND the journal tab preserves its own context
- AND the shell does not force the right dock back to a character, token, or default `selected` tab

## Requirement: Selection tools are distinct from the inspector
The system SHALL treat quick actions, context menus, targeting flows, and other ephemeral controls as transient interaction surfaces distinct from the persistent `selected` inspector.

#### Scenario: Contextual controls do not replace the inspector
- GIVEN the user interacts with an entity that exposes quick actions or a context menu
- WHEN transient controls appear
- THEN the controls appear as contextual interaction surfaces
- AND `selected` remains the persistent inspector role for the current selection
- AND transient controls do not redefine the meaning of the right-side inspector column

#### Scenario: Multi-step action flows remain transient
- GIVEN the user starts an action that requires targeting, confirmation, or stepwise resolution
- WHEN the action flow is rendered
- THEN the flow appears as a transient floating card, overlay, or modal surface
- AND the persistent inspector can still describe the current selection while the action flow is active

## Requirement: The bottom region is contextual rather than global
The system SHALL use the bottom region as a contextual action surface aligned with the active workspace rather than as a permanent global footer.

#### Scenario: Action bar appears only when context requires it
- GIVEN the user is on a browser-oriented screen without active contextual actions
- WHEN the screen renders
- THEN `action_bar` is not required
- GIVEN the user is in a scene-oriented workspace with actionable context
- WHEN the screen renders
- THEN the bottom region contains `action_bar`
- AND `action_bar` is used for contextual actions rather than persistent shell navigation

## Requirement: Selected content follows current context
The system SHALL use the `selected` region to show the currently focused entry, entity, or object instead of binding that region to a single content type.

#### Scenario: Selected region updates between screens
- GIVEN the user changes between a browser-oriented screen and a scene-oriented workspace
- WHEN the focused object type changes
- THEN the `selected` region shows the current focused entry on the browser screen
- AND the `selected` region shows the current unit or scene object on the scene-oriented screen
- AND the shell preserves the same inspector role even when the selected content type changes

## Requirement: Inspector empty state depends on the active inspector mode
The system SHALL let the active inspector mode determine what appears when no entity is currently selected.

#### Scenario: Inspector mode falls back appropriately
- GIVEN a scene-oriented workspace is active
- AND an inspector mode is active
- WHEN no token or object is currently selected
- THEN the right-side inspector shows a mode-specific fallback, summary, or empty state
- AND the fallback remains consistent with the active inspector mode rather than forcing the previous selection to remain visible

## Requirement: The shell supports transient workspace windows
The system SHALL support transient windows layered over the center workspace for focused tasks such as reading documents, editing entities, reviewing inventory, or completing contextual workflows.

#### Scenario: A focused window opens without replacing the shell layout
- GIVEN the user opens focused content while in the main workspace
- WHEN the focused content appears
- THEN it appears as a transient window layered over the center workspace
- AND the left and right docked panel structure remains recognizable underneath
- AND the shell does not treat the focused window as a replacement for the persistent inspector column

## Requirement: Layout specifications remain structural
The system SHALL define high-level layout specifications in terms of regions, responsibilities, and extension points without embedding hardcoded visual styling instructions.

#### Scenario: Layout language avoids styling commitments
- GIVEN a spec or proposal describes a screen layout
- WHEN the layout is reviewed
- THEN it defines regions such as top, left, center, right, and bottom
- AND it names responsibilities such as `menu`, `scene`, `selected`, and `action_bar`
- AND it does not require colors, fonts, spacing scales, or component-library-specific structures

## Requirement: The shell defines extension points for system-specific behavior
The system SHALL provide an extension model so domain- or game-specific packages can add content, workflows, and UI modules without redefining the base shell contract.

#### Scenario: A system extension contributes modules without replacing the shell
- GIVEN an extension adds system-specific modules, entities, or workflows
- WHEN the extension is loaded
- THEN the extension contributes modules into the existing shell regions
- AND the shell retains the same base responsibilities for `menu`, side docks, center workspace, `selected`, and `action_bar`
- AND the extension does not need to redefine the base shell layout to participate in it

## Requirement: Extensions declare placement and capability metadata
The system SHALL require extensions to declare where their modules can appear and what shell capabilities they require.

#### Scenario: An extension declares placement rules
- GIVEN an extension registers a module
- WHEN the registration is evaluated
- THEN the module declares whether it can appear in the left dock, right dock, center workspace, transient overlay, or bottom action region
- AND the module declares whether it provides browsing, inspection, authoring, communication, control, or action capabilities
- AND the shell can place the module without introducing new top-level structural regions

## Requirement: Extensions declare layout mobility metadata
The system SHALL require extensions to declare whether their modules can be reordered, dragged across regions, or pinned to a fixed placement.

#### Scenario: An extension declares drag and drop layout rules
- GIVEN an extension registers a module
- WHEN the shell evaluates that module's layout metadata
- THEN the module declares whether it is reorderable within a region
- AND the module declares which destination regions are valid for drag relocation, if any
- AND the shell can reject invalid drops without requiring extension-specific drag logic in the shell surface

## Requirement: Extensions can contribute new entity and selection types
The system SHALL allow extensions to register new content types and define how those types participate in selection, inspection, and action flows.

#### Scenario: An extension adds a new selectable entity type
- GIVEN an extension registers a new entity or content type
- WHEN the user selects an instance of that type
- THEN the shell can route the selection into `selected`
- AND the extension can provide inspector content, summary data, and contextual actions for that type
- AND the base shell still treats the result as part of the shared inspector model

## Requirement: Extensions can contribute action providers
The system SHALL allow extensions to contribute context-sensitive actions without redefining the meaning of the bottom action region.

#### Scenario: An extension contributes scene actions
- GIVEN an extension provides actions relevant to the current workspace context
- WHEN the active context satisfies the extension's requirements
- THEN the extension can contribute actions to `action_bar`
- AND those actions coexist with base or other extension-provided actions
- AND the presence of extension actions does not convert `action_bar` into global navigation

## Requirement: Extensions can contribute screens and workflows
The system SHALL allow extensions to register system-specific screens, browser modes, editor modes, and transient workflows while preserving the base shell vocabulary.

#### Scenario: An extension contributes a specialized workflow
- GIVEN an extension registers a specialized browser, editor, or scene-adjacent workflow
- WHEN the user opens that workflow
- THEN the workflow renders within the existing shell regions or as a transient workspace window
- AND the shell continues to expose the same top, side, center, and optional bottom responsibilities
- AND the workflow can supply its own modules without redefining the shell's structural contract

## Requirement: Extensions can compose rather than fork
The system SHALL prefer additive composition so multiple extensions can coexist in one workspace without requiring mutually incompatible shell definitions.

#### Scenario: Multiple extensions contribute modules together
- GIVEN more than one extension is active
- WHEN the shell resolves available modules and workflows
- THEN modules from multiple extensions can coexist in the same workspace
- AND region placement and inspector responsibilities remain consistent
- AND no extension is required to replace the global shell in order to function

## Requirement: The web shell standardizes on a shared drag engine
The web implementation SHALL standardize shell-level drag-driven layout interactions on a single drag engine so extension modules target one integration contract.

#### Scenario: Web layout drag behavior uses the shared drag engine
- GIVEN the web client exposes drag-driven layout composition
- WHEN shell layout dragging is implemented
- THEN the shell uses a shared drag engine rather than per-module drag libraries
- AND the current baseline integration for that drag engine is `dnd-kit`
- AND extension modules integrate through shell metadata and placement contracts rather than by binding directly to the drag library surface

## Requirement: The shell supports multiple source adapter types
The system SHALL support extension-provided source adapters so content can be imported from structured packages, schema-backed releases, markdown trees, and user-supplied data without redefining the shell.

#### Scenario: An extension imports content from a supported source type
- GIVEN a system extension registers one or more source adapters
- WHEN a user imports supported content such as an npm package, release directory, zip bundle, markdown tree, or user-supplied JSON set
- THEN the extension can ingest that content through its registered adapter
- AND the shell continues to use the same selection, browsing, and inspector vocabulary after import
- AND importing one source type does not require redefining how another system's source type is handled

## Requirement: Imported content preserves source-native payloads
The system SHALL preserve source-native payloads alongside normalized records so imported content is not reduced to only the subset currently understood by shared UI features.

#### Scenario: Unsupported source fields remain preserved
- GIVEN imported content contains fields not yet interpreted by shared platform features
- WHEN the content is normalized into the platform's content model
- THEN the platform preserves the source-native payload for those fields
- AND the extension can still interpret those fields later
- AND import completeness does not depend on immediate support for every field in shared UI

## Requirement: Imported content is stored in a canonical content graph
The system SHALL store imported material in a canonical content graph so content from different extensions can be searched, selected, inspected, related, and versioned through a shared platform model.

#### Scenario: Imported records become canonical graph nodes
- GIVEN an extension imports source content
- WHEN the import completes
- THEN the platform stores canonical nodes representing normalized content categories such as entities, documents, tables, effects, and tags
- AND each canonical node retains source provenance sufficient to identify its origin
- AND relationships between imported records can be traversed without requiring direct access to the original source package

## Requirement: Canonical content graph supports provenance and licensing metadata
The system SHALL retain provenance and licensing metadata for imported content so modules with different legal distribution models can coexist in one platform.

#### Scenario: Imported content carries provenance and license metadata
- GIVEN an extension imports content governed by an open, community, proprietary, or user-supplied distribution model
- WHEN the content is stored in the canonical content graph
- THEN the stored content records retain provenance metadata such as source package, source version, and source path when available
- AND the stored content records retain license or distribution metadata describing how the content may be used
- AND the platform can distinguish between redistributable module content and user-supplied content

## Requirement: Extensions can define system-owned schemas and validators
The system SHALL allow extensions to register schemas and validators for their own content without forcing every system to adopt a single deeply semantic global schema.

#### Scenario: A schema-backed extension validates its data
- GIVEN an extension provides schemas or validation rules for its source data
- WHEN content is imported or edited
- THEN the extension can validate that content against its own schema rules
- AND validation failures can be reported without invalidating the base shell
- AND the shell does not require all other extensions to share the same system-specific schema

## Requirement: Extensions can choose their runtime depth
The system SHALL allow extensions to operate at different runtime depths ranging from reference-only browsing to full derived-state and action automation.

#### Scenario: Extensions with different automation depth coexist
- GIVEN one extension provides browsing and reading workflows only
- AND another extension provides build validation, derived state, and contextual encounter actions
- WHEN both extensions are available in the same platform
- THEN each extension can expose the runtime depth it supports
- AND the shell continues to host both through the same shared region vocabulary
- AND the platform does not require every extension to implement the same level of automation

## Requirement: Extensions can provide rules runtimes separate from ingestion
The system SHALL treat rules and automation runtimes as distinct from source ingestion so a system can support reference content without requiring complete rules automation at import time.

#### Scenario: Content import succeeds before full automation exists
- GIVEN an extension can ingest and normalize system content
- AND the extension's full automation runtime is incomplete or intentionally limited
- WHEN the content is imported
- THEN the imported content remains browsable, selectable, and inspectable
- AND missing runtime behaviors do not prevent content storage or navigation
- AND the extension can later add runtime features without changing the base shell contract