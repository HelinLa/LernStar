# -*- coding: utf-8 -*-
"""FeLabs-Gestaltungssystem – die Fassung "spec", herausgeloest aus dem Prototyp.

Dieses Modul enthaelt NUR Gestaltung: Farbtafel, Groessentafel, Schrifthelfer mit
Zeichenpruefung, die vier Kastenarten, Tabelle, Abschnittsmarke, Kompetenzchip,
Seitenrahmen sowie das Messen und Umbrechen von Bausteinen. Es weiss nichts von
Kapiteln, Themen, Simulationen oder Klassenstufen – damit alle Baende der Reihe
damit gesetzt werden koennen.

    import felo_design as fd
    f = fd.schrift("reg", fd.FLIESS)        # 12 pt Fliesstext
    y = fd.kasten_merk(h, d, y, fd.STIL, "Das musst du mitnehmen", absaetze, luecken)

Geometrie und Grundhelfer kommen aus arbeitsheft/build_final.py (newp, hp, sc,
W, H, S). Diese Datei wird NICHT geaendert – Klasse 5/6 ist gedruckt.

DIE EINE UMRECHNUNG
    Eine Zahl im Code mal 0,48 ergibt Punkt im Druck. Umgekehrt: einheiten(12)
    = 25,00. Diese Rechnung steht an genau EINER Stelle, in einheiten(). Wer
    eine Schrift braucht, holt sie ueber schrift(art, GRAD) mit einem Namen aus
    der Groessentafel. Eine nackte Zahl wie AV(15.5) hat in einem Satzskript
    nichts zu suchen – so entstand der 4,3-pt-Loesungsteil.

FREIGABE
    Beim Import laeuft selbsttest() still durch. Faellt er durch, wirft der
    Import – ohne bestandenen Selbsttest darf das Modul nicht benutzt werden.
    Den Bericht bekommt man mit:  python3 felo_design.py
"""
import os
import sys
import warnings

HIER = os.path.dirname(os.path.abspath(__file__))
if HIER not in sys.path:
    sys.path.insert(0, HIER)

import build_final as bf                                   # noqa: E402
from build_final import newp, hp, sc, W, H, S              # noqa: E402
from PIL import Image, ImageDraw, ImageFont                # noqa: E402
from fontTools.ttLib import TTFont                         # noqa: E402

__all__ = [
    "PT_JE_EINHEIT", "einheiten", "punkt",
    "GRUND", "TEXT", "TITEL", "AKZENT", "AKZENT_SCHRIFT", "MERK_GRUND",
    "EXP_GRUND", "KASTEN_WEISS", "WARN", "LINIE", "ZART", "STIL",
    "HAUPT", "ZWISCHEN", "KASTEN_KOPF", "MARKE_ZIFFER", "FLIESS", "MERK",
    "KLEIN", "GROESSEN", "ZAB", "LH", "LH_KLEIN",
    "schrift", "fehlende_zeichen", "pruefe_zeichen", "ZeichenFehlt",
    "T", "para", "laeufe", "zeilen_laeufe", "setze_laeufe",
    "marke", "kompchip", "raute", "dreieck", "schreiblinie",
    "kasten_merk", "kasten_experiment", "kasten_warnung", "kasten_hinweis",
    "luecke_breite", "luecken_satz", "tabelle", "seitenrahmen",
    "Baustein", "messe_bausteine", "umbrechen", "verklammern",
    "schreibraum_auffuellen",
    "kontrast", "leuchtdichte", "hexf", "selbsttest",
    "X0", "X1", "SPALTE", "SPALTE_65", "ZEICHEN_MAX", "XT1", "RAND0", "RAND1",
    "KASTEN_X0", "KASTEN_X1",
    "OBEN", "UNTEN", "FORTS", "GESETZT", "KAESTEN", "MERKMAL",
]

# ═════════════════════════════════════════════════════════════════════════════
# 1  DIE EINE UMRECHNUNG
# ═════════════════════════════════════════════════════════════════════════════
PT_JE_EINHEIT = 0.48          # 1240 Einheiten auf A4-Breite bei 150 dpi


def einheiten(pkt):
    """Gedruckte Punkt -> Layout-Einheiten. DIE EINZIGE STELLE DIESER RECHNUNG."""
    return pkt / PT_JE_EINHEIT


def punkt(einh):
    """Layout-Einheiten -> gedruckte Punkt. Nur zum Messen und Berichten."""
    return einh * PT_JE_EINHEIT


def gedruckt(pkt):
    """Was WIRKLICH im Druck steht.

    Die Schrift wird in ganzen Pixeln geladen (S=2), der Sollgrad also gerundet:
    15 pt sind gedruckt 14,88 pt, 22 pt sind 22,08 pt. Wer den Sollgrad meldet,
    meldet eine Zahl, die so nicht auf dem Papier steht."""
    return round(einheiten(pkt) * S) / S * PT_JE_EINHEIT


# ═════════════════════════════════════════════════════════════════════════════
# 2  KONTRAST (WCAG 2.1) – erst das Werkzeug, dann die Tafel
# ═════════════════════════════════════════════════════════════════════════════
def _kanal(v):
    v /= 255.0
    return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4


def leuchtdichte(c):
    r, g, b = c[:3]
    return 0.2126 * _kanal(r) + 0.7152 * _kanal(g) + 0.0722 * _kanal(b)


def kontrast(a, b):
    la, lb = leuchtdichte(a), leuchtdichte(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def hexf(c):
    return "#%02X%02X%02X" % tuple(c[:3])


# ═════════════════════════════════════════════════════════════════════════════
# 3  FARBTAFEL  –  Fassung "spec", weisser Grund, hoechstens zwei Akzentfarben
#
#    Jeder Wert traegt seinen GEMESSENEN Kontrast. Nachgerechnet wird er im
#    Selbsttest, nicht hier: ein Kommentar kann veralten, der Selbsttest nicht.
# ═════════════════════════════════════════════════════════════════════════════
GRUND          = (255, 255, 255)   # #FFFFFF  Seitengrund. Weiss, keine Creme.
TEXT           = ( 31,  41,  55)   # #1F2937  Fliesstext          14,68:1 auf GRUND
TITEL          = ( 22,  58,  95)   # #163A5F  Hauptueberschrift   11,64:1 auf GRUND
AKZENT         = (  0, 119, 125)   # #00777D  Petrol               5,34:1 auf GRUND
#                                  #          4,78:1 auf MERK_GRUND · 4,81:1 auf EXP_GRUND
#   NICHT #007C83. Der hellere Ton liegt auf MERK_GRUND bei 4,46:1 und faellt
#   damit unter 4,5:1 – genau dort steht die Ueberschrift des Merkkastens.
#   #00777D ist der geprueft abgedunkelte Ton; er haelt alle drei Gruende.
AKZENT_SCHRIFT = (255, 255, 255)   # #FFFFFF  Schrift AUF Petrol   5,34:1
MERK_GRUND     = (234, 244, 248)   # #EAF4F8  Merkkasten, Tabellenkopf
#                                  #          TEXT darauf 13,14:1
EXP_GRUND      = (234, 246, 238)   # #EAF6EE  Experimentierkasten
#                                  #          TEXT darauf 13,22:1
KASTEN_WEISS   = (255, 255, 255)   # #FFFFFF  Warnung, Hinweis, Forscherfrage
WARN           = (180,  35,  24)   # #B42318  NUR Rand und Zeichen, nie Flaeche
#                                  #          6,57:1 auf GRUND · Weiss darauf 6,57:1
LINIE          = (138, 148, 163)   # #8A94A3  Schreiblinien        3,07:1 auf GRUND
#                                  #          Grafikelement, Soll 3:1 (WCAG 1.4.11)
ZART           = (206, 216, 226)   # #CED8E2  Zierlinie            1,44:1 auf GRUND
#   AUSDRUECKLICHE AUSNAHME, im Selbsttest benannt und mitgedruckt: ZART traegt
#   keine Bedeutung. Die Tabelle wird von AKZENT-Rahmen (1,4) und AKZENT-Kopf-
#   linie getragen; ZART setzt nur Innenlinien und die Kopf-/Fusslinie der Seite.
#   Wird ZART je bedeutungstragend, muss der Wert auf 3:1 nachgezogen werden.

STIL = dict(
    name="spec", titel="volle Vorgabe",
    grund=GRUND, text=TEXT, h1=TITEL, akzent=AKZENT, akzent_schrift=AKZENT_SCHRIFT,
    merk_grund=MERK_GRUND, exp_grund=EXP_GRUND, kasten_weiss=KASTEN_WEISS,
    warn=WARN, linie=LINIE, zart=ZART,
)

# Welches Paar muss wie viel halten? Der Selbsttest rechnet genau diese Liste.
#   ("Rolle", vorn, hinten, Grad in pt oder None fuer ein Grafikelement)
# Soll: Text unter 18 pt 4,5:1 · Text ab 18 pt 3,0:1 · Grafikelement 3,0:1.
KONTRASTPAARE = []          # wird nach der Groessentafel gefuellt (braucht die Grade)


# ═════════════════════════════════════════════════════════════════════════════
# 4  GROESSENTAFEL  –  in GEDRUCKTEN PUNKT
#
#    Wer eine Schrift setzt, nennt einen dieser Namen. Nie eine Zahl.
# ═════════════════════════════════════════════════════════════════════════════
HAUPT        = 22    # Hauptueberschrift                            (Vorgabe 20-24)
ZWISCHEN     = 15    # Zwischenueberschrift, Abschnittsmarke        (Vorgabe 14-16)
KASTEN_KOPF  = 14    # Ueberschrift im Merk- und Alltagskasten
MARKE_ZIFFER = 13    # Ziffer im Kasten der Abschnittsmarke
FLIESS       = 12    # Fliesstext, Aufgaben, Hinweise
MERK         = 12    # Merksatz mit Luecke im Merkkasten
KLEIN        = 10    # Bildunterschrift, Quelle, Kolumnentitel, Kompetenzchip
# Die Leiter 22 / 15 / 14 / 13 / 12 / 10 steht in GANZEN Punkt. Der Prototyp
# hatte hier 16 / 14,4 / 13,12 – die krummen Werte entstanden aus Faktoren
# (G_ZWISCH * 0,9 und * 0,82) und sind genau die Gewohnheit, die dieses Modul
# abstellen soll: eine Groesse wird benannt, nicht ausgerechnet.

GROESSEN = dict(HAUPT=HAUPT, ZWISCHEN=ZWISCHEN, KASTEN_KOPF=KASTEN_KOPF,
                MARKE_ZIFFER=MARKE_ZIFFER, FLIESS=FLIESS, MERK=MERK, KLEIN=KLEIN)
GRAD_UNTERGRENZE = 10.0     # nichts faellt unter 10 pt

ZAB      = 1.25                                  # Zeilenabstand (Vorgabe 1,15-1,3)
LH       = round(einheiten(FLIESS) * ZAB, 2)     # 31,25 Einheiten = 15,00 pt
LH_KLEIN = round(einheiten(KLEIN) * ZAB, 2)      # 26,04 Einheiten = 12,50 pt

# Zeilenlaenge. Gemessen mit SourceSans3-Regular an einem Satz Fliesstext:
# ein Zeichen ist im Mittel 10,72 Einheiten breit.
ZEICHEN_JE_ZEILE = 65                            # Zielwert der Vorgabe
SPALTE_65 = 697                                  # = 335 pt = 11,8 cm, gemessen
ZEICHEN_MAX = 85                                 # Obergrenze, im Selbsttest geprueft
#
# ERLEDIGT (09.09.2026). Vorher liefen Kaesten und Tabellen ueber die volle
# Blattbreite, waehrend der Fliesstext in der Textspalte stand. Gemessen an
# Kapitel 1 des gesetzten Bandes 8, ueber die vom Umbruch WIRKLICH gefuellten
# Lesezeilen: Median 71, 95-Prozent-Wert 100, Maximum 107 Zeichen - 29 % aller
# Zeilen ueber 85. Das nimmt der groesseren Schrift genau den Gewinn, fuer den
# sie da ist: bei 107 Zeichen findet das Auge den naechsten Zeilenanfang nicht
# mehr. Kaesten und Tabellen stehen deshalb jetzt auf KASTEN_X0..KASTEN_X1,
# derselben Breite wie der Fliesstext. Probe 6 des Selbsttests misst das nach.
# Das kostet Seiten - der Umbruch wird laenger; die Zahl steht im Bericht des
# jeweiligen Bandes und wird nicht geschaetzt.

# Anteil der Kopfzeilenhoehe, auf dem Raute und Zeichen sitzen (Mitte der Versalhoehe).
MITTE_DER_KOPFZEILE = 0.42 / 0.9

# Mindestmasse, ebenfalls in gedruckten Punkt
TAB_KOPF_MIN     = 24    # Kopfzeile der Tabelle
TAB_ZEILE_MIN    = 22    # Datenzeile der Tabelle
TAB_ZEILE_SCHREIB = 23   # Zeile einer Schreibtabelle (Schueler traegt ein)
LUECKE_MIN       = 52    # schmalste Luecke im Merksatz
LUECKE_LUFT      = 16    # Luft rechts und links der Loesung in der Luecke

# Schreiblinien
LINIE_HOEHE      = 42.0  # Zeilenabstand der Schreiblinien, Einheiten (20,2 pt)
LINIE_GRUNDLINIE = 30.0  # wo im Baustein die Linie liegt, Einheiten
LINIE_STAERKE    = 1.3
LINIEN_NACHSCHLAG_MAX = 9   # hoechstens neun Zeilen fuellen Restplatz auf


# ═════════════════════════════════════════════════════════════════════════════
# 5  SCHRIFT UND ZEICHENPRUEFUNG
#
#    Gesetzt wird mit SourceSans3. Atkinson Hyperlegible ist als Textschrift
#    unbrauchbar: ihr fehlen 55 Zeichen mit 2944 Vorkommen im Heftinhalt
#    (Pfeil, Tiefstellungen, griechische Buchstaben). Sie steht deshalb nicht
#    in dieser Tafel – wer sie nicht laden kann, setzt sie auch nicht.
# ═════════════════════════════════════════════════════════════════════════════
SCHRIFTEN = {
    "reg":  os.path.join(HIER, "fonts", "SourceSans3-Regular.ttf"),
    "med":  os.path.join(HIER, "fonts", "SourceSans3-Medium.ttf"),
    "bold": os.path.join(HIER, "fonts", "SourceSans3-Bold.ttf"),
}


class ZeichenFehlt(UserWarning):
    """Ein gesetztes Zeichen steht nicht in der cmap der Schrift.

    Ohne diese Warnung druckt PIL wortlos ein leeres Kaestchen. Genau so kam
    "▤" (U+25A4) in Heft 9 auf die Seite."""


_CMAP = {}
_FEHLT = {}


def cmap(art):
    if art not in _CMAP:
        t = TTFont(SCHRIFTEN[art], fontNumber=0, lazy=True)
        _CMAP[art] = set(t.getBestCmap())
        t.close()
    return _CMAP[art]


def fehlende_zeichen(s, art):
    """Welche Zeichen dieser Kette kann die Schrift nicht? Leere Liste = alles gut."""
    k = (s, art)
    if k not in _FEHLT:
        cm = cmap(art)
        _FEHLT[k] = tuple(sorted({c for c in (s or "") if c not in "\n\t" and ord(c) not in cm}))
    return list(_FEHLT[k])


def pruefe_zeichen(s, art):
    """Jede gesetzte Zeichenkette gegen die cmap. Fehlt eines, kommt eine Warnung."""
    f = fehlende_zeichen(s, art)
    if f:
        warnings.warn(
            "%s kann %s nicht: %s  (in %r)"
            % (os.path.basename(SCHRIFTEN.get(art, art)),
               " ".join("U+%04X" % ord(c) for c in f), " ".join(f), s),
            ZeichenFehlt, stacklevel=3)
    return f


_FCACHE, FONTART = {}, {}
_FREI = False          # Selbsttest bestanden?
_IM_TEST = False


def schrift(art, grad):
    """Die einzige Stelle, an der eine Schrift entsteht.

    `grad` ist ein Name aus der Groessentafel, in GEDRUCKTEN PUNKT."""
    if not (_FREI or _IM_TEST):
        raise RuntimeError("felo_design: Selbsttest nicht bestanden – "
                           "das Modul darf nicht benutzt werden.")
    e = einheiten(grad)
    k = (art, round(e, 3))
    if k not in _FCACHE:
        f = ImageFont.truetype(SCHRIFTEN[art], int(round(e * S)))
        FONTART[id(f)] = art
        _FCACHE[k] = f
    return _FCACHE[k]


# ═════════════════════════════════════════════════════════════════════════════
# 6  SATZSPIEGEL
# ═════════════════════════════════════════════════════════════════════════════
ML, MR = 72, 72
X0, X1 = ML, W - MR                   # 72 .. 1168  (1096 Einheiten breit)
SPALTE = 830                          # Textspalte neben der Randspalte
XT1    = X0 + SPALTE                  # 902
RAND0, RAND1 = 922, X1                # Randspalte: QR-Kaertchen und Bild

# So weit duerfen Kaesten und Tabellen laufen. NICHT bis X1: X0..X1 ist der
# Satzspiegel des BLATTES (Kopflinie, Fusslinie, Schreiblinien), X0..KASTEN_X1
# ist die LESEBREITE. Ein Kasten ueber die volle Blattbreite traegt gut 100
# Zeichen je Zeile; gelesen wird er dann schlechter als kleinere Schrift in
# einer schmalen Spalte. Jede Kastenfunktion nimmt x0/x1 auch einzeln entgegen -
# ein Band darf abweichen, aber es muss es dann hinschreiben.
KASTEN_X0, KASTEN_X1 = X0, XT1
OBEN   = 132                          # Satzspiegel oben
UNTEN  = H - 80                       # Satzspiegel unten
FORTS  = 62                           # Hoehe des Fortsetzungskopfs ab Seite 2

KOPF_Y, KOPFLINIE_Y = 52, 86
FUSSLINIE_Y, FUSS_Y = H - 74, H - 60


# ═════════════════════════════════════════════════════════════════════════════
# 7  SETZEN UND PROTOKOLLIEREN
# ═════════════════════════════════════════════════════════════════════════════
GESETZT = []    # (Zeichenkette, Schriftart, Grad in pt) – alles, was gedruckt wird
KAESTEN = []    # (Seite, Art, x0, y0, x1, y1, zweites Merkmal)

# Das zweite, farbunabhaengige Merkmal jeder Kastenart. Die Schwarz-Weiss-Probe
# haengt daran: zwei Kaesten mit fast gleichem Grauwert muessen sich hieran
# trennen lassen.
MERKMAL = {
    "Merkkasten":           "Balken links + Raute + Ueberschrift",
    "Experimentierkasten":  "Doppelrahmen + Dreieck",
    "Warnhinweis":          "roter Rand 2,4 + Scheibe mit Ausrufezeichen",
    "Hinweis Modellgrenze": "Balken links, keine Farbflaeche",
}

# Und was davon MESSBAR an der linken Kante stehen muss, in Einheiten:
#   (Mindestzahl getrennter Tintenstrecken, Mindestbreite des Blocks an der Kante)
# Ein Text allein genuegt nicht - er faellt beim Kopieren mit der Farbe weg.
KENNZEICHEN = {
    "Merkkasten":           (1, 6.0),   # durchgehender Balken (9 Einheiten breit)
    "Experimentierkasten":  (2, 0.5),   # zwei Rahmenlinien mit Luft dazwischen
    "Warnhinweis":          (2, 2.0),   # starker Rand (2,4) + Scheibe daneben
    "Hinweis Modellgrenze": (2, 0.5),   # duenner Rahmen + Balken weiter innen
}


def T(h, x, y, s, f, col, anchor="la"):
    """Einen Textlauf setzen, protokollieren und gegen die cmap halten."""
    if s is None or not str(s).strip():
        return
    art = FONTART.get(id(f), "reg")
    pruefe_zeichen(s, art)
    GESETZT.append((s, art, f.size / S * PT_JE_EINHEIT))
    h.T(x, y, s, f, col, anchor=anchor)


def para(h, x, y, s, f, col, maxw, lh):
    """Linksbuendiger Absatz, KEIN Blocksatz. Gibt das untere Ende zurueck."""
    zeilen = h.wrap(s, f, maxw)
    for i, z in enumerate(zeilen):
        T(h, x, y + i * lh, z, f, col)
    return y + len(zeilen) * lh


def _worte(stuecke, fr, fb):
    """Woerter aus fetten und mageren Stuecken.

    Ein Wort kann BEIDES enthalten: "dargebotsabhaengig." ist fett bis auf den
    Punkt. Wer hier nach Stuecken statt nach Woertern trennt, setzt ein
    Leerzeichen vor den Punkt. Ein Wort ist deshalb eine LISTE von Stuecken."""
    woerter, akt = [], []
    for s, fett in stuecke:
        f = fb if fett else fr
        teile = s.split(" ")
        for i, teil in enumerate(teile):
            if i > 0 and akt:
                woerter.append(akt)
                akt = []
            if teil:
                akt.append((teil, f))
    if akt:
        woerter.append(akt)
    return woerter


def laeufe(text, schluessel):
    """Text in (Stueck, fett?) zerlegen – die Schluesselbegriffe werden fett."""
    stuecke = [(text, False)]
    for k in schluessel:
        if not k:
            continue
        neu = []
        for s, fett in stuecke:
            if fett or k not in s:
                neu.append((s, fett))
                continue
            vor, nach = s.split(k, 1)
            if vor:
                neu.append((vor, False))
            neu.append((k, True))
            if nach:
                neu.append((nach, False))
        stuecke = neu
    return [(s, b) for s, b in stuecke if s]


def zeilen_laeufe(h, stuecke, fr, fb, maxw):
    """Wie viele Zeilen braucht ein Absatz mit fetten Stellen?"""
    cx, n, sp = 0.0, 1, h.tw(" ", fr)
    for wort in _worte(stuecke, fr, fb):
        b = sum(h.tw(t, f) for t, f in wort)
        if cx + b > maxw and cx > 0:
            n += 1
            cx = 0.0
        cx += b + sp
    return n


def setze_laeufe(h, x, y, stuecke, fr, fb, col, maxw, lh):
    cx, cy, sp = x, y, h.tw(" ", fr)
    for wort in _worte(stuecke, fr, fb):
        b = sum(h.tw(t, f) for t, f in wort)
        if cx + b > x + maxw and cx > x:
            cy += lh
            cx = x
        px = cx
        for t, f in wort:
            T(h, px, cy, t, f, col)
            px += h.tw(t, f)
        cx += b + sp
    return cy + lh


# ═════════════════════════════════════════════════════════════════════════════
# 8  ZEICHEN – gezeichnet, nicht gesetzt
#
#    Piktogramme werden GEZEICHNET. "▤" (U+25A4) fehlt SourceSans3, und
#    genau dieses Zeichen druckt in Heft 9 heute ein leeres Kaestchen.
# ═════════════════════════════════════════════════════════════════════════════
def raute(d, cx, cy, r, fill):
    d.polygon([(sc(cx), sc(cy - r)), (sc(cx + r), sc(cy)),
               (sc(cx), sc(cy + r)), (sc(cx - r), sc(cy))], fill=fill)


def dreieck(d, x, cy, b, fill):
    d.polygon([(sc(x), sc(cy - b * 0.62)), (sc(x + b), sc(cy)),
               (sc(x), sc(cy + b * 0.62))], fill=fill)


def schreiblinie(h, y, st=None):
    """Eine Schreiblinie. Gibt das untere Ende des Bausteins zurueck."""
    st = st or STIL
    h.ln([(X0, y + LINIE_GRUNDLINIE), (X1, y + LINIE_GRUNDLINIE)], st["linie"], LINIE_STAERKE)
    return y + LINIE_HOEHE


# ═════════════════════════════════════════════════════════════════════════════
# 9  ABSCHNITTSMARKE UND KOMPETENZCHIP
# ═════════════════════════════════════════════════════════════════════════════
MARKE_KASTEN = 44        # Kantenlaenge des Ziffernkastens, Einheiten


def marke(h, d, y, nr, titel, st=None, chip=None, afb=None, xr=None):
    """Abschnittsmarke: Ziffer im Kasten + Zwischenueberschrift.

    Die Ziffer ist das zweite, farbunabhaengige Merkmal – sie bleibt in der
    Schwarz-Weiss-Kopie stehen."""
    st = st or STIL
    s = MARKE_KASTEN
    h.R(X0, y, X0 + s, y + s, 8, fill=st["akzent"])
    T(h, X0 + s / 2, y + s / 2 + 1, str(nr), schrift("bold", MARKE_ZIFFER),
      st["akzent_schrift"], anchor="mm")
    T(h, X0 + s + 18, y + s / 2, titel, schrift("bold", ZWISCHEN), st["akzent"], anchor="lm")
    # Das Kompetenzkaertchen steht am rechten Rand der TEXTSPALTE, nicht am
    # Blattrand: rechts daneben liegt auf Seite 1 die Randspalte.
    if chip:
        kompchip(h, XT1 if xr is None else xr, y + 7, chip, afb, st)
    return y + s


def kompchip(h, xr, y, code, afb, st=None):
    """Kompetenz und Anforderungsbereich, 10 pt – nicht 6 pt wie im alten Satz."""
    if not code:
        return 0
    st = st or STIL
    f = schrift("med", KLEIN)
    hh = 30
    b = h.tw(code, f) + 26 + ((h.tw(afb, f) + 24) if afb else 0)
    h.R(xr - b, y, xr, y + hh, 7, outline=st["text"], w=1.2)
    if afb:
        trenn = xr - h.tw(afb, f) - 24
        h.ln([(trenn, y + 5), (trenn, y + hh - 5)], st["text"], 1)
        T(h, (trenn + xr) / 2, y + hh / 2, afb, f, st["text"], anchor="mm")
        T(h, (xr - b + trenn) / 2, y + hh / 2, code, f, st["text"], anchor="mm")
    else:
        T(h, xr - b / 2, y + hh / 2, code, f, st["text"], anchor="mm")
    return b


# ═════════════════════════════════════════════════════════════════════════════
# 10  DIE VIER KASTENARTEN
#
#     Jeder Kasten traegt neben der Farbe ein zweites, farbunabhaengiges
#     Merkmal. Die Schwarz-Weiss-Probe im Selbsttest haengt genau daran:
#     Merkkasten und Experimentierkasten unterscheiden sich im Graustufendruck
#     um EINEN von 255 Grauwerten – ohne Balken und Dreieck waeren sie gleich.
# ═════════════════════════════════════════════════════════════════════════════
def luecke_breite(h, m, f):
    return max(einheiten(LUECKE_MIN), h.tw(m["loesung"], f) + einheiten(LUECKE_LUFT))


def luecken_satz(h, x, y, m, st, maxw):
    """Merksatz mit Luecke; die Luecke ist so breit wie die Loesung plus Luft."""
    f = schrift("reg", MERK)
    tok = [("t", w) for w in m["pre"].split()] + [("gap", luecke_breite(h, m, f))] \
        + [("t", w) for w in m["post"].split()]
    for art, v in tok:
        if art == "t":
            pruefe_zeichen(v, "reg")
            GESETZT.append((v, "reg", f.size / S * PT_JE_EINHEIT))
    return h.flow(x, y, maxw, LH, f, st["text"], tok, st["linie"])


def _kante(x0, x1):
    """Linke und rechte Kante eines Kastens. Voreinstellung: die Textspalte."""
    return (KASTEN_X0 if x0 is None else x0), (KASTEN_X1 if x1 is None else x1)


def kasten_merk(h, d, y, st, ueberschrift, absaetze, luecken, x0=None, x1=None):
    """Merkkasten: Flaeche + Balken links + Raute + Ueberschrift (4 Merkmale)."""
    st = st or STIL
    kx0, kx1 = _kante(x0, x1)
    innen, balken = 26, 9
    xi = kx0 + balken + innen
    bw = kx1 - innen - xi
    fr, fb = schrift("reg", FLIESS), schrift("bold", FLIESS)
    kopf = 20 + einheiten(KASTEN_KOPF) + 12
    hoehe = kopf
    for text, sch in absaetze:
        hoehe += zeilen_laeufe(h, laeufe(text, sch), fr, fb, bw) * LH + 12
    if luecken:
        hoehe += 6
        for m in luecken:
            hoehe += h.gaphoehe(bw, LH, fr, m["pre"], m["post"],
                                luecke_breite(h, m, fr)) + 10
    hoehe += 12
    h.R(kx0, y, kx1, y + hoehe, 10, fill=st["merk_grund"], outline=st["akzent"], w=1.4)
    h.R(kx0, y, kx0 + balken, y + hoehe, 4, fill=st["akzent"])
    raute(d, xi + 9, y + 20 + einheiten(KASTEN_KOPF) * MITTE_DER_KOPFZEILE, 9, st["akzent"])
    T(h, xi + 28, y + 20, ueberschrift, schrift("bold", KASTEN_KOPF), st["akzent"])
    yy = y + kopf
    for text, sch in absaetze:
        yy = setze_laeufe(h, xi, yy, laeufe(text, sch), fr, fb, st["text"], bw, LH) + 12
    if luecken:
        yy += 6
        for m in luecken:
            yy = luecken_satz(h, xi, yy, m, st, bw) + 10
    KAESTEN.append((None, "Merkkasten", kx0, y, kx1, y + hoehe, MERKMAL["Merkkasten"]))
    return y + hoehe


def kasten_experiment(h, d, y, st, text, x0=None, x1=None):
    """Experimentierkasten: Flaeche + Doppelrahmen + Dreieck (3 Merkmale)."""
    st = st or STIL
    kx0, kx1 = _kante(x0, x1)
    innen = 26
    xi = kx0 + innen + 36
    bw = kx1 - innen - xi
    zeilen = h.wrap(text, schrift("reg", FLIESS), bw)
    hoehe = 20 + len(zeilen) * LH + 18
    h.R(kx0, y, kx1, y + hoehe, 10, fill=st["exp_grund"], outline=st["akzent"], w=1.6)
    h.R(kx0 + 7, y + 7, kx1 - 7, y + hoehe - 7, 7, outline=st["akzent"], w=0.9)
    dreieck(d, kx0 + innen + 8, y + 20 + LH * 0.36, 15, st["akzent"])
    for i, z in enumerate(zeilen):
        T(h, xi, y + 20 + i * LH, z, schrift("reg", FLIESS), st["text"])
    KAESTEN.append((None, "Experimentierkasten", kx0, y, kx1, y + hoehe,
                    MERKMAL["Experimentierkasten"]))
    return y + hoehe


def kasten_warnung(h, d, y, st, text, x0=None, x1=None):
    """Warnung: weisser Grund, roter Rand 2,4, rote Scheibe mit '!'.

    Rot steht als Rand und Zeichen – nie als Flaeche unter langem Text."""
    st = st or STIL
    kx0, kx1 = _kante(x0, x1)
    innen = 26
    xi = kx0 + innen + 50
    bw = kx1 - innen - xi
    zeilen = h.wrap(text, schrift("med", FLIESS), bw)
    hoehe = max(70, 20 + len(zeilen) * LH + 18)
    h.R(kx0, y, kx1, y + hoehe, 10, fill=st["kasten_weiss"], outline=st["warn"], w=2.4)
    h.circ(kx0 + innen + 16, y + hoehe / 2, 16, fill=st["warn"])
    T(h, kx0 + innen + 16, y + hoehe / 2 + 1, "!", schrift("bold", FLIESS),
      GRUND, anchor="mm")
    y0 = y + (hoehe - len(zeilen) * LH) / 2 + 2
    for i, z in enumerate(zeilen):
        T(h, xi, y0 + i * LH, z, schrift("med", FLIESS), st["text"])
    KAESTEN.append((None, "Warnhinweis", kx0, y, kx1, y + hoehe, MERKMAL["Warnhinweis"]))
    return y + hoehe


def kasten_hinweis(h, d, y, st, text, x0=None, x1=None):
    """Modellgrenze: weisser Grund, duenner Rahmen, Balken – kein Farbsignal."""
    st = st or STIL
    kx0, kx1 = _kante(x0, x1)
    innen = 26
    xi = kx0 + innen + 30
    bw = kx1 - innen - xi
    zeilen = h.wrap(text, schrift("reg", FLIESS), bw)
    hoehe = 18 + len(zeilen) * LH + 16
    h.R(kx0, y, kx1, y + hoehe, 10, fill=st["kasten_weiss"], outline=st["linie"], w=1.2)
    h.R(kx0 + 12, y + 14, kx0 + 17, y + hoehe - 14, 2, fill=st["linie"])
    for i, z in enumerate(zeilen):
        T(h, xi, y + 18 + i * LH, z, schrift("reg", FLIESS), st["text"])
    KAESTEN.append((None, "Hinweis Modellgrenze", kx0, y, kx1, y + hoehe,
                    MERKMAL["Hinweis Modellgrenze"]))
    return y + hoehe


# ═════════════════════════════════════════════════════════════════════════════
# 11  TABELLE – Zellen brechen UM, sie werden nicht verkleinert
# ═════════════════════════════════════════════════════════════════════════════
def tabelle(h, d, y, st, kopf, zeilen, anteile=None, min_rh=None, x0=None, x1=None):
    st = st or STIL
    tx0, tx1 = _kante(x0, x1)
    n = len(kopf)
    anteile = anteile or [1.0 / n] * n
    breite = tx1 - tx0
    xs = [tx0]
    for a in anteile[:-1]:
        xs.append(xs[-1] + breite * a)
    fk, fz = schrift("bold", FLIESS), schrift("reg", FLIESS)

    def zell(i, s, f):
        return h.wrap(s, f, breite * anteile[i] - 32)

    kopfz = [zell(i, k, fk) for i, k in enumerate(kopf)]
    kh = max(einheiten(TAB_KOPF_MIN), max(len(z) for z in kopfz) * LH + 16)
    rhs = []
    for zl in zeilen:
        zs = list(zl) if isinstance(zl, (list, tuple)) else [zl] + [""] * (n - 1)
        rhs.append(max(min_rh or einheiten(TAB_ZEILE_MIN),
                       max(len(zell(i, s, fz)) for i, s in enumerate(zs)) * LH + 14))
    tot = kh + sum(rhs)
    d.rectangle([sc(tx0), sc(y), sc(tx1), sc(y + kh)], fill=st["merk_grund"])
    for i, zl in enumerate(kopfz):
        for j, z in enumerate(zl):
            T(h, xs[i] + 16, y + (kh - len(zl) * LH) / 2 + 3 + j * LH, z, fk, st["text"])
    ry = y + kh
    for r, zl in enumerate(zeilen):
        zs = list(zl) if isinstance(zl, (list, tuple)) else [zl] + [""] * (n - 1)
        if r > 0:
            h.ln([(tx0, ry), (tx1, ry)], st["zart"], 1)
        for i, s in enumerate(zs):
            zz = zell(i, s, fz)
            for j, z in enumerate(zz):
                T(h, xs[i] + 16, ry + (rhs[r] - len(zz) * LH) / 2 + 3 + j * LH, z, fz, st["text"])
        ry += rhs[r]
    for i in range(1, n):
        h.ln([(xs[i], y), (xs[i], y + tot)], st["zart"], 1)
    h.ln([(tx0, y + kh), (tx1, y + kh)], st["akzent"], 1.4)
    h.R(tx0, y, tx1, y + tot, 8, outline=st["akzent"], w=1.4)
    return y + tot


# ═════════════════════════════════════════════════════════════════════════════
# 12  SEITENRAHMEN
# ═════════════════════════════════════════════════════════════════════════════
def seitenrahmen(h, d, st, kopf_links, kopf_rechts, titel, seite, gesamt, pn,
                 fusstext="FeLabs Physik · Forscherheft"):
    st = st or STIL
    f = schrift("reg", KLEIN)
    T(h, X0, KOPF_Y, kopf_links, f, st["text"])
    if kopf_rechts:
        T(h, X1, KOPF_Y, kopf_rechts, f, st["text"], anchor="ra")
    h.ln([(X0, KOPFLINIE_Y), (X1, KOPFLINIE_Y)], st["zart"], 1.2)
    if seite > 0:
        T(h, X0, OBEN, titel + " · Fortsetzung", schrift("bold", FLIESS), st["h1"])
        h.ln([(X0, OBEN + LH + 8), (X1, OBEN + LH + 8)], st["zart"], 1.2)
    h.ln([(X0, FUSSLINIE_Y), (X1, FUSSLINIE_Y)], st["zart"], 1.2)
    T(h, X0, FUSS_Y, fusstext, f, st["text"])
    T(h, X1, FUSS_Y, "%d" % (pn + seite), schrift("bold", KLEIN), st["text"], anchor="ra")
    if gesamt > 1:
        T(h, (X0 + X1) / 2, FUSS_Y, "Seite %d von %d dieser Einheit" % (seite + 1, gesamt),
          f, st["text"], anchor="ma")


# ═════════════════════════════════════════════════════════════════════════════
# 13  BAUSTEINE: MESSEN UND UMBRECHEN
# ═════════════════════════════════════════════════════════════════════════════
ABS_ABSCHNITT = 44      # vor einer neuen Abschnittsmarke
ABS_AUFGABE   = 24      # zwischen Aufgaben und Kaesten
ABS_ZEILE     = 16


class Baustein:
    __slots__ = ("name", "f", "abstand", "haftet")

    def __init__(self, name, f, abstand=ABS_ZEILE, haftet=0):
        # haftet = wie viele FOLGENDE Bausteine mit auf dieselbe Seite muessen.
        # Eine Ueberschrift allein am Seitenfuss ist ein Satzfehler, und eine
        # Aufgabe ohne wenigstens zwei Schreiblinien darunter auch.
        # Es genuegt, die NAECHSTE Stufe zu nennen: umbrechen() rechnet die
        # Klammerung ueber verklammern() durch, haelt der Gehaltene selbst noch
        # etwas fest, erbt der Haltende dessen Reichweite mit.
        self.name, self.f, self.abstand, self.haftet = name, f, abstand, int(haftet)


def messe_bausteine(B, st, hoehe=2600):
    """Hoehe jedes Bausteins – gemessen, indem er wirklich gezeichnet wird.

    So kann die Rechnung nicht von der Zeichnung abweichen. Der Probelauf wird
    aus allen Protokollen wieder herausgeschnitten, sonst zaehlte jeder Lauf
    doppelt."""
    st = st or STIL
    im = Image.new("RGB", (sc(W), sc(hoehe)), st["grund"])
    d = ImageDraw.Draw(im, "RGBA")
    h = hp(im, d)
    n_t, n_g, n_k = len(bf.TEXTE), len(GESETZT), len(KAESTEN)
    hoehen = [b.f(h, d, 40.0) - 40.0 for b in B]
    del bf.TEXTE[n_t:]
    del GESETZT[n_g:]
    del KAESTEN[n_k:]
    return hoehen


def verklammern(B):
    """`haftet` DURCHGEHEND rechnen: wie weit reicht die Klammer wirklich?

    `haftet` sagt, wie viele folgende Bausteine mit auf dieselbe Seite muessen.
    Diese Angabe ist aber nur EINE Stufe tief, und eine Klammer haelt eine
    andere: Haelt die Abschnittsmarke die Aufgabenfrage und die Frage ihre zwei
    Schreiblinien, dann passen Marke + Frage zusammen aufs Blatt - die Marke
    wird gesetzt, und erst danach faellt die Frage samt Linien auf die naechste
    Seite. Die Ueberschrift bleibt allein am Seitenfuss zurueck.
    Gemessen: In allen VIER Kapiteltests von Band 8 stand "4 Erkläre in ganzen
    Sätzen." allein als letzte Zeile.

    Gerechnet wird von rechts nach links, damit jede Kette schon geschlossen
    ist, wenn die davorliegende sie einsammelt. Zurueck kommt eine LISTE der
    tatsaechlichen Reichweiten - B bleibt unveraendert, damit derselbe Bauplan
    mehrfach umbrochen werden kann (einpassen() tut genau das).

    Ein Baustein mit haftet=0 behaelt die 0: er haelt nichts fest, also darf er
    auch nichts erben. Nur so bleibt "haftet" ein Merkmal des Bausteins und
    nicht des Zufalls, wer hinter ihm steht."""
    n = len(B)
    ende = list(range(n))
    for i in range(n - 1, -1, -1):
        if not B[i].haftet:
            continue
        e = min(i + B[i].haftet, n - 1)
        j = i + 1
        while j <= e:
            e = max(e, ende[j])
            j += 1
        ende[i] = e
    return [ende[i] - i for i in range(n)]


def umbrechen(B, hoehen, oben=None, unten=None, forts=None, reichweite=None):
    """Greedy-Umbruch mit Schutz vor der alleinstehenden Ueberschrift.

    `reichweite` ueberschreibt die durchgerechnete Klammerung. Gebraucht wird
    das nur vom Selbsttest, der damit den Zustand VOR der Reparatur nachstellt
    und nachweist, dass Probe 5 ohne sie durchfaellt."""
    oben = OBEN if oben is None else oben
    unten = UNTEN if unten is None else unten
    forts = FORTS if forts is None else forts
    haelt = verklammern(B) if reichweite is None else list(reichweite)
    seiten = [[]]
    y = oben
    erste = True
    for i, b in enumerate(B):
        noetig = hoehen[i]
        for k in range(1, haelt[i] + 1):
            if i + k < len(B):
                noetig += B[i + k - 1].abstand + hoehen[i + k]
        if y + noetig > unten and not erste:
            seiten.append([])
            y = oben + forts
            erste = True
        seiten[-1].append((i, y))
        y += hoehen[i] + b.abstand
        erste = False
    return seiten


def schreibraum_auffuellen(B, hoehen, seiten, st, praefix="Schreiblinie"):
    """Bleibt auf der LETZTEN Seite Platz, bekommt ihn der Schreibraum.

    Weissraum unten hilft niemandem, eine Zeile mehr schon. Hoechstens neun
    Zeilen – sonst faengt eine fast leere letzte Seite dreissig Linien ein und
    die Messung sieht besser aus, als sie ist."""
    st = st or STIL
    idx = [i for i, b in enumerate(B) if b.name.startswith(praefix)]
    if not idx:
        return B, hoehen, seiten
    letzte = seiten[-1]
    i_letzt, y_letzt = letzte[-1]
    frei = UNTEN - (y_letzt + hoehen[i_letzt])
    extra = min(LINIEN_NACHSCHLAG_MAX, int(frei // LINIE_HOEHE))
    if extra <= 0:
        return B, hoehen, seiten

    def b_linie(h, d, y):
        return schreiblinie(h, y, st)

    ein = idx[-1] + 1
    alt = B[idx[-1]].abstand
    B[idx[-1]].abstand = 0
    for k in range(extra):
        B.insert(ein + k, Baustein("%s %d (Rest)" % (praefix, k + 1), b_linie, abstand=0))
        hoehen.insert(ein + k, LINIE_HOEHE)
    B[ein + extra - 1].abstand = alt
    neu = umbrechen(B, hoehen)
    if len(neu) != len(seiten):          # haette eine Seite gekostet: zuruecknehmen
        del B[ein:ein + extra]
        del hoehen[ein:ein + extra]
        B[idx[-1]].abstand = alt
        return B, hoehen, seiten
    return B, hoehen, neu


# ═════════════════════════════════════════════════════════════════════════════
# 14  SELBSTTEST
#
#     Sechs Proben. Ohne bestandenen Selbsttest darf das Modul nicht benutzt
#     werden – der Import laesst es nicht zu. Jede Probe misst; keine glaubt
#     einem Kommentar.
#
#     Proben 5 und 6 pruefen zusaetzlich SICH SELBST: Sie stellen den Zustand
#     vor der Reparatur nach und verlangen, dass sie darin durchfallen. Eine
#     Probe, die auch am kaputten Fall gruen meldet, prueft nichts – genau so
#     hat heft_gegen_sim.py monatelang geschwiegen.
# ═════════════════════════════════════════════════════════════════════════════
def _kontrastpaare():
    """(Rolle, vorn, hinten, Grad in pt oder None fuer ein Grafikelement)."""
    return [
        ("Fliesstext",                  TEXT,           GRUND,      FLIESS),
        ("Kolumnentitel, Quelle",       TEXT,           GRUND,      KLEIN),
        ("Hauptueberschrift",           TITEL,          GRUND,      HAUPT),
        ("Zwischenueberschrift",        AKZENT,         GRUND,      ZWISCHEN),
        ("Ziffer in der Marke",         AKZENT_SCHRIFT, AKZENT,     MARKE_ZIFFER),
        ("Text im Merkkasten",          TEXT,           MERK_GRUND, FLIESS),
        ("Ueberschrift Merkkasten",     AKZENT,         MERK_GRUND, KASTEN_KOPF),
        ("Text im Experimentkasten",    TEXT,           EXP_GRUND,  FLIESS),
        ("Text im Tabellenkopf",        TEXT,           MERK_GRUND, FLIESS),
        ("Ausrufezeichen auf Rot",      GRUND,          WARN,       FLIESS),
        ("Merksatz mit Luecke",         TEXT,           MERK_GRUND, MERK),
        # Grafikelemente, Soll 3:1 nach WCAG 1.4.11
        ("Warnrand",                    WARN,           GRUND,      None),
        ("Schreiblinie",                LINIE,          GRUND,      None),
        ("Rahmen und Balken",           AKZENT,         GRUND,      None),
    ]


# Ausdrueckliche Ausnahme: keine Bedeutung, deshalb ohne Sollwert – aber
# gemessen und gemeldet, damit sie niemand vergisst.
ZIERLINIEN = [("Innenlinie der Tabelle, Kopf-/Fusslinie", ZART, GRUND)]

KONTRASTPAARE = _kontrastpaare()

_TEST_HOEHE = 1400
_PROBE_FEHLT = "Symbolprobe ▤ Ende"     # U+25A4 fehlt SourceSans3
_PROBE_GUT = "Prüfsatz mit Umlauten, Pfeil → und H₂O bei 20 °C"


def _testblatt():
    im = Image.new("RGB", (sc(W), sc(_TEST_HOEHE)), GRUND)
    d = ImageDraw.Draw(im, "RGBA")
    return im, d, hp(im, d)


def _grundgrau(grau, x0, y0, x1, y1):
    """Median des Kastengrunds in einem textfreien Streifen rechts oben."""
    px = grau.load()
    bw, bh = grau.size
    werte = []
    for yy in range(int((y0 + 8) * S), min(int((y0 + 30) * S), int((y1 - 4) * S))):
        for xx in range(int((x1 - 72) * S), int((x1 - 14) * S)):
            if 0 <= xx < bw and 0 <= yy < bh:
                werte.append(px[xx, yy])
    werte.sort()
    return werte[len(werte) // 2] if werte else 255


_PROBEFENSTER = 32      # Einheiten ab der linken Kastenkante – textfrei


def _kennprofil(grau, x0, y0, x1, y1, grund):
    """Welche farbunabhaengigen Merkmale traegt der Kasten an der linken Kante?

    Gemessen an einer waagerechten Abtastlinie auf halber Hoehe: Anfang und
    Laenge jeder Tintenstrecke in den ersten 32 Einheiten, in Pixeln. Das
    Fenster ist textfrei (der frueheste Textanfang liegt bei 35 Einheiten),
    das Profil haengt also nur an den gezeichneten Merkmalen."""
    px = grau.load()
    bw, bh = grau.size
    ym = int(round((y0 + y1) / 2 * S))
    if not (0 <= ym < bh):
        return ()
    strecken, start = [], None
    n = int(_PROBEFENSTER * S)
    for e in range(n):
        xx = int(x0 * S) + e
        dunkel = 0 <= xx < bw and abs(px[xx, ym] - grund) > 20
        if dunkel and start is None:
            start = e
        elif not dunkel and start is not None:
            strecken.append((start, e - start))
            start = None
    if start is not None:
        strecken.append((start, n - start))
    # Ein Pixel Luft ist eine Kantenglaettung, kein Zwischenraum: der Balken
    # des Merkkastens misst sonst zweimal 9 statt einmal 19 Pixel.
    verschmolzen = []
    for a, l in strecken:
        if verschmolzen and a - (verschmolzen[-1][0] + verschmolzen[-1][1]) < 2:
            v0, vl = verschmolzen[-1]
            verschmolzen[-1] = (v0, a + l - v0)
        else:
            verschmolzen.append((a, l))
    return tuple(verschmolzen)


def _kantenblock(profil):
    """Wie breit ist der Tintenblock unmittelbar an der linken Kante, in Einheiten?"""
    if not profil or profil[0][0] > 1:
        return 0.0
    return profil[0][1] / float(S)


def _profil_gleich(a, b, tol=2):
    if len(a) != len(b):
        return False
    return all(abs(x0 - y0) <= tol and abs(l0 - m0) <= tol
               for (x0, l0), (y0, m0) in zip(a, b))


# ── Probe 5: haelt die Klammerung ueber zwei Stufen? ────────────────────────
# Fuenf Bausteine ohne Zwischenraum auf einer 100 Einheiten hohen Seite. Die
# Fuellung nimmt 40, dann folgt die Kette Marke -> Frage -> zwei Schreiblinien.
# Marke + Frage passen zusammen noch aufs Blatt (40+20+20 = 80) - genau daran
# ist der alte Umbruch gescheitert.
_KLAMMER_OBEN, _KLAMMER_UNTEN = 0.0, 100.0
_KLAMMER_HOEHEN = [40.0, 20.0, 20.0, 20.0, 20.0]


def _klammerbauplan():
    def leer(h, d, y):
        return y                     # Probe 5 misst den Umbruch, nicht das Bild
    return [Baustein("Fuellung",       leer, abstand=0),
            Baustein("Marke",          leer, abstand=0, haftet=1),
            Baustein("Aufgabenfrage",  leer, abstand=0, haftet=2),
            Baustein("Schreiblinie 1", leer, abstand=0),
            Baustein("Schreiblinie 2", leer, abstand=0)]


def _waisen(B, seiten):
    """Welche Bausteine stehen am Fuss einer Seite und halten noch etwas fest?"""
    return [B[s[-1][0]].name for s in seiten[:-1] if s and B[s[-1][0]].haftet]


# ── Probe 6: wie lang wird eine gesetzte Zeile im Kasten wirklich? ──────────
_LANGTEXT = ("Die elektrische Spannung ist der Antrieb im Stromkreis: Sie schiebt die "
             "Ladungen durch den Leiter, und je größer sie ist, desto mehr Ladungen "
             "kommen in derselben Zeit an der Lampe an. Gemessen wird die Spannung in "
             "Volt, die Stromstärke dagegen in Ampere; beide gehören zusammen und "
             "werden im Versuch immer gemeinsam abgelesen und aufgeschrieben.")


def _gesetzte_zeilen(bauen, zusammenziehen=True):
    """Welche Zeilen setzt dieser Baustein WIRKLICH? Gemessen, nicht gerechnet.

    T() wird fuer die Dauer des Aufrufs abgehoert. Ein Merkkasten setzt seine
    Absaetze Wort fuer Wort (fette Stellen!) - die Laeufe auf derselben
    Grundlinie muessen deshalb wieder zu einer Zeile zusammengezogen werden.
    Eine Tabelle nicht: dort steht auf einer Grundlinie je Spalte eine eigene
    Zelle, und die liest niemand in einem Zug."""
    echt = globals()["T"]
    mit = []

    def merken(h, x, y, s, f, col, anchor="la"):
        if s is not None and str(s).strip():
            mit.append((round(float(y), 1), float(x), str(s)))
        return echt(h, x, y, s, f, col, anchor=anchor)

    globals()["T"] = merken
    try:
        bauen()
    finally:
        globals()["T"] = echt
    if not zusammenziehen:
        return [s for _y, _x, s in mit]
    nach_y = {}
    for y, x, s in mit:
        nach_y.setdefault(y, []).append((x, s))
    return [" ".join(s for _x, s in sorted(v)) for v in nach_y.values()]


def _kastenproben(x1):
    """Die vier Kastenarten und eine Tabelle, alle mit demselben langen Text.

    Die Tabelle steht EINSPALTIG da - das ist ihr breitester Fall und damit der
    einzige, an dem sich eine Obergrenze pruefen laesst. Mit zwei Spalten liegt
    jede Zelle schon von sich aus unter 50 Zeichen; sie wuerde die Probe
    bestehen, auch wenn die Tabelle ueber das ganze Blatt liefe."""
    return [
        ("Merkkasten", True, lambda h, d: kasten_merk(
            h, d, 40.0, STIL, "Das musst du mitnehmen",
            [(_LANGTEXT, ["Spannung", "Stromstärke"])], [], x1=x1)),
        ("Experimentierkasten", True, lambda h, d: kasten_experiment(
            h, d, 40.0, STIL, _LANGTEXT, x1=x1)),
        ("Warnhinweis", True, lambda h, d: kasten_warnung(
            h, d, 40.0, STIL, _LANGTEXT, x1=x1)),
        ("Hinweis Modellgrenze", True, lambda h, d: kasten_hinweis(
            h, d, 40.0, STIL, _LANGTEXT, x1=x1)),
        ("Tabelle (einspaltig)", False, lambda h, d: tabelle(
            h, d, 40.0, STIL, ["Was du beobachtest"], [[_LANGTEXT]], [1.0], x1=x1)),
    ]


def _laengste_zeilen(x1):
    """Laengste gesetzte Zeile je Kastenart, in Zeichen."""
    aus = {}
    for name, ziehen, bauen in _kastenproben(x1):
        im, d, h = _testblatt()
        n_g, n_t, n_k = len(GESETZT), len(bf.TEXTE), len(KAESTEN)
        zeilen = _gesetzte_zeilen(lambda: bauen(h, d), ziehen)
        del GESETZT[n_g:]
        del bf.TEXTE[n_t:]
        del KAESTEN[n_k:]
        aus[name] = max((len(z) for z in zeilen), default=0)
    return aus


def selbsttest(laut=False):
    """Sechs Proben. Gibt (bestanden, Zeilen) zurueck."""
    global _IM_TEST
    _IM_TEST = True
    Z, fehler = [], []
    # Der Selbsttest SETZT, um zu messen - und muss danach spurlos verschwinden.
    # bf.TEXTE traegt die unsichtbare, durchsuchbare Textebene: zwei vergessene
    # Probesaetze standen sonst in jedem Band unsichtbar auf Seite 1.
    n_t0, n_g0, n_k0 = len(bf.TEXTE), len(GESETZT), len(KAESTEN)
    try:
        # ── Probe 1: Kontraste ──────────────────────────────────────────────
        Z.append("PROBE 1  Kontrast jedes Farbwerts gegen seinen Grund (WCAG 2.1)")
        Z.append("  %-28s %-9s %-9s %6s %5s %s" % ("Rolle", "vorn", "hinten", "Wert", "Soll", ""))
        for rolle, v, hg, grad in KONTRASTPAARE:
            soll = 3.0 if (grad is None or grad >= 18) else 4.5
            k = kontrast(v, hg)
            ok = k >= soll
            if not ok:
                fehler.append("Kontrast %s: %.2f unter %.1f" % (rolle, k, soll))
            Z.append("  %-28s %-9s %-9s %6.2f  %4.1f  %s"
                     % (rolle + ("" if grad is None else " %g pt" % grad),
                        hexf(v), hexf(hg), k, soll, "ok" if ok else "DURCHGEFALLEN"))
        for rolle, v, hg in ZIERLINIEN:
            Z.append("  %-28s %-9s %-9s %6.2f    –  Zierde, ohne Sollwert (benannte Ausnahme)"
                     % (rolle, hexf(v), hexf(hg), kontrast(v, hg)))

        # ── Probe 2: Zeichenpruefung, beide Richtungen ──────────────────────
        Z.append("")
        Z.append("PROBE 2  Zeichenpruefung – eine kaputte und eine gute Kette")
        im, d, h = _testblatt()
        with warnings.catch_warnings(record=True) as w1:
            warnings.simplefilter("always")
            T(h, X0, 40, _PROBE_FEHLT, schrift("reg", FLIESS), TEXT)
        traf = [x for x in w1 if issubclass(x.category, ZeichenFehlt)]
        if not traf:
            fehler.append("kein Alarm bei fehlendem Zeichen U+25A4")
        Z.append("  fehlendes Zeichen U+25A4  -> %d Warnung(en)  %s"
                 % (len(traf), "ok" if traf else "DURCHGEFALLEN (still gedruckt)"))
        with warnings.catch_warnings(record=True) as w2:
            warnings.simplefilter("always")
            T(h, X0, 80, _PROBE_GUT, schrift("reg", FLIESS), TEXT)
        falsch = [x for x in w2 if issubclass(x.category, ZeichenFehlt)]
        if falsch:
            fehler.append("Fehlalarm bei einer sauberen Kette: %s" % falsch[0].message)
        Z.append("  saubere Kette (ä ö ü ß → ₂ °)  -> %d Warnung(en)  %s"
                 % (len(falsch), "ok" if not falsch else "FEHLALARM"))
        del GESETZT[-2:]

        # ── Probe 3: Groessentafel ──────────────────────────────────────────
        Z.append("")
        Z.append("PROBE 3  Groessentafel – nichts unter %.0f pt" % GRAD_UNTERGRENZE)
        for name in sorted(GROESSEN, key=lambda k: -GROESSEN[k]):
            g = GROESSEN[name]
            gd = gedruckt(g)
            ok = g >= GRAD_UNTERGRENZE and gd >= GRAD_UNTERGRENZE
            if not ok:
                fehler.append("Groesse %s: %.2f pt unter %.0f pt" % (name, min(g, gd), GRAD_UNTERGRENZE))
            Z.append("  %-13s Soll %6.2f pt  =  %6.2f Einheiten  ->  gedruckt %5.2f pt  %s"
                     % (name, g, einheiten(g), gd, "ok" if ok else "DURCHGEFALLEN"))
        Z.append("  Zeilenabstand %.2f x %g pt = %.2f Einheiten = %.2f pt"
                 % (ZAB, FLIESS, LH, punkt(LH)))

        # ── Probe 4: Schwarz-Weiss-Probe der vier Kastenarten ───────────────
        Z.append("")
        Z.append("PROBE 4  Vier Kastenarten in Graustufen – trennt sie das zweite Merkmal?")
        im, d, h = _testblatt()
        n_k = len(KAESTEN)
        n_g = len(GESETZT)
        n_t = len(bf.TEXTE)
        y = 40.0
        y = kasten_merk(h, d, y, STIL, "Das musst du mitnehmen",
                        [("Die Spannung treibt den Strom durch den Leiter.", ["Spannung"])],
                        [{"pre": "Die Einheit der Spannung ist das", "post": ".",
                          "loesung": "Volt"}]) + 24
        y = kasten_experiment(h, d, y, STIL,
                              "Öffne die Simulation und trage deine Messwerte ein.") + 24
        y = kasten_warnung(h, d, y, STIL,
                           "Stecke niemals ein Amperemeter allein in die Steckdose.") + 24
        y = kasten_hinweis(h, d, y, STIL,
                           "Das Modell zeigt nur den Stromkreis, nicht die Waerme.") + 24
        grau = im.convert("L")
        gemessen = {}
        for _s, art, x0, y0, x1, y1, merkmal in KAESTEN[n_k:]:
            g = _grundgrau(grau, x0, y0, x1, y1)
            gemessen[art] = (g, _kennprofil(grau, x0, y0, x1, y1, g), merkmal)
        del KAESTEN[n_k:]
        del GESETZT[n_g:]
        del bf.TEXTE[n_t:]
        # 4a  Traegt jeder Kasten sein deklariertes zweites Merkmal wirklich?
        for art in sorted(gemessen):
            g, prof, merkmal = gemessen[art]
            n_soll, block_soll = KENNZEICHEN.get(art, (1, 0.0))
            block = _kantenblock(prof)
            ok = len(prof) >= n_soll and block >= block_soll
            if not ok:
                fehler.append("%s traegt sein zweites Merkmal nicht: %d Strecke(n) "
                              "(Soll %d), Block an der Kante %.1f (Soll %.1f) – %s"
                              % (art, len(prof), n_soll, block, block_soll, merkmal))
            Z.append("  %-21s Grau %3d  %d Strecke(n) (Soll %d)  Kantenblock %4.1f (Soll %4.1f)  %s  %s"
                     % (art, g, len(prof), n_soll, block, block_soll,
                        "ok" if ok else "FEHLT", merkmal))
        # 4b  Und trennt es zwei Kaesten, deren Grund im Graustufendruck gleich aussieht?
        arten = sorted(gemessen)
        for i in range(len(arten)):
            for j in range(i + 1, len(arten)):
                a, b = arten[i], arten[j]
                dg = abs(gemessen[a][0] - gemessen[b][0])
                gleich = _profil_gleich(gemessen[a][1], gemessen[b][1])
                if dg < 8 and gleich:
                    fehler.append("%s und %s sind in Graustufen nicht zu trennen "
                                  "(Delta %d, gleiches Kennprofil)" % (a, b, dg))
                Z.append("  %-21s gegen %-21s Delta %3d  ->  %s"
                         % (a, b, dg,
                            ("schon am Grund zu trennen" if dg >= 8 else
                             ("nur am zweiten Merkmal – und das trennt" if not gleich
                              else "NICHT ZU TRENNEN"))))

        # ── Probe 5: haelt die Klammerung ueber ZWEI Stufen? ────────────────
        Z.append("")
        Z.append("PROBE 5  Klammerung ueber zwei Stufen – bleibt die Marke allein unten stehen?")
        B = _klammerbauplan()
        reich = verklammern(B)
        seiten = umbrechen(B, _KLAMMER_HOEHEN, _KLAMMER_OBEN, _KLAMMER_UNTEN, 0.0)
        waisen = _waisen(B, seiten)
        if waisen:
            fehler.append("Klammerung haelt nicht ueber zwei Stufen: %s steht allein "
                          "am Seitenfuss" % ", ".join(waisen))
        Z.append("  genannt  %s" % " ".join("%s=%d" % (b.name.split()[0], b.haftet) for b in B))
        Z.append("  gerechnet %s" % " ".join("%s=%d" % (b.name.split()[0], r)
                                             for b, r in zip(B, reich)))
        Z.append("  Umbruch  %s  ->  %s"
                 % (" | ".join("Seite %d: %s" % (k + 1, " ".join(B[i].name.split()[0]
                                                                for i, _y in s))
                               for k, s in enumerate(seiten)),
                    "ok, keine einsame Ueberschrift" if not waisen
                    else "DURCHGEFALLEN: " + ", ".join(waisen)))
        # Und hat die Probe ueberhaupt Zaehne? Derselbe Bauplan mit der alten,
        # nur EINE Stufe tiefen Klammerung MUSS die Waise erzeugen. Sonst prueft
        # Probe 5 nichts und meldet trotzdem gruen.
        alt = umbrechen(B, _KLAMMER_HOEHEN, _KLAMMER_OBEN, _KLAMMER_UNTEN, 0.0,
                        reichweite=[b.haftet for b in B])
        alt_waisen = _waisen(B, alt)
        if not alt_waisen:
            fehler.append("Probe 5 hat keine Zaehne: auch ohne die Reparatur entsteht "
                          "keine einsame Ueberschrift – die Probe prueft nichts")
        Z.append("  Gegenprobe (Klammerung nur eine Stufe tief, Stand vor der Reparatur):")
        Z.append("     %s  ->  %s"
                 % (" | ".join("Seite %d: %s" % (k + 1, " ".join(B[i].name.split()[0]
                                                                 for i, _y in s))
                               for k, s in enumerate(alt)),
                    ("faellt durch an '%s' – die Probe hat Zaehne" % ", ".join(alt_waisen))
                    if alt_waisen else "OHNE BEFUND – die Probe prueft nichts"))

        # ── Probe 6: Zeilenlaenge jedes Kastens gegen die Obergrenze ────────
        Z.append("")
        Z.append("PROBE 6  Gesetzte Zeilenlaenge jedes Kastens – hoechstens %d Zeichen"
                 % ZEICHEN_MAX)
        eng = _laengste_zeilen(None)          # Voreinstellung: die Textspalte
        weit = _laengste_zeilen(X1)           # Stand vor der Reparatur: volles Blatt
        Z.append("  Textspalte %.0f Einheiten (%.0f pt) · volles Blatt %.0f Einheiten"
                 % (KASTEN_X1 - KASTEN_X0, punkt(KASTEN_X1 - KASTEN_X0), X1 - X0))
        Z.append("  %-22s %8s %8s %s" % ("Kastenart", "gesetzt", "Grenze", "volle Breite"))
        for name in [n for n, _z, _b in _kastenproben(None)]:
            n_ist = eng[name]
            ok = n_ist <= ZEICHEN_MAX
            if not ok:
                fehler.append("%s setzt %d Zeichen je Zeile, erlaubt sind %d"
                              % (name, n_ist, ZEICHEN_MAX))
            Z.append("  %-22s %6d Z %6d Z  %s   (ueber die volle Blattbreite: %d Z%s)"
                     % (name, n_ist, ZEICHEN_MAX, "ok" if ok else "DURCHGEFALLEN",
                        weit[name], "" if weit[name] > ZEICHEN_MAX else " – bleibt darunter"))
        # Zaehne: ueber die volle Blattbreite MUSS mindestens ein Kasten reissen.
        gerissen = [n for n in weit if weit[n] > ZEICHEN_MAX]
        if not gerissen:
            fehler.append("Probe 6 hat keine Zaehne: auch ueber die volle Blattbreite "
                          "bleibt jeder Kasten unter %d Zeichen" % ZEICHEN_MAX)
        Z.append("  Gegenprobe (Kaesten ueber die volle Blattbreite, Stand vor der Reparatur):")
        Z.append("     %s" % (("%d von %d Kastenarten reissen die Grenze – die Probe "
                               "hat Zaehne: %s" % (len(gerissen), len(weit),
                                                   ", ".join(sorted(gerissen))))
                              if gerissen else "OHNE BEFUND – die Probe prueft nichts"))
    finally:
        _IM_TEST = False
        reste = (len(bf.TEXTE) - n_t0, len(GESETZT) - n_g0, len(KAESTEN) - n_k0)
        del bf.TEXTE[n_t0:]
        del GESETZT[n_g0:]
        del KAESTEN[n_k0:]

    Z.append("")
    Z.append("Aufgeraeumt: %d Lauf/Laeufe aus der Textebene, %d aus dem Satzprotokoll, "
             "%d Kasten/Kaesten entfernt – der Selbsttest hinterlaesst nichts."
             % reste)
    if fehler:
        Z.append("SELBSTTEST DURCHGEFALLEN – %d Befund(e):" % len(fehler))
        Z.extend("  * " + f for f in fehler)
    else:
        Z.append("SELBSTTEST BESTANDEN – 6 von 6 Proben.")
    if laut:
        print("\n".join(Z))
    return (not fehler), Z


# ── Freigabe: ohne bestandenen Selbsttest laesst sich nichts setzen ──────────
_FREI, _BERICHT = selbsttest(laut=False)
if not _FREI:
    raise RuntimeError("felo_design: Selbsttest durchgefallen.\n" + "\n".join(_BERICHT))


if __name__ == "__main__":
    print("=" * 78)
    print("FeLabs-Gestaltungssystem · Fassung \"spec\" · Selbsttest")
    print("=" * 78)
    selbsttest(laut=True)
    print("")
    print("FARBTAFEL")
    for name in ("GRUND", "TEXT", "TITEL", "AKZENT", "AKZENT_SCHRIFT", "MERK_GRUND",
                 "EXP_GRUND", "KASTEN_WEISS", "WARN", "LINIE", "ZART"):
        c = globals()[name]
        print("  %-15s %-9s  Kontrast auf GRUND %6.2f" % (name, hexf(c), kontrast(c, GRUND)))
    print("")
    print("GROESSENTAFEL (gedruckte Punkt)")
    for name in sorted(GROESSEN, key=lambda k: -GROESSEN[k]):
        print("  %-13s %6.2f pt = %6.2f Einheiten -> gedruckt %5.2f pt"
              % (name, GROESSEN[name], einheiten(GROESSEN[name]), gedruckt(GROESSEN[name])))
    print("  %-13s %6.2f    Zeilenabstand" % ("ZAB", ZAB))
    print("  %-13s %6.0f Einheiten = %.0f pt fuer %d Zeichen"
          % ("SPALTE_65", SPALTE_65, punkt(SPALTE_65), ZEICHEN_JE_ZEILE))
    print("")
    print("SATZBREITEN (Einheiten)")
    print("  %-13s %6.0f   Satzspiegel des Blattes: Kopf-, Fuss- und Schreiblinien"
          % ("X0..X1", X1 - X0))
    print("  %-13s %6.0f   Lesespalte: Fliesstext, Kaesten, Tabellen (hoechstens %d Zeichen)"
          % ("KASTEN_X0..X1", KASTEN_X1 - KASTEN_X0, ZEICHEN_MAX))
