# Tasks: Realtime Room E2E Baseline

## 1. Publish traceability first
- [ ] Add `traceability.md` mapping each canonical realtime requirement to scenario IDs.
- [ ] Mark any intentionally deferred coverage explicitly with rationale.
- [ ] Validate that no critical behavior appears only in `design.md` or `proposal.md`.

## 2. Slice A: happy-path authoritative convergence
- [ ] Define scenario `A1` for room creation, multi-client join, sequenced authoritative actions, and ack flow.
- [ ] Define the convergence assertion: all clients end at the same authoritative room version and state digest.
- [ ] Validate that the persisted authoritative event index reflects deterministic ordering.

## 3. Slice B: authoritative conflict handling
- [ ] Define scenario `A2` for stale-version or out-of-order authoritative submissions.
- [ ] Define scenario `A3` for duplicate authoritative submissions with idempotent handling.
- [ ] Validate that conflict handling is deterministic and produces no cross-client divergence.

## 4. Slice C: collaborative lane guardrails
- [ ] Define scenario `C1` for concurrent Yjs-backed collaborative edits with convergence expectation.
- [ ] Define scenario `C2` for mixed authoritative plus collaborative traffic in the same session.
- [ ] Define scenario `C3` proving collaborative channels cannot author authoritative mechanics.

## 5. Slice D: recovery and reconnect
- [ ] Define scenario `R1` for snapshot plus replay recovery after room process reset.
- [ ] Define scenario `R2` for reconnect catch-up from the canonical current version.
- [ ] Define scenario `R3` for a multi-client reconnect storm without authoritative divergence.

## 6. Slice E: persistence adapter parity
- [ ] Define scenario `P1` for session, event, and snapshot contract parity across adapters.
- [ ] Define scenario `P2` for ordering, pagination, and visible domain outcome parity.
- [ ] Add at least one alternate adapter target (test double or second backend adapter) behind the same storage contracts.

## 7. Add thresholds and reporting
- [ ] Define temporary p95 latency and recovery targets for local CI.
- [ ] Record how measurements are captured, reported, and whether each threshold is informational or blocking.
- [ ] Add runnable command(s) and failure triage notes for network, ordering, adapter, and recovery failures.

## 8. Validate and handoff
- [ ] Run `npx openspec validate realtime-room-e2e-baseline`.
- [ ] Confirm no ambiguity remains between authoritative and collaborative behavior.
- [ ] Share the recommended first implementation order: Slice A, then B, then C, then D, then E.
