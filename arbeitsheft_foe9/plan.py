# -*- coding: utf-8 -*-
"""Bauplan FELO Förderheft 9 · Gesamtschule NRW.

Dritter Band der Förderreihe (nach arbeitsheft_foe7 und _foe8). Gleiche
fachliche Ziele wie das Regelheft arbeitsheft_gts9, leichterer Lernweg
(A2-B1, Förderbedarf Lernen, DaZ). Formregeln in
../arbeitsheft_foe7/FOERDER_PROFIL.md, Herleitung in SEITENPLAN.md und
analyse_schritt1.json.

STATUS: Seitenplan am 05.09.2026 von Abdullah FREIGEGEBEN - ebenso die
schiefe Ebene als eine zusammengelegte Doppelseite, die Zählregel 5
(Alltagswörter) und das verbindliche Wortbudget von 380 Wörtern.

Zwei Zusammenlegungen gegenüber dem Regelheft:
    fe9  = el9+el10  (Träger el10, Flaschenzug; feste Rolle wird
                      Anwendungsabschnitt mit Bild, ohne eigene Aufgabe)
    fe11 = el12+el13 (beide benutzen dieselbe Simulation schiefe-ebene)

Kennungen fk/fe sind gegen alle 48 vergebenen Präfixe geprüft (05.09.2026).
Die QR-Ziele sind DIESELBEN Simulationen wie im Regelheft.
"""

KLASSE = 9
SCHULFORM = "Gesamtschule NRW"
AUSGABE = "Förderheft"
KURSE = False          # das Förderheft bedient den G-Kurs, keine E-Kurs-Abzeichen
# Regelheft, aus dem dieser Band abgeleitet ist.
QUELLBAND = "arbeitsheft_gts9"

RAHMEN = ("Nour und Jannis sind vierzehn. Die Schule baut auf dem Hof eine Bühne für das "
          "Sommerfest - Podeste, Traversen, ein Klavier aus dem Musikraum muss hoch. "
          "Herr Kessler von der Hausmeisterei lässt die beiden mitarbeiten.")

KAPITEL = [
    {
        "id": "foe_kraefte",
        "acc": (188, 74, 44),          # Kapitelfarbe gts_kraefte aus dem Regelheft
        "titel": "Kräfte auf der Bühne",
        "inhaltsfeld": "Bewegungen und ihre Ursachen (8), zweiter Teil",
        "themen": [
            {"id": "fk1",  "quelle": ["kf1"],  "name": "Woran erkennt man eine Kraft?",        "sim": "kraft-wirkung"},
            {"id": "fk2",  "quelle": ["kf2"],  "name": "Wie misst man eine Kraft?",            "sim": "kraftmesser"},
            {"id": "fk3",  "quelle": ["kf3"],  "name": "Warum gibt eine Feder nach?",          "sim": "federgesetz"},
            {"id": "fk4",  "quelle": ["kf4"],  "name": "Masse oder Gewichtskraft?",            "sim": "masse-gewicht"},
            {"id": "fk5",  "quelle": ["kf5"],  "name": "Wäre das Klavier auf dem Mond leichter?", "sim": "ortsfaktor"},
            {"id": "fk6",  "quelle": ["kf6"],  "name": "Wie zeichnet man eine Kraft auf?",     "sim": "kraftpfeil"},
            {"id": "fk7",  "quelle": ["kf7"],  "name": "Was passiert, wenn zwei ziehen?",      "sim": "kraefte-addieren"},
            {"id": "fk8",  "quelle": ["kf8"],  "name": "Wann bewegt sich trotz Kraft nichts?", "sim": "kraefte-gleichgewicht"},
            {"id": "fk9",  "quelle": ["kf9"],  "name": "Warum rutscht die Kiste weiter?",      "sim": "traegheit-rs"},
            {"id": "fk10", "quelle": ["kf10"], "name": "Warum rollt das Rollbrett zurück?",    "sim": "wechselwirkung"},
            {"id": "fk11", "quelle": ["kf11"], "name": "Warum sinkt der schmale Fuß ein?",     "sim": "druck-flaeche"},
            {"id": "fk12", "quelle": ["kf12"], "name": "Warum drückt Wasser in der Tiefe mehr?", "sim": "schweredruck"},
            {"id": "fk13", "quelle": ["kf13"], "name": "Warum sind gleich große Würfel verschieden schwer?", "sim": "dichte"},
            {"id": "fk14", "quelle": ["kf14"], "name": "Warum schwimmt ein Schiff aus Eisen?", "sim": "auftrieb"},
        ],
    },
    {
        "id": "foe_energie",
        "acc": (30, 122, 116),         # Kapitelfarbe gts_energie aus dem Regelheft
        "titel": "Arbeit, Energie und Maschinen",
        "inhaltsfeld": "Energie, Leistung, Wirkungsgrad (9)",
        "themen": [
            {"id": "fe1",  "quelle": ["el1"],          "name": "Wann wird Arbeit verrichtet?",      "sim": "arbeit"},
            {"id": "fe2",  "quelle": ["el2"],          "name": "Wo steckt die Energie oben?",       "sim": "lageenergie"},
            {"id": "fe3",  "quelle": ["el3"],          "name": "Wo steckt die Energie beim Rollen?", "sim": "bewegungsenergie"},
            {"id": "fe4",  "quelle": ["el4"],          "name": "Was passiert beim Fallen?",         "sim": "energieerhaltung"},
            {"id": "fe5",  "quelle": ["el5"],          "name": "Warum wird alles am Ende warm?",    "sim": "energie-entwerten"},
            {"id": "fe6",  "quelle": ["el6"],          "name": "Was ist Leistung?",                 "sim": "leistung-rs"},
            {"id": "fe7",  "quelle": ["el7"],          "name": "Wie viel Energie kommt an?",        "sim": "wirkungsgrad"},
            {"id": "fe8",  "quelle": ["el8"],          "name": "Warum hilft eine lange Stange?",    "sim": "hebel"},
            {"id": "fe9",  "quelle": ["el9", "el10"],  "name": "Was bringen Rollen und Seile?",     "sim": "flaschenzug"},
            {"id": "fe10", "quelle": ["el11"],         "name": "Warum dreht sich das kleine Rad schneller?", "sim": "zahnrad"},
            {"id": "fe11", "quelle": ["el12", "el13"], "name": "Was spart die Rampe?",              "sim": "schiefe-ebene"},
        ],
    },
]

FERTIG = []
ALLE_KAPITEL = KAPITEL
THEMEN = [th for k in KAPITEL for th in k["themen"]]
SIM = {th["id"]: th["sim"] for th in THEMEN if th.get("sim")}
QUELLE = {th["id"]: th["quelle"] for th in THEMEN}
AM_BILDSCHIRM = {th["id"] for th in THEMEN if th.get("sim")}
