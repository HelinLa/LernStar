# -*- coding: utf-8 -*-
"""Bauplan FELO PHYSIK · Einführungsphase · Gymnasiale Oberstufe NRW.

Grundlage: Kernlehrplan Physik Sekundarstufe II, Gymnasium/Gesamtschule NRW,
Heft 4721 (RdErl. v. 31.05.2022, in Kraft zum 1. August 2022). Vollstaendig
gelesen; Volltext und Auswertung in LernStar/kernlehrplan/. Herleitung des
Zuschnitts in SEITENPLAN.md.

    Inhaltsfeld 1  Grundlagen der Mechanik
    Inhaltsfeld 2  Kreisbewegung, Gravitation und physikalische Weltbilder

DREI UNTERSCHIEDE ZUR SEKUNDARSTUFE I, die beim Kopieren regelmaessig
uebersehen werden:

1. EIN BAND FUER BEIDE SCHULFORMEN. Gymnasium und Gesamtschule teilen sich in
   der Oberstufe denselben Kernlehrplan.
2. ANDERE KOMPETENZCODES. S1-S7 / E1-E11 / K1-K10 / B1-B8 statt UF/E/K/B der
   Sek I. Modul: arbeitsheft/kompetenzen_gost.py (NICHT kompetenzen.py).
   kompetenzen_gost.pruefe() meldet versehentlich uebernommene Sek-I-Codes.
3. ANDERE BASISKONZEPTE. Erhaltung und Gleichgewicht / Superposition und
   Komponenten / Mathematisieren und Vorhersagen / Zufall und Determiniertheit.
   Modul: arbeitsheft/lehrplan_gost.py. ACHTUNG: Inhaltsfeld 2 nennt nur ZWEI
   davon - die Kapitelkopfzeile darf dort nicht alle vier fuehren.

KEINE KURSDIFFERENZIERUNG: Die Einfuehrungsphase ist einheitlich, Grund- und
Leistungskurs trennen sich erst in der Qualifikationsphase (KLP Kap. 2.3).

VIER NEU ZU BAUENDE SIMULATIONEN. Der bisher aufwendigste Band brauchte eine.
Jede der vier traegt einen obligatorischen Inhalt, fuer den der Bestand
nachweislich nichts hergibt (gemessen an 32 Faktendumps, 07.09.2026):
    wurf-waagerecht  - wurfbewegung hat wfAlpha min=10, kann 0 Grad nicht
    wechselwirkung-ef - fuer das 3. Newton'sche Gesetz gibt es keinen
                        QUANTITATIVEN Traeger. Achtung: 'wechselwirkung' und das
                        Praefix _wwk sind SCHON VERGEBEN (qualitative Sek-I-Sim,
                        Klasse 9, ohne Regler, ohne Kraft in Newton). Die neue
                        Sim heisst deshalb 'wechselwirkung-ef', Praefix _wwkf.
    spannenergie     - federgesetz zeigt nur das Kraftgesetz, keine Energie
    zentripetalkraft - kreisbewegung fehlen 4 der 7 Lehrplangroessen

FUENF DATENBLATTSEITEN ohne Simulation (ki7, gw6, gw7, gw9, gw11). Der Plan
verlangt dort Deutung und Beurteilung, nicht Messung - ein gedrucktes Blatt ist
die passende Form, nicht der Notbehelf. gw9 ersetzt die Simulation 'kepler', die
91 von 91 leeren Statuszeilen liefert; gw11 traegt die beiden
Bewertungserwartungen zur Quellenkritik, die keine Simulation zeigen kann.

Kennungen ki, gw - kollisionsfrei gegen alle 51 vergebenen Praefixe geprueft.
"""

KLASSE = 11
SCHULFORM = "Gymnasiale Oberstufe NRW"
STUFE = "EF"                # Einfuehrungsphase
KURSE = False               # GK/LK erst ab der Qualifikationsphase
LEHRPLAN = "gost"           # waehlt lehrplan_gost.py und kompetenzen_gost.py

RAHMEN = ("Mira und Tobias sind in der Einführungsphase und haben sich für den "
          "Wettbewerb 'Jugend forscht' angemeldet. Ihr Thema: Bewegungen messen, "
          "die man mit bloßem Auge nicht mehr auseinanderhalten kann. Was als "
          "Wagen auf einer Schiene beginnt, führt sie bis zu der Frage, ob zwei "
          "Uhren überhaupt dieselbe Zeit anzeigen können.")

KAPITEL = [
    {
        "id": "ef_mechanik",
        "acc": (30, 90, 160),
        "titel": "Grundlagen der Mechanik",
        "inhaltsfeld": "Grundlagen der Mechanik (1)",
        "vorhaben": (
            "Mira und Tobias bauen ihre Messstrecke auf: Lichtschranken, ein Wagen, "
            "später eine Feder und zwei zusammenstoßende Schlitten. Sie lernen, dass "
            "eine Messung erst dann etwas wert ist, wenn man ihre Unsicherheit kennt."),
        "themen": [
            {"id": "ki1",  "name": "Wie schnell läuft sie wirklich?",                             "sim": "gleichfoermig"},
            {"id": "ki3",  "name": "Wie schnell wird der Wagen schneller?",                       "sim": "beschleunigung-ef"},
            {"id": "ki4",  "name": "Warum trägt man t² auf?",                                     "sim": "beschleunigung-ef"},
            {"id": "ki5",  "name": "Zwei Wege zum Ortsfaktor – warum kommt nicht dasselbe heraus?", "sim": "freierfall"},
            {"id": "ki6",  "name": "Warum trifft die geworfene Kugel gleichzeitig auf?",          "sim": "wurf-waagerecht"},
            {"id": "ki7",  "name": "Eine Kraft, zwei Richtungen",                                 "sim": None},
            {"id": "ki8",  "name": "Was macht ein Körper, wenn keine Kraft mehr zieht?",          "sim": "traegheit"},
            {"id": "ki9",  "name": "Wovon hängt die Beschleunigung ab?",                          "sim": "newton2"},
            {"id": "ki10", "name": "Warum hängt die Lampe still, obwohl an ihr gezogen wird?",    "sim": "kraefte-gleichgewicht"},
            {"id": "ki11", "name": "Warum drückt die Wand zurück?",                               "sim": "wechselwirkung-ef"},
            {"id": "ki12", "name": "Wie viel Kraft bleibt zum Beschleunigen übrig?",              "sim": "reibung"},
            {"id": "ki13", "name": "Wann wird wirklich Arbeit verrichtet?",                       "sim": "arbeit"},
            {"id": "ki14", "name": "Warum zählt das Tempo doppelt?",                              "sim": "bewegungsenergie"},
            {"id": "ki15", "name": "Die gespannte Feder – wo steckt die Energie?",                "sim": "spannenergie"},
            {"id": "ki16", "name": "Bleibt die Summe gleich, wenn zwei zusammenstoßen?",          "sim": "impuls"},
        ],
    },
    {
        "id": "ef_gravitation",
        "acc": (120, 70, 150),
        "titel": "Kreisbewegung, Gravitation und Weltbilder",
        "inhaltsfeld": "Kreisbewegung, Gravitation und physikalische Weltbilder (2)",
        "vorhaben": (
            "Vom Kettenkarussell zur Planetenbahn: Dieselbe Kraft, die einen Körper "
            "auf der Kreisbahn hält, hält auch die Erde bei der Sonne. Am Ende steht "
            "die Frage, die das klassische Weltbild gesprengt hat - ob die Zeit für "
            "alle gleich schnell vergeht."),
        "themen": [
            {"id": "gw1",  "name": "Wie schnell ist ein Punkt auf der Kreisbahn?",                "sim": "kreisbewegung"},
            {"id": "gw2",  "name": "Was hält den Körper auf der Kreisbahn?",                      "sim": "zentripetalkraft"},
            {"id": "gw3",  "name": "Was sagt eine Messreihe über die Zentripetalkraft?",          "sim": "zentripetalkraft"},
            {"id": "gw4",  "name": "Mehr Masse oder weniger Abstand – was wirkt stärker?",        "sim": "gravitation-abstand"},
            {"id": "gw5",  "name": "Warum wiegt derselbe Mensch auf dem Mond weniger?",           "sim": "ortsfaktor"},
            {"id": "gw6",  "name": "Was ist ein Feld?",                                           "sim": None},
            {"id": "gw7",  "name": "Wie wiegt man die Erde?",                                     "sim": None},
            {"id": "gw8",  "name": "Warum fällt die Erde nicht in die Sonne?",                    "sim": "planetenbahn"},
            {"id": "gw9",  "name": "Was verrät die Umlaufzeit über den Bahnradius?",              "sim": None},
            {"id": "gw10", "name": "Warum läuft der Mars manchmal rückwärts?",                    "sim": "weltbild"},
            {"id": "gw11", "name": "Wem glaubt man ein Weltbild?",                                "sim": None},
            {"id": "gw12", "name": "Warum geht die bewegte Uhr langsamer?",                       "sim": "lichtuhr"},
        ],
    },
]

# Simulationen, die es noch nicht gibt und die dieser Band mitbringt.
NEUBAU = ("wurf-waagerecht", "wechselwirkung-ef", "spannenergie", "zentripetalkraft")

FERTIG = []
ALLE_KAPITEL = KAPITEL
THEMEN = [th for k in KAPITEL for th in k["themen"]]
# Welche Einheit gehoert zu welchem Kapitel? uebernehmen.py braucht das fuer
# formregeln.pruefe_verteilung - und hat es hier GEFEHLT: Das Skript, das die
# Formregeln prueft, BEVOR content/forscherseiten.json geschrieben wird, lief
# fuer diesen Band deshalb in einen AttributeError. Die dreizehn Baende der
# Sekundarstufe I fuehren es laengst (plan.py, letzte Zeile).
KAPITEL_VON = {th["id"]: k["id"] for k in KAPITEL for th in k["themen"]}
SIM = {th["id"]: th["sim"] for th in THEMEN if th.get("sim")}
QUELLE = {}
AM_BILDSCHIRM = {th["id"] for th in THEMEN if th.get("sim")}
DATENBLATT = {th["id"] for th in THEMEN if not th.get("sim")}
