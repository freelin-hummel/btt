---
mode: agent
description: Archive a completed OpenSpec change after implementation and validation.
---

Use this prompt when a change in `openspec/changes/` has been completed.

Workflow:
1. Confirm the change's tasks are complete.
2. Fold the finalized behavior into the relevant spec files under `openspec/specs/`.
3. Move the change into an archive location if the project adopts one.
4. Keep the canonical spec concise and up to date.

Guardrails:
- Do not archive incomplete or unvalidated work.
- Preserve observable requirements in the canonical spec.