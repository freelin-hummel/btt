# Tabletop Change Breakdown

## Purpose

Break the broad `openspec/specs/tabletop/` canon into narrower OpenSpec changes that can be reviewed and implemented incrementally.

## Change set

| Change | Primary focus |
| --- | --- |
| `shell-layout-baseline` | persistent shell regions, browser mode, scene mode, contextual action bar, transient windows |
| `docked-panel-layout-mobility` | left/right panel stacks, docking, reordering, cross-region movement, shell-owned drag behavior |
| `selection-inspector-model` | `selected` semantics, tab persistence, empty states, transient controls versus persistent inspector |
| `extension-module-manifests` | extension placement metadata, capabilities, action providers, screens/workflows, additive composition |
| `content-ingestion-canonical-graph` | source adapters, raw payload preservation, canonical graph, provenance, validators, runtime depth |
| `shell-theme-density-baseline` | compact shell density, tool-like UI defaults, theming contract, low-fidelity 3D direction |
| `realtime-room-e2e-baseline` | realtime validation, recovery validation, persistence adapter parity validation |

## Coverage note

This breakdown keeps each change focused on one workflow or interaction slice rather than trying to implement the entire tabletop platform through one umbrella proposal.