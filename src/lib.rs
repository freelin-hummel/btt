use bevy_app::{App, Plugin, Startup};
use bevy_ecs::{
    prelude::{Commands, Resource},
    system::ResMut,
};

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct CapabilityBlueprint {
    pub key: &'static str,
    pub goal: &'static str,
    pub recommended_crates: &'static [&'static str],
}

pub const ENGINE_BLUEPRINT: [CapabilityBlueprint; 8] = [
    CapabilityBlueprint {
        key: "scripting",
        goal: "runtime-configurable RPG mechanics and data-driven rulesets",
        recommended_crates: &["bevy_mod_scripting", "bevy_common_assets"],
    },
    CapabilityBlueprint {
        key: "ui",
        goal: "GM dashboards, journals, and character-sheet workflows",
        recommended_crates: &["bevy_egui", "sickle_ui"],
    },
    CapabilityBlueprint {
        key: "maps",
        goal: "square, hex, and gridless battlemap support",
        recommended_crates: &["hexx", "bevy_ecs_tilemap", "big_brain", "seldom_state"],
    },
    CapabilityBlueprint {
        key: "interaction",
        goal: "token selection, dragging, measuring, and terrain interaction",
        recommended_crates: &["bevy_mod_picking", "leafwing-input-manager"],
    },
    CapabilityBlueprint {
        key: "camera",
        goal: "tabletop-friendly pan, zoom, and orbit controls",
        recommended_crates: &["bevy_panorbit_camera", "bevy_pancam"],
    },
    CapabilityBlueprint {
        key: "dice",
        goal: "physics-based 3D dice rolling",
        recommended_crates: &["avian3d", "bevy_rapier3d"],
    },
    CapabilityBlueprint {
        key: "networking",
        goal: "multiplayer state replication for GM and player sessions",
        recommended_crates: &["bevy_replicon", "lightyear"],
    },
    CapabilityBlueprint {
        key: "persistence",
        goal: "save and restore ECS-driven world state",
        recommended_crates: &["moonshine_save"],
    },
];

#[derive(Debug, Clone, Copy, PartialEq, Eq, Resource)]
pub enum BootstrapStatus {
    Planned,
    Ready,
}

#[derive(Debug, Clone, PartialEq, Eq, Resource)]
pub struct BootstrapManifest {
    pub engine_name: &'static str,
    pub status: BootstrapStatus,
    pub capabilities: Vec<CapabilityBlueprint>,
}

impl BootstrapManifest {
    pub fn from_plan() -> Self {
        Self {
            engine_name: "BTT",
            status: BootstrapStatus::Planned,
            capabilities: ENGINE_BLUEPRINT.to_vec(),
        }
    }
}

pub struct BttEnginePlugin;

impl Plugin for BttEnginePlugin {
    fn build(&self, app: &mut App) {
        app.insert_resource(BootstrapManifest::from_plan())
            .add_systems(Startup, mark_bootstrap_ready);
    }
}

pub fn build_app() -> App {
    let mut app = App::new();
    app.add_plugins(BttEnginePlugin);
    app
}

pub fn bootstrap_summary() -> String {
    format!(
        "Bootstrapped {} engine with {} planned capabilities: {}",
        BootstrapManifest::from_plan().engine_name,
        ENGINE_BLUEPRINT.len(),
        ENGINE_BLUEPRINT
            .iter()
            .map(|capability| capability.key)
            .collect::<Vec<_>>()
            .join(", ")
    )
}

fn mark_bootstrap_ready(mut commands: Commands, mut manifest: ResMut<BootstrapManifest>) {
    manifest.status = BootstrapStatus::Ready;
    commands.insert_resource(BootstrapStatus::Ready);
}

#[cfg(test)]
mod tests {
    use super::{BootstrapManifest, BootstrapStatus, ENGINE_BLUEPRINT, build_app};

    #[test]
    fn bootstrap_manifest_matches_the_plan_blueprint() {
        let manifest = BootstrapManifest::from_plan();

        assert_eq!(manifest.capabilities, ENGINE_BLUEPRINT);
        assert_eq!(manifest.status, BootstrapStatus::Planned);
    }

    #[test]
    fn engine_plugin_marks_the_bootstrap_as_ready() {
        let mut app = build_app();

        app.update();

        let manifest = app.world().resource::<BootstrapManifest>();
        let status = app.world().resource::<BootstrapStatus>();

        assert_eq!(manifest.status, BootstrapStatus::Ready);
        assert_eq!(*status, BootstrapStatus::Ready);
        assert_eq!(manifest.capabilities.len(), ENGINE_BLUEPRINT.len());
    }
}
