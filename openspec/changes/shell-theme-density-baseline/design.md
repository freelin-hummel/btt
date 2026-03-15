# Design: Shell Theme Density Baseline

## Overview
This change defines the presentation contract that sits beside shell behavior.

The main goal is consistency: shell surfaces should feel like compact workspaces, while system overlays provide identity without changing layout semantics.

## Base shell presentation responsibilities

- compact density for docks, inspectors, toolbars, and editors
- restrained chrome and high information density
- shared focus, hover, and selected treatments
- shell-owned theme slots for surfaces, semantic states, and motion

## System overlay responsibilities

- rulebook or setting accents
- stat and resource treatments
- roll and sheet skins
- portrait or token framing

System overlays should attach to shared theme slots instead of redefining `menu`, `selected`, or `action_bar`.

## 3D scene direction

The default scene direction should stay stylized and readable, favoring low-fidelity geometry and simple materials over realism-heavy rendering.

## Deferred concerns

- exact token values
- one-off content art packages
- implementation-library choices for theming