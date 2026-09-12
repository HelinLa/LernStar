# -*- coding: utf-8 -*-
"""Baut content/forscherseiten.json aus den Einzeldateien content/seiten/<id>.json.

    python3 zusammenfuehren.py

Die Regelbaende der Sekundarstufe I pflegen forscherseiten.json direkt. Fuer
diesen Band liegt der Arbeitsstand einheitenweise - so ueberlebt ein langer
Schreiblauf einen Abbruch, und drei parallele Laeufe schreiben sich nicht
gegenseitig um (dieselbe Loesung wie in der Foerderreihe).

Reihenfolge kommt aus plan.py. Fehlt eine Einheit, wird sie UEBERSPRUNGEN und
gemeldet - so laesst sich der Zwischenstand jederzeit setzen.
"""
import json, os, sys, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location("plan", os.path.join(HERE, "plan.py"))
plan = importlib.util.module_from_spec(_s); _s.loader.exec_module(plan)

_M = os.path.join(os.path.dirname(HERE), "arbeitsheft")
_k = importlib.util.spec_from_file_location("kompetenzen_gost",
                                            os.path.join(_M, "kompetenzen_gost.py"))
kompetenzen = importlib.util.module_from_spec(_k); _k.loader.exec_module(kompetenzen)
_l = importlib.util.spec_from_file_location("lehrplan_gost",
                                            os.path.join(_M, "lehrplan_gost.py"))
lehrplan = importlib.util.module_from_spec(_l); _l.loader.exec_module(lehrplan)

PFLICHT = ["id", "basiskonzept", "titel", "problem", "frage", "auftrag", "predict",
           "predictOk", "forschen", "tabCols", "tabRows", "fachtext", "merksatz",
           "beobachtung", "aufgabe", "alltag", "alltagAfb", "alltagKomp",
           "ueberleitung", "name", "theme"]


def _codes(obj):
    """Alle Kompetenzcodes eines Objekts einsammeln (Felder alltagKomp, komp)."""
    import re
    aus = set()
    def go(x, key=None):
        if isinstance(x, str):
            if key in ("alltagKomp", "komp", "kompetenz"):
                aus.update(re.findall(r"\b([SEKB]\d{1,2})\b", x))
        elif isinstance(x, dict):
            for k, v in x.items(): go(v, k)
        elif isinstance(x, list):
            for v in x: go(v, key)
    go(obj)
    return aus


seiten, fehlt, mangel = [], [], []
for th in plan.THEMEN:
    p = os.path.join(HERE, "content", "seiten", th["id"] + ".json")
    if not os.path.exists(p):
        fehlt.append(th["id"]); continue
    d = json.load(open(p, encoding="utf-8"))

    # Der Bauplan ist die Wahrheit: id, theme und das Vorhandensein eines
    # Datenblatts muessen zu plan.py passen. Sonst steht spaeter im gesetzten
    # Heft etwas anderes, als der Plan sagt.
    kap = next(k for k in plan.KAPITEL if th in k["themen"])
    if d.get("id") != th["id"]:
        mangel.append(f"{th['id']}: Feld id ist {d.get('id')!r}")
    if d.get("theme") != kap["id"]:
        mangel.append(f"{th['id']}: theme ist {d.get('theme')!r}, plan.py sagt {kap['id']!r}")
    if th["id"] in plan.DATENBLATT and "daten" not in d:
        mangel.append(f"{th['id']}: laut Bauplan Datenblattseite, aber Feld daten fehlt")
    if th["id"] not in plan.DATENBLATT and "daten" in d:
        mangel.append(f"{th['id']}: Feld daten, aber der Bauplan sieht eine Simulation vor")
    for f in PFLICHT:
        if f not in d or d[f] in (None, "", []):
            mangel.append(f"{th['id']}: Pflichtfeld {f} fehlt")

    # Kompetenzcodes gegen den OBERSTUFENPLAN - der haeufigste Kopierfehler ist
    # ein UF-Code aus der Sekundarstufe I.
    falsch = kompetenzen.pruefe(_codes(d))
    if falsch:
        mangel.append(f"{th['id']}: Codes gehoeren nicht zum Oberstufenplan: {sorted(falsch)}")

    # Basiskonzept: NICHT jedes Inhaltsfeld nennt alle vier.
    erlaubt = lehrplan.konzepte(kap["id"])
    if d.get("basiskonzept") not in erlaubt:
        mangel.append(f"{th['id']}: Basiskonzept {d.get('basiskonzept')!r} - "
                      f"Inhaltsfeld nennt nur {erlaubt}")
    seiten.append(d)

os.makedirs(os.path.join(HERE, "content"), exist_ok=True)
with open(os.path.join(HERE, "content", "forscherseiten.json"), "w", encoding="utf-8") as f:
    json.dump(seiten, f, ensure_ascii=False, indent=1)

# ── Uebungen, Kapiteltests und Transferaufgaben ─────────────────────
# Dieselbe Reihenfolge wie oben: plan.py ist die Wahrheit.
uebungen = []
for th in plan.THEMEN:
    q = os.path.join(HERE, "content", "uebungen", th["id"] + ".json")
    if not os.path.exists(q):
        mangel.append(f"{th['id']}: Uebungsseite fehlt"); continue
    u = json.load(open(q, encoding="utf-8"))
    for feld, soll in (("lueckensaetze", 4), ("richtigfalsch", 4), ("komp", 4), ("afb", 4)):
        if len(u.get(feld, [])) != soll:
            mangel.append(f"{th['id']} (Uebung): {feld} hat {len(u.get(feld, []))} statt {soll}")
    if len(u.get("mc", {}).get("optionen", [])) != 3:
        mangel.append(f"{th['id']} (Uebung): mc braucht genau 3 Optionen")
    falsch = kompetenzen.pruefe(u.get("komp", []))
    if falsch:
        mangel.append(f"{th['id']} (Uebung): Codes nicht aus dem Oberstufenplan: {sorted(falsch)}")
    uebungen.append(u)

tests, transfer = [], []
for k in plan.KAPITEL:
    for name, ziel in (("tests", tests), ("transfer", transfer)):
        q = os.path.join(HERE, "content", name, k["id"] + ".json")
        if not os.path.exists(q):
            mangel.append(f"{k['id']}: {name}-Datei fehlt"); continue
        ziel.append(json.load(open(q, encoding="utf-8")))

for name, obj in (("uebungen.json", uebungen), ("assessment.json", tests),
                  ("transfer.json", transfer)):
    with open(os.path.join(HERE, "content", name), "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=1)
print(f"{len(uebungen)} Uebungen, {len(tests)} Kapiteltests, {len(transfer)} Transferseiten.")

print(f"{len(seiten)} von {len(plan.THEMEN)} Seiten zusammengeführt.")
if fehlt:  print("FEHLT:", ", ".join(fehlt))
if mangel:
    print(f"\n{len(mangel)} BEFUNDE:")
    for m in mangel: print("  ✗", m)
    sys.exit(1)
print("Keine Befunde.")
