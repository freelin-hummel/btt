## ADDED Requirements

### Requirement: The platform supports multiple source adapter categories for imported content
The system SHALL let extensions import content from more than one source adapter category without redefining the platform model for each source type.

#### Scenario: Extension imports content through a supported adapter category
- GIVEN an extension registers one or more source adapter categories
- WHEN a user imports supported content through one of those categories
- THEN the platform ingests that content through the extension's adapter contract
- AND the resulting content remains compatible with shared selection, browsing, and inspection patterns

### Requirement: Imported content preserves raw source payloads alongside normalized records
The system SHALL preserve source-native payloads alongside normalized content so unsupported source fields are not discarded.

#### Scenario: Unsupported source fields remain available after normalization
- GIVEN imported content contains source fields the platform does not yet interpret
- WHEN the content is normalized
- THEN the normalized record is stored for shared platform use
- AND the source-native payload remains preserved for later system-specific interpretation

### Requirement: Imported content is stored in a canonical graph with provenance
The system SHALL store imported content in a canonical graph that preserves provenance metadata needed for traceability.

#### Scenario: Imported record retains canonical identity and provenance
- GIVEN an extension imports source content
- WHEN the import completes
- THEN the platform stores canonical records for that content
- AND each record retains provenance identifying its source system and source origin

### Requirement: Imported content retains license and distribution metadata
The system SHALL retain license or distribution metadata so open, proprietary, and user-supplied content can coexist.

#### Scenario: Mixed licensing models remain distinguishable
- GIVEN content from different legal distribution models exists in the platform
- WHEN that content is stored and inspected
- THEN the platform can distinguish the provenance and licensing mode of each stored record

### Requirement: Extensions can define validators and runtime depth independently of ingestion
The system SHALL let extensions define validators and runtime depth without requiring full automation to exist before import succeeds.

#### Scenario: Extension validates content without redefining the shared import model
- GIVEN an extension provides validators or schemas for its content
- WHEN content is imported or edited
- THEN the extension can validate that content through its own rules
- AND validation does not require every other extension to share the same schema

#### Scenario: Content remains usable before full automation exists
- GIVEN an extension can import and normalize content
- AND its automation runtime is incomplete or intentionally limited
- WHEN import succeeds
- THEN the content still remains browsable, selectable, and inspectable