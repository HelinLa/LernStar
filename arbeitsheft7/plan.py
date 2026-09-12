# -*- coding: utf-8 -*-
"""Bauplan des Forscherhefts Physik Klasse 7 Realschule.

Eine einzige Quelle fuer Kapitel, Themen, Videos und Simulationen. Alles andere
(Seitensatz, Textebene, Bildeinlesen) kommt unveraendert aus ../arbeitsheft/.

Die Themen stehen so in content.js unter klasse7_rs und werden NICHT neu erfunden -
neu sind nur die Buendelung zu vier Kapiteln und die Reihenfolge. Bewegung, Kraft
und Hebel bleiben draussen: In LernStar sind das drei Kapitel mit 2, 1 und 1 Thema,
und sie haetten den Licht-Faden mittendrin zerschnitten.
"""

KLASSE = 7
SCHULFORM = "Realschule NRW"

# Der Bogen des ganzen Hefts: Ben und Mia bauen ein Fernrohr und schauen damit
# in den Himmel. Kapitel 1 klaert, was ein Glas mit dem Licht macht; Kapitel 2,
# warum das erste Bild Farbsaeume hat; Kapitel 3, was da oben steht und warum es
# wandert; Kapitel 4 setzt zwei Linsen zum Fernrohr zusammen und blickt weiter.
RAHMEN = ("Bens Opa war Optiker. Auf dem Dachboden steht seine Kiste: Lupen, Brillengläser, "
          "eine alte Kamera ohne Objektiv. Am Freitag ist Neumond – die dunkelste Nacht im Monat. "
          "Bis dahin wollen Ben und Mia ein Fernrohr bauen, das den Saturn zeigt.")

KAPITEL = [
    {
        "id": "optik",
        "titel": "Optik: Wie wir sehen",
        "acc": (192, 138, 30),
        "vorhaben": (
            "Auf dem Dachboden steht die Kiste von Bens Opa. Er war Optiker. Darin liegen Lupen, "
            "Brillengläser in allen Stärken und eine alte Kamera ohne Objektiv. Am Freitag ist "
            "Neumond, dann ist der Himmel am dunkelsten. Bis dahin soll ein Fernrohr stehen. "
            "Vorher müsst ihr wissen, was so ein Glas mit dem Licht macht."),
        "themen": [
            {"id": "o1", "name": "Wie macht ein kleines Loch ein Bild? (Lochkamera)",
             "video": "lochkamera.mp4", "sim": "lochkamera"},
            {"id": "o2", "name": "Wie bündelt eine Sammellinse das Licht?",
             "video": "sammellinse.mp4", "sim": "sammellinse"},
            {"id": "o8", "name": "Sammellinse und Zerstreuungslinse im Vergleich",
             "video": None, "sim": "sammellinse", "neu": True},
            {"id": "o3", "name": "Wann entsteht ein vergrößertes oder verkleinertes Bild?",
             "video": "bild-linse.mp4", "sim": "bild-linse"},
            {"id": "o4", "name": "Wie funktioniert eine Lupe?",
             "video": "lupe.mp4", "sim": "lupe"},
            {"id": "o5", "name": "Wie funktioniert eine Kamera?",
             "video": "kamera.mp4", "sim": "kamera"},
            {"id": "o6", "name": "Wie funktioniert das Auge?",
             "video": "auge.mp4", "sim": "auge"},
            {"id": "o7", "name": "Wie korrigiert eine Brille Sehfehler?",
             "video": "brille.mp4", "sim": "brille"},
        ],
    },
    {
        "id": "farben",
        "titel": "Spiegel, Brechung & Farben",
        "acc": (31, 122, 116),
        "vorhaben": (
            "Das erste Fernrohr steht. Es zeigt tatsächlich ein Bild – aber jede helle Kante hat "
            "einen blauen und einen roten Saum, und abends spiegelt sich im Okular das halbe Zimmer. "
            "Daneben auf dem Tisch steht ein Wasserglas, und der Löffel darin sieht geknickt aus. "
            "Alles drei passiert dort, wo Licht auf eine Grenze trifft: Ein Teil kommt zurück, ein "
            "Teil läuft weiter – und ändert dabei seine Richtung."),
        "themen": [
            # Erst was an einer Grenze ueberhaupt geschieht, dann das Gesetz dahinter,
            # dann die Anwendungen. Vorher sprang das Kapitel ohne Reflexionsgesetz
            # direkt ins Spiegelbild und ohne Richtungsregel direkt in die Brechung.
            {"id": "f8", "name": "Was passiert, wenn Licht auf eine Oberfläche trifft?",
             "video": None, "sim": "licht-oberflaeche", "neu": True},
            {"id": "f9", "name": "Nach welcher Regel wird Licht an einem Spiegel zurückgeworfen?",
             "video": "reflexion.mp4", "sim": "reflexionsgesetz", "neu": True},
            {"id": "f1", "name": "Wie entsteht ein Spiegelbild?",
             "video": "spiegelbild.mp4", "sim": "spiegelbild"},
            {"id": "f10", "name": "Wo ändert das Licht beim Übergang von Luft in Glas seine Richtung?",
             "video": None, "sim": "brechung-eintritt", "neu": True},
            {"id": "f2", "name": "Warum erscheint ein Gegenstand im Wasser verschoben?",
             "video": "brechung.mp4", "sim": "brechung"},
            {"id": "f3", "name": "Wovon hängt die Stärke der Brechung ab?",
             "video": "brechungswinkel.mp4", "sim": "brechungswinkel"},
            {"id": "f11", "name": "Was geschieht beim Übergang von Glas in Luft?",
             "video": None, "sim": "brechung-austritt", "neu": True},
            {"id": "f4", "name": "Wie funktioniert ein Lichtleiter?",
             "video": "totalreflexion.mp4", "sim": "totalreflexion"},
            {"id": "f5", "name": "Welche Farben stecken im weißen Licht?",
             "video": "prisma.mp4", "sim": "prisma"},
            {"id": "f6", "name": "Wie entstehen die Farben eines Regenbogens?",
             "video": "regenbogen.mp4", "sim": "regenbogen"},
        ],
    },
    {
        "id": "himmel7",
        "titel": "Sonne, Planeten und Schwerkraft",
        "acc": (190, 68, 56),
        "vorhaben": (
            "Freitagnacht auf dem Feld hinter dem Haus. Das Fernrohr steht, der Himmel ist klar. "
            "Aber was steht da oben eigentlich – und warum ist der helle Punkt nach zwei Minuten "
            "aus dem Bild gewandert, ohne dass jemand das Rohr angefasst hat? Mia notiert jede "
            "Uhrzeit. Ben stößt das Okular vom Tisch; es liegt sofort im Gras."),
        "themen": [
            {"id": "g1", "name": "Sonne, Mond und Sterne – was leuchtet am Himmel?",
             "video": "himmelskoerper.mp4", "sim": "himmelskoerper"},
            {"id": "g2", "name": "Wie entstehen Tag und Nacht?",
             "video": "tag-nacht.mp4", "sim": "tag-nacht"},
            {"id": "g3", "name": "Die Gravitation – warum fällt alles nach unten?",
             "video": "gravitation.mp4", "sim": "gravitation"},
            # Ohne diese Seite behaupten g6 und g8 nur, dass die Anziehung
            # verschieden stark ist - warum, stand nirgends. Masse und Abstand
            # sind die Voraussetzung fuer die Umlaufbahn UND fuer die Gezeiten.
            {"id": "g9", "name": "Wovon hängt die Anziehung zweier Körper ab?",
             "video": None, "sim": "gravitation-abstand", "neu": True},
            {"id": "g6", "name": "Warum fallen die Planeten nicht in die Sonne?",
             "video": None, "sim": "planetenbahn", "neu": True},
            {"id": "g7", "name": "Acht Planeten, zwei Sorten",
             "video": None, "sim": "sonnensystem", "neu": True},
            {"id": "g8", "name": "Wäre ich auf dem Mond wirklich leichter?",
             "video": "ortsfaktor.mp4", "sim": "ortsfaktor", "neu": True},
            # Der Mond kam bisher nur als "leuchtet nicht selbst" und "zieht
            # schwaecher" vor. Hier zieht er zurueck - die Anziehung wirkt in
            # beide Richtungen, und die Abstandsabhaengigkeit aus g9 wird sichtbar.
            {"id": "g10", "name": "Warum steigt und fällt das Meer zweimal am Tag?",
             "video": None, "sim": "gezeiten", "neu": True},
            {"id": "g4", "name": "Wie groß ist das Sonnensystem wirklich?",
             "video": "weltall-aufbau.mp4", "sim": "weltall-aufbau"},
            {"id": "g5", "name": "Wie weit ist es im Weltall? (Lichtjahr)",
             "video": "entfernungen.mp4", "sim": "entfernungen"},
        ],
    },
    {
        "id": "teleskop",
        "titel": "Sterne, Galaxien und der Anfang",
        "acc": (91, 62, 124),
        "vorhaben": (
            "Der Saturn ist im Fernrohr nur ein winziger Punkt mit Henkeln. Ben will mehr. Im Netz "
            "stehen Aufnahmen von Teleskopen, die Dinge zeigen, für die kein Auge gebaut ist, und "
            "Entfernungen, für die Kilometer nicht mehr reichen. Am Ende steht die Frage, wie weit "
            "man überhaupt zurückschauen kann."),
        "themen": [
            {"id": "t1", "name": "Wie holt ein Teleskop ferne Objekte näher heran?",
             "video": "teleskop.mp4", "sim": "teleskop"},
            {"id": "t2", "name": "Wie sieht man mit besonderen Teleskopen unsichtbares Licht?",
             "video": "spezialteleskop.mp4", "sim": "spezialteleskop"},
            {"id": "t6", "name": "Warum leuchtet ein Stern – und warum nicht ewig?",
             "video": "kernfusion.mp4", "sim": "sternleben", "neu": True},
            {"id": "t7", "name": "Woraus bestehen die Sterne?",
             "video": None, "sim": "sternspektrum", "neu": True},
            {"id": "t8", "name": "Die Milchstraße – wo stehen wir?",
             "video": None, "sim": "milchstrasse", "neu": True},
            {"id": "t3", "name": "Wie hat sich die Vorstellung vom Weltall verändert?",
             "video": "weltbild.mp4", "sim": "weltbild"},
            {"id": "t4", "name": "Was passiert bei einem schwarzen Loch?",
             "video": "schwarzes-loch.mp4", "sim": "schwarzes-loch"},
            {"id": "t5", "name": "Wie ist das Weltall entstanden? (Urknall)",
             "video": "urknall.mp4", "sim": "urknall"},
        ],
    },
]

# Themen, deren Versuch am Bildschirm stattfindet statt am Tisch. Der Schritt heisst
# weiter "Forschen", fuehrt aber durch die Simulation: einstellen, beobachten,
# in dieselbe Tabelle eintragen.
# Themen, deren Versuch am Bildschirm stattfindet statt am Tisch. Der Schritt heisst
# dann "Forschen am Bildschirm" und fuehrt durch die Simulation: einstellen,
# beobachten, in dieselbe Tabelle eintragen.
#
# Das gilt fuer ALLE Kapitel. Das Heft gehoert zur App: Geforscht wird an der
# Simulation, eingetragen und gesichert wird auf dem Blatt. Wo ein Tischversuch
# mit einfachen Mitteln trotzdem moeglich ist (Spiegel, Glas Wasser, Loeffel,
# Lupe, Globus, Magnet, Luftballon), steht er als letzter Schritt als
# "Gegenprobe am Tisch" - als Bestaetigung, nicht als Hauptversuch.
AM_BILDSCHIRM = {th["id"] for k in KAPITEL for th in k["themen"]}

THEMEN = [th for k in KAPITEL for th in k["themen"]]
SIM = {th["id"]: th["sim"] for th in THEMEN}
VIDEO = {th["id"]: th["video"] for th in THEMEN if th.get("video")}
NEU   = [th["id"] for th in THEMEN if th.get("neu")]
KAPITEL_VON = {th["id"]: k["id"] for k in KAPITEL for th in k["themen"]}

if __name__ == "__main__":
    print(f"Forscherheft Klasse {KLASSE} · {SCHULFORM}")
    for i, k in enumerate(KAPITEL, 1):
        print(f"\nKapitel {i} · {k['titel']}  ({len(k['themen'])} Themen)")
        for j, th in enumerate(k["themen"], 1):
            print(f"   {j}. [{th['id']}] {th['name']}")
    print(f"\n{len(THEMEN)} Themen · {len(KAPITEL)} Kapitel")
