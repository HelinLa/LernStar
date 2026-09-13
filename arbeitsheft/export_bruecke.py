# -*- coding: utf-8 -*-
"""Schreibt die Bruecke zwischen Forscherheft und App:  LernStar/js/heft-bruecke.js

Die App weiss danach zu jeder Simulation, von welcher Heftseite der Schueler kommt,
welche Forscherfrage dort steht und auf welcher Seite sie gedruckt ist. Erzeugt aus
content/forscherseiten.json - damit App und Heft nicht auseinanderlaufen koennen.

Neu bauen:  python3 export_bruecke.py   (nach jeder Aenderung an den Forscherfragen)
"""
import os, json, sys
from build_book import SIM, CHAPTERS, FSD, UEBD, SZ_NACH

HERE = os.path.dirname(os.path.abspath(__file__))
APP  = os.path.abspath(os.path.join(HERE, "..", "js"))

# Seitenzahlen genauso zaehlen wie beim Setzen des Hefts
seiten = {}; pn = 4
for ch in CHAPTERS:
    pn += 1                                   # Trennseite
    for tid in ch["topics"]:
        seiten[tid] = pn; pn += 1
        if tid in UEBD: pn += 1
        if ch["id"] == "strom" and tid == SZ_NACH:
            seiten["s1"] = pn; pn += 1
    pn += 3                                   # Testprep, Test, Hilfen (je 1 Seite geschaetzt)
    # Wortgitter und Kreuzwort entfallen seit dem 09.09.2026 und werden hier nicht
    # mehr mitgezaehlt. Dieser Zaehler ist ohnehin nur die Notloesung: er kennt
    # weder mehrseitige Einheiten noch die Weiterdenken-Seite. Massgeblich ist
    # build/seiten.json, gemessen mit simcheck/seitenzahlen.py (siehe unten).

# Die gemessenen Seitenzahlen aus dem letzten Satz haben Vorrang. Der Zaehler
# oben bildet die Struktur des Hefts nach und geriet aus dem Tritt, als je
# Kapitel eine Weiterdenken-Seite dazukam - in vier Heften stand daraufhin in
# der App eine Seitenzahl, die es so nicht gab (Klasse 9 teils 30 Seiten daneben).
_gemessen = os.path.join(HERE, "build", "seiten.json")
if os.path.exists(_gemessen):
    import json as _json
    seiten.update(_json.load(open(_gemessen, encoding="utf-8")))

eintraege = []
for ch in CHAPTERS:
    tids = list(ch["topics"]) + (["s1"] if ch["id"] == "strom" else [])
    for tid in tids:
        o = FSD[tid]
        eintraege.append((tid, {
            "sim":     SIM.get(tid),
            "seite":   seiten.get(tid),
            "kapitel": ch["title"],
            "name":    o["name"],
            "titel":   o.get("titel", ""),
            "frage":   o["frage"],
            "auftrag": o.get("auftrag",""),
            "schritte": o.get("forschen", []),
        }))

if "--json" in sys.argv:
    # Sammelmodus: Nur die Daten ausgeben, das Zusammensetzen macht bruecke_alle.py.
    # So laufen Klasse 5 und Klasse 7 in getrennten Prozessen und ihre gleichnamigen
    # Module (build_book, build_final) kommen sich nicht in die Quere.
    print(json.dumps([{"id": tid, "klasse": 5, **d} for tid, d in eintraege], ensure_ascii=False))
    raise SystemExit

js = ["// ============================================================================",
      "//  heft-bruecke.js  –  ERZEUGT, NICHT VON HAND AENDERN",
      "//  Quelle: arbeitsheft/content/forscherseiten.json  ->  python3 export_bruecke.py",
      "//",
      "//  Der QR-Code jeder Heftseite ruft  #experiment=<sim>&heft=<id>  auf. Ueber diese",
      "//  Tabelle weiss die App dann, welche Forscherfrage oben stehen muss - auch wenn",
      "//  zwei Heftseiten auf dieselbe Simulation zeigen.",
      "// ============================================================================",
      "'use strict';", "", "const HEFT_SEITEN = {"]
for tid, d in eintraege:
    schritte = ", ".join(json.dumps(s, ensure_ascii=False) for s in d["schritte"])
    js.append(f"  {json.dumps(tid)}: {{")
    js.append(f"    sim: {json.dumps(d['sim'], ensure_ascii=False)}, seite: {d['seite']},")
    js.append(f"    kapitel: {json.dumps(d['kapitel'], ensure_ascii=False)},")
    js.append(f"    name: {json.dumps(d['name'], ensure_ascii=False)},")
    js.append(f"    titel: {json.dumps(d['titel'], ensure_ascii=False)},")
    js.append(f"    frage: {json.dumps(d['frage'], ensure_ascii=False)},")
    # Das Feld `auftrag` wird NICHT mehr ausgeliefert (13.09.2026).
    # js/heft-banner.js zeigte es ueber der Simulation an - denselben Satz,
    # den Abdullah am selben Tag von der gedruckten Seite streichen liess
    # ("die kinder muessen selber drauf kommen"). In der Bruecke waren das
    # 52 KB ueber 570 Heftseiten, die jeder Nutzer mitlaedt. Die SCHRITTE
    # bleiben - die stehen auch im Heft unter Abschnitt 3.
    js.append(f"    schritte: [{schritte}]")
    js.append("  },")
js += ["};", "",
 "// simId -> alle Heftseiten, die darauf zeigen",
 "const HEFT_ZU_SIM = {};",
 "for (const [id, d] of Object.entries(HEFT_SEITEN))",
 "  if (d.sim) (HEFT_ZU_SIM[d.sim] = HEFT_ZU_SIM[d.sim] || []).push(id);",
 ""]
os.makedirs(APP, exist_ok=True)
ziel = os.path.join(APP, "heft-bruecke.js")
open(ziel, "w", encoding="utf-8").write("\n".join(js))
print(f"geschrieben: {ziel}  ({len(eintraege)} Heftseiten, {len(set(d['sim'] for _,d in eintraege))} Simulationen)")
for tid,d in eintraege[:3]: print(f"   {tid}  Seite {d['seite']}  -> {d['sim']}")
