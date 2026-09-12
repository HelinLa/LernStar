# -*- coding: utf-8 -*-
"""PROTOTYP LESBARKEIT - eine echte FELO-Heftseite in drei Fassungen.

    python3 lesbar.py                    # setzt ist, spec und felo
    python3 lesbar.py --variante=spec
    python3 lesbar.py --einheit=kw7      # andere Einheit (anderer Band)

Diese Datei aendert NICHTS am bestehenden Satz. Sie IMPORTIERT den Satzmotor
(arbeitsheft/build_final.py), das Gestaltungssystem (arbeitsheft/felo_design.py)
und - fuer die Fassung "ist" - den echten Seitenbauer des Bandes
(arbeitsheft8/build_book.py). Alle drei werden nur gelesen.

DAS GESTALTUNGSSYSTEM STEHT NICHT MEHR HIER. Farbtafel, Groessentafel,
Schrifthelfer mit Zeichenpruefung, die vier Kastenarten, Tabelle,
Abschnittsmarke, Kompetenzchip, Seitenrahmen sowie Messen und Umbrechen liegen
in arbeitsheft/felo_design.py - damit spaeter alle 19 Baende damit gesetzt
werden. Hier steht nur noch, WAS auf diese eine Seite kommt.

Geometrie wie im echten Satz: W,H = 1240x1754 bei S=2, Ausgabe 150 dpi.
Eine Zahl in diesem Code mal 0,48 ergibt Punkt im Druck - gerechnet wird das
an genau einer Stelle, in felo_design.einheiten().

Der Zweck ist eine ZAHL: was kostet 12-pt-Fliesstext an Seiten?
Deshalb bricht der Umbruch hier ECHT um. Nichts faellt unter die Blattkante -
genau der Fehler, der build_pilot.seite_l und ch_uebung lange unbemerkt unterlief.
"""
import os, sys, json, argparse

HIER = os.path.dirname(os.path.abspath(__file__))           # .../arbeitsheft/prototyp
MOTORDIR = os.path.dirname(HIER)                            # .../arbeitsheft
PROJ = os.path.dirname(MOTORDIR)                            # .../LernStar
BUILD = os.path.join(HIER, "build")

sys.path.insert(0, MOTORDIR)
import build_final as bf
from build_final import newp, hp, sc, W, H, S
import felo_design as fd
from felo_design import (
    einheiten, punkt, kontrast, hexf, schrift, fehlende_zeichen,
    T, para, laeufe, marke, kompchip, raute, tabelle, seitenrahmen,
    kasten_merk, kasten_experiment, kasten_warnung, kasten_hinweis,
    Baustein, messe_bausteine, umbrechen, schreibraum_auffuellen,
    GESETZT, KAESTEN, STIL, LH, LH_KLEIN,
    X0, X1, SPALTE, XT1, RAND0, RAND1, OBEN, UNTEN, FORTS,
    ABS_ABSCHNITT, ABS_AUFGABE, ABS_ZEILE,
)
from PIL import Image, ImageDraw, ImageFont

# ─────────────────────────────────────────────────────────────────────────────
# 1  Welche Einheit, welcher Band
# ─────────────────────────────────────────────────────────────────────────────
EINHEITEN = {
    # id : (Bandordner, Kapitel-Id, Nummer im Kapitel, gedruckte Seitenzahl)
    "sp4": ("arbeitsheft8", "spannung",   4, 20),
    "kw7": ("arbeitsheft9", "kraftwerke", 7, 88),
}

def lade_band(band):
    """Den echten Seitenbauer des Bandes holen.

    NUR EIN Band je Lauf: jedes Heft hat ein Modul namens build_book, der zweite
    Import wuerde stillschweigend das erste zurueckgeben (bekannte Falle 3)."""
    p = os.path.join(PROJ, band)
    if p not in sys.path:
        sys.path.insert(0, p)
    import build_book
    if os.path.abspath(build_book.HERE) != os.path.abspath(p):
        raise SystemExit("falsches build_book geladen: %s statt %s" % (build_book.HERE, p))
    return build_book

# ─────────────────────────────────────────────────────────────────────────────
# 2  Die beiden Fassungen
#
#    "spec" ist die Farbtafel des Gestaltungssystems - sie steht in
#    felo_design.py, nicht hier. "felo" bleibt nur als Vergleichsspalte im
#    Vergleichsbild stehen; als Gestaltung ist sie vom Tisch.
# ─────────────────────────────────────────────────────────────────────────────
WEISS = (255, 255, 255)

STIL_SPEC = dict(STIL)

STIL_FELO = dict(
    name="felo", titel="FELO-Identitaet, gleiche Typografie",
    grund=(250, 246, 236),       # CREME  #FAF6EC
    text=(38, 44, 66),           # INK    12,79:1
    h1=(15, 24, 56),             # FELO-Navy  16,11:1
    akzent=(22, 58, 95),         # #163A5F  10,78:1 auf Creme - EINE Akzentfarbe
    akzent_schrift=(250, 246, 236),
    merk_grund=(242, 231, 204),  # Pergament: Gold als FLAECHE, nie als Schrift
    exp_grund=WEISS,             # heller als der Seitengrund - im SW-Druck trennbar
    kasten_weiss=WEISS,
    warn=(180, 35, 24),          # #B42318, 6,09:1 auf Creme
    linie=(140, 108, 40),        # GOLD_D - Gold ausschliesslich fuer Linien
    zart=(226, 206, 150),        # GLINE
)

# ─────────────────────────────────────────────────────────────────────────────
# 3  Der Bauplan: die Seite als Folge von Bausteinen
# ─────────────────────────────────────────────────────────────────────────────
def bauplan(cfg, st, bb, kap, fno):
    B = []
    add = lambda *a, **k: B.append(Baustein(*a, **k))
    tid = cfg["id"]
    titel = cfg.get("titel") or cfg["name"]
    dat = cfg.get("daten")
    am_schirm = tid in getattr(bb.plan, "AM_BILDSCHIRM", ())
    # ── Titel (die Randspalte daneben zeichnet seitenrahmen) ────────────────
    def b_titel(h, d, y):
        # Gesetzt wird mit SourceSans3 - auch die Hauptueberschrift. Atkinson
        # Hyperlegible fehlen 55 Zeichen mit 2944 Vorkommen im Heftinhalt; die
        # fruehere Rueckfallregel ("nimm Atkinson, wenn alle Zeichen da sind")
        # haette den Titelschnitt von Band zu Band wechseln lassen, je nachdem
        # ob im Titel ein Pfeil oder ein Index steht.
        T(h, X0, y, titel, schrift("bold", fd.HAUPT), st["h1"])
        yy = y + einheiten(fd.HAUPT) * 1.20
        h.ln([(X0, yy), (XT1, yy)], st["akzent"], 2.0)
        return yy + 6
    add("Titel", b_titel, abstand=34)

    # ── 1 Problem & Frage ───────────────────────────────────────────────────
    add("Marke 1", lambda h, d, y: marke(h, d, y, 1, "Problem & Frage", st, "E1"),
        abstand=ABS_ZEILE, haftet=1)
    add("Problemtext",
        lambda h, d, y: para(h, X0, y, cfg["problem"], schrift("reg", fd.FLIESS),
                             st["text"], SPALTE, LH),
        abstand=ABS_AUFGABE)

    def b_frage(h, d, y):
        # Nur bis zur Textspalte: hier oben steht rechts die Randspalte mit
        # QR-Kaertchen und Einstiegsbild.
        XR = XT1
        f  = schrift("med",  fd.FLIESS)
        fb = schrift("bold", fd.FLIESS)
        fr = schrift("reg",  fd.FLIESS)
        innen = 20; xi = X0 + innen + 48; bw = XR - innen - xi
        zeilen = h.wrap(cfg["frage"], f, bw)
        auf = cfg.get("auftrag")
        azl = h.wrap(auf, fr, bw) if auf else []
        hoehe = 16 + LH_KLEIN + 6 + len(zeilen) * LH + ((12 + len(azl) * LH) if azl else 0) + 16
        h.R(X0, y, XR, y + hoehe, 10, fill=st["kasten_weiss"], outline=st["akzent"], w=2.0)
        h.circ(X0 + innen + 18, y + 22 + LH, 18, fill=st["akzent"])
        T(h, X0 + innen + 18, y + 23 + LH, "?", fb, st["akzent_schrift"], anchor="mm")
        T(h, xi, y + 16, "Unsere Forscherfrage", schrift("med", fd.KLEIN), st["akzent"])
        yq = y + 16 + LH_KLEIN + 6
        for i, z in enumerate(zeilen):
            T(h, xi, yq + i * LH, z, f, st["text"])
        if azl:
            hy = yq + len(zeilen) * LH + 5
            h.ln([(xi, hy), (XR - innen, hy)], st["zart"], 1)
            op = auf.split()[0]
            for j, z in enumerate(azl):
                cx = xi
                for wd in z.split():
                    fett = (j == 0 and wd == op)
                    fw = fb if fett else fr
                    T(h, cx, hy + 12 + j * LH, wd, fw, st["akzent"] if fett else st["text"])
                    cx += h.tw(wd, fw) + h.tw(" ", fw)
        KAESTEN.append((None, "Forscherfrage", X0, y, XR, y + hoehe, "Rahmen 2,0 + Fragezeichen-Scheibe"))
        return y + hoehe
    add("Forscherfrage", b_frage, abstand=ABS_ABSCHNITT)

    # ── 2 Deine Vermutung ───────────────────────────────────────────────────
    add("Marke 2", lambda h, d, y: marke(h, d, y, 2, "Deine Vermutung", st, "E3"),
        abstand=ABS_ZEILE, haftet=1)
    add("Hinweis Vermutung",
        lambda h, d, y: para(h, X0, y, "Kreuze an oder schreibe auf.",
                             schrift("reg", fd.FLIESS), st["text"], SPALTE, LH),
        abstand=ABS_ZEILE)
    for i, opt in enumerate(cfg.get("predict", [])[:2]):
        def b_opt(h, d, y, opt=opt):
            k = 30
            h.R(X0, y + 2, X0 + k, y + 2 + k, 6, outline=st["text"], w=2)
            return para(h, X0 + k + 20, y, opt, schrift("reg", fd.FLIESS),
                        st["text"], SPALTE - k - 20, LH)
        add("Vermutung %d" % (i + 1), b_opt, abstand=ABS_ZEILE)

    def b_begruende(h, d, y):
        f = schrift("med", fd.FLIESS)
        T(h, X0, y, "Begründe:", f, st["text"])
        x = X0 + h.tw("Begründe:", f) + 16
        h.ln([(x, y + LH * 0.80), (X1, y + LH * 0.80)], st["linie"], fd.LINIE_STAERKE)
        h.ln([(X0, y + LH * 0.80 + 42), (X1, y + LH * 0.80 + 42)], st["linie"], fd.LINIE_STAERKE)
        return y + LH * 0.80 + 52
    add("Begruende", b_begruende, abstand=ABS_ABSCHNITT)

    # ── 3 Forschen ──────────────────────────────────────────────────────────
    titel3 = "Auswerten & Beurteilen" if dat else (
             "Forschen am Bildschirm" if am_schirm else "Forschen – probiere es aus")
    add("Marke 3", lambda h, d, y: marke(h, d, y, 3, titel3, st, "E6" if dat else "E5"),
        abstand=ABS_ZEILE, haftet=1)

    if dat or am_schirm:
        hinweis = ("Datenblatt: " + dat["titel"]) if dat else \
            "Öffne die Simulation über den QR-Code oben rechts – hier trägst du ein.  ·  Ohne Gerät: Messwerte im Anhang."
        add("Experimentierkasten",
            lambda h, d, y: kasten_experiment(h, d, y, st, hinweis), abstand=ABS_AUFGABE)

    for i, schritt in enumerate(cfg.get("forschen", [])):
        def b_schritt(h, d, y, i=i, schritt=schritt):
            h.circ(X0 + 16, y + LH * 0.48, 16, fill=st["akzent"])
            T(h, X0 + 16, y + LH * 0.48 + 1, str(i + 1), schrift("bold", fd.KLEIN),
              st["akzent_schrift"], anchor="mm")
            return para(h, X0 + 48, y, schritt, schrift("reg", fd.FLIESS),
                        st["text"], SPALTE - 48, LH)
        add("Forschritt %d" % (i + 1), b_schritt, abstand=ABS_AUFGABE)

    if dat:
        def b_daten(h, d, y):
            e = tabelle(h, d, y, st, dat["spalten"], dat["zeilen"], [0.22, 0.33, 0.45])
            if dat.get("quelle"):
                e = para(h, X0, e + 10, dat["quelle"], schrift("reg", fd.KLEIN),
                         st["text"], SPALTE, LH_KLEIN)
            if dat.get("merke"):
                e = para(h, X0, e + 12, dat["merke"], schrift("med", fd.FLIESS),
                         st["text"], SPALTE, LH)
            return e
        add("Datenblatt + Quelle", b_daten, abstand=ABS_AUFGABE)

    if cfg.get("sicherheit"):
        add("Warnhinweis", lambda h, d, y: kasten_warnung(h, d, y, st, cfg["sicherheit"]),
            abstand=ABS_AUFGABE)
    if cfg.get("modellgrenze"):
        add("Modellgrenze", lambda h, d, y: kasten_hinweis(h, d, y, st, cfg["modellgrenze"]),
            abstand=ABS_AUFGABE)
    B[-1].abstand = ABS_ABSCHNITT

    # ── 4 Ordnen & Sichern ──────────────────────────────────────────────────
    add("Marke 4", lambda h, d, y: marke(h, d, y, 4, "Ordnen & Sichern", st, "K3"),
        abstand=ABS_ZEILE, haftet=1)
    add("Sicherungstabelle",
        lambda h, d, y: tabelle(h, d, y, st, cfg["tabCols"], cfg["tabRows"],
                                [0.42, 0.58], min_rh=einheiten(fd.TAB_ZEILE_SCHREIB)),
        abstand=ABS_AUFGABE)
    schluessel = [m["loesung"] for m in cfg.get("merksatz", [])[:2] if m.get("loesung")]
    add("Merkkasten",
        lambda h, d, y: kasten_merk(h, d, y, st, "Das musst du mitnehmen",
                                    [(cfg["fachtext"], schluessel)] if cfg.get("fachtext") else [],
                                    cfg.get("merksatz", [])[:2]),
        abstand=ABS_ABSCHNITT)

    # ── 5 Aufgaben ──────────────────────────────────────────────────────────
    auf = cfg["aufgabe"]
    add("Marke 5", lambda h, d, y: marke(h, d, y, 5, "Aufgaben – Check!", st,
                                         auf.get("komp"), auf.get("afb")),
        abstand=ABS_ZEILE, haftet=3)
    add("Aufgabenstellung",
        lambda h, d, y: para(h, X0, y, auf["frage"], schrift("med", fd.FLIESS),
                             st["text"], SPALTE, LH),
        abstand=ABS_ZEILE, haftet=2)
    for k in range(int(auf.get("zeilen", 3))):
        add("Schreiblinie %d" % (k + 1),
            lambda h, d, y: fd.schreiblinie(h, y, st), abstand=0)
    B[-1].abstand = ABS_ABSCHNITT

    at = cfg.get("alltag")
    if at:
        def b_alltag(h, d, y):
            innen = 26; xi = X0 + innen; bw = X1 - 2 * innen - 40
            zeilen = h.wrap(at, schrift("reg", fd.FLIESS), bw)
            kopf = 18 + einheiten(fd.KASTEN_KOPF) + 12
            hoehe = kopf + len(zeilen) * LH + 16 + 2 * 44 + 10
            h.R(X0, y, X1, y + hoehe, 10, fill=st["kasten_weiss"], outline=st["linie"], w=1.4)
            raute(d, xi + 9, y + 18 + einheiten(fd.KASTEN_KOPF) * fd.MITTE_DER_KOPFZEILE,
                  8, st["akzent"])
            T(h, xi + 28, y + 18, "Alltag & Anwendung", schrift("bold", fd.KASTEN_KOPF),
              st["akzent"])
            kompchip(h, X1 - innen, y + 14, cfg.get("alltagKomp"), cfg.get("alltagAfb"), st)
            yy = y + kopf
            for i, z in enumerate(zeilen):
                T(h, xi, yy + i * LH, z, schrift("reg", fd.FLIESS), st["text"])
            yy += len(zeilen) * LH + 16
            zaehlen = at.split()[0] in ("Nenne", "Finde", "Suche", "Sammle", "Achte")
            for k in range(2):
                ly = yy + k * 44 + 28
                if zaehlen:
                    T(h, xi, ly - 24, "%d." % (k + 1), schrift("bold", fd.FLIESS), st["text"])
                h.ln([(xi + (36 if zaehlen else 0), ly), (X1 - innen, ly)],
                     st["linie"], fd.LINIE_STAERKE)
            KAESTEN.append((None, "Arbeitsauftrag Alltag", X0, y, X1, y + hoehe,
                            "Rahmen + Raute + Ueberschrift"))
            return y + hoehe
        add("Alltag & Anwendung", b_alltag, abstand=0)
    return B

# ─────────────────────────────────────────────────────────────────────────────
# 4  Randspalte und Seitenlauf
# ─────────────────────────────────────────────────────────────────────────────
def randspalte(h, st, qrpfad, bildpfad):
    """Die Randspalte ist eine eigene Spalte, keine Einbettung in den Textfluss.

    Sie traegt QR-Kaertchen und Einstiegsbild. Weil sie neben der Textspalte
    liegt (922..1168 gegen 72..902), kann sie mit dem Umbruch nicht kollidieren -
    das erspart den Kunstgriff, ein Bild in einen Absatz einzurechnen."""
    y = OBEN
    if qrpfad:
        kb = 208
        h.R(RAND0, y, RAND0 + kb, y + 246, 10, fill=st["kasten_weiss"], outline=st["akzent"], w=1.6)
        h.pastefit(qrpfad, RAND0 + 14, y + 12, kb - 28, kb - 28)
        # Bildunterschrift: Vorgabe verlangt mindestens 10 pt (heute 4,32 pt)
        T(h, RAND0 + kb / 2, y + 200, "Simulation", schrift("med", fd.KLEIN),
          st["text"], anchor="ma")
        y += 246 + 20
    if bildpfad and os.path.exists(bildpfad):
        h.pastefit(bildpfad, RAND0, y, RAND1 - RAND0, 520, align="left", valign="top")

def setze_variante(cfg, st, bb, kap, fno, pn):
    B = bauplan(cfg, st, bb, kap, fno)
    hoehen = messe_bausteine(B, st)
    seiten = umbrechen(B, hoehen)
    inhalt_roh = sum(hoehen) + sum(b.abstand for b in B[:-1])
    B, hoehen, seiten = schreibraum_auffuellen(B, hoehen, seiten, st)
    titel = cfg.get("titel") or cfg["name"]
    kopf_links = "%s · Forscherkreis %02d" % (kap["titel"], fno)
    kopf_rechts = ("Basiskonzept: " + cfg["basiskonzept"]) if cfg.get("basiskonzept") else None
    inhalt_hoehe = sum(hoehen) + sum(b.abstand for b in B[:-1])
    tid = cfg["id"]
    qrpfad = os.path.join(bb.HERE, "qr", "qr_%s.png" % tid)
    if not (bb.SIM.get(tid) and os.path.exists(qrpfad)): qrpfad = None
    bildpfad = os.path.join(bb.HERE, "img", "einstieg_%s.png" % tid)
    bilder = []
    for si, blocks in enumerate(seiten):
        im, d = newp(st["grund"]); h = hp(im, d)
        seitenrahmen(h, d, st, kopf_links, kopf_rechts, titel, si, len(seiten), pn)
        if si == 0: randspalte(h, st, qrpfad, bildpfad)
        n_k = len(KAESTEN)
        for i, y in blocks:
            ende = B[i].f(h, d, y)
            if ende > UNTEN + 1:
                print("  WARNUNG %s: Baustein %r endet bei y=%.0f, unter dem Satzspiegel (%d)"
                      % (st["name"], B[i].name, ende, UNTEN))
        for j in range(n_k, len(KAESTEN)):
            k = list(KAESTEN[j]); k[0] = si; KAESTEN[j] = tuple(k)
        bilder.append(bf.fertig(im))
    return bilder, inhalt_hoehe, inhalt_roh, hoehen, B, seiten

# ─────────────────────────────────────────────────────────────────────────────
# 5  Messen am fertigen Bild
# ─────────────────────────────────────────────────────────────────────────────
def tinte_unten(img, grund, bis=UNTEN):
    """Unterste Zeile mit Inhalt oberhalb von `bis`, in Layout-Einheiten."""
    g = img.convert("L"); px = g.load()
    gl = int(round(0.299 * grund[0] + 0.587 * grund[1] + 0.114 * grund[2]))
    br, hh = g.size
    for y in range(min(int(bis), hh) - 1, -1, -1):
        for x in range(0, br, 2):
            if abs(px[x, y] - gl) > 14:
                return y + 1
    return 0

def sw_probe(bilder):
    """Graustufen: ist der Grund der Kaesten noch unterscheidbar?"""
    aus = {}
    for si, img in enumerate(bilder):
        g = img.convert("L"); px = g.load()
        bw, bh = g.size
        for seite, art, x0, y0, x1, y1, merkmal in KAESTEN:
            if seite != si: continue
            werte = []
            for yy in range(int(y0) + 8, min(int(y0) + 30, int(y1) - 4)):
                for xx in range(int(x1) - 72, int(x1) - 14):
                    if 0 <= xx < bw and 0 <= yy < bh: werte.append(px[xx, yy])
            if werte:
                werte.sort()
                aus.setdefault(art, (werte[len(werte) // 2], merkmal))
    return aus

# ─────────────────────────────────────────────────────────────────────────────
# 6  Ausgabe
# ─────────────────────────────────────────────────────────────────────────────
def sichere(bilder, name):
    """PNG je Seite, ein mehrseitiges PDF, dazu die Schwarz-Weiss-Probe als Bild."""
    os.makedirs(BUILD, exist_ok=True)
    for i, b in enumerate(bilder):
        b.save(os.path.join(BUILD, "%s_s%d.png" % (name, i + 1)), dpi=(150, 150))
    pdf = os.path.join(BUILD, "%s.pdf" % name)
    bilder[0].save(pdf, "PDF", resolution=150, save_all=True, append_images=bilder[1:])
    sw = [b.convert("L") for b in bilder]
    for i, b in enumerate(sw):
        b.save(os.path.join(BUILD, "%s_sw_s%d.png" % (name, i + 1)), dpi=(150, 150))
    sw[0].save(os.path.join(BUILD, "%s_sw.pdf" % name), "PDF", resolution=150,
               save_all=True, append_images=sw[1:])
    return pdf

def vergleichsbild(saetze, name):
    """ist | spec | felo nebeneinander - eine Spalte je Fassung."""
    sk = 0.52
    bw, bh = int(W * sk), int(H * sk)
    luecke, kopf, rand = 28, 62, 28
    spalten = len(saetze); maxn = max(len(b) for _, _, b in saetze)
    gb = rand * 2 + spalten * bw + (spalten - 1) * luecke
    gh = rand + kopf + maxn * bh + (maxn - 1) * 16 + rand
    blatt = Image.new("RGB", (gb, gh), (236, 237, 240))
    d = ImageDraw.Draw(blatt)
    fk = ImageFont.truetype(fd.SCHRIFTEN["bold"], 28)
    fs = ImageFont.truetype(fd.SCHRIFTEN["reg"], 21)
    for ci, (lab, unter, bilder) in enumerate(saetze):
        x = rand + ci * (bw + luecke)
        d.text((x, rand + 6), lab, font=fk, fill=(31, 41, 55))
        d.text((x, rand + 34), unter, font=fs, fill=(90, 96, 108))
        for ri, b in enumerate(bilder):
            y = rand + kopf + ri * (bh + 16)
            blatt.paste(b.resize((bw, bh), Image.LANCZOS), (x, y))
            d.rectangle([x, y, x + bw - 1, y + bh - 1], outline=(168, 170, 176))
    p = os.path.join(BUILD, "%s.png" % name)
    blatt.save(p, dpi=(150, 150))
    blatt.save(os.path.join(BUILD, "%s.pdf" % name), "PDF", resolution=150)
    return p

# ─────────────────────────────────────────────────────────────────────────────
# 7  Hauptlauf
# ─────────────────────────────────────────────────────────────────────────────
IST_OBEN = 196          # dort beginnt der Inhalt im heutigen Satz (topic_page)

def main():
    ap = argparse.ArgumentParser(description="Lesbarkeits-Prototyp einer FELO-Heftseite")
    ap.add_argument("--variante", choices=["ist", "spec", "felo", "alle"], default="alle")
    ap.add_argument("--einheit", default="sp4", choices=sorted(EINHEITEN))
    a = ap.parse_args()

    band, kap_id, fno, pn = EINHEITEN[a.einheit]
    bb = lade_band(band)
    cfg = bb.FSD[a.einheit]
    kap = [k for k in bb.plan.KAPITEL if k["id"] == kap_id][0]
    os.makedirs(BUILD, exist_ok=True)

    print("=" * 78)
    print("PROTOTYP LESBARKEIT  ·  %s  ·  Einheit %s" % (band, a.einheit))
    print("Titel:   %s" % (cfg.get("titel") or cfg["name"]))
    print("Thema:   %s" % cfg["name"])
    print("Kapitel: %s · Forscherkreis %02d · heute gedruckt auf Seite %d" % (kap["titel"], fno, pn))
    print("Seite:   %dx%d bei S=%d, 150 dpi · 1 Einheit = %.2f pt · Satzspiegel %d..%d"
          % (W, H, S, fd.PT_JE_EINHEIT, OBEN, UNTEN))
    print("Gestaltung: felo_design.py, Selbsttest bestanden")
    print("=" * 78)

    ergebnis, saetze = {}, []

    if a.variante in ("ist", "alle"):
        diag = getattr(bb, "_diag", lambda *_: None)
        bilder = bb.topic_page(cfg, kap["titel"].upper(), fno, pn, kap["acc"], diag(kap["id"], a.einheit))
        sichere(bilder, "%s_ist" % a.einheit)
        unten = [tinte_unten(b, bf.CREAM) for b in bilder]
        ergebnis["ist"] = dict(seiten=len(bilder), tinte=unten,
                               inhalt=sum(u - IST_OBEN for u in unten))
        saetze.append(("ist", "heutiger Stand, unveraendert", bilder))

    for schl, st in (("spec", STIL_SPEC), ("felo", STIL_FELO)):
        if a.variante not in (schl, "alle"): continue
        del KAESTEN[:]
        bilder, inhalt, roh, hoehen, B, seiten = setze_variante(cfg, st, bb, kap, fno, pn)
        sichere(bilder, "%s_%s" % (a.einheit, schl))
        unten = [tinte_unten(b, st["grund"]) for b in bilder]
        ergebnis[schl] = dict(seiten=len(bilder), tinte=unten, inhalt=inhalt, roh=roh,
                              bausteine=[(b.name, round(hoehen[i], 1)) for i, b in enumerate(B)],
                              sw=sw_probe(bilder))
        saetze.append((schl, st["titel"], bilder))

    if len(saetze) > 1:
        print("\nVergleichsbild: %s" % vergleichsbild(saetze, "%s_vergleich" % a.einheit))

    # ── Bericht ─────────────────────────────────────────────────────────────
    nutz = UNTEN - OBEN
    print("\n── WIE VIEL LAENGER WIRD DIE SEITE ────────────────────────────────────")
    print("Nutzhoehe je Seite: %d Einheiten = %.0f pt = %.1f cm  (Folgeseiten %d, Fortsetzungskopf)"
          % (nutz, punkt(nutz), punkt(nutz) / 72 * 2.54, nutz - FORTS))
    for k in ("ist", "spec", "felo"):
        if k not in ergebnis: continue
        e = ergebnis[k]
        t = ", ".join("S%d bis y=%d" % (i + 1, v) for i, v in enumerate(e["tinte"]))
        roh = e.get("roh", e["inhalt"])
        print("%-5s  A4-Seiten: %d   Inhaltshoehe: %6.0f Einheiten = %5.0f pt = %.2f Nutzhoehen   [%s]"
              % (k, e["seiten"], roh, punkt(roh), roh / nutz, t))
        if roh != e["inhalt"]:
            print("       davon Pflicht %.0f, dazu %.0f Einheiten Schreibraum, weil unten Platz blieb"
                  % (roh, e["inhalt"] - roh))
    if "ist" in ergebnis:
        for k in ("spec", "felo"):
            if k not in ergebnis: continue
            print("%-5s gegen ist: Inhalt x %.2f   ·   Seiten %d -> %d"
                  % (k, ergebnis[k].get("roh", ergebnis[k]["inhalt"]) / max(1.0, ergebnis["ist"]["inhalt"]),
                     ergebnis["ist"]["seiten"], ergebnis[k]["seiten"]))

    print("\n── GROESSENTAFEL (felo_design, gedruckte Punkt) ───────────────────────")
    for lab, name in (("Hauptueberschrift", "HAUPT"), ("Zwischenueberschrift", "ZWISCHEN"),
                      ("Kastenueberschrift", "KASTEN_KOPF"), ("Ziffer in der Marke", "MARKE_ZIFFER"),
                      ("Fliesstext / Aufgaben", "FLIESS"), ("Merksatz", "MERK"),
                      ("Bildunterschrift / Quelle", "KLEIN")):
        g = fd.GROESSEN[name]
        print("  %-26s %-13s %5.2f pt  =  %6.2f Einheiten  ->  gedruckt %5.2f pt"
              % (lab, name, g, einheiten(g), fd.gedruckt(g)))
    print("  Zeilenabstand %.2f x Fliesstext = %.2f Einheiten = %.2f pt" % (fd.ZAB, LH, punkt(LH)))
    print("  Textspalte fuer %d Zeichen: %d Einheiten = %.0f pt (gesetzt wird auf %d = %.0f pt)"
          % (fd.ZEICHEN_JE_ZEILE, fd.SPALTE_65, punkt(fd.SPALTE_65), SPALTE, punkt(SPALTE)))

    print("\n── ZEICHENPRUEFUNG (jede gesetzte Zeichenkette gegen die cmap) ────────")
    arten = sorted({x[1] for x in GESETZT})
    print("  %d gesetzte Textlaeufe in %d Schriftarten: %s" % (len(GESETZT), len(arten), ", ".join(arten)))
    fehler = {}
    for s, art, _g in GESETZT:
        f = fehlende_zeichen(s, art)
        if f: fehler.setdefault(art, set()).update(f)
    if fehler:
        for art, zs in fehler.items(): print("  FEHLT in %s: %s" % (art, " ".join(sorted(zs))))
    else:
        print("  kein fehlendes Zeichen.")
    print("  Gegenprobe: '▤' (U+25A4) fehlt SourceSans3 -> %s" % bool(fehlende_zeichen("▤", "reg")))

    print("\n── VORGABE NACHGEMESSEN AM FERTIGEN SATZ ──────────────────────────────")
    grade = sorted({round(g, 2) for _s, _a, g in GESETZT})
    klein = [(s, g) for s, _a, g in GESETZT if g < 9.99]
    versal = [s for s, _a, _g in GESETZT
              if s.strip() and s.upper() == s and sum(c.isalpha() for c in s) > 2]
    print("  Schriftgrade auf der Seite: %d verschiedene, %.2f bis %.2f pt"
          % (len(grade), min(grade), max(grade)))
    print("  %s" % ", ".join("%.2f" % g for g in grade))
    print("  Laeufe unter 10 pt: %d  ·  Woerter in Grossbuchstaben: %d" % (len(klein), len(versal)))
    if klein:  print("    z.B. %r bei %.2f pt" % (klein[0][0], klein[0][1]))
    if versal: print("    z.B. %r" % versal[:3])

    print("\n── KONTRASTE (WCAG 2.1) ───────────────────────────────────────────────")
    kombis = []
    for st in (STIL_SPEC, STIL_FELO):
        n = st["name"]
        kombis += [
            (n, "Fliesstext 12 pt", st["text"], st["grund"], 4.5),
            (n, "Kolumnentitel / Quelle 10 pt", st["text"], st["grund"], 4.5),
            (n, "Hauptueberschrift 22 pt", st["h1"], st["grund"], 3.0),
            (n, "Zwischenueberschrift", st["akzent"], st["grund"], 3.0),
            (n, "Ziffer in der Abschnittsmarke", st["akzent_schrift"], st["akzent"], 4.5),
            (n, "Text im Merkkasten", st["text"], st["merk_grund"], 4.5),
            (n, "Ueberschrift im Merkkasten", st["akzent"], st["merk_grund"], 3.0),
            (n, "Text im Experimentierkasten", st["text"], st["exp_grund"], 4.5),
            (n, "Text im Tabellenkopf", st["text"], st["merk_grund"], 4.5),
            (n, "Ausrufezeichen auf Rot", WEISS, st["warn"], 4.5),
            (n, "Warnrand auf Grund", st["warn"], st["grund"], 3.0),
            (n, "Schreiblinie auf Grund", st["linie"], st["grund"], 3.0),
        ]
    schlecht = []
    print("  %-5s %-30s %-9s %-9s %6s %5s" % ("Stil", "Paar", "vorn", "hinten", "Wert", "Soll"))
    for n, lab, v, hg, soll in kombis:
        k = kontrast(v, hg)
        if k < soll: schlecht.append((n, lab, k, soll))
        print("  %-5s %-30s %-9s %-9s %6.2f  %4.1f  %s"
              % (n, lab, hexf(v), hexf(hg), k, soll, "ok" if k >= soll else "NEIN"))
    print("  unter der Grenze: %d" % len(schlecht))
    print("  heutiger Stand auf Creme %s:" % hexf(bf.CREAM))
    for lab, c in (("INK", bf.INK), ("SUB", bf.SUB), ("GOLD_D", bf.GOLD_D),
                   ("GOLD", bf.GOLD), ("GOLD_L", bf.GOLD_L), ("GLINE", bf.GLINE)):
        k = kontrast(c, bf.CREAM)
        print("    %-7s %-9s %6.2f  %s" % (lab, hexf(c), k, "ok fuer Text" if k >= 4.5 else "ZU WENIG fuer Text"))

    print("\n── SCHWARZ-WEISS-PROBE (Graustufen, Median des Kastengrunds) ──────────")
    for k in ("spec", "felo"):
        if k not in ergebnis: continue
        print("  %s:" % k)
        werte = []
        for art, (grau, merkmal) in sorted(ergebnis[k]["sw"].items()):
            print("    %-24s Grauwert %3d   zweites Merkmal: %s" % (art, grau, merkmal))
            werte.append(grau)
        sw = ergebnis[k]["sw"]
        for ka, kb in (("Merkkasten", "Experimentierkasten"),
                       ("Merkkasten", "Warnhinweis"),
                       ("Experimentierkasten", "Warnhinweis")):
            if ka in sw and kb in sw:
                dl = abs(sw[ka][0] - sw[kb][0])
                print("    %-22s gegen %-22s Delta %3d von 255  -> %s"
                      % (ka, kb, dl,
                         "nur am zweiten Merkmal zu trennen" if dl < 8 else "schon am Grund zu trennen"))

    with open(os.path.join(BUILD, "messung_%s.json" % a.einheit), "w", encoding="utf-8") as f:
        json.dump({k: {kk: vv for kk, vv in v.items() if kk != "sw"} for k, v in ergebnis.items()},
                  f, ensure_ascii=False, indent=1)
    print("\nDateien in %s" % BUILD)

if __name__ == "__main__":
    main()
