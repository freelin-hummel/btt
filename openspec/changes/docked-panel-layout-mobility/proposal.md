# Change Proposal: Docked Panel Layout Mobility

## Summary
Define how docked shell modules stack, reorder, and move between supported shell regions using shell-owned drag behavior rather than per-module interaction logic.

## Why
The canonical tabletop spec says the shell supports stacked side panels and drag-driven layout composition, but there is no focused change that defines the first concrete interaction slice for docked panel mobility.

Without this change, panel behavior is likely to fragment into one-off per-panel patterns.

## Scope
This change defines:

1. Stacked sections within the left and right dock regions.
2. Dockable module replacement without changing the shell structure.
3. Reordering of eligible modules within a dock.
4. Movement of eligible modules between supported shell regions.
5. Shell-owned accessible drag behavior for layout interactions.
6. The baseline web drag engine choice for shell layout composition.

This change does **not** define selection semantics, system-specific module content, or the full extension manifest surface.

## User-visible outcomes
- Docked panels behave consistently across shell modules.
- Reordering and relocation use one shell interaction model.
- The web client has one baseline drag engine instead of panel-specific drag libraries.

## Success criteria
- Dock stacking and mobility are described through observable shell behavior.
- Drag accessibility and shell ownership are explicit.
- The web drag-engine decision is captured as part of the shell contract.