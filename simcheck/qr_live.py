# -*- coding: utf-8 -*-
"""Prueft die GEDRUCKTEN QR-Codes gegen den AUSGELIEFERTEN Stand.

    python3 simcheck/qr_live.py <heftordner> [<heftordner> ...]
    python3 simcheck/qr_live.py --alle

Warum es dieses Werkzeug gibt: Zweimal (01.09.2026 und 05.09.2026) oeffneten
gedruckte QR-Codes nur die Startseite. Beide Male war der Code richtig, die App
richtig und die Simulation vorhanden - nur lag auf helinla.github.io eine
AELTERE js/heft-bruecke.js, die die Kennung nicht kannte. Die Arbeitskopie sagt
darueber nichts. Also wird hier ueber das Netz geprueft, nicht im Dateisystem.

Geprueft wird die ganze Kette, so wie ein Kind sie durchlaeuft:
  1. QR-Bild  ->  welche Adresse steht wirklich drin?
  2. Adresse  ->  ist es die erwartete Domain und die Kurzform #heft=<kennung>?
  3. Kennung  ->  kennt die LIVE ausgelieferte js/heft-bruecke.js sie?
  4. Bruecke  ->  traegt der Eintrag eine simId?
  5. simId    ->  steht die Simulation in der LIVE ausgelieferten physics-sim.js?

Exitcode 0 = jeder gedruckte Code fuehrt live zu seiner Simulation.
Exitcode 1 = mindestens einer laeuft ins Leere (Details stehen darueber).
"""
import glob, os, re, sys, urllib.request

BASIS = "https://helinla.github.io/LernStar"
WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Lage des QR-Abzeichens auf der gesetzten Seite - dieselbe Messung wie in
# simcheck/seitenzahlen.py, die Hefte teilen sich das Seitenraster.
AUSSCHNITT = (1050, 53, 1176, 179)


def hole(pfad):
    """Laedt eine Datei von der ausgelieferten Seite. Cache-Buster, damit kein
    Proxy eine alte Fassung unterschiebt."""
    url = f"{BASIS}/{pfad}?frisch=qrlive"
    with urllib.request.urlopen(url, timeout=45) as r:
        return r.read().decode("utf-8", "replace")


def qr_der_seite(pfad):
    """Entziffert den QR-Code einer GESETZTEN Heftseite.

    Gelesen wird die Seite, nicht die einzelne qr/*.png: Genau darin lag der
    zweite Fehlalarm dieses Werkzeugs. arbeitsheft_gts7/qr/qr_ew9.png ist als
    Einzeldatei (Palettenmodus) von OpenCV bei KEINER Vergroesserung lesbar -
    auf der gedruckten Seite 59 dagegen sofort bei 4x. Was zaehlt, ist das
    Blatt in der Hand des Kindes."""
    import cv2, numpy as np
    from PIL import Image
    im = Image.open(pfad).convert("RGB").crop(AUSSCHNITT)
    det = cv2.QRCodeDetector()
    for f in (4, 6, 3, 8, 5, 2):
        gross = np.array(im.resize((im.width * f, im.height * f), Image.NEAREST))
        try:
            txt = det.detectAndDecode(cv2.cvtColor(gross, cv2.COLOR_RGB2BGR))[0]
        except cv2.error:
            continue
        if txt:
            return txt
    return None


def kennungen_der_bruecke(js):
    """Alle Kennungen mit ihrer simId aus einer heft-bruecke.js."""
    eintraege = {}
    for m in re.finditer(r'"([A-Za-z]+\d+)":\s*\{(.*?)\n  \},', js, re.S):
        sim = re.search(r'sim:\s*("([^"]*)"|null)', m.group(2))
        eintraege[m.group(1)] = (sim.group(2) if sim and sim.group(2) else None)
    return eintraege


def sims_der_registry(js):
    """Alle simIds, die physics-sim.js in _physSimDefs kennt.

    ACHTUNG, hier lag der erste Fehlalarm dieses Werkzeugs: Die Eintraege sehen
    NICHT wie  'prisma': {  aus, sondern wie  'prisma': modal => {  - ein Muster
    auf ':' + '{' findet nur die Arbeitsblatt-Tabelle (110 statt 221 Eintraege)
    und meldet dann jede echte Simulation als fehlend. Deshalb wird der Block
    _physSimDefs ausgeschnitten und darin jeder Schluessel genommen."""
    i = js.find("const _physSimDefs")
    if i < 0:
        raise SystemExit("physics-sim.js: _physSimDefs nicht gefunden - Werkzeug anpassen")
    block = js[i:]
    # bis zur naechsten Zeile, die auf Spaltenanfang schliesst ("};")
    ende = re.search(r"^\};", block, re.M)
    if ende:
        block = block[:ende.start()]
    return set(re.findall(r"^\s{0,4}['\"]([a-z0-9_\-]+)['\"]\s*:", block, re.M))


def pruefe(heftordner, bruecke, registry):
    name = os.path.basename(heftordner.rstrip("/"))
    seiten = sorted(glob.glob(os.path.join(heftordner, "build", "book_p*.png")),
                    key=lambda p: int(re.search(r"book_p(\d+)\.png$", p).group(1)))
    if not seiten:
        print(f"  -- {name}: kein gesetztes Heft in build/ - uebersprungen (erst build_book.py)")
        return []
    fehler = []; gefunden = 0
    for p in seiten:
        nr = int(re.search(r"book_p(\d+)\.png$", p).group(1))
        txt = qr_der_seite(p)
        if not txt:
            continue                       # Seite ohne QR-Code: normal (Deckblatt, Trenner, Test)
        gefunden += 1
        ort = f"Seite {nr}"
        if not txt.startswith(BASIS + "/"):
            fehler.append((ort, f"fremde Adresse: {txt[:70]}")); continue
        m = re.search(r"#heft=([A-Za-z0-9]+)$", txt)
        if not m:
            # Langform #experiment=<sim> ist erlaubt und braucht die Bruecke nicht
            me = re.search(r"#experiment=([a-z0-9_\-]+)$", txt)
            if me:
                if me.group(1) not in registry:
                    fehler.append((ort, f"Simulation '{me.group(1)}' fehlt live"))
                continue
            fehler.append((ort, f"unerwartete Adressform: {txt[:70]}")); continue
        k = m.group(1)
        ort = f"{k} (Seite {nr})"
        if k not in bruecke:
            fehler.append((ort, "Kennung fehlt in der AUSGELIEFERTEN heft-bruecke.js"))
        elif not bruecke[k]:
            fehler.append((ort, "hat live keine Simulation (sim: null)"))
        elif bruecke[k] not in registry:
            fehler.append((ort, f"Simulation '{bruecke[k]}' fehlt in der ausgelieferten physics-sim.js"))
    ok = gefunden - len(fehler)
    zeichen = "OK " if not fehler else "!! "
    print(f"  {zeichen}{name}: {ok}/{gefunden} gedruckte Codes fuehren live zu ihrer Simulation")
    for ort, grund in fehler:
        print(f"       {ort}: {grund}")
    return fehler


def main():
    ordner = sys.argv[1:]
    if not ordner or ordner == ["--alle"]:
        ordner = sorted(d for d in glob.glob(os.path.join(WURZEL, "arbeitsheft*"))
                        if os.path.isdir(os.path.join(d, "build")))
    print(f"Ausgelieferter Stand: {BASIS}")
    try:
        bruecke = kennungen_der_bruecke(hole("js/heft-bruecke.js"))
        registry = sims_der_registry(hole("physics-sim.js"))
    except Exception as e:
        print("FEHLER: ausgelieferter Stand nicht erreichbar:", e); return 1
    print(f"  live: {len(bruecke)} Heftseiten in der Bruecke, {len(registry)} Simulationen\n")
    alle = []
    for d in ordner:
        alle += pruefe(d, bruecke, registry)
    print()
    if alle:
        print(f"{len(alle)} gedruckte QR-Codes laufen ins Leere.")
        print("Wahrscheinlichste Ursache: js/heft-bruecke.js ist nicht committet/gepusht.")
        print("  python3 arbeitsheft/bruecke_alle.py && git add js/heft-bruecke.js index.html && git commit && git push")
        return 1
    print("Alle gedruckten QR-Codes oeffnen live ihre Simulation.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
