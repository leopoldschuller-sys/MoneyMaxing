# -*- coding: utf-8 -*-
from lib import *
import diagrams as D


def toc_page():
    s = H1("Inhaltsverzeichnis", "ÜBERSICHT")
    s[0:0] = []
    s.append(make_toc())
    return s


def readme_first():
    s = [PageBreak()]
    s += H1("Lies mich zuerst", "START")
    s.append(P("Du bringst die Idee mit. Ich liefere alles andere: den Fahrplan, die Einstellungen, den getesteten Grundcode, die Zahlen, die Vorlagen und die Entscheidungsregeln, damit aus deiner Idee ein Spiel wird, das auf Roblox wirklich funktionieren kann. Dieses Handbuch ist so gebaut, dass du es <b>von vorn nach hinten abarbeiten</b> kannst, ohne zu raten."))
    s.append(H2("So arbeitest du damit"))
    s += numbered([
        "<b>Kapitel 1–2</b> (ca. 1 Woche): verstehen, was auf Roblox funktioniert, und deine Idee darauf prüfen und schärfen.",
        "<b>Kapitel 3–4</b> (Woche 1–3): Konto, Studio und das Starter-Kit einrichten. Danach läuft schon ein kleines, speicherndes Spiel.",
        "<b>Kapitel 5–6</b> (Woche 4–15): dein Spiel bauen, testen, verbessern. Jede Phase endet mit einem <b>Gate</b>: Weitermachen, Nachbessern oder Stoppen.",
        "<b>Kapitel 7–9</b> (Woche 16–19 und danach): Launch, laufender Betrieb, Geld und Steuern.",
        "<b>Kapitel 10 und Anhang</b>: Wochenplan zum Abhaken, Code, Checklisten, Glossar, Hilfe."])
    s.append(gap(4))
    s.append(callout("do", "Fang heute mit <b>Kapitel 3, Schritt 3.1</b> an (Konto absichern). Das dauert 15 Minuten und blockiert nichts anderes. Den Rest der Woche 1 findest du in Kapitel 10.", "START"))
    s.append(H2("Ehrliche Hinweise (bitte kurz lesen)"))
    s += table([
        ["Thema", "Was du wissen musst"],
        ["<b>Abbildungen</b>", "Ich kann in meiner Arbeitsumgebung weder Roblox Studio noch den Creator Hub öffnen. Deshalb sind alle Bilder <b>von mir gezeichnete Skizzen</b> mit nummerierten Markern, <b>keine Original-Screenshots</b>. Menünamen können bei dir leicht anders heißen, weil Roblox die Oberfläche oft ändert. Wenn dein Bildschirm abweicht: <b>mach einen Screenshot und schick ihn mir</b>, ich zeige dir die richtige Stelle."],
        ["<b>Zahlen & Regeln</b>", "Die Roblox-Fakten stammen aus Suchergebnissen und Presseberichten (Stand 9. Okt 2026), nicht aus den offiziellen Creator-Hub-Seiten (die waren für mich gesperrt). Alles mit <b>⚠</b> ist unbestätigt und steht in Kapitel 9.8 als Prüfliste. Prüfe diese Punkte in Woche 1."],
        ["<b>Code</b>", "Der Starter-Code wurde in einer echten Luau-Umgebung mit nachgebauten Roblox-Diensten getestet (71 automatische Prüfungen, grün). <b>Nicht</b> getestet: die Oberfläche (Client), echte Roblox-Server, Handy-Leistung. Der erste Test in deinem Studio (Kapitel 4.3) ist deshalb Pflicht."],
        ["<b>Erfolg</b>", "Niemand kann Erfolg garantieren: Der Median der Roblox-Entwickler verdient laut Presseberichten rund 1.500 $ im Jahr. Dieses Handbuch maximiert deine Chancen und begrenzt dein Risiko, es verspricht kein Einkommen."],
        ["<b>Steuern & Recht</b>", "Keine Steuer- oder Rechtsberatung. Ich nenne dir die Fragen, die du einem Steuerberater stellen musst (Kapitel 9.6)."]],
        [0.2, 0.8])
    s.append(H2("Meine Annahmen über dich (sag Bescheid, wenn etwas nicht stimmt)"))
    s += table([
        ["Thema", "Annahme", "Wenn anders …"],
        ["Zeit", "15–20 Stunden pro Woche", "Mehr Zeit: Phasen verkürzen. Weniger: Phasen strecken, Gates bleiben."],
        ["Erfahrung", "Roblox Studio/Luau neu bis mittel", "Profi: Kapitel 3 überfliegen."],
        ["Budget", "1.500–3.000 € (Standard-Stufe, Kapitel 9.5)", "0–500 €: alles selbst, keine Werbung. 8.000 €+: Freelancer + Ads."],
        ["Standort", "Deutschland", "Andere Länder: Kapitel 9.6 anpassen."],
        ["Zielgruppe", "9–15 Jahre, weltweit, Englisch + Deutsch", "Ältere Zielgruppe hat andere Regeln (Kapitel 5.10)."]],
        [0.15, 0.4, 0.45], first_col_bold=True)
    s.append(H2("Der Gesamtplan auf einen Blick"))
    s.append(fig(262, D.d_gantt, "19 Wochen bis zum Launch (Start Mo 12.10.2026, Hard Launch Mo 15.02.2027). Jede Raute ist ein Gate: Go, Iterieren oder Stopp."))
    s.append(P("<b>Puffer:</b> Rechne mit +30 % Zeit (Weihnachten liegt mitten in Phase 3/4). Verschieben ist erlaubt, die <b>Reihenfolge der Gates nicht</b>."))
    s.append(H2("Symbole in diesem Handbuch"))
    sym = [["Symbol", "Bedeutung"],
           ["<font color='#0D9488'><b>MACH JETZT</b></font>", "Eine Aufgabe, die du jetzt erledigst."],
           ["<font color='#16A34A'><b>TIPP</b></font>", "Abkürzung oder Profi-Trick."],
           ["<font color='#DC2626'><b>ACHTUNG</b></font>", "Hier passieren die teuren Fehler."],
           ["<font color='#D97706'><b>PRÜFEN ⚠</b></font>", "Fakt ist nicht bestätigt. Vor dem Verlassen darauf selbst prüfen."],
           ["<font color='#7C3AED'><b>DEINE IDEE</b></font>", "Hier kommt DEINE Idee ins Spiel. Ich fülle das nicht für dich aus."],
           ["<b>Gate (G-0 … G-6)</b>", "Entscheidungspunkt: Weitermachen, Nachbessern oder Stoppen."]]
    s += table(sym, [0.25, 0.75])
    return s


def chapter1():
    s = [PageBreak()]
    s += H1("Kapitel 1 – Was auf Roblox wirklich funktioniert", "GRUNDLAGEN")
    s.append(P("Bevor du eine Zeile baust, solltest du wissen, nach welchen Regeln der Markt spielt. Dieses Kapitel ist kurz, aber es entscheidet über alles Weitere."))
    s.append(H2("1.1 Die Zahlen, die du kennen musst"))
    s += table([
        ["Fakt", "Zahl", "Was das für dich heißt"],
        ["Auszahlungen an Creator (12 Monate bis 30.06.2026)", "ca. <b>1,7 Mrd. $</b> (+ ca. 50 %)", "Der Markt wächst und zahlt wirklich. "],
        ["Top-10-Creator (Durchschnitt)", "ca. <b>65,7 Mio. $</b> je Creator", "Ausreißer. Nicht als Planung verwenden."],
        ["Top-1.000 (Durchschnitt)", "ca. <b>1,4 Mio. $</b>", "Auch hier: Spitze der Pyramide."],
        ["<b>Median</b> unter &gt; 42.000 DevEx-Teilnehmern", "ca. <b>1.500 $</b> pro Jahr", "<b>Das ist die ehrliche Basis.</b> Dein Ziel: darüber landen, mit kleinem Risiko."],
        ["Hits wie Grow a Garden / Steal a Brainrot", "bis ca. 25 Mio. gleichzeitige Spieler", "Zeigt: simple Loops, in Monaten gebaut, können explodieren. Aber das sind Einzelfälle."]],
        [0.38, 0.27, 0.35])
    s.append(P("Quellen: Presseberichte zu Roblox' Entwicklerkonferenz 2026 (Dexerto, TweakTown, IBTimes) und PocketGamer.biz, siehe Anhang E. Die Originalzahlen von Roblox habe ich nicht direkt gesehen.", "small"))
    s.append(callout("info", ["Roblox ist wie ein riesiger Spielplatz mit Millionen Spielen. Die meisten Spiele werden nie gefunden. Wer gefunden wird, wird es, weil Spieler <b>wiederkommen</b>, Freunde mitbringen und Geld ausgeben. Das misst Roblox, und dafür baust du."], "SO DENKT DER MARKT"))
    s.append(H2("1.2 Wie Spiele gefunden werden"))
    s.append(P("Roblox zeigt Spielern auf der Startseite «Empfohlen für dich». Laut Roblox Newsroom (Juni 2026) schaut dieser Empfehlungs-Algorithmus nicht mehr nur auf die letzten 7, sondern auf <b>28 Tage</b> und misst damit die <b>Langzeit-Retention</b>. Als Signale gelten u. a. Engagement, Wiederkehr, Freunde, die mitspielen, und Ausgaben."))
    s += bullets(["<b>Neue Spiele bekommen eine Chance</b>, aber nur, wenn Spieler in den ersten Tagen bleiben und wiederkommen.",
                  "<b>Werbung allein hilft nicht</b>: Wer Besucher kauft, die nach 2 Minuten gehen, schadet seinem Signal.",
                  "<b>Updates sind Marketing</b>: Ein Update ist ein Grund zurückzukommen und zeigt dem System, dass das Spiel lebt."])
    s.append(fig(168, D.d_retention, "Retention-Kurve: Anteil der Spieler, die an Tag 1, 7, 28 nach dem ersten Besuch wiederkommen (Beispiel, keine Messung)."))
    s.append(H2("1.3 Die 7 Gesetze eines erfolgreichen Spiels"))
    laws = [
        ("1", "Ein Satz erklärt das ganze Spiel", "«Ich sammle X, um Y zu verbessern und Z freizuschalten.» Verstehen Kinder das in 10 Sekunden nicht, versteht es der Algorithmus auch nicht, weil niemand bleibt. <b>Test:</b> Erkläre es einem 10-Jährigen."),
        ("2", "Erste Belohnung in unter 60 Sekunden", "Kurze Sessions sind das Problem: Spiele mit 0–6 Minuten Session haben laut GameAnalytics-Benchmark D1-Retention unter 10 % und kaum Umsatz. <b>Test:</b> Stoppuhr, Neuling-Konto, erste Belohnung?"),
        ("3", "Sessions von 10–20 Minuten", "Roblox' Creator Rewards setzen u. a. 10 Minuten Spielzeit voraus ⚠. Entwirf Spannungsbögen von 10–20 Minuten mit Zwischenzielen."),
        ("4", "Ein Grund für morgen", "Tägliche Belohnung, Serien, Sammlungen, Timer, Events. Ohne Grund für morgen ist D28 nahe null."),
        ("5", "Zusammen macht es mehr Spaß", "Freunde einladen, Co-op-Bonus, Handeln, Rangliste, Angeben mit seltenen Dingen. Das ist Wachstum ohne Werbebudget."),
        ("6", "Der Takt: jede Woche etwas Neues", "Kleine Wochen-Updates, große Monats-Events. Das ist dein Marketing-Motor."),
        ("7", "Läuft auf dem Handy", "Ein Großteil der Spieler spielt mobil. Große Knöpfe, kurze Ladezeit, keine Abstürze auf schwachen Geräten.")]
    for n, t, b in laws:
        s.append(step(n, t, b)); s.append(gap(4))
    s.append(callout("warn", "<b>Typische Anfängerfehler:</b> (1) erst riesige Welt bauen, dann prüfen, ob es Spaß macht; (2) Shop vor dem Spielspaß; (3) keine Daten messen; (4) kurz vor Launch Werbung kaufen; (5) alles allein in einem Monat schaffen wollen."))
    s.append(H2("1.4 Der Spielschleifen-Test"))
    s.append(P("Jedes erfolgreiche Spiel funktioniert auf <b>vier Zeitskalen</b> gleichzeitig. Du prüfst deine Idee gleich in Kapitel 2 daran, und baust später jede Funktion so, dass sie mindestens eine dieser Ebenen stärkt."))
    s.append(fig(168, D.d_loop, "Die vier Zeitskalen einer Spielschleife und je eine Testfrage."))
    return s


def chapter2():
    s = [PageBreak()]
    s += H1("Kapitel 2 – Deine Idee prüfen und schärfen", "IDEE")
    s.append(callout("idea", "Die Idee ist deine Sache. Dieses Kapitel hilft dir nicht beim Erfinden, sondern beim <b>Absichern</b>: Es zeigt dir, ob und wie die Idee auf Roblox tragen kann, bevor du Wochen investierst. Schreibe deine Antworten in den Spielsteckbrief (Vorlage unten)."))
    s.append(H2("2.1 Der 10-Fragen-Check"))
    s.append(P("Bewerte jede Frage mit <b>2</b> (klar ja), <b>1</b> (teils) oder <b>0</b> (nein). Sei streng: Ein «teils» ist meistens ein «nein»."))
    qs = [("1", "Kann ich den Loop in <b>einem Satz</b> erklären?"), ("2", "Kann ein Neuling in <b>unter 60 Sekunden</b> eine erste Belohnung bekommen?"),
          ("3", "Gibt es etwas zu <b>sammeln oder zu verbessern</b>, das nie ganz fertig wird?"),
          ("4", "Gibt es einen Grund, <b>Freunde mitzubringen</b> oder zu zeigen, was man hat?"),
          ("5", "Kann ich <b>jede Woche Neues</b> hinzufügen (Items, Zonen, Events), ohne alles umzubauen?"),
          ("6", "Kann ich eine spielbare <b>Graybox-Version in 3 Wochen</b> bauen?"),
          ("7", "Lässt sich das Spiel auf dem <b>Handy mit einem Daumen</b> bedienen?"),
          ("8", "Gibt es einen <b>10-Sekunden-Clip</b>, der neugierig macht (für TikTok/Shorts)?"),
          ("9", "Gibt es <b>3 ähnliche, erfolgreiche Spiele</b> (Beweis für Nachfrage) und ich kann <b>eine Sache klar anders/besser</b>?"),
          ("10", "Ist die Idee frei von <b>fremdem geistigen Eigentum</b> (Marken, Figuren, Musik) und <b>unbedenklich für Kinder</b>?")]
    rows = [["#", "Frage", "0 / 1 / 2"]] + [[n, q, "☐ 0   ☐ 1   ☐ 2"] for n, q in qs]
    s += table(rows, [0.06, 0.74, 0.2])
    s += table([["Summe", "Bedeutung"],
                ["<b>17–20</b>", "<font color='#16A34A'><b>Go.</b></font> Weiter mit dem Steckbrief und dem Marktscan."],
                ["<b>13–16</b>", "<font color='#D97706'><b>Nachschärfen.</b></font> Löse die Fragen mit 0/1 gezielt (meist 2, 5 oder 9), dann neu bewerten."],
                ["<b>unter 13</b>", "<font color='#DC2626'><b>Idee ändern.</b></font> Lieber jetzt eine Woche investieren als später 15."]], [0.2, 0.8])
    s.append(H2("2.2 Marktscan in 3 Stunden"))
    s.append(P("Du suchst <b>nicht</b> nach einer Idee, sondern nach <b>Beweisen und Lücken</b> für deine."))
    s += numbered([
        "Öffne Roblox → <b>Entdecken (Discover)</b>. Suche mit 5–8 Begriffen, die zu deiner Idee passen. Notiere für <b>3–5 ähnliche Spiele</b> in der Tabelle unten.",
        "Schau dir <b>Besucherzahlen, «Gefällt mir»-Quote und das Datum des letzten Updates</b> an. Viele Besucher + altes Update = Nachfrage ohne Pflege = Chance.",
        "Spiele jedes Spiel <b>15 Minuten als Neuling</b> (neues Konto). Stoppe: Wann kam die erste Belohnung? Wo hast du aufgehört?",
        "Lies die <b>Kommentare/Bewertungen</b>: Was nervt die Spieler? Das ist deine Lücke.",
        "Schreibe auf: <b>Was machst du anders in einem Satz?</b> Wenn dir nichts einfällt: zurück zu Frage 9."])
    s.append(gap(3))
    s += table([["Spiel", "Besucher / Gleichzeitig", "Letztes Update", "Erste Belohnung nach", "Was nervt?", "Meine Lücke"]] + [["", "", "", "", "", ""] for _ in range(4)], [0.17, 0.17, 0.14, 0.16, 0.18, 0.18], zebra=False)
    s.append(callout("tip", "Spiele mit <b>vielen Spielern und sehr alten Updates</b> sind die besten Zeichen: Die Nachfrage ist da, die Pflege fehlt. Genau dort schlägst du mit einem guten Wochentakt."))
    s.append(H2("2.3 Dein Spielsteckbrief (ausfüllen!)"))
    s.append(P("Speichere ihn als Datei <font face='Mono'>docs/concept/one-pager.md</font> in diesem Repo oder schreibe ihn auf Papier. Ohne Steckbrief startest du Kapitel 3 nicht zu Ende."))
    form = [["Feld", "Deine Antwort"],
            ["Arbeitstitel", ""], ["Ein-Satz-Loop (Gesetz 1)", ""], ["Zielgruppe (Alter, Interessen)", ""],
            ["30 Sekunden: Was tut der Spieler, was bekommt er?", ""], ["5 Minuten: Welches Upgrade/Item kommt als Nächstes?", ""],
            ["Session (10–20 Min): Was ist das «Wow»?", ""], ["Tage/Wochen: Warum kommt er morgen wieder?", ""],
            ["Erste Belohnung nach … Sekunden (Ziel: unter 60)", ""], ["Sozialer Haken (Freunde, Handel, Rangliste, Angeben)", ""],
            ["Was wird nie fertig? (Sammeln/Prestige)", ""], ["3 Konkurrenzspiele und mein Unterschied", ""],
            ["Art-Stil (z. B. Low-Poly, bunt)", ""], ["3 Monetarisierungs-Ideen (nur Komfort/Tempo/Optik)", ""],
            ["Größtes Risiko und wie ich es früh teste", ""]]
    t = table(form, [0.45, 0.55], zebra=False)
    # hoehere Zeilen zum Schreiben
    t[0].setStyle(TableStyle([("TOPPADDING", (0, 1), (-1, -1), 9), ("BOTTOMPADDING", (0, 1), (-1, -1), 9)]))
    s += t
    s.append(H2("2.4 Die Rote-Linie-Prüfung (vor dem ersten Bauen)"))
    s += checks([
        "<b>Kein fremdes IP:</b> Keine Marken, Charaktere, bekannte Memes mit Rechteinhaber, keine Musik/Bilder von außerhalb. Inspiration für <i>Mechaniken</i> ist okay, Namen/Assets/Texte müssen eigenständig sein.",
        "<b>Kinderschutz:</b> Keine Räume/Orte mit Bar/Club/Schlafzimmer-Charakter (Roblox schränkt solche Inhalte auf 17+ ein), keine Gewalt-Darstellung, die über die Alterseinstufung hinausgeht.",
        "<b>Keine Glücksspiel-Mechanik mit Echtgeld-Charakter</b> (z. B. Lootboxen ohne Quotenangabe). Details in Kapitel 5.4.",
        "<b>Keine Daten von Kindern sammeln</b> und keine Aufforderungen, Roblox zu verlassen (Chat, Social Media, Discord) im Spiel.",
        "<b>Ehrliche Darstellung:</b> Thumbnails/Beschreibung zeigen nur, was es im Spiel wirklich gibt."])
    s.append(callout("do", "Fülle den Check (2.1), den Marktscan (2.2) und den Steckbrief (2.3) aus. Das ist <b>Gate G-1</b>: Score mindestens 17, Loop in einem Satz erklärbar und mindestens 3 von 5 Testern aus der Zielgruppe wollen es spielen («Papier-Test»: Erkläre die Idee in 2 Minuten, frage «Würdest du das spielen?»). Bei Kindern nur mit Einverständnis der Eltern.", "GATE G-1 – bis spätestens Woche 3"))
    return s
