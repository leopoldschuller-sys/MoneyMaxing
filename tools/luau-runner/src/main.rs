use mlua::{Lua, Result};
use std::fs;

fn main() -> Result<()> {
    let args: Vec<String> = std::env::args().collect();
    if args.len() < 2 {
        eprintln!("usage: luau_runner <script.luau>");
        std::process::exit(2);
    }
    let lua = Lua::new();
    // __load(path) -> compiled chunk (function), so tests can emulate Roblox ModuleScripts.
    let load = lua.create_function(|lua, path: String| {
        let src = fs::read_to_string(&path).map_err(mlua::Error::external)?;
        lua.load(&src).set_name(format!("={}", path)).into_function()
    })?;
    lua.globals().set("__load", load)?;
    let src = fs::read_to_string(&args[1]).expect("cannot read script");
    match lua.load(&src).set_name(format!("={}", args[1])).exec() {
        Ok(()) => Ok(()),
        Err(e) => {
            eprintln!("LUA ERROR: {}", e);
            std::process::exit(1);
        }
    }
}
