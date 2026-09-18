# -*- coding: utf-8 -*-
"""Bauplan FeLabs PHYSIK 7 · Gymnasium NRW (G9).

Grundlage: Kernlehrplan Physik Gymnasium (Heft 3411, 2019), Kapitel 2.3.
Klasse 7 traegt die ersten beiden Inhaltsfelder der zweiten Stufe:

    (5) Optische Instrumente
    (6) Sterne und Weltall

Der KLP ordnet Inhaltsfelder KEINEN Jahrgangsstufen zu - die Verteilung
5-11 auf die Klassen 7 bis 10 ist ein begruendeter Verlagsvorschlag.

Neu zu bauende Simulation: farbmischung-subtraktiv (op15; der KLP verlangt
RGB UND CMYK). Alle uebrigen 31 Simulationen existieren und sind geprueft.

Kennungen op, wa - kollisionsfrei gegen alle vergebenen.
"""

KLASSE = 7
SCHULFORM = "Gymnasium NRW"
KURSE = False

RAHMEN = ("Mira und Jonas sind dreizehn und planen für die Projektwoche die "
          "Ausstellung „Licht und Himmel“. Aus der Physiksammlung dürfen sie Linsen, "
          "Spiegel und ein altes Fernrohr benutzen; am Ende der Woche soll ein "
          "Abend an der kleinen Schulsternwarte stehen. Was in die Ausstellung "
          "kommt, müssen die beiden vorher selbst verstanden haben.")

KAPITEL = [
    {
        "id": "gym_optik",
        "acc": (176, 106, 30),
        "titel": "Sehen, spiegeln, brechen",
        "inhaltsfeld": "Optische Instrumente (5)",
        "vorhaben": (
            "Für den ersten Ausstellungsraum sortieren Mira und Jonas die "
            "Linsenkiste: Was macht jedes Glas mit dem Licht - und welches "
            "Gerät steckt dahinter, vom Auge bis zum Fernrohr?"),
        "themen": [
            {"id": "op1",  "name": "Nach welcher Regel wird Licht am Spiegel zurückgeworfen?",
             "sim": "reflexionsgesetz"},
            {"id": "op2",  "name": "Wo steht das Bild hinter dem Spiegel?",
             "sim": "spiegelbild"},
            {"id": "op3",  "name": "Warum knickt der Lichtstrahl beim Eintritt ins Glas?",
             "sim": "brechung-eintritt"},
            {"id": "op4",  "name": "Was passiert beim Austritt aus dem Glas?",
             "sim": "brechung-austritt"},
            {"id": "op5",  "name": "Wie hält eine Glasfaser das Licht gefangen?",
             "sim": "totalreflexion"},
            {"id": "op6",  "name": "Was macht eine Sammellinse mit dem Licht?",
             "sim": "sammellinse"},
            {"id": "op7",  "name": "Wo entsteht das Bild einer Linse?",
             "sim": "bild-linse"},
            {"id": "op8",  "name": "Wie entsteht ein scharfes Bild im Auge?",
             "sim": "auge"},
            {"id": "op9",  "name": "Wie hilft eine Brille beim Scharfsehen?",
             "sim": "brille"},
            {"id": "op10", "name": "Warum vergrößert eine Lupe?",
             "sim": "lupe"},
            {"id": "op11", "name": "Wie macht die Kamera ihr Bild?",
             "sim": "kamera"},
            {"id": "op12", "name": "Wie holt ein Fernrohr Fernes heran?",
             "sim": "teleskop"},
            {"id": "op13", "name": "Woraus besteht weißes Licht?",
             "sim": "prisma"},
            {"id": "op14", "name": "Wie mischt ein Bildschirm seine Farben?",
             "sim": "farbmischung-additiv"},
            {"id": "op15", "name": "Warum druckt der Drucker mit anderen Farben?",
             "sim": "farbmischung-subtraktiv"},
            {"id": "op16", "name": "Wie entsteht der Regenbogen?",
             "sim": "regenbogen"},
        ],
    },
    {
        "id": "gym_weltall",
        "acc": (31, 96, 132),
        "titel": "Der Blick ins Weltall",
        "inhaltsfeld": "Sterne und Weltall (6)",
        "vorhaben": (
            "Für den Sternwarten-Abend braucht die Ausstellung Antworten: Warum "
            "sieht der Mond jede Woche anders aus, wie weit sind die Sterne - "
            "und woher weiß man das alles überhaupt?"),
        "themen": [
            {"id": "wa1",  "name": "Was leuchtet da am Nachthimmel?",
             "sim": "himmelskoerper"},
            {"id": "wa2",  "name": "Warum gibt es Sommer und Winter?",
             "sim": "jahreszeiten"},
            {"id": "wa3",  "name": "Warum sieht der Mond jede Woche anders aus?",
             "sim": "mondphasen"},
            {"id": "wa4",  "name": "Wie entsteht eine Sonnenfinsternis?",
             "sim": "sonnenfinsternis"},
            {"id": "wa5",  "name": "Wie entsteht eine Mondfinsternis?",
             "sim": "mondfinsternis"},
            {"id": "wa6",  "name": "Was unterscheidet die acht Planeten?",
             "sim": "sonnensystem"},
            {"id": "wa7",  "name": "Warum fällt alles nach unten?",
             "sim": "gravitation"},
            {"id": "wa8",  "name": "Wovon hängt die Stärke der Anziehung ab?",
             "sim": "gravitation-abstand"},
            {"id": "wa9",  "name": "Warum stürzen die Planeten nicht in die Sonne?",
             "sim": "planetenbahn"},
            {"id": "wa10", "name": "Ist man im All wirklich schwerelos?",
             "sim": "schwerelosigkeit"},
            {"id": "wa11", "name": "Wie weit ist ein Lichtjahr?",
             "sim": "entfernungen"},
            {"id": "wa12", "name": "Wie misst man die Entfernung zu einem Stern?",
             "sim": "sternparallaxe"},
            {"id": "wa13", "name": "Was verrät das Licht über einen Stern?",
             "sim": "sternspektrum"},
            {"id": "wa14", "name": "Wie lebt und stirbt ein Stern?",
             "sim": "sternleben"},
            {"id": "wa15", "name": "Wer steht in der Mitte? Zwei Weltbilder",
             "sim": "weltbild"},
            {"id": "wa16", "name": "Wie kommt eine Rakete vom Fleck?",
             "sim": "rueckstoss"},
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
