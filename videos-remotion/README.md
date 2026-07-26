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

## In LernStar einbinden

1. Fertige MP4 nach `../videos/<id>.mp4` kopieren (Ordner in LernStar).
2. Im passenden `content.js`-Thema das Feld `video:'<id>.mp4'` setzen.
3. Versionsnummern in `index.html` erhöhen, committen, pushen.

## Kompositionen

| Id         | Thema                     | Datei                       |
|------------|---------------------------|-----------------------------|
| Traegheit  | 9.2.11 Trägheit (1. Newton) | `src/videos/Traegheit.tsx` |
