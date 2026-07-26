#!/usr/bin/env python3
"""Erzeugt die LernStar-Sound-Effekte über die ElevenLabs Sound-Effects-API.

Legt whoosh/pling/pop/impact als MP3 in public/sfx/ ab.
Braucht den API-Key in der Umgebungsvariable ELEVENLABS_API_KEY.

Aufruf:
    ELEVENLABS_API_KEY=xxxx python3 scripts/gen-sfx-elevenlabs.py [name ...]
"""
import json
import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

API_URL = "https://api.elevenlabs.io/v1/sound-generation"

# Effekt-Name -> (Prompt, Dauer in Sekunden). Namen = Dateinamen, die die
# Videos erwarten (Sfx sound="whoosh" usw.).
EFFECTS = {
    "whoosh":  ("A short, clean whoosh swipe transition sound, quick air movement, no music, no reverb tail", 0.7),
    "pling":   ("A single bright, cheerful UI success chime, one clear bell-like ding, short and clean", 1.0),
    "pop":     ("A short soft bubble pop, a light UI click blip, clean and dry", 0.5),
    "impact":  ("A soft muffled impact thud, low gentle bump, short and dry, no reverb", 0.6),
}

def main():
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit("FEHLER: ELEVENLABS_API_KEY ist nicht gesetzt.")

    only = [a.lower() for a in sys.argv[1:]]
    out_dir = Path(__file__).resolve().parent.parent / "public" / "sfx"
    out_dir.mkdir(parents=True, exist_ok=True)

    for name, (prompt, dur) in EFFECTS.items():
        if only and name not in only:
            continue
        body = json.dumps({
            "text": prompt,
            "duration_seconds": dur,
            "prompt_influence": 0.35,
        }).encode()
        req = urllib.request.Request(
            API_URL, data=body, method="POST",
            headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
        )
        try:
            with urllib.request.urlopen(req, timeout=120) as resp:
                audio = resp.read()
        except urllib.error.HTTPError as e:
            sys.exit(f"FEHLER bei '{name}': HTTP {e.code} – {e.read().decode(errors='replace')[:300]}")
        except urllib.error.URLError as e:
            sys.exit(f"FEHLER bei '{name}': {e}")
        dest = out_dir / f"{name}.mp3"
        dest.write_bytes(audio)
        print(f"  ✓ {name}.mp3  ({len(audio)//1024} KB, {dur}s)")

    print("Fertig. Jetzt:  npm run sfx   und Videos neu rendern.")

if __name__ == "__main__":
    main()
