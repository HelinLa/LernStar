# -*- coding: utf-8 -*-
"""Sagt jeder Arbeitsschritt, WO notiert wird? Steht in jeder Rechnung die Einheit?

    python3 simcheck/auftraege_pruefen.py <band> [<id> ...]

Abdullah, 08.10.2026, aus dem Unterricht: Bei „Lies … ab. Trage alles ein.“
wussten die Schueler nicht, wo sie notieren sollen („die Arbeitsaufträge müssen
klar und deutlich sein“); und „1 · 9,8“ statt „1 kg · 9,8 N/kg“ – „in Physik ist
es sehr wichtig, dass die Einheiten immer in der Rechnung mit drin sind“.

Geprueft werden Foerderbaende (einheiten/<id>.json) und Regelbaende
(content/forscherseiten.json, uebungen.json, transfer.json, assessment.json):

  SCHRITT   ein Schreibauftrag („Trage“, „Notiere“, „Fülle … aus“, „Ergänze“) ohne
            Ort („Zeile …“ oder „Tabelle“) - Befund
  ZEILEN    eine Einheit mit Tabelle, deren Schritte keine einzige Tabellenzeile
            nennen - Befund
  RECHNUNG  eine Rechnung, deren Ergebnis eine Einheit traegt, deren Zahlen aber
            keine („1 · 9,8 = 9,8 N“) - Befund. Reine Anzahlen duerfen ohne
            Einheit stehen, solange EINE Zahl der Rechnung ihre Einheit traegt
            („2 · 1,5 V = 3 V“).
Ausgenommen sind Felder, die nirgends gedruckt werden (bildauftrag, sim_plan,
beispiel und hilfen im Foerder-Aufbau 2) - sie stehen als Hinweis „?“ da.
Ohne bestandenen Selbsttest rechnet das Werkzeug nicht.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZAHL = r"\d+(?:[.,]\d+)?"
EINH = r"(?:\s*(?:[A-Za-zΩµ°%][A-Za-zΩµ°%²³]*(?:/[A-Za-zΩµ°%²³]+)?|\([^()]{1,12}\)²?))?"
OP = r"\s*[·×*:÷+−–]\s*"
# Zahl[Einheit] (op Zahl[Einheit])+ = Zahl Einheit
RECHNUNG = re.compile(r"(?<![\w,.])(%s)(%s)((?:%s(?:\(?%s\)?)(?:%s)?)+)\s*=\s*(%s)\s*([A-Za-zΩµ°%%][A-Za-zΩµ°%%²³/]*)"
                      % (ZAHL, EINH, OP, ZAHL, EINH, ZAHL))
SCHREIB = re.compile(r"\b(Trage|trage|Notiere|notiere|Fülle|fülle|füll|Ergänze|ergänze|Schreibe|schreibe)\b")
ORT = re.compile(r"Zeile|Tabelle|Tabellenzeile")
OHNE_DRUCK = {"bildauftrag", "sim_plan", "beispiel", "hilfen", "analyse"}


def rechnung_ohne_einheit(text):
    """Liste der Rechnungen in `text`, deren Zahlen alle ohne Einheit stehen."""
    raus = []
    for m in RECHNUNG.finditer(text):
        teil = m.group(0)
        # Division mit Rest („23 : 4 = 5 Rest 3“, Renderer „216 R 1“) ist die
        # Schulbuch-Schreibweise, keine Einheit: „Rest“ steht nur dort, wo sonst
        # die Einheit stuende. Ausgenommen nur MIT der Restzahl dahinter (Mathe
        # Kapitel 4, 08.10.2026 - vorher 20 Fehlalarme in mm5/mm6).
        if m.group(5) in ("Rest", "R") and re.match(r"\s*\d", text[m.end():]):
            continue
        links = teil.split("=")[0]
        zahlen = re.findall(r"(%s)(\s*[A-Za-zΩµ°%%(][^·×*:÷+−–=]*)?" % ZAHL, links)
        hat = any((e or "").strip() for _, e in zahlen)
        if not hat:
            raus.append(teil.strip())
    return raus


def schritt_ohne_ort(text):
    return bool(SCHREIB.search(text)) and not ORT.search(text)


def selbsttest():
    gut_r = ["1 kg · 9,8 N/kg = 9,8 N", "2 · 1,5 V = 3 V", "1962 J : 10 s = 196 W",
             "½ · 4 kg · (4 m/s)² = 32 J", "10 Ω + 20 Ω = 30 Ω", "R = U/I = 20 Ω",
             # Division mit Rest: keine Einheit, kein Befund
             "23 : 4 = 5 Rest 3", "864 : 4 = 216 R 1"]
    schlecht_r = ["1 · 9,8 = 9,8 N", "4 + 3 = 7 N", "1962 : 10 = 196 W", "10 + 20 = 30 Ω",
                  # Gegenprobe: die Ausnahme greift nur MIT Restzahl dahinter
                  "12 : 4 = 3 Rest"]
    for t in gut_r:
        assert not rechnung_ohne_einheit(t), ("gute Rechnung gemeldet", t)
    for t in schlecht_r:
        assert rechnung_ohne_einheit(t), ("kaputte Rechnung NICHT gemeldet", t)
    assert schritt_ohne_ort("Lies Masse und Gewichtskraft ab. Trage alles ein.")
    assert schritt_ohne_ort("Drücke „mittel“ und fülle die letzte Spalte aus.")
    assert not schritt_ohne_ort("Notiere F in Zeile 1 der Tabelle.")
    assert not schritt_ohne_ort("Drücke „1 kg“. Lies F ab.")
    return len(gut_r) + 2, len(schlecht_r) + 2


def _texte(x, pfad=""):
    if isinstance(x, str):
        yield pfad, x
    elif isinstance(x, dict):
        for k, v in x.items():
            yield from _texte(v, pfad + "." + k)
    elif isinstance(x, list):
        for i, v in enumerate(x):
            yield from _texte(v, pfad + "[%d]" % i)


def einheiten(band):
    """[(id, seite_dict, lehrer_dict, weitere_texte)] fuer Foerder- und Regelbaende."""
    d = os.path.join(ROOT, band)
    raus = []
    if os.path.isdir(os.path.join(d, "einheiten")):
        for f in sorted(os.listdir(os.path.join(d, "einheiten"))):
            if f.endswith(".json"):
                e = json.load(open(os.path.join(d, "einheiten", f), encoding="utf-8"))
                raus.append((f[:-5], e.get("seite", {}), e.get("lehrer", {}), {}))
        return raus
    c = os.path.join(d, "content")
    fs = json.load(open(os.path.join(c, "forscherseiten.json"), encoding="utf-8"))
    ub = {x["id"]: x for x in json.load(open(os.path.join(c, "uebungen.json"), encoding="utf-8"))} \
        if os.path.exists(os.path.join(c, "uebungen.json")) else {}
    for x in fs:
        raus.append((x["id"], x, {}, {"uebungen": ub.get(x["id"], {})}))
    for extra in ("transfer.json", "assessment.json"):
        p = os.path.join(c, extra)
        if os.path.exists(p):
            raus.append(("(" + extra + ")", {}, {}, {extra: json.load(open(p, encoding="utf-8"))}))
    return raus


def pruefe_band(band, ids=()):
    bef, hin = [], []
    for eid, s, l, weitere in einheiten(band):
        if ids and eid not in ids:
            continue
        steps = s.get("forschen") or []
        for i, t in enumerate(steps):
            if schritt_ohne_ort(t):
                bef.append((eid, "SCHRITT", "Schritt %s sagt nicht, wo notiert wird: %s" % ("abcdefgh"[i], t)))
        if s.get("tabRows") and steps and not any(re.search(r"Zeile", t) for t in steps):
            bef.append((eid, "ZEILEN", "keiner der %d Schritte nennt eine Tabellenzeile" % len(steps)))
        for quelle, obj in (("seite", s), ("lehrer", l)) + tuple(weitere.items()):
            for pfad, t in _texte(obj):
                for r in rechnung_ohne_einheit(t):
                    feld = pfad.split(".")[1].split("[")[0] if "." in pfad else pfad
                    ziel = hin if feld in OHNE_DRUCK else bef
                    ziel.append((eid, "RECHNUNG", "%s%s: „%s“" % (quelle, pfad, r)))
    return bef, hin


if __name__ == "__main__":
    g, k = selbsttest()
    print("Selbsttest bestanden (%d gute + %d kaputte Proben)." % (g, k))
    band = sys.argv[1]
    bef, hin = pruefe_band(band, set(sys.argv[2:]))
    for eid, art, t in bef:
        print("  ✗ %-6s %-8s %s" % (eid, art, t))
    for eid, art, t in hin:
        print("  ? %-6s %-8s %s (wird nicht gedruckt)" % (eid, art, t))
    print("BEFUNDE GESAMT: %d" % len(bef))
    sys.exit(1 if bef else 0)
