# -*- coding: utf-8 -*-
"""Bauplan FeLabs PHYSIK 10 · Gymnasium NRW (G9).

Grundlage: Kernlehrplan Physik Gymnasium (Heft 3411, 2019), Kapitel 2.3:

    (10) Ionisierende Strahlung und Kernenergie
    (11) Energieversorgung

Pflichtinhalte: alpha/beta/gamma UND Roentgenstrahlung, Nachweis (Bq mit
Nullrate), Halbwertszeit und Zerfallsgesetz als Zufallsprozess, Sv/effektive
Dosis, Reaktor mit Sicherheitseinrichtungen, Kernfusion, Endlagerung,
Lorentzkraft qualitativ (geladene Teilchen im Magnetfeld); Induktion,
Generator, Wechselspannung, Transformator, Elektromotor, Hochspannungs-
uebertragung, Wirkungsgrad, Energiespeicherung, Klimawandel-Bezug.

Neu zu bauende Simulation: lorentzkraft (kp9). eg11 (Kraftwerke im
Vergleich) laeuft bewusst OHNE Simulation mit Datenblatt auf der Seite -
wie die kw-Seiten der Gesamtschule, dort hat sich das bewaehrt.

Kennungen kp, eg - kollisionsfrei gegen alle vergebenen.
"""

KLASSE = 10
SCHULFORM = "Gymnasium NRW"
KURSE = False

RAHMEN = ("Aylin und Leon sind sechzehn und im Schülerpraktikum: sie in der "
          "Röntgenabteilung des Klinikums, er beim Netzbetreiber in der Leitwarte. "
          "Abends vergleichen die beiden ihre Notizen - Strahlung hier, Stromnetz "
          "dort - und merken, dass beide Praktika dieselbe Frage stellen: Wie geht "
          "man verantwortlich mit unsichtbarer Energie um?")

KAPITEL = [
    {
        "id": "gym_kern",
        "acc": (130, 60, 140),
        "titel": "Strahlung aus dem Atomkern",
        "inhaltsfeld": "Ionisierende Strahlung und Kernenergie (10)",
        "vorhaben": (
            "Aylins erste Praktikumswoche: Warnschilder, Dosimeter, Bleischürzen. "
            "Was strahlt da eigentlich, wie weist man es nach - und wann muss "
            "man sich schützen?"),
        "themen": [
            {"id": "kp1",  "name": "Woraus besteht ein Atomkern?",
             "sim": "atombau-isotope"},
            {"id": "kp2",  "name": "Alpha, Beta, Gamma - was strahlt da?",
             "sim": "radioaktivitaet"},
            {"id": "kp3",  "name": "Wie zählt man Strahlung?",
             "sim": "geiger-mueller"},
            {"id": "kp4",  "name": "Was richtet Strahlung in Materie an?",
             "sim": "ionisation"},
            {"id": "kp5",  "name": "Was hält Strahlung auf?",
             "sim": "absorption-strahlung"},
            {"id": "kp6",  "name": "Wann ist die Hälfte zerfallen?",
             "sim": "zerfall-halbwertszeit"},
            {"id": "kp7",  "name": "Wohin zerfällt Uran?",
             "sim": "zerfallsreihe"},
            {"id": "kp8",  "name": "Wie entsteht Röntgenlicht?",
             "sim": "roentgen-charakteristisch"},
            {"id": "kp9",  "name": "Was lenkt geladene Teilchen ab?",
             "sim": "lorentzkraft"},
            {"id": "kp10", "name": "Wie zerlegt man einen Kern?",
             "sim": "kernspaltung"},
            {"id": "kp11", "name": "Wie hält man die Kettenreaktion im Zaum?",
             "sim": "kettenreaktion"},
            {"id": "kp12", "name": "Wovon lebt die Sonne?",
             "sim": "kernfusion"},
            {"id": "kp13", "name": "Wie viel Dosis ist zu viel?",
             "sim": "strahlenschutz"},
        ],
    },
    {
        "id": "gym_energie",
        "acc": (36, 120, 90),
        "titel": "Strom für alle",
        "inhaltsfeld": "Energieversorgung (11)",
        "vorhaben": (
            "Leons Leitwarte zeigt das halbe Land als Lichterkette. Woher kommt "
            "die Energie, wie wird aus Drehung Spannung - und wie kommt sie "
            "verlustarm bis in die Steckdose der Schule?"),
        "themen": [
            {"id": "eg1",  "name": "Was entdeckte Ørsted neben dem Kompass?",
             "sim": "oersted"},
            {"id": "eg2",  "name": "Warum zuckt der Draht im Magnetfeld?",
             "sim": "leiterkraft"},
            {"id": "eg3",  "name": "Wie dreht sich der Elektromotor?",
             "sim": "elektromotor"},
            {"id": "eg4",  "name": "Wie macht Bewegung Spannung?",
             "sim": "induktion"},
            {"id": "eg5",  "name": "Wie erzeugt der Generator Strom?",
             "sim": "generator"},
            {"id": "eg6",  "name": "Warum wechselt der Strom die Richtung?",
             "sim": "wechselstrom"},
            {"id": "eg7",  "name": "Wie verwandelt der Trafo die Spannung?",
             "sim": "transformator"},
            {"id": "eg8",  "name": "Warum hängen die Leitungen so hoch - und führen Hochspannung?",
             "sim": "freileitungen"},
            {"id": "eg9",  "name": "Wie gut ist ein Energiewandler?",
             "sim": "wirkungsgrad"},
            {"id": "eg10", "name": "Warum wird Energie entwertet?",
             "sim": "energie-entwerten"},
            {"id": "eg11", "name": "Welches Kraftwerk für welche Aufgabe?"},
            {"id": "eg12", "name": "Wie speichert man Strom für die Nacht?",
             "sim": "energiesparen"},
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
