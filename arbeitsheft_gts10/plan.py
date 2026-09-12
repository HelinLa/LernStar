# -*- coding: utf-8 -*-
"""Bauplan FELO PHYSIK 10 · Gesamtschule NRW.

Kernlehrplan Naturwissenschaften Gesamtschule, Heft 3108, Abschnitt D.
Klasse 10 traegt die beiden letzten Inhaltsfelder:

    (10) Elektrische Energieversorgung
    (11) Radioaktivitaet und Kernenergie

KURSE = True: Fachleistungsdifferenzierung wie in Jahrgang 9.
Woertlich als E-Kurs im Kernlehrplan gekennzeichnet (S. 109 bis 112):
    - "magnetische Felder stromdurchflossener Leiter und Spulen im
       Feldlinienmodell darstellen und mit Hilfe der Drei-Finger-Regel ..."   (IF 10)
    - "Gemeinsamkeiten und Unterschiede elektrischer, magnetischer und
       Gravitationsfelder beschreiben"                                        (IF 10)
    - "Kernspaltung und kontrollierte Kettenreaktion (E-Kurs: auch unter
       energetischen Gesichtspunkten)"                                        (IF 11)
    - "am Beispiel des Zerfallsgesetzes den Charakter und die Entstehung
       physikalischer Gesetze erlaeutern"                                     (IF 11)
    - "vorgegebene schematische Darstellungen von Zerfallsreihen interpretieren"(IF 11)
    - "Gefaehrdungen durch Radioaktivitaet anhand von Messdaten (in Bq, Gy, Sv)
       grob abschaetzen und beurteilen"                                       (IF 11)
    - "Die Entdeckung der Radioaktivitaet und der Kernspaltung als Ursache fuer
       Veraenderungen in Physik, Technik und Gesellschaft ... beurteilen"      (IF 11)

Themen ohne Simulation bekommen wie in FELO Physik 9 (Kapitel Kraftwerke) ein
gedrucktes Datenblatt statt eines Bildschirms - das sind die Bewertungs- und
Anwendungsfragen, bei denen eine Tabelle traegt und ein Regler nichts hergibt.

Kennungen: ev (Elektrische Energieversorgung) und rk (Radioaktivitaet und
Kernenergie). Kollisionsfrei geprueft.
"""

KLASSE = 10
SCHULFORM = "Gesamtschule NRW"
KURSE = True           # G- und E-Kurs

RAHMEN = ("Nour und Jannis sind fünfzehn und machen Praktikum. Jannis kommt bei den "
          "Stadtwerken unter, Nour in der Nuklearmedizin des Krankenhauses. Beide "
          "sollen am Ende einen Vortrag halten - und merken beim Vorbereiten, dass es "
          "in beiden Häusern um dieselbe Frage geht: Woher kommt die Energie, und was "
          "kostet sie uns.")

KAPITEL = [
    {
        "id": "gts_versorgung",
        "acc": (192, 138, 30),
        "titel": "Woher der Strom kommt",
        "inhaltsfeld": "Elektrische Energieversorgung (10)",
        "vorhaben": (
            "Jannis darf im Umspannwerk mitlaufen. Sein Betreuer stellt ihm eine "
            "Aufgabe für die zwei Wochen: Erkläre am letzten Tag der Belegschaft, "
            "wie der Strom vom Windrad bis in die Steckdose kommt - ohne ein Wort, "
            "das du nicht selbst verstanden hast."),
        "themen": [
            {"id": "ev1",  "name": "Wie sieht das Feld um einen Magneten aus?",
             "sim": "magnetfeld"},
            {"id": "ev2",  "name": "Kann Strom eine Kompassnadel bewegen?",
             "sim": "oersted"},
            {"id": "ev3",  "name": "Wie baut man einen Magneten zum Anschalten?",
             "sim": "elektromagnet"},
            {"id": "ev4",  "name": "Warum bewegt sich ein Draht im Magnetfeld?",
             "sim": "leiterkraft"},
            {"id": "ev5",  "name": "Wie sagt man die Richtung der Kraft vorher?",
             "sim": "leiterkraft", "kurs": "E"},
            {"id": "ev6",  "name": "Wie wird aus der Kraft eine Drehbewegung?",
             "sim": "elektromotor"},
            {"id": "ev7",  "name": "Wie entsteht Spannung ohne Batterie?",
             "sim": "induktion-rs"},
            {"id": "ev8",  "name": "Wie macht ein Generator daraus Strom?",
             "sim": "generator"},
            {"id": "ev9",  "name": "Wie ändert ein Transformator die Spannung?",
             "sim": "transformator-schluessel"},
            {"id": "ev10", "name": "Warum hängen die Leitungen unter Hochspannung?",
             "sim": "freileitungen"},
            {"id": "ev11", "name": "Was passiert zwischen Kraftwerk und Steckdose?",
             "sim": "freileitungen"},
            {"id": "ev12", "name": "Welche Kraftwerke liefern unseren Strom?",
             "sim": None},
            {"id": "ev13", "name": "Wie viel von der Energie kommt beim Kunden an?",
             "sim": "wirkungsgrad"},
            {"id": "ev14", "name": "Was kostet ein Gerät im Jahr?",
             "sim": "stromkosten"},
            {"id": "ev15", "name": "Was haben elektrisches, magnetisches und Gravitationsfeld gemeinsam?",
             "sim": None, "kurs": "E"},
        ],
    },
    {
        "id": "gts_kern",
        "acc": (150, 60, 60),
        "titel": "Aus dem Atomkern",
        "inhaltsfeld": "Radioaktivität und Kernenergie (11)",
        "vorhaben": (
            "Nour steht in der Nuklearmedizin vor einer Tür mit dem gelben Zeichen. "
            "Sie darf hinein, aber nur mit Dosimeter und nur fünfzehn Minuten. "
            "Ihre Frage für die zwei Wochen: Warum ist dieselbe Strahlung hier "
            "Heilmittel und nebenan Gefahr?"),
        "themen": [
            {"id": "rk1",  "name": "Woraus besteht ein Atomkern?",
             "sim": "atombau-isotope"},
            {"id": "rk2",  "name": "Was ist radioaktive Strahlung?",
             "sim": "geiger-mueller"},
            {"id": "rk3",  "name": "Welche Strahlungsarten gibt es?",
             "sim": "absorption-strahlung"},
            {"id": "rk4",  "name": "Warum ist die Strahlung gefährlich?",
             "sim": "ionisation"},
            {"id": "rk5",  "name": "Wie weist man Strahlung nach?",
             "sim": "geiger-mueller"},
            {"id": "rk6",  "name": "Wann ist die Hälfte zerfallen?",
             "sim": "zerfall-halbwertszeit"},
            {"id": "rk7",  "name": "Wie alt ist ein Fund?",
             "sim": "zerfall-halbwertszeit"},
            {"id": "rk8",  "name": "Was wird aus einem Kern, der zerfällt?",
             "sim": "zerfallsreihe", "kurs": "E"},
            {"id": "rk9",  "name": "Was passiert bei einer Kernspaltung?",
             "sim": "kernspaltung"},
            {"id": "rk10", "name": "Wie hält man eine Kettenreaktion unter Kontrolle?",
             "sim": "kettenreaktion"},
            {"id": "rk11", "name": "Wie ist ein Kernkraftwerk aufgebaut?",
             "sim": "kettenreaktion"},
            {"id": "rk12", "name": "Wohin mit dem, was übrig bleibt?",
             "sim": None},
            {"id": "rk13", "name": "Wie schützt man sich vor Strahlung?",
             "sim": "strahlenschutz"},
            {"id": "rk14", "name": "Wie viel Strahlung ist noch vertretbar?",
             "sim": "strahlenschutz", "kurs": "E"},
            {"id": "rk15", "name": "Wie hilft Strahlung in der Medizin?",
             "sim": None},
            {"id": "rk16", "name": "Woher nimmt die Sonne ihre Energie?",
             "sim": "kernfusion"},
            {"id": "rk17", "name": "Kernenergie: Wie stehst du dazu?",
             "sim": None},
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
NUR_E = [th["id"] for k in ALLE_KAPITEL for th in k["themen"] if th.get("kurs") == "E"]
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
            e = " (E)" if th.get("kurs") == "E" else ""
            print(f"  {z} {j:2d}. [{th['id']:5s}] {(th['name']+e)[:56]:56s} {th.get('sim') or '— Datenblatt'}")
        print()
    ges = sum(len(k["themen"]) for k in ALLE_KAPITEL)
    print(f"{ges} Themen · {ges-len(OHNE_SIM)} mit fertiger Simulation · {len(OHNE_SIM)} ohne · "
          f"{len(NUR_E)} nur E-Kurs")
