# LernStar · Bausteine-Bibliothek & Produktions-Kochbuch

Zentrale Übersicht **aller wiederverwendbaren Bausteine** und der **zwei Produktionswege**.
Ziel: Ein neues Physikvideo (oder eine Nachvertonung) entsteht schnell, weil fast alles
schon als Baustein existiert. Dies ist die praktische Ergänzung zu:

- [`PHYSIK-DIDAKTIK.md`](PHYSIK-DIDAKTIK.md) — **was** ein Video zeigen muss (verbindlich).
- [`README.md`](README.md) — **womit** (Werkzeug-Router, Status).
- [`design-tokens.json`](design-tokens.json) — Design-SSOT (Farben/Schrift/Format).

> **Referenzstandard = Klasse 5 RS Physik** (klasse5_rs, 19/19 Videos, seit 28.07.2026
> vollständig auf Stimme **Eva**). Jedes dieser Videos ist eine kopierbare Vorlage.
> **Klasse 6 RS ist ebenfalls 100 % auf Eva** (klasse6_rs, 21/21, 28.07.2026, alle Weg A).
> Fortschritt Nachvertonung Anna→Eva: **Kl.5 ✅ · Kl.6 ✅** · Kl.7–10 offen.

---

## 1 · Design-SSOT (für alle Tools identisch)

| | Wert |
|---|---|
| Format | **1920 × 1080, 30 fps**, H.264/MP4 |
| Hintergrund | `bg0 #0f172a` (tief) · `bg1 #1e293b` (hell) |
| Text | `ink #f8fafc` · gedämpft `muted #cbd5e1` |
| Akzent | `indigo #818cf8` / `indigoDeep #6366f1` |
| Semantik | `amber #fbbf24` Kraft/Hervorhebung · `green #22c55e` richtig/mehr · `red #ef4444` falsch/bremsen · `sky #38bdf8` Strom/Fluss |
| Schrift | Inter (Fallback Segoe UI / system-ui) |
| Marke | „LernStar" (Stern-Logo im Outro) |

Definiert in `videos-remotion/src/theme.ts`, `videos-motion-canvas/src/theme.ts`
(identisch), `videos-manim/lernstar_theme.py`. **Design-Änderung → zuerst
`design-tokens.json`, dann die drei theme-Dateien.**

---

## 2 · Die zwei Produktionswege

### Weg A — Reines Remotion (Standard, schnell, robust)
Für Erklärvideos mit DOM/SVG-Animation. Kein WebGL, sehr stabiler Render (~1 min/Video).

```
1. src/narration/<base>.json         [{id, text}, …]  (Text ZULETZT schreiben!)
2. node scripts/gen-audio-piper.mjs <base>            → public/audio/<base>/<id>.wav (Eva, 16 kHz)
                                                       + src/narration/<base>.timings.json
3. src/videos/<Name>.tsx             SCENES=[{id, C, min}] + durOf(id,min)
4. In src/Root.tsx registrieren      <Composition id="<Id>" … durationInFrames={<X>_DURATION} …>
5. npx remotion render <Id> out/<base>.mp4 --timeout=180000
6. cp out/<base>.mp4 videos/<base>.mp4   (Original vorher sichern!)
7. content.js-Thema: video:'<base>.mp4'  + Cache-Bump
```

**Kernmechanik (wichtig):** Szenenlänge = `durOf(id,min) = max(min, round(timings[id]*30)+20)`.
Die Dauer folgt automatisch dem Sprech-Audio → **Stimme wechseln = nur Audio neu
generieren + neu rendern, KEIN manuelles Takten**. Genau so wurden die 8 reinen-Remotion-
Kl.5-Videos von Anna auf Eva umgestellt.

### Weg B — Composite (Motion-Canvas-Fachanimation + Remotion-Overlay)
Für kontinuierliche Physik: Felder, Strahlen, Schaltungen mit fließenden Elektronen,
Bewegungen. MC liefert einen **sauberen Clip ohne Text**, Remotion legt
Titel/Untertitel/Sprecher/SFX drüber. Qualitätsstandard, aber aufwändiger.

```
1. src/narration/<base>-mc.json      → gen-audio-piper → timings.json
2. videos-motion-canvas/src/scenes/<name>_clip.tsx   (nur Fachvisual, durchlaufend)
3. project.ts scenes:[<clip>]  →  npm run render  →  output/LernStar.mp4
4. cp output/LernStar.mp4 videos-remotion/public/mc/<name>.mp4     (public/mc NICHT gitignored)
5. src/videos/<Name>MC.tsx: <OffthreadVideo src={staticFile('mc/<name>.mp4')}
   startFrom={kumulierter Frame-Offset} muted> pro Szene + Overlays
6. npx remotion render <Id>MC … → videos/<base>.mp4
```

**Re-Timing bei Stimmwechsel (Weg B):** MC-Clip pro Segment = Animation + Halte-Füller.
Nur den **Füller am Segmentende** so setzen, dass Segment-Total = `DUR_s`
(`node scripts/print-durations.mjs <base> 150`). Füller ist meist `waitFor(sek)`,
selten ein `flow(...)`-Tween (elektromagnet) oder `run(sek)`-Helfer (stromkreis) → dort
dessen **Dauer** anpassen. Frame-Abgleich Ergebnis ≈ DUR-Total ±1 = Sync-Beweis.

---

## 3 · Sprecher-Pipeline (Eva)

- **Standard:** Piper TTS, Stimme **Eva** (`de_DE-eva_k-x_low`, weiblich, 16 kHz, kostenlos/offline).
- Binär: `~/.local/piper/venv/bin/piper` · Modell: `~/.local/piper/voices/de_DE-eva_k-x_low.onnx`.
- Erzeugen: `node scripts/gen-audio-piper.mjs <base> [<base2> …]` (ohne Argument: alle).
- **Anna = 24 kHz, Eva = 16 kHz** → schnelle Stimm-Prüfung per `ffprobe … sample_rate`.
- Eva-Dauern sind **nicht** reproduzierbar (lebendige Default-Betonung gewollt) → Clip-Timing
  IMMER aus dem *gelieferten* Audio ableiten, nie aus einem früheren Lauf.
- Nie männlich. ElevenLabs nur optionales Upgrade (kostenpflichtig, Key nötig).

---

## 4 · Baustein-Katalog (Remotion, `videos-remotion/src/`)

### Kern / Chrome — `components.tsx` (in JEDEM Video)
`Bg` (Hintergrund-Verlauf) · `SceneTitle{kicker,title}` · `Caption{delay}` (Untertitel) ·
`MerksatzBox{title,footer}` · `StarLogo` · `Arrow` · `Ball` · `Sfx{sound,at,volume}` ·
`BackgroundMusic{total}` · `easeInOut`. SFX-Namen: **whoosh** (Szenenwechsel), **pling**
(Merksatz-Reveal), **pop** (Karte/Pfeil erscheint), **impact** (Anstoß/Bremsen/Fall).

### Optik / Licht & Schatten — `optik.tsx`
`LightSource` · `Ray` (wachsender Strahl, progress 0..1) · `RayFan` (Strahlenfächer) ·
`Eye{seeing}` · `Body` (undurchsichtiger Körper) · `Screen` (Projektionswand) ·
`ShadowPatch{soft}` (soft = Halbschatten) · `useFade`.

### Linsen — `lens.tsx`
`Axis` · `ConvexLens{f,showF}` · `ConcaveLens` · `OArrow` (Gegenstandspfeil) ·
`LensImage` (volle Bildkonstruktion, `b=f*g/(g-f)`, reell/virtuell).

### Brechung & Farben — `refraction.tsx`
`SPECTRUM` (6-Farb-Array) · `MediaSplit` (Medien-Grenze) · `RefractRay` · `Prism` ·
`RgbCircles` (additive Mischung, `mixBlendMode:screen`).

### Magnetismus — `magnet.tsx`
`BarMagnet{angle,nRight,poles}` (rot N / blau S) · `FieldLines` (N→S-Bezierbögen) ·
`CompassNeedle{ring}` · `MaterialChip` (grün magnetisch / grau nicht) · `Coil{on}`
(Spule + Eisenkern) · `useFade`.

### Stromkreis — `circuit.tsx`
`RectWire{gapAtBottom,on}` (Draht-Loop + animierte Stromfluss-Punkte) · `LampSym` (⊗) ·
`BatterySym` · `SwitchSym{closed}` · `Bulb` (💡-Realbild) · `useFade`.

### Elektrik (U/I/R) — `electric.tsx`
`ChargeBall{sign}` · `Meter{kind:'A'|'V'}` · `ResistorSym` · `WaterAnalogy` (Druck/Fluss-Analogie).

### Mechanik / Kräfte — `forces.tsx`
`ForceArrow` · `Spring{stretch}` · `Scale{value}` (Kraftmesser) · `Crate`.

### Astronomie — `astro.tsx`
`Sun` · `HalfLitSphere` (sonnenbeleuchtete Hälfte) · `Orbit` · `ShadowCone` · `PHASES` (Mondphasen-Emoji).

### Wärme — `thermal.tsx`
`Thermometer` (steigende Säule) · `ParticleBox` (fest/flüssig/gas via heat) · `HeatWaves` · `Sun`.

### Schall — `sound.tsx`
`Waveform{amplitude,freq}` · `String` (schwingende Saite) · `ParticleChain` (Verdichtungswelle) ·
`DbMeter` · `SoundWaves`.

> Braucht ein Video nur ein einmaliges Objekt (Auto, Rakete, Treppe, Pendel), lebt der
> Baustein **in-file** in seiner `<Name>.tsx` — erst bei Wiederverwendung in ein `src/*.tsx`
> hochziehen.

---

## 5 · Motion-Canvas-Bausteine (`videos-motion-canvas/src/scenes/`)

Composite-Clips (Weg B) bauen direkt auf MC-Primitiven (`Circle`, `Line`, `Rect`, `Txt`,
`Node`) + `createSignal`/`all`/`waitFor` auf; Geometrie (Tangenten, Feldlinien,
Schattenkegel) wird pro Clip reaktiv aus Signalen berechnet. Vorlagen:
`sehen_clip` · `stromkreis_clip` · `schatten_clip` · `schatten_groesse_clip` ·
`kern_halbschatten_clip` · `magnetpole/magnete_felder/magnet_stoffe/magnetfeld/kompass/elektromagnet_clip`.

---

## 6 · Harte Lehren (Fehler, die Zeit gekostet haben)

**Renderer (Motion Canvas, swiftshader-WebGL):**
- **NIE reaktive `Txt` mit sich änderndem Inhalt** (`text={()=>`…${zahl}`}`) — baut das
  Glyph-Atlas pro Frame neu und crasht den GL-Kontext zuverlässig. Statt dessen statische
  Labels + reaktive `Rect`-Balken (Breite/Position reaktiv ist billig).
- Elementzahl niedrig halten; bei Kontextverlust (Teil-MP4 ohne moov): Chrome-Reste killen
  (`pkill -9 -f chrome-headless-shell`, `pkill -9 -f 'vite --port 9124'`), Output löschen,
  **isoliert** neu starten — geht meist nach 1–3 Versuchen durch. Nav-Timeout 180000.

**Remotion / esbuild (JSX):**
- Deutsches `„…"` oder gerades `"` in einem **JSX-Attribut** bricht den Parser → ausschreiben.
- `<` / `>` in **JSX-Kindtext** („g < F") wird als Tag geparst → ausschreiben („Näher als F").
- `useFade` muss **in jeder Baustein-Datei einzeln exportiert** sein (Import aus falscher
  Datei = „useFade is not a function"). Hooks NICHT im `.map()`-Callback → eigene Kartenkomponente.
- SVG-Bausteine mit `viewBox 0 0 1920 1080` **direkt auf `AbsoluteFill`** — NICHT in einen
  `position:relative`-Wrapper mit Offset (doppelter Offset / viewBox-Verzerrung → off-screen).
- Kein `Math.random()`/`Date.now()` für Deko (Sternfelder etc.) → deterministisch seeden.
- Strahl-Progress: `ix = inX + (hitX-inX)*p` (nicht umgekehrt, sonst schrumpft der Strahl auf 0).

**Content/Struktur:**
- **NUR den `_rs`-Block** bearbeiten (klasse5_rs … klasse10_rs). `klasse5` (Gymnasium),
  `_hs`, `_gts` unberührt lassen — sie haben gleiche Labels, der User sieht nur `_rs`.
  Themenliste sauber ziehen: `CONTENT.klasse5_rs.subjects.find(s=>/Physik/.test(s.name)).topics`.
- Video-Cache-Bust bei Re-Render eines schon deployten MP4: `videos/${file}?v=N` in app.js
  hochzählen **und** `app.js?v=` in index.html.

---

## 7 · Umgebung

- Node: `export PATH="$HOME/.local/node/bin:$PATH"` in **jedem** Bash-Call (State persistiert nicht).
- ffprobe (mit dylibs): `videos-motion-canvas/node_modules/@ffprobe-installer/darwin-arm64/ffprobe`.
- Manim: conda-Env `~/miniforge3/envs/manim/bin/manim` (NICHT pip); `render.sh` setzt `PYTHONPATH=.`.
- Regel: bestehende Videos nie automatisch überschreiben — Original sichern (git + Scratchpad),
  erst nach Freigabe tauschen.
