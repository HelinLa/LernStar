# -*- coding: utf-8 -*-
"""Wie viele Blaetter braucht eine Forschereinheit - ohne den ganzen Band zu setzen?

    python3 simcheck/seitenlaenge.py <bandordner> [id ...]

Vergleicht den heutigen Stand mit der Sicherung <content>.vor_forschen und meldet
je Einheit die Blattzahl und den Rest auf dem letzten Blatt. Damit laesst sich eine
umgeschriebene Seite auf die alte Laenge bringen, BEVOR der Band neu gesetzt wird
(ein Bandbau dauert Minuten, diese Messung Sekunden).

Hintergrund: Abdullah am 18.09.2026 - KEIN Band darf Seitenzahlen verschieben.
Kuerzer ist also genauso schlimm wie laenger: Beim ersten Anlauf schrumpfte
Gesamtschule 9 von 146 auf 141 Seiten, 15 Seitenzahlen rutschten.
"""
import importlib.util as ilu
import io, json, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LS = os.path.dirname(HERE)


def lade(band):
    ordner = os.path.join(LS, band)
    # build_book.py importiert `plan` und `felo_design` ueber den Suchpfad -
    # beide Ordner muessen davor stehen, sonst findet es plan.py nicht.
    sys.path.insert(0, os.path.join(LS, "arbeitsheft"))
    sys.path.insert(0, ordner)
    kwd = os.getcwd()
    os.chdir(ordner)
    sp = ilu.spec_from_file_location("bb_" + band, os.path.join(ordner, "build_book.py"))
    m = ilu.module_from_spec(sp)
    alt = sys.argv
    sys.argv = ["x", "--nur-import"]
    try:
        sp.loader.exec_module(m)
    except SystemExit:
        pass
    finally:
        sys.argv = alt
        os.chdir(kwd)
    return m


def blaetter(bb, cfg):
    """Blattzahl und Rest auf dem letzten Blatt fuer EINE Einheit."""
    seiten = bb.topic_pages(cfg, "Kapitel", 1, 10)
    return len(seiten)


def main():
    band = sys.argv[1]
    ids = [a for a in sys.argv[2:] if not a.startswith("-")]
    bb = lade(band)
    p = os.path.join(LS, band, "content", "forscherseiten.json")
    jetzt = json.load(io.open(p, encoding="utf-8"))
    jetzt = jetzt if isinstance(jetzt, list) else jetzt["seiten"]
    vor = None
    if os.path.exists(p + ".vor_forschen"):
        vor = json.load(io.open(p + ".vor_forschen", encoding="utf-8"))
        vor = vor if isinstance(vor, list) else vor["seiten"]
        vor = {x["id"]: x for x in vor}
    schlimm = 0
    for s in jetzt:
        if ids and s["id"] not in ids:
            continue
        n = blaetter(bb, s)
        if vor and s["id"] in vor:
            a = blaetter(bb, vor[s["id"]])
            zeichen = "ok " if a == n else "!! "
            if a != n:
                schlimm += 1
            print("%s%-6s %d Blatt (vorher %d)" % (zeichen, s["id"], n, a))
        else:
            print("   %-6s %d Blatt" % (s["id"], n))
    if vor:
        print("%d Einheiten mit anderer Blattzahl" % schlimm)
    return 1 if schlimm else 0


if __name__ == "__main__":
    sys.exit(main())
