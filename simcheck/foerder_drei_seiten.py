# -*- coding: utf-8 -*-
"""Steht jede Foerder-Einheit auf DREI Seiten? Und wenn nicht: wo kuerzen?

    python3 simcheck/foerder_drei_seiten.py                 alle Foerderbaende messen
    python3 simcheck/foerder_drei_seiten.py <band> <id>     Umbruch + Kuerzungsmenue einer Einheit

Abdullah, 05.10.2026: "wir wollten alle Themen auf drei Seiten kuerzen". Der
Kompaktsatz (seite_ab) setzt Teil A und B in einem Fluss; braucht eine Einheit
trotzdem vier Seiten, liegt das fast nie am Gesamtumfang, sondern an EINEM
grossen Block (Tabelle, Rechentabelle, Hilfen), der um wenige Einheiten nicht
mehr auf die vorige Seite passt und dann ganz weiterrutscht - Seite 1 bis 3
hatten im Mittel 300 Einheiten Luft. Das Menue sagt deshalb je Baustein, wie
viele Zeilen (33,5 Einheiten) er kuerzer sein muesste, damit es 3 Seiten werden.
Gemessen wird mit 3 Schreibzeilen in Aufgabe 3 (das Minimum von einpassen()).

Liest einheiten/<id>.json direkt - content/ muss nicht zusammengefuehrt sein.
"""
import json, os, sys, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BAENDE = ["arbeitsheft_foe7", "arbeitsheft_foe8", "arbeitsheft_foe9", "arbeitsheft_foe10",
          "arbeitsheft_foe_ef", "arbeitsheft_bio_foe56", "arbeitsheft_bio_foe7",
          "arbeitsheft_bio_foe8", "arbeitsheft_chem_foe8", "arbeitsheft_mathe_foe5"]


def _laden(band):
    os.chdir(os.path.join(ROOT, band)); sys.path.insert(0, os.getcwd())
    import build_pilot as bp
    import importlib.util as u
    s = u.spec_from_file_location("plan", "plan.py"); p = u.module_from_spec(s); s.loader.exec_module(p)
    th = getattr(p, "THEMEN", None) or [t for k in getattr(p, "KAPITEL", []) for t in k["themen"]]
    im = getattr(p, "IM_HEFT", None)
    if im:
        th = [t for k in p.KAPITEL_GEPLANT if k["id"] in im for t in k["themen"]]
    return bp, [t["id"] for t in th]


def _einheit(bp, eid):
    e = json.load(open(os.path.join("einheiten", eid + ".json"), encoding="utf-8"))
    e["seite"]["id"] = e["lehrer"]["id"] = eid
    bp.SEITEN[eid] = e["seite"]; bp.LOES[eid] = e["lehrer"]
    return e["seite"]


def band_messen(band):
    bp, ids = _laden(band)
    return {eid: len(bp.seite_ab(_einheit(bp, eid), 1)) for eid in ids
            if os.path.exists(os.path.join("einheiten", eid + ".json"))}


def einheit_zeigen(band, eid):
    bp, _ = _laden(band); fd = bp.fd
    cfg = _einheit(bp, eid)
    B = bp.bausteine_ab(cfg, 3); h = fd.messe_bausteine(B, fd.STIL)
    S = fd.umbrechen(B, h); kl = fd.verklammern(B)
    for si, s in enumerate(S):
        print("--- Seite", si + 1)
        for i, y in s:
            print("  %4d %4d +%2d haelt %d  %s" % (y, round(h[i]), B[i].abstand, kl[i], B[i].name))
        i, y = s[-1]; print("  frei", round(fd.UNTEN - (y + h[i])))
    if len(S) <= 3:
        print("\n%s steht auf %d Seiten." % (eid, len(S))); return
    LH = bp.LH_FOE
    menue = []
    for i, b in enumerate(B):
        if b.name.startswith(("Marke", "Balken", "Titel", "Unterkopf", "Schreiblinie", "Satzanfang")):
            continue
        for k in (1, 2, 3):
            hh = list(h); hh[i] = max(0, h[i] - k * LH)
            if len(fd.umbrechen(B, hh)) <= 3:
                menue.append((k, b.name)); break
        else:
            hh = list(h); hh[i] = 0
            if len(fd.umbrechen(B, hh)) <= 3:
                menue.append((9, b.name + " (ganz weg)"))
    print("\nKuerzungsmenue (je EIN Baustein):")
    for k, nm in sorted(menue):
        print("  %-28s %s" % (nm, "-%d Zeile(n)" % k if k < 9 else ""))
    if not menue:
        print("  kein einzelner Baustein reicht - mehrere kleine Kuerzungen kombinieren")


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--band":
        m = band_messen(sys.argv[2])
        lang = {k: v for k, v in m.items() if v != 3}
        print("%-24s %3d Einheiten, %s" % (sys.argv[2], len(m),
              ("alle auf 3 Seiten" if not lang else
               "nicht auf 3: " + ", ".join("%s %d Seiten" % kv for kv in lang.items()))))
        sys.exit(0)
    if len(sys.argv) == 3:
        einheit_zeigen(sys.argv[1], sys.argv[2]); sys.exit(0)
    zu_lang = 0
    for band in BAENDE:
        # je Band ein eigener Prozess: jedes Band hat sein eigenes build_pilot
        r = subprocess.run([sys.executable, __file__, "--band", band], capture_output=True, text=True)
        print(r.stdout.strip() or r.stderr.strip()[-400:])
        zu_lang += r.stdout.count("4 Seiten") + r.stdout.count("5 Seiten")
    sys.exit(1 if zu_lang else 0)
