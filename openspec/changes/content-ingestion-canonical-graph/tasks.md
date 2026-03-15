# Tasks: Content Ingestion Canonical Graph

## 1. Define source adapter coverage
- [ ] Add a requirement for multiple adapter input categories.
- [ ] Confirm adapters preserve provenance for imported content.

## 2. Define canonical graph storage
- [ ] Add a requirement for normalized canonical graph storage.
- [ ] Add a requirement that raw payloads remain preserved when not yet interpreted.

## 3. Define metadata retention
- [ ] Add a requirement for provenance and licensing metadata retention.
- [ ] Confirm mixed distribution models can coexist in one platform.

## 4. Define validation and runtime depth
- [ ] Add a requirement for extension-owned schemas and validators.
- [ ] Add requirements for runtime depth choice and separation between ingestion and automation runtime.

## 5. Validate the change
- [ ] Run `npx openspec validate content-ingestion-canonical-graph`.
- [ ] Confirm the change stays generic across systems instead of encoding one game's data model.