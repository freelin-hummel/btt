use bevy_app::{App, Plugin, Startup, Update};
use bevy_ecs::prelude::*;
use std::{
    cmp::Reverse,
    collections::{HashMap, VecDeque},
    mem,
};

const MAX_REJECTION_SAMPLING_ATTEMPTS: usize = 8;
const LCG_MULTIPLIER: u32 = 1_664_525;
const LCG_INCREMENT: u32 = 1_013_904_223;

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
    Adversary,
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
    pub measured_distance: u32,
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

pub struct BttEnginePlugin;

impl Plugin for BttEnginePlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(EnginePhase::Bootstrapping)
            .insert_resource(DiceLog::default())
            .insert_resource(MovementQueue::default())
            .add_systems(
                Startup,
                (setup_world, initialize_turn_order, mark_engine_ready).chain(),
            )
            .add_systems(Update, (apply_movement_requests, resolve_dice_requests));
    }
}

pub fn build_app() -> App {
    let mut app = App::new();
    app.add_plugins(BttEnginePlugin);
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
            role: TokenRole::Adversary,
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
        measured_distance: 0,
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

fn apply_movement_requests(
    mut queue: ResMut<MovementQueue>,
    mut selection: ResMut<SelectionState>,
    mut save_state: ResMut<SaveState>,
    mut positions: Query<&mut GridPosition>,
) {
    let pending = mem::take(&mut queue.pending);
    let mut distance_by_entity = HashMap::new();
    let mut moved_entity = None;

    for (entity, destination) in pending {
        if let Ok(mut position) = positions.get_mut(entity) {
            *distance_by_entity.entry(entity).or_insert(0) += position.distance_to(destination);
            *position = destination;
            moved_entity = Some(entity);
            save_state.dirty = true;
        }
    }

    if let Some(moved_entity) = moved_entity {
        selection.measured_distance = *distance_by_entity.get(&moved_entity).unwrap_or(&0);
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

/// Generates a deterministic but unbiased die roll for tests and headless engine bootstrap flows.
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
        BattleMap, DiceLog, EnginePhase, GridKind, GridPosition, SaveState, SelectionState, Token,
        TurnOrder, build_app, queue_dice_roll, queue_token_move,
    };
    use bevy_ecs::prelude::Entity;

    fn entity_named(app: &mut bevy_app::App, name: &str) -> Entity {
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
        assert_eq!(selection.measured_distance, 2);
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
        assert_eq!(selection.measured_distance, 2);
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
}
