# LernStar Lernvideos (Remotion)

Programmatisch erstellte Lernvideos für die LernStar-Physikthemen.
Jedes Video ist eine React-Komposition unter `src/videos/`.

## Voraussetzung: Node.js

Remotion braucht **Node.js** (Version 18 oder neuer). Prüfen:

```bash
node -v
```

Falls nicht installiert: von <https://nodejs.org> (LTS) oder per Homebrew:

```bash
brew install node
```

## Einrichten (einmalig)

Im Ordner `videos-remotion/`:

```bash
npm install
```

Beim ersten Render lädt Remotion automatisch einen passenden Chromium-Browser herunter.

## Vorschau im Studio (interaktiv)

```bash
npm run studio
```

Öffnet das Remotion-Studio im Browser – dort kann man Szenen scrubben und live sehen.

## Video rendern (MP4 erzeugen)

```bash
# Trägheit (9.2.11)
npm run render:traegheit
# → out/traegheit.mp4

# oder allgemein eine beliebige Komposition:
npx remotion render <Id> out/<name>.mp4
```

## Ton: Sprecherstimme, Musik & Sound-Effekte

- **Sprecherstimme** (Narration): Text in `src/narration/<video>.json`, dann eine der beiden Pipelines:
  - `npm run audio` → macOS `say` (Stimme „Anna", offline, kein Key – klingt aber synthetisch).
  - `npm run audio:eleven` → **ElevenLabs** (natürliche Stimme, empfohlen). Braucht einen Key:
    entweder `ELEVENLABS_API_KEY` in der Umgebung **oder** Datei `~/.lernstar-eleven.key`
    (liegt außerhalb des Repos, wird nie committet). Stimme wählen mit `npm run voices`
    (listet alle Konto-Stimmen) und die gewünschte ID als `ELEVENLABS_VOICE_ID` setzen.
    Standard-Stimme: „George" (ruhig, männlich). Beide Pipelines schreiben identische
    `public/audio/<video>/*.wav` + Timings – die Videos bleiben unverändert.
- **Sound-Effekte**: liegen in `public/sfx/` (whoosh/pling/pop/impact). Zwei Wege:
  - `npm run sfx:synth` – lokal synthetisiert (Python, kein Key). Standard.
  - `npm run sfx:eleven` – höherwertig via ElevenLabs (braucht `ELEVENLABS_API_KEY` in der Umgebung).
    Danach `npm run sfx`, um die Datei-Zuordnung (`src/sfx.map.json`) zu aktualisieren.
- **Hintergrundmusik** (optional, aus): Datei nach `public/music/` legen und in `src/music.ts`
  `BG_MUSIC` setzen.

### ElevenLabs-MCP-Server (optional, für generierte SFX/TTS)

Installiert via `uv tool install elevenlabs-mcp`. Zum Aktivieren in Claude Code
(mit eigenem Key, lokaler Scope – landet nicht im Repo):

```bash
claude mcp add elevenlabs -s local \
  -e ELEVENLABS_API_KEY=sk_dein_key \
  -e ELEVENLABS_MCP_BASE_PATH="$(pwd)/public" \
  -- elevenlabs-mcp
```

Nach neuen/aktualisierten Effekten immer die betroffenen Videos neu rendern.

## In LernStar einbinden

1. Fertige MP4 nach `../videos/<id>.mp4` kopieren (Ordner in LernStar).
2. Im passenden `content.js`-Thema das Feld `video:'<id>.mp4'` setzen.
3. Versionsnummern in `index.html` erhöhen, committen, pushen.

## Kompositionen

| Id         | Thema                     | Datei                       |
|------------|---------------------------|-----------------------------|
| Traegheit  | 9.2.11 Trägheit (1. Newton) | `src/videos/Traegheit.tsx` |
| TraegheitAlltag | 9.2.12 Trägheit im Alltag | `src/videos/TraegheitAlltag.tsx` |
| Schwerelosigkeit | 9.2.13 Schwerelosigkeit | `src/videos/Schwerelosigkeit.tsx` |
| Orbit      | 9.2.14 Orbit / ISS        | `src/videos/Orbit.tsx`      |
| Rueckstoss | 9.2.15 Rückstoß / Rakete  | `src/videos/Rueckstoss.tsx` |
| Energie    | 9.3.1 Energie (Formen, Joule) | `src/videos/Energie.tsx` |
| Arbeit     | 9.3.2 Arbeit (W = F·s)    | `src/videos/Arbeit.tsx`     |
| Hubarbeit  | 9.3.3 Hubarbeit (W = m·g·h) | `src/videos/Hubarbeit.tsx` |
| Lageenergie | 9.3.4 Lageenergie (E = m·g·h) | `src/videos/Lageenergie.tsx` |
| Bewegungsenergie | 9.3.5 Bewegungsenergie (E = ½·m·v²) | `src/videos/Bewegungsenergie.tsx` |
| Reibungswaerme | 9.3.6 Energieumwandlung (Bewegung → Wärme) | `src/videos/Reibungswaerme.tsx` |
| LichtUndSehen | Kl.5 Optik: Licht und Sehen (Selbstleuchter/beleuchtet) | `src/videos/LichtUndSehen.tsx` |
| Schatten | Kl.5 Optik: Schatten (Schattenwurf, Sonnenfinsternis) | `src/videos/Schatten.tsx` |
| GegenstandSehen | Kl.5 Optik: Wie sehen wir? (Sender–Gegenstand–Empfänger) | `src/videos/GegenstandSehen.tsx` |
| Lichtausbreitung | Kl.5 Optik: Wie breitet sich Licht aus? (geradlinig, Lichtstrahl, 300 000 km/s) | `src/videos/Lichtausbreitung.tsx` |
| SchattenGroesse | Kl.5 Optik: Wovon hängt die Schattengröße ab? (Abstände) | `src/videos/SchattenGroesse.tsx` |
| KernHalbschatten | Kl.5 Optik: Kern- und Halbschatten (ausgedehnte Lichtquelle) | `src/videos/KernHalbschatten.tsx` |
| MagneteFelder | Kl.5 Magnetismus: Magnete & Magnetfelder (Pole, Feldlinien) | `src/videos/MagneteFelder.tsx` |
| MagnetStoffe | Kl.5 Magnetismus: Welche Stoffe zieht ein Magnet an? | `src/videos/MagnetStoffe.tsx` |
| Magnetpole | Kl.5 Magnetismus: Wie wirken Magnetpole? (anziehen/abstoßen) | `src/videos/Magnetpole.tsx` |
| Magnetfeld | Kl.5 Magnetismus: Wie sieht ein Magnetfeld aus? (Eisenspäne) | `src/videos/Magnetfeld.tsx` |
| Kompass | Kl.5 Magnetismus: Wie funktioniert ein Kompass? | `src/videos/Kompass.tsx` |
| Elektromagnet | Kl.5 Magnetismus: Der Elektromagnet (Spule, ein-/ausschaltbar) | `src/videos/Elektromagnet.tsx` |
| StromkreisSchaltzeichen | Kl.5 Stromkreis: Aufbau & Schaltzeichen | `src/videos/StromkreisSchaltzeichen.tsx` |
| StromkreisLampe | Kl.5 Stromkreis: Wann leuchtet eine Lampe? | `src/videos/StromkreisLampe.tsx` |
| LeiterNichtleiter | Kl.5 Stromkreis: Welche Stoffe leiten Strom? | `src/videos/LeiterNichtleiter.tsx` |
| Schaltplan | Kl.5 Stromkreis: Bild → Schaltplan | `src/videos/Schaltplan.tsx` |
| Reihenschaltung | Kl.5 Stromkreis: Reihenschaltung | `src/videos/Reihenschaltung.tsx` |
| Parallelschaltung | Kl.5 Stromkreis: Parallelschaltung | `src/videos/Parallelschaltung.tsx` |
| Stromwirkungen | Kl.5 Stromkreis: Wirkungen des Stroms (Licht/Wärme/Magnet/Bewegung) | `src/videos/Stromwirkungen.tsx` |
