# -*- coding: utf-8 -*-
"""Bleibt der Lueckentext (Wortbank + Lueckensaetze) einer Einheit auf EINER Seite?

    python3 simcheck/regel_luecke_messen.py <band> <id> [<id> ...] [--seiten]

--seiten druckt dazu den Umbruch beider Fassungen: je Baustein Seite, Lage und
Hoehe - so sieht man, welcher Block auf das Zusatzblatt rutscht.

Abdullah, 07.10.2026: „können wir das nicht auf eine Seite ziehen“. build_book.
einheit_auswahl haelt den Lueckentext zusammen, solange das kein Blatt kostet -
dafuer probiert sie sechs Reihenfolgen der drei Uebungsaufgaben. Dieses Werkzeug
zeigt fuer eine Einheit:
  frei      Seiten, wenn der Lueckentext umbrechen darf (das ist das Ziel)
  geklammert  Seiten der besten Fassung mit zusammenhaengendem Lueckentext
  UEBERHANG  wie viel Hoehe (Einheiten, 31 = eine Textzeile) auf dem Zusatzblatt
            der geklammerten Fassung steht (ohne dessen Fortsetzungskopf) - so viel
            muss die Einheit hoechstens kuerzer werden
Ergebnis „OK“, wenn geklammert nicht mehr Seiten braucht als frei."""
import sys, os, io, contextlib
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
band = sys.argv[1]; ids = [a for a in sys.argv[2:] if not a.startswith("--")]
ZEIGEN = "--seiten" in sys.argv
os.chdir(os.path.join(R, band)); sys.path.insert(0, os.getcwd())
with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
    import build_book as bb
fd = bb.fd


def messen(tid):
    ch = [c for c in bb.CHAPTERS if tid in c["topics"]][0]; ti = ch["topics"].index(tid)
    cfg = bb.FSD[tid]; ub = bb.UEBD.get(tid)
    extra = (bb._diag(ch["id"], tid),) if band == "arbeitsheft" else ()
    def bauen():
        B, k, q = bb.topic_pages(cfg, ch["title"], ti + 1, 1, *extra, nur_bausteine=True)
        U = bb.ch_uebung(ub, cfg, ch["title"], ti + 1, 1, cfg.get("ueberleitung"), nur_bausteine=True)
        U = [bb.b_band("Übungen", "Balken Übungen")] + [x for x in U[1:] if x.name != "Themenzeile"]
        B[-1].abstand = fd.ABS_ABSCHNITT
        return B + U, k, q
    def fassungen(reihe, kette):
        r = []
        for ueben in (True, False):
            for deckel in (None, 2):
                bb.ZEILEN_DECKEL = deckel; bb.UEBEN_ZEILE = ueben
                bb.LUECKEN_KETTE = kette; bb.UEBUNG_REIHENFOLGE = reihe
                B, _, _ = bauen(); h = fd.messe_bausteine(B, fd.STIL)
                s = fd.umbrechen(B, h)
                letzte = s[-1]; i, y = letzte[-1]
                plan = [(si + 1, B[j].name, round(yy), round(h[j])) for si, e in enumerate(s) for j, yy in e]
                r.append((len(s), y + h[i] - (fd.OBEN if len(s) == 1 else fd.OBEN + fd.FORTS), reihe, ueben, deckel or 9, plan))
        return r
    try:
        frei = min(fassungen("LRM", False))
        gek = min(f for reihe in ("LRM", "RLM", "MLR", "RML", "LMR", "MRL") for f in fassungen(reihe, True))
    finally:
        bb.ZEILEN_DECKEL = None; bb.UEBEN_ZEILE = True; bb.LUECKEN_KETTE = True; bb.UEBUNG_REIHENFOLGE = "LRM"
    return frei, gek


for tid in ids:
    frei, gek = messen(tid)
    ok = gek[0] <= frei[0]
    print("%-6s frei %d Seiten | geklammert %d Seiten (Reihenfolge %s) | %s"
          % (tid, frei[0], gek[0], gek[2],
             "OK" if ok else "UEBERHANG %d Einheiten (%.1f Textzeilen)" % (gek[1], gek[1] / fd.LH)))
    if ZEIGEN:
        for name, f in (("frei", frei), ("geklammert", gek)):
            print("  -- %s (Reihenfolge %s, Zeile 'noch ueben' %s, Schreiblinien-Deckel %s)"
                  % (name, f[2], "ja" if f[3] else "nein", "keiner" if f[4] == 9 else f[4]))
            for seite, n, y, hh in f[5]:
                print("     S.%d  y=%4d  h=%4d  %s" % (seite, y, hh, n))
