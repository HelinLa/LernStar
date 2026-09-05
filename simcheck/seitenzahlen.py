# -*- coding: utf-8 -*-
"""Liest die Seitenzahlen des Hefts aus den GESETZTEN Seiten - nicht aus einer Rechnung.

    python3 simcheck/seitenzahlen.py <heftordner>

Jede Themenseite traegt oben rechts ihren QR-Code. Dieser Durchgang schneidet ihn
aus jeder Seite von build/book_p<N>.png aus, entziffert ihn und schreibt
<heft>/build/seiten.json - die Zuordnung Kennung -> Seitenzahl.

WARUM GEMESSEN UND NICHT GERECHNET: export_bruecke.py hat die Seitenlogik frueher
nachgebaut und geriet aus dem Tritt, als je Kapitel eine Weiterdenken-Seite
dazukam. 124 von 173 Seitenzahlen in der App waren falsch, bei Klasse 9 teils um
30 Seiten. Die gesetzten Seiten wissen es besser als jede Formel.
"""
import json, os, re, sys, glob

# Lage des QR-Abzeichens auf der gesetzten Seite (gemessen, nicht geraten)
AUSSCHNITT = (1050, 53, 1176, 179)


def lies_qr(pfad, ausschnitt=AUSSCHNITT):
    """Gibt die Kennung zurueck, die der QR-Code dieser Seite traegt - oder None."""
    import cv2, numpy as np
    from PIL import Image
    im = Image.open(pfad).convert("RGB").crop(ausschnitt)
    det = cv2.QRCodeDetector()
    # Mehrere Vergroesserungen versuchen: der Decoder ist bei manchen Codes
    # waehlerisch, und ein einzelner Fehlversuch darf keine Seite verschlucken.
    for f in (4, 6, 3, 8, 5):
        gross = np.array(im.resize((im.width * f, im.height * f), Image.NEAREST))
        txt = det.detectAndDecode(cv2.cvtColor(gross, cv2.COLOR_RGB2BGR))[0]
        if txt:
            m = re.search(r"heft=([A-Za-z]+\d+)", txt)
            if m:
                return m.group(1)
    return None


def messen(heft):
    bd = os.path.join(heft, "build")
    seiten = {}
    dateien = sorted(glob.glob(os.path.join(bd, "book_p*.png")),
                     key=lambda p: int(re.search(r"book_p(\d+)\.png$", p).group(1)))
    ohne = 0
    for p in dateien:
        n = int(re.search(r"book_p(\d+)\.png$", p).group(1))
        tid = lies_qr(p)
        if tid:
            # ERSTER Treffer gilt. In den Regelheften kommt jede Kennung genau einmal
            # vor - dort ist das gleichbedeutend. Im Foerderheft tragen Seite A und
            # Seite B denselben Code; gemeint ist die Seite, auf der das Thema
            # anfaengt, also A. Wer den letzten Treffer nimmt, schickt die App auf
            # die Uebungsseite.
            if tid in seiten:
                print(f"   · {tid}: auch auf Seite {n} (gilt weiter Seite {seiten[tid]})")
                continue
            seiten[tid] = n
        else:
            ohne += 1
    return seiten, len(dateien), ohne


def main():
    heft = sys.argv[1].rstrip("/")
    seiten, ges, ohne = messen(heft)
    ziel = os.path.join(heft, "build", "seiten.json")
    json.dump(dict(sorted(seiten.items())), open(ziel, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    print(f"{len(seiten)} Seitenzahlen aus {ges} gesetzten Seiten gemessen "
          f"({ohne} Seiten ohne QR-Code, das ist normal)")
    print("geschrieben:", os.path.relpath(ziel))


if __name__ == "__main__":
    main()
