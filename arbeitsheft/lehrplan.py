# -*- coding: utf-8 -*-
"""Inhaltsfelder und Basiskonzepte des Kernlehrplans, und welches Kapitel wozu gehoert.

Quelle: Kernlehrplan für die Realschule in Nordrhein-Westfalen, Physik
(Heft 3307, 1. Auflage 2011). Namen der Inhaltsfelder und Stichworte der
Basiskonzepte sind woertlich uebernommen.

Die Zuordnung der Kapitel zu Inhaltsfeldern trifft der Verlag. Der Kernlehrplan
ordnet Inhaltsfelder ausdruecklich nicht einzelnen Jahrgangsstufen zu - das ist
Sache der Fachkonferenz. Die Angabe im Heft ist deshalb ein Vorschlag.
"""

INHALTSFELD = {
 1:  ("Strom und Magnetismus",
      {"System": "Stromkreis, Parallel- und Reihenschaltungen",
       "Wechselwirkung": "Kräfte und Felder zwischen Magneten, Stromwirkungen",
       "Energie": "Energietransport durch elektrischen Strom, Energieumwandlungen",
       "Struktur der Materie": "magnetisierbare Stoffe, Leiter und Nichtleiter"}),
 2:  ("Sonnenenergie und Wärme",
      {"System": "Wärmetransport als Temperaturausgleich, die Erde im Sonnensystem, Tag und Nacht, Jahreszeiten",
       "Wechselwirkung": "Absorption und Reflexion von Strahlung, Wärmeisolierung",
       "Energie": "Wärme, Temperatur, Wärmetransport, UV-Strahlung",
       "Struktur der Materie": "einfaches Teilchenmodell, Aggregatzustände, Wärmeausdehnung"}),
 3:  ("Licht und Schall",
      {"System": "Auge und Ohr, Frequenz, Amplitude, Bildentstehung, Schatten",
       "Wechselwirkung": "Absorption, Reflexion und Streuung, Schallschwingungen",
       "Energie": "Licht, Schall",
       "Struktur der Materie": "Schallausbreitung im Teilchenmodell"}),
 4:  ("Optische Instrumente und die Erforschung des Weltalls",
      {"System": "Linsen, Bildentstehung, Himmelsobjekte, Weltbilder",
       "Wechselwirkung": "Lichtbrechung, Totalreflexion, Gravitation",
       "Energie": "Sonnenenergie, Farbspektrum (IR bis UV)",
       "Struktur der Materie": "Massenanziehung, Materie im Weltall"}),
 5:  ("Stromkreise",
      {"System": "Stromstärke, Spannung, Widerstand, Parallel- und Reihenschaltungen",
       "Wechselwirkung": "Kräfte zwischen Ladungen, elektrisches Feld",
       "Energie": "Spannung, elektrische Energie, elektrische Leistung",
       "Struktur der Materie": "Kern-Hülle-Modell des Atoms, Eigenschaften von Ladungen"}),
 6:  ("Kräfte und Maschinen",
      {"System": "Kraftwandler, Hebel, Elektromotor",
       "Wechselwirkung": "Kräfte, magnetische Kräfte und Felder",
       "Energie": "Energie und Leistung (mechanisch und elektrisch), Energieerhaltung",
       "Struktur der Materie": "Masse"}),
 7:  ("Elektrische Energieversorgung",
      {"System": "Kraftwerke, regenerative Energiequellen, Transformator, Generator, Stromnetze",
       "Wechselwirkung": "Magnetfelder von Leitern und Spulen, elektrische Felder, Induktion",
       "Energie": "Energietransport, Wirkungsgrad, Energieentwertung",
       "Struktur der Materie": "fossile und regenerative Energieträger"}),
 8:  ("Kernenergie und Radioaktivität",
      {"System": "Kernkraftwerke, Kettenreaktion, Halbwertszeiten",
       "Wechselwirkung": "Kernkräfte, α-, β-, γ-Strahlung, Röntgenstrahlung",
       "Energie": "Kernenergie, Energie ionisierender Strahlung",
       "Struktur der Materie": "Atome, Atomkerne, Kernspaltung, radioaktiver Zerfall"}),
 9:  ("Informationsübertragung",
      {"System": "analoge und digitale Kodierung, elektromagnetische Strahlung",
       "Wechselwirkung": "elektroakustische Signalwandlung, Farbmischung",
       "Energie": "elektromagnetische Energieumwandlungen",
       "Struktur der Materie": "Dioden und Transistoren"}),
 10: ("Bewegungen und ihre Ursachen",
      {"System": "Geschwindigkeit",
       "Wechselwirkung": "Druck, Schweredruck, Auftriebskraft, Kraft und Gegenkraft, Trägheit",
       "Energie": "Bewegungsenergie",
       "Struktur der Materie": "Masse, Dichte"}),
}

# Kapitel-Kennung -> Inhaltsfeld. Vorschlag des Verlags, nicht amtlich.
KAPITEL_FELD = {
 # Klasse 5/6
 "magnetismus": 1, "licht": 3, "strom": 1, "waerme": 2, "schall": 3, "himmel": 2,
 # Klasse 7
 "optik": 4, "farben": 4, "himmel7": 4, "teleskop": 4,
 # Klasse 8
 "spannung": 5, "widerstand": 5, "leistung": 5, "tempo": 10,
 # Klasse 9
 "kraefte": 6, "bewegung": 10, "energie": 6, "kraftwerke": 7,
 # Klasse 10
 "motor": 1, "netz": 7, "atomkern": 8, "kernenergie": 8,
}


def feld(kapitel_id):
    """(Nummer, Name, Basiskonzepte) fuer ein Kapitel - oder None."""
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
    """Die Basiskonzepte dieses Inhaltsfelds als eine Zeile."""
    f = feld(kapitel_id)
    if not f: return None
    return "Basiskonzepte: " + " · ".join(f[2].keys())

# ── Basiskonzepte je Thema ──────────────────────────────────────────────────
# Der Kernlehrplan nennt zu jedem Inhaltsfeld vier Basiskonzepte mit Stichworten.
# Die Zuordnung eines einzelnen Themas geschieht ueber genau diese Stichworte -
# so steht hinter jeder Seite eine Angabe aus dem Kernlehrplan und keine Erfindung.
_STICHWORTE = {
 "System": ("stromkreis", "schaltung", "reihe", "parallel", "schalter", "gerät",
            "auge", "ohr", "frequenz", "amplitude", "bildentstehung", "schatten",
            "linse", "fernrohr", "teleskop", "kamera", "brille", "himmelsobjekt",
            "weltbild", "planet", "sonnensystem", "mond", "tag und nacht", "jahreszeit",
            "wasserkreislauf", "kreislauf", "geschwindigkeit", "tempo", "diagramm",
            "kraftwandler", "hebel", "rampe", "schiefe ebene", "flaschenzug",
            "elektromotor", "generator", "transformator", "kraftwerk", "stromnetz",
            "widerstand", "spannung", "stromstärke", "wärmetransport"),
 "Wechselwirkung": ("kraft", "kräfte", "magnet", "pol", "feld", "anziehung", "abstoß",
            "reibung", "gravitation", "schwerkraft", "gewichtskraft", "wechselwirkung",
            "gegenkraft", "trägheit", "druck", "auftrieb", "reflexion", "brechung",
            "totalreflexion", "absorption", "streuung", "spiegel", "schwingung",
            "ladung", "induktion", "isolierung", "spule"),
 "Energie": ("energie", "arbeit", "leistung", "wirkungsgrad", "wärme", "temperatur",
            "licht", "schall", "strahlung", "sonnenenergie", "spektrum", "farbe",
            "kilowattstunde", "kosten", "sparen", "entwertung", "erhaltung", "watt",
            "joule", "verbrauch"),
 "Struktur der Materie": ("teilchen", "aggregatzustand", "ausdehnung", "masse",
            "dichte", "stoff", "leiter", "nichtleiter", "magnetisierbar", "atom",
            "kern", "hülle", "gitter", "material", "energieträger", "brennstoff"),
}


def basiskonzept(kapitel_id, text):
    """Basiskonzept eines einzelnen Themas, gewaehlt ueber die Stichworte des
    Kernlehrplans. Nur Konzepte, die im Inhaltsfeld dieses Kapitels vorkommen."""
    f = feld(kapitel_id)
    erlaubt = set(f[2].keys()) if f else set(_STICHWORTE)
    t = (text or "").lower()
    beste, punkte = None, 0
    for konz, worte in _STICHWORTE.items():
        if konz not in erlaubt: continue
        n = sum(1 for w in worte if w in t)
        if n > punkte: beste, punkte = konz, n
    return beste or ("System" if "System" in erlaubt else sorted(erlaubt)[0])
