# -*- coding: utf-8 -*-
"""Zieht die Faktendumps EINES Bandes - alle, die sein Bauplan benutzt.

    python3 simcheck/fakten_ziehen.py <heftordner> [--nach=<ordner>] [--neu]
    python3 simcheck/fakten_ziehen.py --alle

Warum es das gibt: Eine Heftseite darf nur verlangen, was am Bildschirm
dasteht, und belegt wird das aus `fakten/<sim>.json`. Bis zum 15.09.2026 wurden
diese Dumps von Hand gezogen, Simulation fuer Simulation - und **die vierzehn
Baende der Sekundarstufe I hatten deshalb GAR KEINE**: 357 Ziehungen haette das
gekostet. `heft_gegen_sim.py` ist auf ihnen nie gelaufen.

Zwei Dinge macht das Werkzeug anders als die Handarbeit:

- **Einmal je Simulation, nicht je Band.** Die 14 Baende benutzen zusammen 179
  verschiedene Simulationen in 357 Themen; ein Zwischenspeicher spart also 209
  Ziehungen. Voreinstellung ist `simcheck/fakten/` im Projekt, gemeinsam fuer
  alle Baende.
- **Die Schalter stehen hier, nicht im Gedaechtnis.** `--voll` (die
  2500er-Deckelung schnitt bei `lichtuhr` zwei Drittel ab), `--frames=25
  --verlauf=4` (animierte Simulationen stehen nach zwei Frames noch
  im Startzustand). Mit anderen Schaltern gezogene Dumps sind nicht vergleichbar.

Ein Dump traegt kein Datum ([[fakten-dumps-veralten]]). Nach jeder Aenderung an
`physics-sim.js` ODER an `simcheck/simfakten.js` also mit `--neu` alle zusammen
neu ziehen - nicht einzeln nachziehen.
"""
import json, os, re, subprocess, sys
import importlib.util as ilu

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)
SIMDATEI = os.path.join(WURZEL, "physics-sim.js")
# `--stellen` gibt die Stellungen mit, die eine Heftseite abliest und die kein
# Gitter treffen kann (vierdimensionale Reglerraeume). Aufgeschrieben ist dort
# die STELLUNG, nicht der Wert - vorgelesen wird er von der Simulation.
STELLEN = os.path.join(HIER, "stellen.json")
SCHALTER = ["--voll", "--frames=25", "--verlauf=4", "--stellen=" + STELLEN]

BAENDER = ["arbeitsheft", "arbeitsheft7", "arbeitsheft8", "arbeitsheft9", "arbeitsheft10",
           "arbeitsheft_gts7", "arbeitsheft_gts8", "arbeitsheft_gts9", "arbeitsheft_gts10",
           "arbeitsheft_gym56", "arbeitsheft_gym7", "arbeitsheft_gym8", "arbeitsheft_gym9",
           "arbeitsheft_gym10", "arbeitsheft_ef",
           "arbeitsheft_foe7", "arbeitsheft_foe8", "arbeitsheft_foe9", "arbeitsheft_foe10"]


def sim_von(band):
    """Kennung -> Simulation. Drei Bauformen, alle drei im Bestand.

    Klasse 5/6 war der erste Band und hat kein `plan.py`: Die Zuordnung steht
    als dict `SIM` in seinem `build_book.py`. Wer nur `plan.py` liest, haelt
    diesen Band fuer leer - und prueft ihn nie.
    """
    p = os.path.join(WURZEL, band, "plan.py")
    if os.path.exists(p):
        spec = ilu.spec_from_file_location("plan_fz_" + band.replace("/", "_"), p)
        m = ilu.module_from_spec(spec); spec.loader.exec_module(m)
        kap = getattr(m, "ALLE_KAPITEL", None) or getattr(m, "KAPITEL", [])
        if kap:
            return {th["id"]: th.get("sim") for k in kap for th in k["themen"] if th.get("sim")}
        return {th["id"]: th.get("sim") for th in getattr(m, "THEMEN", []) if th.get("sim")}
    bb = os.path.join(WURZEL, band, "build_book.py")
    blk = re.search(r"^SIM\s*=\s*\{(.*?)^\}", open(bb, encoding="utf-8").read(), re.S | re.M)
    if not blk:
        raise SystemExit(f"{band}: weder plan.py noch ein dict SIM in build_book.py")
    return dict(re.findall(r'"([^"]+)"\s*:\s*"([^"]+)"', blk.group(1)))


def ziehen(sims, nach, neu=False):
    os.makedirs(nach, exist_ok=True)
    gut = uebersprungen = fehl = 0
    kaputt = []
    for i, sim in enumerate(sorted(sims), 1):
        ziel = os.path.join(nach, sim + ".json")
        if os.path.exists(ziel) and os.path.getsize(ziel) > 0 and not neu:
            uebersprungen += 1
            continue
        r = subprocess.run(["node", os.path.join(HIER, "simfakten.js"), SIMDATEI, sim] + SCHALTER,
                           capture_output=True, text=True)
        # Nicht am Rueckgabewert allein haengen: simfakten.js schreibt auch bei
        # einer nicht vorhandenen Kennung eine gueltige, aber leere Liste.
        d = None
        if r.returncode == 0 and r.stdout.strip():
            try:
                d = json.loads(r.stdout)
            except json.JSONDecodeError as e:
                kaputt.append(f"{sim}: kein gueltiges JSON ({e})")
        if d and d[0].get("sim") == sim:
            with open(ziel, "w", encoding="utf-8") as f:
                f.write(r.stdout)
            gut += 1
        else:
            fehl += 1
            kaputt.append(f"{sim}: {(r.stderr or 'leerer Dump').strip().splitlines()[-1][:140]}"
                          if (r.stderr or "").strip() else f"{sim}: leerer Dump")
        if i % 20 == 0:
            print(f"   {i}/{len(sims)}  ({gut} gezogen, {uebersprungen} lagen schon da, {fehl} kaputt)",
                  flush=True)
    return gut, uebersprungen, fehl, kaputt


def main():
    args = sys.argv[1:]
    neu = "--neu" in args
    nach = next((a[6:] for a in args if a.startswith("--nach=")), os.path.join(HIER, "fakten"))
    ziele = [a for a in args if not a.startswith("--")]
    if "--alle" in args:
        ziele = BAENDER
    if not ziele:
        sys.exit(__doc__)

    sims, je = set(), {}
    for b in ziele:
        if b not in BAENDER:
            sys.exit(f"Unbekannter Band: {b}\nBekannt: {' '.join(BAENDER)}")
        je[b] = set(sim_von(b).values())
        sims |= je[b]
        print(f"{b:20s} {len(je[b]):3d} Simulationen")
    if len(ziele) > 1:
        print(f"\n{len(sims)} verschiedene Simulationen - "
              f"{sum(len(v) for v in je.values()) - len(sims)} Ziehungen gespart")

    gut, alt, fehl, kaputt = ziehen(sims, nach, neu)
    print(f"\n{gut} gezogen, {alt} lagen schon da, {fehl} kaputt  ->  {nach}")
    for z in kaputt:
        print("   x", z)
    return 1 if fehl else 0


if __name__ == "__main__":
    sys.exit(main())
