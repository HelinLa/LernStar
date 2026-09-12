# -*- coding: utf-8 -*-
"""Bauplan des Forscherhefts Physik Klasse 8 Realschule.

Die Themen stehen so in content.js unter klasse8_rs und werden NICHT neu erfunden.
Dort sind 28 Themen eingetragen; drei davon sind Dubletten ("Spannung U (Volt) und
Stromstaerke I (Ampere)", "R = U/I", "P = U · I und Energie E = P · t"), die dieselbe
Sache noch einmal als Formelzeile fuehren. Uebrig bleiben 25 Forscherseiten.

Kennungen: sp (Spannung), wd (Widerstand), lt (Leistung), bg (Bewegung/Geschwindigkeit).
Sie muessen klassenuebergreifend eindeutig bleiben - der QR-Link traegt heft=<topicId>,
und heft-banner.js sucht die Kennung ohne zu wissen, aus welchem Heft sie stammt.
Belegt sind: Kl. 5/6 m l s w sc h, Kl. 7 o f g t, Kl. 9 kr bw en kw.

Alle 25 Simulationen liegen bereits in physics-sim.js - keine muss neu gebaut werden.
"""

RAHMEN = ("Ben und Mia sind dreizehn. Auf dem Hof steht die Seifenkiste vom letzten Sommer, "
          "daneben ein ausgebauter Akku, ein kleiner Motor aus einer alten Bohrmaschine und "
          "eine Kiste voller Kabel. Beim Stadtfest im Juni gibt es ein Rennen. Bis dahin soll "
          "die Kiste fahren – und die beiden wollen wissen, wie schnell.")

KLASSE = 8
SCHULFORM = "Realschule NRW"

KAPITEL = [
    {
        "id": "spannung",
        "titel": "Spannung, Strom und der erste Kreis",
        "acc": (46, 92, 178),
        "vorhaben": (
            "Der Akku aus dem alten Akkuschrauber hat noch Saft, der Motor dreht sich, wenn man "
            "ihn kurz anhält. Nur weiß niemand, welches Kabel wohin gehört und was die Zahlen auf "
            "dem Akku bedeuten. Bevor irgendetwas fährt, müsst ihr wissen, was da eigentlich "
            "fließt – und wie man es misst, ohne etwas kaputtzumachen."),
        "themen": [
            {"id": "sp1", "name": "Was ist elektrische Ladung?",
             "video": None, "sim": "ladung"},
            {"id": "sp2", "name": "Was ist der elektrische Strom (Stromstärke)?",
             "video": None, "sim": "stromstaerke"},
            {"id": "sp3", "name": "Was ist die elektrische Spannung?",
             "video": None, "sim": "spannung"},
            {"id": "sp4", "name": "Wie misst man Stromstärke und Spannung?",
             "video": None, "sim": "messen"},
            {"id": "sp5", "name": "Wovon hängt die Stromstärke ab?",
             "video": None, "sim": "stromabhaengigkeit"},
        ],
    },
    {
        "id": "widerstand",
        "titel": "Widerstand und das Ohmsche Gesetz",
        "acc": (176, 92, 48),
        "vorhaben": (
            "Die Kiste fährt – aber das dünne Kabel zum Motor wird nach einer Minute so warm, dass "
            "man es kaum anfassen kann, und der Motor läuft langsamer, als er soll. Bens Vater legt "
            "ein dickeres Kabel daneben und sagt nur: „Probiert es aus.“ Am Ende dieses Kapitels "
            "wisst ihr, warum das hilft und wie man es vorher ausrechnet."),
        "themen": [
            {"id": "wd1", "name": "Was ist ein elektrischer Widerstand?",
             "video": None, "sim": "widerstand"},
            {"id": "wd2", "name": "Das Ohmsche Gesetz – die U-I-Kennlinie",
             "video": None, "sim": "ohm-kennlinie"},
            {"id": "wd3", "name": "Wovon hängt der Widerstand eines Drahtes ab?",
             "video": None, "sim": "draht"},
            {"id": "wd4", "name": "Reihenschaltung von Widerständen",
             "video": None, "sim": "reihe-widerstand"},
            {"id": "wd5", "name": "Parallelschaltung von Widerständen",
             "video": None, "sim": "parallel-widerstand"},
            {"id": "wd6", "name": "Das Potentiometer – ein veränderbarer Widerstand",
             "video": None, "sim": "potentiometer"},
        ],
    },
    {
        "id": "leistung",
        "titel": "Leistung, Energie und was der Strom kostet",
        "acc": (192, 138, 30),
        "vorhaben": (
            "Nach zwölf Minuten ist der Akku leer, und das Rennen dauert eine halbe Stunde. Mia "
            "will wissen, ob ein zweiter Akku reicht oder ob der Motor zu viel zieht. Auf dem "
            "Ladegerät steht eine Wattzahl, auf der Stromrechnung stehen Kilowattstunden – und "
            "beides gehört zusammen."),
        "themen": [
            {"id": "lt1", "name": "Elektrische Leistung P = U · I",
             "video": None, "sim": "elektrische-leistung"},
            {"id": "lt2", "name": "Elektrische Energie E = P · t",
             "video": None, "sim": "elektrische-energie"},
            {"id": "lt3", "name": "Was kostet elektrische Energie? (kWh)",
             "video": None, "sim": "stromkosten"},
            {"id": "lt4", "name": "Energie sparen im Haushalt",
             "video": None, "sim": "energiesparen"},
            {"id": "lt5", "name": "Gefahren des elektrischen Stroms & Schutz",
             "video": None, "sim": "stromgefahren"},
        ],
    },
    {
        "id": "tempo",
        "titel": "Geschwindigkeit: wie schnell ist schnell?",
        "acc": (31, 122, 116),
        "vorhaben": (
            "Die Kiste fährt, der Akku hält durch. Bleibt die Frage, die am Anfang stand: Wie "
            "schnell ist das Ding eigentlich? Auf dem Hof sind 50 Meter abgemessen, es gibt eine "
            "Stoppuhr und ein Handy mit Kamera. Am Ende des Kapitels könnt ihr die Fahrt nicht nur "
            "messen, sondern auch aufzeichnen und ablesen."),
        "themen": [
            {"id": "bg1", "name": "Was bedeutet Geschwindigkeit?",
             "video": None, "sim": "v-begriff"},
            {"id": "bg2", "name": "Wie misst man eine Geschwindigkeit?",
             "video": None, "sim": "v-messen"},
            {"id": "bg3", "name": "Wie berechnet man eine Geschwindigkeit? (v = s/t)",
             "video": None, "sim": "v-formel"},
            {"id": "bg4", "name": "Wie werden m/s und km/h umgerechnet?",
             "video": None, "sim": "v-umrechnung"},
            {"id": "bg5", "name": "Was ist eine gleichförmige Bewegung?",
             "video": None, "sim": "gleichfoermig-rs"},
            {"id": "bg6", "name": "Was ist eine beschleunigte Bewegung?",
             "video": None, "sim": "beschleunigung-rs"},
            {"id": "bg7", "name": "Wie stellt man eine Bewegung im Weg-Zeit-Diagramm dar?",
             "video": None, "sim": "weg-zeit-diagramm"},
            {"id": "bg8", "name": "Wie liest man ein Geschwindigkeit-Zeit-Diagramm?",
             "video": None, "sim": "v-zeit-diagramm"},
            {"id": "bg9", "name": "Wie funktioniert eine Geschwindigkeitsmessung im Straßenverkehr?",
             "video": None, "sim": "verkehr-messung"},
        ],
    },
]

# ── Abgeleitete Nachschlagetabellen (wie in Klasse 7 und 9) ──────────────
FERTIG = ["spannung", "widerstand", "leistung", "tempo"]
ALLE_KAPITEL = KAPITEL
KAPITEL = [k for k in ALLE_KAPITEL if k["id"] in FERTIG]

THEMEN = [th for k in KAPITEL for th in k["themen"]]
AM_BILDSCHIRM = {th["id"] for th in THEMEN if th["sim"]}
SIM = {th["id"]: th["sim"] for th in THEMEN if th["sim"]}
VIDEO = {th["id"]: th["video"] for th in THEMEN if th.get("video")}
OHNE_SIM = [th["id"] for k in ALLE_KAPITEL for th in k["themen"] if not th["sim"]]
KAPITEL_VON = {th["id"]: k["id"] for k in ALLE_KAPITEL for th in k["themen"]}
