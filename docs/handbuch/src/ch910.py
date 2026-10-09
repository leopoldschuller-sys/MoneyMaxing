# -*- coding: utf-8 -*-
from lib import *
import diagrams as D


def chapter9():
    s = [PageBreak()]
    s += H1("Kapitel 9 – Geld, Steuern und Recht", "GESCHÄFT")
    s.append(callout("warn", "Dieses Kapitel ist <b>keine Steuer- oder Rechtsberatung</b>. Es erklärt, wie das Geld fließt, rechnet Beispiele durch und gibt dir die richtigen Fragen für Steuerberater:in und Anwalt/Anwältin mit. Alle ⚠-Werte musst du im Creator Hub bestätigen."))
    s += H2f("9.1 Wie aus Spieler-Robux echtes Geld wird", 270)
    s.append(fig(190, D.d_devex, "Der Weg des Geldes. Jeder Schritt hat Abzüge oder Bedingungen."))
    s.append(H2("9.2 Auszahlung (DevEx) Schritt für Schritt"))
    s.append(step("9.2", "So kommst du an dein Geld", [
        "1. <b>Voraussetzungen prüfen</b>: Creator Hub → Developer Exchange (DevEx): Alter, verifiziertes Konto, Mindestmenge verdienter Robux ⚠ (30.000 oder 100.000? Quellen widersprechen sich).",
        "2. <b>Steuerformular</b> abgeben: als Nicht-US-Person <b>W-8BEN</b> (über Tipalti; ab 01.11.2026 wird die Steuerinfo in den Creator Hub («Taxes»-Seite) verlagert, Auszahlung bleibt über Tipalti).",
        "3. <b>Auszahlungsweg</b> in Tipalti wählen (z. B. Banküberweisung/PayPal). Jede Methode hat eine <b>Gebühr</b>; bei Umrechnung in EUR fällt eine <b>Währungsgebühr von ca. 1,9–3 %</b> an.",
        "4. Im Creator Hub <b>DevEx beantragen</b>. Bearbeitung dauert; plane Wochen, nicht Tage.",
        "5. <b>Auszahlen in sinnvollen Tranchen</b> (nicht jede Woche kleine Beträge) und <b>Rücklage für Steuern</b> bilden."]))
    s.append(H3("Rechenbeispiel (mit dem vorsichtigen Kurs 0,0035 $/Robux)"))
    s += table([["Schritt", "Rechnung", "Ergebnis"], ["Verdiente Robux", "100.000 Robux", "100.000"], ["Kurs", "100.000 × 0,0035 $", "350 $"],
                ["Währungsgebühr ca. 3 % (Worst Case)", "350 $ × 0,97", "≈ 339,50 $"], ["Tipalti-Transaktionsgebühr", "je nach Methode ⚠", "abziehen"],
                ["Steuer (DE)", "mit Steuerberater klären", "Rücklage bilden"]], [0.45, 0.35, 0.2])
    s.append(callout("check", "<b>Kurs unklar:</b> Quellen nennen <b>0,0035 $</b> (verbreitet), <b>0,0038 $</b> und <b>0,0054 $ für Robux von US-Erwachsenen seit Juni 2026</b>. Keine offizielle Bestätigung gefunden. Rechne <b>konservativ mit 0,0035</b>, bis du im Creator Hub den echten Wert siehst."))
    s.append(H2("9.3 Wie viel kommt von einem Euro an?"))
    s.append(P("Vereinfacht: Von dem, was ein Spieler ausgibt, behält Roblox etwa 30 % (Plattformanteil ⚠). Dazu kommt der Unterschied zwischen dem <b>Preis</b>, zu dem Spieler Robux kaufen, und dem <b>Kurs</b>, zu dem du sie auszahlen lässt:"))
    s.append(snippet("""Entwickleranteil  ≈  0,70 × DevEx-Kurs ÷ Robux-Kaufpreis
                  ≈  0,70 × 0,0035 ÷ (0,010 … 0,0125)   ≈  20 … 25 %

→ Von 1 € Spielerausgabe bleiben grob 20–25 Cent bei dir (vor Gebühren und Steuern).""", 7.4))
    s.append(H2("9.4 Szenarien: was ist realistisch?"))
    s.append(P("Die Rechnung verwendet <b>Annahmen, keine Fakten</b>: ARPDAU 0,05 $ (Umsatz pro aktivem Spieler und Tag), Entwickleranteil 22 %, also <b>0,011 $ pro DAU und Tag ≈ 4 $ pro DAU und Jahr</b>. Ersetze 0,05 $ so schnell wie möglich durch deinen echten Beta-Wert."))
    s.append(fig(222, D.d_scen, "Grobe Jahreserlöse bei verschiedenen durchschnittlichen DAU (logarithmische Skala)."))
    s += table([["Szenario", "Ø DAU", "Netto-Erlös / Jahr", "Einordnung"],
                ["Flop", "100", "≈ 400 $", "unter dem Median"], ["Median-Niveau", "500", "≈ 2.000 $", "etwa Median (≈ 1.500 $)"],
                ["Solide", "5.000", "≈ 20.000 $", "trägt Nebeneinkommen/Freelancer"], ["Starker Treffer", "50.000", "≈ 200.000 $", "selten"]], [0.25, 0.15, 0.25, 0.35])
    s.append(P("<b>Break-even-Beispiel:</b> Bei 3.000 $ Gesamtkosten in 6 Monaten brauchst du im Schnitt <b>ca. 1.500 DAU</b> (3.000 ÷ (0,011 × 182)). Die Creator Rewards (5 Robux pro qualifiziertem Spieler-Tag ⚠) sind <b>nicht</b> eingerechnet."))
    s.append(H2("9.5 Budget-Stufen (eigene Schätzungen)"))
    s += table([["Posten", "Lean", "Standard (Plan)", "Aggressiv"],
                ["Werkzeuge/Abos", "0–100 €", "100–300 €", "300 €"], ["Freelancer (UI, Icon, Thumbnails, Sound, Builder)", "0 €", "800–1.800 €", "4.000–8.000 €"],
                ["Roblox Ads / Creator-Deals", "0–100 €", "300–800 €", "3.000–6.000 €"], ["Steuerberater/Recht (Einrichtung)", "150–300 €", "200–400 €", "400–800 €"],
                ["<b>Summe</b>", "<b>≈ 150–500 €</b>", "<b>≈ 1.500–3.000 €</b>", "<b>≈ 8.000–15.000 €</b>"]], [0.46, 0.17, 0.2, 0.17])
    s.append(H2("9.6 Steuern und Recht in Deutschland: deine Fragenliste"))
    s.append(P("Buche in <b>Woche 1</b> ein Erstgespräch (ca. 60 Minuten). Bringe diese Fragen und Unterlagen mit:"))
    s += checks(["Ab wann liegt <b>Gewinnerzielungsabsicht</b> vor? Brauche ich ein <b>Gewerbe</b> oder bin ich freiberuflich eingestuft? <b>Fragebogen zur steuerlichen Erfassung</b> (ELSTER) wann und wie?",
                 "Wie behandle ich <b>Einnahmen aus den USA (DevEx über Tipalti)</b> in EUR (Umrechnung, Zuflusszeitpunkt)?", "<b>US-Quellensteuer</b> und <b>W-8BEN</b>/Doppelbesteuerungsabkommen DE–USA: Muss/kann ich etwas anrechnen?",
                 "<b>Umsatzsteuer:</b> Wie sind Leistungen an eine US-Plattform zu behandeln? Kleinunternehmerregel sinnvoll?", "<b>Betriebsausgaben:</b> Software, Freelancer, Werbung, Arbeitsplatz. Welche Belege brauche ich?",
                 "<b>Rechtsform:</b> Ab welchem Gewinn lohnt sich UG/GmbH? Haftung bei Kinderschutz-/Datenschutz-Vorfällen?", "<b>Verträge</b> mit Freelancern (Rechte-Übertragung) und Creatorn (Umsatzbeteiligung).",
                 "<b>Werbung und Kinder:</b> In Deutschland ist die unmittelbare Aufforderung an Kinder, Waren zu kaufen, wettbewerbsrechtlich problematisch (UWG, Anhang Nr. 28) ⚠: Wie formuliere ich Shop-Texte sicher?",
                 "<b>Impressum/Datenschutz</b> für Website und geschäftsmäßige Social-Accounts (DDG, DSGVO)."])
    s.append(H2("9.7 Plattform-Regeln im Blick behalten"))
    s += bullets(["Roblox ändert Auszahlungen, Rewards, Altersregeln und Oberfläche mehrmals im Jahr. <b>Quartalsweise</b> Creator Hub, DevForum-Ankündigungen und Newsroom lesen.",
                  "<b>Nie vom einem Programm abhängig machen</b> (z. B. Creator Rewards): Plane Einnahmen aus Käufen als Hauptsäule.", "<b>Meine Hinweis-Liste</b> offener Fakten steht in 9.8."])
    s.append(H2("9.8 Prüfliste: Das konnte ich nicht bestätigen"))
    s.append(P("Der Creator Hub war aus meiner Umgebung gesperrt. Diese Punkte musst du dort selbst nachsehen und hier ankreuzen, <b>bevor du Geld ausgibst</b>."))
    s += table([["", "Frage", "Was Quellen sagen", "Wo prüfen"],
                ["☐ F1", "<b>DevEx-Kurs</b>", "0,0035 / 0,0038 $; 0,0054 $ für US-Erwachsene ab 06/2026 (nicht offiziell bestätigt)", "Creator Hub → DevEx"],
                ["☐ F2", "<b>Mindestauszahlung</b>", "30.000 oder 100.000 verdiente Robux", "Creator Hub → DevEx"],
                ["☐ F3", "<b>DevEx-Voraussetzungen</b>", "Alter, ID-Verifizierung, evtl. Premium? Gruppen-Auszahlung?", "Creator Hub"],
                ["☐ F4", "<b>Plattformanteil</b> auf Käufe", "gängig 30 %, nicht neu bestätigt", "Creator Hub → Monetarisierung"],
                ["☐ F5", "<b>Pflichten für Kinder-Zielgruppen</b>", "Review-Stufen, Plus-Abo? (nur Sekundärquellen)", "Creator Hub, DevForum"],
                ["☐ F6", "<b>Bezahlte Zufallsitems</b>", "Quoten-Offenlegung, regionale Einschränkungen", "Roblox-Richtlinien"],
                ["☐ F7", "<b>Creator Rewards</b> (5 Robux/Spieler/Tag u. a.)", "nur aus Zusammenfassungen; Werbeanteil-Änderung ab 01/2027 gemeldet", "Creator Hub, DevForum"],
                ["☐ F8", "<b>Studio-Käufe</b>: kosten sie Robux?", "ungeprüft", "Creator-Hub-Doku"],
                ["☐ F9", "<b>Icon-/Thumbnail-Größen</b>", "512×512 / 1920×1080", "Creator-Hub-Doku"]], [0.08, 0.27, 0.43, 0.22])
    return s


def chapter10():
    s = [PageBreak()]
    s += H1("Kapitel 10 – Dein 19-Wochen-Fahrplan", "ZUM ABHAKEN")
    s.append(P("Eine Zeile pro Woche. Stunden sind Richtwerte bei 15–20 h/Woche. Wenn du hinterherhinkst: <b>streiche Inhalt, nie Tests</b>."))
    plan = [
        ("1", "12.10.", "Fundament", "Konto sichern, Studio, Baseplate veröffentlichen, API-Schalter, Gruppe; Steuerberater buchen; Prüfliste F1–F9", "G-0"),
        ("2", "19.10.", "Idee prüfen", "10-Fragen-Check, Marktscan (3–5 Spiele), Spielsteckbrief, Papier-Test", ""),
        ("3", "26.10.", "Kit einbauen", "Steckbrief fertig → <b>G-1</b>; Starter-Kit einbauen (Kap. 4), erster F5-Test, Mehrspieler-Test", "G-1"),
        ("4", "02.11.", "Dein Loop (Graybox)", "Platzhalter-Loop durch deinen ersetzen, Zahlen in Config, FTUE-Hinweise, erste Belohnung < 60 s", ""),
        ("5", "09.11.", "Daten & Test", "Analytics-Ereignisse prüfen, 100× Join/Leave, Playtest #1 mit 10 Personen", ""),
        ("6", "16.11.", "Iteration + Devlog", "Top-3-Probleme beheben, Devlog-Kanal starten (2 Clips/Woche) → <b>G-2</b>", "G-2"),
        ("7–8", "23.11.", "Inhalt (Zone 1–2)", "Items, Upgrades, Welten; Ökonomie-Tabelle; Sammelbuch/Quests starten", ""),
        ("9", "07.12.", "Shop", "Pass + Produkte anlegen, Preise, Shop-UI, Testkäufe, Kaufzeitpunkte festlegen", ""),
        ("10", "14.12.", "Bindung & Schutz", "Daily/Streak/Quests, Anti-Exploit-Review, Mobile-Performance, Safety-Fragebogen", ""),
        ("11", "21.12.", "Politur & Test", "Playtest #2/#3, Lokalisierung EN/DE, Bugfix; Weihnachtspause light → <b>G-3</b>", "G-3"),
        ("12", "28.12.", "Closed Beta Start", "BetaGate an, 100–300 Tester, tägliches Monitoring", ""),
        ("13–14", "04.01.", "Beta-Iteration", "Wöchentlicher Zyklus (Messen→Hypothese→Bauen→Lernen), Thumbnails testen, Umfrage", ""),
        ("15", "18.01.", "Beta-Abschluss", "Retention-Gate prüfen, Entscheidung Go/Iterieren/Stopp → <b>G-4</b>", "G-4"),
        ("16", "25.01.", "Store & Content", "Store-Seite, Thumbnails, Trailer, 15–20 Clips, Creator-Liste (30), Codes", ""),
        ("17", "01.02.", "Outreach & Runbook", "Creator-Pitches, Discord, Launch-Runbook, Generalprobe → <b>G-5</b>", "G-5"),
        ("18", "08.02.", "Soft Launch", "Öffentlich ohne Werbung, täglich Logs/Wirtschaft prüfen → <b>G-6</b>", "G-6"),
        ("19", "15.02.", "HARD LAUNCH", "Beta aus, Update live, Creator-Posts, Ads (klein), 72 h Bereitschaft, Update #1 nach 7 Tagen", ""),
        ("20+", "22.02.", "Live-Ops", "Wochenrhythmus (Kap. 8), Reviews nach 30/60/90 Tagen", "")]
    rows = [["Woche", "ab", "Thema", "Aufgaben", "Gate", "Erledigt"]]
    for w, d, t, a, g_ in plan:
        rows.append([w, d, "<b>%s</b>" % t, a, g_, "☐"])
    s += table(rows, [0.08, 0.08, 0.17, 0.5, 0.07, 0.1], valign="MIDDLE")
    s.append(H2("Wenn du in Verzug gerätst"))
    s += table([["Situation", "Reaktion"],
                ["1 Woche Verzug", "Puffer (Weihnachten) nutzen; Inhalt kürzen (eine Zone weniger)."],
                ["2–3 Wochen Verzug", "Launch um 2–3 Wochen schieben; <b>Reihenfolge der Gates nie umdrehen</b>."],
                ["Gate nicht bestanden", "Kill-Regeln aus Kapitel 6.8: bis zu zwei zusätzliche Zyklen, dann Pivot/Stopp."],
                ["Motivationstief", "Ein Wochenende ohne Roblox. Dann nur das kleinste nächste Stück bauen und testen."]], [0.3, 0.7])
    return s
