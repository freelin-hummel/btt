# Change Proposal: Realtime Room E2E Baseline

## Summary
Define an end-to-end validation baseline for synchronous multiplayer rooms using the current backend direction (PartyKit + D1 + R2 + Yjs) while enforcing a backend-agnostic persistence boundary so D1 can be replaced later with minimal domain-layer change.

## Why
The main tabletop spec now defines realtime and persistence requirements, but the repository currently lacks active OpenSpec change artifacts that translate those requirements into executable end-to-end validation slices.

Without a dedicated E2E plan, we risk shipping room behavior that appears correct in isolated demos but fails under concurrent users, reconnect flows, persistence recovery, or backend adapter swaps.

## Scope
This change defines:

1. E2E validation slices for authoritative realtime actions.
2. E2E validation slices for collaborative Yjs flows that must not author authoritative state.
3. Recovery and replay validations using snapshot + event history.
4. Adapter parity validations for persistence contract behavior.
5. Baseline SLO-style acceptance thresholds for room responsiveness and recovery.

This change does **not** implement production runtime code or lock in a specific E2E test framework.

## User-visible outcomes
- Multiplayer room behavior is validated for deterministic authoritative state under concurrent clients.
- Collaborative docs remain realtime and conflict-tolerant without becoming the source of truth for combat or permissions.
- Reconnect and room recovery behavior are validated and repeatable.
- Persistence backend swaps are guarded by contract-level parity checks.

## Non-goals
- Finalizing a frontend E2E framework choice.
- Shipping complete load/performance engineering infrastructure.
- Defining every system-specific rules automation test (Lancer, Daggerheart, etc.) in this first pass.

## Risks addressed
- Hidden divergence across clients during simultaneous actions.
- Data loss or stale state after room restart/recovery.
- Persistence coupling to D1 query/client details.
- CRDT misuse for authoritative game mechanics.

## Success criteria
- OpenSpec tasks define traceable E2E acceptance criteria for each critical realtime slice.
- Acceptance criteria cover happy path + conflict path + recovery path + adapter parity path.
- The plan is executable incrementally in vertical slices.
