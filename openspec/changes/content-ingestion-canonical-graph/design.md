# Design: Content Ingestion Canonical Graph

## Overview
This change defines the shared content pipeline underneath system modules.

The goal is to support open packages, markdown-first systems, user-supplied content, and future licensed feeds without rebuilding the platform each time.

## Pipeline stages

1. source adapters read external content
2. imported payloads retain source provenance
3. normalized records enter the canonical content graph
4. raw payloads remain available for future interpretation
5. validators and rules runtimes remain extension-owned concerns

## Key separation

Import success should not depend on a complete rules runtime.

Systems can support:

- reference-only browsing
- light derived-state features
- full rules automation

without forcing the ingestion contract itself to change.

## Deferred concerns

- detailed browser UI composition
- shell docking rules
- realtime room behavior