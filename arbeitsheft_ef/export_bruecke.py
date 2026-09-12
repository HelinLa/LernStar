# -*- coding: utf-8 -*-
"""Liefert die Bruecken-Daten des Klasse-7-Hefts.

    python3 export_bruecke.py --json

Gibt die Heftseiten als JSON aus. Zusammengesetzt wird die Datei js/heft-bruecke.js
von arbeitsheft/bruecke_alle.py - dort laufen beide Hefte in getrennten Prozessen,
weil ihre Module build_book und build_final gleich heissen.
"""
import os, sys, json

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from build_book import SIM, CHAPTERS, FSD, UEBD
import plan

# Seitenzahlen genauso zaehlen wie beim Setzen des Hefts
seiten = {}; pn = 4
for ch in CHAPTERS:
    pn += 1                                   # Trennseite
    for tid in ch["topics"]:
        seiten[tid] = pn; pn += 1
        if tid in UEBD: pn += 1
    pn += 7                                   # Weiterdenken, Wortgitter, Kreuzwort, Testprep, Test (2) + Trenner

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
    for tid in ch["topics"]:
        o = FSD[tid]
        eintraege.append({
            "id":       tid,
            "klasse":   plan.KLASSE,
            # Klasse 7 gibt es zweimal - als Realschul- und als Gesamtschulheft.
            # Ohne die Schulform koennte die App die beiden nicht auseinanderhalten.
            "schulform": getattr(plan, "SCHULFORM", "Realschule NRW"),
            "sim":      SIM.get(tid),
            "seite":    seiten.get(tid),
            "kapitel":  ch["title"],
            "name":     o["name"],
            "titel":    o.get("titel", ""),
            "frage":    o["frage"],
            "auftrag":  o.get("auftrag", ""),
            "schritte": o.get("forschen", []),
        })

if "--json" in sys.argv:
    print(json.dumps(eintraege, ensure_ascii=False))
else:
    print(f"{len(eintraege)} Heftseiten, {len(set(e['sim'] for e in eintraege))} Simulationen")
    for e in eintraege[:3]:
        print(f"   {e['id']}  Seite {e['seite']}  -> {e['sim']}")
    print("Zum Schreiben der Datei: python3 ../arbeitsheft/bruecke_alle.py")
