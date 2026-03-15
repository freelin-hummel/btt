# Traceability Matrix: Realtime Room E2E Baseline

## Purpose

Map canonical realtime requirements in `openspec/specs/tabletop/spec.md` to the scenario slices defined by this change so reviewers can quickly spot missing or deferred coverage.

## Canonical requirement coverage

| Canonical requirement | Change requirement / scenario IDs | Coverage notes |
| --- | --- | --- |
| Baseline realtime backend responsibilities are partitioned | `A1`, `A2`, `A3`, `C1`, `C2`, `C3`, `R1`, `R2`, `R3` | Covers authoritative lane, collaborative lane, and recovery separation. |
| Structured persistence is backend-agnostic at the runtime boundary | `P1`, `P2` | Covers adapter parity for session, event, snapshot, ordering, pagination, and recovery-visible outcomes. |

## Change-local scenario catalog

### Authoritative lane

| ID | Scenario | Expected proof |
| --- | --- | --- |
| `A1` | deterministic multi-client authoritative convergence | all clients end at the same authoritative room version and state digest; persisted event index is deterministic |
| `A2` | stale-version or out-of-order authoritative submission handling | stale or out-of-order submissions do not create divergence |
| `A3` | duplicate authoritative submission idempotency | repeated action IDs do not double-apply mutations |

### Collaborative lane

| ID | Scenario | Expected proof |
| --- | --- | --- |
| `C1` | concurrent collaborative convergence | Yjs-backed edits converge across clients |
| `C2` | mixed authoritative and collaborative burst | collaborative traffic does not destabilize authoritative convergence |
| `C3` | collaborative guardrail against authoritative mutation | collaborative channels cannot author turn order, permissions, or combat resolution |

### Recovery lane

| ID | Scenario | Expected proof |
| --- | --- | --- |
| `R1` | snapshot plus replay recovery | latest snapshot plus remaining events reconstruct canonical room state |
| `R2` | reconnect catch-up from current version | reconnecting clients receive canonical latest state/version |
| `R3` | multi-client reconnect storm | concurrent reconnects do not create authoritative divergence |

### Persistence parity lane

| ID | Scenario | Expected proof |
| --- | --- | --- |
| `P1` | session, event, and snapshot contract parity | equivalent contract inputs produce equivalent observable domain outcomes |
| `P2` | ordering, pagination, and recovery semantic parity | list and recovery behavior remain equivalent across adapters |

## Gap check

- No critical behavior named in `proposal.md` is currently missing from the delta spec.
- No scenario is intentionally deferred in this planning change.
- Threshold values remain deferred, but threshold reporting is explicitly required in `design.md` and `tasks.md`.
