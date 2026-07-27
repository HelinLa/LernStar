# LernStar · Motion Canvas

Zweites Videosystem **neben** Remotion (`../videos-remotion`) zur Qualitäts­steigerung
der Mathe- & Physik-Lernvideos. Motion Canvas ist auf **weiche, präzise Vektor­animationen**
spezialisiert (signalgesteuertes Tweening, Formeln, Diagramme, Graphen) und ergänzt Remotion,
ohne es zu ersetzen. Beide nutzen dieselbe **LernStar-Farbwelt** (`src/theme.ts`).

## Wann welches System?

| | Remotion (`../videos-remotion`) | Motion Canvas (dieses Projekt) |
|---|---|---|
| Stärke | React/HTML-Layout, Emoji-Szenen, viele fertige Bausteine | flüssige gezeichnete Animationen, Formeln, Kurven, Morphing |
| Rendern | Headless per CLI (`remotion render`) | im Editor per Klick (FFmpeg-Export) |
| Gut für | erklärende Szenen mit Text/Icons/Karten | mathematische Herleitungen, animierte Graphen, Geometrie |

Neue Videos können in **einem** der beiden Systeme entstehen – das fertige `.mp4` landet
immer gleich in `../videos/` und wird in `../content.js` per `video:'name.mp4'` eingebunden.

## Setup (einmalig, bereits erledigt)

- `npm install` (Node v24 unter `~/.local/node`, PATH-Prefix `export PATH="$HOME/.local/node/bin:$PATH"`)
- **Vite ist auf 5.x gepinnt** – der `@motion-canvas/vite-plugin` (3.17.2) unterstützt nur Vite 4/5, nicht 8.
- Der `@motion-canvas/ffmpeg`-Plugin bringt **eigene ffmpeg/ffprobe-Binaries** mit (kein System-ffmpeg nötig).
  Falls die Sandbox `postinstall` blockiert (`npm warn allow-scripts`), einmal ausführbar machen:
  ```bash
  chmod u+x node_modules/@ffmpeg-installer/darwin-arm64/ffmpeg \
            node_modules/@ffprobe-installer/darwin-arm64/ffprobe
  ```
- `vite.config.ts` nutzt einen kleinen **CJS/ESM-Interop-Fix** (`.default ?? import`), weil der
  Default-Import unter Vite 5 das Namespace-Objekt statt der Plugin-Fabrik liefert.

## Befehle

```bash
export PATH="$HOME/.local/node/bin:$PATH"
cd videos-motion-canvas

npm start        # Editor unter http://localhost:9000  (Vorschau, Timeline, Rendern)
npm run build    # Produktions-Build (validiert alle Szenen/Imports)
```

## Neue Szene anlegen

1. `src/scenes/<name>.tsx` erstellen:
   ```tsx
   import {makeScene2D, Txt} from '@motion-canvas/2d';
   import {waitFor} from '@motion-canvas/core';
   import {COLORS, FONT} from '../theme';

   export default makeScene2D(function* (view) {
     view.fill(COLORS.bg0);
     view.add(<Txt text="Hallo" fill={COLORS.ink} fontFamily={FONT} fontSize={80} />);
     yield* waitFor(2);
   });
   ```
2. In `src/project.ts` importieren (mit `?scene`-Suffix!) und zu `scenes:[]` hinzufügen:
   ```ts
   import meineSzene from './scenes/name?scene';
   export default makeProject({name: 'LernStar', scenes: [meineSzene]});
   ```
3. Die zugehörige `<name>.meta` erzeugt der Editor automatisch beim ersten Start.

## Rendern → MP4 → in LernStar einbinden

1. `npm start` → Editor öffnen.
2. Oben rechts die **Video-Einstellungen** setzen: **1920 × 1080**, **30 fps** (passt zu den Remotion-Videos).
3. Als Exporter **„FFmpeg"** wählen → **Render** klicken → MP4 landet in `output/`.
4. `cp output/<name>.mp4 ../videos/<name>.mp4`
5. In `../content.js` beim passenden Thema `video:'<name>.mp4'` setzen und `content.js?v=` in `../index.html` hochzählen (wie bei Remotion), dann committen/pushen.

> Rendern läuft bei Motion Canvas über den Editor (Browser) – anders als Remotions Headless-CLI.
> Ein terminal-/CI-taugliches Headless-Rendering (Puppeteer, der den Editor steuert) lässt sich
> bei Bedarf ergänzen.

## Beispielszene

`src/scenes/geschwindigkeit.tsx` – Physik: „Was bedeutet schnell? v = s / t“. Auto fährt die
Straße entlang, Strecke und Zeit zählen live signalgesteuert mit, dann erscheint die Formel und
das Ergebnis (20 m/s). Zeigt die typische Motion-Canvas-Stärke der weichen, wertgekoppelten Animation.
