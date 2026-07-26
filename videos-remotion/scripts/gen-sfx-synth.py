#!/usr/bin/env python3
"""Synthetisiert die LernStar-Sound-Effekte lokal (nur Python-Standardbibliothek).

Erzeugt whoosh/pling/pop/impact als WAV in public/sfx/ – ohne API-Key.
(Ersetzbar durch höherwertige Effekte via scripts/gen-sfx-elevenlabs.py.)

Aufruf:  python3 scripts/gen-sfx-synth.py
"""
import math
import random
import struct
import wave
from pathlib import Path

SR = 44100


def write_wav(path, samples):
    # auf 0.85 Peak normalisieren
    peak = max(1e-6, max(abs(s) for s in samples))
    g = 0.85 / peak
    frames = b"".join(struct.pack("<h", int(max(-1.0, min(1.0, s * g)) * 32767)) for s in samples)
    with wave.open(str(path), "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(frames)


def whoosh(dur=0.6):
    n = int(SR * dur)
    out = []
    lp = 0.0
    for i in range(n):
        t = i / n
        # gefiltertes Rauschen, Cutoff steigt (Swipe-Bewegung)
        a = 0.04 + 0.35 * t
        x = random.uniform(-1, 1)
        lp = lp + a * (x - lp)
        env = math.sin(math.pi * t) ** 1.5  # sanft rein/raus
        out.append(lp * env)
    return out


def pling(dur=0.9):
    n = int(SR * dur)
    partials = [(1.0, 1.0, 0.30), (2.0, 0.5, 0.22), (3.01, 0.25, 0.16), (4.2, 0.12, 0.12)]
    f0 = 987.0  # helles B5
    out = []
    for i in range(n):
        t = i / SR
        s = 0.0
        for mult, amp, tau in partials:
            s += amp * math.sin(2 * math.pi * f0 * mult * t) * math.exp(-t / tau)
        out.append(s)
    return out


def pop(dur=0.16):
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        # kurzer Blip mit schnellem Pitch-Drop + Klick
        f = 900 * math.exp(-t / 0.02) + 300
        env = math.exp(-t / 0.028)
        s = math.sin(2 * math.pi * f * t) * env
        if i < 60:
            s += random.uniform(-1, 1) * 0.4 * (1 - i / 60)
        out.append(s)
    return out


def impact(dur=0.45):
    n = int(SR * dur)
    out = []
    for i in range(n):
        t = i / SR
        # tiefer Thud: Pitch fällt von 150 auf 60 Hz, schneller Abfall
        f = 60 + 90 * math.exp(-t / 0.05)
        env = math.exp(-t / 0.12)
        s = math.sin(2 * math.pi * f * t) * env
        if i < 200:
            s += random.uniform(-1, 1) * 0.25 * (1 - i / 200) * env
        out.append(s)
    return out


def main():
    random.seed(42)  # reproduzierbar
    out_dir = Path(__file__).resolve().parent.parent / "public" / "sfx"
    out_dir.mkdir(parents=True, exist_ok=True)
    for name, fn in (("whoosh", whoosh), ("pling", pling), ("pop", pop), ("impact", impact)):
        samples = fn()
        write_wav(out_dir / f"{name}.wav", samples)
        print(f"  ✓ {name}.wav  ({len(samples)/SR:.2f}s)")
    print("Fertig. Jetzt:  npm run sfx  und Videos neu rendern.")


if __name__ == "__main__":
    main()
