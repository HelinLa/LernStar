# -*- coding: utf-8 -*-
"""Bauplan des Forscherhefts Physik Klasse 9 Realschule.

Die Themen stehen so in content.js unter klasse9_rs und werden NICHT neu erfunden.
Auch die Zuordnung Thema -> Simulation (Feld exp) und Thema -> Video kommt von dort.

"sim": None bedeutet: Fuer dieses Thema gibt es in physics-sim.js noch KEINE
Simulation. Weil im Heft an der Simulation geforscht wird, muss sie vorher
gebaut werden - sonst zeigt der QR-Code ins Leere.
"""

RAHMEN = ("Ben und Mia sind vierzehn. Vor dem Umzug räumen sie mit Bens Vater den Keller "
          "aus, fahren mit dem Transporter in die neue Wohnung und tragen alles in den "
          "dritten Stock. Am Ende steht die Frage, woher der Strom kommt, der dort aus "
          "der Dose fällt.")

KLASSE = 9
SCHULFORM = "Realschule NRW"

KAPITEL = [
    {
        "id": "kraefte",
        "acc": (176, 92, 48),
        "vorhaben": (
            "Vor dem Umzug muss der Keller leer werden. Bens Vater hat zwei Bretter über die "
            "Kellertreppe gelegt, dazu liegen ein Seil, ein alter Teppichrest und die Federwaage "
            "aus dem Physikraum bereit. Die Umzugskisten sind schwerer, als sie aussehen. Am Ende "
            "des Nachmittags wissen Ben und Mia, warum manches leicht geht und manches gar nicht."),
        "titel": "Kräfte – wenn etwas schiebt, zieht oder verformt",
        "themen": [
            {"id": "kr1", "name": "Woran erkennt man, dass eine Kraft wirkt?",
             "video": "kraft-wirkung.mp4", "sim": "kraft-wirkung"},
            {"id": "kr2", "name": "Was kann eine Kraft alles bewirken?",
             "video": "kraft-wirkungen.mp4", "sim": "kraft-wirkungen"},
            {"id": "kr3", "name": "Wie misst man eine Kraft?",
             "video": "kraftmesser.mp4", "sim": "kraftmesser"},
            {"id": "kr4", "name": "Warum wird eine Feder gleichmäßig länger? (Hooke)",
             "video": "federgesetz.mp4", "sim": "federgesetz"},
            {"id": "kr5", "name": "Ist „schwer“ dasselbe wie „viel Masse“?",
             "video": "masse-gewicht.mp4", "sim": "masse-gewicht"},
            {"id": "kr6", "name": "Wäre ich auf dem Mond wirklich leichter?",
             "video": "ortsfaktor.mp4", "sim": "ortsfaktor"},
            {"id": "kr7", "name": "Hat eine Kraft auch eine Richtung?",
             "video": "kraftpfeil.mp4", "sim": "kraftpfeil"},
            {"id": "kr8", "name": "Was passiert, wenn zwei Kräfte gleichzeitig ziehen?",
             "video": "kraefte-addieren.mp4", "sim": "kraefte-addieren"},
            {"id": "kr9", "name": "Warum bewegt sich ein ruhender Körper nicht?",
             "video": "kraefte-gleichgewicht.mp4", "sim": "kraefte-gleichgewicht"},
            {"id": "kr10", "name": "Kraft und Gegenkraft: Warum drücke ich zurück?",
             "video": "wechselwirkung.mp4", "sim": "wechselwirkung"},
            {"id": "kr11", "name": "Warum geht ein Stein über eine Rampe leichter hoch?",
             "video": "schiefe-ebene.mp4", "sim": "schiefe-ebene"},
            {"id": "kr12", "name": "Warum bremst mich der Boden aus? (Reibung)",
             "video": "reibung-rs.mp4", "sim": "reibung-rs"},
        ],
    },
    {
        "id": "bewegung",
        "acc": (38, 108, 158),
        "vorhaben": (
            "Der Keller ist leer, der Transporter beladen. Auf der Fahrt sitzt Mia mit dem Handy "
            "am Fenster und misst mit, wie weit sie in welcher Zeit kommen. Ben achtet darauf, "
            "was ihn beim Anfahren in den Sitz drückt und was beim Bremsen mit der Kiste im "
            "Fußraum passiert."),
        "titel": "Bewegung – schneller, langsamer, immer schneller",
        "themen": [
            {"id": "bw1", "name": "Wie beschreibt man eine Bewegung? (Weg & Zeit)",
             "video": "bewegung-beschreiben.mp4", "sim": "bewegung-beschreiben"},
            {"id": "bw2", "name": "Was bedeutet „schnell“? (v = s/t)",
             "video": "geschwindigkeit-rs.mp4", "sim": "geschwindigkeit-rs"},
            {"id": "bw3", "name": "Was ist eine gleichförmige Bewegung?",
             "video": "gleichfoermige-bewegung.mp4", "sim": "gleichfoermige-bewegung"},
            {"id": "bw4", "name": "Wie lese ich aus einem Diagramm, was ein Körper gerade tut?",
             "video": "s-t-diagramm-deuten.mp4", "sim": "s-t-diagramm-deuten"},
            {"id": "bw5", "name": "Was passiert, wenn ein Körper immer schneller wird?",
             "video": "beschleunigung-jg9.mp4", "sim": "beschleunigung-jg9"},
            {"id": "bw6", "name": "Warum wird ein Auto gleichmäßig schneller – und was heißt das in Zahlen?",
             "video": "beschleunigung-formel-jg9.mp4", "sim": "beschleunigung-formel-jg9"},
            {"id": "bw7", "name": "Was ist der Unterschied zwischen schneller werden und langsamer werden?",
             "video": "verzoegerung-jg9.mp4", "sim": "verzoegerung-jg9"},
            {"id": "bw8", "name": "Warum braucht ein Auto zum Bremsen viel mehr Platz, als man denkt?",
             "video": "bremsweg-jg9.mp4", "sim": "bremsweg-jg9"},
            {"id": "bw9", "name": "Warum fällt ein schwerer Stein nicht schneller als ein leichter?",
             "video": "freier-fall-jg9.mp4", "sim": "freier-fall-jg9"},
            {"id": "bw10", "name": "Warum fällt eine Feder langsamer als ein Stein – liegt es wirklich am Gewicht?",
             "video": "luftwiderstand-jg9.mp4", "sim": "luftwiderstand-jg9"},
            {"id": "bw11", "name": "Warum bewegt sich nichts von allein schneller – wer oder was steckt dahinter?",
             "video": "traegheit.mp4", "sim": "traegheit-rs"},
            {"id": "bw12", "name": "Warum werde ich beim Anfahren in den Sitz gedrückt und beim Bremsen nach vorn geworfen?",
             "video": "traegheit-alltag.mp4", "sim": "traegheit-alltag"},
            {"id": "bw13", "name": "Warum fühlt man sich im freien Fall schwerelos, obwohl die Erde weiter zieht?",
             "video": "schwerelosigkeit.mp4", "sim": "schwerelosigkeit"},
            {"id": "bw14", "name": "Warum schweben Astronauten in der Raumstation, obwohl sie ständig „fallen“?",
             "video": "orbit.mp4", "sim": "orbit"},
            {"id": "bw15", "name": "Wie schafft es eine Rakete, sich im Weltall abzustoßen, wo doch nichts da ist?",
             "video": "rueckstoss.mp4", "sim": "rueckstoss"},
        ],
    },
    {
        "id": "energie",
        "acc": (196, 148, 34),
        "vorhaben": (
            "In der neuen Wohnung muss alles in den dritten Stock. Treppe oder Aufzug, schnell oder "
            "langsam, tragen oder ziehen – am Abend sind alle erschöpft, und niemand kann sagen, "
            "wo die Kraft geblieben ist. Genau das ist die Frage dieses Kapitels."),
        "titel": "Energie, Arbeit & Leistung",
        "themen": [
            {"id": "en1", "name": "Was haben eine gespannte Feder, ein heißer Tee und ein rollender Ball gemeinsam?",
             "video": "energie.mp4", "sim": "energieformen"},
            {"id": "en2", "name": "Wann leiste ich in der Physik wirklich „Arbeit“ – und wann nicht?",
             "video": "arbeit.mp4", "sim": "arbeit"},
            {"id": "en3", "name": "Warum kostet Treppensteigen mehr Kraft als Geradeausgehen?",
             "video": "hubarbeit.mp4", "sim": "arbeit"},
            {"id": "en4", "name": "Wo steckt Energie in einem Gegenstand, der ganz oben liegt?",
             "video": "lageenergie.mp4", "sim": "lageenergie"},
            {"id": "en5", "name": "Warum kann ein rollender Ball etwas umwerfen – woher nimmt er die Kraft?",
             "video": "bewegungsenergie.mp4", "sim": "bewegungsenergie"},
            {"id": "en6", "name": "Wohin verschwindet die Energie, wenn ein Ball einfach liegen bleibt?",
             "video": "reibungswaerme.mp4", "sim": "reibungswaerme"},
            {"id": "en7", "name": "Kann Energie einfach verschwinden – oder wandelt sie sich nur um?",
             "video": "energieerhaltung.mp4", "sim": "energieerhaltung"},
            {"id": "en8", "name": "Warum wird eine Achterbahn oben langsam und unten schnell?",
             "video": "achterbahn.mp4", "sim": "achterbahn"},
            {"id": "en9", "name": "Warum wird beim Bremsen und Reiben immer alles warm?",
             "video": "energieentwertung.mp4", "sim": "reibungswaerme"},
            {"id": "en10", "name": "Bekomme ich aus einer Maschine je so viel heraus, wie ich hineinstecke?",
             "video": "wirkungsgrad.mp4", "sim": "wirkungsgrad"},
            {"id": "en11", "name": "Warum ist keine Maschine perfekt – wo geht die Energie verloren?",
             "video": "wirkungsgrad-verluste.mp4", "sim": "wirkungsgrad"},
            {"id": "en12", "name": "Warum ist schnell arbeiten anstrengender als langsam – obwohl die Arbeit gleich ist?",
             "video": "leistung.mp4", "sim": "leistung-rs"},
            {"id": "en13", "name": "Was bedeutet eigentlich „100 PS\" oder „2000 Watt\"?",
             "video": "leistung-einheiten.mp4", "sim": "leistung-rs"},
            {"id": "en14", "name": "Wenn Energie nie verloren geht – warum müssen wir dann Energie sparen?",
             "video": "energie-entwerten.mp4", "sim": "energie-entwerten"},
        ],
    },
    {
        "id": "kraftwerke",
        "acc": (58, 122, 92),
        "vorhaben": (
            "Im neuen Haus zeigt ein Zähler im Flur, wie viel Strom die Familie verbraucht. Ben "
            "drückt einen Schalter und fragt, woher der Strom in diesem Augenblick eigentlich "
            "kommt. Die Antwort führt vom Zähler bis zum Kraftwerk – und weiter bis zum Klima."),
        "titel": "Kraftwerke, Energieversorgung & Klimaschutz",
        "themen": [
            {"id": "kw1", "name": "Woher kommt eigentlich der Strom, wenn ich einen Schalter drücke?",
             "video": "energiekette.mp4", "sim": None},
            {"id": "kw2", "name": "Wie wird aus Bewegung oder Wärme nutzbarer Strom?",
             "video": "generator.mp4", "sim": "generator"},
            {"id": "kw3", "name": "Warum haben so viele Kraftwerke dasselbe Grundprinzip – egal welcher Brennstoff?",
             "video": "waermekraftwerk.mp4", "sim": None},
            {"id": "kw4", "name": "Was passiert mit unserem Brennstoff, wenn er einmal verbrannt ist?",
             "video": "fossile-energie.mp4", "sim": None},
            {"id": "kw5", "name": "Wie kann man Strom gewinnen, ohne etwas zu verbrennen?",
             "video": "regenerative-energie.mp4", "sim": None},
            {"id": "kw6", "name": "Wie holt man Energie aus Sonne, Wind und Wasser?",
             "video": "sonne-wind-wasser.mp4", "sim": None},
            {"id": "kw7", "name": "Warum reicht es nicht, einfach nur viele Windräder aufzustellen?",
             "video": "volatilitaet.mp4", "sim": None},
            {"id": "kw8", "name": "Wie kann man Energie aufheben, bis man sie wirklich braucht?",
             "video": "energiespeicher.mp4", "sim": None},
            {"id": "kw9", "name": "Warum verändert das Verbrennen von Kohle, Öl und Gas das Klima der ganzen Erde?",
             "video": "treibhauseffekt.mp4", "sim": None},
            {"id": "kw10", "name": "Warum ist ein bisschen Treibhauseffekt lebenswichtig – und zu viel gefährlich?",
             "video": "natuerlicher-treibhauseffekt.mp4", "sim": None},
            {"id": "kw11", "name": "Woran erkennt man, dass sich das Klima wirklich ändert?",
             "video": "wetter-klima.mp4", "sim": None},
            {"id": "kw12", "name": "Wie können wir Energie nutzen, ohne die Zukunft zu belasten?",
             "video": "nachhaltigkeit.mp4", "sim": None},
            {"id": "kw13", "name": "Wie könnte die Energieversorgung meiner Stadt in 30 Jahren aussehen?",
             "video": "energiemix.mp4", "sim": None},
        ],
    },
]

# Welche Kapitel schon Inhalt haben und deshalb ins Heft kommen. Kapitel 2 bis 4
# brauchen zuerst Simulationen (28 fehlen noch), sonst zeigen ihre QR-Codes ins
# Leere. Sobald ein Kapitel fertig ist, hier eintragen - alles andere zieht mit.
FERTIG = ["kraefte", "bewegung", "energie", "kraftwerke"]
ALLE_KAPITEL = KAPITEL
KAPITEL = [k for k in ALLE_KAPITEL if k["id"] in FERTIG]

# Das Heft gehoert zur App: Geforscht wird an der Simulation, eingetragen und
# gesichert wird auf dem Blatt. Ein Tischversuch steht nur als "Gegenprobe am
# Tisch" am Ende - siehe Klasse 5 und 7.
THEMEN = [th for k in KAPITEL for th in k["themen"]]
# Nur Themen mit Simulation bekommen den Bildschirm-Hinweis und einen QR-Code.
# Kapitel 4 arbeitet ueberwiegend mit gedruckten Datenblaettern.
AM_BILDSCHIRM = {th["id"] for th in THEMEN if th["sim"]}
SIM = {th["id"]: th["sim"] for th in THEMEN if th["sim"]}
VIDEO = {th["id"]: th["video"] for th in THEMEN if th.get("video")}
OHNE_SIM = [th["id"] for k in ALLE_KAPITEL for th in k["themen"] if not th["sim"]]
KAPITEL_VON = {th["id"]: k["id"] for k in ALLE_KAPITEL for th in k["themen"]}

if __name__ == "__main__":
    print(f"Forscherheft Klasse {KLASSE} · {SCHULFORM}")
    for i, k in enumerate(KAPITEL, 1):
        fehlt = sum(1 for th in k["themen"] if not th["sim"])
        print(f"\nKapitel {i} · {k['titel']}  ({len(k['themen'])} Themen, {fehlt} ohne Simulation)")
        for j, th in enumerate(k["themen"], 1):
            m = "  " if th["sim"] else " !"
            print(f"  {m} {j:2d}. [{th['id']}] {th['name']}")
    print(f"\n{len(THEMEN)} Themen · {len(SIM)} mit Simulation · {len(OHNE_SIM)} ohne")
