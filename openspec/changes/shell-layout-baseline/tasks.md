# Tasks: Shell Layout Baseline

## 1. Define the baseline shell contract
- [ ] Add the shell baseline delta spec for persistent regions and workspace modes.
- [ ] Confirm the change uses shared vocabulary: `menu`, `scene`, `selected`, and `action_bar`.

## 2. Define browser workspace behavior
- [ ] Describe the browser-oriented workspace using left navigation, center content, and right-side supporting detail.
- [ ] Confirm the browser workspace does not require `action_bar` by default.

## 3. Define scene workspace behavior
- [ ] Describe the scene-oriented workspace with `scene` as the dominant center region.
- [ ] Describe when the bottom `action_bar` appears in scene context.

## 4. Define transient window behavior
- [ ] Add a transient workspace window scenario that preserves shell identity underneath.
- [ ] Confirm transient windows do not redefine the shell layout contract.

## 5. Validate the change
- [ ] Run `npx openspec validate shell-layout-baseline`.
- [ ] Confirm the change remains structural and does not commit to visual styling.