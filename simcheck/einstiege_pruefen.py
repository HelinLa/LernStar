# -*- coding: utf-8 -*-
"""Torwaechter fuer neu geschriebene EINSTIEGE.

Abdullah, 16.09.2026: *"die einstiegsprobleme also die Texte passen immer noch
nicht mit den Simulationen zusammen, die muessen zusammen passen, sonst koennen
wir die schlecht verkaufen."*

`einstieg_motiv.py` sortiert BESTEHENDE Seiten in drei Eimer - es sagt, WO es
klemmt. Dieses Werkzeug steht an der anderen Stelle: Kein neu geschriebener
Einstieg kommt ins Heft, ohne sechs Riegel zu passieren. Der Unterschied ist
wichtig, weil die neuen Texte von Agenten stammen und ein Agent sich
verschreibt, ohne es zu merken - er erfindet eine Zahl, die am Bildschirm nicht
steht, oder tauscht die Figuren aus.

DIE SECHS RIEGEL

  1. Wortzahl in der Spanne der STUFE. 34-52 fuer Klasse 5/6, 42-59 fuer 7-10,
     26-45 fuer die Oberstufe - dieselben Zahlen wie `formregeln.pruefe_seite`,
     und aus demselben Grund (dort steht die Herleitung).
  2. Satzzahl. Sek I drei bis fuenf, Oberstufe GENAU drei: Alltagsszene,
     Streit, fertig.
  3. Die Figuren bleiben. Gehalten wird, wer im ALTEN Einstieg dieser Einheit
     steht UND zum Figurenkanon des Bandes gehoert. Der Kanon wird GEMESSEN
     (`kanon_bestimmen`, vier Filter, dort steht die Herleitung), nicht
     eingetragen: eine Namensliste je Band haette in vier von vierzehn
     Baenden falsch gemeldet - `arbeitsheft` fuehrt Emma UND Mia, `gts9`
     dazu Herrn Kessler.
  4. Der Einstieg endet nicht mit einer Frage. Die Forscherfrage steht
     unmittelbar darunter; ein Fragezeichen am Ende des Einstiegs stellt sie
     zweimal.
  5. Jede Zahl steht am Bildschirm. Ein Einstieg, der "nach 12 Sekunden" sagt,
     verspricht eine Anzeige, die es geben muss.
  6. Der Gegenstand kommt am Bildschirm vor - gemessen mit `einstieg_motiv`,
     also mit allen dort festgehaltenen Fehlerquellen ("renn" in "verbrennt",
     "rad" in "radioaktiv"). Nennt der Bildschirm gar keinen Gegenstand, ist
     die Figur frei; dann greift der Riegel nicht.

SELBSTTEST: Ohne bestandene Proben urteilt das Werkzeug nicht. Zu jeder guten
Probe gehoert eine, die durchfallen MUSS - sonst faengt ein Riegel, der gar
nicht mehr greift, stillschweigend nichts mehr ([[pruefer-der-schweigt]]).
"""
import importlib.util as ilu
import json
import os
import re
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
WURZEL = os.path.dirname(HIER)


def _modul(name, pfad):
    sp = ilu.spec_from_file_location(name, os.path.join(WURZEL, pfad))
    m = ilu.module_from_spec(sp)
    sp.loader.exec_module(m)
    return m


em = _modul("einstieg_motiv", "simcheck/einstieg_motiv.py")

ZAHL = re.compile(r"\d+(?:[.,]\d+)?")
GROSS = re.compile(r"\b(?:[A-ZÄÖÜ][a-zäöüß]{2,11})\b")
SATZENDE = (".", "!", "?", "…", ":", '"', "„", "“", "–", "—")
# Ein Name steht in mindestens jedem siebten Einstieg des Bandes. Gemessen
# ueber alle 14 Baende: die schwaechste echte Figur ist Mia in `arbeitsheft`
# mit 0,22, die staerkste Nour in `gts7` mit 0,97.
KANON_ANTEIL = 0.15
# Artikel und Artikelverschmelzungen. NICHT die nackten Praepositionen: "mit
# Mia", "bei Nour", "fuer Mira" sind voellig normal - mit ihnen in der Liste
# fielen Ben (8 %), Jannis (3 %), Lina (3 %) und Mira (3 %) durch.
ARTIKEL = set("""der die das den dem des ein eine einen einem einer eines im am
zum zur vom beim ins aufs dieser diese dieses diesem diesen jeder jede jedes
jeden sein seine seinen seinem ihr ihre ihren ihrem mein meine meinen unser
unsere kein keine keinen keinem manche viele alle beide""".split())
# Ein Name steht hoechstens ausnahmsweise hinter einem Artikel - und wenn,
# dann in einem Relativsatz ("die Kiste, die Ben schiebt"). Gemessen liegen
# die Figuren bei 0 bis 8 %, die Nomen bei 40 bis 100 %; dazwischen ist
# nichts.
ARTIKELQUOTE = 0.20


def _spanne(klasse):
    k = int(klasse) if str(klasse).isdigit() else 9
    return (34, 52) if k <= 6 else (26, 45) if k >= 11 else (42, 59)


def kanon_bestimmen(einstiege):
    """Der Figurenkanon eines Bandes, GEMESSEN aus seinen Einstiegen.

    `einstiege` ist die Liste ALLER Einstiegstexte des Bandes. VIER Filter,
    keiner davon eine Namensliste - jeder fuer eine Wortart, die sonst
    durchrutscht:

      1. Das Wort kommt im ganzen Band NIE klein vor. Das trennt die
         Funktionswoerter ab, und zwar besser als die Frage nach dem
         Satzanfang: "Ben und Mia ..." faengt den Satz an, ein Filter auf
         Satzanfaenge haette also ausgerechnet die Hauptfigur verworfen.
         "der", "dann", "sie", "beide" stehen dagegen staendig klein
         mitten im Satz.
      2. Das Wort steht in mindestens jedem siebten Einstieg. Das nimmt die
         Nomen aus, die nur in einer Einheit vorkommen.
      3. Hinter einem ARTIKEL steht es so gut wie nie. Das ist der Filter
         gegen die Nomen, die ein ganzes Kapitel tragen: "die Buehne" (80 %),
         "der Bildschirm" (100 %), "die Werkbank" (100 %) - waehrend die
         Figuren zwischen 0 und 8 % liegen.
      4. Irgendwo im Band steht es auch MITTEN im Satz. Das nimmt die
         Satzanfangswoerter aus, die Filter 1 ueberlebt haben, weil sie in
         diesem Band zufaellig nie klein vorkamen ("Dann", "Ganz").

    GEMESSEN ueber alle 14 Baende liefert das genau die Besetzung, die in den
    Einstiegen steht - und zwar auch dort, wo sie anders ist als erwartet:
    `arbeitsheft` hat Emma UND Mia, `gts9` dazu Herrn Kessler. Ein
    eingetragener Zweiername je Band haette in vier Baenden falsch gemeldet.
    Uebrig bleiben drei Nomen in zwei Baenden (Kiste, Kabel, Vater); sie
    kosten hoechstens einen Befund zum Nachsehen, nie eine verlorene Figur.
    """
    n = len(einstiege) or 1
    klein, mitten, zaehler, seiten, artikel = set(), set(), {}, {}, {}
    for t in einstiege:
        klein |= {w.lower() for w in re.findall(r"\b[a-zäöüß]{3,12}\b", t)}
    for t in einstiege:
        for m in GROSS.finditer(t):
            w = m.group(0)
            zaehler[w] = zaehler.get(w, 0) + 1
            links = re.findall(r"[A-Za-zÄÖÜäöüß]+", t[:m.start()])
            if links and links[-1].lower() in ARTIKEL:
                artikel[w] = artikel.get(w, 0) + 1
            davor = t[:m.start()].rstrip()
            if davor and not davor.endswith(SATZENDE):
                mitten.add(w)
        for w in set(GROSS.findall(t)):
            seiten[w] = seiten.get(w, 0) + 1
    return {w for w in zaehler
            if w.lower() not in klein
            and seiten[w] / n >= KANON_ANTEIL
            and artikel.get(w, 0) / zaehler[w] <= ARTIKELQUOTE
            and w in mitten}


def figuren(text, kanon):
    """Die Figuren, die in diesem Text vorkommen."""
    return {n for n in GROSS.findall(text) if n in kanon}


def _zahlen(text):
    """Zahlen normiert - 4.0, 4,0 und 4 sind dieselbe Zahl."""
    raus = set()
    for z in ZAHL.findall(text):
        z = z.replace(".", ",")
        if "," in z:
            z = z.rstrip("0").rstrip(",")
        raus.add(z or "0")
    return raus


def pruefe(neu, alt, schirmtext, klasse, kanon):
    """Gibt die Liste der Befunde zurueck - leer heisst: darf ins Heft."""
    f = []

    w = len(neu.split())
    unten, oben = _spanne(klasse)
    if not unten <= w <= oben:
        f.append("%d Wörter (%d–%d)" % (w, unten, oben))

    saetze = [s for s in re.split(r"(?<=[.!?…])\s+", neu) if s.strip()]
    k = int(klasse) if str(klasse).isdigit() else 9
    if k >= 11:
        if len(saetze) != 3:
            f.append("%d Sätze (Oberstufe: genau 3)" % len(saetze))
    elif not 3 <= len(saetze) <= 5:
        f.append("%d Sätze (3–5)" % len(saetze))

    fehlt = figuren(alt, kanon) - figuren(neu, kanon)
    if fehlt:
        f.append("Figur fehlt: " + ", ".join(sorted(fehlt)))

    if neu.rstrip().endswith("?"):
        f.append("endet mit einer Frage")

    fremd = sorted(_zahlen(neu) - _zahlen(schirmtext))
    if fremd:
        f.append("Zahlen nicht am Schirm: " + ", ".join(fremd))

    me, ms = em.gruppen(neu), em.gruppen(schirmtext)
    if me and ms and not (me & ms):
        f.append("Gegenstand %s, Schirm zeigt %s"
                 % ("/".join(sorted(me)), "/".join(sorted(ms))))
    return f


# ── Selbsttest ─────────────────────────────────────────────────────────────
def selbsttest():
    """Jede Probe mit ihrer Gegenprobe. Faellt eine durch, urteilt das
    Werkzeug nicht."""
    ALT = ("Ben und Mia stehen an der Rampe. Ben sagt, der volle Wagen "
           "rollt schneller hinunter als der leere. Mia widerspricht ihm.")
    SCHIRM = ("Wagen auf der Rampe · Strecke 20 m · Stoppuhr · "
              "Wagen unten nach 1,4 s · Ziel nach 4,0 s")
    GUT = ("Ben und Mia lassen auf der langen Rampe zwei gleich große Wagen "
           "gleichzeitig los, einen schwer beladenen und einen ganz leeren. "
           "Der beladene Wagen ist unten zuerst, sagt Ben, weil er viel mehr "
           "Schwung mitbringt. Mia hat vorhin genau hingeschaut und sieht die "
           "Sache völlig anders. Die beiden streiten weiter und werden sich "
           "nicht einig.")
    # Der Kanon wird gemessen wie im Ernstfall. Das Probeband enthaelt
    # absichtlich die drei Wortarten, an denen die ersten Anlaeufe
    # gescheitert sind: ein Nomen, das die halbe Reihe traegt ("Rampe",
    # immer mit Artikel), ein Satzanfangswort, das nie klein vorkommt
    # ("Dann"), und die Figuren selbst. Acht Texte, weil ein Band nie
    # kleiner ist (gemessen: 18 bis 39 Einheiten).
    BAND = [ALT,
            "Am Morgen schiebt Ben die Kiste an. Mia zählt mit.",
            "Mia hält die Uhr an der Rampe. Ben lässt los. Dann schauen "
            "beide genau hin.",
            "Ben und Mia sitzen im Bus. Der Ruck wirft Mia nach vorn.",
            "An der Rampe wartet Ben. Dann gibt Mia das Zeichen.",
            "Mia zieht den Magneten weg. Ben hält die Klammer fest.",
            "Ben dreht am Regler. Dann liest Mia die Anzeige laut vor.",
            "Auf dem Hof fällt Mia der Schlüssel herunter. Ben lacht."]
    kanon = kanon_bestimmen(BAND)
    if kanon != {"Ben", "Mia"}:
        raise SystemExit("SELBSTTEST GEFALLEN: Kanon ist %s, erwartet "
                         "{Ben, Mia}" % sorted(kanon))
    proben = [
        ("gut", GUT, ALT, SCHIRM, 9, True),
        ("zu kurz", "Ben und Mia streiten über die Rampe. Ben sagt so, Mia "
                    "so. Keiner gibt nach.", ALT, SCHIRM, 9, False),
        # Derselbe gute Text ist fuer Klasse 5/6 zu lang (55 > 52). Ohne die
        # Staffelung nach Stufe meldete der Pruefer 18 der 33 Seiten von
        # Klasse 5/6 faelschlich - siehe formregeln.pruefe_seite.
        ("zu lang für Klasse 5", GUT, ALT, SCHIRM, 5, False),
        ("zwei Sätze", "Ben und Mia lassen auf der langen Rampe zwei gleich "
                       "große Wagen gleichzeitig los und schauen ganz genau "
                       "hin, was dabei geschieht. Der volle Wagen ist unten "
                       "zuerst, sagt Ben, doch Mia hat vorhin hingeschaut "
                       "und sieht die Sache völlig anders als er.",
         ALT, SCHIRM, 9, False),
        ("Figur getauscht", GUT.replace("Mia", "Lea"), ALT, SCHIRM, 9, False),
        ("endet mit Frage",
         GUT.replace("Die beiden streiten weiter und werden sich nicht "
                     "einig.", "Wer von beiden hat nun recht?"),
         ALT, SCHIRM, 9, False),
        ("erfundene Zahl",
         GUT.replace("unten zuerst", "nach 9 Sekunden unten"),
         ALT, SCHIRM, 9, False),
        ("Zahl steht am Schirm",
         GUT.replace("unten zuerst", "nach 1,4 s unten"),
         ALT, SCHIRM, 9, True),
        # Einstieg zeigt einen Menschen, der Bildschirm einen Wagen - genau
        # der Fall ki1, den eine Klasse beim Test gemeldet hat.
        ("Gegenstand nicht am Schirm",
         "Ben und Mia stehen morgens am Sportplatz und schauen einer "
         "Läuferin zu, die ihre Runden dreht. Ben sagt, sie wird auf der "
         "Geraden immer schneller und holt dort alles heraus. Mia hat die "
         "Uhr dabei und sieht das völlig anders. Die beiden werden sich "
         "nicht einig.", ALT, SCHIRM, 9, False),
        # Nennt der Bildschirm gar keinen Gegenstand, ist die Figur frei -
        # gemessen arbeiten 95 von 169 Seiten so, und das ist die gute
        # Loesung, nicht die faule.
        ("Schirm nennt keinen Gegenstand → Figur frei",
         "Ben und Mia stehen morgens am Sportplatz und schauen einer "
         "Läuferin zu, die ihre Runden dreht. Ben sagt, sie wird auf der "
         "Geraden immer schneller und holt dort alles heraus. Mia hat die "
         "Uhr dabei und sieht das völlig anders. Die beiden werden sich "
         "nicht einig.",
         ALT, "Messwerte · Start · Zurücksetzen · Strecke", 9, True),
    ]
    schlecht = []
    for name, neu, alt, schirm, kl, soll_bestehen in proben:
        f = pruefe(neu, alt, schirm, kl, kanon)
        if bool(f) == soll_bestehen:  # bestanden heisst: keine Befunde
            schlecht.append("%s: %s" % (name, "; ".join(f) or "keine Befunde"))
    if schlecht:
        raise SystemExit("SELBSTTEST GEFALLEN (%d von %d):\n  %s"
                         % (len(schlecht), len(proben), "\n  ".join(schlecht)))
    return len(proben)


def main():
    n = selbsttest()
    if "--selbsttest" in sys.argv:
        print("Selbsttest bestanden (%d Proben)" % n)
        return 0

    # Erwartet: eine Datei mit [{"id","neu"}] und die Banddatei aus
    # fakten_ziehen (id -> alter Einstieg + Bildschirmtext).
    neu = json.load(open(sys.argv[1], encoding="utf-8"))
    daten = json.load(open(sys.argv[2], encoding="utf-8"))
    band = sys.argv[3]
    b = daten[band]
    alt = {x["id"]: x for x in b["einheiten"]}
    kanon = kanon_bestimmen([x["einstieg"] for x in b["einheiten"]])

    gut, schlecht = [], []
    for e in neu:
        if e.get("passt_schon"):
            continue
        a = alt[e["id"]]
        schirm = " ".join([a["sim_ueberschrift"], a["sim_status"]]
                          + a["sim_knoepfe"] + a["sim_regler"] + a["sim_bildtexte"])
        f = pruefe(e["neu"], a["einstieg"], schirm, b["klasse"], kanon)
        (gut if not f else schlecht).append((e["id"], e["neu"], f))

    print("%s: %d neu · %d bestehen · %d mit Befund"
          % (band, len(gut) + len(schlecht), len(gut), len(schlecht)))
    for tid, _n, f in schlecht:
        print("  %-6s %s" % (tid, "; ".join(f)))
    if len(sys.argv) > 4:
        json.dump([{"id": t, "neu": n} for t, n, _f in gut],
                  open(sys.argv[4], "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
    return 0


if __name__ == "__main__":
    sys.exit(main())
