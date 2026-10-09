# -*- coding: utf-8 -*-
from lib import *
import diagrams as D
import snippets as SN


def chapter6():
    s = [PageBreak()]
    s += H1("Kapitel 6 – Testen, Beta und Messen", "TESTEN  ·  WOCHE 5–15")
    s.append(P("Dein Bauchgefühl ist wertvoll, aber <b>Fremde mit Zahlen</b> entscheiden. In diesem Kapitel lernst du, wie du Spieltests richtig durchführst, eine geschlossene Beta aufsetzt und die richtigen Zahlen liest."))
    s.append(H2("6.1 Playtest: so läuft ein guter Test"))
    s.append(step("6.1", "Der 30-Minuten-Playtest", [
        "<b>Wer:</b> 5–10 Menschen <b>aus deiner Zielgruppe</b>, die dein Spiel nicht kennen. Kinder nur mit Einverständnis der Eltern, am besten mit Elternteil in der Nähe.",
        "<b>Setup:</b> Sie spielen auf <b>ihrem</b> Gerät (Handy!). Du schaust zu oder siehst per Bildschirmteilung zu. Bitte sie, <b>laut zu denken</b>.",
        "<b>Deine Regel:</b> 10 Minuten lang <b>nichts erklären, nicht helfen</b>. Jede Frage, die gestellt wird, ist ein Fehler im Spiel, nicht beim Tester.",
        "<b>Notieren:</b> Sekunden bis zur ersten Aktion, bis zur ersten Belohnung; Stellen mit Stirnrunzeln; Verwirrung; <b>wo hört er auf?</b>",
        "<b>Nachgespräch (3 Fragen):</b> Was war das Beste? Was hat genervt? Was würdest du einem Freund sagen? Und: <b>«Würdest du morgen wieder spielen? Warum (nicht)?»</b>"]))
    s += table([["Beobachtungsbogen", "Tester 1", "Tester 2", "Tester 3"],
                ["Sekunden bis zur ersten Aktion", "", "", ""], ["Sekunden bis zur ersten Belohnung", "", "", ""], ["Stelle der ersten Verwirrung", "", "", ""],
                ["Hört auf nach … Minuten (warum?)", "", "", ""], ["Hat verstanden, was das Ziel ist? (ja/nein)", "", "", ""], ["Würde morgen wieder spielen? (ja/nein)", "", "", ""]],
                [0.4, 0.2, 0.2, 0.2], zebra=False)
    s.append(P("<b>Auswertung:</b> Zähle die Probleme. Behebe die <b>3 häufigsten</b>, nicht die 30. Teste erneut mit <b>anderen</b> Menschen (Wiederholer sind voreingenommen)."))
    s.append(H2("6.2 Closed Beta aufsetzen (Woche 12)"))
    s.append(P("In der Closed Beta spielen nur Eingeladene. So sammelst du <b>echte Retention-Daten</b>, ohne dass das Spiel öffentlich ist. Das Kit hat dafür das Modul <b>BetaGate</b> eingebaut (getestet): Wer nicht auf der Liste steht, wird freundlich getrennt."))
    s.append(step("6.2", "Beta-Zugang konfigurieren", [
        "1. In <font face='Mono'>Config</font> setzen: <font face='Mono'>Config.BETA_ONLY = true</font>.",
        "2. Tester eintragen: <font face='Mono'>Config.BETA_ALLOWLIST[123456789] = true</font> (die Zahl ist die <b>UserId</b>; Profil-Adresse <font face='Mono'>roblox.com/users/ZAHL/profile</font>). Oder <font face='Mono'>Config.BETA_GROUP_ID</font> auf deine Gruppe setzen: alle Mitglieder ab <font face='Mono'>BETA_MIN_RANK</font> dürfen rein.",
        "3. Das Spiel auf <b>Öffentlich</b> stellen (aber <b>ohne Werbung</b> und ohne es zu bewerben). Wer nicht auf der Liste steht, kann es zwar öffnen, wird aber sofort getrennt.",
        "4. Tester einladen: Link zum Spiel schicken. Bitte um <b>Ehrlichkeit</b>, nicht um Lob.",
        "5. <b>Zum Launch</b>: <font face='Mono'>BETA_ONLY = false</font> und neu veröffentlichen (nicht vergessen, siehe Launch-Checkliste)."]))
    s.append(callout("tip", "Beta-Tester <b>motivieren</b>: Ein Beta-Abzeichen (Roblox Badge), ein exklusives Haustier, ein Eintrag in den «Danksagungen». Sammle Rückmeldungen in einem einzigen Ort (Formular oder Discord-Kanal)."))
    s.append(H2("6.3 Die Zahlen, die zählen (KPIs)"))
    s += table([["Kennzahl", "Bedeutung", "Gute Richtwerte*"],
                ["<b>DAU</b>", "aktive Spieler pro Tag", "Trend nach oben, <b>auch ohne Werbung</b>"],
                ["<b>D1-Retention</b>", "Anteil, der am Tag nach dem ersten Besuch wiederkommt", "Min. 25 %, Ziel ≥ 30 %"],
                ["<b>D7-Retention</b>", "… nach 7 Tagen", "Min. 8 %, Ziel ≥ 12 %"],
                ["<b>D28-Retention</b>", "… nach 28 Tagen (zählt für Discovery!)", "Trend beobachten; je höher, desto besser"],
                ["<b>Ø Session</b>", "durchschnittliche Spielzeit pro Besuch", "Min. 10 Min, Ziel ≥ 15 Min"],
                ["<b>Zahler-Quote</b>", "Anteil der Spieler, die etwas kaufen", "Min. 1 %, Ziel 2–3 %"],
                ["<b>ARPDAU</b>", "Umsatz pro aktivem Spieler und Tag", "Eigenen Wert messen; Modell nutzt 0,05 $ nur als Annahme"],
                ["<b>Absturz-/Fehlerrate</b>", "Sessions mit Fehler", "unter 1 %, Ziel unter 0,5 %"]],
                [0.2, 0.46, 0.34])
    s.append(P("* Meine Daumenregeln aus Benchmarks (z. B. GameAnalytics: Kurzsessions unter 10 % D1) und Praxis. <b>Keine Roblox-Vorgaben.</b> Im Creator Hub kannst du dein D1 mit <b>ähnlichen Spielen</b> vergleichen: das ist der bessere Maßstab. Ziel: obere Hälfte.", "small"))
    s.append(fig(262, D.d_kpi, "Dein Montags-Dashboard (Skizze): vier Kennzahlen mit Ampel plus DAU-Kurve. Reiter-Namen im Creator Hub können abweichen."))
    s.append(P("<b>Wo finde ich das?</b> Creator Hub → dein Spiel → <b>Analytics</b> (Reiter wie Engagement, Retention, Monetization, Acquisition, Performance; Namen können abweichen). Die Kit-Ereignisse (Onboarding-Trichter, Economy-Events) erscheinen dort nach einiger Zeit ⚠ (Anzeige ggf. mit Verzögerung)."))
    s.append(H2("6.4 Der Verbesserungs-Kreislauf (jede Woche)"))
    s += numbered(["<b>Messen:</b> Montag Dashboard: Wo ist der größte Absprung im Trichter?", "<b>Hypothese:</b> «Wenn ich X ändere, steigt D1 von A auf B, weil …» (aufschreiben!).",
                   "<b>Bauen:</b> nur <b>eine</b> Änderung pro Test (sonst weißt du nicht, was gewirkt hat).", "<b>Ausrollen:</b> an alle oder per A/B (unten).",
                   "<b>Lernen:</b> nach 7 Tagen: Hat sich die Zahl bewegt? Ja → behalten. Nein → zurück, nächste Hypothese."])
    s.append(P("<b>A/B-Test im Spiel:</b> Weise Spieler dauerhaft einer Gruppe zu (gleiche UserId = gleiche Gruppe) und logge die Gruppe als Ereignis. Beispiel (die Funktion gehört in Main oder ein eigenes Modul):"))
    s.append(snippet(SN.AB_TEST, 6.8))
    s.append(P("Außerdem kannst du <b>Thumbnails/Icons</b> im Creator Hub testen lassen (A/B-Test der Store-Bilder; Menü im Creator Hub nachsehen ⚠). Das ist der günstigste Hebel für mehr Besucher."))
    s += H2f("6.5 Diagnose: Was tun bei schlechten Zahlen?", 270)
    s.append(fig(190, D.d_quad, "Die Vier-Felder-Diagnose: Retention und Reichweite getrennt betrachten."))
    s.append(H2("6.6 Beta-Technik: der Härtetest"))
    s += checks(["<b>100-mal Beitreten/Verlassen</b> (z. B. mit Test → Clients and Servers) ohne Datenverlust.", "<b>Mehrspieler</b>: ≥ 8 Clients gleichzeitig, kein Lag-Anstieg, keine Fehler im Server-Log (F9 → Server-Log).",
                 "<b>DataStore-Ausfall simulieren</b> (Internet am PC kappen oder API-Schalter aus): Das Spiel darf niemanden mit leeren Daten starten lassen (macht das Kit).", "<b>Restore-Plan</b>: Wie stellst du einen Spielstand wieder her? (Datensicherung des DataStore-Eintrags, Ablauf aufschreiben.)",
                 "Auf <b>3 verschiedenen Geräten</b> spielen: Low-End-Handy, Tablet, PC.", "Alle <b>Käufe</b> einmal mit Testkonto durchführen und die Gutschrift prüfen."])
    s.append(H2("6.7 Beta-Umfrage (nach Tag 2 und Tag 7)"))
    s += bullets(["Wie hat dir das Spiel gefallen? (1–5)", "Was war dein Lieblingsmoment?", "Was war verwirrend oder nervig?", "Wie wahrscheinlich ist es, dass du es Freunden empfiehlst? (0–10)", "Was fehlt dir? (Freitext)", "Würdest du für … Geld ausgeben? Was würdest du kaufen?"])
    s.append(H2("6.8 Die Gates G-2 und G-4 (Ampel-Entscheidung)"))
    s += table([["Metrik", "Mindestens", "Ziel", "Gate"],
                ["Spaß-Test (G-2): freiwillig ≥ 10 Min gespielt", "7 von 10", "9 von 10", "Woche 6"],
                ["Spaß-Test: «würde wieder spielen»", "50 %", "70 %", "Woche 6"],
                ["Beta (G-4): D1-Retention", "25 %", "≥ 30 %", "Woche 15"], ["Beta: D7-Retention", "8 %", "≥ 12 %", "Woche 15"],
                ["Beta: Ø Session", "10 Min", "≥ 15 Min", "Woche 15"], ["Beta: Zahler-Quote", "1 %", "2–3 %", "Woche 15"], ["Beta: Fehler-/Absturzrate", "unter 1 %", "unter 0,5 %", "Woche 15"]],
                [0.5, 0.17, 0.17, 0.16])
    s.append(callout("warn", ["<b>Stopp- und Pivot-Regeln (vorher festlegen!):</b>",
                              "• G-2 nach 2 Iterationen verfehlt → Pivot oder Stopp. Prototyp-Kosten sind klein.",
                              "• G-4: nach zwei zusätzlichen 2-Wochen-Zyklen immer noch D1 &lt; 15 % oder D7 &lt; 3 % → Pivot oder <b>Stopp</b>.",
                              "• Gute Retention, aber zu wenig Zahler → Monetarisierung überarbeiten, nicht den Loop."], "KILL-REGELN"))
    return s


def chapter7():
    s = [PageBreak()]
    s += H1("Kapitel 7 – Launch: Store-Seite, Marketing, Start", "LAUNCH  ·  WOCHE 16–19")
    s.append(P("Ein gutes Spiel, das niemand findet, hilft keinem. Der Launch besteht aus <b>drei Teilen</b>: einer Store-Seite, die klickt, Inhalten, die neugierig machen, und einem Start-Tag, an dem alles gleichzeitig passiert."))
    s.append(H2("7.1 Die Store-Seite (Icon, Thumbnails, Titel)"))
    s.append(P("Spieler entscheiden in ca. <b>1 Sekunde</b> auf einem kleinen Bild, ob sie klicken. Das Thumbnail ist deine wichtigste Werbung."))
    s.append(fig(240, D.d_thumb, "Anatomie eines klickenden Thumbnails (Beispiel, selbst gezeichnet)."))
    s += table([["Element", "Regel"],
                ["<b>Icon</b>", "Quadratisch (laut Doku 512 × 512 ⚠), ein Motiv, auch klein erkennbar."],
                ["<b>Thumbnails</b>", "16:9 (laut Doku 1920 × 1080 ⚠), 3–5 Stück: (1) Hauptbild, (2) Aktion, (3) Belohnung/Seltenes, (4) Freunde/Multiplayer. Teste 3 Varianten (A/B im Creator Hub)."],
                ["<b>Titel</b>", "Kurz, merkbar, mit einem Suchbegriff (was ist es?). Keine Sonderzeichen-Orgie, keine Titel, die Marken nachahmen."],
                ["<b>Beschreibung</b>", "Zeile 1 = Versprechen. Danach 4–6 Stichpunkte (Features), Codes, Update-Rhythmus. Englisch zuerst, Deutsch ergänzen."],
                ["<b>Genre/Tags</b>", "Das passende Genre wählen; Maturity-Einstufung ehrlich."],
                ["<b>Social-Links</b>", "Nur über die dafür vorgesehene Funktion im Creator Hub, und nur altersgerechte Kanäle."]], [0.2, 0.8])
    s.append(KeepTogether([P("<b>Beschreibung (Vorlage):</b>"), snippet("""[SPIELNAME] – Sammle, verbessere, zeige es deinen Freunden!

* Starte in 10 Sekunden – ohne Anleitung
* Finde seltene [ITEMS] und baue deine Sammlung auf
* Spiele mit Freunden: gemeinsam gibt es Bonus-Belohnungen
* Neue Updates JEDE Woche, neue Events jeden Monat
* Code: LAUNCH (löse ihn im Spiel ein)""", 7.2)]))
    s.append(H2("7.2 Kurzvideos, die neugierig machen"))
    s.append(P("TikTok, YouTube Shorts und Instagram Reels (alle erst ab 13) sind dein günstigster Marketing-Kanal. <b>Gameplay-Previews mit gängigem Audio schlagen polierte Trailer.</b>"))
    s += table([["Sekunde", "Was passiert", "Beispiel"], ["0–1", "<b>Hook:</b> stärkster Moment sofort", "Die seltenste Belohnung, ein riesiger Zahlensprung"], ["1–5", "Kernaktion zeigen", "Wie man es spielt, ohne Erklärtext"],
                ["5–15", "Fortschritt im Zeitraffer", "Level 1 → Level 30 in 10 Sekunden"], ["15–25", "«Wow» oder Social", "Freunde, Event, selten, lustig"], ["25–30", "Aufruf + Name", "«Spiele [SPIEL]. Link in Bio.»"]], [0.14, 0.38, 0.48])
    s += bullets(["<b>Hochformat 9:16</b>, Text-Einblendung in den ersten 2 Sekunden, Untertitel.", "<b>Rhythmus:</b> ab Woche 6 zwei Clips pro Woche («Devlog»), zum Launch 15–20 Clips auf Vorrat.",
                  "<b>Ideen-Fundus:</b> Vorher/Nachher, «Level 1 gegen Level 100», seltenes Item, lustige Fails, Wochen-Event-Teaser, Community-Highlights, «Ich baue ein Roblox-Spiel – Tag 17» (Entwickler-Tagebuch).",
                  "<b>Nutze nur lizenzierte Musik</b> (aus der Plattform-Bibliothek)."])
    s.append(H2("7.3 Creator-Zusammenarbeit"))
    s += numbered(["Liste <b>30 kleine bis mittlere Creator</b> (10.000–500.000 Abos), die Roblox-Spiele deiner Art zeigen. Mega-Creator (Millionen) sind für dich unerreichbar und unnötig.",
                   "Schaue ihre letzten Videos: Zeigen sie <b>neue Spiele</b>? Wie sind Kommentare? Ist die Zielgruppe passend?",
                   "<b>Pitch kurz, persönlich, mit Link</b> zum Early-Access (Vorlage unten). Nie mehr als 3 Sätze Selbstlob.",
                   "<b>Konditionen:</b> kostenloser Early-Access, exklusive Items/Codes, bei größeren Deals Umsatzbeteiligung (5–15 % im ersten Monat laut einer Quelle ⚠, verhandelbar). <b>Immer schriftlich.</b>",
                   "Gib jedem Creator einen <b>eigenen Code</b> (z. B. <font face='Mono'>MAX</font>): Belohnung für Spieler und Auswertung, wer wie viele bringt."])
    s.append(snippet("""Betreff: Early-Access: [SPIELNAME] (neues Roblox-Spiel) für [KANALNAME]

Hi [Name],
ich habe dein Video «[Titel]» gesehen und glaube, mein neues Roblox-Spiel «[SPIELNAME]»
passt gut zu deinen Zuschauern: [1-Satz-Loop]. Hier ist der Early-Access-Link: [LINK].
Dein Code «[CODE]» gibt deinen Zuschauern [Belohnung].
Wenn du es zeigen möchtest: Launch ist am [DATUM]. Ich schicke dir gern Clips/Assets.
Danke dir! [Name]

(English: Hi [Name], I saw your video "[Title]" and think my new Roblox game "[GAME]" fits your
audience: [one-sentence loop]. Early-access link: [LINK]. Your code "[CODE]" gives viewers
[reward]. Launch is on [DATE]. Happy to send clips/assets. Thanks! [Name])""", 6.9))
    s.append(H2("7.4 Community (Discord ab 13)"))
    s += bullets(["<b>Kanäle:</b> #willkommen (Regeln), #news, #updates, #feedback, #bugs, #clips, #off-topic. Wenige Kanäle sind besser als viele leere.",
                  "<b>Regeln:</b> freundlich, keine Werbung, keine persönlichen Daten, keine Kontaktanfragen an Jüngere. Mindestens <b>2 Moderatoren</b>.",
                  "<b>Rhythmus:</b> Patchnotes jeden Freitag, Roadmap-Teaser jeden Sonntag, Umfragen vor großen Entscheidungen.",
                  "Plattform-Altersgrenzen (Discord/TikTok ab 13) beachten: bewirb diese Kanäle <b>nicht</b> gezielt an Jüngere."])
    s.append(H2("7.5 Werbung (Roblox Ads): erst rechnen, dann kaufen"))
    s.append(P("Roblox bietet bezahlte Werbung für Spiele (Creator Hub → Anzeigen/Ads; Name im Hub prüfen ⚠). <b>Die Regel:</b> Gib nie mehr aus, als ein neuer Spieler in 30 Tagen einbringt."))
    s.append(snippet("""Aktive Tage in 30 Tagen  ≈  1 + Summe der täglichen Retention
                         (Beispiel D1 30 %, D7 12 %, D28 5 %  →  ca. 4,3 Tage)
Wert eines neuen Spielers (30 Tage)  =  aktive Tage × ARPDAU × Entwickleranteil
                         =  4,3 × 0,05 $ × 0,22  ≈  0,05 $
→ Du darfst höchstens ca. 0,05 $ pro neuem Spieler bezahlen.""", 7.0))
    s.append(callout("warn", "Mit den Beispielzahlen lohnt sich Werbung <b>nur</b>, wenn Neuspieler sehr billig sind <b>oder</b> dein ARPDAU höher ist. Fange mit <b>kleinem Testbudget (300–500 €)</b> erst nach dem Soft Launch an, miss die echten Kosten pro Spieler und stoppe, wenn die Rechnung nicht aufgeht."))
    s += H2f("7.6 Der Launch-Plan (Runbook)", 270)
    s.append(fig(190, D.d_launch, "Von T-7 Tage bis +7 Tage nach dem Launch (Vorschlag)."))
    s.append(H3("Vor dem Launch: Betriebshandbuch aufschreiben"))
    s += checks(["<b>Überwachung:</b> Wer schaut wann auf CCU, Fehlerrate (F9 → Server-Log), Käufe, Discord-Meldungen? Schichtplan für die ersten 72 Stunden.",
                 "<b>Hotfix-Weg:</b> Änderung im Studio → Test → Publish. Bei Notfällen: <b>Server neu starten</b> (Option im Creator Hub, Name prüfen ⚠), damit alte Server die neue Version bekommen.",
                 "<b>Rollback:</b> Version im Versionsverlauf wiederherstellen (Creator Hub). Einmal in der Beta geübt?",
                 "<b>Notfallschalter:</b> Ein Config-Schalter, der Shop oder ein Feature abschaltet (Config ändern → veröffentlichen → Server neu starten).",
                 "<b>Datensicherung:</b> Wie holst du einen Spielstand zurück? Ablauf aufschreiben.", "<b>Eskalation:</b> Wen rufst du bei Datenverlust, Exploit oder Kaufproblemen? (Eine Person + Stellvertretung.)"])
    s.append(H2("7.7 Soft Launch, dann Hard Launch"))
    s.append(P("Quellen widersprechen sich (leise starten vs. am Starttag pushen). <b>Meine Empfehlung: beides, nacheinander.</b> Eine Woche <b>öffentlich, aber ohne Werbung</b> zum Stabilisieren (Soft Launch, Woche 18), dann ein <b>konzentrierter</b> Push an einem festen Tag (Hard Launch, Montag Woche 19)."))
    s += table([["Gate G-6 (Ende Soft Launch)", "Bedingung"], ["Stabilität", "keine P0-Bugs (Datenverlust, Käufe, Abstürze)"], ["Retention", "D1 ≥ 80 % des Beta-Werts"], ["Wirtschaft", "keine Exploits/Duplikationen; Münzen pro Spieler/Stunde plausibel"],
                ["Betrieb", "Server-/DataStore-Warnungen im grünen Bereich; Runbook von einer zweiten Person gegengelesen"]], [0.3, 0.7])
    s.append(callout("do", "<b>Launch-Tag (Montag, Woche 19):</b> Beta-Schalter AUS · Update live · Creator-Posts <b>am selben Tag</b> · Ankündigung in Discord · Werbung an (klein) · 72-Stunden-Bereitschaft. Detaillierte Checkliste: Anhang B.", "START"))
    s.append(H2("7.8 Letzte Prüfung (Recht und Plattform)"))
    s += checks(["Fragebogen (Maturity/Alter) aktuell und wahrheitsgemäß.", "<b>Impressum + Datenschutz</b> auf Website/Link-in-Bio, wenn du geschäftsmäßig Social-Kanäle betreibst (Impressumspflicht prüfen) ⚠.",
                 "Alle Assets lizenziert (Musik, Bilder, Modelle). Keine Marken im Namen.", "Keine direkte Kaufaufforderung an Kinder im Spiel (siehe 5.4).", "Steuerliche Erfassung mit Steuerberater geklärt (Kapitel 9.6)."])
    return s


def chapter8():
    s = [PageBreak()]
    s += H1("Kapitel 8 – Live-Betrieb und Wachstum", "LIVE-OPS  ·  AB WOCHE 20")
    s.append(P("Erst im Betrieb entscheidet sich, ob dein Spiel wächst. Der Rhythmus aus <b>messen, verbessern, ausliefern</b> ist alles. Plane diese Phase wie einen zweiten Job."))
    s.append(H2("8.1 Der Wochenrhythmus (fester Kalender)"))
    s += table([["Tag", "Aufgabe", "Ergebnis"],
                ["<b>Mo</b>", "KPI-Review (Anhang B): D1/D7/D28, Session, Zahler-Quote, DAU, Fehler. Hypothese festlegen.", "Wochenziel"],
                ["<b>Di–Mi</b>", "Entwickeln: kleines Update (neue Items/Quests) + ein Test (A/B).", "Build"],
                ["<b>Do</b>", "Test (Mehrspieler, Handy), Patchnotes schreiben, Clips vorbereiten.", "Release-Kandidat"],
                ["<b>Fr</b>", "<b>Release</b> (vor dem Wochenende: viele Spieler online). Danach 2 Stunden Beobachtung.", "Update live"],
                ["<b>Sa–So</b>", "Community-Post, Roadmap-Teaser, Support. Nichts Riskantes veröffentlichen.", "Bindung"]], [0.12, 0.66, 0.22])
    s.append(H2("8.2 Event-Kalender 2027 (Vorschlag)"))
    s += table([["Zeitraum", "Anlass", "Was du tust"],
                ["Feb 2027", "Hard Launch", "Launch-Event + Launch-Item (nur kurz verfügbar)"],
                ["Mär 2027", "Frühling, Ostern (So 28.03.)", "Oster-Event: Sammel-Eier, Themen-Items (keine Echtgeld-Zufallskisten!)"],
                ["Mai–Jun 2027", "Sommer-Start", "Zone/Update «Sommer», Ferien-Boost vor Schulferien"],
                ["Jul–Aug 2027", "Sommerferien (Haupt-Traffic)", "Wöchentliche Mini-Events, Creator-Aktion"],
                ["Okt 2027", "Halloween (So 31.10.)", "Halloween-Event, Themenwelt (ca. 6 Wochen vorher planen)"],
                ["Nov 2027", "Black Friday (26.11.)", "Rabatt-Event (Preis kurz senken, ehrlich kommunizieren)"],
                ["Dez 2027", "Winter/Weihnachten", "Winter-Event, Jahresrückblick, Dank an die Community"],
                ["Feb 2028", "1. Geburtstag (15.02.)", "Jubiläums-Event, Feier-Item"]], [0.2, 0.3, 0.5])
    s.append(P("Plane Events <b>6 Wochen im Voraus</b>: Woche 1–2 Entwurf, 3–4 Bau, 5 Test, 6 Teaser. Schulferien-Termine unterscheiden sich je Land: <b>Wichtig ist die Zielgruppen-Ferienzeit</b>, nicht nur Deutschland.", "small"))
    s.append(H2("8.3 Update-Ideen nach Aufwand"))
    s += table([["Aufwand", "Beispiele", "Wirkung"], ["<b>Klein</b> (1–2 Tage)", "Neue Items, Haustiere, Quests, Codes, Balance-Fixes, kleine Events", "Bindung, Gesprächsstoff"],
                ["<b>Mittel</b> (1 Woche)", "Neue Zone, neues System (z. B. Sammelbuch), Wochen-Event", "Reaktivierung, neue Clips"],
                ["<b>Groß</b> (3–6 Wochen)", "Saison, großes Feature, neue Spielart", "Neue Spieler, Presse, Creator-Buzz"]], [0.22, 0.52, 0.26])
    s.append(H2("8.4 Wachstums-Hebel (wenn die Zahlen stocken)"))
    s += table([["Symptom", "Wahrscheinliche Ursache", "Gegenmaßnahme"],
                ["Wenig Besucher, gute Retention", "Sichtbarkeit", "Thumbnail/Icon testen, Titel, Creator, Shorts, kleine Ads-Tests"],
                ["Viele Besucher, schlechte D1", "FTUE/Loop schwach", "Funnel prüfen, erste 60 s straffen, Ladezeit"],
                ["D1 gut, D7 schlecht", "Kein Grund für Wiederkehr", "Dailies/Quests, Events, Sammelbuch, Social-Bindung"],
                ["Gute D7, wenig Umsatz", "Shop zu schwach/unsichtbar", "Preisleiter prüfen, Shop-Zeitpunkt, Angebote an Erfolgsmomenten"],
                ["Viel Umsatz, viele Beschwerden", "Pay-to-Win-Gefühl", "Käufe auf Komfort/Optik zurückführen"],
                ["Exploits/Schummler", "Server vertraut Client", "Logs, Limits, Validierung, Ban-Prozess"]], [0.3, 0.27, 0.43])
    s.append(H2("8.5 Community und Moderation"))
    s += bullets(["<b>Antwortzeit:</b> Bug-Meldungen in 24 Stunden bestätigen. Danksagungen in den Patchnotes.", "<b>Ton:</b> ehrlich, freundlich, kurze Sätze; Fehler offen zugeben.",
                  "<b>Moderation:</b> Regeln sichtbar, Verwarnung vor Bann, bei Belästigung/Kindeswohl sofort Roblox melden. Mindestens 2 Moderatoren, nie allein.",
                  "<b>Feedback sammeln:</b> ein Ort (Formular/Kanal), monatliche Umfrage, öffentliche Roadmap."])
    s.append(H2("8.6 Team und Portfolio"))
    s += bullets(["<b>Erst wachsen, wenn es sich trägt:</b> Eine Rolle einstellen, wenn der <b>durchschnittliche Monatsüberschuss der letzten 3 Monate</b> sie bezahlt. Reihenfolge: Scripter → Builder/Artist → Community-Manager.",
                  "<b>Verträge schriftlich:</b> Aufgaben, Preis oder Umsatzbeteiligung, Rechte-Übertragung, Gruppenrolle statt Passwort.",
                  "<b>Portfolio-Denken (ab ca. Tag 60):</b> Technik (Daten, Shop, Analytics, Anti-Exploit) in eine <b>Vorlage</b> auslagern und ein zweites Experiment in 6–8 Wochen starten. Der Median verdient wenig, mehrere Schüsse erhöhen die Chance auf einen Treffer."])
    s.append(H2("8.7 Dich selbst schützen"))
    s += bullets(["<b>Festes Zeitbudget</b> pro Woche; ein freier Tag. Spiele leben Jahre, nicht Wochen.", "<b>Nie Updates an Freitagabend</b> ohne Bereitschaft; nie am Wochenende allein riskante Änderungen.",
                  "<b>Pausenplan:</b> Wenn du in den Urlaub willst, plane Events und Updates vorher (Vorrat von 2–3 kleinen Updates)."])
    s.append(H2("8.8 Reviews nach 30, 60, 90 Tagen"))
    s += table([["Zeitpunkt", "Fragen", "Entscheidung"],
                ["<b>30 Tage</b> (≈ 17.03.2027)", "Ist die Retention stabil? Wächst DAU ohne Werbung? Rechnet sich Werbung?", "Reichweiten- oder Produktproblem (Kapitel 6.5)"],
                ["<b>60 Tage</b> (≈ 16.04.2027)", "Trägt der Umsatz die laufenden Kosten? Funktioniert das Update-Tempo?", "Skalieren, halten, Pivot; zweites Experiment starten?"],
                ["<b>90 Tage</b> (≈ 16.05.2027)", "Break-even erreicht oder in Sicht? Zeit/Nutzen für dich?", "Fortsetzen · Skalieren · Wartungsmodus · Stopp"]], [0.24, 0.5, 0.26])
    return s
