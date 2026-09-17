# -*- coding: utf-8 -*-
"""Spielt umgeschriebene Forscherseiten ein und erzeugt js/forschermodus-regeln.js.

    python3 simcheck/forschermodus_bauen.py <ergebnis.json> [--schreiben]

`ergebnis.json` ist das Ergebnis des Workflows „forschermodus-seiten-bauen":
eine Liste von {band, id, ok, seite:{…}, regeln:{sim, weg, maske, hinweis, bedienung}}.

Ohne --schreiben wird nur geprueft und angezeigt. Mit --schreiben werden
- die Felder der Seite in <band>/content/forscherseiten.json eingetragen
  (Sicherung <datei>.vor_forschen, einmal je Band) und
- js/forschermodus-regeln.js neu erzeugt (Seiten + Regeln + Bedienung fuer die
  Pruefer). Die Datei ist ERZEUGT; von Hand wird sie nie geaendert.

Geprueft wird VOR dem Schreiben:
- Formregeln des Bandes (arbeitsheft/formregeln.py),
- 3-4 Tabellenzeilen, 2-4 Spalten,
- keine Zeichen, die die Heftschrift nicht hat,
- kein Feld laenger als bisher (sonst verschieben sich Seitenzahlen).
"""
import html
import importlib.util as ilu
import io, json, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LS = os.path.dirname(HERE)
SCHREIBEN = "--schreiben" in sys.argv

_sp = ilu.spec_from_file_location("formregeln", os.path.join(LS, "arbeitsheft", "formregeln.py"))
formregeln = ilu.module_from_spec(_sp); _sp.loader.exec_module(formregeln)

KLASSE = {
    "arbeitsheft": 5, "arbeitsheft7": 7, "arbeitsheft8": 8, "arbeitsheft9": 9, "arbeitsheft10": 10,
    "arbeitsheft_gts7": 7, "arbeitsheft_gts8": 8, "arbeitsheft_gts9": 9, "arbeitsheft_gts10": 10,
    "arbeitsheft_gym56": 5, "arbeitsheft_gym7": 7, "arbeitsheft_gym8": 8, "arbeitsheft_gym9": 9,
    "arbeitsheft_gym10": 10, "arbeitsheft_ef": 11,
}

# Zeichen, die SourceSans3 im Heft nicht hat (aus pruefe_profil.py/Erfahrung).
VERBOTEN = re.compile("[\U0001F000-\U0001FAFF←-⇿①-⓿⬀-⯿＋]")
FELDER = ["auftrag", "predict", "predictOk", "forschen", "tabCols", "tabRows", "beobachtung"]


def laenge(x):
    return len(json.dumps(x, ensure_ascii=False))


def tabellenhoehe(cols, rows):
    """Wie hoch wird die Beobachtungstabelle GESETZT?

    Zeichen zaehlen genuegt hier nicht: Vier Spalten haben mehr Zeichen, aber drei
    Zeilen statt vier machen den Block KLEINER. Gemessen wird deshalb mit
    demselben Setzer wie im Heft (felo_design.tabelle)."""
    fd = _felo()
    n_sp = max(2, min(4, len(cols)))
    zeilen = [[r] + [""] * (n_sp - 1) for r in rows]
    anteile = {2: [0.5, 0.5], 3: [0.34, 0.33, 0.33], 4: [0.28, 0.24, 0.24, 0.24]}[n_sp]
    h = fd.messe_bausteine([_bst(lambda hh, d, y: fd.tabelle(hh, d, y, fd.STIL, cols, zeilen,
                                                            anteile, fd.einheiten(fd.TAB_ZEILE_SCHREIB)))],
                           fd.STIL)
    return h[0]


_FD = None


def _felo():
    global _FD
    if _FD is None:
        sp = ilu.spec_from_file_location("felo_design", os.path.join(LS, "arbeitsheft", "felo_design.py"))
        m = ilu.module_from_spec(sp); sp.loader.exec_module(m)
        _FD = m
    return _FD


class _bst:
    """Minimaler Baustein, wie ihn felo_design.messe_bausteine erwartet."""
    def __init__(self, f, name="Tabelle", abstand=0, haftet=0):
        self.f, self.name, self.abstand, self.haftet = f, name, abstand, haftet


def pruefe_eintrag(band, alt, neu):
    """Gibt eine Liste von Befunden zurueck - leer heisst: einbaubar."""
    f = []
    zusammen = dict(alt)
    for k in FELDER:
        if k in neu:
            zusammen[k] = neu[k]
    for b in formregeln.pruefe_seite(zusammen, klasse=KLASSE[band]):
        if b not in formregeln.pruefe_seite(alt, klasse=KLASSE[band]):
            f.append("Formregel: %s – %s" % (b[1], b[2]))
    n_z, n_s = len(zusammen.get("tabRows", [])), len(zusammen.get("tabCols", []))
    if not (3 <= n_z <= 4):
        f.append("Tabelle hat %d Zeilen (erlaubt 3–4)" % n_z)
    if not (2 <= n_s <= 4):
        f.append("Tabelle hat %d Spalten (erlaubt 2–4)" % n_s)
    for k in FELDER:
        if k not in neu:
            continue
        t = json.dumps(neu[k], ensure_ascii=False)
        schlimm = sorted(set(VERBOTEN.findall(t)))
        if schlimm:
            f.append("%s: Zeichen ohne Glyphe im Heft: %s" % (k, " ".join(schlimm)))
        if k in ("tabCols", "tabRows"):
            continue     # wird unten als gesetzter Block gemessen
        if k != "predictOk" and laenge(neu[k]) > laenge(alt.get(k, "")):
            f.append("%s ist laenger als bisher (%d statt %d Zeichen) – das verschiebt Seitenzahlen"
                     % (k, laenge(neu[k]), laenge(alt.get(k, ""))))
    if "tabCols" in neu or "tabRows" in neu:
        h_alt = tabellenhoehe(alt["tabCols"], alt["tabRows"])
        h_neu = tabellenhoehe(zusammen["tabCols"], zusammen["tabRows"])
        # Nicht nur hoeher ist gefaehrlich, auch kleiner: Die erste umgebaute
        # Seite (kf4) sparte eine Tabellenzeile - dadurch passte die Einheit auf
        # eine Seite weniger, und 23 Seitenzahlen des Bandes rutschten. Die
        # Tabelle muss also ungefaehr gleich hoch bleiben.
        if abs(h_neu - h_alt) > 20:
            f.append("Tabelle wird anders hoch gesetzt (%.0f statt %.0f Einheiten) – das verschiebt Seitenzahlen"
                     % (h_neu, h_alt))
    return f


def entschaerfe(x):
    """&gt; und &lt; kommen aus der Werkzeugkette zurueck - zurueckwandeln.

    Ohne das steht in einer Regel ".mgw-sim &gt; .sim-hint" statt
    ".mgw-sim > .sim-hint", und sie greift nie."""
    if isinstance(x, str):
        return html.unescape(x)
    if isinstance(x, list):
        return [entschaerfe(v) for v in x]
    if isinstance(x, dict):
        return {k: entschaerfe(v) for k, v in x.items()}
    return x


def js_regex(re_text, flags):
    """Regex als JavaScript-Literal, ohne den Begrenzer zu zerbrechen.

    Nur NOCH NICHT maskierte Schraegstriche bekommen einen Rueckstrich - sonst
    wird aus dem schon maskierten "m\\/s²" ein doppelt maskiertes, und die Datei
    laesst sich nicht mehr laden."""
    return "/" + re.sub(r"(?<!\\)/", r"\\/", re_text) + "/" + (flags or "")


def erzeuge_regeldatei(seiten, regeln, bedienung, pfad):
    zeilen = [
        "// ============================================================================",
        "//  forschermodus-regeln.js  –  ERZEUGT, NICHT VON HAND AENDERN",
        "//  Quelle: die umgeschriebenen Forscherseiten; erzeugt von",
        "//  simcheck/forschermodus_bauen.py",
        "//",
        "//  SEITEN: welche HEFTSEITE ihre Simulation im Forschermodus oeffnet.",
        "//  REGELN: was je Simulation verdeckt (weg) oder ersetzt (maske) wird.",
        "//  BEDIENUNG: womit ein Pruefer die Simulation in den Zustand bringt, in",
        "//  dem die Masken greifen (nur fuer simcheck, nicht fuer die App).",
        "// ============================================================================",
        "'use strict';",
        "",
        "const FELO_FORSCHEN_SEITEN = {",
    ]
    for sid in sorted(seiten):
        zeilen.append("  %s: %s," % (sid, json.dumps(seiten[sid], ensure_ascii=False)))
    zeilen += ["};", "", "const FELO_FORSCHEN_REGELN = {"]
    for sim in sorted(regeln):
        r = regeln[sim]
        zeilen.append("  %s: {" % json.dumps(sim, ensure_ascii=False))
        zeilen.append("    weg: %s," % json.dumps(r.get("weg", []), ensure_ascii=False))
        zeilen.append("    maske: [")
        for m in r.get("maske", []):
            zeilen.append("      { sel: %s, re: %s, mit: %s }," % (
                json.dumps(m["sel"], ensure_ascii=False),
                js_regex(m["re"], m.get("flags", "")),
                json.dumps(m["mit"], ensure_ascii=False)))
        zeilen.append("    ],")
        zeilen.append("    hinweis: %s," % json.dumps(r.get("hinweis", ""), ensure_ascii=False))
        zeilen.append("  },")
    zeilen += ["};", "", "const FELO_FORSCHEN_BEDIENUNG = %s;" % json.dumps(bedienung, ensure_ascii=False, indent=1), ""]
    with io.open(pfad, "w", encoding="utf-8") as fh:
        fh.write("\n".join(zeilen))


def main():
    quelle = json.load(io.open(sys.argv[1], encoding="utf-8"))
    eintraege = quelle if isinstance(quelle, list) else quelle["seiten"]

    # Bestehende Seiten, Regeln und Bedienung stehen in der QUELLE - einer
    # gewoehnlichen JSON-Datei. Die erzeugte .js-Datei wird daraus geschrieben.
    # (Beim ersten Anlauf hat das Werkzeug die Regeln aus der .js-Datei geraten
    # und dabei den Piloten ueberschrieben. Eine Quelle, die man liest, statt zu
    # raten, kann das nicht.)
    quelle_pfad = os.path.join(LS, "js", "forschermodus-regeln.quelle.json")
    alt_pfad = os.path.join(LS, "js", "forschermodus-regeln.js")
    stand = {"seiten": {}, "regeln": {}, "bedienung": {}}
    if os.path.exists(quelle_pfad):
        stand = json.load(io.open(quelle_pfad, encoding="utf-8"))
    seiten, regeln, bedienung = stand["seiten"], stand["regeln"], stand["bedienung"]

    gut, schlecht = [], []
    for e in eintraege:
        if not e.get("ok", True):
            schlecht.append((e["id"], ["vom Agenten zurueckgezogen: " + e.get("warum_nicht", "")[:120]]))
            continue
        band = e["band"]
        p = os.path.join(LS, band, "content", "forscherseiten.json")
        daten = json.loads(io.open(p, encoding="utf-8").read())
        liste = daten if isinstance(daten, list) else daten["seiten"]
        alt = [x for x in liste if x["id"] == e["id"]][0]
        f = pruefe_eintrag(band, alt, e["seite"])
        (gut if not f else schlecht).append((e["id"], f) if f else (e["id"], e))

    for sid, f in schlecht:
        print("✗ %-6s %s" % (sid, " · ".join(f)))
    print("%d von %d Seiten einbaubar" % (len(gut), len(eintraege)))

    if not SCHREIBEN:
        return 0 if not schlecht else 1

    proBand = {}
    for sid, e in gut:
        proBand.setdefault(e["band"], []).append(e)
    for band, es in proBand.items():
        p = os.path.join(LS, band, "content", "forscherseiten.json")
        roh = io.open(p, encoding="utf-8").read()
        daten = json.loads(roh)
        liste = daten if isinstance(daten, list) else daten["seiten"]
        for e in es:
            x = [y for y in liste if y["id"] == e["id"]][0]
            for k in FELDER:
                if k in e["seite"]:
                    x[k] = e["seite"][k]
            r = entschaerfe(e["regeln"])
            seiten[e["id"]] = r["sim"]
            eintrag = regeln.setdefault(r["sim"], {"weg": [], "maske": [], "hinweis": r.get("hinweis", "")})
            for w in r.get("weg", []):
                if w not in eintrag["weg"]:
                    eintrag["weg"].append(w)
            for m in r.get("maske", []):
                if m not in eintrag["maske"]:
                    eintrag["maske"].append(m)
            if r.get("bedienung"):
                bedienung[r["sim"]] = r["bedienung"]
        sich = p + ".vor_forschen"
        if not os.path.exists(sich):
            io.open(sich, "w", encoding="utf-8").write(roh)
        with io.open(p, "w", encoding="utf-8") as fh:
            json.dump(daten, fh, ensure_ascii=False, indent=1)
            if roh.endswith("\n"):
                fh.write("\n")
        print("geschrieben: %s (%d Seiten)" % (p, len(es)))

    with io.open(quelle_pfad, "w", encoding="utf-8") as fh:
        json.dump({"seiten": seiten, "regeln": regeln, "bedienung": bedienung}, fh,
                  ensure_ascii=False, indent=1)
    erzeuge_regeldatei(seiten, regeln, bedienung, alt_pfad)
    print("erzeugt: js/forschermodus-regeln.js – %d Seiten, %d Simulationen" % (len(seiten), len(regeln)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
