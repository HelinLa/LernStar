# -*- coding: utf-8 -*-
"""Musterseite nach der Kontext-Vorlage: Problemszene gross oben, kurzer Kontextsatz,
operatorengerechte Aufgaben, Material, Erarbeitung, Auswertung, Sicherung, Rueckbindung,
Transfer.  Zwei Seiten (Erarbeiten + Sichern) - dieselbe Seitenzahl wie bisher
Forscherseite + Uebungsseite.  Baut NUR das Muster, das Gesamtheft bleibt unangetastet.
   python3 build_muster.py   ->  ~/Desktop/Physik5_Musterseite_Schalter.pdf"""
import os
from build_book import *          # holt build_final-Helfer, footer, qr_badge, ML, W, H ...

IMGD = os.path.join(HERE, "img")
CW   = W - 2*ML                                   # nutzbare Breite

def head(h, d, eyebrow, titel, acc, tid=None):
    h.tracked(ML, 84, eyebrow, COP(13), acc, 4, center=False)
    bx = qr_badge(h, d, tid, acc) if tid else None
    h.T(ML, 108, titel, DIDOT(34), INK)
    h.ln([(ML+2, 168), ((bx-14) if bx else (W-ML), 168)], GLINE, 1.4)

def sect(h, y, n, label, col, gap=66):
    h.numtab(ML, y, n, col, label); return y + gap

def bild(h, name, y, hoehe):
    h.pastefit(os.path.join(IMGD, name), ML, y, CW, hoehe); return y + hoehe

def auf(h, y, nr, text, col, zeilen=0, breite=None, lh=36):
    """Ein Arbeitsauftrag: Nummernkreis, Text, darunter Schreiblinien."""
    bw = breite or (CW - 46)
    h.circ(ML+15, y+13, 14, fill=col); h.T(ML+15, y+14, str(nr), AVB(12.5), CREAM, anchor="mm")
    ey = h.para(ML+46, y, text, AVM(16), INK, bw, 27)
    for k in range(zeilen):
        ly = ey + 20 + k*lh
        h.ln([(ML+46, ly), (W-ML, ly)], GLINE, 1.2)
    return (ey + 20 + zeilen*lh) + (4 if zeilen else 6)

# ───────────────────────── Seite A: Problem & Entwickeln ─────────────────────────
def seite_a(pn, acc):
    im, d = newp(CREAM); h = hp(im, d)
    head(h, d, "EINFACHER STROMKREIS · FORSCHERKREIS 03", "Der Schalter", acc, "s6")

    y = bild(h, "szene_s6.png", 188, 430)                       # grosse Problemszene
    y += 26
    y = h.para(ML, y, "Yusuf möchte seine Lampe ein- und ausschalten, ohne jedes Mal die Klemme "
                      "von der Batterie abzuziehen.", AVB(19), STEP[0], CW, 30) + 26

    y = sect(h, y, 1, "DAS PROBLEM VERSTEHEN", STEP[0])
    y = auf(h, y, 1, "Beschreibe das Problem, das Yusuf beim Ausschalten seiner Lampe hat.", STEP[0], 2)
    y = auf(h, y, 2, "Formuliere eine Vermutung, wie er den Stromkreis einfacher öffnen und wieder "
                     "schließen könnte.", STEP[0], 2)

    y = sect(h, y+6, 2, "MATERIAL", STEP[2])
    y = bild(h, "material_s6.png", y, 200) + 22

    y = auf(h, y, 3, "Entwickle mit diesen Materialien eine Möglichkeit, den Stromkreis gezielt zu "
                     "öffnen und wieder zu schließen.", STEP[2], 0)
    y = auf(h, y, 4, "Skizziere deine Idee.", STEP[2], 0)
    bh = min(206, H-104-y)
    h.R(ML+46, y, W-ML, y+bh, 12, outline=GLINE, w=1.6)
    h.T(W-ML-16, y+bh-14, "Zeichenfläche", AVM(11), (206,200,182), anchor="ra")
    footer(h, pn, acc); return im.resize((W,H), Image.LANCZOS)

# ──────────────────── Seite B: Bauen, Auswerten, Sichern, Übertragen ────────────────────
def seite_b(pn, acc):
    im, d = newp(CREAM); h = hp(im, d)
    head(h, d, "EINFACHER STROMKREIS · FORSCHERKREIS 03", "Der Schalter", acc)

    y = sect(h, 188, 3, "BAUEN & PRÜFEN", STEP[2], 62)
    y = auf(h, y, 5, "Baue deine Anordnung nach.", STEP[2], 0)
    y = auf(h, y, 6, "Überprüfe, ob sich die Lampe damit ein- und ausschalten lässt.", STEP[2], 0)
    y = auf(h, y, 7, "Beschreibe die Funktion deiner Anordnung.", STEP[2], 2)

    y = sect(h, y+2, 4, "BEOBACHTEN & AUSWERTEN", STEP[3], 62)
    h.circ(ML+15, y+13, 14, fill=STEP[3]); h.T(ML+15, y+14, "8", AVB(12.5), CREAM, anchor="mm")
    ty = h.para(ML+46, y, "Beschreibe, wann die Lampe leuchtet und wann sie dunkel bleibt.",
                AVM(16), INK, CW-46, 27) + 14
    tw = 660; rh = 36
    h.R(ML+46, ty, ML+46+tw, ty+3*rh, 8, outline=GLINE, w=1.4)
    h.ln([(ML+46, ty+rh), (ML+46+tw, ty+rh)], GLINE, 1.2)
    h.ln([(ML+46+tw*0.56, ty), (ML+46+tw*0.56, ty+3*rh)], GLINE, 1.2)
    h.T(ML+62, ty+rh/2, "Die Büroklammer …", AVB(13), INK, anchor="lm")
    h.T(ML+58+tw*0.56, ty+rh/2, "Die Lampe …", AVB(13), INK, anchor="lm")
    for i, lab in enumerate(["… berührt beide Reißzwecken", "… ist weggedreht"]):
        h.T(ML+62, ty+rh*(1.5+i), lab, AV(13), INK, anchor="lm")
        if i: h.ln([(ML+46, ty+2*rh), (ML+46+tw, ty+2*rh)], (236,232,220), 1)
    y = ty + 3*rh + 20

    y = auf(h, y,  9, "Erkläre, was mit dem Stromkreis geschieht, wenn die Büroklammer beide "
                      "Reißzwecken berührt.", STEP[3], 2)
    y = auf(h, y, 10, "Erkläre, was mit dem Stromkreis geschieht, wenn diese Verbindung "
                      "unterbrochen wird.", STEP[3], 2)

    # ⑤ SICHERN – der Fachbegriff entsteht erst hier
    y = sect(h, y+2, 5, "DAS HAST DU HERAUSGEFUNDEN", GOLD_D, 62)
    mh = 80
    h.gframe(ML+46, y, W-ML, y+mh)
    d.polygon([(sc(ML+76), sc(y+26)-sc(10)), (sc(ML+76)+sc(9), sc(y+26)),
               (sc(ML+76), sc(y+26)+sc(10)), (sc(ML+76)-sc(9), sc(y+26))], fill=GOLD)
    h.tracked(ML+96, y+18, "MERKSATZ", COP(10.5), GOLD_D, 2, center=False)
    h.para(ML+70, y+44, "Ein Schalter ist eine Vorrichtung, mit der ein Stromkreis gezielt "
                        "geöffnet und geschlossen werden kann.", AVB(17), INK, CW-92, 27)
    y = bild(h, "sicherung_s6.png", y+mh+8, 178) + 10

    y = sect(h, y, 6, "ZURÜCK ZU YUSUF", STEP[0], 62)
    y = auf(h, y, 11, "Erkläre, wie Yusuf seine Lampe mithilfe eines Schalters bequemer ein- und "
                      "ausschalten kann.", STEP[0], 2)

    y = sect(h, y, 7, "ÜBERTRAGEN", STEP[4], 62)
    zl = max(1, min(3, int((H-108-(y+50))//36)))
    auf(h, y, 12, "Beurteile, an welcher Stelle ein Schalter in einen Stromkreis eingebaut werden "
                  "sollte, damit sich eine Lampe gezielt ein- und ausschalten lässt. Begründe "
                  "deine Entscheidung.", STEP[4], zl)
    footer(h, pn, acc); return im.resize((W,H), Image.LANCZOS)

if __name__ == "__main__":
    acc = (46, 92, 178)
    pages = [seite_a(41, acc), seite_b(42, acc)]
    for i, p in enumerate(pages): p.save(os.path.join(HERE, f"muster_p{i+1}.png"))
    out = os.path.expanduser("~/Desktop/Physik5_Musterseite_Schalter.pdf")
    pages[0].save(out, "PDF", resolution=150, save_all=True, append_images=pages[1:])
    print("SAVED", out, "| Seiten:", len(pages))
