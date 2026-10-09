# Server-Tests (Luau, ohne Roblox)

`run.luau` testet die Server-Logik des Starter-Kits in einer **echten Luau-Laufzeit**.
Roblox-Dienste (DataStore, Players, MarketplaceService …) sind nachgebaut (Mocks), Zeit ist virtuell.

**Getestet:** Laden/Speichern, Auto-Save, Shutdown, Sitzungssperre (Server-Wechsel, abgelaufene Sperre),
DataStore-Fehler + Wiederholungen, Studio-Testmodus, Münzen/Upgrades/Rate-Limit, ungültige Eingaben,
Käufe (Idempotenz, Speicherfehler), Game Pass, tägliche Belohnung, Closed-Beta-Zugang, Analytics-Argumente.

**Nicht getestet:** Oberfläche (Client), echte Roblox-Server und -Limits, Kaufdialoge, Performance auf Geräten.

## Ausführen

```bash
# 1) Einmalig den Test-Runner bauen (braucht Rust + C++-Compiler)
cargo build --release --manifest-path tools/luau-runner/Cargo.toml

# 2) Tests starten (aus dem Ordner game/)
cd game
../tools/luau-runner/target/release/luau_runner tests/run.luau
```

Erwartet: `ALLE TESTS GRÜN`. Bei Fehlern steht pro fehlgeschlagener Prüfung eine `FAIL:`-Zeile.

## Syntax-Check und Formatierung (StyLua, Luau)

```bash
npx @johnnymorganz/stylua-bin --check game/src      # oder: stylua --check game/src
```
