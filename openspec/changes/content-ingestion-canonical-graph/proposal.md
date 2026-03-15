# Change Proposal: Content Ingestion Canonical Graph

## Summary
Define the platform content pipeline slice for importing heterogeneous system content through source adapters, preserving raw payloads, normalizing into a canonical graph, and retaining provenance and validation metadata.

## Why
The canonical tabletop spec already describes a generic ingestion architecture, but there is no focused change that turns that architecture into a concrete reviewable slice.

Without this change, import behavior risks becoming tightly coupled to whichever system gets implemented first.

## Scope
This change defines:

1. Supported source adapter categories.
2. Preservation of source-native payloads alongside normalized records.
3. Storage of imported content in a canonical graph.
4. Provenance and licensing metadata retention.
5. Extension-owned validators and schema support.
6. Runtime depth and rules-runtime separation from ingestion.

This change does **not** define system-specific parsers, complete UI browser behavior, or realtime room execution.

## User-visible outcomes
- Different systems can import very different source formats into one platform model.
- Imported content remains inspectable even when the platform does not yet understand every source field.
- Systems can add validation and automation depth without blocking basic import and browsing.

## Success criteria
- Ingestion responsibilities are described as one reviewable vertical slice.
- Provenance, licensing, and raw-payload preservation are explicit.
- Rules runtime is clearly separated from source ingestion.