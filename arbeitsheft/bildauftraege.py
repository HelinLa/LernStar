# -*- coding: utf-8 -*-
"""Bildauftraege als PDF: eine Seite je fehlendem Einstiegsbild.

Die Angaben kommen aus bilder/PROMPTS.md, damit es nur EINE Quelle gibt und
das Blatt nicht auseinanderlaeuft, sobald dort etwas geaendert wird.

Die Seiten sind - wie im Heft - gesetzte Bilder. Damit sich der englische Prompt
trotzdem herauskopieren laesst, kommt dieselbe unsichtbare Textebene darueber,
die auch das E-Book durchsuchbar macht.
"""
import os, re, json, sys
from build_final import *
from textschicht import anhaengen

HERE = os.path.dirname(os.path.abspath(__file__))

# Kennung -> was am alten Bild nicht stimmte. Steht bewusst hier und nicht in
# PROMPTS.md: Es ist der Grund fuer DIESE Runde, nicht Teil des Bildauftrags.
BEFUND = {
    "h4":  "Das bisherige Bild zeigt eine gewöhnliche Nacht mit Vollmond über den Häusern. "
           "Eine Sonnenfinsternis ist aber ein verdunkelter Mittag.",
    "h2":  "Auf dem bisherigen Bild liegt auf beiden Hälften Schnee. Der Unterschied "
           "zwischen Sommer und Winter ist damit nicht zu erkennen.",
    "w5":  "Das bisherige Bild zeigt einen rot glühenden Becher mit Flammen. So sieht "
           "heißes Metall nicht aus, und es lenkt vom eigentlichen Vergleich ab.",
    "sc4": "Für diese Seite gibt es noch kein passendes Bild. Die alte Datei zeigte "
           "Gitarre und Verstärker, die Seite handelt aber von der Waschmaschine hinter der Wand.",
    "w4":  "Für diese Seite gibt es noch kein Bild. Die Seite hieß früher „Aus der Flasche "
           "wird eine Pfütze“ und heißt jetzt „Aus Eis wird Wasser“.",
}
# Alle Themen, fuer die je ein Auftrag geschrieben wurde, in der Reihenfolge des Blattes.
def _kandidaten():
    """Alle Themen des Hefts, in Heftreihenfolge.

    Frueher stand hier eine von Hand gepflegte Liste. Die veraltet: Als die fuenf
    damals offenen Bilder da waren, lieferte das Auftrags-PDF nur noch ein
    Deckblatt - obwohl drei andere Themen laengst kein Bild hatten."""
    import json as _json
    q = os.path.join(HERE, "content", "forscherseiten.json")
    d = _json.load(open(q, encoding="utf-8"))
    if isinstance(d, dict):
        d = d.get("seiten", [])
    return [o["id"] for o in d]


def _seitenzahlen():
    """Gemessene Seitenzahlen aus dem letzten Satz; sonst leer."""
    import json as _json
    q = os.path.join(HERE, "build", "seiten.json")
    try:
        return _json.load(open(q, encoding="utf-8"))
    except Exception:
        return {}


KANDIDATEN = _kandidaten()
SEITE = _seitenzahlen()


def _offen():
    """Nur die Themen aufs Blatt, fuer die noch KEIN passendes Bild da ist.

    Wird aus bilder.einlesen() abgeleitet statt von Hand gepflegt: sobald eine
    Datei im Schreibtisch-Ordner liegt, verschwindet ihr Auftrag von selbst."""
    import bilder
    da = bilder.einlesen(still=True, vom_schreibtisch=False)
    return [t for t in KANDIDATEN if t not in da]


REIHE = _offen()


def _auftraege():
    """Titel, Motiv, Verbot und Prompt je Kennung aus PROMPTS.md holen."""
    t = open(os.path.join(HERE, "bilder", "PROMPTS.md"), encoding="utf-8").read()
    raus = {}
    for tid in REIHE:
        m = re.search(r"^### `%s\.png` — (.*?)$(.*?)(?=^### |^## |\Z)" % tid, t, re.M | re.S)
        if not m:
            continue
        block = m.group(2)
        raus[tid] = {
            "titel":  m.group(1).strip(),
            "motiv":  re.search(r"\*\*Motiv:\*\* (.*)", block).group(1).strip(),
            "verbot": re.search(r"\*\*Darf nicht zu sehen sein:\*\* (.*)", block).group(1).strip(),
            "prompt": re.search(r"```\n(.*?)\n```", block, re.S).group(1).strip(),
        }
    return raus


ZAHLWORT = {1: "ein", 2: "zwei", 3: "drei", 4: "vier", 5: "fünf", 6: "sechs", 7: "sieben"}


def _kopf(h, augen, titel, farbe=GOLD_D):
    h.tracked(ML, 84, augen, COP(13), farbe, 4, center=False)
    f = DIDOT(38)
    if h.tw(titel, f) > W - 2 * ML:
        f = DIDOT(31)
    h.T(ML, 108, titel, f, INK)
    h.ln([(ML + 2, 168), (W - ML, 168)], GLINE, 1.4)


def _fuss(h, pn, gesamt):
    h.circ(ML + 8, H - 40, 13, outline=GOLD, w=2)
    h.circ(ML + 8, H - 40, 4, fill=GOLD)
    h.T(ML + 34, H - 48, "FORSCHERHEFT PHYSIK · KLASSE 5 · BILDAUFTRÄGE", COP(9), GOLD_D)
    if pn:
        h.R(W - ML - 56, H - 64, W - ML, H - 22, 8, fill=GOLD_D)
        h.T(W - ML - 28, H - 42, f"{pn}/{gesamt}", AVB(13), CREAM, anchor="mm")


def deckblatt(n):
    im, d = newp(CREAM); h = hp(im, d)
    if n == 0:
        _kopf(h, "WAS ZU TUN IST", "Alle Bilder sind da")
    else:
        _kopf(h, "WAS ZU TUN IST", f"Noch {ZAHLWORT.get(n, str(n))} Bild{'er' if n != 1 else ''} offen")
    y = 206
    if n == 0:
        text = ("Jede Forscherseite dieses Hefts hat ihr Einstiegsbild. Es ist kein Auftrag mehr offen. "
                "Diese Seite bleibt als Merkzettel: Sie beschreibt, wie ein Bild ins Heft kommt, falls "
                "Sie eines austauschen möchten.")
    else:
        text = (f"Diese {ZAHLWORT.get(n, str(n))} Einstiegsbilder passen nicht zum überarbeiteten Text "
                "oder fehlen ganz. Bis sie da sind, steht auf den Seiten ein Platzhalter – lieber eine "
                "leere Karte als ein Bild, das etwas Falsches zeigt.")
    y = h.para(ML, y, text, AVM(17), INK, W - 2 * ML, 30) + 26

    kasten = [
        ("Wohin", "In den Ordner „Arbeitsheft-Bilder 5/6 Klasse“ auf dem Schreibtisch."),
        ("Dateiname", "Genau der Titel, der auf jeder Auftragsseite oben steht, mit .png am Ende. "
                      "Eine alte Datei einfach überschreiben oder eine neue daneben legen – ich erkenne beides."),
        ("Format", "Querformat 5:3, mindestens 1200 × 720 Punkte. Größer ist gut, ich schneide passend zu."),
        ("Danach", "Kurz Bescheid sagen – ich ziehe die Bilder ins Heft und baue das E-Book neu."),
    ]
    bh = 34 + len(kasten) * 74
    h.gframe(ML, y, W - ML, y + bh)
    h.tracked(ML + 26, y + 18, "SO KOMMEN DIE BILDER INS HEFT", COP(11), GOLD_D, 2, center=False)
    ry = y + 54
    for i, (was, wie) in enumerate(kasten):
        h.circ(ML + 40, ry + 14, 15, fill=GOLD)
        h.T(ML + 40, ry + 15, str(i + 1), AVB(14), CREAM, anchor="mm")
        h.T(ML + 76, ry + 4, was, AVB(16), INK)
        h.para(ML + 76, ry + 28, wie, AV(14), SUB, W - 2 * ML - 110, 22)
        ry += 74
    y += bh + 34

    h.tracked(ML, y, "DIE EINE REGEL", COP(12), GOLD_D, 2, center=False); y += 30
    y = h.para(ML, y, "Das Bild zeigt das Problem, nie die Lösung. Ein Kind soll die Situation erkennen "
               "und sich fragen, woran es liegt – die Antwort darf nicht schon im Bild stehen. Deshalb: "
               "keine Pfeile, keine Wellen, keine Beschriftung, keine erklärenden Nebenbildchen.",
               AV(15), INK, W - 2 * ML, 25) + 30

    h.tracked(ML, y, "AUCH NOCH AUFFÄLLIG, ABER NICHT FALSCH", COP(12), GOLD_D, 2, center=False); y += 30
    h.para(ML, y, "„Nicht so laut!“ (Seite 70) und „Das Pfeifen im Ohr“ (Seite 76) zeigen Schallwellen, "
           "Ohrsymbole und Beschriftungen. Sie verraten die Antwort und fallen stilistisch aus der Reihe. "
           "Sag Bescheid, wenn du auch dafür Aufträge möchtest – dann werden es sieben.",
           AV(15), SUB, W - 2 * ML, 25)
    _fuss(h, 0, n)
    return fertig(im)


def auftragsseite(tid, a, nr, gesamt):
    im, d = newp(CREAM); h = hp(im, d)
    _kopf(h, f"BILDAUFTRAG {nr} VON {gesamt}", a["titel"])

    y = 190
    h.T(ML, y, "Dateiname:", AVB(14), SUB)
    h.T(ML + 96, y, f"{a['titel']}.png", AVB(14), INK)
    h.T(ML + 96 + h.tw(f"{a['titel']}.png", AVB(14)) + 18, y, (f"·  Seite {SEITE[tid]} im Heft" if tid in SEITE else ""), AV(14), SUB)
    y += 38

    # Das bisherige Bild danebenlegen, damit klar ist, was ersetzt wird.
    # Im Heft steht dort inzwischen ein Platzhalter.
    alt = os.path.join(HERE, "img", f"einstieg_{tid}.alt.png")
    bb = 430
    if os.path.exists(alt):
        h.pastefit(alt, ML, y, bb, bb * 540 / 900)
        h.tracked(ML, y + bb * 540 / 900 + 12, "DAS PASST NICHT DAZU", COP(9), (176, 92, 84), 2, center=False)
        tx = ML + bb + 34
    else:
        tx = ML
    tw = W - ML - tx
    # Der Befund erklaert, warum das bisherige Bild nicht passt. Fuer Themen, die
    # noch nie ein Bild hatten, gibt es keinen - dann faellt der Absatz einfach weg.
    by = h.para(tx, y + 2, BEFUND[tid], AVM(17), (176, 92, 84), tw, 29) if tid in BEFUND else y
    y = max(by, y + (bb * 540 / 900 + 40 if os.path.exists(alt) else 0)) + 30

    h.tracked(ML, y, "SO SOLL ES AUSSEHEN", COP(13), GOLD_D, 2, center=False); y += 34
    y = h.para(ML, y, a["motiv"], AVM(19), INK, W - 2 * ML, 32) + 30

    bh = 30 + len(h.wrap(a["verbot"], AV(16.5), W - 2 * ML - 78)) * 27
    h.R(ML, y, W - ML, y + bh, 10, fill=(253, 241, 224), outline=(214, 150, 60), w=1.4)
    h.circ(ML + 30, y + bh / 2, 13, fill=(214, 150, 60))
    h.T(ML + 30, y + bh / 2 + 1, "!", AVB(16), CREAM, anchor="mm")
    h.para(ML + 56, y + 15, a["verbot"], AV(16.5), (150, 96, 26), W - 2 * ML - 78, 27)
    y += bh + 30

    h.tracked(ML, y, "PROMPT ZUM KOPIEREN", COP(13), GOLD_D, 2, center=False)
    h.T(W - ML, y + 4, "Text lässt sich aus dem PDF markieren", AV(13), SUB, anchor="ra")
    y += 34
    zeilen = h.wrap(a["prompt"], AV(14.5), W - 2 * ML - 48)
    ph = 34 + len(zeilen) * 25
    h.R(ML, y, W - ML, y + ph, 10, fill=WHITE, outline=GLINE, w=1.4)
    h.para(ML + 24, y + 17, a["prompt"], AV(14.5), INK, W - 2 * ML - 48, 25)

    _fuss(h, nr, gesamt)
    return fertig(im)


if __name__ == "__main__":
    a = _auftraege()
    fehlt = [t for t in REIHE if t not in a]
    if fehlt:
        sys.exit(f"in PROMPTS.md nicht gefunden: {fehlt}")
    seiten = [deckblatt(len(REIHE))]
    for i, tid in enumerate(REIHE):
        seiten.append(auftragsseite(tid, a[tid], i + 1, len(REIHE)))

    bd = os.path.join(HERE, "build"); os.makedirs(bd, exist_ok=True)
    roh = os.path.join(bd, "Bildauftraege_roh.pdf")
    seiten[0].save(roh, "PDF", resolution=150, save_all=True, append_images=seiten[1:])

    from pypdf import PdfReader, PdfWriter
    r = PdfReader(roh); w = PdfWriter()
    for p in r.pages:
        w.add_page(p)
    w.add_outline_item("Was zu tun ist", 0)
    for i, tid in enumerate(REIHE):
        w.add_outline_item(f"{i+1} · {a[tid]['titel']}", i + 1)
    nl, nz = anhaengen(w, [SEITENTEXTE.get(id(p), []) for p in seiten])
    w.add_metadata({"/Title": "Bildaufträge · Forscherheft Physik Klasse 5",
                    "/Author": "Abdullah Lala", "/Subject": "Fehlende Einstiegsbilder"})
    ziel = os.path.expanduser("~/Desktop/Bildauftraege_Klasse5.pdf")
    with open(ziel, "wb") as f:
        w.write(f)
    os.remove(roh)
    print(f"{len(seiten)} Seiten · {nz} Zeichen kopierbar · {os.path.getsize(ziel)/1024:.0f} KB")
    print("SAVED", ziel)
