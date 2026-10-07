# -*- coding: utf-8 -*-
"""Lueckensaetze der FOERDERHEFTE fuer die Handschrift pruefen (07.10.2026).

    python3 simcheck/foerder_luecken_pruefen.py <band> [<id> ...]

Wie simcheck/luecken_pruefen.py fuer die Regelhefte, aber mit dem Umbruch des
Foerdersatzes (build_pilot._luecken_token / _fluss, 14 pt). Gemeldet:
  DREI ZEILEN   der Satz braucht 3 oder mehr Zeilen
  RUTSCHT       die Luecke steht in der letzten Zeile fast allein
  REST          ein einzelnes kurzes Wort steht allein in der letzten Zeile
Geprueft: Merksatz (Merkkasten) und die Lueckensaetze der Aufgabe „Trage ein“.
"""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
band = sys.argv[1]; os.chdir(os.path.join(ROOT, band)); sys.path.insert(0, os.getcwd())
import io, contextlib
with contextlib.redirect_stdout(io.StringIO()):
    import build_pilot as bp
fd = bp.fd
H = bp.messhilfe(); F = fd.schrift("reg", bp.FOE)
B_MERK = (fd.KASTEN_X1 - fd.KASTEN_X0) - 61
B_LESE = bp.LESE


def zeilen(m, maxw):
    tok = bp._luecken_token(H, m, F, maxw)
    sp = H.tw(" ", F)
    def suf_ab(t): return 2 if bp._SATZZEICHEN.match(t[2]) else sp
    def breite(t):
        if t[0] == "t": return H.tw(t[1], F)
        return t[1] + ((suf_ab(t) + H.tw(t[2], F)) if t[2] else 0)
    z = [[]]; cx = 0.0
    for t in tok:
        w = breite(t)
        if cx + w > maxw and z[-1]:
            neu = []; zz = z[-1]
            if t[0] == "gap" and len(zz) >= 2 and zz[-1][0] == "t":
                neu = zz[-1:]; del zz[-1:]
            z.append(neu); cx = sum(breite(u) + sp for u in neu)
        z[-1].append(t); cx += w + sp
    return z


def bewerte(m, maxw):
    z = zeilen(m, maxw)
    txt = [" ".join(("___" + (t[2] if t[2] else "")) if t[0] == "gap" else t[1] for t in zl) for zl in z]
    bf = []
    if len(z) >= 3: bf.append("DREI ZEILEN")
    if len(z) >= 2:
        l = z[-1]; luecke = any(t[0] == "gap" for t in l); w = sum(1 for t in l if t[0] == "t")
        if luecke and w <= 2: bf.append("RUTSCHT")
        if not luecke and len(l) == 1 and len(l[0][1]) <= 8: bf.append("REST")
    return bf, txt


if __name__ == "__main__":
    ids = sys.argv[2:] or sorted(f[:-5] for f in os.listdir("einheiten") if f.endswith(".json"))
    n = 0
    for eid in ids:
        p = os.path.join("einheiten", eid + ".json")
        if not os.path.exists(p): continue
        try: s = json.load(open(p, encoding="utf-8"))["seite"]
        except (KeyError, ValueError): continue
        orte = [("merksatz[%d]" % i, m, B_MERK) for i, m in enumerate((s.get("merksatz") or [])[:2])]
        for k, a in enumerate(s.get("aufgaben") or []):
            for i, m in enumerate(a.get("luecken") or []):
                orte.append(("aufgaben[%d].luecken[%d]" % (k, i), m, B_LESE))
        for ort, m, w in orte:
            if not isinstance(m, dict) or "pre" not in m: continue
            bf, t = bewerte(m, w)
            if bf:
                n += 1; print("  %s %s: %s | %s" % (eid, ort, "/".join(bf), " // ".join(t)))
    print("BEFUNDE GESAMT: %d" % n)
