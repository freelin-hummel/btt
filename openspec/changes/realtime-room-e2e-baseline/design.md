# Design: Realtime Room E2E Baseline

## Overview
This change translates tabletop realtime requirements into a concrete E2E validation architecture. It keeps tests aligned with the separation already documented in `openspec/specs/tabletop/architecture.md`:

- authoritative action/state lane
- collaborative CRDT lane
- persistence boundary via storage contracts

The resulting plan validates behavior, not implementation internals, so runtime services can evolve and persistence adapters can be swapped.

## Validation model

### 1) Requirement-to-scenario traceability
Each E2E slice maps to one or more requirements in `openspec/specs/tabletop/spec.md`, especially:

- baseline realtime responsibilities
- backend-agnostic structured persistence boundary

### 2) Lane-specific test suites

#### Authoritative lane suite
Covers turn order, permissions, movement, action sequencing, and deterministic event ordering.

Core assertions:
- server-authoritative mutations win over client-local assumptions
- out-of-order or stale-version actions are rejected or reconciled consistently
- all clients converge on the same authoritative room version

#### Collaborative lane suite
Covers Yjs-backed shared editing surfaces (notes/journal/planning).

Core assertions:
- concurrent collaborative edits converge
- collaborative state remains independent from authoritative combat/permission state
- invalid attempts to mutate authoritative state through collaborative channels are ignored/rejected

#### Recovery suite
Covers snapshot + event replay and reconnect.

Core assertions:
- room restart can rehydrate from latest snapshot and replay remaining events
- reconnecting clients receive canonical current state and resume from latest known version
- recovery remains consistent under concurrent reconnects

#### Persistence adapter parity suite
Covers contract-level behavior across storage adapter implementations.

Core assertions:
- identical contract inputs produce equivalent observable outputs
- ordering guarantees and pagination semantics remain equivalent
- no domain-layer changes are required to exercise alternate adapters

## Baseline acceptance thresholds
Initial thresholds are intentionally conservative and should be tightened later:

- p95 authoritative action fan-out latency within agreed local-dev threshold
- room recovery time from snapshot + replay within agreed local-dev threshold
- zero authoritative divergence across clients after deterministic scenario playback

(Threshold values are set during implementation to match CI/runtime constraints.)

## Test data and fixtures

### Room fixtures
- small party encounter fixture
- concurrent movement/action fixture
- reconnect mid-turn fixture

### Event fixtures
- valid ordered event stream
- duplicated action IDs
- stale room version actions
- mixed authoritative + collaborative activity burst

## Execution strategy

### Phase A: Deterministic happy-path room flow
- create room
- join multiple clients
- run sequenced authoritative actions
- assert convergence and persisted event index

### Phase B: Conflict and race flow
- submit overlapping actions from multiple clients
- assert deterministic conflict handling
- assert no client divergence

### Phase C: Recovery and reconnect flow
- force room process reset
- recover from snapshot + replay
- reconnect clients and verify continuity

### Phase D: Adapter parity flow
- run shared contract suite against D1 adapter and alternate adapter test double
- assert same observable domain outcomes

## Open questions
- Which framework will host browser + websocket orchestration for E2E runs?
- How should CI allocate flaky-network simulation budgets?
- What threshold values are realistic for local CI hardware vs staging?

These are deferred decisions and do not block this planning change.
