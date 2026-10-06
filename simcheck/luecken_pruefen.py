# -*- coding: utf-8 -*-
"""Lueckensaetze der Regelhefte fuer die Handschrift pruefen (06.10.2026).

    python3 simcheck/luecken_pruefen.py <band> [--json]

Abdullah: „Wenn eine Lücke nicht mehr in die Zeile passt, gestalte den Satz neu.
Vermeide, dass nur die Lücke mit der Einheit auf die nächste Zeile rutscht …
Formuliere die Lückensätze kurz und übersichtlich.“ Gesetzt wird mit
felo_design._hand_zeilen (Lueckenbreite nach der Antwort, letzte Wort + Luecke +
erstes Wort danach als Gruppe). Gemeldet wird je Satz:
  DREI ZEILEN   der Satz braucht 3 oder mehr Zeilen
  RUTSCHT       die Luecke steht in der letzten Zeile fast allein (Gruppe + hoechstens 1 Wort)
  REST          ein einzelnes kurzes Wort steht allein in der letzten Zeile
Geprueft: Merksatz im Kasten „Das musst du mitnehmen“ (Breite 769), die
Lueckensaetze der Uebungsseite und des Kapiteltests (Breite 830).
"""
import json, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "arbeitsheft"))
import felo_design as fd
from build_final import newp, hp

_im, _d = newp(fd.GRUND); H = hp(_im, _d)
F = fd.schrift("reg", fd.MERK)
B_MERK = (fd.KASTEN_X1 - fd.KASTEN_X0) - 61
B_LESE = fd.KASTEN_X1 - fd.KASTEN_X0


def bewerte(m, breite):
    z = fd._hand_zeilen(H, m, F, breite)
    text = [" ".join(("___" if a == "gap" else v) for g in zl for a, v in g) for zl in z]
    befund = []
    if len(z) >= 3: befund.append("DREI ZEILEN")
    if len(z) >= 2:
        letzte = z[-1]
        hat_luecke = any(a == "gap" for g in letzte for a, _ in g)
        woerter = sum(1 for g in letzte for a, _ in g if a == "t")
        if hat_luecke and len(letzte) <= 2 and woerter <= 3: befund.append("RUTSCHT")
        # Ein einzelnes kurzes Wort allein in der letzten Zeile („(Ω).“) - sieht
        # abgerissen aus (Sichtpruefung 06.10.2026).
        if not hat_luecke and len(letzte) == 1 and woerter == 1 and len(letzte[0][0][1]) <= 8:
            befund.append("REST")
    return befund, text


def _liste(p):
    d = json.load(open(p, encoding="utf-8"))
    return d if isinstance(d, list) else d.get("seiten", list(d.values()))


def band_pruefen(band):
    b = os.path.join(ROOT, band); erg = []
    for e in _liste(os.path.join(b, "content", "forscherseiten.json")):
        for i, m in enumerate((e.get("merksatz") or [])[:2]):
            bf, t = bewerte(m, B_MERK)
            if bf: erg.append({"id": e["id"], "ort": "merksatz[%d]" % i, "befund": bf, "zeilen": t})
    for u in _liste(os.path.join(b, "content", "uebungen.json")):
        for i, m in enumerate(u.get("lueckensaetze") or []):
            bf, t = bewerte(m, B_LESE)
            if bf: erg.append({"id": u["id"], "ort": "lueckensaetze[%d]" % i, "befund": bf, "zeilen": t})
    ap = os.path.join(b, "content", "assessment.json")
    if os.path.exists(ap):
        a = json.load(open(ap, encoding="utf-8"))
        tests = a if isinstance(a, list) else list(a.values())
        for t_ in tests:
            if not isinstance(t_, dict): continue
            # Der Kapiteltest liegt unter t["test"]["a1"] (Hinweis der Agenten, 06.10.2026:
            # vorher wurde er nie gelesen und der Pruefer meldete gruen).
            a1 = t_.get("a1") or (t_.get("test") or {}).get("a1") or []
            for i, m in enumerate(a1):
                if not isinstance(m, dict) or "pre" not in m: continue
                bf, t = bewerte(m, B_LESE)
                if bf: erg.append({"id": t_.get("id", "test"), "ort": "test.a1[%d]" % i, "befund": bf, "zeilen": t})
    return erg


if __name__ == "__main__":
    erg = band_pruefen(sys.argv[1])
    if "--json" in sys.argv:
        print(json.dumps(erg, ensure_ascii=False, indent=1))
    else:
        for x in erg:
            print("  %s %s: %s | %s" % (x["id"], x["ort"], "/".join(x["befund"]), " // ".join(x["zeilen"])))
        print("BEFUNDE GESAMT: %d" % len(erg))
