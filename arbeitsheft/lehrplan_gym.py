# -*- coding: utf-8 -*-
"""Inhaltsfelder und Basiskonzepte des Kernlehrplans PHYSIK, GYMNASIUM G9.

Quelle: Kernlehrplan fuer die Sekundarstufe I Gymnasium in Nordrhein-Westfalen,
Physik, Heft 3411, 1. Auflage 2019 (RdErl. v. 23.06.2019). Namen der Inhalts-
felder und die Stichworte der Basiskonzept-Beitraege sind woertlich aus den
Abschnitten "Beitraege zu den Basiskonzepten" der Seiten 24 bis 45 uebernommen.
Original, Volltext und Auswertung: LernStar/kernlehrplan/.

Diese Datei ist bewusst getrennt von lehrplan.py (Realschule, Heft 3307) und
lehrplan_gts.py (Gesamtschule, Heft 3108): das Gymnasium hat ELF eigene
Inhaltsfelder, eigene Zuschnitte und als einziges den Bewertungscode B4.

WICHTIG fuer die Hefte:
- Der KLP kennt nur zwei Stufen: IF 1-4 bis Ende Erprobungsstufe (5/6),
  IF 5-11 bis Ende Sekundarstufe I. Eine Zuordnung zu Jahrgaengen nimmt er
  ausdruecklich NICHT vor - die Verteilung im Heft ist ein begruendeter
  Vorschlag des Verlags, keine amtliche Vorgabe.
- NICHT jedes Inhaltsfeld nennt alle vier Basiskonzepte: IF 4 hat keinen
  Absatz "Wechselwirkung", IF 7 und IF 11 keinen zu "Struktur der Materie",
  IF 8 keinen zu "Energie". Die Kopfzeile einer Seite darf nur nennen, was
  ihr Feld laut KLP wirklich hat - deshalb waehlt basiskonzept() nur daraus.
"""

INHALTSFELD = {
 1:  ("Temperatur und Wärme",
      {"Energie": "einfache energetische Vorgänge mit der thermischen Energie als einer ersten Energieform beschreiben",
       "Struktur der Materie": "Aufbau von Stoffen und Änderung von Aggregatzuständen mit einem einfachen Teilchenmodell",
       "Wechselwirkung": "Körper wechselwirken über Wärmetransportarten miteinander",
       "System": "Temperaturunterschiede als systemisches Ungleichgewicht, das durch Wärmetransport ausgeglichen wird"}),
 2:  ("Elektrischer Strom und Magnetismus",
      {"Energie": "in Stromkreisen wird elektrische Energie transportiert, umgewandelt und entwertet; Batterien und Akkumulatoren speichern Energie",
       "Struktur der Materie": "Modell frei beweglicher Elektronen im Leiter; Magnetisierbarkeit als Stoffeigenschaft, Modell ausgerichteter magnetischer Bereiche",
       "Wechselwirkung": "Erwärmung als Folge der Wechselwirkung zwischen Teilchen beim Stromfluss; Fernwirkungskräfte von Magneten durch Felder",
       "System": "der elektrische Stromkreis als geschlossenes System; das Zusammenwirken seiner Komponenten bestimmt die Funktion"}),
 3:  ("Schall",
      {"Energie": "Schallwellen transportieren Energie",
       "Struktur der Materie": "Schall wird durch schwingende Teilchen transportiert und benötigt ein Medium",
       "Wechselwirkung": "Schall bringt Körper zum Schwingen, schwingende Körper erzeugen Schall; Absorption und Reflexion",
       "System": "Schallquelle, Transportmedium und Schallempfänger als System zur Übertragung von Informationen"}),
 4:  ("Licht",
      {"Energie": "Lichtquellen sind Energiewandler; Licht transportiert Energie",
       "Struktur der Materie": "das Verhalten von Licht an Körperoberflächen hängt von Material und Oberfläche ab",
       "System": "mit einem System aus Lochblende und Schirm lassen sich einfache Abbildungen erzeugen und verändern"}),
 5:  ("Optische Instrumente",
      {"Energie": "durch Licht wird Energie transportiert",
       "Struktur der Materie": "Reflexion, Absorption und Brechung von Licht sind materialspezifisch",
       "Wechselwirkung": "Licht wird an Grenzflächen reflektiert, absorbiert und/oder bei Transmission gebrochen",
       "System": "Systeme aus Linsen erzeugen je nach Anordnung unterschiedliche Abbildungen"}),
 6:  ("Sterne und Weltall",
      {"Energie": "Sterne setzen im Laufe ihrer Entwicklung Energie frei",
       "Struktur der Materie": "mithilfe von Spektren lassen sich Informationen über die Zusammensetzung von Sternen gewinnen",
       "Wechselwirkung": "die Gravitation als wesentliche Wechselwirkung zwischen Himmelskörpern",
       "System": "unser Sonnensystem besteht aus verschiedenen Körpern, die sich gegenseitig beeinflussen"}),
 7:  ("Bewegung, Kraft und Energie",
      {"Energie": "die Goldene Regel der Mechanik als Aspekt der Energieerhaltung; Energie kann zwischen diversen Formen umgewandelt werden",
       "Wechselwirkung": "durch die Einwirkung von Kräften ändern Körper ihre Bewegungszustände oder verformen sich",
       "System": "bei Kräftegleichgewicht ändert sich der Bewegungszustand nicht; in geschlossenen Systemen bleibt die Energie erhalten"}),
 8:  ("Druck und Auftrieb",
      {"Struktur der Materie": "der Druck in Flüssigkeiten und Gasen bestimmt den Abstand ihrer Teilchen",
       "Wechselwirkung": "Kraftwirkungen auf Flächen durch Stöße von Teilchen; Auftrieb durch Kraftdifferenzen an Flächen eines Körpers",
       "System": "Druck- bzw. Dichteunterschiede können Bewegungen verursachen"}),
 9:  ("Elektrizität",
      {"Energie": "elektrische Energie entsteht durch Trennung von Ladungen; Energie wird im Stromkreis übertragen, umgewandelt und entwertet",
       "Struktur der Materie": "das Elektronen-Atomrumpf-Modell erklärt Leitungseigenschaften verschiedener Stoffe",
       "Wechselwirkung": "elektrische Felder vermitteln Kräfte zwischen elektrischen Ladungen",
       "System": "der Stromkreis ist für Ladungen geschlossen, energetisch offen; Spannung beschreibt ein Ungleichgewicht"}),
 10: ("Ionisierende Strahlung und Kernenergie",
      {"Energie": "durch Kernspaltung und Kernfusion kann nutzbare Energie gewonnen werden",
       "Struktur der Materie": "erweitertes Modell von Atom und Atomkern erklärt ionisierende Strahlung und Isotope",
       "Wechselwirkung": "radioaktive Strahlung und Röntgenstrahlung können Atome und Moleküle ionisieren",
       "System": "Rückkopplung im Kernkraftwerk mit dem Ziel stabilen Gleichgewichts; Vorhersagen über Zufallsprozesse stochastisch"}),
 11: ("Energieversorgung",
      {"Energie": "Energie wird auf dem Weg zum Verbraucher in verschiedenen Umwandlungsschritten nutzbar gemacht",
       "Wechselwirkung": "Kräfte auf bewegte Ladungsträger im Magnetfeld haben Bewegungsänderungen bzw. Induktionsspannungen zur Folge",
       "System": "elektrische Energie wird im Versorgungsnetz vom Kraftwerk zum Verbraucher transportiert"}),
}

KAPITEL_FELD = {
 # Klasse 5/6 (Erprobungsstufe)
 "gym_waerme": 1, "gym_strom": 2, "gym_schall": 3, "gym_licht": 4,
 # Klasse 7
 "gym_optik": 5, "gym_weltall": 6,
 # Klasse 8
 "gym_mechanik": 7, "gym_druck": 8,
 # Klasse 9 (drei Kapitel, alle Inhaltsfeld 9)
 "gym_ladung": 9, "gym_kreise": 9, "gym_eleistung": 9,
 # Klasse 10
 "gym_kern": 10, "gym_energie": 11,
}


def feld(kapitel_id):
    nr = KAPITEL_FELD.get(kapitel_id)
    if not nr: return None
    name, bk = INHALTSFELD[nr]
    return nr, name, bk


def zeile(kapitel_id):
    """Eine Zeile fuer die Kapitel-Trennseite."""
    f = feld(kapitel_id)
    if not f: return None
    nr, name, bk = f
    return f"INHALTSFELD {nr} · {name.upper()}"


def konzepte(kapitel_id):
    f = feld(kapitel_id)
    if not f: return None
    return "Basiskonzepte: " + " · ".join(f[2].keys())


# ── Basiskonzepte je Thema ──────────────────────────────────────────────────
# Zuordnung ueber Stichworte, damit hinter jeder Seite eine Angabe aus dem
# Dokument steht und keine Erfindung. WICHTIG: basiskonzept() waehlt nur aus
# den Konzepten, die das Inhaltsfeld der Seite laut KLP wirklich nennt.
_STICHWORTE = {
 "System": ("stromkreis", "schaltung", "reihe", "parallel", "schalter", "gerät",
            "auge", "ohr", "brille", "linse", "fernrohr", "teleskop", "kamera",
            "abbildung", "bild", "lochkamera", "himmelsobjekt", "weltbild",
            "planet", "sonnensystem", "mond", "jahreszeit", "universum",
            "galaxie", "geschwindigkeit", "tempo", "diagramm", "schwerelos",
            "kraftwandler", "hebel", "rolle", "flaschenzug", "zahnrad",
            "rampe", "schiefe ebene", "elektromotor", "generator",
            "transformator", "kraftwerk", "stromnetz", "netz", "nachhaltig",
            "klimawandel", "widerstand", "spannung", "stromstärke",
            "halbwertszeit", "kettenreaktion", "reaktor", "hausinstallation",
            "sicherung", "gleichgewicht", "ausgleich", "und-schaltung",
            "oder-schaltung"),
 "Wechselwirkung": ("kraft", "kräfte", "magnet", "pol", "feld", "anziehung",
            "abstoß", "reibung", "gravitation", "schwerkraft", "gewichtskraft",
            "wechselwirkung", "gegenkraft", "trägheit", "rückstoß", "druck",
            "auftrieb", "schwimm", "reflexion", "brechung", "totalreflexion",
            "absorption", "spiegel", "farbzerlegung", "ladung", "induktion",
            "spule", "lorentz", "drehmoment", "strahlung", "alpha", "beta",
            "gamma", "röntgen", "strahlenschutz", "ionisier", "elektroskop",
            "wärmetransport", "wärmeleitung", "wärmestrahlung", "dämmung"),
 "Energie": ("energie", "arbeit", "leistung", "wirkungsgrad", "wärme",
            "temperatur", "licht", "schall", "spektrum", "farbe", "infrarot",
            "ultraviolett", "kilowattstunde", "kosten", "sparen", "entwertung",
            "erhaltung", "watt", "joule", "verbrauch", "kernenergie", "stern",
            "kernspaltung", "kernfusion", "speicher", "akku", "batterie"),
 "Struktur der Materie": ("teilchen", "aggregatzustand", "ausdehnung", "masse",
            "dichte", "stoff", "leiter", "nichtleiter", "atom", "kern", "hülle",
            "elektronen", "atomrumpf", "gitter", "isotop", "ion", "zerfall",
            "material", "anomalie", "elementarmagnet", "oberfläche"),
}


def basiskonzept(kapitel_id, text):
    f = feld(kapitel_id)
    erlaubt = set(f[2].keys()) if f else set(_STICHWORTE)
    t = (text or "").lower()
    beste, punkte = None, 0
    for konz, worte in _STICHWORTE.items():
        if konz not in erlaubt: continue
        n = sum(1 for w in worte if w in t)
        if n > punkte: beste, punkte = konz, n
    return beste or ("System" if "System" in erlaubt else sorted(erlaubt)[0])
