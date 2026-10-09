# Roblox-Game-Business — Gesamtplan von der Idee bis zum Live-Betrieb

**Stand:** 2026-10-09 · **Start:** Mo 2026-10-12 · **Hard Launch (Ziel):** Mo 2027-02-15 (Woche 19) · **Review nach 90 Tagen:** ~2027-05-16

> **So arbeitest du mit dem Plan:** Jede Phase endet mit einem **Gate** (Go / Iterieren / Stopp). Tasks sind Checkboxen (`- [ ]`) und werden der Reihe nach abgehakt. Alle Zahlen mit ⚠️ sind *nicht* aus einer offiziellen Roblox-Quelle bestätigt und müssen in Phase 0 geprüft werden (siehe Abschnitt 2b).

**Ziel:** In ~19 Wochen ein eigenes Roblox-Spiel von null bis zum öffentlich laufenden, monetarisierten Titel bringen und es danach datengetrieben zu einem profitablen Betrieb ausbauen — oder früh und billig stoppen, wenn die Daten es verlangen.

**Geschäftsmodell:** Free-to-play-Experience. Einnahmen aus (1) In-Experience-Käufen (Game Passes, Developer Products, Subscriptions), (2) engagementbasierten Auszahlungen (Creator Rewards / Premium-Anteil). Auszahlung in echtes Geld über Roblox **DevEx** (via Tipalti).

**Strategie in einem Satz:** Kleiner, simpler, schnell gebauter Spiel-Loop mit starker Retention und Live-Ops-Tiefe — statt eines „großen Wurfs" — und Portfolio-Denken (nach dem ersten Spiel ein weiteres Experiment auf wiederverwendbarer Technik).

**Tech-Stack:** Roblox Studio · Luau (typisiert) · Rojo + Git (dieses Repo) · Rokit/Aftman als Toolchain-Manager · Wally (Pakete) · StyLua + Selene (Format/Lint) · ProfileStore (Spielerdaten) · Roblox Creator Dashboard + `AnalyticsService` (Telemetrie) · Discord/TikTok/YouTube Shorts (Community, ab 13 Jahren) · Google Sheets/CSV (Ökonomie- und Finanzmodell).

---

## 1. Annahmen (bitte korrigieren — der Plan passt sich an)

| Thema | Annahme | Wenn anders … |
|---|---|---|
| Team | Solo-Gründer:in + KI-Unterstützung (Claude Code für Luau), später 1–3 Freelancer | Bei Team: Phasen 2–3 parallelisieren (Scripter / Builder / UI) |
| Zeit | 15–20 h pro Woche | Bei 40 h/Woche Phasen ca. halbieren; bei 5 h/Woche verdreifachen |
| Skills | Programmierung Grundkenntnisse, Roblox Studio/Luau neu bis mittel | Bei Profi: Phase 0 Lernblock streichen (−1 Woche) |
| Budget | 1.500–3.000 € („Standard"-Stufe, Abschnitt 8) | Lean: alles selbst, 0–500 € · Aggressiv: 8.000 €+ mit Ads/Influencern |
| Standort | Deutschland (Steuer-/Rechtsfragen) | Andere Länder: Abschnitt 6.1 anpassen |
| Zielgruppe | 9–15 Jahre, global, Englisch primär + Deutsch | Älter/„17+" ist ein eigener Weg mit anderen Regeln |
| Ziel | Nebeneinkommen mit Option auf Vollzeit, wenn die 90-Tage-Daten es tragen | – |

---

## 2. Faktenlage

### 2a. Was die Recherche (Stand Okt 2026) ergeben hat

| Fakt | Quelle / Vertrauen |
|---|---|
| Creator-Auszahlungen ≈ **1,7 Mrd. $** in den 12 Monaten bis 30.06.2026 (≈ +50 % ggü. Vorjahr). Top-10 im Schnitt **65,7 Mio. $**, Top-100 **10,8 Mio. $**, Top-1.000 **1,4 Mio. $**, **Median unter >42.000 DevEx-Teilnehmern ≈ 1.500 $** | Presseberichte zu Roblox-RDC-Zahlen ([Dexerto](https://www.dexerto.com/roblox/robloxs-top-creators-average-65-7-million-a-year-but-most-make-far-less-3408675/), [TweakTown](https://www.tweaktown.com/news/113585/robloxs-top-10-creators-averaged-dollars65-7-million-each-while-the-median-made-dollars1500-and-roblox-everywhere-is-the-fix/index.html), [IBTimes](https://www.ibtimes.co.uk/roblox-top-creators-devex-payouts-2026-1819403)) — Originalquelle nicht direkt geprüft |
| **Extrem schiefe Verteilung:** Wenige Hits tragen fast alles. Der Median liegt bei ~1.500 $ pro Jahr. | s. o. |
| Viral-Hits entstehen mit simplen Loops in Monaten: *Grow a Garden* (Start März 2025, ~22 Mio. gleichzeitige Spieler, Entwickler war ein 16-Jähriger), *Steal a Brainrot* (25,4 Mio. CCU, Okt 2025) | [PocketGamer.biz](https://www.pocketgamer.biz/robloxs-steal-a-brainrot-becomes-first-game-to-surpass-25m-concurrent-players), [Wikipedia](https://en.wikipedia.org/wiki/Steal_a_Brainrot) — Ausreißer, **keine** Planungsgrundlage |
| **Discovery:** Die „Recommended for You"-Empfehlung wurde im Juni 2026 von einer 7-Tage- auf eine **28-Tage-Sicht** erweitert, die Langzeit-Retention misst; wiederkehrende Spieler, mitgebrachte Freunde und Ausgaben zählen als Qualitätssignal | [Roblox Newsroom Juni 2026](https://about.roblox.com/newsroom/2026/06/optimizing-discovery-great-games-reach-millions-players-roblox), [Creator Hub Discovery](https://create.roblox.com/docs/discovery) |
| **Creator Rewards** ersetzten am 23.07.2025 die alten Engagement-Based Payouts | [Roblox 10-Q 2026](https://www.sec.gov/Archives/edgar/data/0001315098/000162828026051082/rblx-20260630.htm) |
| Creator Rewards laut Doku-Zusammenfassung: *Daily Engagement Rewards* **5 Robux** pro qualifizierendem Spieler/Tag (Spiel muss unter den ersten 3 des Tages sein, ≥ **10 Min** Spielzeit, Spieler muss „Active Spender" sein); *Audience Expansion Rewards* **35 %** Umsatzbeteiligung auf die ersten 100 $ eines neuen/zurückkehrenden Spielers in 60 Tagen, setzt ≥ 100 DAU im Schnitt voraus | [Creator-Rewards-Doku](https://create.roblox.com/docs/en-us/creator-rewards.md) ⚠️ nur aus Suchzusammenfassung, nicht im Original gelesen |
| **Altersprüfung:** Seit Jan 2026 weltweit Pflicht-Altersprüfung (Face-Scan) für Chat-Zugang; Chat nach Altersgruppen getrennt | [Roblox/Nasdaq Press Release](https://www.nasdaq.com/press-release/roblox-requires-users-worldwide-age-check-access-chat-2026-01-07) |
| **Maturity-Fragebogen** für Experiences ist Pflicht (falsche Angaben → Entfernung/Sperre); unbewertete Experiences wurden entfernt; private Räume/Bars/Clubs nur für ID-verifizierte 17+ | Sekundärquellen (TechLoy, PocketGamer.biz) ⚠️ |
| **Steuern/Auszahlung:** Nicht-US-Entwickler geben bei Tipalti ein **W-8BEN** ab; ab **01.11.2026** wird die Steuer-Info in die „Taxes"-Seite im Creator Hub verlagert (Auszahlung bleibt Tipalti). Tipalti: Transaktionsgebühr je nach Methode + **1,9–3 %** Währungsgebühr | [Roblox Tax-Doku](https://create.roblox.com/docs/production/monetization/tax-information) |
| **KI-Tools:** Roblox *Cube* Foundation Model + *4D generation* (Feb 2026, Beta) beschleunigen 3D-Assets/Fahrzeuge | [Roblox Newsroom](https://about.roblox.com/newsroom/2026/02/accelerating-creation-powered-roblox-cube-foundation-model) |
| **Benchmarks:** Kurzsession-Spiele (0–6 Min) haben D1-Retention < 10 % und kaum Monetarisierung | [GameAnalytics 2025 Roblox Report](https://www.gameanalytics.com/cn/reports/2025-roblox-report) |

### 2b. Offene / widersprüchliche Punkte → in Phase 0 gegen offizielle Quellen prüfen

| # | Frage | Was Quellen sagen | Wo prüfen |
|---|---|---|---|
| F1 | **DevEx-Kurs** | $0,0035/Robux ([RoLearn](https://rolearn.dev/guidance/roblox-devex-requirements-2026)) vs. $0,0038 und **$0,0054 für US-18+-Spieler seit 08.06.2026** ([RoWatcher](https://rowatcher.com/news/the-real-roblox-devex-rate-in-2026-it-s-not-0-0035)); keine offizielle Bestätigung gefunden | Creator Hub → DevEx-Seite |
| F2 | **Mindestauszahlung** | 30.000 vs. 100.000 verdiente Robux | Creator Hub → DevEx |
| F3 | **DevEx-Voraussetzungen** (Alter, ID-Verifizierung, Premium?) | uneinheitlich | Creator Hub |
| F4 | **Plattformanteil** auf Käufe in Experiences | gängig 30 % — nicht neu bestätigt | Creator Hub → Monetarisierung |
| F5 | **Pflichten für Kids-/„Select"-Zielgruppen** (Review-Stufen, Plus-Abo?) | nur Sekundärquellen | Creator Hub / DevForum |
| F6 | **Paid Random Items:** Quoten-Offenlegung / regionale Einschränkungen | Richtlinie existiert (gem. meinem Wissen), aktueller Stand ungeprüft | Roblox Richtlinien |
| F7 | **Werbe-Umsatzbeteiligung** (Änderung ab Jan 2027 gemeldet) | Einzelquelle | DevForum |

> **Hinweis:** `create.roblox.com` war aus der Recherche-Umgebung gesperrt (Netzwerk-Policy). Die Creator-Hub-Seiten oben also bitte selbst öffnen — das ist Task 0.6.

### 2c. Konsequenz für den Plan

1. Realistische Erwartung: **Median ≈ 1.500 $/Jahr** — der Plan ist deshalb auf *billig testen, früh stoppen können, Gewinner skalieren* gebaut (Gates!).
2. Retention schlägt Reichweite: Discovery bewertet jetzt 28 Tage → Design von Tag 1 auf **Wiederkommen** (Dailies, Wochenziele, Sammlungen, Freunde).
3. **10 Minuten Session-Länge** ist doppelt relevant (Creator-Rewards-Schwelle ⚠️ + Retention-Benchmark).
4. Plattform-/Safety-Regeln ändern sich schnell → Compliance ist ein laufender Task, kein Einmal-Haken.

---

## 3. Zeitplan & Gates

| Phase | Woche | Zeitraum | Gate am Ende |
|---|---|---|---|
| 0 Fundament | W1 | 12.10.–18.10. | G-0: Accounts, Steuer, Toolchain stehen; offene Fragen F1–F7 geklärt |
| 1 Research & Konzept | W2–3 | 19.10.–01.11. | **G-1 Konzept** (01.11.) |
| 2 Prototyp / Vertical Slice | W4–6 | 02.11.–22.11. | **G-2 Spaß-Test** (22.11.) |
| 3 Alpha: Content, Ökonomie, Monetarisierung | W7–11 | 23.11.–27.12. | **G-3 Content-Complete** (27.12.) |
| 4 Closed Beta | W12–15 | 28.12.–24.01. | **G-4 Retention-Gate** (24.01.) |
| 5 Launch-Vorbereitung | W16–17 | 25.01.–07.02. | **G-5 Launch-Readiness** (07.02.) |
| 6 Soft Launch → Hard Launch | W18–19 | 08.02.–21.02. | **G-6 Go-Wide** (14.02.), Hard Launch Mo 15.02. |
| 7 Live-Ops & Wachstum | ab W20 | ab 22.02. | 30-/60-/90-Tage-Reviews |
| *Marketing-Spur (parallel)* | ab W6 | ab 16.11. | Devlogs, Community-Aufbau |

> **Puffer:** Realistisch +30 % einplanen (Weihnachten in Phase 3/4!). Verschiebung ist okay — Gates verschieben sich, Reihenfolge nicht.

---

## 4. Repo-Struktur (dieses Repo = Studio-Monorepo)

```
MoneyMaxing/
├── docs/
│   ├── plans/                     # dieser Plan + Folgepläne
│   ├── research/market-scan.md    # Phase 1
│   ├── concept/one-pager.md       # Phase 1
│   └── runbooks/launch.md         # Phase 5
├── game/                          # Rojo-Projekt (Phase 2+)
│   ├── default.project.json
│   ├── wally.toml
│   └── src/
│       ├── server/                # Services: Data, Economy, Shop, Anticheat
│       ├── client/                # UI, Input, Effekte
│       └── shared/                # Config, Typen, Remotes
├── data/
│   ├── economy.csv                # Quellen/Senken-Modell
│   └── kpi-weekly.csv             # wöchentliche KPIs
├── marketing/
│   ├── content-calendar.md
│   └── creator-outreach.md
└── business/
    ├── finance-model.csv
    └── tax-notes.md               # nur Notizen, keine Steuer-IDs/Zugangsdaten!
```

---

## 5. Phasen im Detail

### Phase 0 — Fundament (W1)

**Ergebnis:** Alles Administrative und Technische steht, die Faktenlücken (F1–F7) sind geschlossen.

- [ ] **0.1 Roblox-Account härten:** 2FA aktiv, E-Mail verifiziert, ID-Verifizierung (nötig für Funktionen/DevEx ⚠️ F3).
- [ ] **0.2 Studio-Gruppe anlegen** und Experience später **gruppenbesitzt** veröffentlichen (Teamzugriff, spätere Auszahlungsaufteilung). Auszahlungsmodalitäten für Gruppen-Robux klären.
- [ ] **0.3 Lernblock (Wochenende):** Roblox „Get Started"-Tutorials + einen Mini-Obby bauen; Luau-Grundlagen (Tabellen, Module, RemoteEvents, DataStores).
- [ ] **0.4 Toolchain installieren** (Versionen gegen aktuelle Releases prüfen):
  ```bash
  rokit init
  rokit add rojo-rbx/rojo
  rokit add UpliftGames/wally
  rokit add Kampfkarren/selene
  rokit add JohnnyMorganz/StyLua
  rojo init game
  rojo serve game/default.project.json   # im Studio per Rojo-Plugin verbinden
  ```
- [ ] **0.5 Steuer/Recht (Deutschland):** 60-Min-Erstgespräch mit Steuerberater:in: Gewinnerzielungsabsicht → Gewerbeanmeldung/„Fragebogen zur steuerlichen Erfassung" (ELSTER), Kleinunternehmerregelung, Umgang mit US-Quellensteuer/W-8BEN (Doppelbesteuerungsabkommen DE–USA), Umsatzsteuer auf Auslandseinnahmen. Eigenes Geschäftskonto. Notizen in `business/tax-notes.md`.
- [ ] **0.6 Offene Fragen F1–F7** in Creator Hub / DevForum klären und im Abschnitt 2b mit „✅ bestätigt am …" oder Korrektur nachtragen. **Wichtig:** Finanzmodell (Abschnitt 8) danach mit dem echten DevEx-Kurs neu rechnen.
- [ ] **0.7 Regeln festlegen („Kill-Rules"):** Zeitbudget pro Woche, Geldlimit pro Phase, und die Stopp-Kriterien aus Abschnitt 7 schriftlich festhalten — *bevor* Sunk-Cost-Gefühle entstehen.
- [ ] **0.8 Commit:** `git add -A && git commit -m "chore: tooling and project skeleton"`.

**G-0:** Alle Haken gesetzt, Finanzmodell mit echten Zahlen aktualisiert.

---

### Phase 1 — Research & Konzept (W2–3)

**Ergebnis:** Ein gewähltes, schriftlich beschriebenes Spielkonzept mit Score und Kill-Kriterien.

- [ ] **1.1 Marktscan** (`docs/research/market-scan.md`): Top 50 der Discover-Seite + 20 „Aufsteiger" der letzten 90 Tage erfassen (Genre, Core Loop, Monetarisierung, Ø Session, Update-Rhythmus, Thumbnail-Stil). Statistik-Seiten wie RoMonitor o. ä. als Hilfe.
- [ ] **1.2 Muster ableiten:** Was haben schnell gewachsene Spiele gemeinsam? (Einfacher Loop in 1 Satz erklärbar · sofortige Belohnung · Sammel-/Fortschrittsdrang · soziales Element: Handeln, Co-op, Vergleichen · häufige Events.)
- [ ] **1.3 5–8 Konzepte skizzieren** (je 5 Sätze) und per **Scorecard** bewerten:

  | Kriterium | Gewicht |
  |---|---|
  | Loop-Einfachheit (in 1 Satz erklärbar) | 20 |
  | Produktionsaufwand (Wochen bis Beta, solo machbar) | 20 |
  | Viraler/sozialer Haken (Clips, Freunde einladen) | 20 |
  | Live-Ops-Tiefe (Events, neue Inhalte billig nachlegbar) | 15 |
  | Monetarisierungs-Fit (ohne Pay-to-Win/Druck auf Kinder) | 15 |
  | Wettbewerbsdichte (Nische statt Klon-Schlacht) | 10 |

  Gewinner muss **≥ 70/100** erreichen.
- [ ] **1.4 One-Pager schreiben** (`docs/concept/one-pager.md`):
  - Zielgruppe & Altersfreigabe (Maturity-Fragebogen schon mitdenken)
  - **Core Loop auf 4 Zeitskalen:** 30 s · 5 Min · Session (10–20 Min) · Tag/Woche
  - **FTUE:** erste Belohnung < 60 s, erster Upgrade < 3 Min
  - Sozialer Haken (z. B. Co-op-Bonus, Handel, Rangliste, Show-off-Items)
  - Fortschritt bis ~20 Std. (Rebirth/Prestige-Schichten)
  - Monetarisierungsmenü (Roh-Liste)
  - Art-Stil: **Low-Poly/stilisiert** (günstig, mobil-tauglich, Cube-/Creator-Store-Assets nutzbar)
  - 3 USPs gegenüber den 3 nächsten Konkurrenten
  - **Kein Klon von Marken/Memes mit IP-Risiko:** Mechanik inspirieren lassen, Namen/Assets/Musik eigenständig.
- [ ] **1.5 Papier-Test:** Konzept 5 Personen aus der Zielgruppe (mit Einverständnis der Eltern) in 2 Min erklären; Verständnis + „würde ich spielen?" abfragen.

**G-1 (01.11.):** Konzept ≥ 70 Punkte · Loop in 1 Satz erklärbar · Produktionsschätzung ≤ 8 Wochen bis Beta · ≥ 3 von 5 Papier-Testern interessiert. *Fail →* neues Konzept aus der Scorecard (Runner-up) — max. 1 Zusatzwoche.

---

### Phase 2 — Prototyp / Vertical Slice (W4–6)

**Ergebnis:** Eine spielbare 10-Minuten-Scheibe mit Daten-Speicherung und Telemetrie.

- [ ] **2.1 Skeleton** in `game/src/{server,client,shared}`, Remotes zentral in `shared/Remotes.luau`, Config in `shared/Config.luau`.
- [ ] **2.2 Core Loop in Graybox:** Ein Map-Abschnitt, Platzhalter-Assets, Loop komplett spielbar, Zahlen in `Config`.
- [ ] **2.3 Daten-Schicht:** ProfileStore (Session-Locking), Schema-Version im Profil + Migrationsfunktion, Auto-Save/BindToClose, Fehlerpfad bei DataStore-Ausfall (Spieler nicht „leer" starten lassen!).
- [ ] **2.4 Server-Autorität von Anfang an:** Währung/Fortschritt nur serverseitig; jedes `RemoteEvent` validiert Typ/Wertebereich/Rate-Limit.
- [ ] **2.5 Telemetrie-Taxonomie** (`docs/concept/analytics.md`) und Implementierung: Onboarding-Funnel-Schritte, Economy-Events (Quelle/Senke), Custom-Events (`session_end`, `first_reward`, `quest_done`, `purchase_prompt_shown`, `purchase_completed`). API-Namen von `AnalyticsService` in der aktuellen Doku gegenprüfen.
- [ ] **2.6 FTUE bauen:** Pfeile/Hinweise, erste Belohnung < 60 s, kein Textwall.
- [ ] **2.7 Playtest #1:** 10 Personen (zuschauen, nicht erklären!). Notieren: Wo hängen sie? Wann hören sie auf?
- [ ] **2.8 Marketing-Spur starten:** Öffentlicher Devlog-Kanal (TikTok/YouTube Shorts/X), 2 Clips pro Woche aus dem Prototyp; Discord (Alter 13+) und Roblox-Gruppe vorbereiten.

**G-2 (22.11.):** ≥ 7/10 Tester spielen freiwillig ≥ 10 Min · ≥ 50 % „würde wieder spielen" · erste Belohnung < 60 s · 100 Join/Leave-Zyklen ohne Datenverlust. *Fail →* eine 2-Wochen-Iteration; danach noch nicht bestanden → Pivot auf Runner-up oder Stopp.

---

### Phase 3 — Alpha: Content, Ökonomie, Monetarisierung (W7–11)

**Ergebnis:** Spiel mit 2–3 Std. Content, vollständiger Ökonomie, Shop, Anti-Exploit und Mobile-Performance.

- [ ] **3.1 Ökonomie-Modell** (`data/economy.csv`): Quellen (Verdienste/Min), Senken (Upgrades, Rebirth), Zeit bis zum ersten/zehnten Upgrade, Inflationscheck. Ziel: Fortschrittskurve „schnell am Anfang, spürbar später".
- [ ] **3.2 Content-Pipeline:** 3 Zonen/Welten · ≥ 30 sammelbare Items mit Seltenheiten · 10+ Upgrades · Daily-Quests + Wochenziele · Sammelbuch (Completionist-Haken).
- [ ] **3.3 Retention-Mechaniken (wegen 28-Tage-Discovery):** Tägliche Login-Serie (mit Gnade), Wochenevent-Slot, Offline-Fortschritt, Gründe, Freunde einzuladen (Co-op-Bonus statt Zwang).
- [ ] **3.4 Monetarisierung implementieren** (nur *Komfort & Tempo*, kein Pay-to-Win in kompetitiven Teilen):
  - **Game Passes:** 2× Verdienst, Auto-Collect, VIP-Bereich/Tag, Extra-Slots
  - **Developer Products:** Währungspakete, zeitlich begrenzte Boosts, Timer-Skip
  - **Subscription (optional):** monatlicher VIP-Status mit täglichen Boni
  - **Premium-Nudge:** kleiner Premium-Vorteil (Premium-Spielzeit wird vergütet ⚠️)
  - **Preisleiter als Startpunkt:** 49 / 99 / 249 / 499 / 999 Robux; später per Test justieren
  - **Regeln:** Keine Zufalls-Kaufitems ohne Quoten-Angabe (F6) · keine künstliche Verknappung/Countdown-Druck auf Kinder · Prompts nicht in den ersten 3 Min.
- [ ] **3.5 Anti-Exploit & Sicherheit:** Server validiert alle Käufe/Belohnungen · `ProcessReceipt` idempotent · Rate-Limits auf Remotes · Logging verdächtiger Werte · Admin-Befehle nur serverseitig.
- [ ] **3.6 Performance (mobile first):** `StreamingEnabled`, Instanz-/Part-Budget, UI auf kleinen Bildschirmen, Test auf einem schwachen Android-Gerät; keine Abstürze auf Low-End.
- [ ] **3.7 Safety & Compliance:** Maturity-Fragebogen wahrheitsgemäß ausfüllen · nur Roblox-gefilterter Text (Chat/Nutzereingaben via TextService-Filter) · Melde-/Blockier-Wege intakt · keine externen Links/Kontaktaufforderungen im Spiel.
- [ ] **3.8 Art/Audio:** Stilguide (Farbpalette, Formen), Assets aus Creator Store (Lizenz prüfen) + Cube-Generierung; Musik/SFX nur lizenzierte Roblox-Audio-Assets.
- [ ] **3.9 Lokalisierung:** Auto-Übersetzung aktivieren (EN Hauptsprache + DE), alle UI-Texte über Tabellen statt Hardcoding.
- [ ] **3.10 Playtest #2 + #3:** je 10–15 Personen; Schwerpunkt Ökonomie-Gefühl, Shop-Verständnis, Absturz-/Lag-Meldungen.
- [ ] **3.11 Marketing-Spur:** 2 Clips/Woche weiter, erstes Thumbnail-/Icon-Konzept, Namens-/SEO-Check für Experience-Titel.

**G-3 (27.12.):** Content für ≥ 2–3 Std. · alle Shop-Items per Testkauf geprüft · Anti-Exploit-Review erledigt (Checkliste 3.5) · Ø Session im Playtest ≥ 15 Min · keine bekannten Datenverlust-Bugs.

---

### Phase 4 — Closed Beta (W12–15)

**Ergebnis:** Harte Retention- und Monetarisierungsdaten von echten Fremdspielern.

- [ ] **4.1 Zugriff begrenzen:** Experience nicht öffentlich, Zugang über Gruppe/Allowlist; Beta-Badge als Belohnung.
- [ ] **4.2 100–300 Beta-Spieler** werben (Discord 13+, Shorts/TikTok-Devlogs, Freundeskreise; nur mit altersgerechten Kanälen).
- [ ] **4.3 Metriken** täglich im Creator Dashboard: D1, D7 (D28 sobald Daten da), Ø Session, Onboarding-Funnel, Kaufquote, Crash-/Fehlerrate. Vergleichswerte ähnlicher Spiele im Dashboard als Referenz.
- [ ] **4.4 Wöchentlicher Iterationszyklus** (Mo–So): Top-3-Drop-offs aus dem Funnel → Hypothese → Änderung → Messung. *Eine* Änderung pro Hypothese.
- [ ] **4.5 Technik-Härtung:** DataStore-Budgets & Throttling unter Last, Teleport/Server-Hop, Mehrspieler-Test mit ≥ 8 Clients, Restore-Prozedur für Spielerdaten testen.
- [ ] **4.6 Thumbnails/Icon testen:** A/B-Test der Store-Bilder im Creator Hub (sobald Traffic da); 3 Varianten.
- [ ] **4.7 Umfrage in-game** (nach Tag 2 und Tag 7): „Was hat gefehlt?", NPS-Frage, Freitext.
- [ ] **4.8 Weihnachtspause einplanen:** Zwischen 24.12.–01.01. nur Monitoring + Hotfixes.

**G-4 (24.01.) — Retention-Gate (Daumenregeln, am Referenzwert der Vergleichsspiele im Dashboard nachschärfen):**
| Metrik | Mindestens | Ziel |
|---|---|---|
| D1-Retention | 25 % | ≥ 30 % |
| D7-Retention | 8 % | ≥ 12 % |
| Ø Session | 10 Min | ≥ 15 Min |
| Zahler-Quote | 1 % | 2–3 % |
| Sessions mit Fehler/Crash | < 1 % | < 0,5 % |

*Fail →* max. **2 weitere 2-Wochen-Zyklen**; wenn danach D1 < 15 % oder D7 < 3 %: Pivot (Loop/Zielgruppe) oder **Stopp**. Gute Retention, aber zu wenig Zahler → Monetarisierung überarbeiten, nicht den Loop.

---

### Phase 5 — Launch-Vorbereitung (W16–17)

**Ergebnis:** Store-Seite, Marketing-Material, Creator-Kontakte und Betriebshandbuch sind fertig.

- [ ] **5.1 Store-Seite:** Titel (Keyword-bewusst, nicht überlang), Icon, 3–5 Thumbnails (Gewinner aus 4.6), 30-Sek-Trailer, Beschreibung mit Features/Codes, korrekte Genre-/Alters-Einstufung, Social-Links.
- [ ] **5.2 Content-Vorrat:** 15–20 fertige Kurzvideos (Gameplay-Previews mit trending Audio performen oft besser als polierte Trailer).
- [ ] **5.3 Creator-Outreach** (`marketing/creator-outreach.md`): 30 kleine/mittlere YouTuber/TikToker aus der Roblox-Nische (10k–500k), Pitch + Presse-Kit + Early-Access-Link. Konditionen: Gratis-Items/Codes, bei größeren Deals Umsatzbeteiligung (Faustwert in Guides: 5–15 % des Umsatzes im ersten Monat ⚠️ Einzelquelle). **Mega-Creator nicht einplanen.**
- [ ] **5.4 Code-System im Spiel:** Redeem-Codes pro Creator (Zuordnung, Belohnung für Spieler *und* Creator-Tracking).
- [ ] **5.5 Roblox Ads:** Testbudget definieren (z. B. 300–500 €); Regel: Ausgabe nur, solange *Erwarteter Umsatz pro neuem Spieler (über 30 Tage) > Kosten pro neuem Spieler*. Wird nach Soft Launch gemessen, nicht vorher aufgedreht.
- [ ] **5.6 Community-Setup:** Discord (13+, Rollen, Regeln, Moderation), Roblox-Gruppe, Patchnotes-Kanal, Bug-Report-Formular. Hinweis: Plattform-Altersgrenzen beachten (Discord/TikTok 13+) → keine gezielte Ansprache unter 13 dort.
- [ ] **5.7 Rechtliches (DE):** Impressum und Datenschutz-Link für geschäftsmäßige Social-Accounts/Website (Impressumspflicht nach DDG prüfen) — im Zweifel kurz anwaltlich/steuerlich abklären.
- [ ] **5.8 Launch-Runbook** (`docs/runbooks/launch.md`): Monitoring-Dashboard, Hotfix-Weg (Version-History/Rollback), Kill-Switch (Feature-Flags per DataStore/MessagingService), Eskalationsplan, Moderations-Schichten, Restore-Prozedur.
- [ ] **5.9 Generalprobe:** Voll-Durchlauf als Neuling-Account (Install → Kauf → Auszahlung der Rewards); Test aller Zahlungswege mit Testkonto.

**G-5 (07.02.):** Launch-Checkliste 100 % grün · Runbook von einer zweiten Person gegengelesen · mind. 15 Creator zugesagt oder Pitch versandt.

---

### Phase 6 — Soft Launch → Hard Launch (W18–19)

Quellen widersprechen sich hier („erst leise starten" vs. „Push am Launch-Tag, weil das frühe Fenster zählt"). **Empfehlung: kombinieren** — 1 Woche leise zur Stabilisierung, dann ein *konzentrierter* Push an einem festen Tag.

**Soft Launch (08.02.–14.02.):**
- [ ] **6.1** Experience auf Public, **ohne** Marketing; nur Organik + Beta-Community.
- [ ] **6.2** Täglich: Fehlerlog, DataStore-Warnungen, Exploit-Meldungen, Economy-Anomalien (Währung pro Spieler/Stunde).
- [ ] **6.3** Hotfix-Takt bei Bedarf täglich; Kern-Balancing einfrieren.
- [ ] **6.4** Retention vs. Beta vergleichen.

**G-6 (14.02.) — Go-Wide:** Stabil (keine P0-Bugs) · D1 ≥ 80 % des Beta-Werts · keine Ökonomie-Exploits · Server-Kosten/DataStore-Budgets im grünen Bereich.

**Hard Launch (Mo 15.02. bis Fr 19.02.):**
- [ ] **6.5 T-7 Tage:** Creator mit Zeitplan briefen, Clips terminieren, Event/Launch-Bonus (Launch-Pet/Item) vorbereiten.
- [ ] **6.6 T-0:** Update live, Roblox Ads an (kleines Budget), alle Creator-Posts am **gleichen Tag**, Community-Announcement, Team in Bereitschaft.
- [ ] **6.7 Erste 72 h = War-Room:** Stündlich CCU/Fehler/Kauf-Funnel prüfen, Moderations-Schicht, Hotfix-Fenster, Server-Kapazität im Blick.
- [ ] **6.8 Tag 7:** Erstes Content-Update mit Ankündigung (Beweis, dass das Spiel lebt).

---

### Phase 7 — Live-Ops & Wachstum (ab W20)

**Wochenrhythmus (fest im Kalender):**

| Tag | Aktivität |
|---|---|
| Mo | KPI-Review (`data/kpi-weekly.csv`): D1/D7/D28, Ø Session, ARPDAU, Zahler-Quote, ARPPU, CCU-Peaks, Creator-Rewards-Einnahmen, Crash-/Report-Rate |
| Di–Mi | Entwicklung: kleines Update (neue Items/Quests) |
| Do | Test + Patchnotes |
| Fr | Release (vor dem Wochenende, wenn viele Spieler da sind) |
| So | Community-Post, Roadmap-Teaser |

**Zyklen:**
- [ ] **7.1 Wöchentlich:** kleines Content-Update · 1 A/B-Test (Preis, FTUE, Thumbnail) · Anti-Exploit-Log prüfen.
- [ ] **7.2 Monatlich:** größeres Event/Zone, saisonal (Halloween, Winter, Ostern, Sommerferien — Schulferien sind Traffic-Spitzen) mit eigenem Marketing-Push.
- [ ] **7.3 Retention-Fokus:** Alle Features mit D28 als Wirkungsmaß bewerten; Gründe für Rückkehr (Streaks, Saison-Pass, Gilden/Freunde, Sammelbuch).
- [ ] **7.4 Ökonomie pflegen:** Inflation prüfen, Senken nachlegen, nie rückwirkend Spieler „entwerten".
- [ ] **7.5 Reinvest-Regel:** Ads/Creator-Budget nur, solange *LTV (30 Tage) > Kosten pro Neuspieler*; sonst Budget zurück in Content.
- [ ] **7.6 Skalieren des Teams:** Erst wenn *Ø Monatsüberschuss über 3 Monate* die Kosten einer Rolle trägt: Reihenfolge Scripter → Builder/Artist → Community-Manager. Verträge für Umsatzbeteiligung schriftlich, Gruppen-Auszahlungen sauber dokumentiert.
- [ ] **7.7 Portfolio-Schritt (ab Tag ~60):** Tech (Daten-Layer, Shop, Analytics, Anti-Exploit) in Template auslagern → zweites Experiment in 6–8 Wochen. Median-Zahlen sprechen für mehrere Schüsse statt eines.
- [ ] **7.8 Geschäftlich:** Auszahlung nur in sinnvollen Tranchen (Tipalti-Gebühren, Währung 1,9–3 %), Rücklagen für Steuern, ab relevantem Gewinn Rechtsform-Frage (z. B. UG/GmbH) mit Steuerberater klären.

**Reviews:**
- **30 Tage (≈ 17.03.):** Diagnose: *Retention gut / Reichweite schlecht* → Marketing, Thumbnails, Ads, Creator. *Retention schlecht* → Produkt fixen/pivoten.
- **60 Tage (≈ 16.04.):** Skalieren / halten / Pivot-Entscheidung; zweites Experiment starten?
- **90 Tage (≈ 16.05.):** Fortsetzen · Skalieren (Team, Budget) · In „Wartungsmodus" überführen · Stopp. Entscheidung anhand von Break-even und Trend (Abschnitt 8).

---

## 6. Querschnitt

### 6.1 Steuern, Recht, Sicherheit
- DevEx-Einnahmen sind Einkommen → Erfassung/Anmeldung mit Steuerberater klären (Phase 0.5).
- **W-8BEN** in Tipalti/Creator Hub *Taxes*-Seite (Umstellung zum 01.11.2026 beachten); US-Quellensteuer & DBA mit Steuerberater.
- Kinderschutz: Keine personenbezogenen Daten sammeln, Chat nur über Roblox, keine Off-Platform-Kontaktaufforderung, Moderation.
- Musik/Assets/Marken: nur lizenziert oder selbst erstellt.
- Account-Sicherheit: 2FA, getrennte Admin-/Test-Accounts, keine Zugangsdaten im Repo.

### 6.2 Daten & Messung
- **North-Star-Metrik:** D28-Retention (passt zur Discovery-Logik).
- **Nicht** auf CCU optimieren (Thumbnail-/Influencer-Spitzen sagen wenig über Produktqualität).
- Ein Event-Namensschema, versioniert in `docs/concept/analytics.md`.

---

## 7. Stopp- und Pivot-Regeln (vorab festlegen)

| Situation | Entscheidung |
|---|---|
| G-1 verfehlt (Konzept) | Runner-up aus Scorecard, max. 1 Woche Verlust |
| G-2 nach 2 Iterationen verfehlt | Pivot oder Stopp — Prototyp-Kosten sind verschmerzbar |
| G-4: D1 < 15 % oder D7 < 3 % nach 2 Extra-Zyklen | Pivot oder Stopp |
| Soft Launch instabil | Hard Launch verschieben, nicht „durchziehen" |
| 30 Tage nach Launch: < 200 DAU *und* D1 < 25 % | Produktproblem → Fix-Sprint oder Stopp |
| 90 Tage: Einnahmen < Kosten *und* Trend flach | Wartungsmodus oder Stopp; Tech ins Template retten |

---

## 8. Finanzmodell

### 8.1 Formeln (Excel/Sheets: `business/finance-model.csv`)

```
Nettoerlös/Tag     = DAU × ARPDAU × Entwickleranteil
Entwickleranteil   ≈ 0,70 (Plattformanteil) × DevEx-Kurs ÷ Robux-Kaufpreis
                   ≈ 0,70 × 0,0035 ÷ (0,010 … 0,0125) ≈ 20–25 %      ⚠️ F1/F4 prüfen
Break-even-DAU     = Gesamtkosten ÷ (ARPDAU × Entwickleranteil × Tage)
```

**Grobe Aussage:** Von 1 € Spielerausgabe kommen etwa **20–25 %** bei euch an (nach Plattformanteil und DevEx-Kurs, vor Tipalti-Gebühren/Steuer). Wenn der DevEx-Kurs höher ist als im Modell (F1), wird es besser.

### 8.2 Szenarien (illustrativ — **Annahmen, keine Fakten**; ARPDAU 0,05 $, Entwickleranteil 22 % ⇒ 0,011 $/DAU/Tag ≈ 4 $/DAU/Jahr)

| Szenario | Ø DAU | Nettoerlös/Jahr (grob) | Einordnung |
|---|---|---|---|
| Flop | 100 | ≈ 400 $ | liegt unter dem Median |
| Median+ | 500 | ≈ 2.000 $ | etwa Median-Niveau (≈ 1.500 $) |
| Solide | 5.000 | ≈ 20.000 $ | trägt Nebeneinkommen/Freelancer |
| Starker Treffer | 50.000 | ≈ 200.000 $ | selten |

- Break-even bei **3.000 $** Gesamtkosten in 6 Monaten: **≈ 1.500 DAU im Schnitt**.
- Creator Rewards (5 Robux/qualifiziertem Spieler-Tag ⚠️) sind *nicht* im Modell; erst einrechnen, wenn bestätigt und mit echten Daten belegt.
- Ersetze ARPDAU (0,05 $) so früh wie möglich durch den **echten Beta-Wert** (Phase 4).

### 8.3 Budget-Stufen (eigene Schätzungen, anpassen)

| Posten | Lean | Standard (Plan) | Aggressiv |
|---|---|---|---|
| Tools/Abos | 0–100 € | 100–300 € | 300 € |
| Freelancer (UI/Icon/Thumbnails/Sound/Builder) | 0 € | 800–1.800 € | 4.000–8.000 € |
| Roblox Ads / Creator-Deals | 0–100 € | 300–800 € | 3.000–6.000 € |
| Steuerberater/Recht (Setup) | 150–300 € | 200–400 € | 400–800 € |
| **Summe** | **≈ 150–500 €** | **≈ 1.500–3.000 €** | **≈ 8.000–15.000 €** |

---

## 9. Risiken

| Risiko | Wahrscheinlichkeit | Wirkung | Gegenmaßnahme |
|---|---|---|---|
| Spiel findet kein Publikum (typisch!) | hoch | hoch | Kleiner Scope, Gates, Marketing-Spur ab Woche 6, Portfolio-Ansatz |
| Plattformregeln/Kurse ändern sich (DevEx, Creator Rewards, Alters-/Safety-Regeln) | hoch | mittel–hoch | Quartalsweise Doku-Review; nicht von einem Programm abhängig machen |
| Exploits zerstören Ökonomie | mittel | hoch | Server-Autorität, Logging, Rate-Limits, Restore-Plan |
| Datenverlust | niedrig–mittel | sehr hoch | ProfileStore, Schema-Migration, Restore-Test |
| Moderations-/Kinderschutz-Vorfall | mittel | hoch | Roblox-gefilterter Chat, Moderationsplan, keine Off-Platform-Kontakte |
| Burnout/Zeitmangel | hoch | hoch | Feste Wochenstunden, kleiner Scope, Puffer, Stopp-Regeln |
| Steuerfehler (DE/US) | mittel | mittel | Phase 0.5, laufende Buchhaltung |
| Klon-/IP-Vorwürfe | niedrig–mittel | mittel | Eigene Namen/Assets, keine Marken |
| Creator-Marketing wirkungslos | mittel | mittel | Viele kleine Creator, Tracking per Codes, Ads-ROI-Regel |

---

## 10. Nächste 7 Tage (Start Montag, 12.10.)

1. **Mo:** Task 0.1 + 0.2 (Account, 2FA, ID-Verifizierung, Studio-Gruppe).
2. **Di:** Task 0.6 — Creator-Hub-Seiten lesen (DevEx, Creator Rewards, Taxes, Monetarisierung, Maturity-Fragebogen) und Abschnitt 2b ergänzen.
3. **Mi:** Task 0.5 — Steuerberater-Termin buchen (Frageliste aus 0.5 mitnehmen).
4. **Do:** Task 0.4 — Toolchain & Rojo-Skeleton; erster Commit.
5. **Fr/Sa:** Task 0.3 — Mini-Obby bauen (Studio-Gefühl), Luau-Grundlagen.
6. **So:** Task 0.7 — Kill-Rules schriftlich; Phase-1-Marktscan vorbereiten (Liste der Top-50).

---

## Quellen

- Roblox Newsroom, *Optimizing Discovery* (Juni 2026): https://about.roblox.com/newsroom/2026/06/optimizing-discovery-great-games-reach-millions-players-roblox
- Roblox Creator Hub — Discovery: https://create.roblox.com/docs/discovery
- Roblox Creator Hub — Creator Rewards: https://create.roblox.com/docs/en-us/creator-rewards.md
- Roblox Creator Hub — DevEx: https://create.roblox.com/docs/de-de/production/monetization/developer-exchange
- Roblox Creator Hub — Tax information: https://create.roblox.com/docs/production/monetization/tax-information
- Roblox Form 10-Q (Q2 2026): https://www.sec.gov/Archives/edgar/data/0001315098/000162828026051082/rblx-20260630.htm
- Roblox Newsroom, *Cube Foundation Model / 4D generation* (Feb 2026): https://about.roblox.com/newsroom/2026/02/accelerating-creation-powered-roblox-cube-foundation-model
- Roblox Altersprüfung (Jan 2026): https://www.nasdaq.com/press-release/roblox-requires-users-worldwide-age-check-access-chat-2026-01-07
- Dexerto — Top-Creator-Verdienste: https://www.dexerto.com/roblox/robloxs-top-creators-average-65-7-million-a-year-but-most-make-far-less-3408675/
- TweakTown — Median-Verdienst: https://www.tweaktown.com/news/113585/robloxs-top-10-creators-averaged-dollars65-7-million-each-while-the-median-made-dollars1500-and-roblox-everywhere-is-the-fix/index.html
- IBTimes — DevEx-Auszahlungen 2026: https://www.ibtimes.co.uk/roblox-top-creators-devex-payouts-2026-1819403
- PocketGamer.biz — Steal a Brainrot 25 Mio. CCU: https://www.pocketgamer.biz/robloxs-steal-a-brainrot-becomes-first-game-to-surpass-25m-concurrent-players
- GameAnalytics — 2025 Roblox Report: https://www.gameanalytics.com/cn/reports/2025-roblox-report
- RoWatcher — Launch-Playbook 2026: https://rowatcher.com/news/how-to-launch-a-roblox-game-in-2026-the-pre-launch-playbook
- RoWatcher — DevEx-Kurs (umstritten): https://rowatcher.com/news/the-real-roblox-devex-rate-in-2026-it-s-not-0-0035
- RoLearn — DevEx-Anforderungen (umstritten): https://rolearn.dev/guidance/roblox-devex-requirements-2026
