# -*- coding: utf-8 -*-
"""Physik-Gesamtheft Klasse 5/6 Realschule: sechs Kapitel, Test hinter jedem Kapitel.

Der Satzmotor liegt unveraendert in build_final.py - er ist gepruefte Ware und wird
hier nur importiert. Die Themenzeichnungen stehen in diagrams.py, ebenfalls
unveraendert; sie werden massstabsgetreu vergroessert eingesetzt (siehe zeichnung()).

DER SCHUELERBAND STEHT IM NEUEN SATZ (Fassung "spec", felo_design.py).
    Weisser Grund, Fliesstext 12 pt, hoechstens zwei Akzentfarben, linksbuendig,
    keine Woerter in Grossbuchstaben. JEDE Schrift kommt ueber fd.schrift(art, GRAD)
    aus der Groessentafel des Moduls - eine nackte Zahl wie AV(15.5) gibt es im
    Schuelerband nicht mehr. Jede gesetzte Zeichenkette laeuft durch die cmap-Pruefung.

DREI ENTSCHEIDUNGEN DES AUFTRAGGEBERS SIND HIER UMGESETZT
    1  Die Raetselseiten werden nicht mehr gesetzt. ch_wortgitter und ch_kreuzwort
       stehen weiter unten - unveraendert, nur ohne Aufruf; assessment.json bleibt
       vollstaendig (die Woerter tragen weiter die Test-Vorbereitung).
    2  Der Loesungsteil ist ein EIGENES PDF: ..._Lehrerband.pdf, mit eigenem
       Deckblatt und eigener Zaehlung, im kompakten Satz - er ist fuer Erwachsene.
       Vorbild: arbeitsheft8/build_book.py::build_lehrerband.
    3  Der Messwerte-Anhang BLEIBT im Schuelerband. Die Forscherseiten verweisen
       woertlich darauf ("Ohne Geraet: Messwerte im Anhang") - er darf nicht in
       den Lehrerband wandern, sonst zeigt jede der 31 Seiten ins Leere.

WAS NICHT ANGETASTET WIRD
    Die Heftkennungen (m, l, s, w, sc, h) und damit die gedruckten QR-Codes; die
    Lage des Codes (1050,53)-(1176,179), aus der simcheck/seitenzahlen.py liest;
    die Namen SIM, CHAPTERS, FSD, UEBD, SZ_NACH, HERE, sim_url, die
    export_bruecke.py und make_qr.py aus diesem Modul holen.
"""
import os, sys, json, glob
import re
from build_final import *
import felo_design as fd
from PIL import Image, ImageDraw, ImageChops
import importlib.util as _ilu
# Lehrplan-Zuordnung liegt in arbeitsheft/ und wird ueber den Pfad geladen -
# nicht ueber sys.path, sonst erwischt das folgende build_book das falsche Heft.
_spec=_ilu.spec_from_file_location("lehrplan", os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "arbeitsheft", "lehrplan.py"))
lehrplan=_ilu.module_from_spec(_spec); _spec.loader.exec_module(lehrplan)
_kspec=_ilu.spec_from_file_location("kompetenzen", os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "arbeitsheft",
    "kompetenzen.py"))
kompetenzen=_ilu.module_from_spec(_kspec); _kspec.loader.exec_module(kompetenzen)
from diagrams import SCENES, sym_batt, sym_lamp, sym_switch, sym_motor, sym_buzzer, WIRE
import diagrams
# ACHTUNG: build_final definiert selbst ein HERE und der Stern-Import zieht es mit
# herein. HERE wird deshalb DANACH gesetzt.
HERE=os.path.dirname(os.path.abspath(__file__))

# Die Szenen aus diagrams.py sind im alten Goldton beschriftet. Die Zeichnungen
# selbst bleiben unveraendert (die Datei zeichnet auch fuer bilder.py); nur die
# drei Farbnamen, die sie fuer SCHRIFT benutzt, werden auf die Farbtafel des
# neuen Satzes gelegt. So steht auf einer Seite nicht Petrol neben Gold.
diagrams.GOLD_D=fd.AKZENT
diagrams.SUB=fd.TEXT
diagrams.INK=fd.TEXT

def _load(n): return json.load(open(os.path.join(HERE,"content",n),encoding="utf-8"))
# Inhalt kommt aus je EINER Quelldatei (Magnetismus ist eingeschmolzen, Titel sind gebacken)
FSD={o["id"]:o for o in _load("forscherseiten.json")}
UEBD={o["id"]:o for o in _load("uebungen.json")}
ASMT={o["id"]:o for o in _load("assessment.json")}
# Transferaufgaben im Anforderungsbereich III, eine Seite je Kapitel
TRANSFER={o["kapitel"]:o["aufgaben"] for o in _load("transfer.json")}

# ── QR-Deep-Links zu den Simulationen der LernStar-App ──
# App öffnet die Sim über  <BASE>#experiment=<simId>  (Handler in app.js).
BASE="https://helinla.github.io/LernStar/"
SIM={
 "m1":"magnetfeld","m2":"magnet-stoffe","m3":"magnetpole","m4":"magnetfeld","m5":"kompass",
 "l1":"lichtausbreitung","l2":"sehen","l3":"schatten-entstehung","l4":"schatten-groesse","l5":"kern-halbschatten",
 "l6":"reflexionsgesetz",
 "s1":"schaltplan","s2":"stromkreis-lampe","s3":"leiter-nichtleiter","s4":"reihenschaltung-rs","s5":"parallelschaltung-rs",
 "s7":"elektromagnet",
 "w1":"temperatur-waerme","w2":"thermometer","w3":"waermeausdehnung","w4":"aggregatzustaende","w5":"waermeuebertragung",
 "sc1":"ton-entsteht","sc2":"lautstaerke","sc3":"tonhoehe","sc4":"schallausbreitung","sc5":"ohr",
 "h1":"tag-nacht","h2":"jahreszeiten","h3":"mondphasen","h4":"sonnenfinsternis","h5":"mondfinsternis",
}
def sim_url(tid):
    # &heft=<tid> sagt der App, VON WELCHER Heftseite der Schueler kommt. Ohne das koennte
    # sie es nicht wissen: m1 und m4 zeigen beide auf "magnetfeld". Die App blendet damit
    # die richtige Forscherfrage ein.
    # s6 (Der Schalter) steht bewusst NICHT in SIM: Die Seite wird am Tisch mit Brettchen,
    # Reisszwecken und Bueroklammer geloest und traegt deshalb keinen QR-Code.
    # Kurze Form: welche Simulation dazugehoert, weiss die App aus
    # js/heft-bruecke.js. Jedes eingesparte Zeichen macht die Module des
    # gedruckten Codes groesser. Die lange Form bleibt in der App gueltig -
    # die gedruckten Hefte von Klasse 5/6 tragen sie.
    return BASE+"#heft="+tid if tid in SIM else None

# Kapitel-Reihenfolge. Die Zeichnung je Topic kommt aus SCENES[id] (siehe _diag).
CHAPTERS=[
 {"id":"magnetismus","title":"Magnetismus","acc":(150,104,44),"topics":["m1","m2","m3","m4","m5"]},
 {"id":"licht","title":"Licht & Schatten","acc":(210,150,40),"topics":["l1","l2","l3","l4","l5","l6"]},
 {"id":"strom","title":"Stromkreis & Elektromagnet","acc":(46,92,178),"topics":["s2","s3","s6","s4","s5","s7"]},
 {"id":"waerme","title":"Temperatur & Wärme","acc":(199,70,60),"topics":["w1","w2","w3","w4","w5"]},
 {"id":"schall","title":"Schall & Hören","acc":(84,56,116),"topics":["sc1","sc2","sc3","sc4","sc5"]},
 {"id":"himmel","title":"Sonne, Erde & Mond","acc":(22,120,118),"topics":["h1","h2","h3","h4","h5"]},
]
# Kapitel-Vorhaben: ein durchgehender Sachzusammenhang, aus dem die Forscher-
# fragen des Kapitels entstehen. Steht als Auftakt auf der Kapitel-Trennseite.
VORHABEN={
 "magnetismus":"Auf dem Schulweg fällt Ben der Schlüssel durch den Gullyrost. Unten liegt er im Laub, halb im Wasser. Ohne ihn steht Ben um vier vor einer verschlossenen Tür. Mia hat einen Magneten und ein Stück Schnur dabei. Ob das reicht, muss sich zeigen.",
 "licht":"Abends um sieben geht in der ganzen Straße das Licht aus. Kein Fernseher, keine Lampe, kein Kühlschrank. Auf dem Tisch liegen eine Taschenlampe, Streichhölzer und eine Kerze. Bis der Strom wieder da ist, findet ihr heraus, woher Licht kommt und warum hinter jedem Ding ein Schatten liegt.",
 "strom":"Emma fährt abends von der Handballhalle nach Hause. Es ist Ende Oktober und um sechs schon dunkel. Ihr Vorderlicht geht nicht, das Kabel an der Gabel ist durchgescheuert, und im Rucksack liegt nur, was eben so drin liegt. Bis sie zu Hause ist, muss das Licht brennen.",
 "waerme":"Ende Oktober, Wandertag. Morgens steht der Atem in der Luft, und auf der Parkbank ist Rast. Dabei stehen Thermoskanne, Becher und Brotdose. Der Tee sollte bis mittags heiß bleiben – er ist es nicht. Das Marmeladenglas geht nicht auf, die Wasserflasche ist gefroren, und der Metallbecher wird so heiß, dass ihn keiner halten kann.",
 "schall":"Ben, Mia, Emma, Jonas und Noah proben im Keller. Zweimal hat der Nachbar schon an die Wand geklopft. Beim dritten Mal ist Schluss, sagt Bens Mutter. Leiser werden, ohne aufzuhören: Dafür müsst ihr erst verstehen, wie ein Ton entsteht und warum er durch die Wand kommt.",
 "himmel":"Auf Emmas Handy liegen tausend Fotos. Zwei zeigen dieselbe Straße, einmal im Schnee und einmal in der Julisonne. Acht zeigen den Mond an acht Abenden, und jedes Mal sieht er anders aus. Eines zeigt einen Mittag, an dem es dunkel wurde. Findet heraus, was der Himmel damit zu tun hat.",
}

# Forscherseiten, die zusaetzlich das Schaltbild zeigen.
SCHALTBILD={"s4":"s4","s5":"s5"}
# Die Schaltzeichen-Legende steht erst hinter diesem Thema: vorher kennen die Kinder
# weder den geschlossenen Kreis noch den Schalter, deren Zeichen sie lernen sollen.
SZ_NACH="s6"

def _diag(chid,tid):
    """Rueckfallebene, falls einem Thema das Einstiegsbild fehlt.

    Zurzeit hat jedes der 33 Themen ein img/einstieg_<tid>.png; die Szene wird
    also nicht gebraucht. Sie bleibt stehen, damit ein neues Thema nicht ohne
    Bild dasteht."""
    fn=SCENES.get(chid)
    return (lambda d,x,y,br=None,fn=fn,tid=tid: szene(d,x,y,fn,tid,br)) if fn else None

BANDNAME="FELO Physik 5/6 · Realschule NRW"
DATEINAME="FELO_Physik_5_6_Realschule_NRW"
FUSS="FELO Physik 5/6 · Forscherheft"
# Der Lehrerband ist ein eigenes Heft und traegt eine eigene Fusszeile.
FUSS_LB  = FUSS.replace("Forscherheft", "Lehrerband")

# ═════════════════════════════════════════════════════════════════════════════
#  NEUER SATZ - Masse, die es in der Groessentafel des Moduls nicht gibt
#
#  Die Groessentafel gilt fuer Seiten, die GELESEN werden. Deckblatt und Kapitel-
#  ziffer sind Schaugroessen; sie werden aus HAUPT abgeleitet und nicht geraten,
#  damit auch sie an genau einer Zahl haengen.
# ═════════════════════════════════════════════════════════════════════════════
DISPLAY_GROSS  = fd.HAUPT * 3      # 66 pt - Wortmarke FELO auf dem Deckblatt
DISPLAY_MITTEL = fd.HAUPT * 2      # 44 pt - Fach/Klasse, Kapitelziffer

# Zeilenhoehen: aus Grad mal Zeilenabstand, beides aus dem Modul.
LH_HAUPT   = round(fd.einheiten(fd.HAUPT)*fd.ZAB, 2)
LH_ZWISCH  = round(fd.einheiten(fd.ZWISCHEN)*fd.ZAB, 2)
LH_KOPF    = round(fd.einheiten(fd.KASTEN_KOPF)*fd.ZAB, 2)
LH_DISPLAY = round(fd.einheiten(DISPLAY_MITTEL)*fd.ZAB, 2)

ANKREUZ  = 27.0        # Kantenlaenge eines Ankreuzkaestchens, Einheiten
BILDSP   = fd.RAND1-fd.RAND0     # Randspalte: Einstiegsbild und QR-Kaertchen

# So breit darf ein Absatz werden, den jemand LIEST. Nicht fd.X1-fd.X0: das ist
# der Satzspiegel des Blattes und traegt ueber 100 Zeichen je Zeile.
# Schreiblinien, Kopf-, Fuss- und Trennlinien bleiben auf fd.X0..fd.X1: sie
# werden nicht gelesen, sondern beschrieben.
LESE = fd.KASTEN_X1-fd.KASTEN_X0      # 830 Einheiten = 398 pt, hoechstens 81 Zeichen

# Lage des QR-Bildes. NICHT VERSCHIEBEN: simcheck/seitenzahlen.py schneidet
# genau (1050, 53)-(1176, 179) aus jeder gesetzten Seite und liest dort die
# Kennung. Wer den Code bewegt, nimmt der ganzen Reihe die gemessene Seitenzahl.
QR_X, QR_Y, QR_KANTE = 1050, 53, 126
QR_KASTEN = (QR_X-12, QR_Y-12, QR_X+QR_KANTE+12, QR_Y+QR_KANTE+30)
QR_LINKS  = QR_KASTEN[0]-12      # bis hierhin duerfen Titel und Kopflinie laufen

PROBE=[]        # (Seitenname, Seitenzahl, Unterkante in Einheiten) - je gesetzte Seite
WAISEN=[]       # Seiten, die mit einer allein stehenden Ueberschrift enden

# ── "Keine Woerter in Grossbuchstaben" (Vorgabe) ─────────────────────────────
# Die Raetselwoerter in assessment.json stehen in Versalien, weil das Wortgitter
# sie so brauchte. Gedruckt werden sie jetzt nur noch in der Test-Vorbereitung -
# dort gilt die Vorgabe. Eine echte Abkuerzung darf ihre Versalien behalten;
# erkannt wird sie daran, dass sie AUCH IM FLIESSTEXT gross geschrieben steht.
def _versalwoerter_im_fliesstext():
    import re
    roh=[]
    def flach(o):
        if isinstance(o,str): roh.append(o)
        elif isinstance(o,dict):
            for v in o.values(): flach(v)
        elif isinstance(o,list):
            for v in o: flach(v)
    flach(list(FSD.values())); flach(list(UEBD.values())); flach(TRANSFER)
    for a in ASMT.values():
        flach(a.get("prep")); flach(a.get("test")); flach(a.get("material"))
    return set(re.findall(r"[A-ZÄÖÜ]{2,}", " ".join(roh)))


ABKUERZUNGEN=_versalwoerter_im_fliesstext()


def wortmarke(w):
    """Ein Wort der Wortliste so setzen, wie es gedruckt werden darf."""
    return w if w in ABKUERZUNGEN else w.capitalize()


def _unterkante(im):
    """Wo endet die Tinte auf diesem Blatt wirklich? Gemessen, nicht gerechnet.

    Gemessen wird am Bild, BEVOR Kopf- und Fusszeile stehen - also genau der
    Inhalt, der in den Satzspiegel gehoert. So faellt auch eine Linie oder ein
    Kastenrand auf, den kein Textprotokoll kennt."""
    bb=ImageChops.difference(im,Image.new("RGB",im.size,fd.GRUND)).getbbox()
    return 0.0 if not bb else bb[3]/float(S)


def qr_karte(h,d,tid):
    """QR-Kaertchen oben rechts, verlinkt die passende Simulation."""
    if tid not in SIM: return None
    pfad=os.path.join(HERE,"qr",f"qr_{tid}.png")
    if not os.path.exists(pfad): return None
    # Weisse Flaeche unter dem Code: die Kopflinie des Seitenrahmens laeuft sonst
    # quer durch den Code hindurch und macht ihn unlesbar.
    d.rectangle([sc(QR_KASTEN[0]),sc(QR_KASTEN[1]),sc(QR_KASTEN[2]),sc(QR_KASTEN[3])],fill=fd.GRUND)
    h.pastefit(pfad,QR_X,QR_Y,QR_KANTE,QR_KANTE)
    fd.T(h,QR_X+QR_KANTE/2,QR_Y+QR_KANTE+6,"Simulation",
         fd.schrift("med",fd.KLEIN),fd.STIL["akzent"],anchor="ma")
    return (QR_X-14,QR_Y-13,QR_X+QR_KANTE+8,QR_Y+QR_KANTE+34)


def blatt(im,d,h,name,kopf,titel,si,gesamt,pn,qr=None,kopf_rechts=None,fuss=None):
    """Ein fertiges Blatt: erst messen, dann Kopf, Fuss und QR daraufsetzen."""
    PROBE.append((name,pn,_unterkante(im)))
    # fd.seitenrahmen druckt die Seitenzahl als pn+seite - `pn` ist dort die ERSTE
    # Seite der Einheit. Hier steht die echte Seitenzahl, also pn-si uebergeben.
    fd.seitenrahmen(h,d,fd.STIL,kopf,kopf_rechts,titel,si,gesamt,pn-si,fuss or FUSS)
    if qr: qr_karte(h,d,qr)
    return fertig(im)


def einpassen(bauer,nmin,nmax):
    """Wie viele Schreibzeilen je Aufgabe? Jede Stufe wird WIRKLICH umbrochen.

    Zwei Regeln, in dieser Reihenfolge: erst die wenigsten Seiten, dann darin die
    meisten Schreibzeilen. Grund fuer die erste: Eine einzige Linie darf nicht auf
    ein zweites, sonst leeres Blatt rutschen.

    fd.schreibraum_auffuellen kann das nicht leisten: es legt Restplatz nur
    HINTER dem letzten Schreibblock nach und macht eine Einheit nie kuerzer."""
    mess=[]
    for n in range(nmin,nmax+1):
        B=bauer(n)
        mess.append((len(fd.umbrechen(B,fd.messe_bausteine(B,fd.STIL))),n,B))
    smin=min(m[0] for m in mess)
    _s,n,B=max([m for m in mess if m[0]==smin],key=lambda m:m[1])
    return B,n


def setze_einheit(B,kopf,titel,pn,name,qr=None,fuellen=False,kopf_rechts=None,
                  ausgleich=False,fuss=None):
    """Bausteine messen, umbrechen, setzen. Gibt die Liste der Seiten zurueck.

    Der Umbruch ist die einzige Stelle, die entscheidet, wie viele Seiten eine
    Einheit bekommt - keine Funktion setzt mehr 'genau eine Seite' und laesst
    PIL den Rest abschneiden."""
    hoehen=fd.messe_bausteine(B,fd.STIL)
    seiten=fd.umbrechen(B,hoehen)
    if fuellen:
        B,hoehen,seiten=fd.schreibraum_auffuellen(B,hoehen,seiten,fd.STIL)
    if ausgleich and len(seiten)>1:
        seiten=ausgleichen(B,hoehen)
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
                          pn+si,qr if si==0 else None,kopf_rechts if si==0 else None,fuss))
    return raus


# ── Bausteine: die immer wiederkehrenden Stuecke ─────────────────────────────
def bst(name,f,abstand=fd.ABS_ZEILE,haftet=0):
    return fd.Baustein(name,f,abstand,haftet)


def b_titel(text,breite=None,unterzeile=None,haftet=1,regel_bis=None):
    """Hauptueberschrift der Einheit mit Zierlinie darunter.

    `regel_bis` zieht die Linie kuerzer: auf der ersten Seite eines Themas
    sitzt rechts der QR-Code, und die Linie liefe sonst durch seine Beschriftung."""
    br=(fd.X1-fd.X0) if breite is None else breite
    xr=fd.X1 if regel_bis is None else regel_bis
    def f(h,d,y):
        ft=fd.schrift("bold",fd.HAUPT)
        zeilen=h.wrap(text,ft,br)
        for i,z in enumerate(zeilen): fd.T(h,fd.X0,y+i*LH_HAUPT,z,ft,fd.STIL["h1"])
        yy=y+len(zeilen)*LH_HAUPT+4
        if unterzeile:
            fd.T(h,fd.X0,yy,unterzeile,fd.schrift("reg",fd.KLEIN),fd.STIL["text"])
            yy+=fd.LH_KLEIN
        h.ln([(fd.X0,yy+8),(xr,yy+8)],fd.STIL["akzent"],1.4)
        return yy+12
    return bst("Titel",f,fd.ABS_ABSCHNITT,haftet)


def aufgabenmarke(h,d,y,nr,titel,komp=None,afb=None,punkte=None):
    """Abschnittsmarke mit Kompetenzkaertchen und - im Test - der Punktzahl."""
    xr=fd.X1
    if punkte is not None:
        t="/ %d P"%punkte; f=fd.schrift("med",fd.KLEIN)
        fd.T(h,xr,y+fd.MARKE_KASTEN/2,t,f,fd.STIL["text"],anchor="rm")
        xr-=h.tw(t,f)+16
    return fd.marke(h,d,y,nr,titel,fd.STIL,komp,afb,xr=xr)


def b_marke(nr,titel,komp=None,afb=None,punkte=None,abstand=fd.ABS_AUFGABE):
    def f(h,d,y): return aufgabenmarke(h,d,y,nr,titel,komp,afb,punkte)
    return bst("Marke %s"%nr,f,abstand,haftet=1)


def unterkopf(h,d,y,text,komp=None,afb=None):
    """Zwischenueberschrift ohne Ziffer - fuer Bloecke innerhalb eines Abschnitts."""
    f=fd.schrift("bold",fd.KASTEN_KOPF)
    fd.T(h,fd.X0,y,text,f,fd.STIL["akzent"])
    if komp: fd.kompchip(h,fd.X1,y-4,komp,afb,fd.STIL)
    h.ln([(fd.X0,y+LH_KOPF+2),(fd.X1,y+LH_KOPF+2)],fd.STIL["zart"],1.2)
    return y+LH_KOPF+10


def b_unterkopf(text,komp=None,afb=None):
    def f(h,d,y): return unterkopf(h,d,y,text,komp,afb)
    return bst("Unterkopf",f,fd.ABS_ZEILE,haftet=1)


def b_para(text,art="reg",grad=None,farbe=None,breite=None,x=None,lh=None,
           abstand=fd.ABS_ZEILE,haftet=0,name="Absatz"):
    grad=fd.FLIESS if grad is None else grad
    def f(h,d,y):
        return fd.para(h,fd.X0 if x is None else x,y,text,fd.schrift(art,grad),
                       fd.STIL["text"] if farbe is None else farbe,
                       fd.SPALTE if breite is None else breite,
                       fd.LH if lh is None else lh)
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

    Uebernommen aus arbeitsheft_foe9/build_pilot.py, wo dieselbe Not bestand.
    b_para setzt einen Absatz als EINEN Baustein: Der Umbruch kann ihn nur ganz
    oder gar nicht auf ein Blatt nehmen. Auf den Schuelerseiten reicht das - dort
    ist kein Absatz laenger als ein paar Zeilen. Im Lehrerteil reicht es NICHT:
    Ein einzelner Erwartungshorizont ist hier bis zu 1300 Einheiten hoch, eine
    Folgeseite fasst rund 1480. Ein Baustein, der nirgends hinpasst, wird vom
    Umbruch auf ein frisches Blatt gelegt und laeuft dort unten heraus - PIL
    schneidet den Rest wortlos ab. Genau dieser Fehler steht zweimal in CLAUDE.md
    ("Der Lehrerteil lief unter der Blattkante weiter", "ch_uebung lief unter die
    Blattkante").

    Deshalb: jede Zeile ein Baustein, und die erste haelt die zweite fest, damit
    nie eine einzelne Zeile allein unten anhaengt."""
    grad=fd.FLIESS if grad is None else grad
    hh=fd.LH if grad==fd.FLIESS else round(fd.einheiten(grad)*fd.ZAB,2)
    r=round(fd.einheiten(grad)*0.55,1)
    xt=round(r*2+14,1) if punkt else 0.0
    br=(LESE if breite is None else breite)-xt
    f=fd.schrift(art,grad)

    # ── FETT: **so** wird fett gesetzt ──────────────────────────────────
    # Nur wenn wirklich eine Marke im Text steht. Sonst laeuft der alte Weg
    # unveraendert weiter (eine Schrift, Zeile fuer Zeile) - der Bestand aus
    # 573 Einheiten aendert damit kein Pixel, bis ihn jemand markiert.
    if "**" in text:
        fb=fd.schrift("bold",grad)
        mh=messhilfe(); sp=mh.tw(" ",f)
        # Text in (Wort, fett)-Paare zerlegen
        laeufe=[]; pos=0
        for m in re.finditer(r"\*\*(.+?)\*\*",text):
            laeufe+=[(w,False) for w in text[pos:m.start()].split()]
            laeufe+=[(w,True)  for w in m.group(1).split()]
            pos=m.end()
        laeufe+=[(w,False) for w in text[pos:].split()]
        # SATZZEICHEN KLEBEN. Aus "**2**." werden sonst der fette Lauf "2" und
        # das Wort "." - und dazwischen setzt der Umbruch ein Leerzeichen:
        # "richtig ist Antwort 2 ." Gesehen auf der gesetzten Lehrerseite von
        # ki5, nicht im Code. Ein Zeichen, das allein steht und nur aus
        # Satzzeichen besteht, gehoert an das Wort davor.
        geklebt=[]
        for w,fett in laeufe:
            if geklebt and all(c in ".,;:!?)»“" for c in w):
                v,vf=geklebt[-1]; geklebt[-1]=(v+w,vf)
            else:
                geklebt.append((w,fett))
        laeufe=geklebt
        # WORTWEISE umbrechen - zwei Schriften sind verschieden breit, ein
        # Umbruch nach der einen sprengt die Zeile der anderen.
        zl=[]; cur=[]; bis=0.0
        for w,fett in laeufe:
            ww=mh.tw(w,fb if fett else f)
            if cur and bis+sp+ww>br:
                zl.append(cur); cur=[]; bis=0.0
            if cur: bis+=sp
            cur.append((w,fett,ww)); bis+=ww
        if cur: zl.append(cur)
        B=[]
        for k,zeile in enumerate(zl or [[]]):
            def zeichne(h,d,y,k=k,zeile=zeile):
                if punkt and k==0:
                    fd.raute(d,fd.X0+r,y+hh*0.45,r*0.45,fd.STIL["akzent"])
                x=fd.X0+xt
                for w,fett,ww in zeile:
                    fd.T(h,x,y,w,fb if fett else f,fd.STIL["text"])
                    x+=ww+sp
                return y+hh
            B.append(bst("%s %d"%(name,k+1),zeichne,abstand=0,
                         haftet=1 if (k==0 and len(zl)>1) else 0))
        B[-1].abstand=abstand
        return B

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
        fd.T(h,x0,y+fd.LINIE_GRUNDLINIE-fd.einheiten(fd.FLIESS),"%d."%nummer,
             fd.schrift("bold",fd.FLIESS),fd.STIL["text"])
        x0+=fd.einheiten(fd.FLIESS)+6
    h.ln([(x0,y+fd.LINIE_GRUNDLINIE),(x1,y+fd.LINIE_GRUNDLINIE)],fd.STIL["linie"],fd.LINIE_STAERKE)
    return y+fd.LINIE_HOEHE


def b_linien(n,x0=None,x1=None,nummeriert=False,praefix="Schreiblinie"):
    """n einzelne Schreiblinien - jede ein eigener Baustein.

    Einzeln, damit der Umbruch mitten im Schreibraum trennen darf und
    schreibraum_auffuellen unten Platz nachlegen kann."""
    B=[]
    for k in range(n):
        def f(h,d,y,k=k): return schreiblinie(h,y,x0,x1,(k+1) if nummeriert else None)
        B.append(bst("%s %d"%(praefix,k+1),f,abstand=0))
    return B


def ankreuz(h,d,x,y):
    h.R(x,y,x+ANKREUZ,y+ANKREUZ,6,outline=fd.STIL["linie"],w=2)


def b_ankreuz(text,art="reg",grad=None,breite=None,abstand=fd.ABS_ZEILE,name="Ankreuzzeile"):
    grad=fd.FLIESS if grad is None else grad
    br=(fd.SPALTE-ANKREUZ-18) if breite is None else breite
    def f(h,d,y):
        ankreuz(h,d,fd.X0,y+2)
        ende=fd.para(h,fd.X0+ANKREUZ+18,y,text,fd.schrift(art,grad),fd.STIL["text"],br,fd.LH)
        return max(y+ANKREUZ+4,ende)
    return bst(name,f,abstand)
def b_schreibzeile(label,abstand=fd.ABS_ZEILE,name=None):
    """Beschriftung, dahinter eine Schreiblinie bis zum rechten Rand.

    Verallgemeinert das fruehere b_begruende: "Begruende:", "Eigene Vermutung:"
    und "Das sehe ich an diesem Wert:" sind derselbe Baustein. Die Linie setzt
    hinter der GEMESSENEN Beschriftungsbreite an, nicht hinter einem Schaetzwert."""
    def f(h,d,y):
        ft=fd.schrift("med",fd.FLIESS)
        fd.T(h,fd.X0,y,label,ft,fd.STIL["text"])
        b=h.tw(label,ft)+16
        h.ln([(fd.X0+b,y+fd.LH*0.82),(fd.X1,y+fd.LH*0.82)],fd.STIL["linie"],fd.LINIE_STAERKE)
        return y+fd.LH
    return bst(name or label.rstrip(":"),f,abstand)


def b_kreuzreihe(vorsatz,labels,abstand=fd.ABS_ZEILE,name="Kreuzreihe"):
    """Mehrere Ankreuzkaestchen NEBENEINANDER in einer Zeile.

    Fuer "Meine Vermutung war: richtig / teilweise richtig / nicht richtig".
    Untereinander kostete das drei Zeilen, die bei den Schreiblinien fehlen.
    Jede Gruppe wird EINZELN vermessen; passt die Reihe nicht in die Spalte,
    bricht sie um, statt unter dem Satzspiegel zu verschwinden."""
    def f(h,d,y):
        ft=fd.schrift("med",fd.FLIESS)
        fr=fd.schrift("reg",fd.FLIESS)
        x=fd.X0; zeile=y
        if vorsatz:
            fd.T(h,x,zeile,vorsatz,ft,fd.STIL["text"])
            x+=h.tw(vorsatz,ft)+22
        for lab in labels:
            br=ANKREUZ+10+h.tw(lab,fr)
            if x+br>fd.X0+fd.SPALTE and x>fd.X0:
                zeile+=fd.LH; x=fd.X0
            ankreuz(h,d,x,zeile+2)
            fd.T(h,x+ANKREUZ+10,zeile,lab,fr,fd.STIL["text"])
            x+=br+26
        return max(zeile+ANKREUZ+4,zeile+fd.LH)
    return bst(name,f,abstand)



# ═════════════════════════════════════════════════════════════════════════════
#  ZEICHNUNGEN AUS diagrams.py - MASSSTABSGETREU VERGROESSERT
#
#  diagrams.py ist fuer den alten, engen Satz gebaut: seine Beschriftungen
#  stehen auf AVM(10,5) und AVB(11) - gedruckt sind das 5,0 und 5,3 pt, also
#  unter jeder Grenze der Groessentafel. Die Datei wird NICHT geaendert (sie
#  zeichnet auch fuer bilder.py und die Bildauftraege). Stattdessen wird eine
#  Szene in Originalgroesse auf eine eigene Flaeche gezeichnet und als GANZES
#  vergroessert eingesetzt: Strich und Schrift wachsen zusammen.
# ═════════════════════════════════════════════════════════════════════════════
SZENE_NB, SZENE_NH = 300, 162     # native Flaeche einer Szene aus diagrams.py
SZENE_BREITE       = 600          # so breit steht sie im neuen Satz -> Faktor 2,0
SZ_NB, SZ_NH       = 100, 80      # native Flaeche EINES Schaltzeichens
# Faktor 1,5: aus den 7,2 pt der Polbeschriftung "+ –" werden 10,8 pt. Groesser
# gesetzt (1,7) passen die acht Zeichen nicht mehr auf EIN Blatt, und "Verbindung"
# steht allein oben auf der Folgeseite - gemessen, nicht geschaetzt.
SZ_BREITE          = 150


def zeichnung(d,x,y,malen,nb,nh,breite):
    """Eine Zeichnung massstabsgetreu vergroessert auf die Seite setzen.

    `malen(h2,0,0)` zeichnet in eine Flaeche nb x nh Einheiten. Zurueck kommt die
    Unterkante auf der Seite.

    Die Laeufe der unsichtbaren Textebene werden mitgerechnet - sonst laege die
    durchsuchbare Schicht an den Koordinaten der Hilfsflaeche. Und sie werden in
    fd.GESETZT nachgetragen, damit auch die Beschriftungen einer Zeichnung durch
    die Zeichen- und die Versalprobe laufen."""
    k=float(breite)/nb
    tmp=Image.new("RGBA",(sc(nb),sc(nh)),(255,255,255,0))
    td=ImageDraw.Draw(tmp,"RGBA")
    n0=len(TEXTE)
    malen(hp(tmp,td),0.0,0.0)
    laeufe=TEXTE[n0:]; del TEXTE[n0:]
    gross=tmp.resize((sc(breite),sc(nh*k)),Image.LANCZOS)
    # ImageDraw haelt sein Bild als _image. Ueber diesen Weg findet die Zeichnung
    # auch waehrend fd.messe_bausteine() das RICHTIGE Blatt - eine gemerkte
    # Seitenvariable wuerde beim Messen auf das vorige Blatt zeigen.
    ziel=getattr(d,"_image",None)
    if ziel is not None: ziel.paste(gross,(sc(x),sc(y)),gross)
    for tx,ty,tb,ts,s in laeufe:
        TEXTE.append((x+tx*k,y+ty*k,tb*k,ts*k,s))
        fd.GESETZT.append((s,"reg",ts*k*fd.PT_JE_EINHEIT))
    return y+nh*k


def szene(d,x,y,fn,tid,breite=None):
    br=SZENE_BREITE if breite is None else breite
    return zeichnung(d,x,y,lambda th,xx,yy: fn(th,xx,yy,tid),SZENE_NB,SZENE_NH,br)


def b_szene(fn,tid,name="Zeichnung"):
    """Eine Szene mittig in der Lesespalte."""
    def f(h,d,y):
        return szene(d,fd.X0+(LESE-SZENE_BREITE)/2,y,fn,tid)
    return bst(name,f,fd.ABS_AUFGABE)


# ── Kaesten, die das Modul nicht selbst mitbringt ────────────────────────────
def gitterzeichen(d,cx,cy,r,fill):
    """Gezeichnetes Tabellenzeichen - Ersatz fuer "▤" (U+25A4).

    SourceSans3 kennt U+25A4 nicht; PIL druckt dafuer wortlos ein leeres
    Kaestchen. Gezeichnet kann das nicht passieren."""
    x0,y0,x1,y1=cx-r,cy-r*0.78,cx+r,cy+r*0.78
    d.rectangle([sc(x0),sc(y0),sc(x1),sc(y1)],outline=fill,width=max(1,sc(1.2)))
    for k in (1,2):
        yy=y0+(y1-y0)*k/3.0
        d.line([(sc(x0),sc(yy)),(sc(x1),sc(yy))],fill=fill,width=max(1,sc(1.0)))
    d.line([(sc(cx),sc(y0)),(sc(cx),sc(y1))],fill=fill,width=max(1,sc(1.0)))


def kasten_quelle(h,d,y,st,text,zeichner=None):
    """Woher die Zahlen kommen - Bildschirm oder gedrucktes Datenblatt.

    Bauart und Merkmale des Experimentierkastens aus dem Modul (Doppelrahmen +
    Zeichen an der linken Kante); nur das Zeichen ist austauschbar. Also auch
    seine Breite: fd.KASTEN_X0..fd.KASTEN_X1, die Lesespalte."""
    st=st or fd.STIL
    innen=26
    kx0,kx1=fd.KASTEN_X0,fd.KASTEN_X1
    xi=kx0+innen+36
    bw=kx1-innen-xi
    zeilen=h.wrap(text,fd.schrift("reg",fd.FLIESS),bw)
    hoehe=20+len(zeilen)*fd.LH+18
    h.R(kx0,y,kx1,y+hoehe,10,fill=st["exp_grund"],outline=st["akzent"],w=1.6)
    h.R(kx0+7,y+7,kx1-7,y+hoehe-7,7,outline=st["akzent"],w=0.9)
    (zeichner or fd.dreieck)(d,kx0+innen+8,y+20+fd.LH*0.36,15,st["akzent"])
    for i,z in enumerate(zeilen):
        fd.T(h,xi,y+20+i*fd.LH,z,fd.schrift("reg",fd.FLIESS),st["text"])
    fd.KAESTEN.append((None,"Experimentierkasten",kx0,y,kx1,y+hoehe,
                       fd.MERKMAL["Experimentierkasten"]))
    return y+hoehe


def _gitter_mittig(d,x,cy,b,fill):
    gitterzeichen(d,x+b*0.5,cy,b*0.55,fill)


def ausgleichen(B,hoehen):
    """Umbrechen und den Bruch AUSGLEICHEN, ohne eine Seite zu kosten.

    fd.umbrechen fuellt gierig: Seite 1 randvoll, der Rest faellt hinten heraus.
    Fuer Schreibseiten ist das richtig - dort holt schreibraum_auffuellen den
    Platz zurueck. Fuer eine Kapitel-Trennseite ist es falsch: Die beiden Kapitel
    dieses Bandes tragen 16 und 12 Themen, also mehr als ein Blatt fasst - und in
    Kapitel 1 kommt eine lange Materialliste dazu. Ohne Ausgleich stuenden auf
    Seite 2 nur die letzten Kaestchen und die Leitzeile. (Klasse 8 kennt das
    nicht - dort hat kein Kapitel mehr als sieben Themen und jede Trennseite
    passt auf ein Blatt.)

    Gesucht wird deshalb die NIEDRIGSTE Blattkante, bei der die Einheit noch
    mit derselben Seitenzahl auskommt. Jede Einheit unterhalb davon wuerde eine
    Seite mehr kosten - der Ausgleich ist also gratis. Gemessen wird das
    Ergebnis, nicht angenommen: kommt etwas anderes heraus als dieselbe
    Seitenzahl, bleibt der gierige Umbruch stehen."""
    seiten=fd.umbrechen(B,hoehen)
    n=len(seiten)
    if n<2: return seiten
    lo,hi=int(fd.OBEN+fd.FORTS)+1,int(fd.UNTEN)
    while lo<hi:
        m=(lo+hi)//2
        if len(fd.umbrechen(B,hoehen,unten=m))<=n: hi=m
        else: lo=m+1
    besser=fd.umbrechen(B,hoehen,unten=lo)
    return besser if len(besser)==n else seiten



def kasten_frage(h,d,y,st,frage,auftrag=None):
    """Forscherfrage und Forschungsauftrag - weisser Grund, Petrol-Rand, Scheibe.

    Das Modul nennt die Forscherfrage bei den Kaesten auf KASTEN_WEISS; sie hat
    aber eine eigene Bauart (Scheibe mit Fragezeichen) und steht deshalb hier."""
    st=st or fd.STIL
    innen=26
    kx0,kx1=fd.KASTEN_X0,fd.KASTEN_X1
    xi=kx0+innen+50
    bw=kx1-innen-xi
    ff=fd.schrift("med",fd.FLIESS); fb=fd.schrift("bold",fd.FLIESS)
    op,rest=(frage.split(":",1)[0]+":",frage.split(":",1)[1].strip()) if ":" in frage else ("",frage)
    fz=fd.zeilen_laeufe(h,[(op,True),(" "+rest,False)] if op else [(frage,False)],ff,fb,bw)
    az=h.wrap(auftrag,fd.schrift("reg",fd.FLIESS),bw) if auftrag else []
    hoehe=20+fz*fd.LH+(10+len(az)*fd.LH if az else 0)+18
    h.R(kx0,y,kx1,y+hoehe,10,fill=st["kasten_weiss"],outline=st["akzent"],w=1.6)
    h.circ(kx0+innen+16,y+20+fd.LH*0.5,16,fill=st["akzent"])
    fd.T(h,kx0+innen+16,y+20+fd.LH*0.5+1,"?",fd.schrift("bold",fd.FLIESS),
         st["akzent_schrift"],anchor="mm")
    yy=fd.setze_laeufe(h,xi,y+20,[(op,True),(" "+rest,False)] if op else [(frage,False)],
                       ff,fb,st["text"],bw,fd.LH)
    if az:
        h.ln([(xi,yy+4),(kx1-innen,yy+4)],st["zart"],1)
        for i,z in enumerate(az):
            fd.T(h,xi,yy+12+i*fd.LH,z,fd.schrift("reg",fd.FLIESS),st["text"])
    fd.KAESTEN.append((None,"Forscherfrage",kx0,y,kx1,y+hoehe,
                       "Scheibe mit Fragezeichen + Rand, keine Farbflaeche"))
    return y+hoehe


# ═════════════════════════════════════════════════════════════════════════════
#  DATENBLATT  (Seiten ohne Simulation)
# ═════════════════════════════════════════════════════════════════════════════
def datenblatt(h,d,y,daten):
    """Gedrucktes Datenblatt fuer Seiten ohne Simulation.

    Klasse 5/6 hat keine solche Seite - s6 wird am Tisch geloest und braucht
    kein Datenblatt. Der Renderer steht trotzdem im neuen Satz da: die uebrigen
    Baende der Reihe brauchen ihn."""
    n=len(daten["spalten"])
    anteile=[0.60,0.40] if n==2 else [0.36,0.34,0.30]
    y=fd.tabelle(h,d,y,fd.STIL,daten["spalten"],daten["zeilen"],anteile)
    if daten.get("quelle"):
        y=fd.para(h,fd.X0,y+10,daten["quelle"],fd.schrift("reg",fd.KLEIN),
                  fd.STIL["text"],LESE,fd.LH_KLEIN)
    if daten.get("merke"):
        y=fd.para(h,fd.X0,y+10,daten["merke"],fd.schrift("med",fd.FLIESS),
                  fd.STIL["akzent"],LESE,fd.LH)
    return y


# ═════════════════════════════════════════════════════════════════════════════
#  FORSCHERSEITE
# ═════════════════════════════════════════════════════════════════════════════
def topic_pages(cfg,chtitel,fno,pn,diag=None):
    """Eine Forschereinheit: Problem, Vermutung, Forschen, Sichern, Aufgaben."""
    tid=cfg.get("id")
    hat_qr=tid in SIM and os.path.exists(os.path.join(HERE,"qr",f"qr_{tid}.png"))
    eimg=os.path.join(HERE,"img",f"einstieg_{tid}.png")
    hat_bild=os.path.exists(eimg)
    dat=cfg.get("daten")
    am_schirm=bool(sim_url(tid))
    B=[]
    # Titel. Auf Seite 1 sitzt der QR-Code oben rechts, der Titel bleibt links davon.
    B.append(b_titel(cfg.get("titel") or cfg["name"],
                     breite=(QR_LINKS-fd.X0) if hat_qr else None,
                     regel_bis=QR_LINKS if hat_qr else None))

    # ① Das Problem - OHNE Einstiegsbild (Konzept Abdullah, 12.09.2026).
    # Das Bild sass in der RANDSPALTE, der Text in der Lesespalte: sein Wegfall
    # schafft KEINEN Platz fuer die neuen Abschnitte, sondern raeumt die
    # Randspalte frei. Gemessen, nicht geschaetzt.
    B.append(b_marke(1,"Das Problem","E1"))
    def b_problem(h,d,y):
        return fd.para(h,fd.X0,y,cfg["problem"],fd.schrift("reg",fd.FLIESS),
                       fd.STIL["text"],fd.SPALTE,fd.LH)
    B.append(bst("Problem",b_problem,fd.ABS_AUFGABE,haftet=1))
    B.append(bst("Forscherfrage",
                 # Der Forscherauftrag steht NICHT mehr unter der Frage
                 # (Abdullah, 13.09.2026). Er nahm der Vermutung die Aufgabe
                 # weg: Was zu tun ist, sagen die Arbeitsschritte in Abschnitt
                 # ③ - NACH der Vermutung. Das Feld bleibt in den Daten, die
                 # Bruecke zeigt es in der App beim Scannen des QR-Codes.
                 lambda h,d,y: kasten_frage(h,d,y,fd.STIL,cfg["frage"]),
                 fd.ABS_ABSCHNITT))

    # ② Meine Vermutung - DREI Moeglichkeiten plus eine eigene.
    # Zwei Moeglichkeiten sind faktisch eine Ja/Nein-Frage. Wo ein Thema erst
    # zwei hat, druckt die Seite zwei - kein Platzhaltertext.
    B.append(b_marke(2,"Meine Vermutung","E3"))
    B.append(b_para("Kreuze an oder schreibe auf.",art="med",name="Anweisung",haftet=1))
    for t in cfg.get("predict",[])[:3]:
        B.append(b_ankreuz(t,name="Vermutung"))
    B.append(b_schreibzeile("Eigene Vermutung:",name="Eigene Vermutung"))
    B.append(b_schreibzeile("Begründe:",fd.ABS_ABSCHNITT))

    # ③ Probiere es aus
    titel3="Auswerten & beurteilen" if dat else (
           "Probiere es in der Simulation aus" if am_schirm else "Probiere es aus")
    B.append(b_marke(3,titel3,"E6" if dat else "E5"))
    if dat or am_schirm:
        hinweis=("Datenblatt: "+dat["titel"]) if dat else \
                "Öffne die Simulation über den QR-Code und führe die Schritte durch."
        zn=_gitter_mittig if dat else None
        B.append(bst("Quelle",
                     lambda h,d,y,t=hinweis,z=zn: kasten_quelle(h,d,y,fd.STIL,t,z),
                     fd.ABS_AUFGABE,haftet=1))
    for i,st in enumerate(cfg.get("forschen",[])):
        def b_schritt(h,d,y,i=i,st=st):
            h.circ(fd.X0+13,y+fd.LH*0.5,13,fill=fd.STIL["akzent"])
            fd.T(h,fd.X0+13,y+fd.LH*0.5+1,str(i+1),fd.schrift("bold",fd.KLEIN),
                 fd.STIL["akzent_schrift"],anchor="mm")
            return fd.para(h,fd.X0+38,y,st,fd.schrift("reg",fd.FLIESS),fd.STIL["text"],
                           fd.SPALTE-38,fd.LH)
        B.append(bst("Schritt %d"%(i+1),b_schritt,fd.ABS_ZEILE))
    if SCHALTBILD.get(tid):
        B.append(b_szene(SCENES["strom"],SCHALTBILD[tid],"Schaltbild"))
    if dat:
        B.append(bst("Datenblatt",lambda h,d,y: datenblatt(h,d,y,dat),fd.ABS_AUFGABE))
    if cfg.get("sicherheit"):
        B.append(bst("Warnung",
                     lambda h,d,y: fd.kasten_warnung(h,d,y,fd.STIL,cfg["sicherheit"]),
                     fd.ABS_AUFGABE))
    if cfg.get("modellgrenze"):
        B.append(bst("Modellgrenze",
                     lambda h,d,y: fd.kasten_hinweis(h,d,y,fd.STIL,cfg["modellgrenze"]),
                     fd.ABS_AUFGABE))
    B[-1].abstand=fd.ABS_ABSCHNITT

    # ④ Meine Beobachtung
    B.append(b_marke(4,"Meine Beobachtung","K3"))

    cols=cfg["tabCols"]; rows=[[r,""] for r in cfg["tabRows"]]
    B.append(bst("Tabelle",
                 lambda h,d,y: fd.tabelle(h,d,y,fd.STIL,cols,rows,[0.5,0.5],
                                          fd.einheiten(fd.TAB_ZEILE_SCHREIB)),
                 fd.ABS_AUFGABE))
    # Satzanfaenge: die Beobachtung in Worte fassen, bevor sie gedeutet wird.
    for i,sa in enumerate(cfg.get("satzanfaenge") or ["Ich beobachte, dass …"]):
        B.append(b_para(sa,art="med",haftet=1,name="Satzanfang %d"%(i+1)))
        B+=b_linien(1,praefix="Beobachtungslinie %d"%(i+1))
    B[-1].abstand=fd.ABS_ABSCHNITT

    # ⑤ Überprüfe deine Vermutung - DER SCHRITT, DEN ES IN KEINEM BAND GAB.
    # Er steht VOR dem Merkkasten. Stuende der Kasten davor, pruefte das Kind
    # seine Vermutung am gedruckten Loesungstext statt an den eigenen
    # Messwerten - der Rueckbezug waere eine Abschreibuebung.
    B.append(b_marke(5,"Überprüfe deine Vermutung","E6"))
    B.append(b_kreuzreihe("Meine Vermutung war:",
                          ["richtig","teilweise richtig","nicht richtig"],
                          name="Vermutung geprüft"))
    B.append(b_schreibzeile("Das sehe ich an diesem Wert aus meiner Tabelle:",
                            fd.ABS_ABSCHNITT,name="Beleg"))

    # ⑥ Jetzt kann ich es erklären
    auf=cfg["aufgabe"]
    absaetze=[(cfg["fachtext"],[])] if cfg.get("fachtext") else []
    luecken=cfg.get("merksatz",[])[:2]
    B.append(b_marke(6,"Jetzt kann ich es erklären",auf.get("komp"),auf.get("afb")))
    # haftet=0 BEENDET die Klammer. Mit haftet=1 haengt der Merkkasten an der
    # Aufgabe, die an den Schreiblinien haengt - eine unteilbare Gruppe, die auf
    # einer angefangenen Seite nie mehr Platz findet. Gemessen: die untere
    # Haelfte der zweiten Seite blieb leer.
    B.append(bst("Merkkasten",
                 lambda h,d,y: fd.kasten_merk(h,d,y,fd.STIL,"Das musst du mitnehmen",
                                              absaetze,luecken),
                 fd.ABS_AUFGABE,haftet=0))
    B.append(b_para(auf["frage"],art="med",haftet=2,name="Auftrag"))
    if cfg.get("sprachhilfe"):
        B.append(b_para("Sprachhilfe: "+cfg["sprachhilfe"],
                        art="reg",grad=fd.KLEIN,haftet=2,name="Sprachhilfe"))
    B+=b_linien(max(int(auf.get("zeilen",3)),3))
    B[-1].abstand=fd.ABS_ABSCHNITT
    at=cfg.get("alltag") or "Nenne zwei Beispiele, wo dir dieses Thema im Alltag begegnet."
    B.append(b_unterkopf("Alltag & Anwendung",cfg.get("alltagKomp"),cfg.get("alltagAfb")))
    B.append(b_para(at,haftet=1,name="Alltagstext"))
    zaehlen=at.split()[0] in ("Nenne","Finde","Suche","Sammle")
    B+=b_linien(2,nummeriert=zaehlen,praefix="Alltagslinie")

    kopf=f"{chtitel} · Forscherkreis {fno:02d}"
    if cfg.get("basiskonzept"): kopf+=" · Basiskonzept "+cfg["basiskonzept"]
    return setze_einheit(B,kopf,cfg.get("titel") or cfg["name"],pn,
                         "Forscherseite "+str(tid),qr=tid if hat_qr else None,fuellen=True)


# ═════════════════════════════════════════════════════════════════════════════
#  SCHALTZEICHEN-LEGENDE  (nur im Strom-Kapitel)
# ═════════════════════════════════════════════════════════════════════════════
# Ein Schaltzeichen mit Draht-Stummeln, gezeichnet in eine Flaeche SZ_NB x SZ_NH.
# Mittelpunkt (50, 42) - dort ist links und rechts Platz fuer den Stummel und
# oben fuer die Beschriftung der Batteriepole.
def _sz_symbol(h,cx,cy,kind):
    stub=36
    if kind=="wire": h.ln([(cx-stub,cy),(cx+stub,cy)],WIRE,2); return
    if kind=="junction":
        h.ln([(cx-stub,cy),(cx+stub,cy)],WIRE,2); h.ln([(cx,cy-16),(cx,cy+16)],WIRE,2)
        h.circ(cx,cy,4,fill=diagrams.INK); return
    g={"batt":8,"lamp":14,"switch_open":15,"switch_closed":15,"motor":14,"buzzer":13}[kind]
    h.ln([(cx-stub,cy),(cx-g,cy)],WIRE,2); h.ln([(cx+g,cy),(cx+stub,cy)],WIRE,2)
    if kind=="batt": sym_batt(h,cx,cy,labels=True)
    elif kind=="lamp": sym_lamp(h,cx,cy,on=False,r=14)
    elif kind=="switch_open": sym_switch(h,cx,cy,closed=False,ln=30)
    elif kind=="switch_closed": sym_switch(h,cx,cy,closed=True,ln=30)
    elif kind=="motor": sym_motor(h,cx,cy,r=14)
    elif kind=="buzzer": sym_buzzer(h,cx,cy,r=13)


SZ_EINTRAEGE=[
 ("batt","Batterie","treibt den Strom an (Plus- und Minus-Pol)"),
 ("lamp","Lampe","leuchtet, wenn Strom fließt"),
 ("switch_open","Schalter offen","der Kreis ist unterbrochen – aus"),
 ("switch_closed","Schalter geschlossen","der Kreis ist verbunden – an"),
 ("motor","Motor","dreht sich, wenn Strom fließt"),
 ("buzzer","Summer","macht einen Ton"),
 ("wire","Leitung (Kabel)","verbindet die Bauteile"),
 ("junction","Verbindung","hier sind zwei Kabel verbunden"),
]


def b_schaltzeichen(kind,name,note):
    """Eine Zeile der Legende: Zeichen links, Name und Erklaerung rechts."""
    def f(h,d,y):
        unten=zeichnung(d,fd.X0,y,lambda th,x,yy: _sz_symbol(th,x+50,yy+42,kind),
                        SZ_NB,SZ_NH,SZ_BREITE)
        hoehe=unten-y
        xt=fd.X0+SZ_BREITE+26
        fd.T(h,xt,y+hoehe/2-fd.LH,name,fd.schrift("bold",fd.FLIESS),fd.STIL["text"])
        ende=fd.para(h,xt,y+hoehe/2,note,fd.schrift("reg",fd.FLIESS),fd.STIL["text"],
                     fd.KASTEN_X1-xt,fd.LH)
        h.ln([(fd.X0,unten+4),(fd.KASTEN_X1,unten+4)],fd.STIL["zart"],1)
        return max(unten,ende)
    # Kein Zeilenabstand: Die Zierlinie unter jedem Zeichen trennt die Zeilen schon.
    return bst("Schaltzeichen "+name,f,abstand=0)


def ch_schaltzeichen(chtitel,pn):
    """Die Legende der Schaltzeichen - eine eigene Einheit im Strom-Kapitel."""
    z=FSD.get("s1",{})
    hat_qr=os.path.exists(os.path.join(HERE,"qr","qr_s1.png"))
    eimg=os.path.join(HERE,"img","einstieg_s1.png")
    hat_bild=os.path.exists(eimg)
    B=[b_titel("So zeichnet man einen Stromkreis",
               breite=(QR_LINKS-fd.X0) if hat_qr else None,
               regel_bis=QR_LINKS if hat_qr else None)]
    if z.get("titel"):
        B.append(b_para(z["titel"],art="med",farbe=fd.STIL["akzent"],breite=fd.SPALTE,
                        name="Aufhänger",haftet=1))
    def b_problem(h,d,y):
        ende=y
        if z.get("problem"):
            ende=fd.para(h,fd.X0,y,z["problem"],fd.schrift("reg",fd.FLIESS),
                         fd.STIL["text"],fd.SPALTE,fd.LH)
        if hat_bild:
            bw,bh=h.pastefit(eimg,fd.RAND0,y,BILDSP,BILDSP*0.62)
            ende=max(ende,y+bh)
        return ende
    B.append(bst("Problem s1",b_problem,fd.ABS_ABSCHNITT))
    B.append(b_para("Damit jeder dasselbe versteht, malt man die Bauteile nicht ab. Für jedes gibt es ein "
                    "genormtes Zeichen – ein Schaltzeichen. Diese brauchst du:",
                    breite=LESE,name="Einführung",haftet=1))
    for kind,name,note in SZ_EINTRAEGE:
        B.append(b_schaltzeichen(kind,name,note))
    B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_unterkopf("So sieht ein fertiger Schaltplan aus"))
    B.append(b_szene(SCENES["strom"],"s1","Beispielschaltplan"))
    B.append(b_para("Batterie, Lampe und Schalter – mit Leitungen zu einem geschlossenen Kreis verbunden. "
                    "Ist der Schalter zu, fließt Strom und die Lampe leuchtet.",
                    breite=LESE,abstand=fd.ABS_ABSCHNITT,name="Beispieltext"))
    B.append(b_unterkopf("Jetzt du:"))
    B.append(b_para("Stelle einen geschlossenen Stromkreis mit Batterie, Lampe und Schalter dar – "
                    "nur mit Schaltzeichen.",art="med",breite=LESE,haftet=1,name="Zeichenauftrag"))
    def b_flaeche(h,d,y):
        hoehe=300
        h.R(fd.X0,y,fd.X1,y+hoehe,12,outline=fd.STIL["linie"],w=1.6)
        fd.T(h,fd.X1-16,y+hoehe-fd.LH_KLEIN-8,"Zeichenfläche",
             fd.schrift("reg",fd.KLEIN),fd.STIL["linie"],anchor="ra")
        return y+hoehe
    B.append(bst("Zeichenfläche",b_flaeche,fd.ABS_ABSCHNITT))
    return setze_einheit(B,f"{chtitel} · Schaltzeichen","So zeichnet man einen Stromkreis",
                         pn,"Schaltzeichen",qr="s1" if hat_qr else None)


# ═════════════════════════════════════════════════════════════════════════════
#  ÜBUNGSSEITE
# ═════════════════════════════════════════════════════════════════════════════
def b_lueckensatz(m,name="Lückensatz"):
    def f(h,d,y):
        return fd.luecken_satz(h,fd.X0,y,m,fd.STIL,LESE)
    return bst(name,f,fd.ABS_ZEILE)


# Die beiden Ankreuzspalten "richtig"/"falsch". Gemessen so gelegt, dass auch die
# Beschriftung "falsch" noch innerhalb von X1 steht. Angekreuzt wird, nicht
# gelesen - die Kaestchen duerfen deshalb am Blattrand bleiben.
RF_X2 = fd.X1-ANKREUZ-30
RF_X1 = RF_X2-110
# Die Aussage davor wird gelesen und endet darum an der Lesespalte, nicht erst
# am Ankreuzkaestchen: bis dorthin waeren es 905 Einheiten und 85 Zeichen.
RF_TEXT = min(RF_X1-24,fd.KASTEN_X1)-fd.X0


def b_richtigfalsch_kopf(labels=("richtig","falsch")):
    def f(h,d,y):
        fr=fd.schrift("med",fd.KLEIN)
        fd.T(h,RF_X1+ANKREUZ/2,y,labels[0],fr,fd.STIL["text"],anchor="ma")
        fd.T(h,RF_X2+ANKREUZ/2,y,labels[1],fr,fd.STIL["text"],anchor="ma")
        return y+fd.LH_KLEIN
    return bst("Spaltenkopf",f,abstand=4,haftet=1)


def b_richtigfalsch(aussage):
    def f(h,d,y):
        ende=fd.para(h,fd.X0,y,aussage,fd.schrift("reg",fd.FLIESS),fd.STIL["text"],
                     RF_TEXT,fd.LH)
        ankreuz(h,d,RF_X1,y+2); ankreuz(h,d,RF_X2,y+2)
        return max(ende,y+ANKREUZ+4)
    return bst("Aussage",f,fd.ABS_ZEILE)


def b_mc(frage,optionen):
    B=[b_para(frage,art="med",breite=LESE,haftet=1,name="MC-Frage")]
    for o in optionen:
        B.append(b_ankreuz(o,breite=LESE-ANKREUZ-18,name="MC-Option"))
    return B


def ch_uebung(ub,cfg,chtitel,fno,pn,ueber=None):
    kp=(ub.get("komp") or ["UF1","UF1","UF2","K1"])
    ka=(ub.get("afb") or ["I","II","II","II"])
    B=[b_titel("Übungen")]
    B.append(b_para(cfg.get("titel") or cfg["name"],art="med",farbe=fd.STIL["akzent"],
                    breite=LESE,abstand=fd.ABS_ABSCHNITT,name="Themenzeile"))
    B.append(b_marke(1,"Ergänze die Lückensätze.",kp[0],ka[0]))
    for s in ub["lueckensaetze"]: B.append(b_lueckensatz(s))
    B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_marke(2,"Entscheide, ob die Aussagen stimmen. Kreuze an.",kp[1],ka[1]))
    B.append(b_richtigfalsch_kopf())
    for s in ub["richtigfalsch"]: B.append(b_richtigfalsch(s["aussage"]))
    B[-1].abstand=fd.ABS_ABSCHNITT
    mc=ub["mc"]
    B.append(b_marke(3,"Bestimme die richtige Antwort. Kreuze an.",kp[2],ka[2]))
    B+=b_mc(mc["frage"],mc["optionen"])
    B[-1].abstand=fd.ABS_ABSCHNITT
    of=ub["offen"]
    B.append(b_marke(4,"Erkläre in ganzen Sätzen.",kp[3],ka[3]))
    B.append(b_para(of["prompt"],breite=LESE,haftet=2,name="Schreibauftrag"))
    B+=b_linien(max(int(of.get("zeilen",3)),3))
    B[-1].abstand=fd.ABS_ABSCHNITT
    # Selbst-Check
    B.append(b_unterkopf("Mein Selbst-Check"))
    def b_sterne(h,d,y):
        ende=fd.para(h,fd.X0,y,"Bewerte, wie sicher du dich fühlst. Male die Sterne an.",
                     fd.schrift("reg",fd.FLIESS),fd.STIL["text"],fd.SPALTE-160,fd.LH)
        h.stars(fd.X1-190,y+fd.LH*0.6,5,14)
        return max(ende,y+fd.LH)
    B.append(bst("Sterne",b_sterne,fd.ABS_ZEILE,haftet=1))
    def b_ueben(h,d,y):
        f=fd.schrift("med",fd.FLIESS)
        fd.T(h,fd.X0,y,"Das möchte ich noch üben:",f,fd.STIL["text"])
        b=h.tw("Das möchte ich noch üben:",f)+16
        h.ln([(fd.X0+b,y+fd.LH*0.82),(fd.X1,y+fd.LH*0.82)],fd.STIL["linie"],fd.LINIE_STAERKE)
        return y+fd.LH
    B.append(bst("Üben",b_ueben,fd.ABS_ABSCHNITT))
    if ueber:
        B.append(b_unterkopf("Und jetzt?"))
        B.append(b_para(ueber,art="med",farbe=fd.STIL["akzent"],breite=LESE,
                        name="Überleitung"))
    return setze_einheit(B,f"{chtitel} · Forscherkreis {fno:02d}","Übungen",pn,
                         "Übungsseite "+str(ub["id"]),fuellen=True)


# ═════════════════════════════════════════════════════════════════════════════
#  TEST-VORBEREITUNG
# ═════════════════════════════════════════════════════════════════════════════
def ch_testprep(prep,words,chtitel,pn,fuss=None):
    def bauer(nl):
        B=[b_titel("Bereite dich auf den Test vor",unterzeile=chtitel)]
        B.append(b_marke(1,"Prüfe, was du schon kannst. Hake ehrlich ab."))
        for s in prep["kannIch"]:
            B.append(b_ankreuz(s,breite=LESE-ANKREUZ-18,name="Kann-ich"))
        B[-1].abstand=fd.ABS_ABSCHNITT
        B.append(b_marke(2,"Diese Wörter musst du kennen."))
        ws=words[:12]; spalten=3
        zeilen=[ws[i:i+spalten] for i in range(0,len(ws),spalten)]
        for zi,zl in enumerate(zeilen):
            def b_woerter(h,d,y,zl=zl):
                bw=LESE/spalten
                for i,w in enumerate(zl):
                    x=fd.X0+i*bw
                    fd.raute(d,x+7,y+fd.LH*0.45,5,fd.STIL["akzent"])
                    fd.T(h,x+22,y,wortmarke(w),fd.schrift("bold",fd.FLIESS),fd.STIL["text"])
                return y+fd.LH
            B.append(bst("Wörter %d"%(zi+1),b_woerter,fd.ABS_ZEILE))
        B[-1].abstand=fd.ABS_ABSCHNITT
        B.append(b_marke(3,"So übst du richtig."))
        for i,t in enumerate(prep["tipps"]):
            def b_tipp(h,d,y,t=t):
                fd.raute(d,fd.X0+7,y+fd.LH*0.45,5,fd.STIL["akzent"])
                return fd.para(h,fd.X0+26,y,t,fd.schrift("reg",fd.FLIESS),fd.STIL["text"],
                               LESE-26,fd.LH)
            B.append(bst("Tipp %d"%(i+1),b_tipp,fd.ABS_ZEILE))
        B[-1].abstand=fd.ABS_ABSCHNITT
        B.append(b_marke(4,"Prüfe dich selbst mit diesen Fragen."))
        for i,m in enumerate(prep["mini"]):
            def b_mini(h,d,y,i=i,m=m):
                h.circ(fd.X0+13,y+fd.LH*0.5,13,fill=fd.STIL["akzent"])
                fd.T(h,fd.X0+13,y+fd.LH*0.5+1,str(i+1),fd.schrift("bold",fd.KLEIN),
                     fd.STIL["akzent_schrift"],anchor="mm")
                return fd.para(h,fd.X0+38,y,m["frage"],fd.schrift("reg",fd.FLIESS),
                               fd.STIL["text"],LESE-38,fd.LH)
            B.append(bst("Minifrage %d"%(i+1),b_mini,abstand=4,haftet=2))
            B+=b_linien(nl,x0=fd.X0+38,praefix="Minilinie")
            B[-1].abstand=fd.ABS_ZEILE
        B[-1].abstand=fd.ABS_ABSCHNITT
        B.append(b_para("Die Lösungen bespricht ihr im Unterricht.",art="med",
                        breite=LESE,name="Schlusszeile"))
        return B
    # Der Schreibraum der Selbstpruefungsfragen waechst gleichmaessig in den Rest
    # der letzten Seite hinein - solange die Seitenzahl gleich bleibt.
    B,_nl=einpassen(bauer,2,8)
    return setze_einheit(B,chtitel,"Bereite dich auf den Test vor",pn,
                         "Testvorbereitung "+chtitel,fuss=fuss)


# ═════════════════════════════════════════════════════════════════════════════
#  KAPITELTEST
# ═════════════════════════════════════════════════════════════════════════════
def ch_test(test,chtitel,pn,fuss=None):
    P=[4,6,2,3,2]; tot=sum(P)
    B=[b_titel("Test: "+chtitel)]

    def b_kopfzeile(h,d,y):
        f=fd.schrift("med",fd.FLIESS)
        hoehe=fd.LH+24
        h.R(fd.X0,y,fd.X1,y+hoehe,8,outline=fd.STIL["akzent"],w=1.4)
        yy=y+12; xx=fd.X0+20
        for lab,br in (("Name:",260),("Klasse:",110),("Datum:",150)):
            fd.T(h,xx,yy,lab,f,fd.STIL["text"])
            w=h.tw(lab,f)
            if br:
                h.ln([(xx+w+10,yy+fd.LH*0.82),(xx+w+10+br,yy+fd.LH*0.82)],
                     fd.STIL["linie"],fd.LINIE_STAERKE)
            xx+=w+br+40
        fd.T(h,fd.X1-20,yy,"Punkte  ____ / %d"%tot,fd.schrift("bold",fd.FLIESS),
             fd.STIL["akzent"],anchor="ra")
        return y+hoehe
    B.append(bst("Testkopf",b_kopfzeile,fd.ABS_ABSCHNITT))

    B.append(b_marke(1,"Ergänze die Lücken.",punkte=P[0]))
    for s in test["a1"]: B.append(b_lueckensatz(s))
    B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_marke(2,"Entscheide, ob die Aussagen stimmen. Kreuze an.",punkte=P[1]))
    B.append(b_richtigfalsch_kopf())
    for s in test["a2"]: B.append(b_richtigfalsch(s["aussage"]))
    B[-1].abstand=fd.ABS_ABSCHNITT
    mc=test["mc"]
    B.append(b_marke(3,"Bestimme die richtige Antwort. Kreuze an.",punkte=P[2]))
    B+=b_mc(mc["frage"],mc["optionen"])
    B[-1].abstand=fd.ABS_ABSCHNITT
    of=test["offen"]
    B.append(b_marke(4,"Erkläre in ganzen Sätzen.",punkte=P[3]))
    B.append(b_para(of["frage"],breite=LESE,haftet=2,name="Testfrage"))
    B+=b_linien(max(int(of.get("zeilen",3)),3))
    B[-1].abstand=fd.ABS_ABSCHNITT
    tr=test["transfer"]
    B.append(b_marke(5,"Wende dein Wissen auf eine neue Situation an.",punkte=P[4]))
    B.append(b_para(tr["frage"],breite=LESE,haftet=2,name="Transferfrage"))
    B+=b_linien(max(int(tr.get("zeilen",2)),3))
    B[-1].abstand=fd.ABS_ABSCHNITT

    skala=[("1",f"{tot}–{tot-1}"),("2",f"{tot-2}–{tot-4}"),("3",f"{tot-5}–{tot-8}"),
           ("4",f"{tot-9}–{tot-11}"),("5",f"{tot-12}–{max(1,tot-14)}"),
           ("6",f"{max(0,tot-15)}–0")]
    B.append(b_unterkopf("Notenspiegel"))
    B.append(bst("Notentabelle",
                 lambda h,d,y: fd.tabelle(h,d,y,fd.STIL,["Note "+n for n,_ in skala],
                                          [[p+" P" for _,p in skala]]),
                 fd.ABS_AUFGABE))
    B.append(b_para("Viel Erfolg – du schaffst das!",art="bold",grad=fd.ZWISCHEN,
                    farbe=fd.STIL["akzent"],breite=LESE,lh=LH_ZWISCH,name="Zuspruch"))
    return setze_einheit(B,"Kapiteltest · "+chtitel,"Test: "+chtitel,pn,"Test "+chtitel,
                         fuss=fuss)


# ═════════════════════════════════════════════════════════════════════════════
#  HILFEN-SEITE
# ═════════════════════════════════════════════════════════════════════════════
def _short(t,n=2):
    segs=[s.strip() for s in t.replace("„","").replace("“","").replace("\n"," ").split(". ") if s.strip()]
    return (". ".join(segs[:n])).rstrip(".")+"."
SATZANF=[('Vermutung', '„Ich vermute, dass … , weil …“'), ('Vermutung', '„Wenn ich … verändere, dann … , denn …“'), ('Beobachtung', '„Bei … habe ich … abgelesen, bei … dagegen …“'), ('Vergleich', '„Im Vergleich zu … ist … ; der Unterschied beträgt …“'), ('Erklärung', '„Das liegt daran, dass … Deshalb …“'), ('Beurteilung', '„Die Aussage trifft (nicht) zu, weil … Richtig wäre …“')]
HILFEN=['Lies die Forscherfrage noch einmal laut und unterstreiche das eine Wort, nach dem gefragt wird.', 'Verändere in der Simulation immer nur eine Größe und lass die anderen stehen – sonst weißt du am Ende nicht, woran es lag.', 'Trage zuerst deine Zahlen in die Tabelle ein. Erst danach suchst du das Muster, nicht umgekehrt.', 'Schreibe deine Antwort mit einem Satzanfang von oben. Steht dahinter kein „weil“, fehlt noch die Begründung.']
ZUSATZ={'magnetismus': ['Untersuche mit einem Magneten zehn Gegenstände in deinem Zimmer. Ordne sie in zwei Gruppen und suche das Gemeinsame der angezogenen Gegenstände.', 'Prüfe, durch welche Stoffe ein Magnet hindurch wirkt: Papier, Holz, Wasser, Aluminiumfolie. Baue dir dafür eine Anordnung, die du jedes Mal gleich aufbaust.', 'Miss, wie viele Büroklammern ein Magnet in einer Kette hält, und prüfe, ob zwei Magnete zusammen doppelt so viele tragen.'], 'licht': ['Miss den Schatten eines senkrechten Stabes an einem sonnigen Tag jede Stunde und zeichne die Länge über der Uhrzeit auf.', 'Baue eine Lochkamera aus einem Karton und untersuche, wie sich das Bild ändert, wenn du das Loch größer machst.', 'Stelle zwei Lampen nebeneinander auf und beschreibe, was mit den Rändern des Schattens geschieht.'], 'strom': ['Zeichne den Stromkreis einer Taschenlampe als Schaltbild und prüfe an einer echten Lampe, ob deine Zeichnung stimmt.', 'Untersuche an einer Lichterkette, ob sie in Reihe oder parallel geschaltet ist. Begründe mit einer einzigen Beobachtung.', 'Suche in der Wohnung fünf Geräte mit Schalter und ordne sie danach, an welcher Stelle des Stromkreises der Schalter sitzt.'], 'waerme': ['Miss, wie schnell heißes Wasser in einer Tasse und in einer Thermoskanne abkühlt. Nimm alle fünf Minuten einen Wert.', 'Prüfe, ob ein Löffel aus Metall und einer aus Holz im selben heißen Wasser gleich schnell warm werden.', 'Bestimme die Temperatur an fünf Stellen deines Zimmers – am Boden, an der Decke, am Fenster – und erkläre die Unterschiede.'], 'schall': ['Untersuche, wie sich der Ton eines Glases ändert, wenn du unterschiedlich viel Wasser einfüllst. Ordne die Gläser nach Tonhöhe.', 'Miss mit einer Stoppuhr die Zeit bis zum Echo an einer weit entfernten Hauswand und schätze daraus die Schallgeschwindigkeit.', 'Klopfe leise auf einen Tisch und höre einmal aus der Luft und einmal mit dem Ohr auf der Platte. Beschreibe den Unterschied.'], 'himmel': ['Beobachte den Mond eine Woche lang jeden Abend zur selben Zeit und zeichne seine Form auf.', 'Miss den Schatten desselben Stabes an zwei Tagen im Abstand von vier Wochen zur selben Uhrzeit und vergleiche.', 'Suche die Zeiten für Sonnenauf- und -untergang und berechne die Länge des Tages für zwei Monate im Abstand.'], 'optik': ['Bestimme die Brennweite einer Lupe: Wirf ein scharfes Bild der Zimmerlampe auf ein Blatt und miss den Abstand.', 'Sage voraus, wie sich das Bild einer Sammellinse ändert, wenn du die halbe Linse abdeckst – und prüfe es dann.', 'Vergleiche eine Brille aus deiner Familie mit einer Lupe: Sammelt oder zerstreut sie das Licht? Begründe mit einem Versuch.'], 'farben': ['Erzeuge mit einer flachen Wasserschale und einem Spiegel ein Spektrum an der Wand und ordne die Farben von innen nach außen.', 'Prüfe mit farbigen Folien, ob ein roter Gegenstand unter rotem und unter blauem Licht gleich aussieht.', 'Untersuche, ab welchem Blickwinkel du in einem vollen Wasserglas die Oberfläche von unten als Spiegel siehst.'], 'himmel7': ['Verfolge einen hellen Planeten über vier Wochen und trage seine Stellung zwischen den Sternen in eine Skizze ein.', 'Berechne für drei Planeten, wie lange das Sonnenlicht bis zu ihnen braucht, und ordne sie danach.', 'Sieh dir die Gezeitenzeiten einer Nordseestadt für eine Woche an und prüfe, um wie viel sich die Flut täglich verschiebt.'], 'teleskop': ['Suche die Entfernungen von fünf bekannten Sternen und rechne sie in Lichtjahre um.', 'Vergleiche zwei Aufnahmen derselben Galaxie aus verschiedenen Jahrzehnten und beschreibe, was die bessere Technik sichtbar macht.', 'Erkläre jemandem zu Hause in drei Sätzen, warum ein Blick in den Himmel ein Blick in die Vergangenheit ist, und schreibe die Rückfragen auf.'], 'kraefte': ['Bestimme mit Küchenwaage und Federwaage Masse und Gewichtskraft von fünf Gegenständen und trage F über m in ein Diagramm ein.', 'Untersuche an einem Gummiband, ob die Verlängerung dort ebenso gleichmäßig mit der Kraft wächst wie bei der Schraubenfeder.', 'Miss die Kraft, mit der du dieselbe Kiste über verschiedene Untergründe ziehst, und ordne die Untergründe nach der Reibung.'], 'bewegung': ['Miss auf einer 50-Meter-Strecke deine Zeit zu Fuß, im Laufschritt und mit dem Rad und rechne v in m/s und in km/h aus.', 'Bestimme deine Reaktionszeit mit dem Lineal-Fallversuch und rechne aus, wie weit ein Auto mit 50 km/h in dieser Zeit fährt.', 'Filme einen rollenden Ball und prüfe an gleichen Zeitabständen, ob er gleichmäßig langsamer wird.'], 'energie': ['Lies bei fünf Geräten zu Hause die Leistung in Watt ab und berechne, wie viel Energie eine Stunde Betrieb kostet.', 'Bestimme beim Treppensteigen deine Leistung: Miss deine Masse, die Höhe der Treppe und die Zeit.', 'Vergleiche zwei Wege, einen Liter Wasser zu erwärmen – Wasserkocher und Topf auf dem Herd – und begründe den Unterschied im Wirkungsgrad.'], 'kraftwerke': ['Lies eure Stromrechnung: Wie viele Kilowattstunden im Jahr? Rechne aus, wie viel CO₂ das beim heutigen Strommix bedeutet.', 'Finde heraus, welches Kraftwerk in eurer Nähe steht, welchen Brennstoff es nutzt und welche Leistung es hat.', 'Vergleiche für einen einzelnen Tag die Erzeugung aus Wind und Sonne mit dem Verbrauch und beschreibe, wann die Lücke am größten ist.']}


def ch_hilfen(ch,pn):
    """Satzanfaenge, Hilfen und offene Forscherauftraege - eine Einheit je Kapitel.
    Sie stehen bewusst hier und nicht auf den Forscherseiten: dort ist kein Platz,
    ohne die Schreiblinien in Abschnitt 5 zu verlieren."""
    B=[b_titel("So kommst du weiter",unterzeile=ch["title"])]
    B.append(b_marke(1,"So fängst du einen Satz an"))
    for lbl,s in SATZANF:
        def b_satz(h,d,y,lbl=lbl,s=s):
            fd.T(h,fd.X0,y,lbl,fd.schrift("med",fd.FLIESS),fd.STIL["akzent"])
            return fd.para(h,fd.X0+230,y,s,fd.schrift("reg",fd.FLIESS),fd.STIL["text"],
                           LESE-230,fd.LH)
        B.append(bst("Satzanfang",b_satz,fd.ABS_ZEILE))
    B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_marke(2,"Wenn du feststeckst"))
    for i,t in enumerate(HILFEN):
        def b_hilfe(h,d,y,i=i,t=t):
            h.circ(fd.X0+13,y+fd.LH*0.5,13,fill=fd.STIL["akzent"])
            fd.T(h,fd.X0+13,y+fd.LH*0.5+1,str(i+1),fd.schrift("bold",fd.KLEIN),
                 fd.STIL["akzent_schrift"],anchor="mm")
            return fd.para(h,fd.X0+38,y,t,fd.schrift("reg",fd.FLIESS),fd.STIL["text"],
                           LESE-38,fd.LH)
        B.append(bst("Hilfe %d"%(i+1),b_hilfe,fd.ABS_ZEILE))
    B[-1].abstand=fd.ABS_ABSCHNITT
    zusatz=ZUSATZ.get(ch["id"],[])
    B.append(b_marke(3,"Für Schnelle: drei Forscheraufträge"))
    B.append(b_para("Diese Aufträge haben absichtlich keine Lösung im Heft – "
                    "du prüfst dein Ergebnis selbst.",art="med",breite=LESE,
                    haftet=1 if zusatz else 0,name="Hinweis Forscheraufträge"))
    for i,t in enumerate(zusatz):
        def b_zusatz(h,d,y,i=i,t=t):
            h.circ(fd.X0+13,y+fd.LH*0.5,13,fill=fd.STIL["akzent"])
            fd.T(h,fd.X0+13,y+fd.LH*0.5+1,chr(65+i),fd.schrift("bold",fd.KLEIN),
                 fd.STIL["akzent_schrift"],anchor="mm")
            return fd.para(h,fd.X0+38,y,t,fd.schrift("reg",fd.FLIESS),fd.STIL["text"],
                           LESE-38,fd.LH)
        B.append(bst("Forscherauftrag %d"%(i+1),b_zusatz,abstand=4,haftet=2))
        B+=b_linien(5,x0=fd.X0+38,praefix="Auftragslinie")
        B[-1].abstand=fd.ABS_ABSCHNITT
    return setze_einheit(B,"Hilfen · "+ch["title"],"So kommst du weiter",pn,
                         "Hilfen "+ch["id"])


# ═════════════════════════════════════════════════════════════════════════════
#  WEITERDENKEN (Anforderungsbereich III)
# ═════════════════════════════════════════════════════════════════════════════
def ch_transfer(ch,pn):
    """Transferaufgaben im Anforderungsbereich III - eine Einheit je Kapitel.

    Sie stehen bewusst zusammen und nicht verstreut: AFB III verlangt Zeit und
    Raum zum Abwaegen, nicht drei Zeilen am Fuss einer vollen Seite."""
    def bauer(nl):
        B=[b_titel("Beurteilen, planen, Stellung nehmen",unterzeile=ch["title"])]
        B.append(b_para("Diese drei Aufgaben haben nicht die eine richtige Antwort. Es zählt, ob deine "
                        "Begründung trägt. Nimm dir Zeit und schreibe in ganzen Sätzen.",
                        art="med",breite=LESE,abstand=fd.ABS_ABSCHNITT,name="Vorspann"))
        for i,a in enumerate(TRANSFER.get(ch["id"],[])):
            def b_auf(h,d,y,i=i,a=a):
                xr=fd.X1
                xr-=fd.kompchip(h,xr,y,a["komp"],a.get("afb","III"),fd.STIL)+10
                h.circ(fd.X0+16,y+16,16,fill=fd.STIL["akzent"])
                fd.T(h,fd.X0+16,y+17,chr(65+i),fd.schrift("bold",fd.FLIESS),
                     fd.STIL["akzent_schrift"],anchor="mm")
                return fd.para(h,fd.X0+44,y,a["prompt"],fd.schrift("reg",fd.FLIESS),
                               fd.STIL["text"],min(xr,fd.KASTEN_X1)-fd.X0-44,fd.LH)
            B.append(bst("Weiterdenken %d"%(i+1),b_auf,abstand=8,haftet=2))
            B+=b_linien(nl,x0=fd.X0+44,praefix="Denklinie")
            B[-1].abstand=fd.ABS_ABSCHNITT
        return B
    B,_nl=einpassen(bauer,5,10)
    return setze_einheit(B,"Weiterdenken · "+ch["title"],
                         "Beurteilen, planen, Stellung nehmen",pn,"Weiterdenken "+ch["id"])


# ═════════════════════════════════════════════════════════════════════════════
#  KAPITEL-TRENNSEITE
# ═════════════════════════════════════════════════════════════════════════════
# Wo die Themen-Kaestchen auf der Trennseite wirklich stehen - mitgeschrieben,
# nicht nachgerechnet.
TRENNBOXEN={}


def divider(num,ch,pn):
    boxen=[]
    B=[]
    def b_kopf(h,d,y):
        fd.T(h,fd.X0,y,"Forscherkapitel",fd.schrift("med",fd.ZWISCHEN),fd.STIL["akzent"])
        yy=y+LH_ZWISCH+10
        f=fd.schrift("bold",DISPLAY_MITTEL)
        fd.T(h,fd.X0,yy,"%02d"%num,f,fd.STIL["akzent"])
        b=h.tw("%02d"%num,f)+30
        ft=fd.schrift("bold",fd.HAUPT)
        zeilen=h.wrap(ch["title"],ft,fd.X1-fd.X0-b)
        for i,z in enumerate(zeilen):
            fd.T(h,fd.X0+b,yy+(LH_DISPLAY-len(zeilen)*LH_HAUPT)/2+i*LH_HAUPT,z,ft,fd.STIL["h1"])
        yy+=max(LH_DISPLAY,len(zeilen)*LH_HAUPT)+8
        h.ln([(fd.X0,yy),(fd.X1,yy)],fd.STIL["akzent"],1.4)
        return yy+4
    B.append(bst("Kapitelkopf",b_kopf,fd.ABS_ABSCHNITT,haftet=1))
    _fd=lehrplan.feld(ch["id"])
    if _fd:
        _nr,_nm,_bk=_fd
        B.append(b_para("Inhaltsfeld %d · %s"%(_nr,_nm),art="med",
                        farbe=fd.STIL["akzent"],breite=LESE,name="Inhaltsfeld",haftet=1))
        B.append(b_para("Basiskonzepte: "+" · ".join(_bk.keys()),grad=fd.KLEIN,
                        lh=fd.LH_KLEIN,breite=LESE,abstand=fd.ABS_ABSCHNITT,
                        name="Basiskonzepte"))
    vb=VORHABEN.get(ch["id"])
    if vb:
        B.append(b_unterkopf("Das Vorhaben"))
        B.append(b_para(vb,breite=LESE,abstand=fd.ABS_ABSCHNITT,name="Vorhaben"))
    mat=(ASMT.get(ch["id"]) or {}).get("material")
    if mat:
        B.append(b_unterkopf("Für dieses Kapitel brauchst du"))
        B.append(b_para(" · ".join(mat),breite=LESE,abstand=fd.ABS_ABSCHNITT,
                        name="Material"))
    B.append(b_unterkopf("Die Themen dieses Kapitels"))
    for i,tid in enumerate(ch["topics"]):
        def b_thema(h,d,y,i=i,tid=tid):
            hoehe=fd.LH+18
            h.R(fd.X0,y,fd.X1,y+hoehe,hoehe/2,outline=fd.STIL["linie"],w=1.2)
            h.circ(fd.X0+24,y+hoehe/2,13,fill=fd.STIL["akzent"])
            fd.T(h,fd.X0+24,y+hoehe/2+1,str(i+1),fd.schrift("bold",fd.KLEIN),
                 fd.STIL["akzent_schrift"],anchor="mm")
            fd.T(h,fd.X0+50,y+hoehe/2,FSD[tid].get("titel") or FSD[tid]["name"],
                 fd.schrift("med",fd.FLIESS),fd.STIL["text"],anchor="lm")
            boxen.append((fd.X0,y,fd.X1,y+hoehe))
            return y+hoehe
        B.append(bst("Thema %d"%(i+1),b_thema,abstand=10))
    B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_para("Forschen · verstehen · anwenden",art="med",grad=fd.ZWISCHEN,
                    lh=LH_ZWISCH,farbe=fd.STIL["akzent"],breite=LESE,name="Leitwort"))
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
        raus.append(blatt(im,d,h,"Trennseite %s %d/%d"%(ch["id"],si+1,len(seiten)),
                          "Kapitel %d"%num,ch["title"],si,len(seiten),pn+si))
    return raus


# ═════════════════════════════════════════════════════════════════════════════
#  DECKBLATT
# ═════════════════════════════════════════════════════════════════════════════
COVERBOXEN=[]
ZAHLWORT={1:"eine",2:"zwei",3:"drei",4:"vier",5:"fünf",6:"sechs",7:"sieben",8:"acht"}


def book_cover():
    im,d=newp(fd.GRUND); h=hp(im,d)
    del COVERBOXEN[:]
    y=fd.OBEN
    fd.T(h,fd.X0,y,"Forscherheft",fd.schrift("med",fd.ZWISCHEN),fd.STIL["akzent"])
    y+=LH_ZWISCH+18
    fd.T(h,fd.X0,y,"FELO",fd.schrift("bold",DISPLAY_GROSS),fd.STIL["h1"])
    y+=round(fd.einheiten(DISPLAY_GROSS)*fd.ZAB,2)+10
    h.ln([(fd.X0,y),(fd.X1,y)],fd.STIL["akzent"],1.6)
    y+=24
    fd.T(h,fd.X0,y,"Physik 5/6",fd.schrift("bold",DISPLAY_MITTEL),fd.STIL["h1"])
    y+=LH_DISPLAY+6
    fd.T(h,fd.X0,y,"Realschule NRW",fd.schrift("med",fd.HAUPT),fd.STIL["akzent"])
    y+=LH_HAUPT+8
    fd.T(h,fd.X0,y,"Forschen · verstehen · anwenden",fd.schrift("reg",fd.ZWISCHEN),
         fd.STIL["text"])
    # Die Kapitelliste steht im unteren Drittel, damit das Blatt nicht kopflastig
    # wird: der Titelblock oben, das Verzeichnis unten, die Wortmarke dazwischen.
    kh=fd.LH+24
    y=fd.UNTEN-(len(CHAPTERS)*(kh+14)+LH_KOPF+22+fd.LH+fd.LH_KLEIN+40)
    fd.T(h,fd.X0,y,"Die %s Kapitel"%ZAHLWORT.get(len(CHAPTERS),str(len(CHAPTERS))),
         fd.schrift("bold",fd.KASTEN_KOPF),fd.STIL["akzent"])
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
    fd.T(h,fd.X0,y,"orientiert an den Themen des Physikunterrichts der Sekundarstufe I",
         fd.schrift("reg",fd.KLEIN),fd.STIL["text"])
    PROBE.append(("Deckblatt",1,_unterkante(im)))
    return fertig(im)


# ═════════════════════════════════════════════════════════════════════════════
#  INHALTSVERZEICHNIS
# ═════════════════════════════════════════════════════════════════════════════
TOCBOXEN=[]


def toc(starts,pn,mess_pn=None,zusatz=()):
    im,d=newp(fd.GRUND); h=hp(im,d)
    del TOCBOXEN[:]
    y=fd.OBEN
    fd.T(h,fd.X0,y,"Inhalt",fd.schrift("bold",fd.HAUPT),fd.STIL["h1"])
    y+=LH_HAUPT+6
    h.ln([(fd.X0,y),(fd.X1,y)],fd.STIL["akzent"],1.4)
    y+=34
    for i,(titel,pg) in enumerate(starts):
        hoehe=fd.LH+22
        h.R(fd.X0,y,fd.X0+50,y+hoehe,9,fill=fd.STIL["akzent"])
        fd.T(h,fd.X0+25,y+hoehe/2+1,str(i+1),fd.schrift("bold",fd.MARKE_ZIFFER),
             fd.STIL["akzent_schrift"],anchor="mm")
        fd.T(h,fd.X0+68,y+hoehe/2,titel,fd.schrift("med",fd.FLIESS),fd.STIL["text"],anchor="lm")
        seite="Seite %d"%pg
        fs=fd.schrift("med",fd.FLIESS)
        fd.T(h,fd.X1,y+hoehe/2,seite,fs,fd.STIL["akzent"],anchor="rm")
        x=fd.X0+68+h.tw(titel,fd.schrift("med",fd.FLIESS))+14
        while x<fd.X1-h.tw(seite,fs)-14:
            h.circ(x,y+hoehe/2,1.3,fill=fd.STIL["zart"]); x+=12
        TOCBOXEN.append((fd.X0,y,fd.X1,y+hoehe))
        y+=hoehe+16
    y+=18
    for lbl,pg in zusatz:
        fd.T(h,fd.X0+68,y,lbl,fd.schrift("reg",fd.FLIESS),fd.STIL["text"])
        fd.T(h,fd.X1,y,"Seite %d"%pg,fd.schrift("med",fd.FLIESS),fd.STIL["akzent"],anchor="ra")
        y+=fd.LH+6
    y+=18
    note="Jedes Kapitel endet mit einem Test."
    if mess_pn: note+="  ·  Messwerte ab Seite %d."%mess_pn
    note+="  ·  Die Lösungen stehen im Lehrerband, einem eigenen Heft."
    fd.para(h,fd.X0,y,note,fd.schrift("reg",fd.FLIESS),fd.STIL["text"],LESE,fd.LH)
    PROBE.append(("Inhalt",pn,_unterkante(im)))
    fd.seitenrahmen(h,d,fd.STIL,BANDNAME,None,"Inhalt",0,1,pn,FUSS)
    return fertig(im)


# ═════════════════════════════════════════════════════════════════════════════
#  ÜBER DIESES HEFT / IMPRESSUM
# ═════════════════════════════════════════════════════════════════════════════
def about_pages(pn):
    B=[b_titel("Über dieses Forscherheft")]
    B.append(b_para("Dieses Heft nimmt Kinder als kleine Forscherinnen und Forscher ernst. Statt fertige Antworten "
        "zu lesen, stellen sie zu jedem Thema zuerst eine eigene Vermutung auf, prüfen sie im Experiment oder in "
        "der Simulation und formulieren die Erkenntnis anschließend selbst. Denn wirklich verstanden ist, was man "
        "selbst herausgefunden hat.",breite=LESE,abstand=fd.ABS_ABSCHNITT,name="Vorwort"))
    B.append(b_unterkopf("Was bedeutet FELO?"))
    for bu,wo in (("F","Forschen"),("E","Eigeninitiative"),("L","Lernen"),("O","Organisieren")):
        def b_buchstabe(h,d,y,bu=bu,wo=wo):
            h.circ(fd.X0+15,y+fd.LH*0.5,15,fill=fd.STIL["akzent"])
            fd.T(h,fd.X0+15,y+fd.LH*0.5+1,bu,fd.schrift("bold",fd.FLIESS),
                 fd.STIL["akzent_schrift"],anchor="mm")
            fd.T(h,fd.X0+44,y,wo,fd.schrift("bold",fd.FLIESS),fd.STIL["text"])
            return y+fd.LH
        B.append(bst("FELO "+bu,b_buchstabe,abstand=8))
    B.append(b_para("Die Schülerinnen und Schüler stellen Vermutungen auf, untersuchen physikalische "
        "Zusammenhänge, dokumentieren ihre Ergebnisse und sichern ihre Erkenntnisse selbstständig.",
        breite=LESE,abstand=fd.ABS_ABSCHNITT,name="FELO-Text"))
    B.append(b_unterkopf("Der didaktische Ansatz"))
    pillars=[
     ("Forschend lernen","Jede Seite folgt demselben Weg: Problem · Frage · Vermutung · Forschen · Sichern · Anwenden. So wächst Verstehen aus eigenem Tun."),
     ("Nah am Kind","Alltagssituationen und Schülersprache; die hervorgehobene Forscherfrage könnten die Kinder selbst gestellt haben."),
     ("Vorstellungen ernst nehmen","Typische Fehlvorstellungen werden bewusst aufgegriffen und behutsam richtiggestellt."),
     ("Analog trifft digital","Über die QR-Codes öffnet sich zu jedem Thema die passende Simulation. Ohne Internet oder Gerät bleibt jede Seite nutzbar: Im Anhang stehen die erwarteten Werte – als Werte aus der Simulation gekennzeichnet und ohne Lösung, damit weitergearbeitet werden kann."),
    ]
    for i,(t,desc) in enumerate(pillars):
        def b_saeule(h,d,y,i=i,t=t,desc=desc):
            h.circ(fd.X0+15,y+fd.LH*0.5,15,fill=fd.STIL["akzent"])
            fd.T(h,fd.X0+15,y+fd.LH*0.5+1,str(i+1),fd.schrift("bold",fd.KLEIN),
                 fd.STIL["akzent_schrift"],anchor="mm")
            fd.T(h,fd.X0+44,y,t,fd.schrift("bold",fd.FLIESS),fd.STIL["text"])
            return fd.para(h,fd.X0+44,y+fd.LH,desc,fd.schrift("reg",fd.FLIESS),
                           fd.STIL["text"],LESE-44,fd.LH)
        B.append(bst("Säule %d"%(i+1),b_saeule,fd.ABS_AUFGABE))
    B[-1].abstand=fd.ABS_ABSCHNITT
    B.append(b_unterkopf("Kompetenzbereiche des Kernlehrplans"))
    kb=[("UF","Umgang mit Fachwissen","UF1 wiedergeben · UF2 unterscheiden · UF3 ordnen · UF4 vernetzen"),
        ("E","Erkenntnisgewinnung","E1–E9: fragen, vermuten, planen, durchführen, auswerten, Modelle nutzen"),
        ("K","Kommunikation","K1–K9: Texte und Tabellen erstellen, dokumentieren, präsentieren"),
        ("B","Bewertung","B1–B3: Kriterien angeben, Position beziehen, Werte berücksichtigen")]
    for ku,na,er in kb:
        def b_komp(h,d,y,ku=ku,na=na,er=er):
            fd.kompchip(h,fd.X0+80,y-2,ku,None,fd.STIL)
            fd.T(h,fd.X0+96,y,na,fd.schrift("bold",fd.FLIESS),fd.STIL["text"])
            return fd.para(h,fd.X0+96,y+fd.LH,er,fd.schrift("reg",fd.FLIESS),
                           fd.STIL["text"],LESE-96,fd.LH)
        B.append(bst("Kompetenzbereich "+ku,b_komp,fd.ABS_ZEILE))
    B.append(b_para("Der Code steht rechts in der Kopfzeile jeder Aufgabe. Wortlaut nach: Kernlehrplan "
        "Physik, Realschule NRW (Heft 3307).",art="med",breite=LESE,
        abstand=fd.ABS_ABSCHNITT,name="Quelle Kernlehrplan"))
    B.append(b_unterkopf("Anforderungsbereiche"))
    ab=[("I","Reproduzieren","Bekanntes wiedergeben und ein geübtes Verfahren anwenden"),
        ("II","Zusammenhänge herstellen","Gelerntes auf einen neuen Fall übertragen, erklären, berechnen"),
        ("III","Verallgemeinern und reflektieren","selbst planen, begründet beurteilen und Stellung nehmen")]
    for st,na,er in ab:
        def b_afb(h,d,y,st=st,na=na,er=er):
            fd.kompchip(h,fd.X0+80,y-2,st,None,fd.STIL)
            fd.T(h,fd.X0+96,y,na,fd.schrift("bold",fd.FLIESS),fd.STIL["text"])
            return fd.para(h,fd.X0+96,y+fd.LH,er,fd.schrift("reg",fd.FLIESS),
                           fd.STIL["text"],LESE-96,fd.LH)
        B.append(bst("Anforderungsbereich "+st,b_afb,fd.ABS_ZEILE))
    B.append(b_para("Er steht neben dem Kompetenzcode. Die drei Stufen folgen den Bildungsstandards; "
        "der Kernlehrplan Physik der Realschule kennt sie nicht.",art="med",
        breite=LESE,abstand=fd.ABS_ABSCHNITT,name="Quelle Anforderungsbereiche"))
    # "mit Wortschatz-Raetseln" stand hier, solange Wortgitter und Kreuzwort
    # gesetzt wurden. Sie entfallen; die Wortliste traegt weiter die Test-
    # Vorbereitung. Der Satz wuerde sonst etwas behaupten, was nicht im Heft steht.
    B.append(b_para("Orientiert an zentralen Themen und Kompetenzen des Physikunterrichts in der Sekundarstufe I – "
        "mit Wortschatz, Test-Vorbereitung und einem Test zu jedem Kapitel. Alle Texte, Aufgaben und "
        "Zeichnungen sind eigenständig erstellt.",breite=LESE,
        abstand=fd.ABS_ABSCHNITT,name="Einordnung"))
    B.append(b_unterkopf("Impressum"))
    imp=[("Autor & Konzept","Abdullah Lala"),("Texte & Illustrationen","Abdullah Lala"),
         ("Herausgeber","Eigenverlag Abdullah Lala"),("Auflage","1. Auflage 2026"),
         ("Fassung","1.1 · Stand 28. August 2026"),
         ("Kontakt (E-Mail)","abdullah-lala@hotmail.de")]
    for lbl,val in imp:
        def b_imp(h,d,y,lbl=lbl,val=val):
            fd.T(h,fd.X0,y,lbl,fd.schrift("med",fd.FLIESS),fd.STIL["akzent"])
            fd.T(h,fd.X0+330,y,val,fd.schrift("reg",fd.FLIESS),fd.STIL["text"])
            return y+fd.LH
        B.append(bst("Impressum "+lbl,b_imp,abstand=6))
    B[-1].abstand=fd.ABS_AUFGABE
    B.append(b_para("© 2026 Abdullah Lala. Alle Rechte vorbehalten.",art="med",
                    breite=LESE,name="Copyright"))
    B.append(b_para("Das Werk und seine Teile sind urheberrechtlich geschützt. Jede Verwertung außerhalb der engen "
        "Grenzen des Urheberrechts ist ohne schriftliche Zustimmung des Autors unzulässig.",
        grad=fd.KLEIN,lh=fd.LH_KLEIN,breite=LESE,name="Rechte"))
    return setze_einheit(B,BANDNAME,"Über dieses Forscherheft",pn,"Über dieses Heft")


# ═════════════════════════════════════════════════════════════════════════════
#  BASISKONZEPTE IM ÜBERBLICK
# ═════════════════════════════════════════════════════════════════════════════
def basiskonzept_seiten(pn):
    """Uebersicht: welches Thema traegt welches Basiskonzept, Kapitel fuer Kapitel."""
    B=[b_titel("Basiskonzepte im Überblick",unterzeile="für Eltern und Lehrkräfte")]
    B.append(b_para("Der Kernlehrplan ordnet jedem Inhaltsfeld vier Basiskonzepte zu. Die Tabelle zeigt, "
        "welche Seite dieses Hefts welches Konzept trägt – und wo ein Konzept im Heft noch dünn ist.",
        art="med",breite=LESE,abstand=fd.ABS_ABSCHNITT,name="Vorspann"))
    for ch in CHAPTERS:
        _fd=lehrplan.feld(ch["id"])
        if not _fd: continue
        _nr,_nm,_bk=_fd
        B.append(b_unterkopf(ch["title"]))
        B.append(b_para("Inhaltsfeld %d · %s"%(_nr,_nm),art="med",farbe=fd.STIL["akzent"],
                        breite=LESE,name="Inhaltsfeld",haftet=1))
        zeilen=[]
        for konz,stich in _bk.items():
            nummern=[str(i+1) for i,tid in enumerate(ch["topics"])
                     if FSD.get(tid,{}).get("basiskonzept")==konz]
            # "Forscherkreis", nicht "Seiten": `nummern` sind die Positionen der
            # Einheiten im Kapitel (i+1), nicht Blattzahlen. Gedruckt stand hier
            # "Seiten 1, 2, 3" - wer Seite 1 aufschlug, fand das Deckblatt. Die
            # Zahl ist dieselbe, die in der Kopfzeile jeder Forscherseite steht.
            zeilen.append([konz,stich,("Forscherkreis "+", ".join(nummern)) if nummern
                           else "in diesem Kapitel nicht"])
        B.append(bst("Konzepttabelle "+ch["id"],
                     lambda h,d,y,z=zeilen: fd.tabelle(h,d,y,fd.STIL,
                         ["Basiskonzept","Stichworte des Kernlehrplans","im Kapitel"],
                         # 0,25 statt 0,22 wie im Musterband: "Wechselwirkung" ist
                         # 171 Einheiten breit und laesst sich als EIN Wort nicht
                         # umbrechen - bei 0,22 bleiben 150,6 und es lief in die
                         # Spaltenlinie. Gemessen, nicht geschaetzt.
                         z,[0.25,0.50,0.25]),
                     fd.ABS_ABSCHNITT))
    B.append(b_para("Die Zuordnung eines Themas zu einem Basiskonzept trifft der Verlag anhand der Stichworte "
        "des Kernlehrplans; sie ist nicht amtlich festgelegt.",art="med",grad=fd.KLEIN,
        lh=fd.LH_KLEIN,breite=LESE,name="Fussnote"))
    return setze_einheit(B,BANDNAME,"Basiskonzepte im Überblick",pn,"Basiskonzepte")


# ═════════════════════════════════════════════════════════════════════════════
#  MESSWERTE OHNE GERÄT  (bleibt im Schuelerband!)
# ═════════════════════════════════════════════════════════════════════════════
def messwerte_pages(start_pn,fuss=None):
    """Messwerte fuer den Offline-Betrieb: nur die erwartete Beobachtung, sonst nichts.
    Ohne Geraet kann eine Klasse damit die Tabelle auf der Forscherseite fuellen und
    danach selbst weiterarbeiten - Erklaerung, Sicherung und die Loesung der Aufgabe
    stehen hier absichtlich NICHT. Die stehen im Lehrerband.

    Der Anhang gehoert in den SCHUELERBAND: die Forscherseiten verweisen woertlich
    auf ihn ("Ohne Geraet: Messwerte im Anhang")."""
    # EINE durchlaufende Einheit, nicht sechs. Kapitelweise gesetzt trug die
    # letzte Seite eines Kapitels oft einen einzigen Eintrag - ein Anhang darf
    # durchlaufen, die Kapitel bekommen eine Zwischenueberschrift.
    B=[b_titel("Messwerte ohne Gerät")]
    B.append(b_para("Diese Werte erzeugt die Simulation – berechnete Modellwerte, keine Messung im Labor.",
                    art="med",breite=LESE,name="Herkunft",haftet=1))
    B.append(b_para("Wenn kein Gerät da ist, trage sie in die Tabelle auf der Forscherseite ein und arbeite "
        "dann normal weiter. Erklärung und Sicherung stehen hier bewusst nicht – die sollst du selbst "
        "aufschreiben.",breite=LESE,abstand=fd.ABS_ABSCHNITT,name="Gebrauch"))
    kapitelkopf={}                       # Baustein-Nummer -> Kapitelnummer
    for ci,ch in enumerate(CHAPTERS):
        # Nur Seiten mit Simulation: Der Anhang heisst "Werte aus der Simulation".
        # s6 wird am Tisch geloest und hat deshalb keinen Eintrag.
        themen=[(i,t) for i,t in enumerate(ch["topics"]) if FSD[t].get("beobachtung") and sim_url(t)]
        if not themen: continue
        kapitelkopf[len(B)]=ci
        B.append(b_unterkopf("Kapitel %d · %s"%(ci+1,ch["title"])))
        for i,tid in themen:
            o=FSD[tid]
            def b_kopf(h,d,y,i=i,o=o):
                h.circ(fd.X0+15,y+fd.LH*0.5,15,fill=fd.STIL["akzent"])
                fd.T(h,fd.X0+15,y+fd.LH*0.5+1,str(i+1),fd.schrift("bold",fd.KLEIN),
                     fd.STIL["akzent_schrift"],anchor="mm")
                fd.T(h,fd.X0+44,y,o.get("titel") or o["name"],
                     fd.schrift("bold",fd.KASTEN_KOPF),fd.STIL["h1"])
                return y+LH_KOPF
            B.append(bst("Messwertkopf "+tid,b_kopf,abstand=6,haftet=1))
            B.append(b_para(o["beobachtung"],x=fd.X0+44,breite=LESE-44,
                            abstand=fd.ABS_AUFGABE,name="Beobachtung "+tid))
        B[-1].abstand=fd.ABS_ABSCHNITT
    hoehen=fd.messe_bausteine(B,fd.STIL)
    umbruch=fd.umbrechen(B,hoehen)
    # Auf welcher Seite faengt welches Kapitel an? Aus dem Umbruch ABGELESEN -
    # die Lesezeichen des E-Books haengen daran.
    starts=[start_pn]*len(CHAPTERS)
    for si,eintraege in enumerate(umbruch):
        for i,_y in eintraege:
            if i in kapitelkopf: starts[kapitelkopf[i]]=start_pn+si
    seiten=setze_einheit(B,"Messwerte ohne Gerät","Messwerte ohne Gerät",start_pn,"Messwerte",
                         fuss=fuss)
    return seiten,start_pn+len(seiten),starts


# ═════════════════════════════════════════════════════════════════════════════
#  RÄTSEL - stehen weiter hier, werden aber NICHT MEHR GESETZT
#
#  Entscheidung des Auftraggebers: Wortgitter und Kreuzwortraetsel entfallen
#  (hier 12 Seiten). Die Funktionen und assessment.json bleiben unangetastet,
#  damit die Woerter weiter die Test-Vorbereitung tragen und die Seiten jederzeit
#  wieder gesetzt werden koennen. Sie stehen im ALTEN Satz - wer sie
#  zurueckholt, muss sie vorher auf felo_design umstellen.
# ═════════════════════════════════════════════════════════════════════════════
def footer(h,pn,acc):
    h.circ(ML+8,H-40,13,outline=GOLD,w=2); h.circ(ML+8,H-40,4,fill=GOLD)
    h.T(ML+34,H-48,"PHYSIK · KLASSE 5/6 · FORSCHERHEFT",COP(9),GOLD_D)
    h.R(W-ML-56,H-64,W-ML,H-22,8,fill=acc); h.T(W-ML-28,H-42,f"{pn:02d}",AVB(14),CREAM,anchor="mm")


def ch_wortgitter(words,name,pn,acc):
    im,d=newp(CREAM); h=hp(im,d)
    pagehead(h,f"RÄTSEL · {name.upper()}","Finde die Wörter",GOLD_D,36)
    h.para(ML,196,"Alle Wörter sind versteckt: waagerecht, senkrecht oder schräg. Kreise jedes Wort ein und hake es in der Liste ab.",AV(15),INK,W-2*ML,26)
    n=15; grid,placed=make_gitter(words,size=n)
    cell=64; gw=n*cell; gx=(W-gw)/2; gy=250
    h.R(gx-10,gy-10,gx+gw+10,gy+gw+10,12,fill=WHITE,outline=GLINE,w=1.4)
    for r in range(n):
        for c in range(n): h.T(gx+c*cell+cell/2,gy+r*cell+cell/2,grid[r][c],AVM(22),INK,anchor="mm")
    ly=gy+gw+40; h.tracked(W/2,ly,f"DIESE {len(words)} WÖRTER SUCHST DU",COP(12),GOLD_D,3); ly+=32
    per=4; colw=(W-2*ML)/per
    for i,w in enumerate(words):
        r2,c2=divmod(i,per); ox=ML+c2*colw+24; oy=ly+r2*48
        h.R(ox,oy,ox+23,oy+23,5,outline=(150,160,175),w=2); h.T(ox+33,oy+1,w,AVM(15),INK)
    footer(h,pn,acc)
    return fertig(im)


def ch_kreuzwort(entries,name,pn,acc):
    im,d=newp(CREAM); h=hp(im,d)
    pagehead(h,f"RÄTSEL · {name.upper()}","Kreuzworträtsel",GOLD_D,36)
    h.para(ML,196,"Trage die passenden Wörter ein. Die Zahlen zeigen, wo ein Wort beginnt. Die Tipps stehen unter dem Gitter.",AV(15),INK,W-2*ML,26)
    grid,placed,nr,nc=make_crossword(entries)
    ordered=sorted({(r,c) for (w,cl,r,c,dr) in placed},key=lambda rc:(rc[0],rc[1]))
    num={rc:i+1 for i,rc in enumerate(ordered)}
    across=sorted((num[(r,c)],w,cl) for (w,cl,r,c,dr) in placed if dr=='H')
    down=sorted((num[(r,c)],w,cl) for (w,cl,r,c,dr) in placed if dr=='V')
    cell=min(60,int((W-2*ML-40)/nc)); gw=nc*cell; gh=nr*cell; gx=(W-gw)/2; gy=252
    for (r,c),ch in grid.items():
        cxp=gx+c*cell; cyp=gy+r*cell
        h.R(cxp,cyp,cxp+cell,cyp+cell,3,fill=WHITE,outline=(150,160,175),w=1.4)
        if (r,c) in num: h.T(cxp+4,cyp+2,str(num[(r,c)]),AVB(11),GOLD_D)
    cy0=gy+gh+44; colx=[ML,W/2+16]; cw=W/2-ML-20
    def cl(ci,title,items,yy):
        h.tracked(colx[ci],yy,title,COP(13),GOLD_D,3,center=False); yy+=30
        for n2,w,c2 in items:
            h.T(colx[ci],yy,f"{n2}.",AVB(13.5),INK); yy=h.para(colx[ci]+30,yy,c2,AV(13.5),INK,cw-30,21)+11
        return yy
    cl(0,"WAAGERECHT",across,cy0); cl(1,"SENKRECHT",down,cy0)
    footer(h,pn,acc)
    return fertig(im)


# ═════════════════════════════════════════════════════════════════════════════
#  LEHRERBAND  (eigenes PDF)
#
#  Seit dem 14.09.2026 im HAUSSTIL des Bandes, nach dem Vorbild der Foerderreihe
#  (arbeitsheft_foe9/build_pilot.py::seite_l und lehrer_bloecke). Vorher war es
#  ein eigener Satz auf cremefarbenem Grund: je Einheit vier Bloecke Fliesstext
#  (VERMUTUNG · BEOBACHTUNG · ERKLAERUNG · SICHERUNG), die Uebungsloesungen in
#  zweispaltigen Listen ein paar Seiten weiter, und die Vermutung nur im
#  WORTLAUT - ohne die Nummer, die auf der Schuelerseite am Kaestchen steht.
#
#  Abdullah, 13.09.2026: "Man will sich die Vermutungen anschauen und die
#  Aufgaben, dann will man direkt die lösung zuordnen und gucken ob alles passt.
#  Im unterricht hat man nicht immer zeit und schüler fragen sofort nach den
#  lösungen."
#
#  Vier Dinge folgen daraus:
#
#   1. EINE Einheit, EIN Lehrerteil. Forscherseite und Uebungsseite stehen
#      zusammen. Vorher lagen sie in getrennten Kapitelbloecken - wer die
#      Uebungsloesung zu ki1 suchte, blaetterte an 16 Forscherseiten vorbei.
#   2. Ganz oben "Auf einen Blick": nur die Nummern und Woerter. Richtig ist
#      Vermutung 2, die vier Lueckenwoerter, die R/F-Folge, die MC-Nummer.
#      Das ist der Fall "Schueler fragt sofort nach der Loesung".
#   3. Die Vermutung wird NUMMERIERT und alle drei werden gezeigt - mit einem
#      Satz, warum die beiden anderen nicht tragen. Auf der Schuelerseite stehen
#      drei Kaestchen; ein blosser Wortlaut zwingt zum Zeilenvergleich.
#   4. Jede Aufgabe steht mit ihrem WORTLAUT ueber ihrer Loesung. Vorher musste
#      man das Schuelerheft danebenlegen, um zu wissen, wonach gefragt war.
#
#  Gesetzt wird mit denselben Bausteinen wie die Schuelerseiten (felo_design,
#  12 pt), umbrochen wird ZEILENWEISE (b_zeilen) - ein Erwartungshorizont ist
#  hier hoeher als eine Seite, und ein unteilbarer Baustein laeuft unter der
#  Blattkante heraus. Genau das steht zweimal in CLAUDE.md.
# ═════════════════════════════════════════════════════════════════════════════

# Auf welcher Heftseite steht die Einheit? Waehrend des Schuelersatzes gefuellt
# (main), vom Lehrerband gelesen - build_lehrerband laeuft am Ende von main.
# Eine leere Angabe ist kein Fehler: dann entfaellt der Seitenverweis.
HEFTSEITE={}


# Eine Rechenaufgabe hat eine Loesung, eine offene Aufgabe einen
# Erwartungshorizont. Entschieden wird am Operator - das ist dieselbe
# Unterscheidung, die der Hausstil auf den Schuelerseiten trifft.
_RECHNET=("Berechne","Bestimme","Rechne","Miss","Trage")


def _loesungswort(frage):
    # Der Operator steht NICHT immer am Anfang: Die Alltagsaufgaben stellen oft
    # erst die Lage dar und fragen im zweiten Satz ("In einer Lauf-App ist ...
    # Bestimme ihre Geschwindigkeit"). Gesucht wird deshalb im ganzen Text.
    import re as _r
    return "Lösung: " if _r.search(r"(?<![A-Za-zÄÖÜäöüß])(%s)(?![a-zäöüß])"
                                   % "|".join(_RECHNET), frage) \
        else "Erwartungshorizont: "


def _wortform(w):
    """Ein Wort aus der Raetselliste in normale Schreibweise bringen.

    Die Listen sind durchgehend versal. `capitalize()` scheitert an Wortformen
    mit Binnenzeichen ("WEG-ZEIT-DIAGRAMM" wuerde "Weg-zeit-diagramm"), deshalb
    wird an Bindestrichen geteilt."""
    return "-".join(t[:1]+t[1:].lower() for t in w.split("-"))


def _komptext(code):
    """Klartext eines Kompetenzcodes, leer wenn die Tafel ihn nicht kennt."""
    t = getattr(kompetenzen, "KOMPETENZ", {}) if "kompetenzen" in globals() else {}
    return t.get(code, "")


def _rf(stimmt):
    return "richtig" if stimmt else "falsch"


def _luecke_satz(s):
    """Lueckensatz mit eingesetzter Loesung - das Loesungswort in Anfuehrung."""
    post=s.get("post","")
    return s["pre"]+" „"+s["loesung"]+"“"+("" if post.startswith(("."," ","!","?",",",";")) else " ")+post


def _kompetenzen(o,ub):
    """Kompetenzcodes dieser Einheit, Forscherseite und Uebungsseite zusammen."""
    codes=[]
    for c in ([(o.get("aufgabe") or {}).get("komp"), o.get("alltagKomp")]
              + list((ub or {}).get("komp") or [])):
        if c and c not in codes: codes.append(c)
    return codes


def _merk_voll(m):
    """Merksatz mit gefuellter Luecke - MIT dem fehlenden Leerzeichen.

    Die Fortsetzung hinter der Luecke wurde ohne Trennung angehaengt: Aus
    "heisst ___" + "Beschleunigung" + "und wird in m/s2 angegeben." wurde
    "heisst Beschleunigungund wird in m/s2 angegeben." Gemessen am 16.09.2026:
    **283 von 950 Luecken** in 15 Baenden trifft das - immer dort, wo die
    Fortsetzung mit einem Buchstaben beginnt. Beginnt sie mit einem Satzzeichen
    ("; die Formel ist gemessen"), darf KEIN Leerzeichen davor - deshalb die
    Unterscheidung und nicht ein blindes Zusammenfuegen.
    """
    post = m.get("post") or ""
    if post and post[0] not in ".,;:!?)»“":
        post = " " + post
    return m["pre"] + " " + m["loesung"] + post


def lehrer_bloecke(tid):
    """Die Bloecke eines Lehrerteils, in der Reihenfolge des Unterrichts.

    Gibt (Titel, [Punkte]) zurueck - genau die Form, die seite_l der
    Foerderreihe erwartet. Fehlt ein Feld, entfaellt sein Block; kein Block
    wird mit leerem Inhalt gesetzt."""
    o=FSD[tid]; ub=UEBD.get(tid) or {}
    auf=o.get("aufgabe") or {}
    ms=o.get("merksatz") or []
    ok=o.get("predictOk",0)
    L=[]

    # ── Auf einen Blick: nur Nummern und Woerter ─────────────────────────
    kurz=["Vermutung (Abschnitt 2): richtig ist Nummer **%d** von %d."%(ok+1,len(o.get("predict") or [1]))]
    if ms:
        kurz.append("Merksatz (Abschnitt 6): "+"  ·  ".join(
            "Lücke %d: **%s**"%(i+1,m["loesung"]) for i,m in enumerate(ms)))
    if ub.get("lueckensaetze"):
        kurz.append("Übung, Lückensätze: "+"  ·  ".join(
            "%d **%s**"%(i+1,s["loesung"]) for i,s in enumerate(ub["lueckensaetze"])))
    if ub.get("richtigfalsch"):
        kurz.append("Übung, richtig oder falsch: "+"  ·  ".join(
            "%d **%s**"%(i+1,_rf(s["stimmt"])) for i,s in enumerate(ub["richtigfalsch"])))
    if ub.get("mc"):
        kurz.append("Übung, Auswahlaufgabe: richtig ist Antwort **%d**."%(ub["mc"]["richtig"]+1))
    L.append(("Auf einen Blick",kurz))

    # ── ② Vermutung: alle drei, mit Verdikt und Grund ────────────────────
    if o.get("predict"):
        warum=o.get("predictWarum") or []
        v=[]
        for i,p in enumerate(o["predict"]):
            t="Vermutung %d – %s.  „%s“"%(i+1,"richtig" if i==ok else "falsch",p)
            g=warum[i] if i<len(warum) else ""
            v.append(t+("  "+g if g else ""))
        L.append(("Abschnitt 2 · Meine Vermutung – welche trägt, und warum",v))

    # ── ③/④ Was am Bildschirm steht ──────────────────────────────────────
    if o.get("beobachtung"):
        # Fuenf Einheiten haben keine Simulation, sondern ein gedrucktes
        # Datenblatt. "Was am Bildschirm steht" waere dort schlicht falsch.
        _wo="im Datenblatt" if o.get("daten") else "am Bildschirm"
        L.append(("Abschnitt 4 · Meine Beobachtung – was %s steht"%_wo,
                  [o["beobachtung"]]))

    # ── ⑥ Merksatz vollstaendig ──────────────────────────────────────────
    if ms:
        L.append(("Abschnitt 6 · Merksatz – vollständig",
                  [" ".join(_merk_voll(m) for m in ms)]))

    # ── ⑦ Aufgabe: Wortlaut ueber der Loesung ────────────────────────────
    if auf.get("frage"):
        L.append(("Abschnitt 7 · Aufgabe",
                  ["Gefragt ist: "+auf["frage"]]
                  +(["Lösung: "+auf["loesung"]] if auf.get("loesung") else [])))

    # ── Alltag & Anwendung ───────────────────────────────────────────────
    if o.get("alltag"):
        L.append(("Alltag & Anwendung",
                  ["Gefragt ist: "+o["alltag"]]
                  +([_loesungswort(o["alltag"])+o["alltagLoesung"]]
                    if o.get("alltagLoesung") else [])))

    if o.get("modellgrenze"):
        L.append(("Grenze des Modells",[o["modellgrenze"]]))

    # ── Uebungsseite ─────────────────────────────────────────────────────
    if ub.get("lueckensaetze"):
        L.append(("Übungsseite · Lückensätze",
                  ["%d  %s"%(i+1,_luecke_satz(s)) for i,s in enumerate(ub["lueckensaetze"])]))
    if ub.get("richtigfalsch"):
        L.append(("Übungsseite · Richtig oder falsch",
                  ["%d  %s  –  %s"%(i+1,_rf(s["stimmt"]),s["aussage"])
                   for i,s in enumerate(ub["richtigfalsch"])]))
    mc=ub.get("mc")
    if mc:
        p=["Richtig ist Antwort %d: „%s“"%(mc["richtig"]+1,mc["optionen"][mc["richtig"]])]
        if mc.get("erklaerung"): p.append(mc["erklaerung"])
        L.append(("Übungsseite · Auswahlaufgabe",p))
    off=ub.get("offen") or {}
    if off.get("loesung"):
        p=[]
        if off.get("frage"): p.append("Gefragt ist: "+off["frage"])
        p.append("Erwartungshorizont: "+off["loesung"])
        L.append(("Übungsseite · Denk nach",p))

    codes=_kompetenzen(o,ub)
    if codes:
        # Tolerant: Kennt die Tafel den Code nicht, steht nur der Code da. Die
        # Reihen benutzen DREI Tafeln mit denselben Buchstaben (Realschule und
        # Gesamtschule UF/E/K/B, Gymnasium mit eigenem B4, Oberstufe S/E/K/B) -
        # ein KeyError waere hier der falsche Weg, ihn zu melden. Dafuer ist die
        # Kompetenzprobe im Bau da.
        L.append(("Kompetenzen dieser Einheit",
                  [(("%s – %s"%(c,_komptext(c))) if _komptext(c) else c) for c in codes]))
    return L


def lehrerseite(tid,nr,pn):
    """Lehrerteil EINER Einheit. Gibt eine LISTE von Seiten zurueck."""
    o=FSD[tid]
    titel=o.get("titel") or o["name"]
    unter="Lösungen und Erwartungshorizont"
    if HEFTSEITE.get(tid):
        unter+=" · Forscherheft ab Seite %d"%HEFTSEITE[tid]
    B=[b_titel("%d  %s"%(nr,titel),unterzeile=unter)]
    for bt,punkte in lehrer_bloecke(tid):
        B.append(b_unterkopf(bt))
        for p in punkte:
            B+=b_zeilen(p,punkt=True,name="Punkt")
        B[-1].abstand=fd.ABS_AUFGABE
    B[-1].abstand=fd.ABS_ZEILE
    # ausgleich=True: Ohne ihn fuellt der Umbruch gierig und die LETZTE Seite
    # einer Einheit traegt den Rest - gemessen 8 bis 33 Prozent auf zehn von 28
    # Einheiten. Dieselbe Seitenzahl, aber gleichmaessig verteilt.
    return setze_einheit(B,"Lehrerteil · nur für Lehrkräfte",titel,pn,
                         "Lehrerteil "+tid,ausgleich=True,fuss=FUSS_LB)


def lehrer_kapitelbloecke(ch,ci):
    """Was nicht zu einer einzelnen Einheit gehoert: Test, Weiterdenken, Vorbereitung."""
    a=ASMT[ch["id"]]; t=a["test"]
    L=[]
    # lehrplan.zeile() liefert Versalien fuer die Trennseite ("INHALTSFELD 1 ·
    # GRUNDLAGEN DER MECHANIK"). Im Fliesstext des Lehrerteils gehoert die
    # normale Schreibweise hin - die Versalprobe meldete sie sonst zu Recht.
    _f=lehrplan.feld(ch["id"]) if hasattr(lehrplan,"feld") else None
    if _f:
        _nr,_nm,_bk=_f
        L.append(("Kernlehrplan",
                  ["Inhaltsfeld %d · %s"%(_nr,_nm)]
                  +["%s: %s"%(_k,_v) for _k,_v in _bk.items()]))
    kurz=["Kapiteltest, Lückensätze: "+"  ·  ".join(
        "%d %s"%(i+1,s["loesung"]) for i,s in enumerate(t["a1"]))]
    kurz.append("Kapiteltest, richtig oder falsch: "+"  ·  ".join(
        "%d %s"%(i+1,_rf(s["stimmt"])) for i,s in enumerate(t["a2"])))
    kurz.append("Kapiteltest, Auswahlaufgabe: richtig ist Antwort %d."%(t["mc"]["richtig"]+1))
    L.append(("Auf einen Blick",kurz))

    L.append(("Kapiteltest · Aufgabe 1 – Lückensätze",
              ["%d  %s"%(i+1,_luecke_satz(s)) for i,s in enumerate(t["a1"])]))
    L.append(("Kapiteltest · Aufgabe 2 – Richtig oder falsch",
              ["%d  %s  –  %s"%(i+1,_rf(s["stimmt"]),s["aussage"])
               for i,s in enumerate(t["a2"])]))
    _mc=t["mc"]
    L.append(("Kapiteltest · Aufgabe 3 – Auswahlaufgabe",
              ["Richtig ist Antwort %d: „%s“"%(_mc["richtig"]+1,_mc["optionen"][_mc["richtig"]])]))
    for _nr,_k in (("Aufgabe 4","offen"),("Aufgabe 5","transfer")):
        _x=t.get(_k) or {}
        if _x.get("loesung"):
            L.append(("Kapiteltest · %s"%_nr,
                      (["Gefragt ist: "+_x["frage"]] if _x.get("frage") else [])
                      +["Erwartungshorizont: "+_x["loesung"]]))

    if TRANSFER.get(ch["id"]):
        p=["Diese Aufgaben haben nicht die eine richtige Antwort. Gewertet wird, "
           "ob die Begründung trägt und beide Seiten vorkommen."]
        for i,tr in enumerate(TRANSFER[ch["id"]]):
            if tr.get("prompt"): p.append("%s)  Gefragt ist: %s"%(chr(65+i),tr["prompt"]))
            p.append("%s)  [%s · Anforderungsbereich %s]  %s"
                     %(chr(65+i),tr.get("komp","—"),tr.get("afb","III"),tr["erwartung"]))
        L.append(("Weiterdenken · Erwartungshorizont",p))

    if a.get("prep",{}).get("mini"):
        L.append(("Test-Vorbereitung · Prüfe dich selbst",
                  ["%d  %s"%(i+1,m["loesung"]) for i,m in enumerate(a["prep"]["mini"])]))
    if a.get("clues",{}).get("hinweise"):
        # Die Woerter liegen in GROSSBUCHSTABEN vor - Rest aus der Zeit, als
        # sie ein Kreuzwortraetsel fuellten (seit 09.09.2026 abgeschafft).
        # Gedruckt wird die normale Schreibweise; sonst stehen hier 30 Versal-
        # woerter im Fliesstext.
        L.append(("Wortschatz des Kapitels",
                  [", ".join(_wortform(x["wort"]) for x in a["clues"]["hinweise"])]))
    return L


def lehrerseite_kapitel(ch,ci,pn):
    B=[b_titel("Kapitel %d · %s"%(ci+1,ch["title"]),
               unterzeile="Kapiteltest, Weiterdenken und Test-Vorbereitung")]
    for bt,punkte in lehrer_kapitelbloecke(ch,ci):
        B.append(b_unterkopf(bt))
        for p in punkte:
            B+=b_zeilen(p,punkt=True,name="Punkt")
        B[-1].abstand=fd.ABS_AUFGABE
    B[-1].abstand=fd.ABS_ZEILE
    return setze_einheit(B,"Lehrerteil · nur für Lehrkräfte",
                         "Kapitel %d"%(ci+1),pn,"Lehrerteil Kapitel %d"%(ci+1),
                         ausgleich=True,fuss=FUSS_LB)


LB_INHALT=["Lösungen und Erwartungshorizonte zu allen Forscherseiten",
           "Lösungen der Übungsseiten – bei ihrer Einheit, nicht am Kapitelende",
           "„Auf einen Blick“ über jeder Einheit: nur die Nummern und Wörter",
           "Kapiteltests, Weiterdenken-Aufgaben und Test-Vorbereitung",
           "Kernlehrplan-Bezug und Kompetenzcodes je Einheit"]


def lb_cover():
    """Deckblatt des Lehrerbands - im Hausstil, wie die Foerderreihe."""
    im,d=newp(fd.GRUND); h=hp(im,d)
    y=fd.OBEN
    fd.T(h,fd.X0,y,"Lehrerband",fd.schrift("med",fd.ZWISCHEN),fd.STIL["akzent"])
    y+=LH_ZWISCH+18
    fd.T(h,fd.X0,y,"FELO",fd.schrift("bold",DISPLAY_GROSS),fd.STIL["h1"])
    y+=round(fd.einheiten(DISPLAY_GROSS)*fd.ZAB,2)+10
    h.ln([(fd.X0,y),(fd.X1,y)],fd.STIL["akzent"],1.6)
    y+=24
    # Titel und Schulform kommen aus BANDNAME - das haben ALLE 19 Baende, KL und
    # SFORM nur vierzehn von ihnen (die fuenf Realschulbaende tragen den Namen
    # als festen String). "FELO Physik 9 · Realschule NRW" wird zu
    # "Physik 9 · Forscherheft" und "Realschule NRW".
    _t=BANDNAME.replace("FELO ","").split(" · ")
    fd.T(h,fd.X0,y,_t[0]+" · Forscherheft",fd.schrift("bold",fd.HAUPT),fd.STIL["h1"])
    y+=LH_HAUPT+8
    fd.T(h,fd.X0,y,_t[-1] if len(_t)>1 else "",fd.schrift("med",fd.ZWISCHEN),fd.STIL["akzent"])
    y+=LH_ZWISCH+40
    for t in LB_INHALT:
        fd.raute(d,fd.X0+7,y+fd.LH*0.45,6,fd.STIL["akzent"])
        y=fd.para(h,fd.X0+28,y,t,fd.schrift("med",fd.FLIESS),fd.STIL["text"],LESE-28,fd.LH)+10
    y+=20
    fd.para(h,fd.X0,y,"Der Schülerband enthält diese Lösungen nicht. Hinter den "
            "Lösungen stehen hier außerdem die Testvorbereitung, der Kapiteltest und "
            "die erwarteten Messwerte – zum Kopieren und Austeilen, wenn Sie sie "
            "brauchen.",fd.schrift("reg",fd.FLIESS),fd.STIL["text"],LESE,fd.LH)
    fd.T(h,fd.X0,fd.UNTEN-LH_ZWISCH,"Nur für Lehrkräfte – nicht für die Schülerhand",
         fd.schrift("bold",fd.ZWISCHEN),fd.STIL["akzent"])
    PROBE.append(("Lehrerband Deckblatt",1,_unterkante(im)))
    return fertig(im)


def loesungen_pages(start_pn):
    """Je Kapitel: jede Einheit ein eigener Lehrerteil, danach der Kapitelblock."""
    pages=[]; pn=start_pn; starts=[]; marken=[]
    for ci,ch in enumerate(CHAPTERS):
        starts.append(pn)
        for ti,tid in enumerate(ch["topics"]):
            marken.append((FSD[tid].get("titel") or FSD[tid]["name"],pn,ci))
            for p in lehrerseite(tid,ti+1,pn): pages.append(p); pn+=1
        marken.append(("Kapiteltest und Weiterdenken",pn,ci))
        for p in lehrerseite_kapitel(ch,ci,pn): pages.append(p); pn+=1
    return pages,pn,starts,marken


def lehrer_anhang(pn):
    """Testvorbereitung, Kapiteltest und Messwerte - seit 15.09.2026 hier.

    Sie standen im Schuelerband und haben ihn zu dick gemacht (gemessen 297
    Seiten ueber alle 19 Baende, 9 % des Schuelersatzes). Weggeworfen ist
    nichts: Die Lehrkraft kopiert, was sie austeilen will. Der Test gehoert
    ohnehin nicht in die Hand dessen, der ihn schreibt."""
    raus = []; marken = []
    for ci, ch in enumerate(CHAPTERS):
        a = ASMT[ch["id"]]
        words = [x["wort"] for x in a["clues"]["hinweise"]]
        marken.append(("Testvorbereitung · " + ch["title"], pn + len(raus)))
        raus += ch_testprep(a["prep"], words, ch["title"], pn + len(raus), fuss=FUSS_LB)
        marken.append(("Kapiteltest · " + ch["title"], pn + len(raus)))
        raus += ch_test(a["test"], ch["title"], pn + len(raus), fuss=FUSS_LB)
    marken.append(("Messwerte ohne Gerät", pn + len(raus)))
    mess, _pn, _starts = messwerte_pages(pn + len(raus), fuss=FUSS_LB)
    raus += mess
    return raus, marken


def lehrerband_setzen():
    """Nur SETZEN, nichts schreiben. Wird VOR den Proben aufgerufen.

    Frueher setzte build_lehrerband() erst nach der Satzspiegel-, Zeichen- und
    Versalprobe - die Proben sahen den Lehrerband also nie. Am 14.09.2026 hat
    das genau einmal zugeschlagen: Die Kreisziffern ② ④ ⑥ in den Ueberschriften
    des neuen Lehrerteils stehen NICHT in der Heftschrift (auf der
    Schuelerseite sind sie gezeichnete Marken, kein Text). Gedruckt wurden
    168 leere Kaestchen, und die Zeichenprobe meldete "0 fehlende Zeichen".
    Seitdem laeuft das Setzen vor den Proben und das Schreiben danach."""
    loes,_pn,starts,marken=loesungen_pages(2)
    anhang,amarken=lehrer_anhang(_pn)
    return [lb_cover()]+loes+anhang,starts,marken+[(t,p,None) for t,p in amarken]


def build_lehrerband(gesetzt=None):
    """Der Loesungsteil als eigenes PDF - Vorbild: arbeitsheft_foe8/build_book.py."""
    pages,starts,marken=gesetzt if gesetzt else lehrerband_setzen()
    out=os.path.join(HERE,"build","lehrerband.pdf")
    pages[0].save(out,"PDF",resolution=150,save_all=True,append_images=pages[1:])
    ziel=os.path.expanduser(f"~/Desktop/{DATEINAME}_Lehrerband.pdf")
    try:
        from pypdf import PdfReader, PdfWriter
        from pypdf.generic import NameObject
        r=PdfReader(out); w=PdfWriter()
        for p in r.pages: w.add_page(p)
        w.add_outline_item("Deckblatt",0)
        lp=w.add_outline_item("Lösungen",1)
        # Ein Lesezeichen JE EINHEIT, nicht nur je Kapitel. Der Lehrerband wird
        # im Unterricht aufgeschlagen, nicht gelesen: Wer die Loesung zu ki9
        # sucht, soll sie im Baum finden und nicht 16 Seiten blaettern.
        _kap=[]
        for i,ch in enumerate(CHAPTERS):
            _kap.append(w.add_outline_item(f"Kapitel {i+1} · {ch['title']}",
                                           starts[i]-1,parent=lp))
        for _t,_p,_ci in marken:
            # _ci None: Testvorbereitung, Kapiteltest und Messwerte haengen
            # nicht unter einem Kapitel der Loesungen, sondern oben.
            w.add_outline_item(_t,_p-1,parent=_kap[_ci] if _ci is not None else None)
        w._root_object[NameObject("/PageMode")]=NameObject("/UseOutlines")
        # Aus BANDNAME, nicht aus KL/SFORM: die fuenf Realschulbaende haben die
        # beiden Namen nicht (siehe lb_cover).
        w.add_metadata({"/Title":BANDNAME.upper()+" – Lehrerband",
                        "/Author":"Abdullah Lala","/Creator":"FELO",
                        "/Subject":"Lösungen und Erwartungshorizonte zum Forscherheft "+BANDNAME})
        with open(ziel,"wb") as f: w.write(f)
    except Exception as e:
        import shutil; shutil.copy2(out,ziel); print("Lehrerband ohne Lesezeichen:",e)
    print(f"Lehrerband: {len(pages)} Seiten -> {ziel}")
    return len(pages)


# ---------- E-Book: navigierbares PDF (Lesezeichen-Baum + klickbares Inhaltsverzeichnis & Deckblatt) ----------
def build_ebook(src, dst, nav, qrpages=None, seitentexte=None,
                mess_start=None, mess_starts=None, toc_pn=3, bk_start=None):
    from pypdf import PdfReader, PdfWriter
    from pypdf.generic import ArrayObject, NameObject, DictionaryObject, NumberObject, FloatObject, TextStringObject
    r=PdfReader(src); w=PdfWriter()
    for p in r.pages: w.add_page(p)
    # Lesezeichen-Baum (Navigationsleiste im Reader / Apple Books)
    w.add_outline_item("Deckblatt",0)
    w.add_outline_item("Über dieses Heft",1)
    w.add_outline_item("Inhalt",toc_pn-1)
    for i,chap in enumerate(nav):
        par=w.add_outline_item(f"Kapitel {i+1} · {chap['title']}", chap["page"]-1)
        for lbl,pg in chap["subs"]:
            w.add_outline_item(lbl, pg-1, parent=par)
    if bk_start:
        w.add_outline_item("Basiskonzepte im Überblick", bk_start-1)
    if mess_start:
        mp=w.add_outline_item("Messwerte ohne Gerät", mess_start-1)
        for i,chap in enumerate(nav):
            _m=(mess_starts[i]-1) if mess_starts else (mess_start-1)
            w.add_outline_item(f"Kapitel {i+1} · {chap['title']}", _m, parent=mp)
    # Interne Klick-Links: Bild-Pixel -> PDF-Punkte (PDF-Ursprung unten links)
    scale=72.0/150.0; Hpt=float(r.pages[0].mediabox.height)
    def rc(x0,y0,x1,y1): return (x0*scale, Hpt-y1*scale, x1*scale, Hpt-y0*scale)
    def link(page_idx,box,target_pg):   # robuste interne Verknüpfung via echter Seitenreferenz (/Dest [pageref /Fit])
        tgt=w.pages[target_pg-1].indirect_reference
        annot=DictionaryObject({NameObject("/Type"):NameObject("/Annot"), NameObject("/Subtype"):NameObject("/Link"),
            NameObject("/Rect"):ArrayObject([FloatObject(v) for v in box]),
            NameObject("/Border"):ArrayObject([NumberObject(0),NumberObject(0),NumberObject(0)]),
            NameObject("/Dest"):ArrayObject([tgt,NameObject("/Fit")])})
        ref=w._add_object(annot); pg=w.pages[page_idx]
        if "/Annots" in pg: pg[NameObject("/Annots")].append(ref)
        else: pg[NameObject("/Annots")]=ArrayObject([ref])
    # Inhaltsverzeichnis und Deckblatt: die Kaestchen sind MITGESCHRIEBEN worden,
    # nicht nachgerechnet - eine Layoutaenderung kann die Klickflaeche nicht mehr
    # neben ihr Kaestchen schieben.
    for i,chap in enumerate(nav):
        if i<len(TOCBOXEN): link(toc_pn-1, rc(*TOCBOXEN[i]), chap["page"])
        if i<len(COVERBOXEN): link(0, rc(*COVERBOXEN[i]), chap["page"])
    for chap in nav:                     # Kapitel-Trennseiten: Themen-Kästchen -> Forscherseite
        rechtecke=[]
        for sp in range(chap["page"], chap["page"]+chap.get("trennseiten",1)):
            for r2 in TRENNBOXEN.get(sp, []): rechtecke.append((sp,r2))
        for i,(lbl,pg) in enumerate(chap["topics"]):
            if i>=len(rechtecke):
                print(f"   Hinweis: kein Kästchen für {lbl} auf Seite {chap['page']}"); continue
            sp,r2=rechtecke[i]; link(sp-1, rc(*r2), pg)
    # QR-Kaertchen anklickbar machen: am Bildschirm scannt niemand einen QR-Code
    def weblink(page_idx,box,url):
        act=DictionaryObject({NameObject("/S"):NameObject("/URI"),NameObject("/URI"):TextStringObject(url)})
        annot=DictionaryObject({NameObject("/Type"):NameObject("/Annot"), NameObject("/Subtype"):NameObject("/Link"),
            NameObject("/Rect"):ArrayObject([FloatObject(v) for v in box]),
            NameObject("/Border"):ArrayObject([NumberObject(0),NumberObject(0),NumberObject(0)]),
            NameObject("/A"):act})
        ref=w._add_object(annot); pg=w.pages[page_idx]
        if "/Annots" in pg: pg[NameObject("/Annots")].append(ref)
        else: pg[NameObject("/Annots")]=ArrayObject([ref])
    n_sim=0
    for pg_nr,tid in (qrpages or {}).items():
        u=sim_url(tid)
        if not u: continue
        weblink(pg_nr-1, rc(*QR_KASTEN), u); n_sim+=1

    # Seitenzahl unten rechts fuehrt zurueck ins Inhaltsverzeichnis
    for i in range(toc_pn,len(w.pages)):
        link(i, rc(fd.X1-70, fd.FUSS_Y-6, fd.X1, fd.FUSS_Y+26), toc_pn)

    # Lesezeichenleiste beim Oeffnen ausklappen, damit man das Heft sofort navigieren kann
    w._root_object[NameObject("/PageMode")]=NameObject("/UseOutlines")
    w.add_metadata({"/Title":"FELO PHYSIK 5/6 – Forscherheft Realschule NRW",
                    "/Author":"Abdullah Lala",
                    "/Subject":"Magnetismus · Licht & Schatten · Stromkreis · Wärme · Schall · Sonne, Erde & Mond",
                    "/Keywords":"FELO, Physik, Klasse 5, Klasse 6, Realschule NRW, Forscherheft, Fassung 1.1, Stand 2026-08-28",
                    "/Creator":"FELO"})
    # Unsichtbare Textebene: macht das Bild-PDF durchsuchbar und zitierfaehig.
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


# ---------- Assembly ----------
if __name__=="__main__":
    # Eigene Bilder aus bilder/ haben Vorrang vor den gezeichneten Szenen.
    try:
        from bilder import einlesen
        eig=einlesen()
        if eig: print("eigene Bilder übernommen:"," ".join(sorted(eig)))
    except Exception as e:
        print("bilder/ übersprungen:",e)

    # Erst das Vorwort setzen: es bestimmt, ab welcher Seite das Inhaltsverzeichnis
    # und der Buchteil stehen. Frueher war "Über dieses Heft" per Annahme eine Seite.
    about=about_pages(2)
    toc_pn=2+len(about)
    pn=toc_pn+1

    body=[]; starts=[]; nav=[]; qrpages={}
    for ci,ch in enumerate(CHAPTERS):
        starts.append((ch["title"],pn))
        chap={"title":ch["title"],"page":pn,"subs":[],"topics":[],"trennseiten":1}
        _tr=divider(ci+1,ch,pn); chap["trennseiten"]=len(_tr)
        body+=_tr; pn+=len(_tr)
        for ti,tid in enumerate(ch["topics"]):
            _lbl=FSD[tid].get("titel") or FSD[tid]["name"]
            chap["subs"].append((_lbl,pn))
            chap["topics"].append((_lbl,pn))   # Themen-Kästchen der Trennseite -> Forscherseite
            qrpages[pn]=tid
            HEFTSEITE[tid]=pn      # Seitenverweis im Lehrerteil
            _tp=topic_pages(FSD[tid],ch["title"],ti+1,pn,_diag(ch["id"],tid))
            body+=_tp; pn+=len(_tp)
            if tid in UEBD:
                _up=ch_uebung(UEBD[tid],FSD[tid],ch["title"],ti+1,pn,
                              FSD[tid].get("ueberleitung"))
                body+=_up; pn+=len(_up)
            if ch["id"]=="strom" and tid==SZ_NACH:
                chap["subs"].append(("So zeichnet man einen Stromkreis",pn))
                qrpages[pn]="s1"
                _sz=ch_schaltzeichen(ch["title"],pn); body+=_sz; pn+=len(_sz)
        # RAETSEL ENTFALLEN: ch_wortgitter und ch_kreuzwort werden nicht mehr
        # aufgerufen und stehen deshalb auch nicht mehr in den Lesezeichen.
        # Testvorbereitung und Kapiteltest stehen seit dem 15.09.2026 im
        # LEHRERBAND (siehe lehrer_anhang) - der Schuelerband wurde zu dick,
        # und ein Test gehoert nicht in die Hand dessen, der ihn schreibt.
        chap["subs"].append(("Hilfen & Forscheraufträge",pn))
        _hi=ch_hilfen(ch,pn); body+=_hi; pn+=len(_hi)
        if TRANSFER.get(ch["id"]):
            chap["subs"].append(("Weiterdenken · Anforderungsbereich III",pn))
            _wd=ch_transfer(ch,pn); body+=_wd; pn+=len(_wd)
        nav.append(chap)
    bk_start=pn; bk=basiskonzept_seiten(pn); pn+=len(bk)
    # Der Messwerte-Anhang steht seit dem 15.09.2026 im LEHRERBAND. Seit der
    # Kuerzung von Abschnitt ③ (14.09.) verwies keine Forscherseite mehr auf
    # ihn; er stand nur noch im Inhaltsverzeichnis und kostete 103 Seiten
    # ueber alle Baende.
    mess_start=mess_starts=None
    zusatz=[("Basiskonzepte im Überblick (für Eltern und Lehrkräfte)",bk_start)]
    pages=[book_cover()]+about+[toc(starts,toc_pn,None,zusatz)]+body+bk
    bd=os.path.join(HERE,"build"); os.makedirs(bd,exist_ok=True)
    # Alte Seiten wegraeumen: ein anders langer Satz darf keine book_p*.png des
    # vorigen Laufs stehen lassen, sonst misst simcheck/seitenzahlen.py Geisterseiten.
    for _alt in glob.glob(os.path.join(bd,"book_p*.png")): os.remove(_alt)
    for i,p in enumerate(pages): p.save(os.path.join(bd,f"book_p{i+1}.png"))
    # WELCHE SEITE TRAEGT WELCHE EINHEIT? Der Satz weiss es genau - `pn` ist die
    # Zahl, die beim Setzen verwendet wurde. Aufgeschrieben wird sie, weil
    # simcheck/seitenzahlen.py nur Seiten mit QR-CODE messen kann: Die
    # Datenblattseiten drucken keinen, und fuer sie trug die Bruecke bis zum
    # 15.09.2026 eine GESCHAETZTE Zahl (gemessen 37 Kennungen ueber acht Baende,
    # alle Datenblattseiten). export_bruecke.py fuellt damit die Luecken; die
    # gemessenen Zahlen behalten den Vorrang, damit die unabhaengige Gegenprobe
    # bleibt.
    json.dump(HEFTSEITE, open(os.path.join(bd,"seiten_gebaut.json"),"w",encoding="utf-8"),
              ensure_ascii=False, indent=1, sort_keys=True)
    # Die Druckfassung ist nur Zwischenschritt: build_ebook liest sie und haengt
    # Lesezeichen und Links an. Sie liegt deshalb in build/ und nicht auf dem
    # Schreibtisch - dort soll genau EINE aktuelle Datei liegen, das E-Book.
    # Mit  python3 build_book.py --druck  kommt sie zusaetzlich auf den Schreibtisch.
    seitentexte=[SEITENTEXTE.get(id(p),[]) for p in pages]
    fehlend=[i+1 for i,s in enumerate(seitentexte) if not s]
    if fehlend: print("ohne Textprotokoll:",fehlend)

    # ── Der Lehrerband wird JETZT gesetzt, geschrieben wird er spaeter. ──
    # Nur so laufen Satzspiegel-, Zeichen- und Versalprobe auch ueber ihn.
    # Siehe lehrerband_setzen().
    _n_schueler=len(PROBE)
    _lb=lehrerband_setzen()

    # ── Woraus besteht der Band? Gezaehlt, nicht geschaetzt. ──
    _art={}
    for _name,_pn,_y in PROBE[:_n_schueler]:
        _a=_name.split(" ")[0] if " " in _name else _name
        _art[_a]=_art.get(_a,0)+1
    print("\nSeitenspiegel des Schuelerbandes:")
    for _a in sorted(_art,key=lambda k:-_art[k]):
        print(f"   {_a:22s} {_art[_a]:4d}")

    # ── Satzspiegel-Probe: wie tief laeuft jede Seite wirklich? ──
    # Je Band getrennt: Beide zaehlen ihre Seiten ab 1, und die Ausnahme
    # "letzte Seite des Bandes" traefe sonst die falsche.
    def _satzspiegel(name,teil):
        if not teil: return
        # Die Schwelle ist 1,5 Einheiten, nicht 0,5. Gemessen wird mit
        # `_unterkante()` die TIEFSTE TINTE im Seitenbild, nicht die gerechnete
        # Bausteinhoehe - eine Unterlaenge oder eine Zierlinie liegt ein Pixel
        # tiefer als der Block, der sie traegt. Bei 150 dpi ist eine Einheit
        # genau ein Pixel (0,48 pt). Mit 0,5 meldete `arbeitsheft_foe9` seit
        # dem Umbau dauerhaft EINE Seite ("Lehrerteil fe8 1/4 endet 1675, +1"),
        # und eine Warnung, die man jedes Mal wegliest, ist keine mehr. Die
        # Probe ist fuer die echten Faelle gebaut: 1833 bis 2817 statt 1674.
        ueber=[p for p in teil if p[2]>fd.UNTEN+1.5]
        print(f"\nSatzspiegel-Probe {name}: {len(teil)} Seiten gemessen, "
              f"Grenze {fd.UNTEN:.0f} Einheiten ({fd.punkt(fd.UNTEN):.0f} pt)")
        if ueber:
            print(f"WARNUNG: {len(ueber)} Seite(n) laufen unter den Satzspiegel:")
            for nm,seite,y in sorted(ueber,key=lambda p:-p[2])[:20]:
                print(f"   Seite {seite:3d}  {nm:38s} endet {y:.0f}  (+{y-fd.UNTEN:.0f})")
        else:
            tiefste=max(teil,key=lambda p:p[2])
            print(f"   keine Seite laeuft unter den Satzspiegel. Tiefste: Seite {tiefste[1]} "
                  f"({tiefste[0]}) endet {tiefste[2]:.0f}, {fd.UNTEN-tiefste[2]:.0f} Einheiten Luft.")
        # Fast leere Seiten. Sie laufen unter keine Kante und es faellt kein Text
        # weg - sichtbar werden sie nur so. Seite 32 trug einmal genau eine Linie.
        _letzte=max(p[1] for p in teil)
        _leer=[p for p in teil if p[2]<fd.OBEN+(fd.UNTEN-fd.OBEN)/3]
        if _leer:
            print(f"   {len(_leer)} Seite(n) tragen weniger als ein Drittel:")
            for nm,seite,y in sorted(_leer,key=lambda p:p[2])[:20]:
                print(f"   Seite {seite:3d}  {nm:38s} endet {y:.0f} "
                      f"({100*(y-fd.OBEN)/(fd.UNTEN-fd.OBEN):.0f} % gefuellt)"
                      +("   letzte Seite des Bandes - unvermeidbar" if seite==_letzte else
                        "   WARNUNG"))
        else:
            print("   keine Seite traegt weniger als ein Drittel.")
    _satzspiegel("Schuelerband",PROBE[:_n_schueler])
    _satzspiegel("Lehrerband",PROBE[_n_schueler:])
    if WAISEN:
        print(f"WARNUNG: {len(WAISEN)} Seite(n) enden mit einer allein stehenden Ueberschrift:")
        for name,seite,bs_name in WAISEN[:20]:
            print(f"   Seite {seite:3d}  {name:38s} endet mit '{bs_name}'")
    else:
        print("   keine Seite endet mit einer allein stehenden Ueberschrift.")

    # ── Zeichenprobe: haelt JEDE gesetzte Kette der cmap stand? ──
    # fd.T fuehrt Buch ueber alles, was im neuen Satz gedruckt wird. Ein leeres
    # Kaestchen wie "▤" (U+25A4) kann so nicht mehr unbemerkt auf die Seite kommen.
    _fehlt={}
    for _s,_art2,_gr in fd.GESETZT:
        for _c in fd.fehlende_zeichen(_s,_art2): _fehlt[_c]=_fehlt.get(_c,0)+1
    print(f"Zeichenprobe: {len(fd.GESETZT)} gesetzte Ketten gegen die cmap gehalten – "
          + ("0 fehlende Zeichen." if not _fehlt else
             "FEHLENDE ZEICHEN: "+" ".join("U+%04X (%dx)"%(ord(c),n) for c,n in _fehlt.items())))
    _grade=sorted({round(g,2) for _,_,g in fd.GESETZT})
    print("   gesetzte Schriftgrade (gedruckte pt): "+" · ".join("%.2f"%g for g in _grade))

    # ── Versalprobe: "Keine Woerter in Grossbuchstaben" ist eine Vorgabe, ──
    # also wird sie an dem gemessen, was gedruckt wird - nicht angenommen.
    import re as _re
    # "UV" steht nur in "UV-Strahlung" - einem Stichwort des Kernlehrplans auf der
    # Basiskonzept-Uebersicht. Es ist eine Abkuerzung, kein Raetselwort.
    _erlaubt=set(ABKUERZUNGEN)|{"FELO","NRW","QR","UV"}
    _vers={}
    for _s,_a,_g in fd.GESETZT:
        # Nur ganze Versalwoerter. Ohne die beiden Ausschluesse meldet die Probe
        # "QR-C" aus "QR-Code" - ein Fehlalarm.
        for _w in _re.findall(r"(?<![A-Za-zÄÖÜäöüß])[A-ZÄÖÜ]{2,}(?![A-Za-zÄÖÜäöüß])",_s):
            if _w in _erlaubt or _re.fullmatch(r"(I{1,3}|IV|V)",_w): continue
            _vers[_w]=_vers.get(_w,0)+1
    print("Versalprobe: "+("keine Woerter in Grossbuchstaben." if not _vers else
          "GEFUNDEN: "+" ".join("%s (%dx)"%(w,n) for w,n in sorted(_vers.items()))))

    out=os.path.join(bd,"%s_Druck%s.pdf"%(DATEINAME,"_weiss" if WEISS else ""))
    pages[0].save(out,"PDF",resolution=150,save_all=True,append_images=pages[1:])
    print("Seiten gesetzt:",len(pages),"->",os.path.relpath(out,HERE))
    if WEISS:
        # Der neue Satz steht ohnehin auf weissem Grund - die alte Sonderfassung
        # ist damit gegenstandslos, der Schalter bleibt nur der Werkzeugkette wegen.
        print("Druckfreundliche Fassung fertig (weisser Grund, ohne Farbflaechen).")
        sys.exit(0)
    if "--druck" in sys.argv:
        import shutil; ziel=os.path.expanduser(f"~/Desktop/{DATEINAME}_Druck.pdf")
        shutil.copy2(out,ziel); print("Druckfassung zusätzlich:",ziel)
    try:
        eb=os.path.expanduser(f"~/Desktop/{DATEINAME}.pdf")
        try:
            build_ebook(out, eb, nav, qrpages, seitentexte, mess_start, mess_starts,
                        toc_pn, bk_start)
        except PermissionError:
            # Die alte Datei laesst sich nicht ueberschreiben (offen, gesperrt oder
            # ausserhalb der Schreibrechte). Dann daneben legen statt abbrechen.
            eb=os.path.expanduser(f"~/Desktop/{DATEINAME}_NEU.pdf")
            build_ebook(out, eb, nav, qrpages, seitentexte, mess_start, mess_starts,
                        toc_pn, bk_start)
            print("HINWEIS: alte E-Book-Datei war gesperrt - neue Fassung daneben gelegt.")
        print("SAVED (navigierbares E-Book)",eb)
    except Exception as e:
        import traceback; traceback.print_exc(); print("E-Book-Schritt übersprungen:",e)
    print("")
    # `_lb` ist oben schon gesetzt, damit die Proben es messen konnten.
    n_lb=build_lehrerband(_lb)

    # ── Geisterseiten wegraeumen ────────────────────────────────────────────
    # WAEHREND des Laufs legt ein Sicherungs-/Synchronisationsdienst geloeschte
    # Seiten als "book_p<n> 2.png" wieder daneben (Rechte 0600 statt 0644 wie
    # unsere). Gemessen: 130 solche Dateien nach dem ersten Lauf, 110 nach dem
    # zweiten. simcheck/seitenzahlen.py bricht an ihnen ab
    # (AttributeError: 'NoneType' object has no attribute 'group') und wuerde
    # sie sonst als zusaetzliche Seiten messen. Das Muster ist eng gefasst:
    # genau "book_p<Ziffern> <Ziffern>.png", nichts anderes.
    _geist=[p for p in glob.glob(os.path.join(bd,"book_p* *.png"))
            if _re.fullmatch(r"book_p\d+ \d+\.png", os.path.basename(p))]
    for p in _geist:
        try: os.remove(p)
        except OSError: pass
    if _geist:
        print(f"{len(_geist)} Geisterseite(n) eines Sicherungsdienstes entfernt "
              f"(z. B. {os.path.basename(_geist[0])}) - sonst zaehlt "
              f"simcheck/seitenzahlen.py sie mit.")

    print(f"\nSchuelerband {len(pages)} Seiten  ·  Lehrerband {n_lb} Seiten")
