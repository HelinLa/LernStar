# -*- coding: utf-8 -*-
"""Arbeitsdump je Fördereinheit: Analyse + Originalseite(n) + Sim-Bedienung.

Aufruf: python3 quelle.py fo1 [fo2 ...]
Druckt kompakt alles, was zum Ausformulieren nötig ist. Statuszeilen werden
auf die ERSTE Nennung je Einstellung gekürzt, Wiederholungen entfallen.
"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
import importlib.util as _i
_s=_i.spec_from_file_location("plan", os.path.join(HERE,"plan.py"))
_p=_i.module_from_spec(_s); _s.loader.exec_module(_p)
GTS7 = os.path.join(os.path.dirname(HERE), _p.QUELLBAND)

import importlib.util
spec = importlib.util.spec_from_file_location("foeplan", os.path.join(HERE, "plan.py"))
foeplan = importlib.util.module_from_spec(spec); spec.loader.exec_module(foeplan)

ANA = {e["id"]: e for e in json.load(open(os.path.join(HERE, "analyse_schritt1.json"), encoding="utf-8"))["einheiten"]}
SRC = {s["id"]: s for s in json.load(open(os.path.join(GTS7, "content", "forscherseiten.json"), encoding="utf-8"))}

def dump(fid):
    th = next(t for t in foeplan.THEMEN if t["id"] == fid)
    print("=" * 72)
    print(f"{fid} · {th['name']} · sim={th['sim']} · quelle={'+'.join(th['quelle'])}")
    for q in th["quelle"]:
        a = ANA[q]
        print(f"\n--- ANALYSE {q} ---")
        print("LERNZIEL:", a["lernziel"])
        print("KERN:", " | ".join(a["kerninhalt"]))
        print("SIMWERTE:", " | ".join(a["simwerte"]))
        print("FACHWÖRTER:", ", ".join(a["fachwoerter"]), "· HÜRDEN:", " | ".join(a["huerden"]))
        s = SRC.get(q)
        if s:
            print(f"\n--- ORIGINAL {q}: {s.get('titel','')} ---")
            for k in ("problem", "frage", "auftrag"):
                if s.get(k): print(f"{k}: {s[k]}")
            if s.get("predict"): print("predict:", " // ".join(s["predict"]))
            for k in ("forschen", "schritte"):
                if s.get(k): print(f"{k}:", " // ".join(s[k]))
            for k in ("tabCols", "tabRows", "merksatz", "wortfeld", "zuhause", "alltagKomp"):
                if s.get(k): print(f"{k}:", json.dumps(s[k], ensure_ascii=False))
    if not th.get("sim"):
        # Datenblattseite: kein Bildschirm, Abschnitt 3 arbeitet an gedruckten Daten.
        print("\n--- KEINE SIMULATION · DATENBLATTSEITE ---")
        print("Abschnitt 3 heißt AUSWERTEN & BEURTEILEN, Dreischritt ablesen -")
        print("ordnen/vergleichen - beurteilen. Kein QR-Code, kein Ersatzsatz.")
        print("Das Datenblatt steht im Feld seite.daten (titel, spalten, zeilen,")
        print("quelle, merke) und wird rechts neben die drei Schritte gesetzt.")
        return
    f = json.load(open(os.path.join(HERE, "fakten", th["sim"] + ".json"), encoding="utf-8"))[0]
    print(f"\n--- SIM {th['sim']} ---")
    print("REGLER:", json.dumps(f.get("regler", []), ensure_ascii=False))
    print("KNÖPFE:", [k["aufschrift"] for k in f.get("knoepfe", [])])
    gesehen = set()
    for st in f.get("status", []):
        # nur den Teil hinter dem letzten "||" zeigen, der NEU dazukam
        neu = st["text"].split("||")[-1].strip() if "||" in st["text"] else st["text"]
        if neu in gesehen: continue
        gesehen.add(neu)
        print(f"  [{st['einstellung']}] {neu[:400]}")
    if f.get("bildtexte"): print("BILDTEXTE:", json.dumps(f["bildtexte"][:36], ensure_ascii=False))
    if f.get("hinweise"):
        for hw in f["hinweise"]: print("HINWEIS:", hw[:300])

if __name__ == "__main__":
    for fid in sys.argv[1:]:
        dump(fid)
