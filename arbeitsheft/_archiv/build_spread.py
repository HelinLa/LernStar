# -*- coding: utf-8 -*-
"""Forscher-Look: pro Thema eine Konzept-Seite + eine Übungsseite (Portrait, große Schrift)."""
import os, json, math, re, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont
HERE=os.path.dirname(__file__); IMG=os.path.join(HERE,"img")
SF="/System/Library/Fonts/Supplemental/"
S=2; W,H=1240,1754
def sc(v): return int(round(v*S))
def _f(p,pt,i=0): return ImageFont.truetype(p,int(pt*S),index=i)
def _futura(pt):
    for i in range(8):
        try:
            f=_f(SF+"Futura.ttc",pt,i)
            if "Bold" in f.getname()[1] and "Cond" not in f.getname()[1]: return f
        except: break
    return _f(SF+"Avenir Next.ttc",pt,0)
def TITLE(pt): return _futura(pt)
def AVB(pt): return _f(SF+"Avenir Next.ttc",pt,0)
def AV(pt):  return _f(SF+"Avenir Next.ttc",pt,7)
def AVM(pt): return _f(SF+"Avenir Next.ttc",pt,5)
CREAM=(253,252,248); WHITE=(255,255,255); INK=(30,40,58); SUB=(108,117,136)
NAVY=(22,38,74); TEAL=(21,143,134); PURPLE=(107,91,208); GOLD=(211,148,38); RED=(214,70,58); BLUE=(46,95,192)
TINT={NAVY:(238,241,247),PURPLE:(240,238,251),TEAL:(230,244,242),GOLD:(252,243,225),RED:(251,237,235),BLUE:(234,241,251)}
LINE=(212,216,226); STEEL=(150,160,175)
TOPACC=[TEAL,RED,PURPLE,BLUE,GOLD]
ML=48

FK=json.loads(open(os.path.join(HERE,"..","fk-magnet.js"),encoding="utf-8").read().split("=",1)[1].rstrip().rstrip(";"))
strip=lambda s: re.sub(r"\s+"," ",re.sub("<[^>]+>","",s or "")).strip()
ALLTAG={"magnete-felder":("fridge","Kühlschrankmagnet"),"magnet-stoffe":("crane","Schrott-Kran"),
 "magnetpole":("closure","Taschenverschluss"),"magnetfeld":("u_mrt","MRT"),"kompass":("hiking","Wandern")}
CFG={
 "magnete-felder":{"hero":"barmagnet","f_intro":"Untersuche, ob ein Magnet auch ohne Berührung wirkt.",
  "forschen":["Nähere einen Magneten langsam einer Büroklammer. Wann bewegt sie sich?","Schiebe ein Blatt Papier dazwischen. Wirkt der Magnet immer noch?"],
  "mit":[("Um jeden Magneten liegt ein",""),("Der Magnet wirkt auch ohne","")],
  "auf":("shortq","Erkläre mit dem Wort Magnetfeld, warum ein Magnet ohne Berührung wirkt.",2)},
 "magnet-stoffe":{"hero":"attract","f_intro":"Prüfe verschiedene Gegenstände mit einem Magneten.",
  "forschen":["Halte den Magneten an Nagel, Aludose, Büroklammer und Holz.","Sortiere: Was wird angezogen, was nicht?"],
  "mit":[("Magnetisch sind nur Eisen, Nickel und",""),("„Metall“ ist nicht dasselbe wie","")],
  "auf":("checklist","Kreuze an, welche Gegenstände ein Magnet anzieht:",["Eisennagel","Büroklammer (Stahl)","Aludose","Kupferdraht"])},
 "magnetpole":{"hero":"poles","f_intro":"Untersuche, wie sich verschiedene Pole zueinander verhalten.",
  "pp":[("N","N",RED,RED),("N","S",RED,BLUE),("S","S",BLUE,BLUE)],
  "forschen":["Nähere die Pole N–N, dann N–S, dann S–S.","Achte genau: ziehen sie sich an oder stoßen sie sich ab?"],
  "mit":[("Gleiche Pole (N–N oder S–S)","sich."),("Ungleiche Pole (N–S)","sich.")],
  "auf":("checkrows","Anziehung oder Abstoßung? Kreuze an.",[("N","S",RED,BLUE),("S","N",BLUE,RED),("N","N",RED,RED)])},
 "magnetfeld":{"hero":"fieldlines","f_intro":"Mach das unsichtbare Magnetfeld sichtbar.",
  "forschen":["Streue Eisenspäne auf ein Blatt über einem Magneten. Klopfe leicht.","Bewege eine Kompassnadel langsam um den Magneten herum."],
  "mit":[("Feldlinien laufen außen vom Nordpol zum",""),("Wo die Linien dicht liegen, ist das Feld","")],
  "auf":("drawbox","Zeichne einen Stabmagneten mit vier Feldlinien (außen von N nach S).",190)},
 "kompass":{"hero":"compass","f_intro":"Untersuche, wohin die Kompassnadel zeigt.",
  "forschen":["Dreh dich mit dem Kompass im Kreis – wohin zeigt die Nadel?","Halte ihn in Sonne und Schatten. Nähere dann einen Magneten."],
  "mit":[("Die Kompassnadel ist selbst ein kleiner",""),("Sie richtet sich im","der Erde aus.")],
  "auf":("shortq","Erkläre, warum die Kompassnadel nach Norden zeigt. Nutze: Magnet, Erdmagnetfeld.",2)},
}
# Übungsaufgaben je Thema
AUF={
 "magnete-felder":[("gallery","Wo stecken Magnete im Alltag? Schreibe zu jedem Bild, was der Magnet tut.",[("fridge","Kühlschrank"),("u_fishing","Angelspiel"),("u_letters","Magnetbuchstaben"),("u_knife","Messerleiste"),("u_board","Magnettafel"),("compass","Kompass")]),
  ("image","nailpoles","Eine Büroklammer wird an verschiedene Stellen gehalten. Wo hält sie am besten? Beschreibe.",2),
  ("claim","Mia","Ein Magnet wirkt erst, wenn er etwas berührt.","Stimmst du ihr zu? Begründe.",2)],
 "magnet-stoffe":[("table",["Magnetisch (wird angezogen)","Nicht magnetisch"],5,"Prüfe die Gegenstände mit einem Magneten und ordne sie ein."),
  ("image","coin","Eine 1-Cent-Münze hat eine Kupfer-Oberfläche – Kupfer ist nicht magnetisch. Trotzdem hält sie am Magneten. Erkläre.",2),
  ("claim","Lukas","Ein Magnet zieht alle Metalle an.","Stimmst du ihm zu? Begründe.",2)],
 "magnetpole":[("drawpoles","Trage die Pole ein, damit sich die Magnete anziehen (Nordpol rot, Südpol blau).",[("N",RED),("blank",None),("blank",None),("S",BLUE)]),
  ("drawpoles","Jetzt so, dass sie sich abstoßen.",[("blank",None),("blank",None),("blank",None),("blank",None)]),
  ("shortq","Formuliere eine allgemeine Regel: Wann ziehen sich zwei Magnete an, wann stoßen sie sich ab?",2)],
 "magnetfeld":[("drawbox","Zeichne einen Stabmagneten mit Nord- und Südpol und vier Feldlinien (außen von N nach S). An den Polen dicht, weiter weg weiter auseinander.",200),
  ("image","filings","Streut man Eisenspäne über einen Magneten, ordnen sie sich zu Bögen. Was zeigen sie – und was nicht?",2),
  ("claim","Ein Mitschüler","Zwischen den Feldlinien ist nichts.","Stimmt das? Begründe mit deiner Beobachtung.",2)],
 "kompass":[("gallery","Wobei hilft Kompass und Magnetsinn im echten Leben? Schreibe zu jedem Bild dazu.",[("hiking","Wandern"),("u_ship","Seefahrt"),("u_birds","Zugvögel")]),
  ("shortq","Erkläre, warum die Kompassnadel nach Norden zeigt. Nutze: kleiner Magnet, Erdmagnetfeld, ausrichten.",3),
  ("claim","Lena","Der Kompass zeigt zur Sonne.","Wie kannst du prüfen, ob Lena recht hat?",2)],
}

def helpers(im,d,tid=None):
    h=type("H",(),{})()
    def R(x0,y0,x1,y1,r,fill=None,outline=None,w=0): d.rounded_rectangle([sc(x0),sc(y0),sc(x1),sc(y1)],radius=sc(r),fill=fill,outline=outline,width=(sc(w) if w else 0))
    def T(x,y,s,f,fill,anchor="la"): d.text((sc(x),sc(y)),s,font=f,fill=fill,anchor=anchor)
    def twf(s,f): return d.textlength(s,font=f)/S
    def circ(cx,cy,r,fill=None,outline=None,w=0): d.ellipse([sc(cx-r),sc(cy-r),sc(cx+r),sc(cy+r)],fill=fill,outline=outline,width=(sc(w) if w else 0))
    def ln(p,fill,w=1): d.line([(sc(a),sc(b)) for a,b in p],fill=fill,width=sc(w))
    def darrow(cx,y,half=16,col=SUB,w=2,hd=8):
        ln([(cx-half,y),(cx+half,y)],col,w)
        for sg in (-1,1):
            ex=cx+sg*half; ln([(ex,y),(ex-sg*hd,y-hd*0.7)],col,w); ln([(ex,y),(ex-sg*hd,y+hd*0.7)],col,w)
    def pole(x,y,w,hh,lab,col): R(x,y,x+w,y+hh,5,fill=col); R(x,y,x+w,y+hh,5,outline=INK,w=2); T(x+w/2,y+hh/2,lab,AVB(17),WHITE,anchor="mm")
    def magnet(x,y,w,hh):
        R(x,y,x+w/2,y+hh,5,fill=RED); R(x+w/2,y,x+w,y+hh,5,fill=BLUE); R(x,y,x+w,y+hh,5,outline=INK,w=2)
        ln([(x+w/2,y),(x+w/2,y+hh)],INK,1); T(x+w/4,y+hh/2,"N",AVB(17),WHITE,anchor="mm"); T(x+3*w/4,y+hh/2,"S",AVB(17),WHITE,anchor="mm")
    def paste(path,x,y,w):
        if not os.path.exists(path): return 0
        g=Image.open(path).convert("RGBA"); nw=sc(w); nh=int(nw*g.height/g.width)
        gg=g.resize((nw,nh),Image.LANCZOS); im.paste(gg,(sc(x),sc(y)),gg); return nh/S
    def wrap(s,f,maxw):
        out=[]; cur=""
        for wd in s.split():
            t=(cur+" "+wd).strip()
            if twf(t,f)>maxw and cur: out.append(cur); cur=wd
            else: cur=t
        if cur: out.append(cur)
        return out
    def para(x,y,s,f,fill,maxw,lh):
        L=wrap(s,f,maxw)
        for i,li in enumerate(L): T(x,y+i*lh,li,f,fill)
        return y+len(L)*lh
    def stars(x,y,n=5,r=15):
        for i in range(n):
            cx=x+i*(r*2+10)
            pts=[(sc(cx+(r if k%2==0 else r*0.44)*math.cos(math.pi/2+k*math.pi/5)),sc(y-(r if k%2==0 else r*0.44)*math.sin(math.pi/2+k*math.pi/5))) for k in range(10)]
            d.polygon(pts,outline=GOLD,width=sc(2))
    def i_target(cx,cy,c): circ(cx,cy,12,outline=c,w=2); circ(cx,cy,7,outline=c,w=2); circ(cx,cy,2.5,fill=c)
    def i_bulb(cx,cy,c): circ(cx,cy-2,10,outline=c,w=2); R(cx-6,cy+7,cx+6,cy+13,2,fill=c)
    def i_eye(cx,cy,c): d.arc([sc(cx-13),sc(cy-9),sc(cx+13),sc(cy+9)],0,360,fill=c,width=sc(2)); circ(cx,cy,4.5,fill=c)
    def i_flask(cx,cy,c): ln([(cx-4,cy-11),(cx-4,cy-2),(cx-10,cy+10),(cx+10,cy+10),(cx+4,cy-2),(cx+4,cy-11)],c,2); ln([(cx-7,cy-11),(cx+7,cy-11)],c,2)
    def i_clip(cx,cy,c):
        R(cx-10,cy-12,cx+10,cy+12,3,outline=c,w=2); R(cx-4,cy-15,cx+4,cy-9,2,fill=c)
        for yy in (-2,4): ln([(cx-6,cy+yy),(cx+6,cy+yy)],c,2)
    def i_star(cx,cy,c):
        pts=[(sc(cx+(12 if k%2==0 else 5.5)*math.cos(math.pi/2+k*math.pi/5)),sc(cy-(12 if k%2==0 else 5.5)*math.sin(math.pi/2+k*math.pi/5))) for k in range(10)]
        d.polygon(pts,fill=c)
    def i_globe(cx,cy,c): circ(cx,cy,12,outline=c,w=2); d.arc([sc(cx-5),sc(cy-12),sc(cx+5),sc(cy+12)],0,360,fill=c,width=sc(2)); ln([(cx-12,cy),(cx+12,cy)],c,2)
    def card(x0,y0,x1,y1,col): R(x0,y0,x1,y1,18,fill=TINT[col],outline=col,w=1.8)
    def head(x,y,n,label,col,icon):
        R(x,y,x+48,y+48,10,fill=col); T(x+24,y+25,str(n),TITLE(23),WHITE,anchor="mm")
        icon(x+74,y+24,col); T(x+98,y+13,label,AVB(17),INK)
    def hbar(idx,name,right):
        d.polygon([(sc(0),sc(18)),(sc(W),sc(18)),(sc(W),sc(104)),(sc(0),sc(104))],fill=NAVY)
        circ(58,62,20,outline=GOLD,w=3); circ(58,62,4,fill=GOLD)
        for a in (30,150,270): ln([(58+22*math.cos(math.radians(a)),62+9*math.sin(math.radians(a))),(58-22*math.cos(math.radians(a)),62-9*math.sin(math.radians(a)))],GOLD,1)
        T(94,42,f"FORSCHERKREIS 0{idx+1}",AVB(12),GOLD); T(94,60,name.upper(),TITLE(19),WHITE); right()
    def sim_qr(x,y):
        p=os.path.join(IMG,f"qr_sim_{tid}.png")
        if os.path.exists(p): R(x-4,y-4,x+74,y+74,8,fill=WHITE,outline=LINE,w=1.4); paste(p,x,y,66)
    for k,v in list(locals().items()):
        if callable(v) and k not in ("h",): setattr(h,k,v)
    return h

def concept_page(idx):
    o=FK[idx]; tid=o["id"]; cfg=CFG[tid]; acc=TOPACC[idx]
    im=Image.new("RGB",(sc(W),sc(H)),CREAM); d=ImageDraw.Draw(im,"RGBA"); h=helpers(im,d,tid)
    R,T,twf,circ,ln,darrow,pole,magnet,paste,wrap,para,stars=h.R,h.T,h.twf,h.circ,h.ln,h.darrow,h.pole,h.magnet,h.paste,h.wrap,h.para,h.stars
    card,head,hbar,sim_qr=h.card,h.head,h.hbar,h.sim_qr
    def right_tracker():
        items=[("1","FRAGE"),("2","VERMUTEN"),("3","FORSCHEN"),("4","SICHERN"),("5","ANWENDEN")]
        tx=560; step=(W-40-tx)/4
        for i in range(1,5): ln([(tx+(i-1)*step+15,62),(tx+i*step-15,62)],(70,90,130),2)
        for i,(nn,lab) in enumerate(items):
            cx=tx+i*step; act=(i==2)
            circ(cx,62,14,fill=(TEAL if act else (40,58,96)),outline=(TEAL if act else (90,108,145)),w=2)
            T(cx,63,nn,AVB(12),WHITE,anchor="mm"); T(cx,82,lab,AVB(8.5),(TEAL if act else (150,162,190)),anchor="ma")
    hbar(idx,o["shortName"],right_tracker)
    name=o["theme"].split("· ")[-1]; nf=TITLE(40)
    if twf(name,nf)>W-2*ML: nf=TITLE(34)
    yy=para(ML,128,name,nf,INK,W-2*ML,54); ln([(ML+2,yy+10),(ML+230,yy+10)],acc,5)
    h.i_target(ML+14,262,GOLD); T(ML+38,248,"DEINE MISSION",AVB(14),GOLD)
    para(ML+38,272,"Finde heraus: "+strip(o["leitfrage"]),AVM(15),INK,W-2*ML-30,26)
    y=326
    card(ML,y,W-ML,y+176,NAVY); head(ML+22,y+18,1,"PROBLEM & FRAGE",NAVY,h.i_eye)
    para(ML+38,y+82,strip(o["problem"]),AVM(15),INK,W-2*ML-70,30)
    p=os.path.join(IMG,f"qr_video_{tid}.png")
    if os.path.exists(p): R(W-ML-84,y+18,W-ML-14,y+88,8,fill=WHITE,outline=LINE,w=1.4); paste(p,W-ML-78,y+24,58)
    y+=186
    card(ML,y,W-ML,y+192,PURPLE); head(ML+22,y+18,2,"DEINE VERMUTUNG",PURPLE,h.i_bulb)
    opts=[x["label"] for x in o.get("predictOptions",[])][:2] or ["Eisennagel","Aludose"]
    T(ML+38,y+80,"Was glaubst du? Kreuze an oder schreibe auf.",AVM(14),INK)
    for i,t in enumerate(opts):
        oy=y+114+i*42; R(ML+38,oy,ML+64,oy+26,6,outline=STEEL,w=2); T(ML+78,oy+2,wrap(t,AVM(14),820)[0],AVM(14),INK)
    pole(W-ML-190,y+92,56,44,"N",RED); T(W-ML-118,y+114,"?",TITLE(24),INK,anchor="mm"); pole(W-ML-100,y+92,56,44,"N",RED)
    y+=202
    card(ML,y,W-ML,y+218,TEAL); head(ML+22,y+18,3,"FORSCHEN – PROBIERE ES AUS",TEAL,h.i_flask)
    para(ML+38,y+82,"So geht's: "+cfg["f_intro"],AVM(14.5),INK,W-2*ML-200,26)
    fy=y+140
    for st in cfg["forschen"]:
        circ(ML+50,fy+11,7,fill=TEAL); fy=para(ML+72,fy+2,st,AVM(14),INK,W-2*ML-240,26)+8
    if "pp" in cfg:
        px=W-ML-230
        for j,(a,b,ca,cb) in enumerate(cfg["pp"]):
            oy=y+86+j*44; pole(px,oy,44,34,a,ca); darrow(px+58,oy+17,12); pole(px+70,oy,44,34,b,cb)
    sim_qr(W-ML-88,y+140)
    y+=228
    card(ML,y,W-ML,y+206,GOLD); head(ML+22,y+18,4,"ORDNEN & SICHERN",GOLD,h.i_clip)
    R(ML+34,y+80,ML+540,y+192,10,fill=WHITE,outline=LINE,w=1.4); T(ML+50,y+90,"DAS MERKST DU DIR",AVB(12),(150,110,20))
    for i,(pre,suf) in enumerate(cfg["mit"]):
        my=y+124+i*38; T(ML+50,my,pre,AVM(13.5),INK)
        lx=ML+54+twf(pre,AVM(13.5))+8; rx=ML+520-((twf(suf,AVM(13.5))+10) if suf else 0)
        ln([(lx,my+20),(rx-6,my+20)],LINE,1)
        if suf: T(rx,my,suf,AVM(13.5),SUB)
    para(ML+560,y+90,"Notiere deine Beobachtung in dein Heft – Stichworte reichen. Vergleiche dann mit dem Merksatz.",AVM(13.5),INK,W-ML-40-(ML+560),26)
    y+=216
    card(ML,y,W-ML,y+272,RED); head(ML+22,y+18,5,"AUFGABEN – CHECK!",RED,h.i_clip)
    task=cfg["auf"]; typ=task[0]; ay=y+86
    if typ=="shortq":
        _,q,nl=task; ey=para(ML+38,ay,q,AVM(15),INK,W-2*ML-70,28)
        for k in range(nl): ln([(ML+38,ey+14+k*38),(W-ML-40,ey+14+k*38)],LINE,1)
    elif typ=="checklist":
        _,q,its=task; ey=para(ML+38,ay,q,AVM(15),INK,W-2*ML-70,28); ay=ey+16
        for j,it2 in enumerate(its):
            r2,c2=divmod(j,2); ox=ML+38+c2*(W-2*ML)/2; oy=ay+r2*44
            R(ox,oy,ox+26,oy+26,5,outline=STEEL,w=2); T(ox+38,oy+2,it2,AV(14),INK)
    elif typ=="checkrows":
        _,q,rws=task; T(ML+38,ay,q,AVM(15),INK); ay+=42
        for (a,b,ca,cb) in rws:
            pole(ML+38,ay,50,36,a,ca); darrow(ML+104,ay+18,12); pole(ML+118,ay,50,36,b,cb)
            for j,lab in enumerate(["Anziehung","Abstoßung"]):
                ox=ML+260+j*220; R(ox,ay+4,ox+24,ay+28,5,outline=STEEL,w=2); T(ox+34,ay+5,lab,AV(14),INK)
            ay+=46
    elif typ=="drawbox":
        _,q,hh=task; ey=para(ML+38,ay,q,AVM(15),INK,W-2*ML-70,28); R(ML+38,ey+12,W-ML-40,ey+12+hh,10,fill=WHITE,outline=LINE,w=1.4)
    y+=282
    card(ML,y,W-ML,y+150,BLUE); h.i_globe(ML+34,y+30,BLUE); T(ML+56,y+18,"ALLTAG & ANWENDUNG",AVB(14),(40,80,150))
    para(ML+34,y+58,"Wo im Alltag stecken Magnete? Nenne zwei Beispiele.",AVM(14),INK,W-2*ML-260,26)
    for k in range(2): T(ML+34,y+96+k*36,f"{k+1}.",AVB(14),INK); ln([(ML+64,y+120+k*36),(W-ML-230,y+120+k*36)],LINE,1)
    al=ALLTAG.get(tid)
    if al: paste(os.path.join(IMG,f"fig_{al[0]}.png"),W-ML-200,y+24,170)
    circ(56,H-36,15,outline=TEAL,w=2); d.arc([sc(41),sc(H-47),sc(71),sc(H-25)],0,360,fill=TEAL,width=sc(2))
    T(92,H-44,"PHYSIK · FORSCHERHEFT",AVB(12),TEAL)
    h.i_star(W-430,H-38,GOLD); T(W-406,H-46,"HEUTE WAR ICH EIN FORSCHER:",AVB(11.5),NAVY); stars(W-190,H-38)
    return im.resize((W,H),Image.LANCZOS)

def uebungen(idx):
    o=FK[idx]; tid=o["id"]; acc=TOPACC[idx]
    im=Image.new("RGB",(sc(W),sc(H)),CREAM); d=ImageDraw.Draw(im,"RGBA"); h=helpers(im,d,tid)
    R,T,twf,circ,ln,darrow,pole,paste,wrap,para,stars=h.R,h.T,h.twf,h.circ,h.ln,h.darrow,h.pole,h.paste,h.wrap,h.para,h.stars
    def right(): T(W-ML,60,"ÜBUNGEN",TITLE(22),GOLD,anchor="ra")
    h.hbar(idx,o["shortName"],right)
    name=o["theme"].split("· ")[-1]
    T(ML,128,"Übungen",TITLE(38),INK); ln([(ML+2,190),(ML+200,190)],acc,5)
    para(ML,210,name,AVM(15),SUB,W-2*ML,24)
    def wl(x,y,n,x1):
        for k in range(n): ln([(x,y+k*38),(x1,y+k*38)],LINE,1)
        return y+n*38
    y=256
    for n,task in enumerate(AUF[tid],1):
        typ=task[0]
        R(ML,y,W-ML,y+18,0,fill=None)  # spacer noop
        circ(ML+18,y+18,17,fill=acc); T(ML+18,y+19,str(n),TITLE(17),WHITE,anchor="mm")
        px=ML+48
        if typ=="gallery":
            _,q,items=task; ey=para(px,y+6,q,AVM(15),INK,W-ML-px,28); gy=ey+12
            ncol=3; cw=(W-ML-ML)/ncol; ch=170
            for i,(fig,lab) in enumerate(items):
                r,c=divmod(i,ncol); x0=ML+c*cw; y0=gy+r*(ch+14)
                R(x0,y0,x0+cw-14,y0+ch,14,fill=WHITE,outline=LINE,w=1.4)
                paste(os.path.join(IMG,f"fig_{fig}.png"),x0+(cw-14)/2-45,y0+12,90)
                T(x0+(cw-14)/2,y0+ch-46,lab,AVB(12),INK,anchor="ma"); ln([(x0+16,y0+ch-22),(x0+cw-30,y0+ch-22)],LINE,1)
            y=gy+math.ceil(len(items)/ncol)*(ch+14)+14
        elif typ=="table":
            _,cols,nr,q=task; ey=para(px,y+6,q,AVM(15),INK,W-ML-px,28); ty=ey+10
            x0,x1=ML,W-ML; th=42; rh=44; tot=th+nr*rh; cw=(x1-x0)/2
            R(x0,ty,x1,ty+tot,8,fill=WHITE,outline=LINE,w=1.4)
            for i in range(2): T(x0+i*cw+cw/2,ty+th/2,cols[i],AVB(13),INK,anchor="mm")
            for r in range(nr+1): ln([(x0,ty+th+r*rh),(x1,ty+th+r*rh)],(232,234,240),1)
            ln([(x0,ty+th),(x1,ty+th)],LINE,1); ln([(x0+cw,ty),(x0+cw,ty+tot)],LINE,1)
            y=ty+tot+16
        elif typ=="image":
            _,fig,q,nl=task; p=os.path.join(IMG,f"fig_{fig}.png")
            g=Image.open(p).convert("RGBA") if os.path.exists(p) else None
            iw=170; ih=int(iw*g.height/g.width) if g else 0
            ey=para(px,y+6,q,AVM(15),INK,W-ML-px-iw-24,28)
            if g: paste(p,W-ML-iw,y+4,iw)
            yb=max(ey, y+4+ih)+10; y=wl(px,yb+8,nl,W-ML)+12
        elif typ=="claim":
            _,nm,cl,q,nl=task; txt=f"{nm} behauptet: „{cl}“ {q}"
            ey=para(px,y+6,txt,AVM(15),INK,W-ML-px,28); y=wl(px,ey+8,nl,W-ML)+12
        elif typ=="drawpoles":
            _,q,cells=task; T(px,y+6,q,AVM(15),INK); dy=y+44; cx=px
            for j,cell in enumerate(cells):
                if cell[0]=="blank": R(cx,dy,cx+56,dy+42,6,outline=STEEL,w=2)
                else: pole(cx,dy,56,42,cell[0],cell[1])
                cx+=64
                if j==1: darrow(cx+8,dy+21,14); cx+=34
            y=dy+58
        elif typ=="shortq":
            _,q,nl=task; ey=para(px,y+6,q,AVM(15),INK,W-ML-px,28); y=wl(px,ey+8,nl,W-ML)+12
        elif typ=="drawbox":
            _,q,hh=task; ey=para(px,y+6,q,AVM(15),INK,W-ML-px,28); R(px,ey+10,W-ML,ey+10+hh,10,fill=WHITE,outline=LINE,w=1.4); y=ey+10+hh+16
        y+=8
    circ(56,H-36,15,outline=TEAL,w=2); d.arc([sc(41),sc(H-47),sc(71),sc(H-25)],0,360,fill=TEAL,width=sc(2))
    T(92,H-44,"PHYSIK · FORSCHERHEFT",AVB(12),TEAL)
    h.i_star(W-430,H-38,GOLD); T(W-406,H-46,"HEUTE WAR ICH EIN FORSCHER:",AVB(11.5),NAVY); stars(W-190,H-38)
    return im.resize((W,H),Image.LANCZOS)

def cover():
    im=Image.new("RGB",(sc(W),sc(H)),NAVY); d=ImageDraw.Draw(im,"RGBA"); h=helpers(im,d)
    T,circ,ln,para,paste,stars,twf=h.T,h.circ,h.ln,h.para,h.paste,h.stars,h.twf
    # oben Navy-Band, unten hell
    d.rectangle([sc(0),sc(560),sc(W),sc(H)],fill=CREAM)
    for i in range(6):
        rr=180+i*120; d.ellipse([sc(W/2-rr),sc(300-rr*0.5),sc(W/2+rr),sc(300+rr*0.5)],outline=(70,95,150,120),width=sc(1))
    circ(W/2,150,42,outline=GOLD,w=4); circ(W/2,150,7,fill=GOLD)
    for a in (30,150,270): ln([(W/2+44*math.cos(math.radians(a)),150+18*math.sin(math.radians(a))),(W/2-44*math.cos(math.radians(a)),150-18*math.sin(math.radians(a)))],GOLD,2)
    T(W/2,236,"PHYSIK · FORSCHERHEFT",AVB(15),(214,190,132),anchor="mm")
    T(W/2,330,"MAGNETISMUS",TITLE(66),WHITE,anchor="mm")
    T(W/2,420,"5 Forscherkreise · Klasse 5",AVM(22),(200,212,235),anchor="mm")
    # großes Magnet-Emblem
    mw=280; mx=W/2-mw/2; my=630
    h.R(mx,my,mx+mw/2,my+90,8,fill=RED); h.R(mx+mw/2,my,mx+mw,my+90,8,fill=BLUE); h.R(mx,my,mx+mw,my+90,8,outline=INK,w=3)
    T(mx+mw/4,my+45,"N",TITLE(40),WHITE,anchor="mm"); T(mx+3*mw/4,my+45,"S",TITLE(40),WHITE,anchor="mm")
    R=h.R
    R(W/2-260,my+150,W/2+260,my+150,0)
    T(W/2,900,"Forschen · Vermuten · Ausprobieren · Sichern · Anwenden",AVM(18),INK,anchor="mm")
    # Feature-Pills
    feats=["Fortschritts-Check","QR zu Video & Simulation","Rätsel & Test","Alltag mit Bildern"]
    fy=1010
    for i,ft in enumerate(feats):
        r,c=divmod(i,2); pxc=W/2-300+c*300; pyc=fy+r*90
        R(pxc,pyc,pxc+280,pyc+64,14,fill=WHITE,outline=GOLD,w=1.6)
        circ(pxc+34,pyc+32,10,fill=TEAL); T(pxc+56,pyc+20,ft,AVB(13),INK)
    R(W/2-170,1240,W/2+170,1300,30,fill=GOLD); T(W/2,1270,"Realschule NRW",AVB(17),NAVY,anchor="mm")
    stars(W/2-95,1360,5,16)
    T(W/2,1470,"Forschendes, kompetenzorientiertes Lernen",AVM(14),SUB,anchor="mm")
    T(W/2,1502,"nach dem Kernlehrplan Physik NRW",AVM(13),(150,158,175),anchor="mm")
    return im.resize((W,H),Image.LANCZOS)

pages=[cover()]
for i in range(len(FK)): pages+=[concept_page(i),uebungen(i)]
for i,p in enumerate(pages): p.save(os.path.join(HERE,f"spread_p{i+1}.png"))
out=os.path.expanduser("~/Desktop/Magnetismus_Forscherheft_SPREADS.pdf")
pages[0].save(out,"PDF",resolution=150,save_all=True,append_images=pages[1:])
print("SAVED",out,"| Seiten:",len(pages))
