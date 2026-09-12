# -*- coding: utf-8 -*-
"""Misst die ECHTE Sprechdauer jeder Mikrohilfe - statt sie zu schätzen.

Das Wortbudget (60 Wörter = 30 s bei 2,0 Wörtern je Sekunde) ist ein Modell.
Ein Modell, das über eine ganze Reihe entscheidet, gehört nachgemessen: In
diesem Projekt lag eine Schätzung schon um den Faktor 2 daneben (Zeichenbreite)
und eine um 37 % (Seitenzahl).

Gemessen wird mit der deutschen Systemstimme (macOS `say`) - offline, ohne
Schlüssel, ohne Kosten. Die Stimme ist nicht die spätere Sprecherstimme; für
die Frage „passen 50 Wörter in 30 Sekunden?" genügt sie, solange das Tempo in
Wörtern je Minute festgehalten wird.

    python3 messen_dauer.py            # alle Hilfen bei allen drei Tempi
    python3 messen_dauer.py 140        # nur bei 140 Wörtern je Minute
"""
import json, os, glob, subprocess, tempfile, wave, sys, statistics
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from sprechfassung import hilfe_sprechfassung

HERE = os.path.dirname(os.path.abspath(__file__))
STIMME = os.environ.get("SAY_VOICE", "Anna")
PAUSE = 0.35          # Atempause zwischen zwei Teilen
STAND = 3.0           # Standzeit am Ende, wie im Profil


def dauer(text, wpm):
    """Sekunden, die die Stimme für diesen Satz braucht."""
    with tempfile.TemporaryDirectory() as t:
        aiff, wav = os.path.join(t, "a.aiff"), os.path.join(t, "a.wav")
        subprocess.run(["say", "-v", STIMME, "-r", str(wpm), "-o", aiff, text],
                       check=True, capture_output=True)
        subprocess.run(["afconvert", "-f", "WAVE", "-d", "LEI16", aiff, wav],
                       check=True, capture_output=True)
        with wave.open(wav) as w:
            return w.getnframes() / w.getframerate()


def messen(wpm):
    zeilen = []
    for p in sorted(glob.glob(os.path.join(HERE, "hilfen", "*.json"))):
        h = json.load(open(p, encoding="utf-8"))
        teile = hilfe_sprechfassung(h)
        s = sum(dauer(t, wpm) for _, t in teile) + PAUSE * (len(teile) - 1)
        w = sum(len(t.split()) for _, t in teile)
        zeilen.append((h["kennung"], w, h["woerter_gesamt"], s, s + STAND))
    return zeilen


if __name__ == "__main__":
    tempi = [int(a) for a in sys.argv[1:]] or [120, 140, 160]
    for wpm in tempi:
        z = messen(wpm)
        print(f"\n── {wpm} Wörter je Minute "
              f"({wpm/60:.2f} Wörter je Sekunde) ──")
        print(f"{'Hilfe':7} {'gespr.':>7} {'Modell':>7} {'Sprache':>9} "
              f"{'mit Standzeit':>14}  Urteil")
        print("-" * 66)
        for k, w, modell, s, ges in z:
            urteil = "passt" if ges <= 30 else "ZU LANG"
            print(f"{k:7} {w:7} {modell:7} {s:8.1f}s {ges:13.1f}s  {urteil}")
        ges = [x[4] for x in z]
        ws = [x[1] for x in z]
        echt = sum(ws) / sum(x[3] for x in z)
        print(f"{'':7} {'':7} {'':7} {'':9} {'':14}")
        print(f"  Median mit Standzeit {statistics.median(ges):.1f}s · "
              f"längste {max(ges):.1f}s · über 30 s: "
              f"{sum(1 for g in ges if g > 30)} von {len(ges)}")
        print(f"  GEMESSENES Tempo: {echt:.2f} Wörter je Sekunde "
              f"(Modell im Profil: 2,00)")
        print(f"  Budget bei diesem Tempo: {echt * (30 - STAND):.0f} gesprochene "
              f"Wörter für 30 s inklusive Standzeit")
