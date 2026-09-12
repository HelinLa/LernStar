# -*- coding: utf-8 -*-
"""Baut content/foerderseiten.json und content/loesungen_lehrer.json aus den
Einzeldateien einheiten/<id>.json (je {"seite": ..., "lehrer": ...}).

Die Einzeldateien sind der Arbeitsstand; jede Einheit landet einzeln auf der
Platte und überlebt so einen Sitzungsabbruch. Reihenfolge kommt aus plan.py.
Fehlt eine Einheit, wird sie ÜBERSPRUNGEN und gemeldet — so lässt sich der
Zwischenstand jederzeit rendern.
"""
import json, os
import importlib.util
HERE = os.path.dirname(os.path.abspath(__file__))
spec = importlib.util.spec_from_file_location("foeplan", os.path.join(HERE, "plan.py"))
foeplan = importlib.util.module_from_spec(spec); spec.loader.exec_module(foeplan)

seiten, lehrer, fehlt = [], [], []
for th in foeplan.THEMEN:
    p = os.path.join(HERE, "einheiten", th["id"] + ".json")
    if not os.path.exists(p):
        fehlt.append(th["id"]); continue
    d = json.load(open(p, encoding="utf-8"))
    for feld, wert in (("id", th["id"]), ("sim", th["sim"]), ("quelle", "+".join(th["quelle"]))):
        if d["seite"].get(feld) not in (wert, None):
            raise SystemExit(f"{th['id']}: Feld {feld} widerspricht plan.py: {d['seite'].get(feld)!r} statt {wert!r}")
    d["seite"]["id"] = d["lehrer"]["id"] = th["id"]
    seiten.append(d["seite"]); lehrer.append(d["lehrer"])

for name, obj in (("foerderseiten.json", seiten), ("loesungen_lehrer.json", lehrer)):
    with open(os.path.join(HERE, "content", name), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
print(f"{len(seiten)} Einheiten zusammengeführt.", "FEHLT:", ", ".join(fehlt) if fehlt else "keine")
