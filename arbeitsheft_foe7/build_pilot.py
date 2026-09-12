# -*- coding: utf-8 -*-
"""FELO Foerderheft · Satz der Lerneinheiten (Seite A, Seite B, Lehrerteil).

Klasse, Schulform und Quellband kommen aus plan.py - diese Datei ist fuer die
Foerderbaende 7, 8 und 9 dieselbe. (Band 10 hat eine eigene Fassung, weil er
Datenblattseiten kennt.)

DER BAND STEHT IM NEUEN SATZ (Fassung "spec", ../arbeitsheft/felo_design.py).
    Weisser Grund, hoechstens zwei Akzentfarben, linksbuendig, keine Woerter in
    Grossbuchstaben. JEDE Schrift kommt ueber fd.schrift(art, GRAD) aus der
    Groessentafel des Moduls - eine nackte Zahl wie AV(15.5) gibt es hier nicht
    mehr. Jede gesetzte Zeichenkette laeuft durch die cmap-Pruefung.

WIE GROSS IST DER FOERDERSATZ?
    FOERDER_PROFIL.md, Abschnitt "Layout": "Fördersatz läuft mindestens zwei
    Stufen größer als das Regelheft." Zwei Stufen der Groessentafel ueber dem
    Fliesstext des Regelhefts (FLIESS = 12 pt) ist KASTEN_KOPF = 14 pt. Das
    Verhaeltnis 14:12 = 1,17 entspricht dem alten Foerdersatz, der mit AV(20) =
    9,6 pt gegen AV(17,5) = 8,4 pt im Regelheft stand (1,14). Gemessen bleiben
    damit rund 66 Zeichen je Lesezeile - genau im Zielband 55 bis 75.
    Der Lehrerteil ist fuer Erwachsene und steht deshalb auf FLIESS.

EINE SEITE WIRD NICHT MEHR "GENAU EINE SEITE" GESETZT.
    seite_a, seite_b und seite_l geben LISTEN von Seiten zurueck; wie viele es
    werden, entscheidet allein der Umbruch aus dem Modul. Der alte Satz zeichnete
    je EIN Blatt und liess PIL den Rest wortlos abschneiden - genau daran ist der
    Lehrerteil im September 2026 gescheitert (CLAUDE.md, "Der Lehrerteil lief
    unter der Blattkante weiter").

EIN PUNKT KANN HOEHER SEIN ALS EINE SEITE.
    Seiten zurueckzugeben genuegt nicht, wenn ein EINZELNER Baustein nicht auf
    ein Blatt passt: Der Umbruch legt ihn auf ein frisches und laesst ihn dort
    unten wieder herauslaufen. Der Lehrerteil bricht deshalb ZEILENWEISE um
    (b_zeilen), nicht punktweise. Nachgemessen in Band 9: drei Punkte ueber der
    Seitenhoehe von 1480 Einheiten, drei Blaetter endeten an der Blattkante.
"""
import os, sys, json
_HIER=os.path.dirname(os.path.abspath(__file__))
MOTOR=os.path.join(os.path.dirname(_HIER),"arbeitsheft")
# HINTEN anhaengen, nicht vorn einfuegen: sonst gewinnen die gleichnamigen Module
# von Klasse 5/6 gegen die eigenen (Falle 3 in CLAUDE.md).
sys.path.append(MOTOR)
from build_final import *
import felo_design as fd
# felo_design schiebt seinen eigenen Ordner mit sys.path.insert(0,...) nach VORN.
# Damit stuenden ab hier arbeitsheft/plan.py und arbeitsheft/build_book.py vor den
# eigenen. Also zurueckdrehen: MOTOR gehoert ans Ende.
while MOTOR in sys.path: sys.path.remove(MOTOR)
sys.path.append(MOTOR)
from PIL import Image, ImageChops
import plan
HERE=_HIER   # nach dem Sternimport setzen, sonst schreibt das Heft in fremde Ordner

KL       = str(plan.KLASSE)
QUELLBAND= os.path.join(os.path.dirname(_HIER), plan.QUELLBAND)
KAP      = {k["id"]: k["titel"] for k in plan.KAPITEL}
ERSTES   = plan.KAPITEL[0]["id"]
FUSS     = f"FELO Physik {KL} · Förderheft"

def _load(n): return json.load(open(os.path.join(HERE,"content",n),encoding="utf-8"))
SEITEN={o["id"]:o for o in _load("foerderseiten.json")}
LOES={o["id"]:o for o in _load("loesungen_lehrer.json")}

# ═════════════════════════════════════════════════════════════════════════════
#  MASSE - alles haengt an der Groessentafel des Moduls, nichts ist geraten
# ═════════════════════════════════════════════════════════════════════════════
DISPLAY_GROSS  = fd.HAUPT*3      # 66 pt - Wortmarke FELO auf dem Deckblatt
DISPLAY_MITTEL = fd.HAUPT*2      # 44 pt - Fach/Klasse, Kapitelziffer

LH_HAUPT   = round(fd.einheiten(fd.HAUPT)*fd.ZAB,2)
LH_ZWISCH  = round(fd.einheiten(fd.ZWISCHEN)*fd.ZAB,2)
LH_KOPF    = round(fd.einheiten(fd.KASTEN_KOPF)*fd.ZAB,2)
LH_DISPLAY = round(fd.einheiten(DISPLAY_MITTEL)*fd.ZAB,2)

FOE    = fd.KASTEN_KOPF                       # 14 pt - Fliesstext der Schuelerseiten
LH_FOE = round(fd.einheiten(FOE)*fd.ZAB,2)    # 36,46 Einheiten = 17,50 pt

# So breit darf werden, was jemand LIEST. Nicht fd.X1-fd.X0: das ist der
# Satzspiegel des BLATTES und traegt ueber 100 Zeichen je Zeile. Schreiblinien,
# Kopf-, Fuss- und Trennlinien bleiben auf fd.X0..fd.X1 - sie werden nicht
# gelesen, sondern beschrieben.
LESE   = fd.KASTEN_X1-fd.KASTEN_X0            # 830 Einheiten = 398 pt
# Und so breit, wenn in KLEIN gesetzt wird. Die Lesebreite ist eine Zahl von
# ZEICHEN, keine von Einheiten: 830 Einheiten tragen bei 12 pt rund 73 Zeichen,
# bei 10 pt aber 85 bis 90 - gemessen mit der echten Schrift, nicht gerechnet.
# Genau dort lagen die einzigen drei Zeilen ueber 85 Zeichen: die Schlusszeile
# des Deckblatts (89) und die zwei Zeilen des Impressumsabsatzes (87 und 87).
# Die Rechnung geht ueber SPALTE_65, die im Modul fuer 65 Zeichen bei FLIESS
# steht; auf 581 Einheiten misst dieselbe Probe 61 Zeichen im Schnitt.
LESE_KLEIN = round(fd.SPALTE_65*fd.KLEIN/float(fd.FLIESS))   # 581 Einheiten
BILDSP = fd.RAND1-fd.RAND0                    # Randspalte: Einstiegsbild

# Ein Ankreuzkaestchen ist so hoch wie eine Zeile Fliesstext.
ANKREUZ = round(fd.einheiten(FOE),1)
# Eine nummerierte Scheibe (Schritt, Alltagspunkt) haelt eine Ziffer in KLEIN.
SCHEIBE = round(fd.einheiten(FOE)*0.55,1)
SCHEIBE_X = round(SCHEIBE*2+14,1)             # wo der Text daneben anfaengt

# Schreiblinien im Foerdersatz. Im Regelheft sind es 42 Einheiten bei 12 pt;
# hier dasselbe Verhaeltnis zur Zeilenhoehe, also 49 bei 14 pt - grosse
# Handschrift braucht mehr Raum (FOERDER_PROFIL.md, "Layout").
LINIE_HOEHE = round(LH_FOE*fd.LINIE_HOEHE/fd.LH,2)
LINIE_GRUND = round(LH_FOE*fd.LINIE_GRUNDLINIE/fd.LH,2)

# Lage des QR-Bildes. NICHT VERSCHIEBEN: simcheck/seitenzahlen.py schneidet genau
# (1050, 53)-(1176, 179) aus jeder gesetzten Seite und liest dort die Kennung.
# Wer den Code bewegt, nimmt der ganzen Reihe die gemessene Seitenzahl.
QR_X, QR_Y, QR_KANTE = 1050, 53, 126
QR_KASTEN = (QR_X-12, QR_Y-12, QR_X+QR_KANTE+12, QR_Y+QR_KANTE+30)
QR_LINKS  = QR_KASTEN[0]-12      # bis hierhin duerfen Titel und Zierlinie laufen

PROBE=[]        # (Seitenname, Seitenzahl, Unterkante in Einheiten) - je Blatt
WAISEN=[]       # Seiten, die mit einer allein stehenden Ueberschrift enden


# ═════════════════════════════════════════════════════════════════════════════
#  MESSEN UND SETZEN EINER EINHEIT
# ═════════════════════════════════════════════════════════════════════════════
def _unterkante(im):
    """Wo endet die Tinte auf diesem Blatt wirklich? Gemessen, nicht gerechnet.

    Gemessen wird am Bild, BEVOR Kopf- und Fusszeile stehen - also genau der
    Inhalt, der in den Satzspiegel gehoert. So faellt auch eine Linie oder ein
    Kastenrand auf, den kein Textprotokoll kennt."""
    bb=ImageChops.difference(im,Image.new("RGB",im.size,fd.GRUND)).getbbox()
    return 0.0 if not bb else bb[3]/float(S)


def qr_pfad(tid):
    """Eigener fo/fw-Code hat Vorrang; solange er fehlt, springt der Code der
    Quellseite ein - er loest live dieselbe Simulation auf."""
    p=os.path.join(HERE,"qr",f"qr_{tid}.png")
    if os.path.exists(p): return p
    q1=(SEITEN.get(tid,{}).get("quelle") or "").split("+")[0]
    p=os.path.join(QUELLBAND,"qr",f"qr_{q1}.png")
    return p if q1 and os.path.exists(p) else None


def bild_pfad(cfg):
    """Eigenes Foerderbild vor dem Einstiegsbild der Quellseite."""
    p=os.path.join(HERE,"img",f"einstieg_{cfg['id']}.png")
    if os.path.exists(p): return p
    q1=(cfg.get("quelle") or "").split("+")[0]
    p=os.path.join(QUELLBAND,"img",f"einstieg_{q1}.png")
    return p if q1 and os.path.exists(p) else None


def qr_karte(h,d,tid):
    """QR-Kaertchen oben rechts, verlinkt die passende Simulation."""
    pfad=qr_pfad(tid)
    if not pfad: return None
    # Weisse Flaeche unter dem Code: die Kopflinie des Seitenrahmens laeuft sonst
    # quer durch den Code hindurch und macht ihn unlesbar.
    d.rectangle([sc(QR_KASTEN[0]),sc(QR_KASTEN[1]),sc(QR_KASTEN[2]),sc(QR_KASTEN[3])],fill=fd.GRUND)
    h.pastefit(pfad,QR_X,QR_Y,QR_KANTE,QR_KANTE)
    fd.T(h,QR_X+QR_KANTE/2,QR_Y+QR_KANTE+6,"Simulation",
         fd.schrift("med",fd.KLEIN),fd.STIL["akzent"],anchor="ma")
    return QR_KASTEN


def blatt(im,d,h,name,kopf,titel,si,gesamt,pn,qr=None,kopf_rechts=None):
    """Ein fertiges Blatt: erst messen, dann Kopf, Fuss und QR daraufsetzen."""
    PROBE.append((name,pn,_unterkante(im)))
    # fd.seitenrahmen druckt die Seitenzahl als pn+seite - `pn` ist dort die ERSTE
    # Seite der Einheit. Hier steht die echte Seitenzahl, also pn-si uebergeben.
    fd.seitenrahmen(h,d,fd.STIL,kopf,kopf_rechts,titel,si,gesamt,pn-si,FUSS)
    if qr: qr_karte(h,d,qr)
    return fertig(im)


def einpassen(bauer,nmin,nmax):
    """Wie viele Schreibzeilen je Aufgabe? Jede Stufe wird WIRKLICH umbrochen.

    Zwei Regeln, in dieser Reihenfolge: erst die wenigsten Seiten, dann darin die
    meisten Schreibzeilen. So bekommt der Foerderlernende so viel Schreibraum wie
    moeglich, ohne dass eine einzelne Linie ein drittes Blatt aufmacht."""
    mess=[]
    for n in range(nmin,nmax+1):
        B=bauer(n)
        mess.append((len(fd.umbrechen(B,fd.messe_bausteine(B,fd.STIL))),n,B))
    smin=min(m[0] for m in mess)
    _s,n,B=max([m for m in mess if m[0]==smin],key=lambda m:m[1])
    return B,n


def setze_einheit(B,kopf,titel,pn,name,qr=None,fuellen=False,kopf_rechts=None):
    """Bausteine messen, umbrechen, setzen. Gibt die Liste der Seiten zurueck."""
    hoehen=fd.messe_bausteine(B,fd.STIL)
    seiten=fd.umbrechen(B,hoehen)
    if fuellen:
        B,hoehen,seiten=fd.schreibraum_auffuellen(B,hoehen,seiten,fd.STIL)
    # Steht am Fuss einer Seite noch ein Baustein, der etwas festhaelt, ist die
    # Verklammerung nicht aufgegangen - genau das ist die einsame Ueberschrift.
    # Gefragt wird die DURCHGERECHNETE Reichweite, nicht die genannte.
    haelt=fd.verklammern(B)
    for si,eintraege in enumerate(seiten[:-1]):
        i=eintraege[-1][0]
        if haelt[i]: WAISEN.append((f"{name} {si+1}/{len(seiten)}",pn+si,B[i].name))
    raus=[]
    for si,eintraege in enumerate(seiten):
        im,d=newp(fd.GRUND); h=hp(im,d)
        for i,y in eintraege: B[i].f(h,d,y)
        raus.append(blatt(im,d,h,f"{name} {si+1}/{len(seiten)}",kopf,titel,si,len(seiten),
                          pn+si,qr if si==0 else None,kopf_rechts if si==0 else None))
    return raus


# ═════════════════════════════════════════════════════════════════════════════
#  BAUSTEINE - die immer wiederkehrenden Stuecke
# ═════════════════════════════════════════════════════════════════════════════
def bst(name,f,abstand=fd.ABS_ZEILE,haftet=0):
    return fd.Baustein(name,f,abstand,haftet)


def _lh(grad): return round(fd.einheiten(grad)*fd.ZAB,2)


def b_titel(text,breite=None,unterzeile=None,unterzeile_grad=None,haftet=1,regel_bis=None):
    """Hauptueberschrift der Einheit mit Zierlinie darunter.

    `regel_bis` zieht die Linie kuerzer: auf der ersten Seite eines Themas sitzt
    rechts der QR-Code, und die Linie liefe sonst durch seine Beschriftung."""
    br=(fd.X1-fd.X0) if breite is None else breite
    xr=fd.X1 if regel_bis is None else regel_bis
    ug=fd.FLIESS if unterzeile_grad is None else unterzeile_grad
    def f(h,d,y):
        ft=fd.schrift("bold",fd.HAUPT)
        zeilen=h.wrap(text,ft,br)
        for i,z in enumerate(zeilen): fd.T(h,fd.X0,y+i*LH_HAUPT,z,ft,fd.STIL["h1"])
        yy=y+len(zeilen)*LH_HAUPT+4
        if unterzeile:
            yy=fd.para(h,fd.X0,yy,unterzeile,fd.schrift("reg",ug),fd.STIL["text"],br,_lh(ug))
        h.ln([(fd.X0,yy+8),(xr,yy+8)],fd.STIL["akzent"],1.4)
        return yy+12
    return bst("Titel",f,fd.ABS_ABSCHNITT,haftet)


def aufgabenmarke(h,d,y,nr,titel,komp=None,afb=None,punkte=None):
    """Abschnittsmarke mit Kompetenzkaertchen und - im Test - der Punktzahl.

    Auf den Schuelerseiten steht KEIN Kompetenzchip (FOERDER_PROFIL.md); die
    Codes stehen im Lehrerband. `komp` bleibt trotzdem moeglich, damit der
    Fördertest seine Punktzahl an derselben Stelle tragen kann."""
    xr=fd.X1
    if punkte is not None:
        t="/ %d P"%punkte; f=fd.schrift("med",fd.FLIESS)
        fd.T(h,xr,y+fd.MARKE_KASTEN/2,t,f,fd.STIL["text"],anchor="rm")
        xr-=h.tw(t,f)+16
    return fd.marke(h,d,y,nr,titel,fd.STIL,komp,afb,xr=xr)


def b_marke(nr,titel,komp=None,afb=None,punkte=None,abstand=fd.ABS_AUFGABE):
    def f(h,d,y): return aufgabenmarke(h,d,y,nr,titel,komp,afb,punkte)
    return bst("Marke %s"%nr,f,abstand,haftet=1)


def unterkopf(h,d,y,text,breite=None):
    """Zwischenueberschrift ohne Ziffer - fuer Bloecke innerhalb eines Abschnitts."""
    f=fd.schrift("bold",fd.KASTEN_KOPF)
    br=(fd.X1-fd.X0) if breite is None else breite
    zeilen=h.wrap(text,f,br)
    for i,z in enumerate(zeilen): fd.T(h,fd.X0,y+i*LH_KOPF,z,f,fd.STIL["akzent"])
    yy=y+len(zeilen)*LH_KOPF
    h.ln([(fd.X0,yy+2),(fd.X1,yy+2)],fd.STIL["zart"],1.2)
    return yy+10


def b_unterkopf(text,breite=None,haftet=1):
    def f(h,d,y): return unterkopf(h,d,y,text,breite)
    return bst("Unterkopf",f,fd.ABS_ZEILE,haftet=haftet)


def b_para(text,art="reg",grad=None,farbe=None,breite=None,x=None,lh=None,
           abstand=fd.ABS_ZEILE,haftet=0,name="Absatz"):
    grad=FOE if grad is None else grad
    hh=_lh(grad) if lh is None else lh
    def f(h,d,y):
        return fd.para(h,fd.X0 if x is None else x,y,text,fd.schrift(art,grad),
                       fd.STIL["text"] if farbe is None else farbe,
                       LESE if breite is None else breite,hh)
    return bst(name,f,abstand,haftet)


def b_punkt(text,i=None,zeichen=None,grad=None,breite=None,abstand=fd.ABS_ZEILE,
            name="Punkt",haftet=0):
    """Ein Listenpunkt: Scheibe mit Ziffer (oder Raute) und Absatz daneben."""
    grad=FOE if grad is None else grad
    hh=_lh(grad); r=round(fd.einheiten(grad)*0.55,1); xt=round(r*2+14,1)
    def f(h,d,y):
        if i is None:
            fd.raute(d,fd.X0+r,y+hh*0.45,r*0.45,fd.STIL["akzent"])
        else:
            h.circ(fd.X0+r,y+hh*0.5,r,fill=fd.STIL["akzent"])
            fd.T(h,fd.X0+r,y+hh*0.5+1,str(zeichen if zeichen is not None else i+1),
                 fd.schrift("bold",fd.KLEIN),fd.STIL["akzent_schrift"],anchor="mm")
        return fd.para(h,fd.X0+xt,y,text,fd.schrift("reg",grad),fd.STIL["text"],
                       (LESE if breite is None else breite)-xt,hh)
    return bst(name,f,abstand,haftet)


_MESSBLATT=None
def messhilfe():
    """Ein Blatt, das nur zum MESSEN da ist.

    h.wrap braucht ein Bild, kein Papier: Es fragt die Schrift nach Breiten und
    zeichnet nichts. Das eine Blatt wird deshalb einmal angelegt und immer
    wiederbenutzt - es kommt nie in den Band."""
    global _MESSBLATT
    if _MESSBLATT is None:
        im,d=newp(fd.GRUND); _MESSBLATT=hp(im,d)
    return _MESSBLATT


def b_zeilen(text,art="reg",grad=None,breite=None,punkt=False,
             abstand=fd.ABS_ZEILE,name="Zeile"):
    """Ein Absatz, der ZEILENWEISE umbrechen darf - eine LISTE von Bausteinen.

    b_para setzt einen Absatz als EINEN Baustein: Der Umbruch kann ihn nur ganz
    oder gar nicht auf ein Blatt nehmen. Auf den Schuelerseiten reicht das, dort
    ist kein Absatz laenger als ein paar Zeilen. Im Lehrerteil reicht es NICHT:
    Ein einzelner Erwartungshorizont ist hoeher als eine ganze Seite. Ein
    Baustein, der nirgends hinpasst, wird vom Umbruch auf ein frisches Blatt
    gelegt und laeuft dort unten heraus - PIL schneidet den Rest wortlos ab, und
    im Druck fehlt bis zu einer Viertelseite.
    Gemessen in Band 9 vor der Reparatur: drei Punkte hoeher als die 1480
    Einheiten einer Folgeseite (fe11 2250, fe10 1688, fe6 1625); die drei
    zugehoerigen Blaetter endeten bei 1754 - der Blattkante - statt bei 1674.
    Genau dieser Fehler stand schon zweimal im Buch (CLAUDE.md, "Der Lehrerteil
    lief unter der Blattkante weiter" und "ch_uebung lief unter die Blattkante").
    Diese Fassung bricht deshalb zeilenweise um, mit den Mitteln des Moduls:
    jede Zeile ein Baustein, und die erste haelt die zweite fest, damit nie eine
    einzelne Zeile unten anhaengt."""
    grad=FOE if grad is None else grad
    hh=_lh(grad)
    r=round(fd.einheiten(grad)*0.55,1)
    xt=round(r*2+14,1) if punkt else 0.0
    br=(LESE if breite is None else breite)-xt
    f=fd.schrift(art,grad)
    zeilen=messhilfe().wrap(text,f,br) or [""]
    B=[]
    for k,z in enumerate(zeilen):
        def zeichne(h,d,y,k=k,z=z):
            if punkt and k==0:
                fd.raute(d,fd.X0+r,y+hh*0.45,r*0.45,fd.STIL["akzent"])
            fd.T(h,fd.X0+xt,y,z,f,fd.STIL["text"])
            return y+hh
        B.append(bst("%s %d"%(name,k+1),zeichne,abstand=0,
                     haftet=1 if (k==0 and len(zeilen)>1) else 0))
    B[-1].abstand=abstand
    return B


def schreiblinie(h,y,x0=None,x1=None,nummer=None):
    """Eine Schreiblinie, wahlweise mit vorangestellter Nummer."""
    x0=fd.X0 if x0 is None else x0
    x1=fd.X1 if x1 is None else x1
    if nummer is not None:
        fd.T(h,x0,y+LINIE_GRUND-fd.einheiten(FOE),"%d."%nummer,
             fd.schrift("bold",FOE),fd.STIL["text"])
        x0+=fd.einheiten(FOE)+6
    h.ln([(x0,y+LINIE_GRUND),(x1,y+LINIE_GRUND)],fd.STIL["linie"],fd.LINIE_STAERKE)
    return y+LINIE_HOEHE


def b_linien(n,x0=None,x1=None,nummeriert=False,praefix="Schreiblinie"):
    """n einzelne Schreiblinien - jede ein eigener Baustein, damit der Umbruch
    mitten im Schreibraum trennen darf."""
    B=[]
    for k in range(n):
        def f(h,d,y,k=k): return schreiblinie(h,y,x0,x1,(k+1) if nummeriert else None)
        B.append(bst("%s %d"%(praefix,k+1),f,abstand=0))
    return B


def ankreuz(h,d,x,y,kante=None):
    k=ANKREUZ if kante is None else kante
    h.R(x,y,x+k,y+k,6,outline=fd.STIL["linie"],w=2)


def b_ankreuz(text,art="reg",grad=None,breite=None,abstand=fd.ABS_ZEILE,name="Ankreuzzeile"):
    grad=FOE if grad is None else grad
    hh=_lh(grad)
    br=(LESE-ANKREUZ-18) if breite is None else breite
    def f(h,d,y):
        ankreuz(h,d,fd.X0,y+2)
        ende=fd.para(h,fd.X0+ANKREUZ+18,y,text,fd.schrift(art,grad),fd.STIL["text"],br,hh)
        return max(y+ANKREUZ+4,ende)
    return bst(name,f,abstand)


def luecken_satz(h,x,y,m,st,maxw,grad=None):
    """Merksatz mit Luecke im Foerdergrad.

    Das Modul setzt fd.luecken_satz fest auf MERK (12 pt) - der Foerdersatz
    laeuft zwei Stufen hoeher, deshalb steht die Fassung hier. Die Breite der
    Luecke kommt weiter aus dem Modul (fd.luecke_breite), damit sie in allen
    Baenden nach derselben Regel entsteht."""
    grad=FOE if grad is None else grad
    f=fd.schrift("reg",grad); lh=_lh(grad)
    tok=[("t",w) for w in m["pre"].split()]+[("gap",fd.luecke_breite(h,m,f))] \
        +[("t",w) for w in m["post"].split()]
    for art,v in tok:
        if art=="t":
            fd.pruefe_zeichen(v,"reg")
            fd.GESETZT.append((v,"reg",f.size/S*fd.PT_JE_EINHEIT))
    return h.flow(x,y,maxw,lh,f,st["text"],tok,st["linie"])


def luecken_hoehe(h,m,maxw,grad=None):
    grad=FOE if grad is None else grad
    f=fd.schrift("reg",grad)
    return h.gaphoehe(maxw,_lh(grad),f,m["pre"],m["post"],fd.luecke_breite(h,m,f))


def b_luecke(m,breite=None,name="Lückensatz"):
    def f(h,d,y):
        return luecken_satz(h,fd.X0,y,m,fd.STIL,LESE if breite is None else breite)
    return bst(name,f,fd.ABS_ZEILE)


# ═════════════════════════════════════════════════════════════════════════════
#  KAESTEN DES FOERDERHEFTS
#
#  Jeder traegt neben der Farbe ein zweites, farbunabhaengiges Merkmal - dieselbe
#  Regel wie im Modul, damit die Schwarz-Weiss-Kopie sie auseinanderhaelt:
#     Forscherfrage  Scheibe mit Fragezeichen, weisser Grund
#     Bildschirm     Doppelrahmen + Dreieck (Bauart des Experimentierkastens)
#     Merksatz       Balken links + Raute + Ueberschrift (Bauart des Merkkastens)
#     Beispiel       Scheibe mit Haken + Ueberschrift, weisser Grund
#     Hilfen         gestrichelte Oberkante + drei nummerierte Scheiben
#  Alle stehen auf der LESESPALTE fd.KASTEN_X0..fd.KASTEN_X1, nicht auf der
#  vollen Blattbreite - sonst traegt eine Kastenzeile ueber 100 Zeichen.
# ═════════════════════════════════════════════════════════════════════════════
def gitterzeichen(d,cx,cy,r,fill):
    """Gezeichnetes Tabellenzeichen - Ersatz fuer "▤" (U+25A4).

    SourceSans3 kennt U+25A4 nicht; PIL druckte dafuer wortlos ein leeres
    Kaestchen. Gezeichnet kann das nicht passieren."""
    x0,y0,x1,y1=cx-r,cy-r*0.78,cx+r,cy+r*0.78
    d.rectangle([sc(x0),sc(y0),sc(x1),sc(y1)],outline=fill,width=max(1,sc(1.2)))
    for k in (1,2):
        yy=y0+(y1-y0)*k/3.0
        d.line([(sc(x0),sc(yy)),(sc(x1),sc(yy))],fill=fill,width=max(1,sc(1.0)))
    d.line([(sc(cx),sc(y0)),(sc(cx),sc(y1))],fill=fill,width=max(1,sc(1.0)))


def haken(d,cx,cy,r,fill):
    """Gezeichnetes Haekchen. "✓" kann SourceSans3 zwar, aber ein gezeichnetes
    Zeichen haelt jede Schriftumstellung aus - dieselbe Regel wie beim Gitter."""
    d.line([(sc(cx-r*0.62),sc(cy+r*0.06)),(sc(cx-r*0.16),sc(cy+r*0.52))],
           fill=fill,width=max(2,sc(2.2)))
    d.line([(sc(cx-r*0.16),sc(cy+r*0.52)),(sc(cx+r*0.64),sc(cy-r*0.50))],
           fill=fill,width=max(2,sc(2.2)))


def kasten_frage(h,d,y,st,ueberschrift,frage):
    """Forscherfrage - weisser Grund, Petrol-Rand, Scheibe mit Fragezeichen."""
    st=st or fd.STIL
    kx0,kx1=fd.KASTEN_X0,fd.KASTEN_X1
    innen=26; xi=kx0+innen+52; bw=kx1-innen-xi
    f=fd.schrift("med",FOE)
    zeilen=h.wrap(frage,f,bw)
    kopf=18+fd.LH_KLEIN
    hoehe=kopf+len(zeilen)*LH_FOE+18
    h.R(kx0,y,kx1,y+hoehe,10,fill=st["kasten_weiss"],outline=st["akzent"],w=1.6)
    h.circ(kx0+innen+17,y+kopf+LH_FOE*0.5-4,17,fill=st["akzent"])
    fd.T(h,kx0+innen+17,y+kopf+LH_FOE*0.5-3,"?",fd.schrift("bold",FOE),
         st["akzent_schrift"],anchor="mm")
    fd.T(h,xi,y+18,ueberschrift,fd.schrift("med",fd.KLEIN),st["akzent"])
    for i,z in enumerate(zeilen): fd.T(h,xi,y+kopf+i*LH_FOE,z,f,st["text"])
    fd.KAESTEN.append((None,"Forscherfrage",kx0,y,kx1,y+hoehe,
                       "Scheibe mit Fragezeichen + Ueberschrift, keine Farbflaeche"))
    return y+hoehe


def kasten_bildschirm(h,d,y,st,zeilen_text,zeichner=None):
    """Woher die Zahlen kommen - Bildschirm oder Ersatzweg ohne Geraet.

    Bauart und Merkmale des Experimentierkastens aus dem Modul (Doppelrahmen +
    Zeichen an der linken Kante); nur das Zeichen ist austauschbar."""
    st=st or fd.STIL
    kx0,kx1=fd.KASTEN_X0,fd.KASTEN_X1
    innen=26; xi=kx0+innen+40; bw=kx1-innen-xi
    f1=fd.schrift("med",FOE); f2=fd.schrift("reg",FOE)
    bloecke=[(t,f1 if i==0 else f2) for i,t in enumerate(zeilen_text) if t]
    zl=[(h.wrap(t,f,bw),f) for t,f in bloecke]
    hoehe=20+sum(len(z)*LH_FOE for z,_f in zl)+8*(len(zl)-1)+18
    h.R(kx0,y,kx1,y+hoehe,10,fill=st["exp_grund"],outline=st["akzent"],w=1.6)
    h.R(kx0+7,y+7,kx1-7,y+hoehe-7,7,outline=st["akzent"],w=0.9)
    (zeichner or fd.dreieck)(d,kx0+innen+8,y+20+LH_FOE*0.36,16,st["akzent"])
    yy=y+20
    for z,f in zl:
        for i,li in enumerate(z): fd.T(h,xi,yy+i*LH_FOE,li,f,st["text"])
        yy+=len(z)*LH_FOE+8
    fd.KAESTEN.append((None,"Experimentierkasten",kx0,y,kx1,y+hoehe,
                       fd.MERKMAL["Experimentierkasten"]))
    return y+hoehe


def kasten_merk(h,d,y,st,ueberschrift,luecken):
    """Merksatz mit genau zwei Luecken - Flaeche, Balken links, Raute, Ueberschrift."""
    st=st or fd.STIL
    kx0,kx1=fd.KASTEN_X0,fd.KASTEN_X1
    innen,balken=26,9
    xi=kx0+balken+innen; bw=kx1-innen-xi
    kopf=20+fd.einheiten(fd.KASTEN_KOPF)+12
    hoehe=kopf+6+sum(luecken_hoehe(h,m,bw)+10 for m in luecken)+12
    h.R(kx0,y,kx1,y+hoehe,10,fill=st["merk_grund"],outline=st["akzent"],w=1.4)
    h.R(kx0,y,kx0+balken,y+hoehe,4,fill=st["akzent"])
    fd.raute(d,xi+9,y+20+fd.einheiten(fd.KASTEN_KOPF)*fd.MITTE_DER_KOPFZEILE,9,st["akzent"])
    fd.T(h,xi+28,y+20,ueberschrift,fd.schrift("bold",fd.KASTEN_KOPF),st["akzent"])
    yy=y+kopf+6
    for m in luecken: yy=luecken_satz(h,xi,yy,m,st,bw)+10
    fd.KAESTEN.append((None,"Merkkasten",kx0,y,kx1,y+hoehe,fd.MERKMAL["Merkkasten"]))
    return y+hoehe


def kasten_beispiel(h,d,y,st,ueberschrift,frage,antwort):
    """Das geloeste Muster - weisser Grund, Scheibe mit Haken, Ueberschrift."""
    st=st or fd.STIL
    kx0,kx1=fd.KASTEN_X0,fd.KASTEN_X1
    innen=26; xi=kx0+innen+52; bw=kx1-innen-xi
    ff=fd.schrift("bold",FOE); fa=fd.schrift("reg",FOE)
    zf=h.wrap(frage,ff,bw); za=h.wrap(antwort,fa,bw)
    kopf=18+fd.LH_KLEIN
    hoehe=kopf+(len(zf)+len(za))*LH_FOE+8+18
    h.R(kx0,y,kx1,y+hoehe,10,fill=st["kasten_weiss"],outline=st["akzent"],w=1.4)
    h.circ(kx0+innen+17,y+kopf+LH_FOE*0.5-4,17,fill=st["akzent"])
    haken(d,kx0+innen+17,y+kopf+LH_FOE*0.5-4,15,st["akzent_schrift"])
    fd.T(h,xi,y+18,ueberschrift,fd.schrift("med",fd.KLEIN),st["akzent"])
    yy=y+kopf
    for i,z in enumerate(zf): fd.T(h,xi,yy+i*LH_FOE,z,ff,st["text"])
    yy+=len(zf)*LH_FOE+8
    for i,z in enumerate(za): fd.T(h,xi,yy+i*LH_FOE,z,fa,st["text"])
    fd.KAESTEN.append((None,"Beispielkasten",kx0,y,kx1,y+hoehe,
                       "Scheibe mit Haken + Ueberschrift, keine Farbflaeche"))
    return y+hoehe


def kasten_hilfen(h,d,y,st,ueberschrift,stufen):
    """Die drei Hilfestufen - durch eine gestrichelte Kante abgetrennt.

    Weisser Grund mit Anspruch: der Kasten soll erst gelesen werden, wenn es
    allein nicht geht, und darf deshalb nicht ins Auge springen. Das zweite,
    farbunabhaengige Merkmal ist die gestrichelte Oberkante."""
    st=st or fd.STIL
    kx0,kx1=fd.KASTEN_X0,fd.KASTEN_X1
    innen=26; r=round(fd.einheiten(FOE)*0.45,1)
    xi=kx0+innen+round(r*2+10,1); bw=kx1-innen-xi
    f=fd.schrift("reg",FOE)
    zl=[h.wrap(t,f,bw) for t in stufen]
    kopf=18+fd.LH_KLEIN
    hoehe=kopf+sum(len(z)*LH_FOE+8 for z in zl)+12
    xx=kx0
    while xx<kx1:
        h.ln([(xx,y+4),(min(xx+9,kx1),y+4)],st["linie"],1.4); xx+=18
    y0=y+16
    h.R(kx0,y0,kx1,y0+hoehe,10,fill=st["kasten_weiss"],outline=st["linie"],w=1.2)
    fd.T(h,kx0+innen,y0+16,ueberschrift,fd.schrift("med",fd.KLEIN),st["text"])
    yy=y0+kopf
    for i,z in enumerate(zl):
        # Die Scheibe traegt AKZENT, nicht LINIE: weisse Ziffer auf LINIE haelt nur
        # 3,07:1 und faellt damit unter die 4,5:1 der Vorgabe fuer kleine Schrift.
        h.circ(kx0+innen+r,yy+LH_FOE*0.5,r,fill=st["akzent"])
        fd.T(h,kx0+innen+r,yy+LH_FOE*0.5+1,str(i+1),fd.schrift("bold",fd.KLEIN),
             st["akzent_schrift"],anchor="mm")
        for k,li in enumerate(z): fd.T(h,xi,yy+k*LH_FOE,li,f,st["text"])
        yy+=len(z)*LH_FOE+8
    fd.KAESTEN.append((None,"Hilfenkasten",kx0,y0,kx1,y0+hoehe,
                       "gestrichelte Oberkante + drei nummerierte Scheiben"))
    return y0+hoehe


def b_wortbank(woerter,ueberschrift="Wortbank"):
    """Die Woerter der Merksatz-Luecken als abhakbare Kaertchen."""
    def f(h,d,y):
        fb=fd.schrift("bold",fd.KASTEN_KOPF); fl=fd.schrift("med",FOE)
        ch=round(LH_FOE+8,1)
        fd.T(h,fd.X0,y+ch/2,ueberschrift,fb,fd.STIL["akzent"],anchor="lm")
        cx=fd.X0+h.tw(ueberschrift,fb)+24; cy=y
        for wt in woerter:
            wb=h.tw(wt,fl)+30
            if cx+wb>fd.KASTEN_X1 and cx>fd.X0: cx=fd.X0; cy+=ch+10
            h.R(cx,cy,cx+wb,cy+ch,ch/2,outline=fd.STIL["akzent"],w=1.3)
            fd.T(h,cx+wb/2,cy+ch/2,wt,fl,fd.STIL["text"],anchor="mm")
            cx+=wb+12
        return cy+ch
    return bst("Wortbank",f,fd.ABS_AUFGABE,haftet=0)


# ═════════════════════════════════════════════════════════════════════════════
#  SCHREIBTABELLE
# ═════════════════════════════════════════════════════════════════════════════
def tabelle(h,d,y,st,kopf,zeilen,anteile=None,beispiel=False,schreib=False,luft=0.0):
    """Tabelle auf der Lesespalte. Zellen brechen UM, sie werden nicht verkleinert.

    `beispiel` toent die erste Zeile: sie ist schon ausgefuellt und zeigt das
    Muster (FOERDER_PROFIL.md, Seite A Punkt 6). Das Merkmal ist nicht die Farbe -
    die Beispielzeile ist die einzige BESCHRIFTETE Zeile, alle anderen tragen
    Schreiblinien. `schreib` legt in jede leere Zelle eine Linie, `luft` macht
    jede Zeile um so viele Einheiten hoeher (siehe seite_a)."""
    st=st or fd.STIL
    tx0,tx1=fd.KASTEN_X0,fd.KASTEN_X1
    n=len(kopf)
    anteile=anteile or [1.0/n]*n
    breite=tx1-tx0
    xs=[tx0]
    for a in anteile[:-1]: xs.append(xs[-1]+breite*a)
    fk,fz,fb=fd.schrift("bold",FOE),fd.schrift("reg",FOE),fd.schrift("med",FOE)

    def zell(i,s,f): return h.wrap(s,f,breite*anteile[i]-32)

    kopfz=[zell(i,k,fk) for i,k in enumerate(kopf)]
    kh=max(fd.einheiten(fd.TAB_KOPF_MIN),max(len(z) for z in kopfz)*LH_FOE+16)
    mind=((LINIE_HOEHE+14) if schreib else fd.einheiten(fd.TAB_ZEILE_MIN))+luft
    rhs=[]
    for r,zl in enumerate(zeilen):
        zs=list(zl) if isinstance(zl,(list,tuple)) else [zl]+[""]*(n-1)
        rhs.append(max(mind,max(len(zell(i,s,fz)) for i,s in enumerate(zs))*LH_FOE+14))
    tot=kh+sum(rhs)
    d.rectangle([sc(tx0),sc(y),sc(tx1),sc(y+kh)],fill=st["merk_grund"])
    if beispiel and zeilen:
        d.rectangle([sc(tx0),sc(y+kh),sc(tx1),sc(y+kh+rhs[0])],fill=st["exp_grund"])
    for i,zl in enumerate(kopfz):
        for j,z in enumerate(zl):
            fd.T(h,xs[i]+16,y+(kh-len(zl)*LH_FOE)/2+3+j*LH_FOE,z,fk,st["text"])
    ry=y+kh
    for r,zl in enumerate(zeilen):
        zs=list(zl) if isinstance(zl,(list,tuple)) else [zl]+[""]*(n-1)
        if r>0: h.ln([(tx0,ry),(tx1,ry)],st["zart"],1)
        for i,s in enumerate(zs):
            if s:
                zz=zell(i,s,fz)
                f=fz if (beispiel and r==0) else fb
                for j,z in enumerate(zz):
                    fd.T(h,xs[i]+16,ry+(rhs[r]-len(zz)*LH_FOE)/2+3+j*LH_FOE,z,f,st["text"])
            elif schreib:
                h.ln([(xs[i]+16,ry+rhs[r]-16),(xs[i]+breite*anteile[i]-16,ry+rhs[r]-16)],
                     st["linie"],fd.LINIE_STAERKE)
        ry+=rhs[r]
    for i in range(1,n):
        h.ln([(xs[i],y),(xs[i],y+tot)],st["zart"],1)
    h.ln([(tx0,y+kh),(tx1,y+kh)],st["akzent"],1.4)
    h.R(tx0,y,tx1,y+tot,8,outline=st["akzent"],w=1.4)
    return y+tot


# ═════════════════════════════════════════════════════════════════════════════
#  SEITE A · ENTDECKEN
# ═════════════════════════════════════════════════════════════════════════════
def kopfzeile(cfg,nr,zusatz):
    return f"{KAP.get(cfg.get('theme'),KAP[ERSTES])} · Förderkreis {nr:02d} · {zusatz}"


def bausteine_a(cfg,luft=0.0):
    hat_qr=qr_pfad(cfg["id"]) is not None
    eimg=bild_pfad(cfg)
    B=[b_titel(cfg.get("titel") or cfg["name"],unterzeile=cfg["name"],
               breite=(QR_LINKS-fd.X0) if hat_qr else None,
               regel_bis=QR_LINKS if hat_qr else None)]

    # ① Lesen - drei kurze Saetze, Bild rechts in der Randspalte
    B.append(b_marke(1,"Lesen"))
    def b_alltag(h,d,y):
        yy=y; r=round(fd.einheiten(FOE)*0.28,1)
        for s in cfg["alltag"]:
            h.circ(fd.X0+r+2,yy+LH_FOE*0.5,r,fill=fd.STIL["akzent"])
            yy=fd.para(h,fd.X0+SCHEIBE_X,yy,s,fd.schrift("reg",FOE),fd.STIL["text"],
                       fd.SPALTE-SCHEIBE_X,LH_FOE)+8
        if eimg:
            _bw,bh=h.pastefit(eimg,fd.RAND0,y,BILDSP,BILDSP*0.62)
            yy=max(yy,y+bh)
        return yy
    B.append(bst("Alltag",b_alltag,fd.ABS_AUFGABE,haftet=1))
    B.append(bst("Forscherfrage",
                 lambda h,d,y: kasten_frage(h,d,y,fd.STIL,"Unsere Forscherfrage",
                                            cfg["frage"]),
                 fd.ABS_ABSCHNITT))

    # ② Deine Vermutung
    B.append(b_marke(2,"Deine Vermutung"))
    B.append(b_para("Kreuze eine Vermutung an.",art="med",haftet=1,name="Anweisung"))
    for t in cfg.get("predict",[]): B.append(b_ankreuz(t,name="Vermutung"))
    B[-1].abstand=fd.ABS_ABSCHNITT

    # ③ Forschen am Bildschirm
    B.append(b_marke(3,"Forschen am Bildschirm"))
    B.append(bst("Bildschirm",
                 lambda h,d,y: kasten_bildschirm(h,d,y,fd.STIL,
                     ["Öffne die Simulation über den QR-Code oben rechts.",
                      cfg.get("ersatz","")]),
                 fd.ABS_AUFGABE,haftet=1))
    for i,s in enumerate(cfg.get("forschen",[])):
        B.append(b_punkt(s,i=i,name="Schritt %d"%(i+1)))
    B[-1].abstand=fd.ABS_ABSCHNITT

    # ④ Trage ein - Kopf und Beispielzeile sind schon gefuellt
    B.append(b_marke(4,"Trage ein"))
    B.append(b_para("Die erste Zeile ist schon fertig – so geht es.",art="med",
                    haftet=1,name="Tabellenhinweis"))
    cols=cfg["tabCols"]; rows=cfg["tabRows"]
    B.append(bst("Tabelle",
                 lambda h,d,y: tabelle(h,d,y,fd.STIL,cols,rows,[0.24,0.44,0.32],
                                       beispiel=True,schreib=True,luft=luft),
                 fd.ABS_ABSCHNITT))
    return B


def seite_a(cfg,pn,nr=1):
    """Seite A setzen - und den Rest der letzten Seite der Tabelle geben.

    Die Tabelle ist der Schreibraum dieser Seite. Bleibt unter ihr Platz, wird er
    NICHT als Weissraum stehen gelassen, sondern auf ihre Schreibzeilen verteilt
    (FOERDER_PROFIL.md, "Layout": grosse Schreibfelder, Schreibraum passt zur
    Antwortlaenge). Hoechstens eine Schreiblinienhoehe je Zeile - sonst wuerden
    aus Zeilen Kaesten, sobald die Tabelle allein auf einem Blatt steht."""
    B=bausteine_a(cfg)
    hoehen=fd.messe_bausteine(B,fd.STIL)
    seiten=fd.umbrechen(B,hoehen)
    i_tab=[i for i,b in enumerate(B) if b.name=="Tabelle"]
    if i_tab and seiten[-1] and seiten[-1][-1][0]==i_tab[-1]:
        i=i_tab[-1]; y=seiten[-1][-1][1]
        n=max(1,len(cfg["tabRows"]))
        luft=min(LINIE_HOEHE,max(0.0,(fd.UNTEN-(y+hoehen[i]))/n))
        if luft>4:
            B2=bausteine_a(cfg,luft)
            if len(fd.umbrechen(B2,fd.messe_bausteine(B2,fd.STIL)))==len(seiten):
                B=B2
    return setze_einheit(B,kopfzeile(cfg,nr,"Seite A · Entdecken"),
                         cfg.get("titel") or cfg["name"],pn,
                         "Seite A "+cfg["id"],qr=cfg["id"])


# ═════════════════════════════════════════════════════════════════════════════
#  SEITE B · VERSTEHEN & ÜBEN
# ═════════════════════════════════════════════════════════════════════════════
def bausteine_b(cfg,nl):
    hat_qr=qr_pfad(cfg["id"]) is not None
    a1,a2,a3=cfg["aufgaben"]
    B=[b_titel(cfg.get("titel") or cfg["name"],unterzeile=cfg["name"],
               breite=(QR_LINKS-fd.X0) if hat_qr else None,
               regel_bis=QR_LINKS if hat_qr else None)]

    # ① Merksatz mit genau zwei Luecken
    ms=cfg["merksatz"][:2]
    B.append(bst("Merkkasten",
                 lambda h,d,y: kasten_merk(h,d,y,fd.STIL,"Merksatz",ms),
                 fd.ABS_AUFGABE,haftet=1))
    # ② Wortbank
    B.append(b_wortbank(cfg["wortbank"]))
    # ③ Beispiel
    bsp=cfg["beispiel"]
    B.append(bst("Beispiel",
                 lambda h,d,y: kasten_beispiel(h,d,y,fd.STIL,"Beispiel – so geht es",
                                               bsp["frage"],bsp["antwort"]),
                 fd.ABS_ABSCHNITT))

    # ④ Drei Aufgaben: erkennen - einsetzen - erklaeren
    B.append(b_marke(1,a1["op"]))
    B.append(b_para(a1["frage"],art="med",haftet=len(a1["optionen"]),name="Aufgabenfrage"))
    for o in a1["optionen"]: B.append(b_ankreuz(o,name="Antwort"))
    B[-1].abstand=fd.ABS_ABSCHNITT

    B.append(b_marke(2,a2["op"]))
    B.append(b_para("Die Wörter findest du in der Wortbank.",art="med",
                    haftet=len(a2["luecken"]),name="Wortbankhinweis"))
    for lk in a2["luecken"]: B.append(b_luecke(lk))
    B[-1].abstand=fd.ABS_ABSCHNITT

    B.append(b_marke(3,a3["op"]))
    B.append(b_para(a3["frage"],art="med",haftet=2,name="Schreibauftrag"))
    def b_start(h,d,y):
        f=fd.schrift("med",FOE)
        fd.T(h,fd.X0,y,"Satzanfang:",f,fd.STIL["akzent"])
        b=h.tw("Satzanfang:",f)+12
        return fd.para(h,fd.X0+b,y,a3["satzstarter"],fd.schrift("reg",FOE),
                       fd.STIL["text"],LESE-b,LH_FOE)
    B.append(bst("Satzanfang",b_start,abstand=8,haftet=2))
    B+=b_linien(nl)
    B[-1].abstand=fd.ABS_ABSCHNITT

    # ⑤ Hilfen - erst selbst versuchen
    hl=cfg["hilfen"]
    B.append(bst("Hilfen",
                 lambda h,d,y: kasten_hilfen(h,d,y,fd.STIL,"Hilfen – erst selbst versuchen",
                                             [hl["h1"],hl["h2"],hl["h3"]]),
                 fd.ABS_ABSCHNITT))

    # ⑥ Selbstcheck und Auftrag fuer zu Hause
    B.append(b_unterkopf("Das kann ich"))
    for s in cfg["selbstcheck"]: B.append(b_ankreuz(s,name="Selbstcheck"))
    B[-1].abstand=fd.ABS_AUFGABE
    def b_zuhause(h,d,y):
        f=fd.schrift("med",FOE)
        fd.T(h,fd.X0,y,"Zu Hause:",f,fd.STIL["akzent"])
        b=h.tw("Zu Hause:",f)+12
        return fd.para(h,fd.X0+b,y,cfg["zuhause"],fd.schrift("reg",FOE),
                       fd.STIL["text"],LESE-b,LH_FOE)
    B.append(bst("Zu Hause",b_zuhause,fd.ABS_ZEILE))
    return B


def seite_b(cfg,pn,nr=1):
    """Seite B setzen.

    Die Zahl der Schreibzeilen kommt aus dem Inhalt (aufgaben[2].zeilen) und wird
    NICHT nachtraeglich aufgefuellt: "Schreibraum passt zur Antwortlaenge"
    (FOERDER_PROFIL.md, "Layout"). Elf Linien unter einer Frage, die mit zwei
    Saetzen beantwortet wird, sind fuer einen Foerderlernenden keine Hilfe,
    sondern eine Ansage. einpassen() darf die Zahl nur nach UNTEN korrigieren,
    wenn die Einheit sonst ein weiteres Blatt braeuchte."""
    a3=cfg["aufgaben"][2]
    soll=max(int(a3.get("zeilen",3)),3)
    B,_nl=einpassen(lambda n: bausteine_b(cfg,n),3,soll)
    return setze_einheit(B,kopfzeile(cfg,nr,"Seite B · Verstehen & üben"),
                         cfg.get("titel") or cfg["name"],pn,
                         "Seite B "+cfg["id"],qr=cfg["id"])


# ═════════════════════════════════════════════════════════════════════════════
#  LEHRERTEIL  (Lehrerband - fuer Erwachsene, deshalb auf FLIESS)
# ═════════════════════════════════════════════════════════════════════════════
def lehrer_bloecke(cfg):
    """Die zehn Pflichtbloecke des Profils, in der Reihenfolge des Unterrichts."""
    lo=LOES[cfg["id"]]
    return [
        ("Lernziel",[lo["lernziel"]]),
        ("Material und Zeit",[lo["material"],lo["zeit"]+"  ·  "+lo["sozialform"]]),
        ("Wenn die Simulation nicht geht",[lo["ersatz_ohne_simulation"]]),
        ("Merksatz",["Lücke 1: "+lo["merksatz"][0]+"  ·  Lücke 2: "+lo["merksatz"][1]]),
        ("Tabelle (erwartet)",[" | ".join(r) for r in lo["tabelle_erwartet"]]),
        ("Aufgabe 1 – "+cfg["aufgaben"][0]["op"],
         [f"Richtig ist Antwort {lo['a1']['richtig']+1}.",lo["a1"]["weg"]]+
         ["Typischer Fehler: "+t for t in lo["a1"]["typische_fehler"]]),
        ("Aufgabe 2 – Trage ein",
         ["Lösungen: "+", ".join(lo["a2"]["loesungen"])]+
         ["Typischer Fehler: "+t for t in lo["a2"]["typische_fehler"]]),
        ("Aufgabe 3 – Erwartungshorizont",
         [lo["a3"]["erwartung"]]+
         ["Auch richtig: "+t for t in lo["a3"]["alternativen"]]+
         ["Typischer Fehler: "+t for t in lo["a3"]["typische_fehler"]]),
        ("Hilfe 3, letztes Wort",[lo["hilfe3_wort"]]),
        ("Für besonders schwache Schülerinnen und Schüler",lo["schwache"]),
        ("Zusatzaufgabe",[lo["zusatz"]]),
        ("Kernlehrplan",[lo["kernlehrplan"]]),
    ]


def seite_l(cfg,pn):
    """Lehrerteil einer Einheit. Gibt eine LISTE von Seiten zurueck.

    Frueher war es genau eine Seite, und alles unterhalb der Blattkante wurde
    stillschweigend abgeschnitten. Jetzt entscheidet der Umbruch: ein Block-
    titel haelt seinen ersten Punkt fest (haftet), damit keine Ueberschrift
    allein am Seitenfuss stehen bleibt.

    Umbrochen wird ZEILENWEISE (b_zeilen), nicht punktweise: Ein einzelner Punkt
    kann hoeher sein als eine ganze Seite - in Band 9 traegt fe11 einen
    Erwartungshorizont ueber 2250 Einheiten, eine Folgeseite fasst 1480. Wer nur
    zwischen Punkten trennt, legt ihn auf ein frisches Blatt und laesst ihn dort
    unten wieder herauslaufen."""
    B=[b_titel(cfg.get("titel") or cfg["name"],
               unterzeile="Lösungen, Erwartungshorizont und typische Fehler",
               unterzeile_grad=fd.FLIESS)]
    for titel,punkte in lehrer_bloecke(cfg):
        B.append(b_unterkopf(titel,breite=LESE))
        for p in punkte:
            B+=b_zeilen(p,grad=fd.FLIESS,punkt=True,name="Punkt")
        B[-1].abstand=fd.ABS_AUFGABE
    B[-1].abstand=fd.ABS_ZEILE
    return setze_einheit(B,"Lehrerteil · nur für Lehrkräfte",
                         cfg.get("titel") or cfg["name"],pn,"Lehrerteil "+cfg["id"])


# ═════════════════════════════════════════════════════════════════════════════
#  PROBELAUF EINER EINZELNEN EINHEIT
# ═════════════════════════════════════════════════════════════════════════════
if __name__=="__main__":
    if len(sys.argv)>1 and sys.argv[1]=="--probe":
        # Alle Einheiten setzen und die Endhoehen melden - NICHTS ueberschreiben.
        outdir=os.path.join(HERE,"build","probe"); os.makedirs(outdir,exist_ok=True)
        for eid,cfg in SEITEN.items():
            bilder=[]
            for i,img in enumerate(seite_a(cfg,1)): bilder.append((f"a{i+1}",img))
            for i,img in enumerate(seite_b(cfg,2)): bilder.append((f"b{i+1}",img))
            for i,img in enumerate(seite_l(cfg,3)): bilder.append((f"l{i+1}",img))
            for name,img in bilder: img.save(os.path.join(outdir,f"{eid}_{name}.png"))
        print("\n── PROBE-BERICHT ──")
        voll=[p for p in PROBE if p[2]>fd.UNTEN+0.5]
        for name,seite,y in sorted(PROBE,key=lambda p:-p[2])[:12]:
            print(f"  {name:26s} endet {y:.0f}, Grenze {fd.UNTEN:.0f}")
        print(f"{len(PROBE)} Seiten gesetzt, {len(voll)} ueber dem Satzspiegel, "
              f"{len(WAISEN)} einsame Ueberschriften.")
        sys.exit(1 if (voll or WAISEN) else 0)
    cfg=SEITEN[sys.argv[1] if len(sys.argv)>1 else next(iter(SEITEN))]
    seiten=seite_a(cfg,1)
    seiten+=seite_b(cfg,1+len(seiten))
    seiten+=seite_l(cfg,1+len(seiten))
    outdir=os.path.join(HERE,"build"); os.makedirs(outdir,exist_ok=True)
    for i,s in enumerate(seiten): s.save(os.path.join(outdir,f"pilot_p{i+1}.png"))
    pdf=os.path.join(os.path.expanduser("~/Desktop"),f"FELO_Foerder_{KL}_Pilot.pdf")
    seiten[0].save(pdf,save_all=True,append_images=seiten[1:],resolution=150)
    print("SAVED",pdf)
