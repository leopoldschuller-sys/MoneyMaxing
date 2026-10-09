# -*- coding: utf-8 -*-
from lib import *
import diagrams as D


def chapter3():
    s = [PageBreak()]
    s += H1("Kapitel 3 – Einrichten: Konto, Studio, erstes Projekt", "SETUP  ·  WOCHE 1")
    s.append(P("Hier legst du das Fundament. Alles ist kostenlos. Nimm dir einen Abend dafür und hake jeden Schritt ab. <b>Wichtig:</b> Roblox Studio gibt es offiziell nur für Windows und macOS (nicht für Linux/Chromebook)."))
    s.append(H2("3.1 Konto absichern"))
    s.append(step("3.1", "Roblox-Konto und Sicherheit", [
        "1. Öffne <b>roblox.com</b> und melde dich an (oder registriere dich). Nutze ein Konto, das <b>nur dir</b> gehört und dessen E-Mail du kontrollierst.",
        "2. <b>Einstellungen</b> (Zahnrad) → <b>Sicherheit</b>: <b>2-Schritt-Verifizierung</b> einschalten (Authenticator-App ist am sichersten). Danach eine Konto-PIN setzen.",
        "3. <b>E-Mail bestätigen</b> (Einstellungen → Konto-Infos).",
        "4. <b>Alters-/ID-Verifizierung</b> durchführen, falls angeboten. Für die Auszahlung (DevEx) ist sie voraussichtlich nötig ⚠ (Prüfliste F3)."]))
    s.append(callout("warn", "Gib Passwort und Verifizierungs-Codes <b>niemals</b> weiter, auch nicht an Helfer, Freelancer oder «Admins». Wer Zugriff braucht, bekommt eine <b>Rolle in deiner Gruppe</b> (3.6), nie dein Passwort."))
    s.append(H2("3.2 Roblox Studio installieren"))
    s.append(step("3.2", "Studio herunterladen und starten", [
        "1. Öffne <b>create.roblox.com</b> (der «Creator Hub») und melde dich an. Klicke auf <b>«Start Creating»</b> bzw. «Roblox Studio herunterladen».",
        "2. Installer ausführen, danach Studio starten und mit deinem Konto anmelden.",
        "3. Wähle auf der Startseite <b>«New»</b> (Neu) → Vorlage <b>«Baseplate»</b> (leere Bodenplatte).",
        "4. Blende die wichtigen Fenster ein: Tab <b>View</b> → <b>Explorer</b>, <b>Properties</b>, <b>Output</b> (und <b>Toolbox</b>). Ohne Explorer und Output arbeitest du blind."]))
    s.append(fig(318, D.d_studio, "Roblox Studio (Skizze, kein Original-Screenshot): die sechs Bereiche, die du ab jetzt ständig brauchst."))
    s.append(callout("tip", ["<b>Merke dir 4 Tasten:</b> <b>F5</b> = Spiel starten (Play) · <b>Shift+F5</b> = beenden · <b>F8</b> = Run (Server ohne Spielfigur) · <b>Strg+S</b> = speichern. Und: Immer das <b>Output-Fenster</b> offen lassen. Rote Zeilen sind Fehlermeldungen. Genau die brauchst du, wenn du mir schreibst."]))
    s.append(H2("3.3 Erstes Projekt veröffentlichen"))
    s.append(step("3.3", "Das Spiel einmal «publishen» (privat)", [
        "1. Menü <b>File → Publish to Roblox As…</b> (Datei → Als Spiel veröffentlichen).",
        "2. <b>Name:</b> Arbeitstitel. <b>Ersteller:</b> deine <b>Gruppe</b> (falls schon angelegt, sonst später umziehen). <b>Genre</b> und <b>Geräte</b> (Computer, Handy, Tablet) wählen. <b>Sichtbarkeit: Privat.</b>",
        "3. Klicke auf <b>Create</b>. Danach siehst du das Spiel im Creator Hub unter <b>Creations</b>."]))
    s.append(fig(206, D.d_publish, "Der Veröffentlichen-Dialog (Skizze). Anfangs immer privat."))
    s.append(callout("warn", "<b>Handy immer aktivieren.</b> Wenn du «Handy» abwählst, kann ein Großteil der Spieler dein Spiel nicht öffnen."))
    s.append(H2("3.4 Game Settings: der wichtigste Schalter"))
    s.append(step("3.4", "DataStore-Zugriff im Studio erlauben", [
        "1. Tab <b>Home → Game Settings</b>.",
        "2. Links <b>Security</b> öffnen. Schalter <b>«Enable Studio Access to API Services»</b> auf <b>AN</b>. Das erlaubt Speichern/Laden schon im Studio-Test.",
        "3. <b>«Allow HTTP Requests»</b> bleibt <b>AUS</b>.",
        "4. Unter <b>Basic Info</b> kannst du Name, Beschreibung, Genre und Geräte ändern. Unter <b>Permissions</b> siehst du die Sichtbarkeit (Privat/Öffentlich).",
        "5. <b>Save</b> klicken."]))
    s.append(fig(236, D.d_settings, "Game Settings → Security (Skizze). Ohne diesen Schalter speichert dein Studio-Test nichts."))
    s.append(H2("3.5 Dateien und Sicherung"))
    s += bullets(["Speichere regelmäßig mit <b>Strg+S</b>. Studio legt zusätzlich Autosaves an.",
                  "Im Creator Hub gibt es einen <b>Versionsverlauf</b> des veröffentlichten Spiels. Damit kannst du zu einer älteren Version zurück (genauen Menünamen im Creator Hub nachsehen).",
                  "Der Code dieses Handbuchs liegt zusätzlich als Dateien im Repo <font face='Mono'>game/src/</font>. Das ist deine Sicherheitskopie."])
    s.append(H2("3.6 Studio-Gruppe anlegen (empfohlen)"))
    s.append(step("3.6", "Eine Gruppe für dein Studio", [
        "1. Auf roblox.com → <b>Communities/Gruppen → Create</b>. Name = dein Studio-Name. (Die Gründung kann Robux kosten, Preis steht im Dialog.)",
        "2. Veröffentliche deine Spiele <b>unter der Gruppe</b>. Vorteile: Teamrollen, später Auszahlungs-Aufteilung, das Spiel gehört nicht einer einzelnen Person.",
        "3. Nutze die Gruppe später auch für die <b>Closed Beta</b> (Kapitel 6.2)."]))
    s.append(callout("check", "<b>Auszahlung aus Gruppen:</b> Wie Gruppen-Einnahmen ausgezahlt werden und wer dafür berechtigt sein muss, solltest du im Creator Hub nachlesen, bevor du die Gruppe zum Eigentümer machst ⚠ (Prüfliste F3)."))
    s.append(H2("3.7 Optional für Fortgeschrittene: Rojo + Git"))
    s.append(P("Wenn du später mit mir (Claude Code) im Repo arbeitest, kann Code als <b>Dateien</b> liegen und per <b>Rojo</b> ins Studio synchronisiert werden. Das Repo enthält dafür schon <font face='Mono'>game/default.project.json</font>. Für den Anfang ist es <b>nicht nötig</b>: Du kannst den Code per Copy&amp;Paste ins Studio einfügen (Kapitel 4)."))
    s.append(snippet("""rokit init                            # Toolchain-Manager (oder: aftman)
rokit add rojo-rbx/rojo               # Rojo
rojo serve game/default.project.json  # dann im Studio das Rojo-Plugin → Connect
# Versionsnummern und Befehle gegen die aktuelle Rojo-Doku prüfen"""))
    s.append(H2("3.8 Gate G-0: Fundament steht"))
    s += checks(["Konto abgesichert (2FA, E-Mail, ggf. ID-Verifizierung)", "Studio installiert, Output + Explorer sichtbar", "Baseplate-Projekt veröffentlicht (privat, Handy aktiv)",
                 "«Enable Studio Access to API Services» = AN", "Gruppe angelegt (oder bewusst später)", "Steuerberater-Termin gebucht (Kapitel 9.6)",
                 "Prüfliste F1–F7 (Kapitel 9.8) im Creator Hub nachgesehen"])
    return s


def chapter4():
    s = [PageBreak()]
    s += H1("Kapitel 4 – Das Starter-Kit einbauen", "TECHNIK  ·  WOCHE 3")
    s.append(P("Jedes erfolgreiche Spiel braucht dieselbe unsichtbare Technik: <b>sicheres Speichern</b>, <b>ein Server, der entscheidet</b>, <b>Käufe, die nie doppelt zählen</b>, <b>Anti-Spam</b>, <b>Messung</b>. Das ist langweilig, aber hier gehen Spiele kaputt. Das Starter-Kit liefert dir all das fertig. Dein Spiel kommt <b>obendrauf</b>."))
    s += H2f("4.1 Wie das Kit funktioniert", 300)
    s.append(fig(236, D.d_arch, "Die Grundregel von Roblox-Spielen: Der Server entscheidet, der Client darf nur bitten."))
    s.append(P("Als Platzhalter-Spiel enthält das Kit einen minimalen <b>Klick-Sammel-Loop</b>: SAMMELN gibt Münzen, UPGRADE macht jeden Klick wertvoller, TÄGLICH gibt eine tägliche Belohnung, «2x MÜNZEN» ist ein Game Pass. <b>Das ist nur Gerüst.</b> Wie du es durch deinen eigenen Loop ersetzt, steht in Kapitel 5.1."))
    s.append(fig(190, D.d_phone, "So sieht das Starter-Kit im Spiel aus (Skizze, Querformat-Handy)."))
    s.append(H2("4.2 Objekte anlegen"))
    s.append(P("Du legst insgesamt <b>10 Objekte</b> an und fügst Code ein. Gehe die Tabelle von oben nach unten durch. Die Reihenfolge ist egal, nur die <b>Namen müssen exakt</b> stimmen."))
    s += table([
        ["Name", "Typ", "Ort im Explorer", "Code in"],
        ["Config", "ModuleScript", "ReplicatedStorage", "Anhang A.1"],
        ["Main", "Script", "ServerScriptService", "Anhang A.2"],
        ["Services", "Folder", "ServerScriptService", "(leer, nur Ordner)"],
        ["DataService", "ModuleScript", "ServerScriptService → Services", "Anhang A.3"],
        ["Analytics", "ModuleScript", "… → Services", "Anhang A.4"],
        ["EconomyService", "ModuleScript", "… → Services", "Anhang A.5"],
        ["DailyRewards", "ModuleScript", "… → Services", "Anhang A.6"],
        ["ShopService", "ModuleScript", "… → Services", "Anhang A.7"],
        ["BetaGate", "ModuleScript", "… → Services", "Anhang A.8"],
        ["Client", "LocalScript", "StarterPlayer → StarterPlayerScripts", "Anhang A.9"]],
        [0.2, 0.18, 0.4, 0.22], first_col_bold=True)
    s.append(fig(262, D.d_explorer, "So soll dein Explorer aussehen, wenn alles angelegt ist (Skizze)."))
    s.append(step("4.2", "Ein Objekt anlegen: so geht's", [
        "1. Im <b>Explorer</b> mit der Maus über den Dienst fahren (z. B. <b>ServerScriptService</b>) → rechts erscheint ein kleines <b>«+»</b>.",
        "2. Typ wählen (<b>Script</b>, <b>ModuleScript</b>, <b>LocalScript</b> oder <b>Folder</b>).",
        "3. Neues Objekt anklicken, <b>F2</b> drücken, Namen eintippen, Enter.",
        "4. <b>Doppelklick</b> öffnet den Editor. Alles markieren (<b>Strg+A</b>), alten Beispielcode löschen, neuen Code einfügen (<b>Strg+V</b>).",
        "5. <b>Strg+S</b>."]))
    s.append(callout("tip", "<b>Code kopieren:</b> Du findest jeden Code-Block in Anhang A dieses PDFs <b>und</b> als fertige Dateien im Repo unter <font face='Mono'>game/src/</font>. Am zuverlässigsten ist die Datei (PDF-Kopien können Zeilenumbrüche verändern; Luau stört das normalerweise nicht). Du kannst mich auch bitten, dir die Dateien einzeln im Chat auszugeben."))
    s.append(H2("4.3 Der erste Test"))
    s.append(step("4.3", "Spiel starten und prüfen", [
        "1. Tab <b>Test → Play</b> (oder <b>F5</b>). Du siehst die Oberfläche des Kits.",
        "2. Im <b>Output</b> muss stehen: <font face='Mono'>[Main] Server gestartet.</font>",
        "3. Tippe auf <b>SAMMELN</b>: Münzen steigen. Kaufe ein <b>UPGRADE</b> (kostet 10): jeder Klick bringt jetzt mehr. Tippe auf <b>TÄGLICH</b>: +50 Münzen, danach grau («MORGEN»).",
        "4. Beende mit <b>Stop</b>. Starte erneut (F5): <b>Münzen und Level sind noch da</b> (wenn Kapitel 3.4 erledigt ist).",
        "5. Ohne API-Zugriff steht im Output eine Warnung <font face='Mono'>Testmodus OHNE Speichern</font>. Das ist gewollt und zeigt dir, dass der Schalter aus ist."]))
    s += table([["Du siehst …", "Das bedeutet", "Lösung"],
                ["«Infinite yield possible on ReplicatedStorage:WaitForChild('Config')»", "Objekt «Config» fehlt oder heißt anders.", "Name/Ort prüfen (Abb. Explorer), Groß/Klein beachten."],
                ["«Services is not a valid member of …»", "Ordner «Services» fehlt unter ServerScriptService.", "Ordner anlegen, Module hineinziehen."],
                ["Buttons erscheinen, Klick tut nichts", "Server-Script «Main» fehlt/Fehler oder Remotes fehlen.", "Output nach roten Zeilen durchsuchen; Main muss ein <b>Script</b> (kein LocalScript) sein."],
                ["Keine Oberfläche", "«Client» ist falsch platziert oder kein LocalScript.", "Muss unter StarterPlayer → StarterPlayerScripts liegen."],
                ["«Testmodus OHNE Speichern»", "API-Zugriff im Studio aus.", "Kapitel 3.4, danach Studio neu starten."],
                ["Rote Zeile mit «attempt to index nil»", "Ein Objekt wird nicht gefunden.", "Zeile mit Dateiname + Zahl kopieren und mir schicken."]],
                [0.34, 0.33, 0.33])
    s.append(H2("4.4 Mehrspieler-Test (wichtig!)"))
    s.append(step("4.4", "Mit mehreren Spielern testen", [
        "1. Tab <b>Test → Clients and Servers</b>: <b>Local Server</b>, Spieleranzahl <b>2</b>, <b>Start</b>. Es öffnen sich ein Server- und zwei Spielerfenster.",
        "2. In beiden Fenstern sammeln, upgraden. Prüfe: Jeder sieht nur <b>seine eigenen</b> Münzen; die Rangliste oben rechts zeigt beide.",
        "3. Ein Spielerfenster schließen und neu starten: Stand bleibt erhalten."]))
    s.append(H2("4.5 Käufe einrichten (Game Pass und Developer Product)"))
    s.append(P("Der Unterschied: Ein <b>Game Pass</b> kauft man <b>einmal für immer</b> (z. B. «2x Münzen»). Ein <b>Developer Product</b> kann man <b>beliebig oft</b> kaufen (z. B. «500 Münzen»)."))
    s.append(fig(222, D.d_pass, "Einen Game Pass im Creator Hub anlegen (Skizze, Menünamen können abweichen)."))
    s += numbered([
        "Creator Hub → dein Spiel → <b>Monetarisierung</b> (Monetization) → <b>Passes</b> → <b>Create a Pass</b>: Icon, Name, Beschreibung, Preis; <b>Zum Verkauf anbieten</b> einschalten.",
        "Die <b>ID</b> (Zahl in der Adresszeile der Pass-Seite) in <font face='Mono'>Config.GAME_PASSES.DoubleCoins</font> eintragen. Gleiches für <b>Developer Products</b> in <font face='Mono'>Config.PRODUCTS.Coins500.id</font> (dort stellst du auch ein, wie viele Münzen es gibt).",
        "<b>Spiel veröffentlichen</b> (File → Publish to Roblox) und im veröffentlichten Spiel prüfen: «2x MÜNZEN» öffnet das Kaufmenü.",
        "Zum Test <b>zuerst ein Produkt mit 1–5 Robux</b> anlegen und die Abbuchung/Gutschrift kontrollieren. Ob Käufe im Studio-Test echte Robux kosten, steht in der Creator-Hub-Doku ⚠ nach, bevor du in Studio kaufst."])
    s.append(callout("warn", "<b>Nie</b> eine Belohnung auf dem Client auslösen («Kauf fertig → gib Münzen»). Das Kit vergibt Belohnungen nur im <b>Server-Callback ProcessReceipt</b> und merkt sich jede Kauf-ID, damit ein Kauf <b>nicht doppelt</b> zählt."))
    s.append(H2("4.6 Wie das Speichern funktioniert (und warum es sicher ist)"))
    s.append(P("Das Kit speichert beim Verlassen, alle 60 Sekunden, bei Käufen und beim Server-Shutdown. Jeder Spieler hat eine <b>Sitzungssperre</b>: Nur ein Server darf gleichzeitig schreiben. Das verhindert verlorene Spielstände, wenn jemand schnell den Server wechselt."))
    s.append(fig(180, D.d_lock, "Sitzungssperre: warum Spielerdaten beim Server-Wechsel nicht verloren gehen."))
    s.append(H2("4.7 Was getestet wurde (und was nicht)"))
    s.append(P("Die Server-Logik läuft in einer echten Luau-Umgebung (nicht in Roblox selbst) mit nachgebauten Roblox-Diensten. Zusätzlich habe ich <b>absichtlich 5 Fehler in den Code eingebaut</b> (z. B. Rate-Limit entfernt, Doppelkauf-Schutz entfernt) und geprüft, dass die Tests sie finden. Das tun sie."))
    s += table([["Getestet (71 Prüfungen, alle grün)", "Nicht getestet (prüfst du selbst)"],
                [["• Beitritt, Laden, Speichern, Wiederbeitritt<br/>• Auto-Save, Server-Shutdown<br/>• Server-Wechsel und Sitzungssperre, abgelaufene Sperre<br/>• DataStore-Fehler und Wiederholungen, Studio-Testmodus<br/>• Münzen, Upgrades, Rate-Limit, ungültige Werte<br/>• Käufe: keine Doppelbelohnung, Fehler beim Speichern<br/>• Game Pass (Multiplikator), tägliche Belohnung inkl. Gnadentag<br/>• Closed-Beta-Zugang"],
                 ["• Oberfläche (Client) und Layout auf echten Handys<br/>• Echte Roblox-Server, Latenz und DataStore-Limits<br/>• Kaufdialoge mit echten Robux<br/>• Analytics-Aufrufe (Namen in der Doku prüfen; sie sind absichtlich in <font face='Mono'>pcall</font>, damit nichts abstürzt)<br/>• Spielgefühl, Balance, Performance auf schwachen Geräten"]]],
                [0.5, 0.5], zebra=False)
    s.append(P("Die Tests liegen im Repo unter <font face='Mono'>game/tests/run.luau</font> (Anleitung: <font face='Mono'>game/tests/README.md</font>).", "small"))
    s.append(H2("4.8 Gate G-1b: Kit läuft"))
    s += checks(["Alle 10 Objekte angelegt, Namen stimmen", "F5-Test: «[Main] Server gestartet.», Oberfläche sichtbar", "Münzen/Level bleiben nach Stop → Play erhalten", "Mehrspieler-Test mit 2 Spielern erfolgreich",
                 "Game Pass und 1 Testprodukt angelegt, IDs in Config", "Im veröffentlichten Spiel öffnet «2x MÜNZEN» den Kaufdialog"])
    return s
