# -*- coding: utf-8 -*-
"""Gold-Editorial + Forscher-Struktur: Cover + pro Thema Auftakt + 5 Schritt-Seiten."""
import os, json, math, re
from PIL import Image, ImageDraw, ImageFont
HERE=os.path.dirname(__file__); IMG=os.path.join(HERE,"img")
SF="/System/Library/Fonts/Supplemental/"
S=2; W,H=1240,1754
def sc(v): return int(round(v*S))
def _f(p,pt,i=0): return ImageFont.truetype(SF+p,int(pt*S),index=i)
def DIDOT(pt): return _f("Didot.ttc",pt,0)
def COCHIN(pt): return _f("Cochin.ttc",pt,1)
def COP(pt): return _f("Copperplate.ttc",pt,0)
def AV(pt): return _f("Avenir Next.ttc",pt,7)
def AVM(pt): return _f("Avenir Next.ttc",pt,5)
def AVB(pt): return _f("Avenir Next.ttc",pt,0)
CREAM=(250,246,236); NAVYBG=(15,24,56); INK=(38,44,66); SUB=(120,120,135); WHITE=(255,255,255)
GOLD=(198,160,74); GOLD_L=(226,200,128); GOLD_D=(140,108,40); GLINE=(226,206,150)
RED=(199,70,60); BLUE=(46,92,178)
STEP=[(28,42,90),(84,56,116),(22,120,118),(190,148,50),(198,70,60)]
TOPACC=[(22,120,118),(199,70,60),(84,56,116),(46,92,178),(190,148,50)]
ML=48
FK=json.loads(open(os.path.join(HERE,"..","fk-magnet.js"),encoding="utf-8").read().split("=",1)[1].rstrip().rstrip(";"))
strip=lambda s: re.sub(r"\s+"," ",re.sub("<[^>]+>","",s or "")).strip()
ALLTAG={"magnete-felder":("fridge","Kühlschrankmagnet"),"magnet-stoffe":("crane","Schrott-Kran"),
 "magnetpole":("closure","Taschenverschluss"),"magnetfeld":("u_mrt","MRT"),"kompass":("hiking","Wandern")}
CFG={
 "magnete-felder":{"hero":"barmagnet","f_intro":"Untersuche, ob ein Magnet auch ohne Berührung wirkt.",
  "forschen":["Nähere einen Magneten langsam einer Büroklammer. Wann bewegt sie sich?","Schiebe ein Blatt Papier dazwischen. Wirkt der Magnet immer noch?"],
  "tab":(["Situation","Wirkt der Magnet?"],["ohne etwas dazwischen","durch Papier","aus der Luft"]),
  "mit":[("Um jeden Magneten liegt ein","."),("Der Magnet wirkt auch ohne","der Berührung.")],
  "auf":("shortq","Erkläre mit dem Wort Magnetfeld, warum ein Magnet ohne Berührung wirkt.",3)},
 "magnet-stoffe":{"hero":"attract","f_intro":"Prüfe verschiedene Gegenstände mit einem Magneten.",
  "forschen":["Halte den Magneten an Nagel, Aludose, Büroklammer und Holz.","Sortiere: Was wird angezogen, was nicht?"],
  "tab":(["Gegenstand","angezogen? (ja/nein)"],["Eisennagel","Aludose","Büroklammer","Holzklotz"]),
  "mit":[("Magnetisch sind nur Eisen, Nickel und","."),("„Metall“ ist nicht dasselbe wie",".")],
  "auf":("checklist","Kreuze an, welche Gegenstände ein Magnet anzieht:",["Eisennagel","Büroklammer (Stahl)","Aludose","Kupferdraht"])},
 "magnetpole":{"hero":"poles","f_intro":"Untersuche, wie sich verschiedene Pole zueinander verhalten.",
  "pp":[("N","N",RED,RED),("N","S",RED,BLUE),("S","S",BLUE,BLUE)],
  "forschen":["Nähere zwei Magnete mit den Polen N und N.","Dann N und S. Dann S und S.","Beobachte genau: anziehen oder abstoßen?"],
  "tab":(["Pole","Was passiert?"],["N und N","N und S","S und S"]),
  "mit":[("Gleiche Pole (N–N oder S–S)","sich."),("Ungleiche Pole (N–S)","sich.")],
  "auf":("checkrows","Anziehung oder Abstoßung? Kreuze an.",[("N","S",RED,BLUE),("S","N",BLUE,RED),("N","N",RED,RED)])},
 "magnetfeld":{"hero":"fieldlines","f_intro":"Mach das unsichtbare Magnetfeld sichtbar.",
  "forschen":["Streue Eisenspäne auf ein Blatt über einem Magneten. Klopfe leicht.","Bewege eine Kompassnadel langsam um den Magneten herum."],
  "tab":(["Ort","Wie ist das Feld?"],["an den Polen","in der Mitte","weit weg"]),
  "mit":[("Feldlinien laufen außen vom Nordpol zum","."),("Wo die Linien dicht liegen, ist das Feld",".")],
  "auf":("drawbox","Zeichne einen Stabmagneten mit vier Feldlinien (außen von N nach S).",220)},
 "kompass":{"hero":"compass","f_intro":"Untersuche, wohin die Kompassnadel zeigt.",
  "forschen":["Dreh dich mit dem Kompass im Kreis – wohin zeigt die Nadel?","Halte ihn in Sonne und Schatten. Nähere dann einen Magneten."],
  "tab":(["Test","Wohin zeigt die Nadel?"],["im Freien","im Schatten","neben Magnet"]),
  "mit":[("Die Kompassnadel ist selbst ein kleiner","."),("Sie richtet sich im","der Erde aus.")],
  "auf":("shortq","Erkläre, warum die Kompassnadel nach Norden zeigt. Nutze: Magnet, Erdmagnetfeld.",3)},
}

def helpers(im,d):
    h=type("H",(),{})()
    def R(x0,y0,x1,y1,r,fill=None,outline=None,w=0): d.rounded_rectangle([sc(x0),sc(y0),sc(x1),sc(y1)],radius=sc(r),fill=fill,outline=outline,width=(sc(w) if w else 0))
    def T(x,y,s,f,fill,anchor="la"): d.text((sc(x),sc(y)),s,font=f,fill=fill,anchor=anchor)
    def tw(s,f): return d.textlength(s,font=f)/S
    def circ(cx,cy,r,fill=None,outline=None,w=0): d.ellipse([sc(cx-r),sc(cy-r),sc(cx+r),sc(cy+r)],fill=fill,outline=outline,width=(sc(w) if w else 0))
    def ln(p,fill,w=1): d.line([(sc(a),sc(b)) for a,b in p],fill=fill,width=sc(w))
    def tracked(cx,y,s,f,fill,tr,center=True):
        ws=[d.textlength(c,font=f) for c in s]; tot=sum(ws)+sc(tr)*(len(s)-1); x=(sc(cx)-tot/2) if center else sc(cx)
        for c,wc in zip(s,ws): d.text((x,sc(y)),c,font=f,fill=fill); x+=wc+sc(tr)
    def orn(cx,y,half=70):
        ln([(cx-half,y),(cx-14,y)],GOLD,1); ln([(cx+14,y),(cx+half,y)],GOLD,1)
        r=6; d.polygon([(sc(cx),sc(y)-sc(r)),(sc(cx)+sc(r),sc(y)),(sc(cx),sc(y)+sc(r)),(sc(cx)-sc(r),sc(y))],fill=GOLD_L)
    def gframe(x0,y0,x1,y1): R(x0,y0,x1,y1,10,outline=GOLD,w=1.6); R(x0+6,y0+6,x1-6,y1-6,7,outline=GLINE,w=1)
    def paste(path,x,y,w):
        if not os.path.exists(path): return 0
        g=Image.open(path).convert("RGBA"); nw=sc(w); nh=int(nw*g.height/g.width)
        im.paste(g.resize((nw,nh),Image.LANCZOS),(sc(x),sc(y)),g.resize((nw,nh),Image.LANCZOS)); return nh/S
    def para(x,y,s,f,fill,maxw,lh):
        words=s.split(); L=[]; cur=""
        for wd in words:
            t=(cur+" "+wd).strip()
            if tw(t,f)>maxw and cur: L.append(cur); cur=wd
            else: cur=t
        if cur: L.append(cur)
        for i,li in enumerate(L): T(x,y+i*lh,li,f,fill)
        return y+len(L)*lh
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
    def stars(x,y,n=5,r=15):
        for i in range(n):
            cx=x+i*(r*2+10)
            pts=[(sc(cx+(r if k%2==0 else r*0.44)*math.cos(math.pi/2+k*math.pi/5)),sc(y-(r if k%2==0 else r*0.44)*math.sin(math.pi/2+k*math.pi/5))) for k in range(10)]
            d.polygon(pts,outline=GOLD,width=sc(2))
    def horseshoe(cx,cy,scale=1.0):
        armw=70*scale; gap=80*scale; R2=(gap/2+armw/2); arm_h=200*scale; top=cy-R2
        bb=[cx-R2,top-R2,cx+R2,top+R2]
        d.arc([sc(bb[0]),sc(bb[1]),sc(bb[2]),sc(bb[3])],180,270,fill=RED,width=sc(armw))
        d.arc([sc(bb[0]),sc(bb[1]),sc(bb[2]),sc(bb[3])],270,360,fill=BLUE,width=sc(armw))
        R(cx-gap/2-armw,top,cx-gap/2,top+arm_h,6,fill=RED); R(cx+gap/2,top,cx+gap/2+armw,top+arm_h,6,fill=BLUE)
        ln([(cx-gap/2-armw+6,top+8),(cx-gap/2-6,top+8)],(255,255,255,70),3)
        T(cx-gap/2-armw/2,top+arm_h-30,"N",DIDOT(28*scale),CREAM,anchor="mm"); T(cx+gap/2+armw/2,top+arm_h-30,"S",DIDOT(28*scale),CREAM,anchor="mm")
        for k,rr in enumerate([60*scale,110*scale,165*scale,225*scale]):
            d.arc([sc(cx-rr),sc(top+arm_h-40-rr*0.6),sc(cx+rr),sc(top+arm_h-40+rr*0.6)],200,340,fill=(200,170,110,150-k*20),width=sc(1))
    def numtab(x,y,n,col,title):
        R(x,y,x+64,y+66,8,fill=col); d.polygon([(sc(x+64),sc(y)),(sc(x+64),sc(y+18)),(sc(x+46),sc(y))],fill=tuple(max(0,c-40) for c in col))
        T(x+32,y+34,str(n),DIDOT(31),CREAM,anchor="mm")
        T(x+86,y+15,title,COCHIN(26),col); orn(x+86+tw(title,COCHIN(26))/2,y+54,tw(title,COCHIN(26))/2)
    def pagetab(pg,col): R(W/2-34,H-64,W/2+34,H-20,8,fill=col); T(W/2,H-40,f"{pg:02d}",AVB(15),CREAM,anchor="mm")
    def eyebrow(x,y,lab,col): R(x,y,x+38,y+38,7,fill=col); T(x+19,y+20,"",AV(1),CREAM,anchor="mm")
    def tracker_navy(cy,active):
        items=[("1","FRAGE"),("2","VERMUTEN"),("3","FORSCHEN"),("4","SICHERN"),("5","ANWENDEN")]
        tx=W/2-440; step=880/4
        for i in range(1,5): ln([(tx+(i-1)*step+18,cy),(tx+i*step-18,cy)],(70,88,130),2)
        for i,(nn,lab) in enumerate(items):
            cx=tx+i*step; act=(i==active)
            circ(cx,cy,17,fill=(GOLD if act else NAVYBG),outline=(GOLD if act else (110,124,158)),w=2)
            T(cx,cy+1,nn,AVB(13),(NAVYBG if act else GOLD_L),anchor="mm"); T(cx,cy+23,lab,COP(8.5),(GOLD_L if act else (150,162,190)),anchor="ma")
    for k,v in list(locals().items()):
        if callable(v): setattr(h,k,v)
    return h

def newp(bg=CREAM):
    im=Image.new("RGB",(sc(W),sc(H)),bg); return im,ImageDraw.Draw(im,"RGBA")

def foot_light(h,pg,col):
    h.circ(56,H-36,14,outline=GOLD,w=2); h.circ(56,H-36,4,fill=GOLD)
    h.T(90,H-44,"MAGNETISMUS · FORSCHERHEFT",COP(9),GOLD_D); h.pagetab(pg,col)

# ---------- BOOK COVER ----------
def book_cover():
    im,d=newp(NAVYBG); h=helpers(im,d)
    h.R(44,44,W-44,H-44,20,outline=GOLD,w=2); h.R(54,54,W-54,H-54,16,outline=GOLD_D,w=1)
    h.R(W/2-150,110,W/2+150,158,8,outline=GOLD,w=1.4); h.tracked(W/2,124,"FORSCHERHEFT PHYSIK",COP(13),GOLD_L,4)
    h.tracked(W/2,208,"MAGNETISMUS",DIDOT(66),GOLD_L,2)
    h.tracked(W/2,318,"FORSCHEN · VERSTEHEN · ANWENDEN",COP(15),GOLD,5); h.orn(W/2,370,120)
    h.horseshoe(W/2,560,1.5)
    h.R(W/2-150,910,W/2+150,962,26,outline=GOLD,w=1.6); h.tracked(W/2,926,"5 FORSCHERKREISE · KLASSE 5",COP(13),GOLD_L,2)
    h.tracked(W/2,1120,"REALSCHULE NRW",COP(15),GOLD_L,6)
    h.tracked(W/2,1200,"Forschendes, kompetenzorientiertes Lernen",AVM(15),(180,190,214),1)
    h.tracked(W/2,1236,"nach dem Kernlehrplan Physik NRW",AVM(13),(140,152,180),1)
    h.orn(W/2,H-150,150)
    return im.resize((W,H),Image.LANCZOS)

# ---------- TOPIC OPENER ----------
def opener(idx):
    o=FK[idx]; tid=o["id"]; cfg=CFG[tid]; acc=TOPACC[idx]
    im,d=newp(CREAM); h=helpers(im,d)
    h.tracked(W/2,120,f"FORSCHERKREIS 0{idx+1}",COP(15),acc,6)
    name=o["theme"].split("· ")[-1]; nf=DIDOT(46)
    if h.tw(name,nf)>W-160: nf=DIDOT(38)
    y=h.para(W/2,168,name,nf,INK,W-160,58)  # centered? para is left; use tracked-ish
    # center title manually
    im2=im  # keep
    h.orn(W/2,y+18,150)
    h.paste(os.path.join(IMG,f"fig_{cfg['hero']}.png"),W/2-280,y+50,560)
    h.tracked(W/2,y+430,"DEINE MISSION",COP(13),GOLD_D,4)
    h.para(W/2-420,y+458,"Finde heraus: "+strip(o["leitfrage"]),AVM(16),INK,840,30)
    h.tracker_navy(H-360,-1) if False else None
    # tracker on cream
    tx=W/2-440; step=880/4; cy=H-300
    for i in range(1,5): h.ln([(tx+(i-1)*step+18,cy),(tx+i*step-18,cy)],(210,214,224),2)
    for i,(nn,lab) in enumerate([("1","FRAGE"),("2","VERMUTEN"),("3","FORSCHEN"),("4","SICHERN"),("5","ANWENDEN")]):
        cx=tx+i*step; h.circ(cx,cy,17,fill=WHITE,outline=acc,w=2); h.T(cx,cy+1,nn,AVB(13),acc,anchor="mm"); h.T(cx,cy+23,lab,COP(8.5),SUB,anchor="ma")
    h.T(80,H-200,"NAME:",COP(12),GOLD_D); h.ln([(180,H-182),(W-80,H-182)],GLINE,1.4)
    foot_light(h,0,acc) if False else h.T(90,H-44,"MAGNETISMUS · FORSCHERHEFT",COP(9),GOLD_D)
    return im.resize((W,H),Image.LANCZOS)

def _titlecenter(h,name,nf,y):
    # center a possibly-2-line title
    words=name.split(); lines=[]; cur=""
    for wd in words:
        t=(cur+" "+wd).strip()
        if h.tw(t,nf)>W-160 and cur: lines.append(cur); cur=wd
        else: cur=t
    if cur: lines.append(cur)
    for i,li in enumerate(lines): h.T(W/2,y+i*58,li,nf,INK,anchor="ma")
    return y+len(lines)*58

# ---------- STEP PAGES ----------
def problem(idx):
    o=FK[idx]; im,d=newp(CREAM); h=helpers(im,d); col=STEP[0]
    h.numtab(60,70,1,col,"PROBLEM & FRAGE"); y=214
    y=h.para(90,y,strip(o["problem"]),AV(16),INK,W-180,32)+34
    h.magnet(300,y,150,50); h.arrow(470,y+25,522,SUB,2,11); h.T(562,y+25,"?",DIDOT(34),INK,anchor="mm"); h.arrow(602,y+25,654,SUB,2,11); h.magnet(694,y,150,50)
    y+=120
    h.circ(110,y+14,16,outline=col,w=2); h.T(110,y+15,"?",AVB(15),col,anchor="mm")
    y=h.para(140,y,"FRAGE:  "+strip(o["leitfrage"]),AVM(15),INK,W-230,28)+40
    h.gframe(80,y,W-80,y+176)
    h.circ(132,y+44,14,outline=GOLD_D,w=2); h.ln([(132,y+37),(132,y+50)],GOLD_D,2); h.circ(132,y+55,2,fill=GOLD_D)
    h.tracked(168,y+32,"DENK DRAN",COP(13),GOLD_D,3,center=False)
    h.para(132,y+68,"Notiere alle Beobachtungen genau. Nur so kannst du später sicher erklären, was passiert ist.",AV(14.5),INK,W-260,28)
    p=os.path.join(IMG,f"qr_video_{o['id']}.png")
    if os.path.exists(p): h.R(W-190,y+30,W-116,y+104,8,fill=WHITE,outline=GLINE,w=1.4); h.paste(p,W-184,y+36,62)
    foot_light(h,1,col); return im.resize((W,H),Image.LANCZOS)

def vermutung(idx):
    o=FK[idx]; im,d=newp(CREAM); h=helpers(im,d); col=STEP[1]
    h.numtab(60,70,2,col,"DEINE VERMUTUNG"); y=220
    h.para(90,y,"Was glaubst du? Kreuze an oder schreibe deine Vermutung auf.",AV(16),INK,W-500,30)
    opts=[x["label"] for x in o.get("predictOptions",[])][:3] or ["Es wird angezogen.","Es bleibt liegen."]
    oy=y+58
    for t in opts:
        h.R(90,oy,118,oy+28,6,outline=(150,160,175),w=2); h.para(134,oy+2,t,AV(15),INK,620,26); oy+=48
    # Denkblase
    bx,by=W-380,y-6
    d.ellipse([sc(bx),sc(by),sc(bx+320),sc(by+170)],fill=WHITE,outline=GLINE,width=sc(2))
    h.circ(bx+46,by+186,14,fill=WHITE,outline=GLINE,w=2); h.circ(bx+22,by+206,8,fill=WHITE,outline=GLINE,w=2)
    h.pole(bx+80,by+62,54,44,"N",RED); h.T(bx+160,by+84,"?",DIDOT(26),INK,anchor="mm"); h.pole(bx+186,by+62,54,44,"N",RED)
    y=oy+40
    h.T(90,y,"Begründe deine Vermutung:",AVM(15),SUB); y+=44
    for k in range(4): h.ln([(90,y+k*44),(W-90,y+k*44)],GLINE,1.4)
    foot_light(h,2,col); return im.resize((W,H),Image.LANCZOS)

def forschen(idx):
    o=FK[idx]; tid=o["id"]; cfg=CFG[tid]; im,d=newp(CREAM); h=helpers(im,d); col=STEP[2]
    h.numtab(60,70,3,col,"FORSCHEN – PROBIERE ES AUS"); y=214
    y=h.para(90,y,"Durchführung: "+cfg["f_intro"],AVM(15.5),INK,W-180,28)+24
    for i,st in enumerate(cfg["forschen"]):
        h.circ(112,y+15,15,fill=col); h.T(112,y+16,str(i+1),AVB(13),CREAM,anchor="mm")
        ny=h.para(146,y+4,st,AV(15),INK,W-500,28)
        if "pp" in cfg and i<len(cfg["pp"]):
            a,b,ca,cb=cfg["pp"][i]; py=y+2; h.pole(W-320,py,54,38,a,ca); h.darrow(W-248,py+19,14); h.pole(W-234,py,54,38,b,cb)
        y=max(ny,y+52)+8
    y+=20
    h.gframe(80,y,W-80,y+150)
    h.T(120,y+34,"🔬",DIDOT(1),col) if False else None
    d.arc([sc(112),sc(y+28),sc(140),sc(y+52)],0,0,fill=col) if False else None
    h.tracked(120,y+30,"DIGITAL TESTEN",COP(13),col,3,center=False)
    h.para(120,y+62,"Teste es selbst in der Simulation! Verändere Pole und Abstand und beobachte, was passiert.",AV(14),INK,W-420,26)
    h.tracked(W-330,y+30,"SCAN MICH",COP(11),GOLD_D,2,center=False)
    p=os.path.join(IMG,f"qr_sim_{tid}.png")
    if os.path.exists(p): h.R(W-206,y+52,W-120,y+138,8,fill=WHITE,outline=GLINE,w=1.4); h.paste(p,W-200,y+58,74)
    foot_light(h,3,col); return im.resize((W,H),Image.LANCZOS)

def sichern(idx):
    o=FK[idx]; tid=o["id"]; cfg=CFG[tid]; im,d=newp(CREAM); h=helpers(im,d); col=STEP[3]
    h.numtab(60,70,4,col,"ORDNEN & SICHERN"); y=224
    h.tracked(96,y,"MEINE BEOBACHTUNG",COP(13),col,3,center=False)
    cols,rows=cfg["tab"]; ty=y+34; x0,x1=90,W-90; th=50; rh=54; tot=th+len(rows)*rh; cw=(x1-x0)*0.42
    h.R(x0,ty,x1,ty+tot,10,outline=GLINE,w=1.6)
    h.T(x0+24,ty+th/2,cols[0],COCHIN(15),INK,anchor="lm"); h.T(x0+cw+24,ty+th/2,cols[1],COCHIN(15),INK,anchor="lm")
    h.ln([(x0,ty+th),(x1,ty+th)],GLINE,1.4); h.ln([(x0+cw,ty),(x0+cw,ty+tot)],GLINE,1.4)
    for i,rl in enumerate(rows):
        ry=ty+th+i*rh
        if i>0: h.ln([(x0,ry),(x1,ry)],(236,232,220),1)
        h.T(x0+24,ry+rh/2,rl,AV(14.5),INK,anchor="lm")
    y=ty+tot+50
    h.gframe(80,y,W-80,y+186)
    d.polygon([(sc(122),sc(y+36)-sc(12)),(sc(122)+sc(11),sc(y+36)),(sc(122),sc(y+36)+sc(12)),(sc(122)-sc(11),sc(y+36))],fill=GOLD)
    h.tracked(150,y+26,"DAS MUSST DU MITNEHMEN",COP(13),GOLD_D,3,center=False)
    for i,(pre,suf) in enumerate(cfg["mit"]):
        my=y+74+i*52; h.T(120,my,pre,AV(15),INK); lx=124+h.tw(pre,AV(15))+10
        rx=W-140-(h.tw(suf,AV(15))+8 if suf else 0)
        h.ln([(lx,my+22),(rx-6,my+22)],GLINE,1.4)
        if suf: h.T(rx,my,suf,AV(15),SUB)
    h.horseshoe(W-190,y+110,0.5)
    foot_light(h,4,col); return im.resize((W,H),Image.LANCZOS)

def aufgaben(idx):
    o=FK[idx]; tid=o["id"]; cfg=CFG[tid]; im,d=newp(CREAM); h=helpers(im,d); col=STEP[4]
    h.numtab(60,70,5,col,"AUFGABEN – CHECK!"); y=224
    task=cfg["auf"]; typ=task[0]
    h.circ(108,y+13,14,fill=col); h.T(108,y+14,"1",AVB(12),CREAM,anchor="mm")
    if typ=="shortq":
        _,q,nl=task; ey=h.para(140,y,q,AV(16),INK,W-230,30)
        for k in range(nl): h.ln([(90,ey+18+k*40),(W-90,ey+18+k*40)],GLINE,1.4)
        y=ey+18+nl*40
    elif typ=="checklist":
        _,q,its=task; ey=h.para(140,y,q,AV(16),INK,W-230,30); yy=ey+14
        for j,it2 in enumerate(its):
            r2,c2=divmod(j,2); ox=140+c2*(W-280)/2; oy=yy+r2*48
            h.R(ox,oy,ox+28,oy+28,6,outline=(150,160,175),w=2); h.T(ox+42,oy+3,it2,AV(15),INK)
        y=yy+math.ceil(len(its)/2)*48+10
    elif typ=="checkrows":
        _,q,rws=task; h.T(140,y,q,AV(16),INK); yy=y+48
        for (a,b,ca,cb) in rws:
            h.pole(140,yy,54,40,a,ca); h.darrow(212,yy+20,14); h.pole(230,yy,54,40,b,cb)
            for j,lab in enumerate(["Anziehung","Abstoßung"]):
                ox=380+j*250; h.R(ox,yy+6,ox+26,yy+32,5,outline=(150,160,175),w=2); h.T(ox+38,yy+8,lab,AV(15),INK)
            yy+=52
        y=yy
    elif typ=="drawbox":
        _,q,hh=task; ey=h.para(140,y,q,AV(16),INK,W-230,30); h.R(90,ey+14,W-90,ey+14+hh,10,fill=WHITE,outline=GLINE,w=1.4); y=ey+14+hh
    y+=44
    # ALLTAG
    h.gframe(80,y,W-80,y+180)
    d.arc([sc(114),sc(y+26),sc(140),sc(y+52)],0,360,fill=col,width=sc(2)); h.ln([(114,y+39),(140,y+39)],col,2)
    h.tracked(160,y+26,"ALLTAG & ANWENDUNG",COP(13),col,3,center=False)
    h.para(120,y+60,"Wo im Alltag spielen Magnete eine Rolle? Nenne zwei Beispiele.",AV(14.5),INK,W-420,26)
    for k in range(2): h.T(120,y+104+k*36,f"{k+1}.",AVB(14),INK); h.ln([(150,y+128+k*36),(W-320,y+128+k*36)],GLINE,1.4)
    al=ALLTAG.get(tid)
    if al: h.paste(os.path.join(IMG,f"fig_{al[0]}.png"),W-290,y+40,180)
    foot_light(h,5,col); return im.resize((W,H),Image.LANCZOS)

# ---------- METHOD PAGE ----------
def method():
    im,d=newp(NAVYBG); h=helpers(im,d)
    h.R(44,44,W-44,H-44,18,outline=GOLD,w=2)
    h.tracked(W/2,130,"SO ARBEITEST DU IM FORSCHERKREIS",COP(16),GOLD_L,4); h.orn(W/2,176,150)
    steps=[("FRAGE","Wir starten mit einer spannenden Frage."),
           ("VERMUTEN","Du überlegst und machst eine Vermutung."),
           ("FORSCHEN","Du führst Experimente durch und sammelst Beobachtungen."),
           ("SICHERN","Wir ordnen die Ergebnisse und halten das Wichtigste fest."),
           ("ANWENDEN","Du überträgst dein Wissen in den Alltag und auf neue Aufgaben.")]
    y=280
    for i,(t,txt) in enumerate(steps):
        h.circ(150,y+22,26,outline=GOLD,w=2); h.T(150,y+23,str(i+1),DIDOT(24),GOLD_L,anchor="mm")
        h.T(210,y-2,t,COCHIN(22),GOLD_L); h.para(210,y+34,txt,AVM(15),(206,214,232),W-330,28)
        y+=140
    h.orn(W/2,y+10,150); h.tracked(W/2,y+40,"NEUGIER IST DER ANFANG VON WISSEN.",COP(13),GOLD,3)
    return im.resize((W,H),Image.LANCZOS)

pages=[book_cover()]
for i in range(len(FK)): pages+=[opener(i),problem(i),vermutung(i),forschen(i),sichern(i),aufgaben(i)]
pages+=[method()]
for i,p in enumerate(pages): p.save(os.path.join(HERE,f"gold_p{i+1}.png"))
out=os.path.expanduser("~/Desktop/Magnetismus_Forscherheft_GOLD.pdf")
pages[0].save(out,"PDF",resolution=150,save_all=True,append_images=pages[1:])
print("SAVED",out,"| Seiten:",len(pages))
