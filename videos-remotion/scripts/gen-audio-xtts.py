#!/usr/bin/env python
"""Erzeugt Sprecher-Audio in einer geklonten Stimme (Coqui XTTS-v2) –
kompatibel zur bestehenden Pipeline: schreibt public/audio/<base>/<id>.wav
und src/narration/<base>.timings.json (Sekunden je Abschnitt).

Aufruf (aus videos-remotion/):
  ~/miniforge3/envs/xtts/bin/python scripts/gen-audio-xtts.py <base ...>
Referenzstimme via ENV SPEAKER_WAV (Default: ~/Desktop/meine-stimme.wav).
"""
import os, sys, json, wave, contextlib, subprocess, tempfile

os.environ.setdefault("COQUI_TOS_AGREED", "1")
SPEED = float(os.environ.get("XTTS_SPEED", "1.05"))
FFMPEG = os.environ.get("FFMPEG", os.path.expanduser(
    "~/Desktop/Claude/LernStar/videos-motion-canvas/node_modules/@ffmpeg-installer/darwin-arm64/ffmpeg"))
# Profi-Kette (YouTube-Erklärvideo-Niveau) – Stimme bleibt authentisch:
#  1) highpass         Trittschall/Rumpeln raus
#  2) afftdn           Breitband-Entrauschung (Hintergrundgeräusche weg)
#  3) equalizer -240Hz  Dröhnen/Mulm reduzieren → klarer
#  4) deesser          Zischlaute (S/Sch) entschärfen → angenehm
#  5) equalizer +2.8k  Präsenz/Sprachverständlichkeit anheben
#  6) treble +7.5k     etwas "Luft"/Frische
#  7) acompressor      gleichmäßige Lautstärke, leise Konsonanten präsenter
#  8) silenceremove    zu lange Pausen (>0,35 s) kappen + Enden sauber trimmen
#  9) loudnorm -14 LUFS  YouTube-Standard-Pegel
FILT = ("highpass=f=85,"
        "afftdn=nr=12:nf=-30,"
        "equalizer=f=240:t=q:w=1.1:g=-2.5,"
        "deesser=i=0.35,"
        "equalizer=f=2800:t=q:w=1.5:g=3,"
        "treble=g=2:f=7500,"
        "acompressor=threshold=-18dB:ratio=3:attack=6:release=140:makeup=3,"
        "silenceremove=stop_periods=-1:stop_duration=0.35:stop_threshold=-40dB:detection=peak,"
        "areverse,silenceremove=start_periods=1:start_silence=0.06:start_threshold=-45dB:detection=peak,areverse,"
        "silenceremove=start_periods=1:start_silence=0.06:start_threshold=-45dB:detection=peak,"
        "loudnorm=I=-14:TP=-1.5:LRA=11")

XTTS_KW = dict(temperature=0.5, length_penalty=1.0, repetition_penalty=7.0, top_k=50, top_p=0.8)

def postprocess(raw, out):
    subprocess.run([FFMPEG, "-hide_banner", "-y", "-i", raw, "-af", FILT, "-ar", "24000", "-ac", "1", out],
                   check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
# Shim: isin_mps_friendly wurde in transformers>=4.57 entfernt (Tortoise-Import).
import torch
import transformers.pytorch_utils as _pu
if not hasattr(_pu, "isin_mps_friendly"):
    def _isin_mps_friendly(elements, test_elements):
        return torch.isin(elements, test_elements)
    _pu.isin_mps_friendly = _isin_mps_friendly

from TTS.api import TTS

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # videos-remotion/
SPEAKER = os.path.expanduser(os.environ.get("SPEAKER_WAV", "~/Desktop/meine-stimme-clean.wav"))
LANG = os.environ.get("XTTS_LANG", "de")

bases = sys.argv[1:]
if not bases:
    print("Bitte mind. einen <base> angeben.")
    sys.exit(1)
if not os.path.exists(SPEAKER):
    print(f"Referenzstimme fehlt: {SPEAKER}")
    sys.exit(1)

print(">>> lade XTTS-v2 …", flush=True)
tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2")

def wav_seconds(path):
    with contextlib.closing(wave.open(path, "r")) as w:
        return round(w.getnframes() / float(w.getframerate()), 3)

for base in bases:
    njson = os.path.join(ROOT, "src", "narration", base + ".json")
    with open(njson, encoding="utf-8") as f:
        segs = json.load(f)
    outdir = os.path.join(ROOT, "public", "audio", base)
    os.makedirs(outdir, exist_ok=True)
    timings = {}
    for s in segs:
        wid, text = s["id"], s["text"]
        wpath = os.path.join(outdir, wid + ".wav")
        raw = os.path.join(outdir, wid + ".raw.wav")
        tts.tts_to_file(text=text, speaker_wav=SPEAKER, language=LANG, speed=SPEED, file_path=raw, **XTTS_KW)
        postprocess(raw, wpath)
        os.remove(raw)
        timings[wid] = wav_seconds(wpath)
        print(f"  {base}/{wid}: {timings[wid]}s", flush=True)
    with open(os.path.join(ROOT, "src", "narration", base + ".timings.json"), "w", encoding="utf-8") as f:
        json.dump(timings, f, ensure_ascii=False, indent=0)
    print(f"✓ {base}: {len(segs)} Clips + timings.json (Stimme: {os.path.basename(SPEAKER)})", flush=True)

print("XTTSDONE", flush=True)
