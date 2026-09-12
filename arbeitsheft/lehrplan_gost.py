# -*- coding: utf-8 -*-
"""Inhaltsfelder und Basiskonzepte des Kernlehrplans PHYSIK, GYMNASIALE OBERSTUFE.

Quelle: Kernlehrplan fuer die Sekundarstufe II - Gymnasium/Gesamtschule in
Nordrhein-Westfalen, Physik, Heft 4721 (RdErl. v. 31.05.2022), Kapitel 2.1.2,
2.1.3, 2.2 und 2.3. Namen der Inhaltsfelder, die inhaltlichen Schwerpunkte und
die Basiskonzept-Beitraege sind woertlich uebernommen (Seiten 18-21, 26-30).
Original, Volltext und Auswertung: LernStar/kernlehrplan/.

Getrennt von lehrplan.py (Realschule), lehrplan_gts.py (Gesamtschule Sek I) und
lehrplan_gym.py (Gymnasium Sek I). Drei Unterschiede, die beim Kopieren
regelmaessig uebersehen werden:

1. EIN Plan fuer BEIDE Schulformen. Gymnasium und Gesamtschule teilen sich in
   der Oberstufe denselben Kernlehrplan - anders als in der Sekundarstufe I.
2. ANDERE BASISKONZEPTE. Die Sek I kennt Energie / Struktur der Materie /
   Wechselwirkung / System. Die Oberstufe kennt vier andere, aus den
   KMK-Bildungsstandards fuer die Allgemeine Hochschulreife.
3. Die EINFUEHRUNGSPHASE hat genau ZWEI Inhaltsfelder. Die uebrigen sieben
   gehoeren zur Qualifikationsphase und sind dort nach Grund- und Leistungskurs
   getrennt - in der EF gibt es diese Trennung NICHT.
"""

QUELLE = ("Kernlehrplan Physik, Sekundarstufe II Gymnasium/Gesamtschule NRW "
          "(Heft 4721, 2022)")

# ── Die vier Basiskonzepte der Oberstufe (Kap. 2.1.3, S. 21) ────────
BASISKONZEPTE = ("Erhaltung und Gleichgewicht",
                 "Superposition und Komponenten",
                 "Mathematisieren und Vorhersagen",
                 "Zufall und Determiniertheit")

# ── Inhaltsfelder ───────────────────────────────────────────────────
# Aufbau je Feld: (Name, Stufe, {Schwerpunkt: Stichworte},
#                  {Basiskonzept: Beitrag laut Plan})
# Stufe: "EF" = Einfuehrungsphase, "QP-GK" / "QP-LK" = Qualifikationsphase.
INHALTSFELD = {
 1: ("Grundlagen der Mechanik", "EF",
     {"Kinematik": "gleichförmige und gleichmäßig beschleunigte Bewegung; "
                   "freier Fall; waagerechter Wurf; vektorielle Größen",
      "Dynamik": "Newton'sche Gesetze; beschleunigende Kräfte; "
                 "Kräftegleichgewicht; Reibungskräfte",
      "Erhaltungssätze": "Impuls; Energie (Lage-, Bewegungs- und Spannenergie); "
                         "Energiebilanzen; Stoßvorgänge"},
     {"Erhaltung und Gleichgewicht":
        "Impuls sowie mechanische Energie sind erste Beispiele für streng "
        "bilanzierbare Erhaltungsgrößen in der Physik",
      "Superposition und Komponenten":
        "Geschwindigkeit, Beschleunigung, Kraft und Impuls sind Beispiele für "
        "vektorielle Größen; die Komponentenzerlegung erlaubt die Beschreibung "
        "komplexer Bewegungen",
      "Mathematisieren und Vorhersagen":
        "unterschiedliche mathematische Darstellungsformen mittels Tabellen, "
        "Diagrammen und Gesetzen ermöglichen eine formale Beschreibung von Bewegungen",
      "Zufall und Determiniertheit":
        "die statistische Messunsicherheit bei der Aufnahme realer Messwerte von "
        "Bewegungen ist ein Beispiel für den Umgang mit dem Zufall in der Physik"}),

 2: ("Kreisbewegung, Gravitation und physikalische Weltbilder", "EF",
     {"Kreisbewegung": "gleichförmige Kreisbewegung, Zentripetalkraft",
      "Gravitation": "Schwerkraft, Newton'sches Gravitationsgesetz, "
                     "Kepler'sche Gesetze; Gravitationsfeld",
      "Wandel physikalischer Weltbilder":
        "geo- und heliozentrische Weltbilder; Grundprinzipien der speziellen "
        "Relativitätstheorie, Zeitdilatation"},
     # ACHTUNG: Dieses Feld nennt NUR ZWEI Basiskonzepte. "Erhaltung und
     # Gleichgewicht" und "Superposition und Komponenten" stehen dort nicht.
     # Die Kopfzeile einer Seite darf nur nennen, was ihr Feld wirklich hat.
     {"Mathematisieren und Vorhersagen":
        "die Berechnung der Bahndaten von Satelliten und Planeten anhand des "
        "Newton'schen Gravitationsgesetzes sowie die Bestimmung astronomischer "
        "Größen auf Basis der Kepler'schen Gesetze zeigen die Vorhersagbarkeit "
        "dieser Vorgänge",
      "Zufall und Determiniertheit":
        "die Regelmäßigkeit der Planetenbewegungen um die Sonne ist ein Beispiel "
        "für die Determiniertheit physikalischer Abläufe durch Naturgesetze"}),

 # ── Qualifikationsphase, hier nur als Uebersicht (Kap. 2.1.2, S. 18-20) ──
 3: ("Klassische Wellen und geladene Teilchen in Feldern", "QP-GK", {}, {}),
 4: ("Quantenobjekte", "QP-GK", {}, {}),
 5: ("Elektrodynamik und Energieübertragung", "QP-GK", {}, {}),
 6: ("Strahlung und Materie", "QP-GK", {}, {}),
 7: ("Ladungen, Felder und Induktion", "QP-LK", {}, {}),
 8: ("Schwingende Systeme und Wellen", "QP-LK", {}, {}),
 9: ("Quantenphysik", "QP-LK", {}, {}),
 10: ("Atom- und Kernphysik", "QP-LK", {}, {}),
}

EF_FELDER = [n for n, f in INHALTSFELD.items() if f[1] == "EF"]


def feldname(nr):
    return INHALTSFELD[nr][0]


def schwerpunkte(nr):
    return INHALTSFELD[nr][2]


def basiskonzept(nr, stichwort=None):
    """Beitrag des Inhaltsfelds zu einem Basiskonzept.

    Ohne Stichwort: alle Beitraege des Felds. NICHT jedes Feld nennt alle vier
    Konzepte - Inhaltsfeld 2 hat nur zwei. Wer blind alle vier auf die Seite
    setzt, druckt eine Zuordnung, die der Plan nicht hergibt.
    """
    bk = INHALTSFELD[nr][3]
    return bk.get(stichwort) if stichwort else bk

# ── Zuordnung Kapitel -> Inhaltsfeld ────────────────────────────────
# Dieselbe Schnittstelle wie lehrplan.py / lehrplan_gts.py / lehrplan_gym.py,
# damit build_book.py sie austauschbar benutzen kann.
KAPITEL_FELD = {
    "ef_mechanik":    1,
    "ef_gravitation": 2,
}


def feld(kapitel_id):
    nr = KAPITEL_FELD.get(kapitel_id)
    if not nr: return None
    name, stufe, schwer, bk = INHALTSFELD[nr]
    return nr, name, bk


def zeile(kapitel_id):
    """Eine Zeile fuer die Kapitel-Trennseite."""
    f = feld(kapitel_id)
    if not f: return None
    nr, name, bk = f
    return f"INHALTSFELD {nr} · {name.upper()}"


def konzepte(kapitel_id):
    """Nur die Basiskonzepte, die DIESES Inhaltsfeld laut Plan wirklich nennt.

    Inhaltsfeld 2 nennt zwei der vier. Wer blind BASISKONZEPTE durchlaeuft,
    druckt fuer Kapitel 2 eine Zuordnung, die der Kernlehrplan nicht hergibt.
    """
    f = feld(kapitel_id)
    return list(f[2].keys()) if f else []
