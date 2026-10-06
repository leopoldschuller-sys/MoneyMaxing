# KI-Prompt-Paket: dieselben 5 Sketche als realistische KI-Videos

Die MP4s in `videos/` sind 2D-Cartoons aus dem Code in `render/`. Wenn du den Look aus dem
Referenz-Video willst (vermutlich realistische bzw. 3D-KI-Eisbären), generierst du die gleichen
5 Geschichten mit einem KI-Videotool. Dieses Dokument enthält alles dafür: die Figurenbeschreibung
(immer gleich, damit die Bären in jedem Clip gleich aussehen) und pro Video 4 Shots à ca. 8 s.

> **Wichtig: Ich konnte das TikTok-Referenzvideo nicht ansehen** (tiktok.com ist in meiner
> Umgebung gesperrt). Die Figurenbeschreibung unten ist deshalb ein Vorschlag. So passt du sie an:
> Screenshot der beiden Bären aus dem Referenzvideo machen, die Merkmale (Fellfarbe und -länge,
> Körperform, Kleidung, Augen, Stil realistisch oder 3D) in die Blöcke `HIM` / `HER` eintragen und
> den Screenshot zusätzlich als Referenzbild hochladen.
> **Nicht 1:1 kopieren:** Bau mindestens ein eigenes Erkennungsmerkmal ein (z. B. die rosa Schleife,
> Namen, Running Gags). Das schützt vor Ärger und hilft beim Originalitäts-Ranking (siehe `marktrecherche.md`).

---

## 1. Tools (Stand Oktober 2026, laut Recherche, bitte selbst gegenprüfen)

| Tool | Eignung | Notiz |
|---|---|---|
| **Google Veo 3.1** (Gemini-App, Flow, API) | ⭐ erste Wahl | Clips mit 4/6/8 s, bis zu **3 Referenzbilder** („Ingredients“) für gleichbleibende Figuren, erzeugt auch Ton |
| **Kling 3.0** | ⭐ sehr gut | „Subject Binding“ für mehrere feste Figuren, 10-s-Clips |
| **Seedance 2.x** (CapCut/Dreamina) | gut | in Europa verfügbar, direkt in CapCut |
| **Gemini Omni Flash** (in YouTube Shorts) | gut zum Testen | laut Recherche kostenlos in Shorts, bis zu 5 Referenzbilder |
| Hailuo, Runway, Higgsfield | Alternativen | |
| ~~Sora~~ | – | laut Recherche eingestellt (App 04/2026, API 09/2026) |

**Kosten (Schätzung):** ca. 5–12 $ pro fertigem 30-s-Video, inklusive Ausschuss.

---

## 2. Workflow für gleichbleibende Bären

1. **Referenzbilder erstellen** (einmalig), z. B. mit Gemini („Nano Banana“) oder einem anderen Bildmodell:
   - Prompt: `Character sheet, front view, side view and back view, full body, of [HIM-Block]. Plain light grey background.`
   - Dasselbe für `[HER-Block]`, dazu ein Bild **beider zusammen** im Schlafzimmer, in der Küche und im Wohnzimmer.
   - Die besten Bilder in einem Ordner speichern. Das sind ab jetzt deine „Schauspieler“.
2. **Pro Shot:** Referenzbilder (er, sie, Set) hochladen, dann den Shot-Prompt mit **Style-Block + HIM + HER** einfügen.
3. **Die Blöcke nie umformulieren.** Nur der Handlungsteil ändert sich, Fell, Augen, Schleife und Licht bleiben wortgleich.
4. Pro Shot 2–3 Varianten generieren und die beste nehmen. Wenn ein Shot gut ist, sein letztes Frame als Startbild für den nächsten Shot verwenden.
5. **Schnitt in CapCut:** 4 Shots hintereinander, Text-Overlays aus der Tabelle unten (Font „Classic“, weiß mit schwarzem Rand), Hook-Zeile von Sekunde 0 bis zum Ende.
6. **KI-Label beim Upload setzen** (TikTok: „AI-generated content“, YouTube: „Altered or synthetic content“, Instagram: „AI info“).

---

## 3. Feste Blöcke (immer mitkopieren)

**STYLE A – realistisch-süß (wie virale KI-Tiervideos):**
```
Vertical 9:16 video. Ultra-realistic, cinematic, soft natural indoor lighting, shallow depth of field,
cozy modern apartment, gentle handheld smartphone feel. Fluffy, detailed, clean white fur.
No text, no captions, no watermark, no humans.
```

**STYLE B – 3D-Animationsfilm (alternativ):**
```
Vertical 9:16 video. Stylized 3D animation like a modern animated feature film, soft fluffy fur with
subsurface scattering, big expressive eyes, warm pastel colors, soft lighting.
No text, no captions, no watermark, no humans.
```

**HIM:**
```
HIM: a big, chubby adult male polar bear with thick fluffy creamy-white fur, small round ears,
a small messy tuft of fur on top of his head, glossy black nose, small dark sleepy eyes,
calm and lazy personality. Anthropomorphic: sits and stands upright like a human and uses
his paws like hands. He wears nothing.
```

**HER:**
```
HER: a slightly smaller adult female polar bear with bright snow-white fluffy fur, big shiny dark
eyes with long eyelashes, rosy pink cheeks and a pink satin bow on her right ear (always the same bow).
Very expressive, dramatic face. Anthropomorphic: sits and stands upright like a human.
```

**AUDIO (Empfehlung):**
```
Audio: natural room sound and cartoonish comedic sound effects only, no music, no human speech.
The bears only make cute bear grumbles and sighs.
```
> Warum ohne Sprache? Dialoge kommen als Text-Overlay. Das funktioniert international, vermeidet
> unpassende Lippenbewegungen, und du kannst in der App einen Trend-Sound darunterlegen.
> Wer doch Stimmen will, schreibt z. B.: `HER says in a cute, annoyed voice: "are you even listening?!"`

**Prompt-Aufbau pro Shot:** `[STYLE] + [HIM] + [HER] + [SHOT] + [AUDIO]`

---

## 4. Shot-Listen pro Video

### Video 1 – „him vs me trying to fall asleep 😴“

| # | SHOT-Prompt | Text-Overlay in CapCut |
|---|---|---|
| 1 | `Night. A cozy bedroom, seen from the foot of a big bed with a honey-colored quilt. HIM and HER lie side by side, heads on pastel pillows. HIM yawns hugely, mumbles goodnight and instantly falls asleep, snoring loudly with a small snot bubble growing from his nose. HER lies next to him with wide open eyes. Static camera.` | `HIM:` · `⏱️ 0.3 seconds` |
| 2 | `Close-up of HER lying awake in the dark bedroom, moonlight from the window, eyes wide open staring at the ceiling. She suddenly covers her face with both paws in embarrassment, then picks up a smartphone; her face is lit blue by the screen while she scrolls. HIM snores softly in the background.` | `ME:` · `did I lock the door? 🤔` · `that thing I said in 7th grade 😳` · `🕐 1:13 AM` |
| 3 | `A red digital alarm clock on the nightstand shows 3:47. HER, exhausted with tired eyes, slowly turns her head and glares at the snoring HIM, then pokes his cheek twice with her paw; his snot bubble pops and he wakes up, confused and sleepy.` | `🕓 3:47 AM` · `HOW does he do that 😤` |
| 4 | `HIM sleepily opens his arms and pulls HER into a cuddle. She falls asleep instantly with a happy smile, her head resting on his arm. Now HIM lies wide awake, staring at the ceiling, wiggling the paw of his trapped, numb arm. Dim moonlight, static camera.` | `⏱️ 0.2 seconds` · `can't feel my arm 🥲` |

### Video 2 – „when he falls asleep in the middle of an argument 🙂“

| # | SHOT-Prompt | Text-Overlay |
|---|---|---|
| 1 | `Bedroom, bedside lamp on. HER sits upright in bed with crossed arms, ranting angrily at HIM, who lies next to her with heavy eyelids. Mid-sentence he slowly falls asleep and starts snoring. HER freezes in disbelief and slowly turns her head toward him.` | `and ANOTHER thing…` · `are you even listening?! 😤` · `excuse me??` |
| 2 | `HER takes a huge, theatrical, very loud sigh while staring at HIM. Then she switches on the bright ceiling light; HIM keeps snoring and lazily covers his eyes with one paw.` | `*sighs at 100 decibels*` · `*turns on ALL the lights*` |
| 3 | `HER yanks the whole quilt off HIM. HIM smiles blissfully in his sleep and stretches, enjoying the cold air. HER's face turns red with rage, cartoon steam puffs from her ears.` | `*steals the whole blanket*` · `he's literally a polar bear 🙃` |
| 4 | `HIM mumbles happily in his sleep with a dreamy smile. HER first melts with a lovestruck look, then her face flips to shock and fury; she throws a pink pillow at his face, feathers fly, HIM wakes up startled.` | `mmm… I love you…` · `…salmon 🐟` · `WHO IS SALMON?!` · `ROUND 2 🥊` |

### Video 3 – „she said she's not hungry 🙂“

| # | SHOT-Prompt | Text-Overlay |
|---|---|---|
| 1 | `Bright kitchen, table with a pink-and-white checkered tablecloth. HIM and HER sit side by side. HER shakes her head and waves her paw: not hungry. A plate with a grilled fish and a red box of fries is put in front of HIM; his eyes sparkle with joy.` | `want anything? 🍔` · `no, I'm not hungry 🙂` |
| 2 | `HIM turns away to grab a napkin. HER quickly and sneakily snatches the fries and stuffs her cheeks like a hamster, then looks away innocently as he turns back, crumbs on her face.` | `*looks away for 1 second*` · `did you eat my fries?` · `no?? 😇` |
| 3 | `HIM turns away again. HER grabs half of the grilled fish. When he turns back, a fish tail is sticking out of her mouth; HIM stares in shock, HER blinks innocently.` | `*looks away again*` · `I'm not hungry 🙂` |
| 4 | `HIM protectively wraps both arms around his plate. HER makes huge, glossy puppy eyes. He sighs and slides the plate over; she devours everything in a cartoonish blur, pats her belly and looks at him again with puppy eyes. HIM slowly face-plants onto the table.` | `just one bite? 🥺` · `I'm hungry. can we order something? 🥺` · `every. single. time. 💀` |

### Video 4 – „him vs her getting ready 💅“

| # | SHOT-Prompt | Text-Overlay |
|---|---|---|
| 1 | `A pastel dressing room with a big vanity mirror framed by light bulbs. HIM stands in front of it, shakes his whole body like a wet dog so fur flies everywhere, then strikes a confident pose. Done.` | `HIM:` · `⏱️ 3 seconds` |
| 2 | `Same vanity. HER carefully brushes the fur on her head with a pink brush, sparkles in the air. Then she holds up two identical pink bows, one in each paw, and looks questioningly toward the camera.` | `HER:` · `🕕 6:00 PM` · `which one? 🎀` · `they're literally the same` |
| 3 | `Fast fashion montage: HER spins and tries on sunglasses, a pearl necklace, a tiny black top hat, a red scarf and a flower crown, posing each time. A wall clock spins forward rapidly.` | `🕖 7:15 PM` · `2 HOURS LATER…` |
| 4 | `HIM stands waiting next to the front door, covered in cobwebs, with a long grey beard, asleep while standing. HER appears glamorous and sparkling, then puts her paws on her hips and scolds him angrily. HIM stares blankly.` | `ok I'm ready! let's go ✨` · `why aren't you ready?? 😤` · `it's always my fault somehow 🙃` |

### Video 5 – „him vs her: the thermostat 🥶🔥“

| # | SHOT-Prompt | Text-Overlay |
|---|---|---|
| 1 | `Living room, snow falling outside the window. HER is wrapped in a pink blanket burrito on the couch, shivering with chattering teeth. She hops over to the wall thermostat and turns it all the way to hot; the room glows warm orange.` | `babe… I'm freezing 🥶` · `*cranks the heat*` |
| 2 | `HIM walks in, sweating heavily, tongue out, panting. He turns the thermostat to the coldest setting; snow starts falling inside the living room; he smiles blissfully while HER freezes with tiny icicles on her fur.` | `why is it 1000 degrees in here?! 🥵` · `polar bear. still cold. 🥶` |
| 3 | `Both stand at the thermostat, frantically turning the dial back and forth, faster and faster, the room flashing orange and blue, until the thermostat breaks and a spring pops out. Silence.` | `🔥 HER` / `❄️ HIM` |
| 4 | `HER gets an idea, smiles and cuddles HIM tightly. HIM blushes happily, then slowly melts into a puddle of white fur while still smiling (cartoon effect).` | `you're my heater now 🥰` · `worth it 🫠` · `he'd literally melt for her 🫠❤️` |

---

## 5. Negativ-Hinweise (bei Tools mit Negative-Prompt-Feld)

```
extra limbs, extra paws, deformed face, human hands, humans, brown bear, grizzly, panda,
different fur color, missing bow, text, subtitles, logo, watermark, blurry, flicker
```

## 6. Neue Folgen schreiben (Formel)

`[Alltagssituation von Paaren]` + `[er macht es „falsch“, aber entspannt]` + `[sie eskaliert dramatisch, aber süß]`
\+ `[Eisbär-Twist: Kälte, Fisch, Winterschlaf, Schnee]` + `[Rollentausch oder Callback als Pointe]`
