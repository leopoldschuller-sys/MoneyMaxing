# -*- coding: utf-8 -*-
"""Abbildungen (Skizzen/Diagramme). Alles selbst gezeichnet - KEINE Original-Screenshots."""
import math
from lib import *


def legend(g, x, y, items, w, size=8.6, gapy=13.2, color=RED):
    """Nummerierte Legende; items = [(n, text)]."""
    cy = y
    for n, t in items:
        g.marker(x + 7, cy + 4, n, color)
        h = g.para(x + 19, cy + 6.8, w - 19, t, size, SLATE)
        cy += max(gapy, h + 2.5)
    return cy


# --------------------------------------------------------------------------- 1 Gantt
def d_gantt(g):
    W, H = g.W, g.H
    x0, x1 = 128, W - 8
    cw = (x1 - x0) / 20.0
    top = 34
    # Monate
    for wk, lab in ((1, "Okt 2026"), (4, "Nov"), (9, "Dez"), (13, "Jan 2027"), (17, "Feb")):
        x = x0 + (wk - 1) * cw
        g.line(x, 6, x, H - 6, LINE, 0.7, (2, 2))
        g.text(x + 3, 14, lab, 8, MUTE, True)
    for w in range(1, 21):
        x = x0 + (w - 1) * cw
        g.text(x + cw / 2, 28, str(w) if w < 20 else "20+", 7.2, MUTE, False, "c")
    rows = [("0  Fundament", 1, 1, BLUE, None), ("1  Idee & Konzept", 2, 3, TEAL, "G-1"), ("2  Prototyp", 4, 6, GREEN, "G-2"),
            ("3  Alpha: Inhalt & Shop", 7, 11, ORANGE, "G-3"), ("4  Closed Beta", 12, 15, PURPLE, "G-4"),
            ("5  Launch-Vorbereitung", 16, 17, RED, "G-5"), ("6  Soft → Hard Launch", 18, 19, NAVY, "G-6"),
            ("7  Live-Ops & Wachstum", 20, 20, BLUE, None), ("Marketing (parallel)", 6, 19, MUTE, None)]
    rh = (H - top - 8) / len(rows)
    for i, (lab, a, b, col, gate) in enumerate(rows):
        y = top + i * rh
        g.text(6, y + rh / 2 + 3, lab, 8.8, INK, True)
        xa, xb = x0 + (a - 1) * cw, x0 + b * cw
        if i == 8:
            g.rect(xa, y + rh / 2 - 4, xb - xa, 8, fill=colors.HexColor("#E2E8F0"), stroke=MUTE, r=3, lw=0.6)
            g.text((xa + xb) / 2, y + rh / 2 + 3, "Devlogs · Clips · Community · Creator", 7.2, SLATE, False, "c")
        else:
            g.rect(xa, y + rh / 2 - 6, xb - xa, 12, fill=col, r=3)
        if i == 7:
            g.rect(xa, y + rh / 2 - 6, x1 - xa, 12, fill=col, r=3)
            g.text(xa + cw / 2, y + rh / 2 + 3, "→", 8, WHITE, True, "c")
        if gate:
            gx = xb
            g.poly([(gx, y + rh / 2 - 8), (gx + 7, y + rh / 2), (gx, y + rh / 2 + 8), (gx - 7, y + rh / 2)], fill=ORANGE if i not in (4,) else ORANGE, stroke=WHITE, lw=1)
            g.text(gx + 10, y + rh / 2 + 3, gate, 8, ORANGE, True)
    g.text(6, H - 3, "◆ = Gate (Go / Iterieren / Stopp)   ·   Hard Launch: Mo 15.02.2027 (Woche 19)", 8, SLATE)


# --------------------------------------------------------------------------- 2 Loop
def d_loop(g):
    W, H = g.W, g.H
    cols = [("30 Sekunden", "Aktion → Belohnung", "Klick, Ernte, Treffer → Münzen,\nSound, Zahl springt hoch", "Fühlt sich EINE Aktion\nschon gut an?", BLUE),
            ("5 Minuten", "Belohnungen → Upgrade", "Erstes Upgrade, erstes Item,\nneues Teilziel sichtbar", "Gibt es nach 1–2 Min\nein neues Ziel?", TEAL),
            ("Eine Session (10–20 Min)", "Ziele → Fortschritt", "Neue Zone / Fähigkeit /\nSeltenes Item freigeschaltet", "Habe ich etwas, das ich\nmeinen Freunden zeigen will?", ORANGE),
            ("Tage & Wochen", "Serien → Gewohnheit", "Tägliche Belohnung, Sammelbuch,\nWochen-Event, Freunde", "Warum komme ich\nmorgen wieder?", PURPLE)]
    cw = (W - 3 * 10) / 4
    for i, (t, sub, ex, q, col) in enumerate(cols):
        x = i * (cw + 10)
        g.rect(x, 4, cw, H - 8, fill=WHITE, stroke=col, r=7, lw=1.4)
        g.rect(x, 4, cw, 30, fill=col, r=7)
        g.rect(x, 20, cw, 14, fill=col)
        g.text(x + cw / 2, 24, t, 9.4, WHITE, True, "c")
        g.text(x + cw / 2, 52, sub, 9.2, col, True, "c")
        g.para(x + 7, 70, cw - 14, ex, 8.4, SLATE, 10.2, anchor="l")
        g.line(x + 10, 108, x + cw - 10, 108, LINE, 0.8)
        g.text(x + 7, 122, "TESTFRAGE", 7.2, col, True)
        g.para(x + 7, 133, cw - 14, q, 8.6, INK, 10.5, True)
        if i < 3:
            g.arrow(x + cw + 1, H / 2, x + cw + 9, H / 2, MUTE, 1.2, 4)


# --------------------------------------------------------------------------- 3 Retention
def d_retention(g):
    W, H = g.W, g.H
    ox, oy, pw, ph = 40, 14, W - 60, H - 52
    g.rect(ox, oy, pw, ph, fill=BG2, stroke=LINE)
    ymax = 40.0

    def X(d): return ox + d / 28.0 * pw

    def Y(v): return oy + ph - v / ymax * ph
    for v in (0, 10, 20, 30, 40):
        g.line(ox, Y(v), ox + pw, Y(v), LINE, 0.5)
        g.text(ox - 5, Y(v) + 3, "%d %%" % v, 7.6, MUTE, False, "r")
    for d in (1, 7, 14, 21, 28):
        g.text(X(d), oy + ph + 12, "Tag %d" % d, 7.8, MUTE, False, "c")
    pts = [(1, 30), (2, 24), (3, 20), (5, 15), (7, 12), (10, 10), (14, 8), (21, 6), (28, 5)]
    for (a, b), (c2, d2) in zip(pts, pts[1:]):
        g.line(X(a), Y(b), X(c2), Y(d2), BLUE, 2.4)
    mins = {1: 25, 7: 8}
    for d, v in mins.items():
        g.rect(X(d) - 5, Y(v), 10, oy + ph - Y(v), fill=colors.HexColor("#FDE68A"), stroke=None)
        g.line(X(d) - 9, Y(v), X(d) + 9, Y(v), ORANGE, 2)
    for (d, v, lab, dx, dy) in ((1, 30, "D1 = 30 % (Ziel)  ·  Minimum 25 %", 14, -4), (7, 12, "D7 = 12 %  ·  Minimum 8 %", 12, -8), (28, 5, "D28 = 5 %", -52, -12)):
        g.circle(X(d), Y(v), 4.2, fill=BLUE, stroke=WHITE, lw=1.5)
        g.text(X(d) + dx, Y(v) + dy, lab, 8.4, NAVY, True)
    g.text(ox, H - 8, "Beispielkurve (keine Messung) – gelbe Balken = Mindestwerte aus dem Plan (Daumenregeln)", 8, MUTE)
    g.text(ox + pw, 8, "D28 zählt, weil Roblox seit 06/2026 28 Tage betrachtet", 8, TEAL, True, "r")


# --------------------------------------------------------------------------- 4 Studio
def d_studio(g):
    W = g.W
    WH = 226
    g.window(0, 0, W, WH, "Roblox Studio – dein Spiel")
    g.rect(1, 17, W - 2, 28, fill=BG)
    for i, t in enumerate(("Home", "Model", "Avatar", "UI", "Script", "Test", "View", "Plugins")):
        x = 10 + i * 52
        sel = t == "Test"
        g.text(x, 29, t, 8.6, BLUE if sel else SLATE, sel)
        if sel:
            g.line(x, 32, x + 28, 32, BLUE, 2)
    for i, (t, col) in enumerate((("Play", GREEN), ("Run", TEAL), ("Stop", RED), ("Clients & Servers", MUTE))):
        x = 10 + i * 58
        g.rect(x, 35, 44 if i < 3 else 80, 8, fill=colors.HexColor("#E2E8F0"), r=2)
        g.text(x + 2, 41.5, t, 6.6, col, True)
    g.rect(4, 48, 100, 146, fill=WHITE, stroke=LINE)
    g.text(10, 59, "Toolbox", 8.2, NAVY, True)
    for r in range(3):
        for c2 in range(3):
            g.rect(10 + c2 * 29, 66 + r * 36, 25, 30, fill=colors.HexColor("#E2E8F0"), r=3)
    vx, vy, vw, vh = 108, 48, W - 108 - 190, 108
    g.rect(vx, vy, vw, vh, fill=colors.HexColor("#BFDBFE"), stroke=LINE)
    g.poly([(vx + 4, vy + 78), (vx + vw - 4, vy + 78), (vx + vw - 30, vy + 104), (vx + 30, vy + 104)], fill=colors.HexColor("#94A3B8"))
    g.rect(vx + vw / 2 - 14, vy + 52, 28, 28, fill=ORANGE, stroke=ORANGE, r=2)
    g.text(vx + vw / 2, vy + 20, "3D-Ansicht (Viewport)", 8.4, NAVY, True, "c")
    g.rect(vx, vy + vh + 2, vw, 38, fill=INK)
    g.text(vx + 6, vy + vh + 14, "Output", 7.6, WHITE, True)
    g.text(vx + 6, vy + vh + 24, "[Main] Server gestartet.", 7.2, colors.HexColor("#86EFAC"), False, "l", True)
    g.text(vx + 6, vy + vh + 33, "Infinite yield possible on ...", 7.2, colors.HexColor("#FCA5A5"), False, "l", True)
    ex = W - 186
    g.rect(ex, 48, 182, 90, fill=WHITE, stroke=LINE)
    g.text(ex + 6, 59, "Explorer", 8.2, NAVY, True)
    for i, (t, ind) in enumerate((("Workspace", 0), ("ReplicatedStorage", 0), ("ServerScriptService", 0), ("StarterPlayer", 0), ("StarterPlayerScripts", 1))):
        g.rect(ex + 8 + ind * 10, 66 + i * 12 - 1, 6, 6, fill=BLUE_L, stroke=BLUE, lw=0.5)
        g.text(ex + 18 + ind * 10, 70 + i * 12, t, 7.6, SLATE)
    g.rect(ex, 140, 182, 54, fill=WHITE, stroke=LINE)
    g.text(ex + 6, 151, "Properties", 8.2, NAVY, True)
    for i, (a, b) in enumerate((("Name", "Main"), ("Disabled", "☐"), ("RunContext", "Legacy"))):
        g.text(ex + 8, 163 + i * 11, a, 7.6, MUTE)
        g.text(ex + 80, 163 + i * 11, b, 7.6, SLATE)
    for n, (x, y) in enumerate(((258, 29), (92, 59), (vx + vw - 14, vy + 18), (ex + 168, 58), (ex + 168, 150), (vx + vw - 14, vy + vh + 14)), start=1):
        g.marker(x, y, n)
    half = W / 2 - 6
    y1 = legend(g, 0, WH + 14, [(1, "<b>Registerkarten.</b> «Test»: Play (F5) startet dein Spiel, «Stop» beendet es. «View» blendet Fenster ein."),
                                (2, "<b>Toolbox.</b> Fertige Modelle aus dem Creator Store (Lizenz & Qualität prüfen!)."),
                                (3, "<b>Viewport.</b> Hier baust du die Welt: Mausrad = Zoom, Rechtsklick halten + WASD = fliegen.")], half)
    y2 = legend(g, W / 2 + 6, WH + 14, [(4, "<b>Explorer.</b> Baum aller Objekte. Hier legst du Scripts an (Maus drauf → «+»)."),
                                        (5, "<b>Properties.</b> Einstellungen des markierten Objekts."),
                                        (6, "<b>Output.</b> Meldungen deines Codes. Rot = Fehler → genau diese Zeile schickst du mir.")], half)


# --------------------------------------------------------------------------- 5 Explorer-Baum
def d_explorer(g):
    W, H = g.W, g.H
    g.window(0, 0, 250, H, "Explorer (so soll es bei dir aussehen)")
    items = [("Workspace", 0, "svc"), ("Players", 0, "svc"), ("ReplicatedStorage", 0, "svc"), ("Config", 1, "mod"),
             ("ServerScriptService", 0, "svc"), ("Main", 1, "scr"), ("Services", 1, "fld"), ("Analytics", 2, "mod"), ("BetaGate", 2, "mod"),
             ("DailyRewards", 2, "mod"), ("DataService", 2, "mod"), ("EconomyService", 2, "mod"), ("ShopService", 2, "mod"),
             ("StarterPlayer", 0, "svc"), ("StarterPlayerScripts", 1, "svc"), ("Client", 2, "loc")]
    cols = {"svc": SLATE, "mod": PURPLE, "scr": BLUE, "fld": ORANGE, "loc": GREEN}
    rowh = 13.4
    for i, (t, lvl, k) in enumerate(items):
        y = 28 + i * rowh
        x = 12 + lvl * 16
        g.rect(x, y - 7, 8, 8, fill=cols[k], r=1.5)
        g.text(x + 13, y, t, 8.6, INK, k != "svc")
        if lvl > 0:
            g.line(x - 6, y - 3, x - 1, y - 3, LINE, 0.8)
    # rechts: Erklaerung
    rx = 268
    g.text(rx, 24, "Farben = Objekt-Typ", 9.2, NAVY, True)
    for i, (k, t) in enumerate((("scr", "Script – läuft auf dem SERVER"), ("mod", "ModuleScript – Werkzeugkasten (wird mit require geladen)"),
                                ("loc", "LocalScript – läuft auf dem Handy/PC des Spielers"), ("fld", "Folder – nur Ordner zum Sortieren"),
                                ("svc", "Dienste (Services) – bringt Roblox mit"))):
        g.rect(rx, 34 + i * 15, 8, 8, fill=cols[k], r=1.5)
        g.text(rx + 14, 42 + i * 15, t, 8.3, SLATE)
    g.rect(rx - 2, 122, W - rx - 2, 92, fill=ORANGE_L, r=6)
    g.text(rx + 8, 138, "Merke dir 3 Regeln", 9.2, ORANGE, True)
    g.para(rx + 8, 150, W - rx - 22, "1. Geheimes & Wichtiges (Daten, Käufe) nur in ServerScriptService –\n    der Spieler kann diesen Ordner NIE lesen.\n2. Config liegt in ReplicatedStorage, weil Server UND Client sie lesen.\n3. Den Ordner «Remotes» legt Main beim Start selbst an.", 8.4, INK, 10.3)
    g.rect(rx - 2, 222, W - rx - 2, H - 224, fill=BLUE_L, r=6)
    g.para(rx + 8, 238, W - rx - 22, "Namen müssen EXAKT stimmen (Groß/Klein): «DataService», nicht «dataservice».", 8.4, INK, 10.3, True)


# --------------------------------------------------------------------------- 6 Publish
def d_publish(g):
    W, H = g.W, g.H
    bw = 300
    g.window(0, 0, bw, H, "Publish Game to Roblox  (Datei → Publish to Roblox As…)")
    fields = [("Name", "Mein Spiel (Arbeitstitel)"), ("Beschreibung", "Kurz & klar – später änderbar"), ("Ersteller", "Du  ▾   (oder deine Gruppe)"),
              ("Genre", "All / Abenteuer / …  ▾")]
    for i, (a, b) in enumerate(fields):
        y = 30 + i * 30
        g.text(10, y + 11, a, 8.4, MUTE, True)
        g.rect(86, y, bw - 96, 20, fill=BG2, stroke=LINE, r=3)
        g.text(92, y + 13.5, b, 8.4, SLATE)
    g.text(10, 156, "Geräte", 8.4, MUTE, True)
    for i, t in enumerate(("Computer", "Handy", "Tablet", "Konsole")):
        g.rect(86 + i * 52, 148, 8, 8, fill=GREEN if i < 3 else WHITE, stroke=GREEN, r=1.5)
        g.text(98 + i * 52, 156, t, 8, SLATE)
    g.text(10, 178, "Sichtbarkeit", 8.4, MUTE, True)
    g.circle(92, 175, 4, fill=GREEN, stroke=GREEN); g.text(100, 178, "Privat (nur du)", 8.4, SLATE, True)
    g.circle(190, 175, 4, fill=WHITE, stroke=MUTE); g.text(198, 178, "Öffentlich", 8.4, SLATE)
    g.rect(bw - 96, H - 28, 86, 20, fill=BLUE, r=4); g.text(bw - 53, H - 14.5, "Create", 9, WHITE, True, "c")
    for n, (x, y) in enumerate(((78, 41), (78, 131), (78, 71), (78, 176)), start=1):
        pass
    g.marker(80, 41, 1); g.marker(80, 101, 2); g.marker(80, 152, 3); g.marker(80, 176, 4)
    legend(g, bw + 14, 8, [(1, "<b>Name:</b> Arbeitstitel reicht. Ändern ist später jederzeit möglich."),
                           (2, "<b>Ersteller:</b> Besser gleich die <b>Gruppe</b> wählen (Team, spätere Auszahlungs-Aufteilung)."),
                           (3, "<b>Geräte:</b> Handy IMMER anhaken – dort spielt der Großteil."),
                           (4, "<b>Sichtbarkeit:</b> Anfangs <b>Privat</b>. Öffentlich erst ab Soft Launch (Woche 18).")], W - bw - 20, 9, 14)


# --------------------------------------------------------------------------- 7 Game Settings
def d_settings(g):
    W = g.W
    WH = 180
    g.window(0, 0, W, WH, "Game Settings (Home → Game Settings)")
    g.rect(1, 17, 118, WH - 18, fill=BG)
    for i, t in enumerate(("Basic Info", "Permissions", "Monetization", "Security", "Avatar", "Places", "Localization")):
        sel = t == "Security"
        if sel:
            g.rect(4, 26 + i * 21, 112, 17, fill=BLUE_L, r=3)
        g.text(12, 38 + i * 21, t, 8.8, BLUE if sel else SLATE, sel)
    px = 134
    g.text(px, 38, "Security", 11, NAVY, True)
    g.line(px, 44, W - 12, 44, LINE, 1)
    g.text(px, 66, "Enable Studio Access to API Services", 9.4, INK, True)
    g.para(px, 78, W - px - 90, "Erlaubt DataStores & Co. im Studio-Test. Ohne diesen Schalter wird im Studio NICHT gespeichert.", 8.2, MUTE, 10)
    g.rect(W - 62, 56, 42, 20, fill=GREEN, r=10); g.circle(W - 30, 66, 8, fill=WHITE); g.text(W - 46, 69.5, "AN", 7.4, WHITE, True, "c")
    g.text(px, 112, "Allow HTTP Requests", 9.4, INK, True)
    g.para(px, 124, W - px - 90, "Lass das AUS, solange du keinen eigenen Webserver anbindest.", 8.2, MUTE, 10)
    g.rect(W - 62, 102, 42, 20, fill=colors.HexColor("#94A3B8"), r=10); g.circle(W - 52, 112, 8, fill=WHITE); g.text(W - 34, 115.5, "AUS", 7.4, WHITE, True, "c")
    g.rect(px, 142, W - px - 12, 30, fill=ORANGE_L, r=5)
    g.para(px + 8, 155, W - px - 28, "Danach «Save» klicken – erst dann gelten die Schalter.", 8.6, INK, 10.5, True)
    g.marker(112, 38 + 3 * 21 - 4, 1); g.marker(W - 70, 66, 2); g.marker(W - 70, 112, 3)
    legend(g, 0, WH + 12, [(1, "Menüpunkt <b>Security</b> in der linken Spalte öffnen."),
                           (2, "Schalter <b>AN</b>: dann funktionieren Speichern/Laden schon im Studio-Test."),
                           (3, "HTTP-Requests <b>AUS</b> lassen.")], W, 9)


# --------------------------------------------------------------------------- 8 Pass-Formular
def d_pass(g):
    W = g.W
    WH = 150
    g.window(0, 0, W, WH, "Creator Hub → dein Spiel → Monetarisierung → Passes → Create (Menünamen können abweichen)", NAVY)
    g.rect(1, 17, 100, WH - 18, fill=BG)
    for i, t in enumerate(("Übersicht", "Analytics", "Monetarisierung", "Einstellungen")):
        g.text(10, 36 + i * 20, t, 8.6, BLUE if i == 2 else SLATE, i == 2)
    fx = 118
    g.rect(fx, 30, 70, 70, fill=BG, stroke=LINE, dash=(3, 2), r=5)
    g.text(fx + 35, 62, "Icon", 8.6, MUTE, True, "c"); g.text(fx + 35, 73, "512×512", 7.4, MUTE, False, "c")
    for i, (a, b) in enumerate((("Name", "2x Münzen"), ("Beschreibung", "Doppelte Münzen – für immer."), ("Preis (Robux)", "199"))):
        y = 26 + i * 30
        g.text(fx + 104, y + 8, a, 8, MUTE, True)
        g.rect(fx + 84, y + 12, W - fx - 98, 16, fill=BG2, stroke=LINE, r=3)
        g.text(fx + 90, y + 24, b, 8.4, SLATE)
    g.text(fx, 124, "Zum Verkauf anbieten", 8.8, INK, True)
    g.rect(fx + 112, 114, 38, 18, fill=GREEN, r=9); g.circle(fx + 140, 123, 7, fill=WHITE)
    g.rect(W - 110, WH - 30, 98, 20, fill=BLUE, r=4); g.text(W - 61, WH - 16.5, "Save / Create", 8.8, WHITE, True, "c")
    g.marker(fx + 6, 38, 1); g.marker(fx + 76, 44, 2); g.marker(fx + 76, 104, 3); g.marker(fx + 106, 123, 4)
    legend(g, 0, WH + 12, [(1, "Icon hochladen (PNG/JPG, quadratisch)."), (2, "Name + kurze Beschreibung, die den NUTZEN nennt."),
                           (3, "Startpreis – später per Test anpassen (Kapitel 5.4)."),
                           (4, "<b>Zum Verkauf</b> einschalten. Danach die <b>ID</b> kopieren (steht in der Adresszeile / auf der Pass-Seite) und in <b>Config.GAME_PASSES.DoubleCoins</b> eintragen.")], W, 9)


# --------------------------------------------------------------------------- 9 Architektur
def d_arch(g):
    W = g.W
    g.rect(0, 14, 150, 150, fill=GREEN_L, stroke=GREEN, r=8, lw=1.2)
    g.text(75, 30, "Spieler (Client)", 10.4, GREEN, True, "c")
    g.para(10, 46, 130, "• Handy / PC / Konsole\n• sieht die Oberfläche\n• LocalScript «Client»\n• darf nur BITTEN", 8.8, INK, 12)
    g.rect(W - 150, 14, 150, 150, fill=BLUE_L, stroke=BLUE, r=8, lw=1.2)
    g.text(W - 75, 30, "Server (Roblox-Cloud)", 10.4, BLUE, True, "c")
    g.para(W - 140, 46, 130, "• Main + Services\n• prüft jede Bitte\n• rechnet Münzen, Käufe\n• ist die WAHRHEIT", 8.8, INK, 12)
    cx0, cx1 = 170, W - 170
    mid = (cx0 + cx1) / 2
    g.rect(cx0, 56, cx1 - cx0, 52, fill=WHITE, stroke=ORANGE, r=6, lw=1.2)
    g.text(mid, 72, "RemoteEvents", 9.6, ORANGE, True, "c")
    g.text(mid, 84, "(Briefkasten zwischen beiden)", 7.8, MUTE, False, "c")
    g.text(mid, 98, "Collect · BuyUpgrade · ClaimDaily", 7.6, SLATE, False, "c")
    g.arrow(150, 82, cx0 - 2, 82, GREEN, 1.8)
    g.arrow(cx1 + 2, 82, W - 150, 82, BLUE, 1.8)
    g.text(mid, 30, "① Spieler: «Ich habe geklickt»", 8.6, GREEN, True, "c")
    g.text(mid, 43, "② Server prüft + rechnet", 8.6, BLUE, True, "c")
    g.arrow(W - 150, 140, 150, 140, BLUE, 1.8)
    g.text(mid, 134, "③ Server → Spieler: «Du hast jetzt 42 Münzen»", 8.4, BLUE, True, "c")
    g.rect(W - 150, 186, 150, 44, fill=PURPLE_L, stroke=PURPLE, r=8, lw=1.2)
    g.text(W - 75, 203, "DataStore (Cloud-Speicher)", 9, PURPLE, True, "c")
    g.text(W - 75, 216, "mit Sitzungssperre", 8, SLATE, False, "c")
    g.arrow(W - 90, 164, W - 90, 185, PURPLE, 1.5); g.arrow(W - 60, 185, W - 60, 165, PURPLE, 1.5)
    g.text(W - 98, 178, "laden / speichern", 8, PURPLE, True, "r")
    g.rect(0, 186, W - 170, 44, fill=RED_L, stroke=RED, r=8, lw=1.2)
    g.para(10, 202, W - 190, "Goldene Regel: Der Client darf NIE sagen «gib mir 1000 Münzen». Er sagt nur «ich habe geklickt» – der Server entscheidet, was das wert ist.", 9, INK, 11, True)


# --------------------------------------------------------------------------- 10 Phone mock
def d_phone(g):
    W, H = g.W, g.H
    pw, ph = 330, 170
    px = 6
    g.rect(px, 2, pw, ph, fill=INK, r=16)
    g.rect(px + 8, 8, pw - 16, ph - 12, fill=colors.HexColor("#93C5FD"), r=8)
    g.text(px + pw / 2, 30, "Münzen: 1.2K", 13, WHITE, True, "c")
    g.rect(px + pw / 2 - 52, 40, 104, 18, fill=PURPLE, r=6); g.text(px + pw / 2, 53, "2x MÜNZEN", 9, WHITE, True, "c")
    g.text(px + pw / 2, 92, "Tippe auf SAMMELN!", 10, WHITE, True, "c")
    g.rect(px + 40, 120, 70, 28, fill=GREEN, r=7); g.text(px + 75, 138, "UPGRADE 11", 8.6, WHITE, True, "c")
    g.rect(px + pw / 2 - 52, 112, 104, 42, fill=BLUE, r=8); g.text(px + pw / 2, 138, "SAMMELN +2", 10.5, WHITE, True, "c")
    g.rect(px + pw - 110, 120, 70, 28, fill=ORANGE, r=7); g.text(px + pw - 75, 138, "TÄGLICH", 8.6, WHITE, True, "c")
    g.rect(px + pw - 64, 12, 52, 36, fill=colors.HexColor("#1E293B"), r=4)
    g.text(px + pw - 38, 27, "leaderstats", 6.4, WHITE, True, "c"); g.text(px + pw - 38, 40, "Coins  1243", 6.6, WHITE, False, "c")
    lx = px + pw + 16
    legend(g, lx, 6, [(1, "<b>Münzen-Anzeige</b> (kommt vom Server)."), (2, "<b>Shop-Knopf</b> Game Pass «2x Münzen» (verschwindet nach Kauf)."),
                      (3, "<b>Hinweis</b> für Neulinge – weg nach dem ersten Münzen-Gewinn."), (4, "<b>SAMMELN</b> = Platzhalter für DEINE Kern-Aktion."),
                      (5, "<b>UPGRADE</b> zeigt den Preis, grau = zu wenig Münzen."), (6, "<b>TÄGLICH</b> = tägliche Belohnung (orange = bereit).")], W - lx, 8.4, 12.2)
    g.marker(px + 36, 24, 1); g.marker(px + pw / 2 - 58, 44, 2); g.marker(px + pw / 2 + 60, 86, 3)
    g.marker(px + pw / 2 + 56, 118, 4); g.marker(px + 40, 118, 5); g.marker(px + pw - 108, 118, 6)


# --------------------------------------------------------------------------- 11 FTUE
def d_ftue(g):
    W = g.W
    ox, ow = 10, W - 20
    marks = [(0, "0 s", "Spawn,\nsofort handeln", BLUE), (0.17, "10 s", "Steuerung durch\nTUN gelernt", TEAL), (0.33, "30 s", "ERSTE\nBELOHNUNG", GREEN),
             (0.5, "60 s", "Erstes Upgrade /\nerstes Item", ORANGE), (0.72, "3 min", "Nächstes Ziel\nklar sichtbar", PURPLE), (1.0, "10 min", "Erstes «Wow» + Grund\nfür morgen", RED)]
    y = 52
    g.rect(ox, y - 3, ow, 6, fill=LINE, r=3)
    for i, (f, tl, tx, col) in enumerate(marks):
        x = ox + f * ow
        g.circle(x, y, 8, fill=col, stroke=WHITE, lw=2)
        g.text(x, y - 16, tl, 9.4, col, True, "c")
        bw = 76 if i < 5 else 104
        bx = x if i == 0 else (x - bw) if i == len(marks) - 1 else (x - bw / 2)
        g.para(bx, y + 22, bw, tx, 8.4, INK, 10.2, True, "l" if i == 0 else "c")
    g.rect(ox, 108, ow, 66, fill=ORANGE_L, r=6)
    g.text(ox + 8, 123, "Dos & Don'ts der ersten Minuten", 9.4, ORANGE, True)
    g.para(ox + 8, 136, ow / 2 - 14, "✓ Pfeil/Highlight auf das erste Ziel\n✓ Belohnung mit Sound + Zahl + Bewegung\n✓ Ein Ziel nach dem anderen zeigen", 8.5, INK, 11)
    g.para(ox + ow / 2 + 4, 136, ow / 2 - 14, "✗ Textwände, Tutorial-Dialoge zum Wegklicken\n✗ Shop-Pop-ups in den ersten 3 Minuten\n✗ Ladebildschirm länger als nötig", 8.5, INK, 11)


# --------------------------------------------------------------------------- 12 Ökonomie
def econ_rows(growth=1.15, cps=2.5, maxlevel=100):
    rows, cum = [], 0.0
    for L in range(0, maxlevel):
        cost = math.floor(10 * growth ** L)
        per = 1 + L
        clicks = math.ceil(cost / per)
        cum += clicks / cps
        rows.append((L + 1, cost, per, clicks, cum))
    return rows


def d_econ(g):
    W, H = g.W, g.H
    ox, oy, pw, ph = 52, 12, W - 70, H - 46
    g.rect(ox, oy, pw, ph, fill=BG2, stroke=LINE)
    rows = econ_rows()
    ymin, ymax = math.log10(5), math.log10(3 * 3600 * 24 * 10)

    def X(l): return ox + l / 100.0 * pw

    def Y(sec): return oy + ph - (math.log10(max(sec, 5)) - ymin) / (ymax - ymin) * ph
    for sec, lab in ((10, "10 s"), (60, "1 min"), (600, "10 min"), (3600, "1 h"), (36000, "10 h"), (360000, "100 h")):
        g.line(ox, Y(sec), ox + pw, Y(sec), LINE, 0.5); g.text(ox - 5, Y(sec) + 3, lab, 7.6, MUTE, False, "r")
    for l in (10, 25, 50, 75, 100):
        g.text(X(l), oy + ph + 12, "Level %d" % l, 7.6, MUTE, False, "c")
    pts = [(r[0], r[4]) for r in rows]
    for (a, b), (c2, d2) in zip(pts, pts[1:]):
        g.line(X(a), Y(b), X(c2), Y(d2), BLUE, 2.2)
    for lv, lab, dx, dy in ((10, "Level 10", -7, -7), (30, "Level 30", -7, -7), (50, "Level 50", -7, -7)):
        r = rows[lv - 1]
        g.circle(X(lv), Y(r[4]), 3.6, fill=ORANGE, stroke=WHITE, lw=1.2)
        mins = r[4] / 60.0
        t = ("%.0f s" % r[4]) if r[4] < 90 else ("%.0f min" % mins) if mins < 90 else ("%.1f h" % (mins / 60))
        g.text(X(lv) + dx, Y(r[4]) + dy, "%s: %s" % (lab, t), 8, NAVY, True, "r")
    g.text(ox, H - 6, "Gesamtzeit bis zum Level (Platzhalter-Loop, 2,5 Klicks/s, Wachstum 1,15) – log. Skala", 8, MUTE)


# --------------------------------------------------------------------------- 13 KPI Dashboard
def d_kpi(g):
    W = g.W
    WH = 200
    g.window(0, 0, W, WH, "Creator Hub → dein Spiel → Analytics (Skizze – Reiter/Namen können abweichen)")
    cards = [("D1-Retention", "31 %", "Ziel ≥ 30 %  ·  Min. 25 %", GREEN), ("D7-Retention", "9 %", "Ziel ≥ 12 %  ·  Min. 8 %", ORANGE),
             ("Ø Session", "13 Min", "Ziel ≥ 15  ·  Min. 10", ORANGE), ("Zahler-Quote", "0,8 %", "Ziel 2–3 %  ·  Min. 1 %", RED)]
    cw = (W - 5 * 8) / 4
    for i, (t, v, s, col) in enumerate(cards):
        x = 8 + i * (cw + 8)
        g.rect(x, 28, cw, 62, fill=WHITE, stroke=LINE, r=6)
        g.circle(x + cw - 13, 42, 5, fill=col)
        g.text(x + 8, 42, t, 8.6, MUTE, True)
        g.text(x + 8, 70, v, 19, NAVY, True)
        g.text(x + 8, 83, s, 7.2, MUTE)
    g.rect(8, 98, W - 16, 94, fill=WHITE, stroke=LINE, r=6)
    g.text(16, 112, "Tägliche aktive Spieler (DAU)", 8.6, MUTE, True)
    pts = [20, 26, 24, 33, 40, 38, 52, 61, 58, 70, 78, 74, 90, 96]
    for i, (a, b) in enumerate(zip(pts, pts[1:])):
        x1 = 20 + i * (W - 56) / 13.0; x2 = 20 + (i + 1) * (W - 56) / 13.0
        g.line(x1, 186 - a * 0.7, x2, 186 - b * 0.7, BLUE, 2)
    g.marker(W - 26, 36, 1); g.marker(W - 26, 108, 2)
    legend(g, 0, WH + 12, [(1, "Ampel pro Kennzahl: <font color='#16A34A'><b>grün</b></font> = Ziel erreicht, <font color='#D97706'><b>gelb</b></font> = zwischen Minimum und Ziel, <font color='#DC2626'><b>rot</b></font> = unter Minimum. Jeden Montag ausfüllen (Anhang B)."),
                           (2, "DAU-Kurve: steigt sie nach einem Update oder nur durch Werbung? Nur Update = gesunde Basis.")], W, 9)


# --------------------------------------------------------------------------- 14 Thumbnail
def d_thumb(g):
    W, H = g.W, g.H
    tw, th = 300, 169
    g.rect(0, 4, tw, th, fill=colors.HexColor("#1D4ED8"), r=6)
    g.rect(0, 4, tw, 70, fill=colors.HexColor("#3B82F6"), r=6)
    g.poly([(0, 120), (tw, 90), (tw, th + 4), (0, th + 4)], fill=colors.HexColor("#15803D"))
    g.circle(88, 94, 38, fill=ORANGE, stroke=WHITE, lw=3)       # Hauptmotiv
    g.circle(76, 86, 6, fill=WHITE); g.circle(100, 86, 6, fill=WHITE); g.circle(77, 87, 3, fill=INK); g.circle(101, 87, 3, fill=INK)
    g.rect(190, 52, 94, 54, fill=colors.HexColor("#FDE047"), stroke=WHITE, r=8, lw=3)
    g.text(237, 87, "+1.000", 20, INK, True, "c")
    g.text(150, 35, "SUPER SAMMLER", 22, WHITE, True, "c")
    g.arrow(135, 110, 186, 90, WHITE, 3, 9)
    for n, (x, y) in enumerate(((88, 58), (252, 22), (237, 54), (160, 112), (14, 150)), start=1):
        g.marker(x, y, n)
    legend(g, tw + 18, 4, [(1, "<b>Ein</b> klares Hauptmotiv, groß, Gesicht/Emotion."), (2, "<b>Max. 2–3 Wörter</b> Text, riesig, hoher Kontrast."),
                           (3, "<b>Belohnung zeigen</b> (Zahl, Item) – das Versprechen."), (4, "<b>Blickführung:</b> Pfeil/Linie vom Motiv zur Belohnung."),
                           (5, "<b>Kontrast</b> Vorder- zu Hintergrund: auf dem Handy-Mini-Format testen!")], W - tw - 18, 8.6, 13)
    g.rect(0, th + 14, W, 26, fill=RED_L, r=5)
    g.para(8, th + 30, W - 16, "Nie täuschen: Keine Bilder von Dingen, die es im Spiel nicht gibt – das verstößt gegen die Regeln und zerstört die Retention.", 8.6, INK, 10.4, True)


# --------------------------------------------------------------------------- 15 Diagnose-Quadrant
def d_quad(g):
    W, H = g.W, g.H
    ox, oy, pw, ph = 36, 6, W - 46, H - 36
    hw, hh = pw / 2, ph / 2
    quads = [(0, 0, "Gute Retention, wenig Besucher", "Reichweiten-Problem → Thumbnail/Icon testen, Creator & Shorts, kleine Ads testen", GREEN_L, GREEN),
             (1, 0, "Gute Retention, viele Besucher", "Skalieren → Inhalte, Events, Team, Zweitspiel", BLUE_L, BLUE),
             (0, 1, "Schwache Retention, wenig Besucher", "Produkt-Problem → Loop/FTUE fixen oder stoppen", RED_L, RED),
             (1, 1, "Schwache Retention, viele Besucher", "Falle! Traffic verpufft → Ads STOPPEN, erst Retention fixen", ORANGE_L, ORANGE)]
    for (cx, cy, t, tx, bg, col) in quads:
        x, y = ox + cx * hw, oy + cy * hh
        g.rect(x + 2, y + 2, hw - 4, hh - 4, fill=bg, r=6)
        g.text(x + 10, y + 20, t, 9.6, col, True)
        g.para(x + 10, y + 34, hw - 20, tx, 9, INK, 11.2)
    g.arrow(ox - 10, oy + ph, ox - 10, oy, MUTE, 1.2); g.text(ox - 14, oy + ph / 2 + 3, "Retention", 8.4, MUTE, True, "r")
    g.arrow(ox, oy + ph + 10, ox + pw, oy + ph + 10, MUTE, 1.2); g.text(ox + pw / 2, oy + ph + 22, "Besucher / Reichweite", 8.4, MUTE, True, "c")


# --------------------------------------------------------------------------- 16 Launch-Timeline
def d_launch(g):
    W, H = g.W, g.H
    y = 96
    g.rect(8, y - 3, W - 16, 6, fill=LINE, r=3)
    pts = [("T-7", "Creator briefen,\nClips terminieren", 0.02, BLUE, 1), ("T-3", "Code-Freeze,\nBackup-Test", 0.16, BLUE, 0), ("T-1", "Generalprobe,\nRunbook lesen", 0.30, BLUE, 1),
           ("T-0\n08:00", "Update live\n(Soft→Hard)", 0.42, GREEN, 0), ("+1 h", "Creator-Posts,\nAnkündigung", 0.52, GREEN, 1), ("+2 h", "Ads an\n(kleines Budget)", 0.62, GREEN, 0),
           ("+24 h", "Hotfix-Fenster,\nZahlen prüfen", 0.75, ORANGE, 1), ("+72 h", "Review:\nStabil? Retention?", 0.88, ORANGE, 0), ("+7 d", "Update #1\nankündigen", 0.98, PURPLE, 1)]
    for lab, tx, f, col, up in pts:
        x = 8 + f * (W - 16)
        g.circle(x, y, 7, fill=col, stroke=WHITE, lw=2)
        if up:
            g.line(x, y - 8, x, y - 24, col, 1.2)
            g.text(x, y - 40, lab.split("\n")[0], 8.8, col, True, "c")
            g.para(x - 42, 20, 84, tx, 8, INK, 9.6, False, "c")
        else:
            g.line(x, y + 8, x, y + 24, col, 1.2)
            g.text(x, y + 38, lab.replace("\n", " "), 8.8, col, True, "c")
            g.para(x - 42, y + 48, 84, tx, 8, INK, 9.6, False, "c")
    g.text(8, H - 6, "Alle Zeiten sind Vorschläge; Wichtig: Creator-Posts und Update liegen am SELBEN Tag.", 8.2, MUTE)


# --------------------------------------------------------------------------- 17 DevEx
def d_devex(g):
    W, H = g.W, g.H
    steps = [("Spieler gibt\nRobux aus", BLUE), ("Roblox behält\nPlattformanteil\n(⚠ ca. 30 %)", MUTE), ("Du bekommst\n«verdiente Robux»", GREEN),
             ("DevEx-Antrag\n(Creator Hub)", ORANGE), ("Tipalti\n(Zahlungsdienst)", PURPLE), ("Dein Konto\n(EUR)", NAVY)]
    bw = (W - 5 * 16) / 6
    for i, (t, col) in enumerate(steps):
        x = i * (bw + 16)
        g.rect(x, 28, bw, 66, fill=WHITE, stroke=col, r=7, lw=1.6)
        g.circle(x + 12, 40, 8, fill=col); g.text(x + 12, 43.5, str(i + 1), 9, WHITE, True, "c")
        g.para(x + 4, 62, bw - 8, t, 8.3, INK, 10.2, True, "c")
        if i < 5:
            g.arrow(x + bw + 1, 61, x + bw + 15, 61, MUTE, 1.3, 5)
    g.rect(0, 112, W, 70, fill=ORANGE_L, r=6)
    g.text(10, 127, "Was unterwegs abgeht (prüfen, siehe Kapitel 9):", 9.4, ORANGE, True)
    g.para(10, 140, W - 20, "• DevEx-Kurs pro Robux (Quellen widersprechen sich: 0,0035 $ / 0,0038 $ / 0,0054 $ für US-Erwachsene)  • Mindestmenge zum Auszahlen\n• Tipalti-Gebühr je nach Zahlungsmethode  • Währungsumrechnung ca. 1,9–3 %  • Steuer-Formular (W-8BEN) vorher hinterlegen", 8.8, INK, 11.4)


# --------------------------------------------------------------------------- 18 Szenarien
def d_scen(g):
    W, H = g.W, g.H
    ox, oy, pw, ph = 70, 10, W - 90, H - 44
    data = [("Flop\n100 DAU", 402), ("Median-Niveau\n500 DAU", 2008), ("Solide\n5.000 DAU", 20075), ("Starker Treffer\n50.000 DAU", 200750)]
    ymax = math.log10(400000); ymin = math.log10(100)

    def Y(v): return oy + ph - (math.log10(v) - ymin) / (ymax - ymin) * ph
    for v, lab in ((100, "100 $"), (1000, "1.000 $"), (10000, "10.000 $"), (100000, "100.000 $")):
        g.line(ox, Y(v), ox + pw, Y(v), LINE, 0.5); g.text(ox - 5, Y(v) + 3, lab, 7.6, MUTE, False, "r")
    bw = pw / 4 - 22
    cols = [RED, ORANGE, GREEN, BLUE]
    for i, ((lab, v), col) in enumerate(zip(data, cols)):
        x = ox + 12 + i * (bw + 22)
        g.rect(x, Y(v), bw, oy + ph - Y(v), fill=col, r=3)
        g.text(x + bw / 2, Y(v) - 4, "≈ %s $" % format(v, ",").replace(",", "."), 9, NAVY, True, "c")
        g.para(x - 6, oy + ph + 11, bw + 12, lab, 8, INK, 9.6, True, "c")
    g.line(ox, Y(1500), ox + pw, Y(1500), RED, 1.2, (4, 3))
    g.text(ox + 6, Y(1500) - 16, "Median aller DevEx-", 7.8, RED, True)
    g.text(ox + 6, Y(1500) - 6, "Teilnehmer ≈ 1.500 $/Jahr", 7.8, RED, True)


# --------------------------------------------------------------------------- 19 Sitzungssperre
def d_lock(g):
    W, H = g.W, g.H
    cols = [("Server A", 70, BLUE), ("DataStore", W / 2, PURPLE), ("Server B", W - 70, GREEN)]
    for t, x, col in cols:
        g.rect(x - 52, 4, 104, 20, fill=col, r=5); g.text(x, 18, t, 9.4, WHITE, True, "c")
        g.line(x, 24, x, H - 4, col, 1, (3, 3))
    ev = [(46, 70, W / 2, "① A lädt Spieler + setzt Sperre «A»", BLUE), (74, W - 70, W / 2, "② B will laden → Sperre gehört A → wartet", GREEN),
          (102, 70, W / 2, "③ Spieler verlässt A: speichern + Sperre lösen", BLUE), (130, W - 70, W / 2, "④ B versucht erneut → lädt den letzten Stand", GREEN)]
    for y, xa, xb, t, col in ev:
        g.arrow(xa + (6 if xa < xb else -6), y, xb + (-6 if xa < xb else 6), y, col, 1.5)
        g.text((xa + xb) / 2, y - 5, t, 8.2, INK, True, "c")
    g.rect(0, 150, W, 26, fill=ORANGE_L, r=5)
    g.text(W / 2, 167, "Stürzt A ab, läuft die Sperre nach 120 s ab – dann übernimmt B automatisch.", 8.8, INK, True, "c")
