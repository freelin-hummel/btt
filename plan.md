1. Scripting & Dynamic Mechanics (The Core)
To allow GMs to create, tune, or import RPG mechanics without recompiling the engine, you need runtime scripting and data-driven design.

bevy_mod_scripting: Essential for this project. It integrates scripting languages like Lua, Rhai, or Rune directly into the Bevy ECS. You can expose ECS components to the GM, allowing them to write custom damage calculations, spell effects, or turn-resolution logic dynamically.

bevy_common_assets: Allows you to easily load custom data formats (JSON, RON, YAML, TOML) as Bevy assets. Perfect for importing stat blocks, system rulesets, and item compendiums.

2. GM Tools, Journals, and UI
A VTT requires a massive amount of UI for character sheets, GM dashboards, right-click menus, and text-heavy journals.

bevy_egui: While Bevy has its own built-in UI, bevy_egui (an immediate-mode GUI) is currently the industry standard for building complex, editor-like interfaces in Rust. It is perfect for floating windows, draggable character sheets, rich-text journals, and deep configuration menus.

sickle_ui: If you prefer to stick closer to Bevy's native ECS-driven UI but need something more powerful and widget-based (dropdowns, sliders, scroll views), this is a highly capable native alternative.

3. Maps, Grids, and Spatial Management
For a system that handles square, hex, and gridless environments in both 2D and 3D.

hexx: The definitive crate for hex grids. It handles hex math, layouts, distances, and paths (A*). It is engine-agnostic but pairs perfectly with Bevy for 2D or 3D hex-based maps.

bevy_ecs_tilemap: A highly optimized plugin for 2D square, isometric, and hex tilemaps. Great if you want to support traditional 2D battlemaps.

big_brain or seldom_state: State machines or utility AI plugins. These are surprisingly useful in VTTs for managing complex turn phases, status condition durations, and trigger-based events on the map.

4. Interaction and Token Manipulation
Users need to be able to seamlessly click, drag, measure, and interact with objects in the world space.

bevy_mod_picking: Absolutely critical. It provides 2D and 3D mouse picking, raycasting, and event handling (click, drag, hover). This is how you implement selecting tokens, dragging them across the board, or right-clicking terrain.

leafwing-input-manager: The best input abstraction layer for Bevy. It allows you to bind complex actions (e.g., "Ping Map", "Measure Tool", "Next Turn") to various keyboard/mouse combos and easily allows players to rebind their own keys.

5. Camera Controls
bevy_panorbit_camera: A ready-to-use tabletop camera control system. It allows players and the GM to orbit, pan, and zoom around a 3D board smoothly.

bevy_pancam: A great equivalent if you are focusing on a purely 2D map view.

6. Dice Rolling & Physics
avian3d (formerly bevy_xpbd_3d) or bevy_rapier3d: If you want satisfying 3D dice rolling, you need a physics engine. Avian is entirely ECS-driven and integrates beautifully with Bevy for physics-based dice that bounce off terrain and tokens.

7. Networking & Sync (Multiplayer)
Since GMs and players need to see the same state, robust networking is required.

bevy_replicon: A highly recommended, data-driven replication system for Bevy. You mark which components (like token positions or HP) should be synced, and it handles broadcasting that state to all connected clients.

lightyear: A slightly more advanced networking crate that includes client-side prediction and rollback—likely overkill for a turn-based VTT, but incredibly powerful if you add real-time elements.

8. Persistence (Save/Load)
Worldbuilding requires robust saving of ECS states.

moonshine_save: A powerful framework for saving and loading Bevy ECS entities and components. It allows the GM to save the exact state of a battlemap, the world data, or journal entries into files to be resumed later.
