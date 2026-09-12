# -*- coding: utf-8 -*-
"""Alle Themenzeichnungen fuer das Klasse-5-Physik-Gesamtheft in EINER Datei.
Jede Szene: fn(h,x,y,tid) zeichnet in einen ~300x150 Bereich; tid = Topic-ID (m1.., l1.., s1.., w1.., sc1.., h1..).
Registry SCENES[chapter_id] -> Szenenfunktion.  Nur Zeichen-Primitive aus build_final."""
import math
from build_final import (RED,BLUE,INK,GLINE,GOLD,GOLD_D,GOLD_L,CREAM,WHITE,SUB,AV,AVM,AVB,COP,DIDOT)

SUN=(242,190,70); RAY=(232,182,86); SHADOW=(74,82,104); PEN=(158,166,186); OBJ=(96,102,120); WALLC=(150,150,160)

def _wall(h,x,y0,y1):
    h.ln([(x,y0),(x,y1)],WALLC,3)
    yy=y0
    while yy<y1: h.ln([(x,yy+8),(x+9,yy)],(206,206,212),1); yy+=11

def _sun(h,cx,cy,r=20):
    for a in range(0,360,30):
        dx,dy=math.cos(math.radians(a)),math.sin(math.radians(a))
        h.ln([(cx+dx*(r+4),cy+dy*(r+4)),(cx+dx*(r+13),cy+dy*(r+13))],SUN,2)
    h.circ(cx,cy,r,fill=SUN,outline=(205,150,40),w=2)

def _bulb(h,cx,cy,r=15):
    h.circ(cx,cy,r,fill=(255,244,198),outline=(206,168,60),w=2)
    h.R(cx-6,cy+r-2,cx+6,cy+r+8,2,fill=(150,150,158))
    h.ln([(cx-4,cy+r+2),(cx+4,cy+r+2)],(120,120,128),1); h.ln([(cx-4,cy+r+5),(cx+4,cy+r+5)],(120,120,128),1)

def _eye(h,cx,cy):
    h.circ(cx,cy,12,outline=INK,w=2); h.circ(cx,cy,5,fill=INK)
    h.ln([(cx-15,cy-9),(cx-11,cy-6)],INK,2); h.ln([(cx+15,cy-9),(cx+11,cy-6)],INK,2)

def _obj(h,cx,y0,y1,w=13):
    h.R(cx-w/2,y0,cx+w/2,y1,3,fill=OBJ,outline=(60,64,80),w=1.5)

def _arrowhead(h,x,y,ang,col,s=8):
    for d in (-0.5,0.5):
        h.ln([(x,y),(x-s*math.cos(ang+d),y-s*math.sin(ang+d))],col,2)

def _ray(h,x0,y0,x1,y1,col=RAY,w=2,head=True):
    h.ln([(x0,y0),(x1,y1)],col,w)
    if head:
        ang=math.atan2(y1-y0,x1-x0); _arrowhead(h,x1,y1,ang,col)

def light_scene(h,x,y,mode):
    mode={"l1":"rays","l2":"see","l3":"shadow","l4":"size","l5":"umbra"}.get(mode,mode)
    w,ht=300,150; wallx=x+272; midy=y+ht/2
    if mode=="rays":
        _sun(h,x+42,y+75,20)
        for dy in (-52,-26,0,26,52):
            _ray(h,x+66,y+75,x+250,y+75+dy,RAY,2,True)
    elif mode=="see":
        _bulb(h,x+30,y+34)
        _obj(h,x+150,y+70,y+112,16)
        _eye(h,x+250,y+40)
        # Beide Strahlen treffen sich in EINEM Punkt auf der beleuchteten Oberseite.
        # Vorher endete der erste an der linken, der zweite begann an der rechten
        # Kante - das Licht lief also durch den undurchsichtigen Koerper hindurch.
        _ray(h,x+40,y+44,x+150,y+70,RAY,2,True)
        _ray(h,x+150,y+70,x+238,y+46,RAY,2,True)
        h.circ(x+150,y+70,3,fill=RAY)
    elif mode=="shadow":
        _bulb(h,x+30,y+75)
        # EINE Punktquelle (vorher gingen die beiden Randstrahlen von y+70 und y+80
        # aus), und ein kleineres Objekt - sonst wurde der Schatten hoeher als die
        # Wand und stand oben und unten darueber hinaus.
        sy=y+76; ox=x+150; oy0=y+60; oy1=y+92
        _obj(h,ox,oy0,oy1,14)
        _wall(h,wallx,y+14,y+140)
        def extend(x0,y0,px,py):
            t=(wallx-x0)/(px-x0); return (wallx, y0+t*(py-y0))
        top=extend(x+46,sy,ox-7,oy0); bot=extend(x+46,sy,ox-7,oy1)
        _ray(h,x+46,sy,top[0],top[1],RAY,2,False)
        _ray(h,x+46,sy,bot[0],bot[1],RAY,2,False)
        h.R(wallx-2,top[1],wallx+10,bot[1],0,fill=SHADOW)
        h.T(wallx-6,bot[1]+16,"Schatten",AVM(11),GOLD_D,anchor="ra")
    elif mode=="size":
        _bulb(h,x+26,y+75)
        # Der Gegenstand steht dicht an der Lampe, sein Schatten wird dadurch weit
        # groesser als er selbst - das ist die Aussage der Seite. Vorher war er so
        # gross, dass der Schatten von y-6 bis y+156 lief, also aus dem Rahmen heraus.
        sy=y+75; ox=x+92; oy0=y+68; oy1=y+82
        _obj(h,ox,oy0,oy1,12)
        _wall(h,wallx,y+8,y+146)
        def extend(x0,y0,px,py):
            t=(wallx-x0)/(px-x0); return (wallx, y0+t*(py-y0))
        top=extend(x+34,sy,ox-6,oy0); bot=extend(x+34,sy,ox-6,oy1)
        _ray(h,x+34,sy,top[0],top[1],RAY,2,False)
        _ray(h,x+34,sy,bot[0],bot[1],RAY,2,False)
        h.R(wallx-2,top[1],wallx+10,bot[1],0,fill=SHADOW)
    elif mode=="umbra":
        # ausgedehnte Lichtquelle (Balken)
        # Die gezeichnete Quelle muss genau so hoch sein wie die, mit der der
        # Kernschatten berechnet wird (y+58 bis y+96). Vorher reichte sie von
        # y+35 bis y+117 - mit dieser Quelle gaebe es gar keinen Kernschatten.
        sx=x+24
        for k in range(3): _bulb(h,sx,y+64+k*13,6)
        ox=x+150; oy0=y+58; oy1=y+96
        _obj(h,ox,oy0,oy1,13)
        _wall(h,wallx,y+8,y+146)
        # Kernschatten (von beiden Quellenraendern), Halbschatten aussen
        def extend(x0,y0,px,py):
            t=(wallx-x0)/(px-x0); return y0+t*(py-y0)
        uTop=extend(sx,y+58,ox-6,oy0); uBot=extend(sx,y+96,ox-6,oy1)
        pTop=extend(sx,y+96,ox-6,oy0); pBot=extend(sx,y+58,ox-6,oy1)
        h.R(wallx-2,pTop,wallx+11,pBot,0,fill=PEN)
        h.R(wallx-2,uTop,wallx+11,uBot,0,fill=SHADOW)
        h.T(wallx-6,pBot+16,"Kern + Halbschatten",AVM(10),GOLD_D,anchor="ra")


WIRE=(70,78,100); LAMP=(255,224,120); LAMPOFF=(214,214,206); BAT=(90,100,124)
SUN=(242,190,70); EARTH=(70,130,190); MOON=(206,206,200); SHAD=(60,66,86)
HEAT=(214,96,60); COLD=(90,140,200); WAVE=(84,56,116); METALc=(150,156,170)

# ---------------- STROM / SCHALTZEICHEN ----------------
# Saubere, wiederverwendbare Schaltzeichen (auch von der Legende-Seite genutzt).
def sym_batt(h,cx,cy,labels=True,vert=False):
    """Batterie: lange dünne Platte = +, kurze dicke = –.
       vert=True setzt dieselbe Batterie auf einen senkrechten Draht."""
    if vert:
        ly=cy-8; sy=cy+8                          # Platten quer zum senkrechten Draht
        h.ln([(cx-16,ly),(cx+16,ly)],INK,2.5)     # + : lang, dünn
        h.ln([(cx-9,sy),(cx+9,sy)],INK,6)         # – : kurz, dick
        if labels:
            h.T(cx+30,ly-7,"+",AVB(15),INK,anchor="ma")
            h.T(cx+30,sy-7,"–",AVB(15),INK,anchor="ma")
        return
    lx=cx-8; sx=cx+8
    h.ln([(lx,cy-16),(lx,cy+16)],INK,2.5)   # + : lang, dünn
    h.ln([(sx,cy-9),(sx,cy+9)],INK,6)        # – : kurz, dick
    if labels:
        h.T(lx-2,cy-30,"+",AVB(15),INK,anchor="ma")
        h.T(sx+2,cy-30,"–",AVB(15),INK,anchor="ma")
def sym_lamp(h,cx,cy,on=False,r=14):
    h.circ(cx,cy,r,fill=(LAMP if on else WHITE),outline=INK,w=2)
    dd=r*0.72
    h.ln([(cx-dd,cy-dd),(cx+dd,cy+dd)],INK,2); h.ln([(cx-dd,cy+dd),(cx+dd,cy-dd)],INK,2)
    if on:
        for a in range(0,360,45):
            ux,uy=math.cos(math.radians(a)),math.sin(math.radians(a))
            h.ln([(cx+ux*(r+4),cy+uy*(r+4)),(cx+ux*(r+10),cy+uy*(r+10))],SUN,2)
def sym_switch(h,cx,cy,closed=True,vert=False,ln=30):
    h2=ln/2
    if vert:
        a=(cx,cy-h2); b=(cx,cy+h2)
        h.circ(a[0],a[1],3,fill=INK); h.circ(b[0],b[1],3,fill=INK)
        h.ln([a,b],INK,2.5) if closed else h.ln([b,(cx+14,cy-h2+3)],INK,2.5)
    else:
        a=(cx-h2,cy); b=(cx+h2,cy)
        h.circ(a[0],a[1],3,fill=INK); h.circ(b[0],b[1],3,fill=INK)
        h.ln([a,b],INK,2.5) if closed else h.ln([a,(cx+h2-3,cy-14)],INK,2.5)
def sym_motor(h,cx,cy,r=15):
    h.circ(cx,cy,r,fill=WHITE,outline=INK,w=2); h.T(cx,cy+1,"M",AVB(15),INK,anchor="mm")
def sym_buzzer(h,cx,cy,r=14):
    pts=[(cx+r*math.cos(math.radians(a)),cy-r*math.sin(math.radians(a))) for a in range(0,181,20)]
    for i in range(len(pts)-1): h.ln([pts[i],pts[i+1]],INK,2)
    h.ln([(cx-r,cy),(cx+r,cy)],INK,2)

def strom_scene(h,x,y,mode):
    L,R,T,B=x+22,x+278,y+26,y+116; cx=(L+R)/2; cy=(T+B)/2
    if mode=="s1":
        # geschlossener Kreis: Lampe oben, Schalter rechts (geschlossen), Batterie unten
        h.ln([(L,T),(cx-16,T)],WIRE,2); h.ln([(cx+16,T),(R,T)],WIRE,2)
        h.ln([(L,T),(L,B)],WIRE,2)
        h.ln([(R,T),(R,cy-16)],WIRE,2); h.ln([(R,cy+16),(R,B)],WIRE,2)
        h.ln([(L,B),(cx-8,B)],WIRE,2); h.ln([(cx+8,B),(R,B)],WIRE,2)
        sym_lamp(h,cx,T,on=True); sym_switch(h,R,cy,closed=True,vert=True); sym_batt(h,cx,B)
    elif mode=="s2":
        for i,(closed,lab) in enumerate([(True,"Kreis geschlossen"),(False,"Kreis offen")]):
            lx=x+18+i*152; rx=lx+108; tt=y+22; bb=y+92; ccx=(lx+rx)/2; ccy=(tt+bb)/2
            h.ln([(lx,tt),(ccx-13,tt)],WIRE,2); h.ln([(ccx+13,tt),(rx,tt)],WIRE,2)
            h.ln([(lx,tt),(lx,bb)],WIRE,2)
            h.ln([(rx,tt),(rx,ccy-13)],WIRE,2); h.ln([(rx,ccy+13),(rx,bb)],WIRE,2)
            h.ln([(lx,bb),(ccx-7,bb)],WIRE,2); h.ln([(ccx+7,bb),(rx,bb)],WIRE,2)
            sym_lamp(h,ccx,tt,on=closed,r=11); sym_switch(h,rx,ccy,closed=closed,vert=True,ln=26); sym_batt(h,ccx,bb,labels=False)
            h.T(ccx,bb+20,lab,AVB(11),(GOLD_D if closed else SUB),anchor="ma")
            h.T(ccx,bb+37,("Lampe leuchtet" if closed else "Lampe bleibt aus"),AVM(10),SUB,anchor="ma")
    elif mode=="s3":
        # Leiter-Test: oben eine Prüf-Lücke für Material, Lampe rechts, Batterie unten
        gx0=x+112; gx1=x+188
        h.ln([(L,T),(gx0,T)],WIRE,2); h.ln([(gx1,T),(R,T)],WIRE,2)
        h.ln([(L,T),(L,B)],WIRE,2); h.ln([(R,T),(R,cy-14)],WIRE,2); h.ln([(R,cy+14),(R,B)],WIRE,2)
        h.ln([(L,B),(cx-8,B)],WIRE,2); h.ln([(cx+8,B),(R,B)],WIRE,2)
        sym_lamp(h,R,cy,on=False,r=13); sym_batt(h,cx,B)
        h.circ(gx0,T,3,fill=INK); h.circ(gx1,T,3,fill=INK)
        h.R(gx0,T-14,gx1,T+14,4,fill=WHITE,outline=INK,w=1.8); h.T((gx0+gx1)/2,T+1,"?",AVB(15),INK,anchor="mm")
        h.T(cx,B+22,"Material einlegen und prüfen",AVM(10.5),GOLD_D,anchor="ma")
    elif mode=="s6":
        # Der Schalter unterbricht an JEDER Stelle: zweimal derselbe Kreis, der Schalter
        # einmal rechts und einmal unten - beide offen, beide Lampen aus. Genau das ist
        # der Merksatz der Seite. Zwei geschlossene Kreise wuerden die Frage nicht
        # beantworten ("Wovon haengt es ab, ob dein Schalter das Laempchen ausmacht?").
        for i,lab in enumerate(["Schalter rechts","Schalter unten"]):
            lx=x+18+i*152; rx=lx+108; tt=y+22; bb=y+92; ccx=(lx+rx)/2; ccy=(tt+bb)/2
            h.ln([(lx,tt),(ccx-13,tt)],WIRE,2); h.ln([(ccx+13,tt),(rx,tt)],WIRE,2)
            h.ln([(lx,tt),(lx,bb)],WIRE,2)
            sym_lamp(h,ccx,tt,on=False,r=11)
            if i==0:
                h.ln([(rx,tt),(rx,ccy-13)],WIRE,2); h.ln([(rx,ccy+13),(rx,bb)],WIRE,2)
                sym_switch(h,rx,ccy,closed=False,vert=True,ln=26)
                h.ln([(lx,bb),(ccx-7,bb)],WIRE,2); h.ln([(ccx+7,bb),(rx,bb)],WIRE,2)
                sym_batt(h,ccx,bb,labels=False)
            else:
                h.ln([(rx,tt),(rx,bb)],WIRE,2)
                bx2=lx+30; sx2=rx-28
                h.ln([(lx,bb),(bx2-7,bb)],WIRE,2); h.ln([(bx2+7,bb),(sx2-13,bb)],WIRE,2)
                h.ln([(sx2+13,bb),(rx,bb)],WIRE,2)
                sym_batt(h,bx2,bb,labels=False); sym_switch(h,sx2,bb,closed=False,ln=26)
            h.T(ccx,bb+20,lab,AVB(11),SUB,anchor="ma")
            h.T(ccx,bb+37,"Schalter offen – Lampe aus",AVM(10),SUB,anchor="ma")
    elif mode=="s4":
        # Reihenschaltung: zwei Lampen hintereinander in EINEM Kreis
        l1=cx-46; l2=cx+46
        h.ln([(L,T),(l1-16,T)],WIRE,2); h.ln([(l1+16,T),(l2-16,T)],WIRE,2); h.ln([(l2+16,T),(R,T)],WIRE,2)
        h.ln([(L,T),(L,B)],WIRE,2); h.ln([(R,T),(R,B)],WIRE,2)
        h.ln([(L,B),(cx-8,B)],WIRE,2); h.ln([(cx+8,B),(R,B)],WIRE,2)
        sym_lamp(h,l1,T,on=True,r=13); sym_lamp(h,l2,T,on=True,r=13); sym_batt(h,cx,B)
        h.T(cx,B+22,"Reihenschaltung – ein Weg",AVM(10.5),GOLD_D,anchor="ma")
    elif mode=="s5":
        # Parallelschaltung, kanonisch: genau DREI Senkrechte zwischen oberem und
        # unterem Draht - Batterie links, Lampe Mitte, Lampe rechts. Jede zusaetzliche
        # reine Drahtsenkrechte wuerde alles ueberbruecken, was zwischen denselben
        # beiden Draehten haengt, und damit Batterie bzw. Lampen kurzschliessen.
        h.ln([(L,T),(R,T)],WIRE,2); h.ln([(L,B),(R,B)],WIRE,2)          # oberer + unterer Draht
        # Die Luecke muss GENAU an den Batterieplatten enden. sym_batt(vert=True) legt
        # sie auf cy-8 und cy+8; mit +-16 klaffte der Kreis an der Batterie sichtbar auf.
        h.ln([(L,T),(L,cy-8)],WIRE,2); h.ln([(L,cy+8),(L,B)],WIRE,2)    # linke Zuleitung bis an die Platten
        sym_batt(h,L,cy,vert=True)
        for bb in (cx,R):                                                # die beiden Stromwege
            h.ln([(bb,T),(bb,cy-13)],WIRE,2); h.ln([(bb,cy+13),(bb,B)],WIRE,2); sym_lamp(h,bb,cy,on=True,r=12)
        h.T(cx,B+22,"Parallelschaltung – zwei Wege",AVM(10.5),GOLD_D,anchor="ma")

# ---------------- WAERME ----------------
def _cup(h,x,y,col):
    h.R(x,y,x+46,y+40,4,fill=col,outline=INK,w=2); h.R(x+46,y+8,x+58,y+26,6,outline=INK,w=2)
def _heatarrow(h,x0,y,x1):
    h.ln([(x0,y),(x1,y)],HEAT,3); h.ln([(x1,y),(x1-9,y-6)],HEAT,3); h.ln([(x1,y),(x1-9,y+6)],HEAT,3)
def _heatarrow_v(h,x,y0,y1):
    """Waermepfeil laengs eines senkrechten Koerpers; y1 ist die Spitze."""
    h.ln([(x,y0),(x,y1)],HEAT,3); d=9 if y1>y0 else -9
    h.ln([(x,y1),(x-6,y1-d)],HEAT,3); h.ln([(x,y1),(x+6,y1-d)],HEAT,3)

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
        # Kugel-Ring: kalt passt durch, warm nicht. Vorher war die warme Kugel mit
        # r=19 kleiner als die Ringoeffnung (r=28) und sass konzentrisch mitten
        # darin - die Pointe des Versuchs war im Bild schlicht nicht zu sehen.
        for i,(lab,rr,dy,zus,col) in enumerate([("kalt",16,0,"passt durch",COLD),
                                                ("warm",31,-30,"passt nicht mehr",HEAT)]):
            cx=x+80+i*130
            h.circ(cx,y+72,28,outline=INK,w=3)                  # Ring
            h.circ(cx,y+72+dy,rr,fill=col,outline=INK,w=2)      # Kugel
            h.T(cx,y+112,lab,AVB(11),col,anchor="ma")
            h.T(cx,y+128,zus,AVM(10),SUB,anchor="ma")
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
        # Waermeleitung laeuft LAENGS des Loeffels vom heissen Ende im Getraenk
        # hinauf zum Griff ("darum wird der Loeffelgriff heiss"). Vorher zeigten die
        # drei Pfeile waagerecht aus dem Metall in die Luft, und der Loeffel tauchte
        # nur 6 Einheiten ein, ohne dass eine Fluessigkeit gezeichnet war.
        _cup(h,x+112,y+52,HEAT)
        h.ln([(x+117,y+64),(x+157,y+64)],(240,158,116),5)          # Getraenk
        h.R(x+130,y+14,x+142,y+84,3,fill=METALc,outline=INK,w=2)   # Loeffel, tief eingetaucht
        for yy in (y+72,y+54,y+36): _heatarrow_v(h,x+136,yy,yy-14)
        h.T(x+168,y+30,"Griff wird heiss",AVM(10),GOLD_D,anchor="la")

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
        # Die Erdachse zeigt das ganze Jahr in dieselbe Richtung - hier mit dem
        # Nordende nach links. Damit ist der Nordpol bei der LINKEN Erde von der
        # Sonne weggeneigt (Winter) und bei der rechten zu ihr hin (Sommer).
        # Die Beschriftungen standen vorher genau andersherum, gegen den Merksatz.
        _sunball(h,x+150,y+64,18)
        for dx,lab in ((-110,"Winter"),(110,"Sommer")):
            cx=x+150+dx; h.circ(cx,y+64,20,fill=EARTH,outline=INK,w=2)
            h.ln([(cx-20,y+49),(cx+20,y+79)],INK,2)              # geneigte Achse, ueber die Kugel hinaus
            h.T(cx-26,y+45,"N",AVB(10),INK,anchor="ma")
            h.T(cx,y+104,lab,AVB(11),GOLD_D,anchor="ma")
    elif mode=="h3":
        # Die Sonne steht links, also ist bei JEDEM Mond die rechte Haelfte dunkel.
        # Vorher waren alle vier einfarbig hell gezeichnet - eine Phasenzeichnung
        # ohne Phasen. Die Beschriftungen wurden zwar zugewiesen, aber nie gesetzt.
        cx,cy=x+150,y+66; h.circ(cx,cy,20,fill=EARTH,outline=INK,w=2)
        _sunball(h,x+16,cy,12)
        for a,ph in ((180,"Neumond"),(90,"Halbmond"),(0,"Vollmond"),(270,"Halbmond")):
            mx=cx+58*math.cos(math.radians(a)); my=cy+40*math.sin(math.radians(a))
            h.circ(mx,my,10,fill=MOON,outline=INK,w=1.5)
            for ry in range(-8,9,2):                              # Nachtseite des Mondes
                half=int((9**2-ry**2)**0.5)
                h.ln([(mx,my+ry),(mx+half,my+ry)],SHAD,2)
            h.T(cx+112*math.cos(math.radians(a)),cy+64*math.sin(math.radians(a))-6,
                ph,AVM(9.5),GOLD_D,anchor="mm")
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



SCENES={"magnetismus":magnet_scene,"licht":light_scene,"strom":strom_scene,"waerme":waerme_scene,"schall":schall_scene,"himmel":himmel_scene}

if __name__=="__main__":
    from build_final import hp,newp,W,H,ML,CREAM,GLINE,INK,GOLD_D,COP,AVB,Image
    order=[("magnetismus",["m1","m2","m3","m4","m5"]),("licht",["l1","l2","l3","l4","l5"]),
           ("strom",["s1","s2","s3","s4","s5"]),("waerme",["w1","w2","w3","w4","w5"]),
           ("schall",["sc1","sc2","sc3","sc4","sc5"]),("himmel",["h1","h2","h3","h4","h5"])]
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
