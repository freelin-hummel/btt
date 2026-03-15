# Change Proposal: Selection Inspector Model

## Summary
Define the persistent `selected` inspector model for the right dock, including how selection updates inspector content, when inspector tabs stay put, and how transient controls differ from persistent inspection.

## Why
The canonical tabletop spec has strong inspector ideas, but they currently live as part of a broad shell spec rather than as a focused interaction slice.

Without a dedicated change, selection behavior is likely to become inconsistent across browser and scene workflows.

## Scope
This change defines:

1. `selected` as the persistent inspector role for current focus.
2. Selection behavior across browser and scene contexts.
3. Inspector tab persistence when selection changes.
4. Mode-specific empty states when nothing is selected.
5. Transient quick actions and workflows as distinct from persistent inspection.

This change does **not** define panel drag mobility, full extension manifests, or final entity renderer schemas.

## User-visible outcomes
- The right dock has a stable meaning across workflows.
- Selection changes update selection-aware inspectors without hijacking unrelated tabs.
- Quick actions remain transient and do not replace persistent inspection.

## Success criteria
- Inspector behavior is described through observable user interactions.
- Browser and scene selection both route through the same `selected` role.
- Empty states and transient controls are explicit rather than implicit.