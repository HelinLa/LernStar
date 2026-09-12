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
import json, os, re, sys, importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
_s = importlib.util.spec_from_file_location("plan", os.path.join(HERE, "plan.py"))
plan = importlib.util.module_from_spec(_s); _s.loader.exec_module(plan)

# Formulierungen, die eine Position benennen wuerden. Nach dem Umsortieren
# stimmten sie nicht mehr - deshalb wird davor gewarnt statt still umgestellt.
#
# "Option" kam am 05.09.2026 dazu. Die Liste kannte nur "erste/zweite/dritte
# Antwort", die Loesungswege im Lehrerteil schreiben aber durchgehend "Option".
# fv2 wurde deshalb ohne eine einzige Warnzeile von a1.richtig=2 auf 1 gestellt,
# waehrend lehrer.a1.weg weiter auf die alte Reihenfolge zeigte. Gemessen: 13
# weitere Einheiten des Bandes stehen genauso da. Auch die gebeugten Formen
# ("aus der ersten Option") muessen drin stehen - sonst greift die Suche nicht.
POSITIONSWOERTER = ("erste Vermutung", "zweite Vermutung", "obere Antwort",
                    "untere Antwort", "erste Antwort", "zweite Antwort",
                    "dritte Antwort", "Antwort A", "Antwort B", "Antwort C",
                    "erste Option", "zweite Option", "dritte Option",
                    "ersten Option", "zweiten Option", "dritten Option",
                    "obere Option", "untere Option",
                    # Kurzformen mit Ziffer: "Vermutung 2" stand in fv12 im
                    # Lehrerteil und rutschte durch, weil die Liste nur die
                    # ausgeschriebene Form "zweite Vermutung" kannte.
                    "Vermutung 1", "Vermutung 2", "Antwort 1", "Antwort 2",
                    "Antwort 3", "Option 1", "Option 2", "Option 3")

# Die Ziffernformen brauchen eine Grenze nach hinten, sonst meldet der Waechter
# jedes Zitat einer Antwort, die mit derselben Ziffer anfaengt: "die Antwort
# 1200 J" enthaelt woertlich "Antwort 1" und "Antwort 2" ist in "Antwort 240 J".
_POS_RE = [(w, re.compile(re.escape(w) + r"(?!\d)")) for w in POSITIONSWOERTER]


def _texte(o):
    if isinstance(o, str): yield o
    elif isinstance(o, dict):
        for v in o.values(): yield from _texte(v)
    elif isinstance(o, list):
        for v in o: yield from _texte(v)


# ── Positionsangaben MITZIEHEN statt nur warnen ──────────────────────
# Warnen allein reicht nicht: In Band 10 haetten 11 Einheiten mit rund 55
# Nennungen von Hand nachgezogen werden muessen, und ein uebersehener Satz
# begruendet danach die falsche Antwort. Die Abbildung alt->neu ist bekannt,
# also wird sie auf den Text angewendet. Ersetzt wird SIMULTAN (eine Regex,
# eine Ersetzungsfunktion) - nacheinander wuerde 1->2 und danach 2->3 dieselbe
# Stelle zweimal treffen.
_ORD = {"erste": 1, "zweite": 2, "dritte": 3}
_ZAHLWORT = {1: "erste", 2: "zweite", 3: "dritte"}
_RX_ORD  = re.compile(r"\b(erste|zweite|dritte)(n|r|s)? (Option|Antwort|Vermutung)\b")
_RX_ZIFF = re.compile(r"\b(Option|Antwort|Vermutung) ([123])(?!\d)")


def _ziehe_mit(text, opt_map, pred_map):
    """opt_map/pred_map: {alte 1-basierte Nummer -> neue 1-basierte Nummer}."""
    def karte(wort):
        return pred_map if wort == "Vermutung" else opt_map

    def o(m):
        alt = _ORD[m.group(1)]; endung = m.group(2) or ""; wort = m.group(3)
        neu = karte(wort).get(alt, alt)
        return f"{_ZAHLWORT[neu]}{endung} {wort}"

    def z(m):
        wort = m.group(1); alt = int(m.group(2))
        return f"{wort} {karte(wort).get(alt, alt)}"

    return _RX_ZIFF.sub(z, _RX_ORD.sub(o, text))


def _wandle(obj, opt_map, pred_map):
    """Zieht die Positionsangaben in einem ganzen Teilbaum mit."""
    if isinstance(obj, str):
        return _ziehe_mit(obj, opt_map, pred_map)
    if isinstance(obj, dict):
        return {k: _wandle(v, opt_map, pred_map) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_wandle(v, opt_map, pred_map) for v in obj]
    return obj


def selbsttest():
    """Ohne bestandenen Selbsttest darf nichts umgeschrieben werden."""
    f = []
    # Fall 1: richtige Antwort wandert von Platz 1 (Index 0) auf Platz 3.
    # opt = [R, A, B] -> rest = [A, B] -> neu = [A, B, R]
    # also alt 1->3, alt 2->1, alt 3->2
    m = {1: 3, 2: 1, 3: 2}
    proben = [
        ("Die zweite Option ist falsch.", "Die erste Option ist falsch.", m, {}),
        ("in der dritten Option steht",   "in der zweiten Option steht",  m, {}),
        ("Option 1 und Option 2",         "Option 3 und Option 1",        m, {}),
        # simultan: 1->3 darf nicht anschliessend als 3->2 noch einmal wandern
        ("Option 1", "Option 3", m, {}),
        # Vermutungen kippen unabhaengig von den Optionen
        ("die erste Vermutung",  "die zweite Vermutung", m, {1: 2, 2: 1}),
        ("Vermutung 2 zeigt",    "Vermutung 1 zeigt",    m, {1: 2, 2: 1}),
        # Zahlen, die nur zufaellig so aussehen, bleiben unangetastet
        ("die Antwort 1200 J",   "die Antwort 1200 J",   m, {}),
        # ohne Umsortierung aendert sich nichts
        ("Die zweite Option",    "Die zweite Option",    {}, {}),
    ]
    for text, soll, om, pm in proben:
        ist = _ziehe_mit(text, om, pm)
        if ist != soll:
            f.append(f"„{text}“ → „{ist}“, erwartet „{soll}“")
    return f, len(proben)


def main():
    probe = "--probe" in sys.argv
    # Kein Umschreiben ohne bestandenen Selbsttest - das Werkzeug aendert seit
    # dem 05.09.2026 nicht nur Reihenfolgen, sondern auch Lehrertexte.
    f, n_proben = selbsttest()
    if f:
        print("SELBSTTEST NICHT BESTANDEN - es wird nichts umgestellt:")
        for z in f: print("  x", z)
        raise SystemExit(2)
    print(f"Selbsttest bestanden ({n_proben} Proben).")
    geaendert = warnungen = 0
    for kap in plan.KAPITEL:
        ids = [t["id"] for t in kap["themen"]]
        print(f"{kap['id']}: {len(ids)} Einheiten")
        for n, eid in enumerate(ids):
            p = os.path.join(HERE, "einheiten", eid + ".json")
            if not os.path.exists(p): continue
            d = json.load(open(p, encoding="utf-8"))
            s, l = d["seite"], d["lehrer"]

            pred_map, opt_map = {}, {}

            ziel_p = n % 2                       # Vermutung: abwechselnd
            if s["predictOk"] != ziel_p:
                s["predict"] = list(reversed(s["predict"]))
                s["predictOk"] = ziel_p
                pred_map = {1: 2, 2: 1}
                geaendert += 1

            a1 = s["aufgaben"][0]
            ziel_a = n % 3                       # Aufgabe 1: reihum
            if a1["richtig"] != ziel_a:
                opt = a1["optionen"]; r = a1["richtig"]
                rest_i = [i for i in range(len(opt)) if i != r]
                neu = [opt[i] for i in rest_i[:ziel_a]] + [opt[r]] + [opt[i] for i in rest_i[ziel_a:]]
                # Abbildung alt->neu (1-basiert), damit die Begruendungen im
                # Lehrerteil auf dieselbe Antwort zeigen wie vorher.
                opt_map = {r + 1: ziel_a + 1}
                for j, i_alt in enumerate(rest_i):
                    opt_map[i_alt + 1] = (j if j < ziel_a else j + 1) + 1
                a1["optionen"] = neu; a1["richtig"] = ziel_a
                l["a1"]["richtig"] = ziel_a
                geaendert += 1

            # Positionsangaben im Lehrerteil mitziehen. Die Schuelerseite bleibt
            # unangetastet - dort darf ohnehin keine Position stehen.
            if pred_map or opt_map:
                d["lehrer"] = l = _wandle(l, opt_map, pred_map)

            # Gewarnt wird nur noch vor Formen, die das Mitziehen NICHT kennt.
            for t in _texte(d):
                for w, rx in _POS_RE:
                    if w[0].islower() and w.split()[0] in ("erste", "zweite", "dritte",
                                                           "ersten", "zweiten", "dritten"):
                        continue                 # wird mitgezogen
                    if w.split()[0] in ("Option", "Antwort", "Vermutung") and w[-1].isdigit():
                        continue                 # wird mitgezogen
                    if rx.search(t):
                        print(f"   ! {eid}: Text nennt eine Position („{w}“) – von Hand pruefen")
                        warnungen += 1

            print(f"   {eid:5} predictOk={s['predictOk']}  a1.richtig={a1['richtig']}")
            if not probe:
                json.dump(d, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n{geaendert} Positionen umgestellt"
          + (" (PROBE - nichts geschrieben)" if probe else "")
          + (f" · {warnungen} Warnungen" if warnungen else ""))


if __name__ == "__main__":
    main()
