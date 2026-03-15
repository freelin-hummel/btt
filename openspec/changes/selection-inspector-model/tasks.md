# Tasks: Selection Inspector Model

## 1. Define the persistent selected role
- [ ] Add a baseline requirement for `selected` as the persistent inspector role.
- [ ] Confirm browser and scene focus both route into that role.

## 2. Define tab persistence
- [ ] Add a scenario where a selection-aware tab updates in place.
- [ ] Add a scenario where a non-selection tab keeps its own context.

## 3. Define empty-state behavior
- [ ] Add a scenario for mode-specific fallback when nothing is selected.
- [ ] Confirm the shell does not pin stale selection data as the default behavior.

## 4. Define transient controls
- [ ] Add a scenario proving quick actions and targeting flows remain transient surfaces.
- [ ] Confirm transient controls do not redefine the right dock.

## 5. Validate the change
- [ ] Run `npx openspec validate selection-inspector-model`.
- [ ] Confirm the change stays behavior-focused rather than renderer-specific.