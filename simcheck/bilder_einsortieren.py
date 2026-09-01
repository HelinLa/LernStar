# -*- coding: utf-8 -*-
"""Benennt heruntergeladene Bilder in die Dateinamen des Hefts um.

    python3 simcheck/bilder_einsortieren.py <heft> <quellordner> [--los]

Ohne `--los` wird nur gezeigt, was passieren wuerde. Nichts wird ueberschrieben.

Die Bilder werden nach ihrer AENDERUNGSZEIT sortiert und in der Reihenfolge des
Hefts den noch offenen Themen zugeordnet - wer die Prompts aus PROMPTS.txt von
oben nach unten abarbeitet, bekommt so ohne Nachdenken die richtigen Namen.

Passt die Reihenfolge einmal nicht, hilft `--ab <kennung>`: dann beginnt die
Zuordnung bei diesem Thema.
"""
import importlib.util, os, shutil, sys

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENDUNGEN = (".png", ".jpg", ".jpeg", ".webp")


def lade(pfad, name):
    spec = importlib.util.spec_from_file_location(name, pfad)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


def main():
    k, quelle = sys.argv[1], os.path.expanduser(sys.argv[2])
    los = "--los" in sys.argv
    ab = None
    if "--ab" in sys.argv:
        ab = sys.argv[sys.argv.index("--ab") + 1]

    # Sowohl "gts7" als auch "arbeitsheft8" annehmen - die Realschulhefte heissen
    # arbeitsheft, arbeitsheft7 ... , die Gesamtschulhefte arbeitsheft_gts7 ...
    ordner = os.path.join(WURZEL, k if k.startswith("arbeitsheft") else f"arbeitsheft_{k}")
    plan = lade(os.path.join(ordner, "plan.py"), "plan_ez")
    sys.path.insert(0, ordner)
    for tot in ("plan", "build_book", "build_final", "textschicht"):
        sys.modules.pop(tot, None)
    ba = lade(os.path.join(ordner, "bildauftraege.py"), "ba_ez")
    sys.path.remove(ordner)

    auftraege = ba.auftraege()
    offen = ba.offen()                      # nur Themen ohne eigenes Bild
    if ab:
        if ab not in offen:
            sys.exit(f"„{ab}“ ist nicht offen. Offen sind: {offen}")
        offen = offen[offen.index(ab):]

    dateien = sorted(
        (os.path.join(quelle, f) for f in os.listdir(quelle)
         if f.lower().endswith(ENDUNGEN) and not f.startswith(".")),
        key=os.path.getmtime)

    ziel_ordner = os.path.join(ordner, "bilder")
    os.makedirs(ziel_ordner, exist_ok=True)

    if not dateien:
        sys.exit(f"Keine Bilder in {quelle}")
    print(f"{len(dateien)} Bilder in {quelle}")
    print(f"{len(offen)} Themen ohne Bild in FELO {plan.KLASSE} {plan.SCHULFORM}\n")

    paare = list(zip(dateien, offen))
    for q, tid in paare:
        neu = auftraege[tid]["datei"] + os.path.splitext(q)[1].lower()
        ziel = os.path.join(ziel_ordner, neu)
        marke = "  " if not os.path.exists(ziel) else "!!"
        print(f" {marke} {os.path.basename(q)[:38]:40s} → {neu}")
        if los and not os.path.exists(ziel):
            shutil.copy2(q, ziel)

    rest_d, rest_t = len(dateien) - len(paare), len(offen) - len(paare)
    if rest_d: print(f"\n{rest_d} Bilder bleiben übrig (mehr Bilder als offene Themen)")
    if rest_t: print(f"\n{rest_t} Themen bleiben ohne Bild")
    print("\n" + ("kopiert." if los else "Nur Vorschau. Mit --los wirklich kopieren."))
    print("Danach im Heftordner:  python3 build_book.py")


if __name__ == "__main__":
    main()
