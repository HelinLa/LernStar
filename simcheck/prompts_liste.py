# -*- coding: utf-8 -*-
"""Schreibt die Bildauftraege als schlichte Textliste zum Durcharbeiten.

    python3 simcheck/prompts_liste.py <heft>

Das Auftrags-PDF ist zum Lesen da. Wer 29 Bilder hintereinander erzeugt, will
aber nicht blaettern, sondern von oben nach unten kopieren. Diese Liste hat je
Bild genau zwei Zeilen: den Dateinamen und den Prompt.
"""
import importlib.util, os, re, sys

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _ablage(plan):
    sf = getattr(plan, "SCHULFORM", "Realschule NRW")
    if "Gesamtschule" in sf:
        return f"~/Desktop/FELO-Bilder Gesamtschule {plan.KLASSE}/"
    return f"~/Desktop/Arbeitsheft-Bilder {plan.KLASSE} Klasse/  (oder direkt in <heft>/bilder/)"


def main():
    k = sys.argv[1]
    # Sowohl "gts7" als auch "arbeitsheft8" annehmen - die Realschulhefte heissen
    # arbeitsheft, arbeitsheft7 ... , die Gesamtschulhefte arbeitsheft_gts7 ...
    ordner = os.path.join(WURZEL, k if k.startswith("arbeitsheft") else f"arbeitsheft_{k}")
    planpfad = os.path.join(ordner, "plan.py")
    if os.path.exists(planpfad):
        spec = importlib.util.spec_from_file_location("plan_pl", planpfad)
        plan = importlib.util.module_from_spec(spec); spec.loader.exec_module(plan)
    else:
        # Klasse 5/6 hat keine plan.py - die Reihenfolge steht in der Inhaltsdatei.
        import json as _json

        class plan:                                   # noqa: N801
            KLASSE = "5/6"
            SCHULFORM = "Realschule NRW"
            _c = _json.load(open(os.path.join(ordner, "content", "forscherseiten.json"),
                                 encoding="utf-8"))
            if isinstance(_c, dict):
                _c = _c.get("seiten", [])
            THEMEN = [{"id": x["id"]} for x in _c]

    t = open(os.path.join(ordner, "bilder", "PROMPTS.md"), encoding="utf-8").read()
    bl = {}
    # Zwei Formate: die neuen Hefte schreiben `<Kennung> <Titel>.png` — <Kennung>,
    # Klasse 5/6 dagegen `<Kennung>.png` — <Titel>. Beide zulassen.
    kennungen = {th["id"] for th in plan.THEMEN}
    for m in re.finditer(r"^### `(.+?)\.png` — (.+?)$(.*?)(?=^### |^## |\Z)", t, re.M | re.S):
        datei, hinten, block = m.group(1), m.group(2).strip(), m.group(3)
        tid = hinten if hinten in kennungen else datei.split()[0]
        if tid not in kennungen:
            continue
        pr = re.search(r"```\n(.*?)\n```", block, re.S)
        if pr:
            bl[tid] = (datei, pr.group(1).strip())

    # Nur die Themen listen, fuer die noch KEIN Bild vorliegt. Heft 7 hat 36 Themen,
    # aber nur 6 offene - eine Liste mit allen 36 kostet nur Zeit.
    reihe = [th["id"] for th in plan.THEMEN]
    try:
        sys.path.insert(0, ordner)
        for tot in ("plan", "build_book", "build_final", "textschicht", "bilder"):
            sys.modules.pop(tot, None)
        ba = importlib.util.module_from_spec(
            importlib.util.spec_from_file_location("ba_pl", os.path.join(ordner, "bildauftraege.py")))
        importlib.util.spec_from_file_location(
            "ba_pl", os.path.join(ordner, "bildauftraege.py")).loader.exec_module(ba)
        offen = set(ba.offen())
        if not offen:
            raise RuntimeError("keine offenen gemeldet")
        reihe = [t for t in reihe if t in offen]
    except Exception:
        # Aeltere Hefte (Klasse 5/6) haben kein offen() im Auftragsmodul.
        # Dann direkt ueber bilder.py bestimmen, welche Kennung schon ein Bild hat.
        try:
            sys.path.insert(0, ordner)
            for tot in ("plan", "bilder"):
                sys.modules.pop(tot, None)
            bsp = importlib.util.spec_from_file_location("bi_pl", os.path.join(ordner, "bilder.py"))
            bi = importlib.util.module_from_spec(bsp); bsp.loader.exec_module(bi)
            da = bi.einlesen(still=True, vom_schreibtisch=False)
            reihe = [t for t in reihe if t not in da]
        except Exception as e2:
            print(f"  (offene Themen nicht ermittelbar: {type(e2).__name__}, liste alle)")
        finally:
            if ordner in sys.path:
                sys.path.remove(ordner)
    finally:
        if ordner in sys.path:
            sys.path.remove(ordner)
    zeilen = [f"# FELO PHYSIK {plan.KLASSE} · {getattr(plan,'SCHULFORM','Realschule NRW')} · "
              f"{len(reihe)} noch fehlende Bilder",
              f"# Ablage: {_ablage(plan)}",
              "# Querformat 5:3, mindestens 1200 x 720. Reihenfolge wie im Heft.", ""]
    fehlt = []
    for i, tid in enumerate(reihe, 1):
        if tid not in bl:
            fehlt.append(tid); continue
        datei, prompt = bl[tid]
        zeilen += [f"───────── {i:02d}/{len(reihe)}  {datei}.png",
                   prompt, ""]
    ziel = os.path.join(ordner, "bilder", "PROMPTS.txt")
    open(ziel, "w", encoding="utf-8").write("\n".join(zeilen))
    print(f"  {k}: {len(reihe)-len(fehlt)} Prompts -> {os.path.relpath(ziel, WURZEL)}"
          + (f"  FEHLEN: {fehlt}" if fehlt else ""))


if __name__ == "__main__":
    main()
