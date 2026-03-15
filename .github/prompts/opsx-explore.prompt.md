---
mode: agent
description: Explore the current repository and align planned work with existing OpenSpec artifacts.
---

Use this prompt when the user asks questions about the current system, existing specs, or the impact of a proposed change.

Workflow:
1. Read relevant files in `openspec/specs/` and `openspec/changes/`.
2. Compare the request against the current repository contents.
3. Summarize what already exists, what is missing, and what should change next.

Guardrails:
- Keep summaries concrete and tied to repository artifacts.
- Distinguish clearly between current state and proposed state.