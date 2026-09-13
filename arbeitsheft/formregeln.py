# -*- coding: utf-8 -*-
"""Die Formregeln der Forscherseiten - als eigenes Modul, damit sie sich gegen
die fertigen Hefte pruefen lassen, bevor sie ueber neue Seiten urteilen."""
import re

PFLICHT = ["titel", "problem", "frage", "auftrag", "predict", "predictOk", "forschen",
           "tabCols", "tabRows", "fachtext", "merksatz", "beobachtung", "aufgabe",
           "alltag", "ueberleitung", "basiskonzept"]

OP_AUFTRAG = ("Untersuche", "Vergleiche", "Prüfe", "Bestimme", "Miss")
# Volle Operatorenliste (NRW). Gegen sie wird geprueft, denn die abgenommenen
# Hefte benutzen auch "Vergleiche" und "Bestimme". Der Fehler, den die Regel
# fangen soll, ist der Beginn mit einem Personennamen ("Ben dreht den Spiegel …").
OP_AUFGABE = ("Erkläre", "Erläutere", "Berechne", "Begründe", "Beurteile", "Bewerte",
              "Vergleiche", "Bestimme", "Untersuche", "Prüfe", "Miss", "Nenne",
              "Beschreibe", "Ordne", "Deute", "Werte", "Stelle", "Leite", "Gib",
              "Formuliere", "Entwickle", "Plane", "Skizziere", "Zeichne", "Interpretiere",
              "Sage", "Sortiere", "Beschrifte", "Uebertrage", "Übertrage")
OP_MEHRZAHL = ("Nenne", "Finde", "Suche", "Sammle")

_OHNE_GLYPHE = re.compile(
    "[\U0001F000-\U0001FAFF"      # Emoji und Piktogramme
    "\u2B00-\u2BFF"               # geometrische Formen
    "\u25A0-\u25FF"               # Blockelemente
    "\u2600-\u27BF"               # Symbole und Dingbats
    "\uFE0F\u200D]")


def pruefe_seite(s, streng=True, klasse=None):
    """`klasse` steuert die Laenge des Einstiegs.

    Klasse 5/6 richtet sich an Achtjaehrige und hat bewusst kuerzere Einstiege:
    gemessen 36 bis 51 Woerter, im Mittel 41,2. Die Hefte 7 bis 10 liegen bei 42
    bis 60, im Mittel 45 bis 52. Wer eine einzige Spanne fuer alle nimmt, meldet
    18 der 33 Seiten von Klasse 5/6 faelschlich."""
    f, tid = [], s.get("id", "?")
    for k in PFLICHT:
        if k not in s or s[k] in (None, "", []):
            f.append((tid, "fehlt", f"Feld „{k}“ fehlt"))

    w = len(s.get("problem", "").split())
    unten, oben = (34, 52) if (klasse or 9) <= 6 else (42, 59)
    if not unten <= w <= oben:
        f.append((tid, "einstieg", f"Einstieg hat {w} Wörter ({unten}–{oben})"))

    fr = s.get("frage", "")
    if fr and not fr.rstrip().endswith("?"):
        f.append((tid, "frage", "Forscherfrage endet nicht auf „?“"))
    if len(fr) > 85:
        f.append((tid, "frage", f"Forscherfrage ist {len(fr)} Zeichen lang (max. 85)"))

    au = s.get("auftrag", "")
    if au and not au.startswith(OP_AUFTRAG):
        f.append((tid, "auftrag", f"Auftrag beginnt mit „{au.split()[0] if au else ''}“, "
                                  f"erwartet {'/'.join(OP_AUFTRAG)}"))

    ag = s.get("aufgabe", {})
    agf = ag.get("frage", "") if isinstance(ag, dict) else ""
    if agf and not agf.startswith(OP_AUFGABE):
        erstes = agf.split()[0].rstrip(",.")
        art = "person" if erstes[:1].isupper() and erstes.isalpha() else "aufgabe"
        f.append((tid, art, f"Aufgabe beginnt mit „{erstes}“ statt mit einem Operator "
                            f"(Erkläre, Berechne, Begründe, Beurteile, Vergleiche, Bestimme …)"))

    fo = s.get("forschen", [])
    if not 2 <= len(fo) <= 3:
        f.append((tid, "forschen", f"{len(fo)} Forschritte (2–3)"))
    for schritt in fo:
        if re.search(r"\bklick", schritt, re.I):
            f.append((tid, "klicke", "„klicke“ in einem Forschritt"))

    if not 3 <= len(s.get("tabRows", [])) <= 4:
        f.append((tid, "tabelle", f"{len(s.get('tabRows', []))} Tabellenzeilen (3–4)"))
    # DREI Vermutungen seit dem Einstiegsumbau (12.09.2026). Die Regel stand bis
    # zum 13.09. noch auf zwei und meldete danach JEDE Seite aller 19 Baende -
    # ein Pruefer, der immer rot meldet, wird nicht mehr gelesen. Derselbe
    # Nachzug war in pruefe_profil.py der Foerderreihe noetig; dieser hier war
    # uebersehen worden.
    if len(s.get("predict", [])) != 3:
        f.append((tid, "predict", f"{len(s.get('predict', []))} Vermutungen (3)"))
    if len(set(s.get("predict", []))) != len(s.get("predict", [])):
        f.append((tid, "predict", "zwei Vermutungen sind wortgleich"))
    if len(s.get("merksatz", [])) != 2:
        f.append((tid, "merksatz", f"{len(s.get('merksatz', []))} Merksätze (2)"))
    # Zeichen, die die Heftschrift nicht hat, drucken als leeres Kaestchen.
    # Sie kommen aus den Knopfaufschriften der Simulationen ("🪞 Spiegel").
    # Pfeile bleiben erlaubt - die stehen so in den gedruckten Heften.
    fehlend = _OHNE_GLYPHE.findall(str(s))
    if fehlend:
        f.append((tid, "glyphe", f"{len(fehlend)} Zeichen ohne Glyphe in der Heftschrift: "
                                 f"{' '.join(sorted(set(fehlend))[:6])}"))

    for m in s.get("merksatz", []):
        # Nicht "genau ein Wort": die abgenommenen Hefte setzen dort auch Formeln
        # ("U · I", "s / t") und feste Fuegungen ("in Reihe"). Die Luecke muss nur
        # KURZ bleiben, damit sie auf die Schreiblinie passt.
        lo = m.get("loesung", "")
        if len(lo.split()) > 3 or len(lo) > 22:
            f.append((tid, "merksatz", f"Lösung „{lo}“ ist zu lang für die Lücke "
                                       f"({len(lo.split())} Wörter, {len(lo)} Zeichen; max. 3 / 22)"))
    return f


def pruefe_verteilung(seiten, kapitel_von):
    """Die richtige Vermutung darf nicht immer an derselben Stelle stehen."""
    f, nach = [], {}
    for s in seiten:
        nach.setdefault(kapitel_von.get(s["id"], "?"), []).append(s.get("predictOk"))
    for kap, oks in nach.items():
        if len(oks) < 4:
            continue
        anteil = max(oks.count(0), oks.count(1)) / len(oks)
        if anteil > 0.70:
            stelle = 0 if oks.count(0) > oks.count(1) else 1
            f.append((kap, "streuung",
                      f"richtige Vermutung steht in {round(anteil*100)} % der Fälle "
                      f"an Stelle {stelle+1} ({len(oks)} Seiten) – bitte umsortieren"))
    return f
