# -*- coding: utf-8 -*-
"""Wie viele Seiten braucht jede Einheit eines REGELHEFTS im gemeinsamen Fluss?

    python3 simcheck/regel_drei_seiten.py <band>          alle Einheiten des Bandes
    python3 simcheck/regel_drei_seiten.py <band> <id>     Umbruch einer Einheit + Kuerzungsmenue

Seit dem 06.10.2026 setzen die Regelhefte (Realschule 5/6-10, Gesamtschule 7-10)
Forscherseite und Uebungen in EINEM Fluss (build_book.einheit_pages), mit den
Groessen-Aufgaben aus content/groessen/<id>.json. Ziel wie im Foerderheft: jede
Einheit auf hoechstens drei Seiten. Gemessen wird genau so, wie einheit_pages
auswaehlt (Schreiblinien: Inhalt, hoechstens 4, hoechstens 3 - die wenigsten
Seiten gewinnen). "ueber 3" ist die Hoehe des Inhalts auf Seite 4 in Einheiten
(eine Textzeile = fd.LH, rund 28 Einheiten).
Schreibt nichts in den Band; eine Zusammenfassung je Band landet in
<band>/build/drei_seiten.json.
"""
import contextlib, io, json, os, sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def laden(band):
    d = os.path.join(ROOT, band); os.chdir(d); sys.path.insert(0, d)
    with contextlib.redirect_stdout(io.StringIO()):
        import build_book as bb
    return bb


def fluss(bb, band, ch, ti, tid):
    fd = bb.fd; cfg = bb.FSD[tid]; ub = bb.UEBD.get(tid)
    extra = (bb._diag(ch["id"], tid),) if band == "arbeitsheft" else ()
    mess = []
    # wie einheit_pages: erst mit, dann ohne die Zeile "Das möchte ich noch üben"
    for ueben in (True, False):
        for deckel in (None, 2):
            bb.ZEILEN_DECKEL = deckel; bb.UEBEN_ZEILE = ueben
            B, _k, _q = bb.topic_pages(cfg, ch["title"], ti + 1, 1, *extra, nur_bausteine=True)
            if ub is not None:
                U = bb.ch_uebung(ub, cfg, ch["title"], ti + 1, 1, cfg.get("ueberleitung"), nur_bausteine=True)
                U = [bb.b_band("Übungen", "Balken Übungen")] + [x for x in U[1:] if x.name != "Themenzeile"]
                B[-1].abstand = fd.ABS_ABSCHNITT; B = B + U
            mess.append((len(fd.umbrechen(B, fd.messe_bausteine(B, fd.STIL))), len(mess), B))
    bb.ZEILEN_DECKEL = None; bb.UEBEN_ZEILE = True
    smin = min(m[0] for m in mess)
    return min([m for m in mess if m[0] == smin], key=lambda m: m[1])[2]


def band_messen(band):
    bb = laden(band); fd = bb.fd; erg = {}
    for ch in bb.CHAPTERS:
        for ti, tid in enumerate(ch["topics"]):
            F = fluss(bb, band, ch, ti, tid)
            h = fd.messe_bausteine(F, fd.STIL); S = fd.umbrechen(F, h)
            ueber = None
            if len(S) > 3:
                i0, y0 = S[3][0]; il, yl = S[-1][-1]; ueber = round(yl + h[il] - y0)
            erg[tid] = {"seiten": len(S), "ueber_3": ueber, "groessen": bool(bb.groessen_daten(tid))}
    os.makedirs(os.path.join(ROOT, band, "build"), exist_ok=True)
    json.dump(erg, open(os.path.join(ROOT, band, "build", "drei_seiten.json"), "w"), indent=1)
    lang = {k: v["ueber_3"] for k, v in erg.items() if v["seiten"] > 3}
    print("%-20s %3d Einheiten | Seiten %s | mit Groessen-Datei %d" % (
        band, len(erg), dict(sorted(Counter(v["seiten"] for v in erg.values()).items())),
        sum(v["groessen"] for v in erg.values())))
    if lang:
        print("   ueber 3 Seiten (Hoehe auf Seite 4):", ", ".join("%s %d" % kv for kv in lang.items()))
    return erg


def einheit_zeigen(band, tid):
    bb = laden(band); fd = bb.fd
    for ch in bb.CHAPTERS:
        if tid in ch["topics"]:
            ti = ch["topics"].index(tid); break
    F = fluss(bb, band, ch, ti, tid)
    h = fd.messe_bausteine(F, fd.STIL); S = fd.umbrechen(F, h); kl = fd.verklammern(F)
    for si, s in enumerate(S):
        print("--- Seite", si + 1)
        for i, y in s:
            print("  %4d %4d +%2d haelt %d  %s" % (y, round(h[i]), F[i].abstand, kl[i], F[i].name))
        i, y = s[-1]; print("  frei", round(fd.UNTEN - (y + h[i])))
    if len(S) <= 3:
        print("\n%s steht auf %d Seiten." % (tid, len(S))); return
    menue = []
    for i, b in enumerate(F):
        if b.name.startswith(("Marke", "Balken", "Titel", "Unterkopf", "Schreiblinie", "Alltagslinie")):
            continue
        for k in (1, 2, 3):
            hh = list(h); hh[i] = max(0, h[i] - k * fd.LH)
            if len(fd.umbrechen(F, hh)) <= 3:
                menue.append((k, b.name)); break
        else:
            hh = list(h); hh[i] = 0
            if len(fd.umbrechen(F, hh)) <= 3:
                menue.append((9, b.name + " (ganz weg)"))
    print("\nKuerzungsmenue (je EIN Baustein):")
    for k, nm in sorted(menue):
        print("  %-28s %s" % (nm, "-%d Zeile(n)" % k if k < 9 else ""))
    if not menue:
        print("  kein einzelner Baustein reicht - mehrere Kuerzungen kombinieren")


if __name__ == "__main__":
    if len(sys.argv) == 3:
        einheit_zeigen(sys.argv[1], sys.argv[2])
    else:
        band_messen(sys.argv[1])
