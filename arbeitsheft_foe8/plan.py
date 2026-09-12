# -*- coding: utf-8 -*-
"""Bauplan FELO Förderheft 8 · Gesamtschule NRW.

Zweiter Band der Förderreihe (nach arbeitsheft_foe7). Gleiche fachliche Ziele
wie das Regelheft arbeitsheft_gts8, leichterer Lernweg (A2-B1, Förderbedarf
Lernen, DaZ). Formregeln in ../arbeitsheft_foe7/FOERDER_PROFIL.md, Herleitung
in SEITENPLAN.md und analyse_schritt1.json.

STATUS: Seitenplan am 05.09.2026 von Abdullah FREIGEGEBEN, ebenso die dritte
Zusammenlegung (fb4) und die Fachwort-Zählregel.

Drei Zusammenlegungen gegenüber dem Regelheft:
    fs13 = st13+st14 (Träger st14, Sicherung)
    fb2  = be2+be3   (beide trugen dieselbe Merksatz-Lücke v = s / t)
    fb4  = be5+be7   (ein Lernziel über die Abstände der Sekunden-Marken)

Kennungen fs/fb sind gegen alle 46 vergebenen Präfixe geprüft (05.09.2026).
Die QR-Ziele sind DIESELBEN Simulationen wie im Regelheft; eigene
Brücken-Einträge kommen mit dem Buch-Build.
"""

KLASSE = 8
SCHULFORM = "Gesamtschule NRW"
AUSGABE = "Förderheft"
KURSE = False
# Regelheft, aus dem dieser Band abgeleitet ist. build_pilot.py holt daher die
# Einstiegsbilder und - solange eigene fs/fb-Codes fehlen - die QR-Codes.
QUELLBAND = "arbeitsheft_gts8"

RAHMEN = ("Nour und Jannis sind ein Jahr älter. Die Schule richtet einen Raum für die "
          "Fahrrad-AG ein: alte Räder werden wieder flott gemacht, und im Nebenraum steht "
          "eine Werkbank mit Netzteil, Kabeln und einer Kiste voller Bauteile.")

KAPITEL = [
    {
        "id": "foe_strom",
        "acc": (46, 92, 178),          # Kapitelfarbe gts_strom aus dem Regelheft
        "titel": "Strom in der Werkstatt",
        "inhaltsfeld": "Stromkreise (7)",
        "themen": [
            {"id": "fs1",  "quelle": ["st1"],          "name": "Wie wirken Ladungen aufeinander?",       "sim": "ladung"},
            {"id": "fs2",  "quelle": ["st2"],          "name": "Was macht die Kraft größer?",            "sim": "ladungen-kraft"},
            {"id": "fs3",  "quelle": ["st3"],          "name": "Was sagt die Zahl mit dem V?",           "sim": "spannung"},
            {"id": "fs4",  "quelle": ["st4"],          "name": "Wie viel Strom fließt?",                 "sim": "stromstaerke"},
            {"id": "fs5",  "quelle": ["st5"],          "name": "Wohin kommt das Messgerät?",             "sim": "messen"},
            {"id": "fs6",  "quelle": ["st6"],          "name": "Was bremst den Strom?",                  "sim": "widerstand"},
            {"id": "fs7",  "quelle": ["st7"],          "name": "Wovon hängt der Widerstand ab?",         "sim": "draht"},
            {"id": "fs8",  "quelle": ["st8"],          "name": "Was macht doppelte Spannung?",           "sim": "ohm-kennlinie"},
            {"id": "fs9",  "quelle": ["st9"],          "name": "Was passiert hintereinander?",           "sim": "reihe-widerstand"},
            {"id": "fs10", "quelle": ["st10"],         "name": "Was passiert nebeneinander?",            "sim": "parallel-widerstand"},
            {"id": "fs11", "quelle": ["st11"],         "name": "Warum geht das Licht sofort an?",        "sim": "elektronen-drift"},
            {"id": "fs12", "quelle": ["st12"],         "name": "Warum kommt der Donner später?",         "sim": "blitz"},
            {"id": "fs13", "quelle": ["st13", "st14"], "name": "Wann schaltet die Sicherung ab?",        "sim": "stromgefahren"},
        ],
    },
    {
        "id": "foe_bewegung",
        "acc": (150, 60, 120),         # Kapitelfarbe gts_bewegung aus dem Regelheft
        "titel": "Wie schnell ist schnell?",
        "inhaltsfeld": "Bewegungen und ihre Ursachen (8), erster Teil",
        "themen": [
            {"id": "fb1", "quelle": ["be1"],        "name": "Wer ist schneller?",                  "sim": "v-begriff"},
            {"id": "fb2", "quelle": ["be2", "be3"], "name": "Wie misst und rechnet man das Tempo?", "sim": "v-messen"},
            {"id": "fb3", "quelle": ["be4"],        "name": "km/h oder m/s?",                      "sim": "v-umrechnung"},
            {"id": "fb4", "quelle": ["be5", "be7"], "name": "Was sagen die Abstände?",             "sim": "gleichfoermig-rs"},
            {"id": "fb5", "quelle": ["be6"],        "name": "Was verrät die Linie im Weg-Zeit-Bild?", "sim": "weg-zeit-diagramm"},
            {"id": "fb6", "quelle": ["be8"],        "name": "Was verrät die Linie im Tempo-Bild?", "sim": "v-zeit-diagramm"},
            {"id": "fb7", "quelle": ["be9"],        "name": "Wie weit fährt ein Auto bis zum Halt?", "sim": "bremsweg-jg9"},
        ],
    },
]

FERTIG = []
ALLE_KAPITEL = KAPITEL
THEMEN = [th for k in KAPITEL for th in k["themen"]]
SIM = {th["id"]: th["sim"] for th in THEMEN if th.get("sim")}
QUELLE = {th["id"]: th["quelle"] for th in THEMEN}
AM_BILDSCHIRM = {th["id"] for th in THEMEN if th.get("sim")}
