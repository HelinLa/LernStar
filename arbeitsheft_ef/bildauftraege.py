# -*- coding: utf-8 -*-
"""Bildauftraege als PDF: eine Seite je fehlendem Einstiegsbild.

Klasse und Schulform kommen aus plan.py - dieselbe Datei fuer alle vier Baende.

Alle Angaben kommen aus bilder/PROMPTS.md, damit es nur EINE Quelle gibt. Welche
Auftraege aufs Blatt kommen, ergibt sich aus dem Bildordner: Sobald eine Datei da
ist, verschwindet ihr Auftrag von selbst.

Die Seiten sind wie im Heft gesetzte Bilder. Damit sich der englische Prompt
trotzdem herauskopieren laesst, liegt dieselbe unsichtbare Textebene darueber,
die auch das E-Book durchsuchbar macht.

    python3 bildauftraege.py
"""
import os, re, sys

_HIER = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.join(os.path.dirname(_HIER), "arbeitsheft"))
from build_final import *
from textschicht import anhaengen
import plan

# Klasse und Schulform aus plan.py - eine Datei fuer alle vier Baende
_KL = str(plan.KLASSE).replace('/', '-')
_ORDNER = f"FeLabs-Bilder Gymnasium {_KL}"
HERE = _HIER          # nach dem Stern-Import, sonst gewinnt das HERE von Klasse 5

ZAHLWORT = {1: "ein", 2: "zwei", 3: "drei", 4: "vier", 5: "fünf", 6: "sechs", 7: "sieben",
            8: "acht", 9: "neun", 10: "zehn", 11: "elf", 12: "zwölf"}


def seitenzahlen():
    """Kennung -> Seite im gedruckten Heft.

    Die GEMESSENEN Zahlen aus build/seiten.json haben Vorrang; der Zaehler
    darunter ist nur der Notnagel, wenn noch nicht gesetzt wurde. Nachgerechnete
    Seitenzahlen sind in diesem Projekt schon einmal um bis zu 30 Seiten
    danebengelegen (siehe CLAUDE.md)."""
    pn, raus = 4, {}
    for k in plan.KAPITEL:
        pn += 1                                   # Trennseite
        for th in k["themen"]:
            raus[th["id"]] = pn; pn += 2          # Forscherseite + Uebungsseite
        pn += 5                                   # Wortgitter, Kreuzwort, Vorbereitung, Test
    gemessen = os.path.join(HERE, "build", "seiten.json")
    if os.path.exists(gemessen):
        import json as _json
        raus.update(_json.load(open(gemessen, encoding="utf-8")))
    return raus


def auftraege():
    """Titel, Motiv, Verbot und Prompt je Kennung aus PROMPTS.md."""
    t = open(os.path.join(HERE, "bilder", "PROMPTS.md"), encoding="utf-8").read()
    raus = {}
    muster = re.compile(r"^### `(.+?)\.png` — (\w+)$(.*?)(?=^### |^## |\Z)", re.M | re.S)
    for m in muster.finditer(t):
        block = m.group(3)
        raus[m.group(2)] = {
            "datei":  m.group(1),
            "motiv":  re.search(r"\*\*Motiv:\*\* (.*)", block).group(1).strip(),
            "verbot": re.search(r"\*\*Darf nicht zu sehen sein:\*\* (.*)", block).group(1).strip(),
            "prompt": re.search(r"```\n(.*?)\n```", block, re.S).group(1).strip(),
            "story":  re.search(r"^> (.*)$", block, re.M).group(1).strip(),
        }
    return raus


def offen():
    """Nur die Themen, fuer die noch KEIN eigenes Bild vorliegt."""
    import bilder
    da = bilder.einlesen(still=True, vom_schreibtisch=False)
    return [th["id"] for th in plan.THEMEN if th["id"] not in da]


def _kopf(h, augen, titel):
    h.tracked(ML, 84, augen, COP(13), GOLD_D, 4, center=False)
    f = DIDOT(38)
    if h.tw(titel, f) > W - 2 * ML:
        f = DIDOT(30)
    h.T(ML, 108, titel, f, INK)
    h.ln([(ML + 2, 168), (W - ML, 168)], GLINE, 1.4)


def _fuss(h, pn, gesamt):
    h.circ(ML + 8, H - 40, 13, outline=GOLD, w=2)
    h.circ(ML + 8, H - 40, 4, fill=GOLD)
    h.T(ML + 34, H - 48, f"FeLabs PHYSIK {_KL} · GESAMTSCHULE · BILDAUFTRÄGE", COP(9), GOLD_D)
    if pn:
        h.R(W - ML - 62, H - 64, W - ML, H - 22, 8, fill=GOLD_D)
        h.T(W - ML - 31, H - 42, f"{pn}/{gesamt}", AVB(13), CREAM, anchor="mm")


def deckblatt(n):
    im, d = newp(CREAM); h = hp(im, d)
    _kopf(h, "WAS ZU TUN IST", f"{ZAHLWORT.get(n, str(n)).capitalize()} Bilder für Klasse {_KL}")
    y = 208
    y = h.para(ML, y, "Das Heft ist gesetzt und steht. Was noch fehlt, sind die Einstiegsbilder: "
               "eines je Forscherseite. Bis sie da sind, steht auf den Seiten ein Platzhalter.",
               AVM(17), INK, W - 2 * ML, 30) + 28

    kasten = [
        ("Wohin", f"In den Ordner „{_ORDNER}“ auf dem Schreibtisch. "
                  "Er zeigt direkt in das Heft hinein, ich lese ihn ohne Umweg mit."),
        ("Dateiname", "Genau der Name, der auf jeder Auftragsseite unter „Dateiname“ steht, "
                      "mit .png am Ende."),
        ("Format", "Querformat 5:3, mindestens 1200 × 720 Punkte. Größer ist gut, ich schneide passend zu."),
        ("Danach", "Kurz Bescheid sagen – ich ziehe die Bilder ins Heft und baue das E-Book neu."),
    ]
    bh = 34 + len(kasten) * 76
    h.gframe(ML, y, W - ML, y + bh)
    h.tracked(ML + 26, y + 18, "SO KOMMEN DIE BILDER INS HEFT", COP(11), GOLD_D, 2, center=False)
    ry = y + 54
    for i, (was, wie) in enumerate(kasten):
        h.circ(ML + 40, ry + 14, 15, fill=GOLD)
        h.T(ML + 40, ry + 15, str(i + 1), AVB(14), CREAM, anchor="mm")
        h.T(ML + 76, ry + 4, was, AVB(16), INK)
        h.para(ML + 76, ry + 28, wie, AV(14), SUB, W - 2 * ML - 110, 22)
        ry += 76
    y += bh + 36

    h.tracked(ML, y, "DIE EINE REGEL", COP(12), GOLD_D, 2, center=False); y += 32
    y = h.para(ML, y, "Das Bild zeigt das Problem, nie die Lösung. Ein Kind soll die Situation "
               "erkennen und sich fragen, woran es liegt. Was der Versuch erst herausfinden soll, "
               "darf nicht schon im Bild stehen: keine Strahlengänge, keine Pfeile, keine "
               "Beschriftung, keine erklärenden Nebenbildchen. Und immer nur EIN Bildfeld: "
               "Sobald ein Auftrag eine Veränderung beschreibt, macht das Bildmodell gern zwei "
               "Felder nebeneinander – ein Vorher und ein Nachher. Genau das nimmt dem Kind die Frage weg.",
               AV(15.5), INK, W - 2 * ML, 26) + 32

    h.tracked(ML, y, "DER FADEN DURCH DAS GANZE HEFT", COP(12), GOLD_D, 2, center=False); y += 32
    y = h.para(ML, y, plan.RAHMEN, AV(15.5), INK, W - 2 * ML, 26) + 26
    h.para(ML, y, "Jedes Bild hängt an diesem Faden. Ben und Mia sind hier zwölf, nicht mehr acht "
           "wie im Heft für Klasse 5 – sonst bleibt der Stil derselbe, damit die beiden Hefte als "
           "Reihe erkennbar sind.", AV(15.5), SUB, W - 2 * ML, 26)
    _fuss(h, 0, n)
    return fertig(im)


def auftragsseite(tid, a, seite, nr, gesamt):
    im, d = newp(CREAM); h = hp(im, d)
    _kopf(h, f"BILDAUFTRAG {nr} VON {gesamt}", a["datei"])

    y = 192
    h.T(ML, y, "Dateiname:", AVB(14), SUB)
    dn = f"{a['datei']}.png"
    h.T(ML + 96, y, dn, AVB(14), INK)
    h.T(ML + 96 + h.tw(dn, AVB(14)) + 18, y, f"·  Seite {seite} im Heft", AV(14), SUB)
    y += 42

    h.tracked(ML, y, "SO STEHT ES AUF DER SEITE", COP(12), GOLD_D, 2, center=False); y += 32
    h.ln([(ML, y - 6), (ML, y + 4 + 30 * len(h.wrap(a["story"], AVM(16.5), W - 2 * ML - 30)))], GOLD, 2.5)
    y = h.para(ML + 22, y, a["story"], AVM(16.5), SUB, W - 2 * ML - 30, 30) + 34

    h.tracked(ML, y, "SO SOLL DAS BILD AUSSEHEN", COP(13), GOLD_D, 2, center=False); y += 34
    y = h.para(ML, y, a["motiv"], AVM(18), INK, W - 2 * ML, 31) + 30

    bh = 30 + len(h.wrap(a["verbot"], AV(16), W - 2 * ML - 78)) * 27
    h.R(ML, y, W - ML, y + bh, 10, fill=(253, 241, 224), outline=(214, 150, 60), w=1.4)
    h.circ(ML + 30, y + bh / 2, 13, fill=(214, 150, 60))
    h.T(ML + 30, y + bh / 2 + 1, "!", AVB(16), CREAM, anchor="mm")
    h.para(ML + 56, y + 15, a["verbot"], AV(16), (150, 96, 26), W - 2 * ML - 78, 27)
    y += bh + 32

    h.tracked(ML, y, "PROMPT ZUM KOPIEREN", COP(13), GOLD_D, 2, center=False)
    h.T(W - ML, y + 4, "Text lässt sich aus dem PDF markieren", AV(13), SUB, anchor="ra")
    y += 34
    zeilen = h.wrap(a["prompt"], AV(14), W - 2 * ML - 48)
    ph = 34 + len(zeilen) * 24
    h.R(ML, y, W - ML, y + ph, 10, fill=WHITE, outline=GLINE, w=1.4)
    h.para(ML + 24, y + 17, a["prompt"], AV(14), INK, W - 2 * ML - 48, 24)

    _fuss(h, nr, gesamt)
    return fertig(im)


if __name__ == "__main__":
    a = auftraege()
    reihe = [t for t in offen() if t in a]
    if not reihe:
        sys.exit("Alle Einstiegsbilder sind da - kein Auftragsblatt nötig.")
    sz = seitenzahlen()
    seiten = [deckblatt(len(reihe))]
    for i, tid in enumerate(reihe):
        seiten.append(auftragsseite(tid, a[tid], sz.get(tid, 0), i + 1, len(reihe)))

    bd = os.path.join(HERE, "build"); os.makedirs(bd, exist_ok=True)
    roh = os.path.join(bd, "Bildauftraege_roh.pdf")
    seiten[0].save(roh, "PDF", resolution=150, save_all=True, append_images=seiten[1:])

    from pypdf import PdfReader, PdfWriter
    r = PdfReader(roh); w = PdfWriter()
    for p in r.pages:
        w.add_page(p)
    w.add_outline_item("Was zu tun ist", 0)
    for k in plan.KAPITEL:
        drin = [t for t in reihe if plan.KAPITEL_VON[t] == k["id"]]
        if not drin:
            continue
        par = w.add_outline_item(k["titel"], reihe.index(drin[0]) + 1)
        for t in drin:
            w.add_outline_item(a[t]["datei"], reihe.index(t) + 1, parent=par)
    nl, nz = anhaengen(w, [SEITENTEXTE.get(id(p), []) for p in seiten])
    w.add_metadata({"/Title": f"Bildaufträge · FeLabs Physik {_KL} Gymnasium",
                    "/Author": "Abdullah Lala", "/Subject": "Fehlende Einstiegsbilder"})
    ziel = os.path.expanduser(f"~/Desktop/Bildauftraege_Gym{_KL}.pdf")
    with open(ziel, "wb") as f:
        w.write(f)
    os.remove(roh)
    print(f"{len(seiten)} Seiten · {nz} Zeichen kopierbar · {os.path.getsize(ziel)/1024:.0f} KB")
    print("SAVED", ziel)
