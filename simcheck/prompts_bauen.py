# -*- coding: utf-8 -*-
"""Setzt bilder/PROMPTS.md aus den Bloecken der einzelnen Buendel zusammen.

    python3 simcheck/prompts_bauen.py <heftkuerzel> <block.md> [<block.md> ...]

Prueft danach mit demselben Parser, den bildauftraege.py benutzt, ob wirklich
jeder Auftrag gefunden wird - ein Block mit falscher Ueberschrift oder fehlendem
Codeblock faellt sonst erst beim Satz auf.
"""
import importlib.util, json, os, re, sys

WURZEL = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def lade(pfad, name):
    spec = importlib.util.spec_from_file_location(name, pfad)
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def kopf(plan, anzahl):
    kl = plan.KLASSE
    sf = getattr(plan, "SCHULFORM", "Realschule NRW")
    ablage = (f"FELO-Bilder Gesamtschule {kl}" if "Gesamtschule" in sf
              else f"Arbeitsheft-Bilder {kl} Klasse")
    return f"""# Einstiegsbilder · FELO Physik {kl} · {sf}

{anzahl} Bilder, eines je Forscherseite. Ablage in diesem Ordner (auf dem Schreibtisch
als `{ablage}` verlinkt). Dateiname = **Kennung, Leerzeichen,
Titel der Heftseite**, dann `.png` – genau so, wie er über jedem Auftrag steht.
Querformat 5:3, mindestens 1200 × 720 Punkte.

Sobald eine Datei im Ordner liegt, verschwindet ihr Auftrag von selbst aus dem
Auftrags-PDF (`python3 bildauftraege.py`).

## Die eine Regel

**Das Bild zeigt das Problem, nie die Lösung.** Ein Kind soll die Situation erkennen und
sich fragen, woran es liegt. Was der Versuch erst herausfinden soll, darf nicht schon im
Bild stehen: keine Strahlengänge, keine Pfeile, keine Beschriftung, keine erklärenden
Nebenbildchen.

## Vier Fehler, die bei Klasse 7 acht Bilder gekostet haben

1. **Bildstreifen statt einer Szene** – sobald der Auftrag eine Veränderung beschreibt.
2. **Rundes Nebenbild**, das genau die Antwort zeigt.
3. **Gezeichneter Strahlengang** mit Pfeilspitzen und gestricheltem Lot.
4. **Stilbruch**: fotorealistisch oder flacher Comic statt gemalter Illustration.

Verbote im Prompt haben dagegen nicht geholfen – gelöst wird es über die **Komposition**:
Nahaufnahme, oder das entscheidende Objekt an den rechten Bildrand.

Passt ein erzeugtes Bild nicht, hilft oft ein Ausschnitt statt eines neuen Laufs:
`bilder/_schnitt.json` erlaubt einen Beschnitt je Datei.

## Der Rahmen

{plan.RAHMEN}

---
"""


def main():
    kuerzel = sys.argv[1]
    # "gts7" oder "arbeitsheft8" - beides annehmen
    ordner = os.path.join(WURZEL, kuerzel if kuerzel.startswith("arbeitsheft")
                          else f"arbeitsheft_{kuerzel}")
    plan = lade(os.path.join(ordner, "plan.py"), "plan_pb")

    bloecke = []
    for p in sys.argv[2:]:
        bloecke.append(open(p, encoding="utf-8").read().strip())
    text = kopf(plan, len(plan.THEMEN)) + "\n\n" + "\n\n".join(bloecke) + "\n"

    ziel = os.path.join(ordner, "bilder", "PROMPTS.md")
    os.makedirs(os.path.dirname(ziel), exist_ok=True)
    open(ziel, "w", encoding="utf-8").write(text)

    # Mit DEMSELBEN Parser gegenlesen, den bildauftraege.py benutzt.
    # Das Modul macht "import plan" - dafuer muss SEIN Ordner vorne im Pfad stehen,
    # und danach wieder heraus, damit ein zweiter Band nicht den ersten Plan erwischt.
    sys.path.insert(0, ordner)
    try:
        for tot in ("plan", "build_book", "build_final", "textschicht"):
            sys.modules.pop(tot, None)
        ba = lade(os.path.join(ordner, "bildauftraege.py"), "ba_pb")
    finally:
        sys.path.remove(ordner)
    gefunden = ba.auftraege()
    soll = [th["id"] for th in plan.THEMEN]
    fehlt = [i for i in soll if i not in gefunden]
    zuviel = [i for i in gefunden if i not in soll]

    print(f"{kuerzel}: {len(gefunden)} von {len(soll)} Aufträgen gelesen · "
          f"{round(len(text)/1024)} KB")
    if fehlt:
        print("   FEHLEN:", fehlt)
    if zuviel:
        print("   unbekannte Kennungen:", zuviel)

    # Formprobe: jeder Prompt braucht den Stilblock und darf keine Verbotsfalle enthalten
    ohne_stil = [i for i, a in gefunden.items() if "ONE single scene in ONE frame" not in a["prompt"]]
    if ohne_stil:
        print("   ohne Stilblock:", ohne_stil)
    kurz = [i for i, a in gefunden.items() if len(a["prompt"]) < 420]
    if kurz:
        print("   auffällig kurzer Prompt:", kurz)
    sys.exit(1 if (fehlt or zuviel or ohne_stil) else 0)


if __name__ == "__main__":
    main()
