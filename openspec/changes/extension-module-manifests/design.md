# Design: Extension Module Manifests

## Overview
This change defines the minimum manifest contract needed for systems to attach UI and workflow behavior to the generic tabletop shell.

The shell stays responsible for layout orchestration. Extensions declare intent, capabilities, and supported placements.

## Manifest responsibilities

Extensions should declare:

- where modules may appear
- what capabilities those modules expose
- whether the modules are reorderable or movable
- which entity kinds they introduce
- which contextual actions they provide
- which specialized screens or workflows they add

## Composition rules

- extensions add to the shell rather than replace it
- multiple extensions may contribute modules into the same workspace
- shell vocabulary remains stable even when system-specific modules differ wildly

## Deferred concerns

- source ingestion and normalization pipeline
- theme token overlays
- storage and realtime behavior