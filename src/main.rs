use btt::{build_app, engine_summary};

fn main() {
    let mut app = build_app();
    app.update();

    println!("{}", engine_summary(app.world()));
}
