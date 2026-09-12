# -*- coding: utf-8 -*-
"""Streut die Antwortpositionen der Foerderseiten - je Kapitel gleichmaessig.

    python3 seiten_nachbereiten.py [--probe]

WARUM: Wer eine Seite nach der anderen schreibt, setzt die richtige Antwort
unbewusst immer an dieselbe Stelle. Beim Bau von Foerderheft 8 standen in
Kapitel 1 die ersten SECHS Einheiten alle auf predictOk=0 und a1.richtig=2 -
ein Kind haette nach drei Seiten das Muster heraus und muesste nicht mehr lesen.
(Die Regelreihe hat dafuer arbeitsheft/seiten_nachbereiten.py; dies ist die
Foerder-Fassung, die zusaetzlich die Lehrerseite mitzieht.)

Verteilt wird DETERMINISTISCH, nicht zufaellig: innerhalb jedes Kapitels
reihum 0,1,0,1,... fuer die zwei Vermutungen und 0,1,2,0,1,2,... fuer die drei
Antwortmoeglichkeiten von Aufgabe 1. Zweimal laufen aendert nichts mehr.

Verschoben wird der INHALT, nicht nur der Index - und die Lehrerseite
(a1.richtig) wird mitgezogen, sonst widersprechen sich Heft und Loesung.
"""
import json, os, sys, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location("plan", os.path.join(HERE, "plan.py"))
plan = importlib.util.module_from_spec(_s); _s.loader.exec_module(plan)

# Formulierungen, die eine Position benennen wuerden. Nach dem Umsortieren
# stimmten sie nicht mehr - deshalb wird davor gewarnt statt still umgestellt.
POSITIONSWOERTER = ("erste Vermutung", "zweite Vermutung", "obere Antwort",
                    "untere Antwort", "erste Antwort", "zweite Antwort",
                    "dritte Antwort", "Antwort A", "Antwort B", "Antwort C")


def _texte(o):
    if isinstance(o, str): yield o
    elif isinstance(o, dict):
        for v in o.values(): yield from _texte(v)
    elif isinstance(o, list):
        for v in o: yield from _texte(v)


def main():
    probe = "--probe" in sys.argv
    geaendert = warnungen = 0
    for kap in plan.KAPITEL:
        ids = [t["id"] for t in kap["themen"]]
        print(f"{kap['id']}: {len(ids)} Einheiten")
        for n, eid in enumerate(ids):
            p = os.path.join(HERE, "einheiten", eid + ".json")
            if not os.path.exists(p): continue
            d = json.load(open(p, encoding="utf-8"))
            s, l = d["seite"], d["lehrer"]

            for t in _texte(d):
                for w in POSITIONSWOERTER:
                    if w in t:
                        print(f"   ! {eid}: Text nennt eine Position („{w}“) – von Hand pruefen")
                        warnungen += 1

            # Reihum ueber ALLE vorhandenen Stellen. Fest "% 2" liess Platz 3
            # nie zu, seit die Einheiten drei Moeglichkeiten haben.
            ziel_p = n % max(2, len(s.get("predict") or [2]))
            if s["predictOk"] != ziel_p:
                # Die richtige Moeglichkeit an ziel_p setzen, die falschen in
                # ihrer Reihenfolge dahinter. Vorher stand hier reversed():
                # bei ZWEI Moeglichkeiten richtig, bei DREI landet die richtige
                # damit auf Platz 3, waehrend predictOk auf 1 zeigt - der
                # Lehrerband haette die falsche Loesung gedruckt. Seit dem
                # Einstiegsumbau (12.09.2026) haben alle Einheiten drei.
                _pr = list(s["predict"]); _ok = s["predictOk"]
                if 0 <= _ok < len(_pr) and 0 <= ziel_p < len(_pr):
                    _richtig = _pr[_ok]
                    _neu = [t for k, t in enumerate(_pr) if k != _ok]
                    _neu.insert(ziel_p, _richtig)
                    assert _neu[ziel_p] == _richtig and len(_neu) == len(_pr)
                    s["predict"] = _neu
                    s["predictOk"] = ziel_p
                geaendert += 1

            a1 = s["aufgaben"][0]
            ziel_a = n % 3                       # Aufgabe 1: reihum
            if a1["richtig"] != ziel_a:
                opt = a1["optionen"]; r = a1["richtig"]
                rest = [o for i, o in enumerate(opt) if i != r]
                neu = rest[:ziel_a] + [opt[r]] + rest[ziel_a:]
                a1["optionen"] = neu; a1["richtig"] = ziel_a
                l["a1"]["richtig"] = ziel_a
                geaendert += 1

            print(f"   {eid:5} predictOk={s['predictOk']}  a1.richtig={a1['richtig']}")
            if not probe:
                json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n{geaendert} Positionen umgestellt"
          + (" (PROBE - nichts geschrieben)" if probe else "")
          + (f" · {warnungen} Warnungen" if warnungen else ""))


if __name__ == "__main__":
    main()
