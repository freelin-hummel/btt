# Tabletop Architecture

## Overview

This document defines the generic content and extension architecture that sits underneath the shared VTT shell. The shell remains system-agnostic. System modules contribute content, rules behavior, and UI workflows through additive extension points.

The architecture separates four concerns:

1. Source ingestion
2. Canonical content storage
3. Rules and runtime behavior
4. UI and workflow contribution

This separation is required so the same platform can ingest strongly typed JSON packages, schema-backed release directories, markdown-first SRDs, and user-supplied or licensed proprietary data sources without redefining the shell.

## Architectural Layers

### Source Adapter Layer

Source adapters read external content formats and produce import records with provenance.

Source adapters may support inputs such as:

- npm packages
- git repositories
- release directories
- zip bundles
- markdown trees
- JSON folder sets
- user-supplied JSON, CSV, or XML imports

Source adapters do not define shell layout or rules behavior.

### Canonical Content Graph

The platform stores imported material in a canonical graph so content can be indexed, searched, browsed, selected, inspected, referenced, versioned, and composed across modules.

The canonical graph stores both:

- normalized entities used by platform features
- source-native payloads preserved without loss

### System Runtime Layer

System runtimes interpret normalized and source-native data to provide system-specific calculations, derived state, automation, validation, and action semantics.

### UI Provider Layer

UI providers register system-specific compendium views, inspectors, builders, editors, and action surfaces into the base shell.

The shell owns cross-module layout orchestration, including drag-driven reordering and movement of eligible modules between supported regions.

For the web client, the baseline shell drag engine is `dnd-kit`. Modules do not integrate with `dnd-kit` directly. Instead, they declare layout metadata that the shell maps onto the shared drag engine.

### Realtime Multiplayer Layer

The baseline backend stack for synchronous multiplayer is:

- PartyKit room runtime for live room coordination
- Cloudflare Durable Objects for room-adjacent coordination and sequencing boundaries when needed
- D1 as the initial structured persistence backend
- R2 for large immutable artifacts, room snapshots, and append-oriented event archives
- Yjs for collaborative document-like state (notes, journals, planning surfaces, and other non-authoritative shared editing)

This layer must preserve a strict separation between:

- authoritative action/state flow (turn order, permissions, combat resolution, movement constraints, and similar game-critical state)
- collaborative CRDT flow (shared editing and non-critical collaborative workspace state)

Authoritative game state must not depend on CRDT convergence for correctness.

### Persistence Boundary Layer

Persistence is treated as a replaceable boundary rather than as direct usage of D1-specific APIs throughout the runtime.

The platform should route storage and query operations through storage ports so the initial D1 backend can be replaced with another relational backend (for example Postgres) with minimal surface change.

The baseline expectation is:

- D1-backed adapter is the default implementation in the initial deployment
- runtime services depend on storage contracts, not vendor SDK primitives
- swapping persistence backends should primarily require a new adapter plus configuration changes
- domain and room orchestration logic should remain unchanged when storage adapters are swapped

## Layout Composition Model

Layout composition is a shell concern, not a module concern.

Modules may declare:

- the regions in which they may appear
- whether they may be reordered within a region
- whether they may move across regions
- whether they may detach into transient overlay workflows
- whether they are fixed or required for a given workspace mode

The shell resolves those declarations into a concrete drag-and-drop model, validates drops, preserves layout state, and ensures accessibility behavior remains consistent across modules from different systems.

Inspector state is also shell-owned. The right dock owns selection-aware inspection, but the shell must preserve the active inspector tab or mode unless the user changes it or the active mode explicitly declares that it follows selection.

### Layout Mobility Contract

```ts
type LayoutMobilityDefinition = {
  defaultPlacement: "left" | "right" | "center" | "overlay" | "bottom"
  allowedPlacements: Array<"left" | "right" | "center" | "overlay" | "bottom">
  reorderableWithinPlacement: boolean
  crossPlacementDraggable: boolean
  detachable?: boolean
  pinned?: boolean
}
```

Pinned modules may still participate in shell rendering order, but they are not draggable by the user unless the workspace explicitly unlocks them.

### Drag Engine Boundary

The drag engine is an implementation detail of the shell adapter for a given client platform.

For the web client:

- `dnd-kit` is the standard drag engine for shell-level layout composition
- shell sensors, collision detection, keyboard interactions, and drag overlays are provided centrally
- modules should not import drag primitives just to participate in shell layout movement
- module authors target manifest metadata and shell callback contracts instead of library-specific APIs

## Theming Model

Theming is a cross-cutting presentation concern that sits beside the shell and UI provider layers rather than inside the rules runtime.

The base shell should follow the compact tool-density guidance in [style-guidelines.md](/Users/free/src/btt/openspec/specs/tabletop/style-guidelines.md), with an ultra-compact default presentation for docks, inspectors, toolbars, and editor surfaces.

That same guidance also defines the baseline 3D scene art direction: stylized low-fidelity rendering with PSX-era and classic RuneScape-like readability, rather than modern realism.

The base platform theme is responsible for shell-wide presentation primitives such as:

- typography
- spacing and density
- panel chrome and surface elevation
- icon stroke and weight defaults
- focus, hover, and selected treatments
- semantic status colors for success, warning, danger, and info
- motion timing and transition patterns

System modules may contribute theme overlays, but those overlays must attach to the shared theme contract rather than redefining shell structure.

System theme overlays are appropriate for:

- rulebook or setting accent colors
- stat chip styles
- resource track treatments
- dice and roll presentation skins
- document callout styles
- portrait, token, and faction framing treatments

Theming must not be the mechanism that decides layout responsibilities. A system may change the visual language of an inspector or browser without changing the meaning of `menu`, side docks, `selected`, or `action_bar`.

### Theme Contract

Each module may declare an optional theme contribution with token overrides and component-level adornments.

```ts
type ThemeContributionDefinition = {
  id: string
  appliesTo: Array<"shell" | "document" | "inspector" | "action-bar" | "chat" | "dice" | "entity-chip">
  tokens: Record<string, string>
  assets?: Record<string, string>
}
```

Theme contributions should be safe to disable, swap, or combine with accessibility modes without breaking system functionality.

## Canonical Content Graph

### Node Categories

The canonical graph supports at minimum the following top-level node categories:

- `ruleset`
- `entity`
- `document`
- `option`
- `move`
- `effect`
- `tag`
- `table`
- `relationship`
- `media`
- `schema`
- `source_blob`

### Required Node Fields

Each canonical node should preserve enough information for auditability, merging, and re-derivation.

```ts
type CanonicalNode = {
  id: string
  category: string
  kind: string
  title?: string
  sourceSystem: string
  sourcePackage?: string
  sourceVersion?: string
  sourcePath?: string
  sourceId?: string
  normalized: Record<string, unknown>
  raw?: Record<string, unknown> | string
  relationships: CanonicalRelationship[]
  license?: LicenseDescriptor
  diagnostics?: ImportDiagnostic[]
}

type CanonicalRelationship = {
  type: string
  targetId: string
  sourceField?: string
}

type LicenseDescriptor = {
  mode: "open" | "community-license" | "copyleft-package" | "proprietary" | "user-supplied"
  name?: string
  url?: string
  attribution?: string
}

type ImportDiagnostic = {
  level: "info" | "warning" | "error"
  message: string
  sourcePath?: string
  sourceId?: string
}
```

### Authoritative Session Persistence

Realtime play sessions should persist both replayability and recovery metadata.

At minimum, persistence contracts should support:

- session identity and membership metadata
- append-oriented authoritative event records
- periodic session snapshots for bounded replay and room recovery
- references to large snapshot or archive objects in R2

These responsibilities should remain stable regardless of the concrete relational backend.

### Normalization Principle

Normalization should improve cross-system navigation and tooling, but the platform must never require that source-native semantics be flattened into a single lowest-common-denominator schema.

If a platform feature does not yet understand a field, the field remains preserved in the raw payload and import diagnostics rather than being discarded.

## Extension Contracts

### Realtime Storage Port Definitions

The architecture should keep realtime persistence backend-agnostic through explicit storage ports.

```ts
type RealtimeStoragePort = {
  createSession(input: CreateSessionInput): Promise<SessionRecord>
  getSession(sessionId: string): Promise<SessionRecord | null>
  appendEvent(input: AppendEventInput): Promise<SessionEventRecord>
  listEvents(input: ListSessionEventsInput): Promise<SessionEventRecord[]>
  putSnapshot(input: PutSessionSnapshotInput): Promise<SessionSnapshotRecord>
  getLatestSnapshot(sessionId: string): Promise<SessionSnapshotRecord | null>
}

type BlobArchivePort = {
  putObject(input: PutBlobObjectInput): Promise<BlobObjectRecord>
  getObjectRef(objectId: string): Promise<BlobObjectRecord | null>
}
```

Concrete adapters (D1, Postgres, or others) must satisfy these contracts without changing higher-level room services.

### System Module Manifest

Each system module declares how it ingests content, normalizes data, contributes runtime behavior, and attaches UI to the shell.

```ts
type SystemModuleManifest = {
  id: string
  name: string
  version: string
  contentLicenseMode: "open" | "community-license" | "copyleft-package" | "proprietary" | "user-supplied"
  sourceAdapters: SourceAdapterDefinition[]
  entityKinds: EntityKindDefinition[]
  normalizers: NormalizerDefinition[]
  validators?: ValidatorDefinition[]
  rulesRuntime?: RulesRuntimeDefinition
  uiProviders: UIProviderDefinition[]
  themeContributions?: ThemeContributionDefinition[]
  importExport?: ImportExportDefinition[]
}
```

### Source Adapter Definition

```ts
type SourceAdapterDefinition = {
  id: string
  inputKinds: Array<
    | "npm-package"
    | "git-repo"
    | "release-directory"
    | "zip-bundle"
    | "markdown-tree"
    | "json-folder"
    | "user-json"
    | "user-csv"
    | "user-xml"
  >
  preservesRawPayload: true
  schemaSupport?: boolean
  versioningMode: "package-version" | "release-folder" | "git-ref" | "user-defined"
}
```

### Entity Kind Definition

```ts
type EntityKindDefinition = {
  id: string
  category: "entity" | "document" | "option" | "move" | "effect" | "table"
  displayName: string
  selectable: boolean
  inspectable: boolean
  searchable: boolean
}
```

### UI Provider Definition

```ts
type UIProviderDefinition = {
  id: string
  placement: "left" | "right" | "center" | "overlay" | "bottom"
  capabilities: string[]
  entityKinds?: string[]
  workflowKinds?: string[]
  layoutMobility?: LayoutMobilityDefinition
  followsSelection?: boolean
}
```

## Import Modes

### Open Package Import

Open package import is appropriate when a system publishes machine-readable content directly, such as typed JSON or schema-backed release data.

### Markdown-First Import

Markdown-first import is appropriate when a system publishes SRD, monster, adventure, or table content primarily as markdown or site content. The importer should parse structure, preserve prose, and optionally extract lightweight entities.

### User-Supplied Import

User-supplied import is appropriate when no redistributable canonical data package exists. The platform supplies import tools, while the module avoids redistributing copyrighted source data it is not licensed to ship.

### Licensed Import

Licensed import is appropriate when a publisher grants access to official structured content, entitlement checks, or protected content packages.

## Runtime Depth

The architecture supports multiple levels of runtime automation.

- Reference mode: browsing, linking, search, and document reading only.
- Light runtime mode: sheets, generators, tables, simple rolls, and limited derived values.
- Full runtime mode: build validation, derived stat resolution, contextual action surfaces, and encounter automation.

The base shell must support all three modes without assuming that every system offers the same automation depth.

## Licensing and Provenance

Because systems vary widely in legal distribution models, every import must preserve provenance and license metadata.

The platform should support at minimum these distribution patterns:

- open SRD content
- community-license content
- copyleft package content
- proprietary licensed content
- user-supplied content

Modules should be able to operate with mixed provenance, such as open rules text plus user-supplied premium content indexes.