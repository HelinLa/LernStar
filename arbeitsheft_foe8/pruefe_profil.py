# -*- coding: utf-8 -*-
"""Formprüfer des Förderprofils (FOERDER_PROFIL.md) + Rendervertrag.

Nach der Hausregel darf kein Prüfer urteilen, bevor er seinen Selbsttest
bestanden hat: Der Lauf beginnt mit einer bekannt guten Einheit (muss ohne
Befund durchgehen) und einer Reihe absichtlich kaputter Einheiten (jede muss
genau ihren Fehler auslösen). Erst danach werden die echten Einheiten geprüft.

Aufruf: python3 pruefe_profil.py            → Selbsttest + alle Einheiten
        python3 pruefe_profil.py fo3 fw8    → Selbsttest + nur diese
"""
import collections
import json, os, re, sys, copy

# Bekannt gute Einheit fuer den Selbsttest. Sie kommt aus Band 7 (fo10, die
# freigegebene Pilotseite) - so kann der Pruefer auch dann schon urteilen, wenn
# in diesem Band noch keine einzige Einheit fertig ist.


HERE = os.path.dirname(os.path.abspath(__file__))
# Kapitel und ihre Kennungen kommen aus plan.py - sonst misst der Pruefer im
# naechsten Band die Antwortpositionen von null Einheiten und meldet trotzdem
# "in Ordnung". (Genau das passierte beim Kopieren nach Band 8: "fo"/"fw" waren
# fest verdrahtet, Band 8 heisst aber "fs"/"fb".)
import importlib.util as _ilu
_s = _ilu.spec_from_file_location("plan", os.path.join(HERE, "plan.py"))
_plan = _ilu.module_from_spec(_s); _s.loader.exec_module(_plan)
KAPITEL_IDS = [(f"Kapitel {n+1}", [t["id"] for t in k["themen"]])
               for n, k in enumerate(_plan.KAPITEL)]
# Bekannt gute Einheit fuer den Selbsttest: die freigegebene Pilotseite fo10 aus
# Band 7. So kann der Pruefer auch dann urteilen, wenn dieser Band noch leer ist.
MUSTER_PFAD = os.path.join(os.path.dirname(HERE), "arbeitsheft_foe7",
                           "einheiten", "fo10.json")


# ── Druckbarkeit: hat die Schrift ueberhaupt ein Zeichen dafuer? ──────────
# Am 05.09.2026 standen in NEUN Einheiten von Band 7 und FUENF von Band 8 leere
# Kaestchen im gedruckten Heft: "Druecke „⌷ ganz klein“" statt „➊ ganz klein“.
# Die Knopfnamen der Simulationen tragen Emoji und Zierziffern, die
# SourceSans3 nicht kennt - und genau die unterscheiden die Knoepfe voneinander.
def _schriftzeichen():
    try:
        from fontTools.ttLib import TTFont
    except ImportError:
        return None                      # ohne fontTools wird nicht geprueft
    zeichen = set()
    fdir = os.path.join(os.path.dirname(HERE), "arbeitsheft", "fonts")
    for fn in ("SourceSans3-Regular.ttf", "SourceSans3-Medium.ttf", "SourceSans3-Bold.ttf"):
        p = os.path.join(fdir, fn)
        if not os.path.exists(p): continue
        f = TTFont(p)
        for t in f["cmap"].tables: zeichen |= set(t.cmap.keys())
    return zeichen or None

CMAP = _schriftzeichen()


# ── Wortgewicht: wie schwer wird die fertige Doppelseite? ────────────────
# Der Umfangskorridor (35-50 % schlanker) haengt an ZWEI Zahlen: der Zahl der
# Doppelseiten UND ihrem Gewicht. Band 7 kam auf Median 363 Woerter, Band 8 auf
# 451 (+24 %) - damit haette Band 9 bei gleicher Seitenzahl den Korridor
# verfehlt. Das Gewicht wird deshalb gemessen und ausgewiesen, nicht geschaetzt.
# BUDGET ist die Obergrenze, ab der eine Seite gemeldet wird; None = nur messen.
BUDGET = None
#
# ZULAGE FUER DIE RECHENTABELLE (17.09.2026, nach demselben Verfahren): Eine
# Einheit MIT Rechentabelle darf um deren gemessenes Gewicht schwerer sein -
# und nur darum. GEMESSEN ueber die sechs Tabellen in Band 9: 28 bis 34
# Woerter. Genommen wird das schwerste, nicht der Median: Die Zulage soll jede
# vertretbare Tabelle tragen, aber keine zweite Textspalte durchlassen.
# Die Prosa bleibt damit fuer JEDE Einheit bei 392 - auch fuer die sechs mit
# Tabelle (gemessen: 370 bis 386 ohne sie). Wer die Zulage einfach auf den Band
# schlagen wuerde, gaebe den 19 Einheiten OHNE Tabelle 34 Woerter mehr Prosa,
# ohne dass dort etwas dazugekommen waere.
BUDGET_RECHNEN = 34
_OHNE = ("bildauftrag", "id", "sim", "quelle", "theme", "sicherheit")

def wortgewicht(seite):
    n = 0
    def go(x, key=None):
        nonlocal n
        if isinstance(x, str):
            if key not in _OHNE: n += len(x.split())
        elif isinstance(x, dict):
            for k, v in x.items(): go(v, k)
        elif isinstance(x, list):
            for v in x: go(v, key)
    go(seite)
    return n

OPERATOREN = ("Wähle", "Stelle", "Lies", "Trage", "Drücke", "Vergleiche",
              "Beobachte", "Miss", "Berechne", "Kreuze", "Ordne", "Erkläre",
              "Untersuche", "Schiebe", "Wiederhole", "Ergänze", "Prüfe",
              "Gehe", "Sieh", "Sende", "Achte", "Öffne")

DEZIMALPUNKT = re.compile(r"\d\.\d{1,2}(?!\d)")   # 9.8 ist falsch, 12.756 ist Tausenderpunkt


def _texte(obj):
    """Alle Zeichenketten eines Objekts, rekursiv."""
    if isinstance(obj, str):
        yield obj
    elif isinstance(obj, dict):
        for v in obj.values(): yield from _texte(v)
    elif isinstance(obj, list):
        for v in obj: yield from _texte(v)


# ── Rechentabelle: geht die Rechnung ueberhaupt auf? ─────────────────
# Eine Zahlentabelle ist der einzige Ort im Heft, an dem ein Tippfehler NICHT
# auffaellt: "5 · 9,8 = 48 N" liest sich genau wie die richtige Zeile. Deshalb
# wird jede Zeile nachgerechnet, die vorgerechnete des Schuelerhefts wie die
# erwarteten des Lehrerteils.
_RECHNUNG = re.compile(r"\s*(-?\d+(?:,\d+)?)\s*([·×*:÷/+–−-])\s*(-?\d+(?:,\d+)?)\s*\Z")


def _zahl(text):
    """Erste Zahl in deutscher Schreibweise („19,6 N" → 19.6)."""
    m = re.search(r"-?\d+(?:,\d+)?", (text or "").replace("\u00a0", " "))
    return float(m.group(0).replace(",", ".")) if m else None


def _stellen(text):
    """Nachkommastellen, mit denen ein Wert GEDRUCKT ist („9,80 N" → 2)."""
    m = re.search(r"-?\d+(?:,(\d+))?", (text or "").replace("\u00a0", " "))
    return len(m.group(1)) if (m and m.group(1)) else 0


def _rechnet(text):
    """„2 · 9,8" → 19.6 · „1962 : 5" → 392.4 · „3 + 2" → 5. Sonst None."""
    m = _RECHNUNG.match((text or "").replace("\u00a0", " "))
    if not m:
        return None
    a = float(m.group(1).replace(",", ".")); b = float(m.group(3).replace(",", "."))
    op = m.group(2)
    if op in "·×*":  return a * b
    if op in ":÷/":  return (a / b) if b else None
    if op == "+":    return a + b
    return a - b     # –, −, -


def _operanden(text):
    """Die beiden Zahlen einer Rechnung. Leer, wenn es keine ist."""
    m = _RECHNUNG.match((text or "").replace("\u00a0", " "))
    if not m:
        return []
    return [float(m.group(1).replace(",", ".")), float(m.group(3).replace(",", "."))]


def pruefe_rechentabelle(s, l):
    """Die OPTIONALE Rechentabelle auf Seite B (Abdullah, 17.09.2026).

    Sie ist kein vierter Aufgabenblock, sondern der Drill zum geloesten
    Beispiel: Zeile 1 ist vorgerechnet und getoent, die uebrigen Zeilen geben
    nur den Startwert vor. Geprueft wird die FORM (Rendervertrag: genau drei
    Spalten) und die RECHNUNG (jede Zeile muss aufgehen).
    """
    f = []
    rt = s.get("rechnen")
    if not rt:
        if l.get("rechnen_erwartet"):
            f.append("Lehrerteil hat rechnen_erwartet, die Schülerseite aber keine Rechentabelle")
        return f

    if not rt.get("hinweis"):
        f.append("Rechentabelle braucht einen Hinweis (womit gerechnet wird)")
    sp = rt.get("spalten", [])
    if len(sp) != 3:
        f.append(f"Rechentabelle hat {len(sp)} Spalten (der Renderer setzt GENAU 3)")
    zl = [list(r) for r in rt.get("zeilen", [])]
    if not (3 <= len(zl) <= 5):
        f.append(f"Rechentabelle hat {len(zl)} Zeilen (erlaubt 3–5: 1 vorgerechnete + 2–4 offene)")
    if not zl:
        return f
    if any(len(r) != 3 for r in zl):
        f.append("Jede Zeile der Rechentabelle braucht genau 3 Zellen")
        return f

    # Zeile 1 ist die vorgerechnete - ohne sie faengt ein Foerderlernender bei
    # einer leeren Tabelle gar nicht erst an.
    if any(not z.strip() for z in zl[0]):
        f.append("Zeile 1 der Rechentabelle muss VOLLSTÄNDIG vorgerechnet sein")
    # Alle uebrigen geben nur den Startwert vor.
    for i, r in enumerate(zl[1:], 2):
        if not r[0].strip():
            f.append(f"Rechentabelle Zeile {i}: die erste Zelle gibt den Wert vor und darf nicht leer sein")
        if r[1].strip() or r[2].strip():
            f.append(f"Rechentabelle Zeile {i}: Rechnung und Ergebnis bleiben leer, das Kind rechnet sie")

    offen = [r[0] for r in zl[1:]]
    erw = [list(r) for r in l.get("rechnen_erwartet", [])]
    if [r[0] for r in erw] != offen:
        f.append(f"Lehrerteil: rechnen_erwartet deckt {[r[0] for r in erw]} statt der offenen Zeilen {offen}")
    if any(len(r) != 3 or any(not z.strip() for z in r) for r in erw):
        f.append("Lehrerteil: jede Zeile in rechnen_erwartet ist vollständig ausgefüllt")
        erw = []

    # ── Die Rechnung muss aufgehen ──────────────────────────────────
    for wo, r in [("Schülerseite, Zeile 1", zl[0])] + \
                 [(f"Lehrerteil, Zeile {i}", r) for i, r in enumerate(erw, 2)]:
        vorgabe, rechnung, ergebnis = _zahl(r[0]), r[1], _zahl(r[2])
        wert = _rechnet(rechnung)
        if wert is None:
            f.append(f"Rechentabelle ({wo}): „{rechnung}“ ist keine nachrechenbare Rechnung "
                     f"(erlaubt: Zahl · Zahl, Zahl : Zahl, Zahl + Zahl, Zahl – Zahl)")
            continue
        # Der Wert der ersten Spalte muss in der Rechnung VORKOMMEN - aber
        # nicht zwingend vorn: Bei P = W / t steht die vorgegebene Zeit hinten
        # („1962 : 5"), bei F = m · g die vorgegebene Masse vorn („2 · 9,8").
        # Der Riegel faengt den Fall, auf den es ankommt: eine Zeile, die etwas
        # anderes rechnet, als sie vorgibt.
        opn = _operanden(rechnung)
        if vorgabe is not None and opn and not any(abs(o - vorgabe) < 1e-9 for o in opn):
            f.append(f"Rechentabelle ({wo}): die Zeile gibt {vorgabe:g} vor, "
                     f"die Rechnung „{rechnung.strip()}“ benutzt den Wert aber nicht")
        if ergebnis is None:
            f.append(f"Rechentabelle ({wo}): im Ergebnis steht keine Zahl")
        elif abs(round(wert, _stellen(r[2])) - ergebnis) > 1e-9:
            f.append(f"Rechentabelle ({wo}): {rechnung} ergibt {round(wert, _stellen(r[2])):g}, "
                     f"gedruckt steht {ergebnis:g}")
    return f


def pruefe(einheit):
    s, l = einheit["seite"], einheit["lehrer"]
    f = []   # Befunde
    eid = s.get("id", "?")

    # ── Rendervertrag ────────────────────────────────────────────────
    if len(s.get("tabCols", [])) != 3:
        f.append("Tabelle braucht GENAU 3 Spalten (Rendervertrag anteil=[0.24,0.44,0.32])")
    rows = s.get("tabRows", [])
    if not (2 <= len(rows) <= 5):
        f.append(f"Tabellenzeilen: {len(rows)} (erlaubt 2–5)")
    for i, r in enumerate(rows):
        if len(r) != 3:
            f.append(f"Tabellenzeile {i+1} hat {len(r)} Zellen statt 3")
    # Seit dem 13.09.2026 sind ALLE Zellen leer - der Schueler fuellt auch die
    # erste Zeile. Vorher stand hier das Gegenteil ("Beispielzeile muss
    # vollstaendig gefuellt sein"); die Werte sind in den Lehrerteil umgezogen.
    # Jede Spalte ist entweder VORGABE (in allen Zeilen gefuellt) oder
    # ANTWORTSPALTE (in allen leer). Eine halb gefuellte Spalte ist die alte
    # Beispielzeile - genau das soll nicht mehr vorkommen.
    def _voll(r): return sum(1 for z in r[1:] if str(z).strip())
    if len(rows) > 1 and all(_voll(rows[0]) > _voll(r) for r in rows[1:]):
        f.append("Zeile 1 ist voller als alle übrigen – das ist die alte "
                 "Beispielzeile; alle Antwortzellen bleiben leer")
    ms = s.get("merksatz", [])
    if len(ms) != 2 or any(k not in m for m in ms for k in ("pre", "loesung", "post")):
        f.append("Merksatz braucht GENAU 2 Lücken-Einträge mit pre/loesung/post (Lehrerseite liest [0] und [1])")
    auf = s.get("aufgaben", [])
    if [a.get("typ") for a in auf] != ["erkennen", "einsetzen", "erklaeren"]:
        f.append("Aufgaben müssen genau erkennen–einsetzen–erklären sein")
    else:
        a1, a2, a3 = auf
        if len(a1.get("optionen", [])) != 3: f.append("Aufgabe 1 braucht genau 3 Optionen")
        if a1.get("richtig") not in (0, 1, 2): f.append("Aufgabe 1: richtig muss 0, 1 oder 2 sein")
        if len(a2.get("luecken", [])) != 2: f.append("Aufgabe 2 braucht genau 2 Lücken")
        if not a3.get("satzstarter"): f.append("Aufgabe 3 braucht einen Satzstarter")
        if not (2 <= a3.get("zeilen", 0) <= 6): f.append("Aufgabe 3: zeilen außerhalb 2–6")
    for h in ("h1", "h2", "h3"):
        if not s.get("hilfen", {}).get(h): f.append(f"Hilfe {h} fehlt")
    if "___" not in s.get("hilfen", {}).get("h3", ""):
        f.append("Hilfe 3 braucht die Lücke ___ (fast fertiges Beispiel)")
    if len(s.get("selbstcheck", [])) != 3:
        f.append("Selbstcheck braucht genau 3 Aussagen")
    if any(not a.startswith("Ich ") for a in s.get("selbstcheck", [])):
        f.append("Selbstcheck-Aussagen beginnen mit „Ich …“")
    # DREI Vermutungen seit dem Einstiegsumbau (12.09.2026). Zwei sind faktisch
    # eine Ja/Nein-Frage; mit der dritten muss das Kind wirklich waehlen.
    if len(s.get("predict", [])) != 3 or s.get("predictOk") not in (0, 1, 2):
        f.append("Genau 3 Vermutungen mit predictOk 0, 1 oder 2")
    # Zwei Falschantworten, die DASSELBE vorhersagen, kann das Kind am
    # Bildschirm nicht unterscheiden - dann prueft die Seite nichts. Wortgleich
    # ist der Fall, den sich maschinell fassen laesst; der inhaltliche gehoert
    # in die Gegenlese.
    if len(set(s.get("predict", []))) != len(s.get("predict", [])):
        f.append("Zwei Vermutungen sind wortgleich")

    # ── Sprach- und Formregeln des Profils ──────────────────────────
    woerter = sum(len((m["pre"] + " " + m["loesung"] + " " + m["post"]).split()) for m in ms)
    if woerter > 35: f.append(f"Merksatz hat {woerter} Wörter (maximal 35)")
    wb = s.get("wortbank", [])
    if not (4 <= len(wb) <= 7): f.append(f"Wortbank hat {len(wb)} Wörter (erlaubt 4–7)")
    for m in ms:
        if m.get("loesung") and m["loesung"] not in wb:
            f.append(f"Merksatz-Lückenwort „{m['loesung']}“ fehlt in der Wortbank")
    for lk in (auf[1].get("luecken", []) if len(auf) > 1 else []):
        if lk.get("loesung") and lk["loesung"] not in wb:
            f.append(f"Aufgabe-2-Lückenwort „{lk['loesung']}“ fehlt in der Wortbank")
    if len(s.get("fachwoerter_neu", [])) > 2:
        f.append("Mehr als ZWEI neue Fachwörter")
    if len(s.get("alltag", [])) > 4:
        f.append("Alltag hat mehr als 3 Sätze + 1 Begriffssatz")
    for a in s.get("alltag", []):
        if len(a.split()) > 16:
            f.append(f"Alltagssatz zu lang ({len(a.split())} Wörter): {a[:50]}…")
    fo = s.get("forschen", [])
    if not (1 <= len(fo) <= 4): f.append(f"Forschen hat {len(fo)} Schritte (höchstens 4)")
    for st in fo:
        if not st.split()[0].rstrip(",.:").startswith(OPERATOREN):
            f.append(f"Forschen-Schritt beginnt nicht mit Operator: „{st[:44]}…“")
    # `seite.ersatz` wird seit dem 14.09.2026 NICHT MEHR GEDRUCKT. Abdullah wollte
    # Abschnitt ③ auf einen Satz: "mache es immer kurz und knappt simulation
    # öffennen und die Schritte durchführen". Der Ersatzweg steht seitdem nur
    # noch im Lehrerteil unter "Wenn die Simulation nicht geht" - dort richtet er
    # sich an die Lehrkraft, die ihn ohnehin vorbereitet.
    #
    # Die Regel bleibt trotzdem: Sie haelt die QUELLE vollstaendig, damit der
    # Ersatzweg je Einheit dokumentiert ist und beim naechsten Umbau nicht fehlt.
    # Sie prueft aber nichts Gedrucktes mehr - wer sie liest, soll das wissen.
    if s.get("sim") and not s.get("ersatz", "").startswith("Wenn die Simulation nicht geht"):
        f.append("Ersatzsatz fehlt oder weicht ab (Quelle, nicht gedruckt)")
    if not s.get("bildauftrag", "").startswith("[BILD:"):
        f.append("Bildauftrag muss mit [BILD: beginnen")
    if not s.get("zuhause"): f.append("Zuhause-Auftrag fehlt")
    bsp = s.get("beispiel", {})
    if not (bsp.get("frage") and bsp.get("antwort")): f.append("Beispiel braucht frage und antwort")

    for t in _texte(s):
        if "klick" in t.lower():
            f.append(f"Verbotenes Wort „klicke“: {t[:50]}…")
        if DEZIMALPUNKT.search(t):
            f.append(f"Dezimalpunkt statt Komma: „{DEZIMALPUNKT.search(t).group()}“ in {t[:44]}…")
        if "etwa 42" in t:
            f.append("Grenzwinkel heißt einheitlich 41,8°, nie „etwa 42“")


    # ── Druckbarkeit ────────────────────────────────────────────────
    if CMAP:
        for t in _texte(s):
            for c in t:
                if ord(c) > 0x7f and ord(c) not in CMAP:
                    f.append(f"Zeichen {c!r} (U+{ord(c):04X}) fehlt in der Schrift – "
                             f"es wird als leeres Kästchen gedruckt: „{t[:44]}…“")
                    break
    # ── Lehrerseite (Pflichtblöcke + Konsistenz) ─────────────────────
    for feld in ("lernziel", "material", "zeit", "sozialform", "ersatz_ohne_simulation",
                 "merksatz", "tabelle_erwartet", "a1", "a2", "a3", "hilfe3_wort",
                 "schwache", "zusatz", "kernlehrplan"):
        if feld not in l: f.append(f"Lehrerteil: Feld {feld} fehlt")
    if len(l.get("merksatz", [])) != 2:
        f.append("Lehrerteil: merksatz braucht genau 2 Lösungen")
    elif [m["loesung"] for m in ms] != l["merksatz"]:
        f.append("Lehrerteil: merksatz-Lösungen passen nicht zur Schülerseite")
    if len(auf) == 3 and l.get("a1", {}).get("richtig") != auf[0].get("richtig"):
        f.append("Lehrerteil: a1.richtig widerspricht der Schülerseite")
    if len(auf) == 3 and l.get("a2", {}).get("loesungen") != [lk["loesung"] for lk in auf[1].get("luecken", [])]:
        f.append("Lehrerteil: a2-Lösungen passen nicht zu den Lücken der Schülerseite")
    # erwartete Tabelle: je eine Zeile für jede NICHT-Beispielzeile mit leeren Zellen
    # ab Zeile 1, nicht ab Zeile 2: die Beispielzeile gibt es nicht mehr
    offene = [r[0] for r in rows if any(not z for z in r[1:])]
    erwartete = [r[0] for r in l.get("tabelle_erwartet", [])]
    if offene != erwartete:
        f.append(f"Lehrerteil: tabelle_erwartet deckt {erwartete} statt der offenen Zeilen {offene}")
    if len(l.get("schwache", [])) < 3:
        f.append("Lehrerteil: mindestens 3 Hinweise für besonders schwache Lernende")
    f += pruefe_rechentabelle(s, l)
    return eid, f


# ── Selbsttest ───────────────────────────────────────────────────────
def selbsttest(gut):
    fehler = []
    proben = [0]          # zaehlt die kaputten Proben, damit die Meldung nicht luegt
    eid, bef = pruefe(gut)
    if bef:
        fehler.append(f"GUTE Einheit {eid} fiel durch: {bef}")

    def kaputt(pfad, wert, muss):
        proben[0] += 1
        k = copy.deepcopy(gut)
        ziel = k
        for p in pfad[:-1]: ziel = ziel[p]
        ziel[pfad[-1]] = wert
        _, bef = pruefe(k)
        if not any(muss in b for b in bef):
            fehler.append(f"Kaputt-Probe {pfad} → erwartete Meldung „{muss}“ kam nicht (Befunde: {bef})")

    kaputt(("seite", "tabCols"), ["a", "b"], "GENAU 3 Spalten")
    # Kaputt-Probe zur neuen Tabellenregel: eine vorausgefuellte Zelle muss
    # auffallen. Die alte Regel hatte ihre eigene Probe nie bekommen.
    kaputt(("seite", "tabRows"),
           [[gut["seite"]["tabRows"][0][0], "X", "Y"]] + 
           [list(r) for r in gut["seite"]["tabRows"][1:]],
           "voller als alle übrigen")
    kaputt(("seite", "merksatz"), gut["seite"]["merksatz"][:1], "GENAU 2 Lücken")
    kaputt(("seite", "wortbank"), ["a", "b", "c"], "Wortbank")
    kaputt(("seite", "forschen"), ["Man nimmt den Regler und dreht."], "Operator")
    kaputt(("seite", "selbstcheck"), ["Ich kann.", "Ich weiß."], "genau 3 Aussagen")
    kaputt(("seite", "frage"), "Bitte klicke auf den Knopf.", "klicke")
    kaputt(("seite", "beispiel", "antwort"), "Der Wert ist 9.8 hier.", "Dezimalpunkt")
    kaputt(("seite", "hilfen", "h3"), "Fast fertig ohne Lücke.", "___")
    kaputt(("lehrer", "a1", "richtig"), 9, "widerspricht")
    kaputt(("seite", "fachwoerter_neu"), ["A", "B", "C"], "ZWEI neue Fachwörter")
    # Die Vermutungsregel hatte bis zum 12.09.2026 KEINE Kaputt-Probe - eine
    # Regel, die nie gegen ihren Fehlerfall gehalten wird, ist keine Pruefung.
    kaputt(("seite", "predict"), gut["seite"]["predict"][:2], "Genau 3 Vermutungen")
    kaputt(("seite", "predict"),
           [gut["seite"]["predict"][0]] * 3, "wortgleich")
    if CMAP:
        # Kaputt-Probe Schrift: ein Knopfname mit Zierziffer, wie ihn die
        # Simulationen wirklich tragen - muss als undruckbar auffallen.
        kaputt(("seite", "frage"), "Drücke „➊ ganz klein“ und lies ab.", "fehlt in der Schrift")
    # ── Rechentabelle (seit 17.09.2026) ──────────────────────────────
    # Sie ist OPTIONAL, die gute Probe hat also keine. Deshalb bekommt sie hier
    # eine eingesetzt - erst eine richtige, die durchgehen MUSS, dann sechs
    # kaputte. Ohne die richtige Probe wuesste niemand, ob der Riegel nicht
    # einfach alles meldet.
    GUTE_TABELLE = {
        "hinweis": "Rechne mit g = 9,8 N/kg.",
        "spalten": ["Masse m", "Rechnung", "Gewichtskraft F"],
        "zeilen": [["1 kg", "1 · 9,8", "9,8 N"], ["2 kg", "", ""], ["10 kg", "", ""]],
    }
    GUTE_LOESUNG = [["2 kg", "2 · 9,8", "19,6 N"], ["10 kg", "10 · 9,8", "98 N"]]

    def mit_tabelle(tab, loes):
        k = copy.deepcopy(gut)
        k["seite"]["rechnen"] = copy.deepcopy(tab)
        k["lehrer"]["rechnen_erwartet"] = copy.deepcopy(loes)
        return k

    _, bef = pruefe(mit_tabelle(GUTE_TABELLE, GUTE_LOESUNG))
    rt_bef = [b for b in bef if "Rechentabelle" in b or "rechnen_erwartet" in b]
    if rt_bef:
        fehler.append(f"GUTE Rechentabelle fiel durch: {rt_bef}")

    def tab_kaputt(was, tab, loes, muss):
        proben[0] += 1
        _, bef = pruefe(mit_tabelle(tab, loes))
        if not any(muss in b for b in bef):
            fehler.append(f"Kaputt-Probe Rechentabelle ({was}) → erwartete Meldung "
                          f"„{muss}“ kam nicht (Befunde: {bef})")

    def mit(**aend):
        t = copy.deepcopy(GUTE_TABELLE); t.update(aend); return t

    # DER Fall, für den es den Riegel gibt: ein falsches Produkt sieht aus wie
    # ein richtiges. 10 · 9,8 sind 98, nicht 89.
    tab_kaputt("falsches Produkt im Lehrerteil", GUTE_TABELLE,
               [["2 kg", "2 · 9,8", "19,6 N"], ["10 kg", "10 · 9,8", "89 N"]],
               "ergibt 98")
    tab_kaputt("falsches Produkt in der vorgerechneten Zeile",
               mit(zeilen=[["1 kg", "1 · 9,8", "8,9 N"], ["2 kg", "", ""], ["10 kg", "", ""]]),
               GUTE_LOESUNG, "ergibt 9,8" .replace(",", "."))
    # Die Rechnung muss mit dem Wert anfangen, den die Zeile vorgibt.
    tab_kaputt("Rechnung benutzt einen anderen Wert", GUTE_TABELLE,
               [["2 kg", "3 · 9,8", "29,4 N"], ["10 kg", "10 · 9,8", "98 N"]],
               "die Zeile gibt 2 vor")
    # Eine vorausgefuellte Antwortzelle nimmt dem Kind genau die Aufgabe weg.
    tab_kaputt("Antwortzelle schon gefüllt",
               mit(zeilen=[["1 kg", "1 · 9,8", "9,8 N"], ["2 kg", "2 · 9,8", "19,6 N"], ["10 kg", "", ""]]),
               GUTE_LOESUNG, "bleiben leer")
    # Ohne vorgerechnete Zeile faengt ein Foerderlernender nicht an.
    tab_kaputt("erste Zeile nicht vorgerechnet",
               mit(zeilen=[["1 kg", "", ""], ["2 kg", "", ""], ["10 kg", "", ""]]),
               [["1 kg", "1 · 9,8", "9,8 N"]] + GUTE_LOESUNG, "VOLLSTÄNDIG vorgerechnet")
    # Der Renderer setzt genau drei Spalten.
    tab_kaputt("vier Spalten", mit(spalten=["a", "b", "c", "d"]), GUTE_LOESUNG,
               "GENAU 3")
    # Ein Lehrerteil, der andere Zeilen loest als das Heft stellt.
    tab_kaputt("Lehrerteil deckt die falschen Zeilen", GUTE_TABELLE,
               [["2 kg", "2 · 9,8", "19,6 N"]], "statt der offenen Zeilen")
    return fehler, proben[0]


if __name__ == "__main__":
    alle = sorted(os.listdir(os.path.join(HERE, "einheiten")))
    ids = sys.argv[1:] or [a[:-5] for a in alle if a.endswith(".json")]

    gut = json.load(open(MUSTER_PFAD, encoding="utf-8"))
    st, n_proben = selbsttest(gut)
    if st:
        print("SELBSTTEST NICHT BESTANDEN – der Prüfer darf nicht urteilen:")
        for z in st: print(" ✗", z)
        sys.exit(2)
    print(f"Selbsttest bestanden (1 gute + {n_proben} kaputte Proben). Prüfe {len(ids)} Einheiten.\n")

    gesamt = 0
    for eid in ids:
        e = json.load(open(os.path.join(HERE, "einheiten", eid + ".json"), encoding="utf-8"))
        _, bef = pruefe(e)
        if bef:
            gesamt += len(bef)
            print(f"── {eid} ──")
            for b in bef: print("  ✗", b)
    # Wortgewicht je Einheit und Median des Bandes
    gew = []
    for eid in ids:
        e = json.load(open(os.path.join(HERE, "einheiten", eid + ".json"), encoding="utf-8"))
        gew.append((wortgewicht(e["seite"]), eid, bool(e["seite"].get("rechnen"))))
    if gew:
        gew.sort()
        med = gew[len(gew)//2][0]
        ueber = [f"{e} ({w})" for w, e, rt in gew
                 if BUDGET and w > BUDGET + (BUDGET_RECHNEN if rt else 0)]
        n_rt = sum(1 for _w, _e, rt in gew if rt)
        print(f"\nWortgewicht: Median {med} · leichteste {gew[0][1]} ({gew[0][0]}) · "
              f"schwerste {gew[-1][1]} ({gew[-1][0]})"
              + (f" · Budget {BUDGET}" if BUDGET else ""))
        if n_rt:
            print(f"  davon {n_rt} mit Rechentabelle (Budget dort {BUDGET + BUDGET_RECHNEN})")
        if ueber:
            print("  über dem Budget:", ", ".join(ueber))
            gesamt += len(ueber)
    # Antwortpositionen je Kapitel zählen (Messregel)
    for kap, kennungen in KAPITEL_IDS:
        # Counter statt fester Schluessel: mit der dritten Vermutung gibt es
        # predictOk = 2, und ein Dict mit nur {0,1} stuerzte hier mit
        # KeyError ab - mitten in der Auswertung, nach allen Befunden.
        p_zaehl, r_zaehl = collections.Counter(), collections.Counter()
        for eid in ids:
            if eid not in kennungen: continue
            e = json.load(open(os.path.join(HERE, "einheiten", eid + ".json"), encoding="utf-8"))
            p_zaehl[e["seite"]["predictOk"]] += 1
            r_zaehl[e["seite"]["aufgaben"][0]["richtig"]] += 1
        print(f"{kap}: predictOk {dict(sorted(p_zaehl.items()))} · Aufgabe-1-richtig {dict(sorted(r_zaehl.items()))}")
    print("\nBEFUNDE GESAMT:", gesamt)
    sys.exit(1 if gesamt else 0)
