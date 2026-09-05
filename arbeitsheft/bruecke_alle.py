# -*- coding: utf-8 -*-
"""Setzt js/heft-bruecke.js aus ALLEN Forscherheften zusammen.

    python3 arbeitsheft/bruecke_alle.py

Ruft die Exporter der einzelnen Hefte als eigene Prozesse auf. Das muss so sein:
Alle Hefte haben ein Modul build_book und benutzen build_final; in einem Prozess
wuerde das zweite das erste ueberschreiben.

Danach die ?v=-Nummer von js/heft-bruecke.js in index.html hochzaehlen.
"""
import os, sys, json, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HERE)
ORDNER = ["arbeitsheft", "arbeitsheft7", "arbeitsheft8", "arbeitsheft9", "arbeitsheft10",
          # Gesamtschule NRW - eigene Reihe, eigene Kennungen
          "arbeitsheft_gts7", "arbeitsheft_gts8", "arbeitsheft_gts9", "arbeitsheft_gts10",
          # Gymnasialreihe (im Aufbau) - Ordner ohne fertige Inhalte werden uebersprungen
          "arbeitsheft_gym56", "arbeitsheft_gym7", "arbeitsheft_gym8",
          "arbeitsheft_gym9", "arbeitsheft_gym10",
          # Foerderreihe (A2-B1) - eigene Kennungen fo/fw, eigene Inhaltsdateien
          "arbeitsheft_foe7"]

# Welche Inhaltsdateien ein Band braucht, damit er gebaut werden kann.
# Die Foerderbaende haben einen anderen Satz: keine Uebungsseiten, kein
# Kapiteltest im Schuelerteil, dafuer den getrennten Lehrerteil.
NOETIG_REGEL   = ["forscherseiten.json", "uebungen.json", "assessment.json", "transfer.json"]
NOETIG_FOERDER = ["foerderseiten.json", "loesungen_lehrer.json"]
HEFTE = [os.path.join(WURZEL, o, "export_bruecke.py") for o in ORDNER]

alle = []
for skript in HEFTE:
    if not os.path.exists(skript):
        print("übersprungen (nicht vorhanden):", os.path.relpath(skript, WURZEL)); continue
    # Hefte, die noch keine Inhalte haben, gehoeren noch nicht in die Bruecke.
    # Ohne diese Abfrage bricht der ganze Lauf ab, sobald ein Band angelegt,
    # aber noch nicht geschrieben ist.
    # ALLE vier Inhaltsdateien muessen da sein: export_bruecke laedt build_book,
    # und das liest beim Import auch uebungen, assessment und transfer. Fehlt eine,
    # bricht sonst der ganze Lauf ab, statt nur diesen Band zu ueberspringen.
    _ordner = os.path.dirname(skript)
    _noetig = NOETIG_FOERDER if "_foe" in os.path.basename(_ordner) else NOETIG_REGEL
    _fehlt = [n for n in _noetig if not os.path.exists(os.path.join(_ordner, "content", n))]
    if _fehlt:
        print(f"übersprungen ({', '.join(_fehlt)} fehlt):", os.path.relpath(_ordner, WURZEL)); continue
    r = subprocess.run([sys.executable, skript, "--json"],
                       cwd=os.path.dirname(skript), capture_output=True, text=True)
    if r.returncode != 0:
        print("FEHLER in", os.path.relpath(skript, WURZEL)); print(r.stderr[-800:]); raise SystemExit(1)
    teil = json.loads(r.stdout.strip().splitlines()[-1])
    alle += teil
    print(f"  {os.path.relpath(skript, WURZEL):34} {len(teil):3} Heftseiten")

doppelt = [e["id"] for e in alle if sum(1 for x in alle if x["id"] == e["id"]) > 1]
if doppelt:
    raise SystemExit(f"Kennungen doppelt vergeben: {sorted(set(doppelt))} – "
                     "der heft=-Parameter muss klassenübergreifend eindeutig sein.")

js = ["// ============================================================================",
      "//  heft-bruecke.js  –  ERZEUGT, NICHT VON HAND AENDERN",
      "//  Quelle: arbeitsheft*/content/forscherseiten.json",
      "//  Neu bauen:  python3 arbeitsheft/bruecke_alle.py",
      "//",
      "//  Der QR-Code jeder Heftseite ruft  #experiment=<sim>&heft=<id>  auf. Ueber diese",
      "//  Tabelle weiss die App dann, aus welchem Heft und von welcher Seite ein Kind",
      "//  kommt und welche Forscherfrage oben stehen muss - auch wenn zwei Heftseiten",
      "//  auf dieselbe Simulation zeigen.",
      "// ============================================================================",
      "'use strict';", "", "const HEFT_SEITEN = {"]
for e in alle:
    schritte = ", ".join(json.dumps(s, ensure_ascii=False) for s in e["schritte"])
    js += [f"  {json.dumps(e['id'])}: {{",
           f"    klasse: {json.dumps(e['klasse'])}, schulform: {json.dumps(e.get('schulform','Realschule NRW'), ensure_ascii=False)},",
           f"    sim: {json.dumps(e['sim'], ensure_ascii=False)}, seite: {e['seite']},",
           f"    kapitel: {json.dumps(e['kapitel'], ensure_ascii=False)},",
           f"    name: {json.dumps(e['name'], ensure_ascii=False)},",
           f"    titel: {json.dumps(e['titel'], ensure_ascii=False)},",
           f"    frage: {json.dumps(e['frage'], ensure_ascii=False)},",
           f"    auftrag: {json.dumps(e.get('auftrag',''), ensure_ascii=False)},",
           f"    schritte: [{schritte}]",
           "  },"]
js += ["};", "",
 "// simId -> alle Heftseiten, die darauf zeigen",
 "const HEFT_ZU_SIM = {};",
 "for (const [id, d] of Object.entries(HEFT_SEITEN))",
 "  if (d.sim) (HEFT_ZU_SIM[d.sim] = HEFT_ZU_SIM[d.sim] || []).push(id);",
 ""]
ziel = os.path.join(WURZEL, "js", "heft-bruecke.js")
os.makedirs(os.path.dirname(ziel), exist_ok=True)
open(ziel, "w", encoding="utf-8").write("\n".join(js))
klassen = sorted({e["klasse"] for e in alle}, key=str)   # "5/6" (Gym) mischt sich mit Zahlen
print(f"\ngeschrieben: js/heft-bruecke.js – {len(alle)} Heftseiten aus Klasse {', '.join(map(str, klassen))}")
