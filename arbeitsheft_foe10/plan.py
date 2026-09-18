# -*- coding: utf-8 -*-
"""Bauplan FeLabs Förderheft 10 · Gesamtschule NRW.

Vierter und letzter Band der Förderreihe (nach _foe7, _foe8, _foe9). Gleiche
fachliche Ziele wie das Regelheft arbeitsheft_gts10, leichterer Lernweg
(A2-B1, Förderbedarf Lernen, DaZ). Formregeln in
../arbeitsheft_foe7/FOERDER_PROFIL.md, Herleitung in SEITENPLAN.md und
analyse_schritt1.json.

UMFANG: 32 Einheiten des Regelhefts -> 28. VIER Streichungen, NULL
Zusammenlegungen. Gestrichen sind genau die vier Einheiten, die
arbeitsheft_gts10/plan.py mit "kurs": "E" markiert: ev5, ev15, rk8, rk14.
Das Förderheft bedient den G-Kurs.

    Seiten  126 -> 65      (-48,4 %)
    Wörter  19 348 -> 10 640 (-45,0 %, 28 x 380)

Warum keine Zusammenlegung? Mit den vier vorgeschlagenen Paaren läge der Band
bei N=25, also -53,2 % auf Seiten - ausserhalb des 35-50-%-Korridors. N=28 ist
die erste Zahl, die beide Metriken mit Reserve hält. Band 10 erreicht seinen
Korridor als einziger Band allein über Streichungen; er ist auch der grösste.

Was aus den gestrichenen Einheiten erhalten bleibt:
    ev5  -> Alltagsauftrag wandert nach fv4 (Kern "Umpolen dreht die Kraft um"
            steht dort ohnehin schon)
    ev15 -> ersatzlos; stammt aus den Inhaltsfeldern 6 und 7
    rk8  -> Alpha- und Betazerfall werden in fn7 als Merkwissen genannt,
            ohne eigene Bildschirmaufgabe
    rk14 -> ACHTUNG REIHENFOLGE: fn12 führt BEIDE Fachwörter ein,
            Dosisleistung H' und Dosis H in Sievert

Drei Simulationen tragen je zwei Einheiten - jede mit eigenem Lernziel,
keine Zusammenlegung:
    freileitungen        fv9  (warum Hochspannung) / fv10 (der Weg zur Steckdose)
    geiger-mueller       fn2  (Zählrohr und Spannung) / fn5 (Impulshöhe 200/450 V)
    kettenreaktion       fn9  (Steuerstäbe und k)   / fn10 (Aufbau des Kraftwerks)
fn5 darf nicht wegfallen: E7 ("Modellgrenzen angeben") hängt allein dort.

VIER Datenblattseiten ohne Simulation und ohne QR-Code (fv11, fn11, fn13,
fn15). Abschnitt 3 heisst dort "AUSWERTEN & BEURTEILEN", Dreischritt
"ablesen - ordnen/vergleichen - beurteilen". fn15 trägt K4 als einzige
Einheit des Bandes, fn11 und fn15 tragen B3.

Kennungen fv/fn sind gegen alle vergebenen Präfixe geprüft (05.09.2026).
Die QR-Ziele sind DIESELBEN Simulationen wie im Regelheft.
"""

KLASSE = 10
SCHULFORM = "Gesamtschule NRW"
AUSGABE = "Förderheft"
KURSE = False          # das Förderheft bedient den G-Kurs, keine E-Kurs-Abzeichen
# Regelheft, aus dem dieser Band abgeleitet ist.
QUELLBAND = "arbeitsheft_gts10"

RAHMEN = ("Nour und Jannis sind fünfzehn. Beide machen zwei Wochen Praktikum: "
          "Jannis bei den Stadtwerken, Nour in der Nuklearmedizin im Krankenhaus. "
          "Abends erzählen sie sich, was sie gesehen haben.")

KAPITEL = [
    {
        "id": "foe_versorgung",
        "acc": (192, 138, 30),         # Kapitelfarbe gts_versorgung aus dem Regelheft
        "titel": "Woher der Strom kommt",
        "inhaltsfeld": "Elektrische Energieversorgung (10)",
        "themen": [
            {"id": "fv1",  "quelle": ["ev1"],         "name": "Wo ist ein Magnet am stärksten?",         "sim": "magnetfeld"},
            {"id": "fv2",  "quelle": ["ev2"],         "name": "Kann Strom eine Kompassnadel bewegen?",   "sim": "oersted"},
            {"id": "fv3",  "quelle": ["ev3"],         "name": "Wie baut man einen Magneten zum Anschalten?", "sim": "elektromagnet"},
            {"id": "fv4",  "quelle": ["ev4", "ev5"],  "name": "Warum bewegt sich ein Draht im Magnetfeld?", "sim": "leiterkraft"},
            {"id": "fv5",  "quelle": ["ev6"],         "name": "Wie wird aus der Kraft eine Drehung?",    "sim": "elektromotor"},
            {"id": "fv6",  "quelle": ["ev7"],         "name": "Wie entsteht Spannung ohne Batterie?",    "sim": "induktion-rs"},
            {"id": "fv7",  "quelle": ["ev8"],         "name": "Wie macht ein Generator Strom?",          "sim": "generator"},
            {"id": "fv8",  "quelle": ["ev9"],         "name": "Wie ändert ein Transformator die Spannung?", "sim": "transformator-schluessel"},
            # Nicht "Warum faehrt der Strom mit Hochspannung?": Uebertragen wird
            # die ENERGIE, und der Strom ist bei Hochspannung gerade klein - genau
            # das sagt der Merksatz der Seite. "Fahren" stuetzt ausserdem das Bild
            # vom Strom als Fahrzeug, das durch die Leitung reist.
            {"id": "fv9",  "quelle": ["ev10"],        "name": "Warum ist der Verlust mit Hochspannung klein?", "sim": "freileitungen"},
            {"id": "fv10", "quelle": ["ev11"],        "name": "Wie kommt der Strom zur Steckdose?",      "sim": "freileitungen"},
            {"id": "fv11", "quelle": ["ev12"],        "name": "Welche Kraftwerke liefern unseren Strom?", "sim": None},
            {"id": "fv12", "quelle": ["ev13"],        "name": "Wie viel Energie kommt beim Kunden an?",  "sim": "wirkungsgrad"},
            {"id": "fv13", "quelle": ["ev14"],        "name": "Was kostet ein Gerät im Jahr?",           "sim": "stromkosten"},
        ],
    },
    {
        "id": "foe_kern",
        "acc": (150, 60, 60),          # Kapitelfarbe gts_kern aus dem Regelheft
        "titel": "Aus dem Atomkern",
        "inhaltsfeld": "Radioaktivität und Kernenergie (11)",
        "themen": [
            {"id": "fn1",  "quelle": ["rk1"],         "name": "Woraus besteht ein Atomkern?",            "sim": "atombau-isotope"},
            {"id": "fn2",  "quelle": ["rk2"],         "name": "Was ist radioaktive Strahlung?",          "sim": "geiger-mueller"},
            {"id": "fn3",  "quelle": ["rk3"],         "name": "Welche Strahlung kommt wie weit?",        "sim": "absorption-strahlung"},
            {"id": "fn4",  "quelle": ["rk4"],         "name": "Warum ist die Strahlung gefährlich?",     "sim": "ionisation"},
            {"id": "fn5",  "quelle": ["rk5"],         "name": "Wie weist man Strahlung nach?",           "sim": "geiger-mueller"},
            {"id": "fn6",  "quelle": ["rk6"],         "name": "Wann ist die Hälfte zerfallen?",          "sim": "zerfall-halbwertszeit"},
            {"id": "fn7",  "quelle": ["rk7", "rk8"],  "name": "Wie alt ist der Fund?",                   "sim": "zerfall-halbwertszeit"},
            {"id": "fn8",  "quelle": ["rk9"],         "name": "Was passiert bei einer Kernspaltung?",    "sim": "kernspaltung"},
            {"id": "fn9",  "quelle": ["rk10"],        "name": "Wie hält man eine Kettenreaktion in Schach?", "sim": "kettenreaktion"},
            {"id": "fn10", "quelle": ["rk11"],        "name": "Wie ist ein Kernkraftwerk aufgebaut?",    "sim": "kettenreaktion"},
            {"id": "fn11", "quelle": ["rk12"],        "name": "Wohin mit dem, was übrig bleibt?",        "sim": None},
            {"id": "fn12", "quelle": ["rk13", "rk14"], "name": "Wie schützt man sich vor Strahlung?",    "sim": "strahlenschutz"},
            {"id": "fn13", "quelle": ["rk15"],        "name": "Wie hilft Strahlung in der Medizin?",     "sim": None},
            {"id": "fn14", "quelle": ["rk16"],        "name": "Woher nimmt die Sonne ihre Energie?",     "sim": "kernfusion"},
            {"id": "fn15", "quelle": ["rk17"],        "name": "Kernenergie: Wie stehst du dazu?",        "sim": None},
        ],
    },
]

FERTIG = []
ALLE_KAPITEL = KAPITEL
THEMEN = [th for k in KAPITEL for th in k["themen"]]
SIM = {th["id"]: th["sim"] for th in THEMEN if th.get("sim")}
QUELLE = {th["id"]: th["quelle"] for th in THEMEN}
AM_BILDSCHIRM = {th["id"] for th in THEMEN if th.get("sim")}
# Einheiten ohne Simulation: Abschnitt 3 ist ein gedrucktes Datenblatt.
DATENBLATT = {th["id"] for th in THEMEN if not th.get("sim")}
