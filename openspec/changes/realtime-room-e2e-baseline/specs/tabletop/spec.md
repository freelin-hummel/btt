## ADDED Requirements

### Requirement: Realtime room behavior has an executable E2E validation baseline
The system SHALL define an executable end-to-end validation baseline for synchronous multiplayer rooms that covers authoritative action flow, collaborative editing flow, and room recovery behavior.

#### Scenario: Authoritative room flow converges across clients
- GIVEN multiple clients are connected to the same room
- WHEN they perform a deterministic sequence of authoritative actions
- THEN all clients converge to the same authoritative room version and state digest
- AND authoritative events are persisted with deterministic ordering

#### Scenario: Stale or duplicate authoritative submissions are handled deterministically
- GIVEN multiple clients submit authoritative actions against the same room timeline
- WHEN a submission is stale, out of order, or reuses an already-processed action identifier
- THEN the room applies deterministic conflict handling or idempotent replay protection
- AND all connected clients still converge on the same canonical authoritative room version and state digest

#### Scenario: Collaborative editing remains non-authoritative
- GIVEN clients perform concurrent collaborative edits through Yjs-backed surfaces
- WHEN collaborative and authoritative traffic overlap in the same session
- THEN collaborative edits converge across clients
- AND collaborative channels do not directly mutate authoritative mechanics such as turn order, permissions, or combat resolution

#### Scenario: Collaborative channels cannot author authoritative mechanics
- GIVEN a client can edit collaborative document-like state in the room
- WHEN that client attempts to use the collaborative channel to mutate authoritative mechanics
- THEN the authoritative mechanics remain unchanged through the collaborative channel
- AND the attempt is ignored, rejected, or surfaced as invalid without causing cross-client authoritative divergence

#### Scenario: Room recovery restores authoritative continuity
- GIVEN a room has recent snapshots and appended authoritative events
- WHEN the room process is restarted and clients reconnect
- THEN the room recovers by loading the latest snapshot and replaying remaining events
- AND reconnecting clients receive the canonical current authoritative state

#### Scenario: Concurrent reconnects still receive canonical room state
- GIVEN multiple clients disconnect during an active room and then reconnect near the same time
- WHEN recovery and catch-up are in progress
- THEN each reconnecting client receives the same canonical current authoritative state
- AND reconnect churn does not create divergent room versions across clients

### Requirement: Persistence contract parity is validated across adapters
The system SHALL validate that realtime domain behavior remains equivalent when the structured persistence adapter implementation is swapped.

#### Scenario: Adapter swap preserves domain outcomes
- GIVEN the runtime uses storage contracts for session, event, and snapshot operations
- WHEN equivalent E2E scenarios are executed against two adapter implementations
- THEN observable domain outcomes remain equivalent
- AND backend-specific logic remains isolated to adapter implementations rather than room/domain services

#### Scenario: Adapter swap preserves ordering and recovery semantics
- GIVEN two adapter implementations satisfy the same storage contracts
- WHEN recovery, event listing, and snapshot lookup flows are executed against each adapter
- THEN observable ordering, pagination, and latest-snapshot semantics remain equivalent
- AND room/domain services do not require adapter-specific branching to preserve those outcomes

## MODIFIED Requirements

### Requirement: Structured persistence is backend-agnostic at the runtime boundary
The system SHALL isolate structured persistence behind storage contracts and SHALL include end-to-end parity validation that proves domain behavior remains stable when replacing D1 with another relational backend.

#### Scenario: Swapping D1 for another relational backend preserves runtime services
- GIVEN the realtime runtime uses storage contracts for session metadata, event appends, and snapshot indexing
- WHEN the deployment replaces D1 with another relational backend implementation
- THEN room and domain services continue to call the same storage contracts
- AND backend-specific query or client code is confined to adapter implementations
- AND the migration primarily requires adapter and configuration changes rather than room logic rewrites
- AND end-to-end parity validation confirms equivalent observable room outcomes across adapters
