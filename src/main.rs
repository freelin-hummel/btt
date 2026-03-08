use btt::{bootstrap_summary, build_app};

fn main() {
    let mut app = build_app();
    app.update();

    println!("{}", bootstrap_summary());
}
