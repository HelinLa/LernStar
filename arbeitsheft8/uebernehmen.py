# -*- coding: utf-8 -*-
"""Nimmt das Ergebnis des Schreib-Workflows entgegen und legt content/forscherseiten.json an.

    python3 uebernehmen.py <ergebnis.json>

Erwartet {"seiten":[...]} oder eine blanke Liste. Ergaenzt die Felder, die nicht aus dem
Text kommen (name, theme), setzt die Reihenfolge nach plan.py und prueft die Formatregeln,
bevor etwas geschrieben wird.
"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import plan

HERE = os.path.dirname(os.path.abspath(__file__))
ZIEL = os.path.join(HERE, "content", "forscherseiten.json")

# Der Schreib-Workflow lief noch mit den alten Kennungen des dritten Kapitels.
# h1..h5 sind aber in Klasse 5 vergeben, und der heft=-Parameter im QR-Link ist
# in der App klassenuebergreifend eindeutig.
UMBENANNT = {f"h{i}": f"g{i}" for i in range(1, 6)}

PFLICHT = ["titel", "problem", "frage", "predict", "predictOk", "forschen", "tabCols",
           "tabRows", "fachtext", "merksatz", "beobachtung", "aufgabe", "alltag", "ueberleitung"]


def pruefen(seiten):
    """Liefert eine Liste von Beanstandungen, ohne etwas zu aendern."""
    fehler = []
    nach_kapitel = {}
    for s in seiten:
        tid = s["id"]
        for f in PFLICHT:
            if f not in s or s[f] in (None, "", []):
                fehler.append(f"{tid}: {f} fehlt")
        w = len(s.get("problem", "").split())
        if not 30 <= w <= 60:
            fehler.append(f"{tid}: Einstieg hat {w} Wörter (30–60 erwartet)")
        if not 2 <= len(s.get("forschen", [])) <= 3:
            fehler.append(f"{tid}: {len(s.get('forschen', []))} Forschritte (2–3 erwartet)")
        if not 3 <= len(s.get("tabRows", [])) <= 4:
            fehler.append(f"{tid}: {len(s.get('tabRows', []))} Tabellenzeilen (3–4 erwartet)")
        if len(s.get("predict", [])) != 2:
            fehler.append(f"{tid}: {len(s.get('predict', []))} Vermutungen (2 erwartet)")
        if len(s.get("merksatz", [])) != 2:
            fehler.append(f"{tid}: {len(s.get('merksatz', []))} Merksätze (2 erwartet)")
        for m in s.get("merksatz", []):
            if len(m.get("loesung", "").split()) != 1:
                fehler.append(f"{tid}: Lösungswort „{m.get('loesung')}“ ist nicht EIN Wort")
        nach_kapitel.setdefault(plan.KAPITEL_VON.get(tid), []).append(s.get("predictOk"))
    for kap, oks in nach_kapitel.items():
        if kap and len(set(oks)) == 1:
            fehler.append(f"Kapitel {kap}: richtige Vermutung steht überall an Stelle {oks[0] + 1}")
    return fehler


def main(quelle):
    roh = json.load(open(quelle, encoding="utf-8"))
    if isinstance(roh, dict):
        roh = roh.get("seiten") or roh.get("result", {}).get("seiten") or []
    seiten = {}
    for s in roh:
        s = dict(s)
        s["id"] = UMBENANNT.get(s["id"], s["id"])
        seiten[s["id"]] = s

    fehlend = [th["id"] for th in plan.THEMEN if th["id"] not in seiten]
    if fehlend:
        sys.exit(f"Es fehlen Seiten: {fehlend}")

    # Reihenfolge und Zusatzfelder aus dem Bauplan, nicht aus dem Text
    geordnet = []
    for th in plan.THEMEN:
        s = seiten[th["id"]]
        s["name"] = th["name"]                        # Lehrplanthema, steht klein auf der Trennseite
        s["theme"] = plan.KAPITEL_VON[th["id"]]
        s.setdefault("sicherheit", None)
        if not s.get("sicherheit"):
            s.pop("sicherheit", None)
        geordnet.append(s)

    fehler = pruefen(geordnet)
    print(f"{len(geordnet)} Seiten · {len(fehler)} Beanstandungen")
    for f in fehler:
        print("   ", f)

    os.makedirs(os.path.dirname(ZIEL), exist_ok=True)
    json.dump(geordnet, open(ZIEL, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("geschrieben:", os.path.relpath(ZIEL, HERE))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
