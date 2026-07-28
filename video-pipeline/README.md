# LernStar · Video-Produktionssystem

Zentrale, **modulare** Pipeline für alle Mathe- & Physik-Lernvideos. Jedes Werkzeug
übernimmt nur die Aufgabe, für die es am besten geeignet ist. Gemeinsames Design-System
(`design-tokens.json`) sorgt dafür, dass sich alles „wie aus einem Guss" anfühlt.

> **Grundregel:** Bestehende Videos bleiben unangetastet. Neue Werkzeuge dienen nur dazu,
> **künftige** Videos besser zu machen oder – nach ausdrücklicher Freigabe – einzelne
> vorhandene Videos gezielt zu optimieren. Nie automatisch überschreiben.
>
> **⚠️ VERBINDLICH für alle Physikvideos:** [`PHYSIK-DIDAKTIK.md`](PHYSIK-DIDAKTIK.md) –
> „Was erklärt wird, muss gleichzeitig sichtbar werden." Animation ist Hauptbestandteil,
> Ziel ist das Korrigieren von Fehlvorstellungen. Produktionsreihenfolge: Fehlvorstellung →
> Animation → Storyboard → Animation bauen → **Sprechertext zuletzt**. 4-Fragen-Gate je Szene.

## Werkzeuge & Status

| Werkzeug | Aufgabe | Ordner | Render (Terminal) | Status |
|---|---|---|---|---|
| **Remotion** | Compositing, Schnitt, Übergänge, Titel, Untertitel, Sprecher, Endrender, Animation bestehender Elemente | `videos-remotion/` | `remotion render <Id> out/x.mp4` | ✅ produktiv (150+ Videos) |
| **Motion Canvas** | Physik-2D: Versuche, Kräfte, Strahlen, Schaltungen, Messgeräte, Bewegungen, technische Visualisierung | `videos-motion-canvas/` | `npm run render [ziel]` (headless) | ✅ installiert + getestet |
| **Manim** | Mathe: Funktionen, Koordinatensysteme, Vektoren, Geometrie, Diagramme, Herleitungen | `videos-manim/` | `./render.sh <datei> <Klasse> [ziel]` | ✅ installiert + getestet |
| **Piper TTS** | Standard-Sprecherstimme (weiblich „Eva"), kostenlos/offline/neuronal | `videos-remotion/scripts/gen-audio-piper.mjs` | `node scripts/gen-audio-piper.mjs [base]` | ✅ installiert + Standard (seit 28.07.) |
| **ElevenLabs** | optionale Studio-Sprecherstimme, SFX | `videos-remotion/scripts/*eleven*` | `npm run audio:eleven` | ⚠️ Scripts fertig, **kostenpflichtig + API-Key** |
| **Blender** | nur hochwertige 3D: Sonnensystem, Planeten, E-Motor, Generator, Moleküle, Magnetfelder | – | `blender -b -P script.py` | ⛔ noch nicht installiert (Plan unten) |

**Standard-Sprecher: Piper TTS, Stimme „Eva"** (`de_DE-eva_k`, weiblich, neuronal, kostenlos,
offline, ohne Limit) – seit 28.07.2026. Erzeugen: `node scripts/gen-audio-piper.mjs <base>`
(gleiche Dateipfade/Timings wie die alte say-Pipeline → Composites unverändert).
Installation: eigenständiges venv unter `~/.local/piper` (piper-tts 1.6.0 pip-Wheel + Modelle
Kerstin/Eva). Fallback bleibt `say -v Anna`; Studio-Upgrade wäre ElevenLabs (kostenpflichtig).

## Automatische Werkzeugwahl (Router)

Vor jedem neuen Video: Inhalt analysieren → Werkzeug wählen:

| Inhalt | Werkzeuge |
|---|---|
| **Mathematik** (Funktion, Term, Geometrie, Herleitung, Diagramm) | **Manim** (Visual) + Remotion (Sprecher/Untertitel/Schnitt) |
| **Physik 2D** (Versuch, Kräfte, Optik-Strahlen, Schaltung, Messgerät, Bewegung) | **Motion Canvas** (Visual) + Remotion |
| **Physik 3D** (Raum, Planeten, Motor/Generator, Feldlinien im Raum, Moleküle) | **Blender** (3D-Clip) + Remotion |
| **Erklärvideo** (Text, Icons, Karten, Ablauf) | **Remotion** allein |
| **Sprecher** (immer) | **Piper „Eva"** (Standard) → Fallback `say -v Anna` → optional ElevenLabs |

Nie ein zusätzliches Werkzeug ohne fachlichen Mehrwert. Bei Erklärvideos mit Emoji/Karten
bleibt Remotion allein das Richtige (schnell, bewährt).

## Kompositionsmodell

Zwei Wege, wie ein Clip in ein fertiges Lernvideo kommt:

1. **Standalone** (einfach, wie bisher): Werkzeug rendert die komplette Szene → MP4 nach
   `videos/` → in `content.js` per `video:'name.mp4'` einbinden, `content.js?v=` bumpen.
2. **Composite** (höchste Qualität): Manim/Motion-Canvas/Blender liefern die **Fachanimation**
   als MP4-Clip; **Remotion** legt Sprecher, Untertitel, Titel, Übergänge (whoosh/pling) und
   das einheitliche Intro/Outro darüber. So bleibt die Gestaltung überall identisch.

Für kurze, in sich geschlossene Szenen genügt Weg 1. Für mehrteilige, vertonte Videos ist
Weg 2 der Qualitätsstandard.

## Einheitliche Standards (das „aus einem Guss")

Single Source of Truth: **`design-tokens.json`**. Alle Werkzeuge spiegeln dieselben Werte:

- **Farbwelt:** dunkel `#0f172a`, Text `#f8fafc`, Akzent Indigo, Highlight Amber, richtig Grün, falsch Rot, Physik-Kälte Sky, Physik-Wärme Rot.
  - Remotion: `videos-remotion/src/theme.ts` · Motion Canvas: `videos-motion-canvas/src/theme.ts` · Manim: `videos-manim/lernstar_theme.py`
- **Schrift:** Inter / system-sans (Remotion, MC), „Helvetica Neue" (Manim) – optisch gleich.
- **Format:** 1920×1080, **30 fps** überall.
- **Aufbau:** Kicker oben links → Titel → Inhalt → Merksatz/Caption unten. Szenenfolge
  Intro→Beobachten→…→Merksatz→Transfer→Outro.
- **Übergänge/SFX:** whoosh (Szenenwechsel), pling (Merksatz/Formel), pop (Karten/Pfeile).
- **Sprecher:** weibliche Piper-Stimme „Eva" (fest), gleiches Tempo; Fallback Anna.
- **Kamera:** statische Vollbild-Einstellung; Kamerafahrten nur didaktisch begründet (Remotion).

Design-Änderung? Zuerst `design-tokens.json`, dann in die drei theme-Dateien übernehmen.

## Was künftig wovon profitiert

- **Mathe (Kl. 5–10, Sek II):** Funktionsgraphen, Steigung/Ableitung, Vektoren, Strahlensatz,
  Kreis/Winkel, Wahrscheinlichkeitsdiagramme → **Manim** statt div-Grafiken. Deutlich präziser.
- **Physik-2D künftig:** Optik-Strahlengänge, Kräftezerlegung, Schaltpläne, Wellen, Messgeräte →
  **Motion Canvas** (weiches, exaktes Vektor-Tweening) statt Emoji/HTML.
- **Physik-3D künftig:** Sonnensystem, Elektromotor/Generator, räumliche Magnetfelder,
  Atom-/Molekülmodelle → **Blender** (sobald priorisiert).

## Optional verbesserbare bestehende Videos (nur Vorschlag, nichts überschreiben)

Reihenfolge = geschätzter Mehrwert:

1. **Sprecherqualität plattformweit** – sobald ein ElevenLabs-Key vorliegt, könnten neue Videos
   die deutlich natürlichere Stimme nutzen; bestehende bei Bedarf gezielt neu vertont werden.
   *Höchster Hebel, betrifft alle Videos.*
2. **Mathe-lastige Remotion-Videos** mit HTML-Diagrammen (z. B. s-t-/v-t-Diagramme,
   Wirkungsgrad-Balken, U-I-Kennlinien) → als **Manim**-Clips schärfer und exakter.
3. **3D-Themen, aktuell 2D dargestellt:** Umlaufbahn/ISS (9.2.14), Sonnensystem (Kl. 6),
   Generator (9.4.2), Magnetfeld/Elektromagnet, Sonnen-/Mondfinsternis → **Blender** könnte
   räumliche Tiefe geben. Nur bei konkretem Bedarf, Aufwand pro Video hoch.

Vorgehen: erst dokumentieren + vorschlagen, dann nach Freigabe **neue** Datei erzeugen und
gezielt austauschen – Originale bleiben erhalten.

## Blender – Einordnung & Plan (bewusst noch nicht installiert)

Blender ist mit Abstand das schwerste Werkzeug (großer Download, GUI-Suite, hoher
Aufwand pro 3D-Szene) und wird nur für wenige Themen wirklich gebraucht. Deshalb erst
installieren, wenn ein konkretes 3D-Thema ansteht. Machbarer Plan (headless, ohne sudo):

1. macOS-arm64-Build von blender.org laden (.dmg), `hdiutil attach`, `Blender.app` nach
   `~/Applications` kopieren (kein sudo nötig).
2. Headless rendern: `Blender.app/Contents/MacOS/Blender -b szene.blend -P skript.py -o out/#### -F PNG -a`
   → PNG-Sequenz → mit ffmpeg zu MP4 (30 fps) → nach `videos/`.
3. LernStar-Look über ein gemeinsames `lernstar_blender.py` (Weltfarbe `#0f172a`, Material-Palette
   aus den Tokens, 1920×1080/30 fps).

Empfehlung: Blender gezielt beim ersten 3D-Video aufsetzen, nicht auf Vorrat.

## Prinzipien

- Wenige Werkzeuge, höchste Qualität – nicht möglichst viele Programme.
- Keine doppelten Funktionen (jedes Tool nur für seine Stärke).
- Bestehende Videos nie automatisch verändern.
- Neues immer testen (jedes Tool hat eine Beispielszene: Remotion diverse · MC `geschwindigkeit` · Manim `Parabel`).
