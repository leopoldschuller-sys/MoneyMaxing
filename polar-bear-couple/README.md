# 🐻‍❄️ Polar Opposites: 5 Eisbär-Couple-Videos

Fünf fertige, lustige Couple-Sketche im Stil „him vs me / him vs her“ mit **denselben zwei weißen
Eisbären** in jedem Video. Hochformat für TikTok, Reels und Shorts.

| Datei | Hook (Text oben im Video) | Länge |
|---|---|---|
| `videos/01_him_vs_me_sleep.mp4` | him vs me trying to fall asleep 😴 | 29,5 s |
| `videos/02_asleep_mid_argument.mp4` | when he falls asleep in the middle of an argument 🙂 | 27,5 s |
| `videos/03_not_hungry.mp4` | she said she's not hungry 🙂 | 28,5 s |
| `videos/04_getting_ready.mp4` | him vs her getting ready 💅 | 28,8 s |
| `videos/05_thermostat_war.mp4` | him vs her: the thermostat 🥶🔥 | 27,0 s |
| `videos/06_what_are_you_thinking.mp4` | when she asks what he's thinking about 💭 (im Bett) | 27,0 s |
| `videos/07_couple_selfie.mp4` | taking a cute couple selfie 📸 (auf der Couch) | 27,5 s |
| `videos/08_where_to_eat.mp4` | asking her where she wants to eat 🍣 (am Küchentisch) | 27,5 s |

Die Videos 06–08 nutzen den überarbeiteten **„cute“-Look** und eine **flüssigere Animation in 60 fps**:
- größere Köpfe, größere glänzende Augen, weiche Verläufe statt harter Schatten, „Nudel“-Ärmchen mit runden Pfoten,
  runde Schrift (Fredoka, SIL Open Font License), Sprechblasen in Pastellblau/-rosa
- alles spielt zu Hause: Bett (`drawCozyBedroom`), Couch (`drawCozyRoom`), Küchentisch (`drawCozyKitchen`)
- Animation über `Actor` (`render/engine/anim.js`): jede Bewegung ist ein weich interpolierter Keyframe-Track,
  dazu Atmen, leichtes Wippen, natürliches Blinzeln, Augenbewegungen, Kopfnicken beim Reden,
  Squash & Stretch bei Reaktionen (Überraschung, Hüpfer, Seufzer, Kopfschütteln) und nachschwingende Schleife/Fell.
  Gesichtsausdrücke wechseln nie hart, sondern während eines kurzen Blinzelns.
- leiser, sanfter Ton (Lo-fi/Spieluhr-Musik, nur wenige weiche Soundeffekte)

Ein Skit schaltet den Look mit `useCuteLook();` am Dateianfang ein.

Format: 1080×1920, 30 fps, H.264 + AAC-Stereo. Der Ton besteht aus durchgehender Musik und Soundeffekten,
beides komplett synthetisch erzeugt, es gibt also keine fremden Samples und keine Musiklizenzen. Die Bären haben keine Stimmen,
die Dialoge stehen als Sprechblasen im Bild.

## Dokumente

- [`docs/skripte-und-captions.md`](docs/skripte-und-captions.md): Ablauf jedes Videos, fertige Captions und Hashtags, Posting-Reihenfolge
- [`docs/ki-prompts.md`](docs/ki-prompts.md): dieselben 5 Sketche als **Prompt-Paket für realistische KI-Videos** (Veo 3.1, Kling, Seedance …) mit Figuren-Bibel, damit die Bären überall gleich aussehen
- [`docs/marketing-ideen.md`](docs/marketing-ideen.md): Positionierung, 30 Folgenideen, Hook-Formeln, Posting-Plan, Monetarisierung
- [`docs/marktrecherche.md`](docs/marktrecherche.md): Marktrecherche mit Quellen (Monetarisierungs-Hürden, KI-Label-Regeln, Tools und Kosten, Zielgruppe)

## Wichtig zum Referenz-Video

Das TikTok-Video von @bearyrelatble konnte ich nicht ansehen, weil tiktok.com in der Cloud-Umgebung gesperrt ist.
Zugang zu KI-Videogeneratoren gab es hier auch nicht. Die Videos sind deshalb als **2D-Cartoon-Animation per Code**
gebaut: zwei eigene, gleichbleibende Eisbär-Figuren (er mit Fell-Tupfer, sie mit rosa Schleife).
Für den realistischen KI-Look wie im Referenz-Account gibt es das Prompt-Paket in `docs/ki-prompts.md`.

## Selbst rendern / neue Folgen bauen

Voraussetzungen: Node 22 mit Playwright (Chromium), Python 3 mit `numpy` + `scipy`, `ffmpeg`.

```bash
cd polar-bear-couple
./render/build.sh                      # alle Videos
./render/build.sh 03_not_hungry        # nur eins
# Einzelbilder zum Prüfen (landen in build/stills/):
NODE_PATH=$(npm root -g) node render/render.js 03_not_hungry --stills 1.5,7,12
```

So funktioniert es:
1. `render/render.js` öffnet `render/page.html` in Headless-Chromium und zeichnet jedes Frame mit Canvas 2D.
   Die Frames gehen per Pipe an ffmpeg (`build/<skit>.video.mp4`).
2. Dieselbe Skit-Datei exportiert alle Ton-Cues (`build/<skit>.cues.json`). `render/audio.py` synthetisiert daraus
   den Soundtrack aus Musik und Soundeffekten.
   Nur den Ton neu machen, ohne die Bilder neu zu rendern: `AUDIO_ONLY=1 ./render/build.sh`.
3. `render/build.sh` muxt Bild und Ton nach `videos/<skit>.mp4`.

**Neue Folge:** Kopiere eine Datei aus `render/skits/` (z. B. `03_not_hungry.js`) und passe sie an:
- `setup(S)`: Timeline mit `S.say(who, t, text, {mood})` (Sprechblase + Mundbewegung), `S.think(...)` (Gedankenblase),
  `S.sfx(t, name)` und `S.music(t0, t1, mood)`.
  Moods: normal, sweet, angry, shout, sleepy, sad, excited.
  Musik: cozy, night, romantic, silly, sneaky, chaos, glam, tense, sad, lofi, dreamy, bouncy.
- `draw(ctx, t, S)`: Kamera, Set (`drawBedroomBack`, `drawKitchen`, `drawLivingRoom`, `drawVanity`, neu: `drawCozyBedroom`, `drawCozyRoom`, `drawCozyKitchen`) und die
  Bären über `bearState('him'|'her', {...})`.
  Ausdrücke: `eyes` (dot, happy, sleep, shock, heart, sparkle, teary, spiral, x, line), `mouth` (w, smile, grin, frown, flat, o,
  bigO, yawn, wobbly, smirk, pout, teeth, tongue, chew), dazu `brows`, `lid`, `anger`, `sweat`, `tears`, `steam`, `redFace`, `frost`, `melt` …
- Gesichter und Figuren stecken in `render/engine/bear.js`, Sets und Requisiten in `props.js`,
  Text, Sprechblasen und Effekte in `fx.js`.
