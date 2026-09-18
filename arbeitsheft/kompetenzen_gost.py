# -*- coding: utf-8 -*-
"""Kompetenzen und Anforderungsbereiche der FeLabs-Hefte fuer die OBERSTUFE.

Quelle: Kernlehrplan fuer die Sekundarstufe II - Gymnasium/Gesamtschule in
Nordrhein-Westfalen, Physik (Heft 4721, RdErl. v. 31.05.2022, in Kraft zum
1. August 2022 beginnend mit der Einfuehrungsphase), Kapitel 2.1.1 und 2.2.
Codes und Wortlaut sind woertlich uebernommen (Seiten 22-25).
Original, Volltext und Auswertung: LernStar/kernlehrplan/.

DIESE DATEI IST NICHT kompetenzen.py. Die Oberstufe hat ANDERE Codes als die
Sekundarstufe I - wer die Sek-I-Codes uebernimmt, schreibt falsche Bezuege ins
Heft. Die Unterschiede:

    Sek I (Heft 3307/3108/3411)      Oberstufe (Heft 4721)
    UF1-UF4  Umgang mit Fachwissen   S1-S7    Sachkompetenz
    E1-E13   Erkenntnisgewinnung     E1-E11   Erkenntnisgewinnungskompetenz
    K1-K9    Kommunikation           K1-K10   Kommunikationskompetenz
    B1-B4    Bewertung               B1-B8    Bewertungskompetenz

Zusammen 36 uebergeordnete Kompetenzerwartungen.

ANFORDERUNGSBEREICHE: Anders als der Realschulplan der Sek I nennt DIESER Plan
die drei Anforderungsbereiche ausdruecklich und mit vollem Wortlaut (Kapitel 4,
Seiten 59-60). Sie duerfen hier also als Vorgabe des Kernlehrplans gekennzeichnet
werden - in den Sek-I-Heften nicht.
"""
import re

QUELLE = ("Kernlehrplan Physik, Sekundarstufe II Gymnasium/Gesamtschule NRW "
          "(Heft 4721, 2022) · Kompetenzcodes wörtlich übernommen")

# ── Die vier Kompetenzbereiche ──────────────────────────────────────
BEREICH = {"S": "Sachkompetenz",
           "E": "Erkenntnisgewinnungskompetenz",
           "K": "Kommunikationskompetenz",
           "B": "Bewertungskompetenz"}

# ── Gruppenueberschriften des Plans (Zwischenueberschriften in Kap. 2.2) ──
GRUPPE = {
 "S1": "Modelle und Konzepte zur Bearbeitung von Aufgaben und Problemen nutzen",
 "S2": "Modelle und Konzepte zur Bearbeitung von Aufgaben und Problemen nutzen",
 "S3": "Modelle und Konzepte zur Bearbeitung von Aufgaben und Problemen nutzen",
 "S4": "Verfahren und Experimente zur Bearbeitung von Aufgaben und Problemen nutzen",
 "S5": "Verfahren und Experimente zur Bearbeitung von Aufgaben und Problemen nutzen",
 "S6": "Verfahren und Experimente zur Bearbeitung von Aufgaben und Problemen nutzen",
 "S7": "Verfahren und Experimente zur Bearbeitung von Aufgaben und Problemen nutzen",
 "E1": "Fragestellungen und Hypothesen auf Basis von Beobachtungen und Konzepten bilden",
 "E2": "Fragestellungen und Hypothesen auf Basis von Beobachtungen und Konzepten bilden",
 "E3": "Fachspezifische Modelle und Verfahren charakterisieren, auswählen und nutzen",
 "E4": "Fachspezifische Modelle und Verfahren charakterisieren, auswählen und nutzen",
 "E5": "Fachspezifische Modelle und Verfahren charakterisieren, auswählen und nutzen",
 "E6": "Erkenntnisprozesse und Ergebnisse interpretieren und reflektieren",
 "E7": "Erkenntnisprozesse und Ergebnisse interpretieren und reflektieren",
 "E8": "Erkenntnisprozesse und Ergebnisse interpretieren und reflektieren",
 "E9": "Erkenntnisprozesse und Ergebnisse interpretieren und reflektieren",
 "E10": "Merkmale wissenschaftlicher Aussagen und Methoden charakterisieren und reflektieren",
 "E11": "Merkmale wissenschaftlicher Aussagen und Methoden charakterisieren und reflektieren",
 "K1": "Informationen erschließen", "K2": "Informationen erschließen",
 "K3": "Informationen erschließen",
 "K4": "Informationen aufbereiten", "K5": "Informationen aufbereiten",
 "K6": "Informationen aufbereiten", "K7": "Informationen aufbereiten",
 "K8": "Informationen austauschen und wissenschaftlich diskutieren",
 "K9": "Informationen austauschen und wissenschaftlich diskutieren",
 "K10": "Informationen austauschen und wissenschaftlich diskutieren",
 "B1": "Sachverhalte und Informationen multiperspektivisch beurteilen",
 "B2": "Sachverhalte und Informationen multiperspektivisch beurteilen",
 "B3": "Kriteriengeleitet Meinungen bilden und Entscheidungen treffen",
 "B4": "Kriteriengeleitet Meinungen bilden und Entscheidungen treffen",
 "B5": "Entscheidungsprozesse und Folgen reflektieren",
 "B6": "Entscheidungsprozesse und Folgen reflektieren",
 "B7": "Entscheidungsprozesse und Folgen reflektieren",
 "B8": "Entscheidungsprozesse und Folgen reflektieren",
}

# ── Wortlaut der 36 uebergeordneten Kompetenzerwartungen (Seiten 22-25) ──
KOMPETENZ = {
 "S1": "erklären Phänomene und Zusammenhänge unter Verwendung von Konzepten, "
       "übergeordneten Prinzipien, Modellen und Gesetzen",
 "S2": "beschreiben Gültigkeitsbereiche von Modellen und Konzepten und geben "
       "deren Aussage- und Vorhersagemöglichkeiten an",
 "S3": "wählen zur Bearbeitung physikalischer Probleme relevante Modelle und "
       "Konzepte sowie funktionale Beziehungen zwischen physikalischen Größen "
       "begründet aus",
 "S4": "bauen einfache Versuchsanordnungen auch unter Verwendung von digitalen "
       "Messwerterfassungssystemen nach Anleitungen auf, führen Experimente durch "
       "und protokollieren ihre qualitativen Beobachtungen und quantitativen Messwerte",
 "S5": "beschreiben bekannte Messverfahren sowie die Funktion einzelner "
       "Komponenten eines Versuchsaufbaus",
 "S6": "nutzen bekannte Auswerteverfahren für Messergebnisse",
 "S7": "wenden unter Anleitung mathematische Verfahren auf physikalische "
       "Sachverhalte an",

 "E1": "identifizieren und entwickeln Fragestellungen zu physikalischen Sachverhalten",
 "E2": "stellen überprüfbare Hypothesen zur Bearbeitung von Fragestellungen auf",
 "E3": "erläutern an ausgewählten Beispielen die Eignung von Untersuchungsverfahren "
       "zur Prüfung bestimmter Hypothesen",
 "E4": "modellieren Phänomene physikalisch, auch mithilfe einfacher mathematischer "
       "Darstellungen und digitaler Werkzeuge",
 "E5": "konzipieren erste Experimente und Auswertungen zur Untersuchung einer "
       "physikalischen Fragestellung unter Beachtung der Variablenkontrolle",
 "E6": "untersuchen mithilfe bekannter Modelle und Konzepte die in erhobenen oder "
       "recherchierten Daten vorliegenden Strukturen und Beziehungen",
 "E7": "berücksichtigen Messunsicherheiten bei der Interpretation der Ergebnisse",
 "E8": "untersuchen die Eignung physikalischer Modelle und Konzepte für die Lösung "
       "von Problemen",
 "E9": "beschreiben an ausgewählten Beispielen die Relevanz von Modellen, Konzepten, "
       "Hypothesen und Experimenten im Prozess der physikalischen Erkenntnisgewinnung",
 "E10": "beziehen theoretische Überlegungen und Modelle zurück auf zugrundeliegende "
        "Kontexte",
 "E11": "reflektieren Möglichkeiten und Grenzen des konkreten "
        "Erkenntnisgewinnungsprozesses an ausgewählten Beispielen",

 "K1": "recherchieren zu physikalischen Sachverhalten zielgerichtet in analogen und "
       "digitalen Medien und wählen für ihre Zwecke passende Quellen aus",
 "K2": "analysieren verwendete Quellen hinsichtlich der Kriterien Korrektheit, "
       "Fachsprache und Relevanz für den untersuchten Sachverhalt",
 "K3": "entnehmen unter Anleitung und Berücksichtigung ihres Vorwissens aus "
       "Beobachtungen, Darstellungen und Texten relevante Informationen und geben "
       "diese in passender Struktur und angemessener Fachsprache wieder",
 "K4": "formulieren unter Verwendung der Fachsprache kausal korrekt",
 "K5": "wählen ziel-, sach- und adressatengerecht geeignete Schwerpunkte für die "
       "Inhalte von kurzen Vorträgen und schriftlichen Ausarbeitungen aus",
 "K6": "veranschaulichen Informationen und Daten auch mithilfe digitaler Werkzeuge",
 "K7": "präsentieren physikalische Sachverhalte sowie Lern- und Arbeitsergebnisse "
       "unter Einsatz geeigneter analoger und digitaler Medien",
 "K8": "nutzen ihr Wissen über aus physikalischer Sicht gültige Argumentationsketten "
       "zur Beurteilung vorgegebener Darstellungen",
 "K9": "tauschen sich ausgehend vom eigenen Standpunkt mit anderen konstruktiv über "
       "physikalische Sachverhalte auch in digitalen kollaborativen Arbeitssituationen aus",
 "K10": "belegen verwendete Quellen und kennzeichnen Zitate",

 "B1": "erarbeiten aus verschiedenen Perspektiven eine schlüssige Argumentation",
 "B2": "analysieren Informationen und deren Darstellung aus Quellen unterschiedlicher "
       "Art hinsichtlich ihrer Relevanz",
 "B3": "entwickeln anhand festgelegter Bewertungskriterien Handlungsoptionen in "
       "gesellschaftlich- oder alltagsrelevanten Entscheidungssituationen mit "
       "fachlichem Bezug",
 "B4": "bilden sich reflektiert ein eigenes Urteil",
 "B5": "vollziehen Bewertungen von Technologien und Sicherheitsmaßnahmen oder "
       "Risikoeinschätzungen nach",
 "B6": "beurteilen Technologien und Sicherheitsmaßnahmen hinsichtlich ihrer Eignung "
       "auch in Alltagssituationen",
 "B7": "identifizieren kurz- und langfristige Folgen eigener und gesellschaftlicher "
       "Entscheidungen mit physikalischem Hintergrund",
 "B8": "identifizieren Auswirkungen physikalischer Weltbetrachtung sowie die Bedeutung "
       "physikalischer Kompetenzen in historischen, gesellschaftlichen oder alltäglichen "
       "Zusammenhängen",
}

# ── Kurztitel fuer das Kaertchen auf der Schuelerseite ──────────────
# Der Plan liefert keine Kurztitel (die Sek-I-Plaene tun das). Diese Liste ist
# eine Verkuerzung des Wortlauts fuer den Druck - das Kaertchen traegt nur den
# Code, der Kurztitel steht im Loesungsteil.
KURZ = {
 "S1": "Phänomene erklären", "S2": "Gültigkeitsbereiche angeben",
 "S3": "Modelle begründet auswählen", "S4": "Experimente durchführen und protokollieren",
 "S5": "Messverfahren beschreiben", "S6": "Auswerteverfahren nutzen",
 "S7": "Mathematische Verfahren anwenden",
 "E1": "Fragestellungen entwickeln", "E2": "Hypothesen aufstellen",
 "E3": "Eignung von Verfahren erläutern", "E4": "Phänomene modellieren",
 "E5": "Experimente konzipieren", "E6": "Strukturen in Daten untersuchen",
 "E7": "Messunsicherheiten berücksichtigen", "E8": "Eignung von Modellen prüfen",
 "E9": "Relevanz im Erkenntnisprozess beschreiben", "E10": "Modelle auf Kontexte zurückbeziehen",
 "E11": "Grenzen der Erkenntnisgewinnung reflektieren",
 "K1": "Zielgerichtet recherchieren", "K2": "Quellen analysieren",
 "K3": "Informationen entnehmen und wiedergeben", "K4": "Kausal korrekt formulieren",
 "K5": "Schwerpunkte auswählen", "K6": "Daten veranschaulichen",
 "K7": "Ergebnisse präsentieren", "K8": "Argumentationsketten beurteilen",
 "K9": "Sich fachlich austauschen", "K10": "Quellen belegen, Zitate kennzeichnen",
 "B1": "Schlüssig argumentieren", "B2": "Relevanz von Quellen analysieren",
 "B3": "Handlungsoptionen entwickeln", "B4": "Reflektiert urteilen",
 "B5": "Bewertungen nachvollziehen", "B6": "Technologien beurteilen",
 "B7": "Folgen identifizieren", "B8": "Auswirkungen physikalischer Weltbetrachtung",
}

# ── Anforderungsbereiche: HIER amtlich, Wortlaut aus Kapitel 4 (S. 59-60) ──
ANFORDERUNGSBEREICH = {
 "I":   "das Wiedergeben von Sachverhalten und Kenntnissen im gelernten "
        "Zusammenhang, die Verständnissicherung sowie das Anwenden und Beschreiben "
        "geübter Arbeitstechniken und Verfahren",
 "II":  "das selbstständige Auswählen, Anordnen, Verarbeiten, Erklären und "
        "Darstellen bekannter Sachverhalte unter vorgegebenen Gesichtspunkten in "
        "einem durch Übung bekannten Zusammenhang und das selbstständige Übertragen "
        "und Anwenden des Gelernten auf vergleichbare neue Zusammenhänge und Sachverhalte",
 "III": "das Verarbeiten komplexer Sachverhalte mit dem Ziel, zu selbstständigen "
        "Lösungen, Gestaltungen oder Deutungen, Folgerungen, Verallgemeinerungen, "
        "Begründungen und Wertungen zu gelangen",
}
# Der Plan haelt ausdruecklich fest: "der Anforderungsbereich II aber den
# Schwerpunkt bildet" (S. 60). Die Aufgabenverteilung im Heft folgt dem.
SCHWERPUNKT = "II"

_CODE = re.compile(r"^([SEKB])(\d{1,2})$")


def gueltig(code):
    """Ist der Code ein Kompetenzcode DIESES Plans?"""
    return code in KOMPETENZ


def bereich(code):
    m = _CODE.match(code or "")
    return BEREICH.get(m.group(1)) if m else None


def pruefe(codes):
    """Meldet Codes, die es in der Oberstufe nicht gibt - vor allem versehentlich
    uebernommene Sek-I-Codes wie UF1 oder E12."""
    return [c for c in codes if not gueltig(c)]
