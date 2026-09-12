# -*- coding: utf-8 -*-
"""Unsichtbare Textebene fuer das E-Book.

Die Heftseiten werden als Bild gesetzt - anders waeren die Zeichnungen, die
Schattenrisse und die Handschrift-Anmutung nicht zu halten. Ein reines Bild-PDF
laesst sich aber weder durchsuchen noch zitieren. Deshalb legt dieses Modul
ueber jede Seite denselben Text noch einmal, im Textmodus 3 ("unsichtbar") und
lagegenau an derselben Stelle: Suche, Markieren und Vorlesefunktionen finden
ihn, zu sehen ist weiterhin nur das Bild.

Eingebettet wird ausschliesslich Source Sans 3 (SIL OFL, kommerziell nutzbar).
Die Systemschriften Didot, Cochin und Copperplate duerfen nicht mitgeliefert
werden; ihre Zeilen bekommen ersatzweise Source Sans und werden ueber die
horizontale Skalierung (Tz) auf die tatsaechlich gedruckte Breite gezogen.
Sichtbar ist davon nichts, die Auswahl sitzt trotzdem passgenau.
"""
import os
from fontTools.ttLib import TTFont
from pypdf.generic import (DecodedStreamObject, NameObject, DictionaryObject,
                           ArrayObject, NumberObject, ByteStringObject, TextStringObject)

HERE = os.path.dirname(os.path.abspath(__file__))
SCHRIFT = os.path.join(HERE, "fonts", "SourceSans3-Regular.ttf")
PX_ZU_PT = 72.0 / 150.0        # die Seitenbilder liegen mit 150 dpi im PDF


class _Schrift:
    """Liest aus der TTF, was das PDF ueber die Schrift wissen muss."""

    def __init__(self, pfad):
        self.tt = TTFont(pfad, lazy=True)
        self.upem = self.tt["head"].unitsPerEm
        self.namen = self.tt.getGlyphOrder()
        self.gid = {n: i for i, n in enumerate(self.namen)}
        self.cmap = self.tt.getBestCmap()
        self.hmtx = self.tt["hmtx"]
        self.rohdaten = open(pfad, "rb").read()
        self.benutzt = {}          # gid -> Zeichen (fuer /W und ToUnicode)

    def gids(self, text):
        """Text -> Liste von (gid, Vorschub in 1/1000 em). Unbekanntes faellt weg."""
        raus = []
        for ch in text:
            name = self.cmap.get(ord(ch))
            if name is None:
                name = self.cmap.get(32)      # Ersatz: Leerzeichen, haelt die Laenge
                ch = " "
            g = self.gid.get(name)
            if g is None:
                continue
            self.benutzt[g] = ch
            raus.append((g, self.hmtx[name][0] * 1000.0 / self.upem))
        return raus


def _tounicode(schrift):
    zeilen = ["/CIDInit /ProcSet findresource begin", "12 dict begin", "begincmap",
              "/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def",
              "/CMapName /Adobe-Identity-UCS def", "/CMapType 2 def",
              "1 begincodespacerange", "<0000> <FFFF>", "endcodespacerange"]
    posten = sorted(schrift.benutzt.items())
    for i in range(0, len(posten), 100):
        teil = posten[i:i + 100]
        zeilen.append(f"{len(teil)} beginbfchar")
        for g, ch in teil:
            n = ord(ch)
            if n < 0x10000:
                uni = f"{n:04X}"
            else:                                   # ausserhalb der Basisebene: Ersatzpaar
                n -= 0x10000
                uni = f"{0xD800 + (n >> 10):04X}{0xDC00 + (n & 0x3FF):04X}"
            zeilen.append(f"<{g:04X}> <{uni}>")
        zeilen.append("endbfchar")
    zeilen += ["endcmap", "CMapName currentdict /CMap defineresource pop", "end", "end"]
    return "\n".join(zeilen)


def _schriftobjekte(w, schrift):
    """Type0-Schrift mit CIDFontType2-Nachkommen anlegen und einhaengen."""
    datei = DecodedStreamObject()
    datei.set_data(schrift.rohdaten)
    datei[NameObject("/Length1")] = NumberObject(len(schrift.rohdaten))
    datei_ref = w._add_object(datei)

    os2 = schrift.tt["OS/2"]; head = schrift.tt["head"]; hhea = schrift.tt["hhea"]
    f = 1000.0 / schrift.upem
    fd = DictionaryObject({
        NameObject("/Type"): NameObject("/FontDescriptor"),
        NameObject("/FontName"): NameObject("/SourceSans3-Regular"),
        NameObject("/Flags"): NumberObject(4),
        NameObject("/FontBBox"): ArrayObject([NumberObject(int(head.xMin * f)),
                                              NumberObject(int(head.yMin * f)),
                                              NumberObject(int(head.xMax * f)),
                                              NumberObject(int(head.yMax * f))]),
        NameObject("/ItalicAngle"): NumberObject(0),
        NameObject("/Ascent"): NumberObject(int(hhea.ascent * f)),
        NameObject("/Descent"): NumberObject(int(hhea.descent * f)),
        NameObject("/CapHeight"): NumberObject(int(getattr(os2, "sCapHeight", 700) * f)),
        NameObject("/StemV"): NumberObject(80),
        NameObject("/FontFile2"): datei_ref,
    })
    fd_ref = w._add_object(fd)

    # /W: Vorschub jedes wirklich benutzten Glyphs, sonst sitzt die Auswahl daneben
    breiten = ArrayObject()
    for g in sorted(schrift.benutzt):
        name = schrift.namen[g]
        breiten.append(NumberObject(g))
        breiten.append(ArrayObject([NumberObject(int(round(schrift.hmtx[name][0] * f)))]))

    cid = DictionaryObject({
        NameObject("/Type"): NameObject("/Font"),
        NameObject("/Subtype"): NameObject("/CIDFontType2"),
        NameObject("/BaseFont"): NameObject("/SourceSans3-Regular"),
        NameObject("/CIDSystemInfo"): DictionaryObject({
            NameObject("/Registry"): TextStringObject("Adobe"),
            NameObject("/Ordering"): TextStringObject("Identity"),
            NameObject("/Supplement"): NumberObject(0)}),
        NameObject("/FontDescriptor"): fd_ref,
        NameObject("/DW"): NumberObject(1000),
        NameObject("/W"): breiten,
        NameObject("/CIDToGIDMap"): NameObject("/Identity"),
    })
    cid_ref = w._add_object(cid)

    tu = DecodedStreamObject()
    tu.set_data(_tounicode(schrift).encode("latin-1"))
    tu_ref = w._add_object(tu)

    typ0 = DictionaryObject({
        NameObject("/Type"): NameObject("/Font"),
        NameObject("/Subtype"): NameObject("/Type0"),
        NameObject("/BaseFont"): NameObject("/SourceSans3-Regular"),
        NameObject("/Encoding"): NameObject("/Identity-H"),
        NameObject("/DescendantFonts"): ArrayObject([cid_ref]),
        NameObject("/ToUnicode"): tu_ref,
    })
    return w._add_object(typ0)


def _seitenstrom(laeufe, schrift, hoehe_pt):
    """Inhaltsstrom einer Seite: alle Laeufe unsichtbar an ihrer Stelle."""
    teile = ["q", "BT", "3 Tr"]     # 3 Tr = zeichnen, aber nichts sichtbar machen
    letzte_groesse = None
    for x_px, y_px, breite_px, groesse_px, text in laeufe:
        paare = schrift.gids(text)
        if not paare:
            continue
        groesse = groesse_px * PX_ZU_PT
        natur = sum(v for _, v in paare) / 1000.0 * groesse
        if natur <= 0:
            continue
        # Tz zieht die Ersatzschrift auf genau die Breite, die im Bild steht.
        tz = max(1.0, min(1000.0, (breite_px * PX_ZU_PT) / natur * 100.0))
        if groesse != letzte_groesse:
            teile.append(f"/F1 {groesse:.2f} Tf")
            letzte_groesse = groesse
        teile.append(f"{tz:.1f} Tz")
        x = x_px * PX_ZU_PT
        y = hoehe_pt - y_px * PX_ZU_PT
        teile.append(f"1 0 0 1 {x:.2f} {y:.2f} Tm")
        teile.append("<" + "".join(f"{g:04X}" for g, _ in paare) + "> Tj")
    teile += ["ET", "Q"]
    return "\n".join(teile)


def anhaengen(w, seiten_laeufe):
    """Legt ueber jede Seite des Writers ihre unsichtbare Textebene.

    seiten_laeufe: Liste (eine je Seite) von Laeufen (x, Grundlinie, Breite,
    Groesse, Text) in Bildpunkten der 1240x1754-Seite.
    Gibt zurueck, wie viele Laeufe und Zeichen geschrieben wurden.
    """
    if not any(seiten_laeufe):
        return 0, 0
    schrift = _Schrift(SCHRIFT)
    stroeme = []
    n_laeufe = n_zeichen = 0
    for seite, laeufe in zip(w.pages, seiten_laeufe):
        if not laeufe:
            stroeme.append(None); continue
        hoehe = float(seite.mediabox.height)
        stroeme.append(_seitenstrom(laeufe, schrift, hoehe))
        n_laeufe += len(laeufe); n_zeichen += sum(len(l[4]) for l in laeufe)

    # Erst jetzt steht fest, welche Glyphen vorkommen - deshalb kommt die
    # Schrift nach dem Bauen der Stroeme ins Dokument.
    schrift_ref = _schriftobjekte(w, schrift)

    for seite, strom in zip(w.pages, stroeme):
        if strom is None:
            continue
        s = DecodedStreamObject(); s.set_data(strom.encode("latin-1"))
        ref = w._add_object(s)
        inhalt = seite.raw_get("/Contents")
        if isinstance(inhalt, ArrayObject):
            inhalt.append(ref)
        else:
            seite[NameObject("/Contents")] = ArrayObject([inhalt, ref])
        res = seite.get("/Resources")
        if res is None:
            res = DictionaryObject(); seite[NameObject("/Resources")] = res
        schriften = res.get("/Font")
        if schriften is None:
            schriften = DictionaryObject(); res[NameObject("/Font")] = schriften
        schriften[NameObject("/F1")] = schrift_ref
    return n_laeufe, n_zeichen
