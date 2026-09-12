# -*- coding: utf-8 -*-
"""Themenzeichnungen fuer Strom, Waerme, Schall, Himmel (Klasse-5-Physik-Gesamtheft).
Jede Szene: (h,x,y) -> zeichnet in ~300x150 Bereich. Nur h-Primitive."""
import math
from build_final import (RED,BLUE,INK,GLINE,GOLD,GOLD_D,GOLD_L,CREAM,WHITE,SUB,AV,AVM,AVB,COP,DIDOT)

WIRE=(70,78,100); LAMP=(255,224,120); LAMPOFF=(214,214,206); BAT=(90,100,124)
SUN=(242,190,70); EARTH=(70,130,190); MOON=(206,206,200); SHAD=(60,66,86)
HEAT=(214,96,60); COLD=(90,140,200); WAVE=(84,56,116); METALc=(150,156,170)

# ---------------- STROM ----------------
def _batt(h,x,y):
    # Batterie-Schaltzeichen: lange + kurze Linie
    h.ln([(x,y-14),(x,y+14)],INK,3); h.ln([(x+12,y-8),(x+12,y+8)],INK,6)
    h.T(x+6,y+20,"+",AVB(12),INK,anchor="ma"); h.T(x-8,y+20,"–",AVB(12),INK,anchor="ma")
def _lampsym(h,cx,cy,on=True,r=15):
    h.circ(cx,cy,r,fill=(LAMP if on else LAMPOFF),outline=INK,w=2)
    d=r*0.7; h.ln([(cx-d,cy-d),(cx+d,cy+d)],INK,2); h.ln([(cx-d,cy+d),(cx+d,cy-d)],INK,2)
    if on:
        for a in range(0,360,45):
            dx,dy=math.cos(math.radians(a)),math.sin(math.radians(a))
            h.ln([(cx+dx*(r+4),cy+dy*(r+4)),(cx+dx*(r+11),cy+dy*(r+11))],SUN,2)
def _switch(h,x,y,closed=True):
    h.circ(x,y,3,fill=INK); h.circ(x+30,y,3,fill=INK)
    if closed: h.ln([(x,y),(x+30,y)],INK,2)
    else: h.ln([(x,y),(x+26,y-14)],INK,2)

def strom_scene(h,x,y,mode):
    L,R2,T,B=x+20,x+280,y+24,y+128
    if mode=="s1":
        # Rechteck-Stromkreis mit Batterie(unten), Lampe(oben), Schalter(rechts)
        h.ln([(L,T),(R2,T)],WIRE,2); h.ln([(L,B),(R2,B)],WIRE,2)
        h.ln([(L,T),(L,B)],WIRE,2); h.ln([(R2,T),(R2,y+66)],WIRE,2); h.ln([(R2,y+90),(R2,B)],WIRE,2)
        _lampsym(h,(L+R2)/2,T,True); _batt(h,(L+R2)/2,B); _switch(h,R2-15,y+78,True)
    elif mode=="s2":
        for i,(closed,on,lab) in enumerate([(True,True,"Kreis zu: Lampe an"),(False,False,"Kreis offen: Lampe aus")]):
            oy=y+8+i*66; l,r=x+24,x+250
            h.ln([(l,oy),(r,oy)],WIRE,2); h.ln([(l,oy),(l,oy+34)],WIRE,2); h.ln([(r,oy),(r,oy+16)],WIRE,2)
            h.ln([(l,oy+34),(r-40,oy+34)],WIRE,2); h.ln([(r,oy+38),(r,oy+34)],WIRE,2); h.ln([(r-40,oy+34),(r,oy+34)],WIRE,2) if closed else None
            _lampsym(h,l+70,oy,on,12); _batt(h,l+150,oy)
            _switch(h,r-40,oy+34,closed)
            h.T(x+150,oy+52,lab,AVM(10),GOLD_D,anchor="ma")
    elif mode=="s3":
        h.ln([(L,y+70),(x+110,y+70)],WIRE,2); h.ln([(x+190,y+70),(R2,y+70)],WIRE,2)
        h.ln([(L,y+70),(L,y+110)],WIRE,2); h.ln([(R2,y+70),(R2,y+110)],WIRE,2); h.ln([(L,y+110),(R2,y+110)],WIRE,2)
        _lampsym(h,(L+R2)/2,y+110,False,13); _batt(h,L+40,y+110)
        # Prüfstück-Lücke
        h.R(x+110,y+56,x+190,y+84,4,fill=WHITE,outline=INK,w=2)
        h.circ(x+110,y+70,3,fill=INK); h.circ(x+190,y+70,3,fill=INK)
        h.T(x+150,y+50,"?",AVB(16),INK,anchor="ma")
        h.T(x+150,y+96,"Material einbauen",AVM(10.5),GOLD_D,anchor="ma")
    elif mode=="s4":
        # Reihe: zwei Lampen hintereinander
        h.ln([(L,T),(R2,T)],WIRE,2); h.ln([(L,B),(R2,B)],WIRE,2); h.ln([(L,T),(L,B)],WIRE,2); h.ln([(R2,T),(R2,B)],WIRE,2)
        _lampsym(h,x+110,T,True,13); _lampsym(h,x+190,T,True,13); _batt(h,(L+R2)/2,B)
    elif mode=="s5":
        # Parallel: zwei eigene Wege
        h.ln([(L,T),(R2,T)],WIRE,2); h.ln([(L,B),(R2,B)],WIRE,2); h.ln([(L,T),(L,B)],WIRE,2)
        h.ln([(x+150,T),(x+150,B)],WIRE,2); h.ln([(x+230,T),(x+230,B)],WIRE,2)
        _lampsym(h,x+150,y+76,True,13); _lampsym(h,x+230,y+76,True,13); _batt(h,L+40,B)

# ---------------- WAERME ----------------
def _cup(h,x,y,col):
    h.R(x,y,x+46,y+40,4,fill=col,outline=INK,w=2); h.R(x+46,y+8,x+58,y+26,6,outline=INK,w=2)
def _heatarrow(h,x0,y,x1):
    h.ln([(x0,y),(x1,y)],HEAT,3); h.ln([(x1,y),(x1-9,y-6)],HEAT,3); h.ln([(x1,y),(x1-9,y+6)],HEAT,3)

def waerme_scene(h,x,y,mode):
    if mode=="w1":
        _cup(h,x+30,y+56,HEAT); h.T(x+53,y+40,"warm",AVM(11),HEAT,anchor="ma")
        _heatarrow(h,x+110,y+76,x+180)
        h.R(x+196,y+40,x+210,y+108,3,fill=METALc,outline=INK,w=2); h.T(x+232,y+34,"kalt",AVM(11),COLD,anchor="ma")
    elif mode=="w2":
        cx=x+150
        h.R(cx-9,y+16,cx+9,y+96,9,fill=WHITE,outline=INK,w=2); h.circ(cx,y+104,16,fill=HEAT,outline=INK,w=2)
        h.R(cx-4,y+52,cx+4,y+104,3,fill=HEAT)  # Flüssigkeitssäule
        for i in range(5): h.ln([(cx+9,y+28+i*14),(cx+16,y+28+i*14)],INK,1)
        h.ln([(cx+30,y+40),(cx+30,y+40)],INK,1)
        h.arrow(cx+24,y+58,cx+24,SUB,2,7) if False else None
        h.T(cx+70,y+50,"warm",AVM(11),HEAT,anchor="la"); h.T(cx+70,y+86,"kalt",AVM(11),COLD,anchor="la")
        h.ln([(cx+66,y+56),(cx+58,y+40)],HEAT,2); h.ln([(cx+66,y+92),(cx+58,y+104)],COLD,2)
    elif mode=="w3":
        # Kugel-Ring: kalt passt durch, warm nicht
        for i,(lab,rr,col) in enumerate([("kalt",15,COLD),("warm",19,HEAT)]):
            cx=x+80+i*130; h.circ(cx,y+64,28,outline=INK,w=3); h.circ(cx,y+64,rr,fill=col,outline=INK,w=2)
            h.T(cx,y+108,lab,AVM(11),col,anchor="ma")
    elif mode=="w4":
        labs=[("fest",COLD,"Eis"),("flüssig",EARTH,"Wasser"),("gasförmig",(150,160,180),"Dampf")]
        for i,(st,col,nm) in enumerate(labs):
            cx=x+56+i*98
            if i==0: h.R(cx-16,y+44,cx+16,y+76,3,fill=col,outline=INK,w=2)
            elif i==1:
                h.ln([(cx-18,y+70),(cx+18,y+70)],INK,2)
                for k in range(4): h.circ(cx-12+k*8,y+62,4,fill=col)
            else:
                for k in range(6): h.circ(cx-16+(k%3)*16,y+48+(k//3)*16,3,outline=col,w=2)
            h.T(cx,y+92,st,AVB(11),INK,anchor="ma"); h.T(cx,y+108,nm,AVM(10),SUB,anchor="ma")
            if i<2: _heatarrow(h,cx+22,y+60,cx+40)
    elif mode=="w5":
        _cup(h,x+118,y+50,HEAT)
        h.R(x+138,y+18,x+150,y+56,3,fill=METALc,outline=INK,w=2)  # Löffel
        for k in range(3): _heatarrow(h,x+152,y+26+k*8,x+170)

# ---------------- SCHALL ----------------
def _wave(h,x0,y0,ln_,amp,cycles,col,steps=64):
    pts=[]
    for i in range(steps+1):
        t=i/steps; px=x0+t*ln_; py=y0+amp*math.sin(t*cycles*2*math.pi); pts.append((px,py))
    for i in range(steps): h.ln([pts[i],pts[i+1]],col,2)

def schall_scene(h,x,y,mode):
    if mode=="sc1":
        # Lineal an Tischkante, das schwingt
        h.R(x+40,y+70,x+170,y+82,2,fill=METALc,outline=INK,w=1.5)
        h.R(x+150,y+64,x+280,y+120,3,fill=(196,170,120),outline=INK,w=1.5)  # Tisch
        for dy in (-16,16): h.ln([(x+40,y+76+dy),(x+70,y+76+dy)],WAVE,1.5)
        h.darrow(x+50,y+76,18,WAVE,2,7)
    elif mode=="sc2":
        _wave(h,x+20,y+50,260,8,4,(150,160,180)); h.T(x+150,y+30,"leise = kleine Schwingung",AVM(10),SUB,anchor="ma")
        _wave(h,x+20,y+104,260,24,4,WAVE); h.T(x+150,y+134,"laut = große Schwingung",AVM(10.5),GOLD_D,anchor="ma")
    elif mode=="sc3":
        _wave(h,x+20,y+50,260,16,2,(150,160,180)); h.T(x+150,y+30,"tief = langsam",AVM(10),SUB,anchor="ma")
        _wave(h,x+20,y+104,260,16,7,WAVE); h.T(x+150,y+134,"hoch = schnell",AVM(10.5),GOLD_D,anchor="ma")
    elif mode=="sc4":
        cx,cy=x+60,y+72; h.circ(cx,cy,10,fill=WAVE)
        for r in (22,38,54,70): h.circ(cx,cy,r,outline=WAVE,w=2)
    elif mode=="sc5":
        # vereinfachtes Ohr
        cx,cy=x+170,y+72
        for r in (18,34,50): h.circ(cx-70,cy,r,outline=WAVE,w=2)  # ankommender Schall
        h.circ(cx,cy,30,outline=INK,w=3); h.circ(cx,cy,14,fill=(230,200,180),outline=INK,w=2)
        h.ln([(cx+22,cy-14),(cx+40,cy-20)],INK,2); h.ln([(cx+26,cy+2),(cx+46,cy+2)],INK,2)

# ---------------- HIMMEL ----------------
def _sunball(h,cx,cy,r=22):
    for a in range(0,360,30):
        dx,dy=math.cos(math.radians(a)),math.sin(math.radians(a))
        h.ln([(cx+dx*(r+3),cy+dy*(r+3)),(cx+dx*(r+11),cy+dy*(r+11))],SUN,2)
    h.circ(cx,cy,r,fill=SUN,outline=(205,150,40),w=2)

def himmel_scene(h,x,y,mode):
    if mode=="h1":
        _sunball(h,x+42,y+70,20)
        ex=x+190; h.circ(ex,y+70,34,fill=EARTH,outline=INK,w=2)
        h.R(ex,y+36,ex+34,y+104,0,fill=SHAD) if False else None
        # Nachtseite andeuten (rechte Hälfte dunkler): overlay dunkler Halbkreis via kleine Kreise
        for ry in range(-30,31,6):
            half=int((34**2-ry**2)**0.5)
            h.ln([(ex,y+70+ry),(ex+half,y+70+ry)],(40,52,80),3)
        for rr in (44,54): h.ln([(x+66,y+70),(ex-36,y+70)],SUN,1)
        h.T(ex-16,y+120,"Tag",AVM(10.5),GOLD_D,anchor="ma"); h.T(ex+20,y+120,"Nacht",AVM(10.5),SUB,anchor="ma")
        h.darrow(ex,y+30,0,SUB) if False else None
    elif mode=="h2":
        _sunball(h,x+150,y+64,18)
        for i,(dx,lab) in enumerate([(-110,"Sommer"),(110,"Winter")]):
            cx=x+150+dx; h.circ(cx,y+64,20,fill=EARTH,outline=INK,w=2)
            h.ln([(cx-16,y+52),(cx+16,y+76)],INK,2)  # geneigte Achse
            h.T(cx,y+100,lab,AVM(11),GOLD_D,anchor="ma")
    elif mode=="h3":
        cx,cy=x+150,y+66; h.circ(cx,cy,20,fill=EARTH,outline=INK,w=2)
        for i,(a,ph) in enumerate([(180,"neu"),(90,"halb"),(0,"voll"),(270,"halb")]):
            mx=cx+58*math.cos(math.radians(a)); my=cy+40*math.sin(math.radians(a))
            h.circ(mx,my,10,fill=MOON,outline=INK,w=1.5)
        _sunball(h,x+16,cy,12)
    elif mode=="h4":
        _sunball(h,x+30,y+68,18)
        mx=x+150; ex=x+230
        h.circ(mx,y+68,10,fill=MOON,outline=INK,w=1.5); h.circ(ex,y+68,24,fill=EARTH,outline=INK,w=2)
        h.ln([(x+48,y+60),(ex-24,y+58)],SUN,1); h.ln([(x+48,y+76),(ex-24,y+78)],SUN,1)
        h.ln([(mx,y+62),(ex-10,y+64)],SHAD,2); h.ln([(mx,y+74),(ex-10,y+72)],SHAD,2)
    elif mode=="h5":
        _sunball(h,x+30,y+68,18)
        ex=x+150; mx=x+245
        h.circ(ex,y+68,24,fill=EARTH,outline=INK,w=2); h.circ(mx,y+68,11,fill=(150,70,60),outline=INK,w=1.5)
        h.ln([(x+48,y+58),(ex-24,y+56)],SUN,1); h.ln([(x+48,y+78),(ex-24,y+80)],SUN,1)
        h.ln([(ex+24,y+60),(mx-8,y+64)],SHAD,2); h.ln([(ex+24,y+76),(mx-8,y+72)],SHAD,2)

# ---------------- MAGNETISMUS ----------------
def _ellipse(h,cx,cy,rx,ry,col,w=1,steps=48):
    pts=[(cx+rx*math.cos(2*math.pi*i/steps),cy+ry*math.sin(2*math.pi*i/steps)) for i in range(steps+1)]
    for i in range(steps): h.ln([pts[i],pts[i+1]],col,w)

def magnet_scene(h,x,y,mode):
    cx=x+150; cy=y+64
    if mode=="m1":
        # Magnet zieht Büroklammer an – ohne Berührung
        h.magnet(x+40,cy-18,90,40)
        h.circ(x+230,cy,3,outline=INK,w=2); h.R(x+224,cy-10,x+236,cy+10,5,outline=(120,128,150),w=2)  # Klammer
        for k in (-8,0,8): h.ln([(x+140,cy+k),(x+215,cy+k*0.4)],GOLD,1)
        h.arrow(x+215,cy,x+200,GOLD_D,2,7)
        h.T(x+150,y+128,"Er zieht an – ohne Berührung",AVM(10.5),GOLD_D,anchor="ma")
    elif mode=="m2":
        h.magnet(x+20,cy-18,80,38)
        # Nagel (angezogen) + Aludose (nicht)
        h.R(x+150,cy-4,x+185,cy+4,2,fill=(150,156,170),outline=INK,w=1.5); h.arrow(x+150,cy,x+118,GOLD_D,2,7)
        h.T(x+167,cy+22,"Eisen: ja",AVM(10),GOLD_D,anchor="ma")
        h.R(x+230,cy-16,x+262,cy+16,4,outline=(150,156,170),w=2); h.T(x+246,cy+30,"Alu: nein",AVM(10),SUB,anchor="ma")
    elif mode=="m3":
        for i,(a,b,ca,cb,att) in enumerate([("N","S",RED,BLUE,True),("N","N",RED,RED,False)]):
            oy=y+18+i*58
            h.pole(x+40,oy,46,32,a,ca); h.pole(x+150,oy,46,32,b,cb)
            if att:
                h.arrow(x+92,oy+16,x+116,INK,2,7); h.arrow(x+144,oy+16,x+120,INK,2,7); h.T(x+250,oy+16,"ziehen an",AVM(10),GOLD_D,anchor="lm")
            else:
                h.arrow(x+92,oy+16,x+70,INK,2,7); h.arrow(x+144,oy+16,x+166,INK,2,7); h.T(x+250,oy+16,"stoßen ab",AVM(10),SUB,anchor="lm")
    elif mode=="m4":
        h.magnet(cx-58,cy-16,116,34)
        for rx,ry in ((78,30),(104,50),(130,68)): _ellipse(h,cx,cy,rx,ry,GOLD,1)
        h.T(x+150,y+128,"Feldlinien: Nord zu Süd",AVM(10.5),GOLD_D,anchor="ma")
    elif mode=="m5":
        h.circ(cx,cy,44,fill=WHITE,outline=INK,w=2)
        for lab,dx,dy in [("N",0,-34),("O",34,0),("S",0,34),("W",-34,0)]:
            h.T(cx+dx,cy+dy-6,lab,AVB(11),INK,anchor="mm")
        h.R(cx-5,cy-30,cx+5,cy,3,fill=RED); h.R(cx-5,cy,cx+5,cy+30,3,fill=(120,128,150))
        h.circ(cx,cy,4,fill=INK)
        h.T(x+150,y+128,"Nadel zeigt nach Norden",AVM(10.5),GOLD_D,anchor="ma")

SCENES={"strom":strom_scene,"waerme":waerme_scene,"schall":schall_scene,"himmel":himmel_scene,"magnetismus":magnet_scene}

if __name__=="__main__":
    from build_final import hp,newp,W,H,ML,CREAM,GLINE,INK,GOLD_D,COP,AVB,Image
    order=[("strom",["s1","s2","s3","s4","s5"]),("waerme",["w1","w2","w3","w4","w5"]),
           ("schall",["sc1","sc2","sc3","sc4","sc5"]),("himmel",["h1","h2","h3","h4","h5"]),("magnetismus",["m1","m2","m3","m4","m5"])]
    for theme,modes in order:
        im,d=newp(CREAM); h=hp(im,d)
        h.tracked(W/2,70,f"TEST · {theme.upper()}",COP(15),GOLD_D,3)
        fn=SCENES[theme]
        for i,m in enumerate(modes):
            r,c=divmod(i,2); bx=ML+c*(W/2-ML+8); by=130+r*230
            h.R(bx,by,bx+330,by+180,10,outline=GLINE,w=1.4); h.T(bx+12,by+8,m,AVB(13),INK)
            fn(h,bx+14,by+30,m)
        im.resize((W,H),Image.LANCZOS).save(f"test_{theme}.png")
        print("saved test_"+theme+".png")
