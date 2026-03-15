# Change Proposal: Shell Layout Baseline

## Summary
Define the first shippable shell layout slice for the tabletop app: a persistent `menu`, a dominant center workspace, docked side regions, a contextual `action_bar`, and transient workspace windows that preserve the shell.

## Why
The canonical tabletop spec already defines the shell vocabulary, but there is no focused change that turns those ideas into a reviewable baseline implementation slice.

Without a dedicated shell-layout change, the shell risks being implemented piecemeal with drifting region responsibilities.

## Scope
This change defines:

1. A fixed baseline shell with top, left, center, right, and optional bottom regions.
2. A browser-oriented workspace mode using the shared shell vocabulary.
3. A scene-oriented workspace mode using the shared shell vocabulary.
4. Context rules for when `action_bar` appears.
5. Transient workspace windows that layer over the center workspace without replacing the shell.

This change does **not** define drag-driven panel mobility, extension manifests, system-specific renderers, or final visual polish.

## User-visible outcomes
- Users can move between browser and scene workspaces without losing shell structure.
- `menu`, side regions, center workspace, and optional `action_bar` have stable responsibilities.
- Focused overlays and windows open without replacing the persistent shell.

## Success criteria
- The baseline shell vocabulary is defined as one reviewable implementation slice.
- Browser and scene workspace modes are both described through observable layout behavior.
- The change remains structural and avoids styling commitments.