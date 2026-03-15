# Design: Selection Inspector Model

## Overview
This change makes the right dock's inspection behavior explicit.

The key distinction is between:

- persistent inspection state in the right dock
- transient action and interaction surfaces that may appear elsewhere

## Inspector responsibilities

- `selected` is the persistent role for the currently focused entity, entry, or object
- browser selections and scene selections both route into that role
- selection-aware tabs update in place when selection changes
- non-selection tabs keep their own context unless the user changes them

## Empty states

When nothing is selected, the active inspector mode decides what fallback or summary should appear.

This prevents the shell from pinning stale selection details forever or force-switching tabs unexpectedly.

## Transient controls

Quick actions, targeting flows, and short-lived context surfaces remain transient interaction surfaces.

They may accompany the current selection, but they do not replace the meaning of the right-side inspector.

## Deferred concerns

- concrete renderer schemas per game system
- panel mobility and docking rules
- action-provider registration contracts