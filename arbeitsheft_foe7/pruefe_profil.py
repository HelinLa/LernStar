# -*- coding: utf-8 -*-
"""Formprüfer des Förderprofils (FOERDER_PROFIL.md) + Rendervertrag.

Nach der Hausregel darf kein Prüfer urteilen, bevor er seinen Selbsttest
bestanden hat: Der Lauf beginnt mit einer bekannt guten Einheit (muss ohne
Befund durchgehen) und einer Reihe absichtlich kaputter Einheiten (jede muss
genau ihren Fehler auslösen). Erst danach werden die echten Einheiten geprüft.

Aufruf: python3 pruefe_profil.py            → Selbsttest + alle Einheiten
        python3 pruefe_profil.py fo3 fw8    → Selbsttest + nur diese
"""
import json, os, re, sys, copy

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
    if rows and any(not z for z in rows[0]):
        f.append("Beispielzeile (Zeile 1) muss vollständig gefüllt sein")
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
    if len(s.get("predict", [])) != 2 or s.get("predictOk") not in (0, 1):
        f.append("Genau 2 Vermutungen mit predictOk 0 oder 1")

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
    if s.get("sim") and not s.get("ersatz", "").startswith("Wenn die Simulation nicht geht"):
        f.append("Ersatzsatz für die Simulation fehlt oder weicht ab")
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
    offene = [r[0] for r in rows[1:] if any(not z for z in r[1:])]
    erwartete = [r[0] for r in l.get("tabelle_erwartet", [])]
    if offene != erwartete:
        f.append(f"Lehrerteil: tabelle_erwartet deckt {erwartete} statt der offenen Zeilen {offene}")
    if len(l.get("schwache", [])) < 3:
        f.append("Lehrerteil: mindestens 3 Hinweise für besonders schwache Lernende")
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
    kaputt(("seite", "merksatz"), gut["seite"]["merksatz"][:1], "GENAU 2 Lücken")
    kaputt(("seite", "wortbank"), ["a", "b", "c"], "Wortbank")
    kaputt(("seite", "forschen"), ["Man nimmt den Regler und dreht."], "Operator")
    kaputt(("seite", "selbstcheck"), ["Ich kann.", "Ich weiß."], "genau 3 Aussagen")
    kaputt(("seite", "frage"), "Bitte klicke auf den Knopf.", "klicke")
    kaputt(("seite", "beispiel", "antwort"), "Der Wert ist 9.8 hier.", "Dezimalpunkt")
    kaputt(("seite", "hilfen", "h3"), "Fast fertig ohne Lücke.", "___")
    kaputt(("lehrer", "a1", "richtig"), 9, "widerspricht")
    kaputt(("seite", "fachwoerter_neu"), ["A", "B", "C"], "ZWEI neue Fachwörter")
    if CMAP:
        # Kaputt-Probe Schrift: ein Knopfname mit Zierziffer, wie ihn die
        # Simulationen wirklich tragen - muss als undruckbar auffallen.
        kaputt(("seite", "frage"), "Drücke „➊ ganz klein“ und lies ab.", "fehlt in der Schrift")
    return fehler, proben[0]


if __name__ == "__main__":
    alle = sorted(os.listdir(os.path.join(HERE, "einheiten")))
    ids = sys.argv[1:] or [a[:-5] for a in alle if a.endswith(".json")]

    gut = json.load(open(os.path.join(HERE, "einheiten", "fo10.json"), encoding="utf-8"))
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
        gew.append((wortgewicht(e["seite"]), eid))
    if gew:
        gew.sort()
        med = gew[len(gew)//2][0]
        ueber = [f"{e} ({w})" for w, e in gew if BUDGET and w > BUDGET]
        print(f"\nWortgewicht: Median {med} · leichteste {gew[0][1]} ({gew[0][0]}) · "
              f"schwerste {gew[-1][1]} ({gew[-1][0]})"
              + (f" · Budget {BUDGET}" if BUDGET else ""))
        if ueber:
            print("  über dem Budget:", ", ".join(ueber))
            gesamt += len(ueber)
    # Antwortpositionen je Kapitel zählen (Messregel)
    for kap, kennungen in KAPITEL_IDS:
        p_zaehl, r_zaehl = {0: 0, 1: 0}, {0: 0, 1: 0, 2: 0}
        for eid in ids:
            if eid not in kennungen: continue
            e = json.load(open(os.path.join(HERE, "einheiten", eid + ".json"), encoding="utf-8"))
            p_zaehl[e["seite"]["predictOk"]] += 1
            r_zaehl[e["seite"]["aufgaben"][0]["richtig"]] += 1
        print(f"{kap}: predictOk {dict(p_zaehl)} · Aufgabe-1-richtig {dict(r_zaehl)}")
    print("\nBEFUNDE GESAMT:", gesamt)
    sys.exit(1 if gesamt else 0)
