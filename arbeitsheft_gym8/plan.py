# -*- coding: utf-8 -*-
"""Bauplan FeLabs PHYSIK 8 · Gymnasium NRW (G9).

Grundlage: Kernlehrplan Physik Gymnasium (Heft 3411, 2019), Kapitel 2.3:

    (7) Bewegung, Kraft und Energie
    (8) Druck und Auftrieb

Pflichtinhalte, die dieses Heft tragen muss (Auswertung Kap. 2.3): mittlere
und momentane Geschwindigkeit, Orts-Zeit-Diagramme, Beschleunigung,
Wechselwirkungsprinzip, vektorielle Kraefteaddition, Goldene Regel mit
Energieerhaltung begruendet, E = m*g*h als Rechnung, Leistung samt Vergleich
mit der Koerperleistung; Dichte, Schweredruck, Archimedisches Prinzip als
Rechnung, Luftdruck samt Nichtlinearitaet mit der Hoehe.

Neu zu bauende Simulation: luftdruck-hoehe (da4). Alle uebrigen existieren.

Kennungen me, da - kollisionsfrei gegen alle vergebenen.
"""

KLASSE = 8
SCHULFORM = "Gymnasium NRW"
KURSE = False

RAHMEN = ("Ela und Tom sind vierzehn und im Bühnenteam für das Schulfest. Eine Woche "
          "lang wird geschleppt, gerollt und gehoben: schwere Boxen, eine Rampe, ein "
          "Flaschenzug am Balken - und am Festtag soll auch noch das Wasserbecken für "
          "die Bootsregatta stehen. Der Hausmeister sagt: Wer versteht, was er tut, "
          "braucht nur die halbe Kraft.")

KAPITEL = [
    {
        "id": "gym_mechanik",
        "acc": (166, 60, 48),
        "titel": "Bewegung, Kraft und Energie",
        "inhaltsfeld": "Bewegung, Kraft und Energie (7)",
        "vorhaben": (
            "Rollwagen, Rampe, Flaschenzug: Bevor die schweren Kisten auf die "
            "Bühne dürfen, klären Ela und Tom, wie man Bewegungen misst, was "
            "Kräfte bewirken - und warum sich Arbeit nicht sparen lässt."),
        "themen": [
            {"id": "me1",  "name": "Wie beschreibt man eine Bewegung genau?",
             "sim": "bewegung-beschreiben"},
            {"id": "me2",  "name": "Wie misst man Geschwindigkeit?",
             "sim": "v-messen"},
            {"id": "me3",  "name": "Strecke geteilt durch Zeit - was sagt v aus?",
             "sim": "v-formel"},
            {"id": "me4",  "name": "Wie rechnet man km/h in m/s um?",
             "sim": "v-umrechnung"},
            {"id": "me5",  "name": "Was verrät das Weg-Zeit-Diagramm?",
             "sim": "weg-zeit-diagramm"},
            {"id": "me6",  "name": "Was ist Beschleunigung?",
             "sim": "beschleunigung"},
            {"id": "me7",  "name": "Woran erkennt man, dass eine Kraft wirkt?",
             "sim": "kraft-wirkungen"},
            {"id": "me8",  "name": "Ist schwer dasselbe wie viel Masse?",
             "sim": "masse-gewicht"},
            {"id": "me9",  "name": "Wäre die Kiste auf dem Mond leichter?",
             "sim": "ortsfaktor"},
            {"id": "me10", "name": "Wie zeichnet man eine Kraft?",
             "sim": "kraftpfeil"},
            {"id": "me11", "name": "Was passiert, wenn zwei Kräfte gleichzeitig ziehen?",
             "sim": "kraefte-addieren"},
            {"id": "me12", "name": "Wann heben sich Kräfte auf?",
             "sim": "kraefte-gleichgewicht"},
            {"id": "me13", "name": "Warum gibt es zu jeder Kraft eine Gegenkraft?",
             "sim": "wechselwirkung"},
            {"id": "me14", "name": "Wann stört Reibung - und wann rettet sie?",
             "sim": "reibung"},
            {"id": "me15", "name": "Wie hebelt man das Zehnfache?",
             "sim": "hebel"},
            {"id": "me16", "name": "Wie hebt ein Flaschenzug die schwere Box?",
             "sim": "flaschenzug"},
            {"id": "me17", "name": "Was spart die Rampe wirklich?",
             "sim": "schiefe-ebene"},
            {"id": "me18", "name": "Welche Formen hat Energie?",
             "sim": "energieformen"},
            {"id": "me19", "name": "Wie berechnet man Lageenergie?",
             "sim": "lageenergie"},
            {"id": "me20", "name": "Wohin geht die Energie beim Rollen und Federn?",
             "sim": "bewegungsenergie"},
            {"id": "me21", "name": "Geht Energie verloren?",
             "sim": "energieerhaltung"},
            {"id": "me22", "name": "Was sagt die Leistung über die Arbeit?",
             "sim": "leistung"},
        ],
    },
    {
        "id": "gym_druck",
        "acc": (31, 110, 150),
        "titel": "Druck und Auftrieb",
        "inhaltsfeld": "Druck und Auftrieb (8)",
        "vorhaben": (
            "Für die Bootsregatta im Wasserbecken zählt nur eine Frage: Warum "
            "schwimmt das eine Boot und das andere säuft ab? Auf dem Weg dorthin "
            "geraten Ela und Tom an Dichte, Druck und eine Luftsäule über ihren Köpfen."),
        "themen": [
            {"id": "da1", "name": "Warum ist Styropor leicht und Stahl schwer?",
             "sim": "dichte"},
            {"id": "da2", "name": "Warum trägt der Schnee den Ski, aber nicht den Stiefel?",
             "sim": "druck-flaeche"},
            {"id": "da3", "name": "Warum drückt das Wasser unten stärker?",
             "sim": "schweredruck"},
            {"id": "da4", "name": "Wie schwer ist die Luft über uns?",
             "sim": "luftdruck-hoehe"},
            {"id": "da5", "name": "Woher kommt der Auftrieb?",
             "sim": "auftrieb"},
            {"id": "da6", "name": "Steigen, schweben, sinken - was entscheidet?",
             "sim": "auftrieb"},
        ],
    },
]

FERTIG = []
ALLE_KAPITEL = KAPITEL
KAPITEL = [k for k in ALLE_KAPITEL if k["id"] in FERTIG] or ALLE_KAPITEL
THEMEN = [th for k in KAPITEL for th in k["themen"]]
AM_BILDSCHIRM = {th["id"] for th in THEMEN if th.get("sim") and not th.get("duenn")}
SIM = {th["id"]: th["sim"] for th in THEMEN if th.get("sim")}
VIDEO = {th["id"]: th["video"] for th in THEMEN if th.get("video")}
OHNE_SIM = [th["id"] for k in ALLE_KAPITEL for th in k["themen"] if not th.get("sim")]
DUENN = [th["id"] for k in ALLE_KAPITEL for th in k["themen"] if th.get("duenn")]
KAPITEL_VON = {th["id"]: k["id"] for k in ALLE_KAPITEL for th in k["themen"]}

if __name__ == "__main__":
    print(f"FeLabs PHYSIK {KLASSE} · {SCHULFORM}\n")
    for i, k in enumerate(ALLE_KAPITEL, 1):
        ohne = sum(1 for th in k["themen"] if not th.get("sim"))
        print(f"Kapitel {i} · {k['titel']}  [{k['inhaltsfeld']}]  "
              f"({len(k['themen'])} Themen · {ohne} ohne Simulation)")
        for j, th in enumerate(k["themen"], 1):
            z = "  " if th.get("sim") else " !"
            print(f"  {z} {j:2d}. [{th['id']:5s}] {th['name'][:56]:56s} {th.get('sim') or '— ohne Sim'}")
        print()
    ges = sum(len(k["themen"]) for k in ALLE_KAPITEL)
    print(f"{ges} Themen · {ges-len(OHNE_SIM)} mit Simulation · {len(OHNE_SIM)} ohne")
