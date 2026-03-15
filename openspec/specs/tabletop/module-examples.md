# Module Examples

## Purpose

This document shows how the generic VTT architecture applies to four very different systems: Lancer, Daggerheart, Cairn, and GURPS.

These examples are intentionally architectural. They demonstrate integration boundaries, not final UI commitments.

## Lancer Module

### Source Reality

Lancer publishes strongly typed JSON data through packages such as `@massif/lancer-data` and content-pack conventions such as LCP bundles.

### Import Strategy

1. Import all source JSON files as raw `source_blob` records.
2. Normalize file categories such as frames, weapons, systems, talents, sitreps, statuses, tags, and reserves into canonical nodes.
3. Preserve nested mechanics such as actions, bonuses, synergies, deployables, counters, integrated items, and tags as child nodes or related effects.
4. Track content-pack provenance and dependency metadata.

### Example Manifest

```ts
const lancerModule: SystemModuleManifest = {
  id: "lancer",
  name: "Lancer",
  version: "1.0.0",
  contentLicenseMode: "copyleft-package",
  sourceAdapters: [
    {
      id: "lancer-data-package",
      inputKinds: ["npm-package", "zip-bundle", "json-folder"],
      preservesRawPayload: true,
      versioningMode: "package-version",
    },
  ],
  entityKinds: [
    { id: "frame", category: "entity", displayName: "Frame", selectable: true, inspectable: true, searchable: true },
    { id: "weapon", category: "entity", displayName: "Weapon", selectable: true, inspectable: true, searchable: true },
    { id: "system", category: "entity", displayName: "System", selectable: true, inspectable: true, searchable: true },
    { id: "talent", category: "entity", displayName: "Talent", selectable: true, inspectable: true, searchable: true },
    { id: "sitrep", category: "document", displayName: "Sitrep", selectable: true, inspectable: true, searchable: true },
  ],
  normalizers: [
    { id: "lancer-core-normalizer" },
    { id: "lcp-normalizer" },
  ],
  validators: [
    { id: "lcp-manifest-validator" },
    { id: "lancer-reference-validator" },
  ],
  rulesRuntime: {
    id: "lancer-runtime",
    supportsDerivedState: true,
    supportsBuildValidation: true,
    supportsEncounterActions: true,
  },
  uiProviders: [
    { id: "lancer-compendium", placement: "center", capabilities: ["browse", "filter", "inspect"] },
    { id: "lancer-builder", placement: "center", capabilities: ["authoring", "validation"] },
    { id: "lancer-selected-inspector", placement: "right", capabilities: ["inspect", "act"] },
    { id: "lancer-action-bar", placement: "bottom", capabilities: ["action"] },
  ],
}
```

### Runtime Shape

Lancer requires full runtime mode:

- loadout and license validation
- pilot/mech derived state
- encounter action surfaces
- deployables and counters
- context-sensitive action availability

## Daggerheart Module

### Source Reality

Daggerheart data is organized as schema-backed release directories such as `core` with JSON schemas in `_schemas`.

### Import Strategy

1. Import release directories as versioned content releases.
2. Import `_schemas` as first-class `schema` nodes.
3. Validate content before normalization.
4. Normalize ancestries, communities, subclasses, domain cards, and related content into canonical nodes.

### Example Manifest

```ts
const daggerheartModule: SystemModuleManifest = {
  id: "daggerheart",
  name: "Daggerheart",
  version: "1.0.0",
  contentLicenseMode: "community-license",
  sourceAdapters: [
    {
      id: "daggerheart-release-adapter",
      inputKinds: ["git-repo", "release-directory", "json-folder"],
      preservesRawPayload: true,
      schemaSupport: true,
      versioningMode: "release-folder",
    },
  ],
  entityKinds: [
    { id: "ancestry", category: "entity", displayName: "Ancestry", selectable: true, inspectable: true, searchable: true },
    { id: "community", category: "entity", displayName: "Community", selectable: true, inspectable: true, searchable: true },
    { id: "subclass", category: "entity", displayName: "Subclass", selectable: true, inspectable: true, searchable: true },
    { id: "domain_card", category: "entity", displayName: "Domain Card", selectable: true, inspectable: true, searchable: true },
  ],
  normalizers: [
    { id: "daggerheart-schema-normalizer" },
  ],
  validators: [
    { id: "daggerheart-json-schema-validator" },
  ],
  rulesRuntime: {
    id: "daggerheart-runtime",
    supportsDerivedState: true,
    supportsBuildValidation: true,
    supportsEncounterActions: false,
  },
  uiProviders: [
    { id: "daggerheart-browser", placement: "center", capabilities: ["browse", "filter"] },
    { id: "daggerheart-character-builder", placement: "center", capabilities: ["authoring", "validation"] },
    { id: "daggerheart-card-inspector", placement: "right", capabilities: ["inspect"] },
  ],
}
```

### Runtime Shape

Daggerheart likely starts in light runtime mode:

- option composition
- class and card browsing
- derived character state
- lighter action automation than Lancer

## Cairn Module

### Source Reality

Cairn is markdown-first and SRD-first. Rules, monsters, adventures, and generators live mostly as markdown or simple scripts. The text is openly licensed under CC-BY-SA 4.0.

### Import Strategy

1. Parse rule markdown into linked `document` nodes.
2. Parse monster markdown into lightweight `entity:monster` records.
3. Import generator lists and random tables as `table` nodes.
4. Preserve markdown bodies for reading-first workflows.

### Example Manifest

```ts
const cairnModule: SystemModuleManifest = {
  id: "cairn",
  name: "Cairn",
  version: "1.0.0",
  contentLicenseMode: "open",
  sourceAdapters: [
    {
      id: "cairn-markdown-adapter",
      inputKinds: ["git-repo", "markdown-tree"],
      preservesRawPayload: true,
      versioningMode: "git-ref",
    },
  ],
  entityKinds: [
    { id: "monster", category: "entity", displayName: "Monster", selectable: true, inspectable: true, searchable: true },
    { id: "spell", category: "entity", displayName: "Spell", selectable: true, inspectable: true, searchable: true },
    { id: "relic", category: "entity", displayName: "Relic", selectable: true, inspectable: true, searchable: true },
    { id: "procedure", category: "document", displayName: "Procedure", selectable: true, inspectable: true, searchable: true },
  ],
  normalizers: [
    { id: "cairn-srd-normalizer" },
    { id: "cairn-monster-normalizer" },
    { id: "cairn-table-normalizer" },
  ],
  rulesRuntime: {
    id: "cairn-runtime",
    supportsDerivedState: true,
    supportsBuildValidation: false,
    supportsEncounterActions: false,
  },
  uiProviders: [
    { id: "cairn-rulebook", placement: "center", capabilities: ["browse", "read"] },
    { id: "cairn-generator-tools", placement: "left", capabilities: ["table", "generation"] },
    { id: "cairn-selected-inspector", placement: "right", capabilities: ["inspect"] },
  ],
}
```

### Runtime Shape

Cairn should remain reading- and generator-first:

- rulebook browsing
- lightweight monster and item sheets
- random tables and character generators
- simple save and damage helpers

## GURPS Module

### Source Reality

GURPS does not provide a broadly available canonical JSON package comparable to Lancer or Daggerheart. Official content is largely distributed as books and PDFs. A generic GURPS module therefore must distinguish between legal starter content, user-supplied structured data, and any future licensed official package channel.

### Import Strategy

1. Support a free starter ruleset using legally distributable content only.
2. Support user-supplied structured imports for richer campaigns.
3. Support a future licensed package adapter if publisher agreements exist.
4. Track book, page, and source provenance for all imported traits.

### Example Manifest

```ts
const gurpsModule: SystemModuleManifest = {
  id: "gurps",
  name: "GURPS",
  version: "1.0.0",
  contentLicenseMode: "user-supplied",
  sourceAdapters: [
    {
      id: "gurps-starter-adapter",
      inputKinds: ["json-folder", "user-json"],
      preservesRawPayload: true,
      versioningMode: "user-defined",
    },
    {
      id: "gurps-user-import-adapter",
      inputKinds: ["user-json", "user-csv", "user-xml"],
      preservesRawPayload: true,
      versioningMode: "user-defined",
    },
  ],
  entityKinds: [
    { id: "advantage", category: "entity", displayName: "Advantage", selectable: true, inspectable: true, searchable: true },
    { id: "disadvantage", category: "entity", displayName: "Disadvantage", selectable: true, inspectable: true, searchable: true },
    { id: "skill", category: "entity", displayName: "Skill", selectable: true, inspectable: true, searchable: true },
    { id: "spell", category: "entity", displayName: "Spell", selectable: true, inspectable: true, searchable: true },
    { id: "equipment", category: "entity", displayName: "Equipment", selectable: true, inspectable: true, searchable: true },
    { id: "template", category: "option", displayName: "Template", selectable: true, inspectable: true, searchable: true },
  ],
  normalizers: [
    { id: "gurps-trait-normalizer" },
  ],
  rulesRuntime: {
    id: "gurps-runtime",
    supportsDerivedState: true,
    supportsBuildValidation: true,
    supportsEncounterActions: true,
  },
  uiProviders: [
    { id: "gurps-library-browser", placement: "center", capabilities: ["browse", "filter"] },
    { id: "gurps-character-builder", placement: "center", capabilities: ["authoring", "validation"] },
    { id: "gurps-selected-inspector", placement: "right", capabilities: ["inspect", "act"] },
  ],
}
```

### Runtime Shape

GURPS needs a flexible trait and formula engine more than a fixed category browser. The module must support:

- traits and modifiers
- templates and lenses
- point accounting
- prereqs and defaults
- rich provenance by book and page

## Cross-System Validation

These four examples validate the generic architecture because they exercise distinct source and runtime shapes:

- Lancer validates strongly typed tactical JSON with rich embedded mechanics.
- Daggerheart validates schema-backed release JSON and option composition.
- Cairn validates markdown-first SRD and lightweight entity extraction.
- GURPS validates user-supplied or licensed imports where no open canonical package exists.

If the platform can host all four without changing shell vocabulary or top-level layout, then the architecture is genuinely generic rather than merely multi-theme.