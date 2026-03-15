# Design: Shell Layout Baseline

## Overview
This change establishes the minimum shared shell that all later module, inspector, and extension work relies on.

It intentionally starts with fixed region composition rather than draggable composition so layout responsibilities can stabilize before panel mobility is introduced.

## Regions

- `menu`: persistent shell header for screen switching and global status
- left region: docked companion content
- center region: dominant active workspace
- right region: docked companion content and future inspection flows
- `action_bar`: contextual bottom region when the active workflow needs it

## Workspace modes

### Browser-oriented mode
- left region hosts navigation, folders, or filters
- center region hosts list, document, or browser content
- right region hosts current-entry details or supporting context

### Scene-oriented mode
- center region hosts `scene`
- side regions host supporting tools and status panels
- `action_bar` appears only when the current scene context exposes meaningful actions

## Transient windows

Focused tasks such as reading a document, opening a sheet, or completing a short workflow should appear as transient windows over the center workspace.

These windows should preserve recognition of the underlying shell instead of acting as full-screen shell replacements.

## Deferred concerns

- drag-and-drop docking behavior
- extension placement metadata
- final density and theme token details

Those concerns are intentionally handled by separate changes.