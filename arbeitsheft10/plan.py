# -*- coding: utf-8 -*-
"""Bauplan des Forscherhefts Physik Klasse 10 Realschule.

Die Themen stehen so in content.js unter klasse10_rs und werden NICHT neu erfunden;
auch die Videodateien kommen von dort. Uebernommen sind 47 Themen - die drei
Zusammenfassungseintraege am Ende ("Kern & Elektronenhuelle", "α-, β- und
γ-Strahlung & Halbwertszeit", "Energieformen, Umwandlung & Wirkungsgrad") stehen
in der App als Ueberblick und wiederholen den Stoff der Kapitel; im Heft haetten
sie keine eigene Forscherfrage.

"sim": None bedeutet: Fuer dieses Thema gibt es in physics-sim.js noch KEINE
Simulation. Weil im Heft an der Simulation geforscht wird, muss sie vorher
gebaut werden - sonst zeigt der QR-Code ins Leere.

"duenn": True markiert Simulationen, die es zwar gibt, die aber nur aus ein paar
Schiebereglern bestehen (Bauart _simModalHTML, 35 bis 60 Zeilen). Sie tragen
keine Forscherseite, solange sie nicht auf den Stand der uebrigen gebracht sind.

Kennungen: mo · ge · ak · ke - keine kollidiert mit den 148 vergebenen
(m l s w sc h · o f g t · sp wd lt bg · kr bw en kw).
"""

RAHMEN = ("Ben und Mia sind sechzehn und machen zwei Wochen Praktikum. Mia geht in die "
          "Radiologie des Kreiskrankenhauses, Ben zu den Stadtwerken ins Umspannwerk. "
          "Abends erzählen sie sich, was sie gesehen haben - und merken, dass hinter "
          "beidem dieselbe Physik steckt.")

KLASSE = 10
SCHULFORM = "Realschule NRW"

KAPITEL = [
    {
        "id": "motor",
        "acc": (46, 92, 178),
        "titel": "Magnetfeld, Kraft und Motor",
        "vorhaben": (
            "Im Umspannwerk steht eine alte Werkbank mit einem zerlegten Motor darauf. "
            "Ben soll ihn wieder zusammensetzen und verstehen, warum sich überhaupt etwas "
            "dreht. Er beginnt bei dem, was man nicht sieht: dem Magnetfeld."),
        "themen": [
            {"id": "mo1",  "name": "Wie sieht das Unsichtbare rund um einen Magneten aus?",
             "video": "magnetfeld-jg10.mp4", "sim": "magnetfeld"},
            {"id": "mo2",  "name": "Warum zeigt eine Kompassnadel immer nach Norden?",
             "video": "erdmagnetfeld.mp4", "sim": "kompass"},
            {"id": "mo3",  "name": "Kann elektrischer Strom eine Kompassnadel bewegen?",
             "video": "oersted.mp4", "sim": "oersted"},
            {"id": "mo4",  "name": "Wie baue ich einen Magneten zum An- und Ausschalten?",
             "video": "elektromagnet-jg10.mp4", "sim": "elektromagnet"},
            {"id": "mo5",  "name": "Was macht einen Elektromagneten stärker?",
             "video": "elektromagnet-staerke.mp4", "sim": "elektromagnet"},
            {"id": "mo6",  "name": "Wo stecken schaltbare Magnete im Alltag?",
             "video": "elektromagnet-anwendungen.mp4", "sim": "stromwirkungen"},
            {"id": "mo7",  "name": "Warum bewegt sich ein Draht im Magnetfeld?",
             "video": "lorentzkraft.mp4", "sim": "leiterkraft"},
            {"id": "mo8",  "name": "Wie sage ich die Richtung der Kraft vorher?",
             "video": "drei-finger-regel.mp4", "sim": "leiterkraft"},
            {"id": "mo9",  "name": "Wie wird aus der Kraft eine Drehbewegung?",
             "video": "elektromotor.mp4", "sim": "elektromotor"},
            {"id": "mo10", "name": "Warum dreht der Motor immer weiter?",
             "video": "kommutator.mp4", "sim": "elektromotor"},
            {"id": "mo11", "name": "Was macht einen Motor kräftiger und schneller?",
             "video": "motor-optimieren.mp4", "sim": "elektromotor"},
        ],
    },
    {
        "id": "netz",
        "acc": (192, 138, 30),
        "titel": "Induktion, Generator und das Stromnetz",
        "vorhaben": (
            "Ben darf mit auf die Schaltwarte. Dort hängt ein Schaubild: Kraftwerk, "
            "Umspannwerk, Überlandleitung, Ortsnetz. Sein Ausbilder sagt, alles daran "
            "beruhe auf einem einzigen Versuch mit einem Magneten und einer Spule."),
        "themen": [
            {"id": "ge1",  "name": "Kann ein bewegter Magnet Strom erzeugen – ohne Batterie?",
             "video": "induktion.mp4", "sim": "induktion-rs"},
            {"id": "ge2",  "name": "Wovon hängt die induzierte Spannung ab?",
             "video": "induktionsspannung.mp4", "sim": "induktion-rs"},
            {"id": "ge3",  "name": "Warum bremst der Magnet beim Bewegen?",
             "video": "lenzsche-regel.mp4", "sim": "thomson-ring"},
            {"id": "ge4",  "name": "Wie erzeugt ein Kraftwerk ununterbrochen Strom?",
             "video": "generator-jg10.mp4", "sim": "generator"},
            {"id": "ge5",  "name": "Warum wechselt der Strom aus der Steckdose die Richtung?",
             "video": "wechselspannung.mp4", "sim": "generator"},
            {"id": "ge6",  "name": "Wann braucht man Gleichstrom, wann Wechselstrom?",
             "video": "gleich-wechselstrom.mp4", "sim": None},
            {"id": "ge7",  "name": "Wie ändere ich eine Spannung, ohne Energie zu verschwenden?",
             "video": "transformator.mp4", "sim": "transformator-schluessel"},
            {"id": "ge8",  "name": "Wie hängen Windungszahl und Spannung zusammen?",
             "video": "uebersetzungsverhaeltnis.mp4", "sim": "transformator-schluessel"},
            {"id": "ge9",  "name": "Warum geht auf langen Leitungen Energie verloren?",
             "video": "leitungsverluste.mp4", "sim": "freileitungen"},
            {"id": "ge10", "name": "Warum transportiert man Strom mit Hochspannung?",
             "video": "hochspannung.mp4", "sim": "freileitungen"},
            {"id": "ge11", "name": "Wie kommt der Strom vom Kraftwerk in die Steckdose?",
             "video": "stromnetz.mp4", "sim": None},
        ],
    },
    {
        "id": "atomkern",
        "acc": (31, 122, 116),
        "titel": "Atomkern und Strahlung",
        "vorhaben": (
            "Mia bekommt am ersten Tag ein Dosimeter an den Kittel geheftet. Niemand kann "
            "ihr auf Anhieb sagen, was es misst. Also fängt sie ganz vorn an: bei dem, "
            "woraus alles besteht."),
        "themen": [
            {"id": "ak1",  "name": "Woraus besteht ein Atom?",
             "video": "atombau.mp4", "sim": "atombau-isotope"},
            {"id": "ak2",  "name": "Warum gibt es vom selben Element verschiedene Sorten?",
             "video": "kernaufbau.mp4", "sim": "atombau-isotope"},
            {"id": "ak3",  "name": "Warum zerfallen manche Atomkerne von selbst?",
             "video": "stabil-instabil.mp4", "sim": "zerfallsreihe"},
            {"id": "ak4",  "name": "Woher kommt eine Strahlung, die niemand sehen kann?",
             "video": "natuerliche-radioaktivitaet.mp4", "sim": "zerfallsreihe"},
            {"id": "ak5",  "name": "Was macht diese Strahlung so besonders?",
             "video": "ionisierende-strahlung.mp4", "sim": "ionisation"},
            {"id": "ak6",  "name": "Wie macht man unsichtbare Strahlung sichtbar?",
             "video": "strahlung-nachweisen.mp4", "sim": "geiger-mueller"},
            {"id": "ak7",  "name": "Was ist Alphastrahlung und wie weit kommt sie?",
             "video": "alphastrahlung.mp4", "sim": "absorption-strahlung"},
            {"id": "ak8",  "name": "Warum ist Betastrahlung durchdringender?",
             "video": "betastrahlung.mp4", "sim": "absorption-strahlung"},
            {"id": "ak9",  "name": "Wieso stoppt selbst Blei die Gammastrahlung kaum?",
             "video": "gammastrahlung.mp4", "sim": "absorption-strahlung"},
            {"id": "ak10", "name": "Womit kann ich welche Strahlung aufhalten?",
             "video": "abschirmung.mp4", "sim": "absorption-strahlung"},
            {"id": "ak11", "name": "Wie unterscheide ich die drei Strahlungsarten?",
             "video": "ablenkung-feld.mp4", "sim": None},
            {"id": "ak12", "name": "Was wird aus einem Kern nach dem Zerfall?",
             "video": "zerfallsgleichung.mp4", "sim": "zerfallsreihe"},
            {"id": "ak13", "name": "Warum kann man nie sagen, WANN ein Kern zerfällt?",
             "video": "halbwertszeit.mp4", "sim": "zerfall-halbwertszeit"},
            {"id": "ak14", "name": "Wie bestimmt man das Alter von Ötzi oder eines Baumes?",
             "video": "c14-methode.mp4", "sim": "zerfall-halbwertszeit"},
        ],
    },
    {
        "id": "kernenergie",
        "acc": (190, 68, 56),
        "titel": "Kernenergie nutzen und verantworten",
        "vorhaben": (
            "In der zweiten Woche darf Mia bei einer Szintigrafie zusehen, und Ben liest "
            "im Umspannwerk auf einer alten Tafel noch die Leitung zum stillgelegten "
            "Kernkraftwerk. Beide Male geht es um dieselbe Energie - einmal als Hilfe, "
            "einmal als Risiko."),
        "themen": [
            {"id": "ke1",  "name": "Wie hilft radioaktive Strahlung in der Medizin?",
             "video": "medizin-strahlung.mp4", "sim": None},
            {"id": "ke2",  "name": "Wo nutzt die Technik radioaktive Strahlung?",
             "video": "technik-strahlung.mp4", "sim": None},
            {"id": "ke3",  "name": "Wie viel Strahlung steckt in meinem Alltag?",
             "video": "strahlenbelastung.mp4", "sim": None},
            {"id": "ke4",  "name": "Wie schütze ich mich am wirksamsten vor Strahlung?",
             "video": "strahlenschutz.mp4", "sim": "strahlenschutz"},
            {"id": "ke5",  "name": "Wie holt man riesige Energie aus einem winzigen Kern?",
             "video": "kernspaltung.mp4", "sim": "kernspaltung"},
            {"id": "ke6",  "name": "Wie verhindert man, dass eine Kettenreaktion außer Kontrolle gerät?",
             "video": "kettenreaktion.mp4", "sim": "kettenreaktion"},
            {"id": "ke7",  "name": "Wie wird aus Kernspaltung Strom in meiner Steckdose?",
             "video": "kernkraftwerk.mp4", "sim": "kettenreaktion"},
            {"id": "ke8",  "name": "Was passiert, wenn ein Reaktor außer Kontrolle gerät?",
             "video": "reaktorunfaelle.mp4", "sim": None},
            {"id": "ke9",  "name": "Wohin mit dem Müll, der noch Tausende Jahre strahlt?",
             "video": "endlagerung.mp4", "sim": "zerfall-halbwertszeit"},
            {"id": "ke10", "name": "Woher nimmt die Sonne ihre Energie?",
             "video": "kernfusion.mp4", "sim": "kernfusion"},
            {"id": "ke11", "name": "Kernenergie: Segen oder Gefahr?",
             "video": "bewertung-kernenergie.mp4", "sim": None},
        ],
    },
]

# Nur Kapitel mit fertigen Inhalten kommen ins Heft. Solange nichts geschrieben
# ist, bleibt FERTIG leer und plan.py laesst sich trotzdem auswerten.
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
    print(f"Forscherheft Klasse {KLASSE} · {SCHULFORM}\n")
    for i, k in enumerate(ALLE_KAPITEL, 1):
        ohne = sum(1 for th in k["themen"] if not th.get("sim"))
        duenn = sum(1 for th in k["themen"] if th.get("duenn"))
        print(f"Kapitel {i} · {k['titel']}  ({len(k['themen'])} Themen · "
              f"{ohne} ohne Simulation · {duenn} zu dünn)")
        for j, th in enumerate(k["themen"], 1):
            z = "  " if th.get("sim") and not th.get("duenn") else (" ~" if th.get("duenn") else " !")
            print(f"  {z} {j:2d}. [{th['id']:5s}] {th['name'][:58]:58s} {th.get('sim') or ''}")
        print()
    ges = sum(len(k["themen"]) for k in ALLE_KAPITEL)
    print(f"{ges} Themen · {ges-len(OHNE_SIM)-len(DUENN)} mit fertiger Simulation · "
          f"{len(DUENN)} zu dünn · {len(OHNE_SIM)} ohne")
