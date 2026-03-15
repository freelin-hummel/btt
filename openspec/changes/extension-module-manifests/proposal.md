# Change Proposal: Extension Module Manifests

## Summary
Define the first concrete extension contract slice for tabletop modules so systems can contribute docked modules, selectable entity types, contextual actions, and specialized workflows without redefining the base shell.

## Why
The canonical tabletop spec already expects additive extension behavior, but there is no focused change that turns those ideas into a reviewable manifest-oriented slice.

Without this change, system-specific features are likely to leak directly into shell assumptions.

## Scope
This change defines:

1. Extension placement and capability metadata.
2. Extension-declared layout mobility intent.
3. Extension-contributed entity and selection types.
4. Extension action providers for contextual workflows.
5. Extension-contributed screens and workflows inside the shared shell.
6. Additive composition rules for multiple extensions.

This change does **not** define source ingestion details, system-specific renderer schemas, or final theme overlay tokens.

## User-visible outcomes
- New systems can plug modules into the same shell instead of forking it.
- Extension screens and workflows can coexist in a shared workspace.
- Contextual actions remain composable across base and extension-provided features.

## Success criteria
- Extension composition is described through observable shell behavior.
- Required placement and capability metadata are explicit.
- Multiple extensions can coexist without one replacing the shell contract.