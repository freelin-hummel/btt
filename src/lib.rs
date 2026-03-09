use bevy::{
    prelude::*,
    window::{ExitCondition, WindowPlugin},
};
use bevy_egui::{EguiContexts, EguiPlugin, egui};
use std::{cmp::Reverse, collections::VecDeque, mem};

const MAX_REJECTION_SAMPLING_ATTEMPTS: usize = 8;
const LCG_MULTIPLIER: u32 = 1_664_525;
const LCG_INCREMENT: u32 = 1_013_904_223;
const BOARD_HEX_RADIUS: f32 = 28.0;
const BOARD_VIEW_RADIUS: i32 = 4;
const SQRT_3: f32 = 1.732_050_8;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Resource)]
pub enum EnginePhase {
    Bootstrapping,
    Running,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum GridKind {
    Square,
    Hex,
    Gridless,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CameraMode {
    PanZoom2d,
    Orbit3d,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SessionMode {
    Local,
    Multiplayer,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TokenRole {
    Player,
    Npc,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Component)]
pub struct GridPosition {
    pub q: i32,
    pub r: i32,
}

impl GridPosition {
    pub const fn new(q: i32, r: i32) -> Self {
        Self { q, r }
    }

    pub fn distance_to(self, other: Self) -> u32 {
        let dq = self.q - other.q;
        let dr = self.r - other.r;
        let ds = (self.q + self.r) - (other.q + other.r);

        ((dq.abs() + dr.abs() + ds.abs()) / 2) as u32
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Resource)]
pub struct Ruleset {
    pub system: &'static str,
    pub actions: Vec<ActionRule>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct ActionRule {
    pub name: &'static str,
    pub dice: &'static str,
    pub description: &'static str,
}

#[derive(Debug, Clone, PartialEq, Eq, Resource)]
pub struct Journal {
    pub entries: Vec<JournalEntry>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct JournalEntry {
    pub title: &'static str,
    pub body: &'static str,
}

#[derive(Debug, Clone, PartialEq, Eq, Resource)]
pub struct BattleMap {
    pub name: &'static str,
    pub grid: GridKind,
    pub width: u32,
    pub height: u32,
}

#[derive(Debug, Clone, PartialEq, Eq, Resource)]
pub struct CameraState {
    pub mode: CameraMode,
    pub zoom_percent: u16,
}

#[derive(Debug, Clone, PartialEq, Eq, Resource)]
pub struct NetworkState {
    pub mode: SessionMode,
    pub gm: &'static str,
    pub players: Vec<&'static str>,
}

#[derive(Debug, Clone, PartialEq, Eq, Resource)]
pub struct SaveState {
    pub autosave_slot: &'static str,
    pub autosave_enabled: bool,
    pub dirty: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Component)]
pub struct Token {
    pub name: &'static str,
    pub role: TokenRole,
    pub hit_points: i32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Component)]
pub struct Initiative(pub i16);

#[derive(Debug, Clone, PartialEq, Eq, Resource)]
pub struct TurnOrder {
    pub round: u32,
    pub active_index: usize,
    pub combatants: Vec<Entity>,
}

#[derive(Debug, Clone, PartialEq, Eq, Resource)]
pub struct SelectionState {
    pub selected: Option<Entity>,
    pub last_moved_distance: u32,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DiceRequest {
    pub label: String,
    pub count: u8,
    pub sides: u16,
    pub modifier: i16,
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct DiceRoll {
    pub label: String,
    pub rolls: Vec<u16>,
    pub modifier: i16,
    pub total: i32,
}

#[derive(Debug, Default, Resource)]
pub struct DiceLog {
    pub pending: VecDeque<DiceRequest>,
    pub resolved: Vec<DiceRoll>,
    pub next_seed: u32,
}

#[derive(Debug, Default, Resource)]
pub struct MovementQueue {
    pub pending: Vec<(Entity, GridPosition)>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BoardCommand {
    Select(Entity),
    MoveSelectedTo(GridPosition),
}

#[derive(Debug, Default, Resource)]
pub struct BoardCommandQueue {
    pub pending: Vec<BoardCommand>,
}

#[derive(Debug, Clone, PartialEq, Eq, Resource, Default)]
pub struct DesktopPresentationState {
    pub hovered_hex: Option<GridPosition>,
    pub inspected_hex: Option<GridPosition>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct CombatantSnapshot {
    entity: Entity,
    name: &'static str,
    role: TokenRole,
    hit_points: i32,
    position: GridPosition,
    initiative: i16,
}

pub struct BttEnginePlugin;

impl Plugin for BttEnginePlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(EnginePhase::Bootstrapping)
            .insert_resource(DiceLog::default())
            .insert_resource(BoardCommandQueue::default())
            .insert_resource(MovementQueue::default())
            .add_systems(
                Startup,
                (setup_world, initialize_turn_order, mark_engine_ready).chain(),
            )
            .add_systems(
                Update,
                (apply_board_commands, apply_movement_requests, resolve_dice_requests).chain(),
            );
    }
}

pub fn build_app() -> App {
    let mut app = App::new();
    app.add_plugins(BttEnginePlugin);
    app
}

pub fn build_desktop_app() -> App {
    let mut app = App::new();
    app.insert_resource(ClearColor(Color::srgb(0.08, 0.07, 0.05)))
        .insert_resource(DesktopPresentationState::default())
        .add_plugins(DefaultPlugins.set(WindowPlugin {
            primary_window: Some(Window {
                title: "BTT Command Deck".into(),
                resolution: (1280.0, 800.0).into(),
                resizable: true,
                ..default()
            }),
            exit_condition: ExitCondition::OnPrimaryClosed,
            close_when_requested: true,
            ..default()
        }))
        .add_plugins(EguiPlugin)
        .add_plugins(BttEnginePlugin)
        .add_systems(Startup, (spawn_primary_camera, configure_ui_theme))
        .add_systems(Update, render_btt_ui.before(apply_board_commands));
    app
}

pub fn queue_token_move(app: &mut App, entity: Entity, destination: GridPosition) {
    app.world_mut()
        .resource_mut::<MovementQueue>()
        .pending
        .push((entity, destination));
}

pub fn queue_dice_roll(
    app: &mut App,
    label: impl Into<String>,
    count: u8,
    sides: u16,
    modifier: i16,
) {
    app.world_mut()
        .resource_mut::<DiceLog>()
        .pending
        .push_back(DiceRequest {
            label: label.into(),
            count,
            sides,
            modifier,
        });
}

pub fn queue_board_command(app: &mut App, command: BoardCommand) {
    app.world_mut()
        .resource_mut::<BoardCommandQueue>()
        .pending
        .push(command);
}

pub fn engine_summary(world: &World) -> String {
    let phase = world.resource::<EnginePhase>();
    let map = world.resource::<BattleMap>();
    let ruleset = world.resource::<Ruleset>();
    let journal = world.resource::<Journal>();
    let network = world.resource::<NetworkState>();
    let turn_order = world.resource::<TurnOrder>();
    let dice_log = world.resource::<DiceLog>();

    format!(
        "{:?} BTT session on {} ({:?} {}x{}) with {} combatants, {} rules, {} journal entries, {} connected players, and {} resolved dice rolls",
        *phase,
        map.name,
        map.grid,
        map.width,
        map.height,
        turn_order.combatants.len(),
        ruleset.actions.len(),
        journal.entries.len(),
        network.players.len(),
        dice_log.resolved.len(),
    )
}

fn spawn_primary_camera(mut commands: Commands) {
    commands.spawn(Camera2d);
}

fn configure_ui_theme(mut contexts: EguiContexts) {
    let ctx = contexts.ctx_mut();
    let mut visuals = egui::Visuals::light();
    visuals.window_fill = egui::Color32::from_rgb(247, 240, 226);
    visuals.panel_fill = egui::Color32::from_rgb(239, 230, 213);
    visuals.widgets.noninteractive.bg_fill = egui::Color32::from_rgb(224, 210, 186);
    visuals.widgets.inactive.bg_fill = egui::Color32::from_rgb(197, 112, 63);
    visuals.widgets.hovered.bg_fill = egui::Color32::from_rgb(173, 89, 42);
    visuals.widgets.active.bg_fill = egui::Color32::from_rgb(122, 58, 27);
    visuals.selection.bg_fill = egui::Color32::from_rgb(113, 75, 53);
    ctx.set_visuals(visuals);

    let mut style = (*ctx.style()).clone();
    style.spacing.item_spacing = egui::vec2(10.0, 8.0);
    style.spacing.window_margin = egui::Margin::same(14.0);
    style.spacing.button_padding = egui::vec2(10.0, 6.0);
    ctx.set_style(style);
}

fn render_btt_ui(
    mut contexts: EguiContexts,
    mut presentation: ResMut<DesktopPresentationState>,
    phase: Res<EnginePhase>,
    map: Res<BattleMap>,
    ruleset: Res<Ruleset>,
    journal: Res<Journal>,
    network: Res<NetworkState>,
    save_state: Res<SaveState>,
    selection: Res<SelectionState>,
    turn_order: Res<TurnOrder>,
    dice_log: Res<DiceLog>,
    mut board_commands: ResMut<BoardCommandQueue>,
    tokens: Query<(Entity, &Token, &GridPosition, &Initiative)>,
) {
    let ctx = contexts.ctx_mut();
    let mut combatants = tokens
        .iter()
        .map(|(entity, token, position, initiative)| CombatantSnapshot {
            entity,
            name: token.name,
            role: token.role,
            hit_points: token.hit_points,
            position: *position,
            initiative: initiative.0,
        })
        .collect::<Vec<_>>();
    combatants.sort_by_key(|combatant| Reverse(combatant.initiative));

    let active_name = turn_order
        .combatants
        .get(turn_order.active_index)
        .and_then(|entity| {
            combatants
                .iter()
                .find(|combatant| combatant.entity == *entity)
                .map(|combatant| combatant.name)
        })
        .unwrap_or("None");
    let selected_name = selection
        .selected
        .and_then(|entity| {
            combatants
                .iter()
                .find(|combatant| combatant.entity == entity)
                .map(|combatant| combatant.name)
        })
        .unwrap_or("None");

    egui::TopBottomPanel::top("btt_header")
        .exact_height(84.0)
        .show(ctx, |ui| {
            ui.horizontal(|ui| {
                ui.heading("BTT Command Deck");
                ui.separator();
                ui.label(format!("Map: {}", map.name));
                ui.separator();
                ui.label(format!("Phase: {:?}", *phase));
                ui.separator();
                ui.label(format!("Round {}", turn_order.round));
            });
            ui.add_space(6.0);
            ui.label(format!(
                "{} players connected, {} actions loaded, {} journal entries",
                network.players.len(),
                ruleset.actions.len(),
                journal.entries.len(),
            ));
        });

    egui::SidePanel::left("btt_sidebar")
        .default_width(300.0)
        .resizable(false)
        .show(ctx, |ui| {
            ui.heading("Session");
            ui.label(format!("Mode: {:?}", network.mode));
            ui.label(format!("GM: {}", network.gm));
            ui.label(format!("Grid: {:?} {}x{}", map.grid, map.width, map.height));
            ui.label(format!("Active Combatant: {}", active_name));
            ui.label(format!("Selected: {}", selected_name));
            ui.label(format!("Last Measured Move: {}", selection.last_moved_distance));
            ui.label(format!("Autosave Slot: {}", save_state.autosave_slot));
            ui.label(format!("Dirty State: {}", save_state.dirty));

            ui.add_space(12.0);
            ui.heading("Rules");
            for action in &ruleset.actions {
                ui.group(|ui| {
                    ui.strong(format!("{} [{}]", action.name, action.dice));
                    ui.label(action.description);
                });
            }

            ui.add_space(12.0);
            ui.heading("Journal");
            for entry in &journal.entries {
                ui.collapsing(entry.title, |ui| {
                    ui.label(entry.body);
                });
            }
        });

    egui::CentralPanel::default().show(ctx, |ui| {
        ui.heading("Board");
        ui.add_space(8.0);
        ui.label("Click a token to select it, then click an open hex to move the selected token.");
        ui.label(format!(
            "Hovered Hex: {}",
            presentation
                .hovered_hex
                .map(format_grid_position)
                .unwrap_or_else(|| "None".to_string())
        ));
        ui.label(format!(
            "Last Clicked Hex: {}",
            presentation
                .inspected_hex
                .map(format_grid_position)
                .unwrap_or_else(|| "None".to_string())
        ));
        ui.add_space(8.0);

        let board_height = ui.available_height().min(460.0).max(320.0);
        let (board_rect, board_response) = ui.allocate_exact_size(
            egui::vec2(ui.available_width(), board_height),
            egui::Sense::click(),
        );
        let painter = ui.painter_at(board_rect);
        painter.rect_filled(board_rect, 18.0, egui::Color32::from_rgb(76, 59, 47));

        let board_center = board_center_hex(selection.selected, &combatants);
        draw_board_tiles(
            &painter,
            board_rect,
            board_center,
            &combatants,
            &selection,
            &presentation,
        );

        if let Some(pointer_position) = board_response.hover_pos() {
            let hovered_hex = screen_to_grid_position(pointer_position, board_rect, board_center);
            presentation.hovered_hex =
                board_is_visible(board_center, hovered_hex).then_some(hovered_hex);
        } else {
            presentation.hovered_hex = None;
        }

        if board_response.clicked() {
            if let Some(pointer_position) = board_response.interact_pointer_pos() {
                let clicked_hex = screen_to_grid_position(pointer_position, board_rect, board_center);
                if board_is_visible(board_center, clicked_hex) {
                    presentation.inspected_hex = Some(clicked_hex);
                    let occupant = combatants
                        .iter()
                        .find(|combatant| combatant.position == clicked_hex)
                        .map(|combatant| combatant.entity);
                    if let Some(command) =
                        board_command_for_click(selection.selected, occupant, clicked_hex)
                    {
                        board_commands.pending.push(command);
                    }
                }
            }
        }

        ui.add_space(16.0);
        ui.heading("Combatants");
        ui.add_space(8.0);

        egui::Grid::new("combatants_grid")
            .num_columns(5)
            .striped(true)
            .spacing(egui::vec2(18.0, 10.0))
            .show(ui, |ui| {
                ui.strong("Name");
                ui.strong("Role");
                ui.strong("HP");
                ui.strong("Initiative");
                ui.strong("Hex");
                ui.end_row();

                for combatant in &combatants {
                    let mut name = combatant.name.to_string();
                    if Some(combatant.entity) == selection.selected {
                        name.push_str("  <selected>");
                    }

                    ui.label(name);
                    ui.label(token_role_label(combatant.role));
                    ui.label(combatant.hit_points.to_string());
                    ui.label(combatant.initiative.to_string());
                    ui.label(format_grid_position(combatant.position));
                    ui.end_row();
                }
            });

        ui.add_space(16.0);
        ui.heading("Dice Log");
        if dice_log.resolved.is_empty() {
            ui.label("No dice have been rolled yet.");
        } else {
            for roll in dice_log.resolved.iter().rev() {
                ui.label(format!(
                    "{} => {:?} {:+} = {}",
                    roll.label, roll.rolls, roll.modifier, roll.total
                ));
            }
        }
    });
}

fn token_role_label(role: TokenRole) -> &'static str {
    match role {
        TokenRole::Player => "Player",
        TokenRole::Npc => "NPC",
    }
}

fn setup_world(mut commands: Commands) {
    let hero = commands
        .spawn((
            Token {
                name: "Seren",
                role: TokenRole::Player,
                hit_points: 24,
            },
            GridPosition::new(0, 0),
            Initiative(15),
        ))
        .id();

    commands.spawn((
        Token {
            name: "Goblin Skirmisher",
            role: TokenRole::Npc,
            hit_points: 12,
        },
        GridPosition::new(2, -1),
        Initiative(10),
    ));

    commands.insert_resource(Ruleset {
        system: "BTT Adventure",
        actions: vec![
            ActionRule {
                name: "Strike",
                dice: "1d20+5",
                description: "Single target melee attack",
            },
            ActionRule {
                name: "Fire Bolt",
                dice: "1d20+4",
                description: "Ranged spell attack",
            },
        ],
    });
    commands.insert_resource(Journal {
        entries: vec![JournalEntry {
            title: "Session Zero",
            body: "The party enters Ember Keep and prepares for the first encounter.",
        }],
    });
    commands.insert_resource(BattleMap {
        name: "Ember Keep",
        grid: GridKind::Hex,
        width: 30,
        height: 20,
    });
    commands.insert_resource(CameraState {
        mode: CameraMode::Orbit3d,
        zoom_percent: 100,
    });
    commands.insert_resource(NetworkState {
        mode: SessionMode::Local,
        gm: "GM",
        players: vec!["Seren"],
    });
    commands.insert_resource(SaveState {
        autosave_slot: "autosave-1",
        autosave_enabled: true,
        dirty: false,
    });
    commands.insert_resource(SelectionState {
        selected: Some(hero),
        last_moved_distance: 0,
    });
}

fn initialize_turn_order(mut commands: Commands, query: Query<(Entity, &Initiative), With<Token>>) {
    let mut combatants = query
        .iter()
        .map(|(entity, initiative)| (entity, initiative.0))
        .collect::<Vec<_>>();
    combatants.sort_by_key(|(_, initiative)| Reverse(*initiative));

    commands.insert_resource(TurnOrder {
        round: 1,
        active_index: 0,
        combatants: combatants.into_iter().map(|(entity, _)| entity).collect(),
    });
}

fn mark_engine_ready(mut phase: ResMut<EnginePhase>) {
    *phase = EnginePhase::Running;
}

fn apply_board_commands(
    mut commands: ResMut<BoardCommandQueue>,
    mut selection: ResMut<SelectionState>,
    mut movement: ResMut<MovementQueue>,
    tokens: Query<(), With<Token>>,
) {
    for command in mem::take(&mut commands.pending) {
        match command {
            BoardCommand::Select(entity) if tokens.contains(entity) => {
                selection.selected = Some(entity);
                selection.last_moved_distance = 0;
            }
            BoardCommand::MoveSelectedTo(destination) => {
                if let Some(entity) = selection.selected {
                    movement.pending.push((entity, destination));
                }
            }
            _ => {}
        }
    }
}

fn apply_movement_requests(
    mut queue: ResMut<MovementQueue>,
    mut selection: ResMut<SelectionState>,
    mut save_state: ResMut<SaveState>,
    mut positions: Query<&mut GridPosition>,
) {
    let pending = mem::take(&mut queue.pending);
    let original_selection = selection.selected;
    let mut moved_entity = None;
    let mut last_moved_distance = 0;
    let mut multiple_entities_moved = false;

    for (entity, destination) in pending {
        if let Ok(mut position) = positions.get_mut(entity) {
            let move_distance = position.distance_to(destination);
            *position = destination;
            match moved_entity {
                Some(previous_entity) if previous_entity == entity => {
                    last_moved_distance += move_distance;
                }
                Some(_) => {
                    multiple_entities_moved = true;
                    moved_entity = Some(entity);
                    last_moved_distance = move_distance;
                }
                None => {
                    moved_entity = Some(entity);
                    last_moved_distance = move_distance;
                }
            }
            save_state.dirty = true;
        }
    }

    if multiple_entities_moved {
        selection.selected = original_selection;
        selection.last_moved_distance = 0;
    } else if let Some(moved_entity) = moved_entity {
        selection.last_moved_distance = last_moved_distance;
        selection.selected = Some(moved_entity);
    }
}

fn resolve_dice_requests(mut dice_log: ResMut<DiceLog>, mut save_state: ResMut<SaveState>) {
    let pending = mem::take(&mut dice_log.pending);
    if pending.is_empty() {
        return;
    }

    for request in pending {
        let rolls = if request.count == 0 || request.sides == 0 {
            Vec::new()
        } else {
            (0..request.count)
                .map(|_| roll_die(&mut dice_log.next_seed, request.sides))
                .collect::<Vec<_>>()
        };
        let total = if rolls.is_empty() {
            i32::from(request.modifier)
        } else {
            rolls.iter().copied().map(i32::from).sum::<i32>() + i32::from(request.modifier)
        };

        dice_log.resolved.push(DiceRoll {
            label: request.label,
            rolls,
            modifier: request.modifier,
            total,
        });
    }

    save_state.dirty = true;
}

fn board_center_hex(selected: Option<Entity>, combatants: &[CombatantSnapshot]) -> GridPosition {
    selected
        .and_then(|entity| {
            combatants
                .iter()
                .find(|combatant| combatant.entity == entity)
                .map(|combatant| combatant.position)
        })
        .or_else(|| combatants.first().map(|combatant| combatant.position))
        .unwrap_or(GridPosition::new(0, 0))
}

fn board_command_for_click(
    selected: Option<Entity>,
    occupant: Option<Entity>,
    clicked_hex: GridPosition,
) -> Option<BoardCommand> {
    occupant
        .map(BoardCommand::Select)
        .or_else(|| selected.map(|_| BoardCommand::MoveSelectedTo(clicked_hex)))
}

fn board_is_visible(center: GridPosition, hex: GridPosition) -> bool {
    center.distance_to(hex) <= BOARD_VIEW_RADIUS as u32
}

fn draw_board_tiles(
    painter: &egui::Painter,
    rect: egui::Rect,
    board_center: GridPosition,
    combatants: &[CombatantSnapshot],
    selection: &SelectionState,
    presentation: &DesktopPresentationState,
) {
    for q in (board_center.q - BOARD_VIEW_RADIUS)..=(board_center.q + BOARD_VIEW_RADIUS) {
        for r in (board_center.r - BOARD_VIEW_RADIUS)..=(board_center.r + BOARD_VIEW_RADIUS) {
            let hex = GridPosition::new(q, r);
            if !board_is_visible(board_center, hex) {
                continue;
            }

            let hex_center = grid_position_to_screen(hex, rect, board_center);
            let fill = match presentation.hovered_hex {
                Some(hovered) if hovered == hex => egui::Color32::from_rgb(120, 97, 80),
                _ => egui::Color32::from_rgb(98, 77, 62),
            };
            painter.add(egui::Shape::convex_polygon(
                hex_outline_points(hex_center, BOARD_HEX_RADIUS),
                fill,
                egui::Stroke::new(1.0, egui::Color32::from_rgb(171, 147, 126)),
            ));
        }
    }

    for combatant in combatants {
        let center = grid_position_to_screen(combatant.position, rect, board_center);
        let fill = match combatant.role {
            TokenRole::Player => egui::Color32::from_rgb(61, 111, 176),
            TokenRole::Npc => egui::Color32::from_rgb(173, 89, 42),
        };
        let stroke = if Some(combatant.entity) == selection.selected {
            egui::Stroke::new(4.0, egui::Color32::from_rgb(255, 232, 154))
        } else {
            egui::Stroke::new(2.0, egui::Color32::from_rgb(244, 236, 223))
        };

        painter.circle_filled(center, BOARD_HEX_RADIUS * 0.46, fill);
        painter.circle_stroke(center, BOARD_HEX_RADIUS * 0.46, stroke);
        painter.text(
            center,
            egui::Align2::CENTER_CENTER,
            token_initials(combatant.name),
            egui::FontId::proportional(16.0),
            egui::Color32::WHITE,
        );
        painter.text(
            egui::pos2(center.x, center.y + BOARD_HEX_RADIUS * 0.92),
            egui::Align2::CENTER_TOP,
            combatant.name,
            egui::FontId::proportional(13.0),
            egui::Color32::from_rgb(247, 240, 226),
        );
    }
}

fn grid_position_to_screen(
    position: GridPosition,
    rect: egui::Rect,
    board_center: GridPosition,
) -> egui::Pos2 {
    let relative_q = (position.q - board_center.q) as f32;
    let relative_r = (position.r - board_center.r) as f32;
    let x = BOARD_HEX_RADIUS * SQRT_3 * (relative_q + (relative_r / 2.0));
    let y = BOARD_HEX_RADIUS * 1.5 * relative_r;
    egui::pos2(rect.center().x + x, rect.center().y + y)
}

fn screen_to_grid_position(
    position: egui::Pos2,
    rect: egui::Rect,
    board_center: GridPosition,
) -> GridPosition {
    let local_x = position.x - rect.center().x;
    let local_y = position.y - rect.center().y;
    let q = ((SQRT_3 / 3.0) * local_x - (local_y / 3.0)) / BOARD_HEX_RADIUS;
    let r = ((2.0 / 3.0) * local_y) / BOARD_HEX_RADIUS;
    let rounded = round_axial_hex(q, r);
    GridPosition::new(rounded.q + board_center.q, rounded.r + board_center.r)
}

fn round_axial_hex(q: f32, r: f32) -> GridPosition {
    let s = -q - r;
    let mut rounded_q = q.round();
    let mut rounded_r = r.round();
    let rounded_s = s.round();

    let q_diff = (rounded_q - q).abs();
    let r_diff = (rounded_r - r).abs();
    let s_diff = (rounded_s - s).abs();

    if q_diff > r_diff && q_diff > s_diff {
        rounded_q = -rounded_r - rounded_s;
    } else if r_diff > s_diff {
        rounded_r = -rounded_q - rounded_s;
    }

    GridPosition::new(rounded_q as i32, rounded_r as i32)
}

fn hex_outline_points(center: egui::Pos2, radius: f32) -> Vec<egui::Pos2> {
    let half_width = radius * (SQRT_3 / 2.0);
    vec![
        egui::pos2(center.x, center.y - radius),
        egui::pos2(center.x + half_width, center.y - (radius * 0.5)),
        egui::pos2(center.x + half_width, center.y + (radius * 0.5)),
        egui::pos2(center.x, center.y + radius),
        egui::pos2(center.x - half_width, center.y + (radius * 0.5)),
        egui::pos2(center.x - half_width, center.y - (radius * 0.5)),
    ]
}

fn token_initials(name: &str) -> String {
    let initials = name
        .split_whitespace()
        .filter_map(|segment| segment.chars().next())
        .take(2)
        .collect::<String>();

    if initials.is_empty() {
        "?".to_string()
    } else {
        initials
    }
}

fn format_grid_position(position: GridPosition) -> String {
    format!("({}, {})", position.q, position.r)
}

/// Generates a deterministic die roll for the engine's runtime dice queue.
///
/// The linear congruential generator keeps the implementation dependency-free, while rejection
/// sampling avoids modulo bias for die sizes that do not evenly divide the generator range.
/// The retry count is bounded so the sampler cannot loop forever; if all retries miss the valid
/// range, the function falls back to a final modulo-based result to guarantee forward progress.
fn roll_die(next_seed: &mut u32, sides: u16) -> u16 {
    if sides == 0 {
        return 0;
    }

    let sides = u32::from(sides);
    let limit = u32::MAX - (u32::MAX % sides);

    for _ in 0..MAX_REJECTION_SAMPLING_ATTEMPTS {
        *next_seed = next_seed
            .wrapping_mul(LCG_MULTIPLIER)
            .wrapping_add(LCG_INCREMENT);

        if *next_seed < limit {
            return ((*next_seed % sides) + 1) as u16;
        }
    }

    *next_seed = next_seed
        .wrapping_mul(LCG_MULTIPLIER)
        .wrapping_add(LCG_INCREMENT);
    ((*next_seed % sides) + 1) as u16
}

#[cfg(test)]
mod tests {
    use super::{
        BattleMap, BoardCommand, DiceLog, EnginePhase, GridKind, GridPosition, SaveState,
        SelectionState, Token, TurnOrder, build_app, queue_board_command, queue_dice_roll,
        queue_token_move,
    };
    use bevy::prelude::{App, Entity};

    fn entity_named(app: &mut App, name: &str) -> Entity {
        let mut query = app.world_mut().query::<(Entity, &Token)>();
        query
            .iter(app.world())
            .find_map(|(entity, token)| (token.name == name).then_some(entity))
            .expect("token should exist")
    }

    #[test]
    fn bootstrap_creates_a_running_tabletop_session() {
        let mut app = build_app();

        app.update();

        let phase = app.world().resource::<EnginePhase>();
        let map = app.world().resource::<BattleMap>();
        let turn_order = app.world().resource::<TurnOrder>();
        let selection = app.world().resource::<SelectionState>();

        assert_eq!(*phase, EnginePhase::Running);
        assert_eq!(map.grid, GridKind::Hex);
        assert_eq!(map.name, "Ember Keep");
        assert_eq!(turn_order.round, 1);
        assert_eq!(turn_order.combatants.len(), 2);
        assert!(selection.selected.is_some());
        assert_eq!(selection.last_moved_distance, 0);
    }

    #[test]
    fn queued_moves_update_token_positions_and_distance_measurement() {
        let mut app = build_app();
        app.update();

        let hero = entity_named(&mut app, "Seren");
        queue_token_move(&mut app, hero, GridPosition::new(2, -2));

        app.update();

        let selection = app.world().resource::<SelectionState>();
        let save_state = app.world().resource::<SaveState>();
        let position = app.world().entity(hero).get::<GridPosition>().unwrap();

        assert_eq!(*position, GridPosition::new(2, -2));
        assert_eq!(selection.selected, Some(hero));
        assert_eq!(selection.last_moved_distance, 2);
        assert!(save_state.dirty);
    }

    #[test]
    fn multiple_queued_moves_accumulate_the_measured_path() {
        let mut app = build_app();
        app.update();

        let hero = entity_named(&mut app, "Seren");
        queue_token_move(&mut app, hero, GridPosition::new(1, 0));
        queue_token_move(&mut app, hero, GridPosition::new(2, -1));

        app.update();

        let selection = app.world().resource::<SelectionState>();
        let position = app.world().entity(hero).get::<GridPosition>().unwrap();

        assert_eq!(*position, GridPosition::new(2, -1));
        assert_eq!(selection.last_moved_distance, 2);
    }

    #[test]
    fn moving_multiple_entities_keeps_the_existing_selection_summary() {
        let mut app = build_app();
        app.update();

        let hero = entity_named(&mut app, "Seren");
        let goblin = entity_named(&mut app, "Goblin Skirmisher");

        queue_token_move(&mut app, hero, GridPosition::new(1, 0));
        queue_token_move(&mut app, goblin, GridPosition::new(3, -1));

        app.update();

        let selection = app.world().resource::<SelectionState>();
        let hero_position = app.world().entity(hero).get::<GridPosition>().unwrap();
        let goblin_position = app.world().entity(goblin).get::<GridPosition>().unwrap();

        assert_eq!(selection.selected, Some(hero));
        assert_eq!(selection.last_moved_distance, 0);
        assert_eq!(*hero_position, GridPosition::new(1, 0));
        assert_eq!(*goblin_position, GridPosition::new(3, -1));
    }

    #[test]
    fn queued_dice_rolls_are_resolved_into_history() {
        let mut app = build_app();
        app.update();

        queue_dice_roll(&mut app, "initiative", 2, 6, 1);
        queue_dice_roll(&mut app, "penalty", 1, 4, -1);

        app.update();

        let dice_log = app.world().resource::<DiceLog>();

        assert_eq!(dice_log.pending.len(), 0);
        assert_eq!(dice_log.resolved.len(), 2);
        assert!(
            dice_log.resolved[0]
                .rolls
                .iter()
                .all(|roll| (1..=6).contains(roll))
        );
        assert_eq!(
            dice_log.resolved[0].total,
            dice_log.resolved[0]
                .rolls
                .iter()
                .copied()
                .map(i32::from)
                .sum::<i32>()
                + i32::from(dice_log.resolved[0].modifier)
        );
        assert!(
            dice_log.resolved[1]
                .rolls
                .iter()
                .all(|roll| (1..=4).contains(roll))
        );
        assert_eq!(
            dice_log.resolved[1].total,
            i32::from(dice_log.resolved[1].rolls[0]) - 1
        );
    }

    #[test]
    fn board_selection_commands_update_the_selected_token() {
        let mut app = build_app();
        app.update();

        let goblin = entity_named(&mut app, "Goblin Skirmisher");
        queue_board_command(&mut app, BoardCommand::Select(goblin));

        app.update();

        let selection = app.world().resource::<SelectionState>();
        assert_eq!(selection.selected, Some(goblin));
        assert_eq!(selection.last_moved_distance, 0);
    }

    #[test]
    fn board_move_commands_route_the_selected_token_through_the_engine_queue() {
        let mut app = build_app();
        app.update();

        let hero = entity_named(&mut app, "Seren");
        queue_board_command(&mut app, BoardCommand::MoveSelectedTo(GridPosition::new(1, -1)));

        app.update();

        let selection = app.world().resource::<SelectionState>();
        let save_state = app.world().resource::<SaveState>();
        let position = app.world().entity(hero).get::<GridPosition>().unwrap();

        assert_eq!(*position, GridPosition::new(1, -1));
        assert_eq!(selection.selected, Some(hero));
        assert_eq!(selection.last_moved_distance, 1);
        assert!(save_state.dirty);
    }
}
