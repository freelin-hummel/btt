# Change Proposal: Shell Theme Density Baseline

## Summary
Define the presentation contract for the generic tabletop shell so docks, inspectors, and editors default to a compact tool-like density and system theme overlays can change appearance without redefining shell structure.

## Why
The tabletop docs already describe a compact, tool-dense presentation and a shared theming model, but those ideas are not yet captured as a focused OpenSpec change.

Without a dedicated presentation-contract change, the shell may drift toward spacious consumer-web styling or let system themes leak into layout responsibilities.

## Scope
This change defines:

1. A compact, tool-dense baseline presentation contract for shell surfaces.
2. Shared theming responsibilities owned by the base shell.
3. System theme overlays that attach to shared theme slots instead of changing shell roles.
4. A stylized low-fidelity default 3D scene direction for the tabletop workspace.

This change does **not** define final brand art, exact token values, or content-specific illustration assets.

## User-visible outcomes
- The shell reads like an authoring tool instead of a spacious marketing page.
- System themes can restyle the shell without redefining layout behavior.
- 3D scenes default to a readable stylized look rather than realistic presentation.

## Success criteria
- Presentation guidance is captured as one focused change rather than scattered prose.
- The base shell and system-theme responsibilities are clearly separated.
- The change stays at contract level and avoids exact visual token commitments.