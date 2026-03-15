# Tasks: Realtime Room E2E Baseline

## 1. Build traceability matrix
- [ ] Map each new realtime requirement in `spec/tabletop` to one or more E2E scenarios.
- [ ] Mark uncovered requirements and either add scenarios or explicitly defer with rationale.
- [ ] Keep matrix in this change folder for review and future regression updates.

## 2. Define authoritative lane E2E scenarios
- [ ] Add deterministic multiplayer join/action/ack scenario.
- [ ] Add stale-version and out-of-order action scenarios.
- [ ] Add idempotency scenario for duplicate action submissions.
- [ ] Define convergence assertion: all clients end at same authoritative room version/state digest.

## 3. Define collaborative lane E2E scenarios
- [ ] Add concurrent Yjs edit scenario with convergence expectation.
- [ ] Add mixed authoritative + collaborative burst scenario.
- [ ] Add guardrail scenario proving collaborative channel cannot author authoritative mechanics.

## 4. Define recovery and reconnect scenarios
- [ ] Add snapshot + replay recovery scenario.
- [ ] Add reconnect-mid-session scenario with version catch-up.
- [ ] Add multi-client reconnect storm scenario.

## 5. Define persistence adapter parity scenarios
- [ ] Define contract suite for session/event/snapshot operations.
- [ ] Add alternate adapter implementation target (test double or second backend adapter).
- [ ] Assert parity of ordering, pagination, and visible domain outcomes.

## 6. Add baseline SLO assertions
- [ ] Define temporary p95 latency and recovery targets for local CI.
- [ ] Record how measurements are captured and reported.
- [ ] Flag tests as informational vs blocking while thresholds stabilize.

## 7. Wire execution and reporting
- [ ] Add runnable command(s) for E2E suite execution.
- [ ] Document failure triage steps (network, ordering, adapter, recovery).
- [ ] Ensure OpenSpec validation passes with this change metadata.

## 8. Validate and handoff
- [ ] Run `npx openspec validate realtime-room-e2e-baseline`.
- [ ] Confirm no spec ambiguity remains for authoritative vs collaborative behavior.
- [ ] Share prioritized implementation order for first execution pass.
