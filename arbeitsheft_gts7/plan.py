# -*- coding: utf-8 -*-
"""Bauplan FELO PHYSIK 7 · Gesamtschule NRW.

Grundlage ist der Kernlehrplan Naturwissenschaften fuer die Gesamtschule,
Sekundarstufe I (Heft 3108, 2. Auflage 2013), Abschnitt D "Fachunterricht
Physik", Seiten 93 bis 112. Klasse 7 traegt die beiden ersten Inhaltsfelder
der zweiten Progressionsstufe:

    (5) Optische Instrumente
    (6) Erde und Weltall

Der Kernlehrplan ordnet Inhaltsfelder ausdruecklich KEINEN Jahrgangsstufen zu
("Bei der Ueberfuehrung der Inhaltsfelder und der zugeordneten inhaltlichen
Schwerpunkte in konkrete Unterrichtsvorhaben koennen nach Entscheidung der
Fachkonferenz von den Vorgaben abweichende Zuordnungen entstehen, sofern diese
innerhalb der vorgegebenen Progressionsstufen erfolgen", S. 93). Alle sieben
Inhaltsfelder 5 bis 11 gehoeren zur zweiten Progressionsstufe; die Verteilung
auf 7/8/9/10 ist damit gedeckt.

KURSE = False: In den Jahrgangsstufen 7 und 8 wird klassenweise unterrichtet.
Die Fachleistungsdifferenzierung in Physik beginnt nach APO-SI erst ab
Jahrgang 9 - erst dort tragen die Aufgaben die G/E-Kennzeichnung.

Alle 29 Themen haben inzwischen eine Simulation. Die beiden letzten wurden am
31.08.2026 gebaut und geprueft: "spektrum-unsichtbar" (oi15, Herschels Versuch,
Waermewirkung aus Planck-Strahlung mal Prismen-Aufweitung gerechnet) und
"sternparallaxe" (ew9, d = 1/p). Beide bestehen Rauchtest und Rechentest.

Kennungen: oi (Optische Instrumente) und ew (Erde und Weltall). Beide sind
gegen die 195 bereits vergebenen Kennungen geprueft und kollisionsfrei
(m l s w sc h · o f g t · sp wd lt bg · kr bw en kw · mo ge ak ke).
"""

KLASSE = 7
SCHULFORM = "Gesamtschule NRW"
KURSE = False          # keine G/E-Differenzierung in Jg. 7

RAHMEN = ("Nour und Jannis sind zwölf und gehen in die 7. Der Physikraum der Schule "
          "hat einen alten Sammlungsschrank, den seit Jahren niemand aufgeräumt hat. "
          "Frau Demir gibt den beiden den Schlüssel: Was brauchbar ist, kommt zurück "
          "in den Unterricht. Im Schrank liegen Linsen, Spiegel, ein zerlegtes Fernrohr "
          "und eine Kiste mit Sternkarten.")

KAPITEL = [
    {
        "id": "gts_optik",
        "acc": (176, 106, 30),
        "titel": "Sehen, spiegeln, brechen",
        "inhaltsfeld": "Optische Instrumente (5)",
        "vorhaben": (
            "Im Sammlungsschrank liegen zwei Kisten voller Gläser und Spiegel, "
            "unbeschriftet und durcheinander. Bevor Nour und Jannis sie einräumen "
            "können, müssen sie herausfinden, was jedes Stück mit dem Licht macht."),
        "themen": [
            {"id": "oi1",  "name": "Was passiert, wenn Licht auf eine Oberfläche trifft?",
             "sim": "licht-oberflaeche"},
            {"id": "oi2",  "name": "Wo steht das Bild hinter dem Spiegel?",
             "sim": "spiegelbild"},
            {"id": "oi3",  "name": "Nach welcher Regel wird Licht am Spiegel zurückgeworfen?",
             "sim": "reflexionsgesetz"},
            {"id": "oi4",  "name": "Warum knickt der Lichtstrahl beim Eintritt ins Glas?",
             "sim": "brechung-eintritt"},
            {"id": "oi5",  "name": "Was passiert beim Austritt aus dem Glas?",
             "sim": "brechung-austritt"},
            {"id": "oi6",  "name": "Wie kommt Licht durch eine gebogene Faser?",
             "sim": "totalreflexion"},
            {"id": "oi7",  "name": "Welches Glas bündelt das Licht, welches nicht?",
             "sim": "sammellinse"},
            {"id": "oi8",  "name": "Wo entsteht das Bild einer Linse?",
             "sim": "bild-linse"},
            {"id": "oi9",  "name": "Warum vergrößert eine Lupe?",
             "sim": "lupe"},
            {"id": "oi10", "name": "Wie entsteht ein Bild im Auge?",
             "sim": "auge"},
            {"id": "oi11", "name": "Wie hilft eine Brille beim Scharfsehen?",
             "sim": "brille"},
            {"id": "oi12", "name": "Wie macht eine Kamera ein Bild ohne Linse?",
             "sim": "lochkamera"},
            {"id": "oi13", "name": "Woraus besteht weißes Licht?",
             "sim": "prisma"},
            {"id": "oi14", "name": "Wie entstehen die Farben auf einem Bildschirm?",
             "sim": "farbmischung-additiv"},
            {"id": "oi15", "name": "Welches Licht sehen wir nicht?",
             "sim": "spektrum-unsichtbar"},
        ],
    },
    {
        "id": "gts_weltall",
        "acc": (31, 96, 132),
        "titel": "Der Blick ins Weltall",
        "inhaltsfeld": "Erde und Weltall (6)",
        "vorhaben": (
            "Ganz unten im Schrank steht ein Fernrohr in Einzelteilen, dazu ein Karton "
            "mit alten Sternkarten. Frau Demir sagt: Wenn ihr es zusammenbekommt, machen "
            "wir im Herbst einen Abend auf dem Schulhof."),
        "themen": [
            {"id": "ew1",  "name": "Was leuchtet da eigentlich am Nachthimmel?",
             "sim": "himmelskoerper"},
            {"id": "ew2",  "name": "Warum ist es nicht überall gleichzeitig hell?",
             "sim": "tag-nacht"},
            {"id": "ew3",  "name": "Warum fällt alles nach unten?",
             "sim": "gravitation"},
            {"id": "ew4",  "name": "Wovon hängt die Stärke der Anziehung ab?",
             "sim": "gravitation-abstand"},
            {"id": "ew5",  "name": "Warum stürzen die Planeten nicht in die Sonne?",
             "sim": "planetenbahn"},
            {"id": "ew6",  "name": "Was unterscheidet die acht Planeten voneinander?",
             "sim": "sonnensystem"},
            {"id": "ew7",  "name": "Wie groß ist das Sonnensystem wirklich?",
             "sim": "entfernungen"},
            {"id": "ew8",  "name": "Wie holt ein Fernrohr Fernes heran?",
             "sim": "teleskop"},
            {"id": "ew9",  "name": "Wie misst man die Entfernung zu einem Stern?",
             "sim": "sternparallaxe"},
            {"id": "ew10", "name": "Warum leuchtet ein Stern - und wie lange?",
             "sim": "sternleben"},
            {"id": "ew11", "name": "Wo stehen wir in der Milchstraße?",
             "sim": "milchstrasse"},
            {"id": "ew12", "name": "Wer steht in der Mitte? Zwei Weltbilder",
             "sim": "weltbild"},
            {"id": "ew13", "name": "Wie findet man etwas, das kein Licht aussendet?",
             "sim": "schwarzes-loch"},
            {"id": "ew14", "name": "Woher kommt alles? Der Urknall",
             "sim": "urknall"},
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
    print(f"FELO PHYSIK {KLASSE} · {SCHULFORM}"
          f"{' · G/E-Kurse' if KURSE else ' · klassenweise'}\n")
    for i, k in enumerate(ALLE_KAPITEL, 1):
        ohne = sum(1 for th in k["themen"] if not th.get("sim"))
        print(f"Kapitel {i} · {k['titel']}  [{k['inhaltsfeld']}]  "
              f"({len(k['themen'])} Themen · {ohne} ohne Simulation)")
        for j, th in enumerate(k["themen"], 1):
            z = "  " if th.get("sim") else " !"
            print(f"  {z} {j:2d}. [{th['id']:5s}] {th['name'][:56]:56s} {th.get('sim') or '— neu bauen'}")
        print()
    ges = sum(len(k["themen"]) for k in ALLE_KAPITEL)
    print(f"{ges} Themen · {ges-len(OHNE_SIM)} mit fertiger Simulation · {len(OHNE_SIM)} ohne")
