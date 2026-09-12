# -*- coding: utf-8 -*-
"""Inhaltsfelder und Basiskonzepte des Kernlehrplans der GESAMTSCHULE.

Quelle: Kernlehrplan fuer die Gesamtschule - Sekundarstufe I in Nordrhein-
Westfalen, Naturwissenschaften (Biologie, Chemie, Physik), Heft 3108,
2. Auflage 2013, Abschnitt D "Fachunterricht Physik", Seiten 93 bis 112.
Namen der Inhaltsfelder und die Stichworte der Basiskonzepte sind woertlich
uebernommen.

Diese Datei ist bewusst getrennt von lehrplan.py (Realschule, Heft 3307):
die Inhaltsfelder sind anders geschnitten und anders nummeriert. Die
Realschul-Hefte sind fertig und gedruckt - an ihrer Zuordnung wird nichts
geaendert.

Die Zuordnung der Kapitel zu Inhaltsfeldern trifft der Verlag. Der Kernlehrplan
ordnet Inhaltsfelder ausdruecklich KEINEN Jahrgangsstufen zu (S. 93) - die
Angabe im Heft ist deshalb ein begruendeter Vorschlag, keine amtliche Vorgabe.
"""

INHALTSFELD = {
 1:  ("Sonnenenergie und Wärme",
      {"System": "Wärmetransport als Temperaturausgleich, Wärme- und Wasserkreislauf, die Erde im Sonnensystem",
       "Wechselwirkung": "Reflexion und Absorption von Wärmestrahlung",
       "Energie": "Wärme als Energieform, Temperatur, Übertragung und Speicherung von Energie",
       "Struktur der Materie": "einfaches Teilchenmodell, Wärmeausdehnung und Teilchenbewegung, Aggregatzustände"}),
 2:  ("Sinneswahrnehmungen mit Licht und Schall",
      {"System": "Lichtquellen, Auge und Ohr als Licht- bzw. Schallempfänger, Schattenbildung",
       "Wechselwirkung": "Absorption, Reflexion, Schallschwingungen",
       "Energie": "Licht und Schall als Träger von Information und Energie",
       "Struktur der Materie": "Schallausbreitung, Schallgeschwindigkeit"}),
 3:  ("Kräfte und Körper",
      {"System": "physikalisches Gleichgewicht, Hebel",
       "Wechselwirkung": "Kraftwirkungen, Hebelwirkung, magnetische Kräfte und Felder",
       "Energie": "Energieübertragung durch Kräfte",
       "Struktur der Materie": "Volumen, Masse, magnetische Stoffe"}),
 4:  ("Elektrizität und ihre Wirkungen",
      {"System": "Stromkreise und Schaltungen",
       "Wechselwirkung": "Wirkungen des elektrischen Stroms, Elektromagnete",
       "Energie": "Energieumwandlung in elektrischen Geräten",
       "Struktur der Materie": "Leiter und Nichtleiter"}),
 5:  ("Optische Instrumente",
      {"System": "Abbildungen durch Linsen",
       "Wechselwirkung": "Brechung, Totalreflexion, Farbzerlegung",
       "Energie": "Licht als Energieträger, Spektrum des Lichts (IR bis UV)",
       "Struktur der Materie": "Licht brechende und Licht reflektierende Stoffe"}),
 6:  ("Erde und Weltall",
      {"System": "Universum, Sonnensystem, Weltbilder",
       "Wechselwirkung": "Gravitationskraft, Gravitationsfeld",
       "Energie": "Energieumwandlungen in Sternen",
       "Struktur der Materie": "kosmische Objekte"}),
 7:  ("Stromkreise",
      {"System": "Stromstärke, Spannung, Widerstand, Reihenschaltung und Parallelschaltung",
       "Wechselwirkung": "Kräfte zwischen Ladungen, elektrische Felder",
       "Energie": "elektrische Energie, Spannungserzeugung, Energieumwandlungen in Stromkreisen",
       "Struktur der Materie": "Kern-Hülle-Modell des Atoms, Eigenschaften von Ladungen, Gittermodell der Metalle"}),
 8:  ("Bewegungen und ihre Ursachen",
      {"System": "Geschwindigkeit, Schwerelosigkeit",
       "Wechselwirkung": "Kraftwirkungen, Trägheitsgesetz, Wechselwirkungsgesetz, Kraftvektoren, Gewichtskraft, Druck, Auftriebskräfte",
       "Energie": "Bewegungsenergie, Energieerhaltung",
       "Struktur der Materie": "Masse, Dichte"}),
 9:  ("Energie, Leistung, Wirkungsgrad",
      {"System": "Kraftwandler, Energiefluss bei Ungleichgewichten",
       "Wechselwirkung": "Kräfteaddition, Drehmoment",
       "Energie": "Arbeit, mechanische Energieformen, Energieentwertung, Leistung"}),
 10: ("Elektrische Energieversorgung",
      {"System": "Elektromotor, Generator, Transformator, Versorgungsnetze, Nachhaltigkeit, Klimawandel",
       "Wechselwirkung": "Magnetfelder von Leitern und Spulen, elektromagnetische Kraftwirkungen, Induktion",
       "Energie": "elektrische Energie, Energiewandler, elektrische Leistung, Energietransport"}),
 11: ("Radioaktivität und Kernenergie",
      {"System": "Halbwertszeiten, Kernspaltung und Kettenreaktion, natürliche Radioaktivität",
       "Wechselwirkung": "α-, β-, γ-Strahlung, Röntgenstrahlung, Wirkungen ionisierender Strahlen, Strahlenschutz",
       "Energie": "Kernenergie, Energie ionisierender Strahlung",
       "Struktur der Materie": "Atome und Atomkerne, Ionen, Isotope, radioaktiver Zerfall"}),
}

# Kapitel-Kennungen der Gesamtschul-Hefte. Sie tragen bewusst das Praefix gts_,
# damit sie nicht mit den gleichnamigen Kapiteln der Realschul-Hefte kollidieren
# ("strom", "kraefte", "energie", "bewegung" gibt es dort ebenfalls).
KAPITEL_FELD = {
 # Klasse 7
 "gts_optik": 5, "gts_weltall": 6,
 # Klasse 8
 "gts_strom": 7, "gts_bewegung": 8,
 # Klasse 9
 "gts_kraefte": 8, "gts_energie": 9,
 # Klasse 10
 "gts_versorgung": 10, "gts_kern": 11,
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
# Zuordnung ueber die Stichworte des Kernlehrplans, damit hinter jeder Seite
# eine Angabe aus dem Dokument steht und keine Erfindung.
_STICHWORTE = {
 "System": ("stromkreis", "schaltung", "reihe", "parallel", "schalter", "gerät",
            "auge", "ohr", "brille", "linse", "fernrohr", "teleskop", "kamera",
            "abbildung", "bild", "himmelsobjekt", "weltbild", "planet",
            "sonnensystem", "mond", "tag und nacht", "universum", "galaxie",
            "geschwindigkeit", "tempo", "diagramm", "schwerelos",
            "kraftwandler", "hebel", "rolle", "flaschenzug", "zahnrad",
            "rampe", "schiefe ebene", "elektromotor", "generator",
            "transformator", "kraftwerk", "stromnetz", "netz", "nachhaltig",
            "klimawandel", "widerstand", "spannung", "stromstärke",
            "halbwertszeit", "kettenreaktion", "kernspaltung", "wärmetransport"),
 "Wechselwirkung": ("kraft", "kräfte", "magnet", "pol", "feld", "anziehung",
            "abstoß", "reibung", "gravitation", "schwerkraft", "gewichtskraft",
            "wechselwirkung", "gegenkraft", "trägheit", "rückstoß", "druck",
            "auftrieb", "schwimm", "reflexion", "brechung", "totalreflexion",
            "absorption", "spiegel", "farbzerlegung", "ladung", "induktion",
            "spule", "lorentz", "drehmoment", "strahlung", "alpha", "beta",
            "gamma", "röntgen", "strahlenschutz", "ionisier"),
 "Energie": ("energie", "arbeit", "leistung", "wirkungsgrad", "wärme",
            "temperatur", "licht", "schall", "spektrum", "farbe", "infrarot",
            "ultraviolett", "kilowattstunde", "kosten", "sparen", "entwertung",
            "erhaltung", "watt", "joule", "verbrauch", "kernenergie", "stern"),
 "Struktur der Materie": ("teilchen", "aggregatzustand", "ausdehnung", "masse",
            "dichte", "stoff", "leiter", "nichtleiter", "atom", "kern", "hülle",
            "gitter", "isotop", "ion", "zerfall", "material", "brennstoff",
            "kosmisch", "komet"),
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
