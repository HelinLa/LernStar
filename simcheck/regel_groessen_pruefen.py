# -*- coding: utf-8 -*-
"""Groessen-Aufgaben der REGELHEFTE pruefen (06.10.2026).

    python3 simcheck/regel_groessen_pruefen.py <band> [<id> ...]

Die Daten liegen je Einheit in <band>/content/groessen/<id>.json:
    {"groessen": {"zeilen": [...]}, "zeichen": {"zeilen": [...]}}
Geprueft wird mit denselben Regeln wie im Foerderheft
(simcheck/foerder_groessen_pruefen.py, mit Selbsttest). "Auf der Seite" heisst
hier: Forscherseite UND Uebungsseite der Einheit.
"""
import importlib.util as u, json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sp = u.spec_from_file_location("fgp", os.path.join(ROOT, "simcheck", "foerder_groessen_pruefen.py"))
fgp = u.module_from_spec(sp); sp.loader.exec_module(fgp)


def _liste(p):
    d = json.load(open(p, encoding="utf-8"))
    return d if isinstance(d, list) else d.get("seiten", list(d.values()))


if __name__ == "__main__":
    g, k = fgp.selbsttest()
    print("Selbsttest bestanden (%d gute + %d kaputte Proben)." % (g, k))
    band = os.path.join(ROOT, sys.argv[1])
    fs = {e["id"]: e for e in _liste(os.path.join(band, "content", "forscherseiten.json"))}
    ub = {e["id"]: e for e in _liste(os.path.join(band, "content", "uebungen.json"))}
    gdir = os.path.join(band, "content", "groessen")
    ids = sys.argv[2:] or sorted(f[:-5] for f in os.listdir(gdir) if f.endswith(".json")) if os.path.isdir(gdir) else []
    cmap = fgp._cmap(); n = 0
    for eid in ids:
        p = os.path.join(gdir, eid + ".json")
        if not os.path.exists(p): continue
        if eid not in fs: print("  ✗ %s: keine Forscherseite mit dieser Kennung" % eid); n += 1; continue
        neu = json.load(open(p, encoding="utf-8"))
        seite = dict(fs[eid]); seite["uebung"] = ub.get(eid, {})
        seite.update({k: v for k, v in neu.items() if k in ("groessen", "zeichen")})
        b, h = fgp.pruefe(seite, cmap)
        for x in b: print("  ✗ %s: %s" % (eid, x))
        for x in h: print("  ? %s: %s" % (eid, x))
        n += len(b)
    print("BEFUNDE GESAMT: %d" % n)
    sys.exit(1 if n else 0)
