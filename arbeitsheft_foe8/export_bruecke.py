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
    seiten.update(json.load(open(_gemessen, encoding="utf-8")))

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
