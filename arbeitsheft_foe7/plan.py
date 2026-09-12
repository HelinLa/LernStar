# -*- coding: utf-8 -*-
"""Bauplan FELO Förderheft 7 · Gesamtschule NRW.

Zweites Produkt neben dem Regelheft (arbeitsheft_gts7): gleiche fachliche
Ziele, gleiche Simulationen, leichterer Lernweg (A2-B1, Förderbedarf Lernen,
DaZ). Formregeln in FOERDER_PROFIL.md, Herleitung in SEITENPLAN.md und
analyse_schritt1.json.

STATUS: Seitenplan am 04.09.2026 von Abdullah FREIGEGEBEN (ebenso Pilotformat
fo10 und der getrennte Lehrerband). Die Einheiten werden ausformuliert.

Vier Zusammenlegungen gegenüber dem Regelheft, je mit EINER Simulation:
    fo2 = oi2+oi3 (Träger oi3), fo4 = oi5+oi6 (Träger oi5),
    fo6 = oi8+oi9 (Träger oi8), fw3 = ew3+ew4 (Träger ew3).

Kennungen fo/fw sind gegen alle vergebenen Präfixe geprüft (04.09.2026).
Die QR-Ziele sind DIESELBEN Simulationen wie im Regelheft; eigene
Brücken-Einträge kommen erst mit dem Buch-Build.
"""

KLASSE = 7
SCHULFORM = "Gesamtschule NRW"
AUSGABE = "Förderheft"
KURSE = False
# Regelheft, aus dem dieser Band abgeleitet ist. build_pilot.py holt daher die
# Einstiegsbilder und - solange eigene fo/fw-Codes fehlen - die QR-Codes.
QUELLBAND = "arbeitsheft_gts7"

RAHMEN = ("Nour und Jannis sind zwölf und gehen in die 7. Der Physikraum der Schule "
          "hat einen alten Sammlungsschrank, den seit Jahren niemand aufgeräumt hat. "
          "Frau Demir gibt den beiden den Schlüssel: Was brauchbar ist, kommt zurück "
          "in den Unterricht.")

KAPITEL = [
    {
        "id": "foe_optik",
        "acc": (176, 106, 30),
        "titel": "Sehen, spiegeln, brechen",
        "inhaltsfeld": "Optische Instrumente (5)",
        "themen": [
            {"id": "fo1",  "quelle": ["oi1"],        "name": "Was macht eine Oberfläche mit Licht?",  "sim": "licht-oberflaeche"},
            {"id": "fo2",  "quelle": ["oi2", "oi3"], "name": "Wie wirft der Spiegel Licht zurück?",   "sim": "reflexionsgesetz"},
            {"id": "fo3",  "quelle": ["oi4"],        "name": "Warum knickt Licht im Glas?",           "sim": "brechung-eintritt"},
            {"id": "fo4",  "quelle": ["oi5", "oi6"], "name": "Wann kommt Licht nicht mehr heraus?",   "sim": "brechung-austritt"},
            {"id": "fo5",  "quelle": ["oi7"],        "name": "Welches Glas bündelt das Licht?",       "sim": "sammellinse"},
            {"id": "fo6",  "quelle": ["oi8", "oi9"], "name": "Wo entsteht das Bild der Linse?",       "sim": "bild-linse"},
            {"id": "fo7",  "quelle": ["oi10"],       "name": "Wie entsteht ein Bild im Auge?",        "sim": "auge"},
            {"id": "fo8",  "quelle": ["oi11"],       "name": "Wie hilft eine Brille?",                "sim": "brille"},
            {"id": "fo9",  "quelle": ["oi12"],       "name": "Wie macht die Lochkamera ein Bild?",    "sim": "lochkamera"},
            {"id": "fo10", "quelle": ["oi13"],       "name": "Woraus besteht weißes Licht?",          "sim": "prisma"},
            {"id": "fo11", "quelle": ["oi14"],       "name": "Wie macht der Bildschirm Farben?",      "sim": "farbmischung-additiv"},
            {"id": "fo12", "quelle": ["oi15"],       "name": "Welches Licht sehen wir nicht?",        "sim": "spektrum-unsichtbar"},
        ],
    },
    {
        "id": "foe_weltall",
        "acc": (44, 88, 180),
        "titel": "Der Blick ins Weltall",
        "inhaltsfeld": "Erde und Weltall (6)",
        "themen": [
            {"id": "fw1",  "quelle": ["ew1"],        "name": "Was leuchtet am Nachthimmel?",          "sim": "himmelskoerper"},
            {"id": "fw2",  "quelle": ["ew2"],        "name": "Warum wird es Tag und Nacht?",          "sim": "tag-nacht"},
            {"id": "fw3",  "quelle": ["ew3", "ew4"], "name": "Warum fällt alles nach unten?",         "sim": "gravitation"},
            {"id": "fw4",  "quelle": ["ew5"],        "name": "Warum stürzen Planeten nicht ab?",      "sim": "planetenbahn"},
            {"id": "fw5",  "quelle": ["ew6"],        "name": "Wie unterscheiden sich die Planeten?",  "sim": "sonnensystem"},
            {"id": "fw6",  "quelle": ["ew7"],        "name": "Wie groß ist das Sonnensystem?",        "sim": "entfernungen"},
            {"id": "fw7",  "quelle": ["ew8"],        "name": "Was macht das Fernrohr mit dem Bild?",  "sim": "teleskop"},
            {"id": "fw8",  "quelle": ["ew9"],        "name": "Wie weit ist ein Stern entfernt?",      "sim": "sternparallaxe"},
            {"id": "fw9",  "quelle": ["ew10"],       "name": "Wie lange leuchtet ein Stern?",         "sim": "sternleben"},
            {"id": "fw10", "quelle": ["ew11"],       "name": "Wo stehen wir in der Milchstraße?",     "sim": "milchstrasse"},
            {"id": "fw11", "quelle": ["ew12"],       "name": "Wer steht in der Mitte?",               "sim": "weltbild"},
            {"id": "fw12", "quelle": ["ew13"],       "name": "Wie findet man ein schwarzes Loch?",    "sim": "schwarzes-loch"},
            {"id": "fw13", "quelle": ["ew14"],       "name": "Wie hat sich das Weltall seit dem Urknall verändert?", "sim": "urknall"},
        ],
    },
]

FERTIG = []
ALLE_KAPITEL = KAPITEL
THEMEN = [th for k in KAPITEL for th in k["themen"]]
SIM = {th["id"]: th["sim"] for th in THEMEN if th.get("sim")}
QUELLE = {th["id"]: th["quelle"] for th in THEMEN}
AM_BILDSCHIRM = {th["id"] for th in THEMEN if th.get("sim")}
