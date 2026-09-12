# -*- coding: utf-8 -*-
"""FELO Physik · Förderheft - das ganze Heft.

Klasse, Schulform und Quellband kommen aus plan.py: Diese Datei ist fuer JEDES
Foerderheft dieselbe und muss beim naechsten Band nicht angefasst werden.

DER BAND STEHT IM NEUEN SATZ (Fassung "spec", ../arbeitsheft/felo_design.py).
    Weisser Grund, hoechstens zwei Akzentfarben, linksbuendig, keine Woerter in
    Grossbuchstaben. JEDE Schrift kommt ueber fd.schrift(art, GRAD) aus der
    Groessentafel; eine nackte Zahl wie AV(15.5) gibt es hier nicht mehr. Die
    Doppelseiten und den Lehrerteil setzt build_pilot.py.

WAS AN DIESER REIHE ANDERS IST ALS AM MUSTERBAND (arbeitsheft8)
    1  Raetselseiten gibt es hier nicht - es sind also auch keine zu entfernen.
    2  Der Lehrerband ist schon lange ein eigenes PDF (..._Lehrerband.pdf) und
       bleibt es. Er steht jetzt AUCH im neuen Satz: sein Fliesstext lief auf
       AV(15.5) = 7,4 pt und damit unter der 10-pt-Grenze der Groessentafel.
    3  Einen Messwerte-Anhang gibt es nicht; der Ersatzweg ohne Geraet steht als
       eine Zeile auf jeder Seite A und ausfuehrlich im Lehrerteil.

WAS NUR BAND 10 HAT
    Vier Einheiten ohne Simulation tragen ein gedrucktes DATENBLATT
    (plan.DATENBLATT: fv11, fn11, fn13, fn15). Sie haben keinen QR-Code, und
    Abschnitt 3 heisst dort "Auswerten & beurteilen". Gesetzt wird das Blatt in
    build_pilot.datenblatt() - auf der Lesespalte und im Foerdergrad, nicht mehr
    auf 7,9 pt in einer Randspalte. "So arbeitest du" sagt das ausdruecklich,
    sonst sucht ein Kind dort vergeblich nach dem Code.

Struktur: Deckblatt · So arbeitest du · Inhalt · je Kapitel: Trennseite,
Lerneinheiten (Seite A, Seite B), Fördertest. Der Lehrerband wird im selben
Lauf als eigenes PDF gesetzt.
"""
import os, sys, json, glob
_HIER=os.path.dirname(os.path.abspath(__file__))
MOTOR=os.path.join(os.path.dirname(_HIER),"arbeitsheft")
sys.path.append(MOTOR)
from build_final import *
import felo_design as fd
while MOTOR in sys.path: sys.path.remove(MOTOR)
sys.path.append(MOTOR)
import importlib.util as _ilu
# Lehrplan-Zuordnung liegt in arbeitsheft/ und wird ueber den Pfad geladen -
# nicht ueber sys.path, sonst erwischt das folgende build_book das falsche Heft.
_spec=_ilu.spec_from_file_location("lehrplan_gts", os.path.join(MOTOR,"lehrplan_gts.py"))
lehrplan=_ilu.module_from_spec(_spec); _spec.loader.exec_module(lehrplan)
import plan
import build_pilot as bp          # Seite A / Seite B / Lehrerteil im Foerdersatz
HERE=_HIER                        # nach dem Sternimport setzen (HERE-Falle)

KL       = str(plan.KLASSE)
SFORM    = plan.SCHULFORM
BANDNAME = f"FELO Physik {KL} · Förderheft"
DATEINAME= f"FELO_Foerder_{KL}"
FACHGEBIETE=" · ".join(k["titel"] for k in plan.ALLE_KAPITEL)
INHALTSFELDER=" · ".join(k["inhaltsfeld"] for k in plan.ALLE_KAPITEL)
LEITWORT="Kleine Schritte · klare Sprache · viele Hilfen"
SCHLUSSZEILE=("in einfacher Sprache – orientiert an den Themen des "
              "Physikunterrichts der Sekundarstufe I")

def _load(n): return json.load(open(os.path.join(HERE,"content",n),encoding="utf-8"))
SEITEN=bp.SEITEN
LOES=bp.LOES
TESTS={o["theme"]:o for o in _load("foerdertests.json")}

# ── QR-Deep-Links (Kurzform wie in allen Baenden; die App loest die Simulation
#    ueber js/heft-bruecke.js auf - deshalb MUSS die Bruecke die fo/fw-Kennungen
#    kennen, bevor gedruckte Codes benutzt werden) ──
BASE="https://helinla.github.io/LernStar/"
SIM=dict(plan.SIM)
def sim_url(tid):
    return BASE+"#heft="+tid if tid in SIM else None

CHAPTERS=[{"id":k["id"],"title":k["titel"],"acc":k["acc"],
           "topics":[th["id"] for th in k["themen"]]} for k in plan.KAPITEL]

# Klickflaechen - MITGESCHRIEBEN, nicht nachgerechnet. Eine Layoutaenderung kann
# die Klickflaeche damit nicht mehr neben ihr Kaestchen schieben.
COVERBOXEN=[]                     # Deckblatt: (x0,y0,x1,y1) je Kapitel
TOCBOXEN=[]                       # Inhalt:    (Seite, x0,y0,x1,y1, Zielseite)
TRENNBOXEN={}                     # Trennseite: Seite -> [(x0,y0,x1,y1)]

# Kuerzel aus build_pilot, damit die Bausteine hier genauso heissen
bst,b_titel,b_marke,b_para,b_punkt=bp.bst,bp.b_titel,bp.b_marke,bp.b_para,bp.b_punkt
b_unterkopf,b_ankreuz,b_linien,b_luecke=bp.b_unterkopf,bp.b_ankreuz,bp.b_linien,bp.b_luecke
b_zeilen=bp.b_zeilen               # zeilenweise umbrechbarer Absatz (Lehrerband)
FOE,LH_FOE,LESE,ANKREUZ=bp.FOE,bp.LH_FOE,bp.LESE,bp.ANKREUZ
LESE_KLEIN=bp.LESE_KLEIN           # Lesebreite fuer KLEIN gesetzte Absaetze
LH_HAUPT,LH_ZWISCH,LH_KOPF,LH_DISPLAY=bp.LH_HAUPT,bp.LH_ZWISCH,bp.LH_KOPF,bp.LH_DISPLAY


# ═════════════════════════════════════════════════════════════════════════════
#  DECKBLATT
# ═════════════════════════════════════════════════════════════════════════════
def book_cover():
    im,d=newp(fd.GRUND); h=hp(im,d)
    del COVERBOXEN[:]
    y=fd.OBEN
    fd.T(h,fd.X0,y,"Förderheft",fd.schrift("med",fd.ZWISCHEN),fd.STIL["akzent"])
    y+=LH_ZWISCH+18
    fd.T(h,fd.X0,y,"FELO",fd.schrift("bold",bp.DISPLAY_GROSS),fd.STIL["h1"])
    y+=round(fd.einheiten(bp.DISPLAY_GROSS)*fd.ZAB,2)+10
    h.ln([(fd.X0,y),(fd.X1,y)],fd.STIL["akzent"],1.6)
    y+=24
    fd.T(h,fd.X0,y,"Physik "+KL,fd.schrift("bold",bp.DISPLAY_MITTEL),fd.STIL["h1"])
    y+=LH_DISPLAY+6
    fd.T(h,fd.X0,y,SFORM,fd.schrift("med",fd.HAUPT),fd.STIL["akzent"])
    y+=LH_HAUPT+8
    fd.T(h,fd.X0,y,"Forschen · verstehen · anwenden",fd.schrift("reg",fd.ZWISCHEN),
         fd.STIL["text"])
    y+=LH_ZWISCH+6
    fd.T(h,fd.X0,y,LEITWORT,fd.schrift("med",fd.FLIESS),fd.STIL["akzent"])
    # Die Kapitelliste steht im unteren Drittel, damit das Blatt nicht kopflastig
    # wird: der Titelblock oben, das Verzeichnis unten, die Wortmarke dazwischen.
    kh=fd.LH+24
    # Wie hoch der Schlussblock wirklich wird, wird GEMESSEN. Die Zeile in KLEIN
    # laeuft auf der schmaleren Lesebreite ueber zwei Zeilen; mit einer fest
    # eingetragenen LH_KLEIN lief das Deckblatt 16 Einheiten unter den
    # Satzspiegel - unsichtbar, weil dort nur eine Grundlinie steht.
    _nz=len(bp.messhilfe().wrap(SCHLUSSZEILE,fd.schrift("reg",fd.KLEIN),LESE_KLEIN))
    y=fd.UNTEN-(len(CHAPTERS)*(kh+14)+LH_KOPF+22+fd.LH+_nz*fd.LH_KLEIN+40)
    fd.T(h,fd.X0,y,"Die Kapitel dieses Hefts",fd.schrift("bold",fd.KASTEN_KOPF),
         fd.STIL["akzent"])
    h.ln([(fd.X0,y+LH_KOPF+2),(fd.X1,y+LH_KOPF+2)],fd.STIL["zart"],1.2)
    y+=LH_KOPF+22
    for i,c in enumerate(CHAPTERS):
        h.R(fd.X0,y,fd.X1,y+kh,10,outline=fd.STIL["linie"],w=1.2)
        fd.T(h,fd.X0+22,y+kh/2,"Kapitel %d"%(i+1),fd.schrift("med",fd.KLEIN),
             fd.STIL["akzent"],anchor="lm")
        h.ln([(fd.X0+150,y+10),(fd.X0+150,y+kh-10)],fd.STIL["zart"],1.2)
        fd.T(h,fd.X0+172,y+kh/2,c["title"],fd.schrift("med",fd.FLIESS),
             fd.STIL["text"],anchor="lm")
        COVERBOXEN.append((fd.X0,y,fd.X1,y+kh))
        y+=kh+14
    y+=26
    fd.T(h,fd.X0,y,"Forschen · Eigeninitiative · Lernen · Organisieren",
         fd.schrift("med",fd.FLIESS),fd.STIL["akzent"])
    y+=fd.LH+4
    # Als Absatz, nicht als eine Zeile: in KLEIN gesetzt traegt dieser Satz 89
    # Zeichen und war damit die laengste gedruckte Zeile des Bandes.
    fd.para(h,fd.X0,y,SCHLUSSZEILE,fd.schrift("reg",fd.KLEIN),
            fd.STIL["text"],LESE_KLEIN,fd.LH_KLEIN)
    bp.PROBE.append(("Deckblatt",1,bp._unterkante(im)))
    return fertig(im)


# ═════════════════════════════════════════════════════════════════════════════
#  SO ARBEITEST DU  (+ Impressum)
# ═════════════════════════════════════════════════════════════════════════════
SCHRITTE_A=[("Lesen:","Lies die kurze Geschichte."),
            ("Deine Vermutung:","Kreuze an, was du glaubst."),
            ("Forschen am Bildschirm:","Öffne die Simulation mit dem QR-Code. "
             "Stelle ein und lies ab."),
            ("Trage ein:","Fülle die Tabelle. Die erste Zeile ist schon gelöst.")]
# Vier Seiten dieses Bandes haben keine Simulation, sondern ein gedrucktes
# Datenblatt. Ohne diesen Hinweis sucht ein Kind dort vergeblich nach dem
# QR-Code - die Seite sieht sonst genauso aus wie alle anderen. Die Zahl kommt
# aus plan.DATENBLATT, damit sie nicht veraltet, und der Hinweis erscheint nur,
# wenn der Band ueberhaupt Datenblattseiten hat.
_N_DB=len(getattr(plan,"DATENBLATT",()))
if _N_DB:
    SCHRITTE_A.insert(3,("Ohne QR-Code:",
        f"{_N_DB} Seiten haben ein Datenblatt zum Ablesen statt einer Simulation."))
SCHRITTE_B=[("Merksatz:","Setze die zwei Wörter aus der Wortbank ein."),
            ("Beispiel:","So sieht eine gute Antwort aus."),
            ("Drei Aufgaben:","Erst ankreuzen, dann eintragen, dann erklären."),
            ("Hilfen 1 · 2 · 3:","Erst selbst versuchen. Dann eine Hilfe nach der anderen."),
            ("Das kann ich:","Hake ab, was du schon kannst."),
            ("Zu Hause:","Ein kleiner Auftrag mit einfachen Dingen.")]
FUER_LEHRKRAEFTE=[
    f"Dieses Förderheft hat die gleichen fachlichen Ziele wie FELO Physik {KL} "
    f"({SFORM.split()[0]}), aber einen leichteren Lernweg: Sprachniveau A2–B1, "
    "kleine Schritte, gestufte Hilfen.",
    "Der getrennte Lehrerband enthält Lösungen, Erwartungshorizonte, typische Fehler, "
    "den Ersatzweg ohne Simulation und die Kernlehrplan-Bezüge samt Kompetenzcodes."]
IMPRESSUM=[("Autor & Konzept","Abdullah Lala"),("Texte & Illustrationen","Abdullah Lala"),
           ("Herausgeber","Eigenverlag Abdullah Lala"),("Auflage","1. Auflage 2026"),
           ("Fassung","1.1 · Stand 9. September 2026"),
           ("Kontakt (E-Mail)","abdullah-lala@hotmail.de")]


def _b_schritt(i,lbl,txt):
    """Nummerierte Scheibe, fettes Stichwort, Erklaerung dahinter."""
    def f(h,d,y):
        r=round(fd.einheiten(FOE)*0.55,1)
        h.circ(fd.X0+r,y+LH_FOE*0.5,r,fill=fd.STIL["akzent"])
        fd.T(h,fd.X0+r,y+LH_FOE*0.5+1,str(i+1),fd.schrift("bold",fd.KLEIN),
             fd.STIL["akzent_schrift"],anchor="mm")
        x=fd.X0+round(r*2+14,1)
        fd.T(h,x,y,lbl,fd.schrift("bold",FOE),fd.STIL["text"])
        b=h.tw(lbl,fd.schrift("bold",FOE))+10
        return fd.para(h,x+b,y,txt,fd.schrift("reg",FOE),fd.STIL["text"],
                       LESE-(x-fd.X0)-b,LH_FOE)
    return bst("Arbeitsschritt %d"%(i+1),f,abstand=8)


def so_arbeitest_du(pn):
    B=[b_titel("So arbeitest du mit diesem Heft",unterzeile=BANDNAME)]
    B.append(b_para("Jedes Thema hat zwei Seiten. Seite A heißt Entdecken. Seite B heißt "
                    "Verstehen & üben. Arbeite immer von oben nach unten.",art="med",
                    abstand=fd.ABS_ABSCHNITT,name="Vorspann"))
    B.append(b_unterkopf("Seite A · Entdecken"))
    for i,(lbl,txt) in enumerate(SCHRITTE_A): B.append(_b_schritt(i,lbl,txt))
    B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_unterkopf("Seite B · Verstehen & üben"))
    for i,(lbl,txt) in enumerate(SCHRITTE_B): B.append(_b_schritt(i,lbl,txt))
    B[-1].abstand=fd.ABS_AUFGABE
    B.append(bst("Ersatzweg",
                 lambda h,d,y: bp.kasten_bildschirm(h,d,y,fd.STIL,
                     ["Kein Gerät da? Deine Lehrkraft zeigt dir die Ergebnisse.",
                      "Du kannst trotzdem alles lösen."]),
                 fd.ABS_ABSCHNITT))
    B.append(b_unterkopf("Für Lehrkräfte",haftet=len(FUER_LEHRKRAEFTE)))
    for i,z in enumerate(FUER_LEHRKRAEFTE):
        B.append(b_para(z,grad=fd.FLIESS,name="Lehrkraefte %d"%(i+1),abstand=8))
    B[-1].abstand=fd.ABS_ABSCHNITT
    # Der Impressumsblock haelt zusammen: sonst steht "Autor & Konzept" allein
    # unten auf der einen und der Rest auf der naechsten Seite.
    B.append(b_unterkopf("Impressum",haftet=len(IMPRESSUM)+2))
    for lbl,val in IMPRESSUM:
        def b_imp(h,d,y,lbl=lbl,val=val):
            fd.T(h,fd.X0,y,lbl,fd.schrift("med",fd.FLIESS),fd.STIL["akzent"])
            fd.T(h,fd.X0+330,y,val,fd.schrift("reg",fd.FLIESS),fd.STIL["text"])
            return y+fd.LH
        B.append(bst("Impressum "+lbl,b_imp,abstand=6))
    B[-1].abstand=fd.ABS_AUFGABE
    B.append(b_para("© 2026 Abdullah Lala. Alle Rechte vorbehalten.",art="med",
                    grad=fd.FLIESS,name="Copyright"))
    B.append(b_para("Das Werk und seine Teile sind urheberrechtlich geschützt. Jede "
        "Verwertung außerhalb der engen Grenzen des Urheberrechts ist ohne schriftliche "
        "Zustimmung des Autors unzulässig.",grad=fd.KLEIN,lh=fd.LH_KLEIN,
        breite=LESE_KLEIN,name="Rechte"))
    return bp.setze_einheit(B,BANDNAME,"So arbeitest du mit diesem Heft",pn,
                            "So arbeitest du")


# ═════════════════════════════════════════════════════════════════════════════
#  INHALTSVERZEICHNIS
#
#  Die Hoehe der Bausteine haengt NICHT von den Seitenzahlen ab (sie stehen
#  rechtsbuendig und brechen nichts um). Deshalb laesst sich der Umbruch mit
#  Platzhalterzahlen messen, BEVOR die Seitenzahlen des Buchteils feststehen -
#  und danach mit den echten Zahlen setzen.
# ═════════════════════════════════════════════════════════════════════════════
def toc_bausteine(starts,nav,merken=False):
    B=[b_titel("Inhalt",unterzeile=BANDNAME)]
    for i,(titel,pg) in enumerate(starts):
        def b_kap(h,d,y,i=i,titel=titel,pg=pg):
            hoehe=fd.LH+22
            h.R(fd.X0,y,fd.X0+50,y+hoehe,9,fill=fd.STIL["akzent"])
            fd.T(h,fd.X0+25,y+hoehe/2+1,str(i+1),fd.schrift("bold",fd.MARKE_ZIFFER),
                 fd.STIL["akzent_schrift"],anchor="mm")
            ft=fd.schrift("med",FOE)
            fd.T(h,fd.X0+68,y+hoehe/2,titel,ft,fd.STIL["text"],anchor="lm")
            seite="Seite %d"%pg; fs=fd.schrift("med",fd.FLIESS)
            fd.T(h,fd.X1,y+hoehe/2,seite,fs,fd.STIL["akzent"],anchor="rm")
            x=fd.X0+68+h.tw(titel,ft)+14
            while x<fd.X1-h.tw(seite,fs)-14:
                h.circ(x,y+hoehe/2,1.3,fill=fd.STIL["zart"]); x+=12
            if merken is not False: merken.append((fd.X0,y,fd.X1,y+hoehe,pg))
            return y+hoehe
        B.append(bst("Kapitelzeile %d"%(i+1),b_kap,abstand=16,haftet=1))
    B[-1].abstand=fd.ABS_ABSCHNITT
    # Alle Themen mit Seitenzahl. Im Regelheft steht diese Liste nur auf der
    # Trennseite - im Foerderheft gehoert sie nach vorn: Wer sein Thema sucht,
    # soll es finden, ohne blaettern zu muessen.
    for ci,chap in enumerate(nav):
        B.append(b_unterkopf("Kapitel %d · %s"%(ci+1,chap["title"])))
        for k,(lbl,pg) in enumerate(chap["topics"]):
            def b_thema(h,d,y,k=k,lbl=lbl,pg=pg):
                hoehe=LH_FOE+10
                r=round(fd.einheiten(fd.FLIESS)*0.55,1)
                h.circ(fd.X0+r+4,y+hoehe/2,r,fill=fd.STIL["akzent"])
                fd.T(h,fd.X0+r+4,y+hoehe/2+1,str(k+1),fd.schrift("bold",fd.KLEIN),
                     fd.STIL["akzent_schrift"],anchor="mm")
                fd.T(h,fd.X0+44,y+hoehe/2,lbl,fd.schrift("reg",fd.FLIESS),
                     fd.STIL["text"],anchor="lm")
                fd.T(h,fd.X1,y+hoehe/2,str(pg),fd.schrift("med",fd.FLIESS),
                     fd.STIL["akzent"],anchor="rm")
                if merken is not False: merken.append((fd.X0,y,fd.X1,y+hoehe,pg))
                return y+hoehe
            B.append(bst("Thema %d.%d"%(ci+1,k+1),b_thema,abstand=4))
        tpg=chap["testseite"]
        if tpg:
            def b_test(h,d,y,ci=ci,tpg=tpg):
                hoehe=LH_FOE+10
                r=round(fd.einheiten(fd.FLIESS)*0.55,1)
                h.circ(fd.X0+r+4,y+hoehe/2,r,outline=fd.STIL["akzent"],w=1.6)
                fd.raute(d,fd.X0+r+4,y+hoehe/2,r*0.4,fd.STIL["akzent"])
                fd.T(h,fd.X0+44,y+hoehe/2,"Fördertest %d"%(ci+1),
                     fd.schrift("med",fd.FLIESS),fd.STIL["akzent"],anchor="lm")
                fd.T(h,fd.X1,y+hoehe/2,str(tpg),fd.schrift("med",fd.FLIESS),
                     fd.STIL["akzent"],anchor="rm")
                if merken is not False: merken.append((fd.X0,y,fd.X1,y+hoehe,tpg))
                return y+hoehe
            B.append(bst("Testzeile %d"%(ci+1),b_test,abstand=4))
        B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_para("Alle Lösungen stehen im Lehrerband.",
                    art="med",grad=fd.FLIESS,name="Lösungshinweis"))
    return B


def toc_messen(nav_form):
    """Wie viele Seiten braucht der Inhalt? Mit Platzhalterzahlen gemessen.

    Die Hoehe der Zeilen haengt nicht von der gedruckten Seitenzahl ab - sie steht
    rechtsbuendig und bricht nichts um. Deshalb darf hier eine Platzhalterzahl
    stehen, und das Ergebnis gilt auch fuer die echten Zahlen."""
    starts=[(t,1) for t,_ in nav_form]
    nav=[{"title":t,"topics":[(l,1) for l in labels],"testseite":1}
         for t,labels in nav_form]
    B=toc_bausteine(starts,nav,merken=False)
    return len(fd.umbrechen(B,fd.messe_bausteine(B,fd.STIL)))


def toc(starts,nav,pn):
    """Inhalt setzen und dabei die Klickflaechen mitschreiben."""
    del TOCBOXEN[:]
    boxen=[]
    B=toc_bausteine(starts,nav,merken=boxen)
    hoehen=fd.messe_bausteine(B,fd.STIL)
    del boxen[:]                       # der Messlauf zaehlt nicht
    seiten=fd.umbrechen(B,hoehen)
    raus=[]
    for si,eintraege in enumerate(seiten):
        im,d=newp(fd.GRUND); h=hp(im,d)
        marke=len(boxen)
        for i,y in eintraege: B[i].f(h,d,y)
        for x0,y0,x1,y1,ziel in boxen[marke:]:
            TOCBOXEN.append((pn+si,x0,y0,x1,y1,ziel))
        raus.append(bp.blatt(im,d,h,"Inhalt %d/%d"%(si+1,len(seiten)),BANDNAME,
                             "Inhalt",si,len(seiten),pn+si))
    return raus


# ═════════════════════════════════════════════════════════════════════════════
#  KAPITEL-TRENNSEITE
# ═════════════════════════════════════════════════════════════════════════════
def divider(num,ch,pn):
    boxen=[]
    B=[]
    def b_kopf(h,d,y):
        fd.T(h,fd.X0,y,"Förderkapitel",fd.schrift("med",fd.ZWISCHEN),fd.STIL["akzent"])
        yy=y+LH_ZWISCH+10
        f=fd.schrift("bold",bp.DISPLAY_MITTEL)
        fd.T(h,fd.X0,yy,"%02d"%num,f,fd.STIL["akzent"])
        b=h.tw("%02d"%num,f)+30
        ft=fd.schrift("bold",fd.HAUPT)
        zeilen=h.wrap(ch["title"],ft,fd.X1-fd.X0-b)
        for i,z in enumerate(zeilen):
            fd.T(h,fd.X0+b,yy+(LH_DISPLAY-len(zeilen)*LH_HAUPT)/2+i*LH_HAUPT,z,ft,
                 fd.STIL["h1"])
        yy+=max(LH_DISPLAY,len(zeilen)*LH_HAUPT)+8
        h.ln([(fd.X0,yy),(fd.X1,yy)],fd.STIL["akzent"],1.4)
        return yy+4
    B.append(bst("Kapitelkopf",b_kopf,fd.ABS_ABSCHNITT,haftet=1))
    _fd=lehrplan.feld(ch["id"].replace("foe_","gts_"))
    if _fd:
        _nr,_nm,_bk=_fd
        B.append(b_para("Inhaltsfeld %d · %s"%(_nr,_nm),art="med",
                        farbe=fd.STIL["akzent"],name="Inhaltsfeld",haftet=1))
        B.append(b_para("Basiskonzepte: "+" · ".join(_bk.keys()),grad=fd.KLEIN,
                        lh=fd.LH_KLEIN,breite=LESE_KLEIN,
                        abstand=fd.ABS_ABSCHNITT,name="Basiskonzepte"))
    B.append(b_unterkopf("Die Themen dieses Kapitels"))
    for i,tid in enumerate(ch["topics"]):
        def b_thema(h,d,y,i=i,tid=tid):
            hoehe=LH_FOE+18
            h.R(fd.X0,y,fd.X1,y+hoehe,hoehe/2,outline=fd.STIL["linie"],w=1.2)
            r=round(fd.einheiten(FOE)*0.55,1)
            h.circ(fd.X0+24,y+hoehe/2,r,fill=fd.STIL["akzent"])
            fd.T(h,fd.X0+24,y+hoehe/2+1,str(i+1),fd.schrift("bold",fd.KLEIN),
                 fd.STIL["akzent_schrift"],anchor="mm")
            fd.T(h,fd.X0+50,y+hoehe/2,SEITEN[tid].get("titel") or SEITEN[tid]["name"],
                 fd.schrift("med",FOE),fd.STIL["text"],anchor="lm")
            boxen.append((fd.X0,y,fd.X1,y+hoehe))
            return y+hoehe
        B.append(bst("Thema %d"%(i+1),b_thema,abstand=10))
    B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_para(LEITWORT,art="med",grad=fd.ZWISCHEN,lh=LH_ZWISCH,
                    farbe=fd.STIL["akzent"],name="Leitwort"))
    # Die Kaestchen werden beim Messen UND beim Setzen gezeichnet; nur der zweite
    # Durchgang zaehlt, sonst stuenden die Klickflaechen doppelt in der Liste.
    hoehen=fd.messe_bausteine(B,fd.STIL)
    del boxen[:]
    seiten=fd.umbrechen(B,hoehen)
    raus=[]
    for si,eintraege in enumerate(seiten):
        im,d=newp(fd.GRUND); h=hp(im,d)
        marke=len(boxen)
        for i,y in eintraege: B[i].f(h,d,y)
        for r in boxen[marke:]: TRENNBOXEN.setdefault(pn+si,[]).append(r)
        raus.append(bp.blatt(im,d,h,"Trennseite %s %d/%d"%(ch["id"],si+1,len(seiten)),
                             "Kapitel %d"%num,ch["title"],si,len(seiten),pn+si))
    return raus


# ═════════════════════════════════════════════════════════════════════════════
#  FÖRDERTEST
# ═════════════════════════════════════════════════════════════════════════════
# Reihenfolge der Wort-Kaertchen in der Zuordnungsaufgabe. Bewusst gemischt,
# damit die Loesung nicht schon durch die Reihenfolge verraten wird - und als
# Konstante, damit der Lehrerband dieselben Buchstaben nennt wie das Heft.
ZU_PERM=[2,0,3,1]
def zu_buchstabe(j): return chr(65+ZU_PERM.index(j))

# Wo das Kaestchen fuer den Zuordnungsbuchstaben steht. Angekreuzt wird, nicht
# gelesen - das Kaestchen darf deshalb am Blattrand bleiben; die Aussage davor
# endet an der Lesespalte.
ZU_X   = fd.X1-ANKREUZ-14
ZU_TEXT= min(ZU_X-24,fd.KASTEN_X1)


def _auftrag(text):
    """"Ordne zu: Schreibe ..." -> Operator fuer die Marke, Rest fuer die Zeile.

    Die Abschnittsmarke des Moduls bricht ihre Ueberschrift NICHT um; ein langer
    Auftrag liefe darin still ueber den Rand. Der Operator steht deshalb in der
    Marke, der Rest als Zeile darunter - kein Wort geht verloren, keines steht
    doppelt."""
    if ":" in text:
        op,rest=text.split(":",1)
        if rest.strip(): return op.strip(),rest.strip()
    return text,""


def ch_foerdertest(t,ch,pn):
    A=t["aufgaben"]; a1,a2,a3,a4=A; tot=t["punkte"]
    B=[b_titel(t["titel"])]

    def b_kopfzeile(h,d,y):
        f=fd.schrift("med",FOE)
        hoehe=LH_FOE+24
        h.R(fd.X0,y,fd.X1,y+hoehe,8,outline=fd.STIL["akzent"],w=1.4)
        yy=y+12; xx=fd.X0+20
        for lab,br in (("Name:",300),("Klasse: "+KL,0),("Datum:",180)):
            fd.T(h,xx,yy,lab,f,fd.STIL["text"])
            w=h.tw(lab,f)
            if br:
                h.ln([(xx+w+10,yy+LH_FOE*0.82),(xx+w+10+br,yy+LH_FOE*0.82)],
                     fd.STIL["linie"],fd.LINIE_STAERKE)
            xx+=w+br+34
        fd.T(h,fd.X1-20,yy,"Punkte  ____ / %d"%tot,fd.schrift("bold",FOE),
             fd.STIL["akzent"],anchor="ra")
        return y+hoehe
    B.append(bst("Testkopf",b_kopfzeile,fd.ABS_AUFGABE))
    B.append(b_para(t["hinweis"],art="med",abstand=fd.ABS_ABSCHNITT,name="Testhinweis"))

    # ① Ankreuzen
    B.append(b_marke(1,"Kreuze an: die richtige Antwort.",punkte=a1["punkte"]))
    for i,fr in enumerate(a1["fragen"]):
        B.append(b_punkt(fr["frage"],i=i,zeichen=chr(97+i),
                         haftet=len(fr["optionen"]),name="Testfrage %d"%(i+1)))
        for o in fr["optionen"]:
            B.append(b_ankreuz(o,breite=LESE-ANKREUZ-18-bp.SCHEIBE_X,name="Testantwort"))
        B[-1].abstand=fd.ABS_AUFGABE
    B[-1].abstand=fd.ABS_ABSCHNITT

    # ② Zuordnen
    _op,_rest=_auftrag(a2["auftrag"])
    B.append(b_marke(2,_op,punkte=a2["punkte"]))
    if _rest: B.append(b_para(_rest,art="med",haftet=1,name="Zuordnungsauftrag"))
    chips=[a2["paare"][j][1] for j in ZU_PERM]
    B.append(bp.b_wortbank(["%s  %s"%(chr(65+k),wt) for k,wt in enumerate(chips)],
                           ueberschrift="Wähle aus"))
    for i,(links,_r) in enumerate(a2["paare"]):
        def b_paar(h,d,y,i=i,links=links):
            r=round(fd.einheiten(FOE)*0.55,1)
            h.circ(fd.X0+r,y+LH_FOE*0.5,r,fill=fd.STIL["akzent"])
            fd.T(h,fd.X0+r,y+LH_FOE*0.5+1,str(i+1),fd.schrift("bold",fd.KLEIN),
                 fd.STIL["akzent_schrift"],anchor="mm")
            bp.ankreuz(h,d,ZU_X,y+2)
            ende=fd.para(h,fd.X0+bp.SCHEIBE_X,y,links,fd.schrift("reg",FOE),
                         fd.STIL["text"],ZU_TEXT-fd.X0-bp.SCHEIBE_X,LH_FOE)
            return max(ende,y+ANKREUZ+4)
        B.append(bst("Zuordnung %d"%(i+1),b_paar,fd.ABS_ZEILE))
    B[-1].abstand=fd.ABS_ABSCHNITT

    # ③ Luecken
    _op,_rest=_auftrag(a3["auftrag"])
    B.append(b_marke(3,_op,punkte=a3["punkte"]))
    if _rest: B.append(b_para(_rest,art="med",haftet=1,name="Lückenauftrag"))
    B.append(bp.b_wortbank(a3["wortbank"]))
    for lk in a3["luecken"]: B.append(b_luecke(lk))
    B[-1].abstand=fd.ABS_ABSCHNITT

    # ④ Erklaeren
    B.append(b_marke(4,"Erkläre in ganzen Sätzen.",punkte=a4["punkte"]))
    B.append(b_para(a4["frage"],art="med",haftet=2,name="Transferfrage"))
    def b_start(h,d,y):
        f=fd.schrift("med",FOE)
        fd.T(h,fd.X0,y,"Satzanfang:",f,fd.STIL["akzent"])
        b=h.tw("Satzanfang:",f)+12
        return fd.para(h,fd.X0+b,y,a4["satzstarter"],fd.schrift("reg",FOE),
                       fd.STIL["text"],LESE-b,LH_FOE)
    B.append(bst("Satzanfang",b_start,abstand=8,haftet=2))
    B+=b_linien(max(int(a4.get("zeilen",3)),3))
    B[-1].abstand=fd.ABS_ABSCHNITT

    # Auswertungsschluessel statt Notenspiegel: vier Stufen mit Ermutigung
    B.append(b_unterkopf("So wertest du aus"))
    zeilen=[[(f"{hi}–{lo} P" if hi!=lo else f"{hi} P"),txt] for lo,hi,txt in t["schluessel"]]
    B.append(bst("Schlüssel",
                 lambda h,d,y: bp.tabelle(h,d,y,fd.STIL,["Punkte","Das heißt"],
                                          zeilen,[0.22,0.78]),
                 fd.ABS_AUFGABE))
    B.append(b_para("Viel Erfolg – du schaffst das!",art="bold",grad=fd.ZWISCHEN,
                    farbe=fd.STIL["akzent"],lh=LH_ZWISCH,name="Zuspruch"))
    return bp.setze_einheit(B,"Fördertest · "+ch["title"],t["titel"],pn,
                            "Fördertest "+ch["id"])


# ═════════════════════════════════════════════════════════════════════════════
#  LEHRERBAND
# ═════════════════════════════════════════════════════════════════════════════
LB_INHALT=["Lösungen und Erwartungshorizonte","typische Fehler und gestufte Hilfen",
           "Ersatzweg, wenn die Simulation nicht läuft",
           "Kernlehrplan-Bezüge und Kompetenzcodes",
           "Auswertung der beiden Fördertests"]

LB_HINWEISE=[
 ("Aufbau jeder Einheit","Eine Doppelseite pro Lernziel: Seite A (Entdecken) mit "
  "Geschichte, Vermutung, Simulation und vorausgefüllter Beispielzeile · Seite B "
  "(Verstehen & Üben) mit Merksatz, Wortbank, gelöstem Beispiel, drei Aufgaben, "
  "drei Hilfestufen und Selbstcheck."),
 ("Die drei Hilfestufen","Hilfe 1 verweist auf Wortbank oder Schlüsselstelle · "
  "Hilfe 2 gibt den Satzanfang · Hilfe 3 ist die fast fertige Antwort, nur das letzte "
  "Wort fehlt (es steht in diesem Band). Die Stufen sind Lernhilfen, keine "
  "Leistungsstufen."),
 ("Ohne Simulation","Jede Lehrerseite nennt unter „Wenn die Simulation nicht geht“ die "
  "konkreten Bildschirm-Ergebnisse als Karten- oder Tafelbild. Damit ist jede Seite "
  "auch ohne Gerät lösbar."),
 ("Kompetenzcodes","Auf den Schülerseiten stehen bewusst keine Kompetenzchips. Die "
  "Bezüge zum Kernlehrplan (Heft 3108) stehen je Einheit in diesem Band. Einzelträger "
  "im Heft: E4 auf fo2 · K3 auf fo6 · E6 auf fw8 · K2 auf fw12."),
 ("Fördertests","Je Kapitel ein Test mit 13 Punkten: überwiegend Grundlagen, genau eine "
  "Transferaufgabe. Der Auswertungsschlüssel auf der Testseite ermutigt statt zu "
  "benoten; eine Notengebung bleibt der Fachkonferenz überlassen."),
]


def lb_cover():
    im,d=newp(fd.GRUND); h=hp(im,d)
    y=fd.OBEN
    fd.T(h,fd.X0,y,"Lehrerband",fd.schrift("med",fd.ZWISCHEN),fd.STIL["akzent"])
    y+=LH_ZWISCH+18
    fd.T(h,fd.X0,y,"FELO",fd.schrift("bold",bp.DISPLAY_GROSS),fd.STIL["h1"])
    y+=round(fd.einheiten(bp.DISPLAY_GROSS)*fd.ZAB,2)+10
    h.ln([(fd.X0,y),(fd.X1,y)],fd.STIL["akzent"],1.6)
    y+=24
    fd.T(h,fd.X0,y,"Physik "+KL+" · Förderheft",fd.schrift("bold",fd.HAUPT),fd.STIL["h1"])
    y+=LH_HAUPT+8
    fd.T(h,fd.X0,y,SFORM,fd.schrift("med",fd.ZWISCHEN),fd.STIL["akzent"])
    y+=LH_ZWISCH+40
    for t in LB_INHALT:
        fd.raute(d,fd.X0+7,y+fd.LH*0.45,6,fd.STIL["akzent"])
        y=fd.para(h,fd.X0+28,y,t,fd.schrift("med",fd.FLIESS),fd.STIL["text"],LESE-28,fd.LH)+10
    fd.T(h,fd.X0,fd.UNTEN-LH_ZWISCH,"Nur für Lehrkräfte – nicht für die Schülerhand",
         fd.schrift("bold",fd.ZWISCHEN),fd.STIL["akzent"])
    bp.PROBE.append(("Lehrerband Deckblatt",1,bp._unterkante(im)))
    return fertig(im)


def lb_hinweise(pn):
    # Zeilenweise umbrechbar wie der ganze Lehrerband: Diese Bloecke sind lang,
    # und ein Absatz, der als EIN Baustein nirgends hinpasst, laeuft unten aus
    # dem Blatt heraus, statt sich zu teilen.
    B=[b_titel("Hinweise zum Einsatz",unterzeile=BANDNAME+" · Lehrerband")]
    B+=b_zeilen("Das Förderheft richtet sich an Lernende mit Förderbedarf Lernen, "
        "geringer Lesekompetenz, Deutsch als Zweitsprache oder großen fachlichen Lücken "
        f"(Sprachniveau A2–B1). Es verfolgt die gleichen fachlichen Ziele wie FELO Physik "
        f"{KL} – die Schwierigkeit sinkt durch Sprache, kleinere Schritte und Hilfen, nie "
        "durch falsche Physik.",grad=fd.FLIESS,abstand=fd.ABS_ABSCHNITT,name="Vorspann")
    for titel,txt in LB_HINWEISE:
        B.append(b_unterkopf(titel,breite=LESE))
        B+=b_zeilen(txt,grad=fd.FLIESS,abstand=fd.ABS_ABSCHNITT,name="Hinweis")
    return bp.setze_einheit(B,BANDNAME+" · Lehrerband","Hinweise zum Einsatz",pn,
                            "Lehrerhinweise")


def lb_testloesungen(t,ch,pn):
    A=t["aufgaben"]; a1,a2,a3,a4=A
    B=[b_titel(t["titel"],unterzeile="Lösungen und Auswertung",unterzeile_grad=fd.FLIESS)]
    B.append(b_marke(1,"Kreuze an – Lösungen",punkte=a1["punkte"]))
    for i,fr in enumerate(a1["fragen"]):
        B+=b_zeilen("%s) %s"%(chr(97+i),fr["optionen"][fr["richtig"]]),
                    grad=fd.FLIESS,punkt=True,name="Testlösung")
    B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_marke(2,"Ordne zu – Lösungen",punkte=a2["punkte"]))
    for j,(links,rechts) in enumerate(a2["paare"]):
        B+=b_zeilen("%d) %s  →  %s · %s"%(j+1,links,zu_buchstabe(j),rechts),
                    grad=fd.FLIESS,punkt=True,name="Zuordnungslösung")
    B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_marke(3,"Trage ein – Lösungen",punkte=a3["punkte"]))
    B+=b_zeilen(" · ".join(lk["loesung"] for lk in a3["luecken"]),grad=fd.FLIESS,
                abstand=fd.ABS_ABSCHNITT,name="Lückenlösung")
    B.append(b_marke(4,"Erklären – Erwartungshorizont",punkte=a4["punkte"]))
    B+=b_zeilen(a4["erwartung"],grad=fd.FLIESS,name="Erwartung")
    B.append(b_para("Teilpunkte:",art="med",grad=fd.FLIESS,haftet=2,name="Teilpunkte"))
    for tp in a4["teilpunkte"]:
        B+=b_zeilen(tp,grad=fd.FLIESS,punkt=True,name="Teilpunkt")
    B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_unterkopf("Auswertungsschlüssel",breite=LESE))
    zeilen=[[(f"{hi}–{lo} P" if hi!=lo else f"{hi} P"),txt] for lo,hi,txt in t["schluessel"]]
    B.append(bst("Schlüssel",
                 lambda h,d,y: fd.tabelle(h,d,y,fd.STIL,["Punkte","Das heißt"],
                                          zeilen,[0.22,0.78]),
                 fd.ABS_AUFGABE))
    return bp.setze_einheit(B,"Lehrerband · Lösungen",t["titel"],pn,
                            "Testlösungen "+ch["id"])


def build_lehrerband():
    pages=[lb_cover()]
    pn=2
    marks=[]
    _hi=lb_hinweise(pn); marks.append(("Hinweise zum Einsatz",pn))
    pages+=_hi; pn+=len(_hi)
    for ch in CHAPTERS:
        for tid in ch["topics"]:
            marks.append((SEITEN[tid].get("titel") or SEITEN[tid]["name"],pn))
            lp=bp.seite_l(SEITEN[tid],pn)
            pages+=lp; pn+=len(lp)
        t=TESTS.get(ch["id"])
        if t:
            marks.append((t["titel"]+" – Lösungen",pn))
            lt=lb_testloesungen(t,ch,pn); pages+=lt; pn+=len(lt)
    out=os.path.join(HERE,"build","lehrerband.pdf")
    pages[0].save(out,"PDF",resolution=150,save_all=True,append_images=pages[1:])
    ziel=os.path.expanduser(f"~/Desktop/{DATEINAME}_Lehrerband.pdf")
    try:
        from pypdf import PdfReader, PdfWriter
        from pypdf.generic import NameObject
        r=PdfReader(out); w=PdfWriter()
        for p in r.pages: w.add_page(p)
        w.add_outline_item("Deckblatt",0)
        for lbl,pg in marks: w.add_outline_item(lbl,pg-1)
        w._root_object[NameObject("/PageMode")]=NameObject("/UseOutlines")
        w.add_metadata({"/Title":f"FELO Physik {KL} – Förderheft {SFORM} – Lehrerband",
                        "/Author":"Abdullah Lala","/Creator":"FELO",
                        "/Subject":"Lösungen, Erwartungshorizonte und typische Fehler"})
        with open(ziel,"wb") as f: w.write(f)
    except Exception as e:
        import shutil; shutil.copy2(out,ziel); print("Lehrerband ohne Lesezeichen:",e)
    print(f"Lehrerband: {len(pages)} Seiten -> {ziel}")
    # Auch die Textprotokolle zurueckgeben: Die Zeilenprobe soll den GANZEN
    # gesetzten Band messen, nicht nur den Schuelerteil. Der Lehrerband ist mit
    # 232 von 356 Seiten der groessere Teil - haette er zu lange Zeilen, saehe
    # man es an einer Probe ueber die Schuelerseiten allein nicht.
    return len(pages),[SEITENTEXTE.get(id(p),[]) for p in pages]


# ═════════════════════════════════════════════════════════════════════════════
#  E-BOOK: navigierbares PDF
# ═════════════════════════════════════════════════════════════════════════════
def build_ebook(src,dst,nav,qrpages,seitentexte,toc_pn,toc_n):
    from pypdf import PdfReader, PdfWriter
    from pypdf.generic import (ArrayObject, NameObject, DictionaryObject, NumberObject,
                               FloatObject, TextStringObject)
    r=PdfReader(src); w=PdfWriter()
    for p in r.pages: w.add_page(p)
    w.add_outline_item("Deckblatt",0)
    w.add_outline_item("So arbeitest du",1)
    w.add_outline_item("Inhalt",toc_pn-1)
    for i,chap in enumerate(nav):
        par=w.add_outline_item(f"Kapitel {i+1} · {chap['title']}",chap["page"]-1)
        for lbl,pg in chap["subs"]:
            w.add_outline_item(lbl,pg-1,parent=par)
    scale=72.0/150.0; Hpt=float(r.pages[0].mediabox.height)
    def rc(x0,y0,x1,y1): return (x0*scale, Hpt-y1*scale, x1*scale, Hpt-y0*scale)
    def link(page_idx,box,target_pg):
        tgt=w.pages[target_pg-1].indirect_reference
        annot=DictionaryObject({NameObject("/Type"):NameObject("/Annot"),
            NameObject("/Subtype"):NameObject("/Link"),
            NameObject("/Rect"):ArrayObject([FloatObject(v) for v in box]),
            NameObject("/Border"):ArrayObject([NumberObject(0),NumberObject(0),NumberObject(0)]),
            NameObject("/Dest"):ArrayObject([tgt,NameObject("/Fit")])})
        ref=w._add_object(annot); pg=w.pages[page_idx]
        if "/Annots" in pg: pg[NameObject("/Annots")].append(ref)
        else: pg[NameObject("/Annots")]=ArrayObject([ref])
    for i,chap in enumerate(nav):                       # Deckblatt-Kaesten
        if i<len(COVERBOXEN): link(0,rc(*COVERBOXEN[i]),chap["page"])
    for seite,x0,y0,x1,y1,ziel in TOCBOXEN:             # Inhalt
        if seite: link(seite-1,rc(x0,y0,x1,y1),ziel)
    for chap in nav:                                    # Trennseiten-Kaesten
        rechtecke=[]
        for sp in range(chap["page"],chap["page"]+chap.get("trennseiten",1)):
            for r2 in TRENNBOXEN.get(sp,[]): rechtecke.append((sp,r2))
        for i,(lbl,pg) in enumerate(chap["topics"]):
            if i>=len(rechtecke):
                print(f"   Hinweis: kein Kästchen für {lbl} auf Seite {chap['page']}"); continue
            sp,r2=rechtecke[i]; link(sp-1,rc(*r2),pg)
    def weblink(page_idx,box,url):
        act=DictionaryObject({NameObject("/S"):NameObject("/URI"),
                              NameObject("/URI"):TextStringObject(url)})
        annot=DictionaryObject({NameObject("/Type"):NameObject("/Annot"),
            NameObject("/Subtype"):NameObject("/Link"),
            NameObject("/Rect"):ArrayObject([FloatObject(v) for v in box]),
            NameObject("/Border"):ArrayObject([NumberObject(0),NumberObject(0),NumberObject(0)]),
            NameObject("/A"):act})
        ref=w._add_object(annot); pg=w.pages[page_idx]
        if "/Annots" in pg: pg[NameObject("/Annots")].append(ref)
        else: pg[NameObject("/Annots")]=ArrayObject([ref])
    n_sim=0
    for pg_nr,tid in qrpages.items():
        u=sim_url(tid)
        if not u: continue
        weblink(pg_nr-1,rc(*bp.QR_KASTEN),u); n_sim+=1
    # Seitenzahl unten rechts fuehrt zurueck ins Inhaltsverzeichnis
    for i in range(toc_pn+toc_n-1,len(w.pages)):
        link(i,rc(fd.X1-70,fd.FUSS_Y-6,fd.X1,fd.FUSS_Y+26),toc_pn)
    w._root_object[NameObject("/PageMode")]=NameObject("/UseOutlines")
    w.add_metadata({"/Title":f"FELO Physik {KL} – Förderheft {SFORM}",
                    "/Author":"Abdullah Lala",
                    "/Subject":FACHGEBIETE,
                    "/Keywords":f"FELO, Physik, Klasse {KL}, {SFORM}, Förderheft, "
                                f"einfache Sprache, {INHALTSFELDER}, {FACHGEBIETE}, "
                                "Fassung 1.1, Stand 2026-09-09",
                    "/Creator":"FELO"})
    if seitentexte:
        try:
            from textschicht import anhaengen
            nl,nz=anhaengen(w,seitentexte)
            print(f"   Textebene: {nl} Zeilen, {nz} Zeichen durchsuchbar hinterlegt")
        except Exception as e:
            print("   Textebene übersprungen:",e)
    with open(dst,"wb") as f: w.write(f)
    print(f"   E-Book: {len(w.pages)} Seiten, {n_sim} Simulations-Links, Lesezeichen offen")
    return dst


# ═════════════════════════════════════════════════════════════════════════════
#  ZEILENPROBE - wie lang ist eine gesetzte Lesezeile WIRKLICH?
#
#  Die Vorgabe nennt 55 bis 75 Zeichen je Zeile und 85 als Obergrenze. Das
#  Modul haelt dafuer eine Konstante bereit (SPALTE_65 = 697 Einheiten "sind
#  rund 65 Zeichen") - aber eine Konstante ist kein Messwert. Der Foerdersatz
#  laeuft zwei Stufen groesser als der Fliesstext, fuer den die Konstante
#  gerechnet wurde; ob damit 62 oder 92 Zeichen auf einer Zeile stehen,
#  entscheidet allein der Umbruch. Also wird an den gesetzten Blaettern
#  gemessen.
#
#  Grundlage ist das Protokoll der durchsuchbaren Textebene (build_final:
#  TEXTE/SEITENTEXTE). Es haelt fuer JEDEN gesetzten Lauf Anfang, Grundlinie,
#  Breite und Grad fest - also genau das, was gedruckt wird.
# ═════════════════════════════════════════════════════════════════════════════
# Groesster Abstand zwischen zwei Laeufen, der noch als Wortzwischenraum gilt -
# als Anteil des Schriftgrads. Ein Leerzeichen misst in SourceSans3 gut ein
# Viertel Geviert; 0,6 laesst also Luft, trennt aber die Spalten einer Tabelle
# (dort liegen zwischen zwei Zellen ueber 100 Einheiten).
WORTLUECKE = 0.6
# Zwei Zeilen gehoeren zu DEMSELBEN Absatz, wenn ihre Grundlinien genau eine
# Zeilenhoehe auseinanderliegen - also Grad mal ZAB. Nicht "irgendwie nahe
# beieinander": Der erste Anlauf liess alles bis 62 Einheiten gelten und zog
# damit auch Listen zusammen (Inhaltsverzeichnis, Ankreuzzeilen, Alltagspunkte).
# Deren kurze Zeilen galten dann als "gefuellt" und drueckten den Median von 66
# auf 38 - eine Zahl, die nichts ueber den Fliesstext aussagt.
ZEILENTOLERANZ = 1.5
# Und so breit muss eine Zeile mindestens angelegt sein, damit sie ueber die
# LESBARKEIT etwas aussagt - als Anteil der Lesespalte. Eine Tabellenspalte ist
# rund ein Drittel so breit; ihre Zellen sind kurz, weil die Spalte kurz ist,
# nicht weil der Satz gut waere.
LESEBREITE_MIN = 0.6


def lesezeilen(protokoll):
    """Die Laeufe eines Blattes zu Lesezeilen zusammenziehen.

    Laeufe auf derselben Grundlinie gehoeren nur dann zu EINER Zeile, wenn sie
    aneinander anschliessen: Ein Merksatz wird Wort fuer Wort gesetzt (fette
    Stellen, Luecken), eine Tabellenzeile dagegen traegt je Spalte einen eigenen
    Lauf - und die liest niemand in einem Zug. Dieselbe Unterscheidung trifft
    Probe 6 im Modul."""
    nach_y={}
    for x,y,br,gr,s in protokoll:
        nach_y.setdefault(round(y,1),[]).append((x,br,gr,s))
    zeilen=[]
    for y,laeufe in sorted(nach_y.items()):
        laeufe.sort()
        txt=""; x0=0.0; grad=0.0; ende=None
        for x,br,gr,s in laeufe:
            if ende is not None and x-ende>gr*WORTLUECKE:
                zeilen.append((x0,y,grad,ende-x0,txt)); txt=""
            if not txt: x0=x; grad=gr
            txt=(txt+" "+s) if txt else s
            ende=x+br
        if txt: zeilen.append((x0,y,grad,ende-x0,txt))
    return zeilen


def zeilenprobe(seitentexte):
    """(alle Zeilenlaengen, gefuellte Zeilen, gefuellte LESEzeilen) in Zeichen.

    Drei Zahlen, weil drei Fragen dahinterstehen:
      alle      - keine gedruckte Zeile darf ueber ZEICHEN_MAX gehen.
      gefuellt  - vom Umbruch wirklich voll gemachte Zeilen, also alle ausser
                  der letzten jedes Absatzes. Die letzte ist immer kurz; naehme
                  man sie mit, saehe der Median besser aus, als der Satz ist.
      lese      - davon die, die ueber die Lesespalte laufen. An ihnen haengt
                  die Vorgabe "55 bis 75 Zeichen": Eine Tabellenzelle ist kurz,
                  weil ihre Spalte kurz ist, und sagt darueber nichts.

    Ein Absatz sind Zeilen mit gleichem Anfang, gleichem Schriftgrad und einer
    Grundlinie GENAU eine Zeilenhoehe darunter."""
    alle=[]; gefuellt=[]; lese=[]
    mindest=LESEBREITE_MIN*LESE
    for st in seitentexte:
        zl=lesezeilen(st)
        alle+=[len(t) for _x,_y,_g,_b,t in zl]
        spalten={}
        for x,y,g,b,t in zl:
            spalten.setdefault((round(x,1),round(g,1)),[]).append((y,b,t))
        for (_x,grad),v in spalten.items():
            v.sort()
            lh=grad*fd.ZAB
            kette=[v[0]]
            def ernten(kette):
                if len(kette)<2: return
                for _y,b,t in kette[:-1]:
                    gefuellt.append(len(t))
                    if b>=mindest: lese.append(len(t))
            for y,b,t in v[1:]:
                if abs(y-kette[-1][0]-lh)<=ZEILENTOLERANZ: kette.append((y,b,t))
                else: ernten(kette); kette=[(y,b,t)]
            ernten(kette)
    return alle,gefuellt,lese


# ═════════════════════════════════════════════════════════════════════════════
#  ZUSAMMENBAU
# ═════════════════════════════════════════════════════════════════════════════
if __name__=="__main__":
    # Erst das Vorwort setzen: es bestimmt, ab welcher Seite das Inhaltsverzeichnis
    # steht. Dann die Laenge des Inhalts MESSEN (mit Platzhalterzahlen), damit der
    # Buchteil weiss, wo er anfaengt. Frueher war beides eine Annahme - im neuen
    # Satz entscheidet der Umbruch, und eine falsche Annahme haette jede
    # Seitenzahl im Inhalt und in der Bruecke verschoben.
    about=so_arbeitest_du(2)
    toc_pn=2+len(about)
    toc_n=toc_messen([(ch["title"],
                       [SEITEN[t].get("titel") or SEITEN[t]["name"] for t in ch["topics"]])
                      for ch in CHAPTERS])

    body=[]; qrpages={}
    pn=toc_pn+toc_n
    starts=[]; nav=[]
    for ci,ch in enumerate(CHAPTERS):
        starts.append((ch["title"],pn))
        chap={"title":ch["title"],"page":pn,"subs":[],"topics":[],"testseite":None,
              "trennseiten":1}
        _tr=divider(ci+1,ch,pn); chap["trennseiten"]=len(_tr)
        body+=_tr; pn+=len(_tr)
        for nr,tid in enumerate(ch["topics"]):
            cfg=SEITEN[tid]
            lbl=cfg.get("titel") or cfg["name"]
            chap["subs"].append((lbl,pn)); chap["topics"].append((lbl,pn))
            qrpages[pn]=tid
            _a=bp.seite_a(cfg,pn,nr+1); body+=_a; pn+=len(_a)
            qrpages[pn]=tid                      # der Code steht auf Seite A UND B
            _b=bp.seite_b(cfg,pn,nr+1); body+=_b; pn+=len(_b)
        t=TESTS.get(ch["id"])
        if t:
            chap["subs"].append((t["titel"],pn)); chap["testseite"]=pn
            _te=ch_foerdertest(t,ch,pn); body+=_te; pn+=len(_te)
        nav.append(chap)
    inhalt=toc(starts,nav,toc_pn)
    if len(inhalt)!=toc_n:
        print(f"WARNUNG: Inhalt braucht {len(inhalt)} statt {toc_n} Seiten - "
              f"die Seitenzahlen im Inhalt stimmen nicht.")
    pages=[book_cover()]+about+inhalt+body

    bd=os.path.join(HERE,"build"); os.makedirs(bd,exist_ok=True)
    # Alte Seiten wegraeumen: ein anders langer Satz darf keine book_p*.png des
    # vorigen Laufs stehen lassen, sonst misst simcheck/seitenzahlen.py Geisterseiten.
    for _alt in glob.glob(os.path.join(bd,"book_p*.png")): os.remove(_alt)
    for i,p in enumerate(pages): p.save(os.path.join(bd,f"book_p{i+1}.png"))
    seitentexte=[SEITENTEXTE.get(id(p),[]) for p in pages]
    fehlend=[i+1 for i,s in enumerate(seitentexte) if not s]
    if fehlend: print("ohne Textprotokoll:",fehlend)

    # Der Lehrerband steht im selben Satz und wird deshalb VOR den Proben
    # gesetzt - sonst pruefen Zeichen- und Versalprobe nur den Schuelerband.
    n_lb,lb_texte=build_lehrerband()

    # ── Woraus besteht der Band? Gezaehlt, nicht geschaetzt. ──
    _art={}
    for _name,_pn,_y in bp.PROBE:
        _a=_name.split(" ")[0] if " " in _name else _name
        _art[_a]=_art.get(_a,0)+1
    print("\nSeitenspiegel (Schuelerband und Lehrerband zusammen):")
    for _a in sorted(_art,key=lambda k:-_art[k]):
        print(f"   {_a:22s} {_art[_a]:4d}")

    # ── Satzspiegel-Probe: wie tief laeuft jede Seite wirklich? ──
    ueber=[p for p in bp.PROBE if p[2]>fd.UNTEN+0.5]
    print(f"\nSatzspiegel-Probe: {len(bp.PROBE)} Seiten gemessen, Grenze {fd.UNTEN:.0f} "
          f"Einheiten ({fd.punkt(fd.UNTEN):.0f} pt)")
    if ueber:
        print(f"WARNUNG: {len(ueber)} Seite(n) laufen unter den Satzspiegel:")
        for name,seite,y in sorted(ueber,key=lambda p:-p[2])[:20]:
            print(f"   Seite {seite:3d}  {name:38s} endet {y:.0f}  (+{y-fd.UNTEN:.0f})")
    else:
        tiefste=max(bp.PROBE,key=lambda p:p[2])
        print(f"   keine Seite laeuft unter den Satzspiegel. Tiefste: Seite {tiefste[1]} "
              f"({tiefste[0]}) endet {tiefste[2]:.0f}, {fd.UNTEN-tiefste[2]:.0f} Einheiten Luft.")
    if bp.WAISEN:
        print(f"WARNUNG: {len(bp.WAISEN)} Seite(n) enden mit einer allein stehenden "
              f"Ueberschrift:")
        for name,seite,bs_name in bp.WAISEN[:20]:
            print(f"   Seite {seite:3d}  {name:38s} endet mit '{bs_name}'")
    else:
        print("   keine Seite endet mit einer allein stehenden Ueberschrift.")
    _leer=[p for p in bp.PROBE if p[2]<fd.OBEN+(fd.UNTEN-fd.OBEN)/3]
    if _leer:
        print(f"   {len(_leer)} Seite(n) tragen weniger als ein Drittel:")
        for name,seite,y in sorted(_leer,key=lambda p:p[2])[:20]:
            print(f"   Seite {seite:3d}  {name:38s} endet {y:.0f} "
                  f"({100*(y-fd.OBEN)/(fd.UNTEN-fd.OBEN):.0f} % gefuellt)")
    else:
        print("   keine Seite traegt weniger als ein Drittel.")

    # ── Zeichenprobe: haelt JEDE gesetzte Kette der cmap stand? ──
    _fehlt={}
    for _s,_a,_g in fd.GESETZT:
        for _c in fd.fehlende_zeichen(_s,_a): _fehlt[_c]=_fehlt.get(_c,0)+1
    print(f"Zeichenprobe: {len(fd.GESETZT)} gesetzte Ketten gegen die cmap gehalten – "
          + ("0 fehlende Zeichen." if not _fehlt else
             "FEHLENDE ZEICHEN: "+" ".join("U+%04X (%dx)"%(ord(c),n) for c,n in _fehlt.items())))
    _grade=sorted({round(g,2) for _,_,g in fd.GESETZT})
    print("   gesetzte Schriftgrade (gedruckte pt): "+" · ".join("%.2f"%g for g in _grade))

    # ── Zeilenprobe: an den gesetzten Blaettern, nicht an der Konstanten ──
    _alle,_gef,_lese=zeilenprobe(seitentexte+lb_texte)
    if _alle:
        _alle_s=sorted(_alle); _lese_s=sorted(_lese)
        _med=_lese_s[len(_lese_s)//2] if _lese_s else 0
        _p95=_lese_s[int(len(_lese_s)*0.95)] if _lese_s else 0
        _ueber=[n for n in _alle_s if n>fd.ZEICHEN_MAX]
        print(f"Zeilenprobe: {len(_alle)} gesetzte Zeilen · {len(_gef)} vom Umbruch "
              f"gefuellt · davon {len(_lese)} auf der Lesespalte")
        print(f"   Lesezeilen: Median {_med} (Soll 55–75) · 95-Prozent-Wert {_p95} · "
              f"Maximum {max(_lese_s) if _lese_s else 0} Zeichen")
        print(f"   laengste gedruckte Zeile ueberhaupt: {_alle_s[-1]} Zeichen · "
              f"ueber {fd.ZEICHEN_MAX}: {len(_ueber)}"
              + (" – DURCHGEFALLEN" if _ueber else " (keine)"))
        if not (55<=_med<=75):
            print(f"   WARNUNG: Median {_med} liegt ausserhalb 55–75.")
        if _ueber:
            _lang=[t for _st in seitentexte+lb_texte for _x,_y,_g,_b,t in lesezeilen(_st)
                   if len(t)>fd.ZEICHEN_MAX]
            for _t in sorted(_lang,key=len,reverse=True)[:8]:
                print(f"   {len(_t):3d} Z  {_t[:96]}")

    # ── Versalprobe: "Keine Woerter in Grossbuchstaben" ist eine Vorgabe, ──
    # also wird sie an dem gemessen, was gedruckt wird - nicht angenommen.
    # Eine echte Abkuerzung darf ihre Versalien behalten; erkannt wird sie daran,
    # dass sie SO IM INHALT steht (AE = astronomische Einheit, UF/E/K/B = die
    # Kompetenzcodes des Kernlehrplans). Gemeldet wird sie trotzdem - was der
    # SATZ selbst in Versalien setzt, faellt damit sofort auf.
    import re as _re
    _VERSAL=_re.compile(r"(?<![A-Za-zÄÖÜäöüß])[A-ZÄÖÜ]{2,}(?![A-Za-zÄÖÜäöüß])")
    _erlaubt={"FELO","NRW","QR"}
    _aus_inhalt=set()
    for _o in list(SEITEN.values())+list(LOES.values())+list(TESTS.values()):
        def _flach(x):
            if isinstance(x,str): _aus_inhalt.update(_VERSAL.findall(x))
            elif isinstance(x,dict):
                for k,v in x.items():
                    if k!="bildauftrag": _flach(v)     # wird nicht gedruckt
            elif isinstance(x,list):
                for v in x: _flach(v)
        _flach({k:v for k,v in _o.items() if k!="bildauftrag"})
    _vers={}; _abk={}
    for _s,_a,_g in fd.GESETZT:
        for _w in _VERSAL.findall(_s):
            if _w in _erlaubt or _re.fullmatch(r"(I{1,3}|IV|V)",_w): continue
            (_abk if _w in _aus_inhalt else _vers)[_w]=\
                (_abk if _w in _aus_inhalt else _vers).get(_w,0)+1
    print("Versalprobe: "+("keine Woerter in Grossbuchstaben." if not _vers else
          "GEFUNDEN: "+" ".join("%s (%dx)"%(w,n) for w,n in sorted(_vers.items()))))
    if _abk:
        print("   Abkuerzungen aus dem Inhalt (erlaubt): "
              +" ".join("%s (%dx)"%(w,n) for w,n in sorted(_abk.items())))

    out=os.path.join(bd,DATEINAME+"_Druck.pdf")
    pages[0].save(out,"PDF",resolution=150,save_all=True,append_images=pages[1:])
    print("Seiten gesetzt:",len(pages),"->",os.path.relpath(out,HERE))
    if "--druck" in sys.argv:
        import shutil; ziel=os.path.expanduser(f"~/Desktop/{DATEINAME}_Druck.pdf")
        shutil.copy2(out,ziel); print("Druckfassung zusätzlich:",ziel)
    try:
        eb=os.path.expanduser(f"~/Desktop/{DATEINAME}.pdf")
        try:
            build_ebook(out,eb,nav,qrpages,seitentexte,toc_pn,toc_n)
        except PermissionError:
            eb=os.path.expanduser(f"~/Desktop/{DATEINAME}_NEU.pdf")
            build_ebook(out,eb,nav,qrpages,seitentexte,toc_pn,toc_n)
            print("HINWEIS: alte E-Book-Datei war gesperrt - neue Fassung daneben gelegt.")
        print("SAVED (navigierbares E-Book)",eb)
    except Exception as e:
        import traceback; traceback.print_exc(); print("E-Book-Schritt übersprungen:",e)
    print(f"\nSchuelerband {len(pages)} Seiten  ·  Lehrerband {n_lb} Seiten")
