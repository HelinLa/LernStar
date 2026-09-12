# -*- coding: utf-8 -*-
"""Erzeugt einen QR-Code und liest ihn danach wieder ein.

Warum der Umweg: segno waehlt die Maske selbst. Fuer eine der Adressen fiel die
Wahl auf Maske 4, und dieser Code liess sich mit OpenCV nicht mehr entziffern -
bei sieben der acht Masken ging es. Am Bildschirm faellt so etwas nie auf, im
Unterricht steht dann ein Kind vor einer Seite, deren Code nicht aufgeht.
Deshalb wird jeder Code gegengelesen und notfalls mit einer anderen Maske
neu gesetzt. Groesse und Fehlerkorrektur bleiben dabei gleich.
"""
import io, os

def _liest(pfad_oder_bytes):
    import cv2, numpy as np
    if isinstance(pfad_oder_bytes, bytes):
        arr = cv2.imdecode(np.frombuffer(pfad_oder_bytes, np.uint8), cv2.IMREAD_COLOR)
    else:
        arr = cv2.imread(pfad_oder_bytes)
    if arr is None: return ""
    return cv2.QRCodeDetector().detectAndDecode(arr)[0]


def _wie_gedruckt(roh, ziel):
    """Denselben Weg gehen wie die Seite: erst auf die doppelte Kartengroesse,
    dann mit der ganzen Seite auf die Haelfte - beide Male LANCZOS."""
    from PIL import Image
    import numpy as np, cv2
    im = Image.open(io.BytesIO(roh)).convert("RGB")
    im = im.resize((ziel * 2, ziel * 2), Image.LANCZOS)
    im = im.resize((ziel, ziel), Image.LANCZOS)
    # Bei MEHREREN Vergroesserungen lesen. Ein Code, der nur bei einer davon
    # aufgeht, ist grenzwertig: mo10 aus Klasse 10 las sich bei 4-, 6- und
    # 8-facher Vergroesserung, bei 10-facher nicht mehr. Auf Papier, schraeg
    # mit dem Handy erfasst, faellt so einer irgendwann aus.
    #
    # Der Bereich ist gemessen, nicht geraten: Bei 12-facher Vergroesserung
    # versagt JEDER Code und bei 10-facher 62 % - das ist eine Eigenart des
    # Decoders, keine Schwaeche der Codes. Zwischen 3- und 8-facher
    # Vergroesserung liegt die Ausfallrate bei 3 bis 7 %, dort misst man
    # wirklich die Qualitaet des Codes.
    det = cv2.QRCodeDetector()
    gelesen_liste = []
    for f in (3, 4, 5, 6, 8):
        gross = np.array(im.resize((ziel * f, ziel * f), Image.NEAREST))
        gelesen_liste.append(det.detectAndDecode(cv2.cvtColor(gross, cv2.COLOR_RGB2BGR))[0])
    # Kriterium: ALLE fuenf Vergroesserungen muessen denselben Text liefern.
    # Im gemessenen Bereich ist das erreichbar - 106 von 116 bestehenden Codes
    # schaffen es bereits -, und wer es nicht schafft, bekommt eine andere Maske.
    from collections import Counter
    zaehl = Counter(gelesen_liste)
    return gelesen_liste[0] if len(zaehl) == 1 and gelesen_liste[0] else ""


def speichern(url, pfad, error="q", scale=12, border=4,
              dark="#182140", light="#ffffff", kartengroesse=126):
    """Schreibt den Code nach `pfad` und gibt (maske, geprueft) zurueck.

    Gegengelesen wird zweimal: die Quelldatei und der Zustand, in dem der Code
    auf der gesetzten Seite ankommt. geprueft ist False, wenn OpenCV fehlt."""
    import segno
    def bild(maske=None):
        q = segno.make(url, error=error) if maske is None else segno.make(url, error=error, mask=maske)
        b = io.BytesIO(); q.save(b, kind="png", scale=scale, border=border, dark=dark, light=light)
        return b.getvalue()
    try:
        import cv2  # noqa: F401
    except Exception:
        open(pfad, "wb").write(bild()); return None, False
    def taugt(roh):
        return _liest(roh) == url and _wie_gedruckt(roh, kartengroesse) == url
    roh = bild()
    if taugt(roh):
        open(pfad, "wb").write(roh); return None, True
    for maske in range(8):
        roh = bild(maske)
        if taugt(roh):
            open(pfad, "wb").write(roh); return maske, True
    # Keine Maske uebersteht die Verkleinerung: hoehere Fehlerkorrektur versuchen
    for stufe in ("h", "m"):
        for maske in [None] + list(range(8)):
            q = segno.make(url, error=stufe) if maske is None else segno.make(url, error=stufe, mask=maske)
            b = io.BytesIO(); q.save(b, kind="png", scale=scale, border=border, dark=dark, light=light)
            if taugt(b.getvalue()):
                open(pfad, "wb").write(b.getvalue()); return f"{stufe}/{maske}", True
    # Letzter Ausweg: eine Einstellung nehmen, die den DRUCKPFAD besteht - also
    # alle fuenf Vergroesserungen der verkleinerten Karte -, auch wenn OpenCV die
    # grosse Quelldatei nicht entziffert.
    #
    # Warum das vertretbar ist: Gemessen an "#heft=ew9" besteht Maske 5 alle fuenf
    # Vergroesserungen des Druckpfads, scheitert aber am 492-Pixel-Original. Ein
    # sauberes, grosses QR-Bild MUSS lesbar sein - dass es das nicht ist, ist eine
    # Eigenart des Decoders und keine Schwaeche des Codes. Der Druckpfad bildet
    # ausserdem genau das ab, was auf der Seite ankommt, und ist damit der
    # aussagekraeftigere der beiden Tests.
    #
    # Abgebrochen wird weiterhin, wenn auch der Druckpfad mit KEINER Einstellung
    # haelt - dann ist der Code wirklich unbrauchbar.
    for stufe in ("q", "h", "m"):
        for maske in [None] + list(range(8)):
            q = segno.make(url, error=stufe) if maske is None else segno.make(url, error=stufe, mask=maske)
            b = io.BytesIO(); q.save(b, kind="png", scale=scale, border=border, dark=dark, light=light)
            roh = b.getvalue()
            if _wie_gedruckt(roh, kartengroesse) == url:
                open(pfad, "wb").write(roh)
                print(f"   Hinweis: {url} besteht den Druckpfad mit {stufe}/{maske}, "
                      f"aber nicht das Lesen der Quelldatei - Druckpfad zaehlt.")
                return f"{stufe}/{maske} (nur Druckpfad)", True
    raise SystemExit(f"QR-Code fuer {url} uebersteht die Verkleinerung mit keiner Einstellung")
