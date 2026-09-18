# -*- coding: utf-8 -*-
"""Bauplan FeLabs PHYSIK 9 · Gesamtschule NRW.

Kernlehrplan Naturwissenschaften Gesamtschule, Heft 3108, Abschnitt D.
Klasse 9 traegt:

    (8) Bewegungen und ihre Ursachen  - der zweite Teil: Kraft, Druck, Auftrieb
    (9) Energie, Leistung, Wirkungsgrad

KURSE = True: Ab Jahrgang 9 wird Physik nach APO-SI § 19 Abs. 4 in
Fachleistungskursen auf zwei Anspruchsebenen unterrichtet (Grundkurs und
Erweiterungskurs). Der Kernlehrplan kennzeichnet die zusaetzlichen
Kompetenzerwartungen des E-Kurses kursiv und mit "E-Kurs:" (S. 100).
Im Heft heisst das:

    - jede Aufgabe traegt eine Stufe: Fundament · Standard · E
    - "kurs": "E" an einem Thema bedeutet: die ganze Seite ist E-Kurs-Stoff

Aus dem Kernlehrplan stammen fuer dieses Heft woertlich als E-Kurs:
    - "Rollen, Flaschenzuege, Hebel, Zahnraeder (E-Kurs: schiefe Ebene)"   (IF 9)
    - "formale Beschreibungen ... (E-Kurs: auch unter quantitativer
       Verwendung des Prinzips der Energieerhaltung)"                      (IF 9)
    - "(E-Kurs: an einfachen Beispielen kausale Zusammenhaenge bei
       mechanischen und energetischen Vorgaengen schriftlich darstellen)"  (IF 9)
    - "(E-Kurs: ein Tabellenkalkulationsprogramm einsetzen ...)"           (IF 9)

Kennungen: kf (Kraefte) und el (Energie und Leistung). Kollisionsfrei geprueft.
"""

KLASSE = 9
SCHULFORM = "Gesamtschule NRW"
KURSE = True           # G- und E-Kurs ab Jg. 9

RAHMEN = ("Nour und Jannis sind vierzehn. Die Schule baut auf dem Hof eine Bühne für "
          "das Sommerfest - Podeste, Traversen, ein Klavier aus dem Musikraum muss hoch. "
          "Herr Kessler von der Hausmeisterei lässt die beiden mitarbeiten, unter einer "
          "Bedingung: Alles, was gehoben wird, wird vorher gerechnet.")

KAPITEL = [
    {
        "id": "gts_kraefte",
        "acc": (188, 74, 44),
        "titel": "Kräfte, Druck und Auftrieb",
        "inhaltsfeld": "Bewegungen und ihre Ursachen (8), zweiter Teil",
        "vorhaben": (
            "Das Klavier steht unten, die Bühne ist einen Meter hoch. Bevor jemand "
            "anpackt, will Herr Kessler wissen, welche Kräfte dabei wirken - und "
            "warum die Podeste unter dem Klavier nicht einsinken dürfen."),
        "themen": [
            {"id": "kf1",  "name": "Woran erkennt man, dass eine Kraft wirkt?",
             "sim": "kraft-wirkung"},
            {"id": "kf2",  "name": "Wie misst man eine Kraft?",
             "sim": "kraftmesser"},
            {"id": "kf3",  "name": "Warum geben zwei Federn nicht gleich nach?",
             "sim": "federgesetz"},
            {"id": "kf4",  "name": "Was ist der Unterschied zwischen Masse und Gewichtskraft?",
             "sim": "masse-gewicht"},
            {"id": "kf5",  "name": "Wäre dasselbe Klavier auf dem Mond leichter?",
             "sim": "ortsfaktor"},
            {"id": "kf6",  "name": "Wie zeichnet man eine Kraft auf?",
             "sim": "kraftpfeil"},
            {"id": "kf7",  "name": "Was passiert, wenn zwei Menschen ziehen?",
             "sim": "kraefte-addieren"},
            {"id": "kf8",  "name": "Wann bewegt sich trotz Kraft nichts?",
             "sim": "kraefte-gleichgewicht"},
            {"id": "kf9",  "name": "Warum rutscht die Kiste weiter, obwohl niemand schiebt?",
             "sim": "traegheit-rs"},
            {"id": "kf10", "name": "Warum rollt das Rollbrett zurück?",
             "sim": "wechselwirkung"},
            {"id": "kf11", "name": "Warum sinkt das Podest unter dem schmalen Fuß ein?",
             "sim": "druck-flaeche"},
            {"id": "kf12", "name": "Warum drückt Wasser in der Tiefe stärker?",
             "sim": "schweredruck"},
            {"id": "kf13", "name": "Warum wiegen gleich große Körper ganz verschieden viel?",
             "sim": "dichte"},
            {"id": "kf14", "name": "Warum schwimmt ein Schiff aus Eisen?",
             "sim": "auftrieb"},
        ],
    },
    {
        "id": "gts_energie",
        "acc": (30, 122, 116),
        "titel": "Arbeit, Energie und Maschinen",
        "inhaltsfeld": "Energie, Leistung, Wirkungsgrad (9)",
        "vorhaben": (
            "Das Klavier muss trotzdem hoch. Herr Kessler holt Rollen, ein Seil und "
            "zwei Bohlen aus dem Lager und sagt: Kraft sparen könnt ihr - Arbeit nicht. "
            "Nour und Jannis wollen wissen, ob das stimmt."),
        "themen": [
            {"id": "el1",  "name": "Wann wird in der Physik Arbeit verrichtet?",
             "sim": "arbeit"},
            {"id": "el2",  "name": "Wo steckt die Energie, wenn etwas oben liegt?",
             "sim": "lageenergie"},
            {"id": "el3",  "name": "Wo steckt die Energie, wenn etwas rollt?",
             "sim": "bewegungsenergie"},
            {"id": "el4",  "name": "Bleibt die Energie beim Umwandeln erhalten?",
             "sim": "energieerhaltung"},
            {"id": "el5",  "name": "Warum wird alles am Ende warm?",
             "sim": "energie-entwerten"},
            {"id": "el6",  "name": "Was unterscheidet Arbeit von Leistung?",
             "sim": "leistung-rs"},
            {"id": "el7",  "name": "Wie viel von der Energie kommt an?",
             "sim": "wirkungsgrad"},
            {"id": "el8",  "name": "Warum ist eine Stange länger als der Weg der Last?",
             "sim": "hebel"},
            {"id": "el9",  "name": "Was bringt eine Rolle an der Decke?",
             "sim": "feste-rolle"},
            {"id": "el10", "name": "Wie viele Seile tragen die Last?",
             "sim": "flaschenzug"},
            {"id": "el11", "name": "Warum dreht sich das kleine Rad schneller?",
             "sim": "zahnrad"},
            {"id": "el12", "name": "Warum ist die Rampe leichter als das Heben?",
             "sim": "schiefe-ebene", "kurs": "E"},
            {"id": "el13", "name": "Was spart man wirklich - Kraft oder Arbeit?",
             "sim": "schiefe-ebene"},
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
    print(f"FeLabs PHYSIK {KLASSE} · {SCHULFORM}"
          f"{' · G/E-Kurse' if KURSE else ' · klassenweise'}\n")
    for i, k in enumerate(ALLE_KAPITEL, 1):
        ohne = sum(1 for th in k["themen"] if not th.get("sim"))
        print(f"Kapitel {i} · {k['titel']}  [{k['inhaltsfeld']}]  "
              f"({len(k['themen'])} Themen · {ohne} ohne Simulation)")
        for j, th in enumerate(k["themen"], 1):
            z = "  " if th.get("sim") else " !"
            e = " (E)" if th.get("kurs") == "E" else ""
            print(f"  {z} {j:2d}. [{th['id']:5s}] {(th['name']+e)[:56]:56s} {th.get('sim') or '— neu bauen'}")
        print()
    ges = sum(len(k["themen"]) for k in ALLE_KAPITEL)
    print(f"{ges} Themen · {ges-len(OHNE_SIM)} mit fertiger Simulation · {len(OHNE_SIM)} ohne · "
          f"{len(NUR_E)} nur E-Kurs")
