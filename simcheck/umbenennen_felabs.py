# -*- coding: utf-8 -*-
"""Benennt die Reihe FELO in FeLabs um.

    python3 simcheck/umbenennen_felabs.py            # nur zaehlen und zeigen
    python3 simcheck/umbenennen_felabs.py --schreiben

Abdullah am 18.09.2026: "Ueberarbeite das gesamte Arbeitsheft und benenne die
bisherige Reihe FELO vollstaendig und einheitlich in FeLabs um." Schreibweise
GENAU `FeLabs` - grosses F, kleines e, grosses L, dann `abs` klein. Nicht
FELABS, nicht Felabs, nicht FELO.

Die Aufloesung wechselt mit:
  alt  Forschen - Eigeninitiative - Lernen - Organisieren   (vier Buchstaben)
  neu  Forschen - Entdecken - Lernen - Anwenden - Begreifen - Sichern (sechs)

WAS DIESES WERKZEUG NICHT ANFASST
- `arbeitsheft/felo_design.py` und der Modulname `felo_design`: ein interner
  Dateiname, der in 19 Skripten importiert wird. Er steht in keinem Heft und in
  keinem PDF; ihn umzubenennen waere ein zweiter, riskanter Umbau.
- Alles unter `build/` (Satzergebnisse), `.vor_*`-Sicherungen und die
  Faktendumps - die werden neu erzeugt bzw. sind Messwerte.
- Gedruckte QR-Adressen: Die zeigen auf helinla.github.io/LernStar und bleiben.
"""
import io, os, re, sys

HERE = os.path.dirname(os.path.abspath(__file__))
LS = os.path.dirname(HERE)
SCHREIBEN = "--schreiben" in sys.argv

ENDUNGEN = (".py", ".json", ".js", ".md", ".html", ".txt")
# `bilder/` enthaelt PNGs UND die Bildauftrags-Dokumente (PROMPTS.md). Die
# Dokumente gehoeren zur Reihe und werden mit umbenannt; die Bilder filtert
# schon die Endungsliste heraus.
AUS = ("/build/", "/.git/", "/node_modules/", "/qr/", "simcheck/fakten/",
       "/img/", ".vor_", ".entfernt", "umbenennen_felabs.py")

# Reihenfolge ist wichtig: die laengsten Muster zuerst.
ERSETZUNGEN = [
    # Zuerst die Programmnamen: `window.FELO_FORSCHEN` ist kein Markenname,
    # sondern eine Konstante. Sie wird nach Programmierkonvention gross
    # geschrieben (FELABS_...), waehrend im Heft immer "FeLabs" steht.
    ("FELO_FORSCHERMODUS", "FELABS_FORSCHERMODUS"),
    ("FELO_FORSCHEN", "FELABS_FORSCHEN"),
    ("Forschen · Eigeninitiative · Lernen · Organisieren",
     "Forschen · Entdecken · Lernen · Anwenden · Begreifen · Sichern"),
    ("Forsche – Eigeninitiative – Lernen – Organisieren",
     "Forschen – Entdecken – Lernen – Anwenden – Begreifen – Sichern"),
    ("FELO PHYSIK", "FeLabs PHYSIK"),
    ("FELO Physik", "FeLabs Physik"),
    ("FELO_Physik", "FeLabs_Physik"),
    ("FELO_Foerder", "FeLabs_Foerder"),
    ("FELO-Hefte", "FeLabs-Hefte"),
    ("FELO-Heft", "FeLabs-Heft"),
    ("FELO-Konzept", "FeLabs-Lernkonzept"),
    ("FELO-Lernweg", "FeLabs-Lernweg"),
    ("FELO-Methode", "FeLabs-Methode"),
    ("FELO-Reihe", "FeLabs-Reihe"),
    ("FELO-Marke", "FeLabs-Marke"),
    ("FELO-Text", "FeLabs-Text"),
    ("FELO-Gestaltungssystem", "FeLabs-Gestaltungssystem"),
    ("FELO", "FeLabs"),
]


def dateien():
    for wurzel, ordner, namen in os.walk(LS):
        ordner[:] = [o for o in ordner if not any(a.strip("/") == o for a in AUS)]
        for n in namen:
            p = os.path.join(wurzel, n)
            if not n.endswith(ENDUNGEN):
                continue
            rel = p[len(LS) + 1:]
            if any(a in "/" + rel for a in AUS):
                continue
            yield p, rel


def main():
    gesamt, dateizahl, offen = 0, 0, []
    for p, rel in sorted(dateien()):
        try:
            s = io.open(p, encoding="utf-8").read()
        except (UnicodeDecodeError, IsADirectoryError):
            continue
        if "FELO" not in s and "Eigeninitiative" not in s:
            continue
        neu = s
        n = 0
        for alt, ers in ERSETZUNGEN:
            n += neu.count(alt)
            neu = neu.replace(alt, ers)
        # Was bleibt uebrig? Kleinschreibungen und Sonderfaelle sichtbar machen.
        rest = re.findall(r"[A-Za-z_]*[Ff][Ee][Ll][Oo][A-Za-z_]*", neu)
        rest = [r for r in rest if "felo_design" not in r]
        if rest:
            offen.append((rel, sorted(set(rest))))
        gesamt += n
        dateizahl += 1
        print("%5d  %s" % (n, rel))
        if SCHREIBEN and neu != s:
            io.open(p, "w", encoding="utf-8").write(neu)
    print("\n%d Ersetzungen in %d Dateien%s" % (gesamt, dateizahl, " (geschrieben)" if SCHREIBEN else ""))
    if offen:
        print("\nNoch offen - von Hand ansehen:")
        for rel, r in offen:
            print("   %-52s %s" % (rel, " ".join(r)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
