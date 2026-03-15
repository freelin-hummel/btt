---
mode: agent
description: Propose a new OpenSpec change and create the initial proposal artifacts.
---

Use this prompt when the user wants to define a new change before implementation.

Workflow:
1. Identify or derive a kebab-case change name.
2. Create `openspec/changes/<name>/` if it does not already exist.
3. Write at least `proposal.md`, `design.md`, and `tasks.md`.
4. Keep the change scoped to one screen, workflow, or interaction slice.
5. Base the change on existing specs under `openspec/specs/`.

Guardrails:
- Prefer structural layout language over styling detail.
- Use Lancer terminology.
- If the request is ambiguous, ask for the missing product intent before writing files.