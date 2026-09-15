# -*- coding: utf-8 -*-
"""Liefert die Bruecken-Daten des Foerderhefts 7.

    python3 export_bruecke.py --json

Gibt die Heftseiten als JSON aus. Zusammengesetzt wird js/heft-bruecke.js von
arbeitsheft/bruecke_alle.py - dort laufen alle Baende in getrennten Prozessen,
weil ihre Module build_book und build_final gleich heissen.

Die fo/fw-Kennungen MUESSEN in der Bruecke stehen, bevor gedruckte QR-Codes
benutzt werden: Der Code traegt nur  #heft=<id>,  welche Simulation dazugehoert
weiss allein die Bruecke.
"""
import os, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from build_book import SIM, CHAPTERS, SEITEN
import plan

# Seitenzahlen genauso zaehlen wie beim Setzen des Hefts:
# Deckblatt, So arbeitest du, Inhalt -> die erste Trennseite ist Seite 4.
seiten = {}; pn = 4
for ch in CHAPTERS:
    pn += 1                                   # Kapitel-Trennseite
    for tid in ch["topics"]:
        seiten[tid] = pn; pn += 2             # Seite A und Seite B
    pn += 2                                   # Foerdertest

# Die GEMESSENEN Seitenzahlen aus dem letzten Satz haben Vorrang - der Zaehler
# oben bildet die Struktur nur nach und geriet in anderen Baenden schon aus dem
# Tritt, sobald eine Seite dazukam.
_gemessen = os.path.join(HERE, "build", "seiten.json")
if os.path.exists(_gemessen):
    _gem = json.load(open(_gemessen, encoding="utf-8"))
    seiten.update(_gem)
    # Auch WENN die Datei da ist, kann eine Kennung fehlen - etwa weil ihr
    # QR-Code beim Messen unlesbar war. Dann traegt genau diese Seite die
    # geschaetzte Zahl, und niemand sieht es.
    # Die Luecken fuellt der SATZ selbst: build/seiten_gebaut.json haelt fest,
    # mit welchem `pn` jede Einheit gesetzt wurde. Die gemessenen Zahlen behalten
    # den Vorrang - sie sind die unabhaengige Gegenprobe -, aber geschaetzt wird
    # nichts mehr. Betroffen sind die Datenblattseiten: Sie drucken keinen
    # QR-Code, also kann seitenzahlen.py sie nicht lesen.
    _gebaut_p = os.path.join(HERE, "build", "seiten_gebaut.json")
    _gebaut = {}
    if os.path.exists(_gebaut_p):
        _gebaut = json.load(open(_gebaut_p, encoding="utf-8"))
        for _k, _v in _gebaut.items():
            if _k not in _gem:
                seiten[_k] = _v
        # Weichen Messung und Satz fuer eine Seite MIT QR-Code voneinander ab,
        # ist eines von beiden falsch - das muss man sehen.
        _uneins = sorted(k for k in _gem if k in _gebaut and _gem[k] != _gebaut[k])
        if _uneins:
            print("WARNUNG %s: gemessene und gesetzte Seitenzahl weichen ab bei %s"
                  % (os.path.basename(HERE), ", ".join(
                      "%s (%s statt %s)" % (k, _gem[k], _gebaut[k]) for k in _uneins)),
                  file=sys.stderr)
    _nur_geschaetzt = sorted(k for k in seiten if k not in _gem and k not in _gebaut)
    if _nur_geschaetzt:
        print("WARNUNG %s: %d Kennung(en) weder gemessen noch im Satz verzeichnet, "
              "sie tragen die GESCHAETZTE Seitenzahl: %s" % (os.path.basename(HERE),
              len(_nur_geschaetzt), ", ".join(_nur_geschaetzt)), file=sys.stderr)
else:
    # DER STILLE RUECKFALL, vor dem CLAUDE.md warnt. Ohne diese Zeile faellt
    # eine fehlende Messung niemandem auf.
    print("WARNUNG %s: build/seiten.json fehlt - ALLE Seitenzahlen sind "
          "geschaetzt und wahrscheinlich falsch. Erst "
          "'python3 simcheck/seitenzahlen.py %s' laufen lassen."
          % (os.path.basename(HERE), os.path.basename(HERE)), file=sys.stderr)

eintraege = []
for ch in CHAPTERS:
    for tid in ch["topics"]:
        o = SEITEN[tid]
        eintraege.append({
            "id":        tid,
            "klasse":    plan.KLASSE,
            # Klasse 7 gibt es dreimal: Realschule, Gesamtschule und - hier - als
            # Foerderausgabe der Gesamtschule. Die Schulform haelt sie auseinander.
            "schulform": f"{plan.SCHULFORM} · {plan.AUSGABE}",
            "sim":       SIM.get(tid),
            "seite":     seiten.get(tid),
            "kapitel":   ch["title"],
            "name":      o["name"],
            "titel":     o.get("titel", ""),
            "frage":     o["frage"],
            # Der Auftrag steckt im Foerderheft in den nummerierten Schritten -
            # eine eigene Auftragszeile gibt es dort bewusst nicht.
            "auftrag":   "",
            "schritte":  o.get("forschen", []),
        })

if "--json" in sys.argv:
    print(json.dumps(eintraege, ensure_ascii=False))
else:
    print(f"{len(eintraege)} Heftseiten, {len(set(e['sim'] for e in eintraege))} Simulationen")
    for e in eintraege[:3]:
        print(f"   {e['id']}  Seite {e['seite']}  -> {e['sim']}")
    print("Zum Schreiben der Datei: python3 ../arbeitsheft/bruecke_alle.py")
