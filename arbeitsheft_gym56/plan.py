# -*- coding: utf-8 -*-
"""Bauplan FELO PHYSIK 5/6 · Gymnasium NRW (G9).

Grundlage: Kernlehrplan Physik, Sekundarstufe I Gymnasium (Heft 3411, 2019),
Kapitel 2.2 - die vier fuer die ERPROBUNGSSTUFE obligatorischen Inhaltsfelder:

    (1) Temperatur und Waerme
    (2) Elektrischer Strom und Magnetismus
    (3) Schall
    (4) Licht

ANDERS ALS BEI DER REALSCHULE: Sterne und Weltall ist am Gymnasium
Inhaltsfeld 6 der zweiten Stufe - dieses Heft hat KEIN Himmelskapitel.
Dafuer verlangt der KLP hier ausdruecklich: Celsiusskala, Anomalie des
Wassers, UND-/ODER-Schaltungen, Modell der Elementarmagnete, Erdmagnetfeld,
Schalldruckpegel, Ultraschall/Infraschall, IR/sichtbar/UV.

Neu zu bauende Simulationen (gegen die Registry vom 02.09.2026 geprueft):
    anomalie-wasser (wm7) · und-oder-schaltung (sm6) · elementarmagnete (sm13)

Kennungen wm, sm, sl, li - kollisionsfrei gegen alle vergebenen
(m l s w sc h · o f g t · sp wd lt bg · kr bw en kw · mo ge ak ke ·
 oi ew st be kf el ev rk).
"""

KLASSE = "5/6"
SCHULFORM = "Gymnasium NRW"
KURSE = False          # keine Kursdifferenzierung am Gymnasium

RAHMEN = ("Lina und Aras sind in der 5. Klasse und haben sich für die Forscher-AG "
          "gemeldet. Herr Weber hat ihnen den Schlüssel zum kleinen Physikraum "
          "anvertraut: Dort stehen Kisten mit Geräten, die vor dem AG-Start geprüft "
          "werden müssen. Für jede geprüfte Station gibt es einen Stempel ins AG-Heft.")

KAPITEL = [
    {
        "id": "gym_waerme",
        "acc": (176, 106, 30),
        "titel": "Temperatur und Wärme",
        "inhaltsfeld": "Temperatur und Wärme (1)",
        "vorhaben": (
            "Die erste Kiste ist die Wetterkiste: Thermometer in allen Größen, eine "
            "Thermoskanne, Dämmplatten. Bevor die AG damit misst, müssen Lina und "
            "Aras klären, was die Geräte eigentlich anzeigen - und was nicht."),
        "themen": [
            {"id": "wm1", "name": "Wie misst man, wie warm etwas ist?",
             "sim": "thermometer"},
            {"id": "wm2", "name": "Sind Temperatur und Wärme dasselbe?",
             "sim": "temperatur-waerme"},
            {"id": "wm3", "name": "Auf welchen Wegen wandert Wärme?",
             "sim": "waermeuebertragung"},
            {"id": "wm4", "name": "Wie hält man Wärme auf?",
             "sim": "daemmung"},
            {"id": "wm5", "name": "Warum passt der heiße Deckel nicht mehr?",
             "sim": "waermeausdehnung"},
            {"id": "wm6", "name": "Fest, flüssig, gasförmig - was passiert beim Wechsel?",
             "sim": "aggregatzustaende"},
            {"id": "wm7", "name": "Warum schwimmt Eis oben?",
             "sim": "anomalie-wasser"},
        ],
    },
    {
        "id": "gym_strom",
        "acc": (46, 92, 178),
        "titel": "Strom und Magnete",
        "inhaltsfeld": "Elektrischer Strom und Magnetismus (2)",
        "vorhaben": (
            "In der zweiten Kiste liegen Batterien, Lämpchen, Kabel und ein Beutel "
            "voller Magnete. Herr Weber sagt: Erst wer eine Schaltung lesen und "
            "bauen kann, darf an die große Experimentierwand."),
        "themen": [
            {"id": "sm1",  "name": "Wann leuchtet das Lämpchen?",
             "sim": "stromkreis-lampe"},
            {"id": "sm2",  "name": "Wie zeichnet man einen Stromkreis?",
             "sim": "schaltplan"},
            {"id": "sm3",  "name": "Welche Stoffe lassen Strom hindurch?",
             "sim": "leiter-nichtleiter"},
            {"id": "sm4",  "name": "Was ändert sich, wenn Lampen hintereinander hängen?",
             "sim": "reihenschaltung-rs"},
            {"id": "sm5",  "name": "Was ändert sich, wenn jede Lampe ihren eigenen Weg hat?",
             "sim": "parallelschaltung-rs"},
            {"id": "sm6",  "name": "UND oder ODER - wie schalten zwei Schalter zusammen?",
             "sim": "und-oder-schaltung"},
            {"id": "sm7",  "name": "Was kann der Strom alles bewirken?",
             "sim": "stromwirkungen"},
            {"id": "sm8",  "name": "Was fließt da eigentlich im Draht?",
             "sim": "elektronen-drift"},
            {"id": "sm9",  "name": "Wozu gibt es Sicherungen?",
             "sim": "stromgefahren"},
            {"id": "sm10", "name": "Wo zieht ein Magnet am stärksten?",
             "sim": "magnetpole"},
            {"id": "sm11", "name": "Was zieht ein Magnet an - und was nicht?",
             "sim": "magnet-stoffe"},
            {"id": "sm12", "name": "Wie sieht man das Unsichtbare um den Magneten?",
             "sim": "magnetfeld"},
            {"id": "sm13", "name": "Wie wird ein Nagel selbst zum Magneten?",
             "sim": "elementarmagnete"},
            {"id": "sm14", "name": "Warum zeigt der Kompass nach Norden?",
             "sim": "kompass"},
        ],
    },
    {
        "id": "gym_schall",
        "acc": (130, 60, 140),
        "titel": "Schall",
        "inhaltsfeld": "Schall (3)",
        "vorhaben": (
            "Die dritte Kiste klappert: Stimmgabeln, eine kleine Trommel, Saiten "
            "auf einem Brett. Die AG soll beim Schulfest eine Hörstation aufbauen - "
            "aber vorher muss klar sein, was Töne eigentlich sind."),
        "themen": [
            {"id": "sl1", "name": "Wie entsteht ein Ton?",
             "sim": "ton-entsteht"},
            {"id": "sl2", "name": "Was macht einen Ton hoch oder tief?",
             "sim": "tonhoehe"},
            {"id": "sl3", "name": "Was macht einen Ton laut oder leise?",
             "sim": "lautstaerke"},
            {"id": "sl4", "name": "Wie kommt der Schall zu uns?",
             "sim": "schallausbreitung"},
            {"id": "sl5", "name": "Warum hallt es in der Turnhalle?",
             "sim": "schall"},
            {"id": "sl6", "name": "Wann wird Schall zu Lärm?",
             "sim": "laermschutz"},
            {"id": "sl7", "name": "Wie hört das Ohr?",
             "sim": "ohr"},
            {"id": "sl8", "name": "Was hören Tiere, was wir nicht hören?",
             "sim": "tonhoehe"},
        ],
    },
    {
        "id": "gym_licht",
        "acc": (200, 150, 30),
        "titel": "Licht",
        "inhaltsfeld": "Licht (4)",
        "vorhaben": (
            "Zum Schluss die Lichtkiste: Taschenlampen, ein Karton mit einem "
            "winzigen Loch, dunkle und helle Stoffreste. Damit soll ein "
            "Dunkelraum für den Tag der offenen Tür entstehen."),
        "themen": [
            {"id": "li1", "name": "Wie breitet sich Licht aus?",
             "sim": "lichtausbreitung"},
            {"id": "li2", "name": "Warum sehen wir Dinge?",
             "sim": "sehen"},
            {"id": "li3", "name": "Warum spiegelt das eine und das andere nicht?",
             "sim": "licht-oberflaeche"},
            {"id": "li4", "name": "Warum wird Dunkles in der Sonne heißer?",
             "sim": "dunkle-flaechen"},
            {"id": "li5", "name": "Wie entsteht ein Schatten?",
             "sim": "schatten-entstehung"},
            {"id": "li6", "name": "Wovon hängt die Größe des Schattens ab?",
             "sim": "schatten-groesse"},
            {"id": "li7", "name": "Warum hat ein Schatten manchmal einen Rand?",
             "sim": "kern-halbschatten"},
            {"id": "li8", "name": "Wie malt eine Lochkamera ein Bild?",
             "sim": "lochkamera"},
            {"id": "li9", "name": "Welches Licht sehen wir nicht?",
             "sim": "spektrum-unsichtbar"},
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
