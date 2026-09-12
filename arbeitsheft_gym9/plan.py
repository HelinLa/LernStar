# -*- coding: utf-8 -*-
"""Bauplan FELO PHYSIK 9 · Gymnasium NRW (G9).

Grundlage: Kernlehrplan Physik Gymnasium (Heft 3411, 2019), Kapitel 2.3:

    (9) Elektrizitaet

Ein einziges, dichtes Inhaltsfeld - deshalb drei Kapitel, alle mit
KAPITEL_FELD -> 9: Elektrostatik, Stromkreise/Widerstand, Energie/Leistung.
Pflichtinhalte: Elektroskop, Spannung als Folge der Ladungstrennung,
Elektronen-Atomrumpf-Modell, Definition des Widerstands VS. Ohmsches Gesetz
(der KLP verlangt die Unterscheidung woertlich), Reihen-/Parallelschaltung
mathematisch, Einflussgroessen auf den Widerstand mit Variablenkontrolle,
Hausinstallation, Koerperwirkungen, Energie/Leistung/Kosten.

Neu zu bauende Simulation: elektroskop (la2). ep5 (Hausinstallation) wird
bewusst OHNE Simulation gefuehrt und bekommt wie die Kraftwerksseiten der
Gesamtschule ein Datenblatt ("daten"-Feld) auf der Seite.

Kennungen la, wi, ep - kollisionsfrei gegen alle vergebenen.
"""

KLASSE = 9
SCHULFORM = "Gymnasium NRW"
KURSE = False

RAHMEN = ("Sina und David sind fünfzehn und haben den Technikdienst der Aula "
          "übernommen: Mischpult, Scheinwerfer, ein Sicherungskasten hinter der "
          "Bühne - und ein Ordner voller Zettel ihres Vorgängers mit der Aufschrift "
          "„Erst verstehen, dann einschalten“. Vor dem Winterkonzert wollen die "
          "beiden jede Zeile davon eingelöst haben.")

KAPITEL = [
    {
        "id": "gym_ladung",
        "acc": (130, 60, 140),
        "titel": "Ladungen und Felder",
        "inhaltsfeld": "Elektrizität (9)",
        "vorhaben": (
            "Beim Aufräumen knistert die Folie, ein Funke springt zum Regal: "
            "Bevor Sina und David an die Anlage dürfen, klären sie, was Ladung "
            "ist, wie man sie sichtbar macht und was Spannung damit zu tun hat."),
        "themen": [
            {"id": "la1", "name": "Wann ziehen sich Ladungen an, wann stoßen sie sich ab?",
             "sim": "ladungen-kraft"},
            {"id": "la2", "name": "Wie macht ein Elektroskop Ladung sichtbar?",
             "sim": "elektroskop"},
            {"id": "la3", "name": "Was liegt um eine Ladung herum?",
             "sim": "efeld"},
            {"id": "la4", "name": "Wie entsteht ein Blitz?",
             "sim": "blitz"},
            {"id": "la5", "name": "Was ist Spannung wirklich?",
             "sim": "spannung"},
            {"id": "la6", "name": "Warum leitet Metall und Gummi nicht?",
             "sim": "elektronen-drift"},
        ],
    },
    {
        "id": "gym_kreise",
        "acc": (46, 92, 178),
        "titel": "Stromkreise und Widerstand",
        "inhaltsfeld": "Elektrizität (9)",
        "vorhaben": (
            "Das Mischpult hängt mit Scheinwerfern, Nebelmaschine und Ladegeräten "
            "an einer einzigen Leitung. Wie viel fließt wo - und was bremst den "
            "Strom? Die beiden messen sich durch die Bühnentechnik."),
        "themen": [
            {"id": "wi1", "name": "Wie viel fließt da eigentlich?",
             "sim": "stromstaerke"},
            {"id": "wi2", "name": "Was bremst den Strom?",
             "sim": "widerstand"},
            {"id": "wi3", "name": "Wann gilt das Ohmsche Gesetz?",
             "sim": "ohmsches-gesetz"},
            {"id": "wi4", "name": "Was verrät die Kennlinie?",
             "sim": "ohm-kennlinie"},
            {"id": "wi5", "name": "Lang, dünn oder woraus? Der Draht entscheidet",
             "sim": "draht"},
            {"id": "wi6", "name": "Hintereinander wird es weniger",
             "sim": "reihe-widerstand"},
            {"id": "wi7", "name": "Nebeneinander wird es mehr",
             "sim": "parallel-widerstand"},
            {"id": "wi8", "name": "Der Regler am Pult",
             "sim": "potentiometer"},
        ],
    },
    {
        "id": "gym_eleistung",
        "acc": (166, 60, 48),
        "titel": "Energie, Leistung, Sicherheit",
        "inhaltsfeld": "Elektrizität (9)",
        "vorhaben": (
            "Nach dem Konzert kommt die Stromrechnung der Schule - und die Frage "
            "des Hausmeisters, ob die alte Anlage nicht zu viel zieht. Zeit "
            "auszurechnen, was Technik wirklich verbraucht und wo es gefährlich wird."),
        "themen": [
            {"id": "ep1", "name": "Wie viel Energie steckt im Abend?",
             "sim": "elektrische-energie"},
            {"id": "ep2", "name": "Was sagt die Wattzahl?",
             "sim": "elektrische-leistung"},
            {"id": "ep3", "name": "Was kostet eine Kilowattstunde Konzert?",
             "sim": "stromkosten"},
            {"id": "ep4", "name": "Ab wann wird Strom für den Körper gefährlich?",
             "sim": "stromgefahren"},
            {"id": "ep5", "name": "Wie ist das Haus verkabelt?"},
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
    print(f"FELO PHYSIK {KLASSE} · {SCHULFORM}\n")
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
