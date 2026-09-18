# -*- coding: utf-8 -*-
"""Bauplan FELO PHYSIK 8 · Gesamtschule NRW.

Kernlehrplan Naturwissenschaften Gesamtschule, Heft 3108, Abschnitt D.
Klasse 8 traegt:

    (7) Stromkreise                     - vollstaendig
    (8) Bewegungen und ihre Ursachen    - der beschreibende Teil
                                          (Bewegungen, Geschwindigkeit, Diagramme)

Der zweite Teil von Inhaltsfeld (8) - Kraft, Druck, Auftrieb - steht in Klasse 9,
weil er dort mit dem Kraftbegriff und der Energie zusammengehoert. Der
Kernlehrplan laesst diese Aufteilung ausdruecklich zu, solange sie innerhalb
derselben Progressionsstufe bleibt (S. 93).

KURSE = False: In Jahrgang 8 wird noch klassenweise unterrichtet.

Kennungen: st (Stromkreise), be (Bewegungen). Kollisionsfrei geprueft.
"""

KLASSE = 8
SCHULFORM = "Gesamtschule NRW"
KURSE = False          # keine G/E-Differenzierung in Jg. 8

RAHMEN = ("Nour und Jannis sind ein Jahr älter. Die Schule richtet einen Raum für die "
          "Fahrrad-AG ein: alte Räder werden wieder flott gemacht, und im Nebenraum "
          "steht eine Werkbank mit Netzteil, Kabeln und einer Kiste voller Bauteile. "
          "Bis zum Sommerfest soll daraus eine Werkstatt werden, in der auch Licht "
          "brennt und in der man messen kann, wie schnell die Räder wirklich sind.")

KAPITEL = [
    {
        "id": "gts_strom",
        "acc": (46, 92, 178),
        "titel": "Stromkreise verstehen",
        "inhaltsfeld": "Stromkreise (7)",
        "vorhaben": (
            "In der Werkstatt gibt es genau eine Steckdose und viel zu wenig Licht. "
            "Nour und Jannis sollen die Beleuchtung planen - und dafür erst einmal "
            "verstehen, was in einem Stromkreis eigentlich passiert."),
        "themen": [
            {"id": "st1",  "name": "Warum knistert der Pullover beim Ausziehen?",
             "sim": "ladung"},
            {"id": "st3",  "name": "Was sagt die Zahl mit dem V auf der Batterie?",
             "sim": "spannung"},
            {"id": "st4",  "name": "Wie viel fließt da eigentlich?",
             "sim": "stromstaerke"},
            {"id": "st5",  "name": "Wie schließt man ein Messgerät richtig an?",
             "sim": "messen"},
            {"id": "st6",  "name": "Was bremst den Strom?",
             "sim": "widerstand"},
            {"id": "st7",  "name": "Wovon hängt der Widerstand eines Drahtes ab?",
             "sim": "draht"},
            {"id": "st8",  "name": "Wie hängen Spannung, Stromstärke und Widerstand zusammen?",
             "sim": "ohm-kennlinie"},
            {"id": "st9",  "name": "Was passiert, wenn alles hintereinander hängt?",
             "sim": "reihe-widerstand"},
            {"id": "st10", "name": "Warum bleibt das Licht an, wenn eine Lampe ausfällt?",
             "sim": "parallel-widerstand"},
            {"id": "st11", "name": "Was bewegt sich im Draht wirklich?",
             "sim": "elektronen-drift"},
            {"id": "st12", "name": "Was passiert bei einem Blitz?",
             "sim": "blitz"},
            {"id": "st13", "name": "Wie viel Energie braucht ein Gerät?",
             "sim": "elektrische-leistung"},
            {"id": "st14", "name": "Wo wird Strom im Haushalt gefährlich?",
             "sim": "stromgefahren"},
        ],
    },
    {
        "id": "gts_bewegung",
        "acc": (150, 60, 120),
        "titel": "Bewegungen beschreiben",
        "inhaltsfeld": "Bewegungen und ihre Ursachen (8), erster Teil",
        "vorhaben": (
            "Die ersten Räder rollen wieder. Jetzt will die AG wissen, welches "
            "Rad wirklich schneller ist - und dafür reicht ein Gefühl nicht aus. "
            "Auf dem Schulhof wird eine Messstrecke abgesteckt."),
        "themen": [
            {"id": "be1", "name": "Wer ist schneller - und woran misst man das?",
             "sim": "v-begriff"},
            {"id": "be2", "name": "Wie misst man eine Geschwindigkeit?",
             "sim": "v-messen"},
            {"id": "be3", "name": "Wie rechnet man aus Weg und Zeit die Geschwindigkeit?",
             "sim": "v-formel"},
            {"id": "be4", "name": "Warum steht auf dem Schild km/h und im Heft m/s?",
             "sim": "v-umrechnung"},
            {"id": "be5", "name": "Was heißt gleichförmige Bewegung?",
             "sim": "gleichfoermig-rs"},
            {"id": "be6", "name": "Was verrät ein Zeit-Weg-Diagramm?",
             "sim": "weg-zeit-diagramm"},
            {"id": "be7", "name": "Was passiert beim Anfahren und Bremsen?",
             "sim": "beschleunigung-rs"},
            {"id": "be8", "name": "Was verrät ein Zeit-Geschwindigkeit-Diagramm?",
             "sim": "v-zeit-diagramm"},
            {"id": "be9", "name": "Wie weit fährt ein Auto, bis es steht?",
             "sim": "bremsweg-jg9"},
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
