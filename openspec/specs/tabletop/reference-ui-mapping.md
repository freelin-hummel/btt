# Reference UI Mapping

## Scope

This document maps the packaged reference app's observable UI surface area into the generic VTT shell defined in [spec.md](/Users/free/src/btt/openspec/specs/tabletop/spec.md) and the extension model defined in [architecture.md](/Users/free/src/btt/openspec/specs/tabletop/architecture.md).

The reference app was inspected from packaged resources under `reference/Contents`. The mapping below is therefore based on concrete module names, document macros, icons, and authored content workflows present in the shipped build, not on source code.

## Generic Mapping Rules

- A feature is `generic` when it should exist for any serious VTT regardless of ruleset.
- A feature is `system-specific` when the shell is reusable but the panel contents, actions, fields, or workflows depend on a particular rules engine or content model.
- A feature is `reference-specific` when it appears tied to Draw Steel or Codex authoring conventions and should be implemented as an extension, not as shell behavior.
- Theming attaches to generic shell regions and component slots. It does not define layout responsibilities.

## Shell And Navigation

| Reference feature | Evidence in package | Generic mapping | System-specific components needed | Where theming fits |
| --- | --- | --- | --- | --- |
| Global HUD header | `GameHudMenu`, toolbar and status icon assets, online users icon, time-of-day icon, editor settings icon | `menu` shell header with screen switching, search, status, presence, and global tools | Header actions for the active system, e.g. system launcher, encounter mode switcher, GM-only tools | Shell theme controls header height, typography, icon treatment, hover states, active-tab styling |
| Global status and presence | commit notes about logged-in status; online users icon | generic shell presence/status affordances | system-specific status badges only if a system adds special session states | semantic color tokens, badges, and avatar framing |
| Center workspace | scene-centric map and document/browser screens throughout streamed journals | generic center workspace that can host `scene` or browser/document content | system-specific center widgets such as encounter setup or negotiation boards | background surfaces, viewport chrome, document canvas framing |
| Left dock stack | hero panel updates, chat system, journal trees, folder navigation in authored docs | generic left utility dock | roster card schema, system-specific tree nodes, party summaries | panel density, headers, separators, avatar chips |
| Right dock stack | character inspector fixes, hero panel, encounter tools, selected content behavior | generic right inspector/control dock with persistent `selected` | system-specific inspectors for hero, monster, move, inventory item, negotiation actor | card surfaces, stat chips, selected-state styling, control affordances |
| Bottom contextual actions | action bar comments, combat readiness verbs such as `Draw Steel!` | generic `action_bar` for contextual actions only | action sets, targeting verbs, resource costs, roll shortcuts | action-button hierarchy, hotkey badges, cooldown/resource visuals |
| Floating windows and popouts | character sheet windowing, popout avatars, fullscreen display, PDF viewer | generic transient workspace windows and overlays | system-specific modal editors, detailed sheets, special viewers | modal framing, overlay blur, window chrome, animation tokens |

## Scene And Encounter Play

| Reference feature | Evidence in package | Generic mapping | System-specific components needed | Where theming fits |
| --- | --- | --- | --- | --- |
| Battle map / scene viewport | pervasive `map` references, token movement, start-area toggles, object commands | generic `scene` workspace | hex/square policy, movement rules, line-of-effect semantics, initiative overlays | grid contrast, fog/lighting controls, token frames, ruler styling |
| Token selection and inspection | many selected monster and hero sheet references, character inspector fixes | generic `selected` inspection model for scene entities | token-to-entity resolver, system stats, conditions, action lists | selected outline, allegiance colors, condition chip styling |
| Encounter panel | explicit `EncounterPanel`, `[[encounter]]`, `[[encounter:round2]]`, reinforcement groups | generic scene-side encounter module | encounter schema, group definitions, reinforcements, deployment logic, victory hooks | threat-level accents, squad headers, deployment markers |
| Combat launch / end controls | `Draw Steel!`, `End Combat`, `awardvp` macros | generic contextual combat controls in `action_bar` or transient cards | initiative engine, victory/reward logic, end-state transitions | primary action emphasis, combat-state palettes, urgency colors |
| Scene object control macros | `activateobjects`, `showtoken`, `move`, `screenshake`, light and terrain references | generic scene automation hooks and GM object controls | object command library, rules-aware triggers, access control | control iconography, confirmation states, gizmo styling |
| Environmental hazards and area logic | entries like `Stair Ward`, `Braziers`, `Primordial Pools`, `Webbing`, river flow | generic scene notes and hazard inspectors | hazard templates, damage/resolution semantics, rules text binding | hazard tinting, warning callouts, overlay textures |
| Deployment and reinforcement helpers | encounter groups, start areas, spawn locations, round-based reinforcements | generic deployment workflow | system-specific encounter templates, minion/squad semantics, automation timing | spawn markers, encounter badges, timeline visuals |
| Dice and opposed-roll surfaces | dice icon, opposed roll support, power roll append option | generic roll launcher and result display | dice formulas, edge/bane logic, power-roll semantics, result interpretation | dice skin, success/failure emphasis, roll-feed typography |

## Documents, Journals, And Presentation

| Reference feature | Evidence in package | Generic mapping | System-specific components needed | Where theming fits |
| --- | --- | --- | --- | --- |
| Journal tree and document browser | `Journal`, reorder journal docs, journal panel fixes, large journal indexes | generic document browser in a docked panel | system-specific document taxonomies, permission logic, inline entity resolvers | tree indentation, folder icons, document card styling |
| Rich markdown document reader | pervasive `MarkdownDocument`, inline images, tables, rules callouts | generic document reader/editor | system macro parser, entity link resolver, visibility rules, annotation schema | prose typography, heading scale, quote/callout styling |
| Embedded rich widgets in documents | `[[image]]`, `[[encounter]]`, `[[setting:numheroes]]`, party widgets, rich macros | generic document slot/annotation system | system-specific annotation renderers for encounters, party cards, negotiation meters, rewards | inline widget frames, embedded panel styling, callout density |
| Journal PDF viewer | `JournalPDFViewer` | generic alternate document viewer | PDF source resolver, permissions, bookmarks, citation links | page chrome, toolbar styling, annotation highlight colors |
| Fullscreen presentation | `FullscreenDisplay`, “Present to Players” style authored prompts | generic fullscreen/handout presentation module | player-safe redaction rules, presentation routing, system content filters | presentation-only palettes, cinematic typography, minimal chrome |
| Flowchart/bookmark adventure navigation | bookmarks and graph-like journal structures in streamed books | generic document graph / outline navigation | system-authored book structures, encounter book indexes, dependency links | node shapes, breadcrumb treatments, active-path styling |
| Info bubbles / handout moments | welcome documents, intro presentation, codex notes | generic transient handout/info overlay | system-authored onboarding content and reveal gating | handout card styling, motion, accent surfaces |

## Browsers, Libraries, And Content Management

| Reference feature | Evidence in package | Generic mapping | System-specific components needed | Where theming fits |
| --- | --- | --- | --- | --- |
| Compendium | `DMHub Compendium`, `AICompendium`, compendium comments, compendium fixes | generic browser-oriented content library | entity kinds, search facets, rule-specific columns, import provenance display | browser list density, pill filters, result highlighting |
| Bestiary browser | bestiary icon, empty bestiary debug notes, monster filters and sorting | generic entity browser for adversaries/NPCs | monster schema, role/category filters, stat preview, summon compatibility | role colors, creature-type chips, portrait framing |
| Inventory browser | `DrawSteelInventory`, inventory dialog fixes, renderable inventory items | generic item/equipment browser and sheet | item categories, equipment slots, currency model, weight rules, project-source semantics | item rarity colors, slot frames, currency icon set |
| Inventory editor | `DSInventoryEditor`, inventory compendium, inventory sheet comments | generic item editor surface | validation rules, slot constraints, system tags, crafting/project fields | form controls, slot matrices, validation emphasis |
| Keyword picker | `DSKeywordPicker`, keyword selection on character sheets | generic tag/keyword picker control | controlled vocabularies, domain-specific keyword families | chip styling, selected-state emphasis, color families |
| Tables and generators | roll tables, project source references, generated loot patterns | generic table/generator browser | table resolution rules, weighted outputs, rules-aware postprocessing | table headers, roll result emphasis, generator cards |
| Media and image assets | many image annotations, portraits, token frames | generic media attachment and browser support | portrait frame catalogs, token art bindings, system icon packs | framing assets, surface contrast, gallery treatments |

## Character, Roster, And Entity Sheets

| Reference feature | Evidence in package | Generic mapping | System-specific components needed | Where theming fits |
| --- | --- | --- | --- | --- |
| Hero panel / roster panel | repeated `hero panel` references and hero panel fixes | generic roster/party utility panel in left dock | party schema, ownership model, rest/recovery status, initiative summaries | avatar cards, roster density, allegiance or status tints |
| Character sheet | extensive `Character sheet` history, languages, ancestries, abilities, sheet-specific fixes | generic entity sheet framework | complete system sheet renderer, fields, validation, derived stats, advancement logic | sheet typography, section chrome, stat block visuals |
| Monster / NPC sheet | monster character sheet fixes, EV display, role edits, immunities/vulnerabilities | generic entity sheet framework reused for adversaries and NPCs | monster role schema, abilities, minion/squad rules, GM-only notes | enemy-role accents, threat badges, monster portrait frames |
| Character inspector | explicit inspector fixes and selected behavior | generic docked inspector distinct from full sheet | summary cards, quick actions, derived preview, condition summaries | compact card styling, emphasis tokens, quick-action chips |
| Inventory subpanels inside sheets | `CharacterSheetIInventory`, inventory on character sheet | generic sheet subpanel slot | equipment slots, carried items, resources, encumbrance | slot borders, item icons, resource track colors |
| Resource and progress widgets | `ProgressDice`, project points, heroic resources, stamina references | generic resource-display primitives | exact resource semantics, replenishment timing, caps, rolls | resource bar palette, die-face assets, pip/chip styling |
| Popout portrait and avatar views | popout avatars, portrait rectangle fixes, token popouts | generic portrait/media popouts | system portrait frames, disguise/alternate forms, saddle or mount visuals | image masking, frames, popout window theme |

## Chat, Rolls, And Communication

| Reference feature | Evidence in package | Generic mapping | System-specific components needed | Where theming fits |
| --- | --- | --- | --- | --- |
| Chat log | `ResourceChat`, `New chat system`, join/leave sounds | generic chat/activity module in left dock or bottom tray | roll rendering, system event serializers, GM/player visibility rules | message bubbles, speaker chips, timestamp contrast |
| Roll/chat integration | power-roll append option, opposed rolls, result references in docs and encounters | generic chat-embedded roll rendering | system roll explanation, success tiers, resource spend displays | result colors, dice glyphs, emphasis patterns |
| Presence and session events | join/leave sounds, online/offline status comments | generic session activity feed | system-specific event types only if rules use them | subtle status tones, user presence chips |
| Macro-driven chat events | rich macros and command-style actions | generic command bus with chat exposure | system commands, permissions, slash-command help, document actions | inline command chips, syntax highlighting, macro preview styling |

## Automation, Macros, And GM Tools

| Reference feature | Evidence in package | Generic mapping | System-specific components needed | Where theming fits |
| --- | --- | --- | --- | --- |
| Macro palette | `Macros`, `TimerMacro`, many command additions | generic macro/automation registry | command catalog, system action bindings, permission model | macro card styling, category icons, timer visuals |
| Rich document macros | `closeocuments`, `awardvp`, `slowstartlevel`, `showtoken`, `activateobjects` | generic automation hook system exposed through docs and UI | system command implementations and validation | inline macro callouts, preview frames, warning states |
| Negotiation panel | explicit `negotiation panel version 1` and negotiation documents with interest/patience tracks | generic transient workflow panel | negotiation state machine, motivations/pitfalls, social action semantics, result mapping | conversation palette, meter styling, NPC emphasis visuals |
| GM/editor settings | editor settings icon, debug log icon, GM-only hidden docs and settings | generic editor/GM tool area | system-authoring tools, import validators, debug inspectors, hidden-state controls | admin-only chrome, high-contrast warnings, utilitarian density |
| Time-of-day and ambient scene tools | time-of-day icon, ambient-light author notes | generic scene-control toolset | lighting rules only if system cares; otherwise scene-only | scene-control palette, sliders, day/night accents |
| Terrain and layer controls | terrain panel fixes, walls, footstep surfaces, underground light macros | generic scene layer/tool modules | terrain semantics, movement costs, sound surfaces, obstruction rules | tool toggles, layer legend colors, surface pattern tokens |

## Feature Split Summary

### Purely generic shell features

- `menu` header and global navigation
- left and right dock stacks
- center workspace hosting scene or browser content
- persistent `selected` inspector role
- contextual `action_bar`
- transient windows, fullscreen presentation, and popouts
- generic document browser, content browser, chat/activity log, macro registry, and scene tool docking

### Generic features that require system-specific renderers

- entity sheets
- inspectors
- inventory and equipment views
- compendium facets and result cards
- encounter setup and combat control surfaces
- roll rendering and dice logic
- document annotations such as encounter widgets, party blocks, and negotiation meters

### Reference-specific Draw Steel or Codex modules

- `Draw Steel!` combat start flow
- encounter balancing by hero-count widgets
- negotiation interest/patience workflow
- heroic resource, malice, minion squad, and reinforcement semantics
- monster role, EV, immunity, vulnerability, and project-source fields
- adventure-book encounter journals with embedded tactical procedures and reward macros

## Theming Placement

### Base shell theme

The base shell theme belongs to the platform, not to any single system module. It should own:

- typography scale and reading rhythm
- spacing, density, borders, shadows, and panel chrome
- standard semantic colors
- focus and selected states
- icon sizing and motion rules
- modal, dock, and overlay treatment

### System theme overlay

System modules should be allowed to contribute theme overlays for:

- stat chips and resource tracks
- faction or allegiance color systems
- dice and roll visuals
- character-sheet section treatments
- document callouts and chapter styling
- token frame or portrait frame packs

These overlays should plug into the shared token contract from [architecture.md](/Users/free/src/btt/openspec/specs/tabletop/architecture.md) rather than introducing custom layout regions.

### Content art versus theming

The following should not be treated as the theme itself:

- adventure-specific art
- map textures and props
- token portraits
- item illustrations
- scene lighting presets

Those are content assets referenced by modules, scenes, and documents. The theme defines how the shell and widgets present them.

## Implementation Guidance

If we want parity with the reference app without hard-coding Draw Steel into the shell, the build order should be:

1. Implement the generic shell, docking, document slots, scene workspace, chat, macros, and fullscreen presentation.
2. Implement generic browser and inspector infrastructure with pluggable entity renderers.
3. Add a Draw Steel extension that provides character sheets, encounter panels, negotiation workflow, roll semantics, inventory schema, and journal macros.
4. Add a system theme overlay for Draw Steel visual identity after the generic shell tokens exist.