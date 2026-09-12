# -*- coding: utf-8 -*-
"""Gold-Forscher-Heft: 1 Thema = 1 volle Seite (alle Schritte), Cover + Methode."""
import os, json, math, re, random
from PIL import Image, ImageDraw, ImageFont
HERE=os.path.dirname(__file__); IMG=os.path.join(HERE,"img")
SF="/System/Library/Fonts/Supplemental/"
S=2; W,H=1240,1754
def sc(v): return int(round(v*S))
FONTS=os.path.join(HERE,"fonts")
def _f(p,pt,i=0): return ImageFont.truetype(SF+p,int(pt*S),index=i)
def _of(fname,pt): return ImageFont.truetype(os.path.join(FONTS,fname),int(pt*S))
def DIDOT(pt): return _f("Didot.ttc",pt,0)
def COCHIN(pt): return _f("Cochin.ttc",pt,1)
def COP(pt): return _f("Copperplate.ttc",pt,0)
# Fließtext/Labels: Avenir Next (Apple, fsType=4 "Preview & Print only") -> Source Sans 3 (SIL OFL, fsType=0, kommerziell einbettbar). Lizenz: fonts/OFL.txt
def AV(pt): return _of("SourceSans3-Regular.ttf",pt)
def AVM(pt): return _of("SourceSans3-Medium.ttf",pt)
def AVB(pt): return _of("SourceSans3-Bold.ttf",pt)
CREAM=(250,246,236); NAVYBG=(15,24,56); INK=(38,44,66); SUB=(120,120,135); WHITE=(255,255,255)
GOLD=(198,160,74); GOLD_L=(226,200,128); GOLD_D=(140,108,40); GLINE=(226,206,150)
RED=(206,60,52); RED_D=(150,38,34); RED_L=(232,110,100); BLUE=(44,88,180); BLUE_D=(28,58,130); BLUE_L=(110,150,220)
STEP=[(28,42,90),(84,56,116),(22,120,118),(190,148,50),(198,70,60)]
TOPACC=[(22,120,118),(199,70,60),(84,56,116),(46,92,178),(190,148,50)]
ML=52

# ---------- Druckfreundliche Fassung ----------
# HEFT_WEISS=1 schaltet auf weissen Grund und wenig Farbflaeche um. Die Variable wird
# beim IMPORT gelesen, nicht spaeter: build_book holt die Farben per "import *" als
# Werte heraus: eine spaetere Zuweisung kaeme dort nicht mehr an.
WEISS = os.environ.get("HEFT_WEISS")=="1"
if WEISS:
    CREAM=(255,255,255)      # Seitengrund: reines Weiss statt Creme
    NAVYBG=(255,255,255)     # Deckblatt und Trennseiten ohne ganzflaechiges Dunkelblau
# Auf den frueher dunklen Seiten stand helle Schrift. Auf weissem Grund waere sie
# unsichtbar, deshalb bekommt jede dieser Farben hier ihr dunkles Gegenstueck.
_DUNKEL={(226,200,128):(140,108,40), (198,160,74):(140,108,40), (250,246,236):(38,44,66), (255,255,255):(38,44,66),
         (214,222,238):(62,70,94),   (226,232,246):(38,44,66), (150,164,196):(118,124,142),
         (66,80,118):(206,210,224),  (150,162,190):(118,124,142), (150,132,86):(140,108,40),
         (110,124,158):(190,196,212)}
def DF(c):
    """Farbe fuer die Druckfassung umdrehen. In der normalen Fassung unveraendert."""
    return _DUNKEL.get(tuple(c),c) if WEISS else c
FK=json.loads(open(os.path.join(HERE,"..","fk-magnet.js"),encoding="utf-8").read().split("=",1)[1].rstrip().rstrip(";"))
strip=lambda s: re.sub(r"\s+"," ",re.sub("<[^>]+>","",s or "")).strip()
ALLTAG={"magnete-felder":("fridge","Kühlschrankmagnet"),"magnet-stoffe":("crane","Schrott-Kran"),
 "magnetpole":("closure","Taschenverschluss"),"magnetfeld":("u_mrt","MRT"),"kompass":("hiking","Wandern")}
CFG={
 "magnete-felder":{"f":["Nähere einen Magneten langsam einer Büroklammer.","Schiebe ein Blatt Papier dazwischen – wirkt er noch?"],
  "tab":(["Situation","Wirkt der Magnet?"],["ohne etwas dazwischen","durch Papier","aus der Luft"]),
  "mit":[("Um jeden Magneten liegt ein","."),("Er wirkt auch ohne","."),],
  "auf":("shortq","Erkläre mit dem Wort Magnetfeld, warum ein Magnet ohne Berührung wirkt.",2)},
 "magnet-stoffe":{"f":["Halte den Magneten an Nagel, Aludose, Klammer und Holz.","Sortiere: Was wird angezogen, was nicht?"],
  "tab":(["Gegenstand","angezogen?"],["Eisennagel","Aludose","Büroklammer","Holzklotz"]),
  "mit":[("Magnetisch sind nur Eisen, Nickel und","."),("„Metall“ ist nicht dasselbe wie",".")],
  "auf":("checklist","Kreuze an, welche der Magnet anzieht:",["Eisennagel","Büroklammer (Stahl)","Aludose","Kupferdraht"])},
 "magnetpole":{"pp":[("N","N",RED,RED),("N","S",RED,BLUE),("S","S",BLUE,BLUE)],
  "f":["Nähere die Pole N und N.","Dann N und S.","Dann S und S."],
  "tab":(["Pole","Was passiert?"],["N und N","N und S","S und S"]),
  "mit":[("Gleiche Pole (N–N oder S–S)","sich."),("Ungleiche Pole (N–S)","sich.")],
  "auf":("checkrows","Anziehung oder Abstoßung?",[("N","S",RED,BLUE),("S","N",BLUE,RED),("N","N",RED,RED)])},
 "magnetfeld":{"f":["Streue Eisenspäne auf ein Blatt über einem Magneten.","Bewege eine Kompassnadel um den Magneten herum."],
  "tab":(["Ort","Wie ist das Feld?"],["an den Polen","in der Mitte","weit weg"]),
  "mit":[("Feldlinien gehen von Nord nach","."),("Enge Linien = Feld",".")],
  "auf":("drawbox","Zeichne einen Stabmagneten mit vier Feldlinien (außen N nach S).",150)},
 "kompass":{"f":["Dreh dich mit dem Kompass im Kreis.","Halte ihn in Sonne und Schatten.","Nähere einen Magneten."],
  "tab":(["Test","Wohin zeigt die Nadel?"],["im Freien","im Schatten","neben Magnet"]),
  "mit":[("Die Kompassnadel ist ein kleiner","."),("Sie richtet sich im","aus.")],
  "auf":("shortq","Erkläre, warum die Kompassnadel nach Norden zeigt. Nutze: Magnet, Erdmagnetfeld.",2)},
}
# Kindgerechte Schülersprache (Kl.5) – überschreibt problem/frage/predict aus fk-magnet.js (App bleibt unberührt).
# Erzeugt + didaktisch geprüft; leere Felder fielen auf die Originaltexte zurück.
KID={
 "magnete-felder":{
  "problem":"Du hast zwei kleine Bausteine mit Magneten. Du hältst sie nah zusammen. Klack! Sie springen von allein aneinander. Drehst du einen Baustein um, drücken sie sich plötzlich weg.",
  "frage":"Wie kann ein Magnet etwas anziehen, ohne es zu berühren?",
  "options":["Um den Magneten herum ist ein unsichtbares Feld.","Der Magnet ist klebrig und pappt einfach fest."]},
 "magnet-stoffe":{
  "problem":"Auf dem Schrottplatz hebt ein riesiger Magnet ein altes Auto hoch. Doch die glänzenden Alu-Räder daneben bleiben liegen. Zu Hause klebt dein Magnet an der Kühlschranktür. An der Alu-Dose klebt er nicht.",
  "frage":"Welche Sachen zieht ein Magnet an?",
  "options":["Der Magnet zieht nur manche Metalle an.","Der Magnet zieht alles aus Metall an."]},
 "magnetpole":{
  "problem":"Ein Magnet macht deine Tasche zu. Sonst hält er den Deckel immer fest. Doch heute drückt er den Deckel plötzlich weg.",
  "frage":"Ziehen sich zwei Magnete immer an?",
  "options":["Ja, Magnete ziehen sich immer an.","Nein, manchmal drücken sie sich weg."]},
 "magnetfeld":{
  "problem":"Du legst eine kleine Büroklammer auf den Tisch. Langsam schiebst du einen Magneten näher. Auf einmal springt die Klammer von allein an den Magneten. Und keiner hat sie angefasst!",
  "frage":"Wo am Magneten zieht es am stärksten?",
  "options":["An den beiden Enden vom Magneten.","Genau in der Mitte vom Magneten."]},
 "kompass":{
  "problem":"Du wanderst mit deiner Familie durch den Wald und verläufst dich. Dein Handy hat hier keinen Empfang. Du holst einen Kompass raus. Die kleine Nadel wackelt kurz und zeigt dann in eine Richtung.",
  "frage":"Warum zeigt die Kompassnadel immer nach Norden?",
  "options":["Die Nadel ist ein Magnet, die Erde auch.","Der kalte Norden zieht die Nadel an."]},
}
# Übungsseiten – generiert + fachlich geprüft (Workflow magnet-uebungen)
UEB_DATA={
 "magnete-felder":{"lueck":[("Um jeden Magneten liegt ein unsichtbares",". Es wirkt auch durch Papier und Luft.","Magnetfeld"),("Ein Magnet zieht","an, zum Beispiel eine Büroklammer.","Eisen"),("Der Magnet wirkt auch ganz ohne","auf die Büroklammer.","Berührung"),("Zwei Magnete können sich anziehen oder",", also voneinander wegdrücken.","abstoßen")],
  "rf":[("Ein Magnet muss Eisen berühren, damit er es anzieht.",False),("Um jeden Magneten liegt ein Magnetfeld.",True),("Das Magnetfeld kann auch durch ein Blatt Papier wirken.",True),("Ein Magnet zieht jedes Material an, auch Holz und Plastik.",False)],
  "mc":("Welches Material zieht ein Magnet an?",["Eisen","Holz","Glas","Plastik"],0),
  "offen":("Du hängst mit einem Magneten einen Zettel an die Kühlschranktür. Erkläre, warum der Magnet hält, obwohl der Zettel aus Papier dazwischen liegt.",3,"Um den Magneten liegt ein Magnetfeld. Es wirkt durch das Papier hindurch und zieht das Eisen der Tür an. So hält der Magnet auch ohne direkte Berührung.")},
 "magnet-stoffe":{"lueck":[("Ein Magnet zieht nur die drei Metalle Eisen,","und Kobalt an.","Nickel"),("Das Metall","wird von einem Magneten nicht angezogen.","Aluminium"),("Nicht jedes Metall ist",".","magnetisch"),("Ein Nagel aus Eisen wird von einem Magneten",".","angezogen")],
  "rf":[("Ein Magnet zieht Eisen an.",True),("Jedes Metall wird von einem Magneten angezogen.",False),("Auch Kupfer bleibt an einem Magneten kleben.",False),("Nickel und Kobalt sind magnetisch.",True)],
  "mc":("Welche Stoffe zieht ein Magnet an?",["Holz, Plastik und Glas","Eisen, Nickel und Kobalt","Aluminium und Kupfer","Alle Metalle"],1),
  "offen":("An deinem Kühlschrank halten kleine Magnete fest. Erkläre, warum die Magnete an der Kühlschranktür kleben bleiben.",3,"In der Kühlschranktür steckt Eisen. Weil Eisen magnetisch ist, zieht der Magnet die Tür an und bleibt daran kleben.")},
 "magnetpole":{"lueck":[("Jeder Magnet hat einen Nordpol und einen",".","Südpol"),("Gleiche Pole","sich ab.","stoßen"),("Ungleiche Pole","sich an.","ziehen"),("Ein Magnet hat immer zwei",".","Pole")],
  "rf":[("Zwei Nordpole ziehen sich an.",False),("Ein Nordpol und ein Südpol ziehen sich an.",True),("Zwei Südpole stoßen sich ab.",True),("Ein Magnet hat nur einen Pol.",False)],
  "mc":("Du hältst zwei Nordpole aneinander. Was passiert?",["Sie stoßen sich ab.","Sie ziehen sich an.","Nichts passiert.","Sie kleben fest zusammen."],0),
  "offen":("Du hast zwei Magnete. Sie stoßen sich ab. Was musst du tun, damit sie sich anziehen? Erkläre kurz.",3,"Ich drehe einen Magnet um. Dann treffen ein Nordpol und ein Südpol zusammen und die Magnete ziehen sich an.")},
 "magnetfeld":{"lueck":[("Um jeden Magneten liegt ein unsichtbares",".","Magnetfeld"),("Mit","kannst du das Magnetfeld sichtbar machen.","Eisenspänen"),("Die Feldlinien gehen außen vom Nordpol zum",".","Südpol"),("An den","ist das Magnetfeld am stärksten.","Polen")],
  "rf":[("Ein Magnetfeld kann man einfach so mit den Augen sehen.",False),("Enge Feldlinien bedeuten ein starkes Magnetfeld.",True),("Die Feldlinien laufen außen von Nord nach Süd.",True),("An den Polen ist das Magnetfeld am schwächsten.",False)],
  "mc":("Wo ist das Magnetfeld eines Stabmagneten am stärksten?",["Genau in der Mitte des Magneten","An den beiden Polen","Weit weg vom Magneten"],1),
  "offen":("Lisa hält einen Kompass neben einen starken Magneten. Die Nadel dreht sich sofort. Erkläre, warum das passiert.",3,"Der Magnet hat ein Magnetfeld um sich herum. Dieses unsichtbare Feld wirkt auf die Kompassnadel und dreht sie.")},
 "kompass":{"lueck":[("Die Kompassnadel ist ein kleiner",".","Magnet"),("Auch die Erde ist ein großer",".","Magnet"),("Der Nordpol der Nadel zeigt immer nach",".","Norden"),("Die Nadel steckt auf einer Spitze und kann sich frei",".","drehen")],
  "rf":[("Die Kompassnadel ist ein kleiner Magnet.",True),("Die Erde ist selbst ein großer Magnet.",True),("Die Kompassnadel zeigt immer nach Süden.",False),("Ein Kompass braucht Batterien, damit die Nadel sich dreht.",False)],
  "mc":("Warum dreht sich die Kompassnadel und zeigt nach Norden?",["Weil die Nadel aus Plastik ist.","Weil die Sonne die Nadel anzieht.","Weil die Nadel ein Magnet ist und die Erde auch ein Magnet ist."],2),
  "offen":("Du machst mit deiner Familie eine Wanderung im Wald. Ihr wisst nicht mehr, in welche Richtung ihr laufen müsst. Wie hilft euch ein Kompass? Schreibe es auf.",3,"Weil die Nadel im Kompass ein kleiner Magnet ist und die Erde auch ein großer Magnet ist, dreht sich die Nadel frei und ihr Nordpol zeigt nach Norden, sodass du die richtige Richtung findest.")},
}
# Rätsel-Wörter + kindgerechte Hinweise (Workflow magnet-assessment, geprüft)
RAETSEL=[("MAGNET","Dieses Ding zieht Eisen, Nickel und Kobalt an. Holz und Plastik bleiben nicht daran hängen."),
 ("EISEN","Aus diesem grauen Metall sind viele Nägel und Büroklammern. Ein Magnet zieht es an."),
 ("KOMPASS","Mit diesem kleinen Gerät findest du den Weg. Sein Zeiger dreht sich immer nach Norden."),
 ("NORDPOL","So heißt das eine Ende von einem Magneten. Es ist oft rot angemalt."),
 ("NADEL","Der dünne, drehbare Zeiger im Kompass. Sie ist selbst ein winziger Magnet."),
 ("POL","So nennt man ein Ende von einem Magneten. Davon gibt es zwei an jedem Magneten."),
 ("FELD","Der unsichtbare Bereich rund um einen Magneten. Es wirkt sogar durch Papier."),
 ("NORDEN","Diese Himmelsrichtung zeigt eine Kompassnadel immer an. Auf der Karte ist sie oben."),
 ("KRAFT","Man kann sie nicht sehen. Sie zieht Eisen an oder drückt zwei Magnete auseinander."),
 ("ANZIEHEN","Das machen ein Nordpol und ein Südpol: Sie halten fest aneinander."),
 ("ABSTOSSEN","Das passiert bei zwei gleichen Polen: Sie drücken sich voneinander weg."),
 ("NICKEL","Ein silbrig glänzendes Metall. Neben Eisen und Kobalt zieht ein Magnet es an.")]
# Wortgitter-Suchwörter
GITTER_WORDS=["MAGNET","EISEN","NICKEL","KOBALT","KOMPASS","NORDPOL","NADEL","FELD","POL","KRAFT","NORDEN","ANZIEHEN"]
PREP={
 "kannIch":["Ich kann erklären, dass ein Magnet Dinge auch anziehen kann, ohne sie zu berühren, weil um ihn herum ein Magnetfeld liegt.",
  "Ich kann sagen, welche Stoffe ein Magnet anzieht: Eisen, Nickel und Kobalt – aber nicht Aluminium, Kupfer, Holz, Plastik oder Glas.",
  "Ich kann beschreiben, dass jeder Magnet einen Nordpol und einen Südpol hat und dass sich gleiche Pole abstoßen und ungleiche Pole anziehen.",
  "Ich kann erklären, dass um jeden Magneten ein unsichtbares Magnetfeld liegt, das an den Polen am stärksten ist.",
  "Ich kann zeigen, dass die Feldlinien außen vom Nordpol zum Südpol laufen.",
  "Ich kann erklären, dass eine Kompassnadel ein kleiner Magnet ist und nach Norden zeigt, weil die Erde ein großer Magnet ist."],
 "tipps":["Nimm zu Hause einen Magneten und probiere aus, welche Dinge er anzieht und welche nicht.",
  "Male dir einen Magneten auf. Sage dabei laut: Gleiche Pole stoßen sich ab, ungleiche Pole ziehen sich an.",
  "Erkläre einem Freund oder deinen Eltern, warum ein Kompass immer nach Norden zeigt."],
 "mini":[("Ein Magnet wird an einen Löffel aus Aluminium und an einen Nagel aus Eisen gehalten. Welchen zieht er an?","Den Nagel aus Eisen. Eisen wird angezogen, Aluminium nicht."),
  ("Du hältst den Nordpol an den Nordpol eines anderen Magneten. Was passiert und warum?","Sie stoßen sich ab, weil sich gleiche Pole immer abstoßen."),
  ("Warum zeigt eine Kompassnadel immer nach Norden?","Weil die Nadel ein kleiner Magnet ist und die Erde ein großer Magnet.")]}
TEST={
 "a1":[("Ein Magnet zieht nur die Metalle Eisen,","und Kobalt an.","Nickel"),
  ("Jeder Magnet hat zwei Pole: einen Nordpol und einen",".","Südpol"),
  ("Gleiche Pole","sich ab, ungleiche Pole ziehen sich an.","stoßen"),
  ("Um jeden Magneten liegt ein unsichtbares",". Es ist an den Polen am stärksten.","Magnetfeld")],
 "a2":[("Eisennagel",True),("Büroklammer aus Stahl",True),("Schere aus Stahl",True),
  ("Getränkedose aus Aluminium",False),("Kupferdraht",False),("Holzlöffel",False)],
 "a3":[("N","S",RED,BLUE,"Anziehung"),("S","S",BLUE,BLUE,"Abstoßung"),("N","N",RED,RED,"Abstoßung")],
 "a5":("Wo ist das Magnetfeld eines Stabmagneten am stärksten?",["Genau in der Mitte des Magneten","An den beiden Polen","Überall am Magneten gleich stark","Nur am Nordpol"],1),
 "a6":("Erkläre, warum eine Kompassnadel immer nach Norden zeigt.",3,"Die Kompassnadel ist selbst ein kleiner Magnet und kann sich frei drehen. Auch die Erde ist ein großer Magnet mit einem Magnetfeld. Die Nadel dreht sich so lange, bis ein Ende nach Norden zeigt."),
 "a7":("Warum hält ein Magnet an der Kühlschranktür, aber nicht an einer Holztür?",2,"Die Kühlschranktür ist aus Eisen/Stahl und wird angezogen. Holz ist nicht magnetisch, darum hält der Magnet dort nicht."),
 "pts":[4,6,3,3,2,3,2]}

# ---------- Textprotokoll fuer die durchsuchbare Textschicht ----------
# Das PDF besteht aus Seitenbildern. Damit man darin trotzdem suchen und Text
# markieren kann, merkt sich jede Zeichenoperation, WAS wo stand. Daraus legt
# build_ebook spaeter eine unsichtbare, exakt deckungsgleiche Textebene darueber.
TEXTE=[]            # Laeufe der Seite, die gerade gezeichnet wird
SEITENTEXTE={}      # fertige Seite (id) -> Liste ihrer Laeufe
_HALTEN=[]          # haelt die Seitenbilder, damit id() nicht neu vergeben wird

def fertig(im):
    """Seite auf Endgroesse bringen und ihr Textprotokoll dazulegen."""
    out=im.resize((W,H),Image.LANCZOS)
    SEITENTEXTE[id(out)]=TEXTE[:]; _HALTEN.append(out); del TEXTE[:]
    return out

def hp(im,d):
    h=type("H",(),{})()
    def _merk(x,y,s,f,anchor,breite=None):
        """Linke Kante, Grundlinie, Breite und Groesse eines Textlaufs festhalten."""
        if not s or not s.strip(): return
        try:
            b0=d.textbbox((0,0),s,font=f,anchor="la")
            ba=d.textbbox((0,0),s,font=f,anchor=anchor)
            # Von der Ankerstelle zurueck auf die linke obere Ecke rechnen:
            # bei "ra" liegt der Ursprung rechts, bei "mm" in der Mitte.
            dx=(ba[0]-b0[0])/S; dy=(ba[1]-b0[1])/S
            asc=f.getmetrics()[0]/S
            br=(d.textlength(s,font=f)/S) if breite is None else breite
            TEXTE.append((x+dx, y+dy+asc, br, f.size/S, s))
        except Exception:
            pass
    def R(x0,y0,x1,y1,r,fill=None,outline=None,w=0): d.rounded_rectangle([sc(x0),sc(y0),sc(x1),sc(y1)],radius=sc(r),fill=fill,outline=outline,width=(sc(w) if w else 0))
    def T(x,y,s,f,fill,anchor="la"):
        d.text((sc(x),sc(y)),s,font=f,fill=fill,anchor=anchor); _merk(x,y,s,f,anchor)
    def tw(s,f): return d.textlength(s,font=f)/S
    def circ(cx,cy,r,fill=None,outline=None,w=0): d.ellipse([sc(cx-r),sc(cy-r),sc(cx+r),sc(cy+r)],fill=fill,outline=outline,width=(sc(w) if w else 0))
    def ln(p,fill,w=1): d.line([(sc(a),sc(b)) for a,b in p],fill=fill,width=sc(w))
    def tracked(cx,y,s,f,fill,tr,center=True):
        ws=[d.textlength(c,font=f) for c in s]; tot=sum(ws)+sc(tr)*(len(s)-1); x=(sc(cx)-tot/2) if center else sc(cx)
        _merk(x/S,y,s,f,"la",breite=tot/S)   # gesperrt gesetzt: als EIN Lauf protokollieren
        for c,wc in zip(s,ws): d.text((x,sc(y)),c,font=f,fill=fill); x+=wc+sc(tr)
    def orn(cx,y,half=70):
        ln([(cx-half,y),(cx-13,y)],GOLD,1); ln([(cx+13,y),(cx+half,y)],GOLD,1)
        r=5; d.polygon([(sc(cx),sc(y)-sc(r)),(sc(cx)+sc(r),sc(y)),(sc(cx),sc(y)+sc(r)),(sc(cx)-sc(r),sc(y))],fill=GOLD_L)
    def gframe(x0,y0,x1,y1): R(x0,y0,x1,y1,10,outline=GOLD,w=1.6); R(x0+6,y0+6,x1-6,y1-6,7,outline=GLINE,w=1)
    def paste(path,x,y,w):
        if not os.path.exists(path): return 0
        g=Image.open(path).convert("RGBA"); nw=sc(w); nh=int(nw*g.height/g.width)
        im.paste(g.resize((nw,nh),Image.LANCZOS),(sc(x),sc(y)),g.resize((nw,nh),Image.LANCZOS)); return nh/S
    def pastefit(path,x,y,maxw,maxh,align="center",valign="center"):
        if not os.path.exists(path): return (0,0)
        g=Image.open(path).convert("RGBA")
        s2=min(maxw/g.width,maxh/g.height); nw=max(1,int(g.width*s2*S)); nh=max(1,int(g.height*s2*S))
        g2=g.resize((nw,nh),Image.LANCZOS)
        px=sc(x)+{"left":0,"center":(sc(maxw)-nw)//2,"right":sc(maxw)-nw}[align]
        py=sc(y)+{"top":0,"center":(sc(maxh)-nh)//2,"bottom":sc(maxh)-nh}[valign]
        im.paste(g2,(px,py),g2); return (nw/S,nh/S)
    def wrap(s,f,maxw):
        words=s.split(); L=[]; cur=""
        for wd in words:
            t=(cur+" "+wd).strip()
            if tw(t,f)>maxw and cur: L.append(cur); cur=wd
            else: cur=t
        if cur: L.append(cur)
        return L
    def para(x,y,s,f,fill,maxw,lh):
        L=wrap(s,f,maxw)
        for i,li in enumerate(L): T(x,y+i*lh,li,f,fill)
        return y+len(L)*lh
    def flow(x,y,maxw,lh,f,fill,tokens,gcol=GLINE):
        # tokens: ("t",str) Textwort  |  ("gap",width) Lücke als Unterstrich
        cx=x; cy=y; sp=tw(" ",f)
        for kind,val in tokens:
            w=(tw(val,f) if kind=="t" else val)
            if cx+w>x+maxw and cx>x: cy+=lh; cx=x
            if kind=="t": T(cx,cy,val,f,fill)
            else: ln([(cx,cy+lh*0.66),(cx+w,cy+lh*0.66)],gcol,1.4)
            cx+=w+sp
        return cy+lh
    def gapsatz(x,y,maxw,lh,f,fill,pre,post,gapw=118):
        toks=[("t",wd) for wd in pre.split()]+[("gap",gapw)]+[("t",wd) for wd in post.split()]
        return flow(x,y,maxw,lh,f,fill,toks)
    def gaphoehe(maxw,lh,f,pre,post,gapw=118):
        """Wie hoch wird dieser Lueckensatz? Muss genauso umbrechen wie flow(),
        sonst rutscht der Satz spaeter unter den Rahmen, der fuer ihn gezeichnet wurde."""
        toks=[("t",wd) for wd in pre.split()]+[("gap",gapw)]+[("t",wd) for wd in post.split()]
        cx=0.0; zeilen=1; sp=tw(" ",f)
        for kind,val in toks:
            w=(tw(val,f) if kind=="t" else val)
            if cx+w>maxw and cx>0: zeilen+=1; cx=0.0
            cx+=w+sp
        return zeilen*lh
    def magnet(x,y,w,hh):
        R(x,y,x+w/2,y+hh,5,fill=RED); R(x+w/2,y,x+w,y+hh,5,fill=BLUE); R(x,y,x+w,y+hh,5,outline=INK,w=2)
        ln([(x+w/2,y),(x+w/2,y+hh)],INK,1); T(x+w/4,y+hh/2,"N",AVB(16),CREAM,anchor="mm"); T(x+3*w/4,y+hh/2,"S",AVB(16),CREAM,anchor="mm")
    def pole(x,y,w,hh,lab,col): R(x,y,x+w,y+hh,5,fill=col); R(x,y,x+w,y+hh,5,outline=INK,w=2); T(x+w/2,y+hh/2,lab,AVB(16),CREAM,anchor="mm")
    def arrow(x0,y,x1,col,w=2,hd=9):
        ln([(x0,y),(x1,y)],col,w); xd=1 if x1>=x0 else -1
        ln([(x1,y),(x1-xd*hd,y-hd*0.7)],col,w); ln([(x1,y),(x1-xd*hd,y+hd*0.7)],col,w)
    def darrow(cx,y,half=15,col=SUB,w=2,hd=8):
        ln([(cx-half,y),(cx+half,y)],col,w)
        for sg in (-1,1):
            ex=cx+sg*half; ln([(ex,y),(ex-sg*hd,y-hd*0.7)],col,w); ln([(ex,y),(ex-sg*hd,y+hd*0.7)],col,w)
    def stars(x,y,n=5,r=14):
        for i in range(n):
            cx=x+i*(r*2+9)
            pts=[(sc(cx+(r if k%2==0 else r*0.44)*math.cos(math.pi/2+k*math.pi/5)),sc(y-(r if k%2==0 else r*0.44)*math.sin(math.pi/2+k*math.pi/5))) for k in range(10)]
            d.polygon(pts,outline=GOLD,width=sc(2))
    def horseshoe(cx,cy,s=1.0):
        aw=70*s; gap=86*s; armH=200*s; Rr=gap/2+aw/2; top=cy-armH
        for k,ex in enumerate([1.0,1.32,1.7]):
            hw=Rr*ex; hh=(64+k*38)*s
            d.arc([sc(cx-hw),sc(top-hh),sc(cx+hw),sc(top+hh)],180,360,fill=(200,170,110,150-k*35),width=sc(1.4))
        d.arc([sc(cx-Rr),sc(cy-Rr),sc(cx+Rr),sc(cy+Rr)],88,182,fill=RED_D,width=sc(aw+6))
        d.arc([sc(cx-Rr),sc(cy-Rr),sc(cx+Rr),sc(cy+Rr)],-2,92,fill=BLUE_D,width=sc(aw+6))
        d.arc([sc(cx-Rr),sc(cy-Rr),sc(cx+Rr),sc(cy+Rr)],90,180,fill=RED,width=sc(aw))
        d.arc([sc(cx-Rr),sc(cy-Rr),sc(cx+Rr),sc(cy+Rr)],0,90,fill=BLUE,width=sc(aw))
        R(cx-gap/2-aw,top,cx-gap/2,cy,6,fill=RED,outline=RED_D,w=2); R(cx+gap/2,top,cx+gap/2+aw,cy,6,fill=BLUE,outline=BLUE_D,w=2)
        R(cx-gap/2-aw+8,top+8,cx-gap/2-aw+17,cy-18,4,fill=RED_L); R(cx+gap/2+aw-17,top+8,cx+gap/2+aw-8,cy-18,4,fill=BLUE_L)
        R(cx-gap/2-aw,top,cx-gap/2,top+16,4,fill=RED_D); R(cx+gap/2,top,cx+gap/2+aw,top+16,4,fill=BLUE_D)
        T(cx-gap/2-aw/2,top+42*s,"N",DIDOT(30*s),CREAM,anchor="mm"); T(cx+gap/2+aw/2,top+42*s,"S",DIDOT(30*s),CREAM,anchor="mm")
    def kompchip(xr,y,kuerzel,col=None,afb=None):
        """Kaertchen mit Kompetenzcode und Anforderungsbereich, rechtsbuendig bei xr.

        Es steht neben der Ueberschrift und nicht darunter - so ist der Bezug zum
        Kernlehrplan auf jeder Aufgabe sichtbar, ohne dass eine Zeile verloren geht.
        Der Anforderungsbereich sitzt durch eine Haarlinie getrennt daneben."""
        if not kuerzel: return 0
        f=AVB(12.5); fa=AVM(12); c=col or GOLD_D
        breite=tw(kuerzel,f)+22+((tw(afb,fa)+18) if afb else 0)
        R(xr-breite,y,xr,y+21,6,fill=(250,246,236),outline=c,w=1.1)
        if afb:
            trenn=xr-tw(afb,fa)-18
            ln([(trenn,y+3),(trenn,y+18)],c,1)
            T((trenn+xr)/2,y+11,afb,fa,c,anchor="mm")
            T((xr-breite+trenn)/2,y+11,kuerzel,f,c,anchor="mm")
        else:
            T(xr-breite/2,y+11,kuerzel,f,c,anchor="mm")
        return breite
    def numtab(x,y,n,col,title,komp=None,afb=None):
        R(x,y,x+50,y+50,9,fill=col); d.polygon([(sc(x+50),sc(y)),(sc(x+50),sc(y+13)),(sc(x+37),sc(y))],fill=tuple(max(0,c-40) for c in col))
        T(x+25,y+26,str(n),DIDOT(24),CREAM,anchor="mm")
        T(x+66,y+11,title,AVB(19.5),col); orn(x+66+tw(title,AVB(19.5))/2,y+41,tw(title,AVB(19.5))/2)
        if komp: kompchip(W-ML,y+13,komp,col,afb)
    for k,v in list(locals().items()):
        if callable(v): setattr(h,k,v)
    return h
def newp(bg=CREAM): im=Image.new("RGB",(sc(W),sc(H)),bg); return im,ImageDraw.Draw(im,"RGBA")

def footer(h,pn,acc):
    h.circ(ML+8,H-40,13,outline=GOLD,w=2); h.circ(ML+8,H-40,4,fill=GOLD)
    h.T(ML+34,H-48,"MAGNETISMUS · FORSCHERHEFT",COP(9),GOLD_D)
    h.R(W-ML-56,H-64,W-ML,H-22,8,fill=acc); h.T(W-ML-28,H-42,f"{pn:02d}",AVB(14),CREAM,anchor="mm")

def pagehead(h,eyebrow,title,ecol,tf=38):
    h.tracked(ML,84,eyebrow,COP(13),ecol,4,center=False)
    nf=DIDOT(tf)
    if h.tw(title,nf)>W-2*ML: nf=DIDOT(tf-6)
    h.T(ML,108,title,nf,INK); h.ln([(ML+2,168),(W-ML,168)],GLINE,1.4)

def atask(h,x,y,n,titel,acc,be=None,komp=None,afb=None):
    h.circ(x+16,y+16,16,fill=acc); h.T(x+16,y+17,str(n),AVB(15),CREAM,anchor="mm")
    h.T(x+44,y+4,titel,AVB(17.5),INK)
    xr=W-ML
    if be is not None: h.T(xr,y+7,f"/ {be} P",AVM(13),GOLD_D,anchor="ra"); xr-=h.tw(f"/ {be} P",AVM(13))+14
    if komp: h.kompchip(xr,y+6,komp,acc,afb)
    return y+42

def blk_lueck(h,x,y,saetze,gap=13,lh=33):
    for pre,post,_ in saetze: y=h.gapsatz(x,y,W-2*ML,lh,AV(16.5),INK,pre,post)+gap
    return y

def blk_rf(h,x,y,items,labels=("richtig","falsch"),gap=15):
    rx1=W-ML-206; rx2=W-ML-96
    h.T(rx1+13,y-4,labels[0],AVM(13),SUB,anchor="ma"); h.T(rx2+13,y-4,labels[1],AVM(13),SUB,anchor="ma")
    y+=24
    for aussage,_ in items:
        ey=h.para(x,y+2,aussage,AV(16.5),INK,rx1-x-18,27)
        h.R(rx1,y+1,rx1+27,y+28,6,outline=(150,160,175),w=2); h.R(rx2,y+1,rx2+27,y+28,6,outline=(150,160,175),w=2)
        y=max(ey,y+29)+gap
    return y

def blk_poles(h,x,y,rows,gap=54):
    for a,b,ca,cb,_ in rows:
        h.pole(x,y,52,36,a,ca); h.darrow(x+68,y+18,12); h.pole(x+84,y,52,36,b,cb)
        for j,lab in enumerate(["Anziehung","Abstoßung"]):
            ox=x+250+j*250; h.R(ox,y+5,ox+27,y+32,6,outline=(150,160,175),w=2); h.T(ox+38,y+7,lab,AV(16.5),INK)
        y+=gap
    return y

def blk_mc(h,x,y,frage,optionen,gap=14):
    y=h.para(x,y,frage,AVM(17),INK,W-2*ML,29)+10
    for opt in optionen:
        h.R(x,y+1,x+27,y+28,6,outline=(150,160,175),w=2)
        ey=h.para(x+42,y+3,opt,AV(16.5),INK,W-2*ML-58,27); y=max(y+29,ey)+gap
    return y

def blk_offen(h,x,y,prompt,zeilen,lh=40):
    y=h.para(x,y,prompt,AV(16.5),INK,W-2*ML,28)+24
    for k in range(zeilen): h.ln([(x,y+k*lh),(W-ML,y+k*lh)],GLINE,1.3)
    return y+(zeilen-1)*lh+20

def cover():
    im,d=newp(NAVYBG); h=hp(im,d)
    h.R(46,46,W-46,H-46,18,outline=GOLD,w=2); h.R(56,56,W-56,H-56,14,outline=GOLD_D,w=1)
    h.R(W/2-152,120,W/2+152,170,8,outline=GOLD,w=1.4); h.tracked(W/2,136,"FORSCHERHEFT PHYSIK",COP(14),GOLD_L,5)
    h.tracked(W/2,236,"MAGNETISMUS",DIDOT(70),GOLD_L,2)
    h.tracked(W/2,352,"FORSCHEN · VERSTEHEN · ANWENDEN",COP(15),GOLD,6); h.orn(W/2,404,130)
    # Stabmagnet mit Gold-Feldlinien (physikalisch korrekt)
    cxm,cym=W/2,720
    for rx,ry in [(210,88),(300,128),(410,178),(540,236)]:
        d.ellipse([sc(cxm-rx),sc(cym-ry),sc(cxm+rx),sc(cym+ry)],outline=(200,170,110,120),width=sc(1))
    mw,mh=300,86
    h.R(cxm-mw/2,cym-mh/2,cxm,cym+mh/2,8,fill=RED); h.R(cxm,cym-mh/2,cxm+mw/2,cym+mh/2,8,fill=BLUE)
    h.R(cxm-mw/2,cym-mh/2,cxm+mw/2,cym+mh/2,8,outline=(10,16,40),w=2)
    h.R(cxm-mw/2+12,cym-mh/2+10,cxm+mw/2-12,cym-mh/2+20,4,fill=(255,255,255,40))
    h.T(cxm-mw/4,cym,"N",DIDOT(44),CREAM,anchor="mm"); h.T(cxm+mw/4,cym,"S",DIDOT(44),CREAM,anchor="mm")
    h.R(W/2-160,1010,W/2+160,1064,27,outline=GOLD,w=1.6); h.tracked(W/2,1027,"5 FORSCHERKREISE · KLASSE 5",COP(14),GOLD_L,2)
    tx=W/2-440; step=880/4; cy=1180
    for i in range(1,5): h.ln([(tx+(i-1)*step+18,cy),(tx+i*step-18,cy)],(70,88,130),2)
    for i,(nn,lab) in enumerate([("1","FRAGE"),("2","VERMUTEN"),("3","FORSCHEN"),("4","SICHERN"),("5","ANWENDEN")]):
        cx=tx+i*step; h.circ(cx,cy,17,fill=NAVYBG,outline=(110,124,158),w=2); h.T(cx,cy+1,nn,AVB(13),GOLD_L,anchor="mm"); h.T(cx,cy+23,lab,COP(8.5),(150,162,190),anchor="ma")
    h.tracked(W/2,1330,"REALSCHULE NRW",COP(15),GOLD_L,6)
    h.tracked(W/2,1420,"Forschendes, kompetenzorientiertes Lernen",AVM(15),(180,190,214),1)
    h.tracked(W/2,1456,"nach dem Kernlehrplan Physik NRW",AVM(13),(140,152,180),1)
    h.orn(W/2,H-150,150)
    return fertig(im)

def topic(idx,pn):
    o=FK[idx]; tid=o["id"]; cfg=CFG[tid]; acc=TOPACC[idx]
    im,d=newp(CREAM); h=hp(im,d)
    # Kopf
    h.tracked(ML,84,f"FORSCHERKREIS 0{idx+1}",COP(13),acc,5,center=False)
    name=o["theme"].split("· ")[-1]; nf=DIDOT(38)
    if h.tw(name,nf)>W-2*ML: nf=DIDOT(31)
    h.T(ML,108,name,nf,INK); h.ln([(ML+2,168),(W-ML,168)],GLINE,1.4)
    h.tracked(W-ML,90,"MAGNETISMUS",COP(9),GOLD_D,2,center=False) if False else None
    y=196
    kd=KID.get(tid,{})
    # ① PROBLEM
    h.numtab(ML,y,1,STEP[0],"PROBLEM & FRAGE"); ty=y+52
    prob=kd.get("problem") or strip(o["problem"])
    ty=h.para(ML,ty,prob,AV(16),INK,W-2*ML-330,29)
    bx=W-ML-300; dy=y+86
    h.magnet(bx,dy,84,40); h.arrow(bx+94,dy+20,bx+120,SUB,2,8); h.T(bx+142,dy+20,"?",DIDOT(26),INK,anchor="mm"); h.arrow(bx+164,dy+20,bx+190,SUB,2,8); h.magnet(bx+200,dy,84,40)
    ty=max(ty,y+150)+10
    # Hervorgehobene Forscherfrage (Kindersprache) – klar als DIE Frage erkennbar
    frage=kd.get("frage") or strip(o["leitfrage"])
    qf=AVM(16.5); qmaxw=W-2*ML-118; ql=h.wrap(frage,qf,qmaxw)
    bh=max(62,28+len(ql)*27+12); tint=tuple(int(c+(255-c)*0.9) for c in STEP[0])
    h.R(ML,ty,W-ML,ty+bh,11,fill=tint,outline=STEP[0],w=1.6)
    h.circ(ML+40,ty+bh/2,19,fill=STEP[0]); h.T(ML+40,ty+bh/2+1,"?",AVB(20),CREAM,anchor="mm")
    h.tracked(ML+76,ty+13,"UNSERE FORSCHERFRAGE",COP(10.5),STEP[0],2,center=False)
    for i,li in enumerate(ql): h.T(ML+76,ty+30+i*27,li,qf,INK)
    y=ty+bh+20
    # ② VERMUTUNG
    h.numtab(ML,y,2,STEP[1],"DEINE VERMUTUNG"); ty=y+52
    h.T(ML,ty,"Formuliere eine Vermutung. Kreuze an oder schreibe auf.",AVM(15),INK)
    opts=kd.get("options") or ([x["label"] for x in o.get("predictOptions",[])][:2]) or ["Es wird angezogen.","Es bleibt liegen."]
    oy=ty+38
    for t in opts:
        h.R(ML,oy,ML+27,oy+27,6,outline=(150,160,175),w=2); ey2=h.para(ML+42,oy+2,t,AV(15),INK,W-2*ML-360,25); oy=max(oy+42,ey2+10)
    bx,by=W-ML-300,y+62
    d.ellipse([sc(bx),sc(by),sc(bx+280),sc(by+128)],fill=WHITE,outline=GLINE,width=sc(2))
    h.circ(bx+40,by+142,12,fill=WHITE,outline=GLINE,w=2); h.circ(bx+20,by+160,7,fill=WHITE,outline=GLINE,w=2)
    h.pole(bx+66,by+46,48,38,"N",RED); h.T(bx+140,by+65,"?",DIDOT(24),INK,anchor="mm"); h.pole(bx+166,by+46,48,38,"N",RED)
    h.T(ML,oy+4,"Begründe:",AVM(14),SUB); h.ln([(ML+104,oy+22),(W-ML-320,oy+22)],GLINE,1.2)
    y=oy+42
    # ③ FORSCHEN
    h.numtab(ML,y,3,STEP[2],"FORSCHEN – PROBIERE ES AUS"); ty=y+52
    for i,st in enumerate(cfg["f"]):
        h.circ(ML+14,ty+12,13,fill=STEP[2]); h.T(ML+14,ty+13,str(i+1),AVB(12),CREAM,anchor="mm")
        ny=h.para(ML+42,ty,st,AV(15),INK,W-2*ML-360,26)
        if "pp" in cfg and i<len(cfg["pp"]):
            a,b,ca,cb=cfg["pp"][i]; h.pole(W-ML-250,ty,46,34,a,ca); h.darrow(W-ML-184,ty+17,12); h.pole(W-ML-170,ty,46,34,b,cb)
        ty=max(ny,ty+44)+4
    # Digital testen (gerahmt, rechts QR)
    gf_y=ty+6; h.gframe(ML,gf_y,W-ML,gf_y+92)
    h.tracked(ML+30,gf_y+24,"DIGITAL TESTEN",COP(13),STEP[2],2,center=False)
    h.para(ML+30,gf_y+52,"Teste es in der Simulation – verändere und beobachte, was passiert.",AV(14),INK,W-2*ML-220,23)
    sp=os.path.join(IMG,f"qr_sim_{tid}.png")
    if os.path.exists(sp): h.R(W-ML-98,gf_y+16,W-ML-24,gf_y+80,6,fill=WHITE,outline=GLINE,w=1.2); h.paste(sp,W-ML-92,gf_y+22,62)
    y=gf_y+104
    # ④ SICHERN
    h.numtab(ML,y,4,STEP[3],"ORDNEN & SICHERN"); ty=y+52
    cols,rows=cfg["tab"]; tx0=ML; tx1=ML+540; th=44; rh=44; tot=th+len(rows)*rh; cw=(tx1-tx0)*0.5
    h.R(tx0,ty,tx1,ty+tot,8,outline=GLINE,w=1.4)
    h.T(tx0+16,ty+th/2,cols[0],AVB(13.5),INK,anchor="lm"); h.T(tx0+cw+16,ty+th/2,cols[1],AVB(13.5),INK,anchor="lm")
    h.ln([(tx0,ty+th),(tx1,ty+th)],GLINE,1.2); h.ln([(tx0+cw,ty),(tx0+cw,ty+tot)],GLINE,1.2)
    for i,rl in enumerate(rows):
        ry=ty+th+i*rh
        if i>0: h.ln([(tx0,ry),(tx1,ry)],(236,232,220),1)
        h.T(tx0+16,ry+rh/2,rl,AV(14),INK,anchor="lm")
    # merksatz box rechts
    mx=ML+566; h.gframe(mx,ty,W-ML,ty+tot)
    d.polygon([(sc(mx+30),sc(ty+22)-sc(10)),(sc(mx+30)+sc(9),sc(ty+22)),(sc(mx+30),sc(ty+22)+sc(10)),(sc(mx+30)-sc(9),sc(ty+22))],fill=GOLD)
    h.tracked(mx+50,ty+14,"DAS MUSST DU MITNEHMEN",COP(10.5),GOLD_D,2,center=False)
    for i,(pre,suf) in enumerate(cfg["mit"]):
        my=ty+54+i*48; h.T(mx+26,my,pre,AV(13.5),INK)
        px=mx+30+h.tw(pre,AV(13.5))+8; sw=h.tw(suf,AV(13.5)); rx=W-ML-26-sw-6
        h.ln([(px,my+20),(rx,my+20)],GLINE,1.3); h.T(rx+6,my,suf,AV(13.5),SUB)
    y=ty+tot+16
    # ⑤ AUFGABEN
    h.numtab(ML,y,5,STEP[4],"AUFGABEN – CHECK!"); ty=y+52
    task=cfg["auf"]; typ=task[0]
    if typ=="shortq":
        _,q,nl=task; ey=h.para(ML,ty,q,AVM(16),INK,W-2*ML,28)
        for k in range(nl): h.ln([(ML,ey+16+k*40),(W-ML,ey+16+k*40)],GLINE,1.2)
        ty=ey+16+nl*40
    elif typ=="checklist":
        _,q,its=task; ey=h.para(ML,ty,q,AVM(16),INK,W-2*ML,28); yy=ey+14
        for j,it2 in enumerate(its):
            r2,c2=divmod(j,2); ox=ML+c2*(W-2*ML)/2; oy=yy+r2*44
            h.R(ox,oy,ox+28,oy+28,6,outline=(150,160,175),w=2); h.T(ox+40,oy+3,it2,AV(15),INK)
        ty=yy+math.ceil(len(its)/2)*44
    elif typ=="checkrows":
        _,q,rws=task; h.T(ML,ty,q,AVM(16),INK); yy=ty+40
        for (a,b,ca,cb) in rws:
            h.pole(ML,yy,52,36,a,ca); h.darrow(ML+68,yy+18,12); h.pole(ML+84,yy,52,36,b,cb)
            for j,lab in enumerate(["Anziehung","Abstoßung"]):
                ox=ML+230+j*230; h.R(ox,yy+5,ox+26,yy+31,6,outline=(150,160,175),w=2); h.T(ox+36,yy+6,lab,AV(15),INK)
            yy+=46
        ty=yy
    elif typ=="drawbox":
        _,q,hh=task; ey=h.para(ML,ty,q,AVM(16),INK,W-2*ML,28); h.R(ML,ey+14,W-ML,ey+14+hh,10,fill=WHITE,outline=GLINE,w=1.4); ty=ey+14+hh
    y=ty+12
    # ALLTAG – größerer Rahmen: Bild passt hinein, Zeile 2 hat Schreibplatz
    ah=176
    h.gframe(ML,y,W-ML,y+ah)
    h.circ(ML+40,y+36,14,outline=STEP[4],w=2); h.T(ML+40,y+37,"i",AVB(15),STEP[4],anchor="mm")
    h.tracked(ML+74,y+28,"ALLTAG & ANWENDUNG",COP(13),STEP[4],2,center=False)
    h.para(ML+30,y+60,"Wo findest du im Alltag Magnete? Schreibe zwei Beispiele auf.",AV(15),INK,W-2*ML-280,24)
    lx=ML+30; lend=W-ML-250
    for k in range(2):
        ly=y+108+k*40; h.T(lx,ly-15,f"{k+1}.",AVB(15),INK); h.ln([(lx+30,ly),(lend,ly)],GLINE,1.3)
    al=ALLTAG.get(tid)
    if al: h.pastefit(os.path.join(IMG,f"fig_{al[0]}.png"),W-ML-214,y+20,182,ah-40)
    footer(h,pn,acc)
    return fertig(im)

def method():
    im,d=newp(NAVYBG); h=hp(im,d)
    h.R(46,46,W-46,H-46,18,outline=GOLD,w=2)
    h.tracked(W/2,152,"SO ARBEITEST DU IM FORSCHERKREIS",COP(16),GOLD_L,4); h.orn(W/2,204,150)
    h.T(W/2,252,"Fünf Schritte – auf jeder Forscherseite gleich.",AVM(17),(206,214,232),anchor="mm")
    steps=[("FRAGE","Wir starten mit einer spannenden Frage aus dem Alltag."),("VERMUTEN","Du überlegst und schreibst deine Vermutung auf."),
           ("FORSCHEN","Du probierst es aus und sammelst deine Beobachtungen."),("SICHERN","Wir ordnen die Ergebnisse und halten das Wichtigste fest."),
           ("ANWENDEN","Du überträgst dein Wissen in den Alltag und auf Neues.")]
    cx=214; y0=360; gap=222
    h.ln([(cx,y0+34),(cx,y0+(len(steps)-1)*gap+34)],(58,72,108),2)
    for i,(t,txt) in enumerate(steps):
        y=y0+i*gap
        h.R(cx-52,y-30,W-150,y+112,16,outline=(66,80,118),w=1.4)
        h.circ(cx,y+34,31,fill=NAVYBG,outline=GOLD,w=2); h.T(cx,y+35,str(i+1),DIDOT(30),GOLD_L,anchor="mm")
        h.T(cx+92,y+4,t,COCHIN(26),GOLD_L); h.para(cx+92,y+50,txt,AVM(16.5),(206,214,232),W-cx-262,30)
    yend=y0+(len(steps)-1)*gap+112
    h.orn(W/2,yend+64,150); h.tracked(W/2,yend+98,"NEUGIER IST DER ANFANG VON WISSEN.",COP(14),GOLD,3)
    return fertig(im)

def uebung(idx,pn):
    o=FK[idx]; tid=o["id"]; acc=TOPACC[idx]; ub=UEB_DATA[tid]
    im,d=newp(CREAM); h=hp(im,d)
    pagehead(h,f"ÜBEN & ANWENDEN · FORSCHERKREIS 0{idx+1}",o["theme"].split("· ")[-1],GOLD_D,34)
    y=208
    y=atask(h,ML,y,1,"Ergänze die Lückensätze.",acc); y=blk_lueck(h,ML,y,ub["lueck"])+48
    y=atask(h,ML,y,2,"Entscheide, ob die Aussagen stimmen. Kreuze an.",acc); y=blk_rf(h,ML,y,ub["rf"])+48
    fr,opts,ri=ub["mc"]; y=atask(h,ML,y,3,"Bestimme die richtige Antwort. Kreuze an.",acc); y=blk_mc(h,ML,y,fr,opts)+48
    pr,zl,_=ub["offen"]; y=atask(h,ML,y,4,"Erkläre in ganzen Sätzen.",acc); y=blk_offen(h,ML,y,pr,zl)+34
    h.gframe(ML,y,W-ML,y+128)
    h.circ(ML+40,y+34,14,outline=STEP[4],w=2); h.T(ML+40,y+35,"i",AVB(15),STEP[4],anchor="mm")
    h.tracked(ML+72,y+26,"MEIN SELBST-CHECK",COP(12),GOLD_D,2,center=False)
    h.para(ML+30,y+58,"Bewerte, wie sicher du dich fühlst. Male die Sterne an.",AV(14.5),INK,W-2*ML-330,24)
    h.stars(W-ML-206,y+68,5,14)
    h.T(ML+30,y+94,"Das möchte ich noch üben:",AVM(14),SUB); h.ln([(ML+250,y+110),(W-ML-30,y+110)],GLINE,1.2)
    footer(h,pn,acc)
    return fertig(im)

def make_gitter(words,size=13,seed=11):
    rnd=random.Random(seed); grid=[[None]*size for _ in range(size)]
    dirs=[(0,1),(1,0),(1,1),(-1,1)]; placed=[]
    for w in sorted(words,key=len,reverse=True):
        for _ in range(400):
            dr,dc=rnd.choice(dirs); L=len(w); r0=rnd.randrange(size); c0=rnd.randrange(size)
            r1=r0+dr*(L-1); c1=c0+dc*(L-1)
            if not(0<=r1<size and 0<=c1<size): continue
            if all(grid[r0+dr*i][c0+dc*i] in (None,w[i]) for i in range(L)):
                for i in range(L): grid[r0+dr*i][c0+dc*i]=w[i]
                placed.append(w); break
    A="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    for r in range(size):
        for c in range(size):
            if grid[r][c] is None: grid[r][c]=rnd.choice(A)
    return grid,placed

def make_crossword(entries):
    best=None
    for seed in range(60):
        rnd=random.Random(seed); ent=entries[:];
        ent=sorted(ent,key=lambda e:len(e[0]),reverse=True)
        if seed>0: rnd.shuffle(ent); ent=sorted(ent,key=lambda e:len(e[0]),reverse=True)
        grid={}; placed=[]
        def can(word,r,c,dr,dc):
            for i,ch in enumerate(word):
                rr,cc=r+dr*i,c+dc*i; cur=grid.get((rr,cc))
                if cur is not None:
                    if cur!=ch: return False
                else:
                    if dr==0:
                        if grid.get((rr-1,cc)) is not None or grid.get((rr+1,cc)) is not None: return False
                    else:
                        if grid.get((rr,cc-1)) is not None or grid.get((rr,cc+1)) is not None: return False
            if grid.get((r-dr,c-dc)) is not None or grid.get((r+dr*len(word),c+dc*len(word))) is not None: return False
            return True
        def put(word,clue,r,c,dr,dc):
            for i,ch in enumerate(word): grid[(r+dr*i,c+dc*i)]=ch
            placed.append((word,clue,r,c,'H' if dr==0 else 'V'))
        put(ent[0][0],ent[0][1],0,0,0,1)
        for word,clue in ent[1:]:
            done=False
            for i,ch in enumerate(word):
                for (pw,pcl,pr,pc,pdir) in placed:
                    for j,pch in enumerate(pw):
                        if pch!=ch: continue
                        if pdir=='H': r,c,dr,dc=pr-i,pc+j,1,0
                        else: r,c,dr,dc=pr+j,pc-i,0,1
                        if can(word,r,c,dr,dc): put(word,clue,r,c,dr,dc); done=True; break
                    if done: break
                if done: break
        minr=min(r for r,c in grid); minc=min(c for r,c in grid)
        ng={(r-minr,c-minc):ch for (r,c),ch in grid.items()}
        npl=[(w,cl,r-minr,c-minc,dr) for (w,cl,r,c,dr) in placed]
        maxr=max(r for r,c in ng)+1; maxc=max(c for r,c in ng)+1
        score=(len(placed),-(maxr*maxc))
        if best is None or score>best[0]: best=(score,ng,npl,maxr,maxc)
    return best[1],best[2],best[3],best[4]

def wortgitter(pn):
    im,d=newp(CREAM); h=hp(im,d)
    pagehead(h,"RÄTSEL · WORTGITTER","Finde die Magnet-Wörter",GOLD_D,36)
    h.para(ML,196,"Alle Wörter sind versteckt: waagerecht, senkrecht oder schräg. Kreise jedes Wort ein und hake es in der Liste ab.",AV(15),INK,W-2*ML,26)
    n=15; grid,placed=make_gitter(GITTER_WORDS,size=n)
    cell=64; gw=n*cell; gx=(W-gw)/2; gy=250
    h.R(gx-10,gy-10,gx+gw+10,gy+gw+10,12,fill=WHITE,outline=GLINE,w=1.4)
    for r in range(n):
        for c in range(n):
            h.T(gx+c*cell+cell/2,gy+r*cell+cell/2,grid[r][c],AVM(22),INK,anchor="mm")
    ly=gy+gw+40
    h.tracked(W/2,ly,"DIESE 12 WÖRTER SUCHST DU",COP(12),GOLD_D,3); ly+=32
    per=4; colw=(W-2*ML)/per
    for i,w in enumerate(GITTER_WORDS):
        r2,c2=divmod(i,per); ox=ML+c2*colw+24; oy=ly+r2*48
        h.R(ox,oy,ox+23,oy+23,5,outline=(150,160,175),w=2); h.T(ox+33,oy+1,w,AVM(15),INK)
    footer(h,pn,STEP[2])
    return fertig(im)

def kreuzwort(pn):
    im,d=newp(CREAM); h=hp(im,d)
    pagehead(h,"RÄTSEL · KREUZWORTRÄTSEL","Kreuzworträtsel",GOLD_D,36)
    h.para(ML,196,"Trage die passenden Wörter ein. Die Zahlen zeigen, wo ein Wort beginnt. Die Tipps stehen unter dem Gitter.",AV(15),INK,W-2*ML,26)
    grid,placed,nr,nc=make_crossword(RAETSEL)
    starts={}
    for (w,cl,r,c,dr) in placed: starts.setdefault((r,c),[]).append((dr,w,cl))
    ordered=sorted(starts.keys(),key=lambda rc:(rc[0],rc[1]))
    num={rc:i+1 for i,rc in enumerate(ordered)}
    across=[]; down=[]
    for (w,cl,r,c,dr) in placed: (across if dr=='H' else down).append((num[(r,c)],w,cl))
    across.sort(); down.sort()
    cell=min(62,int((W-2*ML-40)/nc)); gw=nc*cell; gh=nr*cell; gx=(W-gw)/2; gy=252
    for (r,c),ch in grid.items():
        cxp=gx+c*cell; cyp=gy+r*cell
        h.R(cxp,cyp,cxp+cell,cyp+cell,3,fill=WHITE,outline=(150,160,175),w=1.4)
        if (r,c) in num: h.T(cxp+4,cyp+2,str(num[(r,c)]),AVB(11),GOLD_D)
    cy0=gy+gh+44; colx=[ML,W/2+16]; cw=W/2-ML-20
    def cluelist(ci,title,items,yy):
        h.tracked(colx[ci],yy,title,COP(13),GOLD_D,3,center=False); yy+=30
        for n2,w,cl in items:
            h.T(colx[ci],yy,f"{n2}.",AVB(13.5),INK); yy=h.para(colx[ci]+30,yy,cl,AV(13.5),INK,cw-30,21)+11
        return yy
    cluelist(0,"WAAGERECHT",across,cy0); cluelist(1,"SENKRECHT",down,cy0)
    footer(h,pn,STEP[2])
    return fertig(im)

def testprep(pn):
    VOCAB=[("Magnetfeld","der unsichtbare Bereich rund um den Magneten"),
     ("Nordpol / Südpol","die beiden Enden von jedem Magneten"),
     ("anziehen","ungleiche Pole (N und S) halten zusammen"),
     ("abstoßen","gleiche Pole (N–N oder S–S) drücken sich weg"),
     ("magnetisch","nur Eisen, Nickel und Kobalt"),
     ("Kompass","seine Nadel zeigt immer nach Norden")]
    im,d=newp(CREAM); h=hp(im,d)
    pagehead(h,"VOR DEM TEST","Bereite dich auf den Test vor",GOLD_D,34)
    y=206
    y=atask(h,ML,y,1,"Prüfe, was du schon kannst. Hake ehrlich ab.",STEP[3])
    for s in PREP["kannIch"]:
        h.R(ML,y+1,ML+27,y+28,6,outline=(150,160,175),w=2)
        y=max(y+29,h.para(ML+42,y+4,s,AV(14.5),INK,W-2*ML-58,25))+17
    y+=26
    y=atask(h,ML,y,2,"Diese Wörter musst du kennen.",STEP[3])
    for i,(term,defi) in enumerate(VOCAB):
        r2,c2=divmod(i,2); ox=ML+c2*(W/2-ML+8); oy=y+r2*50
        h.circ(ox+7,oy+11,4,fill=GOLD); h.T(ox+22,oy,term,AVB(14),INK)
        h.T(ox+22,oy+22,defi,AV(13),SUB)
    y=y+((len(VOCAB)+1)//2)*50+24
    y=atask(h,ML,y,3,"So übst du richtig.",STEP[3])
    bh=32+len(PREP["tipps"])*50; h.gframe(ML,y,W-ML,y+bh); yy=y+24
    for t in PREP["tipps"]:
        h.circ(ML+32,yy+9,4,fill=GOLD); yy=h.para(ML+54,yy,t,AV(15),INK,W-2*ML-92,25)+21
    y=y+bh+28
    y=atask(h,ML,y,4,"Prüfe dich selbst mit diesen Fragen.",STEP[3])
    for i,(q,_) in enumerate(PREP["mini"]):
        h.circ(ML+13,y+12,12,fill=STEP[3]); h.T(ML+13,y+13,str(i+1),AVB(12),CREAM,anchor="mm")
        yy=h.para(ML+40,y,q,AV(14.5),INK,W-2*ML-40,25)+12
        h.ln([(ML+40,yy+10),(W-ML,yy+10)],GLINE,1.2); h.ln([(ML+40,yy+46),(W-ML,yy+46)],GLINE,1.2)
        y=yy+66
    h.T(ML,y+2,"Die Lösungen findest du auf der letzten Seite.",AVM(13),SUB)
    footer(h,pn,STEP[3])
    return fertig(im)

def test_head(h):
    h.tracked(ML,84,"SCHRIFTLICHE ÜBERPRÜFUNG",COP(13),STEP[0],4,center=False)
    h.T(ML,108,"Test: Magnetismus",DIDOT(38),INK); h.ln([(ML+2,168),(W-ML,168)],GLINE,1.4)
    h.gframe(ML,186,W-ML,262)
    h.T(ML+28,206,"Name:",AVM(14),INK); h.ln([(ML+92,224),(ML+400,224)],GLINE,1.2)
    h.T(ML+430,206,"Klasse: 5",AVM(14),INK); h.ln([(ML+540,224),(ML+660,224)],GLINE,1.2)
    h.T(ML+690,206,"Datum:",AVM(14),INK); h.ln([(ML+766,224),(W-ML-210,224)],GLINE,1.2)
    h.R(W-ML-186,196,W-ML-20,252,8,outline=GOLD,w=1.6)
    h.T(W-ML-103,210,"Punkte",AVM(12),GOLD_D,anchor="ma"); h.T(W-ML-103,224,f"____ / {sum(TEST['pts'])}",AVB(16),INK,anchor="ma")
    return 288

def test1(pn):
    im,d=newp(CREAM); h=hp(im,d); p=TEST["pts"]
    y=test_head(h)+8
    y=atask(h,ML,y,1,"Ergänze die Lücken.",STEP[0],p[0]); y=blk_lueck(h,ML,y+4,TEST["a1"],gap=28,lh=34)+44
    y=atask(h,ML,y,2,"Entscheide, ob die Stoffe magnetisch sind. Kreuze an.",STEP[0],p[1]); y=blk_rf(h,ML,y,TEST["a2"],labels=("ja","nein"),gap=26)+44
    y=atask(h,ML,y,3,"Bestimme, ob sich die Pole anziehen oder abstoßen.",STEP[0],p[2]); y=blk_poles(h,ML,y+10,TEST["a3"],gap=68)
    footer(h,pn,STEP[0])
    return fertig(im)

def test2(pn):
    im,d=newp(CREAM); h=hp(im,d); p=TEST["pts"]
    h.tracked(ML,88,"TEST: MAGNETISMUS · SEITE 2",COP(12),STEP[0],3,center=False); h.ln([(ML+2,116),(W-ML,116)],GLINE,1.4)
    y=152
    y=atask(h,ML,y,4,"Stelle einen Stabmagneten mit Feldlinien dar.",STEP[0],p[3])
    h.para(ML,y,"Male den Nordpol rot (N) und den Südpol blau (S). Zeichne vier Feldlinien. Sie gehen außen von N nach S.",AV(14.5),INK,W-2*ML,24)
    h.R(ML,y+56,W-ML,y+56+236,10,fill=WHITE,outline=GLINE,w=1.4); y=y+56+236+38
    fr,opts,ri=TEST["a5"]; y=atask(h,ML,y,5,"Bestimme die richtige Antwort. Kreuze an.",STEP[0],p[4]); y=blk_mc(h,ML,y,fr,opts,gap=18)+38
    q6,z6,_=TEST["a6"]; y=atask(h,ML,y,6,"Erkläre in ganzen Sätzen.",STEP[0],p[5]); y=blk_offen(h,ML,y,q6,3,lh=46)+38
    q7,z7,_=TEST["a7"]; y=atask(h,ML,y,7,"Wende dein Wissen auf eine neue Situation an.",STEP[0],p[6]); y=blk_offen(h,ML,y,q7,3,lh=46)+34
    # Notenspiegel
    h.gframe(ML,y,W-ML,y+92); h.tracked(ML+30,y+20,"NOTENSPIEGEL",COP(11),GOLD_D,2,center=False)
    scale=[("1","23–21"),("2","20–17"),("3","16–13"),("4","12–9"),("5","8–5"),("6","4–0")]
    cwd=(W-2*ML-56)/6
    for i,(no,pk) in enumerate(scale):
        cx=ML+28+i*cwd
        if i>0: h.ln([(cx-2,y+40),(cx-2,y+80)],GLINE,1)
        h.T(cx+cwd/2,y+44,"Note "+no,AVB(14),INK,anchor="ma"); h.T(cx+cwd/2,y+66,pk+" P",AV(12.5),SUB,anchor="ma")
    h.orn(W/2,H-104,140); h.tracked(W/2,H-88,"VIEL ERFOLG – DU SCHAFFST DAS!",COP(13),GOLD_D,3)
    footer(h,pn,STEP[0])
    return fertig(im)

def loesungen(pn):
    im,d=newp(CREAM); h=hp(im,d)
    pagehead(h,"FÜR ELTERN & LEHRKRÄFTE","Lösungen",GOLD_D,36)
    colx=[ML,W/2+16]; cw=W/2-ML-16; y0=200; y=[y0,y0]
    def head(ci,t): h.tracked(colx[ci],y[ci],t,COP(12),GOLD_D,2,center=False); y[ci]+=24
    def line(ci,t,f=None): y[ci]=h.para(colx[ci],y[ci],t,f or AV(12.5),INK,cw,19)+6
    rf=lambda items:", ".join(("R" if b else "F") for _,b in items)
    for idx,tid in enumerate([o["id"] for o in FK]):
        ub=UEB_DATA[tid]; ci=0 if idx<3 else 1
        head(ci,f"ÜBUNG 0{idx+1} · {FK[idx]['theme'].split('· ')[-1].upper()}")
        line(ci,"Lücken: "+", ".join(l[2] for l in ub["lueck"]))
        line(ci,"Richtig/Falsch: "+rf(ub["rf"]))
        line(ci,"Multiple Choice: "+ub["mc"][1][ub["mc"][2]])
        y[ci]+=6
    # Rätsel-Lösungen (linke Spalte)
    grid,placed,nr,nc=make_crossword(RAETSEL)
    ordered=sorted({(r,c) for (w,cl,r,c,dr) in placed},key=lambda rc:(rc[0],rc[1]))
    num={rc:i+1 for i,rc in enumerate(ordered)}
    aw=sorted((num[(r,c)],w) for (w,cl,r,c,dr) in placed if dr=='H')
    dw=sorted((num[(r,c)],w) for (w,cl,r,c,dr) in placed if dr=='V')
    head(0,"RÄTSEL · LÖSUNGEN")
    line(0,"Kreuzworträtsel waagerecht: "+", ".join(f"{n} {w}" for n,w in aw))
    line(0,"Kreuzworträtsel senkrecht: "+", ".join(f"{n} {w}" for n,w in dw))
    line(0,"Wortgitter: "+", ".join(GITTER_WORDS))
    ci=1
    head(ci,"TEST · LÖSUNGEN")
    line(ci,"1) "+", ".join(l[2] for l in TEST["a1"]))
    line(ci,"2) magnetisch: "+", ".join(g for g,b in TEST["a2"] if b)+"  —  nicht: "+", ".join(g for g,b in TEST["a2"] if not b))
    line(ci,"3) N-S Anziehung · S-S Abstoßung · N-N Abstoßung")
    line(ci,"5) "+TEST["a5"][1][TEST["a5"][2]])
    line(ci,"6) "+TEST["a6"][2])
    line(ci,"7) "+TEST["a7"][2])
    footer(h,pn,GOLD_D)
    return fertig(im)

if __name__=="__main__":
    pages=[cover(),method()]
    pn=3
    for i in range(len(FK)):
        pages.append(topic(i,pn)); pn+=1
        pages.append(uebung(i,pn)); pn+=1
    for fn in (wortgitter,kreuzwort,testprep,test1,test2,loesungen):
        pages.append(fn(pn)); pn+=1
    for i,p in enumerate(pages): p.save(os.path.join(HERE,f"final_p{i+1}.png"))
    out=os.path.expanduser("~/Desktop/Magnetismus_Forscherheft_GOLD.pdf")
    pages[0].save(out,"PDF",resolution=150,save_all=True,append_images=pages[1:])
    print("SAVED",out,"| Seiten:",len(pages))
