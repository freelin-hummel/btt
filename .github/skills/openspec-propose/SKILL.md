---
description: Create a new OpenSpec change proposal with proposal, design, and task artifacts.
---

Use this skill when the user wants to define a new change before implementation.

Steps:
1. Determine the change goal and derive a kebab-case name.
2. Create `openspec/changes/<name>/`.
3. Add `proposal.md`, `design.md`, and `tasks.md`.
4. Anchor the change in existing specs under `openspec/specs/`.
5. Keep the scope narrow enough to implement in one focused pass.

Rules:
- Prefer structural layout requirements over styling detail.
- Use Lancer terms such as `menu`, `scene`, `selected`, and `action_bar`.
- Ask for clarification only when the product intent is genuinely unclear.