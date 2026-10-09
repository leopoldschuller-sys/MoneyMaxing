# -*- coding: utf-8 -*-
from lib import *
import diagrams as D
import snippets as SN


def _fmt_time(sec):
    if sec < 90:
        return "%d s" % round(sec)
    m = sec / 60.0
    if m < 90:
        return "%d min" % round(m)
    h = m / 60.0
    if h < 48:
        return "%.1f h" % h
    return "%.1f Tage" % (h / 24)


def chapter5():
    s = [PageBreak()]
    s += H1("Kapitel 5 – Dein Spiel um das Gerüst bauen", "BAUEN  ·  WOCHE 4–11")
    s.append(P("Jetzt wird es dein Spiel. Dieses Kapitel ist dein Bau-Handbuch: wie du den Platzhalter ersetzt, was du in welcher Reihenfolge baust und worauf du bei jedem Teil achtest. Prinzip: <b>erst Spaß (Woche 4–6), dann Tiefe (7–11), dann Politur</b>. Nie umgekehrt."))
    s.append(H2("5.1 Den Platzhalter durch deinen Loop ersetzen"))
    s += table([
        ["Teil im Kit", "Was er jetzt tut", "So wird er zu deinem Spiel"],
        ["<b>SAMMELN</b> (Remote «Collect»)", "Klick = Münzen", "Ersetze durch DEINE Kernaktion (ernten, kämpfen, bauen, fangen …). Bleibt <b>serverseitig</b> und rate-limitiert."],
        ["<b>UPGRADE</b> (Remote «BuyUpgrade»)", "Mehr Münzen pro Klick", "Dein Fortschrittssystem: Fähigkeiten, Werkzeuge, Haustiere, Zonen. Preise kommen aus <font face='Mono'>Config</font>."],
        ["<b>Münzen</b> (<font face='Mono'>coins</font>)", "Einzige Währung", "Entscheide: eine Währung (einfacher) oder zwei (Soft + Premium)? <b>Start: eine.</b>"],
        ["<b>TÄGLICH</b>", "Serie + Belohnung", "Behalten. Passe <font face='Mono'>Config.DAILY_REWARDS</font> an; später mit Items statt nur Münzen."],
        ["<b>Spielerdaten</b> (<font face='Mono'>DEFAULT_DATA</font>)", "Münzen, Level, Serie", "Neues Feld = hier eintragen. Versionsnummer erhöhen, wenn du Felder umbaust."],
        ["<b>Client-UI</b>", "4 Knöpfe per Code", "Später echtes UI-Design (Studio → UI-Editor). Die <b>Server-Logik bleibt gleich</b>."]],
        [0.28, 0.2, 0.52])
    s.append(H3("Rezept: Eine neue Funktion in 7 Schritten (immer gleich)"))
    s += numbered(["<b>Zahlen in Config</b> auslagern (Preise, Abklingzeiten, Belohnungen).", "<b>Daten-Feld</b> in <font face='Mono'>DEFAULT_DATA</font>.",
                   "<b>Server-Funktion</b> mit Prüfung der Eingaben und Abklingzeit.", "<b>RemoteEvent</b> in Main anlegen.", "<b>UI-Knopf</b> im Client, der den Remote feuert.",
                   "<b>Analytics-Ereignis</b> (damit du es messen kannst).", "<b>Test:</b> normaler Ablauf + Missbrauch (Remote mit Unsinn feuern)."])
    s.append(P("<b>Beispiel «Pflanze gießen»</b> (Schritte 1–5 im Überblick). Wichtig ist das Muster: prüfen, Abklingzeit, ändern, belohnen."))
    s.append(snippet(SN.NEW_ACTION, 6.8))
    s.append(callout("idea", "<b>Hier ist deine Arbeit:</b> Beschreibe mir deinen Loop in 5 Sätzen (Aktion, Belohnung, erstes Upgrade, erstes Ziel, soziales Element). Ich schreibe dir daraus die Server- und Client-Teile nach diesem Rezept, inklusive Config-Werten und Testplan."))
    s.append(H2("5.2 Die ersten 60 Sekunden (FTUE) bauen"))
    s.append(P("FTUE = First-Time User Experience, also das, was ein Neuling in den ersten Minuten erlebt. Hier gewinnst oder verlierst du die Mehrheit deiner Spieler."))
    s.append(fig(178, D.d_ftue, "Zeitplan der ersten Minuten (Ziele). Mit der Stoppuhr am Neuling-Konto nachmessen."))
    s += checks(["Der Spieler darf in den ersten 3 Sekunden <b>handeln</b> (kein Warten auf Ladebalken/Dialog).", "Die <b>erste Belohnung</b> kommt in unter 30 Sekunden, mit <b>Sound, Zahl, Bewegung</b>.",
                 "Es gibt <b>immer genau ein klares nächstes Ziel</b> (Pfeil, Leuchten, Text mit max. 5 Wörtern).", "Das <b>erste Upgrade</b> ist nach 30–60 Sekunden erreichbar.",
                 "<b>Keine</b> Shop-Fenster in den ersten 3 Minuten.", "Test: Gib das Spiel jemandem ohne Erklärung. Misst du <b>keine Frage</b> in den ersten 2 Minuten, ist es gut."])
    s.append(H2("5.3 Die Wirtschaft (Ökonomie) designen"))
    s.append(P("Die Wirtschaft entscheidet, ob sich Fortschritt gut anfühlt. Zwei Fragen: <b>Wie schnell verdient man?</b> (Quellen) und <b>Wofür gibt man aus?</b> (Senken)."))
    s += table([["Quellen (Münzen kommen rein)", "Senken (Münzen gehen raus)"],
                [["• Kernaktion (Klick/Ernte/Kampf)<br/>• Tägliche Belohnung, Quests, Events<br/>• Käufe mit Robux (Developer Products)<br/>• Freunde-Bonus, Multiplikatoren"],
                 ["• Upgrades (steigende Preise)<br/>• Neue Zonen/Fähigkeiten freischalten<br/>• Rebirth/Prestige (Reset gegen Dauer-Bonus)<br/>• Kosmetik, Sammel-Items, Haustier-Slots"]]], [0.5, 0.5], zebra=False)
    s.append(P("Das Kit nutzt eine einfache, bewährte Formel für Preise: <b>Preis = Basispreis × Wachstum<super>Level</super></b> (Standard: 10 × 1,15<super>Level</super>). Der Ertrag wächst linear (+1 pro Level). So wird Fortschritt zuerst schnell und später langsamer."))
    s.append(fig(186, D.d_econ, "Gesamtzeit bis zu einem Level im Platzhalter-Loop (berechnet mit den echten Kit-Formeln)."))
    rows = [["Wachstum", "Level 10", "Level 30", "Level 50", "Gefühl"]]
    for gr, feel in ((1.10, "großzügig, sehr schnell"), (1.15, "Standard"), (1.20, "zäh, Spieler brauchen Boosts")):
        er = D.econ_rows(growth=gr)
        rows.append(["<b>%s</b>" % str(gr).replace(".", ","), _fmt_time(er[9][4]), _fmt_time(er[29][4]), _fmt_time(er[49][4]), feel])
    s += table(rows, [0.16, 0.16, 0.16, 0.16, 0.36])
    s.append(P("Berechnet für 2,5 Klicks pro Sekunde, Basispreis 10, Ertrag = 1 + Level. Dein Loop hat andere Zahlen; <b>die Methode bleibt</b>: Tabelle in Google Sheets bauen und die Zeit bis zu jedem Meilenstein ausrechnen.", "small"))
    s.append(callout("tip", ["<b>Die 4 Regeln der Ökonomie:</b><br/>1. In den ersten 10 Minuten kommt <b>alle 1–2 Minuten</b> ein neues Ziel.<br/>2. Kein Spieler wartet länger als <b>90 Sekunden ohne sichtbaren Fortschritt</b>.<br/>3. Boosts (bezahlt) <b>verkürzen</b> den Weg, aber ohne Kauf ist das Spiel <b>voll spielbar</b>.<br/>4. <b>Nie rückwirkend nerfen</b> (Spieler entwerten): Neues Balancing gilt für Neues."]))
    s.append(P("<b>Inflations-Check (wöchentlich):</b> Bleibt die Durchschnitts-Münzenmenge pro Spieler und Stunde stabil? Wächst sie ungebremst, fehlen Senken. Die Kit-Events <font face='Mono'>LogEconomyEvent</font> liefern dir die Rohdaten (Quelle/Senke)."))
    s.append(H2("5.4 Monetarisierung (Geld verdienen, ohne Spieler zu vergraulen)"))
    s.append(P("Erst Spaß, dann Shop. Der Shop kommt <b>nach</b> dem ersten Erfolgserlebnis, nie davor. Verkaufe <b>Komfort, Tempo und Stil</b>, nicht Siege."))
    s += table([["Typ", "Was", "Wann sinnvoll", "Beispiele"],
                ["<b>Game Pass</b>", "einmalig, für immer", "Dauer-Vorteile", "2x Münzen, Auto-Sammeln, VIP-Bereich, Extra-Slots"],
                ["<b>Developer Product</b>", "beliebig oft kaufbar", "Verbrauchsgüter", "Münzpakete, zeitlich begrenzte Boosts, Timer überspringen"],
                ["<b>Abo (Subscription)</b>", "monatlich", "Regelmäßiger Mehrwert", "VIP-Status mit täglichen Boni (erst nach dem Launch)"],
                ["<b>Premium-Spieler</b>", "Roblox bezahlt Spielzeit von Premium-Nutzern ⚠", "automatisch", "Kleiner Premium-Vorteil im Spiel als Anreiz"]],
                [0.2, 0.22, 0.2, 0.38])
    s.append(H3("Preisleiter als Startpunkt (Robux, später per Test justieren)"))
    s += table([["Preis", "Passt für", "Beispiel"], ["49–99", "Einstieg, Impulskauf", "Kleines Münzpaket, Namens-Tag"], ["199–249", "Dauer-Boost", "2x Münzen (Game Pass)"],
                ["499", "Großes Paket", "VIP-Bereich + Boost, seltenes Haustier"], ["999+", "Sammler/Unterstützer", "Supporter-Paket, kosmetische Vitrine"]], [0.15, 0.3, 0.55])
    s.append(P("Die Zahlen sind <b>Startwerte aus meiner Erfahrung, keine Roblox-Regel</b>. Du testest sie mit A/B (Kapitel 6.4).", "small"))
    s.append(snippet(SN.PRODUCT_BUTTON, 6.8))
    s.append(callout("warn", ["<b>Regeln, die Spieler und Plattform schützen:</b>",
                              "• <b>Keine Zufalls-Käufe ohne Quotenangabe</b> (Kisten, Eier). Roblox verlangt bei bezahlten Zufallsitems Offenlegung der Wahrscheinlichkeiten und schränkt sie regional ein ⚠ (Prüfliste F6). Am einfachsten: <b>gar keine</b> bezahlten Zufallsitems.",
                              "• <b>Keine Druck-Tricks auf Kinder</b> (fake Countdown, «nur noch 1 Minute!», Schuldgefühl-Texte).",
                              "• <b>Keine direkte Kaufaufforderung an Kinder</b> im Spieltext («Kauf jetzt!»). In Deutschland ist das nach meinem Kenntnisstand wettbewerbsrechtlich heikel ⚠ (UWG Anhang Nr. 28) und wird auf Anwaltsliste für Kapitel 9.6 gesetzt.",
                              "• <b>Keine Kaufpop-ups</b> in den ersten 3 Minuten, nie mitten in der Aktion."]))
    s.append(H2("5.5 Gründe, wiederzukommen (Retention-Mechaniken)"))
    s += table([["Mechanik", "Wirkung", "Aufwand", "Im Kit?"],
                ["Tägliche Belohnung + Serie", "★★★", "klein", "<b>ja</b>"], ["Tägliche/Wöchentliche Quests", "★★★", "mittel", "nein"], ["Sammelbuch (Completionist)", "★★★", "mittel", "nein"],
                ["Timer / Offline-Fortschritt («Ernte ist fertig»)", "★★★", "mittel", "nein"], ["Freunde-Bonus (Spieler mit Freunden verdienen mehr)", "★★☆", "klein", "Beispielcode (unten)"],
                ["Wochen-Events mit Sonderbelohnung", "★★★", "mittel", "nein"], ["Handeln unter Spielern", "★★★", "groß (Sicherheit!)", "nein"], ["Rebirth/Prestige", "★★☆", "mittel", "nein"],
                ["Saison-Pass (30 Tage Fortschrittspfad)", "★★☆", "groß", "nein"]], [0.46, 0.14, 0.2, 0.2])
    s.append(snippet(SN.FRIEND_BONUS, 6.6))
    s.append(callout("warn", "<b>Handeln</b> zwischen Spielern ist ein starker Haken, aber das Einfallstor für Betrug und Duplikations-Bugs. Baue es erst <b>nach dem Launch</b>, mit Server-Prüfung und Protokoll jedes Handels."))
    s.append(H2("5.6 Soziales und Wachstum durch Freunde"))
    s += bullets(["<b>Co-op-Bonus:</b> gemeinsam spielen = mehr Belohnung (nie Zwang).", "<b>Zeigen:</b> seltene Items sichtbar machen (Aura, Name, Vitrine), das macht neugierig und erzeugt Clips.",
                  "<b>Einladen:</b> Roblox-Einladungsfunktion nutzen (Social Prompt), mit Belohnung für beide.", "<b>Ranglisten</b> (täglich/wöchentlich), damit auch Neue eine Chance haben.",
                  "<b>Private Server</b> für Freundesgruppen (optional, kann Einnahmen bringen)."])
    s.append(H2("5.7 Oberfläche und Handy"))
    s += checks(["Knöpfe <b>mindestens 44 × 44 Pixel</b>; alles mit <font face='Mono'>Scale</font> (UDim2.fromScale) + <font face='Mono'>UISizeConstraint</font>.", "Wichtiges <b>nicht unter den Daumen</b>-Bereich legen; oben rechts liegt Roblox' eigenes Menü.",
                 "Texte <b>groß und kurz</b>; Zahlen mit K/M/B abkürzen (macht das Kit).", "Im Studio den <b>Geräte-Emulator</b> nutzen (Tab Test → Geräteauswahl, Namen können abweichen) und mindestens ein <b>echtes Handy</b> testen.",
                 "Keine Pflicht-Tastatur; Controller/Gamepad wenigstens grundlegend.", "Ladezeit: Erstes Bild nach wenigen Sekunden, schwere Inhalte nachladen."])
    s.append(H2("5.8 Performance (damit es auf schwachen Handys läuft)"))
    s += checks(["<font face='Mono'>Workspace.StreamingEnabled</font> bei größeren Welten anschalten.", "Statische Teile <b>Anchored</b>; für Deko <font face='Mono'>CanCollide/CanQuery/CanTouch</font> aus.",
                 "Weniger, größere <b>MeshParts</b> statt tausender kleiner Parts; Partikel und Lichter sparsam.", "Keine schweren Schleifen pro Frame; <font face='Mono'>task.wait()</font> statt <font face='Mono'>wait()</font>.",
                 "Messen: <b>MicroProfiler (Strg+F6)</b> und <b>Developer Console (F9)</b> (Speicher, Skriptaktivität); in Analytics den Reiter «Performance» ansehen.",
                 "Teste auf dem <b>schwächsten</b> Gerät, das du hast. Stürzt es ab, ist das ein Launch-Blocker."])
    s.append(H2("5.9 Anti-Exploit (Schutz vor Schummlern)"))
    s += checks(["Alles, was Geld/Fortschritt betrifft, <b>nur auf dem Server</b> (macht das Kit).", "Jedes RemoteEvent: <b>Typ, Bereich, ganze Zahl</b> der Argumente prüfen; <b>Rate-Limit</b> (macht das Kit für Collect/Upgrade).",
                 "Kosten und Belohnungen <b>serverseitig aus Config</b>, nie vom Client übernehmen.", "Admin-Befehle nur serverseitig und nur für eine feste <b>UserId-Liste</b>.", "Nichts Geheimes in <font face='Mono'>ReplicatedStorage</font> oder <font face='Mono'>StarterGui</font>.",
                 "Auffällige Werte <b>loggen</b> (z. B. mehr als X Münzen pro Minute) und Konten prüfen.", "<b>Selbsttest:</b> Schreibe einen kleinen LocalScript, der alle Remotes mit Unsinn feuert (Text statt Zahl, negative, riesige Zahlen). Das Spiel darf nicht abstürzen und nichts gutschreiben."])
    s.append(H2("5.10 Sicherheit für Kinder und Plattform-Regeln"))
    s += checks(["<b>Alters-/Reife-Fragebogen</b> (Maturity) im Creator Hub <b>wahrheitsgemäß</b> ausfüllen. Falsche Angaben können zur Entfernung führen ⚠.",
                 "Chat nur über Roblox' eigenes, <b>gefiltertes</b> Chat-System. Eigene Texteingaben immer über den Roblox-Textfilter schicken (<font face='Mono'>TextService:FilterStringAsync</font>).",
                 "Seit Jan 2026 ist Chat nur nach <b>Altersprüfung</b> (Gesichts-Scan) möglich: plane <b>chat-unabhängigen</b> Spielspaß ein (Emotes, Schnell-Nachrichten).",
                 "<b>Keine</b> Aufforderung, Roblox zu verlassen (Discord, Social Media, Messenger) im Spiel.", "Keine persönlichen Daten erfassen; keine externen Links im Spiel.",
                 "Melden/Blockieren muss funktionieren (Roblox-Standard nicht abschalten).", "Orte mit Bar/Club/Schlafzimmer-Charakter nur für 17+ ⚠; vermeide sie.",
                 "<b>Discord/TikTok erst ab 13</b>: richte Community-Kanäle dafür ein, und bewirb sie nicht gezielt an Jüngere."])
    s.append(H2("5.11 Optik, Ton, KI-Werkzeuge"))
    s += bullets(["<b>Stilguide</b> (1 Seite): 5 Farben, Formenstil (rund/eckig), Schriftart, Beispiel-Screenshot. Konsistenz schlägt Detail.",
                  "<b>Low-Poly/stilisiert</b> ist günstig, hübsch auf Handys und schnell zu produzieren.",
                  "<b>KI/Studio-Hilfen:</b> Roblox hat seit 2026 das <b>Cube</b>-Modell (3D-/4D-Generierung, Beta) und einen Studio-Assistenten. Nutze sie für Entwürfe, prüfe Qualität, Performance (Dreiecke) und Lizenz.",
                  "<b>Creator Store:</b> Modelle/Bilder/Sounds prüfen (Autor, Bewertung, <b>versteckte Skripte</b> in Modellen sind ein bekanntes Risiko, lösche unbekannte Scripts).",
                  "<b>Musik/Sounds:</b> nur lizenzierte Roblox-Audio-Assets oder selbst erstellt.",
                  "<b>Freelancer-Auftrag:</b> Ziel, 3 Stil-Referenzen, Formate/Größen, Deadline, Preis, und <b>schriftliche Übertragung aller Nutzungsrechte</b>. Zugriff nur über Gruppenrolle."])
    s.append(H2("5.12 Sprachen"))
    s.append(P("Englisch ist die Hauptsprache der Plattform. Plane <b>Englisch + Deutsch</b>. Schreibe <b>alle Texte in Tabellen/Config</b> (nie fest im Code), und nutze Roblox' Lokalisierung (Game Settings → Localization, automatische Übersetzung; Bedienung ggf. in der Doku prüfen). Lass die englischen Texte <b>von einem Muttersprachler gegenlesen</b>."))
    s.append(callout("do", "<b>Gate G-3 (Woche 11):</b> Inhalt für mindestens 2–3 Stunden · alle Shop-Artikel per Testkauf geprüft · Anti-Exploit-Checkliste erledigt · Ø Session im Playtest ≥ 15 Minuten · keine bekannten Datenverlust-Bugs · Fragebogen ausgefüllt.", "GATE G-2 und G-3"))
    return s
