# -*- coding: utf-8 -*-
"""Prueft die zwei Groessen-Aufgaben der Foerderhefte (neuer Aufbau, 06.10.2026).

    python3 simcheck/foerder_groessen_pruefen.py <band> [<id> ...]

Abdullah: „platz zu physikalischen Größen machen, und Abkürzungen in Physik,
Schüler bringen das leider durcheinander“. Zwei Felder je Einheit:

  "groessen": {"zeilen": [["Masse","m","Kilogramm","kg"], ["Gewichtskraft","F","Newton","N"]]}
      Groesse | Formelzeichen | Einheit | Einheitenzeichen. Zeile 1 steht als
      Beispiel da, in den anderen nur der Name der Groesse.
  "zeichen": {"zeilen": [{"text": "[m] = 2 kg", "loesung": "Formelzeichen"}, ...]}
      Der Buchstabe in [ ] wird fett gedruckt; Zeile 1 ist angekreuzt (Beispiel).

Der gedruckte Tipp lautet „Direkt hinter einer Zahl steht immer eine Einheit.“
Jede Zeile wird GEGEN DIESEN TIPP gerechnet: steht vor dem Buchstaben eine Zahl
(hoechstens ein Leerzeichen dazwischen), muss die Loesung „Einheit“ sein, sonst
„Formelzeichen“. Ein Beispiel, das dem Tipp widerspricht, waere schlimmer als
keines.
"""
import json, os, re, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, "arbeitsheft", "fonts", "SourceSans3-Regular.ttf")
LABELS = ("Formelzeichen", "Einheit")


def _cmap():
    from fontTools.ttLib import TTFont
    return set(TTFont(FONT)["cmap"].getBestCmap())


def _texte(x):
    if isinstance(x, str):
        yield x
    elif isinstance(x, dict):
        for v in x.values():
            yield from _texte(v)
    elif isinstance(x, (list, tuple)):
        for v in x:
            yield from _texte(v)


def erwartet(text):
    """Was der Tipp fuer diese Zeile sagt."""
    vor = text[:text.index("[")]
    return "Einheit" if re.search(r"\d[   ]?$", vor) else "Formelzeichen"


def pruefe(seite, cmap=None):
    """Gibt (befunde, hinweise) zurueck. Befunde muessen weg, Hinweise ansehen."""
    bef, hin = [], []
    # Beispielkasten und Hilfen werden im neuen Aufbau nicht gedruckt - was nur
    # dort steht, findet das Kind nicht (Hinweis des Agenten fn, 06.10.2026).
    seitentext = " ".join(t for k, v in seite.items()
                          if k not in ("groessen", "zeichen", "bildauftrag", "beispiel", "hilfen",
                                       "sim_plan") for t in _texte(v))
    gr = seite.get("groessen")
    if gr:
        zl = gr.get("zeilen") or []
        if not 2 <= len(zl) <= 4:
            bef.append("Groessen-Tabelle braucht 2 bis 4 Zeilen, hat %d" % len(zl))
        namen = set()
        for i, z in enumerate(zl):
            if not (isinstance(z, list) and len(z) == 4 and all(isinstance(c, str) and c.strip() for c in z)):
                bef.append("Groessen-Zeile %d braucht genau 4 gefuellte Zellen: %r" % (i + 1, z)); continue
            g, fz, e, ez = z
            if g in namen: bef.append("Groesse doppelt: %s" % g)
            namen.add(g)
            if len(fz) > 3: bef.append("Formelzeichen zu lang (%s): %s" % (g, fz))
            if len(ez) > 6: bef.append("Einheitenzeichen zu lang (%s): %s" % (g, ez))
            if fz == ez: hin.append("Formelzeichen und Einheitenzeichen gleich (%s: %s) - Absicht?" % (g, fz))
            if g.lower() not in seitentext.lower():
                hin.append("Groesse „%s“ steht nirgends sonst auf der Seite" % g)
            if e.lower() not in seitentext.lower() and not re.search(r"\d[   ]?%s\b" % re.escape(ez), seitentext):
                hin.append("Einheit „%s“ / „%s“ steht nirgends sonst auf der Seite" % (e, ez))
    zs = seite.get("zeichen")
    if zs:
        zl = zs.get("zeilen") or []
        if not 3 <= len(zl) <= 5:
            bef.append("Formelzeichen-Aufgabe braucht 3 bis 5 Zeilen, hat %d" % len(zl))
        lsg = []
        for i, z in enumerate(zl):
            t = z.get("text", "")
            if t.count("[") != 1 or t.count("]") != 1 or t.index("[") > t.index("]"):
                bef.append("Zeile %d: genau ein [Buchstabe] noetig: %s" % (i + 1, t)); continue
            m = t[t.index("[") + 1:t.index("]")]
            if not 1 <= len(m) <= 3:
                bef.append("Zeile %d: in [ ] gehoert ein Zeichen (1-3 Buchstaben): %s" % (i + 1, t))
            l = z.get("loesung")
            if l not in LABELS:
                bef.append("Zeile %d: loesung muss %s oder %s sein: %r" % (i + 1, LABELS[0], LABELS[1], l)); continue
            if erwartet(t) != l:
                bef.append("Zeile %d widerspricht dem Tipp: „%s“ -> laut Tipp %s, eingetragen %s"
                           % (i + 1, t, erwartet(t), l))
            nach = t[t.index("]") + 1:]
            if nach[:1].isalpha():
                bef.append("Zeile %d: [ ] trennt ein Wort: %s" % (i + 1, t))
            lsg.append(l)
        if lsg and len(set(lsg)) < 2:
            bef.append("Formelzeichen-Aufgabe braucht beide Antworten (nur %s)" % lsg[0])
        if len(lsg) >= 3 and len(set(lsg[1:])) < 2:
            hin.append("Nach dem Beispiel steht nur noch eine Antwortart - ankreuzen ohne Nachdenken")
    if cmap is not None:
        for t in _texte({"g": gr, "z": zs}):
            fehlt = sorted({c for c in t if ord(c) not in cmap and c not in "[]"})
            if fehlt: bef.append("Zeichen fehlt in der Schrift: %s in %r" % ("".join(fehlt), t))
    return bef, hin


def selbsttest():
    gut = {"groessen": {"zeilen": [["Masse", "m", "Kilogramm", "kg"], ["Gewichtskraft", "F", "Newton", "N"]]},
           "zeichen": {"zeilen": [{"text": "[m] = 2 kg", "loesung": "Formelzeichen"},
                                  {"text": "Das Klavier ist 1,5 [m] breit.", "loesung": "Einheit"},
                                  {"text": "Drücke „100 [g]“.", "loesung": "Einheit"},
                                  {"text": "F = m · [g]", "loesung": "Formelzeichen"}]},
           "merksatz": "Masse Kilogramm Gewichtskraft Newton"}
    b, _ = pruefe(gut)
    assert not b, b
    kaputt = [
        ({"zeichen": {"zeilen": [{"text": "2 [m]", "loesung": "Formelzeichen"},
                                 {"text": "[m] = 2", "loesung": "Formelzeichen"},
                                 {"text": "4 [s]", "loesung": "Einheit"}]}}, "widerspricht"),
        ({"zeichen": {"zeilen": [{"text": "[m] = 2", "loesung": "Formelzeichen"},
                                 {"text": "[F] = 2", "loesung": "Formelzeichen"},
                                 {"text": "[g] = 9,8", "loesung": "Formelzeichen"}]}}, "beide Antworten"),
        ({"zeichen": {"zeilen": [{"text": "Wa[ss]er", "loesung": "Formelzeichen"},
                                 {"text": "2 [m]", "loesung": "Einheit"},
                                 {"text": "[F] = 2 N", "loesung": "Formelzeichen"}]}}, "trennt ein Wort"),
        ({"groessen": {"zeilen": [["Masse", "m", "Kilogramm", "kg"]]}}, "2 bis 4"),
        ({"groessen": {"zeilen": [["Masse", "m", "Kilogramm", "kg"], ["Kraft", "", "Newton", "N"]]}}, "4 gefuellte"),
    ]
    for probe, muster in kaputt:
        b, _ = pruefe(probe)
        assert any(muster in x for x in b), (muster, b)
    return 1, len(kaputt)


if __name__ == "__main__":
    g, k = selbsttest()
    print("Selbsttest bestanden (%d gute + %d kaputte Proben)." % (g, k))
    band = sys.argv[1]
    ids = sys.argv[2:] or sorted(f[:-5] for f in os.listdir(os.path.join(ROOT, band, "einheiten"))
                                 if f.endswith(".json"))
    cmap = _cmap()
    n_bef = 0; ohne = []
    for eid in ids:
        p = os.path.join(ROOT, band, "einheiten", eid + ".json")
        if not os.path.exists(p): continue
        s = json.load(open(p, encoding="utf-8"))["seite"]
        if not s.get("groessen") and not s.get("zeichen"):
            ohne.append(eid); continue
        b, h = pruefe(s, cmap)
        for x in b: print("  ✗ %s: %s" % (eid, x))
        for x in h: print("  ? %s: %s" % (eid, x))
        n_bef += len(b)
    if ohne: print("ohne Groessen-Aufgaben: %s" % ", ".join(ohne))
    print("BEFUNDE GESAMT: %d" % n_bef)
    sys.exit(1 if n_bef else 0)
