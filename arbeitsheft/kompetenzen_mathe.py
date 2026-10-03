# -*- coding: utf-8 -*-
"""Kompetenzerwartungen Mathematik, Sekundarstufe I, bis Ende Klasse 5/6.

Quelle: Kernlehrplan Mathematik Realschule NRW (Heft 3302, Endfassung 17.06.2022,
gueltig seit 01.08.2022), Kap. 2.2 und 2.3 - WOERTLICH, maschinell aus dem PDF
gezogen (kernlehrplan/rs_m_klp_2022_volltext.txt) und von Silbentrennungsresten
befreit. Der Kernlehrplan Gesamtschule/Sekundarschule Mathematik 2022 ist fuer 5/6
WORTGLEICH (gegengeprueft 03.10.2026, kernlehrplan/mathe56_auswertung.md).

Codes in der Zaehlung des amtlichen Beispiels fuer einen schulinternen Lehrplan
(QUA-LiS, 09.06.2023): Ope/Mod/Pro/Arg/Kom = prozessbezogen, Ari/Fkt/Geo/Sto =
inhaltsbezogen bis Ende 5/6. "Werkzeuge nutzen" ist KEIN eigener Bereich (das war
der Lehrplan 2004), und Anforderungsbereiche I/II/III kennt dieser Kernlehrplan
NICHT - das Wort kommt im ganzen Dokument nicht vor.
"""

BEREICH = {
    "Ope": "Operieren",
    "Mod": "Modellieren",
    "Pro": "Problemlösen",
    "Arg": "Argumentieren",
    "Kom": "Kommunizieren",
    "Ari": "Arithmetik/Algebra",
    "Fkt": "Funktionen",
    "Geo": "Geometrie",
    "Sto": "Stochastik"
}

# Unterbereiche der fuenf Prozesse: (von, bis, Name)
TEIL = {
    "Ope": [(1, 8, "Hilfsmittelfreies Operieren"), (9, 13, "Arbeiten mit Medien und Werkzeugen")],
    "Mod": [(1, 3, "Strukturieren"), (4, 6, "Mathematisieren"), (7, 9, "Interpretieren und Validieren")],
    "Pro": [(1, 3, "Erkunden"), (4, 6, "Lösen"), (7, 10, "Reflektieren")],
    "Arg": [(1, 3, "Vermuten"), (4, 8, "Begründen"), (9, 10, "Beurteilen")],
    "Kom": [(1, 3, "Rezipieren"), (4, 8, "Produzieren"), (9, 11, "Diskutieren")],
}

KOMPETENZ = {
    "Ope-1": "wenden grundlegende Kopfrechenfertigkeiten sicher an",
    "Ope-2": "stellen sich geometrische Situationen räumlich vor und wechseln zwischen Perspektiven",
    "Ope-3": "übersetzen symbolische und formale Sprache in natürliche Sprache und umgekehrt",
    "Ope-4": "führen geeignete Rechenoperationen auf der Grundlage eines inhaltlichen Verständnisses durch",
    "Ope-5": "arbeiten unter Berücksichtigung mathematischer Regeln und Gesetze mit Variablen, Termen, Gleichungen und Funktionen",
    "Ope-6": "führen Darstellungswechsel sicher aus",
    "Ope-7": "führen Lösungs- und Kontrollverfahren sicher und effizient durch",
    "Ope-8": "nutzen schematisierte und strategiegeleitete Verfahren, Algorithmen und Regeln",
    "Ope-9": "nutzen mathematische Hilfsmittel (Lineal, Geodreieck und Zirkel) zum Messen, genauen Zeichnen und Konstruieren",
    "Ope-10": "recherchieren Informationen und Daten aus Medienangeboten (Printmedien, Internet und Formelsammlung)",
    "Ope-11": "nutzen digitale Mathematikwerkzeuge (dynamische Geometriesoftware, Computer-Algebra-Systeme, Multirepräsentationssysteme, Taschenrechner und Tabellenkalkulation)",
    "Ope-12": "entscheiden situationsangemessen über den Einsatz mathematischer Hilfsmittel und digitaler Mathematikwerkzeuge und wählen diese begründet aus",
    "Ope-13": "nutzen analoge und digitale Medien zur Unterstützung, zur Gestaltung mathematischer Prozesse und zur Präsentation",
    "Mod-1": "erfassen reale Situationen und beschreiben diese mit Worten und Skizzen",
    "Mod-2": "stellen eigene Fragen zu realen Situationen, die mithilfe mathematischer Kenntnisse und Fertigkeiten beantwortet werden können",
    "Mod-3": "treffen begründet Annahmen und nehmen Vereinfachungen realer Situationen vor",
    "Mod-4": "übersetzen reale Situationen in mathematische Modelle bzw. wählen geeignete Modelle aus und nutzen geeignete Darstellungen",
    "Mod-5": "ordnen einem mathematischen Modell passende reale Situationen zu",
    "Mod-6": "erarbeiten mithilfe mathematischer Kenntnisse und Fertigkeiten Lösungen innerhalb des mathematischen Modells",
    "Mod-7": "beziehen erarbeitete Lösungen auf die reale Situation und interpretieren diese als Antwort auf die Fragestellung",
    "Mod-8": "überprüfen Lösungen auf ihre Plausibilität in realen Situationen",
    "Mod-9": "benennen Grenzen aufgestellter mathematischer Modelle und verbessern aufgestellte Modelle mit Blick auf die Fragestellung",
    "Pro-1": "geben Problemsituationen in eigenen Worten wieder und stellen Fragen zu einer gegebenen Problemsituation",
    "Pro-2": "wählen geeignete heuristische Hilfsmittel aus (Skizze, informative Figur, Tabelle, experimentelle Verfahren)",
    "Pro-3": "setzen Muster und Zahlenfolgen fort, beschreiben Beziehungen zwischen Größen und stellen begründete Vermutungen über Zusammenhänge auf",
    "Pro-4": "wählen geeignete Begriffe, Zusammenhänge, Verfahren, Medien und Werkzeuge zur Problemlösung aus",
    "Pro-5": "nutzen heuristische Strategien und Prinzipien (Beispiele finden, Spezialfälle finden, Analogiebetrachtungen, Schätzen und Überschlagen, systematisches Probieren oder Ausschließen, Darstellungswechsel, Zerlegen und Ergänzen, Symmetrien verwenden, Invarianten finden, Zurückführen auf Bekanntes, Zerlegen in Teilprobleme, Fallunterscheidungen, Vorwärts- und Rückwärtsarbeiten, Schlussfolgern, Verallgemeinern)",
    "Pro-6": "entwickeln Ideen für mögliche Lösungswege, planen Vorgehensweisen zur Lösung eines Problems und führen Lösungspläne zielgerichtet aus",
    "Pro-7": "überprüfen die Plausibilität von Ergebnissen",
    "Pro-8": "vergleichen verschiedene Lösungswege im Hinblick auf Gemeinsamkeiten und Unterschiede und beurteilen deren Effizienz",
    "Pro-9": "analysieren und reflektieren Ursachen von Fehlern",
    "Pro-10": "benennen zugrundeliegende heuristische Strategien und Prinzipien und übertragen diese begründet auf andere Problemstellungen",
    "Arg-1": "stellen Fragen, die für die Mathematik charakteristisch sind, und stellen begründete Vermutungen über die Existenz und Art von Zusammenhängen auf",
    "Arg-2": "benennen Beispiele für vermutete Zusammenhänge",
    "Arg-3": "präzisieren Vermutungen mithilfe von Fachbegriffen und unter Berücksichtigung der logischen Struktur",
    "Arg-4": "stellen Relationen zwischen Fachbegriffen her (Ober-/Unterbegriff)",
    "Arg-5": "begründen Lösungswege und nutzen dabei mathematische Regeln bzw. Sätze und sachlogische Argumente",
    "Arg-6": "verknüpfen Argumente zu Argumentationsketten",
    "Arg-7": "nutzen verschiedene Argumentationsstrategien (Gegenbeispiel, direktes Schlussfolgern, Widerspruch)",
    "Arg-8": "erläutern vorgegebene Argumentationen und Beweise hinsichtlich ihrer logischen Struktur",
    "Arg-9": "beurteilen, ob vorliegende Argumentationen und Argumentationsketten vollständig und fehlerfrei sind",
    "Arg-10": "ergänzen lückenhafte und korrigieren fehlerhafte Argumentationsketten",
    "Kom-1": "entnehmen und strukturieren Informationen aus mathematikhaltigen Texten und Darstellungen",
    "Kom-2": "recherchieren und bewerten fachbezogene Informationen",
    "Kom-3": "erläutern Begriffsinhalte anhand von typischen inner- und außermathematischen Anwendungssituationen",
    "Kom-4": "geben Beobachtungen, bekannte Lösungswege und Verfahren mit eigenen Worten und mithilfe mathematischer Begriffe wieder",
    "Kom-5": "verbalisieren eigene Denkprozesse und beschreiben eigene Lösungswege",
    "Kom-6": "verwenden in angemessenem Umfang die fachgebundene Sprache",
    "Kom-7": "wählen je nach Situation und Zweck geeignete Darstellungsformen",
    "Kom-8": "dokumentieren Arbeitsschritte nachvollziehbar und präsentieren diese",
    "Kom-9": "greifen Beiträge auf und entwickeln sie weiter",
    "Kom-10": "vergleichen und beurteilen Ausarbeitungen und Präsentationen hinsichtlich ihrer fachlichen Richtigkeit, Verständlichkeit und fachsprachlichen Qualität",
    "Kom-11": "führen Entscheidungen auf der Grundlage fachbezogener Diskussionen herbei",
    "Ari-1": "führen Grundrechenarten in unterschiedlichen Darstellungen sowohl im Kopf als auch schriftlich durch und stellen Rechenschritte nachvollziehbar dar",
    "Ari-2": "runden Zahlen im Kontext sinnvoll und wenden Überschlag und Probe als Kontrollstrategien an",
    "Ari-3": "begründen mithilfe von Rechengesetzen Strategien zum vorteilhaften Rechnen und nutzen diese",
    "Ari-4": "verbalisieren Rechenterme unter Verwendung von Fachbegriffen und übersetzen Rechenanweisungen und Sachsituationen in Rechenterme",
    "Ari-5": "nutzen Variablen bei der Beschreibung von einfachen Sachzusammenhängen und bei der Formulierung von Rechengesetzen",
    "Ari-6": "setzen Zahlen in Terme mit Variablen ein und berechnen deren Wert",
    "Ari-7": "kehren Rechenanweisungen um",
    "Ari-8": "bestimmen Teiler natürlicher Zahlen, wenden dabei die Teilbarkeitsregeln für 2, 3, 5 und 10 an und kombinieren diese zu weiteren Teilbarkeitsregeln",
    "Ari-9": "erläutern Eigenschaften von Primzahlen",
    "Ari-10": "deuten Brüche als Anteile, Operatoren, Quotienten, Zahlen und Verhältnisse",
    "Ari-11": "berechnen und deuten Bruchteil, Anteil und Ganzes im Kontext",
    "Ari-12": "kürzen und erweitern Brüche und deuten dies als Vergröbern bzw. Verfeinern der Einteilung",
    "Ari-13": "führen Grundrechenarten der Addition und der Subtraktion mit einfachen Brüchen durch und stellen Rechenschritte nachvollziehbar dar",
    "Ari-14": "nutzen ganze Zahlen zur Beschreibung von Zuständen und Veränderungen in Sachzusammenhängen",
    "Ari-15": "stellen Zahlen auf unterschiedlichen Weisen dar, vergleichen sie und wechseln situationsangemessen zwischen den verschiedenen Darstellungen auch mithilfe digitaler Medien",
    "Ari-16": "schätzen Größen, wählen Einheiten von Größen situationsgerecht aus und wandeln sie um",
    "Fkt-1": "beschreiben den Zusammenhang zwischen zwei Größen mithilfe von Worten, Diagrammen und Tabellen",
    "Fkt-2": "erkennen Zusammenhänge in konkreten Situationen und Sachproblemen und lösen durch Rechnen",
    "Fkt-3": "erkunden Muster in Zahlenfolgen und beschreiben die Gesetzmäßigkeiten in Worten und mit Termen",
    "Fkt-4": "erfassen gängige Maßstabsverhältnisse und fertigen Zeichnungen in geeigneten Maßstäben an",
    "Geo-1": "erläutern Grundbegriffe und verwenden diese zur Beschreibung von ebenen Figuren und Körpern sowie deren Lagebeziehungen zueinander",
    "Geo-2": "charakterisieren und klassifizieren besondere Dreiecke und Vierecke",
    "Geo-3": "identifizieren und charakterisieren Körper in bildlichen Darstellungen und in der Umwelt",
    "Geo-4": "zeichnen ebene Figuren unter Verwendung angemessener Hilfsmittel wie Zirkel, Lineal und Geodreieck sowie dynamischer Geometriesoftware",
    "Geo-5": "erzeugen ebene symmetrische Figuren und Muster und ermitteln Symmetrieachsen bzw. Symmetriepunkte",
    "Geo-6": "stellen ebene Figuren im kartesischen Koordinatensystem dar",
    "Geo-7": "erzeugen Abbildungen ebener Figuren durch Verschieben und Spiegeln, auch im Koordinatensystem",
    "Geo-8": "nutzen dynamische Geometriesoftware zur Analyse von Verkettungen von Abbildungen ebener Figuren",
    "Geo-9": "schätzen und messen die Größe von Winkeln und klassifizieren Winkel mit Fachbegriffen",
    "Geo-10": "schätzen die Länge von Strecken und bestimmen sie mithilfe von Maßstäben",
    "Geo-11": "nutzen das Grundprinzip des Messens bei der Flächen- und Volumenbestimmung",
    "Geo-12": "berechnen den Umfang von Drei- und Vierecken, den Flächeninhalt von Rechtecken und rechtwinkligen Dreiecken sowie den Oberflächeninhalt und das Volumen von Quadern",
    "Geo-13": "bestimmen den Flächeninhalt ebener Figuren durch Zerlegungs- und Ergänzungsstrategien",
    "Geo-14": "beschreiben das Ergebnis von Drehungen und Verschiebungen eines Quaders aus der Vorstellung heraus",
    "Geo-15": "stellen Quader und Würfel als Netz, Schrägbild und Modell dar und erkennen Körper aus ihren entsprechenden Darstellungen",
    "Sto-1": "erheben Daten, fassen sie in Ur- und Strichlisten zusammen und bilden geeignete Klasseneinteilungen",
    "Sto-2": "stellen Häufigkeiten in Tabellen und Diagrammen dar auch unter Verwendung digitaler Mathematikwerkzeuge (Tabellenkalkulation)",
    "Sto-3": "bestimmen, vergleichen und deuten Häufigkeiten und Kenngrößen statistischer Daten",
    "Sto-4": "lesen und interpretieren grafische Darstellungen statistischer Erhebungen",
    "Sto-5": "diskutieren Vor- und Nachteile graphischer Darstellungen",
}


def text(code):
    """Wortlaut einer Kompetenzerwartung; unbekannter Code -> None."""
    return KOMPETENZ.get(code)


def bereich(code):
    """'Arg-5' -> 'Argumentieren · Begründen', 'Ari-15' -> 'Arithmetik/Algebra'."""
    k, _, n = (code or "").partition("-")
    if k not in BEREICH:
        return None
    for von, bis, name in TEIL.get(k, []):
        if von <= int(n) <= bis:
            return BEREICH[k] + " · " + name
    return BEREICH[k]


def pruefe(codes):
    """Liste der Codes, die es im Kernlehrplan 5/6 NICHT gibt (z. B. UF1, E3)."""
    return [c for c in codes if c not in KOMPETENZ]


def _selbsttest():
    # Bekannte Stellen gegen den gedruckten Wortlaut, beide Richtungen.
    assert len(KOMPETENZ) == 13 + 9 + 10 + 10 + 11 + 16 + 4 + 15 + 5, len(KOMPETENZ)
    assert text("Ope-11").startswith("nutzen digitale Mathematikwerkzeuge")
    assert text("Ari-2") == ("runden Zahlen im Kontext sinnvoll und wenden Überschlag "
                             "und Probe als Kontrollstrategien an")
    assert text("Sto-2").endswith("(Tabellenkalkulation)")
    assert bereich("Arg-5") == "Argumentieren · Begründen"
    assert bereich("Ope-9") == "Operieren · Arbeiten mit Medien und Werkzeugen"
    assert pruefe(["Ari-15", "UF1", "E3", "Ope-14"]) == ["UF1", "E3", "Ope-14"]
    for c, s in KOMPETENZ.items():
        assert "Die Schülerinnen und Schüler" not in s, c   # Zwischenueberschrift mitgezogen?
        assert not s.endswith((",", ".")), c


_selbsttest()
