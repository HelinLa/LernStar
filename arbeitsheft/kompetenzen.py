# -*- coding: utf-8 -*-
"""Kompetenzen und Anforderungsbereiche der FeLabs-Hefte.

Quelle der Kompetenzcodes und ihres Wortlauts:
Kernlehrplan für die Realschule in Nordrhein-Westfalen, Physik (Heft 3307,
1. Auflage 2011), Kapitel „Übergeordnete Kompetenzerwartungen“. Die Codes und
Kurztitel sind woertlich uebernommen.

**Anforderungsbereiche stehen NICHT in diesem Kernlehrplan.** Er kennt statt
dessen zwei Progressionsstufen. Die dreistufige Einteilung I / II / III ist die
uebliche Gliederung der Bildungsstandards und der zentralen Pruefungen; sie wird
hier so verwendet und im Heft auch so gekennzeichnet - nicht als Vorgabe des
Kernlehrplans.
"""
import re

QUELLE = ("Kernlehrplan Physik, Realschule NRW (Heft 3307, 2011) · "
          "Kompetenzcodes wörtlich übernommen")

# ── Kompetenzbereiche und ihre Teilkompetenzen (Wortlaut des Kernlehrplans) ──
BEREICH = {"UF": "Umgang mit Fachwissen", "E": "Erkenntnisgewinnung",
           "K": "Kommunikation", "B": "Bewertung"}

KOMPETENZ = {
 "UF1": "Fakten wiedergeben und erläutern",
 "UF2": "Konzepte unterscheiden und auswählen",
 "UF3": "Sachverhalte ordnen und strukturieren",
 "UF4": "Wissen vernetzen",
 "E1":  "Fragestellungen erkennen",
 "E2":  "Bewusst wahrnehmen",
 "E3":  "Hypothesen entwickeln",
 "E4":  "Untersuchungen und Experimente planen",
 "E5":  "Untersuchungen und Experimente durchführen",
 "E6":  "Untersuchungen und Experimente auswerten",
 "E7":  "Modelle auswählen und Modellgrenzen angeben",
 "E8":  "Modelle anwenden",
 "E9":  "Arbeits- und Denkweisen reflektieren",
 "K1":  "Texte lesen und erstellen",
 "K2":  "Informationen identifizieren",
 "K3":  "Untersuchungen dokumentieren",
 "K4":  "Daten aufzeichnen und darstellen",
 "K5":  "Recherchieren",
 "K6":  "Informationen umsetzen",
 "K7":  "Beschreiben, präsentieren, begründen",
 "K8":  "Zuhören, hinterfragen",
 "K9":  "Kooperieren und im Team arbeiten",
 "B1":  "Bewertungen an Kriterien orientieren",
 "B2":  "Argumentieren und Position beziehen",
 "B3":  "Werte und Normen berücksichtigen",
}

# ── Anforderungsbereiche (Bildungsstandards, nicht Kernlehrplan) ─────────────
AFB = {
 "I":   ("Reproduzieren", "Bekanntes wiedergeben und ein geübtes Verfahren anwenden"),
 "II":  ("Zusammenhänge herstellen", "Gelerntes auf einen neuen Fall übertragen, erklären und berechnen"),
 "III": ("Verallgemeinern und reflektieren", "selbst planen, begründet beurteilen und Stellung nehmen"),
}

# ── Erkennung am Operator ───────────────────────────────────────────────────
# Zuerst geprueft wird das, was am staerksten festlegt: Bewerten schlaegt
# Erklaeren, auch wenn beides im selben Satz steht.
_REGELN = [
 ("B2",  r"beurteil|bewerte|nimm stellung|stellung nehmen|wäge ab|abwäg|"
         r"widersprich|prüfe die (?:aussage|behauptung)|wer hat recht"),
 ("B3",  r"umwelt|klima|gesundheit|verantwort|gerecht|nachhaltig|sparen lohnt"),
 ("K7",  r"erkläre (?:einem|einer|deiner|deinem)|jüngeren|mitschüler|schwester|"
         r"bruder|präsentier|überzeug|adressaten"),
 ("K4",  r"zeichne (?:ein )?(?:diagramm|kurve|graph)|trage (?:die )?(?:werte|messwerte)|"
         r"lege eine tabelle|skaliere"),
 ("K1",  r"zeichne|skizziere|beschrifte|schreibe (?:einen|auf)|formuliere|in ganzen sätzen"),
 ("K2",  r"lies (?:aus|im|am) (?:diagramm|tabelle|text)|entnimm|aus der tabelle"),
 ("E7",  r"modellgrenze|grenze des modells|wo das modell"),
 ("E8",  r"sage voraus|vorhersag|mit dem modell"),
 ("E4",  r"\bplane\b|entwirf einen versuch|wie könntest du prüfen"),
 ("E3",  r"vermute|stelle eine vermutung|hypothes"),
 ("E6",  r"berechne|rechne|werte aus|bestimme|ermittle|leite ab|vergleiche die (?:werte|messwerte)"),
 ("E5",  r"untersuche|\bmiss\b|führe (?:den|einen) versuch|probiere"),
 ("E2",  r"beobachte|achte darauf|notiere, was"),
 ("UF4", r"übertrage|im alltag|zu hause|begegnet|wo findest du|anderes beispiel"),
 ("UF3", r"\bordne\b|sortiere|gruppiere|teile ein"),
 ("UF2", r"unterscheide|welcher (?:begriff|fall) passt|wähle .{0,20}begründ"),
 ("UF1", r"erkläre|erläutere|beschreibe|nenne|gib an|benenne|ergänze|fasse|begründe"),
]

# Anforderungsbereich am Operator
_AFB_III = r"beurteil|bewerte|nimm stellung|stellung nehmen|abwäg|\bplane\b|entwirf|" \
           r"entwickle|widersprich|wer hat recht|welche .{0,25}besser"
_AFB_I   = r"^nenne|^gib an|^benenne|^ergänze|^ordne|^zähle|^lies ab|^notiere|^schreibe auf|" \
           r"^kreuze|^markiere|^unterstreiche"


def _passt(text, muster):
    return bool(re.search(muster, text))


def kompetenz(text, vorgabe=None):
    """Teilkompetenz-Code (UF1 … B3) fuer einen Aufgabentext."""
    if vorgabe in KOMPETENZ:
        return vorgabe
    if not text:
        return "UF1"
    t = " " + re.sub(r"\s+", " ", text.lower()) + " "
    for code, muster in _REGELN:
        if _passt(t, muster):
            return code
    return "UF1"


def anforderung(text, vorgabe=None):
    """Anforderungsbereich I, II oder III fuer einen Aufgabentext."""
    if vorgabe in AFB:
        return vorgabe
    if not text:
        return "I"
    t = re.sub(r"\s+", " ", text.strip().lower())
    if _passt(t, _AFB_III): return "III"
    if _passt(t, _AFB_I):   return "I"
    return "II"


def bereich(code):
    """UF, E, K oder B zu einem Code."""
    return re.match(r"[A-Z]+", code).group(0)
