---
mode: agent
description: Implement an existing OpenSpec change with minimal, validated code edits.
---

Use this prompt when the user wants a change from `openspec/changes/` implemented.

Workflow:
1. Read the target change's `proposal.md`, `design.md`, and `tasks.md`.
2. Implement only the scoped tasks needed for the requested step.
3. Update task status as work completes.
4. Validate using the repository's available checks.

Guardrails:
- Do not expand scope beyond the current change.
- Preserve structural layout vocabulary from the specs.
- If the runtime stack is not present yet, limit work to spec artifacts and supporting scaffolding.