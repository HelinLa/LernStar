# LernStar · Manim

Drittes Videosystem der Pipeline – spezialisiert auf **mathematische Animationen**:
Funktionen, Koordinatensysteme, Vektoren, Geometrie, Diagramme, Herleitungen.
Manim (3Blue1Brown-Engine) rendert gestochen scharfe Vektor-Mathematik. Gleiche
LernStar-Farbwelt/Format wie Remotion & Motion Canvas (`lernstar_theme.py` ↔ `../video-pipeline/design-tokens.json`).

## Installation (bereits erledigt)

Manim läuft in einer **conda/miniforge-Umgebung** (kein Homebrew/sudo nötig, bringt
cairo/pango/ffmpeg als Binaries mit – deshalb kein pycairo-Build-Problem):

```bash
# Miniforge liegt in ~/miniforge3 ; die Manim-Umgebung heißt "manim"
~/miniforge3/envs/manim/bin/manim --version   # Manim Community v0.20.1
```

Neuinstallation falls je nötig:
```bash
bash Miniforge3-MacOSX-arm64.sh -b -p ~/miniforge3
~/miniforge3/bin/mamba create -n manim -c conda-forge manim -y
```

> **LaTeX / Formelsatz:** `MathTex`/`Tex` brauchen eine LaTeX-Installation (nicht vorhanden).
> Graphen, Achsen, Vektoren, Geometrie, Diagramme funktionieren **ohne** LaTeX. Formeln bis
> auf Weiteres als `Text(...)` mit Unicode (z. B. „x²", „·", „÷", „√"). Für echten Formelsatz
> später `mamba install -n manim -c conda-forge texlive-core` ergänzen.

## Rendern (Terminal)

```bash
./render.sh scenes/parabel.py Parabel                # -> media/videos/.../Parabel.mp4
./render.sh scenes/parabel.py Parabel parabel-demo   # + cp nach ../videos/parabel-demo.mp4
```

Ausgabe: 1920×1080, 30 fps, `#0f172a`-Hintergrund (aus `manim.cfg` + `lernstar_theme.apply_config()`).

## Neue Szene

`scenes/<name>.py`:
```python
from manim import *
from lernstar_theme import COL, FONT, apply_config, header, caption
apply_config()

class MeineSzene(Scene):
    def construct(self):
        self.play(FadeIn(header("MATHEMATIK · THEMA", "Titel")))
        # ... Axes/Plots/Vektoren/Geometrie ...
```
`lernstar_theme` ist über `PYTHONPATH=.` importierbar (macht `render.sh` automatisch).

## Einbindung in LernStar

Wie bei Remotion/Motion Canvas: fertige MP4 nach `../videos/`, in `../content.js`
`video:'<name>.mp4'` setzen, `content.js?v=` in `../index.html` bumpen, committen.
Alternativ als **Clip-Ebene in Remotion** einbetten (Manim liefert die Mathe-Animation,
Remotion setzt Sprecher/Untertitel/Übergänge darüber – siehe `../video-pipeline/README.md`).

## Beispiel

`scenes/parabel.py` (`Parabel`): Koordinatensystem + Graph y = x² + ValueTracker-Punkt mit
live mitlaufenden Koordinaten. Zeigt Manims Mathe-Präzision in LernStar-Design.
