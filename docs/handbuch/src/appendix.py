# -*- coding: utf-8 -*-
import os
from lib import *

GAME = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "game", "src"))

FILES = [
    ("A.1", "Config", "ModuleScript", "ReplicatedStorage", "shared/Config.luau"),
    ("A.2", "Main", "Script", "ServerScriptService", "server/Main.server.luau"),
    ("A.3", "DataService", "ModuleScript", "ServerScriptService → Services", "server/Services/DataService.luau"),
    ("A.4", "Analytics", "ModuleScript", "ServerScriptService → Services", "server/Services/Analytics.luau"),
    ("A.5", "EconomyService", "ModuleScript", "ServerScriptService → Services", "server/Services/EconomyService.luau"),
    ("A.6", "DailyRewards", "ModuleScript", "ServerScriptService → Services", "server/Services/DailyRewards.luau"),
    ("A.7", "ShopService", "ModuleScript", "ServerScriptService → Services", "server/Services/ShopService.luau"),
    ("A.8", "BetaGate", "ModuleScript", "ServerScriptService → Services", "server/Services/BetaGate.luau"),
    ("A.9", "Client", "LocalScript", "StarterPlayer → StarterPlayerScripts", "client/Client.client.luau"),
]


def appendix_a():
    s = [PageBreak()]
    s += H1("Anhang A – Der Code des Starter-Kits", "ANHANG")
    s.append(P("Alle Dateien liegen auch im Repo unter <font face='Mono'>game/src/</font> (dort sind sie die verbindliche Fassung). In diesem PDF sind Tabulatoren zu 2 Leerzeichen geworden. <b>Wichtig:</b> Name, Typ und Ort müssen exakt so angelegt sein (Kapitel 4.2). Der Code wurde mit einem Luau-Parser auf Syntax und mit 71 automatischen Prüfungen auf Server-Verhalten getestet."))
    for ref, name, typ, loc, rel in FILES:
        s.append(CondPageBreak(230))
        s.append(H2("%s  %s" % (ref, name)))
        s += table([["Name", "Typ", "Ort"], ["<b>%s</b>" % name, typ, loc]], [0.25, 0.25, 0.5], zebra=False)
        s += code_blocks(os.path.join(GAME, rel), chunk=36)
    return s


CHECK_PRE = [
    ("Technik", ["Alle Services im Output ohne rote Zeilen (F5 + Mehrspieler)", "100× Join/Leave ohne Datenverlust", "DataStore-Ausfall simuliert: keine leeren Spielstände", "Auf Low-End-Handy getestet, keine Abstürze",
                 "Anti-Exploit-Selbsttest bestanden (Remotes mit Unsinn)", "Server-Neustart/Shutdown speichert alle Spieler", "Wiederherstellung eines Spielstands einmal geübt"]),
    ("Wirtschaft & Shop", ["Alle Pässe/Produkte angelegt, IDs in Config, Preise geprüft", "Testkauf: Gutschrift korrekt, kein Doppelkauf", "Keine bezahlten Zufallsitems (oder Quoten offengelegt)", "Ökonomie-Tabelle geprüft, kein Spieler wartet > 90 s ohne Fortschritt",
                          "Shop-Pop-ups erst nach 3+ Minuten"]),
    ("Inhalt & Spielgefühl", ["Erste Belohnung < 60 s (Stoppuhr, Neuling-Konto)", "Inhalt für ≥ 2–3 Stunden", "Täglich/Streak funktioniert über Tageswechsel", "Texte DE + EN, von Muttersprachler gegengelesen"]),
    ("Store-Seite", ["Icon, 3–5 Thumbnails (Gewinner aus A/B-Test)", "Titel, Beschreibung, Genre, Codes", "Alters-/Maturity-Fragebogen ehrlich ausgefüllt", "Handy/Tablet/PC aktiviert"]),
    ("Marketing & Community", ["15–20 Kurzvideos auf Vorrat", "30 Creator angeschrieben, Codes vergeben", "Discord (13+) mit Regeln und 2 Moderatoren", "Launch-Beitrag und Patchnotes-Vorlage fertig"]),
    ("Recht & Geld", ["Steuerliche Erfassung geklärt (Steuerberater)", "W-8BEN/Taxes-Seite hinterlegt, Auszahlung getestet/verstanden", "Impressum + Datenschutz für Website/Social (wenn nötig)", "Alle Assets/Musik lizenziert, keine Marken im Namen",
                       "Prüfliste F1–F9 (Kapitel 9.8) abgehakt"]),
    ("Betrieb", ["Launch-Runbook geschrieben, von zweiter Person gelesen", "Schichtplan 72 h", "Hotfix-/Rollback-Weg geübt", "Notfallschalter (Config) getestet", "BetaGate: <font face='Mono'>BETA_ONLY = false</font> für den Launch (nicht vergessen!)"]),
]

CHECK_DAY = ["Beta-Schalter AUS und veröffentlicht", "Spiel öffentlich, Store-Seite geprüft (Bilder, Titel, Links)", "Creator-Posts + Ankündigung <b>gleichzeitig</b> freigegeben", "Kleines Werbebudget aktiviert (Limit pro Tag!)",
             "Dashboard offen: CCU, Fehler, Käufe", "Server-Log (F9) in den ersten 2 Stunden alle 15 Minuten prüfen", "Discord: Support-Schicht besetzt", "Erste Käufe prüfen (kam die Gutschrift an?)",
             "Nach 6 h: Zwischenstand notieren", "Nach 24 h: Hotfix-Fenster, Top-3-Probleme", "Nach 72 h: Review (stabil? Retention?)", "Nach 7 Tagen: Update #1 ankündigen"]


def appendix_b():
    s = [PageBreak()]
    s += H1("Anhang B – Checklisten zum Abhaken", "ANHANG")
    s.append(H2("B.1 Pre-Launch-Checkliste"))
    for title, items in CHECK_PRE:
        s.append(H3(title))
        s += checks(items)
    s.append(H2("B.2 Launch-Tag und die ersten 7 Tage"))
    s += checks(CHECK_DAY)
    s.append(H2("B.3 Wöchentliches KPI-Blatt (kopieren)"))
    hdr = ["Kennzahl", "Woche 1", "Woche 2", "Woche 3", "Woche 4", "Ziel"]
    rows = [hdr] + [[m, "", "", "", "", z] for m, z in (("DAU (Ø)", "steigt"), ("D1-Retention", "≥ 30 %"), ("D7-Retention", "≥ 12 %"), ("D28-Retention", "steigt"), ("Ø Session (Min)", "≥ 15"),
                                                      ("Zahler-Quote", "2–3 %"), ("ARPDAU ($)", "messen"), ("Fehler-/Absturzrate", "< 0,5 %"), ("Größtes Problem", ""), ("Hypothese dieser Woche", ""), ("Ergebnis der letzten Hypothese", ""))]
    s += table(rows, [0.28, 0.14, 0.14, 0.14, 0.14, 0.16], zebra=False)
    s.append(H2("B.4 Monatliche Checks"))
    s += checks(["Creator Hub, DevForum und Newsroom auf Regeländerungen durchsehen (Auszahlung, Rewards, Altersregeln)", "Backup-/Restore-Test durchführen", "Anti-Exploit-Log auswerten, Konten prüfen",
                 "Einnahmen gegen Kosten abgleichen; Steuer-Rücklage aufstocken", "Event für nächsten Monat in 6-Wochen-Planung prüfen", "Community-Umfrage auswerten", "Eine Sache lernen/ausprobieren, die du noch nicht kannst"])
    return s


GLOSSARY = [
    ("A/B-Test", "Zwei Varianten gleichzeitig an verschiedene Spieler ausspielen, um zu sehen, welche besser wirkt."),
    ("ARPDAU", "Umsatz pro aktivem Spieler und Tag (Average Revenue Per Daily Active User)."),
    ("CCU", "Concurrent Users: Spieler, die gleichzeitig online sind."),
    ("Client", "Das Gerät des Spielers (Handy/PC). Darf nur bitten, nie entscheiden."),
    ("Config", "Eine Datei, in der alle Zahlen und IDs deines Spiels zentral stehen."),
    ("Creator Hub", "Roblox-Webseite (create.roblox.com) für Verwaltung, Analytics, Monetarisierung."),
    ("Creator Rewards", "Programm, das Entwickler anhand von Engagement (u. a. Spielzeit) belohnt ⚠ Details prüfen."),
    ("DAU", "Daily Active Users: aktive Spieler pro Tag."),
    ("DataStore", "Roblox-Cloud-Speicher für Spielerdaten."),
    ("DevEx", "Developer Exchange: Umtausch verdienter Robux in echtes Geld."),
    ("Developer Product", "Kaufbarer Artikel, der beliebig oft gekauft werden kann."),
    ("Discovery", "Roblox' System, das Spielern Spiele vorschlägt (Empfohlen für dich)."),
    ("D1 / D7 / D28", "Anteil der Spieler, die nach 1 / 7 / 28 Tagen wiederkommen (Retention)."),
    ("Experience", "Roblox-Wort für «Spiel»."),
    ("Exploit", "Schummelsoftware oder ein Fehler, der unerlaubte Vorteile erlaubt."),
    ("Explorer", "Studio-Fenster mit dem Objektbaum deines Spiels."),
    ("FTUE", "First-Time User Experience: die ersten Minuten eines Neulings."),
    ("Game Pass", "Einmalig kaufbarer, dauerhafter Vorteil."),
    ("Gate", "Entscheidungspunkt am Ende einer Phase: Weiter, Nachbessern oder Stopp."),
    ("Graybox", "Spielbare Rohversion mit Platzhalter-Grafik."),
    ("Hard Launch / Soft Launch", "Öffentlicher Start mit Marketing / öffentlich ohne Marketing zum Stabilisieren."),
    ("Hotfix", "Schnelle Fehlerbehebung außerhalb des normalen Update-Plans."),
    ("Idempotent", "Mehrfaches Ausführen hat nur einmal Wirkung (wichtig bei Käufen)."),
    ("KPI", "Schlüsselkennzahl (z. B. D1, Session, Zahler-Quote)."),
    ("Live-Ops", "Laufender Betrieb: Updates, Events, Community, Messen."),
    ("LocalScript", "Skript, das beim Spieler läuft (Oberfläche, Eingaben)."),
    ("Luau", "Roblox' Programmiersprache."),
    ("Maturity-Fragebogen", "Pflicht-Altersfreigabe-Fragen im Creator Hub."),
    ("ModuleScript", "Wiederverwendbare Skript-Bibliothek, die mit <font face='Mono'>require</font> geladen wird."),
    ("Output", "Studio-Fenster mit Meldungen und Fehlern deines Codes."),
    ("Premium", "Roblox-Abo; Entwickler werden für Spielzeit von Premium-Nutzern vergütet ⚠."),
    ("ProcessReceipt", "Server-Funktion, die Käufe von Developer Products bestätigt."),
    ("Rate-Limit", "Begrenzung, wie oft eine Aktion pro Sekunde erlaubt ist (gegen Spam/Cheats)."),
    ("RemoteEvent", "Briefkasten für Nachrichten zwischen Client und Server."),
    ("Retention", "Wiederkehr-Quote: Wie viele Spieler kommen zurück."),
    ("Robux", "Roblox-Währung."),
    ("Rojo", "Werkzeug, das Code-Dateien ins Studio synchronisiert."),
    ("Script", "Skript, das auf dem Server läuft."),
    ("Server", "Roblox-Rechner, auf dem das Spiel läuft. Entscheidet über alles Wichtige."),
    ("Service", "Roblox-Baustein (z. B. Players, DataStoreService) oder ein Modul deines Spiels."),
    ("Sitzungssperre", "Markierung im DataStore, dass ein Server gerade den Spieler bearbeitet."),
    ("Thumbnail", "Das große Vorschaubild deines Spiels im Store."),
    ("Tipalti", "Zahlungsdienst, über den DevEx ausgezahlt wird."),
    ("UserId", "Eindeutige Zahl eines Roblox-Kontos."),
    ("Zahler-Quote", "Anteil der Spieler, die mindestens einmal kaufen."),
]


def appendix_c():
    s = [PageBreak()]
    s += H1("Anhang C – Glossar", "ANHANG")
    rows = [["Begriff", "Bedeutung"]] + [["<b>%s</b>" % a, b] for a, b in GLOSSARY]
    s += table(rows, [0.24, 0.76])
    return s


PROMPTS = [
    ("Fehler im Output", "Ich arbeite an Schritt [Nummer] im Handbuch. Im Output steht folgende rote Zeile: [KOMPLETTE ZEILE EINFÜGEN]. Hier ist ein Screenshot meines Explorers: [BILD]. Was ist falsch und was soll ich genau klicken?"),
    ("Mein Loop", "Mein Spiel in 5 Sätzen: [AKTION], [BELOHNUNG], [ERSTES UPGRADE], [ERSTES ZIEL], [SOZIALES ELEMENT]. Baue mir daraus nach dem 7-Schritte-Rezept (Kapitel 5.1) Server-Code, Client-Code, Config-Werte und einen Testplan."),
    ("Ökonomie", "Meine Spielschleife: [BESCHREIBUNG]. Schlage mir Quellen, Senken, Preise und eine Meilenstein-Tabelle für die ersten 60 Minuten vor, und erkläre mir, wie ich sie in Google Sheets nachrechne."),
    ("Beta-Zahlen", "Meine Beta-Zahlen: D1 [..] %, D7 [..] %, Session [..] Min, Zahler-Quote [..] %, größte Absprungstelle im Trichter: [..]. Was ist das größte Problem und welche EINE Änderung teste ich als Erstes (mit Hypothese und Messung)?"),
    ("Store-Seite", "Mein Spiel: [1-SATZ-LOOP], Zielgruppe [..]. Schreibe mir 5 Titelvorschläge (DE/EN), 3 Beschreibungstexte und 5 Thumbnail-Ideen mit Bildaufbau."),
    ("Creator-Pitch", "Hier ist das Video eines Creators: [LINK/BESCHREIBUNG]. Schreibe mir eine kurze, persönliche Anfrage (DE + EN) mit Early-Access und Code."),
    ("Update planen", "Meine letzten Zahlen: [..]. Plane mir das Wochen-Update (Mo–Fr) und das nächste Monats-Event: Inhalt, Aufwand, Messgröße, Teaser-Clips."),
    ("Wochen-Review", "Hier sind meine KPI der letzten 4 Wochen: [TABELLE]. Zeige mir Trends, Auffälligkeiten und die 3 wichtigsten Entscheidungen für nächste Woche."),
]

TROUBLE = [
    ("Spiel startet nicht / weißer Bildschirm", "Output prüfen; oft fehlt ein Objekt oder ein Name ist falsch.", "Kapitel 4.3, Tabelle."),
    ("«Infinite yield possible …»", "WaitForChild wartet ewig auf ein Objekt, das es nicht gibt.", "Name/Ort im Explorer vergleichen."),
    ("«Script timeout: exhausted allowed execution time»", "Eine Schleife läuft ohne Pause.", "<font face='Mono'>task.wait()</font> in Schleifen einbauen."),
    ("Spielstand speichert nicht (nur im Studio)", "API-Zugriff aus.", "Game Settings → Security (Kapitel 3.4), Studio neu starten."),
    ("«Request was throttled / 429» in Warnungen", "Zu viele DataStore-Anfragen.", "Autosave-Intervall nicht verkürzen; nur speichern, wenn etwas geändert wurde (macht das Kit)."),
    ("Kaufdialog öffnet nicht", "ID ist 0 oder Pass nicht «zum Verkauf».", "ID in Config prüfen, Pass-Seite prüfen, veröffentlichtes Spiel testen."),
    ("Käufe kommen doppelt an", "Belohnung im Client oder ohne Kauf-ID-Prüfung.", "Nur im ProcessReceipt belohnen (macht das Kit)."),
    ("Spieler wird mit «Daten werden noch gespeichert» getrennt", "Sitzungssperre eines anderen Servers.", "Nach 1–2 Minuten erneut beitreten; Sperren laufen nach 120 s ab."),
    ("Alles ruckelt auf dem Handy", "Zu viele Parts/Partikel/Skripte pro Frame.", "Kapitel 5.8; MicroProfiler (Strg+F6)."),
    ("Studio stürzt ab", "Speicher/Plugin.", "Plugins deaktivieren, Autosave-Wiederherstellung beim Neustart nutzen."),
    ("Spiel wird moderiert/entfernt", "Verstoß gegen Richtlinien oder falsche Einstufung.", "Hinweis im Creator Hub lesen, Fragebogen/Inhalte anpassen, Einspruch einlegen."),
]


def appendix_d():
    s = [PageBreak()]
    s += H1("Anhang D – Hilfe holen", "ANHANG")
    s.append(P("Du musst nie allein weiterkommen. Je genauer deine Meldung, desto schneller die Lösung."))
    s.append(H2("D.1 So meldest du ein Problem"))
    s += numbered(["Schreibe die <b>Schritt-Nummer</b> aus diesem Handbuch.", "Kopiere die <b>komplette rote Zeile</b> aus dem Output (nicht abtippen).", "Mache einen <b>Screenshot vom Explorer</b> (aufgeklappt) und, wenn es um Oberfläche geht, vom Spiel.",
                   "Beschreibe: <b>Was habe ich erwartet? Was ist passiert?</b>", "Sage dazu, ob es im <b>Studio</b> oder im <b>veröffentlichten Spiel</b> passiert."])
    s.append(callout("tip", "Echte Screenshots kann ich dir nicht liefern, aber <b>deine</b> kann ich lesen. Schick sie mir einfach im Chat: Dann zeige ich dir die genaue Stelle und passe das Handbuch für dich an."))
    s.append(H2("D.2 Prompt-Bibliothek (kopieren, Klammern ausfüllen)"))
    for t, p in PROMPTS:
        s.append(P("<b>%s</b>" % t, "small", textColor=NAVY, spaceAfter=1))
        s.append(snippet(p, 7.6))
    s.append(H2("D.3 Typische Probleme"))
    s += table([["Symptom", "Ursache", "Lösung"]] + [[a, b, c] for a, b, c in TROUBLE], [0.32, 0.32, 0.36])
    return s


SOURCES = [
    ("Roblox Newsroom: Optimizing Discovery (Juni 2026)", "https://about.roblox.com/newsroom/2026/06/optimizing-discovery-great-games-reach-millions-players-roblox"),
    ("Roblox Creator Hub: Discovery", "https://create.roblox.com/docs/discovery"),
    ("Roblox Creator Hub: Creator Rewards", "https://create.roblox.com/docs/en-us/creator-rewards.md"),
    ("Roblox Creator Hub: Developer Exchange", "https://create.roblox.com/docs/de-de/production/monetization/developer-exchange"),
    ("Roblox Creator Hub: Tax information", "https://create.roblox.com/docs/production/monetization/tax-information"),
    ("Roblox Form 10-Q (Q2 2026)", "https://www.sec.gov/Archives/edgar/data/0001315098/000162828026051082/rblx-20260630.htm"),
    ("Roblox Newsroom: Cube Foundation Model / 4D generation (Feb 2026)", "https://about.roblox.com/newsroom/2026/02/accelerating-creation-powered-roblox-cube-foundation-model"),
    ("Roblox: Altersprüfung für Chat (Jan 2026)", "https://www.nasdaq.com/press-release/roblox-requires-users-worldwide-age-check-access-chat-2026-01-07"),
    ("Dexerto: Top-Creator-Verdienste", "https://www.dexerto.com/roblox/robloxs-top-creators-average-65-7-million-a-year-but-most-make-far-less-3408675/"),
    ("TweakTown: Median-Verdienst", "https://www.tweaktown.com/news/113585/robloxs-top-10-creators-averaged-dollars65-7-million-each-while-the-median-made-dollars1500-and-roblox-everywhere-is-the-fix/index.html"),
    ("IBTimes: DevEx-Auszahlungen 2026", "https://www.ibtimes.co.uk/roblox-top-creators-devex-payouts-2026-1819403"),
    ("PocketGamer.biz: Steal a Brainrot 25 Mio. CCU", "https://www.pocketgamer.biz/robloxs-steal-a-brainrot-becomes-first-game-to-surpass-25m-concurrent-players"),
    ("GameAnalytics: 2025 Roblox Report", "https://www.gameanalytics.com/cn/reports/2025-roblox-report"),
    ("RoWatcher: Launch-Playbook 2026", "https://rowatcher.com/news/how-to-launch-a-roblox-game-in-2026-the-pre-launch-playbook"),
    ("RoWatcher: DevEx-Kurs (umstritten)", "https://rowatcher.com/news/the-real-roblox-devex-rate-in-2026-it-s-not-0-0035"),
    ("RoLearn: DevEx-Anforderungen (umstritten)", "https://rolearn.dev/guidance/roblox-devex-requirements-2026"),
]


def appendix_e():
    s = [PageBreak()]
    s += H1("Anhang E – Quellen und Stand", "ANHANG")
    s.append(P("Recherchestand: 9. Oktober 2026. Die Seiten von <font face='Mono'>create.roblox.com</font> waren aus meiner Umgebung nicht erreichbar (Netzwerkrichtlinie); die dortigen Aussagen stammen aus Suchzusammenfassungen. Sekundärquellen (Blogs, Presse) können sich irren. <b>Entscheidend ist immer, was im Creator Hub steht.</b>"))
    for t, u in SOURCES:
        s.append(Paragraph(symfix("• %s<br/><font size='8' color='#2563EB'><a href='%s' color='#2563EB'>%s</a></font>" % (t, u, u)), ParagraphStyle("src", parent=S["body"], leftIndent=10, spaceAfter=4)))
    s.append(H2("Technische Hinweise zum Starter-Code"))
    s += bullets(["Repo: <font face='Mono'>game/</font> (Rojo-Projekt, <font face='Mono'>src/</font>, <font face='Mono'>tests/</font>); Tests laufen mit einer Luau-Laufzeit (siehe <font face='Mono'>game/tests/README.md</font>).",
                  "Dieses PDF wird aus <font face='Mono'>docs/handbuch/src/</font> erzeugt und kann mit <font face='Mono'>python3 docs/handbuch/src/build.py</font> neu gebaut werden.",
                  "Alle Luau-Beispiele im Handbuch wurden mit einem Luau-Parser auf Syntax geprüft."])
    return s
