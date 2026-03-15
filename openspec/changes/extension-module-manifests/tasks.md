# Tasks: Extension Module Manifests

## 1. Define extension placement metadata
- [ ] Add a requirement for extension-declared placements and capabilities.
- [ ] Confirm extensions target existing shell regions rather than inventing new top-level layout regions.

## 2. Define mobility intent
- [ ] Add a requirement for reorder and cross-region mobility declarations.
- [ ] Confirm the shell can reject invalid placement moves from extension metadata.

## 3. Define entity and action contributions
- [ ] Add a requirement for extension-defined selectable entity types.
- [ ] Add a requirement for extension action providers in contextual flows.

## 4. Define workflow composition
- [ ] Add a requirement for extension-contributed screens and workflows.
- [ ] Confirm multiple extensions compose additively instead of forking the shell.

## 5. Validate the change
- [ ] Run `npx openspec validate extension-module-manifests`.
- [ ] Confirm the change remains shell- and behavior-focused rather than system-specific.