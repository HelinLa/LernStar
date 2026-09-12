# -*- coding: utf-8 -*-
"""Erzeugt die QR-Codes des Hefts.  ->  qr/qr_<topicid>.png

Der Link traegt die Kurzform <BASE>#heft=<topicId>; welche Simulation dazugehoert,
weiss die App aus js/heft-bruecke.js. Die Bruecke MUSS die fo/fw-Kennungen also
kennen, bevor gedruckte Codes benutzt werden (arbeitsheft/bruecke_alle.py).

Neu bauen:  python3 make_qr.py   (noetig, wenn SIM, BASE oder die Seitenzuordnung sich aendern)
"""
import os, importlib.util
# Das Hilfsmodul liegt in arbeitsheft/. Es wird ueber seinen Pfad geladen und NICHT
# ueber sys.path - sonst wuerde das folgende "from build_book import ..." in jedem
# Heft das build_book von Klasse 5 erwischen.
_spec = importlib.util.spec_from_file_location("qr_lesbar", os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "arbeitsheft", "qr_lesbar.py"))
qr_lesbar = importlib.util.module_from_spec(_spec); _spec.loader.exec_module(qr_lesbar)
from build_book import SIM, HERE, sim_url

qdir = os.path.join(HERE, "qr"); os.makedirs(qdir, exist_ok=True)
n = 0; umgesetzt = []; ungeprueft = 0
for tid in SIM:
    url = sim_url(tid)
    if not url: continue
    # error='q' und border=4: Ein Code wurde beim Gegenlesen mit OpenCV nicht erkannt,
    # weil Ruhezone und Fehlerkorrektur zu knapp waren. Gedruckt und schraeg vom Tisch
    # abfotografiert ist das noch kritischer als am Bildschirm.
    maske, geprueft = qr_lesbar.speichern(url, os.path.join(qdir, f"qr_{tid}.png"),
                                          error='q', scale=12, border=4,
                                          dark="#182140", light="#ffffff")
    if maske is not None: umgesetzt.append(f"{tid} (Maske {maske})")
    if not geprueft: ungeprueft += 1
    n += 1
print(f"QR-Codes erzeugt: {n} -> {qdir}")
if umgesetzt: print("   mit anderer Maske gesetzt, weil nicht lesbar:", ", ".join(umgesetzt))
if ungeprueft: print(f"   ACHTUNG: {ungeprueft} Codes ohne Gegenlesen gespeichert (OpenCV fehlt)")
erste = next(iter(SIM))
print("Beispiel", erste + ":", sim_url(erste))
