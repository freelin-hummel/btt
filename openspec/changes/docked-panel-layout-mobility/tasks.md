# Tasks: Docked Panel Layout Mobility

## 1. Define the dock stack behavior
- [ ] Add baseline dock-stack scenarios for left and right regions.
- [ ] Confirm docked modules preserve the dominant center workspace.

## 2. Define intra-dock reordering
- [ ] Add a scenario for reordering multiple visible modules within one dock.
- [ ] Confirm reorder behavior does not create new top-level layout regions.

## 3. Define cross-region movement
- [ ] Add a scenario for moving an eligible module between supported regions.
- [ ] Confirm invalid moves are rejected by shell rules rather than module-specific logic.

## 4. Define accessible shell-owned drag behavior
- [ ] Add a scenario covering shared shell drag sensors and focus handling.
- [ ] Confirm modules participate through shell contracts rather than panel-specific drag systems.

## 5. Capture the web drag baseline
- [ ] Record `dnd-kit` as the current baseline drag engine for the web shell.
- [ ] Run `npx openspec validate docked-panel-layout-mobility`.