# -*- coding: utf-8 -*-
"""Themenzeichnungen 'Licht & Schatten' fuer das Klasse-5-Physik-Gesamtheft.
Jede Szene wird in einen Bereich (x,y,w=300,h=150) oben rechts auf der Forscherseite gezeichnet.
Nutzt die Zeichen-Helfer aus build_final (h-Objekt)."""
import math
from build_final import hp, newp, W, H, ML, INK, GLINE, CREAM, GOLD_D, AV, AVB, AVM, COP, sc, Image

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
    w,ht=300,150; wallx=x+272; midy=y+ht/2
    if mode=="rays":
        _sun(h,x+42,y+75,20)
        for dy in (-52,-26,0,26,52):
            _ray(h,x+66,y+75,x+250,y+75+dy,RAY,2,True)
    elif mode=="see":
        _bulb(h,x+30,y+34)
        _obj(h,x+150,y+70,y+112,16)
        _eye(h,x+250,y+40)
        _ray(h,x+40,y+44,x+142,y+82,RAY,2,True)
        _ray(h,x+158,y+80,x+238,y+46,RAY,2,True)
    elif mode=="shadow":
        _bulb(h,x+30,y+75)
        ox=x+150; oy0=y+45; oy1=y+108
        _obj(h,ox,oy0,oy1,14)
        _wall(h,wallx,y+14,y+140)
        # Strahlen, die oben/unten am Objekt vorbei zur Wand laufen
        def extend(x0,y0,px,py):
            t=(wallx-x0)/(px-x0); return (wallx, y0+t*(py-y0))
        top=extend(x+40,y+70,ox-7,oy0); bot=extend(x+40,y+80,ox-7,oy1)
        _ray(h,x+40,y+70,top[0],top[1],RAY,2,False)
        _ray(h,x+40,y+80,bot[0],bot[1],RAY,2,False)
        h.R(wallx-2,top[1],wallx+10,bot[1],0,fill=SHADOW)
        h.T(wallx-6,bot[1]+16,"Schatten",AVM(11),GOLD_D,anchor="ra")
    elif mode=="size":
        _bulb(h,x+26,y+75)
        ox=x+92; oy0=y+55; oy1=y+95
        _obj(h,ox,oy0,oy1,12)
        _wall(h,wallx,y+8,y+146)
        def extend(x0,y0,px,py):
            t=(wallx-x0)/(px-x0); return (wallx, y0+t*(py-y0))
        top=extend(x+34,y+72,ox-6,oy0); bot=extend(x+34,y+78,ox-6,oy1)
        _ray(h,x+34,y+72,top[0],top[1],RAY,2,False)
        _ray(h,x+34,y+78,bot[0],bot[1],RAY,2,False)
        h.R(wallx-2,top[1],wallx+10,bot[1],0,fill=SHADOW)
    elif mode=="umbra":
        # ausgedehnte Lichtquelle (Balken)
        sx=x+24
        for k in range(5): _bulb(h,sx,y+42+k*17,7)
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

if __name__=="__main__":
    im,d=newp(CREAM); h=hp(im,d)
    h.tracked(W/2,70,"TEST · LICHT & SCHATTEN – SZENEN",COP(15),GOLD_D,3)
    modes=[("rays","Lichtquellen & Ausbreitung"),("see","Sehen"),("shadow","Schatten entsteht"),
           ("size","Schattengröße"),("umbra","Kern- & Halbschatten")]
    for i,(m,lab) in enumerate(modes):
        r,c=divmod(i,2); bx=ML+c*(W/2-ML+8); by=140+r*230
        h.R(bx,by,bx+330,by+180,10,outline=GLINE,w=1.4)
        h.T(bx+12,by+10,lab,AVB(14),INK)
        light_scene(h,bx+14,by+34,m)
    im.resize((W,H),Image.LANCZOS).save("test_licht.png")
    print("saved test_licht.png")
