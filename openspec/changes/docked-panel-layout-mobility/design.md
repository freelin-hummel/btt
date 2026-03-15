# Design: Docked Panel Layout Mobility

## Overview
This change defines the shell-level interaction model for left and right dock composition.

The shell, not individual modules, owns drag sensors, focus rules, drop validation, and placement persistence.

## Dock model

- left and right regions are stacked panel columns
- modules may replace each other in a dock without changing the global shell shape
- eligible modules may be reordered within a dock
- eligible modules may move between supported shell regions

## Interaction ownership

Modules should declare placement and mobility intent, but should not each ship their own incompatible drag behavior.

The shell should provide:

- pointer drag handling
- keyboard-accessible reorder and movement behavior
- drop acceptance and rejection rules
- visual feedback that is consistent across modules

## Web baseline

For the web client, shell-level layout mobility standardizes on `dnd-kit` as the baseline drag engine.

That decision belongs to the shell integration layer, not to individual module authors.

## Deferred concerns

- full extension manifest schema
- system-specific module registries
- inspector semantics for selected content