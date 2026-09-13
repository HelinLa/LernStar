# -*- coding: utf-8 -*-
"""Nimmt das Ergebnis des Schreib-Workflows entgegen und legt content/forscherseiten.json an.

    python3 uebernehmen.py <ergebnis.json>

Erwartet {"seiten":[...]} oder eine blanke Liste. Ergaenzt die Felder, die nicht aus dem
Text kommen (name, theme), setzt die Reihenfolge nach plan.py und prueft die Formatregeln,
bevor etwas geschrieben wird.
"""
import json, os, re, sys
import importlib.util as _ilu
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import plan

HERE = os.path.dirname(os.path.abspath(__file__))
ZIEL = os.path.join(HERE, "content", "forscherseiten.json")

# Die Formregeln liegen gemeinsam in arbeitsheft/ und werden ueber den Pfad
# geladen, nicht ueber sys.path (CLAUDE.md, Falle 3). Sie sind gegen die vier
# abgenommenen Realschulhefte geeicht: 162 Seiten, 0 Fehlalarme.
_fspec = _ilu.spec_from_file_location("formregeln", os.path.join(
    os.path.dirname(HERE), "arbeitsheft", "formregeln.py"))
formregeln = _ilu.module_from_spec(_fspec); _fspec.loader.exec_module(formregeln)

# Fuer die Gesamtschulhefte ist nichts umzubenennen: ihre Kennungen (oi ew st be
# kf el ev rk) sind gegen alle 195 vergebenen geprueft und kollisionsfrei.
UMBENANNT = {}

# Zeichen, die die Heftschrift NICHT hat. Sie stammen aus den Knopfaufschriften der
# Simulationen ("🪞 Spiegel") und drucken als leere Kaestchen - gesehen auf Seite 5
# von FELO 7 Gesamtschule: "Waehle nacheinander die vier Oberflaechen ▯ Spiegel, ▯
# Fensterglas ...". Pfeile (→ ↓ ↑ ←) bleiben: die stehen in den gedruckten
# Realschulheften und werden dort sauber gesetzt.
_OHNE_GLYPHE = re.compile(
    "[\U0001F000-\U0001FAFF"      # Emoji und Piktogramme
    "\u2B00-\u2BFF"               # geometrische Formen (⬛ ⬜)
    "\u25A0-\u25FF"               # Blockelemente
    "\u2600-\u27BF"               # Symbole und Dingbats
    "\uFE0F\u200D]")              # Variationswaehler, Zero-Width-Joiner


def _aufraeumen(t):
    """Leerzeichen glaetten, die nach dem Entfernen eines Zeichens stehen bleiben.
    Ohne das steht im Heft: Druecke „ langsamer" - mit Luecke hinter dem
    Anfuehrungszeichen, weil dort ein Symbol entfernt wurde."""
    t = re.sub(r"\s{2,}", " ", t)
    t = re.sub(r"([„«(\[])\s+", r"\1", t)          # kein Leerzeichen NACH dem Oeffnen
    t = re.sub(r"\s+([»)\]])", r"\1", t)           # keines VOR dem Schliessen
    t = re.sub(r'\s+([“"])', r"\1", t)              # keines vor dem schliessenden Zitat
    t = re.sub(r"\s+([,.;:!?])", r"\1", t)          # keines vor Satzzeichen
    return t.strip()


def entschmuecken(o):
    """Entfernt Zeichen, die im Heft nicht darstellbar sind - rekursiv."""
    if isinstance(o, str):
        return _aufraeumen(_OHNE_GLYPHE.sub("", o))
    if isinstance(o, list):
        return [entschmuecken(x) for x in o]
    if isinstance(o, dict):
        return {k: entschmuecken(v) for k, v in o.items()}
    return o


def pruefen(seiten):
    """Liefert eine Liste von Beanstandungen, ohne etwas zu aendern."""
    fehler = []
    for s in seiten:
        # klasse=11: Die Oberstufe hat seit dem 13.09.2026 eine eigene Spanne
        # fuer den Einstieg (26-45 statt 42-59). Ohne das Argument faellt der
        # Pruefer auf die Sek-I-Spanne zurueck und meldet 27 von 28 Seiten.
        for tid, art, txt in formregeln.pruefe_seite(s, klasse=11):
            fehler.append(f"{tid}: [{art}] {txt}")
    for kap, art, txt in formregeln.pruefe_verteilung(seiten, plan.KAPITEL_VON):
        fehler.append(f"{kap}: [{art}] {txt}")
    return fehler


def main(quelle):
    roh = json.load(open(quelle, encoding="utf-8"))
    if isinstance(roh, dict):
        roh = roh.get("seiten") or roh.get("result", {}).get("seiten") or []
    seiten = {}
    for s in roh:
        s = entschmuecken(dict(s))
        s["id"] = UMBENANNT.get(s["id"], s["id"])
        seiten[s["id"]] = s

    fehlend = [th["id"] for th in plan.THEMEN if th["id"] not in seiten]
    if fehlend:
        sys.exit(f"Es fehlen Seiten: {fehlend}")

    # Reihenfolge und Zusatzfelder aus dem Bauplan, nicht aus dem Text
    geordnet = []
    for th in plan.THEMEN:
        s = seiten[th["id"]]
        s["name"] = th["name"]                        # Lehrplanthema, steht klein auf der Trennseite
        s["theme"] = plan.KAPITEL_VON[th["id"]]
        # G/E-Differenzierung: Ab Jahrgang 9 wird in Physik nach Fachleistung
        # unterrichtet. Themen, die nur der E-Kurs bearbeitet, tragen im Bauplan
        # kurs="E" und bekommen im Heft ein Abzeichen in der Kopfzeile.
        if th.get("kurs"):
            s["kurs"] = th["kurs"]
        s.setdefault("sicherheit", None)
        if not s.get("sicherheit"):
            s.pop("sicherheit", None)
        geordnet.append(s)

    fehler = pruefen(geordnet)
    print(f"{len(geordnet)} Seiten · {len(fehler)} Beanstandungen")
    for f in fehler:
        print("   ", f)

    os.makedirs(os.path.dirname(ZIEL), exist_ok=True)
    json.dump(geordnet, open(ZIEL, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("geschrieben:", os.path.relpath(ZIEL, HERE))
    # Geschrieben wird immer - man will das Ergebnis ansehen koennen -, aber der
    # Rueckgabewert meldet die Beanstandungen, damit ein Bauskript sie nicht uebergeht.
    if fehler:
        sys.exit(1)


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    main(sys.argv[1])
